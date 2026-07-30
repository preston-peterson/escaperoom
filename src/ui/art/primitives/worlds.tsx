/**
 * Primitives for the island, tower, and dream worlds. Same contract as the
 * rest: draw into a [0,0,w,h] box placed by the scene layer's x/y.
 */
import { useId } from 'react';
import { mulberry32, num, bool } from '../rand.ts';
import type { ArtProps } from './structure.tsx';

/** Open water to the horizon. Box: w×h (default 1600×320). */
export function Sea({ props }: ArtProps) {
  const w = num(props, 'w', 1600);
  const h = num(props, 'h', 320);
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--p-water)" stopOpacity={0.5} />
          <stop offset="100%" stopColor="var(--p-water)" stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id}-sea)`} />
      {[0.18, 0.42, 0.68].map((t, i) => (
        <path
          key={t}
          d={`M -80 ${h * t} q ${w * 0.08} ${-10 - i * 4} ${w * 0.16} 0 t ${w * 0.16} 0 t ${w * 0.16} 0 t ${w * 0.16} 0 t ${w * 0.16} 0 t ${w * 0.16} 0 t ${w * 0.16} 0`}
          fill="none"
          stroke="var(--p-fog)"
          strokeWidth={2.5 - i * 0.5}
          opacity={0.35 - i * 0.08}
          style={{ animation: `fogDrift ${16 + i * 9}s ease-in-out infinite alternate${i % 2 ? '-reverse' : ''}` }}
        />
      ))}
      <rect width={w} height={4} fill="var(--p-fog)" opacity={0.3} />
    </g>
  );
}

/** Windswept tree silhouette. Box: ~w×h (default 260×380). bare=true for dead branches. */
export function Tree({ props }: ArtProps) {
  const h = num(props, 'h', 380);
  const seed = num(props, 'seed', 1);
  const bare = bool(props, 'bare', false);
  const rnd = mulberry32(seed);
  const lean = 18 + rnd() * 14; // wind from the sea
  const trunkTopX = 130 + lean;
  const blobs = [];
  if (!bare) {
    for (let i = 0; i < 5; i++) {
      blobs.push(
        <ellipse
          key={i}
          cx={trunkTopX + 20 + rnd() * 70 - 20}
          cy={h * 0.22 + rnd() * h * 0.16}
          rx={45 + rnd() * 40}
          ry={26 + rnd() * 18}
          fill="var(--p-wall-mid)"
          opacity={0.85 + rnd() * 0.15}
        />,
      );
    }
  }
  return (
    <g>
      <path
        d={`M 118 ${h} C 122 ${h * 0.7} ${118 + lean * 0.4} ${h * 0.5} ${trunkTopX} ${h * 0.3}
           M ${124 + lean * 0.5} ${h * 0.55} q 30 -14 52 -6
           M ${120 + lean * 0.3} ${h * 0.42} q -26 -18 -40 -14`}
        fill="none"
        stroke="var(--p-wall-dark)"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {bare
        ? [0.32, 0.38, 0.46].map((t, i) => (
            <path
              key={i}
              d={`M ${trunkTopX - 6 + i * 8} ${h * t} q ${24 + i * 10} ${-30 - i * 6} ${58 + i * 14} ${-34 - i * 8}`}
              fill="none"
              stroke="var(--p-wall-dark)"
              strokeWidth={6 - i}
              strokeLinecap="round"
            />
          ))
        : blobs}
    </g>
  );
}

/** Great clock dial. Box: 2r×2r (default r=160). hourAngle/minuteAngle in degrees from 12. */
export function ClockFace({ props }: ArtProps) {
  const r = num(props, 'r', 160);
  const hourAngle = num(props, 'hourAngle', 300);
  const minuteAngle = num(props, 'minuteAngle', 90);
  const glow = bool(props, 'glow', false);
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const big = i % 3 === 0;
    ticks.push(
      <line
        key={i}
        x1={r + Math.cos(a) * r * 0.82}
        y1={r + Math.sin(a) * r * 0.82}
        x2={r + Math.cos(a) * r * (big ? 0.66 : 0.74)}
        y2={r + Math.sin(a) * r * (big ? 0.66 : 0.74)}
        stroke={glow ? 'var(--p-glow)' : 'var(--p-accent)'}
        strokeWidth={big ? 7 : 3.5}
        opacity={0.9}
      />,
    );
  }
  return (
    <g>
      <circle cx={r} cy={r} r={r} fill="var(--p-wall-dark)" stroke="var(--p-accent)" strokeWidth={r * 0.06} />
      <circle cx={r} cy={r} r={r * 0.9} fill="none" stroke="var(--p-wall-mid)" strokeWidth={2} />
      {ticks}
      <line
        x1={r}
        y1={r}
        x2={r + Math.cos(((hourAngle - 90) * Math.PI) / 180) * r * 0.42}
        y2={r + Math.sin(((hourAngle - 90) * Math.PI) / 180) * r * 0.42}
        stroke="var(--p-accent)"
        strokeWidth={r * 0.055}
        strokeLinecap="round"
      />
      <line
        x1={r}
        y1={r}
        x2={r + Math.cos(((minuteAngle - 90) * Math.PI) / 180) * r * 0.62}
        y2={r + Math.sin(((minuteAngle - 90) * Math.PI) / 180) * r * 0.62}
        stroke={glow ? 'var(--p-glow)' : 'var(--p-accent)'}
        strokeWidth={r * 0.035}
        strokeLinecap="round"
      />
      <circle cx={r} cy={r} r={r * 0.07} fill="var(--p-accent)" />
    </g>
  );
}

/** Run of brass pipes with joints and a valve wheel. Box: w×h (default 520×220). */
export function Pipes({ props }: ArtProps) {
  const w = num(props, 'w', 520);
  const h = num(props, 'h', 220);
  const seed = num(props, 'seed', 7);
  const rnd = mulberry32(seed);
  const y1 = h * 0.3;
  const y2 = h * 0.62;
  const drop = w * (0.55 + rnd() * 0.2);
  const valveX = w * (0.2 + rnd() * 0.25);
  return (
    <g>
      <rect x={0} y={y1 - 11} width={w} height={22} rx={11} fill="var(--p-accent)" opacity={0.85} />
      <rect x={0} y={y2 - 8} width={drop + 8} height={16} rx={8} fill="var(--p-accent)" opacity={0.65} />
      <rect x={drop - 8} y={y2} width={16} height={h - y2} rx={8} fill="var(--p-accent)" opacity={0.65} />
      {[0.12, 0.48, 0.85].map((t) => (
        <rect key={t} x={w * t - 8} y={y1 - 16} width={16} height={32} rx={4} fill="var(--p-wall-light)" />
      ))}
      {/* valve wheel */}
      <circle cx={valveX} cy={y1} r={26} fill="none" stroke="var(--p-glow)" strokeWidth={6} opacity={0.9} />
      {[0, 60, 120].map((a) => (
        <line
          key={a}
          x1={valveX - Math.cos((a * Math.PI) / 180) * 26}
          y1={y1 - Math.sin((a * Math.PI) / 180) * 26}
          x2={valveX + Math.cos((a * Math.PI) / 180) * 26}
          y2={y1 + Math.sin((a * Math.PI) / 180) * 26}
          stroke="var(--p-glow)"
          strokeWidth={4}
          opacity={0.9}
        />
      ))}
    </g>
  );
}

/** Floating island fragment, gently bobbing. Box: w×(w*0.8) (default 300 wide). */
export function FloatingIsle({ props }: ArtProps) {
  const w = num(props, 'w', 300);
  const seed = num(props, 'seed', 3);
  const rnd = mulberry32(seed);
  const h = w * 0.8;
  const topY = h * 0.3;
  return (
    <g style={{ animation: `bob ${7 + (seed % 5)}s ease-in-out infinite` }}>
      <path
        d={`M ${w * 0.06} ${topY} L ${w * 0.94} ${topY}
           L ${w * (0.6 + rnd() * 0.15)} ${h * 0.92} L ${w * (0.3 + rnd() * 0.15)} ${h * 0.78} Z`}
        fill="var(--p-wall-mid)"
      />
      <path
        d={`M ${w * 0.06} ${topY} L ${w * 0.94} ${topY} L ${w * 0.88} ${topY + h * 0.1} L ${w * 0.1} ${topY + h * 0.1} Z`}
        fill="var(--p-wall-light)"
        opacity={0.8}
      />
      <ellipse cx={w * 0.5} cy={topY} rx={w * 0.46} ry={h * 0.07} fill="var(--p-accent)" opacity={0.5} />
      {[0.25, 0.55, 0.75].map((t) => (
        <circle key={t} cx={w * t} cy={topY - 6 - rnd() * 10} r={3 + rnd() * 4} fill="var(--p-glow)" opacity={0.5} />
      ))}
    </g>
  );
}

/** Glowing dream-portal. Box: 2r×2.6r (default r=140). open=false shows it dark. */
export function Portal({ props }: ArtProps) {
  const r = num(props, 'r', 140);
  const open = bool(props, 'open', true);
  const id = useId();
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-void`}>
          <stop offset="0%" stopColor={open ? 'var(--p-glow)' : 'var(--p-sky-top)'} stopOpacity={open ? 0.35 : 0.9} />
          <stop offset="70%" stopColor="var(--p-sky-top)" stopOpacity={0.95} />
          <stop offset="100%" stopColor="var(--p-sky-top)" stopOpacity={1} />
        </radialGradient>
      </defs>
      <ellipse cx={r} cy={r * 1.3} rx={r * 0.72} ry={r * 1.12} fill={`url(#${id}-void)`} />
      <ellipse
        cx={r}
        cy={r * 1.3}
        rx={r * 0.72}
        ry={r * 1.12}
        fill="none"
        stroke={open ? 'var(--p-glow)' : 'var(--p-accent)'}
        strokeWidth={7}
        opacity={open ? 0.95 : 0.5}
        style={
          open
            ? {
                animation: 'glintPulse 4s ease-in-out infinite',
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }
            : undefined
        }
      />
      <ellipse cx={r} cy={r * 1.3} rx={r * 0.86} ry={r * 1.26} fill="none" stroke={open ? 'var(--p-glow)' : 'var(--p-accent)'} strokeWidth={2} opacity={0.35} />
    </g>
  );
}
