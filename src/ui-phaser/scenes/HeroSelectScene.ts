import Phaser from 'phaser';
import { HEROES, type HeroId } from '../../core';
import { services } from '../AppServices';
import { heroTexture } from '../assets';
import { SCENES } from '../sceneKeys';
import { COLORS, GAME_WIDTH, textStyle } from '../theme';
import { drawSkyBackground } from '../ui/backgrounds';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { onTap } from '../ui/onTap';
import { fadeIn, goTo } from '../ui/transitions';

/** A criança escolhe UM dos três heróis. */
export class HeroSelectScene extends Phaser.Scene {
  private chosen: HeroId | null = null;

  constructor() {
    super(SCENES.heroSelect);
  }

  create(): void {
    const { session, text, sfx } = services(this);
    this.chosen = null;
    fadeIn(this);
    drawSkyBackground(this, 0xffc97a, 0xfff3d6);
    new Hud(this, { onHome: () => goTo(this, SCENES.title) });
    const caption = new Caption(this, 660);

    this.add.text(GAME_WIDTH / 2, 70, text.ui.chooseHero, textStyle(56)).setOrigin(0.5);

    const confirm = new Button(this, GAME_WIDTH / 2, 655, {
      label: text.ui.confirm,
      width: 320,
      color: COLORS.success,
      shadowColor: COLORS.successDark,
      onPress: () => {
        if (!this.chosen) return;
        session.newGame(this.chosen);
        goTo(this, SCENES.intro);
      },
    }).setVisible(false);

    const cards = HEROES.map((hero, index) => {
      const x = GAME_WIDTH / 2 + (index - 1) * 380;
      const card = this.add.container(x, 350);
      const bg = this.add.graphics();
      const draw = (selected: boolean) => {
        bg.clear();
        bg.fillStyle(selected ? 0xfff2b3 : COLORS.cream, 1).fillRoundedRect(-160, -210, 320, 420, 36);
        bg.lineStyle(selected ? 10 : 5, selected ? COLORS.primary : COLORS.ink, 1).strokeRoundedRect(-160, -210, 320, 420, 36);
      };
      draw(false);
      const portrait = this.add.image(0, 90, heroTexture(hero.id)).setOrigin(0.5, 1).setScale(1);
      const name = this.add.text(0, 125, text.heroes[hero.id].name, textStyle(48, COLORS.inkCss)).setOrigin(0.5);
      const role = this.add.text(0, 172, text.heroes[hero.id].role, textStyle(28, '#7D5A2E')).setOrigin(0.5);
      card.add([bg, portrait, name, role]);
      card.setSize(320, 420).setInteractive({ useHandCursor: true });
      onTap(card, () => {
        this.chosen = hero.id;
        sfx.play('pickup');
        caption.setVisible(false);
        confirm.setVisible(true);
        services(this).narrator.speak(text.ui.heroChosen(text.heroes[hero.id].name));
        cards.forEach((c) => c.select(c.id === hero.id));
      });
      return {
        id: hero.id,
        select: (selected: boolean) => {
          draw(selected);
          this.tweens.add({ targets: card, scale: selected ? 1.06 : 0.94, alpha: selected ? 1 : 0.75, duration: 180, ease: 'Back.Out' });
          if (selected) this.tweens.add({ targets: portrait, y: 70, duration: 160, yoyo: true, repeat: 1 });
        },
      };
    });

    caption.say(text.ui.chooseHero);
  }
}
