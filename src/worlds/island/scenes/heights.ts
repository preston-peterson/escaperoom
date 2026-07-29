/** The heights: Lighthouse Base, Lantern Room, and the headland Observatory. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  foregroundFrame,
  lanternPosts,
  roomShell,
  seaHorizon,
} from './common.ts';

export function lighthouseScene(): SceneDef {
  const out = exitArch(140, 'p_orchard_lighthouse', 'Back down the path to the orchard', {
    scale: 0.8,
  });
  return {
    palette: 'shore',
    layers: [
      ...roomShell(51),
      out.layer,
      // the stair winding up the tower wall
      { kind: 'primitive', primitive: 'stairs', x: 700, y: 160, parallax: 0.15, props: { steps: 9, w: 620, h: 400, dir: 'up' } },
      // the hatch at its head, glyphs across the frame
      { kind: 'primitive', primitive: 'door', x: 1310, y: 40, scale: 0.55, parallax: 0.12, props: { open: false }, if: { not: { solved: 'pz_hatch' } } },
      { kind: 'primitive', primitive: 'door', x: 1310, y: 40, scale: 0.55, parallax: 0.12, props: { open: true }, if: { solved: 'pz_hatch' } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1080, y: 90, scale: 0.5, parallax: 0.12, props: { rows: 1, cols: 5, seed: 55, glow: false }, if: { not: { solved: 'pz_hatch' } } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1080, y: 90, scale: 0.5, parallax: 0.12, props: { rows: 1, cols: 5, seed: 55, glow: true }, if: { solved: 'pz_hatch' } },
      // the keeper's watch desk
      { kind: 'path', d: 'M 360 640 h 300 l 22 -76 h -300 Z M 420 640 v 140 M 600 640 v 140', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'path', d: 'M 430 556 h 120 v 14 h -120 Z', fill: 'var(--p-wall-light)', opacity: 0.85, parallax: 0.4 },
      { kind: 'primitive', primitive: 'pipes', x: 200, y: 200, scale: 0.8, parallax: 0.25, props: { seed: 14 } },
      ...lanternPosts(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'keepers_log',
        shape: { kind: 'rect', x: 350, y: 540, w: 330, h: 130 },
        label: "The keeper's log, open on the desk",
        action: {
          type: 'inspect',
          text: 'The log lies open where the entries stop. Her hand grows smaller down the page, as if the words were rationing themselves. You copy the last of them.',
          effects: [{ type: 'unlockJournal', entry: 'j_maren_3' }],
        },
      },
      {
        id: 'hatch',
        shape: { kind: 'rect', x: 1070, y: 60, w: 420, h: 260 },
        label: 'The bolted hatch to the lantern room',
        hideWhen: { solved: 'pz_hatch' },
        action: { type: 'puzzle', puzzle: 'pz_hatch' },
      },
      {
        id: 'stair_up',
        shape: { kind: 'polygon', points: [[720, 560], [1320, 170], [1420, 300], [860, 620]] },
        label: 'The stair to the lantern room',
        action: { type: 'navigate', passage: 'p_lighthouse_lantern' },
      },
      out.hotspot,
    ],
  };
}

export function lanternRoomScene(): SceneDef {
  const down = exitArch(140, 'p_lighthouse_lantern', 'Down through the hatch', { scale: 0.75 });
  return {
    palette: 'shore',
    layers: [
      // the bay far below, through the gallery glass
      ...seaHorizon(300, 220),
      { kind: 'path', d: 'M 0 900 L 0 520 L 1600 520 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      // glazing bars of the lantern gallery
      { kind: 'path', d: 'M 200 60 v 460 M 500 40 v 480 M 800 30 v 490 M 1100 40 v 480 M 1400 60 v 460', fill: 'none', parallax: 0.05 },
      { kind: 'path', d: 'M 196 60 h 8 v 460 h -8 Z M 496 40 h 8 v 480 h -8 Z M 796 30 h 8 v 490 h -8 Z M 1096 40 h 8 v 480 h -8 Z M 1396 60 h 8 v 460 h -8 Z', fill: 'var(--p-wall-dark)', opacity: 0.85, parallax: 0.05 },
      down.layer,
      // the great lens in its brass cage
      { kind: 'primitive', primitive: 'portal', x: 640, y: 120, parallax: 0.2, props: { r: 150, open: false }, if: { not: { flag: 'beaconLit' } } },
      { kind: 'primitive', primitive: 'portal', x: 640, y: 120, parallax: 0.2, props: { r: 150, open: true }, if: { flag: 'beaconLit' } },
      // the lamp floor beneath it
      { kind: 'path', d: 'M 560 560 h 480 l -30 60 h -420 Z', fill: 'var(--p-wall-mid)', parallax: 0.3 },
      {
        kind: 'primitive', primitive: 'glint', x: 990, y: 585, scale: 1.1, parallax: 0.3,
        if: { all: [{ flag: 'beaconLit' }, { not: { flag: 'trueLetter' } }] },
      },
      { kind: 'primitive', primitive: 'fog', x: 0, y: 620, parallax: 0.5, props: { w: 1600, h: 200, opacity: 0.1, speed: 30 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'lens',
        shape: { kind: 'rect', x: 620, y: 110, w: 340, h: 420 },
        label: 'The three-ringed lens',
        hideWhen: { solved: 'pz_lens' },
        action: { type: 'puzzle', puzzle: 'pz_lens' },
      },
      {
        id: 'lens_lit',
        shape: { kind: 'rect', x: 620, y: 110, w: 340, h: 420 },
        label: 'The burning lens',
        if: { solved: 'pz_lens' },
        action: {
          type: 'inspect',
          text: 'The beam wheels slow and white over the bay, then bends down into the water like a hand laid on a brow. The glass is warm. The tower hums one low note, contented.',
        },
      },
      {
        id: 'letter_tin',
        shape: { kind: 'circle', cx: 1010, cy: 605, r: 60 },
        label: 'A glint under the lamp floor',
        if: { all: [{ flag: 'beaconLit' }, { not: { flag: 'trueLetter' } }] },
        action: {
          type: 'inspect',
          text: 'Only with the lamp burning does the gap under the floor plate show its secret: a tin box, wax-sealed, wedged where a keeper would look every night and a stranger never. Inside — her true last letter.',
          effects: [
            { type: 'setFlag', flag: 'trueLetter' },
            { type: 'markSecret', secret: 'letter' },
            { type: 'unlockJournal', entry: 'j_maren_true' },
          ],
        },
      },
      {
        id: 'gallery_rail',
        shape: { kind: 'rect', x: 1150, y: 300, w: 350, h: 200 },
        label: 'The gallery glass',
        action: {
          type: 'inspect',
          text: 'The whole island lies below: the square, the orchard leaning from the wind, the tower’s shadow drawn across the bay like a sounding line. From up here, the harbor has a shape — a machine’s shape.',
        },
      },
      down.hotspot,
    ],
  };
}

export function observatoryScene(): SceneDef {
  const out = exitArch(140, 'p_orchard_observatory', 'Back along the headland track', { scale: 0.8 });
  return {
    palette: 'crypt',
    layers: [
      ...roomShell(61),
      out.layer,
      // the dome slot, open to the night it was built for
      { kind: 'path', d: 'M 620 60 L 980 60 L 940 250 L 660 250 Z', fill: '#060810', parallax: 0.05 },
      { kind: 'primitive', primitive: 'glint', x: 730, y: 110, scale: 0.8, parallax: 0.05 },
      { kind: 'primitive', primitive: 'glint', x: 860, y: 150, scale: 0.6, parallax: 0.05 },
      // the long glass on its mount
      { kind: 'path', d: 'M 700 560 L 900 300 L 940 330 L 740 590 Z M 690 590 h 120 l -20 60 h -80 Z', fill: 'var(--p-wall-mid)', parallax: 0.3 },
      // the chart case
      { kind: 'primitive', primitive: 'pedestal', x: 1150, y: 380, scale: 1.0, parallax: 0.3, props: { occupied: false } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1100, y: 250, scale: 0.6, parallax: 0.3, props: { rows: 1, cols: 3, seed: 63, glow: false }, if: { not: { solved: 'pz_starcase' } } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1100, y: 250, scale: 0.6, parallax: 0.3, props: { rows: 1, cols: 3, seed: 63, glow: true }, if: { solved: 'pz_starcase' } },
      // her notebook on the sill
      { kind: 'path', d: 'M 320 520 h 130 v 16 h -130 Z', fill: 'var(--p-wall-light)', opacity: 0.9, parallax: 0.35 },
      { kind: 'primitive', primitive: 'brazier', x: 240, y: 430, scale: 0.8, parallax: 0.35, props: { lit: true, seed: 16 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'chart_case',
        shape: { kind: 'rect', x: 1090, y: 240, w: 300, h: 300 },
        label: 'A locked chart case, dials of moon-faces',
        hideWhen: { solved: 'pz_starcase' },
        action: { type: 'puzzle', puzzle: 'pz_starcase' },
      },
      {
        id: 'case_open',
        shape: { kind: 'rect', x: 1090, y: 240, w: 300, h: 300 },
        label: 'The opened chart case',
        if: { solved: 'pz_starcase' },
        action: {
          type: 'inspect',
          text: 'Rolled charts in their pigeonholes, each tied with tarred twine. The Wardens filed the sky the way other people file receipts.',
        },
      },
      {
        id: 'notebook',
        shape: { kind: 'rect', x: 300, y: 490, w: 180, h: 100 },
        label: 'A notebook on the sill',
        action: {
          type: 'inspect',
          text: 'Maren’s observatory notebook, left square to the window as if she meant to come back to the same page. You read the night she watched the bay make room for something beneath it.',
          effects: [{ type: 'unlockJournal', entry: 'j_maren_4' }],
        },
      },
      {
        id: 'long_glass',
        shape: { kind: 'polygon', points: [[700, 560], [900, 300], [940, 330], [740, 590]] },
        label: 'The long glass',
        action: {
          type: 'inspect',
          text: 'The telescope is aimed not at the sky but down, at the middle of the bay, and locked there with a set-screw. Whatever it was trained on, she wanted no chance of losing it.',
        },
      },
      out.hotspot,
    ],
  };
}
