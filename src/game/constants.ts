// ============================================================
// Game Constants — All magic numbers, palettes, and config
// ============================================================

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const TILE_SIZE = 32;

// World dimensions (in pixels) — seamless connected world
export const WORLD_WIDTH = 4800;
export const WORLD_HEIGHT = 6400;

// Player
export const PLAYER_SPEED = 120;
export const PLAYER_ACCEL = 600;
export const PLAYER_DECEL = 400;
export const PLAYER_SPRITE_W = 16;
export const PLAYER_SPRITE_H = 24;
export const PLAYER_SCALE = 2;

// Flower system
export const FLOWER_CELL_SIZE = 28;
export const FLOWERS_PER_CLUSTER_MIN = 3;
export const FLOWERS_PER_CLUSTER_MAX = 6;
export const FLOWER_BLOOM_DURATION = 600;
export const FLOWER_SWAY_DURATION = 2000;
export const MAX_ACTIVE_FLOWERS = 800;

// Butterflies
export const MAX_BUTTERFLIES = 20;
export const BUTTERFLY_VISUAL_RANGE = 150;
export const BUTTERFLY_SPEED = 40;
export const BUTTERFLY_FLUTTER_FREQ = 4;

// Camera
export const CAMERA_LERP = 0.08;
export const CAMERA_DEADZONE_W = 60;
export const CAMERA_DEADZONE_H = 40;

// Day/night cycle — total game ~15-20 min
export const DAY_CYCLE_DURATION = 17.5 * 60 * 1000; // ms

// Interaction
export const INTERACT_RANGE = 48;

// Dialogue
export const DIALOGUE_CHARS_PER_SEC = 35;
export const DIALOGUE_BOX_WIDTH = 520;
export const DIALOGUE_BOX_HEIGHT = 160;

// Colors — carefully curated HD-2D palette
export const COLORS = {
  // Grass
  grass1: 0x4a8c3f,
  grass2: 0x3d7a35,
  grass3: 0x5a9e4a,
  grass4: 0x67ab55,

  // Flowers
  flowerPink: 0xf2a0b5,
  flowerRed: 0xe85577,
  flowerYellow: 0xf5d76e,
  flowerWhite: 0xf0eee4,
  flowerPurple: 0xb07ce8,
  flowerBlue: 0x7eb8e0,
  flowerOrange: 0xf0a050,
  flowerLavender: 0xc5a3d9,

  // Cherry blossom
  cherryLight: 0xffb7c5,
  cherryMed: 0xf48fb1,
  cherryDark: 0xe06090,
  cherryBark: 0x5a3a28,

  // Water
  waterDeep: 0x2a6496,
  waterMid: 0x3d8eb9,
  waterLight: 0x7ec8e3,
  waterFoam: 0xc5e8f0,

  // Stone
  stone1: 0x8a8a7a,
  stone2: 0x9a9a8a,
  stone3: 0x7a7a6a,

  // Wood
  woodLight: 0xa0805a,
  woodMed: 0x8a6a45,
  woodDark: 0x6a4a2a,

  // Sky / atmosphere
  skyMorning: 0x87ceeb,
  skyAfternoon: 0x6bb3d9,
  skyGolden: 0xf5c06a,
  skySunset: 0xe8789a,
  skyNight: 0x0a0a2e,

  // Lighting
  lanternGlow: 0xffcc44,
  fireflyGlow: 0xccff66,
  sunlightGold: 0xfff2cc,
  moonlight: 0xb8c8e8,

  // UI
  uiBg: 0x1a0a2e,
  uiBgAlpha: 0.85,
  uiText: 0xf0e8d8,
  uiAccent: 0xf2a0b5,
  uiBorder: 0x483868,
} as const;

// Time of day phases (as percentage of DAY_CYCLE_DURATION)
export const TIME_PHASES = {
  morning:    { start: 0.00, end: 0.25, tint: 0xe8e8ff, alpha: 0.05 },
  afternoon:  { start: 0.25, end: 0.45, tint: 0xfffff0, alpha: 0.0  },
  goldenHour: { start: 0.45, end: 0.60, tint: 0xffd080, alpha: 0.12 },
  sunset:     { start: 0.60, end: 0.75, tint: 0xff8888, alpha: 0.18 },
  night:      { start: 0.75, end: 1.00, tint: 0x2233aa, alpha: 0.45 },
} as const;

// Area definitions
export const AREAS = {
  cottage: {
    name: 'Cottage',
    x: 1000, y: 5400,
    width: 1400, height: 1000,
    music: 'gentle',
  },
  secretGarden: {
    name: 'Secret Garden',
    x: 2400, y: 5400,
    width: 1400, height: 1000,
    music: 'peaceful',
  },
  roseGarden: {
    name: 'Rose Garden',
    x: 1000, y: 4400,
    width: 1400, height: 1000,
    music: 'dreamy',
  },
  crystalLake: {
    name: 'Crystal Lake',
    x: 2400, y: 4400,
    width: 1400, height: 1000,
    music: 'serene',
  },
  greenhouse: {
    name: 'Greenhouse',
    x: 1000, y: 3400,
    width: 1400, height: 1000,
    music: 'mystical',
  },
  centralPlaza: {
    name: 'Central Plaza',
    x: 2400, y: 3400,
    width: 1400, height: 1000,
    music: 'warm',
  },
  maze: {
    name: 'Maze',
    x: 1000, y: 2200,
    width: 1400, height: 1200,
    music: 'mystical',
  },
  cherryGarden: {
    name: 'Cherry Garden',
    x: 2400, y: 2200,
    width: 1400, height: 1200,
    music: 'peaceful',
  },
  forgottenChurch: {
    name: 'Forgotten Church',
    x: 1400, y: 1000,
    width: 2000, height: 1200,
    music: 'serene',
  },
  observatory: {
    name: 'Observatory',
    x: 1700, y: 0,
    width: 1400, height: 1000,
    music: 'celebration',
  },
} as const;

export type AreaKey = keyof typeof AREAS;

// Flower types
export const FLOWER_TYPES = [
  'rose', 'tulip', 'daisy', 'sunflower',
  'lily', 'cherry_blossom', 'lavender', 'wildflower',
] as const;

export const FLOWER_COLORS = [
  COLORS.flowerPink, COLORS.flowerRed, COLORS.flowerYellow,
  COLORS.flowerWhite, COLORS.flowerPurple, COLORS.flowerBlue,
  COLORS.flowerOrange, COLORS.flowerLavender,
] as const;
