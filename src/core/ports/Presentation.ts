/**
 * Serviços de apresentação que qualquer frontend usa, mas cuja implementação
 * depende da plataforma (navegador, app nativo...).
 */

/** Narração em voz: essencial para crianças que ainda não leem bem. */
export interface Narrator {
  speak(text: string): void;
  stop(): void;
  setEnabled(enabled: boolean): void;
}

export type SoundEffect =
  | 'tap'
  | 'pickup'
  | 'success'
  | 'wrong'
  | 'fragment'
  | 'growl'
  | 'snore'
  | 'locked'
  | 'alert'
  | 'unlock'
  | 'powerdown'
  | 'powerup'
  | 'laugh'
  | 'beep';

export interface SoundEffects {
  play(effect: SoundEffect): void;
  setEnabled(enabled: boolean): void;
}
