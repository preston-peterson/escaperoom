import type { ShiftDef, ShiftId } from '../../engine/types.ts';

/**
 * Every topology change is the railway doing what railways do: seals cut,
 * bolts drawn, crates swung, cars re-marshalled. The signature move is
 * s_junction — the border shunt that pulls the rear cars apart and couples
 * them back in a new order, so the map itself stops matching the train
 * you boarded.
 */
export const shifts: Record<ShiftId, ShiftDef> = {
  s_cordon: {
    id: 's_cordon',
    ops: [{ type: 'openPassage', passage: 'p_platform_dining' }],
    narration:
      'The four tumblers seat with a click and the lead seal drops into your palm, still cold. The dining-car door swings inward on a carriage full of held breath.',
    mapAnimation: 'reveal',
    animTarget: 'dining',
    durationMs: 1400,
  },
  s_baggage_door: {
    id: 's_baggage_door',
    ops: [{ type: 'openPassage', passage: 'p_dining_baggage' }],
    narration:
      'The guard’s key turns twice against the spring. You leave it standing in the lock, the way the guard would have, and the baggage door rolls back on its runners.',
    mapAnimation: 'reveal',
    animTarget: 'baggage',
    durationMs: 1400,
  },
  s_crate_swing: {
    id: 's_crate_swing',
    ops: [{ type: 'openPassage', passage: 'p_baggage_engine' }],
    narration:
      'The transfer brake lets go with a bang. The crate platform swings its whole freight sideways on greased rails — the forward gangway stands clear, and something oilcloth-wrapped is wedged in the works beneath.',
    mapAnimation: 'slide',
    animTarget: 'baggage',
    durationMs: 2000,
  },
  s_nightbolts: {
    id: 's_nightbolts',
    ops: [
      { type: 'openPassage', passage: 'p_corra_voss' },
      { type: 'openPassage', passage: 'p_corrb_kohl' },
      { type: 'openPassage', passage: 'p_corrb_blaine' },
      { type: 'openPassage', passage: 'p_corrb_stasny' },
    ],
    narration:
      'The pass key frees the service crank, and one long turn draws the night-bolts the length of both sleeper cars — a run of small steel voices, door after door, like a train counting its own teeth.',
    mapAnimation: 'reveal',
    animTarget: 'corridor_a',
    durationMs: 2200,
  },
  s_panel: {
    id: 's_panel',
    ops: [{ type: 'openPassage', passage: 'p_voss_fisk' }],
    narration:
      'Seven, three, five. The third ring seats and the mirror swings away from the wall on hinges that have never been let squeak — opening, without apology, into the dead man’s berth.',
    mapAnimation: 'reveal',
    animTarget: 'berth_fisk',
    durationMs: 1800,
  },
  s_unlatch: {
    id: 's_unlatch',
    ops: [{ type: 'openPassage', passage: 'p_corra_fisk' }],
    narration:
      'You slide the night latch the way the killer must have left it — from inside, with two fingers, without a sound. The famous latched door opens onto the corridor as if it had never held a mystery at all.',
    mapAnimation: 'reveal',
    animTarget: 'corridor_a',
    durationMs: 1400,
  },
  // SIGNATURE: the junction decoupling. The unseen yard engine draws the rear
  // cars onto the siding loop and couples them back in a new order — the
  // observation car now rides between the two sleeper corridors, and the map
  // stops matching the train you boarded.
  s_junction: {
    id: 's_junction',
    ops: [
      { type: 'closePassage', passage: 'p_corra_corrb' },
      { type: 'remapPassage', passage: 'p_corra_corrb', to: 'observation' },
      { type: 'openPassage', passage: 'p_corra_corrb' },
      { type: 'openPassage', passage: 'p_corrb_obs' },
    ],
    narration:
      'The staff seats in the order-frame and somewhere beyond the fog a yard engine answers. Couplings part with a shudder you feel through your boots; cars roll past unseen on the siding loop, buffer to buffer — and come back together WRONG. When the train settles, the observation car rides amidships, coupled where the sleeper gangway used to be, and the shunter’s chain lies in the snow.',
    mapAnimation: 'slide',
    animTarget: 'observation',
    animDegrees: 0,
    durationMs: 3200,
  },
};
