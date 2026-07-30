import type { WorldDef } from '../../engine/types.ts';
import { rooms, passages, map } from './rooms.ts';
import { puzzles } from './puzzles.ts';
import { items } from './items.ts';
import { journal } from './journal.ts';
import { shifts } from './shifts.ts';
import { achievements } from './achievements.ts';

export const expressWorld: WorldDef = {
  id: 'express',
  title: 'The Sable Express',
  tagline:
    'A colonel dead behind a latched sleeper door, and a night train whose cars will not stay in order.',
  entryRoom: 'platform',
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
  journalLabels: {
    suspect: 'Dossiers',
    clue: 'Evidence',
    mechanism: 'The Train',
    lore: 'The Case',
  },
  epilogue:
    'The cordon bell rings once and the border does the rest. Two warders cross the snow to the waiting hall, unhurried, certain, and when they come back between them walks Adeline Voss — head high, gloves on, saying nothing at all. The docket holds: the hand on the telegram, the panel behind the mirror, the bare curtain-ring, the ash on the sill. As they pass the train she looks once, only once, at the observation car — and then the waiting hall doors close, and the Sable Express stands acquitted of everything except remembering.',
  loreEpilogue:
    'She confesses before noon, in a hand the clerk describes as “very regular.” Adeline Voss — courier of the Raven ring, widow by cover story only — had shadowed Colonel Fisk across three winters of routes. The forged telegram drew him to the observation car at midnight; the curtain sash-cord was in her muff before he finished his pipe. She wheeled him forward on the steward’s trolley in the porter’s dark quarter-hour, laid him out in his own berth with a rival’s strange courtesy, threw the night latch, and stepped back through the smuggler’s panel into a compartment scented with lavender. The dispatch case’s freight — the winter routes, and the sealed warrant naming the Raven ring’s paymaster — she hid under the baggage transfer platform to ride the border unclaimed. The magistracy breaks the warrant’s seal that afternoon. The name inside is the one she killed to keep folded.',
};

export default expressWorld;
