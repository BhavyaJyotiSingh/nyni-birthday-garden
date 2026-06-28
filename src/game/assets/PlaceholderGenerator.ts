// ============================================================
// HD-2D Pixel Art Sprite Generator
// Generates 16-bit Nintendo RPG style sprites in Phaser Graphics
// Inspired by the refmap.png reference — Octopath Traveler / Stardew Valley aesthetic
// ============================================================

import Phaser from 'phaser';
import { COLORS } from '../constants';
import { getAllAssets } from './AssetManifest';

// Helper: draw a 1px pixel at exact coords (for true pixel art)
function px(gfx: Phaser.GameObjects.Graphics, color: number, x: number, y: number, w = 1, h = 1, alpha = 1): void {
  gfx.fillStyle(color, alpha);
  gfx.fillRect(x, y, w, h);
}

export class PlaceholderGenerator {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.make.graphics({ x: 0, y: 0 });
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
    } else if (key.startsWith('cat_')) {
      this.drawCat(key);
    } else if (key.startsWith('dog_')) {
      this.drawDog(key);
    } else if (key.startsWith('bird_')) {
      this.drawBird(key);
    } else if (key === 'bunny') {
      this.drawBunny();
    } else if (key === 'chicken') {
      this.drawChicken();
    } else if (key === 'duck') {
      this.drawDuck();
    } else if (key.startsWith('ragdoll_')) {
      this.drawRagdoll(key);
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

  // ────────────────────────────────────────────────────────────
  // CHARACTERS — HD-2D chibi JRPG style (32×48)
  // ────────────────────────────────────────────────────────────
  private drawCharacter(key: string): void {
    const W = 16, H = 24;
    this.gfx.clear();

    const isSide = key === 'player_left' || key === 'player_right';
    const isUp   = key === 'player_up';
    const facL   = key === 'player_left';
    const isNpc  = key === 'npc_idle';

    const skin = 0xfbd4a8, skinHi = 0xffe8c8, skinSh = 0xe0a870;
    const hair = isNpc ? 0x1a1008 : 0x5a2a0a;
    const hairHi = isNpc ? 0x282018 : 0x8a4c18;
    const hairSh = isNpc ? 0x080804 : 0x381508;
    const dress = isNpc ? 0x283848 : 0xe84898;
    const dressSh = isNpc ? 0x182430 : 0xa82870;
    const dressHi = isNpc ? 0x3a5068 : 0xff80c0;
    const collar = isNpc ? 0x506880 : 0xfff0f8;
    const bow = isNpc ? 0xff4488 : 0xff4488;
    const stocking = isNpc ? 0x182430 : 0xfff0f8;
    const shoe = isNpc ? 0x0e1014 : 0x381828;
    const O = 0x080406; // outline

    // Shadow
    px(this.gfx, 0, 4, 22, 8, 2, 0.16);

    // Shoes
    px(this.gfx, O, 3, 20, 4, 3); px(this.gfx, O, 8, 20, 3, 3);
    px(this.gfx, shoe, 4, 21, 2, 2); px(this.gfx, shoe, 9, 21, 2, 2);
    px(this.gfx, 0xffffff, 4, 21, 1, 1, 0.25); px(this.gfx, 0xffffff, 9, 21, 1, 1, 0.25);
    if (!isNpc) { px(this.gfx, bow, 4, 20, 2, 1); px(this.gfx, bow, 9, 20, 2, 1); }

    // Stockings/legs
    px(this.gfx, O, 3, 16, 3, 5); px(this.gfx, O, 8, 16, 3, 5);
    px(this.gfx, stocking, 4, 17, 1, 4); px(this.gfx, stocking, 9, 17, 1, 4);
    if (!isNpc) { px(this.gfx, 0xffffff, 4, 17, 1, 1, 0.35); px(this.gfx, 0xffffff, 9, 17, 1, 1, 0.35); }

    // Dress
    px(this.gfx, O, 2, 8, 11, 9);
    px(this.gfx, collar, 3, 9, 9, 2);
    px(this.gfx, dressHi, 3, 11, 9, 2);
    px(this.gfx, dress, 3, 13, 9, 3);
    px(this.gfx, dressSh, 3, 16, 9, 1);
    px(this.gfx, dressSh, 3, 11, 1, 5);
    px(this.gfx, dressHi, 10, 11, 1, 4);
    if (!isNpc) {
      for (let rx = 3; rx < 12; rx += 2) px(this.gfx, dressHi, rx, 16, 1, 1);
      px(this.gfx, bow, 6, 9, 3, 2); px(this.gfx, 0xff88bb, 7, 9, 1, 1);
    }

    // Arms
    if (isSide) {
      const ax = facL ? 1 : 11;
      px(this.gfx, O, ax, 9, 3, 8); px(this.gfx, dress, ax+1, 10, 1, 5); px(this.gfx, skin, ax+1, 15, 1, 2);
    } else {
      px(this.gfx, O, 0, 9, 3, 8); px(this.gfx, O, 12, 9, 3, 8);
      px(this.gfx, dress, 1, 10, 1, 5); px(this.gfx, dress, 13, 10, 1, 5);
      px(this.gfx, skin, 1, 15, 1, 2); px(this.gfx, skin, 13, 15, 1, 2);
    }

    // Head
    px(this.gfx, O, 2, 1, 11, 8);
    px(this.gfx, skinHi, 3, 2, 9, 2); px(this.gfx, skin, 3, 4, 9, 4); px(this.gfx, skinSh, 3, 7, 9, 1);

    // Hair
    px(this.gfx, O, 1, 0, 13, 5);
    px(this.gfx, hair, 2, 1, 11, 4); px(this.gfx, hairHi, 3, 1, 5, 2);
    if (!isUp) {
      px(this.gfx, hair, 1, 3, 2, 7); px(this.gfx, hair, 12, 3, 2, 7);
      px(this.gfx, hairSh, 1, 7, 1, 3); px(this.gfx, hairSh, 13, 7, 1, 3);
    }
    if (!isNpc && !isUp) {
      px(this.gfx, bow, 10, 1, 4, 3); px(this.gfx, bow, 7, 2, 3, 2);
      px(this.gfx, 0xff88bb, 9, 2, 2, 2); px(this.gfx, 0xffffff, 10, 2, 1, 1, 0.5);
    }

    // Face
    if (!isUp && !isSide) {
      px(this.gfx, O, 3, 4, 5, 3); px(this.gfx, O, 8, 4, 4, 3);
      px(this.gfx, 0x2850c0, 4, 5, 3, 2); px(this.gfx, 0x2850c0, 9, 5, 2, 2);
      px(this.gfx, 0x0a1a60, 4, 6, 3, 1); px(this.gfx, 0x0a1a60, 9, 6, 2, 1);
      px(this.gfx, 0xffffff, 4, 5, 1, 1); px(this.gfx, 0xffffff, 9, 5, 1, 1);
      px(this.gfx, 0xddeeff, 5, 5, 1, 1, 0.6); px(this.gfx, 0xddeeff, 10, 5, 1, 1, 0.6);
      if (!isNpc) {
        px(this.gfx, 0xff9999, 3, 6, 2, 1, 0.45); px(this.gfx, 0xff9999, 9, 6, 2, 1, 0.45);
        px(this.gfx, 0xd84888, 5, 7, 5, 1); px(this.gfx, 0xff90c0, 5, 7, 2, 1, 0.4);
      }
      px(this.gfx, skinSh, 6, 6, 2, 1, 0.45);
    } else if (isSide) {
      const ex = facL ? 4 : 7;
      px(this.gfx, O, ex, 4, 4, 3); px(this.gfx, 0x2850c0, ex+1, 5, 2, 2);
      px(this.gfx, 0xffffff, ex+1, 5, 1, 1);
      if (!isNpc) px(this.gfx, 0xff9999, ex, 6, 2, 1, 0.4);
    }

    this.gfx.generateTexture(key, W, H);
  }


  // ── Cats ─────────────────────────────────────────────────────────────────
  private drawCat(key: string): void {
    const W = 28, H = 22;
    this.gfx.clear();

    const isOrange = key === 'cat_orange';
    const fur  = isOrange ? 0xd08030 : 0x788898;
    const dark = isOrange ? 0x904818 : 0x485868;
    const hi   = isOrange ? 0xe8a060 : 0x98a8b8;
    const out  = 0x080808;

    // Shadow
    px(this.gfx, 0x000000, 4, 19, 20, 3, 0.18);

    // Body
    px(this.gfx, out, 6, 10, 16, 9);
    px(this.gfx, hi,  7, 11, 14, 2);
    px(this.gfx, fur, 7, 13, 14, 5);
    px(this.gfx, dark,7, 17, 14, 1);

    // Head (right side)
    px(this.gfx, out, 16, 4, 10, 10);
    px(this.gfx, hi,  17, 5, 8, 2);
    px(this.gfx, fur, 17, 7, 8, 6);

    // Ears
    px(this.gfx, out,  17, 2, 3, 4);
    px(this.gfx, fur,  18, 3, 2, 3);
    px(this.gfx, 0xffaaaa, 18, 3, 1, 2);
    px(this.gfx, out,  23, 2, 3, 4);
    px(this.gfx, fur,  23, 3, 2, 3);
    px(this.gfx, 0xffaaaa, 23, 3, 1, 2);

    // Eye
    px(this.gfx, out, 19, 8, 2, 2);
    px(this.gfx, 0x60b030, 19, 8, 2, 2);
    px(this.gfx, out, 19, 8, 1, 1); // pupil slit
    px(this.gfx, 0xffffff, 20, 8, 1, 1);

    // Nose + mouth
    px(this.gfx, 0xffbbbb, 21, 11, 2, 1);
    px(this.gfx, dark, 21, 12, 1, 1);
    px(this.gfx, dark, 23, 12, 1, 1);

    // Whiskers
    px(this.gfx, 0xffffff, 16, 11, 4, 1, 0.4);
    px(this.gfx, 0xffffff, 16, 13, 4, 1, 0.3);

    // Legs
    px(this.gfx, out,  7,  18, 4, 4);
    px(this.gfx, out,  18, 18, 4, 4);
    px(this.gfx, fur,  8,  19, 2, 2);
    px(this.gfx, fur,  19, 19, 2, 2);

    // Tail
    px(this.gfx, out, 2, 8, 5, 4);
    px(this.gfx, fur, 3, 9, 3, 2);
    px(this.gfx, hi,  3, 9, 1, 1);

    // Stripe marks
    px(this.gfx, dark, 8, 14, 2, 1, 0.5);
    px(this.gfx, dark, 14,14, 2, 1, 0.5);

    this.gfx.generateTexture(key, W, H);
  }

  // ── Dogs ─────────────────────────────────────────────────────────────────
  private drawDog(key: string): void {
    const W = 34, H = 28;
    this.gfx.clear();
    const isGolden = key === 'dog_golden';
    const fur = isGolden ? 0xd4a040 : 0x9a6838;
    const drk = isGolden ? 0x905818 : 0x6a3818;
    const hi  = isGolden ? 0xf0cc70 : 0xc89060;
    const out = 0x080808;

    px(this.gfx, 0x000000, 5, 25, 22, 3, 0.18);
    px(this.gfx, out, 2, 12, 22, 10);
    px(this.gfx, hi,  3, 13, 20, 3);
    px(this.gfx, fur, 3, 16, 20, 4);
    px(this.gfx, drk, 3, 20, 20, 1);
    px(this.gfx, out, 18, 5, 14, 12);
    px(this.gfx, hi,  19, 6, 12, 3);
    px(this.gfx, fur, 19, 9, 12, 7);
    px(this.gfx, out, 18, 5, 5, 8);
    px(this.gfx, drk, 19, 6, 4, 7);
    px(this.gfx, out, 27, 5, 5, 8);
    px(this.gfx, drk, 27, 6, 4, 7);
    px(this.gfx, out, 20, 9, 3, 3);
    px(this.gfx, 0x3a2010, 21, 10, 2, 2);
    px(this.gfx, 0xffffff, 21, 10, 1, 1);
    px(this.gfx, out, 27, 11, 6, 5);
    px(this.gfx, hi,  28, 12, 4, 3);
    px(this.gfx, 0x1a0a0a, 29, 11, 3, 2);
    px(this.gfx, 0xffbbbb, 28, 13, 4, 2);
    px(this.gfx, out, 3, 21, 5, 5);
    px(this.gfx, out, 18, 21, 5, 5);
    px(this.gfx, fur, 4, 22, 3, 4);
    px(this.gfx, fur, 19, 22, 3, 4);
    px(this.gfx, out, 0, 6, 4, 8);
    px(this.gfx, fur, 1, 7, 2, 6);
    px(this.gfx, hi,  1, 7, 1, 3);

    this.gfx.generateTexture(key, W, H);
  }

  // ── Birds ────────────────────────────────────────────────────────────────
  private drawBird(key: string): void {
    const W = 16, H = 16;
    this.gfx.clear();
    const isRed = key === 'bird_red';
    const body = isRed ? 0xd03020 : 0x3060d0;
    const wing = isRed ? 0xa01810 : 0x1840a0;
    const beak = isRed ? 0xf0c030 : 0xf0d020;
    const out  = 0x080808;

    px(this.gfx, 0x000000, 2, 14, 12, 2, 0.18);
    px(this.gfx, out,  3, 6, 10, 8);
    px(this.gfx, body, 4, 7, 8, 6);
    px(this.gfx, 0xffffff, 4, 10, 8, 2);
    px(this.gfx, out,  5, 2, 7, 6);
    px(this.gfx, body, 6, 3, 5, 4);
    px(this.gfx, 0xffffff, 6, 3, 3, 1, 0.3);
    px(this.gfx, out,  0, 6, 4, 4);
    px(this.gfx, wing, 1, 7, 3, 3);
    px(this.gfx, out,  10, 6, 5, 4);
    px(this.gfx, wing, 10, 7, 4, 3);
    px(this.gfx, beak, 9, 3, 4, 2);
    px(this.gfx, 0xf0d020, 9, 3, 4, 1, 0.7);
    px(this.gfx, out, 7, 1, 2, 3);
    px(this.gfx, 0xffffff, 7, 1, 2, 2, 0.8);
    px(this.gfx, out, 7, 2, 1, 1);
    px(this.gfx, 0xf0b030, 5, 12, 2, 2);
    px(this.gfx, 0xf0b030, 9, 12, 2, 2);

    this.gfx.generateTexture(key, W, H);
  }

  // ── Bunny ────────────────────────────────────────────────────────────────
  private drawBunny(): void {
    const W = 20, H = 24;
    this.gfx.clear();
    const fur = 0xf0f0f0, furSh = 0xd0d0d0, furHi = 0xffffff, inner = 0xffbbbb;
    const out = 0x080808;

    px(this.gfx, 0x000000, 3, 20, 14, 3, 0.18);
    px(this.gfx, out, 3, 10, 14, 10);
    this.gfx.fillStyle(fur, 1);
    this.gfx.fillEllipse(10, 15, 12, 8);
    px(this.gfx, furHi, 4, 11, 8, 3);
    px(this.gfx, furSh, 4, 17, 8, 2);
    px(this.gfx, out, 5, 4, 10, 9);
    this.gfx.fillStyle(fur, 1);
    this.gfx.fillCircle(10, 8, 5);
    px(this.gfx, furHi, 6, 5, 5, 3);
    px(this.gfx, out, 5, 0, 4, 7);
    px(this.gfx, fur, 6, 1, 2, 5);
    px(this.gfx, inner, 6, 1, 2, 5, 0.5);
    px(this.gfx, out, 11, 0, 4, 7);
    px(this.gfx, fur, 11, 1, 2, 5);
    px(this.gfx, inner, 11, 1, 2, 5, 0.5);
    px(this.gfx, out, 7, 6, 2, 2);
    px(this.gfx, 0xff2060, 7, 6, 2, 2);
    px(this.gfx, 0xffffff, 7, 6, 1, 1);
    px(this.gfx, out, 12, 6, 2, 2);
    px(this.gfx, 0xff2060, 12, 6, 2, 2);
    px(this.gfx, 0xffffff, 12, 6, 1, 1);
    px(this.gfx, 0xffaaaa, 9, 9, 3, 2);
    px(this.gfx, furHi, 1, 15, 4, 4);
    px(this.gfx, fur, 2, 16, 2, 2);
    px(this.gfx, out, 3, 19, 5, 4);
    px(this.gfx, out, 12, 19, 5, 4);
    px(this.gfx, fur, 4, 20, 3, 3);
    px(this.gfx, fur, 13, 20, 3, 3);

    this.gfx.generateTexture('bunny', W, H);
  }

  // ── Chicken ──────────────────────────────────────────────────────────────
  private drawChicken(): void {
    const W = 20, H = 22;
    this.gfx.clear();
    const out = 0x080808;

    px(this.gfx, 0x000000, 2, 18, 16, 3, 0.18);
    px(this.gfx, out, 3, 8, 14, 10);
    this.gfx.fillStyle(0xf0eeea, 1);
    this.gfx.fillEllipse(10, 13, 12, 8);
    px(this.gfx, 0xffffff, 4, 9, 9, 3);
    px(this.gfx, 0xd8d8d0, 4, 14, 9, 2);
    px(this.gfx, out, 5, 3, 9, 8);
    this.gfx.fillStyle(0xf0eeea, 1);
    this.gfx.fillCircle(10, 8, 4);
    px(this.gfx, 0xffffff, 6, 4, 4, 2);
    px(this.gfx, 0xd04028, 6, 2, 4, 3);
    px(this.gfx, 0xd04028, 8, 1, 3, 2);
    px(this.gfx, out, 8, 6, 3, 3);
    px(this.gfx, 0xf0c830, 9, 7, 2, 2);
    px(this.gfx, 0xf0c830, 3, 14, 2, 2);
    px(this.gfx, 0xf0c830, 15, 14, 2, 2);
    px(this.gfx, 0xf0c830, 3, 17, 2, 3);
    px(this.gfx, 0xf0c830, 15, 17, 2, 3);
    px(this.gfx, 0xd04028, 7, 5, 3, 2);
    px(this.gfx, out, 7, 5, 2, 2);
    px(this.gfx, 0xd04028, 8, 5, 2, 2);
    px(this.gfx, 0xffffff, 8, 5, 1, 1);
    px(this.gfx, 0xf05030, 1, 8, 3, 5);

    this.gfx.generateTexture('chicken', W, H);
  }

  // ── Duck ─────────────────────────────────────────────────────────────────
  private drawDuck(): void {
    const W = 22, H = 22;
    this.gfx.clear();
    const out = 0x080808;

    px(this.gfx, 0x000000, 2, 18, 18, 3, 0.18);
    px(this.gfx, out, 2, 10, 18, 8);
    this.gfx.fillStyle(0x306028, 1);
    this.gfx.fillEllipse(11, 14, 16, 7);
    px(this.gfx, 0x408030, 3, 11, 13, 3);
    px(this.gfx, 0x204818, 3, 16, 13, 1);
    px(this.gfx, 0xffffff, 8, 8, 5, 4);
    px(this.gfx, out, 6, 4, 9, 7);
    this.gfx.fillStyle(0x306028, 1);
    this.gfx.fillCircle(10, 8, 4);
    px(this.gfx, 0x408030, 7, 5, 5, 3);
    px(this.gfx, out, 13, 8, 6, 3);
    px(this.gfx, 0xf0b030, 14, 9, 4, 2);
    px(this.gfx, out, 8, 5, 2, 2);
    px(this.gfx, 0xffffff, 8, 5, 2, 2);
    px(this.gfx, out, 8, 5, 1, 1);
    px(this.gfx, 0xf0b030, 4, 17, 3, 3);
    px(this.gfx, 0xf0b030, 14, 17, 3, 3);
    px(this.gfx, 0x204818, 2, 13, 5, 4);

    this.gfx.generateTexture('duck', W, H);
  }

  // ── Ragdoll cat / companion character ───────────────────────────────────
  private drawRagdoll(key: string): void {
    const W = 16, H = 24;
    this.gfx.clear();

    const isSide = key.startsWith('ragdoll_left') || key.startsWith('ragdoll_right');
    const isUp   = key.startsWith('ragdoll_up');
    const facL   = key.startsWith('ragdoll_left');

    const skin = 0xfbd4a8, skinHi = 0xffe8c8, skinSh = 0xe0a870;
    const hair = 0x221814;
    const hairHi = 0x3d2d25;
    const body = 0x22553b;
    const bodyHi = 0x3aa060;
    const pants = 0x1d2935;
    const shoe = 0x18100e;
    const O = 0x080406;

    // Shadow
    px(this.gfx, 0, 4, 22, 8, 2, 0.16);

    // Shoes
    px(this.gfx, O, 3, 20, 4, 3); px(this.gfx, O, 8, 20, 3, 3);
    px(this.gfx, shoe, 4, 21, 2, 2); px(this.gfx, shoe, 9, 21, 2, 2);

    // Pants/legs
    px(this.gfx, O, 3, 16, 3, 5); px(this.gfx, O, 8, 16, 3, 5);
    px(this.gfx, pants, 4, 17, 1, 4); px(this.gfx, pants, 9, 17, 1, 4);

    // Body
    px(this.gfx, O, 2, 8, 11, 9);
    px(this.gfx, body, 3, 9, 9, 7);
    px(this.gfx, bodyHi, 3, 9, 9, 2);

    // Arms
    if (isSide) {
      const ax = facL ? 1 : 11;
      px(this.gfx, O, ax, 9, 3, 8); px(this.gfx, body, ax+1, 10, 1, 5); px(this.gfx, skin, ax+1, 15, 1, 2);
    } else {
      px(this.gfx, O, 0, 9, 3, 8); px(this.gfx, O, 12, 9, 3, 8);
      px(this.gfx, body, 1, 10, 1, 5); px(this.gfx, body, 13, 10, 1, 5);
      px(this.gfx, skin, 1, 15, 1, 2); px(this.gfx, skin, 13, 15, 1, 2);
    }

    // Head
    px(this.gfx, O, 2, 1, 11, 8);
    px(this.gfx, skinHi, 3, 2, 9, 2); px(this.gfx, skin, 3, 4, 9, 4); px(this.gfx, skinSh, 3, 7, 9, 1);

    // Hair
    px(this.gfx, O, 1, 0, 13, 5);
    px(this.gfx, hair, 2, 1, 11, 4); px(this.gfx, hairHi, 3, 1, 5, 2);
    if (!isUp) {
      px(this.gfx, hair, 1, 3, 2, 5); px(this.gfx, hair, 12, 3, 2, 5);
    }

    const isOpen    = key === 'ragdoll_open_eyes' || key === 'ragdoll_standing';
    const isSmiling = key === 'ragdoll_standing';

    // Face / Eyes
    if (!isUp && !isSide) {
      px(this.gfx, O, 3, 4, 5, 3); px(this.gfx, O, 8, 4, 4, 3);
      if (isOpen) {
        px(this.gfx, 0x3060a0, 4, 5, 2, 2); px(this.gfx, 0x3060a0, 9, 5, 2, 2);
        px(this.gfx, 0xffffff, 4, 5, 1, 1); px(this.gfx, 0xffffff, 9, 5, 1, 1);
      } else {
        px(this.gfx, O, 4, 5, 2, 1); px(this.gfx, O, 9, 5, 2, 1);
      }
      if (isSmiling) {
        px(this.gfx, 0xd08060, 6, 8, 4, 1);
      }
    }

    this.gfx.generateTexture(key, W, H);
  }


  // ────────────────────────────────────────────────────────────
  // FLOWERS — 16-bit pixel art with stem, leaf, petals (20×24)
  // ────────────────────────────────────────────────────────────
  private drawFlower(key: string): void {
    const W = 20, H = 24;
    this.gfx.clear();

    const colorMap: Record<string, [number, number, number]> = {
      // [petal, petal-shade, center]
      flower_rose:      [0xf0709a, 0xc04878, 0xf5a0c0],
      flower_tulip:     [0xe03358, 0xb01838, 0xff6088],
      flower_daisy:     [0xf5f0e8, 0xd0c8b8, 0xf5c842],
      flower_sunflower: [0xf5c842, 0xd09820, 0x8a5820],
      flower_lily:      [0xf0f0e8, 0xd0c0a0, 0xf5d070],
      flower_cherry:    [0xffbcd4, 0xf090b8, 0xffeaf2],
      flower_lavender:  [0xc098d4, 0x9068b0, 0xf5e0ff],
      flower_wild:      [0x5898d8, 0x3870b0, 0xffffff],
    };

    const [petal, shade, center] = colorMap[key] ?? [COLORS.flowerPink, 0xc050a0, 0xf5d76e];
    const stem  = 0x2e6820;
    const stemH = 0x4a9030;
    const leaf  = 0x3a8428;
    const leafH = 0x5aa840;
    const out   = 0x080808;

    // ── Stem ──
    px(this.gfx, out,  9, 14, 3, 10);
    px(this.gfx, stem, 10, 15, 1, 8);
    px(this.gfx, stemH,10, 15, 1, 3);

    // ── Leaf ──
    px(this.gfx, out,  5, 18, 7, 4);
    px(this.gfx, leaf, 6, 19, 5, 2);
    px(this.gfx, leafH,6, 19, 2, 1);
    // Leaf vein
    px(this.gfx, stem, 7, 20, 3, 1, 0.5);

    // ── Petals (5-petal flower) ──
    const cx = 10, cy = 9;
    const petals: [number, number, number, number][] = [
      [cx-2, cy-5, 4, 4], // top
      [cx+2, cy-3, 4, 4], // top-right
      [cx+3, cy+1, 4, 4], // bottom-right
      [cx-3, cy+1, 4, 4], // bottom-left
      [cx-4, cy-3, 4, 4], // top-left
    ];

    for (const [px_, py_, pw, ph] of petals) {
      px(this.gfx, out,   px_-1, py_-1, pw+2, ph+2);
      px(this.gfx, petal, px_,   py_,   pw,   ph);
      px(this.gfx, shade, px_,   py_+ph-1, pw, 1, 0.7);
    }

    // Sunflower has extra petals ring
    if (key === 'flower_sunflower') {
      px(this.gfx, shade, cx-1, cy-7, 2, 3);
      px(this.gfx, shade, cx+4, cy-2, 3, 2);
      px(this.gfx, shade, cx+4, cy+3, 3, 2);
      px(this.gfx, shade, cx-1, cy+5, 2, 3);
      px(this.gfx, shade, cx-5, cy+2, 3, 2);
    }

    // Lavender: spike shape instead
    if (key === 'flower_lavender') {
      this.gfx.clear();
      px(this.gfx, out, 9, 14, 3, 10);
      px(this.gfx, stem, 10, 15, 1, 8);
      // spike cluster
      for (let i = 0; i < 5; i++) {
        const sy = 4 + i * 2;
        const sw = 4 - Math.abs(i - 2);
        px(this.gfx, out,   10 - sw/2 - 1, sy - 1, sw + 2, 3);
        px(this.gfx, petal, 10 - sw/2,     sy,     sw,     2);
        px(this.gfx, shade, 10 - sw/2,     sy+1,   sw,     1, 0.6);
      }
    }

    // ── Center ──
    px(this.gfx, out,    cx-2, cy-2, 4, 4);
    px(this.gfx, center, cx-1, cy-1, 2, 2);
    px(this.gfx, 0xffffff, cx-1, cy-1, 1, 1, 0.6);

    this.gfx.generateTexture(key, W, H);
  }

  // ────────────────────────────────────────────────────────────
  // TREES — Large HD-2D pixel art (64×96, big cherry 80×120)
  // ────────────────────────────────────────────────────────────
  private drawTree(key: string): void {
    this.gfx.clear();

    const isBigCherry = key === 'tree_big_cherry';
    const isCherry    = key === 'tree_cherry' || isBigCherry;
    const isWillow    = key === 'tree_willow';

    const W = isBigCherry ? 80 : 64;
    const H = isBigCherry ? 120 : 96;
    const cx = W / 2;

    const bark      = COLORS.cherryBark;
    const barkDark  = 0x301408;
    const barkHi    = 0x705030;

    const leafColor = isCherry ? 0xffbcd4 : isWillow ? 0x5a9a40 : 0x448a38;
    const leafDark  = isCherry ? 0xd878a0 : isWillow ? 0x407030 : 0x2e6428;
    const leafHi    = isCherry ? 0xffdeec : isWillow ? 0x78c050 : 0x68b050;
    const leafBloom = isCherry ? 0xffecf5 : leafHi;
    const out       = 0x080808;

    // Shadow
    px(this.gfx, 0x000000, cx - W*0.3, H-8, W*0.6, 10, 0.2);

    // ── Trunk ──
    const tw = isBigCherry ? 14 : 8;
    const tx = cx - tw / 2;
    const ty = isBigCherry ? H * 0.38 : H * 0.40;
    const th = H - ty - 4;

    // Trunk outline
    px(this.gfx, out, tx-2, ty, tw+4, th+2);
    // Bark layers
    px(this.gfx, barkDark, tx,   ty,     tw,   th);
    px(this.gfx, bark,     tx+2, ty+2,   tw-4, th-4);
    px(this.gfx, barkHi,   tx+2, ty+2,   2,    th * 0.5);
    // Bark texture lines
    px(this.gfx, barkDark, tx+4, ty+4,   1, th*0.3, 0.5);
    px(this.gfx, barkDark, tx+4, ty+8+th*0.3, 1, th*0.25, 0.4);

    // Roots
    if (isBigCherry || isCherry) {
      px(this.gfx, barkDark, tx-4, H-10, 4, 4);
      px(this.gfx, barkDark, tx+tw, H-10, 4, 4);
      px(this.gfx, bark, tx-3, H-9, 2, 3);
      px(this.gfx, bark, tx+tw+1, H-9, 2, 3);
    }

    // ── Canopy — layered for depth ──
    const cr = isBigCherry ? 32 : isWillow ? 26 : 22;

    // Back-most layer (darker)
    this.gfx.fillStyle(leafDark, 1);
    this.gfx.fillCircle(cx,     H*0.30, cr * 0.7);
    this.gfx.fillCircle(cx-cr*0.4, H*0.32, cr * 0.55);
    this.gfx.fillCircle(cx+cr*0.4, H*0.32, cr * 0.55);

    // Main canopy layer
    this.gfx.fillStyle(out, 1);
    this.gfx.fillCircle(cx, H*0.28, cr+2);
    this.gfx.fillCircle(cx-cr*0.5, H*0.35, cr*0.7);
    this.gfx.fillCircle(cx+cr*0.5, H*0.35, cr*0.7);

    this.gfx.fillStyle(leafColor, 1);
    this.gfx.fillCircle(cx,     H*0.28, cr);
    this.gfx.fillCircle(cx-cr*0.5, H*0.35, cr*0.65);
    this.gfx.fillCircle(cx+cr*0.5, H*0.35, cr*0.65);

    // Highlight layer (front-top)
    this.gfx.fillStyle(leafHi, 1);
    this.gfx.fillCircle(cx-cr*0.15, H*0.22, cr*0.55);
    this.gfx.fillCircle(cx-cr*0.5, H*0.28, cr*0.35);

    // Bloom speckles for cherry
    if (isCherry) {
      for (let i = 0; i < (isBigCherry ? 28 : 16); i++) {
        const a  = (i / (isBigCherry ? 28 : 16)) * Math.PI * 2;
        const r  = cr * (0.3 + (i % 3) * 0.2);
        const bx = cx + Math.cos(a) * r;
        const by = H * 0.28 + Math.sin(a) * r * 0.7;
        px(this.gfx, leafBloom, Math.round(bx-1), Math.round(by-1), 3, 3);
      }
    }

    // Willow drooping branches
    if (isWillow) {
      for (let i = -3; i <= 3; i++) {
        const bx = cx + i * 7;
        px(this.gfx, leafDark, bx, Math.round(H*0.3), 2, Math.round(H*0.4), 0.75);
        px(this.gfx, leafColor, bx, Math.round(H*0.35), 1, Math.round(H*0.3), 0.6);
      }
    }

    this.gfx.generateTexture(key, W, H);
  }

  // ────────────────────────────────────────────────────────────
  // BUTTERFLIES — 16×14 pixel art
  // ────────────────────────────────────────────────────────────
  private drawButterfly(key: string): void {
    const W = 16, H = 14;
    this.gfx.clear();

    const cMap: Record<string, [number, number]> = {
      butterfly_orange: [0xf08830, 0x804010],
      butterfly_blue:   [0x40a8e8, 0x205880],
      butterfly_yellow: [0xf8d840, 0x908010],
      butterfly_white:  [0xf0eeea, 0xa8a090],
      butterfly_purple: [0xb070e0, 0x603890],
      butterfly_pink:   [0xf0a0cc, 0x904868],
    };
    const [wing, dark] = cMap[key] ?? [0xf08830, 0x804010];
    const out = 0x080808;

    // Upper wings
    px(this.gfx, out,  0, 1, 7, 6);
    px(this.gfx, out,  9, 1, 7, 6);
    px(this.gfx, wing, 1, 2, 5, 4);
    px(this.gfx, wing, 10,2, 5, 4);
    // Wing highlight
    px(this.gfx, 0xffffff, 2, 2, 2, 2, 0.4);
    px(this.gfx, 0xffffff, 12,2, 2, 2, 0.4);
    // Wing pattern
    px(this.gfx, dark, 3, 4, 2, 1, 0.6);
    px(this.gfx, dark, 11,4, 2, 1, 0.6);

    // Lower wings
    px(this.gfx, out,  1, 6, 5, 5);
    px(this.gfx, out,  10,6, 5, 5);
    px(this.gfx, wing, 2, 7, 3, 3);
    px(this.gfx, wing, 11,7, 3, 3);

    // Body
    px(this.gfx, out,  7, 0, 2, 12);
    px(this.gfx, dark, 7, 1, 2, 10);
    px(this.gfx, 0x808080, 7, 1, 1, 4, 0.3);

    // Antennae
    px(this.gfx, out, 6, 0, 1, 1);
    px(this.gfx, out, 9, 0, 1, 1);
    px(this.gfx, out, 5, 1, 1, 1); // left tip
    px(this.gfx, out, 10,1, 1, 1); // right tip

    this.gfx.generateTexture(key, W, H);
  }

  // ────────────────────────────────────────────────────────────
  // PARTICLES — 8×8 (or smaller)
  // ────────────────────────────────────────────────────────────
  private drawParticle(key: string): void {
    const S = 8;
    this.gfx.clear();

    if (key.includes('petal_pink')) {
      px(this.gfx, 0xffbcd4, 2, 1, 4, 5);
      px(this.gfx, 0xffdde8, 2, 1, 2, 2);
      px(this.gfx, 0xf090b8, 2, 4, 4, 2, 0.7);
    } else if (key.includes('petal_white')) {
      px(this.gfx, 0xf5f0e8, 2, 1, 4, 5);
      px(this.gfx, 0xffffff, 2, 1, 2, 2);
      px(this.gfx, 0xd8d0c0, 2, 4, 4, 2, 0.7);
    } else if (key.includes('sparkle')) {
      // 4-point star
      px(this.gfx, 0xffffff, 3, 0, 2, 8);
      px(this.gfx, 0xffffff, 0, 3, 8, 2);
      px(this.gfx, 0xffffcc, 3, 3, 2, 2);
    } else if (key.includes('firefly')) {
      px(this.gfx, COLORS.fireflyGlow, 2, 2, 4, 4, 0.5);
      px(this.gfx, COLORS.fireflyGlow, 3, 3, 2, 2);
      px(this.gfx, 0xffffff, 3, 3, 1, 1);
    } else if (key.includes('leaf')) {
      px(this.gfx, 0x4a8a38, 1, 2, 5, 3);
      px(this.gfx, 0x68b050, 1, 2, 2, 1);
      px(this.gfx, 0x2e6820, 3, 4, 2, 1, 0.6);
    } else if (key.includes('pollen')) {
      px(this.gfx, 0xf8d840, 2, 2, 4, 4, 0.7);
      px(this.gfx, 0xffffff, 2, 2, 2, 2, 0.4);
    } else if (key.includes('star')) {
      px(this.gfx, 0xffffff, 3, 0, 2, 2);
      px(this.gfx, 0xffffff, 0, 3, 2, 2);
      px(this.gfx, 0xffffff, 6, 3, 2, 2);
      px(this.gfx, 0xffffff, 3, 6, 2, 2);
      px(this.gfx, 0xffffaa, 3, 3, 2, 2);
    } else if (key.includes('firework')) {
      px(this.gfx, 0xffcc44, 2, 2, 4, 4);
      px(this.gfx, 0xffffff, 3, 3, 2, 2, 0.8);
    } else {
      // water drop
      px(this.gfx, 0x7ec8e3, 3, 1, 2, 4);
      px(this.gfx, 0xb0e0f0, 3, 1, 1, 2, 0.5);
      px(this.gfx, 0x5ab0d0, 3, 4, 2, 2);
    }

    this.gfx.generateTexture(key, S, S);
  }

  // ────────────────────────────────────────────────────────────
  // UI ELEMENTS
  // ────────────────────────────────────────────────────────────
  private drawUI(key: string): void {
    this.gfx.clear();

    if (key === 'ui_dialogue_bg') {
      // Elegant dark panel with pixel border
      px(this.gfx, COLORS.uiBg, 0, 0, 540, 170, 0.92);
      // Double-line pixel border — classic JRPG style
      this.gfx.lineStyle(2, COLORS.uiBorder, 0.9);
      this.gfx.strokeRect(2, 2, 536, 166);
      this.gfx.lineStyle(1, 0x6858a0, 0.4);
      this.gfx.strokeRect(5, 5, 530, 160);
      // Corner accents
      px(this.gfx, COLORS.uiAccent, 2,   2,   4, 4);
      px(this.gfx, COLORS.uiAccent, 534, 2,   4, 4);
      px(this.gfx, COLORS.uiAccent, 2,   164, 4, 4);
      px(this.gfx, COLORS.uiAccent, 534, 164, 4, 4);
      this.gfx.generateTexture(key, 540, 170);

    } else if (key === 'ui_memory_orb') {
      px(this.gfx, 0x3818a0, 0, 0, 32, 32, 0.2);
      this.gfx.fillStyle(0xccaaff, 0.4);
      this.gfx.fillCircle(16, 16, 14);
      this.gfx.fillStyle(0xddbbff, 0.7);
      this.gfx.fillCircle(16, 16, 9);
      this.gfx.fillStyle(0xffffff, 0.9);
      this.gfx.fillCircle(13, 12, 3);
      this.gfx.fillStyle(COLORS.uiAccent, 0.5);
      this.gfx.fillCircle(16, 16, 5);
      this.gfx.generateTexture(key, 32, 32);

    } else if (key === 'ui_interact_prompt') {
      px(this.gfx, 0x000000, 0, 0, 48, 24, 0.65);
      this.gfx.lineStyle(1, COLORS.uiAccent, 0.8);
      this.gfx.strokeRect(1, 1, 46, 22);
      this.gfx.generateTexture(key, 48, 24);

    } else if (key === 'ui_arrow') {
      px(this.gfx, 0xffffff, 5, 0, 2, 10, 0.9);
      px(this.gfx, 0xffffff, 3, 3, 2, 2, 0.9);
      px(this.gfx, 0xffffff, 7, 3, 2, 2, 0.9);
      px(this.gfx, 0xffffff, 1, 6, 2, 2, 0.9);
      px(this.gfx, 0xffffff, 9, 6, 2, 2, 0.9);
      this.gfx.generateTexture(key, 12, 10);

    } else if (key === 'ui_joystick_base') {
      this.gfx.fillStyle(0xffffff, 0.12);
      this.gfx.fillCircle(50, 50, 48);
      this.gfx.lineStyle(2, 0xffffff, 0.25);
      this.gfx.strokeCircle(50, 50, 48);
      this.gfx.lineStyle(1, 0xffffff, 0.1);
      this.gfx.strokeCircle(50, 50, 28);
      this.gfx.generateTexture(key, 100, 100);

    } else if (key === 'ui_joystick_knob') {
      this.gfx.fillStyle(0xffffff, 0.45);
      this.gfx.fillCircle(20, 20, 18);
      px(this.gfx, 0xffffff, 14, 14, 6, 6, 0.25);
      this.gfx.generateTexture(key, 40, 40);

    } else if (key === 'ui_button_interact') {
      this.gfx.fillStyle(COLORS.uiAccent, 0.25);
      this.gfx.fillCircle(28, 28, 26);
      this.gfx.lineStyle(2, COLORS.uiAccent, 0.5);
      this.gfx.strokeCircle(28, 28, 26);
      px(this.gfx, 0xffffff, 24, 20, 8, 8, 0.2);
      this.gfx.generateTexture(key, 56, 56);

    } else if (key === 'ui_heart_filled' || key === 'ui_heart_empty') {
      const filled = key === 'ui_heart_filled';
      const fill = filled ? 0xff3366 : 0x3a2040;
      const hiC  = filled ? 0xffaabf : 0x5a3868;
      // Heart pixel art
      const heart = [
        [3,1,2],[7,1,2],[11,1,2],
        [2,2,1],[5,2,2],[9,2,2],[13,2,1],
        [1,3,14],
        [1,4,14],
        [2,5,12],
        [3,6,10],
        [4,7,8],
        [5,8,6],
        [6,9,4],
        [7,10,2],
      ] as [number,number,number][];
      for (const [x,y,w] of heart) {
        px(this.gfx, 0x3a000d, x-1, y,   w+2, 1);
        px(this.gfx, fill,     x,   y,   w,   1);
      }
      if (filled) {
        px(this.gfx, hiC, 3, 2, 2, 1);
        px(this.gfx, hiC, 2, 3, 2, 1);
      }
      this.gfx.generateTexture(key, 16, 16);

    } else if (key === 'ui_minimap_player') {
      const W = 16, H = 16;
      // Draw a classic JRPG navigation triangle/arrow pointing UP
      this.gfx.fillStyle(0xffffff, 1);
      this.gfx.fillTriangle(8, 2, 2, 13, 14, 13);
      this.gfx.fillStyle(0xff2266, 1);
      this.gfx.fillTriangle(8, 4, 4, 12, 12, 12);
      this.gfx.generateTexture(key, W, H);

    } else if (key === 'ui_minimap_memory') {
      const W = 12, H = 12;
      this.gfx.fillStyle(0xffffff, 0.4);
      this.gfx.fillCircle(6, 6, 6);
      this.gfx.fillStyle(0xff44aa, 0.95);
      this.gfx.fillCircle(6, 6, 4);
      this.gfx.fillStyle(0xffffff, 1);
      this.gfx.fillCircle(5, 5, 1.5);
      this.gfx.generateTexture(key, W, H);

    } else if (key === 'ui_minimap_npc') {
      const W = 12, H = 12;
      this.gfx.fillStyle(0xffffff, 0.45);
      this.gfx.fillCircle(6, 6, 6);
      this.gfx.fillStyle(0x3bd9ff, 0.95); // NPC blue indicator
      this.gfx.fillCircle(6, 6, 4);
      this.gfx.fillStyle(0xffffff, 1);
      this.gfx.fillCircle(5, 5, 1.5);
      this.gfx.generateTexture(key, W, H);

    } else if (key === 'ui_minimap_landmark') {
      const W = 16, H = 16;
      // Small diamond star
      this.gfx.fillStyle(0xffffff, 0.35);
      this.gfx.fillCircle(8, 8, 7);
      this.gfx.fillStyle(0xffcc00, 1);
      this.gfx.fillTriangle(8, 1, 4, 8, 12, 8);
      this.gfx.fillTriangle(8, 15, 4, 8, 12, 8);
      this.gfx.fillStyle(0xffffff, 1);
      px(this.gfx, 0xffffff, 7, 7, 2, 2);
      this.gfx.generateTexture(key, W, H);

    } else {
      px(this.gfx, 0xffffff, 0, 0, 32, 32, 0.4);
      this.gfx.generateTexture(key, 32, 32);
    }
  }

  // ────────────────────────────────────────────────────────────
  // TERRAIN TILES — 16×16 HD-2D pixel art tiles
  // ────────────────────────────────────────────────────────────
  private drawTile(key: string): void {
    const S = 16;
    this.gfx.clear();

    if (key === 'grass_tile') {
      // Rich base green
      px(this.gfx, 0x3a7830, 0, 0, S, S);
      // Micro-variation pixels — gives the HD-2D texture feel
      const patches: [number, number, number][] = [
        [2,1,0x4a9040], [6,0,0x2e6020], [11,2,0x4a9040], [1,5,0x56a048],
        [8,4,0x2e6020], [13,6,0x4a9040], [3,9,0x56a048], [10,8,0x2e6020],
        [0,13,0x4a9040],[7,12,0x56a048],[14,11,0x3a7830],[5,14,0x2e6020],
      ];
      for (const [px_, py_, c] of patches) px(this.gfx, c, px_, py_, 2, 2);
      // Highlight edge
      px(this.gfx, 0x56a048, 0, 0, S, 1, 0.3);
      px(this.gfx, 0x2e6020, 0, S-1, S, 1, 0.3);

    } else if (key === 'water_tile') {
      // Deep teal base
      px(this.gfx, 0x1a3d5c, 0, 0, S, S);
      // Shimmer lines
      px(this.gfx, 0x245880, 0, 0, S, 1);
      px(this.gfx, 0x1d4a6a, 0, 4, S, 1);
      px(this.gfx, 0x5ab0d0, 2, 6, 6, 1, 0.3);
      px(this.gfx, 0x5ab0d0, 10, 2, 4, 1, 0.2);
      px(this.gfx, 0x245880, 0, 10, S, 1);
      px(this.gfx, 0x5ab0d0, 5, 13, 5, 1, 0.25);

    } else if (key === 'dirt_tile') {
      px(this.gfx, 0x8a7050, 0, 0, S, S);
      px(this.gfx, 0xa08060, 2, 2, 3, 2);
      px(this.gfx, 0x705040, 8, 7, 3, 2);
      px(this.gfx, 0xa08060, 12,11, 2, 2);

    } else if (key === 'sand_tile') {
      px(this.gfx, 0xd4c090, 0, 0, S, S);
      px(this.gfx, 0xe0cc98, 3, 2, 4, 2);
      px(this.gfx, 0xb8a078, 9, 8, 3, 2);

    } else if (key === 'stone_tile') {
      // Cobblestone — matches refmap path style
      px(this.gfx, 0xb0a080, 0, 0, S, S);
      // Stone segments
      px(this.gfx, 0x706050, 0, 0, S, 1);   // grout top
      px(this.gfx, 0x706050, 0, 8, S, 1);   // grout mid
      px(this.gfx, 0x706050, 0, 0, 1, S);   // grout left
      px(this.gfx, 0x706050, 8, 0, 1, 8);   // grout mid-v
      px(this.gfx, 0x706050, 4, 8, 1, S-8); // grout low-v
      // Stone highlights
      px(this.gfx, 0xc8b890, 1, 1, 6, 3);
      px(this.gfx, 0xc8b890, 9, 1, 5, 3);
      px(this.gfx, 0xc8b890, 1, 9, 2, 4);
      px(this.gfx, 0xc8b890, 5, 9, 3, 4);
      px(this.gfx, 0xc8b890, 10,9, 5, 4);
      // Shadows
      px(this.gfx, 0x908070, 1, 4, 6, 1, 0.5);
      px(this.gfx, 0x908070, 9, 4, 5, 1, 0.5);

    } else if (key === 'cobble_tile') {
      px(this.gfx, 0xb8a880, 0, 0, S, S);
      px(this.gfx, 0x685848, 0, 0, S, 1);
      px(this.gfx, 0x685848, 0, 8, S, 1);
      px(this.gfx, 0x685848, 0, 0, 1, S);
      px(this.gfx, 0x685848, 8, 0, 1, 8);
      px(this.gfx, 0x685848, 4, 8, 1, S-8);
      px(this.gfx, 0xc8b890, 1, 1, 6, 2);
      px(this.gfx, 0xc8b890, 9, 1, 5, 2);
      px(this.gfx, 0xc8b890, 1, 9, 2, 3);
      px(this.gfx, 0xc8b890, 5, 9, 2, 3);
      px(this.gfx, 0xc8b890, 10,9, 5, 3);
      px(this.gfx, 0x908070, 1, 4, 6, 1, 0.4);
      px(this.gfx, 0x908070, 9, 4, 5, 1, 0.4);

    } else if (key === 'marble_tile') {
      // Sleek off-white base color
      px(this.gfx, 0xf0f2f5, 0, 0, S, S);
      
      // Ornate grey veins winding across the tile
      px(this.gfx, 0xc0c8d0, 1, 3, 2, 1);
      px(this.gfx, 0xa8b4c0, 3, 4, 1, 2);
      px(this.gfx, 0x8fa0b0, 4, 6, 2, 1);
      px(this.gfx, 0xc0c8d0, 6, 7, 3, 1);
      px(this.gfx, 0xd0d5db, 9, 8, 1, 3);
      px(this.gfx, 0xa8b4c0, 10, 11, 2, 1);
      px(this.gfx, 0x8fa0b0, 12, 12, 2, 2);
      
      // Elegant gold/bronze vein accents
      px(this.gfx, 0xdfb668, 2, 2, 1, 1);
      px(this.gfx, 0xd8ad58, 8, 7, 1, 1);
      px(this.gfx, 0xc59c49, 9, 6, 2, 1);
      px(this.gfx, 0xdfb668, 11, 12, 1, 1);

      // Polish gloss/highlights (reflective shine)
      px(this.gfx, 0xffffff, 2, 1, 2, 1, 0.85);
      px(this.gfx, 0xffffff, 11, 3, 3, 1, 0.7);
      px(this.gfx, 0xffffff, 7, 13, 2, 1, 0.6);

      // Soft borders to outline marble slabs
      px(this.gfx, 0xd8dbe0, 0, 0, S, 1);
      px(this.gfx, 0xd8dbe0, 0, 0, 1, S);
      px(this.gfx, 0xa0a5ab, 0, S-1, S, 1, 0.45);
      px(this.gfx, 0xa0a5ab, S-1, 0, 1, S, 0.45);

    } else if (key === 'ocean_tile') {
      px(this.gfx, 0x061828, 0, 0, S, S);
      px(this.gfx, 0x0a3050, 0, 0, S, 1);
      px(this.gfx, 0x1a6090, 4, 3, 2, 1, 0.45);
      px(this.gfx, 0x1a6090, 10, 8, 3, 1, 0.35);
      px(this.gfx, 0xffffff, 4, 3, 1, 1, 0.2);
      px(this.gfx, 0x0c2840, 0, 10, S, 1);
      px(this.gfx, 0x1a6090, 2, 12, 4, 1, 0.3);

    } else {
      px(this.gfx, 0x888888, 0, 0, S, S);
    }

    this.gfx.generateTexture(key, S, S);
  }

  // ────────────────────────────────────────────────────────────
  // STRUCTURES — Detailed 16-bit pixel art for all objects
  // ────────────────────────────────────────────────────────────
  private drawStructure(key: string): void {
    this.gfx.clear();

    switch (key) {

      // ── Bench — wooden slat bench as in refmap ──────────────
      case 'bench': {
        const W = 48, H = 28;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, wD = COLORS.woodDark;
        const out = 0x080808;

        // Shadow
        px(this.gfx, 0x000000, 4, 24, 40, 4, 0.18);

        // Back rest
        px(this.gfx, out, 2, 4, 44, 7);
        px(this.gfx, wL,  3, 5, 42, 2);
        px(this.gfx, wM,  3, 7, 42, 3);
        // Back slats
        for (let x = 6; x < 44; x += 8) px(this.gfx, wD, x, 5, 1, 4, 0.5);

        // Seat
        px(this.gfx, out, 2, 11, 44, 7);
        px(this.gfx, wL,  3, 12, 42, 2);
        px(this.gfx, wM,  3, 14, 42, 4);
        // Seat slats
        for (let x = 6; x < 44; x += 7) px(this.gfx, wD, x, 12, 1, 5, 0.5);

        // Legs
        px(this.gfx, out, 4,  17, 6, 10);
        px(this.gfx, out, 38, 17, 6, 10);
        px(this.gfx, wM,  5,  18, 4, 8);
        px(this.gfx, wM,  39, 18, 4, 8);
        px(this.gfx, wL,  5,  18, 1, 5);
        px(this.gfx, wL,  39, 18, 1, 5);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Lantern / Lantern Lit — tall iron post as in refmap ──
      case 'lantern':
      case 'lantern_lit': {
        const W = 20, H = 48;
        const lit = key === 'lantern_lit';
        const out = 0x080808;

        // Shadow
        px(this.gfx, 0x000000, 4, 44, 12, 4, 0.2);

        // Post
        px(this.gfx, out, 8, 20, 4, 26);
        px(this.gfx, 0x404040, 9, 21, 2, 24);
        px(this.gfx, 0x606060, 9, 21, 1, 12);

        // Arm bracket
        px(this.gfx, out, 4, 14, 12, 3);
        px(this.gfx, 0x404040, 5, 15, 10, 1);

        // Lamp housing
        px(this.gfx, out, 4, 2, 12, 14);
        // Top cap
        px(this.gfx, 0x303030, 5, 3, 10, 2);
        px(this.gfx, 0x505050, 6, 3, 8, 1);
        // Glass panels
        const glass = lit ? 0xffd860 : 0x808888;
        const glowA = lit ? 0.92 : 0.5;
        px(this.gfx, glass, 5, 5, 10, 8, glowA);
        // Glass frame lines
        px(this.gfx, out, 9, 5, 1, 8, 0.6);
        // Glow
        if (lit) {
          px(this.gfx, COLORS.lanternGlow, 5, 5, 10, 8, 0.3);
          px(this.gfx, 0xffffcc, 6, 6, 8, 6, 0.2);
          // Outer glow
          this.gfx.fillStyle(COLORS.lanternGlow, 0.08);
          this.gfx.fillCircle(10, 9, 14);
        }
        // Bottom rim
        px(this.gfx, 0x303030, 4, 13, 12, 2);
        px(this.gfx, 0x505050, 5, 13, 10, 1);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Fence H ─────────────────────────────────────────────
      case 'fence_h': {
        const W = 32, H = 20;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, wD = COLORS.woodDark;
        const out = 0x080808;

        px(this.gfx, out, 0, 5, W, 4);
        px(this.gfx, wL,  1, 6, W-2, 1);
        px(this.gfx, wM,  1, 7, W-2, 1);
        px(this.gfx, wD,  1, 8, W-2, 1);

        px(this.gfx, out, 0, 12, W, 4);
        px(this.gfx, wL,  1, 13, W-2, 1);
        px(this.gfx, wM,  1, 14, W-2, 1);
        px(this.gfx, wD,  1, 15, W-2, 1);

        // Posts
        for (const px_ of [0, 28]) {
          px(this.gfx, out, px_, 0, 4, H);
          px(this.gfx, wM,  px_+1, 1, 2, H-2);
          px(this.gfx, wL,  px_+1, 1, 1, 8);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Fence V ─────────────────────────────────────────────
      case 'fence_v': {
        const W = 20, H = 32;
        const wL = COLORS.woodLight, wM = COLORS.woodMed;
        const out = 0x080808;

        px(this.gfx, out, 5, 0, 4, H);
        px(this.gfx, wL,  6, 1, 1, H-2);
        px(this.gfx, wM,  7, 1, 2, H-2);

        px(this.gfx, out, 12, 0, 4, H);
        px(this.gfx, wL,  13, 1, 1, H-2);
        px(this.gfx, wM,  14, 1, 2, H-2);

        for (const py_ of [0, 28]) {
          px(this.gfx, out, 0, py_, W, 4);
          px(this.gfx, wL,  1, py_+1, W-2, 2);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Fence Post ──────────────────────────────────────────
      case 'fence_post': {
        const W = 8, H = 14;
        px(this.gfx, 0x080808, 1, 0, 6, H);
        px(this.gfx, COLORS.woodMed, 2, 1, 4, H-2);
        px(this.gfx, COLORS.woodLight, 2, 1, 1, 6);
        // Pointed top
        px(this.gfx, 0x080808, 2, 0, 4, 1);
        px(this.gfx, COLORS.woodDark, 1, 0, 6, 1);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Bridge H ────────────────────────────────────────────
      case 'bridge_h':
      case 'bridge_v': {
        const bW = key === 'bridge_h' ? 80 : 40;
        const bH = key === 'bridge_h' ? 40 : 80;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, wD = COLORS.woodDark;
        const out = 0x080808;

        // Planks
        px(this.gfx, out, 0, 0, bW, bH);
        if (key === 'bridge_h') {
          for (let x = 2; x < bW - 2; x += 9) {
            px(this.gfx, wM, x, 2, 8, bH-4);
            px(this.gfx, wL, x, 2, 2, bH-4);
            px(this.gfx, wD, x+6, 4, 1, bH-8, 0.4);
          }
          // Railings
          px(this.gfx, out, 0, 0, bW, 4);
          px(this.gfx, wL, 1, 1, bW-2, 2);
          px(this.gfx, out, 0, bH-4, bW, 4);
          px(this.gfx, wL, 1, bH-3, bW-2, 2);
        } else {
          for (let y = 2; y < bH - 2; y += 9) {
            px(this.gfx, wM, 2, y, bW-4, 8);
            px(this.gfx, wL, 2, y, bW-4, 2);
            px(this.gfx, wD, 4, y+6, bW-8, 1, 0.4);
          }
          px(this.gfx, out, 0, 0, 4, bH);
          px(this.gfx, wL, 1, 1, 2, bH-2);
          px(this.gfx, out, bW-4, 0, 4, bH);
          px(this.gfx, wL, bW-3, 1, 2, bH-2);
        }
        this.gfx.generateTexture(key, bW, bH);
        break;
      }

      // ── Gazebo ──────────────────────────────────────────────
      case 'gazebo': {
        const W = 88, H = 80;
        const out = 0x080808;

        // Roof
        px(this.gfx, out, 14, 4, 60, 24);
        px(this.gfx, 0x6060a0, 15, 5, 58, 20);
        px(this.gfx, 0x8080c0, 18, 5, 52, 8);
        // Roof ridge
        px(this.gfx, 0x4040808, 39, 0, 10, 6);
        px(this.gfx, 0x9090d0, 40, 1, 8, 4);
        // Roof shadow
        px(this.gfx, 0x404060, 14, 22, 60, 4, 0.5);
        // Flower trim
        for (let x = 18; x < 72; x += 8) {
          px(this.gfx, COLORS.flowerPink, x, 22, 4, 4);
          px(this.gfx, COLORS.cherryLight, x+1, 22, 2, 2);
        }

        // Pillars (4 visible)
        for (const px_ of [14, 30, 50, 68]) {
          px(this.gfx, out, px_, 26, 8, 44);
          px(this.gfx, COLORS.woodLight, px_+2, 27, 4, 42);
          px(this.gfx, 0xffffff, px_+2, 27, 1, 20, 0.2);
        }

        // Floor
        px(this.gfx, out, 8, 68, 72, 10);
        px(this.gfx, COLORS.woodMed, 10, 69, 68, 8);
        for (let x = 14; x < 76; x += 8) px(this.gfx, COLORS.woodDark, x, 69, 1, 8, 0.3);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Fountain ─────────────────────────────────────────────
      case 'fountain': {
        const W = 56, H = 56;
        const st1 = COLORS.stone1, st2 = COLORS.stone2, out = 0x080808;

        px(this.gfx, 0x000000, 8, 46, 40, 8, 0.2);
        // Basin rim
        px(this.gfx, out, 4, 38, 48, 16);
        px(this.gfx, st1, 6, 39, 44, 12);
        px(this.gfx, st2, 8, 40, 40, 6);
        // Water
        this.gfx.fillStyle(COLORS.waterMid, 0.9);
        this.gfx.fillEllipse(28, 44, 36, 10);
        this.gfx.fillStyle(COLORS.waterLight, 0.4);
        this.gfx.fillEllipse(26, 43, 20, 5);
        // Column
        px(this.gfx, out, 22, 16, 12, 24);
        px(this.gfx, st1, 23, 17, 10, 22);
        px(this.gfx, st2, 24, 17, 4, 10);
        // Top basin
        px(this.gfx, out, 16, 14, 24, 6);
        px(this.gfx, st1, 18, 15, 20, 4);
        // Water arc
        px(this.gfx, COLORS.waterLight, 27, 4, 2, 12, 0.7);
        px(this.gfx, COLORS.waterLight, 24, 8, 2, 6, 0.4);
        px(this.gfx, COLORS.waterLight, 30, 8, 2, 6, 0.4);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Windmill ─────────────────────────────────────────────
      case 'windmill': {
        const W = 72, H = 88;
        const wL = COLORS.woodLight, wD = COLORS.woodDark, out = 0x080808;

        // Tower body
        px(this.gfx, out, 24, 28, 24, 58);
        px(this.gfx, 0xd4c0a0, 26, 29, 20, 55);
        px(this.gfx, 0xe8d8b8, 27, 29, 6, 28);
        // Roof
        px(this.gfx, out, 14, 16, 44, 14);
        px(this.gfx, 0xaa5533, 16, 17, 40, 12);
        px(this.gfx, 0xcc7755, 18, 17, 36, 5);
        // Blades (X cross)
        px(this.gfx, out, 34, 0, 4, 40);
        px(this.gfx, wD,  35, 1, 2, 38);
        px(this.gfx, out, 16, 10, 40, 4);
        px(this.gfx, wD,  17, 11, 38, 2);
        px(this.gfx, out, 16, 20, 4, 4);
        px(this.gfx, wL,  16, 20, 4, 4);
        // Center hub
        px(this.gfx, out,   33, 17, 6, 6);
        px(this.gfx, 0xd0b878, 34, 18, 4, 4);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Flower Arch — exactly as in refmap ──────────────────
      case 'flower_arch': {
        const W = 48, H = 72;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, out = 0x080808;

        // Shadow
        px(this.gfx, 0x000000, 8, 68, 32, 4, 0.18);

        // Left post
        px(this.gfx, out, 4, 8, 8, 60);
        px(this.gfx, wM,  5, 9, 6, 58);
        px(this.gfx, wL,  5, 9, 2, 30);

        // Right post
        px(this.gfx, out, 36, 8, 8, 60);
        px(this.gfx, wM,  37, 9, 6, 58);
        px(this.gfx, wL,  37, 9, 2, 30);

        // Top beam
        px(this.gfx, out, 4, 8, 40, 8);
        px(this.gfx, wM,  5, 9, 38, 6);
        px(this.gfx, wL,  5, 9, 38, 2);

        // Flower clusters on arch
        const flowerPositions: [number, number, number][] = [
          [4, 4, COLORS.flowerPink],
          [12, 2, COLORS.cherryLight],
          [20, 4, COLORS.flowerPink],
          [28, 2, COLORS.cherryMed],
          [36, 4, COLORS.flowerPink],
          [6, 14, COLORS.flowerWhite],
          [24, 14, COLORS.flowerWhite],
          [38, 12, COLORS.cherryLight],
        ];
        for (const [fx, fy, fc] of flowerPositions) {
          this.gfx.fillStyle(0x3a8428, 1);
          this.gfx.fillCircle(fx+3, fy+4, 5);
          this.gfx.fillStyle(fc, 1);
          this.gfx.fillCircle(fx+3, fy+2, 5);
          px(this.gfx, 0xffffff, fx+2, fy, 3, 2, 0.4);
        }

        // Hanging vines
        for (let x = 8; x < 40; x += 6) {
          px(this.gfx, 0x2e6820, x, 16, 1, 4 + (x % 4), 0.6);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Sign Post ────────────────────────────────────────────
      case 'sign_post': {
        const W = 24, H = 40;
        const out = 0x080808;
        // Post
        px(this.gfx, out, 10, 16, 4, 22);
        px(this.gfx, COLORS.woodMed, 11, 17, 2, 20);
        // Board
        px(this.gfx, out, 2, 4, 20, 14);
        px(this.gfx, COLORS.woodLight, 3, 5, 18, 12);
        px(this.gfx, 0xffeedd, 3, 5, 18, 4);
        // Lines (text suggestion)
        px(this.gfx, COLORS.woodDark, 5, 9, 14, 1, 0.5);
        px(this.gfx, COLORS.woodDark, 5, 12, 10, 1, 0.5);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Stone Path — rounded cobblestone ────────────────────
      case 'stone_path': {
        const W = 40, H = 32;
        const s1 = COLORS.stone1, s2 = COLORS.stone2, sD = COLORS.stoneDark;
        const out = 0x080808;

        // Multiple stones
        // Stone 1
        px(this.gfx, out, 1, 1, 18, 14);
        px(this.gfx, s2,  2, 2, 16, 12);
        px(this.gfx, s1,  2, 2, 8, 4);
        px(this.gfx, sD,  2, 12, 16, 2, 0.4);

        // Stone 2
        px(this.gfx, out, 21, 1, 18, 14);
        px(this.gfx, s2,  22, 2, 16, 12);
        px(this.gfx, s1,  26, 2, 8, 4);
        px(this.gfx, sD,  22, 12, 16, 2, 0.4);

        // Stone 3
        px(this.gfx, out, 5, 17, 14, 14);
        px(this.gfx, s2,  6, 18, 12, 12);
        px(this.gfx, s1,  6, 18, 6, 4);
        px(this.gfx, sD,  6, 28, 12, 2, 0.4);

        // Stone 4
        px(this.gfx, out, 22, 17, 14, 14);
        px(this.gfx, s2,  23, 18, 12, 12);
        px(this.gfx, s1,  27, 18, 6, 4);
        px(this.gfx, sD,  23, 28, 12, 2, 0.4);

        // Grout gaps (dark)
        px(this.gfx, sD, 0, 0, W, H, 0.15);
        px(this.gfx, 0x403020, 0, 15, W, 3, 0.4);
        px(this.gfx, 0x403020, 20, 0, 2, 16, 0.4);
        px(this.gfx, 0x403020, 4, 15, 2, H-15, 0.3);
        px(this.gfx, 0x403020, 20, 15, 2, H-15, 0.3);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Dock ─────────────────────────────────────────────────
      case 'dock': {
        const W = 64, H = 28;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, wD = COLORS.woodDark;
        const out = 0x080808;

        px(this.gfx, out, 0, 0, W, H);
        for (let x = 2; x < W - 2; x += 8) {
          px(this.gfx, wM, x, 2, 6, H-4);
          px(this.gfx, wL, x, 2, 2, H-4);
          px(this.gfx, wD, x+4, 4, 1, H-8, 0.4);
        }
        // Railings
        px(this.gfx, out, 0, 0, W, 3);
        px(this.gfx, wL, 2, 1, W-4, 1);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Bush — layered green shrub with pink flowers ─────────
      case 'bush': {
        const W = 44, H = 36;
        const g1 = 0x2e6a30, g2 = 0x3d8a3e, g3 = 0x52a050, g4 = 0x68c065;
        const out = 0x080808;

        px(this.gfx, 0x000000, 6, 30, 32, 6, 0.18);
        // Back layer
        px(this.gfx, out, 2, 14, 40, 20);
        this.gfx.fillStyle(g1, 1);
        this.gfx.fillCircle(10, 22, 10);
        this.gfx.fillCircle(22, 18, 13);
        this.gfx.fillCircle(34, 22, 10);
        // Mid layer
        this.gfx.fillStyle(g2, 1);
        this.gfx.fillCircle(22, 16, 11);
        this.gfx.fillCircle(12, 20, 8);
        this.gfx.fillCircle(33, 20, 8);
        // Front highlights
        this.gfx.fillStyle(g3, 1);
        this.gfx.fillCircle(20, 13, 7);
        this.gfx.fillCircle(14, 18, 5);
        this.gfx.fillStyle(g4, 0.7);
        this.gfx.fillCircle(18, 11, 4);

        // Flower dots
        const flowers: [number, number, number][] = [
          [14, 16, COLORS.flowerPink],
          [26, 20, COLORS.cherryLight],
          [32, 16, COLORS.flowerWhite],
          [9,  22, COLORS.flowerPink],
          [22, 13, COLORS.flowerWhite],
        ];
        for (const [fx, fy, fc] of flowers) {
          px(this.gfx, fc, fx, fy, 3, 3);
          px(this.gfx, 0xffffff, fx, fy, 1, 1, 0.5);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Tall Grass ──────────────────────────────────────────
      case 'tall_grass': {
        const W = 28, H = 32;
        const g1 = 0x2e7a3a, g2 = 0x4aaa50, g3 = 0x68c060;
        const out = 0x080808;

        // Multiple grass blades
        const blades: [number, number, number, number][] = [
          [3, 28, 2, 18, g1],
          [7, 28, 2, 22, g2],
          [11,28, 2, 16, g1],
          [15,28, 2, 20, g2],
          [19,28, 2, 14, g3],
          [23,28, 2, 18, g1],
          [5, 28, 2, 24, g2],
        ];
        for (const [bx, by, bw, bh, bc] of blades) {
          px(this.gfx, out, bx-1, by-bh-1, bw+2, bh+2);
          px(this.gfx, bc,  bx,   by-bh,   bw,   bh);
          // Tip highlight
          px(this.gfx, g3, bx, by-bh, 1, 3, 0.6);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Reed / Cattail ───────────────────────────────────────
      case 'reed':
      case 'cattail': {
        const W = 24, H = 40;
        const g1 = 0x3a7a40, g2 = 0x5aaa55;
        const out = 0x080808;

        // Stems
        px(this.gfx, out, 4, 4, 3, 36);
        px(this.gfx, g1,  5, 5, 1, 34);
        px(this.gfx, g2,  5, 5, 1, 12, 0.6);

        px(this.gfx, out, 12, 8, 3, 32);
        px(this.gfx, g1,  13, 9, 1, 30);
        px(this.gfx, g2,  13, 9, 1, 10, 0.6);

        px(this.gfx, out, 18, 12, 3, 28);
        px(this.gfx, g1,  19, 13, 1, 26);

        // Leaves crossing
        px(this.gfx, g1, 5, 18, 14, 2, 0.7);
        px(this.gfx, g2, 5, 18, 6, 1, 0.4);

        // Cattail head
        px(this.gfx, 0x7a4a20, 4, 4, 3, 10);
        px(this.gfx, 0x9a6830, 5, 5, 1, 8);
        px(this.gfx, 0x7a4a20, 12, 8, 3, 10);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Lily Pad ─────────────────────────────────────────────
      case 'lily_pad': {
        const W = 36, H = 28;
        const out = 0x080808;

        // Pad
        px(this.gfx, out, 2, 8, 32, 18);
        this.gfx.fillStyle(0x2f8a50, 1);
        this.gfx.fillEllipse(18, 17, 30, 16);
        this.gfx.fillStyle(0x4aaa68, 1);
        this.gfx.fillEllipse(16, 15, 22, 10);
        // Notch
        px(this.gfx, COLORS.waterMid, 16, 9, 4, 6);
        // Vein
        px(this.gfx, 0x2a7040, 18, 10, 1, 12, 0.5);
        px(this.gfx, 0x2a7040, 9, 16, 18, 1, 0.4);
        // White flower
        this.gfx.fillStyle(0xffffff, 0.9);
        this.gfx.fillCircle(14, 11, 4);
        this.gfx.fillCircle(14, 13, 4);
        this.gfx.fillCircle(16, 10, 4);
        this.gfx.fillStyle(0xf5d070, 1);
        this.gfx.fillCircle(15, 12, 2);
        px(this.gfx, 0xffffff, 14, 11, 1, 1, 0.6);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Rocks ────────────────────────────────────────────────
      case 'rock_small':
      case 'rock_large': {
        const large = key === 'rock_large';
        const W = large ? 44 : 28;
        const H = large ? 34 : 22;
        const s1 = COLORS.stone1, s2 = COLORS.stone2, s3 = COLORS.stone3;
        const out = 0x080808;

        px(this.gfx, 0x000000, W*0.15, H-6, W*0.7, 6, 0.2);
        px(this.gfx, out, 2, H*0.25, W-4, H*0.7);
        this.gfx.fillStyle(s3, 1);
        this.gfx.fillEllipse(W/2, H*0.55, W*0.82, H*0.64);
        this.gfx.fillStyle(s2, 1);
        this.gfx.fillEllipse(W/2, H*0.5, W*0.68, H*0.52);
        this.gfx.fillStyle(s1, 1);
        this.gfx.fillEllipse(W*0.42, H*0.38, W*0.38, H*0.26);
        // Crack line
        px(this.gfx, s3, W*0.5, H*0.3, 1, H*0.25, 0.4);

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Mirror ───────────────────────────────────────────────
      case 'mirror': {
        const W = 32, H = 52;
        const out = 0x080808;
        px(this.gfx, 0x000000, W/2-10, H-4, 20, 4, 0.18);
        // Base
        px(this.gfx, out, W/2-10, H-12, 20, 6);
        px(this.gfx, COLORS.woodDark, W/2-9, H-11, 18, 4);
        // Stand
        px(this.gfx, out, W/2-2, H-28, 4, 18);
        px(this.gfx, COLORS.woodMed, W/2-1, H-27, 2, 16);
        // Frame
        px(this.gfx, out, W/2-9, 4, 18, 28);
        px(this.gfx, COLORS.woodDark, W/2-8, 5, 16, 26);
        px(this.gfx, COLORS.woodMed, W/2-7, 6, 14, 24);
        // Glass
        this.gfx.fillStyle(0x88c8ff, 0.85);
        this.gfx.fillEllipse(W/2, 18, 10, 18);
        this.gfx.fillStyle(0xffffff, 0.3);
        this.gfx.fillEllipse(W/2-2, 14, 4, 8);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Letter Table / Table Empty ────────────────────────────
      case 'letter_table':
      case 'table_empty': {
        const empty = key === 'table_empty';
        const W = 40, H = 32;
        const wL = COLORS.woodLight, wM = COLORS.woodMed, wD = COLORS.woodDark;
        const out = 0x080808;

        px(this.gfx, 0x000000, 4, 28, 32, 4, 0.18);
        // Legs
        px(this.gfx, out, 6, 20, 5, 12); px(this.gfx, wD, 7, 21, 3, 10);
        px(this.gfx, out, 29,20, 5, 12); px(this.gfx, wD, 30,21, 3, 10);
        // Table top
        px(this.gfx, out, 2, 12, 36, 10);
        px(this.gfx, wL,  3, 13, 34, 4);
        px(this.gfx, wM,  3, 17, 34, 4);
        for (let x = 6; x < 36; x += 8) px(this.gfx, wD, x, 13, 1, 7, 0.3);

        // Letter on table
        if (!empty) {
          px(this.gfx, out, 12, 4, 16, 10);
          px(this.gfx, 0xfff8e0, 13, 5, 14, 8);
          px(this.gfx, 0xe0d090, 13, 5, 14, 1);
          // Seal
          px(this.gfx, 0xff3030, 19, 9, 4, 4);
          px(this.gfx, 0xff7060, 20, 10, 2, 2);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Notebook ─────────────────────────────────────────────
      case 'notebook': {
        const W = 32, H = 40;
        px(this.gfx, 0x080808, 2, 2, 28, 36);
        px(this.gfx, 0x2040a0, 3, 3, 26, 34);  // Cover
        px(this.gfx, 0x3060c0, 3, 3, 26, 8);   // Top highlight
        // Spine
        px(this.gfx, 0x1030808, 2, 2, 4, 36);
        px(this.gfx, 0x1840c0, 3, 3, 2, 34);
        // Pages
        px(this.gfx, 0xfffff8, 8, 4, 20, 32);
        px(this.gfx, 0xf0f0e0, 8, 4, 20, 2);
        // Lines
        for (let y = 8; y < 34; y += 4) px(this.gfx, 0xa0b0d0, 10, y, 16, 1, 0.4);
        // Flower sticker
        px(this.gfx, COLORS.flowerPink, 20, 20, 4, 4);
        px(this.gfx, 0xffffff, 21, 21, 2, 2, 0.4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Cake ─────────────────────────────────────────────────
      case 'cake': {
        const W = 56, H = 56;
        const out = 0x080808;

        px(this.gfx, 0x000000, 6, 50, 44, 6, 0.2);

        // Plate
        px(this.gfx, out, 4, 46, 48, 8);
        px(this.gfx, 0xe8e0d0, 6, 47, 44, 6);
        px(this.gfx, 0xffffff, 6, 47, 44, 2, 0.3);

        // Bottom layer
        px(this.gfx, out, 8, 32, 40, 16);
        px(this.gfx, 0xf0c8a0, 9, 33, 38, 4);
        px(this.gfx, 0xe0b888, 9, 37, 38, 8);
        px(this.gfx, 0xf8d8b8, 9, 33, 38, 2, 0.4);

        // Top layer
        px(this.gfx, out, 12, 18, 32, 16);
        px(this.gfx, 0xf8d0c0, 13, 19, 30, 4);
        px(this.gfx, 0xe8c0a8, 13, 23, 30, 8);

        // Icing drips
        for (let x = 12; x < 42; x += 7) {
          px(this.gfx, 0xffffff, x, 32, 4, 3);
          px(this.gfx, 0xffeef0, x+1, 33, 2, 2);
        }
        for (let x = 16; x < 42; x += 7) {
          px(this.gfx, 0xffffff, x, 18, 4, 3);
          px(this.gfx, 0xffeef0, x+1, 19, 2, 2);
        }

        // Flowers on top
        const cf: [number,number,number][] = [[18,14,COLORS.flowerPink],[28,12,COLORS.cherryLight],[36,14,COLORS.flowerPink]];
        for (const [fx,fy,fc] of cf) {
          this.gfx.fillStyle(fc, 1);
          this.gfx.fillCircle(fx, fy, 5);
          px(this.gfx, 0xffffff, fx-1, fy-1, 2, 2, 0.4);
        }

        // Candles
        const candles = [22, 28, 34];
        for (const cx of candles) {
          px(this.gfx, out, cx-1, 6, 4, 14);
          px(this.gfx, 0xffe0c0, cx, 7, 2, 12);
          // Flame
          px(this.gfx, 0xffcc44, cx, 4, 2, 4);
          px(this.gfx, 0xffffff, cx, 4, 1, 2, 0.5);
          px(this.gfx, 0xff8820, cx, 6, 2, 2, 0.5);
        }

        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── House Cottage ───────────────────────────────────────
      case 'house_cottage': {
        const W = 80, H = 80;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 74, 64, 6, 0.18);
        px(this.gfx, out, 4, 16, 72, 32);
        px(this.gfx, 0xa84828, 5, 17, 70, 10);
        px(this.gfx, 0xc85c2c, 5, 20, 70, 18);
        px(this.gfx, 0xe07038, 10, 20, 60, 10);
        px(this.gfx, 0xf08050, 14, 20, 52, 5);
        px(this.gfx, out, 20, 14, 40, 8);
        px(this.gfx, 0xd8984a, 21, 15, 38, 5);
        px(this.gfx, 0xf0b858, 22, 15, 36, 2);
        px(this.gfx, out, 54, 8, 14, 18);
        px(this.gfx, 0x8a6040, 55, 9, 12, 16);
        px(this.gfx, 0xb08060, 56, 9, 10, 6);
        px(this.gfx, out, 4, 46, 72, 34);
        px(this.gfx, 0xeee0c0, 5, 47, 70, 22);
        px(this.gfx, 0xf8f0d8, 5, 47, 70, 8);
        px(this.gfx, 0xd8c8a0, 5, 63, 70, 8);
        for (let y = 50; y < 68; y += 6) px(this.gfx, 0xc8b890, 5, y, 70, 1, 0.3);
        px(this.gfx, out, 28, 54, 24, 26);
        px(this.gfx, 0x7a4a28, 29, 55, 22, 25);
        px(this.gfx, 0xa06838, 31, 55, 18, 12);
        px(this.gfx, 0xe0c080, 37, 58, 5, 4);
        px(this.gfx, out, 6, 50, 18, 16);
        px(this.gfx, 0x88ccff, 7, 51, 16, 14);
        px(this.gfx, 0xffffff, 7, 51, 16, 4, 0.3);
        px(this.gfx, out, 15, 51, 2, 14);
        px(this.gfx, out, 7, 58, 16, 2);
        px(this.gfx, out, 56, 50, 18, 16);
        px(this.gfx, 0x88ccff, 57, 51, 16, 14);
        px(this.gfx, 0xffffff, 57, 51, 16, 4, 0.3);
        px(this.gfx, out, 65, 51, 2, 14);
        px(this.gfx, out, 57, 58, 16, 2);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── House Stone ─────────────────────────────────────────
      case 'house_stone': {
        const W = 80, H = 80;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 74, 64, 6, 0.18);
        px(this.gfx, out, 4, 14, 72, 34);
        px(this.gfx, 0x485868, 5, 15, 70, 8);
        px(this.gfx, 0x5a6878, 5, 17, 70, 20);
        px(this.gfx, 0x6a7888, 10, 17, 60, 10);
        px(this.gfx, out, 18, 12, 44, 8);
        px(this.gfx, 0x6a7888, 19, 13, 42, 5);
        px(this.gfx, out, 14, 6, 12, 16);
        px(this.gfx, 0x808070, 15, 7, 10, 14);
        px(this.gfx, 0xa0a090, 16, 7, 8, 5);
        px(this.gfx, out, 4, 46, 72, 34);
        px(this.gfx, 0x9a9080, 5, 47, 70, 32);
        for (let sy = 48; sy < 78; sy += 8) {
          const offset = ((sy - 48) / 8) % 2 === 0 ? 0 : 12;
          for (let sx = 5 + offset; sx < 74; sx += 24) {
            px(this.gfx, 0xb0a890, sx, sy, 22, 6);
            px(this.gfx, 0xc0b8a0, sx, sy, 22, 2, 0.4);
            px(this.gfx, out, sx + 22, sy, 2, 6, 0.25);
          }
        }
        px(this.gfx, out, 30, 52, 20, 28);
        px(this.gfx, 0x5c4028, 31, 60, 18, 20);
        px(this.gfx, 0x6e5030, 31, 53, 18, 8);
        px(this.gfx, 0xe0c080, 38, 65, 4, 4);
        px(this.gfx, out, 6, 52, 20, 16);
        px(this.gfx, 0x80aad0, 7, 53, 18, 14);
        px(this.gfx, out, 5, 52, 4, 16);
        px(this.gfx, 0x5c4028, 5, 52, 3, 16);
        px(this.gfx, out, 23, 52, 4, 16);
        px(this.gfx, 0x5c4028, 23, 52, 3, 16);
        px(this.gfx, out, 54, 52, 20, 16);
        px(this.gfx, 0x80aad0, 55, 53, 18, 14);
        px(this.gfx, out, 53, 52, 4, 16);
        px(this.gfx, 0x5c4028, 53, 52, 3, 16);
        px(this.gfx, out, 71, 52, 4, 16);
        px(this.gfx, 0x5c4028, 71, 52, 3, 16);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Shop Bakery ─────────────────────────────────────────
      case 'shop_bakery': {
        const W = 80, H = 78;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 76, 72, 6, 0.18);
        px(this.gfx, out, 2, 18, 76, 16);
        for (let ax = 2; ax < 76; ax += 8) {
          px(this.gfx, ax % 16 === 2 ? 0xf0d030 : 0xf0a020, ax, 18, 8, 14);
        }
        px(this.gfx, 0xffffff, 2, 18, 74, 3, 0.2);
        px(this.gfx, out, 2, 32, 76, 44);
        px(this.gfx, 0xf5e8c0, 3, 33, 74, 32);
        px(this.gfx, out, 10, 36, 60, 24);
        px(this.gfx, 0xa8d0f0, 11, 37, 58, 22);
        px(this.gfx, 0xffffff, 11, 37, 58, 5, 0.35);
        px(this.gfx, 0xd08030, 14, 44, 8, 6);
        px(this.gfx, 0xffffff, 15, 44, 6, 2);
        px(this.gfx, 0xff4888, 16, 43, 4, 2);
        px(this.gfx, out, 30, 52, 20, 24);
        px(this.gfx, 0x6a4820, 31, 53, 18, 23);
        px(this.gfx, 0xe0c080, 38, 64, 4, 4);
        px(this.gfx, out, 14, 6, 52, 14);
        px(this.gfx, 0xd08030, 15, 7, 50, 12);
        px(this.gfx, 0xf0c050, 15, 7, 50, 4, 0.6);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Shop Florist ────────────────────────────────────────
      case 'shop_florist': {
        const W = 80, H = 76;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 76, 72, 6, 0.18);
        px(this.gfx, out, 2, 18, 76, 14);
        px(this.gfx, 0x2a7028, 2, 18, 76, 12);
        for (let ax = 2; ax < 76; ax += 6) px(this.gfx, 0x3a9038, ax, 18, 4, 10);
        px(this.gfx, 0xffffff, 2, 18, 74, 2, 0.2);
        px(this.gfx, out, 2, 30, 76, 46);
        px(this.gfx, 0xeadcc0, 3, 31, 74, 34);
        px(this.gfx, out, 8, 34, 64, 24);
        px(this.gfx, 0xa8d4b0, 9, 35, 62, 22);
        px(this.gfx, 0xffffff, 9, 35, 62, 5, 0.3);
        for (let fi = 0; fi < 8; fi++) {
          const cols = [0xf060a0, 0xf8c830, 0x5090e8, 0xffbcd4, 0xe82850, 0xb890d8, 0xf8f0e8, 0xf07830];
          px(this.gfx, cols[fi], 12 + fi * 8, 44, 5, 5);
          px(this.gfx, 0x2e6820, 14 + fi * 8, 41, 2, 5, 0.7);
        }
        px(this.gfx, out, 28, 52, 24, 24);
        px(this.gfx, 0x3c5c28, 29, 53, 22, 23);
        px(this.gfx, 0xe0c080, 38, 65, 4, 4);
        px(this.gfx, out, 14, 6, 52, 14);
        px(this.gfx, 0x2a7028, 15, 7, 50, 12);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Shop Market ─────────────────────────────────────────
      case 'shop_market': {
        const W = 96, H = 88;
        const out = 0x080808;
        px(this.gfx, 0x000000, 10, 88, 80, 8, 0.18);
        px(this.gfx, out, 2, 16, 92, 16);
        for (let ax = 2; ax < 92; ax += 10) {
          px(this.gfx, ax % 20 === 2 ? 0xd03028 : 0xf0f0f0, ax, 16, 10, 14);
        }
        px(this.gfx, 0xffffff, 2, 16, 90, 3, 0.25);
        px(this.gfx, out, 2, 30, 92, 58);
        px(this.gfx, 0xe8e0d0, 3, 31, 90, 46);
        px(this.gfx, out, 8, 36, 36, 20);
        px(this.gfx, 0xb0d0e8, 9, 37, 34, 18);
        px(this.gfx, out, 52, 36, 36, 20);
        px(this.gfx, 0xb0d0e8, 53, 37, 34, 18);
        px(this.gfx, out, 36, 42, 24, 46);
        px(this.gfx, 0x4a3818, 37, 43, 22, 45);
        px(this.gfx, 0xe0c080, 45, 65, 4, 4);
        px(this.gfx, out, 2, 68, 10, 18);
        px(this.gfx, 0x7a5028, 3, 69, 8, 16);
        px(this.gfx, out, 82, 68, 10, 18);
        px(this.gfx, 0x7a5028, 83, 69, 8, 16);
        px(this.gfx, out, 16, 4, 64, 14);
        px(this.gfx, 0xd03028, 17, 5, 62, 12);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Inn ─────────────────────────────────────────────────
      case 'inn': {
        const W = 88, H = 100;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 86, 80, 6, 0.18);
        px(this.gfx, out, 2, 14, 84, 36);
        px(this.gfx, 0x3a4860, 3, 15, 82, 8);
        px(this.gfx, 0x4a5870, 3, 18, 82, 24);
        px(this.gfx, 0x5a6880, 10, 18, 68, 12);
        px(this.gfx, out, 20, 10, 48, 10);
        px(this.gfx, 0x5a6880, 21, 11, 46, 7);
        px(this.gfx, out, 10, 48, 68, 8);
        px(this.gfx, 0xd4a060, 11, 49, 66, 6);
        for (let bx = 14; bx < 74; bx += 10) {
          px(this.gfx, out, bx, 48, 4, 8);
          px(this.gfx, 0xa07040, bx + 1, 49, 2, 6);
        }
        px(this.gfx, out, 2, 54, 84, 46);
        px(this.gfx, 0xf0e8d8, 3, 55, 82, 34);
        px(this.gfx, out, 14, 36, 16, 14);
        px(this.gfx, 0x88c0e0, 15, 37, 14, 12);
        px(this.gfx, out, 56, 36, 16, 14);
        px(this.gfx, 0x88c0e0, 57, 37, 14, 12);
        px(this.gfx, out, 28, 60, 32, 40);
        px(this.gfx, 0x8a5828, 29, 61, 30, 39);
        px(this.gfx, 0xd4a030, 35, 76, 3, 3);
        px(this.gfx, 0xd4a030, 50, 76, 3, 3);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Church ──────────────────────────────────────────────
      case 'church': {
        const W = 100, H = 112;
        const out = 0x080808;
        px(this.gfx, 0x000000, 10, 96, 80, 8, 0.18);
        px(this.gfx, out, 38, 0, 24, 40);
        px(this.gfx, 0x505860, 39, 1, 22, 8);
        px(this.gfx, 0x606870, 39, 6, 22, 28);
        px(this.gfx, out, 47, 2, 6, 18);
        px(this.gfx, out, 44, 8, 12, 6);
        px(this.gfx, 0xe8d090, 48, 3, 4, 16);
        px(this.gfx, 0xe8d090, 45, 9, 10, 4);
        px(this.gfx, out, 2, 36, 96, 30);
        px(this.gfx, 0x606870, 3, 42, 94, 20);
        px(this.gfx, out, 2, 64, 96, 48);
        px(this.gfx, 0xd8d0c0, 3, 65, 94, 36);
        for (let sy = 66; sy < 98; sy += 8) {
          for (let sx = 3; sx < 94; sx += 20) px(this.gfx, 0xeae0cc, sx, sy, 18, 6);
        }
        px(this.gfx, out, 36, 72, 28, 40);
        px(this.gfx, 0x5c4020, 37, 82, 26, 30);
        px(this.gfx, 0x7a5828, 37, 73, 26, 12);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Greenhouse Bldg ─────────────────────────────────────
      case 'greenhouse_bldg': {
        const W = 80, H = 80;
        const out = 0x080808;
        px(this.gfx, 0x000000, 6, 76, 72, 6, 0.18);
        px(this.gfx, out, 2, 20, 76, 60);
        px(this.gfx, 0x88c890, 3, 29, 74, 42, 0.8);
        for (let gx = 3; gx < 76; gx += 16) px(this.gfx, 0x4a7830, gx, 21, 2, 50);
        for (let gy = 21; gy < 70; gy += 14) px(this.gfx, 0x4a7830, 3, gy, 74, 2);
        px(this.gfx, 0x2e6820, 8, 35, 4, 20, 0.7);
        px(this.gfx, 0x2e6820, 28, 30, 4, 25, 0.7);
        px(this.gfx, out, 32, 52, 16, 28);
        px(this.gfx, 0x3a6028, 33, 53, 14, 27);
        px(this.gfx, 0xe0c080, 38, 68, 3, 4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Stone Wall H / V ────────────────────────────────────
      case 'stone_wall_h': {
        const W = 32, H = 20;
        const out = 0x080808;
        const s1 = COLORS.stone1, s2 = COLORS.stone2;
        px(this.gfx, out, 0, 0, W, H);
        for (let sy = 2; sy < 18; sy += 8) {
          const off = (sy === 2 ? 0 : 12);
          for (let sx = 2 + off; sx < 30; sx += 22) {
            px(this.gfx, s2, sx, sy, 20, 6);
            px(this.gfx, s1, sx, sy, 20, 2, 0.35);
          }
        }
        this.gfx.generateTexture(key, W, H);
        break;
      }
      case 'stone_wall_v': {
        const W = 20, H = 32;
        const out = 0x080808;
        const s1 = COLORS.stone1, s2 = COLORS.stone2;
        px(this.gfx, out, 0, 0, W, H);
        for (let sy = 2; sy < 30; sy += 8) {
          px(this.gfx, s2, 2, sy, 16, 6);
          px(this.gfx, s1, 2, sy, 16, 2, 0.3);
        }
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Gate ────────────────────────────────────────────────
      case 'gate': {
        const W = 80, H = 48;
        const out = 0x080808;
        const s1 = COLORS.stone1, s2 = COLORS.stone2;
        px(this.gfx, out, 0, 8, 80, 40);
        this.gfx.fillStyle(s2, 1);
        this.gfx.fillRect(0, 8, 80, 40);
        this.gfx.fillStyle(out, 1);
        this.gfx.fillRect(16, 8, 48, 38);
        px(this.gfx, 0x5c4028, 17, 9, 46, 36);
        px(this.gfx, out, 0, 0, 16, 48);
        px(this.gfx, s2, 1, 1, 14, 46);
        px(this.gfx, out, 64, 0, 16, 48);
        px(this.gfx, s2, 65, 1, 14, 46);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Lamp Post ───────────────────────────────────────────
      case 'lamp_post': {
        const W = 28, H = 80;
        const out = 0x080808;
        px(this.gfx, 0x000000, 5, 74, 14, 6, 0.18);
        px(this.gfx, out, 10, 16, 8, 60);
        px(this.gfx, 0x484848, 11, 17, 6, 58);
        px(this.gfx, out, 4, 12, 22, 6);
        px(this.gfx, 0x484848, 5, 13, 20, 4);
        px(this.gfx, out, 2, 0, 24, 14);
        px(this.gfx, 0x303030, 3, 1, 22, 3);
        px(this.gfx, 0xffd860, 3, 4, 22, 8, 0.95);
        this.gfx.fillStyle(COLORS.lanternGlow, 0.06);
        this.gfx.fillCircle(14, 8, 22);
        px(this.gfx, out, 7, 74, 14, 6);
        px(this.gfx, 0x484848, 8, 75, 12, 4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Flower Pot ──────────────────────────────────────────
      case 'flower_pot': {
        const W = 24, H = 28;
        const out = 0x080808;
        px(this.gfx, 0x000000, 3, 22, 18, 4, 0.18);
        px(this.gfx, out, 4, 12, 16, 16);
        px(this.gfx, 0xd06838, 5, 13, 14, 14);
        px(this.gfx, out, 3, 10, 18, 4);
        px(this.gfx, 0xe07840, 4, 11, 16, 2);
        this.gfx.fillStyle(0x2e6820, 1);
        this.gfx.fillCircle(12, 8, 8);
        px(this.gfx, COLORS.flowerPink, 9, 4, 4, 4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Mailbox ─────────────────────────────────────────────
      case 'mailbox': {
        const W = 26, H = 36;
        const out = 0x080808;
        px(this.gfx, out, 4, 12, 6, 22);
        px(this.gfx, COLORS.woodMed, 5, 13, 4, 20);
        px(this.gfx, out, 2, 4, 22, 12);
        px(this.gfx, 0xd03028, 3, 5, 20, 10);
        this.gfx.fillStyle(0xd03028, 1);
        this.gfx.fillEllipse(13, 8, 18, 10);
        px(this.gfx, out, 3, 10, 20, 2);
        px(this.gfx, 0xd4a030, 20, 7, 4, 4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Notice Board ────────────────────────────────────────
      case 'notice_board': {
        const W = 48, H = 48;
        const out = 0x080808;
        px(this.gfx, out, 8, 22, 8, 24);
        px(this.gfx, out, 32, 22, 8, 24);
        px(this.gfx, COLORS.woodMed, 9, 23, 6, 22);
        px(this.gfx, COLORS.woodMed, 33, 23, 6, 22);
        px(this.gfx, out, 2, 4, 44, 20);
        px(this.gfx, COLORS.woodLight, 3, 5, 42, 18);
        px(this.gfx, 0xf8f0e0, 5, 7, 38, 8);
        px(this.gfx, 0xff3030, 36, 7, 4, 4);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Barrel ──────────────────────────────────────────────
      case 'barrel': {
        const W = 24, H = 28;
        const out = 0x080808;
        px(this.gfx, 0x000000, 2, 22, 20, 6, 0.18);
        px(this.gfx, out, 2, 2, 20, 26);
        px(this.gfx, COLORS.woodMed, 3, 3, 18, 10);
        px(this.gfx, COLORS.woodLight, 4, 3, 16, 5);
        px(this.gfx, COLORS.woodMed, 3, 13, 18, 8);
        px(this.gfx, COLORS.woodLight, 4, 13, 16, 3);
        px(this.gfx, COLORS.woodMed, 3, 21, 18, 6);
        px(this.gfx, 0x3a2010, 2, 6, 20, 2);
        px(this.gfx, 0x3a2010, 2, 14, 20, 2);
        px(this.gfx, 0x3a2010, 2, 22, 20, 2);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Crate ───────────────────────────────────────────────
      case 'crate': {
        const W = 28, H = 28;
        const out = 0x080808;
        px(this.gfx, 0x000000, 2, 22, 24, 6, 0.18);
        px(this.gfx, out, 2, 2, 24, 26);
        px(this.gfx, COLORS.woodMed, 3, 3, 22, 8);
        px(this.gfx, COLORS.woodLight, 4, 3, 20, 4);
        px(this.gfx, COLORS.woodMed, 3, 11, 22, 8);
        px(this.gfx, COLORS.woodMed, 3, 19, 22, 8);
        for (const y of [10, 18, 26]) px(this.gfx, out, 3, y, 22, 2);
        px(this.gfx, 0x9a7840, 3, 12, 22, 2, 0.6);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Market Stall ────────────────────────────────────────
      case 'market_stall': {
        const W = 80, H = 66;
        const out = 0x080808;
        px(this.gfx, 0x000000, 6, 64, 72, 8, 0.18);
        px(this.gfx, out, 0, 8, 80, 16);
        for (let x = 0; x < 80; x += 10) px(this.gfx, x % 20 === 0 ? 0xd03028 : 0xf0f0f0, x, 8, 10, 14);
        px(this.gfx, out, 4, 42, 72, 24);
        px(this.gfx, COLORS.woodLight, 5, 43, 70, 8);
        px(this.gfx, COLORS.woodMed, 5, 51, 70, 12);
        px(this.gfx, out, 4, 24, 6, 42);
        px(this.gfx, COLORS.woodMed, 5, 25, 4, 40);
        px(this.gfx, out, 70, 24, 6, 42);
        px(this.gfx, COLORS.woodMed, 71, 25, 4, 40);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      // ── Well ────────────────────────────────────────────────
      case 'well': {
        const W = 48, H = 54;
        const out = 0x080808;
        px(this.gfx, 0x000000, 8, 46, 32, 8, 0.18);
        px(this.gfx, out, 6, 32, 36, 20);
        px(this.gfx, COLORS.stone2, 7, 33, 34, 18);
        px(this.gfx, out, 2, 10, 44, 24);
        for (const ox of [4, 38]) {
          px(this.gfx, out, ox, 10, 6, 26);
          px(this.gfx, COLORS.woodMed, ox + 1, 11, 4, 24);
        }
        px(this.gfx, out, 0, 4, 48, 10);
        px(this.gfx, 0xa84828, 1, 5, 46, 6);
        this.gfx.generateTexture(key, W, H);
        break;
      }

      default: {
        // Generic fallback — small colored square with outline
        px(this.gfx, 0xffffff, 0, 0, 32, 32, 0.3);
        this.gfx.lineStyle(1, 0x888888, 0.5);
        this.gfx.strokeRect(0, 0, 32, 32);
        this.gfx.generateTexture(key, 32, 32);
        break;
      }
    }
  }
}
