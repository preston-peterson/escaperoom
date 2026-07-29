import { describe, expect, it } from 'vitest';
import { dreamWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, dreamWorld).state;
  }
  return state;
}

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(dreamWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(dreamWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('sleeper');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(dreamWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['photograph', 'portrait']);
  });

  it('visits every room and fills the whole journal', () => {
    for (const room of Object.keys(dreamWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(dreamWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      dreamWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
  });

  it('consumes every idea and the pencil; only the photograph is kept', () => {
    expect(finalState.inventory).toEqual(['photograph']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const stairIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_stair',
  );
  const lullabyIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_lullaby',
  );
  const pencilIdx = actions.findIndex((a) => a.type === 'USE_ITEM');

  it('the stair actually loops back to the hall until the loop is broken', () => {
    const before = replay(actions.slice(0, stairIdx));
    expect(before.currentRoom).toBe('stair');
    // Climbing the loop deposits you back in the Hall of Doors.
    const looped = reduce(
      before,
      { type: 'MOVE', passage: 'p_stair_loop', at: 999_000 },
      dreamWorld,
    ).state;
    expect(looped.currentRoom).toBe('hall');
    // After the correction, the loop is sealed and the garden is open.
    const after = replay(actions.slice(0, stairIdx + 1));
    expect(after.topology.p_stair_loop.open).toBe(false);
    expect(after.topology.p_stair_garden.open).toBe(true);
    const blocked = reduce(
      after,
      { type: 'MOVE', passage: 'p_stair_loop', at: 999_001 },
      dreamWorld,
    ).state;
    expect(blocked.currentRoom).toBe('stair');
  });

  it('the redraw remaps the Dozing Door to a genuinely new endpoint', () => {
    const before = replay(actions.slice(0, lullabyIdx));
    expect(before.topology.p_hall_dozing.from).toBe('hall');
    expect(before.topology.p_hall_dozing.to).toBe('moonpool');
    expect(before.topology.p_hall_dozing.open).toBe(false);
    expect(reachableRooms(before.topology, before.currentRoom).has('tide')).toBe(false);
    const after = replay(actions.slice(0, lullabyIdx + 1));
    expect(after.topology.p_hall_dozing.from).toBe('hall');
    expect(after.topology.p_hall_dozing.to).toBe('tide');
    expect(after.topology.p_hall_dozing.open).toBe(true);
    expect(reachableRooms(after.topology, after.currentRoom).has('tide')).toBe(true);
  });

  it('the half-drawn alcoves refuse ideas until the pencil has drawn them', () => {
    const before = replay(actions.slice(0, pencilIdx));
    expect(before.currentRoom).toBe('halfdrawn');
    const early = reduce(
      before,
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_ideas',
        submission: {
          type: 'itemPlacement',
          placements: {
            shelf_name: 'idea_name',
            shelf_rain: 'idea_rain',
            shelf_hour: 'idea_hour',
            shelf_fear: 'idea_fear',
          },
        },
        at: 999_002,
      },
      dreamWorld,
    ).state;
    expect(early.puzzles.pz_ideas.solved).toBe(false);
    expect(early.inventory).toContain('idea_name');
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const idx = actions.findIndex(
      (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_doors',
    );
    const detour: GameAction[] = [
      ...actions.slice(0, idx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_doors',
        submission: { type: 'rotary', positions: [0, 0, 0] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_doors',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(idx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_doors.attempts).toBe(2);
  });
});
