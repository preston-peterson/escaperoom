import type { ShiftDef, ShiftId } from '../../engine/types.ts';

export const shifts: Record<ShiftId, ShiftDef> = {
  s_office: {
    id: 's_office',
    ops: [{ type: 'openPassage', passage: 'p_prom_office' }],
    narration:
      "The spare key turns hard, then all at once. The purser's office breathes out ink, brass polish, and something anxious underneath.",
    mapAnimation: 'reveal',
    animTarget: 'pursers_office',
    durationMs: 1200,
  },
  s_cabin: {
    id: 's_cabin',
    ops: [{ type: 'openPassage', passage: 'p_corridor_cabin' }],
    narration:
      'The key with the numbered fob slides home. Stateroom Twelve opens onto held breath — a room stopped mid-evening, waiting for someone who never came back.',
    mapAnimation: 'reveal',
    animTarget: 'marguerite_cabin',
    durationMs: 1400,
  },
  // The watertight doors cycle — one corridor closes, another opens.
  s_bulkhead: {
    id: 's_bulkhead',
    ops: [
      { type: 'closePassage', passage: 'p_stair_galley' },
      { type: 'openPassage', passage: 'p_stair_engine' },
      { type: 'openPassage', passage: 'p_galley_engine' },
    ],
    narration:
      'A klaxon coughs twice somewhere below, and the watertight doors cycle in drill order — the galley corridor swings shut with a boom you feel through your shoes, and the engine-room door undogs itself, one iron petal at a time.',
    mapAnimation: 'slide',
    animTarget: 'engine_room',
    durationMs: 2600,
  },
  // The ship's slow list reopens the jammed starboard promenade door.
  s_list: {
    id: 's_list',
    ops: [{ type: 'openPassage', passage: 'p_prom_suite' }],
    narration:
      'The deck tilts another slow degree — the sea sliding higher past the portholes — and far above, a warped door sighs out of its frame. The starboard promenade door is jammed no longer.',
    mapAnimation: 'rumble',
    animTarget: 'vivienne_suite',
    durationMs: 2200,
  },
  s_hatch: {
    id: 's_hatch',
    ops: [{ type: 'openPassage', passage: 'p_winch_hold' }],
    narration:
      "Three emblems stand crowned, and the stevedore's rings fall slack. The hold hatch swings up on counterweights, exhaling cold air and tarred rope.",
    mapAnimation: 'reveal',
    animTarget: 'cargo_hold',
    durationMs: 1800,
  },
  s_dumbwaiter: {
    id: 's_dumbwaiter',
    ops: [{ type: 'openPassage', passage: 'p_galley_hold' }],
    narration:
      'The crank seats, the counterweights take up their rattle, and the dumbwaiter car rises out of the dark — a quiet little road between the galley and the hold that never once passes the watch station.',
    mapAnimation: 'reveal',
    animTarget: 'galley',
    durationMs: 2000,
  },
};
