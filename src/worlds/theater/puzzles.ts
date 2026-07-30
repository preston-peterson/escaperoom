import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * Eight working mechanisms and one verdict. Clues live in the case file
 * (journal); hard gates are `if` conditions on flags. Solving the accusation
 * — world.finalPuzzle — closes the case.
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — Lobby: the chained house doors (clue: the muses plaques)
  pz_house_doors: {
    id: 'pz_house_doors',
    type: 'combination',
    title: 'The Chained House Doors',
    prompt:
      'A chain has been run through the door handles and locked with a house lock: four numbered wheels, each stamped with one of the Coronet\'s muses — Comedy, Tragedy, Music, Dance.',
    slots: 4,
    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['3', '8', '5', '2'],
    hints: [
      'The lobby honors its four muses in bronze. Bronze remembers numbers.',
      'The plaques under the portraits: Comedy smiled for 3 seasons, Tragedy wept for 8, Music played for 5, Dance turned for 2.',
      'Set the wheels to 3 · 8 · 5 · 2 — Comedy, Tragedy, Music, Dance.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_house_doors' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 2 — House: the pass door letter-lock (clue: playbill + stage-door board)
  pz_pass_door: {
    id: 'pz_pass_door',
    type: 'cipher',
    title: 'The Pass Door',
    prompt:
      'The little door beside the proscenium — the only legal crossing between the house and the world behind it — carries a brass letter-lock. Companies change the word weekly. The stage-door board says tonight\'s is "the Lady herself."',
    answer: 'vespertine',
    accept: ['lady vespertine', 'the lady vespertine'],
    placeholder: 'The house word…',
    hints: [
      'The word is on the playbill, if you know which lady they mean.',
      'The play\'s heroine — the role the posters call "the Lady Vespertine of our age."',
      "Spell the lady's name: VESPERTINE.",
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_pass_door' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 3 — Prompt corner: the cue transmitter (clue: Craik's flyleaf) → curtain up
  pz_cue_board: {
    id: 'pz_cue_board',
    type: 'sequence',
    title: 'The Cue Board',
    prompt:
      'The prompt corner\'s cue board: a rank of worn brass switches wired to every corner of the building. Thrown in the right order they run the top of the show. Thrown wrong, the board clunks dead and resets — the Coronet does not tolerate a bad call.',
    elements: [
      { id: 'house', label: 'HOUSE TO HALF' },
      { id: 'limes', label: 'LIMES UP' },
      { id: 'bells', label: 'BELLS FRONT' },
      { id: 'ring', label: 'RING UP' },
      { id: 'traps', label: 'TRAPS LIVE' },
    ],
    answer: ['house', 'limes', 'bells', 'ring'],
    resetOnError: true,
    hints: [
      'Every stage manager writes the top of the show somewhere close to hand.',
      'The flyleaf of Craik\'s prompt book: "house to half — limes up — bells front — ring up."',
      'Throw: HOUSE TO HALF, LIMES UP, BELLS FRONT, RING UP. Leave the traps alone.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'curtain_up' },
      { type: 'triggerShift', shift: 's_curtain' },
      { type: 'unlockJournal', entry: 'j_mech_curtain' },
    ],
  },

  // 4 — Stage: the revolve console (clue: Marlowe's marked typescript)
  pz_revolve: {
    id: 'pz_revolve',
    type: 'rotary',
    title: 'The Revolve Console',
    prompt:
      'An iron console rises from the deck at the revolve\'s edge: three concentric brass rings, each carrying one enamel emblem among blank stops, with a single mark at the crown. Set the Act III change and the stage will perform it.',
    if: { flag: 'curtain_up' },
    lockedText:
      'The console is dead and the rings are frozen. A small plate reads: INTERLOCKED WHILE CURTAIN IS IN.',
    rings: [
      { id: 'moon', positions: 6, glyphs: ['·', '·', '☾', '·', '·', '·'] },
      { id: 'door', positions: 8, glyphs: ['·', '·', '·', '·', '·', '◆', '·', '·'] },
      { id: 'garden', positions: 4, glyphs: ['·', '❀', '·', '·'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the crown mark:
    // crescent k=2,n=6 → p=4; gilt door k=5,n=8 → p=3; blossom k=1,n=4 → p=3.
    answer: [4, 3, 3],
    hints: [
      'The play itself knows how its own stage turns. Ask the author\'s copy.',
      'Marlowe\'s margin, Act III: moon ring — crescent to the mark; door ring — gilt door to the mark; garden ring — blossom to the mark.',
      'Bring the crescent, the gilt door, and the blossom each up to the crown mark.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_revolve' },
      { type: 'unlockJournal', entry: 'j_mech_revolve' },
    ],
  },

  // 5 — Fly gallery: the pin rail (clue: Barrow's painted rhyme)
  pz_pin_rail: {
    id: 'pz_pin_rail',
    type: 'sequence',
    title: 'The Pin Rail',
    prompt:
      'Arbor 7 — the Act III trap line — hangs high in the racks. Its purchase line is dogged off at the pin rail beside you. Riggers bring an arbor down to the rail in one strict order; get it wrong and the brake slams and everything must be re-dogged.',
    elements: [
      { id: 'brake', label: 'Ease the brake' },
      { id: 'purchase', label: 'Haul the purchase line' },
      { id: 'dog', label: 'Dog her off' },
      { id: 'land', label: 'Land her soft' },
      { id: 'cut', label: 'Cut her loose' },
    ],
    answer: ['brake', 'purchase', 'dog', 'land'],
    resetOnError: true,
    hints: [
      'The man who owns this rail painted his catechism where he could see it from his bench.',
      'Barrow\'s rhyme: EASE the brake. HAUL the purchase. DOG her off. LAND her soft.',
      'Ease, haul, dog, land — and never, ever cut.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'arbor_landed' },
      {
        type: 'narrate',
        text: 'Hand over hand, Arbor 7 sinks out of the dark and lands at the rail, soft as a bow. Five iron weights hang at eye level, and its tally dials wait to be proven.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 6 — Fly gallery: the arbor tally (clue: the counterweight log) → HOW
  pz_counterweight: {
    id: 'pz_counterweight',
    type: 'combination',
    title: 'Arbor 7',
    prompt:
      'The landed arbor carries a tally frame — three dials recording the hundredweights hung on its racks, top to bottom. Set the tally to what the log swears is hanging here, and what actually hangs here will have to answer for itself.',
    if: { flag: 'arbor_landed' },
    lockedText: 'Arbor 7 hangs far overhead in the racks. Land it at the rail first.',
    slots: 3,
    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['4', '1', '6'],
    hints: [
      'A rigger\'s log is scripture. Barrow\'s is in the rig shop, ruled and exact.',
      'The counterweight log, Arbor 7: 4 · 1 · 6 hundredweight — checked every night.',
      'Set the tally dials to 4 · 1 · 6.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'how_pinned' },
      { type: 'unlockJournal', entry: 'j_hollow_weight' },
      {
        type: 'narrate',
        text: 'The tally proves true — and one weight rings WRONG under your knuckle. Hollow. Bored out, packed with sawdust, painted over. The safety line was re-hung onto a lie. This is how a trapdoor becomes a weapon.',
      },
      { type: 'sound', cue: 'secret' },
    ],
  },

  // 7 — Understage: the trap winch (item: the crank from the props room)
  pz_trap_machine: {
    id: 'pz_trap_machine',
    type: 'itemPlacement',
    title: 'The Trap Winch',
    prompt:
      'The machine that killed a man: rails, cradle, drum — all sound, all patient. The winch spindle is empty; its crank was stripped and carried off with everything else the constables didn\'t understand.',
    sockets: [{ id: 'winch', label: 'The winch spindle', accepts: 'crank_handle' }],
    hints: [
      'Every loose tool in this building has exactly one home.',
      'The props room shelves things by show and by scene. Look for iron stamped TRAP.',
      'Seat the trap winch crank from the props room on the spindle and run the trap.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'crank_handle' },
      { type: 'setFlag', flag: 'ghost_dark' },
      { type: 'triggerShift', shift: 's_traps' },
      { type: 'unlockJournal', entry: 'j_mech_traps' },
    ],
  },

  // 8 — Author's box: the dispatch box letter-lock (clue: the typescript)
  pz_marlowe_desk: {
    id: 'pz_marlowe_desk',
    type: 'cipher',
    title: 'The Dispatch Box',
    prompt:
      'Odette Marlowe\'s dispatch box, black japanned tin with a ten-letter combination rail. She carried it to every rehearsal and chained it to the box rail during performances. Whatever she actually thought is in here.',
    answer: 'uncredited',
    accept: ['i am done being uncredited'],
    placeholder: 'Ten letters…',
    hints: [
      'The word she chose is the wound itself.',
      'Her title page, gone over until the pen tore: "I am done being ___________."',
      'Spell UNCREDITED.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_diary' },
      {
        type: 'narrate',
        text: 'The rail clicks home on the word she bled over. Inside: her diary, a solicitor\'s letter dated for the morning after opening — and no murder at all.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 9 — FINALE: the accusation, made from the stage
  pz_accusation: {
    id: 'pz_accusation',
    type: 'accusation',
    title: 'Name It to the House',
    prompt:
      'You stand on the apron where the limelight would find you, the case complete in your hands, six hundred empty seats waiting. A theater only believes what is performed for it. Name the who, the how, and the where — and make it hold.',
    if: {
      all: [{ flag: 'who_pinned' }, { flag: 'how_pinned' }, { flag: 'where_pinned' }],
    },
    lockedText: 'You cannot yet make this hold. Something is still missing.',
    categories: [
      {
        id: 'who',
        label: 'The Accused',
        options: [
          { id: 'dunmore', label: 'Percy Dunmore' },
          { id: 'craik', label: 'Wilhelmina Craik' },
          { id: 'reyes', label: 'Constance Reyes-Adler' },
          { id: 'marlowe', label: 'Odette Marlowe' },
          { id: 'barrow', label: 'Joss Barrow' },
        ],
      },
      {
        id: 'how',
        label: 'The Means',
        options: [
          { id: 'knife', label: 'the swapped knife' },
          { id: 'counterweight', label: 'the sabotaged counterweight' },
          { id: 'trapbolt', label: 'a loosened trap bolt' },
          { id: 'tonic', label: 'a poisoned tonic' },
          { id: 'hemp', label: 'a worn-through hemp line' },
        ],
      },
      {
        id: 'where',
        label: 'The Scene',
        options: [
          { id: 'understage', label: 'the understage' },
          { id: 'prompt', label: 'the prompt corner' },
          { id: 'fly_gallery', label: 'the fly gallery' },
          { id: 'star_room', label: 'the star dressing room' },
          { id: 'wing', label: 'the stage-right wing' },
        ],
      },
    ],
    answer: ['craik', 'counterweight', 'fly_gallery'],
    wrongFeedback:
      'The house does not believe you. Somewhere in the dark a seat creaks shut, and the silence that follows is the sound of a case falling apart.',
    hints: [
      'Everyone stared down at the trap. Ask instead what was supposed to hold the trap — and where that thing lives.',
      'The wound is a fall; the knife came later; the letters wanted him alive. So: whose hand called the cue early, whose key opens the gallery, whose initials sign the log at the half-hour?',
      'Accuse Wilhelmina Craik — the sabotaged counterweight — the fly gallery.',
    ],
    onSolve: [
      {
        type: 'narrate',
        text: 'You say the name, and the building — which has been holding its breath since the curtain fell — finally lets it out.',
      },
      { type: 'sound', cue: 'chime' },
    ],
  },
};
