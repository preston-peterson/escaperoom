/** The two sleeper corridors — compartment doors, the regulator clock, the porter's station. */
import type { SceneDef } from '../../../engine/types.ts';
import { carDoor, carLantern, carShell, carWindows, frameEdges } from './common.ts';

export function corridorAScene(): SceneDef {
  const fisk = carDoor(240, 'p_corra_fisk', 'Compartment No. 1 — Colonel Fisk', {
    scale: 0.72,
    if: { solved: 'pz_panel' },
  });
  const voss = carDoor(620, 'p_corra_voss', 'Compartment No. 2 — Mrs. Voss', { scale: 0.72 });
  const brandt = carDoor(1000, 'p_corra_brandt', 'Compartment No. 3 — Mr. Brandt', {
    scale: 0.72,
    open: true,
  });
  return {
    palette: 'sleeper',
    layers: [
      ...carShell(41, 'wood'),
      ...carWindows([1330], 'night'),
      carLantern(820),
      // No. 1 stays drawn shut until the latch is worked from inside
      { kind: 'primitive', primitive: 'door', x: 240, y: 243.2, scale: 0.72, parallax: 0.12, props: { open: false }, if: { not: { solved: 'pz_panel' } } },
      fisk.layer,
      voss.layer,
      brandt.layer,
      // the service panel at the corridor's end
      { kind: 'path', d: 'M 90 260 L 190 260 L 190 470 L 90 470 Z', fill: 'var(--p-wall-dark)', parallax: 0.15 },
      { kind: 'primitive', primitive: 'glint', x: 130, y: 350, scale: 0.8, parallax: 0.16, props: { r: 6 }, if: { not: { flag: 'bolts_drawn' } } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'fisk_door_latched',
        shape: { kind: 'rect', x: 230, y: 240, w: 220, h: 320 },
        label: 'Compartment No. 1 — the latched door',
        if: { not: { solved: 'pz_panel' } },
        action: {
          type: 'inspect',
          text: 'The colonel’s door does not give a hair’s breadth. Through the crack you can see the brass night latch, thrown home — a fastening no key commands, thrown only from inside the berth. You note how sleeper latches work.',
          effects: [{ type: 'unlockJournal', entry: 'j_mech_latch' }],
        },
      },
      fisk.hotspot,
      voss.hotspot,
      brandt.hotspot,
      {
        id: 'service_panel',
        shape: { kind: 'rect', x: 80, y: 250, w: 130, h: 240 },
        label: 'The conductor’s service panel',
        hideWhen: { flag: 'bolts_drawn' },
        action: {
          type: 'useItem',
          accepts: ['pass_key'],
          effects: [
            { type: 'removeItem', item: 'pass_key' },
            { type: 'setFlag', flag: 'bolts_drawn' },
            { type: 'triggerShift', shift: 's_nightbolts' },
          ],
          wrongItemText: 'The service lock takes only the conductor’s square-shanked pass key.',
        },
      },
      {
        id: 'gangway_fwd',
        shape: { kind: 'rect', x: 20, y: 560, w: 220, h: 300 },
        label: 'The forward vestibule — to the dining car',
        action: { type: 'navigate', passage: 'p_dining_corra' },
      },
      {
        id: 'gangway_rear',
        shape: { kind: 'rect', x: 1380, y: 560, w: 200, h: 300 },
        label: 'The rear gangway',
        action: { type: 'navigate', passage: 'p_corra_corrb' },
      },
    ],
  };
}

export function corridorBScene(): SceneDef {
  const kohl = carDoor(200, 'p_corrb_kohl', 'Compartment No. 4 — Miss Kohl', { scale: 0.72 });
  const blaine = carDoor(560, 'p_corrb_blaine', 'Compartment No. 5 — Judge Blaine', { scale: 0.72 });
  const stasny = carDoor(920, 'p_corrb_stasny', 'Service berth No. 6 — the conductor', { scale: 0.72 });
  return {
    palette: 'sleeper',
    layers: [
      ...carShell(52, 'wood'),
      carLantern(400),
      kohl.layer,
      blaine.layer,
      stasny.layer,
      // the corridor regulator clock, still swinging
      { kind: 'primitive', primitive: 'clockFace', x: 1250, y: 140, scale: 0.55, parallax: 0.18, props: { hourAngle: 125, minuteAngle: 102, glow: true } },
      // the porter's station: rota drum, rota card, locker
      { kind: 'path', d: 'M 1180 380 L 1480 380 L 1480 560 L 1180 560 Z', fill: 'var(--p-wall-mid)', parallax: 0.25 },
      { kind: 'primitive', primitive: 'paperScrap', x: 1200, y: 400, scale: 0.95, parallax: 0.26, props: { kind: 'ledger', rotate: -3, seed: 7 } },
      { kind: 'primitive', primitive: 'gear', x: 1370, y: 430, scale: 0.45, parallax: 0.26, props: { teeth: 8, spin: false } },
      // the shunter's order-frame by the rear gangway
      { kind: 'primitive', primitive: 'pedestal', x: 60, y: 300, scale: 0.85, parallax: 0.3, props: { occupied: false }, if: { not: { solved: 'pz_shunt' } } },
      { kind: 'primitive', primitive: 'pedestal', x: 60, y: 300, scale: 0.85, parallax: 0.3, props: { occupied: true }, if: { solved: 'pz_shunt' } },
      ...frameEdges(),
    ],
    hotspots: [
      kohl.hotspot,
      blaine.hotspot,
      stasny.hotspot,
      {
        id: 'regulator',
        shape: { kind: 'circle', cx: 1338, cy: 228, r: 100 },
        label: 'The corridor regulator clock',
        action: {
          type: 'inspect',
          text: 'The regulator swings on, indifferent, keeping railway time to the half-second. Every log on this train — bells, lamps, punches — answers to this one pendulum. It has no opinion about murder.',
        },
      },
      {
        id: 'clock_wedge',
        shape: { kind: 'rect', x: 1300, y: 330, w: 90, h: 60 },
        label: 'Something wedged behind the regulator case',
        hideWhen: { flag: 'groat_found' },
        action: {
          type: 'inspect',
          text: 'Wedged between the regulator case and the wall, wrapped in a twist of waxed paper: a worn silver groat, polished blind by thumbs. The engine crew’s luck-piece, hidden where the time is kept. You leave the luck and take the knowing.',
          effects: [
            { type: 'setFlag', flag: 'groat_found' },
            { type: 'markSecret', secret: 'groat' },
          ],
        },
      },
      {
        id: 'rota_card',
        shape: { kind: 'rect', x: 1190, y: 390, w: 170, h: 130 },
        label: 'The porter’s rota card',
        action: {
          type: 'inspect',
          text: 'The porter’s lamp rota, booked to the minute — and against the observation car, only a pencilled apology: found dark at 00:10, curtain drawn, did not enter. And one line more: the colonel passed him rearward at 23:50, pipe lit. You take the whole timeline down.',
          effects: [{ type: 'unlockJournal', entry: 'j_lamp_rounds' }],
        },
      },
      {
        id: 'rota_drum',
        shape: { kind: 'rect', x: 1330, y: 400, w: 150, h: 150 },
        label: 'The rota drum',
        hideWhen: { solved: 'pz_lamps' },
        action: { type: 'puzzle', puzzle: 'pz_lamps' },
      },
      {
        id: 'order_frame',
        shape: { kind: 'rect', x: 40, y: 300, w: 200, h: 320 },
        label: 'The shunter’s order-frame',
        hideWhen: { solved: 'pz_shunt' },
        action: { type: 'puzzle', puzzle: 'pz_shunt' },
      },
      {
        id: 'gangway_fwd',
        shape: { kind: 'rect', x: 20, y: 620, w: 220, h: 240 },
        label: 'The forward gangway — to Sleeper A',
        if: { not: { solved: 'pz_shunt' } },
        action: { type: 'navigate', passage: 'p_corra_corrb' },
      },
      {
        id: 'gangway_rear',
        shape: { kind: 'rect', x: 1380, y: 620, w: 200, h: 240 },
        label: 'The rear gangway',
        action: { type: 'navigate', passage: 'p_corrb_obs' },
      },
    ],
  };
}
