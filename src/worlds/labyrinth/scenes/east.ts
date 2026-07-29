/** East wing — the machine rooms: Gearworks, Broken Bridge, Counterweight Vault. */
import type { SceneDef } from '../../../engine/types.ts';
import { chamberShell, exitArch, foregroundFrame, torchPair } from './common.ts';

export function gearworksScene(): SceneDef {
  const west = exitArch(140, 'p_hall_gearworks', 'Back to the Hall of Echoes', { scale: 0.8 });
  const east = exitArch(1120, 'p_gearworks_bridge', 'Toward the bridge', { scale: 0.8 });
  return {
    palette: 'gearworks',
    layers: [
      ...chamberShell(61),
      west.layer,
      east.layer,
      // wall of interlocked gears
      { kind: 'primitive', primitive: 'gear', x: 520, y: 90, parallax: 0.2, props: { r: 110, teeth: 14, spin: false }, if: { not: { flag: 'gearsAligned' } } },
      { kind: 'primitive', primitive: 'gear', x: 520, y: 90, parallax: 0.2, props: { r: 110, teeth: 14, spin: true, dur: 30 }, if: { flag: 'gearsAligned' } },
      { kind: 'primitive', primitive: 'gear', x: 740, y: 160, parallax: 0.2, props: { r: 78, teeth: 10, spin: false }, if: { not: { flag: 'gearsAligned' } } },
      { kind: 'primitive', primitive: 'gear', x: 740, y: 160, parallax: 0.2, props: { r: 78, teeth: 10, spin: true, dur: 21 }, if: { flag: 'gearsAligned' } },
      { kind: 'primitive', primitive: 'gear', x: 880 , y: 70, parallax: 0.2, props: { r: 95, teeth: 12, spin: false }, if: { not: { flag: 'gearsAligned' } } },
      { kind: 'primitive', primitive: 'gear', x: 880, y: 70, parallax: 0.2, props: { r: 95, teeth: 12, spin: true, dur: 26 }, if: { flag: 'gearsAligned' } },
      // the silent axle / seated gear
      {
        kind: 'path', d: 'M 690 372 a 24 24 0 1 0 0.1 0 Z', fill: 'var(--p-wall-dark)', parallax: 0.2,
        if: { not: { flag: 'gearSeated' } },
      },
      {
        kind: 'primitive', primitive: 'gear', x: 640, y: 320, parallax: 0.2,
        props: { r: 75, teeth: 10, spin: false },
        if: { all: [{ flag: 'gearSeated' }, { not: { flag: 'gearsAligned' } }] },
      },
      {
        kind: 'primitive', primitive: 'gear', x: 640, y: 320, parallax: 0.2,
        props: { r: 75, teeth: 10, spin: true, dur: 17 },
        if: { flag: 'gearsAligned' },
      },
      // the alignment dial housing
      { kind: 'primitive', primitive: 'glyphPanel', x: 1130, y: 250, scale: 0.8, parallax: 0.25, props: { rows: 3, cols: 3, seed: 8, glow: false }, if: { not: { flag: 'gearsAligned' } } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1130, y: 250, scale: 0.8, parallax: 0.25, props: { rows: 3, cols: 3, seed: 8, glow: true }, if: { flag: 'gearsAligned' } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'axle',
        shape: { kind: 'circle', cx: 715, cy: 396, r: 90 },
        label: 'A silent axle, its gear missing',
        hideWhen: { flag: 'gearSeated' },
        action: { type: 'puzzle', puzzle: 'pz_gearsocket' },
      },
      {
        id: 'align_dial',
        shape: { kind: 'rect', x: 1120, y: 240, w: 310, h: 240 },
        label: 'The alignment dial',
        hideWhen: { flag: 'gearsAligned' },
        action: { type: 'puzzle', puzzle: 'pz_gearalign' },
      },
      {
        id: 'geartrain',
        shape: { kind: 'rect', x: 420, y: 40, w: 640, h: 260 },
        label: 'The great gear-train',
        action: {
          type: 'inspect',
          text: 'Bronze wheels within wheels, rising into darkness. This is not decoration; the labyrinth runs on it.',
        },
      },
      west.hotspot,
      east.hotspot,
    ],
  };
}

export function bridgeScene(): SceneDef {
  const west = exitArch(140, 'p_gearworks_bridge', 'Back to the Gearworks', { scale: 0.8 });
  const east = exitArch(1160, 'p_bridge_vault', 'The far ledge', { scale: 0.75, if: { flag: 'ropeUsed' } });
  return {
    palette: 'cavern',
    layers: [
      ...chamberShell(71),
      west.layer,
      east.layer,
      // the chasm
      { kind: 'path', d: 'M 420 900 L 520 560 L 1080 560 L 1180 900 Z', fill: '#030201', parallax: 0.1 },
      { kind: 'path', d: 'M 420 900 L 520 560 L 560 560 L 500 900 Z', fill: 'var(--p-wall-dark)', parallax: 0.1 },
      { kind: 'path', d: 'M 1180 900 L 1080 560 L 1040 560 L 1100 900 Z', fill: 'var(--p-wall-dark)', parallax: 0.1 },
      // cut bridge stubs
      { kind: 'path', d: 'M 500 640 h 130 l -18 26 h -112 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      { kind: 'path', d: 'M 1100 640 h -130 l 18 26 h 112 Z', fill: 'var(--p-wall-mid)', parallax: 0.2 },
      // rope bridge once thrown
      {
        kind: 'path', d: 'M 560 652 q 240 90 480 0 l 0 10 q -240 92 -480 0 Z',
        fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.2,
        if: { flag: 'ropeUsed' },
      },
      { kind: 'primitive', primitive: 'fog', x: 420, y: 700, parallax: 0.4, props: { w: 800, h: 160, opacity: 0.2, speed: 18 } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'throw_rope',
        shape: { kind: 'polygon', points: [[520, 560], [1080, 560], [1180, 900], [420, 900]] },
        label: 'The severed span',
        hideWhen: { flag: 'ropeUsed' },
        action: {
          type: 'useItem',
          accepts: ['rope'],
          effects: [
            { type: 'removeItem', item: 'rope' },
            { type: 'setFlag', flag: 'ropeUsed' },
            { type: 'triggerShift', shift: 's_bridge' },
          ],
          wrongItemText: 'You will not cross a chasm with that.',
        },
      },
      {
        id: 'vell_bridge',
        shape: { kind: 'rect', x: 200, y: 620, w: 200, h: 120 },
        label: 'A cairn of flat stones',
        action: {
          type: 'inspect',
          text: 'A small cairn, deliberately built. Beneath the top stone, a page in a familiar hand.',
          effects: [{ type: 'unlockJournal', entry: 'j_vell_4' }],
        },
      },
      west.hotspot,
      east.hotspot,
    ],
  };
}

export function vaultScene(): SceneDef {
  const west = exitArch(140, 'p_bridge_vault', 'Back across the rope', { scale: 0.8 });
  return {
    palette: 'gearworks',
    layers: [
      ...chamberShell(83),
      west.layer,
      // the balance: beam and three pans
      { kind: 'path', d: 'M 500 180 H 1160 V 200 H 500 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.2 },
      { kind: 'path', d: 'M 820 60 H 844 V 190 H 820 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.2 },
      ...[560, 830, 1100].map((x) => ({
        kind: 'path' as const,
        d: `M ${x - 4} 200 V 330 M ${x - 90} 360 q 90 60 180 0 l -14 -30 h -152 Z`,
        fill: 'var(--p-wall-light)',
        opacity: 0.9,
        parallax: 0.2,
      })),
      // plaques
      { kind: 'primitive', primitive: 'glyphPanel', x: 300, y: 470, scale: 0.6, parallax: 0.3, props: { rows: 1, cols: 3, seed: 44 } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 700, y: 470, scale: 0.6, parallax: 0.3, props: { rows: 1, cols: 3, seed: 45 } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 1100, y: 470, scale: 0.6, parallax: 0.3, props: { rows: 1, cols: 3, seed: 46 } },
      // sigil drawer, revealed on solve
      { kind: 'primitive', primitive: 'pedestal', x: 1330, y: 420, scale: 0.9, parallax: 0.35, props: { occupied: false }, if: { solved: 'pz_vault' } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'balance',
        shape: { kind: 'rect', x: 470, y: 60, w: 720, h: 340 },
        label: 'The counterweight balance',
        hideWhen: { solved: 'pz_vault' },
        action: { type: 'puzzle', puzzle: 'pz_vault' },
      },
      {
        id: 'plaques',
        shape: { kind: 'rect', x: 290, y: 460, w: 1050, h: 130 },
        label: 'Three bronze plaques',
        action: {
          type: 'inspect',
          text: '"The SUN keeps the crown of the sky. The WAVE stands at the third hour. The FLAME sleeps at the bottom of the world." You copy all three lines.',
          effects: [{ type: 'unlockJournal', entry: 'j_plaques' }],
        },
      },
      west.hotspot,
    ],
  };
}
