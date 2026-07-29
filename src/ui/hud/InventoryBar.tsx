import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';

/** Bottom bar of carried items. Selecting one arms it for use on a hotspot. */
export function InventoryBar() {
  const world = useGameStore((s) => s.world);
  const inventory = useGameStore((s) => s.state?.inventory ?? []);
  const selectedItem = useUiStore((s) => s.selectedItem);
  const selectItem = useUiStore((s) => s.selectItem);

  if (!world) return null;

  return (
    <div className="inventory-bar" role="toolbar" aria-label="Inventory">
      {inventory.length === 0 ? (
        <span className="inventory-empty">Your hands are empty.</span>
      ) : (
        inventory.map((id) => {
          const item = world.items[id];
          const selected = selectedItem === id;
          return (
            <button
              key={id}
              className={`inv-item${selected ? ' inv-item--selected' : ''}`}
              title={item?.description}
              aria-pressed={selected}
              onClick={() => selectItem(selected ? null : id)}
            >
              {item?.name ?? id}
            </button>
          );
        })
      )}
      {selectedItem && (
        <span className="inventory-hint">
          Holding {world.items[selectedItem]?.name} — choose where to use it
        </span>
      )}
    </div>
  );
}
