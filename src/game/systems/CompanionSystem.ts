// ============================================================
// CompanionSystem - Bhavya the Unconscious Ragdoll
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { dist } from '../utils/math';

export class CompanionSystem {
  private scene: GameScene;
  private ragdoll: Phaser.Physics.Arcade.Sprite;
  private tether: Phaser.GameObjects.Graphics;
  private isTethered = false;
  private wasOffScreen = false;
  private endingMode = false;
  private interactableId = 'bhavya_ragdoll';

  get gameObject(): Phaser.Physics.Arcade.Sprite { return this.ragdoll; }
  get tethered(): boolean { return this.isTethered; }

  constructor(scene: GameScene) {
    this.scene = scene;

    // Spawn Bhavya initially beneath the cherry tree in the Cherry Garden
    // Coordinates: x: 3100, y: 2700 (matching the cherry tree location in worldConfig)
    this.ragdoll = scene.physics.add.sprite(3100, 2750, 'ragdoll_cross_eyes');
    this.ragdoll.setScale(2.0);
    this.ragdoll.setOrigin(0.5, 0.7);
    this.ragdoll.setBounce(0.12);
    this.ragdoll.setDrag(600, 600); // heavy drag when dropped
    this.ragdoll.setCollideWorldBounds(true);
    
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 20);
    body.setOffset(4, 8);
    this.ragdoll.setDepth(this.ragdoll.y);

    this.tether = scene.add.graphics();
    this.tether.setDepth(this.ragdoll.y - 1);

    // Register as an interactable object
    this.registerBhavyaInteractable();
  }

  private registerBhavyaInteractable(): void {
    this.scene.interactionSystem.registerInteractable({
      id: this.interactableId,
      x: this.ragdoll.x,
      y: this.ragdoll.y,
      type: 'bhavya',
      sprite: this.ragdoll,
      onInteract: () => this.toggleTether(),
    });
  }

  toggleTether(): void {
    if (this.endingMode) return;

    this.isTethered = !this.isTethered;
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;

    if (this.isTethered) {
      body.setDrag(200, 200); // lighter drag when pulled
      this.scene.audioSystem.playLightClick?.();
      this.scene.dialogueSystem.startDialogue('bhavya_lift');
    } else {
      body.setDrag(800, 800);
      body.setVelocity(0, 0);
      this.scene.audioSystem.playLightClick?.();

      // Check if dropped near a bench to sit him on it
      this.checkBenchSnapping();
    }
  }

  private checkBenchSnapping(): void {
    const benches = this.scene.children.list.filter(
      c => c.active && (c as any).texture?.key === 'bench'
    ) as Phaser.GameObjects.Sprite[];

    for (const bench of benches) {
      const d = dist(this.ragdoll.x, this.ragdoll.y, bench.x, bench.y);
      if (d < 50) {
        // Snap Bhavya onto the bench!
        this.ragdoll.setPosition(bench.x, bench.y - 10);
        this.ragdoll.setRotation(0);
        this.ragdoll.setVelocity(0, 0);
        break;
      }
    }
  }

  public setEndingMode(enabled: boolean): void {
    this.endingMode = enabled;
    if (enabled) {
      this.isTethered = false;
      this.ragdoll.setTexture('ragdoll_standing');
      this.ragdoll.setRotation(0);
      const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
    }
  }

  update(delta: number): void {
    const dt = delta / 1000;
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;

    // Update coordinates for the interactable reference
    const interactable = this.scene.interactionSystem.getInteractable?.(this.interactableId) || 
      this.scene.interactionSystem.getInteractables?.().find(i => i.id === this.interactableId);
    if (interactable) {
      interactable.x = this.ragdoll.x;
      interactable.y = this.ragdoll.y;
    }

    if (this.endingMode) {
      this.tether.clear();
      this.ragdoll.setDepth(this.ragdoll.y);
      return;
    }

    if (this.isTethered) {
      this.updateDragging(dt);
      this.ragdoll.setDepth(this.ragdoll.y + 2);
      this.drawTether();

      // Eyes behavior: open while moving (back turned), closed when standing still
      if (this.scene.playerSystem.isWalking) {
        this.ragdoll.setTexture('ragdoll_open_eyes');
      } else {
        this.ragdoll.setTexture('ragdoll_cross_eyes');
        this.pointTowardInterestingObjects();
      }
    } else {
      this.tether.clear();
      this.ragdoll.setDepth(this.ragdoll.y);
      body.velocity.x *= 0.85;
      body.velocity.y *= 0.85;

      // Spooky standing up behavior when off-screen
      this.checkOffscreenStanding();
    }
  }

  private updateDragging(dt: number): void {
    const hand = this.scene.playerSystem.getHandPosition();
    const dollHand = this.getDollHandPosition();
    const dx = hand.x - dollHand.x;
    const dy = hand.y - dollHand.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;

    if (distance > 2) {
      // Pull velocity
      const pullForce = Math.min(1000, distance * 22);
      body.velocity.x += (dx / distance) * pullForce * dt;
      body.velocity.y += (dy / distance) * pullForce * dt;
    }

    // Limit distance so he doesn't stretch infinitely
    if (distance > 50) {
      const correction = distance - 50;
      this.ragdoll.x += (dx / distance) * correction * 0.9;
      this.ragdoll.y += (dy / distance) * correction * 0.9;
    }

    // Rotate the sprite based on drag tilt
    const speedTilt = Phaser.Math.Clamp(body.velocity.x / 250, -1, 1) * 0.4;
    const pullTilt = Phaser.Math.Clamp((hand.x - this.ragdoll.x) / 100, -1, 1) * 0.2;
    this.ragdoll.setRotation(Phaser.Math.Linear(this.ragdoll.rotation, speedTilt + pullTilt, 0.1));
  }

  private getDollHandPosition(): { x: number; y: number } {
    const side = this.ragdoll.x < this.scene.playerSystem.x ? 1 : -1;
    return {
      x: this.ragdoll.x + side * 16,
      y: this.ragdoll.y - 12,
    };
  }

  private drawTether(): void {
    const hand = this.scene.playerSystem.getHandPosition();
    const dollHand = this.getDollHandPosition();
    this.tether.clear();
    this.tether.lineStyle(2, 0x6a4a2a, 0.65);
    this.tether.lineBetween(hand.x, hand.y, dollHand.x, dollHand.y);
  }

  /** Rotates Bhavya slightly toward interesting objects when standing still */
  private pointTowardInterestingObjects(): void {
    // Find nearest undiscovered memory orb or lantern
    const px = this.ragdoll.x;
    const py = this.ragdoll.y;

    const memories = this.scene.interactionSystem.getInteractables?.() || [];
    let target = null;
    let minDist = 350;

    for (const obj of memories) {
      if (obj.type === 'memory' || (obj.type === 'lantern' && !this.scene.interactionSystem.getLitLanterns().includes(obj.id))) {
        const d = dist(px, py, obj.x, obj.y);
        if (d < minDist) {
          minDist = d;
          target = obj;
        }
      }
    }

    if (target) {
      const angle = Phaser.Math.Angle.Between(px, py, target.x, target.y);
      // Tilt rotation slightly in target direction (limp head turn)
      this.ragdoll.setRotation(Phaser.Math.Linear(this.ragdoll.rotation, angle + Math.PI / 2, 0.08));
    }
  }

  /** Standing up behavior when off-screen, flops back when on-screen */
  private checkOffscreenStanding(): void {
    const cam = this.scene.cameras.main;
    // Check if the camera view bounds contain the ragdoll
    const bounds = cam.worldView;
    const onScreen = bounds.contains(this.ragdoll.x, this.ragdoll.y);

    if (!onScreen && !this.wasOffScreen) {
      // He stands up when you aren't looking!
      this.wasOffScreen = true;
      this.ragdoll.setTexture('ragdoll_standing');
      this.ragdoll.setRotation(0);
    } else if (onScreen && this.wasOffScreen) {
      // Collapse back down instantly when he comes on screen
      this.wasOffScreen = false;
      this.ragdoll.setTexture('ragdoll_cross_eyes');
      // Give a little physical push to simulate collapsing
      this.ragdoll.setRotation(Phaser.Math.Between(-10, 10) / 10);
      const body = this.ragdoll.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(50, 100));

      // Emit dust particles for collapse
      this.scene.effectsManager.createDustCollapse?.(this.ragdoll.x, this.ragdoll.y);
    }
  }

  /** Teleports Bhavya to a bench in the new area if left behind */
  onAreaEntered(areaKey: string): void {
    if (this.isTethered || this.endingMode) return;

    // Find a bench in the new area
    const areaObjects = this.scene.worldBuilder.getAreaConfig(areaKey as any)?.objects || [];
    const benchConfig = areaObjects.find(obj => obj.type === 'bench');

    if (benchConfig) {
      // Teleport him onto the bench (only if the player is far enough)
      const d = dist(this.scene.playerSystem.x, this.scene.playerSystem.y, benchConfig.x, benchConfig.y);
      if (d > 300) {
        this.ragdoll.setPosition(benchConfig.x, benchConfig.y - 10);
        this.ragdoll.setRotation(0);
        this.ragdoll.setVelocity(0, 0);
        this.checkOffscreenStanding(); // Update visual state immediately
      }
    }
  }

  resetToPlayer(x: number, y: number): void {
    this.ragdoll.setPosition(x - 20, y + 20);
    this.ragdoll.setVelocity(0, 0);
    this.ragdoll.setRotation(0);
  }
}
