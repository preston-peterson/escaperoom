/** The service wing — kitchen, Mrs. Tabb's room, pantry, and the cellar boiler room. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  coldHaze,
  frameShadow,
  interiorDoor,
  roomShell,
  snowWindow,
  windowSpill,
} from './common.ts';

export function kitchenScene(): SceneDef {
  const foyer = interiorDoor(1310, 'p_foyer_kitchen', 'The corridor to the entrance hall', { scale: 0.8 });
  const tabb = interiorDoor(1080, 'p_kitchen_tabb', 'Mrs. Tabb’s room', { scale: 0.7 });
  const pantry = interiorDoor(120, 'p_kitchen_pantry', 'The pantry', { scale: 0.75 });
  const maids = interiorDoor(880, 'p_landing_kitchen', 'The maids’ stair, up to the east landing', {
    scale: 0.6,
    if: { flag: 'drift_fallen' },
  });
  const service = interiorDoor(340, 'p_conservatory_kitchen', 'The conservatory service door', {
    scale: 0.65,
    if: { flag: 'pane_fallen' },
  });
  return {
    palette: 'village',
    layers: [
      ...roomShell(43, { style: 'wood', wainscot: false }),
      pantry.layers[0],
      ...service.layers,
      ...maids.layers,
      tabb.layers[0],
      foyer.layers[0],
      snowWindow(600, { scale: 0.7, y: 160 }),
      windowSpill(600, 225),
      // The great range, cold; the cellar door with its padlock.
      { kind: 'primitive', primitive: 'brazier', x: 620, y: 470, scale: 0.85, parallax: 0.3, props: { lit: false, seed: 4 } },
      { kind: 'primitive', primitive: 'door', x: 810, y: 260, scale: 0.72, parallax: 0.15, props: { open: false }, if: { not: { flag: 'cellar_open' } } },
      { kind: 'primitive', primitive: 'door', x: 810, y: 260, scale: 0.72, parallax: 0.15, props: { open: true }, if: { flag: 'cellar_open' } },
      { kind: 'primitive', primitive: 'glint', x: 900, y: 430, scale: 0.7, parallax: 0.18, if: { not: { flag: 'cellar_open' } } },
      // A pair of boots drying by the cold range.
      { kind: 'path', d: 'M 700 690 q 18 -40 34 -6 q 30 4 32 20 q -2 12 -30 12 q -34 0 -36 -26 Z', fill: 'var(--p-wall-dark)', parallax: 0.45 },
      { kind: 'path', d: 'M 760 692 q 18 -40 34 -6 q 30 4 32 20 q -2 12 -30 12 q -34 0 -36 -26 Z', fill: 'var(--p-wall-dark)', parallax: 0.45 },
      { kind: 'primitive', primitive: 'furniture', x: 200, y: 640, scale: 0.75, parallax: 0.4, props: { kind: 'table', seed: 10 } },
      coldHaze(0.08),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'padlock',
        shape: { kind: 'rect', x: 810, y: 260, w: 190, h: 320 },
        label: 'The cellar door and its padlock',
        hideWhen: { flag: 'cellar_open' },
        action: {
          type: 'useItem',
          accepts: ['cellar_key'],
          effects: [
            { type: 'setFlag', flag: 'cellar_open' },
            { type: 'removeItem', item: 'cellar_key' },
            { type: 'triggerShift', shift: 's_cellar' },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText: 'The padlock wants its own key, and nothing else you are carrying will argue with it.',
        },
      },
      {
        id: 'boots',
        shape: { kind: 'rect', x: 690, y: 660, w: 130, h: 80 },
        label: 'Boots left drying by the range',
        action: {
          type: 'inspect',
          text: 'A lady’s boots, set neatly to dry by a range that has been cold for days — soaked through and stiff, with lime-white streaks across the toes. Whitewash. The only whitewashed floor at Longwinter is under the conservatory beds.',
        },
      },
      {
        id: 'range',
        shape: { kind: 'rect', x: 600, y: 460, w: 180, h: 190 },
        label: 'The kitchen range',
        action: {
          type: 'inspect',
          text: 'Cold iron, clean flues, ash raked to a ruler’s line. Mrs. Tabb’s kingdom keeps its discipline even abandoned — everything in this room is where it should be, which is exactly why anything that isn’t will matter.',
        },
      },
      pantry.hotspot,
      service.hotspot,
      maids.hotspot,
      tabb.hotspot,
      foyer.hotspot,
    ],
  };
}

export function tabbRoomScene(): SceneDef {
  const kitchen = interiorDoor(1300, 'p_kitchen_tabb', 'Back to the kitchen', { scale: 0.85 });
  return {
    palette: 'village',
    layers: [
      ...roomShell(47, { style: 'wood' }),
      kitchen.layers[0],
      snowWindow(900, { scale: 0.75, y: 150 }),
      windowSpill(900, 240),
      { kind: 'primitive', primitive: 'furniture', x: 160, y: 300, scale: 0.9, parallax: 0.2, props: { kind: 'cabinet', seed: 30 } },
      // Her desk with the housekeeping log; the chatelaine on its hook.
      { kind: 'primitive', primitive: 'furniture', x: 520, y: 580, scale: 0.9, parallax: 0.35, props: { kind: 'desk', seed: 31 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 590, y: 575, scale: 1.0, parallax: 0.38, props: { kind: 'ledger', rotate: -3, seed: 32 } },
      { kind: 'path', d: 'M 1060 300 q 6 60 -14 96 q -20 -8 -16 -48 q 2 -32 30 -48 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.2 },
      { kind: 'primitive', primitive: 'glint', x: 440, y: 560, scale: 0.7, parallax: 0.36, if: { not: { any: [{ hasItem: 'vestas' }, { solved: 'pz_boiler' }] } } },
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'housekeeping_log',
        shape: { kind: 'rect', x: 520, y: 550, w: 300, h: 160 },
        label: 'The housekeeping log',
        action: {
          type: 'inspect',
          text: 'Thirty years in one hand. The clock: “going first, strike second, chime third, hands last — never backward; when the heat fails the great clock stops within the hour.” The boiler: “damper first of all, water before coal, coal before flame; banked at ten, burns till morning.” You copy both rituals whole.',
        },
      },
      {
        id: 'vesta_tin',
        shape: { kind: 'rect', x: 400, y: 530, w: 90, h: 70 },
        label: 'A tin of vestas on the desk',
        hideWhen: { any: [{ hasItem: 'vestas' }, { solved: 'pz_boiler' }] },
        action: { type: 'pickup', item: 'vestas' },
      },
      {
        id: 'chatelaine',
        shape: { kind: 'rect', x: 1020, y: 290, w: 90, h: 130 },
        label: 'Her chatelaine, left on its hook',
        action: {
          type: 'inspect',
          text: 'Every key in the house on one ring — pantry, linen, cellar-stores, wine ledger, all but the study and the cellar itself. She left it behind when they marched her to the village: a woman who believed she would be back by supper, and that the house should be openable without her.',
        },
      },
      kitchen.hotspot,
    ],
  };
}

export function pantryScene(): SceneDef {
  const kitchen = interiorDoor(1300, 'p_kitchen_pantry', 'Back to the kitchen', { scale: 0.85 });
  const jib = interiorDoor(180, 'p_pantry_study', 'The passage behind the shelves', {
    scale: 0.75,
    if: { flag: 'passage_open' },
  });
  return {
    palette: 'village',
    layers: [
      ...roomShell(53, { style: 'wood', wainscot: false }),
      kitchen.layers[0],
      ...jib.layers,
      // Shelf ranks — the leftmost rack is the one that swings.
      { kind: 'primitive', primitive: 'furniture', x: 160, y: 250, scale: 1.05, parallax: 0.16, props: { kind: 'cabinet', seed: 34 }, if: { not: { flag: 'passage_open' } } },
      { kind: 'primitive', primitive: 'furniture', x: 430, y: 250, scale: 1.05, parallax: 0.16, props: { kind: 'cabinet', seed: 35 } },
      { kind: 'primitive', primitive: 'furniture', x: 700, y: 250, scale: 1.05, parallax: 0.16, props: { kind: 'cabinet', seed: 36 } },
      { kind: 'primitive', primitive: 'glint', x: 395, y: 470, scale: 0.8, parallax: 0.2, if: { all: [{ visited: 'study' }, { not: { flag: 'passage_open' } }] } },
      // Flour dusted across the floor, scuffed twice through.
      { kind: 'path', d: 'M 300 700 Q 600 660 950 705 Q 800 760 600 755 Q 420 750 300 700 Z', fill: 'var(--p-fog)', opacity: 0.25, parallax: 0.45 },
      { kind: 'path', d: 'M 340 715 Q 620 680 900 718 M 350 735 Q 630 700 890 736', fill: 'var(--p-wall-dark)', opacity: 0.3, parallax: 0.45 },
      // The stoker handle among the mops.
      { kind: 'primitive', primitive: 'lever', x: 1080, y: 470, scale: 0.9, parallax: 0.3, props: { pulled: false, seed: 8 }, if: { not: { any: [{ hasItem: 'stoker_handle' }, { solved: 'pz_boiler_parts' }] } } },
      coldHaze(0.06),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'flour_scuffs',
        shape: { kind: 'rect', x: 300, y: 660, w: 650, h: 120 },
        label: 'Scuffs through the spilled flour',
        action: {
          type: 'inspect',
          text: 'A dusting of flour across the boards — and dragged through it, twice, two long parallel scuffs, heel-width apart, running from the leftmost shelf rack toward the door. Sacks are carried. This was pulled.',
        },
      },
      {
        id: 'shelf_latch',
        shape: { kind: 'circle', cx: 395, cy: 480, r: 55 },
        label: 'A worn edge on the shelf rack',
        if: { visited: 'study' },
        hideWhen: { flag: 'passage_open' },
        action: {
          type: 'inspect',
          text: 'The shelf-edge is worn glassy in one hand-sized place — the same height as the bolted seam you found in the study paneling. You grip it and lift.',
          effects: [
            { type: 'setFlag', flag: 'passage_open' },
            { type: 'triggerShift', shift: 's_passage' },
            { type: 'unlockJournal', entry: 'j_mech_passage' },
          ],
        },
      },
      {
        id: 'stoker',
        shape: { kind: 'rect', x: 1050, y: 450, w: 120, h: 200 },
        label: 'A long iron handle among the mops',
        hideWhen: { any: [{ hasItem: 'stoker_handle' }, { solved: 'pz_boiler_parts' }] },
        action: { type: 'pickup', item: 'stoker_handle' },
      },
      jib.hotspot,
      kitchen.hotspot,
    ],
  };
}

export function boilerRoomScene(): SceneDef {
  const kitchen = interiorDoor(1310, 'p_kitchen_cellar', 'Up the cellar stair', { scale: 0.8 });
  return {
    palette: 'crypt',
    layers: [
      ...roomShell(59, { style: 'iron', wainscot: false }),
      kitchen.layers[0],
      { kind: 'primitive', primitive: 'pipes', x: 120, y: 90, scale: 1.1, parallax: 0.1, props: { seed: 9 } },
      // The boiler's iron bulk and firebox.
      { kind: 'path', d: 'M 480 240 H 900 Q 940 240 940 300 V 580 H 440 V 300 Q 440 240 480 240 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      { kind: 'path', d: 'M 470 300 H 910 V 320 H 470 Z M 470 420 H 910 V 440 H 470 Z', fill: 'var(--p-wall-dark)', opacity: 0.7, parallax: 0.2 },
      { kind: 'primitive', primitive: 'gear', x: 880, y: 330, scale: 0.5, parallax: 0.25, props: { r: 90, teeth: 10, spin: false }, if: { not: { solved: 'pz_boiler' } } },
      { kind: 'primitive', primitive: 'gear', x: 880, y: 330, scale: 0.5, parallax: 0.25, props: { r: 90, teeth: 10, spin: true, dur: 14 }, if: { solved: 'pz_boiler' } },
      { kind: 'primitive', primitive: 'brazier', x: 620, y: 470, scale: 0.9, parallax: 0.28, props: { lit: false, seed: 6 }, if: { not: { solved: 'pz_boiler' } } },
      { kind: 'primitive', primitive: 'brazier', x: 620, y: 470, scale: 0.9, parallax: 0.28, props: { lit: true, seed: 6 }, if: { solved: 'pz_boiler' } },
      // The strap on the damper lever.
      { kind: 'primitive', primitive: 'lever', x: 980, y: 430, scale: 1.0, parallax: 0.3, props: { pulled: false, seed: 5 }, if: { not: { solved: 'pz_boiler' } } },
      { kind: 'primitive', primitive: 'lever', x: 980, y: 430, scale: 1.0, parallax: 0.3, props: { pulled: true, seed: 5 }, if: { solved: 'pz_boiler' } },
      { kind: 'path', d: 'M 985 470 q 40 -14 78 4 q -6 22 -40 22 q -32 0 -38 -26 Z', fill: 'var(--p-accent)', opacity: 0.8, parallax: 0.3, if: { not: { solved: 'pz_boiler' } } },
      // Wine racks along the far wall.
      { kind: 'primitive', primitive: 'furniture', x: 130, y: 380, scale: 0.85, parallax: 0.25, props: { kind: 'bar', seed: 37 } },
      coldHaze(0.1),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'damper_strap',
        shape: { kind: 'rect', x: 950, y: 400, w: 160, h: 140 },
        label: 'The damper lever, strapped shut',
        action: {
          type: 'inspect',
          text: 'A good leather luggage strap, buckled hard around the damper lever, holding it closed against the spring. Banked coals died in there for want of air, quietly, before midnight. You unbuckle it and bag it: the house did not go cold. It was made cold.',
          effects: [{ type: 'unlockJournal', entry: 'j_mech_boiler' }],
        },
      },
      {
        id: 'boiler_sockets',
        shape: { kind: 'rect', x: 440, y: 300, w: 320, h: 160 },
        label: 'The stripped fittings',
        hideWhen: { solved: 'pz_boiler_parts' },
        action: { type: 'puzzle', puzzle: 'pz_boiler_parts' },
      },
      {
        id: 'firebox',
        shape: { kind: 'rect', x: 560, y: 440, w: 220, h: 180 },
        label: 'The cold firebox',
        hideWhen: { solved: 'pz_boiler' },
        action: { type: 'puzzle', puzzle: 'pz_boiler' },
      },
      {
        id: 'firebox_lit',
        shape: { kind: 'rect', x: 560, y: 440, w: 220, h: 180 },
        label: 'The boiler, alive again',
        if: { solved: 'pz_boiler' },
        action: {
          type: 'inspect',
          text: 'Flame steady, tank muttering, pipes ticking heat up into the bones of the house. Somewhere overhead, days of frost have just been given notice.',
        },
      },
      {
        id: 'wine_racks',
        shape: { kind: 'rect', x: 120, y: 370, w: 480, h: 220 },
        label: 'The wine racks',
        action: {
          type: 'inspect',
          text: 'Racked bottles under a fur of dust, untouched — except one empty slot at shoulder height, wiped clean. The brandy that refilled the study tantalus came from here, and recently.',
        },
      },
      kitchen.hotspot,
    ],
  };
}
