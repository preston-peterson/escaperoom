import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { foyerScene, parlorScene, libraryScene } from './scenes/ground.ts';
import { studyScene } from './scenes/study.ts';
import { landingScene, ivyRoomScene, casqueRoomScene, faroRoomScene } from './scenes/east.ts';
import { kitchenScene, tabbRoomScene, pantryScene, boilerRoomScene } from './scenes/service.ts';
import { conservatoryScene } from './scenes/conservatory.ts';

export const rooms: Record<RoomId, RoomDef> = {
  foyer: {
    id: 'foyer',
    name: 'Entrance Hall',
    scene: foyerScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.5, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Longwinter House, one day after the pass half-opened and five days after it closed. The guests are all down in the village, the master is still in his study, and nothing in this hall makes a sound but the snow ticking at the glass. You have until the pass clears. Begin.',
      },
    ],
  },
  parlor: {
    id: 'parlor',
    name: 'Parlor',
    scene: parlorScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Sheeted chairs, a dead hearth, and a portrait keeping watch over the room where the household last sat together. The west door is furred with an inch of frost: the conservatory beyond it has become an icebox.',
      },
    ],
  },
  library: {
    id: 'library',
    name: 'Library',
    scene: libraryScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.2, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Gideon Ash worked here — the desk still smells of his cigars. A ledger lies open where anyone entering must see it, which is the first thing wrong with it.',
      },
      { type: 'unlockJournal', entry: 'j_sus_ash' },
    ],
  },
  study: {
    id: 'study',
    name: 'The Study',
    scene: studyScene(),
    ambience: { drip: 0, torch: 0.25, wind: 0.3, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The famous locked room. Curtains drawn, one lamp burned dry, and under a constable’s sheet by the desk, Aldous Wren — waiting, like everything else at Longwinter, for the pass to open. The room is neat. The room is very, very neat.',
      },
    ],
  },
  landing: {
    id: 'landing',
    name: 'East Landing',
    scene: landingScene(),
    ambience: { drip: 0, torch: 0.2, wind: 0.8, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The east wing has been unheated for days and the cold up here has teeth. Three guest doors stand ajar on three abandoned rooms, and above the stairwell the skylight sags under the whole weight of the storm.',
      },
    ],
  },
  ivy_room: {
    id: 'ivy_room',
    name: 'Ivy’s Room',
    scene: ivyRoomScene(),
    ambience: { drip: 0, torch: 0.25, wind: 0.5, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Packed in twenty minutes flat and it shows: drawers out, wardrobe agape, and on the table a music box too heavy to carry, its lid open on a bare spindle.',
      },
      { type: 'unlockJournal', entry: 'j_sus_ivy' },
    ],
  },
  casque_room: {
    id: 'casque_room',
    name: 'Dr. Casque’s Room',
    scene: casqueRoomScene(),
    ambience: { drip: 0, torch: 0.25, wind: 0.4, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Order, even in evacuation: the bed squared, the desk aligned, the medicine chest locked. Only a doctor leaves a fleeing house looking readier than she found it.',
      },
      { type: 'unlockJournal', entry: 'j_sus_casque' },
    ],
  },
  faro_room: {
    id: 'faro_room',
    name: 'Faro’s Room',
    scene: faroRoomScene(),
    ambience: { drip: 0, torch: 0.2, wind: 0.9, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Paper everywhere, an unmade bed with a coat-shaped hollow in it, and the window open an inch to five days of blizzard. The floor beneath it wears a tongue of driven snow.',
      },
      { type: 'unlockJournal', entry: 'j_sus_faro' },
      { type: 'setFlag', flag: 'drift_fallen' },
      { type: 'triggerShift', shift: 's_drift' },
    ],
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    scene: kitchenScene(),
    ambience: { drip: 0.2, torch: 0.35, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Cold range, scrubbed table, everything hung on its right hook — Mrs. Tabb’s kingdom, run to a ruler’s line. The cellar door in the corner wears a padlock the size of your fist.',
      },
    ],
  },
  tabb_room: {
    id: 'tabb_room',
    name: 'Mrs. Tabb’s Room',
    scene: tabbRoomScene(),
    ambience: { drip: 0.1, torch: 0.3, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A narrow, spotless room that smells of soap and blacklead. Thirty years of the house’s life, written down in one steady hand and shelved in order.',
      },
      { type: 'unlockJournal', entry: 'j_sus_tabb' },
    ],
  },
  pantry: {
    id: 'pantry',
    name: 'Pantry',
    scene: pantryScene(),
    ambience: { drip: 0.2, torch: 0.25, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Shelved preserves, sacked flour, hanging herbs — and a fine white dust across the floor that someone has been through in a way flour is not usually gone through.',
      },
    ],
  },
  boiler: {
    id: 'boiler',
    name: 'Boiler Cellar',
    scene: boilerRoomScene(),
    ambience: { drip: 0.5, torch: 0.4, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Stone, iron, and the ghost-smell of coal smoke. The boiler that should have kept Longwinter alive all night stands stone cold — and its fittings are missing, and its damper is strapped shut.',
      },
    ],
  },
  conservatory: {
    id: 'conservatory',
    name: 'The Conservatory',
    scene: conservatoryScene(),
    ambience: { drip: 0.6, torch: 0.2, wind: 0.6, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Warmth is coming back into the glass house like feeling into a numb hand, and everything the freeze held is letting go at once: dripping leaves, an overturned chair, and a floor that is beginning, at last, to talk.',
      },
      { type: 'setFlag', flag: 'pane_fallen' },
      { type: 'triggerShift', shift: 's_pane' },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_foyer_parlor: { id: 'p_foyer_parlor', from: 'foyer', to: 'parlor', open: true },
  p_foyer_library: { id: 'p_foyer_library', from: 'foyer', to: 'library', open: true },
  p_foyer_kitchen: { id: 'p_foyer_kitchen', from: 'foyer', to: 'kitchen', open: true },
  p_foyer_landing: {
    id: 'p_foyer_landing',
    from: 'foyer',
    to: 'landing',
    open: true,
    closedText:
      'The main stair is packed with fallen drift to the ceiling — a wall of blue-white snow where the east wing used to begin.',
  },
  p_foyer_study: {
    id: 'p_foyer_study',
    from: 'foyer',
    to: 'study',
    open: false,
    closedText:
      'Locked — a brass letter-lock of three dials where a keyhole should be. Mr. Wren trusted no key that could be pocketed.',
  },
  p_landing_ivy: { id: 'p_landing_ivy', from: 'landing', to: 'ivy_room', open: true },
  p_landing_casque: { id: 'p_landing_casque', from: 'landing', to: 'casque_room', open: true },
  p_landing_faro: { id: 'p_landing_faro', from: 'landing', to: 'faro_room', open: true },
  p_landing_kitchen: {
    id: 'p_landing_kitchen',
    from: 'landing',
    to: 'kitchen',
    open: false,
    hidden: true,
  },
  p_kitchen_tabb: { id: 'p_kitchen_tabb', from: 'kitchen', to: 'tabb_room', open: true },
  p_kitchen_pantry: { id: 'p_kitchen_pantry', from: 'kitchen', to: 'pantry', open: true },
  p_kitchen_cellar: {
    id: 'p_kitchen_cellar',
    from: 'kitchen',
    to: 'boiler',
    open: false,
    closedText:
      'A cold-store padlock the size of your fist. Mrs. Tabb’s chatelaine holds no key for it — Wren kept the cellar himself.',
  },
  p_pantry_study: {
    id: 'p_pantry_study',
    from: 'pantry',
    to: 'study',
    open: false,
    hidden: true,
  },
  p_parlor_conservatory: {
    id: 'p_parlor_conservatory',
    from: 'parlor',
    to: 'conservatory',
    open: false,
    closedText:
      'The conservatory door is sealed fast — frost first, welded an inch deep into the frame, and the weather has had days to make it worse.',
  },
  p_conservatory_kitchen: {
    id: 'p_conservatory_kitchen',
    from: 'conservatory',
    to: 'kitchen',
    open: false,
    hidden: true,
  },
};

export const map: MapLayout = {
  // Bottom margin leaves room for the lowest room's name label.
  viewBox: [0, 0, 1000, 840],
  rooms: {
    landing: { x: 500, y: 190, shape: 'circle', w: 100 },
    ivy_room: { x: 330, y: 80, shape: 'square', w: 84, h: 84 },
    casque_room: { x: 500, y: 55, shape: 'square', w: 84, h: 84 },
    faro_room: { x: 670, y: 80, shape: 'square', w: 84, h: 84 },
    foyer: { x: 500, y: 390, shape: 'circle', w: 130 },
    parlor: { x: 320, y: 390, shape: 'square' },
    conservatory: { x: 150, y: 450, shape: 'hex', w: 110 },
    library: { x: 680, y: 390, shape: 'square' },
    study: { x: 740, y: 230, shape: 'square' },
    kitchen: { x: 500, y: 580, shape: 'square', w: 110, h: 90 },
    pantry: { x: 330, y: 640, shape: 'square', w: 84, h: 84 },
    tabb_room: { x: 670, y: 640, shape: 'square', w: 84, h: 84 },
    boiler: { x: 500, y: 730, shape: 'square', w: 96, h: 72 },
  },
  passageWaypoints: {
    p_landing_kitchen: [
      [880, 190],
      [880, 580],
    ],
    p_pantry_study: [
      [330, 770],
      [950, 770],
      [950, 230],
    ],
    p_conservatory_kitchen: [[260, 560]],
  },
};
