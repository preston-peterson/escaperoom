import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_quiet',
    title: 'The Quieting',
    description: 'Restart the Tidal Engine and quiet the Undertow.',
    check: 'worldComplete',
  },
  {
    id: 'ach_nohints',
    title: 'No Word Spoken Twice',
    description: "Quiet the island without consulting the guide's notes.",
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Surveyor of Silence',
    description: 'Walk every path of the island, from lantern room to sea cave.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_journal',
    title: "The Keeper's Archive",
    description: 'Recover every letter, chart, and inscription.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Between Two Tides',
    description: 'Finish a challenge run with more than a quarter-hour to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_letter',
    title: 'Ring Me Home',
    description: "Find Maren's true last letter, where only the lit beacon shows it.",
    check: 'secretFound',
    secretId: 'letter',
    secret: true,
  },
  {
    id: 'ach_token',
    title: 'What the Tide Kept',
    description: 'Pull a Warden token from the drained harbor mud.',
    check: 'secretFound',
    secretId: 'token',
    secret: true,
  },
];
