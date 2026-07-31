import { useEffect, useState } from 'react';
import { useUiStore } from './engine/state/uiStore.ts';
import {
  COARSE_POINTER_QUERY,
  gateReason,
  isDismissable,
  readEnv,
  type GateReason,
} from './ui/mobileGate.ts';
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

  // One definition of "touch device", shared by the layout and the stylesheet.
  useEffect(() => {
    const apply = () =>
      document.documentElement.classList.toggle('touch', readEnv().coarsePointer);
    apply();
    const mql = window.matchMedia?.(COARSE_POINTER_QUERY);
    mql?.addEventListener?.('change', apply);
    return () => mql?.removeEventListener?.('change', apply);
  }, []);

  // A dismissal shouldn't outlive the condition: turn the phone back to
  // portrait and the rotate prompt is due again.
  if (reason && !(override && isDismissable(reason))) {
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
