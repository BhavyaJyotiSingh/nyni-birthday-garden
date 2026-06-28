// ============================================================
// PreloadScene — Loads real files or generates fallbacks
// ============================================================

import Phaser from 'phaser';
import { getAllAssets } from '../assets/AssetManifest';
import { PlaceholderGenerator } from '../assets/PlaceholderGenerator';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const { width, height } = this.cameras.main;

    // Background decoration
    this.cameras.main.setBackgroundColor('#0a0612');

    // Create a simple, elegant loading progress bar
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x1a0a2e, 1);
    progressBg.fillRoundedRect(width / 2 - 160, height / 2 - 10, 320, 20, 10);
    progressBg.lineStyle(1.5, 0x483868, 0.5);
    progressBg.strokeRoundedRect(width / 2 - 160, height / 2 - 10, 320, 20, 10);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'Entering the Garden...', {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '24px',
      fontStyle: 'italic',
      color: '#f0e8d8',
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2 + 30, '0%', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '14px',
      color: '#f2a0b5',
    });
    percentText.setOrigin(0.5, 0.5);

    // Update progress bar
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xf2a0b5, 1);
      progressBar.fillRoundedRect(width / 2 - 156, height / 2 - 6, 312 * value, 12, 6);
      percentText.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBg.destroy();
      progressBar.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // 1. Generate procedural placeholders for assets that don't have paths
    const generator = new PlaceholderGenerator(this);
    generator.generateAll();

    // Create a simple 1x1 white texture for tinting/particles
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture('white_pixel', 4, 4);
    gfx.destroy();

    // 2. Load any external files defined in the manifest
    const assets = getAllAssets();
    for (const asset of assets) {
      if (asset.path) {
        if (asset.type === 'image') {
          this.load.image(asset.key, asset.path);
        } else if (asset.type === 'spritesheet') {
          this.load.spritesheet(asset.key, asset.path, {
            frameWidth: asset.frameWidth,
            frameHeight: asset.frameHeight,
          });
        }
      }
    }
  }

  create(): void {
    // When preloading completes, start the GameScene
    this.scene.start('GameScene');
  }
}
