import { useState } from 'react';
import type { GameState, HotspotDef, HotspotShape, SceneDef, WorldDef } from '../../engine/types.ts';
import { condHolds, evalCondition } from '../../engine/state/conditions.ts';
import { pointerOrder, touchPadded } from '../../engine/state/selectors.ts';

function shapeElement(shape: HotspotShape, common: Record<string, unknown>) {
  switch (shape.kind) {
    case 'rect':
      return (
        <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={8} {...common} />
      );
    case 'circle':
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
    case 'polygon':
      return (
        <polygon points={shape.points.map((p) => p.join(',')).join(' ')} {...common} />
      );
  }
}

function labelAnchor(shape: HotspotShape): [number, number] {
  switch (shape.kind) {
    case 'rect':
      return [shape.x + shape.w / 2, shape.y - 14];
    case 'circle':
      return [shape.cx, shape.cy - shape.r - 14];
    case 'polygon': {
      const xs = shape.points.map((p) => p[0]);
      const ys = shape.points.map((p) => p[1]);
      return [(Math.min(...xs) + Math.max(...xs)) / 2, Math.min(...ys) - 14];
    }
  }
}

/** Transparent, focusable interaction shapes above the scene art. */
export function HotspotLayer({
  scene,
  state,
  onHotspot,
  touch,
  looking,
}: {
  scene: SceneDef;
  state: GameState;
  world: WorldDef;
  onHotspot: (hotspotId: string) => void;
  touch: boolean;
  looking: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const live = scene.hotspots.filter(
    (h) => condHolds(h.if, state) && !(h.hideWhen && evalCondition(h.hideWhen, state)),
  );
  // On touch every target grows to a finger-sized minimum; the art doesn't move.
  const shaped: { def: HotspotDef; shape: HotspotShape }[] = live.map((def) => ({
    def,
    shape: touch ? touchPadded(def.shape) : def.shape,
  }));
  // Largest first: small, specific targets render on top and win the pointer.
  const ordered = pointerOrder(shaped.map((s) => ({ ...s.def, shape: s.shape })));
  const hoveredDef = ordered.find((h) => h.id === hovered);

  return (
    <g>
      {ordered.map((hs) => (
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
          {shapeElement(hs.shape, {
            className: `hotspot${looking ? ' hotspot--revealed' : ''}`,
          })}
        </g>
      ))}
      {hoveredDef && (
        <g pointerEvents="none" style={{ animation: 'fadeIn 0.15s ease' }}>
          {(() => {
            const [lx, ly] = labelAnchor(hoveredDef.shape);
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
