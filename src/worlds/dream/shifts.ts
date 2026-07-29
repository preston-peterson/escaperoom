import type { ShiftDef, ShiftId } from '../../engine/types.ts';

/**
 * The dream revising itself. Every topology change in this world reads like
 * an author changing their mind — including the signature move, s_redraw,
 * where an existing door is remapped to lead somewhere it has never been.
 */
export const shifts: Record<ShiftId, ShiftDef> = {
  s_first_door: {
    id: 's_first_door',
    ops: [{ type: 'openPassage', passage: 'p_threshold_hall' }],
    narration:
      'You knock. There is the pause of someone deciding whether to have always been open. Then the lock forgets itself, and the lone door swings wide on a hall it did not have a moment ago.',
    mapAnimation: 'reveal',
    animTarget: 'hall',
    durationMs: 1600,
  },
  s_true_door: {
    id: 's_true_door',
    ops: [{ type: 'openPassage', passage: 'p_hall_stair' }],
    narration:
      'Three moons rise over one small door, and the door — flattered — becomes entirely real. Behind it a stair goes up. And up. And, in a way that is difficult to describe, up.',
    mapAnimation: 'reveal',
    animTarget: 'stair',
    durationMs: 1600,
  },
  // The loop breaks: the stair stops climbing itself.
  s_stair_breaks: {
    id: 's_stair_breaks',
    ops: [
      { type: 'closePassage', passage: 'p_stair_loop' },
      { type: 'openPassage', passage: 'p_stair_garden' },
    ],
    narration:
      'Somewhere overhead a pencil scratches — a line crossed out, another drawn, the small apologetic sound of an eraser. The stair shudders and stops climbing itself. Where the loop used to pour you out, a garden now hangs, patiently upside down.',
    mapAnimation: 'rotate',
    animTarget: 'stair',
    animDegrees: 180,
    durationMs: 2600,
  },
  s_shelf: {
    id: 's_shelf',
    ops: [{ type: 'openPassage', passage: 'p_parlor_library' }],
    narration:
      'The bookcase remembers that it was always a door. It is embarrassed about the whole misunderstanding, and opens before you can mention it.',
    mapAnimation: 'reveal',
    animTarget: 'library',
    durationMs: 1400,
  },
  s_seam: {
    id: 's_seam',
    ops: [{ type: 'openPassage', passage: 'p_parlor_seam' }],
    narration:
      'The wallpaper parts along the mismatched seam — not tearing, unfastening — and behind it the dream keeps a room it does not talk about.',
    mapAnimation: 'reveal',
    animTarget: 'seam',
    durationMs: 1800,
  },
  // SIGNATURE: the maze redraws itself. The Dozing Door in the Hall of Doors
  // used to lead (asleep, locked) to the Moon Pool; it wakes leading to the
  // Tide of Clocks instead.
  s_redraw: {
    id: 's_redraw',
    ops: [
      { type: 'remapPassage', passage: 'p_hall_dozing', to: 'tide' },
      { type: 'openPassage', passage: 'p_hall_dozing' },
    ],
    narration:
      'Far away, the Sleeper turns over. The whole dream tilts with her, and the maze redraws itself: in the Hall of Doors, the Dozing Door wakes with a start — leading, now, to somewhere it has never been.',
    mapAnimation: 'slide',
    animTarget: 'hall',
    durationMs: 3000,
  },
  s_tide: {
    id: 's_tide',
    ops: [{ type: 'openPassage', passage: 'p_tide_halfdrawn' }],
    narration:
      'The tide of clocks pulls back, hour over hour, and where it recedes a path of dry seconds leads out — toward the room that was never finished.',
    mapAnimation: 'reveal',
    animTarget: 'halfdrawn',
    durationMs: 2200,
  },
  s_room_finished: {
    id: 's_room_finished',
    ops: [{ type: 'openPassage', passage: 'p_halfdrawn_sleeper' }],
    narration:
      "The finished room exhales. In its new wall — a wall now, truly — stands a door you did not draw and would not have dared: small, pale, and breathing slowly. The Sleeper's Door.",
    mapAnimation: 'reveal',
    animTarget: 'sleeper',
    durationMs: 2600,
  },
};
