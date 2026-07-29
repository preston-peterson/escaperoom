import { useState } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';

type SequenceDef = Extract<PuzzleDef, { type: 'sequence' }>;

/**
 * Press elements in order. With resetOnError, a wrong press clears progress
 * immediately (and submits the wrong prefix so the attempt is counted);
 * otherwise the full sequence submits when its length matches the answer.
 */
export function SequencePuzzle({
  def,
  onSubmit,
}: {
  def: SequenceDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const [pressed, setPressed] = useState<string[]>([]);

  const press = (id: string) => {
    const next = [...pressed, id];
    if (def.resetOnError) {
      const idx = next.length - 1;
      if (def.answer[idx] !== id) {
        onSubmit({ type: 'sequence', order: next });
        setPressed([]);
        return;
      }
    }
    if (next.length >= def.answer.length) {
      onSubmit({ type: 'sequence', order: next });
      setPressed([]);
      return;
    }
    setPressed(next);
  };

  return (
    <div className="puzzle-body">
      <div className="seq-progress" aria-live="polite">
        {def.answer.map((_, i) => (
          <span key={i} className={`seq-dot${i < pressed.length ? ' seq-dot--lit' : ''}`} />
        ))}
      </div>
      <div className="seq-elements">
        {def.elements.map((el) => (
          <button
            key={el.id}
            className={`seq-el${pressed.includes(el.id) ? ' seq-el--pressed' : ''}`}
            onClick={() => press(el.id)}
          >
            {el.label}
          </button>
        ))}
      </div>
      {pressed.length > 0 && (
        <button className="btn" onClick={() => setPressed([])}>
          Start over
        </button>
      )}
    </div>
  );
}
