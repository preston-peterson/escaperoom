import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const labyrinthWorld: WorldDef = {
  id: 'labyrinth',
  title: 'The Labyrinth Below',
  tagline:
    'A torch-lit maze beneath the mountain — shifting walls, drowned doors, and a fire that must not go out.',
  entryRoom: 'entrance',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_heart',
  epilogue:
    'The Ember takes your breath and blooms — not into a blaze, but into a steady, patient burning, like a heart settling into rhythm. All around you, in walls and floors and further than hearing, the labyrinth answers it: gears taking up their turning, water finding its channels, chime-stones humming one long note. The maze breathes out, and a way opens upward, and the mountain lets you go.',
  loreEpilogue:
    "You carry out every page of Vell's map, finished in your own hand. On the last one, beneath her final entry, you add a line of your own: 'The keeper's post is not empty. The fire is fed. Decide, when you find this, what you are willing to keep burning.'",
};

export default labyrinthWorld;
