/** The dressing wing — Dunmore's alcove, Vane's room, Reyes-Adler's room — and the Author's Box. */
import type { SceneDef } from '../../../engine/types.ts';
import { foregroundFrame, interiorShell, sconcePair, stageDoor } from './common.ts';

/** A dressing mirror ringed with bulbs, as layers. */
function mirrorLayers(x: number, y: number, lit: boolean) {
  return [
    { kind: 'path' as const, d: `M ${x} ${y} h 260 v 320 h -260 Z`, fill: 'var(--p-wall-dark)', parallax: 0.2 },
    { kind: 'path' as const, d: `M ${x + 18} ${y + 18} h 224 v 284 h -224 Z`, fill: 'var(--p-fog)', opacity: 0.35, parallax: 0.2 },
    ...[0, 1, 2, 3].map((i) => ({
      kind: 'path' as const,
      d: `M ${x + 30 + i * 66} ${y - 12} a 9 9 0 1 0 0.01 0 Z`,
      fill: lit ? 'var(--p-glow)' : 'var(--p-wall-light)',
      opacity: lit ? 0.9 : 0.4,
      parallax: 0.2,
    })),
  ];
}

export function understudyScene(): SceneDef {
  const corridor = stageDoor(90, 'p_prompt_understudy', 'The corridor to the prompt corner', { scale: 0.75, open: true });
  const starDoor = stageDoor(1330, 'p_understudy_star', "The star's dressing room", { scale: 0.75 });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(53, 'wood'),
      corridor.layer,
      starDoor.layer,
      ...mirrorLayers(480, 170, true),
      // The revolve's upstage door opens into this wing — until the stage turns.
      {
        kind: 'primitive',
        primitive: 'door',
        x: 880,
        y: 160,
        scale: 0.8,
        parallax: 0.15,
        props: { open: false },
        if: { not: { solved: 'pz_revolve' } },
      },
      // After the turn: bare wall where a door used to be.
      {
        kind: 'path',
        d: 'M 880 180 h 208 v 380 h -208 Z',
        fill: 'var(--p-wall-dark)',
        opacity: 0.25,
        parallax: 0.15,
        if: { solved: 'pz_revolve' },
      },
      // Dunmore's station: chair, script, the prop tray.
      { kind: 'primitive', primitive: 'furniture', x: 420, y: 560, scale: 0.85, parallax: 0.4, props: { kind: 'chair', seed: 15 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 560, y: 560, scale: 1.1, parallax: 0.4, props: { kind: 'letter', rotate: 5, seed: 27 } },
      { kind: 'path', d: 'M 700 640 h 300 v 90 h -300 Z M 712 652 h 276 v 66 h -276 Z', fill: 'var(--p-wall-mid)', parallax: 0.4 },
      {
        kind: 'primitive',
        primitive: 'glint',
        x: 830,
        y: 660,
        scale: 1.2,
        parallax: 0.4,
        if: { not: { any: [{ hasItem: 'prop_knife' }, { flag: 'knife_logged' }] } },
      },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'dunmore_station',
        shape: { kind: 'rect', x: 400, y: 160, w: 360, h: 520 },
        label: "The understudy's station",
        action: {
          type: 'inspect',
          text: 'A borrowed corner of a corridor, kept immaculate. His script lies open: every line of Vane\'s part annotated, loved, learned in the dark. Three seasons of standing by. You open a dossier on Percy Dunmore.',
          effects: [{ type: 'unlockJournal', entry: 'j_sus_dunmore' }],
        },
      },
      {
        id: 'take_knife',
        shape: { kind: 'rect', x: 700, y: 630, w: 300, h: 110 },
        label: 'The Act II prop tray',
        hideWhen: { any: [{ hasItem: 'prop_knife' }, { flag: 'knife_logged' }] },
        action: {
          type: 'inspect',
          text: 'In the tray, where the tin stage dagger should sit: a real knife. Steel. Honed. Never used. You wrap it in a handkerchief and take it — this belongs beside a ledger line.',
          effects: [
            { type: 'giveItem', item: 'prop_knife' },
            { type: 'unlockJournal', entry: 'j_knife' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'upstage_door_back',
        shape: { kind: 'rect', x: 880, y: 160, w: 210, h: 400 },
        label: 'The upstage door onto the revolve',
        if: { not: { solved: 'pz_revolve' } },
        action: { type: 'navigate', passage: 'p_revolve_door' },
      },
      {
        id: 'blank_wall',
        shape: { kind: 'rect', x: 880, y: 180, w: 210, h: 380 },
        label: 'A wall where a door was',
        if: { solved: 'pz_revolve' },
        action: {
          type: 'inspect',
          text: 'You put your palm on the wall. This morning there was a door here. The building has moved it somewhere it finds more useful, the way it moves everything.',
        },
      },
      corridor.hotspot,
      starDoor.hotspot,
    ],
  };
}

export function starScene(): SceneDef {
  const back = stageDoor(80, 'p_understudy_star', 'Back to the corridor', { scale: 0.75, open: true });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(59, 'velvet'),
      back.layer,
      { kind: 'primitive', primitive: 'chandelier', x: 1080, y: 40, scale: 0.8, parallax: 0.1, props: { style: 'lantern', lit: true } },
      ...mirrorLayers(600, 150, true),
      // The gilded rosette at the mirror's crown.
      { kind: 'path', d: 'M 718 136 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0 Z', fill: 'var(--p-accent)', opacity: 0.95, parallax: 0.2 },
      // Garlands from an ovation nobody finished.
      { kind: 'path', d: 'M 380 200 q 60 90 130 0 M 1000 220 q 50 80 120 0', fill: 'none', parallax: 0.2 },
      { kind: 'path', d: 'M 370 180 h 40 v 160 l -20 22 l -20 -22 Z M 1010 200 h 36 v 140 l -18 20 l -18 -20 Z', fill: 'var(--p-accent)', opacity: 0.35, parallax: 0.2 },
      // Dressing table mid-makeup; the drawer of letters.
      { kind: 'primitive', primitive: 'furniture', x: 560, y: 480, scale: 1.0, parallax: 0.35, props: { kind: 'desk', seed: 25 } },
      {
        kind: 'primitive',
        primitive: 'paperScrap',
        x: 660,
        y: 452,
        scale: 1.0,
        parallax: 0.35,
        props: { kind: 'letter', rotate: -8, seed: 35 },
        if: { not: { any: [{ hasItem: 'letters' }, { flag: 'letters_matched' }] } },
      },
      // The spirit lamp and kettle, boiled dry.
      { kind: 'primitive', primitive: 'brazier', x: 1180, y: 560, scale: 0.55, parallax: 0.4 },
      { kind: 'primitive', primitive: 'furniture', x: 320, y: 580, scale: 0.8, parallax: 0.45, props: { kind: 'chair', seed: 31 } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'vane_mirror',
        shape: { kind: 'rect', x: 590, y: 140, w: 290, h: 300 },
        label: "Vane's mirror, ringed in clippings",
        action: {
          type: 'inspect',
          text: 'Clippings tucked into the frame, all of them about him. Framed in pride of place: "Vane does not act so much as collect what others earn." Grease paint open on the table, one cheek\'s worth used. He meant to come back.',
          effects: [{ type: 'unlockJournal', entry: 'j_vane' }],
        },
      },
      {
        id: 'take_letters',
        shape: { kind: 'rect', x: 640, y: 430, w: 200, h: 120 },
        label: 'A ribboned bundle of letters',
        hideWhen: { any: [{ hasItem: 'letters' }, { flag: 'letters_matched' }] },
        action: {
          type: 'inspect',
          text: '"You will not survive another opening night." Unsigned, elegant, furious — and kept in his dressing table like billets-doux. You take the bundle; a hand this distinctive can be matched.',
          effects: [
            { type: 'giveItem', item: 'letters' },
            { type: 'unlockJournal', entry: 'j_letters' },
            { type: 'sound', cue: 'pickup' },
          ],
        },
      },
      {
        id: 'mirror_rosette',
        shape: { kind: 'circle', cx: 740, cy: 136, r: 34 },
        label: 'A gilded rosette, worn bright at one petal',
        hideWhen: { flag: 'found_titlepage' },
        action: {
          type: 'inspect',
          text: 'One petal is polished by a thumb. You press it and the mirror\'s crown swings open on a shallow hollow: a single sheet, folded small. The play\'s original title page — by ODETTE MARLOWE — with "by SILAS VANE" pasted over her name and peeled back by someone\'s nail.',
          effects: [
            { type: 'setFlag', flag: 'found_titlepage' },
            { type: 'markSecret', secret: 'titlepage' },
            { type: 'unlockJournal', entry: 'j_title_page' },
            { type: 'sound', cue: 'secret' },
          ],
        },
      },
      {
        id: 'spirit_lamp',
        shape: { kind: 'rect', x: 1160, y: 540, w: 180, h: 200 },
        label: 'A spirit lamp and kettle',
        action: {
          type: 'inspect',
          text: 'The kettle has boiled itself dry; the little flame starved out hours ago. Tea for the interval that never came.',
        },
      },
      back.hotspot,
    ],
  };
}

export function rivalScene(): SceneDef {
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(61, 'velvet'),
      // The revolve door — the only way in or out, and only when the stage says so.
      { kind: 'primitive', primitive: 'door', x: 1300, y: 160, scale: 0.8, parallax: 0.15, props: { open: true } },
      ...mirrorLayers(520, 150, true),
      // The quick-change rack, mid-change.
      { kind: 'path', d: 'M 140 200 h 14 v 420 h -14 Z M 320 200 h 14 v 420 h -14 Z M 140 210 h 194 v 12 h -194 Z', fill: 'var(--p-wall-light)', opacity: 0.8, parallax: 0.25 },
      { kind: 'path', d: 'M 170 226 q 30 190 -8 370 h 60 q 24 -180 0 -370 Z M 250 226 q 34 180 6 360 h 54 q 20 -170 -4 -360 Z', fill: 'var(--p-water)', opacity: 0.75, parallax: 0.25 },
      // Scattered pins where everything was dropped.
      { kind: 'path', d: 'M 470 700 l 26 6 M 520 720 l 24 -8 M 580 706 l 22 10 M 640 724 l 26 -6 M 700 708 l 22 8', fill: 'none', parallax: 0.5 },
      { kind: 'path', d: 'M 460 696 h 260 v 6 h -260 Z', fill: 'var(--p-fog)', opacity: 0.25, parallax: 0.5 },
      { kind: 'primitive', primitive: 'furniture', x: 480, y: 480, scale: 0.95, parallax: 0.35, props: { kind: 'desk', seed: 39 } },
      { kind: 'primitive', primitive: 'furniture', x: 880, y: 570, scale: 0.8, parallax: 0.45, props: { kind: 'chair', seed: 41, toppled: true } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'reyes_mirror',
        shape: { kind: 'rect', x: 460, y: 140, w: 340, h: 440 },
        label: "Reyes-Adler's mirror and table",
        action: {
          type: 'inspect',
          text: 'Half a gown on the rack, pins scattered where she and her dresser dropped everything at the scream. Wedged in the mirror frame, her note for the police, underlined twice: "At the half-hour call the counterweights RAN in the loft above my room. Ask your riggers who was aloft at the half." You open a dossier on Constance Reyes-Adler.',
          effects: [{ type: 'unlockJournal', entry: 'j_sus_reyes' }],
        },
      },
      {
        id: 'quick_change',
        shape: { kind: 'rect', x: 130, y: 190, w: 220, h: 440 },
        label: 'The quick-change rack',
        action: {
          type: 'inspect',
          text: 'The Act III gown hangs half-dressed on its form. She was pinned into one sleeve when the trap ran. Whatever else Constance Reyes-Adler wanted, she was provably busy wanting it in here.',
        },
      },
      {
        id: 'exit_p_revolve_door',
        shape: { kind: 'rect', x: 1300, y: 160, w: 210, h: 400 },
        label: 'The upstage door onto the revolve',
        action: { type: 'navigate', passage: 'p_revolve_door' },
      },
    ],
  };
}

export function writersScene(): SceneDef {
  const back = stageDoor(90, 'p_house_box', 'Back down to the house', { scale: 0.75, open: true });
  return {
    palette: 'backstage',
    layers: [
      ...interiorShell(67, 'velvet'),
      back.layer,
      // The box rail, and the distant curtain across the dark of the house.
      { kind: 'path', d: 'M 560 300 h 620 v 260 h -620 Z', fill: 'var(--p-sky-top)', parallax: 0.05 },
      { kind: 'primitive', primitive: 'curtainStage', x: 680, y: 330, scale: 0.42, parallax: 0.05, props: { mode: 'stage', open: 0.04 }, if: { not: { flag: 'curtain_up' } } },
      { kind: 'primitive', primitive: 'curtainStage', x: 680, y: 330, scale: 0.42, parallax: 0.05, props: { mode: 'stage', open: 0.9 }, if: { flag: 'curtain_up' } },
      { kind: 'path', d: 'M 540 540 h 660 v 30 h -660 Z M 540 570 q 330 40 660 0 v 24 q -330 44 -660 0 Z', fill: 'var(--p-wall-mid)', parallax: 0.1 },
      // Her chair, her shelf, her dispatch box.
      { kind: 'primitive', primitive: 'furniture', x: 300, y: 560, scale: 0.85, parallax: 0.4, props: { kind: 'chair', seed: 43 } },
      { kind: 'primitive', primitive: 'furniture', x: 1240, y: 300, scale: 0.75, parallax: 0.2, props: { kind: 'cabinet', seed: 47 } },
      { kind: 'primitive', primitive: 'paperScrap', x: 380, y: 640, scale: 1.25, parallax: 0.45, props: { kind: 'letter', rotate: 7, seed: 49 } },
      // The dispatch box on the rail shelf.
      { kind: 'path', d: 'M 900 620 h 240 v 130 h -240 Z M 900 620 l 24 -26 h 240 l -24 26 Z', fill: 'var(--p-wall-dark)', parallax: 0.45 },
      { kind: 'path', d: 'M 990 670 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0 Z', fill: 'var(--p-accent)', opacity: 0.9, parallax: 0.45, if: { not: { solved: 'pz_marlowe_desk' } } },
      ...sconcePair(),
      ...foregroundFrame(),
    ],
    hotspots: [
      {
        id: 'marlowe_desk',
        shape: { kind: 'rect', x: 250, y: 520, w: 260, h: 260 },
        label: "The playwright's chair at the box rail",
        action: {
          type: 'inspect',
          text: 'She watched every performance from this chair, above the house, beside the exit. A brandy glass stands finished on the rail — the house manager\'s, delivered at the thunder cue, witnessed. You open a dossier on Odette Marlowe.',
          effects: [{ type: 'unlockJournal', entry: 'j_sus_marlowe' }],
        },
      },
      {
        id: 'typescript',
        shape: { kind: 'rect', x: 360, y: 610, w: 220, h: 140 },
        label: 'A marked typescript of the play',
        action: {
          type: 'inspect',
          text: 'Her working copy. The Act III turn plotted in the margin — moon to crescent, gilt door, blossom — and across the title page, torn through by the pen: "I am done being UNCREDITED."',
          effects: [{ type: 'unlockJournal', entry: 'j_typescript' }],
        },
      },
      {
        id: 'dispatch_box',
        shape: { kind: 'rect', x: 890, y: 580, w: 270, h: 180 },
        label: 'A japanned dispatch box with a letter-lock',
        hideWhen: { solved: 'pz_marlowe_desk' },
        action: { type: 'puzzle', puzzle: 'pz_marlowe_desk' },
      },
      {
        id: 'dispatch_box_open',
        shape: { kind: 'rect', x: 890, y: 580, w: 270, h: 180 },
        label: 'The opened dispatch box',
        if: { solved: 'pz_marlowe_desk' },
        action: {
          type: 'inspect',
          text: 'Her diary, and a solicitor\'s letter dated for the morning after opening night. She was going to sue him in daylight, with witnesses. Corpses cannot lose lawsuits — his death cost her the victory she wanted.',
        },
      },
      {
        id: 'compare_letters',
        shape: { kind: 'rect', x: 560, y: 560, w: 300, h: 120 },
        label: 'The box rail — room to lay papers side by side',
        action: {
          type: 'useItem',
          accepts: ['letters'],
          wrongItemText: 'You lay it on the rail, look at it, and put it back. It proves nothing here.',
          effects: [
            { type: 'removeItem', item: 'letters' },
            { type: 'setFlag', flag: 'letters_matched' },
            { type: 'unlockJournal', entry: 'j_sus_marlowe_2' },
            {
              type: 'narrate',
              text: 'Letter for letter, the furious hand is Marlowe\'s — and so is the grievance. Every threat is about credit; the "ending audiences will remember" is a lawsuit dated for the morning after. She wanted him alive to watch her name get printed.',
            },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      back.hotspot,
    ],
  };
}
