import type { ItemDef, ItemId } from '../../engine/types.ts';

export const items: Record<ItemId, ItemDef> = {
  cellar_key: {
    id: 'cellar_key',
    name: 'Cellar Key',
    description:
      'A heavy cold-store key from Wren’s dispatch box. He trusted the cellar to no chatelaine but his own.',
    icon: 'glint',
  },
  brass_cylinder: {
    id: 'brass_cylinder',
    name: 'Brass Cylinder',
    description:
      'The pinned heart of a music box, confiscated to a desk drawer. It still smells faintly of machine oil.',
    icon: 'gear',
  },
  stoker_handle: {
    id: 'stoker_handle',
    name: 'Stoker Handle',
    description:
      'A long iron handle for the boiler’s stoking bracket, found exiled among the pantry mops.',
    icon: 'lever',
  },
  valve_wheel: {
    id: 'valve_wheel',
    name: 'Valve Wheel',
    description:
      'The boiler’s brass feed-valve wheel, lately employed as a poet’s paperweight.',
    icon: 'gear',
  },
  vestas: {
    id: 'vestas',
    name: 'Tin of Vestas',
    description:
      'Mrs. Tabb’s strike-anywhere matches, kept dry and counted like everything else she owned.',
    icon: 'torch',
  },
};
