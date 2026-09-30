// Arte provisória da Fase 5 — Brasil (parque aquático, torre e Capitão Cascudo).
// Geometria da torre compartilhada com src/ui-phaser/levels/BrazilScene.ts.
export const TOWER = {
  width: 1800,
  height: 1600,
  left: 1000,
  right: 1720,
  floors: { top: 540, mid: 850, low: 1160 },
  ground: 1440,
};

export function drawBrazil({ svg, write, OUTLINE }) {
  write(
    'item-super-balde.svg',
    svg(
      140,
      140,
      `<path d="M24 40 L116 40 L102 128 L38 128Z" fill="#46B7F0" stroke="${OUTLINE}" stroke-width="6" stroke-linejoin="round"/>` +
        `<ellipse cx="70" cy="40" rx="46" ry="12" fill="#8FE3FF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M30 40 Q70 -14 110 40" stroke="${OUTLINE}" stroke-width="6" fill="none"/>` +
        `<path d="M70 62 L78 80 L98 80 L82 92 L88 112 L70 100 L52 112 L58 92 L42 80 L62 80Z" fill="#FFE066" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M44 30 Q52 18 60 30 M86 26 Q92 16 98 28" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    ),
  );

  write(
    'crate.svg',
    svg(
      100,
      100,
      `<rect x="6" y="6" width="88" height="88" rx="6" fill="#C98E5A" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<path d="M6 6 L94 94 M94 6 L6 94" stroke="#8A5A34" stroke-width="8"/>` +
        `<rect x="6" y="6" width="88" height="88" rx="6" fill="none" stroke="${OUTLINE}" stroke-width="6"/>`,
    ),
  );
  write(
    'barrel.svg',
    svg(
      100,
      100,
      `<circle cx="50" cy="50" r="44" fill="#A8703F" stroke="${OUTLINE}" stroke-width="6"/>` +
        `<circle cx="50" cy="50" r="30" fill="none" stroke="#6B4423" stroke-width="6"/>` +
        `<path d="M50 6 V94 M6 50 H94" stroke="#6B4423" stroke-width="5"/>`,
    ),
  );
  write('droplet.svg', svg(24, 32, `<path d="M12 2 Q24 18 22 24 A10 10 0 0 1 2 24 Q0 18 12 2Z" fill="#6FD3FF" stroke="#FFFFFF" stroke-width="2"/>`));

  // Escada entre os andares (a criança toca nela para subir ou descer).
  write(
    'ladder.svg',
    svg(
      90,
      320,
      `<rect x="10" y="0" width="14" height="320" rx="5" fill="#F29A1F" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="66" y="0" width="14" height="320" rx="5" fill="#F29A1F" stroke="${OUTLINE}" stroke-width="4"/>` +
        Array.from({ length: 8 }, (_, i) => `<rect x="20" y="${20 + i * 38}" width="50" height="10" rx="4" fill="#FFD23F" stroke="${OUTLINE}" stroke-width="3"/>`).join(''),
    ),
  );

  write(
    'pool-water.svg',
    svg(620, 120, `<ellipse cx="310" cy="60" rx="300" ry="54" fill="#46B7F0" opacity="0.85"/><ellipse cx="240" cy="44" rx="120" ry="12" fill="#BFF0FF" opacity="0.8"/>`),
  );

  // Capitão Cascudo: capitão de NAVIO (quepe com âncora, barba branca, casaco azul-marinho).
  const captain = ({ wet }) =>
    svg(
      240,
      360,
      // pernas e botas
      `<rect x="80" y="262" width="32" height="70" rx="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="128" y="262" width="32" height="70" rx="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="74" y="324" width="44" height="26" rx="10" fill="#1E1A18" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<rect x="122" y="324" width="44" height="26" rx="10" fill="#1E1A18" stroke="${OUTLINE}" stroke-width="4"/>` +
        // casaco
        `<rect x="56" y="140" width="128" height="140" rx="34" fill="#1F3A68" stroke="${OUTLINE}" stroke-width="5"/>` +
        [170, 204, 238].map((y) => `<circle cx="102" cy="${y}" r="6" fill="#F7C948" stroke="${OUTLINE}" stroke-width="2"/><circle cx="138" cy="${y}" r="6" fill="#F7C948" stroke="${OUTLINE}" stroke-width="2"/>`).join('') +
        `<rect x="52" y="140" width="40" height="14" rx="6" fill="#F7C948" stroke="${OUTLINE}" stroke-width="3"/><rect x="148" y="140" width="40" height="14" rx="6" fill="#F7C948" stroke="${OUTLINE}" stroke-width="3"/>` +
        // braços (um levantado, arremessando)
        (wet
          ? `<rect x="30" y="150" width="30" height="96" rx="15" fill="#1F3A68" stroke="${OUTLINE}" stroke-width="5"/><rect x="180" y="150" width="30" height="96" rx="15" fill="#1F3A68" stroke="${OUTLINE}" stroke-width="5"/>`
          : `<rect x="30" y="150" width="30" height="96" rx="15" fill="#1F3A68" stroke="${OUTLINE}" stroke-width="5"/>` +
            `<rect x="180" y="70" width="30" height="96" rx="15" fill="#1F3A68" stroke="${OUTLINE}" stroke-width="5" transform="rotate(20 195 150)"/>` +
            `<circle cx="222" cy="78" r="15" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="4"/>`) +
        // cabeça, barba e rosto
        `<circle cx="120" cy="92" r="52" fill="#F2C79B" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M70 100 Q72 170 120 172 Q168 170 170 100 Q150 124 120 124 Q90 124 70 100Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<ellipse cx="120" cy="112" rx="12" ry="9" fill="#FF8A8A"/>` +
        (wet
          ? `<path d="M92 90 Q100 82 108 90 M132 90 Q140 82 148 90" stroke="${OUTLINE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
            `<path d="M104 136 Q120 148 136 136" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
            [[60, 60], [186, 80], [150, 30], [40, 190], [200, 220]].map(([x, y]) => `<path d="M${x} ${y} q8 14 0 18 q-8 -4 0 -18Z" fill="#6FD3FF" stroke="${OUTLINE}" stroke-width="2"/>`).join('')
          : `<path d="M88 74 L112 82 M152 74 L128 82" stroke="${OUTLINE}" stroke-width="7" stroke-linecap="round"/>` +
            `<circle cx="102" cy="92" r="6" fill="${OUTLINE}"/><circle cx="138" cy="92" r="6" fill="${OUTLINE}"/>` +
            `<path d="M106 140 Q120 132 134 140" stroke="${OUTLINE}" stroke-width="4" fill="none" stroke-linecap="round"/>`) +
        // quepe de capitão com âncora
        `<g transform="${wet ? 'rotate(-18 120 50)' : ''}"><path d="M62 58 Q64 18 120 16 Q176 18 178 58Z" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="60" y="52" width="120" height="16" rx="6" fill="#1E1A18" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<path d="M120 26 V46 M112 32 H128 M110 42 Q120 52 130 42" stroke="#F7C948" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
    );
  write('captain.svg', captain({ wet: false }));
  write('captain-wet.svg', captain({ wet: true }));

  drawWaterPark({ svg, write, OUTLINE });
}

function drawWaterPark({ svg, write, OUTLINE }) {
  const { width: W, height: H, left, right, floors, ground } = TOWER;
  const palm = (x, y, s = 1) =>
    `<path d="M${x} ${y} Q${x - 10 * s} ${y - 120 * s} ${x + 8 * s} ${y - 220 * s}" stroke="#8A5A34" stroke-width="${16 * s}" fill="none"/>` +
    [-80, -35, 10, 55, 95]
      .map((dx) => `<path d="M${x + 8 * s} ${y - 220 * s} Q${x + dx * s} ${y - 250 * s} ${x + dx * 1.7 * s} ${y - 180 * s}" stroke="#2FA36B" stroke-width="${18 * s}" fill="none" stroke-linecap="round"/>`)
      .join('');
  const floor = (y) =>
    `<rect x="${left - 20}" y="${y}" width="${right - left + 40}" height="26" rx="6" fill="#B07A3B" stroke="${OUTLINE}" stroke-width="5"/>` +
    `<rect x="${left - 20}" y="${y - 70}" width="${right - left + 40}" height="8" fill="#FFFFFF" opacity="0.8"/>` +
    Array.from({ length: 12 }, (_, i) => `<rect x="${left - 10 + i * 63}" y="${y - 70}" width="6" height="70" fill="#FFFFFF" opacity="0.8"/>`).join('');
  const pillar = (x) => `<rect x="${x}" y="${floors.top}" width="26" height="${ground - floors.top}" fill="#8A5A34" stroke="${OUTLINE}" stroke-width="4"/>`;
  const flag =
    `<rect x="${right - 40}" y="${floors.top - 260}" width="8" height="190" fill="#555"/>` +
    `<rect x="${right - 32}" y="${floors.top - 260}" width="110" height="74" fill="#009C3B" stroke="${OUTLINE}" stroke-width="3"/>` +
    `<path d="M${right - 26} ${floors.top - 223} L${right + 23} ${floors.top - 254} L${right + 72} ${floors.top - 223} L${right + 23} ${floors.top - 192}Z" fill="#FFDF00"/>` +
    `<circle cx="${right + 23}" cy="${floors.top - 223}" r="17" fill="#002776"/>`;

  write(
    'bg-brasil.svg',
    svg(
      W,
      H,
      `<rect width="${W}" height="${H}" fill="url(#skyBr)"/>` +
        `<circle cx="300" cy="260" r="80" fill="#FFF3A6"/>` +
        `<g fill="#fff" opacity="0.9"><ellipse cx="620" cy="420" rx="90" ry="30"/><ellipse cx="680" cy="400" rx="60" ry="34"/>` +
        `<ellipse cx="260" cy="800" rx="80" ry="26"/><ellipse cx="1400" cy="200" rx="100" ry="30"/><ellipse cx="500" cy="1100" rx="70" ry="22"/></g>` +
        // Pão de Açúcar ao longe
        `<path d="M0 1380 Q120 1200 220 1180 Q300 1170 330 1260 Q380 1120 470 1100 Q560 1100 600 1250 Q700 1320 900 1380Z" fill="#4E8F6B" opacity="0.7"/>` +
        `<rect x="0" y="1370" width="${W}" height="${H - 1370}" fill="#F3D9A4"/>` +
        // piscina vazia (as válvulas estão fechadas)
        `<ellipse cx="680" cy="1400" rx="300" ry="50" fill="#CFEFFF" stroke="#8FC9E8" stroke-width="8"/>` +
        `<ellipse cx="680" cy="1404" rx="270" ry="36" fill="#E6F7FF"/>` +
        // quiosque
        `<rect x="150" y="1300" width="190" height="120" fill="#F7EBD3" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<path d="M120 1310 L245 1230 L370 1310Z" fill="#C9A15A" stroke="${OUTLINE}" stroke-width="5"/>` +
        `<rect x="140" y="1400" width="210" height="20" rx="4" fill="#A87448" stroke="${OUTLINE}" stroke-width="4"/>` +
        `<text x="245" y="1290" font-family="Trebuchet MS, sans-serif" font-size="22" font-weight="bold" fill="${OUTLINE}" text-anchor="middle">Quiosque</text>` +
        palm(60, 1420, 1.1) +
        palm(950, 1420, 0.9) +
        // tobogã (do topo da torre até a piscina)
        `<path d="M${right} ${floors.top - 10} C 1900 800, 1300 900, 1500 1100 S 900 1250, 900 1380" stroke="#FFD23F" stroke-width="54" fill="none" stroke-linecap="round"/>` +
        `<path d="M${right} ${floors.top - 10} C 1900 800, 1300 900, 1500 1100 S 900 1250, 900 1380" stroke="#46B7F0" stroke-width="30" fill="none" stroke-linecap="round" opacity="0.5"/>` +
        // estrutura da torre
        [left + 10, left + 240, left + 470, right - 30].map(pillar).join('') +
        floor(floors.top) +
        floor(floors.mid) +
        floor(floors.low) +
        // canos e válvulas fechadas
        `<path d="M${left - 60} ${ground} V${floors.low + 60} H${left + 120}" stroke="#8A8F99" stroke-width="22" fill="none"/>` +
        `<circle cx="${left - 60}" cy="${floors.low + 160}" r="28" fill="none" stroke="#E0564F" stroke-width="10"/>` +
        `<path d="M${left - 88} ${floors.low + 160} H${left - 32} M${left - 60} ${floors.low + 132} V${floors.low + 188}" stroke="#E0564F" stroke-width="8"/>` +
        flag,
      `<linearGradient id="skyBr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FA9F5"/><stop offset="0.8" stop-color="#BFE9FF"/><stop offset="1" stop-color="#FFF1C9"/></linearGradient>`,
    ),
  );
}
