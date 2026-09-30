import Phaser from 'phaser';
import type { TargetId, UseItemResult } from '../../core';
import { services } from '../AppServices';
import { BaseLevelScene, type WorldLayout } from './BaseLevelScene';

const WORLD_WIDTH = 2560;
const BEAR_X = 1990;
const CAVE_BLOCK_X = 1860;

/**
 * Fase 1 — Alasca: o Fragmento de Gelo.
 * Explorar as geleiras, achar o peixe no buraco do gelo, dar o peixe ao
 * Urso Polar ranzinza, que dorme e libera a caverna de cristal.
 */
export class AlaskaScene extends BaseLevelScene {
  private bear!: Phaser.GameObjects.Image;
  private bearTalked = false;

  constructor() {
    super('alasca');
  }

  protected buildWorld(): WorldLayout {
    this.bearTalked = false;
    this.add.image(0, 0, 'bg-alasca').setOrigin(0);

    // Neve caindo o tempo todo.
    this.add
      .particles(0, -10, 'snowflake', {
        x: { min: 0, max: WORLD_WIDTH },
        speedY: { min: 40, max: 100 },
        speedX: { min: -25, max: 25 },
        scale: { min: 0.3, max: 0.9 },
        alpha: { start: 0.95, end: 0.6 },
        lifespan: 9000,
        frequency: 70,
      })
      .setDepth(900);

    // Buraco no gelo com o peixe pulando ao lado.
    this.add.image(1150, 520, 'ice-hole').setDepth(505);
    const fish = this.add.image(1275, 530, 'item-peixe').setScale(0.55).setDepth(530);
    this.tweens.add({ targets: fish, angle: { from: -12, to: 12 }, y: 512, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerPickup('peixe-do-buraco-no-gelo', fish);

    // A Base do Globo (pedestal) no fundo da caverna, onde o fragmento aparece.
    this.add.image(2330, 560, 'pedestal').setOrigin(0.5, 1).setScale(0.9).setDepth(560);
    this.registerFragment(2330, 410);

    // O Urso Polar bloqueando a entrada.
    this.bear = this.add.image(BEAR_X, 600, 'bear-awake').setOrigin(0.5, 1).setScale(0.8).setDepth(600);
    this.tweens.add({ targets: this.bear, scaleY: 0.82, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerTarget('urso', this.bear, { x: BEAR_X - 190, y: 570 });

    return {
      width: WORLD_WIDTH,
      start: { x: 180, y: 560 },
      walkArea: new Phaser.Geom.Rectangle(60, 480, WORLD_WIDTH - 120, 120),
    };
  }

  protected walkLimit(): { minX: number; maxX: number } {
    const base = super.walkLimit();
    return this.run.stateOf('urso') === 'bloqueando' ? { ...base, maxX: CAVE_BLOCK_X } : base;
  }

  protected fragmentRevealDelay(): number {
    return 3600; // depois que o urso dorme
  }

  protected onBlocked(): void {
    this.growl();
  }

  protected onTargetTapped(target: TargetId): void {
    if (target === 'urso' && this.run.stateOf('urso') === 'bloqueando') this.growl();
  }

  protected onItemUsed(result: Extract<UseItemResult, { kind: 'success' }>): void {
    if (result.target !== 'urso') return;
    const { sfx } = services(this);
    this.setBusy(true);
    this.tweens.killTweensOf(this.bear);
    this.bear.setScale(0.8);

    // 1) o peixe voa até o urso; 2) ele come feliz; 3) boceja e dorme.
    const fish = this.add.image(this.player.x + 40, this.player.y - 90, 'item-peixe').setScale(0.5).setDepth(700);
    this.tweens.add({
      targets: fish,
      x: this.bear.x - 20,
      y: this.bear.y - 120,
      angle: 360,
      duration: 600,
      ease: 'Quad.Out',
      onComplete: () => {
        fish.destroy();
        this.say(this.levelText.lines.bearFed!);
        this.tweens.add({ targets: this.bear, scaleY: 0.74, duration: 140, yoyo: true, repeat: 3 });
      },
    });

    this.time.delayedCall(3200, () => {
      sfx.play('snore');
      this.bear.setTexture('bear-sleeping').setPosition(BEAR_X + 90, 625).setDepth(625);
      this.floatZzz();
      this.say(this.levelText.lines.bearAsleep!);
      this.player.cheer();
      this.setBusy(false);
      this.time.delayedCall(4500, () => {
        if (!this.run.isFragmentCollected()) this.say(this.levelText.lines.fragmentShines!);
      });
    });
  }

  private growl(): void {
    const { sfx } = services(this);
    sfx.play('growl');
    this.tweens.add({ targets: this.bear, angle: { from: -4, to: 4 }, duration: 70, yoyo: true, repeat: 3, onComplete: () => this.bear.setAngle(0) });
    // A primeira vez explica; depois só rosna, para não cansar.
    if (!this.bearTalked) {
      this.bearTalked = true;
      this.say(this.levelText.lines.bearBlocks!);
    } else {
      this.caption.say('Grrr!', { speak: false, duration: 1500 });
    }
    this.markProgress();
  }

  private floatZzz(): void {
    this.time.addEvent({
      delay: 1100,
      loop: true,
      callback: () => {
        const z = this.add.text(this.bear.x - 110, this.bear.y - 150, 'Z', {
          fontFamily: '"Baloo 2", sans-serif',
          fontSize: '44px',
          fontStyle: '800',
          color: '#46B7F0',
          stroke: '#FFFFFF',
          strokeThickness: 6,
        });
        z.setDepth(800);
        this.tweens.add({ targets: z, x: z.x - 40, y: z.y - 90, alpha: 0, scale: 1.6, duration: 2000, onComplete: () => z.destroy() });
      },
    });
  }
}
