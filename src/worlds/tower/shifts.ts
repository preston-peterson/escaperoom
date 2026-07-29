import type { ShiftDef, ShiftId } from '../../engine/types.ts';

export const shifts: Record<ShiftId, ShiftDef> = {
  // SHIFT 1 — steam raises the spiral stair
  s_steam: {
    id: 's_steam',
    ops: [{ type: 'openPassage', passage: 'p_pendulum_escapement' }],
    narration:
      'The needle climbs to the red line and holds. Below the hall, pistons take a breath a century deep — and the spiral stair unfolds out of the floor, segment by segment, like a fern in spring, hissing steam at every joint.',
    mapAnimation: 'slide',
    animTarget: 'escapement',
    durationMs: 2200,
  },
  // SHIFT 2 — the Escapement Gallery rotates into alignment
  s_gallery_turns: {
    id: 's_gallery_turns',
    ops: [
      { type: 'openPassage', passage: 'p_escapement_governor' },
      { type: 'openPassage', passage: 'p_chimeloft_governor' },
      { type: 'closePassage', passage: 'p_escapement_chimeloft' },
    ],
    narration:
      'The brake bar drops. The whole gallery turns underfoot — doorways sliding past like numerals on a dial — and seats itself with a sound like a struck bell dying. The loft door is gone. Above you, a stair that led nowhere now leads somewhere.',
    mapAnimation: 'rotate',
    animTarget: 'escapement',
    animDegrees: 120,
    durationMs: 2800,
  },
  // SHIFT 3 — the governor steadies the tower; the wall-ways unbolt
  s_governor: {
    id: 's_governor',
    ops: [
      { type: 'openPassage', passage: 'p_governor_astrolabe' },
      { type: 'openPassage', passage: 'p_pendulum_crawl' },
      { type: 'openPassage', passage: 'p_crawl_astrolabe' },
    ],
    narration:
      'The governor finds its spin — wild, then anxious, then even. All down the tower, things stop rattling that you had stopped hearing. The stair collar overhead unlocks, and somewhere inside the wall a long ladder of bolts lets go, one by one, top to bottom.',
    mapAnimation: 'reveal',
    animTarget: 'crawl',
    durationMs: 2000,
  },
  // SHIFT 4 — the Astrolabe Deck rotates to meet the vault
  s_deck_turns: {
    id: 's_deck_turns',
    ops: [
      { type: 'openPassage', passage: 'p_astrolabe_vault' },
      { type: 'closePassage', passage: 'p_governor_astrolabe' },
    ],
    narration:
      'Moon, wanderer, sun. The deck accepts the sky it was drawn for and turns beneath the open night, rail and stars wheeling together — then stops, true. The vault door stands where blank wall stood. The stair you climbed is wall now, somewhere behind you.',
    mapAnimation: 'rotate',
    animTarget: 'astrolabe',
    animDegrees: 90,
    durationMs: 2800,
  },
  // SHIFT 5 — the mainspring takes tension; the dome unlocks
  s_wound: {
    id: 's_wound',
    ops: [{ type: 'openPassage', passage: 'p_vault_dome' }],
    narration:
      'The key turns, and turns, and the spring takes tension like a long-held argument ending. The whole tower shudders — once, gently, from root to crown — and above you the dome hatch draws back its pawl and swings wide onto the smell of night air.',
    mapAnimation: 'rumble',
    animTarget: 'dome',
    durationMs: 2600,
  },
};
