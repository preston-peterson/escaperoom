import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  master_keys: {
    id: 'master_keys',
    name: "Craik's Master Keys",
    description:
      "The stage manager's ring — pass door, trap room, dressing rooms, the author's box, and one small bright key with no tag at all.",
    icon: 'glint',
  },
  crank_handle: {
    id: 'crank_handle',
    name: 'Trap Winch Crank',
    description:
      'A forged iron crank, shelf-worn and heavy. Stamped on the shank: TRAP 3 — RETURN TO PROPS.',
    icon: 'gear',
  },
  prop_knife: {
    id: 'prop_knife',
    name: 'The Knife from the Prop Tray',
    description:
      'It should be tin with a collapsing blade. It is not. It is steel, and it has never been used.',
    icon: 'lever',
  },
  letters: {
    id: 'letters',
    name: "Marlowe's Letters",
    description:
      'A ribbon-bound bundle of furious correspondence, found in the dead man\'s dressing room. "You will not survive another opening night."',
    icon: 'paperScrap',
  },
  stage_token: {
    id: 'stage_token',
    name: 'Doorkeeper\'s Token',
    description:
      'A worn brass token from inside the ghost light\'s base: THE CORONET — STAGE DOOR — No. 1. Forty years of thumbs have polished it bright.',
    icon: 'glint',
  },
};
