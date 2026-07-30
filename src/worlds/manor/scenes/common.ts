import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/** Paneled interior shell: wall, floor, and a sheen of window-light on the boards. */
export function roomShell(
  seed: number,
  opts: { style?: 'wood' | 'deco' | 'velvet' | 'iron'; wainscot?: boolean } = {},
): SceneLayer[] {
  return [
    {
      kind: 'primitive',
      primitive: 'panelWall',
      x: 0,
      y: 60,
      parallax: 0,
      props: { w: 1600, h: 520, seed, style: opts.style ?? 'wood', wainscot: opts.wainscot ?? true },
    },
    { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    {
      kind: 'path',
      d: 'M 280 900 L 640 580 L 960 580 L 1320 900 Z',
      fill: 'var(--p-wall-light)',
      opacity: 0.06,
      parallax: 0,
    },
  ];
}

/**
 * An interior door plus its navigate hotspot. With `openIf`, the art swaps
 * between shut and open leaves as the condition turns; otherwise it draws a
 * single leaf in the state given by `open`.
 */
export function interiorDoor(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; open?: boolean; openIf?: Condition; if?: Condition } = {},
): { layers: SceneLayer[]; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 260 * scale;
  const h = 440 * scale;
  const y = 580 - h;
  const layers: SceneLayer[] =
    opts.openIf === undefined
      ? [
          {
            kind: 'primitive',
            primitive: 'door',
            x,
            y,
            scale,
            parallax: 0.15,
            props: { open: opts.open ?? true },
            if: opts.if,
          },
        ]
      : [
          {
            kind: 'primitive',
            primitive: 'door',
            x,
            y,
            scale,
            parallax: 0.15,
            props: { open: false },
            if: { not: opts.openIf },
          },
          {
            kind: 'primitive',
            primitive: 'door',
            x,
            y,
            scale,
            parallax: 0.15,
            props: { open: true },
            if: opts.openIf,
          },
        ];
  return {
    layers,
    hotspot: {
      id: `exit_${passage}`,
      shape: { kind: 'rect', x: x - w * 0.05, y, w: w * 1.1, h },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A sash window with the blizzard beyond. */
export function snowWindow(
  x: number,
  opts: { y?: number; scale?: number; shape?: 'sash' | 'arched'; lit?: boolean } = {},
): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'windowPane',
    x,
    y: opts.y ?? 120,
    scale: opts.scale ?? 1,
    parallax: 0.08,
    props: { shape: opts.shape ?? 'sash', weather: 'snow', lit: opts.lit ?? false },
  };
}

/** Cold light spilling from a window across the floor. */
export function windowSpill(x: number, w = 420): SceneLayer {
  return {
    kind: 'path',
    d: `M ${x} 580 L ${x + w} 580 L ${x + w + 140} 860 L ${x - 140} 860 Z`,
    fill: 'var(--p-fog)',
    opacity: 0.08,
    parallax: 0.05,
  };
}

/** Foreground edge shadows for depth. */
export function frameShadow(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 180 0 L 90 900 L 0 900 Z', fill: 'var(--p-sky-top)', opacity: 0.8, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1420 0 L 1510 900 L 1600 900 Z', fill: 'var(--p-sky-top)', opacity: 0.8, parallax: 0.9 },
  ];
}

/** A low bank of blown snow-haze, for the cold rooms. */
export function coldHaze(opacity = 0.12): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'fog',
    x: 80,
    y: 640,
    parallax: 0.5,
    props: { w: 1440, h: 190, opacity },
  };
}
