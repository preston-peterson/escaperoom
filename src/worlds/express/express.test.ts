import { describe, expect, it } from 'vitest';
import { expressWorld } from './world.ts';
import { buildWalkthrough } from './walkthrough.ts';
import { validateWorld } from '../../engine/validateWorld.ts';
import { reduce } from '../../engine/state/reducer.ts';
import { reachableRooms } from '../../engine/topology.ts';
import type { GameAction, GameState, ReducerNotes } from '../../engine/types.ts';

function replay(actions: GameAction[]): GameState {
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, expressWorld).state;
  }
  return state;
}

/** Replay, keeping the reducer notes of every dispatch for inspection. */
function replayWithNotes(actions: GameAction[]): {
  state: GameState;
  notesLog: ReducerNotes[];
} {
  let state = {} as GameState;
  const notesLog: ReducerNotes[] = [];
  for (const action of actions) {
    const result = reduce(state, action, expressWorld);
    state = result.state;
    notesLog.push(result.notes);
  }
  return { state, notesLog };
}

const accusation = expressWorld.puzzles.pz_accuse;
if (accusation.type !== 'accusation') throw new Error('pz_accuse must be an accusation');

const CORRECT: GameAction = {
  type: 'SUBMIT_PUZZLE',
  puzzle: 'pz_accuse',
  submission: { type: 'accusation', choices: ['o_voss', 'o_sashcord', 'o_observation'] },
  at: 999_999,
};

describe('world integrity', () => {
  it('validateWorld finds no problems', () => {
    expect(validateWorld(expressWorld)).toEqual([]);
  });

  it('every puzzle has three non-empty hints (spot check of the type contract)', () => {
    for (const p of Object.values(expressWorld.puzzles)) {
      expect(p.hints).toHaveLength(3);
      p.hints.forEach((h) => expect(h.trim().length).toBeGreaterThan(0));
    }
  });
});

describe('golden walkthrough', () => {
  const finalState = replay(buildWalkthrough());

  it('wins the game at the cordon box', () => {
    expect(finalState.status).toBe('won');
    expect(finalState.currentRoom).toBe('platform');
    expect(finalState.timer.finishedInMs).toBeGreaterThan(0);
  });

  it('applies every shift, including the junction decoupling', () => {
    expect([...finalState.appliedShifts].sort()).toEqual(
      Object.keys(expressWorld.shifts).sort(),
    );
  });

  it('finds both secrets', () => {
    expect(finalState.secretsFound.sort()).toEqual(['groat', 'margo']);
  });

  it('visits every car and fills the whole case file', () => {
    for (const room of Object.keys(expressWorld.rooms)) {
      expect(finalState.visitedRooms[room], `room ${room} unvisited`).toBe(true);
    }
    const unlocked = new Set(finalState.journal.map((j) => j.id));
    for (const entry of Object.keys(expressWorld.journal)) {
      expect(unlocked.has(entry), `journal ${entry} locked`).toBe(true);
    }
  });

  it('earns every achievement except the challenge-timer one', () => {
    const earned = Object.keys(finalState.achievementsUnlocked).sort();
    expect(earned).toEqual(
      expressWorld.achievements
        .map((a) => a.id)
        .filter((id) => id !== 'ach_express')
        .sort(),
    );
  });

  it('carries out only the evidence — keys, staff and lamp are all spent', () => {
    expect(finalState.inventory.sort()).toEqual(['telegram', 'voss_letter']);
  });
});

describe('progression gates', () => {
  const actions = buildWalkthrough();
  const cordonIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_cordon',
  );
  const panelIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_panel',
  );
  const shuntIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_shunt',
  );

  it('the train is sealed until the customs seal yields', () => {
    const before = replay(actions.slice(0, cordonIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('dining')).toBe(false);
    const after = replay(actions.slice(0, cordonIdx + 1));
    expect(reachableRooms(after.topology, after.currentRoom).has('dining')).toBe(true);
  });

  it('the latched berth opens only through the smuggler’s panel', () => {
    const before = replay(actions.slice(0, panelIdx));
    expect(reachableRooms(before.topology, before.currentRoom).has('berth_fisk')).toBe(false);
    const after = replay(actions.slice(0, panelIdx + 1));
    expect(after.topology.p_voss_fisk.open).toBe(true);
    expect(reachableRooms(after.topology, after.currentRoom).has('berth_fisk')).toBe(true);
  });

  it('the junction shunt actually remaps the coupling — new endpoints, new car order', () => {
    const before = replay(actions.slice(0, shuntIdx));
    expect(before.topology.p_corra_corrb.from).toBe('corridor_a');
    expect(before.topology.p_corra_corrb.to).toBe('corridor_b');
    expect(before.topology.p_corrb_obs.open).toBe(false);
    expect(reachableRooms(before.topology, before.currentRoom).has('observation')).toBe(false);

    const after = replay(actions.slice(0, shuntIdx + 1));
    expect(after.topology.p_corra_corrb.from).toBe('corridor_a');
    expect(after.topology.p_corra_corrb.to).toBe('observation');
    expect(after.topology.p_corra_corrb.open).toBe(true);
    expect(after.topology.p_corrb_obs.open).toBe(true);
    expect(reachableRooms(after.topology, after.currentRoom).has('observation')).toBe(true);
  });

  it('wrong answers never corrupt state or block the later solution', () => {
    const detour: GameAction[] = [
      ...actions.slice(0, cordonIdx),
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_cordon',
        submission: { type: 'combination', values: ['9', '9', '9', '9'] },
        at: 1,
      },
      {
        type: 'SUBMIT_PUZZLE',
        puzzle: 'pz_cordon',
        submission: { type: 'cipher', text: 'open sesame' },
        at: 2,
      },
      ...actions.slice(cordonIdx),
    ];
    const final = replay(detour);
    expect(final.status).toBe('won');
    expect(final.puzzles.pz_cordon.attempts).toBe(2);
  });
});

describe('the mystery holds', () => {
  const actions = buildWalkthrough();
  const lastKeystoneIdx = actions.findIndex(
    (a) => a.type === 'INTERACT' && a.hotspot === 'cord_reckon',
  );
  const accuseIdx = actions.findIndex(
    (a) => a.type === 'SUBMIT_PUZZLE' && a.puzzle === 'pz_accuse',
  );

  it('the correct verdict cannot be filed until the last keystone evidence is in', () => {
    // One inspect short of pinning the means, the truth itself will not hold.
    const before = replay([...actions.slice(0, lastKeystoneIdx), CORRECT]);
    expect(before.status).toBe('playing');
    expect(before.puzzles.pz_accuse.solved).toBe(false);
    expect(before.puzzles.pz_accuse.attempts).toBe(0);

    // One action further — the same submission wins.
    const after = replay([...actions.slice(0, lastKeystoneIdx + 1), CORRECT]);
    expect(after.status).toBe('won');
    expect(after.puzzles.pz_accuse.solved).toBe(true);
  });

  it('a wrong accusation rebukes, counts, and never blocks the true verdict', () => {
    const wrong: GameAction = {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_accuse',
      submission: { type: 'accusation', choices: ['o_brandt', 'o_pickwire', 'o_baggagecar'] },
      at: 1,
    };
    const detour: GameAction[] = [
      ...actions.slice(0, accuseIdx),
      wrong,
      ...actions.slice(accuseIdx),
    ];
    const { state: final, notesLog } = replayWithNotes(detour);

    const wrongNotes = notesLog[accuseIdx];
    expect(wrongNotes.narrations).toContain(accusation.wrongFeedback);
    expect(final.puzzles.pz_accuse.attempts).toBe(1);
    expect(final.status).toBe('won');

    // First-try honors: the golden run earns A Perfect Deduction; the
    // wrong-first run does not.
    const golden = replay(actions);
    expect(Object.keys(golden.achievementsUnlocked)).toContain('ach_deduction');
    expect(Object.keys(final.achievementsUnlocked)).not.toContain('ach_deduction');
  });

  it('on the golden path, every answer option is grounded in unlocked journal entries', () => {
    const state = replay(actions.slice(0, accuseIdx));
    const unlockedText = state.journal
      .map((j) => {
        const entry = expressWorld.journal[j.id];
        return `${entry.title}\n${entry.body}`;
      })
      .join('\n')
      .toLowerCase();

    accusation.categories.forEach((cat, i) => {
      const answer = cat.options.find((o) => o.id === accusation.answer[i]);
      expect(answer, `answer option missing in ${cat.id}`).toBeDefined();
      expect(
        unlockedText.includes(answer!.label.toLowerCase()),
        `label "${answer!.label}" not discoverable in the unlocked journal`,
      ).toBe(true);
    });
  });
});
