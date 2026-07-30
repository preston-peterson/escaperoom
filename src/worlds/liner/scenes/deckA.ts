/** Scenes for Deck A: the First-Class Promenade, the Grand Salon, the Purser's Office. */
import type { SceneDef } from '../../../engine/types.ts';
import { deckShell, doorway, frame, porthole, swayLamp } from './common.ts';

export function promenadeScene(): SceneDef {
  return {
    palette: 'deco',
    layers: [
      // Open sky and the long grey sea, sliding past at the horizon.
      { kind: 'path', d: 'M 0 0 H 1600 V 360 H 0 Z', fill: 'var(--p-sky-top)', parallax: 0 },
      { kind: 'path', d: 'M 0 240 H 1600 V 380 H 0 Z', fill: 'var(--p-sky-bottom)', opacity: 0.7, parallax: 0 },
      { kind: 'primitive', primitive: 'sea', x: 0, y: 330, parallax: 0, props: { w: 1600, h: 230 } },
      // Teak deck.
      { kind: 'path', d: 'M 0 900 L 0 545 L 1600 545 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 0 640 H 1600 M 0 730 H 1600', fill: 'none', parallax: 0 },
      // Deckhouse wall, port side, with its three doors.
      { kind: 'primitive', primitive: 'panelWall', x: 0, y: 60, parallax: 0.05, props: { w: 700, h: 520, seed: 3, style: 'deco' } },
      // Jammed starboard vestibule to the Crane suite.
      { kind: 'primitive', primitive: 'panelWall', x: 1360, y: 60, parallax: 0.05, props: { w: 240, h: 520, seed: 8, style: 'deco', wainscot: false } },
      // Railing along the sea side, with the staged break.
      { kind: 'path', d: 'M 700 430 H 940 M 1090 430 H 1360', fill: 'none', parallax: 0.1 },
      { kind: 'path', d: 'M 700 424 H 942 V 440 H 700 Z M 1088 424 H 1360 V 440 H 1088 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.1 },
      ...[720, 800, 880, 1120, 1200, 1280, 1352].map((x) => ({
        kind: 'path' as const,
        d: `M ${x} 430 V 545 H ${x + 12} V 430 Z`,
        fill: 'var(--p-wall-dark)',
        opacity: 0.95,
        parallax: 0.1,
      })),
      // The broken section: splayed stubs leaning outward over the water.
      { kind: 'path', d: 'M 945 432 L 1000 400 L 1006 412 L 952 444 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.1 },
      { kind: 'path', d: 'M 1085 432 L 1035 396 L 1028 408 L 1078 444 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.1 },
      { kind: 'path', d: 'M 960 445 L 966 520 L 978 520 L 972 445 Z M 1062 445 L 1056 516 L 1044 516 L 1052 445 Z', fill: 'var(--p-wall-dark)', parallax: 0.1 },
      // The glint of a brass button at the rail's foot.
      {
        kind: 'primitive', primitive: 'glint', x: 1020, y: 560, parallax: 0.35, props: { r: 8 },
        if: { not: { any: [{ hasItem: 'torn_button' }, { flag: 'button_refuted' }] } },
      },
      // Your inquiry desk, set up where the stewards cleared the deck chairs.
      { kind: 'primitive', primitive: 'furniture', x: 240, y: 610, scale: 0.85, parallax: 0.55, props: { kind: 'desk', seed: 5 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 330, y: 640, scale: 0.8, parallax: 0.56, props: { kind: 'ledger', rotate: -4, seed: 2 } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'railing',
        shape: { kind: 'rect', x: 930, y: 380, w: 170, h: 130 },
        label: 'The broken railing',
        action: {
          type: 'inspect',
          text: 'A section of rail hangs splintered over the sea — the whole ship has already decided what it means. You reserve judgment and note it for a closer look.',
          effects: [
            { type: 'unlockJournal', entry: 'j_cl_railing' },
            { type: 'setFlag', flag: 'saw_railing' },
          ],
        },
      },
      {
        id: 'railing_stubs',
        shape: { kind: 'rect', x: 930, y: 440, w: 170, h: 110 },
        label: 'The break, up close',
        if: { flag: 'saw_railing' },
        action: {
          type: 'inspect',
          text: 'You go to your knees with a glass. The rail broke outward, pushed from the deck — and there is not one scuff, heel mark, or thread on the boards. Nobody went over here. It was staged.',
          effects: [{ type: 'unlockJournal', entry: 'j_ev_railing' }],
        },
      },
      {
        id: 'button_glint',
        shape: { kind: 'circle', cx: 1024, cy: 566, r: 42 },
        label: 'Something bright at the rail foot',
        hideWhen: { any: [{ hasItem: 'torn_button' }, { flag: 'button_refuted' }] },
        action: {
          type: 'inspect',
          text: "A brass cuff button, stewards' pattern, a scrap of thread through the shank — snagged at the rail as if torn loose in a struggle. Almost too easy to find. You pocket it for the laundry log.",
          effects: [
            { type: 'giveItem', item: 'torn_button' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'office_lock',
        shape: { kind: 'rect', x: 60, y: 300, w: 90, h: 120 },
        label: "The purser's office lock",
        hideWhen: { flag: 'office_open' },
        action: {
          type: 'useItem',
          accepts: ['office_key'],
          effects: [
            { type: 'removeItem', item: 'office_key' },
            { type: 'setFlag', flag: 'office_open' },
            { type: 'triggerShift', shift: 's_office' },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText: 'The mortise lock wants its own key, and this is not it.',
        },
      },
      {
        id: 'inquiry_desk',
        shape: { kind: 'rect', x: 230, y: 590, w: 400, h: 250 },
        label: 'Your inquiry desk — the charge sheet',
        hideWhen: { solved: 'pz_accusation' },
        action: { type: 'puzzle', puzzle: 'pz_accusation' },
      },
      {
        id: 'exit_p_prom_office',
        shape: { kind: 'rect', x: 30, y: 160, w: 180, h: 420 },
        label: "The purser's office",
        action: { type: 'navigate', passage: 'p_prom_office' },
      },
      {
        id: 'exit_p_prom_corridor',
        shape: { kind: 'rect', x: 260, y: 160, w: 180, h: 420 },
        label: 'The first-class corridor',
        action: { type: 'navigate', passage: 'p_prom_corridor' },
      },
      {
        id: 'exit_p_prom_salon',
        shape: { kind: 'rect', x: 490, y: 160, w: 180, h: 420 },
        label: 'The Grand Salon',
        action: { type: 'navigate', passage: 'p_prom_salon' },
      },
      {
        id: 'exit_p_prom_suite',
        shape: { kind: 'rect', x: 1390, y: 160, w: 180, h: 420 },
        label: 'The jammed starboard door — the Crane suite',
        action: { type: 'navigate', passage: 'p_prom_suite' },
      },
    ],
  };
}

export function salonScene(): SceneDef {
  const out = doorway(620, 'p_prom_salon', 'Out to the promenade', { open: true });
  return {
    palette: 'deco',
    layers: [
      ...deckShell(12, 'deco'),
      porthole(150),
      porthole(1230),
      swayLamp(700, 'crystal', 1),
      ...out.layers,
      // The abandoned card table, chalk slate still propped against the lamp.
      { kind: 'primitive', primitive: 'furniture', x: 220, y: 460, scale: 0.95, parallax: 0.35, props: { kind: 'table', seed: 4 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 330, y: 430, scale: 0.9, parallax: 0.36, props: { kind: 'ledger', rotate: -8, seed: 9 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 250, y: 470, scale: 0.7, parallax: 0.36, props: { kind: 'ticket', rotate: 12, seed: 5 } },
      // The bar, bottles racked against the swell.
      { kind: 'primitive', primitive: 'furniture', x: 1010, y: 420, scale: 1, parallax: 0.3, props: { kind: 'bar', seed: 6 } },
      // The iron key box bolted behind it.
      { kind: 'path', d: 'M 1330 420 h 96 v 84 h -96 Z', fill: 'var(--p-wall-dark)', parallax: 0.3 },
      { kind: 'path', d: 'M 1366 452 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.3 },
      // A seam in the panelling that does not quite sit flush.
      { kind: 'path', d: 'M 470 250 V 420', fill: 'none', parallax: 0.05 },
      { kind: 'path', d: 'M 468 250 h 5 v 170 h -5 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.05 },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'slate',
        shape: { kind: 'rect', x: 210, y: 400, w: 340, h: 180 },
        label: 'The card table and its chalked slate',
        action: {
          type: 'inspect',
          text: "The night's last scores, still chalked: final hands spade, diamond, spade — and below, in the club steward's loops, 'Mrs. Crane in to the middle watch, lost three hands, paid in full, witnessed.'",
          effects: [
            { type: 'unlockJournal', entry: 'j_cl_slate' },
            { type: 'unlockJournal', entry: 'j_sus_crane2' },
          ],
        },
      },
      {
        id: 'keybox',
        shape: { kind: 'rect', x: 1320, y: 400, w: 120, h: 120 },
        label: 'The master-at-arms key box',
        hideWhen: { solved: 'pz_barlock' },
        action: { type: 'puzzle', puzzle: 'pz_barlock' },
      },
      {
        id: 'loose_panel',
        shape: { kind: 'rect', x: 450, y: 250, w: 40, h: 180 },
        label: 'A seam in the panelling',
        hideWhen: { flag: 'cache_found' },
        action: {
          type: 'inspect',
          text: "The panel swings on a hidden hinge: two marked decks, a shaved dice pair, and a physician's bag holding nothing medical whatsoever. The Doctor's true dispensary.",
          effects: [
            { type: 'markSecret', secret: 'cache' },
            { type: 'setFlag', flag: 'cache_found' },
          ],
        },
      },
      {
        id: 'bar_top',
        shape: { kind: 'rect', x: 1000, y: 460, w: 300, h: 200 },
        label: 'The bar',
        action: {
          type: 'inspect',
          text: 'Bottles racked and netted against the swell. One glass out, unwashed, on the rail-side end — someone drank alone here after the salon emptied, facing the sea.',
        },
      },
      out.hotspot,
    ],
  };
}

export function officeScene(): SceneDef {
  const out = doorway(640, 'p_prom_office', 'Back out to the promenade', { open: true });
  return {
    palette: 'deco',
    layers: [
      ...deckShell(21, 'deco'),
      porthole(120),
      swayLamp(480, 'deco', 0.8),
      ...out.layers,
      // The purser's counter and cage.
      { kind: 'primitive', primitive: 'furniture', x: 130, y: 470, scale: 1, parallax: 0.35, props: { kind: 'desk', seed: 8 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 210, y: 500, scale: 0.85, parallax: 0.36, props: { kind: 'ledger', rotate: 3, seed: 3 } },
      // The key rack cupboard.
      { kind: 'primitive', primitive: 'furniture', x: 1150, y: 260, scale: 1, parallax: 0.2, props: { kind: 'cabinet', seed: 2 } },
      // A rag-wrapped something shoved behind the ledger shelf.
      {
        kind: 'path', d: 'M 1030 540 q 24 -34 66 -22 q 38 12 26 44 q -12 26 -52 18 q -40 -10 -40 -40 Z',
        fill: 'var(--p-fog)', opacity: 0.85, parallax: 0.35,
        if: { not: { any: [{ hasItem: 'dumbwaiter_crank' }, { solved: 'pz_dumbwaiter' }] } },
      },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'cipher_desk',
        shape: { kind: 'rect', x: 120, y: 440, w: 380, h: 230 },
        label: "The purser's desk — the coded manifest",
        hideWhen: { solved: 'pz_manifest' },
        action: { type: 'puzzle', puzzle: 'pz_manifest' },
      },
      {
        id: 'manifest_drawer',
        shape: { kind: 'rect', x: 200, y: 490, w: 180, h: 120 },
        label: 'A torn page in the blotter',
        hideWhen: { hasItem: 'manifest_page' },
        action: { type: 'pickup', item: 'manifest_page' },
      },
      {
        id: 'crank_rag',
        shape: { kind: 'rect', x: 1010, y: 510, w: 140, h: 110 },
        label: 'A rag-wrapped bundle behind the ledgers',
        hideWhen: { any: [{ hasItem: 'dumbwaiter_crank' }, { solved: 'pz_dumbwaiter' }] },
        action: { type: 'pickup', item: 'dumbwaiter_crank' },
      },
      {
        id: 'key_rack',
        shape: { kind: 'rect', x: 1140, y: 250, w: 240, h: 340 },
        label: 'The locked key rack',
        hideWhen: { solved: 'pz_keyrack' },
        action: { type: 'puzzle', puzzle: 'pz_keyrack' },
      },
      {
        id: 'key_log',
        shape: { kind: 'rect', x: 1140, y: 250, w: 240, h: 340 },
        label: 'The master-key log, inside the rack',
        if: { solved: 'pz_keyrack' },
        action: {
          type: 'inspect',
          text: "The master-key log, in the purser's own regulation hand: drawn 22:10, initials smeared; returned 22:55. Forty-five minutes in the exact window he swears he never left the cage.",
          effects: [{ type: 'unlockJournal', entry: 'j_ev_keylog' }],
        },
      },
      out.hotspot,
    ],
  };
}
