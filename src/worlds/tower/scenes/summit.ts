/** The summit: Astrolabe Deck, Mainspring Vault, and the Orrery Dome. */
import type { SceneDef } from '../../../engine/types.ts';
import {
  exitArch,
  girderFrame,
  lampPair,
  stoppedClock,
  towerShell,
} from './common.ts';

export function astrolabeScene(): SceneDef {
  const stair = exitArch(120, 'p_governor_astrolabe', 'The deck stair', {
    scale: 0.8,
    if: { not: { solved: 'pz_astrolabe' } },
  });
  const crawl = exitArch(1440, 'p_crawl_astrolabe', 'The service hatch into the wall', {
    scale: 0.5,
    if: { solved: 'pz_governor' },
  });
  const vaultDoor = exitArch(1080, 'p_astrolabe_vault', 'The vault door', {
    scale: 0.85,
    lit: true,
    if: { solved: 'pz_astrolabe' },
  });
  return {
    palette: 'steam',
    layers: [
      // the open night, and the sea impossibly far below the rail
      { kind: 'primitive', primitive: 'sea', x: 0, y: 300, parallax: 0, props: { w: 1600, h: 240 } },
      { kind: 'path', d: 'M 0 900 L 0 540 L 1600 540 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 300 900 L 640 540 L 960 540 L 1300 900 Z', fill: 'var(--p-wall-light)', opacity: 0.07, parallax: 0 },
      // rail piers framing the openings
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 340, h: 480, seed: 57 } },
      { kind: 'primitive', primitive: 'stoneWall', x: 620, y: 60, parallax: 0, props: { w: 360, h: 480, seed: 58 } },
      { kind: 'primitive', primitive: 'stoneWall', x: 1260, y: 60, parallax: 0, props: { w: 340, h: 480, seed: 59 } },
      { kind: 'path', d: 'M 0 520 H 1600 V 545 H 0 Z', fill: 'var(--p-accent)', opacity: 0.55, parallax: 0.05 },
      stair.layer,
      // after the turn, the stairhead is blank rail
      { kind: 'path', d: 'M 110 160 h 300 v 380 h -300 Z', fill: 'var(--p-wall-mid)', opacity: 0.95, parallax: 0.15, if: { solved: 'pz_astrolabe' } },
      // the vault door faces blank wall until the deck turns
      { kind: 'primitive', primitive: 'door', x: 1130, y: 140, scale: 1.05, parallax: 0.15, props: { open: false }, if: { not: { solved: 'pz_astrolabe' } } },
      vaultDoor.layer,
      crawl.layer,
      // the astrolabe: nested rings around the deck's axis
      { kind: 'primitive', primitive: 'clockFace', x: 640, y: 560, parallax: 0.3, props: { r: 150, hourAngle: 357, minuteAngle: 324, glow: false }, if: { not: { solved: 'pz_astrolabe' } } },
      { kind: 'primitive', primitive: 'clockFace', x: 640, y: 560, parallax: 0.3, props: { r: 150, hourAngle: 0, minuteAngle: 180, glow: true }, if: { solved: 'pz_astrolabe' } },
      { kind: 'path', d: 'M 790 710 m -190 0 a 190 60 0 1 0 380 0 a 190 60 0 1 0 -380 0 Z', fill: 'var(--p-accent)', opacity: 0.25, parallax: 0.3 },
      { kind: 'path', d: 'M 790 710 m -240 0 a 240 78 0 1 0 480 0 a 240 78 0 1 0 -480 0 Z', fill: 'var(--p-accent)', opacity: 0.15, parallax: 0.3 },
      // the Horologist's observing chair
      { kind: 'path', d: 'M 1210 560 h 130 l 14 -110 h -20 l -10 84 h -114 Z M 1230 560 v 130 M 1320 560 v 130', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 600, parallax: 0.55, props: { w: 1400, h: 200, opacity: 0.16, speed: 20 } },
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'astro_rings',
        shape: { kind: 'circle', cx: 790, cy: 710, r: 170 },
        label: 'The astrolabe rings',
        hideWhen: { solved: 'pz_astrolabe' },
        action: { type: 'puzzle', puzzle: 'pz_astrolabe' },
      },
      {
        id: 'horo_chair',
        shape: { kind: 'rect', x: 1190, y: 440, w: 190, h: 250 },
        label: 'A worn observing chair',
        action: {
          type: 'inspect',
          text: 'A chair shaped by one sitter over many years, facing the rail and the sky. Tucked under the seat-slat, a ledger page folded against the dew. You read it where you stand.',
          effects: [{ type: 'unlockJournal', entry: 'j_horo_5' }],
        },
      },
      {
        id: 'deck_rail',
        shape: { kind: 'rect', x: 340, y: 300, w: 280, h: 240 },
        label: 'The open rail',
        action: {
          type: 'inspect',
          text: 'Beyond the rail: cloud, then a coastline, then the sea, all of it very far down and very quiet. From here the tower is not tall. From here the tower is the only thing there is.',
        },
      },
      stair.hotspot,
      vaultDoor.hotspot,
      crawl.hotspot,
    ],
  };
}

export function vaultScene(): SceneDef {
  const back = exitArch(120, 'p_astrolabe_vault', 'Back out to the deck', { scale: 0.8 });
  const domeHatch = exitArch(1120, 'p_vault_dome', 'The dome hatch', {
    scale: 0.8,
    lit: true,
    if: { flag: 'mainspringWound' },
  });
  return {
    palette: 'gearworks',
    layers: [
      ...towerShell(61),
      back.layer,
      // the dome hatch, bolted until the spring is wound
      { kind: 'primitive', primitive: 'door', x: 1170, y: 170, scale: 1.0, parallax: 0.15, props: { open: false }, if: { not: { flag: 'mainspringWound' } } },
      domeHatch.layer,
      // the mainspring drum, filling the room
      { kind: 'primitive', primitive: 'gear', x: 460, y: 120, parallax: 0.18, props: { r: 200, teeth: 20, spin: false }, if: { not: { flag: 'mainspringWound' } } },
      { kind: 'primitive', primitive: 'gear', x: 460, y: 120, parallax: 0.18, props: { r: 200, teeth: 20, spin: true, dur: 60 }, if: { flag: 'mainspringWound' } },
      { kind: 'path', d: 'M 660 320 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0 Z', fill: 'var(--p-wall-dark)', opacity: 0.85, parallax: 0.18 },
      { kind: 'path', d: 'M 660 320 m -84 0 a 84 84 0 1 0 168 0 a 84 84 0 1 0 -168 0 Z', fill: 'var(--p-wall-mid)', opacity: 0.9, parallax: 0.18 },
      // the great keyway at hub height
      { kind: 'path', d: 'M 636 296 h 48 v 48 h -48 Z', fill: '#0b0805', parallax: 0.18, if: { not: { flag: 'mainspringWound' } } },
      // the pinned page above the housing
      { kind: 'primitive', primitive: 'glyphPanel', x: 1000, y: 300, scale: 0.55, parallax: 0.25, props: { rows: 2, cols: 2, seed: 63, glow: true } },
      // the watch on its chain, glinting at the hub
      {
        kind: 'primitive', primitive: 'glint', x: 780, y: 420, scale: 1.2, parallax: 0.25,
        if: { not: { hasItem: 'pocket_watch' } },
      },
      stoppedClock(1400, 140, { r: 45, parallax: 0.2 }),
      ...lampPair(false),
      { kind: 'primitive', primitive: 'brazier', x: 220, y: 430, scale: 0.9, parallax: 0.35, props: { lit: true, seed: 65 } },
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'keyway',
        shape: { kind: 'circle', cx: 660, cy: 320, r: 130 },
        label: 'The great keyway',
        hideWhen: { solved: 'pz_mainspring' },
        action: { type: 'puzzle', puzzle: 'pz_mainspring' },
      },
      {
        id: 'ritual_page',
        shape: { kind: 'rect', x: 990, y: 290, w: 240, h: 180 },
        label: 'A page pinned above the housing',
        action: {
          type: 'inspect',
          text: "In the Horologist's steadiest hand: 'Every dusk, the same order, and no other: LIGHT THE SUN. SET THE MOON. LOOSE THE WANDERERS. AND LET GO.' You copy it exactly.",
          effects: [{ type: 'unlockJournal', entry: 'j_ritual' }],
        },
      },
      {
        id: 'watch_nook',
        shape: { kind: 'circle', cx: 800, cy: 445, r: 65 },
        label: 'A glint of silver on a chain',
        hideWhen: { hasItem: 'pocket_watch' },
        action: {
          type: 'inspect',
          text: 'A pocket watch, hung on the spring housing by its chain — run down at six to midnight, like everything here. Inside the case, an engraving worn soft by a thumb: FOR EVERY HOUR YOU GAVE THE SKY, ONE OF YOUR OWN. — F. You take it gently.',
          effects: [
            { type: 'giveItem', item: 'pocket_watch' },
            { type: 'markSecret', secret: 'watch' },
            { type: 'unlockJournal', entry: 'j_watch' },
          ],
        },
      },
      back.hotspot,
      domeHatch.hotspot,
    ],
  };
}

export function domeScene(): SceneDef {
  const down = exitArch(140, 'p_vault_dome', 'Down through the hatch', { scale: 0.75 });
  return {
    palette: 'brass',
    layers: [
      // night through the dome ribs, sea at the very bottom of the world
      { kind: 'primitive', primitive: 'sea', x: 0, y: 340, parallax: 0, props: { w: 1600, h: 200 } },
      { kind: 'path', d: 'M 0 900 L 0 540 L 1600 540 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'path', d: 'M 340 900 L 660 540 L 940 540 L 1260 900 Z', fill: 'var(--p-wall-light)', opacity: 0.08, parallax: 0 },
      // dome ribs
      { kind: 'path', d: 'M 0 60 h 240 v 480 h -240 Z', fill: 'var(--p-wall-mid)', parallax: 0.05 },
      { kind: 'path', d: 'M 460 0 h 90 v 540 h -90 Z', fill: 'var(--p-wall-mid)', parallax: 0.05 },
      { kind: 'path', d: 'M 1050 0 h 90 v 540 h -90 Z', fill: 'var(--p-wall-mid)', parallax: 0.05 },
      { kind: 'path', d: 'M 1360 60 h 240 v 480 h -240 Z', fill: 'var(--p-wall-mid)', parallax: 0.05 },
      down.layer,
      // the orrery: the sky dial at the axis, rings and wanderers around it
      { kind: 'primitive', primitive: 'clockFace', x: 650, y: 90, parallax: 0.2, props: { r: 150, hourAngle: 357, minuteAngle: 324, glow: false }, if: { not: { solved: 'pz_orrery' } } },
      { kind: 'primitive', primitive: 'clockFace', x: 650, y: 90, parallax: 0.2, props: { r: 150, hourAngle: 0, minuteAngle: 36, glow: true }, if: { solved: 'pz_orrery' } },
      { kind: 'path', d: 'M 800 240 m -290 0 a 290 90 0 1 0 580 0 a 290 90 0 1 0 -580 0 Z', fill: 'var(--p-accent)', opacity: 0.2, parallax: 0.2 },
      { kind: 'path', d: 'M 800 240 m -360 0 a 360 116 0 1 0 720 0 a 360 116 0 1 0 -720 0 Z', fill: 'var(--p-accent)', opacity: 0.12, parallax: 0.2 },
      // the wanderers on their rails
      { kind: 'primitive', primitive: 'glint', x: 495, y: 300, scale: 1.0, parallax: 0.2 },
      { kind: 'primitive', primitive: 'glint', x: 1090, y: 170, scale: 0.8, parallax: 0.2 },
      { kind: 'primitive', primitive: 'glint', x: 950, y: 340, scale: 1.2, parallax: 0.2 },
      // the sun-lamp beside the plinth
      { kind: 'primitive', primitive: 'brazier', x: 320, y: 420, scale: 1.0, parallax: 0.3, props: { lit: false, seed: 67 }, if: { not: { solved: 'pz_orrery' } } },
      { kind: 'primitive', primitive: 'brazier', x: 320, y: 420, scale: 1.0, parallax: 0.3, props: { lit: true, seed: 67 }, if: { solved: 'pz_orrery' } },
      // drive gears under the plinth
      { kind: 'primitive', primitive: 'gear', x: 1180, y: 470, parallax: 0.3, props: { r: 80, teeth: 12, spin: false }, if: { not: { solved: 'pz_orrery' } } },
      { kind: 'primitive', primitive: 'gear', x: 1180, y: 470, parallax: 0.3, props: { r: 80, teeth: 12, spin: true, dur: 18 }, if: { solved: 'pz_orrery' } },
      { kind: 'primitive', primitive: 'fog', x: 200, y: 620, parallax: 0.55, props: { w: 1200, h: 200, opacity: 0.15, speed: 24 } },
      ...girderFrame(),
    ],
    hotspots: [
      {
        id: 'orrery',
        shape: { kind: 'rect', x: 500, y: 60, w: 620, h: 420 },
        label: 'The great orrery',
        hideWhen: { solved: 'pz_orrery' },
        action: { type: 'puzzle', puzzle: 'pz_orrery' },
      },
      {
        id: 'dome_rail',
        shape: { kind: 'rect', x: 640, y: 560, w: 340, h: 180 },
        label: 'The brake rail around the plinth',
        action: {
          type: 'inspect',
          text: 'The brake lever is the most worn thing in the tower — brass gone butter-smooth under decades of one hand, then, lower down, a second polish just beginning. You could count the years of this place by its handles.',
        },
      },
      down.hotspot,
    ],
  };
}
