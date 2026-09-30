import type Phaser from 'phaser';
import { services } from '../AppServices';
import { COLORS, DEPTH, GAME_WIDTH } from '../theme';
import { Button } from './Button';

export interface HudOptions {
  onHome?: () => void;
  onHint?: () => void;
}

/** Botões fixos no topo da tela: dica (esquerda), som e casa (direita). */
export class Hud {
  readonly hintButton?: Button;

  constructor(scene: Phaser.Scene, options: HudOptions) {
    const { session, narrator, sfx } = services(scene);
    const fixed = (button: Button) => button.setScrollFactor(0).setDepth(DEPTH.hud);

    let x = GAME_WIDTH - 60;
    if (options.onHome) {
      fixed(new Button(scene, x, 58, { icon: 'icon-home', color: COLORS.secondary, shadowColor: COLORS.secondaryDark, onPress: options.onHome }));
      x -= 104;
    }

    const soundIcon = () => (session.settings.sound ? 'icon-sound-on' : 'icon-sound-off');
    const soundButton = fixed(
      new Button(scene, x, 58, {
        icon: soundIcon(),
        color: COLORS.secondary,
        shadowColor: COLORS.secondaryDark,
        onPress: () => {
          const enabled = !session.settings.sound;
          session.updateSettings({ sound: enabled, narration: enabled });
          soundButton.setIcon(soundIcon());
        },
      }),
    );
    // Mantém narrador e efeitos sincronizados com a preferência salva.
    const apply = () => {
      narrator.setEnabled(session.settings.narration);
      sfx.setEnabled(session.settings.sound);
    };
    apply();
    const off = session.events.on('settings-changed', apply);
    scene.events.once('shutdown', off);

    if (options.onHint) {
      this.hintButton = fixed(new Button(scene, 60, 58, { icon: 'icon-hint', color: COLORS.cream, shadowColor: COLORS.muted, onPress: options.onHint }));
    }
  }
}
