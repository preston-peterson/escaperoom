import { useUiStore } from './engine/state/uiStore.ts';
import { TitleScreen } from './ui/screens/TitleScreen.tsx';
import { WorldSelect } from './ui/screens/WorldSelect.tsx';
import { GameScreen } from './ui/screens/GameScreen.tsx';
import { VictoryScreen } from './ui/screens/VictoryScreen.tsx';

export default function App() {
  const screen = useUiStore((s) => s.screen);
  switch (screen) {
    case 'title':
      return <TitleScreen />;
    case 'worldSelect':
      return <WorldSelect />;
    case 'game':
      return <GameScreen />;
    case 'victory':
      return <VictoryScreen />;
  }
}
