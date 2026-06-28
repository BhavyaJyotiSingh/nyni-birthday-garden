// ============================================================
// PlayerSystem — Movement, animation, input handling
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { PLAYER_SPEED, PLAYER_SCALE } from '../constants';

export class PlayerSystem {
  private scene: GameScene;
  private sprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private velocity = { x: 0, y: 0 };
  private facing = 'down';
  private isMoving = false;
  private _lastFlowerX = 0;
  private _lastFlowerY = 0;
  private stillTime = 0;
  private footstepsTriggered = false;

  // Mobile joystick input
  public joystickVector = { x: 0, y: 0 };

  get x(): number { return this.sprite.x; }
  get y(): number { return this.sprite.y; }
  get gameObject(): Phaser.GameObjects.Sprite { return this.sprite; }
  get isWalking(): boolean { return this.isMoving; }
  get direction(): string { return this.facing; }

  constructor(scene: GameScene) {
    this.scene = scene;

    // Create player sprite at Cottage
    this.sprite = scene.add.sprite(2392, 2392, 'player_down');
    this.sprite.setScale(PLAYER_SCALE);
    this.sprite.setDepth(100);
    this.sprite.setOrigin(0.5, 0.8);

    // Physics body
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 8);
    body.setOffset(10, 36);
    body.setCollideWorldBounds(true);

    // Keyboard input
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    this._lastFlowerX = this.sprite.x;
    this._lastFlowerY = this.sprite.y;
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    if (this.sprite.body) {
      (this.sprite.body as Phaser.Physics.Arcade.Body).reset(x, y);
    }
    this._lastFlowerX = x;
    this._lastFlowerY = y;
  }

  getHandPosition(): { x: number; y: number } {
    const offsets: Record<string, { x: number; y: number }> = {
      left: { x: -23, y: 8 },
      right: { x: 23, y: 8 },
      up: { x: -15, y: 7 },
      down: { x: -20, y: 10 },
    };
    const offset = offsets[this.facing] ?? offsets.down;
    return {
      x: this.sprite.x + offset.x,
      y: this.sprite.y + offset.y,
    };
  }

  update(_delta: number): void {
    if (!this.scene.playerControlEnabled) {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      return;
    }

    if (this.scene.dialogueSystem.isActive || this.scene.cutsceneManager.isPlaying) {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      this.isMoving = false;
      return;
    }

    this.handleInput();
    this.updateAnimation();
    this.checkFlowerSpawn();
    this.checkStandingFootsteps(_delta);

    // Depth sort by Y position
    this.sprite.setDepth(this.sprite.y);
  }

  private handleInput(): void {
    // Teleport Cheat Keys for Testing (T: Cherry Garden, Y: Observatory, U: Crystal Lake)
    if (this.scene.input.keyboard) {
      const keyT = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
      const keyY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
      const keyU = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
      
      if (Phaser.Input.Keyboard.JustDown(keyT)) {
        this.setPosition(1400, 233); // Cherry Blossom Hill
      }
      if (Phaser.Input.Keyboard.JustDown(keyY)) {
        this.setPosition(2392, 408); // Observatory / Birthday Garden area
      }
      if (Phaser.Input.Keyboard.JustDown(keyU)) {
        this.setPosition(1983, 1283); // Crystal Lake
      }
    }

    let vx = 0;
    let vy = 0;

    // Keyboard
    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1;
      if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1;
      if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1;
    }

    // Mobile joystick override
    if (Math.abs(this.joystickVector.x) > 0.1 || Math.abs(this.joystickVector.y) > 0.1) {
      vx = this.joystickVector.x;
      vy = this.joystickVector.y;
    }

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx /= len;
      vy /= len;
    }

    this.velocity.x = vx * PLAYER_SPEED;
    this.velocity.y = vy * PLAYER_SPEED;
    this.isMoving = vx !== 0 || vy !== 0;

    // Update facing direction
    if (this.isMoving) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this.facing = vx < 0 ? 'left' : 'right';
      } else {
        this.facing = vy < 0 ? 'up' : 'down';
      }
    }

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(this.velocity.x, this.velocity.y);
  }

  private updateAnimation(): void {
    const key = this.isMoving ? `player_${this.facing}` : 'player_idle';
    if (this.sprite.texture.key !== key) {
      this.sprite.setTexture(key);
    }

    // Simple bob animation when walking
    if (this.isMoving) {
      const bob = Math.sin(this.scene.time.now * 0.008) * 1.5;
      this.sprite.setY(this.sprite.y + bob * 0.1);
    }
  }

  private checkFlowerSpawn(): void {
    if (!this.isMoving) return;

    const dx = this.sprite.x - this._lastFlowerX;
    const dy = this.sprite.y - this._lastFlowerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= 20) {
      this.scene.flowerSystem.tryBloomAt(this.sprite.x, this.sprite.y);
      this._lastFlowerX = this.sprite.x;
      this._lastFlowerY = this.sprite.y;
    }
  }

  /** Smoothly walk to a position (used by cutscenes) */
  walkTo(x: number, y: number, duration: number): Promise<void> {
    return new Promise(resolve => {
      this.scene.tweens.add({
        targets: this.sprite,
        x, y,
        duration,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          this.sprite.setDepth(this.sprite.y);
          this.checkFlowerSpawn();
        },
        onComplete: () => resolve(),
      });
    });
  }

  private checkStandingFootsteps(delta: number): void {
    if (this.isMoving) {
      this.stillTime = 0;
      this.footstepsTriggered = false;
      return;
    }

    this.stillTime += delta;

    if (this.stillTime >= 2400 && !this.footstepsTriggered) {
      this.footstepsTriggered = true;

      // Play first footstep
      this.scene.audioSystem.playFootstep();
      
      const ox = this.facing === 'left' ? 20 : this.facing === 'right' ? -20 : 0;
      const oy = this.facing === 'up' ? 20 : this.facing === 'down' ? -20 : 15;
      
      const particle1 = this.scene.add.sprite(this.sprite.x + ox, this.sprite.y + oy, 'particle_leaf');
      particle1.setScale(0.8);
      particle1.setAlpha(0.5);
      particle1.setDepth(this.sprite.y - 1);
      this.scene.tweens.add({
        targets: particle1,
        y: particle1.y - 10,
        alpha: 0,
        duration: 500,
        onComplete: () => particle1.destroy()
      });

      // Play second footstep 250ms later
      this.scene.time.delayedCall(250, () => {
        this.scene.audioSystem.playFootstep();
        const particle2 = this.scene.add.sprite(this.sprite.x + ox + (Math.random() - 0.5) * 10, this.sprite.y + oy, 'particle_leaf');
        particle2.setScale(0.8);
        particle2.setAlpha(0.5);
        particle2.setDepth(this.sprite.y - 1);
        this.scene.tweens.add({
          targets: particle2,
          y: particle2.y - 10,
          alpha: 0,
          duration: 500,
          onComplete: () => particle2.destroy()
        });
      });
    }
  }
}
