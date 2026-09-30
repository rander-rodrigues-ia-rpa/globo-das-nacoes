import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../theme';

/** Céu em degradê com nuvens simples, usado nos menus. */
export function drawSkyBackground(scene: Phaser.Scene, top = 0x6ec3f4, bottom = 0xe6f6ff): void {
  const g = scene.add.graphics();
  g.fillGradientStyle(top, top, bottom, bottom, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  const clouds = [
    [180, 140, 1],
    [1040, 110, 1.3],
    [760, 220, 0.8],
    [320, 330, 0.7],
  ] as const;
  for (const [x, y, s] of clouds) {
    const cloud = scene.add.graphics({ x, y });
    cloud.fillStyle(0xffffff, 0.85);
    cloud.fillCircle(0, 0, 34 * s).fillCircle(40 * s, -14 * s, 44 * s).fillCircle(86 * s, 0, 32 * s);
    cloud.fillRoundedRect(-30 * s, 0, 150 * s, 30 * s, 15 * s);
    scene.tweens.add({ targets: cloud, x: x + 40, duration: 6000 + x * 3, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }
}
