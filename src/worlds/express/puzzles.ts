import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * Eight mechanisms and one verdict. The three *_pinned flags that unlock the
 * accusation are earned on gated inspects deeper in the world; the puzzles
 * here open the train, produce the tools, and stage the evidence.
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — The customs seal on the dining-car door (clue: the cordon notice)
  pz_cordon: {
    id: 'pz_cordon',
    type: 'combination',
    title: 'The Customs Seal',
    prompt:
      'A lead customs seal clamps the dining-car door, its four brass tumblers cut with digits. Border practice: the seal is set to a minute only the post would know.',
    slots: 4,
    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['0', '4', '1', '7'],
    hints: [
      'The cordon notice on the post board records everything the border cared to write down — including a time.',
      '“The car seal is set to the minute of logging.” The hold order logs the express at a minute past four in the morning.',
      'Set the tumblers to 0 · 4 · 1 · 7 — the minute the express was logged at the border.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_cordon' }],
  },

  // 2 — The steward's bell-board (clue: the steward's call slate)
  pz_bells: {
    id: 'pz_bells',
    type: 'sequence',
    title: 'The Bell-Board',
    prompt:
      'Five numbered shutters hang dropped on the steward’s bell-board, one for each compartment that rang in the night. The pantry latch is wired through the board: serve the calls out of order and every shutter slams down again.',
    elements: [
      { id: 'b1', label: 'No. 1 — the colonel' },
      { id: 'b2', label: 'No. 2 — Mrs. Voss' },
      { id: 'b3', label: 'No. 3 — Mr. Brandt' },
      { id: 'b4', label: 'No. 4 — Miss Kohl' },
      { id: 'b5', label: 'No. 5 — Judge Blaine' },
    ],
    answer: ['b5', 'b2', 'b1', 'b4'],
    resetOnError: true,
    hints: [
      'The steward chalked the night’s calls on his slate before he was marched onto the platform.',
      'Brandy first, then warm milk, then the late supper tray, then cocoa — the slate gives each call its minute.',
      'Trip the shutters No. 5, No. 2, No. 1, No. 4 — the order of the night’s service.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'pass_key' },
      {
        type: 'narrate',
        text: 'The last shutter trips and the pantry latch sighs open. Hanging inside on its hook: the conductor’s pass key, surrendered at the border as regulations demand.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 3 — The bonded luggage cage (clue: the guard's mnemonic on the frame)
  pz_cage: {
    id: 'pz_cage',
    type: 'combination',
    title: 'The Bonded Cage',
    prompt:
      'The registered-luggage cage wears a letter-dial lock, four brass wheels of stamped capitals. Pencilled on the frame in a railwayman’s hand: “Same as ever — the coaches, front to rear.”',
    slots: 4,
    symbols: ['A', 'B', 'D', 'E', 'G', 'K', 'O', 'S'],
    answer: ['B', 'D', 'S', 'O'],
    hints: [
      'The guard never trusted his memory. His mnemonic is the train itself.',
      'Name the coaches of the Sable Express front to rear, behind the engine: Baggage, Dining, Sleepers, Observation.',
      'Set the wheels B · D · S · O.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'section_staff' },
      { type: 'unlockJournal', entry: 'j_brandt_cleared' },
      {
        type: 'narrate',
        text: 'The cage swings wide. Brandt’s crates stand guard-stamped through the whole midnight hour, his ledger tucked between them — and bonded on the top shelf, the brass section staff the crew were made to surrender.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4 — The block telegraph (clue: the signal card in the cab)
  pz_telegraph: {
    id: 'pz_telegraph',
    type: 'cipher',
    title: 'The Block Telegraph',
    prompt:
      'The cab’s block-telegraph holds the night’s punched wire roll, spooled tight behind a brass shutter. The repeater wants the night division’s watchword keyed in before it will give up its roll.',
    answer: 'karst',
    accept: ['karst junction', 'the karst junction'],
    placeholder: 'Key the watchword…',
    hints: [
      'The signal card pinned above the key names the watchword in the roundabout way of railwaymen.',
      '“Watchword of the night division: the junction that parts every train south.” The route map on the cab wall names only one junction.',
      'Key KARST.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_wire_roll' },
      {
        type: 'narrate',
        text: 'The shutter drops and the roll spools out, punch by punch. Signals, crossing orders, a weather advisory — and no telegram for Colonel Fisk anywhere in the night.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 5 — The mirror rings in No. 2 (clue: the postscript in Voss's letter)
  pz_panel: {
    id: 'pz_panel',
    type: 'rotary',
    title: 'The Mirror Rings',
    prompt:
      'The vanity mirror in compartment No. 2 sits in a frame of three engraved rings, each cut with numerals Ⅰ to Ⅷ, each turning with the oiled ease of something used often and lovingly maintained. A tiny raven is inlaid at the crown of the frame.',
    rings: [
      { id: 'door', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
      { id: 'gate', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
      { id: 'lamp', positions: 8, glyphs: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the raven at the crown.
    // Outer=Ⅶ (idx 6 → p 2), middle=Ⅲ (idx 2 → p 6), inner=Ⅴ (idx 4 → p 4).
    answer: [2, 6, 4],
    hints: [
      'The widow’s letter ends with a postscript no sister ever wrote. Read it as instructions.',
      '“Seven over the door, three on the gate, five on the lamp” — and the rings are named door, gate, lamp, outermost first.',
      'Bring Ⅶ to the raven on the outer ring, Ⅲ on the middle, Ⅴ on the inner.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_panel' },
      { type: 'unlockJournal', entry: 'j_panel' },
    ],
  },

  // 6 — The porter's rota drum (clue: the rota card — which is also the timeline)
  pz_lamps: {
    id: 'pz_lamps',
    type: 'sequence',
    title: 'The Rota Drum',
    prompt:
      'The porter’s station keeps a rota drum: five car-plates to be racked in the order of his lamp round. Rack them wrong and the drum throws the lot back into your hands with a clatter.',
    elements: [
      { id: 'baggage', label: 'Baggage car' },
      { id: 'dining', label: 'Dining car' },
      { id: 'sleeper_a', label: 'Sleeper A' },
      { id: 'sleeper_b', label: 'Sleeper B' },
      { id: 'observation', label: 'Observation car' },
    ],
    answer: ['baggage', 'dining', 'sleeper_a', 'sleeper_b', 'observation'],
    resetOnError: true,
    hints: [
      'The rota card is pinned right beside the drum. The porter walked the same round every night for years.',
      'He trims front to rear: baggage at 23:20, dining at 23:30, the sleepers in turn, the observation car last.',
      'Rack the plates: Baggage, Dining, Sleeper A, Sleeper B, Observation.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'trimmed_lamp' },
      {
        type: 'narrate',
        text: 'The drum accepts the round and unlocks the porter’s locker beneath: wicks, scissors, and one lamp already trimmed and filled, waiting for a round that never finished.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 7 — The dead bracket in the observation saloon
  pz_bracket: {
    id: 'pz_bracket',
    type: 'itemPlacement',
    title: 'The Dead Bracket',
    prompt:
      'The rear saloon is a cave of shapes — the porter never got his lamp in here. The wall bracket by the corner chair stands empty, its mantle cold.',
    sockets: [{ id: 'bracket', label: 'The empty lamp bracket', accepts: 'trimmed_lamp' }],
    hints: [
      'You cannot read a dark room. The porter’s station equips his whole round.',
      'The rota drum in the rear corridor guards the porter’s locker — and a lamp already trimmed.',
      'Seat the trimmed lamp in the saloon’s empty bracket.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'trimmed_lamp' },
      { type: 'setFlag', flag: 'obs_lit' },
      {
        type: 'narrate',
        text: 'The lamp takes the bracket and the saloon steps out of the dark: velvet chairs, curtained glass — and every small thing the last hour of a man’s life left behind.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 8 — The shunter's order-frame → THE JUNCTION DECOUPLING
  pz_shunt: {
    id: 'pz_shunt',
    type: 'itemPlacement',
    title: 'The Order-Frame',
    prompt:
      'Bolted by the rear gangway, the shunter’s order-frame: a marshal sheet clipped in its window, a socket for the section staff gaping empty. The yard will not move a wheel without the staff seated — and the rear cars wait on the siding order.',
    sockets: [{ id: 'order_frame', label: 'The staff socket', accepts: 'section_staff' }],
    hints: [
      'The frame wants the single-line token. Crews surrender it at the border — to the bonded cage, with everything else of value.',
      'The bonded cage in the baggage car opens to the guard’s letter-dial. The staff is inside.',
      'Seat the brass section staff in the order-frame’s socket.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'section_staff' },
      { type: 'triggerShift', shift: 's_junction' },
      { type: 'unlockJournal', entry: 'j_mech_marshal' },
      { type: 'unlockJournal', entry: 'j_stasny_cleared' },
      {
        type: 'narrate',
        text: 'The order-frame stamps the marshal sheet and spits it into your hands: every re-lettering of the night set down in yard ink — Karst Junction, 23:47, cars drawn and re-coupled mid-run.',
      },
    ],
  },

  // 9 — FINALE: the inquiry docket
  pz_accuse: {
    id: 'pz_accuse',
    type: 'accusation',
    title: 'The Inquiry Docket',
    prompt:
      'The cordon box waits on the border platform, its slot cut for one docket. Three lines to fill, in ink, past crossing-out: the accused, the means, the scene. The border court holds what the train can prove — and nothing else.',
    if: {
      all: [{ flag: 'who_pinned' }, { flag: 'how_pinned' }, { flag: 'where_pinned' }],
    },
    lockedText: 'You cannot yet make this hold. Something is still missing.',
    categories: [
      {
        id: 'who',
        label: 'The Accused',
        options: [
          { id: 'o_voss', label: 'Adeline Voss' },
          { id: 'o_brandt', label: 'Otto Brandt' },
          { id: 'o_kohl', label: 'Elsa Kohl' },
          { id: 'o_stasny', label: 'Marek Stasny' },
          { id: 'o_blaine', label: 'Hector Blaine' },
        ],
      },
      {
        id: 'how',
        label: 'The Means',
        options: [
          { id: 'o_sashcord', label: 'the curtain sash-cord' },
          { id: 'o_nightcap', label: 'a poisoned nightcap' },
          { id: 'o_couplingpin', label: 'a coupling pin' },
          { id: 'o_pickwire', label: 'a lock-pick wire' },
          { id: 'o_windowsash', label: 'the window sash' },
        ],
      },
      {
        id: 'where',
        label: 'The Scene',
        options: [
          { id: 'o_observation', label: 'the observation car' },
          { id: 'o_ownberth', label: 'his own berth' },
          { id: 'o_diningcar', label: 'the dining car' },
          { id: 'o_baggagecar', label: 'the baggage car' },
          { id: 'o_platform', label: 'the border platform' },
        ],
      },
    ],
    answer: ['o_voss', 'o_sashcord', 'o_observation'],
    wrongFeedback:
      'The docket comes back through the cordon slot, stamped once in red: INSUFFICIENT — THE BORDER COURT WILL NOT HOLD THIS. The train stands silent, keeping the rest of its evidence exactly where you left it.',
    hints: [
      'Fill nothing in that the journal cannot say twice over. Who wrote the summons? What left the mark? Where did the pipe go out?',
      'The hand on the telegram, the panel behind the mirror, the bare curtain-ring, the furrow on the collar, the ash on the sill, the porter’s dark saloon — line them up.',
      'Accuse Adeline Voss; the means, the curtain sash-cord; the scene, the observation car.',
    ],
    onSolve: [
      {
        type: 'narrate',
        text: 'The docket drops, the cordon bell rings once, and far up the platform a lamp turns green. The border court will hold this. It will hold.',
      },
    ],
  },
};
