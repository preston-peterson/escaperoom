import { describe, expect, it } from 'vitest';
import { towerWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, towerWorld).state;
  }
  return state;
}

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(towerWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(towerWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('dome');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(towerWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['letter', 'watch']);
  });

  it('visits every room and fills the whole journal', () => {
    for (const room of Object.keys(towerWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(towerWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      towerWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
  });

  it('consumes every quest item by the end', () => {
    expect(finalState.inventory).toEqual(['pocket_watch']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const boilerIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_boiler',
  );
  const escapementIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_escapement',
  );
  const astrolabeIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_astrolabe',
  );
  const mainspringIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_mainspring',
  );

  it('the upper floors are unreachable before there is steam, reachable after', () => {
    const before = replay(actions.slice(0, boilerIdx));
    const reachable = reachableRooms(before.topology, before.currentRoom);
    for (const room of ['escapement', 'chimeloft', 'governor', 'astrolabe', 'vault', 'dome']) {
      expect(reachable.has(room), `${room} reachable before steam`).toBe(false);
    }
    const after = replay(actions.slice(0, boilerIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('escapement')).toBe(true);
  });

  it('the gallery turn seals the loft door but re-routes the loft through the governor floor', () => {
    const before = replay(actions.slice(0, escapementIdx));
    expect(before.topology.p_escapement_chimeloft.open).toBe(true);
    expect(
      reachableRooms(before.topology, before.currentRoom).has('governor'),
    ).toBe(false);
    const after = replay(actions.slice(0, escapementIdx + 1));
    expect(after.topology.p_escapement_chimeloft.open).toBe(false);
    expect(after.topology.p_escapement_governor.open).toBe(true);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['chimeloft', 'governor', 'winding']) {
      expect(reachable.has(room), `${room} softlocked after the gallery turn`).toBe(true);
    }
  });

  it('the deck turn seals the stair but the wall-ways keep the tower connected', () => {
    const after = replay(actions.slice(0, astrolabeIdx + 1));
    expect(after.topology.p_governor_astrolabe.open).toBe(false);
    expect(after.topology.p_astrolabe_vault.open).toBe(true);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['crawl', 'pendulum', 'governor', 'workshop', 'winding']) {
      expect(reachable.has(room), `${room} softlocked after the deck turn`).toBe(true);
    }
  });

  it('the dome opens only once the mainspring is wound', () => {
    const before = replay(actions.slice(0, mainspringIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('dome')).toBe(false);
    const after = replay(actions.slice(0, mainspringIdx + 1));
    expect(after.topology.p_vault_dome.open).toBe(true);
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const detour: GameAction[] = [
      ...actions.slice(0, boilerIdx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_boiler',
        submission: { type: 'combination', values: ['9', '9', '9'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_boiler',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(boilerIdx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_boiler.attempts).toBe(2);
  });
});
