import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

/**
 * The case file. Dossiers ('suspect') track the five names; 'clue' holds the
 * physical evidence; 'mechanism' is the ship herself; 'lore' is Marguerite's
 * thread, counting toward the confession epilogue.
 */
export const journal: Record<JournalId, JournalEntryDef> = {
  // --- The Case (lore) -----------------------------------------------------
  j_lore_brief: {
    id: 'j_lore_brief',
    title: 'The inquiry brief',
    body: "From the Line, by wireless, in cipher:\n'Marguerite Toussaint, bonded jewel courier, missing since the second dog watch. Last seen leaving the first-class promenade for her cabin. Consignment unaccounted for. Passengers confined forward; decks cleared for your sweep. You have until we make port. Name the who, the how, the where — and make it hold.'",
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_cabin: {
    id: 'j_lore_cabin',
    title: 'Stateroom Twelve',
    body: 'Her cabin is a sentence stopped mid-word. A tea tray untouched, the cup still full. A coat laid out for the evening turn about the deck she never took twice. Whatever interrupted Marguerite Toussaint, she did not expect it, and she did not come back from it.',
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_memo: {
    id: 'j_lore_memo',
    title: "The courier's suspicion",
    body: "The last page of her memo book, dated the day of sailing:\n'Someone aboard is bleeding the cargo. The manifest says one thing; the hold, I suspect, says another. Tonight I go below and count crates myself. If my sums are right, the thief is a man who signs things for a living.'\nShe was not carrying a jewel toward danger. She was carrying a question.",
    category: 'lore',
    countsTowardLore: true,
  },
  j_lore_crate: {
    id: 'j_lore_crate',
    title: 'Crate seven, opened',
    body: 'Sailcloth folded with terrible care, re-nailed from a nail keg no stevedore opened. Beneath it, what you were sent to find. You note what the court will need, close the lid gently, and stand a moment with your hat off. The rest of this ship owes her the truth, and you mean to collect it.',
    category: 'lore',
    countsTowardLore: true,
  },

  // --- The Ship (mechanism) ------------------------------------------------
  j_mech_keys: {
    id: 'j_mech_keys',
    title: 'Keys of the Meridian',
    body: "The steward's standing orders, posted over the linen press:\n'Cabin keys live on the purser's rack; the rack answers to the letter code D-A-W-N this crossing. The MASTER key opens every door aboard and is drawn from the purser's cage against signature in the key log. No exceptions, no unsigned draws.'",
    category: 'mechanism',
  },
  j_mech_bulkheads: {
    id: 'j_mech_bulkheads',
    title: 'The watertight doors',
    body: "The cook's copy of the drill bill, grease-thumbed:\n'Watertight doors cycle from the stair test panel, DRILL ORDER ONLY, or the frames rack: AFT — FORE — AFT — AMIDSHIPS. One corridor closes as another opens; that is the design, not a fault.'",
    category: 'mechanism',
  },
  j_mech_hatch: {
    id: 'j_mech_hatch',
    title: "The stevedore's rings",
    body: "Reyes's grease-pencil note beside the load placard:\n'Hold hatch: three rings, three emblems. CROWN ALL THREE — anchor, star, and moon each brought to the top mark — and the counterweights do the rest. Stevedores' lock, older than the ship.'",
    category: 'mechanism',
  },

  // --- Evidence (clue) -----------------------------------------------------
  j_cl_railing: {
    id: 'j_cl_railing',
    title: 'The broken railing',
    body: "A section of the promenade rail hangs splintered over the sea, exactly where a struggle would leave it. It is the first thing anyone is meant to see, and it says: lost overboard. First impressions are cheap. Verify it.",
    category: 'clue',
  },
  j_ev_railing: {
    id: 'j_ev_railing',
    title: 'The railing, examined',
    body: 'On your knees with a glass, the story changes. The rail broke OUTWARD — pushed from the deck side, not fallen against. The paint bears no scuffs, the deck no heel marks, the splinters no thread or blood. Nobody went over here. Somebody wanted you certain they had. The railing was staged.',
    category: 'clue',
  },
  j_cl_slate: {
    id: 'j_cl_slate',
    title: 'The salon slate',
    body: "The night's last scores, still chalked by the card table:\n'FINAL HANDS — spade, diamond, spade.' (The master-at-arms sets his key box to the closing suits; a habit half the ship jokes about.)\nBelow, in a looping hand: 'Mrs. Crane in to the middle watch — lost three hands, paid in full, witnessed.'",
    category: 'clue',
  },
  j_ev_keylog: {
    id: 'j_ev_keylog',
    title: 'The master-key log',
    body: "The log Duquesne keeps inside the rack cupboard, in his own regulation hand — with one entry he could not leave out and dared not sign plainly:\n'22:10 master key drawn — [initials smeared]. 22:55 returned.'\nForty-five minutes, the very window of the second dog watch handover. The purser swears he never left his cage after ten o'clock. His own log calls him a liar.",
    category: 'clue',
  },
  j_cl_cipher: {
    id: 'j_cl_cipher',
    title: "Marguerite's letter key",
    body: "Tucked in the valise, her working key to the bill-of-lading code, each consignor's mark against a letter:\n⚓ D · ✶ U · ☾ Q · ⚙ E · ▲ S · ☰ N\n'Read the marks down the consignment column,' she notes, 'and the ledger gives up its name.'",
    category: 'clue',
  },
  j_ev_debts: {
    id: 'j_ev_debts',
    title: 'The debt ledger, decoded',
    body: "Read with her key, the manifest page stops being cargo and becomes a ledger of gambling debts — house markers bought back with skimmed consignment credits, entry after entry, all season long. The account they settle is initialed E.D. and written in the purser's regulation hand: Emile Duquesne, paying Quill's markers with other people's cargo.",
    category: 'clue',
  },
  j_ev_bracket: {
    id: 'j_ev_bracket',
    title: 'The empty bracket',
    body: 'Every tool in the winch flat hangs painted-in on its shadow board — except one. The bracket for the brass winch handle is empty, its shadow crisp and its hook unbent. Not lost, not signed out. Taken. A yard of solid brass with a squared shank, and it is nowhere on this deck.',
    category: 'clue',
  },
  j_ev_scratch: {
    id: 'j_ev_scratch',
    title: 'The scratch on crate seven',
    body: 'Across the lid of crate seven runs a fresh bright gouge — squared at the bottom, a quarter-inch across. You have just measured that profile against an empty bracket one deck up: the squared shank of the brass winch handle, dragged once across the wood by a shaking hand. The means came from the shadow board, and it ended here.',
    category: 'clue',
  },
  j_ev_dumbwaiter: {
    id: 'j_ev_dumbwaiter',
    title: 'The dumbwaiter route',
    body: 'The shaft runs clean from the galley down into the hold — and never once passes the watch station on the service stair. Whoever rode it could go below and come back with no witness and no log line. The crank that works it was missing from the galley; you found it wrapped in a rag behind the ledgers in the purser\'s office.',
    category: 'clue',
  },
  j_ev_tally: {
    id: 'j_ev_tally',
    title: 'The tally that lies',
    body: "The hold tally board against the manifest: crate seven is entered as FULL — machine parts, eleven hundredweight — and re-chalked for offload at the next port. The scale beam says it is nearly empty, emptied and re-nailed. Her last walk ended here: she came down to count crates, and she never left the cargo hold.",
    category: 'clue',
  },

  // --- Dossiers (suspect) --------------------------------------------------
  j_sus_duquesne: {
    id: 'j_sus_duquesne',
    title: 'Dossier: Emile Duquesne',
    body: "Purser, eleven years with the Line. Immaculate books, immaculate manner. Keeper of the key rack, the cabin keys, and the master key against signature. States he was at the purser's window through the second dog watch and 'never left the cage after ten o'clock.' No witness for the handover half-hour — the deck was at dinner.",
    category: 'suspect',
  },
  j_sus_duquesne2: {
    id: 'j_sus_duquesne2',
    title: 'Duquesne: the account comes due',
    body: 'Follow-up. The decoded ledger puts him a season deep in Quill\'s markers, paid down with skimmed cargo credits — the very pilferage Marguerite was tracing. And his alibi is broken by his own key log: the master key drawn at 22:10, returned 22:55, in the exact window he swears he never moved. Motive, means of movement, and a lie. The dossier closes around him.',
    category: 'suspect',
  },
  j_sus_crane: {
    id: 'j_sus_crane',
    title: 'Dossier: Vivienne Crane',
    body: 'Heiress, traveling with eleven trunks and a temper the stewards tiptoe around. Quarreled with Toussaint at dinner over — by three accounts — a sapphire each claimed the better right to wear. Money enough to buy the jewel outright, and pride enough not to.',
    category: 'suspect',
  },
  j_sus_crane2: {
    id: 'j_sus_crane2',
    title: 'Crane: the alibi holds',
    body: "Follow-up. The salon slate is her alibi in chalk: in at cards through the middle watch, lost three hands, paid in full, witnessed by the table. A woman cannot be feeding markers to the Doctor and prowling the cargo deck in the same hour. Strike her, unless the chalk lies — and chalk that public rarely does.",
    category: 'suspect',
  },
  j_sus_reyes: {
    id: 'j_sus_reyes',
    title: 'Dossier: Tomas Reyes',
    body: "Engineer's mate. Knows every shaft, sounding pipe, and hatch dog on the ship — if anyone could move a body unseen, the black gang could. Short-tempered about passengers below decks; had words with the courier two days out when he found her tracing the cargo spaces with a notebook.",
    category: 'suspect',
  },
  j_sus_reyes2: {
    id: 'j_sus_reyes2',
    title: 'Reyes: the wheel does not lie',
    body: 'Follow-up. The engine-room log wheel punches his rounds automatically: on watch at the throttle platform the whole of the second dog watch, stamped every twenty minutes, with the third engineer countersigning. A man cannot punch a wheel two decks down and swing a handle in the hold. Strike him.',
    category: 'suspect',
  },
  j_sus_quill: {
    id: 'j_sus_quill',
    title: "Dossier: 'Doctor' Balthazar Quill",
    body: "Card-sharp, traveling — as ever — as a physician. Ran the salon table every night of the crossing. Holds paper on half the smoking room. A man who profits handsomely from other people's desperation, and knows precisely whose desperation aboard is deepest.",
    category: 'suspect',
  },
  j_sus_quill2: {
    id: 'j_sus_quill2',
    title: 'Quill: the creditor',
    body: 'Follow-up. The master-at-arms confiscated a fold of markers from his case: IOUs across the ship, the thickest bundle initialed E.D. and renewed crossing after crossing. Quill dealt in full view of the salon all night — a dozen witnesses at his elbows. He did not swing anything. But somebody drowning in his paper might.',
    category: 'suspect',
  },
  j_sus_marsh: {
    id: 'j_sus_marsh',
    title: 'Dossier: Nella Marsh',
    body: 'Stewardess for the first-class cabins — including Stateroom Twelve. Carries a steward\'s passkey; the one person aboard with every door open to her and a reason to be behind any of them. Quiet, precise, and the last crew member to admit seeing the courier: turning down berths on the port side at the second dog watch.',
    category: 'suspect',
  },
  j_sus_marsh2: {
    id: 'j_sus_marsh2',
    title: 'Marsh: the planted button',
    body: "Follow-up. The cuff button from the promenade rail is stewards' pattern — and it is wrong. The laundry log records her uniform complete, both cuffs, mended with the line's waxed grey thread on Tuesday; the thread through this shank is dry black cotton, shop-new, never washed. Nobody tore this from her cuff. Somebody threaded it and left it to be found, at the rail, by you. Strike her — and note that the killer wanted her struck in.",
    category: 'suspect',
  },
};
