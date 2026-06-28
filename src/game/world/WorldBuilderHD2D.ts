// ============================================================
// WorldBuilderHD2D — Refmap-inspired HD-2D 16-bit garden world
// Reference: map/refmap.png (Octopath Traveler / Stardew Valley style)
// World: 3200×4000px — 2 column × 5 row zone grid
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
  private rngSeed = 42137;

  constructor(scene: GameScene) {
    this.scene = scene;
    for (const config of WORLD_OBJECTS) this.areaConfigs.set(config.key, config);
  }

  getAreaConfig(key: AreaKey): AreaConfig | undefined {
    return this.areaConfigs.get(key);
  }

  build(): void {
    this.paintGardenGround();      // Rich grass base + area tints
    this.paintRefmapPaths();       // Winding cobblestone paths
    this.paintWaterFeatures();     // Ponds, reflections, lily animation
    this.paintElevationCliffs();   // Ledge/cliff pixels between rows
    this.addParallaxCanopy();      // Distant tree silhouettes
    this.addDenseGardenFlora();    // Area-specific flower/bush/tree density
    this.placeHeroSceneObjects();  // Landmark setpieces from refmap
    this.placeAreaObjects();       // Data-driven objects from worldConfig
    this.addAtmosphericLayers();   // Fog, bloom overlay, vignette
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GROUND — rich layered grass with per-area tinting
  // ──────────────────────────────────────────────────────────────────────────
  private paintGardenGround(): void {
    this.scene.cameras.main.setBackgroundColor('#061210');

    // Full world grass base
    const base = this.scene.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'grass_tile');
    base.setOrigin(0, 0);
    base.setTileScale(1);
    base.setDepth(-1200);

    // Per-area ground color overlays (matches refmap's zone identity)
    const zoneColors: Record<string, number> = {
      cottage:       0x2e5a28,
      secretGarden:  0x2a5220,
      roseGarden:    0x306028,
      crystalLake:   0x1e4838,
      greenhouse:    0x3a6028,
      centralPlaza:  0x5a5840,
      maze:          0x203820,
      cherryGarden:  0x2e5020,
      forgottenChurch: 0x484838,
      observatory:   0x080818,
    };

    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;
      const col = zoneColors[config.key] ?? 0x2e5a28;

      // Area base tint
      const rect = this.scene.add.rectangle(x + w / 2, y + h / 2, w, h, col, 0.75);
      rect.setDepth(-1190);

      // Micro-texture variation dots
      const dots = this.scene.add.graphics();
      dots.setDepth(-1185);
      for (let i = 0; i < 120; i++) {
        const dx = x + this.rand() * w;
        const dy = y + this.rand() * h;
        const bright = this.rand() < 0.5;
        dots.fillStyle(bright ? 0x4a9040 : 0x1e4018, this.rand() * 0.18 + 0.04);
        dots.fillRect(dx, dy, 2 + this.rand() * 4, 2 + this.rand() * 3);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PATHS — winding cobblestone roads as in refmap
  // ──────────────────────────────────────────────────────────────────────────
  private paintRefmapPaths(): void {
    const gfx = this.scene.add.graphics();
    gfx.setDepth(-1060);

    // Helper: draw a layered spline path (3 layers = border / fill / highlight)
    const drawPath = (pts: Phaser.Math.Vector2[]) => {
      // Outer dark border
      gfx.lineStyle(44, 0x3a2a18, 0.7);
      this.strokeSpline(gfx, pts);
      // Main stone fill
      gfx.lineStyle(34, 0xb8a078, 0.98);
      this.strokeSpline(gfx, pts);
      // Light centre stripe
      gfx.lineStyle(16, 0xd4bc90, 0.88);
      this.strokeSpline(gfx, pts);
      // Edge highlight
      gfx.lineStyle(2, 0xe8d4a8, 0.20);
      this.strokeSpline(gfx, pts);
    };

    // ── Main N-S left-column path (cottage → forgottenShrine) ──
    drawPath([
      new Phaser.Math.Vector2(800, 4000),
      new Phaser.Math.Vector2(820, 3700),
      new Phaser.Math.Vector2(790, 3400),
      new Phaser.Math.Vector2(810, 3000),
      new Phaser.Math.Vector2(780, 2700),
      new Phaser.Math.Vector2(820, 2400),
      new Phaser.Math.Vector2(800, 2000),
      new Phaser.Math.Vector2(790, 1600),
      new Phaser.Math.Vector2(810, 1200),
      new Phaser.Math.Vector2(800, 800),
    ]);

    // ── Main N-S right-column path (secretGarden → cherryGarden) ──
    drawPath([
      new Phaser.Math.Vector2(2400, 4000),
      new Phaser.Math.Vector2(2420, 3650),
      new Phaser.Math.Vector2(2390, 3200),
      new Phaser.Math.Vector2(2410, 2700),
      new Phaser.Math.Vector2(2380, 2400),
      new Phaser.Math.Vector2(2400, 2000),
      new Phaser.Math.Vector2(2420, 1600),
      new Phaser.Math.Vector2(2400, 1200),
      new Phaser.Math.Vector2(2390, 800),
    ]);

    // ── E-W connectors between columns ──
    const connectors: number[] = [3750, 3000, 2200, 1400, 600];
    for (const cy of connectors) {
      const lx = 800 + Math.sin(cy * 0.01) * 20;
      const rx = 2400 + Math.cos(cy * 0.012) * 18;
      drawPath([
        new Phaser.Math.Vector2(lx, cy),
        new Phaser.Math.Vector2(lx + 400, cy + Math.sin(lx * 0.008) * 25),
        new Phaser.Math.Vector2(lx + 800, cy + Math.sin(lx * 0.01) * 15),
        new Phaser.Math.Vector2(rx, cy + Math.sin(rx * 0.009) * 20),
      ]);
    }

    // Scatter loose stone path tiles for detail
    for (let i = 0; i < 380; i++) {
      const cfg = WORLD_OBJECTS[Math.floor(this.rand() * WORLD_OBJECTS.length)];
      const px = cfg.bounds.x + 60 + this.rand() * (cfg.bounds.w - 120);
      const py = cfg.bounds.y + 60 + this.rand() * (cfg.bounds.h - 120);
      if (this.rand() < 0.42 && cfg.key !== 'crystalLake') {
        this.addSprite('stone_path', px, py, 0.55 + this.rand() * 0.4, py - 16, 0.7);
      }
    }
  }

  private strokeSpline(gfx: Phaser.GameObjects.Graphics, pts: Phaser.Math.Vector2[]): void {
    const curve = new Phaser.Curves.Spline(pts);
    const samples = curve.getPoints(pts.length * 20);
    gfx.beginPath();
    gfx.moveTo(samples[0].x, samples[0].y);
    for (const p of samples) gfx.lineTo(p.x, p.y);
    gfx.strokePath();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WATER — ponds with lily pad animation and shimmer
  // ──────────────────────────────────────────────────────────────────────────
  private paintWaterFeatures(): void {
    const waterGfx = this.scene.add.graphics();
    waterGfx.setDepth(-1100);

    // Crystal Lake — large pond (refmap central pond reference)
    this.drawPond(waterGfx, 2400, 2740, 1200, 380);

    // Secret Garden — small decorative pond
    this.drawPond(waterGfx, 2100, 3520, 420, 200);

    // Rose Garden — creek/stream
    this.drawPond(waterGfx, 560, 2700, 260, 140);

    // Animate lily pads on Crystal Lake
    for (let i = 0; i < 32; i++) {
      const lx = 1820 + this.rand() * 1160;
      const ly = 2560 + this.rand() * 340;
      const key = this.rand() > 0.3 ? 'lily_pad' : 'flower_lily';
      const lily = this.addSprite(key, lx, ly, 0.65 + this.rand() * 0.5, ly - 4, 0.92);
      this.scene.tweens.add({
        targets: lily,
        y: ly + 4,
        duration: 1600 + this.rand() * 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private drawPond(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number): void {
    // Shore border — dark green
    gfx.fillStyle(0x1a3020, 1);
    gfx.fillEllipse(cx, cy, w + 18, h + 18);
    // Deep water
    gfx.fillStyle(0x0e2840, 0.97);
    gfx.fillEllipse(cx, cy, w, h);
    // Mid water
    gfx.fillStyle(0x164870, 0.85);
    gfx.fillEllipse(cx + w * 0.04, cy - h * 0.06, w * 0.82, h * 0.68);
    // Shimmer lines
    gfx.fillStyle(0x4090b0, 0.15);
    for (let i = 0; i < 10; i++) {
      gfx.fillEllipse(
        cx - w * 0.3 + this.rand() * w * 0.6,
        cy - h * 0.2 + this.rand() * h * 0.4,
        60 + this.rand() * 100, 3,
      );
    }
    // Shore line
    gfx.lineStyle(12, 0x223828, 0.9);
    gfx.strokeEllipse(cx, cy, w, h);
    gfx.lineStyle(4, 0xa09060, 0.55);
    gfx.strokeEllipse(cx, cy, w + 10, h + 10);

    // Animated shimmer overlay
    const shimmer = this.scene.add.graphics();
    shimmer.setDepth(-1098);
    shimmer.fillStyle(0x5ab0d0, 0.08);
    shimmer.fillEllipse(cx, cy, w * 0.7, h * 0.5);
    this.scene.tweens.add({
      targets: shimmer,
      alpha: { from: 0.04, to: 0.18 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ELEVATION — ledge/cliff pixels between row zones
  // ──────────────────────────────────────────────────────────────────────────
  private paintElevationCliffs(): void {
    const gfx = this.scene.add.graphics();
    gfx.setDepth(-1080);

    // Row boundaries (between zone rows)
    const cliffY = [3200, 2400, 1600, 800, 200];

    for (const cy of cliffY) {
      // Cliff shadow strip
      gfx.fillStyle(0x1a1408, 0.5);
      for (let x = 0; x < WORLD_WIDTH; x += 32) {
        const oy = Math.sin(x * 0.018) * 8;
        gfx.fillRect(x, cy + oy, 28, 20);
      }
      // Ledge highlight
      gfx.lineStyle(3, 0x7a6848, 0.55);
      gfx.lineBetween(0, cy, WORLD_WIDTH, cy);
      // Grassy ledge top
      gfx.lineStyle(4, 0x3a7030, 0.5);
      gfx.lineBetween(0, cy - 2, WORLD_WIDTH, cy - 2);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PARALLAX CANOPY — distant tree silhouettes (scroll offset)
  // ──────────────────────────────────────────────────────────────────────────
  private addParallaxCanopy(): void {
    // Far-background dark tree tops
    const far = this.scene.add.graphics();
    far.setScrollFactor(0.25);
    far.setDepth(-1155);
    far.fillStyle(0x061410, 0.55);
    for (let i = 0; i < 28; i++) {
      const bx = 100 + i * 115;
      const by = 80 + Math.sin(i * 0.7) * 25;
      far.fillEllipse(bx, by, 140, 80);
    }

    // Mid-ground tree line
    const mid = this.scene.add.graphics();
    mid.setScrollFactor(0.5);
    mid.setDepth(-1140);
    mid.fillStyle(0x0e2010, 0.38);
    for (let i = 0; i < 22; i++) {
      const bx = 60 + i * 145;
      const by = 160 + Math.cos(i * 0.8) * 30;
      mid.fillEllipse(bx, by, 160, 90);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DENSE FLORA — area-appropriate flowers, bushes, trees
  // ──────────────────────────────────────────────────────────────────────────
  private addDenseGardenFlora(): void {
    const flowerAll    = ['flower_daisy', 'flower_lavender', 'flower_wild', 'flower_rose', 'flower_tulip'];
    const flowerCherry = ['flower_cherry', 'flower_lavender', 'flower_lily'];
    const flowerSun    = ['flower_sunflower', 'flower_daisy', 'flower_wild'];

    for (const config of WORLD_OBJECTS) {
      const { x, y, w, h } = config.bounds;

      // Skip tiny areas
      if (w * h < 200_000) continue;

      const density = config.key === 'crystalLake' ? 80
        : config.key === 'greenhouse' ? 200
        : config.key === 'observatory' ? 20
        : 140;

      const flowers = config.key === 'cherryGarden' || config.key === 'observatory' ? flowerCherry
        : config.key === 'greenhouse' ? flowerSun
        : flowerAll;

      // Scatter floor flowers
      for (let i = 0; i < density; i++) {
        const px = x + 30 + this.rand() * (w - 60);
        const py = y + 30 + this.rand() * (h - 60);
        if (this.isInWater(px, py, config)) continue;

        const key = this.pickFlower(config.key, flowers);
        const spr = this.addSprite(key, px, py,
          0.45 + this.rand() * 0.75, py - 6, 0.68 + this.rand() * 0.26);
        spr.setRotation((this.rand() - 0.5) * 0.28);
        this.animateFoliage(spr, 1.2, 0.5);
      }

      // Dense edge framing — bushes and trees around perimeter
      const edgeCount = Math.max(28, Math.floor((w + h) / 60));
      for (let i = 0; i < edgeCount; i++) {
        const side = i % 4;
        const px = side < 2
          ? x + this.rand() * w
          : x + (side === 2 ? 38 : w - 38);
        const py = side >= 2
          ? y + this.rand() * h
          : y + (side === 0 ? 40 : h - 40);

        const isCherry = config.key === 'cherryGarden' || config.key === 'observatory';
        const treeKey = isCherry
          ? (this.rand() < 0.7 ? 'tree_cherry' : 'tree_big_cherry')
          : (this.rand() < 0.55 ? 'bush' : (this.rand() < 0.4 ? 'tree_willow' : 'tree_oak'));

        const s = treeKey === 'bush' ? 0.75 + this.rand() * 0.5 : 0.7 + this.rand() * 0.55;
        const spr = this.addSprite(treeKey, px, py, s, py);
        this.animateFoliage(spr, 0.8, 0.3);
      }

      // Water edge reeds / cattails
      if (config.hasWater && config.waterBounds) {
        const wb = config.waterBounds;
        for (let i = 0; i < 60; i++) {
          const ey = this.rand() < 0.5 ? wb.y + 6 : wb.y + wb.h - 6;
          const reed = this.addSprite(
            this.rand() < 0.5 ? 'reed' : 'cattail',
            wb.x + this.rand() * wb.w,
            ey + (this.rand() - 0.5) * 36,
            0.7 + this.rand() * 0.55,
          );
          this.animateFoliage(reed, 1.5, 0.4);
        }
      }
    }
  }

  private pickFlower(area: string, fallback: string[]): string {
    if (area === 'greenhouse')      return this.rand() < 0.65 ? 'flower_sunflower' : 'flower_daisy';
    if (area === 'cherryGarden')    return this.rand() < 0.7  ? 'flower_cherry' : 'flower_lavender';
    if (area === 'observatory')     return this.rand() < 0.8  ? 'flower_cherry' : 'flower_wild';
    if (area === 'crystalLake')     return this.rand() < 0.45 ? 'reed' : 'flower_lily';
    if (area === 'roseGarden')      return this.rand() < 0.6  ? 'flower_rose' : 'flower_tulip';
    if (area === 'maze')            return this.rand() < 0.5  ? 'tall_grass' : 'flower_lavender';
    if (area === 'forgottenChurch') return this.rand() < 0.4  ? 'tall_grass' : 'flower_wild';
    return fallback[Math.floor(this.rand() * fallback.length)];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HERO SCENES — landmark setpieces matching refmap composition
  // ──────────────────────────────────────────────────────────────────────────
  private placeHeroSceneObjects(): void {
    // ── Cottage start area — dense cottage garden like refmap ──
    // Stone path & bench cluster (main focus)
    for (let i = 0; i < 8; i++) {
      this.addSprite('rock_small', 600 + this.rand() * 400, 3750 + this.rand() * 200,
        0.6 + this.rand() * 0.4);
    }
    // Cherry tree cluster at cottage entry
    this.addSprite('tree_cherry', 300, 3600, 1.4, 3600);
    this.addSprite('tree_cherry', 180, 3800, 1.2, 3800);

    // ── Central Plaza — heart flower message (NYNI) ──
    this.spawnFlowerHeartMessage(2400, 2120);

    // ── Cherry Garden — lantern ring around big tree ──
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 260;
      const lx = 2400 + Math.cos(a) * r;
      const ly = 1200 + Math.sin(a) * r * 0.55;
      const key = i % 3 === 0 ? 'lantern_lit' : (i % 3 === 1 ? 'flower_cherry' : 'flower_wild');
      this.addSprite(key, lx, ly, i % 3 === 0 ? 1.2 : 0.9, ly);
    }

    // ── Observatory finale — Birthday cake + lanterns ──
    this.addSprite('tree_big_cherry', 1600, 80, 2.6, 80);
    this.addSprite('cake', 1600, 155, 1.5, 155);
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      this.addSprite(
        i % 2 === 0 ? 'lantern_lit' : 'flower_cherry',
        1600 + Math.cos(a) * 220,
        100 + Math.sin(a) * 90,
        i % 2 === 0 ? 1.1 : 0.85,
      );
    }

    // ── Crystal Lake bridge area ──
    this.addSprite('bridge_h', 2400, 2740, 1.6, 2740);
    // Rocks along shore
    for (let i = 0; i < 14; i++) {
      this.addSprite('rock_small',
        1720 + this.rand() * 1360,
        2530 + this.rand() * 360,
        0.5 + this.rand() * 0.6, undefined, 0.85);
    }

    // ── Maze — hedge boundary walls ──
    this.buildHedgeMaze();
  }

  // ── Flower NYNI message in Central Plaza ────────────────────────────────
  private spawnFlowerHeartMessage(cx: number, cy: number): void {
    // Heart outline of cherry blossoms
    for (let i = 0; i < 44; i++) {
      const t = (i / 44) * Math.PI * 2;
      const r = 80 * (1 - Math.sin(t));
      const hx = cx + Math.cos(t) * r * 0.88;
      const hy = cy - 40 + Math.sin(t) * r * 0.52;
      this.addSprite('flower_cherry', hx, hy, 1.2, hy);
    }

    // NYNI in sunflowers — pixel letter positions inside heart
    const nOffset = [
      // N
      [-80,-38],[-80,-22],[-80,-6],[-80,10],[-80,26],
      [-64,-22],[-48,-6],[-32,10],
      [-16,-38],[-16,-22],[-16,-6],[-16,10],[-16,26],
      // Y
      [18,10],[18,26],[18,-6],[4,-22],[-10,-38],
      [32,-22],[46,-38],
      // N
      [50,-38],[50,-22],[50,-6],[50,10],[50,26],
      [66,-22],[82,-6],[98,10],
      [114,-38],[114,-22],[114,-6],[114,10],[114,26],
      // I
      [130,-38],[140,-38],[150,-38],
      [140,-22],[140,-6],[140,10],
      [130,26],[140,26],[150,26],
    ] as [number,number][];

    for (const [dx, dy] of nOffset) {
      this.addSprite('flower_sunflower', cx + dx - 20, cy + dy - 30, 1.15, cy + dy);
    }
  }

  // ── Hedge Maze walls ────────────────────────────────────────────────────
  private buildHedgeMaze(): void {
    const addHedge = (x: number, y: number) => {
      const spr = this.addSprite('bush', x, y, 1.15, y);
      this.scene.physics.add.existing(spr, true);
      const body = spr.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(spr.width * 0.7, spr.height * 0.4);
      body.setOffset(spr.width * 0.15, spr.height * 0.5);
      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, spr);
    };

    // Maze bounds: x=0–1600, y=800–1600
    // Bottom wall (entry gap at x=750–850)
    for (let x = 50; x <= 1550; x += 42) {
      if (x < 750 || x > 850) addHedge(x, 1560);
    }
    // Top wall (exit gap at x=950–1050)
    for (let x = 50; x <= 1550; x += 42) {
      if (x < 950 || x > 1050) addHedge(x, 820);
    }
    // Left/right walls
    for (let y = 820; y <= 1560; y += 36) {
      addHedge(50, y);
      addHedge(1550, y);
    }
    // Inner walls
    for (let x = 200; x <= 600; x += 42)  addHedge(x, 1300);
    for (let y = 1050; y <= 1280; y += 36) addHedge(550, y);
    for (let x = 550; x <= 1000; x += 42) addHedge(x, 1050);
    for (let y = 1100; y <= 1420; y += 36) addHedge(920, y);
    for (let x = 920; x <= 1380; x += 42) addHedge(x, 1360);
    for (let y = 900; y <= 1180; y += 36)  addHedge(1280, y);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // AREA OBJECTS — data-driven from worldConfig.ts
  // ──────────────────────────────────────────────────────────────────────────
  private placeAreaObjects(): void {
    let objectId = 0;
    for (const config of WORLD_OBJECTS) {
      for (const obj of config.objects) {
        const sprite = this.scene.add.sprite(obj.x, obj.y, obj.type);
        sprite.setScale(obj.scale ?? 1);
        sprite.setDepth(obj.depth ?? obj.y);
        sprite.setOrigin(0.5, 0.84);

        if (obj.id) (sprite as any).id = obj.id;
        this.worldObjects.push(sprite);

        if (obj.collides) {
          this.scene.physics.add.existing(sprite, true);
          const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
          body.setSize(sprite.width * 0.6, sprite.height * 0.3);
          body.setOffset(sprite.width * 0.2, sprite.height * 0.62);
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

  // ──────────────────────────────────────────────────────────────────────────
  // ATMOSPHERIC LAYERS — fog, bloom, vignette overlay
  // ──────────────────────────────────────────────────────────────────────────
  private addAtmosphericLayers(): void {
    // Warm fog wisps (camera-relative, soft parallax)
    const fog = this.scene.add.graphics();
    fog.setScrollFactor(0.4);
    fog.setDepth(95000);
    fog.fillStyle(0xd8f0e8, 0.028);
    for (let i = 0; i < 12; i++) {
      fog.fillEllipse(80 + i * 110, 80 + (i % 3) * 90, 280, 60);
    }
    this.scene.tweens.add({
      targets: fog,
      x: 60,
      alpha: 0.7,
      duration: 11000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Soft screen vignette — makes edges feel cozy
    const vig = this.scene.add.graphics();
    vig.setScrollFactor(0);
    vig.setDepth(98000);
    const { width, height } = this.scene.cameras.main;
    // Four corner gradients
    const corners = [
      [0, 0, 160, 120],
      [width - 160, 0, 160, 120],
      [0, height - 120, 160, 120],
      [width - 160, height - 120, 160, 120],
    ] as [number,number,number,number][];
    for (const [vx, vy, vw, vh] of corners) {
      vig.fillStyle(0x000000, 0.22);
      vig.fillRect(vx, vy, vw, vh);
    }
    vig.fillStyle(0x000000, 0.1);
    vig.fillRect(0, 0, width, height);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────────────────────
  private addSprite(key: string, x: number, y: number, scale = 1, depth?: number, alpha = 1): Phaser.GameObjects.Sprite {
    const spr = this.scene.add.sprite(x, y, key);
    spr.setScale(scale);
    spr.setOrigin(0.5, 0.84);
    spr.setDepth(depth ?? y);
    spr.setAlpha(alpha);
    this.worldObjects.push(spr);
    return spr;
  }

  private animateFoliage(spr: Phaser.GameObjects.Sprite, maxAngle = 1.2, maxDelay = 0.5): void {
    this.scene.tweens.add({
      targets: spr,
      angle: spr.angle + (this.rand() < 0.5 ? -maxAngle : maxAngle),
      duration: 1200 + this.rand() * 2400,
      delay: this.rand() * maxDelay * 1000,
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

  // Deterministic pseudo-random (seeded LCG for consistent world layout)
  private rand(): number {
    this.rngSeed = (this.rngSeed * 1664525 + 1013904223) >>> 0;
    return this.rngSeed / 0xffffffff;
  }
}
