/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  // LAN play: accept any Host header (static game server, no secrets to rebind).
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
