import type { GameState } from '../types.ts';

export interface SaveFile {
  version: number;
  worldId: string;
  savedAt: number;
  state: GameState;
}

export const CURRENT_SAVE_VERSION = 1;

/**
 * Upgrade an old save to the current schema, or return null when the payload
 * is unusable (corrupt, unknown version, missing fields).
 */
export function migrate(raw: unknown): SaveFile | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const file = raw as Partial<SaveFile>;
  if (typeof file.version !== 'number' || typeof file.worldId !== 'string') {
    return null;
  }
  if (file.version > CURRENT_SAVE_VERSION) return null;
  const state = file.state;
  if (
    typeof state !== 'object' ||
    state === null ||
    state.schemaVersion !== 1 ||
    typeof state.currentRoom !== 'string' ||
    typeof state.topology !== 'object' ||
    typeof state.puzzles !== 'object'
  ) {
    return null;
  }
  // v1 → v1: identity. Future versions chain upgrades here.
  return file as SaveFile;
}
