import Phaser from 'phaser';
import { services } from '../AppServices';
import { COLORS, DEPTH, GAME_WIDTH, textStyle } from '../theme';

/**
 * Faixa de legenda + narração em voz. Tudo que é dito à criança passa por aqui,
 * assim quem ainda não lê ouve, e quem lê acompanha.
 */
export class Caption extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private hideTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, private readonly baseY = 70) {
    super(scene, GAME_WIDTH / 2, baseY);
    this.bg = scene.add.graphics();
    this.label = scene.add
      .text(0, 0, '', textStyle(30, '#2B2A4C', { wordWrap: { width: 770, useAdvancedWrap: true } }))
      .setOrigin(0.5);
    this.add([this.bg, this.label]);
    this.setScrollFactor(0).setDepth(DEPTH.hud + 10).setAlpha(0);
    scene.add.existing(this);
  }

  /** Mostra a legenda e fala o texto. */
  say(text: string, options: { speak?: boolean; duration?: number } = {}): void {
    if (options.speak !== false) services(this.scene).narrator.speak(text);
    this.label.setText(text);
    const width = Math.min(this.label.width + 60, 830);
    const height = this.label.height + 28;
    this.bg.clear();
    this.bg.fillStyle(COLORS.cream, 0.95).fillRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.bg.lineStyle(4, COLORS.ink, 1).strokeRoundedRect(-width / 2, -height / 2, width, height, 22);

    this.scene.tweens.killTweensOf(this);
    this.setY(this.baseY - 10);
    this.scene.tweens.add({ targets: this, alpha: 1, y: this.baseY, duration: 200, ease: 'Back.Out' });

    this.hideTimer?.remove();
    // Tempo de leitura generoso: ~70 ms por letra, mínimo de 3,5 s.
    const duration = options.duration ?? Math.max(3500, text.length * 70);
    this.hideTimer = this.scene.time.delayedCall(duration, () => this.hide());
  }

  hide(): void {
    this.scene.tweens.add({ targets: this, alpha: 0, duration: 250 });
  }
}
