// ============================================================
// BootScene — Boots the game and launches PreloadScene
// ============================================================

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    console.log('BootScene: starting PreloadScene');
    // Transition to the PreloadScene immediately
    this.scene.start('PreloadScene');
  }
}
