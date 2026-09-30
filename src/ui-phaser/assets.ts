import type Phaser from 'phaser';

/**
 * Manifesto de arte. As cenas usam só as CHAVES; para trocar a arte provisória
 * pela final, basta mudar os caminhos aqui (ou substituir os arquivos).
 */
interface SvgAsset {
  key: string;
  file: string;
}

const SPRITES = 'assets/sprites/';

export const FRAGMENT_KEYS = ['gelo', 'conhecimento', 'brilho', 'natureza', 'alegria'] as const;

const ASSETS: SvgAsset[] = [
  ...['joao', 'gabriel', 'larissa'].map((id) => ({ key: `hero-${id}`, file: `hero-${id}.svg` })),
  ...FRAGMENT_KEYS.flatMap((id) => [
    { key: `fragment-${id}`, file: `fragment-${id}.svg` },
    { key: `fragment-${id}-empty`, file: `fragment-${id}-empty.svg` },
  ]),
  { key: 'item-peixe', file: 'item-peixe.svg' },
  { key: 'ice-hole', file: 'ice-hole.svg' },
  { key: 'pedestal', file: 'pedestal.svg' },
  { key: 'bear-awake', file: 'bear-awake.svg' },
  { key: 'bear-sleeping', file: 'bear-sleeping.svg' },
  { key: 'globe', file: 'globe.svg' },
  { key: 'world-map', file: 'world-map.svg' },
  { key: 'bg-alasca', file: 'bg-alasca.svg' },
  // Fase 2 — Inglaterra
  { key: 'bg-inglaterra', file: 'bg-inglaterra.svg' },
  { key: 'item-chaves', file: 'item-chaves.svg' },
  { key: 'item-lanterna', file: 'item-lanterna.svg' },
  { key: 'window', file: 'window.svg' },
  { key: 'window-lit', file: 'window-lit.svg' },
  { key: 'director', file: 'director.svg' },
  { key: 'director-back', file: 'director-back.svg' },
  { key: 'locker-closed', file: 'locker-closed.svg' },
  { key: 'locker-open', file: 'locker-open.svg' },
  // Fase 3 — Dubai
  { key: 'bg-dubai', file: 'bg-dubai.svg' },
  { key: 'item-celular', file: 'item-celular.svg' },
  { key: 'footprints', file: 'footprints.svg' },
  { key: 'display-case', file: 'display-case.svg' },
  { key: 'generator', file: 'generator.svg' },
  { key: 'generator-on', file: 'generator-on.svg' },
  { key: 'thief', file: 'thief.svg' },
  { key: 'thief-scared', file: 'thief-scared.svg' },
  { key: 'darkness', file: 'darkness.svg' },
  // Fase 4 — África
  { key: 'bg-africa', file: 'bg-africa.svg' },
  { key: 'item-bife', file: 'item-bife.svg' },
  { key: 'item-frutas', file: 'item-frutas.svg' },
  { key: 'trail-spot', file: 'trail-spot.svg' },
  { key: 'lion', file: 'lion.svg' },
  { key: 'lioness', file: 'lioness.svg' },
  { key: 'lion-lying', file: 'lion-lying.svg' },
  { key: 'lioness-lying', file: 'lioness-lying.svg' },
  { key: 'snowflake', file: 'snowflake.svg' },
  { key: 'sparkle', file: 'sparkle.svg' },
  ...['hint', 'home', 'sound-on', 'sound-off', 'lock', 'arrow'].map((id) => ({ key: `icon-${id}`, file: `icon-${id}.svg` })),
];

export function preloadAssets(load: Phaser.Loader.LoaderPlugin): void {
  for (const asset of ASSETS) load.svg(asset.key, SPRITES + asset.file);
}

/** Chave da textura de um item do inventário. */
export const itemTexture = (item: string) => `item-${item}`;
export const fragmentTexture = (fragment: string, empty = false) => `fragment-${fragment}${empty ? '-empty' : ''}`;
export const heroTexture = (hero: string) => `hero-${hero}`;
