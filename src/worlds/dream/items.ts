import type { ItemDef, ItemId } from '../../engine/types.ts';

/**
 * The portable contents of a dream. Four of these are "ideas" — the raw
 * material a room is finished with — and are consumed by the Half-Drawn Room.
 */
export const items: Record<ItemId, ItemDef> = {
  idea_name: {
    id: 'idea_name',
    name: 'A Remembered Name',
    description:
      'Warm, slight, and certain: the name SERELLE, kept the way one hand keeps another. It weighs nothing. You are careful with it anyway.',
    icon: 'glint',
  },
  idea_rain: {
    id: 'idea_rain',
    name: 'The Smell of Rain',
    description:
      'Grey-sweet and arriving, folded like a handkerchief. It smells the way remembering feels.',
    icon: 'fog',
  },
  idea_hour: {
    id: 'idea_hour',
    name: 'A Kept Hour',
    description:
      'One hour, folded warm and ticking contentedly to itself. It does not care what time it is. It is the time.',
    icon: 'clockFace',
  },
  idea_fear: {
    id: 'idea_fear',
    name: 'A Fear, Folded Small',
    description:
      'A soft dark square, folded and refolded until it fits in a pocket. It weighs exactly as much as you let it.',
    icon: 'tree',
  },
  stub_pencil: {
    id: 'stub_pencil',
    name: "The Draughtsman's Pencil",
    description:
      'Worn to a stub in the middle and sharpened at both ends — one end for drawing things into being, the other, you suspect, for taking them back.',
    icon: 'lever',
  },
  photograph: {
    id: 'photograph',
    name: 'The Photograph',
    description:
      "A woman asleep in a chair by a window, pencil still in her hand, drawings on her lap. On the back, in pencil: 'me, before.'",
    icon: 'glyphPanel',
  },
};
