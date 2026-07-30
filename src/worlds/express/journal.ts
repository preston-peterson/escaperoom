import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

/**
 * The case file. Category 'suspect' holds the dossiers and their follow-ups;
 * 'clue' the physical evidence; 'mechanism' the train itself; 'lore' the case
 * and its victim. Every accusation answer label appears verbatim in here —
 * validateWorld enforces it, and the fairness of the mystery depends on it.
 */
export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Dossiers (suspect) --------------------------------------------------
  j_dossier_voss: {
    id: 'j_dossier_voss',
    title: 'Dossier: Adeline Voss',
    body:
      'Widow, travelling alone, compartment No. 2 — the berth adjoining the colonel’s. Statement to the border inspector: “From a quarter to midnight until we reached the border I sat in the dining car, at the little table by the service door. Mr. Stasny clipped my ticket there at midnight. I never left my seat.”',
    category: 'suspect',
  },
  j_dossier_brandt: {
    id: 'j_dossier_brandt',
    title: 'Dossier: Otto Brandt',
    body:
      'Commercial salesman — “notions and smallwares” — compartment No. 3. Statement: refused twice, then allowed only that he was “about his samples” after eleven o’clock. Sweated through his collar while saying it. The inspector has underlined his name twice.',
    category: 'suspect',
  },
  j_dossier_kohl: {
    id: 'j_dossier_kohl',
    title: 'Dossier: Elsa Kohl',
    body:
      'Student, returning from the winter term, compartment No. 4. Statement: read in her berth from ten o’clock; rang for cocoa at ten to midnight and drank it over her book. States she heard two doors go — soft, and close together, “like one breath” — some minutes before midnight.',
    category: 'suspect',
  },
  j_dossier_stasny: {
    id: 'j_dossier_stasny',
    title: 'Dossier: Marek Stasny',
    body:
      'Conductor of the Sable Express, nineteen years on the night run, service berth No. 6. Statement: “My register speaks for me.” Nothing further. A conductor’s punch register records the car and the minute of every ticket it clips.',
    category: 'suspect',
  },
  j_dossier_blaine: {
    id: 'j_dossier_blaine',
    title: 'Dossier: Hector Blaine',
    body:
      'Retired magistrate, compartment No. 5. Statement: took a warm brandy at eleven and slept until the brakes woke him. It was Blaine who demanded the cordon the moment the colonel’s door stayed shut — “Seal the train first and grieve after. I have presided over enough of these.”',
    category: 'suspect',
  },
  // --- Dossier follow-ups (suspect) ---------------------------------------
  j_brandt_picks: {
    id: 'j_brandt_picks',
    title: 'Brandt: the sample case',
    body:
      'Otto Brandt’s sample case of “notions and smallwares” holds a false tray. Beneath it: a roll of lock-picks, wax blanks, and a jeweller’s glass. Whatever Brandt sells, it is not buttons. A man with picks could open any door on this train — or so it seems worth writing down.',
    category: 'suspect',
  },
  j_brandt_cleared: {
    id: 'j_brandt_cleared',
    title: 'Brandt, reconsidered',
    body:
      'The bonded cage holds Brandt’s crates — and his private ledger. Every transfer is counter-stamped by the baggage guard: 23:30, 23:44, 23:58, 00:15, Brandt’s signature against the guard’s punch each time. A smuggler, plainly. But for the whole of the midnight hour he was three cars forward, moving contraband under a railwayman’s nose. The picks opened nothing worse than customs.',
    category: 'suspect',
  },
  j_voss_break: {
    id: 'j_voss_break',
    title: 'The widow’s hand',
    body:
      'Laid side by side, the midnight telegram and Mrs. Voss’s letter are written by the same hand. The same long-tailed R, the same crossed seven, the same stiff little flourish closing each line. The telegram that drew Colonel Fisk rearward was never wired to this train. It was written on it — by Adeline Voss.',
    category: 'suspect',
  },
  j_stasny_cleared: {
    id: 'j_stasny_cleared',
    title: 'The register runs true',
    body:
      'The marshal sheet from the border siding settles it. Cars are re-lettered every time a train is re-marshalled, and the Sable Express was re-marshalled at Karst Junction at 23:47 — mid-run. The register’s “doctored” over-punch is exactly what an honest punch does when its car re-letters beneath it. Stasny falsified nothing.\n\nAnd if the register is honest, then its 23:52 entry is honest too: Mrs. Voss’s ticket was clipped in the REAR sleeper corridor at eight minutes to midnight — three cars from the dining-car seat she swears she never left. Her seat is a fiction.',
    category: 'suspect',
  },
  // --- Evidence (clue) ------------------------------------------------------
  j_telegram: {
    id: 'j_telegram',
    title: 'The midnight telegram',
    body:
      'Found folded under the colonel’s pillow, a telegram form:\n“COL. FISK — MATTER OF THE WINTER ROUTES — OBSERVATION CAR AT MIDNIGHT — COME ALONE — K.”\nThe form is genuine railway stock. The message is what moved him rearward.',
    category: 'clue',
  },
  j_voss_letter: {
    id: 'j_voss_letter',
    title: 'The letter in No. 2',
    body:
      'A letter kept in Mrs. Voss’s writing case, signed “your loving sister” — yet stiff as a drill manual, and closing with a postscript no sister writes:\n“Mind the old house numbers — seven over the door, three on the gate, five on the lamp.”\nThe hand is distinctive: a long-tailed R, sevens crossed continental-fashion.',
    category: 'clue',
  },
  j_wire_roll: {
    id: 'j_wire_roll',
    title: 'The wire roll',
    body:
      'The engine’s block-telegraph keeps a punched roll of every message the train receives. The night’s traffic is all signals and crossing orders. No telegram addressed to Colonel Fisk was ever received by wire. Whatever summoned him to the rear of the train was written aboard it.',
    category: 'clue',
  },
  j_panel: {
    id: 'j_panel',
    title: 'The smuggler’s panel',
    body:
      'Behind the vanity mirror in compartment No. 2, a panel swings on oiled hinges — a smuggler’s pass-through, old contraband work, opening straight into compartment No. 1. A latched door means nothing when the wall itself opens. Someone could leave the colonel’s berth latched from the inside and still walk away.',
    category: 'clue',
  },
  j_cord_missing: {
    id: 'j_cord_missing',
    title: 'The bare curtain',
    body:
      'The observation saloon’s velvet curtains are dressed in matched pairs, each gathered by a braided tie. The near curtain hangs loose: the curtain sash-cord is gone from its ring. Its twin still hangs opposite — braided silk, three cords laid tight, strong enough to tow a wagon.',
    category: 'clue',
  },
  j_cord_mark: {
    id: 'j_cord_mark',
    title: 'The mark on the collar',
    body:
      'Beneath the colonel’s collar, pressed into the cloth and the skin above it, runs a single thin furrow — braided, three strands, laid tight. Not a wire, not a belt. Something soft-surfaced and terribly strong, drawn once and held.',
    category: 'clue',
  },
  j_pipe_ash: {
    id: 'j_pipe_ash',
    title: 'Ash on the sill',
    body:
      'By lamplight the rear saloon gives it up: a neat cone of pipe ash tapped out on the sill of the observation car, black cherry by the smell of it, and a scatter of the same ash down the arm of the corner chair. The colonel smoked here, seated, facing the door — and did not finish his pipe.',
    category: 'clue',
  },
  j_lamp_rounds: {
    id: 'j_lamp_rounds',
    title: 'The porter’s lamp rota',
    body:
      'The porter trims the paraffin lamps car by car and books each one:\nBaggage 23:20 · Dining 23:30 · Sleeper A 23:40 · Sleeper B 23:55 · Observation —\nAgainst the observation car, only a pencilled note: “00:10, found dark from the vestibule, curtain drawn across the glass. Did not enter.” And below it: “Colonel passed me rearward at 23:50, pipe lit, wished me goodnight.”',
    category: 'clue',
  },
  j_ticket_log: {
    id: 'j_ticket_log',
    title: 'The punch register',
    body:
      'Stasny’s punch register, night leaf. Most entries march in order — then, at 23:52, an ugly over-punch: two car letters struck one atop the other, D over B, as if the entry were clipped twice or clumsily altered. The 23:52 ticket is a lady’s single, rear sleeper corridor. It is the only blemish on nineteen years of tidy leaves — and it looks, for all the world, falsified.',
    category: 'clue',
  },
  // --- The Train (mechanism) ------------------------------------------------
  j_mech_bells: {
    id: 'j_mech_bells',
    title: 'On the bell-board',
    body:
      'Every compartment rings to the pantry through the steward’s bell-board, and every call drops a shutter that stays dropped until the round is served in order. The steward’s slate keeps the night’s calls:\n23:05 — No. 5, hot brandy. 23:20 — No. 2, warm milk. 23:35 — No. 1, a late supper tray. 23:50 — No. 4, cocoa.\nThe board will not release the pantry latch until the shutters are tripped in the order of service.',
    category: 'mechanism',
  },
  j_mech_latch: {
    id: 'j_mech_latch',
    title: 'On sleeper latches',
    body:
      'A sleeper door carries two fastenings: the lock, which the conductor’s pass key commands, and the night latch, a brass tongue thrown only from inside the berth. No key turns a night latch. A door latched from within has a person on the wrong side of it — or a second way out.',
    category: 'mechanism',
  },
  j_mech_marshal: {
    id: 'j_mech_marshal',
    title: 'On marshalling',
    body:
      'A through express is not a fixed thing. At every junction the yard may draw cars off, turn them on the siding loop, and couple them again in new order — and when the order changes, the car letters change with it: the letter boards are re-hung, and every conductor’s punch re-seats its car wheel. The train that arrives is not, car for car, the train that left.',
    category: 'mechanism',
  },
  // --- The Case (lore) -------------------------------------------------------
  j_case_brief: {
    id: 'j_case_brief',
    title: 'The cordon notice',
    body:
      'BORDER POST VELLENBRUCK — HOLD ORDER.\nNo. 9 down express (“Sable Express”) logged at 04:17. Passenger deceased in sleeper No. 1: FISK, Auberon, courier-colonel of the winter routes, found behind his own night latch, dispatch case open and empty. All passengers removed to the waiting hall before sealing; train sealed empty. Inquiry docket to be completed and returned to the cordon box.\nThe car seal is set to the minute of logging.',
    category: 'lore',
    countsTowardLore: true,
  },
  j_fisk_pipe: {
    id: 'j_fisk_pipe',
    title: 'The colonel’s habits',
    body:
      'Auberon Fisk, thirty years a courier-colonel, and every habit built for the work: he slept in his boots, kept the dispatch case chained at his wrist by day — and never once smoked in his berth. His pipe, black cherry, was for public rooms only, and always a seat facing the door. “A courier who relaxes in private,” he liked to say, “has already been robbed.”',
    category: 'lore',
    countsTowardLore: true,
  },
  j_dispatch: {
    id: 'j_dispatch',
    title: 'The dispatch case’s freight',
    body:
      'Under the baggage car’s transfer platform, wedged where the crates swing, an oilcloth packet: the missing contents of the colonel’s dispatch case. The winter courier routes, folio by folio — and beneath them a plain-cover warrant, its wax seal unbroken, addressed to the border magistracy. Someone hid this to cross the border clean and claim it after. The seal is not yours to break. The magistracy will do that.',
    category: 'lore',
    countsTowardLore: true,
  },
};
