import type { GameAction } from '../../engine/types.ts';

/**
 * The complete solution as a replayable action script — the golden
 * walkthrough. The solvability test replays it through the real reducer and
 * asserts victory; it must be updated in lockstep with any content change.
 * Timestamps step by a fixed interval from `start` so timing stays
 * deterministic.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'tower', mode: 'relaxed', at: at() },

    // Winding Room: the dead drum, the ground gauge, the porter's oil
    { type: 'INTERACT', hotspot: 'gauge_ground', at: at() },
    { type: 'INTERACT', hotspot: 'take_oil', at: at() },
    { type: 'MOVE', passage: 'p_winding_pendulum', at: at() },

    // Pendulum Hall: the hall gauge and Fen's slate
    { type: 'INTERACT', hotspot: 'gauge_hall', at: at() },
    { type: 'INTERACT', hotspot: 'fen_slate', at: at() },

    // Steam wing: fish the flyball, read the plates, light the fire
    { type: 'MOVE', passage: 'p_pendulum_boiler', at: at() },
    { type: 'INTERACT', hotspot: 'fire_plate', at: at() },
    { type: 'INTERACT', hotspot: 'take_weight', at: at() },
    { type: 'MOVE', passage: 'p_boiler_furnace', at: at() },
    { type: 'INTERACT', hotspot: 'furnace_gauge', at: at() },
    { type: 'INTERACT', hotspot: 'scorched_page', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_furnace',
      submission: { type: 'sequence', order: ['grate', 'damper', 'coal', 'bellows'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_boiler_furnace', at: at() },

    // Pressure up → SHIFT 1 (the spiral stair unfolds)
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_boiler',
      submission: { type: 'combination', values: ['4', '7', '2'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_pendulum_boiler', at: at() },
    { type: 'MOVE', passage: 'p_pendulum_escapement', at: at() },

    // Chime Loft: the beat plates and the dawn peal
    { type: 'MOVE', passage: 'p_escapement_chimeloft', at: at() },
    { type: 'INTERACT', hotspot: 'beat_plates', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_chimes',
      submission: { type: 'sequence', order: ['great', 'great', 'treble', 'mid', 'great'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_escapement_chimeloft', at: at() },

    // The cam-rings → SHIFT 2 (the gallery rotates)
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_escapement',
      submission: { type: 'rotary', positions: [5, 4, 11] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_escapement_governor', at: at() },

    // Governor Room: oil the spindle, seat the flyball → SHIFT 3
    { type: 'USE_ITEM', hotspot: 'spindle', item: 'oil_flask', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_governor',
      submission: { type: 'itemPlacement', placements: { cage: 'governor_weight' } },
      at: at(),
    },

    // Workshop: the shorthand, the schematic, the word-locked cabinet
    { type: 'MOVE', passage: 'p_governor_workshop', at: at() },
    { type: 'INTERACT', hotspot: 'shorthand_slate', at: at() },
    { type: 'INTERACT', hotspot: 'drawing_board', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_workshop',
      submission: { type: 'cipher', text: 'Dial' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_governor_workshop', at: at() },

    // Astrolabe Deck, and down the wall-ways for Fen's letter
    { type: 'MOVE', passage: 'p_governor_astrolabe', at: at() },
    { type: 'INTERACT', hotspot: 'horo_chair', at: at() },
    { type: 'MOVE', passage: 'p_crawl_astrolabe', at: at() }, // secret: the unsent letter
    { type: 'INTERACT', hotspot: 'letter_nook', at: at() },
    { type: 'MOVE', passage: 'p_crawl_astrolabe', at: at() },

    // The rings → SHIFT 4 (the deck rotates to meet the vault)
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_astrolabe',
      submission: { type: 'rotary', positions: [3, 2, 3] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_astrolabe_vault', at: at() },

    // Mainspring Vault: the ritual, the watch, the great rewinding → SHIFT 5
    { type: 'INTERACT', hotspot: 'ritual_page', at: at() },
    { type: 'INTERACT', hotspot: 'watch_nook', at: at() }, // secret: the Horologist's watch
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_mainspring',
      submission: { type: 'itemPlacement', placements: { keyway: 'mainspring_key' } },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_vault_dome', at: at() },

    // FINALE: the setting of the sky
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_orrery',
      submission: { type: 'sequence', order: ['sun', 'moon', 'wanderers', 'letgo'] },
      at: at(),
    },
  ];
}
