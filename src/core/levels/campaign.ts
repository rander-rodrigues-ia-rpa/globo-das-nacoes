import type { LevelDefinition } from './LevelDefinition';

/**
 * As cinco fases do pitch "O Mistério do Globo das Nações".
 * Os roteiros seguem o slide "O Arsenal do Aventureiro": obstáculo → item → fragmento.
 * Textos e falas ficam em src/content; aqui só há regras.
 */
export const CAMPAIGN_LEVELS: readonly LevelDefinition[] = [
  {
    id: 'alasca',
    order: 1,
    fragmentId: 'gelo',
    script: {
      pickups: [{ id: 'peixe-do-buraco-no-gelo', item: 'peixe' }],
      targets: [{ id: 'urso', initialState: 'bloqueando' }],
      interactions: [{ target: 'urso', item: 'peixe', from: 'bloqueando', to: 'dormindo' }],
      fragmentRequires: [{ target: 'urso', state: 'dormindo' }],
    },
  },
  {
    id: 'inglaterra',
    order: 2,
    fragmentId: 'conhecimento',
    script: {
      pickups: [
        { id: 'chaves-perdidas', item: 'chaves' },
        { id: 'lanterna-da-sala', item: 'lanterna' },
      ],
      targets: [
        { id: 'janela', initialState: 'escura' },
        { id: 'diretor', initialState: 'vigiando' },
        { id: 'armario', initialState: 'trancado' },
      ],
      interactions: [
        // A lanterna fica piscando na janela e o Diretor Mau vai olhar lá fora.
        {
          target: 'janela',
          item: 'lanterna',
          from: 'escura',
          to: 'sinalizando',
          effects: [{ target: 'diretor', state: 'distraido' }],
        },
        {
          target: 'armario',
          item: 'chaves',
          from: 'trancado',
          to: 'aberto',
          requires: [{ target: 'diretor', state: 'distraido' }],
        },
      ],
      fragmentRequires: [{ target: 'armario', state: 'aberto' }],
    },
  },
  {
    id: 'dubai',
    order: 3,
    fragmentId: 'brilho',
    script: {
      pickups: [
        { id: 'lanterna-do-balcao', item: 'lanterna' },
        { id: 'celular-perdido', item: 'celular' },
      ],
      targets: [
        { id: 'pegadas', initialState: 'invisiveis' },
        { id: 'gerador', initialState: 'desligado' },
        { id: 'ladrao', initialState: 'fugindo' },
      ],
      interactions: [
        // A lanterna fica acesa (não é consumida) e revela as pegadas do ladrão.
        { target: 'pegadas', item: 'lanterna', from: 'invisiveis', to: 'reveladas', consumesItem: false },
        // O celular liga os geradores; o clarão assusta o ladrão, que larga o fragmento.
        {
          target: 'gerador',
          item: 'celular',
          from: 'desligado',
          to: 'ligado',
          requires: [{ target: 'pegadas', state: 'reveladas' }],
          effects: [{ target: 'ladrao', state: 'assustado' }],
        },
      ],
      fragmentRequires: [{ target: 'ladrao', state: 'assustado' }],
    },
  },
  {
    id: 'africa',
    order: 4,
    fragmentId: 'natureza',
    script: {
      pickups: [
        { id: 'bife', item: 'bife' },
        { id: 'frutas', item: 'frutas' },
      ],
      targets: [
        { id: 'trilha', initialState: 'vazia' },
        { id: 'leoes', initialState: 'guardando' },
      ],
      interactions: [
        { target: 'trilha', item: 'frutas', from: 'vazia', to: 'com-frutas' },
        { target: 'leoes', item: 'bife', from: 'guardando', to: 'atraidos', requires: [{ target: 'trilha', state: 'com-frutas' }] },
      ],
      fragmentRequires: [{ target: 'leoes', state: 'atraidos' }],
    },
  },
  {
    id: 'brasil',
    order: 5,
    fragmentId: 'alegria',
    script: {
      pickups: [{ id: 'super-balde', item: 'super-balde' }],
      targets: [{ id: 'capitao', initialState: 'bloqueando' }],
      interactions: [{ target: 'capitao', item: 'super-balde', from: 'bloqueando', to: 'molhado' }],
      fragmentRequires: [{ target: 'capitao', state: 'molhado' }],
    },
  },
];
