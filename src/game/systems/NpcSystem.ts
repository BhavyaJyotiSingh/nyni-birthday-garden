// ============================================================
// NpcSystem — Manages Eli, Siya, Nikhil, and Krish
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

interface KrishSpawnConfig {
  area: string;
  x: number;
  y: number;
  spawned: boolean;
  talked: boolean;
}

export class NpcSystem {
  private scene: GameScene;
  private siya: Phaser.GameObjects.Sprite | null = null;
  private eli: Phaser.GameObjects.Sprite | null = null;
  private nikhil: Phaser.GameObjects.Sprite | null = null;
  private krish: Phaser.GameObjects.Sprite | null = null;

  // Interaction counters to shift dialogues
  private siyaTalkCount = 0;
  private eliTalkCount = 0;

  // Krish spawn positions (always ahead of player)
  private krishSpawns: KrishSpawnConfig[] = [
    { area: 'roseGarden', x: 2000, y: 1420, spawned: false, talked: false },
    { area: 'greenhouse', x: 700, y: 1420, spawned: false, talked: false },
    { area: 'maze', x: 400, y: 2260, spawned: false, talked: false },
    { area: 'forgottenChurch', x: 1400, y: 660, spawned: false, talked: false },
    { area: 'observatory', x: 1400, y: 480, spawned: false, talked: false },
  ];

  constructor(scene: GameScene) {
    this.scene = scene;
    this.spawnPermanentNpcs();

    // Listen to dialogue complete events
    this.scene.events.on('dialogue-complete', (dialogueId: string) => {
      if (dialogueId.startsWith('talk_krish')) {
        this.vanishKrish();
      }
    });
  }

  private spawnPermanentNpcs(): void {
    // Siya — Secret Garden
    this.siya = this.scene.add.sprite(560, 640, 'npc_idle');
    this.siya.setScale(2.0);
    this.siya.setDepth(640);
    this.siya.setOrigin(0.5, 0.8);
    this.siya.setTint(0xa8e090); // Gentle green tint
    this.scene.physics.add.existing(this.siya, true);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, this.siya);
    this.scene.interactionSystem.registerInteractable({
      id: 'siya_npc',
      x: 560,
      y: 640,
      type: 'npc',
      sprite: this.siya,
      onInteract: () => this.talkToSiya(),
    });
 
    // Eli — Rose Garden
    this.eli = this.scene.add.sprite(2240, 1340, 'npc_idle');
    this.eli.setScale(2.0);
    this.eli.setDepth(1340);
    this.eli.setOrigin(0.5, 0.8);
    this.eli.setTint(0xffc070); // Cheerful orange/peach tint
    this.scene.physics.add.existing(this.eli, true);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, this.eli);
    this.scene.interactionSystem.registerInteractable({
      id: 'eli_npc',
      x: 2240,
      y: 1340,
      type: 'npc',
      sprite: this.eli,
      onInteract: () => this.talkToEli(),
    });
 
    // Nikhil — Forgotten Church
    this.nikhil = this.scene.add.sprite(1320, 760, 'npc_idle');
    this.nikhil.setScale(2.0);
    this.nikhil.setDepth(760);
    this.nikhil.setOrigin(0.5, 0.8);
    this.nikhil.setTint(0xc0c0ff); // Analytical blue-grey tint
    this.scene.physics.add.existing(this.nikhil, true);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, this.nikhil);
    this.scene.interactionSystem.registerInteractable({
      id: 'nikhil_npc',
      x: 1320,
      y: 760,
      type: 'npc',
      sprite: this.nikhil,
      dialogueId: 'talk_nikhil',
    });
  }

  onAreaEntered(area: string): void {
    // Check if we should spawn Krish ahead in this area
    const spawnConfig = this.krishSpawns.find(s => s.area === area);
    if (spawnConfig && !spawnConfig.spawned && !spawnConfig.talked) {
      this.spawnKrish(spawnConfig);
    }
  }

  private spawnKrish(config: KrishSpawnConfig): void {
    if (this.krish) {
      this.krish.destroy();
      this.krish = null;
    }

    config.spawned = true;
    this.krish = this.scene.add.sprite(config.x, config.y, 'npc_idle');
    this.krish.setScale(2.0);
    this.krish.setDepth(config.y);
    this.krish.setOrigin(0.5, 0.8);
    this.krish.setTint(0xff5555); // Crimson warning tint
    this.krish.setAlpha(0.95);

    // Subtle floating / shifting effect to show he is a mystery
    this.scene.tweens.add({
      targets: this.krish,
      y: config.y - 6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.scene.physics.add.existing(this.krish, true);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, this.krish);

    this.scene.interactionSystem.registerInteractable({
      id: `krish_npc_${config.area}`,
      x: config.x,
      y: config.y,
      type: 'npc',
      sprite: this.krish,
      dialogueId: `talk_krish_${config.area}`,
    });
  }

  private talkToSiya(): void {
    this.siyaTalkCount++;
    const dialogueId = `siya_talk_${Math.min(this.siyaTalkCount, 4)}`;
    this.scene.dialogueSystem.startDialogue(dialogueId);
  }

  private talkToEli(): void {
    this.eliTalkCount++;
    const dialogueId = `eli_talk_${Math.min(this.eliTalkCount, 4)}`;
    this.scene.dialogueSystem.startDialogue(dialogueId);
  }

  private vanishKrish(): void {
    if (!this.krish) return;

    // Set the talk state to true so he doesn't spawn again
    const activeSpawn = this.krishSpawns.find(s => s.spawned && !s.talked);
    if (activeSpawn) {
      activeSpawn.talked = true;
    }

    // Spooky fade out tween
    this.scene.tweens.add({
      targets: this.krish,
      alpha: 0,
      scaleX: 3.0,
      scaleY: 0,
      duration: 1000,
      ease: 'Quad.easeIn',
      onComplete: () => {
        if (this.krish) {
          this.krish.destroy();
          this.krish = null;
        }
      },
    });

    // Spawn a spark of fireflies where he vanished
    this.scene.effectsManager.createFireflyBurst(this.krish.x, this.krish.y);
  }

  update(_delta: number): void {
    // Subtle idle swaying for NPCs
    const time = this.scene.time.now;
    if (this.siya) {
      this.siya.setScale(2.0, 2.0 + Math.sin(time * 0.003) * 0.05);
    }
    if (this.eli) {
      this.eli.setScale(2.0, 2.0 + Math.cos(time * 0.003) * 0.05);
    }
    if (this.nikhil) {
      this.nikhil.setScale(2.0, 2.0 + Math.sin(time * 0.002) * 0.04);
    }
  }
}
