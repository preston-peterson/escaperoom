import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { lobbyScene, houseScene, stageScene } from './scenes/front.ts';
import { promptScene, propsScene, rigScene } from './scenes/backstage.ts';
import {
  understudyScene,
  starScene,
  rivalScene,
  writersScene,
} from './scenes/dressing.ts';
import { understageScene, flyScene } from './scenes/depths.ts';

export const rooms: Record<RoomId, RoomDef> = {
  lobby: {
    id: 'lobby',
    name: 'Grand Lobby',
    scene: lobbyScene(),
    ambience: { drip: 0, torch: 0.5, wind: 0.2, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Every lamp in the lobby still burns. Opening night ended four hours ago with a scream instead of applause, and nobody has come back — not for the coats, not for the takings, not for him.',
      },
    ],
  },
  house: {
    id: 'house',
    name: 'The House',
    scene: houseScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.4, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Six hundred seats face a curtain the color of a held breath. On the apron in front of it, one bare bulb burns on a pole — the ghost light, keeping the only vigil this building knows how to keep.',
      },
    ],
  },
  stage: {
    id: 'stage',
    name: 'The Stage',
    scene: stageScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.5, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The Act III set stands ready and will stand ready forever. Downstage center, a rectangle of deck sits subtly proud of its fellows: the trap. You do not step on it. Nobody will ever step on it again.',
      },
    ],
  },
  prompt_corner: {
    id: 'prompt_corner',
    name: 'Prompt Corner',
    scene: promptScene(),
    ambience: { drip: 0, torch: 0.5, wind: 0.2, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The wings smell of rope and hot dust. Here is the true bridge of the ship: the prompt desk, the cue board, thirty years of order — abandoned mid-performance with the stopwatch still running.',
      },
    ],
  },
  props_room: {
    id: 'props_room',
    name: 'Props Room',
    scene: propsScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.1, tone: 'mid' },
  },
  dressing_understudy: {
    id: 'dressing_understudy',
    name: "Understudy's Alcove",
    scene: understudyScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.2, tone: 'mid' },
  },
  dressing_star: {
    id: 'dressing_star',
    name: "Star Dressing Room",
    scene: starScene(),
    ambience: { drip: 0, torch: 0.5, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Powder still hangs in the air. Grease paint sits open on the table, one cheek\'s worth used; the kettle has boiled itself dry. A room stopped mid-sentence.',
      },
    ],
  },
  dressing_rival: {
    id: 'dressing_rival',
    name: "Rival's Dressing Room",
    scene: rivalScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The revolve door swings shut behind you on a stage-right room no corridor reaches. Pins lie scattered where two people dropped everything at once.',
      },
    ],
  },
  writers_office: {
    id: 'writers_office',
    name: "The Author's Box",
    scene: writersScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A private box above the house, half study, half throne of exile. From this chair the author watched other people be applauded for her sentences.',
      },
    ],
  },
  rig_shop: {
    id: 'rig_shop',
    name: 'Rig Shop',
    scene: rigScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.3, tone: 'mid' },
  },
  understage: {
    id: 'understage',
    name: 'Understage',
    scene: understageScene(),
    ambience: { drip: 0.4, torch: 0.3, wind: 0.2, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Cold, low, honest: rails and drums and dust. A constable\'s lantern was left burning beside the chalk, as if the law itself could not bear to leave him in the dark.',
      },
    ],
  },
  fly_gallery: {
    id: 'fly_gallery',
    name: 'Fly Gallery',
    scene: flyScene(),
    ambience: { drip: 0, torch: 0.2, wind: 0.7, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A catwalk above the lights, strung with lines like the rigging of a landlocked ship. Below, the stage lies drawn to scale. Everyone down there watched the trap. Nobody looked up. Murderers count on that.',
      },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_lobby_house: {
    id: 'p_lobby_house',
    from: 'lobby',
    to: 'house',
    open: false,
    closedText: 'A chain has been run through the door handles — four numbered wheels, waiting.',
  },
  p_house_stage: {
    id: 'p_house_stage',
    from: 'house',
    to: 'stage',
    open: false,
    closedText: 'The pass door holds fast. Its brass letter-lock wants the house word.',
  },
  p_house_box: {
    id: 'p_house_box',
    from: 'house',
    to: 'writers_office',
    open: false,
    closedText: 'The box door is locked. A small neat plate: PRIVATE — THE AUTHOR.',
  },
  p_stage_prompt: {
    id: 'p_stage_prompt',
    from: 'stage',
    to: 'prompt_corner',
    open: true,
  },
  // The revolve door: remapped by the revolve to the stage-right room.
  p_revolve_door: {
    id: 'p_revolve_door',
    from: 'stage',
    to: 'dressing_understudy',
    open: false,
    closedText: 'The upstage door will not budge. A plate on the frame: INTERLOCKED WHILE CURTAIN IS IN.',
  },
  p_trapdoor: {
    id: 'p_trapdoor',
    from: 'stage',
    to: 'understage',
    open: false,
    closedText: 'The trap is latched fast, its winch stripped of everything a hand could turn.',
  },
  p_pit_hatch: {
    id: 'p_pit_hatch',
    from: 'house',
    to: 'understage',
    open: false,
    hidden: true,
    closedText: 'The pit hatch is dogged shut from below.',
  },
  p_understage_stair: {
    id: 'p_understage_stair',
    from: 'prompt_corner',
    to: 'understage',
    open: false,
    closedText: 'The trap-room door is bolted. A brass plate: TRAP ROOM — COMPANY ONLY.',
  },
  p_prompt_props: {
    id: 'p_prompt_props',
    from: 'prompt_corner',
    to: 'props_room',
    open: true,
  },
  p_prompt_understudy: {
    id: 'p_prompt_understudy',
    from: 'prompt_corner',
    to: 'dressing_understudy',
    open: true,
  },
  p_understudy_star: {
    id: 'p_understudy_star',
    from: 'dressing_understudy',
    to: 'dressing_star',
    open: false,
    closedText: "The star's door is locked, of course. Stars lock; the building keeps the keys.",
  },
  p_prompt_rig: {
    id: 'p_prompt_rig',
    from: 'prompt_corner',
    to: 'rig_shop',
    open: true,
  },
  p_rig_fly: {
    id: 'p_rig_fly',
    from: 'rig_shop',
    to: 'fly_gallery',
    open: false,
    closedText: 'A steel gate dogs the gallery ladder, padlocked at head height. The padlock is city-made and new.',
  },
};

export const map: MapLayout = {
  viewBox: [0, 0, 1000, 800],
  rooms: {
    // Above: the fly gallery.
    fly_gallery: { x: 555, y: 120, shape: 'square', w: 250, h: 54 },
    // Stage level.
    lobby: { x: 85, y: 480, shape: 'square' },
    house: { x: 250, y: 480, shape: 'square', w: 120, h: 120 },
    writers_office: { x: 250, y: 320, shape: 'square', w: 70, h: 70 },
    stage: { x: 475, y: 480, shape: 'hex', w: 110 },
    prompt_corner: { x: 645, y: 480, shape: 'square' },
    props_room: { x: 810, y: 560, shape: 'square', w: 76, h: 76 },
    rig_shop: { x: 810, y: 400, shape: 'square' },
    dressing_understudy: { x: 645, y: 320, shape: 'square', w: 80, h: 80 },
    dressing_star: { x: 790, y: 245, shape: 'square', w: 76, h: 76 },
    dressing_rival: { x: 460, y: 320, shape: 'square', w: 80, h: 80 },
    // Below: the understage.
    understage: { x: 475, y: 660, shape: 'square', w: 140, h: 76 },
  },
  passageWaypoints: {
    p_rig_fly: [[810, 120]],
    p_pit_hatch: [[290, 660]],
    p_understage_stair: [[645, 660]],
    p_house_box: [[250, 400]],
  },
};
