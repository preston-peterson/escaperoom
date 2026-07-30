/** The east wing — landing and the three guest rooms, unheated since midnight. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  coldHaze,
  frameShadow,
  interiorDoor,
  roomShell,
  snowWindow,
  windowSpill,
} from './common.ts';

export function landingScene(): SceneDef {
  const ivy = interiorDoor(160, 'p_landing_ivy', 'Ivy Wren’s room', { scale: 0.8 });
  const casque = interiorDoor(680, 'p_landing_casque', 'Dr. Casque’s room', { scale: 0.8 });
  const faro = interiorDoor(1200, 'p_landing_faro', 'Julian Faro’s room', { scale: 0.8 });
  const maids = interiorDoor(1000, 'p_landing_kitchen', 'The maids’ stair, down to the kitchen', {
    scale: 0.6,
    if: { flag: 'drift_fallen' },
  });
  return {
    palette: 'frost',
    layers: [
      ...roomShell(29, { style: 'wood' }),
      snowWindow(430, { scale: 0.7, shape: 'arched', y: 140 }),
      windowSpill(430, 225),
      ivy.layers[0],
      casque.layers[0],
      faro.layers[0],
      ...maids.layers,
      // The main stair down — swallowed whole when the drift falls.
      { kind: 'primitive', primitive: 'stairs', x: 500, y: 330, scale: 0.7, parallax: 0.2, props: { steps: 8 } },
      { kind: 'path', d: 'M 480 580 L 500 380 Q 640 300 840 360 L 860 580 Z', fill: 'var(--p-fog)', opacity: 0.92, parallax: 0.2, if: { flag: 'drift_fallen' } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 900, y: 170, scale: 0.6, parallax: 0.15, props: { seed: 21, oval: true } },
      coldHaze(0.14),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'skylight',
        shape: { kind: 'rect', x: 500, y: 40, w: 600, h: 100 },
        label: 'The stairwell skylight',
        hideWhen: { flag: 'drift_fallen' },
        action: {
          type: 'inspect',
          text: 'The skylight over the stairwell carries the whole weight of the storm — a grey ceiling of packed snow, ticking and settling. The glass complains about it in a voice you would rather not hear twice.',
        },
      },
      {
        id: 'drift_wall',
        shape: { kind: 'rect', x: 480, y: 300, w: 400, h: 280 },
        label: 'The fallen drift',
        if: { flag: 'drift_fallen' },
        action: {
          type: 'inspect',
          text: 'The stairwell is a solid white throat. It will take the village men a day with shovels — which is a day the case does not have. The maids’ stair it is.',
        },
      },
      {
        id: 'stair_down',
        shape: { kind: 'rect', x: 500, y: 330, w: 360, h: 250 },
        label: 'The main stair, down to the hall',
        hideWhen: { flag: 'drift_fallen' },
        action: { type: 'navigate', passage: 'p_foyer_landing' },
      },
      ivy.hotspot,
      casque.hotspot,
      faro.hotspot,
      maids.hotspot,
    ],
  };
}

export function ivyRoomScene(): SceneDef {
  const landing = interiorDoor(1300, 'p_landing_ivy', 'Back to the landing', { scale: 0.85 });
  return {
    palette: 'frost',
    layers: [
      ...roomShell(31, { style: 'velvet' }),
      landing.layers[0],
      snowWindow(880, { scale: 0.85 }),
      windowSpill(880, 270),
      { kind: 'primitive', primitive: 'furniture', x: 180, y: 560, scale: 1.0, parallax: 0.3, props: { kind: 'berth', seed: 2 } },
      // The music box on its table.
      { kind: 'primitive', primitive: 'furniture', x: 560, y: 640, scale: 0.7, parallax: 0.4, props: { kind: 'table', seed: 9 } },
      { kind: 'path', d: 'M 640 620 H 760 V 680 H 640 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.42 },
      { kind: 'primitive', primitive: 'glint', x: 700, y: 615, scale: 0.8, parallax: 0.44, if: { not: { solved: 'pz_music_box' } } },
      { kind: 'primitive', primitive: 'paperScrap', x: 400, y: 700, scale: 0.9, parallax: 0.45, props: { kind: 'letter', rotate: 9, seed: 17 }, if: { solved: 'pz_music_box' } },
      coldHaze(0.1),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'music_box',
        shape: { kind: 'rect', x: 600, y: 590, w: 220, h: 130 },
        label: 'The music box, its spindle bare',
        hideWhen: { solved: 'pz_music_box' },
        action: { type: 'puzzle', puzzle: 'pz_music_box' },
      },
      {
        id: 'music_box_done',
        shape: { kind: 'rect', x: 600, y: 590, w: 220, h: 130 },
        label: 'The music box, singing again',
        if: { solved: 'pz_music_box' },
        action: {
          type: 'inspect',
          text: 'Her mother’s waltz, thin and patient in the cold. The false bottom stands open, its letters read and refiled in your case notes. Whatever Ivy Wren is, she is not this.',
        },
      },
      {
        id: 'ivy_window',
        shape: { kind: 'rect', x: 880, y: 120, w: 320, h: 420 },
        label: 'Her window',
        action: {
          type: 'inspect',
          text: 'Shut fast, latched, frost feathering the inside of the glass as it does in every unheated room. It looks down on the long white roof of the conservatory — the warm room, when the house still had one.',
        },
      },
      landing.hotspot,
    ],
  };
}

export function casqueRoomScene(): SceneDef {
  const landing = interiorDoor(1300, 'p_landing_casque', 'Back to the landing', { scale: 0.85 });
  return {
    palette: 'frost',
    layers: [
      ...roomShell(37, { style: 'wood' }),
      landing.layers[0],
      snowWindow(560, { scale: 0.8 }),
      windowSpill(560, 255),
      // Her desk, the framed doctorate above it.
      { kind: 'primitive', primitive: 'furniture', x: 880, y: 560, scale: 0.95, parallax: 0.35, props: { kind: 'desk', seed: 22 } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 950, y: 200, scale: 0.55, parallax: 0.15, props: { seed: 23, empty: true } },
      // The medicine chest.
      { kind: 'path', d: 'M 180 520 H 420 V 700 H 180 Z', fill: 'var(--p-wall-mid)', parallax: 0.32 },
      { kind: 'path', d: 'M 180 520 H 420 V 545 H 180 Z', fill: 'var(--p-accent)', opacity: 0.6, parallax: 0.32 },
      { kind: 'primitive', primitive: 'glint', x: 300, y: 560, scale: 0.9, parallax: 0.34, if: { not: { solved: 'pz_medicine_chest' } } },
      // The washstand that kept her notebook.
      { kind: 'primitive', primitive: 'furniture', x: 520, y: 640, scale: 0.65, parallax: 0.42, props: { kind: 'table', seed: 24 } },
      coldHaze(0.1),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'doctorate',
        shape: { kind: 'rect', x: 940, y: 190, w: 180, h: 220 },
        label: 'Her framed doctorate',
        action: {
          type: 'inspect',
          text: 'Marchford College of Physicians, conferred with honors upon Lenore Casque — in the year 1894. The glass is dusted weekly. Whatever else she neglected, it was never this.',
        },
      },
      {
        id: 'medicine_chest',
        shape: { kind: 'rect', x: 170, y: 500, w: 270, h: 220 },
        label: 'The locked medicine chest',
        hideWhen: { solved: 'pz_medicine_chest' },
        action: { type: 'puzzle', puzzle: 'pz_medicine_chest' },
      },
      {
        id: 'chest_open',
        shape: { kind: 'rect', x: 170, y: 500, w: 270, h: 220 },
        label: 'The opened medicine chest',
        if: { solved: 'pz_medicine_chest' },
        action: {
          type: 'inspect',
          text: 'Every vial sealed in its velvet — and the one empty socket, printed FOXGLOVE TCT. on the card beneath it, saying more than the rest of the room put together.',
        },
      },
      {
        id: 'washstand',
        shape: { kind: 'rect', x: 500, y: 610, w: 220, h: 150 },
        label: 'The washstand',
        if: { solved: 'pz_medicine_chest' },
        action: {
          type: 'inspect',
          text: 'Now you know what to look for, you search like you mean it — and there, fallen flat behind the washstand where a hurried packing missed it: her dosage notebook. The last page is arithmetic worked three times over, and it is not medicine.',
          effects: [{ type: 'unlockJournal', entry: 'j_ev_notebook' }],
        },
      },
      {
        id: 'washstand_early',
        shape: { kind: 'rect', x: 500, y: 610, w: 220, h: 150 },
        label: 'The washstand',
        hideWhen: { solved: 'pz_medicine_chest' },
        action: {
          type: 'inspect',
          text: 'Basin, ewer, a cake of soap gone cloudy with cold. A room packed in a hurry keeps its secrets in the gaps — but you do not yet know which gaps to search.',
        },
      },
      landing.hotspot,
    ],
  };
}

export function faroRoomScene(): SceneDef {
  const landing = interiorDoor(1300, 'p_landing_faro', 'Back to the landing', { scale: 0.85 });
  return {
    palette: 'frost',
    layers: [
      ...roomShell(41, { style: 'wood', wainscot: false }),
      landing.layers[0],
      // The window he never closed, snow tongued across the floor beneath it.
      snowWindow(520, { scale: 0.9, lit: false }),
      { kind: 'path', d: 'M 500 560 Q 660 540 840 575 Q 760 650 640 645 Q 540 640 500 560 Z', fill: 'var(--p-fog)', opacity: 0.85, parallax: 0.2 },
      windowSpill(520, 290),
      { kind: 'primitive', primitive: 'furniture', x: 140, y: 560, scale: 0.95, parallax: 0.3, props: { kind: 'berth', seed: 12 } },
      // Manuscripts everywhere; the valve wheel weighting the tallest stack.
      { kind: 'primitive', primitive: 'paperScrap', x: 940, y: 660, scale: 1.0, parallax: 0.42, props: { kind: 'letter', rotate: -12, seed: 25 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1060, y: 700, scale: 1.0, parallax: 0.44, props: { kind: 'letter', rotate: 7, seed: 26 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1000, y: 620, scale: 1.0, parallax: 0.43, props: { kind: 'letter', rotate: 2, seed: 27 } },
      {
        kind: 'primitive', primitive: 'gear', x: 1030, y: 585, scale: 0.42, parallax: 0.45,
        props: { r: 90, teeth: 8 },
        if: { not: { any: [{ hasItem: 'valve_wheel' }, { solved: 'pz_boiler_parts' }] } },
      },
      coldHaze(0.16),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'open_window',
        shape: { kind: 'rect', x: 500, y: 120, w: 340, h: 440 },
        label: 'The window he left open',
        action: {
          type: 'inspect',
          text: 'Open an inch for five days of blizzard, because a poet requires “weather he can hear.” The room paid for it, the corridor paid for it, and — by the sound the stairwell skylight just made — the house may be about to pay for it.',
        },
      },
      {
        id: 'valve_wheel',
        shape: { kind: 'circle', cx: 1070, cy: 625, r: 60 },
        label: 'A brass wheel weighting the manuscripts',
        hideWhen: { any: [{ hasItem: 'valve_wheel' }, { solved: 'pz_boiler_parts' }] },
        action: { type: 'pickup', item: 'valve_wheel' },
      },
      {
        id: 'manuscripts',
        shape: { kind: 'rect', x: 920, y: 640, w: 300, h: 140 },
        label: 'The manuscripts',
        action: {
          type: 'inspect',
          text: 'An epic, apparently, on the theme of noble poverty. In the margins, sums: what he owed the tailor, what he owed the wine merchant, what he owed Wren. Poets weight their pages with the strangest things.',
        },
      },
      landing.hotspot,
    ],
  };
}
