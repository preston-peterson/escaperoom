import type { GameState, WorldDef } from '../../engine/types.ts';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { visibleHotspots } from '../../engine/state/selectors.ts';
import { SceneRenderer } from './SceneRenderer.tsx';
import { allowMove } from '../moveGuard.ts';

/** First-person view of the current chamber; routes hotspot clicks to actions. */
export function SceneView({
  state,
  world,
  touch,
}: {
  state: GameState;
  world: WorldDef;
  touch: boolean;
}) {
  const dispatch = useGameStore((s) => s.dispatch);
  const openOverlay = useUiStore((s) => s.openOverlay);
  const selectedItem = useUiStore((s) => s.selectedItem);
  const selectItem = useUiStore((s) => s.selectItem);
  const pushToast = useUiStore((s) => s.pushToast);
  const looking = useUiStore((s) => s.looking);

  const room = world.rooms[state.currentRoom];
  if (!room) return null;

  const onHotspot = (hotspotId: string) => {
    const hs = room.scene.hotspots.find((h) => h.id === hotspotId);
    if (!hs) return;
    switch (hs.action.type) {
      case 'puzzle':
        openOverlay({ kind: 'puzzle', puzzle: hs.action.puzzle });
        break;
      case 'useItem':
        if (selectedItem) {
          dispatch({ type: 'USE_ITEM', hotspot: hotspotId, item: selectedItem, at: Date.now() });
          selectItem(null);
        } else {
          pushToast('narration', 'Something could fit here — if you carried the right thing.');
        }
        break;
      case 'navigate':
        if (allowMove()) {
          dispatch({ type: 'INTERACT', hotspot: hotspotId, at: Date.now() });
        }
        break;
      default:
        dispatch({ type: 'INTERACT', hotspot: hotspotId, at: Date.now() });
        break;
    }
  };

  // Named list of everything live in the room. Touch has no hover, so this is
  // how a phone player finds anything; on desktop it's the same information a
  // screen reader needs, on demand rather than by sweeping the cursor.
  const here = looking ? visibleHotspots(state, world, state.currentRoom) : [];

  return (
    <div className="scene-view" key={state.currentRoom}>
      <SceneRenderer
        scene={room.scene}
        state={state}
        world={world}
        onHotspot={onHotspot}
        touch={touch}
        looking={looking}
      />
      <div className="scene-room-name">{room.name}</div>
      {looking && (
        <div className="look-panel" role="region" aria-label={`What is here: ${room.name}`}>
          {here.length === 0 ? (
            <p className="look-empty">Nothing here answers to looking.</p>
          ) : (
            <ul>
              {here.map((h) => (
                <li key={h.id}>
                  <button className="look-item" onClick={() => onHotspot(h.id)}>
                    {h.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
