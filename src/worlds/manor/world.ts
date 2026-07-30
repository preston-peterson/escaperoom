import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const manorWorld: WorldDef = {
  id: 'manor',
  title: 'The Longwinter House',
  tagline:
    'A financier dead behind a locked study door, and the blizzard that let everyone but the truth escape.',
  entryRoom: 'foyer',
  challengeDurationMs: 60 * 60_000,
  rooms,
  passages,
  puzzles,
  items,
  journal,
  shifts,
  achievements,
  map,
  finalPuzzle: 'pz_accuse',
  journalLabels: { suspect: 'Dossiers', clue: 'Evidence', mechanism: 'The House', lore: 'The Case' },
  epilogue:
    'The wire hums your brief down the valley, and the valley answers within the hour: held for the assizes. Tomorrow the pass opens and the vans come up for the body and the boxes; tonight Longwinter House stands acquitted of its own locked door — the study was a stage, the storm was a stagehand, and the only room that never lied to you was the one the cold was hired to silence. Somewhere in a village inn, among the evacuated guests, a doctor hears boots on the stair and knows the house kept none of her secrets.',
  loreEpilogue:
    'Later, they will tell you she never waited to be accused. When the constable reached the inn she was sitting with her bag packed, and gave her statement as precisely as a dosage: “His heart was never failing. It was my invention — four years of a rich man’s retainer for keeping a healthy man carefully frightened. When he wrote away for a stranger’s opinion, the reply would have ended me; the blizzard held that letter at the village, but not forever. So: the vial in his brandy at ten. He died comfortable, among his orchids, which is more than the assizes will offer me. I moved him to the study because locked rooms flatter a financier’s enemies, and enemies were a thing he had honestly earned. I scraped snow onto the sill. I put the letter opener in after. I strapped the damper so the cold would hold the conservatory shut behind me. I am not sorry about the money. About the orchids — a little.”',
};

export default manorWorld;
