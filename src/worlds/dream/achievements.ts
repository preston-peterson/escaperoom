import type { AchievementDef } from '../../engine/types.ts';

export const achievements: AchievementDef[] = [
  {
    id: 'ach_wake',
    title: 'Morning',
    description: 'Finish the dream and wake the Sleeper.',
    check: 'worldComplete',
  },
  {
    id: 'ach_lucid',
    title: 'Lucid',
    description: 'Wake the Sleeper without once consulting the notes in the margin.',
    check: 'noHints',
  },
  {
    id: 'ach_rooms',
    title: 'Every Corner of the Dream',
    description: 'Stand in every room the Draughtsman managed to draw — and the one he did not.',
    check: 'allRoomsVisited',
  },
  {
    id: 'ach_journal',
    title: 'Marginalia',
    description: 'Collect every pencil note, rhyme, and assertion the dream has to offer.',
    check: 'allJournal',
  },
  {
    id: 'ach_swift',
    title: 'Before the Alarm',
    description: 'Finish a challenge run with more than a quarter-hour of sleep to spare.',
    check: 'timeUnder',
    ms: 45 * 60_000,
  },
  {
    id: 'ach_portrait',
    title: 'The Hand That Drew',
    description: 'Find the face the Draughtsman tried to take back.',
    check: 'secretFound',
    secretId: 'portrait',
    secret: true,
  },
  {
    id: 'ach_photo',
    title: 'Face-Down',
    description: 'Turn over what the nightmare keeps dusted.',
    check: 'secretFound',
    secretId: 'photograph',
    secret: true,
  },
];
