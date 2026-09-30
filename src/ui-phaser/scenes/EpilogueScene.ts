import Phaser from 'phaser';
import { services } from '../AppServices';
import { levelView } from '../levels/registry';
import { SCENES } from '../sceneKeys';
import { COLORS, GAME_WIDTH, textStyle } from '../theme';
import { drawSkyBackground } from '../ui/backgrounds';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { fadeIn, goTo } from '../ui/transitions';

const PANEL_EVERY_MS = 3400;
const CARD = { maxWidth: 220, height: 230, y: 250, gap: 20 };

/**
 * Epílogo: um quadro por fase mostrando o "vilão" redimido, depois a mensagem
 * final e os créditos. Os quadros vêm do registro de fases — fases novas
 * aparecem aqui sozinhas.
 */
export class EpilogueScene extends Phaser.Scene {
  constructor() {
    super(SCENES.epilogue);
  }

  create(): void {
    const { session, text } = services(this);
    fadeIn(this);
    drawSkyBackground(this, 0xffc97a, 0xfff8e7);
    new Hud(this, { onHome: () => goTo(this, SCENES.worldMap) });
    const caption = new Caption(this, 440);
    this.add.text(GAME_WIDTH / 2, 70, text.epilogue.title, textStyle(56)).setOrigin(0.5);

    const levels = session.catalog.list().flatMap((level) => {
      const view = levelView(level.id);
      return view?.epilogue ? [{ level, view, epilogue: view.epilogue }] : [];
    });
    const width = Math.min(CARD.maxWidth, (GAME_WIDTH - 80 - CARD.gap * (levels.length - 1)) / levels.length);
    const startX = GAME_WIDTH / 2 - ((levels.length - 1) * (width + CARD.gap)) / 2;

    levels.forEach(({ level, view, epilogue }, index) => {
      this.time.delayedCall(600 + index * PANEL_EVERY_MS, () => {
        const card = this.add.container(startX + index * (width + CARD.gap), CARD.y);
        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 1).fillRoundedRect(-width / 2, -CARD.height / 2, width, CARD.height, 24);
        bg.fillStyle(view.color, 0.35).fillRoundedRect(-width / 2, -CARD.height / 2, width, CARD.height, 24);
        bg.lineStyle(5, COLORS.ink).strokeRoundedRect(-width / 2, -CARD.height / 2, width, CARD.height, 24);
        const sprite = this.add.image(0, 10, epilogue.texture);
        sprite.setScale(Math.min((width - 24) / sprite.width, 160 / sprite.height, epilogue.scale));
        const country = this.add.text(0, CARD.height / 2 - 26, text.levels[level.id]?.country ?? level.id, textStyle(24)).setOrigin(0.5);
        card.add([bg, sprite, country]).setScale(0);
        this.tweens.add({ targets: card, scale: 1, duration: 450, ease: 'Back.Out' });
        this.tweens.add({ targets: sprite, y: 0, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
        services(this).sfx.play('pickup');
        caption.say(text.epilogue.panels[level.id] ?? '', { duration: PANEL_EVERY_MS - 200 });
      });
    });

    this.time.delayedCall(600 + levels.length * PANEL_EVERY_MS, () => this.showEnding(caption));
  }

  private showEnding(caption: Caption): void {
    const { text, narrator, sfx } = services(this);
    caption.hide();
    sfx.play('fragment');

    const message = this.add
      .text(GAME_WIDTH / 2, 470, text.epilogue.message, textStyle(30, COLORS.inkCss, { wordWrap: { width: 980 } }))
      .setOrigin(0.5)
      .setAlpha(0);
    const box = this.add.graphics().setAlpha(0);
    const w = message.width + 60;
    const h = message.height + 36;
    box.fillStyle(COLORS.cream, 0.95).fillRoundedRect(GAME_WIDTH / 2 - w / 2, 470 - h / 2, w, h, 24);
    box.lineStyle(5, 0xc8961a).strokeRoundedRect(GAME_WIDTH / 2 - w / 2, 470 - h / 2, w, h, 24);
    message.setDepth(1);
    this.tweens.add({ targets: [box, message], alpha: 1, duration: 600 });
    narrator.speak(text.epilogue.message);

    text.epilogue.credits.forEach((line, index) => {
      const credit = this.add.text(GAME_WIDTH / 2, 572 + index * 34, line, textStyle(24, '#5A4630')).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: credit, alpha: 1, delay: 1200 + index * 400, duration: 600 });
    });

    this.time.delayedCall(2400, () => {
      const button = new Button(this, GAME_WIDTH / 2, 668, {
        label: text.epilogue.backToMap,
        width: 340,
        height: 76,
        fontSize: 32,
        color: COLORS.success,
        shadowColor: COLORS.successDark,
        onPress: () => goTo(this, SCENES.worldMap),
      });
      button.setScale(0);
      this.tweens.add({ targets: button, scale: 1, duration: 300, ease: 'Back.Out' });
    });
  }
}
