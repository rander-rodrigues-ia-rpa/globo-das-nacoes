import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer subpasta (GitHub Pages, itch.io, Capacitor).
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    // PWA: instalável no celular/tablet e jogável offline depois da primeira abertura.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/*.png', 'icons/icon.svg'],
      manifest: {
        name: 'O Mistério do Globo das Nações',
        short_name: 'Globo das Nações',
        description: 'Aventura infantil pelo mundo: encontre os cinco fragmentos e una o Globo das Nações!',
        lang: 'pt-BR',
        start_url: './',
        scope: './',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#FFF8E7',
        theme_color: '#6EC3F4',
        categories: ['games', 'kids', 'education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Guarda o jogo inteiro (código, fontes e toda a arte) para jogar sem internet.
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
