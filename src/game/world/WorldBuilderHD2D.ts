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
  private rngSeed = 13579;

  constructor(scene: GameScene) {
    this.scene = scene;
    for (const config of WORLD_OBJECTS) this.areaConfigs.set(config.key, config);
  }

  getAreaConfig(key: AreaKey): AreaConfig | undefined {
    return this.areaConfigs.get(key);
  }

  build(): void {
    this.paintReferenceMap();
    this.addParallaxCanopy();
    this.addHandPlacedDensity();
    this.buildGardenSpecialties();
    this.placeAreaObjects();
    this.addAtmosphereLayers();
  }

  private paintReferenceMap(): void {
    this.scene.cameras.main.setBackgroundColor('#071018');

    const bg = this.scene.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'grass_tile');
    bg.setOrigin(0, 0);
    bg.setTint(0x355c34);
    bg.setDepth(-1200);

    this.paintAreaGround();
    this.paintReferencePaths();
    this.paintWaterFeatures();
    this.paintElevation();
  }

  private paintAreaGround(): void {
    const palettes: Record<string, number> = {
      cottage: 0x365f39,
      secretGarden: 0x2f5934,
      roseGarden: 0x416f3f,
      crystalLake: 0x314f45,
      greenhouse: 0x556b32,
      centralPlaza: 0x405f3a,
      maze: 0x273f32,
      cherryGarden: 0x3c5a3f,
      forgottenChurch: 0x313945,
      observatory: 0x16223a,
    };

    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;
      const color = palettes[config.key] ?? config.groundColor;
      const base = this.scene.add.rectangle(x + w / 2, y + h / 2, w, h, color, 0.92);
      base.setDepth(-1190);

      const texture = this.scene.add.graphics();
      texture.setDepth(-1188);
      texture.fillStyle(0xffffff, 0.045);
      for (let i = 0; i < 80; i++) {
        const px = x + this.rand() * w;
        const py = y + this.rand() * h;
        const size = 8 + this.rand() * 20;
        texture.fillEllipse(px, py, size, size * 0.5);
      }
    }
  }

  private paintReferencePaths(): void {
    const gfx = this.scene.add.graphics();
    gfx.setDepth(-1060);

    const drawPath = (points: Phaser.Math.Vector2[]) => {
      gfx.lineStyle(78, 0x432e25, 0.55);
      this.strokeSpline(gfx, points);
      gfx.lineStyle(62, 0xb99a68, 0.95);
      this.strokeSpline(gfx, points);
      gfx.lineStyle(38, 0xd8c18b, 0.9);
      this.strokeSpline(gfx, points);
      gfx.lineStyle(3, 0xf3dfaa, 0.25);
      this.strokeSpline(gfx, points);
    };

    drawPath([
      new Phaser.Math.Vector2(1600, 6000),
      new Phaser.Math.Vector2(2050, 5850),
      new Phaser.Math.Vector2(2900, 5900),
      new Phaser.Math.Vector2(3350, 5700),
    ]);
    drawPath([
      new Phaser.Math.Vector2(1700, 6000),
      new Phaser.Math.Vector2(1700, 5150),
      new Phaser.Math.Vector2(1650, 4650),
      new Phaser.Math.Vector2(2100, 4450),
      new Phaser.Math.Vector2(3100, 4680),
    ]);
    drawPath([
      new Phaser.Math.Vector2(3100, 5200),
      new Phaser.Math.Vector2(3150, 4550),
      new Phaser.Math.Vector2(2450, 3820),
      new Phaser.Math.Vector2(1700, 3900),
      new Phaser.Math.Vector2(1700, 3350),
    ]);
    drawPath([
      new Phaser.Math.Vector2(1700, 3400),
      new Phaser.Math.Vector2(2100, 3030),
      new Phaser.Math.Vector2(2750, 3000),
      new Phaser.Math.Vector2(3200, 2550),
    ]);
    drawPath([
      new Phaser.Math.Vector2(2100, 2900),
      new Phaser.Math.Vector2(1800, 2250),
      new Phaser.Math.Vector2(2200, 1700),
      new Phaser.Math.Vector2(2400, 920),
      new Phaser.Math.Vector2(2400, 420),
    ]);

    for (let i = 0; i < 260; i++) {
      const cluster = WORLD_OBJECTS[Math.floor(this.rand() * WORLD_OBJECTS.length)];
      const px = cluster.bounds.x + 80 + this.rand() * (cluster.bounds.w - 160);
      const py = cluster.bounds.y + 80 + this.rand() * (cluster.bounds.h - 160);
      if (this.rand() < 0.45) this.addSprite('stone_path', px, py, 0.45 + this.rand() * 0.35, py - 20, 0.65);
    }
  }

  private strokeSpline(gfx: Phaser.GameObjects.Graphics, points: Phaser.Math.Vector2[]): void {
    const curve = new Phaser.Curves.Spline(points);
    const samples = curve.getPoints(points.length * 18);
    gfx.beginPath();
    gfx.moveTo(samples[0].x, samples[0].y);
    for (const p of samples) gfx.lineTo(p.x, p.y);
    gfx.strokePath();
  }

  private paintWaterFeatures(): void {
    const water = this.scene.add.graphics();
    water.setDepth(-1100);

    this.drawPond(water, 2800, 4620, 760, 490);
    this.drawPond(water, 1260, 5560, 370, 250);
    this.drawPond(water, 3060, 3650, 360, 210);

    const bridge = this.addSprite('bridge_h', 3110, 4910, 2.0, 4910);
    (bridge as any).id = 'crystal_lake_bridge';
    this.scene.physics.add.existing(bridge, true);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, bridge);

    for (let i = 0; i < 46; i++) {
      const x = 2630 + this.rand() * 920;
      const y = 4620 + this.rand() * 520;
      const lily = this.addSprite(this.rand() > 0.2 ? 'lily_pad' : 'flower_lily', x, y, 0.7 + this.rand() * 0.6, y - 5, 0.9);
      this.scene.tweens.add({
        targets: lily,
        y: y + 4,
        duration: 1800 + this.rand() * 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private drawPond(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    gfx.fillStyle(0x092538, 0.95);
    gfx.fillEllipse(cx, cy, w, h);
    gfx.fillStyle(0x14607a, 0.7);
    gfx.fillEllipse(cx + w * 0.03, cy - h * 0.05, w * 0.86, h * 0.72);
    gfx.fillStyle(0x6fb6be, 0.14);
    for (let i = 0; i < 12; i++) {
      gfx.fillEllipse(cx - w * 0.32 + this.rand() * w * 0.64, cy - h * 0.2 + this.rand() * h * 0.4, 80 + this.rand() * 120, 4);
    }
    gfx.lineStyle(18, 0x263f2d, 0.95);
    gfx.strokeEllipse(cx, cy, w, h);
    gfx.lineStyle(6, 0xb89f73, 0.7);
    gfx.strokeEllipse(cx, cy, w + 10, h + 10);
  }

  private paintElevation(): void {
    const gfx = this.scene.add.graphics();
    gfx.setDepth(-1080);
    const cliffRows = [
      { x: 2400, y: 5350, w: 1400 },
      { x: 1000, y: 4370, w: 1400 },
      { x: 2400, y: 3370, w: 1400 },
      { x: 1000, y: 2170, w: 1400 },
      { x: 1400, y: 980, w: 2000 },
    ];
    for (const row of cliffRows) {
      gfx.fillStyle(0x2b281f, 0.68);
      for (let x = row.x; x < row.x + row.w; x += 42) {
        gfx.fillRect(x, row.y + Math.sin(x * 0.02) * 12, 38, 42);
      }
      gfx.lineStyle(5, 0x7d6a45, 0.65);
      gfx.lineBetween(row.x, row.y, row.x + row.w, row.y);
    }
  }

  private placeAreaObjects(): void {
    let objectId = 0;

    for (const config of WORLD_OBJECTS) {
      for (const obj of config.objects) {
        const sprite = this.scene.add.sprite(obj.x, obj.y, obj.type);
        sprite.setScale(obj.scale ?? 1);
        sprite.setDepth(obj.depth ?? obj.y);
        sprite.setOrigin(0.5, 0.82);

        if (obj.id) (sprite as any).id = obj.id;
        this.worldObjects.push(sprite);

        if (obj.collides) {
          this.scene.physics.add.existing(sprite, true);
          const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
          body.setSize(sprite.width * 0.6, sprite.height * 0.3);
          body.setOffset(sprite.width * 0.2, sprite.height * 0.6);
          this.scene.physics.add.collider(this.scene.playerSystem.gameObject, sprite);
        }

        if (obj.interactive) {
          this.scene.interactionSystem.registerInteractable({
            id: obj.id ?? `${config.key}_${obj.type}_${objectId}`,
            x: obj.x,
            y: obj.y,
            type: obj.interactionType ?? obj.type,
            dialogueId: obj.dialogueId,
            sprite,
          });
        }

        objectId++;
      }
    }
  }

  private addParallaxCanopy(): void {
    const far = this.scene.add.graphics();
    far.setScrollFactor(0.28);
    far.setDepth(-1150);
    far.fillStyle(0x071018, 0.5);
    for (let i = 0; i < 34; i++) {
      far.fillEllipse(200 + i * 150, 120 + Math.sin(i) * 30, 180, 95);
    }
  }

  private addHandPlacedDensity(): void {
    const decorationKeys = ['tall_grass', 'flower_daisy', 'flower_lavender', 'flower_wild', 'flower_rose', 'flower_cherry'];

    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;
      const density = config.key === 'crystalLake' ? 95 : config.key === 'greenhouse' ? 170 : 135;

      for (let i = 0; i < density; i++) {
        const px = x + 35 + this.rand() * (w - 70);
        const py = y + 35 + this.rand() * (h - 70);
        if (this.isInWater(px, py, config)) continue;

        const key = this.pickDecoration(config.key, decorationKeys);
        const sprite = this.addSprite(key, px, py, 0.55 + this.rand() * 0.8, py - 8, 0.72 + this.rand() * 0.2);
        sprite.setRotation((this.rand() - 0.5) * 0.22);
        if (key === 'tall_grass' || key.startsWith('flower_')) this.animateFoliage(sprite);
      }

      const edgeCount = Math.max(24, Math.floor((w + h) / 80));
      for (let i = 0; i < edgeCount; i++) {
        const side = i % 4;
        const px = side < 2 ? x + this.rand() * w : x + (side === 2 ? 42 : w - 42);
        const py = side >= 2 ? y + this.rand() * h : y + (side === 0 ? 44 : h - 44);
        const key = this.rand() < 0.58 ? 'bush' : (config.key === 'cherryGarden' || config.key === 'observatory' ? 'tree_cherry' : this.rand() < 0.35 ? 'tree_willow' : 'tree_oak');
        const sprite = this.addSprite(key, px, py, key === 'bush' ? 0.8 + this.rand() * 0.45 : 0.82 + this.rand() * 0.45, py);
        this.animateFoliage(sprite);
      }

      if (config.hasWater && config.waterBounds) {
        const wb = config.waterBounds;
        for (let i = 0; i < 70; i++) {
          const sideY = this.rand() < 0.5 ? wb.y + 8 : wb.y + wb.h - 8;
          const reed = this.addSprite(this.rand() < 0.5 ? 'reed' : 'cattail', wb.x + this.rand() * wb.w, sideY + (this.rand() - 0.5) * 42, 0.75 + this.rand() * 0.55);
          this.animateFoliage(reed);
        }
      }
    }

    this.composeHeroScenes();
  }

  private composeHeroScenes(): void {
    this.addSprite('gazebo', 2050, 5620, 2.3, 5620);
    this.addSprite('bench', 1460, 5840, 1.6, 5840);
    this.addSprite('flower_arch', 2280, 5890, 1.9, 5890);

    for (let i = 0; i < 120; i++) {
      const px = 1080 + this.rand() * 1240;
      const py = 4440 + this.rand() * 840;
      this.addSprite(this.rand() < 0.55 ? 'flower_sunflower' : 'flower_wild', px, py, 0.85 + this.rand() * 0.55, py - 4);
    }

    this.addSprite('dock', 2860, 4540, 2.4, 4540);
    for (let i = 0; i < 18; i++) this.addSprite('rock_small', 2550 + this.rand() * 1050, 4480 + this.rand() * 800, 0.75 + this.rand() * 0.7);

    this.addSprite('tree_big_cherry', 3100, 2680, 2.35, 2680);
    for (let i = 0; i < 26; i++) this.addSprite('tree_cherry', 2470 + this.rand() * 1180, 2250 + this.rand() * 1020, 1 + this.rand() * 0.8);

    this.addSprite('tree_big_cherry', 2400, 360, 3.0, 360);
    this.addSprite('cake', 2400, 650, 2.1, 650);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      this.addSprite(i % 2 === 0 ? 'lantern' : 'flower_cherry', 2400 + Math.cos(a) * 300, 520 + Math.sin(a) * 160, i % 2 === 0 ? 1.45 : 1.15);
    }
  }

  private pickDecoration(areaKey: string, fallback: string[]): string {
    if (areaKey === 'greenhouse') return this.rand() < 0.72 ? 'flower_sunflower' : 'flower_daisy';
    if (areaKey === 'cherryGarden' || areaKey === 'observatory') return this.rand() < 0.65 ? 'flower_cherry' : 'flower_lavender';
    if (areaKey === 'crystalLake') return this.rand() < 0.5 ? 'reed' : 'flower_lily';
    if (areaKey === 'forgottenChurch' || areaKey === 'maze') return this.rand() < 0.45 ? 'tall_grass' : 'flower_lavender';
    return fallback[Math.floor(this.rand() * fallback.length)];
  }

  private buildGardenSpecialties(): void {
    this.buildGardenMaze();
    this.spawnCentralPlazaFlowerMessage();
  }

  private buildGardenMaze(): void {
    const addHedge = (x: number, y: number) => {
      const sprite = this.addSprite('bush', x, y, 1.2, y);
      this.scene.physics.add.existing(sprite, true);
      const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(sprite.width * 0.7, sprite.height * 0.4);
      body.setOffset(sprite.width * 0.15, sprite.height * 0.5);
      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, sprite);
    };

    for (let x = 1000; x <= 2400; x += 48) {
      if (x < 1650 || x > 1750) addHedge(x, 3350);
      if (x < 1700 || x > 1900) addHedge(x, 2220);
    }
    for (let y = 2220; y <= 3350; y += 42) {
      addHedge(980, y);
      addHedge(2420, y);
    }
    for (let x = 1150; x <= 1500; x += 45) addHedge(x, 3050);
    for (let y = 2500; y <= 3000; y += 42) addHedge(1400, y);
    for (let x = 1400; x <= 1900; x += 45) addHedge(x, 2500);
    for (let y = 2700; y <= 3100; y += 42) addHedge(1800, y);
    for (let x = 1800; x <= 2200; x += 45) addHedge(x, 2900);
    for (let y = 2300; y <= 2700; y += 42) addHedge(2100, y);
  }

  private spawnCentralPlazaFlowerMessage(): void {
    const cx = 3100;
    const cy = 3850;
    for (let i = 0; i < 54; i++) {
      const t = (i / 54) * Math.PI * 2;
      const r = 95 * (1 - Math.sin(t));
      const x = cx + Math.cos(t) * r * 0.9;
      const y = cy - 45 + Math.sin(t) * r * 0.55;
      this.addSprite('flower_cherry', x, y, 1.35, y);
    }
    const letters = [
      [-70, -40], [-70, -20], [-70, 0], [-70, 20], [-45, -15], [-20, 0], [5, -40], [5, -20], [5, 0], [5, 20],
      [35, -40], [50, -20], [65, 0], [80, -20], [95, -40], [65, 10], [65, 25],
    ];
    for (const [dx, dy] of letters) this.addSprite('flower_sunflower', cx + dx, cy + dy - 30, 1.25, cy + dy);
  }

  private addAtmosphereLayers(): void {
    const fog = this.scene.add.graphics();
    fog.setScrollFactor(0.45);
    fog.setDepth(93000);
    fog.fillStyle(0xd8f0ff, 0.035);
    for (let i = 0; i < 9; i++) fog.fillEllipse(100 + i * 170, 120 + (i % 3) * 130, 320, 72);

    this.scene.tweens.add({
      targets: fog,
      x: 70,
      alpha: 0.65,
      duration: 9000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private addSprite(key: string, x: number, y: number, scale = 1, depth = y, alpha = 1): Phaser.GameObjects.Sprite {
    const sprite = this.scene.add.sprite(x, y, key);
    sprite.setScale(scale);
    sprite.setOrigin(0.5, 0.86);
    sprite.setDepth(depth);
    sprite.setAlpha(alpha);
    this.worldObjects.push(sprite);
    return sprite;
  }

  private animateFoliage(sprite: Phaser.GameObjects.Sprite): void {
    this.scene.tweens.add({
      targets: sprite,
      angle: sprite.angle + (this.rand() < 0.5 ? -1.4 : 1.4),
      duration: 1400 + this.rand() * 2200,
      delay: this.rand() * 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private isInWater(px: number, py: number, config: AreaConfig): boolean {
    if (!config.waterBounds) return false;
    const wb = config.waterBounds;
    return px >= wb.x && px <= wb.x + wb.w && py >= wb.y && py <= wb.y + wb.h;
  }

  private rand(): number {
    this.rngSeed = (this.rngSeed * 1664525 + 1013904223) >>> 0;
    return this.rngSeed / 0xffffffff;
  }
}
