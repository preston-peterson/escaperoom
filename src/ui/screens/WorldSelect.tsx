import { useEffect, useState } from 'react';
import type { WorldMeta } from '../../engine/types.ts';
import { actRegistry, worldRegistry } from '../../worlds/index.ts';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { loadGame, loadSettings } from '../../engine/save/persistence.ts';
import { formatMs } from '../../engine/timer.ts';

/** One playable world, three sealed doors. */
export function WorldSelect() {
  const setScreen = useUiStore((s) => s.setScreen);
  const setViewMode = useUiStore((s) => s.setViewMode);
  const setWorld = useGameStore((s) => s.setWorld);
  const dispatch = useGameStore((s) => s.dispatch);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saves, setSaves] = useState<Record<string, number>>({});
  const settings = loadSettings();

  useEffect(() => {
    const found: Record<string, number> = {};
    for (const meta of worldRegistry) {
      const save = loadGame(meta.id);
      if (save && save.state.status === 'playing') found[meta.id] = save.savedAt;
    }
    setSaves(found);
  }, []);

  const begin = async (meta: WorldMeta, mode: 'relaxed' | 'challenge' | 'resume') => {
    if (!meta.load || loading) return;
    setLoading(true);
    try {
      const world = await meta.load();
      setWorld(world);
      if (mode === 'resume') {
        const save = loadGame(meta.id);
        if (save) {
          dispatch({ type: 'LOAD_STATE', state: save.state });
        } else {
          dispatch({ type: 'START_GAME', worldId: world.id, mode: 'relaxed', at: Date.now() });
        }
      } else {
        dispatch({ type: 'START_GAME', worldId: world.id, mode, at: Date.now() });
      }
      setViewMode('scene');
      setScreen('game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="world-select">
      <h1>The Atlas</h1>
      {actRegistry.map((act) => (
        <section key={act.id} className="world-act">
          <h2 className="world-act-title">{act.title}</h2>
          <p className="world-act-tagline">{act.tagline}</p>
          <div className="world-cards">
            {worldRegistry
              .filter((meta) => meta.act === act.id)
              .map((meta) => (
          <div
            key={meta.id}
            className={`world-card panel${meta.locked ? ' world-card--locked' : ''}${
              expanded === meta.id ? ' world-card--expanded' : ''
            }`}
            style={{ ['--accent' as string]: meta.accent }}
          >
            <button
              className="world-card-face"
              disabled={meta.locked}
              onClick={() => setExpanded((e) => (e === meta.id ? null : meta.id))}
              aria-expanded={expanded === meta.id}
            >
              <h2>{meta.title}</h2>
              <p>{meta.tagline}</p>
              {meta.locked && <span className="world-seal">Sealed — coming soon</span>}
              {settings.bestTimes[meta.id] !== undefined && (
                <span className="world-best">
                  Best escape: {formatMs(settings.bestTimes[meta.id])}
                </span>
              )}
            </button>
            {expanded === meta.id && !meta.locked && (
              <div className="world-card-actions">
                {saves[meta.id] !== undefined && (
                  <button
                    className="btn btn--primary"
                    disabled={loading}
                    onClick={() => begin(meta, 'resume')}
                  >
                    Resume expedition
                  </button>
                )}
                <button className="btn" disabled={loading} onClick={() => begin(meta, 'relaxed')}>
                  {saves[meta.id] !== undefined ? 'Begin anew' : 'Begin'} — untimed
                </button>
                <button className="btn" disabled={loading} onClick={() => begin(meta, 'challenge')}>
                  Challenge — one hour
                </button>
              </div>
            )}
          </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
