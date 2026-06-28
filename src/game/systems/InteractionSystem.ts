// ============================================================
// InteractionSystem — E-key interactions with world objects
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { INTERACT_RANGE } from '../constants';
import { dist } from '../utils/math';
import { MEMORIES } from '../data/memories';
import type { MemoryData } from '../data/memories';

export interface InteractableObject {
  id: string;
  x: number;
  y: number;
  type: string;
  dialogueId?: string;
  sprite?: Phaser.GameObjects.Sprite;
  onInteract?: () => void;
}

export class InteractionSystem {
  private scene: GameScene;
  private interactables: InteractableObject[] = [];
  private memoryOrbs: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private discoveredMemories: Set<string> = new Set();
  private litLanterns: Set<string> = new Set();
  private interactKey!: Phaser.Input.Keyboard.Key;
  private promptSprite: Phaser.GameObjects.Text | null = null;
  private cooldown = 0;

  // Psychological event flags
  private letterRead = false;
  private letterVanished = false;
  private bridgeDisappeared = false;
  private mirrorReflection: Phaser.GameObjects.Sprite | null = null;

  constructor(scene: GameScene) {
    this.scene = scene;

    // Listen to letter read completion
    scene.events.on('dialogue-complete', (dialogueId: string) => {
      if (dialogueId === 'read_letter') {
        this.letterRead = true;
      }
    });

    if (scene.input.keyboard) {
      this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    // Register memory orbs
    this.registerMemories();

    // Create interaction prompt text
    this.promptSprite = scene.add.text(0, 0, '[E]', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000099',
      padding: { x: 8, y: 4 },
      align: 'center',
    });
    this.promptSprite.setOrigin(0.5, 1);
    this.promptSprite.setDepth(10000);
    this.promptSprite.setVisible(false);
    this.promptSprite.setScrollFactor(0); // Will be repositioned manually
  }

  registerInteractable(obj: InteractableObject): void {
    this.interactables.push(obj);
  }

  private registerMemories(): void {
    for (const memory of MEMORIES) {
      // Create orb sprite
      const orb = this.scene.add.sprite(memory.x, memory.y, 'ui_memory_orb');
      orb.setScale(1.5);
      orb.setDepth(memory.y + 5);
      orb.setAlpha(0.8);

      // Pulsing animation
      this.scene.tweens.add({
        targets: orb,
        scaleX: 1.8,
        scaleY: 1.8,
        alpha: 0.5,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Floating animation
      this.scene.tweens.add({
        targets: orb,
        y: memory.y - 6,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.memoryOrbs.set(memory.id, orb);

      this.interactables.push({
        id: memory.id,
        x: memory.x,
        y: memory.y,
        type: 'memory',
        sprite: orb,
        onInteract: () => this.discoverMemory(memory),
      });
    }
  }

  update(): void {
    if (!this.scene.playerControlEnabled) return;
    if (this.scene.dialogueSystem.isActive) {
      this.promptSprite?.setVisible(false);
      return;
    }

    this.cooldown = Math.max(0, this.cooldown - 1);
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    // ── Psychological Event: Vanishing Letter
    if (this.letterRead && !this.letterVanished) {
      const letterTableObj = this.interactables.find(i => i.id === 'cottage_letter_table');
      if (letterTableObj) {
        if (dist(px, py, letterTableObj.x, letterTableObj.y) > 150) {
          this.letterVanished = true;
          if (letterTableObj.sprite) {
            letterTableObj.sprite.setTexture('table_empty');
            this.scene.effectsManager.createFireflyBurst(letterTableObj.x, letterTableObj.y);
            this.scene.audioSystem.playRustle();
          }
          this.interactables = this.interactables.filter(i => i.id !== 'cottage_letter_table');
        }
      }
    }

    // ── Psychological Event: Disappearing Bridge
    if (!this.bridgeDisappeared) {
      const bridgeObj = this.scene.children.list.find(
        c => c.active && (c as any).id === 'crystal_lake_bridge'
      ) as Phaser.GameObjects.Sprite | undefined;

      if (bridgeObj) {
        if (py > 5050 && dist(px, py, bridgeObj.x, bridgeObj.y) > 180) {
          this.bridgeDisappeared = true;
          this.scene.tweens.add({
            targets: bridgeObj,
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeIn',
            onComplete: () => {
              if (bridgeObj.body) {
                (bridgeObj.body as Phaser.Physics.Arcade.StaticBody).destroy();
              }
              bridgeObj.destroy();
            }
          });
          this.scene.effectsManager.createWaterSplash(bridgeObj.x, bridgeObj.y);
          this.scene.audioSystem.playSplash();
        }
      }
    }

    // ── Psychological Event: Mirror Reflection
    const activeMirror = this.interactables.find(i => i.type === 'mirror');
    if (activeMirror) {
      const d = dist(px, py, activeMirror.x, activeMirror.y);
      if (d < 120) {
        if (!this.mirrorReflection) {
          this.mirrorReflection = this.scene.add.sprite(activeMirror.x, activeMirror.y - 12, 'ragdoll_cross_eyes');
          this.mirrorReflection.setScale(1.6);
          this.mirrorReflection.setDepth(activeMirror.y - 1);
          this.mirrorReflection.setAlpha(0);
        }
        const reflectX = activeMirror.x - (px - activeMirror.x) * 0.8;
        this.mirrorReflection.setX(reflectX);
        this.mirrorReflection.setAlpha(Phaser.Math.Clamp((120 - d) / 80, 0, 0.7));
        this.mirrorReflection.setFlipX(this.scene.playerSystem.direction === 'left');
      } else if (this.mirrorReflection) {
        this.mirrorReflection.destroy();
        this.mirrorReflection = null;
      }
    }

    // ── Psychological Event: Self-Lighting Lanterns
    if (this.scene.playerSystem.isWalking) {
      const dir = this.scene.playerSystem.direction;
      for (const obj of this.interactables) {
        if (obj.type === 'lantern' && !this.litLanterns.has(obj.id)) {
          const d = dist(px, py, obj.x, obj.y);
          let isBehind = false;
          if (dir === 'up' && obj.y > py) isBehind = true;
          else if (dir === 'down' && obj.y < py) isBehind = true;
          else if (dir === 'left' && obj.x > px) isBehind = true;
          else if (dir === 'right' && obj.x < px) isBehind = true;

          if (d < 150 && isBehind) {
            this.lightLantern(obj);
            this.scene.audioSystem.playLightClick();
          }
        }
      }
    }

    // Find nearest interactable
    let nearest: InteractableObject | null = null;
    let nearestDist = INTERACT_RANGE;

    for (const obj of this.interactables) {
      const d = dist(px, py, obj.x, obj.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = obj;
      }
    }

    // Show/hide prompt
    if (nearest && this.promptSprite) {
      // Convert world position to screen position
      const cam = this.scene.cameras.main;
      const screenX = nearest.x - cam.scrollX;
      const screenY = nearest.y - cam.scrollY - 40;
      this.promptSprite.setPosition(screenX, screenY);
      this.promptSprite.setVisible(true);

      // Check for mobile tap interaction
      const isMobile = this.scene.uiSystem?.isMobileDevice();
      this.promptSprite.setText(isMobile ? '[ TAP ]' : '[ E ]');
    } else {
      this.promptSprite?.setVisible(false);
    }

    // Check for interaction input
    if (nearest && this.cooldown <= 0) {
      const keyPressed = this.interactKey?.isDown;
      const mobilePressed = this.scene.uiSystem?.consumeInteractPress();

      if (keyPressed || mobilePressed) {
        this.cooldown = 30;
        this.triggerInteraction(nearest);
      }
    }
  }

  private triggerInteraction(obj: InteractableObject): void {
    if (obj.onInteract) {
      obj.onInteract();
      return;
    }

    switch (obj.type) {
      case 'lantern':
        this.lightLantern(obj);
        break;
      case 'bench':
      case 'gazebo':
      case 'fountain':
      case 'dock':
      case 'sign':
      case 'skip_stone':
        if (obj.dialogueId) {
          this.scene.dialogueSystem.startDialogue(obj.dialogueId);
        }
        break;
      default:
        if (obj.dialogueId) {
          this.scene.dialogueSystem.startDialogue(obj.dialogueId);
        }
    }
  }

  private lightLantern(obj: InteractableObject): void {
    if (this.litLanterns.has(obj.id)) return;
    this.litLanterns.add(obj.id);

    // Change sprite to lit version
    if (obj.sprite) {
      obj.sprite.setTexture('lantern_lit');

      // Warm glow effect
      const glow = this.scene.add.sprite(obj.x, obj.y - 8, 'particle_firefly');
      glow.setScale(6);
      glow.setAlpha(0);
      glow.setTint(0xffcc44);
      glow.setBlendMode(Phaser.BlendModes.ADD);
      glow.setDepth(obj.y - 2);

      this.scene.tweens.add({
        targets: glow,
        alpha: 0.3,
        duration: 800,
        ease: 'Sine.easeOut',
      });

      // Pulsing glow
      this.scene.tweens.add({
        targets: glow,
        alpha: 0.15,
        scaleX: 5,
        scaleY: 5,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 800,
      });
    }

    if (obj.dialogueId) {
      this.scene.dialogueSystem.startDialogue(obj.dialogueId);
    }
  }

  private discoverMemory(memory: MemoryData): void {
    if (this.discoveredMemories.has(memory.id)) return;
    this.discoveredMemories.add(memory.id);

    // Hide the orb
    const orb = this.memoryOrbs.get(memory.id);
    if (orb) {
      this.scene.tweens.add({
        targets: orb,
        alpha: 0,
        scale: 3,
        duration: 600,
        ease: 'Cubic.easeOut',
        onComplete: () => orb.setVisible(false),
      });
    }

    // Show memory as dialogue
    this.scene.dialogueSystem.showMemory(memory);
  }

  markMemoryDiscovered(id: string): void {
    this.discoveredMemories.add(id);
    const orb = this.memoryOrbs.get(id);
    if (orb) orb.setVisible(false);
  }

  markLanternLit(id: string): void {
    this.litLanterns.add(id);
  }

  getDiscoveredMemories(): string[] {
    return Array.from(this.discoveredMemories);
  }

  getActiveMemoryOrbs(): MemoryData[] {
    return MEMORIES.filter(m => !this.discoveredMemories.has(m.id));
  }

  getLitLanterns(): string[] {
    return Array.from(this.litLanterns);
  }

  /** Light all lanterns (for ending) */
  lightAllLanterns(): void {
    for (const obj of this.interactables) {
      if (obj.type === 'lantern' && !this.litLanterns.has(obj.id)) {
        this.lightLantern(obj);
      }
    }
  }

  getInteractables(): InteractableObject[] {
    return this.interactables;
  }

  getInteractable(id: string): InteractableObject | undefined {
    return this.interactables.find(i => i.id === id);
  }
}
