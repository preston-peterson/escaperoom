/** Scenes for the working ship: the Service Stair, the Linen Room, the Galley. */
import type { SceneDef } from '../../../engine/types.ts';
import { deckShell, doorway, frame, swayLamp } from './common.ts';

export function stairScene(): SceneDef {
  const corridor = doorway(90, 'p_corridor_stair', 'Up to the first-class corridor', { scale: 0.85 });
  const linen = doorway(480, 'p_stair_linen', 'The linen room, forward', { scale: 0.8 });
  const galley = doorway(880, 'p_stair_galley', 'The galley, aft', {
    openIf: { not: { solved: 'pz_bulkhead' } },
  });
  const engine = doorway(1280, 'p_stair_engine', 'The engine-room watertight door', {
    openIf: { solved: 'pz_bulkhead' },
  });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(17, 'iron'),
      { kind: 'primitive', primitive: 'stairs', x: 180, y: 150, scale: 0.9, parallax: 0.1, props: { steps: 8, w: 420, h: 340, dir: 'up' } },
      { kind: 'primitive', primitive: 'pipes', x: 1020, y: 70, parallax: 0.08, props: { w: 560, h: 160, seed: 4 } },
      swayLamp(720, 'lantern', 0.7),
      ...corridor.layers,
      ...linen.layers,
      ...galley.layers,
      ...engine.layers,
      // The watertight-door test panel: four brass switches in a row.
      { kind: 'path', d: 'M 660 300 h 180 v 160 h -180 Z', fill: 'var(--p-wall-dark)', parallax: 0.15 },
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'path' as const,
        d: `M ${684 + i * 40} 340 h 16 v 60 h -16 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.85,
        parallax: 0.15,
      })),
      // The watch station: a high desk commanding the stair foot.
      { kind: 'primitive', primitive: 'furniture', x: 1080, y: 500, scale: 0.75, parallax: 0.4, props: { kind: 'desk', seed: 11 } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'test_panel',
        shape: { kind: 'rect', x: 650, y: 290, w: 200, h: 180 },
        label: 'The watertight-door test panel',
        hideWhen: { solved: 'pz_bulkhead' },
        action: { type: 'puzzle', puzzle: 'pz_bulkhead' },
      },
      {
        id: 'watch_station',
        shape: { kind: 'rect', x: 1060, y: 480, w: 320, h: 200 },
        label: 'The watch station',
        action: {
          type: 'inspect',
          text: 'A high desk at the stair foot, sightlines down every service corridor. Nobody passes this landing unseen while the watch is kept — which is exactly why the route that matters never came this way.',
        },
      },
      corridor.hotspot,
      linen.hotspot,
      galley.hotspot,
      engine.hotspot,
    ],
  };
}

export function linenScene(): SceneDef {
  const out = doorway(90, 'p_stair_linen', 'Back to the service stair', { scale: 0.85 });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(26, 'wood'),
      swayLamp(500, 'lantern', 0.7),
      ...out.layers,
      // The linen press and shelving.
      { kind: 'primitive', primitive: 'furniture', x: 1120, y: 250, scale: 1.05, parallax: 0.2, props: { kind: 'cabinet', seed: 5 } },
      { kind: 'primitive', primitive: 'furniture', x: 860, y: 260, scale: 1.05, parallax: 0.2, props: { kind: 'cabinet', seed: 8 } },
      // Standing orders, tacked over the press.
      { kind: 'primitive', primitive: 'paperScrap', x: 700, y: 180, scale: 1, parallax: 0.15, props: { kind: 'letter', rotate: -2, seed: 4 } },
      // The laundry log on its chained board.
      { kind: 'primitive', primitive: 'paperScrap', x: 420, y: 470, scale: 1.05, parallax: 0.3, props: { kind: 'ledger', rotate: 4, seed: 7 } },
      // Hampers.
      { kind: 'path', d: 'M 200 560 q 10 -70 90 -70 q 80 0 90 70 l -8 110 h -164 Z', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'path', d: 'M 214 560 h 152 M 210 600 h 160 M 206 640 h 168', fill: 'none', parallax: 0.4 },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'standing_orders',
        shape: { kind: 'rect', x: 690, y: 160, w: 180, h: 150 },
        label: "The steward's standing orders",
        action: {
          type: 'inspect',
          text: "Standing orders, tacked square: cabin keys on the purser's rack — 'the rack answers to the letter code D-A-W-N this crossing' — and the master key drawn only against signature in the log. You copy the lot.",
          effects: [{ type: 'unlockJournal', entry: 'j_mech_keys' }],
        },
      },
      {
        id: 'laundry_log',
        shape: { kind: 'rect', x: 400, y: 450, w: 220, h: 160 },
        label: 'The laundry log',
        if: { hasItem: 'torn_button' },
        action: {
          type: 'inspect',
          text: "You lay the rail button beside the log. Marsh's uniform: complete, both cuffs, re-sewn Tuesday with the line's waxed grey thread. The thread through this shank is dry black cotton, never washed. Planted. You bag it as evidence against whoever left it.",
          effects: [
            { type: 'unlockJournal', entry: 'j_sus_marsh2' },
            { type: 'removeItem', item: 'torn_button' },
            { type: 'setFlag', flag: 'button_refuted' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'hampers',
        shape: { kind: 'rect', x: 190, y: 490, w: 200, h: 190 },
        label: 'The laundry hampers',
        action: {
          type: 'inspect',
          text: 'First-class linen, tagged by cabin, nothing out of order. Order is this room\'s whole religion — which is what makes the button at the rail so loud.',
        },
      },
      out.hotspot,
    ],
  };
}

export function galleyScene(): SceneDef {
  const stair = doorway(90, 'p_stair_galley', 'The stair corridor, forward', {
    openIf: { not: { solved: 'pz_bulkhead' } },
    scale: 0.85,
  });
  const engine = doorway(1290, 'p_galley_engine', 'The aft watertight frame — the engine room', {
    openIf: { solved: 'pz_bulkhead' },
    scale: 0.85,
  });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(35, 'iron'),
      { kind: 'primitive', primitive: 'pipes', x: 100, y: 70, parallax: 0.08, props: { w: 620, h: 150, seed: 9 } },
      swayLamp(560, 'lantern', 0.7),
      ...stair.layers,
      ...engine.layers,
      // The long range and prep table.
      { kind: 'path', d: 'M 380 430 h 420 v 150 h -420 Z M 400 400 h 380 v 30 h -380 Z', fill: 'var(--p-wall-dark)', parallax: 0.25 },
      { kind: 'path', d: 'M 420 430 h 80 v 60 h -80 Z M 540 430 h 80 v 60 h -80 Z M 660 430 h 80 v 60 h -80 Z', fill: 'var(--p-wall-mid)', parallax: 0.25 },
      // The dumbwaiter: a dark hatch in the wall, crank spindle bare.
      { kind: 'path', d: 'M 960 280 h 180 v 220 h -180 Z', fill: 'var(--p-wall-dark)', parallax: 0.12 },
      { kind: 'path', d: 'M 972 292 h 156 v 196 h -156 Z', fill: 'var(--p-sky-top)', parallax: 0.12, if: { not: { solved: 'pz_dumbwaiter' } } },
      { kind: 'path', d: 'M 972 292 h 156 v 196 h -156 Z', fill: 'var(--p-wall-mid)', parallax: 0.12, if: { solved: 'pz_dumbwaiter' } },
      { kind: 'primitive', primitive: 'lever', x: 1160, y: 380, scale: 0.7, parallax: 0.14, props: { pulled: false }, if: { solved: 'pz_dumbwaiter' } },
      // The cook's drill bill, grease-thumbed, by the range.
      { kind: 'primitive', primitive: 'paperScrap', x: 250, y: 300, scale: 0.95, parallax: 0.15, props: { kind: 'letter', rotate: 5, seed: 12 } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'drill_bill',
        shape: { kind: 'rect', x: 240, y: 280, w: 180, h: 150 },
        label: "The cook's drill bill",
        action: {
          type: 'inspect',
          text: "The watertight-door drill bill, thumbed in grease: 'DRILL ORDER ONLY, or the frames rack — AFT, FORE, AFT, AMIDSHIPS.' The cook underlined it twice.",
          effects: [{ type: 'unlockJournal', entry: 'j_mech_bulkheads' }],
        },
      },
      {
        id: 'dumbwaiter',
        shape: { kind: 'rect', x: 950, y: 270, w: 260, h: 240 },
        label: 'The dumbwaiter and its bare spindle',
        hideWhen: { solved: 'pz_dumbwaiter' },
        action: { type: 'puzzle', puzzle: 'pz_dumbwaiter' },
      },
      {
        id: 'dumbwaiter_ride',
        shape: { kind: 'rect', x: 950, y: 270, w: 260, h: 240 },
        label: 'Ride the dumbwaiter down to the hold',
        if: { flag: 'dumbwaiter_open' },
        action: { type: 'navigate', passage: 'p_galley_hold' },
      },
      {
        id: 'range',
        shape: { kind: 'rect', x: 370, y: 400, w: 440, h: 190 },
        label: 'The cold range',
        action: {
          type: 'inspect',
          text: 'Stock pots lashed down, fires drawn since the decks were cleared. A galley without heat is just a room full of knives — all of them, you note, accounted for on the rack.',
        },
      },
      stair.hotspot,
      engine.hotspot,
    ],
  };
}
