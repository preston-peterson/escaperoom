/**
 * Core data model for the escape-room labyrinth engine.
 *
 * Everything here is serializable data. The engine (reducer, topology,
 * validators) operates purely on these types; the UI renders them; worlds
 * are big literal objects of them.
 */

export type RoomId = string;
export type PassageId = string;
export type PuzzleId = string;
export type ItemId = string;
export type JournalId = string;
export type ShiftId = string;
export type FlagId = string;
export type PaletteId = string;
export type PrimitiveName =
  | 'stoneWall'
  | 'archway'
  | 'torch'
  | 'brazier'
  | 'fog'
  | 'waterPool'
  | 'gear'
  | 'pillar'
  | 'stairs'
  | 'door'
  | 'glyphPanel'
  | 'rubble'
  | 'lever'
  | 'pedestal'
  | 'glint'
  | 'sea'
  | 'tree'
  | 'clockFace'
  | 'pipes'
  | 'floatingIsle'
  | 'portal';

// ---------------------------------------------------------------------------
// Conditions & effects — the small DSL shared by scenes, hotspots, puzzles
// ---------------------------------------------------------------------------

export type Condition =
  | { flag: FlagId }
  | { solved: PuzzleId }
  | { hasItem: ItemId }
  | { visited: RoomId }
  | { not: Condition }
  | { all: Condition[] }
  | { any: Condition[] };

export type SoundCue =
  | 'chime'
  | 'rumble'
  | 'pickup'
  | 'unlock'
  | 'thud'
  | 'secret';

export type EffectDef =
  | { type: 'setFlag'; flag: FlagId }
  | { type: 'giveItem'; item: ItemId }
  | { type: 'removeItem'; item: ItemId }
  | { type: 'unlockJournal'; entry: JournalId }
  | { type: 'triggerShift'; shift: ShiftId }
  | { type: 'markSecret'; secret: string }
  | { type: 'narrate'; text: string }
  | { type: 'sound'; cue: SoundCue };

// ---------------------------------------------------------------------------
// Scenes — data-defined composition of coded SVG primitives
// ---------------------------------------------------------------------------

/** All scenes render into a fixed 1600x900 viewBox, scaled to fit. */
export const SCENE_W = 1600;
export const SCENE_H = 900;

export type SceneLayer =
  | {
      kind: 'primitive';
      primitive: PrimitiveName;
      x: number;
      y: number;
      scale?: number;
      rotate?: number;
      /** 0 = far background … 1 = foreground; drives pointer parallax. */
      parallax?: number;
      props?: Record<string, string | number | boolean>;
      if?: Condition;
    }
  | {
      kind: 'path';
      d: string;
      fill: string;
      opacity?: number;
      parallax?: number;
      if?: Condition;
    };

export type HotspotShape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'polygon'; points: [number, number][] };

export type HotspotAction =
  | { type: 'inspect'; text: string; effects?: EffectDef[] }
  | { type: 'pickup'; item: ItemId }
  | { type: 'puzzle'; puzzle: PuzzleId }
  | { type: 'navigate'; passage: PassageId }
  | { type: 'useItem'; accepts: ItemId[]; effects: EffectDef[]; wrongItemText: string };

export interface HotspotDef {
  id: string;
  shape: HotspotShape;
  /** Tooltip + aria-label; the game is keyboard-playable. */
  label: string;
  if?: Condition;
  /** Hide once this condition holds (e.g. item already picked up). */
  hideWhen?: Condition;
  action: HotspotAction;
}

export interface SceneDef {
  palette: PaletteId;
  layers: SceneLayer[];
  hotspots: HotspotDef[];
}

// ---------------------------------------------------------------------------
// Rooms, passages, map
// ---------------------------------------------------------------------------

export interface AmbienceProfile {
  drip: number; // 0..1
  torch: number; // 0..1
  wind: number; // 0..1
  tone: 'low' | 'mid' | 'deep';
}

export interface RoomDef {
  id: RoomId;
  name: string;
  scene: SceneDef;
  ambience: AmbienceProfile;
  onFirstEnter?: EffectDef[];
}

export interface PassageDef {
  id: PassageId;
  from: RoomId;
  to: RoomId;
  /** Initial open state; live state lives in GameState.topology. */
  open: boolean;
  /** Not drawn on the map until revealed by a shift. */
  hidden?: boolean;
  /** Shown when the player tries a closed passage. */
  closedText?: string;
}

export interface MapLayout {
  viewBox: [number, number, number, number];
  rooms: Record<
    RoomId,
    { x: number; y: number; shape: 'square' | 'circle' | 'hex'; w?: number; h?: number }
  >;
  passageWaypoints?: Record<PassageId, [number, number][]>;
}

// ---------------------------------------------------------------------------
// Puzzles
// ---------------------------------------------------------------------------

export interface PuzzleBase {
  id: PuzzleId;
  title: string;
  /** In-fiction framing shown in the overlay. */
  prompt: string;
  /** Prerequisite to open the puzzle at all (e.g. must hold an item). */
  if?: Condition;
  /** Shown when `if` fails and the player clicks the puzzle hotspot. */
  lockedText?: string;
  /** nudge → hint → full solution */
  hints: [string, string, string];
  onSolve: EffectDef[];
}

export type PuzzleDef = PuzzleBase &
  (
    | { type: 'combination'; slots: number; symbols: string[]; answer: string[] }
    | { type: 'cipher'; answer: string; accept?: string[]; placeholder?: string }
    | {
        type: 'sequence';
        elements: { id: string; label: string }[];
        answer: string[];
        resetOnError: boolean;
      }
    | {
        type: 'rotary';
        rings: { id: string; positions: number; glyphs: string[] }[];
        answer: number[];
      }
    | {
        type: 'itemPlacement';
        sockets: { id: string; label: string; accepts: ItemId }[];
      }
  );

export type PuzzleSubmission =
  | { type: 'combination'; values: string[] }
  | { type: 'cipher'; text: string }
  | { type: 'sequence'; order: string[] }
  | { type: 'rotary'; positions: number[] }
  | { type: 'itemPlacement'; placements: Record<string, ItemId> };

export interface ValidationResult {
  correct: boolean;
  feedback?: string;
}

// ---------------------------------------------------------------------------
// Maze shifts
// ---------------------------------------------------------------------------

export type ShiftOp =
  | { type: 'openPassage'; passage: PassageId }
  | { type: 'closePassage'; passage: PassageId }
  | { type: 'revealPassage'; passage: PassageId }
  | { type: 'remapPassage'; passage: PassageId; from?: RoomId; to?: RoomId };

export interface ShiftDef {
  id: ShiftId;
  /** Applied atomically to GameState.topology. */
  ops: ShiftOp[];
  narration: string;
  /** Visual hint only — the logic is entirely in `ops`. */
  mapAnimation: 'rotate' | 'slide' | 'reveal' | 'rumble';
  animTarget?: RoomId;
  animDegrees?: number;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Items, journal, achievements
// ---------------------------------------------------------------------------

export interface ItemDef {
  id: ItemId;
  name: string;
  description: string;
  icon: PrimitiveName;
}

export interface JournalEntryDef {
  id: JournalId;
  title: string;
  body: string;
  category: 'lore' | 'clue' | 'mechanism';
  countsTowardLore?: boolean;
}

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  secret?: boolean;
} & (
  | { check: 'worldComplete' }
  | { check: 'noHints' }
  | { check: 'timeUnder'; ms: number }
  | { check: 'allRoomsVisited' }
  | { check: 'allJournal' }
  | { check: 'secretFound'; secretId: string }
);

// ---------------------------------------------------------------------------
// World
// ---------------------------------------------------------------------------

export interface WorldDef {
  id: string;
  title: string;
  tagline: string;
  entryRoom: RoomId;
  /** Countdown length for challenge mode. */
  challengeDurationMs?: number;
  rooms: Record<RoomId, RoomDef>;
  passages: Record<PassageId, PassageDef>;
  puzzles: Record<PuzzleId, PuzzleDef>;
  items: Record<ItemId, ItemDef>;
  journal: Record<JournalId, JournalEntryDef>;
  shifts: Record<ShiftId, ShiftDef>;
  achievements: AchievementDef[];
  map: MapLayout;
  /** Solving this puzzle wins the game. */
  finalPuzzle: PuzzleId;
  /** Extra epilogue paragraph when all lore journal entries were found. */
  loreEpilogue?: string;
  epilogue: string;
}

export interface WorldMeta {
  id: string;
  title: string;
  tagline: string;
  accent: string;
  locked: boolean;
  load?: () => Promise<WorldDef>;
}

// ---------------------------------------------------------------------------
// Runtime state — fully serializable, mutated only via dispatched actions
// ---------------------------------------------------------------------------

export interface PassageState {
  from: RoomId;
  to: RoomId;
  open: boolean;
  revealed: boolean;
}

export interface PuzzleState {
  solved: boolean;
  hintsUsed: 0 | 1 | 2 | 3;
  attempts: number;
  solvedAt?: number;
}

export interface TimerState {
  mode: 'relaxed' | 'challenge';
  startedAt: number;
  pausedMs: number;
  pausedSince: number | null;
  finishedInMs?: number;
}

export interface GameState {
  schemaVersion: 1;
  worldId: string;
  status: 'playing' | 'won' | 'timeExpired';
  currentRoom: RoomId;
  visitedRooms: Record<RoomId, true>;
  topology: Record<PassageId, PassageState>;
  flags: Record<FlagId, true>;
  inventory: ItemId[];
  puzzles: Record<PuzzleId, PuzzleState>;
  journal: { id: JournalId; unlockedAt: number }[];
  appliedShifts: ShiftId[];
  secretsFound: string[];
  timer: TimerState;
  /** id → unlock timestamp */
  achievementsUnlocked: Record<string, number>;
}

export type GameAction =
  | { type: 'START_GAME'; worldId: string; mode: 'relaxed' | 'challenge'; at: number }
  | { type: 'MOVE'; passage: PassageId; at: number }
  | { type: 'INTERACT'; hotspot: string; at: number }
  | { type: 'USE_ITEM'; hotspot: string; item: ItemId; at: number }
  | { type: 'SUBMIT_PUZZLE'; puzzle: PuzzleId; submission: PuzzleSubmission; at: number }
  | { type: 'REVEAL_HINT'; puzzle: PuzzleId; tier: 1 | 2 | 3; at: number }
  | { type: 'PAUSE'; at: number }
  | { type: 'RESUME'; at: number }
  | { type: 'TIME_EXPIRED'; at: number }
  | { type: 'LOAD_STATE'; state: GameState };

/**
 * Side-channel notes the reducer records about the last action, for UI/audio
 * subscribers (narration toasts, sound cues, shift animations). Cleared on
 * every dispatch; NOT part of the persisted state.
 */
export interface ReducerNotes {
  narrations: string[];
  sounds: SoundCue[];
  shift?: ShiftId;
  solvedPuzzle?: PuzzleId;
  pickedUpItem?: ItemId;
  unlockedAchievements: string[];
  journalUnlocks: JournalId[];
  blockedMove?: PassageId;
}
