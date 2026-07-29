import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/** Standard chamber shell: back wall, floor, and a low fog bank. */
export function chamberShell(seed: number): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 500, seed } },
    { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    // floor sheen
    { kind: 'path', d: 'M 300 900 L 640 560 L 960 560 L 1300 900 Z', fill: 'var(--p-wall-light)', opacity: 0.07, parallax: 0 },
    { kind: 'primitive', primitive: 'fog', x: 100, y: 620, parallax: 0.55, props: { w: 1400, h: 200, opacity: 0.13 } },
  ];
}

/** A doorway in the back wall plus its navigate hotspot. */
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

/** Pair of wall torches flanking the scene. */
export function torchPair(lit = true): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'torch', x: 150, y: 240, scale: 1.15, parallax: 0.35, props: { lit, seed: 2 } },
    { kind: 'primitive', primitive: 'torch', x: 1390, y: 240, scale: 1.15, parallax: 0.35, props: { lit, seed: 5 } },
  ];
}

/** Foreground edge shadows for depth. */
export function foregroundFrame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 190 0 L 90 900 L 0 900 Z', fill: '#050302', opacity: 0.85, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1410 0 L 1510 900 L 1600 900 Z', fill: '#050302', opacity: 0.85, parallax: 0.9 },
  ];
}
