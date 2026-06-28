# 🌸 Nyni's Birthday Garden — Asset Replacement Guide

All game assets are managed dynamically using the [AssetManifest.ts](file:///e:/Nyni%20Bday/src/game/assets/AssetManifest.ts) configuration. By default, the game uses procedurally drawn shapes as fallbacks so that it runs completely out-of-the-box without needing any external asset downloads.

To customize the game and make it look like a polished indie HD-2D game, you can drop free assets from sites like [Kenney.nl](https://kenney.nl/), [Itch.io](https://itch.io/), or [OpenGameArt.org](https://opengameart.org/) and update the manifest.

---

## 📁 Folder Structure for Assets

Place all custom images, spritesheets, and audio files in the public directory:
```
e:\Nyni Bday\public\
├── assets/
│   ├── player/
│   │   └── walk.png              # Multi-frame character spritesheet
│   ├── environment/
│   │   ├── trees.png
│   │   ├── flowers.png
│   │   └── tileset.png
│   └── ui/
│       └── dialogue_box.png
└── audio/
    ├── music_peaceful.mp3        # Custom background music loops
    └── sfx_bloom.wav             # Custom sound effects
```

---

## ⚙️ How to Update the Manifest

To swap a fallback shape with a real asset file, edit [AssetManifest.ts](file:///e:/Nyni%20Bday/src/game/assets/AssetManifest.ts).

### 1. Simple Static Image
Change the `type` to `'image'` and add the `path` relative to the public directory:
```typescript
{
  key: 'tree_cherry',
  type: 'image',
  path: 'assets/environment/tree_cherry.png'
}
```

### 2. Animations / Spritesheets
Change the `type` to `'spritesheet'`, add `path`, and specify frame sizes:
```typescript
{
  key: 'player_down',
  type: 'spritesheet',
  path: 'assets/player/walk_down.png',
  frameWidth: 32,
  frameHeight: 48
}
```

---

## 🎨 Recommended Free Asset Packs

Here are excellent free packs that perfectly fit the cozy, romantic, and dreamy garden aesthetic:

1. **Cozy Farm / Garden Packs (Itch.io)**
   - Search for: "Cozy Farm" or "Cozy Garden" by *shikashi* or *Sprout Lands*.
   - Great for: Flower variations, grass tiles, wooden fences, lanterns, and bridges.

2. **Pixel Art Characters (Itch.io / Kenney)**
   - Kenney's "Pixel Shmup" or cozy RPG character packs.
   - Look for "Cozy RPG characters" with 4-directional walking animations.

3. **Nature Elements (OpenGameArt)**
   - Search for: "Pixel Art Trees" or "Cherry Blossom Trees" on OpenGameArt.
   - Great for large cherry blossom trees and weeping willows.

---

## 🎵 Customizing Audio (Optional)

Currently, the game uses the Web Audio API to procedurally synthesize ambient wind, bird chirps, chimes, and flower blooming tones so it is completely self-contained. 

To replace this with high-quality MP3s:
1. Update [AudioSystem.ts](file:///e:/Nyni%20Bday/src/game/systems/AudioSystem.ts) to load and play audio assets via Phaser's standard loader.
