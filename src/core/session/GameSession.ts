import type { FragmentId, HeroId, LevelId } from '../domain/ids';
import { Emitter } from '../events/Emitter';
import type { LevelCatalog } from '../levels/LevelCatalog';
import { LevelRun } from '../levels/LevelRun';
import { GlobeAssembly } from '../altar/GlobeAssembly';
import type { SaveRepository } from '../ports/SaveRepository';
import { emptySave, parseSave, type SaveData, type Settings } from './SaveData';

export type LevelStatus = 'locked' | 'available' | 'completed';

export interface GameSessionEvents extends Record<string, unknown> {
  'progress-changed': SaveData;
  'settings-changed': Settings;
}

/**
 * Serviço de aplicação: o ponto de entrada que QUALQUER frontend usa
 * (Phaser hoje; outro motor amanhã). Cuida da campanha e do salvamento.
 */
export class GameSession {
  readonly events = new Emitter<GameSessionEvents>();
  private data: SaveData;

  constructor(
    readonly catalog: LevelCatalog,
    private readonly repository: SaveRepository,
  ) {
    this.data = this.readSave();
  }

  get hero(): HeroId | null {
    return this.data.hero;
  }

  get settings(): Settings {
    return { ...this.data.settings };
  }

  get introSeen(): boolean {
    return this.data.introSeen;
  }

  /** Existe um jogo em andamento para "Continuar"? */
  hasGameInProgress(): boolean {
    return this.data.hero !== null;
  }

  newGame(hero: HeroId): void {
    this.data = { ...emptySave(), hero, settings: this.data.settings };
    this.persist();
  }

  markIntroSeen(): void {
    this.data.introSeen = true;
    this.persist();
  }

  updateSettings(changes: Partial<Settings>): void {
    this.data.settings = { ...this.data.settings, ...changes };
    this.persist();
    this.events.emit('settings-changed', this.settings);
  }

  levelStatus(id: LevelId): LevelStatus {
    if (this.data.completedLevels.includes(id)) return 'completed';
    const prerequisites = this.catalog.prerequisitesOf(id);
    return prerequisites.every((req) => this.data.completedLevels.includes(req)) ? 'available' : 'locked';
  }

  collectedFragments(): readonly FragmentId[] {
    return this.data.fragments;
  }

  allFragmentsCollected(): boolean {
    return this.catalog.fragments().every((fragment) => this.data.fragments.includes(fragment));
  }

  /** Próxima fase a jogar (a primeira disponível), ou null se tudo foi concluído. */
  nextLevel(): LevelId | null {
    return this.catalog.list().find((level) => this.levelStatus(level.id) === 'available')?.id ?? null;
  }

  /**
   * Começa uma tentativa da fase. Quando o fragmento é coletado, a campanha
   * registra a conclusão e salva sozinha — o frontend não precisa lembrar disso.
   */
  startLevel(id: LevelId): LevelRun {
    if (this.levelStatus(id) === 'locked') throw new Error(`A fase "${id}" ainda está bloqueada`);
    const run = new LevelRun(this.catalog.get(id));
    run.events.on('fragment-collected', ({ fragmentId }) => this.completeLevel(id, fragmentId));
    return run;
  }

  get globeRestored(): boolean {
    return this.data.globeRestored;
  }

  /**
   * Começa a montagem do globo no Altar do Mundo. Só é possível com todos os
   * fragmentos; ao completar, a conquista é salva sozinha.
   */
  startAltar(): GlobeAssembly {
    if (!this.allFragmentsCollected()) throw new Error('Ainda faltam fragmentos para o Altar do Mundo');
    const assembly = new GlobeAssembly(this.catalog.fragments());
    assembly.events.on('complete', () => {
      this.data.globeRestored = true;
      this.persist();
    });
    return assembly;
  }

  resetProgress(): void {
    this.repository.clear();
    this.data = { ...emptySave(), settings: this.data.settings };
    this.persist();
  }

  private completeLevel(id: LevelId, fragmentId: FragmentId): void {
    if (!this.data.completedLevels.includes(id)) this.data.completedLevels.push(id);
    if (!this.data.fragments.includes(fragmentId)) this.data.fragments.push(fragmentId);
    this.persist();
  }

  private readSave(): SaveData {
    try {
      return parseSave(this.repository.load());
    } catch {
      return emptySave();
    }
  }

  private persist(): void {
    try {
      this.repository.save(this.data);
    } catch {
      // Sem armazenamento (aba anônima, cota cheia): o jogo continua, só não guarda o progresso.
    }
    this.events.emit('progress-changed', this.data);
  }
}
