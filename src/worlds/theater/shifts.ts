import type { ShiftDef, ShiftId } from '../../engine/types.ts';

/**
 * The Coronet performs its own scene changes. Every topology change in the
 * case is a piece of working stagecraft: doors, curtain, revolve, traps.
 */
export const shifts: Record<ShiftId, ShiftDef> = {
  s_house_doors: {
    id: 's_house_doors',
    ops: [{ type: 'openPassage', passage: 'p_lobby_house' }],
    narration:
      'The four wheels align and the chain slithers to the carpet. The house doors swing open on six hundred empty seats, every one of them facing you.',
    mapAnimation: 'reveal',
    animTarget: 'house',
    durationMs: 1400,
  },
  s_pass_door: {
    id: 's_pass_door',
    ops: [{ type: 'openPassage', passage: 'p_house_stage' }],
    narration:
      "The letter-lock takes the Lady's name and gives up the pass door. Beyond it: the smell of size paint, hot dust, and something like held breath.",
    mapAnimation: 'reveal',
    animTarget: 'stage',
    durationMs: 1400,
  },
  // The great curtain rises — and releases the revolve interlock.
  s_curtain: {
    id: 's_curtain',
    ops: [{ type: 'openPassage', passage: 'p_revolve_door' }],
    narration:
      'Somewhere aloft, sheaves begin to sing. The great curtain gathers itself and RISES — acres of velvet going up into the dark — and under your feet a bolt you never saw disengages. The revolve interlock is off. The stage is live.',
    mapAnimation: 'slide',
    animTarget: 'stage',
    durationMs: 2800,
  },
  // Craik's master keys: three backstage locks answer at once.
  s_master_keys: {
    id: 's_master_keys',
    ops: [
      { type: 'openPassage', passage: 'p_understage_stair' },
      { type: 'openPassage', passage: 'p_understudy_star' },
      { type: 'openPassage', passage: 'p_house_box' },
    ],
    narration:
      "You lift the stage manager's ring from its hook and the building folds open: the trap-room bolt, the star's door, the author's box. Every lock in the Coronet answers her.",
    mapAnimation: 'reveal',
    animTarget: 'prompt_corner',
    durationMs: 1800,
  },
  s_fly_gate: {
    id: 's_fly_gate',
    ops: [{ type: 'openPassage', passage: 'p_rig_fly' }],
    narration:
      "The small untagged key turns the gallery padlock like it was oiled yesterday. Barrow's own key hangs on its nail behind you, wearing a season of dust.",
    mapAnimation: 'reveal',
    animTarget: 'fly_gallery',
    durationMs: 1600,
  },
  // The revolve — the building performs a scene change around you.
  s_revolve: {
    id: 's_revolve',
    ops: [{ type: 'remapPassage', passage: 'p_revolve_door', to: 'dressing_rival' }],
    narration:
      'The deck shudders and the whole stage TURNS — flats wheeling past like the pages of a book — and grinds home. The upstage door is still upstage. Everything behind it is somewhere else now.',
    mapAnimation: 'rotate',
    animTarget: 'stage',
    animDegrees: 180,
    durationMs: 3000,
  },
  // The traps run — and the ghost light dies.
  s_traps: {
    id: 's_traps',
    ops: [
      { type: 'openPassage', passage: 'p_trapdoor' },
      { type: 'openPassage', passage: 'p_pit_hatch' },
    ],
    narration:
      'The winch takes the crank and the trap runs home along its rails, open to the stage above. And overhead the light changes: the ghost light\'s cable, pinched in the runners, gives out. Somewhere past the proscenium the house goes black — except for a thin seam of lamplight around a hatch at the pit rail.',
    mapAnimation: 'rumble',
    animTarget: 'understage',
    durationMs: 2400,
  },
};
