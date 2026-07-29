import type { AchievementDef, GameState, WorldDef } from './types.ts';
import { elapsedMs } from './timer.ts';

/** Does the state satisfy this achievement right now? Pure. */
export function achievementMet(
  def: AchievementDef,
  state: GameState,
  world: WorldDef,
  now: number,
): boolean {
  switch (def.check) {
    case 'worldComplete':
      return state.status === 'won';
    case 'noHints':
      return (
        state.status === 'won' &&
        Object.values(state.puzzles).every((p) => p.hintsUsed === 0)
      );
    case 'timeUnder':
      return (
        state.status === 'won' &&
        state.timer.mode === 'challenge' &&
        (state.timer.finishedInMs ?? elapsedMs(state.timer, now)) < def.ms
      );
    case 'allRoomsVisited':
      return Object.keys(world.rooms).every((r) => state.visitedRooms[r]);
    case 'allJournal':
      return Object.keys(world.journal).every((j) =>
        state.journal.some((e) => e.id === j),
      );
    case 'secretFound':
      return state.secretsFound.includes(def.secretId);
    case 'puzzleFirstTry': {
      const ps = state.puzzles[def.puzzle];
      return ps?.solved === true && ps.attempts === 0;
    }
  }
}

/**
 * Evaluate all achievements, returning the state with any newly earned ones
 * stamped, plus the list of new ids (for toasts).
 */
export function evaluateAchievements(
  state: GameState,
  world: WorldDef,
  now: number,
): { state: GameState; newlyUnlocked: string[] } {
  const newlyUnlocked: string[] = [];
  let unlocked = state.achievementsUnlocked;
  for (const def of world.achievements) {
    if (unlocked[def.id] !== undefined) continue;
    if (achievementMet(def, state, world, now)) {
      if (unlocked === state.achievementsUnlocked) unlocked = { ...unlocked };
      unlocked[def.id] = now;
      newlyUnlocked.push(def.id);
    }
  }
  if (newlyUnlocked.length === 0) return { state, newlyUnlocked };
  return { state: { ...state, achievementsUnlocked: unlocked }, newlyUnlocked };
}

/** True when all lore-counting journal entries have been found (epilogue bonus). */
export function allLoreFound(state: GameState, world: WorldDef): boolean {
  return Object.values(world.journal)
    .filter((j) => j.countsTowardLore)
    .every((j) => state.journal.some((e) => e.id === j.id));
}
