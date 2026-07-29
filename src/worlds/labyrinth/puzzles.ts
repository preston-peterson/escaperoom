import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * The mechanism roster. Cross-room dependencies are soft (clues live in other
 * rooms' journal entries) or hard (`if` conditions on flags/items).
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — Gatehouse stone dial (clue: entrance stair glyphs)
  pz_gatehouse: {
    id: 'pz_gatehouse',
    type: 'combination',
    title: 'The Gatehouse Dial',
    prompt:
      'Four stone dials are set into the slab, each ringed with glyphs. The recesses are worn smooth by hands a thousand years gone.',
    if: { flag: 'torchLit' },
    lockedText: 'It is far too dark to make out the glyphs. You need light.',
    slots: 4,
    symbols: ['◐', '△', '☰', '✶', '◇', '☾'],
    answer: ['◐', '△', '☰', '✶'],
    hints: [
      'The stairway you descended was not silent — its walls repeated something, over and over.',
      'Four glyphs, always in the same order: half-moon, mountain, river, star. Your journal recorded them.',
      'Set the dials to ◐ △ ☰ ✶ — half-moon, mountain, river, star.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_gatehouse' },
      { type: 'unlockJournal', entry: 'j_mech_chimes' },
    ],
  },

  // 2 — Sluice levers (clue: cistern mural) → SHIFT 1
  pz_sluice: {
    id: 'pz_sluice',
    type: 'sequence',
    title: 'The Four Sluices',
    prompt:
      'Four great levers, each marked with a station of the water. Pull them in the wrong order and the channels slam shut again in protest.',
    elements: [
      { id: 'weir', label: 'The Weir' },
      { id: 'deep', label: 'The Deep' },
      { id: 'spring', label: 'The Spring' },
      { id: 'culvert', label: 'The Culvert' },
    ],
    answer: ['spring', 'weir', 'culvert', 'deep'],
    resetOnError: true,
    hints: [
      'Water knows its own order. Somewhere nearby, the Builders painted its journey.',
      'The cistern mural: it RISES at the Spring, CROSSES the Weir, FALLS through the Culvert, RESTS in the Deep.',
      'Pull: Spring, Weir, Culvert, Deep.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'drained' },
      { type: 'triggerShift', shift: 's_drowned' },
      { type: 'unlockJournal', entry: 'j_mech_sluice' },
    ],
  },

  // 3 — Counterweight balance (clue: gallery inscriptions)
  pz_vault: {
    id: 'pz_vault',
    type: 'combination',
    title: 'The Counterweight Balance',
    prompt:
      'Three balance pans hang from a mechanism lost in the ceiling gloom, each pan stamped with a beast: the Ox, the Heron, the Serpent. Stone counters wait in a hopper, numbered one to nine.',
    slots: 3,
    symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['7', '2', '9'],
    hints: [
      'The beasts and their burdens are written where the water used to stand.',
      'The drowned gallery inscription: the Ox carries seven, the Heron two, the Serpent nine.',
      'Ox 7 · Heron 2 · Serpent 9.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'sigil_gear' },
      { type: 'unlockJournal', entry: 'j_serpent_gear' },
      { type: 'narrate', text: 'The pans settle level. A drawer of stone slides open, offering a carved disc.' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4a — Seat the bronze gear
  pz_gearsocket: {
    id: 'pz_gearsocket',
    type: 'itemPlacement',
    title: 'The Silent Axle',
    prompt:
      'In the heart of the gear-train, one axle spins free, its gear long gone. Every wheel downstream of it stands dead still.',
    sockets: [{ id: 'axle', label: 'Empty axle', accepts: 'bronze_gear' }],
    hints: [
      'The train is missing exactly one tooth-wheel. Where would a century of floodwater hide something bronze?',
      'The Flooded Gallery is flooded no longer. Search where the water used to be.',
      'Take the Bronze Gear from the drained gallery and seat it on the empty axle.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'bronze_gear' },
      { type: 'setFlag', flag: 'gearSeated' },
      { type: 'unlockJournal', entry: 'j_mech_gears' },
      { type: 'narrate', text: 'The gear seats with a deep, satisfying CLUNK. The axle takes its weight.' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4b — Align the rings (clue: vault plaques)
  pz_gearalign: {
    id: 'pz_gearalign',
    type: 'rotary',
    title: 'The Alignment Dial',
    prompt:
      'Three concentric stone rings, each bearing one emblem among blank scales. A single notch at the crown of the dial marks true.',
    if: { flag: 'gearSeated' },
    lockedText: 'The rings are frozen fast. An axle turns nothing without its gear.',
    rings: [
      { id: 'sun', positions: 6, glyphs: ['·', '·', '☀', '·', '·', '·'] },
      { id: 'wave', positions: 8, glyphs: ['·', '·', '·', '·', '·', '·', '∿', '·'] },
      { id: 'flame', positions: 4, glyphs: ['·', '▲', '·', '·'] },
    ],
    // Rotation p turns the ring p/n of a full circle clockwise; a glyph at
    // index k starts at angle k/n·360−90. Sun (k=2) to the top needs p=4;
    // wave (k=6) to the third hour (0°) needs p=4; flame (k=1) to the
    // bottom (90°) needs p=1.
    answer: [4, 4, 1],
    hints: [
      'Bronze plaques in the Counterweight Vault speak of the sun, the wave, and the flame.',
      'The sun keeps the crown of the sky; the wave stands at the third hour; the flame sleeps at the bottom of the world.',
      'Sun at the top marker. Wave a quarter-turn round (the third hour). Flame at the very bottom.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'gearsAligned' },
      { type: 'narrate', text: 'Deep in the walls, a train of gears begins to turn — slow, patient, immense.' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 5 — Chimes of the Hall (clue: drip rhythm) → SHIFT 2
  pz_chimes: {
    id: 'pz_chimes',
    type: 'sequence',
    title: 'The Chime-Stones',
    prompt:
      'Five chime-stones hang from the vaulted ceiling on chains of bronze. The RAIN-stone rings quick and bright; the STONE-stone tolls slow and heavy. The rest hang silent and strange.',
    if: { flag: 'gearsAligned' },
    lockedText:
      'You strike a chime-stone. It gives a dead click — no resonance at all. Something in the walls is not turning.',
    elements: [
      { id: 'rain', label: 'Rain-stone (quick, bright)' },
      { id: 'wind', label: 'Wind-stone' },
      { id: 'stone', label: 'Stone-stone (slow, heavy)' },
      { id: 'hollow', label: 'Hollow-stone' },
    ],
    answer: ['rain', 'rain', 'rain', 'stone', 'stone'],
    resetOnError: true,
    hints: [
      'The cistern ceiling has been keeping rhythm for a thousand years. Listen to your notes.',
      'Three quick drops, a breath, then two slow heavy ones: quick-quick-quick … drum … drum.',
      'Strike: Rain, Rain, Rain, Stone, Stone.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_hall_turns' },
      { type: 'unlockJournal', entry: 'j_vell_2' },
    ],
  },

  // 6 — The Builders' cipher (clue: scriptorium glyph table)
  pz_crypt: {
    id: 'pz_crypt',
    type: 'cipher',
    title: 'The Sealed Niche',
    prompt:
      "Across the niche's seal runs a line of the old script:\n◐ △ ☰ ◐ ✶\nBeneath it, in Vell's pencil: 'It wants the word spoken, not the glyphs traced.'",
    answer: 'ember',
    accept: ['the ember'],
    placeholder: 'Speak the word…',
    hints: [
      "The Builders' letters are not a mystery — Vell already did the hard work in the Scriptorium.",
      "Vell's table: ◐ is E, △ is M, ☰ is B, ✶ is R. Read the seal's five glyphs in order.",
      "The glyphs spell E-M-B-E-R. Speak 'ember'.",
    ],
    onSolve: [
      { type: 'giveItem', item: 'sigil_glyph' },
      { type: 'unlockJournal', entry: 'j_serpent_glyph' },
      { type: 'unlockJournal', entry: 'j_mech_glyph' },
      { type: 'narrate', text: 'The seal splits along seams invisible a heartbeat ago. Within the niche lies a carved disc, and more of Vell’s pages.' },
      { type: 'unlockJournal', entry: 'j_vell_crypt' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 7 — The Serpent Gate: sigils
  pz_serpent_sigils: {
    id: 'pz_serpent_sigils',
    type: 'itemPlacement',
    title: "The Serpent's Brow",
    prompt:
      "Three round sockets gape in the serpent's brow — one wave-marked, one wheel-marked, one letter-marked. The stone seems to wait.",
    sockets: [
      { id: 'water', label: 'Wave socket', accepts: 'sigil_water' },
      { id: 'gear', label: 'Wheel socket', accepts: 'sigil_gear' },
      { id: 'glyph', label: 'Letter socket', accepts: 'sigil_glyph' },
    ],
    hints: [
      'Each wing of the labyrinth guarded a carved disc. Water, wheel, word.',
      'The Water Sigil lies beyond the drained gallery; the Gear Sigil in the Counterweight Vault; the Glyph Sigil in the crypt niche.',
      'Place all three sigils: wave to wave, wheel to wheel, letter to letter.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'sigil_water' },
      { type: 'removeItem', item: 'sigil_gear' },
      { type: 'removeItem', item: 'sigil_glyph' },
      { type: 'setFlag', flag: 'sigilsPlaced' },
      { type: 'narrate', text: 'Three discs, three soft concussions of stone on stone. The serpent’s eyes kindle ember-red.' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 8 — The Serpent Gate: rings → SHIFT 3
  pz_serpent_rings: {
    id: 'pz_serpent_rings',
    type: 'rotary',
    title: 'The Serpent Rings',
    prompt:
      "Three rings of numbered notches coil around the serpent's jaw, Ⅰ to Ⅷ. A fang at the crown marks true. The sigils' backs each carried a line.",
    if: { flag: 'sigilsPlaced' },
    lockedText: 'The rings will not turn while the sockets stand empty.',
    rings: [
      { id: 'drink', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
      { id: 'turn', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
      { id: 'speak', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
    ],
    // Ring rotation p brings glyph index (n-p)%n to the top marker.
    // Outer=drinks at Ⅳ (idx 3 → p 5), middle=turns at Ⅵ (idx 5 → p 3),
    // inner=speaks at Ⅰ (idx 0 → p 0).
    answer: [5, 3, 0],
    hints: [
      'Turn the backs of the sigils to the light — the serpent told you everything.',
      'It DRINKS at the fourth notch, TURNS at the sixth, SPEAKS at the first. Outer ring first.',
      'Bring Ⅳ to the fang on the outer ring, Ⅵ on the middle, Ⅰ on the inner.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_serpent' }],
  },

  // 9 — FINALE: the Heart ritual
  pz_heart: {
    id: 'pz_heart',
    type: 'sequence',
    title: 'The Feeding of the Ember',
    prompt:
      'The Ember of the First Fire sleeps in its cradle of black iron, small as a heart and old as the mountain. Around it, four stations: a ewer of the last cistern water, a small silver wheel, a speaking-horn of bronze, and the open air of your own lungs.',
    elements: [
      { id: 'water', label: 'Pour the water' },
      { id: 'wheel', label: 'Spin the wheel' },
      { id: 'word', label: 'Speak the word' },
      { id: 'breath', label: 'Breathe on the Ember' },
    ],
    answer: ['water', 'wheel', 'word', 'breath'],
    resetOnError: true,
    hints: [
      'The labyrinth itself taught you this order, one wing at a time.',
      "The Serpent Gate's inscription: 'Feed it as we fed it: water, wheel, word — and breath.'",
      'Pour the water. Spin the wheel. Speak the word. Then breathe.',
    ],
    onSolve: [
      { type: 'narrate', text: 'The Ember takes your breath and blooms.' },
    ],
  },
};
