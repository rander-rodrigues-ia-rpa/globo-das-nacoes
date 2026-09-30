import Phaser from 'phaser';
import type { Hint, ItemId, LevelId, LevelRun, PickupId, TargetId, UseItemResult } from '../../core';
import type { LevelText } from '../../content';
import { services } from '../AppServices';
import { fragmentTexture } from '../assets';
import { levelSceneKey, SCENES } from '../sceneKeys';
import { COLORS, DEPTH, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../theme';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { InventoryBar } from '../ui/InventoryBar';
import { onTap } from '../ui/onTap';
import { fadeIn, goTo } from '../ui/transitions';
import { PlayerAvatar } from '../world/PlayerAvatar';

/** Qualquer coisa tocável no cenário; `Zone` serve para grupos (ex.: o bando de leões). */
type Interactive = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.Zone;

type Point = { x: number; y: number };

interface TargetView {
  object: Interactive;
  /** Onde o herói para ao interagir com o alvo (função para alvos que andam). */
  approach: Point | (() => Point);
}

export interface WorldLayout {
  width: number;
  /** Altura do mundo (fases verticais, como a torre do Brasil). Padrão: altura da tela. */
  height?: number;
  start: { x: number; y: number };
  /** Faixa do chão onde o herói pode andar. */
  walkArea: Phaser.Geom.Rectangle;
}

const PICKUP_RADIUS = 90;
const INTERACT_RADIUS = 280;
const IDLE_HINT_MS = 25000;

/**
 * Base de TODAS as fases. Cuida do que se repete no "Ciclo do Aventureiro":
 * andar (toque ou teclado), pegar itens, usar item em alvo (arrastar ou tocar),
 * dicas, revelar e coletar o fragmento e a comemoração final.
 *
 * Cada fase concreta só desenha o cenário (buildWorld) e reage aos momentos
 * importantes (onItemUsed, onTargetTapped...). As regras vêm do núcleo (LevelRun).
 */
export abstract class BaseLevelScene extends Phaser.Scene {
  protected run!: LevelRun;
  protected player!: PlayerAvatar;
  protected caption!: Caption;
  protected inventory!: InventoryBar;
  protected levelText!: LevelText;
  protected layout!: WorldLayout;

  private pickups = new Map<PickupId, Interactive>();
  private targets = new Map<TargetId, TargetView>();
  private fragment?: Interactive;
  private busy = false;
  private lastProgressAt = 0;
  private blockedCooldownUntil = 0;
  private hintMarkers: Phaser.GameObjects.GameObject[] = [];
  private keys!: {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  };

  protected constructor(readonly levelId: LevelId) {
    super(levelSceneKey(levelId));
  }

  // ------------------------------------------------------------ ganchos das fases

  /** Desenha o cenário e registra itens, alvos e o fragmento. */
  protected abstract buildWorld(): WorldLayout;

  /** Um item foi usado com sucesso (animações próprias da fase). */
  protected onItemUsed(_result: Extract<UseItemResult, { kind: 'success' }>): void {}

  /** A criança tocou num alvo sem ter um item útil (ex.: o urso rosna). */
  protected onTargetTapped(_target: TargetId): void {}

  /** Limites horizontais de caminhada no momento (ex.: o urso bloqueia a caverna). */
  protected walkLimit(): { minX: number; maxX: number } {
    return { minX: this.layout.walkArea.left, maxX: this.layout.walkArea.right };
  }

  /** O herói tentou passar de um bloqueio. */
  protected onBlocked(): void {}

  /** O herói consegue chegar até o alvo agora? (ex.: o Capitão só é alcançável no topo da torre) */
  protected canReach(_target: TargetId): boolean {
    return true;
  }

  /** A criança tentou interagir com um alvo fora de alcance. */
  protected onUnreachable(_target: TargetId): void {}

  /** Chamado a cada quadro enquanto a criança está no controle (patrulhas, vigias...). */
  protected onUpdate(_time: number, _delta: number): void {}

  /**
   * Espera antes de mostrar o fragmento liberado (para caber a animação do vilão).
   * 'manual': a própria fase chama revealFragment() quando a cena terminar.
   */
  protected fragmentRevealDelay(): number | 'manual' {
    return 0;
  }

  // ------------------------------------------------------------ ciclo de vida

  create(): void {
    const { session, text } = services(this);
    this.pickups = new Map();
    this.targets = new Map();
    this.fragment = undefined;
    this.busy = false;
    this.hintMarkers = [];
    this.levelText = text.levels[this.levelId]!;
    this.run = session.startLevel(this.levelId);
    this.events.once('shutdown', () => this.run.events.clear());

    fadeIn(this);
    this.layout = this.buildWorld();
    this.cameras.main.setBounds(0, 0, this.layout.width, this.layout.height ?? GAME_HEIGHT);
    this.player = new PlayerAvatar(this, this.layout.start.x, this.layout.start.y, session.hero ?? 'joao');
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12, 0, 60);

    new Hud(this, { onHome: () => goTo(this, SCENES.worldMap), onHint: () => this.showHint() });
    this.caption = new Caption(this, 70);
    this.inventory = new InventoryBar(this, {
      onSelect: () => undefined,
      onDrop: (item, x, y) => this.dropItemAt(item, x, y),
    });

    this.setupInput();
    this.run.events.on('item-picked', () => this.inventory.setItems(this.run.items));
    this.run.events.on('fragment-available', () => {
      const delay = this.fragmentRevealDelay();
      if (delay !== 'manual') this.time.delayedCall(delay, () => this.revealFragment());
    });

    this.lastProgressAt = this.time.now;
    this.showTitleCard();
  }

  update(_time: number, delta: number): void {
    if (this.busy) return;
    // Um único relógio (o da cena) para bloqueios, dicas e ganchos das fases.
    const time = this.time.now;
    const { cursors, wasd } = this.keys;
    const dx = (cursors.right.isDown || wasd.D.isDown ? 1 : 0) - (cursors.left.isDown || wasd.A.isDown ? 1 : 0);
    const dy = (cursors.down.isDown || wasd.S.isDown ? 1 : 0) - (cursors.up.isDown || wasd.W.isDown ? 1 : 0);

    const next = this.player.step(delta, dx, dy);
    const limit = this.walkLimit();
    const area = this.layout.walkArea;
    if (next.x > limit.maxX || next.x < limit.minX) {
      this.player.stop();
      if (time > this.blockedCooldownUntil) {
        this.blockedCooldownUntil = time + 5000;
        this.onBlocked();
      }
    }
    this.player.setPosition(
      Phaser.Math.Clamp(next.x, limit.minX, limit.maxX),
      Phaser.Math.Clamp(next.y, area.top, area.bottom),
    );
    this.player.setDepth(this.player.y);

    this.checkPickups();
    this.checkFragment();
    this.onUpdate(time, delta);

    if (time - this.lastProgressAt > IDLE_HINT_MS) {
      this.lastProgressAt = time;
      this.showHint();
    }
  }

  // ------------------------------------------------------------ registro de objetos

  protected registerPickup(pickup: PickupId, object: Interactive): void {
    this.pickups.set(pickup, object);
    object.setInteractive({ useHandCursor: true });
    onTap(object, () => !this.busy && this.player.walkTo(object.x, this.clampY(object.y + 10)));
  }

  protected registerTarget(target: TargetId, object: Interactive, approach: TargetView['approach']): void {
    this.targets.set(target, { object, approach });
    object.setInteractive({ useHandCursor: true });
    onTap(object, () => this.interactWith(target));
  }

  /**
   * O fragmento fica escondido até o roteiro liberar.
   * `depth` permite desenhá-lo na frente de algo (ex.: dentro do armário aberto).
   */
  protected registerFragment(x: number, y: number, depth = y): Interactive {
    const fragment = this.add.image(x, y, fragmentTexture(this.run.definition.fragmentId)).setAlpha(0).setScale(0.2).setDepth(depth);
    this.fragment = fragment;
    onTap(fragment, () => !this.busy && this.player.walkTo(fragment.x, this.clampY(fragment.y + 60)));
    return fragment;
  }

  protected targetObject(target: TargetId): Interactive {
    const view = this.targets.get(target);
    if (!view) throw new Error(`Alvo não registrado: ${target}`);
    return view.object;
  }

  /** Pausa a entrada durante animações roteirizadas. */
  protected setBusy(busy: boolean): void {
    this.busy = busy;
    if (busy) this.player.stop();
  }

  protected markProgress(): void {
    this.lastProgressAt = this.time.now;
  }

  protected say(line: string): void {
    this.caption.say(line);
  }

  // ------------------------------------------------------------ interação

  private setupInput(): void {
    const keyboard = this.input.keyboard!;
    this.keys = {
      cursors: keyboard.createCursorKeys(),
      wasd: keyboard.addKeys('W,A,S,D') as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>,
    };
    keyboard.on('keydown-SPACE', () => this.interactWithNearest());
    keyboard.on('keydown-ENTER', () => this.interactWithNearest());
    keyboard.on('keydown-H', () => this.showHint());
    keyboard.on('keydown-ESC', () => goTo(this, SCENES.worldMap));
    ['ONE', 'TWO', 'THREE', 'FOUR'].forEach((key, index) =>
      keyboard.on(`keydown-${key}`, () => {
        const item = this.run.items[index];
        if (item) this.inventory.select(this.inventory.selectedItem === item ? null : item);
      }),
    );

    // Tocar no chão: andar até lá (se não tocou em nenhum objeto interativo).
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (this.busy || over.length > 0) return;
      this.player.walkTo(pointer.worldX, this.clampY(pointer.worldY));
    });
  }

  private clampY(y: number): number {
    return Phaser.Math.Clamp(y, this.layout.walkArea.top, this.layout.walkArea.bottom);
  }

  private interactWithNearest(): void {
    if (this.busy) return;
    let nearest: TargetId | null = null;
    let best = INTERACT_RADIUS;
    for (const [id, view] of this.targets) {
      const approach = this.approachOf(view);
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, approach.x, approach.y);
      if (d < best) {
        best = d;
        nearest = id;
      }
    }
    if (nearest) this.interactWith(nearest);
  }

  private dropItemAt(item: ItemId, worldX: number, worldY: number): void {
    for (const [id, view] of this.targets) {
      if (view.object.getBounds().contains(worldX, worldY)) return this.interactWith(id, item);
    }
  }

  private interactWith(target: TargetId, item?: ItemId): void {
    if (this.busy) return;
    if (!this.canReach(target)) {
      this.onUnreachable(target);
      return;
    }
    const chosen = item ?? this.inventory.selectedItem ?? this.run.usableItemsFor(target)[0] ?? null;
    if (!chosen) {
      this.onTargetTapped(target);
      return;
    }
    const approach = this.approachOf(this.targets.get(target)!);
    this.player.walkTo(approach.x, this.clampY(approach.y), () => this.applyItem(chosen, target));
  }

  private approachOf(view: TargetView): Point {
    return typeof view.approach === 'function' ? view.approach() : view.approach;
  }

  private applyItem(item: ItemId, target: TargetId): void {
    const { sfx, text } = services(this);
    const result = this.run.useItem(item, target);
    this.inventory.setItems(this.run.items);
    this.inventory.select(null);

    switch (result.kind) {
      case 'success':
        sfx.play('success');
        this.markProgress();
        this.onItemUsed(result);
        break;
      case 'wrong-item':
        sfx.play('wrong');
        this.say(text.hints.wrongItem);
        this.shake(this.targetObject(target));
        break;
      case 'not-ready':
        sfx.play('wrong');
        this.say(text.hints.notReady);
        break;
      case 'no-item':
        break;
    }
  }

  private checkPickups(): void {
    for (const [id, object] of this.pickups) {
      if (this.run.isPickedUp(id)) continue;
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, object.x, object.y) > PICKUP_RADIUS) continue;
      this.collectPickup(id, object);
    }
  }

  private collectPickup(id: PickupId, object: Interactive): void {
    const { sfx, text } = services(this);
    object.disableInteractive();
    this.tweens.killTweensOf(object);
    this.run.pickUp(id);
    this.markProgress();
    sfx.play('pickup');
    const item = this.run.definition.script.pickups.find((p) => p.id === id)!.item;
    this.say(text.ui.gotItem(text.items[item]?.name ?? item));

    // O item "voa" até a mochila.
    const camera = this.cameras.main;
    const slot = this.inventory.slotScreenPosition(item);
    object.setScrollFactor(0).setPosition(object.x - camera.scrollX, object.y - camera.scrollY).setDepth(DEPTH.overlay);
    this.tweens.add({
      targets: object,
      x: slot.x,
      y: slot.y,
      scale: object.scale * 0.5,
      duration: 600,
      ease: 'Cubic.In',
      onComplete: () => object.destroy(),
    });
  }

  protected revealFragment(): void {
    const fragment = this.fragment;
    if (!fragment || fragment.input?.enabled) return;
    fragment.setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: fragment, alpha: 1, scale: 0.75, duration: 900, ease: 'Back.Out' });
    this.tweens.add({ targets: fragment, y: fragment.y - 14, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add
      .particles(fragment.x, fragment.y, 'sparkle', {
        speed: { min: 20, max: 70 },
        lifespan: 1200,
        scale: { start: 0.9, end: 0 },
        frequency: 180,
        blendMode: 'ADD',
      })
      .setDepth(fragment.depth + 1);
  }

  private checkFragment(): void {
    const fragment = this.fragment;
    if (!fragment || !fragment.input?.enabled || this.run.isFragmentCollected()) return;
    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, fragment.x, fragment.y + 60) > PICKUP_RADIUS + 30) return;
    this.run.collectFragment(); // a sessão registra a conquista e salva
    this.celebrate();
  }

  private celebrate(): void {
    const { sfx, text } = services(this);
    this.setBusy(true);
    this.clearHintMarkers();
    this.player.cheer();
    sfx.play('fragment');
    this.fragment?.setVisible(false);

    const layer = this.add.container(0, 0).setScrollFactor(0).setDepth(DEPTH.overlay);
    const shade = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.night, 0).setOrigin(0);
    const rays = this.add.star(GAME_WIDTH / 2, 300, 12, 90, 260, 0xfff3b0, 0.35);
    const big = this.add.image(GAME_WIDTH / 2, 300, fragmentTexture(this.run.definition.fragmentId)).setScale(0);
    const title = this.add.text(GAME_WIDTH / 2, 490, this.levelText.celebration, textStyle(46, '#FFFFFF', { wordWrap: { width: 1000 } }));
    title.setOrigin(0.5).setAlpha(0);
    layer.add([shade, rays, big, title]);

    const confetti = this.add.particles(GAME_WIDTH / 2, -20, 'sparkle', {
      x: { min: -GAME_WIDTH / 2, max: GAME_WIDTH / 2 },
      speedY: { min: 120, max: 260 },
      speedX: { min: -60, max: 60 },
      lifespan: 4000,
      scale: { min: 0.5, max: 1.2 },
      rotate: { min: 0, max: 360 },
      tint: [0xff4d6d, 0x46b7f0, 0xf7c948, 0x3cc46a, 0xff9f2e],
      frequency: 40,
    });
    confetti.setScrollFactor(0).setDepth(DEPTH.overlay + 1);

    this.tweens.add({ targets: shade, fillAlpha: 0.6, duration: 400 });
    this.tweens.add({ targets: big, scale: 1.6, angle: 360, duration: 900, ease: 'Back.Out' });
    this.tweens.add({ targets: rays, angle: 360, duration: 12000, repeat: -1 });
    this.tweens.add({ targets: title, alpha: 1, delay: 500, duration: 400 });
    services(this).narrator.speak(this.levelText.celebration);

    this.time.delayedCall(1400, () => {
      const button = new Button(this, GAME_WIDTH / 2, 630, {
        label: text.ui.continueAdventure,
        width: 320,
        color: COLORS.success,
        shadowColor: COLORS.successDark,
        onPress: () => goTo(this, SCENES.worldMap),
      });
      button.setScrollFactor(0).setDepth(DEPTH.overlay + 2).setScale(0);
      this.tweens.add({ targets: button, scale: 1, duration: 300, ease: 'Back.Out' });
    });
  }

  // ------------------------------------------------------------ dicas

  private showHint(): void {
    if (this.busy) return;
    const { text } = services(this);
    this.markProgress();
    this.clearHintMarkers();
    const hint: Hint = this.run.nextHint();

    switch (hint.kind) {
      case 'find-item': {
        this.say(text.hints.findItem(text.items[hint.item]?.the ?? hint.item));
        const object = this.pickups.get(hint.pickup);
        if (object) this.pointAt(object);
        break;
      }
      case 'use-item': {
        const targetName = this.levelText.targets[hint.target] ?? hint.target;
        this.say(text.hints.useItem(text.items[hint.item]?.the ?? hint.item, targetName));
        this.inventory.highlight(hint.item);
        const target = this.targets.get(hint.target);
        if (target) this.pointAt(target.object);
        break;
      }
      case 'collect-fragment':
        this.say(text.hints.collectFragment);
        if (this.fragment) this.pointAt(this.fragment);
        break;
      case 'done':
        break;
    }
  }

  /** Seta pulando em cima do objeto; se ele estiver fora da tela, a câmera mostra onde fica. */
  private pointAt(object: Interactive): void {
    const bounds = object.getBounds();
    const arrow = this.add.image(bounds.centerX, bounds.top - 50, 'icon-arrow').setDepth(DEPTH.hud - 1).setScale(0.8);
    this.tweens.add({ targets: arrow, y: arrow.y + 20, duration: 350, yoyo: true, repeat: 8, onComplete: () => arrow.destroy() });
    this.hintMarkers.push(arrow);

    const camera = this.cameras.main;
    if (!camera.worldView.contains(bounds.centerX, bounds.centerY)) {
      this.setBusy(true);
      camera.stopFollow();
      camera.pan(bounds.centerX, bounds.centerY, 900, 'Sine.easeInOut');
      this.time.delayedCall(2300, () => {
        camera.pan(this.player.x, this.player.y - 100, 700, 'Sine.easeInOut', false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
          if (progress < 1) return;
          camera.startFollow(this.player, true, 0.12, 0.12, 0, 60);
          this.setBusy(false);
        });
      });
    }
  }

  private clearHintMarkers(): void {
    this.hintMarkers.forEach((marker) => marker.destroy());
    this.hintMarkers = [];
  }

  private shake(object: Interactive): void {
    const x = object.x;
    this.tweens.add({ targets: object, x: x + 10, duration: 60, yoyo: true, repeat: 3, onComplete: () => object.setX(x) });
  }

  private showTitleCard(): void {
    const card = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60).setScrollFactor(0).setDepth(DEPTH.overlay);
    const country = this.add.text(0, -30, this.levelText.country, textStyle(84)).setOrigin(0.5);
    const place = this.add.text(0, 50, this.levelText.place, textStyle(38)).setOrigin(0.5);
    card.add([country, place]).setAlpha(0).setScale(0.8);
    this.tweens.add({ targets: card, alpha: 1, scale: 1, duration: 450, ease: 'Back.Out' });
    this.tweens.add({ targets: card, alpha: 0, delay: 2400, duration: 400, onComplete: () => card.destroy() });
    this.time.delayedCall(2600, () => {
      if (this.levelText.intro.length > 0) this.say(this.levelText.intro.join(' '));
    });
  }
}
