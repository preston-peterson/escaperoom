import type {
  Condition,
  EffectDef,
  GameState,
  ReducerNotes,
  WorldDef,
} from '../types.ts';
import { applyShift } from '../topology.ts';

/** Evaluate a Condition against the current game state. Pure. */
export function evalCondition(cond: Condition, state: GameState): boolean {
  if ('flag' in cond) return state.flags[cond.flag] === true;
  if ('solved' in cond) return state.puzzles[cond.solved]?.solved === true;
  if ('hasItem' in cond) return state.inventory.includes(cond.hasItem);
  if ('visited' in cond) return state.visitedRooms[cond.visited] === true;
  if ('not' in cond) return !evalCondition(cond.not, state);
  if ('all' in cond) return cond.all.every((c) => evalCondition(c, state));
  if ('any' in cond) return cond.any.some((c) => evalCondition(c, state));
  return false;
}

/** A layer/hotspot with no condition is always live. */
export function condHolds(cond: Condition | undefined, state: GameState): boolean {
  return cond === undefined || evalCondition(cond, state);
}

/**
 * Apply a list of effects to the state, returning a new state.
 * Narrations/sounds/etc. are recorded in `notes` for UI/audio subscribers.
 * Pure aside from mutating the passed-in `notes` accumulator.
 */
export function applyEffects(
  state: GameState,
  effects: EffectDef[],
  world: WorldDef,
  notes: ReducerNotes,
  at: number,
): GameState {
  let next = state;
  for (const fx of effects) {
    switch (fx.type) {
      case 'setFlag':
        if (!next.flags[fx.flag]) {
          next = { ...next, flags: { ...next.flags, [fx.flag]: true } };
        }
        break;
      case 'giveItem':
        if (!next.inventory.includes(fx.item)) {
          next = { ...next, inventory: [...next.inventory, fx.item] };
        }
        break;
      case 'removeItem':
        next = { ...next, inventory: next.inventory.filter((i) => i !== fx.item) };
        break;
      case 'unlockJournal':
        if (!next.journal.some((j) => j.id === fx.entry)) {
          next = {
            ...next,
            journal: [...next.journal, { id: fx.entry, unlockedAt: at }],
          };
          notes.journalUnlocks.push(fx.entry);
        }
        break;
      case 'triggerShift': {
        const shift = world.shifts[fx.shift];
        if (shift && !next.appliedShifts.includes(fx.shift)) {
          next = {
            ...next,
            topology: applyShift(next.topology, shift),
            appliedShifts: [...next.appliedShifts, fx.shift],
          };
          notes.shift = fx.shift;
          notes.narrations.push(shift.narration);
          notes.sounds.push('rumble');
        }
        break;
      }
      case 'markSecret':
        if (!next.secretsFound.includes(fx.secret)) {
          next = { ...next, secretsFound: [...next.secretsFound, fx.secret] };
          notes.sounds.push('secret');
        }
        break;
      case 'narrate':
        notes.narrations.push(fx.text);
        break;
      case 'sound':
        notes.sounds.push(fx.cue);
        break;
    }
  }
  return next;
}
