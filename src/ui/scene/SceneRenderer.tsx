import { useCallback, useRef, useState, type CSSProperties } from 'react';
import type { GameState, SceneDef, SceneLayer, WorldDef } from '../../engine/types.ts';
import { SCENE_H, SCENE_W } from '../../engine/types.ts';
import { condHolds } from '../../engine/state/conditions.ts';
import { paletteVars } from '../art/palettes.ts';
import { primitiveRegistry } from '../art/registry.ts';
import { HotspotLayer } from './HotspotLayer.tsx';

const PARALLAX_STRENGTH = 26;

function LayerElement({ layer }: { layer: SceneLayer }) {
  if (layer.kind === 'path') {
    return <path d={layer.d} fill={layer.fill} opacity={layer.opacity} />;
  }
  const Prim = primitiveRegistry[layer.primitive];
  if (!Prim) return null;
  const transform = `translate(${layer.x}, ${layer.y})${
    layer.scale !== undefined ? ` scale(${layer.scale})` : ''
  }${layer.rotate !== undefined ? ` rotate(${layer.rotate})` : ''}`;
  return (
    <g transform={transform}>
      <Prim props={layer.props} />
    </g>
  );
}

/**
 * Renders a SceneDef as layered SVG. Layers are grouped by parallax factor;
 * groups translate subtly against pointer movement (skipped for touch and
 * covered by the global reduced-motion rule).
 */
export function SceneRenderer({
  scene,
  state,
  world,
  onHotspot,
}: {
  scene: SceneDef;
  state: GameState;
  world: WorldDef;
  onHotspot: (hotspotId: string) => void;
}) {
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setOffset([nx, ny]));
  }, []);

  const liveLayers = scene.layers.filter((l) => condHolds(l.if, state));

  // Group consecutive layers sharing a parallax factor so paint order holds.
  const groups: { parallax: number; layers: SceneLayer[] }[] = [];
  for (const layer of liveLayers) {
    const p = layer.parallax ?? 0;
    const last = groups[groups.length - 1];
    if (last && last.parallax === p) last.layers.push(layer);
    else groups.push({ parallax: p, layers: [layer] });
  }

  return (
    <svg
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid slice"
      onPointerMove={onPointerMove}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background:
          'linear-gradient(180deg, var(--p-sky-top) 0%, var(--p-sky-bottom) 78%, var(--p-floor) 100%)',
        ...(paletteVars(scene.palette) as CSSProperties),
      }}
    >
      {groups.map((group, i) => (
        <g
          key={i}
          style={{
            transform: `translate(${offset[0] * (group.parallax - 0.35) * PARALLAX_STRENGTH}px, ${
              offset[1] * (group.parallax - 0.35) * PARALLAX_STRENGTH * 0.5
            }px)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          {group.layers.map((layer, j) => (
            <LayerElement key={j} layer={layer} />
          ))}
        </g>
      ))}
      {/* vignette */}
      <rect
        width={SCENE_W}
        height={SCENE_H}
        fill="url(#scene-vignette)"
        pointerEvents="none"
      />
      <defs>
        <radialGradient id="scene-vignette" cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#000" stopOpacity={0} />
          <stop offset="70%" stopColor="#000" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <HotspotLayer scene={scene} state={state} world={world} onHotspot={onHotspot} />
    </svg>
  );
}
