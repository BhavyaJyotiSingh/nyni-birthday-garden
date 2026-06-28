// ============================================================
// CompanionSystem - Cats trail the player; a same-size ragdoll is dragged by hand.
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

interface CatCompanion {
  sprite: Phaser.GameObjects.Sprite;
  trailDelay: number;
  sideOffset: number;
  meowTimer: number;
  bobOffset: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

export class CompanionSystem {
  private scene: GameScene;
  private cats: CatCompanion[] = [];
  private ragdoll: Phaser.Physics.Arcade.Sprite;
  private tether: Phaser.GameObjects.Graphics;
  private trail: TrailPoint[] = [];
  private lastPlayer = { x: 0, y: 0 };

  constructor(scene: GameScene) {
    this.scene = scene;
    const px = scene.playerSystem.x;
    const py = scene.playerSystem.y;
    this.lastPlayer = { x: px, y: py };
    this.seedTrail(px, py);

    this.cats = [
      this.createCat('cat_orange', px - 54, py + 32, 16, -16, 0.2),
      this.createCat('cat_gray', px + 62, py + 52, 31, 18, 1.7),
    ];

    this.tether = scene.add.graphics();
    this.tether.setDepth(py - 4);

    const hand = scene.playerSystem.getHandPosition();
    this.ragdoll = scene.physics.add.sprite(hand.x - 26, hand.y + 52, 'ragdoll_cross_eyes');
    this.ragdoll.setScale(2.65);
    this.ragdoll.setOrigin(0.5, 0.5);
    this.ragdoll.setBounce(0.18);
    this.ragdoll.setDrag(260, 260);
    this.ragdoll.setMaxVelocity(280, 280);
    this.ragdoll.setCollideWorldBounds(true);
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;
    body.setSize(14, 22);
    body.setOffset(5, 7);
    this.ragdoll.setDepth(this.ragdoll.y - 2);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;
    const playerMoved = Phaser.Math.Distance.Between(px, py, this.lastPlayer.x, this.lastPlayer.y);

    if (playerMoved > 220) {
      this.resetToPlayer(px, py);
    } else if (playerMoved > 4) {
      this.trail.unshift({ x: px, y: py });
      this.trail.length = Math.min(this.trail.length, 90);
      this.lastPlayer = { x: px, y: py };
    }

    for (const cat of this.cats) {
      const target = this.trail[Math.min(cat.trailDelay, this.trail.length - 1)] ?? { x: px, y: py };
      const dx = px - target.x;
      const dy = py - target.y;
      const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const sideX = (-dy / len) * cat.sideOffset;
      const sideY = (dx / len) * cat.sideOffset;
      const wanderX = Math.sin(this.scene.time.now * 0.0012 + cat.bobOffset) * 8;
      const wanderY = Math.cos(this.scene.time.now * 0.001 + cat.bobOffset) * 5;

      this.moveToward(cat.sprite, target.x + sideX + wanderX, target.y + sideY + wanderY, 155, dt);

      const bob = Math.sin(this.scene.time.now * 0.014 + cat.bobOffset) * 0.04;
      cat.sprite.setScale(1.45, 1.35 + bob);
      cat.sprite.setFlipX(cat.sprite.x > target.x);
      cat.sprite.setDepth(cat.sprite.y);

      cat.meowTimer -= delta;
      if (cat.meowTimer <= 0) {
        this.scene.audioSystem.playMeow();
        cat.meowTimer = 4500 + Math.random() * 9500;
      }
    }

    this.updateRagdollPhysics(dt);
    this.ragdoll.setDepth(this.ragdoll.y - 2);
    this.drawTether();
  }

  resetToPlayer(x = this.scene.playerSystem.x, y = this.scene.playerSystem.y): void {
    this.seedTrail(x, y);
    this.lastPlayer = { x, y };
    this.cats[0]?.sprite.setPosition(x - 54, y + 32);
    this.cats[1]?.sprite.setPosition(x + 62, y + 52);
    const hand = this.scene.playerSystem.getHandPosition();
    this.ragdoll.setPosition(hand.x - 26, hand.y + 52);
    this.ragdoll.setVelocity(0, 0);
  }

  private createCat(key: string, x: number, y: number, trailDelay: number, sideOffset: number, bobOffset: number): CatCompanion {
    const sprite = this.scene.add.sprite(x, y, key);
    sprite.setScale(1.4);
    sprite.setOrigin(0.5, 0.75);
    sprite.setDepth(y);

    return {
      sprite,
      trailDelay,
      sideOffset,
      bobOffset,
      meowTimer: 2200 + Math.random() * 5000,
    };
  }

  private seedTrail(x: number, y: number): void {
    this.trail = Array.from({ length: 90 }, () => ({ x, y }));
  }

  private moveToward(sprite: Phaser.GameObjects.Sprite, targetX: number, targetY: number, speed: number, dt: number): void {
    const dx = targetX - sprite.x;
    const dy = targetY - sprite.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 1) return;

    const step = Math.min(d, speed * dt);
    sprite.x += (dx / d) * step;
    sprite.y += (dy / d) * step;
  }

  private updateRagdollPhysics(dt: number): void {
    const hand = this.scene.playerSystem.getHandPosition();
    const dollHand = this.getDollHandPosition();
    const dx = hand.x - dollHand.x;
    const dy = hand.y - dollHand.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;

    if (distance > 1) {
      const pull = Math.min(900, distance * 18);
      body.velocity.x += (dx / distance) * pull * dt;
      body.velocity.y += (dy / distance) * pull * dt;
    }

    if (distance > 54) {
      const correction = distance - 54;
      this.ragdoll.x += (dx / distance) * correction * 0.85;
      this.ragdoll.y += (dy / distance) * correction * 0.85;
    }

    body.velocity.x *= 0.94;
    body.velocity.y *= 0.94;

    const speedTilt = Phaser.Math.Clamp(body.velocity.x / 280, -1, 1) * 0.45;
    const dragTilt = Phaser.Math.Clamp((hand.x - this.ragdoll.x) / 120, -1, 1) * 0.25;
    this.ragdoll.setRotation(Phaser.Math.Linear(this.ragdoll.rotation, speedTilt + dragTilt, 0.12));
  }

  private getDollHandPosition(): { x: number; y: number } {
    const side = this.ragdoll.x < this.scene.playerSystem.x ? 1 : -1;
    return {
      x: this.ragdoll.x + side * 24,
      y: this.ragdoll.y - 18,
    };
  }

  private drawTether(): void {
    const hand = this.scene.playerSystem.getHandPosition();
    const dollHand = this.getDollHandPosition();
    this.tether.clear();
    this.tether.lineStyle(2, 0x6a4a2a, 0.65);
    this.tether.lineBetween(hand.x, hand.y, dollHand.x, dollHand.y);
    this.tether.setDepth(Math.min(hand.y, this.ragdoll.y) - 3);
  }
}
