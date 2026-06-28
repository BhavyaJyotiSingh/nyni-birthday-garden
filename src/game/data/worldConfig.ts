// ============================================================
// World Config — Object placements for 3200×4000 world
// Layout: 2 columns × 5 rows of 1600×800px zones
//   Col A: x=0–1600    Col B: x=1600–3200
//   Row 0 (top):    y=0–200   (observatory — thin strip)
//   Row 1:          y=200–800 (forgottenChurch spans full width)
//   Row 2:          y=800–1600 (maze | cherryGarden)
//   Row 3:          y=1600–2400 (greenhouse | centralPlaza)
//   Row 4:          y=2400–3200 (roseGarden | crystalLake)
//   Row 5 (bottom): y=3200–4000 (cottage | secretGarden)
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

  // ── Cottage (Start Area) ─── Row 5 Left: x=0–1600, y=3200–4000 ──────────
  {
    key: 'cottage',
    name: 'Cottage Garden',
    bounds: { x: 0, y: 3200, w: 1600, h: 800 },
    groundColor: 0x3d7830,
    objects: [
      // Bench — player wakes up here
      { type: 'bench', x: 800, y: 3700,
        interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Letter table by bench
      { id: 'cottage_letter_table', type: 'letter_table', x: 640, y: 3660,
        interactive: true, interactionType: 'letter', dialogueId: 'read_letter', collides: true },
      // Flower arch entry from south
      { type: 'flower_arch', x: 800, y: 3950, scale: 1.3, collides: false },
      // Trees
      { type: 'tree_oak',    x: 200,  y: 3350, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 400,  y: 3450, scale: 1.0, collides: true },
      { type: 'tree_willow', x: 1400, y: 3700, scale: 1.0, collides: true },
      { type: 'tree_oak',    x: 1200, y: 3380, scale: 1.0, collides: true },
      // Bushes
      { type: 'bush', x: 180,  y: 3700, collides: true },
      { type: 'bush', x: 1380, y: 3400, collides: true },
      { type: 'bush', x: 260,  y: 3900, collides: false },
      { type: 'bush', x: 1320, y: 3900, collides: false },
      // Lanterns along path
      { type: 'lantern', x: 720,  y: 3780, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 880,  y: 3780, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Fence bits
      { type: 'fence_h', x: 100, y: 3950, collides: true },
      { type: 'fence_h', x: 132, y: 3950, collides: true },
      { type: 'fence_h', x: 164, y: 3950, collides: true },
    ],
    dialogueOnEnter: undefined,
  },

  // ── Secret Garden ─── Row 5 Right: x=1600–3200, y=3200–4000 ─────────────
  {
    key: 'secretGarden',
    name: 'Secret Garden',
    bounds: { x: 1600, y: 3200, w: 1600, h: 800 },
    groundColor: 0x357028,
    objects: [
      // Gazebo centerpiece
      { type: 'gazebo', x: 2400, y: 3650, scale: 1.1, interactive: true, interactionType: 'gazebo', dialogueId: 'greenhouse_inspect', collides: true },
      // Benches beside gazebo
      { type: 'bench', x: 2180, y: 3700, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 2620, y: 3700, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Flower arch entry
      { type: 'flower_arch', x: 2400, y: 3960, scale: 1.3, collides: false },
      // Trees
      { type: 'tree_cherry', x: 1800, y: 3380, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 3000, y: 3380, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 2000, y: 3800, scale: 0.9, collides: true },
      { type: 'tree_oak',    x: 2800, y: 3780, scale: 1.0, collides: true },
      // Fences
      { type: 'fence_h', x: 1620, y: 3240, collides: true },
      { type: 'fence_h', x: 1652, y: 3240, collides: true },
      { type: 'fence_h', x: 3100, y: 3240, collides: true },
      { type: 'fence_h', x: 3132, y: 3240, collides: true },
      // Lanterns
      { type: 'lantern', x: 2280, y: 3560, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2520, y: 3560, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_secretGarden',
  },

  // ── Rose Garden ─── Row 4 Left: x=0–1600, y=2400–3200 ───────────────────
  {
    key: 'roseGarden',
    name: 'Rose Garden',
    bounds: { x: 0, y: 2400, w: 1600, h: 800 },
    groundColor: 0x3a7a30,
    objects: [
      // Flower arch — portal between areas
      { type: 'flower_arch', x: 800, y: 3180, scale: 1.2, collides: false },
      // Bench
      { type: 'bench', x: 560, y: 2850, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Memory: first date cafe
      // Trees
      { type: 'tree_oak',    x: 200,  y: 2500, scale: 1.1, collides: true },
      { type: 'tree_oak',    x: 1380, y: 2600, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 700,  y: 2550, scale: 0.9, collides: true },
      { type: 'tree_cherry', x: 1100, y: 2450, scale: 1.0, collides: true },
      // Bushes
      { type: 'bush', x: 300,  y: 2800, collides: false },
      { type: 'bush', x: 1250, y: 2800, collides: false },
      { type: 'bush', x: 150,  y: 3100, collides: false },
      { type: 'bush', x: 1450, y: 3100, collides: false },
      // Lantern
      { type: 'lantern', x: 700, y: 2900, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_roseGarden',
  },

  // ── Crystal Lake ─── Row 4 Right: x=1600–3200, y=2400–3200 ──────────────
  {
    key: 'crystalLake',
    name: 'Crystal Lake',
    bounds: { x: 1600, y: 2400, w: 1600, h: 800 },
    groundColor: 0x2e5840,
    hasWater: true,
    waterBounds: { x: 1700, y: 2500, w: 1400, h: 480 },
    objects: [
      // Bridge crossing the pond
      { id: 'crystal_lake_bridge', type: 'bridge_h', x: 2400, y: 2740, scale: 1.6, collides: true },
      // Dock
      { type: 'dock', x: 2100, y: 2490, scale: 1.3,
        interactive: true, interactionType: 'dock', dialogueId: 'dock_look', collides: true },
      // Skip stone
      { type: 'rock_small', x: 2000, y: 2500, scale: 1.0,
        interactive: true, interactionType: 'skip_stone', dialogueId: 'skip_stones' },
      // Lily pads
      { type: 'lily_pad', x: 1900, y: 2680 },
      { type: 'lily_pad', x: 2700, y: 2620 },
      { type: 'lily_pad', x: 2900, y: 2750 },
      { type: 'lily_pad', x: 1820, y: 2780 },
      // Willow trees at water's edge
      { type: 'tree_willow', x: 1680, y: 2520, scale: 1.1, collides: true },
      { type: 'tree_willow', x: 3150, y: 2520, scale: 1.0, collides: true },
      { type: 'tree_willow', x: 2800, y: 3150, scale: 1.1, collides: true },
      // Lantern by bridge
      { type: 'lantern', x: 2220, y: 2750, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2580, y: 2750, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_crystalLake',
  },

  // ── Greenhouse ─── Row 3 Left: x=0–1600, y=1600–2400 ────────────────────
  {
    key: 'greenhouse',
    name: 'Greenhouse',
    bounds: { x: 0, y: 1600, w: 1600, h: 800 },
    groundColor: 0x4a7830,
    objects: [
      // Windmill
      { type: 'windmill', x: 300, y: 1780, scale: 1.0, collides: true },
      // Greenhouse structure (gazebo proxy)
      { type: 'gazebo', x: 900, y: 2000, scale: 1.6,
        interactive: true, interactionType: 'gazebo', dialogueId: 'greenhouse_inspect', collides: true },
      // Bench
      { type: 'bench', x: 680, y: 2050, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Trees around greenhouse
      { type: 'tree_oak', x: 180,  y: 2200, scale: 1.1, collides: true },
      { type: 'tree_oak', x: 1400, y: 2100, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 600, y: 1700, scale: 0.9, collides: true },
      { type: 'tree_cherry', x: 1200, y: 1700, scale: 0.9, collides: true },
      // Fences
      { type: 'fence_h', x: 0,    y: 1640, collides: true },
      { type: 'fence_h', x: 32,   y: 1640, collides: true },
      // Lantern
      { type: 'lantern', x: 800, y: 2150, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_greenhouse',
  },

  // ── Central Plaza ─── Row 3 Right: x=1600–3200, y=1600–2400 ─────────────
  {
    key: 'centralPlaza',
    name: 'Central Plaza',
    bounds: { x: 1600, y: 1600, w: 1600, h: 800 },
    groundColor: 0x7a7868,
    objects: [
      // Fountain centerpiece
      { type: 'fountain', x: 2400, y: 2000, scale: 1.6,
        interactive: true, interactionType: 'fountain', dialogueId: 'fountain_watch', collides: true },
      // Benches around fountain
      { type: 'bench', x: 2160, y: 1980, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 2640, y: 1980, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      // Lanterns flanking fountain
      { type: 'lantern', x: 2220, y: 1880, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2580, y: 1880, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Trees at corners
      { type: 'tree_cherry', x: 1700, y: 1700, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 3100, y: 1700, scale: 1.0, collides: true },
      { type: 'tree_oak',    x: 1750, y: 2350, scale: 1.0, collides: true },
      { type: 'tree_oak',    x: 3050, y: 2350, scale: 1.0, collides: true },
      // Sign post
      { type: 'sign_post', x: 1900, y: 1700,
        interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
    ],
    dialogueOnEnter: 'enter_centralPlaza',
  },

  // ── Maze ─── Row 2 Left: x=0–1600, y=800–1600 ───────────────────────────
  {
    key: 'maze',
    name: 'Hedge Maze',
    bounds: { x: 0, y: 800, w: 1600, h: 800 },
    groundColor: 0x2e5828,
    objects: [
      // Sign at entrance
      { type: 'sign_post', x: 800, y: 1560,
        interactive: true, interactionType: 'sign', dialogueId: 'maze_hint' },
      // Lanterns inside maze
      { type: 'lantern', x: 400,  y: 1200, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1100, y: 1000, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 700,  y: 900,  interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
    ],
    dialogueOnEnter: 'enter_maze',
  },

  // ── Cherry Garden ─── Row 2 Right: x=1600–3200, y=800–1600 ──────────────
  {
    key: 'cherryGarden',
    name: 'Cherry Garden',
    bounds: { x: 1600, y: 800, w: 1600, h: 800 },
    groundColor: 0x3a6830,
    objects: [
      // Giant Cherry Tree — story moment
      { id: 'bhavya_tree', type: 'tree_big_cherry', x: 2400, y: 1200, scale: 1.8, collides: true },
      // Dense cherry trees
      { type: 'tree_cherry', x: 1780, y: 980, scale: 1.2, collides: true },
      { type: 'tree_cherry', x: 3060, y: 980, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 2000, y: 1480, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 2800, y: 1480, scale: 1.1, collides: true },
      { type: 'tree_cherry', x: 2200, y: 900, scale: 0.95, collides: true },
      { type: 'tree_cherry', x: 2600, y: 900, scale: 0.95, collides: true },
      // Lanterns circling tree
      { type: 'lantern_lit', x: 2200, y: 1080, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern_lit', x: 2600, y: 1080, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern_lit', x: 2400, y: 920,  interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Bench under tree
      { type: 'bench', x: 2400, y: 1370, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
    ],
    dialogueOnEnter: 'enter_cherryGarden',
  },

  // ── Forgotten Shrine ─── Row 1: x=400–2800, y=200–800 ───────────────────
  {
    key: 'forgottenChurch',
    name: 'Forgotten Shrine',
    bounds: { x: 400, y: 200, w: 2400, h: 600 },
    groundColor: 0x686858,
    objects: [
      // Mirror
      { id: 'church_mirror', type: 'mirror', x: 1200, y: 520,
        interactive: true, interactionType: 'mirror', dialogueId: 'look_mirror', collides: true },
      // Notebook desk
      { id: 'nikhil_desk', type: 'bench', x: 1600, y: 550, scale: 0.9, collides: true },
      { id: 'nikhil_notebook', type: 'notebook', x: 1600, y: 530,
        interactive: true, interactionType: 'notebook', dialogueId: 'read_notebook' },
      // Archways
      { type: 'flower_arch', x: 1400, y: 250, scale: 1.3, collides: false },
      { type: 'flower_arch', x: 2000, y: 250, scale: 1.3, collides: false },
      // Lanterns
      { type: 'lantern', x: 1100, y: 600, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 1700, y: 600, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern', x: 2300, y: 600, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Trees
      { type: 'tree_cherry', x: 500,  y: 400, scale: 1.0, collides: true },
      { type: 'tree_cherry', x: 2700, y: 400, scale: 1.0, collides: true },
    ],
    dialogueOnEnter: 'enter_forgottenChurch',
  },

  // ── Observatory (Ending) ─── Row 0: x=800–2400, y=0–200 ─────────────────
  {
    key: 'observatory',
    name: 'The Observatory',
    bounds: { x: 800, y: 0, w: 1600, h: 200 },
    groundColor: 0x0a0a28,
    objects: [
      // Giant Birthday Cherry Tree
      { id: 'observatory_cherry_tree', type: 'tree_big_cherry', x: 1600, y: 100, scale: 2.2, collides: true },
      // Cake on pedestal
      { type: 'cake', x: 1600, y: 160, scale: 1.4 },
      // Surrounding lanterns (circular arrangement)
      { type: 'lantern_lit', x: 1360, y: 80,  interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern_lit', x: 1440, y: 160, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern_lit', x: 1760, y: 160, interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      { type: 'lantern_lit', x: 1840, y: 80,  interactive: true, interactionType: 'lantern', dialogueId: 'lantern_light' },
      // Benches
      { type: 'bench', x: 1280, y: 140, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
      { type: 'bench', x: 1920, y: 140, interactive: true, interactionType: 'bench', dialogueId: 'bench_sit', collides: true },
    ],
    dialogueOnEnter: 'enter_observatory',
  },
];
