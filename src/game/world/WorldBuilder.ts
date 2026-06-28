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
    this.buildDenseTown();
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

  private buildDenseTown(): void {
    const entrance = this.areaConfigs.get('entranceGarden');
    const meadow = this.areaConfigs.get('flowerMeadow');
    if (!entrance || !meadow) return;

    this.buildBoundaryWalls(entrance.bounds, [
      { side: 'top', from: 2320, to: 2480 },
      { side: 'bottom', from: 2320, to: 2480 },
    ]);
    this.buildBoundaryWalls(meadow.bounds, [
      { side: 'top', from: 2320, to: 2480 },
      { side: 'bottom', from: 2320, to: 2480 },
    ]);

    this.buildRoad(2400, 120, 2400, 1660);
    this.buildRoad(1810, 420, 2990, 420);
    this.buildRoad(1560, 1130, 3260, 1130);
    this.buildRoad(1940, 830, 1940, 1520);
    this.buildRoad(2860, 850, 2860, 1580);

    const houses = [
      { x: 1840, y: 190, roof: 2 },
      { x: 2050, y: 225, roof: 0 },
      { x: 2740, y: 200, roof: 1 },
      { x: 2970, y: 245, roof: 2 },
      { x: 1740, y: 565, roof: 1 },
      { x: 3060, y: 590, roof: 0 },
      { x: 1600, y: 990, roof: 0 },
      { x: 1830, y: 1320, roof: 2 },
      { x: 3120, y: 980, roof: 1 },
      { x: 2880, y: 1390, roof: 0 },
      { x: 2280, y: 1475, roof: 2 },
    ];

    for (const house of houses) {
      this.stampHouse(house.x, house.y, house.roof);
    }

    this.stampMarket(2110, 540);
    this.stampMarket(2675, 540);
    this.stampFarmPlot(1390, 1410, 5, 3);
    this.stampFarmPlot(3230, 1410, 5, 3);
    this.stampTownProps();
    this.spawnTownNpcs();
  }

  private buildBoundaryWalls(
    bounds: { x: number; y: number; w: number; h: number },
    gates: { side: 'top' | 'bottom' | 'left' | 'right'; from: number; to: number }[],
  ): void {
    const step = 32;
    for (let x = bounds.x; x <= bounds.x + bounds.w; x += step) {
      if (!this.isGate('top', x, gates)) this.addTownTile(x, bounds.y + 18, 19, 2, bounds.y + 40, true);
      if (!this.isGate('bottom', x, gates)) this.addTownTile(x, bounds.y + bounds.h - 18, 19, 2, bounds.y + bounds.h, true);
    }

    for (let y = bounds.y + step; y <= bounds.y + bounds.h - step; y += step) {
      if (!this.isGate('left', y, gates)) this.addTownTile(bounds.x + 18, y, 18, 2, y, true);
      if (!this.isGate('right', y, gates)) this.addTownTile(bounds.x + bounds.w - 18, y, 18, 2, y, true);
    }
  }

  private isGate(side: 'top' | 'bottom' | 'left' | 'right', position: number, gates: { side: 'top' | 'bottom' | 'left' | 'right'; from: number; to: number }[]): boolean {
    return gates.some(gate => gate.side === side && position >= gate.from && position <= gate.to);
  }

  private buildRoad(x1: number, y1: number, x2: number, y2: number): void {
    const vertical = Math.abs(y2 - y1) >= Math.abs(x2 - x1);
    const step = 32;
    if (vertical) {
      const from = Math.min(y1, y2);
      const to = Math.max(y1, y2);
      for (let y = from; y <= to; y += step) {
        this.addTownTile(x1 - 16, y, 24, 2, y - 18, false, 0.92);
        this.addTownTile(x1 + 16, y, 24, 2, y - 18, false, 0.92);
      }
      return;
    }

    const from = Math.min(x1, x2);
    const to = Math.max(x1, x2);
    for (let x = from; x <= to; x += step) {
      this.addTownTile(x, y1 - 16, 24, 2, y1 - 18, false, 0.92);
      this.addTownTile(x, y1 + 16, 24, 2, y1 - 18, false, 0.92);
    }
  }

  private stampHouse(x: number, y: number, roofVariant: number): void {
    const roofRows = roofVariant === 0 ? [73, 74, 75] : roofVariant === 1 ? [60, 61, 62] : [84, 85, 86];
    const wallRows = roofVariant === 2 ? [96, 97, 98] : [72, 73, 74];
    const lowerRows = [108, 109, 110];

    for (let col = 0; col < 3; col++) {
      this.addTownTile(x + col * 32, y, roofRows[col], 2, y + 2, true);
      this.addTownTile(x + col * 32, y + 32, wallRows[col], 2, y + 34, true);
      this.addTownTile(x + col * 32, y + 64, lowerRows[col], 2, y + 72, true);
    }

    this.addTownTile(x + 32, y + 64, 57, 2, y + 76, true);
    this.addTownTile(x - 36, y + 70, 118, 1.6, y + 70, false);
    this.addTownTile(x + 132, y + 62, 125, 1.6, y + 62, false);
  }

  private stampMarket(x: number, y: number): void {
    const frames = [111, 112, 113, 114, 115, 116, 117, 118];
    for (let i = 0; i < frames.length; i++) {
      this.addTownTile(x + (i % 4) * 38, y + Math.floor(i / 4) * 36, frames[i], 1.7, y + 20 + i, false);
    }
  }

  private stampFarmPlot(x: number, y: number, cols: number, rows: number): void {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.addTownTile(x + col * 32, y + row * 30, 102 + ((row + col) % 4), 1.8, y + row * 30, false, 0.95);
      }
    }
  }

  private stampTownProps(): void {
    const props = [
      { x: 2240, y: 385, frame: 94 }, { x: 2560, y: 388, frame: 95 },
      { x: 2330, y: 505, frame: 118 }, { x: 2475, y: 505, frame: 119 },
      { x: 1960, y: 1080, frame: 125 }, { x: 2845, y: 1085, frame: 126 },
      { x: 2140, y: 1220, frame: 120 }, { x: 2620, y: 1225, frame: 121 },
      { x: 1525, y: 1280, frame: 127 }, { x: 3300, y: 1280, frame: 128 },
    ];

    for (const prop of props) {
      this.addTownTile(prop.x, prop.y, prop.frame, 1.8, prop.y, false);
    }
  }

  private spawnTownNpcs(): void {
    const npcs = [
      { x: 2200, y: 430, tint: 0x88c0ff },
      { x: 2605, y: 430, tint: 0xffc070 },
      { x: 1860, y: 1115, tint: 0xa8e090 },
      { x: 2790, y: 1130, tint: 0xe0a0ff },
      { x: 2350, y: 1350, tint: 0xffffff },
      { x: 3110, y: 1240, tint: 0xffa0a0 },
      { x: 1650, y: 1240, tint: 0xa0f0f0 },
    ];

    npcs.forEach((npc, index) => {
      const sprite = this.scene.add.sprite(npc.x, npc.y, 'npc_idle');
      sprite.setScale(1.75);
      sprite.setOrigin(0.5, 0.8);
      sprite.setDepth(npc.y);
      sprite.setTint(npc.tint);
      this.scene.tweens.add({
        targets: sprite,
        x: npc.x + (index % 2 === 0 ? 26 : -26),
        yoyo: true,
        repeat: -1,
        duration: 2200 + index * 180,
        ease: 'Sine.easeInOut',
        onUpdate: () => sprite.setDepth(sprite.y),
      });
      this.worldObjects.push(sprite);
    });
  }

  private addTownTile(
    x: number,
    y: number,
    frame: number,
    scale: number,
    depth: number,
    collides: boolean,
    alpha = 1,
  ): Phaser.GameObjects.Sprite {
    const sprite = this.scene.add.sprite(x, y, 'tiny_town_tiles', frame);
    sprite.setScale(scale);
    sprite.setDepth(depth);
    sprite.setAlpha(alpha);
    sprite.setOrigin(0.5, 0.5);
    this.worldObjects.push(sprite);

    if (collides) {
      this.scene.physics.add.existing(sprite, true);
      const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(14 * scale, 12 * scale);
      body.setOffset((16 * scale - 14 * scale) / 2, (16 * scale - 12 * scale) / 2);
      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, sprite);
    }

    return sprite;
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
