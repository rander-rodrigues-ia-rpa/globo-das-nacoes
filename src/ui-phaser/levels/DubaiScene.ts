import Phaser from 'phaser';
import type { TargetId, UseItemResult } from '../../core';
import { services } from '../AppServices';
import { fragmentTexture } from '../assets';
import { PhonePuzzle } from '../ui/PhonePuzzle';
import { BaseLevelScene, type WorldLayout } from './BaseLevelScene';

const WORLD_WIDTH = 3400;
const BLACKOUT_X = 600;
/** Pontos de fuga do ladrão; o último é o corredor sem saída. */
const THIEF_STOPS = [1260, 2080, 3230];
const THIEF_Y = 540;
const THIEF_FLEE_DISTANCE = 330;
/** Escala da camada de escuridão: sem lanterna (luz pequena) e com lanterna. */
const DARK_SCALE = { small: 2.6, flashlight: 4 };
const DEPTH_ABOVE_DARK = 810;

/**
 * Fase 3 — Dubai: o Fragmento do Brilho ("A Mecânica do Blecaute").
 * Ao entrar na joalheria, as luzes apagam e o Ladrão some com o fragmento.
 * A lanterna revela as pegadas; seguindo-as, o Ladrão foge até ficar encurralado.
 * O celular liga os geradores: o clarão assusta o Ladrão, que devolve o fragmento.
 */
export class DubaiScene extends BaseLevelScene {
  private darkness!: Phaser.GameObjects.Image;
  private thief!: Phaser.GameObjects.Image;
  private displayFragment!: Phaser.GameObjects.Image;
  private generator!: Phaser.GameObjects.Image;
  private generatorLed!: Phaser.GameObjects.Arc;
  private marks!: Phaser.GameObjects.Image;
  private trail: Phaser.GameObjects.Image[] = [];
  private blackedOut = false;
  private thiefStop = 0;
  private thiefMoving = false;
  private thiefTalked = false;

  constructor() {
    super('dubai');
  }

  protected buildWorld(): WorldLayout {
    this.blackedOut = false;
    this.thiefStop = 0;
    this.thiefMoving = false;
    this.thiefTalked = false;
    this.trail = [];

    this.add.image(0, 0, 'bg-dubai').setOrigin(0);

    // Vitrine da joalheria com o fragmento dourado em exposição.
    this.add.image(820, 470, 'display-case').setOrigin(0.5, 1).setScale(0.9).setDepth(470);
    this.displayFragment = this.add.image(820, 300, fragmentTexture('brilho')).setScale(0.45).setDepth(471);
    this.tweens.add({ targets: this.displayFragment, y: 290, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    // Lanterna no balcão de informações (com brilho que aparece mesmo no escuro).
    const flashlight = this.add.image(440, 400, 'item-lanterna').setScale(0.5).setDepth(470);
    this.registerPickup('lanterna-do-balcao', flashlight);
    this.glowAt(flashlight);

    // Celular perdido pelo ladrão no caminho.
    const phone = this.add.image(1790, 575, 'item-celular').setScale(0.42).setAngle(-70).setDepth(575);
    this.registerPickup('celular-perdido', phone);
    this.glowAt(phone);

    // Gerador de emergência no corredor de serviço (luz vermelha piscando).
    this.generator = this.add.image(3010, 470, 'generator').setOrigin(0.5, 1).setScale(0.75).setDepth(470);
    this.registerTarget('gerador', this.generator, { x: 3000, y: 540 });
    this.generatorLed = this.add.circle(3010 + 34, 470 - 66, 9, 0xff4d6d).setDepth(DEPTH_ABOVE_DARK).setVisible(false);
    this.tweens.add({ targets: this.generatorLed, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });

    // Marcas no chão (o alvo da lanterna) e a trilha de pegadas, invisíveis até o blecaute.
    this.marks = this.add.image(930, 565, 'footprints').setScale(0.9).setDepth(DEPTH_ABOVE_DARK).setAlpha(0);
    for (let x = 1030, i = 0; x < 3180; x += 115, i++) {
      const step = this.add
        .image(x, 520 + (i % 2) * 55, 'footprints')
        .setScale(0.6)
        .setAngle(i % 2 ? 8 : -8)
        .setDepth(DEPTH_ABOVE_DARK)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(0);
      this.trail.push(step);
    }

    // O ladrão fica escondido até as luzes apagarem.
    this.thief = this.add.image(THIEF_STOPS[0]!, THIEF_Y, 'thief').setOrigin(0.5, 1).setScale(0.62).setDepth(THIEF_Y).setVisible(false);
    this.registerTarget('ladrao', this.thief, () => ({ x: this.thief.x - 140, y: 560 }));
    this.registerFragment(3120, 400, 700);

    // Escuridão: uma camada preta com um buraco de luz que acompanha o herói.
    this.darkness = this.add.image(0, 0, 'darkness').setScale(DARK_SCALE.small).setDepth(800).setAlpha(0);
    const follow = () => this.darkness.setPosition(this.player.x, this.player.y - 90);
    this.events.on('postupdate', follow);
    this.events.once('shutdown', () => this.events.off('postupdate', follow));

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

  protected onUpdate(): void {
    if (!this.blackedOut && this.player.x > BLACKOUT_X) this.blackout();
    if (this.blackedOut && this.run.stateOf('ladrao') === 'fugindo') this.checkChase();
  }

  protected onTargetTapped(target: TargetId): void {
    if (target === 'ladrao' && this.run.stateOf('ladrao') === 'fugindo') {
      services(this).sfx.play('laugh');
      this.say(this.levelText.lines.thiefTapped!);
    }
  }

  protected onItemUsed(result: Extract<UseItemResult, { kind: 'success' }>): void {
    if (result.target === 'pegadas') this.turnOnFlashlight();
    if (result.target === 'gerador') this.hackGenerator();
  }

  // ------------------------------------------------------------ blecaute

  private blackout(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    this.blackedOut = true;
    this.setBusy(true);
    sfx.play('powerdown');

    // Luzes piscando e apagando.
    this.tweens.add({
      targets: this.darkness,
      alpha: { from: 0, to: 0.85 },
      duration: 120,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.darkness.setAlpha(1);
        this.displayFragment.destroy();
        this.thief.setVisible(true);
        this.generatorLed.setVisible(true);
        this.say(lines.blackout!);
        this.revealMarks();
      },
    });

    this.time.delayedCall(2600, () => {
      sfx.play('laugh');
      this.say(`${lines.stolen} ${lines.thiefLaugh}`);
      this.setBusy(false);
      this.markProgress();
    });
    this.time.delayedCall(8500, () => {
      if (!this.run.hasItem('lanterna')) this.say(lines.findLight!);
    });
  }

  /** As marcas perto da vitrine ficam levemente visíveis: é ali que a lanterna deve ser usada. */
  private revealMarks(): void {
    this.registerTarget('pegadas', this.marks, { x: 860, y: 560 });
    this.tweens.add({ targets: this.marks, alpha: { from: 0.15, to: 0.45 }, duration: 800, yoyo: true, repeat: -1 });
  }

  private turnOnFlashlight(): void {
    const { sfx } = services(this);
    sfx.play('powerup');
    this.tweens.killTweensOf(this.marks);
    this.marks.setAlpha(1).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: this.darkness, scale: DARK_SCALE.flashlight, duration: 600, ease: 'Back.Out' });
    // As pegadas acendem uma a uma, mostrando o caminho.
    this.trail.forEach((step, index) => {
      this.tweens.add({ targets: step, alpha: 0.9, delay: 300 + index * 70, duration: 300 });
      this.tweens.add({ targets: step, alpha: 0.5, delay: 1400 + index * 70, duration: 900, yoyo: true, repeat: -1 });
    });
    this.say(this.levelText.lines.footprints!);
  }

  // ------------------------------------------------------------ perseguição

  private checkChase(): void {
    if (this.thiefMoving || this.thiefStop >= THIEF_STOPS.length - 1) return;
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.thief.x, this.thief.y);
    if (distance > THIEF_FLEE_DISTANCE) return;

    const { sfx } = services(this);
    const lines = this.levelText.lines;
    this.thiefMoving = true;
    this.thiefStop++;
    const last = this.thiefStop === THIEF_STOPS.length - 1;
    sfx.play('laugh');
    if (!this.thiefTalked) {
      this.thiefTalked = true;
      this.say(lines.thiefRuns!);
    }
    this.thief.setFlipX(false);
    this.tweens.add({
      targets: this.thief,
      x: THIEF_STOPS[this.thiefStop]!,
      duration: 1600,
      ease: 'Quad.Out',
      onUpdate: () => (this.thief.y = THIEF_Y - Math.abs(Math.sin(this.time.now / 70)) * 12),
      onComplete: () => {
        this.thief.y = THIEF_Y;
        this.thief.setFlipX(true); // vira para a criança
        this.thiefMoving = false;
        if (last) {
          this.say(lines.cornered!);
          this.time.delayedCall(3500, () => {
            if (this.run.stateOf('gerador') === 'desligado') this.say(lines.generatorHint!);
          });
        }
      },
    });
  }

  // ------------------------------------------------------------ gerador e clarão

  private hackGenerator(): void {
    const lines = this.levelText.lines;
    this.setBusy(true);
    new PhonePuzzle(this, { title: lines.phoneTitle!, done: lines.phoneDone! }, () => this.lightsBack());
  }

  private lightsBack(): void {
    const { sfx } = services(this);
    const lines = this.levelText.lines;
    sfx.play('powerup');
    this.generator.setTexture('generator-on');
    this.generatorLed.setFillStyle(0x3cc46a);
    this.cameras.main.flash(700, 255, 255, 240);
    this.tweens.add({ targets: this.darkness, alpha: 0, duration: 500 });
    this.tweens.killTweensOf([this.marks, ...this.trail]);
    this.tweens.add({ targets: [this.marks, ...this.trail], alpha: 0, duration: 600 });
    this.say(lines.lightsBack!);

    // O ladrão leva um susto, levanta as mãos e devolve o fragmento.
    this.time.delayedCall(900, () => {
      this.tweens.killTweensOf(this.thief);
      this.thief.setTexture('thief-scared').setFlipX(false).setY(THIEF_Y);
      this.tweens.add({ targets: this.thief, x: this.thief.x + 6, duration: 50, yoyo: true, repeat: 7 });
      this.say(lines.thiefScared!);
      this.revealFragment();
      this.setBusy(false);
      this.markProgress();
    });
  }

  private glowAt(object: Phaser.GameObjects.Image): void {
    const glow = this.add.image(object.x, object.y - 10, 'sparkle').setDepth(DEPTH_ABOVE_DARK).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: glow, scale: { from: 0.4, to: 1.4 }, alpha: { from: 1, to: 0 }, duration: 1000, repeat: -1, repeatDelay: 500 });
    object.once('destroy', () => glow.destroy());
  }
}
