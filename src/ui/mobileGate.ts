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

/**
 * `?touch=1` forces the touch layout, `?touch=0` forces the pointer one.
 * Touch behaviour is otherwise invisible on a development machine, and a
 * layout you can't look at is a layout you can't trust.
 */
function forcedTouch(): boolean | null {
  if (typeof location === 'undefined') return null;
  const flag = new URLSearchParams(location.search).get('touch');
  return flag === '1' ? true : flag === '0' ? false : null;
}

export function readEnv(): GateEnv {
  if (typeof window === 'undefined') {
    return { coarsePointer: false, width: 1920, height: 1080 };
  }
  const forced = forcedTouch();
  return {
    coarsePointer:
      forced ??
      (typeof window.matchMedia === 'function' &&
        window.matchMedia(COARSE_POINTER_QUERY).matches),
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function isTouchDevice(): boolean {
  return readEnv().coarsePointer;
}
