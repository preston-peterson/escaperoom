import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Clues -------------------------------------------------------------
  j_hymn: {
    id: 'j_hymn',
    title: 'A pencil-marked hymn',
    body: "One verse of the Ebb Psalm is underlined in Maren's psalter, twice:\n'Twice call the EBB, then call the HOUR,\nand let the FOG bell close the bay.'\nIn the margin, her hand: 'The tower still listens. It only wants asking properly.'",
    category: 'clue',
  },
  j_moondial: {
    id: 'j_moondial',
    title: 'Lines on the moondial',
    body: "Around the orchard moondial's rim, worn but legible:\n'FULL I rise. HALF I keep the watch. DARK I close my eye.'\nThree phases, in that order. Someone meant it to be more than poetry.",
    category: 'clue',
  },
  j_starcharts: {
    id: 'j_starcharts',
    title: 'The Warden star charts',
    body: "Three rings the great lens remembers, say the charts:\n'The MOON keeps the crown of the night.\nThe PILOT STAR stands at the third hour.\nThe HARBOR LIGHT holds the nadir, under everything.'",
    category: 'clue',
  },
  j_script: {
    id: 'j_script',
    title: "Maren's key to the Warden script",
    body: "A translation strip in Maren's careful print:\n⌇ is S · ⌵ is L · ◇ is E · ⍚ is P\n(Her margin: 'The sea-glyph is E. Of course it is. Everything here comes back to the sea.')",
    category: 'clue',
  },
  j_tidetable: {
    id: 'j_tidetable',
    title: 'The spring tide table',
    body: "From the drawer of Maren's desk, a Warden tide table, one line ringed in ink:\n'MARK THE SPRING: it RISES to NINE, FALLS BACK to FOUR, and STANDS SLACK at SEVEN.'\nBeneath, in her hand: 'The door under the square counts the same way.'",
    category: 'clue',
  },
  j_floodorder: {
    id: 'j_floodorder',
    title: 'Carving in the sea cave',
    body: "Cut deep in the cave wall, above the reach of barnacles:\n'TO CALL THE SEA HOME:\nLOOSE THE BRAKE. OPEN THE GATE.\nTHEN THE BOOM. THEN THE RACE.'",
    category: 'clue',
  },
  // --- Mechanisms --------------------------------------------------------
  j_mech_bells: {
    id: 'j_mech_bells',
    title: 'On the bells',
    body: 'The tower is not a chapel; it is a keyboard. The peals run down couplings into the cliff, and the engine — even run down — keeps one last breath in its ebb-chains.\nA plate beneath the ropes: "THE BAY ANSWERS THE TOWER."',
    category: 'mechanism',
  },
  j_mech_lens: {
    id: 'j_mech_lens',
    title: 'On the light',
    body: 'The lens is not for ships. Its three rings gather moon, star, and home-light into one patient beam aimed down into the bay.\nEtched on the frame: "THE SLEEPER TURNS FROM THE DARK, AND TOWARD THE LIGHT LIES STILL."',
    category: 'mechanism',
  },
  j_mech_engine: {
    id: 'j_mech_engine',
    title: 'On the Tidal Engine',
    body: 'Impeller, regulator, governor: three small parts, and without any one of them the great wheel is furniture. The Wardens built an engine that borrows the weight of the whole sea and spends it on a lullaby.\nStamped on the housing: "THE SEA WINDS US. WE WIND THE SLEEP."',
    category: 'mechanism',
  },
  // --- Lore (Maren + the Wardens) ----------------------------------------
  j_maren_1: {
    id: 'j_maren_1',
    title: 'A letter in the ferry box',
    body: "Folded against the weather, addressed to no one:\n'To whoever the tide brings — the island is not empty, whatever the silence tells you. Mind the bells. Mind the water. If the light is dark, it is because I needed the dark to do a thing that wants doing.\n— M.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_warden_1: {
    id: 'j_warden_1',
    title: 'The stair inscription',
    body: "Cut into the cliff where the steps turn, in the old formal style:\n'BELOW THE BAY THE UNDERTOW TURNS IN ITS SLEEP.\nWE DO NOT WAKE IT. WE DO NOT NAME IT TWICE.'\nSalt has softened every word but UNDERTOW.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_maren_2: {
    id: 'j_maren_2',
    title: "Maren's letters, unsent",
    body: "'Dear Tam — the village took the last ferry and I did not. Someone keeps the engine, and the engine keeps the thing below, and the thing below keeps not being spoken of. That is the whole economy of this island. The plums are good this year. I am not lonely. I am not.\n— your aunt, M.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_maren_3: {
    id: 'j_maren_3',
    title: "The keeper's log",
    body: "The lighthouse log, her entries growing shorter down the page:\n'Engine slowing. Requisitioned parts; no answer. No ferry either.'\n'Slower. The bay has started dreaming — I hear it against the pilings at night.'\n'Slower. If no one comes, there is the old way. The Wardens left instructions for exactly one person.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_maren_4: {
    id: 'j_maren_4',
    title: "Maren's notebook, observatory",
    body: "'Watched the bay through the long glass until dawn. Twice the water bulged — no wave, no wind, just the sea making room for something rolling over beneath it. The charts call the alignment SLACK SLEEP. It is neither.\nThe engine has a year, maybe less. I have rather more than that, if I am honest about what I am for.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_maren_final: {
    id: 'j_maren_final',
    title: 'The letter under the cairn',
    body: "Dry inside a creel, weighted with beach stones:\n'If you found this, the bells still work and you are cleverer than the sea. Good.\nThe engine wants three parts and a spring tide. I could not give it those. I could give it a keeper.\nDo not look for me on the island. I am below, holding the door the only way left to me. Restart the engine — and then, please, let me stop.\n— Maren, last Warden of the Silent Island.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_warden_2: {
    id: 'j_warden_2',
    title: 'Words above the engine',
    body: "Across the engine hall architrave, letters of set lead:\n'WE DO NOT CHAIN THE SEA. WE ROCK IT.\nA CRADLE NEEDS A HAND UPON IT, OR A WEIGHT WORTH A HAND.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_gate_rite: {
    id: 'j_gate_rite',
    title: 'The rite of the Quieting',
    body: "Around the Undertow Gate, deeply cut and recently — impossibly — kept clean of weed:\n'LIGHT FOR THE SLEEPER.\nMOTION FOR THE SEA.\nONE BELL FOR THE VANISHED.\nAND SILENCE FOR THE KEEPER.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_maren_true: {
    id: 'j_maren_true',
    title: "Maren's true last letter",
    body: "From a tin box under the lamp floor, sealed with candle-wax:\n'The official version is under a cairn at the low-tide line, and it is all true, and it is not the whole of it.\nThe whole of it: the Wardens' instructions end with a mercy. The keeper who goes below may be RELIEVED — by light, by motion, by one bell, by silence — and walk out of the gate on the next spring tide.\nI did not go down to drown, whatever grief decides to say about me. I went down the way you sit up with a feverish child. Someone will come, I wrote, and wind the island, and ring me home.\nYou came. Ring me home.\n— M.'",
    category: 'lore',
    countsTowardLore: true,
  },
};
