/** Scenes for the spine of the labyrinth: Entrance Stair, Gatehouse, Hall of Echoes. */
import type { SceneDef } from '../../../engine/types.ts';
import { chamberShell, exitArch, foregroundFrame, torchPair } from './common.ts';

export function entranceScene(): SceneDef {
  const north = exitArch(620, 'p_entrance_gatehouse', 'Onward into the dark', {
    lit: true,
  });
  return {
    palette: 'cavern',
    layers: [
      ...chamberShell(11),
      // the stair you came down, rising behind you
      { kind: 'primitive', primitive: 'stairs', x: 1000, y: 130, scale: 1.25, parallax: 0.1, props: { steps: 9, w: 560, h: 430, dir: 'up' } },
      { kind: 'path', d: 'M 1000 130 L 1600 60 L 1600 560 L 1080 560 Z', fill: '#050302', opacity: 0.45, parallax: 0.1 },
      north.layer,
      // carved glyph band on the west wall
      { kind: 'primitive', primitive: 'glyphPanel', x: 210, y: 250, scale: 0.9, parallax: 0.2, props: { rows: 1, cols: 4, seed: 4 } },
      { kind: 'primitive', primitive: 'brazier', x: 330, y: 380, scale: 1.1, parallax: 0.4, props: { lit: true, seed: 7 } },
      // the waiting torch, until taken or lit
      {
        kind: 'primitive', primitive: 'torch', x: 700, y: 330, scale: 1.2, parallax: 0.3,
        props: { lit: false },
        if: { not: { any: [{ hasItem: 'unlit_torch' }, { flag: 'torchLit' }] } },
      },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'take_torch',
        shape: { kind: 'rect', x: 690, y: 330, w: 110, h: 290 },
        label: 'An abandoned torch',
        hideWhen: { any: [{ hasItem: 'unlit_torch' }, { flag: 'torchLit' }] },
        action: { type: 'pickup', item: 'unlit_torch' },
      },
      {
        id: 'brazier',
        shape: { kind: 'rect', x: 330, y: 380, w: 250, h: 300 },
        label: 'The entrance brazier',
        action: {
          type: 'useItem',
          accepts: ['unlit_torch'],
          effects: [
            { type: 'removeItem', item: 'unlit_torch' },
            { type: 'giveItem', item: 'torch' },
            { type: 'setFlag', flag: 'torchLit' },
            { type: 'narrate', text: 'The pitch catches with a whump. Your circle of light widens, and the dark steps back — a pace, no more.' },
            { type: 'sound', cue: 'pickup' },
          ],
          wrongItemText: 'The flames lick at it politely and decline.',
        },
      },
      {
        id: 'stair_glyphs',
        shape: { kind: 'rect', x: 200, y: 240, w: 340, h: 260 },
        label: 'Carvings on the wall',
        action: {
          type: 'inspect',
          text: 'Four glyphs march down the stairway wall, repeated over and over: ◐ △ ☰ ✶. You copy them into your journal.',
          effects: [{ type: 'unlockJournal', entry: 'j_stair_glyphs' }],
        },
      },
      {
        id: 'stair_up',
        shape: { kind: 'polygon', points: [[1020, 140], [1580, 80], [1580, 540], [1090, 540]] },
        label: 'The stair to the surface',
        action: {
          type: 'inspect',
          text: 'You look back up the stair. Somewhere far above is daylight. Vell never climbed back to it — not until you finish what she started.',
        },
      },
      north.hotspot,
    ],
  };
}

export function gatehouseScene(): SceneDef {
  const south = exitArch(140, 'p_entrance_gatehouse', 'Back to the entrance stair', { scale: 0.8 });
  const north = exitArch(620, 'p_gatehouse_hall', 'The great slab', { lit: true, if: { solved: 'pz_gatehouse' } });
  return {
    palette: 'cavern',
    layers: [
      ...chamberShell(23),
      south.layer,
      // the slab, until opened
      { kind: 'primitive', primitive: 'door', x: 670, y: 120, scale: 1.15, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_gatehouse' } } },
      north.layer,
      ...torchPair(),
      // keeper's stores
      { kind: 'primitive', primitive: 'rubble', x: 1120, y: 560, scale: 0.9, parallax: 0.45, props: { seed: 9 } },
      {
        kind: 'path', d: 'M 1190 590 q 30 -46 78 -30 q 44 14 30 52 q -12 30 -56 24 q -48 -8 -52 -46 Z',
        fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.45,
        if: { not: { any: [{ hasItem: 'rope' }, { flag: 'ropeUsed' }] } },
      },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'dial',
        shape: { kind: 'rect', x: 680, y: 260, w: 280, h: 300 },
        label: 'Four stone dials',
        hideWhen: { solved: 'pz_gatehouse' },
        action: { type: 'puzzle', puzzle: 'pz_gatehouse' },
      },
      {
        id: 'take_rope',
        shape: { kind: 'rect', x: 1150, y: 540, w: 220, h: 140 },
        label: "A coil of rope in the keeper's stores",
        hideWhen: { any: [{ hasItem: 'rope' }, { flag: 'ropeUsed' }] },
        action: { type: 'pickup', item: 'rope' },
      },
      {
        id: 'stores',
        shape: { kind: 'rect', x: 1080, y: 660, w: 300, h: 120 },
        label: 'The old stores',
        action: {
          type: 'inspect',
          text: 'Barrels gone to dust, tools gone to rust. The Gatehouse keeper provisioned for a long watch.',
        },
      },
      south.hotspot,
      north.hotspot,
    ],
  };
}

export function hallScene(): SceneDef {
  const south = exitArch(120, 'p_gatehouse_hall', 'Back toward the Gatehouse', { scale: 0.8 });
  const west = exitArch(480, 'p_hall_cistern', 'The west passage — a smell of water', {
    scale: 0.85,
    if: { not: { solved: 'pz_chimes' } },
  });
  const east = exitArch(1050, 'p_hall_gearworks', 'The east passage — a smell of bronze', { scale: 0.85 });
  const ne = exitArch(480, 'p_hall_scriptorium', 'A newly aligned doorway', {
    scale: 0.85,
    lit: true,
    if: { solved: 'pz_chimes' },
  });
  return {
    palette: 'cavern',
    layers: [
      ...chamberShell(31),
      { kind: 'primitive', primitive: 'pillar', x: 330, y: 40, scale: 1.05, parallax: 0.25 },
      { kind: 'primitive', primitive: 'pillar', x: 1180, y: 40, scale: 1.05, parallax: 0.25 },
      south.layer,
      west.layer,
      ne.layer,
      east.layer,
      // serpent corridor mouth, north
      { kind: 'path', d: 'M 730 560 q 70 -190 140 0 Z', fill: '#050302', opacity: 0.9, parallax: 0.12 },
      { kind: 'path', d: 'M 726 380 q 74 -70 148 0 q -20 -34 -74 -34 q -54 0 -74 34 Z', fill: 'var(--p-accent)', opacity: 0.5, parallax: 0.12 },
      // chime-stones hanging center
      ...[0, 1, 2, 3, 4].map((i) => ({
        kind: 'path' as const,
        d: `M ${660 + i * 70} 60 L ${660 + i * 70} ${170 + (i % 3) * 26} L ${648 + i * 70} ${226 + (i % 3) * 26} L ${672 + i * 70} ${226 + (i % 3) * 26} L ${660 + i * 70} ${170 + (i % 3) * 26} Z`,
        fill: 'var(--p-accent)',
        opacity: 0.85,
        parallax: 0.3,
      })),
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'chimes',
        shape: { kind: 'rect', x: 620, y: 60, w: 360, h: 210 },
        label: 'The chime-stones',
        hideWhen: { solved: 'pz_chimes' },
        action: { type: 'puzzle', puzzle: 'pz_chimes' },
      },
      {
        id: 'echo',
        shape: { kind: 'circle', cx: 800, cy: 700, r: 90 },
        label: 'The center of the hall',
        action: {
          type: 'inspect',
          text: 'You stand at the hub and clap once. The echo comes back seven times, each from a slightly different direction. The hall is listening.',
        },
      },
      {
        id: 'serpent_mouth',
        shape: { kind: 'polygon', points: [[730, 560], [800, 380], [870, 560]] },
        label: 'The serpent corridor',
        action: { type: 'navigate', passage: 'p_hall_gate' },
      },
      south.hotspot,
      west.hotspot,
      ne.hotspot,
      east.hotspot,
    ],
  };
}
