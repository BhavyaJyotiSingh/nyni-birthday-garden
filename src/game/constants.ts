// ============================================================
// Game Constants — All magic numbers, palettes, and config
// ============================================================

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const TILE_SIZE = 16; // Native 16-bit tile unit

// World dimensions (in pixels) — intimate garden world (scaled down from old 4800×6400)
export const WORLD_WIDTH = 3200;
export const WORLD_HEIGHT = 4000;

// Player
export const PLAYER_SPEED = 100;
export const PLAYER_ACCEL = 500;
export const PLAYER_DECEL = 350;
export const PLAYER_SPRITE_W = 16;
export const PLAYER_SPRITE_H = 24;
export const PLAYER_SCALE = 3; // Scale up for crisp 16-bit look

// Flower system
export const FLOWER_CELL_SIZE = 24;
export const FLOWERS_PER_CLUSTER_MIN = 3;
export const FLOWERS_PER_CLUSTER_MAX = 6;
export const FLOWER_BLOOM_DURATION = 600;
export const FLOWER_SWAY_DURATION = 2200;
export const MAX_ACTIVE_FLOWERS = 600;

// Butterflies
export const MAX_BUTTERFLIES = 16;
export const BUTTERFLY_VISUAL_RANGE = 130;
export const BUTTERFLY_SPEED = 38;
export const BUTTERFLY_FLUTTER_FREQ = 4;

// Camera
export const CAMERA_LERP = 0.07;
export const CAMERA_DEADZONE_W = 50;
export const CAMERA_DEADZONE_H = 35;

// Day/night cycle — total game ~15-20 min
export const DAY_CYCLE_DURATION = 17.5 * 60 * 1000; // ms

// Interaction
export const INTERACT_RANGE = 44;

// Dialogue
export const DIALOGUE_CHARS_PER_SEC = 35;
export const DIALOGUE_BOX_WIDTH = 520;
export const DIALOGUE_BOX_HEIGHT = 160;

// ── HD-2D 16-bit Color Palette — warm garden palette matching refmap ───────
export const COLORS = {
  // Grass — rich dark greens like the refmap's lush lawn
  grass1: 0x3d7a35,
  grass2: 0x356b2c,
  grass3: 0x4a8f40,
  grass4: 0x2e5e28,

  // Flowers — warm vibrant tones from refmap
  flowerPink:     0xf0709a,
  flowerRed:      0xe03358,
  flowerYellow:   0xf5c842,
  flowerWhite:    0xf5f0e8,
  flowerPurple:   0xa06ad0,
  flowerBlue:     0x5898d8,
  flowerOrange:   0xf0843c,
  flowerLavender: 0xc098d4,

  // Cherry blossom — refmap's dominant pink tone
  cherryLight: 0xffbcd4,
  cherryMed:   0xf090b8,
  cherryDark:  0xd85890,
  cherryBark:  0x4a2e1a,

  // Water — deep teal pond as in refmap
  waterDeep:  0x1a3d5c,
  waterMid:   0x245880,
  waterLight: 0x5ab0d0,
  waterFoam:  0xb0dce8,

  // Stone — warm cream/tan cobblestone as in refmap paths
  stone1: 0xb8a880,
  stone2: 0xc8b890,
  stone3: 0xa09870,
  stoneDark: 0x706050,

  // Wood — warm brown as in refmap bench/arch/fence
  woodLight: 0xb88c5a,
  woodMed:   0x9a7040,
  woodDark:  0x6a4a28,

  // Sky / atmosphere
  skyMorning:   0x87ceeb,
  skyAfternoon: 0x6bb3d9,
  skyGolden:    0xf5c06a,
  skySunset:    0xe8789a,
  skyNight:     0x0a0a2e,

  // Lighting
  lanternGlow:  0xffcc44,
  fireflyGlow:  0xccff66,
  sunlightGold: 0xfff2cc,
  moonlight:    0xb8c8e8,

  // UI
  uiBg:      0x1a0a2e,
  uiBgAlpha: 0.85,
  uiText:    0xf0e8d8,
  uiAccent:  0xf2a0b5,
  uiBorder:  0x483868,
} as const;

// Time of day phases
export const TIME_PHASES = {
  morning:    { start: 0.00, end: 0.25, tint: 0xe8e8ff, alpha: 0.05 },
  afternoon:  { start: 0.25, end: 0.45, tint: 0xfffff0, alpha: 0.00 },
  goldenHour: { start: 0.45, end: 0.60, tint: 0xffd080, alpha: 0.12 },
  sunset:     { start: 0.60, end: 0.75, tint: 0xff8888, alpha: 0.18 },
  night:      { start: 0.75, end: 1.00, tint: 0x2233aa, alpha: 0.45 },
} as const;

// ── Area definitions — scaled to new 3200×4000 world ────────────────────────
// Layout: 2 columns × 5 rows of 1600×800px zones
export const AREAS = {
  cottage: {
    name: 'Cottage Garden',
    x: 0,    y: 3200,
    width: 1600, height: 800,
    music: 'gentle',
  },
  secretGarden: {
    name: 'Secret Garden',
    x: 1600, y: 3200,
    width: 1600, height: 800,
    music: 'peaceful',
  },
  roseGarden: {
    name: 'Rose Garden',
    x: 0,    y: 2400,
    width: 1600, height: 800,
    music: 'dreamy',
  },
  crystalLake: {
    name: 'Crystal Lake',
    x: 1600, y: 2400,
    width: 1600, height: 800,
    music: 'serene',
  },
  greenhouse: {
    name: 'Greenhouse',
    x: 0,    y: 1600,
    width: 1600, height: 800,
    music: 'mystical',
  },
  centralPlaza: {
    name: 'Central Plaza',
    x: 1600, y: 1600,
    width: 1600, height: 800,
    music: 'warm',
  },
  maze: {
    name: 'Hedge Maze',
    x: 0,    y: 800,
    width: 1600, height: 800,
    music: 'mystical',
  },
  cherryGarden: {
    name: 'Cherry Garden',
    x: 1600, y: 800,
    width: 1600, height: 800,
    music: 'peaceful',
  },
  forgottenChurch: {
    name: 'Forgotten Shrine',
    x: 400,  y: 200,
    width: 2400, height: 600,
    music: 'serene',
  },
  observatory: {
    name: 'Observatory',
    x: 800,  y: 0,
    width: 1600, height: 200,
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
