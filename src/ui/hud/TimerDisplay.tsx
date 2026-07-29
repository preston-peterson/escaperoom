import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../engine/state/store.ts';
import { elapsedMs, formatMs, remainingMs } from '../../engine/timer.ts';

/**
 * Re-renders once a second but never dispatches per tick; in challenge mode
 * it dispatches a single TIME_EXPIRED when the countdown reaches zero.
 */
export function TimerDisplay() {
  const timer = useGameStore((s) => s.state?.timer);
  const status = useGameStore((s) => s.state?.status);
  const challengeDurationMs = useGameStore((s) => s.world?.challengeDurationMs);
  const dispatch = useGameStore((s) => s.dispatch);
  const [now, setNow] = useState(() => Date.now());
  const expired = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining =
    timer && status === 'playing' ? remainingMs(timer, challengeDurationMs, now) : null;

  useEffect(() => {
    if (remaining === 0 && !expired.current && status === 'playing') {
      expired.current = true;
      dispatch({ type: 'TIME_EXPIRED', at: Date.now() });
    }
  }, [remaining, status, dispatch]);

  if (!timer || status !== 'playing') return null;

  if (timer.mode === 'challenge' && remaining !== null) {
    return (
      <span
        className={`timer${remaining < 5 * 60_000 ? ' timer--urgent' : ''}`}
        aria-label="Time remaining"
      >
        {formatMs(remaining)}
      </span>
    );
  }
  return (
    <span className="timer timer--calm" aria-label="Time elapsed">
      {formatMs(elapsedMs(timer, now))}
    </span>
  );
}
