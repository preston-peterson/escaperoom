/** The middle of the dream: Upside Garden, Mirror Parlor, and the Nightmare Seam. */
import type { SceneDef, SceneLayer } from '../../../engine/types.ts';
import { dreamFrame, dreamGround, loneDoor, sketchBox, sketchLine, skySea } from './common.ts';

export function gardenScene(): SceneDef {
  const back = loneDoor(70, 'p_stair_garden', 'Back to the stair', {
    scale: 0.8,
    groundY: 650,
  });
  const parlor = loneDoor(1230, 'p_garden_parlor', 'A prim little door among the roots', {
    scale: 0.85,
    groundY: 660,
  });
  // thin rain, climbing
  const risingRain: SceneLayer[] = [260, 420, 590, 760, 930, 1100, 1360].map((x, i) =>
    sketchLine(x, 620 - (i % 3) * 40, x + 8, 460 - (i % 3) * 50, 3, {
      opacity: 0.16,
      parallax: 0.35,
      fill: 'var(--p-water)',
    }),
  );
  return {
    palette: 'dreamrose',
    layers: [
      ...skySea(230),
      // trees hanging from the ceiling of the world
      { kind: 'primitive', primitive: 'tree', x: 500, y: 410, rotate: 180, parallax: 0.15, props: { seed: 3 } },
      { kind: 'primitive', primitive: 'tree', x: 1120, y: 440, rotate: 180, scale: 1.1, parallax: 0.12, props: { seed: 8 } },
      { kind: 'primitive', primitive: 'tree', x: 830, y: 380, rotate: 180, scale: 0.85, parallax: 0.18, props: { seed: 5, bare: true } },
      ...risingRain,
      ...dreamGround(7, { y: 650, fog: 0.14 }),
      ...back.layers,
      ...parlor.layers,
      // the well that rains
      { kind: 'path', d: 'M 640 740 a 160 46 0 1 0 320 0 a 160 46 0 1 0 -320 0 Z', fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.45 },
      { kind: 'path', d: 'M 668 740 a 132 34 0 1 0 264 0 a 132 34 0 1 0 -264 0 Z', fill: '#120c1e', parallax: 0.45 },
      { kind: 'path', d: 'M 640 740 l 0 -26 a 160 46 0 0 1 320 0 l 0 26 a 160 46 0 0 0 -320 0 Z', fill: 'var(--p-wall-mid)', parallax: 0.45 },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'trees',
        shape: { kind: 'rect', x: 240, y: 30, w: 900, h: 380 },
        label: 'The hanging orchard',
        action: {
          type: 'inspect',
          text: 'Trees hang from the ceiling of the world, roots sunward, leaves combing the fog. A pear drops from one and falls up, unhurried, toward the sea. You make a note about the rain here; the dream dictates it to you rather firmly.',
          effects: [{ type: 'unlockJournal', entry: 'j_logic_garden' }],
        },
      },
      {
        id: 'well',
        shape: { kind: 'rect', x: 620, y: 640, w: 360, h: 170 },
        label: 'A well, clearing its throat',
        hideWhen: { solved: 'pz_rain' },
        action: { type: 'puzzle', puzzle: 'pz_rain' },
      },
      {
        id: 'well_after',
        shape: { kind: 'rect', x: 620, y: 640, w: 360, h: 170 },
        label: 'The well',
        if: { solved: 'pz_rain' },
        action: {
          type: 'inspect',
          text: 'The well has nothing left to say. It is raining quietly upward into itself, which for a well is a kind of contentment.',
        },
      },
      back.hotspot,
      parlor.hotspot,
    ],
  };
}

export function parlorScene(): SceneDef {
  const garden = loneDoor(60, 'p_garden_parlor', 'Back out to the garden', {
    scale: 0.78,
    groundY: 630,
  });
  // wallpaper: a pattern of small diamonds, keeping step — except once
  const wallpaper: SceneLayer[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 360 + col * 82 + (row % 2) * 41;
      const y = 120 + row * 96;
      const off = x > 1290 && row === 1 ? 16 : 0; // the mismatch
      wallpaper.push({
        kind: 'path',
        d: `M ${x + off} ${y} l 16 22 l -16 22 l -16 -22 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.14,
        parallax: 0.06,
      });
    }
  }
  return {
    palette: 'dreamrose',
    layers: [
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 520, seed: 53 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      ...wallpaper,
      ...garden.layers,
      // the vanity mirror
      sketchBox(430, 130, 470, 430, { t: 12, fill: 'var(--p-accent)', opacity: 0.85, parallax: 0.1 }),
      { kind: 'path', d: 'M 446 146 h 438 v 398 h -438 Z', fill: 'var(--p-sky-bottom)', opacity: 0.95, parallax: 0.1 },
      { kind: 'primitive', primitive: 'glint', x: 500, y: 190, scale: 1.1, parallax: 0.1 },
      // letters fogged onto the glass, from the far side
      { kind: 'primitive', primitive: 'glyphPanel', x: 480, y: 300, scale: 0.72, parallax: 0.1, props: { rows: 1, cols: 9, seed: 27, glow: true }, if: { not: { solved: 'pz_mirror' } } },
      // vanity table
      { kind: 'path', d: 'M 480 640 h 380 l 22 -70 h -380 Z M 540 640 v 130 M 800 640 v 130', fill: 'var(--p-wall-mid)', parallax: 0.35 },
      // the bookcase that is a door
      { kind: 'path', d: 'M 1000 190 h 240 v 400 h -240 Z', fill: 'var(--p-wall-mid)', parallax: 0.12, if: { not: { solved: 'pz_mirror' } } },
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'path' as const,
        d: `M 1012 ${210 + i * 96} h 216 v 74 h -216 Z`,
        fill: 'var(--p-wall-dark)',
        opacity: 0.8,
        parallax: 0.12,
        if: { not: { solved: 'pz_mirror' as string } },
      })),
      { kind: 'path', d: 'M 1000 190 h 240 v 400 h -240 Z', fill: '#150b20', parallax: 0.12, if: { solved: 'pz_mirror' } },
      sketchBox(1000, 190, 240, 400, { t: 8, fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.12, if: { solved: 'pz_mirror' } }),
      // the seam, once found
      { kind: 'path', d: 'M 1300 120 h 76 v 460 h -76 Z', fill: '#2a0d08', parallax: 0.1, if: { flag: 'seamFound' } },
      { kind: 'path', d: 'M 1310 130 h 56 v 440 h -56 Z', fill: '#5c2412', opacity: 0.5, parallax: 0.1, if: { flag: 'seamFound' } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'mirror',
        shape: { kind: 'rect', x: 440, y: 140, w: 450, h: 410 },
        label: 'The vanity mirror',
        hideWhen: { solved: 'pz_mirror' },
        action: { type: 'puzzle', puzzle: 'pz_mirror' },
      },
      {
        id: 'mirror_after',
        shape: { kind: 'rect', x: 440, y: 140, w: 450, h: 410 },
        label: 'The vanity mirror, clear now',
        if: { solved: 'pz_mirror' },
        action: {
          type: 'inspect',
          text: 'The fog has lifted. The mirror shows the parlor exactly, except that in the reflection the bookcase stands open. When you turn, the bookcase stands open. The mirror looks quietly pleased with itself.',
        },
      },
      {
        id: 'wallpaper_pattern',
        shape: { kind: 'rect', x: 360, y: 100, w: 560, h: 60 },
        label: 'The wallpaper pattern',
        action: {
          type: 'inspect',
          text: 'Moon, door, moon, door, the pattern goes, keeping perfect step around the room — although near the far corner you would swear it goes moon, door, moon, moth.',
        },
      },
      {
        id: 'seam',
        shape: { kind: 'rect', x: 1290, y: 120, w: 96, h: 460 },
        label: 'A place where the pattern misses its step',
        hideWhen: { flag: 'seamFound' },
        action: {
          type: 'inspect',
          text: 'Here it is: a moth where a moon should be, and the seam beneath it not quite true. You press the mismatch, and something on the other side of the wallpaper unfastens.',
          effects: [
            { type: 'setFlag', flag: 'seamFound' },
            { type: 'triggerShift', shift: 's_seam' },
            { type: 'sound', cue: 'secret' },
          ],
        },
      },
      {
        id: 'exit_p_parlor_seam',
        shape: { kind: 'rect', x: 1300, y: 120, w: 80, h: 460 },
        label: 'Behind the wallpaper',
        if: { flag: 'seamFound' },
        action: { type: 'navigate', passage: 'p_parlor_seam' },
      },
      {
        id: 'exit_p_parlor_library',
        shape: { kind: 'rect', x: 1000, y: 190, w: 240, h: 400 },
        label: 'The bookcase',
        action: { type: 'navigate', passage: 'p_parlor_library' },
      },
      garden.hotspot,
    ],
  };
}

export function seamScene(): SceneDef {
  const back = loneDoor(70, 'p_parlor_seam', 'Back through the wallpaper', {
    scale: 0.78,
    groundY: 640,
  });
  return {
    // Deliberate misuse: this is another world's palette. A furnace-red room
    // stitched into a violet dream — the seam is exactly this wrongness.
    palette: 'heart',
    layers: [
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 520, seed: 66 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 800 340 a 300 300 0 1 0 0.1 0 Z', fill: 'var(--p-glow)', opacity: 0.07, parallax: 0.05 },
      ...back.layers,
      { kind: 'primitive', primitive: 'brazier', x: 260, y: 400, scale: 1.0, parallax: 0.3, props: { lit: true, seed: 13 } },
      // the small kept table
      { kind: 'path', d: 'M 680 620 h 260 l 18 -64 h -260 Z M 730 620 v 120 M 900 620 v 120', fill: 'var(--p-wall-mid)', parallax: 0.35 },
      // the photograph, face-down
      { kind: 'path', d: 'M 760 560 l 96 -8 l 6 40 l -96 8 Z', fill: '#d8cfc0', opacity: 0.9, parallax: 0.35, if: { not: { hasItem: 'photograph' } } },
      // the folded fear, on a shelf of its own
      { kind: 'path', d: 'M 1120 380 h 190 v 16 h -190 Z', fill: 'var(--p-wall-light)', opacity: 0.6, parallax: 0.25 },
      {
        kind: 'path',
        d: 'M 1180 330 l 34 10 l -8 36 l -34 -10 Z',
        fill: '#0c0505',
        parallax: 0.25,
        if: { not: { any: [{ hasItem: 'idea_fear' }, { solved: 'pz_ideas' }] } },
      },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 600, parallax: 0.5, props: { w: 1400, h: 200, opacity: 0.2, speed: 20 } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'photo',
        shape: { kind: 'rect', x: 740, y: 530, w: 140, h: 80 },
        label: 'A photograph, face-down',
        hideWhen: { hasItem: 'photograph' },
        action: {
          type: 'inspect',
          text: "You turn it over: a woman asleep in a chair by a window, pencil still in her hand, drawings on her lap. On the back, in the Draughtsman's writing: 'me, before.' You take it, gently, the way you would take something hot.",
          effects: [
            { type: 'giveItem', item: 'photograph' },
            { type: 'markSecret', secret: 'photograph' },
            { type: 'unlockJournal', entry: 'j_photograph' },
            { type: 'sound', cue: 'secret' },
          ],
        },
      },
      {
        id: 'fear',
        shape: { kind: 'rect', x: 1150, y: 310, w: 110, h: 90 },
        label: 'A dark square, folded small',
        hideWhen: { any: [{ hasItem: 'idea_fear' }, { solved: 'pz_ideas' }] },
        action: {
          type: 'inspect',
          text: "The dream's one fear, folded and refolded until it could be kept on a shelf. You pick it up. It is surprisingly light. Most fears are, once you finally pick them up.",
          effects: [{ type: 'giveItem', item: 'idea_fear' }, { type: 'sound', cue: 'pickup' }],
        },
      },
      {
        id: 'warm_walls',
        shape: { kind: 'rect', x: 380, y: 120, w: 560, h: 320 },
        label: 'The furnace-colored walls',
        action: {
          type: 'inspect',
          text: 'The walls here are warm, and the wrong color entirely — borrowed from some other dream, one with a furnace where its heart should be. The wallpaper outside was pasted over this in a hurry.',
        },
      },
      back.hotspot,
    ],
  };
}
