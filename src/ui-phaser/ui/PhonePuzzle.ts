import Phaser from 'phaser';
import { services } from '../AppServices';
import { COLORS, DEPTH, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';
import { onTap } from './onTap';

const BUTTON_COLORS = [0xff4d6d, 0xf7c948, 0x3cc46a];

/**
 * Minijogo do celular: um botão acende de cada vez e a criança toca nele.
 * Não existe erro que atrapalhe — tocar no botão apagado só faz ele balançar.
 * Teclado: Espaço/Enter aperta o botão aceso.
 */
export class PhonePuzzle extends Phaser.GameObjects.Container {
  private readonly buttons: Phaser.GameObjects.Arc[] = [];
  private readonly order: number[];
  private step = 0;
  private readonly keyHandler = () => this.press(this.order[this.step]!);

  constructor(
    scene: Phaser.Scene,
    private readonly texts: { title: string; done: string },
    private readonly onDone: () => void,
  ) {
    super(scene, 0, 0);
    this.order = Phaser.Utils.Array.Shuffle([0, 1, 2]);

    const shade = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.night, 0.7).setOrigin(0).setInteractive();
    const phone = scene.add.graphics();
    const cx = GAME_WIDTH / 2;
    phone.fillStyle(0x2b2a4c).fillRoundedRect(cx - 190, 60, 380, 620, 44);
    phone.fillStyle(0x46b7f0).fillRoundedRect(cx - 160, 110, 320, 500, 20);
    phone.fillStyle(0x8a8f99).fillCircle(cx, 648, 14);
    const title = scene.add
      .text(cx, 170, texts.title, textStyle(32, '#FFFFFF', { wordWrap: { width: 280 } }))
      .setOrigin(0.5);
    this.add([shade, phone, title]);

    BUTTON_COLORS.forEach((color, index) => {
      const button = scene.add.circle(cx, 300 + index * 110, 46, color, 0.35).setStrokeStyle(6, 0xffffff, 0.6);
      button.setInteractive({ useHandCursor: true });
      onTap(button, () => this.press(index));
      this.buttons.push(button);
      this.add(button);
    });

    this.setScrollFactor(0).setDepth(DEPTH.overlay);
    scene.add.existing(this);
    scene.input.keyboard?.on('keydown-SPACE', this.keyHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.keyHandler);
    this.once('destroy', () => {
      scene.input.keyboard?.off('keydown-SPACE', this.keyHandler);
      scene.input.keyboard?.off('keydown-ENTER', this.keyHandler);
    });

    this.setAlpha(0);
    scene.tweens.add({ targets: this, alpha: 1, duration: 250 });
    this.lightCurrent();
  }

  private lightCurrent(): void {
    this.buttons.forEach((button, index) => {
      this.scene.tweens.killTweensOf(button);
      button.setScale(1);
      const lit = index === this.order[this.step];
      // Apagado = cinza-escuro; aceso = cor viva pulsando.
      if (lit) button.setFillStyle(BUTTON_COLORS[index], 1).setStrokeStyle(6, 0xffffff, 1);
      else button.setFillStyle(0x2b2a4c, 0.45).setStrokeStyle(6, 0xffffff, 0.35);
      if (lit) this.scene.tweens.add({ targets: button, scale: 1.15, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });
  }

  private press(index: number): void {
    const { sfx } = services(this.scene);
    if (this.step >= this.order.length) return;
    const button = this.buttons[index]!;
    if (index !== this.order[this.step]) {
      sfx.play('tap');
      this.scene.tweens.add({ targets: button, x: button.x + 8, duration: 50, yoyo: true, repeat: 2 });
      return;
    }
    sfx.play('beep');
    this.step++;
    if (this.step < this.order.length) {
      this.lightCurrent();
      return;
    }
    // Todos os botões acesos: sucesso!
    this.buttons.forEach((b, i) => {
      this.scene.tweens.killTweensOf(b);
      b.setScale(1).setFillStyle(BUTTON_COLORS[i], 1).setStrokeStyle(6, 0xffffff, 1);
    });
    const done = this.scene.add.text(GAME_WIDTH / 2, 560, this.texts.done, textStyle(34)).setOrigin(0.5);
    this.add(done);
    this.scene.time.delayedCall(900, () => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          this.destroy();
          this.onDone();
        },
      });
    });
  }
}
