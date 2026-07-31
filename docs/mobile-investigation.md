# Can this game work on a phone?

An investigation, 2026-07-31. Short answer: **in landscape, yes, and closer
than expected. In portrait, no — not without redrawing every scene.**

Today phones get a "come back on a computer" notice. This is what it would
take to lift it.

> **Update: Phase 1 is built.** Landscape touch play is live — padded hit
> areas (audited so the padding can't bury anything), named exit buttons in
> place of untappable map nodes, 44px controls, a rotate prompt instead of a
> refusal, and the "look around" control that answers the discovery problem.
> Portrait remains gated. What follows is the investigation that led there.
>
> **Also, same day:** the first item below — fitting the scene instead of
> cropping it — turned out to be a live *desktop* bug too, and has been
> fixed. On a 21:9 monitor (2560×1080) four hotspots were cropped entirely
> off the canvas, two of them required by the walkthrough; on 32:9 it was 22,
> including required pickups. Scenes now use `meet` rather than `slice`, so
> nothing authored is ever cropped at any aspect ratio. The measurements
> below describe the state before that change.

## The measurements

Scenes are authored at 1600×900 and rendered with
`preserveAspectRatio="xMidYMid slice"` — cover and crop. That single choice
decides most of the outcome. Measured against an iPhone-14-class viewport,
minus the header and inventory bar:

| | visible slice of the scene | hotspots off-screen |
|---|---|---|
| **Portrait** (390×754) | x 567–1033 — **29% of the width** | **336 of 545 (62%)** |
| **Landscape** (844×300) | full width, y 166–734 — 63% of height | 30 of 545 (6%) |

In portrait, nearly two-thirds of every interaction in the game is not merely
awkward — it is cropped off the canvas and cannot be touched at all. That is
not a tuning problem; the scenes would have to be re-composed into a narrow
safe area, across eight worlds.

Landscape is a different story: the full width is visible, and only 6% of
hotspots fall outside the vertical crop. Touch-target sizes are also mostly
fine — just 4% of hotspots (21 of 545) come out under the 44px minimum, and
they cluster in the Dream (13%), which uses small sketch-line details.

**The map is the weak point, not the scenes.** Every world's room nodes land
between 12.8px and 31.6px on a landscape phone — *every node in every world*
is below the 44px touch minimum:

| world | map scale | smallest node | under 44px |
|---|---|---|---|
| labyrinth | 0.361 | 23.1px | 14/14 |
| island | 0.357 | 22.9px | 12/12 |
| tower | 0.200 | 12.8px | 12/12 |
| dream | 0.353 | 21.9px | 11/11 |
| manor | 0.357 | 25.7px | 13/13 |
| liner | 0.395 | 31.6px | 12/12 |
| theater | 0.375 | 20.3px | 11/12 |
| express | 0.484 | 21.3px | 13/13 |

## The harder problem: discovery, not layout

Everything above is geometry, and geometry is cheap to fix. The real obstacle
is that **this game teaches itself through hover.** You sweep the cursor, a
shape lights up and names itself — "A brass knocker, polished by worry" — and
that *is* the play. Touch has no hover. A player can still tap a hotspot and
it will fire, but they have no way to find one except by tapping the scene at
random.

Three ways out, in increasing order of intrusion:

1. **A "look around" control.** A button that briefly outlines every live
   hotspot in the room. Genre-appropriate (Myst-likes have shipped this for
   decades), preserves the art when not held, and costs almost nothing — the
   shapes and labels already exist.
2. **A "what's here" list.** The same information as text: every visible
   hotspot's label, tappable. Doubles as a real accessibility win for screen
   readers and keyboard players on desktop.
3. **Permanent markers on touch devices.** Always-visible dots on every
   hotspot. Most discoverable, and the most damaging to the atmosphere the
   whole game is built on.

Recommendation: **1 + 2**. They reinforce each other, neither costs us the
mood, and 2 improves desktop accessibility at the same time.

## What already works on touch (no change needed)

- Parallax is already skipped for touch pointers.
- Audio already initialises on the title-screen tap, satisfying iOS autoplay.
- Saves already fail gracefully if storage is blocked (Safari private mode).
- Persistent messages already dismiss on tap anywhere.
- Puzzle overlays are already scrollable and use ordinary buttons; the cipher
  input raises the normal keyboard.

## What the work would be

**Phase 1 — landscape-playable (the bulk of the value).**
- Fit scenes to the viewport on touch instead of cropping (`meet`, or a
  taller safe area), and re-check the 30 off-screen hotspots.
- Enforce a minimum touch target: expand any hotspot's hit area to 44px
  without changing its art. Extend the existing occlusion audit to assert it,
  so it can never regress.
- Scale up map nodes on touch — bigger radii and hit areas, and larger labels.
- Grow HUD controls (header buttons are ~30px tall today) and the puzzle
  dial arrows.
- Add the "look around" control and the "what's here" list.
- Ask for landscape (the manifest already requests it) and show a gentle
  "turn your phone" prompt in portrait rather than the current hard notice.

**Phase 2 — polish.** Rotary rings sized for fingers, item placement without
precision drags, journal typography for small screens, safe-area insets for
notches.

**Phase 3 — portrait: decided against, permanently.** The scenes are painted
16:9; a portrait phone renders them at about a fifth of scale, which puts
every touch target near 18px against a 44px minimum. It would look correct
and refuse to respond — a worse failure than an honest prompt. Portrait shows
"Rotate to play" at any size, with no way past it, because turning the device
is always possible. Supporting it would mean authoring a second composition
for every room in eight worlds, and it is not planned.

Rough effort: Phase 1 is the substantial one — call it a day's focused work
plus a real device test pass. Phases 2 and 3 are optional and can wait for
evidence that anyone wants them.

## Recommendation

Do Phase 1 as a single project when there's appetite, gated behind landscape.
Keep the notice for portrait. Until then the current gate is the honest
answer: the game is better on a laptop, and saying so beats shipping a
frustrating version of something good.
