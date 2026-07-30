/** Front of house — the Grand Lobby, the House, and the Stage itself. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  foregroundFrame,
  ghostLight,
  grandArch,
  interiorShell,
  sconcePair,
  stageDoor,
} from './common.ts';

export function lobbyScene(): SceneDef {
  const houseDoors = grandArch(1040, 'p_lobby_house', 'The house doors', { scale: 0.95 });
  return {
    palette: 'limelight',
    layers: [
      ...interiorShell(11, 'velvet'),
      { kind: 'primitive', primitive: 'chandelier', x: 540, y: 30, scale: 1.1, parallax: 0.1, props: { style: 'crystal', lit: true } },
      // Past stars of the Coronet — one frame knocked askew in the exodus.
      { kind: 'primitive', primitive: 'portraitFrame', x: 150, y: 120, scale: 0.72, parallax: 0.2, props: { seed: 3, oval: true } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 400, y: 115, scale: 0.72, parallax: 0.2, props: { seed: 7 } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 650, y: 120, scale: 0.72, parallax: 0.2, props: { seed: 12, tilted: true } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 890, y: 115, scale: 0.6, parallax: 0.2, props: { seed: 19, oval: true } },
      // The four muses' plaques beneath the portraits.
      { kind: 'primitive', primitive: 'glyphPanel', x: 300, y: 420, scale: 0.7, parallax: 0.2, props: { rows: 1, cols: 4, seed: 5 } },
      houseDoors.layer,
      // The chain through the door handles, until the wheels align.
      {
        kind: 'path',
        d: 'M 1110 380 q 60 26 120 0 q -50 40 -120 0 Z M 1150 384 h 42 v 60 l -21 14 l -21 -14 Z',
        fill: 'var(--p-accent)',
        opacity: 0.9,
        parallax: 0.15,
        if: { not: { solved: 'pz_house_doors' } },
      },
      // The playbill on its easel.
      { kind: 'path', d: 'M 620 760 l 60 -240 h 10 l -52 240 Z M 800 760 l -60 -240 h -10 l 52 240 Z', fill: 'var(--p-wall-dark)', parallax: 0.35 },
      { kind: 'primitive', primitive: 'paperScrap', x: 590, y: 400, scale: 1.6, parallax: 0.35, props: { kind: 'letter', rotate: -2, seed: 9 } },
      { kind: 'primitive', primitive: 'furniture', x: 1180, y: 600, scale: 0.8, parallax: 0.5, props: { kind: 'chair', seed: 4 } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'playbill',
        shape: { kind: 'rect', x: 580, y: 380, w: 280, h: 230 },
        label: 'The opening-night playbill',
        action: {
          type: 'inspect',
          text: 'THE GILDED CURTAIN — a new play — SILAS VANE above the title. Someone has ringed his name in pencil and written beneath it: "one night only," twice underlined. You open a case file.',
          effects: [{ type: 'unlockJournal', entry: 'j_case' }],
        },
      },
      {
        id: 'portraits',
        shape: { kind: 'rect', x: 140, y: 100, w: 940, h: 240 },
        label: 'Portraits of past stars, with bronze plaques',
        action: {
          type: 'inspect',
          text: 'Four gilt frames, four dead luminaries, four bronze plaques: COMEDY smiled for 3 seasons. TRAGEDY wept for 8. MUSIC played for 5. DANCE turned for 2. You copy the numbers down.',
          effects: [{ type: 'unlockJournal', entry: 'j_muses' }],
        },
      },
      {
        id: 'door_chain',
        shape: { kind: 'rect', x: 1090, y: 360, w: 190, h: 130 },
        label: 'The chained house doors',
        hideWhen: { solved: 'pz_house_doors' },
        action: { type: 'puzzle', puzzle: 'pz_house_doors' },
      },
      houseDoors.hotspot,
    ],
  };
}

export function houseScene(): SceneDef {
  const passDoor = stageDoor(90, 'p_house_stage', 'The pass door to the stage', { scale: 0.8 });
  return {
    palette: 'limelight',
    layers: [
      // The dark of the auditorium.
      { kind: 'path', d: 'M 0 0 H 1600 V 900 H 0 Z', fill: 'var(--p-sky-top)', parallax: 0 },
      { kind: 'primitive', primitive: 'chandelier', x: 600, y: 10, scale: 1.05, parallax: 0.08, props: { style: 'crystal', lit: true }, if: { not: { flag: 'ghost_dark' } } },
      // Proscenium arch.
      { kind: 'path', d: 'M 300 110 H 1300 V 700 H 1240 V 170 H 360 V 700 H 300 Z', fill: 'var(--p-wall-mid)', parallax: 0.1 },
      { kind: 'path', d: 'M 330 140 H 1270 V 154 H 330 Z', fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.1 },
      // Glimpse of the set once the curtain is up.
      { kind: 'path', d: 'M 380 180 H 1220 V 660 H 380 Z', fill: 'var(--p-sky-bottom)', parallax: 0.1, if: { flag: 'curtain_up' } },
      { kind: 'primitive', primitive: 'furniture', x: 700, y: 480, scale: 0.55, parallax: 0.1, props: { kind: 'desk', seed: 6 }, if: { flag: 'curtain_up' } },
      // The great curtain — in, or risen.
      { kind: 'primitive', primitive: 'curtainStage', x: 355, y: 130, scale: 0.98, parallax: 0.1, props: { mode: 'stage', open: 0.04 }, if: { not: { flag: 'curtain_up' } } },
      { kind: 'primitive', primitive: 'curtainStage', x: 355, y: 130, scale: 0.98, parallax: 0.1, props: { mode: 'stage', open: 0.92 }, if: { flag: 'curtain_up' } },
      // The ghost light on the apron.
      ...ghostLight(790, 690, 0.75, { not: { flag: 'ghost_dark' } }),
      // The author's box on the right wall.
      { kind: 'path', d: 'M 1330 300 H 1580 V 470 H 1330 Z M 1320 460 H 1590 V 486 H 1320 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      { kind: 'primitive', primitive: 'door', x: 1400, y: 220, scale: 0.5, parallax: 0.2, props: { open: false } },
      passDoor.layer,
      // The callboard by the pass door.
      { kind: 'primitive', primitive: 'glyphPanel', x: 320, y: 430, scale: 0.55, parallax: 0.25, props: { rows: 2, cols: 3, seed: 17 } },
      // Rows of seats, falling away toward you.
      { kind: 'path', d: 'M 0 700 Q 800 660 1600 700 L 1600 740 Q 800 700 0 740 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.5 },
      { kind: 'path', d: 'M 0 780 Q 800 730 1600 780 L 1600 828 Q 800 778 0 828 Z', fill: 'var(--p-wall-dark)', opacity: 0.95, parallax: 0.65 },
      { kind: 'path', d: 'M 0 870 Q 800 810 1600 870 L 1600 900 L 0 900 Z', fill: '#080405', opacity: 0.98, parallax: 0.8 },
      // The pit rail — and the seam of lamplight once the house goes dark.
      { kind: 'path', d: 'M 430 664 H 1170 V 672 H 430 Z', fill: 'var(--p-glow)', opacity: 0.55, parallax: 0.45, if: { flag: 'ghost_dark' } },
      // Darkness when the ghost light dies.
      { kind: 'path', d: 'M 0 0 H 1600 V 900 H 0 Z', fill: '#020102', opacity: 0.4, parallax: 0, if: { flag: 'ghost_dark' } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'empty_house',
        shape: { kind: 'rect', x: 200, y: 690, w: 1200, h: 150 },
        label: 'Six hundred empty seats',
        action: {
          type: 'inspect',
          text: 'Coats still folded over armrests, a dropped glove, one opera glass under seat K-13. They left mid-ovation and none of them came back for anything.',
        },
      },
      {
        id: 'callboard',
        shape: { kind: 'rect', x: 310, y: 420, w: 220, h: 170 },
        label: 'The company callboard',
        action: {
          type: 'inspect',
          text: 'Cast lists, fire notice, a chalked line: "House word for opening night — the Lady herself." Below it, in another hand: "ask the playbill, new boy."',
        },
      },
      {
        id: 'pass_door_lock',
        shape: { kind: 'rect', x: 100, y: 300, w: 190, h: 260 },
        label: 'The pass door letter-lock',
        hideWhen: { solved: 'pz_pass_door' },
        action: { type: 'puzzle', puzzle: 'pz_pass_door' },
      },
      {
        id: 'exit_box',
        shape: { kind: 'rect', x: 1390, y: 210, w: 150, h: 260 },
        label: "The author's box",
        action: { type: 'navigate', passage: 'p_house_box' },
      },
      {
        id: 'pit_hatch',
        shape: { kind: 'rect', x: 430, y: 640, w: 740, h: 60 },
        label: 'A seam of light around the pit hatch',
        if: { flag: 'ghost_dark' },
        action: { type: 'navigate', passage: 'p_pit_hatch' },
      },
      passDoor.hotspot,
    ],
  };
}

export function stageScene(): SceneDef {
  const wing = stageDoor(1360, 'p_stage_prompt', 'The prompt corner, stage right', { scale: 0.8, open: true });
  return {
    palette: 'limelight',
    layers: [
      // The set, riding the revolve: Act III study — or, turned, the garden.
      { kind: 'primitive', primitive: 'panelWall', x: 140, y: 90, parallax: 0.05, props: { w: 1320, h: 440, seed: 23, style: 'wood' }, if: { not: { solved: 'pz_revolve' } } },
      { kind: 'primitive', primitive: 'portraitFrame', x: 300, y: 160, scale: 0.6, parallax: 0.08, props: { seed: 31 }, if: { not: { solved: 'pz_revolve' } } },
      { kind: 'primitive', primitive: 'furniture', x: 980, y: 380, scale: 0.75, parallax: 0.1, props: { kind: 'desk', seed: 8 }, if: { not: { solved: 'pz_revolve' } } },
      { kind: 'path', d: 'M 140 90 H 1460 V 530 H 140 Z', fill: 'var(--p-sky-bottom)', parallax: 0.05, if: { solved: 'pz_revolve' } },
      { kind: 'path', d: 'M 1090 160 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0 Z', fill: 'var(--p-fog)', opacity: 0.8, parallax: 0.05, if: { solved: 'pz_revolve' } },
      { kind: 'primitive', primitive: 'tree', x: 260, y: 180, scale: 0.9, parallax: 0.08, props: { bare: true }, if: { solved: 'pz_revolve' } },
      { kind: 'path', d: 'M 700 420 h 200 l -20 110 h -160 Z M 760 360 h 80 v 60 h -80 Z', fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.1, if: { solved: 'pz_revolve' } },
      // The upstage door — it rides the revolve and never moves.
      { kind: 'primitive', primitive: 'door', x: 560, y: 150, scale: 0.85, parallax: 0.1, props: { open: false } },
      // Stage deck and the revolve seam.
      { kind: 'path', d: 'M 0 900 L 0 530 L 1600 530 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 260 610 q 540 -60 1080 0 q -540 44 -1080 0 Z', fill: 'none', opacity: 0.5, parallax: 0.2 },
      { kind: 'path', d: 'M 260 606 q 540 -58 1080 0 l 0 8 q -540 -50 -1080 0 Z', fill: 'var(--p-wall-dark)', opacity: 0.7, parallax: 0.2 },
      // The trap — a rectangle of deck that is also a grave.
      { kind: 'path', d: 'M 640 700 h 320 v 96 h -320 Z', fill: 'var(--p-wall-dark)', opacity: 0.85, parallax: 0.3 },
      { kind: 'path', d: 'M 648 706 h 304 v 84 h -304 Z', fill: '#050203', opacity: 0.9, parallax: 0.3, if: { solved: 'pz_trap_machine' } },
      // The revolve console at the deck's edge.
      { kind: 'primitive', primitive: 'pedestal', x: 1170, y: 560, scale: 0.85, parallax: 0.35, props: { occupied: true } },
      { kind: 'primitive', primitive: 'gear', x: 1190, y: 520, scale: 0.4, parallax: 0.35, props: { r: 80, teeth: 9 } },
      // The ghost light, downstage left.
      ...ghostLight(210, 720, 1, { not: { flag: 'ghost_dark' } }),
      // The great curtain, seen from the deck: a wall of velvet until it rises.
      { kind: 'primitive', primitive: 'curtainStage', x: 60, y: 60, scale: 1.65, parallax: 0.7, props: { mode: 'stage', open: 0.05 }, if: { not: { flag: 'curtain_up' } } },
      { kind: 'primitive', primitive: 'curtainStage', x: 60, y: 60, scale: 1.65, parallax: 0.7, props: { mode: 'stage', open: 0.96 }, if: { flag: 'curtain_up' } },
      // Haze in the limelight.
      { kind: 'primitive', primitive: 'fog', x: 120, y: 560, parallax: 0.5, props: { w: 1360, h: 220, opacity: 0.14 } },
      wing.layer,
      // The dark, when the ghost light dies.
      { kind: 'path', d: 'M 0 0 H 1600 V 900 H 0 Z', fill: '#020102', opacity: 0.38, parallax: 0, if: { flag: 'ghost_dark' } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'set_flats',
        shape: { kind: 'rect', x: 200, y: 110, w: 340, h: 380 },
        label: 'The Act III set',
        action: {
          type: 'inspect',
          text: 'A study built of canvas and cunning: books painted onto flats, a fireplace with no chimney. The whole room stands on the revolve, waiting for a scene change that never came.',
        },
      },
      {
        id: 'ghost_light',
        shape: { kind: 'rect', x: 130, y: 420, w: 160, h: 320 },
        label: 'The ghost light',
        if: { not: { flag: 'ghost_dark' } },
        action: {
          type: 'inspect',
          text: 'One bare bulb on a pole, downstage center of nothing, burning so the theater is never entirely dark — and so whatever walks an empty stage can find its mark. Tonight it guards a chalk-cold silence.',
        },
      },
      {
        id: 'ghost_light_dark',
        shape: { kind: 'rect', x: 130, y: 420, w: 160, h: 320 },
        label: 'The dead ghost light',
        if: { flag: 'ghost_dark' },
        hideWhen: { hasItem: 'stage_token' },
        action: {
          type: 'inspect',
          text: 'The globe is still warm. You unscrew it — stagehand\'s habit — and something rattles in the base: a brass token, thumbed bright. THE CORONET — STAGE DOOR — No. 1. Forty years of crews touched it for luck before every ring-up.',
          effects: [
            { type: 'giveItem', item: 'stage_token' },
            { type: 'markSecret', secret: 'token' },
            { type: 'sound', cue: 'secret' },
          ],
        },
      },
      {
        id: 'trap_door',
        shape: { kind: 'rect', x: 640, y: 690, w: 320, h: 116 },
        label: 'The Act III trapdoor',
        action: { type: 'navigate', passage: 'p_trapdoor' },
      },
      {
        id: 'upstage_door',
        shape: { kind: 'rect', x: 560, y: 150, w: 222, h: 380 },
        label: 'The upstage door',
        action: { type: 'navigate', passage: 'p_revolve_door' },
      },
      {
        id: 'revolve_console',
        shape: { kind: 'rect', x: 1150, y: 500, w: 220, h: 300 },
        label: 'The revolve console',
        hideWhen: { solved: 'pz_revolve' },
        action: { type: 'puzzle', puzzle: 'pz_revolve' },
      },
      {
        id: 'revolve_console_set',
        shape: { kind: 'rect', x: 1150, y: 500, w: 220, h: 300 },
        label: 'The revolve console, set for Act III',
        if: { solved: 'pz_revolve' },
        action: {
          type: 'inspect',
          text: 'The rings rest on their marks. Deep under the deck, the revolve\'s gear train holds the garden where the study used to be, patient as everything else in this building.',
        },
      },
      {
        id: 'make_the_case',
        shape: { kind: 'rect', x: 330, y: 620, w: 280, h: 200 },
        label: 'The apron — face the house and name it',
        action: { type: 'puzzle', puzzle: 'pz_accusation' },
      },
      wing.hotspot,
      {
        id: 'exit_pass_door',
        shape: { kind: 'rect', x: 20, y: 240, w: 90, h: 340 },
        label: 'The pass door back to the house',
        action: { type: 'navigate', passage: 'p_house_stage' },
      },
    ],
  };
}
