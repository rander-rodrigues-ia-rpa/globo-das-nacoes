import Phaser from 'phaser';
import type { TargetId, UseItemResult } from '../../core';
import { services } from '../AppServices';
import { fragmentTexture, itemTexture } from '../assets';
import { BaseLevelScene, type WorldLayout } from './BaseLevelScene';

const WORLD_WIDTH = 3000;
const CLEARING = { x: 2560, y: 470 };
const LIONS_BLOCK_X = 2250;
const TRAIL = {
  'trilha-perto': { x: 2150, y: 530, approach: { x: 2060, y: 560 } },
  'trilha-longe': { x: 1790, y: 505, approach: { x: 1690, y: 560 } },
} as const;
type TrailId = keyof typeof TRAIL;

interface Lion {
  sprite: Phaser.GameObjects.Image;
  lying: string;
  /** Onde deita para descansar perto da lagoa. */
  rest: { x: number; y: number };
}

/**
 * Fase 4 — África: o Fragmento da Natureza ("Trail Building").
 * O bando de leões guarda o fragmento no meio da clareira e ruge para quem chega perto.
 * A criança leva comida (bife da caixa térmica, frutas da mangueira) até os círculos do
 * chão, montando uma trilha que leva os leões até a lagoa — e o caminho fica livre.
 */
export class AfricaScene extends BaseLevelScene {
  private lions: Lion[] = [];
  private spots = new Map<TrailId, Phaser.GameObjects.Image>();
  private food = new Map<TrailId, Phaser.GameObjects.Image[]>();
  private fragmentDecor!: Phaser.GameObjects.Image;
  private pack!: Phaser.GameObjects.Zone;
  private warned = false;

  constructor() {
    super('africa');
  }

  protected buildWorld(): WorldLayout {
    this.lions = [];
    this.spots = new Map();
    this.food = new Map();
    this.warned = false;

    this.add.image(0, 0, 'bg-africa').setOrigin(0);

    // Bife na caixa térmica do jipe e frutas debaixo da mangueira.
    const steak = this.add.image(565, 425, 'item-bife').setScale(0.42).setDepth(470);
    this.tweens.add({ targets: steak, y: 418, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerPickup('bife-da-caixa-termica', steak);
    const fruits = this.add.image(1235, 530, 'item-frutas').setScale(0.45).setDepth(530);
    this.tweens.add({ targets: fruits, angle: { from: -6, to: 6 }, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerPickup('frutas-da-mangueira', fruits);

    // Os dois círculos da trilha de comida.
    for (const [id, spot] of Object.entries(TRAIL) as [TrailId, (typeof TRAIL)[TrailId]][]) {
      const marker = this.add.image(spot.x, spot.y, 'trail-spot').setDepth(spot.y - 30);
      this.tweens.add({ targets: marker, alpha: 0.55, scale: 1.08, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.spots.set(id, marker);
      this.food.set(id, []);
      this.registerTarget(id, marker, spot.approach);
    }

    // O fragmento no meio da clareira (visível desde o começo, mas cercado).
    this.fragmentDecor = this.add.image(CLEARING.x, CLEARING.y, fragmentTexture('natureza')).setScale(0.55).setDepth(CLEARING.y);
    this.tweens.add({ targets: this.fragmentDecor, y: CLEARING.y - 10, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.registerFragment(CLEARING.x, CLEARING.y - 20, CLEARING.y + 5);

    // O bando: dois leões e duas leoas em círculo.
    const pride: [string, string, number, number, number, { x: number; y: number }][] = [
      ['lioness', 'lioness-lying', 2465, 492, 0.42, { x: 1620, y: 492 }],
      ['lion', 'lion-lying', 2660, 492, 0.44, { x: 1930, y: 492 }],
      ['lion', 'lion-lying', 2410, 570, 0.5, { x: 1700, y: 560 }],
      ['lioness', 'lioness-lying', 2715, 570, 0.48, { x: 1860, y: 560 }],
    ];
    for (const [texture, lying, x, y, scale, rest] of pride) {
      const sprite = this.add.image(x, y, texture).setOrigin(0.5, 1).setScale(scale).setDepth(y);
      this.tweens.add({ targets: sprite, scaleY: scale * 1.03, duration: 1000 + x % 300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.lions.push({ sprite, lying, rest });
    }
    this.pack = this.add.zone(CLEARING.x, CLEARING.y, 440, 240);
    this.registerTarget('leoes', this.pack, { x: LIONS_BLOCK_X - 60, y: 560 });

    return {
      width: WORLD_WIDTH,
      start: { x: 160, y: 560 },
      walkArea: new Phaser.Geom.Rectangle(60, 480, WORLD_WIDTH - 120, 120),
    };
  }

  // ------------------------------------------------------------ ganchos

  protected fragmentRevealDelay(): 'manual' {
    return 'manual';
  }

  protected walkLimit(): { minX: number; maxX: number } {
    const base = super.walkLimit();
    return this.run.stateOf('leoes') === 'guardando' ? { ...base, maxX: LIONS_BLOCK_X } : base;
  }

  protected onBlocked(): void {
    this.roar(this.warned ? this.levelText.lines.roar! : this.levelText.lines.lionsBlock!);
    this.warned = true;
  }

  protected onTargetTapped(target: TargetId): void {
    if (target === 'leoes' && this.run.stateOf('leoes') === 'guardando') {
      this.roar(this.levelText.lines.lionsTapped!);
    } else if (target in TRAIL && this.run.stateOf(target) === 'vazia') {
      this.say(this.levelText.lines.trailIdea!);
    }
  }

  protected onItemUsed(result: Extract<UseItemResult, { kind: 'success' }>): void {
    if (!(result.target in TRAIL)) return;
    const id = result.target as TrailId;
    this.dropFood(id, result.item);
    if (id === 'trilha-perto') {
      this.say(this.levelText.lines.trailStarted!);
      this.sniff();
    }
    if (this.run.stateOf('leoes') === 'atraidos') this.time.delayedCall(900, () => this.lionsFollowTrail());
  }

  // ------------------------------------------------------------ trilha de comida

  /** A comida vira vários pedacinhos espalhados no círculo. */
  private dropFood(id: TrailId, item: string): void {
    const spot = TRAIL[id];
    services(this).sfx.play('pickup');
    const marker = this.spots.get(id)!;
    this.tweens.killTweensOf(marker);
    this.tweens.add({ targets: marker, alpha: 0.25, scale: 1, duration: 300 });
    [-50, 0, 50].forEach((dx, index) => {
      const piece = this.add
        .image(spot.x + dx, spot.y - 6 + (index % 2) * 10, itemTexture(item))
        .setScale(0)
        .setDepth(spot.y - 20);
      this.tweens.add({ targets: piece, scale: 0.28, angle: dx / 2, delay: index * 120, duration: 300, ease: 'Back.Out' });
      this.food.get(id)!.push(piece);
    });
  }

  /** Os leões levantam o nariz: sentiram o cheiro! */
  private sniff(): void {
    this.lions.forEach(({ sprite }, index) => {
      this.tweens.add({ targets: sprite, angle: -6, duration: 250, delay: index * 120, yoyo: true, repeat: 1 });
    });
  }

  private lionsFollowTrail(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    this.setBusy(true);
    this.say(lines.lionsSmell!);
    // A criança dá licença para o bando passar.
    this.tweens.add({ targets: this.player, x: 1520, y: 590, duration: 700, ease: 'Sine.Out' });

    this.lions.forEach((lion, index) => {
      const { sprite } = lion;
      this.tweens.killTweensOf(sprite);
      const near = TRAIL['trilha-perto'];
      const far = TRAIL['trilha-longe'];
      this.walk(sprite, near.x + (index - 1.5) * 40, near.y + 20, 1400, 500 + index * 450, () => {
        sfx.play('munch');
        if (index === this.lions.length - 1) this.eat('trilha-perto');
        this.walk(sprite, far.x + (index - 1.5) * 40, far.y + 20, 1200, 500, () => {
          sfx.play('munch');
          if (index === this.lions.length - 1) this.eat('trilha-longe');
          this.walk(sprite, lion.rest.x, lion.rest.y, 700, 400, () => {
            sprite.setTexture(lion.lying).setFlipX(false).setAngle(0);
            if (index === this.lions.length - 1) this.pathIsClear();
          });
        });
      });
    });
  }

  /** Caminhada com "passinhos" (balanço) entre dois pontos. */
  private walk(sprite: Phaser.GameObjects.Image, x: number, y: number, duration: number, delay: number, onDone: () => void): void {
    sprite.setFlipX(x > sprite.x);
    this.tweens.add({
      targets: sprite,
      x,
      y,
      duration,
      delay,
      ease: 'Sine.InOut',
      onUpdate: () => {
        sprite.setAngle(Math.sin(this.time.now / 90) * 4);
        sprite.setDepth(sprite.y);
      },
      onComplete: () => {
        sprite.setAngle(0);
        onDone();
      },
    });
  }

  private eat(id: TrailId): void {
    for (const piece of this.food.get(id) ?? []) {
      this.tweens.add({ targets: piece, scale: 0, duration: 250, onComplete: () => piece.destroy() });
    }
    this.food.set(id, []);
    this.spots.get(id)?.setVisible(false);
  }

  private pathIsClear(): void {
    this.say(this.levelText.lines.lionsHappy!);
    this.tweens.killTweensOf(this.fragmentDecor);
    this.fragmentDecor.destroy();
    this.pack.disableInteractive(); // a clareira volta a ser só chão
    this.revealFragment();
    this.player.cheer();
    this.setBusy(false);
    this.markProgress();
  }

  private roar(line: string): void {
    services(this).sfx.play('roar');
    this.lions.forEach(({ sprite }) => {
      this.tweens.add({ targets: sprite, x: sprite.x + 5, duration: 60, yoyo: true, repeat: 3 });
    });
    this.say(line);
    this.markProgress();
  }
}
