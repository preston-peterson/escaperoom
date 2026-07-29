import type { WorldDef } from '../types.ts';

/**
 * A tiny three-room fixture world for engine tests: foyer → corridor → vault-room,
 * with one item, one shift, and two puzzles. All names invented.
 */
export const miniWorld: WorldDef = {
  id: 'mini',
  title: 'Mini World',
  tagline: 'Test fixture',
  entryRoom: 'foyer',
  challengeDurationMs: 10 * 60_000,
  rooms: {
    foyer: {
      id: 'foyer',
      name: 'Foyer',
      ambience: { drip: 0, torch: 0.5, wind: 0, tone: 'mid' },
      onFirstEnter: [{ type: 'unlockJournal', entry: 'j_start' }],
      scene: {
        palette: 'cavern',
        layers: [],
        hotspots: [
          {
            id: 'take_key',
            shape: { kind: 'circle', cx: 100, cy: 100, r: 50 },
            label: 'A small key',
            hideWhen: { hasItem: 'key' },
            action: { type: 'pickup', item: 'key' },
          },
          {
            id: 'plaque',
            shape: { kind: 'rect', x: 0, y: 0, w: 10, h: 10 },
            label: 'A plaque',
            action: {
              type: 'inspect',
              text: 'It reads: TWO.',
              effects: [{ type: 'setFlag', flag: 'readPlaque' }],
            },
          },
          {
            id: 'keyhole',
            shape: { kind: 'rect', x: 20, y: 20, w: 10, h: 10 },
            label: 'A keyhole',
            action: {
              type: 'useItem',
              accepts: ['key'],
              effects: [
                { type: 'removeItem', item: 'key' },
                { type: 'triggerShift', shift: 's_open' },
              ],
              wrongItemText: 'It does not fit.',
            },
          },
          {
            id: 'door',
            shape: { kind: 'rect', x: 40, y: 40, w: 10, h: 10 },
            label: 'The corridor door',
            action: { type: 'navigate', passage: 'p_foyer_corridor' },
          },
        ],
      },
    },
    corridor: {
      id: 'corridor',
      name: 'Corridor',
      ambience: { drip: 0.5, torch: 0.5, wind: 0, tone: 'low' },
      scene: {
        palette: 'cavern',
        layers: [],
        hotspots: [
          {
            id: 'dial',
            shape: { kind: 'rect', x: 0, y: 0, w: 10, h: 10 },
            label: 'A dial',
            action: { type: 'puzzle', puzzle: 'pz_dial' },
          },
        ],
      },
    },
    'vault-room': {
      id: 'vault-room',
      name: 'Vault Room',
      ambience: { drip: 0, torch: 0.8, wind: 0, tone: 'deep' },
      scene: {
        palette: 'cavern',
        layers: [],
        hotspots: [
          {
            id: 'final',
            shape: { kind: 'rect', x: 0, y: 0, w: 10, h: 10 },
            label: 'The final riddle',
            action: { type: 'puzzle', puzzle: 'pz_final' },
          },
        ],
      },
    },
  },
  passages: {
    p_foyer_corridor: {
      id: 'p_foyer_corridor',
      from: 'foyer',
      to: 'corridor',
      open: false,
      closedText: 'Locked tight.',
    },
    p_corridor_vault: {
      id: 'p_corridor_vault',
      from: 'corridor',
      to: 'vault-room',
      open: false,
      hidden: true,
    },
  },
  puzzles: {
    pz_dial: {
      id: 'pz_dial',
      type: 'combination',
      title: 'The Dial',
      prompt: 'One dial, nine digits.',
      if: { flag: 'readPlaque' },
      lockedText: 'You have no idea what to set.',
      slots: 1,
      symbols: ['1', '2', '3'],
      answer: ['2'],
      hints: ['Look around the foyer.', 'The plaque says TWO.', 'Set it to 2.'],
      onSolve: [{ type: 'triggerShift', shift: 's_reveal' }],
    },
    pz_final: {
      id: 'pz_final',
      type: 'cipher',
      title: 'The Riddle',
      prompt: 'Speak the word.',
      answer: 'echo',
      hints: ['Listen.', 'It answers you.', "Say 'echo'."],
      onSolve: [{ type: 'markSecret', secret: 'finished' }],
    },
  },
  items: {
    key: { id: 'key', name: 'Small Key', description: 'Small.', icon: 'glint' },
  },
  journal: {
    j_start: {
      id: 'j_start',
      title: 'Arrival',
      body: 'You arrive.',
      category: 'lore',
      countsTowardLore: true,
    },
  },
  shifts: {
    s_open: {
      id: 's_open',
      ops: [{ type: 'openPassage', passage: 'p_foyer_corridor' }],
      narration: 'The lock clicks.',
      mapAnimation: 'reveal',
      durationMs: 500,
    },
    s_reveal: {
      id: 's_reveal',
      ops: [{ type: 'openPassage', passage: 'p_corridor_vault' }],
      narration: 'A wall slides aside.',
      mapAnimation: 'slide',
      durationMs: 500,
    },
  },
  achievements: [
    { id: 'a_done', title: 'Done', description: 'Finish.', check: 'worldComplete' },
    { id: 'a_pure', title: 'Pure', description: 'No hints.', check: 'noHints' },
    { id: 'a_fast', title: 'Fast', description: 'Under 5 min.', check: 'timeUnder', ms: 5 * 60_000 },
    { id: 'a_all', title: 'All rooms', description: 'Visit all.', check: 'allRoomsVisited' },
  ],
  map: {
    viewBox: [0, 0, 100, 300],
    rooms: {
      foyer: { x: 50, y: 250, shape: 'square' },
      corridor: { x: 50, y: 150, shape: 'square' },
      'vault-room': { x: 50, y: 50, shape: 'circle' },
    },
  },
  finalPuzzle: 'pz_final',
  epilogue: 'It is done.',
};
