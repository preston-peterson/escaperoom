import { describe, expect, it } from 'vitest';
import type { KVStore } from './persistence.ts';
import {
  clearSave,
  loadGame,
  loadSettings,
  recordCompletion,
  saveGame,
  saveSettings,
} from './persistence.ts';
import { reduce } from '../state/reducer.ts';
import { miniWorld } from '../__fixtures__/miniWorld.ts';
import type { GameState } from '../types.ts';

function memStore(): KVStore {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

function someState(): GameState {
  return reduce(
    {} as GameState,
    { type: 'START_GAME', worldId: 'mini', mode: 'relaxed', at: 1000 },
    miniWorld,
  ).state;
}

describe('save/load round trip', () => {
  it('deep-equals after a round trip', () => {
    const store = memStore();
    const state = someState();
    saveGame(state, 5000, store);
    const loaded = loadGame('mini', store);
    expect(loaded).not.toBeNull();
    expect(loaded!.state).toEqual(state);
    expect(loaded!.savedAt).toBe(5000);
  });

  it('returns null for missing, corrupt, or future-version saves', () => {
    const store = memStore();
    expect(loadGame('mini', store)).toBeNull();
    store.setItem('escaperoom:save:mini', '{not json');
    expect(loadGame('mini', store)).toBeNull();
    store.setItem('escaperoom:save:mini', JSON.stringify({ version: 99, worldId: 'mini' }));
    expect(loadGame('mini', store)).toBeNull();
    store.setItem(
      'escaperoom:save:mini',
      JSON.stringify({ version: 1, worldId: 'mini', savedAt: 1, state: { schemaVersion: 1 } }),
    );
    expect(loadGame('mini', store)).toBeNull(); // missing required state fields
  });

  it('clearSave removes the save', () => {
    const store = memStore();
    saveGame(someState(), 5000, store);
    clearSave('mini', store);
    expect(loadGame('mini', store)).toBeNull();
  });

  it('survives a null store (no localStorage)', () => {
    expect(() => saveGame(someState(), 1, null)).not.toThrow();
    expect(loadGame('mini', null)).toBeNull();
  });
});

describe('settings', () => {
  it('round-trips and falls back to defaults', () => {
    const store = memStore();
    expect(loadSettings(store).volume).toBe(0.7);
    saveSettings({ volume: 0.3, muted: true, bestTimes: {}, achievementHistory: {} }, store);
    expect(loadSettings(store)).toMatchObject({ volume: 0.3, muted: true });
  });

  it('recordCompletion keeps the best time and merges achievements', () => {
    const store = memStore();
    recordCompletion('mini', 90_000, { a_done: 1 }, store);
    recordCompletion('mini', 120_000, { a_pure: 2 }, store);
    const s = loadSettings(store);
    expect(s.bestTimes.mini).toBe(90_000);
    expect(s.achievementHistory.mini).toEqual({ a_done: 1, a_pure: 2 });
  });
});
