import { describe, expect, it } from 'vitest';
import type { GameState } from '../types.ts';
import { evalCondition } from './conditions.ts';

const state = {
  flags: { lit: true },
  puzzles: { p1: { solved: true, hintsUsed: 0, attempts: 0 } },
  inventory: ['rope'],
  visitedRooms: { foyer: true },
} as unknown as GameState;

describe('evalCondition', () => {
  it('evaluates leaf conditions', () => {
    expect(evalCondition({ flag: 'lit' }, state)).toBe(true);
    expect(evalCondition({ flag: 'unlit' }, state)).toBe(false);
    expect(evalCondition({ solved: 'p1' }, state)).toBe(true);
    expect(evalCondition({ solved: 'p2' }, state)).toBe(false);
    expect(evalCondition({ hasItem: 'rope' }, state)).toBe(true);
    expect(evalCondition({ hasItem: 'gem' }, state)).toBe(false);
    expect(evalCondition({ visited: 'foyer' }, state)).toBe(true);
    expect(evalCondition({ visited: 'attic' }, state)).toBe(false);
  });

  it('evaluates nested boolean combinators', () => {
    expect(evalCondition({ not: { flag: 'unlit' } }, state)).toBe(true);
    expect(
      evalCondition({ all: [{ flag: 'lit' }, { hasItem: 'rope' }] }, state),
    ).toBe(true);
    expect(
      evalCondition({ all: [{ flag: 'lit' }, { hasItem: 'gem' }] }, state),
    ).toBe(false);
    expect(
      evalCondition({ any: [{ flag: 'unlit' }, { visited: 'foyer' }] }, state),
    ).toBe(true);
    expect(
      evalCondition(
        { not: { any: [{ hasItem: 'gem' }, { all: [{ flag: 'lit' }, { solved: 'p2' }] }] } },
        state,
      ),
    ).toBe(true);
  });
});
