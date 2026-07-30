/** Light sources: torch, brazier, glint. Boxes anchor top-left like all primitives. */
import { useId } from 'react';
import { num, bool } from '../rand.ts';
import type { ArtProps } from './structure.tsx';

function Flame({
  cx,
  baseY,
  size,
  seed,
}: {
  cx: number;
  baseY: number;
  size: number;
  seed: number;
}) {
  const id = useId();
  const dur = 3.2 + (seed % 5) * 0.45;
  const delay = -(seed % 7) * 0.6;
  return (
    <g style={{ animation: `flicker ${dur}s infinite`, animationDelay: `${delay}s` }}>
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0%" stopColor="var(--p-glow)" stopOpacity={0.5} />
          <stop offset="45%" stopColor="var(--p-glow)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--p-glow)" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={baseY - size * 0.5} r={size * 3.2} fill={`url(#${id}-halo)`} />
      <path
        d={`M ${cx} ${baseY - size * 1.5}
          C ${cx + size * 0.55} ${baseY - size * 0.9} ${cx + size * 0.45} ${baseY - size * 0.25} ${cx} ${baseY}
          C ${cx - size * 0.45} ${baseY - size * 0.25} ${cx - size * 0.55} ${baseY - size * 0.9} ${cx} ${baseY - size * 1.5} Z`}
        fill="var(--p-glow)"
        opacity={0.85}
      />
      <path
        d={`M ${cx} ${baseY - size * 0.95}
          C ${cx + size * 0.3} ${baseY - size * 0.55} ${cx + size * 0.26} ${baseY - size * 0.15} ${cx} ${baseY}
          C ${cx - size * 0.26} ${baseY - size * 0.15} ${cx - size * 0.3} ${baseY - size * 0.55} ${cx} ${baseY - size * 0.95} Z`}
        fill="#f8e3a8"
        opacity={0.9}
      />
    </g>
  );
}

/** Wall torch. Box: 80×260. */
export function Torch({ props }: ArtProps) {
  const lit = bool(props, 'lit', true);
  const seed = num(props, 'seed', 1);
  return (
    <g>
      {/* bracket */}
      <path d="M 28 200 L 52 200 L 46 252 L 34 252 Z" fill="var(--p-wall-light)" />
      {/* stave */}
      <rect x={35} y={96} width={10} height={112} rx={4} fill="var(--p-accent)" opacity={0.8} />
      {/* wrapped head */}
      <rect x={30} y={78} width={20} height={26} rx={6} fill="var(--p-wall-dark)" />
      {lit && <Flame cx={40} baseY={82} size={34} seed={seed} />}
    </g>
  );
}

/** Standing fire bowl. Box: 220×280. */
export function Brazier({ props }: ArtProps) {
  const lit = bool(props, 'lit', true);
  const seed = num(props, 'seed', 3);
  return (
    <g>
      <ellipse cx={110} cy={150} rx={92} ry={26} fill="var(--p-wall-dark)" />
      <path d="M 18 150 Q 110 216 202 150 L 188 132 Q 110 178 32 132 Z" fill="var(--p-wall-mid)" />
      <path d="M 30 132 Q 110 176 190 132 L 190 148 Q 110 196 30 148 Z" fill="var(--p-wall-light)" opacity={0.5} />
      {/* legs */}
      <path d="M 52 168 L 34 262 L 50 262 L 66 176 Z" fill="var(--p-wall-mid)" />
      <path d="M 168 168 L 186 262 L 170 262 L 154 176 Z" fill="var(--p-wall-mid)" />
      <path d="M 104 178 L 104 266 L 118 266 L 118 178 Z" fill="var(--p-wall-dark)" />
      {lit && <Flame cx={110} baseY={140} size={44} seed={seed} />}
    </g>
  );
}

/** Secret sparkle. Box: 40×40, centered at (20,20). */
export function Glint({ props }: ArtProps) {
  const r = num(props, 'r', 9);
  return (
    <g
      style={{
        animation: 'glintPulse 2.6s ease-in-out infinite',
        transformBox: 'fill-box',
        transformOrigin: 'center',
      }}
    >
      <path
        d={`M 20 ${20 - r * 1.8} L ${20 + r * 0.4} ${20 - r * 0.4} L ${20 + r * 1.8} 20
          L ${20 + r * 0.4} ${20 + r * 0.4} L 20 ${20 + r * 1.8} L ${20 - r * 0.4} ${20 + r * 0.4}
          L ${20 - r * 1.8} 20 L ${20 - r * 0.4} ${20 - r * 0.4} Z`}
        fill="var(--p-glow)"
      />
      <circle cx={20} cy={20} r={r * 0.45} fill="#fff6dd" />
    </g>
  );
}
