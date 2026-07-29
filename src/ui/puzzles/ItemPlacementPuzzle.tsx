import { useState } from 'react';
import type { ItemId, PuzzleDef, PuzzleSubmission } from '../../engine/types.ts';
import { useGameStore } from '../../engine/state/store.ts';

type PlacementDef = Extract<PuzzleDef, { type: 'itemPlacement' }>;

/**
 * Sockets + your inventory: select an item, click a socket. Submits
 * automatically once every socket is filled.
 */
export function ItemPlacementPuzzle({
  def,
  onSubmit,
}: {
  def: PlacementDef;
  onSubmit: (sub: PuzzleSubmission) => void;
}) {
  const world = useGameStore((s) => s.world);
  const inventory = useGameStore((s) => s.state?.inventory ?? []);
  const [placements, setPlacements] = useState<Record<string, ItemId>>({});
  const [held, setHeld] = useState<ItemId | null>(null);

  const available = inventory.filter((i) => !Object.values(placements).includes(i));

  const placeIn = (socketId: string) => {
    if (held) {
      setPlacements((p) => {
        const next = { ...p, [socketId]: held };
        if (def.sockets.every((s) => next[s.id] !== undefined)) {
          onSubmit({ type: 'itemPlacement', placements: next });
          return {};
        }
        return next;
      });
      setHeld(null);
    } else if (placements[socketId]) {
      setPlacements((p) => {
        const next = { ...p };
        delete next[socketId];
        return next;
      });
    }
  };

  return (
    <div className="puzzle-body">
      <div className="sockets">
        {def.sockets.map((s) => (
          <button
            key={s.id}
            className={`socket${placements[s.id] ? ' socket--filled' : ''}`}
            onClick={() => placeIn(s.id)}
            aria-label={
              placements[s.id]
                ? `${s.label}: ${world?.items[placements[s.id]]?.name ?? placements[s.id]} (click to remove)`
                : `${s.label}: empty`
            }
          >
            <span className="socket-label">{s.label}</span>
            <span className="socket-content">
              {placements[s.id]
                ? (world?.items[placements[s.id]]?.name ?? placements[s.id])
                : '◇'}
            </span>
          </button>
        ))}
      </div>
      <div className="placement-inventory">
        {available.length === 0 ? (
          <p className="placement-empty">You carry nothing that fits.</p>
        ) : (
          available.map((i) => (
            <button
              key={i}
              className={`inv-item${held === i ? ' inv-item--selected' : ''}`}
              onClick={() => setHeld((h) => (h === i ? null : i))}
            >
              {world?.items[i]?.name ?? i}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
