import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/** Paneled interior shell: back wall, floor, sheen, and a low haze band. */
export function interiorShell(
  seed: number,
  style: 'wood' | 'velvet' | 'deco' | 'iron' = 'wood',
  opts: { haze?: number } = {},
): SceneLayer[] {
  return [
    {
      kind: 'primitive',
      primitive: 'panelWall',
      x: 0,
      y: 60,
      parallax: 0,
      props: { w: 1600, h: 500, seed, style },
    },
    { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    {
      kind: 'path',
      d: 'M 280 900 L 630 560 L 970 560 L 1320 900 Z',
      fill: 'var(--p-wall-light)',
      opacity: 0.06,
      parallax: 0,
    },
    {
      kind: 'primitive',
      primitive: 'fog',
      x: 100,
      y: 640,
      parallax: 0.55,
      props: { w: 1400, h: 180, opacity: opts.haze ?? 0.09 },
    },
  ];
}

/** A stage door in the back wall plus its navigate hotspot. */
export function stageDoor(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; open?: boolean; if?: Condition } = {},
): { layer: SceneLayer; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 260 * scale;
  const h = 440 * scale;
  const y = 580 - h;
  return {
    layer: {
      kind: 'primitive',
      primitive: 'door',
      x,
      y,
      scale,
      parallax: 0.15,
      props: { open: opts.open ?? false },
      if: opts.if,
    },
    hotspot: {
      id: `exit_${passage}`,
      shape: { kind: 'rect', x, y, w, h },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A grander arched opening (front-of-house) plus its navigate hotspot. */
export function grandArch(
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
      props: { lit: opts.lit ?? true },
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

/** Wall sconces flanking the scene — the Coronet burns gas, low and steady. */
export function sconcePair(lit = true): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'torch', x: 130, y: 230, scale: 1.05, parallax: 0.35, props: { lit, seed: 3 } },
    { kind: 'primitive', primitive: 'torch', x: 1400, y: 230, scale: 1.05, parallax: 0.35, props: { lit, seed: 8 } },
  ];
}

/** Foreground edge shadows for depth. */
export function foregroundFrame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 185 0 L 85 900 L 0 900 Z', fill: '#060304', opacity: 0.85, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1415 0 L 1515 900 L 1600 900 Z', fill: '#060304', opacity: 0.85, parallax: 0.9 },
  ];
}

/**
 * The ghost light: a bare bulb on a standing pole. The glow layer carries its
 * own condition so scenes can kill the light when the trap runs.
 */
export function ghostLight(
  x: number,
  y: number,
  scale = 1,
  litIf?: Condition,
): SceneLayer[] {
  const s = (n: number) => n * scale;
  return [
    {
      kind: 'path',
      d: `M ${x - s(10)} ${y} l ${s(6)} ${-s(230)} h ${s(8)} l ${s(6)} ${s(230)} Z M ${x - s(60)} ${y} h ${s(120)} l ${-s(14)} ${s(16)} h ${-s(92)} Z`,
      fill: 'var(--p-wall-dark)',
      parallax: 0.4,
    },
    {
      kind: 'primitive',
      primitive: 'glint',
      x: x - s(20),
      y: y - s(270),
      scale: 1.8 * scale,
      parallax: 0.4,
      if: litIf,
    },
  ];
}
