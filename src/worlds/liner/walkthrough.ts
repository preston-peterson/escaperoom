import type { GameAction } from '../../engine/types.ts';

/**
 * The complete investigation as a replayable action script — the golden
 * walkthrough. It sweeps every deck, fills the whole case file, finds both
 * secrets, refutes both plants, and lays the correct charge on the first
 * attempt. The solvability tests replay it through the real reducer.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'liner', mode: 'relaxed', at: at() },

    // Promenade: the staged scene, taken apart.
    { type: 'INTERACT', hotspot: 'railing', at: at() },
    { type: 'INTERACT', hotspot: 'railing_stubs', at: at() },
    { type: 'INTERACT', hotspot: 'button_glint', at: at() },

    // Grand Salon: Quill's table, the slate, the key box — and his cache.
    { type: 'MOVE', passage: 'p_prom_salon', at: at() },
    { type: 'INTERACT', hotspot: 'slate', at: at() },
    { type: 'INTERACT', hotspot: 'bar_top', at: at() },
    { type: 'INTERACT', hotspot: 'loose_panel', at: at() }, // secret: the Doctor's cache
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_barlock',
      submission: { type: 'combination', values: ['♠', '♦', '♠'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_prom_salon', at: at() },

    // Down the service side: Marsh's room, the button refuted, the drill bill.
    { type: 'MOVE', passage: 'p_prom_corridor', at: at() },
    { type: 'INTERACT', hotspot: 'linen_trolley', at: at() },
    { type: 'MOVE', passage: 'p_corridor_stair', at: at() },
    { type: 'INTERACT', hotspot: 'watch_station', at: at() },
    { type: 'MOVE', passage: 'p_stair_linen', at: at() },
    { type: 'INTERACT', hotspot: 'standing_orders', at: at() },
    { type: 'INTERACT', hotspot: 'laundry_log', at: at() }, // the button was planted
    { type: 'INTERACT', hotspot: 'hampers', at: at() },
    { type: 'MOVE', passage: 'p_stair_linen', at: at() },
    { type: 'MOVE', passage: 'p_stair_galley', at: at() },
    { type: 'INTERACT', hotspot: 'drill_bill', at: at() },
    { type: 'INTERACT', hotspot: 'range', at: at() },
    { type: 'MOVE', passage: 'p_stair_galley', at: at() },
    { type: 'MOVE', passage: 'p_corridor_stair', at: at() },
    { type: 'MOVE', passage: 'p_prom_corridor', at: at() },

    // The purser's office: keys, the log gap, the coded page, the hidden crank.
    { type: 'USE_ITEM', hotspot: 'office_lock', item: 'office_key', at: at() },
    { type: 'MOVE', passage: 'p_prom_office', at: at() },
    { type: 'INTERACT', hotspot: 'manifest_drawer', at: at() },
    { type: 'INTERACT', hotspot: 'crank_rag', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_keyrack',
      submission: { type: 'combination', values: ['D', 'A', 'W', 'N'] },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'key_log', at: at() },
    { type: 'MOVE', passage: 'p_prom_office', at: at() },

    // Stateroom Twelve: her room, her valise, her arithmetic — WHO pinned.
    { type: 'MOVE', passage: 'p_prom_corridor', at: at() },
    { type: 'USE_ITEM', hotspot: 'cabin_lock', item: 'cabin_key', at: at() },
    { type: 'MOVE', passage: 'p_corridor_cabin', at: at() },
    { type: 'INTERACT', hotspot: 'tea_tray', at: at() },
    { type: 'INTERACT', hotspot: 'porthole_trim', at: at() }, // secret: the Meridian Star
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_valise',
      submission: { type: 'sequence', order: ['west', 'west', 'north', 'east'] },
      at: at(),
    },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_manifest',
      submission: { type: 'cipher', text: 'Duquesne' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_corridor_cabin', at: at() },

    // Below: cycle the bulkheads, and the ship leans into her secrets.
    { type: 'MOVE', passage: 'p_corridor_stair', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_bulkhead',
      submission: { type: 'sequence', order: ['aft', 'fore', 'aft', 'amid'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_stair_engine', at: at() },
    { type: 'INTERACT', hotspot: 'engine_log', at: at() },
    { type: 'INTERACT', hotspot: 'stencil_note', at: at() },
    { type: 'INTERACT', hotspot: 'gauges', at: at() },

    // The winch flat: the empty bracket, the hook, the ring-lock.
    { type: 'MOVE', passage: 'p_engine_winch', at: at() },
    { type: 'INTERACT', hotspot: 'bracket', at: at() },
    { type: 'INTERACT', hotspot: 'winch_drum', at: at() },
    { type: 'INTERACT', hotspot: 'hook_nail', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_hold_hatch',
      submission: { type: 'rotary', positions: [4, 3, 3] },
      at: at(),
    },

    // The hold: crate seven — HOW pinned.
    { type: 'MOVE', passage: 'p_winch_hold', at: at() },
    { type: 'INTERACT', hotspot: 'crate_rows', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_crate',
      submission: { type: 'itemPlacement', placements: { lid: 'cargo_hook' } },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'crate_scratch', at: at() },

    // The killer's road: back up and around to the galley, restore the dumbwaiter.
    { type: 'MOVE', passage: 'p_winch_hold', at: at() },
    { type: 'MOVE', passage: 'p_engine_winch', at: at() },
    { type: 'MOVE', passage: 'p_galley_engine', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dumbwaiter',
      submission: { type: 'itemPlacement', placements: { spindle: 'dumbwaiter_crank' } },
      at: at(),
    },

    // Ride it down, and read the tally with the shaft at your back — WHERE pinned.
    { type: 'MOVE', passage: 'p_galley_hold', at: at() },
    { type: 'INTERACT', hotspot: 'tally_board', at: at() },

    // Back topside, by the leaning ship's reopened starboard door: the last dossier.
    { type: 'MOVE', passage: 'p_galley_hold', at: at() },
    { type: 'MOVE', passage: 'p_galley_engine', at: at() },
    { type: 'MOVE', passage: 'p_stair_engine', at: at() },
    { type: 'MOVE', passage: 'p_corridor_stair', at: at() },
    { type: 'MOVE', passage: 'p_prom_corridor', at: at() },
    { type: 'MOVE', passage: 'p_prom_suite', at: at() },
    { type: 'INTERACT', hotspot: 'portmanteau', at: at() },
    { type: 'INTERACT', hotspot: 'writing_table', at: at() },
    { type: 'MOVE', passage: 'p_prom_suite', at: at() },

    // The charge, laid correctly, first attempt.
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_accusation',
      submission: { type: 'accusation', choices: ['duquesne', 'winch_handle', 'cargo_hold'] },
      at: at(),
    },
  ];
}
