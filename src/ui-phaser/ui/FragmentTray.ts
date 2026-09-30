import Phaser from 'phaser';
import type { FragmentId } from '../../core';
import { services } from '../AppServices';
import { fragmentTexture } from '../assets';
import { COLORS, DEPTH, textStyle } from '../theme';

/** Bandeja com os espaços dos fragmentos: mostra quanto falta para unir o globo. */
export class FragmentTray extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const { session, text } = services(scene);
    const fragments: FragmentId[] = session.catalog.fragments();
    const collected = session.collectedFragments();
    const spacing = 74;
    const width = fragments.length * spacing + 40;

    const bg = scene.add.graphics();
    bg.fillStyle(COLORS.cream, 0.92).fillRoundedRect(-width / 2, -52, width, 104, 28);
    bg.lineStyle(4, COLORS.ink).strokeRoundedRect(-width / 2, -52, width, 104, 28);
    this.add(bg);

    fragments.forEach((fragment, index) => {
      const has = collected.includes(fragment);
      const icon = scene.add.image(-width / 2 + 20 + spacing / 2 + index * spacing, -6, fragmentTexture(fragment, !has)).setScale(0.48);
      this.add(icon);
    });
    const label = scene.add
      .text(0, 38, text.ui.fragmentsCollected(collected.length, fragments.length), textStyle(22, COLORS.inkCss))
      .setOrigin(0.5);
    this.add(label);
    this.setScrollFactor(0).setDepth(DEPTH.hud);
    scene.add.existing(this);
  }
}
