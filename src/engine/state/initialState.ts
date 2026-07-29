import type { GameState, WorldDef } from '../types.ts';
import { initialTopology } from '../topology.ts';

/** Fresh game state for a world. Entry-room visit effects are applied by the reducer. */
export function initialState(
  world: WorldDef,
  mode: 'relaxed' | 'challenge',
  at: number,
): GameState {
  const puzzles: GameState['puzzles'] = {};
  for (const id of Object.keys(world.puzzles)) {
    puzzles[id] = { solved: false, hintsUsed: 0, attempts: 0 };
  }
  return {
    schemaVersion: 1,
    worldId: world.id,
    status: 'playing',
    currentRoom: world.entryRoom,
    visitedRooms: {},
    topology: initialTopology(world),
    flags: {},
    inventory: [],
    puzzles,
    journal: [],
    appliedShifts: [],
    secretsFound: [],
    timer: { mode, startedAt: at, pausedMs: 0, pausedSince: null },
    achievementsUnlocked: {},
  };
}
