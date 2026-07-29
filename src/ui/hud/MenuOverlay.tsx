import { useState } from 'react';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { audioEngine } from '../../engine/audio/audioEngine.ts';
import { clearSave, saveGame } from '../../engine/save/persistence.ts';

/** Pause menu: sound, restart, return to the surface. */
export function MenuOverlay() {
  const world = useGameStore((s) => s.world);
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const clearGame = useGameStore((s) => s.clearGame);
  const closeOverlay = useUiStore((s) => s.closeOverlay);
  const setScreen = useUiStore((s) => s.setScreen);
  const [muted, setMuted] = useState(audioEngine.muted);
  const [volume, setVolume] = useState(audioEngine.volume);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const quitToSurface = () => {
    if (state && state.status === 'playing') saveGame(state, Date.now());
    closeOverlay();
    clearGame();
    setScreen('worldSelect');
  };

  const restart = () => {
    if (!world || !state) return;
    clearSave(world.id);
    dispatch({ type: 'START_GAME', worldId: world.id, mode: state.timer.mode, at: Date.now() });
    closeOverlay();
    useUiStore.getState().setViewMode('scene');
  };

  return (
    <div className="overlay-backdrop" onClick={closeOverlay}>
      <div
        className="overlay-panel panel menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={closeOverlay} aria-label="Close menu">
          ✕
        </button>
        <h2>A moment's rest</h2>

        <div className="menu-row">
          <label htmlFor="menu-volume">Sound</label>
          <input
            id="menu-volume"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              audioEngine.setVolume(v);
              if (muted && v > 0) {
                setMuted(false);
                audioEngine.setMuted(false);
              }
            }}
          />
          <button
            className="btn"
            aria-pressed={muted}
            onClick={() => {
              audioEngine.setMuted(!muted);
              setMuted(!muted);
            }}
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        <div className="menu-actions">
          {confirmRestart ? (
            <div className="menu-confirm">
              <span>Abandon all progress and descend again?</span>
              <button className="btn btn--primary" onClick={restart}>
                Restart
              </button>
              <button className="btn" onClick={() => setConfirmRestart(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn" onClick={() => setConfirmRestart(true)}>
              Restart this world
            </button>
          )}
          <button className="btn" onClick={quitToSurface}>
            Save & return to the surface
          </button>
        </div>
        <p className="menu-note">Your journey is recorded automatically as you go.</p>
      </div>
    </div>
  );
}
