import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_escape',
    title: 'Out of the Depths',
    description: 'Feed the Ember and escape the labyrinth.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'Untouched Flame',
    description: "Escape without consulting the guide's notes.",
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Cartographer',
    description: "Chart every chamber — finish Vell's map.",
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_journal',
    title: 'Keeper of Lore',
    description: 'Fill the journal completely.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Swift Descent',
    description: 'Escape a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_oracle',
    title: 'Eye of the Oracle',
    description: "Find the alcove where the Builders watched their machine.",
    check: 'secretFound',
    secretId: 'oracle',
    secret: true,
  },
  {
    id: 'ach_coin',
    title: "The Builder's Coin",
    description: 'Pocket what a Builder left in the basin.',
    check: 'secretFound',
    secretId: 'coin',
    secret: true,
  },
];
