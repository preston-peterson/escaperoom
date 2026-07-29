import type {
  GameAction,
  GameState,
  HotspotDef,
  ReducerNotes,
  WorldDef,
} from '../types.ts';
import { applyEffects, condHolds, evalCondition } from './conditions.ts';
import { initialState } from './initialState.ts';
import { otherEnd } from '../topology.ts';
import { validate } from '../puzzles/validators.ts';
import { evaluateAchievements } from '../achievements.ts';
import { elapsedMs, pauseTimer, resumeTimer } from '../timer.ts';

export interface ReduceResult {
  state: GameState;
  notes: ReducerNotes;
}

function emptyNotes(): ReducerNotes {
  return {
    narrations: [],
    sounds: [],
    unlockedAchievements: [],
    journalUnlocks: [],
  };
}

function findHotspot(
  state: GameState,
  world: WorldDef,
  hotspotId: string,
): HotspotDef | undefined {
  const room = world.rooms[state.currentRoom];
  if (!room) return undefined;
  const hs = room.scene.hotspots.find((h) => h.id === hotspotId);
  if (!hs) return undefined;
  if (!condHolds(hs.if, state)) return undefined;
  if (hs.hideWhen && evalCondition(hs.hideWhen, state)) return undefined;
  return hs;
}

/** Enter a room: mark visited, run first-enter effects. */
function visitRoom(
  state: GameState,
  world: WorldDef,
  roomId: string,
  notes: ReducerNotes,
  at: number,
): GameState {
  let next: GameState = { ...state, currentRoom: roomId };
  if (!next.visitedRooms[roomId]) {
    next = { ...next, visitedRooms: { ...next.visitedRooms, [roomId]: true } };
    const fx = world.rooms[roomId]?.onFirstEnter;
    if (fx) next = applyEffects(next, fx, world, notes, at);
  }
  return next;
}

/**
 * The pure core. Every game rule lives here; the UI only dispatches actions
 * and renders state. `notes` carries per-dispatch cues for UI/audio
 * subscribers and is never persisted.
 */
export function reduce(
  state: GameState,
  action: GameAction,
  world: WorldDef,
): ReduceResult {
  const notes = emptyNotes();

  if (action.type === 'LOAD_STATE') {
    return { state: action.state, notes };
  }
  if (action.type === 'START_GAME') {
    let next = initialState(world, action.mode, action.at);
    next = visitRoom(next, world, world.entryRoom, notes, action.at);
    return { state: next, notes };
  }

  // Timer control works while playing regardless of overlays.
  if (action.type === 'PAUSE') {
    return { state: { ...state, timer: pauseTimer(state.timer, action.at) }, notes };
  }
  if (action.type === 'RESUME') {
    return { state: { ...state, timer: resumeTimer(state.timer, action.at) }, notes };
  }

  if (state.status !== 'playing') {
    return { state, notes };
  }

  let next = state;

  switch (action.type) {
    case 'MOVE': {
      const p = next.topology[action.passage];
      if (!p || (p.from !== next.currentRoom && p.to !== next.currentRoom)) break;
      if (!p.open) {
        notes.blockedMove = action.passage;
        const text = world.passages[action.passage]?.closedText;
        if (text) notes.narrations.push(text);
        notes.sounds.push('thud');
        break;
      }
      next = visitRoom(next, world, otherEnd(p, next.currentRoom), notes, action.at);
      break;
    }

    case 'INTERACT': {
      const hs = findHotspot(next, world, action.hotspot);
      if (!hs) break;
      switch (hs.action.type) {
        case 'inspect':
          notes.narrations.push(hs.action.text);
          if (hs.action.effects) {
            next = applyEffects(next, hs.action.effects, world, notes, action.at);
          }
          break;
        case 'pickup':
          if (!next.inventory.includes(hs.action.item)) {
            next = { ...next, inventory: [...next.inventory, hs.action.item] };
            notes.pickedUpItem = hs.action.item;
            notes.sounds.push('pickup');
            const item = world.items[hs.action.item];
            if (item) notes.narrations.push(`Taken: ${item.name}.`);
          }
          break;
        case 'navigate': {
          const p = next.topology[hs.action.passage];
          if (!p || (p.from !== next.currentRoom && p.to !== next.currentRoom)) break;
          if (!p.open) {
            notes.blockedMove = hs.action.passage;
            const text = world.passages[hs.action.passage]?.closedText;
            if (text) notes.narrations.push(text);
            notes.sounds.push('thud');
            break;
          }
          next = visitRoom(next, world, otherEnd(p, next.currentRoom), notes, action.at);
          break;
        }
        case 'puzzle':
        case 'useItem':
          // Opening a puzzle overlay is UI state; useItem arrives as USE_ITEM.
          break;
      }
      break;
    }

    case 'USE_ITEM': {
      const hs = findHotspot(next, world, action.hotspot);
      if (!hs || hs.action.type !== 'useItem') break;
      if (!next.inventory.includes(action.item)) break;
      if (hs.action.accepts.includes(action.item)) {
        next = applyEffects(next, hs.action.effects, world, notes, action.at);
      } else {
        notes.narrations.push(hs.action.wrongItemText);
        notes.sounds.push('thud');
      }
      break;
    }

    case 'SUBMIT_PUZZLE': {
      const def = world.puzzles[action.puzzle];
      const ps = next.puzzles[action.puzzle];
      if (!def || !ps || ps.solved) break;
      if (!condHolds(def.if, next)) break;
      const result = validate(def, action.submission);
      if (result.correct) {
        next = {
          ...next,
          puzzles: {
            ...next.puzzles,
            [action.puzzle]: { ...ps, solved: true, solvedAt: action.at },
          },
        };
        notes.solvedPuzzle = action.puzzle;
        notes.sounds.push('chime');
        next = applyEffects(next, def.onSolve, world, notes, action.at);
        if (action.puzzle === world.finalPuzzle) {
          next = {
            ...next,
            status: 'won',
            timer: {
              ...next.timer,
              finishedInMs: elapsedMs(next.timer, action.at),
            },
          };
        }
      } else {
        next = {
          ...next,
          puzzles: {
            ...next.puzzles,
            [action.puzzle]: { ...ps, attempts: ps.attempts + 1 },
          },
        };
        if (result.feedback) notes.narrations.push(result.feedback);
        notes.sounds.push('thud');
      }
      break;
    }

    case 'REVEAL_HINT': {
      const ps = next.puzzles[action.puzzle];
      if (!ps || ps.solved) break;
      if (action.tier > ps.hintsUsed) {
        next = {
          ...next,
          puzzles: {
            ...next.puzzles,
            [action.puzzle]: { ...ps, hintsUsed: action.tier },
          },
        };
      }
      break;
    }

    case 'TIME_EXPIRED': {
      if (next.timer.mode === 'challenge') {
        next = { ...next, status: 'timeExpired' };
      }
      break;
    }
  }

  const evaluated = evaluateAchievements(next, world, action.at);
  notes.unlockedAchievements = evaluated.newlyUnlocked;
  return { state: evaluated.state, notes };
}
