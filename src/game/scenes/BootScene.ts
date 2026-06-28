// ============================================================
// BootScene — Boots the game and launches PreloadScene
// ============================================================

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Transition to the PreloadScene immediately
    this.scene.start('PreloadScene');
  }
}
