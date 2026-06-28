// ============================================================
// BootScene — Generate placeholder textures, then start game
// ============================================================

import Phaser from 'phaser';
import { PlaceholderGenerator } from '../assets/PlaceholderGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Generate all placeholder textures
    const generator = new PlaceholderGenerator(this);
    generator.generateAll();

    // Create a simple 1x1 white texture for tinting/particles
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture('white_pixel', 4, 4);
    gfx.destroy();

    // Immediately start game
    this.scene.start('GameScene');
  }
}
