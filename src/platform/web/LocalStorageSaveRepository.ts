import type { SaveRepository } from '../../core';

export class LocalStorageSaveRepository implements SaveRepository {
  constructor(private readonly key = 'globo-das-nacoes:save') {}

  load(): unknown {
    const raw = window.localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  save(data: unknown): void {
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear(): void {
    window.localStorage.removeItem(this.key);
  }
}
