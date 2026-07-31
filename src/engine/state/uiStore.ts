import { create } from 'zustand';
import type { ItemId, PuzzleId, ShiftId } from '../types.ts';

export type Overlay =
  | { kind: 'puzzle'; puzzle: PuzzleId }
  | { kind: 'journal' }
  | { kind: 'menu' }
  | null;

export interface Toast {
  id: number;
  kind: 'narration' | 'achievement';
  text: string;
}

export interface ShiftCue {
  shift: ShiftId;
  cueSeq: number;
}

/**
 * Ephemeral view state — never persisted, never synced. In future co-op each
 * player has their own copy of all of this.
 */
export interface UiStore {
  screen: 'title' | 'worldSelect' | 'game' | 'victory';
  viewMode: 'map' | 'scene';
  overlay: Overlay;
  selectedItem: ItemId | null;
  toasts: Toast[];
  shiftCue: ShiftCue | null;
  /** "Look around": outlines every live hotspot and lists them by name. */
  looking: boolean;
  setScreen: (screen: UiStore['screen']) => void;
  setViewMode: (mode: UiStore['viewMode']) => void;
  openOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
  selectItem: (item: ItemId | null) => void;
  pushToast: (kind: Toast['kind'], text: string) => void;
  dismissToast: (id: number) => void;
  setShiftCue: (shift: ShiftId) => void;
  clearShiftCue: () => void;
  toggleLooking: () => void;
}

let toastCounter = 0;
let shiftCueCounter = 0;

export const useUiStore = create<UiStore>((set) => ({
  screen: 'title',
  viewMode: 'scene',
  overlay: null,
  selectedItem: null,
  toasts: [],
  shiftCue: null,
  looking: false,
  setScreen: (screen) => set({ screen }),
  setViewMode: (viewMode) => set({ viewMode }),
  openOverlay: (overlay) => set({ overlay }),
  closeOverlay: () => set({ overlay: null }),
  selectItem: (selectedItem) => set({ selectedItem }),
  pushToast: (kind, text) =>
    set((s) => ({
      // Cap the stack at 3 — persistent toasts must not wall off the scene.
      toasts: [...s.toasts.slice(-2), { id: ++toastCounter, kind, text }],
    })),
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setShiftCue: (shift) =>
    set({ shiftCue: { shift, cueSeq: ++shiftCueCounter } }),
  clearShiftCue: () => set({ shiftCue: null }),
  toggleLooking: () => set((s) => ({ looking: !s.looking })),
}));
