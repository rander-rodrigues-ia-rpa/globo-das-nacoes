import type { FragmentId, ItemId, LevelId, PickupId, TargetId } from '../domain/ids';

/**
 * Toda fase segue o "Ciclo do Aventureiro" do documento de design:
 * explorar → encontrar o obstáculo → usar o item certo → coletar o fragmento.
 *
 * O roteiro (LevelScript) descreve esse quebra-cabeça só com dados. O frontend
 * decide COMO cada passo aparece na tela (andar, arrastar, lanterna...),
 * mas quem decide SE o passo é válido é sempre o núcleo.
 */
export interface LevelDefinition {
  id: LevelId;
  /** Ordem na campanha. A fase N é liberada quando as anteriores são concluídas. */
  order: number;
  fragmentId: FragmentId;
  /** Substitui a regra padrão de desbloqueio (fase anterior concluída). */
  requires?: readonly LevelId[];
  script: LevelScript;
}

export interface LevelScript {
  /** Itens espalhados pelo cenário. */
  pickups: readonly PickupDefinition[];
  /** Coisas do cenário que mudam de estado: vilões, portas, armários... */
  targets: readonly TargetDefinition[];
  /** "Usar o item X no alvo Y quando ele estiver no estado A leva ao estado B." */
  interactions: readonly InteractionRule[];
  /** Estados necessários para o fragmento ficar disponível. */
  fragmentRequires: readonly TargetCondition[];
}

export interface PickupDefinition {
  id: PickupId;
  item: ItemId;
}

export interface TargetDefinition {
  id: TargetId;
  initialState: string;
}

export interface TargetCondition {
  target: TargetId;
  state: string;
}

export interface InteractionRule {
  target: TargetId;
  item: ItemId;
  from: string;
  to: string;
  /** O item some do inventário ao ser usado (ex.: o peixe é comido). Padrão: true. */
  consumesItem?: boolean;
  /** Outras condições que precisam valer antes (ex.: diretor distraído antes de abrir o armário). */
  requires?: readonly TargetCondition[];
}
