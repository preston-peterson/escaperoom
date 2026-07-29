import type { ShiftDef, ShiftId } from '../../engine/types.ts';

export const shifts: Record<ShiftId, ShiftDef> = {
  s_gatehouse: {
    id: 's_gatehouse',
    ops: [{ type: 'openPassage', passage: 'p_gatehouse_hall' }],
    narration: 'Four glyphs flare amber. The slab shudders, and sinks into the floor.',
    mapAnimation: 'reveal',
    durationMs: 1400,
  },
  // SHIFT 1 — The Drowned Door
  s_drowned: {
    id: 's_drowned',
    ops: [
      { type: 'openPassage', passage: 'p_cistern_gallery' },
      { type: 'openPassage', passage: 'p_gallery_hall' },
    ],
    narration:
      'The sluices groan. Somewhere below, a great weight of water thunders away into the dark — and when the roar fades, the drowned door stands dripping, and open.',
    mapAnimation: 'reveal',
    animTarget: 'gallery',
    durationMs: 2400,
  },
  s_bridge: {
    id: 's_bridge',
    ops: [{ type: 'openPassage', passage: 'p_bridge_vault' }],
    narration: 'The rope pulls taut around the ancient anchor ring. It holds. It will have to.',
    mapAnimation: 'reveal',
    animTarget: 'vault',
    durationMs: 1400,
  },
  // SHIFT 2 — The Hall Turns
  s_hall_turns: {
    id: 's_hall_turns',
    ops: [
      { type: 'closePassage', passage: 'p_hall_cistern' },
      { type: 'openPassage', passage: 'p_hall_scriptorium' },
      { type: 'openPassage', passage: 'p_hall_gate' },
    ],
    narration:
      'The Hall of Echoes turns. Stone grinds on stone as the whole chamber rotates — doorways wheeling past like the face of a great clock — and settles with a boom you feel in your teeth. The west door is gone. Two new mouths stand open in the dark.',
    mapAnimation: 'rotate',
    animTarget: 'hall',
    animDegrees: 90,
    durationMs: 2800,
  },
  s_oracle: {
    id: 's_oracle',
    ops: [{ type: 'openPassage', passage: 'p_crypt_oracle' }],
    narration:
      'The crack widens into a doorway no broader than a shoulder. Cold air breathes out, carrying the smell of old paper.',
    mapAnimation: 'reveal',
    animTarget: 'oracle',
    durationMs: 1600,
  },
  // SHIFT 3 — The Maze Inhales
  s_serpent: {
    id: 's_serpent',
    ops: [
      { type: 'openPassage', passage: 'p_gate_heart' },
      { type: 'closePassage', passage: 'p_hall_gate' },
    ],
    narration:
      "The serpent's jaw unhinges, stone scales rippling aside. Behind you, the corridor closes like a throat. The maze inhales — and the way onward is the only way.",
    mapAnimation: 'slide',
    animTarget: 'gate',
    durationMs: 3000,
  },
};
