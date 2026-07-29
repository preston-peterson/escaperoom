import { useState } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';

type CipherDef = Extract<PuzzleDef, { type: 'cipher' }>;

/** Free-text answer entry; the validator normalizes case and punctuation. */
export function CipherPuzzle({
  def,
  onSubmit,
}: {
  def: CipherDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    if (text.trim().length > 0) onSubmit({ type: 'cipher', text });
  };
  return (
    <div className="puzzle-body">
      <input
        className="cipher-input"
        type="text"
        value={text}
        placeholder={def.placeholder ?? 'Speak the answer…'}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        aria-label="Cipher answer"
        autoFocus
      />
      <button className="btn btn--primary" onClick={submit}>
        Speak
      </button>
    </div>
  );
}
