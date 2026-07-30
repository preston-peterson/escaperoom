/** Scenes for the ship's depths: the Engine Room, the Winch Flat, the Cargo Hold. */
import type { SceneDef } from '../../../engine/types.ts';
import { deckShell, doorway, frame, swayLamp } from './common.ts';

export function engineScene(): SceneDef {
  const stair = doorway(80, 'p_stair_engine', 'The watertight door to the stair', { scale: 0.85 });
  const galley = doorway(420, 'p_galley_engine', 'The forward frame — the galley', { scale: 0.75 });
  const winch = doorway(1300, 'p_engine_winch', 'Aft, to the winch flat', { scale: 0.85 });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(48, 'iron'),
      { kind: 'primitive', primitive: 'pipes', x: 80, y: 60, parallax: 0.06, props: { w: 700, h: 180, seed: 3 } },
      { kind: 'primitive', primitive: 'pipes', x: 860, y: 60, parallax: 0.06, props: { w: 700, h: 180, seed: 14 } },
      { kind: 'primitive', primitive: 'gear', x: 800, y: 300, scale: 1.3, parallax: 0.18, props: { r: 110, teeth: 14, spin: true, dur: 30 } },
      { kind: 'primitive', primitive: 'gear', x: 1000, y: 420, scale: 0.9, parallax: 0.2, props: { r: 70, teeth: 10, spin: true, dur: 18 } },
      swayLamp(620, 'lantern', 0.7),
      ...stair.layers,
      ...galley.layers,
      ...winch.layers,
      // The throttle platform and the log wheel on its pedestal.
      { kind: 'primitive', primitive: 'pedestal', x: 1080, y: 440, scale: 0.9, parallax: 0.3, props: { occupied: true } },
      { kind: 'primitive', primitive: 'clockFace', x: 1130, y: 330, scale: 0.5, parallax: 0.25, props: { r: 90, hourAngle: 250, minuteAngle: 40 } },
      // Reyes's grease-pencil note beside the load placard.
      { kind: 'primitive', primitive: 'paperScrap', x: 700, y: 560, scale: 0.9, parallax: 0.35, props: { kind: 'letter', rotate: -7, seed: 8 } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'engine_log',
        shape: { kind: 'rect', x: 1060, y: 320, w: 240, h: 320 },
        label: 'The log wheel on the throttle platform',
        action: {
          type: 'inspect',
          text: "The log wheel punches the watch automatically, every twenty minutes, countersigned by the third engineer. Reyes's stamps march through the whole second dog watch without a gap. The wheel does not lie for anyone.",
          effects: [{ type: 'unlockJournal', entry: 'j_sus_reyes2' }],
        },
      },
      {
        id: 'stencil_note',
        shape: { kind: 'rect', x: 690, y: 540, w: 190, h: 150 },
        label: "A grease-pencil note by the load placard",
        action: {
          type: 'inspect',
          text: "Reyes's hand, for the relief watch: 'Hold hatch — three rings. CROWN ALL THREE: anchor, star, moon to the top mark. Stevedores' lock, older than the ship.'",
          effects: [{ type: 'unlockJournal', entry: 'j_mech_hatch' }],
        },
      },
      {
        id: 'gauges',
        shape: { kind: 'circle', cx: 880, cy: 400, r: 130 },
        label: 'The turning gear',
        action: {
          type: 'inspect',
          text: 'The engines hold steerage way, patient as bellows. Down here the ship is loudest and most honest: everything that moves is logged, stamped, and witnessed by iron.',
        },
      },
      stair.hotspot,
      galley.hotspot,
      winch.hotspot,
    ],
  };
}

export function winchScene(): SceneDef {
  const engine = doorway(90, 'p_engine_winch', 'Forward, to the engine room', { scale: 0.85 });
  const hold = doorway(1290, 'p_winch_hold', 'The hold hatch', {
    openIf: { solved: 'pz_hold_hatch' },
    scale: 0.85,
  });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(57, 'iron'),
      { kind: 'primitive', primitive: 'pipes', x: 900, y: 60, parallax: 0.06, props: { w: 620, h: 140, seed: 6 } },
      swayLamp(700, 'lantern', 0.7),
      ...engine.layers,
      ...hold.layers,
      // The cargo winch drum.
      { kind: 'primitive', primitive: 'gear', x: 560, y: 380, scale: 1.1, parallax: 0.2, props: { r: 95, teeth: 12 } },
      { kind: 'path', d: 'M 460 470 h 220 v 90 h -220 Z', fill: 'var(--p-wall-dark)', parallax: 0.2 },
      // The tool shadow board — every silhouette filled but one.
      { kind: 'path', d: 'M 860 240 h 380 v 260 h -380 Z', fill: 'var(--p-wall-dark)', parallax: 0.1 },
      { kind: 'path', d: 'M 890 280 h 22 v 160 h -22 Z M 950 280 h 22 v 160 h -22 Z M 1010 280 h 22 v 160 h -22 Z', fill: 'var(--p-wall-light)', opacity: 0.7, parallax: 0.1 },
      // The one empty silhouette: a long handle, painted where brass should hang.
      { kind: 'path', d: 'M 1090 270 h 26 v 180 h -26 Z M 1078 270 h 50 v 26 h -50 Z', fill: 'var(--p-glow)', opacity: 0.25, parallax: 0.1 },
      // A cargo hook on its nail.
      {
        kind: 'path', d: 'M 1190 300 q 30 6 30 40 q 0 40 -34 44 q -26 2 -30 -22 l 14 -4 q 4 14 18 12 q 18 -4 18 -30 q 0 -22 -20 -26 Z',
        fill: 'var(--p-accent)', opacity: 0.95, parallax: 0.1,
        if: { not: { any: [{ hasItem: 'cargo_hook' }, { solved: 'pz_crate' }] } },
      },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'bracket',
        shape: { kind: 'rect', x: 1060, y: 250, w: 90, h: 220 },
        label: 'An empty bracket on the shadow board',
        action: {
          type: 'inspect',
          text: 'Every tool hangs on its painted shadow — except one. The bracket for the brass winch handle is empty: a yard of solid brass with a squared shank, not signed out, not lost. Taken.',
          effects: [
            { type: 'unlockJournal', entry: 'j_ev_bracket' },
            { type: 'setFlag', flag: 'saw_bracket' },
          ],
        },
      },
      {
        id: 'hook_nail',
        shape: { kind: 'rect', x: 1170, y: 290, w: 90, h: 110 },
        label: 'A cargo hook on its nail',
        hideWhen: { any: [{ hasItem: 'cargo_hook' }, { solved: 'pz_crate' }] },
        action: { type: 'pickup', item: 'cargo_hook' },
      },
      {
        id: 'hatch_lock',
        shape: { kind: 'rect', x: 1300, y: 300, w: 220, h: 260 },
        label: "The stevedore's ring-lock",
        hideWhen: { solved: 'pz_hold_hatch' },
        action: { type: 'puzzle', puzzle: 'pz_hold_hatch' },
      },
      {
        id: 'winch_drum',
        shape: { kind: 'rect', x: 440, y: 300, w: 260, h: 260 },
        label: 'The cargo winch',
        action: {
          type: 'inspect',
          text: 'The winch is greased, chocked, and orderly — a machine kept by people who put things back. Its handle should be a step away, on the board. It is not.',
        },
      },
      engine.hotspot,
      hold.hotspot,
    ],
  };
}

export function holdScene(): SceneDef {
  const winch = doorway(90, 'p_winch_hold', 'Up through the hatch to the winch flat', { scale: 0.85 });
  return {
    palette: 'steam',
    layers: [
      ...deckShell(66, 'iron'),
      { kind: 'primitive', primitive: 'fog', x: 100, y: 640, parallax: 0.5, props: { w: 1400, h: 180, opacity: 0.12 } },
      { kind: 'primitive', primitive: 'chandelier', x: 700, y: 0, scale: 0.7, parallax: 0.25, props: { style: 'lantern', sway: true } },
      ...winch.layers,
      // Crate stacks receding into the dark.
      { kind: 'path', d: 'M 420 300 h 240 v 280 h -240 Z M 700 380 h 200 v 200 h -200 Z M 430 200 h 200 v 100 h -200 Z', fill: 'var(--p-wall-mid)', parallax: 0.15 },
      { kind: 'path', d: 'M 420 300 h 240 v 16 h -240 Z M 700 380 h 200 v 14 h -200 Z', fill: 'var(--p-wall-dark)', opacity: 0.8, parallax: 0.15 },
      // Crate seven, chalked for offload, alone by the dumbwaiter mouth.
      { kind: 'path', d: 'M 1000 400 h 300 v 240 h -300 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      { kind: 'path', d: 'M 1000 400 h 300 v 22 h -300 Z M 1000 618 h 300 v 22 h -300 Z', fill: 'var(--p-wall-dark)', parallax: 0.2 },
      { kind: 'path', d: 'M 1120 470 h 60 v 12 h -60 Z M 1140 450 h 20 v 52 h -20 Z', fill: 'var(--p-fog)', opacity: 0.85, parallax: 0.2 },
      // The fresh gouge across the lid, once the crate stands open.
      { kind: 'path', d: 'M 1020 412 l 250 10 l -2 8 l -250 -10 Z', fill: 'var(--p-glow)', opacity: 0.5, parallax: 0.2, if: { solved: 'pz_crate' } },
      // The tally board by the hatch trunk.
      { kind: 'primitive', primitive: 'paperScrap', x: 380, y: 620, scale: 1, parallax: 0.35, props: { kind: 'ledger', rotate: 2, seed: 10 } },
      // The dumbwaiter mouth, once the shaft is running.
      { kind: 'path', d: 'M 1380 300 h 150 v 200 h -150 Z', fill: 'var(--p-wall-dark)', parallax: 0.1, if: { flag: 'dumbwaiter_open' } },
      { kind: 'path', d: 'M 1392 312 h 126 v 176 h -126 Z', fill: 'var(--p-wall-mid)', parallax: 0.1, if: { flag: 'dumbwaiter_open' } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'crate7',
        shape: { kind: 'rect', x: 990, y: 390, w: 320, h: 260 },
        label: 'Crate seven, re-nailed and chalked for offload',
        hideWhen: { solved: 'pz_crate' },
        action: { type: 'puzzle', puzzle: 'pz_crate' },
      },
      {
        id: 'crate_scratch',
        shape: { kind: 'rect', x: 990, y: 390, w: 320, h: 90 },
        label: 'A fresh gouge across the lid',
        if: { all: [{ solved: 'pz_crate' }, { flag: 'saw_bracket' }] },
        action: {
          type: 'inspect',
          text: 'A bright squared gouge, quarter-inch across — the shank profile of the missing brass winch handle, dragged once over the lid. The means came off the shadow board upstairs, and it ended its work here.',
          effects: [
            { type: 'unlockJournal', entry: 'j_ev_scratch' },
            { type: 'setFlag', flag: 'how_pinned' },
          ],
        },
      },
      {
        id: 'tally_board',
        shape: { kind: 'rect', x: 360, y: 600, w: 220, h: 170 },
        label: 'The hold tally board',
        if: { flag: 'dumbwaiter_open' },
        action: {
          type: 'inspect',
          text: 'With the shaft running at your back, the tally reads differently: crate seven entered FULL at eleven hundredweight, re-chalked for offload — and the scale beam swears it is nearly empty. She came down to count crates, and she never left the cargo hold.',
          effects: [
            { type: 'unlockJournal', entry: 'j_ev_tally' },
            { type: 'setFlag', flag: 'where_pinned' },
          ],
        },
      },
      {
        id: 'dumbwaiter_mouth',
        shape: { kind: 'rect', x: 1370, y: 290, w: 170, h: 220 },
        label: 'Ride the dumbwaiter up to the galley',
        if: { flag: 'dumbwaiter_open' },
        action: { type: 'navigate', passage: 'p_galley_hold' },
      },
      {
        id: 'crate_rows',
        shape: { kind: 'rect', x: 410, y: 200, w: 500, h: 380 },
        label: 'The cargo rows',
        action: {
          type: 'inspect',
          text: 'Rope-lashed rows under one swaying lantern. Cold air, tar, and a silence with weight to it. Somewhere in this arithmetic of crates is the line she came down here to balance.',
        },
      },
      winch.hotspot,
    ],
  };
}
