# O Mistério do Globo das Nações

Jogo de aventura infantil (5 a 10 anos) para **navegador, tablet e celular**.
Uma tempestade mágica partiu o Globo das Nações em 5 fragmentos; a criança escolhe
um herói (João, Gabriel ou Larissa) e viaja pelo mundo para recuperá-los.

> Documentos de origem (pitch e roteiro): [`docs/referencias/`](docs/referencias/)

## Estado atual

| Parte | Situação |
|---|---|
| Tela inicial, escolha do herói, introdução da história | ✅ |
| Mapa-múndi com liberação das fases em sequência | ✅ |
| **Fase 1 — Alasca** (peixe → urso dorme → Fragmento de Gelo) | ✅ jogável |
| **Fase 2 — Inglaterra** (chaves + lanterna, furtividade com o Diretor Mau → Fragmento do Conhecimento) | ✅ jogável |
| Fases 3 a 5 (Dubai, África, Brasil) | regras prontas no núcleo; cenas "em breve" |
| Altar do Mundo e epílogo | a fazer |
| Arte e sons | **provisórios** (SVG gerado + voz sintetizada do aparelho) |

## Como rodar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm test           # testes do núcleo
npm run build      # gera a versão publicável em dist/
```

O `dist/` é um site estático: pode ir para GitHub Pages, Netlify, itch.io ou ser
empacotado como app com Capacitor.

## Controles

| | Toque / mouse | Teclado |
|---|---|---|
| Andar | tocar no chão | setas ou WASD |
| Usar item | arrastar o item até o personagem, ou tocar no item e depois no personagem | 1–4 escolhe o item, Espaço/Enter usa no mais próximo |
| Dica | botão da lâmpada | H |
| Voltar ao mapa | botão da casa | Esc |

Se a criança ficar 25 segundos sem avançar, a dica aparece sozinha.

## Arquitetura

Resumo abaixo; detalhes e passo a passo para novas fases em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

```
src/
  core/         regras do jogo — TypeScript puro, sem Phaser e sem navegador
  content/      textos e narração (pt-BR), separados do código
  platform/web/ salvamento (localStorage), voz (Web Speech) e sons (Web Audio)
  ui-phaser/    frontend atual (Phaser 4) — a camada substituível
  main.ts       ponto de composição: liga as peças
public/assets/  arte (provisória, gerada por scripts/placeholder-art.mjs)
```

Um teste automático (`tests/core/architecture.test.ts`) impede que o núcleo
passe a depender do Phaser ou do navegador.

## Arte provisória

`npm run art` gera os SVGs em `public/assets/sprites/`. Para usar a arte final,
substitua os arquivos (mesmo nome) ou ajuste o manifesto em `src/ui-phaser/assets.ts`.
