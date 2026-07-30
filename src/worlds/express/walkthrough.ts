import type { GameAction } from '../../engine/types.ts';

/**
 * The complete solution as a replayable action script — the golden
 * walkthrough. It visits every car, fills the whole case file, finds both
 * secrets, fires all seven shifts, and files the accusation correctly on the
 * first attempt. The solvability test replays it through the real reducer.
 *
 * Note the tail: after the junction shunt, the walk back to the platform
 * crosses p_corra_corrb from the OBSERVATION car — the passage's remapped
 * endpoint — proving the re-marshalled train is the one being traversed.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'express', mode: 'relaxed', at: at() },

    // Border platform: the case, the suspects, the guard's key, the seal
    { type: 'INTERACT', hotspot: 'notice', at: at() },
    { type: 'INTERACT', hotspot: 'manifest', at: at() },
    { type: 'INTERACT', hotspot: 'guard_coat', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_cordon',
      submission: { type: 'combination', values: ['0', '4', '1', '7'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_platform_dining', at: at() },

    // Dining car: the bell-board yields the conductor's pass key
    { type: 'INTERACT', hotspot: 'call_slate', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_bells',
      submission: { type: 'sequence', order: ['b5', 'b2', 'b1', 'b4'] },
      at: at(),
    },
    { type: 'USE_ITEM', hotspot: 'baggage_lock', item: 'baggage_key', at: at() },
    { type: 'MOVE', passage: 'p_dining_baggage', at: at() },

    // Baggage car: the bonded cage, the crate swing, and a stowaway mouser
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_cage',
      submission: { type: 'combination', values: ['B', 'D', 'S', 'O'] },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'transfer_brake', at: at() },
    { type: 'INTERACT', hotspot: 'mail_sacks', at: at() }, // secret: Margo
    { type: 'MOVE', passage: 'p_baggage_engine', at: at() },

    // Engine cab: the wire roll proves no telegram was ever received
    { type: 'INTERACT', hotspot: 'signal_card', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_telegraph',
      submission: { type: 'cipher', text: 'karst' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_baggage_engine', at: at() },
    { type: 'MOVE', passage: 'p_dining_baggage', at: at() },
    { type: 'MOVE', passage: 'p_dining_corra', at: at() },

    // Sleeper A: the latched door, the night-bolts, Brandt's case, Voss's mirror
    { type: 'INTERACT', hotspot: 'fisk_door_latched', at: at() },
    { type: 'USE_ITEM', hotspot: 'service_panel', item: 'pass_key', at: at() },
    { type: 'MOVE', passage: 'p_corra_brandt', at: at() },
    { type: 'INTERACT', hotspot: 'sample_case', at: at() },
    { type: 'MOVE', passage: 'p_corra_brandt', at: at() },
    { type: 'MOVE', passage: 'p_corra_voss', at: at() },
    { type: 'INTERACT', hotspot: 'writing_case', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_panel',
      submission: { type: 'rotary', positions: [2, 6, 4] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_voss_fisk', at: at() },

    // Compartment No. 1: the room behind the latch
    { type: 'INTERACT', hotspot: 'the_colonel', at: at() },
    { type: 'INTERACT', hotspot: 'collar', at: at() },
    { type: 'INTERACT', hotspot: 'pillow', at: at() },
    { type: 'INTERACT', hotspot: 'pipe_kit', at: at() },
    { type: 'INTERACT', hotspot: 'dispatch_case', at: at() },
    { type: 'INTERACT', hotspot: 'compare_hands', at: at() }, // WHO pinned
    { type: 'INTERACT', hotspot: 'night_latch', at: at() },
    { type: 'MOVE', passage: 'p_corra_fisk', at: at() },
    { type: 'MOVE', passage: 'p_corra_corrb', at: at() },

    // Sleeper B: the regulator, the rota, and three more doors
    { type: 'INTERACT', hotspot: 'regulator', at: at() },
    { type: 'INTERACT', hotspot: 'clock_wedge', at: at() }, // secret: the groat
    { type: 'INTERACT', hotspot: 'rota_card', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_lamps',
      submission: {
        type: 'sequence',
        order: ['baggage', 'dining', 'sleeper_a', 'sleeper_b', 'observation'],
      },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_corrb_kohl', at: at() },
    { type: 'INTERACT', hotspot: 'books', at: at() },
    { type: 'INTERACT', hotspot: 'ear_wall', at: at() },
    { type: 'MOVE', passage: 'p_corrb_kohl', at: at() },
    { type: 'MOVE', passage: 'p_corrb_blaine', at: at() },
    { type: 'INTERACT', hotspot: 'bench_book', at: at() },
    { type: 'MOVE', passage: 'p_corrb_blaine', at: at() },
    { type: 'MOVE', passage: 'p_corrb_stasny', at: at() },
    { type: 'INTERACT', hotspot: 'punch_register', at: at() },
    { type: 'MOVE', passage: 'p_corrb_stasny', at: at() },

    // THE JUNCTION DECOUPLING: seat the staff, watch the train reorder itself
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_shunt',
      submission: { type: 'itemPlacement', placements: { order_frame: 'section_staff' } },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_corrb_obs', at: at() },

    // Observation car: light the saloon, read the scene, close the triangle
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_bracket',
      submission: { type: 'itemPlacement', placements: { bracket: 'trimmed_lamp' } },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'pipe_ash', at: at() }, // WHERE pinned
    { type: 'INTERACT', hotspot: 'bare_curtain', at: at() },
    { type: 'INTERACT', hotspot: 'cord_reckon', at: at() }, // HOW pinned (last keystone)

    // Walk the re-marshalled train forward — through the NEW coupling — and file
    { type: 'MOVE', passage: 'p_corra_corrb', at: at() },
    { type: 'MOVE', passage: 'p_dining_corra', at: at() },
    { type: 'MOVE', passage: 'p_platform_dining', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_accuse',
      submission: { type: 'accusation', choices: ['o_voss', 'o_sashcord', 'o_observation'] },
      at: at(),
    },
  ];
}
