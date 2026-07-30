import type { JournalEntryDef, JournalId } from '../../engine/types.ts';

/**
 * The case file. Dossiers ('suspect') hold the company; 'clue' holds hard
 * evidence; 'mechanism' the building's stagecraft; 'lore' the case itself and
 * what lies under it. The accusation's answer labels must appear verbatim in
 * these pages — validateWorld enforces the fair-play rule.
 */
export const journal: Record<JournalId, JournalEntryDef> = {
  // --- The Case (lore) -----------------------------------------------------
  j_case: {
    id: 'j_case',
    title: 'Opening night',
    body: 'THE GILDED CURTAIN, a new play by Odette Marlowe. SILAS VANE above the title, "the Lady Vespertine of our age" opposite him.\nAct III, the study scene: the trapdoor ran under Silas Vane on its cue, and he went down twelve feet into the dark and did not rise. The company scattered before the police whistles stopped.\nChalked on the stage-door board: "House word for opening night — the Lady herself."',
    category: 'lore',
    countsTowardLore: true,
  },
  j_vane: {
    id: 'j_vane',
    title: 'Silas Vane, in memoriam',
    body: 'Twenty years the Coronet\'s leading man. Charming from the third balcony, colder up close. His dressing room is a shrine to himself: clippings, garlands, a drawer of borrowed praise.\nOne reviewer\'s line, framed over the mirror: "Vane does not act so much as collect what others earn." He kept it, they say, because he thought it a compliment.',
    category: 'lore',
    countsTowardLore: true,
  },
  j_diary: {
    id: 'j_diary',
    title: "Marlowe's diary, from the dispatch box",
    body: '"He has done it again. My play — MY play — and the bills read \'a Silas Vane production, from an idea by the company.\' Ten years of this. I write him letter after letter and he laughs and calls me his little dramatist.\nI will not kill him. I want him ALIVE to watch the truth get printed. That is the only curtain call I want."',
    category: 'lore',
    countsTowardLore: true,
  },
  j_title_page: {
    id: 'j_title_page',
    title: 'The name under the name',
    body: 'Hidden behind the rosette of Vane\'s own mirror: the original title page of the play.\nTHE GILDED CURTAIN — a drama in three acts — by ODETTE MARLOWE.\nOver her name, a strip of paper pasted with care and peeled by someone\'s thumbnail: "by SILAS VANE." He kept the proof of the theft an arm\'s length from his own reflection.',
    category: 'lore',
    countsTowardLore: true,
  },

  // --- Evidence (clue) -----------------------------------------------------
  j_muses: {
    id: 'j_muses',
    title: 'The four muses of the Coronet',
    body: 'Four bronze plaques beneath the lobby portraits, one per muse of the house:\nCOMEDY smiled for 3 seasons. TRAGEDY wept for 8. MUSIC played for 5. DANCE turned for 2.\nThe chain on the house doors carries four numbered wheels, in the same order.',
    category: 'clue',
  },
  j_prompt_book: {
    id: 'j_prompt_book',
    title: 'The prompt book, Act III',
    body: 'The master copy, open to the study scene. The printed plot reads: TRAP — GO at 0:52 after the thunder.\nOver it, in the caller\'s blue wax pencil — the same hand as every cue in the book: "GO at 0:47." Five seconds early. Five seconds is the difference between an actor braced on his mark and an actor mid-stride.\nOnly one person calls this show, and this book never leaves her desk.',
    category: 'clue',
  },
  j_gallery_key: {
    id: 'j_gallery_key',
    title: 'The gallery padlock',
    body: 'The gate to the fly gallery ladder is padlocked — city-made, new, fitted after Craik cleared the rail "for the safety of the opening." Two keys exist. Joss Barrow\'s hangs on its nail in the rig shop, dust undisturbed on the bow.\nThe other is the small bright untagged key on the stage manager\'s ring. It turns the padlock like it was oiled yesterday.',
    category: 'clue',
  },
  j_weight_log: {
    id: 'j_weight_log',
    title: 'The counterweight log',
    body: 'Barrow\'s log, ruled and exact for thirty pages. Arbor 7 — the Act III trap line — reads: 4 · 1 · 6 hundredweight, checked and signed each night in his square hand.\nOpening night\'s line is different: "Arbor 7 re-hung at the half-hour call." Not his lettering. The initials are W.C., and the pencil is blue wax.\nThe stage manager\'s own alibi is that she never left the prompt desk after the half.',
    category: 'clue',
  },
  j_rail_scuffs: {
    id: 'j_rail_scuffs',
    title: 'Scuffs on the gallery rail',
    body: 'White scuffs on the fly gallery rail and floor planks, where someone braced to lean out over the arbors. Not rosin, not plaster dust — prompt chalk, the fine white stick kept in exactly one place in this building: the cup on the prompt desk.\nWhoever worked at this rail on opening night came up from the prompt corner, and everyone below was watching the stage.',
    category: 'clue',
  },
  j_hollow_weight: {
    id: 'j_hollow_weight',
    title: 'The hollow counterweight',
    body: 'Arbor 7, landed at the rail: five iron weights, logged at 4 · 1 · 6 hundredweight across the racks. The middle weight rings wrong under a knuckle — hollow. Its core has been bored out and packed with sawdust; the paint over the bore is fresh.\nThe trapdoor\'s safety line was re-hung onto this weight. When the cue came, the sabotaged counterweight had nothing to hold — the line ran free, and the trap fell like a headsman.',
    category: 'clue',
  },
  j_safety_line: {
    id: 'j_safety_line',
    title: 'The safety line',
    body: 'The trap\'s original check line, coiled where it fell in the machinery. The end is not frayed and not worn through. It was cut — one clean draw of a sharp blade, days old at most, then re-rigged aloft onto a weight that could never hold it.\nNothing about this was chance. The trap was rebuilt to kill, above, where nobody looks.',
    category: 'clue',
  },
  j_knife: {
    id: 'j_knife',
    title: 'The knife in the prop tray',
    body: 'In the understudy\'s tray, where the Act II stage dagger should sit: a real knife. Steel, honed, cold. The tin prop is missing.\nA real blade in Percy Dunmore\'s tray looks like intent. But the edge is oiled and unmarked, and Silas Vane has no knife wound — he has a fall.',
    category: 'clue',
  },
  j_props_ledger: {
    id: 'j_props_ledger',
    title: 'The props ledger',
    body: 'Every prop signed in and out, every performance, in the props master\'s careful column. The Act II dagger (tin, collapsing): OUT 7:40, marked to the understudy\'s tray.\nIN — 11:40. Signed back in three-quarters of an hour AFTER the curtain fell, after the company scattered, in a hand the column has never seen before. The swap happened after the murder. The knife was set dressing, planted for you to find.\nAnd the coroner\'s man was plain about the body: the wound is a fall\'s wound. No blade ever touched him.',
    category: 'clue',
  },
  j_letters: {
    id: 'j_letters',
    title: "The letters in Vane's drawer",
    body: 'A bundle of letters to Silas Vane, ribboned like love letters and reading like anything but:\n"You have taken the last thing of mine you will ever take." — "I promise you an ending audiences will remember." — "You will not survive another opening night."\nUnsigned. The hand is elegant, furious, and literary.',
    category: 'clue',
  },
  j_typescript: {
    id: 'j_typescript',
    title: 'The marked typescript',
    body: 'Odette Marlowe\'s working copy of the play. The Act III turn is plotted in her margin: "The study becomes the garden — moon ring: crescent to the mark; door ring: gilt door to the mark; garden ring: blossom to the mark."\nAcross the title page, gone over so hard the pen tore paper: "They will print my name or they will print nothing. I am done being UNCREDITED."',
    category: 'clue',
  },

  // --- Stagecraft (mechanism) ----------------------------------------------
  j_mech_curtain: {
    id: 'j_mech_curtain',
    title: 'On the house machine',
    body: 'The Coronet is not a building with machinery in it; it is machinery with seats. The cue board in the prompt corner runs all of it — curtain, limes, bells, traps — which is why the prompt corner, not the stage, is the seat of power here.\nWhoever calls the show operates the building. The building does exactly what it is told.',
    category: 'mechanism',
  },
  j_mech_revolve: {
    id: 'j_mech_revolve',
    title: 'On the revolve',
    body: 'The center of the stage is a great turntable, and the upstage door rides on it. Set the rings and the same doorway delivers you somewhere new — the audience thinks the scene has changed, when really the scene has been changed AROUND them.\nOn opening night the revolve stood set for Act III. Nobody thought to ask what the building had been rehearsing.',
    category: 'mechanism',
  },
  j_mech_traps: {
    id: 'j_mech_traps',
    title: 'On the traps',
    body: 'The trap is honest machinery: rails, cradle, winch, and a safety line that will not let the platform run unless a counterweight holds the line taut. It cannot fail alone. For the trap to kill, the failure has to be built ABOVE it, in the flies, and finished before the house ever opens.\nEveryone investigates the hole a man fell through. Almost no one investigates the sky he fell under.',
    category: 'mechanism',
  },

  // --- Dossiers (suspect) --------------------------------------------------
  j_sus_dunmore: {
    id: 'j_sus_dunmore',
    title: 'Dossier: the understudy',
    body: 'PERCY DUNMORE, 26. Vane\'s understudy for three seasons and never once on. His script is a reliquary: every line of Vane\'s part learned, annotated, loved.\nMotive, obvious to the point of insult: the role.\nAlibi: standing by in the stage-left wing from places to the fall, in full view of two flymen and the props master. He never moved. Witnesses say he was mouthing Vane\'s lines in the dark.',
    category: 'suspect',
  },
  j_sus_craik: {
    id: 'j_sus_craik',
    title: 'Dossier: the stage manager',
    body: 'WILHELMINA CRAIK — Wilhelmina Craik on the contracts, "Mim" to thirty years of companies. Stage manager of the Coronet longer than anyone can prove. Runs the building from the prompt corner; her blue wax pencil is law.\nMotive: none anyone can name. She and Vane barely spoke.\nAlibi: calling the show. Says she never left the prompt desk from the half-hour call to the fall, and the whole company heard her voice on the cans.\nHer prompt book\'s flyleaf, in blue pencil: "Top of show: house to half — limes up — bells front — ring up."',
    category: 'suspect',
  },
  j_sus_reyes: {
    id: 'j_sus_reyes',
    title: 'Dossier: the rival lead',
    body: 'CONSTANCE REYES-ADLER, billed opposite Vane and beneath him, to her public fury. Their feud sold half the house.\nMotive: top billing, at last.\nAlibi: mid quick-change in her stage-right room at the fall — her dresser\'s pins are still scattered where they both dropped everything. Her note to the police, underlined twice: "At the half-hour call the counterweights RAN in the loft above my room. Ask your riggers who was aloft at the half."',
    category: 'suspect',
  },
  j_sus_marlowe: {
    id: 'j_sus_marlowe',
    title: 'Dossier: the playwright',
    body: 'ODETTE MARLOWE, author of THE GILDED CURTAIN — though the bills say otherwise. Ten years writing the Coronet\'s hits; ten years watching Vane\'s name settle over hers like dust.\nMotive: the letters in Vane\'s drawer read like a promise of murder.\nAlibi: in the author\'s box the whole of Act III. The house manager brought her a brandy at the thunder cue and was still beside her when Vane dropped.',
    category: 'suspect',
  },
  j_sus_barrow: {
    id: 'j_sus_barrow',
    title: 'Dossier: the master rigger',
    body: 'JOSS BARROW, master rigger. The flies are his church; he logs every hundredweight like scripture. The trap, the lines, the arbors — all his, which makes every dead mechanism his signature.\nMotive: none found. Vane never looked up far enough to insult him.\nAlibi: banished from his own rail for opening night — Craik\'s new cue plot cleared the gallery "for safety." He sat at the stage door drinking coffee, signed in, in the doorkeeper\'s book, from the half-hour to the interval that never came.\nPainted over his bench in his own neat hand: "EASE the brake. HAUL the purchase. DOG her off. LAND her soft."',
    category: 'suspect',
  },
  j_sus_marlowe_2: {
    id: 'j_sus_marlowe_2',
    title: 'Follow-up: the letters were not a confession',
    body: 'Laid beside the manuscript, the unsigned letters are Odette Marlowe\'s hand, letter for letter — and so is their subject. Every threat is about CREDIT: "the last thing of mine you will ever take" is a title page. "An ending audiences will remember" is a lawsuit, promised in writing, dated for the morning after opening.\nShe wanted him alive, disgraced, and reading the papers. The letters are a grievance, not a murder weapon.',
    category: 'suspect',
  },
  j_sus_craik_2: {
    id: 'j_sus_craik_2',
    title: 'Follow-up: the calling hand',
    body: 'Stand at the gallery rail and the case assembles itself. The cue called five seconds early, in Wilhelmina Craik\'s blue pencil, in the book that never leaves her hand. The gallery gate that answers only her untagged key — Barrow\'s still on its nail. Prompt chalk scuffed along the rail where she braced to re-hang a murdered man\'s safety line.\nShe called the half-hour from up here, signed Barrow\'s log without thinking — thirty years of habit — went down, and called the show that killed him in a steady voice.',
    category: 'suspect',
  },
};
