import { useState } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';

type AccusationDef = Extract<PuzzleDef, { type: 'accusation' }>;

/**
 * The finale of a mystery: name the who, the how, and the where. Three
 * labeled columns of options; the accusation can only be made whole.
 */
export function AccusationPuzzle({
  def,
  onSubmit,
}: {
  def: AccusationDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const complete = def.categories.every((c) => choices[c.id] !== undefined);

  return (
    <div className="puzzle-body">
      <div className="accusation-columns">
        {def.categories.map((cat) => (
          <fieldset key={cat.id} className="accusation-category">
            <legend>{cat.label}</legend>
            {cat.options.map((opt) => {
              const selected = choices[cat.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`accusation-option${selected ? ' accusation-option--chosen' : ''}`}
                  aria-pressed={selected}
                  onClick={() =>
                    setChoices((c) => ({
                      ...c,
                      [cat.id]: selected ? undefined : opt.id,
                    }) as Record<string, string>)
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </fieldset>
        ))}
      </div>
      <button
        className="btn accusation-submit"
        disabled={!complete}
        onClick={() =>
          onSubmit({
            type: 'accusation',
            choices: def.categories.map((c) => choices[c.id]),
          })
        }
      >
        Make the accusation
      </button>
    </div>
  );
}
