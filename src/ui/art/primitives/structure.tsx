/**
 * Structural primitives. Every primitive draws into a [0,0,w,h] box whose
 * top-left is placed by the scene layer's x/y; `scale` multiplies the box.
 */
import { mulberry32, num, bool } from '../rand.ts';

export interface ArtProps {
  props?: Record<string, string | number | boolean>;
}

/** Irregular stone block wall. Box: w×h (default 1600×420). */
export function StoneWall({ props }: ArtProps) {
  const w = num(props, 'w', 1600);
  const h = num(props, 'h', 420);
  const seed = num(props, 'seed', 1);
  const rnd = mulberry32(seed);
  const courses = Math.max(2, Math.round(h / 70));
  const rows = [];
  for (let r = 0; r < courses; r++) {
    const y = (r * h) / courses;
    const rowH = h / courses;
    let x = -rnd() * 120;
    const blocks = [];
    while (x < w) {
      const bw = 90 + rnd() * 140;
      const shade = rnd();
      blocks.push(
        <rect
          key={`${r}-${x.toFixed(0)}`}
          x={x + 3}
          y={y + 3}
          width={bw - 6}
          height={rowH - 6}
          rx={4}
          fill={
            shade > 0.82
              ? 'var(--p-wall-light)'
              : shade > 0.35
                ? 'var(--p-wall-mid)'
                : 'var(--p-wall-dark)'
          }
          opacity={0.55 + rnd() * 0.45}
        />,
      );
      x += bw;
    }
    rows.push(<g key={r}>{blocks}</g>);
  }
  return (
    <g>
      <rect width={w} height={h} fill="var(--p-wall-dark)" />
      {rows}
    </g>
  );
}

/** Arched opening with stone surround. Box: w×h (default 360×520). */
export function Archway({ props }: ArtProps) {
  const w = num(props, 'w', 360);
  const h = num(props, 'h', 520);
  const lit = bool(props, 'lit', false);
  const springY = h * 0.42; // where the arc begins
  const inner = `M ${w * 0.16} ${h}
    L ${w * 0.16} ${springY}
    Q ${w * 0.5} ${h * 0.02} ${w * 0.84} ${springY}
    L ${w * 0.84} ${h} Z`;
  return (
    <g>
      <path
        d={`M 0 ${h} L 0 ${springY - h * 0.06}
          Q ${w * 0.5} ${-h * 0.12} ${w} ${springY - h * 0.06}
          L ${w} ${h} Z`}
        fill="var(--p-wall-mid)"
      />
      <path d={inner} fill="var(--p-sky-top)" />
      {lit && (
        <g opacity={0.12}>
          <path d={inner} fill="var(--p-glow)" style={{ animation: 'flicker 4s infinite' }} />
        </g>
      )}
      {/* voussoir hints */}
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => (
        <line
          key={t}
          x1={w * 0.16 + (w * 0.68) * t}
          y1={springY - (Math.sin(t * Math.PI) * h * 0.34)}
          x2={w * 0.16 + (w * 0.68) * t}
          y2={springY - (Math.sin(t * Math.PI) * h * 0.42)}
          stroke="var(--p-wall-dark)"
          strokeWidth={5}
          opacity={0.7}
        />
      ))}
    </g>
  );
}

/** Column with base and capital. Box: w×h (default 120×620). */
export function Pillar({ props }: ArtProps) {
  const w = num(props, 'w', 120);
  const h = num(props, 'h', 620);
  const capH = h * 0.06;
  const baseH = h * 0.08;
  return (
    <g>
      <rect x={0} y={0} width={w} height={capH} fill="var(--p-wall-light)" rx={3} />
      <rect x={w * 0.12} y={capH} width={w * 0.76} height={h - capH - baseH} fill="var(--p-wall-mid)" />
      <rect x={w * 0.12} y={capH} width={w * 0.2} height={h - capH - baseH} fill="var(--p-wall-light)" opacity={0.25} />
      <rect x={w * 0.6} y={capH} width={w * 0.22} height={h - capH - baseH} fill="var(--p-wall-dark)" opacity={0.5} />
      <line x1={w * 0.4} y1={h * 0.3} x2={w * 0.46} y2={h * 0.55} stroke="var(--p-wall-dark)" strokeWidth={3} opacity={0.6} />
      <rect x={-w * 0.05} y={h - baseH} width={w * 1.1} height={baseH} fill="var(--p-wall-light)" rx={3} />
    </g>
  );
}

/** Stepped stairway silhouette. Box: w×h (default 500×360). dir 'up' rises to the right. */
export function Stairs({ props }: ArtProps) {
  const w = num(props, 'w', 500);
  const h = num(props, 'h', 360);
  const steps = Math.max(3, num(props, 'steps', 7));
  const up = (props?.dir ?? 'up') === 'up';
  const pts: string[] = [up ? `0,${h}` : `0,${h}`];
  for (let i = 0; i < steps; i++) {
    const x1 = (i * w) / steps;
    const x2 = ((i + 1) * w) / steps;
    const y = up ? h - ((i + 1) * h) / steps : (i + 1) * (h / steps);
    if (up) {
      pts.push(`${x1},${y}`, `${x2},${y}`);
    } else {
      pts.push(`${x1},${y}`, `${x2},${y}`);
    }
  }
  pts.push(`${w},${h}`);
  return (
    <g>
      <polygon points={pts.join(' ')} fill="var(--p-wall-mid)" />
      <polygon points={pts.join(' ')} fill="var(--p-wall-dark)" opacity={0.35} transform="translate(6,6)" />
    </g>
  );
}

/** Heavy door. Box: w×h (default 260×440). open=true shows dark interior. */
export function Door({ props }: ArtProps) {
  const w = num(props, 'w', 260);
  const h = num(props, 'h', 440);
  const open = bool(props, 'open', false);
  return (
    <g>
      <rect x={-w * 0.08} y={-h * 0.03} width={w * 1.16} height={h * 1.03} fill="var(--p-wall-light)" rx={6} />
      {open ? (
        <rect x={0} y={0} width={w} height={h} fill="var(--p-sky-top)" />
      ) : (
        <g>
          <rect x={0} y={0} width={w} height={h} fill="var(--p-wall-mid)" />
          {[0.25, 0.5, 0.75].map((t) => (
            <rect key={t} x={w * 0.04} y={h * t - 8} width={w * 0.92} height={12} fill="var(--p-accent)" opacity={0.5} rx={4} />
          ))}
          <circle cx={w * 0.82} cy={h * 0.52} r={10} fill="var(--p-accent)" opacity={0.8} />
        </g>
      )}
    </g>
  );
}

/** Pile of broken stone. Box: w×(w*0.4) (default 420 wide). */
export function Rubble({ props }: ArtProps) {
  const w = num(props, 'w', 420);
  const seed = num(props, 'seed', 5);
  const rnd = mulberry32(seed);
  const h = w * 0.4;
  const rocks = [];
  for (let i = 0; i < 9; i++) {
    const cx = rnd() * w;
    const cy = h - rnd() * h * 0.55;
    const r = 20 + rnd() * (w * 0.09);
    const pts: string[] = [];
    const sides = 5 + Math.floor(rnd() * 3);
    for (let s = 0; s < sides; s++) {
      const a = (s / sides) * Math.PI * 2;
      const rr = r * (0.7 + rnd() * 0.5);
      pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr * 0.7}`);
    }
    rocks.push(
      <polygon
        key={i}
        points={pts.join(' ')}
        fill={rnd() > 0.5 ? 'var(--p-wall-mid)' : 'var(--p-wall-light)'}
        opacity={0.7 + rnd() * 0.3}
      />,
    );
  }
  return <g>{rocks}</g>;
}
