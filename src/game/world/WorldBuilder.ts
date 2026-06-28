// ============================================================
// WorldBuilder — Assembles the seamless game world
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { WORLD_OBJECTS } from '../data/worldConfig';
import type { AreaConfig } from '../data/worldConfig';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../constants';
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
    this.buildGardenSpecialties();
    this.placeAreaObjects();
  }

  /** Paint the ground using textured grass and JRPG winding paths */
  private paintGround(): void {
    // 1. Full screen textured grass background
    const bg = this.scene.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'grass_tile');
    bg.setOrigin(0, 0);
    bg.setDepth(-1000);

    // 2. Draw organic winding JRPG paths
    const pathGfx = this.scene.add.graphics();
    pathGfx.setDepth(-990);

    // Draw dark border / dirt outline first
    pathGfx.lineStyle(60, 0x5a3e2a, 0.85); // outline width 60, dark brown
    this.drawPathCurves(pathGfx);

    // Draw light path fill
    pathGfx.lineStyle(48, 0xd2b48c, 0.95); // path width 48, sand/dirt color
    this.drawPathCurves(pathGfx);

    // 3. Paint water bodies and shorelines
    for (const config of WORLD_OBJECTS) {
      if (config.hasWater && config.waterBounds) {
        const wb = config.waterBounds;
        
        // Deep teal water
        const water = this.scene.add.rectangle(
          wb.x + wb.w / 2, wb.y + wb.h / 2,
          wb.w, wb.h,
          0x0c2533, 0.92
        );
        water.setDepth(-980);

        // Water shimmer overlay
        const shimmer = this.scene.add.rectangle(
          wb.x + wb.w / 2, wb.y + wb.h / 2,
          wb.w, wb.h,
          0x153c4d, 0.2
        );
        shimmer.setDepth(-979);

        // Animate water shimmer
        this.scene.tweens.add({
          targets: shimmer,
          alpha: { from: 0.1, to: 0.35 },
          duration: 2500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Shoreline border
        const shore = this.scene.add.graphics();
        shore.setDepth(-978);
        shore.lineStyle(3, 0x1f5c6b, 0.7);
        shore.strokeRect(wb.x, wb.y, wb.w, wb.h);
      }
    }
  }

  /** Helper to draw winding paths curves across the grid */
  private drawPathCurves(gfx: Phaser.GameObjects.Graphics): void {
    // ── Left Column Path (Cottage y: 6000 down to y: 1000)
    gfx.beginPath();
    gfx.moveTo(1700, 6000);
    for (let y = 6000; y >= 1000; y -= 20) {
      const x = 1700 + Math.sin(y * 0.012) * 28;
      gfx.lineTo(x, y);
    }
    gfx.strokePath();

    // ── Right Column Path (Secret Garden y: 6000 down to y: 1000)
    gfx.beginPath();
    gfx.moveTo(3100, 6000);
    for (let y = 6000; y >= 1000; y -= 20) {
      const x = 3100 + Math.cos(y * 0.01) * 32;
      gfx.lineTo(x, y);
    }
    gfx.strokePath();

    // ── Horizontal Connectors between Columns
    const horizontalYPos = [5900, 4900, 3900, 2800, 1600];
    for (const hy of horizontalYPos) {
      gfx.beginPath();
      const lx = 1700 + Math.sin(hy * 0.012) * 28;
      const rx = 3100 + Math.cos(hy * 0.01) * 32;
      gfx.moveTo(lx, hy);
      for (let x = lx; x <= rx; x += 20) {
        const y = hy + Math.sin(x * 0.008) * 12;
        gfx.lineTo(x, y);
      }
      gfx.strokePath();
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

        if (obj.id) {
          (sprite as any).id = obj.id;
        }

        this.worldObjects.push(sprite);

        // Collision
        if (obj.collides) {
          this.scene.physics.add.existing(sprite, true); // static body
          const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
          body.setSize(sprite.width * 0.6, sprite.height * 0.3);
          body.setOffset(sprite.width * 0.2, sprite.height * 0.6);

          // Collide with player
          const playerSprite = this.scene.playerSystem.gameObject;
          this.scene.physics.add.collider(playerSprite, sprite);
        }

        // Register as interactable
        if (obj.interactive) {
          this.scene.interactionSystem.registerInteractable({
            id: obj.id ?? `${config.key}_${obj.type}_${objectId}`,
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

  private buildGardenSpecialties(): void {
    this.buildGardenMaze();
    this.spawnCentralPlazaFlowerMessage();
  }

  /** Spawns a physical hedge maze in the Maze area */
  private buildGardenMaze(): void {
    // Maze bounds: x: 1000, y: 2200, w: 1400, h: 1200
    // Draw vertical and horizontal hedge segments using 'bush' sprites
    const addHedge = (x: number, y: number) => {
      const sprite = this.scene.add.sprite(x, y, 'bush');
      sprite.setScale(1.2);
      sprite.setOrigin(0.5, 0.85);
      sprite.setDepth(y);
      this.worldObjects.push(sprite);

      this.scene.physics.add.existing(sprite, true);
      const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(sprite.width * 0.7, sprite.height * 0.4);
      body.setOffset(sprite.width * 0.15, sprite.height * 0.5);

      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, sprite);
    };

    // Draw boundary walls
    for (let x = 1000; x <= 2400; x += 48) {
      if (x < 1650 || x > 1750) { // Entry gap at bottom center
        addHedge(x, 3350);
      }
      if (x < 1700 || x > 1900) { // Exit gap at top right
        addHedge(x, 2220);
      }
    }

    for (let y = 2220; y <= 3350; y += 42) {
      addHedge(980, y);
      addHedge(2420, y);
    }

    // Maze inner walls (Horizontal and Vertical)
    // Wall 1
    for (let x = 1150; x <= 1500; x += 45) addHedge(x, 3050);
    // Wall 2
    for (let y = 2500; y <= 3000; y += 42) addHedge(1400, y);
    // Wall 3
    for (let x = 1400; x <= 1900; x += 45) addHedge(x, 2500);
    // Wall 4
    for (let y = 2700; y <= 3100; y += 42) addHedge(1800, y);
    // Wall 5
    for (let x = 1800; x <= 2200; x += 45) addHedge(x, 2900);
    // Wall 6
    for (let y = 2300; y <= 2700; y += 42) addHedge(2100, y);
  }

  /** Spells out N Y N I in flowers inside a heart outline in the Central Plaza */
  private spawnCentralPlazaFlowerMessage(): void {
    const cx = 3100;
    const cy = 3850; // just north of the fountain

    // Pink cherry blossom flowers heart outline
    const heartOffsets = [
      { dx: 0, dy: 70 }, { dx: -30, dy: 55 }, { dx: 30, dy: 55 },
      { dx: -60, dy: 35 }, { dx: 60, dy: 35 }, { dx: -90, dy: 10 },
      { dx: 90, dy: 10 }, { dx: -110, dy: -15 }, { dx: 110, dy: -15 },
      { dx: -120, dy: -40 }, { dx: 120, dy: -40 }, { dx: -120, dy: -65 },
      { dx: 120, dy: -65 }, { dx: -110, dy: -90 }, { dx: 110, dy: -90 },
      { dx: -90, dy: -110 }, { dx: 90, dy: -110 }, { dx: -60, dy: -120 },
      { dx: 60, dy: -120 }, { dx: -30, dy: -110 }, { dx: 30, dy: -110 },
      { dx: 0, dy: -90 }
    ];

    for (const offset of heartOffsets) {
      const sprite = this.scene.add.sprite(cx + offset.dx, cy + offset.dy, 'flower_cherry');
      sprite.setScale(1.5);
      sprite.setDepth(cy + offset.dy);
      sprite.setOrigin(0.5, 0.95);
      this.worldObjects.push(sprite);
    }

    // Spell N Y N I with golden sunflowers
    const letterOffsets = [
      // N
      { dx: -70, dy: -40 }, { dx: -70, dy: -25 }, { dx: -70, dy: -10 }, { dx: -70, dy: 5 }, { dx: -70, dy: 20 },
      { dx: -55, dy: -25 }, { dx: -40, dy: -10 }, { dx: -25, dy: 5 },
      { dx: -10, dy: -40 }, { dx: -10, dy: -25 }, { dx: -10, dy: -10 }, { dx: -10, dy: 5 }, { dx: -10, dy: 20 },

      // Y
      { dx: 20, dy: 5 }, { dx: 20, dy: 20 },
      { dx: 20, dy: -10 }, { dx: 5, dy: -25 }, { dx: -10, dy: -40 },
      { dx: 35, dy: -25 }, { dx: 50, dy: -40 },

      // N (second)
      { dx: 35, dy: -40 }, { dx: 35, dy: -25 }, { dx: 35, dy: -10 }, { dx: 35, dy: 5 }, { dx: 35, dy: 20 },
      { dx: 50, dy: -25 }, { dx: 65, dy: -10 }, { dx: 80, dy: 5 },
      { dx: 95, dy: -40 }, { dx: 95, dy: -25 }, { dx: 95, dy: -10 }, { dx: 95, dy: 5 }, { dx: 95, dy: 20 },

      // I
      { dx: 110, dy: -40 }, { dx: 120, dy: -40 }, { dx: 130, dy: -40 },
      { dx: 120, dy: -25 }, { dx: 120, dy: -10 }, { dx: 120, dy: 5 },
      { dx: 110, dy: 20 }, { dx: 120, dy: 20 }, { dx: 130, dy: 20 }
    ];

    for (const offset of letterOffsets) {
      // Offset all letters slightly upward to center inside the heart
      const sprite = this.scene.add.sprite(cx + offset.dx - 10, cy + offset.dy - 35, 'flower_sunflower');
      sprite.setScale(1.4);
      sprite.setDepth(cy + offset.dy - 35);
      sprite.setOrigin(0.5, 0.95);
      this.worldObjects.push(sprite);
    }
  }

  private isInWater(px: number, py: number, config: AreaConfig): boolean {
    if (!config.waterBounds) return false;
    const wb = config.waterBounds;
    return px >= wb.x && px <= wb.x + wb.w && py >= wb.y && py <= wb.y + wb.h;
  }
}
