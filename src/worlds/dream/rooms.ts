import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { thresholdScene, hallScene, stairScene } from './scenes/entry.ts';
import { gardenScene, parlorScene, seamScene } from './scenes/garden.ts';
import { libraryScene, moonpoolScene } from './scenes/depths.ts';
import { tideScene, halfdrawnScene, sleeperScene } from './scenes/finale.ts';

export const rooms: Record<RoomId, RoomDef> = {
  threshold: {
    id: 'threshold',
    name: 'The Threshold',
    scene: thresholdScene(),
    ambience: { drip: 0, torch: 0.1, wind: 0.6, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A door stands alone in a field of fog, holding up no wall, opening from nowhere into nowhere. Above, where the sky should thin, a sea hangs — patient, silver, upside down.',
      },
      { type: 'unlockJournal', entry: 'j_draughtsman_1' },
    ],
  },
  hall: {
    id: 'hall',
    name: 'The Hall of Doors',
    scene: hallScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Doors, doors, doors — a corridor of them receding into violet dusk. Nearly all are paintings of doors. You can tell, because they were painted lovingly, by someone who missed doors very much.',
      },
    ],
  },
  stair: {
    id: 'stair',
    name: 'The Stair That Climbs Itself',
    scene: stairScene(),
    ambience: { drip: 0.1, torch: 0.2, wind: 0.5, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A staircase rises through open air, turns twice, and arrives beneath itself. You are certain of this, and it is not possible, in the way of dreams and escalators.',
      },
    ],
  },
  garden: {
    id: 'garden',
    name: 'The Upside Garden',
    scene: gardenScene(),
    ambience: { drip: 0.3, torch: 0.1, wind: 0.6, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Trees hang from the ceiling of the world, roots sunward — or you are walking on the sky; the garden declines to specify. Higher still, the sea rolls its slow silver, minding its own weather.',
      },
      { type: 'unlockJournal', entry: 'j_draughtsman_2' },
    ],
  },
  parlor: {
    id: 'parlor',
    name: 'The Mirror Parlor',
    scene: parlorScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.1, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A parlor, prim and violet, kept for guests who never quite arrive. A vanity mirror takes up most of one wall, and most of one wall is exactly what it intends to go on taking.',
      },
    ],
  },
  seam: {
    id: 'seam',
    name: 'The Nightmare Seam',
    scene: seamScene(),
    ambience: { drip: 0.2, torch: 0.6, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Behind the wallpaper the dream is red. Not blood-red; furnace-red — a small hot room like the inside of a held breath, where the dream keeps the one thing it cannot bring itself to draw.',
      },
      { type: 'unlockJournal', entry: 'j_mech_seam' },
    ],
  },
  library: {
    id: 'library',
    name: 'The Library of Blank Books',
    scene: libraryScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Shelves to the ceiling, and every book bound, ruled, numbered — and blank. The room has the particular hush of a sentence that never found its verb.',
      },
      { type: 'unlockJournal', entry: 'j_draughtsman_3' },
    ],
  },
  moonpool: {
    id: 'moonpool',
    name: 'The Moon Pool',
    scene: moonpoolScene(),
    ambience: { drip: 0.7, torch: 0.1, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A round pool holds a moon the sky overhead has never owned. The water is still in a way water never quite manages on its own — a rehearsed stillness. The stillness of something listening.',
      },
    ],
  },
  tide: {
    id: 'tide',
    name: 'The Tide of Clocks',
    scene: tideScene(),
    ambience: { drip: 0.4, torch: 0.2, wind: 0.7, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A shore of grey sand, and a sea of clock faces washing against it — hours hissing over hours, a tide going out in no particular direction. Three great clocks stand drowned to their waists, each wrong in its own way.',
      },
    ],
  },
  halfdrawn: {
    id: 'halfdrawn',
    name: 'The Half-Drawn Room',
    scene: halfdrawnScene(),
    ambience: { drip: 0, torch: 0.2, wind: 0.4, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The room simply stops being finished. Floor gives way to floorboard-lines, walls to wall-lines, and past the last stroke there is only the pale not-yet where the dream ran out of itself. It is very quiet — the specific quiet of an unfinished sentence.',
      },
      { type: 'unlockJournal', entry: 'j_draughtsman_4' },
    ],
  },
  sleeper: {
    id: 'sleeper',
    name: "The Sleeper's Door",
    scene: sleeperScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'One door, pale as morning, in a wall of gentle dark. It is breathing — slow, even, unhurried. Whatever is on the other side has been asleep a long time, and is not unhappy, and cannot stay.',
      },
      { type: 'unlockJournal', entry: 'j_sleeper_door' },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_threshold_hall: {
    id: 'p_threshold_hall',
    from: 'threshold',
    to: 'hall',
    open: false,
    closedText:
      'Locked — not against you, exactly. More as if the far side has not decided to exist yet. Perhaps it wants asking.',
  },
  p_hall_stair: {
    id: 'p_hall_stair',
    from: 'hall',
    to: 'stair',
    open: false,
    closedText: 'The one real door is locked in three rings of tiny skies.',
  },
  // The loop: the top of the stair pours you back into the Hall of Doors.
  p_stair_loop: {
    id: 'p_stair_loop',
    from: 'stair',
    to: 'hall',
    open: true,
    closedText:
      'The stair no longer pretends to climb. Where the loop used to be there is simply a wall with ambitions.',
  },
  p_stair_garden: {
    id: 'p_stair_garden',
    from: 'stair',
    to: 'garden',
    open: false,
    hidden: true,
    closedText: 'The garden hangs just out of reach, the way tomorrow does.',
  },
  p_garden_parlor: {
    id: 'p_garden_parlor',
    from: 'garden',
    to: 'parlor',
    open: true,
  },
  p_parlor_library: {
    id: 'p_parlor_library',
    from: 'parlor',
    to: 'library',
    open: false,
    closedText:
      'The bookcase stands where a door clearly means to be. It pretends to be absorbed in its books.',
  },
  p_parlor_seam: {
    id: 'p_parlor_seam',
    from: 'parlor',
    to: 'seam',
    open: false,
    hidden: true,
    closedText: 'The wallpaper holds its pattern and its tongue.',
  },
  p_library_moonpool: {
    id: 'p_library_moonpool',
    from: 'library',
    to: 'moonpool',
    open: true,
  },
  // The Dozing Door. Asleep, it "leads" to the Moon Pool and never opens;
  // when the dream redraws itself (s_redraw) it wakes leading to the Tide.
  p_hall_dozing: {
    id: 'p_hall_dozing',
    from: 'hall',
    to: 'moonpool',
    open: false,
    closedText:
      'The door is asleep. Through the keyhole: slow water, breathing in waltz time. It would be rude to force it.',
  },
  p_tide_halfdrawn: {
    id: 'p_tide_halfdrawn',
    from: 'tide',
    to: 'halfdrawn',
    open: false,
    closedText:
      "The tide of hours is in. The way onward lies under fathoms of four-o'-clocks.",
  },
  p_halfdrawn_sleeper: {
    id: 'p_halfdrawn_sleeper',
    from: 'halfdrawn',
    to: 'sleeper',
    open: false,
    hidden: true,
    closedText: 'There is no door there. There is barely a there there.',
  },
};

/**
 * The map the maze does not believe in: rooms scattered where they fell,
 * passages curving the long way round. Readable, but only just polite.
 */
export const map: MapLayout = {
  viewBox: [0, 0, 1000, 800],
  rooms: {
    threshold: { x: 505, y: 735, shape: 'square' },
    hall: { x: 460, y: 585, shape: 'hex', w: 118 },
    stair: { x: 700, y: 620, shape: 'square' },
    garden: { x: 770, y: 455, shape: 'circle', w: 96 },
    parlor: { x: 655, y: 300, shape: 'square' },
    seam: { x: 800, y: 170, shape: 'square', w: 62, h: 62 },
    library: { x: 465, y: 175, shape: 'square', w: 84, h: 84 },
    moonpool: { x: 255, y: 255, shape: 'circle', w: 92 },
    tide: { x: 155, y: 500, shape: 'square' },
    halfdrawn: { x: 85, y: 335, shape: 'square', w: 84, h: 84 },
    sleeper: { x: 85, y: 150, shape: 'circle', w: 80 },
  },
  passageWaypoints: {
    // the loop curls out of the stair and sneaks back into the hall
    p_stair_loop: [
      [810, 690],
      [600, 700],
    ],
    p_hall_stair: [[585, 640]],
    p_stair_garden: [[790, 545]],
    p_garden_parlor: [[745, 370]],
    p_parlor_seam: [[750, 225]],
    p_parlor_library: [[555, 215]],
    p_library_moonpool: [[350, 195]],
    // the Dozing Door's long, implausible reach across the map
    p_hall_dozing: [[300, 430]],
    p_tide_halfdrawn: [[95, 430]],
    p_halfdrawn_sleeper: [[45, 240]],
  },
};
