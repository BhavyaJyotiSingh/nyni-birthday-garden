// ============================================================
// World Config — Object placements and area layouts
// ============================================================

export interface WorldObject {
  id?: string;
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
  // ── Cottage (Start Area) ────────────────────────────
  {
    key: 'cottage',
    name: 'The Cottage',
    bounds: { x: 1000, y: 5400, w: 1400, h: 1000 },
    groundColor: 0x4a8c3f,
    objects: [
      // Stone path from cottage to east
      { type: 'stone_path', x: 1700, y: 5900, collides: false },
      { type: 'stone_path', x: 1800, y: 5900, collides: false },
      { type: 'stone_path', x: 1900, y: 5900, collides: false },
      { type: 'stone_path', x: 2000, y: 5900, collides: false },
      { type: 'stone_path', x: 2100, y: 5900, collides: false },
      { type: 'stone_path', x: 2200, y: 5900, collides: false },
      { type: 'stone_path', x: 2300, y: 5900, collides: false },
      { type: 'stone_path', x: 2400, y: 5900, collides: false },
      // Path leading north
      { type: 'stone_path', x: 1700, y: 5800, collides: false },
      { type: 'stone_path', x: 1700, y: 5700, collides: false },
      { type: 'stone_path', x: 1700, y: 5600, collides: false },
      { type: 'stone_path', x: 1700, y: 5500, collides: false },
      { type: 'stone_path', x: 1700, y: 5400, collides: false },
      // Stone bench player wakes up on
      { type: 'bench', x: 1700, y: 5950, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Letter table
      { id: 'cottage_letter_table', type: 'letter_table', x: 1550, y: 5880, interactive: true, interactionType: 'letter', dialogueId: 'read_letter', collides: true },
      // Trees and bushes
      { type: 'tree_oak', x: 1100, y: 5500, scale: 1.2, collides: true },
      { type: 'tree_oak', x: 1300, y: 5550, scale: 1.0, collides: true },
      { type: 'tree_willow', x: 2200, y: 6200, scale: 1.1, collides: true },
      { type: 'bush', x: 1200, y: 6000, collides: true },
      { type: 'bush', x: 2000, y: 6100, collides: true },
      // Lanterns
      { type: 'lantern', x: 1600, y: 5850, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1800, y: 5850, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: undefined, // Handled by opening cutscene
  },

  // ── Secret Garden ───────────────────────────────────
  {
    key: 'secretGarden',
    name: 'Secret Garden',
    bounds: { x: 2400, y: 5400, w: 1400, h: 1000 },
    groundColor: 0x3d7a35,
    objects: [
      // Fences enclosing the garden
      { type: 'fence_h', x: 2500, y: 5450, collides: true },
      { type: 'fence_h', x: 2532, y: 5450, collides: true },
      { type: 'fence_h', x: 3300, y: 5450, collides: true },
      { type: 'fence_h', x: 3332, y: 5450, collides: true },
      // Paths
      { type: 'stone_path', x: 2500, y: 5900, collides: false },
      { type: 'stone_path', x: 2600, y: 5900, collides: false },
      { type: 'stone_path', x: 2700, y: 5900, collides: false },
      { type: 'stone_path', x: 2800, y: 5900, collides: false },
      { type: 'stone_path', x: 2900, y: 5900, collides: false },
      { type: 'stone_path', x: 3000, y: 5900, collides: false },
      { type: 'stone_path', x: 3100, y: 5900, collides: false },
      // Path north to lake
      { type: 'stone_path', x: 3100, y: 5800, collides: false },
      { type: 'stone_path', x: 3100, y: 5700, collides: false },
      { type: 'stone_path', x: 3100, y: 5600, collides: false },
      { type: 'stone_path', x: 3100, y: 5500, collides: false },
      { type: 'stone_path', x: 3100, y: 5400, collides: false },
      // Benches
      { type: 'bench', x: 2900, y: 5950, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Flower Arch
      { type: 'flower_arch', x: 2450, y: 5900, scale: 1.5, collides: false },
      // Decorative structures
      { type: 'gazebo', x: 3500, y: 5800, scale: 1.2, collides: true },
      // Trees
      { type: 'tree_cherry', x: 2700, y: 5600, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 3400, y: 5600, scale: 1.1, collides: true },
    ],
    dialogueOnEnter: 'enter_secretGarden',
  },

  // ── Rose Garden ─────────────────────────────────────
  {
    key: 'roseGarden',
    name: 'Rose Garden',
    bounds: { x: 1000, y: 4400, w: 1400, h: 1000 },
    groundColor: 0x5a9e4a,
    objects: [
      // Fences and arches
      { type: 'flower_arch', x: 1700, y: 5350, scale: 1.5, collides: false },
      // Paths
      { type: 'stone_path', x: 1700, y: 5300, collides: false },
      { type: 'stone_path', x: 1700, y: 5200, collides: false },
      { type: 'stone_path', x: 1700, y: 5100, collides: false },
      { type: 'stone_path', x: 1700, y: 5000, collides: false },
      { type: 'stone_path', x: 1700, y: 4900, collides: false },
      { type: 'stone_path', x: 1700, y: 4800, collides: false },
      { type: 'stone_path', x: 1700, y: 4700, collides: false },
      { type: 'stone_path', x: 1700, y: 4600, collides: false },
      { type: 'stone_path', x: 1700, y: 4500, collides: false },
      { type: 'stone_path', x: 1700, y: 4400, collides: false },
      // Bench
      { type: 'bench', x: 1550, y: 4900, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Trees
      { type: 'tree_oak', x: 1200, y: 4600, scale: 1.2, collides: true },
      { type: 'tree_oak', x: 2200, y: 4700, scale: 1.1, collides: true },
      // Lantern
      { type: 'lantern', x: 1800, y: 4950, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_roseGarden',
  },

  // ── Crystal Lake ────────────────────────────────────
  {
    key: 'crystalLake',
    name: 'Crystal Lake',
    bounds: { x: 2400, y: 4400, w: 1400, h: 1000 },
    groundColor: 0x4a8a3f,
    hasWater: true,
    waterBounds: { x: 2600, y: 4600, w: 1000, h: 600 },
    objects: [
      // Path
      { type: 'stone_path', x: 3100, y: 5300, collides: false },
      { type: 'stone_path', x: 3100, y: 5200, collides: false },
      // The disappearing bridge
      { id: 'crystal_lake_bridge', type: 'bridge_v', x: 3100, y: 4900, collides: true, interactive: false },
      // Remaining path
      { type: 'stone_path', x: 3100, y: 4500, collides: false },
      { type: 'stone_path', x: 3100, y: 4400, collides: false },
      // Dock
      { type: 'dock', x: 2900, y: 4580, scale: 1.5, interactive: true, interactionType: 'dock', dialogueId: 'dock_look', collides: true },
      // Skip stone
      { type: 'rock_small', x: 2800, y: 4590, scale: 1.2, interactive: true, interactionType: 'skip_stone', dialogueId: 'skip_stones', collides: false },
      // Willow Trees
      { type: 'tree_willow', x: 2500, y: 4500, scale: 1.3, collides: true },
      { type: 'tree_willow', x: 3700, y: 4500, scale: 1.2, collides: true },
      // Lily pads
      { type: 'lily_pad', x: 2800, y: 4800 },
      { type: 'lily_pad', x: 3400, y: 4900 },
      // Lantern
      { type: 'lantern', x: 3200, y: 5200, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_crystalLake',
  },

  // ── Greenhouse ──────────────────────────────────────
  {
    key: 'greenhouse',
    name: 'Greenhouse',
    bounds: { x: 1000, y: 3400, w: 1400, h: 1000 },
    groundColor: 0x5a9e4a,
    objects: [
      // Large Greenhouse structure
      { type: 'gazebo', x: 1700, y: 3900, scale: 1.8, interactive: true, interactionType: 'gazebo', dialogueId: 'greenhouse_inspect', collides: true },
      // Paths
      { type: 'stone_path', x: 1700, y: 4300, collides: false },
      { type: 'stone_path', x: 1700, y: 4200, collides: false },
      { type: 'stone_path', x: 1700, y: 3600, collides: false },
      { type: 'stone_path', x: 1700, y: 3500, collides: false },
      { type: 'stone_path', x: 1700, y: 3400, collides: false },
      // Bench
      { type: 'bench', x: 1850, y: 3950, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Trees
      { type: 'tree_oak', x: 1100, y: 3600, scale: 1.1, collides: true },
      { type: 'tree_oak', x: 2300, y: 3600, scale: 1.1, collides: true },
      // Lantern
      { type: 'lantern', x: 1800, y: 4100, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_greenhouse',
  },

  // ── Central Plaza ───────────────────────────────────
  {
    key: 'centralPlaza',
    name: 'Central Plaza',
    bounds: { x: 2400, y: 3400, w: 1400, h: 1000 },
    groundColor: 0x8a8a7a,
    objects: [
      // Central Fountain
      { type: 'fountain', x: 3100, y: 3900, scale: 1.8, interactive: true, interactionType: 'fountain', dialogueId: 'fountain_watch', collides: true },
      // Paths
      { type: 'stone_path', x: 3100, y: 4300, collides: false },
      { type: 'stone_path', x: 3100, y: 4200, collides: false },
      { type: 'stone_path', x: 3100, y: 3600, collides: false },
      { type: 'stone_path', x: 3100, y: 3500, collides: false },
      { type: 'stone_path', x: 3100, y: 3400, collides: false },
      // Benches around fountain
      { type: 'bench', x: 2900, y: 3850, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 3300, y: 3850, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Lanterns
      { type: 'lantern', x: 2950, y: 3750, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 3250, y: 3750, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_centralPlaza',
  },

  // ── Maze ────────────────────────────────────────────
  {
    key: 'maze',
    name: 'The Maze',
    bounds: { x: 1000, y: 2200, w: 1400, h: 1200 },
    groundColor: 0x3d7a35,
    objects: [
      // Entry path
      { type: 'stone_path', x: 1700, y: 3300, collides: false },
      { type: 'stone_path', x: 1700, y: 3200, collides: false },
      // Path leading through the maze
      { type: 'stone_path', x: 1500, y: 2900, collides: false },
      { type: 'stone_path', x: 1300, y: 2600, collides: false },
      { type: 'stone_path', x: 1900, y: 2500, collides: false },
      { type: 'stone_path', x: 2200, y: 2300, collides: false },
      // Sign post
      { type: 'sign_post', x: 1700, y: 3100, interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
      // Lanterns
      { type: 'lantern', x: 1400, y: 2800, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2000, y: 2400, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_maze',
  },

  // ── Cherry Garden ───────────────────────────────────
  {
    key: 'cherryGarden',
    name: 'Cherry Garden',
    bounds: { x: 2400, y: 2200, w: 1400, h: 1200 },
    groundColor: 0x4a8c3f,
    objects: [
      // Paths
      { type: 'stone_path', x: 3100, y: 3300, collides: false },
      { type: 'stone_path', x: 3100, y: 3200, collides: false },
      { type: 'stone_path', x: 3100, y: 3000, collides: false },
      { type: 'stone_path', x: 3100, y: 2900, collides: false },
      { type: 'stone_path', x: 2800, y: 2600, collides: false },
      { type: 'stone_path', x: 2600, y: 2400, collides: false },
      // Dense Cherry Trees
      { type: 'tree_cherry', x: 2700, y: 2800, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: 3500, y: 2800, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 3200, y: 2500, scale: 1.3, collides: true },
      // Giant Cherry Tree where Bhavya lies
      { id: 'bhavya_tree', type: 'tree_big_cherry', x: 3100, y: 2700, scale: 1.8, collides: true },
      // Lantern
      { type: 'lantern', x: 2900, y: 2800, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_cherryGarden',
  },

  // ── Forgotten Church ────────────────────────────────
  {
    key: 'forgottenChurch',
    name: 'Forgotten Church',
    bounds: { x: 1400, y: 1000, w: 2000, h: 1200 },
    groundColor: 0x7a7a6a,
    objects: [
      // Paths from Maze (bottom-left) and Cherry Garden (bottom-right)
      { type: 'stone_path', x: 1800, y: 2100, collides: false },
      { type: 'stone_path', x: 2600, y: 2100, collides: false },
      { type: 'stone_path', x: 2200, y: 1900, collides: false },
      { type: 'stone_path', x: 2200, y: 1700, collides: false },
      { type: 'stone_path', x: 2200, y: 1500, collides: false },
      { type: 'stone_path', x: 2200, y: 1300, collides: false },
      { type: 'stone_path', x: 2200, y: 1100, collides: false },
      // Mirror
      { id: 'church_mirror', type: 'mirror', x: 2000, y: 1450, interactive: true, interactionType: 'mirror', dialogueId: 'look_mirror', collides: true },
      // Nikhil's desk with notebook
      { id: 'nikhil_desk', type: 'bench', x: 2400, y: 1480, scale: 0.9, collides: true },
      { id: 'nikhil_notebook', type: 'notebook', x: 2400, y: 1465, interactive: true, interactionType: 'notebook', dialogueId: 'read_notebook', collides: false },
      // Archways
      { type: 'flower_arch', x: 2200, y: 1150, scale: 1.5, collides: false },
      // Lanterns
      { type: 'lantern', x: 2100, y: 1550, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2300, y: 1550, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_forgottenChurch',
  },

  // ── Observatory (Ending Area) ───────────────────────
  {
    key: 'observatory',
    name: 'The Observatory',
    bounds: { x: 1700, y: 0, w: 1400, h: 1000 },
    groundColor: 0x0a0a2e, // Deep night blue
    objects: [
      // Path leading up to the giant cherry blossom tree
      { type: 'stone_path', x: 2400, y: 900, collides: false },
      { type: 'stone_path', x: 2400, y: 800, collides: false },
      { type: 'stone_path', x: 2400, y: 700, collides: false },
      { type: 'stone_path', x: 2400, y: 600, collides: false },
      { type: 'stone_path', x: 2400, y: 500, collides: false },
      // Giant Cherry Blossom Tree
      { id: 'observatory_cherry_tree', type: 'tree_big_cherry', x: 2400, y: 400, scale: 2.4, collides: true },
      // Circular lanterns around the tree
      { type: 'lantern', x: 2200, y: 350, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2250, y: 500, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2550, y: 500, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2600, y: 350, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Benches
      { type: 'bench', x: 2150, y: 420, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 2650, y: 420, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
    ],
    dialogueOnEnter: 'enter_observatory',
  },
];
