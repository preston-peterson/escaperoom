/** The third floor: Escapement Gallery, Chime Loft, and the service crawl. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  girderFrame,
  lampPair,
  stoppedClock,
  towerShell,
} from './common.ts';

export function escapementScene(): SceneDef {
  const down = exitArch(120, 'p_pendulum_escapement', 'The spiral stair, down through the hub', { scale: 0.8 });
  const loft = exitArch(1100, 'p_escapement_chimeloft', 'The loft door', {
    scale: 0.8,
    if: { not: { solved: 'pz_escapement' } },
  });
  const upstair = exitArch(620, 'p_escapement_governor', 'The up-stair', {
    scale: 0.85,
    lit: true,
    if: { solved: 'pz_escapement' },
  });
  return {
    palette: 'gearworks',
    layers: [
      ...towerShell(23),
      down.layer,
      loft.layer,
      // where the loft door was: riveted rim-plate, slid past
      { kind: 'path', d: 'M 1090 160 h 320 v 400 h -320 Z', fill: 'var(--p-wall-mid)', opacity: 0.95, parallax: 0.15, if: { solved: 'pz_escapement' } },
      // the blank rim where the up-stair will arrive
      { kind: 'primitive', primitive: 'door', x: 670, y: 120, scale: 1.1, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_escapement' } } },
      upstair.layer,
      // the rim of the floor-wheel, seen edge-on across the back
      { kind: 'primitive', primitive: 'gear', x: 260, y: 40, parallax: 0.1, props: { r: 130, teeth: 14, spin: false }, if: { not: { solved: 'pz_escapement' } } },
      { kind: 'primitive', primitive: 'gear', x: 260, y: 40, parallax: 0.1, props: { r: 130, teeth: 14, spin: true, dur: 46 }, if: { solved: 'pz_escapement' } },
      { kind: 'primitive', primitive: 'gear', x: 1180, y: 30, parallax: 0.1, props: { r: 95, teeth: 12, spin: false }, if: { not: { solved: 'pz_escapement' } } },
      { kind: 'primitive', primitive: 'gear', x: 1180, y: 30, parallax: 0.1, props: { r: 95, teeth: 12, spin: true, dur: 34 }, if: { solved: 'pz_escapement' } },
      // the hub and its three cam-rings
      { kind: 'primitive', primitive: 'gear', x: 700, y: 560, scale: 1, parallax: 0.3, props: { r: 110, teeth: 18, spin: false } },
      { kind: 'primitive', primitive: 'gear', x: 740, y: 600, scale: 1, parallax: 0.3, props: { r: 70, teeth: 12, spin: false } },
      { kind: 'primitive', primitive: 'gear', x: 775, y: 635, scale: 1, parallax: 0.3, props: { r: 35, teeth: 8, spin: false } },
      stoppedClock(430, 170, { r: 55, parallax: 0.2 }),
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'cam_rings',
        shape: { kind: 'circle', cx: 810, cy: 670, r: 130 },
        label: 'The three cam-rings at the hub',
        hideWhen: { solved: 'pz_escapement' },
        action: { type: 'puzzle', puzzle: 'pz_escapement' },
      },
      {
        id: 'great_rim',
        shape: { kind: 'rect', x: 220, y: 30, w: 300, h: 280 },
        label: 'The rim of the floor-wheel',
        action: {
          type: 'inspect',
          text: 'Through a gap in the wainscot you can see it: the outer rim of the floor you are standing on, toothed like a gear the size of a plaza. The gallery is not in the tower. The gallery is a part of the tower, the way a wheel is part of a watch.',
        },
      },
      down.hotspot,
      loft.hotspot,
      upstair.hotspot,
    ],
  };
}

export function chimeloftScene(): SceneDef {
  const back = exitArch(120, 'p_escapement_chimeloft', 'Back into the gallery', {
    scale: 0.8,
    if: { not: { solved: 'pz_escapement' } },
  });
  const hatch = exitArch(1140, 'p_chimeloft_governor', 'A high hatch, newly aligned', {
    scale: 0.7,
    lit: true,
    if: { solved: 'pz_escapement' },
  });
  return {
    palette: 'brass',
    layers: [
      ...towerShell(29),
      back.layer,
      // the gallery door sealed after the turn
      { kind: 'path', d: 'M 110 160 h 320 v 400 h -320 Z', fill: 'var(--p-wall-mid)', opacity: 0.95, parallax: 0.15, if: { solved: 'pz_escapement' } },
      hatch.layer,
      // four bells on chains gone green
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'path' as const,
        d: `M ${560 + i * 130} 40 L ${560 + i * 130} ${120 + (i % 2) * 30} q -52 10 -52 ${96 - i * 8} q 0 26 52 26 q 52 0 52 -26 q 0 ${-86 + i * 8} -52 -${96 - i * 8}`,
        fill: i === 3 ? 'var(--p-wall-mid)' : 'var(--p-accent)',
        opacity: 0.9,
        parallax: 0.3,
      })),
      // the beat plates riveted under the frame
      { kind: 'primitive', primitive: 'glyphPanel', x: 540, y: 400, scale: 0.6, parallax: 0.25, props: { rows: 1, cols: 3, seed: 31 } },
      stoppedClock(280, 180, { r: 50, parallax: 0.2 }),
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'bells',
        shape: { kind: 'rect', x: 480, y: 40, w: 560, h: 280 },
        label: 'The four bells',
        hideWhen: { flag: 'chimesRung' },
        action: { type: 'puzzle', puzzle: 'pz_chimes' },
      },
      {
        id: 'dead_bell',
        shape: { kind: 'rect', x: 900, y: 100, w: 140, h: 200 },
        label: 'The dead bell',
        if: { flag: 'chimesRung' },
        action: {
          type: 'inspect',
          text: 'Up close, the dead bell is no bell at all — a solid casting blank, hung to balance the frame. The Horologist wasted nothing, not even silence.',
        },
      },
      {
        id: 'beat_plates',
        shape: { kind: 'rect', x: 530, y: 390, w: 280, h: 180 },
        label: 'Three plates under the bell frame',
        action: {
          type: 'inspect',
          text: "'TICK at the crown. TOCK at the sixth hour. REST at the ninth.' One plate for each cam-ring of the gallery below. You copy all three.",
          effects: [{ type: 'unlockJournal', entry: 'j_beatplates' }],
        },
      },
      back.hotspot,
      hatch.hotspot,
    ],
  };
}

export function crawlScene(): SceneDef {
  const down = exitArch(180, 'p_pendulum_crawl', 'The hatch down to the Pendulum Hall', { scale: 0.6 });
  const up = exitArch(1180, 'p_crawl_astrolabe', 'The hatch up to the Astrolabe Deck', { scale: 0.6, lit: true });
  return {
    palette: 'cavern',
    layers: [
      ...towerShell(37),
      down.layer,
      up.layer,
      // the wall-way: pipes and the long ladder between the tower's skins
      { kind: 'primitive', primitive: 'pipes', x: 460, y: 100, scale: 0.9, parallax: 0.2, props: { seed: 41 } },
      { kind: 'primitive', primitive: 'pipes', x: 820, y: 300, scale: 0.8, parallax: 0.25, props: { seed: 43 } },
      // ladder rungs
      ...[0, 1, 2, 3, 4, 5].map((i) => ({
        kind: 'path' as const,
        d: `M 660 ${140 + i * 80} h 220 v 14 h -220 Z`,
        fill: 'var(--p-wall-light)',
        opacity: 0.8,
        parallax: 0.3,
      })),
      { kind: 'path', d: 'M 652 60 h 16 v 560 h -16 Z M 872 60 h 16 v 560 h -16 Z', fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.3 },
      // the letter, folded into a rung joint
      {
        kind: 'primitive', primitive: 'glint', x: 852, y: 388, scale: 1.1, parallax: 0.3,
        if: { not: { flag: 'letterFound' } },
      },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 560, parallax: 0.5, props: { w: 1400, h: 240, opacity: 0.24, speed: 30 } },
      ...lampPair(false),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'letter_nook',
        shape: { kind: 'circle', cx: 872, cy: 408, r: 60 },
        label: 'A pale corner of paper in the rung joint',
        hideWhen: { flag: 'letterFound' },
        action: {
          type: 'inspect',
          text: 'Folded small and wedged where a climbing hand would find it: a letter, addressed to no one, signed with a single initial. You read it twice, and copy it into the journal with more care than you knew you had.',
          effects: [
            { type: 'setFlag', flag: 'letterFound' },
            { type: 'markSecret', secret: 'letter' },
            { type: 'unlockJournal', entry: 'j_fen_letter' },
          ],
        },
      },
      {
        id: 'wallway',
        shape: { kind: 'rect', x: 430, y: 90, w: 260, h: 260 },
        label: 'The pipe runs',
        action: {
          type: 'inspect',
          text: 'Steam mains, chime wires, the long tendons of the tower, all labelled in shorthand and all reachable from this one shoulder-wide seam. Whoever maintained this place crawled it in the dark, often, and left the lamps unlit to save oil.',
        },
      },
      down.hotspot,
      up.hotspot,
    ],
  };
}
