// ============================================================
// CutsceneManager — Opening, ending, and scripted sequences
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { BIRTHDAY_MESSAGE } from '../data/memories';
import { randFloat } from '../utils/math';

export class CutsceneManager {
  private scene: GameScene;
  private _isPlaying = false;
  private npcSprite: Phaser.GameObjects.Sprite | null = null;

  get isPlaying(): boolean { return this._isPlaying; }

  constructor(scene: GameScene) {
    this.scene = scene;

    // Create NPC in birthday garden (hidden initially)
    this.npcSprite = scene.add.sprite(2400, 5950, 'npc_idle');
    this.npcSprite.setScale(2);
    this.npcSprite.setDepth(5950);
    this.npcSprite.setOrigin(0.5, 0.8);
    this.npcSprite.setVisible(false);
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

  /** Ending — player meets NPC */
  async playEndingMeet(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    // Show NPC
    if (this.npcSprite) {
      this.npcSprite.setVisible(true);
      this.npcSprite.setAlpha(0);

      this.scene.tweens.add({
        targets: this.npcSprite,
        alpha: 1,
        duration: 1000,
        ease: 'Sine.easeOut',
      });
    }

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
    const targetY = 5950;

    // Walk player to NPC
    await this.scene.playerSystem.walkTo(targetX - 30, targetY, 2000);

    // Walk together to center
    const centerX = 2400;
    const centerY = 6000;

    const walkDuration = 2500;
    this.scene.tweens.add({
      targets: this.npcSprite,
      x: centerX + 20,
      y: centerY,
      duration: walkDuration,
      ease: 'Sine.easeInOut',
    });
    await this.scene.playerSystem.walkTo(centerX - 20, centerY, walkDuration);

    await this.wait(500);

    // Start final dialogue
    this.scene.dialogueSystem.startDialogue('ending_final');
    this._isPlaying = false;
  }

  /** Ending finale — fireworks, butterflies, birthday message */
  async playEndingFinale(): Promise<void> {
    this._isPlaying = true;
    this.scene.playerControlEnabled = false;

    const cx = 2400;
    const cy = 6000;

    // Camera circle
    this.scene.cameraSystem.zoomTo(1.15, 1000);

    // Bloom rapid flowers in circle
    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
      for (let r = 40; r < 180; r += 30) {
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
