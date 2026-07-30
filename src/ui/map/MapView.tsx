import { useMemo, useState } from 'react';
import type { GameState, PassageId, RoomId, WorldDef } from '../../engine/types.ts';
import { mapView } from '../../engine/state/selectors.ts';
import { ShiftAnimator, type ShiftAnimation } from './ShiftAnimator.tsx';

const ROOM_SIZE = 92;

function roomShape(
  layout: { x: number; y: number; shape: 'square' | 'circle' | 'hex'; w?: number; h?: number },
  common: Record<string, unknown>,
) {
  const w = layout.w ?? ROOM_SIZE;
  const h = layout.h ?? ROOM_SIZE;
  switch (layout.shape) {
    case 'circle':
      return <circle cx={layout.x} cy={layout.y} r={w / 2} {...common} />;
    case 'hex': {
      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(`${layout.x + (w / 2) * Math.cos(a)},${layout.y + (w / 2) * Math.sin(a)}`);
      }
      return <polygon points={pts.join(' ')} {...common} />;
    }
    case 'square':
      return (
        <rect x={layout.x - w / 2} y={layout.y - h / 2} width={w} height={h} rx={10} {...common} />
      );
  }
}

/**
 * The board-game map: fog-of-war rooms, passages, player token. Clicking an
 * adjacent room dispatches MOVE (the reducer rejects closed passages, which
 * surfaces the passage's closedText as narration).
 */
export function MapView({
  state,
  world,
  onMove,
  onEnterRoom,
}: {
  state: GameState;
  world: WorldDef;
  onMove: (passage: PassageId) => void;
  onEnterRoom: () => void;
}) {
  const view = useMemo(() => mapView(state), [state]);
  const [anim, setAnim] = useState<ShiftAnimation | null>(null);

  const passageForRoom = new Map<RoomId, PassageId>();
  for (const [id, p] of Object.entries(state.topology)) {
    if (!p.revealed) continue;
    if (p.from === state.currentRoom) passageForRoom.set(p.to, id);
    else if (p.to === state.currentRoom) passageForRoom.set(p.from, id);
  }

  const rotating =
    anim && anim.shift.mapAnimation === 'rotate' && anim.shift.animTarget
      ? anim.shift
      : null;

  return (
    <ShiftAnimator onActive={setAnim}>
      <svg
        viewBox={world.map.viewBox.join(' ')}
        style={{ width: '100%', height: '100%', display: 'block' }}
        role="img"
        aria-label="Labyrinth map"
      >
        {/* parchment-dark backdrop grid */}
        <defs>
          <pattern id="map-grid" width={46} height={46} patternUnits="userSpaceOnUse">
            <path d="M 46 0 H 0 V 46" fill="none" stroke="rgba(200,160,106,0.05)" strokeWidth={1} />
          </pattern>
        </defs>
        <rect
          x={world.map.viewBox[0]}
          y={world.map.viewBox[1]}
          width={world.map.viewBox[2]}
          height={world.map.viewBox[3]}
          fill="url(#map-grid)"
        />

        {/* passages */}
        {view.passages.map((p) => {
          const a = world.map.rooms[p.from];
          const b = world.map.rooms[p.to];
          if (!a || !b) return null;
          const waypoints = world.map.passageWaypoints?.[p.id] ?? [];
          const points = [[a.x, a.y], ...waypoints, [b.x, b.y]]
            .map((pt) => pt.join(','))
            .join(' ');
          return (
            <g key={p.id}>
              <polyline
                points={points}
                fill="none"
                stroke={p.open ? 'rgba(224,164,88,0.55)' : 'rgba(107,92,71,0.5)'}
                strokeWidth={p.open ? 7 : 5}
                strokeDasharray={p.open ? undefined : '4 10'}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.8s, stroke-dasharray 0.8s' }}
              />
              {!p.open && (
                <PassageSeal a={a} b={b} waypoints={waypoints} />
              )}
            </g>
          );
        })}

        {/* rooms */}
        {view.rooms.map((r) => {
          const layout = world.map.rooms[r.id];
          if (!layout) return null;
          const def = world.rooms[r.id];
          const clickPassage = passageForRoom.get(r.id);
          const clickable = !r.isCurrent && clickPassage !== undefined;
          const isRotateTarget = rotating?.animTarget === r.id;
          const common = {
            fill: r.visited ? 'var(--panel)' : 'rgba(29,22,16,0.4)',
            stroke: r.isCurrent
              ? 'var(--amber)'
              : r.visited
                ? 'var(--panel-edge)'
                : 'rgba(51,38,26,0.6)',
            strokeWidth: r.isCurrent ? 3.5 : 2,
            strokeDasharray: r.visited ? undefined : '6 6',
          };
          return (
            <g
              key={r.id}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={
                clickable
                  ? `Go to ${r.visited && def ? def.name : 'unexplored chamber'}`
                  : undefined
              }
              onClick={
                clickable
                  ? () => onMove(clickPassage)
                  : r.isCurrent
                    ? onEnterRoom
                    : undefined
              }
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onMove(clickPassage);
                      }
                    }
                  : undefined
              }
              style={{
                cursor: clickable || r.isCurrent ? 'pointer' : 'default',
                ...(isRotateTarget
                  ? {
                      transformBox: 'fill-box' as const,
                      transformOrigin: 'center',
                      animation: `map-rotate ${rotating.durationMs}ms ease-in-out`,
                    }
                  : {}),
              }}
            >
              {roomShape(layout, common)}
              {r.isCurrent && (
                <circle
                  cx={layout.x}
                  cy={layout.y}
                  r={13}
                  fill="var(--amber)"
                  style={{
                    animation: 'glintPulse 2.2s ease-in-out infinite',
                    // Without these the pulse scales from the SVG origin and
                    // walks the token off its room.
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                  }}
                />
              )}
              <text
                x={layout.x}
                y={layout.y + (layout.h ?? ROOM_SIZE) / 2 + 24}
                textAnchor="middle"
                fill={r.visited ? 'var(--ink-dim)' : 'var(--ink-faint)'}
                fontSize={17}
                fontFamily="var(--font-display)"
                pointerEvents="none"
              >
                {r.visited && def ? def.name : '?'}
              </text>
            </g>
          );
        })}
      </svg>
    </ShiftAnimator>
  );
}

function PassageSeal({
  a,
  b,
  waypoints,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  waypoints: [number, number][];
}) {
  // Bar across the midpoint of the passage line.
  const pts = [[a.x, a.y], ...waypoints, [b.x, b.y]];
  const midIdx = (pts.length - 1) / 2;
  const i = Math.floor(midIdx);
  const t = midIdx - i;
  const mx = pts[i][0] + (pts[Math.min(i + 1, pts.length - 1)][0] - pts[i][0]) * t;
  const my = pts[i][1] + (pts[Math.min(i + 1, pts.length - 1)][1] - pts[i][1]) * t;
  const dx = pts[Math.min(i + 1, pts.length - 1)][0] - pts[i][0];
  const dy = pts[Math.min(i + 1, pts.length - 1)][1] - pts[i][1];
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return (
    <rect
      x={mx - 3}
      y={my - 14}
      width={6}
      height={28}
      rx={3}
      fill="var(--danger)"
      opacity={0.75}
      transform={`rotate(${angle} ${mx} ${my})`}
    />
  );
}
