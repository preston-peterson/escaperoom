import { useEffect, useState, type ReactNode } from 'react';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import type { ShiftDef } from '../../engine/types.ts';

export interface ShiftAnimation {
  shift: ShiftDef;
  cueSeq: number;
}

/**
 * Watches the uiStore shift cue and wraps the map in a rumble while the
 * shift's visual plays. The topology in state is already final — the
 * animation is pure theater layered on top.
 */
export function ShiftAnimator({
  children,
  onActive,
}: {
  children: ReactNode;
  onActive?: (anim: ShiftAnimation | null) => void;
}) {
  const shiftCue = useUiStore((s) => s.shiftCue);
  const clearShiftCue = useUiStore((s) => s.clearShiftCue);
  const world = useGameStore((s) => s.world);
  const [active, setActive] = useState<ShiftAnimation | null>(null);

  useEffect(() => {
    if (!shiftCue || !world) return;
    const def = world.shifts[shiftCue.shift];
    if (!def) {
      clearShiftCue();
      return;
    }
    const anim = { shift: def, cueSeq: shiftCue.cueSeq };
    setActive(anim);
    onActive?.(anim);
    const t = setTimeout(() => {
      setActive(null);
      onActive?.(null);
      clearShiftCue();
    }, def.durationMs);
    return () => clearTimeout(t);
  }, [shiftCue, world, clearShiftCue, onActive]);

  return (
    <div
      className={active ? 'rumbling' : undefined}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </div>
  );
}
