// ============================================================
// MinimapSystem — Circular minimap with Fog of War & indicators
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { WORLD_WIDTH, WORLD_HEIGHT, AREAS } from '../constants';

export class MinimapSystem {
  private scene: GameScene;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private border!: Phaser.GameObjects.Graphics;
  private fogGfx!: Phaser.GameObjects.Graphics;
  private playerMarker!: Phaser.GameObjects.Sprite;
  private npcMarkers: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private memoryMarkers: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private landmarkLabels: Phaser.GameObjects.Text[] = [];

  private isVisible = true;
  private visitedZones: Set<string> = new Set();

  constructor(scene: GameScene) {
    this.scene = scene;

    const width = scene.cameras.main.width;
    const size = 130;
    const mx = width - size - 25;
    const my = 90;

    // 1. Create the Minimap Camera
    this.camera = scene.cameras.add(mx, my, size, size);
    this.camera.setName('minimap');
    this.camera.setZoom(0.09); // covers about 1400px diameter around player
    this.camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.camera.startFollow(scene.playerSystem.gameObject, true, 0.2, 0.2);

    // 2. Set up circular geometry mask
    const maskShape = scene.make.graphics({ x: 0, y: 0 });
    maskShape.fillStyle(0xffffff, 1);
    maskShape.fillCircle(mx + size / 2, my + size / 2, size / 2 - 2);
    const mask = maskShape.createGeometryMask();
    this.camera.setMask(mask);

    // 3. Draw decorative fantasy border (scrollFactor 0, stays in HUD)
    this.border = scene.add.graphics().setDepth(100020).setScrollFactor(0);
    this.drawFantasyBorder(mx, my, size);

    // 4. Create Fog of War graphics (placed in world space, ignored by main camera)
    this.fogGfx = scene.add.graphics().setDepth(50000);
    scene.cameras.main.ignore(this.fogGfx);

    // 5. Create markers
    this.createMarkers();

    // 6. Set initial visited zones
    this.updateFogOfWar();
  }

  private drawFantasyBorder(x: number, y: number, size: number): void {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size / 2;

    // Dark background shadow for minimap area
    this.border.fillStyle(0x0a1118, 0.7);
    this.border.fillCircle(cx, cy, r);

    // Gold outer frame
    this.border.lineStyle(3, 0xd4af37, 1); // gold
    this.border.strokeCircle(cx, cy, r);

    // Inner rim
    this.border.lineStyle(1.5, 0x8a6d20, 0.85); // bronze
    this.border.strokeCircle(cx, cy, r - 3);

    // Fantasy cardinal notches
    const notches = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    this.border.fillStyle(0xd4af37, 1);
    for (const angle of notches) {
      const nx = cx + Math.cos(angle) * r;
      const ny = cy + Math.sin(angle) * r;
      this.border.fillCircle(nx, ny, 4);
    }
  }

  private createMarkers(): void {
    // A. Player Direction Marker
    this.playerMarker = this.scene.add.sprite(0, 0, 'ui_minimap_player');
    this.playerMarker.setDepth(100000).setScale(1.8);
    this.scene.cameras.main.ignore(this.playerMarker);

    // B. Landmark labels (only shown on minimap)
    const landmarks = [
      { name: 'Cottage', x: 1400, y: 2100 },
      { name: 'Plaza', x: 1400, y: 1400 },
      { name: 'Observatory', x: 1400, y: 350 },
      { name: 'Greenhouse', x: 500, y: 1400 },
      { name: 'Shrine', x: 1400, y: 780 },
      { name: 'Lake', x: 2240, y: 2200 },
      { name: 'Rose Gdn', x: 2240, y: 1400 },
      { name: 'Meadow', x: 560, y: 560 },
      { name: 'Maze', x: 560, y: 2240 },
      { name: 'Cherry Hill', x: 2240, y: 560 }
    ];

    for (const lm of landmarks) {
      const label = this.scene.add.text(lm.x, lm.y - 12, lm.name, {
        fontFamily: 'monospace',
        fontSize: '46px', // Scaled up text to be clearly readable at 0.09 zoom!
        color: '#ffebc4',
        fontStyle: 'bold',
        stroke: '#080c10',
        strokeThickness: 10,
        align: 'center'
      });
      label.setOrigin(0.5, 0.5);
      label.setDepth(99990);
      this.scene.cameras.main.ignore(label);
      this.landmarkLabels.push(label);

      // Icon marker
      const icon = this.scene.add.sprite(lm.x, lm.y, 'ui_minimap_landmark');
      icon.setDepth(99980).setScale(2.5);
      this.scene.cameras.main.ignore(icon);
    }
  }

  update(_delta: number): void {
    if (!this.isVisible) return;

    // 1. Follow player coordinate and direction
    const player = this.scene.playerSystem.gameObject;
    if (player) {
      this.playerMarker.setPosition(player.x, player.y);
      
      // Rotate marker based on player movement
      const body = player.body as Phaser.Physics.Arcade.Body;
      if (body && (body.velocity.x !== 0 || body.velocity.y !== 0)) {
        const angle = Math.atan2(body.velocity.y, body.velocity.x);
        this.playerMarker.setRotation(angle + Math.PI / 2); // default texture is UP
      }
    }

    // 2. Discover current zone and update Fog of War
    const currentZone = this.scene.currentArea;
    if (currentZone && !this.visitedZones.has(currentZone)) {
      this.visitedZones.add(currentZone);
      this.updateFogOfWar();
    }

    // 3. Update NPC markers (fade/reveal markers when met)
    this.updateNpcMarkers();

    // 4. Update memory markers
    this.updateMemoryMarkers();

    // 5. Hide main scene UI overlay on the minimap camera
    this.ignoreUiElements();
  }

  private updateFogOfWar(): void {
    this.fogGfx.clear();
    
    // Draw fog over unvisited zones
    for (const [key, cfg] of Object.entries(AREAS)) {
      if (!this.visitedZones.has(key)) {
        this.fogGfx.fillStyle(0x0e1724, 0.76); // Dark foggy shroud
        this.fogGfx.fillRect(cfg.x, cfg.y, cfg.width, cfg.height);
      }
    }
  }

  private updateNpcMarkers(): void {
    // Siya, Eli, Nikhil spawn points
    const npcs = [
      { id: 'siya_npc', x: 560, y: 640 },
      { id: 'eli_npc', x: 2240, y: 1340 },
      { id: 'nikhil_npc', x: 1320, y: 760 }
    ];

    for (const npc of npcs) {
      let marker = this.npcMarkers.get(npc.id);
      if (!marker) {
        marker = this.scene.add.sprite(npc.x, npc.y - 10, 'ui_minimap_npc');
        marker.setDepth(99995).setScale(2.0);
        this.scene.cameras.main.ignore(marker);
        this.npcMarkers.set(npc.id, marker);
      }
      
      // Only show NPC if they are discovered or player has visited their zone
      const zoneKey = this.getZoneFromCoords(npc.x, npc.y);
      const isVisible = this.visitedZones.has(zoneKey);
      marker.setVisible(isVisible);
    }
  }

  private updateMemoryMarkers(): void {
    // Find all active memory orbs in interactionSystem
    const activeOrbs = this.scene.interactionSystem.getActiveMemoryOrbs();
    
    // Clean up markers that are no longer active
    for (const [key, marker] of this.memoryMarkers.entries()) {
      const active = activeOrbs.some(orb => orb.id === key);
      if (!active) {
        marker.destroy();
        this.memoryMarkers.delete(key);
      }
    }

    // Add/update markers for active orbs
    for (const orb of activeOrbs) {
      let marker = this.memoryMarkers.get(orb.id);
      if (!marker) {
        marker = this.scene.add.sprite(orb.x, orb.y, 'ui_minimap_memory');
        marker.setDepth(99992).setScale(1.8);
        this.scene.cameras.main.ignore(marker);
        this.memoryMarkers.set(orb.id, marker);

        // Pulsing animation
        this.scene.tweens.add({
          targets: marker,
          scale: { from: 1.2, to: 2.4 },
          alpha: { from: 1.0, to: 0.4 },
          duration: 1000,
          yoyo: true,
          repeat: -1
        });
      }
      
      // Only show if the zone is visited
      const zoneKey = this.getZoneFromCoords(orb.x, orb.y);
      marker.setVisible(this.visitedZones.has(zoneKey));
    }
  }

  private getZoneFromCoords(x: number, y: number): string {
    for (const [key, cfg] of Object.entries(AREAS)) {
      if (x >= cfg.x && x <= cfg.x + cfg.width && y >= cfg.y && y <= cfg.y + cfg.height) {
        return key;
      }
    }
    return '';
  }

  private ignoreUiElements(): void {
    // Minimap camera ignores HUD elements, overlay, and text dialogues
    const ui = this.scene.uiSystem;
    if (ui) {
      this.camera.ignore([
        this.border,
        this.scene.environmentManager.overlay
      ]);
    }
  }

  setVisible(visible: boolean): void {
    this.isVisible = visible;
    this.camera.setVisible(visible);
    this.border.setVisible(visible);
  }

  destroy(): void {
    this.camera.destroy();
    this.border.destroy();
    this.fogGfx.destroy();
    this.playerMarker.destroy();
    for (const m of this.npcMarkers.values()) m.destroy();
    for (const m of this.memoryMarkers.values()) m.destroy();
    for (const l of this.landmarkLabels) l.destroy();
  }
}
