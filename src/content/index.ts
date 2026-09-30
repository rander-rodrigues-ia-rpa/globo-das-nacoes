import { ptBR } from './pt-BR';
import type { GameText } from './types';

export type { GameText, LevelText } from './types';

export function loadText(): GameText {
  return ptBR;
}
