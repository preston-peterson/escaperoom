/** The observation car — the true scene of the crime, dark until you bring a lamp. */
import type { SceneDef } from '../../../engine/types.ts';
import { carLantern, carShell, carWindows, frameEdges } from './common.ts';

export function observationScene(): SceneDef {
  return {
    palette: 'sleeper',
    layers: [
      ...carShell(71, 'velvet'),
      ...carWindows([160, 1240], 'snow', { lit: false }),
      // the great curtained rear window
      { kind: 'primitive', primitive: 'curtainStage', x: 520, y: 120, scale: 0.62, parallax: 0.1, props: { mode: 'window', open: 0.25, torn: false } },
      // unlit, the saloon is a cave of shapes
      { kind: 'path', d: 'M 0 0 L 1600 0 L 1600 900 L 0 900 Z', fill: '#04060e', opacity: 0.72, parallax: 0, if: { not: { flag: 'obs_lit' } } },
      // lamplight, once the bracket is fed
      { ...carLantern(800, false), if: { not: { flag: 'obs_lit' } } },
      { ...carLantern(800, true), if: { flag: 'obs_lit' } },
      { kind: 'path', d: 'M 1050 260 L 1120 260 L 1120 340 L 1050 340 Z', fill: 'var(--p-glow)', opacity: 0.5, parallax: 0.2, if: { flag: 'obs_lit' } },
      // the corner chair, facing the door
      { kind: 'primitive', primitive: 'furniture', x: 1140, y: 430, scale: 0.95, parallax: 0.35, props: { kind: 'chair', seed: 21 }, if: { flag: 'obs_lit' } },
      { kind: 'primitive', primitive: 'furniture', x: 380, y: 460, scale: 0.85, parallax: 0.38, props: { kind: 'table', seed: 22 }, if: { flag: 'obs_lit' } },
      ...frameEdges(),
    ],
    hotspots: [
      {
        id: 'bracket',
        shape: { kind: 'rect', x: 1030, y: 240, w: 130, h: 130 },
        label: 'The empty lamp bracket',
        hideWhen: { flag: 'obs_lit' },
        action: { type: 'puzzle', puzzle: 'pz_bracket' },
      },
      {
        id: 'dark_saloon',
        shape: { kind: 'rect', x: 300, y: 400, w: 700, h: 300 },
        label: 'The dark saloon',
        if: { not: { flag: 'obs_lit' } },
        action: {
          type: 'inspect',
          text: 'Shapes, and the smell of cold velvet, and snow-light seeping past a drawn curtain. The porter never got his lamp in here. You will read nothing in this dark.',
        },
      },
      {
        id: 'pipe_ash',
        shape: { kind: 'rect', x: 1100, y: 380, w: 300, h: 220 },
        label: 'The corner chair and the window sill',
        if: { flag: 'obs_lit' },
        action: {
          type: 'inspect',
          text: 'By lamplight the saloon gives it up: a neat cone of pipe ash on the sill, black cherry by the smell, more down the arm of the corner chair. The colonel sat here, facing the door, and smoked — and did not finish. The scene was never his berth. It was this car.',
          effects: [
            { type: 'setFlag', flag: 'where_pinned' },
            { type: 'unlockJournal', entry: 'j_pipe_ash' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'bare_curtain',
        shape: { kind: 'rect', x: 540, y: 140, w: 260, h: 400 },
        label: 'The near curtain',
        if: { flag: 'obs_lit' },
        action: {
          type: 'inspect',
          text: 'The near curtain hangs loose from its ring — its braided sash-cord gone. Its twin still hangs opposite: silk, three cords laid tight, strong enough to tow a wagon. You note what is missing, and what its brother is made of.',
          effects: [
            { type: 'setFlag', flag: 'cord_seen' },
            { type: 'unlockJournal', entry: 'j_cord_missing' },
          ],
        },
      },
      {
        id: 'cord_reckon',
        shape: { kind: 'rect', x: 840, y: 140, w: 260, h: 400 },
        label: 'Hold the twin cord against the mark',
        if: { all: [{ flag: 'cord_seen' }, { flag: 'mark_seen' }] },
        hideWhen: { flag: 'how_pinned' },
        action: {
          type: 'inspect',
          text: 'You take the surviving sash-cord down and lay it across your memory of the collar: three strands, braided, laid tight — the furrow matches turn for turn. The missing cord did not walk away. It was the means, and this curtain is where it came from.',
          effects: [
            { type: 'setFlag', flag: 'how_pinned' },
            { type: 'unlockJournal', entry: 'j_cord_missing' },
            { type: 'sound', cue: 'chime' },
          ],
        },
      },
      {
        id: 'gangway_fwd',
        shape: { kind: 'rect', x: 20, y: 560, w: 220, h: 300 },
        label: 'The forward gangway — coupled to Sleeper A now',
        if: { solved: 'pz_shunt' },
        action: { type: 'navigate', passage: 'p_corra_corrb' },
      },
      {
        id: 'gangway_rear',
        shape: { kind: 'rect', x: 1380, y: 560, w: 200, h: 300 },
        label: 'The rear gangway — to Sleeper B',
        action: { type: 'navigate', passage: 'p_corrb_obs' },
      },
    ],
  };
}
