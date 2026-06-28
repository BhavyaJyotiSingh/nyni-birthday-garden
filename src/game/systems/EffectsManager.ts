// ============================================================
// EffectsManager — Particles, god rays, bloom, petals
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { randFloat, randInt } from '../utils/math';

export class EffectsManager {
  private scene: GameScene;
  private petalTimer = 0;
  private pollenTimer = 0;
  private leafTimer = 0;
  private godRays: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: GameScene) {
    this.scene = scene;
    
    // Volumetric JRPG God Rays overlay
    this.godRays = scene.add.graphics();
    this.godRays.setScrollFactor(0);
    this.godRays.setDepth(98000);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    this.updatePetals(dt);
    this.updatePollen(dt);
    this.updateLeaves(dt);
    this.drawGodRays(this.scene.time.now);
  }

  private drawGodRays(time: number): void {
    if (!this.godRays) return;
    this.godRays.clear();
    
    const progress = this.scene.environmentManager.getTimeProgress();
    if (progress > 0.72) return; // Hide rays during night
    
    const cam = this.scene.cameras.main;
    let tint = 0xffe8a0; // bright day ray
    let maxAlpha = 0.08;
    
    if (progress < 0.2) {
      tint = 0xfffcf0; // cool morning ray
      maxAlpha = 0.06;
    } else if (progress > 0.5 && progress <= 0.72) {
      tint = 0xff7744; // golden sunset ray
      maxAlpha = 0.12;
    }
    
    const rayCount = 4;
    for (let i = 0; i < rayCount; i++) {
      const offset = Math.sin(time * 0.0006 + i * 2.5) * 60;
      const width = 80 + Math.sin(time * 0.0004 + i * 1.2) * 20;
      const startX = 100 + i * 320 + offset;
      
      const p1 = { x: startX, y: 0 };
      const p2 = { x: startX + width, y: 0 };
      const p3 = { x: startX - 200 + width * 2, y: cam.height };
      const p4 = { x: startX - 200, y: cam.height };
      
      const alpha = Math.max(0, maxAlpha * (0.4 + Math.sin(time * 0.0008 + i * 1.8) * 0.3));
      
      this.godRays.fillStyle(tint, alpha);
      this.godRays.beginPath();
      this.godRays.moveTo(p1.x, p1.y);
      this.godRays.lineTo(p2.x, p2.y);
      this.godRays.lineTo(p3.x, p3.y);
      this.godRays.lineTo(p4.x, p4.y);
      this.godRays.closePath();
      this.godRays.fillPath();
    }
  }

  private updatePetals(dt: number): void {
    this.petalTimer += dt;
    if (this.petalTimer < 0.6) return;
    this.petalTimer = 0;

    const area = this.scene.currentArea;
    // Spawn if in cherry garden or observatory
    if (area !== 'cherryGarden' && area !== 'observatory') return;

    const cam = this.scene.cameras.main;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    for (let i = 0; i < 3; i++) {
      const petal = this.scene.add.sprite(
        px + randFloat(-cam.width / 2, cam.width / 2),
        py - cam.height / 2 - 20,
        Math.random() > 0.5 ? 'particle_petal_pink' : 'particle_petal_white'
      );
      petal.setScale(randFloat(0.8, 1.6));
      petal.setAlpha(randFloat(0.5, 0.9));
      petal.setDepth(97000);

      const endX = petal.x + randFloat(-150, 150);
      const endY = py + cam.height / 2 + 30;

      this.scene.tweens.add({
        targets: petal,
        x: endX,
        y: endY,
        rotation: randFloat(-3, 3),
        alpha: 0,
        duration: randInt(3500, 6500),
        ease: 'Sine.easeIn',
        onComplete: () => petal.destroy(),
      });
    }
  }

  private updatePollen(dt: number): void {
    this.pollenTimer += dt;
    if (this.pollenTimer < 1.5) return;
    this.pollenTimer = 0;

    const area = this.scene.currentArea;
    // Spawn in rose garden or secret garden
    if (area !== 'roseGarden' && area !== 'secretGarden') return;

    const cam = this.scene.cameras.main;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    for (let i = 0; i < 4; i++) {
      const pollen = this.scene.add.sprite(
        px + randFloat(-cam.width / 2, cam.width / 2),
        py + randFloat(-cam.height / 2, cam.height / 2),
        'particle_pollen'
      );
      pollen.setScale(randFloat(0.5, 1.2));
      pollen.setAlpha(0);
      pollen.setDepth(96000);

      this.scene.tweens.add({
        targets: pollen,
        x: pollen.x + randFloat(-50, 50),
        y: pollen.y - randFloat(30, 70),
        alpha: { from: 0, to: 0.5 },
        duration: randInt(2500, 4500),
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => pollen.destroy(),
      });
    }
  }

  private updateLeaves(dt: number): void {
    this.leafTimer += dt;
    if (this.leafTimer < 2.5) return;
    this.leafTimer = 0;

    const area = this.scene.currentArea;
    if (area !== 'cottage' && area !== 'greenhouse') return;

    const cam = this.scene.cameras.main;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    const leaf = this.scene.add.sprite(
      px + randFloat(-cam.width / 2, cam.width / 2),
      py - cam.height / 2 - 10,
      'particle_leaf'
    );
    leaf.setScale(randFloat(1, 2));
    leaf.setAlpha(0.7);
    leaf.setDepth(96500);

    this.scene.tweens.add({
      targets: leaf,
      x: leaf.x + randFloat(-80, 80),
      y: py + cam.height / 2 + 20,
      rotation: randFloat(-3, 3),
      alpha: 0.2,
      duration: randInt(4000, 7000),
      ease: 'Sine.easeIn',
      onComplete: () => leaf.destroy(),
    });
  }

  /** Spooky burst of fireflies */
  createFireflyBurst(x: number, y: number): void {
    for (let i = 0; i < 15; i++) {
      const angle = randFloat(0, Math.PI * 2);
      const dist = randFloat(10, 45);
      const ff = this.scene.add.sprite(x, y, 'particle_firefly');
      ff.setScale(randFloat(1.5, 3.5));
      ff.setDepth(99000);
      ff.setAlpha(0.85);

      this.scene.tweens.add({
        targets: ff,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - randFloat(10, 30),
        alpha: 0,
        scale: 0,
        duration: randInt(800, 1600),
        ease: 'Cubic.easeOut',
        onComplete: () => ff.destroy(),
      });
    }
  }

  /** Splash effect for disappearing bridge */
  createWaterSplash(x: number, y: number): void {
    for (let i = 0; i < 20; i++) {
      const angle = randFloat(-Math.PI, 0); // upward splash
      const speed = randFloat(30, 90);
      const drop = this.scene.add.sprite(x, y, 'particle_water_drop');
      drop.setScale(randFloat(1.0, 2.5));
      drop.setDepth(98000);
      drop.setAlpha(0.9);

      this.scene.tweens.add({
        targets: drop,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed + 50, // falls down under gravity
        alpha: 0,
        duration: randInt(600, 1000),
        ease: 'Quad.easeOut',
        onComplete: () => drop.destroy(),
      });
    }
  }

  /** Small dust puff for Bhavya's sudden collapse */
  createDustCollapse(x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      const angle = randFloat(0, Math.PI * 2);
      const dist = randFloat(5, 25);
      const dust = this.scene.add.sprite(x, y, 'particle_sparkle');
      dust.setScale(randFloat(1.5, 3.0));
      dust.setDepth(y + 1);
      dust.setAlpha(0.6);
      dust.setTint(0xcccccc); // dust color

      this.scene.tweens.add({
        targets: dust,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 5,
        alpha: 0,
        scale: 0,
        duration: randInt(400, 800),
        ease: 'Quad.easeOut',
        onComplete: () => dust.destroy(),
      });
    }
  }

  /** Create fireworks at position (for ending) */
  createFireworks(cx: number, cy: number): void {
    const createBurst = (x: number, y: number, delay: number) => {
      this.scene.time.delayedCall(delay, () => {
        const colors = [0xff4444, 0xffaa44, 0xff44aa, 0x44aaff, 0xaaff44, 0xffff44, 0xff88ff];
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const speed = randFloat(60, 140);
          const spark = this.scene.add.sprite(x, y, 'particle_firework');
          spark.setScale(randFloat(0.5, 1.5));
          spark.setTint(color);
          spark.setDepth(99500);
          spark.setBlendMode(Phaser.BlendModes.ADD);

          this.scene.tweens.add({
            targets: spark,
            x: x + Math.cos(angle) * speed,
            y: y + Math.sin(angle) * speed + 30,
            alpha: 0,
            scale: 0,
            duration: randInt(800, 1500),
            ease: 'Cubic.easeOut',
            onComplete: () => spark.destroy(),
          });
        }

        this.scene.cameraSystem.shake(100, 0.002);
      });
    };

    // Multiple bursts
    for (let i = 0; i < 8; i++) {
      createBurst(
        cx + randFloat(-200, 200),
        cy + randFloat(-250, -100),
        i * randInt(400, 800)
      );
    }
  }
}
