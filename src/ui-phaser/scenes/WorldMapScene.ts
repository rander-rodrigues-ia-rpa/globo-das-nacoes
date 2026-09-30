import Phaser from 'phaser';
import type { LevelStatus } from '../../core';
import { services } from '../AppServices';
import { fragmentTexture, heroTexture } from '../assets';
import { levelView, type LevelView } from '../levels/registry';
import { levelSceneKey, SCENES } from '../sceneKeys';
import { COLORS, GAME_HEIGHT, textStyle } from '../theme';
import { Caption } from '../ui/Caption';
import { FragmentTray } from '../ui/FragmentTray';
import { Hud } from '../ui/Hud';
import { onTap } from '../ui/onTap';
import { fadeIn, goTo } from '../ui/transitions';

/** Mapa interativo do mundo: uma "bolinha" por fase, liberadas em sequência. */
export class WorldMapScene extends Phaser.Scene {
  private hero!: Phaser.GameObjects.Image;
  private caption!: Caption;
  private traveling = false;

  constructor() {
    super(SCENES.worldMap);
  }

  create(): void {
    const { session, text } = services(this);
    this.traveling = false;
    fadeIn(this);
    this.add.image(0, 0, 'world-map').setOrigin(0);
    new Hud(this, { onHome: () => goTo(this, SCENES.title) });
    new FragmentTray(this, 1050, 178);
    this.caption = new Caption(this, GAME_HEIGHT - 60);

    const levels = session.catalog.list().flatMap((level) => {
      const view = levelView(level.id);
      return view ? [{ level, view }] : [];
    });

    this.drawRoute(levels.map(({ view }) => view));

    for (const { level, view } of levels) {
      this.createPin(view, session.levelStatus(level.id), level.order, level.fragmentId);
    }

    // O herói fica na próxima fase a jogar (ou na última, se acabou tudo).
    const next = session.nextLevel();
    const standOn = levelView(next ?? levels[levels.length - 1]?.level.id ?? '') ?? levels[0]?.view;
    this.hero = this.add
      .image(standOn?.pin.x ?? 0, (standOn?.pin.y ?? 0) - 36, heroTexture(session.hero ?? 'joao'))
      .setOrigin(0.5, 1)
      .setScale(0.36)
      .setDepth(10);
    this.tweens.add({ targets: this.hero, y: this.hero.y - 10, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.caption.say(session.allFragmentsCollected() ? text.ui.allFragmentsSoon : text.ui.mapNarration);
  }

  private drawRoute(views: LevelView[]): void {
    const g = this.add.graphics();
    g.lineStyle(8, 0xffffff, 0.9);
    for (let i = 0; i < views.length - 1; i++) {
      const a = views[i]!.pin;
      const b = views[i + 1]!.pin;
      const control = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 60 };
      const curve = new Phaser.Curves.QuadraticBezier(
        new Phaser.Math.Vector2(a.x, a.y),
        new Phaser.Math.Vector2(control.x, control.y),
        new Phaser.Math.Vector2(b.x, b.y),
      );
      // Linha tracejada: pontos alternados ao longo da curva.
      const points = curve.getSpacedPoints(Math.round(curve.getLength() / 18));
      for (let p = 0; p < points.length - 1; p += 2) {
        g.lineBetween(points[p]!.x, points[p]!.y, points[p + 1]!.x, points[p + 1]!.y);
      }
    }
  }

  private createPin(view: LevelView, status: LevelStatus, order: number, fragmentId: string): void {
    const { text, sfx } = services(this);
    const levelText = text.levels[view.levelId];
    const pin = this.add.container(view.pin.x, view.pin.y);
    const available = status === 'available';
    const color = status === 'locked' ? COLORS.muted : view.color;

    const glow = this.add.circle(0, 0, 58, 0xffffff, available ? 0.7 : 0);
    const disk = this.add.circle(0, 0, 40, color).setStrokeStyle(6, COLORS.ink);
    pin.add([glow, disk]);

    if (status === 'completed') {
      pin.add(this.add.image(0, -2, fragmentTexture(fragmentId)).setScale(0.42));
    } else if (status === 'locked') {
      pin.add(this.add.image(0, 0, 'icon-lock').setScale(0.62));
    } else {
      pin.add(this.add.text(0, -3, String(order), textStyle(44)).setOrigin(0.5));
    }

    if (levelText) {
      const label = this.add.text(0, 62, levelText.country, textStyle(26)).setOrigin(0.5, 0);
      pin.add(label);
    }

    if (available) {
      this.tweens.add({ targets: glow, scale: 1.35, alpha: 0, duration: 1100, repeat: -1 });
      this.tweens.add({ targets: disk, scale: 1.08, duration: 550, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }

    pin.setSize(120, 150).setInteractive({ useHandCursor: true });
    onTap(pin, () => {
      if (this.traveling) return;
      if (status === 'locked') {
        sfx.play('locked');
        this.caption.say(text.ui.locked);
        this.tweens.add({ targets: pin, x: view.pin.x + 6, duration: 50, yoyo: true, repeat: 3 });
        return;
      }
      if (!view.scene) {
        sfx.play('tap');
        this.caption.say(text.ui.comingSoon);
        return;
      }
      this.travelTo(view);
    });
  }

  private travelTo(view: LevelView): void {
    const { sfx, narrator, text } = services(this);
    this.traveling = true;
    sfx.play('success');
    const levelText = text.levels[view.levelId];
    if (levelText) narrator.speak(levelText.country);
    this.tweens.killTweensOf(this.hero);
    this.tweens.add({
      targets: this.hero,
      x: view.pin.x,
      y: view.pin.y - 36,
      duration: 700,
      ease: 'Sine.InOut',
      onComplete: () => goTo(this, levelSceneKey(view.levelId)),
    });
    this.tweens.add({ targets: this.hero, scale: 0.45, duration: 350, yoyo: true });
  }
}
