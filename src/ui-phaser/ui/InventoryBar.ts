import Phaser from 'phaser';
import type { ItemId } from '../../core';
import { itemTexture } from '../assets';
import { COLORS, DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../theme';

const SLOT = 104;
const SLOTS = 4;

export interface InventoryCallbacks {
  /** Toque rápido no item: seleciona/deseleciona. */
  onSelect: (item: ItemId | null) => void;
  /** Item arrastado e solto num ponto da tela (coordenadas de mundo). */
  onDrop: (item: ItemId, worldX: number, worldY: number) => void;
}

/**
 * Mochila na parte de baixo da tela. A criança pode ARRASTAR o item até o alvo
 * ou TOCAR no item e depois no alvo — os dois jeitos funcionam.
 */
export class InventoryBar extends Phaser.GameObjects.Container {
  private items: ItemId[] = [];
  private selected: ItemId | null = null;
  private readonly slots: Phaser.GameObjects.Container[] = [];
  private ghost?: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, private readonly callbacks: InventoryCallbacks) {
    super(scene, GAME_WIDTH / 2, GAME_HEIGHT - 66);
    const width = SLOTS * SLOT + 36;
    const bg = scene.add.graphics();
    bg.fillStyle(0x7a4a22, 0.92).fillRoundedRect(-width / 2, -62, width, 124, 30);
    bg.lineStyle(5, COLORS.ink).strokeRoundedRect(-width / 2, -62, width, 124, 30);
    this.add(bg);
    for (let i = 0; i < SLOTS; i++) {
      const slot = scene.add.container(-((SLOTS - 1) * SLOT) / 2 + i * SLOT, 0);
      this.slots.push(slot);
      this.add(slot);
    }
    this.setScrollFactor(0).setDepth(DEPTH.hud);
    scene.add.existing(this);
    this.render();
  }

  get selectedItem(): ItemId | null {
    return this.selected;
  }

  /** Posição de tela do espaço de um item (para animar itens "voando" para a mochila). */
  slotScreenPosition(item: ItemId): { x: number; y: number } {
    const index = Math.max(0, this.items.indexOf(item));
    const slot = this.slots[Math.min(index, SLOTS - 1)]!;
    return { x: this.x + slot.x, y: this.y + slot.y };
  }

  setItems(items: readonly ItemId[]): void {
    this.items = [...items];
    if (this.selected && !this.items.includes(this.selected)) this.selected = null;
    this.render();
  }

  select(item: ItemId | null): void {
    this.selected = item;
    this.render();
    this.callbacks.onSelect(item);
  }

  /** Faz um item piscar (usado pelas dicas). */
  highlight(item: ItemId): void {
    const index = this.items.indexOf(item);
    const slot = this.slots[index];
    if (!slot) return;
    this.scene.tweens.add({ targets: slot, scale: 1.25, duration: 220, yoyo: true, repeat: 3, ease: 'Sine.InOut' });
  }

  private render(): void {
    this.slots.forEach((slot, index) => {
      slot.removeAll(true);
      slot.removeAllListeners();
      slot.disableInteractive();
      const item = this.items[index];
      const isSelected = item !== undefined && item === this.selected;
      const frame = this.scene.add.graphics();
      frame.fillStyle(isSelected ? 0xfff2b3 : 0xf3e2c7, 1).fillRoundedRect(-44, -44, 88, 88, 20);
      frame.lineStyle(isSelected ? 7 : 4, isSelected ? COLORS.primary : COLORS.ink).strokeRoundedRect(-44, -44, 88, 88, 20);
      slot.add(frame);
      if (!item) return;

      const icon = this.scene.add.image(0, 0, itemTexture(item));
      icon.setScale(Math.min(72 / icon.width, 72 / icon.height));
      slot.add(icon);
      slot.setSize(88, 88).setInteractive({ useHandCursor: true });
      slot.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.startDrag(item, pointer));
    });
  }

  private startDrag(item: ItemId, pointer: Phaser.Input.Pointer): void {
    const scene = this.scene;
    const startX = pointer.x;
    const startY = pointer.y;
    let dragging = false;

    const move = (p: Phaser.Input.Pointer) => {
      if (!dragging && Phaser.Math.Distance.Between(startX, startY, p.x, p.y) > 18) {
        dragging = true;
        this.ghost = scene.add.image(p.x, p.y, itemTexture(item)).setScrollFactor(0).setDepth(DEPTH.overlay).setAlpha(0.9);
        this.ghost.setScale(Math.min(96 / this.ghost.width, 96 / this.ghost.height));
      }
      this.ghost?.setPosition(p.x, p.y);
    };
    const up = (p: Phaser.Input.Pointer) => {
      scene.input.off('pointermove', move);
      this.ghost?.destroy();
      this.ghost = undefined;
      if (dragging) {
        this.callbacks.onDrop(item, p.worldX, p.worldY);
      } else {
        this.select(this.selected === item ? null : item);
      }
    };
    scene.input.on('pointermove', move);
    scene.input.once('pointerup', up);
  }
}
