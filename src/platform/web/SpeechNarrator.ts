import type { Narrator } from '../../core';

/**
 * Narração provisória com a voz sintetizada do próprio aparelho (Web Speech API).
 * Quando houver locução gravada, basta trocar por um narrador que toca arquivos de áudio.
 */
export class SpeechNarrator implements Narrator {
  private enabled = true;
  private voice: SpeechSynthesisVoice | null = null;
  private readonly synth: SpeechSynthesis | null = 'speechSynthesis' in window ? window.speechSynthesis : null;

  constructor(private readonly lang = 'pt-BR') {
    if (!this.synth) return;
    this.pickVoice();
    this.synth.addEventListener?.('voiceschanged', () => this.pickVoice());
  }

  speak(text: string): void {
    if (!this.enabled || !this.synth) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth?.cancel();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stop();
  }

  private pickVoice(): void {
    const voices = this.synth?.getVoices() ?? [];
    const lang = this.lang.toLowerCase();
    this.voice =
      voices.find((v) => v.lang.toLowerCase() === lang) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2))) ??
      null;
  }
}
