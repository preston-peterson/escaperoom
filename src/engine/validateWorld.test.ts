import { describe, expect, it } from 'vitest';
import type { PuzzleDef, WorldDef } from './types.ts';
import { validateWorld } from './validateWorld.ts';
import { miniWorld } from './__fixtures__/miniWorld.ts';

const accusation: PuzzleDef = {
  id: 'pz_accuse',
  type: 'accusation',
  title: 'The Accusation',
  prompt: 'Name them.',
  hints: ['a', 'b', 'c'],
  onSolve: [],
  categories: [
    {
      id: 'who',
      label: 'The Accused',
      options: [
        { id: 'w1', label: 'Marla Quist' },
        { id: 'w2', label: 'Ferd Ollen' },
        { id: 'w3', label: 'Sela Brant' },
      ],
    },
    {
      id: 'how',
      label: 'The Means',
      options: [
        { id: 'h1', label: 'the candlestick' },
        { id: 'h2', label: 'the cord' },
        { id: 'h3', label: 'the vial' },
      ],
    },
  ],
  answer: ['w2', 'h3'],
  wrongFeedback: 'No.',
};

/** miniWorld + an accusation whose answers are named in the journal. */
function mysteryWorld(mutate?: (p: PuzzleDef & { type: 'accusation' }) => void): WorldDef {
  const puzzle = structuredClone(accusation) as PuzzleDef & { type: 'accusation' };
  mutate?.(puzzle);
  return {
    ...miniWorld,
    puzzles: { ...miniWorld.puzzles, pz_accuse: puzzle },
    journal: {
      ...miniWorld.journal,
      j_dossier: {
        id: 'j_dossier',
        title: 'Dossier: Ferd Ollen',
        body: 'He was seen carrying the vial at dusk.',
        category: 'suspect',
      },
    },
  };
}

describe('validateWorld: accusation checks', () => {
  it('accepts a well-formed, journal-grounded accusation', () => {
    expect(validateWorld(mysteryWorld())).toEqual([]);
  });

  it('rejects answers that are not options', () => {
    const errs = validateWorld(mysteryWorld((p) => void (p.answer = ['w2', 'nope'])));
    expect(errs.some((e) => e.includes('not an option'))).toBe(true);
  });

  it('rejects answer/category arity mismatch', () => {
    const errs = validateWorld(mysteryWorld((p) => void (p.answer = ['w2'])));
    expect(errs.some((e) => e.includes('answer length'))).toBe(true);
  });

  it('rejects categories with fewer than 3 options or duplicate ids', () => {
    const few = validateWorld(
      mysteryWorld((p) => void (p.categories[1].options = p.categories[1].options.slice(0, 2))),
    );
    expect(few.some((e) => e.includes('>= 3 options'))).toBe(true);
    const dup = validateWorld(
      mysteryWorld((p) => void (p.categories[0].options[2] = { id: 'w1', label: 'Twin' })),
    );
    expect(dup.some((e) => e.includes('duplicate option id'))).toBe(true);
  });

  it('rejects an accusation answer no journal entry ever names', () => {
    const errs = validateWorld(
      mysteryWorld((p) => {
        p.categories[1].options[2] = { id: 'h3', label: 'the unspoken thing' };
      }),
    );
    expect(errs.some((e) => e.includes('appears in no journal entry'))).toBe(true);
  });

  it('rejects puzzleFirstTry achievements that reference missing puzzles', () => {
    const world: WorldDef = {
      ...mysteryWorld(),
      achievements: [
        ...miniWorld.achievements,
        {
          id: 'a_first',
          title: 'First',
          description: 'd',
          check: 'puzzleFirstTry',
          puzzle: 'pz_missing',
        },
      ],
    };
    expect(validateWorld(world).some((e) => e.includes('missing puzzle pz_missing'))).toBe(true);
  });
});
