import type { PuzzleDef, PuzzleId } from '../../engine/types.ts';

/**
 * Eight mechanisms and one verdict. The three keystone beats — the medicine
 * chest (WHO), the tantalus (HOW), and the boiler thaw's drag marks (WHERE) —
 * pin the accusation's gate flags; the dispatch box and the tantalus also
 * carry the two red-herring refutations on the mandatory path.
 */
export const puzzles: Record<PuzzleId, PuzzleDef> = {
  // 1 — The study door (combination). Clue: the parlor portrait (j_lore_wren).
  pz_study_door: {
    id: 'pz_study_door',
    type: 'combination',
    title: 'The Study Letter-Lock',
    prompt:
      'Where a keyhole should be, three brass dials of letters. The constable’s men broke the door to reach the body, and Mrs. Tabb had the hinges repaired and the lock re-shot before the evacuation — “a house keeps its habits,” her note says, “and the letters are his own.”',
    slots: 3,
    symbols: ['A', 'E', 'I', 'L', 'N', 'V', 'W', 'Y'],
    answer: ['I', 'V', 'Y'],
    hints: [
      'Mrs. Tabb told the constable that Wren’s letter-locks were always set to family.',
      'What family did Aldous Wren have left? Three letters of her live in this house.',
      'Set the dials to I, V, Y.',
    ],
    onSolve: [
      { type: 'triggerShift', shift: 's_study' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 2 — The tantalus (rotary): HOW keystone + the sill refutation.
  pz_tantalus: {
    id: 'pz_tantalus',
    type: 'rotary',
    title: 'The Tantalus',
    prompt:
      'On the sideboard by the study window, the tantalus grips its decanters behind a lock of three pictured rings — moon, star, sun — with a single notch at the crown. One glass stands out of the rack, drained. The rack is what Wren toasted to, every night of his life.',
    rings: [
      { id: 'moon', positions: 6, glyphs: ['·', '·', '☾', '·', '·', '·'] },
      { id: 'star', positions: 8, glyphs: ['·', '·', '·', '·', '·', '✶', '·', '·'] },
      { id: 'sun', positions: 4, glyphs: ['·', '·', '·', '☀'] },
    ],
    // Rotation p brings glyph index (n−p)%n to the top marker; a glyph at
    // index k sits at angle k/n·360−90+p/n·360. Moon (k=2, n=6) to the top
    // needs p=4; star (k=5, n=8) to the morning hour (0°, the third hour)
    // needs p=5; sun (k=3, n=4) to the bottom of the dial needs p=3.
    answer: [4, 5, 3],
    hints: [
      'The whole household could recite his nightly toast; the portrait’s story records it.',
      '“The moon at its height, the star at the morning hour, the sun gone under.”',
      'Moon to the top notch; star a quarter-turn round, where morning stands; sun to the very bottom.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'how_pinned' },
      { type: 'unlockJournal', entry: 'j_ev_decanter' },
      {
        type: 'narrate',
        text: 'The rack springs open, and as you lift the decanter to the light your sleeve drags the curtain wide — and you finally see the famous sill straight on. Square-edged snow on the INNER ledge, undrifted, dry underneath. Laid there. By hand. From inside.',
      },
      { type: 'unlockJournal', entry: 'j_ev_sill' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 3 — The dispatch box (cipher): the ledger refutation, and the cellar key.
  pz_ledger: {
    id: 'pz_ledger',
    type: 'cipher',
    title: 'The Dispatch Box',
    prompt:
      'Wren’s iron-cornered dispatch box, its lock a row of brass letter-tumblers. Pinned beneath it, a note in the dead man’s hand:\n“G. — you will find I have already read it. The box opens on the name you invented.”',
    answer: 'greyfield',
    accept: ['greyfield and sons', 'greyfield sons'],
    placeholder: 'The invented name…',
    hints: [
      'The note is addressed to G. What, according to the library ledger, did G. invent?',
      'Page after page, the firm’s money drains to a single client that no directory has ever listed.',
      'Spell GREYFIELD.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_ev_ledger' },
      { type: 'unlockJournal', entry: 'j_sus_ash_2' },
      {
        type: 'narrate',
        text: 'The tumblers spell the lie and the lid gives. Inside: the true accounts, a signed deed of repayment — and, wrapped in oilcloth, the heavy key Wren kept for his own cellar.',
      },
      { type: 'giveItem', item: 'cellar_key' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 4 — The great clock (sequence): the timeline fact.
  pz_clock: {
    id: 'pz_clock',
    type: 'sequence',
    title: 'The Great Clock',
    prompt:
      'The hall clock stands dead, hands frozen at 12:40, three winding squares behind its opened waist — and a silence where the house’s heartbeat should be. Mrs. Tabb’s routine could wake it, if you knew it.',
    elements: [
      { id: 'strike', label: 'Wind the strike train' },
      { id: 'hands', label: 'Set the hands to true' },
      { id: 'going', label: 'Wind the going train' },
      { id: 'chime', label: 'Wind the chime train' },
    ],
    answer: ['going', 'strike', 'chime', 'hands'],
    resetOnError: true,
    hints: [
      'Mrs. Tabb kept this clock for thirty years, and Mrs. Tabb wrote everything down.',
      'Her log: going first, strike second, chime third — and the hands last of all, never forced backward.',
      'Wind the going train, then the strike, then the chime; set the hands last.',
    ],
    onSolve: [
      { type: 'unlockJournal', entry: 'j_mech_clock' },
      {
        type: 'narrate',
        text: 'Tick. Tock. The house has a pulse again — but before you set the hands you write it down: the cold stopped this clock at 12:40, and by Mrs. Tabb’s own rule, that puts the boiler’s death within the hour before.',
      },
      { type: 'sound', cue: 'chime' },
    ],
  },

  // 5 — The music box (itemPlacement): Ivy's follow-up.
  pz_music_box: {
    id: 'pz_music_box',
    type: 'itemPlacement',
    title: 'The Music Box',
    prompt:
      'Ivy’s music box waits with its lid open and its spindle bare. The mechanism is whole; only the brass cylinder is missing — and everyone in this house seems to have known exactly where it was kept.',
    sockets: [{ id: 'spindle', label: 'Empty spindle', accepts: 'brass_cylinder' }],
    hints: [
      'The mechanism wants its music back.',
      'Her dossier: Wren confiscated the cylinder to his study desk, like a toy taken from a child.',
      'Fetch the brass cylinder from the study desk drawer and seat it on the spindle.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'brass_cylinder' },
      {
        type: 'narrate',
        text: 'The cylinder seats, the comb takes it up, and a thin waltz turns twice around the cold room. On the last bar something else releases: the box’s false bottom drops open on a packet of letters.',
      },
      { type: 'unlockJournal', entry: 'j_sus_ivy_2' },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 6 — The medicine chest (combination): WHO keystone.
  pz_medicine_chest: {
    id: 'pz_medicine_chest',
    type: 'combination',
    title: 'The Medicine Chest',
    prompt:
      'A campaign medicine chest of brass and mahogany, its four number-dials scratched bright with daily use. Doctors set their locks to dates they cannot forget.',
    slots: 4,
    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    answer: ['1', '8', '9', '4'],
    hints: [
      'The chest is hers, and its combination will be a date she could never misremember.',
      'Her framed doctorate hangs over the desk: Marchford College — read the year.',
      'Set the dials to 1, 8, 9, 4.',
    ],
    onSolve: [
      { type: 'setFlag', flag: 'who_pinned' },
      { type: 'unlockJournal', entry: 'j_ev_chest' },
      {
        type: 'narrate',
        text: 'The lid lifts on ranked vials in velvet, each against its printed card — laudanum, quinine, chloral, iodine, all sealed. And one socket empty. One. The foxglove tincture is gone, from a chest that was found locked.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 7 — The boiler fittings (itemPlacement).
  pz_boiler_parts: {
    id: 'pz_boiler_parts',
    type: 'itemPlacement',
    title: 'The Boiler’s Fittings',
    prompt:
      'The boiler could be lit within the hour — except that its fittings have walked off: the stoker handle gone from its bracket, the feed-valve spindle stripped bare. A house in evacuation borrows strange things.',
    sockets: [
      { id: 'bracket', label: 'Stoker bracket', accepts: 'stoker_handle' },
      { id: 'spindle', label: 'Feed-valve spindle', accepts: 'valve_wheel' },
    ],
    hints: [
      'Servants keep tools where they use them; guests borrow them for stranger purposes.',
      'A long iron handle stands among the pantry mops, and a brass wheel is weighting a poet’s manuscripts.',
      'Seat the stoker handle in its bracket and the valve wheel on the spindle.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'stoker_handle' },
      { type: 'removeItem', item: 'valve_wheel' },
      { type: 'setFlag', flag: 'boiler_ready' },
      {
        type: 'narrate',
        text: 'Handle and wheel go home with the satisfaction of things returned. The boiler stands whole, waiting on fire and the right order of operations.',
      },
      { type: 'sound', cue: 'unlock' },
    ],
  },

  // 8 — Relighting the boiler (sequence): the thaw. Clue: Mrs. Tabb's log.
  pz_boiler: {
    id: 'pz_boiler',
    type: 'sequence',
    title: 'Relighting the Boiler',
    prompt:
      'Coal in the scuttle, water in the tank, the murderer’s strap cut away from the damper — and thirty years of Mrs. Tabb’s routine chalked as four motions on the plate, half worn away. Fires forgive nothing done out of order.',
    if: { all: [{ flag: 'boiler_ready' }, { hasItem: 'vestas' }] },
    lockedText:
      'Not yet. The boiler is still missing its fittings, or you have nothing dry to strike a flame with — likely both.',
    elements: [
      { id: 'coal', label: 'Feed the coal' },
      { id: 'damper', label: 'Open the damper' },
      { id: 'vesta', label: 'Strike a vesta' },
      { id: 'valve', label: 'Open the feed valve' },
    ],
    answer: ['damper', 'valve', 'coal', 'vesta'],
    resetOnError: true,
    hints: [
      'Mrs. Tabb’s routine is written down, like everything else she ever did.',
      'Her log: the damper first of all, water before coal, coal before flame.',
      'Open the damper, open the valve, feed the coal, then strike the vesta.',
    ],
    onSolve: [
      { type: 'removeItem', item: 'vestas' },
      { type: 'triggerShift', shift: 's_thaw' },
      { type: 'unlockJournal', entry: 'j_sus_casque_2' },
      {
        type: 'narrate',
        text: 'Flame takes the coal, the tank begins its long mutter — and the arithmetic closes like a trap: dead boiler by midnight, stopped clock at 12:40, stone-cold pipes by one. And a doctor who swears the water ran warm at two.',
      },
    ],
  },

  // 9 — FINALE: the accusation.
  pz_accuse: {
    id: 'pz_accuse',
    type: 'accusation',
    title: 'The Brief for the Magistrate',
    prompt:
      'The constable’s case satchel lies open on the hall table — five statements, your own crowded notes, and the wire down to the village humming again. Write the brief that will hold: the accused, the means, the scene. The magistrate will read it once, and the pass opens tomorrow.',
    if: { all: [{ flag: 'who_pinned' }, { flag: 'how_pinned' }, { flag: 'where_pinned' }] },
    lockedText: 'You cannot yet make this hold. Something is still missing.',
    categories: [
      {
        id: 'who',
        label: 'The Accused',
        options: [
          { id: 'ivy', label: 'Ivy Wren' },
          { id: 'casque', label: 'Dr. Lenore Casque' },
          { id: 'ash', label: 'Gideon Ash' },
          { id: 'tabb', label: 'Mrs. Tabb' },
          { id: 'faro', label: 'Julian Faro' },
        ],
      },
      {
        id: 'how',
        label: 'The Means',
        options: [
          { id: 'opener', label: 'the letter opener' },
          { id: 'foxglove', label: 'foxglove tincture' },
          { id: 'blow', label: 'a blow in the dark' },
          { id: 'cold', label: 'the killing cold' },
          { id: 'blade', label: 'an intruder’s blade' },
        ],
      },
      {
        id: 'where',
        label: 'The Scene',
        options: [
          { id: 'study', label: 'the locked study' },
          { id: 'cellar', label: 'the cellar stair' },
          { id: 'conservatory', label: 'the conservatory' },
          { id: 'bedchamber', label: 'his bedchamber' },
          { id: 'landing', label: 'the east landing' },
        ],
      },
    ],
    answer: ['casque', 'foxglove', 'conservatory'],
    wrongFeedback:
      'You read the brief back and the house itself refuses it — somewhere in those lines is a thing you cannot prove, and the magistrate would tear the whole of it to pieces. Tear it up first, and begin again.',
    hints: [
      'Ask of each name three questions: could they, would they — and does the house agree?',
      'Follow what is missing: one vial from a locked chest, the blood from a wound, a body from the room where a pipe fell.',
      'Accuse Dr. Lenore Casque; the means, foxglove tincture; the scene, the conservatory — the study was only the stage.',
    ],
    onSolve: [
      {
        type: 'narrate',
        text: 'You write it out fair, sign it, and send it singing down the wire. For the murder of Aldous Wren: Dr. Lenore Casque — the means, her own foxglove tincture in his nightly brandy — the scene, the conservatory, and every locked door of it staged after the fact.',
      },
    ],
  },
};
