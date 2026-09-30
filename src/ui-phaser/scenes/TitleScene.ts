import Phaser from 'phaser';
import { HEROES } from '../../core';
import { services } from '../AppServices';
import { heroTexture } from '../assets';
import { SCENES } from '../sceneKeys';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';
import { drawSkyBackground } from '../ui/backgrounds';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { fadeIn, goTo } from '../ui/transitions';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENES.title);
  }

  create(): void {
    const { session, text } = services(this);
    fadeIn(this);
    drawSkyBackground(this);
    new Hud(this, {});
    const caption = new Caption(this, GAME_HEIGHT - 60);

    const globe = this.add.image(GAME_WIDTH / 2, 250, 'globe').setScale(0.95);
    this.tweens.add({ targets: globe, y: 235, angle: 3, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.add.text(GAME_WIDTH / 2, 80, text.title, textStyle(64)).setOrigin(0.5);

    // Dois heróis à esquerda e um à direita, "pulando" de animação.
    const spots = [
      { x: 150, flip: false },
      { x: 1120, flip: true },
      { x: 300, flip: false },
    ];
    HEROES.forEach((hero, index) => {
      const spot = spots[index]!;
      const sprite = this.add.image(spot.x, 640, heroTexture(hero.id)).setOrigin(0.5, 1).setScale(0.9).setFlipX(spot.flip);
      this.tweens.add({ targets: sprite, y: 628, duration: 700 + index * 150, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });

    const start = () => goTo(this, session.introSeen ? SCENES.worldMap : SCENES.intro);

    if (session.hasGameInProgress()) {
      new Button(this, GAME_WIDTH / 2, 470, { label: text.ui.continue, width: 340, onPress: start });
      let confirming = false;
      new Button(this, GAME_WIDTH / 2, 575, {
        label: text.ui.newGame,
        width: 280,
        height: 76,
        fontSize: 30,
        color: COLORS.muted,
        shadowColor: COLORS.mutedDark,
        onPress: () => {
          // Toque duplo para confirmar: evita apagar o progresso sem querer.
          if (!confirming) {
            confirming = true;
            caption.say(text.ui.confirmNewGame);
            this.time.delayedCall(4000, () => (confirming = false));
            return;
          }
          goTo(this, SCENES.heroSelect);
        },
      });
    } else {
      new Button(this, GAME_WIDTH / 2, 500, { label: text.ui.play, width: 340, height: 104, fontSize: 48, onPress: () => goTo(this, SCENES.heroSelect) });
    }
  }
}
