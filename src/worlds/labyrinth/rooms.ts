import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { entranceScene, gatehouseScene, hallScene } from './scenes/core.ts';
import { cisternScene, sluiceScene, galleryScene } from './scenes/west.ts';
import { gearworksScene, bridgeScene, vaultScene } from './scenes/east.ts';
import { scriptoriumScene, cryptScene, oracleScene } from './scenes/northeast.ts';
import { gateScene, heartScene } from './scenes/center.ts';

export const rooms: Record<RoomId, RoomDef> = {
  entrance: {
    id: 'entrance',
    name: 'Entrance Stair',
    scene: entranceScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The stair ends. The dark begins. Somewhere below, faint as a pulse, something is turning.',
      },
      { type: 'unlockJournal', entry: 'j_vell_1' },
    ],
  },
  gatehouse: {
    id: 'gatehouse',
    name: 'Gatehouse',
    scene: gatehouseScene(),
    ambience: { drip: 0.1, torch: 0.6, wind: 0.2, tone: 'mid' },
  },
  hall: {
    id: 'hall',
    name: 'Hall of Echoes',
    scene: hallScene(),
    ambience: { drip: 0.2, torch: 0.5, wind: 0.5, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A great round hall, ringed with doorways. Your footsteps come back to you seven-fold.',
      },
    ],
  },
  cistern: {
    id: 'cistern',
    name: 'Cistern',
    scene: cisternScene(),
    ambience: { drip: 0.9, torch: 0.3, wind: 0.1, tone: 'low' },
  },
  sluice: {
    id: 'sluice',
    name: 'Sluice Room',
    scene: sluiceScene(),
    ambience: { drip: 0.6, torch: 0.4, wind: 0.2, tone: 'low' },
  },
  gallery: {
    id: 'gallery',
    name: 'Flooded Gallery',
    scene: galleryScene(),
    ambience: { drip: 0.7, torch: 0.3, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Everything here wears a skin of silt. A century underwater, and dry for less than an hour.',
      },
    ],
  },
  gearworks: {
    id: 'gearworks',
    name: 'Gearworks',
    scene: gearworksScene(),
    ambience: { drip: 0.1, torch: 0.6, wind: 0.2, tone: 'mid' },
  },
  bridge: {
    id: 'bridge',
    name: 'Broken Bridge',
    scene: bridgeScene(),
    ambience: { drip: 0.2, torch: 0.4, wind: 0.8, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The corridor simply stops. Cold air rises out of a dark that your light refuses to fathom.',
      },
    ],
  },
  vault: {
    id: 'vault',
    name: 'Counterweight Vault',
    scene: vaultScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.2, tone: 'mid' },
  },
  scriptorium: {
    id: 'scriptorium',
    name: 'Scriptorium',
    scene: scriptoriumScene(),
    ambience: { drip: 0.1, torch: 0.4, wind: 0.1, tone: 'mid' },
  },
  crypt: {
    id: 'crypt',
    name: 'Crypt of the Builders',
    scene: cryptScene(),
    ambience: { drip: 0.3, torch: 0.3, wind: 0.2, tone: 'deep' },
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle Alcove',
    scene: oracleScene(),
    ambience: { drip: 0.1, torch: 0.3, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      { type: 'markSecret', secret: 'oracle' },
      {
        type: 'narrate',
        text: 'A room no wider than outstretched arms, kept like a shrine. This is where the watching was done.',
      },
      { type: 'unlockJournal', entry: 'j_vell_final' },
    ],
  },
  gate: {
    id: 'gate',
    name: 'Serpent Gate',
    scene: gateScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.4, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The serpent fills the wall, jaw closed, eyes dark. It has been waiting longer than your language has existed.',
      },
    ],
  },
  heart: {
    id: 'heart',
    name: 'The Heart',
    scene: heartScene(),
    ambience: { drip: 0, torch: 0.9, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Warmth, after so much stone-cold dark. In a cradle of black iron, an ember the size of a heart beats light against the walls.',
      },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_entrance_gatehouse: { id: 'p_entrance_gatehouse', from: 'entrance', to: 'gatehouse', open: true },
  p_gatehouse_hall: {
    id: 'p_gatehouse_hall',
    from: 'gatehouse',
    to: 'hall',
    open: false,
    closedText: 'A massive slab bars the way, its four glyph dials waiting.',
  },
  p_hall_cistern: {
    id: 'p_hall_cistern',
    from: 'hall',
    to: 'cistern',
    open: true,
    closedText: 'Blank stone, seamless, where the west door used to be.',
  },
  p_cistern_sluice: { id: 'p_cistern_sluice', from: 'cistern', to: 'sluice', open: true },
  p_cistern_gallery: {
    id: 'p_cistern_gallery',
    from: 'cistern',
    to: 'gallery',
    open: false,
    closedText: 'The drowned door is shut fast, black water pressing it closed from the far side.',
  },
  p_gallery_hall: {
    id: 'p_gallery_hall',
    from: 'gallery',
    to: 'hall',
    open: false,
    hidden: true,
  },
  p_hall_gearworks: { id: 'p_hall_gearworks', from: 'hall', to: 'gearworks', open: true },
  p_gearworks_bridge: { id: 'p_gearworks_bridge', from: 'gearworks', to: 'bridge', open: true },
  p_bridge_vault: {
    id: 'p_bridge_vault',
    from: 'bridge',
    to: 'vault',
    open: false,
    closedText: 'The span is cut. Nothing but cold air crosses here.',
  },
  p_hall_scriptorium: {
    id: 'p_hall_scriptorium',
    from: 'hall',
    to: 'scriptorium',
    open: false,
    hidden: true,
  },
  p_scriptorium_crypt: { id: 'p_scriptorium_crypt', from: 'scriptorium', to: 'crypt', open: true },
  p_crypt_oracle: {
    id: 'p_crypt_oracle',
    from: 'crypt',
    to: 'oracle',
    open: false,
    hidden: true,
  },
  p_hall_gate: {
    id: 'p_hall_gate',
    from: 'hall',
    to: 'gate',
    open: false,
    closedText: "The serpent corridor's throat is solid stone — misaligned, waiting.",
  },
  p_gate_heart: {
    id: 'p_gate_heart',
    from: 'gate',
    to: 'heart',
    open: false,
    hidden: true,
  },
};

export const map: MapLayout = {
  viewBox: [0, 0, 1000, 800],
  rooms: {
    entrance: { x: 500, y: 715, shape: 'square' },
    gatehouse: { x: 500, y: 585, shape: 'square' },
    hall: { x: 500, y: 430, shape: 'circle', w: 130 },
    cistern: { x: 335, y: 430, shape: 'square' },
    sluice: { x: 205, y: 505, shape: 'square' },
    gallery: { x: 215, y: 320, shape: 'square' },
    gearworks: { x: 665, y: 430, shape: 'square' },
    bridge: { x: 795, y: 505, shape: 'square' },
    vault: { x: 805, y: 330, shape: 'square' },
    scriptorium: { x: 625, y: 245, shape: 'square', w: 80, h: 80 },
    crypt: { x: 745, y: 175, shape: 'square', w: 80, h: 80 },
    oracle: { x: 860, y: 110, shape: 'square', w: 64, h: 64 },
    gate: { x: 500, y: 270, shape: 'hex', w: 100 },
    heart: { x: 500, y: 125, shape: 'circle', w: 110 },
  },
  passageWaypoints: {
    p_gallery_hall: [[390, 335]],
    p_hall_scriptorium: [[600, 360]],
  },
};
