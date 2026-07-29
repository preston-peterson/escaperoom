import { useEffect, useRef } from 'react';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { saveGame, recordCompletion, clearSave } from '../../engine/save/persistence.ts';
import { MapView } from '../map/MapView.tsx';
import { SceneView } from '../scene/SceneView.tsx';
import { InventoryBar } from '../hud/InventoryBar.tsx';
import { TimerDisplay } from '../hud/TimerDisplay.tsx';
import { Toasts } from '../hud/Toasts.tsx';
import { PuzzleOverlay } from '../puzzles/PuzzleOverlay.tsx';
import { JournalPanel } from '../hud/JournalPanel.tsx';
import { MenuOverlay } from '../hud/MenuOverlay.tsx';
import { allowMove } from '../moveGuard.ts';

/** Hosts map/scene views, HUD, overlays, and all store→UI side-channel wiring. */
export function GameScreen() {
  const world = useGameStore((s) => s.world);
  const state = useGameStore((s) => s.state);
  const seq = useGameStore((s) => s.seq);
  const dispatch = useGameStore((s) => s.dispatch);
  const viewMode = useUiStore((s) => s.viewMode);
  const setViewMode = useUiStore((s) => s.setViewMode);
  const overlay = useUiStore((s) => s.overlay);
  const openOverlay = useUiStore((s) => s.openOverlay);
  const closeOverlay = useUiStore((s) => s.closeOverlay);
  const setScreen = useUiStore((s) => s.setScreen);
  const processedSeq = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dispatch notes → toasts + shift cue. Each seq is processed exactly once.
  useEffect(() => {
    if (seq === processedSeq.current) return;
    processedSeq.current = seq;
    const { lastNotes, world: w } = useGameStore.getState();
    const ui = useUiStore.getState();
    if (!lastNotes || !w) return;
    for (const text of lastNotes.narrations) ui.pushToast('narration', text);
    for (const id of lastNotes.unlockedAchievements) {
      const def = w.achievements.find((a) => a.id === id);
      if (def) ui.pushToast('achievement', `${def.title} — ${def.description}`);
    }
    if (lastNotes.shift) {
      ui.setShiftCue(lastNotes.shift);
      ui.setViewMode('map'); // watch the maze reorganize
    }
  }, [seq]);

  // Autosave, throttled.
  useEffect(() => {
    if (!state || state.status !== 'playing') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveGame(state, Date.now()), 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  // Victory transition.
  useEffect(() => {
    if (state?.status === 'won' && world) {
      clearSave(world.id);
      recordCompletion(world.id, state.timer.finishedInMs, state.achievementsUnlocked);
      const t = setTimeout(() => setScreen('victory'), 2400);
      return () => clearTimeout(t);
    }
  }, [state?.status, world, state, setScreen]);

  // Escape closes overlays, then toggles map/scene.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const ui = useUiStore.getState();
        if (ui.overlay) ui.closeOverlay();
        else ui.setViewMode(ui.viewMode === 'map' ? 'scene' : 'map');
      } else if (e.key === 'm' || e.key === 'M') {
        const ui = useUiStore.getState();
        if (!ui.overlay) ui.setViewMode(ui.viewMode === 'map' ? 'scene' : 'map');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!world || !state) return null;

  return (
    <div className="game-screen">
      <header className="game-header">
        <span className="game-world-title">{world.title}</span>
        <div className="game-header-right">
          <TimerDisplay />
          <button
            className="btn"
            onClick={() => setViewMode(viewMode === 'map' ? 'scene' : 'map')}
            aria-pressed={viewMode === 'map'}
          >
            {viewMode === 'map' ? 'Look around' : 'Consult the map'}
          </button>
          <button className="btn" onClick={() => openOverlay({ kind: 'journal' })}>
            Journal
          </button>
          <button className="btn" onClick={() => openOverlay({ kind: 'menu' })} aria-label="Menu">
            ≡
          </button>
        </div>
      </header>

      <main className="game-main">
        {viewMode === 'map' ? (
          <MapView
            state={state}
            world={world}
            onMove={(passage) => {
              if (allowMove()) dispatch({ type: 'MOVE', passage, at: Date.now() });
            }}
            onEnterRoom={() => setViewMode('scene')}
          />
        ) : (
          <SceneView state={state} world={world} />
        )}
      </main>

      <InventoryBar />
      <Toasts />

      {overlay?.kind === 'puzzle' && <PuzzleOverlay puzzle={overlay.puzzle} />}
      {overlay?.kind === 'journal' && <JournalPanel />}
      {overlay?.kind === 'menu' && <MenuOverlay />}

      {state.status === 'won' && (
        <div className="won-veil" aria-hidden>
          <p>The Ember blazes. The maze exhales.</p>
        </div>
      )}

      {state.status === 'timeExpired' && (
        <div className="overlay-backdrop">
          <div className="overlay-panel panel" role="dialog" aria-label="Time has run out">
            <h2>The hour is spent</h2>
            <p className="puzzle-prompt">
              The torches gutter out one by one. The labyrinth keeps its secret — this time.
            </p>
            <div className="menu-actions">
              <button
                className="btn btn--primary"
                onClick={() => {
                  clearSave(world.id);
                  closeOverlay();
                  dispatch({
                    type: 'START_GAME',
                    worldId: world.id,
                    mode: 'challenge',
                    at: Date.now(),
                  });
                  setViewMode('scene');
                }}
              >
                Descend again
              </button>
              <button
                className="btn"
                onClick={() => {
                  clearSave(world.id);
                  useGameStore.getState().clearGame();
                  setScreen('worldSelect');
                }}
              >
                Return to the surface
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
