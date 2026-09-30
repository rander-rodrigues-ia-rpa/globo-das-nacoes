// Ponto de composição: aqui as peças são ligadas. Trocar o frontend (Phaser)
// ou a plataforma (web → app nativo) significa trocar só o que é montado aqui.
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import { CAMPAIGN_LEVELS, GameSession, LevelCatalog } from './core';
import { loadText } from './content';
import { LocalStorageSaveRepository } from './platform/web/LocalStorageSaveRepository';
import { SpeechNarrator } from './platform/web/SpeechNarrator';
import { SynthSoundEffects } from './platform/web/SynthSoundEffects';
import { createGame } from './ui-phaser/createGame';

async function start(): Promise<void> {
  const text = loadText();
  const session = new GameSession(new LevelCatalog(CAMPAIGN_LEVELS), new LocalStorageSaveRepository());
  const narrator = new SpeechNarrator('pt-BR');
  const sfx = new SynthSoundEffects();
  narrator.setEnabled(session.settings.narration);
  sfx.setEnabled(session.settings.sound);

  document.title = text.title;
  const rotate = document.getElementById('rotate-hint');
  if (rotate) rotate.textContent = text.ui.rotateDevice;

  // Espera a fonte carregar para os textos do jogo não "piscarem" com outra fonte.
  await Promise.race([
    Promise.all([document.fonts.load('700 32px "Baloo 2"'), document.fonts.load('800 32px "Baloo 2"')]),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);

  const game = createGame('game', { session, narrator, sfx, text });
  if (import.meta.env.DEV) {
    // Acesso de depuração pelo console do navegador (só em desenvolvimento).
    Object.assign(window, { __game: game, __session: session });
  }
}

void start();
