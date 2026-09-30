// Gera a ARTE PROVISÓRIA (SVG) em public/assets/sprites.
// Uso: npm run art
// Quando a arte final chegar, basta substituir os arquivos (mesmo nome) ou
// apontar o manifesto (src/ui-phaser/assets.ts) para os novos PNGs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drawAfrica } from './art/africa.mjs';
import { drawDubai } from './art/dubai.mjs';
import { drawEngland } from './art/inglaterra.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'sprites');
mkdirSync(OUT, { recursive: true });

const svg = (w, h, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  (defs ? `<defs>${defs}</defs>` : '') +
  body +
  `</svg>\n`;
const write = (name, content) => writeFileSync(join(OUT, name), content);
const OUTLINE = '#2B2A4C';

// ---------------------------------------------------------------- Heróis
const HEROES = {
  joao: {
    skin: '#F2C79B', jacket: '#2F7BD8', jacketDark: '#1F5FB0', pants: '#3B4A6B', pack: '#C9853A',
    hairShape: `<path d="M44 84 Q40 30 100 26 Q160 30 156 84 Q150 58 132 56 L136 40 L118 52 L112 34 L98 52 L86 36 L80 56 Q56 58 44 84Z" fill="#6B3E1E"/>`,
    extra: '',
  },
  gabriel: {
    skin: '#FAD9B8', jacket: '#F29A1F', jacketDark: '#D27A08', pants: '#5B4A3A', pack: '#7A8A99',
    hairShape: `<path d="M42 88 Q36 28 100 24 Q164 28 158 88 Q152 50 120 46 Q100 60 76 48 Q50 56 42 88Z" fill="#F5C542"/>`,
    extra:
      `<rect x="46" y="52" width="108" height="12" rx="6" fill="#7A5230"/>` +
      `<circle cx="80" cy="56" r="15" fill="#8FD3FF" stroke="#7A5230" stroke-width="6"/>` +
      `<circle cx="120" cy="56" r="15" fill="#8FD3FF" stroke="#7A5230" stroke-width="6"/>` +
      `<circle cx="75" cy="51" r="4" fill="#fff"/><circle cx="115" cy="51" r="4" fill="#fff"/>`,
  },
  larissa: {
    skin: '#8D5A3B', jacket: '#2FA36B', jacketDark: '#1E7F51', pants: '#6A3B6E', pack: '#E0564F',
    hairShape:
      `<circle cx="160" cy="70" r="26" fill="#2B1A12"/>` +
      `<path d="M40 92 Q34 26 100 24 Q166 26 160 92 Q150 54 118 50 Q96 44 74 52 Q50 60 40 92Z" fill="#2B1A12"/>` +
      `<path d="M52 58 Q100 30 150 58" stroke="#FFD23F" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    extra: '',
  },
};

function hero({ skin, jacket, jacketDark, pants, pack, hairShape, extra }) {
  return svg(
    200,
    280,
    // mochila
    `<rect x="42" y="136" width="40" height="70" rx="14" fill="${pack}" stroke="${OUTLINE}" stroke-width="4"/>` +
      // pernas e sapatos
      `<rect x="72" y="200" width="24" height="56" rx="10" fill="${pants}" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<rect x="104" y="200" width="24" height="56" rx="10" fill="${pants}" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<ellipse cx="82" cy="260" rx="20" ry="11" fill="#3A2E2A" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<ellipse cx="120" cy="260" rx="20" ry="11" fill="#3A2E2A" stroke="${OUTLINE}" stroke-width="4"/>` +
      // braços
      `<rect x="44" y="140" width="26" height="62" rx="13" fill="${jacketDark}" stroke="${OUTLINE}" stroke-width="4" transform="rotate(12 57 140)"/>` +
      `<rect x="130" y="140" width="26" height="62" rx="13" fill="${jacketDark}" stroke="${OUTLINE}" stroke-width="4" transform="rotate(-12 143 140)"/>` +
      `<circle cx="50" cy="204" r="12" fill="${skin}" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<circle cx="150" cy="204" r="12" fill="${skin}" stroke="${OUTLINE}" stroke-width="4"/>` +
      // corpo (casaco)
      `<rect x="62" y="128" width="76" height="90" rx="28" fill="${jacket}" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<line x1="100" y1="136" x2="100" y2="214" stroke="${jacketDark}" stroke-width="4"/>` +
      `<rect x="62" y="128" width="76" height="20" rx="10" fill="#FFFFFF" opacity="0.85"/>` +
      // cabeça
      `<circle cx="100" cy="86" r="58" fill="${skin}" stroke="${OUTLINE}" stroke-width="4"/>` +
      hairShape +
      // rosto
      `<ellipse cx="80" cy="92" rx="8" ry="11" fill="${OUTLINE}"/><ellipse cx="120" cy="92" rx="8" ry="11" fill="${OUTLINE}"/>` +
      `<circle cx="83" cy="87" r="3.5" fill="#fff"/><circle cx="123" cy="87" r="3.5" fill="#fff"/>` +
      `<circle cx="66" cy="110" r="9" fill="#FF8A8A" opacity="0.5"/><circle cx="134" cy="110" r="9" fill="#FF8A8A" opacity="0.5"/>` +
      `<path d="M86 114 Q100 128 114 114" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      extra,
  );
}
for (const [id, look] of Object.entries(HEROES)) write(`hero-${id}.svg`, hero(look));

// ---------------------------------------------------------------- Fragmentos
const FRAGMENTS = {
  gelo: ['#BFF0FF', '#46B7F0', '#1F7FC2'],
  conhecimento: ['#FFF3B0', '#F7C948', '#C8961A'],
  brilho: ['#FFE0B0', '#FF9F2E', '#D46A00'],
  natureza: ['#C8F7C5', '#3CC46A', '#1F8A45'],
  alegria: ['#FFC4CF', '#FF4D6D', '#C21F45'],
};
for (const [id, [light, mid, dark]] of Object.entries(FRAGMENTS)) {
  write(
    `fragment-${id}.svg`,
    svg(
      120,
      140,
      `<polygon points="60,6 104,44 86,128 34,128 16,44" fill="${mid}" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
        `<polygon points="60,6 104,44 60,58 16,44" fill="${light}"/>` +
        `<polygon points="60,58 104,44 86,128 60,128" fill="${dark}" opacity="0.55"/>` +
        `<polygon points="60,6 104,44 86,128 34,128 16,44" fill="none" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
        `<path d="M40 60 L48 96" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.8"/>`,
    ),
  );
  write(
    `fragment-${id}-empty.svg`,
    svg(
      120,
      140,
      `<polygon points="60,6 104,44 86,128 34,128 16,44" fill="#FFFFFF" fill-opacity="0.55" stroke="#2B2A4C" stroke-opacity="0.55" stroke-width="5" stroke-dasharray="10 8" stroke-linejoin="round"/>`,
    ),
  );
}

// ---------------------------------------------------------------- Itens e objetos
write(
  'item-peixe.svg',
  svg(
    160,
    90,
    `<path d="M20 45 Q70 -5 120 45 Q70 95 20 45Z" fill="#8FB8DE" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<path d="M116 45 L152 16 L146 45 L152 74Z" fill="#6E9CC9" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M40 50 Q70 70 100 50" fill="#DCEBF7"/>` +
      `<circle cx="42" cy="38" r="7" fill="#fff" stroke="${OUTLINE}" stroke-width="3"/><circle cx="43" cy="38" r="3" fill="${OUTLINE}"/>` +
      `<path d="M70 28 Q78 45 70 62" stroke="#5A86B5" stroke-width="4" fill="none"/>`,
  ),
);

write(
  'ice-hole.svg',
  svg(
    220,
    90,
    `<ellipse cx="110" cy="50" rx="104" ry="36" fill="#DDF3FF" stroke="#9CCBE8" stroke-width="5"/>` +
      `<ellipse cx="110" cy="52" rx="74" ry="22" fill="#1F5F99"/>` +
      `<ellipse cx="96" cy="46" rx="30" ry="6" fill="#4F9AD6" opacity="0.7"/>`,
  ),
);

write(
  'pedestal.svg',
  svg(
    180,
    150,
    `<rect x="30" y="118" width="120" height="24" rx="6" fill="#B9C7D6" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<rect x="56" y="54" width="68" height="68" rx="6" fill="#D6E2EE" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<rect x="40" y="36" width="100" height="24" rx="6" fill="#E8F0F7" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<path d="M70 70 L70 110 M90 70 L90 110 M110 70 L110 110" stroke="#AFC0D1" stroke-width="5"/>`,
  ),
);

// Urso acordado (bravo), sentado.
write(
  'bear-awake.svg',
  svg(
    320,
    280,
    `<ellipse cx="160" cy="200" rx="120" ry="78" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<ellipse cx="100" cy="258" rx="42" ry="20" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<ellipse cx="220" cy="258" rx="42" ry="20" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<circle cx="96" cy="46" r="26" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/><circle cx="96" cy="46" r="12" fill="#E6C9D6"/>` +
      `<circle cx="224" cy="46" r="26" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/><circle cx="224" cy="46" r="12" fill="#E6C9D6"/>` +
      `<ellipse cx="160" cy="104" rx="86" ry="72" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<ellipse cx="160" cy="132" rx="42" ry="32" fill="#E8EEF5" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<ellipse cx="160" cy="118" rx="16" ry="11" fill="${OUTLINE}"/>` +
      `<path d="M140 150 Q160 136 180 150" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      // sobrancelhas bravas
      `<path d="M104 72 L140 86" stroke="${OUTLINE}" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M216 72 L180 86" stroke="${OUTLINE}" stroke-width="8" stroke-linecap="round"/>` +
      `<circle cx="128" cy="96" r="8" fill="${OUTLINE}"/><circle cx="192" cy="96" r="8" fill="${OUTLINE}"/>`,
  ),
);

// Urso dormindo, deitado.
write(
  'bear-sleeping.svg',
  svg(
    380,
    220,
    `<ellipse cx="200" cy="150" rx="170" ry="62" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<circle cx="70" cy="70" r="20" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<ellipse cx="96" cy="128" rx="76" ry="60" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<ellipse cx="62" cy="150" rx="34" ry="24" fill="#E8EEF5" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<ellipse cx="44" cy="140" rx="12" ry="8" fill="${OUTLINE}"/>` +
      `<path d="M72 112 Q84 122 96 112" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M112 108 Q124 118 136 108" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M58 170 Q64 176 72 170" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="300" cy="196" rx="44" ry="16" fill="#F7FBFF" stroke="${OUTLINE}" stroke-width="6"/>`,
  ),
);

// ---------------------------------------------------------------- Globo
write(
  'globe.svg',
  svg(
    240,
    300,
    `<path d="M40 120 A80 80 0 0 0 200 120" stroke="#C8961A" stroke-width="10" fill="none"/>` +
      `<circle cx="120" cy="120" r="92" fill="#3FA9F5" stroke="${OUTLINE}" stroke-width="6"/>` +
      `<path d="M62 70 Q90 50 118 64 Q126 90 104 100 Q96 124 74 118 Q54 100 62 70Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<path d="M130 60 Q170 60 182 96 Q170 110 150 100 Q132 92 130 60Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<path d="M118 130 Q150 124 160 150 Q156 186 128 200 Q108 172 118 130Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<path d="M64 150 Q84 146 90 166 Q82 184 70 178Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
      `<ellipse cx="86" cy="84" rx="26" ry="12" fill="#fff" opacity="0.35" transform="rotate(-30 86 84)"/>` +
      `<rect x="110" y="212" width="20" height="44" fill="#C8961A" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<path d="M60 290 Q120 244 180 290Z" fill="#E0B040" stroke="${OUTLINE}" stroke-width="6" stroke-linejoin="round"/>`,
  ),
);

// ---------------------------------------------------------------- Ícones de interface
const icon = (body) => svg(96, 96, body);
write(
  'icon-hint.svg',
  icon(
    `<circle cx="48" cy="40" r="26" fill="#FFE066" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<rect x="36" y="62" width="24" height="18" rx="4" fill="#B0B8C8" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<path d="M40 44 Q48 30 56 44" stroke="#E0A800" stroke-width="4" fill="none"/>`,
  ),
);
write(
  'icon-home.svg',
  icon(
    `<path d="M16 46 L48 18 L80 46" stroke="${OUTLINE}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<rect x="26" y="44" width="44" height="34" rx="4" fill="#FFB35C" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<rect x="42" y="56" width="14" height="22" fill="#8A4B12"/>`,
  ),
);
const speaker = `<path d="M14 38 H30 L50 20 V76 L30 58 H14Z" fill="#fff" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>`;
write(
  'icon-sound-on.svg',
  icon(
    speaker +
      `<path d="M60 34 Q70 48 60 62" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M70 24 Q88 48 70 72" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  ),
);
write(
  'icon-sound-off.svg',
  icon(
    speaker +
      `<path d="M60 36 L82 60 M82 36 L60 60" stroke="#FF6B6B" stroke-width="7" stroke-linecap="round"/>`,
  ),
);
write(
  'icon-lock.svg',
  icon(
    `<path d="M30 44 V32 A18 18 0 0 1 66 32 V44" stroke="${OUTLINE}" stroke-width="8" fill="none"/>` +
      `<rect x="20" y="42" width="56" height="42" rx="8" fill="#B0B8C8" stroke="${OUTLINE}" stroke-width="5"/>` +
      `<circle cx="48" cy="62" r="6" fill="${OUTLINE}"/>`,
  ),
);
write(
  'icon-arrow.svg',
  icon(`<path d="M48 88 L16 48 H34 V8 H62 V48 H80Z" fill="#FFE066" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>`),
);

// ---------------------------------------------------------------- Mapa-múndi
write(
  'world-map.svg',
  svg(
    1280,
    720,
    `<rect width="1280" height="720" fill="url(#sea)"/>` +
      Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${80 * i}" x2="1280" y2="${80 * i}" stroke="#fff" stroke-opacity="0.12" stroke-width="2"/>`).join('') +
      Array.from({ length: 17 }, (_, i) => `<line x1="${80 * i}" y1="0" x2="${80 * i}" y2="720" stroke="#fff" stroke-opacity="0.12" stroke-width="2"/>`).join('') +
      `<g fill="#9BD97A" stroke="#5E9E4A" stroke-width="5" stroke-linejoin="round">` +
      // América do Norte (com Alasca à esquerda)
      `<path d="M70 150 Q120 100 200 110 L300 90 Q380 80 430 120 Q470 150 440 190 L410 230 Q380 250 360 300 Q340 330 300 340 Q280 360 290 380 L260 370 Q230 330 210 300 Q180 260 150 240 Q120 220 110 190 Q80 180 70 150Z"/>` +
      // Groenlândia
      `<path d="M470 60 Q540 50 560 80 Q550 120 500 130 Q470 110 470 60Z"/>` +
      // América do Sul
      `<path d="M320 400 Q370 380 420 420 Q460 450 440 500 Q420 560 380 610 Q360 650 350 640 Q340 590 340 540 Q310 480 320 400Z"/>` +
      // Europa
      `<path d="M580 130 Q620 110 680 120 Q720 130 730 160 Q700 190 660 200 Q630 210 600 200 Q580 180 590 160Z"/>` +
      // Ilhas Britânicas
      `<path d="M560 140 Q575 125 585 145 Q580 170 565 168Z"/>` +
      // África
      `<path d="M600 250 Q650 220 720 240 Q760 260 770 300 Q800 330 780 370 Q760 430 730 480 Q700 520 680 510 Q660 460 650 420 Q620 380 600 340 Q580 300 600 250Z"/>` +
      // Ásia
      `<path d="M730 120 Q820 70 940 90 Q1060 100 1140 150 Q1170 190 1120 220 Q1080 250 1040 280 Q1000 320 960 300 Q920 330 880 320 Q850 290 820 300 Q790 280 770 250 Q740 220 730 190 Q720 150 730 120Z"/>` +
      // Península Arábica
      `<path d="M770 260 Q810 250 830 280 Q820 320 790 330 Q770 300 770 260Z"/>` +
      // Oceania
      `<path d="M1020 440 Q1080 420 1130 450 Q1150 490 1110 520 Q1060 530 1030 500 Q1010 470 1020 440Z"/>` +
      `</g>`,
    `<radialGradient id="sea" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#7FD0F5"/><stop offset="1" stop-color="#2E86C9"/></radialGradient>`,
  ),
);

// ---------------------------------------------------------------- Cenário do Alasca (2560 x 720)
{
  const W = 2560;
  const H = 720;
  const mountains = Array.from({ length: 14 }, (_, i) => {
    const x = i * 200 - 60 + (i % 3) * 30;
    const h = 170 + ((i * 53) % 120);
    return `<path d="M${x} 420 L${x + 130} ${420 - h} L${x + 270} 420Z" fill="#CFE8F7"/><path d="M${x + 130} ${420 - h} L${x + 100} ${420 - h + 60} L${x + 125} ${420 - h + 50} L${x + 145} ${420 - h + 70} L${x + 170} ${420 - h + 45}Z" fill="#fff"/>`;
  }).join('');
  const glaciers = Array.from({ length: 9 }, (_, i) => {
    const x = i * 260 + 40;
    return `<path d="M${x} 440 L${x + 30} 350 L${x + 90} 330 L${x + 150} 360 L${x + 180} 440Z" fill="#A9DCF5" stroke="#7FC3E8" stroke-width="4"/><path d="M${x + 40} 360 L${x + 60} 430" stroke="#fff" stroke-width="6" opacity="0.6"/>`;
  }).join('');
  const snowBumps = Array.from({ length: 30 }, (_, i) => `<ellipse cx="${i * 90 + 20}" cy="${600 + ((i * 37) % 80)}" rx="40" ry="8" fill="#DCEFFA"/>`).join('');
  const cave =
    `<path d="M2080 460 Q2090 230 2300 200 Q2520 190 2560 250 L2560 720 L2080 720Z" fill="#7FC3E8" stroke="#4E97C8" stroke-width="6"/>` +
    `<path d="M2150 470 Q2170 300 2320 290 Q2470 300 2500 470Z" fill="#1E4E86"/>` +
    `<path d="M2170 470 Q2190 330 2320 320 Q2450 330 2480 470Z" fill="#2B67A8"/>` +
    // cristais
    [2180, 2230, 2420, 2460, 2350].map((x, i) => `<polygon points="${x},${470 - 40 - i * 6} ${x + 18},470 ${x - 18},470" fill="#8FE3FF" stroke="#fff" stroke-width="3" opacity="0.9"/>`).join('') +
    [2200, 2290, 2380, 2450].map((x) => `<polygon points="${x},300 ${x + 14},${340 + (x % 30)} ${x - 14},${340 + (x % 30)}" fill="#BFF0FF" opacity="0.9" transform="rotate(180 ${x} 320)"/>`).join('');

  write(
    'bg-alasca.svg',
    svg(
      W,
      H,
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
        `<circle cx="300" cy="120" r="60" fill="#FFF6C9" opacity="0.9"/>` +
        mountains +
        glaciers +
        `<path d="M0 440 Q640 400 1280 440 T2560 430 L2560 720 L0 720Z" fill="url(#snow)"/>` +
        snowBumps +
        cave,
      `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CCBF2"/><stop offset="1" stop-color="#E6F6FF"/></linearGradient>` +
        `<linearGradient id="snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3F2FC"/></linearGradient>`,
    ),
  );
}

// ---------------------------------------------------------------- Fases seguintes (um módulo por fase)
drawEngland({ svg, write, OUTLINE });
drawDubai({ svg, write, OUTLINE });
drawAfrica({ svg, write, OUTLINE });

// Floco de neve (partícula) e brilho.
write('snowflake.svg', svg(16, 16, `<circle cx="8" cy="8" r="6" fill="#fff"/>`));
write('sparkle.svg', svg(32, 32, `<path d="M16 0 L20 12 L32 16 L20 20 L16 32 L12 20 L0 16 L12 12Z" fill="#FFF7C2"/>`));

console.log('Arte provisória gerada em', OUT);
