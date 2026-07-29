import { useState } from 'react';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';

const CATEGORY_LABELS = {
  lore: "Vell's Notes",
  clue: 'Observations',
  mechanism: 'Mechanisms',
} as const;

/** The explorer's journal: everything discovered so far, grouped and readable. */
export function JournalPanel() {
  const world = useGameStore((s) => s.world);
  const entries = useGameStore((s) => s.state?.journal ?? []);
  const closeOverlay = useUiStore((s) => s.closeOverlay);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!world) return null;

  const byCategory = (['clue', 'mechanism', 'lore'] as const).map((cat) => ({
    cat,
    items: entries
      .map((e) => world.journal[e.id])
      .filter((def) => def && def.category === cat),
  }));

  return (
    <div className="overlay-backdrop" onClick={closeOverlay}>
      <div
        className="overlay-panel panel journal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Journal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={closeOverlay} aria-label="Close journal">
          ✕
        </button>
        <h2>Journal</h2>
        {entries.length === 0 && (
          <p className="journal-empty">
            The pages are blank. What you discover will be recorded here.
          </p>
        )}
        <div className="journal-columns">
          {byCategory.map(
            ({ cat, items }) =>
              items.length > 0 && (
                <section key={cat} className="journal-section">
                  <h3>{CATEGORY_LABELS[cat]}</h3>
                  <ul>
                    {items.map((def) => (
                      <li key={def.id}>
                        <button
                          className={`journal-entry${openId === def.id ? ' journal-entry--open' : ''}`}
                          onClick={() => setOpenId((o) => (o === def.id ? null : def.id))}
                          aria-expanded={openId === def.id}
                        >
                          {def.title}
                        </button>
                        {openId === def.id && <p className="journal-body">{def.body}</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
