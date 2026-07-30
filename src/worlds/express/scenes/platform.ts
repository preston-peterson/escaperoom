/** The border platform at Vellenbruck — snow, cordon, and the sealed train. */
import type { SceneDef } from '../../../engine/types.ts';
import { frameEdges } from './common.ts';

export function platformScene(): SceneDef {
  return {
    palette: 'frost',
    layers: [
      // night sky and falling snow
      { kind: 'path', d: 'M 0 0 L 1600 0 L 1600 460 L 0 460 Z', fill: 'var(--p-sky-top)', parallax: 0 },
      { kind: 'primitive', primitive: 'fog', x: 0, y: 40, parallax: 0.08, props: { w: 1600, h: 260, opacity: 0.2, speed: 40 } },
      // the flank of the Sable Express, iron and dark
      { kind: 'primitive', primitive: 'panelWall', x: 80, y: 180, parallax: 0.1, props: { w: 1520, h: 300, seed: 9, style: 'iron', wainscot: false } },
      // dark carriage windows — the emptied train
      { kind: 'primitive', primitive: 'windowPane', x: 260, y: 210, scale: 0.5, parallax: 0.1, props: { shape: 'sash', weather: 'night', lit: false } },
      { kind: 'primitive', primitive: 'windowPane', x: 560, y: 210, scale: 0.5, parallax: 0.1, props: { shape: 'sash', weather: 'night', lit: false } },
      { kind: 'primitive', primitive: 'windowPane', x: 1160, y: 210, scale: 0.5, parallax: 0.1, props: { shape: 'sash', weather: 'night', lit: false } },
      // the sealed dining-car door
      { kind: 'primitive', primitive: 'door', x: 820, y: 200, scale: 0.65, parallax: 0.1, props: { open: false }, if: { not: { solved: 'pz_cordon' } } },
      { kind: 'primitive', primitive: 'door', x: 820, y: 200, scale: 0.65, parallax: 0.1, props: { open: true }, if: { solved: 'pz_cordon' } },
      // lead seal glint on the door
      { kind: 'primitive', primitive: 'glint', x: 900, y: 330, scale: 1.1, parallax: 0.12, props: { r: 8 }, if: { not: { solved: 'pz_cordon' } } },
      // snowbound platform
      { kind: 'path', d: 'M 0 900 L 0 480 L 1600 480 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 0 480 L 1600 480 L 1600 520 L 0 520 Z', fill: 'var(--p-fog)', opacity: 0.35, parallax: 0 },
      // the cordon rope on its stanchions
      { kind: 'path', d: 'M 60 596 q 380 -44 760 2 q 380 44 720 -8 L 1540 606 q -340 50 -720 6 q -380 -44 -760 2 Z', fill: 'var(--p-accent)', opacity: 0.65, parallax: 0.3 },
      // post board, cordon lamp, docket box, the guard's barrow
      { kind: 'path', d: 'M 130 300 L 380 300 L 380 560 L 130 560 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      { kind: 'primitive', primitive: 'paperScrap', x: 160, y: 330, scale: 1.1, parallax: 0.2, props: { kind: 'letter', rotate: -2, seed: 3 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 220, y: 440, scale: 0.9, parallax: 0.2, props: { kind: 'ledger', rotate: 3, seed: 8 } },
      { kind: 'primitive', primitive: 'chandelier', x: 1330, y: 120, scale: 0.8, parallax: 0.2, props: { style: 'lantern', lit: true, sway: true } },
      { kind: 'path', d: 'M 1400 620 L 1540 620 L 1540 780 L 1400 780 Z', fill: 'var(--p-wall-dark)', parallax: 0.4 },
      { kind: 'path', d: 'M 1418 648 L 1522 648 L 1522 664 L 1418 664 Z', fill: 'var(--p-glow)', opacity: 0.5, parallax: 0.4 },
      { kind: 'primitive', primitive: 'furniture', x: 480, y: 560, scale: 0.8, parallax: 0.45, props: { kind: 'chair', seed: 5 } },
      { kind: 'primitive', primitive: 'fog', x: 0, y: 640, parallax: 0.55, props: { w: 1600, h: 220, opacity: 0.16 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'notice',
        shape: { kind: 'rect', x: 150, y: 320, w: 130, h: 130 },
        label: 'The cordon notice',
        action: {
          type: 'inspect',
          text: 'The hold order, nailed to the post board, its ink barely dry: the express logged at 04:17, one passenger dead behind his own night latch, the train sealed empty. You copy it into the case file.',
          effects: [{ type: 'unlockJournal', entry: 'j_case_brief' }],
        },
      },
      {
        id: 'manifest',
        shape: { kind: 'rect', x: 200, y: 430, w: 150, h: 120 },
        label: "The inspector's passenger manifest",
        action: {
          type: 'inspect',
          text: 'The inspector took statements before releasing the passengers to the waiting hall. Five names, five stories, five berths. You open a dossier on each of them.',
          effects: [
            { type: 'unlockJournal', entry: 'j_dossier_voss' },
            { type: 'unlockJournal', entry: 'j_dossier_brandt' },
            { type: 'unlockJournal', entry: 'j_dossier_kohl' },
            { type: 'unlockJournal', entry: 'j_dossier_stasny' },
            { type: 'unlockJournal', entry: 'j_dossier_blaine' },
          ],
        },
      },
      {
        id: 'guard_coat',
        shape: { kind: 'rect', x: 470, y: 560, w: 180, h: 200 },
        label: 'The guard’s greatcoat, dumped over a chair',
        hideWhen: { any: [{ hasItem: 'baggage_key' }, { flag: 'baggage_unlocked' }] },
        action: { type: 'pickup', item: 'baggage_key' },
      },
      {
        id: 'seal',
        shape: { kind: 'rect', x: 800, y: 200, w: 220, h: 320 },
        label: 'The customs seal on the dining-car door',
        hideWhen: { solved: 'pz_cordon' },
        action: { type: 'puzzle', puzzle: 'pz_cordon' },
      },
      {
        id: 'board_train',
        shape: { kind: 'rect', x: 800, y: 200, w: 220, h: 320 },
        label: 'Board the dining car',
        if: { solved: 'pz_cordon' },
        action: { type: 'navigate', passage: 'p_platform_dining' },
      },
      {
        id: 'docket_box',
        shape: { kind: 'rect', x: 1390, y: 610, w: 170, h: 190 },
        label: 'The cordon box — the inquiry docket',
        action: { type: 'puzzle', puzzle: 'pz_accuse' },
      },
      {
        id: 'waiting_hall',
        shape: { kind: 'rect', x: 40, y: 620, w: 300, h: 200 },
        label: 'The way to the waiting hall',
        action: {
          type: 'inspect',
          text: 'Beyond the cordon rope, the waiting hall glows faint through the snow. Every passenger of the Sable Express sits in there under the border’s eye — and none of them can touch the train again. Only you can.',
        },
      },
    ],
  };
}
