// Identidade do app: ícone (PWA/APK) e a faixa do título da tela inicial.
const INK = '#2B2A4C';
const FRAGMENT_COLORS = ['#46B7F0', '#F7C948', '#FF9F2E', '#3CC46A', '#FF4D6D'];

/** Ícone: globo sorridente com os cinco fragmentos em volta, num fundo de céu. */
export function appIconSvg({ maskable = false, transparent = false } = {}) {
  // Ícones "maskable" precisam de margem de segurança (o sistema recorta em círculo).
  const s = maskable ? 0.72 : 0.9;
  const offset = (512 - 512 * s) / 2;
  const gem = (x, y, color, rotate) =>
    `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(0.62)">` +
    `<polygon points="0,-60 44,-22 26,62 -26,62 -44,-22" fill="${color}" stroke="${INK}" stroke-width="9" stroke-linejoin="round"/>` +
    `<polygon points="0,-60 44,-22 0,-8 -44,-22" fill="#FFFFFF" opacity="0.45"/></g>`;
  const gems = FRAGMENT_COLORS.map((color, i) => {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    return gem(256 + Math.cos(a) * 190, 256 + Math.sin(a) * 190, color, (i * 72) % 360);
  }).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">` +
    `<defs><radialGradient id="sky" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stop-color="#9FDBFF"/><stop offset="1" stop-color="#3FA9F5"/></radialGradient>` +
    `<radialGradient id="sea" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#6CC4FF"/><stop offset="1" stop-color="#1F7FC2"/></radialGradient></defs>` +
    (transparent ? '' : maskable ? `<rect width="512" height="512" fill="url(#sky)"/>` : `<rect x="16" y="16" width="480" height="480" rx="110" fill="url(#sky)"/>`) +
    `<g transform="translate(${offset} ${offset}) scale(${s})">` +
    `<circle cx="256" cy="256" r="150" fill="#FFF3B0" opacity="0.55"/>` +
    `<circle cx="256" cy="256" r="120" fill="url(#sea)" stroke="${INK}" stroke-width="10"/>` +
    `<path d="M186 196 Q224 166 258 186 Q268 222 238 236 Q226 268 196 258 Q170 234 186 196Z" fill="#5DD27A" stroke="${INK}" stroke-width="7"/>` +
    `<path d="M272 172 Q322 172 338 218 Q322 238 296 224 Q274 212 272 172Z" fill="#5DD27A" stroke="${INK}" stroke-width="7"/>` +
    `<path d="M300 252 Q334 246 342 274 Q338 310 310 322 Q290 292 300 252Z" fill="#5DD27A" stroke="${INK}" stroke-width="7"/>` +
    // rostinho feliz no globo
    `<circle cx="214" cy="286" r="9" fill="${INK}"/><circle cx="268" cy="286" r="9" fill="${INK}"/>` +
    `<path d="M218 310 Q241 332 264 310" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="206" cy="196" rx="34" ry="14" fill="#FFFFFF" opacity="0.4" transform="rotate(-30 206 196)"/>` +
    gems +
    `</g></svg>\n`
  );
}

/** Faixa dourada atrás do título "O Mistério do Globo das Nações". */
function titleBanner() {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="150" viewBox="0 0 1040 150">` +
    `<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD45C"/><stop offset="1" stop-color="#E8A317"/></linearGradient></defs>` +
    // pontas da fita
    `<path d="M40 50 L110 50 L110 128 L40 128 L66 89Z" fill="#C97A10" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    `<path d="M1000 50 L930 50 L930 128 L1000 128 L974 89Z" fill="#C97A10" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
    // faixa principal
    `<path d="M96 30 Q520 0 944 30 L944 112 Q520 82 96 112Z" fill="url(#gold)" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>` +
    `<path d="M120 44 Q520 16 920 44" stroke="#FFF3B0" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>` +
    [150, 890].map((x) => `<path d="M${x} 58 l7 14 l15 2 l-11 10 l3 15 l-14 -8 l-14 8 l3 -15 l-11 -10 l15 -2Z" fill="#FFF8E7"/>`).join('') +
    `</svg>\n`
  );
}

export function drawApp({ write }) {
  write('app-icon.svg', appIconSvg());
  write('title-banner.svg', titleBanner());
}
