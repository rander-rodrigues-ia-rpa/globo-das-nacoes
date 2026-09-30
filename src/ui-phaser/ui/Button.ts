import Phaser from 'phaser';
import { services } from '../AppServices';
import { COLORS, textStyle } from '../theme';
import { onTap } from './onTap';

export interface ButtonOptions {
  label?: string;
  icon?: string;
  width?: number;
  height?: number;
  color?: number;
  shadowColor?: number;
  fontSize?: number;
  onPress: () => void;
}

/** Botão grande e "fofo", pensado para dedos pequenos (mínimo de 72 px). */
export class Button extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly iconImage?: Phaser.GameObjects.Image;
  private readonly labelText?: Phaser.GameObjects.Text;
  private enabled = true;

  constructor(scene: Phaser.Scene, x: number, y: number, private readonly options: ButtonOptions) {
    super(scene, x, y);
    const width = options.width ?? (options.label ? 280 : 88);
    const height = options.height ?? 88;
    const color = options.color ?? COLORS.primary;
    const shadow = options.shadowColor ?? COLORS.primaryDark;

    this.bg = scene.add.graphics();
    this.drawBackground(width, height, color, shadow);
    this.add(this.bg);

    const hasBoth = options.icon && options.label;
    if (options.icon) {
      const size = Math.min(height - 20, 72);
      this.iconImage = scene.add.image(hasBoth ? -width / 2 + height / 2 + 4 : 0, -3, options.icon).setDisplaySize(size, size);
      this.add(this.iconImage);
    }
    if (options.label) {
      this.labelText = scene.add.text(hasBoth ? height / 4 : 0, -4, options.label, textStyle(options.fontSize ?? 38));
      this.labelText.setOrigin(0.5);
      this.add(this.labelText);
    }

    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      if (this.enabled) scene.tweens.add({ targets: this, scale: 0.92, duration: 70, yoyo: true });
    });
    onTap(this, () => {
      if (!this.enabled) return;
      services(scene).sfx.play('tap');
      this.options.onPress();
    });
    scene.add.existing(this);
  }

  setIcon(key: string): this {
    this.iconImage?.setTexture(key);
    return this;
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    this.setAlpha(enabled ? 1 : 0.5);
    return this;
  }

  private drawBackground(width: number, height: number, color: number, shadow: number): void {
    const radius = Math.min(28, height / 2);
    this.bg.clear();
    this.bg.fillStyle(shadow, 1).fillRoundedRect(-width / 2, -height / 2 + 6, width, height, radius);
    this.bg.fillStyle(color, 1).fillRoundedRect(-width / 2, -height / 2, width, height - 6, radius);
    this.bg.lineStyle(5, COLORS.ink, 1).strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.bg.fillStyle(0xffffff, 0.25).fillRoundedRect(-width / 2 + 12, -height / 2 + 8, width - 24, height * 0.28, radius / 2);
  }
}
