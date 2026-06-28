// ============================================================
// GameScene — Main gameplay scene orchestrator
// ============================================================

import Phaser from 'phaser';
import { WORLD_WIDTH, WORLD_HEIGHT, AREAS } from '../constants';
import type { AreaKey } from '../constants';
import { PlayerSystem } from '../systems/PlayerSystem';
import { FlowerSystem } from '../systems/FlowerSystem';
import { ButterflySystem } from '../systems/ButterflySystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { DialogueSystem } from '../systems/DialogueSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { EnvironmentManager } from '../systems/EnvironmentManager';
import { EffectsManager } from '../systems/EffectsManager';
import { UISystem } from '../systems/UISystem';
import { SaveSystem } from '../systems/SaveSystem';
import { CutsceneManager } from '../systems/CutsceneManager';
import { AudioSystem } from '../systems/AudioSystem';
import { CompanionSystem } from '../systems/CompanionSystem';
import { WorldBuilder } from '../world/WorldBuilder';
import { DIALOGUES } from '../data/dialogues';
import { eventBus } from '../EventBus';

export class GameScene extends Phaser.Scene {
  // Systems
  public playerSystem!: PlayerSystem;
  public flowerSystem!: FlowerSystem;
  public butterflySystem!: ButterflySystem;
  public interactionSystem!: InteractionSystem;
  public dialogueSystem!: DialogueSystem;
  public cameraSystem!: CameraSystem;
  public environmentManager!: EnvironmentManager;
  public effectsManager!: EffectsManager;
  public uiSystem!: UISystem;
  public saveSystem!: SaveSystem;
  public cutsceneManager!: CutsceneManager;
  public audioSystem!: AudioSystem;
  public companionSystem!: CompanionSystem;
  public worldBuilder!: WorldBuilder;

  // State
  public currentArea: AreaKey = 'entranceGarden';
  private visitedAreas: Set<string> = new Set();
  private gameStarted = false;
  public endingTriggered = false;
  public playerControlEnabled = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    console.log('GameScene: create started');
    // Set world bounds
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Initialize systems (order matters)
    this.saveSystem = new SaveSystem(this);
    this.effectsManager = new EffectsManager(this);
    this.flowerSystem = new FlowerSystem(this);
    this.playerSystem = new PlayerSystem(this);
    this.butterflySystem = new ButterflySystem(this);
    this.interactionSystem = new InteractionSystem(this);
    this.dialogueSystem = new DialogueSystem(this);
    this.cameraSystem = new CameraSystem(this);
    this.environmentManager = new EnvironmentManager(this);
    this.uiSystem = new UISystem(this);
    this.cutsceneManager = new CutsceneManager(this);
    this.audioSystem = new AudioSystem(this);
    this.companionSystem = new CompanionSystem(this);

    // Build the world (needs playerSystem and interactionSystem initialized)
    this.worldBuilder = new WorldBuilder(this);
    this.worldBuilder.build();

    // Set up event listeners
    this.setupEvents();

    // Load save or start fresh
    const saveData = this.saveSystem.load();
    if (saveData) {
      this.playerSystem.setPosition(saveData.playerX, saveData.playerY);
      this.environmentManager.setTime(saveData.timeProgress);
      saveData.discoveredMemories.forEach((id: string) => {
        this.interactionSystem.markMemoryDiscovered(id);
      });
      saveData.litLanterns.forEach((id: string) => {
        this.interactionSystem.markLanternLit(id);
      });
      this.playerControlEnabled = true;
      this.gameStarted = true;
    } else {
      // Start opening cutscene
      this.time.delayedCall(500, () => {
        this.cutsceneManager.playOpening();
      });
    }

    // Auto-save timer
    this.time.addEvent({
      delay: 30000,
      callback: () => this.saveGame(),
      loop: true,
    });

    console.log('GameScene: create complete, emitting game-ready');
    eventBus.emit('game-ready');
  }

  private setupEvents(): void {
    // Dialogue completion events
    this.events.on('dialogue-complete', (dialogueId: string) => {
      const dialogue = DIALOGUES[dialogueId];
      if (dialogue?.onComplete) {
        this.events.emit(dialogue.onComplete);
      }
    });

    // Opening complete — give player control
    this.events.on('opening_complete', () => {
      this.playerControlEnabled = true;
      this.gameStarted = true;
    });

    // Ending events
    this.events.on('ending_walk', () => {
      this.cutsceneManager.playEndingWalk();
    });

    this.events.on('ending_complete', () => {
      this.cutsceneManager.playEndingFinale();
    });

    this.events.on('goto_credits', () => {
      this.saveSystem.clearSave();
      this.scene.start('CreditsScene');
    });
  }

  update(_time: number, delta: number): void {
    if (!this.gameStarted && !this.cutsceneManager.isPlaying) return;

    // Update all systems
    this.playerSystem.update(delta);
    this.flowerSystem.update(delta);
    this.butterflySystem.update(delta);
    this.interactionSystem.update();
    this.cameraSystem.update(delta);
    this.environmentManager.update(delta);
    this.effectsManager.update(delta);
    this.uiSystem.update();
    this.cutsceneManager.update(delta);
    this.companionSystem.update(delta);

    // Check area transitions
    this.checkAreaTransition();
  }

  private checkAreaTransition(): void {
    const px = this.playerSystem.x;
    const py = this.playerSystem.y;

    for (const [key, area] of Object.entries(AREAS)) {
      if (
        px >= area.x &&
        px <= area.x + area.width &&
        py >= area.y &&
        py <= area.y + area.height
      ) {
        if (this.currentArea !== key) {
          this.currentArea = key as AreaKey;
          this.onAreaChanged(key as AreaKey);
        }
        break;
      }
    }
  }

  private onAreaChanged(area: AreaKey): void {
    // Show area name
    this.uiSystem.showAreaName(AREAS[area].name);

    // Play area intro dialogue (only first visit)
    if (!this.visitedAreas.has(area)) {
      this.visitedAreas.add(area);
      const areaConfig = this.worldBuilder.getAreaConfig(area);
      if (areaConfig?.dialogueOnEnter) {
        this.time.delayedCall(800, () => {
          this.dialogueSystem.startDialogue(areaConfig.dialogueOnEnter!);
        });
      }
    }

    // Check for ending trigger
    if (area === 'birthdayGarden' && !this.endingTriggered) {
      this.endingTriggered = true;
      this.time.delayedCall(2000, () => {
        this.cutsceneManager.playEndingMeet();
      });
    }
  }

  public saveGame(): void {
    this.saveSystem.save({
      playerX: this.playerSystem.x,
      playerY: this.playerSystem.y,
      timeProgress: this.environmentManager.getTimeProgress(),
      discoveredMemories: this.interactionSystem.getDiscoveredMemories(),
      litLanterns: this.interactionSystem.getLitLanterns(),
      bloomedCells: this.flowerSystem.getBloomedCellKeys(),
    });
  }
}
