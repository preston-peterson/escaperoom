/** The coast: Landing Dock, Cliff Stair, and the Sea Cave the ebb uncovers. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  foregroundFrame,
  headland,
  lanternPosts,
  roomShell,
  seaHorizon,
} from './common.ts';

export function dockScene(): SceneDef {
  const stair = exitArch(1130, 'p_dock_cliff', 'The cliff stair, up into the mist', {
    scale: 0.9,
    lit: true,
  });
  return {
    palette: 'shore',
    layers: [
      ...seaHorizon(280, 300),
      // the bared harbor floor at low tide
      {
        kind: 'path',
        d: 'M 0 580 Q 400 520 800 545 Q 1200 570 1600 540 L 1600 620 Q 800 660 0 640 Z',
        fill: 'var(--p-wall-dark)',
        opacity: 0.9,
        parallax: 0.05,
        if: { all: [{ flag: 'tideLow' }, { not: { flag: 'tideHigh' } }] },
      },
      ...headland(2),
      // the jetty, out over the water
      { kind: 'path', d: 'M 620 610 L 1020 560 L 1030 580 L 630 632 Z M 700 600 v 90 M 900 575 v 90', fill: 'var(--p-wall-mid)', parallax: 0.25 },
      // the skiff: aground until the flood lifts her
      {
        kind: 'path',
        d: 'M 330 640 q 90 -34 190 -8 l -16 34 q -80 20 -158 -4 Z M 420 600 v 44',
        fill: 'var(--p-wall-mid)',
        opacity: 0.95,
        parallax: 0.4,
        if: { not: { flag: 'tideHigh' } },
      },
      {
        kind: 'path',
        d: 'M 700 520 q 90 -30 190 -6 l -14 28 q -82 18 -162 -4 Z M 790 484 v 40',
        fill: 'var(--p-wall-mid)',
        opacity: 0.95,
        parallax: 0.1,
        if: { flag: 'tideHigh' },
      },
      // the cave mouth the sea was keeping
      {
        kind: 'path',
        d: 'M 60 600 Q 130 470 210 600 Z',
        fill: '#060a0c',
        opacity: 0.95,
        parallax: 0.1,
        if: { all: [{ flag: 'tideLow' }, { not: { flag: 'tideHigh' } }] },
      },
      // something half-buried in the drained mud
      {
        kind: 'primitive', primitive: 'glint', x: 500, y: 596, scale: 1.2, parallax: 0.2,
        if: {
          all: [
            { flag: 'tideLow' },
            { not: { flag: 'tideHigh' } },
            { not: { hasItem: 'warden_token' } },
          ],
        },
      },
      // the ferry letterbox on its post
      { kind: 'path', d: 'M 1050 560 v 130 M 1022 560 h 58 v -44 h -58 Z', fill: 'var(--p-wall-light)', opacity: 0.9, parallax: 0.35 },
      stair.layer,
      ...lanternPosts(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'letterbox',
        shape: { kind: 'rect', x: 1000, y: 500, w: 110, h: 200 },
        label: 'The ferry letterbox',
        action: {
          type: 'inspect',
          text: 'The letterbox holds nothing now but the letter you already carry, and a dry wasp nest. The ferry timetable beneath it has weathered down to one legible word: RETURNING.',
        },
      },
      {
        id: 'skiff_aground',
        shape: { kind: 'rect', x: 320, y: 580, w: 220, h: 110 },
        label: 'A skiff, hard aground',
        if: { not: { flag: 'tideHigh' } },
        action: {
          type: 'inspect',
          text: 'A sound little skiff lying on her bilge above the waterline, oars shipped, painter neatly coiled. Nothing wrong with her that a returning sea would not fix.',
        },
      },
      {
        id: 'skiff_afloat',
        shape: { kind: 'rect', x: 690, y: 470, w: 220, h: 100 },
        label: 'The skiff, riding at the jetty',
        if: { flag: 'tideHigh' },
        action: {
          type: 'inspect',
          text: 'The skiff rides upright at the jetty, tugging softly at her painter. When this is finished, she will carry you off the island. She seems to know it.',
        },
      },
      {
        id: 'mud_token',
        shape: { kind: 'circle', cx: 520, cy: 616, r: 60 },
        label: 'Something glinting in the harbor mud',
        if: { all: [{ flag: 'tideLow' }, { not: { flag: 'tideHigh' } }] },
        hideWhen: { hasItem: 'warden_token' },
        action: {
          type: 'inspect',
          text: 'You kneel in a century of harbor mud and work it free: a sea-worn Warden token — a wave on one face, a closed eye on the other. Someone paid the sea a toll here, once.',
          effects: [
            { type: 'giveItem', item: 'warden_token' },
            { type: 'markSecret', secret: 'token' },
          ],
        },
      },
      {
        id: 'cave_mouth',
        shape: { kind: 'polygon', points: [[60, 600], [130, 480], [210, 600]] },
        label: 'A cave mouth at the cliff foot',
        if: { flag: 'tideLow' },
        action: { type: 'navigate', passage: 'p_dock_seacave' },
      },
      stair.hotspot,
    ],
  };
}

export function cliffStairScene(): SceneDef {
  const down = exitArch(140, 'p_dock_cliff', 'Down to the landing dock', { scale: 0.8 });
  const up = exitArch(1120, 'p_cliff_square', 'Up to the village square', {
    scale: 0.85,
    lit: true,
  });
  return {
    palette: 'shore',
    layers: [
      ...seaHorizon(330, 240),
      ...headland(3),
      // the stair cut into the cliff
      { kind: 'primitive', primitive: 'stairs', x: 420, y: 190, parallax: 0.1, props: { steps: 11, w: 700, h: 380, dir: 'up' } },
      down.layer,
      up.layer,
      // the inscription where the steps turn
      { kind: 'primitive', primitive: 'glyphPanel', x: 560, y: 300, scale: 0.8, parallax: 0.2, props: { rows: 2, cols: 5, seed: 12 } },
      // one windswept tree above the drop
      { kind: 'primitive', primitive: 'tree', x: 1150, y: 180, parallax: 0.22, props: { seed: 5, bare: true } },
      { kind: 'primitive', primitive: 'fog', x: 0, y: 420, parallax: 0.3, props: { w: 900, h: 160, opacity: 0.18, speed: 20 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'warden_stone',
        shape: { kind: 'rect', x: 550, y: 290, w: 320, h: 250 },
        label: 'An inscription cut into the cliff',
        action: {
          type: 'inspect',
          text: "The old formal script, softened by salt until only one word keeps its edges: 'BELOW THE BAY THE UNDERTOW TURNS IN ITS SLEEP. WE DO NOT WAKE IT. WE DO NOT NAME IT TWICE.' You copy it exactly.",
          effects: [{ type: 'unlockJournal', entry: 'j_warden_1' }],
        },
      },
      {
        id: 'tide_marks',
        shape: { kind: 'rect', x: 220, y: 560, w: 300, h: 160 },
        label: 'Old tide marks on the rock',
        action: {
          type: 'inspect',
          text: 'Generations of high-water lines are scored into the stone, each dated in the Warden style. The marks climb, year over year — then stop climbing, all at once.',
        },
      },
      down.hotspot,
      up.hotspot,
    ],
  };
}

export function seaCaveScene(): SceneDef {
  const out = exitArch(140, 'p_dock_seacave', 'Out to the bared harbor', { scale: 0.8, lit: true });
  return {
    palette: 'waterworks',
    layers: [
      ...roomShell(21),
      out.layer,
      // the tide's ceiling line
      { kind: 'path', d: 'M 0 200 H 1600 V 214 H 0 Z', fill: 'var(--p-accent)', opacity: 0.22, parallax: 0 },
      { kind: 'primitive', primitive: 'waterPool', x: 900, y: 700, parallax: 0.45, props: { w: 560, h: 140 } },
      { kind: 'primitive', primitive: 'rubble', x: 480, y: 620, scale: 0.9, parallax: 0.4, props: { seed: 6 } },
      // the flood carving, above the barnacle line
      { kind: 'primitive', primitive: 'glyphPanel', x: 640, y: 250, scale: 0.85, parallax: 0.2, props: { rows: 2, cols: 4, seed: 19 } },
      // Maren's cairn
      { kind: 'path', d: 'M 1140 640 q 40 -60 90 -2 q 50 -44 88 6 q 30 40 -20 52 h -140 q -44 -14 -18 -56 Z', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      // the impeller, sea-kept
      {
        kind: 'primitive', primitive: 'gear', x: 300, y: 680, scale: 0.55, parallax: 0.45,
        props: { r: 85, teeth: 8 },
        if: { not: { any: [{ hasItem: 'eng_impeller' }, { flag: 'engineFitted' }] } },
      },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 560, parallax: 0.55, props: { w: 1400, h: 240, opacity: 0.22, speed: 18 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'flood_carving',
        shape: { kind: 'rect', x: 630, y: 240, w: 340, h: 240 },
        label: 'A carving above the barnacle line',
        action: {
          type: 'inspect',
          text: "'TO CALL THE SEA HOME: LOOSE THE BRAKE. OPEN THE GATE. THEN THE BOOM. THEN THE RACE.' Cut where only the lowest tide could ever read it. You copy the order.",
          effects: [{ type: 'unlockJournal', entry: 'j_floodorder' }],
        },
      },
      {
        id: 'cairn',
        shape: { kind: 'rect', x: 1120, y: 600, w: 260, h: 130 },
        label: 'A cairn, deliberately built',
        action: {
          type: 'inspect',
          text: 'Beach stones stacked with a housekeeper’s neatness, weighting a creel. Inside, dry as the day it was folded: a letter.',
          effects: [{ type: 'unlockJournal', entry: 'j_maren_final' }],
        },
      },
      {
        id: 'take_impeller',
        shape: { kind: 'circle', cx: 385, cy: 765, r: 90 },
        label: 'A bronze impeller in the shingle',
        hideWhen: { any: [{ hasItem: 'eng_impeller' }, { flag: 'engineFitted' }] },
        action: { type: 'pickup', item: 'eng_impeller' },
      },
      {
        id: 'tide_pool',
        shape: { kind: 'rect', x: 920, y: 690, w: 520, h: 150 },
        label: 'A black tide pool',
        action: {
          type: 'inspect',
          text: 'The pool is still, and deeper than the cave floor has any right to allow. Far down, a paleness that is not a reflection drifts a hand-span left, and stops. You decide the carving is more interesting.',
        },
      },
      out.hotspot,
    ],
  };
}
