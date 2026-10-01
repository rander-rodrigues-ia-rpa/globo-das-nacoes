import Phaser from 'phaser';
import { services } from '../AppServices';
import { COLORS, DEPTH, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';
import { onTap } from './onTap';
import { pinToScreen } from './pinToScreen';

const TAPS_TO_POWER = 3;
const PHONE = { x: GAME_WIDTH / 2, top: 50, width: 400, height: 620 };

/**
 * Minijogo do celular (Dubai): um botão GIGANTE de ligar. Cada toque carrega
 * um pedaço da bateria; com a bateria cheia, os geradores acendem.
 *
 * Pensado para dedos pequenos: vale tocar em qualquer lugar da tela do celular,
 * não existe erro e não há ordem a decorar. Teclado: Espaço/Enter.
 */
export class PhonePuzzle extends Phaser.GameObjects.Container {
  private charge = 0;
  private done = false;
  private readonly powerButton: Phaser.GameObjects.Container;
  private readonly segments: Phaser.GameObjects.Rectangle[] = [];
  private readonly keyHandler = () => this.press();

  constructor(
    scene: Phaser.Scene,
    private readonly texts: { title: string; done: string },
    private readonly onDone: () => void,
  ) {
    super(scene, 0, 0);
    const cx = PHONE.x;

    // Fundo escurecido que também aceita toque (nenhum toque se perde).
    const shade = scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.night, 0.7).setOrigin(0).setInteractive();
    onTap(shade, () => this.press());

    const phone = scene.add.graphics();
    phone.fillStyle(0x2b2a4c).fillRoundedRect(cx - PHONE.width / 2, PHONE.top, PHONE.width, PHONE.height, 48);
    phone.fillStyle(0x46b7f0).fillRoundedRect(cx - PHONE.width / 2 + 28, PHONE.top + 50, PHONE.width - 56, PHONE.height - 120, 22);
    phone.fillStyle(0x8a8f99).fillCircle(cx, PHONE.top + PHONE.height - 34, 16);
    const title = scene.add
      .text(cx, PHONE.top + 110, texts.title, textStyle(32, '#FFFFFF', { wordWrap: { width: PHONE.width - 90 } }))
      .setOrigin(0.5);

    // Bateria com 3 pedaços.
    const battery = scene.add.graphics();
    const bw = 210;
    const by = PHONE.top + 190;
    battery.lineStyle(6, 0xffffff).strokeRoundedRect(cx - bw / 2, by, bw, 54, 12);
    battery.fillStyle(0xffffff).fillRoundedRect(cx + bw / 2 + 4, by + 16, 12, 22, 4);
    for (let i = 0; i < TAPS_TO_POWER; i++) {
      const w = (bw - 24) / TAPS_TO_POWER - 6;
      const seg = scene.add.rectangle(cx - bw / 2 + 12 + i * (w + 6) + w / 2, by + 27, w, 34, 0x2b2a4c, 0.35);
      this.segments.push(seg);
    }

    // O botão gigante de ligar (raio 95 = ~190 px na tela).
    this.powerButton = scene.add.container(cx, PHONE.top + 420);
    const glow = scene.add.circle(0, 0, 118, 0xbff0ff, 0.5);
    const disk = scene.add.circle(0, 0, 95, COLORS.success).setStrokeStyle(10, 0xffffff);
    const icon = scene.add.graphics();
    icon.lineStyle(14, 0xffffff).beginPath().arc(0, 6, 42, Phaser.Math.DegToRad(-60), Phaser.Math.DegToRad(240), false).strokePath();
    icon.lineBetween(0, -48, 0, 4);
    this.powerButton.add([glow, disk, icon]);
    this.powerButton.setSize(236, 236).setInteractive({ useHandCursor: true });
    onTap(this.powerButton, () => this.press());
    scene.tweens.add({ targets: this.powerButton, scale: 1.08, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    scene.tweens.add({ targets: glow, alpha: 0.15, scale: 1.15, duration: 700, yoyo: true, repeat: -1 });

    // A tela do celular inteira também liga (toques fora do botão contam).
    const screenHit = scene.add
      .zone(cx, PHONE.top + 50 + (PHONE.height - 120) / 2, PHONE.width - 56, PHONE.height - 120)
      .setInteractive();
    onTap(screenHit, () => this.press());

    this.add([shade, phone, screenHit, title, battery, ...this.segments, this.powerButton]);
    this.setDepth(DEPTH.overlay);
    scene.add.existing(this);
    pinToScreen(this);

    scene.input.keyboard?.on('keydown-SPACE', this.keyHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.keyHandler);
    this.once('destroy', () => {
      scene.input.keyboard?.off('keydown-SPACE', this.keyHandler);
      scene.input.keyboard?.off('keydown-ENTER', this.keyHandler);
    });

    this.setAlpha(0);
    scene.tweens.add({ targets: this, alpha: 1, duration: 250 });
  }

  /** Um toque = um pedaço de bateria. */
  press(): void {
    if (this.done) return;
    const { sfx } = services(this.scene);
    this.segments[this.charge]?.setFillStyle(COLORS.success, 1);
    this.charge++;
    sfx.play('beep');
    this.scene.tweens.add({ targets: this.powerButton, angle: { from: -8, to: 8 }, duration: 70, yoyo: true, repeat: 1 });
    if (this.charge < TAPS_TO_POWER) return;

    this.done = true;
    this.scene.tweens.killTweensOf(this.powerButton);
    this.powerButton.setScale(1.15).setAngle(0);
    const message = this.scene.add.text(PHONE.x, PHONE.top + 560, this.texts.done, textStyle(34)).setOrigin(0.5);
    this.add(pinToScreen(message));
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
