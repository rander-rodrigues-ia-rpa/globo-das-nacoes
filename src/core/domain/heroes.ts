import type { HeroId } from './ids';

export interface HeroDefinition {
  id: HeroId;
}

/** A criança escolhe um destes heróis no começo do jogo. */
export const HEROES: readonly HeroDefinition[] = [{ id: 'joao' }, { id: 'gabriel' }, { id: 'larissa' }];

export function isHeroId(value: unknown): value is HeroId {
  return HEROES.some((hero) => hero.id === value);
}
