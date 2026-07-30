/** Scenes for the cabin deck: the First-Class Corridor, Stateroom Twelve, the Crane Suite. */
import type { SceneDef } from '../../../engine/types.ts';
import { deckShell, doorway, frame, porthole, swayLamp } from './common.ts';

export function corridorScene(): SceneDef {
  const prom = doorway(80, 'p_prom_corridor', 'Forward, to the promenade', { scale: 0.85 });
  const stair = doorway(1280, 'p_corridor_stair', 'The service stair', { scale: 0.85 });
  const cabin = doorway(660, 'p_corridor_cabin', 'Stateroom Twelve — sealed for the inquiry', {
    openIf: { flag: 'cabin_open' },
  });
  return {
    palette: 'sleeper',
    layers: [
      ...deckShell(31, 'wood'),
      swayLamp(420, 'lantern', 0.75),
      swayLamp(1080, 'lantern', 0.75),
      ...prom.layers,
      ...cabin.layers,
      ...stair.layers,
      // The inquiry seal across Stateroom Twelve's frame, until you break it.
      {
        kind: 'path', d: 'M 640 240 L 950 480 M 950 240 L 640 480',
        fill: 'none', parallax: 0.12,
        if: { not: { flag: 'cabin_open' } },
      },
      {
        kind: 'path', d: 'M 636 236 l 318 244 l -8 10 l -318 -244 Z M 954 236 l -318 244 l 8 10 l 318 -244 Z',
        fill: 'var(--p-accent)', opacity: 0.7, parallax: 0.12,
        if: { not: { flag: 'cabin_open' } },
      },
      // Marsh's linen trolley, abandoned mid-round.
      { kind: 'primitive', primitive: 'furniture', x: 1050, y: 500, scale: 0.7, parallax: 0.4, props: { kind: 'table', seed: 7 } },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'cabin_lock',
        shape: { kind: 'rect', x: 850, y: 340, w: 90, h: 110 },
        label: "Stateroom Twelve's lock",
        hideWhen: { flag: 'cabin_open' },
        action: {
          type: 'useItem',
          accepts: ['cabin_key'],
          effects: [
            { type: 'removeItem', item: 'cabin_key' },
            { type: 'setFlag', flag: 'cabin_open' },
            { type: 'triggerShift', shift: 's_cabin' },
            { type: 'sound', cue: 'unlock' },
          ],
          wrongItemText: 'The cabin lock turns for its own numbered key and nothing else.',
        },
      },
      {
        id: 'linen_trolley',
        shape: { kind: 'rect', x: 1030, y: 480, w: 220, h: 180 },
        label: 'An abandoned linen trolley',
        action: {
          type: 'inspect',
          text: "Marsh's trolley, stopped mid-round when the decks were cleared — folded sheets squared to a hair. Whatever else she is, she is exact.",
        },
      },
      prom.hotspot,
      cabin.hotspot,
      stair.hotspot,
    ],
  };
}

export function cabinScene(): SceneDef {
  const out = doorway(90, 'p_corridor_cabin', 'Back to the corridor', { scale: 0.85 });
  return {
    palette: 'sleeper',
    layers: [
      ...deckShell(44, 'wood'),
      porthole(1200, 120),
      swayLamp(600, 'lantern', 0.7),
      ...out.layers,
      // Her berth, made; her coat laid out for a walk she never took.
      { kind: 'primitive', primitive: 'furniture', x: 560, y: 340, scale: 1, parallax: 0.25, props: { kind: 'berth', seed: 3 } },
      { kind: 'path', d: 'M 620 380 q 60 -26 130 -8 q 50 14 36 44 q -90 22 -166 -8 Z', fill: 'var(--p-wall-dark)', opacity: 0.8, parallax: 0.26 },
      // The chained valise beneath the berth frame.
      { kind: 'path', d: 'M 540 560 h 190 v 96 h -190 Z', fill: 'var(--p-wall-dark)', parallax: 0.35, if: { not: { solved: 'pz_valise' } } },
      { kind: 'path', d: 'M 540 560 h 190 v 26 h -190 Z', fill: 'var(--p-accent)', opacity: 0.6, parallax: 0.35, if: { not: { solved: 'pz_valise' } } },
      { kind: 'path', d: 'M 540 560 h 190 v 96 h -190 Z M 560 656 l 40 30 M 700 656 l 20 34', fill: 'var(--p-wall-mid)', opacity: 0.9, parallax: 0.35, if: { solved: 'pz_valise' } },
      // The untouched tea tray.
      { kind: 'primitive', primitive: 'furniture', x: 1060, y: 480, scale: 0.75, parallax: 0.35, props: { kind: 'table', seed: 6 } },
      { kind: 'path', d: 'M 1150 520 a 22 12 0 1 0 44 0 a 22 12 0 1 0 -44 0', fill: 'var(--p-fog)', opacity: 0.9, parallax: 0.36 },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'valise',
        shape: { kind: 'rect', x: 530, y: 545, w: 220, h: 130 },
        label: "The courier's chained valise",
        hideWhen: { solved: 'pz_valise' },
        action: { type: 'puzzle', puzzle: 'pz_valise' },
      },
      {
        id: 'tea_tray',
        shape: { kind: 'rect', x: 1050, y: 460, w: 220, h: 190 },
        label: 'The untouched tea tray',
        action: {
          type: 'inspect',
          text: 'The tea is full to the brim and stone cold, the biscuit unbroken. She rang for it, dressed for the deck — and something changed her evening before the first sip.',
        },
      },
      {
        id: 'porthole_trim',
        shape: { kind: 'circle', cx: 1345, cy: 250, r: 40 },
        label: 'The porthole trim ring',
        hideWhen: { flag: 'sapphire_found' },
        action: {
          type: 'inspect',
          text: 'The brass trim ring turns — threaded, and recently. Behind it, snug in the packing felt, a chamois pouch: the Meridian Star, cold and enormous. She hid the consignment before she went below. The killer never had it.',
          effects: [
            { type: 'markSecret', secret: 'sapphire' },
            { type: 'setFlag', flag: 'sapphire_found' },
          ],
        },
      },
      out.hotspot,
    ],
  };
}

export function suiteScene(): SceneDef {
  const out = doorway(80, 'p_prom_suite', 'The starboard door, back to the promenade', { scale: 0.9 });
  return {
    palette: 'sleeper',
    layers: [
      ...deckShell(52, 'velvet'),
      porthole(1230, 110),
      swayLamp(760, 'crystal', 1),
      ...out.layers,
      { kind: 'primitive', primitive: 'portraitFrame', x: 480, y: 130, scale: 0.9, parallax: 0.15, props: { oval: true, seed: 5 } },
      { kind: 'primitive', primitive: 'furniture', x: 900, y: 260, scale: 1, parallax: 0.25, props: { kind: 'cabinet', seed: 9 } },
      { kind: 'primitive', primitive: 'furniture', x: 500, y: 480, scale: 0.85, parallax: 0.35, props: { kind: 'table', seed: 2 } },
      // Trunks, stacked like a battlement.
      { kind: 'path', d: 'M 1180 420 h 260 v 160 h -260 Z M 1200 300 h 220 v 120 h -220 Z', fill: 'var(--p-wall-dark)', parallax: 0.2 },
      { kind: 'path', d: 'M 1180 490 h 260 v 14 h -260 Z M 1200 350 h 220 v 12 h -220 Z', fill: 'var(--p-accent)', opacity: 0.6, parallax: 0.2 },
      ...frame(),
    ],
    hotspots: [
      {
        id: 'portmanteau',
        shape: { kind: 'rect', x: 1170, y: 290, w: 290, h: 300 },
        label: "Mrs. Crane's trunks",
        action: {
          type: 'inspect',
          text: 'Eleven trunks, every lock engaged, every strap cinched — and a jeweller\'s catalogue on top, folded open to sapphires. Wanting a stone is not taking it. The chalk in the salon spends her evening for her.',
        },
      },
      {
        id: 'writing_table',
        shape: { kind: 'rect', x: 490, y: 460, w: 300, h: 200 },
        label: 'The writing table',
        action: {
          type: 'inspect',
          text: "A half-finished letter in a furious hand: '…the Toussaint woman may parade it this crossing, but a COURIER carries what other people own…' Jealousy in full sail — and an alibi in chalk downstairs.",
        },
      },
      out.hotspot,
    ],
  };
}
