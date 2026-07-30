import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

/**
 * The case file. Dossiers ('suspect') hold each houseguest's statement and
 * apparent motive; 'clue' entries are physical evidence; 'mechanism' is the
 * house itself; 'lore' is the victim's thread, and completing it earns the
 * confession epilogue.
 */
export const journal: Record<JournalId, JournalEntryDef> = {
  // --- Dossiers ------------------------------------------------------------
  j_sus_ivy: {
    id: 'j_sus_ivy',
    title: 'Dossier: Ivy Wren',
    body: "Ward of the dead man; nineteen; the only family he had left. Statement: retired at ten, slept badly for the cold, knew nothing until Mrs. Tabb's alarm at seven.\nMotive, apparent: a quarrel — the servants heard raised voices two nights ago over her wish to leave Longwinter for the city. He confiscated the brass cylinder of her music box to his study desk like a toy taken from a child.",
    category: 'suspect',
  },
  j_sus_casque: {
    id: 'j_sus_casque',
    title: 'Dossier: Dr. Lenore Casque',
    body: "Physician; four years resident at Longwinter as keeper of Aldous Wren's failing heart, dosing him drop by measured drop with foxglove tincture. Her framed doctorate hangs over her desk: Marchford College, 1894.\nStatement: retired at eleven; rose once 'past two' to fill her water-bottle, and found the bathroom pipes still warm; knew nothing until seven.\nMotive, apparent: none. She is the one soul in this house who was paid to keep him alive.",
    category: 'suspect',
  },
  j_sus_ash: {
    id: 'j_sus_ash',
    title: 'Dossier: Gideon Ash',
    body: "Business partner of thirty years' standing, wintering over to 'settle the accounts.' Statement: sat late in the library with the ledgers and a brandy of his own; abed by one; heard nothing.\nThe ledger left open on the library desk shows the firm's money bleeding, page after page in Ash's hand, into a client named GREYFIELD & SONS that no directory lists.\nMotive, apparent: the loudest in the house.",
    category: 'suspect',
  },
  j_sus_tabb: {
    id: 'j_sus_tabb',
    title: 'Dossier: Mrs. Tabb',
    body: "Housekeeper, thirty years at Longwinter. It was she who knocked at seven, she who had the study door broken when no answer came, she who wired the village.\nHer chatelaine opens every lock in the house except two — the study and the cellar. Mr. Wren kept those himself.\nStatement: banked the boiler at ten as always; it should have held its fire till morning. It did not.",
    category: 'suspect',
  },
  j_sus_faro: {
    id: 'j_sus_faro',
    title: 'Dossier: Julian Faro',
    body: "A poet, in his third winter as a guest on the strength of one slim volume and considerable charm — and lately informed he would be put out come spring.\nStatement: wrote until his candle died, slept in his coat for the cold, heard 'the house groan all night, as it does.'\nMotive, apparent: the roof over his head. Men have killed for less — but rarely men who cannot be troubled to close a window against a blizzard.",
    category: 'suspect',
  },
  j_sus_ash_2: {
    id: 'j_sus_ash_2',
    title: 'The Greyfield forgery',
    body: "Wren's true accounts, from the dispatch box: there is no Greyfield & Sons. Gideon Ash invented the client and bled the firm through it for two years. And beneath the true ledger, a deed of quiet repayment — signed by both partners a week ago.\nWren had already found him out, and had already forgiven the debt against Ash's shares. The crisis was over before the storm began; Wren dead means auditors, and auditors are the last thing a forger wants.\nAsh leaves this house a fraud. He does not leave it a murderer.",
    category: 'suspect',
  },
  j_sus_casque_2: {
    id: 'j_sus_casque_2',
    title: "The doctor's broken alibi",
    body: "Dr. Casque's statement says she drew water 'past two' and found the pipes STILL WARM.\nBut the boiler's damper was strapped shut and its fire dead by midnight, and the great clock — which stops within the hour whenever the heat fails — froze at 12:40. By two o'clock every pipe in Longwinter was stone.\nShe was awake and moving through the house that night, and she lied about why.",
    category: 'suspect',
  },
  j_sus_ivy_2: {
    id: 'j_sus_ivy_2',
    title: "Ivy's letters",
    body: "Beneath the music box's false bottom: a settled annuity in Ivy's name, dated last month, and a letter in Wren's hand — 'Go in the spring, then, and with my blessing, though the house will be the colder for it. The cylinder is on my desk; come and take your mother's song back from a foolish old man.'\nWhatever their quarrel was, it had already ended, and kindly. Her motive dissolves.",
    category: 'suspect',
  },

  // --- Evidence ------------------------------------------------------------
  j_ev_sill: {
    id: 'j_ev_sill',
    title: 'Snow on the study sill',
    body: 'The snow heaped so suggestively on the study sill lies on the INNER ledge, square-edged and undrifted, with no melt-channel under it. Every true drift in this house feathers to windward; this was scraped from the outer ledge and laid by hand, from inside the room, by someone who wanted an intruder believed in.\nNo one came through that window.',
    category: 'clue',
  },
  j_ev_decanter: {
    id: 'j_ev_decanter',
    title: "The decanter's sediment",
    body: "The tantalus's brandy decanter, one glass poured from it and that glass drained. At the bottom of the decanter, a fine green-brown sediment, bitter under the nose: crushed leaf. Foxglove tincture — not the careful daily drops, but a whole vial of it, waiting in the nightly brandy.",
    category: 'clue',
  },
  j_ev_wound: {
    id: 'j_ev_wound',
    title: 'The wound that did not bleed',
    body: 'Under the sheet, the letter opener stands in a wound that hardly wept at all — a stain the size of a coin, on a wound that should have ruined the carpet.\nDead men do not bleed. The blade went in hours after the heart had already stopped. The stabbing is set-dressing.',
    category: 'clue',
  },
  j_ev_chest: {
    id: 'j_ev_chest',
    title: 'The medicine chest inventory',
    body: "The chest's own card lists every vial against its velvet socket: laudanum, quinine, chloral, iodine — all present, all sealed. One socket stands empty. Only the foxglove tincture is gone.\nThe lock is unforced and was found locked. It was opened, emptied of exactly one thing, and locked again — by the one who kept its combination.",
    category: 'clue',
  },
  j_ev_notebook: {
    id: 'j_ev_notebook',
    title: 'The dosage notebook',
    body: "Fallen behind the washstand, missed in a hurried packing: Dr. Lenore Casque's dosage book. Page after page of careful daily drops for 'A.W.' — and on the last page a different arithmetic entirely, worked three times over: the whole vial at once, against a man of his weight.\nNo physician writes that figure for any purpose but one.",
    category: 'clue',
  },
  j_ev_dragmarks: {
    id: 'j_ev_dragmarks',
    title: 'Drag marks under the thaw',
    body: 'As the frost releases the conservatory floor, the night of the murder surfaces in it: two heel-lines, melted out and refrozen, running from the overturned wicker chair among the orchids to the service door.\nA body was dragged out of the conservatory while the house slept.',
    category: 'clue',
  },
  j_ev_pipe: {
    id: 'j_ev_pipe',
    title: 'The dropped pipe',
    body: "Under the wicker chair, where the thaw finally gave it up: Aldous Wren's briar pipe, half-packed and never lit, dropped and never picked up.\nHe was at his nightly pipe among his orchids when death interrupted him — not at his desk behind a locked door.",
    category: 'clue',
  },
  j_ev_ledger: {
    id: 'j_ev_ledger',
    title: 'Two sets of books',
    body: "Side by side at last: the library ledger's Greyfield entries — spanning two years of dates, yet the ink barely feathered, written in one recent sitting — and Wren's true accounts from the dispatch box, dog-eared and honest.\nThe library ledger is a forgery, and a fresh one, planted to be found. Fraud is certain. But it points its finger far too willingly.",
    category: 'clue',
  },

  // --- The House -----------------------------------------------------------
  j_mech_passage: {
    id: 'j_mech_passage',
    title: "The servants' passage",
    body: 'Behind the pantry shelves, a rack of preserves swings on oiled hinges: a servants\' passage runs behind the paneling to a jib door in the study — the same hairline seam you found bolted beside the bookcase.\nOn its floor, fresh candle-wax droplets, and two scuffed lines the width of a pair of heels.\nThe house itself explains how a body crossed it unseen.',
    category: 'mechanism',
  },
  j_mech_boiler: {
    id: 'j_mech_boiler',
    title: 'The strapped damper',
    body: "A luggage strap, buckled hard around the boiler's damper lever, choking the fire shut. Mrs. Tabb banked this boiler at ten to burn till morning; someone came down before midnight and strangled it.\nThe house did not simply go cold. It was MADE cold — so that the conservatory would freeze solid, and keep what it held.",
    category: 'mechanism',
  },
  j_mech_clock: {
    id: 'j_mech_clock',
    title: 'The stopped clock',
    body: "The great hall clock froze at 12:40. Mrs. Tabb's log is plain on the point: whenever the heat fails, the hall clock stops within the hour — its oil stiffens in the cold. So the boiler died around midnight, by somebody's hand.\nWound and set, the old machine ticks again as though nothing happened here. Clocks forgive. Write the time down before you do.",
    category: 'mechanism',
  },

  // --- The Case ------------------------------------------------------------
  j_lore_wren: {
    id: 'j_lore_wren',
    title: 'Aldous Wren',
    body: "The portrait over the parlor mantel: a financier with a winter face and, if you look long enough, something patient around the eyes. Widower these twelve years. His locks were letter-locks — Mrs. Tabb told the constable they were always set to family.\nHis ritual never varied: at ten, one glass of brandy from the study tantalus — he toasted the same way every night, 'the moon at its height, the star at the morning hour, the sun gone under' — then he carried his pipe to the conservatory, to smoke it out among the orchids at midnight, in the only warm room he loved.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_letter: {
    id: 'j_lore_letter',
    title: 'An unsent letter',
    body: "In the study letter tray, sealed, stamped, and trapped by the storm: a letter to a consulting physician in town.\n'Sir — I write in confidence. My own doctor assures me my heart worsens by the season. I find that I feel, if anything, remarkably well. I wish to be examined by a stranger who is paid for an opinion and not for a patient. Say nothing of this to anyone.'\nDated the day the snow began.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_will: {
    id: 'j_lore_will',
    title: 'The redrafted will',
    body: "In the wall safe behind the parlor portrait: a new will, signed and witnessed a month ago. Longwinter House and its living to Mrs. Tabb. A settled annuity to Ivy, 'wherever she chooses to live, and the further she chooses, the prouder I shall be.' The firm's remainder to Ash, 'debts forgiven, as he well knows.'\nAnd one line more: 'To Dr. Casque, my thanks, and my release of her services — she will understand me.'\nHe was done being a patient.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_miniature: {
    id: 'j_lore_miniature',
    title: 'The hollow book',
    body: "A hollowed volume of sermons on the library's highest shelf, where no guest would ever browse: inside, a miniature portrait of a woman with Ivy's eyes, and a ring of dark hair under glass.\nThe financier who kept no sentiment on display kept this where only he would find it.",
    category: 'lore',
    countsTowardLore: true,
  },
};
