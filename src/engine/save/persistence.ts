import type { GameState } from '../types.ts';
import { CURRENT_SAVE_VERSION, migrate, type SaveFile } from './migrations.ts';

const SAVE_PREFIX = 'escaperoom:save:';
const SETTINGS_KEY = 'escaperoom:settings';

export interface Settings {
  volume: number; // 0..1
  muted: boolean;
  /** worldId → best completion ms (challenge or relaxed, best overall) */
  bestTimes: Record<string, number>;
  /** worldId → achievement id → unlock timestamp; survives restarts */
  achievementHistory: Record<string, Record<string, number>>;
}

export const defaultSettings: Settings = {
  volume: 0.7,
  muted: false,
  bestTimes: {},
  achievementHistory: {},
};

/** Storage abstraction so engine tests can run in Node without jsdom. */
export interface KVStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function browserStorage(): KVStore | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function saveGame(
  state: GameState,
  savedAt: number,
  store: KVStore | null = browserStorage(),
): void {
  if (!store) return;
  const file: SaveFile = {
    version: CURRENT_SAVE_VERSION,
    worldId: state.worldId,
    savedAt,
    state,
  };
  try {
    store.setItem(SAVE_PREFIX + state.worldId, JSON.stringify(file));
  } catch {
    // Storage full/blocked — the game keeps playing without saves.
  }
}

export function loadGame(
  worldId: string,
  store: KVStore | null = browserStorage(),
): SaveFile | null {
  if (!store) return null;
  try {
    const raw = store.getItem(SAVE_PREFIX + worldId);
    if (raw === null) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearSave(
  worldId: string,
  store: KVStore | null = browserStorage(),
): void {
  try {
    store?.removeItem(SAVE_PREFIX + worldId);
  } catch {
    // ignore
  }
}

export function loadSettings(store: KVStore | null = browserStorage()): Settings {
  if (!store) return { ...defaultSettings };
  try {
    const raw = store.getItem(SETTINGS_KEY);
    if (raw === null) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...parsed,
      bestTimes: parsed.bestTimes ?? {},
      achievementHistory: parsed.achievementHistory ?? {},
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(
  settings: Settings,
  store: KVStore | null = browserStorage(),
): void {
  try {
    store?.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/** Record a finished run: best time + achievement history. */
export function recordCompletion(
  worldId: string,
  finishedInMs: number | undefined,
  achievements: Record<string, number>,
  store: KVStore | null = browserStorage(),
): Settings {
  const settings = loadSettings(store);
  if (
    finishedInMs !== undefined &&
    (settings.bestTimes[worldId] === undefined ||
      finishedInMs < settings.bestTimes[worldId])
  ) {
    settings.bestTimes[worldId] = finishedInMs;
  }
  settings.achievementHistory[worldId] = {
    ...settings.achievementHistory[worldId],
    ...achievements,
  };
  saveSettings(settings, store);
  return settings;
}
