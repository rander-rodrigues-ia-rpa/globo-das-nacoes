// Arte provisória da Fase 2 — Inglaterra (escola, parquinho, Diretor Mau).
export function drawEngland({ svg, write, OUTLINE }) {
  write(
    'item-chaves.svg',
    svg(
      140,
      110,
      `<circle cx="36" cy="36" r="24" fill="none" stroke="${OUTLINE}" stroke-width="12"/>` +
        `<circle cx="36" cy="36" r="24" fill="none" stroke="#F2C230" stroke-width="7"/>` +
        `<rect x="54" y="30" width="72" height="14" rx="5" fill="#F2C230" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="100" y="42" width="10" height="20" fill="#F2C230" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="116" y="42" width="10" height="14" fill="#F2C230" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<g transform="rotate(35 36 36)"><rect x="54" y="30" width="60" height="12" rx="5" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="92" y="40" width="9" height="16" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/></g>`,
    ),
  );

  write(
    'item-lanterna.svg',
    svg(
      160,
      90,
      `<path d="M104 22 L150 6 L150 84 L104 68Z" fill="#FFF3A6" opacity="0.8"/>` +
        `<rect x="14" y="30" width="72" height="30" rx="10" fill="#E0564F" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M84 22 L108 16 L108 74 L84 68Z" fill="#B8C0CC" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
        `<rect x="36" y="38" width="16" height="14" rx="4" fill="#FFD23F" stroke="${OUTLINE}" stroke-width="3"/>`,
    ),
  );

  const windowFrame = (panes, extra = '') =>
    svg(
      220,
      250,
      `<rect x="10" y="10" width="200" height="220" rx="12" fill="#8A5A34" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<rect x="28" y="28" width="164" height="184" fill="${panes}"/>` +
        extra +
        `<path d="M110 28 V212 M28 120 H192" stroke="#8A5A34" stroke-width="12"/>` +
        `<rect x="0" y="222" width="220" height="22" rx="6" fill="#A87448" stroke="${OUTLINE}" stroke-width="5"/>`,
    );
  write('window.svg', windowFrame('#BFE6FF', `<path d="M40 60 L80 40 M130 170 L170 150" stroke="#fff" stroke-width="8" opacity="0.7" stroke-linecap="round"/>`));
  write(
    'window-lit.svg',
    windowFrame(
      '#FFF3A6',
      `<circle cx="110" cy="120" r="70" fill="#FFFFFF" opacity="0.8"/>` +
        `<path d="M110 36 L122 104 L190 120 L122 136 L110 204 L98 136 L30 120 L98 104Z" fill="#FFE066"/>`,
    ),
  );

  // Diretor Mau: rabugento, não assustador. De frente, olhando para a direita da imagem.
  const legs =
    `<rect x="78" y="270" width="28" height="84" rx="10" fill="#4A3B30" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<rect x="114" y="270" width="28" height="84" rx="10" fill="#4A3B30" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<ellipse cx="92" cy="358" rx="24" ry="12" fill="#1E1A18" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<ellipse cx="132" cy="358" rx="24" ry="12" fill="#1E1A18" stroke="${OUTLINE}" stroke-width="5"/>`;
  const suit = `<rect x="62" y="130" width="96" height="150" rx="30" fill="#8B5E3C" stroke="${OUTLINE}" stroke-width="5"/>`;
  const ruler = (transform) =>
    `<g transform="${transform}"><rect x="0" y="0" width="130" height="22" rx="4" fill="#F7C948" stroke="${OUTLINE}" stroke-width="4"/>` +
    Array.from({ length: 9 }, (_, i) => `<line x1="${12 + i * 13}" y1="1" x2="${12 + i * 13}" y2="${i % 2 ? 9 : 13}" stroke="${OUTLINE}" stroke-width="3"/>`).join('') +
    `</g>`;

  write(
    'director.svg',
    svg(
      240,
      380,
      legs +
        suit +
        `<path d="M96 132 L110 190 L124 132Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M104 146 L116 146 L112 186 L110 192 L108 186Z" fill="#B3263A"/>` +
        `<rect x="40" y="140" width="28" height="100" rx="14" fill="#7A5033" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="54" cy="244" r="14" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>` +
        ruler('translate(150 210) rotate(-70)') +
        `<rect x="152" y="140" width="28" height="80" rx="14" fill="#7A5033" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="166" cy="222" r="14" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="110" cy="84" r="54" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M58 84 Q50 40 80 42 Q70 60 72 84Z M162 84 Q170 40 140 42 Q150 60 148 84Z" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="90" cy="86" r="16" fill="#fff" stroke="${OUTLINE}" stroke-width="5"/><circle cx="130" cy="86" r="16" fill="#fff" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<line x1="106" y1="86" x2="114" y2="86" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="95" cy="88" r="5" fill="${OUTLINE}"/><circle cx="135" cy="88" r="5" fill="${OUTLINE}"/>` +
        `<path d="M74 64 L102 72 M146 64 L118 72" stroke="${OUTLINE}" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M86 116 Q110 102 134 116 Q110 110 86 116Z" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M98 128 Q110 122 122 128" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    ),
  );

  write(
    'director-back.svg',
    svg(
      240,
      380,
      legs +
        suit +
        `<line x1="110" y1="200" x2="110" y2="280" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="40" y="140" width="28" height="90" rx="14" fill="#7A5033" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="152" y="140" width="28" height="90" rx="14" fill="#7A5033" stroke="${OUTLINE}" stroke-width="5"/>` +
        ruler('translate(45 222)') +
        `<circle cx="110" cy="84" r="54" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M58 90 Q56 124 110 130 Q164 124 162 90 Q160 110 110 112 Q60 110 58 90Z" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<ellipse cx="56" cy="88" rx="8" ry="14" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<ellipse cx="164" cy="88" rx="8" ry="14" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>`,
    ),
  );

  const locker = (door) =>
    svg(
      200,
      320,
      `<rect x="20" y="10" width="160" height="300" rx="10" fill="#5B7FA6" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<rect x="36" y="26" width="128" height="268" rx="6" fill="#2E3D55"/>` +
        door,
    );
  write(
    'locker-closed.svg',
    locker(
      `<rect x="36" y="26" width="128" height="268" rx="6" fill="#6F95BF" stroke="${OUTLINE}" stroke-width="4"/>` +
        [60, 76, 92].map((y) => `<rect x="62" y="${y}" width="76" height="8" rx="4" fill="#4E6F94"/>`).join('') +
        `<rect x="72" y="130" width="56" height="30" rx="6" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="3"/>` +
        `<path d="M126 176 V160 A14 14 0 0 1 154 160 V176" stroke="${OUTLINE}" stroke-width="6" fill="none"/>` +
        `<rect x="118" y="174" width="44" height="38" rx="8" fill="#F2C230" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="140" cy="190" r="5" fill="${OUTLINE}"/><rect x="138" y="190" width="4" height="12" fill="${OUTLINE}"/>`,
    ),
  );
  write(
    'locker-open.svg',
    locker(
      `<ellipse cx="100" cy="120" rx="60" ry="80" fill="#FFF3A6" opacity="0.5"/>` +
        `<rect x="40" y="200" width="120" height="8" fill="#5B7FA6"/>` +
        `<path d="M36 26 L4 40 L4 290 L36 294Z" fill="#6F95BF" stroke="${OUTLINE}" stroke-width="4" stroke-linejoin="round"/>`,
    ),
  );

  drawSchool({ svg, write });
}

function drawSchool({ svg, write }) {
  const W = 3000;
  const H = 720;
  const FLOOR = 440;
  const INK = '#2B2A4C';
  const label = (x, y, text, size = 18) =>
    `<text x="${x}" y="${y}" font-family="Trebuchet MS, sans-serif" font-size="${size}" font-weight="bold" fill="${INK}" text-anchor="middle">${text}</text>`;
  const lockers = (from, count) =>
    Array.from({ length: count }, (_, i) => {
      const x = from + i * 62;
      return (
        `<rect x="${x}" y="250" width="58" height="190" rx="4" fill="#5B8FD1" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="${x + 14}" y="268" width="30" height="6" rx="3" fill="#3F6FAE"/>` +
        `<rect x="${x + 14}" y="280" width="30" height="6" rx="3" fill="#3F6FAE"/>` +
        `<circle cx="${x + 46}" cy="350" r="4" fill="${INK}"/>`
      );
    }).join('');
  const door = (x, text) =>
    `<rect x="${x}" y="230" width="120" height="210" rx="6" fill="#9C6A3F" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="${x + 30}" y="252" width="60" height="50" fill="#BFE6FF" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="${x + 100}" cy="340" r="7" fill="#F2C230" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="${x + 10}" y="196" width="100" height="28" rx="6" fill="#FFF8E7" stroke="${INK}" stroke-width="3"/>` +
    label(x + 60, 217, text);

  const playground =
    `<rect width="960" height="${H}" fill="url(#skyEn)"/>` +
    `<circle cx="160" cy="110" r="46" fill="#FFF6C9"/>` +
    `<g fill="#fff" opacity="0.9"><ellipse cx="420" cy="120" rx="70" ry="26"/><ellipse cx="470" cy="100" rx="50" ry="30"/><ellipse cx="760" cy="160" rx="60" ry="22"/></g>` +
    [80, 330, 580, 840]
      .map((x) => `<rect x="${x - 10}" y="300" width="20" height="120" fill="#7A4E2D"/><circle cx="${x}" cy="280" r="60" fill="#5DBB63" stroke="#3E8E45" stroke-width="5"/>`)
      .join('') +
    `<rect x="0" y="${FLOOR - 20}" width="960" height="${H - FLOOR + 20}" fill="#8ED16B"/>` +
    // balanço
    `<path d="M170 460 L220 290 L360 290 L410 460" stroke="#C0392B" stroke-width="12" fill="none" stroke-linejoin="round"/>` +
    `<line x1="250" y1="290" x2="250" y2="410" stroke="#555" stroke-width="4"/><line x1="290" y1="290" x2="290" y2="410" stroke="#555" stroke-width="4"/>` +
    `<rect x="240" y="408" width="60" height="12" rx="4" fill="#F29A1F" stroke="${INK}" stroke-width="3"/>` +
    // caixa de areia
    `<rect x="440" y="500" width="200" height="90" rx="10" fill="#F3D58A" stroke="#A8703F" stroke-width="10"/>` +
    `<ellipse cx="500" cy="540" rx="30" ry="8" fill="#E5C06A"/><ellipse cx="600" cy="565" rx="22" ry="6" fill="#E5C06A"/>` +
    // escorregador
    `<path d="M700 300 L740 300 L740 460 L700 460Z" fill="none" stroke="#3F6FAE" stroke-width="8"/>` +
    [330, 370, 410, 450].map((y) => `<line x1="700" y1="${y}" x2="740" y2="${y}" stroke="#3F6FAE" stroke-width="6"/>`).join('') +
    `<path d="M740 300 Q820 330 860 460" stroke="#FFD23F" stroke-width="22" fill="none" stroke-linecap="round"/>` +
    // amarelinha
    [0, 1, 2].map((i) => `<rect x="${110 + i * 50}" y="620" width="46" height="40" fill="none" stroke="#fff" stroke-width="4"/>`).join('');

  const corridor =
    `<rect x="900" y="0" width="${W - 900}" height="${FLOOR}" fill="#F6E7C8"/>` +
    `<rect x="970" y="360" width="${W - 970}" height="80" fill="#A0503A"/>` +
    `<rect x="970" y="${FLOOR}" width="${W - 970}" height="${H - FLOOR}" fill="#C98E5A"/>` +
    Array.from({ length: 8 }, (_, i) => `<line x1="970" y1="${FLOOR + 36 * i}" x2="${W}" y2="${FLOOR + 36 * i}" stroke="#A8703F" stroke-width="3"/>`).join('') +
    Array.from({ length: 8 }, (_, i) => {
      const x = 1060 + i * 250;
      return `<rect x="${x}" y="0" width="6" height="40" fill="#8A8F99"/><ellipse cx="${x + 3}" cy="46" rx="36" ry="12" fill="#FFF3C2" stroke="${INK}" stroke-width="3"/>`;
    }).join('') +
    // parede de tijolos da fachada (entrada)
    `<rect x="900" y="0" width="70" height="${H}" fill="#B5553C" stroke="${INK}" stroke-width="5"/>` +
    Array.from({ length: 18 }, (_, i) => `<line x1="900" y1="${i * 40}" x2="970" y2="${i * 40}" stroke="#8E3E2A" stroke-width="3"/>`).join('') +
    door(1080, 'Sala 1') +
    `<rect x="1060" y="470" width="170" height="16" rx="4" fill="#8A5A34" stroke="${INK}" stroke-width="3"/>` +
    lockers(1260, 3) +
    `<rect x="1680" y="210" width="170" height="120" rx="6" fill="#C9864B" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="1700" y="226" width="50" height="40" fill="#fff"/><rect x="1770" y="236" width="56" height="44" fill="#FFE066"/><rect x="1710" y="280" width="60" height="36" fill="#BFE6FF"/>` +
    lockers(1900, 5) +
    `<circle cx="2240" cy="160" r="40" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M2240 160 V132 M2240 160 L2260 170" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;

  const office =
    `<rect x="2330" y="0" width="${W - 2330}" height="360" fill="#D8EDD0"/>` +
    `<rect x="2330" y="0" width="20" height="${FLOOR}" fill="#8A5A34"/>` +
    `<rect x="2350" y="200" width="110" height="240" fill="#3A2A20"/>` +
    `<rect x="2340" y="164" width="130" height="30" rx="6" fill="#FFF8E7" stroke="${INK}" stroke-width="3"/>` +
    label(2405, 186, 'Diretoria', 19) +
    `<rect x="2800" y="360" width="170" height="20" fill="#7A4E2D" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="2810" y="380" width="20" height="70" fill="#7A4E2D"/><rect x="2940" y="380" width="20" height="70" fill="#7A4E2D"/>` +
    `<rect x="2480" y="120" width="100" height="240" fill="#8A5A34" stroke="${INK}" stroke-width="4"/>` +
    [160, 220, 280]
      .map(
        (y) =>
          `<line x1="2480" y1="${y}" x2="2580" y2="${y}" stroke="${INK}" stroke-width="4"/>` +
          ['#E0564F', '#46B7F0', '#F7C948', '#3CC46A'].map((c, k) => `<rect x="${2488 + k * 22}" y="${y - 34}" width="16" height="32" fill="${c}"/>`).join(''),
      )
      .join('');

  write(
    'bg-inglaterra.svg',
    svg(
      W,
      H,
      playground + corridor + office,
      `<linearGradient id="skyEn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CCBF2"/><stop offset="1" stop-color="#DFF3FF"/></linearGradient>`,
    ),
  );
}
