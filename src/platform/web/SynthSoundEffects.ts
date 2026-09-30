import type { SoundEffect, SoundEffects } from '../../core';

type Note = { freq: number; at: number; duration: number; type?: OscillatorType; gain?: number; slideTo?: number };

/** Efeitos sonoros provisórios sintetizados na hora (sem arquivos). Troque por áudios gravados depois. */
const EFFECTS: Record<SoundEffect, Note[]> = {
  tap: [{ freq: 660, at: 0, duration: 0.06, type: 'triangle', gain: 0.15 }],
  pickup: [
    { freq: 784, at: 0, duration: 0.09, type: 'triangle' },
    { freq: 1175, at: 0.08, duration: 0.14, type: 'triangle' },
  ],
  success: [
    { freq: 523, at: 0, duration: 0.12, type: 'triangle' },
    { freq: 659, at: 0.1, duration: 0.12, type: 'triangle' },
    { freq: 784, at: 0.2, duration: 0.22, type: 'triangle' },
  ],
  wrong: [{ freq: 220, at: 0, duration: 0.25, type: 'sine', slideTo: 160, gain: 0.2 }],
  locked: [
    { freq: 300, at: 0, duration: 0.08, type: 'square', gain: 0.08 },
    { freq: 300, at: 0.12, duration: 0.08, type: 'square', gain: 0.08 },
  ],
  fragment: [
    { freq: 523, at: 0, duration: 0.15, type: 'triangle' },
    { freq: 659, at: 0.12, duration: 0.15, type: 'triangle' },
    { freq: 784, at: 0.24, duration: 0.15, type: 'triangle' },
    { freq: 1047, at: 0.36, duration: 0.45, type: 'triangle' },
    { freq: 1568, at: 0.4, duration: 0.4, type: 'sine', gain: 0.08 },
  ],
  // Apito do diretor.
  alert: [
    { freq: 1760, at: 0, duration: 0.12, type: 'square', gain: 0.07 },
    { freq: 1760, at: 0.16, duration: 0.3, type: 'square', gain: 0.07, slideTo: 1600 },
  ],
  unlock: [
    { freq: 900, at: 0, duration: 0.05, type: 'square', gain: 0.08 },
    { freq: 600, at: 0.07, duration: 0.07, type: 'square', gain: 0.08 },
    { freq: 1200, at: 0.2, duration: 0.18, type: 'triangle' },
  ],
  powerdown: [{ freq: 440, at: 0, duration: 0.9, type: 'sawtooth', slideTo: 40, gain: 0.12 }],
  powerup: [
    { freq: 60, at: 0, duration: 0.7, type: 'sawtooth', slideTo: 520, gain: 0.1 },
    { freq: 1047, at: 0.65, duration: 0.3, type: 'triangle' },
  ],
  // "He-he-he" do ladrão.
  laugh: [0, 0.14, 0.28].map((at, i) => ({ freq: 520 - i * 40, at, duration: 0.09, type: 'square' as OscillatorType, gain: 0.06 })),
  beep: [{ freq: 988, at: 0, duration: 0.08, type: 'sine', gain: 0.15 }],
  roar: [
    { freq: 180, at: 0, duration: 0.7, type: 'sawtooth', slideTo: 80, gain: 0.14 },
    { freq: 120, at: 0.05, duration: 0.6, type: 'square', slideTo: 60, gain: 0.05 },
  ],
  munch: [0, 0.12, 0.24].map((at) => ({ freq: 240, at, duration: 0.06, type: 'square' as OscillatorType, gain: 0.07 })),
  growl: [{ freq: 110, at: 0, duration: 0.5, type: 'sawtooth', slideTo: 70, gain: 0.12 }],
  snore: [
    { freq: 90, at: 0, duration: 0.6, type: 'sine', slideTo: 140, gain: 0.25 },
    { freq: 140, at: 0.7, duration: 0.6, type: 'sine', slideTo: 80, gain: 0.2 },
  ],
};

export class SynthSoundEffects implements SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled = true;

  play(effect: SoundEffect): void {
    if (!this.enabled) return;
    const ctx = this.context();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (const note of EFFECTS[effect]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + note.at;
      const end = start + note.duration;
      osc.type = note.type ?? 'sine';
      osc.frequency.setValueAtTime(note.freq, start);
      if (note.slideTo) osc.frequency.exponentialRampToValueAtTime(note.slideTo, end);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(note.gain ?? 0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private context(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    // Navegadores só liberam o áudio depois de um toque; o play() sempre vem de um toque.
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }
}
