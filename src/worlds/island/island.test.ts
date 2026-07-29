import { describe, expect, it } from 'vitest';
import { islandWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, islandWorld).state;
  }
  return state;
}

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(islandWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(islandWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('undergate');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(islandWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['letter', 'token']);
  });

  it('visits every room and fills the whole journal', () => {
    for (const room of Object.keys(islandWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(islandWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      islandWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
  });

  it('consumes every quest item by the end', () => {
    expect(finalState.inventory).toEqual(['warden_token']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const pealIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_bellpeal',
  );
  const hatchIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_hatch',
  );
  const floodIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_floodgates',
  );

  it('the sea cave is unreachable until the Ebb Peal lowers the tide', () => {
    const before = replay(actions.slice(0, pealIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('seacave')).toBe(false);
    expect(before.topology.p_dock_seacave.revealed).toBe(false);
    const after = replay(actions.slice(0, pealIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('seacave')).toBe(true);
    expect(after.topology.p_dock_seacave.revealed).toBe(true);
  });

  it('the lantern room opens only to the spoken word', () => {
    const before = replay(actions.slice(0, hatchIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('lantern')).toBe(false);
    const after = replay(actions.slice(0, hatchIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('lantern')).toBe(true);
  });

  it('the flood opens the way down and reclaims the sea cave, stranding nothing needed', () => {
    const before = replay(actions.slice(0, floodIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('undergate')).toBe(false);
    const after = replay(actions.slice(0, floodIdx + 1));
    expect(after.topology.p_engine_undergate.open).toBe(true);
    expect(after.topology.p_dock_seacave.open).toBe(false);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    expect(reachable.has('seacave')).toBe(false);
    for (const room of Object.keys(islandWorld.rooms)) {
      if (room === 'seacave') continue;
      expect(reachable.has(room), `${room} softlocked after the flood`).toBe(true);
    }
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const idx = actions.findIndex(
      (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_tidelock',
    );
    const detour: GameAction[] = [
      ...actions.slice(0, idx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_tidelock',
        submission: { type: 'combination', values: ['1', '1', '1'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_tidelock',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(idx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_tidelock.attempts).toBe(2);
  });
});
