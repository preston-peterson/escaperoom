import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/**
 * Dream idioms: no chamber walls unless a room insists, ground that trails
 * off into fog, doors standing free in space, and pencil-line geometry for
 * everything the Draughtsman never finished.
 */

/** Ground that never quite commits to being a floor. */
export function dreamGround(seed = 1, opts: { y?: number; fog?: number } = {}): SceneLayer[] {
  const y = opts.y ?? 620;
  return [
    {
      kind: 'path',
      d: `M 0 900 L 0 ${y + 40} Q 400 ${y} 800 ${y + 24} Q 1200 ${y + 48} 1600 ${y + 10} L 1600 900 Z`,
      fill: 'var(--p-floor)',
      parallax: 0,
    },
    {
      kind: 'path',
      d: `M 260 900 L 640 ${y + 30} L 980 ${y + 30} L 1340 900 Z`,
      fill: 'var(--p-wall-light)',
      opacity: 0.06,
      parallax: 0,
    },
    {
      kind: 'primitive',
      primitive: 'fog',
      x: 60,
      y: y - 30,
      parallax: 0.5,
      props: { w: 1480, h: 190, opacity: opts.fog ?? 0.16, speed: 28 + (seed % 7) * 2 },
    },
  ];
}

/** A sea hanging in the sky, with mist along its underside. */
export function skySea(h = 200): SceneLayer[] {
  return [
    { kind: 'primitive', primitive: 'sea', x: 0, y: 0, parallax: 0, props: { w: 1600, h } },
    {
      kind: 'primitive',
      primitive: 'fog',
      x: 0,
      y: h - 40,
      parallax: 0.05,
      props: { w: 1600, h: 120, opacity: 0.18, speed: 40 },
    },
  ];
}

/**
 * A door standing free in space (no wall) plus its navigate hotspot.
 * With `openIf`, the door renders shut until the condition holds.
 */
export function loneDoor(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; openIf?: Condition; if?: Condition; groundY?: number } = {},
): { layers: SceneLayer[]; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 260 * scale;
  const h = 440 * scale;
  const y = (opts.groundY ?? 660) - h;
  const layers: SceneLayer[] =
    opts.openIf === undefined
      ? [
          {
            kind: 'primitive',
            primitive: 'door',
            x,
            y,
            scale,
            parallax: 0.18,
            props: { open: true },
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
            parallax: 0.18,
            props: { open: false },
            if: { not: opts.openIf },
          },
          {
            kind: 'primitive',
            primitive: 'door',
            x,
            y,
            scale,
            parallax: 0.18,
            props: { open: true },
            if: opts.openIf,
          },
        ];
  return {
    layers,
    hotspot: {
      id: `exit_${passage}`,
      shape: { kind: 'rect', x: x - w * 0.06, y: y - h * 0.05, w: w * 1.12, h: h * 1.1 },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A thin pencil-stroke rectangle outline — the dream's sketch lines. */
export function sketchBox(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { t?: number; fill?: string; opacity?: number; parallax?: number; if?: Condition } = {},
): SceneLayer {
  const t = opts.t ?? 4;
  return {
    kind: 'path',
    d: `M ${x} ${y} h ${w} v ${h} h ${-w} Z M ${x + t} ${y + t} v ${h - 2 * t} h ${w - 2 * t} v ${-(h - 2 * t)} Z`,
    fill: opts.fill ?? 'var(--p-wall-light)',
    opacity: opts.opacity ?? 0.7,
    parallax: opts.parallax ?? 0.2,
    if: opts.if,
  };
}

/** A single pencil stroke between two points. */
export function sketchLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  t = 4,
  opts: { fill?: string; opacity?: number; parallax?: number; if?: Condition } = {},
): SceneLayer {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (t / 2);
  const ny = (dx / len) * (t / 2);
  return {
    kind: 'path',
    d: `M ${x1 + nx} ${y1 + ny} L ${x2 + nx} ${y2 + ny} L ${x2 - nx} ${y2 - ny} L ${x1 - nx} ${y1 - ny} Z`,
    fill: opts.fill ?? 'var(--p-wall-light)',
    opacity: opts.opacity ?? 0.5,
    parallax: opts.parallax ?? 0.2,
    if: opts.if,
  };
}

/** Foreground vignette in dream-dark. */
export function dreamFrame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 180 0 L 80 900 L 0 900 Z', fill: '#0b0714', opacity: 0.8, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1420 0 L 1520 900 L 1600 900 Z', fill: '#0b0714', opacity: 0.8, parallax: 0.9 },
  ];
}
