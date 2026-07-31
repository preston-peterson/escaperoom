/**
 * Playability gate.
 *
 * Touch is supported in landscape — see the look-around control and the
 * padded hit areas. Portrait is not, and won't be: the scenes are painted
 * 16:9, and a portrait phone renders them at about a fifth of scale, which
 * puts every touch target near 18px against a 44px minimum. It would look
 * right and refuse to respond. So portrait always asks for a turn of the
 * phone. Decisions come from what the device can do, never from sniffing
 * user-agent strings.
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
    // Portrait is out of scope by design, at any size: turn the device.
    if (env.height > env.width) return 'rotate';
    return env.width < MIN_TOUCH_WIDTH ? 'small' : null;
  }
  return env.width < MIN_PLAYABLE_WIDTH ? 'narrow' : null;
}

/** Rotating is always available, so the rotate prompt offers no way past it. */
export function isDismissable(reason: Exclude<GateReason, null>): boolean {
  return reason !== 'rotate';
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
