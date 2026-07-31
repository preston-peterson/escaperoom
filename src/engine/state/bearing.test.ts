import { describe, expect, it } from 'vitest';
import type { WorldDef } from '../types.ts';
import { bearing } from './selectors.ts';
import { miniWorld } from '../__fixtures__/miniWorld.ts';

/** SVG y grows downward, so "up the screen" must read as north. */
function worldWith(rooms: Record<string, { x: number; y: number }>): WorldDef {
  return {
    ...miniWorld,
    map: {
      ...miniWorld.map,
      rooms: Object.fromEntries(
        Object.entries(rooms).map(([id, p]) => [id, { ...p, shape: 'square' as const }]),
      ),
    },
  };
}

describe('bearing', () => {
  const world = worldWith({
    hub: { x: 500, y: 500 },
    up: { x: 500, y: 100 },
    down: { x: 500, y: 900 },
    right: { x: 900, y: 500 },
    left: { x: 100, y: 500 },
    upright: { x: 900, y: 100 },
  });

  it('reads screen-up as north and screen-down as south', () => {
    expect(bearing(world, 'hub', 'up')).toBe('north');
    expect(bearing(world, 'hub', 'down')).toBe('south');
  });

  it('reads east and west', () => {
    expect(bearing(world, 'hub', 'right')).toBe('east');
    expect(bearing(world, 'hub', 'left')).toBe('west');
  });

  it('reads diagonals', () => {
    expect(bearing(world, 'hub', 'upright')).toBe('north-east');
  });

  it('returns null for unknown or coincident rooms', () => {
    expect(bearing(world, 'hub', 'nowhere')).toBeNull();
    expect(bearing(world, 'hub', 'hub')).toBeNull();
  });
});
