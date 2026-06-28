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

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(delta: number): void {
    const dt = delta / 1000;
    this.updatePetals(dt);
    this.updatePollen(dt);
    this.updateLeaves(dt);
  }

  private updatePetals(dt: number): void {
    this.petalTimer += dt;
    if (this.petalTimer < 0.8) return;
    this.petalTimer = 0;

    // Only spawn if in cherry blossom area or birthday garden
    const area = this.scene.currentArea;
    if (area !== 'cherryBlossomForest' && area !== 'birthdayGarden') return;

    const cam = this.scene.cameras.main;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    for (let i = 0; i < 2; i++) {
      const petal = this.scene.add.sprite(
        px + randFloat(-cam.width / 2, cam.width / 2),
        py - cam.height / 2 - 20,
        Math.random() > 0.5 ? 'particle_petal_pink' : 'particle_petal_white'
      );
      petal.setScale(randFloat(0.8, 1.5));
      petal.setAlpha(randFloat(0.5, 0.9));
      petal.setDepth(97000);

      const endX = petal.x + randFloat(-100, 100);
      const endY = py + cam.height / 2 + 30;

      this.scene.tweens.add({
        targets: petal,
        x: endX,
        y: endY,
        rotation: randFloat(-2, 2),
        alpha: 0,
        duration: randInt(3000, 6000),
        ease: 'Sine.easeIn',
        onComplete: () => petal.destroy(),
      });
    }
  }

  private updatePollen(dt: number): void {
    this.pollenTimer += dt;
    if (this.pollenTimer < 2) return;
    this.pollenTimer = 0;

    const area = this.scene.currentArea;
    if (area !== 'flowerMeadow' && area !== 'sunflowerField') return;

    const cam = this.scene.cameras.main;
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    for (let i = 0; i < 3; i++) {
      const pollen = this.scene.add.sprite(
        px + randFloat(-cam.width / 2, cam.width / 2),
        py + randFloat(-cam.height / 2, cam.height / 2),
        'particle_pollen'
      );
      pollen.setScale(randFloat(0.5, 1.0));
      pollen.setAlpha(0);
      pollen.setDepth(96000);

      this.scene.tweens.add({
        targets: pollen,
        x: pollen.x + randFloat(-40, 40),
        y: pollen.y - randFloat(20, 60),
        alpha: { from: 0, to: 0.4 },
        duration: randInt(3000, 5000),
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => pollen.destroy(),
      });
    }
  }

  private updateLeaves(dt: number): void {
    this.leafTimer += dt;
    if (this.leafTimer < 3) return;
    this.leafTimer = 0;

    const area = this.scene.currentArea;
    if (area !== 'cherryBlossomForest' && area !== 'flowerMeadow') return;

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
