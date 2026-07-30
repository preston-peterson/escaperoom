import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_verdict',
    title: 'The Verdict Holds',
    description: 'Close the case of the Meridian before she makes port.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'No Prompting the Witness',
    description: 'Close the case without consulting the inquiry notes.',
    check: 'noHints',
  },
  {
    id: 'ach_decks',
    title: 'Stem to Stern',
    description: 'Walk every deck and compartment of the emptied ship.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_casefile',
    title: 'A Complete Casefile',
    description: 'Fill every page of the case file.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Before the Tide Turns',
    description: 'Close a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_cache',
    title: "The Doctor's Prescription",
    description: 'Find what the card-sharp keeps behind the salon panelling.',
    check: 'secretFound',
    secretId: 'cache',
    secret: true,
  },
  {
    id: 'ach_sapphire',
    title: 'The Meridian Star',
    description: 'Find where the courier hid her consignment.',
    check: 'secretFound',
    secretId: 'sapphire',
    secret: true,
  },
  {
    id: 'ach_deduction',
    title: 'A Perfect Deduction',
    description: 'Name the who, the how, and the where — correctly, on the first attempt.',
    check: 'puzzleFirstTry',
    puzzle: 'pz_accusation',
  },
];
