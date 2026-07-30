/** The study — the staged crime scene behind the letter-locked door. */
import type { SceneDef } from '../../../engine/types.ts';
import { frameShadow, interiorDoor, roomShell, snowWindow, windowSpill } from './common.ts';

export function studyScene(): SceneDef {
  const foyer = interiorDoor(1300, 'p_foyer_study', 'Back to the entrance hall', { scale: 0.85 });
  const jib = interiorDoor(60, 'p_pantry_study', 'The jib door in the paneling', {
    scale: 0.75,
    if: { flag: 'passage_open' },
  });
  return {
    palette: 'parlor',
    layers: [
      ...roomShell(23, { style: 'velvet' }),
      foyer.layers[0],
      ...jib.layers,
      // The hairline seam, before the passage is known.
      { kind: 'path', d: 'M 152 250 H 158 V 578 H 152 Z', fill: 'var(--p-wall-dark)', opacity: 0.6, parallax: 0.15, if: { not: { flag: 'passage_open' } } },
      // The study window, curtained, with its too-perfect sill snow.
      snowWindow(560, { scale: 0.9 }),
      { kind: 'path', d: 'M 540 120 H 590 Q 575 350 600 500 L 540 500 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.1 },
      { kind: 'path', d: 'M 560 492 Q 700 462 850 492 L 850 512 L 560 512 Z', fill: 'var(--p-fog)', opacity: 0.9, parallax: 0.12 },
      windowSpill(560, 290),
      // Desk, letter tray, and the drawer that holds Ivy's cylinder.
      { kind: 'primitive', primitive: 'furniture', x: 960, y: 550, scale: 1.05, parallax: 0.35, props: { kind: 'desk', seed: 14 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1030, y: 545, scale: 0.95, parallax: 0.38, props: { kind: 'letter', rotate: 4, seed: 15 } },
      // The tantalus on its sideboard by the window.
      { kind: 'path', d: 'M 430 560 H 560 V 690 H 430 Z', fill: 'var(--p-wall-mid)', parallax: 0.34 },
      { kind: 'path', d: 'M 445 500 H 545 V 560 H 445 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.35, if: { not: { solved: 'pz_tantalus' } } },
      { kind: 'path', d: 'M 445 520 H 545 V 560 H 445 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.35, if: { solved: 'pz_tantalus' } },
      { kind: 'primitive', primitive: 'glint', x: 495, y: 505, scale: 0.8, parallax: 0.36, if: { not: { solved: 'pz_tantalus' } } },
      // The body, under its sheet. Kept quiet, kept covered.
      { kind: 'primitive', primitive: 'bodyOutline', x: 620, y: 660, scale: 1.0, parallax: 0.45, props: { style: 'sheet' } },
      { kind: 'primitive', primitive: 'glint', x: 890, y: 730, scale: 0.7, parallax: 0.46, if: { not: { solved: 'pz_tantalus' } } },
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'body',
        shape: { kind: 'rect', x: 610, y: 640, w: 440, h: 200 },
        label: 'The body of Aldous Wren, under a sheet',
        action: {
          type: 'inspect',
          text: 'You lift the sheet only as far as duty requires. The letter opener stands where the constable’s sketch says it stood — and beneath it, a stain the size of a coin, on a wound that should have flooded the carpet. Dead men do not bleed. The blade came hours too late to kill him.',
          effects: [{ type: 'unlockJournal', entry: 'j_ev_wound' }],
        },
      },
      {
        id: 'letter_tray',
        shape: { kind: 'rect', x: 1010, y: 520, w: 200, h: 90 },
        label: 'The letter tray',
        action: {
          type: 'inspect',
          text: 'Sealed, stamped, and trapped by the storm: a letter to a consulting physician in town, asking — in confidence — to be examined by a stranger. Wren doubted his own diagnosis. Dated the day the snow began.',
          effects: [{ type: 'unlockJournal', entry: 'j_lore_letter' }],
        },
      },
      {
        id: 'desk_drawer',
        shape: { kind: 'rect', x: 960, y: 630, w: 180, h: 110 },
        label: 'The desk drawer',
        hideWhen: { any: [{ hasItem: 'brass_cylinder' }, { solved: 'pz_music_box' }] },
        action: {
          type: 'inspect',
          text: 'Pen nibs, sealing wax, and — wrapped in a handkerchief like something apologized to — the brass cylinder of a music box. You pocket it. Somewhere upstairs is the mechanism it belongs to.',
          effects: [
            { type: 'giveItem', item: 'brass_cylinder' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'tantalus',
        shape: { kind: 'rect', x: 420, y: 490, w: 160, h: 210 },
        label: 'The locked tantalus',
        hideWhen: { solved: 'pz_tantalus' },
        action: { type: 'puzzle', puzzle: 'pz_tantalus' },
      },
      {
        id: 'tantalus_done',
        shape: { kind: 'rect', x: 420, y: 490, w: 160, h: 210 },
        label: 'The opened tantalus',
        if: { solved: 'pz_tantalus' },
        action: {
          type: 'inspect',
          text: 'The decanter sits in the light with its green-brown sediment plain as a signature. One glass poured, one glass drained, one man dead of his own unbreakable ritual.',
        },
      },
      {
        id: 'sill',
        shape: { kind: 'rect', x: 560, y: 460, w: 300, h: 70 },
        label: 'The snow on the sill',
        if: { solved: 'pz_tantalus' },
        action: {
          type: 'inspect',
          text: 'Square-edged, undrifted, bone-dry beneath. Real snow that blows into a warm house weeps where it lands. This never wept. It was carried in.',
        },
      },
      {
        id: 'jib_seam',
        shape: { kind: 'rect', x: 130, y: 250, w: 60, h: 330 },
        label: 'A hairline seam in the paneling',
        hideWhen: { flag: 'passage_open' },
        action: {
          type: 'inspect',
          text: 'A seam too straight to be shrinkage, running floor to picture-rail beside the bookcase — a jib door, and bolted or latched from the FAR side. Doors that only open from within walls are opened from somewhere. The service rooms would know where.',
        },
      },
      jib.hotspot,
      foyer.hotspot,
    ],
  };
}
