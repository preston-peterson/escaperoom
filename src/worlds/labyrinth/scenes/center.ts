/** The center: the Serpent Gate and the Heart. */
import type { SceneDef } from '../../../engine/types.ts';
import { chamberShell, exitArch, foregroundFrame, torchPair } from './common.ts';

export function gateScene(): SceneDef {
  const south = exitArch(140, 'p_hall_gate', 'Back to the Hall of Echoes', {
    scale: 0.8,
    if: { not: { solved: 'pz_serpent_rings' } },
  });
  const north = exitArch(640, 'p_gate_heart', "Through the serpent's jaw", {
    scale: 0.9,
    lit: true,
    if: { solved: 'pz_serpent_rings' },
  });
  return {
    palette: 'heart',
    layers: [
      ...chamberShell(113),
      south.layer,
      // the serpent relief filling the north wall
      {
        kind: 'path',
        d: 'M 400 560 Q 380 300 560 220 Q 800 120 1040 220 Q 1220 300 1200 560 L 1080 560 Q 1100 340 960 280 Q 800 216 640 280 Q 500 340 520 560 Z',
        fill: 'var(--p-wall-mid)', parallax: 0.12,
      },
      {
        kind: 'path',
        d: 'M 620 560 Q 640 400 800 380 Q 960 400 980 560 Z',
        fill: '#12060a', parallax: 0.12,
        if: { not: { solved: 'pz_serpent_rings' } },
      },
      north.layer,
      // serpent eyes
      { kind: 'path', d: 'M 690 320 a 16 16 0 1 0 0.1 0 Z M 894 320 a 16 16 0 1 0 0.1 0 Z', fill: 'var(--p-glow)', opacity: 0.35, parallax: 0.12, if: { not: { flag: 'sigilsPlaced' } } },
      { kind: 'path', d: 'M 690 320 a 16 16 0 1 0 0.1 0 Z M 894 320 a 16 16 0 1 0 0.1 0 Z', fill: 'var(--p-glow)', opacity: 1, parallax: 0.12, if: { flag: 'sigilsPlaced' } },
      // sigil sockets on the brow
      ...[700, 780, 860].map((x) => ({
        kind: 'path' as const,
        d: `M ${x} 250 a 22 22 0 1 0 0.1 0 Z`,
        fill: '#0c0505',
        parallax: 0.12,
      })),
      { kind: 'primitive', primitive: 'brazier', x: 300, y: 400, scale: 0.95, parallax: 0.35, props: { lit: true, seed: 23 } },
      { kind: 'primitive', primitive: 'brazier', x: 1120, y: 400, scale: 0.95, parallax: 0.35, props: { lit: true, seed: 29 } },
      ...torchPair(false),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'sigil_sockets',
        shape: { kind: 'rect', x: 660, y: 210, w: 280, h: 110 },
        label: "Three sockets in the serpent's brow",
        hideWhen: { flag: 'sigilsPlaced' },
        action: { type: 'puzzle', puzzle: 'pz_serpent_sigils' },
      },
      {
        id: 'serpent_rings',
        shape: { kind: 'rect', x: 600, y: 360, w: 400, h: 200 },
        label: 'Rings of numbered notches around the jaw',
        hideWhen: { solved: 'pz_serpent_rings' },
        action: { type: 'puzzle', puzzle: 'pz_serpent_rings' },
      },
      {
        id: 'gate_inscription',
        shape: { kind: 'rect', x: 420, y: 470, w: 180, h: 90 },
        label: 'Words cut around the jaw',
        action: {
          type: 'inspect',
          text: "'LAST OF ALL, THE FIRE ITSELF. FEED IT AS WE FED IT: WATER, WHEEL, WORD — AND BREATH.' You copy the line with a steady hand you do not feel.",
          effects: [{ type: 'unlockJournal', entry: 'j_gate_inscription' }],
        },
      },
      south.hotspot,
      north.hotspot,
    ],
  };
}

export function heartScene(): SceneDef {
  return {
    palette: 'heart',
    layers: [
      ...chamberShell(127),
      // concentric rings of the cradle floor
      { kind: 'path', d: 'M 800 700 m -340 0 a 340 110 0 1 0 680 0 a 340 110 0 1 0 -680 0 Z', fill: 'var(--p-wall-dark)', opacity: 0.8, parallax: 0.3 },
      { kind: 'path', d: 'M 800 700 m -240 0 a 240 78 0 1 0 480 0 a 240 78 0 1 0 -480 0 Z', fill: 'var(--p-wall-mid)', opacity: 0.7, parallax: 0.3 },
      // the four stations
      { kind: 'primitive', primitive: 'pedestal', x: 360, y: 420, scale: 0.9, parallax: 0.35, props: { occupied: true } },
      { kind: 'primitive', primitive: 'gear', x: 560, y: 480, scale: 0.5, parallax: 0.35, props: { r: 60, teeth: 8, spin: true, dur: 9 } },
      { kind: 'primitive', primitive: 'pedestal', x: 1160, y: 420, scale: 0.9, parallax: 0.35, props: { occupied: true } },
      // the Ember in its cradle
      { kind: 'primitive', primitive: 'brazier', x: 690, y: 380, scale: 1.5, parallax: 0.25, props: { lit: true, seed: 31 } },
      {
        kind: 'path', d: 'M 800 470 a 90 90 0 1 0 0.1 0 Z', fill: 'var(--p-glow)', opacity: 0.14, parallax: 0.25,
        if: { solved: 'pz_heart' },
      },
      { kind: 'primitive', primitive: 'fog', x: 200, y: 600, parallax: 0.55, props: { w: 1200, h: 200, opacity: 0.17, speed: 22 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'ember',
        shape: { kind: 'rect', x: 640, y: 330, w: 340, h: 340 },
        label: 'The Ember of the First Fire',
        hideWhen: { solved: 'pz_heart' },
        action: { type: 'puzzle', puzzle: 'pz_heart' },
      },
      {
        id: 'cradle',
        shape: { kind: 'rect', x: 460, y: 650, w: 680, h: 160 },
        label: 'The cradle of black iron',
        action: {
          type: 'inspect',
          text: 'Every ring of the floor is engraved with the same word in the old script, thousands upon thousands of times. Through Vell’s table it reads: EMBER, EMBER, EMBER…',
        },
      },
    ],
  };
}
