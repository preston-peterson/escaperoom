import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Clues -------------------------------------------------------------
  j_stair_glyphs: {
    id: 'j_stair_glyphs',
    title: 'Glyphs on the stair',
    body: 'Four glyphs repeat down the stairway walls, always in the same order:\nthe half-moon ◐, the mountain △, the river ☰, the star ✶.\nSomeone meant them to be remembered.',
    category: 'clue',
  },
  j_water_mural: {
    id: 'j_water_mural',
    title: 'The water mural',
    body: "A faded mural traces the water's whole journey through the mountain:\nit rises at the SPRING, crosses the WEIR, falls through the CULVERT, and comes to rest in the DEEP.",
    category: 'clue',
  },
  j_drips: {
    id: 'j_drips',
    title: 'The rhythm of the drips',
    body: 'The cistern ceiling drips in a pattern too regular to be chance:\nthree quick drops — a breath of silence — then two slow, heavy ones.\nDrip-drip-drip … drum … drum.',
    category: 'clue',
  },
  j_weights: {
    id: 'j_weights',
    title: 'Inscriptions of the weights',
    body: 'Carved beside the drowned walkway:\n"Three weights the Builders trusted —\nthe OX carries SEVEN, the HERON TWO, the SERPENT NINE."',
    category: 'clue',
  },
  j_plaques: {
    id: 'j_plaques',
    title: 'The alignment plaques',
    body: 'Three bronze plaques, one for each ring of the great gear-train dial:\n"The SUN keeps the crown of the sky."\n"The WAVE stands at the third hour."\n"The FLAME sleeps at the bottom of the world."',
    category: 'clue',
  },
  j_glyphkey: {
    id: 'j_glyphkey',
    title: "Vell's table of glyphs",
    body: "Vell's careful hand, a translation table for the Builders' script:\n◐ is E · △ is M · ☰ is B · ✶ is R\n(Her note in the margin: 'the river-glyph doubles as B — maddening.')",
    category: 'clue',
  },
  j_serpent_water: {
    id: 'j_serpent_water',
    title: 'The serpent drinks',
    body: 'Etched on the back of the Water Sigil:\n"The serpent DRINKS at the FOURTH notch."',
    category: 'clue',
  },
  j_serpent_gear: {
    id: 'j_serpent_gear',
    title: 'The serpent turns',
    body: 'Etched on the back of the Gear Sigil:\n"The serpent TURNS at the SIXTH notch."',
    category: 'clue',
  },
  j_serpent_glyph: {
    id: 'j_serpent_glyph',
    title: 'The serpent speaks',
    body: 'Etched on the back of the Glyph Sigil:\n"The serpent SPEAKS at the FIRST notch."',
    category: 'clue',
  },
  // --- Mechanisms --------------------------------------------------------
  j_mech_sluice: {
    id: 'j_mech_sluice',
    title: 'On the sluices',
    body: 'The whole west wing is a lung for water. Open the channels in the order the mountain intended and it empties like a held breath released.\nA Builder inscription beneath the levers: "FIRST, THE WATER."',
    category: 'mechanism',
  },
  j_mech_gears: {
    id: 'j_mech_gears',
    title: 'On the gear-train',
    body: 'One bronze gear was missing from the train — without it, half the labyrinth stands still.\nStamped into the housing: "THEN, THE WHEEL."',
    category: 'mechanism',
  },
  j_mech_glyph: {
    id: 'j_mech_glyph',
    title: 'On the word',
    body: 'The Builders sealed their crypt with a word, not a key. A word can be carried out of the dark.\nBeneath the niche: "THEN, THE WORD."',
    category: 'mechanism',
  },
  j_mech_chimes: {
    id: 'j_mech_chimes',
    title: 'On the Hall of Echoes',
    body: 'The hub of the labyrinth is a great stone drum hung with chime-stones. Struck rightly, the whole chamber turns on a hidden bearing.\nThe Builders did not build doors. They built alignments.',
    category: 'mechanism',
  },
  // --- Lore (Vell + the Builders) ---------------------------------------
  j_vell_1: {
    id: 'j_vell_1',
    title: "Vell's notes, first page",
    body: "'Day one below. The stair descends further than my rope is long. The air moves — the mountain is breathing, or something in it is. I have decided to be delighted rather than afraid.'\n— V., cartographer",
    category: 'lore',
    countsTowardLore: true,
  },
  j_vell_2: {
    id: 'j_vell_2',
    title: "Vell's notes, on the Hall",
    body: "'The great round hall is the heart of the map — every corridor touches it, though not always the same corridors. I have charted it four times and it has been four different rooms. I no longer trust my own ink.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_vell_3: {
    id: 'j_vell_3',
    title: "Vell's notes, damp and stained",
    body: "'The gallery flooded a century before I was born, by the mineral crust on the waterline. The Builders flooded it ON PURPOSE. You do not drown a room unless the room holds something worth drowning.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_vell_4: {
    id: 'j_vell_4',
    title: "Vell's notes, at the bridge",
    body: "'The span has been cut. Not fallen — CUT, the stubs chiseled clean. Someone wanted the Vault to keep its secret even from the labyrinth itself. I will find another way, or make one.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_builders_1: {
    id: 'j_builders_1',
    title: 'A Builder inscription, translated',
    body: "Above the scriptorium door, in the old script:\n'WE DID NOT BUILD A PRISON. WE BUILT A CRADLE, AND WOUND OURSELVES INTO ITS ROCKING.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_vell_crypt: {
    id: 'j_vell_crypt',
    title: "Vell's notes, in the crypt",
    body: "'They are HERE — the Builders, all of them, laid in the walls of their own machine. Not entombed. Installed. The epitaph asks a question, and I begin to fear I know the answer.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_gate_inscription: {
    id: 'j_gate_inscription',
    title: 'Words at the Serpent Gate',
    body: "Around the serpent's jaw, deeply cut:\n'LAST OF ALL, THE FIRE ITSELF.\nFEED IT AS WE FED IT: WATER, WHEEL, WORD — AND BREATH.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_vell_final: {
    id: 'j_vell_final',
    title: "Vell's final pages",
    body: "'I have found the alcove the Builders kept for watching. I understand now. The shifts are a heartbeat. The flooding, a lung. The Ember at the center is the FIRST FIRE, and the labyrinth is the machine that keeps it alive.\n\nIt needs a keeper. The old ones are stone now.\n\nI came here to map a maze. I believe I will stay to wind a clock. If you are reading this — finish my map. And then decide, as I did, what you are willing to keep burning.'",
    category: 'lore',
    countsTowardLore: true,
  },
};
