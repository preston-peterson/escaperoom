import { describe, expect, it } from 'vitest';
import { theaterWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState, PuzzleSubmission } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, theaterWorld).state;
  }
  return state;
}

const CORRECT_VERDICT: PuzzleSubmission = {
  type: 'accusation',
  choices: ['craik', 'counterweight', 'fly_gallery'],
};

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(theaterWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(theaterWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('stage');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(theaterWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['titlepage', 'token']);
  });

  it('visits every room and fills the whole case file', () => {
    for (const room of Object.keys(theaterWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(theaterWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      theaterWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_editions')
        .sort(),
    );
  });

  it('consumes the evidence items and keeps the keepsakes', () => {
    expect(finalState.inventory.sort()).toEqual(['master_keys', 'stage_token']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const keysIdx = actions.findIndex(
    (a) => a.type === 'INTERACT' && a.hotspot === 'craik_keys',
  );
  const gateIdx = actions.findIndex(
    (a) => a.type === 'USE_ITEM' && a.hotspot === 'fly_gate',
  );
  const revolveIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_revolve',
  );
  const trapIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_trap_machine',
  );

  it("Craik's keys open three doors at once, but never the gallery gate", () => {
    const before = replay(actions.slice(0, keysIdx));
    const reachableBefore = reachableRooms(before.topology, before.currentRoom);
    for (const room of ['understage', 'dressing_star', 'writers_office', 'fly_gallery']) {
      expect(reachableBefore.has(room), `${room} reachable too early`).toBe(false);
    }
    const after = replay(actions.slice(0, keysIdx + 1));
    const reachableAfter = reachableRooms(after.topology, after.currentRoom);
    for (const room of ['understage', 'dressing_star', 'writers_office']) {
      expect(reachableAfter.has(room), `${room} still sealed after the keys`).toBe(true);
    }
    expect(reachableAfter.has('fly_gallery')).toBe(false);
    const gated = replay(actions.slice(0, gateIdx + 1));
    expect(reachableRooms(gated.topology, gated.currentRoom).has('fly_gallery')).toBe(true);
  });

  it("the revolve remap actually rewires the upstage door's endpoints", () => {
    const before = replay(actions.slice(0, revolveIdx));
    expect(before.topology.p_revolve_door.from).toBe('stage');
    expect(before.topology.p_revolve_door.to).toBe('dressing_understudy');
    expect(reachableRooms(before.topology, before.currentRoom).has('dressing_rival')).toBe(false);

    const after = replay(actions.slice(0, revolveIdx + 1));
    expect(after.topology.p_revolve_door.from).toBe('stage');
    expect(after.topology.p_revolve_door.to).toBe('dressing_rival');
    expect(reachableRooms(after.topology, after.currentRoom).has('dressing_rival')).toBe(true);
    // The wing the door abandoned is still served by the corridor — no softlock.
    expect(reachableRooms(after.topology, after.currentRoom).has('dressing_understudy')).toBe(true);
  });

  it('running the trap opens the stage↔understage circuit and the pit hatch', () => {
    const before = replay(actions.slice(0, trapIdx));
    expect(before.topology.p_trapdoor.open).toBe(false);
    expect(before.topology.p_pit_hatch.open).toBe(false);
    expect(before.topology.p_pit_hatch.revealed).toBe(false);
    const after = replay(actions.slice(0, trapIdx + 1));
    expect(after.topology.p_trapdoor.open).toBe(true);
    expect(after.topology.p_pit_hatch.open).toBe(true);
    expect(after.topology.p_pit_hatch.revealed).toBe(true);
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const idx = actions.findIndex(
      (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_cue_board',
    );
    const detour: GameAction[] = [
      ...actions.slice(0, idx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_cue_board',
        submission: { type: 'sequence', order: ['ring', 'house', 'limes', 'bells'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_cue_board',
        submission: { type: 'cipher', text: 'places please' },
        at: 2,
      },
      ...actions.slice(idx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_cue_board.attempts).toBe(2);
  });
});

describe('the mystery contract', () => {
  const actions = buildWalkthrough();
  const lastKeystoneIdx = actions.findIndex(
    (a) => a.type === 'INTERACT' && a.hotspot === 'callers_perch',
  );
  const accusationIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_accusation',
  );

  it('the correct verdict cannot be forced before the last keystone evidence', () => {
    expect(lastKeystoneIdx).toBeGreaterThan(0);
    const before = replay(actions.slice(0, lastKeystoneIdx));
    const forced = reduce(
      before,
      { type: 'SUBMIT_PUZZLE', puzzle: 'pz_accusation', submission: CORRECT_VERDICT, at: 1 },
      theaterWorld,
    ).state;
    expect(forced.status).toBe('playing');
    expect(forced.puzzles.pz_accusation.solved).toBe(false);
    expect(forced.puzzles.pz_accusation.attempts).toBe(0);

    // One action later — the caller's perch pins WHO — the same triple holds.
    const after = replay(actions.slice(0, lastKeystoneIdx + 1));
    const won = reduce(
      after,
      { type: 'SUBMIT_PUZZLE', puzzle: 'pz_accusation', submission: CORRECT_VERDICT, at: 2 },
      theaterWorld,
    ).state;
    expect(won.status).toBe('won');
    expect(won.puzzles.pz_accusation.solved).toBe(true);
  });

  it('a wrong accusation rebukes in fiction, counts the attempt, and blocks nothing', () => {
    const armed = replay(actions.slice(0, accusationIdx));
    const wrong = reduce(
      armed,
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_accusation',
        submission: { type: 'accusation', choices: ['dunmore', 'knife', 'understage'] },
        at: 1,
      },
      theaterWorld,
    );
    expect(wrong.state.status).toBe('playing');
    expect(wrong.state.puzzles.pz_accusation.attempts).toBe(1);
    const def = theaterWorld.puzzles.pz_accusation;
    if (def.type !== 'accusation') throw new Error('finale must be an accusation');
    expect(wrong.notes.narrations).toContain(def.wrongFeedback);

    const corrected = reduce(
      wrong.state,
      { type: 'SUBMIT_PUZZLE', puzzle: 'pz_accusation', submission: CORRECT_VERDICT, at: 2 },
      theaterWorld,
    ).state;
    expect(corrected.status).toBe('won');

    // First-try honors: the golden run earns the deduction; the fumbled run does not.
    const golden = replay(actions);
    expect(golden.achievementsUnlocked).toHaveProperty('ach_deduction');
    expect(corrected.achievementsUnlocked).not.toHaveProperty('ach_deduction');
    expect(corrected.achievementsUnlocked).toHaveProperty('ach_verdict');
  });

  it('every answer label is grounded in the journal actually unlocked on the golden path', () => {
    const armed = replay(actions.slice(0, accusationIdx));
    const unlockedText = armed.journal
      .map((j) => {
        const entry = theaterWorld.journal[j.id];
        return `${entry.title}\n${entry.body}`;
      })
      .join('\n')
      .toLowerCase();
    const def = theaterWorld.puzzles.pz_accusation;
    if (def.type !== 'accusation') throw new Error('finale must be an accusation');
    def.categories.forEach((cat, i) => {
      const answer = cat.options.find((o) => o.id === def.answer[i]);
      expect(answer, `category ${cat.id} has no answer option`).toBeDefined();
      expect(
        unlockedText.includes(answer!.label.toLowerCase()),
        `label "${answer!.label}" not grounded in unlocked journal`,
      ).toBe(true);
    });
  });
});
