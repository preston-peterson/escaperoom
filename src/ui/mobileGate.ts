/**
 * Playability gate.
 *
 * The game is built for a wide window. Touch is now supported in landscape —
 * see the look-around control and padded hit areas — but portrait crops the
 * scenes past the point of playability, so we ask for a turn of the phone
 * rather than shipping something broken. Decisions come from what the device
 * can do, never from sniffing user-agent strings.
 */

export type GateReason = 'rotate' | 'small' | 'narrow' | null;

/** Below this a pointer-driven window can't lay out the board and HUD. */
export const MIN_PLAYABLE_WIDTH = 900;
/** Landscape phones are narrower than that, but they get the touch layout. */
export const MIN_TOUCH_WIDTH = 560;

export interface GateEnv {
  /** True for finger/stylus input with no hover — phones and tablets. */
  coarsePointer: boolean;
  width: number;
  height: number;
}

export function gateReason(env: GateEnv): GateReason {
  if (env.coarsePointer) {
    if (env.height > env.width) return 'rotate';
    return env.width < MIN_TOUCH_WIDTH ? 'small' : null;
  }
  return env.width < MIN_PLAYABLE_WIDTH ? 'narrow' : null;
}

export const COARSE_POINTER_QUERY = '(pointer: coarse) and (hover: none)';

export function readEnv(): GateEnv {
  if (typeof window === 'undefined') {
    return { coarsePointer: false, width: 1920, height: 1080 };
  }
  return {
    coarsePointer:
      typeof window.matchMedia === 'function' &&
      window.matchMedia(COARSE_POINTER_QUERY).matches,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function isTouchDevice(): boolean {
  return readEnv().coarsePointer;
}
