/** The quiet middle-depths: the Library of Blank Books and the Moon Pool. */
import type { SceneDef, SceneLayer } from '../../../engine/types.ts';
import { dreamFrame, dreamGround, loneDoor, sketchBox } from './common.ts';

export function libraryScene(): SceneDef {
  const parlor = loneDoor(60, 'p_parlor_library', 'Back through the bookcase', {
    scale: 0.78,
    groundY: 630,
  });
  // shelves of blank spines
  const spines: SceneLayer[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      spines.push({
        kind: 'path',
        d: `M ${1020 + col * 42} ${170 + row * 130} h 30 v 100 h -30 Z`,
        fill: (row + col) % 3 === 0 ? 'var(--p-wall-light)' : 'var(--p-wall-mid)',
        opacity: 0.55 + ((row * col) % 4) * 0.08,
        parallax: 0.12,
      });
    }
  }
  const filledBooks: SceneLayer[] = (
    [
      { x: 1062, solved: 'pz_doors' },
      { x: 1146, solved: 'pz_stair' },
      { x: 1230, solved: 'pz_mirror' },
    ] as const
  ).map(({ x, solved }) => ({
    kind: 'path' as const,
    d: `M ${x} 170 h 30 v 100 h -30 Z`,
    fill: 'var(--p-glow)',
    opacity: 0.85,
    parallax: 0.12,
    if: { solved: solved as string },
  }));
  return {
    palette: 'dreamviolet',
    layers: [
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 520, seed: 71 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      ...parlor.layers,
      // a window with the wrong weather in it
      sketchBox(420, 130, 220, 280, { t: 10, fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.08 }),
      { kind: 'path', d: 'M 434 144 h 192 v 252 h -192 Z', fill: 'var(--p-sky-bottom)', opacity: 0.9, parallax: 0.08 },
      { kind: 'primitive', primitive: 'glint', x: 500, y: 200, scale: 0.8, parallax: 0.08 },
      ...spines,
      ...filledBooks,
      // the lectern with the catalogue
      { kind: 'path', d: 'M 720 560 h 200 l -24 -90 h -152 Z M 800 560 v 180 M 760 740 h 90', fill: 'var(--p-wall-mid)', parallax: 0.35 },
      { kind: 'path', d: 'M 712 468 l 216 0 l -16 -44 l -184 0 Z', fill: 'var(--p-wall-light)', opacity: 0.85, parallax: 0.35 },
      { kind: 'primitive', primitive: 'fog', x: 200, y: 640, parallax: 0.5, props: { w: 1200, h: 160, opacity: 0.12, speed: 30 } },
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'spines',
        shape: { kind: 'rect', x: 1010, y: 150, w: 400, h: 420 },
        label: 'Shelves of blank books',
        action: {
          type: 'inspect',
          text: 'Ranks of spines, all blank — except three on the high shelf, which glow faintly and have found their titles. In order of finishing: the PENCIL ✎, the HOURGLASS ⧗, the SONG ♪. You copy the marks down.',
          effects: [{ type: 'unlockJournal', entry: 'j_chapters' }],
        },
      },
      {
        id: 'lectern',
        shape: { kind: 'rect', x: 690, y: 410, w: 260, h: 330 },
        label: 'The catalogue on its lectern',
        hideWhen: { solved: 'pz_books' },
        action: { type: 'puzzle', puzzle: 'pz_books' },
      },
      {
        id: 'blank_book',
        shape: { kind: 'rect', x: 1010, y: 300, w: 400, h: 140 },
        label: 'A blank book, chosen at random',
        action: {
          type: 'inspect',
          text: 'You open one at random. The pages are ruled, numbered, and empty — page 1 of 300, patient as snow. Someone prepared every one of these for words that never arrived.',
        },
      },
      {
        id: 'window',
        shape: { kind: 'rect', x: 420, y: 130, w: 220, h: 280 },
        label: 'The window',
        action: {
          type: 'inspect',
          text: 'The window looks out on a mild violet afternoon. There is no afternoon out there. The library simply thinks a window ought to have one, and the dream agrees.',
        },
      },
      parlor.hotspot,
    ],
  };
}

export function moonpoolScene(): SceneDef {
  const library = loneDoor(1290, 'p_library_moonpool', 'The way back to the library', {
    scale: 0.8,
    groundY: 650,
  });
  return {
    palette: 'dreamviolet',
    layers: [
      { kind: 'primitive', primitive: 'glint', x: 300, y: 140, scale: 0.9, parallax: 0.05 },
      { kind: 'primitive', primitive: 'glint', x: 980, y: 90, scale: 0.7, parallax: 0.05 },
      { kind: 'primitive', primitive: 'glint', x: 1240, y: 200, scale: 0.8, parallax: 0.05 },
      ...dreamGround(11, { y: 630, fog: 0.18 }),
      // the pool, holding a moon the sky does not have
      { kind: 'primitive', primitive: 'waterPool', x: 420, y: 600, scale: 1.3, parallax: 0.45 },
      { kind: 'path', d: 'M 870 700 a 96 34 0 1 0 0.1 0 Z', fill: '#e9edff', opacity: 0.75, parallax: 0.45 },
      { kind: 'path', d: 'M 870 700 a 130 46 0 1 0 0.1 0 Z', fill: '#e9edff', opacity: 0.16, parallax: 0.45 },
      // singing stones around the rim
      ...[540, 690, 1040, 1190].map((x, i) => ({
        kind: 'path' as const,
        d: `M ${x} 800 q 12 ${-40 - (i % 2) * 14} 44 ${-38} q 30 4 26 38 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.8,
        parallax: 0.5,
      })),
      // the Dozing Door's other side — until the dream redraws it
      { kind: 'primitive', primitive: 'door', x: 130, y: 240, scale: 0.9, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_lullaby' } } },
      { kind: 'path', d: 'M 118 236 h 262 v 420 h -262 Z', fill: 'var(--p-wall-light)', opacity: 0.07, parallax: 0.15, if: { solved: 'pz_lullaby' } },
      ...library.layers,
      ...dreamFrame(),
    ],
    hotspots: [
      {
        id: 'rim',
        shape: { kind: 'rect', x: 480, y: 770, w: 800, h: 80 },
        label: 'Carvings around the rim',
        action: {
          type: 'inspect',
          text: "Around the rim, in a hand older than the Draughtsman's: 'Hush, hush — then high, then low, that is the way the sleepers go.' A lullaby, carved so it could not be forgotten.",
          effects: [{ type: 'unlockJournal', entry: 'j_lullaby' }],
        },
      },
      {
        id: 'stones',
        shape: { kind: 'rect', x: 500, y: 740, w: 780, h: 70 },
        label: 'Four singing stones',
        hideWhen: { solved: 'pz_lullaby' },
        action: { type: 'puzzle', puzzle: 'pz_lullaby' },
      },
      {
        id: 'pool',
        shape: { kind: 'rect', x: 560, y: 620, w: 620, h: 130 },
        label: 'The still water',
        action: {
          type: 'inspect',
          text: 'You lean over. The water shows you your face, the moon it keeps, and — very far up, past both — a bedroom ceiling. You decide not to mention this to the pool.',
        },
      },
      {
        id: 'dozing_backside',
        shape: { kind: 'rect', x: 130, y: 240, w: 240, h: 400 },
        label: 'A sleeping door, seen from behind',
        if: { not: { solved: 'pz_lullaby' } },
        action: { type: 'navigate', passage: 'p_hall_dozing' },
      },
      {
        id: 'door_gone',
        shape: { kind: 'rect', x: 130, y: 240, w: 240, h: 400 },
        label: 'A door-shaped patch of nothing',
        if: { solved: 'pz_lullaby' },
        action: {
          type: 'inspect',
          text: 'There was a door here. Now there is a door-shaped patch of air, slightly paler than the rest. The dream has the decency to look guilty about it.',
        },
      },
      library.hotspot,
    ],
  };
}
