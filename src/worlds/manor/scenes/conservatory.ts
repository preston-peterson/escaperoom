/** The conservatory — the true scene of the crime, surrendered by the thaw. */
import type { SceneDef } from '../../../engine/types.ts';
import { coldHaze, frameShadow, interiorDoor } from './common.ts';

export function conservatoryScene(): SceneDef {
  const parlor = interiorDoor(1310, 'p_parlor_conservatory', 'The parlor door', {
    scale: 0.8,
    openIf: { not: { flag: 'pane_fallen' } },
  });
  const service = interiorDoor(80, 'p_conservatory_kitchen', 'The service door to the kitchen passage', {
    scale: 0.7,
    if: { flag: 'pane_fallen' },
  });
  return {
    palette: 'frost',
    layers: [
      // Glass walls with the blizzard's aftermath pressing in.
      { kind: 'path', d: 'M 0 900 L 0 560 L 1600 560 L 1600 900 Z', fill: 'var(--p-floor)', parallax: 0 },
      { kind: 'primitive', primitive: 'windowPane', x: 300, y: 60, scale: 1.2, parallax: 0.05, props: { shape: 'arched', weather: 'snow' } },
      { kind: 'primitive', primitive: 'windowPane', x: 700, y: 60, scale: 1.2, parallax: 0.05, props: { shape: 'arched', weather: 'snow' } },
      { kind: 'primitive', primitive: 'windowPane', x: 1100, y: 60, scale: 1.2, parallax: 0.05, props: { shape: 'arched', weather: 'snow' } },
      { kind: 'path', d: 'M 0 60 H 1600 V 90 H 0 Z M 0 545 H 1600 V 565 H 0 Z', fill: 'var(--p-wall-dark)', opacity: 0.8, parallax: 0.05 },
      ...service.layers,
      ...parlor.layers,
      // The fallen pane and its spill of snow, once it lets go.
      { kind: 'path', d: 'M 1240 560 L 1300 300 Q 1420 380 1520 560 Q 1400 640 1300 620 Z', fill: 'var(--p-fog)', opacity: 0.9, parallax: 0.12, if: { flag: 'pane_fallen' } },
      { kind: 'primitive', primitive: 'rubble', x: 1230, y: 560, scale: 0.7, parallax: 0.14, props: { seed: 13 }, if: { flag: 'pane_fallen' } },
      // Beds of orchids over whitewashed brick, coming back from the frost.
      { kind: 'path', d: 'M 220 640 H 720 V 700 H 220 Z M 860 640 H 1180 V 700 H 860 Z', fill: 'var(--p-wall-light)', opacity: 0.5, parallax: 0.3 },
      { kind: 'primitive', primitive: 'tree', x: 250, y: 420, scale: 0.6, parallax: 0.32, props: { seed: 3 } },
      { kind: 'primitive', primitive: 'tree', x: 1050, y: 430, scale: 0.55, parallax: 0.32, props: { seed: 8 } },
      // The overturned wicker chair; the pipe beneath it; the drag marks.
      { kind: 'primitive', primitive: 'furniture', x: 640, y: 600, scale: 0.85, parallax: 0.4, props: { kind: 'chair', toppled: true, seed: 16 } },
      { kind: 'primitive', primitive: 'glint', x: 700, y: 780, scale: 0.9, parallax: 0.42 },
      { kind: 'path', d: 'M 700 790 Q 480 800 200 760 M 720 810 Q 500 822 220 782', fill: 'var(--p-wall-dark)', opacity: 0.45, parallax: 0.42 },
      { kind: 'primitive', primitive: 'fog', x: 100, y: 600, parallax: 0.5, props: { w: 1400, h: 220, opacity: 0.2 } },
      coldHaze(0.1),
      ...frameShadow(),
    ],
    hotspots: [
      {
        id: 'pipe',
        shape: { kind: 'circle', cx: 705, cy: 785, r: 55 },
        label: 'Something under the wicker chair',
        action: {
          type: 'inspect',
          text: 'The thaw gives it up at last: Wren’s briar pipe, half-packed and never lit, under the overturned chair. A man does not carry his dropped pipe to another room to die. He was here.',
          effects: [{ type: 'unlockJournal', entry: 'j_ev_pipe' }],
        },
      },
      {
        id: 'drag_marks',
        shape: { kind: 'rect', x: 180, y: 740, w: 560, h: 100 },
        label: 'Lines melting out of the floor-frost',
        action: {
          type: 'inspect',
          text: 'Two heel-lines, melted out and refrozen, running from the chair through the whitewash dust to the service door. The freeze was meant to keep this floor’s testimony forever. You take its statement instead: Aldous Wren died in the conservatory, and was carried to his study afterward.',
          effects: [
            { type: 'setFlag', flag: 'where_pinned' },
            { type: 'unlockJournal', entry: 'j_ev_dragmarks' },
            { type: 'sound', cue: 'secret' },
          ],
        },
      },
      {
        id: 'wicker_chair',
        shape: { kind: 'rect', x: 620, y: 580, w: 220, h: 200 },
        label: 'The overturned wicker chair',
        action: {
          type: 'inspect',
          text: 'His chair, among his orchids, tipped as a body slides from it — not thrown as in a struggle. Whoever tidied the study to a stage left the real scene exactly as it fell, trusting the cold to lock the door behind them.',
        },
      },
      {
        id: 'orchids',
        shape: { kind: 'rect', x: 220, y: 560, w: 500, h: 140 },
        label: 'The orchid beds',
        action: {
          type: 'inspect',
          text: 'Days of hard frost have blackened all but the toughest of them. He heated this glass house all winter for these — the one extravagance anyone ever recorded of Aldous Wren.',
        },
      },
      {
        id: 'fallen_pane',
        shape: { kind: 'rect', x: 1240, y: 300, w: 300, h: 320 },
        label: 'The fallen pane',
        if: { flag: 'pane_fallen' },
        action: {
          type: 'inspect',
          text: 'Snow and glass together bury the parlor door. The house has opinions about being warmed too quickly — but the service door stands clear, and the service door is the one the killer used.',
        },
      },
      service.hotspot,
      parlor.hotspot,
    ],
  };
}
