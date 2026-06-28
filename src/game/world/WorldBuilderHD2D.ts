// ════════════════════════════════════════════════════════════════════════════
//  ISLAND TOWN MAP — Complete 8-bit JRPG World
//  Single file: types + zone data + full procedural builder
//  World: 2800×2800px  |  Island: 2520×2520 inside 140px ocean border
//  All buildings, walls, animals, flora, paths from pixel art generator
// ═══════════════════════════════════════════════════════════════════════════

import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../constants';
import type { AreaKey } from '../constants';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface WorldObject {
  id?: string;
  type: string;
  x: number;
  y: number;
  scale?: number;
  depth?: number;
  alpha?: number;
  interactive?: boolean;
  interactionType?: string;
  dialogueId?: string;
  collides?: boolean;
  flipX?: boolean;
}

export interface AreaConfig {
  key: string;
  name: string;
  bounds: { x: number; y: number; w: number; h: number };
  groundColor: number;
  objects: WorldObject[];
  hasWater?: boolean;
  waterBounds?: { x: number; y: number; w: number; h: number };
  dialogueOnEnter?: string;
}

// ─── Zone Layout — 3×3 grid each 840×840px inside 140px ocean border ─────────
// NW=secretGarden  N=observatory    NE=cherryGarden
// W=greenhouse     C=centralPlaza   E=roseGarden
// SW=maze          S=cottage        SE=crystalLake

const Z = 840; // zone size
const OX = 140, OY = 160; // island origin

const zoneX = (col: 0|1|2) => OX + col * Z;
const zoneY = (row: 0|1|2) => OY + row * Z;
const zc    = (col: 0|1|2) => zoneX(col) + Z / 2;  // zone center x
const zr    = (row: 0|1|2) => zoneY(row) + Z / 2;  // zone center y

// ─── ISLAND ZONES DATA ────────────────────────────────────────────────────────
export const ISLAND_ZONES: AreaConfig[] = [

  // ═══════════════════════════════════════════════════════════════════
  // COTTAGE — S zone, player start (row 2, col 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'cottage',
    name: 'Cottage Garden',
    bounds: { x: zoneX(1), y: zoneY(2), w: Z, h: Z },
    groundColor: 0x3d7a30,
    objects: [
      // Main cottage building
      { type: 'house_cottage', x: zc(1), y: zoneY(2)+220, scale: 1.1, collides: true, depth: zoneY(2)+300 },
      // Wakeup bench
      { type: 'bench', x: zc(1)+60, y: zoneY(2)+420,
        interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Letter table
      { id: 'cottage_letter_table', type: 'letter_table', x: zc(1)-40, y: zoneY(2)+370,
        interactive: true, interactionType: 'letter', dialogueId: 'read_letter', collides: true },
      // Flower pots on cottage steps
      { type: 'flower_pot', x: zc(1)-60, y: zoneY(2)+310, scale: 0.9 },
      { type: 'flower_pot', x: zc(1)+60, y: zoneY(2)+310, scale: 0.9 },
      // Mailbox
      { type: 'mailbox', x: zc(1)+120, y: zoneY(2)+340, scale: 0.9 },
      // Garden fence enclosure
      { type: 'fence_h', x: zc(1)-200, y: zoneY(2)+460, collides: true },
      { type: 'fence_h', x: zc(1)-168, y: zoneY(2)+460, collides: true },
      { type: 'fence_h', x: zc(1)+140, y: zoneY(2)+460, collides: true },
      { type: 'fence_h', x: zc(1)+172, y: zoneY(2)+460, collides: true },
      { type: 'fence_v', x: zc(1)-200, y: zoneY(2)+420, collides: true },
      { type: 'fence_v', x: zc(1)+200, y: zoneY(2)+420, collides: true },
      // Trees
      { type: 'tree_cherry', x: zoneX(1)+80,  y: zoneY(2)+160, scale: 1.1, collides: true },
      { type: 'tree_oak',    x: zoneX(1)+740, y: zoneY(2)+200, scale: 1.0, collides: true },
      { type: 'tree_apple',  x: zoneX(1)+680, y: zoneY(2)+580, scale: 1.0, collides: true },
      { type: 'tree_oak',    x: zoneX(1)+100, y: zoneY(2)+620, scale: 0.9, collides: true },
      // Lanterns
      { type: 'lantern', x: zc(1)-80, y: zoneY(2)+440, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(1)+80, y: zoneY(2)+440, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Barrels by cottage wall
      { type: 'barrel', x: zc(1)+90, y: zoneY(2)+300, scale: 0.8 },
      { type: 'barrel', x: zc(1)+110, y: zoneY(2)+295, scale: 0.75 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECRET GARDEN — NW zone (row 0, col 0)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'secretGarden',
    name: 'Secret Garden',
    bounds: { x: zoneX(0), y: zoneY(0), w: Z, h: Z },
    groundColor: 0x2a5820,
    dialogueOnEnter: 'enter_secretGarden',
    objects: [
      { type: 'gazebo', x: zc(0), y: zr(0)-60, scale: 1.0, collides: true, interactive: true, interactionType: 'gazebo', dialogueId: 'greenhouse_inspect' },
      { type: 'bench', x: zc(0)-120, y: zr(0)+20, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(0)+120, y: zr(0)+20, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'flower_arch', x: zc(0), y: zoneY(0)+780, scale: 1.2, collides: false },
      { type: 'flower_arch', x: zoneX(0)+780, y: zr(0), scale: 1.1, collides: false },
      { type: 'tree_cherry', x: zoneX(0)+120, y: zoneY(0)+180, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: zoneX(0)+700, y: zoneY(0)+180, scale: 1.0, collides: true },
      { type: 'tree_willow', x: zoneX(0)+100, y: zoneY(0)+700, scale: 1.1, collides: true },
      { type: 'tree_willow', x: zoneX(0)+720, y: zoneY(0)+680, scale: 1.0, collides: true },
      { type: 'notice_board', x: zc(0)-180, y: zoneY(0)+760, scale: 1.0, interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
      { type: 'lantern', x: zc(0)-60, y: zr(0)-80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(0)+60, y: zr(0)-80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // OBSERVATORY — N zone (row 0, col 1) — ENDING AREA
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'observatory',
    name: 'The Observatory',
    bounds: { x: zoneX(1), y: zoneY(0), w: Z, h: Z },
    groundColor: 0x0a0a20,
    dialogueOnEnter: 'enter_observatory',
    objects: [
      { id: 'observatory_cherry_tree', type: 'tree_big_cherry', x: zc(1), y: zr(0)-80, scale: 2.0, collides: true },
      { type: 'cake', x: zc(1), y: zr(0)+60, scale: 1.4 },
      // Lantern ring
      ...Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return {
          type: i % 2 === 0 ? 'lantern_lit' : 'flower_cherry',
          x: zc(1) + Math.cos(a) * 200,
          y: zr(0) - 40 + Math.sin(a) * 120,
          scale: i % 2 === 0 ? 1.1 : 0.9,
          interactive: i % 2 === 0,
          interactionType: 'lantern',
          dialogueId: 'lantern_light',
        };
      }),
      { type: 'bench', x: zc(1)-160, y: zr(0)+80, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(1)+160, y: zr(0)+80, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'lamp_post', x: zc(1)-220, y: zr(0)-100, scale: 1.0 },
      { type: 'lamp_post', x: zc(1)+220, y: zr(0)-100, scale: 1.0 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHERRY GARDEN — NE zone (row 0, col 2)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'cherryGarden',
    name: 'Cherry Garden',
    bounds: { x: zoneX(2), y: zoneY(0), w: Z, h: Z },
    groundColor: 0x3a5020,
    dialogueOnEnter: 'enter_cherryGarden',
    objects: [
      { id: 'bhavya_tree', type: 'tree_big_cherry', x: zc(2), y: zr(0)-80, scale: 1.7, collides: true },
      { type: 'tree_cherry', x: zoneX(2)+120, y: zoneY(0)+180, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: zoneX(2)+700, y: zoneY(0)+180, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: zoneX(2)+140, y: zoneY(0)+620, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: zoneX(2)+680, y: zoneY(0)+620, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: zc(2)-180,    y: zoneY(0)+320, scale: 0.9, collides: true },
      { type: 'tree_cherry', x: zc(2)+180,    y: zoneY(0)+320, scale: 0.9, collides: true },
      { type: 'bench', x: zc(2), y: zr(0)+120, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      ...Array.from({ length: 10 }, (_, i) => ({
        type: 'lantern_lit',
        x: zc(2) + Math.cos((i/10)*Math.PI*2) * 230,
        y: zr(0) - 60 + Math.sin((i/10)*Math.PI*2) * 130,
        scale: 1.0,
        interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light',
      })),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // GREENHOUSE — W zone (row 1, col 0)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'greenhouse',
    name: 'Greenhouse',
    bounds: { x: zoneX(0), y: zoneY(1), w: Z, h: Z },
    groundColor: 0x3a6828,
    dialogueOnEnter: 'enter_greenhouse',
    objects: [
      { type: 'greenhouse_bldg', x: zc(0), y: zr(1)-100, scale: 1.0, collides: true, interactive: true, interactionType: 'gazebo', dialogueId: 'greenhouse_inspect' },
      { type: 'windmill', x: zoneX(0)+160, y: zoneY(1)+180, scale: 0.9, collides: true },
      { type: 'bench', x: zc(0)+120, y: zr(1)+40, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'flower_pot', x: zc(0)-80, y: zr(1)-40, scale: 0.9 },
      { type: 'flower_pot', x: zc(0)+80, y: zr(1)-40, scale: 0.9 },
      { type: 'tree_oak', x: zoneX(0)+120, y: zoneY(1)+600, scale: 1.1, collides: true },
      { type: 'tree_oak', x: zoneX(0)+700, y: zoneY(1)+200, scale: 1.0, collides: true },
      { type: 'tree_pine', x: zoneX(0)+720, y: zoneY(1)+650, scale: 1.0, collides: true },
      { type: 'lantern', x: zc(0)-60, y: zr(1)+80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(0)+60, y: zr(1)+80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'barrel', x: zc(0)-120, y: zr(1)-80, scale: 0.9 },
      { type: 'crate',  x: zc(0)-140, y: zr(1)-50, scale: 0.9 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CENTRAL PLAZA — Center zone (row 1, col 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'centralPlaza',
    name: 'Central Plaza',
    bounds: { x: zoneX(1), y: zoneY(1), w: Z, h: Z },
    groundColor: 0x787060,
    dialogueOnEnter: 'enter_centralPlaza',
    objects: [
      // Fountain centerpiece
      { type: 'fountain', x: zc(1), y: zr(1), scale: 1.5, collides: true, interactive: true, interactionType: 'fountain', dialogueId: 'fountain_watch' },
      // Market stalls around fountain
      { type: 'market_stall', x: zc(1)-240, y: zr(1)-160, scale: 1.0, collides: true },
      { type: 'market_stall', x: zc(1)+240, y: zr(1)-160, scale: 1.0, collides: true, flipX: true },
      { type: 'market_stall', x: zc(1)-240, y: zr(1)+160, scale: 1.0, collides: true },
      { type: 'market_stall', x: zc(1)+240, y: zr(1)+160, scale: 1.0, collides: true, flipX: true },
      // Benches
      { type: 'bench', x: zc(1)-120, y: zr(1)-80, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(1)+120, y: zr(1)-80, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(1)-120, y: zr(1)+160, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(1)+120, y: zr(1)+160, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Notice board
      { type: 'notice_board', x: zc(1)+340, y: zr(1)-280, scale: 1.0, interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
      // Lantern posts
      { type: 'lamp_post', x: zc(1)-280, y: zr(1)-280, scale: 1.0 },
      { type: 'lamp_post', x: zc(1)+280, y: zr(1)-280, scale: 1.0 },
      { type: 'lamp_post', x: zc(1)-280, y: zr(1)+280, scale: 1.0 },
      { type: 'lamp_post', x: zc(1)+280, y: zr(1)+280, scale: 1.0 },
      // Corner trees
      { type: 'tree_cherry', x: zoneX(1)+100, y: zoneY(1)+100, scale: 0.9, collides: true },
      { type: 'tree_cherry', x: zoneX(1)+740, y: zoneY(1)+100, scale: 0.9, collides: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ROSE GARDEN — E zone (row 1, col 2)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'roseGarden',
    name: 'Rose Garden',
    bounds: { x: zoneX(2), y: zoneY(1), w: Z, h: Z },
    groundColor: 0x305a28,
    dialogueOnEnter: 'enter_roseGarden',
    objects: [
      { type: 'shop_florist', x: zc(2), y: zoneY(2)+140, scale: 1.0, collides: true, interactive: true, interactionType: 'sign', dialogueId: 'dock_look' },
      { type: 'flower_arch', x: zoneX(2)+60,  y: zr(1),     scale: 1.2, collides: false },
      { type: 'flower_arch', x: zoneX(2)+780,  y: zoneY(1)+400, scale: 1.2, collides: false },
      { type: 'bench', x: zc(2)-100, y: zr(1)+180, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: zc(2)+100, y: zr(1)+180, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'tree_cherry', x: zoneX(2)+120, y: zoneY(1)+180, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: zoneX(2)+700, y: zoneY(1)+180, scale: 1.1, collides: true },
      { type: 'tree_oak',    x: zoneX(2)+140, y: zoneY(1)+680, scale: 1.0, collides: true },
      { type: 'tree_oak',    x: zoneX(2)+700, y: zoneY(1)+680, scale: 0.9, collides: true },
      { type: 'lantern', x: zc(2)-60, y: zr(1)-80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(2)+60, y: zr(1)-80, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'flower_pot', x: zc(2)-160, y: zr(1)+60, scale: 0.9 },
      { type: 'flower_pot', x: zc(2)+160, y: zr(1)+60, scale: 0.9 },
      { type: 'flower_pot', x: zc(2),     y: zr(1)-160, scale: 1.0 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // MAZE — SW zone (row 2, col 0)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'maze',
    name: 'Hedge Maze',
    bounds: { x: zoneX(0), y: zoneY(2), w: Z, h: Z },
    groundColor: 0x244820,
    dialogueOnEnter: 'enter_maze',
    objects: [
      { type: 'sign_post', x: zc(0), y: zoneY(2)+760, interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
      { type: 'lantern', x: zoneX(0)+200, y: zoneY(2)+400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zoneX(0)+600, y: zoneY(2)+300, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zoneX(0)+300, y: zoneY(2)+600, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'mushroom', x: zoneX(0)+180, y: zoneY(2)+200, scale: 1.0 },
      { type: 'mushroom', x: zoneX(0)+640, y: zoneY(2)+560, scale: 0.9 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRYSTAL LAKE — SE zone (row 2, col 2)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'crystalLake',
    name: 'Crystal Lake',
    bounds: { x: zoneX(2), y: zoneY(2), w: Z, h: Z },
    groundColor: 0x204838,
    hasWater: true,
    waterBounds: { x: zoneX(2)+100, y: zoneY(2)+200, w: 640, h: 380 },
    dialogueOnEnter: 'enter_crystalLake',
    objects: [
      { id: 'crystal_lake_bridge', type: 'bridge_h', x: zc(2), y: zoneY(2)+390, scale: 1.5, collides: true },
      { type: 'dock', x: zc(2)-100, y: zoneY(2)+220, scale: 1.2, interactive: true, interactionType: 'dock', dialogueId: 'dock_look', collides: true },
      { type: 'rock_small', x: zc(2)-60, y: zoneY(2)+230, scale: 1.0, interactive: true, interactionType: 'skip_stone', dialogueId: 'skip_stones' },
      { type: 'tree_willow', x: zoneX(2)+120, y: zoneY(2)+230, scale: 1.1, collides: true },
      { type: 'tree_willow', x: zoneX(2)+700, y: zoneY(2)+230, scale: 1.0, collides: true },
      { type: 'tree_willow', x: zoneX(2)+120, y: zoneY(2)+640, scale: 1.0, collides: true },
      { type: 'tree_willow', x: zoneX(2)+700, y: zoneY(2)+640, scale: 1.1, collides: true },
      { type: 'lantern', x: zc(2)-100, y: zoneY(2)+400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(2)+100, y: zoneY(2)+400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'bench', x: zc(2), y: zoneY(2)+680, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FORGOTTEN CHURCH — overlaps north row
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'forgottenChurch',
    name: 'Forgotten Shrine',
    bounds: { x: zoneX(1), y: zoneY(0), w: Z, h: Z },
    groundColor: 0x504838,
    dialogueOnEnter: 'enter_forgottenChurch',
    objects: [
      { id: 'church_mirror', type: 'mirror', x: zc(1)-120, y: zr(0)+60,
        interactive: true, interactionType: 'mirror', dialogueId: 'look_mirror', collides: true },
      { id: 'nikhil_desk',     type: 'table_empty', x: zc(1)+100, y: zr(0)+80, collides: true },
      { id: 'nikhil_notebook', type: 'notebook',    x: zc(1)+100, y: zr(0)+60,
        interactive: true, interactionType: 'notebook', dialogueId: 'read_notebook' },
      { type: 'flower_arch', x: zc(1), y: zoneY(0)+180, scale: 1.3, collides: false },
      { type: 'lantern', x: zc(1)-80, y: zr(0)+120, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: zc(1)+80, y: zr(0)+120, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
  },
];

// ─── Area Config Map ──────────────────────────────────────────────────────────
const ZONE_MAP = new Map<string, AreaConfig>(ISLAND_ZONES.map(z => [z.key, z]));

// ════════════════════════════════════════════════════════════════════════════
//  WORLD BUILDER CLASS — complete island town generation
// ════════════════════════════════════════════════════════════════════════════
export class WorldBuilder {
  private scene: GameScene;
  private rng = 0x4d3a1f7;  // deterministic seed

  // Path & Object collision-avoidance maps
  private blockedRects: { x1: number; y1: number; x2: number; y2: number }[] = [];
  private blockedCircles: { cx: number; cy: number; r: number }[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  getAreaConfig(key: AreaKey): AreaConfig | undefined {
    return ZONE_MAP.get(key);
  }

  build(): void {
    this.initializeBlockedZones(); // Pre-populate path & building bounds
    this.drawOcean();             // Animated ocean surround
    this.drawIslandGround();      // Grass base + zone tints
    this.drawBoundaryWalls();     // Stone perimeter walls + gate
    this.drawTownPaths();         // Cobblestone road network
    this.drawTownBuildings();     // Shops, inn, bakery, church
    this.drawWaterFeatures();     // Crystal lake, ponds
    this.drawMazeWalls();         // Hedge maze
    this.decoratePathAvenues();   // Neat trees & lampposts lining paths (no overlap)
    this.drawDenseFlora();        // Flowers, bushes, trees everywhere (fills empty spots)
    this.placeZoneObjects();      // Data-driven objects per zone
    this.spawnAnimals();          // Wandering cats, dogs, birds
    this.drawNYNIMessage();       // Flower NYNI message at plaza
    this.drawAtmosphere();        // Vignette, fog, depth layers
  }

  // ──────────────────────────────────────────────────────────────────
  // BLOCKED ZONES SYSTEM — prevents trees/props on paths or clipping
  // ──────────────────────────────────────────────────────────────────
  private initializeBlockedZones(): void {
    const cx1 = zc(1), cx0 = zc(0), cx2 = zc(2);
    const cy0 = zr(0), cy1 = zr(1), cy2 = zr(2);
    const pathWidth = 36;
    const pathBuf = 48; // Buffer size around paths

    // 1. Column path spines (vertical)
    this.blockedRects.push({ x1: cx0 - pathBuf, y1: OY, x2: cx0 + pathBuf, y2: OY + 2520 });
    this.blockedRects.push({ x1: cx1 - pathBuf, y1: OY, x2: cx1 + pathBuf, y2: OY + 2520 });
    this.blockedRects.push({ x1: cx2 - pathBuf, y1: OY, x2: cx2 + pathBuf, y2: OY + 2520 });

    // 2. Row path connectors (horizontal)
    this.blockedRects.push({ x1: OX, y1: cy0 - pathBuf, x2: OX + 2520, y2: cy0 + pathBuf });
    this.blockedRects.push({ x1: OX, y1: cy1 - pathBuf, x2: OX + 2520, y2: cy1 + pathBuf });
    this.blockedRects.push({ x1: OX, y1: cy2 - pathBuf, x2: OX + 2520, y2: cy2 + pathBuf });

    // 3. Central Plaza circle
    this.blockedCircles.push({ cx: cx1, cy: cy1, r: 320 });

    // 4. Shop & house rectangles
    // East side main street
    this.blockedRects.push({ x1: zoneX(2) + 10, y1: zoneY(1) + 100, x2: zoneX(2) + 210, y2: zoneY(1) + 260 }); // Bakery
    this.blockedRects.push({ x1: zoneX(2) + 20, y1: zoneY(1) + 330, x2: zoneX(2) + 230, y2: zoneY(1) + 500 }); // Inn
    this.blockedRects.push({ x1: zoneX(2) + 10, y1: zoneY(1) + 590, x2: zoneX(2) + 210, y2: zoneY(1) + 740 }); // Market

    // West street
    this.blockedRects.push({ x1: zoneX(0) + 20, y1: zoneY(1) + 320, x2: zoneX(0) + 220, y2: zoneY(1) + 460 }); // Stone House 1
    this.blockedRects.push({ x1: zoneX(0) + 20, y1: zoneY(1) + 540, x2: zoneX(0) + 220, y2: zoneY(1) + 680 }); // Stone House 2
    this.blockedRects.push({ x1: zoneX(0) + 550, y1: zoneY(1) + 620, x2: zoneX(0) + 770, y2: zoneY(1) + 760 }); // Sunny Home

    // South houses
    this.blockedRects.push({ x1: zoneX(1) + 10, y1: zoneY(2) + 540, x2: zoneX(1) + 200, y2: zoneY(2) + 680 }); // Garden House
    this.blockedRects.push({ x1: zoneX(1) + 550, y1: zoneY(2) + 120, x2: zoneX(1) + 770, y2: zoneY(2) + 260 }); // Brick House

    // Cottage, Church, and Greenhouse
    this.blockedRects.push({ x1: zc(1) - 100, y1: zoneY(2) + 140, x2: zc(1) + 100, y2: zoneY(2) + 290 }); // Cottage
    this.blockedRects.push({ x1: zoneX(1) + 10, y1: zoneY(0) + 120, x2: zoneX(1) + 210, y2: zoneY(0) + 280 }); // Church
    this.blockedRects.push({ x1: zc(0) - 80, y1: zr(1) - 180, x2: zc(0) + 80, y2: zr(1) - 40 }); // Greenhouse Bldg

    // 5. Maze Zone bounds (SW row 2, col 0) — completely block random vegetation from inside maze
    this.blockedRects.push({ x1: zoneX(0), y1: zoneY(2), x2: zoneX(0) + Z, y2: zoneY(2) + Z });

    // 6. Spawn zone safe area around player start position in Cottage zone
    this.blockedCircles.push({ cx: 1400, cy: 2180, r: 80 });

    // 7. Benches (fixed spawn locations)
    const benches = [
      { cx: zc(1) + 60, cy: zoneY(2) + 420 },  // Cottage bench
      { cx: zc(0) - 120, cy: zr(0) + 20 },     // Secret Garden bench 1
      { cx: zc(0) + 120, cy: zr(0) + 20 },     // Secret Garden bench 2
      { cx: zc(1) - 160, cy: zr(0) + 80 },     // Observatory bench 1
      { cx: zc(1) + 160, cy: zr(0) + 80 },     // Observatory bench 2
      { cx: zc(2), cy: zr(0) + 120 },          // Cherry Garden bench
      { cx: zc(0) + 120, cy: zr(1) + 40 },     // Greenhouse bench
      { cx: zc(1) - 120, cy: zr(1) - 80 },     // Plaza bench 1
      { cx: zc(1) + 120, cy: zr(1) - 80 },     // Plaza bench 2
      { cx: zc(1) - 120, cy: zr(1) + 160 },    // Plaza bench 3
      { cx: zc(1) + 120, cy: zr(1) + 160 },    // Plaza bench 4
      { cx: zc(2) - 100, cy: zr(1) + 180 },    // Rose Garden bench 1
      { cx: zc(2) + 100, cy: zr(1) + 180 },    // Rose Garden bench 2
      { cx: zc(2), cy: zoneY(2) + 680 },       // Crystal Lake bench
    ];
    for (const b of benches) {
      this.blockedCircles.push({ cx: b.cx, cy: b.cy, r: 40 });
    }
  }

  private isPositionBlocked(x: number, y: number, r = 20): boolean {
    // 1. Check ocean boundary walls buffer
    if (x < OX + 65 || x > OX + 2520 - 65 || y < OY + 65 || y > OY + 2520 - 65) return true;

    // 2. Check blocked rectangles
    for (const rect of this.blockedRects) {
      if (x >= rect.x1 - r && x <= rect.x2 + r && y >= rect.y1 - r && y <= rect.y2 + r) {
        return true;
      }
    }

    // 3. Check blocked circles
    for (const circ of this.blockedCircles) {
      const dx = x - circ.cx;
      const dy = y - circ.cy;
      if (dx * dx + dy * dy < (circ.r + r) * (circ.r + r)) {
        return true;
      }
    }

    // 4. Check diagonal paths
    const cx1 = zc(1), cx0 = zc(0), cx2 = zc(2);
    const cy0 = zr(0), cy1 = zr(1);
    // diagonal 1: (cx1+400, cy0+150) to (cx2-80, cy0+200)
    if (this.distToSegment(x, y, cx1+400, cy0+150, cx2-80, cy0+200) < 40 + r) return true;
    // diagonal 2: (cx1-400, cy1-100) to (cx0+80, cy1-160)
    if (this.distToSegment(x, y, cx1-400, cy1-100, cx0+80, cy1-160) < 40 + r) return true;

    // 5. Check ellipse ponds
    // Crystal lake: center (zoneX(2)+420, zoneY(2)+395), width 640, height 380 -> radius X = 320, Y = 190
    const clx = zoneX(2)+420, cly = zoneY(2)+395;
    const cldx = x - clx, cldy = y - cly;
    if ((cldx * cldx) / (320*320) + (cldy * cldy) / (190*190) < 1.05) return true;

    // Secret Garden pond: center (zc(0)+60, zr(0)+120), width 280, height 160 -> radius X = 140, Y = 80
    const sgx = zc(0)+60, sgy = zr(0)+120;
    const sgdx = x - sgx, sgdy = y - sgy;
    if ((sgdx * sgdx) / (140*140) + (sgdy * sgdy) / (80*80) < 1.05) return true;

    // Rose Garden stream: center (zc(2)-80, zr(1)+220), width 200, height 110 -> radius X = 100, Y = 55
    const rgx = zc(2)-80, rgy = zr(1)+220;
    const rgdx = x - rgx, rgdy = y - rgy;
    if ((rgdx * rgdx) / (100*100) + (rgdy * rgdy) / (55*55) < 1.05) return true;

    return false;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Helper to place static JRPG props with physics and double colliders
  private createStaticObject(x: number, y: number, key: string, scale = 1, collides = true): Phaser.GameObjects.Sprite {
    const spr = this.scene.add.sprite(x, y, key);
    spr.setScale(scale);
    spr.setOrigin(0.5, 0.84);
    spr.setDepth(y);

    if (collides) {
      this.scene.physics.add.existing(spr, true);
      const body = spr.body as Phaser.Physics.Arcade.StaticBody;

      // Fine-tune physics boxes to match 8-bit visual footprint precisely
      if (key.startsWith('tree_')) {
        body.setSize(16 * scale, 12 * scale);
        body.setOffset((spr.width / 2) - 8, spr.height - 14);
      } else if (key === 'bench') {
        body.setSize(spr.width * 0.9 * scale, 12 * scale);
        body.setOffset(spr.width * 0.05, spr.height - 14);
      } else if (key.startsWith('rock_large')) {
        body.setSize(spr.width * 0.8 * scale, spr.height * 0.4 * scale);
        body.setOffset(spr.width * 0.1, spr.height - spr.height * 0.5);
      } else if (key.startsWith('rock_small')) {
        body.setSize(spr.width * 0.7 * scale, spr.height * 0.4 * scale);
        body.setOffset(spr.width * 0.15, spr.height - spr.height * 0.55);
      } else if (key === 'lamp_post' || key === 'lantern') {
        body.setSize(10 * scale, 8 * scale);
        body.setOffset((spr.width / 2) - 5, spr.height - 10);
      } else if (key === 'well') {
        body.setSize(spr.width * 0.82 * scale, spr.height * 0.38 * scale);
        body.setOffset(spr.width * 0.09, spr.height - spr.height * 0.44);
      } else {
        body.setSize(spr.width * 0.75 * scale, spr.height * 0.28 * scale);
        body.setOffset(spr.width * 0.12, spr.height - spr.height * 0.32);
      }

      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, spr);
      this.scene.physics.add.collider(this.scene.companionSystem.gameObject, spr);
    }
    return spr;
  }

  private createWaterCollider(x: number, y: number, w: number, h: number): void {
    const zone = this.scene.add.zone(x, y, w, h);
    this.scene.physics.add.existing(zone, true);
    const body = zone.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(w, h);
    this.scene.physics.add.collider(this.scene.playerSystem.gameObject, zone);
    this.scene.physics.add.collider(this.scene.companionSystem.gameObject, zone);
  }

  // ──────────────────────────────────────────────────────────────────
  // OCEAN — animated water surrounding the island
  // ──────────────────────────────────────────────────────────────────
  private drawOcean(): void {
    this.scene.cameras.main.setBackgroundColor('#04111e');

    // Tiled ocean base
    const ocean = this.scene.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'ocean_tile');
    ocean.setOrigin(0, 0).setDepth(-2000);

    // Animated shimmer
    this.scene.tweens.add({
      targets: ocean,
      tilePositionX: 32, tilePositionY: 16,
      duration: 4000, repeat: -1, ease: 'Linear',
    });

    // Foam wave rings
    const foam = this.scene.add.graphics().setDepth(-1980);
    const drawFoam = (t: number) => {
      foam.clear();
      foam.lineStyle(3, 0xa0d8e8, 0.22);
      const steps = [0, 0.33, 0.66];
      for (const s of steps) {
        const phase = (t + s) % 1;
        const r = 30 + phase * 80;
        const alpha = (1 - phase) * 0.25;
        const pts: [number, number][] = [
          [OX - 60, OY - 60], [OX + 2520 + 60, OY - 60],
          [OX - 60, OY + 2520 + 60], [OX + 2520 + 60, OY + 2520 + 60],
        ];
        for (const [fx, fy] of pts) {
          foam.fillStyle(0xb8e8f8, alpha * 0.4);
          foam.fillCircle(fx, fy, r);
        }
      }
    };

    let waveTime = 0;
    this.scene.time.addEvent({
      delay: 60, loop: true,
      callback: () => { waveTime = (waveTime + 0.004) % 1; drawFoam(waveTime); },
    });
  }

  // ──────────────────────────────────────────────────────────────────
  // ISLAND GROUND — layered grass with zone tints
  // ──────────────────────────────────────────────────────────────────
  private drawIslandGround(): void {
    const grass = this.scene.add.tileSprite(OX, OY, 2520, 2520, 'grass_tile');
    grass.setOrigin(0, 0).setDepth(-1500);

    const cobble = this.scene.add.tileSprite(zoneX(1), zoneY(1), Z, Z, 'cobble_tile');
    cobble.setOrigin(0, 0).setDepth(-1480).setAlpha(0.6);

    const tints: [string, number][] = [
      ['cottage',       0x3a7028],
      ['secretGarden',  0x2a5820],
      ['observatory',   0x08081a],
      ['cherryGarden',  0x3a5020],
      ['greenhouse',    0x3a6828],
      ['centralPlaza',  0x6e6858],
      ['roseGarden',    0x305a28],
      ['maze',          0x202e18],
      ['crystalLake',   0x1e3828],
      ['forgottenChurch',0x302820],
    ];
    for (const [key, col] of tints) {
      const cfg = ZONE_MAP.get(key);
      if (!cfg) continue;
      const { x, y, w, h } = cfg.bounds;
      const r = this.scene.add.rectangle(x + w/2, y + h/2, w, h, col, 0.7);
      r.setDepth(-1490);
    }

    const dots = this.scene.add.graphics().setDepth(-1470);
    for (let i = 0; i < 2800; i++) {
      const gx = OX + 10 + this.rand() * 2500;
      const gy = OY + 10 + this.rand() * 2500;
      const bright = this.rand() < 0.5;
      dots.fillStyle(bright ? 0x4a9040 : 0x1e4818, this.rand() * 0.16 + 0.04);
      dots.fillRect(gx, gy, 2 + this.rand() * 3, 2 + this.rand() * 2);
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // BOUNDARY WALLS — stone walls around island perimeter with gate
  // ──────────────────────────────────────────────────────────────────
  private drawBoundaryWalls(): void {
    const wallGfx = this.scene.add.graphics().setDepth(-1400);
    const capGfx  = this.scene.add.graphics().setDepth(-1395);

    const iL = OX, iR = OX + 2520;
    const iT = OY, iB = OY + 2520;
    const w  = 28;
    const gate = 80;

    const wallColor = (gfx: Phaser.GameObjects.Graphics, rect: [number, number, number, number]) => {
      const [wx, wy, ww, wh] = rect;
      gfx.fillStyle(0x2a1e10, 1);
      gfx.fillRect(wx, wy, ww, wh);
      gfx.fillStyle(0x6a5038, 1);
      gfx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
      gfx.fillStyle(0x9a7a54, 1);
      gfx.fillRect(wx + 3, wy + 2, ww - 6, 3);
      gfx.fillStyle(0x3a2818, 0.55);
      for (let bx = wx + 2; bx < wx + ww - 4; bx += 24) gfx.fillRect(bx, wy + 2, 2, wh - 4);
      for (let by = wy + 2; by < wy + wh - 4; by += 12) gfx.fillRect(wx + 2, by, ww - 4, 2);
    };

    const southGateL = iL + (2520 / 2) - gate;
    const southGateR = iL + (2520 / 2) + gate;
    wallColor(wallGfx, [iL, iB - w, southGateL - iL, w]);
    wallColor(wallGfx, [southGateR, iB - w, iR - southGateR, w]);
    wallColor(wallGfx, [iL, iT, 2520, w]);
    wallColor(wallGfx, [iL, iT, w, 2520]);
    wallColor(wallGfx, [iR - w, iT, w, 2520]);

    const capRow = (gfx: Phaser.GameObjects.Graphics, cx: number, cy: number, cw: number) => {
      gfx.fillStyle(0x3d6a28, 1);
      gfx.fillRect(cx, cy - 4, cw, 5);
      gfx.fillStyle(0x52884a, 1);
      gfx.fillRect(cx, cy - 4, cw, 2);
    };
    capRow(capGfx, iL, iT + w, 2520);
    capRow(capGfx, iL, iB - w, southGateL - iL);
    capRow(capGfx, southGateR, iB - w, iR - southGateR);

    // Static physics colliders for boundaries
    const addWallCollider = (wx: number, wy: number, ww: number, wh: number) => {
      const img = this.scene.add.image(wx + ww/2, wy + wh/2, 'stone_wall_h');
      img.setDisplaySize(ww, wh).setAlpha(0).setDepth(-1390);
      this.scene.physics.add.existing(img, true);
      const body = img.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(ww, wh);
      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, img);
      this.scene.physics.add.collider(this.scene.companionSystem.gameObject, img);
    };
    addWallCollider(iL, iT, w, 2520);
    addWallCollider(iR - w, iT, w, 2520);
    addWallCollider(iL, iT, 2520, w);
    addWallCollider(iL, iB - w, southGateL - iL, w);
    addWallCollider(southGateR, iB - w, iR - southGateR, w);

    const drawPillar = (px: number) => {
      capGfx.fillStyle(0x3a2818, 1);
      capGfx.fillRect(px - 14, iB - 52, 28, 56);
      capGfx.fillStyle(0x7a5a38, 1);
      capGfx.fillRect(px - 12, iB - 50, 24, 52);
      capGfx.fillStyle(0xa08055, 1);
      capGfx.fillRect(px - 10, iB - 50, 20, 8);
      capGfx.fillStyle(0xb8a068, 1);
      capGfx.fillRect(px - 8, iB - 60, 16, 12);
    };
    drawPillar(southGateL);
    drawPillar(southGateR);

    const corners: [number, number][] = [[iL, iT], [iR, iT], [iL, iB], [iR, iB]];
    for (const [tx, ty] of corners) {
      capGfx.fillStyle(0x2a1e10, 1);
      capGfx.fillRect(tx - (tx === iL ? 0 : 40), ty - (ty === iT ? 0 : 40), 40, 40);
      capGfx.fillStyle(0x7a5a38, 1);
      capGfx.fillRect(tx - (tx === iL ? 0 : 38) + 2, ty - (ty === iT ? 0 : 38) + 2, 36, 36);
      capGfx.fillStyle(0x9a8055, 1);
      capGfx.fillRect(tx - (tx === iL ? 0 : 38) + 2, ty - (ty === iT ? 0 : 38) + 2, 36, 8);
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // TOWN PATHS — cobblestone road network
  // ──────────────────────────────────────────────────────────────────
  private drawTownPaths(): void {
    const g = this.scene.add.graphics().setDepth(-1350);

    const road = (pts: Phaser.Math.Vector2[], w = 36) => {
      const curve = new Phaser.Curves.Spline(pts);
      const samples = curve.getPoints(pts.length * 22);
      g.lineStyle(w + 10, 0x1a1208, 0.55);
      g.beginPath(); g.moveTo(samples[0].x, samples[0].y);
      samples.forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
      g.lineStyle(w, 0xb0956a, 0.96);
      g.beginPath(); g.moveTo(samples[0].x, samples[0].y);
      samples.forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
      g.lineStyle(w - 18, 0xc8aa80, 0.82);
      g.beginPath(); g.moveTo(samples[0].x, samples[0].y);
      samples.forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
      g.lineStyle(4, 0x8a7050, 0.38);
      g.beginPath(); g.moveTo(samples[0].x, samples[0].y);
      samples.forEach(p => g.lineTo(p.x, p.y)); g.strokePath();
    };

    const cx1 = zc(1), cx0 = zc(0), cx2 = zc(2);
    const cy0 = zr(0), cy1 = zr(1), cy2 = zr(2);

    road([new Phaser.Math.Vector2(cx0, OY+2520), new Phaser.Math.Vector2(cx0+12, cy2), new Phaser.Math.Vector2(cx0-8, cy1), new Phaser.Math.Vector2(cx0+10, cy0), new Phaser.Math.Vector2(cx0, OY+30)]);
    road([new Phaser.Math.Vector2(cx1, OY+2520-30), new Phaser.Math.Vector2(cx1+8, cy2), new Phaser.Math.Vector2(cx1-6, cy1), new Phaser.Math.Vector2(cx1+4, cy0), new Phaser.Math.Vector2(cx1, OY+30)]);
    road([new Phaser.Math.Vector2(cx2, OY+2520), new Phaser.Math.Vector2(cx2-10, cy2), new Phaser.Math.Vector2(cx2+8, cy1), new Phaser.Math.Vector2(cx2-6, cy0), new Phaser.Math.Vector2(cx2, OY+30)]);

    road([new Phaser.Math.Vector2(OX+30, cy0), new Phaser.Math.Vector2(cx0, cy0+15), new Phaser.Math.Vector2(cx1, cy0-10), new Phaser.Math.Vector2(cx2, cy0+12), new Phaser.Math.Vector2(OX+2490, cy0)]);
    road([new Phaser.Math.Vector2(OX+30, cy1), new Phaser.Math.Vector2(cx0, cy1+8), new Phaser.Math.Vector2(cx1, cy1-5), new Phaser.Math.Vector2(cx2, cy1+6), new Phaser.Math.Vector2(OX+2490, cy1)]);
    road([new Phaser.Math.Vector2(OX+30, cy2), new Phaser.Math.Vector2(cx0, cy2-8), new Phaser.Math.Vector2(cx1, cy2+6), new Phaser.Math.Vector2(cx2, cy2-4), new Phaser.Math.Vector2(OX+2490, cy2)]);

    road([new Phaser.Math.Vector2(cx1+400, cy0+150), new Phaser.Math.Vector2(cx2-80, cy0+200)], 24);
    road([new Phaser.Math.Vector2(cx1-400, cy1-100), new Phaser.Math.Vector2(cx0+80, cy1-160)], 24);

    const plazaG = this.scene.add.graphics().setDepth(-1345);
    plazaG.fillStyle(0xb0956a, 0.65);
    plazaG.fillCircle(cx1, cy1, 300);
    plazaG.fillStyle(0x9a8058, 0.35);
    plazaG.fillCircle(cx1, cy1, 280);
    plazaG.lineStyle(3, 0x786040, 0.55);
    for (let r = 60; r <= 290; r += 55) plazaG.strokeCircle(cx1, cy1, r);

    for (let i = 0; i < 500; i++) {
      const ax = OX + 20 + this.rand() * 2480;
      const ay = OY + 20 + this.rand() * 2480;
      if (this.rand() < 0.38) {
        g.fillStyle(0xb09070, 0.22 + this.rand() * 0.2);
        g.fillRect(ax, ay, 12 + this.rand() * 20, 8 + this.rand() * 14);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // TOWN BUILDINGS — shops, inn, church, bakery, market
  // ──────────────────────────────────────────────────────────────────
  private drawTownBuildings(): void {
    // ─ Main Street (East side of central plaza) ─
    this.placeBuilding('shop_bakery',  zoneX(2)+100, zoneY(1)+200, 1.0);
    this.placeBuilding('inn',          zoneX(2)+120, zoneY(1)+440, 1.0);
    this.placeBuilding('shop_market',  zoneX(2)+100, zoneY(1)+680, 1.0);

    // ─ West Street (Greenhouse zone) ─
    this.placeBuilding('house_stone',  zoneX(0)+120, zoneY(1)+400, 0.9);
    this.placeBuilding('house_stone',  zoneX(0)+120, zoneY(1)+620, 0.9);
    this.placeBuilding('house_cottage',zoneX(0)+660, zoneY(1)+700, 0.9);

    // ─ South town houses (Cottage zone neighbors) ─
    this.placeBuilding('house_cottage',zoneX(1)+100, zoneY(2)+620, 0.9);
    this.placeBuilding('house_stone',  zoneX(1)+660, zoneY(2)+200, 0.9);

    // ─ Church ─
    this.placeBuilding('church', zoneX(1)+100, zoneY(0)+220, 1.0);

    // ─ Well in central plaza ─
    this.createStaticObject(zc(1)+320, zr(1)+260, 'well', 1.0);
  }

  private placeBuilding(type: string, x: number, y: number, scale: number): void {
    const spr = this.createStaticObject(x, y, type, scale, true);
    // Custom body tuning for buildings
    const body = spr.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(spr.width * 0.8 * scale, spr.height * 0.3 * scale);
    body.setOffset(spr.width * 0.1, spr.height - spr.height * 0.35);
  }

  // ──────────────────────────────────────────────────────────────────
  // WATER FEATURES — Crystal Lake + Garden Ponds
  // ──────────────────────────────────────────────────────────────────
  private drawWaterFeatures(): void {
    const g = this.scene.add.graphics().setDepth(-1300);

    // Crystal Lake (SE zone)
    this.drawPond(g, zoneX(2)+420, zoneY(2)+395, 640, 380, false);
    
    // Add Crystal Lake water colliders (leaving a vertical corridor for the horizontal bridge)
    const clx = zoneX(2)+420; // 2240
    const cly = zoneY(2)+395; // 2235
    // Upper lake water collider (above the bridge)
    this.createWaterCollider(clx, cly - 105, 620, 150);
    // Lower lake water collider (below the bridge)
    this.createWaterCollider(clx, cly + 105, 620, 150);

    // Secret Garden pond (NW zone)
    this.drawPond(g, zc(0)+60, zr(0)+120, 280, 160, true);
    this.createWaterCollider(zc(0)+60, zr(0)+120, 260, 140);

    // Rose garden stream (E zone)
    this.drawPond(g, zc(2)-80, zr(1)+220, 200, 110, true);
    this.createWaterCollider(zc(2)-80, zr(1)+220, 180, 95);

    // Lily pads on lake
    for (let i = 0; i < 28; i++) {
      const lx = zoneX(2)+140 + this.rand() * 560;
      const ly = zoneY(2)+230 + this.rand() * 320;
      const lily = this.scene.add.sprite(lx, ly, this.rand() > 0.4 ? 'lily_pad' : 'flower_lily');
      lily.setScale(0.6 + this.rand() * 0.5).setDepth(ly - 4).setAlpha(0.9);
      this.scene.tweens.add({ targets: lily, y: ly + 5, duration: 1400 + this.rand()*1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // Animated ripples on lake
    const rippleG = this.scene.add.graphics().setDepth(-1295);
    let ripT = 0;
    this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        ripT = (ripT + 0.02) % (Math.PI * 2);
        rippleG.clear();
        rippleG.lineStyle(2, 0x60c0e0, 0.14);
        for (let r = 0; r < 4; r++) {
          const phase = (ripT + r * 0.8) % (Math.PI * 2);
          const rr = 20 + (phase / (Math.PI*2)) * 80;
          const alpha = (1 - rr/100) * 0.22;
          rippleG.fillStyle(0x40a0c8, alpha);
          rippleG.fillCircle(zc(2)-100, zoneY(2)+350, rr);
          rippleG.fillCircle(zc(2)+140, zoneY(2)+480, rr * 0.7);
        }
      },
    });
  }

  private drawPond(g: Phaser.GameObjects.Graphics, cx: number, cy: number, w: number, h: number, small: boolean): void {
    const ex = small ? 0.05 : 0;
    g.fillStyle(0x1a2e18, 1);
    g.fillEllipse(cx, cy, w + 22, h + 22);
    g.fillStyle(0x0c2338, 0.97);
    g.fillEllipse(cx, cy, w, h);
    g.fillStyle(0x1a5878, 0.82);
    g.fillEllipse(cx + w * ex, cy - h * 0.05, w * 0.78, h * 0.62);
    g.fillStyle(0x5ab0d0, 0.14);
    for (let i = 0; i < 8; i++) {
      g.fillEllipse(cx - w*0.3 + this.rand()*w*0.6, cy - h*0.2 + this.rand()*h*0.4, 50 + this.rand()*80, 3);
    }
    g.lineStyle(10, 0x1e2e18, 0.9);
    g.strokeEllipse(cx, cy, w, h);
    g.lineStyle(3, 0xa09060, 0.5);
    g.strokeEllipse(cx, cy, w + 14, h + 14);

    const sh = this.scene.add.graphics().setDepth(-1298);
    sh.fillStyle(0x60b8d8, 0.07);
    sh.fillEllipse(cx, cy, w * 0.68, h * 0.48);
    this.scene.tweens.add({ targets: sh, alpha: { from: 0.04, to: 0.18 }, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  // ──────────────────────────────────────────────────────────────────
  // HEDGE MAZE — solid collidable walls in SW zone
  // ──────────────────────────────────────────────────────────────────
  private drawMazeWalls(): void {
    const mx = zoneX(0) + 60, my = zoneY(2) + 60;
    const mW = Z - 120, mH = Z - 120;
    const cell = 84;

    const addHedge = (hx: number, hy: number, hw: number, hh: number) => {
      const g = this.scene.add.graphics().setDepth(hy + hh/2);
      g.fillStyle(0x1a3e18, 1);
      g.fillRect(hx, hy, hw, hh);
      g.fillStyle(0x2e6428, 1);
      g.fillRect(hx + 2, hy + 2, hw - 4, hh/2);
      g.fillStyle(0x3d8430, 1);
      g.fillRect(hx + 3, hy + 2, hw - 6, hh/3);
      g.fillStyle(0x52a045, 0.6);
      for (let dx = 4; dx < hw - 4; dx += 8) g.fillRect(hx + dx, hy + 2, 3, hh/4);
      if (this.rand() < 0.38) {
        g.fillStyle(this.rand() < 0.5 ? 0xf080b8 : 0xffffff, 0.8);
        g.fillCircle(hx + 4 + this.rand() * (hw - 8), hy + 3, 3);
      }
      // Physics body collision
      const img = this.scene.add.image(hx + hw/2, hy + hh/2, 'grass_tile').setAlpha(0).setDisplaySize(hw, hh);
      this.scene.physics.add.existing(img, true);
      this.scene.physics.add.collider(this.scene.playerSystem.gameObject, img);
      this.scene.physics.add.collider(this.scene.companionSystem.gameObject, img);
    };

    const entryX = mx + mW/2 - cell/2;
    const exitX  = mx + mW/2 - cell/2;
    addHedge(mx, my + mH - cell, entryX - mx, cell);
    addHedge(entryX + cell, my + mH - cell, mx + mW - entryX - cell, cell);
    addHedge(mx, my, exitX - mx, cell);
    addHedge(exitX + cell, my, mx + mW - exitX - cell, cell);
    addHedge(mx, my, cell, mH);
    addHedge(mx + mW - cell, my, cell, mH);

    const walls: [number, number, number, number][] = [
      [mx + cell, my + cell, cell*2, cell],
      [mx + cell*3, my + cell*2, cell, cell*2],
      [mx + cell, my + cell*3, cell*3, cell],
      [mx + cell*4, my + cell, cell, cell*3],
      [mx + cell*2, my + cell*4, cell*2, cell],
      [mx + cell*5, my + cell*3, cell*2, cell],
      [mx + cell*6, my + cell*2, cell, cell*2],
      [mx + cell*3, my + cell*5, cell*3, cell],
      [mx + cell*4, my + cell*6, cell, cell],
    ];
    for (const [hx, hy, hw, hh] of walls) {
      if (hx + hw <= mx + mW && hy + hh <= my + mH) addHedge(hx, hy, hw, hh);
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // PATH AVENUES — structured trees & lampposts alongside paths
  // ──────────────────────────────────────────────────────────────────
  private decoratePathAvenues(): void {
    const cx1 = zc(1), cx0 = zc(0), cx2 = zc(2);
    const cy0 = zr(0), cy1 = zr(1), cy2 = zr(2);

    const paths = [
      { type: 'v', coord: cx0 },
      { type: 'v', coord: cx1 },
      { type: 'v', coord: cx2 },
      { type: 'h', coord: cy0 },
      { type: 'h', coord: cy1 },
      { type: 'h', coord: cy2 },
    ];

    for (const p of paths) {
      const step = 140; // spacing between props along paths
      const start = OX + 100;
      const end = OX + 2520 - 100;

      for (let pos = start; pos <= end; pos += step) {
        if (p.type === 'v') {
          const py = pos;
          const pxLeft = p.coord - 50;
          const pxRight = p.coord + 50;
          // Left avenue tree/lamp
          if (!this.isPositionBlocked(pxLeft, py, 25)) {
            const key = this.rand() < 0.85 ? 'tree_oak' : 'lamp_post';
            this.createStaticObject(pxLeft, py, key, key === 'lamp_post' ? 1.0 : 0.85);
            this.blockedCircles.push({ cx: pxLeft, cy: py, r: 25 });
          }
          // Right avenue tree/lamp
          if (!this.isPositionBlocked(pxRight, py, 25)) {
            const key = this.rand() < 0.85 ? 'tree_oak' : 'lamp_post';
            this.createStaticObject(pxRight, py, key, key === 'lamp_post' ? 1.0 : 0.85);
            this.blockedCircles.push({ cx: pxRight, cy: py, r: 25 });
          }
        } else {
          const px = pos;
          const pyTop = p.coord - 50;
          const pyBottom = p.coord + 50;
          // Top avenue tree/lamp
          if (!this.isPositionBlocked(px, pyTop, 25)) {
            const key = this.rand() < 0.85 ? 'tree_cherry' : 'lamp_post';
            this.createStaticObject(px, pyTop, key, key === 'lamp_post' ? 1.0 : 0.85);
            this.blockedCircles.push({ cx: px, cy: pyTop, r: 25 });
          }
          // Bottom avenue tree/lamp
          if (!this.isPositionBlocked(px, pyBottom, 25)) {
            const key = this.rand() < 0.85 ? 'tree_cherry' : 'lamp_post';
            this.createStaticObject(px, pyBottom, key, key === 'lamp_post' ? 1.0 : 0.85);
            this.blockedCircles.push({ cx: px, cy: pyBottom, r: 25 });
          }
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // DENSE FLORA — dense JRPG flower beds, forests & wild vegetation
  // ──────────────────────────────────────────────────────────────────
  private drawDenseFlora(): void {
    const flowerSets: Record<string, string[]> = {
      cottage:       ['flower_rose', 'flower_tulip', 'flower_daisy', 'flower_wild'],
      secretGarden:  ['flower_cherry', 'flower_lavender', 'flower_lily', 'flower_wild'],
      observatory:   ['flower_cherry', 'flower_lily', 'flower_lavender'],
      cherryGarden:  ['flower_cherry', 'flower_cherry', 'flower_lavender'],
      greenhouse:    ['flower_sunflower', 'flower_daisy', 'flower_tulip'],
      centralPlaza:  ['flower_rose', 'flower_tulip', 'flower_daisy'],
      roseGarden:    ['flower_rose', 'flower_rose', 'flower_tulip', 'flower_lily'],
      maze:          ['flower_wild', 'flower_lavender'],
      crystalLake:   ['flower_lily', 'flower_wild'],
      forgottenChurch:['flower_lavender', 'flower_wild'],
    };
    const treeSets: Record<string, string[]> = {
      cottage:       ['tree_cherry', 'tree_oak', 'tree_apple'],
      secretGarden:  ['tree_cherry', 'tree_willow'],
      observatory:   ['tree_big_cherry', 'tree_cherry'],
      cherryGarden:  ['tree_cherry', 'tree_big_cherry'],
      greenhouse:    ['tree_oak', 'tree_pine', 'tree_apple'],
      centralPlaza:  ['tree_cherry', 'tree_oak'],
      roseGarden:    ['tree_cherry', 'tree_oak'],
      maze:          ['tree_oak', 'tree_pine'],
      crystalLake:   ['tree_willow'],
      forgottenChurch:['tree_cherry', 'tree_oak'],
    };

    for (const zone of ISLAND_ZONES) {
      if (zone.key === 'forgottenChurch') continue;
      const { x, y, w, h } = zone.bounds;
      const flowers = flowerSets[zone.key] ?? ['flower_daisy'];
      const trees   = treeSets[zone.key]   ?? ['tree_oak'];

      // Flower carpet (dense filling)
      const fDensity = zone.key === 'crystalLake' ? 40 : 120;
      for (let i = 0; i < fDensity; i++) {
        let fx = 0, fy = 0, ok = false;
        for (let att = 0; att < 5; att++) {
          fx = x + 30 + this.rand() * (w - 60);
          fy = y + 30 + this.rand() * (h - 60);
          if (!this.isPositionBlocked(fx, fy, 10)) { ok = true; break; }
        }
        if (!ok) continue;

        const key = flowers[Math.floor(this.rand() * flowers.length)];
        const spr = this.scene.add.sprite(fx, fy, key);
        spr.setScale(0.42 + this.rand() * 0.65).setDepth(fy - 4).setAlpha(0.72 + this.rand() * 0.24);
        spr.setRotation((this.rand() - 0.5) * 0.3);
        this.scene.tweens.add({ targets: spr, angle: spr.angle + (this.rand() < 0.5 ? -1.4 : 1.4),
          duration: 1400 + this.rand()*2800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }

      // Edge forest & bushes (collidable tree fills)
      const tDensity = 32;
      for (let i = 0; i < tDensity; i++) {
        let bx = 0, by = 0, ok = false;
        for (let att = 0; att < 5; att++) {
          bx = x + 30 + this.rand() * (w - 60);
          by = y + 30 + this.rand() * (h - 60);
          if (!this.isPositionBlocked(bx, by, 32)) { ok = true; break; }
        }
        if (!ok) continue;

        const key = this.rand() < 0.65 ? 'bush' : trees[Math.floor(this.rand() * trees.length)];
        const isBush = key === 'bush';
        const s = isBush ? 0.65 + this.rand() * 0.45 : 0.68 + this.rand() * 0.35;
        
        // Bushes don't collide, trees do!
        this.createStaticObject(bx, by, key, s, !isBush);
        this.blockedCircles.push({ cx: bx, cy: by, r: isBush ? 18 : 28 });
      }

      // Rocks (collidable)
      for (let i = 0; i < 8; i++) {
        let rx = 0, ry = 0, ok = false;
        for (let att = 0; att < 5; att++) {
          rx = x + 30 + this.rand() * (w - 60);
          ry = y + 30 + this.rand() * (h - 60);
          if (!this.isPositionBlocked(rx, ry, 22)) { ok = true; break; }
        }
        if (!ok) continue;

        const isLarge = this.rand() < 0.6;
        const key = isLarge ? 'rock_large' : 'rock_small';
        this.createStaticObject(rx, ry, key, 0.65 + this.rand() * 0.5, true);
        this.blockedCircles.push({ cx: rx, cy: ry, r: isLarge ? 20 : 12 });
      }

      // Tall grass patches
      for (let i = 0; i < 20; i++) {
        let gx = 0, gy = 0, ok = false;
        for (let att = 0; att < 5; att++) {
          gx = x + 30 + this.rand() * (w - 60);
          gy = y + 30 + this.rand() * (h - 60);
          if (!this.isPositionBlocked(gx, gy, 12)) { ok = true; break; }
        }
        if (!ok) continue;

        const tg = this.scene.add.sprite(gx, gy, 'tall_grass');
        tg.setScale(0.55 + this.rand() * 0.5).setDepth(gy - 2).setAlpha(0.7 + this.rand() * 0.25);
        this.scene.tweens.add({ targets: tg, scaleX: tg.scaleX * (0.94 + this.rand()*0.12),
          duration: 600 + this.rand()*1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }

    // Dense perimeter tree line inside boundary walls
    for (let i = 0; i < 180; i++) {
      const side = i % 4;
      const t = this.rand();
      let px2 = 0, py2 = 0;
      if      (side === 0) { px2 = OX + 30 + t * 2460; py2 = OY + 50; }
      else if (side === 1) { px2 = OX + 30 + t * 2460; py2 = OY + 2470; }
      else if (side === 2) { px2 = OX + 50; py2 = OY + 30 + t * 2460; }
      else                 { px2 = OX + 2470; py2 = OY + 30 + t * 2460; }

      // Skip near the southern main gate entrance
      if (side === 1 && Math.abs(px2 - (OX + 1260)) < 160) continue;

      if (!this.isPositionBlocked(px2, py2, 28)) {
        const treeKeys = ['tree_oak', 'tree_pine', 'tree_cherry'];
        const key = treeKeys[Math.floor(this.rand() * treeKeys.length)];
        this.createStaticObject(px2, py2, key, 0.75 + this.rand() * 0.45, true);
        this.blockedCircles.push({ cx: px2, cy: py2, r: 28 });
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // ZONE OBJECTS — data-driven placements from config
  // ──────────────────────────────────────────────────────────────────
  private placeZoneObjects(): void {
    let id = 0;
    for (const zone of ISLAND_ZONES) {
      for (const obj of zone.objects) {
        // Skip paths / buildings we manually placed in new routines
        if (obj.type === 'shop_bakery' || obj.type === 'inn' || obj.type === 'shop_market' ||
            obj.type === 'house_stone' || obj.type === 'house_cottage' || obj.type === 'church') {
          continue;
        }

        const spr = this.scene.add.sprite(obj.x, obj.y, obj.type);
        spr.setScale(obj.scale ?? 1);
        spr.setDepth(obj.depth ?? obj.y);
        spr.setOrigin(0.5, 0.84);
        if (obj.alpha != null) spr.setAlpha(obj.alpha);
        if (obj.flipX) spr.setFlipX(true);
        if (obj.id) (spr as any).id = obj.id;

        if (obj.collides) {
          this.scene.physics.add.existing(spr, true);
          const body = spr.body as Phaser.Physics.Arcade.StaticBody;
          if (obj.type === 'bench') {
            body.setSize(spr.width * 0.9 * (obj.scale ?? 1), 12 * (obj.scale ?? 1));
            body.setOffset(spr.width * 0.05, spr.height - 14);
          } else {
            body.setSize(spr.width * 0.6 * (obj.scale ?? 1), spr.height * 0.25 * (obj.scale ?? 1));
            body.setOffset(spr.width * 0.2, spr.height * 0.72);
          }
          this.scene.physics.add.collider(this.scene.playerSystem.gameObject, spr);
          this.scene.physics.add.collider(this.scene.companionSystem.gameObject, spr);
        }

        if (obj.interactive) {
          this.scene.interactionSystem.registerInteractable({
            id: obj.id ?? `${zone.key}_${obj.type}_${id}`,
            x: obj.x, y: obj.y,
            type: obj.interactionType ?? obj.type,
            dialogueId: obj.dialogueId,
            sprite: spr,
          });
        }
        
        // Add to blocked circles so flora does not overlap
        this.blockedCircles.push({ cx: obj.x, cy: obj.y, r: 25 * (obj.scale ?? 1) });
        id++;
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // ANIMALS — wandering cats, dogs, birds around the town
  // ──────────────────────────────────────────────────────────────────
  private spawnAnimals(): void {
    const catSpawns: [string, number, number][] = [
      ['cat_orange', zc(1)+180, zr(2)+300],
      ['cat_gray',   zc(1)-180, zr(2)+350],
      ['cat_black',  zc(0)+500, zr(1)+280],
      ['cat_white',  zc(2)-200, zr(1)+380],
      ['cat_orange', zc(1)+350, zr(1)-200],
      ['cat_gray',   zc(0)+320, zr(2)+420],
      ['cat_black',  zc(2)+280, zr(2)+600],
    ];
    for (const [key, cx, cy] of catSpawns) {
      this.spawnWanderingAnimal(key, cx, cy, 0.65, 60, 40);
    }

    const dogSpawns: [string, number, number][] = [
      ['dog_brown',  zc(1)+400, zr(1)+200],
      ['dog_golden', zc(2)-100, zr(1)+300],
      ['dog_brown',  zc(1)-300, zr(2)+200],
    ];
    for (const [key, dx, dy] of dogSpawns) {
      this.spawnWanderingAnimal(key, dx, dy, 0.7, 100, 60);
    }

    const birdSpawns: [string, number, number][] = [
      ['bird_red',  zc(1)-80, zr(1)-200],
      ['bird_blue', zc(1)+80, zr(1)-200],
      ['bird_red',  zc(1)+240, zr(1)+80],
      ['bird_blue', zc(0)+400, zr(0)+600],
      ['bird_red',  zc(2)-300, zr(2)+700],
    ];
    for (const [key, bx, by] of birdSpawns) {
      this.spawnHoppingBird(key, bx, by);
    }

    this.spawnHoppingBird('bunny', zc(1)-200, zr(2)+280);
    this.spawnHoppingBird('bunny', zc(1)+220, zr(2)+380);

    this.spawnWanderingAnimal('chicken', zc(0)+280, zr(1)+380, 0.6, 60, 30);
    this.spawnWanderingAnimal('duck',    zc(0)+180, zr(1)+500, 0.65, 50, 30);
  }

  private spawnWanderingAnimal(key: string, startX: number, startY: number, scale: number, rangeX: number, rangeY: number): void {
    if (!this.scene.textures.exists(key)) return;
    const spr = this.scene.add.sprite(startX, startY, key);
    spr.setScale(scale).setDepth(startY).setOrigin(0.5, 0.84);

    const wander = () => {
      const nx = startX + (this.rand() * 2 - 1) * rangeX;
      const ny = startY + (this.rand() * 2 - 1) * rangeY;
      const dur = 1200 + this.rand() * 2400;
      if (nx < startX) spr.setFlipX(true); else spr.setFlipX(false);
      this.scene.tweens.add({
        targets: spr, x: nx, y: ny, duration: dur,
        ease: 'Sine.easeInOut',
        onUpdate: () => spr.setDepth(spr.y),
        onComplete: () => this.scene.time.delayedCall(600 + this.rand() * 1200, wander),
      });
    };
    this.scene.time.delayedCall(this.rand() * 2000, wander);

    this.scene.tweens.add({
      targets: spr, y: spr.y - 3,
      duration: 400 + this.rand() * 300,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  private spawnHoppingBird(key: string, startX: number, startY: number): void {
    if (!this.scene.textures.exists(key)) return;
    const spr = this.scene.add.sprite(startX, startY, key);
    spr.setScale(0.55).setDepth(startY).setOrigin(0.5, 0.84);

    const hop = () => {
      const nx = startX + (this.rand() * 2 - 1) * 80;
      const ny = startY + (this.rand() * 2 - 1) * 50;
      if (nx < spr.x) spr.setFlipX(true); else spr.setFlipX(false);
      this.scene.tweens.add({
        targets: spr, x: nx, y: ny - 8, duration: 180,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.scene.tweens.add({
            targets: spr, y: ny, duration: 120, ease: 'Bounce.easeOut',
            onComplete: () => this.scene.time.delayedCall(400 + this.rand() * 1400, hop),
          });
        },
      });
    };
    this.scene.time.delayedCall(this.rand() * 1800, hop);
  }

  // ──────────────────────────────────────────────────────────────────
  // NYNI FLOWER MESSAGE — sunflower letters at central plaza
  // ──────────────────────────────────────────────────────────────────
  private drawNYNIMessage(): void {
    const cx = zc(1) - 120, cy = zr(1) + 340;

    for (let i = 0; i < 48; i++) {
      const t = (i / 48) * Math.PI * 2;
      const rx = 16 * Math.pow(Math.sin(t), 3);
      const ry = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      const hx = cx + rx * 5.5 + 120;
      const hy = cy + ry * 4.5;
      const spr = this.scene.add.sprite(hx, hy, 'flower_cherry');
      spr.setScale(0.9 + this.rand() * 0.3).setDepth(hy);
      this.scene.tweens.add({ targets: spr, angle: (this.rand()-0.5)*20,
        duration: 1600+this.rand()*2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const letters: number[][][] = [
      // N
      [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,3],[4,0],[4,1],[4,2],[4,3],[4,4]],
      // Y
      [[0,0],[1,1],[2,2],[3,2],[4,2],[0,4],[1,3]],
      // N
      [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,3],[4,0],[4,1],[4,2],[4,3],[4,4]],
      // I
      [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
    ];

    let lx = cx - 120;
    for (const letter of letters) {
      for (const [col, row] of letter) {
        const fx = lx + col * 14;
        const fy = cy + row * 14;
        const spr = this.scene.add.sprite(fx, fy, 'flower_sunflower');
        spr.setScale(1.05).setDepth(fy);
        this.scene.tweens.add({ targets: spr, scaleX: 1.1, scaleY: 1.1,
          duration: 800+this.rand()*1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      lx += 80;
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // ATMOSPHERE — depth layers, vignette, fog, parallax
  // ──────────────────────────────────────────────────────────────────
  private drawAtmosphere(): void {
    const cam = this.scene.cameras.main;

    const vig = this.scene.add.graphics().setScrollFactor(0).setDepth(95000);
    vig.fillStyle(0x000000, 0.08);
    vig.fillRect(0, 0, cam.width, cam.height);
    const corners: [number, number, number, number][] = [
      [0,0,200,150], [cam.width-200,0,200,150],
      [0,cam.height-150,200,150], [cam.width-200,cam.height-150,200,150],
    ];
    for (const [vx, vy, vw, vh] of corners) {
      vig.fillStyle(0x000000, 0.22);
      vig.fillRect(vx, vy, vw, vh);
    }

    const fog = this.scene.add.graphics().setScrollFactor(0.3).setDepth(90000);
    fog.fillStyle(0xe8f4e0, 0.025);
    for (let i = 0; i < 10; i++) fog.fillEllipse(100 + i * 130, 100 + (i%3)*80, 320, 55);
    this.scene.tweens.add({ targets: fog, x: 80, alpha: 0.7, duration: 14000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const farTrees = this.scene.add.graphics().setScrollFactor(0.22).setDepth(-1900);
    farTrees.fillStyle(0x050e0a, 0.5);
    for (let i = 0; i < 32; i++) {
      const tx = 50 + i * 90;
      const ty = 60 + Math.sin(i * 0.72) * 22;
      farTrees.fillEllipse(tx, ty, 120, 65);
    }

    const shadowG = this.scene.add.graphics().setDepth(-1460);
    const rowBoundaries = [zoneY(1), zoneY(2)];
    for (const ry of rowBoundaries) {
      shadowG.fillStyle(0x080804, 0.38);
      for (let sx = OX; sx < OX + 2520; sx += 30) {
        const oy = Math.sin(sx * 0.02) * 5;
        shadowG.fillRect(sx, ry + oy, 26, 18);
      }
      shadowG.lineStyle(3, 0x6a5538, 0.42);
      shadowG.lineBetween(OX, ry, OX + 2520, ry);
      shadowG.lineStyle(4, 0x3a6028, 0.38);
      shadowG.lineBetween(OX, ry - 2, OX + 2520, ry - 2);
    }
  }

  // ── Seeded random ─────────────────────────────────────────────────
  private rand(): number {
    this.rng = (this.rng * 1664525 + 1013904223) >>> 0;
    return this.rng / 0xffffffff;
  }
}

// ─── Re-exports for backward compat ───────────────────────────────────────────
export { ISLAND_ZONES as WORLD_OBJECTS };
export type { AreaConfig as AreaConfigType };
