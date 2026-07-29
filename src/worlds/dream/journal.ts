import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

/**
 * Two voices interleave here: the Draughtsman's pencil notes (apologetic,
 * self-deprecating, quietly desperate) and the dream's own assertions —
 * statements that are absurd and internally consistent, delivered with the
 * total confidence of sleep.
 */
export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Clues -------------------------------------------------------------
  j_moons: {
    id: 'j_moons',
    title: 'A note beneath the painted door',
    body: "Under the one door with actual hinges, in soft pencil:\n'Moons up, suns down. In dreams it is always so.'\nThe lock wears three rings of tiny skies.",
    category: 'clue',
  },
  j_stair_rhyme: {
    id: 'j_stair_rhyme',
    title: 'The banister rhyme',
    body: "Carved shallowly into the banister, reading upward:\n'To climb the stair that climbs itself,\nfirst walk down twice as far,\nthen once more up, and end by going\nnowhere — there you are.'",
    category: 'clue',
  },
  j_chapters: {
    id: 'j_chapters',
    title: 'The finished chapters',
    body: 'Three books on the high shelf have found their words. Their spines are marked, in order of finishing:\nChapter One wears the PENCIL ✎.\nChapter Two wears the HOURGLASS ⧗.\nChapter Three wears the SONG ♪.',
    category: 'clue',
  },
  j_lullaby: {
    id: 'j_lullaby',
    title: 'The lullaby, as carved',
    body: "Around the moon pool's rim, in a hand older than the Draughtsman's:\n'Hush, hush — then high, then low,\nthat is the way the sleepers go.'",
    category: 'clue',
  },
  j_clocks: {
    id: 'j_clocks',
    title: 'Three wrong clocks',
    body: "You note each clock's particular wrongness:\nThe DROWNED clock has swallowed its FOURTH hour — the tick where four should be simply isn't.\nThe BACKWARD clock runs widdershins, homesick for ELEVEN.\nThe FACELESS clock remembers only SEVEN, and strikes it at random.",
    category: 'clue',
  },
  j_ideas_list: {
    id: 'j_ideas_list',
    title: "The Draughtsman's list",
    body: "Pinned to the sketched wall, a list in soft pencil:\n'The last room wants: a name I remembered, the smell of rain, one kept hour, and the fear — yes, even the fear. A room without its shadow is only a diagram.'",
    category: 'clue',
  },
  j_backward: {
    id: 'j_backward',
    title: 'Turned around',
    body: "On the Sleeper's Door, in pencil, very small:\n'She fell asleep to hush, hush, high, low.\nShe will wake to it turned around.'",
    category: 'clue',
  },

  // --- Mechanisms ---------------------------------------------------------
  j_mech_loop: {
    id: 'j_mech_loop',
    title: 'On stairs that climb themselves',
    body: "The dream asserts, calmly: a stair is a promise, not a place. This one promised 'up' without ever deciding where up went, and so it delivered every climber politely back to the beginning. It has been corrected. It is sulking.",
    category: 'mechanism',
  },
  j_mech_books: {
    id: 'j_mech_books',
    title: 'On the blank books',
    body: 'The library was shelved before it was written. Every solved thing in the dream becomes a chapter, and every chapter finds its spine. The dream asserts: all books are blank until somebody does something worth shelving.',
    category: 'mechanism',
  },
  j_mech_seam: {
    id: 'j_mech_seam',
    title: 'On the seam',
    body: 'Behind every wallpaper there is a wall; behind some walls the dream keeps what it cannot bring itself to draw. The seam is not a flaw in the dream. The seam is where the dream is being honest.',
    category: 'mechanism',
  },

  // --- Lore: the Draughtsman and the Sleeper ------------------------------
  j_draughtsman_1: {
    id: 'j_draughtsman_1',
    title: 'Pencil note: at the threshold',
    body: "'If you are reading this, I am sorry about the door. I drew it first and I drew it best — doors are easy, doors are hope with hinges — and then I stood in front of it for a very long while, not drawing the house.\n— the Draughtsman'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_draughtsman_2: {
    id: 'j_draughtsman_2',
    title: 'Pencil note: in the garden',
    body: "'The trees came out upside down. I meant to fix them, and then I thought: roots want the sky sometimes, like anyone. The sea I hung up there on purpose. On the bad nights it is the only thing that sounds right.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_draughtsman_3: {
    id: 'j_draughtsman_3',
    title: 'Pencil note: in the library',
    body: "'I meant to write every book in this room. I ruled the pages. I numbered the chapters. Then I sat with the pencil over the first line, and the first line did not come. It is astonishing how heavy a blank page is. You can carry a whole library of them and never once set them down.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_draughtsman_4: {
    id: 'j_draughtsman_4',
    title: 'Pencil note: at the last room',
    body: "'This is where I stopped. Not for want of a wall — walls are only lines. I stopped because finishing it means she wakes, and when she wakes I go out like a candle. I ran out of the willingness to end. If you are kinder than I am — and you would nearly have to be — finish it.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_logic_garden: {
    id: 'j_logic_garden',
    title: 'The dream asserts: rain',
    body: 'Rain here does not fall. The ground exhales, and the sky — which misses everything it has ever dropped — gathers it back in. This is why wet gardens smell of remembering.',
    category: 'lore',
    countsTowardLore: true,
  },
  j_name: {
    id: 'j_name',
    title: 'The remembered name',
    body: "The pool goes mirror-still, and in the stillness it whispers, once, in a voice you nearly know:\n'SERELLE.'\nThe name settles into your keeping, warm as a held hand. Someone worked very hard, once, at not forgetting it.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_portrait: {
    id: 'j_portrait',
    title: 'The half-erased portrait',
    body: 'Low on the sketched wall, an oval of pencil lines: a self-portrait, half rubbed out. The Draughtsman drew his own face and then took the eraser to it — slowly, you can tell, in careful strokes, the way you delete something you are trying not to love. What remains is mostly the eyes. They are tired, and kind, and familiar in a way you cannot yet place.',
    category: 'lore',
    countsTowardLore: true,
  },
  j_photograph: {
    id: 'j_photograph',
    title: 'The photograph, face-down',
    body: "On a small table the nightmare keeps carefully dusted, a photograph lies face-down. You turn it over: a woman asleep in a chair by a window, pencil still in her hand, drawings on her lap. On the back, in pencil: 'me, before.'\nThe handwriting is the Draughtsman's.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_sleeper_door: {
    id: 'j_sleeper_door',
    title: "The Sleeper's Door",
    body: 'The last door does not open onto the dream — you can hear that much through the wood. Slow breathing. A room with a window. Morning waiting in it, like a guest too polite to knock.\nThe dream asserts, quietly, for the last time: every dream is a room in the house of someone who must eventually wake.',
    category: 'lore',
    countsTowardLore: true,
  },
};
