import Phaser from 'phaser';
import { services } from '../AppServices';
import { FRAGMENT_KEYS, fragmentTexture, heroTexture } from '../assets';
import { SCENES } from '../sceneKeys';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';
import { drawSkyBackground } from '../ui/backgrounds';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { fadeIn, goTo } from '../ui/transitions';

/** "Incidente inicial" do pitch: Ordem → Caos → Chamada para a ação. */
export class IntroScene extends Phaser.Scene {
  private page = 0;
  private stage!: Phaser.GameObjects.Container;
  private title!: Phaser.GameObjects.Text;
  private caption!: Caption;
  private pageTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super(SCENES.intro);
  }

  create(): void {
    const { text } = services(this);
    this.page = 0;
    fadeIn(this);
    drawSkyBackground(this, 0x9fd8ff, 0xfff8e7);
    new Hud(this, {});
    this.caption = new Caption(this, 560);
    this.title = this.add.text(GAME_WIDTH / 2, 70, '', textStyle(52)).setOrigin(0.5);
    this.stage = this.add.container(0, 0);

    new Button(this, GAME_WIDTH - 180, GAME_HEIGHT - 70, {
      label: text.ui.next,
      width: 260,
      color: COLORS.success,
      shadowColor: COLORS.successDark,
      onPress: () => this.showPage(this.page + 1),
    });
    new Button(this, 130, GAME_HEIGHT - 70, {
      label: text.ui.skip,
      width: 180,
      height: 72,
      fontSize: 30,
      color: COLORS.muted,
      shadowColor: COLORS.mutedDark,
      onPress: () => this.finish(),
    });

    this.showPage(0);
  }

  private showPage(page: number): void {
    const { text } = services(this);
    if (page >= text.intro.length) return this.finish();
    this.page = page;
    const content = text.intro[page]!;
    this.title.setText(content.title);
    this.pageTimer?.remove();
    this.tweens.killTweensOf(this.stage.list);
    this.stage.removeAll(true);
    [this.drawOrder, this.drawChaos, this.drawCallToAction][page]?.call(this);
    this.caption.say(content.narration, { duration: 60000 });
  }

  private drawOrder(): void {
    const glow = this.add.circle(GAME_WIDTH / 2, 290, 170, 0xfff3b0, 0.6);
    const globe = this.add.image(GAME_WIDTH / 2, 300, 'globe');
    this.stage.add([glow, globe]);
    this.tweens.add({ targets: glow, scale: 1.12, alpha: 0.3, duration: 1200, yoyo: true, repeat: -1 });
    this.tweens.add({ targets: globe, angle: 4, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private drawChaos(): void {
    const { sfx } = services(this);
    const globe = this.add.image(GAME_WIDTH / 2, 300, 'globe');
    this.stage.add(globe);
    this.tweens.add({ targets: globe, x: GAME_WIDTH / 2 + 8, duration: 50, yoyo: true, repeat: 12 });
    this.pageTimer = this.time.delayedCall(700, () => {
      this.cameras.main.flash(300, 255, 255, 255);
      sfx.play('wrong');
      globe.setAlpha(0.35);
      FRAGMENT_KEYS.forEach((fragment, index) => {
        const piece = this.add.image(GAME_WIDTH / 2, 310, fragmentTexture(fragment)).setScale(0.2);
        this.stage.add(piece);
        const angle = (index / FRAGMENT_KEYS.length) * Math.PI * 2 - Math.PI / 2;
        this.tweens.add({
          targets: piece,
          x: GAME_WIDTH / 2 + Math.cos(angle) * 330,
          y: 320 + Math.sin(angle) * 140,
          scale: 0.7,
          angle: 360,
          duration: 900,
          ease: 'Cubic.Out',
          onComplete: () => this.tweens.add({ targets: piece, y: piece.y - 12, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' }),
        });
      });
    });
  }

  private drawCallToAction(): void {
    const { session } = services(this);
    const hero = this.add.image(GAME_WIDTH / 2, 470, heroTexture(session.hero ?? 'joao')).setOrigin(0.5, 1).setScale(0.95);
    this.stage.add(hero);
    FRAGMENT_KEYS.forEach((fragment, index) => {
      const slot = this.add.image(GAME_WIDTH / 2 - 400 + index * 200, 150, fragmentTexture(fragment, true)).setScale(0.6);
      this.stage.add(slot);
    });
    this.tweens.add({ targets: hero, y: 450, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private finish(): void {
    services(this).session.markIntroSeen();
    goTo(this, SCENES.worldMap);
  }
}
