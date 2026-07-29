import type { WorldMeta } from '../engine/types.ts';

/**
 * The atlas of worlds. The playable world loads via dynamic import so future
 * worlds become separate chunks.
 */
export const worldRegistry: WorldMeta[] = [
  {
    id: 'labyrinth',
    title: 'The Labyrinth Below',
    tagline:
      'A torch-lit maze beneath the mountain — shifting walls, drowned doors, and a fire that must not go out.',
    accent: '#e0a458',
    locked: false,
    load: () => import('./labyrinth/world.ts').then((m) => m.labyrinthWorld),
  },
  {
    id: 'island',
    title: 'The Silent Island',
    tagline:
      'Ruins above a grey sea, journals of the vanished, machines that still hum when the tide is right.',
    accent: '#4a7d8c',
    locked: false,
    load: () => import('./island/world.ts').then((m) => m.islandWorld),
  },
  {
    id: 'tower',
    title: 'The Orrery Tower',
    tagline:
      'A vertical labyrinth of brass and steam — every floor a chamber of the same impossible clock.',
    accent: '#b87f33',
    locked: false,
    load: () => import('./tower/world.ts').then((m) => m.towerWorld),
  },
  {
    id: 'dream',
    title: 'The Unfinished Dream',
    tagline:
      'Stairs that climb into themselves, doors that open yesterday. The maze that does not believe in maps.',
    accent: '#7d6a9e',
    locked: true,
  },
];
