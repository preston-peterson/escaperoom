import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { progress } from '../../engine/state/selectors.ts';
import { allLoreFound } from '../../engine/achievements.ts';
import { formatMs } from '../../engine/timer.ts';

/** The debrief: epilogue, stats, achievements. */
export function VictoryScreen() {
  const world = useGameStore((s) => s.world);
  const state = useGameStore((s) => s.state);
  const clearGame = useGameStore((s) => s.clearGame);
  const setScreen = useUiStore((s) => s.setScreen);

  if (!world || !state) {
    return (
      <div className="victory-screen">
        <button className="btn" onClick={() => setScreen('worldSelect')}>
          Return
        </button>
      </div>
    );
  }

  const p = progress(state, world);
  const lore = allLoreFound(state, world);

  return (
    <div className="victory-screen">
      <h1>You have escaped</h1>
      <div className="victory-epilogue panel">
        <p>{world.epilogue}</p>
        {lore && world.loreEpilogue && (
          <p className="victory-lore">{world.loreEpilogue}</p>
        )}
      </div>

      <dl className="victory-stats">
        {state.timer.finishedInMs !== undefined && (
          <div>
            <dt>Time below</dt>
            <dd>{formatMs(state.timer.finishedInMs)}</dd>
          </div>
        )}
        <div>
          <dt>Mechanisms solved</dt>
          <dd>
            {p.solved} / {p.total}
          </dd>
        </div>
        <div>
          <dt>Hints consulted</dt>
          <dd>{p.hintsUsed}</dd>
        </div>
        <div>
          <dt>Chambers charted</dt>
          <dd>
            {p.roomsVisited} / {p.roomCount}
          </dd>
        </div>
        <div>
          <dt>Journal entries</dt>
          <dd>
            {p.journalCount} / {p.journalTotal}
          </dd>
        </div>
        <div>
          <dt>Secrets</dt>
          <dd>{p.secrets}</dd>
        </div>
      </dl>

      <section className="victory-achievements">
        <h2>Marks of the descent</h2>
        <ul>
          {world.achievements.map((a) => {
            const earned = state.achievementsUnlocked[a.id] !== undefined;
            if (a.secret && !earned) {
              return (
                <li key={a.id} className="ach ach--hidden">
                  <span className="ach-title">A secret remains…</span>
                </li>
              );
            }
            return (
              <li key={a.id} className={`ach${earned ? ' ach--earned' : ''}`}>
                <span className="ach-mark">{earned ? '✦' : '·'}</span>
                <span className="ach-title">{a.title}</span>
                <span className="ach-desc">{a.description}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="menu-actions">
        <button
          className="btn btn--primary"
          onClick={() => {
            clearGame();
            setScreen('worldSelect');
          }}
        >
          Return to the surface
        </button>
      </div>
    </div>
  );
}
