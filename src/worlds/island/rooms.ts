import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { dockScene, cliffStairScene, seaCaveScene } from './scenes/coast.ts';
import {
  squareScene,
  bellTowerScene,
  cottageScene,
  orchardScene,
} from './scenes/village.ts';
import {
  lighthouseScene,
  lanternRoomScene,
  observatoryScene,
} from './scenes/heights.ts';
import { engineHallScene, underGateScene } from './scenes/depths.ts';

export const rooms: Record<RoomId, RoomDef> = {
  dock: {
    id: 'dock',
    name: 'Landing Dock',
    scene: dockScene(),
    ambience: { drip: 0, torch: 0.1, wind: 0.9, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The ferry sets you down and does not linger. Grey water, grey stone, and a silence with weight to it — the kind a held breath has. Nailed in the letterbox, a letter addressed to no one.',
      },
      { type: 'unlockJournal', entry: 'j_maren_1' },
    ],
  },
  cliffstair: {
    id: 'cliffstair',
    name: 'Cliff Stair',
    scene: cliffStairScene(),
    ambience: { drip: 0.1, torch: 0.1, wind: 0.8, tone: 'mid' },
  },
  square: {
    id: 'square',
    name: 'Village Square',
    scene: squareScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.5, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A square of moss-grown cobbles ringed by shuttered houses. No gulls. No wash on any line. The village did not die; it simply stopped being spoken in.',
      },
    ],
  },
  belltower: {
    id: 'belltower',
    name: 'Bell Tower',
    scene: bellTowerScene(),
    ambience: { drip: 0.1, torch: 0.2, wind: 0.6, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Four ropes hang into the gloom, their tails knotted in four different ways. High above, the bells hold their tongues like witnesses.',
      },
    ],
  },
  cottage: {
    id: 'cottage',
    name: "Keeper's Cottage",
    scene: cottageScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The room of someone who meant to come back: a cup rinsed and set to dry, a chair squared to the desk, a bed made with sailor’s corners. Only the dust admits how long ago that was.',
      },
      { type: 'unlockJournal', entry: 'j_maren_2' },
    ],
  },
  orchard: {
    id: 'orchard',
    name: 'Orchard Terrace',
    scene: orchardScene(),
    ambience: { drip: 0, torch: 0.1, wind: 0.7, tone: 'mid' },
  },
  lighthouse: {
    id: 'lighthouse',
    name: 'Lighthouse Base',
    scene: lighthouseScene(),
    ambience: { drip: 0.2, torch: 0.4, wind: 0.4, tone: 'mid' },
  },
  lantern: {
    id: 'lantern',
    name: 'Lantern Room',
    scene: lanternRoomScene(),
    ambience: { drip: 0, torch: 0.6, wind: 0.9, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Wind leans on the gallery glass. The great lens hangs dark in its cage of brass, and through it the whole grey bay looks strangely magnified — as if the room were an eye, and you had walked in behind its gaze.',
      },
    ],
  },
  observatory: {
    id: 'observatory',
    name: 'Observatory',
    scene: observatoryScene(),
    ambience: { drip: 0.1, torch: 0.3, wind: 0.3, tone: 'low' },
  },
  seacave: {
    id: 'seacave',
    name: 'Sea Cave',
    scene: seaCaveScene(),
    ambience: { drip: 0.9, torch: 0.1, wind: 0.3, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The sea has kept this room for itself for a hundred years, and it shows: every surface rippled, every stone polished, and high on the wall, writing that was never meant to be read dry.',
      },
    ],
  },
  enginehall: {
    id: 'enginehall',
    name: 'Tidal Engine',
    scene: engineHallScene(),
    ambience: { drip: 0.5, torch: 0.4, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A hall cut into the living cliff, filled wall to wall with one machine. The great tide-wheel stands as still as a stopped heart — which, you begin to understand, is exactly what it is.',
      },
    ],
  },
  undergate: {
    id: 'undergate',
    name: 'The Undertow Gate',
    scene: underGateScene(),
    ambience: { drip: 0.7, torch: 0.3, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Below the engine, below the bay. A ring of stone streams seawater into the dark, and the dark on the far side is listening. Every hair on your arms agrees about that.',
      },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_dock_cliff: { id: 'p_dock_cliff', from: 'dock', to: 'cliffstair', open: true },
  p_cliff_square: { id: 'p_cliff_square', from: 'cliffstair', to: 'square', open: true },
  p_square_bell: { id: 'p_square_bell', from: 'square', to: 'belltower', open: true },
  p_square_cottage: {
    id: 'p_square_cottage',
    from: 'square',
    to: 'cottage',
    open: false,
    closedText:
      'The cottage door is locked, its iron gone orange. A keeper locks up when she means to return.',
  },
  p_square_orchard: { id: 'p_square_orchard', from: 'square', to: 'orchard', open: true },
  p_orchard_lighthouse: {
    id: 'p_orchard_lighthouse',
    from: 'orchard',
    to: 'lighthouse',
    open: true,
  },
  p_orchard_observatory: {
    id: 'p_orchard_observatory',
    from: 'orchard',
    to: 'observatory',
    open: true,
  },
  p_lighthouse_lantern: {
    id: 'p_lighthouse_lantern',
    from: 'lighthouse',
    to: 'lantern',
    open: false,
    closedText:
      'The hatch at the stair head is bolted from above, five glyphs across its frame. It wants a word, not a shoulder.',
  },
  p_square_engine: {
    id: 'p_square_engine',
    from: 'square',
    to: 'enginehall',
    open: false,
    closedText:
      'The Warden door in the paving does not stir. Its three drums wait above the grate, counting something you have not learned to count.',
  },
  p_dock_seacave: {
    id: 'p_dock_seacave',
    from: 'dock',
    to: 'seacave',
    open: false,
    hidden: true,
    closedText:
      'The sea has taken the cave mouth back. Green water breathes slowly in and out of the arch, floor to roof.',
  },
  p_engine_undergate: {
    id: 'p_engine_undergate',
    from: 'enginehall',
    to: 'undergate',
    open: false,
    hidden: true,
    closedText: 'The floor beneath the great wheel is seamless stone. For now.',
  },
};

export const map: MapLayout = {
  viewBox: [0, 0, 1000, 800],
  rooms: {
    dock: { x: 500, y: 715, shape: 'square' },
    seacave: { x: 310, y: 730, shape: 'square', w: 80, h: 80 },
    cliffstair: { x: 500, y: 595, shape: 'square' },
    square: { x: 500, y: 455, shape: 'circle', w: 120 },
    belltower: { x: 345, y: 395, shape: 'square' },
    cottage: { x: 665, y: 430, shape: 'square', w: 80, h: 80 },
    orchard: { x: 620, y: 300, shape: 'square' },
    lighthouse: { x: 500, y: 180, shape: 'square' },
    lantern: { x: 500, y: 80, shape: 'circle', w: 64 },
    observatory: { x: 800, y: 235, shape: 'square', w: 76, h: 76 },
    enginehall: { x: 285, y: 545, shape: 'square' },
    undergate: { x: 195, y: 665, shape: 'hex', w: 92 },
  },
  passageWaypoints: {
    p_dock_seacave: [[400, 762]],
    p_square_engine: [[385, 515]],
    p_engine_undergate: [[225, 605]],
    p_orchard_observatory: [[715, 258]],
  },
};
