// ============================================================
// World Config — Object placements and area layouts
// ============================================================

export interface WorldObject {
  type: string;       // texture key
  x: number;
  y: number;
  scale?: number;
  depth?: number;
  interactive?: boolean;
  interactionType?: string;
  dialogueId?: string;
  collides?: boolean;
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

export const WORLD_OBJECTS: AreaConfig[] = [
  // ── Entrance Garden ─────────────────────────────────
  {
    key: 'entranceGarden',
    name: 'Entrance Garden',
    bounds: { x: 1600, y: 0, w: 1600, h: 800 },
    groundColor: 0x4a8c3f,
    objects: [
      // Stone path leading south
      { type: 'stone_path', x: 2400, y: 100, collides: false },
      { type: 'stone_path', x: 2400, y: 132, collides: false },
      { type: 'stone_path', x: 2400, y: 164, collides: false },
      { type: 'stone_path', x: 2400, y: 200, collides: false },
      { type: 'stone_path', x: 2400, y: 240, collides: false },
      { type: 'stone_path', x: 2400, y: 280, collides: false },
      { type: 'stone_path', x: 2400, y: 320, collides: false },
      { type: 'stone_path', x: 2400, y: 380, collides: false },
      { type: 'stone_path', x: 2400, y: 440, collides: false },
      { type: 'stone_path', x: 2400, y: 500, collides: false },
      { type: 'stone_path', x: 2400, y: 560, collides: false },
      { type: 'stone_path', x: 2400, y: 620, collides: false },
      { type: 'stone_path', x: 2400, y: 680, collides: false },
      { type: 'stone_path', x: 2400, y: 740, collides: false },
      // Fountain
      { type: 'fountain', x: 2400, y: 400, scale: 1.5, interactive: true, interactionType: 'fountain', dialogueId: 'fountain_watch', collides: true },
      // Benches
      { type: 'bench', x: 1800, y: 300, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 3000, y: 300, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Flower arch at entrance
      { type: 'flower_arch', x: 2400, y: 60, scale: 1.5, collides: false },
      // Trees along edges
      { type: 'tree_oak', x: 1700, y: 150, scale: 1.2, collides: true },
      { type: 'tree_oak', x: 1750, y: 500, scale: 1.0, collides: true },
      { type: 'tree_oak', x: 3100, y: 200, scale: 1.1, collides: true },
      { type: 'tree_oak', x: 3050, y: 550, scale: 1.0, collides: true },
      // Fences
      { type: 'fence_h', x: 1680, y: 50, collides: true },
      { type: 'fence_h', x: 1712, y: 50, collides: true },
      { type: 'fence_h', x: 3088, y: 50, collides: true },
      { type: 'fence_h', x: 3120, y: 50, collides: true },
      // Lanterns
      { type: 'lantern', x: 2200, y: 200, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2600, y: 200, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Bushes
      { type: 'bush', x: 1900, y: 600, collides: true },
      { type: 'bush', x: 2900, y: 650, collides: true },
      // Sign
      { type: 'sign_post', x: 2300, y: 120, interactive: true, interactionType: 'sign', dialogueId: 'tutorial' },
    ],
    dialogueOnEnter: undefined, // opening handled by cutscene
  },

  // ── Flower Meadow ───────────────────────────────────
  {
    key: 'flowerMeadow',
    name: 'Flower Meadow',
    bounds: { x: 1200, y: 800, w: 2400, h: 1000 },
    groundColor: 0x5a9e4a,
    objects: [
      // Scattered fences
      { type: 'fence_h', x: 1300, y: 850, collides: true },
      { type: 'fence_h', x: 1332, y: 850, collides: true },
      { type: 'fence_h', x: 1364, y: 850, collides: true },
      { type: 'fence_h', x: 3400, y: 850, collides: true },
      { type: 'fence_h', x: 3432, y: 850, collides: true },
      // Bench on a hill
      { type: 'bench', x: 1600, y: 1100, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Trees sparse
      { type: 'tree_oak', x: 1400, y: 1000, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 3200, y: 1050, scale: 1.0, collides: true },
      { type: 'tree_oak', x: 2800, y: 900, scale: 0.9, collides: true },
      // Rocks
      { type: 'rock_large', x: 1500, y: 1400, collides: true },
      { type: 'rock_small', x: 2600, y: 1300, collides: false },
      { type: 'rock_small', x: 3000, y: 1600, collides: false },
      // Bushes
      { type: 'bush', x: 1350, y: 1200, collides: true },
      { type: 'bush', x: 3350, y: 1100, collides: true },
      // Lanterns along path
      { type: 'lantern', x: 2200, y: 1000, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2600, y: 1400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_flowerMeadow',
  },

  // ── Cherry Blossom Forest ───────────────────────────
  {
    key: 'cherryBlossomForest',
    name: 'Cherry Blossom Forest',
    bounds: { x: 1000, y: 1800, w: 2800, h: 1200 },
    groundColor: 0x4a8c3f,
    objects: [
      // Dense cherry trees
      { type: 'tree_cherry', x: 1200, y: 1900, scale: 1.3, collides: true },
      { type: 'tree_cherry', x: 1500, y: 2100, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 1100, y: 2400, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: 1700, y: 1950, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 2000, y: 2600, scale: 1.4, collides: true },
      { type: 'tree_cherry', x: 2500, y: 2000, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 2800, y: 2200, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: 3200, y: 2100, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 3400, y: 2500, scale: 1.3, collides: true },
      { type: 'tree_cherry', x: 3000, y: 2700, scale: 1.1, collides: true },
      // Gazebo in a clearing
      { type: 'gazebo', x: 2200, y: 2300, scale: 1.2, interactive: true, interactionType: 'gazebo', dialogueId: 'bench_sit', collides: true },
      // Bridge over stream
      { type: 'bridge_h', x: 2000, y: 2800, scale: 1.2, collides: false },
      // Stone path
      { type: 'stone_path', x: 2200, y: 2000, collides: false },
      { type: 'stone_path', x: 2200, y: 2040, collides: false },
      { type: 'stone_path', x: 2200, y: 2080, collides: false },
      { type: 'stone_path', x: 2200, y: 2120, collides: false },
      // Bench
      { type: 'bench', x: 1400, y: 2200, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Lanterns
      { type: 'lantern', x: 1600, y: 2100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2800, y: 2400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_cherryBlossomForest',
  },

  // ── Crystal Lake ────────────────────────────────────
  {
    key: 'crystalLake',
    name: 'Crystal Lake',
    bounds: { x: 800, y: 3000, w: 3200, h: 1000 },
    groundColor: 0x4a8a3f,
    hasWater: true,
    waterBounds: { x: 1200, y: 3200, w: 2000, h: 500 },
    objects: [
      // Dock
      { type: 'dock', x: 2000, y: 3180, scale: 1.2, interactive: true, interactionType: 'dock', dialogueId: 'fountain_watch', collides: false },
      // Trees along shore
      { type: 'tree_willow', x: 1000, y: 3100, scale: 1.3, collides: true },
      { type: 'tree_willow', x: 3600, y: 3150, scale: 1.2, collides: true },
      { type: 'tree_oak', x: 900, y: 3600, scale: 1.0, collides: true },
      { type: 'tree_oak', x: 3700, y: 3500, scale: 1.1, collides: true },
      // Lily pads
      { type: 'lily_pad', x: 1500, y: 3400, collides: false },
      { type: 'lily_pad', x: 1800, y: 3500, collides: false },
      { type: 'lily_pad', x: 2400, y: 3350, collides: false },
      { type: 'lily_pad', x: 2700, y: 3450, collides: false },
      { type: 'lily_pad', x: 3000, y: 3380, collides: false },
      // Reeds
      { type: 'reed', x: 1200, y: 3190, collides: false },
      { type: 'reed', x: 1250, y: 3200, collides: false },
      { type: 'reed', x: 3150, y: 3195, collides: false },
      // Bench
      { type: 'bench', x: 1100, y: 3300, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Rocks for stone skipping
      { type: 'rock_small', x: 2200, y: 3150, interactive: true, interactionType: 'skip_stone', dialogueId: 'fountain_watch', collides: false },
      // Lanterns
      { type: 'lantern', x: 1400, y: 3100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2800, y: 3100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_crystalLake',
  },

  // ── Lantern Garden ──────────────────────────────────
  {
    key: 'lanternGarden',
    name: 'Lantern Garden',
    bounds: { x: 1400, y: 4000, w: 2000, h: 1000 },
    groundColor: 0x3d7a35,
    objects: [
      // Many lanterns
      { type: 'lantern', x: 1600, y: 4100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1900, y: 4200, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2200, y: 4100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2500, y: 4300, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2800, y: 4150, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 3100, y: 4250, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1700, y: 4500, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2000, y: 4600, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2400, y: 4550, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2700, y: 4650, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 3000, y: 4700, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1800, y: 4800, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Stone paths
      { type: 'stone_path', x: 2200, y: 4100, collides: false },
      { type: 'stone_path', x: 2200, y: 4200, collides: false },
      { type: 'stone_path', x: 2200, y: 4300, collides: false },
      { type: 'stone_path', x: 2200, y: 4400, collides: false },
      { type: 'stone_path', x: 2200, y: 4500, collides: false },
      { type: 'stone_path', x: 2200, y: 4600, collides: false },
      { type: 'stone_path', x: 2200, y: 4700, collides: false },
      { type: 'stone_path', x: 2200, y: 4800, collides: false },
      { type: 'stone_path', x: 2200, y: 4900, collides: false },
      // Bridges
      { type: 'bridge_h', x: 1800, y: 4400, scale: 1.0, collides: false },
      { type: 'bridge_h', x: 2600, y: 4400, scale: 1.0, collides: false },
      // Gazebo
      { type: 'gazebo', x: 2400, y: 4750, scale: 1.0, interactive: true, interactionType: 'gazebo', dialogueId: 'bench_sit', collides: true },
      // Trees
      { type: 'tree_cherry', x: 1500, y: 4200, scale: 1.0, collides: true },
      { type: 'tree_oak', x: 3200, y: 4300, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 1600, y: 4700, scale: 1.1, collides: true },
    ],
    dialogueOnEnter: 'enter_lanternGarden',
  },

  // ── Sunflower Field ─────────────────────────────────
  {
    key: 'sunflowerField',
    name: 'Sunflower Field',
    bounds: { x: 1000, y: 5000, w: 2800, h: 600 },
    groundColor: 0x67ab55,
    objects: [
      // Windmill
      { type: 'windmill', x: 3400, y: 5100, scale: 1.5, collides: true },
      // Fences
      { type: 'fence_h', x: 1100, y: 5050, collides: true },
      { type: 'fence_h', x: 1132, y: 5050, collides: true },
      { type: 'fence_h', x: 1164, y: 5050, collides: true },
      { type: 'fence_h', x: 1196, y: 5050, collides: true },
      { type: 'fence_h', x: 3500, y: 5050, collides: true },
      { type: 'fence_h', x: 3532, y: 5050, collides: true },
      // Bench
      { type: 'bench', x: 1300, y: 5250, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Lanterns
      { type: 'lantern', x: 1500, y: 5100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2500, y: 5100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Trees
      { type: 'tree_oak', x: 1100, y: 5200, scale: 1.0, collides: true },
      { type: 'tree_oak', x: 3600, y: 5300, scale: 0.9, collides: true },
    ],
    dialogueOnEnter: 'enter_sunflowerField',
  },

  // ── Birthday Garden ─────────────────────────────────
  {
    key: 'birthdayGarden',
    name: 'Birthday Garden',
    bounds: { x: 1000, y: 5600, w: 2800, h: 800 },
    groundColor: 0x4a8c3f,
    objects: [
      // Giant cherry blossom tree at center
      { type: 'tree_big_cherry', x: 2400, y: 5900, scale: 2.0, collides: true },
      // Flower arches leading in
      { type: 'flower_arch', x: 2400, y: 5650, scale: 1.5, collides: false },
      { type: 'flower_arch', x: 2400, y: 5750, scale: 1.5, collides: false },
      // Fountain
      { type: 'fountain', x: 2400, y: 6100, scale: 1.5, interactive: true, interactionType: 'fountain', dialogueId: 'fountain_watch', collides: true },
      // Many lanterns in circle
      { type: 'lantern', x: 1800, y: 5800, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1900, y: 6100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2100, y: 6250, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2700, y: 6250, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2900, y: 6100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 3000, y: 5800, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Benches
      { type: 'bench', x: 1700, y: 5950, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 3100, y: 5950, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Stone paths in circular pattern
      { type: 'stone_path', x: 2400, y: 5700, collides: false },
      { type: 'stone_path', x: 2400, y: 5750, collides: false },
      { type: 'stone_path', x: 2400, y: 5800, collides: false },
      { type: 'stone_path', x: 2400, y: 5850, collides: false },
      // Trees around edges
      { type: 'tree_cherry', x: 1200, y: 5700, scale: 1.3, collides: true },
      { type: 'tree_cherry', x: 1300, y: 6100, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 3500, y: 5750, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: 3400, y: 6050, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 1600, y: 6300, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 3200, y: 6300, scale: 1.2, collides: true },
      // Bushes
      { type: 'bush', x: 1500, y: 5800, collides: true },
      { type: 'bush', x: 3300, y: 5850, collides: true },
    ],
    dialogueOnEnter: 'enter_birthdayGarden',
  },
];
