import type { ComponentType } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';
import { CombinationPuzzle } from './CombinationPuzzle.tsx';
import { CipherPuzzle } from './CipherPuzzle.tsx';
import { SequencePuzzle } from './SequencePuzzle.tsx';
import { RotaryPuzzle } from './RotaryPuzzle.tsx';
import { ItemPlacementPuzzle } from './ItemPlacementPuzzle.tsx';
import { AccusationPuzzle } from './AccusationPuzzle.tsx';

export interface PuzzleUiProps<T extends PuzzleDef['type'] = PuzzleDef['type']> {
  def: Extract<PuzzleDef, { type: T }>;
  onSubmit: (sub: PuzzleSubmission) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const puzzleUiRegistry: Record<PuzzleDef['type'], ComponentType<any>> = {
  combination: CombinationPuzzle,
  cipher: CipherPuzzle,
  sequence: SequencePuzzle,
  rotary: RotaryPuzzle,
  itemPlacement: ItemPlacementPuzzle,
  accusation: AccusationPuzzle,
};
