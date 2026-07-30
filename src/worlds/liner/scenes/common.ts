import type {
  Condition,
  HotspotDef,
  PassageId,
  SceneLayer,
} from '../../../engine/types.ts';

/**
 * Shared scene furniture for the Meridian: interior shells, doorways, and
 * the porthole ribbon of sea that follows you down the decks.
 */

/** Interior shell: panelled back wall + deck floor + faint sheen. */
export function deckShell(
  seed: number,
  style: 'deco' | 'wood' | 'velvet' | 'iron' = 'deco',
): SceneLayer[] {
  return [
    {
      kind: 'primitive',
      primitive: 'panelWall',
      x: 0,
      y: 60,
      parallax: 0,
      props: { w: 1600, h: 520, seed, style },
    },
    { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
    { kind: 'path', d: 'M 340 900 L 660 580 L 940 580 L 1260 900 Z', fill: 'var(--p-wall-light)', opacity: 0.06, parallax: 0 },
  ];
}

/** A ship's door in the back wall plus its navigate hotspot. */
export function doorway(
  x: number,
  passage: PassageId,
  label: string,
  opts: { scale?: number; open?: boolean; openIf?: Condition; if?: Condition } = {},
): { layers: SceneLayer[]; hotspot: HotspotDef } {
  const scale = opts.scale ?? 1;
  const w = 260 * scale;
  const h = 440 * scale;
  const y = 580 - h;
  const layers: SceneLayer[] = [];
  if (opts.openIf) {
    layers.push(
      { kind: 'primitive', primitive: 'door', x, y, scale, parallax: 0.12, props: { open: false }, if: { not: opts.openIf } },
      { kind: 'primitive', primitive: 'door', x, y, scale, parallax: 0.12, props: { open: true }, if: opts.openIf },
    );
  } else {
    layers.push({
      kind: 'primitive',
      primitive: 'door',
      x,
      y,
      scale,
      parallax: 0.12,
      props: { open: opts.open ?? true },
      if: opts.if,
    });
  }
  return {
    layers,
    hotspot: {
      id: `exit_${passage}`,
      shape: { kind: 'rect', x, y, w, h },
      label,
      if: opts.if,
      action: { type: 'navigate', passage },
    },
  };
}

/** A porthole with the sea sliding past. Porthole art is a 320-box circle. */
export function porthole(x: number, y = 130, scale = 0.9): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'windowPane',
    x,
    y,
    scale,
    parallax: 0.08,
    props: { shape: 'porthole', weather: 'sea' },
  };
}

/** Hanging light, always swaying — the ship moves. */
export function swayLamp(
  x: number,
  style: 'deco' | 'crystal' | 'lantern' = 'deco',
  scale = 0.9,
): SceneLayer {
  return {
    kind: 'primitive',
    primitive: 'chandelier',
    x,
    y: 0,
    scale,
    parallax: 0.3,
    props: { style, sway: true },
  };
}

/** Foreground edge shadows for depth. */
export function frame(): SceneLayer[] {
  return [
    { kind: 'path', d: 'M 0 0 L 170 0 L 80 900 L 0 900 Z', fill: '#04070a', opacity: 0.8, parallax: 0.9 },
    { kind: 'path', d: 'M 1600 0 L 1430 0 L 1520 900 L 1600 900 Z', fill: '#04070a', opacity: 0.8, parallax: 0.9 },
  ];
}
