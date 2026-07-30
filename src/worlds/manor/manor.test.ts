import { describe, expect, it } from 'vitest';
import { manorWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState, PuzzleSubmission } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, manorWorld).state;
  }
  return state;
}

const CORRECT_VERDICT: PuzzleSubmission = {
  type: 'accusation',
  choices: ['casque', 'foxglove', 'conservatory'],
};

function submitVerdict(state: GameState, submission: PuzzleSubmission, at: number) {
  return reduce(state, { type: 'SUBMIT_PUZZLE', puzzle: 'pz_accuse', submission, at }, manorWorld);
}

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(manorWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(manorWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game at the hall table', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('foyer');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(manorWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect([...finalState.secretsFound].sort()).toEqual(['miniature', 'will']);
  });

  it('visits every room and fills the whole case file', () => {
    for (const room of Object.keys(manorWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(manorWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      manorWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_swift')
        .sort(),
    );
  });

  it('consumes every quest item by the end', () => {
    expect(finalState.inventory).toEqual([]);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const doorIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_study_door',
  );
  const boilerIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_boiler',
  );
  const faroIdx = actions.findIndex(
    (a) => a.type === 'MOVE' && a.passage === 'p_landing_faro',
  );

  it('the study opens only to the letter-lock', () => {
    const before = replay(actions.slice(0, doorIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('study')).toBe(false);
    const after = replay(actions.slice(0, doorIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('study')).toBe(true);
  });

  it('the conservatory stays frozen shut until the boiler is relit', () => {
    const before = replay(actions.slice(0, boilerIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('conservatory')).toBe(false);
    const after = replay(actions.slice(0, boilerIdx + 1));
    expect(after.topology.p_parlor_conservatory.open).toBe(true);
    expect(reachableRooms(after.topology, after.currentRoom).has('conservatory')).toBe(true);
  });

  it('the drift seals the main stair but the maids’ stair keeps the wing alive', () => {
    const after = replay(actions.slice(0, faroIdx + 1));
    expect(after.topology.p_foyer_landing.open).toBe(false);
    expect(after.topology.p_landing_kitchen.open).toBe(true);
    const reachable = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['landing', 'ivy_room', 'casque_room', 'kitchen', 'foyer']) {
      expect(reachable.has(room), `${room} softlocked after the drift`).toBe(true);
    }
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const detour: GameAction[] = [
      ...actions.slice(0, doorIdx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_study_door',
        submission: { type: 'combination', values: ['W', 'A', 'L'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_study_door',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(doorIdx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_study_door.attempts).toBe(2);
  });
});

describe('the accusation', () => {
  const actions = buildWalkthrough();
  // The last keystone-evidence beat: the drag marks in the conservatory,
  // which pin WHERE. The accusation submission is always the final action.
  const keystoneIdx = actions.findIndex(
    (a) => a.type === 'INTERACT' && a.hotspot === 'drag_marks',
  );
  const preVerdict = actions.slice(0, -1);

  it('the correct verdict is mechanically unanswerable until the last keystone lands', () => {
    expect(keystoneIdx).toBeGreaterThan(0);
    const before = replay(actions.slice(0, keystoneIdx));
    const blocked = submitVerdict(before, CORRECT_VERDICT, 999_000);
    expect(blocked.state.status).toBe('playing');
    expect(blocked.state.puzzles.pz_accuse.solved).toBe(false);
    expect(blocked.state.puzzles.pz_accuse.attempts).toBe(0);

    const after = replay(actions.slice(0, keystoneIdx + 1));
    const won = submitVerdict(after, CORRECT_VERDICT, 999_000);
    expect(won.state.status).toBe('won');
  });

  it('a wrong verdict rebukes in-fiction and never blocks the true one', () => {
    const accuse = manorWorld.puzzles.pz_accuse;
    if (accuse.type !== 'accusation') throw new Error('pz_accuse must be an accusation');

    const ready = replay(preVerdict);
    const wrong = submitVerdict(
      ready,
      { type: 'accusation', choices: ['ash', 'opener', 'study'] },
      998_000,
    );
    expect(wrong.state.status).toBe('playing');
    expect(wrong.state.puzzles.pz_accuse.solved).toBe(false);
    expect(wrong.state.puzzles.pz_accuse.attempts).toBe(1);
    expect(wrong.notes.narrations).toContain(accuse.wrongFeedback);

    const corrected = submitVerdict(wrong.state, CORRECT_VERDICT, 999_000);
    expect(corrected.state.status).toBe('won');
    // A stumbled deduction forfeits the first-try laurel; the golden run keeps it.
    expect(corrected.state.achievementsUnlocked.ach_deduction).toBeUndefined();
    const golden = replay(actions);
    expect(golden.achievementsUnlocked.ach_deduction).toBeGreaterThan(0);
  });

  it('every answer label is grounded in the journal unlocked on the golden path', () => {
    const accuse = manorWorld.puzzles.pz_accuse;
    if (accuse.type !== 'accusation') throw new Error('pz_accuse must be an accusation');

    const ready = replay(preVerdict);
    const unlockedText = ready.journal
      .map((j) => {
        const entry = manorWorld.journal[j.id];
        return `${entry.title}\n${entry.body}`;
      })
      .join('\n')
      .toLowerCase();
    accuse.categories.forEach((cat, i) => {
      const option = cat.options.find((o) => o.id === accuse.answer[i]);
      expect(option, `answer option missing for ${cat.id}`).toBeDefined();
      expect(
        unlockedText.includes(option!.label.toLowerCase()),
        `label "${option!.label}" not discoverable before the verdict`,
      ).toBe(true);
    });
  });
});
