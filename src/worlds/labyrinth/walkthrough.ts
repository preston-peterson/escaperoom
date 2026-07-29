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
    { type: 'START_GAME', worldId: 'labyrinth', mode: 'relaxed', at: at() },

    // Entrance: light, learn, look
    { type: 'INTERACT', hotspot: 'take_torch', at: at() },
    { type: 'USE_ITEM', hotspot: 'brazier', item: 'unlit_torch', at: at() },
    { type: 'INTERACT', hotspot: 'stair_glyphs', at: at() },
    { type: 'MOVE', passage: 'p_entrance_gatehouse', at: at() },

    // Gatehouse: rope + the dial
    { type: 'INTERACT', hotspot: 'take_rope', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_gatehouse',
      submission: { type: 'combination', values: ['◐', '△', '☰', '✶'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_gatehouse_hall', at: at() },

    // West wing: mural, drips, sluices → SHIFT 1
    { type: 'MOVE', passage: 'p_hall_cistern', at: at() },
    { type: 'INTERACT', hotspot: 'mural', at: at() },
    { type: 'INTERACT', hotspot: 'drips', at: at() },
    { type: 'MOVE', passage: 'p_cistern_sluice', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_sluice',
      submission: { type: 'sequence', order: ['spring', 'weir', 'culvert', 'deep'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_cistern_sluice', at: at() },
    { type: 'INTERACT', hotspot: 'coin_glint', at: at() }, // secret: the Builder's Coin
    { type: 'MOVE', passage: 'p_cistern_gallery', at: at() },
    { type: 'INTERACT', hotspot: 'take_gear', at: at() },
    { type: 'INTERACT', hotspot: 'take_sigil_water', at: at() },
    { type: 'INTERACT', hotspot: 'weights', at: at() },
    { type: 'INTERACT', hotspot: 'vell_gallery', at: at() },
    { type: 'MOVE', passage: 'p_gallery_hall', at: at() },

    // East wing: seat the gear, cross the chasm, balance the weights
    { type: 'MOVE', passage: 'p_hall_gearworks', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_gearsocket',
      submission: { type: 'itemPlacement', placements: { axle: 'bronze_gear' } },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_gearworks_bridge', at: at() },
    { type: 'INTERACT', hotspot: 'vell_bridge', at: at() },
    { type: 'USE_ITEM', hotspot: 'throw_rope', item: 'rope', at: at() },
    { type: 'MOVE', passage: 'p_bridge_vault', at: at() },
    { type: 'INTERACT', hotspot: 'plaques', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_vault',
      submission: { type: 'combination', values: ['7', '2', '9'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_bridge_vault', at: at() },
    { type: 'MOVE', passage: 'p_gearworks_bridge', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_gearalign',
      submission: { type: 'rotary', positions: [4, 4, 1] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_hall_gearworks', at: at() },

    // The chimes → SHIFT 2 (the Hall turns)
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_chimes',
      submission: { type: 'sequence', order: ['rain', 'rain', 'rain', 'stone', 'stone'] },
      at: at(),
    },

    // Glyph wing: the table, the cipher, the crack → the Oracle
    { type: 'MOVE', passage: 'p_hall_scriptorium', at: at() },
    { type: 'INTERACT', hotspot: 'vell_table', at: at() },
    { type: 'INTERACT', hotspot: 'builder_inscription', at: at() },
    { type: 'MOVE', passage: 'p_scriptorium_crypt', at: at() },
    { type: 'INTERACT', hotspot: 'niches', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_crypt',
      submission: { type: 'cipher', text: 'Ember' },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'crack', at: at() },
    { type: 'MOVE', passage: 'p_crypt_oracle', at: at() }, // secret: the Oracle
    { type: 'MOVE', passage: 'p_crypt_oracle', at: at() },
    { type: 'MOVE', passage: 'p_scriptorium_crypt', at: at() },
    { type: 'MOVE', passage: 'p_hall_scriptorium', at: at() },

    // The Serpent Gate → SHIFT 3, and the Heart
    { type: 'MOVE', passage: 'p_hall_gate', at: at() },
    { type: 'INTERACT', hotspot: 'gate_inscription', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_serpent_sigils',
      submission: {
        type: 'itemPlacement',
        placements: { water: 'sigil_water', gear: 'sigil_gear', glyph: 'sigil_glyph' },
      },
      at: at(),
    },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_serpent_rings',
      submission: { type: 'rotary', positions: [5, 3, 0] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_gate_heart', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_heart',
      submission: { type: 'sequence', order: ['water', 'wheel', 'word', 'breath'] },
      at: at(),
    },
  ];
}
