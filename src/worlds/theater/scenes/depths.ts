/** The vertical truth of the building — the Understage below, the Fly Gallery above. */
import type { SceneDef } from '../../../engine/types.ts';
import { foregroundFrame } from './common.ts';

export function understageScene(): SceneDef {
  return {
    palette: 'crypt',
    layers: [
      { kind: 'primitive', primitive: 'stoneWall', x: 0, y: 60, parallax: 0, props: { w: 1600, h: 520, seed: 71 } },
      { kind: 'path', d: 'M 0 900 L 0 580 L 1600 580 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      // The stage floor overhead: joists, and the trap itself.
      { kind: 'path', d: 'M 0 60 H 1600 V 96 H 0 Z M 120 60 h 26 v 60 h -26 Z M 420 60 h 26 v 60 h -26 Z M 1140 60 h 26 v 60 h -26 Z M 1440 60 h 26 v 60 h -26 Z', fill: 'var(--p-wall-dark)', parallax: 0 },
      { kind: 'path', d: 'M 620 60 h 360 v 40 h -360 Z', fill: 'var(--p-wall-mid)', parallax: 0, if: { not: { solved: 'pz_trap_machine' } } },
      // The trap run open — and a shaft of dim light falling to the floor.
      { kind: 'path', d: 'M 620 60 h 360 v 40 h -360 Z', fill: '#020103', parallax: 0, if: { solved: 'pz_trap_machine' } },
      { kind: 'path', d: 'M 640 100 L 960 100 L 1040 760 L 560 760 Z', fill: 'var(--p-glow)', opacity: 0.08, parallax: 0.1, if: { solved: 'pz_trap_machine' } },
      { kind: 'primitive', primitive: 'pillar', x: 250, y: 130, scale: 0.9, parallax: 0.2 },
      { kind: 'primitive', primitive: 'pillar', x: 1250, y: 130, scale: 0.9, parallax: 0.2 },
      // The trap machinery: drum, rails, cradle.
      { kind: 'primitive', primitive: 'gear', x: 1050, y: 380, scale: 0.6, parallax: 0.3, props: { r: 110, teeth: 12 } },
      { kind: 'path', d: 'M 700 120 h 12 v 480 h -12 Z M 890 120 h 12 v 480 h -12 Z', fill: 'var(--p-wall-light)', opacity: 0.55, parallax: 0.25 },
      { kind: 'path', d: 'M 660 600 h 280 v 46 h -280 Z M 680 646 h 240 v 22 h -240 Z', fill: 'var(--p-wall-mid)', parallax: 0.3 },
      { kind: 'primitive', primitive: 'lever', x: 1130, y: 500, scale: 0.9, parallax: 0.35, props: { pulled: false, seed: 4 }, if: { not: { solved: 'pz_trap_machine' } } },
      { kind: 'primitive', primitive: 'lever', x: 1130, y: 500, scale: 0.9, parallax: 0.35, props: { pulled: true, seed: 4 }, if: { solved: 'pz_trap_machine' } },
      // The severed safety line, coiled where it fell.
      { kind: 'path', d: 'M 980 700 a 46 46 0 1 0 92 0 a 46 46 0 1 0 -92 0 Z M 994 700 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0 Z', fill: 'var(--p-accent)', opacity: 0.45, parallax: 0.4 },
      // The chalk, kept tasteful, where he landed.
      { kind: 'primitive', primitive: 'bodyOutline', x: 560, y: 640, scale: 0.95, parallax: 0.4, props: { style: 'chalk' } },
      // A constable's lantern left burning.
      { kind: 'primitive', primitive: 'torch', x: 340, y: 300, scale: 0.95, parallax: 0.3, props: { lit: true, seed: 12 } },
      { kind: 'primitive', primitive: 'fog', x: 120, y: 660, parallax: 0.55, props: { w: 1360, h: 180, opacity: 0.16 } },
      // The stair back up to the prompt corner.
      { kind: 'primitive', primitive: 'stairs', x: 60, y: 300, scale: 0.75, parallax: 0.2, props: { dir: 'up' } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'chalk_outline',
        shape: { kind: 'rect', x: 560, y: 620, w: 420, h: 200 },
        label: 'The chalk on the floor',
        action: {
          type: 'inspect',
          text: 'The constable\'s chalk, already scuffing at the edges. Twelve feet, onto the cradle rails, mid-stride. You stand a moment with your hat in your hands. Then you go back to work, because the work is what he gets now.',
        },
      },
      {
        id: 'trap_machine',
        shape: { kind: 'rect', x: 650, y: 400, w: 420, h: 300 },
        label: 'The trap winch',
        hideWhen: { solved: 'pz_trap_machine' },
        action: { type: 'puzzle', puzzle: 'pz_trap_machine' },
      },
      {
        id: 'trap_machine_run',
        shape: { kind: 'rect', x: 650, y: 400, w: 300, h: 300 },
        label: 'The trap machinery, run and open',
        if: { solved: 'pz_trap_machine' },
        action: {
          type: 'inspect',
          text: 'Rails true, drum sound, cradle square. The machine did exactly what it was built to do. Machines usually do — that is what makes the person who re-rigs one so hard to see.',
        },
      },
      {
        id: 'safety_line',
        shape: { kind: 'circle', cx: 1026, cy: 700, r: 70 },
        label: 'The fallen safety line',
        if: { solved: 'pz_trap_machine' },
        action: {
          type: 'inspect',
          text: 'With the trap run, the check line lies fully paid out — and its end tells the whole story: no fray, no wear. One clean draw of a sharp blade, then re-hung aloft onto a weight that could never hold.',
          effects: [{ type: 'unlockJournal', entry: 'j_safety_line' }],
        },
      },
      {
        id: 'exit_stair',
        shape: { kind: 'rect', x: 50, y: 280, w: 340, h: 300 },
        label: 'The stair up to the prompt corner',
        action: { type: 'navigate', passage: 'p_understage_stair' },
      },
      {
        id: 'trap_above',
        shape: { kind: 'rect', x: 620, y: 40, w: 360, h: 80 },
        label: 'The open trap overhead',
        action: { type: 'navigate', passage: 'p_trapdoor' },
      },
      {
        id: 'pit_crawl',
        shape: { kind: 'rect', x: 1380, y: 560, w: 180, h: 200 },
        label: 'A low crawl toward the orchestra pit',
        if: { flag: 'ghost_dark' },
        action: { type: 'navigate', passage: 'p_pit_hatch' },
      },
    ],
  };
}

export function flyScene(): SceneDef {
  return {
    palette: 'backstage',
    layers: [
      // High dark, and the stage far below.
      { kind: 'path', d: 'M 0 0 H 1600 V 900 H 0 Z', fill: 'var(--p-sky-top)', parallax: 0 },
      { kind: 'path', d: 'M 250 320 H 1350 V 560 H 250 Z', fill: 'var(--p-sky-bottom)', opacity: 0.35, parallax: 0.05 },
      { kind: 'path', d: 'M 660 430 h 280 v 70 h -280 Z', fill: 'var(--p-glow)', opacity: 0.12, parallax: 0.05 },
      // Lines dropping away into the dark, everywhere.
      ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        kind: 'path' as const,
        d: `M ${240 + i * 165} 0 h 6 v 620 h -6 Z`,
        fill: 'var(--p-wall-light)',
        opacity: 0.3 + (i % 3) * 0.12,
        parallax: 0.12,
      })),
      // The arbor racks along the offstage side.
      { kind: 'path', d: 'M 1330 80 h 18 v 560 h -18 Z M 1470 80 h 18 v 560 h -18 Z', fill: 'var(--p-wall-mid)', parallax: 0.15 },
      // Arbor 7 — high in the racks, or landed at the rail.
      {
        kind: 'path',
        d: 'M 1350 120 h 106 v 44 h -106 Z M 1350 172 h 106 v 44 h -106 Z M 1350 224 h 106 v 44 h -106 Z M 1350 276 h 106 v 44 h -106 Z M 1350 328 h 106 v 44 h -106 Z',
        fill: 'var(--p-wall-dark)',
        parallax: 0.15,
        if: { not: { flag: 'arbor_landed' } },
      },
      {
        kind: 'path',
        d: 'M 1350 420 h 106 v 44 h -106 Z M 1350 472 h 106 v 44 h -106 Z M 1350 524 h 106 v 44 h -106 Z M 1350 576 h 106 v 44 h -106 Z M 1350 628 h 106 v 44 h -106 Z',
        fill: 'var(--p-wall-dark)',
        parallax: 0.15,
        if: { flag: 'arbor_landed' },
      },
      {
        kind: 'path',
        d: 'M 1350 524 h 106 v 44 h -106 Z',
        fill: 'var(--p-accent)',
        opacity: 0.35,
        parallax: 0.15,
        if: { flag: 'arbor_landed' },
      },
      // The catwalk and its rail.
      { kind: 'path', d: 'M 0 900 L 0 700 L 1600 700 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0.3 },
      { kind: 'path', d: 'M 0 700 H 1600 V 712 H 0 Z M 0 730 H 1600 V 736 H 0 Z', fill: 'var(--p-wall-dark)', parallax: 0.3 },
      { kind: 'path', d: 'M 60 590 h 10 v 116 h -10 Z M 400 590 h 10 v 116 h -10 Z M 740 590 h 10 v 116 h -10 Z M 1080 590 h 10 v 116 h -10 Z M 1420 590 h 10 v 116 h -10 Z M 0 584 H 1600 V 598 H 0 Z', fill: 'var(--p-wall-mid)', parallax: 0.3 },
      // Chalk scuffs on the rail and planks, by the arbor racks.
      { kind: 'path', d: 'M 1120 588 q 40 -8 84 2 l -4 8 q -40 -9 -78 -2 Z M 1150 716 q 50 -6 96 4 l -3 9 q -46 -9 -90 -3 Z M 1230 748 q 36 -5 66 3 l -3 8 q -30 -7 -60 -3 Z', fill: 'var(--p-fog)', opacity: 0.75, parallax: 0.3 },
      // The pin rail, bristling with belaying pins.
      { kind: 'path', d: 'M 180 640 h 460 v 22 h -460 Z', fill: 'var(--p-wall-mid)', parallax: 0.35 },
      ...[0, 1, 2, 3, 4, 5].map((i) => ({
        kind: 'path' as const,
        d: `M ${210 + i * 76} 618 h 12 v 60 h -12 Z`,
        fill: 'var(--p-accent)',
        opacity: 0.7,
        parallax: 0.35,
      })),
      { kind: 'primitive', primitive: 'fog', x: 100, y: 600, parallax: 0.5, props: { w: 1400, h: 200, opacity: 0.12 } },
      { kind: 'primitive', primitive: 'torch', x: 90, y: 300, scale: 0.85, parallax: 0.25, props: { lit: true, seed: 17 } },
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'gallery_view',
        shape: { kind: 'rect', x: 260, y: 330, w: 1060, h: 230 },
        label: 'The stage, far below',
        action: {
          type: 'inspect',
          text: 'The whole stage lies below like a plan drawn to scale: the trap, the revolve seam, the prompt corner\'s little pool of lamplight. Everyone down there stared at the hole. Nobody looked up.',
        },
      },
      {
        id: 'pin_rail',
        shape: { kind: 'rect', x: 170, y: 600, w: 490, h: 110 },
        label: 'The pin rail',
        hideWhen: { solved: 'pz_pin_rail' },
        action: { type: 'puzzle', puzzle: 'pz_pin_rail' },
      },
      {
        id: 'pin_rail_dogged',
        shape: { kind: 'rect', x: 170, y: 600, w: 490, h: 110 },
        label: 'The pin rail, dogged off',
        if: { solved: 'pz_pin_rail' },
        action: {
          type: 'inspect',
          text: 'Arbor 7\'s line is dogged off neat at the rail, the way Barrow would want it. The arbor waits at eye level, pretending to be honest iron.',
        },
      },
      {
        id: 'arbor',
        shape: { kind: 'rect', x: 1320, y: 100, w: 180, h: 590 },
        label: 'Arbor 7 and its tally frame',
        hideWhen: { solved: 'pz_counterweight' },
        action: { type: 'puzzle', puzzle: 'pz_counterweight' },
      },
      {
        id: 'arbor_hollow',
        shape: { kind: 'rect', x: 1320, y: 100, w: 180, h: 590 },
        label: 'The hollow counterweight',
        if: { solved: 'pz_counterweight' },
        action: {
          type: 'inspect',
          text: 'Iron outside, sawdust inside, fresh paint over the bore. It weighs what a lie weighs. The safety line was re-hung onto this and onto nothing.',
        },
      },
      {
        id: 'rail_scuffs_early',
        shape: { kind: 'rect', x: 1100, y: 560, w: 220, h: 220 },
        label: 'Pale scuffs on the rail',
        if: { not: { flag: 'saw_weight_log' } },
        action: {
          type: 'inspect',
          text: 'White scuffs on the rail and planks — powder? plaster? They mean nothing yet. Marks want context the way witnesses want corroboration.',
        },
      },
      {
        id: 'rail_scuffs',
        shape: { kind: 'rect', x: 1100, y: 560, w: 220, h: 220 },
        label: 'Chalk scuffs by Arbor 7',
        if: { flag: 'saw_weight_log' },
        action: {
          type: 'inspect',
          text: 'You rub a scuff between finger and thumb: prompt chalk, the fine white stick from the cup on Craik\'s desk — and the log below says Arbor 7 was re-hung from this spot at the half-hour call. The scene of the murder is not the trap. It is here.',
          effects: [
            { type: 'setFlag', flag: 'where_pinned' },
            { type: 'unlockJournal', entry: 'j_rail_scuffs' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'callers_perch',
        shape: { kind: 'rect', x: 700, y: 560, w: 360, h: 150 },
        label: 'The rail above the prompt corner',
        if: { all: [{ flag: 'read_prompt_book' }, { flag: 'gallery_keyed' }] },
        action: {
          type: 'inspect',
          text: 'From this stretch of rail you can see straight down into the prompt corner — her desk, her book, her chalk cup. The early cue in her pencil; the padlock that answers only her untagged key; her initials in the log at the half. The calling hand did all of it.',
          effects: [
            { type: 'setFlag', flag: 'who_pinned' },
            { type: 'unlockJournal', entry: 'j_sus_craik_2' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'exit_ladder',
        shape: { kind: 'rect', x: 20, y: 620, w: 140, h: 240 },
        label: 'The ladder down to the rig shop',
        action: { type: 'navigate', passage: 'p_rig_fly' },
      },
    ],
  };
}
