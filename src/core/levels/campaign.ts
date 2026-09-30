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
        { id: 'bife-da-caixa-termica', item: 'bife' },
        { id: 'frutas-da-mangueira', item: 'frutas' },
      ],
      targets: [
        { id: 'trilha-perto', initialState: 'vazia' },
        { id: 'trilha-longe', initialState: 'vazia' },
        { id: 'leoes', initialState: 'guardando' },
      ],
      // "Trail building": a comida vai no chão, formando uma trilha que começa
      // perto dos leões e termina longe da clareira. Qualquer comida serve.
      interactions: [
        ...(['bife', 'frutas'] as const).map((item) => ({ target: 'trilha-perto', item, from: 'vazia', to: 'com-comida' })),
        ...(['bife', 'frutas'] as const).map((item) => ({
          target: 'trilha-longe',
          item,
          from: 'vazia',
          to: 'com-comida',
          requires: [{ target: 'trilha-perto', state: 'com-comida' }],
          effects: [{ target: 'leoes', state: 'atraidos' }],
        })),
      ],
      fragmentRequires: [{ target: 'leoes', state: 'atraidos' }],
    },
  },
  {
    id: 'brasil',
    order: 5,
    fragmentId: 'alegria',
    script: {
      // A escalada da torre (desviando dos caixotes) é mecânica do frontend;
      // a regra é simples: um banho do Super Balde tira o Capitão do caminho.
      pickups: [{ id: 'super-balde-do-quiosque', item: 'super-balde' }],
      targets: [{ id: 'capitao', initialState: 'bloqueando' }],
      interactions: [{ target: 'capitao', item: 'super-balde', from: 'bloqueando', to: 'molhado' }],
      fragmentRequires: [{ target: 'capitao', state: 'molhado' }],
    },
  },
];
