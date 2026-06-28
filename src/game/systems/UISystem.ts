// ============================================================
// UISystem — Mobile controls, area name display, memory counter
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';

export class UISystem {
  private scene: GameScene;
  private areaNameText: Phaser.GameObjects.Text;
  private memoryCounter: Phaser.GameObjects.Text;
  private _isMobile = false;
  private _interactPressed = false;

  // Virtual joystick
  private joystickBase: Phaser.GameObjects.Sprite | null = null;
  private joystickKnob: Phaser.GameObjects.Sprite | null = null;
  private joystickPointer: Phaser.Input.Pointer | null = null;
  private joystickOrigin = { x: 0, y: 0 };
  private interactButton: Phaser.GameObjects.Sprite | null = null;
  private interactLabel: Phaser.GameObjects.Text | null = null;

  constructor(scene: GameScene) {
    this.scene = scene;

    // Detect mobile
    this._isMobile = !scene.sys.game.device.os.desktop;

    // Area name display
    this.areaNameText = scene.add.text(scene.cameras.main.width / 2, 50, '', {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '28px',
      fontStyle: 'italic',
      color: '#f0e8d8',
      align: 'center',
    });
    this.areaNameText.setOrigin(0.5, 0.5);
    this.areaNameText.setScrollFactor(0);
    this.areaNameText.setDepth(100001);
    this.areaNameText.setAlpha(0);

    // Memory counter
    this.memoryCounter = scene.add.text(scene.cameras.main.width - 20, 20, '', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '16px',
      color: '#f2a0b5',
      align: 'right',
    });
    this.memoryCounter.setOrigin(1, 0);
    this.memoryCounter.setScrollFactor(0);
    this.memoryCounter.setDepth(100001);
    this.memoryCounter.setAlpha(0.7);

    // Mobile controls
    if (this._isMobile) {
      this.createMobileControls();
    }
  }

  private createMobileControls(): void {
    const cam = this.scene.cameras.main;

    // Joystick
    this.joystickBase = this.scene.add.sprite(100, cam.height - 100, 'ui_joystick_base');
    this.joystickBase.setScrollFactor(0);
    this.joystickBase.setDepth(100002);
    this.joystickBase.setAlpha(0.5);

    this.joystickKnob = this.scene.add.sprite(100, cam.height - 100, 'ui_joystick_knob');
    this.joystickKnob.setScrollFactor(0);
    this.joystickKnob.setDepth(100003);
    this.joystickKnob.setAlpha(0.7);

    // Interact button
    this.interactButton = this.scene.add.sprite(cam.width - 80, cam.height - 100, 'ui_button_interact');
    this.interactButton.setScrollFactor(0);
    this.interactButton.setDepth(100002);
    this.interactButton.setAlpha(0.6);
    this.interactButton.setInteractive();

    this.interactLabel = this.scene.add.text(cam.width - 80, cam.height - 100, 'E', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.interactLabel.setOrigin(0.5, 0.5);
    this.interactLabel.setScrollFactor(0);
    this.interactLabel.setDepth(100003);

    this.interactButton.on('pointerdown', () => {
      this._interactPressed = true;
    });

    // Joystick touch handling
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x < cam.width / 2 && !this.joystickPointer) {
        this.joystickPointer = pointer;
        this.joystickOrigin.x = pointer.x;
        this.joystickOrigin.y = pointer.y;
        if (this.joystickBase) {
          this.joystickBase.setPosition(pointer.x, pointer.y);
          this.joystickBase.setAlpha(0.7);
        }
        if (this.joystickKnob) {
          this.joystickKnob.setPosition(pointer.x, pointer.y);
        }
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.joystickPointer && this.joystickKnob) {
        const dx = pointer.x - this.joystickOrigin.x;
        const dy = pointer.y - this.joystickOrigin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 40;
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);

        this.joystickKnob.setPosition(
          this.joystickOrigin.x + Math.cos(angle) * clampedDist,
          this.joystickOrigin.y + Math.sin(angle) * clampedDist
        );

        // Update player joystick vector
        if (dist > 5) {
          this.scene.playerSystem.joystickVector.x = Math.cos(angle) * Math.min(dist / maxDist, 1);
          this.scene.playerSystem.joystickVector.y = Math.sin(angle) * Math.min(dist / maxDist, 1);
        } else {
          this.scene.playerSystem.joystickVector.x = 0;
          this.scene.playerSystem.joystickVector.y = 0;
        }
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer === this.joystickPointer) {
        this.joystickPointer = null;
        this.scene.playerSystem.joystickVector.x = 0;
        this.scene.playerSystem.joystickVector.y = 0;
        if (this.joystickKnob && this.joystickBase) {
          this.joystickKnob.setPosition(this.joystickBase.x, this.joystickBase.y);
        }
        if (this.joystickBase) this.joystickBase.setAlpha(0.5);
      }
    });
  }

  showAreaName(name: string): void {
    this.areaNameText.setText(name);
    this.scene.tweens.add({
      targets: this.areaNameText,
      alpha: { from: 0, to: 1 },
      duration: 800,
      hold: 2000,
      yoyo: true,
      ease: 'Cubic.easeOut',
    });
  }

  update(): void {
    // Update memory counter
    const discovered = this.scene.interactionSystem.getDiscoveredMemories().length;
    const total = 8; // total memories
    if (discovered > 0) {
      this.memoryCounter.setText(`✿ ${discovered}/${total}`);
      this.memoryCounter.setAlpha(0.7);
    }
  }

  isMobileDevice(): boolean {
    return this._isMobile;
  }

  consumeInteractPress(): boolean {
    if (this._interactPressed) {
      this._interactPressed = false;
      return true;
    }
    return false;
  }
}
