import type {
  MapLayout,
  PassageDef,
  PassageId,
  RoomDef,
  RoomId,
} from '../../engine/types.ts';
import { platformScene } from './scenes/platform.ts';
import { diningScene, baggageScene, engineScene } from './scenes/forward.ts';
import { corridorAScene, corridorBScene } from './scenes/corridors.ts';
import {
  fiskScene,
  vossScene,
  brandtScene,
  kohlScene,
  blaineScene,
  stasnyScene,
} from './scenes/berths.ts';
import { observationScene } from './scenes/observation.ts';

export const rooms: Record<RoomId, RoomDef> = {
  platform: {
    id: 'platform',
    name: 'Border Platform',
    scene: platformScene(),
    ambience: { drip: 0, torch: 0.15, wind: 0.9, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Vellenbruck, the border, an hour before dawn. Snow, a cordon rope, and the Sable Express standing sealed and empty — every passenger marched to the waiting hall, and one who will never leave his berth. The train is yours. Make it talk.',
      },
      { type: 'unlockJournal', entry: 'j_case_brief' },
    ],
  },
  dining: {
    id: 'dining',
    name: 'Dining Car',
    scene: diningScene(),
    ambience: { drip: 0, torch: 0.5, wind: 0.3, tone: 'mid' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Suppers gone cold under their covers, chairs pushed back mid-sentence. A carriage abandoned in good order — which is its own kind of unnerving.',
      },
    ],
  },
  baggage: {
    id: 'baggage',
    name: 'Baggage Car',
    scene: baggageScene(),
    ambience: { drip: 0.1, torch: 0.3, wind: 0.4, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Freight and mail and bonded crates, all of it breathing cold. The guard’s chalk marks are still crisp on the boards.',
      },
    ],
  },
  engine: {
    id: 'engine',
    name: 'Engine Cab',
    scene: engineScene(),
    ambience: { drip: 0, torch: 0.6, wind: 0.5, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The cab still holds its heat. Gauges tick down by the minute; the fire is banked; the crew’s tea is skinned over in its can. A locomotive waiting for orders that will not come until you find some answers.',
      },
    ],
  },
  corridor_a: {
    id: 'corridor_a',
    name: 'Sleeper A — Corridor',
    scene: corridorAScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'A panelled corridor of numbered doors. No. 1 is the colonel’s — latched from within, exactly as the border found it.',
      },
    ],
  },
  berth_fisk: {
    id: 'berth_fisk',
    name: 'Compartment No. 1',
    scene: fiskScene(),
    ambience: { drip: 0, torch: 0.3, wind: 0.1, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'You come into the famous latched room the only way anyone could have: through the wall. Under the inspector’s sheet, Colonel Auberon Fisk lies composed as a man asleep. The room is very quiet, and it is telling the truth at last.',
      },
    ],
  },
  berth_voss: {
    id: 'berth_voss',
    name: 'Compartment No. 2',
    scene: vossScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.1, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'Lavender and order. The widow’s compartment is made up like a stage set — arranged for an audience it was always expecting.',
      },
    ],
  },
  berth_brandt: {
    id: 'berth_brandt',
    name: 'Compartment No. 3',
    scene: brandtScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.1, tone: 'low' },
  },
  corridor_b: {
    id: 'corridor_b',
    name: 'Sleeper B — Corridor',
    scene: corridorBScene(),
    ambience: { drip: 0, torch: 0.4, wind: 0.2, tone: 'low' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The rear sleeper corridor, where the regulator clock keeps railway time to the half-second. At its end, the gangway to the observation car hangs chained — the shunter’s chain, waiting on a marshal order.',
      },
    ],
  },
  berth_kohl: {
    id: 'berth_kohl',
    name: 'Compartment No. 4',
    scene: kohlScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.1, tone: 'low' },
  },
  berth_blaine: {
    id: 'berth_blaine',
    name: 'Compartment No. 5',
    scene: blaineScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.1, tone: 'low' },
  },
  berth_stasny: {
    id: 'berth_stasny',
    name: 'Service Berth No. 6',
    scene: stasnyScene(),
    ambience: { drip: 0, torch: 0.35, wind: 0.1, tone: 'low' },
  },
  observation: {
    id: 'observation',
    name: 'Observation Car',
    scene: observationScene(),
    ambience: { drip: 0, torch: 0.25, wind: 0.4, tone: 'deep' },
    onFirstEnter: [
      {
        type: 'narrate',
        text: 'The observation car takes you in like held breath: velvet dark, a drawn curtain, snow-light at the glass. The porter never lit this room. Somebody preferred it that way.',
      },
    ],
  },
};

export const passages: Record<PassageId, PassageDef> = {
  p_platform_dining: {
    id: 'p_platform_dining',
    from: 'platform',
    to: 'dining',
    open: false,
    closedText:
      'A lead customs seal clamps the dining-car door — four brass tumblers, set to a minute only the border post knows.',
  },
  p_dining_baggage: {
    id: 'p_dining_baggage',
    from: 'dining',
    to: 'baggage',
    open: false,
    closedText: 'The baggage door is locked fast. Stencilled on the plate: NO ADMITTANCE WITHOUT THE GUARD’S KEY.',
  },
  p_baggage_engine: {
    id: 'p_baggage_engine',
    from: 'baggage',
    to: 'engine',
    open: false,
    closedText: 'The crate platform stands swung across the forward gangway, stacked to the ceiling. Nothing passes until it moves.',
  },
  p_dining_corra: {
    id: 'p_dining_corra',
    from: 'dining',
    to: 'corridor_a',
    open: true,
  },
  p_corra_fisk: {
    id: 'p_corra_fisk',
    from: 'corridor_a',
    to: 'berth_fisk',
    open: false,
    closedText: 'The colonel’s door does not give a hair’s breadth — the night latch is thrown home, from inside.',
  },
  p_corra_voss: {
    id: 'p_corra_voss',
    from: 'corridor_a',
    to: 'berth_voss',
    open: false,
    closedText: 'Night-bolted, like every compartment the conductor secured at the border. The bolt answers only to the service crank.',
  },
  p_corra_brandt: {
    id: 'p_corra_brandt',
    from: 'corridor_a',
    to: 'berth_brandt',
    open: true,
  },
  p_voss_fisk: {
    id: 'p_voss_fisk',
    from: 'berth_voss',
    to: 'berth_fisk',
    open: false,
    hidden: true,
    closedText: 'The mirror sits flush to the wall, giving back nothing but your own frown.',
  },
  p_corra_corrb: {
    id: 'p_corra_corrb',
    from: 'corridor_a',
    to: 'corridor_b',
    open: true,
    closedText: 'The concertina gangway hangs slack — the cars beyond it are not where they were.',
  },
  p_corrb_kohl: {
    id: 'p_corrb_kohl',
    from: 'corridor_b',
    to: 'berth_kohl',
    open: false,
    closedText: 'Night-bolted. The bolt answers only to the conductor’s service crank.',
  },
  p_corrb_blaine: {
    id: 'p_corrb_blaine',
    from: 'corridor_b',
    to: 'berth_blaine',
    open: false,
    closedText: 'Night-bolted. The bolt answers only to the conductor’s service crank.',
  },
  p_corrb_stasny: {
    id: 'p_corrb_stasny',
    from: 'corridor_b',
    to: 'berth_stasny',
    open: false,
    closedText: 'Night-bolted. The bolt answers only to the conductor’s service crank.',
  },
  p_corrb_obs: {
    id: 'p_corrb_obs',
    from: 'corridor_b',
    to: 'observation',
    open: false,
    closedText:
      'The shunter’s chain is drawn across the gangway and padlocked to the buffer — the rear cars wait on a marshal order, and the yard will not move without the section staff.',
  },
};

/**
 * A train, drawn as a train: one line of cars, compartments hung off their
 * corridors, the platform below. After the junction shunt the observation
 * car's passage re-couples amidships and the drawn line stops matching the
 * order you boarded — the waypoints dip through the siding loop to show the
 * route the cars actually took.
 */
export const map: MapLayout = {
  viewBox: [0, 0, 1000, 620],
  rooms: {
    engine: { x: 95, y: 300, shape: 'square', w: 80, h: 56 },
    baggage: { x: 230, y: 300, shape: 'square', w: 90, h: 56 },
    dining: { x: 375, y: 300, shape: 'square', w: 100, h: 56 },
    corridor_a: { x: 545, y: 300, shape: 'square', w: 110, h: 44 },
    berth_fisk: { x: 480, y: 190, shape: 'square', w: 46, h: 46 },
    berth_voss: { x: 545, y: 190, shape: 'square', w: 46, h: 46 },
    berth_brandt: { x: 610, y: 190, shape: 'square', w: 46, h: 46 },
    corridor_b: { x: 725, y: 300, shape: 'square', w: 110, h: 44 },
    berth_kohl: { x: 660, y: 410, shape: 'square', w: 46, h: 46 },
    berth_blaine: { x: 725, y: 410, shape: 'square', w: 46, h: 46 },
    berth_stasny: { x: 790, y: 410, shape: 'square', w: 46, h: 46 },
    observation: { x: 895, y: 300, shape: 'square', w: 90, h: 56 },
    platform: { x: 375, y: 470, shape: 'square', w: 170, h: 60 },
  },
  passageWaypoints: {
    // the gangway between the sleepers rides the siding loop after the shunt
    p_corra_corrb: [[635, 250]],
    p_corrb_obs: [[810, 250]],
    p_voss_fisk: [[512, 160]],
  },
};
