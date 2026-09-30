import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer subpasta (GitHub Pages, itch.io, Capacitor).
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
