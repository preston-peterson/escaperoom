/** Backstage — the Prompt Corner, the Props Room, and Barrow's Rig Shop. */
import type { SceneDef } from '../../../engine/types.ts';
import { foregroundFrame, interiorShell, sconcePair, stageDoor } from './common.ts';

export function promptScene(): SceneDef {
  const toStage = stageDoor(1370, 'p_stage_prompt', 'Back onto the stage', { scale: 0.8, open: true });
  const toProps = stageDoor(1120, 'p_prompt_props', 'The props room', { scale: 0.7 });
  const toDressing = stageDoor(320, 'p_prompt_understudy', 'The dressing-room corridor', { scale: 0.7 });
  const toRig = stageDoor(80, 'p_prompt_rig', "Barrow's rig shop", { scale: 0.7 });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(29, 'wood'),
      toRig.layer,
      toDressing.layer,
      toProps.layer,
      toStage.layer,
      // The cue board, wired to every corner of the building.
      { kind: 'primitive', primitive: 'glyphPanel', x: 640, y: 150, scale: 0.85, parallax: 0.2, props: { rows: 2, cols: 5, seed: 41, glow: true } },
      // Craik's desk: the prompt book, the chalk cup, the key hook.
      { kind: 'primitive', primitive: 'furniture', x: 560, y: 470, scale: 1.0, parallax: 0.35, props: { kind: 'desk', seed: 13 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 640, y: 430, scale: 1.15, parallax: 0.35, props: { kind: 'ledger', rotate: -4, seed: 22 } },
      {
        kind: 'primitive',
        primitive: 'glint',
        x: 872,
        y: 468,
        scale: 1.3,
        parallax: 0.35,
        if: { not: { hasItem: 'master_keys' } },
      },
      // The trap-room stair, dropping away front-left.
      { kind: 'primitive', primitive: 'stairs', x: 40, y: 620, scale: 0.55, parallax: 0.5, props: { dir: 'down' } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'craik_desk',
        shape: { kind: 'rect', x: 540, y: 460, w: 220, h: 240 },
        label: "The stage manager's desk",
        action: {
          type: 'inspect',
          text: 'Thirty years of order: chalk cup, stopwatch, spare cans, a tin of blue wax pencils worn to stubs. The desk of a person the building obeys. You open a dossier on Wilhelmina Craik.',
          effects: [{ type: 'unlockJournal', entry: 'j_sus_craik' }],
        },
      },
      {
        id: 'prompt_book',
        shape: { kind: 'rect', x: 620, y: 410, w: 220, h: 130 },
        label: 'The prompt book, open to Act III',
        action: {
          type: 'inspect',
          text: 'The master copy, open to the study scene. Printed: TRAP — GO at 0:52. Over it, in blue wax pencil: "GO at 0:47." Five seconds early, in the hand that wrote every other cue in the book.',
          effects: [
            { type: 'setFlag', flag: 'read_prompt_book' },
            { type: 'unlockJournal', entry: 'j_prompt_book' },
          ],
        },
      },
      {
        id: 'craik_keys',
        shape: { kind: 'circle', cx: 888, cy: 486, r: 60 },
        label: 'A ring of keys on the desk hook',
        hideWhen: { hasItem: 'master_keys' },
        action: {
          type: 'inspect',
          text: 'The stage manager\'s master ring, left hanging on its hook — she walked out with the company and never came back for them. You take it.',
          effects: [
            { type: 'giveItem', item: 'master_keys' },
            { type: 'triggerShift', shift: 's_master_keys' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'cue_board',
        shape: { kind: 'rect', x: 620, y: 140, w: 340, h: 240 },
        label: 'The cue board',
        hideWhen: { solved: 'pz_cue_board' },
        action: { type: 'puzzle', puzzle: 'pz_cue_board' },
      },
      {
        id: 'cue_board_run',
        shape: { kind: 'rect', x: 620, y: 140, w: 340, h: 240 },
        label: 'The cue board, running the top of the show',
        if: { solved: 'pz_cue_board' },
        action: {
          type: 'inspect',
          text: 'The switches sit thrown in Craik\'s order and the building holds them: house at half, limes warm, curtain flown. The Coronet is mid-performance for an audience of one.',
        },
      },
      {
        id: 'trap_stair',
        shape: { kind: 'rect', x: 30, y: 600, w: 300, h: 220 },
        label: 'The trap-room stair',
        action: { type: 'navigate', passage: 'p_understage_stair' },
      },
      toRig.hotspot,
      toDressing.hotspot,
      toProps.hotspot,
      toStage.hotspot,
    ],
  };
}

export function propsScene(): SceneDef {
  const back = stageDoor(1320, 'p_prompt_props', 'Back to the prompt corner', { scale: 0.75, open: true });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(37, 'wood'),
      back.layer,
      // Shelving by show, by act, by scene.
      { kind: 'primitive', primitive: 'furniture', x: 120, y: 250, scale: 0.95, parallax: 0.2, props: { kind: 'cabinet', seed: 5 } },
      { kind: 'primitive', primitive: 'furniture', x: 370, y: 250, scale: 0.95, parallax: 0.2, props: { kind: 'cabinet', seed: 9 } },
      { kind: 'primitive', primitive: 'furniture', x: 620, y: 250, scale: 0.95, parallax: 0.2, props: { kind: 'cabinet', seed: 14 } },
      // The ledger desk.
      { kind: 'primitive', primitive: 'furniture', x: 920, y: 470, scale: 0.95, parallax: 0.35, props: { kind: 'desk', seed: 21 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 1000, y: 430, scale: 1.2, parallax: 0.35, props: { kind: 'ledger', rotate: 2, seed: 30 } },
      // The trap crank on its shelf — iron stamped TRAP.
      {
        kind: 'primitive',
        primitive: 'gear',
        x: 430,
        y: 330,
        scale: 0.32,
        parallax: 0.2,
        props: { r: 70, teeth: 8 },
        if: { not: { any: [{ hasItem: 'crank_handle' }, { solved: 'pz_trap_machine' }] } },
      },
      { kind: 'primitive', primitive: 'fog', x: 200, y: 660, parallax: 0.55, props: { w: 1200, h: 160, opacity: 0.08 } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'shelves',
        shape: { kind: 'rect', x: 110, y: 240, w: 480, h: 340 },
        label: 'The property shelves',
        action: {
          type: 'inspect',
          text: 'Crowns of gilt cardboard, bottles of cold tea labeled BRANDY, a rack of swords that could not cut butter. Everything a murder needs, and none of it real — that is rather the point of a props room.',
        },
      },
      {
        id: 'take_crank',
        shape: { kind: 'rect', x: 400, y: 300, w: 130, h: 120 },
        label: 'An iron crank, stamped TRAP',
        hideWhen: { any: [{ hasItem: 'crank_handle' }, { solved: 'pz_trap_machine' }] },
        action: { type: 'pickup', item: 'crank_handle' },
      },
      {
        id: 'ledger_glance',
        shape: { kind: 'rect', x: 900, y: 460, w: 260, h: 240 },
        label: 'The props desk',
        action: {
          type: 'inspect',
          text: 'The props master signs everything in and out, every night, in a column straight as a plumb line. The Act II dagger\'s line looks wrong somehow — you would need the thing itself to be sure.',
        },
      },
      {
        id: 'ledger',
        shape: { kind: 'rect', x: 980, y: 410, w: 220, h: 130 },
        label: 'The props ledger, open to opening night',
        action: {
          type: 'useItem',
          accepts: ['prop_knife'],
          wrongItemText: 'The ledger wants the disputed article itself, laid beside its own line.',
          effects: [
            { type: 'removeItem', item: 'prop_knife' },
            { type: 'setFlag', flag: 'knife_logged' },
            { type: 'unlockJournal', entry: 'j_props_ledger' },
            {
              type: 'narrate',
              text: 'You lay the steel knife beside its line. Dagger OUT at 7:40 — IN at 11:40, three-quarters of an hour AFTER the curtain fell, in a hand this column has never seen. The swap happened after the murder. The knife is set dressing.',
            },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      back.hotspot,
    ],
  };
}

export function rigScene(): SceneDef {
  const back = stageDoor(1330, 'p_prompt_rig', 'Back to the prompt corner', { scale: 0.75, open: true });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(43, 'iron'),
      back.layer,
      // Barrow's bench and pegboard.
      { kind: 'primitive', primitive: 'glyphPanel', x: 140, y: 160, scale: 0.9, parallax: 0.15, props: { rows: 3, cols: 4, seed: 51 } },
      { kind: 'primitive', primitive: 'furniture', x: 130, y: 470, scale: 1.0, parallax: 0.3, props: { kind: 'desk', seed: 33 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 220, y: 430, scale: 1.15, parallax: 0.3, props: { kind: 'ledger', rotate: -3, seed: 44 } },
      // Spare counterweights, racked like ingots.
      { kind: 'path', d: 'M 620 520 h 150 v 34 h -150 Z M 630 560 h 150 v 34 h -150 Z M 615 600 h 150 v 34 h -150 Z M 640 640 h 150 v 34 h -150 Z', fill: 'var(--p-wall-dark)', parallax: 0.3 },
      { kind: 'path', d: 'M 620 520 h 150 v 8 h -150 Z M 630 560 h 150 v 8 h -150 Z', fill: 'var(--p-wall-light)', opacity: 0.4, parallax: 0.3 },
      // Coiled purchase lines on the wall.
      { kind: 'path', d: 'M 900 260 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0 Z M 915 260 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0 Z', fill: 'var(--p-accent)', opacity: 0.5, parallax: 0.15 },
      { kind: 'path', d: 'M 1050 300 a 55 55 0 1 0 110 0 a 55 55 0 1 0 -110 0 Z M 1063 300 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0 Z', fill: 'var(--p-accent)', opacity: 0.45, parallax: 0.15 },
      // The key nail — one gallery key, undisturbed dust.
      { kind: 'path', d: 'M 520 300 l 4 -10 l 4 10 Z M 522 300 h 4 v 46 h -4 Z M 516 346 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0 Z', fill: 'var(--p-wall-light)', opacity: 0.85, parallax: 0.15 },
      // The gallery ladder behind its gate.
      { kind: 'path', d: 'M 1190 120 h 14 v 460 h -14 Z M 1260 120 h 14 v 460 h -14 Z M 1190 170 h 84 v 12 h -84 Z M 1190 250 h 84 v 12 h -84 Z M 1190 330 h 84 v 12 h -84 Z M 1190 410 h 84 v 12 h -84 Z M 1190 490 h 84 v 12 h -84 Z', fill: 'var(--p-wall-light)', opacity: 0.75, parallax: 0.18 },
      {
        kind: 'path',
        d: 'M 1160 140 h 150 v 420 h -150 Z M 1172 152 h 126 v 396 h -126 Z M 1215 340 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 Z',
        fill: 'var(--p-accent)',
        opacity: 0.8,
        parallax: 0.18,
        if: { not: { flag: 'gallery_keyed' } },
      },
      { kind: 'primitive', primitive: 'lever', x: 840, y: 460, scale: 0.9, parallax: 0.35, props: { pulled: false, seed: 6 } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'barrow_bench',
        shape: { kind: 'rect', x: 110, y: 300, w: 380, h: 400 },
        label: "Barrow's bench",
        action: {
          type: 'inspect',
          text: 'Tools squared away like surgery. Painted over the bench in a neat rigger\'s hand: "EASE the brake. HAUL the purchase. DOG her off. LAND her soft." You open a dossier on Joss Barrow.',
          effects: [{ type: 'unlockJournal', entry: 'j_sus_barrow' }],
        },
      },
      {
        id: 'weight_log',
        shape: { kind: 'rect', x: 200, y: 410, w: 220, h: 130 },
        label: 'The counterweight log',
        action: {
          type: 'inspect',
          text: 'Thirty ruled pages in Barrow\'s square lettering — then opening night: "Arbor 7 re-hung at the half-hour call," in blue wax pencil, initialed W.C. The stage manager swears she never left her desk after the half.',
          effects: [
            { type: 'setFlag', flag: 'saw_weight_log' },
            { type: 'unlockJournal', entry: 'j_weight_log' },
          ],
        },
      },
      {
        id: 'key_nail',
        shape: { kind: 'rect', x: 490, y: 270, w: 70, h: 110 },
        label: 'A key on a nail',
        action: {
          type: 'inspect',
          text: 'Barrow\'s gallery key, on its nail, wearing an even film of dust. Whoever went up to the gallery on opening night, they did not borrow this.',
        },
      },
      {
        id: 'fly_gate',
        shape: { kind: 'rect', x: 1150, y: 130, w: 170, h: 440 },
        label: 'The padlocked gallery gate',
        hideWhen: { flag: 'gallery_keyed' },
        action: {
          type: 'useItem',
          accepts: ['master_keys'],
          wrongItemText: 'The padlock is city-made and new. It wants a key, and not an ordinary one.',
          effects: [
            { type: 'setFlag', flag: 'gallery_keyed' },
            { type: 'triggerShift', shift: 's_fly_gate' },
            { type: 'unlockJournal', entry: 'j_gallery_key' },
            { type: 'sound', cue: 'unlock' },
          ],
        },
      },
      {
        id: 'exit_fly_ladder',
        shape: { kind: 'rect', x: 1180, y: 110, w: 110, h: 480 },
        label: 'The ladder to the fly gallery',
        if: { flag: 'gallery_keyed' },
        action: { type: 'navigate', passage: 'p_rig_fly' },
      },
      back.hotspot,
    ],
  };
}
