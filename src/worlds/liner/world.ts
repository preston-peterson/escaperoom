import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const linerWorld: WorldDef = {
  id: 'liner',
  title: 'The Meridian',
  tagline:
    'Mid-crossing, a courier vanishes between decks. Days from any shore, the ship keeps her secrets below.',
  entryRoom: 'promenade',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_accusation',
  journalLabels: { suspect: 'Dossiers', clue: 'Evidence', mechanism: 'The Ship', lore: 'The Case' },
  epilogue:
    'The Meridian makes port under a low morning sky, and Emile Duquesne walks down the gangway between the master-at-arms and your signature: the purser, the brass winch handle, the cargo hold — three lines on a charge sheet, each held up by two witnesses that cannot be bribed, because neither is a person. The staged rail and the planted button go into the file as what they always were: the killer spending other people\'s reputations to save his own. The passengers stream ashore around you, already telling the story wrong. You let them. The court will have it right.',
  loreEpilogue:
    "He confesses in the master-at-arms' cabin before the tide turns, in the same regulation hand as his ledgers. He never meant her harm, he writes — he meant only to clear Quill's markers with skimmed cargo credits, one quiet entry at a time, and be an honest man again by the season's end. But Marguerite Toussaint counted crates the way he balanced books, and that night in the hold she stood between him and the last emptied crate with her memo book open. He took the brass winch handle from the shadow board because it was near, and afterward he did everything else — the outward-broken rail, the shop-thread button, the re-nailed lid chalked for offload — because it was necessary. 'She was the only honest set of figures on this ship,' the confession ends, 'and I falsified her.' Marguerite goes home on the next crossing, flag-draped in the same hold, escorted by the Line's whole shore staff; the Meridian Star goes with her family's blessing to the museum at her birthplace, catalogued under her name, not its own.",
};

export default linerWorld;
