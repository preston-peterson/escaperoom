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
  const copy = {
    rotate: {
      kicker: 'The world is wider than this',
      title: 'Turn your phone sideways',
      body: 'These rooms are painted wide — held upright, most of what matters falls outside the frame. Turn the phone to landscape and the whole scene comes into view.',
      note: 'Landscape works properly: every target is sized for a fingertip, and the "look around" button names what you can reach.',
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
        <p className="title-kicker">{copy.kicker}</p>
        <h1 className="unsupported-title">{copy.title}</h1>
        <p className="unsupported-body">{copy.body}</p>
        <p className="unsupported-note">{copy.note}</p>
        <button className="btn unsupported-continue" onClick={onContinue}>
          Try anyway
        </button>
      </div>
    </div>
  );
}
