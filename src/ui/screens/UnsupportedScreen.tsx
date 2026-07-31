import type { GateReason } from '../mobileGate.ts';
import { isDismissable } from '../mobileGate.ts';

/**
 * Shown when the device can't play as it is held: a phone in portrait, a
 * screen too small, or a desktop window too narrow. Written in the game's
 * voice. Only the rotate prompt is a dead end, and only because turning the
 * phone is always possible.
 */
export function UnsupportedScreen({
  reason,
  onContinue,
}: {
  reason: Exclude<GateReason, null>;
  onContinue: () => void;
}) {
  const copy = {
    rotate: {
      kicker: 'The world is wider than this',
      title: 'Rotate to play',
      body: 'These rooms are painted wide — a phone held upright shrinks them to about a fifth of their size, small enough that nothing would answer your finger. Turn the phone sideways and the whole scene opens up.',
      note: 'The game picks up the moment you turn it. Everything is sized for a fingertip in landscape, and the "look around" button will name whatever you can reach.',
    },
    small: {
      kicker: 'A door you cannot open here',
      title: 'This screen is too small',
      body: 'Even sideways, there is not enough room here for the board and the room to share. A tablet or a laptop will do it justice.',
      note: 'Nothing to install — the door is at the same address.',
    },
    narrow: {
      kicker: 'A door you cannot open here',
      title: 'A wider window, please',
      body: 'The window is too narrow for the board and the room to share. Widen it, or step into full screen, and the way opens.',
      note: 'The game wants about 900 pixels of width, and is happiest with more.',
    },
  }[reason];

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
        {reason === 'rotate' && (
          <svg className="rotate-mark" viewBox="0 0 120 120" aria-hidden>
            <rect
              x="42"
              y="18"
              width="36"
              height="60"
              rx="6"
              fill="none"
              stroke="var(--amber)"
              strokeWidth="3"
              opacity="0.45"
            />
            <rect
              x="30"
              y="52"
              width="60"
              height="36"
              rx="6"
              fill="none"
              stroke="var(--amber)"
              strokeWidth="3"
            />
            <path
              d="M 92 40 a 34 34 0 0 0 -26 -18"
              fill="none"
              stroke="var(--amber)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M 96 26 L 95 43 L 80 38 Z" fill="var(--amber)" />
          </svg>
        )}
        <p className="title-kicker">{copy.kicker}</p>
        <h1 className="unsupported-title">{copy.title}</h1>
        <p className="unsupported-body">{copy.body}</p>
        <p className="unsupported-note">{copy.note}</p>
        {isDismissable(reason) && (
          <button className="btn unsupported-continue" onClick={onContinue}>
            Try anyway
          </button>
        )}
      </div>
    </div>
  );
}
