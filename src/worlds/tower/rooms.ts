import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { windingScene, pendulumScene } from './scenes/ground.ts';
import { boilerScene, furnaceScene } from './scenes/steamwing.ts';
import { escapementScene, chimeloftScene, crawlScene } from './scenes/gallery.ts';
import { governorScene, workshopScene } from './scenes/works.ts';
import { astrolabeScene, vaultScene, domeScene } from './scenes/summit.ts';

export const rooms: Record<RoomId, RoomDef> = {
  winding: {
    id: 'winding',
    name: 'The Winding Room',
    scene: windingScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.2, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The door swings shut behind you with a click too precise to be an accident. Brass, everywhere, and no ticking. A tower this full of clocks should never be this quiet.',
      },
      { type: 'unlockJournal', entry: 'j_horo_1' },
    ],
  },
  pendulum: {
    id: 'pendulum',
    name: 'Pendulum Hall',
    scene: pendulumScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.3, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A hall built around a single hanging thing. The great pendulum waits dead centre, plumb and still, like a held breath given architecture.',
      },
    ],
  },
  boiler: {
    id: 'boiler',
    name: 'Boiler Deck',
    scene: boilerScene(),
    ambience: { drip: 0.5, torch: 0.4, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The boiler fills the deck like a sleeping animal, riveted and cold. Every gauge on the wall reads nothing at all.',
      },
    ],
  },
  furnace: {
    id: 'furnace',
    name: 'The Furnace',
    scene: furnaceScene(),
    ambience: { drip: 0.1, torch: 0.7, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The tower’s root: ash, good coal, and a firebox big enough to walk into. It is the only room so far that smells of people.',
      },
    ],
  },
  escapement: {
    id: 'escapement',
    name: 'Escapement Gallery',
    scene: escapementScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The stair delivers you through the hub of a floor that is, unmistakably, a wheel. Doorways stand around the rim — some open onto rooms, and some onto blank, patient brass.',
      },
    ],
  },
  chimeloft: {
    id: 'chimeloft',
    name: 'Chime Loft',
    scene: chimeloftScene(),
    ambience: { drip: 0.1, torch: 0.4, wind: 0.5, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Four bells hang in the draught, chains gone green. The loft has the acoustics of held applause.',
      },
    ],
  },
  crawl: {
    id: 'crawl',
    name: 'The Wall-Ways',
    scene: crawlScene(),
    ambience: { drip: 0.5, torch: 0.2, wind: 0.5, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A shoulder-wide seam between the tower’s inner and outer skins, ladder rungs vanishing up into the dark. The service ways. Someone climbed these daily, and lately, no one has.',
      },
    ],
  },
  governor: {
    id: 'governor',
    name: 'Governor Room',
    scene: governorScene(),
    ambience: { drip: 0.1, torch: 0.5, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A spindle crowned with brass arms rises through the middle of the room — the tower’s sense of moderation, seized solid, one flyball missing from its cage.',
      },
    ],
  },
  workshop: {
    id: 'workshop',
    name: "Clockwright's Workshop",
    scene: workshopScene(),
    ambience: { drip: 0.1, torch: 0.4, wind: 0.1, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A long bench, a wall of mended clocks, and the particular tidiness of someone who meant to come back. The lamp wick is trimmed. The tools are wrapped.',
      },
    ],
  },
  astrolabe: {
    id: 'astrolabe',
    name: 'Astrolabe Deck',
    scene: astrolabeScene(),
    ambience: { drip: 0, torch: 0.2, wind: 0.9, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Open night, at last — wind, rail, and the sea impossibly far below. Silver rings nest around the deck’s axis, each one a piece of sky waiting to be put back.',
      },
    ],
  },
  vault: {
    id: 'vault',
    name: 'Mainspring Vault',
    scene: vaultScene(),
    ambience: { drip: 0.1, torch: 0.3, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The vault holds one thing: a coiled ribbon of steel taller than you are, asleep in its drum. You find yourself walking softly, the way you would past any large sleeping thing.',
      },
    ],
  },
  dome: {
    id: 'dome',
    name: 'The Orrery Dome',
    scene: domeScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.6, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The summit. Under a dome of ribs and night hangs the orrery — sun-lamp cold, moon ring dropped from true, the wanderers stopped mid-step. The whole tower was only ever the stand for this.',
      },
      { type: 'unlockJournal', entry: 'j_horo_final' },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_winding_pendulum: {
    id: 'p_winding_pendulum',
    from: 'winding',
    to: 'pendulum',
    open: true,
  },
  p_pendulum_boiler: {
    id: 'p_pendulum_boiler',
    from: 'pendulum',
    to: 'boiler',
    open: true,
  },
  p_boiler_furnace: {
    id: 'p_boiler_furnace',
    from: 'boiler',
    to: 'furnace',
    open: true,
  },
  p_pendulum_escapement: {
    id: 'p_pendulum_escapement',
    from: 'pendulum',
    to: 'escapement',
    open: false,
    closedText:
      'The spiral stair rises three turns and ends at a shuttered iris of brass. Without steam, the segments above will not extend.',
  },
  p_escapement_chimeloft: {
    id: 'p_escapement_chimeloft',
    from: 'escapement',
    to: 'chimeloft',
    open: true,
    closedText:
      'Riveted rim-plate slides past where the loft door used to stand. The floor has turned on, and taken its doorways with it.',
  },
  p_escapement_governor: {
    id: 'p_escapement_governor',
    from: 'escapement',
    to: 'governor',
    open: false,
    closedText:
      'The up-stair ends at blank rim-plate — a doorway’s ghost, a hand-width out of true.',
  },
  p_chimeloft_governor: {
    id: 'p_chimeloft_governor',
    from: 'chimeloft',
    to: 'governor',
    open: false,
    hidden: true,
    closedText: 'A high hatch, painted shut, opening onto nothing at all.',
  },
  p_governor_workshop: {
    id: 'p_governor_workshop',
    from: 'governor',
    to: 'workshop',
    open: true,
  },
  p_governor_astrolabe: {
    id: 'p_governor_astrolabe',
    from: 'governor',
    to: 'astrolabe',
    open: false,
    closedText:
      'The deck stair climbs to a collar of brass, shut fast and turned out of true.',
  },
  p_astrolabe_vault: {
    id: 'p_astrolabe_vault',
    from: 'astrolabe',
    to: 'vault',
    open: false,
    closedText:
      'The vault door faces solid wall. The deck has not yet turned to meet it.',
  },
  p_vault_dome: {
    id: 'p_vault_dome',
    from: 'vault',
    to: 'dome',
    open: false,
    closedText:
      'The dome hatch is bolted by the dead spring’s pawl. Stamped on the bolt: WOUND, IT WAKES.',
  },
  p_pendulum_crawl: {
    id: 'p_pendulum_crawl',
    from: 'pendulum',
    to: 'crawl',
    open: false,
    hidden: true,
    closedText: 'A service hatch, bolted from inside the wall.',
  },
  p_crawl_astrolabe: {
    id: 'p_crawl_astrolabe',
    from: 'crawl',
    to: 'astrolabe',
    open: false,
    hidden: true,
    closedText: 'The upper hatch of the wall-ways, bolted like the rest.',
  },
};

export const map: MapLayout = {
  viewBox: [0, 0, 700, 1500],
  rooms: {
    winding: { x: 350, y: 1380, shape: 'square', w: 120 },
    pendulum: { x: 350, y: 1210, shape: 'square', w: 120 },
    boiler: { x: 555, y: 1170, shape: 'square', w: 100 },
    furnace: { x: 555, y: 1330, shape: 'square', w: 100 },
    escapement: { x: 350, y: 980, shape: 'circle', w: 150 },
    chimeloft: { x: 560, y: 920, shape: 'square', w: 90 },
    crawl: { x: 140, y: 870, shape: 'square', w: 64 },
    governor: { x: 350, y: 750, shape: 'hex', w: 110 },
    workshop: { x: 555, y: 690, shape: 'square', w: 100 },
    astrolabe: { x: 350, y: 520, shape: 'circle', w: 150 },
    vault: { x: 555, y: 460, shape: 'square', w: 100 },
    dome: { x: 350, y: 250, shape: 'circle', w: 170 },
  },
  passageWaypoints: {
    p_pendulum_crawl: [[140, 1210]],
    p_crawl_astrolabe: [[140, 520]],
    p_chimeloft_governor: [[560, 750]],
  },
};
