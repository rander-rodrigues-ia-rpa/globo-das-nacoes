import type { FragmentId } from '../domain/ids';
import { Emitter } from '../events/Emitter';

export type PlaceResult = 'placed' | 'wrong-slot' | 'already-placed' | 'unknown-fragment';

export interface GlobeAssemblyEvents extends Record<string, unknown> {
  placed: { fragment: FragmentId; placedCount: number };
  complete: { fragments: readonly FragmentId[] };
}

/**
 * O Altar do Mundo: cada fragmento tem o seu encaixe no globo (o de mesma cor).
 * Quando todos estão no lugar, o globo se completa. Funciona com qualquer
 * quantidade de fragmentos — fases novas ganham encaixe automaticamente.
 */
export class GlobeAssembly {
  readonly events = new Emitter<GlobeAssemblyEvents>();
  private readonly placed = new Set<FragmentId>();

  constructor(readonly fragments: readonly FragmentId[]) {}

  /** Tenta encaixar o fragmento no encaixe `slot` (o id do fragmento daquele encaixe). */
  place(fragment: FragmentId, slot: FragmentId): PlaceResult {
    if (!this.fragments.includes(fragment)) return 'unknown-fragment';
    if (this.placed.has(fragment)) return 'already-placed';
    if (fragment !== slot) return 'wrong-slot';
    this.placed.add(fragment);
    this.events.emit('placed', { fragment, placedCount: this.placed.size });
    if (this.isComplete()) this.events.emit('complete', { fragments: this.fragments });
    return 'placed';
  }

  isPlaced(fragment: FragmentId): boolean {
    return this.placed.has(fragment);
  }

  get placedCount(): number {
    return this.placed.size;
  }

  isComplete(): boolean {
    return this.fragments.length > 0 && this.fragments.every((f) => this.placed.has(f));
  }

  /** Próximo fragmento que falta (para dicas e para o teclado). */
  nextToPlace(): FragmentId | null {
    return this.fragments.find((f) => !this.placed.has(f)) ?? null;
  }
}
