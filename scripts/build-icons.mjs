// Gera os ícones PNG do app (PWA e Android) a partir do SVG do ícone.
// Uso: npm run icons
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { appIconSvg } from './art/app.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

// ---------------------------------------------------------------- PWA
const WEB = join(ROOT, 'public', 'icons');
mkdirSync(WEB, { recursive: true });
const webIcons = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
];
for (const icon of webIcons) writeFileSync(join(WEB, icon.file), png(appIconSvg({ maskable: icon.maskable }), icon.size));
writeFileSync(join(WEB, 'icon.svg'), appIconSvg());
console.log('Ícones do PWA gerados em', WEB);

// ---------------------------------------------------------------- Android (se o projeto existir)
const RES = join(ROOT, 'android', 'app', 'src', 'main', 'res');
if (existsSync(RES)) {
  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [density, scale] of Object.entries(densities)) {
    const dir = join(RES, `mipmap-${density}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'ic_launcher.png'), png(appIconSvg(), 48 * scale));
    writeFileSync(join(dir, 'ic_launcher_round.png'), png(appIconSvg({ maskable: true }), 48 * scale));
    // Ícone adaptativo (Android 8+): desenho sem fundo, dentro da área segura.
    writeFileSync(join(dir, 'ic_launcher_foreground.png'), png(appIconSvg({ maskable: true, transparent: true }), 108 * scale));
  }
  writeFileSync(
    join(RES, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#3FA9F5</color>\n</resources>\n`,
  );

  // Tela de abertura: o ícone no fundo creme do jogo (no lugar do logo do Capacitor).
  writeSplashes(RES);
  console.log('Ícones e telas de abertura do Android gerados em', RES);
}

function writeSplashes(res) {
  const sizes = {
    'drawable': [480, 320],
    'drawable-land-mdpi': [480, 320],
    'drawable-land-hdpi': [800, 480],
    'drawable-land-xhdpi': [1280, 720],
    'drawable-land-xxhdpi': [1600, 960],
    'drawable-land-xxxhdpi': [1920, 1280],
    'drawable-port-mdpi': [320, 480],
    'drawable-port-hdpi': [480, 800],
    'drawable-port-xhdpi': [720, 1280],
    'drawable-port-xxhdpi': [960, 1600],
    'drawable-port-xxxhdpi': [1280, 1920],
  };
  for (const [dir, [w, h]] of Object.entries(sizes)) {
    if (!existsSync(join(res, dir, 'splash.png'))) continue;
    const size = Math.min(w, h) * 0.55;
    const icon = appIconSvg().replace('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">', '').replace('</svg>\n', '');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="#FFF8E7"/>` +
      `<g transform="translate(${(w - size) / 2} ${(h - size) / 2}) scale(${size / 512})">${icon}</g></svg>`;
    writeFileSync(join(res, dir, 'splash.png'), png(svg, w));
  }
}
