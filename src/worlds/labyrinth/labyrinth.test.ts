import { describe, expect, it } from 'vitest';
import { labyrinthWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, labyrinthWorld).state;
  }
  return state;
}

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(labyrinthWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(labyrinthWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('heart');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(labyrinthWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['coin', 'oracle']);
  });

  it('visits every room and fills the whole journal', () => {
    for (const room of Object.keys(labyrinthWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(labyrinthWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      labyrinthWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
  });

  it('consumes every quest item by the end', () => {
    expect(finalState.inventory.sort()).toEqual(['builders_coin', 'torch']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const chimesIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_chimes',
  );
  const ringsIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_serpent_rings',
  );

  it('the glyph wing is unreachable before the Hall turns, reachable after', () => {
    const before = replay(actions.slice(0, chimesIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('scriptorium')).toBe(false);
    const after = replay(actions.slice(0, chimesIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('scriptorium')).toBe(true);
  });

  it('the Hall turn seals the west door but the aqueduct shortcut remains', () => {
    const after = replay(actions.slice(0, chimesIdx + 1));
    expect(after.topology.p_hall_cistern.open).toBe(false);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['cistern', 'sluice', 'gallery']) {
      expect(reachable.has(room), `${room} softlocked after Shift 2`).toBe(true);
    }
  });

  it('the Heart opens only with Shift 3, which seals the way back', () => {
    const before = replay(actions.slice(0, ringsIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('heart')).toBe(false);
    const after = replay(actions.slice(0, ringsIdx + 1));
    expect(after.topology.p_gate_heart.open).toBe(true);
    expect(after.topology.p_hall_gate.open).toBe(false);
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const idx = actions.findIndex(
      (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_gatehouse',
    );
    const detour: GameAction[] = [
      ...actions.slice(0, idx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_gatehouse',
        submission: { type: 'combination', values: ['◇', '◇', '◇', '◇'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_gatehouse',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(idx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_gatehouse.attempts).toBe(2);
  });
});
