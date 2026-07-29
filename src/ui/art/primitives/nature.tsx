/** Atmosphere primitives: drifting fog, water pools. */
import { useId } from 'react';
import { num } from '../rand.ts';
import type { ArtProps } from './structure.tsx';

/** Drifting fog band. Box: w×h (default 900×180). */
export function Fog({ props }: ArtProps) {
  const w = num(props, 'w', 900);
  const h = num(props, 'h', 180);
  const opacity = num(props, 'opacity', 0.16);
  const speed = num(props, 'speed', 26);
  const id = useId();
  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`${id}-blur`} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation={h * 0.22} />
        </filter>
      </defs>
      <g filter={`url(#${id}-blur)`}>
        <ellipse
          cx={w * 0.3}
          cy={h * 0.55}
          rx={w * 0.32}
          ry={h * 0.4}
          fill="var(--p-fog)"
          style={{ animation: `fogDrift ${speed}s ease-in-out infinite alternate` }}
        />
        <ellipse
          cx={w * 0.62}
          cy={h * 0.4}
          rx={w * 0.28}
          ry={h * 0.34}
          fill="var(--p-fog)"
          style={{ animation: `fogDrift ${speed * 1.4}s ease-in-out infinite alternate-reverse` }}
        />
        <ellipse
          cx={w * 0.8}
          cy={h * 0.62}
          rx={w * 0.24}
          ry={h * 0.3}
          fill="var(--p-fog)"
          style={{ animation: `fogDrift ${speed * 0.8}s ease-in-out infinite alternate` }}
        />
      </g>
    </g>
  );
}

/** Still dark pool with ripples. Box: w×h (default 700×160). */
export function WaterPool({ props }: ArtProps) {
  const w = num(props, 'w', 700);
  const h = num(props, 'h', 160);
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--p-water)" stopOpacity={0.85} />
          <stop offset="100%" stopColor="var(--p-sky-top)" stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={`url(#${id}-water)`} />
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill="none" stroke="var(--p-wall-dark)" strokeWidth={6} opacity={0.8} />
      {[0.72, 0.5, 0.3].map((t, i) => (
        <ellipse
          key={t}
          cx={w / 2}
          cy={h / 2}
          rx={(w / 2) * t}
          ry={(h / 2) * t}
          fill="none"
          stroke="var(--p-glow)"
          strokeWidth={1.5}
          opacity={0.18}
          style={{
            animation: `ripple ${5 + i * 2}s ease-in-out infinite`,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        />
      ))}
      <ellipse cx={w * 0.38} cy={h * 0.4} rx={w * 0.12} ry={h * 0.1} fill="var(--p-glow)" opacity={0.08} />
    </g>
  );
}
