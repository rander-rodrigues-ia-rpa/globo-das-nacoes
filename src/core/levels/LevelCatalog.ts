import type { FragmentId, LevelId } from '../domain/ids';
import type { LevelDefinition } from './LevelDefinition';

/** Registro das fases da campanha. Adicionar uma fase = registrar mais uma definição. */
export class LevelCatalog {
  private readonly levels = new Map<LevelId, LevelDefinition>();

  constructor(definitions: readonly LevelDefinition[] = []) {
    definitions.forEach((definition) => this.register(definition));
  }

  register(definition: LevelDefinition): this {
    if (this.levels.has(definition.id)) throw new Error(`Fase duplicada: ${definition.id}`);
    const problems = validateLevel(definition);
    if (problems.length > 0) {
      throw new Error(`Fase "${definition.id}" inválida:\n- ${problems.join('\n- ')}`);
    }
    this.levels.set(definition.id, definition);
    return this;
  }

  get(id: LevelId): LevelDefinition {
    const level = this.levels.get(id);
    if (!level) throw new Error(`Fase desconhecida: ${id}`);
    return level;
  }

  has(id: LevelId): boolean {
    return this.levels.has(id);
  }

  /** Fases em ordem de campanha. */
  list(): LevelDefinition[] {
    return [...this.levels.values()].sort((a, b) => a.order - b.order);
  }

  fragments(): FragmentId[] {
    return this.list().map((level) => level.fragmentId);
  }

  /** Fases que precisam estar concluídas para liberar esta. */
  prerequisitesOf(id: LevelId): readonly LevelId[] {
    const level = this.get(id);
    if (level.requires) return level.requires;
    const previous = this.list().filter((other) => other.order < level.order);
    const last = previous[previous.length - 1];
    return last ? [last.id] : [];
  }
}

/** Confere se o roteiro da fase é coerente. Pega erros de digitação ao criar fases novas. */
export function validateLevel(level: LevelDefinition): string[] {
  const problems: string[] = [];
  const { pickups, targets, interactions, fragmentRequires } = level.script;
  const targetIds = new Set(targets.map((t) => t.id));
  const obtainable = new Set(pickups.map((p) => p.item));

  const duplicates = (ids: string[]) => ids.filter((id, index) => ids.indexOf(id) !== index);
  duplicates(pickups.map((p) => p.id)).forEach((id) => problems.push(`item de cenário repetido: ${id}`));
  duplicates(targets.map((t) => t.id)).forEach((id) => problems.push(`alvo repetido: ${id}`));

  const checkTarget = (target: string, where: string) => {
    if (!targetIds.has(target)) problems.push(`${where} cita o alvo inexistente "${target}"`);
  };

  interactions.forEach((rule, index) => {
    const where = `interação #${index + 1}`;
    checkTarget(rule.target, where);
    if (!obtainable.has(rule.item)) problems.push(`${where} usa o item "${rule.item}", que não existe no cenário`);
    rule.requires?.forEach((c) => checkTarget(c.target, where));
    rule.effects?.forEach((c) => checkTarget(c.target, where));
  });
  fragmentRequires.forEach((c) => checkTarget(c.target, 'fragmentRequires'));

  // Cada estado exigido pelo fragmento precisa ser alcançável (inicial ou destino de alguma regra).
  fragmentRequires.forEach((c) => {
    const initial = targets.find((t) => t.id === c.target)?.initialState;
    const reachable =
      initial === c.state ||
      interactions.some(
        (r) => (r.target === c.target && r.to === c.state) || r.effects?.some((e) => e.target === c.target && e.state === c.state),
      );
    if (!reachable) problems.push(`o estado "${c.state}" do alvo "${c.target}" nunca é alcançado`);
  });

  return problems;
}
