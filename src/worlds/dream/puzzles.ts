import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * Dream-logic puzzles, fairly clued: every answer is written somewhere in a
 * scene or journal entry before it is needed, and the hint ladder rescues
 * anyone the dream out-argues.
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — Hall of Doors: the one real door (clue: j_moons)
  pz_doors: {
    id: 'pz_doors',
    type: 'rotary',
    title: 'The Door With Three Skies',
    prompt:
      'One door among the painted ones has weight, hinges, and an opinion. Its lock is three rings of tiny skies — suns, moons, and empty hours — turning around a single mark at the crown.',
    rings: [
      { id: 'lintel', positions: 6, glyphs: ['☀', '·', '·', '☾', '·', '·'] },
      { id: 'latch', positions: 8, glyphs: ['·', '·', '☀', '·', '·', '·', '☾', '·'] },
      { id: 'sill', positions: 4, glyphs: ['·', '☾', '·', '☀'] },
    ],
    // Rotation p brings glyph index (n-p)%n to the top marker.
    // Lintel: moon at index 3 of 6 -> p=3. Latch: moon at 6 of 8 -> p=2.
    // Sill: moon at 1 of 4 -> p=3. (Each sun lands exactly opposite: down.)
    answer: [3, 2, 3],
    hints: [
      'Most of these doors are paintings. The one that is not has strong feelings about astronomy.',
      "The pencil note beneath it: 'Moons up, suns down. In dreams it is always so.' Raise every moon to the crown of its ring.",
      'Turn each ring until its moon sits at the top mark: three notches on the first ring, two on the second, three on the third.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_true_door' }],
  },

  // 2 — The Stair That Climbs Itself: breaking the loop (clue: j_stair_rhyme)
  pz_stair: {
    id: 'pz_stair',
    type: 'sequence',
    title: 'The Stair, Corrected',
    prompt:
      'Four brass plates are set into the landing, each stamped with a direction of travel. The stair pretends not to watch. Step wrongly and it clears its throat and starts you over.',
    elements: [
      { id: 'up', label: 'The tread marked UP' },
      { id: 'down', label: 'The tread marked DOWN' },
      { id: 'widdershins', label: 'The tread marked WIDDERSHINS' },
      { id: 'nowhere', label: 'The tread marked NOWHERE' },
    ],
    answer: ['down', 'down', 'up', 'nowhere'],
    resetOnError: true,
    hints: [
      'The banister rhyme is instructions, not poetry. Dreams rarely know the difference.',
      "'First walk down twice as far, then once more up, and end by going nowhere.' Step exactly as the rhyme steps.",
      'Press: DOWN, DOWN, UP, NOWHERE.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_stair_breaks' },
      { type: 'unlockJournal', entry: 'j_mech_loop' },
    ],
  },

  // 3 — Upside Garden: the well's riddle (yields the smell of rain)
  pz_rain: {
    id: 'pz_rain',
    type: 'cipher',
    title: 'The Well That Rains',
    prompt:
      "A well stands beneath the hanging orchard, and thin rain climbs past it, root to sky. The well clears its throat, politely, from underfoot:\n'I arrive before I arrive — my smell walks ahead of me up every road. In the waking world I fall; here I climb. Name me, and take what is left of me.'",
    answer: 'rain',
    accept: ['the rain', 'rainfall'],
    placeholder: 'Answer the well…',
    hints: [
      'The well is not being difficult on purpose. It is asking about the thing going past it, upward, right now.',
      'What arrives smell-first, falls in the waking world, and climbs in this one?',
      "Answer: 'rain'.",
    ],
    onSolve: [
      { type: 'giveItem', item: 'idea_rain' },
      {
        type: 'narrate',
        text: 'The well draws a long breath and hands you — there is no other way to say it — the grey-sweet smell of rain arriving, folded like a handkerchief.',
      },
      { type: 'sound', cue: 'pickup' },
    ],
  },

  // 4 — Mirror Parlor: the mirror cipher (answer written reversed)
  pz_mirror: {
    id: 'pz_mirror',
    type: 'cipher',
    title: 'Written From the Far Side',
    prompt:
      'Letters stand in the fog of the vanity mirror, written from the other side of the glass:\nT H G I L N O O M\nThe mirror is confident it is being perfectly clear.',
    answer: 'moonlight',
    accept: ['moon light'],
    placeholder: 'Read the mirror aloud…',
    hints: [
      'The mirror is honest. It simply faces the other way.',
      'Read the letters the way the mirror reads you: backward.',
      "Reversed, the fog spells MOONLIGHT. Say 'moonlight'.",
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_shelf' }],
  },

  // 5 — Library of Blank Books: file the finished chapters (clue: j_chapters)
  pz_books: {
    id: 'pz_books',
    type: 'combination',
    title: 'The Catalogue of What Got Done',
    prompt:
      "The lectern holds the catalogue, open to a page with three empty squares and one line in pencil: 'File the finished chapters, in order, and the library will lend you what I lost.'",
    slots: 3,
    symbols: ['☾', '✎', '⧗', '☁', '♪', '▢'],
    answer: ['✎', '⧗', '♪'],
    hints: [
      'Only three books in this whole library have managed to have titles. Their spines are marked.',
      'The finished chapters, in the order they finished: the pencil, the hourglass, the song.',
      'Set the three squares to ✎ ⧗ ♪.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'stub_pencil' },
      { type: 'unlockJournal', entry: 'j_mech_books' },
      {
        type: 'narrate',
        text: 'A drawer slides out of the lectern with the satisfaction of a sentence ending. Inside, on a bed of pencil shavings, lies a pencil sharpened at both ends.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 6 — Moon Pool: the lullaby (clue: j_lullaby) → SIGNATURE SHIFT (remap)
  pz_lullaby: {
    id: 'pz_lullaby',
    type: 'sequence',
    title: 'The Song the Pool Knows',
    prompt:
      'Four singing stones stand around the rim, each holding one note the way a mouth holds a word. Struck in the wrong order they swallow the tune and wait, with theatrical patience, for you to begin again.',
    elements: [
      { id: 'hush', label: 'The stone that sings HUSH' },
      { id: 'low', label: 'The stone that sings LOW' },
      { id: 'high', label: 'The stone that sings HIGH' },
      { id: 'home', label: 'The stone that sings HOME' },
    ],
    answer: ['hush', 'hush', 'high', 'low'],
    resetOnError: true,
    hints: [
      'The rim of the pool has remembered the song for you. Read it the way it is carved.',
      "'Hush, hush — then high, then low.' Four notes, in the rhyme's own order.",
      'Strike: HUSH, HUSH, HIGH, LOW.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'idea_name' },
      { type: 'unlockJournal', entry: 'j_name' },
      { type: 'triggerShift', shift: 's_redraw' },
    ],
  },

  // 7 — Tide of Clocks: give back the hours (clue: j_clocks)
  pz_tide: {
    id: 'pz_tide',
    type: 'combination',
    title: 'The Tide-Lock',
    prompt:
      "Where the sea of clocks meets the sand stands a tide-lock with three brass dials, one for each of the wrong clocks, numbered one to twelve. A pencil note, damp at the corner: 'Give them back their hours and the tide will let you through.'",
    slots: 3,
    symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    answer: ['4', '11', '7'],
    hints: [
      'Each broken clock is missing, mourning, or hoarding exactly one hour. You wrote them down.',
      'The drowned clock wants its four. The backward clock is homesick for eleven. The faceless clock remembers only seven.',
      'Set the dials to 4, 11, 7.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'idea_hour' },
      { type: 'triggerShift', shift: 's_tide' },
      {
        type: 'narrate',
        text: 'The dials click home, and the smallest of the drowned clocks coughs up an hour it had been keeping — folded, warm, and exactly one hour long.',
      },
    ],
  },

  // 8 — Half-Drawn Room: finish it (near-finale; needs the drawn alcoves)
  pz_ideas: {
    id: 'pz_ideas',
    type: 'itemPlacement',
    title: 'What a Finished Room Needs',
    prompt:
      "Four small alcoves stand in the wall where you drew them, each labeled in the Draughtsman's pencil: for a name, for weather, for time, for the dark. The room is holding its breath.",
    if: { flag: 'alcovesDrawn' },
    lockedText:
      'The room has nowhere to put anything yet. The walls are only lines, and the lines are only mostly there.',
    sockets: [
      { id: 'shelf_name', label: 'The alcove drawn for a name', accepts: 'idea_name' },
      { id: 'shelf_rain', label: 'The alcove drawn for weather', accepts: 'idea_rain' },
      { id: 'shelf_hour', label: 'The alcove drawn for time', accepts: 'idea_hour' },
      { id: 'shelf_fear', label: 'The alcove drawn for the dark', accepts: 'idea_fear' },
    ],
    hints: [
      "The Draughtsman's list is in your journal: everything a finished room needs, including the part nobody wants to give it.",
      'A remembered name from the pool; the smell of rain from the well; a kept hour from the tide; a folded fear from behind the wallpaper.',
      'Place the name in the name alcove, the rain in the weather alcove, the hour in the time alcove, and the fear in the alcove for the dark.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'idea_name' },
      { type: 'removeItem', item: 'idea_rain' },
      { type: 'removeItem', item: 'idea_hour' },
      { type: 'removeItem', item: 'idea_fear' },
      {
        type: 'narrate',
        text: 'One by one the sketched lines take on weight. Floor, corners, ceiling; a smell of rain; an hour striking somewhere; a name almost said aloud; and one small, manageable dark. The room finishes itself around your gifts.',
      },
      { type: 'triggerShift', shift: 's_room_finished' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 9 — FINALE: the lullaby turned around (clue: j_backward)
  pz_wake: {
    id: 'pz_wake',
    type: 'sequence',
    title: 'The Waking',
    prompt:
      "Four chimes hang from the Sleeper's lintel — cousins of the pool-stones, holding the same four notes: HUSH, LOW, HIGH, HOME. Behind the pale door, someone is breathing slowly, and has been for a very long time.",
    elements: [
      { id: 'hush', label: 'The chime that sings HUSH' },
      { id: 'low', label: 'The chime that sings LOW' },
      { id: 'high', label: 'The chime that sings HIGH' },
      { id: 'home', label: 'The chime that sings HOME' },
    ],
    answer: ['low', 'high', 'hush', 'hush'],
    resetOnError: true,
    hints: [
      'You have sung this song before, beside a pool — going the other direction.',
      "The lullaby ran hush, hush, high, low. The note on the door: 'she will wake to it turned around.'",
      'Strike: LOW, HIGH, HUSH, HUSH.',
    ],
    onSolve: [
      {
        type: 'narrate',
        text: 'The last note is the first note, and the dream — finished at last — begins to rise, like a held breath released.',
      },
    ],
  },
};
