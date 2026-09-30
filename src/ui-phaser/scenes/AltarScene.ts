import Phaser from 'phaser';
import { HEROES, type FragmentId, type GlobeAssembly } from '../../core';
import { services } from '../AppServices';
import { FRAGMENT_COLORS, fragmentTexture, heroTexture } from '../assets';
import { SCENES } from '../sceneKeys';
import { COLORS, DEPTH, GAME_WIDTH, textStyle } from '../theme';
import { Button } from '../ui/Button';
import { Caption } from '../ui/Caption';
import { Hud } from '../ui/Hud';
import { onTap } from '../ui/onTap';
import { fadeIn, goTo } from '../ui/transitions';

const GLOBE = { x: 640, y: 440, radius: 82 }; // o globo "pousa" no pedestal
const SLOT_SCALE = 0.42;
const LOOSE_SCALE = 0.6;
const SNAP_DISTANCE = 80;
const IDLE_HINT_MS = 15000;

interface Piece {
  fragment: FragmentId;
  image: Phaser.GameObjects.Image;
  home: { x: number; y: number };
  dragged: boolean;
}

/**
 * O Clímax: o Altar do Mundo.
 * A Montagem (levar cada fragmento ao encaixe da mesma cor) → A Ativação (o globo
 * se completa e gira) → A Celebração (os três heróis comemoram).
 */
export class AltarScene extends Phaser.Scene {
  private assembly!: GlobeAssembly;
  private caption!: Caption;
  private pieces: Piece[] = [];
  private slots = new Map<FragmentId, { x: number; y: number; marker: Phaser.GameObjects.Arc }>();
  private lastProgressAt = 0;
  private finished = false;

  constructor() {
    super(SCENES.altar);
  }

  create(): void {
    const { session, text } = services(this);
    this.pieces = [];
    this.slots = new Map();
    this.finished = false;
    this.assembly = session.startAltar();

    fadeIn(this);
    this.add.image(0, 0, 'bg-altar').setOrigin(0);
    new Hud(this, { onHome: () => goTo(this, SCENES.worldMap) });
    this.caption = new Caption(this, 70);
    this.add.text(GAME_WIDTH / 2, 150, text.altar.title, textStyle(48)).setOrigin(0.5);

    this.add.image(GLOBE.x, GLOBE.y, 'globe-ghost').setScale(0.62);
    this.createSlots();
    this.createPieces();

    this.input.dragDistanceThreshold = 12;
    this.input.on('dragstart', (_p: Phaser.Input.Pointer, image: Phaser.GameObjects.Image) => this.onDragStart(image));
    this.input.on('drag', (_p: Phaser.Input.Pointer, image: Phaser.GameObjects.Image, x: number, y: number) => image.setPosition(x, y));
    this.input.on('dragend', (_p: Phaser.Input.Pointer, image: Phaser.GameObjects.Image) => this.onDragEnd(image));
    const keyboard = this.input.keyboard!;
    const placeNext = () => this.placeNextAutomatically();
    keyboard.on('keydown-SPACE', placeNext);
    keyboard.on('keydown-ENTER', placeNext);
    keyboard.on('keydown-H', () => this.showHint());

    this.assembly.events.on('complete', () => this.time.delayedCall(700, () => this.activate()));
    this.lastProgressAt = this.time.now;
    this.time.delayedCall(500, () => this.caption.say(text.altar.intro));
  }

  update(): void {
    if (this.finished || this.time.now - this.lastProgressAt < IDLE_HINT_MS) return;
    this.lastProgressAt = this.time.now;
    this.showHint();
  }

  // ------------------------------------------------------------ montagem

  /** Um encaixe colorido para cada fragmento, em volta do centro do globo. */
  private createSlots(): void {
    const fragments = this.assembly.fragments;
    fragments.forEach((fragment, index) => {
      const angle = -Math.PI / 2 + (index / fragments.length) * Math.PI * 2;
      const x = GLOBE.x + Math.cos(angle) * GLOBE.radius;
      const y = GLOBE.y + Math.sin(angle) * GLOBE.radius;
      const marker = this.add.circle(x, y, 34, FRAGMENT_COLORS[fragment] ?? COLORS.muted, 0.45).setStrokeStyle(4, 0xffffff, 0.9);
      this.add.image(x, y, fragmentTexture(fragment, true)).setScale(SLOT_SCALE);
      this.slots.set(fragment, { x, y, marker });
    });
  }

  /** Os fragmentos flutuam dos dois lados do altar, embaralhados. */
  private createPieces(): void {
    const order = Phaser.Utils.Array.Shuffle([...this.assembly.fragments]);
    const rows = Math.ceil(order.length / 2);
    order.forEach((fragment, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const home = {
        x: GLOBE.x + side * (300 + (row % 2) * 70),
        y: 250 + row * (rows > 1 ? 280 / (rows - 1) : 0),
      };
      const image = this.add.image(home.x, home.y, fragmentTexture(fragment)).setScale(LOOSE_SCALE).setDepth(10);
      image.setInteractive({ useHandCursor: true, draggable: true });
      const piece: Piece = { fragment, image, home, dragged: false };
      image.on('pointerdown', () => (piece.dragged = false));
      // Tocar (sem arrastar) faz o fragmento voar sozinho para o lugar certo.
      onTap(image, () => {
        if (!piece.dragged) this.flyToSlot(piece);
      });
      this.bob(piece);
      this.pieces.push(piece);
    });
  }

  private bob(piece: Piece): void {
    this.tweens.add({ targets: piece.image, y: piece.home.y - 12, duration: 900 + Math.random() * 300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private pieceOf(image: Phaser.GameObjects.Image): Piece | undefined {
    return this.pieces.find((p) => p.image === image);
  }

  private onDragStart(image: Phaser.GameObjects.Image): void {
    const piece = this.pieceOf(image);
    if (!piece) return;
    piece.dragged = true;
    this.tweens.killTweensOf(image);
    image.setScale(LOOSE_SCALE * 1.1).setDepth(DEPTH.effects);
  }

  private onDragEnd(image: Phaser.GameObjects.Image): void {
    const piece = this.pieceOf(image);
    if (!piece) return;
    let nearest: FragmentId | null = null;
    let best = SNAP_DISTANCE;
    for (const [slot, pos] of this.slots) {
      if (this.assembly.isPlaced(slot)) continue;
      const d = Phaser.Math.Distance.Between(image.x, image.y, pos.x, pos.y);
      if (d < best) {
        best = d;
        nearest = slot;
      }
    }
    if (!nearest) return this.sendHome(piece);
    this.tryPlace(piece, nearest);
  }

  private flyToSlot(piece: Piece): void {
    if (this.assembly.isPlaced(piece.fragment)) return;
    this.tweens.killTweensOf(piece.image);
    piece.image.disableInteractive().setDepth(DEPTH.effects); // sem toques repetidos durante o voo
    const slot = this.slots.get(piece.fragment)!;
    this.tweens.add({
      targets: piece.image,
      x: slot.x,
      y: slot.y,
      duration: 550,
      ease: 'Cubic.Out',
      onComplete: () => this.tryPlace(piece, piece.fragment),
    });
  }

  private tryPlace(piece: Piece, slot: FragmentId): void {
    const { sfx, text } = services(this);
    const result = this.assembly.place(piece.fragment, slot);
    if (result === 'already-placed') return;
    if (result !== 'placed') {
      if (result === 'wrong-slot') {
        sfx.play('wrong');
        this.caption.say(text.altar.wrongSlot);
      }
      this.sendHome(piece);
      return;
    }
    this.lastProgressAt = this.time.now;
    const pos = this.slots.get(slot)!;
    piece.image.disableInteractive();
    this.tweens.add({ targets: piece.image, x: pos.x, y: pos.y, scale: SLOT_SCALE, duration: 200 });
    pos.marker.setFillStyle(FRAGMENT_COLORS[slot] ?? COLORS.muted, 1);
    sfx.play('success');
    this.sparkle(pos.x, pos.y);
    const cheers = text.altar.placed;
    if (!this.assembly.isComplete()) this.caption.say(cheers[(this.assembly.placedCount - 1) % cheers.length]!);
  }

  private sendHome(piece: Piece): void {
    this.tweens.add({
      targets: piece.image,
      x: piece.home.x,
      y: piece.home.y,
      scale: LOOSE_SCALE,
      duration: 400,
      ease: 'Back.Out',
      onComplete: () => {
        piece.image.setDepth(10).setInteractive({ useHandCursor: true, draggable: true });
        this.bob(piece);
      },
    });
  }

  private placeNextAutomatically(): void {
    const next = this.assembly.nextToPlace();
    const piece = this.pieces.find((p) => p.fragment === next);
    if (piece && !this.finished) this.flyToSlot(piece);
  }

  private showHint(): void {
    const next = this.assembly.nextToPlace();
    const piece = this.pieces.find((p) => p.fragment === next);
    const slot = next ? this.slots.get(next) : undefined;
    if (!piece || !slot) return;
    this.caption.say(services(this).text.altar.intro);
    this.tweens.add({ targets: slot.marker, scale: 1.4, duration: 300, yoyo: true, repeat: 3 });
    const arrow = this.add.image(piece.image.x, piece.image.y - 80, 'icon-arrow').setScale(0.7).setDepth(DEPTH.effects);
    this.tweens.add({ targets: arrow, y: arrow.y + 18, duration: 350, yoyo: true, repeat: 5, onComplete: () => arrow.destroy() });
  }

  // ------------------------------------------------------------ ativação e celebração

  private activate(): void {
    const { sfx, text } = services(this);
    this.finished = true;
    sfx.play('powerup');

    const rays = this.add.star(GLOBE.x, GLOBE.y, 14, 120, 420, 0xfff3b0, 0.5).setDepth(5).setScale(0);
    this.tweens.add({ targets: rays, scale: 1, duration: 900, ease: 'Back.Out' });
    this.tweens.add({ targets: rays, angle: 360, duration: 14000, repeat: -1 });

    // Os fragmentos se fundem no centro e o globo inteiro aparece girando.
    this.pieces.forEach(({ image }) => this.tweens.add({ targets: image, x: GLOBE.x, y: GLOBE.y, scale: 0, duration: 700, ease: 'Cubic.In' }));
    this.slots.forEach(({ marker }) => this.tweens.add({ targets: marker, alpha: 0, duration: 500 }));
    const globe = this.add.image(GLOBE.x, GLOBE.y, 'globe-sphere').setScale(0).setDepth(DEPTH.effects);
    this.time.delayedCall(650, () => {
      this.cameras.main.flash(600, 255, 250, 220);
      sfx.play('fragment');
      this.tweens.add({ targets: globe, scale: 0.72, angle: 360, duration: 1600, ease: 'Back.Out' });
      this.tweens.add({ targets: globe, y: GLOBE.y - 12, delay: 1700, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.caption.say(text.altar.activation);
    });

    this.time.delayedCall(4200, () => this.celebrate());
  }

  private celebrate(): void {
    const { session, sfx, text } = services(this);
    sfx.play('success');
    // O herói escolhido no centro, com os amigos ao lado.
    const chosen = session.hero ?? 'joao';
    const others = HEROES.map((h) => h.id).filter((id) => id !== chosen);
    const lineup = [others[0]!, chosen, others[1]!];
    lineup.forEach((hero, index) => {
      const x = GLOBE.x + (index - 1) * 240;
      const sprite = this.add
        .image(x, 800, heroTexture(hero))
        .setOrigin(0.5, 1)
        .setScale(index === 1 ? 0.85 : 0.72)
        .setDepth(DEPTH.effects + 1);
      this.tweens.add({ targets: sprite, y: 720, delay: index * 150, duration: 500, ease: 'Back.Out' });
      this.tweens.add({ targets: sprite, y: 680, delay: 800 + index * 120, duration: 260, yoyo: true, repeat: -1, repeatDelay: 500, ease: 'Quad.Out' });
    });

    this.add
      .particles(GAME_WIDTH / 2, -20, 'sparkle', {
        x: { min: -GAME_WIDTH / 2, max: GAME_WIDTH / 2 },
        speedY: { min: 120, max: 260 },
        speedX: { min: -60, max: 60 },
        lifespan: 4000,
        scale: { min: 0.5, max: 1.2 },
        rotate: { min: 0, max: 360 },
        tint: Object.values(FRAGMENT_COLORS),
        frequency: 40,
      })
      .setDepth(DEPTH.effects + 2);
    this.caption.say(text.altar.celebration);

    this.time.delayedCall(2600, () => {
      const button = new Button(this, GAME_WIDTH - 180, 330, {
        label: text.ui.continueAdventure,
        width: 320,
        color: COLORS.success,
        shadowColor: COLORS.successDark,
        onPress: () => goTo(this, SCENES.epilogue),
      });
      button.setDepth(DEPTH.hud).setScale(0);
      this.tweens.add({ targets: button, scale: 1, duration: 300, ease: 'Back.Out' });
    });
  }

  private sparkle(x: number, y: number): void {
    const burst = this.add.particles(x, y, 'sparkle', {
      speed: { min: 60, max: 180 },
      lifespan: 700,
      scale: { start: 0.9, end: 0 },
      quantity: 12,
      emitting: false,
      blendMode: 'ADD',
    });
    burst.setDepth(DEPTH.effects + 1).explode(12);
    this.time.delayedCall(900, () => burst.destroy());
  }
}
