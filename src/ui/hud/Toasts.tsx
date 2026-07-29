import { useUiStore, type Toast } from '../../engine/state/uiStore.ts';

function ToastCard({ toast }: { toast: Toast }) {
  const dismissToast = useUiStore((s) => s.dismissToast);
  return (
    <button
      className={`toast${toast.kind === 'achievement' ? ' toast--achievement' : ''}`}
      title="Click to dismiss"
      onClick={() => dismissToast(toast.id)}
    >
      {toast.kind === 'achievement' && <span className="toast-star">✦</span>}
      <span className="toast-text">{toast.text}</span>
    </button>
  );
}

/**
 * Narration + achievement messages, bottom-left, newest last. Messages stay
 * on screen until clicked — anywhere on the box dismisses it, and nothing
 * ever scrolls away unread.
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
