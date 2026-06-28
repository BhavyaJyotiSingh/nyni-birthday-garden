// ============================================================
// CompanionSystem - Two cats follow the player; a ragdoll drags behind.
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

interface CatCompanion {
  sprite: Phaser.GameObjects.Sprite;
  offsetX: number;
  offsetY: number;
  meowTimer: number;
  bobOffset: number;
}

export class CompanionSystem {
  private scene: GameScene;
  private cats: CatCompanion[] = [];
  private ragdoll: Phaser.GameObjects.Sprite;
  private tether: Phaser.GameObjects.Graphics;
  private ragdollTarget = { x: 0, y: 0 };

  constructor(scene: GameScene) {
    this.scene = scene;
    const px = scene.playerSystem.x;
    const py = scene.playerSystem.y;

    this.cats = [
      this.createCat('cat_orange', px - 42, py + 34, -38, 34, 0.2),
      this.createCat('cat_gray', px + 44, py + 44, 42, 44, 1.7),
    ];

    this.ragdollTarget = { x: px - 18, y: py + 62 };
    this.tether = scene.add.graphics();
    this.tether.setDepth(py - 4);

    this.ragdoll = scene.add.sprite(this.ragdollTarget.x, this.ragdollTarget.y, 'ragdoll_cross_eyes');
    this.ragdoll.setScale(1.35);
    this.ragdoll.setOrigin(0.5, 0.7);
    this.ragdoll.setDepth(this.ragdoll.y - 2);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    for (const cat of this.cats) {
      const targetX = px + cat.offsetX + Math.sin(this.scene.time.now * 0.0012 + cat.bobOffset) * 10;
      const targetY = py + cat.offsetY + Math.cos(this.scene.time.now * 0.001 + cat.bobOffset) * 8;
      this.moveToward(cat.sprite, targetX, targetY, 175, dt);

      const bob = Math.sin(this.scene.time.now * 0.014 + cat.bobOffset) * 0.04;
      cat.sprite.setScale(1.45, 1.35 + bob);
      cat.sprite.setFlipX(cat.sprite.x > px);
      cat.sprite.setDepth(cat.sprite.y);

      cat.meowTimer -= delta;
      if (cat.meowTimer <= 0) {
        this.scene.audioSystem.playMeow();
        cat.meowTimer = 4500 + Math.random() * 9500;
      }
    }

    this.ragdollTarget.x = px - 18 + Math.sin(this.scene.time.now * 0.002) * 9;
    this.ragdollTarget.y = py + 62;
    this.moveToward(this.ragdoll, this.ragdollTarget.x, this.ragdollTarget.y, 120, dt);
    this.ragdoll.setRotation(Math.sin(this.scene.time.now * 0.006) * 0.24 - 0.18);
    this.ragdoll.setDepth(this.ragdoll.y - 2);
    this.drawTether(px, py);
  }

  private createCat(key: string, x: number, y: number, offsetX: number, offsetY: number, bobOffset: number): CatCompanion {
    const sprite = this.scene.add.sprite(x, y, key);
    sprite.setScale(1.4);
    sprite.setOrigin(0.5, 0.75);
    sprite.setDepth(y);

    return {
      sprite,
      offsetX,
      offsetY,
      bobOffset,
      meowTimer: 2200 + Math.random() * 5000,
    };
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

  private drawTether(px: number, py: number): void {
    this.tether.clear();
    this.tether.lineStyle(2, 0x6a4a2a, 0.65);
    this.tether.lineBetween(px - 5, py + 16, this.ragdoll.x - 2, this.ragdoll.y - 12);
    this.tether.setDepth(Math.min(py, this.ragdoll.y) - 3);
  }
}
