import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Clues -------------------------------------------------------------
  j_gauge_ground: {
    id: 'j_gauge_ground',
    title: 'The ground gauge',
    body: 'The winding-room pressure gauge wears a clock face, stopped where the steam died:\nthe hand rests dead on FOUR.\nA brass tag beneath it: GROUND.',
    category: 'clue',
  },
  j_gauge_hall: {
    id: 'j_gauge_hall',
    title: 'The hall gauge',
    body: "The pendulum hall's gauge, twin to the one below, stopped at SEVEN.\nIts tag: HALL.",
    category: 'clue',
  },
  j_gauge_fire: {
    id: 'j_gauge_fire',
    title: 'The fire gauge',
    body: 'Soot-dimmed but legible, the furnace gauge rests at TWO.\nIts tag: FIRE.',
    category: 'clue',
  },
  j_fireplate: {
    id: 'j_fireplate',
    title: 'The fire-plate',
    body: "Stamped brass bolted beside the firebox chute:\n'COLD MORNINGS: RAKE THE GRATE. OPEN THE DAMPER. FEED THE COAL.\nTHEN THE BELLOWS, GENTLY — THE FIRE IS A COLLEAGUE, NOT A SERVANT.'",
    category: 'clue',
  },
  j_peal: {
    id: 'j_peal',
    title: "Fen's practice slate",
    body: "A child-sized slate, chalk ghosted by years of wiping:\n'The master's dawn peal — LOW, LOW, HIGH, MIDDLE, LOW.\nNever the dead bell. The dead bell is not a bell.'",
    category: 'clue',
  },
  j_beatplates: {
    id: 'j_beatplates',
    title: 'The beat plates',
    body: "Three plates riveted under the bell frame, one for each cam-ring of the gallery below:\n'TICK at the crown.'\n'TOCK at the sixth hour.'\n'REST at the ninth.'",
    category: 'clue',
  },
  j_shorthand: {
    id: 'j_shorthand',
    title: "The Horologist's shorthand",
    body: "Chalked on the bench slate, in a hand that never hurried:\nA·Ⅰ B·Ⅱ C·Ⅲ D·Ⅳ E·Ⅴ F·Ⅵ G·Ⅶ H·Ⅷ I·Ⅸ J·Ⅹ K·Ⅺ L·Ⅻ\nBeneath: 'Twelve letters suffice for any word worth locking.'",
    category: 'clue',
  },
  j_schematic: {
    id: 'j_schematic',
    title: 'The deck schematic',
    body: "A drawing of the astrolabe deck, made before the deck was ever raised, corners tacked flat:\n'The MOON keeps the crown.'\n'The WANDERER sleeps at the bottom of the wheel.'\n'The SUN stands at the third hour.'",
    category: 'clue',
  },
  j_ritual: {
    id: 'j_ritual',
    title: 'The closing ritual',
    body: "A page pinned above the spring housing, in the Horologist's steadiest hand:\n'Every dusk, the same order, and no other:\nLIGHT THE SUN. SET THE MOON. LOOSE THE WANDERERS. AND LET GO.'",
    category: 'clue',
  },
  // --- Mechanisms --------------------------------------------------------
  j_mech_boiler: {
    id: 'j_mech_boiler',
    title: 'On steam',
    body: "The tower's low floors are a lung of brass — fire below, water between, and pressure enough to lift a staircase when both agree.\nStamped across the master gauge: 'FIRST, STEAM.'",
    category: 'mechanism',
  },
  j_mech_wheels: {
    id: 'j_mech_wheels',
    title: 'On the turning floors',
    body: "The tower does not have floors. It has wheels. Each chamber is a gear on the tower's spine, and its doorways are the teeth.\nStamped on the brake housing: 'THEN, THE BEAT.'",
    category: 'mechanism',
  },
  j_mech_spring: {
    id: 'j_mech_spring',
    title: 'On the mainspring',
    body: "Every hour the sky keeps is an hour the spring paid out first. Wind it, and the tower owes nothing to anyone.\nStamped around the drum: 'LAST, THE SPRING — AND THE SKY.'",
    category: 'mechanism',
  },
  // --- Lore (the Horologist and Fen) -------------------------------------
  j_horo_1: {
    id: 'j_horo_1',
    title: "The Horologist's notes, first leaf",
    body: "'Day one of the new ledger. The mainspring took four thousand turns and I felt every one of them in my shoulders. The tower asks only two things: to be wound, and to be understood. Most days I manage one.'\n— H.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_horo_2: {
    id: 'j_horo_2',
    title: 'A scorched page',
    body: "'The new apprentice overstokes. Fen argues that the sky deserves a proud fire; I argue that the sky deserves a punctual one. The sky, as usual, declines to comment.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_horo_3: {
    id: 'j_horo_3',
    title: 'On the dawn peal',
    body: "'Fen rings the dawn peal now. Low, low, high, middle, low — the same five notes my own master rang. This morning I stayed at my bench and let the tower be someone else's for a quarter of an hour. I am told this is called trust.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_horo_4: {
    id: 'j_horo_4',
    title: 'Inside the cabinet',
    body: "'The cabinet answers to the first word I ever taught Fen to read in shorthand. If you have opened it, then either you are Fen, or you have learned exactly what Fen learned. Both suit me.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_horo_5: {
    id: 'j_horo_5',
    title: 'The sky runs slow',
    body: "'Two seconds lost against the stars this month. It is not the sky, of course. It is the spring; it is my shoulders; it is the number of turns I can no longer make in a day. I have not told Fen. Fen has not told me that the ledger sums are lately in a younger hand. Neither of us is fooling the other, and neither of us stops.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_fen_letter: {
    id: 'j_fen_letter',
    title: "Fen's unsent letter",
    body: "'Master — I practise the peal in my head every dawn, wherever the road has put me. You will say the tower needs winding, not letters, which is why I never sent this one: I hid it where only someone who crawls the wall-ways would look, because that someone was always you.\nCome down off your mountain once, before your shoulders give. Or teach me to carry it. Either. Both.\n— F.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_watch: {
    id: 'j_watch',
    title: "The Horologist's watch",
    body: "A pocket watch, hung on the mainspring housing by its chain — run down at six minutes to midnight, the same as every dial in the tower. Inside the case, an engraving worn soft by a thumb:\n'FOR EVERY HOUR YOU GAVE THE SKY, ONE OF YOUR OWN. — F.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_horo_final: {
    id: 'j_horo_final',
    title: "The Horologist's last entry",
    body: "'Fen is gone to the lowlands — my doing. There must always be a clockwright who has seen more than one sky, and there has only ever been one keeper at a time. So: the last sums. The spring has perhaps a season left; my hands have less. Tonight I will stop the clocks at six to midnight, so the tower spends nothing while it waits. Then I will go down the stair and find my apprentice, and ask, at last, whether it might be time for two keepers.\n\nIf the tower wakes before we return, then a stranger has done a kind and difficult thing. Keep the hours gently, stranger. They are heavier than they look.'",
    category: 'lore',
    countsTowardLore: true,
  },
};
