import { useUiStore, type Toast } from '../../engine/state/uiStore.ts';

function ToastCard({ toast }: { toast: Toast }) {
  const dismissToast = useUiStore((s) => s.dismissToast);
  return (
    <div
      className={`toast${toast.kind === 'achievement' ? ' toast--achievement' : ''}`}
      role="status"
    >
      {toast.kind === 'achievement' && <span className="toast-star">✦</span>}
      <span className="toast-text">{toast.text}</span>
      <button
        className="toast-close"
        aria-label="Dismiss message"
        onClick={() => dismissToast(toast.id)}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Narration + achievement messages, bottom-center, newest last. Messages stay
 * on screen until dismissed with the ✕ so nothing scrolls away unread.
 */
export function Toasts() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}
