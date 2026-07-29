import type { TimerState } from './types.ts';

/** Milliseconds of active play time. Pure math over timestamps. */
export function elapsedMs(timer: TimerState, now: number): number {
  const pausedExtra = timer.pausedSince !== null ? now - timer.pausedSince : 0;
  return Math.max(0, now - timer.startedAt - timer.pausedMs - pausedExtra);
}

/** Remaining time in challenge mode; null when untimed. */
export function remainingMs(
  timer: TimerState,
  challengeDurationMs: number | undefined,
  now: number,
): number | null {
  if (timer.mode !== 'challenge' || challengeDurationMs === undefined) return null;
  return Math.max(0, challengeDurationMs - elapsedMs(timer, now));
}

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function pauseTimer(timer: TimerState, at: number): TimerState {
  if (timer.pausedSince !== null) return timer;
  return { ...timer, pausedSince: at };
}

export function resumeTimer(timer: TimerState, at: number): TimerState {
  if (timer.pausedSince === null) return timer;
  return {
    ...timer,
    pausedMs: timer.pausedMs + (at - timer.pausedSince),
    pausedSince: null,
  };
}
