# The Labyrinth Below

A browser game crossing an **escape-room board game**, a **labyrinth**, and the
atmosphere of **Myst**: explore a fog-of-war maze on a board-game-style map,
step into first-person torch-lit chambers rendered entirely in hand-coded SVG,
and solve interlocking mechanisms that physically rearrange the maze around you.

Fully client-side — no backend, no image or audio assets. All art is layered
SVG; all sound is synthesized WebAudio.

**Play it now:** https://preston-peterson.github.io/escaperoom/

## Play

```sh
npm install
npm run dev        # develop
npm run build      # production bundle (static, deployable anywhere)
npm run preview    # serve the production bundle
npm test           # engine + world test suite
```

Solo or huddle a group around one screen. Untimed by default; **Challenge
mode** gives you one hour. Progress autosaves to localStorage.

## The first world — *The Labyrinth Below*

Follow the trail of Vell, a cartographer who vanished a century ago, into a
maze beneath the mountain: 14 chambers in three wings around a rotating hub,
11 mechanisms across five puzzle types, three story shifts that rearrange the
maze topology, two secrets, a journal that fills as you explore, tiered hints
(nudge → hint → solution), and achievements.

Three more worlds (island ruins, clockwork tower, surreal dreamscape) appear
sealed on the world-select screen — the engine is fully data-driven, so each
new world is a content pack.

## Architecture

- **Pure-reducer core** (`src/engine/`): all game rules live in
  `reduce(state, action, world)` over a fully serializable `GameState`.
  Timestamps travel in action payloads; the reducer never calls
  `Date.now()`/`Math.random()`. Saves are state snapshots; the golden
  walkthrough test replays a scripted action list through the real reducer and
  asserts victory. The same action-stream contract is the future path to
  online co-op.
- **Engine/content split**: `src/engine/` never imports from `src/ui/` or
  `src/worlds/`. A world is one big typed data object (`WorldDef`) —
  rooms, scenes, passages, puzzles, shifts, items, journal, achievements.
- **Scenes as data**: each room's scene is a list of layered, parallaxed,
  conditionally-visible primitives (torches, fog, gears, glyph panels…)
  from `src/ui/art/`, plus hotspots (inspect / pickup / puzzle / navigate /
  use-item). New rooms are authored without writing components.
- **Maze shifts**: a shift is a batch of open/close/reveal/remap ops applied
  atomically to the passage graph, plus a purely visual animation hint
  (rotate/slide/reveal/rumble) for the map.
- **Audio** (`src/engine/audio/`): cave-air noise bed, drips through a
  generated impulse-response reverb, torch crackle, shift rumbles, solve
  chimes — all synthesized at runtime.

## Tests

`npm test` runs Vitest in Node (no browser needed): reducer behavior, puzzle
validators, topology shifts and reachability gates, save round-trips,
achievements, whole-world referential integrity (`validateWorld`), and the
golden walkthrough (game must remain winnable after any content edit).
