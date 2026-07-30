import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_verdict',
    title: 'The Final Curtain',
    description: 'Close the case of the Coronet Theater.',
    check: 'worldComplete',
  },
  {
    id: 'ach_noprompt',
    title: 'No Prompting',
    description: 'Close the case without once being fed a line.',
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Every Door in the House',
    description: 'Walk every room of the Coronet, from lobby to grid.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_casebook',
    title: 'The Complete Casebook',
    description: 'Fill every page of the case file.',
    check: 'allJournal',
  },
  {
    id: 'ach_editions',
    title: 'Before the Morning Editions',
    description: 'Close a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_token',
    title: "The Doorkeeper's Token",
    description: 'Find what forty years of stagehands touched for luck.',
    check: 'secretFound',
    secretId: 'token',
    secret: true,
  },
  {
    id: 'ach_titlepage',
    title: 'The Name Under the Name',
    description: "Find the proof Vane kept an arm's length from his own reflection.",
    check: 'secretFound',
    secretId: 'titlepage',
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
