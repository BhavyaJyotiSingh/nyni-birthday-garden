// ============================================================
// Asset Manifest — Single source of truth for all texture keys
// Change paths here to swap sprites. Game code never uses paths directly.
// ============================================================

export interface AssetEntry {
  key: string;
  path?: string;           // Path relative to /public — if set, loaded from file
  frameWidth?: number;     // For spritesheets
  frameHeight?: number;
  frameCount?: number;
  type: 'image' | 'spritesheet' | 'placeholder';
}

// ── Player ──────────────────────────────────────────────────
export const PLAYER_ASSETS: AssetEntry[] = [
  { key: 'player_down',  type: 'placeholder' },
  { key: 'player_up',    type: 'placeholder' },
  { key: 'player_left',  type: 'placeholder' },
  { key: 'player_right', type: 'placeholder' },
  { key: 'player_idle',  type: 'placeholder' },
];

// ── NPC ─────────────────────────────────────────────────────
export const NPC_ASSETS: AssetEntry[] = [
  { key: 'npc_idle', type: 'placeholder' },
  { key: 'cat_orange', type: 'placeholder' },
  { key: 'cat_gray', type: 'placeholder' },
  { key: 'ragdoll_cross_eyes', type: 'placeholder' },
];

// ── Flowers ─────────────────────────────────────────────────
export const FLOWER_ASSET_KEYS = [
  'flower_rose', 'flower_tulip', 'flower_daisy', 'flower_sunflower',
  'flower_lily', 'flower_cherry', 'flower_lavender', 'flower_wild',
] as const;

export const FLOWER_ASSETS: AssetEntry[] = FLOWER_ASSET_KEYS.map(key => ({
  key, type: 'placeholder' as const,
}));

// ── Trees ───────────────────────────────────────────────────
export const TREE_ASSETS: AssetEntry[] = [
  { key: 'tree_cherry',    type: 'placeholder' },
  { key: 'tree_oak',       type: 'placeholder' },
  { key: 'tree_willow',    type: 'placeholder' },
  { key: 'tree_big_cherry', type: 'placeholder' },
];

// ── Nature ──────────────────────────────────────────────────
export const NATURE_ASSETS: AssetEntry[] = [
  { key: 'bush',       type: 'placeholder' },
  { key: 'tall_grass', type: 'placeholder' },
  { key: 'reed',       type: 'placeholder' },
  { key: 'lily_pad',   type: 'placeholder' },
  { key: 'cattail',    type: 'placeholder' },
  { key: 'rock_small', type: 'placeholder' },
  { key: 'rock_large', type: 'placeholder' },
];

// ── Structures ──────────────────────────────────────────────
export const STRUCTURE_ASSETS: AssetEntry[] = [
  { key: 'bench',        type: 'placeholder' },
  { key: 'lantern',      type: 'placeholder' },
  { key: 'lantern_lit',  type: 'placeholder' },
  { key: 'fence_h',      type: 'placeholder' },
  { key: 'fence_v',      type: 'placeholder' },
  { key: 'fence_post',   type: 'placeholder' },
  { key: 'bridge_h',     type: 'placeholder' },
  { key: 'bridge_v',     type: 'placeholder' },
  { key: 'gazebo',       type: 'placeholder' },
  { key: 'fountain',     type: 'placeholder' },
  { key: 'windmill',     type: 'placeholder' },
  { key: 'flower_arch',  type: 'placeholder' },
  { key: 'sign_post',    type: 'placeholder' },
  { key: 'stone_path',   type: 'placeholder' },
  { key: 'dock',         type: 'placeholder' },
];

// ── Butterflies ─────────────────────────────────────────────
export const BUTTERFLY_ASSETS: AssetEntry[] = [
  { key: 'butterfly_orange', type: 'placeholder' },
  { key: 'butterfly_blue',   type: 'placeholder' },
  { key: 'butterfly_yellow', type: 'placeholder' },
  { key: 'butterfly_white',  type: 'placeholder' },
  { key: 'butterfly_purple', type: 'placeholder' },
  { key: 'butterfly_pink',   type: 'placeholder' },
];

// ── Particles ───────────────────────────────────────────────
export const PARTICLE_ASSETS: AssetEntry[] = [
  { key: 'particle_petal_pink',   type: 'placeholder' },
  { key: 'particle_petal_white',  type: 'placeholder' },
  { key: 'particle_sparkle',      type: 'placeholder' },
  { key: 'particle_firefly',      type: 'placeholder' },
  { key: 'particle_leaf',         type: 'placeholder' },
  { key: 'particle_pollen',       type: 'placeholder' },
  { key: 'particle_water_drop',   type: 'placeholder' },
  { key: 'particle_star',         type: 'placeholder' },
  { key: 'particle_firework',     type: 'placeholder' },
];

// ── UI ──────────────────────────────────────────────────────
export const UI_ASSETS: AssetEntry[] = [
  { key: 'ui_dialogue_bg',    type: 'placeholder' },
  { key: 'ui_interact_prompt', type: 'placeholder' },
  { key: 'ui_memory_orb',     type: 'placeholder' },
  { key: 'ui_arrow',          type: 'placeholder' },
  { key: 'ui_joystick_base',  type: 'placeholder' },
  { key: 'ui_joystick_knob',  type: 'placeholder' },
  { key: 'ui_button_interact', type: 'placeholder' },
];

// ── Environment ─────────────────────────────────────────────
export const ENV_ASSETS: AssetEntry[] = [
  { key: 'water_tile',  type: 'placeholder' },
  { key: 'grass_tile',  type: 'placeholder' },
  { key: 'dirt_tile',   type: 'placeholder' },
  { key: 'sand_tile',   type: 'placeholder' },
  { key: 'stone_tile',  type: 'placeholder' },
  {
    key: 'tiny_town_tiles',
    type: 'spritesheet',
    path: '/assets/kenney/tiny-town/Tilemap/tilemap_packed.png',
    frameWidth: 16,
    frameHeight: 16,
  },
];

// ── Aggregate all assets ────────────────────────────────────
export function getAllAssets(): AssetEntry[] {
  return [
    ...PLAYER_ASSETS,
    ...NPC_ASSETS,
    ...FLOWER_ASSETS,
    ...TREE_ASSETS,
    ...NATURE_ASSETS,
    ...STRUCTURE_ASSETS,
    ...BUTTERFLY_ASSETS,
    ...PARTICLE_ASSETS,
    ...UI_ASSETS,
    ...ENV_ASSETS,
  ];
}

// Helper to check if a real asset file exists for a key
export function getAssetPath(key: string): string | undefined {
  const all = getAllAssets();
  const entry = all.find(a => a.key === key);
  return entry?.path;
}
