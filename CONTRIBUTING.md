# Contributing

The Labyrinth Below is a personal hobby project. That said:

- **Feedback and bug reports are very welcome** — open an issue. Playtest
  impressions (pacing, puzzle difficulty, softlocks, confusing moments) are the
  most valuable thing you can send.
- **Forks are welcome.** The engine is deliberately data-driven — worlds are
  content packs under `src/worlds/` — so building your own labyrinth on top of
  it is encouraged.
- **Small fixes** (typos, bugs with a test) are welcome as PRs. For anything
  larger, please open an issue first so we can talk before you invest time.

## Development

```sh
npm install
npm run dev      # dev server
npm test         # engine + world test suite
npm run build    # production bundle
```

One hard rule: `npm test` must stay green. The golden-walkthrough test replays
the full solution through the real reducer — if your change makes the game
unwinnable, that test is designed to fail.
