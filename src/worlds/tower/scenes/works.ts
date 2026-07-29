/** The fourth floor: Governor Room and the Clockwright's Workshop. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  girderFrame,
  lampPair,
  stoppedClock,
  towerShell,
} from './common.ts';

export function governorScene(): SceneDef {
  const down = exitArch(120, 'p_escapement_governor', 'The stair down to the gallery', { scale: 0.8 });
  const east = exitArch(1100, 'p_governor_workshop', "The Clockwright's Workshop", { scale: 0.85, lit: true });
  const upstair = exitArch(600, 'p_governor_astrolabe', 'The deck stair and its collar', {
    scale: 0.85,
    lit: true,
  });
  const hatch = exitArch(1460, 'p_chimeloft_governor', 'A low hatch down to the Chime Loft', { scale: 0.45 });
  return {
    palette: 'gearworks',
    layers: [
      ...towerShell(43),
      down.layer,
      upstair.layer,
      // the stair collar, locked until the governor is set
      { kind: 'primitive', primitive: 'door', x: 650, y: 180, scale: 1.0, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_governor' } } },
      east.layer,
      hatch.layer,
      // the governor: spindle, arms, flyballs
      { kind: 'path', d: 'M 790 120 h 20 v 440 h -20 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.25 },
      { kind: 'path', d: 'M 800 210 L 655 380 L 672 394 L 810 236 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.25 },
      { kind: 'path', d: 'M 800 210 L 945 380 L 928 394 L 790 236 Z', fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.25 },
      // one flyball present, one cage empty until the weight is seated
      { kind: 'path', d: 'M 664 420 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 Z', fill: 'var(--p-accent)', parallax: 0.25 },
      {
        kind: 'path', d: 'M 936 420 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 Z',
        fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.25,
        if: { not: { flag: 'governorSet' } },
      },
      {
        kind: 'path', d: 'M 936 420 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 Z',
        fill: 'var(--p-accent)', parallax: 0.25,
        if: { flag: 'governorSet' },
      },
      // drive gear at the spindle foot
      { kind: 'primitive', primitive: 'gear', x: 730, y: 490, parallax: 0.25, props: { r: 70, teeth: 10, spin: false }, if: { not: { flag: 'governorSet' } } },
      { kind: 'primitive', primitive: 'gear', x: 730, y: 490, parallax: 0.25, props: { r: 70, teeth: 10, spin: true, dur: 12 }, if: { flag: 'governorSet' } },
      stoppedClock(300, 160, { r: 55, parallax: 0.2 }),
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'spindle',
        shape: { kind: 'rect', x: 760, y: 300, w: 90, h: 270 },
        label: 'The governor spindle, green with verdigris',
        hideWhen: { flag: 'spindleOiled' },
        action: {
          type: 'useItem',
          accepts: ['oil_flask'],
          effects: [
            { type: 'removeItem', item: 'oil_flask' },
            { type: 'setFlag', flag: 'spindleOiled' },
            {
              type: 'narrate',
              text: 'The oil creeps into the seized bearing the way patience creeps into an argument. When you lean on the spindle, it gives — grudging, then smooth.',
            },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText: 'The spindle wants oil, not that.',
        },
      },
      {
        id: 'open_cage',
        shape: { kind: 'circle', cx: 936, cy: 420, r: 80 },
        label: 'The empty cage arm',
        hideWhen: { flag: 'governorSet' },
        action: { type: 'puzzle', puzzle: 'pz_governor' },
      },
      {
        id: 'governor_watch',
        shape: { kind: 'rect', x: 610, y: 150, w: 180, h: 130 },
        label: 'The governor head',
        action: {
          type: 'inspect',
          text: 'A governor is the tower deciding, dozens of times a breath, not to hurry. Etched on the head, in the workshop hand: A TOWER THAT HURRIES IS A TOWER THAT DIES.',
        },
      },
      down.hotspot,
      upstair.hotspot,
      east.hotspot,
      hatch.hotspot,
    ],
  };
}

export function workshopScene(): SceneDef {
  const west = exitArch(120, 'p_governor_workshop', 'Back to the Governor Room', { scale: 0.8 });
  return {
    palette: 'brass',
    layers: [
      ...towerShell(47),
      west.layer,
      // the long bench with its lamp-worn top
      { kind: 'path', d: 'M 480 620 h 620 l 24 -80 h -620 Z M 540 620 v 150 M 1040 620 v 150', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      // the wall of mended clocks, every one stopped at six to midnight
      stoppedClock(430, 120, { r: 55, parallax: 0.18 }),
      stoppedClock(570, 170, { r: 40, parallax: 0.18 }),
      stoppedClock(680, 110, { r: 48, parallax: 0.18 }),
      stoppedClock(800, 180, { r: 36, parallax: 0.18 }),
      stoppedClock(890, 100, { r: 52, parallax: 0.18 }),
      stoppedClock(1020, 160, { r: 42, parallax: 0.18 }),
      // the bench slate with the shorthand key
      { kind: 'primitive', primitive: 'glyphPanel', x: 520, y: 460, scale: 0.6, parallax: 0.35, props: { rows: 2, cols: 6, seed: 53, glow: true } },
      // the drawing board with the deck schematic
      { kind: 'primitive', primitive: 'glyphPanel', x: 1180, y: 260, scale: 0.8, parallax: 0.25, props: { rows: 3, cols: 2, seed: 54 } },
      // the word-locked cabinet
      { kind: 'primitive', primitive: 'door', x: 250, y: 300, scale: 0.55, parallax: 0.25, props: { open: false }, if: { not: { solved: 'pz_workshop' } } },
      { kind: 'primitive', primitive: 'door', x: 250, y: 300, scale: 0.55, parallax: 0.25, props: { open: true }, if: { solved: 'pz_workshop' } },
      {
        kind: 'primitive', primitive: 'glint', x: 340, y: 420, scale: 1.1, parallax: 0.25,
        if: { all: [{ solved: 'pz_workshop' }, { not: { any: [{ hasItem: 'mainspring_key' }, { flag: 'mainspringWound' }] } }] },
      },
      ...lampPair(),
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'cabinet',
        shape: { kind: 'rect', x: 240, y: 290, w: 220, h: 300 },
        label: 'A cabinet sealed with a word-plate',
        hideWhen: { solved: 'pz_workshop' },
        action: { type: 'puzzle', puzzle: 'pz_workshop' },
      },
      {
        id: 'shorthand_slate',
        shape: { kind: 'rect', x: 510, y: 450, w: 300, h: 170 },
        label: 'The bench slate',
        action: {
          type: 'inspect',
          text: "The Horologist's shorthand, chalked in a hand that never hurried: A at Ⅰ, B at Ⅱ, and so on to L at Ⅻ. 'Twelve letters suffice for any word worth locking.' You copy the key.",
          effects: [{ type: 'unlockJournal', entry: 'j_shorthand' }],
        },
      },
      {
        id: 'drawing_board',
        shape: { kind: 'rect', x: 1170, y: 250, w: 300, h: 260 },
        label: 'The drawing board',
        action: {
          type: 'inspect',
          text: "A schematic of the Astrolabe Deck, drawn before the deck was ever raised: the MOON keeps the crown; the WANDERER sleeps at the bottom of the wheel; the SUN stands at the third hour. You copy the lines exactly.",
          effects: [{ type: 'unlockJournal', entry: 'j_schematic' }],
        },
      },
      {
        id: 'clock_wall',
        shape: { kind: 'rect', x: 400, y: 60, w: 700, h: 190 },
        label: 'The wall of mended clocks',
        action: {
          type: 'inspect',
          text: 'Dozens of dials, every shape a century produces, every one ticking here once — and every one stopped at six minutes to midnight. Clocks do not agree by accident. Someone went along this wall, at the end, and stopped each one kindly, like closing eyes.',
        },
      },
      west.hotspot,
    ],
  };
}
