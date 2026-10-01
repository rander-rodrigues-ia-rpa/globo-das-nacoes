import Phaser from 'phaser';

/**
 * Fixa um objeto na tela (não rola com a câmera) — ele E todos os filhos.
 *
 * Importante para o TOQUE: o Phaser calcula se o dedo acertou um objeto usando o
 * scrollFactor do próprio objeto, não o do contêiner onde ele está. Se só o
 * contêiner for fixado, o desenho aparece no lugar certo, mas o toque é procurado
 * no lugar "rolado" — e nada responde quando a câmera está longe do início da fase.
 */
export function pinToScreen<T extends Phaser.GameObjects.GameObject>(object: T): T {
  const target = object as unknown as Phaser.GameObjects.Components.ScrollFactor;
  target.setScrollFactor?.(0);
  if (object instanceof Phaser.GameObjects.Container) {
    object.list.forEach((child) => pinToScreen(child));
  }
  return object;
}
