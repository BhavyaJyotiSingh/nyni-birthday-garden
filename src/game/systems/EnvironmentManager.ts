// ============================================================
// EnvironmentManager — Day/night cycle, atmosphere, stars, fireflies
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { DAY_CYCLE_DURATION, TIME_PHASES } from '../constants';
import { randFloat, randInt } from '../utils/math';

export class EnvironmentManager {
  private scene: GameScene;
  private timeProgress = 0; // 0 to 1
  private overlay: Phaser.GameObjects.Rectangle;
  private stars: Phaser.GameObjects.Sprite[] = [];
  private starsCreated = false;
  private fireflies: Phaser.GameObjects.Sprite[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;

    // Full-screen tint overlay
    this.overlay = scene.add.rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, 0xffffff, 0);
    this.overlay.setOrigin(0, 0);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(99000);
    this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
  }

  setTime(progress: number): void {
    this.timeProgress = progress;
  }

  getTimeProgress(): number {
    return this.timeProgress;
  }

  update(delta: number): void {
    // Advance time
    this.timeProgress += delta / DAY_CYCLE_DURATION;
    this.timeProgress = Math.min(this.timeProgress, 1);

    // Determine current phase and interpolate
    this.updateLighting();
    this.updateStars();
    this.updateFireflies(delta);
  }

  private updateLighting(): void {
    const t = this.timeProgress;
    let tintColor = 0xffffff;
    let alpha = 0;

    const phases = TIME_PHASES;

    if (t < phases.morning.end) {
      tintColor = phases.morning.tint;
      alpha = phases.morning.alpha * (1 - t / phases.morning.end);
    } else if (t < phases.afternoon.end) {
      tintColor = phases.afternoon.tint;
      alpha = phases.afternoon.alpha;
    } else if (t < phases.goldenHour.end) {
      const localT = (t - phases.goldenHour.start) / (phases.goldenHour.end - phases.goldenHour.start);
      tintColor = this.lerpColor(phases.afternoon.tint, phases.goldenHour.tint, localT);
      alpha = phases.goldenHour.alpha * localT;
    } else if (t < phases.sunset.end) {
      const localT = (t - phases.sunset.start) / (phases.sunset.end - phases.sunset.start);
      tintColor = this.lerpColor(phases.goldenHour.tint, phases.sunset.tint, localT);
      alpha = phases.goldenHour.alpha + (phases.sunset.alpha - phases.goldenHour.alpha) * localT;
    } else {
      const localT = (t - phases.night.start) / (phases.night.end - phases.night.start);
      tintColor = this.lerpColor(phases.sunset.tint, phases.night.tint, Math.min(localT * 2, 1));
      alpha = phases.sunset.alpha + (phases.night.alpha - phases.sunset.alpha) * localT;
    }

    this.overlay.setFillStyle(tintColor, alpha);
  }

  private updateStars(): void {
    if (this.timeProgress < 0.65) return;

    if (!this.starsCreated) {
      this.starsCreated = true;
      // Create stars
      const cam = this.scene.cameras.main;
      for (let i = 0; i < 60; i++) {
        const star = this.scene.add.sprite(
          randFloat(0, cam.width),
          randFloat(0, cam.height * 0.5),
          'particle_star'
        );
        star.setScrollFactor(0.02); // Slight parallax
        star.setDepth(98000);
        star.setAlpha(0);
        star.setScale(randFloat(0.3, 1.0));
        this.stars.push(star);

        // Twinkle animation
        this.scene.tweens.add({
          targets: star,
          alpha: randFloat(0.3, 0.9),
          duration: randInt(2000, 4000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: randInt(0, 3000),
        });
      }
    }

    // Fade in stars
    const starAlpha = Math.min((this.timeProgress - 0.65) / 0.15, 1);
    for (const star of this.stars) {
      star.setVisible(starAlpha > 0);
    }
  }

  private updateFireflies(_delta: number): void {
    if (this.timeProgress < 0.7) return;

    // Spawn fireflies
    if (this.fireflies.length < 25 && Math.random() < 0.02) {
      const cam = this.scene.cameras.main;
      const px = this.scene.playerSystem.x;
      const py = this.scene.playerSystem.y;

      const ff = this.scene.add.sprite(
        px + randFloat(-cam.width / 2, cam.width / 2),
        py + randFloat(-cam.height / 2, cam.height / 2),
        'particle_firefly'
      );
      ff.setScale(randFloat(0.8, 1.5));
      ff.setAlpha(0);
      ff.setDepth(95000);
      ff.setBlendMode(Phaser.BlendModes.ADD);

      this.fireflies.push(ff);

      // Fade in/out glow animation
      this.scene.tweens.add({
        targets: ff,
        alpha: { from: 0, to: randFloat(0.4, 0.9) },
        duration: randInt(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Drift movement
      this.scene.tweens.add({
        targets: ff,
        x: ff.x + randFloat(-60, 60),
        y: ff.y + randFloat(-40, 40),
        duration: randInt(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private lerpColor(c1: number, c2: number, t: number): number {
    const r1 = (c1 >> 16) & 0xFF, g1 = (c1 >> 8) & 0xFF, b1 = c1 & 0xFF;
    const r2 = (c2 >> 16) & 0xFF, g2 = (c2 >> 8) & 0xFF, b2 = c2 & 0xFF;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return (r << 16) | (g << 8) | b;
  }

  /** Force night mode (for ending) */
  setNight(): void {
    this.timeProgress = 0.85;
  }

  /** Spawn many fireflies (for ending) */
  spawnEndingFireflies(cx: number, cy: number): void {
    for (let i = 0; i < 30; i++) {
      const ff = this.scene.add.sprite(
        cx + randFloat(-200, 200),
        cy + randFloat(-200, 200),
        'particle_firefly'
      );
      ff.setScale(randFloat(1, 2));
      ff.setDepth(95000);
      ff.setBlendMode(Phaser.BlendModes.ADD);

      this.scene.tweens.add({
        targets: ff,
        alpha: { from: 0, to: randFloat(0.5, 1) },
        duration: randInt(800, 1500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: randInt(0, 1000),
      });

      this.scene.tweens.add({
        targets: ff,
        x: ff.x + randFloat(-80, 80),
        y: ff.y + randFloat(-60, 60),
        duration: randInt(2000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
