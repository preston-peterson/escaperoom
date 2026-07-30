import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_verdict',
    title: 'Case Closed',
    description: 'Deliver a verdict the border court will hold.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'Unassisted Inquiry',
    description: 'Close the case without consulting the inspector’s notes.',
    check: 'noHints',
  },
  {
    id: 'ach_walked',
    title: 'Walked the Train',
    description: 'Set foot in every car and compartment of the Sable Express.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_casefile',
    title: 'The Complete Casefile',
    description: 'Fill the case file — every dossier, every scrap of evidence.',
    check: 'allJournal',
  },
  {
    id: 'ach_express',
    title: 'Express Judgment',
    description: 'Close a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_margo',
    title: 'The Ninth Passenger',
    description: 'Find the one soul the cordon never counted.',
    check: 'secretFound',
    secretId: 'margo',
    secret: true,
  },
  {
    id: 'ach_groat',
    title: 'The Crew’s Luck',
    description: 'Pocket what the engine crew hid behind the regulator.',
    check: 'secretFound',
    secretId: 'groat',
    secret: true,
  },
  {
    id: 'ach_deduction',
    title: 'A Perfect Deduction',
    description: 'File the inquiry docket correctly on the first attempt.',
    check: 'puzzleFirstTry',
    puzzle: 'pz_accuse',
  },
];
