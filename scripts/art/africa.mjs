// Arte provisória da Fase 4 — África (savana, selva e o bando de leões).
export function drawAfrica({ svg, write, OUTLINE }) {
  write(
    'item-bife.svg',
    svg(
      150,
      110,
      `<rect x="96" y="20" width="16" height="60" rx="8" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="5" transform="rotate(35 104 50)"/>` +
        `<circle cx="126" cy="18" r="11" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="5"/><circle cx="138" cy="30" r="11" fill="#FFF8E7" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M20 60 Q18 20 64 22 Q104 24 104 60 Q104 96 60 96 Q22 96 20 60Z" fill="#E0564F" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M34 60 Q36 36 62 36 Q88 38 88 60 Q88 82 60 82 Q36 82 34 60Z" fill="#F28B82"/>` +
        `<path d="M48 50 Q60 44 72 52 M46 66 Q60 60 76 68" stroke="#FFF1E8" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    ),
  );
  write(
    'item-frutas.svg',
    svg(
      150,
      120,
      `<path d="M30 40 Q20 90 70 104 Q40 80 50 40Z" fill="#FFE066" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M46 34 Q44 86 92 96 Q62 74 66 34Z" fill="#FFD23F" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="44" y="24" width="16" height="14" rx="4" fill="#7A5230" stroke="${OUTLINE}" stroke-width="3"/>` +
        `<ellipse cx="108" cy="72" rx="30" ry="36" fill="#FF9F2E" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M108 36 Q118 22 130 26 Q122 38 108 38Z" fill="#3CC46A" stroke="${OUTLINE}" stroke-width="3"/>` +
        `<ellipse cx="98" cy="60" rx="8" ry="12" fill="#FFD9A0" opacity="0.8"/>` +
        [
          [70, 100],
          [84, 104],
          [78, 90],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#C21F45" stroke="${OUTLINE}" stroke-width="3"/>`)
          .join(''),
    ),
  );

  // Círculo tracejado no chão: onde a criança coloca comida para montar a trilha.
  write(
    'trail-spot.svg',
    svg(
      180,
      90,
      `<ellipse cx="90" cy="45" rx="82" ry="38" fill="#FFF8E7" fill-opacity="0.45" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="14 10"/>` +
        `<g fill="#7A5230" opacity="0.55"><ellipse cx="90" cy="52" rx="16" ry="12"/>` +
        `<circle cx="72" cy="34" r="6"/><circle cx="84" cy="28" r="6"/><circle cx="96" cy="28" r="6"/><circle cx="108" cy="34" r="6"/></g>`,
    ),
  );

  // Leões: rabugentos quando guardam a clareira, felizes quando comem.
  const lion = ({ mane, happy }) => {
    const fur = '#E8A33D';
    const maneRing = mane
      ? Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return `<circle cx="${150 + Math.cos(a) * 62}" cy="${104 + Math.sin(a) * 58}" r="30" fill="#B5651D" stroke="${OUTLINE}" stroke-width="4"/>`;
        }).join('') + `<circle cx="150" cy="104" r="66" fill="#B5651D"/>`
      : '';
    const eyes = happy
      ? `<path d="M118 100 Q128 90 138 100 M162 100 Q172 90 182 100" stroke="${OUTLINE}" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<path d="M114 86 L138 94 M186 86 L162 94" stroke="${OUTLINE}" stroke-width="7" stroke-linecap="round"/>` +
        `<circle cx="128" cy="102" r="7" fill="${OUTLINE}"/><circle cx="172" cy="102" r="7" fill="${OUTLINE}"/>`;
    const mouth = happy
      ? `<path d="M132 136 Q150 154 168 136" stroke="${OUTLINE}" stroke-width="5" fill="#C2185B" stroke-linecap="round"/>`
      : `<path d="M136 140 Q150 132 164 140" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return svg(
      300,
      300,
      // cauda
      `<path d="M230 250 Q290 240 270 180" stroke="${fur}" stroke-width="14" fill="none" stroke-linecap="round"/>` +
        `<circle cx="270" cy="176" r="14" fill="#B5651D" stroke="${OUTLINE}" stroke-width="4"/>` +
        // corpo sentado e patas
        `<ellipse cx="150" cy="220" rx="92" ry="66" fill="${fur}" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<rect x="104" y="200" width="36" height="84" rx="16" fill="${fur}" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="160" y="200" width="36" height="84" rx="16" fill="${fur}" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<ellipse cx="122" cy="284" rx="24" ry="12" fill="#F7C873" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<ellipse cx="178" cy="284" rx="24" ry="12" fill="#F7C873" stroke="${OUTLINE}" stroke-width="4"/>` +
        maneRing +
        // orelhas e cabeça
        `<circle cx="106" cy="54" r="18" fill="${fur}" stroke="${OUTLINE}" stroke-width="5"/><circle cx="194" cy="54" r="18" fill="${fur}" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="150" cy="106" r="54" fill="#F2B84B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<ellipse cx="150" cy="130" rx="30" ry="22" fill="#FFF1D6"/>` +
        `<path d="M138 116 L162 116 L150 130Z" fill="${OUTLINE}"/>` +
        eyes +
        mouth,
    );
  };
  write('lion.svg', lion({ mane: true, happy: false }));
  write('lioness.svg', lion({ mane: false, happy: false }));

  // Leão deitado, satisfeito (depois de comer).
  const lying = (mane) =>
    svg(
      340,
      200,
      `<path d="M300 160 Q340 150 330 110" stroke="#E8A33D" stroke-width="12" fill="none" stroke-linecap="round"/>` +
        `<circle cx="330" cy="106" r="12" fill="#B5651D" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<ellipse cx="200" cy="150" rx="120" ry="44" fill="#E8A33D" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<ellipse cx="110" cy="186" rx="40" ry="12" fill="#F7C873" stroke="${OUTLINE}" stroke-width="4"/>` +
        (mane
          ? Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return `<circle cx="${88 + Math.cos(a) * 48}" cy="${104 + Math.sin(a) * 44}" r="24" fill="#B5651D" stroke="${OUTLINE}" stroke-width="4"/>`;
            }).join('')
          : '') +
        `<circle cx="88" cy="104" r="44" fill="#F2B84B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<ellipse cx="88" cy="124" rx="24" ry="17" fill="#FFF1D6"/>` +
        `<path d="M78 112 L98 112 L88 124Z" fill="${OUTLINE}"/>` +
        `<path d="M62 98 Q70 90 78 98 M98 98 Q106 90 114 98" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        `<path d="M76 132 Q88 144 100 132" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    );
  write('lion-lying.svg', lying(true));
  write('lioness-lying.svg', lying(false));

  drawSavanna({ svg, write, OUTLINE });
}

function drawSavanna({ svg, write, OUTLINE }) {
  const W = 3000;
  const H = 720;
  const FLOOR = 440;
  const acacia = (x, s = 1) =>
    `<path d="M${x} ${FLOOR} Q${x - 6 * s} ${FLOOR - 90 * s} ${x + 10 * s} ${FLOOR - 170 * s}" stroke="#6B4423" stroke-width="${16 * s}" fill="none"/>` +
    `<ellipse cx="${x + 10 * s}" cy="${FLOOR - 180 * s}" rx="${120 * s}" ry="${34 * s}" fill="#5E8C31" stroke="#3E6A1E" stroke-width="5"/>`;
  const grassTufts = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 43) % W;
    const y = FLOOR + 30 + ((i * 71) % 250);
    return `<path d="M${x} ${y} l6 -22 l4 22 l6 -18 l3 18" stroke="#C99A2E" stroke-width="3" fill="none"/>`;
  }).join('');
  const jungleTree = (x, s = 1) =>
    `<rect x="${x - 18 * s}" y="${FLOOR - 260 * s}" width="${36 * s}" height="${260 * s}" fill="#6B4423" stroke="${OUTLINE}" stroke-width="4"/>` +
    [[-60, -250], [0, -300], [60, -250], [-20, -200], [40, -190]]
      .map(([dx, dy]) => `<circle cx="${x + dx * s}" cy="${FLOOR + dy * s}" r="${70 * s}" fill="#2E8B57" stroke="#1E6B40" stroke-width="5"/>`)
      .join('');
  const fern = (x) =>
    [-40, -15, 15, 40].map((dx) => `<path d="M${x} ${FLOOR + 20} Q${x + dx} ${FLOOR - 40} ${x + dx * 2} ${FLOOR - 10}" stroke="#3CA35A" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('');
  const flower = (x, y, c) =>
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 10}" rx="7" ry="12" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('') +
    `<circle cx="${x}" cy="${y}" r="6" fill="#FFE066"/>`;

  write(
    'bg-africa.svg',
    svg(
      W,
      H,
      `<rect width="${W}" height="${FLOOR}" fill="url(#skyAf)"/>` +
        `<circle cx="520" cy="150" r="90" fill="#FFE8A3" opacity="0.9"/>` +
        // morros e silhuetas de animais ao longe
        `<path d="M0 ${FLOOR} Q300 330 600 ${FLOOR - 40} T1200 ${FLOOR - 30} T1800 ${FLOOR - 50} T2400 ${FLOOR} L0 ${FLOOR}Z" fill="#E7B96A"/>` +
        `<g fill="#B07A3B" opacity="0.7">` +
        // girafa
        `<rect x="820" y="330" width="10" height="70" /><rect x="860" y="330" width="10" height="70"/><ellipse cx="845" cy="330" rx="36" ry="18"/>` +
        `<rect x="866" y="250" width="12" height="80" transform="rotate(15 872 330)"/><ellipse cx="898" cy="252" rx="16" ry="9"/>` +
        // elefante
        `<ellipse cx="1320" cy="360" rx="56" ry="36"/><circle cx="1374" cy="344" r="24"/><path d="M1392 350 Q1404 380 1394 396" stroke="#B07A3B" stroke-width="10" fill="none"/>` +
        `<rect x="1286" y="380" width="16" height="30"/><rect x="1334" y="380" width="16" height="30"/></g>` +
        acacia(160, 1) +
        acacia(1000, 0.8) +
        acacia(1450, 1.1) +
        // chão da savana
        `<rect x="0" y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#E9C46A"/>` +
        grassTufts +
        // jipe de safári com a caixa térmica
        `<rect x="300" y="360" width="220" height="70" rx="14" fill="#8FAE5A" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="330" y="310" width="120" height="56" rx="8" fill="#BFE6FF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<circle cx="350" cy="436" r="26" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="4"/><circle cx="480" cy="436" r="26" fill="#2B2A4C" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="350" cy="436" r="10" fill="#B0B8C8"/><circle cx="480" cy="436" r="10" fill="#B0B8C8"/>` +
        `<rect x="530" y="420" width="70" height="46" rx="8" fill="#46B7F0" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="530" y="420" width="70" height="14" rx="6" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="4"/>` +
        // mangueira com frutas
        `<rect x="1150" y="250" width="30" height="${FLOOR - 250}" fill="#6B4423" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<circle cx="1165" cy="230" r="90" fill="#4FA34A" stroke="#357A33" stroke-width="5"/>` +
        [[-40, -10], [30, 20], [0, -50], [50, -30], [-50, 30]].map(([dx, dy]) => `<ellipse cx="${1165 + dx}" cy="${230 + dy}" rx="11" ry="14" fill="#FF9F2E" stroke="${OUTLINE}" stroke-width="3"/>`).join('') +
        // lagoa (para onde a trilha leva os leões)
        `<ellipse cx="1760" cy="462" rx="230" ry="34" fill="#5BB7E6" stroke="#2F86B5" stroke-width="5"/>` +
        `<ellipse cx="1700" cy="456" rx="80" ry="8" fill="#A7E0F7"/>` +
        fern(1520) +
        fern(2000) +
        // selva e clareira
        `<rect x="2050" y="0" width="${W - 2050}" height="${FLOOR}" fill="url(#jungleSky)"/>` +
        jungleTree(2280, 1) +
        jungleTree(2860, 1.1) +
        jungleTree(2560, 0.8) +
        `<rect x="2050" y="${FLOOR}" width="${W - 2050}" height="${H - FLOOR}" fill="url(#jungleGround)"/>` +
        `<ellipse cx="2560" cy="${FLOOR + 90}" rx="260" ry="80" fill="#D9C27A"/>` +
        fern(2330) +
        fern(2800) +
        flower(2380, 470, '#FF4D6D') +
        flower(2740, 480, '#FFFFFF') +
        flower(2900, 600, '#FF9FB5'),
      `<linearGradient id="skyAf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC46B"/><stop offset="1" stop-color="#FFF1C9"/></linearGradient>` +
        // Transição suave da savana (amarela) para a selva (verde).
        `<linearGradient id="jungleSky" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8CC97A" stop-opacity="0"/><stop offset="0.25" stop-color="#8CC97A" stop-opacity="0.5"/></linearGradient>` +
        `<linearGradient id="jungleGround" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9BC96A" stop-opacity="0"/><stop offset="0.25" stop-color="#9BC96A"/></linearGradient>`,
    ),
  );
}
