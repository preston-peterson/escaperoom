import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  cottage_key: {
    id: 'cottage_key',
    name: 'Orchard Key',
    description: 'Iron gone orange with rust, hidden where the plums ripened first.',
    icon: 'glint',
  },
  eng_impeller: {
    id: 'eng_impeller',
    name: 'Bronze Impeller',
    description: 'A four-bladed heart for the tide-wheel, heavy as a sleeping cat.',
    icon: 'gear',
  },
  eng_valve: {
    id: 'eng_valve',
    name: 'Regulator Wheel',
    description: "The engine's small brass helm. Maren kept it on her mantel — a trophy, or a promise.",
    icon: 'pipes',
  },
  eng_weight: {
    id: 'eng_weight',
    name: 'Governor Weight',
    description: 'A dense little pendulum bob, stamped with the Warden wave.',
    icon: 'glint',
  },
  maren_lantern: {
    id: 'maren_lantern',
    name: "Maren's Lantern",
    description: 'Storm-glass and salt-pitted tin. The wick is trimmed, waiting.',
    icon: 'torch',
  },
  warden_token: {
    id: 'warden_token',
    name: 'Warden Token',
    description: 'A sea-worn disc from the harbor mud. On one face a wave; on the other, a closed eye.',
    icon: 'glint',
  },
};
