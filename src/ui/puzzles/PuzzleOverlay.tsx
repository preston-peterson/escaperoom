import { useEffect, useRef, useState } from 'react';
import type { PuzzleId, PuzzleSubmission } from '../../engine/types.ts';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { condHolds } from '../../engine/state/conditions.ts';
import { puzzleUiRegistry } from './uiRegistry.ts';
import { HintPanel } from '../hud/HintPanel.tsx';

/** Shared chrome around every puzzle type: prompt, hints, feedback, close. */
export function PuzzleOverlay({ puzzle }: { puzzle: PuzzleId }) {
  const world = useGameStore((s) => s.world);
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeOverlay = useUiStore((s) => s.closeOverlay);
  const [shaking, setShaking] = useState(false);
  const prevAttempts = useRef<number | null>(null);

  const def = world?.puzzles[puzzle];
  const ps = state?.puzzles[puzzle];

  // Shake on failed attempts; close shortly after solving.
  useEffect(() => {
    if (!ps) return;
    if (prevAttempts.current !== null && ps.attempts > prevAttempts.current) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 450);
      prevAttempts.current = ps.attempts;
      return () => clearTimeout(t);
    }
    prevAttempts.current = ps.attempts;
  }, [ps]);

  useEffect(() => {
    if (ps?.solved) {
      const t = setTimeout(closeOverlay, 1100);
      return () => clearTimeout(t);
    }
  }, [ps?.solved, closeOverlay]);

  if (!def || !ps || !state || !world) return null;

  const locked = !condHolds(def.if, state);
  const Ui = puzzleUiRegistry[def.type];
  const onSubmit = (sub: PuzzleSubmission) =>
    dispatch({ type: 'SUBMIT_PUZZLE', puzzle, submission: sub, at: Date.now() });

  return (
    <div className="overlay-backdrop" onClick={closeOverlay}>
      <div
        className={`overlay-panel panel${shaking ? ' shake' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={def.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={closeOverlay} aria-label="Step back">
          ✕
        </button>
        <h2>{def.title}</h2>
        {ps.solved ? (
          <p className="puzzle-solved">The mechanism yields.</p>
        ) : locked ? (
          <p className="puzzle-prompt">{def.lockedText ?? 'Something is missing.'}</p>
        ) : (
          <>
            <p className="puzzle-prompt">{def.prompt}</p>
            <Ui def={def} onSubmit={onSubmit} />
            {ps.attempts > 0 && (
              <p className="puzzle-attempts">
                {ps.attempts} failed {ps.attempts === 1 ? 'attempt' : 'attempts'}
              </p>
            )}
            <HintPanel def={def} />
          </>
        )}
      </div>
    </div>
  );
}
