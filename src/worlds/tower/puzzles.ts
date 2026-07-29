import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * The mechanism roster. Cross-floor dependencies are soft (clues live floors
 * away in the journal) or hard (`if` conditions on flags/items).
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — The firebox (clue: fire-plate on the Boiler Deck)
  pz_furnace: {
    id: 'pz_furnace',
    type: 'sequence',
    title: 'The Cold Firebox',
    prompt:
      'The furnace mouth gapes cold, ash banked in grey drifts. Grate, damper, coal chute, bellows — everything waits in reach, and everything remembers being done in one particular order.',
    elements: [
      { id: 'damper', label: 'Open the damper' },
      { id: 'grate', label: 'Rake the grate' },
      { id: 'coal', label: 'Feed the coal' },
      { id: 'bellows', label: 'Work the bellows' },
    ],
    answer: ['grate', 'damper', 'coal', 'bellows'],
    resetOnError: true,
    hints: [
      'The stokers did not trust memory. They trusted brass. Read the deck above.',
      'The fire-plate on the Boiler Deck: rake the grate, open the damper, feed the coal, then the bellows — gently.',
      'Rake the grate. Open the damper. Feed the coal. Work the bellows.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'furnaceLit' },
      {
        type: 'narrate',
        text: 'The coal catches with a low whoomph. Heat rolls out like a tide, and somewhere overhead a pipe begins, very quietly, to sing.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 2 — Boiler pressure (clue: the three stopped clock-gauges) → SHIFT 1
  pz_boiler: {
    id: 'pz_boiler',
    type: 'combination',
    title: 'The Pressure Drums',
    prompt:
      'Three numbered drums set the working pressure, and a red line on the master gauge waits to be reached. A tag under the drums reads: GROUND · HALL · FIRE.',
    if: { flag: 'furnaceLit' },
    lockedText: 'The gauges lie dead at zero. No fire, no steam, no argument.',
    slots: 3,
    symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['4', '7', '2'],
    hints: [
      'The low gauges wear clock faces, stopped where the pressure died. The tag says which, and in what order.',
      'GROUND, HALL, FIRE: the winding-room gauge rests at four, the pendulum hall at seven, the furnace at two.',
      'Set the drums to 4 · 7 · 2.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_steam' },
      { type: 'unlockJournal', entry: 'j_mech_boiler' },
    ],
  },

  // 3 — The dawn peal (clue: Fen's slate in the Pendulum Hall)
  pz_chimes: {
    id: 'pz_chimes',
    type: 'sequence',
    title: 'The Dawn Peal',
    prompt:
      'Four bells hang in the loft on chains gone green: the Great Bell, deep as a well; the Middle; the Treble, bright as frost; and one dull casting that answers every stroke with a dead click. Ring the peal wrong and the frame shrugs it off.',
    elements: [
      { id: 'great', label: 'The Great Bell (low)' },
      { id: 'mid', label: 'The Middle Bell' },
      { id: 'treble', label: 'The Treble Bell (high)' },
      { id: 'dull', label: 'The dead bell (rings nothing)' },
    ],
    answer: ['great', 'great', 'treble', 'mid', 'great'],
    resetOnError: true,
    hints: [
      'Someone in this tower practised a peal until they could ring it in their sleep — and wrote it down first.',
      "Fen's slate in the Pendulum Hall: LOW, LOW, HIGH, MIDDLE, LOW. Never the dead bell.",
      'Ring: Great, Great, Treble, Middle, Great.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'chimesRung' },
      { type: 'unlockJournal', entry: 'j_horo_3' },
      {
        type: 'narrate',
        text: 'Five notes, and the loft answers with a century of held dust. Below your feet, something releases — a brake bar dropping out of its keep with a satisfied clank.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4 — The cam-rings (clue: beat plates in the Chime Loft) → SHIFT 2
  pz_escapement: {
    id: 'pz_escapement',
    type: 'rotary',
    title: 'The Cam-Rings',
    prompt:
      'Three cam-rings circle the gallery hub, each carrying one bright pip among blank teeth, and a pointer at the crown marks true. The floor itself is the wheel; these rings are how you steer it.',
    if: { flag: 'chimesRung' },
    lockedText:
      'A brake bar spans the hub, bolted fast. Stamped along it: THE LOFT MUST SING BEFORE THE FLOOR MAY TURN.',
    rings: [
      { id: 'tick', positions: 12, glyphs: ['·', '·', '·', '·', '·', '·', '·', '●', '·', '·', '·', '·'] },
      { id: 'tock', positions: 12, glyphs: ['·', '·', '◆', '·', '·', '·', '·', '·', '·', '·', '·', '·'] },
      { id: 'rest', positions: 12, glyphs: ['·', '·', '·', '·', '·', '·', '·', '·', '·', '·', '○', '·'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the top marker; a glyph at
    // index k ends at hour position (k+p)%n. Tick pip (k=7) to the crown
    // needs p=5; tock (k=2) to the sixth hour needs p=4; rest (k=10) to the
    // ninth hour needs p=11.
    answer: [5, 4, 11],
    hints: [
      'The loft above the gallery keeps the beat, and its plates were made for exactly these rings.',
      'The beat plates: TICK at the crown. TOCK at the sixth hour. REST at the ninth.',
      'Bring the tick-pip to the pointer, the tock-pip to the very bottom, and the rest-pip to the ninth hour — the left hand of the dial.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_gallery_turns' },
      { type: 'unlockJournal', entry: 'j_mech_wheels' },
    ],
  },

  // 5 — The governor (parts: flyball from the condenser pool, oil from below) → SHIFT 3
  pz_governor: {
    id: 'pz_governor',
    type: 'itemPlacement',
    title: 'The Open Cage',
    prompt:
      'The governor stands at the center of the room, a spindle of brass arms crowned with flyballs — save one arm, whose cage hangs open and empty, like a hand missing a finger.',
    if: { flag: 'spindleOiled' },
    lockedText:
      'The spindle is seized solid with dry verdigris. It will not take a weight; it will not take anything.',
    sockets: [{ id: 'cage', label: 'The empty cage arm', accepts: 'governor_weight' }],
    hints: [
      'One flyball is missing, and brass does not evaporate. Think about where a dropped weight would end up.',
      'The condenser pool on the Boiler Deck has been catching what the tower drops for years. Bring oil for the spindle, too — the porter kept some below.',
      'Oil the seized spindle with the Porter’s Oil, then seat the flyball from the condenser pool in the open cage.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'governor_weight' },
      { type: 'setFlag', flag: 'governorSet' },
      { type: 'triggerShift', shift: 's_governor' },
    ],
  },

  // 6 — The Horologist's cabinet (clue: the shorthand slate)
  pz_workshop: {
    id: 'pz_workshop',
    type: 'cipher',
    title: 'The Word-Locked Cabinet',
    prompt:
      "The Horologist's cabinet is sealed with a word-plate, and across its strip runs a line of hour-numerals:\nⅣ · Ⅸ · Ⅰ · Ⅻ\nScratched beneath, small and dry: 'Twelve letters suffice.'",
    answer: 'dial',
    accept: ['the dial'],
    placeholder: 'Speak the word…',
    hints: [
      'The shorthand is the Horologist’s own — and the key to it never left this room.',
      'The bench slate: A is Ⅰ, B is Ⅱ, and so on to L at Ⅻ. Count your way along the strip.',
      "Ⅳ is D, Ⅸ is I, Ⅰ is A, Ⅻ is L. Speak 'dial'.",
    ],
    onSolve: [
      { type: 'giveItem', item: 'mainspring_key' },
      { type: 'unlockJournal', entry: 'j_horo_4' },
      {
        type: 'narrate',
        text: 'The word-plate spells itself smug and the cabinet swings wide. Inside, on a cradle of green felt: the Great Winding Key — and one more page of the ledger.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 7 — The astrolabe rings (clue: the workshop schematic) → SHIFT 4
  pz_astrolabe: {
    id: 'pz_astrolabe',
    type: 'rotary',
    title: 'The Astrolabe Rings',
    prompt:
      'Three silver rings nest around the deck’s axis — moon, wanderer, sun — each glyph adrift among blank houses. A meridian pointer crowns the rail, and the whole floor waits on the answer.',
    rings: [
      { id: 'moon', positions: 8, glyphs: ['·', '·', '·', '·', '·', '☽', '·', '·'] },
      { id: 'wanderer', positions: 8, glyphs: ['·', '·', '✶', '·', '·', '·', '·', '·'] },
      { id: 'sun', positions: 8, glyphs: ['·', '·', '·', '·', '·', '·', '·', '☉'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the top marker; a glyph at
    // index k ends at house (k+p)%n. Moon (k=5) to the crown needs p=3;
    // wanderer (k=2) to the bottom (house 4 of 8) needs p=2; sun (k=7) to
    // the third hour (house 2) needs p=3.
    answer: [3, 2, 3],
    hints: [
      'The Clockwright drew this deck before ever it was raised, and the drawing survives one floor below.',
      'The schematic: the MOON keeps the crown; the WANDERER sleeps at the bottom of the wheel; the SUN stands at the third hour.',
      'Moon to the pointer. Wanderer to the very bottom. Sun a quarter-turn round on the right — the third hour.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_deck_turns' }],
  },

  // 8 — Rewind the mainspring → SHIFT 5
  pz_mainspring: {
    id: 'pz_mainspring',
    type: 'itemPlacement',
    title: 'The Great Keyway',
    prompt:
      'The mainspring fills the vault — a coiled ribbon of steel taller than you are, asleep in its drum. At hub height, square and expectant, waits the great keyway. Somewhere the winding key still exists, or nothing in this tower matters.',
    sockets: [{ id: 'keyway', label: 'The great keyway', accepts: 'mainspring_key' }],
    hints: [
      'A key that size is not lost; it is kept. Where would a clockwright keep the one thing that must never leave the tower?',
      'The word-locked cabinet in the Clockwright’s Workshop. The bench slate teaches you how to ask it.',
      'Take the Great Winding Key from the workshop cabinet and seat it in the keyway.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'mainspring_key' },
      { type: 'setFlag', flag: 'mainspringWound' },
      { type: 'triggerShift', shift: 's_wound' },
      { type: 'unlockJournal', entry: 'j_mech_spring' },
    ],
  },

  // 9 — FINALE: set the orrery right
  pz_orrery: {
    id: 'pz_orrery',
    type: 'sequence',
    title: 'The Setting of the Sky',
    prompt:
      'The orrery hangs above the rail — sun-lamp cold, moon ring dropped from true, wander-rings tangled and still. Four stations circle the plinth, worn smooth by one pair of hands. The tower holds its breath around you.',
    elements: [
      { id: 'sun', label: 'Light the sun-lamp' },
      { id: 'moon', label: 'Set the moon ring' },
      { id: 'wanderers', label: 'Loose the wander-rings' },
      { id: 'letgo', label: 'Let go of the brake' },
    ],
    answer: ['sun', 'moon', 'wanderers', 'letgo'],
    resetOnError: true,
    hints: [
      'The Horologist closed every dusk the same way, and wrote the order down where the spring sleeps.',
      "The pinned page in the vault: 'LIGHT THE SUN. SET THE MOON. LOOSE THE WANDERERS. AND LET GO.'",
      'Light the sun-lamp. Set the moon ring. Loose the wander-rings. Then let go of the brake.',
    ],
    onSolve: [
      { type: 'narrate', text: 'You let go of the brake, and the sky takes up its own weight.' },
    ],
  },
};
