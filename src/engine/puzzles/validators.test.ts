import { describe, expect, it } from 'vitest';
import type { PuzzleDef } from '../types.ts';
import { normalizeAnswer, sequencePrefixLength, validate } from './validators.ts';

const base = {
  title: 't',
  prompt: 'p',
  hints: ['a', 'b', 'c'] as [string, string, string],
  onSolve: [],
};

describe('normalizeAnswer', () => {
  it('lowercases, trims, collapses whitespace, strips punctuation', () => {
    expect(normalizeAnswer('  The   EMBER!  ')).toBe('the ember');
    expect(normalizeAnswer("what's this?")).toBe('whats this');
  });
});

describe('combination', () => {
  const def: PuzzleDef = {
    ...base,
    id: 'c',
    type: 'combination',
    slots: 3,
    symbols: ['a', 'b', 'c'],
    answer: ['a', 'c', 'b'],
  };
  it('accepts the right combination', () => {
    expect(validate(def, { type: 'combination', values: ['a', 'c', 'b'] }).correct).toBe(true);
  });
  it('rejects wrong order and wrong length', () => {
    expect(validate(def, { type: 'combination', values: ['a', 'b', 'c'] }).correct).toBe(false);
    expect(validate(def, { type: 'combination', values: ['a', 'c'] }).correct).toBe(false);
  });
  it('rejects a mismatched submission type', () => {
    expect(validate(def, { type: 'cipher', text: 'acb' }).correct).toBe(false);
  });
});

describe('cipher', () => {
  const def: PuzzleDef = {
    ...base,
    id: 'ci',
    type: 'cipher',
    answer: 'ember',
    accept: ['the ember'],
  };
  it('normalizes case, punctuation, and whitespace', () => {
    expect(validate(def, { type: 'cipher', text: '  EMBER. ' }).correct).toBe(true);
    expect(validate(def, { type: 'cipher', text: 'The  Ember' }).correct).toBe(true);
  });
  it('rejects other words and empty input', () => {
    expect(validate(def, { type: 'cipher', text: 'fire' }).correct).toBe(false);
    expect(validate(def, { type: 'cipher', text: '  ' }).correct).toBe(false);
  });
});

describe('sequence', () => {
  const def: PuzzleDef = {
    ...base,
    id: 's',
    type: 'sequence',
    elements: [
      { id: 'x', label: 'X' },
      { id: 'y', label: 'Y' },
    ],
    answer: ['x', 'x', 'y'],
    resetOnError: true,
  };
  it('accepts the exact sequence (repeats allowed)', () => {
    expect(validate(def, { type: 'sequence', order: ['x', 'x', 'y'] }).correct).toBe(true);
  });
  it('rejects divergent sequences', () => {
    expect(validate(def, { type: 'sequence', order: ['x', 'y', 'y'] }).correct).toBe(false);
  });
  it('sequencePrefixLength finds the matching prefix', () => {
    expect(sequencePrefixLength(['x', 'x', 'y'], ['x', 'y'])).toBe(1);
    expect(sequencePrefixLength(['x', 'x', 'y'], ['x', 'x', 'y'])).toBe(3);
  });
});

describe('rotary', () => {
  const def: PuzzleDef = {
    ...base,
    id: 'r',
    type: 'rotary',
    rings: [
      { id: 'r1', positions: 6, glyphs: ['a', 'b', 'c', 'd', 'e', 'f'] },
      { id: 'r2', positions: 4, glyphs: ['a', 'b', 'c', 'd'] },
    ],
    answer: [4, 1],
  };
  it('accepts correct positions and normalizes modulo ring size', () => {
    expect(validate(def, { type: 'rotary', positions: [4, 1] }).correct).toBe(true);
    expect(validate(def, { type: 'rotary', positions: [10, 5] }).correct).toBe(true);
  });
  it('rejects wrong positions and wrong arity', () => {
    expect(validate(def, { type: 'rotary', positions: [4, 2] }).correct).toBe(false);
    expect(validate(def, { type: 'rotary', positions: [4] }).correct).toBe(false);
  });
});

describe('itemPlacement', () => {
  const def: PuzzleDef = {
    ...base,
    id: 'ip',
    type: 'itemPlacement',
    sockets: [
      { id: 's1', label: 'S1', accepts: 'gem' },
      { id: 's2', label: 'S2', accepts: 'rod' },
    ],
  };
  it('accepts only the full correct placement', () => {
    expect(
      validate(def, { type: 'itemPlacement', placements: { s1: 'gem', s2: 'rod' } }).correct,
    ).toBe(true);
    expect(
      validate(def, { type: 'itemPlacement', placements: { s1: 'rod', s2: 'gem' } }).correct,
    ).toBe(false);
    expect(validate(def, { type: 'itemPlacement', placements: { s1: 'gem' } }).correct).toBe(false);
  });
});
