/** The steam wing: Boiler Deck and the Furnace at the tower's root. */
import type { SceneDef } from '../../../engine/types.ts';
import { exitArch, girderFrame, lampPair, towerShell, wallClock } from './common.ts';

export function boilerScene(): SceneDef {
  const west = exitArch(120, 'p_pendulum_boiler', 'Back to the Pendulum Hall', { scale: 0.8 });
  const down = exitArch(1120, 'p_boiler_furnace', 'Down the stoke-stair to the Furnace', { scale: 0.8, lit: true });
  return {
    palette: 'steam',
    layers: [
      ...towerShell(13),
      west.layer,
      down.layer,
      // the boiler itself, a riveted whale on saddles
      { kind: 'path', d: 'M 430 190 q 250 -120 500 0 l 0 240 q -250 110 -500 0 Z', fill: 'var(--p-wall-mid)', parallax: 0.15 },
      { kind: 'path', d: 'M 430 190 q 250 -120 500 0 l 0 40 q -250 -110 -500 0 Z', fill: 'var(--p-wall-light)', opacity: 0.5, parallax: 0.15 },
      { kind: 'path', d: 'M 470 430 h 60 v 130 h -60 Z M 830 430 h 60 v 130 h -60 Z', fill: 'var(--p-wall-dark)', parallax: 0.15 },
      { kind: 'primitive', primitive: 'pipes', x: 940, y: 60, scale: 1.0, parallax: 0.15, props: { seed: 11 } },
      // the pressure drums and their dial bank
      { kind: 'primitive', primitive: 'glyphPanel', x: 500, y: 300, scale: 0.7, parallax: 0.2, props: { rows: 1, cols: 3, seed: 12, glow: false }, if: { not: { solved: 'pz_boiler' } } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 500, y: 300, scale: 0.7, parallax: 0.2, props: { rows: 1, cols: 3, seed: 12, glow: true }, if: { solved: 'pz_boiler' } },
      // the master gauge wakes with the fire
      wallClock(680, 120, 4, 42, { r: 45, parallax: 0.15, glow: false }),
      // the fire-plate
      { kind: 'primitive', primitive: 'glyphPanel', x: 220, y: 320, scale: 0.55, parallax: 0.25, props: { rows: 2, cols: 2, seed: 14 } },
      // the condenser pool, and the flyball drowned in it
      { kind: 'primitive', primitive: 'waterPool', x: 420, y: 650, scale: 1.1, parallax: 0.5 },
      {
        kind: 'primitive', primitive: 'glint', x: 760, y: 720, scale: 1.3, parallax: 0.5,
        if: { not: { any: [{ hasItem: 'governor_weight' }, { flag: 'governorSet' }] } },
      },
      // live steam once the furnace is lit
      { kind: 'primitive', primitive: 'fog', x: 380, y: 120, parallax: 0.35, props: { w: 700, h: 160, opacity: 0.22, speed: 14 }, if: { flag: 'furnaceLit' } },
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'pressure_drums',
        shape: { kind: 'rect', x: 490, y: 290, w: 320, h: 220 },
        label: 'Three numbered pressure drums',
        hideWhen: { solved: 'pz_boiler' },
        action: { type: 'puzzle', puzzle: 'pz_boiler' },
      },
      {
        id: 'fire_plate',
        shape: { kind: 'rect', x: 210, y: 310, w: 230, h: 190 },
        label: 'A stamped brass plate',
        action: {
          type: 'inspect',
          text: "'COLD MORNINGS: RAKE THE GRATE. OPEN THE DAMPER. FEED THE COAL. THEN THE BELLOWS, GENTLY — THE FIRE IS A COLLEAGUE, NOT A SERVANT.' You copy the stokers' litany down.",
          effects: [{ type: 'unlockJournal', entry: 'j_fireplate' }],
        },
      },
      {
        id: 'take_weight',
        shape: { kind: 'circle', cx: 780, cy: 745, r: 70 },
        label: 'Something round glinting in the condenser pool',
        hideWhen: { any: [{ hasItem: 'governor_weight' }, { flag: 'governorSet' }] },
        action: { type: 'pickup', item: 'governor_weight' },
      },
      {
        id: 'pool',
        shape: { kind: 'rect', x: 430, y: 660, w: 640, h: 160 },
        label: 'The condenser pool',
        action: {
          type: 'inspect',
          text: 'A pool of once-boiled water, mineral-smooth, that has spent years catching whatever the tower drops. The tower, it turns out, drops things.',
        },
      },
      west.hotspot,
      down.hotspot,
    ],
  };
}

export function furnaceScene(): SceneDef {
  const up = exitArch(120, 'p_boiler_furnace', 'Up the stoke-stair to the Boiler Deck', { scale: 0.8 });
  return {
    palette: 'heart',
    layers: [
      ...towerShell(17),
      up.layer,
      // the furnace mouth
      { kind: 'primitive', primitive: 'brazier', x: 620, y: 300, scale: 1.5, parallax: 0.25, props: { lit: false, seed: 19 }, if: { not: { flag: 'furnaceLit' } } },
      { kind: 'primitive', primitive: 'brazier', x: 620, y: 300, scale: 1.5, parallax: 0.25, props: { lit: true, seed: 19 }, if: { flag: 'furnaceLit' } },
      { kind: 'primitive', primitive: 'pipes', x: 980, y: 80, scale: 0.85, parallax: 0.15, props: { seed: 21 } },
      // the coal heap and the stokers' tools
      { kind: 'primitive', primitive: 'rubble', x: 1130, y: 560, scale: 1.0, parallax: 0.45, props: { seed: 23 } },
      // the fire gauge, stopped at two
      wallClock(350, 160, 2, 0, { r: 60, parallax: 0.2 }),
      // smoke when lit
      { kind: 'primitive', primitive: 'fog', x: 500, y: 80, parallax: 0.3, props: { w: 600, h: 180, opacity: 0.25, speed: 12 }, if: { flag: 'furnaceLit' } },
      ...lampPair(false),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'firebox',
        shape: { kind: 'rect', x: 600, y: 280, w: 380, h: 380 },
        label: 'The cold firebox',
        hideWhen: { flag: 'furnaceLit' },
        action: { type: 'puzzle', puzzle: 'pz_furnace' },
      },
      {
        id: 'furnace_gauge',
        shape: { kind: 'circle', cx: 410, cy: 220, r: 80 },
        label: 'The fire gauge',
        action: {
          type: 'inspect',
          text: 'Soot-dimmed but legible: the hand rests on TWO. The tag beneath reads FIRE. You note the reading.',
          effects: [{ type: 'unlockJournal', entry: 'j_gauge_fire' }],
        },
      },
      {
        id: 'scorched_page',
        shape: { kind: 'rect', x: 1000, y: 120, w: 260, h: 180 },
        label: 'A scorched page wedged behind the pipes',
        action: {
          type: 'inspect',
          text: 'A ledger page, browned at the edges, saved from the flue by a hand quicker than the fire. The writing survives. You add it to the journal.',
          effects: [{ type: 'unlockJournal', entry: 'j_horo_2' }],
        },
      },
      {
        id: 'coal_heap',
        shape: { kind: 'rect', x: 1080, y: 560, w: 380, h: 200 },
        label: 'The coal heap',
        action: {
          type: 'inspect',
          text: 'Good coal, kept dry, enough for years. Whoever left this tower meant for its fire to be lit again.',
        },
      },
      up.hotspot,
    ],
  };
}
