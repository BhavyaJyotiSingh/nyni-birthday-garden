// ============================================================
// Game Constants — HD-2D Island Town, 2800×2800 world
// ============================================================

export const GAME_WIDTH  = 1280;
export const GAME_HEIGHT = 720;

export const TILE_SIZE = 16; // 16-bit native tile unit

// Island world — square map with ocean boundary
export const WORLD_WIDTH  = 2800;
export const WORLD_HEIGHT = 2800;

// Player — crisp 8-bit settings
export const PLAYER_SPEED  = 110;
export const PLAYER_ACCEL  = 550;
export const PLAYER_DECEL  = 400;
export const PLAYER_SPRITE_W = 16;
export const PLAYER_SPRITE_H = 24;
export const PLAYER_SCALE  = 2;  // Renders to crisp 8-bit scale

// Flower system
export const FLOWER_CELL_SIZE           = 22;
export const FLOWERS_PER_CLUSTER_MIN    = 3;
export const FLOWERS_PER_CLUSTER_MAX    = 7;
export const FLOWER_BLOOM_DURATION      = 550;
export const FLOWER_SWAY_DURATION       = 2000;
export const MAX_ACTIVE_FLOWERS         = 700;

// Butterflies
export const MAX_BUTTERFLIES       = 18;
export const BUTTERFLY_VISUAL_RANGE = 130;
export const BUTTERFLY_SPEED       = 38;
export const BUTTERFLY_FLUTTER_FREQ = 4;

// Camera
export const CAMERA_LERP       = 0.07;
export const CAMERA_DEADZONE_W = 50;
export const CAMERA_DEADZONE_H = 35;

// Day/night cycle
export const DAY_CYCLE_DURATION = 17.5 * 60 * 1000;

// Interaction
export const INTERACT_RANGE = 46;

// Dialogue
export const DIALOGUE_CHARS_PER_SEC = 35;
export const DIALOGUE_BOX_WIDTH     = 520;
export const DIALOGUE_BOX_HEIGHT    = 160;

// ── HD-2D Color Palette (warm garden + refmap tones) ──────────────────────
export const COLORS = {
  grass1: 0x3d7a30, grass2: 0x345e26, grass3: 0x4d9640, grass4: 0x2a5020,

  flowerPink:     0xf060a0, flowerRed:      0xe02850,
  flowerYellow:   0xf8c830, flowerWhite:    0xf8f0e8,
  flowerPurple:   0xa060d8, flowerBlue:     0x5090e0,
  flowerOrange:   0xf07830, flowerLavender: 0xb890d8,

  cherryLight: 0xffbcd4, cherryMed: 0xf080b8, cherryDark: 0xd04888,
  cherryBark:  0x3c2010,

  waterDeep: 0x0c2038, waterMid: 0x184870, waterLight: 0x50a0c8,
  waterFoam: 0xa8d8e8,

  stone1: 0xb8a880, stone2: 0xc8b890, stone3: 0xa09870, stoneDark: 0x685848,

  woodLight: 0xc09060, woodMed: 0x9a7040, woodDark: 0x6a4828,

  skyMorning: 0x87ceeb, skyAfternoon: 0x6bb3d9, skyGolden: 0xf5c06a,
  skySunset: 0xe8789a, skyNight: 0x080820,

  lanternGlow: 0xffcc44, fireflyGlow: 0xbbff55,
  sunlightGold: 0xfff2cc, moonlight: 0xb8c8f0,

  uiBg: 0x12082a, uiBgAlpha: 0.88, uiText: 0xf0e8d8,
  uiAccent: 0xf0a0c0, uiBorder: 0x503878,

  // Island boundary ocean
  oceanDeep: 0x061828, oceanMid: 0x0a3050, oceanLight: 0x1a6090,
  cliffTop:  0x604830, cliffFace: 0x402e18, cliffEdge: 0x7a6040,
} as const;

// Time of day phases
export const TIME_PHASES = {
  morning:    { start: 0.00, end: 0.25, tint: 0xe8e8ff, alpha: 0.05 },
  afternoon:  { start: 0.25, end: 0.45, tint: 0xfffff0, alpha: 0.00 },
  goldenHour: { start: 0.45, end: 0.60, tint: 0xffd080, alpha: 0.12 },
  sunset:     { start: 0.60, end: 0.75, tint: 0xff9080, alpha: 0.18 },
  night:      { start: 0.75, end: 1.00, tint: 0x2233aa, alpha: 0.45 },
} as const;

// ── Area definitions — 3×3 grid on 2800×2800 island ──────────────────────
// Island footprint: x=140 to 2660, y=140 to 2660 (2520×2520)
// Each zone: 840×840px
export const AREAS = {
  cottage: {
    name: 'Cottage Garden',
    x: 1820, y: 1960, width: 840, height: 840,
    music: 'gentle',
  },
  secretGarden: {
    name: 'Secret Garden',
    x: 140, y: 160, width: 840, height: 840,
    music: 'peaceful',
  },
  roseGarden: {
    name: 'Rose Garden',
    x: 140, y: 1960, width: 840, height: 840,
    music: 'dreamy',
  },
  crystalLake: {
    name: 'Crystal Lake',
    x: 1820, y: 980, width: 840, height: 840,
    music: 'serene',
  },
  greenhouse: {
    name: 'Greenhouse',
    x: 980, y: 1960, width: 840, height: 840,
    music: 'mystical',
  },
  centralPlaza: {
    name: 'Central Plaza',
    x: 980, y: 980, width: 840, height: 840,
    music: 'warm',
  },
  maze: {
    name: 'Hedge Maze',
    x: 140, y: 980, width: 840, height: 840,
    music: 'mystical',
  },
  cherryGarden: {
    name: 'Cherry Blossom Hill',
    x: 980, y: 160, width: 840, height: 840,
    music: 'peaceful',
  },
  forgottenChurch: {
    name: 'Forgotten Shrine',
    x: 140, y: 160, width: 2520, height: 820,
    music: 'serene',
  },
  observatory: {
    name: 'The Observatory',
    x: 1820, y: 160, width: 840, height: 840,
    music: 'celebration',
  },
} as const;

export type AreaKey = keyof typeof AREAS;

export const FLOWER_TYPES = [
  'rose', 'tulip', 'daisy', 'sunflower',
  'lily', 'cherry_blossom', 'lavender', 'wildflower',
] as const;

export const FLOWER_COLORS = [
  COLORS.flowerPink, COLORS.flowerRed,    COLORS.flowerYellow,
  COLORS.flowerWhite, COLORS.flowerPurple, COLORS.flowerBlue,
  COLORS.flowerOrange, COLORS.flowerLavender,
] as const;
