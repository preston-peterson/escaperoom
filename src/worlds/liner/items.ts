import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  office_key: {
    id: 'office_key',
    name: 'Spare Office Key',
    description:
      "The master-at-arms' spare to the purser's office, cold from the key box.",
    icon: 'glint',
  },
  cabin_key: {
    id: 'cabin_key',
    name: 'Stateroom Twelve Key',
    description: 'A brass cabin key on a numbered fob: 12.',
    icon: 'glint',
  },
  torn_button: {
    id: 'torn_button',
    name: 'Torn Cuff Button',
    description:
      "A brass button with a scrap of thread still through the shank, found snagged at the promenade rail. Stewards' pattern.",
    icon: 'glint',
  },
  manifest_page: {
    id: 'manifest_page',
    name: 'Manifest Page',
    description:
      'A page torn from the cargo manifest, its consignment column written in bill-of-lading code.',
    icon: 'paperScrap',
  },
  dumbwaiter_crank: {
    id: 'dumbwaiter_crank',
    name: 'Dumbwaiter Crank',
    description:
      "The galley dumbwaiter's crank handle, wrapped in a rag and hidden where no cook would ever leave it.",
    icon: 'lever',
  },
  cargo_hook: {
    id: 'cargo_hook',
    name: 'Cargo Hook',
    description: "A stevedore's hand hook — good leverage against a nailed lid.",
    icon: 'gear',
  },
};
