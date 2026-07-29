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
    { type: 'START_GAME', worldId: 'island', mode: 'relaxed', at: at() },

    // Dock: the letter, the stranded skiff, the stair
    { type: 'INTERACT', hotspot: 'letterbox', at: at() },
    { type: 'INTERACT', hotspot: 'skiff_aground', at: at() },
    { type: 'MOVE', passage: 'p_dock_cliff', at: at() },

    // Cliff stair: the Wardens name the thing below (once)
    { type: 'INTERACT', hotspot: 'warden_stone', at: at() },
    { type: 'MOVE', passage: 'p_cliff_square', at: at() },

    // Square, then out to the orchard: moondial + the hidden key
    { type: 'MOVE', passage: 'p_square_orchard', at: at() },
    { type: 'INTERACT', hotspot: 'moondial', at: at() },
    { type: 'INTERACT', hotspot: 'take_key', at: at() },

    // Observatory: notebook, then the chart case (charts + script key)
    { type: 'MOVE', passage: 'p_orchard_observatory', at: at() },
    { type: 'INTERACT', hotspot: 'notebook', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_starcase',
      submission: { type: 'combination', values: ['●', '◐', '○'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_orchard_observatory', at: at() },

    // Lighthouse: the log, the word, the lens — and the beacon's secret
    { type: 'MOVE', passage: 'p_orchard_lighthouse', at: at() },
    { type: 'INTERACT', hotspot: 'keepers_log', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_hatch',
      submission: { type: 'cipher', text: 'Sleep' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_lighthouse_lantern', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_lens',
      submission: { type: 'rotary', positions: [5, 5, 1] },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'letter_tin', at: at() }, // secret: the true last letter
    { type: 'MOVE', passage: 'p_lighthouse_lantern', at: at() },
    { type: 'MOVE', passage: 'p_orchard_lighthouse', at: at() },
    { type: 'MOVE', passage: 'p_square_orchard', at: at() },

    // The cottage: her key, her hymn, her desk, her lantern, the engine's heart
    { type: 'USE_ITEM', hotspot: 'cottage_lock', item: 'cottage_key', at: at() },
    { type: 'MOVE', passage: 'p_square_cottage', at: at() },
    { type: 'INTERACT', hotspot: 'psalter', at: at() },
    { type: 'INTERACT', hotspot: 'hearth_wheel', at: at() },
    { type: 'INTERACT', hotspot: 'take_lantern', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_desk',
      submission: { type: 'cipher', text: 'Undertow' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_square_cottage', at: at() },

    // The bell tower: a spare weight, then the Ebb Peal → the bay breathes out
    { type: 'MOVE', passage: 'p_square_bell', at: at() },
    { type: 'INTERACT', hotspot: 'take_weight', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_bellpeal',
      submission: { type: 'sequence', order: ['ebb', 'ebb', 'hour', 'fog'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_square_bell', at: at() },

    // Down to the bared harbor: the mud's secret, then the sea cave
    { type: 'MOVE', passage: 'p_cliff_square', at: at() },
    { type: 'MOVE', passage: 'p_dock_cliff', at: at() },
    { type: 'INTERACT', hotspot: 'mud_token', at: at() }, // secret: the Warden token
    { type: 'MOVE', passage: 'p_dock_seacave', at: at() },
    { type: 'INTERACT', hotspot: 'flood_carving', at: at() },
    { type: 'INTERACT', hotspot: 'cairn', at: at() },
    { type: 'INTERACT', hotspot: 'take_impeller', at: at() },
    { type: 'MOVE', passage: 'p_dock_seacave', at: at() },

    // Back up: the counterlock opens the way down to the engine
    { type: 'MOVE', passage: 'p_dock_cliff', at: at() },
    { type: 'MOVE', passage: 'p_cliff_square', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_tidelock',
      submission: { type: 'combination', values: ['9', '4', '7'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_square_engine', at: at() },

    // The engine: made whole, then fed → the bay breathes in
    { type: 'INTERACT', hotspot: 'engine_inscription', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_engineparts',
      submission: {
        type: 'itemPlacement',
        placements: { impeller: 'eng_impeller', valve: 'eng_valve', weight: 'eng_weight' },
      },
      at: at(),
    },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_floodgates',
      submission: { type: 'sequence', order: ['brake', 'gate', 'boom', 'race'] },
      at: at(),
    },

    // Below the engine: the rite, and the Quieting
    { type: 'MOVE', passage: 'p_engine_undergate', at: at() },
    { type: 'INTERACT', hotspot: 'gate_rite', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_quieting',
      submission: { type: 'sequence', order: ['lantern', 'wheel', 'bell', 'silence'] },
      at: at(),
    },
  ];
}
