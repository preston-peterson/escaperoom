import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  oil_flask: {
    id: 'oil_flask',
    name: "Porter's Oil",
    description: 'A dented flask of clock oil, still sweet. The porter kept the ground floor honest.',
    icon: 'glint',
  },
  governor_weight: {
    id: 'governor_weight',
    name: 'Governor Flyball',
    description: 'A brass sphere, heavy as a grudge, fished dripping from the condenser pool.',
    icon: 'gear',
  },
  mainspring_key: {
    id: 'mainspring_key',
    name: 'The Great Winding Key',
    description: 'A square-shanked key as long as your forearm. There has only ever been one.',
    icon: 'lever',
  },
  pocket_watch: {
    id: 'pocket_watch',
    name: "The Horologist's Watch",
    description: 'Run down at six minutes to midnight, like every dial in the tower. Engraved inside the case.',
    icon: 'clockFace',
  },
};
