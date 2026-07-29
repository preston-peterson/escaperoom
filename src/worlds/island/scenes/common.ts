import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/**
 * Shared scenery for the island. Exteriors stand on a headland over open
 * water; interiors are the Wardens' mossy stonework.
 */

/** Open water to the horizon, with a drifting mist bank above it. */
export function seaHorizon(y = 300, h = 270): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'sea', x: 0, y, parallax: 0, props: { w: 1600, h } },
    { kind: 'primitive', primitive: 'fog', x: 0, y: y - 70, parallax: 0.08, props: { w: 1600, h: 130, opacity: 0.16, speed: 34 } },
  ];
}

/** Exterior ground: a shelf of turf and stone from the mid-line down. */
export function headland(seed = 1): SceneLayer[] {
  const dip = 10 + (seed % 4) * 8;
  return [
    { kind: 'path', d: `M 0 900 L 0 ${540 + dip} Q 400 ${500 + dip} 800 ${530 + dip} Q 1200 ${560 + dip} 1600 ${515 + dip} L 1600 900 Z`, fill: 'var(--p-floor)', parallax: 0 },
    { kind: 'path', d: 'M 0 900 L 0 705 Q 800 665 1600 705 L 1600 900 Z', fill: 'var(--p-wall-dark)', opacity: 0.35, parallax: 0.2 },
    { kind: 'primitive', primitive: 'fog', x: 100, y: 640, parallax: 0.5, props: { w: 1400, h: 180, opacity: 0.12, speed: 24 } },
  ];
}

/** Interior shell: back wall, floor, and a low sea-damp haze. */
export function roomShell(seed: number): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 500, seed } },
    { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    { kind: 'path', d: 'M 320 900 L 660 560 L 940 560 L 1280 900 Z', fill: 'var(--p-wall-light)', opacity: 0.06, parallax: 0 },
    { kind: 'primitive', primitive: 'fog', x: 120, y: 630, parallax: 0.55, props: { w: 1360, h: 190, opacity: 0.12, speed: 28 } },
  ];
}

/** A doorway (arch or ruin-gap) plus its navigate hotspot. */
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

/** Pair of harbor lanterns (wall torches) flanking the scene. */
export function lanternPosts(lit = true): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'torch', x: 160, y: 250, scale: 1.1, parallax: 0.35, props: { lit, seed: 3 } },
    { kind: 'primitive', primitive: 'torch', x: 1380, y: 250, scale: 1.1, parallax: 0.35, props: { lit, seed: 8 } },
  ];
}

/** Foreground edge shadows for depth. */
export function foregroundFrame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 190 0 L 90 900 L 0 900 Z', fill: '#04070a', opacity: 0.82, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1410 0 L 1510 900 L 1600 900 Z', fill: '#04070a', opacity: 0.82, parallax: 0.9 },
  ];
}
