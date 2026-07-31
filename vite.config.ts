/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Two builds from one source:
 *  - default: chunked static site for GitHub Pages, installable as a PWA and
 *    playable offline once visited.
 *  - `--mode offline`: everything inlined into one index.html that runs from
 *    file://, for playing with no network at all. Browsers refuse to load ES
 *    modules over file://, so inlining is what makes the double-click work.
 *    A service worker can't run from file://, so the PWA plugin sits this out.
 */
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline';
  return {
    base: './',
    plugins: [
      react(),
      ...(offline
        ? [viteSingleFile()]
        : [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['icons/*.png'],
              workbox: {
                // Precache the whole atlas — including world chunks the player
                // has never opened, so any world works on a plane.
                globPatterns: ['**/*.{js,css,html,png,svg}'],
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                cleanupOutdatedCaches: true,
              },
              manifest: {
                name: 'The Labyrinth Below',
                short_name: 'Labyrinth',
                description:
                  'An anthology of escape-room worlds and whodunit mysteries — shifting mazes, hand-drawn scenes, and a fire that must not go out.',
                theme_color: '#0d0a08',
                background_color: '#0d0a08',
                display: 'standalone',
                orientation: 'landscape',
                start_url: './',
                scope: './',
                icons: [
                  { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                  { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                  {
                    src: 'icons/icon-maskable-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
            }),
          ]),
    ],
    // LAN play: accept any Host header (static game server, no secrets to rebind).
    server: { host: true, allowedHosts: true },
    preview: { host: true, allowedHosts: true },
    build: offline ? { outDir: 'dist-offline', assetsInlineLimit: 100_000_000 } : {},
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
