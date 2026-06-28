// ============================================================
// Placeholder Generator — Simple colored shapes so the game runs
// immediately without any external sprite files.
// These are NOT meant to be pixel art — just functional shapes.
// Replace by updating AssetManifest entries to point to real files.
// ============================================================

import Phaser from 'phaser';
import { COLORS } from '../constants';
import { getAllAssets } from './AssetManifest';

export class PlaceholderGenerator {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  }

  generateAll(): void {
    const assets = getAllAssets();
    for (const asset of assets) {
      if (asset.type === 'placeholder' && !this.scene.textures.exists(asset.key)) {
        this.generatePlaceholder(asset.key);
      }
    }
    this.gfx.destroy();
  }

  private generatePlaceholder(key: string): void {
    this.gfx.clear();

    if (key.startsWith('player_') || key === 'npc_idle') {
      this.drawCharacter(key);
    } else if (key.startsWith('flower_')) {
      this.drawFlower(key);
    } else if (key.startsWith('tree_')) {
      this.drawTree(key);
    } else if (key.startsWith('butterfly_')) {
      this.drawButterfly(key);
    } else if (key.startsWith('particle_')) {
      this.drawParticle(key);
    } else if (key.startsWith('ui_')) {
      this.drawUI(key);
    } else if (key.endsWith('_tile')) {
      this.drawTile(key);
    } else {
      this.drawStructure(key);
    }
  }

  // ── Characters ──────────────────────────────────────────
  private drawCharacter(key: string): void {
    const w = 32, h = 48;
    this.gfx.clear();

    // Body
    const isNpc = key === 'npc_idle';
    const bodyColor = isNpc ? 0x5588cc : 0xee7788;
    const hairColor = isNpc ? 0x3a2a1a : 0x2a1a0a;
    const skinColor = 0xf5d0b0;

    // Shadow
    this.gfx.fillStyle(0x000000, 0.2);
    this.gfx.fillEllipse(w / 2, h - 4, 20, 8);

    // Body/dress
    this.gfx.fillStyle(bodyColor, 1);
    this.gfx.fillRoundedRect(8, 18, 16, 24, 3);

    // Head
    this.gfx.fillStyle(skinColor, 1);
    this.gfx.fillCircle(w / 2, 14, 9);

    // Hair
    this.gfx.fillStyle(hairColor, 1);
    this.gfx.fillCircle(w / 2, 10, 9);
    this.gfx.fillRect(7, 10, 18, 6);

    // Eyes
    this.gfx.fillStyle(0x2a1a0a, 1);
    if (key === 'player_down' || key === 'player_idle' || key === 'npc_idle') {
      this.gfx.fillCircle(13, 14, 1.5);
      this.gfx.fillCircle(19, 14, 1.5);
    }

    // Small legs indicator
    this.gfx.fillStyle(skinColor, 1);
    this.gfx.fillRect(12, 40, 3, 4);
    this.gfx.fillRect(18, 40, 3, 4);

    // Shoes
    this.gfx.fillStyle(0x6a4a2a, 1);
    this.gfx.fillRect(11, 43, 5, 3);
    this.gfx.fillRect(17, 43, 5, 3);

    this.gfx.generateTexture(key, w, h);
  }

  // ── Flowers ─────────────────────────────────────────────
  private drawFlower(key: string): void {
    const s = 16;
    this.gfx.clear();

    const colorMap: Record<string, number> = {
      flower_rose: COLORS.flowerPink,
      flower_tulip: COLORS.flowerRed,
      flower_daisy: COLORS.flowerWhite,
      flower_sunflower: COLORS.flowerYellow,
      flower_lily: COLORS.flowerWhite,
      flower_cherry: COLORS.cherryLight,
      flower_lavender: COLORS.flowerLavender,
      flower_wild: COLORS.flowerBlue,
    };
    const color = colorMap[key] ?? COLORS.flowerPink;

    // Stem
    this.gfx.fillStyle(0x3a7a30, 1);
    this.gfx.fillRect(7, 8, 2, 8);

    // Petals (5 around center)
    this.gfx.fillStyle(color, 1);
    const cx = 8, cy = 6;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      this.gfx.fillCircle(cx + Math.cos(a) * 3, cy + Math.sin(a) * 3, 2.5);
    }

    // Center
    this.gfx.fillStyle(0xf5d76e, 1);
    this.gfx.fillCircle(cx, cy, 1.5);

    this.gfx.generateTexture(key, s, s);
  }

  // ── Trees ───────────────────────────────────────────────
  private drawTree(key: string): void {
    const w = 64, h = 80;
    this.gfx.clear();

    const isCherryBig = key === 'tree_big_cherry';
    const isCherry = key === 'tree_cherry' || isCherryBig;
    const isWillow = key === 'tree_willow';

    const tw = isCherryBig ? 80 : w;
    const th = isCherryBig ? 96 : h;

    // Shadow
    this.gfx.fillStyle(0x000000, 0.15);
    this.gfx.fillEllipse(tw / 2, th - 6, tw * 0.6, 12);

    // Trunk
    this.gfx.fillStyle(COLORS.cherryBark, 1);
    const trunkW = isCherryBig ? 12 : 8;
    this.gfx.fillRect(tw / 2 - trunkW / 2, th * 0.4, trunkW, th * 0.55);

    // Canopy
    const canopyColor = isCherry ? COLORS.cherryLight :
                        isWillow ? 0x5a9a4a : 0x4a8a3f;
    this.gfx.fillStyle(canopyColor, 1);
    const canopyR = isCherryBig ? 35 : isWillow ? 28 : 24;
    this.gfx.fillCircle(tw / 2, th * 0.32, canopyR);

    // Canopy highlight
    this.gfx.fillStyle(isCherry ? COLORS.cherryMed : 0x5aaa50, 0.6);
    this.gfx.fillCircle(tw / 2 - 5, th * 0.28, canopyR * 0.6);

    if (isWillow) {
      // Drooping branches
      this.gfx.fillStyle(0x4a8a3a, 0.7);
      for (let i = -2; i <= 2; i++) {
        this.gfx.fillRect(tw / 2 + i * 8, th * 0.25, 2, th * 0.4);
      }
    }

    this.gfx.generateTexture(key, tw, th);
  }

  // ── Butterflies ─────────────────────────────────────────
  private drawButterfly(key: string): void {
    const s = 16;
    this.gfx.clear();

    const colorMap: Record<string, number> = {
      butterfly_orange: 0xf0a030,
      butterfly_blue: 0x40a0e0,
      butterfly_yellow: 0xf0d040,
      butterfly_white: 0xf0eee4,
      butterfly_purple: 0xb070e0,
      butterfly_pink: 0xf0a0c0,
    };
    const color = colorMap[key] ?? 0xf0a030;

    // Wings
    this.gfx.fillStyle(color, 0.9);
    // Left wing
    this.gfx.fillEllipse(5, 6, 8, 10);
    // Right wing
    this.gfx.fillEllipse(11, 6, 8, 10);

    // Wing details
    this.gfx.fillStyle(0xffffff, 0.3);
    this.gfx.fillCircle(4, 5, 2);
    this.gfx.fillCircle(12, 5, 2);

    // Body
    this.gfx.fillStyle(0x2a1a0a, 1);
    this.gfx.fillRect(7, 3, 2, 8);

    // Antennae
    this.gfx.lineStyle(1, 0x2a1a0a, 0.8);
    this.gfx.lineBetween(7, 3, 5, 0);
    this.gfx.lineBetween(9, 3, 11, 0);

    this.gfx.generateTexture(key, s, s);
  }

  // ── Particles ───────────────────────────────────────────
  private drawParticle(key: string): void {
    const s = 8;
    this.gfx.clear();

    if (key.includes('petal')) {
      const c = key.includes('pink') ? COLORS.cherryLight : 0xf0eee4;
      this.gfx.fillStyle(c, 0.9);
      this.gfx.fillEllipse(4, 4, 6, 4);
    } else if (key.includes('sparkle')) {
      this.gfx.fillStyle(0xffffff, 1);
      this.gfx.fillRect(3, 3, 2, 2);
    } else if (key.includes('firefly')) {
      this.gfx.fillStyle(COLORS.fireflyGlow, 0.9);
      this.gfx.fillCircle(4, 4, 3);
      this.gfx.fillStyle(0xffffff, 0.5);
      this.gfx.fillCircle(4, 4, 1.5);
    } else if (key.includes('leaf')) {
      this.gfx.fillStyle(0x5a9a4a, 0.8);
      this.gfx.fillEllipse(4, 4, 6, 3);
    } else if (key.includes('pollen')) {
      this.gfx.fillStyle(0xf5d76e, 0.6);
      this.gfx.fillCircle(4, 4, 1.5);
    } else if (key.includes('star')) {
      this.gfx.fillStyle(0xffffff, 0.9);
      this.gfx.fillCircle(4, 4, 1);
    } else if (key.includes('firework')) {
      this.gfx.fillStyle(0xffaa44, 1);
      this.gfx.fillCircle(4, 4, 2);
    } else {
      this.gfx.fillStyle(0x7ec8e3, 0.7);
      this.gfx.fillCircle(4, 4, 2);
    }

    this.gfx.generateTexture(key, s, s);
  }

  // ── UI Elements ─────────────────────────────────────────
  private drawUI(key: string): void {
    this.gfx.clear();

    if (key === 'ui_dialogue_bg') {
      this.gfx.fillStyle(COLORS.uiBg, 0.92);
      this.gfx.fillRoundedRect(0, 0, 540, 170, 12);
      this.gfx.lineStyle(2, COLORS.uiBorder, 0.8);
      this.gfx.strokeRoundedRect(1, 1, 538, 168, 12);
      this.gfx.generateTexture(key, 540, 170);
    } else if (key === 'ui_memory_orb') {
      this.gfx.fillStyle(0xeeddff, 0.3);
      this.gfx.fillCircle(16, 16, 16);
      this.gfx.fillStyle(0xddbbff, 0.6);
      this.gfx.fillCircle(16, 16, 10);
      this.gfx.fillStyle(0xffffff, 0.8);
      this.gfx.fillCircle(14, 13, 4);
      this.gfx.generateTexture(key, 32, 32);
    } else if (key === 'ui_interact_prompt') {
      this.gfx.fillStyle(0x000000, 0.6);
      this.gfx.fillRoundedRect(0, 0, 48, 24, 8);
      this.gfx.generateTexture(key, 48, 24);
    } else if (key === 'ui_arrow') {
      this.gfx.fillStyle(0xffffff, 0.8);
      this.gfx.fillTriangle(6, 0, 0, 10, 12, 10);
      this.gfx.generateTexture(key, 12, 10);
    } else if (key === 'ui_joystick_base') {
      this.gfx.fillStyle(0xffffff, 0.15);
      this.gfx.fillCircle(50, 50, 50);
      this.gfx.lineStyle(2, 0xffffff, 0.25);
      this.gfx.strokeCircle(50, 50, 50);
      this.gfx.generateTexture(key, 100, 100);
    } else if (key === 'ui_joystick_knob') {
      this.gfx.fillStyle(0xffffff, 0.4);
      this.gfx.fillCircle(20, 20, 20);
      this.gfx.generateTexture(key, 40, 40);
    } else if (key === 'ui_button_interact') {
      this.gfx.fillStyle(0xffffff, 0.2);
      this.gfx.fillCircle(28, 28, 28);
      this.gfx.lineStyle(2, 0xffffff, 0.4);
      this.gfx.strokeCircle(28, 28, 28);
      this.gfx.generateTexture(key, 56, 56);
    } else {
      this.gfx.fillStyle(0xffffff, 0.5);
      this.gfx.fillRect(0, 0, 32, 32);
      this.gfx.generateTexture(key, 32, 32);
    }
  }

  // ── Terrain Tiles ───────────────────────────────────────
  private drawTile(key: string): void {
    const s = 32;
    this.gfx.clear();

    const tileColors: Record<string, number> = {
      grass_tile: COLORS.grass1,
      water_tile: COLORS.waterMid,
      dirt_tile: 0x8a7050,
      sand_tile: 0xd4c090,
      stone_tile: COLORS.stone2,
    };
    const c = tileColors[key] ?? 0x888888;

    this.gfx.fillStyle(c, 1);
    this.gfx.fillRect(0, 0, s, s);

    // Add subtle variation
    this.gfx.fillStyle(0xffffff, 0.05);
    this.gfx.fillRect(0, 0, s / 2, s / 2);
    this.gfx.fillRect(s / 2, s / 2, s / 2, s / 2);

    this.gfx.generateTexture(key, s, s);
  }

  // ── Structures ──────────────────────────────────────────
  private drawStructure(key: string): void {
    this.gfx.clear();

    switch (key) {
      case 'bench': {
        this.gfx.fillStyle(COLORS.woodMed, 1);
        this.gfx.fillRect(2, 8, 44, 6);   // seat
        this.gfx.fillRect(2, 4, 44, 3);   // back
        this.gfx.fillStyle(COLORS.woodDark, 1);
        this.gfx.fillRect(4, 14, 4, 8);   // left leg
        this.gfx.fillRect(40, 14, 4, 8);  // right leg
        this.gfx.generateTexture(key, 48, 24);
        break;
      }
      case 'lantern':
      case 'lantern_lit': {
        const lit = key === 'lantern_lit';
        // Post
        this.gfx.fillStyle(COLORS.woodDark, 1);
        this.gfx.fillRect(7, 8, 2, 24);
        // Lamp
        this.gfx.fillStyle(lit ? COLORS.lanternGlow : 0x999988, lit ? 0.9 : 0.6);
        this.gfx.fillRoundedRect(3, 2, 10, 8, 2);
        // Glow
        if (lit) {
          this.gfx.fillStyle(COLORS.lanternGlow, 0.2);
          this.gfx.fillCircle(8, 6, 12);
        }
        this.gfx.generateTexture(key, 16, 32);
        break;
      }
      case 'fence_h': {
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRect(0, 4, 32, 3);
        this.gfx.fillRect(0, 10, 32, 3);
        this.gfx.fillRect(2, 0, 3, 16);
        this.gfx.fillRect(27, 0, 3, 16);
        this.gfx.generateTexture(key, 32, 16);
        break;
      }
      case 'fence_v': {
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRect(4, 0, 3, 32);
        this.gfx.fillRect(10, 0, 3, 32);
        this.gfx.fillRect(0, 2, 16, 3);
        this.gfx.fillRect(0, 27, 16, 3);
        this.gfx.generateTexture(key, 16, 32);
        break;
      }
      case 'fence_post': {
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRect(2, 0, 4, 12);
        this.gfx.fillStyle(COLORS.woodDark, 1);
        this.gfx.fillRect(1, 0, 6, 2);
        this.gfx.generateTexture(key, 8, 12);
        break;
      }
      case 'bridge_h':
      case 'bridge_v': {
        const bw = key === 'bridge_h' ? 64 : 32;
        const bh = key === 'bridge_h' ? 32 : 64;
        this.gfx.fillStyle(COLORS.woodMed, 1);
        this.gfx.fillRect(0, 0, bw, bh);
        this.gfx.fillStyle(COLORS.woodDark, 0.3);
        // Planks
        if (key === 'bridge_h') {
          for (let x = 0; x < bw; x += 10) {
            this.gfx.fillRect(x, 0, 1, bh);
          }
        } else {
          for (let y = 0; y < bh; y += 10) {
            this.gfx.fillRect(0, y, bw, 1);
          }
        }
        // Railings
        this.gfx.fillStyle(COLORS.woodLight, 1);
        if (key === 'bridge_h') {
          this.gfx.fillRect(0, 0, bw, 3);
          this.gfx.fillRect(0, bh - 3, bw, 3);
        } else {
          this.gfx.fillRect(0, 0, 3, bh);
          this.gfx.fillRect(bw - 3, 0, 3, bh);
        }
        this.gfx.generateTexture(key, bw, bh);
        break;
      }
      case 'gazebo': {
        // Roof
        this.gfx.fillStyle(0xcc6644, 1);
        this.gfx.fillTriangle(40, 0, 0, 30, 80, 30);
        // Pillars
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRect(10, 30, 4, 40);
        this.gfx.fillRect(66, 30, 4, 40);
        // Floor
        this.gfx.fillStyle(COLORS.woodMed, 0.6);
        this.gfx.fillRect(6, 65, 68, 6);
        this.gfx.generateTexture(key, 80, 72);
        break;
      }
      case 'fountain': {
        // Basin
        this.gfx.fillStyle(COLORS.stone2, 1);
        this.gfx.fillEllipse(24, 36, 44, 20);
        this.gfx.fillStyle(COLORS.waterLight, 0.8);
        this.gfx.fillEllipse(24, 34, 36, 14);
        // Column
        this.gfx.fillStyle(COLORS.stone1, 1);
        this.gfx.fillRect(20, 10, 8, 24);
        // Water spray
        this.gfx.fillStyle(COLORS.waterLight, 0.5);
        this.gfx.fillCircle(24, 8, 6);
        this.gfx.generateTexture(key, 48, 48);
        break;
      }
      case 'windmill': {
        // Body
        this.gfx.fillStyle(0xd4c4a0, 1);
        this.gfx.fillRect(20, 20, 24, 44);
        // Roof
        this.gfx.fillStyle(0xaa5533, 1);
        this.gfx.fillTriangle(32, 10, 16, 24, 48, 24);
        // Blades
        this.gfx.fillStyle(COLORS.woodLight, 0.8);
        this.gfx.fillRect(30, 0, 4, 28);
        this.gfx.fillRect(18, 22, 28, 4);
        this.gfx.generateTexture(key, 64, 64);
        break;
      }
      case 'flower_arch': {
        // Arch structure
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRect(2, 0, 4, 48);
        this.gfx.fillRect(26, 0, 4, 48);
        this.gfx.fillRect(2, 0, 28, 4);
        // Flowers on arch
        this.gfx.fillStyle(COLORS.flowerPink, 0.8);
        for (let i = 0; i < 6; i++) {
          this.gfx.fillCircle(4 + i * 5, 2, 3);
        }
        this.gfx.fillStyle(COLORS.cherryLight, 0.8);
        for (let i = 0; i < 3; i++) {
          this.gfx.fillCircle(6 + i * 8, 6, 2.5);
        }
        this.gfx.generateTexture(key, 32, 48);
        break;
      }
      case 'sign_post': {
        this.gfx.fillStyle(COLORS.woodDark, 1);
        this.gfx.fillRect(6, 8, 3, 24);
        this.gfx.fillStyle(COLORS.woodLight, 1);
        this.gfx.fillRoundedRect(0, 2, 16, 10, 2);
        this.gfx.generateTexture(key, 16, 32);
        break;
      }
      case 'stone_path': {
        this.gfx.fillStyle(COLORS.stone2, 1);
        this.gfx.fillRoundedRect(2, 2, 12, 10, 3);
        this.gfx.fillRoundedRect(16, 6, 10, 8, 3);
        this.gfx.fillRoundedRect(6, 16, 14, 10, 3);
        this.gfx.fillStyle(COLORS.stone3, 0.5);
        this.gfx.fillRoundedRect(18, 18, 8, 8, 2);
        this.gfx.generateTexture(key, 32, 32);
        break;
      }
      case 'dock': {
        this.gfx.fillStyle(COLORS.woodMed, 1);
        this.gfx.fillRect(0, 0, 48, 20);
        this.gfx.fillStyle(COLORS.woodDark, 0.3);
        for (let x = 0; x < 48; x += 8) {
          this.gfx.fillRect(x, 0, 1, 20);
        }
        this.gfx.generateTexture(key, 48, 20);
        break;
      }
      default: {
        // Generic rectangle
        this.gfx.fillStyle(0xaaaaaa, 0.6);
        this.gfx.fillRect(0, 0, 32, 32);
        this.gfx.generateTexture(key, 32, 32);
      }
    }
  }
}
