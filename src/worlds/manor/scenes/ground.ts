/** Ground floor — Entrance Hall, Parlor, Library. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  coldHaze,
  frameShadow,
  interiorDoor,
  roomShell,
  snowWindow,
  windowSpill,
} from './common.ts';

export function foyerScene(): SceneDef {
  const parlor = interiorDoor(120, 'p_foyer_parlor', 'The parlor', { scale: 0.85 });
  const library = interiorDoor(1290, 'p_foyer_library', 'The library', { scale: 0.85 });
  const kitchen = interiorDoor(980, 'p_foyer_kitchen', 'The kitchen corridor', { scale: 0.7 });
  const study = interiorDoor(1080, 'p_foyer_study', 'The study door', {
    scale: 0.9,
    openIf: { solved: 'pz_study_door' },
  });
  return {
    palette: 'parlor',
    layers: [
      ...roomShell(7, { style: 'wood' }),
      // Front double doors, drifted shut, snow spilling under.
      { kind: 'primitive', primitive: 'door', x: 560, y: 120, scale: 1.05, parallax: 0.12, props: { open: false } },
      { kind: 'primitive', primitive: 'door', x: 690, y: 120, scale: 1.05, parallax: 0.12, props: { open: false } },
      { kind: 'path', d: 'M 540 582 Q 700 540 880 582 Q 800 610 700 610 Q 620 610 540 582 Z', fill: 'var(--p-fog)', opacity: 0.85, parallax: 0.14 },
      snowWindow(360, { scale: 0.75, y: 180 }),
      windowSpill(360, 240),
      // The great clock, hands dead at 12:40.
      { kind: 'primitive', primitive: 'clockFace', x: 810, y: 150, scale: 0.55, parallax: 0.18, props: { hourAngle: 20, minuteAngle: 240 }, if: { not: { solved: 'pz_clock' } } },
      { kind: 'primitive', primitive: 'clockFace', x: 810, y: 150, scale: 0.55, parallax: 0.18, props: { hourAngle: 305, minuteAngle: 60, glow: true }, if: { solved: 'pz_clock' } },
      { kind: 'path', d: 'M 830 330 H 990 V 580 H 830 Z', fill: 'var(--p-wall-dark)', opacity: 0.55, parallax: 0.18 },
      // Stairs up to the east landing — and the drift that buries them.
      { kind: 'primitive', primitive: 'stairs', x: 40, y: 260, scale: 0.9, parallax: 0.2, props: { steps: 9 } },
      { kind: 'path', d: 'M 40 580 L 60 340 Q 200 240 460 300 L 480 580 Z', fill: 'var(--p-fog)', opacity: 0.92, parallax: 0.2, if: { flag: 'drift_fallen' } },
      parlor.layers[0],
      library.layers[0],
      kitchen.layers[0],
      ...study.layers,
      // The hall table with the constable's case satchel and statements.
      { kind: 'primitive', primitive: 'furniture', x: 530, y: 620, scale: 0.8, parallax: 0.4, props: { kind: 'table' } },
      { kind: 'primitive', primitive: 'paperScrap', x: 600, y: 620, scale: 0.9, parallax: 0.42, props: { kind: 'letter', rotate: -8, seed: 3 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 720, y: 635, scale: 0.9, parallax: 0.42, props: { kind: 'photo', rotate: 5, seed: 9 } },
      { kind: 'primitive', primitive: 'chandelier', x: 620, y: 0, scale: 1.0, parallax: 0.25, props: { style: 'crystal', lit: true } },
      coldHaze(0.08),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'front_doors',
        shape: { kind: 'rect', x: 560, y: 120, w: 400, h: 470 },
        label: 'The front doors, drifted shut',
        action: {
          type: 'inspect',
          text: 'Drifted shut to the handles and frozen there. You came up the valley on snowshoes past a village full of evacuated houseguests; nobody comes or goes by these doors until the pass is cut open tomorrow. The house is yours, and the truth is somewhere in it.',
        },
      },
      {
        id: 'clock',
        shape: { kind: 'rect', x: 810, y: 140, w: 190, h: 440 },
        label: 'The great hall clock, stopped',
        hideWhen: { solved: 'pz_clock' },
        action: { type: 'puzzle', puzzle: 'pz_clock' },
      },
      {
        id: 'clock_done',
        shape: { kind: 'rect', x: 810, y: 140, w: 190, h: 440 },
        label: 'The great clock, ticking again',
        if: { solved: 'pz_clock' },
        action: {
          type: 'inspect',
          text: 'The pendulum swings its slow gold arc. 12:40 is written safely in your notes, where no amount of winding can forgive it away.',
        },
      },
      {
        id: 'case_satchel',
        shape: { kind: 'rect', x: 520, y: 590, w: 360, h: 200 },
        label: 'The constable’s case satchel',
        action: { type: 'puzzle', puzzle: 'pz_accuse' },
      },
      {
        id: 'buried_stair',
        shape: { kind: 'rect', x: 40, y: 300, w: 420, h: 280 },
        label: 'The main stair, buried',
        if: { flag: 'drift_fallen' },
        action: {
          type: 'inspect',
          text: 'A wall of blue-white snow, packed to the ceiling, where the east wing used to begin. The maids’ stair off the kitchen is the only way up now.',
        },
      },
      {
        id: 'stair_up',
        shape: { kind: 'rect', x: 60, y: 280, w: 400, h: 300 },
        label: 'The main stair to the east landing',
        hideWhen: { flag: 'drift_fallen' },
        action: { type: 'navigate', passage: 'p_foyer_landing' },
      },
      {
        id: 'study_lock',
        shape: { kind: 'rect', x: 1050, y: 300, w: 90, h: 180 },
        label: 'The study letter-lock',
        hideWhen: { solved: 'pz_study_door' },
        action: { type: 'puzzle', puzzle: 'pz_study_door' },
      },
      parlor.hotspot,
      library.hotspot,
      kitchen.hotspot,
      study.hotspot,
    ],
  };
}

export function parlorScene(): SceneDef {
  const foyer = interiorDoor(1300, 'p_foyer_parlor', 'Back to the entrance hall', { scale: 0.85 });
  const conservatory = interiorDoor(120, 'p_parlor_conservatory', 'The conservatory door', {
    scale: 0.9,
    openIf: { all: [{ solved: 'pz_boiler' }, { not: { flag: 'pane_fallen' } }] },
  });
  return {
    palette: 'parlor',
    layers: [
      ...roomShell(13, { style: 'velvet' }),
      ...conservatory.layers,
      // Frost sheeting the conservatory door until the thaw.
      { kind: 'path', d: 'M 118 184 H 356 V 580 H 118 Z', fill: 'var(--p-fog)', opacity: 0.45, parallax: 0.15, if: { not: { solved: 'pz_boiler' } } },
      foyer.layers[0],
      snowWindow(620, { scale: 0.85 }),
      windowSpill(620, 270),
      // The portrait of Aldous Wren over the mantel — knocked askew once the safe is found.
      { kind: 'primitive', primitive: 'portraitFrame', x: 900, y: 130, scale: 1.0, parallax: 0.18, props: { seed: 5 }, if: { not: { flag: 'will_found' } } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 900, y: 130, scale: 1.0, parallax: 0.18, props: { seed: 5, tilted: true }, if: { flag: 'will_found' } },
      { kind: 'primitive', primitive: 'glint', x: 1165, y: 190, scale: 1.1, parallax: 0.2, if: { not: { flag: 'will_found' } } },
      // Cold hearth and sitting furniture.
      { kind: 'primitive', primitive: 'brazier', x: 920, y: 480, scale: 0.75, parallax: 0.3, props: { lit: false } },
      { kind: 'primitive', primitive: 'furniture', x: 520, y: 620, scale: 0.85, parallax: 0.4, props: { kind: 'chair' } },
      { kind: 'primitive', primitive: 'furniture', x: 720, y: 650, scale: 0.75, parallax: 0.42, props: { kind: 'table', seed: 4 } },
      { kind: 'primitive', primitive: 'chandelier', x: 560, y: 0, scale: 0.85, parallax: 0.25, props: { style: 'crystal', lit: false } },
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'portrait',
        shape: { kind: 'rect', x: 890, y: 120, w: 280, h: 360 },
        label: 'The portrait of Aldous Wren',
        action: {
          type: 'inspect',
          text: 'A winter face, patient eyes. The brass plate under it holds the household account of him: locks set to family, one brandy at ten — “the moon at its height, the star at the morning hour, the sun gone under” — and his pipe among the orchids at midnight. You copy every word of it into the file.',
          effects: [{ type: 'unlockJournal', entry: 'j_lore_wren' }],
        },
      },
      {
        id: 'portrait_safe',
        shape: { kind: 'circle', cx: 1170, cy: 200, r: 46 },
        label: 'The frame hangs a hair off true',
        hideWhen: { flag: 'will_found' },
        action: {
          type: 'inspect',
          text: 'A hair off true — because the frame swings. Behind it, a wall safe stands open and unhurried, exactly as its owner left it, and inside lies a will signed a month ago. You read it twice. The second reading is colder.',
          effects: [
            { type: 'setFlag', flag: 'will_found' },
            { type: 'markSecret', secret: 'will' },
            { type: 'unlockJournal', entry: 'j_lore_will' },
          ],
        },
      },
      {
        id: 'hearth',
        shape: { kind: 'rect', x: 900, y: 470, w: 240, h: 130 },
        label: 'The cold hearth',
        action: {
          type: 'inspect',
          text: 'Grey ash, days old, raked flat by a tidy hand. Nothing was burned here in a hurry — whoever cleaned up after this murder did not need fire to do it.',
        },
      },
      conservatory.hotspot,
      foyer.hotspot,
    ],
  };
}

export function libraryScene(): SceneDef {
  const foyer = interiorDoor(120, 'p_foyer_library', 'Back to the entrance hall', { scale: 0.85 });
  return {
    palette: 'parlor',
    layers: [
      ...roomShell(19, { style: 'wood', wainscot: false }),
      foyer.layers[0],
      // Shelving and the high hollow book.
      { kind: 'primitive', primitive: 'furniture', x: 480, y: 240, scale: 1.05, parallax: 0.18, props: { kind: 'cabinet', seed: 6 } },
      { kind: 'primitive', primitive: 'furniture', x: 740, y: 240, scale: 1.05, parallax: 0.18, props: { kind: 'cabinet', seed: 7 } },
      { kind: 'primitive', primitive: 'glint', x: 560, y: 250, scale: 0.9, parallax: 0.2, if: { not: { flag: 'miniature_found' } } },
      snowWindow(1060, { scale: 0.85 }),
      windowSpill(1060, 270),
      // Ash's desk: the forged ledger and Wren's dispatch box.
      { kind: 'primitive', primitive: 'furniture', x: 560, y: 560, scale: 1.0, parallax: 0.38, props: { kind: 'desk', seed: 8 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 610, y: 560, scale: 1.05, parallax: 0.4, props: { kind: 'ledger', rotate: -4, seed: 11 } },
      { kind: 'path', d: 'M 990 560 H 1190 V 660 H 990 Z', fill: 'var(--p-wall-dark)', parallax: 0.4, if: { not: { solved: 'pz_ledger' } } },
      { kind: 'path', d: 'M 990 590 H 1190 V 660 H 990 Z', fill: 'var(--p-wall-dark)', parallax: 0.4, if: { solved: 'pz_ledger' } },
      { kind: 'path', d: 'M 995 565 H 1185 V 575 H 995 Z', fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.4, if: { not: { solved: 'pz_ledger' } } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1010, y: 500, scale: 0.9, parallax: 0.42, props: { kind: 'ledger', rotate: 6, seed: 12 }, if: { solved: 'pz_ledger' } },
      { kind: 'primitive', primitive: 'furniture', x: 1240, y: 630, scale: 0.8, parallax: 0.42, props: { kind: 'chair', seed: 3 } },
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'ash_ledger',
        shape: { kind: 'rect', x: 560, y: 530, w: 320, h: 180 },
        label: 'The ledger left open on the desk',
        action: {
          type: 'inspect',
          text: 'Two years of entries, page after page in Gideon Ash’s hand, draining the firm to a client called GREYFIELD & SONS. No directory lists any such firm. The ink is oddly uniform for two years of bookkeeping — but the sums alone would hang a partner’s reputation.',
        },
      },
      {
        id: 'dispatch_box',
        shape: { kind: 'rect', x: 980, y: 480, w: 230, h: 200 },
        label: 'Wren’s dispatch box',
        hideWhen: { solved: 'pz_ledger' },
        action: { type: 'puzzle', puzzle: 'pz_ledger' },
      },
      {
        id: 'dispatch_open',
        shape: { kind: 'rect', x: 980, y: 480, w: 230, h: 200 },
        label: 'The opened dispatch box',
        if: { solved: 'pz_ledger' },
        action: {
          type: 'inspect',
          text: 'The true accounts, the signed deed, the oilcloth that held the cellar key. Wren had already caught his partner and already forgiven him — on paper, with witnesses. Whoever planted that ledger to shout MOTIVE did not know the argument was over.',
        },
      },
      {
        id: 'hollow_book',
        shape: { kind: 'circle', cx: 570, cy: 265, r: 48 },
        label: 'One spine stands a little proud',
        hideWhen: { flag: 'miniature_found' },
        action: {
          type: 'inspect',
          text: 'A collected sermons no one at Longwinter ever read — and lighter than it should be. Hollow. Inside, a miniature of a woman with Ivy’s eyes and a ring of dark hair under glass. You put it back exactly as his hands left it.',
          effects: [
            { type: 'setFlag', flag: 'miniature_found' },
            { type: 'markSecret', secret: 'miniature' },
            { type: 'unlockJournal', entry: 'j_lore_miniature' },
          ],
        },
      },
      foyer.hotspot,
    ],
  };
}
