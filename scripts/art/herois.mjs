// Os três heróis (200 x 280, pés em y≈268). Estilo "chibi": cabeça grande,
// contorno escuro, sombreado suave em degradê e olhos com brilho.
//
// Larissa foi desenhada a partir da própria idealizadora do jogo: pele morena
// clara, cabelo castanho-escuro longo e ondulado com pontas mais claras, olhos
// castanhos, sorrisão, vestido azul-marinho com estampa de folhinhas e cinto
// dourado, sandálias brancas — e a mochila de exploradora.

const INK = '#2B2A4C';

/** Rosto padrão: olhos grandes com brilho, sobrancelhas, bochechas e sorriso. */
function face({ skinShade, eye = '#3A2418', smile = 'open' }) {
  const eyeShape = (cx) =>
    `<ellipse cx="${cx}" cy="98" rx="10" ry="13" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>` +
    `<ellipse cx="${cx + 1}" cy="100" rx="7.5" ry="10" fill="${eye}"/>` +
    `<circle cx="${cx + 1}" cy="101" r="4" fill="#150C08"/>` +
    `<circle cx="${cx + 4}" cy="95" r="3.2" fill="#FFFFFF"/><circle cx="${cx - 2}" cy="104" r="1.6" fill="#FFFFFF"/>`;
  const mouth =
    smile === 'open'
      ? `<path d="M84 122 Q100 142 116 122 Z" fill="#7A2E2E" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M87 123 Q100 129 113 123 L112 126 Q100 131 88 126Z" fill="#FFFFFF"/>` +
        `<path d="M92 133 Q100 128 108 133 Q100 138 92 133Z" fill="#E86A7A"/>`
      : `<path d="M86 124 Q100 136 114 124" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return (
    eyeShape(78) +
    eyeShape(120) +
    `<path d="M68 80 Q78 74 88 79 M112 79 Q122 74 132 80" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M98 108 Q100 113 103 109" stroke="${skinShade}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="66" cy="116" rx="9" ry="6" fill="#FF7A8A" opacity="0.45"/><ellipse cx="134" cy="116" rx="9" ry="6" fill="#FF7A8A" opacity="0.45"/>` +
    mouth
  );
}

function head({ id, skinShade, ears = true }) {
  return (
    (ears
      ? `<circle cx="46" cy="100" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="154" cy="100" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>`
      : '') +
    `<circle cx="100" cy="92" r="56" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4.5"/>` +
    `<path d="M56 112 Q100 156 144 112 Q134 142 100 146 Q66 142 56 112Z" fill="${skinShade}" opacity="0.25"/>` +
    `<ellipse cx="80" cy="64" rx="18" ry="8" fill="#FFFFFF" opacity="0.18" transform="rotate(-20 80 64)"/>`
  );
}

function skinGradient(id, skin, skinShade) {
  return `<radialGradient id="${id}-skin" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="${skin}"/><stop offset="1" stop-color="${skinShade}"/></radialGradient>`;
}

function backpack(color, strap) {
  return (
    `<rect x="40" y="138" width="44" height="74" rx="16" fill="${color}" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="44" y="176" width="36" height="24" rx="8" fill="${strap}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="48" y="146" width="10" height="26" rx="5" fill="#FFFFFF" opacity="0.25"/>`
  );
}

function sneakers(color) {
  return (
    `<path d="M62 254 Q62 268 80 270 Q98 271 98 260 L96 250 L66 250Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M104 250 L102 260 Q102 271 120 270 Q138 268 138 254 L134 250Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M66 262 H97 M103 262 H136" stroke="${color}" stroke-width="5"/>`
  );
}

// ---------------------------------------------------------------- João
function joao() {
  const id = 'joao';
  const skin = '#F5CFA6';
  const skinShade = '#D9A77A';
  const defs =
    skinGradient(id, skin, skinShade) +
    `<linearGradient id="${id}-jacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A9BF0"/><stop offset="1" stop-color="#2463BE"/></linearGradient>`;
  const body =
    backpack('#D9893A', '#B06A22') +
    // calça e tênis
    `<rect x="70" y="204" width="28" height="52" rx="10" fill="#3B4A6B" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="102" y="204" width="28" height="52" rx="10" fill="#3B4A6B" stroke="${INK}" stroke-width="4"/>` +
    sneakers('#E0564F') +
    // braços
    `<path d="M62 142 Q44 170 50 204" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M62 142 Q44 170 50 204" stroke="#2F7BD8" stroke-width="18" fill="none" stroke-linecap="round"/>` +
    `<path d="M138 142 Q156 170 150 204" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M138 142 Q156 170 150 204" stroke="#2F7BD8" stroke-width="18" fill="none" stroke-linecap="round"/>` +
    `<circle cx="50" cy="210" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="150" cy="210" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    // jaqueta com capuz, zíper e bolsos
    `<path d="M62 146 Q62 126 84 124 L116 124 Q138 126 138 146 L140 212 Q100 220 60 212Z" fill="url(#${id}-jacket)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M76 126 Q100 144 124 126" stroke="#1F5FB0" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<line x1="100" y1="138" x2="100" y2="214" stroke="#F7C948" stroke-width="4"/>` +
    `<rect x="70" y="182" width="20" height="14" rx="4" fill="#1F5FB0"/><rect x="110" y="182" width="20" height="14" rx="4" fill="#1F5FB0"/>` +
    // bússola (o Navegador)
    `<circle cx="118" cy="158" r="9" fill="#F7C948" stroke="${INK}" stroke-width="3"/><path d="M118 151 L121 158 L118 165 L115 158Z" fill="#E0564F"/>`;
  const hair =
    `<path d="M44 92 Q36 34 100 30 Q164 34 156 92 Q150 64 136 60 L140 44 L122 56 L118 38 L102 56 L90 40 L84 58 Q60 60 44 92Z" fill="#6B3E1E" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M92 44 Q108 40 124 48" stroke="#9A6334" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return svgHero(defs, body + head({ id, skinShade }) + hair + face({ skinShade, eye: '#5A3620' }));
}

// ---------------------------------------------------------------- Gabriel
function gabriel() {
  const id = 'gabriel';
  const skin = '#FBDDBF';
  const skinShade = '#E6B48E';
  const defs =
    skinGradient(id, skin, skinShade) +
    `<linearGradient id="${id}-jacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB547"/><stop offset="1" stop-color="#E07F0E"/></linearGradient>`;
  const body =
    backpack('#7A8A99', '#5B6878') +
    `<rect x="70" y="204" width="28" height="52" rx="10" fill="#5B4A3A" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="102" y="204" width="28" height="52" rx="10" fill="#5B4A3A" stroke="${INK}" stroke-width="4"/>` +
    sneakers('#46B7F0') +
    `<path d="M62 142 Q44 170 50 204" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M62 142 Q44 170 50 204" stroke="#F29A1F" stroke-width="18" fill="none" stroke-linecap="round"/>` +
    `<path d="M138 142 Q156 170 150 204" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M138 142 Q156 170 150 204" stroke="#F29A1F" stroke-width="18" fill="none" stroke-linecap="round"/>` +
    `<circle cx="50" cy="210" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="150" cy="210" r="11" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M62 146 Q62 126 84 124 L116 124 Q138 126 138 146 L140 212 Q100 220 60 212Z" fill="url(#${id}-jacket)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M84 126 L100 150 L116 126" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linejoin="round"/>` +
    // cinto de ferramentas (o Inventor)
    `<rect x="60" y="192" width="80" height="12" rx="4" fill="#7A5230" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="70" y="186" width="10" height="22" rx="3" fill="#B0B8C8" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M118 184 L126 206" stroke="#B0B8C8" stroke-width="6" stroke-linecap="round"/><circle cx="117" cy="183" r="5" fill="none" stroke="#B0B8C8" stroke-width="4"/>`;
  const hair =
    `<path d="M42 96 Q34 30 100 28 Q168 30 158 96 Q154 60 126 54 Q112 66 94 56 Q72 66 60 60 Q48 72 42 96Z" fill="#F5C542" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M70 44 Q86 36 100 42 M116 40 Q134 38 146 52" stroke="#FFE08A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const goggles =
    `<rect x="44" y="54" width="112" height="12" rx="6" fill="#7A5230" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="80" cy="58" r="16" fill="#8FD3FF" stroke="#7A5230" stroke-width="6"/><circle cx="120" cy="58" r="16" fill="#8FD3FF" stroke="#7A5230" stroke-width="6"/>` +
    `<circle cx="75" cy="53" r="4" fill="#fff"/><circle cx="115" cy="53" r="4" fill="#fff"/>`;
  const freckles = [70, 76, 124, 130].map((x, i) => `<circle cx="${x}" cy="${108 + (i % 2) * 4}" r="1.8" fill="#C8845A"/>`).join('');
  return svgHero(defs, body + head({ id, skinShade }) + hair + goggles + face({ skinShade, eye: '#3F7FBF' }) + freckles);
}

// ---------------------------------------------------------------- Larissa
function larissa() {
  const id = 'larissa';
  const skin = '#D9A07A';
  const skinShade = '#B97E58';
  const hairDark = '#3A2218';
  const hairMid = '#5A3522';
  const hairTip = '#9A6A45';
  const defs =
    skinGradient(id, skin, skinShade) +
    `<linearGradient id="${id}-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hairDark}"/><stop offset="0.7" stop-color="${hairMid}"/><stop offset="1" stop-color="${hairTip}"/></linearGradient>` +
    // estampa de folhinhas do vestido
    `<pattern id="${id}-print" width="22" height="22" patternUnits="userSpaceOnUse">` +
    `<rect width="22" height="22" fill="#23304F"/>` +
    `<path d="M4 18 Q6 10 11 6" stroke="#FFFFFF" stroke-width="1.6" fill="none"/>` +
    `<ellipse cx="7" cy="12" rx="2.4" ry="1.2" fill="#FFFFFF" transform="rotate(-50 7 12)"/>` +
    `<ellipse cx="10" cy="8" rx="2.2" ry="1.1" fill="#BFE6FF" transform="rotate(-60 10 8)"/>` +
    `<circle cx="17" cy="15" r="1.6" fill="#E9B85A"/><circle cx="16" cy="4" r="1.3" fill="#FFFFFF"/>` +
    `</pattern>`;

  // Cabelo longo e ondulado ATRÁS do corpo (cai pelas costas até a cintura).
  const hairBack =
    `<path d="M42 96 Q30 150 40 190 Q46 214 36 232 Q60 226 70 206 L70 140 Z" fill="url(#${id}-hair)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M158 96 Q170 150 160 190 Q154 214 164 232 Q140 226 130 206 L130 140 Z" fill="url(#${id}-hair)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M44 150 Q52 170 44 190 M156 150 Q148 170 156 190" stroke="${hairTip}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>`;

  const body =
    backpack('#E0564F', '#B83A34') +
    // pernas e sandálias brancas
    `<rect x="78" y="214" width="18" height="44" rx="8" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="104" y="214" width="18" height="44" rx="8" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M70 258 Q70 270 88 270 Q100 270 99 262 L97 254 L74 254Z" fill="#FFFFFF" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M103 254 L101 262 Q100 270 112 270 Q130 270 130 258 L126 254Z" fill="#FFFFFF" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M78 250 H96 M104 250 H122" stroke="#FFFFFF" stroke-width="5"/><path d="M78 250 H96 M104 250 H122" stroke="${INK}" stroke-width="1.5" opacity="0.5"/>` +
    // braços (sem manga) e mãos
    `<path d="M66 144 Q50 172 54 204" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>` +
    `<path d="M66 144 Q50 172 54 204" stroke="${skin}" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<path d="M134 144 Q150 172 146 204" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>` +
    `<path d="M134 144 Q150 172 146 204" stroke="${skin}" stroke-width="14" fill="none" stroke-linecap="round"/>` +
    `<circle cx="54" cy="208" r="10" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="146" cy="208" r="10" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="4"/>` +
    // vestido azul-marinho estampado, saia rodada e cinto dourado fininho
    `<path d="M70 144 Q70 128 86 126 L114 126 Q130 128 130 144 L130 178 L70 178Z" fill="url(#${id}-print)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M70 176 L130 176 L146 226 Q100 238 54 226Z" fill="url(#${id}-print)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M86 182 L80 228 M100 182 L100 232 M114 182 L120 228" stroke="#1A2440" stroke-width="2.5" opacity="0.7"/>` +
    `<rect x="69" y="173" width="62" height="6" rx="3" fill="#E9B85A" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M88 128 Q100 138 112 128" stroke="${INK}" stroke-width="3" fill="none"/>` +
    // alças da mochila por cima do vestido
    `<path d="M74 132 L78 176 M126 132 L122 176" stroke="#B83A34" stroke-width="6" stroke-linecap="round"/>`;

  // Cabelo da frente: repartido de lado, ondas emoldurando o rosto e caindo nos ombros.
  const hairFront =
    `<path d="M42 104 Q34 34 104 30 Q170 34 160 104 Q156 74 140 60 Q120 50 96 54 Q76 60 66 76 Q54 88 52 110 Z" fill="url(#${id}-hair)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M46 100 Q34 124 42 146 Q46 158 40 168 Q56 164 60 146 Q62 126 56 108Z" fill="url(#${id}-hair)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M154 100 Q166 124 158 146 Q154 158 160 168 Q144 164 140 146 Q138 126 144 108Z" fill="url(#${id}-hair)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M80 46 Q104 38 132 50 M60 70 Q70 60 84 56" stroke="#7A4A30" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<path d="M46 130 Q52 140 48 152 M154 130 Q148 140 152 152" stroke="${hairTip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

  return svgHero(defs, hairBack + body + head({ id, skinShade, ears: false }) + hairFront + face({ skinShade, eye: '#5A3420' }));
}

function svgHero(defs, body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">` +
    `<defs>${defs}</defs>${body}</svg>\n`
  );
}

export function drawHeroes({ write }) {
  write('hero-joao.svg', joao());
  write('hero-gabriel.svg', gabriel());
  write('hero-larissa.svg', larissa());
}
