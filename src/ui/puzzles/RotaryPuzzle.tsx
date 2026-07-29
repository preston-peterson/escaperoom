import { useState } from 'react';
import type { PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';

type RotaryDef = Extract<PuzzleDef, { type: 'rotary' }>;

/** Concentric rings rendered as SVG; click a ring to advance it one notch. */
export function RotaryPuzzle({
  def,
  onSubmit,
}: {
  def: RotaryDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const [positions, setPositions] = useState<number[]>(() => def.rings.map(() => 0));
  const size = 340;
  const c = size / 2;
  const ringWidth = (c - 40) / def.rings.length;

  const advance = (ring: number) => {
    setPositions((p) =>
      p.map((v, i) => (i === ring ? (v + 1) % def.rings[i].positions : v)),
    );
  };

  return (
    <div className="puzzle-body">
      <svg viewBox={`0 0 ${size} ${size}`} className="rotary-svg" role="group" aria-label="Rotating rings">
        {def.rings.map((ring, i) => {
          const rOuter = c - 12 - i * ringWidth;
          const angle = (positions[i] / ring.positions) * 360;
          return (
            <g key={ring.id}>
              <circle
                cx={c}
                cy={c}
                r={rOuter}
                fill="var(--panel)"
                stroke="var(--panel-edge)"
                strokeWidth={2}
                role="button"
                tabIndex={0}
                aria-label={`Turn ring ${i + 1} (position ${positions[i] + 1} of ${ring.positions})`}
                style={{ cursor: 'pointer' }}
                onClick={() => advance(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    advance(i);
                  }
                }}
              />
              <g
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: `${c}px ${c}px`,
                  transition: 'transform 0.35s ease',
                }}
                pointerEvents="none"
              >
                {ring.glyphs.map((glyph, gi) => {
                  const a = (gi / ring.positions) * Math.PI * 2 - Math.PI / 2;
                  const rr = rOuter - ringWidth * 0.42;
                  return (
                    <text
                      key={gi}
                      x={c + Math.cos(a) * rr}
                      y={c + Math.sin(a) * rr + 7}
                      textAnchor="middle"
                      fontSize={20}
                      fill={glyph === '·' ? 'var(--ink-faint)' : 'var(--amber-bright)'}
                      fontFamily="var(--font-display)"
                    >
                      {glyph}
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}
        {/* alignment marker at top */}
        <path
          d={`M ${c - 10} 4 L ${c + 10} 4 L ${c} 22 Z`}
          fill="var(--amber)"
        />
        <circle cx={c} cy={c} r={c - 12 - def.rings.length * ringWidth} fill="var(--bg-raised)" stroke="var(--panel-edge)" />
      </svg>
      <button
        className="btn btn--primary"
        onClick={() => onSubmit({ type: 'rotary', positions })}
      >
        Set the rings
      </button>
    </div>
  );
}
