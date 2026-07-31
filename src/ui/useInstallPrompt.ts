import { useSyncExternalStore } from 'react';

/**
 * Chromium browsers fire `beforeinstallprompt` when the site is installable;
 * we stash it and offer our own link, since the address-bar icon is easy to
 * miss. Firefox desktop never fires it (Mozilla dropped PWA install in 98)
 * and Safari installs from its own menu — in both cases we show nothing
 * rather than instructions nobody can follow.
 *
 * The listener is registered at module load, not in an effect: Chromium can
 * fire the event before React has mounted, and a missed event never repeats.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let pending: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function announce() {
  for (const l of listeners) l();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // suppress the browser's mini-infobar; we have our own
    pending = e as InstallPromptEvent;
    announce();
  });
  window.addEventListener('appinstalled', () => {
    pending = null;
    announce();
  });
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => void listeners.delete(onChange);
}

export function useInstallPrompt(): (() => void) | null {
  const event = useSyncExternalStore(
    subscribe,
    () => pending,
    () => null,
  );
  if (!event) return null;
  return () => {
    pending = null;
    announce();
    void event.prompt();
  };
}
