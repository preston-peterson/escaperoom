import type { GameAction } from '../../engine/types.ts';

/**
 * The complete solution as a replayable action script — the golden
 * walkthrough. It visits every room, unlocks every journal entry, finds both
 * secrets, demonstrates the stair loop before breaking it, and traverses the
 * remapped Dozing Door via its NEW endpoint. Timestamps step by a fixed
 * interval from `start` so timing stays deterministic.
 */
export function buildWalkthrough(start = 0, stepMs = 3000): GameAction[] {
  let t = start;
  const at = () => (t += stepMs);
  return [
    { type: 'START_GAME', worldId: 'dream', mode: 'relaxed', at: at() },

    // The Threshold: knock, and the lone door remembers how to open
    { type: 'INTERACT', hotspot: 'knock', at: at() },
    { type: 'MOVE', passage: 'p_threshold_hall', at: at() },

    // Hall of Doors: the pencil note, then the door with three skies
    { type: 'INTERACT', hotspot: 'painted_doors', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_doors',
      submission: { type: 'rotary', positions: [3, 2, 3] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_hall_stair', at: at() },

    // The stair climbs itself: ride the loop once, then break it
    { type: 'MOVE', passage: 'p_stair_loop', at: at() }, // ...back in the hall
    { type: 'MOVE', passage: 'p_hall_stair', at: at() },
    { type: 'INTERACT', hotspot: 'banister', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_stair',
      submission: { type: 'sequence', order: ['down', 'down', 'up', 'nowhere'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_stair_garden', at: at() },

    // Upside Garden: the dream's rain, and the well's riddle
    { type: 'INTERACT', hotspot: 'trees', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_rain',
      submission: { type: 'cipher', text: 'Rain' },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_garden_parlor', at: at() },

    // Mirror Parlor: read the mirror backward, find the seam
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_mirror',
      submission: { type: 'cipher', text: 'moonlight' },
      at: at(),
    },
    { type: 'INTERACT', hotspot: 'seam', at: at() },
    { type: 'MOVE', passage: 'p_parlor_seam', at: at() },

    // The Nightmare Seam: the photograph (secret) and the folded fear
    { type: 'INTERACT', hotspot: 'photo', at: at() },
    { type: 'INTERACT', hotspot: 'fear', at: at() },
    { type: 'MOVE', passage: 'p_parlor_seam', at: at() },

    // Library of Blank Books: the three finished chapters, the pencil
    { type: 'MOVE', passage: 'p_parlor_library', at: at() },
    { type: 'INTERACT', hotspot: 'spines', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_books',
      submission: { type: 'combination', values: ['✎', '⧗', '♪'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_library_moonpool', at: at() },

    // Moon Pool: the lullaby → the name → THE REDRAW (Dozing Door remaps)
    { type: 'INTERACT', hotspot: 'rim', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_lullaby',
      submission: { type: 'sequence', order: ['hush', 'hush', 'high', 'low'] },
      at: at(),
    },

    // Walk back to the Hall — the Dozing Door now leads somewhere new
    { type: 'MOVE', passage: 'p_library_moonpool', at: at() },
    { type: 'MOVE', passage: 'p_parlor_library', at: at() },
    { type: 'MOVE', passage: 'p_garden_parlor', at: at() },
    { type: 'MOVE', passage: 'p_stair_garden', at: at() },
    { type: 'MOVE', passage: 'p_hall_stair', at: at() },
    { type: 'MOVE', passage: 'p_hall_dozing', at: at() }, // NEW endpoint: the Tide

    // Tide of Clocks: three wrongs, one lock, one kept hour
    { type: 'INTERACT', hotspot: 'clocks', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_tide',
      submission: { type: 'combination', values: ['4', '11', '7'] },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_tide_halfdrawn', at: at() },

    // The Half-Drawn Room: list, portrait (secret), pencil, and the finishing
    { type: 'INTERACT', hotspot: 'list', at: at() },
    { type: 'INTERACT', hotspot: 'portrait', at: at() },
    { type: 'USE_ITEM', hotspot: 'unfinished_wall', item: 'stub_pencil', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_ideas',
      submission: {
        type: 'itemPlacement',
        placements: {
          shelf_name: 'idea_name',
          shelf_rain: 'idea_rain',
          shelf_hour: 'idea_hour',
          shelf_fear: 'idea_fear',
        },
      },
      at: at(),
    },
    { type: 'MOVE', passage: 'p_halfdrawn_sleeper', at: at() },

    // The Sleeper's Door: the note, and the lullaby turned around
    { type: 'INTERACT', hotspot: 'note', at: at() },
    {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_wake',
      submission: { type: 'sequence', order: ['low', 'high', 'hush', 'hush'] },
      at: at(),
    },
  ];
}
