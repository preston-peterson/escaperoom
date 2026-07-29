/** Mechanism primitives: gears, levers, glyph panels, pedestals. */
import { mulberry32, num, bool } from '../rand.ts';
import type { ArtProps } from './structure.tsx';

function gearPath(r: number, teeth: number): string {
  const outer = r;
  const inner = r * 0.82;
  const steps = teeth * 4;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const phase = i % 4;
    const rad = phase === 0 || phase === 3 ? inner : outer;
    pts.push(`${Math.cos(angle) * rad},${Math.sin(angle) * rad}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

/** Toothed gear centered in its box (2r×2r). Props: r, teeth, spin, dur. */
export function Gear({ props }: ArtProps) {
  const r = num(props, 'r', 90);
  const teeth = Math.max(6, num(props, 'teeth', 12));
  const spin = bool(props, 'spin', false);
  const dur = num(props, 'dur', 24);
  return (
    <g transform={`translate(${r}, ${r})`}>
      <g
        style={
          spin
            ? {
                animation: `spin ${dur}s linear infinite`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }
            : undefined
        }
      >
        <path d={gearPath(r, teeth)} fill="var(--p-accent)" opacity={0.9} />
        <circle r={r * 0.62} fill="var(--p-wall-dark)" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={-r * 0.07}
            y={-r * 0.58}
            width={r * 0.14}
            height={r * 1.16}
            rx={r * 0.06}
            fill="var(--p-accent)"
            opacity={0.75}
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r={r * 0.16} fill="var(--p-accent)" />
        <circle r={r * 0.07} fill="var(--p-wall-dark)" />
      </g>
    </g>
  );
}

/** Floor lever. Box: 140×200. pulled tilts the handle right. */
export function Lever({ props }: ArtProps) {
  const pulled = bool(props, 'pulled', false);
  const angle = pulled ? 38 : -38;
  return (
    <g>
      <ellipse cx={70} cy={182} rx={58} ry={16} fill="var(--p-wall-dark)" />
      <path d="M 34 182 L 52 148 L 88 148 L 106 182 Z" fill="var(--p-wall-mid)" />
      <g transform={`translate(70,152) rotate(${angle})`} style={{ transition: 'transform 0.4s ease' }}>
        <rect x={-5} y={-110} width={10} height={110} rx={5} fill="var(--p-accent)" />
        <circle cx={0} cy={-112} r={14} fill="var(--p-glow)" opacity={0.9} />
      </g>
    </g>
  );
}

/** Carved glyph slab. Box: w×h (default 360×260). Props: rows, cols, seed, glow. */
export function GlyphPanel({ props }: ArtProps) {
  const w = num(props, 'w', 360);
  const h = num(props, 'h', 260);
  const rows = num(props, 'rows', 4);
  const cols = num(props, 'cols', 6);
  const seed = num(props, 'seed', 11);
  const glow = bool(props, 'glow', false);
  const rnd = mulberry32(seed);
  const glyphs = [];
  const cellW = (w * 0.84) / cols;
  const cellH = (h * 0.78) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const gx = w * 0.08 + c * cellW + cellW * 0.2;
      const gy = h * 0.11 + r * cellH + cellH * 0.2;
      const gw = cellW * 0.6;
      const gh = cellH * 0.6;
      const kind = Math.floor(rnd() * 4);
      const stroke = glow ? 'var(--p-glow)' : 'var(--p-accent)';
      const sw = 2.5;
      const op = glow ? 0.85 : 0.55;
      glyphs.push(
        kind === 0 ? (
          <path key={`${r}-${c}`} d={`M ${gx} ${gy + gh} L ${gx + gw / 2} ${gy} L ${gx + gw} ${gy + gh}`} stroke={stroke} strokeWidth={sw} fill="none" opacity={op} />
        ) : kind === 1 ? (
          <circle key={`${r}-${c}`} cx={gx + gw / 2} cy={gy + gh / 2} r={Math.min(gw, gh) / 2.4} stroke={stroke} strokeWidth={sw} fill="none" opacity={op} />
        ) : kind === 2 ? (
          <path key={`${r}-${c}`} d={`M ${gx} ${gy} L ${gx + gw} ${gy + gh} M ${gx + gw} ${gy} L ${gx} ${gy + gh}`} stroke={stroke} strokeWidth={sw} fill="none" opacity={op} />
        ) : (
          <path key={`${r}-${c}`} d={`M ${gx} ${gy + gh * 0.5} H ${gx + gw} M ${gx + gw * 0.5} ${gy} V ${gy + gh}`} stroke={stroke} strokeWidth={sw} fill="none" opacity={op} />
        ),
      );
    }
  }
  return (
    <g>
      <rect width={w} height={h} rx={10} fill="var(--p-wall-mid)" />
      <rect x={6} y={6} width={w - 12} height={h - 12} rx={7} fill="none" stroke="var(--p-wall-dark)" strokeWidth={3} />
      {glyphs}
    </g>
  );
}

/** Waist-high pedestal with socket. Box: 180×300. Props: occupied, itemColor. */
export function Pedestal({ props }: ArtProps) {
  const occupied = bool(props, 'occupied', false);
  return (
    <g>
      <rect x={30} y={64} width={120} height={22} rx={5} fill="var(--p-wall-light)" />
      <path d="M 50 86 L 62 268 L 118 268 L 130 86 Z" fill="var(--p-wall-mid)" />
      <rect x={16} y={268} width={148} height={26} rx={5} fill="var(--p-wall-light)" />
      <ellipse cx={90} cy={62} rx={38} ry={12} fill="var(--p-wall-dark)" />
      {occupied && (
        <g>
          <circle cx={90} cy={46} r={20} fill="var(--p-glow)" opacity={0.9} />
          <g opacity={0.2}>
            <circle cx={90} cy={46} r={30} fill="var(--p-glow)" style={{ animation: 'flicker 3.4s infinite' }} />
          </g>
        </g>
      )}
    </g>
  );
}
