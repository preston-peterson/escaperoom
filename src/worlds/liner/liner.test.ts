import { describe, expect, it } from 'vitest';
import { linerWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState, PuzzleDef } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, linerWorld).state;
  }
  return state;
}

const accusationDef = linerWorld.puzzles.pz_accusation as Extract<
  PuzzleDef,
  { type: 'accusation' }
>;

const correctCharge: GameAction = {
  type: 'SUBMIT_PUZZLE',
  puzzle: 'pz_accusation',
  submission: { type: 'accusation', choices: ['duquesne', 'winch_handle', 'cargo_hold'] },
  at: 999_999,
};

const wrongCharge: GameAction = {
  type: 'SUBMIT_PUZZLE',
  puzzle: 'pz_accusation',
  submission: { type: 'accusation', choices: ['marsh', 'railing', 'promenade_rail'] },
  at: 999_998,
};

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(linerWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(linerWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the case', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('promenade');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(linerWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect([...finalState.secretsFound].sort()).toEqual(['cache', 'sapphire']);
  });

  it('visits every room and fills the whole case file', () => {
    for (const room of Object.keys(linerWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(linerWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it("earns every achievement except the challenge-timer one, including 'A Perfect Deduction'", () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      linerWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
    expect(finalState.achievementsUnlocked.ach_deduction).toBeDefined();
  });

  it('consumes every key, tool, and plant; only the manifest page remains in evidence', () => {
    expect(finalState.inventory).toEqual(['manifest_page']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const bulkheadIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_bulkhead',
  );
  const hatchIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_hold_hatch',
  );

  it('the engine room sits behind the watertight doors until the drill is cycled', () => {
    const before = replay(actions.slice(0, bulkheadIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('engine_room')).toBe(false);
    const after = replay(actions.slice(0, bulkheadIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('engine_room')).toBe(true);
  });

  it('the bulkhead cycle closes the galley corridor without stranding the galley', () => {
    const after = replay(actions.slice(0, bulkheadIdx + 1));
    expect(after.topology.p_stair_galley.open).toBe(false);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['galley', 'linen_room', 'promenade']) {
      expect(reachable.has(room), `${room} softlocked after the bulkhead cycle`).toBe(true);
    }
  });

  it("the hold opens only to the stevedore's rings; the suite only once the ship lists", () => {
    const beforeHatch = replay(actions.slice(0, hatchIdx));
    expect(reachableRooms(beforeHatch.topology, beforeHatch.currentRoom).has('cargo_hold')).toBe(false);
    const afterHatch = replay(actions.slice(0, hatchIdx + 1));
    expect(afterHatch.topology.p_winch_hold.open).toBe(true);

    const beforeList = replay(actions.slice(0, bulkheadIdx + 1));
    expect(beforeList.topology.p_prom_suite.open).toBe(false);
    const afterList = replay(actions.slice(0, bulkheadIdx + 2)); // the MOVE into the engine room
    expect(afterList.topology.p_prom_suite.open).toBe(true);
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const idx = actions.findIndex(
      (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_keyrack',
    );
    const detour: GameAction[] = [
      ...actions.slice(0, idx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_keyrack',
        submission: { type: 'combination', values: ['A', 'A', 'A', 'A'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_keyrack',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(idx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_keyrack.attempts).toBe(2);
  });
});

describe('the mystery contract', () => {
  const actions = buildWalkthrough();
  const lastKeystoneIdx = actions.findIndex(
    (a) => a.type === 'INTERACT' && a.hotspot === 'tally_board',
  );
  const accusationIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_accusation',
  );

  it('the correct charge cannot be laid until the last keystone evidence is in hand', () => {
    expect(lastKeystoneIdx).toBeGreaterThan(0);

    // One action short of the tally board: WHO and HOW are pinned, WHERE is not.
    const before = replay(actions.slice(0, lastKeystoneIdx));
    expect(before.flags.who_pinned).toBe(true);
    expect(before.flags.how_pinned).toBe(true);
    expect(before.flags.where_pinned).toBeUndefined();

    const blocked = reduce(before, correctCharge, linerWorld);
    expect(blocked.state.status).toBe('playing');
    expect(blocked.state.puzzles.pz_accusation.solved).toBe(false);
    expect(blocked.state.puzzles.pz_accusation.attempts).toBe(0);

    // One action further — the tally board read — and the same charge holds.
    const after = replay(actions.slice(0, lastKeystoneIdx + 1));
    const won = reduce(after, correctCharge, linerWorld);
    expect(won.state.status).toBe('won');
    expect(won.state.puzzles.pz_accusation.solved).toBe(true);
  });

  it('a wrong charge is rebuked in fiction, counted, and never blocks the true verdict', () => {
    const ready = replay(actions.slice(0, accusationIdx));
    const rebuked = reduce(ready, wrongCharge, linerWorld);
    expect(rebuked.state.status).toBe('playing');
    expect(rebuked.state.puzzles.pz_accusation.attempts).toBe(1);
    expect(rebuked.notes.narrations).toContain(accusationDef.wrongFeedback);

    const vindicated = reduce(rebuked.state, correctCharge, linerWorld);
    expect(vindicated.state.status).toBe('won');
  });

  it("only a first-try verdict earns 'A Perfect Deduction'", () => {
    const golden = replay(actions);
    expect(golden.achievementsUnlocked.ach_deduction).toBeDefined();

    const wrongFirst: GameAction[] = [
      ...actions.slice(0, accusationIdx),
      wrongCharge,
      ...actions.slice(accusationIdx),
    ];
    const final = replay(wrongFirst);
    expect(final.status).toBe('won');
    expect(final.achievementsUnlocked.ach_verdict).toBeDefined();
    expect(final.achievementsUnlocked.ach_deduction).toBeUndefined();
  });

  it('on the golden path, every element of the true charge is grounded in unlocked journal evidence', () => {
    const ready = replay(actions.slice(0, accusationIdx));
    const unlockedText = ready.journal
      .map((j) => {
        const def = linerWorld.journal[j.id];
        return `${def.title}\n${def.body}`;
      })
      .join('\n')
      .toLowerCase();

    accusationDef.categories.forEach((cat, i) => {
      const opt = cat.options.find((o) => o.id === accusationDef.answer[i]);
      expect(opt, `answer option missing for ${cat.id}`).toBeDefined();
      expect(
        unlockedText.includes(opt!.label.toLowerCase()),
        `label "${opt!.label}" not grounded in unlocked journal`,
      ).toBe(true);
    });
  });
});
