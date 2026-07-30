import type { ShiftDef, ShiftId } from '../../engine/types.ts';

export const shifts: Record<ShiftId, ShiftDef> = {
  // The study door — Wren's letter-lock surrenders.
  s_study: {
    id: 's_study',
    ops: [{ type: 'openPassage', passage: 'p_foyer_study' }],
    narration:
      'Three letters settle into their windows and the lock’s tongue draws back with a muffled clack. The study door swings inward on its own weight — onto stale air, drawn curtains, and a colder dark.',
    mapAnimation: 'reveal',
    animTarget: 'study',
    durationMs: 1600,
  },
  // SIGNATURE 1 — the east-wing drift lets go.
  s_drift: {
    id: 's_drift',
    ops: [
      { type: 'closePassage', passage: 'p_foyer_landing' },
      { type: 'revealPassage', passage: 'p_landing_kitchen' },
      { type: 'openPassage', passage: 'p_landing_kitchen' },
    ],
    narration:
      'A long groan overhead — then the skylight over the main stair lets go. The drift comes down in one white avalanche and packs the stairwell solid to the ceiling. When the powder settles, a narrow door stands where a wall panel used to be: the maids’ stair, dark and steep, breathing kitchen air.',
    mapAnimation: 'rumble',
    animTarget: 'landing',
    durationMs: 2800,
  },
  // SIGNATURE 2 — the pantry shelves swing open.
  s_passage: {
    id: 's_passage',
    ops: [
      { type: 'revealPassage', passage: 'p_pantry_study' },
      { type: 'openPassage', passage: 'p_pantry_study' },
    ],
    narration:
      'You lift the worn shelf-edge and the whole rack of preserves swings out on oiled hinges. A passage runs behind the paneling toward the front of the house — candle-wax on its floor, and two long scuffs the width of a pair of heels.',
    mapAnimation: 'reveal',
    animTarget: 'pantry',
    durationMs: 2000,
  },
  // The cellar padlock takes its key.
  s_cellar: {
    id: 's_cellar',
    ops: [{ type: 'openPassage', passage: 'p_kitchen_cellar' }],
    narration:
      'The padlock takes its key grudgingly and drops open. Cold air climbs the cellar stair — cold, but not so cold as the house above. Stone keeps its warmth longer than glass.',
    mapAnimation: 'reveal',
    animTarget: 'boiler',
    durationMs: 1400,
  },
  // SIGNATURE 3 — the boiler thaw reopens the conservatory.
  s_thaw: {
    id: 's_thaw',
    ops: [{ type: 'openPassage', passage: 'p_parlor_conservatory' }],
    narration:
      'Deep under the floor the boiler takes its first full breath in days, and the pipes knock awake one by one down the west wall like counted knuckles. In the parlor, the frost sheeting the conservatory door blushes, weeps, and lets go of the frame.',
    mapAnimation: 'reveal',
    animTarget: 'conservatory',
    durationMs: 2600,
  },
  // The pane falls — the glass house seals its parlor door and bares the service door.
  s_pane: {
    id: 's_pane',
    ops: [
      { type: 'closePassage', passage: 'p_parlor_conservatory' },
      { type: 'revealPassage', passage: 'p_conservatory_kitchen' },
      { type: 'openPassage', passage: 'p_conservatory_kitchen' },
    ],
    narration:
      'Heat works fast on burdened glass. Behind you a pane cracks like a rifle-shot and the snow above it slumps through, burying the parlor door in glittering rubble. Across the beds, sweating out of its frost among the orchids, a service door to the kitchen passage stands plain.',
    mapAnimation: 'rumble',
    animTarget: 'conservatory',
    durationMs: 2400,
  },
};
