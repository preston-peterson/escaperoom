import type { PuzzleDef, PuzzleSubmission, ValidationResult } from '../types.ts';

/** Lowercase, trim, collapse whitespace, strip punctuation for cipher answers. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function arraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Pure validation of a submission against a puzzle definition. */
export function validate(def: PuzzleDef, sub: PuzzleSubmission): ValidationResult {
  if (def.type !== sub.type) {
    return { correct: false, feedback: 'Nothing happens.' };
  }
  switch (def.type) {
    case 'combination': {
      const values = (sub as { values: string[] }).values;
      if (values.length !== def.slots) return { correct: false };
      return { correct: arraysEqual(values, def.answer) };
    }
    case 'cipher': {
      const text = normalizeAnswer((sub as { text: string }).text);
      if (text.length === 0) return { correct: false, feedback: 'Silence.' };
      const accepted = [def.answer, ...(def.accept ?? [])].map(normalizeAnswer);
      return { correct: accepted.includes(text) };
    }
    case 'sequence': {
      const order = (sub as { order: string[] }).order;
      return { correct: arraysEqual(order, def.answer) };
    }
    case 'rotary': {
      const positions = (sub as { positions: number[] }).positions;
      if (positions.length !== def.rings.length) return { correct: false };
      const normalized = positions.map((p, i) => {
        const n = def.rings[i].positions;
        return ((p % n) + n) % n;
      });
      return { correct: arraysEqual(normalized, def.answer) };
    }
    case 'itemPlacement': {
      const placements = (sub as { placements: Record<string, string> }).placements;
      const allFilled = def.sockets.every((s) => placements[s.id] === s.accepts);
      return { correct: allFilled };
    }
    case 'accusation': {
      const choices = (sub as { choices: string[] }).choices;
      if (choices.length !== def.categories.length) return { correct: false };
      if (arraysEqual(choices, def.answer)) return { correct: true };
      // One fixed rebuke for every wrong triple — no per-slot hints to farm.
      return { correct: false, feedback: def.wrongFeedback };
    }
  }
}

/**
 * How far a sequence submission got before diverging — used by the sequence
 * UI for resetOnError behavior. Returns the length of the matching prefix.
 */
export function sequencePrefixLength(answer: readonly string[], order: readonly string[]): number {
  let i = 0;
  while (i < order.length && i < answer.length && order[i] === answer[i]) i++;
  return i;
}
