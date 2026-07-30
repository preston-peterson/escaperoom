/** The forward cars: dining, baggage, and the engine cab. */
import type { SceneDef } from '../../../engine/types.ts';
import { carDoor, carLantern, carShell, carWindows, frameEdges } from './common.ts';

export function diningScene(): SceneDef {
  const rear = carDoor(1240, 'p_dining_corra', 'The rear vestibule — to the sleepers', { scale: 0.85 });
  return {
    palette: 'parlor',
    layers: [
      ...carShell(14, 'wood'),
      ...carWindows([180, 460], 'snow'),
      carLantern(560),
      carLantern(1000),
      rear.layer,
      // the forward vestibule to the baggage car
      { kind: 'primitive', primitive: 'door', x: 60, y: 186, scale: 0.85, parallax: 0.12, props: { open: false }, if: { not: { flag: 'baggage_unlocked' } } },
      { kind: 'primitive', primitive: 'door', x: 60, y: 186, scale: 0.85, parallax: 0.12, props: { open: true }, if: { flag: 'baggage_unlocked' } },
      // laid tables, abandoned mid-supper
      { kind: 'primitive', primitive: 'furniture', x: 380, y: 460, scale: 0.9, parallax: 0.4, props: { kind: 'table', seed: 3 } },
      { kind: 'primitive', primitive: 'furniture', x: 330, y: 480, scale: 0.75, parallax: 0.42, props: { kind: 'chair', seed: 4 } },
      { kind: 'primitive', primitive: 'furniture', x: 900, y: 470, scale: 0.9, parallax: 0.4, props: { kind: 'table', seed: 7 } },
      { kind: 'primitive', primitive: 'furniture', x: 1120, y: 490, scale: 0.75, parallax: 0.42, props: { kind: 'chair', seed: 6 } },
      // the steward's bar and pantry
      { kind: 'primitive', primitive: 'furniture', x: 620, y: 330, scale: 0.85, parallax: 0.3, props: { kind: 'bar', seed: 5 } },
      // the bell-board above the bar
      { kind: 'path', d: 'M 660 150 L 980 150 L 980 260 L 660 260 Z', fill: 'var(--p-wall-dark)', parallax: 0.28 },
      ...[0, 1, 2, 3, 4].map((i) => ({
        kind: 'path' as const,
        d: `M ${680 + i * 60} 170 L ${724 + i * 60} 170 L ${724 + i * 60} 240 L ${680 + i * 60} 240 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.8,
        parallax: 0.28,
      })),
      // the steward's slate
      { kind: 'primitive', primitive: 'paperScrap', x: 1050, y: 300, scale: 1, parallax: 0.3, props: { kind: 'ledger', rotate: -4, seed: 2 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'call_slate',
        shape: { kind: 'rect', x: 1030, y: 280, w: 200, h: 150 },
        label: 'The steward’s call slate',
        action: {
          type: 'inspect',
          text: 'The steward chalked the night’s bell calls as they came: brandy to No. 5 at 23:05, warm milk to No. 2 at 23:20, a late supper tray to No. 1 at 23:35, cocoa to No. 4 at ten to midnight. You copy the slate — and how the board works — into the case file.',
          effects: [{ type: 'unlockJournal', entry: 'j_mech_bells' }],
        },
      },
      {
        id: 'bell_board',
        shape: { kind: 'rect', x: 650, y: 140, w: 340, h: 130 },
        label: 'The bell-board',
        hideWhen: { solved: 'pz_bells' },
        action: { type: 'puzzle', puzzle: 'pz_bells' },
      },
      {
        id: 'baggage_lock',
        shape: { kind: 'rect', x: 40, y: 180, w: 280, h: 390 },
        label: 'The baggage door — NO ADMITTANCE WITHOUT THE GUARD’S KEY',
        hideWhen: { flag: 'baggage_unlocked' },
        action: {
          type: 'useItem',
          accepts: ['baggage_key'],
          effects: [
            { type: 'removeItem', item: 'baggage_key' },
            { type: 'setFlag', flag: 'baggage_unlocked' },
            { type: 'triggerShift', shift: 's_baggage_door' },
          ],
          wrongItemText: 'The guard’s lock wants the guard’s key, and knows the difference.',
        },
      },
      {
        id: 'baggage_way',
        shape: { kind: 'rect', x: 40, y: 180, w: 280, h: 390 },
        label: 'Forward, into the baggage car',
        if: { flag: 'baggage_unlocked' },
        action: { type: 'navigate', passage: 'p_dining_baggage' },
      },
      {
        id: 'platform_door',
        shape: { kind: 'rect', x: 180, y: 620, w: 260, h: 220 },
        label: 'Down to the platform',
        action: { type: 'navigate', passage: 'p_platform_dining' },
      },
      {
        id: 'abandoned_supper',
        shape: { kind: 'rect', x: 860, y: 440, w: 320, h: 220 },
        label: 'A table abandoned mid-supper',
        action: {
          type: 'inspect',
          text: 'A supper for one, gone cold under its cover — the tray the colonel rang for at 23:35 and never came forward to claim. The napkin is still folded. He was already walking the other way.',
        },
      },
      rear.hotspot,
    ],
  };
}

export function baggageScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...carShell(21, 'iron'),
      carLantern(300, true),
      // the forward gangway, blocked by the crate platform until it swings
      { kind: 'primitive', primitive: 'door', x: 70, y: 186, scale: 0.85, parallax: 0.12, props: { open: false }, if: { not: { flag: 'crates_swung' } } },
      { kind: 'primitive', primitive: 'rubble', x: 40, y: 400, scale: 1, parallax: 0.2, props: { w: 420, seed: 12 }, if: { not: { flag: 'crates_swung' } } },
      { kind: 'primitive', primitive: 'door', x: 70, y: 186, scale: 0.85, parallax: 0.12, props: { open: true }, if: { flag: 'crates_swung' } },
      // stacked freight and the bonded cage
      { kind: 'primitive', primitive: 'furniture', x: 520, y: 250, scale: 1, parallax: 0.25, props: { kind: 'cabinet', seed: 8 } },
      { kind: 'primitive', primitive: 'furniture', x: 700, y: 290, scale: 0.9, parallax: 0.28, props: { kind: 'cabinet', seed: 11 } },
      { kind: 'primitive', primitive: 'panelWall', x: 1020, y: 200, parallax: 0.2, props: { w: 480, h: 360, seed: 6, style: 'iron', wainscot: false } },
      { kind: 'primitive', primitive: 'glint', x: 1120, y: 380, scale: 0.9, parallax: 0.22, props: { r: 7 }, if: { not: { solved: 'pz_cage' } } },
      // mail sacks in the shadowed corner
      { kind: 'path', d: 'M 340 560 q 40 -110 110 -70 q 80 -40 120 30 q 60 10 40 80 l -270 0 Z', fill: 'var(--p-wall-dark)', parallax: 0.45 },
      // the transfer brake wheel
      { kind: 'primitive', primitive: 'gear', x: 180, y: 560, scale: 0.6, parallax: 0.4, props: { teeth: 10, spin: false } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'cage',
        shape: { kind: 'rect', x: 1030, y: 210, w: 460, h: 350 },
        label: 'The bonded luggage cage',
        hideWhen: { solved: 'pz_cage' },
        action: { type: 'puzzle', puzzle: 'pz_cage' },
      },
      {
        id: 'cage_open',
        shape: { kind: 'rect', x: 1030, y: 210, w: 460, h: 350 },
        label: 'The opened cage',
        if: { solved: 'pz_cage' },
        action: {
          type: 'inspect',
          text: 'Brandt’s crates, guard-stamped through the midnight hour, and the empty hook where the section staff hung. The cage keeps what the border makes it keep.',
        },
      },
      {
        id: 'transfer_brake',
        shape: { kind: 'circle', cx: 240, cy: 620, r: 90 },
        label: 'The transfer brake',
        hideWhen: { flag: 'crates_swung' },
        action: {
          type: 'inspect',
          text: 'You knock the transfer brake loose and the crate platform swings its freight aside — clearing the forward gangway, and baring an oilcloth packet wedged deep in the works. The missing freight of the colonel’s dispatch case, hidden to ride the border crossing unclaimed.',
          effects: [
            { type: 'setFlag', flag: 'crates_swung' },
            { type: 'triggerShift', shift: 's_crate_swing' },
            { type: 'unlockJournal', entry: 'j_dispatch' },
          ],
        },
      },
      {
        id: 'mail_sacks',
        shape: { kind: 'rect', x: 350, y: 480, w: 250, h: 130 },
        label: 'A faint sound among the mail sacks',
        hideWhen: { flag: 'margo_found' },
        action: {
          type: 'inspect',
          text: 'Something in the mail sacks is purring. You lift a flap and meet the green eyes of a stout black cat, collar tag stamped MARGO — MOUSER, SABLE EXPRESS. The one soul aboard with nothing to hide. She permits a scratch, then resumes her post.',
          effects: [
            { type: 'setFlag', flag: 'margo_found' },
            { type: 'markSecret', secret: 'margo' },
          ],
        },
      },
      {
        id: 'gangway_engine',
        shape: { kind: 'rect', x: 50, y: 180, w: 280, h: 390 },
        label: 'The forward gangway — to the engine',
        action: { type: 'navigate', passage: 'p_baggage_engine' },
      },
      {
        id: 'gangway_dining',
        shape: { kind: 'rect', x: 1380, y: 600, w: 200, h: 260 },
        label: 'Back to the dining car',
        action: { type: 'navigate', passage: 'p_dining_baggage' },
      },
    ],
  };
}

export function engineScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...carShell(33, 'iron'),
      // firebox glow
      { kind: 'path', d: 'M 1180 340 L 1520 340 L 1520 560 L 1180 560 Z', fill: 'var(--p-wall-dark)', parallax: 0.15 },
      { kind: 'path', d: 'M 1230 400 L 1470 400 L 1470 540 L 1230 540 Z', fill: 'var(--p-glow)', opacity: 0.35, parallax: 0.15 },
      // gauges
      { kind: 'primitive', primitive: 'clockFace', x: 300, y: 150, scale: 0.5, parallax: 0.2, props: { hourAngle: 210, minuteAngle: 30 } },
      { kind: 'primitive', primitive: 'clockFace', x: 560, y: 150, scale: 0.5, parallax: 0.2, props: { hourAngle: 100, minuteAngle: 280, glow: true } },
      { kind: 'primitive', primitive: 'pipes', x: 100, y: 90, scale: 1, parallax: 0.15, props: { w: 900, seed: 4 } },
      // the block telegraph and its signal card
      { kind: 'path', d: 'M 820 300 L 1080 300 L 1080 560 L 820 560 Z', fill: 'var(--p-wall-mid)', parallax: 0.3 },
      { kind: 'primitive', primitive: 'lever', x: 880, y: 360, scale: 0.8, parallax: 0.32, props: { pulled: false } },
      { kind: 'primitive', primitive: 'paperScrap', x: 900, y: 220, scale: 0.9, parallax: 0.3, props: { kind: 'ticket', rotate: 2, seed: 5 } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'signal_card',
        shape: { kind: 'rect', x: 880, y: 200, w: 180, h: 130 },
        label: 'The signal card',
        action: {
          type: 'inspect',
          text: '“Watchword of the night division: the junction that parts every train south.” Beneath it, the route map answers for anyone who can read a railway: Karst Junction, where the rear cars are drawn and re-marshalled.',
        },
      },
      {
        id: 'telegraph',
        shape: { kind: 'rect', x: 820, y: 300, w: 270, h: 270 },
        label: 'The block telegraph',
        hideWhen: { solved: 'pz_telegraph' },
        action: { type: 'puzzle', puzzle: 'pz_telegraph' },
      },
      {
        id: 'firebox',
        shape: { kind: 'rect', x: 1180, y: 340, w: 350, h: 230 },
        label: 'The banked firebox',
        action: {
          type: 'inspect',
          text: 'The fire is banked low, ticking to itself. The crew left mid-shift — shovels crossed on the plate, the way railwaymen leave things when they mean to come straight back and are not allowed to.',
        },
      },
      {
        id: 'gangway_baggage',
        shape: { kind: 'rect', x: 40, y: 340, w: 240, h: 400 },
        label: 'Back over the tender — to the baggage car',
        action: { type: 'navigate', passage: 'p_baggage_engine' },
      },
    ],
  };
}
