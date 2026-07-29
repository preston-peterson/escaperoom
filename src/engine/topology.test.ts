import { describe, expect, it } from 'vitest';
import { applyShift, initialTopology, openPassagesFrom, reachableRooms } from './topology.ts';
import { miniWorld } from './__fixtures__/miniWorld.ts';
import type { ShiftDef } from './types.ts';

describe('initialTopology', () => {
  it('derives open/revealed from passage defs', () => {
    const topo = initialTopology(miniWorld);
    expect(topo.p_foyer_corridor).toEqual({
      from: 'foyer',
      to: 'corridor',
      open: false,
      revealed: true,
    });
    expect(topo.p_corridor_vault.revealed).toBe(false);
  });
});

describe('applyShift', () => {
  it('opens, closes, reveals, and remaps passages; returns a new object', () => {
    const topo = initialTopology(miniWorld);
    const shift: ShiftDef = {
      id: 's',
      ops: [
        { type: 'openPassage', passage: 'p_foyer_corridor' },
        { type: 'revealPassage', passage: 'p_corridor_vault' },
        { type: 'remapPassage', passage: 'p_corridor_vault', from: 'foyer' },
      ],
      narration: '',
      mapAnimation: 'rumble',
      durationMs: 1,
    };
    const next = applyShift(topo, shift);
    expect(next).not.toBe(topo);
    expect(next.p_foyer_corridor.open).toBe(true);
    expect(next.p_corridor_vault.revealed).toBe(true);
    expect(next.p_corridor_vault.from).toBe('foyer');
    // original untouched
    expect(topo.p_foyer_corridor.open).toBe(false);
  });

  it('openPassage also reveals; closePassage keeps revealed', () => {
    const topo = initialTopology(miniWorld);
    const opened = applyShift(topo, {
      id: 's',
      ops: [{ type: 'openPassage', passage: 'p_corridor_vault' }],
      narration: '',
      mapAnimation: 'reveal',
      durationMs: 1,
    });
    expect(opened.p_corridor_vault).toMatchObject({ open: true, revealed: true });
    const closed = applyShift(opened, {
      id: 's2',
      ops: [{ type: 'closePassage', passage: 'p_corridor_vault' }],
      narration: '',
      mapAnimation: 'rumble',
      durationMs: 1,
    });
    expect(closed.p_corridor_vault).toMatchObject({ open: false, revealed: true });
  });

  it('ignores ops on unknown passages', () => {
    const topo = initialTopology(miniWorld);
    const next = applyShift(topo, {
      id: 's',
      ops: [{ type: 'openPassage', passage: 'p_nowhere' }],
      narration: '',
      mapAnimation: 'rumble',
      durationMs: 1,
    });
    expect(next).toEqual(topo);
  });
});

describe('reachability', () => {
  it('walks only open passages', () => {
    let topo = initialTopology(miniWorld);
    expect([...reachableRooms(topo, 'foyer')]).toEqual(['foyer']);
    topo = applyShift(topo, miniWorld.shifts.s_open);
    expect(reachableRooms(topo, 'foyer')).toEqual(new Set(['foyer', 'corridor']));
    topo = applyShift(topo, miniWorld.shifts.s_reveal);
    expect(reachableRooms(topo, 'foyer').has('vault-room')).toBe(true);
  });

  it('openPassagesFrom lists open passages touching a room', () => {
    let topo = initialTopology(miniWorld);
    expect(openPassagesFrom(topo, 'corridor')).toEqual([]);
    topo = applyShift(topo, miniWorld.shifts.s_open);
    expect(openPassagesFrom(topo, 'corridor')).toEqual(['p_foyer_corridor']);
  });
});
