import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LEVELS, HEROES } from '../../src/core';
import { loadText } from '../../src/content';

/** Garante que toda fase, item, alvo e herói tem texto — pega esquecimentos ao criar fases novas. */
describe('conteúdo pt-BR', () => {
  const text = loadText();

  it('tem nome para todos os heróis', () => {
    for (const hero of HEROES) expect(text.heroes[hero.id]?.name, hero.id).toBeTruthy();
  });

  for (const level of CAMPAIGN_LEVELS) {
    it(`tem todos os textos da fase "${level.id}"`, () => {
      const levelText = text.levels[level.id];
      expect(levelText, 'textos da fase').toBeDefined();
      expect(text.fragments[level.fragmentId]?.name, `fragmento ${level.fragmentId}`).toBeTruthy();
      for (const pickup of level.script.pickups) expect(text.items[pickup.item]?.the, `item ${pickup.item}`).toBeTruthy();
      for (const target of level.script.targets) expect(levelText?.targets[target.id], `alvo ${target.id}`).toBeTruthy();
      expect(text.epilogue.panels[level.id], 'quadro do epílogo').toBeTruthy();
    });
  }
});
