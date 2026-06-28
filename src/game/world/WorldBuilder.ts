// ============================================================
// WorldBuilder — Assembles the seamless game world
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { WORLD_OBJECTS, AreaConfig } from '../data/worldConfig';
import { WORLD_WIDTH, WORLD_HEIGHT, COLORS, AreaKey } from '../constants';

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

  private lightenColor(color: number, amount: number): number {
    const r = Math.min(255, ((color >> 16) & 0xFF) + Math.round(255 * amount));
    const g = Math.min(255, ((color >> 8) & 0xFF) + Math.round(255 * amount));
    const b = Math.min(255, (color & 0xFF) + Math.round(255 * amount));
    return (r << 16) | (g << 8) | b;
  }
}
