/**
 * Interior/mystery primitives for the Casebook worlds. Same contract as the
 * rest: draw into a [0,0,w,h] box placed by the scene layer's x/y, colored
 * only via palette vars.
 */
import { useId } from 'react';
import { mulberry32, num, bool, str } from '../rand.ts';
import type { ArtProps } from './structure.tsx';

/** Paneled interior wall. Box: w×h (default 1600×420). style: wood|deco|velvet|iron. */
export function PanelWall({ props }: ArtProps) {
  const w = num(props, 'w', 1600);
  const h = num(props, 'h', 420);
  const seed = num(props, 'seed', 1);
  const style = str(props, 'style', 'wood');
  const wainscot = bool(props, 'wainscot', true);
  const rnd = mulberry32(seed);
  const details = [];
  if (style === 'wood' || style === 'velvet') {
    const panels = Math.max(4, Math.round(w / 230));
    for (let i = 0; i < panels; i++) {
      const px = (i * w) / panels + 14;
      const pw = w / panels - 28;
      details.push(
        <rect
          key={i}
          x={px}
          y={h * 0.12}
          width={pw}
          height={h * (wainscot ? 0.5 : 0.72)}
          rx={6}
          fill="none"
          stroke="var(--p-wall-dark)"
          strokeWidth={4}
          opacity={0.7}
        />,
      );
      if (style === 'velvet') {
        for (let d = 0; d < 6; d++) {
          details.push(
            <circle
              key={`${i}-${d}`}
              cx={px + pw * (0.25 + (d % 3) * 0.25)}
              cy={h * (0.24 + Math.floor(d / 3) * 0.2)}
              r={3}
              fill="var(--p-wall-dark)"
              opacity={0.6}
            />,
          );
        }
      }
    }
  } else if (style === 'deco') {
    for (let x = 30; x < w; x += 46) {
      details.push(
        <line key={x} x1={x} y1={h * 0.1} x2={x} y2={h * 0.66} stroke="var(--p-wall-light)" strokeWidth={2} opacity={0.25 + rnd() * 0.15} />,
      );
    }
    details.push(
      <rect key="band" x={0} y={h * 0.08} width={w} height={10} fill="var(--p-accent)" opacity={0.5} />,
    );
  } else {
    // iron: plates + rivets
    for (let x = 0; x < w; x += 210) {
      details.push(
        <line key={`p${x}`} x1={x} y1={0} x2={x} y2={h} stroke="var(--p-wall-dark)" strokeWidth={5} opacity={0.7} />,
      );
      for (let y = 24; y < h; y += 60) {
        details.push(
          <circle key={`${x}-${y}`} cx={x + 16} cy={y} r={4} fill="var(--p-wall-light)" opacity={0.5} />,
        );
      }
    }
  }
  return (
    <g>
      <rect width={w} height={h} fill="var(--p-wall-mid)" />
      {details}
      {wainscot && style !== 'iron' && (
        <>
          <rect x={0} y={h * 0.66} width={w} height={12} fill="var(--p-wall-light)" opacity={0.8} />
          <rect x={0} y={h * 0.68} width={w} height={h * 0.32} fill="var(--p-wall-dark)" opacity={0.85} />
        </>
      )}
    </g>
  );
}

/** Window with weather beyond. Box: 320×420. shape: sash|porthole|arched; weather: snow|sea|night|motion. */
export function WindowPane({ props }: ArtProps) {
  const shape = str(props, 'shape', 'sash');
  const weather = str(props, 'weather', 'night');
  const lit = bool(props, 'lit', false);
  const id = useId();
  const w = 320;
  const h = shape === 'porthole' ? 320 : 420;

  const glass = (
    <g clipPath={`url(#${id}-clip)`}>
      <rect width={w} height={h} fill="var(--p-sky-top)" />
      {weather === 'snow' && (
        <g>
          <rect width={w} height={h} fill="var(--p-fog)" opacity={0.18} />
          {[...Array(16)].map((_, i) => {
            const rnd = mulberry32(i + 40);
            return (
              <circle
                key={i}
                cx={rnd() * w}
                cy={rnd() * h}
                r={2 + rnd() * 2.5}
                fill="#fff"
                opacity={0.5 + rnd() * 0.4}
                style={{ animation: `fogDrift ${8 + rnd() * 10}s ease-in-out infinite alternate` }}
              />
            );
          })}
        </g>
      )}
      {weather === 'sea' && (
        <g>
          <rect y={h * 0.45} width={w} height={h} fill="var(--p-water)" opacity={0.8} />
          {[0.5, 0.62, 0.76].map((t, i) => (
            <path
              key={t}
              d={`M -30 ${h * t} q 40 -8 80 0 t 80 0 t 80 0 t 80 0`}
              fill="none"
              stroke="var(--p-fog)"
              strokeWidth={2}
              opacity={0.4 - i * 0.1}
              style={{ animation: `fogDrift ${10 + i * 6}s ease-in-out infinite alternate` }}
            />
          ))}
        </g>
      )}
      {weather === 'night' && (
        <g>
          {[...Array(12)].map((_, i) => {
            const rnd = mulberry32(i + 7);
            return <circle key={i} cx={rnd() * w} cy={rnd() * h * 0.7} r={1.5 + rnd()} fill="#e8e8ff" opacity={0.4 + rnd() * 0.5} />;
          })}
          <circle cx={w * 0.7} cy={h * 0.22} r={26} fill="var(--p-fog)" opacity={0.55} />
        </g>
      )}
      {weather === 'motion' && (
        <g>
          {[...Array(7)].map((_, i) => {
            const rnd = mulberry32(i + 21);
            return (
              <rect
                key={i}
                x={-w}
                y={rnd() * h}
                width={60 + rnd() * 120}
                height={2.5}
                fill="var(--p-glow)"
                opacity={0.3 + rnd() * 0.5}
                style={{ animation: `fogDrift ${1.6 + rnd() * 1.4}s linear infinite` }}
              />
            );
          })}
        </g>
      )}
      {lit && <rect width={w} height={h} fill="var(--p-glow)" opacity={0.08} />}
    </g>
  );

  if (shape === 'porthole') {
    return (
      <g>
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx={160} cy={160} r={120} />
          </clipPath>
        </defs>
        {glass}
        <circle cx={160} cy={160} r={128} fill="none" stroke="var(--p-accent)" strokeWidth={16} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle
            key={a}
            cx={160 + Math.cos((a * Math.PI) / 180) * 128}
            cy={160 + Math.sin((a * Math.PI) / 180) * 128}
            r={5}
            fill="var(--p-wall-dark)"
          />
        ))}
      </g>
    );
  }

  const arched = shape === 'arched';
  const frameD = arched
    ? `M 20 ${h} L 20 ${h * 0.32} Q ${w / 2} 8 ${w - 20} ${h * 0.32} L ${w - 20} ${h} Z`
    : `M 20 20 H ${w - 20} V ${h - 20} H 20 Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={frameD} />
        </clipPath>
      </defs>
      {glass}
      <path d={frameD} fill="none" stroke="var(--p-wall-dark)" strokeWidth={14} />
      <line x1={w / 2} y1={arched ? h * 0.14 : 20} x2={w / 2} y2={h - 20} stroke="var(--p-wall-dark)" strokeWidth={7} />
      <line x1={20} y1={h * 0.55} x2={w - 20} y2={h * 0.55} stroke="var(--p-wall-dark)" strokeWidth={7} />
    </g>
  );
}

/** One primitive, many furnishings. kind: desk|chair|table|cabinet|berth|bar. toppled tips it over. */
export function Furniture({ props }: ArtProps) {
  const kind = str(props, 'kind', 'desk');
  const toppled = bool(props, 'toppled', false);
  const seed = num(props, 'seed', 2);
  const rnd = mulberry32(seed);
  let art;
  switch (kind) {
    case 'chair':
      art = (
        <g>
          <rect x={40} y={0} width={16} height={150} rx={5} fill="var(--p-wall-dark)" />
          <rect x={36} y={140} width={110} height={18} rx={5} fill="var(--p-wall-mid)" />
          <rect x={44} y={158} width={12} height={80} fill="var(--p-wall-dark)" />
          <rect x={128} y={158} width={12} height={80} fill="var(--p-wall-dark)" />
          <rect x={40} y={10} width={14} height={120} rx={5} fill="var(--p-wall-mid)" opacity={0.7} />
        </g>
      );
      break;
    case 'table':
      art = (
        <g>
          <ellipse cx={170} cy={70} rx={170} ry={34} fill="var(--p-wall-mid)" />
          <ellipse cx={170} cy={62} rx={170} ry={34} fill="var(--p-wall-light)" opacity={0.6} />
          <rect x={158} y={90} width={24} height={140} fill="var(--p-wall-dark)" />
          <path d="M 120 230 h 100 l -14 18 h -72 Z" fill="var(--p-wall-dark)" />
        </g>
      );
      break;
    case 'cabinet':
      art = (
        <g>
          <rect x={0} y={0} width={220} height={320} rx={8} fill="var(--p-wall-mid)" />
          <rect x={12} y={12} width={94} height={296} rx={5} fill="var(--p-wall-dark)" opacity={0.55} />
          <rect x={114} y={12} width={94} height={296} rx={5} fill="var(--p-wall-dark)" opacity={0.55} />
          <circle cx={100} cy={160} r={6} fill="var(--p-accent)" />
          <circle cx={120} cy={160} r={6} fill="var(--p-accent)" />
        </g>
      );
      break;
    case 'berth':
      art = (
        <g>
          <rect x={0} y={60} width={420} height={26} rx={6} fill="var(--p-accent)" opacity={0.7} />
          <rect x={0} y={86} width={420} height={80} rx={8} fill="var(--p-wall-mid)" />
          <rect x={10} y={70} width={130} height={34} rx={14} fill="var(--p-fog)" opacity={0.8} />
          <rect x={0} y={96} width={420} height={30} fill="var(--p-wall-light)" opacity={0.35} />
          <line x1={20} y1={60} x2={20} y2={20} stroke="var(--p-accent)" strokeWidth={5} opacity={0.7} />
          <line x1={400} y1={60} x2={400} y2={20} stroke="var(--p-accent)" strokeWidth={5} opacity={0.7} />
        </g>
      );
      break;
    case 'bar':
      art = (
        <g>
          <rect x={0} y={120} width={460} height={30} rx={6} fill="var(--p-wall-light)" />
          <rect x={12} y={150} width={436} height={120} fill="var(--p-wall-mid)" />
          {[...Array(6)].map((_, i) => (
            <rect
              key={i}
              x={30 + i * 70 + rnd() * 12}
              y={54 + rnd() * 20}
              width={16}
              height={46}
              rx={5}
              fill="var(--p-accent)"
              opacity={0.55 + rnd() * 0.4}
            />
          ))}
          <rect x={0} y={44} width={460} height={8} fill="var(--p-wall-dark)" opacity={0.7} />
        </g>
      );
      break;
    default:
      // desk
      art = (
        <g>
          <rect x={0} y={70} width={360} height={22} rx={5} fill="var(--p-wall-light)" />
          <rect x={16} y={92} width={120} height={130} fill="var(--p-wall-mid)" />
          <rect x={224} y={92} width={120} height={130} fill="var(--p-wall-mid)" />
          <rect x={28} y={104} width={96} height={30} rx={4} fill="var(--p-wall-dark)" opacity={0.6} />
          <rect x={28} y={144} width={96} height={30} rx={4} fill="var(--p-wall-dark)" opacity={0.6} />
          <circle cx={76} cy={119} r={4} fill="var(--p-accent)" />
          <circle cx={76} cy={159} r={4} fill="var(--p-accent)" />
          <rect x={40} y={40} width={110} height={30} rx={3} fill="var(--p-fog)" opacity={0.35} />
        </g>
      );
  }
  return toppled ? <g transform="rotate(-78 120 220)">{art}</g> : art;
}

/** Framed portrait. Box: 260×340. tilted knocks it askew; empty = canvas cut out. */
export function PortraitFrame({ props }: ArtProps) {
  const seed = num(props, 'seed', 4);
  const tilted = bool(props, 'tilted', false);
  const empty = bool(props, 'empty', false);
  const oval = bool(props, 'oval', false);
  const rnd = mulberry32(seed);
  const inner = empty ? (
    <g>
      <rect x={34} y={34} width={192} height={272} fill="var(--p-sky-top)" />
      <path
        d={`M 50 60 L ${80 + rnd() * 60} ${140 + rnd() * 60} L 90 290`}
        fill="none"
        stroke="var(--p-fog)"
        strokeWidth={2}
        opacity={0.4}
      />
    </g>
  ) : (
    <g>
      <rect x={34} y={34} width={192} height={272} fill="var(--p-wall-dark)" />
      {/* bust silhouette */}
      <ellipse cx={130} cy={140 + rnd() * 16} rx={44} ry={54} fill="var(--p-wall-mid)" />
      <path d="M 70 306 Q 130 200 190 306 Z" fill="var(--p-wall-mid)" />
      <rect x={34} y={34} width={192} height={272} fill="var(--p-glow)" opacity={0.05} />
    </g>
  );
  return (
    <g transform={tilted ? `rotate(${4 + rnd() * 5} 130 170)` : undefined}>
      {oval ? (
        <ellipse cx={130} cy={170} rx={122} ry={162} fill="var(--p-accent)" opacity={0.9} />
      ) : (
        <rect width={260} height={340} rx={6} fill="var(--p-accent)" opacity={0.9} />
      )}
      <rect x={18} y={18} width={224} height={304} fill="var(--p-wall-light)" opacity={0.4} />
      {inner}
    </g>
  );
}

/** Hanging light. Box: 360×300. style: crystal|deco|lantern; sway for ship/train motion. */
export function Chandelier({ props }: ArtProps) {
  const style = str(props, 'style', 'crystal');
  const lit = bool(props, 'lit', true);
  const sway = bool(props, 'sway', false);
  const id = useId();
  const cx = 180;
  return (
    <g
      style={
        sway
          ? { animation: 'sway 6s ease-in-out infinite', transformOrigin: `${cx}px 0px`, transformBox: 'view-box' as const }
          : undefined
      }
    >
      <line x1={cx} y1={0} x2={cx} y2={70} stroke="var(--p-accent)" strokeWidth={5} />
      {style === 'lantern' ? (
        <g>
          <rect x={cx - 44} y={70} width={88} height={110} rx={10} fill="var(--p-wall-dark)" stroke="var(--p-accent)" strokeWidth={5} />
          {lit && <rect x={cx - 32} y={84} width={64} height={82} rx={6} fill="var(--p-glow)" opacity={0.75} style={{ animation: 'flicker 3.6s infinite' }} />}
        </g>
      ) : (
        <g>
          <path d={`M ${cx - 130} 120 Q ${cx} 60 ${cx + 130} 120`} fill="none" stroke="var(--p-accent)" strokeWidth={7} />
          {[-130, -65, 0, 65, 130].map((dx) => (
            <g key={dx}>
              <line x1={cx + dx} y1={dx === 0 ? 70 : 120} x2={cx + dx} y2={150} stroke="var(--p-accent)" strokeWidth={4} />
              {lit && <circle cx={cx + dx} cy={158} r={9} fill="var(--p-glow)" style={{ animation: `flicker ${3 + Math.abs(dx) / 60}s infinite` }} />}
              {style === 'crystal' &&
                [0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1={cx + dx - 8 + i * 8}
                    y1={168}
                    x2={cx + dx - 8 + i * 8}
                    y2={186 + (i % 2) * 10}
                    stroke="var(--p-fog)"
                    strokeWidth={2}
                    opacity={0.7}
                  />
                ))}
            </g>
          ))}
        </g>
      )}
      {lit && (
        <>
          <defs>
            <radialGradient id={`${id}-halo`}>
              <stop offset="0%" stopColor="var(--p-glow)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--p-glow)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={150} r={150} fill={`url(#${id}-halo)`} />
        </>
      )}
    </g>
  );
}

/** Stage (or grand window) curtains. Box: 900×620. open: 0..1; torn adds a ragged edge. */
export function CurtainStage({ props }: ArtProps) {
  const mode = str(props, 'mode', 'stage');
  const open = Math.max(0, Math.min(1, num(props, 'open', 0.5)));
  const torn = bool(props, 'torn', false);
  const w = mode === 'stage' ? 900 : 520;
  const h = mode === 'stage' ? 620 : 460;
  const panelW = (w / 2) * (1 - open * 0.82);
  const folds = (x0: number, pw: number, mirror: boolean) =>
    [...Array(Math.max(2, Math.round(pw / 44)))].map((_, i) => (
      <path
        key={i}
        d={`M ${x0 + (mirror ? -i * 44 : i * 44)} ${h * 0.06} q 10 ${h * 0.45} 0 ${h * (torn && i % 3 === 0 ? 0.78 : 0.88)}`}
        fill="none"
        stroke="var(--p-wall-dark)"
        strokeWidth={7}
        opacity={0.5}
      />
    ));
  return (
    <g>
      {mode === 'stage' && (
        <>
          <rect width={w} height={h * 0.1} fill="var(--p-wall-dark)" />
          <rect y={h * 0.06} width={w} height={26} rx={10} fill="var(--p-accent)" opacity={0.85} />
        </>
      )}
      <path
        d={`M 0 ${h * 0.05} H ${panelW} q ${-panelW * 0.25} ${h * 0.5} 0 ${h * 0.93} H 0 Z`}
        fill="var(--p-wall-mid)"
      />
      <path
        d={`M ${w} ${h * 0.05} H ${w - panelW} q ${panelW * 0.25} ${h * 0.5} 0 ${h * 0.93} H ${w} Z`}
        fill="var(--p-wall-mid)"
      />
      {folds(20, panelW, false)}
      {folds(w - 20, panelW, true)}
      {/* valance */}
      <path
        d={`M 0 ${h * 0.05} H ${w} V ${h * 0.14} q ${-w * 0.12} ${h * 0.09} ${-w * 0.25} 0 q ${-w * 0.12} ${h * 0.09} ${-w * 0.25} 0 q ${-w * 0.12} ${h * 0.09} ${-w * 0.25} 0 q ${-w * 0.13} ${h * 0.09} ${-w * 0.25} 0 Z`}
        fill="var(--p-wall-mid)"
        opacity={0.95}
      />
    </g>
  );
}

/** A scrap of paper evidence. Box: 160×120. kind: letter|ledger|ticket|photo. */
export function PaperScrap({ props }: ArtProps) {
  const kind = str(props, 'kind', 'letter');
  const rotate = num(props, 'rotate', -6);
  const seed = num(props, 'seed', 6);
  const rnd = mulberry32(seed);
  const lines = [];
  if (kind === 'ledger') {
    for (let i = 0; i < 5; i++) {
      lines.push(<line key={i} x1={14} y1={28 + i * 16} x2={146} y2={28 + i * 16} stroke="var(--p-wall-dark)" strokeWidth={1.5} opacity={0.5} />);
    }
    lines.push(<line key="v" x1={100} y1={16} x2={100} y2={104} stroke="var(--p-wall-dark)" strokeWidth={1.5} opacity={0.5} />);
  } else if (kind === 'photo') {
    lines.push(<rect key="img" x={16} y={16} width={128} height={74} fill="var(--p-wall-dark)" />);
    lines.push(<ellipse key="fig" cx={80} cy={62} rx={22} ry={26} fill="var(--p-wall-mid)" />);
  } else if (kind === 'ticket') {
    for (let i = 0; i < 8; i++) {
      lines.push(<circle key={i} cx={118} cy={14 + i * 13} r={2.5} fill="var(--p-sky-top)" />);
    }
    lines.push(<rect key="stub" x={14} y={40} width={80} height={12} rx={3} fill="var(--p-wall-dark)" opacity={0.6} />);
    lines.push(<rect key="stub2" x={14} y={62} width={56} height={9} rx={3} fill="var(--p-wall-dark)" opacity={0.45} />);
  } else {
    for (let i = 0; i < 5; i++) {
      lines.push(
        <path
          key={i}
          d={`M 16 ${30 + i * 16} q ${20 + rnd() * 20} ${-4 + rnd() * 8} ${100 + rnd() * 28} 0`}
          fill="none"
          stroke="var(--p-wall-dark)"
          strokeWidth={1.8}
          opacity={0.55}
        />,
      );
    }
    lines.push(<circle key="seal" cx={132} cy={98} r={9} fill="var(--p-accent)" opacity={0.7} />);
  }
  return (
    <g transform={`rotate(${rotate} 80 60)`}>
      <rect width={160} height={120} rx={4} fill="var(--p-fog)" opacity={0.9} />
      <rect width={160} height={120} rx={4} fill="#fffbe8" opacity={0.55} />
      {lines}
    </g>
  );
}

/** The crime-scene anchor, kept tasteful. Box: 420×200. style: chalk|sheet|roped. */
export function BodyOutline({ props }: ArtProps) {
  const style = str(props, 'style', 'chalk');
  if (style === 'sheet') {
    return (
      <g>
        <ellipse cx={210} cy={150} rx={200} ry={44} fill="var(--p-wall-dark)" opacity={0.4} />
        <path
          d="M 30 156 Q 70 96 140 104 Q 180 66 240 92 Q 330 84 386 150 Q 330 176 210 176 Q 90 176 30 156 Z"
          fill="var(--p-fog)"
          opacity={0.9}
        />
        <path d="M 60 140 q 40 -18 80 -4 M 220 108 q 46 -8 90 22" fill="none" stroke="var(--p-wall-dark)" strokeWidth={3} opacity={0.35} />
      </g>
    );
  }
  if (style === 'roped') {
    return (
      <g>
        <ellipse cx={210} cy={110} rx={190} ry={82} fill="none" stroke="var(--p-accent)" strokeWidth={6} strokeDasharray="26 14" opacity={0.85} />
        <rect x={40} y={20} width={12} height={100} fill="var(--p-wall-mid)" />
        <rect x={368} y={20} width={12} height={100} fill="var(--p-wall-mid)" />
      </g>
    );
  }
  // chalk
  return (
    <path
      d="M 96 96 q 20 -34 52 -22 q 26 10 20 40 l 70 6 q 56 -22 96 6 q 30 22 4 42 l -80 12 l -20 24 q -24 20 -44 2 l -6 -26 l -84 -8 q -36 -8 -30 -38 q 4 -26 22 -38 Z"
      fill="none"
      stroke="var(--p-fog)"
      strokeWidth={5}
      strokeLinejoin="round"
      opacity={0.85}
    />
  );
}
