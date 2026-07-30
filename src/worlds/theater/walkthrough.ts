import type { GameAction } from '../../engine/types.ts';

/**
 * The complete investigation as a replayable action script — the golden
 * walkthrough. It visits every room, unlocks every case-file page, finds both
 * secrets, and closes with the correct accusation on the first attempt. The
 * mystery tests lean on two landmarks: the 'callers_perch' inspect is the
 * LAST keystone-evidence action (it pins WHO, after HOW and WHERE), and the
 * final action is the accusation itself.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'theater', mode: 'relaxed', at: at() },

    // Lobby: open the case, read the muses, break the chain.
    { type: 'INTERACT', hotspot: 'playbill', at: at() },
    { type: 'INTERACT', hotspot: 'portraits', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_house_doors',
      submission: { type: 'combination', values: ['3', '8', '5', '2'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_lobby_house', at: at() },

    // House: the callboard gives up the house word.
    { type: 'INTERACT', hotspot: 'empty_house', at: at() },
    { type: 'INTERACT', hotspot: 'callboard', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_pass_door',
      submission: { type: 'cipher', text: 'vespertine' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_house_stage', at: at() },

    // Stage, then the prompt corner: Craik's domain.
    { type: 'INTERACT', hotspot: 'ghost_light', at: at() },
    { type: 'MOVE', passage: 'p_stage_prompt', at: at() },
    { type: 'INTERACT', hotspot: 'craik_desk', at: at() },
    { type: 'INTERACT', hotspot: 'prompt_book', at: at() },
    { type: 'INTERACT', hotspot: 'craik_keys', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_cue_board',
      submission: { type: 'sequence', order: ['house', 'limes', 'bells', 'ring'] },
      at: at(),
    },

    // The dressing wing: the understudy's knife, the star's letters, the rosette.
    { type: 'MOVE', passage: 'p_prompt_understudy', at: at() },
    { type: 'INTERACT', hotspot: 'dunmore_station', at: at() },
    { type: 'INTERACT', hotspot: 'take_knife', at: at() },
    { type: 'MOVE', passage: 'p_understudy_star', at: at() },
    { type: 'INTERACT', hotspot: 'vane_mirror', at: at() },
    { type: 'INTERACT', hotspot: 'take_letters', at: at() },
    { type: 'INTERACT', hotspot: 'mirror_rosette', at: at() }, // secret: the title page
    { type: 'MOVE', passage: 'p_understudy_star', at: at() },
    { type: 'MOVE', passage: 'p_prompt_understudy', at: at() },

    // Props room: the crank — and the ledger that unmakes the knife.
    { type: 'MOVE', passage: 'p_prompt_props', at: at() },
    { type: 'INTERACT', hotspot: 'shelves', at: at() },
    { type: 'INTERACT', hotspot: 'take_crank', at: at() },
    { type: 'USE_ITEM', hotspot: 'ledger', item: 'prop_knife', at: at() },
    { type: 'MOVE', passage: 'p_prompt_props', at: at() },

    // Rig shop: Barrow's log, his undisturbed key — and her key in the padlock.
    { type: 'MOVE', passage: 'p_prompt_rig', at: at() },
    { type: 'INTERACT', hotspot: 'barrow_bench', at: at() },
    { type: 'INTERACT', hotspot: 'weight_log', at: at() },
    { type: 'INTERACT', hotspot: 'key_nail', at: at() },
    { type: 'USE_ITEM', hotspot: 'fly_gate', item: 'master_keys', at: at() },

    // The fly gallery: land the arbor, prove the tally, read the rail.
    { type: 'MOVE', passage: 'p_rig_fly', at: at() },
    { type: 'INTERACT', hotspot: 'gallery_view', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_pin_rail',
      submission: { type: 'sequence', order: ['brake', 'purchase', 'dog', 'land'] },
      at: at(),
    },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_counterweight',
      submission: { type: 'combination', values: ['4', '1', '6'] },
      at: at(),
    }, // HOW pinned: the hollow weight
    { type: 'INTERACT', hotspot: 'rail_scuffs', at: at() }, // WHERE pinned: prompt chalk aloft
    { type: 'INTERACT', hotspot: 'callers_perch', at: at() }, // WHO pinned — the last keystone
    { type: 'MOVE', passage: 'p_rig_fly', at: at() },
    { type: 'MOVE', passage: 'p_prompt_rig', at: at() },

    // Understage: run the trap, read the severed line, climb out through the stage.
    { type: 'MOVE', passage: 'p_understage_stair', at: at() },
    { type: 'INTERACT', hotspot: 'chalk_outline', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_trap_machine',
      submission: { type: 'itemPlacement', placements: { winch: 'crank_handle' } },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'safety_line', at: at() },
    { type: 'MOVE', passage: 'p_trapdoor', at: at() },

    // The dead ghost light gives up its secret.
    { type: 'INTERACT', hotspot: 'ghost_light_dark', at: at() }, // secret: the token

    // The author's box: the typescript, the dispatch box, the matched letters.
    { type: 'MOVE', passage: 'p_house_stage', at: at() },
    { type: 'MOVE', passage: 'p_house_box', at: at() },
    { type: 'INTERACT', hotspot: 'marlowe_desk', at: at() },
    { type: 'INTERACT', hotspot: 'typescript', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_marlowe_desk',
      submission: { type: 'cipher', text: 'uncredited' },
      at: at(),
    },
    { type: 'USE_ITEM', hotspot: 'compare_letters', item: 'letters', at: at() },
    { type: 'MOVE', passage: 'p_house_box', at: at() },

    // The revolve turns the building; the stage-right room finally exists.
    { type: 'MOVE', passage: 'p_house_stage', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_revolve',
      submission: { type: 'rotary', positions: [4, 3, 3] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_revolve_door', at: at() },
    { type: 'INTERACT', hotspot: 'reyes_mirror', at: at() },
    { type: 'INTERACT', hotspot: 'quick_change', at: at() },
    { type: 'MOVE', passage: 'p_revolve_door', at: at() },

    // From the apron, name it to the house — correctly, first try.
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_accusation',
      submission: {
        type: 'accusation',
        choices: ['craik', 'counterweight', 'fly_gallery'],
      },
      at: at(),
    },
  ];
}
