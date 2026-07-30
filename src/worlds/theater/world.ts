import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const theaterWorld: WorldDef = {
  id: 'theater',
  title: 'The Gilded Curtain',
  tagline:
    'On opening night the lead falls through the trapdoor and does not rise. The building itself is stagecraft.',
  entryRoom: 'lobby',
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
  journalLabels: {
    suspect: 'Dossiers',
    clue: 'Evidence',
    mechanism: 'Stagecraft',
    lore: 'The Case',
  },
  epilogue:
    'You name her to the empty house, and the house — six hundred seats of held breath — accepts the ending. At dawn the constables take the ladder you took, find the hollow weight where you found it, and match the blue pencil in three places. Wilhelmina Craik is waiting for them at the stage door, coat buttoned, keys surrendered, punctual as a half-hour call. She does not run. She has never once, in thirty years, missed a cue.',
  loreEpilogue:
    'Her statement runs four pages in a caller\'s steady hand. Twenty years ago a boy named Tom Craik worked the Coronet\'s traps — her brother, sixteen, quick, always early. On another opening night Silas Vane came down drunk, missed his mark, and insisted on the trap gag anyway; Tom went into the cradle to clear it and Vane called for the cue himself, laughing, in a voice the whole wing heard. The inquest ruled rigger\'s error, because Vane swore under oath he had been standing where he never stood, and a company protects its name above the title. She kept the cue sheet from that night. She waited until the building could give its own testimony: the trap, the counterweight, the five seconds — his death an exact revival of the one he caused. "The knife and the letters were set dressing," she writes. "I dressed the stage. I have always dressed the stage. I called the cue early once before I ever wrote it down, and no one looked up then, either."',
};

export default theaterWorld;
