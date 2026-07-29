/** The way in: the Threshold, the Hall of Doors, the Stair That Climbs Itself. */
import type { SceneDef } from '../../../engine/types.ts';
import { dreamFrame, dreamGround, loneDoor, sketchLine, skySea } from './common.ts';

export function thresholdScene(): SceneDef {
  const door = loneDoor(660, 'p_threshold_hall', 'The lone door', {
    scale: 1.1,
    groundY: 680,
    openIf: { flag: 'doorAnswered' },
  });
  return {
    palette: 'dreamviolet',
    layers: [
      ...skySea(190),
      { kind: 'primitive', primitive: 'floatingIsle', x: 1180, y: 260, parallax: 0.08, props: { w: 220, seed: 5 } },
      { kind: 'primitive', primitive: 'floatingIsle', x: 140, y: 320, parallax: 0.1, props: { w: 150, seed: 9 } },
      { kind: 'primitive', primitive: 'glint', x: 420, y: 260, scale: 0.9, parallax: 0.06 },
      { kind: 'primitive', primitive: 'glint', x: 1090, y: 210, scale: 0.7, parallax: 0.06 },
      ...dreamGround(3, { y: 640, fog: 0.2 }),
      // the doorframe's missing wall, sketched and abandoned
      sketchLine(520, 250, 380, 250, 4, { opacity: 0.3 }),
      sketchLine(380, 250, 380, 420, 4, { opacity: 0.2 }),
      sketchLine(960, 240, 1120, 240, 4, { opacity: 0.3 }),
      ...door.layers,
      // draw the eye to the knocker until the door has been answered
      {
        kind: 'primitive', primitive: 'glint', x: 875, y: 428, scale: 1.1, parallax: 0.15,
        if: { not: { flag: 'doorAnswered' } },
      },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'knock',
        shape: { kind: 'circle', cx: 895, cy: 448, r: 50 },
        label: 'A brass knocker, polished by worry',
        hideWhen: { flag: 'doorAnswered' },
        action: {
          type: 'inspect',
          text: 'You knock, twice. The door listens — doors here are mostly ears — and considers you for a long, hinged moment.',
          effects: [
            { type: 'setFlag', flag: 'doorAnswered' },
            { type: 'triggerShift', shift: 's_first_door' },
            { type: 'sound', cue: 'unlock' },
          ],
        },
      },
      {
        id: 'sky_sea',
        shape: { kind: 'rect', x: 0, y: 0, w: 1600, h: 190 },
        label: 'The sea overhead',
        action: {
          type: 'inspect',
          text: 'A sea hangs where the sky should thin — patient, silver, upside down. Now and then a wave breaks gently on nothing, and thinks no more about it.',
        },
      },
      {
        id: 'no_wall',
        shape: { kind: 'rect', x: 340, y: 230, w: 220, h: 210 },
        label: 'Where the wall was going to be',
        action: {
          type: 'inspect',
          text: 'Faint pencil lines trail off where a wall was begun and abandoned. Whoever drew this got as far as the door — the hopeful part — and stopped.',
        },
      },
      door.hotspot,
    ],
  };
}

export function hallScene(): SceneDef {
  const back = loneDoor(90, 'p_threshold_hall', 'Back to the threshold', {
    scale: 0.75,
    groundY: 620,
  });
  return {
    palette: 'dreamviolet',
    layers: [
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 520, seed: 41 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 340 900 L 660 580 L 940 580 L 1260 900 Z', fill: 'var(--p-wall-light)', opacity: 0.06, parallax: 0 },
      ...back.layers,
      // painted doors, receding: lovingly rendered, entirely flat
      { kind: 'path', d: 'M 300 250 h 150 v 310 h -150 Z', fill: 'var(--p-wall-mid)', opacity: 0.9, parallax: 0.08 },
      { kind: 'path', d: 'M 310 260 h 130 v 300 h -130 Z', fill: 'var(--p-accent)', opacity: 0.12, parallax: 0.08 },
      { kind: 'path', d: 'M 500 280 L 630 270 L 636 560 L 506 560 Z', fill: 'var(--p-wall-mid)', opacity: 0.85, parallax: 0.08 },
      { kind: 'path', d: 'M 890 265 h 140 v 295 h -140 Z', fill: 'var(--p-wall-mid)', opacity: 0.9, parallax: 0.08 },
      { kind: 'path', d: 'M 900 275 h 120 v 285 h -120 Z', fill: 'var(--p-accent)', opacity: 0.1, parallax: 0.08 },
      // a door four inches high, at the skirting
      { kind: 'path', d: 'M 1060 520 h 42 v 60 h -42 Z', fill: 'var(--p-wall-mid)', parallax: 0.1 },
      { kind: 'path', d: 'M 1094 552 a 4 4 0 1 0 0.1 0 Z', fill: 'var(--p-accent)', opacity: 0.8, parallax: 0.1 },
      // the one real door: three rings of tiny skies
      { kind: 'primitive', primitive: 'door', x: 630, y: 140, scale: 1.0, parallax: 0.12, props: { open: false }, if: { not: { solved: 'pz_doors' } } },
      { kind: 'primitive', primitive: 'door', x: 630, y: 140, scale: 1.0, parallax: 0.12, props: { open: true }, if: { solved: 'pz_doors' } },
      { kind: 'path', d: 'M 760 300 a 58 58 0 1 0 0.1 0 Z M 760 312 a 46 46 0 1 1 -0.1 0 Z', fill: 'var(--p-accent)', opacity: 0.6, parallax: 0.12, if: { not: { solved: 'pz_doors' } } },
      // the Dozing Door, breathing gently
      { kind: 'primitive', primitive: 'door', x: 1180, y: 180, scale: 0.92, parallax: 0.12, props: { open: false }, if: { not: { solved: 'pz_lullaby' } } },
      { kind: 'primitive', primitive: 'door', x: 1180, y: 180, scale: 0.92, parallax: 0.12, props: { open: true }, if: { solved: 'pz_lullaby' } },
      { kind: 'primitive', primitive: 'fog', x: 1150, y: 500, parallax: 0.2, props: { w: 340, h: 90, opacity: 0.16, speed: 18 }, if: { not: { solved: 'pz_lullaby' } } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'painted_doors',
        shape: { kind: 'rect', x: 290, y: 240, w: 360, h: 330 },
        label: 'The painted doors',
        action: {
          type: 'inspect',
          text: "You try a painted door, out of politeness. It is paint. Beneath the one door with actual hinges, someone has pencilled: 'Moons up, suns down. In dreams it is always so.'",
          effects: [{ type: 'unlockJournal', entry: 'j_moons' }],
        },
      },
      {
        id: 'moon_door',
        shape: { kind: 'rect', x: 640, y: 200, w: 250, h: 320 },
        label: 'The door with three skies',
        hideWhen: { solved: 'pz_doors' },
        action: { type: 'puzzle', puzzle: 'pz_doors' },
      },
      {
        id: 'exit_p_hall_stair',
        shape: { kind: 'rect', x: 640, y: 150, w: 250, h: 420 },
        label: 'Through the real door',
        if: { solved: 'pz_doors' },
        action: { type: 'navigate', passage: 'p_hall_stair' },
      },
      {
        id: 'dozing_keyhole',
        shape: { kind: 'circle', cx: 1370, cy: 400, r: 40 },
        label: 'The keyhole of the Dozing Door',
        if: { not: { solved: 'pz_lullaby' } },
        action: {
          type: 'inspect',
          text: 'Through the keyhole: slow water, and something breathing in waltz time. The door is asleep. It seems rude to force it.',
        },
      },
      {
        id: 'exit_p_hall_dozing',
        shape: { kind: 'rect', x: 1180, y: 180, w: 240, h: 410 },
        label: 'The Dozing Door',
        action: { type: 'navigate', passage: 'p_hall_dozing' },
      },
      {
        id: 'tiny_door',
        shape: { kind: 'rect', x: 1050, y: 510, w: 70, h: 80 },
        label: 'A very small door',
        action: {
          type: 'inspect',
          text: 'A door four inches high, painted at the skirting with enormous care. You will not fit. Someone did, once, and the dream has kept the door out of respect.',
        },
      },
      back.hotspot,
    ],
  };
}

export function stairScene(): SceneDef {
  return {
    palette: 'dreamviolet',
    layers: [
      { kind: 'primitive', primitive: 'floatingIsle', x: 60, y: 140, parallax: 0.07, props: { w: 190, seed: 12 } },
      { kind: 'primitive', primitive: 'floatingIsle', x: 1320, y: 520, parallax: 0.1, props: { w: 160, seed: 4 } },
      // the knot of stairs, drawn with total confidence
      { kind: 'primitive', primitive: 'stairs', x: 160, y: 460, parallax: 0.2, props: { w: 540, h: 320, steps: 8, dir: 'up' } },
      { kind: 'primitive', primitive: 'stairs', x: 1280, y: 350, rotate: 180, parallax: 0.16, props: { w: 500, h: 300, steps: 8, dir: 'up' } },
      { kind: 'primitive', primitive: 'stairs', x: 700, y: 620, parallax: 0.28, props: { w: 420, h: 240, steps: 7, dir: 'down' } },
      sketchLine(700, 150, 700, 320, 5, { opacity: 0.35, parallax: 0.16 }),
      sketchLine(780, 50, 1280, 50, 5, { opacity: 0.3, parallax: 0.16 }),
      // the banister, carrying its rhyme
      { kind: 'path', d: 'M 170 470 Q 430 300 700 340 L 700 360 Q 440 322 180 488 Z', fill: 'var(--p-accent)', opacity: 0.55, parallax: 0.22 },
      // four brass treads set into the landing
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'path' as const,
        d: `M ${560 + i * 130} 720 h 90 v 64 h -90 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.75,
        parallax: 0.4,
      })),
      { kind: 'primitive', primitive: 'fog', x: 100, y: 640, parallax: 0.5, props: { w: 1400, h: 220, opacity: 0.2, speed: 24 } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'banister',
        shape: { kind: 'polygon', points: [[170, 470], [700, 330], [700, 370], [180, 500]] },
        label: 'Carvings along the banister',
        action: {
          type: 'inspect',
          text: "The banister carries a rhyme upward, one shallow word at a time: 'To climb the stair that climbs itself, first walk down twice as far, then once more up, and end by going nowhere — there you are.' You copy it down.",
          effects: [{ type: 'unlockJournal', entry: 'j_stair_rhyme' }],
        },
      },
      {
        id: 'treads',
        shape: { kind: 'rect', x: 540, y: 700, w: 500, h: 110 },
        label: 'Four brass treads in the landing',
        hideWhen: { solved: 'pz_stair' },
        action: { type: 'puzzle', puzzle: 'pz_stair' },
      },
      {
        id: 'exit_p_stair_loop',
        shape: { kind: 'polygon', points: [[1280, 350], [780, 350], [780, 60], [1280, 60]] },
        label: 'Climb (the stair insists this is up)',
        if: { not: { solved: 'pz_stair' } },
        action: { type: 'navigate', passage: 'p_stair_loop' },
      },
      {
        id: 'exit_p_stair_garden',
        shape: { kind: 'polygon', points: [[1280, 350], [780, 350], [780, 60], [1280, 60]] },
        label: 'The way the stair goes now — up, sideways, into a garden',
        if: { solved: 'pz_stair' },
        action: { type: 'navigate', passage: 'p_stair_garden' },
      },
      {
        id: 'exit_p_hall_stair_back',
        shape: { kind: 'rect', x: 160, y: 460, w: 400, h: 320 },
        label: 'Back down to the Hall of Doors',
        action: { type: 'navigate', passage: 'p_hall_stair' },
      },
      {
        id: 'the_drop',
        shape: { kind: 'rect', x: 1130, y: 650, w: 260, h: 200 },
        label: 'The edge of the stair',
        action: {
          type: 'inspect',
          text: 'You look over the edge. Below the stair: sky. Below the sky: more stair. You decide, on reflection, not to reflect further.',
        },
      },
    ],
  };
}
