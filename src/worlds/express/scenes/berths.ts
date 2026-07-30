/** The six sleeper compartments. One shared shell; each berth keeps its own story. */
import type { SceneDef, SceneLayer } from '../../../engine/types.ts';
import { carShell, carWindows, frameEdges } from './common.ts';

function berthShell(seed: number, opts: { madeUp?: boolean } = {}): SceneLayer[] {
  return [
    ...carShell(seed, 'velvet'),
    ...carWindows([1180], 'night', { scale: 0.75 }),
    // the fold-down berth along the left wall
    {
      kind: 'primitive',
      primitive: 'furniture',
      x: 120,
      y: 330,
      scale: 1.3,
      parallax: 0.3,
      props: { kind: 'berth', seed },
    },
    // reading lamp glow above the berth
    ...(opts.madeUp === false
      ? []
      : ([
          { kind: 'path', d: 'M 200 250 L 260 250 L 260 300 L 200 300 Z', fill: 'var(--p-glow)', opacity: 0.25, parallax: 0.3 },
        ] as SceneLayer[])),
  ];
}

/** No. 1 — Colonel Fisk. The famous latched room. */
export function fiskScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(61, { madeUp: false }),
      // the colonel, under the inspector's sheet — kept tasteful
      { kind: 'primitive', primitive: 'bodyOutline', x: 130, y: 330, scale: 1.05, parallax: 0.32, props: { style: 'sheet' } },
      // fold-down desk with the dispatch case
      { kind: 'primitive', primitive: 'furniture', x: 700, y: 380, scale: 0.75, parallax: 0.35, props: { kind: 'desk', seed: 3 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 760, y: 330, scale: 0.9, parallax: 0.36, props: { kind: 'letter', rotate: -8, seed: 9 }, if: { not: { hasItem: 'telegram' } } },
      // pipe kit on the shelf
      { kind: 'path', d: 'M 1060 300 L 1150 300 L 1150 330 L 1060 330 Z', fill: 'var(--p-wall-dark)', parallax: 0.3 },
      { kind: 'path', d: 'M 1075 288 q 20 -14 40 0 q 8 8 -4 14 l -32 0 q -12 -6 -4 -14 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.3 },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'the_colonel',
        shape: { kind: 'rect', x: 120, y: 340, w: 460, h: 200 },
        label: 'The colonel, under the inspector’s sheet',
        action: {
          type: 'inspect',
          text: 'You lift nothing you do not have to. Auberon Fisk lies composed under the border’s sheet, boots on, as he slept for thirty years of night runs. Whoever laid him here took care over it — and care is a kind of signature too.',
        },
      },
      {
        id: 'collar',
        shape: { kind: 'rect', x: 130, y: 320, w: 180, h: 60 },
        label: 'The collar of his greatcoat',
        action: {
          type: 'inspect',
          text: 'Beneath the collar, a single thin furrow pressed into cloth and skin: braided, three strands, laid tight. Drawn once, from behind, and held. You record the mark exactly.',
          effects: [
            { type: 'setFlag', flag: 'mark_seen' },
            { type: 'unlockJournal', entry: 'j_cord_mark' },
          ],
        },
      },
      {
        id: 'pillow',
        shape: { kind: 'rect', x: 740, y: 320, w: 180, h: 140 },
        label: 'A paper on the fold-down desk',
        hideWhen: { hasItem: 'telegram' },
        action: {
          type: 'inspect',
          text: 'Folded once and kept close: a telegram summoning the colonel to the observation car at midnight, signed only “K.” Railway form, railway ink — and a hand that snags on your eye like a burr. You take it.',
          effects: [
            { type: 'giveItem', item: 'telegram' },
            { type: 'unlockJournal', entry: 'j_telegram' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'dispatch_case',
        shape: { kind: 'rect', x: 690, y: 440, w: 300, h: 160 },
        label: 'The dispatch case',
        action: {
          type: 'inspect',
          text: 'The famous case gapes open on the desk, chain neatly coiled, empty to the seams. Whoever emptied it had time, and a steady hand, and somewhere better to keep what it carried.',
        },
      },
      {
        id: 'pipe_kit',
        shape: { kind: 'rect', x: 1040, y: 270, w: 140, h: 80 },
        label: 'The colonel’s pipe kit',
        action: {
          type: 'inspect',
          text: 'Pipe kit squared away on the shelf: pouch of black cherry, tamper, three matches remaining — and no pipe. A man of thirty years’ habit never smoked in his berth. Wherever his pipe went out, he was sitting in a public room, facing the door.',
          effects: [{ type: 'unlockJournal', entry: 'j_fisk_pipe' }],
        },
      },
      {
        id: 'compare_hands',
        shape: { kind: 'rect', x: 640, y: 280, w: 360, h: 120 },
        label: 'Lay the telegram beside the widow’s letter',
        if: { all: [{ hasItem: 'telegram' }, { hasItem: 'voss_letter' }] },
        hideWhen: { flag: 'who_pinned' },
        action: {
          type: 'inspect',
          text: 'On the dead man’s own desk you lay them side by side: the telegram that moved him, the letter from No. 2. The same long-tailed R. The same crossed seven. The same stiff flourish closing every line. One hand wrote both — and it belongs to Adeline Voss.',
          effects: [
            { type: 'setFlag', flag: 'who_pinned' },
            { type: 'unlockJournal', entry: 'j_voss_break' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'night_latch',
        shape: { kind: 'rect', x: 380, y: 180, w: 140, h: 120 },
        label: 'The night latch',
        hideWhen: { flag: 'latch_drawn' },
        action: {
          type: 'inspect',
          text: 'The brass tongue sits thrown home, exactly as the border found it. You slide it back the way the killer must have left it — from inside, with two fingers, without a sound.',
          effects: [
            { type: 'setFlag', flag: 'latch_drawn' },
            { type: 'triggerShift', shift: 's_unlatch' },
          ],
        },
      },
      {
        id: 'panel_back',
        shape: { kind: 'rect', x: 1330, y: 240, w: 220, h: 340 },
        label: 'The smuggler’s panel — back into No. 2',
        action: { type: 'navigate', passage: 'p_voss_fisk' },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 380, y: 300, w: 200, h: 260 },
        label: 'The compartment door — to the corridor',
        if: { flag: 'latch_drawn' },
        action: { type: 'navigate', passage: 'p_corra_fisk' },
      },
    ],
  };
}

/** No. 2 — Adeline Voss. Lavender, a letter, and a mirror that turns. */
export function vossScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(62),
      // the vanity mirror in its ringed frame
      { kind: 'primitive', primitive: 'portraitFrame', x: 1320, y: 200, scale: 0.9, parallax: 0.2, props: { oval: true, empty: true }, if: { not: { solved: 'pz_panel' } } },
      // once opened, the panel gapes into No. 1
      { kind: 'path', d: 'M 1330 210 L 1560 210 L 1560 520 L 1330 520 Z', fill: 'var(--p-sky-top)', parallax: 0.2, if: { solved: 'pz_panel' } },
      { kind: 'primitive', primitive: 'paperScrap', x: 700, y: 350, scale: 1, parallax: 0.35, props: { kind: 'letter', rotate: -5, seed: 4 }, if: { not: { hasItem: 'voss_letter' } } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'writing_case',
        shape: { kind: 'rect', x: 670, y: 330, w: 220, h: 150 },
        label: 'The widow’s writing case',
        hideWhen: { hasItem: 'voss_letter' },
        action: {
          type: 'inspect',
          text: 'A travelling writing case, ink dry in the well — and one letter kept beneath the blotter, signed “your loving sister,” stiff as a drill manual, ending in a postscript about house numbers. You take it, and note the hand: a long-tailed R, sevens crossed.',
          effects: [
            { type: 'giveItem', item: 'voss_letter' },
            { type: 'unlockJournal', entry: 'j_voss_letter' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'sachet',
        shape: { kind: 'rect', x: 150, y: 340, w: 300, h: 160 },
        label: 'The made-up berth',
        action: {
          type: 'inspect',
          text: 'The berth is made with hospital corners and scented with lavender — a compartment arranged to be looked at, the way a stage set is arranged. Nothing here has been slept in tonight.',
        },
      },
      {
        id: 'mirror_rings',
        shape: { kind: 'rect', x: 1300, y: 190, w: 270, h: 350 },
        label: 'The vanity mirror and its engraved rings',
        hideWhen: { solved: 'pz_panel' },
        action: { type: 'puzzle', puzzle: 'pz_panel' },
      },
      {
        id: 'panel_way',
        shape: { kind: 'rect', x: 1300, y: 190, w: 270, h: 350 },
        label: 'Through the smuggler’s panel — into No. 1',
        if: { solved: 'pz_panel' },
        action: { type: 'navigate', passage: 'p_voss_fisk' },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 400, y: 560, w: 260, h: 300 },
        label: 'The compartment door — to the corridor',
        action: { type: 'navigate', passage: 'p_corra_voss' },
      },
    ],
  };
}

/** No. 3 — Otto Brandt. A salesman's room that sells nothing. */
export function brandtScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(63),
      { kind: 'primitive', primitive: 'furniture', x: 760, y: 300, scale: 0.85, parallax: 0.3, props: { kind: 'cabinet', seed: 13 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1120, y: 420, scale: 0.9, parallax: 0.35, props: { kind: 'ticket', rotate: 6, seed: 11 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'sample_case',
        shape: { kind: 'rect', x: 740, y: 290, w: 260, h: 340 },
        label: 'Brandt’s sample case',
        action: {
          type: 'inspect',
          text: 'Notions and smallwares, says the lid. Under the false tray: lock-picks, wax blanks, a jeweller’s glass. You write it down, and underline it — then remember that writing something twice does not make it true.',
          effects: [{ type: 'unlockJournal', entry: 'j_brandt_picks' }],
        },
      },
      {
        id: 'claim_stub',
        shape: { kind: 'rect', x: 1100, y: 400, w: 180, h: 130 },
        label: 'A baggage claim stub',
        action: {
          type: 'inspect',
          text: 'A claim stub for bonded crates in the baggage car, countersigned by the guard. Whatever Brandt was doing all night, he was doing it under a railwayman’s punch.',
        },
      },
      {
        id: 'unmade_berth',
        shape: { kind: 'rect', x: 150, y: 340, w: 300, h: 160 },
        label: 'The berth, barely touched',
        action: {
          type: 'inspect',
          text: 'One corner of the blanket turned back, the pillow undented. A man who told the inspector he kept to his berth — and a berth that has hardly met him.',
        },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 400, y: 560, w: 260, h: 300 },
        label: 'The compartment door — to the corridor',
        action: { type: 'navigate', passage: 'p_corra_brandt' },
      },
    ],
  };
}

/** No. 4 — Elsa Kohl. Cocoa, books, and two doors heard in the dark. */
export function kohlScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(64),
      { kind: 'primitive', primitive: 'paperScrap', x: 700, y: 380, scale: 1, parallax: 0.35, props: { kind: 'letter', rotate: 4, seed: 14 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 840, y: 400, scale: 0.85, parallax: 0.35, props: { kind: 'letter', rotate: -7, seed: 15 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'books',
        shape: { kind: 'rect', x: 670, y: 360, w: 300, h: 160 },
        label: 'A drift of lecture notes',
        action: {
          type: 'inspect',
          text: 'Lecture notes annotated in three colours of ink, and a cold cocoa cup ringed to the saucer — rung for at ten to midnight, drunk over a book. A student’s alibi is made of small, boring, verifiable things. Hers holds.',
        },
      },
      {
        id: 'ear_wall',
        shape: { kind: 'rect', x: 150, y: 340, w: 300, h: 160 },
        label: 'The berth by the forward wall',
        action: {
          type: 'inspect',
          text: 'Her berth shares its forward wall with the corridor gangway. Two doors, she told the inspector — soft, close together, like one breath — some minutes before midnight. From here, she would have heard exactly that.',
        },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 400, y: 560, w: 260, h: 300 },
        label: 'The compartment door — to the corridor',
        action: { type: 'navigate', passage: 'p_corrb_kohl' },
      },
    ],
  };
}

/** No. 5 — Hector Blaine. The magistrate who sealed the train. */
export function blaineScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(65),
      { kind: 'primitive', primitive: 'furniture', x: 720, y: 420, scale: 0.75, parallax: 0.35, props: { kind: 'chair', seed: 16 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 900, y: 380, scale: 1, parallax: 0.32, props: { kind: 'ledger', rotate: -2, seed: 17 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'bench_book',
        shape: { kind: 'rect', x: 870, y: 360, w: 220, h: 150 },
        label: 'The judge’s bench book',
        action: {
          type: 'inspect',
          text: 'A retired magistrate’s bench book, already open to a fresh page headed FISK. Under it, in a jurist’s hand: “The train is the witness. Passengers lie; rolling stock does not.” You find you agree with him.',
        },
      },
      {
        id: 'brandy_glass',
        shape: { kind: 'rect', x: 150, y: 340, w: 300, h: 160 },
        label: 'The slept-in berth',
        action: {
          type: 'inspect',
          text: 'A brandy glass dried to varnish on the shelf — the 23:05 call — and bedding honestly wrecked by honest sleep. Blaine woke to the brakes, and his first act was to have the whole train sealed. Killers do not usually demand the evidence be preserved.',
        },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 400, y: 560, w: 260, h: 300 },
        label: 'The compartment door — to the corridor',
        action: { type: 'navigate', passage: 'p_corrb_blaine' },
      },
    ],
  };
}

/** No. 6 — Marek Stasny's service berth. Nineteen years of tidy leaves. */
export function stasnyScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...berthShell(66, { madeUp: false }),
      { kind: 'primitive', primitive: 'furniture', x: 700, y: 380, scale: 0.8, parallax: 0.32, props: { kind: 'desk', seed: 18 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 780, y: 330, scale: 1, parallax: 0.33, props: { kind: 'ledger', rotate: 2, seed: 19 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'punch_register',
        shape: { kind: 'rect', x: 750, y: 310, w: 220, h: 160 },
        label: 'The conductor’s punch register',
        action: {
          type: 'inspect',
          text: 'Nineteen years of tidy leaves — and one blemish on the night leaf: at 23:52, an ugly over-punch, two car letters struck one atop the other, on a lady’s single clipped in the rear corridor. It looks doctored. It looks, in fact, exactly like a lie. You take the whole leaf down anyway.',
          effects: [{ type: 'unlockJournal', entry: 'j_ticket_log' }],
        },
      },
      {
        id: 'service_berth',
        shape: { kind: 'rect', x: 150, y: 340, w: 300, h: 160 },
        label: 'The service berth',
        action: {
          type: 'inspect',
          text: 'A conductor’s berth: unslept, because conductors on the night run do not sleep. A spare uniform on the hook, brushed. A man whose whole defence is a machine’s handwriting.',
        },
      },
      {
        id: 'corridor_door',
        shape: { kind: 'rect', x: 400, y: 560, w: 260, h: 300 },
        label: 'The compartment door — to the corridor',
        action: { type: 'navigate', passage: 'p_corrb_stasny' },
      },
    ],
  };
}
