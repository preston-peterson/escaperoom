import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const dreamWorld: WorldDef = {
  id: 'dream',
  title: 'The Unfinished Dream',
  tagline:
    'Stairs that climb into themselves, doors that open yesterday. The maze that does not believe in maps.',
  entryRoom: 'threshold',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_wake',
  epilogue:
    'The last note is the first note played home again, and the pale door does not so much open as stop being closed. Morning comes through it sideways, the way light enters water. Around you the dream folds itself neatly — gardens, stairs, seas, and all — finished at last, and puts itself away like a letter into an envelope. Somewhere very near and very far, the Sleeper takes one deeper breath, and opens her eyes.',
  loreEpilogue:
    "In the doorway you look one last time at what you carry: the photograph of a sleeping woman, and your memory of a half-erased face on a wall. They are the same face. There was never anyone else here — the Draughtsman was only Serelle asleep, the part of her that still drew, apologizing room by room for the rooms she could not finish. She wakes with a pencil in her hand and, for the first time in a long while, reaches for the paper instead of putting it down. The first line comes.",
};

export default dreamWorld;
