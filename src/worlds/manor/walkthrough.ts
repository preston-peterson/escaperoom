import type { GameAction } from '../../engine/types.ts';

/**
 * The complete solution as a replayable action script — the golden
 * walkthrough. It visits every room, unlocks every journal entry, finds both
 * secrets, and makes the correct accusation on the first attempt. The tests
 * replay it through the real reducer; it must be updated in lockstep with any
 * content change.
 *
 * The final action is always the accusation submission, and the last
 * keystone-evidence beat before it is the drag-marks inspection in the
 * conservatory — the tests rely on both facts.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'manor', mode: 'relaxed', at: at() },

    // Entrance hall: take the measure of the house.
    { type: 'INTERACT', hotspot: 'front_doors', at: at() },

    // Parlor: the portrait (his toast, his letters-to-family locks) + SECRET 1.
    { type: 'MOVE', passage: 'p_foyer_parlor', at: at() },
    { type: 'INTERACT', hotspot: 'portrait', at: at() },
    { type: 'INTERACT', hotspot: 'portrait_safe', at: at() }, // secret: the redrafted will
    { type: 'INTERACT', hotspot: 'hearth', at: at() },
    { type: 'MOVE', passage: 'p_foyer_parlor', at: at() },

    // Library: Ash's ledger, the hollow book (SECRET 2), the dispatch box.
    { type: 'MOVE', passage: 'p_foyer_library', at: at() },
    { type: 'INTERACT', hotspot: 'ash_ledger', at: at() },
    { type: 'INTERACT', hotspot: 'hollow_book', at: at() }, // secret: the miniature
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_ledger',
      submission: { type: 'cipher', text: 'Greyfield' },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'dispatch_open', at: at() },
    { type: 'MOVE', passage: 'p_foyer_library', at: at() },

    // The study: letter-lock, the body, the tantalus (HOW pinned + sill refuted).
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_study_door',
      submission: { type: 'combination', values: ['I', 'V', 'Y'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_foyer_study', at: at() },
    { type: 'INTERACT', hotspot: 'body', at: at() },
    { type: 'INTERACT', hotspot: 'letter_tray', at: at() },
    { type: 'INTERACT', hotspot: 'desk_drawer', at: at() },
    { type: 'INTERACT', hotspot: 'jib_seam', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_tantalus',
      submission: { type: 'rotary', positions: [4, 5, 3] },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'sill', at: at() },
    { type: 'MOVE', passage: 'p_foyer_study', at: at() },

    // East wing: Ivy's music box, Casque's chest (WHO pinned), Faro's room (the drift falls).
    { type: 'MOVE', passage: 'p_foyer_landing', at: at() },
    { type: 'INTERACT', hotspot: 'skylight', at: at() },
    { type: 'MOVE', passage: 'p_landing_ivy', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_music_box',
      submission: { type: 'itemPlacement', placements: { spindle: 'brass_cylinder' } },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_landing_ivy', at: at() },
    { type: 'MOVE', passage: 'p_landing_casque', at: at() },
    { type: 'INTERACT', hotspot: 'doctorate', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_medicine_chest',
      submission: { type: 'combination', values: ['1', '8', '9', '4'] },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'washstand', at: at() },
    { type: 'MOVE', passage: 'p_landing_casque', at: at() },
    { type: 'MOVE', passage: 'p_landing_faro', at: at() }, // the east-wing drift collapses
    { type: 'INTERACT', hotspot: 'open_window', at: at() },
    { type: 'INTERACT', hotspot: 'valve_wheel', at: at() },
    { type: 'MOVE', passage: 'p_landing_faro', at: at() },

    // Down the maids' stair into the service wing.
    { type: 'MOVE', passage: 'p_landing_kitchen', at: at() },
    { type: 'INTERACT', hotspot: 'boots', at: at() },
    { type: 'MOVE', passage: 'p_kitchen_tabb', at: at() },
    { type: 'INTERACT', hotspot: 'housekeeping_log', at: at() },
    { type: 'INTERACT', hotspot: 'vesta_tin', at: at() },
    { type: 'INTERACT', hotspot: 'chatelaine', at: at() },
    { type: 'MOVE', passage: 'p_kitchen_tabb', at: at() },

    // The great clock, now that Mrs. Tabb's routine is known.
    { type: 'MOVE', passage: 'p_foyer_kitchen', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_clock',
      submission: { type: 'sequence', order: ['going', 'strike', 'chime', 'hands'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_foyer_kitchen', at: at() },

    // Pantry: the servants' passage and the stoker handle.
    { type: 'MOVE', passage: 'p_kitchen_pantry', at: at() },
    { type: 'INTERACT', hotspot: 'flour_scuffs', at: at() },
    { type: 'INTERACT', hotspot: 'shelf_latch', at: at() }, // the shelves swing open
    { type: 'INTERACT', hotspot: 'stoker', at: at() },
    { type: 'MOVE', passage: 'p_kitchen_pantry', at: at() },

    // The cellar: unbuckle the strap, refit the boiler, relight it (the thaw).
    { type: 'USE_ITEM', hotspot: 'padlock', item: 'cellar_key', at: at() },
    { type: 'MOVE', passage: 'p_kitchen_cellar', at: at() },
    { type: 'INTERACT', hotspot: 'damper_strap', at: at() },
    { type: 'INTERACT', hotspot: 'wine_racks', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_boiler_parts',
      submission: {
        type: 'itemPlacement',
        placements: { bracket: 'stoker_handle', spindle: 'valve_wheel' },
      },
      at: at(),
    },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_boiler',
      submission: { type: 'sequence', order: ['damper', 'valve', 'coal', 'vesta'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_kitchen_cellar', at: at() },

    // The conservatory, surrendered by the thaw: the pipe, then the drag
    // marks — the final keystone (WHERE pinned).
    { type: 'MOVE', passage: 'p_foyer_kitchen', at: at() },
    { type: 'MOVE', passage: 'p_foyer_parlor', at: at() },
    { type: 'MOVE', passage: 'p_parlor_conservatory', at: at() }, // the pane falls behind you
    { type: 'INTERACT', hotspot: 'wicker_chair', at: at() },
    { type: 'INTERACT', hotspot: 'orchids', at: at() },
    { type: 'INTERACT', hotspot: 'pipe', at: at() },
    { type: 'INTERACT', hotspot: 'drag_marks', at: at() },

    // Back to the hall table, and the brief that will hold.
    { type: 'MOVE', passage: 'p_conservatory_kitchen', at: at() },
    { type: 'MOVE', passage: 'p_foyer_kitchen', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_accuse',
      submission: { type: 'accusation', choices: ['casque', 'foxglove', 'conservatory'] },
      at: at(),
    },
  ];
}
