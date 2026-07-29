import { create } from 'zustand';
import type { GameAction, GameState, ReducerNotes, WorldDef } from '../types.ts';
import { reduce } from './reducer.ts';

/**
 * The one game store: serializable state + pure-reducer dispatch.
 * Subscribers (audio, autosave, toasts) watch `seq` and read `lastNotes`
 * and `lastAction` to react to each dispatch exactly once.
 */
export interface GameStore {
  world: WorldDef | null;
  state: GameState | null;
  lastNotes: ReducerNotes | null;
  lastAction: GameAction | null;
  /** Increments on every dispatch so identical notes still notify. */
  seq: number;
  setWorld: (world: WorldDef) => void;
  clearGame: () => void;
  dispatch: (action: GameAction) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  world: null,
  state: null,
  lastNotes: null,
  lastAction: null,
  seq: 0,
  setWorld: (world) => set({ world }),
  clearGame: () => set({ state: null, lastNotes: null, lastAction: null }),
  dispatch: (action) => {
    const { world, state, seq } = get();
    if (!world) return;
    if (state === null && action.type !== 'START_GAME' && action.type !== 'LOAD_STATE') {
      return;
    }
    const base: GameState =
      state ?? ({ worldId: world.id } as GameState); // START_GAME/LOAD_STATE ignore prior state
    const result = reduce(base, action, world);
    set({
      state: result.state,
      lastNotes: result.notes,
      lastAction: action,
      seq: seq + 1,
    });
  },
}));

/** Convenience for non-React modules (audio engine, persistence). */
export const gameStore = useGameStore;
