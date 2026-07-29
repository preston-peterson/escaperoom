/** The far shore of the dream: the Tide of Clocks, the Half-Drawn Room, the Sleeper's Door. */
import type { SceneDef, SceneLayer } from '../../../engine/types.ts';
import { dreamFrame, dreamGround, loneDoor, sketchBox, sketchLine } from './common.ts';

export function tideScene(): SceneDef {
  return {
    palette: 'dreamrose',
    layers: [
      ...dreamGround(17, { y: 600, fog: 0.12 }),
      // the sea of clocks
      { kind: 'primitive', primitive: 'sea', x: 420, y: 560, parallax: 0.08, props: { w: 1180, h: 340 } },
      // the drowned clock, pointing forever at the hour it swallowed
      { kind: 'primitive', primitive: 'clockFace', x: 480, y: 420, parallax: 0.12, props: { r: 120, hourAngle: 120, minuteAngle: 120 } },
      // the backward clock, tilted, homesick
      { kind: 'primitive', primitive: 'clockFace', x: 820, y: 360, rotate: 8, parallax: 0.12, props: { r: 100, hourAngle: 330, minuteAngle: 210 } },
      // the faceless clock
      { kind: 'path', d: 'M 1310 520 a 110 110 0 1 0 0.1 0 Z', fill: 'var(--p-wall-dark)', parallax: 0.12 },
      { kind: 'path', d: 'M 1310 532 a 98 98 0 1 0 0.1 0 Z M 1310 544 a 86 86 0 1 1 -0.1 0 Z', fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.12 },
      // stray hours glinting in the surf
      { kind: 'primitive', primitive: 'glint', x: 700, y: 640, scale: 0.8, parallax: 0.3 },
      { kind: 'primitive', primitive: 'glint', x: 1060, y: 700, scale: 0.6, parallax: 0.3 },
      // the tide-lock on the sand
      { kind: 'primitive', primitive: 'pedestal', x: 190, y: 430, scale: 0.95, parallax: 0.3, props: { occupied: false } },
      ...[0, 1, 2].map((i) => ({
        kind: 'path' as const,
        d: `M ${218 + i * 46} 420 a 17 17 0 1 0 0.1 0 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.85,
        parallax: 0.3,
      })),
      // the Dozing Door, wide awake now, holding the way back
      { kind: 'primitive', primitive: 'door', x: 40, y: 220, scale: 0.85, parallax: 0.15, props: { open: true } },
      // the path of dry seconds, once the tide allows it
      {
        kind: 'path',
        d: 'M 560 900 Q 700 760 900 730 Q 1150 690 1360 740 L 1420 900 Z',
        fill: 'var(--p-wall-light)',
        opacity: 0.18,
        parallax: 0.25,
        if: { solved: 'pz_tide' },
      },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'clocks',
        shape: { kind: 'rect', x: 460, y: 340, w: 1000, h: 320 },
        label: 'Three clocks, drowned to their waists',
        action: {
          type: 'inspect',
          text: 'You wade close enough to read them. The drowned clock points forever at a four it no longer has. The backward clock runs widdershins, aching for eleven. The faceless clock remembers only seven, and strikes it whenever it likes. You write all three wrongs down.',
          effects: [{ type: 'unlockJournal', entry: 'j_clocks' }],
        },
      },
      {
        id: 'tidelock',
        shape: { kind: 'rect', x: 150, y: 390, w: 260, h: 330 },
        label: 'The tide-lock and its three dials',
        hideWhen: { solved: 'pz_tide' },
        action: { type: 'puzzle', puzzle: 'pz_tide' },
      },
      {
        id: 'surf',
        shape: { kind: 'rect', x: 480, y: 680, w: 1000, h: 180 },
        label: 'The surf of hours',
        action: {
          type: 'inspect',
          text: 'Hours wash against the sand and slide back out. Some are gold, some grey, one or two are clearly borrowed. None of them are now. You check twice.',
        },
      },
      {
        id: 'exit_p_hall_dozing_back',
        shape: { kind: 'rect', x: 40, y: 220, w: 230, h: 390 },
        label: 'The Dozing Door, wide awake',
        action: { type: 'navigate', passage: 'p_hall_dozing' },
      },
      {
        id: 'exit_p_tide_halfdrawn',
        shape: { kind: 'polygon', points: [[620, 880], [900, 740], [1340, 750], [1400, 880]] },
        label: 'The path of dry seconds',
        action: { type: 'navigate', passage: 'p_tide_halfdrawn' },
      },
    ],
  };
}

export function halfdrawnScene(): SceneDef {
  const back = loneDoor(50, 'p_tide_halfdrawn', 'Back along the dry seconds', {
    scale: 0.78,
    groundY: 640,
  });
  // the finished half gives out; pencil lines carry on without it
  const sketchWall: SceneLayer[] = [
    sketchLine(780, 100, 1560, 90, 5, { opacity: 0.6, parallax: 0.06 }),
    sketchLine(780, 560, 1560, 580, 5, { opacity: 0.6, parallax: 0.06 }),
    sketchLine(1560, 90, 1560, 580, 5, { opacity: 0.45, parallax: 0.06 }),
    sketchLine(820, 620, 1500, 680, 4, { opacity: 0.3, parallax: 0.1 }),
    sketchLine(840, 700, 1460, 780, 4, { opacity: 0.24, parallax: 0.1 }),
    sketchLine(860, 790, 1400, 870, 4, { opacity: 0.18, parallax: 0.1 }),
  ];
  const alcoves: SceneLayer[] = [
    [850, 200],
    [1020, 200],
    [850, 380],
    [1020, 380],
  ].map(([x, y]) => sketchBox(x, y, 140, 120, { t: 6, fill: 'var(--p-glow)', opacity: 0.55, parallax: 0.1, if: { flag: 'alcovesDrawn' } }));
  return {
    palette: 'dreamviolet',
    layers: [
      // the finished half
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 780, h: 520, seed: 83 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 800 580 L 860 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      ...back.layers,
      ...sketchWall,
      ...alcoves,
      // the pinned list
      { kind: 'path', d: 'M 560 290 l 92 -6 l 8 116 l -92 6 Z', fill: '#d8cfc0', opacity: 0.85, parallax: 0.12 },
      // the half-erased self-portrait, low on the sketched wall
      { kind: 'path', d: 'M 1250 470 a 46 58 0 1 0 0.1 0 Z M 1250 478 a 38 50 0 1 1 -0.1 0 Z', fill: 'var(--p-wall-light)', opacity: 0.22, parallax: 0.1 },
      // the sketched doorframe — and, later, the door that was never drawn
      sketchBox(1180, 210, 250, 430, { t: 7, fill: 'var(--p-wall-light)', opacity: 0.5, parallax: 0.08, if: { not: { solved: 'pz_ideas' } } }),
      { kind: 'primitive', primitive: 'door', x: 1190, y: 220, scale: 0.95, parallax: 0.08, props: { open: true }, if: { solved: 'pz_ideas' } },
      { kind: 'primitive', primitive: 'fog', x: 700, y: 620, parallax: 0.45, props: { w: 900, h: 220, opacity: 0.16, speed: 26 } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'list',
        shape: { kind: 'rect', x: 545, y: 275, w: 130, h: 140 },
        label: 'A list, pinned to the unfinished wall',
        action: {
          type: 'inspect',
          text: "A list in soft pencil: 'The last room wants: a name I remembered, the smell of rain, one kept hour, and the fear — yes, even the fear. A room without its shadow is only a diagram.' You take it down carefully and keep it.",
          effects: [{ type: 'unlockJournal', entry: 'j_ideas_list' }],
        },
      },
      {
        id: 'portrait',
        shape: { kind: 'circle', cx: 1250, cy: 530, r: 70 },
        label: 'A faint oval of pencil lines',
        hideWhen: { flag: 'portraitSeen' },
        action: {
          type: 'inspect',
          text: 'Low on the wall, half-erased: a self-portrait. The Draughtsman drew his own face and then rubbed most of it away, slowly, in careful strokes. What remains is mostly the eyes — tired, kind, and familiar in a way you cannot yet place.',
          effects: [
            { type: 'setFlag', flag: 'portraitSeen' },
            { type: 'markSecret', secret: 'portrait' },
            { type: 'unlockJournal', entry: 'j_portrait' },
          ],
        },
      },
      {
        id: 'unfinished_wall',
        shape: { kind: 'rect', x: 800, y: 150, w: 380, h: 400 },
        label: 'The unfinished wall',
        hideWhen: { flag: 'alcovesDrawn' },
        action: {
          type: 'useItem',
          accepts: ['stub_pencil'],
          effects: [
            { type: 'removeItem', item: 'stub_pencil' },
            { type: 'setFlag', flag: 'alcovesDrawn' },
            {
              type: 'narrate',
              text: 'You set the pencil to the wall and it knows the way — your hand is mostly a formality. Four small alcoves take shape, line by line, and the wall, grateful, makes them real. The pencil, its work done at last, wears itself out on the final stroke.',
            },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText:
            'The wall waits, unmoved. Everything in this dream was made by one pencil, and the wall is loyal to it.',
        },
      },
      {
        id: 'alcoves',
        shape: { kind: 'rect', x: 820, y: 170, w: 360, h: 360 },
        label: 'Four drawn alcoves',
        if: { flag: 'alcovesDrawn' },
        hideWhen: { solved: 'pz_ideas' },
        action: { type: 'puzzle', puzzle: 'pz_ideas' },
      },
      {
        id: 'past_the_lines',
        shape: { kind: 'rect', x: 1440, y: 200, w: 150, h: 400 },
        label: 'Past the last line',
        if: { not: { solved: 'pz_ideas' } },
        action: {
          type: 'inspect',
          text: 'You reach past the last pencil line. It is not cold out there, or dark, or anything with a name. It is simply not yet. You take your hand back and are glad of it.',
        },
      },
      {
        id: 'exit_p_halfdrawn_sleeper',
        shape: { kind: 'rect', x: 1180, y: 210, w: 250, h: 430 },
        label: 'The door you did not draw',
        if: { solved: 'pz_ideas' },
        action: { type: 'navigate', passage: 'p_halfdrawn_sleeper' },
      },
      back.hotspot,
    ],
  };
}

export function sleeperScene(): SceneDef {
  return {
    palette: 'dreamrose',
    layers: [
      { kind: 'path', d: 'M 0 0 h 1600 v 900 h -1600 Z', fill: 'var(--p-wall-dark)', opacity: 0.55, parallax: 0 },
      ...dreamGround(23, { y: 660, fog: 0.14 }),
      // the aura behind the pale door
      { kind: 'primitive', primitive: 'portal', x: 650, y: 150, parallax: 0.1, props: { r: 150, open: false }, if: { not: { solved: 'pz_wake' } } },
      { kind: 'primitive', primitive: 'portal', x: 650, y: 150, parallax: 0.1, props: { r: 150, open: true }, if: { solved: 'pz_wake' } },
      { kind: 'primitive', primitive: 'door', x: 690, y: 240, scale: 1.0, parallax: 0.12, props: { open: false } },
      // the pencilled note, very small, at eye height
      { kind: 'path', d: 'M 880 420 l 54 -4 l 4 34 l -54 4 Z', fill: '#d8cfc0', opacity: 0.8, parallax: 0.12 },
      // four chimes at the lintel
      ...[0, 1, 2, 3].map((i) => ({
        kind: 'path' as const,
        d: `M ${470 + i * 58} 120 L ${470 + i * 58} ${210 + (i % 2) * 22} L ${458 + i * 58} ${258 + (i % 2) * 22} L ${482 + i * 58} ${258 + (i % 2) * 22} L ${470 + i * 58} ${210 + (i % 2) * 22} Z`,
        fill: 'var(--p-accent)',
        opacity: 0.85,
        parallax: 0.2,
      })),
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'note',
        shape: { kind: 'rect', x: 865, y: 405, w: 90, h: 70 },
        label: 'A pencilled note on the door',
        action: {
          type: 'inspect',
          text: "In pencil, very small, at eye height: 'She fell asleep to hush, hush, high, low. She will wake to it turned around.' Beneath it, smaller still: 'thank you.'",
          effects: [{ type: 'unlockJournal', entry: 'j_backward' }],
        },
      },
      {
        id: 'chimes',
        shape: { kind: 'rect', x: 440, y: 100, w: 260, h: 200 },
        label: 'Four chimes at the lintel',
        hideWhen: { solved: 'pz_wake' },
        action: { type: 'puzzle', puzzle: 'pz_wake' },
      },
      {
        id: 'listen',
        shape: { kind: 'rect', x: 700, y: 260, w: 240, h: 400 },
        label: "The Sleeper's Door",
        action: {
          type: 'inspect',
          text: 'You put your ear to the pale wood. Breathing — slow, even, unhurried. A room with a window, and morning in the window, waiting like a guest too polite to knock.',
        },
      },
      {
        id: 'exit_p_halfdrawn_sleeper_back',
        shape: { kind: 'rect', x: 40, y: 300, w: 200, h: 400 },
        label: 'Back into the finished room',
        action: { type: 'navigate', passage: 'p_halfdrawn_sleeper' },
      },
    ],
  };
}
