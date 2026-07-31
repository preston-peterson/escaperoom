import type { GateReason } from '../mobileGate.ts';

/**
 * Shown when the device can't really play: a phone/tablet, or a window too
 * narrow for the board. Written in the game's voice, and never a dead end —
 * anyone who insists can walk through it.
 */
export function UnsupportedScreen({
  reason,
  onContinue,
}: {
  reason: Exclude<GateReason, null>;
  onContinue: () => void;
}) {
  const touch = reason === 'touch';
  return (
    <div className="unsupported-screen">
      <svg viewBox="0 0 1600 900" className="title-backdrop" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="unsupported-glow" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#e0a458" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#e0a458" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="#0d0a08" />
        <polygon points="640,900 700,700 900,700 960,900" fill="#050302" />
        <rect width="1600" height="900" fill="url(#unsupported-glow)" />
      </svg>

      <div className="unsupported-content">
        <p className="title-kicker">A door you cannot open here</p>
        <h1 className="unsupported-title">
          {touch ? 'Come back on a computer' : 'A wider window, please'}
        </h1>
        <p className="unsupported-body">
          {touch ? (
            <>
              These worlds are built for a mouse and a full screen. You find
              what matters by moving the cursor over it — torches, keyholes,
              things half-buried in the silt — and a fingertip has no way to
              hover. On a phone the labyrinth keeps its secrets.
            </>
          ) : (
            <>
              The window is too narrow for the board and the room to share.
              Widen it, or step into full screen, and the way opens.
            </>
          )}
        </p>
        <p className="unsupported-note">
          {touch
            ? 'Laptop or desktop, any modern browser. Nothing to install — the door is at the same address.'
            : `The game wants about 900 pixels of width, and is happiest with more.`}
        </p>
        <button className="btn unsupported-continue" onClick={onContinue}>
          Try anyway
        </button>
      </div>
    </div>
  );
}
