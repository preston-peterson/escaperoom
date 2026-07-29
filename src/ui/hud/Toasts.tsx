import { useEffect } from 'react';
import { useUiStore, type Toast } from '../../engine/state/uiStore.ts';

function ToastCard({ toast }: { toast: Toast }) {
  const dismissToast = useUiStore((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(
      () => dismissToast(toast.id),
      toast.kind === 'achievement' ? 6000 : 4600,
    );
    return () => clearTimeout(t);
  }, [toast.id, toast.kind, dismissToast]);
  return (
    <div
      className={`toast${toast.kind === 'achievement' ? ' toast--achievement' : ''}`}
      role="status"
      onClick={() => dismissToast(toast.id)}
    >
      {toast.kind === 'achievement' && <span className="toast-star">✦</span>}
      {toast.text}
    </div>
  );
}

/** Narration + achievement toasts, bottom-center, newest last. */
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
