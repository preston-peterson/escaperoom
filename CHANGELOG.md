# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Two ways to play without a network.** The site is now an installable PWA
  — visit once and it caches every world, opens in its own window, and
  updates itself. And `npm run build:offline` produces a single
  self-contained HTML file (published alongside the site) that runs from a
  double-click with no server at all.
- App icons generated from the repo's own SVG mark (`npm run icons`), so the
  only binary assets are derived from our vector art.
- A notice for phones and cramped windows explaining the game needs a
  pointer and width, with a "Try anyway" escape hatch.

### Added
- **Act II: The Casebook** — the atlas gains a second shelf of whodunit
  mysteries. Aftermath-style: the cast is gone; you reconstruct the crime
  from dossiers, evidence, and abandoned rooms, ending in a who/how/where
  accusation that the engine refuses until the keystone evidence is found.
  All four cases open: **The Longwinter House** (a financier dead behind a
  locked study door in a snowbound manor), **The Sable Express** (a colonel
  dead behind a latched sleeper door on a night train whose cars reorder
  mid-case), **The Meridian** (a jewel courier vanishes between decks
  mid-crossing), and **The Gilded Curtain** (the lead falls through the
  trapdoor on opening night; the revolve itself rewires the map).
- Accusation puzzle type, dossier journal category with per-world case-file
  labels, first-try-deduction achievement, eight interior scene primitives,
  and six new palettes.

### Fixed
- The Unfinished Dream's threshold: the lone door's hotspot covered the
  brass knocker (unfindable way in); the knocker now glints and owns the
  door until answered.

### Added
- Three new worlds — all four descents now open:
  **The Silent Island** (tide-driven Myst-like island — restart the Wardens'
  Tidal Engine before the Undertow wakes), **The Orrery Tower** (vertical
  brass clockwork — rotate the frozen floors back into alignment and rewind
  the sky), and **The Unfinished Dream** (a stalled dream whose doors get
  rewired mid-game — gather the ideas the last room needs and sing the
  Sleeper awake). Each: 11–12 rooms, all five puzzle types, secrets, journal,
  achievements, and its own golden-walkthrough test.
- Six new scene primitives (sea, tree, clock face, pipes, floating isle,
  portal) and six palettes for the new worlds.

### Fixed
- Input lag: parallax no longer re-renders the scene per mouse move; fog no
  longer uses an animated blur filter; movement clicks debounced against
  double-click backtracking; message toasts docked bottom-left and capped.

### Changed
- In-game messages persist until dismissed with an ✕ instead of auto-expiring.

## [0.1.0] - 2026-07-28

### Added
- Initial release: The Labyrinth Below — data-driven engine (pure reducer,
  localStorage saves), fog-of-war map + first-person SVG scenes, synthesized
  WebAudio ambience, 14 chambers, 11 puzzles across 5 types, 3 maze shifts,
  secrets, journal, tiered hints, achievements, optional challenge timer.
- GitHub Pages deploy workflow; the golden-walkthrough test gates every deploy.
