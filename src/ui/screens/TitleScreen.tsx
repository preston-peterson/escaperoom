import { useUiStore } from '../../engine/state/uiStore.ts';
import { audioEngine } from '../../engine/audio/audioEngine.ts';

/** The threshold. The Enter click doubles as the audio-unlock gesture. */
export function TitleScreen() {
  const setScreen = useUiStore((s) => s.setScreen);
  return (
    <div className="title-screen">
      <svg viewBox="0 0 1600 900" className="title-backdrop" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="title-glow" cx="50%" cy="72%" r="55%">
            <stop offset="0%" stopColor="#e0a458" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e0a458" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="#0d0a08" />
        {/* descending stair silhouette */}
        <polygon
          points="600,900 640,820 700,820 700,760 770,760 770,700 850,700 850,760 920,760 920,820 980,820 1020,900"
          fill="#050302"
        />
        <rect width="1600" height="900" fill="url(#title-glow)" />
        <circle cx="800" cy="740" r="10" fill="#e0a458" style={{ animation: 'glintPulse 3s ease-in-out infinite' }} />
      </svg>
      <div className="title-content">
        <p className="title-kicker">Escape the</p>
        <h1 className="title-name">Labyrinth Below</h1>
        <p className="title-tag">
          A vanished cartographer. A maze that breathes. A fire that must not go out.
        </p>
        <button
          className="btn btn--primary title-enter"
          onClick={() => {
            audioEngine.init();
            setScreen('worldSelect');
          }}
        >
          Descend
        </button>
      </div>
    </div>
  );
}
