import type { ComponentType } from 'react';
import type { PrimitiveName } from '../../engine/types.ts';
import type { ArtProps } from './primitives/structure.tsx';
import {
  StoneWall,
  Archway,
  Pillar,
  Stairs,
  Door,
  Rubble,
} from './primitives/structure.tsx';
import { Torch, Brazier, Glint } from './primitives/light.tsx';
import { Fog, WaterPool } from './primitives/nature.tsx';
import { Gear, Lever, GlyphPanel, Pedestal } from './primitives/mech.tsx';
import {
  Sea,
  Tree,
  ClockFace,
  Pipes,
  FloatingIsle,
  Portal,
} from './primitives/worlds.tsx';

export const primitiveRegistry: Record<PrimitiveName, ComponentType<ArtProps>> = {
  stoneWall: StoneWall,
  archway: Archway,
  pillar: Pillar,
  stairs: Stairs,
  door: Door,
  rubble: Rubble,
  torch: Torch,
  brazier: Brazier,
  glint: Glint,
  fog: Fog,
  waterPool: WaterPool,
  gear: Gear,
  lever: Lever,
  glyphPanel: GlyphPanel,
  pedestal: Pedestal,
  sea: Sea,
  tree: Tree,
  clockFace: ClockFace,
  pipes: Pipes,
  floatingIsle: FloatingIsle,
  portal: Portal,
};
