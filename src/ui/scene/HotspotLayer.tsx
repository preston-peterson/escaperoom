import { useState } from 'react';
import type { GameState, HotspotDef, SceneDef, WorldDef } from '../../engine/types.ts';
import { condHolds, evalCondition } from '../../engine/state/conditions.ts';
import { pointerOrder } from '../../engine/state/selectors.ts';

function shapeElement(hs: HotspotDef, common: Record<string, unknown>) {
  switch (hs.shape.kind) {
    case 'rect':
      return (
        <rect
          x={hs.shape.x}
          y={hs.shape.y}
          width={hs.shape.w}
          height={hs.shape.h}
          rx={8}
          {...common}
        />
      );
    case 'circle':
      return <circle cx={hs.shape.cx} cy={hs.shape.cy} r={hs.shape.r} {...common} />;
    case 'polygon':
      return (
        <polygon points={hs.shape.points.map((p) => p.join(',')).join(' ')} {...common} />
      );
  }
}

function labelAnchor(hs: HotspotDef): [number, number] {
  switch (hs.shape.kind) {
    case 'rect':
      return [hs.shape.x + hs.shape.w / 2, hs.shape.y - 14];
    case 'circle':
      return [hs.shape.cx, hs.shape.cy - hs.shape.r - 14];
    case 'polygon': {
      const xs = hs.shape.points.map((p) => p[0]);
      const ys = hs.shape.points.map((p) => p[1]);
      return [
        (Math.min(...xs) + Math.max(...xs)) / 2,
        Math.min(...ys) - 14,
      ];
    }
  }
}

/** Transparent, focusable interaction shapes above the scene art. */
export function HotspotLayer({
  scene,
  state,
  onHotspot,
}: {
  scene: SceneDef;
  state: GameState;
  world: WorldDef;
  onHotspot: (hotspotId: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  // Largest first: small, specific targets render on top and win the pointer.
  const visible = pointerOrder(
    scene.hotspots.filter(
      (h) => condHolds(h.if, state) && !(h.hideWhen && evalCondition(h.hideWhen, state)),
    ),
  );
  const hoveredDef = visible.find((h) => h.id === hovered);
  return (
    <g>
      {visible.map((hs) => (
        <g
          key={hs.id}
          role="button"
          tabIndex={0}
          aria-label={hs.label}
          onClick={() => onHotspot(hs.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onHotspot(hs.id);
            }
          }}
          onPointerEnter={() => setHovered(hs.id)}
          onPointerLeave={() => setHovered((h) => (h === hs.id ? null : h))}
          onFocus={() => setHovered(hs.id)}
          onBlur={() => setHovered((h) => (h === hs.id ? null : h))}
        >
          {shapeElement(hs, { className: 'hotspot' })}
        </g>
      ))}
      {hoveredDef && (
        <g pointerEvents="none" style={{ animation: 'fadeIn 0.15s ease' }}>
          {(() => {
            const [lx, ly] = labelAnchor(hoveredDef);
            const tw = hoveredDef.label.length * 9.5 + 28;
            return (
              <>
                <rect
                  x={lx - tw / 2}
                  y={ly - 24}
                  width={tw}
                  height={32}
                  rx={6}
                  fill="rgba(13,10,8,0.88)"
                  stroke="rgba(224,164,88,0.4)"
                />
                <text
                  x={lx}
                  y={ly - 2}
                  textAnchor="middle"
                  fill="var(--amber-bright, #f5c97b)"
                  fontSize={17}
                  fontFamily="var(--font-display)"
                >
                  {hoveredDef.label}
                </text>
              </>
            );
          })()}
        </g>
      )}
    </g>
  );
}
