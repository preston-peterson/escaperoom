# Security Policy

## Threat model

The Labyrinth Below is a fully static, client-side browser game: no backend,
no accounts, no data collection, no cookies, no third-party requests. Game
saves live only in your own browser's localStorage. The practical attack
surface is limited to the integrity of the published site and its build
pipeline (GitHub Actions → GitHub Pages).

## Reporting a vulnerability

If you find a security issue (e.g. in the build/deploy pipeline or a way the
site could serve unintended content), please use GitHub's **private
vulnerability reporting** on this repository ("Security" tab → "Report a
vulnerability") rather than a public issue.

You can expect an acknowledgement within a week. There is no bug bounty —
this is a hobby project — but reports are genuinely appreciated and credited.
