import type { GameState, WorldDef } from '../../engine/types.ts';
import { useGameStore } from '../../engine/state/store.ts';
import { useUiStore } from '../../engine/state/uiStore.ts';
import { SceneRenderer } from './SceneRenderer.tsx';
import { allowMove } from '../moveGuard.ts';

/** First-person view of the current chamber; routes hotspot clicks to actions. */
export function SceneView({ state, world }: { state: GameState; world: WorldDef }) {
  const dispatch = useGameStore((s) => s.dispatch);
  const openOverlay = useUiStore((s) => s.openOverlay);
  const selectedItem = useUiStore((s) => s.selectedItem);
  const selectItem = useUiStore((s) => s.selectItem);
  const pushToast = useUiStore((s) => s.pushToast);

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

  return (
    <div className="scene-view" key={state.currentRoom}>
      <SceneRenderer scene={room.scene} state={state} world={world} onHotspot={onHotspot} />
      <div className="scene-room-name">{room.name}</div>
    </div>
  );
}
