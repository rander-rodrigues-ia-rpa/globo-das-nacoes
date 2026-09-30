import Phaser from 'phaser';
import { provideServices, type AppServices } from './AppServices';
import { LEVEL_VIEWS } from './levels/registry';
import { BootScene } from './scenes/BootScene';
import { HeroSelectScene } from './scenes/HeroSelectScene';
import { IntroScene } from './scenes/IntroScene';
import { TitleScene } from './scenes/TitleScene';
import { WorldMapScene } from './scenes/WorldMapScene';
import { GAME_HEIGHT, GAME_WIDTH } from './theme';

/** Cria o jogo Phaser. É o único ponto de entrada deste frontend. */
export function createGame(parent: string | HTMLElement, services: AppServices): Phaser.Game {
  const levelScenes = LEVEL_VIEWS.flatMap((view) => (view.scene ? [view.scene] : []));

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#FFF8E7',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: { activePointers: 2 },
    render: { antialias: true },
    scene: [BootScene, TitleScene, HeroSelectScene, IntroScene, WorldMapScene, ...levelScenes],
  });
  provideServices(game, services);
  return game;
}
