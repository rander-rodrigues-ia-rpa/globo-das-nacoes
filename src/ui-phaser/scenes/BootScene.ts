import Phaser from 'phaser';
import { preloadAssets } from '../assets';
import { SCENES } from '../sceneKeys';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';

/** Carrega a arte mostrando uma barra de progresso. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.boot);
  }

  preload(): void {
    const barWidth = 520;
    const x = (GAME_WIDTH - barWidth) / 2;
    const y = GAME_HEIGHT / 2 + 40;
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'Preparando a aventura...', textStyle(40)).setOrigin(0.5);

    const frame = this.add.graphics();
    frame.lineStyle(6, COLORS.ink).strokeRoundedRect(x, y, barWidth, 36, 18);
    const bar = this.add.graphics();
    this.load.on('progress', (value: number) => {
      bar.clear().fillStyle(COLORS.primary).fillRoundedRect(x + 6, y + 6, Math.max(24, (barWidth - 12) * value), 24, 12);
    });

    preloadAssets(this.load);
  }

  create(): void {
    this.scene.start(SCENES.title);
  }
}
