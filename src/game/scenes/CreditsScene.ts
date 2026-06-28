// ============================================================
// CreditsScene — Scrolling credits with flower background
// ============================================================

import Phaser from 'phaser';
import { BIRTHDAY_MESSAGE } from '../data/memories';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.cameras.main.setBackgroundColor('#0a0612');
    this.cameras.main.fadeIn(2000, 10, 6, 18);

    // Credits content
    const credits = [
      '',
      '',
      '🌸 A Garden For You 🌸',
      '',
      '',
      BIRTHDAY_MESSAGE.title,
      '',
      ...BIRTHDAY_MESSAGE.lines,
      '',
      '',
      '— — —',
      '',
      '',
      'This game was made with love',
      'as a birthday gift for you.',
      '',
      '',
      'Every flower you planted,',
      'every path you walked,',
      'every memory you found...',
      '',
      'They are all pieces of my heart.',
      '',
      '',
      '— — —',
      '',
      '',
      'Made with',
      '❤️',
      '',
      '',
      '',
      'Thank you for playing.',
      '',
      '',
      '',
    ];

    const creditsText = this.add.text(width / 2, height + 50, credits.join('\n'), {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '22px',
      color: '#f0e8d8',
      align: 'center',
      lineSpacing: 10,
    });
    creditsText.setOrigin(0.5, 0);

    // Scroll up
    const totalHeight = creditsText.height + height + 100;
    this.tweens.add({
      targets: creditsText,
      y: -creditsText.height - 50,
      duration: totalHeight * 25,
      ease: 'Linear',
      onComplete: () => {
        // Show restart option
        const restartText = this.add.text(width / 2, height / 2, 'Click anywhere to restart', {
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '18px',
          color: '#f2a0b5',
          align: 'center',
        });
        restartText.setOrigin(0.5, 0.5);
        restartText.setAlpha(0);

        this.tweens.add({
          targets: restartText,
          alpha: 1,
          duration: 1000,
        });

        this.input.once('pointerdown', () => {
          this.scene.start('GameScene');
        });
      },
    });

    // Floating petals during credits
    this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => {
        if (!this.textures.exists('particle_petal_pink')) return;
        const petal = this.add.sprite(
          Math.random() * width,
          -10,
          Math.random() > 0.5 ? 'particle_petal_pink' : 'particle_petal_white'
        );
        petal.setScale(1 + Math.random());
        petal.setAlpha(0.4 + Math.random() * 0.4);
        petal.setDepth(1);

        this.tweens.add({
          targets: petal,
          x: petal.x + (Math.random() - 0.5) * 200,
          y: height + 20,
          rotation: Math.random() * 4 - 2,
          alpha: 0,
          duration: 4000 + Math.random() * 3000,
          ease: 'Sine.easeIn',
          onComplete: () => petal.destroy(),
        });
      },
    });

    // Click to skip
    const skipText = this.add.text(width - 20, height - 20, 'Click to skip', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '12px',
      color: '#666666',
    });
    skipText.setOrigin(1, 1);
    skipText.setAlpha(0.5);

    this.input.once('pointerdown', () => {
      skipText.destroy();
    });
  }
}
