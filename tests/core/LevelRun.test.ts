import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LEVELS, LevelCatalog, LevelRun } from '../../src/core';

const catalog = new LevelCatalog(CAMPAIGN_LEVELS);

describe('LevelRun — Alasca', () => {
  it('segue o ciclo: pegar o peixe → dar ao urso → coletar o fragmento', () => {
    const run = new LevelRun(catalog.get('alasca'));
    const events: string[] = [];
    run.events.on('item-picked', () => events.push('item-picked'));
    run.events.on('fragment-available', () => events.push('fragment-available'));
    run.events.on('fragment-collected', () => events.push('fragment-collected'));

    expect(run.nextHint()).toEqual({ kind: 'find-item', item: 'peixe', pickup: 'peixe-do-buraco-no-gelo' });
    expect(run.useItem('peixe', 'urso')).toEqual({ kind: 'no-item', item: 'peixe' });
    expect(run.collectFragment()).toBe(false);

    expect(run.pickUp('peixe-do-buraco-no-gelo')).toBe(true);
    expect(run.pickUp('peixe-do-buraco-no-gelo')).toBe(false);
    expect(run.nextHint()).toEqual({ kind: 'use-item', item: 'peixe', target: 'urso' });
    expect(run.usableItemsFor('urso')).toEqual(['peixe']);

    const result = run.useItem('peixe', 'urso');
    expect(result.kind).toBe('success');
    expect(run.stateOf('urso')).toBe('dormindo');
    expect(run.hasItem('peixe')).toBe(false); // o urso comeu
    expect(run.nextHint()).toEqual({ kind: 'collect-fragment' });

    expect(run.collectFragment()).toBe(true);
    expect(run.nextHint()).toEqual({ kind: 'done' });
    expect(events).toEqual(['item-picked', 'fragment-available', 'fragment-collected']);
  });
});

describe('LevelRun — Inglaterra (condições encadeadas)', () => {
  it('só abre o armário depois de distrair o diretor com a lanterna', () => {
    const run = new LevelRun(catalog.get('inglaterra'));
    run.pickUp('chaves-perdidas');

    const early = run.useItem('chaves', 'armario');
    expect(early.kind).toBe('not-ready');
    expect(run.useItem('chaves', 'janela').kind).toBe('wrong-item');
    expect(run.nextHint()).toEqual({ kind: 'find-item', item: 'lanterna', pickup: 'lanterna-da-sala' });

    run.pickUp('lanterna-da-sala');
    const changes: string[] = [];
    run.events.on('target-changed', ({ target, to }) => changes.push(`${target}:${to}`));
    expect(run.useItem('lanterna', 'janela').kind).toBe('success');
    // efeito colateral: os sinais na janela distraem o diretor
    expect(changes).toEqual(['janela:sinalizando', 'diretor:distraido']);
    expect(run.stateOf('diretor')).toBe('distraido');
    expect(run.hasItem('lanterna')).toBe(false); // fica piscando na janela
    expect(run.nextHint()).toEqual({ kind: 'use-item', item: 'chaves', target: 'armario' });
    expect(run.useItem('chaves', 'armario').kind).toBe('success');
    expect(run.isFragmentAvailable()).toBe(true);
  });
});
