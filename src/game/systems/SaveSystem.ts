// ============================================================
// SaveSystem — LocalStorage persistence
// ============================================================

import { GameScene } from '../scenes/GameScene';

export interface SaveData {
  playerX: number;
  playerY: number;
  timeProgress: number;
  discoveredMemories: string[];
  litLanterns: string[];
  bloomedCells: string[];
}

const SAVE_KEY = 'nyni_bday_garden_save';

export class SaveSystem {
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  save(data: SaveData): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_e) {
      // localStorage might be unavailable
    }
  }

  load(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        return JSON.parse(raw) as SaveData;
      }
    } catch (_e) {
      // Corrupted or unavailable
    }
    return null;
  }

  clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (_e) {
      // Ignore
    }
  }
}
