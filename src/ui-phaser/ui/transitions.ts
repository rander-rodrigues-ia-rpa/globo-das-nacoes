import type Phaser from 'phaser';
import { services } from '../AppServices';

/** Troca de cena com um fade suave (evita cortes bruscos para crianças pequenas). */
export function goTo(scene: Phaser.Scene, key: string, data?: object): void {
  if (scene.registry.get('transitioning')) return;
  scene.registry.set('transitioning', true);
  services(scene).narrator.stop();
  scene.cameras.main.fadeOut(280, 255, 248, 231);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.registry.set('transitioning', false);
    scene.scene.start(key, data);
  });
}

export function fadeIn(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(320, 255, 248, 231);
}
