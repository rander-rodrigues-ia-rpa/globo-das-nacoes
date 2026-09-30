import Phaser from 'phaser';
import type { TargetId, UseItemResult } from '../../core';
import { services } from '../AppServices';
import { FONT_FAMILY } from '../theme';
import { BaseLevelScene, type WorldLayout } from './BaseLevelScene';

const WORLD_WIDTH = 3000;
const FLOOR_Y = 540;
const PATROL = { from: 1900, to: 2260, speed: 120, pause: 1100 }; // o olhar (300 px) nunca alcança a janela
const OFFICE_DOOR_X = 2290;
const CHECKPOINT = { x: 1300, y: 560 };
const VISION_LENGTH = 300;
const WINDOW_SPOT = { x: 1590, y: 500 };

/**
 * Fase 2 — Inglaterra: o Fragmento do Conhecimento.
 * Achar as chaves no parquinho e a lanterna no corredor. O Diretor Mau
 * patrulha a frente da diretoria (quem pisa na luz amarela é visto).
 * Os sinais da lanterna na janela o distraem; as chaves abrem o armário.
 */
export class EnglandScene extends BaseLevelScene {
  private director!: Phaser.GameObjects.Image;
  private windowImage!: Phaser.GameObjects.Image;
  private locker!: Phaser.GameObjects.Image;
  private vision!: Phaser.GameObjects.Graphics;
  private visionShape = new Phaser.Geom.Polygon();
  private facing: 1 | -1 = -1;
  private pausedUntil = 0;
  private walkTime = 0;
  private catching = false;
  private timesCaught = 0;
  private warnedAboutLight = false;

  constructor() {
    super('inglaterra');
  }

  protected buildWorld(): WorldLayout {
    this.facing = -1;
    this.pausedUntil = 0;
    this.catching = false;
    this.timesCaught = 0;
    this.warnedAboutLight = false;

    this.add.image(0, 0, 'bg-inglaterra').setOrigin(0);

    // Chaves perdidas brilhando na caixa de areia do parquinho.
    const keys = this.add.image(545, 548, 'item-chaves').setScale(0.5).setDepth(548);
    this.tweens.add({ targets: keys, angle: { from: -10, to: 10 }, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.sparkleAt(545, 530);
    this.registerPickup('chaves-perdidas', keys);

    // Lanterna em cima do banco, perto da sala de aula.
    const flashlight = this.add.image(1145, 458, 'item-lanterna').setScale(0.5).setDepth(470);
    this.tweens.add({ targets: flashlight, y: 450, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerPickup('lanterna-da-sala', flashlight);

    // A janela do corredor.
    this.windowImage = this.add.image(1520, 250, 'window').setScale(0.8).setDepth(1);
    this.registerTarget('janela', this.windowImage, { x: 1440, y: 540 });

    // O armário trancado dentro da diretoria.
    this.locker = this.add.image(2690, 520, 'locker-closed').setOrigin(0.5, 1).setScale(0.85).setDepth(520);
    this.registerTarget('armario', this.locker, { x: 2590, y: 560 });
    this.registerFragment(2690, 370, 530); // na frente do armário

    // O Diretor Mau e a luz amarela do olhar dele.
    this.vision = this.add.graphics().setDepth(2);
    this.director = this.add.image(PATROL.to, FLOOR_Y, 'director').setOrigin(0.5, 1).setScale(0.62).setDepth(FLOOR_Y);
    this.registerTarget('diretor', this.director, () => ({ x: this.director.x - this.facing * 130, y: 560 }));
    this.updateFacing();

    return {
      width: WORLD_WIDTH,
      start: { x: 180, y: 560 },
      walkArea: new Phaser.Geom.Rectangle(60, 480, WORLD_WIDTH - 120, 120),
    };
  }

  // ------------------------------------------------------------ ganchos

  protected walkLimit(): { minX: number; maxX: number } {
    const base = super.walkLimit();
    return this.isGuarding() ? { ...base, maxX: OFFICE_DOOR_X } : base;
  }

  /** Chegou à porta da diretoria com o diretor vigiando: ele ouve e vê a criança. */
  protected onBlocked(): void {
    this.caught();
  }

  protected fragmentRevealDelay(): number {
    return 900;
  }

  protected onTargetTapped(target: TargetId): void {
    const lines = this.levelText.lines;
    if (target === 'diretor') {
      services(this).sfx.play('alert');
      this.bubble('!');
      this.say(this.isGuarding() ? lines.directorTapped! : lines.sneak!);
    } else if (target === 'armario' && this.run.stateOf('armario') === 'trancado') {
      services(this).sfx.play('locked');
      this.shakeObject(this.locker);
    }
  }

  protected onUpdate(time: number, delta: number): void {
    if (!this.isGuarding()) return;
    this.patrol(time, delta);
    this.drawVision();
    if (Phaser.Geom.Polygon.Contains(this.visionShape, this.player.x, this.player.y)) this.caught();
  }

  protected onItemUsed(result: Extract<UseItemResult, { kind: 'success' }>): void {
    if (result.target === 'janela') this.distractDirector();
    if (result.target === 'armario') this.openLocker();
  }

  // ------------------------------------------------------------ diretor

  private isGuarding(): boolean {
    return this.run.stateOf('diretor') === 'vigiando';
  }

  private patrol(time: number, delta: number): void {
    if (time < this.pausedUntil) {
      this.director.y = FLOOR_Y;
      this.director.angle = 0;
      return;
    }
    this.director.x += (this.facing * PATROL.speed * delta) / 1000;
    if (this.director.x <= PATROL.from || this.director.x >= PATROL.to) {
      this.director.x = Phaser.Math.Clamp(this.director.x, PATROL.from, PATROL.to);
      this.facing = this.facing === 1 ? -1 : 1;
      this.pausedUntil = time + PATROL.pause;
      this.updateFacing();
    }
    // Passo pesado e marchado.
    this.walkTime += delta;
    this.director.y = FLOOR_Y - Math.abs(Math.sin(this.walkTime / 140)) * 6;
    this.director.angle = Math.sin(this.walkTime / 140) * 2;
  }

  private updateFacing(): void {
    this.director.setFlipX(this.facing === -1);
  }

  /** Luz amarela no chão mostrando para onde o diretor olha. */
  private drawVision(): void {
    const x = this.director.x;
    const y = FLOOR_Y + 10;
    const dir = this.facing;
    const points = [
      x + dir * 30, y - 16,
      x + dir * VISION_LENGTH, y - 70,
      x + dir * VISION_LENGTH, y + 80,
      x + dir * 30, y + 16,
    ];
    this.visionShape.setTo(points);
    this.vision.clear();
    this.vision.fillStyle(0xffe066, 0.35).fillPoints(this.visionShape.points, true);
    this.vision.lineStyle(4, 0xf2c230, 0.6).strokePoints(this.visionShape.points, true);
  }

  /** A criança foi vista: bronca gentil e volta para antes do corredor (sem "game over"). */
  private caught(): void {
    if (this.catching || !this.isGuarding()) return;
    this.catching = true;
    this.timesCaught++;
    const { sfx } = services(this);
    this.setBusy(true);
    sfx.play('alert');
    this.facing = this.player.x < this.director.x ? -1 : 1;
    this.updateFacing();
    this.drawVision();
    this.bubble('!');
    this.say(this.levelText.lines.caught!);

    this.time.delayedCall(1400, () => {
      this.tweens.add({
        targets: this.player,
        x: CHECKPOINT.x,
        y: CHECKPOINT.y,
        duration: 900,
        ease: 'Sine.InOut',
        onComplete: () => {
          this.catching = false;
          this.pausedUntil = 0;
          this.setBusy(false);
          const lines = this.levelText.lines;
          if (!this.warnedAboutLight) {
            this.warnedAboutLight = true;
            this.say(lines.avoidLight!);
          } else if (this.timesCaught >= 2) {
            this.say(lines.caughtHint!);
          }
        },
      });
    });
  }

  private distractDirector(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    this.setBusy(true);
    this.vision.clear();
    this.say(lines.windowSignal!);

    // Sinais de luz: a janela pisca e continua piscando devagar.
    this.time.addEvent({
      delay: 180,
      repeat: 7,
      callback: () => this.windowImage.setTexture(this.windowImage.texture.key === 'window' ? 'window-lit' : 'window'),
    });
    this.time.delayedCall(1600, () => {
      this.windowImage.setTexture('window-lit');
      this.tweens.add({ targets: this.windowImage, alpha: 0.75, duration: 500, yoyo: true, repeat: -1 });
      sfx.play('alert');
      this.bubble('?');
      this.say(lines.directorDistracted!);
    });

    // O diretor vai até a janela e fica olhando lá fora, de costas.
    this.time.delayedCall(3400, () => {
      this.facing = -1;
      this.updateFacing();
      this.tweens.add({
        targets: this.director,
        x: WINDOW_SPOT.x,
        y: WINDOW_SPOT.y,
        duration: 1800,
        ease: 'Sine.InOut',
        onUpdate: () => this.director.setDepth(this.director.y),
        onComplete: () => {
          this.director.setTexture('director-back').setFlipX(false).setAngle(0);
          this.say(lines.sneak!);
          this.setBusy(false);
          this.markProgress();
        },
      });
    });
  }

  private openLocker(): void {
    services(this).sfx.play('unlock');
    this.locker.setTexture('locker-open');
    this.say(this.levelText.lines.lockerOpen!);
    this.player.cheer();
  }

  // ------------------------------------------------------------ efeitos

  private bubble(symbol: string): void {
    const text = this.add
      .text(this.director.x, this.director.y - 250, symbol, {
        fontFamily: FONT_FAMILY,
        fontSize: '64px',
        fontStyle: '800',
        color: '#FF4D6D',
        stroke: '#FFFFFF',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(900);
    this.tweens.add({ targets: text, y: text.y - 40, scale: 1.3, alpha: 0, delay: 700, duration: 700, onComplete: () => text.destroy() });
  }

  private sparkleAt(x: number, y: number): void {
    const sparkle = this.add.image(x, y, 'sparkle').setDepth(900).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: sparkle, scale: { from: 0.3, to: 1.2 }, alpha: { from: 1, to: 0 }, duration: 900, repeat: -1, repeatDelay: 700 });
  }

  private shakeObject(object: Phaser.GameObjects.Image): void {
    const x = object.x;
    this.tweens.add({ targets: object, x: x + 8, duration: 50, yoyo: true, repeat: 3, onComplete: () => object.setX(x) });
  }
}
