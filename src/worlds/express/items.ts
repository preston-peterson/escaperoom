import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  baggage_key: {
    id: 'baggage_key',
    name: "Guard's Key",
    description:
      'A heavy brass key on a leather fob stencilled BAGGAGE. Left behind in the guard’s greatcoat when the cordon closed.',
    icon: 'glint',
  },
  pass_key: {
    id: 'pass_key',
    name: "Conductor's Pass Key",
    description:
      'The square-shanked pass key of the Sable Express, surrendered to the pantry cage at the border. It turns every service lock on the train.',
    icon: 'glint',
  },
  section_staff: {
    id: 'section_staff',
    name: 'Section Staff',
    description:
      'A polished brass staff, the single-line token for the border section. No shunt order is valid without it in the frame.',
    icon: 'lever',
  },
  trimmed_lamp: {
    id: 'trimmed_lamp',
    name: 'Trimmed Lamp',
    description:
      'A porter’s paraffin lamp, freshly trimmed and burning steady. Small enough to seat in any saloon bracket.',
    icon: 'chandelier',
  },
  telegram: {
    id: 'telegram',
    name: 'The Midnight Telegram',
    description:
      'A telegram form summoning Colonel Fisk to the observation car at midnight. The paper is right. Something about the hand is not.',
    icon: 'paperScrap',
  },
  voss_letter: {
    id: 'voss_letter',
    name: "Mrs. Voss's Letter",
    description:
      'A letter in a widow’s careful hand — outwardly from a sister, oddly stiff in its phrasing, with a postscript about house numbers.',
    icon: 'paperScrap',
  },
};
