# Arquitetura

## Objetivos

1. **Trocar o frontend no futuro** (outro motor, React, app nativo) sem reescrever as regras.
2. **Adicionar fases novas** sem mexer nas existentes.
3. Manter o jogo simples de testar: as regras rodam em testes sem abrir o navegador.

## Camadas

```
            ┌──────────────────────────────────────────┐
            │ main.ts (composição)                     │
            └──────┬───────────────┬───────────────────┘
                   │               │
     ┌─────────────▼───┐   ┌───────▼──────────┐
     │ ui-phaser/      │   │ platform/web/    │   ← podem ser trocadas
     │ cenas, HUD,     │   │ localStorage,    │
     │ animações       │   │ voz, sons        │
     └───────┬─────────┘   └───────┬──────────┘
             │ usa                 │ implementa portas
     ┌───────▼─────────────────────▼──────────┐
     │ core/  (regras)      content/ (textos) │   ← não dependem de nada externo
     └────────────────────────────────────────┘
```

| Pasta | Responsabilidade | Pode importar |
|---|---|---|
| `src/core` | Regras: catálogo de fases, quebra-cabeça de cada fase (`LevelRun`), campanha e salvamento (`GameSession`), portas (`SaveRepository`, `Narrator`, `SoundEffects`) | nada externo |
| `src/content` | Todo texto falado/mostrado, por idioma | `core` (só tipos) |
| `src/platform/web` | Implementações das portas para navegador | `core` |
| `src/ui-phaser` | Desenho, animação e entrada (toque/teclado) | `core`, `content` |
| `src/main.ts` | Monta tudo | tudo |

### Núcleo (`src/core`)

- **`LevelDefinition`**: cada fase é um *roteiro de dados* no formato do "Ciclo do Aventureiro":
  itens no cenário (`pickups`), coisas que mudam de estado (`targets`), regras
  "usar item X no alvo Y" (`interactions`) e as condições para o fragmento aparecer.
  Uma regra pode exigir outros estados antes (`requires`) e mudar outros alvos junto
  (`effects`) — ex.: sinais na janela deixam o diretor `distraido`.
- **`LevelRun`**: executa uma tentativa da fase. Responde se usar um item deu certo,
  se foi o item errado ou se "ainda falta algo antes", e calcula **dicas** (`nextHint`).
- **`LevelCatalog`**: registro das fases com **validação** (erros de digitação no roteiro
  viram erro na hora de registrar, não um bug escondido no jogo).
- **`GameSession`**: herói escolhido, fases liberadas/concluídas, fragmentos e preferências.
  Salva sozinha quando um fragmento é coletado.

### Frontend (`src/ui-phaser`)

- **`BaseLevelScene`**: tudo que se repete nas fases — andar, pegar itens, arrastar item
  até o alvo, dicas com seta e câmera, revelar e coletar o fragmento, comemoração.
- **Cena de cada fase** (ex.: `AlaskaScene`): só desenha o cenário e anima os momentos
  especiais (o urso comendo e dormindo). Toda decisão de regra passa pelo `LevelRun`.
- **`levels/registry.ts`**: liga cada fase do catálogo à sua cena, posição no mapa e cor.

## Como adicionar uma fase nova

1. **Regras** — em `src/core/levels/campaign.ts`, adicione um `LevelDefinition`
   (id, ordem, fragmento e roteiro). Rode `npm test`: a validação acusa referências erradas.
2. **Textos** — em `src/content/pt-BR.ts`, adicione a fase em `levels`, os itens em `items`
   e o fragmento em `fragments`. O teste `content.test.ts` acusa o que faltar.
3. **Arte** — adicione os arquivos em `public/assets/sprites/` e as chaves em `src/ui-phaser/assets.ts`.
4. **Cena** — crie `src/ui-phaser/levels/MinhaFaseScene.ts` estendendo `BaseLevelScene`:
   implemente `buildWorld()` e registre itens (`registerPickup`), alvos (`registerTarget`;
   a posição de aproximação pode ser uma função, para alvos que andam) e o fragmento
   (`registerFragment`). Um alvo pode ser uma imagem ou uma `Zone` invisível (ex.: o bando
   de leões inteiro). Ganchos disponíveis para o comportamento especial:

   | Gancho | Para quê | Exemplo |
   |---|---|---|
   | `onItemUsed` | animar o resultado de um item | urso come e dorme |
   | `onTargetTapped` | tocar num alvo sem item útil | urso rosna, diretor reclama |
   | `walkLimit` / `onBlocked` | bloquear passagem | urso na caverna, porta da diretoria |
   | `onUpdate` | lógica a cada quadro | patrulha e cone de visão do diretor |
   | `fragmentRevealDelay` | esperar a animação antes de mostrar o fragmento (ou `'manual'` + `revealFragment()`) | minijogo do celular em Dubai |

   Use `onTap` (em `ui/onTap.ts`) para qualquer objeto tocável: o toque só conta se
   começar e terminar no objeto.
5. **Registro** — em `src/ui-phaser/levels/registry.ts`, informe a posição no mapa e a `scene`.

Fases sem `scene` aparecem no mapa como "em breve" — dá para planejar a campanha antes de desenhar.

## Como trocar o frontend

O novo frontend precisa apenas de:

```ts
const session = new GameSession(new LevelCatalog(CAMPAIGN_LEVELS), meuRepositorio);
const run = session.startLevel('alasca');   // regras da fase
run.pickUp('peixe-do-buraco-no-gelo');
run.useItem('peixe', 'urso');               // { kind: 'success' | 'wrong-item' | 'not-ready' | 'no-item' }
run.nextHint();                              // para o botão de dica
run.collectFragment();                       // a sessão salva sozinha
```

`src/ui-phaser` pode ser apagado sem quebrar `src/core`, `src/content` ou os testes.

## Plataformas

- **Web/PWA**: `npm run build` gera um site estático em `dist/`.
- **Lojas (Android/iOS)**: empacotar o `dist/` com Capacitor. Se quiser salvar com as
  preferências nativas em vez do `localStorage`, basta criar outro `SaveRepository`.
- **Narração**: hoje usa a voz sintetizada do aparelho (`SpeechNarrator`). Para locução
  gravada, crie outro `Narrator` que toca arquivos de áudio.
