// Arte provisória da Fase 3 — Dubai (shopping, blecaute, Ladrão).
export function drawDubai({ svg, write, OUTLINE }) {
  write(
    'item-celular.svg',
    svg(
      90,
      150,
      `<rect x="8" y="6" width="74" height="138" rx="14" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="16" y="22" width="58" height="100" rx="6" fill="#46B7F0"/>` +
        `<path d="M26 40 L50 40 M26 56 L62 56 M26 72 L44 72" stroke="#BFF0FF" stroke-width="6" stroke-linecap="round"/>` +
        `<circle cx="45" cy="132" r="6" fill="#8A8F99"/>`,
    ),
  );

  write(
    'footprints.svg',
    svg(
      120,
      80,
      [
        [30, 48, -12],
        [80, 28, 8],
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="14" ry="22" fill="#6FE3FF"/>` +
            [-10, -3, 4, 10].map((dx, i) => `<circle cx="${x + dx}" cy="${y - 28 + (i === 0 || i === 3 ? 4 : 0)}" r="4.5" fill="#6FE3FF"/>`).join('') +
            `</g>`,
        )
        .join(''),
    ),
  );

  // Vitrine da joalheria (o fragmento fica em cima dela no começo).
  write(
    'display-case.svg',
    svg(
      220,
      200,
      `<rect x="20" y="110" width="180" height="80" rx="8" fill="#3A2E2A" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="34" y="124" width="152" height="10" fill="#C8961A"/>` +
        `<rect x="20" y="20" width="180" height="96" rx="8" fill="#DFF3FF" fill-opacity="0.55" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M40 36 L70 36 M150 90 L180 60" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` +
        `<rect x="80" y="84" width="60" height="26" rx="4" fill="#B3263A" stroke="${OUTLINE}" stroke-width="4"/>`,
    ),
  );

  const generator = (led, screen) =>
    svg(
      160,
      200,
      `<rect x="14" y="14" width="132" height="176" rx="12" fill="#8A8F99" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<rect x="30" y="34" width="100" height="56" rx="6" fill="${screen}" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M86 42 L66 64 L80 64 L72 84 L96 58 L82 58Z" fill="#FFE066" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>` +
        [110, 130, 150].map((y) => `<rect x="34" y="${y}" width="92" height="8" rx="4" fill="#6B707A"/>`).join('') +
        `<circle cx="126" cy="112" r="10" fill="${led}" stroke="${OUTLINE}" stroke-width="3"/>`,
    );
  write('generator.svg', generator('#FF4D6D', '#2B2A4C'));
  write('generator-on.svg', generator('#3CC46A', '#BFF0FF'));

  // Ladrão: gorro, máscara de olhos e camisa listrada — engraçado, não assustador.
  const thiefBody = (arms, face) =>
    `<rect x="72" y="200" width="26" height="70" rx="10" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<rect x="104" y="200" width="26" height="70" rx="10" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<ellipse cx="84" cy="274" rx="22" ry="11" fill="#111" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<ellipse cx="120" cy="274" rx="22" ry="11" fill="#111" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<rect x="60" y="112" width="82" height="100" rx="28" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
    [128, 150, 172, 194].map((y) => `<rect x="62" y="${y}" width="78" height="10" fill="#2B2A4C"/>`).join('') +
    arms +
    `<circle cx="101" cy="72" r="50" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<path d="M50 70 Q50 18 101 18 Q152 18 152 70 Q128 52 101 52 Q74 52 50 70Z" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<circle cx="101" cy="16" r="10" fill="#E0564F" stroke="${OUTLINE}" stroke-width="3"/>` +
    `<path d="M54 70 Q101 58 148 70 L146 92 Q101 82 56 92Z" fill="#111"/>` +
    face;
  write(
    'thief.svg',
    svg(
      210,
      290,
      thiefBody(
        `<rect x="36" y="120" width="26" height="70" rx="13" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5" transform="rotate(30 49 120)"/>` +
          `<rect x="140" y="120" width="26" height="70" rx="13" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5" transform="rotate(-50 153 120)"/>`,
        `<ellipse cx="82" cy="78" rx="9" ry="7" fill="#fff"/><ellipse cx="120" cy="78" rx="9" ry="7" fill="#fff"/>` +
          `<circle cx="85" cy="79" r="4" fill="${OUTLINE}"/><circle cx="123" cy="79" r="4" fill="${OUTLINE}"/>` +
          `<path d="M84 104 Q101 118 120 102" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ),
    ),
  );
  write(
    'thief-scared.svg',
    svg(
      210,
      290,
      thiefBody(
        `<rect x="40" y="40" width="26" height="80" rx="13" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5" transform="rotate(-15 53 120)"/>` +
          `<rect x="136" y="40" width="26" height="80" rx="13" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5" transform="rotate(15 149 120)"/>` +
          `<circle cx="36" cy="40" r="13" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/><circle cx="168" cy="40" r="13" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>`,
        `<circle cx="82" cy="78" r="10" fill="#fff"/><circle cx="120" cy="78" r="10" fill="#fff"/>` +
          `<circle cx="82" cy="78" r="3" fill="${OUTLINE}"/><circle cx="120" cy="78" r="3" fill="${OUTLINE}"/>` +
          `<ellipse cx="101" cy="108" rx="11" ry="13" fill="${OUTLINE}"/>` +
          `<path d="M150 52 Q158 66 150 72 Q142 66 150 52Z" fill="#8FD3FF" stroke="${OUTLINE}" stroke-width="2"/>`,
      ),
    ),
  );

  // Camada de escuridão: preta com um "buraco" de luz suave no meio.
  write(
    'darkness.svg',
    svg(
      1024,
      640,
      `<rect width="1024" height="640" fill="url(#hole)"/>`,
      `<radialGradient id="hole" cx="512" cy="320" r="120" gradientUnits="userSpaceOnUse">` +
        `<stop offset="0" stop-color="#05060F" stop-opacity="0"/><stop offset="0.55" stop-color="#05060F" stop-opacity="0.15"/>` +
        `<stop offset="1" stop-color="#05060F" stop-opacity="0.97"/></radialGradient>`,
    ),
  );

  drawMall({ svg, write });
}

function drawMall({ svg, write }) {
  const W = 3400;
  const H = 720;
  const FLOOR = 440;
  const INK = '#2B2A4C';
  const label = (x, y, text, size = 22, color = INK) =>
    `<text x="${x}" y="${y}" font-family="Trebuchet MS, sans-serif" font-size="${size}" font-weight="bold" fill="${color}" text-anchor="middle">${text}</text>`;
  const shop = (x, w, name, awning) =>
    `<rect x="${x}" y="200" width="${w}" height="${FLOOR - 200}" fill="#F7EBD3" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="${x + 20}" y="250" width="${w - 40}" height="${FLOOR - 270}" fill="#CFEFFF" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M${x} 200 h${w} l-14 40 h-${w - 28}Z" fill="${awning}" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="${x + w / 2 - 80}" y="160" width="160" height="36" rx="8" fill="#2B2A4C"/>` +
    label(x + w / 2, 186, name, 22, '#F7C948');
  const column = (x) =>
    `<rect x="${x}" y="90" width="36" height="${FLOOR - 90}" fill="#F2D27A" stroke="#B88A1E" stroke-width="4"/>` +
    `<rect x="${x - 8}" y="80" width="52" height="16" fill="#E0B040" stroke="#B88A1E" stroke-width="3"/>`;
  const palm = (x) =>
    `<rect x="${x - 30}" y="400" width="60" height="44" rx="6" fill="#C8961A" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M${x} 400 Q${x - 6} 330 ${x + 4} 280" stroke="#8A5A34" stroke-width="12" fill="none"/>` +
    [-60, -20, 20, 60].map((dx) => `<path d="M${x + 4} 280 Q${x + dx} ${270 - Math.abs(dx) / 3} ${x + dx * 1.6} ${310}" stroke="#3CA35A" stroke-width="14" fill="none" stroke-linecap="round"/>`).join('');

  const tiles = Array.from({ length: Math.ceil(W / 120) }, (_, i) => `<line x1="${i * 120}" y1="${FLOOR}" x2="${i * 120 - 80}" y2="${H}" stroke="#E6DCCB" stroke-width="3"/>`).join('');
  write(
    'bg-dubai.svg',
    svg(
      W,
      H,
      `<rect width="${W}" height="${FLOOR}" fill="#FFF3DD"/>` +
        // claraboia e andar de cima
        `<rect x="0" y="0" width="${W}" height="70" fill="#BFE6FF"/>` +
        Array.from({ length: 29 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="70" stroke="#E0B040" stroke-width="6"/>`).join('') +
        `<rect x="0" y="70" width="${W}" height="14" fill="#E0B040"/>` +
        `<rect x="0" y="118" width="${W}" height="8" fill="#9FD8FF" opacity="0.8"/>` +
        // piso de mármore
        `<rect x="0" y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#F5EFE4"/>` +
        tiles +
        `<rect x="0" y="${FLOOR}" width="${W}" height="10" fill="#E0B040"/>` +
        // entrada e balcão de informações (onde fica a lanterna)
        `<rect x="40" y="220" width="140" height="${FLOOR - 220}" fill="#DFF3FF" stroke="${INK}" stroke-width="5"/>` +
        label(110, 205, 'Entrada', 24) +
        `<rect x="340" y="396" width="200" height="60" rx="8" fill="#C8961A" stroke="${INK}" stroke-width="5"/>` +
        label(440, 434, 'Informações', 18, '#FFF8E7') +
        column(240) +
        palm(610) +
        shop(660, 360, 'Joalheria', '#B3263A') +
        column(1060) +
        shop(1130, 320, 'Brinquedos', '#46B7F0') +
        palm(1520) +
        shop(1580, 320, 'Doces', '#FF9FB5') +
        column(1960) +
        shop(2030, 340, 'Perfumes', '#9B6FD6') +
        palm(2440) +
        column(2560) +
        // corredor de serviço sem saída
        `<rect x="2640" y="84" width="${W - 2640}" height="${FLOOR - 84}" fill="#D9D2C5"/>` +
        `<rect x="2640" y="${FLOOR}" width="${W - 2640}" height="${H - FLOOR}" fill="#CFC6B6"/>` +
        `<rect x="2650" y="140" width="220" height="40" rx="6" fill="#FFE066" stroke="${INK}" stroke-width="4"/>` +
        label(2760, 168, 'Só funcionários', 20) +
        `<rect x="${W - 40}" y="84" width="40" height="${H - 84}" fill="#9C9384" stroke="${INK}" stroke-width="5"/>` +
        [0, 1, 2].map((i) => `<rect x="${2900 + i * 110}" y="330" width="90" height="110" rx="6" fill="#A87448" stroke="${INK}" stroke-width="4"/>`).join(''),
    ),
  );
}
