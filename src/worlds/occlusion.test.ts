import { describe, expect, it } from 'vitest';
import type { GameAction, GameState, HotspotShape, WorldDef } from '../engine/types.ts';
import { reduce } from '../engine/state/reducer.ts';
import { pointerOrder, touchPadded, visibleHotspots } from '../engine/state/selectors.ts';
import { labyrinthWorld } from './labyrinth/world.ts';
import { buildWalkthrough as labyrinthWalkthrough } from './labyrinth/walkthrough.ts';
import { islandWorld } from './island/world.ts';
import { buildWalkthrough as islandWalkthrough } from './island/walkthrough.ts';
import { towerWorld } from './tower/world.ts';
import { buildWalkthrough as towerWalkthrough } from './tower/walkthrough.ts';
import { dreamWorld } from './dream/world.ts';
import { buildWalkthrough as dreamWalkthrough } from './dream/walkthrough.ts';
import { manorWorld } from './manor/world.ts';
import { buildWalkthrough as manorWalkthrough } from './manor/walkthrough.ts';
import { linerWorld } from './liner/world.ts';
import { buildWalkthrough as linerWalkthrough } from './liner/walkthrough.ts';
import { theaterWorld } from './theater/world.ts';
import { buildWalkthrough as theaterWalkthrough } from './theater/walkthrough.ts';
import { expressWorld } from './express/world.ts';
import { buildWalkthrough as expressWalkthrough } from './express/walkthrough.ts';

/**
 * Hotspot-occlusion audit — the "brass knocker" bug class.
 *
 * SVG paints hotspots in scene order, so a LATER hotspot sits on top and
 * receives every pointer event where it overlaps an EARLIER one. If a later
 * hotspot covers (almost) all of an earlier one at any reachable game state,
 * the earlier interaction is effectively unreachable by mouse — invisible to
 * the reducer-level tests, fatal at the pointer layer.
 *
 * For every state along each world's golden walkthrough, this test computes
 * the visible hotspots of the current room and flags any earlier hotspot
 * whose area is >= COVER_THRESHOLD covered by the union of later ones.
 */

const COVER_THRESHOLD = 0.85;
const SAMPLES = 24; // per axis over the covered shape's bounding box

function bbox(shape: HotspotShape): [number, number, number, number] {
  switch (shape.kind) {
    case 'rect':
      return [shape.x, shape.y, shape.x + shape.w, shape.y + shape.h];
    case 'circle':
      return [shape.cx - shape.r, shape.cy - shape.r, shape.cx + shape.r, shape.cy + shape.r];
    case 'polygon': {
      const xs = shape.points.map((p) => p[0]);
      const ys = shape.points.map((p) => p[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    }
  }
}

function contains(shape: HotspotShape, x: number, y: number): boolean {
  switch (shape.kind) {
    case 'rect':
      return x >= shape.x && x <= shape.x + shape.w && y >= shape.y && y <= shape.y + shape.h;
    case 'circle': {
      const dx = x - shape.cx;
      const dy = y - shape.cy;
      return dx * dx + dy * dy <= shape.r * shape.r;
    }
    case 'polygon': {
      // ray casting
      let inside = false;
      const pts = shape.points;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i];
        const [xj, yj] = pts[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }
  }
}

/** Fraction of `inner`'s area covered by the union of `covers`. */
function coveredFraction(inner: HotspotShape, covers: HotspotShape[]): number {
  const [x0, y0, x1, y1] = bbox(inner);
  let total = 0;
  let covered = 0;
  for (let i = 0; i < SAMPLES; i++) {
    for (let j = 0; j < SAMPLES; j++) {
      const x = x0 + ((i + 0.5) / SAMPLES) * (x1 - x0);
      const y = y0 + ((j + 0.5) / SAMPLES) * (y1 - y0);
      if (!contains(inner, x, y)) continue;
      total++;
      if (covers.some((c) => contains(c, x, y))) covered++;
    }
  }
  return total === 0 ? 0 : covered / total;
}

function auditWorld(world: WorldDef, actions: GameAction[], touch = false): string[] {
  const flagged = new Set<string>();
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, world).state;
    const room = state.currentRoom;
    // Mirror the renderer's stacking exactly (largest first), including the
    // finger-sized padding touch devices get.
    const visible = pointerOrder(
      visibleHotspots(state, world, room).map((h) =>
        touch ? { ...h, shape: touchPadded(h.shape) } : h,
      ),
    );
    for (let i = 0; i < visible.length - 1; i++) {
      const later = visible.slice(i + 1).map((h) => h.shape);
      const frac = coveredFraction(visible[i].shape, later);
      if (frac >= COVER_THRESHOLD) {
        flagged.add(
          `${world.id}/${room}: hotspot "${visible[i].id}" (${visible[i].label}) is ` +
            `${Math.round(frac * 100)}% covered by later hotspots — pointer-unreachable`,
        );
      }
    }
  }
  return [...flagged];
}

const worlds: [WorldDef, () => GameAction[]][] = [
  [labyrinthWorld, labyrinthWalkthrough],
  [islandWorld, islandWalkthrough],
  [towerWorld, towerWalkthrough],
  [dreamWorld, dreamWalkthrough],
  [manorWorld, manorWalkthrough],
  [linerWorld, linerWalkthrough],
  [theaterWorld, theaterWalkthrough],
  [expressWorld, expressWalkthrough],
];

describe('hotspot occlusion audit (knocker-bug class)', () => {
  for (const [world, walkthrough] of worlds) {
    it(`${world.id}: no hotspot is buried under later ones at any walkthrough state`, () => {
      const findings = auditWorld(world, walkthrough());
      if (findings.length > 0) console.log(findings.join('\n'));
      expect(findings).toEqual([]);
    });

    it(`${world.id}: touch padding doesn't bury anything either`, () => {
      const findings = auditWorld(world, walkthrough(), true);
      if (findings.length > 0) console.log(findings.join('\n'));
      expect(findings).toEqual([]);
    });
  }
});
