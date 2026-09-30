import type { HeroId } from '../core';

/**
 * Todo texto que a criança vê ou ouve. Separado do código para facilitar
 * revisão pedagógica e tradução (o tema é "nações", afinal).
 */
export interface GameText {
  title: string;
  subtitle: string;
  ui: {
    play: string;
    continue: string;
    newGame: string;
    next: string;
    skip: string;
    back: string;
    confirm: string;
    comingSoon: string;
    locked: string;
    rotateDevice: string;
    chooseHero: string;
    heroChosen: (name: string) => string;
    mapTitle: string;
    mapNarration: string;
    fragmentsCollected: (count: number, total: number) => string;
    confirmNewGame: string;
    allFragmentsSoon: string;
    gotItem: (itemName: string) => string;
    continueAdventure: string;
    jump: string;
  };
  heroes: Record<HeroId, { name: string; role: string }>;
  intro: readonly { title: string; narration: string }[];
  /** `the` = nome com artigo, para frases ("o peixe", "as chaves"). */
  items: Record<string, { name: string; the: string }>;
  fragments: Record<string, { name: string }>;
  levels: Record<string, LevelText>;
  hints: {
    findItem: (item: string) => string;
    useItem: (item: string, target: string) => string;
    collectFragment: string;
    wrongItem: string;
    notReady: string;
  };
}

export interface LevelText {
  country: string;
  place: string;
  /** Falas ao entrar na fase. */
  intro: readonly string[];
  /** Nome de cada alvo, com artigo, usado nas dicas ("o Urso Polar"). */
  targets: Record<string, string>;
  /** Falas de eventos específicos da fase. */
  lines: Record<string, string>;
  celebration: string;
}
