/** Ground floors: the Winding Room (entry) and the Pendulum Hall. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  girderFrame,
  lampPair,
  stoppedClock,
  towerShell,
  wallClock,
} from './common.ts';

export function windingScene(): SceneDef {
  const up = exitArch(1060, 'p_winding_pendulum', 'The stair up to the Pendulum Hall', { lit: true });
  return {
    palette: 'brass',
    layers: [
      ...towerShell(3),
      // the great winding drum, dead still until the spring is wound
      { kind: 'primitive', primitive: 'gear', x: 320, y: 180, parallax: 0.2, props: { r: 150, teeth: 16, spin: false }, if: { not: { flag: 'mainspringWound' } } },
      { kind: 'primitive', primitive: 'gear', x: 320, y: 180, parallax: 0.2, props: { r: 150, teeth: 16, spin: true, dur: 40 }, if: { flag: 'mainspringWound' } },
      { kind: 'primitive', primitive: 'gear', x: 580, y: 330, parallax: 0.2, props: { r: 80, teeth: 10, spin: false }, if: { not: { flag: 'mainspringWound' } } },
      { kind: 'primitive', primitive: 'gear', x: 580, y: 330, parallax: 0.2, props: { r: 80, teeth: 10, spin: true, dur: 22 }, if: { flag: 'mainspringWound' } },
      { kind: 'primitive', primitive: 'pipes', x: 620, y: 60, scale: 0.9, parallax: 0.15, props: { seed: 5 } },
      up.layer,
      // the ground gauge: a clock face stopped at four
      wallClock(770, 250, 4, 0, { r: 70, parallax: 0.25 }),
      // the porter's alcove and oil flask
      { kind: 'primitive', primitive: 'pedestal', x: 1360, y: 430, scale: 0.85, parallax: 0.35, props: { occupied: false } },
      {
        kind: 'primitive', primitive: 'glint', x: 1425, y: 440, scale: 1.2, parallax: 0.35,
        if: { not: { any: [{ hasItem: 'oil_flask' }, { flag: 'spindleOiled' }] } },
      },
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'gauge_ground',
        shape: { kind: 'circle', cx: 840, cy: 320, r: 90 },
        label: 'The ground pressure gauge',
        action: {
          type: 'inspect',
          text: 'The gauge wears a clock face, its hand stopped dead on FOUR. A brass tag beneath it reads GROUND. You note the reading.',
          effects: [{ type: 'unlockJournal', entry: 'j_gauge_ground' }],
        },
      },
      {
        id: 'take_oil',
        shape: { kind: 'rect', x: 1360, y: 410, w: 170, h: 240 },
        label: "A flask of clock oil in the porter's alcove",
        hideWhen: { any: [{ hasItem: 'oil_flask' }, { flag: 'spindleOiled' }] },
        action: { type: 'pickup', item: 'oil_flask' },
      },
      {
        id: 'drum',
        shape: { kind: 'rect', x: 280, y: 150, w: 480, h: 400 },
        label: 'The great winding drum',
        action: {
          type: 'inspect',
          text: 'The drum that feeds the whole tower its strength, ribbed like a whale and utterly still. The winding shaft climbs out of it into the dark overhead. Every floor above you hangs off this silence.',
        },
      },
      up.hotspot,
    ],
  };
}

export function pendulumScene(): SceneDef {
  const down = exitArch(120, 'p_winding_pendulum', 'Down to the Winding Room', { scale: 0.8 });
  const east = exitArch(1080, 'p_pendulum_boiler', 'The steam wing — a smell of hot iron', { scale: 0.85 });
  const stair = exitArch(560, 'p_pendulum_escapement', 'The spiral stair-iris', {
    scale: 0.9,
    lit: true,
  });
  const crawl = exitArch(1420, 'p_pendulum_crawl', 'A service hatch in the wall', {
    scale: 0.5,
    lit: true,
    if: { solved: 'pz_governor' },
  });
  return {
    palette: 'brass',
    layers: [
      ...towerShell(7),
      { kind: 'primitive', primitive: 'pillar', x: 330, y: 40, scale: 1.05, parallax: 0.25 },
      { kind: 'primitive', primitive: 'pillar', x: 1180, y: 40, scale: 1.05, parallax: 0.25 },
      down.layer,
      stair.layer,
      // the stair-iris, shuttered until there is steam to lift it
      { kind: 'primitive', primitive: 'door', x: 610, y: 160, scale: 1.05, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_boiler' } } },
      east.layer,
      crawl.layer,
      // the great pendulum, hanging dead centre and dead still
      { kind: 'path', d: 'M 795 0 L 805 0 L 802 560 L 798 560 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.2 },
      { kind: 'path', d: 'M 800 560 m -55 0 a 55 55 0 1 0 110 0 a 55 55 0 1 0 -110 0 Z', fill: 'var(--p-accent)', parallax: 0.2 },
      { kind: 'path', d: 'M 800 560 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 Z', fill: 'var(--p-wall-dark)', opacity: 0.6, parallax: 0.2 },
      // the hall gauge, stopped at seven, and the wall of quiet dials
      wallClock(920, 170, 7, 0, { r: 60, parallax: 0.25 }),
      stoppedClock(220, 150, { r: 45, parallax: 0.2 }),
      stoppedClock(330, 200, { r: 38, parallax: 0.2 }),
      // Fen's slate by the skirting
      { kind: 'primitive', primitive: 'glyphPanel', x: 1230, y: 470, scale: 0.55, parallax: 0.35, props: { rows: 1, cols: 5, seed: 9, glow: true } },
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'gauge_hall',
        shape: { kind: 'circle', cx: 980, cy: 230, r: 80 },
        label: 'The hall pressure gauge',
        action: {
          type: 'inspect',
          text: 'Twin to the gauge below, stopped at SEVEN. Its tag reads HALL. You note the reading.',
          effects: [{ type: 'unlockJournal', entry: 'j_gauge_hall' }],
        },
      },
      {
        id: 'fen_slate',
        shape: { kind: 'rect', x: 1220, y: 460, w: 220, h: 160 },
        label: 'A child-sized slate on a nail',
        action: {
          type: 'inspect',
          text: "A practice slate, chalk ghosted by years of wiping: 'The master's dawn peal — LOW, LOW, HIGH, MIDDLE, LOW. Never the dead bell.' You copy it down.",
          effects: [{ type: 'unlockJournal', entry: 'j_peal' }],
        },
      },
      {
        id: 'pendulum',
        shape: { kind: 'rect', x: 720, y: 380, w: 160, h: 280 },
        label: 'The great pendulum',
        action: {
          type: 'inspect',
          text: 'A bob of polished brass the size of a cauldron, hanging plumb and perfectly, unnervingly still. A pendulum is a heartbeat that has to be given away; nothing in this tower is beating it.',
        },
      },
      down.hotspot,
      stair.hotspot,
      east.hotspot,
      crawl.hotspot,
    ],
  };
}
