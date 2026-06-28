// ============================================================
// DialogueSystem — Elegant typewriter dialogue boxes
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { DIALOGUES, DialogueLine } from '../data/dialogues';
import { MemoryData } from '../data/memories';
import { DIALOGUE_CHARS_PER_SEC } from '../constants';

export class DialogueSystem {
  private scene: GameScene;
  private container!: Phaser.GameObjects.Container;
  private bgGraphics!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private continueText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;

  private queue: DialogueLine[] = [];
  private currentLine = '';
  private displayedChars = 0;
  private charTimer = 0;
  private currentDialogueId = '';
  private _isActive = false;
  private isTyping = false;
  private advanceKey!: Phaser.Input.Keyboard.Key;
  private isMemory = false;

  get isActive(): boolean { return this._isActive; }

  constructor(scene: GameScene) {
    this.scene = scene;
    this.createUI();

    if (scene.input.keyboard) {
      this.advanceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.advance());
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => this.advance());
    }

    scene.input.on('pointerdown', () => {
      if (this._isActive) this.advance();
    });
  }

  private createUI(): void {
    const w = 560;
    const h = 160;
    const cam = this.scene.cameras.main;
    const x = cam.width / 2;
    const y = cam.height - 20;

    this.container = this.scene.add.container(x, y);
    this.container.setScrollFactor(0);
    this.container.setDepth(100000);
    this.container.setAlpha(0);
    this.container.setVisible(false);

    // Background
    this.bgGraphics = this.scene.add.graphics();
    this.bgGraphics.fillStyle(0x0e0620, 0.92);
    this.bgGraphics.fillRoundedRect(-w / 2, -h, w, h, 16);
    this.bgGraphics.lineStyle(1.5, 0x6a4a8a, 0.6);
    this.bgGraphics.strokeRoundedRect(-w / 2, -h, w, h, 16);

    // Decorative line under title
    this.bgGraphics.lineStyle(1, 0xf2a0b5, 0.4);
    this.bgGraphics.lineBetween(-w / 2 + 20, -h + 36, w / 2 - 20, -h + 36);

    this.container.add(this.bgGraphics);

    // Title text (for memories)
    this.titleText = this.scene.add.text(0, -h + 12, '', {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#f2a0b5',
      align: 'center',
    });
    this.titleText.setOrigin(0.5, 0);
    this.container.add(this.titleText);

    // Name text
    this.nameText = this.scene.add.text(-w / 2 + 20, -h + 12, '', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '14px',
      color: '#f2a0b5',
      fontStyle: 'bold',
    });
    this.container.add(this.nameText);

    // Body text
    this.bodyText = this.scene.add.text(-w / 2 + 24, -h + 46, '', {
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '16px',
      color: '#e8e0d0',
      wordWrap: { width: w - 48 },
      lineSpacing: 6,
    });
    this.container.add(this.bodyText);

    // Continue indicator
    this.continueText = this.scene.add.text(w / 2 - 30, -16, '▼', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#f2a0b5',
    });
    this.continueText.setOrigin(0.5, 0.5);
    this.container.add(this.continueText);

    // Bounce animation for continue indicator
    this.scene.tweens.add({
      targets: this.continueText,
      y: this.continueText.y - 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  startDialogue(dialogueId: string): void {
    const dialogue = DIALOGUES[dialogueId];
    if (!dialogue) return;

    this.currentDialogueId = dialogueId;
    this.isMemory = false;
    this.queue = [...dialogue.lines];
    this.titleText.setText('');
    this.show();
    this.nextLine();
  }

  showMemory(memory: MemoryData): void {
    this.currentDialogueId = memory.id;
    this.isMemory = true;
    this.queue = memory.lines.map(text => ({ text }));
    this.titleText.setText(`✿ ${memory.title} ✿`);
    this.show();
    this.nextLine();
  }

  private show(): void {
    this._isActive = true;
    this.container.setVisible(true);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.scene.cameras.main.height - 20,
      duration: 300,
      ease: 'Back.easeOut',
    });
  }

  private hide(): void {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.scene.cameras.main.height,
      duration: 250,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this._isActive = false;
        this.container.setVisible(false);

        // Emit completion event
        this.scene.events.emit('dialogue-complete', this.currentDialogueId);
      },
    });
  }

  private nextLine(): void {
    if (this.queue.length === 0) {
      this.hide();
      return;
    }

    const line = this.queue.shift()!;
    this.currentLine = line.text;
    this.displayedChars = 0;
    this.charTimer = 0;
    this.isTyping = true;
    this.continueText.setAlpha(0);

    if (line.speaker) {
      this.nameText.setText(line.speaker);
    } else if (!this.isMemory) {
      this.nameText.setText('');
    } else {
      this.nameText.setText('');
    }

    this.bodyText.setText('');
  }

  advance(): void {
    if (!this._isActive) return;

    if (this.isTyping) {
      // Skip typing — show full text
      this.displayedChars = this.currentLine.length;
      this.bodyText.setText(this.currentLine);
      this.isTyping = false;
      this.continueText.setAlpha(1);
    } else {
      // Go to next line
      this.nextLine();
    }
  }

  updateTyping(delta: number): void {
    if (!this.isTyping || !this._isActive) return;

    this.charTimer += delta / 1000;
    const charsToShow = Math.floor(this.charTimer * DIALOGUE_CHARS_PER_SEC);

    if (charsToShow > this.displayedChars) {
      this.displayedChars = Math.min(charsToShow, this.currentLine.length);
      this.bodyText.setText(this.currentLine.substring(0, this.displayedChars));

      if (this.displayedChars >= this.currentLine.length) {
        this.isTyping = false;
        this.continueText.setAlpha(1);
      }
    }
  }
}
