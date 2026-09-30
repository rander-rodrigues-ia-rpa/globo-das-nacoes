import type Phaser from 'phaser';
import type { LevelId } from '../../core';
import { AfricaScene } from './AfricaScene';
import { AlaskaScene } from './AlaskaScene';
import { BrazilScene } from './BrazilScene';
import { DubaiScene } from './DubaiScene';
import { EnglandScene } from './EnglandScene';

/**
 * Como cada fase do catálogo aparece NESTE frontend.
 * As regras continuam no núcleo (src/core/levels/campaign.ts); aqui só há
 * a posição no mapa, a cor e a cena Phaser que desenha a fase.
 *
 * Para criar uma fase nova:
 *   1. declare as regras em src/core/levels/campaign.ts;
 *   2. escreva os textos em src/content/pt-BR.ts;
 *   3. crie a cena (estendendo BaseLevelScene) e registre-a aqui.
 * Fases sem `scene` aparecem no mapa como "em breve".
 */
export interface LevelView {
  levelId: LevelId;
  pin: { x: number; y: number };
  color: number;
  scene?: new () => Phaser.Scene;
}

export const LEVEL_VIEWS: readonly LevelView[] = [
  { levelId: 'alasca', pin: { x: 150, y: 190 }, color: 0x46b7f0, scene: AlaskaScene },
  { levelId: 'inglaterra', pin: { x: 572, y: 150 }, color: 0xf7c948, scene: EnglandScene },
  { levelId: 'dubai', pin: { x: 800, y: 292 }, color: 0xff9f2e, scene: DubaiScene },
  { levelId: 'africa', pin: { x: 690, y: 385 }, color: 0x3cc46a, scene: AfricaScene },
  { levelId: 'brasil', pin: { x: 398, y: 470 }, color: 0xff4d6d, scene: BrazilScene },
];

export function levelView(levelId: LevelId): LevelView | undefined {
  return LEVEL_VIEWS.find((view) => view.levelId === levelId);
}
