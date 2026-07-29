/** The village: Square, Bell Tower, Keeper's Cottage, Orchard Terrace. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  foregroundFrame,
  headland,
  lanternPosts,
  roomShell,
  seaHorizon,
} from './common.ts';

export function squareScene(): SceneDef {
  const south = exitArch(600, 'p_cliff_square', 'The cliff stair, down to the sea', { scale: 0.75 });
  const bell = exitArch(140, 'p_square_bell', 'The bell tower door', { scale: 0.85 });
  const orchard = exitArch(1140, 'p_square_orchard', 'A lane toward the orchard terrace', {
    scale: 0.85,
    lit: true,
  });
  return {
    palette: 'village',
    layers: [
      ...seaHorizon(350, 180),
      ...headland(5),
      // village roofline behind the square
      { kind: 'path', d: 'M 0 540 L 120 430 L 250 540 L 340 470 L 470 540 L 1600 540 L 1600 560 L 0 560 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.08 },
      { kind: 'path', d: 'M 1050 540 L 1160 440 L 1290 540 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.08 },
      bell.layer,
      south.layer,
      orchard.layer,
      // the keeper's cottage front, its door shut fast
      { kind: 'primitive', primitive: 'door', x: 880, y: 200, scale: 0.85, parallax: 0.18, props: { open: false }, if: { not: { flag: 'cottageOpen' } } },
      { kind: 'primitive', primitive: 'door', x: 880, y: 200, scale: 0.85, parallax: 0.18, props: { open: true }, if: { flag: 'cottageOpen' } },
      // the Warden door: a counterlocked slab in the paving
      { kind: 'path', d: 'M 660 690 L 940 690 L 980 780 L 620 780 Z', fill: 'var(--p-wall-dark)', parallax: 0.3, if: { not: { solved: 'pz_tidelock' } } },
      { kind: 'path', d: 'M 660 690 L 940 690 L 980 780 L 620 780 Z', fill: '#04070a', parallax: 0.3, if: { solved: 'pz_tidelock' } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 690, y: 620, scale: 0.45, parallax: 0.3, props: { rows: 1, cols: 3, seed: 27, glow: false }, if: { not: { solved: 'pz_tidelock' } } },
      // the dry well
      { kind: 'path', d: 'M 380 640 a 90 30 0 1 0 180 0 a 90 30 0 1 0 -180 0 Z M 380 640 v -50 M 560 640 v -50 M 380 590 a 90 26 0 0 1 180 0', fill: 'var(--p-wall-mid)', opacity: 0.95, parallax: 0.35 },
      ...lanternPosts(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'well',
        shape: { kind: 'rect', x: 370, y: 560, w: 200, h: 130 },
        label: 'The village well',
        action: {
          type: 'inspect',
          text: 'The bucket is gone but the rope remains, coiled and tarred with care. Far below, the well answers your shadow with the smell of the sea. On this island, everything does.',
        },
      },
      {
        id: 'cottage_lock',
        shape: { kind: 'rect', x: 1050, y: 380, w: 90, h: 120 },
        label: "The cottage lock, orange with rust",
        hideWhen: { flag: 'cottageOpen' },
        action: {
          type: 'useItem',
          accepts: ['cottage_key'],
          effects: [
            { type: 'removeItem', item: 'cottage_key' },
            { type: 'setFlag', flag: 'cottageOpen' },
            { type: 'triggerShift', shift: 's_cottage' },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText: 'The lock wants its own key, and has waited too long to settle for less.',
        },
      },
      {
        id: 'cottage_door',
        shape: { kind: 'rect', x: 890, y: 210, w: 200, h: 360 },
        label: "The keeper's cottage",
        action: { type: 'navigate', passage: 'p_square_cottage' },
      },
      {
        id: 'warden_door',
        shape: { kind: 'rect', x: 640, y: 610, w: 330, h: 120 },
        label: 'Three numbered drums above a spillway grate',
        hideWhen: { solved: 'pz_tidelock' },
        action: { type: 'puzzle', puzzle: 'pz_tidelock' },
      },
      {
        id: 'warden_stair',
        shape: { kind: 'polygon', points: [[660, 690], [940, 690], [980, 780], [620, 780]] },
        label: 'The Warden door in the paving',
        action: { type: 'navigate', passage: 'p_square_engine' },
      },
      bell.hotspot,
      south.hotspot,
      orchard.hotspot,
    ],
  };
}

export function bellTowerScene(): SceneDef {
  const out = exitArch(1120, 'p_square_bell', 'Back out to the square', { scale: 0.8 });
  return {
    palette: 'village',
    layers: [
      ...roomShell(31),
      out.layer,
      // four bells in the gloom above
      { kind: 'path', d: 'M 300 60 q 50 -40 100 0 l 12 90 h -124 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.15 },
      { kind: 'path', d: 'M 520 40 q 55 -44 110 0 l 14 104 h -138 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.15 },
      { kind: 'path', d: 'M 760 60 q 50 -40 100 0 l 12 90 h -124 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.15 },
      { kind: 'path', d: 'M 980 70 q 46 -36 92 0 l 10 80 h -112 Z', fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.15 },
      // their ropes, tails knotted differently
      { kind: 'path', d: 'M 360 150 v 420 M 585 150 v 420 M 820 150 v 420 M 1035 150 v 420', fill: 'none', parallax: 0.2 },
      { kind: 'path', d: 'M 354 150 h 8 v 430 h -8 Z M 579 150 h 8 v 430 h -8 Z M 814 150 h 8 v 430 h -8 Z M 1029 150 h 8 v 430 h -8 Z', fill: 'var(--p-wall-light)', opacity: 0.7, parallax: 0.2 },
      // the coupling plate
      { kind: 'primitive', primitive: 'glyphPanel', x: 620, y: 640, scale: 0.55, parallax: 0.35, props: { rows: 1, cols: 4, seed: 35 } },
      // spare counterweights on their rack
      { kind: 'primitive', primitive: 'rubble', x: 200, y: 620, scale: 0.8, parallax: 0.4, props: { seed: 9 } },
      {
        kind: 'primitive', primitive: 'glint', x: 265, y: 660, scale: 1.1, parallax: 0.4,
        if: { not: { any: [{ hasItem: 'eng_weight' }, { flag: 'engineFitted' }] } },
      },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'bells',
        shape: { kind: 'rect', x: 290, y: 150, w: 810, h: 440 },
        label: 'Four bell ropes',
        hideWhen: { solved: 'pz_bellpeal' },
        action: { type: 'puzzle', puzzle: 'pz_bellpeal' },
      },
      {
        id: 'bells_still',
        shape: { kind: 'rect', x: 290, y: 150, w: 810, h: 440 },
        label: 'The bells, spent',
        if: { solved: 'pz_bellpeal' },
        action: {
          type: 'inspect',
          text: 'The ropes hang dead still, but the tower itself is faintly warm, like a sung note held in the chest. Somewhere below, chains are still paying themselves out.',
        },
      },
      {
        id: 'take_weight',
        shape: { kind: 'rect', x: 190, y: 600, w: 200, h: 130 },
        label: 'A pendulum bob among the counterweights',
        hideWhen: { any: [{ hasItem: 'eng_weight' }, { flag: 'engineFitted' }] },
        action: { type: 'pickup', item: 'eng_weight' },
      },
      {
        id: 'coupling_plate',
        shape: { kind: 'rect', x: 610, y: 630, w: 240, h: 140 },
        label: 'A plate beneath the ropes',
        action: {
          type: 'inspect',
          text: 'A bronze plate, polished by generations of ringers’ boots: THE BAY ANSWERS THE TOWER. The bolts around it run down into living rock.',
        },
      },
      out.hotspot,
    ],
  };
}

export function cottageScene(): SceneDef {
  const out = exitArch(140, 'p_square_cottage', 'Out to the square', { scale: 0.8 });
  return {
    palette: 'village',
    layers: [
      ...roomShell(41),
      out.layer,
      // the cold hearth and mantel
      { kind: 'primitive', primitive: 'brazier', x: 1180, y: 400, scale: 1.05, parallax: 0.3, props: { lit: false, seed: 4 } },
      { kind: 'path', d: 'M 1120 380 h 340 v 26 h -340 Z', fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.3 },
      // the regulator wheel on the mantel
      {
        kind: 'primitive', primitive: 'gear', x: 1250, y: 300, scale: 0.4, parallax: 0.3,
        props: { r: 70, teeth: 8 },
        if: { not: { any: [{ hasItem: 'eng_valve' }, { flag: 'engineFitted' }] } },
      },
      // her table, letters weighted with beach stones
      { kind: 'path', d: 'M 480 640 h 330 l 24 -80 h -330 Z M 540 640 v 140 M 750 640 v 140', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'path', d: 'M 540 560 h 70 v 12 h -70 Z M 640 552 h 84 v 12 h -84 Z', fill: 'var(--p-wall-light)', opacity: 0.85, parallax: 0.4 },
      // the psalter on its stand
      { kind: 'primitive', primitive: 'glyphPanel', x: 300, y: 440, scale: 0.45, parallax: 0.35, props: { rows: 1, cols: 2, seed: 43, glow: true } },
      // the writing desk
      { kind: 'path', d: 'M 900 620 h 260 l 20 -90 h -260 Z M 950 620 v 160 M 1110 620 v 160', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      // her lantern on its hook
      { kind: 'primitive', primitive: 'torch', x: 660, y: 250, scale: 0.75, parallax: 0.25, props: { lit: false, seed: 11 }, if: { not: { any: [{ hasItem: 'maren_lantern' }, { solved: 'pz_quieting' }] } } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'letters',
        shape: { kind: 'rect', x: 480, y: 540, w: 340, h: 110 },
        label: 'Letters weighted with beach stones',
        action: {
          type: 'inspect',
          text: 'A whole correspondence, written and never sent — the address side of every one left blank, as if she could not decide which was harder: sending them, or admitting there was no longer anywhere to send them to.',
        },
      },
      {
        id: 'psalter',
        shape: { kind: 'rect', x: 290, y: 430, w: 200, h: 160 },
        label: 'A psalter on its stand',
        action: {
          type: 'inspect',
          text: "The psalter falls open where the spine is broken: the Ebb Psalm. One verse is underlined twice — 'Twice call the EBB, then call the HOUR, and let the FOG bell close the bay.' You copy it, margin note and all.",
          effects: [{ type: 'unlockJournal', entry: 'j_hymn' }],
        },
      },
      {
        id: 'hearth_wheel',
        shape: { kind: 'circle', cx: 1305, cy: 355, r: 70 },
        label: 'A small brass wheel on the mantel',
        hideWhen: { any: [{ hasItem: 'eng_valve' }, { flag: 'engineFitted' }] },
        action: {
          type: 'inspect',
          text: 'The regulator wheel from the Tidal Engine, set on the mantel like a clock. She did not lose the engine’s heart. She took it, so that whoever came next would have to come here first, and read her letters.',
          effects: [
            { type: 'giveItem', item: 'eng_valve' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'take_lantern',
        shape: { kind: 'rect', x: 650, y: 250, w: 100, h: 220 },
        label: "A keeper's lantern on its hook",
        hideWhen: { any: [{ hasItem: 'maren_lantern' }, { solved: 'pz_quieting' }] },
        action: {
          type: 'inspect',
          text: 'Storm-glass and tin, wick trimmed, oil topped. She left it filled and did not take it into the dark with her. That was not forgetfulness. It was a bequest.',
          effects: [
            { type: 'giveItem', item: 'maren_lantern' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'desk',
        shape: { kind: 'rect', x: 890, y: 520, w: 300, h: 180 },
        label: "Maren's locked writing desk",
        hideWhen: { solved: 'pz_desk' },
        action: { type: 'puzzle', puzzle: 'pz_desk' },
      },
      {
        id: 'desk_open',
        shape: { kind: 'rect', x: 890, y: 520, w: 300, h: 180 },
        label: 'The opened desk',
        if: { solved: 'pz_desk' },
        action: {
          type: 'inspect',
          text: 'Pen, blotter, a drawer that now slides freely. The desk of someone who kept accounts with the sea and expected to be audited.',
        },
      },
      out.hotspot,
    ],
  };
}

export function orchardScene(): SceneDef {
  const back = exitArch(140, 'p_square_orchard', 'Back to the village square', { scale: 0.8 });
  const light = exitArch(1140, 'p_orchard_lighthouse', 'The path up to the lighthouse', {
    scale: 0.85,
    lit: true,
  });
  const obs = exitArch(680, 'p_orchard_observatory', 'A track to the headland observatory', {
    scale: 0.65,
  });
  return {
    palette: 'shore',
    layers: [
      ...seaHorizon(340, 190),
      ...headland(7),
      back.layer,
      obs.layer,
      light.layer,
      // the wind-bent plums
      { kind: 'primitive', primitive: 'tree', x: 320, y: 210, parallax: 0.2, props: { seed: 2 } },
      { kind: 'primitive', primitive: 'tree', x: 520, y: 240, scale: 0.85, parallax: 0.25, props: { seed: 7 } },
      { kind: 'primitive', primitive: 'tree', x: 1000, y: 230, scale: 0.9, parallax: 0.22, props: { seed: 4, bare: true } },
      // the moondial on its plinth
      { kind: 'primitive', primitive: 'clockFace', x: 780, y: 560, scale: 0.55, parallax: 0.38, props: { r: 120, hourAngle: 210, minuteAngle: 30, glow: true } },
      { kind: 'path', d: 'M 830 690 h 80 v 90 h -80 Z', fill: 'var(--p-wall-mid)', parallax: 0.38 },
      // the oldest plum, hollow at the root
      {
        kind: 'primitive', primitive: 'glint', x: 400, y: 620, scale: 1.1, parallax: 0.4,
        if: { not: { any: [{ hasItem: 'cottage_key' }, { flag: 'cottageOpen' }] } },
      },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'moondial',
        shape: { kind: 'rect', x: 760, y: 550, w: 190, h: 230 },
        label: 'A moondial on a plinth',
        action: {
          type: 'inspect',
          text: "A dial read by moon-shadow, its rim worn but legible: 'FULL I rise. HALF I keep the watch. DARK I close my eye.' You note the three phases in order.",
          effects: [{ type: 'unlockJournal', entry: 'j_moondial' }],
        },
      },
      {
        id: 'take_key',
        shape: { kind: 'circle', cx: 415, cy: 650, r: 70 },
        label: 'A hollow at the root of the oldest plum',
        hideWhen: { any: [{ hasItem: 'cottage_key' }, { flag: 'cottageOpen' }] },
        action: {
          type: 'inspect',
          text: "Wrapped in waxed sailcloth inside the hollow: an iron key, orange with rust. Her letter to the ferryman said it plainly, if you were listening — the key lives where the plums ripen first.",
          effects: [
            { type: 'giveItem', item: 'cottage_key' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'trees',
        shape: { kind: 'rect', x: 280, y: 220, w: 420, h: 300 },
        label: 'The wind-bent plum trees',
        action: {
          type: 'inspect',
          text: 'Every tree leans away from the sea like a congregation turning from bad news. The fruit is small, dark, and improbably sweet. Someone pruned these this spring. There is no one to have pruned them.',
        },
      },
      back.hotspot,
      obs.hotspot,
      light.hotspot,
    ],
  };
}
