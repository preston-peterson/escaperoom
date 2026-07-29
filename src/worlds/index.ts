import type { WorldMeta } from '../engine/types.ts';

/** A shelf of the world select. More acts slot in here as the game grows. */
export interface ActMeta {
  id: string;
  title: string;
  tagline: string;
}

export const actRegistry: ActMeta[] = [
  {
    id: 'descents',
    title: 'Act I — The Descents',
    tagline: 'Four vanished keepers. Four machines that must not stop.',
  },
  {
    id: 'casebook',
    title: 'Act II — The Casebook',
    tagline: 'Four empty rooms where something happened. Name the who, the how, the where.',
  },
];

/**
 * The atlas of worlds. Each playable world loads via dynamic import so it
 * becomes its own chunk.
 */
export const worldRegistry: WorldMeta[] = [
  {
    id: 'labyrinth',
    title: 'The Labyrinth Below',
    tagline:
      'A torch-lit maze beneath the mountain — shifting walls, drowned doors, and a fire that must not go out.',
    accent: '#e0a458',
    locked: false,
    act: 'descents',
    load: () => import('./labyrinth/world.ts').then((m) => m.labyrinthWorld),
  },
  {
    id: 'island',
    title: 'The Silent Island',
    tagline:
      'Ruins above a grey sea, journals of the vanished, machines that still hum when the tide is right.',
    accent: '#4a7d8c',
    locked: false,
    act: 'descents',
    load: () => import('./island/world.ts').then((m) => m.islandWorld),
  },
  {
    id: 'tower',
    title: 'The Orrery Tower',
    tagline:
      'A vertical labyrinth of brass and steam — every floor a chamber of the same impossible clock.',
    accent: '#b87f33',
    locked: false,
    act: 'descents',
    load: () => import('./tower/world.ts').then((m) => m.towerWorld),
  },
  {
    id: 'dream',
    title: 'The Unfinished Dream',
    tagline:
      'Stairs that climb into themselves, doors that open yesterday. The maze that does not believe in maps.',
    accent: '#7d6a9e',
    locked: false,
    act: 'descents',
    load: () => import('./dream/world.ts').then((m) => m.dreamWorld),
  },
  {
    id: 'manor',
    title: 'The Longwinter House',
    tagline:
      'A financier dead behind a locked study door, and the blizzard that let everyone but the truth escape.',
    accent: '#b0413e',
    locked: true,
    act: 'casebook',
  },
  {
    id: 'liner',
    title: 'The Meridian',
    tagline:
      'Mid-crossing, a courier vanishes between decks. Days from any shore, the ship keeps her secrets below.',
    accent: '#3f8f8a',
    locked: true,
    act: 'casebook',
  },
  {
    id: 'theater',
    title: 'The Gilded Curtain',
    tagline:
      'On opening night the lead falls through the trapdoor and does not rise. The building itself is stagecraft.',
    accent: '#c04848',
    locked: true,
    act: 'casebook',
  },
  {
    id: 'express',
    title: 'The Sable Express',
    tagline:
      'A colonel dead behind a latched sleeper door, and a night train whose cars will not stay in order.',
    accent: '#4a5d8c',
    locked: true,
    act: 'casebook',
  },
];
