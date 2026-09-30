/**
 * Porta de persistência. O núcleo não sabe se o jogo é salvo no localStorage,
 * num arquivo do app nativo ou na nuvem — só conhece esta interface.
 */
export interface SaveRepository {
  load(): unknown;
  save(data: unknown): void;
  clear(): void;
}
