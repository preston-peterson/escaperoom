import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  unlit_torch: {
    id: 'unlit_torch',
    name: 'Unlit Torch',
    description: 'Pitch-wrapped and dry, waiting for a flame.',
    icon: 'torch',
  },
  torch: {
    id: 'torch',
    name: 'Burning Torch',
    description: 'Your circle of light in the dark below.',
    icon: 'torch',
  },
  rope: {
    id: 'rope',
    name: 'Coil of Rope',
    description: 'Old but sound. The Gatehouse keeper kept good stores.',
    icon: 'rubble',
  },
  bronze_gear: {
    id: 'bronze_gear',
    name: 'Bronze Gear',
    description: 'Heavy, toothed, green with age. It belongs on an axle.',
    icon: 'gear',
  },
  sigil_water: {
    id: 'sigil_water',
    name: 'Water Sigil',
    description: 'A palm-sized stone disc carved with a cresting wave.',
    icon: 'glint',
  },
  sigil_gear: {
    id: 'sigil_gear',
    name: 'Gear Sigil',
    description: 'A palm-sized stone disc carved with an eight-toothed wheel.',
    icon: 'glint',
  },
  sigil_glyph: {
    id: 'sigil_glyph',
    name: 'Glyph Sigil',
    description: "A palm-sized stone disc carved with the Builders' first letter.",
    icon: 'glint',
  },
  builders_coin: {
    id: 'builders_coin',
    name: "Builder's Coin",
    description: 'A worn bronze coin. On one face, the labyrinth; on the other, a heartbeat.',
    icon: 'glint',
  },
};
