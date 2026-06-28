// ============================================================
// ButterflySystem — AI butterflies that react to flowers & player
// ============================================================

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { MAX_BUTTERFLIES, BUTTERFLY_SPEED, BUTTERFLY_VISUAL_RANGE } from '../constants';
import { randFloat, randInt, randPick, dist } from '../utils/math';

const BUTTERFLY_KEYS = [
  'butterfly_orange', 'butterfly_blue', 'butterfly_yellow',
  'butterfly_white', 'butterfly_purple', 'butterfly_pink',
] as const;

type ButterflyState = 'idle' | 'fly_to_flower' | 'circle_flower' | 'fly_to_player' | 'circle_player' | 'land' | 'fly_away';

interface ButterflyEntity {
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Sprite;
  state: ButterflyState;
  stateTimer: number;
  targetX: number;
  targetY: number;
  baseY: number;
  flutterOffset: number;
  speed: number;
  wingPhase: number;
}

export class ButterflySystem {
  private scene: GameScene;
  private butterflies: ButterflyEntity[] = [];
  private spawnTimer = 0;
  private swarmTimer = 0;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(delta: number): void {
    const dt = delta / 1000;

    // Spawn butterflies near flowers
    this.spawnTimer += dt;
    if (this.spawnTimer > 2 && this.butterflies.length < MAX_BUTTERFLIES) {
      this.spawnTimer = 0;
      this.trySpawn();
    }

    // Occasional swarm
    this.swarmTimer += dt;
    if (this.swarmTimer > 60 && Math.random() < 0.1) {
      this.swarmTimer = 0;
      this.spawnSwarm();
    }

    // Update each butterfly
    for (let i = this.butterflies.length - 1; i >= 0; i--) {
      this.updateButterfly(this.butterflies[i], dt);

      // Despawn if too far from player
      const b = this.butterflies[i];
      const playerDist = dist(b.sprite.x, b.sprite.y, this.scene.playerSystem.x, this.scene.playerSystem.y);
      if (playerDist > 600) {
        b.sprite.destroy();
        b.shadow.destroy();
        this.butterflies.splice(i, 1);
      }
    }
  }

  private trySpawn(): void {
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;

    // Spawn at edge of visibility
    const angle = randFloat(0, Math.PI * 2);
    const spawnDist = randFloat(250, 400);
    const sx = px + Math.cos(angle) * spawnDist;
    const sy = py + Math.sin(angle) * spawnDist;

    // Only spawn if flowers are nearby
    const nearbyFlowers = this.scene.flowerSystem.getFlowersNear(sx, sy, 200);
    if (nearbyFlowers.length === 0 && this.scene.flowerSystem.getTotalFlowers() > 5) return;

    this.spawnAt(sx, sy);
  }

  private spawnAt(x: number, y: number): void {
    const key = randPick(BUTTERFLY_KEYS);
    const sprite = this.scene.add.sprite(x, y, key);
    sprite.setScale(randFloat(1.2, 2.0));
    sprite.setDepth(y + 50);

    const shadow = this.scene.add.sprite(x, y + 10, 'particle_pollen');
    shadow.setAlpha(0.2);
    shadow.setScale(1.5);
    shadow.setTint(0x000000);
    shadow.setDepth(y - 1);

    const butterfly: ButterflyEntity = {
      sprite,
      shadow,
      state: 'idle',
      stateTimer: 0,
      targetX: x,
      targetY: y,
      baseY: y,
      flutterOffset: randFloat(0, Math.PI * 2),
      speed: BUTTERFLY_SPEED + randFloat(-10, 10),
      wingPhase: randFloat(0, Math.PI * 2),
    };

    this.butterflies.push(butterfly);
  }

  private spawnSwarm(): void {
    const px = this.scene.playerSystem.x;
    const py = this.scene.playerSystem.y;
    const count = randInt(3, 6);
    for (let i = 0; i < count && this.butterflies.length < MAX_BUTTERFLIES; i++) {
      this.spawnAt(
        px + randFloat(-200, 200),
        py + randFloat(-200, -100)
      );
    }
  }

  private updateButterfly(b: ButterflyEntity, dt: number): void {
    b.stateTimer += dt;
    b.wingPhase += dt * 12;

    // Wing flutter animation (scaleX oscillation)
    b.sprite.scaleX = Math.abs(Math.cos(b.wingPhase)) * b.sprite.scaleY + 0.3;

    // Vertical bob
    const bob = Math.sin(this.scene.time.now * 0.003 + b.flutterOffset) * 4;
    b.sprite.setY(b.baseY + bob);

    // Shadow follows
    b.shadow.setPosition(b.sprite.x, b.baseY + 10);
    b.shadow.setDepth(b.baseY - 1);
    b.sprite.setDepth(b.baseY + 50);

    switch (b.state) {
      case 'idle':
        this.stateIdle(b, dt);
        break;
      case 'fly_to_flower':
        this.stateFlyToTarget(b, dt, 'circle_flower');
        break;
      case 'circle_flower':
        this.stateCircle(b, dt, 3, 'idle');
        break;
      case 'fly_to_player':
        this.stateFlyToTarget(b, dt, 'circle_player');
        break;
      case 'circle_player':
        this.stateCircle(b, dt, 2, 'fly_away');
        break;
      case 'land':
        this.stateLand(b, dt);
        break;
      case 'fly_away':
        this.stateFlyAway(b, dt);
        break;
    }
  }

  private stateIdle(b: ButterflyEntity, dt: number): void {
    // Gentle drift
    b.sprite.x += Math.sin(this.scene.time.now * 0.001 + b.flutterOffset) * dt * 10;
    b.baseY += Math.cos(this.scene.time.now * 0.0007 + b.flutterOffset) * dt * 5;

    if (b.stateTimer > 2) {
      // Look for flowers
      const nearFlowers = this.scene.flowerSystem.getFlowersNear(b.sprite.x, b.baseY, BUTTERFLY_VISUAL_RANGE);
      if (nearFlowers.length > 0 && Math.random() < 0.4) {
        const target = randPick(nearFlowers);
        b.targetX = target.x;
        b.targetY = target.y;
        this.setState(b, 'fly_to_flower');
        return;
      }

      // Look for player
      const playerDist = dist(b.sprite.x, b.baseY, this.scene.playerSystem.x, this.scene.playerSystem.y);
      if (playerDist < BUTTERFLY_VISUAL_RANGE && Math.random() < 0.2) {
        b.targetX = this.scene.playerSystem.x;
        b.targetY = this.scene.playerSystem.y;
        this.setState(b, 'fly_to_player');
        return;
      }

      // Random drift
      if (Math.random() < 0.3) {
        b.targetX = b.sprite.x + randFloat(-80, 80);
        b.targetY = b.baseY + randFloat(-60, 60);
        this.setState(b, 'fly_away');
      }

      b.stateTimer = 0;
    }
  }

  private stateFlyToTarget(b: ButterflyEntity, dt: number, nextState: ButterflyState): void {
    const dx = b.targetX - b.sprite.x;
    const dy = b.targetY - b.baseY;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d < 15 || b.stateTimer > 5) {
      this.setState(b, nextState);
      return;
    }

    const nx = dx / d;
    const ny = dy / d;
    b.sprite.x += nx * b.speed * dt;
    b.baseY += ny * b.speed * dt;

    // Slight sinusoidal drift while flying
    b.sprite.x += Math.sin(b.stateTimer * 3) * dt * 15;
  }

  private stateCircle(b: ButterflyEntity, _dt: number, duration: number, nextState: ButterflyState): void {
    const angle = b.stateTimer * 1.5;
    const radius = 25;
    b.sprite.x = b.targetX + Math.cos(angle) * radius;
    b.baseY = b.targetY + Math.sin(angle) * radius * 0.5 - 15;

    if (b.stateTimer > duration) {
      if (Math.random() < 0.3) {
        this.setState(b, 'land');
      } else {
        this.setState(b, nextState);
      }
    }
  }

  private stateLand(b: ButterflyEntity, _dt: number): void {
    // Slow wing flutter
    b.wingPhase += -_dt * 8; // Slower flutter to cancel some speed
    if (b.stateTimer > randFloat(2, 4)) {
      this.setState(b, 'idle');
    }
  }

  private stateFlyAway(b: ButterflyEntity, dt: number): void {
    const dx = b.targetX - b.sprite.x;
    const dy = b.targetY - b.baseY;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d < 10 || b.stateTimer > 4) {
      this.setState(b, 'idle');
      return;
    }

    const nx = dx / d;
    const ny = dy / d;
    b.sprite.x += nx * b.speed * 1.3 * dt;
    b.baseY += ny * b.speed * 1.3 * dt;
  }

  private setState(b: ButterflyEntity, state: ButterflyState): void {
    b.state = state;
    b.stateTimer = 0;
  }

  /** Spawn many butterflies for the ending */
  spawnEndingSwarm(x: number, y: number): void {
    for (let i = 0; i < 15; i++) {
      this.spawnAt(
        x + randFloat(-150, 150),
        y + randFloat(-150, 50)
      );
    }
  }
}
