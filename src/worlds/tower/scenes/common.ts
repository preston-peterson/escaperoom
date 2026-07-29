import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/**
 * Standard tower chamber shell: riveted plate wall, deck floor, and a low
 * drift of steam. The stoneWall primitive reads as riveted plate in the
 * brass/steam palettes.
 */
export function towerShell(seed: number): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 500, seed } },
    { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    // deck sheen
    { kind: 'path', d: 'M 300 900 L 640 560 L 960 560 L 1300 900 Z', fill: 'var(--p-wall-light)', opacity: 0.07, parallax: 0 },
    { kind: 'primitive', primitive: 'fog', x: 100, y: 630, parallax: 0.55, props: { w: 1400, h: 190, opacity: 0.14, speed: 26 } },
  ];
}

/** A doorway in the wall plus its navigate hotspot. */
export function exitArch(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; lit?: boolean; if?: Condition } = {},
): { layer: SceneLayer; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 360 * scale;
  const h = 520 * scale;
  const y = 580 - h;
  return {
    layer: {
      kind: 'primitive',
      primitive: 'archway',
      x,
      y,
      scale,
      parallax: 0.15,
      props: { lit: opts.lit ?? false },
      if: opts.if,
    },
    hotspot: {
      id: `exit_${passage}`,
      shape: { kind: 'rect', x: x + w * 0.14, y: y + h * 0.1, w: w * 0.72, h: h * 0.9 },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A wall clock. Every dial in the tower means something. */
export function wallClock(
  x: number,
  y: number,
  hour: number,
  minute: number,
  opts: { r?: number; glow?: boolean; parallax?: number; if?: Condition } = {},
): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'clockFace',
    x,
    y,
    parallax: opts.parallax ?? 0.2,
    props: {
      r: opts.r ?? 60,
      hourAngle: ((hour % 12) + minute / 60) * 30,
      minuteAngle: minute * 6,
      glow: opts.glow ?? false,
    },
    if: opts.if,
  };
}

/** The moment the Horologist stopped the tower: six minutes to midnight. */
export function stoppedClock(
  x: number,
  y: number,
  opts: { r?: number; glow?: boolean; parallax?: number; if?: Condition } = {},
): SceneLayer {
  return wallClock(x, y, 11, 54, opts);
}

/** Pair of wall lamps (torch primitive) flanking the scene. */
export function lampPair(lit = true): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'torch', x: 150, y: 240, scale: 1.15, parallax: 0.35, props: { lit, seed: 3 } },
    { kind: 'primitive', primitive: 'torch', x: 1390, y: 240, scale: 1.15, parallax: 0.35, props: { lit, seed: 8 } },
  ];
}

/** Foreground girder shadows for depth. */
export function girderFrame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 190 0 L 90 900 L 0 900 Z', fill: '#050302', opacity: 0.85, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1410 0 L 1510 900 L 1600 900 Z', fill: '#050302', opacity: 0.85, parallax: 0.9 },
  ];
}
