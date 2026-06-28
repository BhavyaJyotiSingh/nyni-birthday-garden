// ============================================================
// FlowerSystem — Blooming Garden mechanic
// Flowers bloom where the player walks, never disappear.
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { FLOWER_CELL_SIZE, FLOWERS_PER_CLUSTER_MIN, FLOWERS_PER_CLUSTER_MAX, FLOWER_BLOOM_DURATION, MAX_ACTIVE_FLOWERS } from '../constants';
import { FLOWER_ASSET_KEYS } from '../assets/AssetManifest';
import { randInt, randFloat, randPick, cellKey } from '../utils/math';

interface FlowerSprite {
  sprite: Phaser.GameObjects.Sprite;
  bloomed: boolean;
  age: number;
}

export class FlowerSystem {
  private scene: GameScene;
  private bloomedCells: Set<string> = new Set();
  private flowers: FlowerSprite[] = [];
  private totalFlowers = 0;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  /** Try to bloom flowers at a world position */
  tryBloomAt(wx: number, wy: number): void {
    const cx = Math.floor(wx / FLOWER_CELL_SIZE);
    const cy = Math.floor(wy / FLOWER_CELL_SIZE);
    const key = cellKey(cx, cy);

    if (this.bloomedCells.has(key)) return;
    if (this.totalFlowers >= MAX_ACTIVE_FLOWERS) return;

    this.bloomedCells.add(key);

    const count = randInt(FLOWERS_PER_CLUSTER_MIN, FLOWERS_PER_CLUSTER_MAX);
    const baseX = cx * FLOWER_CELL_SIZE + FLOWER_CELL_SIZE / 2;
    const baseY = cy * FLOWER_CELL_SIZE + FLOWER_CELL_SIZE / 2;

    for (let i = 0; i < count; i++) {
      const fx = baseX + randFloat(-FLOWER_CELL_SIZE * 0.4, FLOWER_CELL_SIZE * 0.4);
      const fy = baseY + randFloat(-FLOWER_CELL_SIZE * 0.4, FLOWER_CELL_SIZE * 0.4);
      const flowerKey = randPick(FLOWER_ASSET_KEYS);
      const scale = randFloat(1.0, 2.0);
      const rotation = randFloat(-0.3, 0.3);
      const delay = i * randInt(50, 120);

      this.spawnFlower(fx, fy, flowerKey, scale, rotation, delay);
    }
  }

  private spawnFlower(x: number, y: number, textureKey: string, scale: number, rotation: number, delay: number): void {
    const sprite = this.scene.add.sprite(x, y, textureKey);
    sprite.setScale(0);
    sprite.setAlpha(0);
    sprite.setRotation(rotation);
    sprite.setDepth(y - 1); // Below player
    sprite.setOrigin(0.5, 1.0);

    const flower: FlowerSprite = { sprite, bloomed: false, age: 0 };
    this.flowers.push(flower);
    this.totalFlowers++;

    // Bloom animation with delay
    this.scene.time.delayedCall(delay, () => {
      this.scene.tweens.add({
        targets: sprite,
        scaleX: scale,
        scaleY: scale,
        alpha: 1,
        duration: FLOWER_BLOOM_DURATION,
        ease: 'Back.easeOut',
        onComplete: () => {
          flower.bloomed = true;
          this.addSparkle(x, y);
          this.startSway(sprite, scale);
        },
      });
    });
  }

  private addSparkle(x: number, y: number): void {
    // Emit a few sparkle particles
    for (let i = 0; i < 3; i++) {
      const sparkle = this.scene.add.sprite(
        x + randFloat(-8, 8),
        y + randFloat(-12, -2),
        'particle_sparkle'
      );
      sparkle.setScale(randFloat(0.5, 1.5));
      sparkle.setAlpha(0.8);
      sparkle.setDepth(y + 10);

      this.scene.tweens.add({
        targets: sparkle,
        y: sparkle.y - randFloat(8, 16),
        alpha: 0,
        scale: 0,
        duration: randInt(400, 700),
        ease: 'Cubic.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  private startSway(sprite: Phaser.GameObjects.Sprite, baseScale: number): void {
    this.scene.tweens.add({
      targets: sprite,
      rotation: sprite.rotation + randFloat(-0.08, 0.08),
      scaleX: baseScale + randFloat(-0.05, 0.05),
      duration: randInt(1800, 2500),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(_delta: number): void {
    // Update flower ages
    for (const f of this.flowers) {
      if (f.bloomed) {
        f.age += _delta;
      }
    }
  }

  getBloomedCellKeys(): string[] {
    return Array.from(this.bloomedCells);
  }

  /** Get nearby flower positions for butterfly attraction */
  getFlowersNear(x: number, y: number, radius: number): { x: number; y: number }[] {
    const results: { x: number; y: number }[] = [];
    for (const f of this.flowers) {
      if (!f.bloomed) continue;
      const dx = f.sprite.x - x;
      const dy = f.sprite.y - y;
      if (dx * dx + dy * dy < radius * radius) {
        results.push({ x: f.sprite.x, y: f.sprite.y });
      }
      if (results.length >= 5) break;
    }
    return results;
  }

  getTotalFlowers(): number {
    return this.totalFlowers;
  }
}
