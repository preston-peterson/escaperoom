/** Northeast wing — the glyph rooms: Scriptorium, Crypt, Oracle Alcove. */
import type { SceneDef } from '../../../engine/types.ts';
import { chamberShell, exitArch, foregroundFrame, torchPair } from './common.ts';

export function scriptoriumScene(): SceneDef {
  const sw = exitArch(140, 'p_hall_scriptorium', 'Back to the Hall of Echoes', { scale: 0.8 });
  const ne = exitArch(1120, 'p_scriptorium_crypt', 'Down into the crypt', { scale: 0.8 });
  return {
    palette: 'crypt',
    layers: [
      ...chamberShell(91),
      sw.layer,
      ne.layer,
      // writing desks
      { kind: 'path', d: 'M 420 620 h 260 l 20 -70 h -260 Z M 470 620 v 120 M 630 620 v 120', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'path', d: 'M 800 640 h 260 l 20 -70 h -260 Z M 850 640 v 120 M 1010 640 v 120', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      // shelves of glyph tablets
      { kind: 'primitive', primitive: 'glyphPanel', x: 380, y: 160, scale: 0.85, parallax: 0.2, props: { rows: 4, cols: 6, seed: 51 } },
      { kind: 'primitive', primitive: 'glyphPanel', x: 800, y: 160, scale: 0.85, parallax: 0.2, props: { rows: 4, cols: 6, seed: 52 } },
      // Vell's table, spotlit
      { kind: 'primitive', primitive: 'glyphPanel', x: 620, y: 470, scale: 0.6, parallax: 0.35, props: { rows: 1, cols: 4, seed: 53, glow: true } },
      ...torchPair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'vell_table',
        shape: { kind: 'rect', x: 610, y: 460, w: 240, h: 180 },
        label: "Vell's working table",
        action: {
          type: 'inspect',
          text: "Vell's translation table, weighted open with a whetstone: ◐ is E · △ is M · ☰ is B · ✶ is R. You copy it carefully.",
          effects: [{ type: 'unlockJournal', entry: 'j_glyphkey' }],
        },
      },
      {
        id: 'builder_inscription',
        shape: { kind: 'rect', x: 370, y: 150, w: 850, h: 130 },
        label: 'An inscription above the shelves',
        action: {
          type: 'inspect',
          text: "Through Vell's table, the long inscription resolves: 'WE DID NOT BUILD A PRISON. WE BUILT A CRADLE, AND WOUND OURSELVES INTO ITS ROCKING.'",
          effects: [{ type: 'unlockJournal', entry: 'j_builders_1' }],
        },
      },
      sw.hotspot,
      ne.hotspot,
    ],
  };
}

export function cryptScene(): SceneDef {
  const sw = exitArch(140, 'p_scriptorium_crypt', 'Back to the Scriptorium', { scale: 0.8 });
  const oracle = exitArch(1240, 'p_crypt_oracle', 'The narrow way', {
    scale: 0.55,
    lit: true,
    if: { flag: 'crackOpened' },
  });
  return {
    palette: 'crypt',
    layers: [
      ...chamberShell(97),
      sw.layer,
      // wall niches with the Builders
      ...[380, 560, 740, 920].map((x, i) => ({
        kind: 'path' as const,
        d: `M ${x} 480 L ${x} 220 Q ${x + 55} 160 ${x + 110} 220 L ${x + 110} 480 Z`,
        fill: '#0a0f0b',
        parallax: 0.15,
        opacity: 1 - i * 0.02,
      })),
      ...[380, 560, 740, 920].map((x) => ({
        kind: 'path' as const,
        d: `M ${x + 33} 470 L ${x + 33} 300 Q ${x + 55} 270 ${x + 77} 300 L ${x + 77} 470 Z`,
        fill: 'var(--p-wall-mid)',
        parallax: 0.15,
        opacity: 0.65,
      })),
      // the sealed niche
      { kind: 'primitive', primitive: 'glyphPanel', x: 1120, y: 280, scale: 0.72, parallax: 0.2, props: { rows: 1, cols: 5, seed: 61, glow: false }, if: { not: { solved: 'pz_crypt' } } },
      { kind: 'path', d: 'M 1130 290 h 240 v 170 h -240 Z', fill: '#060806', parallax: 0.2, if: { solved: 'pz_crypt' } },
      // the crack, after the hall turned
      {
        kind: 'path', d: 'M 1290 190 l 22 100 l -18 66 l 24 90 l -10 66 l 8 48 l -40 6 l 4 -376 Z',
        fill: '#0b0d0b', opacity: 0.9, parallax: 0.15,
        if: { not: { flag: 'crackOpened' } },
      },
      oracle.layer,
      { kind: 'primitive', primitive: 'fog', x: 200, y: 560, parallax: 0.5, props: { w: 1200, h: 180, opacity: 0.2, speed: 34 } },
      ...torchPair(false),
      { kind: 'primitive', primitive: 'brazier', x: 200, y: 420, scale: 0.9, parallax: 0.35, props: { lit: true, seed: 12 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'niches',
        shape: { kind: 'rect', x: 370, y: 160, w: 670, h: 330 },
        label: 'The Builders in their niches',
        action: {
          type: 'inspect',
          text: 'Four figures of fitted stone stand in the wall — not statues. Each holds a different tool. Each faces the center of the labyrinth.',
        },
      },
      {
        id: 'sealed_niche',
        shape: { kind: 'rect', x: 1110, y: 270, w: 280, h: 210 },
        label: 'A sealed niche, glyphs across its face',
        hideWhen: { solved: 'pz_crypt' },
        action: { type: 'puzzle', puzzle: 'pz_crypt' },
      },
      {
        id: 'crack',
        shape: { kind: 'rect', x: 1270, y: 180, w: 90, h: 420 },
        label: 'A crack that was not there before',
        hideWhen: { flag: 'crackOpened' },
        action: {
          type: 'inspect',
          text: 'When the hall turned, something here shifted out of true. Behind the crack: hollow space. You work your fingers in and pull.',
          effects: [
            { type: 'setFlag', flag: 'crackOpened' },
            { type: 'triggerShift', shift: 's_oracle' },
          ],
        },
      },
      sw.hotspot,
      oracle.hotspot,
    ],
  };
}

export function oracleScene(): SceneDef {
  const back = exitArch(140, 'p_crypt_oracle', 'Back through the narrow way', { scale: 0.8 });
  return {
    palette: 'crypt',
    layers: [
      ...chamberShell(101),
      back.layer,
      // a slot window looking toward the heart
      { kind: 'path', d: 'M 700 180 h 220 v 60 h -220 Z', fill: '#1c0a06', parallax: 0.1 },
      { kind: 'path', d: 'M 700 180 h 220 v 60 h -220 Z', fill: 'var(--p-glow)', opacity: 0.25, parallax: 0.1 },
      // the watcher's desk
      { kind: 'path', d: 'M 640 620 h 320 l 24 -80 h -320 Z M 700 620 v 140 M 900 620 v 140', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'primitive', primitive: 'glyphPanel', x: 660, y: 480, scale: 0.5, parallax: 0.4, props: { rows: 2, cols: 3, seed: 71, glow: true } },
      { kind: 'primitive', primitive: 'brazier', x: 1100, y: 430, scale: 0.85, parallax: 0.35, props: { lit: true, seed: 19 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'window',
        shape: { kind: 'rect', x: 690, y: 170, w: 240, h: 90 },
        label: 'A watching-slot in the stone',
        action: {
          type: 'inspect',
          text: 'The slot looks clean through a hundred feet of rock — a surveyed line, impossibly true — to a faint red glow at the center of everything. The Ember. Someone sat here and watched it for a lifetime.',
        },
      },
      {
        id: 'desk',
        shape: { kind: 'rect', x: 630, y: 540, w: 360, h: 220 },
        label: "The watcher's desk",
        action: {
          type: 'inspect',
          text: "Instruments for measuring heat and time, worn smooth. This is where the keepers kept their vigil — and where Vell's own handwriting fills the last ledger.",
        },
      },
      back.hotspot,
    ],
  };
}
