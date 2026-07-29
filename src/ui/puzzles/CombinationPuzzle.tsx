import { useState } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';

type CombinationDef = Extract<PuzzleDef, { type: 'combination' }>;

/** Dial-per-slot combination entry: click a dial to cycle its symbol. */
export function CombinationPuzzle({
  def,
  onSubmit,
}: {
  def: CombinationDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const [values, setValues] = useState<number[]>(() => Array(def.slots).fill(0));

  const cycle = (slot: number, dir: 1 | -1) => {
    setValues((v) =>
      v.map((x, i) =>
        i === slot ? (x + dir + def.symbols.length) % def.symbols.length : x,
      ),
    );
  };

  return (
    <div className="puzzle-body">
      <div className="combo-dials">
        {values.map((v, i) => (
          <div key={i} className="combo-dial">
            <button
              aria-label={`Dial ${i + 1} up`}
              className="combo-arrow"
              onClick={() => cycle(i, 1)}
            >
              ▲
            </button>
            <div className="combo-symbol" aria-live="polite">
              {def.symbols[v]}
            </div>
            <button
              aria-label={`Dial ${i + 1} down`}
              className="combo-arrow"
              onClick={() => cycle(i, -1)}
            >
              ▼
            </button>
          </div>
        ))}
      </div>
      <button
        className="btn btn--primary"
        onClick={() =>
          onSubmit({ type: 'combination', values: values.map((v) => def.symbols[v]) })
        }
      >
        Turn the mechanism
      </button>
    </div>
  );
}
