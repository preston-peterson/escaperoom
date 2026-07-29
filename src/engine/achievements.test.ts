import { describe, expect, it } from 'vitest';
import { achievementMet, allLoreFound, evaluateAchievements } from './achievements.ts';
import { miniWorld } from './__fixtures__/miniWorld.ts';
import { reduce } from './state/reducer.ts';
import type { GameState } from './types.ts';

function wonState(mode: 'relaxed' | 'challenge', finishedInMs: number): GameState {
  const start = reduce(
    {} as GameState,
    { type: 'START_GAME', worldId: 'mini', mode, at: 0 },
    miniWorld,
  ).state;
  return {
    ...start,
    status: 'won',
    timer: { ...start.timer, finishedInMs },
  };
}

describe('achievementMet', () => {
  it('timeUnder requires challenge mode and a finish under the bar', () => {
    const fast = wonState('challenge', 4 * 60_000);
    const slow = wonState('challenge', 6 * 60_000);
    const relaxedFast = wonState('relaxed', 4 * 60_000);
    const def = miniWorld.achievements.find((a) => a.id === 'a_fast')!;
    expect(achievementMet(def, fast, miniWorld, 0)).toBe(true);
    expect(achievementMet(def, slow, miniWorld, 0)).toBe(false);
    expect(achievementMet(def, relaxedFast, miniWorld, 0)).toBe(false);
  });

  it('noHints fails once any hint tier was revealed', () => {
    const s = wonState('relaxed', 1000);
    const def = miniWorld.achievements.find((a) => a.id === 'a_pure')!;
    expect(achievementMet(def, s, miniWorld, 0)).toBe(true);
    const hinted = {
      ...s,
      puzzles: { ...s.puzzles, pz_dial: { ...s.puzzles.pz_dial, hintsUsed: 1 as const } },
    };
    expect(achievementMet(def, hinted, miniWorld, 0)).toBe(false);
  });

  it('allRoomsVisited requires every room', () => {
    const s = wonState('relaxed', 1000);
    const def = miniWorld.achievements.find((a) => a.id === 'a_all')!;
    expect(achievementMet(def, s, miniWorld, 0)).toBe(false);
    const all = {
      ...s,
      visitedRooms: { foyer: true, corridor: true, 'vault-room': true } as const,
    };
    expect(achievementMet(def, all, miniWorld, 0)).toBe(true);
  });
});

describe('puzzleFirstTry', () => {
  const def = {
    id: 'a_first',
    title: 'First',
    description: 'No wrong guesses.',
    check: 'puzzleFirstTry',
    puzzle: 'pz_dial',
  } as const;
  it('requires solved with zero failed attempts', () => {
    const s = wonState('relaxed', 1000);
    const clean = {
      ...s,
      puzzles: { ...s.puzzles, pz_dial: { solved: true, hintsUsed: 0 as const, attempts: 0 } },
    };
    expect(achievementMet(def, clean, miniWorld, 0)).toBe(true);
    const missed = {
      ...s,
      puzzles: { ...s.puzzles, pz_dial: { solved: true, hintsUsed: 0 as const, attempts: 2 } },
    };
    expect(achievementMet(def, missed, miniWorld, 0)).toBe(false);
    const unsolved = {
      ...s,
      puzzles: { ...s.puzzles, pz_dial: { solved: false, hintsUsed: 0 as const, attempts: 0 } },
    };
    expect(achievementMet(def, unsolved, miniWorld, 0)).toBe(false);
  });
});

describe('evaluateAchievements', () => {
  it('stamps new achievements once and never re-awards', () => {
    const s = wonState('relaxed', 1000);
    const first = evaluateAchievements(s, miniWorld, 42);
    expect(first.newlyUnlocked).toContain('a_done');
    expect(first.state.achievementsUnlocked.a_done).toBe(42);
    const second = evaluateAchievements(first.state, miniWorld, 99);
    expect(second.newlyUnlocked).toEqual([]);
    expect(second.state.achievementsUnlocked.a_done).toBe(42);
  });
});

describe('allLoreFound', () => {
  it('checks only lore-counting entries', () => {
    const s = wonState('relaxed', 1000);
    expect(allLoreFound(s, miniWorld)).toBe(true); // j_start unlocked on entry
    const none = { ...s, journal: [] };
    expect(allLoreFound(none, miniWorld)).toBe(false);
  });
});
