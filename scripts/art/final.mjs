// Arte provisória do final: Altar do Mundo e os "vilões" redimidos do epílogo.
export function drawFinale({ svg, write, OUTLINE }) {
  const continents =
    `<path d="M92 90 Q122 66 150 82 Q158 110 134 122 Q124 150 100 142 Q78 122 92 90Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<path d="M164 76 Q208 76 222 116 Q208 132 186 120 Q166 110 164 76Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<path d="M152 156 Q188 148 198 178 Q194 220 162 236 Q140 204 152 156Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>` +
    `<path d="M88 178 Q110 172 118 196 Q108 216 94 208Z" fill="#5DD27A" stroke="${OUTLINE}" stroke-width="4"/>`;
  write(
    'globe-sphere.svg',
    svg(
      300,
      300,
      `<circle cx="150" cy="150" r="140" fill="#3FA9F5" stroke="${OUTLINE}" stroke-width="7"/>` +
        `<g transform="translate(-10 -8) scale(1.1)">${continents}</g>` +
        `<ellipse cx="104" cy="92" rx="40" ry="16" fill="#fff" opacity="0.35" transform="rotate(-30 104 92)"/>`,
    ),
  );
  write(
    'globe-ghost.svg',
    svg(
      300,
      300,
      `<circle cx="150" cy="150" r="140" fill="#FFFFFF" fill-opacity="0.35" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="16 12"/>` +
        `<path d="M10 150 H290 M150 10 V290" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="4"/>` +
        `<ellipse cx="150" cy="150" rx="60" ry="140" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="4"/>`,
    ),
  );

  // Diretor (agora Bom) lendo um livro, sorrindo.
  write(
    'director-reading.svg',
    svg(
      240,
      320,
      `<rect x="62" y="130" width="116" height="170" rx="32" fill="#8B5E3C" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M104 132 L120 186 L136 132Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="120" cy="84" r="54" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M68 84 Q60 40 90 42 Q80 60 82 84Z M172 84 Q180 40 150 42 Q160 60 158 84Z" fill="#C9CED8" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="100" cy="86" r="15" fill="#fff" stroke="${OUTLINE}" stroke-width="5"/><circle cx="140" cy="86" r="15" fill="#fff" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M92 90 Q100 82 108 90 M132 90 Q140 82 148 90" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M100 114 Q120 132 140 114" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        // livro aberto
        `<path d="M40 214 L118 196 L118 272 L40 290Z" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
        `<path d="M200 214 L122 196 L122 272 L200 290Z" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="5" stroke-linejoin="round"/>` +
        `<path d="M54 226 L104 214 M54 244 L104 232 M136 214 L186 226 M136 232 L186 244" stroke="#B0B8C8" stroke-width="4"/>` +
        `<rect x="112" y="192" width="16" height="84" fill="#E0564F" stroke="${OUTLINE}" stroke-width="3"/>`,
    ),
  );

  // Ladrão arrependido, sem máscara, devolvendo as joias.
  write(
    'thief-friendly.svg',
    svg(
      240,
      300,
      `<rect x="70" y="200" width="26" height="80" rx="10" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="112" y="200" width="26" height="80" rx="10" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="58" y="112" width="94" height="100" rx="28" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        [128, 150, 172, 194].map((y) => `<rect x="60" y="${y}" width="90" height="10" fill="#2B2A4C"/>`).join('') +
        `<rect x="140" y="140" width="80" height="26" rx="13" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="104" cy="72" r="50" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M54 70 Q54 18 104 18 Q154 18 154 70 Q130 52 104 52 Q78 52 54 70Z" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M84 76 Q92 68 100 76 M110 76 Q118 68 126 76" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        `<path d="M86 96 Q104 112 122 96" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        `<circle cx="76" cy="92" r="8" fill="#FF8A8A" opacity="0.6"/><circle cx="132" cy="92" r="8" fill="#FF8A8A" opacity="0.6"/>` +
        // colar de joias na mão
        `<circle cx="218" cy="152" r="14" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M212 164 Q200 214 226 230 Q246 214 230 164" stroke="#F7C948" stroke-width="6" fill="none"/>` +
        [
          [204, 196, '#FF4D6D'],
          [226, 228, '#46B7F0'],
          [238, 196, '#3CC46A'],
        ]
          .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="${OUTLINE}" stroke-width="3"/>`)
          .join(''),
    ),
  );

  // Capitão Cascudo de férias: boia, camisa florida e água de coco.
  write(
    'captain-float.svg',
    svg(
      300,
      260,
      `<ellipse cx="150" cy="200" rx="130" ry="46" fill="#FF4D6D" stroke="${OUTLINE}" stroke-width="6"/>` +
        [-90, -30, 30, 90].map((dx) => `<rect x="${150 + dx - 10}" y="160" width="20" height="80" fill="#FFFFFF" opacity="0.9"/>`).join('') +
        `<ellipse cx="150" cy="196" rx="84" ry="24" fill="#46B7F0" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="96" y="110" width="108" height="90" rx="30" fill="#FF9F2E" stroke="${OUTLINE}" stroke-width="5"/>` +
        [
          [118, 134],
          [170, 150],
          [140, 176],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#FFE066"/><circle cx="${x}" cy="${y}" r="4" fill="#E0564F"/>`)
          .join('') +
        `<circle cx="150" cy="74" r="46" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M106 82 Q108 140 150 142 Q192 140 194 82 Q176 102 150 102 Q124 102 106 82Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="116" y="62" width="30" height="16" rx="6" fill="#2B2A4C"/><rect x="154" y="62" width="30" height="16" rx="6" fill="#2B2A4C"/><path d="M146 68 H154" stroke="#2B2A4C" stroke-width="4"/>` +
        `<path d="M136 112 Q150 122 164 112" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M104 46 Q106 12 150 10 Q194 12 196 46Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="102" y="40" width="96" height="12" rx="5" fill="#1E1A18"/>` +
        // água de coco
        `<circle cx="236" cy="130" r="26" fill="#6B8E23" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M236 106 L252 70" stroke="#FF4D6D" stroke-width="5" stroke-linecap="round"/>` +
        `<rect x="198" y="126" width="30" height="20" rx="10" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>`,
    ),
  );

  // Templo do Altar do Mundo.
  const column = (x) =>
    `<rect x="${x}" y="150" width="70" height="440" fill="#F4ECD8" stroke="#C9B48A" stroke-width="5"/>` +
    [0, 1, 2, 3].map((i) => `<line x1="${x + 14 + i * 14}" y1="160" x2="${x + 14 + i * 14}" y2="580" stroke="#DCCFB0" stroke-width="4"/>`).join('') +
    `<rect x="${x - 14}" y="130" width="98" height="26" rx="4" fill="#E8DCC0" stroke="#C9B48A" stroke-width="4"/>` +
    `<rect x="${x - 14}" y="584" width="98" height="26" rx="4" fill="#E8DCC0" stroke="#C9B48A" stroke-width="4"/>`;
  write(
    'bg-altar.svg',
    svg(
      1280,
      720,
      `<rect width="1280" height="720" fill="url(#templeSky)"/>` +
        Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return `<path d="M640 330 L${640 + Math.cos(a) * 900} ${330 + Math.sin(a) * 900} L${640 + Math.cos(a + 0.12) * 900} ${330 + Math.sin(a + 0.12) * 900}Z" fill="#FFF3C2" opacity="0.35"/>`;
        }).join('') +
        `<path d="M160 150 Q640 -40 1120 150" stroke="#E0B040" stroke-width="28" fill="none"/>` +
        column(120) +
        column(300) +
        column(910) +
        column(1090) +
        `<rect x="0" y="600" width="1280" height="120" fill="#EDE3CC"/>` +
        Array.from({ length: 11 }, (_, i) => `<line x1="${i * 128}" y1="600" x2="${i * 128 - 60}" y2="720" stroke="#D8CCAE" stroke-width="3"/>`).join('') +
        // pedestal
        `<path d="M520 640 L760 640 L730 560 L550 560Z" fill="#E8DCC0" stroke="#A8925E" stroke-width="6" stroke-linejoin="round"/>` +
        `<rect x="540" y="540" width="200" height="26" rx="6" fill="#F4ECD8" stroke="#A8925E" stroke-width="5"/>` +
        `<rect x="500" y="636" width="280" height="24" rx="6" fill="#DCCFB0" stroke="#A8925E" stroke-width="5"/>`,
      `<linearGradient id="templeSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD98A"/><stop offset="1" stop-color="#FFF8E7"/></linearGradient>`,
    ),
  );
}
