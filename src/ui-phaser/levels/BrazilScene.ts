import Phaser from 'phaser';
import type { TargetId, UseItemResult } from '../../core';
import { services } from '../AppServices';
import { COLORS, DEPTH } from '../theme';
import { Button } from '../ui/Button';
import { onTap } from '../ui/onTap';
import { BaseLevelScene, type WorldLayout } from './BaseLevelScene';

// Mesma geometria da arte (scripts/art/brasil.mjs → TOWER).
const WORLD = { width: 1800, height: 1600 };
const TOWER_X = { left: 1000, right: 1720 };

/** Andares onde o herói pode andar: 0 = chão do parque, 3 = topo da torre. */
const PLATFORMS = [
  new Phaser.Geom.Rectangle(60, 1440, WORLD.width - 120, 100),
  new Phaser.Geom.Rectangle(TOWER_X.left + 20, 1152, TOWER_X.right - TOWER_X.left - 40, 12),
  new Phaser.Geom.Rectangle(TOWER_X.left + 20, 842, TOWER_X.right - TOWER_X.left - 40, 12),
  new Phaser.Geom.Rectangle(TOWER_X.left + 20, 532, TOWER_X.right - TOWER_X.left - 40, 12),
];
const TOP = PLATFORMS.length - 1;

/** Escadas ligando os andares (alternando os lados, como numa torre de verdade). */
const LADDERS = [
  { x: 1070, from: 0, to: 1, bottomY: 1450, topY: 1158 },
  { x: 1650, from: 1, to: 2, bottomY: 1158, topY: 848 },
  { x: 1070, from: 2, to: 3, bottomY: 848, topY: 538 },
];

/** Por onde rolam os caixotes em cada andar (sempre na direção de quem sobe). */
const LANES: Record<number, { from: number; to: number }> = {
  1: { from: TOWER_X.right - 30, to: TOWER_X.left - 40 },
  2: { from: TOWER_X.left + 30, to: TOWER_X.right + 40 },
};

const CAPTAIN = { x: 1600, y: 538 };
const CAPTAIN_BLOCK_X = 1480;
/** Ritmo normal e ritmo "cansado" (ajuda automática depois de algumas caixadas). */
const PACE = {
  normal: { throwEvery: 2600, crateSpeed: 230 },
  tired: { throwEvery: 4200, crateSpeed: 150 },
};
const HITS_BEFORE_HELP = 3;

interface Crate {
  sprite: Phaser.GameObjects.Image;
  lane: number;
  rolling: boolean;
}

/**
 * Fase 5 — Brasil: o Fragmento da Alegria.
 * O Capitão Cascudo fechou as válvulas do parque aquático e subiu na torre.
 * A criança pega o Super Balde, sobe os andares pulando os caixotes que ele joga
 * e, lá no topo, dá um banho no Capitão — que escorrega pelo tobogã.
 */
export class BrazilScene extends BaseLevelScene {
  private captain!: Phaser.GameObjects.Image;
  private pool!: Phaser.GameObjects.Image;
  private platform = 0;
  private crates: Crate[] = [];
  private nextThrowAt = 0;
  private throwLane = 1;
  private hits = 0;
  private metCaptain = false;
  private climbKeys!: { up: Phaser.Input.Keyboard.Key[]; down: Phaser.Input.Keyboard.Key[] };

  constructor() {
    super('brasil');
  }

  protected buildWorld(): WorldLayout {
    this.platform = 0;
    this.crates = [];
    this.nextThrowAt = 0;
    this.throwLane = 1;
    this.hits = 0;
    this.metCaptain = false;

    this.add.image(0, 0, 'bg-brasil').setOrigin(0);
    this.pool = this.add.image(680, 1400, 'pool-water').setDepth(1).setAlpha(0);

    // O Super Balde no balcão do quiosque.
    const bucket = this.add.image(250, 1392, 'item-super-balde').setScale(0.5).setDepth(1400);
    this.tweens.add({ targets: bucket, y: 1384, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerPickup('super-balde-do-quiosque', bucket);

    // Escadas: tocar nelas sobe (ou desce) um andar.
    LADDERS.forEach((ladder) => {
      const image = this.add
        .image(ladder.x, ladder.bottomY + 10, 'ladder')
        .setOrigin(0.5, 1)
        .setDisplaySize(90, ladder.bottomY - ladder.topY + 40)
        .setDepth(ladder.topY - 10) // atrás de quem está no andar de cima
        .setInteractive({ useHandCursor: true });
      onTap(image, () => this.useLadder(ladder));
    });

    // Capitão Cascudo no topo, guardando o último fragmento.
    this.captain = this.add.image(CAPTAIN.x, CAPTAIN.y, 'captain').setOrigin(0.5, 1).setScale(0.62).setDepth(CAPTAIN.y + 1);
    this.tweens.add({ targets: this.captain, scaleY: 0.64, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerTarget('capitao', this.captain, { x: CAPTAIN_BLOCK_X - 20, y: CAPTAIN.y });
    this.registerFragment(CAPTAIN.x, CAPTAIN.y - 110, CAPTAIN.y + 2);

    // Botão grande de pular (e teclas Espaço/J); setas ↑/↓ usam a escada.
    const jump = new Button(this, 1150, 630, {
      label: services(this).text.ui.jump,
      width: 200,
      height: 96,
      color: COLORS.secondary,
      shadowColor: COLORS.secondaryDark,
      onPress: () => this.jump(),
    });
    jump.setScrollFactor(0).setDepth(DEPTH.hud);
    const keyboard = this.input.keyboard!;
    keyboard.on('keydown-SPACE', () => this.jump());
    keyboard.on('keydown-J', () => this.jump());
    this.climbKeys = {
      up: [keyboard.addKey('UP'), keyboard.addKey('W')],
      down: [keyboard.addKey('DOWN'), keyboard.addKey('S')],
    };

    return {
      width: WORLD.width,
      height: WORLD.height,
      start: { x: 140, y: 1490 },
      walkArea: PLATFORMS[0]!,
    };
  }

  // ------------------------------------------------------------ ganchos

  protected fragmentRevealDelay(): 'manual' {
    return 'manual';
  }

  protected walkLimit(): { minX: number; maxX: number } {
    const base = super.walkLimit();
    const guarded = this.platform === TOP && this.run.stateOf('capitao') === 'bloqueando';
    return guarded ? { ...base, maxX: CAPTAIN_BLOCK_X } : base;
  }

  protected onBlocked(): void {
    if (this.platform === TOP) this.captainSays();
  }

  protected canReach(target: TargetId): boolean {
    return target !== 'capitao' || this.platform === TOP;
  }

  protected onUnreachable(): void {
    this.say(this.levelText.lines.unreachable!);
  }

  protected onTargetTapped(target: TargetId): void {
    if (target === 'capitao' && this.run.stateOf('capitao') === 'bloqueando') this.captainSays();
  }

  protected onUpdate(time: number): void {
    this.handleLadderKeys();
    if (this.run.stateOf('capitao') !== 'bloqueando') return;
    if (this.platform === TOP && !this.metCaptain) {
      this.metCaptain = true;
      this.say(this.levelText.lines.captainTop!);
    }
    if (time >= this.nextThrowAt) {
      this.nextThrowAt = time + this.pace().throwEvery;
      this.throwCrate();
    }
    this.checkCrateHits();
  }

  protected onItemUsed(result: Extract<UseItemResult, { kind: 'success' }>): void {
    if (result.target === 'capitao') this.splashCaptain();
  }

  // ------------------------------------------------------------ escadas e pulo

  private useLadder(ladder: (typeof LADDERS)[number]): void {
    const goingUp = this.platform === ladder.from;
    if (!goingUp && this.platform !== ladder.to) {
      this.say(this.levelText.lines.climbHint!);
      return;
    }
    const startY = goingUp ? ladder.bottomY : ladder.topY;
    this.player.walkTo(ladder.x, startY, () => this.climb(ladder, goingUp));
  }

  private handleLadderKeys(): void {
    const pressed = (keys: Phaser.Input.Keyboard.Key[]) => keys.some((key) => Phaser.Input.Keyboard.JustDown(key));
    const up = pressed(this.climbKeys.up);
    const down = pressed(this.climbKeys.down);
    if (!up && !down) return;
    const ladder = LADDERS.find(
      (l) => Math.abs(this.player.x - l.x) < 70 && ((up && l.from === this.platform) || (down && l.to === this.platform)),
    );
    if (ladder) this.climb(ladder, up);
  }

  private climb(ladder: (typeof LADDERS)[number], goingUp: boolean): void {
    this.setBusy(true);
    const targetY = goingUp ? ladder.topY : ladder.bottomY;
    this.player.x = ladder.x;
    this.tweens.add({
      targets: this.player,
      y: targetY,
      duration: Math.abs(targetY - this.player.y) * 3,
      ease: 'Sine.InOut',
      onUpdate: () => this.player.setDepth(this.player.y),
      onComplete: () => {
        this.platform = goingUp ? ladder.to : ladder.from;
        this.layout.walkArea = PLATFORMS[this.platform]!;
        this.setBusy(false);
        this.markProgress();
      },
    });
  }

  private jump(): void {
    if (this.player.jump()) services(this).sfx.play('jump');
  }

  // ------------------------------------------------------------ caixotes

  /** O Capitão arremessa um caixote (ou barril), que cai num andar e rola. */
  private throwCrate(): void {
    const lane = this.throwLane;
    this.throwLane = lane === 1 ? 2 : 1;
    const route = LANES[lane]!;
    const floorY = PLATFORMS[lane]!.bottom - 30;
    const sprite = this.add
      .image(this.captain.x + 40, this.captain.y - 200, Math.random() < 0.5 ? 'crate' : 'barrel')
      .setScale(0.55)
      .setDepth(floorY + 40);
    const crate: Crate = { sprite, lane, rolling: false };
    this.crates.push(crate);
    services(this).sfx.play('throw');
    this.tweens.add({ targets: this.captain, angle: { from: 0, to: -8 }, duration: 150, yoyo: true });

    // Voo em arco até a ponta do andar...
    this.tweens.add({ targets: sprite, x: route.from, duration: 800, ease: 'Linear' });
    this.tweens.add({
      targets: sprite,
      y: floorY,
      duration: 800,
      ease: 'Quad.In',
      onComplete: () => {
        crate.rolling = true;
        // ...e depois rola pelo andar até cair do outro lado.
        const distance = Math.abs(route.to - route.from);
        this.tweens.add({
          targets: sprite,
          x: route.to,
          angle: Math.sign(route.to - route.from) * 720,
          duration: (distance / this.pace().crateSpeed) * 1000,
          onComplete: () => {
            this.tweens.add({ targets: sprite, y: sprite.y + 200, alpha: 0, duration: 500, onComplete: () => this.removeCrate(crate) });
          },
        });
      },
    });
  }

  private removeCrate(crate: Crate): void {
    this.crates = this.crates.filter((c) => c !== crate);
    crate.sprite.destroy();
  }

  private checkCrateHits(): void {
    if (this.player.isAirborne) return;
    const hit = this.crates.find(
      (c) => c.rolling && c.lane === this.platform && Math.abs(c.sprite.x - this.player.x) < 45,
    );
    if (hit) this.bonk(hit);
  }

  /** Levou uma caixa: nada grave — só volta para o começo do andar. */
  private bonk(crate: Crate): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    crate.rolling = false;
    this.hits++;
    sfx.play('bonk');
    this.setBusy(true);
    this.cameras.main.shake(200, 0.006);
    const arrival = LADDERS.find((l) => l.to === this.platform)!;
    this.tweens.add({
      targets: this.player,
      x: arrival.x + (this.platform === 1 ? 30 : -30),
      duration: 500,
      ease: 'Quad.Out',
      onComplete: () => {
        this.setBusy(false);
        if (this.hits === HITS_BEFORE_HELP) this.say(lines.captainTired!);
        else this.say(this.hits === 1 ? lines.hitFirst! : lines.hitAgain!);
      },
    });
  }

  /** Para não frustrar os menores: depois de algumas caixadas, o Capitão "cansa". */
  private pace(): (typeof PACE)[keyof typeof PACE] {
    return this.hits >= HITS_BEFORE_HELP ? PACE.tired : PACE.normal;
  }

  // ------------------------------------------------------------ Capitão Cascudo

  private captainSays(): void {
    const lines = this.levelText.lines;
    this.say(this.run.hasItem('super-balde') ? lines.blocked! : lines.needBucket!);
    this.tweens.add({ targets: this.captain, angle: { from: -4, to: 4 }, duration: 80, yoyo: true, repeat: 2, onComplete: () => this.captain.setAngle(0) });
    this.markProgress();
  }

  private splashCaptain(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    this.setBusy(true);
    this.crates.forEach((crate) => this.tweens.add({ targets: crate.sprite, alpha: 0, duration: 300, onComplete: () => crate.sprite.destroy() }));
    this.crates = [];

    // O balde vira por cima do Capitão: SPLASH!
    const bucket = this.add.image(this.player.x + 30, this.player.y - 150, 'item-super-balde').setScale(0.6).setDepth(DEPTH.effects);
    this.tweens.add({
      targets: bucket,
      x: this.captain.x - 20,
      y: this.captain.y - 260,
      angle: 150,
      duration: 600,
      ease: 'Quad.Out',
      onComplete: () => {
        sfx.play('splash');
        this.splashAt(this.captain.x, this.captain.y - 150);
        this.tweens.killTweensOf(this.captain);
        this.captain.setTexture('captain-wet').setScale(0.62);
        this.say(lines.splash!);
        this.tweens.add({ targets: bucket, alpha: 0, delay: 400, duration: 300, onComplete: () => bucket.destroy() });
      },
    });

    this.time.delayedCall(2200, () => this.slideDown());
  }

  /** O Capitão escorrega pelo tobogã até a piscina — que volta a ter água. */
  private slideDown(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    const slide = new Phaser.Curves.Path(TOWER_X.right, CAPTAIN.y - 10);
    slide.cubicBezierTo(1500, 1100, 1900, 800, 1300, 900);
    slide.cubicBezierTo(900, 1380, 1700, 1300, 900, 1250);
    const camera = this.cameras.main;
    camera.startFollow(this.captain, true, 0.1, 0.1);
    this.say(lines.captainWashed!);
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 2600,
      ease: 'Sine.In',
      onUpdate: (tween) => {
        const point = slide.getPoint(tween.getValue() ?? 0);
        if (point) this.captain.setPosition(point.x, point.y).setAngle(-25).setDepth(DEPTH.effects);
      },
      onComplete: () => {
        sfx.play('splash');
        this.splashAt(this.captain.x, this.captain.y - 30);
        this.tweens.add({ targets: this.pool, alpha: 1, duration: 900 });
        this.captain.setPosition(960, 1450).setAngle(0).setDepth(1450);
        this.time.delayedCall(900, () => this.say(lines.captainSorry!));
        this.time.delayedCall(3200, () => {
          camera.startFollow(this.player, true, 0.12, 0.12, 0, 60);
          this.revealFragment();
          this.player.cheer();
          this.setBusy(false);
          this.markProgress();
        });
      },
    });
  }

  private splashAt(x: number, y: number): void {
    const burst = this.add.particles(x, y, 'droplet', {
      speed: { min: 150, max: 380 },
      angle: { min: 200, max: 340 },
      gravityY: 700,
      lifespan: 1100,
      scale: { start: 1, end: 0.4 },
      quantity: 26,
      emitting: false,
    });
    burst.setDepth(DEPTH.effects + 1);
    burst.explode(26);
    this.time.delayedCall(1500, () => burst.destroy());
  }
}
