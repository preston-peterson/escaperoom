# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
