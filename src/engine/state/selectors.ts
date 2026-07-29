import type {
  GameState,
  HotspotDef,
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
