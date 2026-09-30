import { Emitter } from '../events/Emitter';
import type { ItemId, PickupId, TargetId } from '../domain/ids';
import type { InteractionRule, LevelDefinition, TargetCondition } from './LevelDefinition';

export type UseItemResult =
  | { kind: 'success'; target: TargetId; item: ItemId; from: string; to: string }
  /** A criança não tem esse item. */
  | { kind: 'no-item'; item: ItemId }
  /** Esse item não serve para esse alvo (neste momento ou nunca). */
  | { kind: 'wrong-item'; target: TargetId; item: ItemId }
  /** O item é o certo, mas falta fazer outra coisa antes. */
  | { kind: 'not-ready'; target: TargetId; item: ItemId; missing: readonly TargetCondition[] };

export type Hint =
  | { kind: 'find-item'; item: ItemId; pickup: PickupId }
  | { kind: 'use-item'; item: ItemId; target: TargetId }
  | { kind: 'collect-fragment' }
  | { kind: 'done' };

export interface LevelRunEvents extends Record<string, unknown> {
  'item-picked': { pickup: PickupId; item: ItemId };
  'item-used': Extract<UseItemResult, { kind: 'success' }>;
  'target-changed': { target: TargetId; from: string; to: string };
  'fragment-available': { fragmentId: string };
  'fragment-collected': { fragmentId: string };
}

/**
 * Estado de uma tentativa de fase em andamento. Regra pura: não sabe nada de
 * tela, som ou entrada — o frontend chama os métodos e escuta os eventos.
 */
export class LevelRun {
  readonly events = new Emitter<LevelRunEvents>();
  private readonly collected = new Set<PickupId>();
  private readonly inventory: ItemId[] = [];
  private readonly targetStates = new Map<TargetId, string>();
  private fragmentCollected = false;
  private fragmentAnnounced = false;

  constructor(readonly definition: LevelDefinition) {
    for (const target of definition.script.targets) {
      this.targetStates.set(target.id, target.initialState);
    }
  }

  get items(): readonly ItemId[] {
    return this.inventory;
  }

  hasItem(item: ItemId): boolean {
    return this.inventory.includes(item);
  }

  isPickedUp(pickup: PickupId): boolean {
    return this.collected.has(pickup);
  }

  stateOf(target: TargetId): string {
    const state = this.targetStates.get(target);
    if (state === undefined) throw new Error(`Alvo desconhecido na fase "${this.definition.id}": ${target}`);
    return state;
  }

  pickUp(pickupId: PickupId): boolean {
    if (this.collected.has(pickupId)) return false;
    const pickup = this.definition.script.pickups.find((p) => p.id === pickupId);
    if (!pickup) throw new Error(`Item de cenário desconhecido na fase "${this.definition.id}": ${pickupId}`);
    this.collected.add(pickupId);
    this.inventory.push(pickup.item);
    this.events.emit('item-picked', { pickup: pickupId, item: pickup.item });
    return true;
  }

  /** Diz, sem alterar nada, o que aconteceria ao usar o item no alvo. */
  previewUse(item: ItemId, target: TargetId): UseItemResult {
    if (!this.hasItem(item)) return { kind: 'no-item', item };
    const current = this.stateOf(target);
    const candidates = this.definition.script.interactions.filter(
      (rule) => rule.target === target && rule.item === item && rule.from === current,
    );
    if (candidates.length === 0) return { kind: 'wrong-item', target, item };

    const ready = candidates.find((rule) => this.missingConditions(rule).length === 0);
    if (!ready) {
      return { kind: 'not-ready', target, item, missing: this.missingConditions(candidates[0]!) };
    }
    return { kind: 'success', target, item, from: ready.from, to: ready.to };
  }

  useItem(item: ItemId, target: TargetId): UseItemResult {
    const result = this.previewUse(item, target);
    if (result.kind !== 'success') return result;

    const rule = this.findRule(result);
    if (rule.consumesItem ?? true) {
      this.inventory.splice(this.inventory.indexOf(item), 1);
    }
    this.targetStates.set(target, result.to);
    this.events.emit('item-used', result);
    this.events.emit('target-changed', { target, from: result.from, to: result.to });
    if (this.isFragmentAvailable() && !this.fragmentAnnounced) {
      this.fragmentAnnounced = true;
      this.events.emit('fragment-available', { fragmentId: this.definition.fragmentId });
    }
    return result;
  }

  /** Itens que têm alguma utilidade no alvo, no estado atual — usado no toque rápido e no teclado. */
  usableItemsFor(target: TargetId): ItemId[] {
    return [...new Set(this.inventory)].filter((item) => this.previewUse(item, target).kind === 'success');
  }

  isFragmentAvailable(): boolean {
    return this.definition.script.fragmentRequires.every((c) => this.stateOf(c.target) === c.state);
  }

  isFragmentCollected(): boolean {
    return this.fragmentCollected;
  }

  collectFragment(): boolean {
    if (this.fragmentCollected || !this.isFragmentAvailable()) return false;
    this.fragmentCollected = true;
    this.events.emit('fragment-collected', { fragmentId: this.definition.fragmentId });
    return true;
  }

  /** Próximo passo sugerido para uma criança que empacou. */
  nextHint(): Hint {
    if (this.fragmentCollected) return { kind: 'done' };
    if (this.isFragmentAvailable()) return { kind: 'collect-fragment' };

    const { interactions, pickups } = this.definition.script;
    // Interações que já podem acontecer agora, na ordem em que foram declaradas no roteiro.
    const ready = interactions.filter(
      (rule) => this.stateOf(rule.target) === rule.from && this.missingConditions(rule).length === 0,
    );

    for (const rule of ready) {
      if (this.hasItem(rule.item)) return { kind: 'use-item', item: rule.item, target: rule.target };
      const pickup = pickups.find((p) => p.item === rule.item && !this.collected.has(p.id));
      if (pickup) return { kind: 'find-item', item: rule.item, pickup: pickup.id };
    }
    // Nada disponível agora: sugere pegar qualquer item que ainda falte.
    const remaining = pickups.find((p) => !this.collected.has(p.id));
    if (remaining) return { kind: 'find-item', item: remaining.item, pickup: remaining.id };
    return { kind: 'done' };
  }

  private missingConditions(rule: InteractionRule): TargetCondition[] {
    return (rule.requires ?? []).filter((c) => this.stateOf(c.target) !== c.state);
  }

  private findRule(result: Extract<UseItemResult, { kind: 'success' }>): InteractionRule {
    const rule = this.definition.script.interactions.find(
      (r) => r.target === result.target && r.item === result.item && r.from === result.from && r.to === result.to,
    );
    if (!rule) throw new Error('Regra de interação não encontrada');
    return rule;
  }
}
