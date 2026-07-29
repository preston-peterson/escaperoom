import type { ShiftDef, ShiftId } from '../../engine/types.ts';

export const shifts: Record<ShiftId, ShiftDef> = {
  s_cottage: {
    id: 's_cottage',
    ops: [{ type: 'openPassage', passage: 'p_square_cottage' }],
    narration:
      "The lock gives grudgingly, a generation of salt in its throat. The keeper's door swings inward onto held breath.",
    mapAnimation: 'reveal',
    animTarget: 'cottage',
    durationMs: 1200,
  },
  s_hatch: {
    id: 's_hatch',
    ops: [{ type: 'openPassage', passage: 'p_lighthouse_lantern' }],
    narration:
      'Five glyphs flare pale as foam, and the hatch bolts draw themselves back with the sound of a ship easing at anchor.',
    mapAnimation: 'reveal',
    animTarget: 'lantern',
    durationMs: 1400,
  },
  s_wardendoor: {
    id: 's_wardendoor',
    ops: [{ type: 'openPassage', passage: 'p_square_engine' }],
    narration:
      'Somewhere under the square, counterweights the size of coffins descend. The Warden door swings open on a stair going down, exhaling cold air and the smell of wet bronze.',
    mapAnimation: 'reveal',
    animTarget: 'enginehall',
    durationMs: 1600,
  },
  // SHIFT — The Bay Breathes Out (low tide)
  s_ebb: {
    id: 's_ebb',
    ops: [
      { type: 'revealPassage', passage: 'p_dock_seacave' },
      { type: 'openPassage', passage: 'p_dock_seacave' },
    ],
    narration:
      'The peal rolls out over the water, and something vast answers it. Chains groan in the cliff like a ship straining her moorings — and the whole bay leans seaward and breathes out. Water slides back and back, laying the harbor bare: black mud, stranded weed, the skiff heeled over on her side — and at the foot of the cliff, a cave mouth the sea has been keeping to itself.',
    mapAnimation: 'rumble',
    animTarget: 'dock',
    durationMs: 2800,
  },
  // SHIFT — The Bay Breathes In (the flood, and the way down)
  s_flood: {
    id: 's_flood',
    ops: [
      { type: 'closePassage', passage: 'p_dock_seacave' },
      { type: 'revealPassage', passage: 'p_engine_undergate' },
      { type: 'openPassage', passage: 'p_engine_undergate' },
    ],
    narration:
      'The bay breathes in. The sea comes home in one long green shoulder, swallowing the mudflat, lifting the skiff, filling the cave to its roof — and the tide-wheel takes the weight of all of it. The engine turns. The floor shivers, and beneath the great wheel a stair uncoils into the dark, streaming.',
    mapAnimation: 'rumble',
    animTarget: 'enginehall',
    durationMs: 3200,
  },
};
