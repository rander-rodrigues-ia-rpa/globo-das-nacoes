import type Phaser from 'phaser';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const FONT_FAMILY = '"Baloo 2", "Trebuchet MS", "Segoe UI", sans-serif';

export const COLORS = {
  ink: 0x2b2a4c,
  inkCss: '#2B2A4C',
  white: 0xffffff,
  cream: 0xfff8e7,
  primary: 0xff9f2e,
  primaryDark: 0xd46a00,
  secondary: 0x46b7f0,
  secondaryDark: 0x1f7fc2,
  success: 0x3cc46a,
  successDark: 0x1f8a45,
  muted: 0xb0b8c8,
  mutedDark: 0x7d869a,
  sky: 0x8ccbf2,
  night: 0x1b2440,
} as const;

/**
 * Camadas de desenho. No mundo, a profundidade é a altura (y) de cada objeto,
 * para quem está mais "na frente" aparecer por cima — e o mundo pode ter até
 * alguns milhares de pixels de altura (a torre do Brasil tem 1600).
 */
export const DEPTH = {
  /** Efeitos por cima dos personagens (splash, objetos voando). */
  effects: 5000,
  hud: 10000,
  overlay: 20000,
} as const;

export function textStyle(
  size: number,
  color = '#FFFFFF',
  options: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {},
): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: `${size}px`,
    fontStyle: '800',
    color,
    stroke: color === '#FFFFFF' ? COLORS.inkCss : undefined,
    strokeThickness: color === '#FFFFFF' ? Math.max(4, Math.round(size / 7)) : 0,
    align: 'center',
    resolution: 2,
    ...options,
  };
}
