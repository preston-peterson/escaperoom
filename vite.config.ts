/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Two builds from one source:
 *  - default: chunked static site for GitHub Pages (worlds load on demand).
 *  - `--mode offline`: everything inlined into one index.html that runs from
 *    file://, for playing with no network at all. Browsers refuse to load ES
 *    modules over file://, so inlining is what makes the double-click work.
 */
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline';
  return {
    base: './',
    plugins: [react(), ...(offline ? [viteSingleFile()] : [])],
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
