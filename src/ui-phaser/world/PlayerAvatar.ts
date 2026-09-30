import Phaser from 'phaser';
import { heroTexture } from '../assets';

/**
 * O herói escolhido andando pelo cenário. Anda até um ponto tocado na tela
 * ou pelas setas/WASD; o "balanço" do corpo simula a caminhada.
 */
export class PlayerAvatar extends Phaser.GameObjects.Container {
  readonly speed = 340;
  private readonly body_: Phaser.GameObjects.Image;
  private destination: Phaser.Math.Vector2 | null = null;
  private onArrive: (() => void) | null = null;
  private walkTime = 0;
  /** Altura atual do pulo (0 = no chão). */
  private jumpHeight = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, hero: string, scale = 0.62) {
    super(scene, x, y);
    const shadow = scene.add.ellipse(0, 0, 110 * scale * 1.3, 26 * scale * 1.3, 0x1b2440, 0.18);
    this.body_ = scene.add.image(0, 0, heroTexture(hero)).setOrigin(0.5, 0.98).setScale(scale);
    this.add([shadow, this.body_]);
    scene.add.existing(this);
  }

  get isWalking(): boolean {
    return this.destination !== null;
  }

  walkTo(x: number, y: number, onArrive?: () => void): void {
    this.destination = new Phaser.Math.Vector2(x, y);
    this.onArrive = onArrive ?? null;
  }

  stop(): void {
    this.destination = null;
    this.onArrive = null;
  }

  /** Move de acordo com o teclado (dx, dy em -1..1) ou em direção ao destino. */
  step(deltaMs: number, dx: number, dy: number): { x: number; y: number } {
    const distance = (this.speed * deltaMs) / 1000;
    let vx = 0;
    let vy = 0;

    if (dx !== 0 || dy !== 0) {
      this.stop();
      const len = Math.hypot(dx, dy);
      vx = (dx / len) * distance;
      vy = (dy / len) * distance * 0.7;
    } else if (this.destination) {
      const remaining = Phaser.Math.Distance.Between(this.x, this.y, this.destination.x, this.destination.y);
      if (remaining <= distance) {
        vx = this.destination.x - this.x;
        vy = this.destination.y - this.y;
        const callback = this.onArrive;
        this.stop();
        this.scene.time.delayedCall(0, () => callback?.());
      } else {
        vx = ((this.destination.x - this.x) / remaining) * distance;
        vy = ((this.destination.y - this.y) / remaining) * distance;
      }
    }

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      this.walkTime += deltaMs;
      if (Math.abs(vx) > 0.5) this.body_.setFlipX(vx < 0);
    } else {
      this.walkTime = 0;
    }
    this.body_.y = -Math.abs(Math.sin(this.walkTime / 90)) * 10 - this.jumpHeight;
    this.body_.angle = moving ? Math.sin(this.walkTime / 90) * 4 : 0;
    return { x: this.x + vx, y: this.y + vy };
  }

  /** Está alto o bastante para passar por cima de um obstáculo? */
  get isAirborne(): boolean {
    return this.jumpHeight > 30;
  }

  /** Pulo (para desviar de obstáculos). Ignorado se já estiver no ar. */
  jump(): boolean {
    if (this.jumpHeight > 0) return false;
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 620,
      onUpdate: (tween) => (this.jumpHeight = Math.sin((tween.getValue() ?? 0) * Math.PI) * 110),
      onComplete: () => (this.jumpHeight = 0),
    });
    return true;
  }

  /** Pulinho de alegria. */
  cheer(): void {
    this.scene.tweens.add({ targets: this.body_, y: -60, duration: 180, yoyo: true, repeat: 1, ease: 'Quad.Out' });
  }
}
