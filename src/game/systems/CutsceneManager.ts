// ============================================================
// CutsceneManager — Opening, ending, and scripted sequences
// ============================================================

import { GameScene } from '../scenes/GameScene';
import { BIRTHDAY_MESSAGE } from '../data/memories';

export class CutsceneManager {
  private scene: GameScene;
  private _isPlaying = false;

  get isPlaying(): boolean { return this._isPlaying; }

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(_delta: number): void {
    // Typing update for dialogue during cutscenes
    if (this.scene.dialogueSystem.isActive) {
      this.scene.dialogueSystem.updateTyping(_delta);
    }
  }

  /** Opening cutscene — player wakes up */
  async playOpening(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    // Player starts invisible
    this.scene.playerSystem.gameObject.setAlpha(0);
    this.scene.playerSystem.gameObject.setScale(0.5);

    // Camera fade in
    this.scene.cameraSystem.fadeIn(2000);

    // Wait
    await this.wait(1500);

    // Player appears
    this.scene.tweens.add({
      targets: this.scene.playerSystem.gameObject,
      alpha: 1,
      scaleX: 2,
      scaleY: 2,
      duration: 1200,
      ease: 'Back.easeOut',
    });

    await this.wait(1800);

    // Zoom out slightly to reveal surroundings
    this.scene.cameraSystem.zoomTo(0.95, 2000);

    await this.wait(1000);

    // Opening dialogue
    this.scene.dialogueSystem.startDialogue('opening');

    // Wait for dialogue to complete (handled by event system)
    this._isPlaying = false;
  }

  /** Ending — player meets NPC (Bhavya stands) */
  async playEndingMeet(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    const targetX = 2400;
    const targetY = 480;

    // Teleport Bhavya's ragdoll beneath the Observatory tree and stand him up
    this.scene.companionSystem.gameObject.setPosition(targetX, targetY);
    this.scene.companionSystem.setEndingMode(true);
    this.scene.companionSystem.gameObject.setVisible(true);
    this.scene.companionSystem.gameObject.setAlpha(0);

    // Fade Bhavya in standing
    this.scene.tweens.add({
      targets: this.scene.companionSystem.gameObject,
      alpha: 1,
      duration: 1200,
      ease: 'Sine.easeOut',
    });

    // Camera zooms in slightly
    this.scene.cameraSystem.zoomTo(1.1, 1500);

    await this.wait(1500);

    // Start meeting dialogue
    this.scene.dialogueSystem.startDialogue('ending_meet');
    this._isPlaying = false;
  }

  /** Ending — walk together */
  async playEndingWalk(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    const targetX = 2400;
    const targetY = 480;

    // Walk player close to standing Bhavya
    await this.scene.playerSystem.walkTo(targetX - 40, targetY, 2000);

    // Walk both slowly to the center beneath the giant cherry tree
    const centerX = 2400;
    const centerY = 440;
    const walkDuration = 2500;

    this.scene.tweens.add({
      targets: this.scene.companionSystem.gameObject,
      x: centerX + 25,
      y: centerY,
      duration: walkDuration,
      ease: 'Sine.easeInOut',
    });
    await this.scene.playerSystem.walkTo(centerX - 25, centerY, walkDuration);

    await this.wait(500);

    // Start final dialogue
    this.scene.dialogueSystem.startDialogue('ending_final');
    this._isPlaying = false;
  }

  /** Ending finale — fireworks, butterflies, birthday message, cake */
  async playEndingFinale(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    const cx = 2400;
    const cy = 440;

    // Camera zooms out slightly for grand finale
    this.scene.cameraSystem.zoomTo(1.15, 1000);

    // Spawn Birthday Cake
    const cake = this.scene.add.sprite(cx, cy - 25, 'cake');
    cake.setScale(0);
    cake.setDepth(cy - 20);
    this.scene.tweens.add({
      targets: cake,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1200,
      ease: 'Back.easeOut',
    });

    // Bloom rapid flowers in circle
    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
      for (let r = 40; r < 200; r += 35) {
        const fx = cx + Math.cos(angle) * r;
        const fy = cy + Math.sin(angle) * r;
        this.scene.flowerSystem.tryBloomAt(fx, fy);
      }
    }

    await this.wait(1000);

    // Butterflies gather
    this.scene.butterflySystem.spawnEndingSwarm(cx, cy);

    await this.wait(1000);

    // Fireflies
    this.scene.environmentManager.spawnEndingFireflies(cx, cy);

    // Light all lanterns
    this.scene.interactionSystem.lightAllLanterns();

    await this.wait(1500);

    // Camera slow circle
    this.scene.cameraSystem.circleAround(cx, cy, 60, 5000);

    await this.wait(2000);

    // Fireworks!
    this.scene.effectsManager.createFireworks(cx, cy);

    await this.wait(2000);

    // Birthday message
    this.showBirthdayMessage(cx, cy);

    await this.wait(8000);

    // Fade to credits
    await this.scene.cameraSystem.fadeOut(2000);
    await this.wait(500);

    this._isPlaying = false;
    this.scene.events.emit('goto_credits');
  }

  private showBirthdayMessage(_cx: number, _cy: number): void {
    const cam = this.scene.cameras.main;

    // Title
    const title = this.scene.add.text(cam.width / 2, cam.height * 0.25, BIRTHDAY_MESSAGE.title, {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '52px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5, 0.5);
    title.setScrollFactor(0);
    title.setDepth(100010);
    title.setAlpha(0);

    // Message
    const messageText = BIRTHDAY_MESSAGE.lines.join('\n');
    const message = this.scene.add.text(cam.width / 2, cam.height * 0.5, messageText, {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '20px',
      fontStyle: 'italic',
      color: '#f0e8d8',
      align: 'center',
      lineSpacing: 8,
    });
    message.setOrigin(0.5, 0.5);
    message.setScrollFactor(0);
    message.setDepth(100010);
    message.setAlpha(0);

    // Animate in
    this.scene.tweens.add({
      targets: title,
      alpha: 1,
      y: cam.height * 0.28,
      duration: 1500,
      ease: 'Cubic.easeOut',
    });

    this.scene.tweens.add({
      targets: message,
      alpha: 1,
      y: cam.height * 0.52,
      duration: 1500,
      delay: 800,
      ease: 'Cubic.easeOut',
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.scene.time.delayedCall(ms, resolve);
    });
  }
}
