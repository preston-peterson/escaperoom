import type {
  PassageId,
  PassageState,
  RoomId,
  ShiftDef,
  WorldDef,
} from './types.ts';

export type Topology = Record<PassageId, PassageState>;

/** Derive the live topology from a world's passage definitions. */
export function initialTopology(world: WorldDef): Topology {
  const topo: Topology = {};
  for (const p of Object.values(world.passages)) {
    topo[p.id] = { from: p.from, to: p.to, open: p.open, revealed: !p.hidden };
  }
  return topo;
}

/** Apply a shift's ops atomically, returning a new topology. Pure. */
export function applyShift(topo: Topology, shift: ShiftDef): Topology {
  const next: Topology = { ...topo };
  for (const op of shift.ops) {
    const p = next[op.passage];
    if (!p) continue;
    switch (op.type) {
      case 'openPassage':
        next[op.passage] = { ...p, open: true, revealed: true };
        break;
      case 'closePassage':
        next[op.passage] = { ...p, open: false };
        break;
      case 'revealPassage':
        next[op.passage] = { ...p, revealed: true };
        break;
      case 'remapPassage':
        next[op.passage] = {
          ...p,
          from: op.from ?? p.from,
          to: op.to ?? p.to,
        };
        break;
    }
  }
  return next;
}

/** Passages usable from a room right now (open, either direction). */
export function openPassagesFrom(topo: Topology, room: RoomId): PassageId[] {
  return Object.entries(topo)
    .filter(([, p]) => p.open && (p.from === room || p.to === room))
    .map(([id]) => id);
}

/** The room on the other end of a passage. */
export function otherEnd(p: PassageState, room: RoomId): RoomId {
  return p.from === room ? p.to : p.from;
}

/** All rooms reachable from `start` through open passages. */
export function reachableRooms(topo: Topology, start: RoomId): Set<RoomId> {
  const seen = new Set<RoomId>([start]);
  const queue = [start];
  while (queue.length > 0) {
    const room = queue.pop()!;
    for (const id of openPassagesFrom(topo, room)) {
      const next = otherEnd(topo[id], room);
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}
