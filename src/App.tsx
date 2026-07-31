import { useEffect, useState } from 'react';
import { useUiStore } from './engine/state/uiStore.ts';
import { COARSE_POINTER_QUERY, gateReason, readEnv, type GateReason } from './ui/mobileGate.ts';
import { TitleScreen } from './ui/screens/TitleScreen.tsx';
import { WorldSelect } from './ui/screens/WorldSelect.tsx';
import { GameScreen } from './ui/screens/GameScreen.tsx';
import { VictoryScreen } from './ui/screens/VictoryScreen.tsx';
import { UnsupportedScreen } from './ui/screens/UnsupportedScreen.tsx';

/** Re-evaluates on resize and orientation change, so rotating or widening works. */
function useGateReason(): GateReason {
  const [reason, setReason] = useState<GateReason>(() => gateReason(readEnv()));
  useEffect(() => {
    const update = () => setReason(gateReason(readEnv()));
    window.addEventListener('resize', update);
    const mql = window.matchMedia?.(COARSE_POINTER_QUERY);
    mql?.addEventListener?.('change', update);
    update();
    return () => {
      window.removeEventListener('resize', update);
      mql?.removeEventListener?.('change', update);
    };
  }, []);
  return reason;
}

export default function App() {
  const screen = useUiStore((s) => s.screen);
  const reason = useGateReason();
  const [override, setOverride] = useState(false);

  if (reason && !override) {
    return <UnsupportedScreen reason={reason} onContinue={() => setOverride(true)} />;
  }

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
