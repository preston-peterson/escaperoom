import type {
  GameState,
  HotspotDef,
  HotspotShape,
  PassageId,
  RoomId,
  SceneLayer,
  WorldDef,
} from '../types.ts';
import { condHolds, evalCondition } from './conditions.ts';
import { otherEnd } from '../topology.ts';

/** Scene layers currently visible in a room. */
export function visibleLayers(
  state: GameState,
  world: WorldDef,
  room: RoomId,
): SceneLayer[] {
  const scene = world.rooms[room]?.scene;
  if (!scene) return [];
  return scene.layers.filter((l) => condHolds(l.if, state));
}

/** Hotspots currently interactive in a room. */
export function visibleHotspots(
  state: GameState,
  world: WorldDef,
  room: RoomId,
): HotspotDef[] {
  const scene = world.rooms[room]?.scene;
  if (!scene) return [];
  return scene.hotspots.filter(
    (h) =>
      condHolds(h.if, state) && !(h.hideWhen && evalCondition(h.hideWhen, state)),
  );
}

/**
 * Smallest comfortable touch target, expressed in scene units.
 *
 * A landscape phone renders the 1600-unit-wide scene at roughly 0.53 CSS px
 * per unit, so the 44px minimum both Apple and Google recommend works out at
 * about 83 units. Deriving it from a fixed reference rather than measuring at
 * runtime keeps the value pure, so the occlusion audit can check exactly what
 * the renderer will draw.
 */
export const TOUCH_TARGET_UNITS = 83;

/** Grow a shape's hit area to the touch minimum, leaving its art untouched. */
export function touchPadded(shape: HotspotShape): HotspotShape {
  switch (shape.kind) {
    case 'rect': {
      const w = Math.max(shape.w, TOUCH_TARGET_UNITS);
      const h = Math.max(shape.h, TOUCH_TARGET_UNITS);
      return {
        kind: 'rect',
        x: shape.x - (w - shape.w) / 2,
        y: shape.y - (h - shape.h) / 2,
        w,
        h,
      };
    }
    case 'circle':
      return { ...shape, r: Math.max(shape.r, TOUCH_TARGET_UNITS / 2) };
    case 'polygon': {
      // Polygons are the odd shapes (chasms, serpent mouths) and are already
      // large; padding one would distort it, so leave it be.
      return shape;
    }
  }
}

export function shapeArea(shape: HotspotShape): number {
  switch (shape.kind) {
    case 'rect':
      return shape.w * shape.h;
    case 'circle':
      return Math.PI * shape.r * shape.r;
    case 'polygon': {
      // shoelace
      let sum = 0;
      const pts = shape.points;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        sum += x1 * y2 - x2 * y1;
      }
      return Math.abs(sum) / 2;
    }
  }
}

/**
 * Pointer stacking order: largest hotspots first (bottom), smallest last
 * (top), so a specific target — a knocker, a lock, a dropped pipe — always
 * wins pointer events over the broad navigate/inspect zone behind it.
 * Authoring order in scene data carries no pointer meaning. Used by both the
 * scene renderer and the occlusion audit; they must never diverge.
 */
export function pointerOrder(hotspots: HotspotDef[]): HotspotDef[] {
  return [...hotspots].sort((a, b) => shapeArea(b.shape) - shapeArea(a.shape));
}

export interface MapRoomView {
  id: RoomId;
  visited: boolean;
  isCurrent: boolean;
}

export interface MapPassageView {
  id: PassageId;
  from: RoomId;
  to: RoomId;
  open: boolean;
}

/**
 * Fog-of-war projection of the map: visited rooms are drawn fully; unvisited
 * rooms adjacent through a revealed passage appear as dim outlines; passages
 * are drawn when revealed and touching a visited room.
 */
export function mapView(state: GameState): {
  rooms: MapRoomView[];
  passages: MapPassageView[];
} {
  const visited = state.visitedRooms;
  const roomIds = new Set<RoomId>(Object.keys(visited));
  const passages: MapPassageView[] = [];
  for (const [id, p] of Object.entries(state.topology)) {
    if (!p.revealed) continue;
    if (!visited[p.from] && !visited[p.to]) continue;
    passages.push({ id, from: p.from, to: p.to, open: p.open });
    roomIds.add(p.from);
    roomIds.add(p.to);
  }
  const rooms: MapRoomView[] = [...roomIds].map((id) => ({
    id,
    visited: visited[id] === true,
    isCurrent: id === state.currentRoom,
  }));
  return { rooms, passages };
}

/** Open passages leading out of the current room (for map click targets). */
export function currentExits(state: GameState): { passage: PassageId; to: RoomId }[] {
  const room = state.currentRoom;
  return Object.entries(state.topology)
    .filter(([, p]) => p.revealed && (p.from === room || p.to === room))
    .map(([id, p]) => ({ passage: id, to: otherEnd(p, room) }));
}

/** Progress summary for HUD / victory screen. */
export function progress(state: GameState, world: WorldDef) {
  const total = Object.keys(world.puzzles).length;
  const solved = Object.values(state.puzzles).filter((p) => p.solved).length;
  const hintsUsed = Object.values(state.puzzles).reduce(
    (n, p) => n + p.hintsUsed,
    0,
  );
  const roomsVisited = Object.keys(state.visitedRooms).length;
  return {
    solved,
    total,
    hintsUsed,
    roomsVisited,
    roomCount: Object.keys(world.rooms).length,
    secrets: state.secretsFound.length,
    journalCount: state.journal.length,
    journalTotal: Object.keys(world.journal).length,
  };
}
