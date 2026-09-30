import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LEVELS, GameSession, LevelCatalog, type SaveRepository } from '../../src/core';

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

const newSession = (repo = new MemoryRepository()) => new GameSession(new LevelCatalog(CAMPAIGN_LEVELS), repo);

function finishAlaska(session: GameSession) {
  const run = session.startLevel('alasca');
  run.pickUp('peixe-do-buraco-no-gelo');
  run.useItem('peixe', 'urso');
  run.collectFragment();
}

describe('GameSession', () => {
  it('começa sem jogo em andamento e só com a Alasca liberada', () => {
    const session = newSession();
    expect(session.hasGameInProgress()).toBe(false);
    expect(session.levelStatus('alasca')).toBe('available');
    expect(session.levelStatus('inglaterra')).toBe('locked');
    expect(() => session.startLevel('inglaterra')).toThrow(/bloqueada/);
  });

  it('concluir a fase guarda o fragmento, libera a próxima e salva', () => {
    const repo = new MemoryRepository();
    const session = newSession(repo);
    session.newGame('larissa');
    finishAlaska(session);

    expect(session.levelStatus('alasca')).toBe('completed');
    expect(session.levelStatus('inglaterra')).toBe('available');
    expect(session.collectedFragments()).toEqual(['gelo']);
    expect(session.nextLevel()).toBe('inglaterra');

    const reloaded = newSession(repo);
    expect(reloaded.hero).toBe('larissa');
    expect(reloaded.collectedFragments()).toEqual(['gelo']);
  });

  it('novo jogo apaga o progresso, mas mantém as preferências de som', () => {
    const session = newSession();
    session.newGame('joao');
    session.updateSettings({ narration: false });
    finishAlaska(session);

    session.newGame('gabriel');
    expect(session.collectedFragments()).toEqual([]);
    expect(session.settings.narration).toBe(false);
  });

  it('ignora dados salvos corrompidos', () => {
    const repo = new MemoryRepository();
    repo.stored = { hero: 'vilao', completedLevels: 'x', settings: { sound: 'sim' } };
    const session = newSession(repo);
    expect(session.hero).toBeNull();
    expect(session.settings.sound).toBe(true);
  });
});
