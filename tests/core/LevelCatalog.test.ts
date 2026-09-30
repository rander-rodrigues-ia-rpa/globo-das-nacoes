import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LEVELS, LevelCatalog, validateLevel, type LevelDefinition } from '../../src/core';

describe('LevelCatalog', () => {
  it('todas as fases da campanha são válidas', () => {
    for (const level of CAMPAIGN_LEVELS) expect(validateLevel(level), level.id).toEqual([]);
  });

  it('lista em ordem e libera cada fase depois da anterior', () => {
    const catalog = new LevelCatalog(CAMPAIGN_LEVELS);
    expect(catalog.list().map((l) => l.id)).toEqual(['alasca', 'inglaterra', 'dubai', 'africa', 'brasil']);
    expect(catalog.prerequisitesOf('alasca')).toEqual([]);
    expect(catalog.prerequisitesOf('dubai')).toEqual(['inglaterra']);
  });

  it('aceita fases novas registradas depois (extensibilidade)', () => {
    const catalog = new LevelCatalog(CAMPAIGN_LEVELS);
    catalog.register({
      id: 'japao',
      order: 6,
      fragmentId: 'harmonia',
      script: {
        pickups: [{ id: 'leque', item: 'leque' }],
        targets: [{ id: 'dragao', initialState: 'bravo' }],
        interactions: [{ target: 'dragao', item: 'leque', from: 'bravo', to: 'calmo' }],
        fragmentRequires: [{ target: 'dragao', state: 'calmo' }],
      },
    });
    expect(catalog.prerequisitesOf('japao')).toEqual(['brasil']);
    expect(catalog.fragments()).toHaveLength(6);
  });

  it('recusa roteiros com erros de digitação', () => {
    const broken: LevelDefinition = {
      id: 'quebrada',
      order: 99,
      fragmentId: 'x',
      script: {
        pickups: [{ id: 'p', item: 'peixe' }],
        targets: [{ id: 'urso', initialState: 'bloqueando' }],
        interactions: [{ target: 'uso', item: 'pexe', from: 'bloqueando', to: 'dormindo', effects: [{ target: 'foca', state: 'x' }] }],
        fragmentRequires: [{ target: 'urso', state: 'dormindo' }],
      },
    };
    expect(validateLevel(broken)).toHaveLength(4);
    expect(() => new LevelCatalog([broken])).toThrow(/inválida/);
  });
});
