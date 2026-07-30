import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { promenadeScene, salonScene, officeScene } from './scenes/deckA.ts';
import { corridorScene, cabinScene, suiteScene } from './scenes/cabins.ts';
import { stairScene, linenScene, galleyScene } from './scenes/service.ts';
import { engineScene, winchScene, holdScene } from './scenes/below.ts';

export const rooms: Record<RoomId, RoomDef> = {
  promenade: {
    id: 'promenade',
    name: 'First-Class Promenade',
    scene: promenadeScene(),
    ambience: { drip: 0, torch: 0.1, wind: 0.8, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The longest deck on the ship, and yours alone. Deck chairs stacked, passengers confined forward, the sea running grey to the horizon. Somewhere between this rail and her cabin, Marguerite Toussaint stopped existing on paper.',
      },
      { type: 'unlockJournal', entry: 'j_lore_brief' },
    ],
  },
  grand_salon: {
    id: 'grand_salon',
    name: 'Grand Salon',
    scene: salonScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.2, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Crystal swaying gently overhead, cards abandoned mid-deal. A room that emptied fast and expects to be back by evening.',
      },
      { type: 'unlockJournal', entry: 'j_sus_quill' },
    ],
  },
  pursers_office: {
    id: 'pursers_office',
    name: "Purser's Office",
    scene: officeScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.1, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Ink, brass polish, and books balanced to the penny — on the surface. Eleven years of immaculate is exactly what a good skim looks like.',
      },
      { type: 'unlockJournal', entry: 'j_sus_duquesne' },
    ],
  },
  cabin_corridor: {
    id: 'cabin_corridor',
    name: 'First-Class Corridor',
    scene: corridorScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Lamplight swinging softly down a row of numbered doors. Twelve is sealed with the inquiry cross — your own seal, waiting on your own key.',
      },
    ],
  },
  marguerite_cabin: {
    id: 'marguerite_cabin',
    name: 'Stateroom Twelve',
    scene: cabinScene(),
    ambience: { drip: 0, torch: 0.25, wind: 0.15, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'You step in the way you would enter a chapel. The room is exactly as she left it, which is to say: expecting her back.',
      },
      { type: 'unlockJournal', entry: 'j_lore_cabin' },
    ],
  },
  vivienne_suite: {
    id: 'vivienne_suite',
    name: 'The Crane Suite',
    scene: suiteScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.25, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Velvet, ancestors in oval frames, and eleven trunks stacked like fortifications. Wealth at sea, arranged for siege.',
      },
      { type: 'unlockJournal', entry: 'j_sus_crane' },
    ],
  },
  service_stair: {
    id: 'service_stair',
    name: 'Service Stair',
    scene: stairScene(),
    ambience: { drip: 0.2, torch: 0.3, wind: 0.3, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Below the wainscot line the ship stops pretending: bare iron, pipe runs, and a watch desk with eyes on every corridor. Nothing passes this landing unremarked.',
      },
    ],
  },
  linen_room: {
    id: 'linen_room',
    name: 'Linen Room',
    scene: linenScene(),
    ambience: { drip: 0.1, torch: 0.25, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Steam-warm and folded to the square inch. The stewardess runs this room like a ledger, and it balances.',
      },
      { type: 'unlockJournal', entry: 'j_sus_marsh' },
    ],
  },
  galley: {
    id: 'galley',
    name: 'Galley',
    scene: galleyScene(),
    ambience: { drip: 0.15, torch: 0.3, wind: 0.15, tone: 'low' },
  },
  engine_room: {
    id: 'engine_room',
    name: 'Engine Room',
    scene: engineScene(),
    ambience: { drip: 0.3, torch: 0.5, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Heat, oil, and the patient thunder of the ship keeping steerage way. Down here everything that moves is stamped and witnessed by iron.',
      },
      { type: 'unlockJournal', entry: 'j_sus_reyes' },
      { type: 'triggerShift', shift: 's_list' },
    ],
  },
  winch_flat: {
    id: 'winch_flat',
    name: 'Winch Flat',
    scene: winchScene(),
    ambience: { drip: 0.25, torch: 0.3, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The cargo winch, its shadow board of tools, and the hatch down into the hold. A tidy room with one loud absence.',
      },
    ],
  },
  cargo_hold: {
    id: 'cargo_hold',
    name: 'Cargo Hold',
    scene: holdScene(),
    ambience: { drip: 0.4, torch: 0.15, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Cold air, tarred rope, crate rows under one swaying lantern. The bottom of the ship, and — you are increasingly certain — the bottom of the case.',
      },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_prom_salon: { id: 'p_prom_salon', from: 'promenade', to: 'grand_salon', open: true },
  p_prom_office: {
    id: 'p_prom_office',
    from: 'promenade',
    to: 'pursers_office',
    open: false,
    closedText:
      "The purser's office is locked — a good mortise lock, its keys impounded with their owner. The master-at-arms keeps a spare in his key box in the salon.",
  },
  p_prom_corridor: { id: 'p_prom_corridor', from: 'promenade', to: 'cabin_corridor', open: true },
  p_prom_suite: {
    id: 'p_prom_suite',
    from: 'promenade',
    to: 'vivienne_suite',
    open: false,
    closedText:
      'The starboard door is jammed hard in its warped frame. The whole deck would have to lean before this gave.',
  },
  p_corridor_cabin: {
    id: 'p_corridor_cabin',
    from: 'cabin_corridor',
    to: 'marguerite_cabin',
    open: false,
    closedText:
      "Stateroom Twelve, sealed for the inquiry and locked. Its key hangs on the purser's rack, behind his locked office.",
  },
  p_corridor_stair: { id: 'p_corridor_stair', from: 'cabin_corridor', to: 'service_stair', open: true },
  p_stair_linen: { id: 'p_stair_linen', from: 'service_stair', to: 'linen_room', open: true },
  p_stair_galley: {
    id: 'p_stair_galley',
    from: 'service_stair',
    to: 'galley',
    open: true,
    closedText:
      'The galley corridor is shut behind its watertight door — the frames cycled, and this one dogged itself closed.',
  },
  p_stair_engine: {
    id: 'p_stair_engine',
    from: 'service_stair',
    to: 'engine_room',
    open: false,
    closedText:
      'The engine-room watertight door is dogged shut from the drill. The brass switches of the test panel wait in a row beside it.',
  },
  p_galley_engine: {
    id: 'p_galley_engine',
    from: 'galley',
    to: 'engine_room',
    open: false,
    closedText:
      'The aft galley frame is sealed — a watertight door, closed since the last drill cycled the bulkheads.',
  },
  p_engine_winch: { id: 'p_engine_winch', from: 'engine_room', to: 'winch_flat', open: true },
  p_winch_hold: {
    id: 'p_winch_hold',
    from: 'winch_flat',
    to: 'cargo_hold',
    open: false,
    closedText:
      "The hold hatch is locked under three stevedore's rings — anchor, star, and moon among the blank stops.",
  },
  p_galley_hold: {
    id: 'p_galley_hold',
    from: 'galley',
    to: 'cargo_hold',
    open: false,
    hidden: true,
  },
};

/** Deck plan, bow at the left: Deck A above, service deck amidships, the hold below. */
export const map: MapLayout = {
  viewBox: [0, 0, 1200, 760],
  rooms: {
    pursers_office: { x: 190, y: 140, shape: 'square' },
    promenade: { x: 430, y: 140, shape: 'circle', w: 120 },
    grand_salon: { x: 670, y: 140, shape: 'square' },
    vivienne_suite: { x: 900, y: 140, shape: 'square' },
    cabin_corridor: { x: 430, y: 310, shape: 'square', w: 80, h: 80 },
    marguerite_cabin: { x: 650, y: 310, shape: 'square', w: 80, h: 80 },
    linen_room: { x: 190, y: 470, shape: 'square', w: 80, h: 80 },
    service_stair: { x: 430, y: 470, shape: 'hex', w: 90 },
    galley: { x: 650, y: 470, shape: 'square', w: 80, h: 80 },
    engine_room: { x: 900, y: 470, shape: 'square' },
    winch_flat: { x: 900, y: 640, shape: 'square', w: 80, h: 80 },
    cargo_hold: { x: 650, y: 640, shape: 'square' },
  },
  passageWaypoints: {
    p_prom_suite: [[670, 50]],
    p_stair_engine: [[655, 395]],
  },
};
