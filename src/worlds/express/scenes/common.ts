import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/**
 * Shared carriage geometry. Every car renders as: dark ceiling band, a
 * panelled back wall (y 100–560), and floor from 560 down — so furniture,
 * doors and windows sit on a common horizon across the whole train.
 */
export function carShell(
  seed: number,
  style: 'wood' | 'deco' | 'velvet' | 'iron' = 'wood',
): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 1600 0 L 1600 100 L 0 100 Z', fill: 'var(--p-wall-dark)', parallax: 0 },
    {
      kind: 'primitive',
      primitive: 'panelWall',
      x: 0,
      y: 100,
      parallax: 0,
      props: { w: 1600, h: 460, seed, style },
    },
    { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    // carpet runner
    { kind: 'path', d: 'M 250 900 L 560 560 L 1040 560 L 1350 900 Z', fill: 'var(--p-accent)', opacity: 0.12, parallax: 0 },
  ];
}

/** A carriage door in the back wall plus its navigate hotspot. */
export function carDoor(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; open?: boolean; if?: Condition } = {},
): { layer: SceneLayer; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 260 * scale;
  const h = 440 * scale;
  const y = 560 - h;
  return {
    layer: {
      kind: 'primitive',
      primitive: 'door',
      x,
      y,
      scale,
      parallax: 0.12,
      props: { open: opts.open ?? false },
      if: opts.if,
    },
    hotspot: {
      id: `door_${passage}`,
      shape: { kind: 'rect', x: x - w * 0.08, y, w: w * 1.16, h },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A row of sash windows along the back wall. */
export function carWindows(
  xs: number[],
  weather: 'snow' | 'night' | 'motion' | 'sea',
  opts: { lit?: boolean; scale?: number } = {},
): SceneLayer[] {
  const scale = opts.scale ?? 0.85;
  return xs.map((x) => ({
    kind: 'primitive' as const,
    primitive: 'windowPane' as const,
    x,
    y: 560 - 420 * scale - 30,
    scale,
    parallax: 0.06,
    props: { shape: 'sash', weather, lit: opts.lit ?? false },
  }));
}

/** Foreground vignette for depth. */
export function frameEdges(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 170 0 L 80 900 L 0 900 Z', fill: '#04050a', opacity: 0.8, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1430 0 L 1520 900 L 1600 900 Z', fill: '#04050a', opacity: 0.8, parallax: 0.9 },
  ];
}

/** The swaying lantern every car hangs from its ceiling rib. */
export function carLantern(x: number, lit = true): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'chandelier',
    x,
    y: 10,
    scale: 0.7,
    parallax: 0.25,
    props: { style: 'lantern', lit, sway: true },
  };
}
