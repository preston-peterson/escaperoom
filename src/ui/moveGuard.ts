/**
 * Debounce for movement clicks. A doorway double-click would otherwise move
 * you into a room and instantly back out — with any render hiccup, jittery
 * clicks did exactly that. UI-level guard; the reducer stays pure.
 */
const MOVE_COOLDOWN_MS = 350;
let lastMoveAt = 0;

export function allowMove(): boolean {
  const now = Date.now();
  if (now - lastMoveAt < MOVE_COOLDOWN_MS) return false;
  lastMoveAt = now;
  return true;
}
