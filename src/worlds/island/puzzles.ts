import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * The island's mechanism roster. Cross-room dependencies are soft (clues live
 * in other rooms' journal entries) or hard (`if` conditions on flags/items).
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — Observatory chart case (clue: orchard moondial)
  pz_starcase: {
    id: 'pz_starcase',
    type: 'combination',
    title: 'The Chart Case',
    prompt:
      'A cabinet of ash and verdigris, its door set with three brass dials — each ringed with the faces of the moon. The Wardens locked their sky away from the weather, and from the careless.',
    slots: 3,
    symbols: ['●', '◐', '○', '☾', '✶'],
    answer: ['●', '◐', '○'],
    hints: [
      'The Wardens told the moon everything. Somewhere among the trees, they wrote down what she does all night.',
      "The orchard moondial: 'FULL I rise. HALF I keep the watch. DARK I close my eye.'",
      'Set the dials full ●, half ◐, dark ○.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_starcharts' },
      { type: 'unlockJournal', entry: 'j_script' },
      {
        type: 'narrate',
        text: "The dials agree, and the case opens on rolled charts and a strip of Maren's careful print. You copy everything.",
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 2 — Lighthouse hatch (clue: Maren's script key)
  pz_hatch: {
    id: 'pz_hatch',
    type: 'cipher',
    title: 'The Bolted Hatch',
    prompt:
      "Across the hatch to the lantern room runs a line of Warden script:\n⌇ ⌵ ◇ ◇ ⍚\nBeneath it, a speaking-grate, and in Maren's pencil on the wall: 'It wants the word said aloud. It always liked her voice better than mine.'",
    answer: 'sleep',
    accept: ['asleep', 'the sleep'],
    placeholder: 'Say the word…',
    hints: [
      'The Warden letters are not a mystery — Maren already did the hard work, and locked it in with the charts.',
      "Maren's strip: ⌇ is S, ⌵ is L, ◇ is E, ⍚ is P. Read the five glyphs in order.",
      "The glyphs spell S-L-E-E-P. Say 'sleep'.",
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_hatch' }],
  },

  // 3 — The great lens (clue: observatory star charts)
  pz_lens: {
    id: 'pz_lens',
    type: 'rotary',
    title: 'The Three-Ringed Lens',
    prompt:
      'The great lens hangs in its cage of brass: three rings, each carrying one emblem among blank facets. A single index notch at the crown of the frame marks true. The glass is flawless. The dark inside it is not.',
    rings: [
      { id: 'moon', positions: 6, glyphs: ['·', '☾', '·', '·', '·', '·'] },
      { id: 'pilot', positions: 8, glyphs: ['·', '·', '·', '·', '·', '✶', '·', '·'] },
      { id: 'harbor', positions: 4, glyphs: ['·', '⌂', '·', '·'] },
    ],
    // Rotation p brings glyph index (n-p)%n to the top marker.
    // Moon at the crown: k=1, n=6 → p=5. Pilot star at the third hour
    // (a quarter-turn past the crown): top index 3, k=5 → p=5. Harbor
    // light at the nadir: top index 3, k=1 → p=1.
    answer: [5, 5, 1],
    hints: [
      'The Wardens charted exactly where each light belongs. Their sky is filed in the observatory.',
      'The charts: the MOON keeps the crown; the PILOT STAR stands at the third hour; the HARBOR LIGHT holds the nadir.',
      'Moon ☾ to the top notch. Pilot star ✶ a quarter-turn round, at the third hour. Harbor light ⌂ at the very bottom.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'beaconLit' },
      { type: 'unlockJournal', entry: 'j_mech_lens' },
      {
        type: 'narrate',
        text: 'The rings settle, and the lamp takes light with a sound like a struck match the size of a room. A slow white beam wheels out across the bay — and bends, gently, downward into the water.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4 — Maren's desk (clue: the cliff stair inscription)
  pz_desk: {
    id: 'pz_desk',
    type: 'cipher',
    title: "Maren's Word-Lock",
    prompt:
      "Maren's writing desk is locked with a rank of brass letter-wheels. A paper label in her hand, gone brown at the edges: 'What sleeps below. If you don't know it yet, you aren't ready for my drawers.'",
    answer: 'undertow',
    accept: ['the undertow'],
    placeholder: 'Spell the name…',
    hints: [
      'The Wardens carved the name into the island exactly once, where every visitor must climb past it.',
      "The cliff stair inscription: 'BELOW THE BAY THE UNDERTOW TURNS IN ITS SLEEP.'",
      "Spell 'undertow'.",
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_tidetable' },
      {
        type: 'narrate',
        text: 'The wheels roll home and the drawer slides open: a Warden tide table, one line ringed in ink, and a pressed plum blossom that crumbles at your breath.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 5 — The Ebb Peal (clue: cottage psalter) → SHIFT: low tide
  pz_bellpeal: {
    id: 'pz_bellpeal',
    type: 'sequence',
    title: 'The Ebb Peal',
    prompt:
      'Four bell ropes hang in the tower, each tail wound in a different knot: the EBB bell, deep as a closed door; the FLOOD bell, bright and eager; the HOUR bell; and the cracked FOG bell, which does not so much ring as remember ringing. A wrong stroke and the couplings below slam themselves straight in protest.',
    elements: [
      { id: 'ebb', label: 'The Ebb bell (deep)' },
      { id: 'flood', label: 'The Flood bell (bright)' },
      { id: 'hour', label: 'The Hour bell' },
      { id: 'fog', label: 'The Fog bell (cracked)' },
    ],
    answer: ['ebb', 'ebb', 'hour', 'fog'],
    resetOnError: true,
    hints: [
      'The Wardens hid their machinery in their music. Maren kept the music by her chair.',
      "The psalter, underlined twice: 'Twice call the EBB, then call the HOUR, and let the FOG bell close the bay.'",
      'Ring: Ebb, Ebb, Hour, Fog.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'tideLow' },
      { type: 'triggerShift', shift: 's_ebb' },
      { type: 'unlockJournal', entry: 'j_mech_bells' },
    ],
  },

  // 6 — The Warden door (clue: Maren's tide table)
  pz_tidelock: {
    id: 'pz_tidelock',
    type: 'combination',
    title: 'The Counterlock',
    prompt:
      'The Warden door under the square bears three numbered drums, one to nine, above a spillway grate. A small plate reads: THE DOOR COUNTS THE SPRING. Whatever that means, it has meant it for a very long time.',
    slots: 3,
    symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['9', '4', '7'],
    hints: [
      "The door counts the spring tide. Maren's desk kept the Wardens' arithmetic for it.",
      'The tide table: the spring RISES to NINE, FALLS BACK to FOUR, and STANDS SLACK at SEVEN.',
      'Set the drums 9 · 4 · 7.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_wardendoor' }],
  },

  // 7 — The engine made whole (parts from cave, cottage, tower)
  pz_engineparts: {
    id: 'pz_engineparts',
    type: 'itemPlacement',
    title: 'The Run-Down Engine',
    prompt:
      'The Tidal Engine stands open like a patient on a table: an impeller shaft spinning on nothing, a regulator stem missing its wheel, a governor hanger swinging empty. Three small absences, and a machine the size of a chapel is only weather.',
    sockets: [
      { id: 'impeller', label: 'Impeller shaft', accepts: 'eng_impeller' },
      { id: 'valve', label: 'Regulator stem', accepts: 'eng_valve' },
      { id: 'weight', label: 'Governor hanger', accepts: 'eng_weight' },
    ],
    hints: [
      'Three parts went missing a generation ago. None of them left the island.',
      'The sea kept one in its cave. Maren kept one on her mantel. The bell tower kept one among its counterweights.',
      'Seat the bronze impeller, the regulator wheel, and the governor weight.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'eng_impeller' },
      { type: 'removeItem', item: 'eng_valve' },
      { type: 'removeItem', item: 'eng_weight' },
      { type: 'setFlag', flag: 'engineFitted' },
      { type: 'unlockJournal', entry: 'j_mech_engine' },
      {
        type: 'narrate',
        text: 'Impeller, wheel, weight — three soft bronze kisses of metal on metal. The engine does not start. It does something better: it waits, the way a held instrument waits.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 8 — The flood-winch (clue: sea cave carving) → SHIFT: high tide
  pz_floodgates: {
    id: 'pz_floodgates',
    type: 'sequence',
    title: 'The Flood-Winch',
    prompt:
      'Four capstan stations command the harbor works, their chains running out through the walls into the cliff: the great BRAKE, the harbor GATE, the outer BOOM, the MILL-RACE. Wind them wrongly and the pawls slam free, and the whole bay stays where it is.',
    if: { flag: 'engineFitted' },
    lockedText:
      'The winch pawls hang slack. The engine is not whole — winding the sea into a dead machine would drown the harbor for nothing.',
    elements: [
      { id: 'brake', label: 'The great brake' },
      { id: 'gate', label: 'The harbor gate' },
      { id: 'boom', label: 'The outer boom' },
      { id: 'race', label: 'The mill-race' },
    ],
    answer: ['brake', 'gate', 'boom', 'race'],
    resetOnError: true,
    hints: [
      'The Wardens wrote the order of the flood where only the lowest tide could read it.',
      'The sea cave carving: LOOSE THE BRAKE. OPEN THE GATE. THEN THE BOOM. THEN THE RACE.',
      'Wind: Brake, Gate, Boom, Race.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'tideHigh' },
      { type: 'triggerShift', shift: 's_flood' },
    ],
  },

  // 9 — FINALE: the Quieting
  pz_quieting: {
    id: 'pz_quieting',
    type: 'sequence',
    title: 'The Quieting',
    prompt:
      'The Undertow Gate fills the cave wall, a ring of stone streaming seawater, and the dark behind it is the attentive kind. Around it, four stations: an empty lamp bracket at the crown, the linkage of the tide-wheel, a green drowned bell, and the space where you are standing, which wants nothing from you but stillness.',
    if: { hasItem: 'maren_lantern' },
    lockedText:
      "An empty bracket waits at the gate's crown, shaped for a lantern. Whatever the Wardens did here, they did it by a keeper's light — and you are not carrying one.",
    elements: [
      { id: 'lantern', label: "Hang Maren's lantern" },
      { id: 'wheel', label: 'Set the tide-wheel linkage turning' },
      { id: 'bell', label: 'Strike the drowned bell, once' },
      { id: 'silence', label: 'Stand silent' },
    ],
    answer: ['lantern', 'wheel', 'bell', 'silence'],
    resetOnError: true,
    hints: [
      'The gate itself tells you the rite, if you have read what is cut around it.',
      'LIGHT for the sleeper. MOTION for the sea. ONE BELL for the vanished. SILENCE for the keeper.',
      'Hang the lantern. Start the wheel. One bell. Then be still.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'maren_lantern' },
      {
        type: 'narrate',
        text: 'The lantern takes flame from nothing your hands did. The wheel turns. The bell speaks once and is done. And in the silence after, the sea below the gate rolls over — and settles.',
      },
    ],
  },
};
