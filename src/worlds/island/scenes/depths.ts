/** The depths: the Tidal Engine and the Undertow Gate beneath the bay. */
import type { SceneDef } from '../../../engine/types.ts';
import { exitArch, foregroundFrame, roomShell } from './common.ts';

export function engineHallScene(): SceneDef {
  const up = exitArch(140, 'p_square_engine', 'The stair up to the square', { scale: 0.8, lit: true });
  return {
    palette: 'waterworks',
    layers: [
      ...roomShell(71),
      up.layer,
      // the architrave inscription
      { kind: 'primitive', primitive: 'glyphPanel', x: 560, y: 80, scale: 0.7, parallax: 0.1, props: { rows: 1, cols: 6, seed: 73 } },
      // the tide-wheel and its train
      { kind: 'primitive', primitive: 'gear', x: 620, y: 200, parallax: 0.18, props: { r: 170, teeth: 16, spin: false }, if: { not: { flag: 'tideHigh' } } },
      { kind: 'primitive', primitive: 'gear', x: 620, y: 200, parallax: 0.18, props: { r: 170, teeth: 16, spin: true, dur: 34 }, if: { flag: 'tideHigh' } },
      { kind: 'primitive', primitive: 'gear', x: 930, y: 300, parallax: 0.18, props: { r: 90, teeth: 10, spin: false }, if: { not: { flag: 'tideHigh' } } },
      { kind: 'primitive', primitive: 'gear', x: 930, y: 300, parallax: 0.18, props: { r: 90, teeth: 10, spin: true, dur: 19 }, if: { flag: 'tideHigh' } },
      { kind: 'primitive', primitive: 'pipes', x: 1080, y: 150, parallax: 0.2, props: { seed: 22 } },
      // the open housing with its three empty seats
      { kind: 'path', d: 'M 420 560 h 360 v 150 h -360 Z', fill: 'var(--p-wall-dark)', opacity: 0.9, parallax: 0.3 },
      {
        kind: 'path',
        d: 'M 470 610 a 26 26 0 1 0 0.1 0 Z M 580 610 a 26 26 0 1 0 0.1 0 Z M 690 610 a 26 26 0 1 0 0.1 0 Z',
        fill: '#04070a', parallax: 0.3,
        if: { not: { flag: 'engineFitted' } },
      },
      {
        kind: 'path',
        d: 'M 470 610 a 26 26 0 1 0 0.1 0 Z M 580 610 a 26 26 0 1 0 0.1 0 Z M 690 610 a 26 26 0 1 0 0.1 0 Z',
        fill: 'var(--p-glow)', opacity: 0.6, parallax: 0.3,
        if: { flag: 'engineFitted' },
      },
      // the four capstans of the flood-winch
      { kind: 'primitive', primitive: 'lever', x: 900, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: false }, if: { not: { solved: 'pz_floodgates' } } },
      { kind: 'primitive', primitive: 'lever', x: 1030, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: false }, if: { not: { solved: 'pz_floodgates' } } },
      { kind: 'primitive', primitive: 'lever', x: 1160, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: false }, if: { not: { solved: 'pz_floodgates' } } },
      { kind: 'primitive', primitive: 'lever', x: 900, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: true }, if: { solved: 'pz_floodgates' } },
      { kind: 'primitive', primitive: 'lever', x: 1030, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: true }, if: { solved: 'pz_floodgates' } },
      { kind: 'primitive', primitive: 'lever', x: 1160, y: 560, scale: 0.85, parallax: 0.35, props: { pulled: true }, if: { solved: 'pz_floodgates' } },
      // the run-off channel
      { kind: 'primitive', primitive: 'waterPool', x: 300, y: 780, parallax: 0.5, props: { w: 1000, h: 100 } },
      // the stair beneath the wheel, once the sea turns it
      { kind: 'path', d: 'M 620 760 L 860 760 L 900 880 L 580 880 Z', fill: '#03060a', parallax: 0.4, if: { flag: 'tideHigh' } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'engine_inscription',
        shape: { kind: 'rect', x: 550, y: 70, w: 460, h: 120 },
        label: 'Letters of set lead above the engine',
        action: {
          type: 'inspect',
          text: "'WE DO NOT CHAIN THE SEA. WE ROCK IT. A CRADLE NEEDS A HAND UPON IT, OR A WEIGHT WORTH A HAND.' You copy the architrave line by line.",
          effects: [{ type: 'unlockJournal', entry: 'j_warden_2' }],
        },
      },
      {
        id: 'sockets',
        shape: { kind: 'rect', x: 410, y: 550, w: 380, h: 170 },
        label: 'The open housing, three seats empty',
        hideWhen: { flag: 'engineFitted' },
        action: { type: 'puzzle', puzzle: 'pz_engineparts' },
      },
      {
        id: 'winch',
        shape: { kind: 'rect', x: 880, y: 540, w: 420, h: 230 },
        label: 'The four capstans of the flood-winch',
        hideWhen: { solved: 'pz_floodgates' },
        action: { type: 'puzzle', puzzle: 'pz_floodgates' },
      },
      {
        id: 'wheel_dead',
        shape: { kind: 'circle', cx: 790, cy: 370, r: 170 },
        label: 'The great tide-wheel, still',
        if: { not: { flag: 'tideHigh' } },
        action: {
          type: 'inspect',
          text: 'A wheel broad as a threshing floor, meant to be turned by the weight of the returning sea. Dry, it is only an enormous piece of patience.',
        },
      },
      {
        id: 'wheel_live',
        shape: { kind: 'circle', cx: 790, cy: 370, r: 170 },
        label: 'The great tide-wheel, turning',
        if: { flag: 'tideHigh' },
        action: {
          type: 'inspect',
          text: 'The wheel turns with the unhurried confidence of weather. The whole hall has a pulse now. Under your feet, the new-opened stair breathes cold salt air.',
        },
      },
      {
        id: 'stair_down',
        shape: { kind: 'polygon', points: [[620, 760], [860, 760], [900, 880], [580, 880]] },
        label: 'The streaming stair beneath the wheel',
        if: { flag: 'tideHigh' },
        action: { type: 'navigate', passage: 'p_engine_undergate' },
      },
      up.hotspot,
    ],
  };
}

export function underGateScene(): SceneDef {
  const up = exitArch(140, 'p_engine_undergate', 'The stair up to the engine', { scale: 0.75, lit: true });
  return {
    palette: 'crypt',
    layers: [
      ...roomShell(83),
      up.layer,
      // the Undertow Gate
      { kind: 'primitive', primitive: 'portal', x: 620, y: 140, parallax: 0.12, props: { r: 170, open: false }, if: { not: { solved: 'pz_quieting' } } },
      { kind: 'primitive', primitive: 'portal', x: 620, y: 140, parallax: 0.12, props: { r: 170, open: true }, if: { solved: 'pz_quieting' } },
      // the empty lamp bracket at its crown — then her lantern, burning
      { kind: 'path', d: 'M 775 110 h 40 v 34 h -40 Z M 790 76 h 10 v 40 h -10 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.12, if: { not: { solved: 'pz_quieting' } } },
      { kind: 'primitive', primitive: 'torch', x: 758, y: 60, scale: 0.65, parallax: 0.12, props: { lit: true, seed: 9 }, if: { solved: 'pz_quieting' } },
      // the rite, cut around the ring
      { kind: 'primitive', primitive: 'glyphPanel', x: 260, y: 280, scale: 0.6, parallax: 0.2, props: { rows: 4, cols: 2, seed: 87 } },
      // the drowned bell on its trestle
      { kind: 'path', d: 'M 1160 420 q 60 -50 120 0 l 16 120 h -152 Z M 1120 560 h 220 v 20 h -220 Z', fill: 'var(--p-accent)', opacity: 0.8, parallax: 0.3 },
      // seawater threading the floor
      { kind: 'primitive', primitive: 'waterPool', x: 420, y: 740, parallax: 0.45, props: { w: 800, h: 120 } },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 520, parallax: 0.5, props: { w: 1400, h: 280, opacity: 0.26, speed: 16 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'gate_rite',
        shape: { kind: 'rect', x: 250, y: 270, w: 260, h: 340 },
        label: 'Words cut around the gate',
        action: {
          type: 'inspect',
          text: "'LIGHT FOR THE SLEEPER. MOTION FOR THE SEA. ONE BELL FOR THE VANISHED. AND SILENCE FOR THE KEEPER.' The grooves are clean of weed — kept clean. You copy the rite with cold fingers.",
          effects: [{ type: 'unlockJournal', entry: 'j_gate_rite' }],
        },
      },
      {
        id: 'gate',
        shape: { kind: 'rect', x: 620, y: 140, w: 340, h: 460 },
        label: 'The Undertow Gate',
        hideWhen: { solved: 'pz_quieting' },
        action: { type: 'puzzle', puzzle: 'pz_quieting' },
      },
      {
        id: 'drowned_bell',
        shape: { kind: 'rect', x: 1110, y: 400, w: 240, h: 200 },
        label: 'A bell green with the sea',
        action: {
          type: 'inspect',
          text: 'A harbor bell, drowned so long its bronze has gone the color of kelp. Its clapper is bound with new cord, ready to be struck exactly once. Someone prepared this room for you.',
        },
      },
      up.hotspot,
    ],
  };
}
