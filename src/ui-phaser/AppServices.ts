import type Phaser from 'phaser';
import type { GameSession, Narrator, SoundEffects } from '../core';
import type { GameText } from '../content';

/** Tudo o que as cenas precisam do "mundo de fora". Montado em src/main.ts. */
export interface AppServices {
  session: GameSession;
  narrator: Narrator;
  sfx: SoundEffects;
  text: GameText;
}

const KEY = 'services';

export function provideServices(game: Phaser.Game, services: AppServices): void {
  game.registry.set(KEY, services);
}

export function services(scene: Phaser.Scene): AppServices {
  const value = scene.registry.get(KEY) as AppServices | undefined;
  if (!value) throw new Error('AppServices não foi registrado no jogo');
  return value;
}
