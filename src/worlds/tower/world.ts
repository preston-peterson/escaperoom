import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const towerWorld: WorldDef = {
  id: 'tower',
  title: 'The Orrery Tower',
  tagline:
    'A vertical labyrinth of brass and steam — every floor a chamber of the same impossible clock.',
  entryRoom: 'winding',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_orrery',
  journalLabels: { lore: "The Horologist's Notes" },
  epilogue:
    'You let go of the brake. The orrery takes up its own weight — sun-lamp kindling, moon ring finding its rail, the wanderers spreading out along their courses like a hand opening. Underfoot, floor by floor, the tower catches: the spring paying out its patient thunder, the governor finding its spin, the great pendulum taking its first long breath in years. Every clock on every floor starts at once — six minutes to midnight, and counting. The tower is wound. The sky is keeping.',
  loreEpilogue:
    'On the dome rail, under your hands as the sky begins to turn, you find two sets of initials cut small into the brass: an H, worn nearly smooth, and beside it an F, half its age. Far below, faint through eleven floors of waking machinery, you hear what might be the door at the tower’s root opening — and then, unhurried on the winding stair, two sets of footsteps, climbing home.',
};

export default towerWorld;
