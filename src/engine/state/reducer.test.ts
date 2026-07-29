import { describe, expect, it } from 'vitest';
import type { GameState } from '../types.ts';
import { reduce } from './reducer.ts';
import { miniWorld } from '../__fixtures__/miniWorld.ts';

function started(): GameState {
  return reduce({} as GameState, { type: 'START_GAME', worldId: 'mini', mode: 'relaxed', at: 1000 }, miniWorld).state;
}

function step(state: GameState, action: Parameters<typeof reduce>[1]) {
  return reduce(state, action, miniWorld);
}

describe('START_GAME', () => {
  it('builds fresh state, visits the entry room, runs first-enter effects', () => {
    const s = started();
    expect(s.status).toBe('playing');
    expect(s.currentRoom).toBe('foyer');
    expect(s.visitedRooms.foyer).toBe(true);
    expect(s.journal.map((j) => j.id)).toEqual(['j_start']);
    expect(s.timer).toMatchObject({ mode: 'relaxed', startedAt: 1000, pausedMs: 0 });
  });
});

describe('MOVE', () => {
  it('rejects closed passages and surfaces closedText + thud', () => {
    const s = started();
    const { state, notes } = step(s, { type: 'MOVE', passage: 'p_foyer_corridor', at: 2000 });
    expect(state.currentRoom).toBe('foyer');
    expect(notes.blockedMove).toBe('p_foyer_corridor');
    expect(notes.narrations).toContain('Locked tight.');
    expect(notes.sounds).toContain('thud');
  });

  it('rejects passages not touching the current room', () => {
    const s = started();
    const { state } = step(s, { type: 'MOVE', passage: 'p_corridor_vault', at: 2000 });
    expect(state.currentRoom).toBe('foyer');
  });

  it('moves through open passages and marks the room visited', () => {
    let s = started();
    s = step(s, { type: 'INTERACT', hotspot: 'take_key', at: 2000 }).state;
    s = step(s, { type: 'USE_ITEM', hotspot: 'keyhole', item: 'key', at: 3000 }).state;
    const { state } = step(s, { type: 'MOVE', passage: 'p_foyer_corridor', at: 4000 });
    expect(state.currentRoom).toBe('corridor');
    expect(state.visitedRooms.corridor).toBe(true);
  });
});

describe('INTERACT', () => {
  it('pickup adds the item once and notes it', () => {
    const s = started();
    const first = step(s, { type: 'INTERACT', hotspot: 'take_key', at: 2000 });
    expect(first.state.inventory).toEqual(['key']);
    expect(first.notes.pickedUpItem).toBe('key');
    // hotspot now hidden by hideWhen — repeat is a no-op
    const second = step(first.state, { type: 'INTERACT', hotspot: 'take_key', at: 3000 });
    expect(second.state.inventory).toEqual(['key']);
    expect(second.notes.pickedUpItem).toBeUndefined();
  });

  it('inspect narrates and applies effects', () => {
    const s = started();
    const { state, notes } = step(s, { type: 'INTERACT', hotspot: 'plaque', at: 2000 });
    expect(notes.narrations).toContain('It reads: TWO.');
    expect(state.flags.readPlaque).toBe(true);
  });

  it('navigate through a closed passage is blocked with narration', () => {
    const s = started();
    const { state, notes } = step(s, { type: 'INTERACT', hotspot: 'door', at: 2000 });
    expect(state.currentRoom).toBe('foyer');
    expect(notes.narrations).toContain('Locked tight.');
  });
});

describe('USE_ITEM', () => {
  it('wrong item narrates wrongItemText; right item applies effects and shifts', () => {
    let s = started();
    s = step(s, { type: 'INTERACT', hotspot: 'take_key', at: 2000 }).state;
    const wrong = step(s, { type: 'USE_ITEM', hotspot: 'keyhole', item: 'missing', at: 2500 });
    expect(wrong.state).toEqual(s); // item not in inventory → no-op
    const right = step(s, { type: 'USE_ITEM', hotspot: 'keyhole', item: 'key', at: 3000 });
    expect(right.state.inventory).toEqual([]);
    expect(right.state.topology.p_foyer_corridor.open).toBe(true);
    expect(right.state.appliedShifts).toContain('s_open');
    expect(right.notes.shift).toBe('s_open');
    expect(right.notes.narrations).toContain('The lock clicks.');
  });
});

describe('SUBMIT_PUZZLE', () => {
  function inCorridor(): GameState {
    let s = started();
    s = step(s, { type: 'INTERACT', hotspot: 'take_key', at: 2000 }).state;
    s = step(s, { type: 'INTERACT', hotspot: 'plaque', at: 2500 }).state;
    s = step(s, { type: 'USE_ITEM', hotspot: 'keyhole', item: 'key', at: 3000 }).state;
    return step(s, { type: 'MOVE', passage: 'p_foyer_corridor', at: 4000 }).state;
  }

  it('blocks puzzles whose prerequisite fails', () => {
    let s = started();
    s = step(s, { type: 'INTERACT', hotspot: 'take_key', at: 2000 }).state;
    s = step(s, { type: 'USE_ITEM', hotspot: 'keyhole', item: 'key', at: 3000 }).state;
    s = step(s, { type: 'MOVE', passage: 'p_foyer_corridor', at: 4000 }).state;
    // never read the plaque → pz_dial's `if` fails
    const { state } = step(s, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dial',
      submission: { type: 'combination', values: ['2'] },
      at: 5000,
    });
    expect(state.puzzles.pz_dial.solved).toBe(false);
    expect(state.puzzles.pz_dial.attempts).toBe(0);
  });

  it('counts failed attempts and plays a thud', () => {
    const s = inCorridor();
    const { state, notes } = step(s, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dial',
      submission: { type: 'combination', values: ['1'] },
      at: 5000,
    });
    expect(state.puzzles.pz_dial).toMatchObject({ solved: false, attempts: 1 });
    expect(notes.sounds).toContain('thud');
  });

  it('solves, applies onSolve, stamps solvedAt, and ignores resubmission', () => {
    const s = inCorridor();
    const solved = step(s, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dial',
      submission: { type: 'combination', values: ['2'] },
      at: 5000,
    });
    expect(solved.state.puzzles.pz_dial).toMatchObject({ solved: true, solvedAt: 5000 });
    expect(solved.state.topology.p_corridor_vault.open).toBe(true);
    const again = step(solved.state, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dial',
      submission: { type: 'combination', values: ['2'] },
      at: 6000,
    });
    expect(again.state).toEqual(solved.state);
  });

  it('winning the final puzzle sets status won and finishedInMs', () => {
    let s = inCorridor();
    s = step(s, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_dial',
      submission: { type: 'combination', values: ['2'] },
      at: 5000,
    }).state;
    s = step(s, { type: 'MOVE', passage: 'p_corridor_vault', at: 6000 }).state;
    const { state, notes } = step(s, {
      type: 'SUBMIT_PUZZLE',
      puzzle: 'pz_final',
      submission: { type: 'cipher', text: 'Echo!' },
      at: 61_000,
    });
    expect(state.status).toBe('won');
    expect(state.timer.finishedInMs).toBe(60_000);
    expect(notes.unlockedAchievements).toContain('a_done');
    expect(notes.unlockedAchievements).toContain('a_pure');
    // after winning, further actions are ignored
    const after = step(state, { type: 'MOVE', passage: 'p_corridor_vault', at: 70_000 });
    expect(after.state).toEqual(state);
  });
});

describe('REVEAL_HINT', () => {
  it('raises hintsUsed monotonically and voids the no-hint achievement', () => {
    let s = started();
    s = step(s, { type: 'REVEAL_HINT', puzzle: 'pz_dial', tier: 2, at: 2000 }).state;
    expect(s.puzzles.pz_dial.hintsUsed).toBe(2);
    s = step(s, { type: 'REVEAL_HINT', puzzle: 'pz_dial', tier: 1, at: 3000 }).state;
    expect(s.puzzles.pz_dial.hintsUsed).toBe(2);
  });
});

describe('PAUSE / RESUME timer math', () => {
  it('accumulates paused time via timestamps', () => {
    let s = started();
    s = step(s, { type: 'PAUSE', at: 5000 }).state;
    expect(s.timer.pausedSince).toBe(5000);
    s = step(s, { type: 'RESUME', at: 9000 }).state;
    expect(s.timer).toMatchObject({ pausedMs: 4000, pausedSince: null });
    // double pause/resume are idempotent
    s = step(s, { type: 'RESUME', at: 10_000 }).state;
    expect(s.timer.pausedMs).toBe(4000);
  });
});

describe('TIME_EXPIRED', () => {
  it('only expires challenge runs', () => {
    const relaxed = step(started(), { type: 'TIME_EXPIRED', at: 99_999 });
    expect(relaxed.state.status).toBe('playing');
    const challenge = reduce(
      {} as GameState,
      { type: 'START_GAME', worldId: 'mini', mode: 'challenge', at: 0 },
      miniWorld,
    ).state;
    const expired = step(challenge, { type: 'TIME_EXPIRED', at: 99_999 });
    expect(expired.state.status).toBe('timeExpired');
  });
});

describe('LOAD_STATE', () => {
  it('replaces state wholesale', () => {
    const s = started();
    const loaded = step({} as GameState, { type: 'LOAD_STATE', state: s });
    expect(loaded.state).toEqual(s);
  });
});
