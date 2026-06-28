// ============================================================
// CameraSystem — Smooth cinematic camera follow
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { CAMERA_LERP, CAMERA_DEADZONE_W, CAMERA_DEADZONE_H, WORLD_WIDTH, WORLD_HEIGHT } from '../constants';

export class CameraSystem {
  private scene: GameScene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private targetZoom = 1.5;
  private zoomSpeed = 0.02;

  constructor(scene: GameScene) {
    this.scene = scene;
    this.camera = scene.cameras.main;

    this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.camera.setZoom(1.5);

    // Start following player
    const player = scene.playerSystem.gameObject;
    this.camera.startFollow(player, true, CAMERA_LERP, CAMERA_LERP);
    this.camera.setDeadzone(CAMERA_DEADZONE_W, CAMERA_DEADZONE_H);

    // Initial fade in
    this.camera.fadeIn(1500, 10, 6, 18);
  }

  update(_delta: number): void {
    // Smooth zoom transitions
    if (Math.abs(this.camera.zoom - this.targetZoom) > 0.001) {
      this.camera.zoom += (this.targetZoom - this.camera.zoom) * this.zoomSpeed;
    }
  }

  /** Smoothly zoom to a target level */
  zoomTo(zoom: number, duration = 1000): void {
    this.targetZoom = zoom;
    this.zoomSpeed = 2 / duration;
  }

  /** Pan camera to a world position */
  panTo(x: number, y: number, duration = 1500): Promise<void> {
    return new Promise(resolve => {
      this.camera.stopFollow();
      this.camera.pan(x, y, duration, 'Sine.easeInOut', false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress >= 1) resolve();
      });
    });
  }

  /** Resume following player */
  resumeFollow(): void {
    const player = this.scene.playerSystem.gameObject;
    this.camera.startFollow(player, true, CAMERA_LERP, CAMERA_LERP);
    this.camera.setDeadzone(CAMERA_DEADZONE_W, CAMERA_DEADZONE_H);
  }

  /** Gentle camera shake */
  shake(duration = 200, intensity = 0.003): void {
    this.camera.shake(duration, intensity);
  }

  /** Fade to black */
  fadeOut(duration = 1000): Promise<void> {
    return new Promise(resolve => {
      this.camera.fadeOut(duration, 10, 6, 18);
      this.scene.time.delayedCall(duration, () => resolve());
    });
  }

  /** Fade from black */
  fadeIn(duration = 1000): void {
    this.camera.fadeIn(duration, 10, 6, 18);
  }

  /** Slow circle around a point (for ending) */
  async circleAround(cx: number, cy: number, radius: number, duration: number): Promise<void> {
    this.camera.stopFollow();
    const startTime = this.scene.time.now;

    return new Promise(resolve => {
      const event = this.scene.time.addEvent({
        delay: 16,
        repeat: Math.floor(duration / 16),
        callback: () => {
          const elapsed = this.scene.time.now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const angle = progress * Math.PI * 2;

          this.camera.centerOn(
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius
          );

          if (progress >= 1) {
            event.remove();
            resolve();
          }
        },
      });
    });
  }
}
