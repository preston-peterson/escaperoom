/** West wing — the water rooms: Cistern, Sluice Room, Flooded Gallery. */
import type { SceneDef } from '../../../engine/types.ts';
import { chamberShell, exitArch, foregroundFrame, torchPair } from './common.ts';

export function cisternScene(): SceneDef {
  const east = exitArch(1120, 'p_hall_cistern', 'Back to the Hall of Echoes', { scale: 0.8 });
  const south = exitArch(140, 'p_cistern_sluice', 'The sluice room', { scale: 0.8 });
  const north = exitArch(640, 'p_cistern_gallery', 'The drowned door', {
    scale: 0.9,
    lit: true,
    if: { flag: 'drained' },
  });
  return {
    palette: 'waterworks',
    layers: [
      ...chamberShell(41),
      south.layer,
      north.layer,
      // the drowned door, sealed by water
      { kind: 'primitive', primitive: 'door', x: 690, y: 180, scale: 1.0, parallax: 0.15, props: { open: false }, if: { not: { flag: 'drained' } } },
      east.layer,
      // the mural
      { kind: 'primitive', primitive: 'glyphPanel', x: 340, y: 180, scale: 1.0, parallax: 0.2, props: { rows: 2, cols: 5, seed: 14 } },
      // full cistern vs drained basin
      { kind: 'primitive', primitive: 'waterPool', x: 380, y: 640, scale: 1.25, parallax: 0.5, if: { not: { flag: 'drained' } } },
      { kind: 'path', d: 'M 380 720 q 420 -70 860 0 q -60 90 -430 90 q -370 0 -430 -90 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.5, if: { flag: 'drained' } },
      { kind: 'primitive', primitive: 'rubble', x: 560, y: 700, scale: 0.7, parallax: 0.5, props: { seed: 3 }, if: { flag: 'drained' } },
      {
        kind: 'primitive', primitive: 'glint', x: 900, y: 730, scale: 1.3, parallax: 0.5,
        if: { all: [{ flag: 'drained' }, { not: { hasItem: 'builders_coin' } }] },
      },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'mural',
        shape: { kind: 'rect', x: 330, y: 170, w: 380, h: 290 },
        label: 'A faded mural',
        action: {
          type: 'inspect',
          text: "The mural follows the water through the mountain: rising at a spring, crossing a weir, falling through a culvert, resting in a deep pool. You sketch it into your journal.",
          effects: [{ type: 'unlockJournal', entry: 'j_water_mural' }],
        },
      },
      {
        id: 'drips',
        shape: { kind: 'rect', x: 500, y: 40, w: 600, h: 120 },
        label: 'The dripping ceiling',
        action: {
          type: 'inspect',
          text: 'You stand still and listen. Drip-drip-drip … drum … drum. Again: three quick, a pause, two slow. Too regular to be chance. You note the rhythm.',
          effects: [{ type: 'unlockJournal', entry: 'j_drips' }],
        },
      },
      {
        id: 'coin_glint',
        shape: { kind: 'circle', cx: 920, cy: 750, r: 60 },
        label: 'Something glinting in the basin',
        if: { flag: 'drained' },
        hideWhen: { hasItem: 'builders_coin' },
        action: {
          type: 'inspect',
          text: 'Half-buried in a century of silt: a bronze coin. On one face, the labyrinth. On the other, a heartbeat.',
          effects: [
            { type: 'giveItem', item: 'builders_coin' },
            { type: 'markSecret', secret: 'coin' },
          ],
        },
      },
      {
        id: 'basin',
        shape: { kind: 'rect', x: 420, y: 640, w: 780, h: 180 },
        label: 'The cistern',
        if: { not: { flag: 'drained' } },
        action: {
          type: 'inspect',
          text: 'Black water, still as glass, deeper than your light. The drowned door on the far side is shut fast against it.',
        },
      },
      south.hotspot,
      north.hotspot,
      east.hotspot,
    ],
  };
}

export function sluiceScene(): SceneDef {
  const north = exitArch(1120, 'p_cistern_sluice', 'Back to the cistern', { scale: 0.8 });
  return {
    palette: 'waterworks',
    layers: [
      ...chamberShell(47),
      north.layer,
      // four great levers
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'primitive' as const,
        primitive: 'lever' as const,
        x: 320 + i * 210,
        y: 430,
        scale: 1.1,
        parallax: 0.3,
        props: { pulled: false, seed: i },
        if: { not: { solved: 'pz_sluice' as string } },
      })),
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'primitive' as const,
        primitive: 'lever' as const,
        x: 320 + i * 210,
        y: 430,
        scale: 1.1,
        parallax: 0.3,
        props: { pulled: true, seed: i },
        if: { solved: 'pz_sluice' as string },
      })),
      // channel grooves in the floor
      { kind: 'path', d: 'M 300 680 H 1300 V 700 H 300 Z', fill: 'var(--p-water)', opacity: 0.35, parallax: 0.45 },
      { kind: 'primitive', primitive: 'glyphPanel', x: 620, y: 150, scale: 0.75, parallax: 0.2, props: { rows: 1, cols: 4, seed: 21 } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'levers',
        shape: { kind: 'rect', x: 300, y: 400, w: 850, h: 260 },
        label: 'Four great levers',
        hideWhen: { solved: 'pz_sluice' },
        action: { type: 'puzzle', puzzle: 'pz_sluice' },
      },
      {
        id: 'levers_done',
        shape: { kind: 'rect', x: 300, y: 400, w: 850, h: 260 },
        label: 'The sluice levers',
        if: { solved: 'pz_sluice' },
        action: {
          type: 'inspect',
          text: 'All four levers stand thrown. Far away, water is still finding its new level, patiently, like a ledger being balanced.',
        },
      },
      north.hotspot,
    ],
  };
}

export function galleryScene(): SceneDef {
  const south = exitArch(140, 'p_cistern_gallery', 'Back through the drowned door', { scale: 0.8 });
  const east = exitArch(1120, 'p_gallery_hall', 'The old aqueduct — a shortcut to the Hall', { scale: 0.8, lit: true });
  return {
    palette: 'waterworks',
    layers: [
      ...chamberShell(53),
      south.layer,
      east.layer,
      // waterline stain
      { kind: 'path', d: 'M 0 240 H 1600 V 252 H 0 Z', fill: 'var(--p-accent)', opacity: 0.25, parallax: 0 },
      { kind: 'primitive', primitive: 'pillar', x: 420, y: 100, scale: 0.95, parallax: 0.25 },
      { kind: 'primitive', primitive: 'pillar', x: 980, y: 100, scale: 0.95, parallax: 0.25 },
      { kind: 'primitive', primitive: 'rubble', x: 620, y: 620, scale: 1.0, parallax: 0.45, props: { seed: 17 } },
      // the bronze gear, waiting in the silt
      {
        kind: 'primitive', primitive: 'gear', x: 700, y: 640, scale: 0.55, parallax: 0.45,
        props: { r: 90, teeth: 10 },
        if: { not: { any: [{ hasItem: 'bronze_gear' }, { flag: 'gearSeated' }] } },
      },
      // the water sigil pedestal
      { kind: 'primitive', primitive: 'pedestal', x: 1180, y: 420, scale: 0.95, parallax: 0.35, props: { occupied: false } },
      {
        kind: 'primitive', primitive: 'glint', x: 1255, y: 430, scale: 1.2, parallax: 0.35,
        if: { not: { any: [{ hasItem: 'sigil_water' }, { flag: 'sigilsPlaced' }] } },
      },
      // weight inscriptions
      { kind: 'primitive', primitive: 'glyphPanel', x: 200, y: 300, scale: 0.7, parallax: 0.2, props: { rows: 3, cols: 3, seed: 33 } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'take_gear',
        shape: { kind: 'circle', cx: 750, cy: 690, r: 75 },
        label: 'A bronze gear in the silt',
        hideWhen: { any: [{ hasItem: 'bronze_gear' }, { flag: 'gearSeated' }] },
        action: { type: 'pickup', item: 'bronze_gear' },
      },
      {
        id: 'take_sigil_water',
        shape: { kind: 'rect', x: 1180, y: 400, w: 180, h: 240 },
        label: 'A carved disc on a pedestal',
        hideWhen: { any: [{ hasItem: 'sigil_water' }, { flag: 'sigilsPlaced' }] },
        action: {
          type: 'inspect',
          text: 'A stone disc carved with a cresting wave, dry for the first time in a century. On its back, an etched line — you copy it down.',
          effects: [
            { type: 'giveItem', item: 'sigil_water' },
            { type: 'unlockJournal', entry: 'j_serpent_water' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'weights',
        shape: { kind: 'rect', x: 190, y: 290, w: 280, h: 220 },
        label: 'Inscriptions at the old waterline',
        action: {
          type: 'inspect',
          text: '"Three weights the Builders trusted — the OX carries SEVEN, the HERON TWO, the SERPENT NINE." You copy the inscription.',
          effects: [{ type: 'unlockJournal', entry: 'j_weights' }],
        },
      },
      {
        id: 'vell_gallery',
        shape: { kind: 'rect', x: 560, y: 560, w: 180, h: 90 },
        label: 'A waxed satchel in the rubble',
        action: {
          type: 'inspect',
          text: "Vell's satchel, waxed against the water she knew was coming. Inside, a damp-stained page.",
          effects: [{ type: 'unlockJournal', entry: 'j_vell_3' }],
        },
      },
      south.hotspot,
      east.hotspot,
    ],
  };
}
