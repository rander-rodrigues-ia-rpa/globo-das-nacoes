import { isHeroId } from '../domain/heroes';
import type { FragmentId, HeroId, LevelId } from '../domain/ids';

export const SAVE_VERSION = 1;

export interface Settings {
  narration: boolean;
  sound: boolean;
}

export interface SaveData {
  version: typeof SAVE_VERSION;
  hero: HeroId | null;
  introSeen: boolean;
  completedLevels: LevelId[];
  fragments: FragmentId[];
  settings: Settings;
}

export function emptySave(): SaveData {
  return {
    version: SAVE_VERSION,
    hero: null,
    introSeen: false,
    completedLevels: [],
    fragments: [],
    settings: { narration: true, sound: true },
  };
}

/** Lê dados salvos com tolerância: qualquer campo estranho volta ao padrão em vez de quebrar o jogo. */
export function parseSave(raw: unknown): SaveData {
  const base = emptySave();
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Record<string, unknown>;
  const strings = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []);
  const settings = (data.settings ?? {}) as Record<string, unknown>;

  return {
    version: SAVE_VERSION,
    hero: isHeroId(data.hero) ? data.hero : null,
    introSeen: data.introSeen === true,
    completedLevels: [...new Set(strings(data.completedLevels))],
    fragments: [...new Set(strings(data.fragments))],
    settings: {
      narration: typeof settings.narration === 'boolean' ? settings.narration : base.settings.narration,
      sound: typeof settings.sound === 'boolean' ? settings.sound : base.settings.sound,
    },
  };
}
