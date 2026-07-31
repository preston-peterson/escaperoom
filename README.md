# The Labyrinth Below

A browser game anthology crossing an **escape-room board game**, a
**labyrinth**, and the atmosphere of **Myst** — with a shelf of **whodunit
mysteries** alongside. Explore fog-of-war maps that zoom into first-person
scenes rendered entirely in hand-coded SVG, solve interlocking mechanisms
that physically rearrange the world around you, and in the mystery cases,
build a case file until you can name the who, the how, and the where.

Fully client-side — no backend, no image or audio assets. All art is layered
SVG; all sound is synthesized WebAudio.

**Play it now:** https://preston-peterson.github.io/escaperoom/

**Install it:** the site is a PWA. Visit once and every world is cached up
front — including ones you've never opened — so it plays offline in any
browser with service workers, Firefox included. Chromium browsers (Chrome,
Edge, Brave, Ungoogled Chromium) also offer to *install* it, and the atlas
shows an "install it" link when they do; Safari installs via *File → Add to
Dock*. Firefox desktop can't install web apps at all (Mozilla removed that in
Firefox 98) — offline still works there, it just stays a tab. Updates install
themselves.

**Play it on a plane without installing anything:** [download the single-file
copy](https://preston-peterson.github.io/escaperoom/labyrinth-below-offline.html)
(right-click → Save As). The whole anthology — all eight worlds, art, and
sound — is inlined into one HTML file. Double-click it on any laptop and it
runs with no server and no network.

## Play

```sh
npm install
npm run dev        # develop
npm run build      # production bundle (static, deployable anywhere)
npm run preview    # serve the production bundle
npm test           # engine + world test suite
```

Solo or huddle a group around one screen. Untimed by default; **Challenge
mode** gives you one hour per world. Progress autosaves to localStorage.

## The Atlas — eight worlds in two acts

**Act I — The Descents.** Four vanished keepers, four machines that must not
stop:

- *The Labyrinth Below* — a torch-lit maze beneath the mountain whose
  chambers rotate; follow the notes of Vell, the cartographer who never came
  back.
- *The Silent Island* — a grey-sea island where the tide itself is the
  mechanism: drain the bay, restart the Wardens' engine, quiet what sleeps.
- *The Orrery Tower* — a vertical clockwork of brass and steam whose floors
  are gears; rotate them back into alignment and rewind the sky.
- *The Unfinished Dream* — a stalled dream of impossible stairs and doors
  that quietly start leading somewhere else; finish the last room so the
  Sleeper can wake.

**Act II — The Casebook.** Four aftermath-style mysteries — the cast is gone
when you arrive; the rooms, letters, and physical evidence testify. Each
ends in an accusation (who / how / where) that the engine refuses until the
keystone evidence is found:

- *The Longwinter House* — a financier dead behind a locked study door in a
  snowbound manor.
- *The Meridian* — a jewel courier vanishes between decks, days from any
  shore.
- *The Gilded Curtain* — the lead falls through the trapdoor on opening
  night; the revolving stage rewires the map mid-case.
- *The Sable Express* — a colonel dead behind a latched sleeper door on a
  night train whose cars will not stay in order.

Every world: five-plus puzzle types, story shifts that rearrange the map
topology, secrets, a journal that fills as you explore (a case file, in the
mysteries), tiered hints (nudge → hint → solution), and achievements.

## Architecture

- **Pure-reducer core** (`src/engine/`): all game rules live in
  `reduce(state, action, world)` over a fully serializable `GameState`.
  Timestamps travel in action payloads; the reducer never calls
  `Date.now()`/`Math.random()`. Saves are state snapshots; each world's
  golden-walkthrough test replays a scripted action list through the real
  reducer and asserts victory. The same action-stream contract is the future
  path to online co-op.
- **Engine/content split**: `src/engine/` never imports from `src/ui/` or
  `src/worlds/`. A world is one big typed data object (`WorldDef`) — rooms,
  scenes, passages, puzzles, shifts, items, journal, achievements. The
  world-select is a registry of acts and content packs; each world
  lazy-loads as its own chunk.
- **Scenes as data**: each room's scene is a list of layered, parallaxed,
  conditionally-visible primitives (torches, fog, gears, chandeliers, stage
  curtains, paper evidence…) from `src/ui/art/`, plus hotspots (inspect /
  pickup / puzzle / navigate / use-item). New rooms are authored without
  writing components.
- **Maze shifts**: a shift is a batch of open/close/reveal/remap ops applied
  atomically to the passage graph, plus a purely visual animation hint
  (rotate/slide/reveal/rumble) for the map. Rotating hubs, decoupling train
  cars, and revolving stages are all the same primitive.
- **Mysteries**: an `accusation` puzzle type (per-category options, one
  fixed rebuke for wrong verdicts), a dossier journal category with
  per-world case-file labels, and a validator rule that every accusation
  answer must be named somewhere in discoverable evidence.
- **Audio** (`src/engine/audio/`): noise-bed ambience, drips through a
  generated impulse-response reverb, torch crackle, shift rumbles, solve
  chimes — all synthesized at runtime.

## Tests

`npm test` runs Vitest in Node (no browser needed) — 167 tests across eight
worlds: reducer behavior, puzzle validators, topology shifts and
reachability gates, save round-trips, achievements, whole-world referential
integrity (`validateWorld`), a golden walkthrough per world (the game must
remain winnable after any content edit), and per-mystery proofs that the
correct verdict is mechanically locked until the keystone evidence is
discovered.
