import type Phaser from 'phaser';

/**
 * "Toque" de verdade: o dedo precisa COMEÇAR e TERMINAR no objeto.
 * Evita disparos acidentais ao soltar um item arrastado (ou um dedo que
 * escorregou) em cima de um botão, personagem ou pino do mapa.
 */
export function onTap(object: Phaser.GameObjects.GameObject, handler: () => void): void {
  let pressed = false;
  object.on('pointerdown', () => (pressed = true));
  object.on('pointerout', () => (pressed = false));
  object.on('pointerup', () => {
    if (!pressed) return;
    pressed = false;
    handler();
  });
}
