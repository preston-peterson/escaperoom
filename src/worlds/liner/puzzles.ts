import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * Eight working puzzles plus the accusation. The three keystone flags —
 * who_pinned / how_pinned / where_pinned — gate the finale; each lands on a
 * required puzzle's onSolve or a gated inspect (see rooms.ts for the latter).
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — Grand Salon: the master-at-arms key box (clue: the salon slate)
  pz_barlock: {
    id: 'pz_barlock',
    type: 'combination',
    title: 'The Master-at-Arms Key Box',
    prompt:
      'A small iron box bolted behind the bar, its dial ringed with card suits. The master-at-arms keeps the spare keys here — and, half the ship jokes, sets the combination from the card table.',
    slots: 3,
    symbols: ['♠', '♥', '♦', '♣'],
    answer: ['♠', '♦', '♠'],
    hints: [
      'The combination is a joke the whole smoking room is in on — something about the last hands of the night.',
      "The chalked slate by the card table records the night's final hands, suit by suit.",
      'Set the dial to spade, diamond, spade.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'office_key' },
      { type: 'unlockJournal', entry: 'j_sus_quill2' },
      {
        type: 'narrate',
        text: "The box swings open on a spare office key and a confiscated fold of Quill's markers. You read the initials on the thickest bundle twice.",
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 2 — Purser's office: the key rack letter dials (clue: standing orders, linen room)
  pz_keyrack: {
    id: 'pz_keyrack',
    type: 'combination',
    title: 'The Key Rack',
    prompt:
      'The cabin-key rack is a locked cupboard with four brass letter dials. Every stateroom key aboard hangs behind this little door — and so, per regulations, does the master-key log.',
    slots: 4,
    symbols: ['A', 'D', 'E', 'K', 'N', 'R', 'T', 'W'],
    answer: ['D', 'A', 'W', 'N'],
    hints: [
      "Crew spaces post the things crew are meant to remember. Somebody's standing orders will name the rack code.",
      "The steward's standing orders over the linen press: 'the rack answers to the letter code' — four letters, this crossing.",
      'Spell D-A-W-N on the dials.',
    ],
    onSolve: [
      { type: 'giveItem', item: 'cabin_key' },
      {
        type: 'narrate',
        text: 'The cupboard opens on ranked brass keys — Stateroom Twelve\'s among them — and a slim logbook the purser would rather you had never seen.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 3 — Stateroom Twelve: Marguerite's chained valise (clue: her own habit-rhyme)
  pz_valise: {
    id: 'pz_valise',
    type: 'sequence',
    title: "The Courier's Valise",
    prompt:
      'Her working valise, chained to the berth frame, closed with four sliding latches marked for the compass. A card in her hand is tucked under the strap: "W. twice, then N., then E. — habit is a lock nobody picks."',
    elements: [
      { id: 'north', label: 'Slide the North latch' },
      { id: 'south', label: 'Slide the South latch' },
      { id: 'east', label: 'Slide the East latch' },
      { id: 'west', label: 'Slide the West latch' },
    ],
    answer: ['west', 'west', 'north', 'east'],
    resetOnError: true,
    hints: [
      'She wrote the order down herself and hid it in plain sight, the way careful people do.',
      'The card under the strap: west twice, then north, then east.',
      'Slide West, West, North, East.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_cl_cipher' },
      { type: 'unlockJournal', entry: 'j_lore_memo' },
      { type: 'setFlag', flag: 'memo_key' },
      {
        type: 'narrate',
        text: 'The valise opens on her memo book and a worked-out letter key to the bill-of-lading code. She was already halfway to the answer. You intend to finish her arithmetic.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4 — The manifest cipher → WHO. Requires the torn page and her letter key.
  pz_manifest: {
    id: 'pz_manifest',
    type: 'cipher',
    title: 'The Manifest Cipher',
    prompt:
      "The torn manifest page, spread flat under the desk lamp. Read down the consignment column with Marguerite's letter key — ⚓ D · ✶ U · ☾ Q · ⚙ E · ▲ S · ☰ N — and the coded ledger gives up the name its debts are entered under:\n⚓ ✶ ☾ ✶ ⚙ ▲ ☰ ⚙",
    if: { all: [{ hasItem: 'manifest_page' }, { flag: 'memo_key' }] },
    lockedText:
      'Columns of coded consignor marks, meaningless without the page in hand and a key to read it by. The courier had a key. Find her work.',
    answer: 'duquesne',
    accept: ['emile duquesne', 'the purser', 'duquesne the purser'],
    placeholder: 'Name the account…',
    hints: [
      'Her key gives one letter per consignor mark. Read the marks down the column, in order.',
      '⚓ is D, ✶ is U, ☾ is Q, ⚙ is E, ▲ is S, ☰ is N. Eight marks, eight letters.',
      "The marks spell D-U-Q-U-E-S-N-E. Name 'Duquesne'.",
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_ev_debts' },
      { type: 'unlockJournal', entry: 'j_sus_duquesne2' },
      { type: 'setFlag', flag: 'who_pinned' },
      {
        type: 'narrate',
        text: 'Debt by debt, the cargo ledger spells the purser\'s own name. Set beside the gap in his key log, the WHO of it stops being a question.',
      },
      { type: 'sound', cue: 'chime' },
    ],
  },

  // 5 — Service stair: the watertight-door test panel (clue: the drill bill)
  pz_bulkhead: {
    id: 'pz_bulkhead',
    type: 'sequence',
    title: 'The Watertight Door Panel',
    prompt:
      'Four brass switches on the stair test panel, one per bulkhead frame. Cycled out of drill order the frames rack and slam every door shut again in protest.',
    elements: [
      { id: 'fore', label: 'Fore frame' },
      { id: 'amid', label: 'Amidships frame' },
      { id: 'aft', label: 'Aft frame' },
      { id: 'well', label: 'Well frame' },
    ],
    answer: ['aft', 'fore', 'aft', 'amid'],
    resetOnError: true,
    hints: [
      'There is a drill order, and the crew who live by it keep copies where they work.',
      "The cook's grease-thumbed drill bill: AFT — FORE — AFT — AMIDSHIPS.",
      'Throw: Aft, Fore, Aft, Amidships.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_bulkhead' }],
  },

  // 6 — Winch flat: the stevedore ring-lock on the hold hatch (clue: Reyes's note)
  pz_hold_hatch: {
    id: 'pz_hold_hatch',
    type: 'rotary',
    title: "The Stevedore's Rings",
    prompt:
      'Three concentric rings guard the hold hatch, each carrying a single emblem among blank stops — an anchor, a star, a moon. A brass crown at the top of the lock marks true.',
    rings: [
      { id: 'anchor', positions: 6, glyphs: ['·', '·', '⚓', '·', '·', '·'] },
      { id: 'star', positions: 8, glyphs: ['·', '·', '·', '·', '·', '✶', '·', '·'] },
      { id: 'moon', positions: 4, glyphs: ['·', '☾', '·', '·'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the top marker:
    // anchor idx 2 of 6 → p=4; star idx 5 of 8 → p=3; moon idx 1 of 4 → p=3.
    answer: [4, 3, 3],
    hints: [
      "It is a stevedores' lock. A stevedore's instructions will be written somewhere a stevedore works.",
      "Reyes's note by the load placard: 'CROWN ALL THREE — anchor, star, and moon each brought to the top mark.'",
      'Turn each ring until its emblem sits under the brass crown: anchor, star, and moon all at the top.',
    ],
    onSolve: [{ type: 'triggerShift', shift: 's_hatch' }],
  },

  // 7 — Galley: restore the dumbwaiter → the killer's route, WHERE clue 2
  pz_dumbwaiter: {
    id: 'pz_dumbwaiter',
    type: 'itemPlacement',
    title: 'The Dumbwaiter',
    prompt:
      'The galley dumbwaiter runs a shaft straight down into the hold — but its crank spindle is bare metal, freshly wrenched. No cook removes his own crank mid-crossing.',
    if: { hasItem: 'dumbwaiter_crank' },
    lockedText:
      'The crank spindle is empty. Someone took the handle — and meant the shaft to stay unridden behind them.',
    sockets: [{ id: 'spindle', label: 'Empty crank spindle', accepts: 'dumbwaiter_crank' }],
    hints: [
      'The crank was not lost. It was hidden — by someone who wanted this little road closed behind him.',
      "You found a crank wrapped in a rag behind the ledgers in the purser's office. Cooks do not file their tools under accounts.",
      'Seat the dumbwaiter crank on the spindle and wind the car up.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'dumbwaiter_crank' },
      { type: 'triggerShift', shift: 's_dumbwaiter' },
      { type: 'unlockJournal', entry: 'j_ev_dumbwaiter' },
      { type: 'setFlag', flag: 'dumbwaiter_open' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 8 — Cargo hold: open crate seven
  pz_crate: {
    id: 'pz_crate',
    type: 'itemPlacement',
    title: 'Crate Seven',
    prompt:
      'Crate seven, chalked for offload at the next port, re-nailed with too many nails by someone in a hurry to be elsewhere. The lid wants leverage.',
    if: { hasItem: 'cargo_hook' },
    lockedText: 'The lid of crate seven is nailed down tight. Bare hands will not shift it.',
    sockets: [{ id: 'lid', label: 'Under the lid edge', accepts: 'cargo_hook' }],
    hints: [
      'You need purchase under the lid edge. Dock workers solved this problem a century ago.',
      'A cargo hook hangs in the winch flat, one deck up through the hatch.',
      'Work the cargo hook under the lid of crate seven and lean.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'cargo_hook' },
      { type: 'unlockJournal', entry: 'j_lore_crate' },
      {
        type: 'narrate',
        text: 'The nails give one long cry, and crate seven is a crate no longer. You take off your hat.',
      },
      { type: 'sound', cue: 'thud' },
    ],
  },

  // 9 — FINALE: the accusation
  pz_accusation: {
    id: 'pz_accusation',
    type: 'accusation',
    title: 'The Charge',
    prompt:
      'Your inquiry desk on the emptied promenade: three lines on the charge sheet, and a ship due in port. The Line asked for the who, the how, and the where — and for a charge that holds.',
    if: {
      all: [{ flag: 'who_pinned' }, { flag: 'how_pinned' }, { flag: 'where_pinned' }],
    },
    lockedText: 'You cannot yet make this hold. Something is still missing.',
    categories: [
      {
        id: 'who',
        label: 'The Accused',
        options: [
          { id: 'duquesne', label: 'Emile Duquesne' },
          { id: 'crane', label: 'Vivienne Crane' },
          { id: 'reyes', label: 'Tomas Reyes' },
          { id: 'quill', label: 'Balthazar Quill' },
          { id: 'marsh', label: 'Nella Marsh' },
        ],
      },
      {
        id: 'how',
        label: 'The Means',
        options: [
          { id: 'winch_handle', label: 'the brass winch handle' },
          { id: 'railing', label: 'the broken railing' },
          { id: 'draught', label: 'a sleeping draught' },
          { id: 'cargo_net', label: 'a cargo net' },
          { id: 'shovel', label: "a stoker's shovel" },
        ],
      },
      {
        id: 'where',
        label: 'The Scene',
        options: [
          { id: 'cargo_hold', label: 'the cargo hold' },
          { id: 'promenade_rail', label: 'the promenade rail' },
          { id: 'stateroom', label: 'Stateroom Twelve' },
          { id: 'engine_room', label: 'the engine room' },
          { id: 'salon', label: 'the Grand Salon' },
        ],
      },
    ],
    answer: ['duquesne', 'winch_handle', 'cargo_hold'],
    wrongFeedback:
      "The master-at-arms hears you out, squares the charge sheet, and hands it back. 'It will not hold before the company court, agent. Look again at what the ship is telling you.'",
    hints: [
      'Charge only what two pieces of evidence agree on. The staged and the planted were bought cheap; the truth cost the killer something.',
      'The ledger and the key log name the man. The bracket and the scratch name the brass. The tally and the dumbwaiter name the deck.',
      'Accuse Emile Duquesne — the brass winch handle — the cargo hold.',
    ],
    onSolve: [
      {
        type: 'narrate',
        text: 'The master-at-arms reads it once, and this time he reaches for the irons. On the deck below, a cabin door is knocked upon, quite politely, for the last time.',
      },
      { type: 'sound', cue: 'chime' },
    ],
  },
};
