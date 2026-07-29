import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const islandWorld: WorldDef = {
  id: 'island',
  title: 'The Silent Island',
  tagline:
    'Ruins above a grey sea, journals of the vanished, machines that still hum when the tide is right.',
  entryRoom: 'dock',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_quieting',
  epilogue:
    'The gate does not open so much as unclench. Warm air moves through it — warm, down here — and the attentive dark behind the ring becomes only darkness, ordinary and asleep. Above you the engine turns, the bay rocks in its cradle of stone, and the island is quiet at last in the way a house is quiet when the child has finally gone down. When you climb back into the daylight, the skiff is riding high at the jetty, and the tide is fair for home.',
  loreEpilogue:
    "And you are not alone on the water. She sits in the stern the way keepers sit — spine straight, eyes astern, counting the wheel-turns of her island growing small. Salt-grey, sea-worn, alive: relieved, in both senses, exactly as the instructions promised. Somewhere past the harbor mouth she says, to the wake more than to you, 'The plums will want pruning in the spring.' It is the only thanks either of you needs.",
};

export default islandWorld;
