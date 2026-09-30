import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LEVELS, GameSession, GlobeAssembly, LevelCatalog, type SaveRepository } from '../../src/core';

describe('GlobeAssembly (Altar do Mundo)', () => {
  it('cada fragmento só entra no encaixe da mesma cor', () => {
    const assembly = new GlobeAssembly(['gelo', 'brilho']);
    expect(assembly.place('gelo', 'brilho')).toBe('wrong-slot');
    expect(assembly.place('gelo', 'gelo')).toBe('placed');
    expect(assembly.place('gelo', 'gelo')).toBe('already-placed');
    expect(assembly.place('pedra', 'pedra')).toBe('unknown-fragment');
    expect(assembly.nextToPlace()).toBe('brilho');
    expect(assembly.isComplete()).toBe(false);

    let completed = false;
    assembly.events.on('complete', () => (completed = true));
    assembly.place('brilho', 'brilho');
    expect(assembly.isComplete()).toBe(true);
    expect(completed).toBe(true);
  });
});

describe('GameSession — final da história', () => {
  class MemoryRepository implements SaveRepository {
    stored: unknown = null;
    load() {
      return this.stored;
    }
    save(data: unknown) {
      this.stored = JSON.parse(JSON.stringify(data));
    }
    clear() {
      this.stored = null;
    }
  }

  it('o altar só abre com todos os fragmentos e salva o globo restaurado', () => {
    const repo = new MemoryRepository();
    const catalog = new LevelCatalog(CAMPAIGN_LEVELS);
    repo.stored = { hero: 'joao', fragments: ['gelo'], completedLevels: ['alasca'] };
    expect(() => new GameSession(catalog, repo).startAltar()).toThrow(/faltam/);

    repo.stored = { hero: 'joao', fragments: catalog.fragments(), completedLevels: catalog.list().map((l) => l.id) };
    const session = new GameSession(catalog, repo);
    const assembly = session.startAltar();
    for (const fragment of catalog.fragments()) assembly.place(fragment, fragment);

    expect(session.globeRestored).toBe(true);
    expect(new GameSession(catalog, repo).globeRestored).toBe(true);
  });
});
