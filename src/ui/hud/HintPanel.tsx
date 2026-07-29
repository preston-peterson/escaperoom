import { useState } from 'react';
import type { PuzzleDef } from '../../engine/types.ts';
import { useGameStore } from '../../engine/state/store.ts';

/**
 * Tiered hints: nudge → hint → solution. Each tier needs a deliberate
 * confirm; revealed tiers persist in game state (and void the no-hint
 * achievement).
 */
export function HintPanel({ def }: { def: PuzzleDef }) {
  const dispatch = useGameStore((s) => s.dispatch);
  const hintsUsed = useGameStore(
    (s) => s.state?.puzzles[def.id]?.hintsUsed ?? 0,
  );
  const [confirming, setConfirming] = useState<1 | 2 | 3 | null>(null);
  const tierNames = ['A nudge', 'A hint', 'The solution'] as const;

  return (
    <details className="hint-panel">
      <summary>Consult the guide's notes</summary>
      <div className="hint-tiers">
        {([1, 2, 3] as const).map((tier) => (
          <div key={tier} className="hint-tier">
            {hintsUsed >= tier ? (
              <p className="hint-text">
                <strong>{tierNames[tier - 1]}:</strong> {def.hints[tier - 1]}
              </p>
            ) : confirming === tier ? (
              <span className="hint-confirm">
                Reveal {tierNames[tier - 1].toLowerCase()}? This is written in ink.
                <button
                  className="btn"
                  onClick={() => {
                    dispatch({ type: 'REVEAL_HINT', puzzle: def.id, tier, at: Date.now() });
                    setConfirming(null);
                  }}
                >
                  Reveal
                </button>
                <button className="btn" onClick={() => setConfirming(null)}>
                  Keep trying
                </button>
              </span>
            ) : (
              <button
                className="btn hint-reveal"
                disabled={hintsUsed < tier - 1}
                onClick={() => setConfirming(tier)}
              >
                {tierNames[tier - 1]}…
              </button>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
