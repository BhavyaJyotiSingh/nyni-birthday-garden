// ============================================================
// WorldBuilder — Assembles the seamless game world
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { WORLD_OBJECTS } from '../data/worldConfig';
import type { AreaConfig } from '../data/worldConfig';
import { WORLD_WIDTH, WORLD_HEIGHT, COLORS } from '../constants';
import type { AreaKey } from '../constants';

export class WorldBuilder {
  private scene: GameScene;
  private areaConfigs: Map<string, AreaConfig> = new Map();
  private worldObjects: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;
    for (const config of WORLD_OBJECTS) {
      this.areaConfigs.set(config.key, config);
    }
  }

  getAreaConfig(key: AreaKey): AreaConfig | undefined {
    return this.areaConfigs.get(key);
  }

  build(): void {
    this.paintGround();
    this.addDenseRpgDecoration();
    this.placeAreaObjects();
  }

  /** Paint the ground using colored rectangles for each area */
  private paintGround(): void {
    // World background (dark grass)
    const worldBg = this.scene.add.rectangle(
      WORLD_WIDTH / 2, WORLD_HEIGHT / 2,
      WORLD_WIDTH, WORLD_HEIGHT,
      0x2a5a20
    );
    worldBg.setDepth(-1000);

    // Paint each area
    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;

      // Ground
      const ground = this.scene.add.rectangle(
        x + w / 2, y + h / 2,
        w, h,
        config.groundColor
      );
      ground.setDepth(-999);

      // Subtle variation patches
      for (let i = 0; i < 8; i++) {
        const patchX = x + Math.random() * w;
        const patchY = y + Math.random() * h;
        const patchW = 80 + Math.random() * 160;
        const patchH = 60 + Math.random() * 120;
        const patch = this.scene.add.rectangle(
          patchX, patchY, patchW, patchH,
          this.lightenColor(config.groundColor, 0.08),
          0.3
        );
        patch.setDepth(-998);
      }

      // Water areas
      if (config.hasWater && config.waterBounds) {
        const wb = config.waterBounds;
        const water = this.scene.add.rectangle(
          wb.x + wb.w / 2, wb.y + wb.h / 2,
          wb.w, wb.h,
          COLORS.waterMid, 0.85
        );
        water.setDepth(-997);

        // Water shimmer overlay
        const shimmer = this.scene.add.rectangle(
          wb.x + wb.w / 2, wb.y + wb.h / 2,
          wb.w, wb.h,
          COLORS.waterLight, 0.15
        );
        shimmer.setDepth(-996);

        // Animate shimmer
        this.scene.tweens.add({
          targets: shimmer,
          alpha: { from: 0.05, to: 0.2 },
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Water edge/shore
        const shore = this.scene.add.rectangle(
          wb.x + wb.w / 2, wb.y,
          wb.w + 20, 8,
          COLORS.waterFoam, 0.4
        );
        shore.setDepth(-995);
      }

      // Area border glow (subtle transition)
      const borderGfx = this.scene.add.graphics();
      borderGfx.setDepth(-990);
      borderGfx.lineStyle(2, 0xffffff, 0.03);
      borderGfx.strokeRect(x, y, w, h);
    }
  }

  /** Place all objects defined in world config */
  private placeAreaObjects(): void {
    let objectId = 0;

    for (const config of WORLD_OBJECTS) {
      for (const obj of config.objects) {
        const sprite = this.scene.add.sprite(obj.x, obj.y, obj.type);
        sprite.setScale(obj.scale ?? 1);
        sprite.setDepth(obj.depth ?? obj.y);
        sprite.setOrigin(0.5, 0.8);

        this.worldObjects.push(sprite);

        // Collision
        if (obj.collides) {
          this.scene.physics.add.existing(sprite, true); // static body
          const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
          // Adjust collision box to be smaller than sprite
          body.setSize(sprite.width * 0.6, sprite.height * 0.3);
          body.setOffset(sprite.width * 0.2, sprite.height * 0.6);

          // Collide with player
          const playerSprite = this.scene.playerSystem.gameObject;
          this.scene.physics.add.collider(playerSprite, sprite);
        }

        // Register as interactable
        if (obj.interactive) {
          this.scene.interactionSystem.registerInteractable({
            id: `${config.key}_${obj.type}_${objectId}`,
            x: obj.x,
            y: obj.y,
            type: obj.interactionType ?? obj.type,
            dialogueId: obj.dialogueId,
            sprite: sprite,
          });
        }

        objectId++;
      }
    }
  }

  private addDenseRpgDecoration(): void {
    const decorationKeys = ['tall_grass', 'flower_daisy', 'flower_lavender', 'flower_wild', 'flower_rose'];

    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;
      const density = config.key === 'crystalLake' ? 55 : config.key === 'sunflowerField' ? 90 : 75;

      // Soft tile speckles make the rectangle ground read more like 16-bit terrain.
      for (let i = 0; i < density; i++) {
        const px = x + 40 + Math.random() * (w - 80);
        const py = y + 40 + Math.random() * (h - 80);
        if (this.isInWater(px, py, config)) continue;

        const key = decorationKeys[Math.floor(Math.random() * decorationKeys.length)];
        const sprite = this.scene.add.sprite(px, py, key);
        sprite.setScale(0.65 + Math.random() * 0.75);
        sprite.setRotation((Math.random() - 0.5) * 0.25);
        sprite.setAlpha(0.78);
        sprite.setOrigin(0.5, 1);
        sprite.setDepth(py - 8);
        this.worldObjects.push(sprite);
      }

      // Denser edge planting frames the areas without blocking paths.
      const edgeCount = Math.max(12, Math.floor((w + h) / 160));
      for (let i = 0; i < edgeCount; i++) {
        const side = i % 4;
        const px = side < 2 ? x + Math.random() * w : x + (side === 2 ? 35 : w - 35);
        const py = side >= 2 ? y + Math.random() * h : y + (side === 0 ? 35 : h - 35);
        const key = Math.random() < 0.55 ? 'bush' : (config.key.includes('cherry') || config.key === 'birthdayGarden' ? 'tree_cherry' : 'tree_oak');
        const sprite = this.scene.add.sprite(px, py, key);
        sprite.setScale(key === 'bush' ? 0.75 + Math.random() * 0.45 : 0.75 + Math.random() * 0.35);
        sprite.setOrigin(0.5, 0.8);
        sprite.setDepth(py);
        this.worldObjects.push(sprite);
      }

      if (config.hasWater && config.waterBounds) {
        const wb = config.waterBounds;
        for (let i = 0; i < 34; i++) {
          const sideY = Math.random() < 0.5 ? wb.y + 8 : wb.y + wb.h - 8;
          const reed = this.scene.add.sprite(wb.x + Math.random() * wb.w, sideY + (Math.random() - 0.5) * 28, Math.random() < 0.5 ? 'reed' : 'cattail');
          reed.setScale(0.75 + Math.random() * 0.55);
          reed.setOrigin(0.5, 1);
          reed.setDepth(reed.y);
          this.worldObjects.push(reed);
        }
      }
    }
  }

  private isInWater(px: number, py: number, config: AreaConfig): boolean {
    if (!config.waterBounds) return false;
    const wb = config.waterBounds;
    return px >= wb.x && px <= wb.x + wb.w && py >= wb.y && py <= wb.y + wb.h;
  }

  private lightenColor(color: number, amount: number): number {
    const r = Math.min(255, ((color >> 16) & 0xFF) + Math.round(255 * amount));
    const g = Math.min(255, ((color >> 8) & 0xFF) + Math.round(255 * amount));
    const b = Math.min(255, (color & 0xFF) + Math.round(255 * amount));
    return (r << 16) | (g << 8) | b;
  }
}
