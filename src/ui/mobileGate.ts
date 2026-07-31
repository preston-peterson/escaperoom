/**
 * Playability gate.
 *
 * The game is built for a pointer and a wide window: hotspots reveal
 * themselves on hover, scenes are authored at 1600x900, and the map wants
 * room to breathe. Rather than sniffing user-agent strings (which age badly),
 * decide from what the device can actually do.
 */

export type GateReason = 'touch' | 'narrow' | null;

/** Below this the map and scene chrome start colliding. */
export const MIN_PLAYABLE_WIDTH = 900;

export interface GateEnv {
  /** True for finger/stylus input with no hover — phones and tablets. */
  coarsePointer: boolean;
  width: number;
}

export function gateReason(env: GateEnv): GateReason {
  if (env.coarsePointer) return 'touch';
  if (env.width < MIN_PLAYABLE_WIDTH) return 'narrow';
  return null;
}

export const COARSE_POINTER_QUERY = '(pointer: coarse) and (hover: none)';

export function readEnv(): GateEnv {
  if (typeof window === 'undefined') return { coarsePointer: false, width: 1920 };
  return {
    coarsePointer:
      typeof window.matchMedia === 'function' &&
      window.matchMedia(COARSE_POINTER_QUERY).matches,
    width: window.innerWidth,
  };
}
