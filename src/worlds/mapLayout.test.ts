import { describe, expect, it } from 'vitest';
import type { GameAction, GameState, MapLayout, RoomId, WorldDef } from '../engine/types.ts';
import { reduce } from '../engine/state/reducer.ts';
import { mapView } from '../engine/state/selectors.ts';
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
 * Map-screen audit — the board's counterpart to the scene occlusion test.
 *
 * The map is where the player clicks to move, so three things must hold:
 *  1. Room nodes never overlap (an overlapping node steals the neighbour's
 *     clicks — the knocker bug, on the board).
 *  2. Every node, with room for its name beneath it, sits inside the map's
 *     viewBox — otherwise it is cropped off-screen and unclickable.
 *  3. Nodes are far enough apart that their name labels stay legible.
 *
 * Geometry mirrors MapView: square = w×h centered on (x,y) (default 92),
 * circle/hex = radius w/2, label baseline at y + h/2 + 24.
 */

const ROOM_SIZE = 92;
const LABEL_DROP = 24; // baseline offset below the node in MapView
const LABEL_LINE = 20; // font-size 17 plus a little air
const MIN_GAP = 6; // nodes must not merely touch

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function nodeBox(layout: MapLayout['rooms'][string]): Box {
  const w = layout.w ?? ROOM_SIZE;
  const h = layout.h ?? ROOM_SIZE;
  return {
    x0: layout.x - w / 2,
    y0: layout.y - h / 2,
    x1: layout.x + w / 2,
    y1: layout.y + h / 2,
  };
}

/** Node box grown to include the room name printed beneath it. */
function nodeWithLabelBox(layout: MapLayout['rooms'][string], name: string): Box {
  const box = nodeBox(layout);
  const labelHalfWidth = Math.max((name.length * 8.6) / 2, (layout.w ?? ROOM_SIZE) / 2);
  return {
    x0: Math.min(box.x0, layout.x - labelHalfWidth),
    y0: box.y0,
    x1: Math.max(box.x1, layout.x + labelHalfWidth),
    y1: box.y1 + LABEL_DROP + LABEL_LINE,
  };
}

function overlap(a: Box, b: Box): number {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Gap between two boxes; negative means they intersect. */
function gap(a: Box, b: Box): number {
  const dx = Math.max(a.x0 - b.x1, b.x0 - a.x1);
  const dy = Math.max(a.y0 - b.y1, b.y0 - a.y1);
  return Math.max(dx, dy);
}

function auditLayout(world: WorldDef): string[] {
  const problems: string[] = [];
  const [vx, vy, vw, vh] = world.map.viewBox;
  const ids = Object.keys(world.map.rooms);

  for (const id of ids) {
    const layout = world.map.rooms[id];
    const withLabel = nodeWithLabelBox(layout, world.rooms[id]?.name ?? id);
    if (
      withLabel.x0 < vx ||
      withLabel.y0 < vy ||
      withLabel.x1 > vx + vw ||
      withLabel.y1 > vy + vh
    ) {
      problems.push(
        `${world.id}: room node "${id}" (with its label) falls outside the map viewBox — cropped off-screen`,
      );
    }
  }

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = nodeBox(world.map.rooms[ids[i]]);
      const b = nodeBox(world.map.rooms[ids[j]]);
      if (overlap(a, b) > 0) {
        problems.push(
          `${world.id}: room nodes "${ids[i]}" and "${ids[j]}" overlap — one steals the other's clicks`,
        );
      } else if (gap(a, b) < MIN_GAP) {
        problems.push(
          `${world.id}: room nodes "${ids[i]}" and "${ids[j]}" are touching (gap ${gap(a, b).toFixed(1)}px)`,
        );
      }
    }
  }
  return problems;
}

/** Every room the player can actually reach must be drawable on the board. */
function auditReachable(world: WorldDef, actions: GameAction[]): string[] {
  const problems = new Set<string>();
  let state = {} as GameState;
  for (const action of actions) {
    state = reduce(state, action, world).state;
    const view = mapView(state);
    for (const r of view.rooms) {
      if (!world.map.rooms[r.id]) {
        problems.add(`${world.id}: room "${r.id}" appears on the map with no layout entry`);
      }
    }
  }
  const visited = Object.keys(state.visitedRooms) as RoomId[];
  for (const id of visited) {
    if (!world.map.rooms[id]) {
      problems.add(`${world.id}: visited room "${id}" has no map layout`);
    }
  }
  return [...problems];
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

describe('map screen audit', () => {
  for (const [world, walkthrough] of worlds) {
    it(`${world.id}: room nodes never collide and always fit the board`, () => {
      const findings = auditLayout(world);
      if (findings.length > 0) console.log(findings.join('\n'));
      expect(findings).toEqual([]);
    });

    it(`${world.id}: every room reachable in play is drawable on the map`, () => {
      const findings = auditReachable(world, walkthrough());
      if (findings.length > 0) console.log(findings.join('\n'));
      expect(findings).toEqual([]);
    });
  }
});
