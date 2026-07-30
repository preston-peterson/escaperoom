import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_verdict',
    title: 'The House Testifies',
    description: 'Close the case of Aldous Wren and send the brief down the wire.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'No Prompting the Witness',
    description: 'Close the case without consulting the guide’s notes.',
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Every Cold Room',
    description: 'Walk every room of Longwinter House, from cellar to conservatory.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_journal',
    title: 'The Complete Case File',
    description: 'Fill every page — dossiers, evidence, the house, and the case.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Before the Pass Opens',
    description: 'Close a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_will',
    title: 'Behind the Winter Face',
    description: 'Find the redrafted will in the wall Wren trusted most.',
    check: 'secretFound',
    secretId: 'will',
    secret: true,
  },
  {
    id: 'ach_miniature',
    title: 'The Shelf No Guest Browses',
    description: 'Find what the financier kept where only he would look.',
    check: 'secretFound',
    secretId: 'miniature',
    secret: true,
  },
  {
    id: 'ach_deduction',
    title: 'A Perfect Deduction',
    description: 'Name the who, the how, and the where — correctly, on the first attempt.',
    check: 'puzzleFirstTry',
    puzzle: 'pz_accuse',
  },
];
