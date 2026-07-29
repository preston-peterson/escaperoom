import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_wound',
    title: 'The Tower Wakes',
    description: 'Rewind the mainspring and set the orrery right.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'Steady Hands',
    description: "Wake the tower without consulting the guide's notes.",
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Every Floor a Wheel',
    description: 'Stand on every floor of the tower, wall-ways included.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_journal',
    title: "The Horologist's Ledger",
    description: 'Fill the journal completely — plates, pages, and all.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Ahead of the Bells',
    description: 'Finish a challenge ascent with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_letter',
    title: 'The Unsent Letter',
    description: 'Find what Fen hid in the dark between the tower’s skins.',
    check: 'secretFound',
    secretId: 'letter',
    secret: true,
  },
  {
    id: 'ach_watch',
    title: 'Keeping Time',
    description: "Pocket the Horologist's watch, and what is written inside it.",
    check: 'secretFound',
    secretId: 'watch',
    secret: true,
  },
];
