// ============================================================
// Dialogue Data — All dialogue sequences in the game
// ============================================================

export interface DialogueLine {
  speaker?: string;
  text: string;
  portrait?: string;   // texture key for speaker portrait
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  onComplete?: string;  // event name to emit when done
}

export const DIALOGUES: Record<string, DialogueSequence> = {
  // ── Opening ──────────────────────────────────────────
  opening: {
    id: 'opening',
    lines: [
      { text: '...' },
      { text: 'Where am I...?' },
      { text: 'This place... it feels like a dream.' },
      { text: 'The air smells like flowers...' },
      { text: 'I should explore. Something is calling me forward.' },
    ],
    onComplete: 'opening_complete',
  },

  // ── Tutorial ─────────────────────────────────────────
  tutorial: {
    id: 'tutorial',
    lines: [
      { text: 'The flowers bloom wherever I walk...' },
      { text: 'How beautiful.' },
    ],
  },

  // ── Area introductions ───────────────────────────────
  enter_flowerMeadow: {
    id: 'enter_flowerMeadow',
    lines: [
      { text: 'A meadow stretching out as far as I can see...' },
      { text: 'The grass sways gently in the breeze.' },
    ],
  },
  enter_cherryBlossomForest: {
    id: 'enter_cherryBlossomForest',
    lines: [
      { text: 'Cherry blossoms... they are falling like pink snow.' },
      { text: 'This forest feels magical.' },
    ],
  },
  enter_crystalLake: {
    id: 'enter_crystalLake',
    lines: [
      { text: 'A crystal lake, still and shimmering...' },
      { text: 'I can see the sky reflected in the water.' },
    ],
  },
  enter_lanternGarden: {
    id: 'enter_lanternGarden',
    lines: [
      { text: 'So many lanterns... but they are all dark.' },
      { text: 'Maybe I can light them.' },
    ],
  },
  enter_sunflowerField: {
    id: 'enter_sunflowerField',
    lines: [
      { text: 'Sunflowers! They seem to be watching the sun.' },
      { text: 'The golden light here is so warm.' },
    ],
  },
  enter_birthdayGarden: {
    id: 'enter_birthdayGarden',
    lines: [
      { text: 'This place... it is the most beautiful of all.' },
      { text: 'And someone is waiting for me...' },
    ],
  },

  // ── Interactions ─────────────────────────────────────
  bench_sit: {
    id: 'bench_sit',
    lines: [
      { text: 'It feels nice to sit down for a moment.' },
      { text: 'The world is so peaceful from here.' },
    ],
  },
  lantern_light: {
    id: 'lantern_light',
    lines: [
      { text: 'A warm glow fills the air...' },
    ],
  },
  fountain_watch: {
    id: 'fountain_watch',
    lines: [
      { text: 'The water dances in the light...' },
      { text: 'So calming.' },
    ],
  },

  // ── Ending ───────────────────────────────────────────
  ending_meet: {
    id: 'ending_meet',
    lines: [
      { text: 'You found me.' },
      { text: 'I have been waiting for you...' },
      { text: 'Look at all the flowers you planted along the way.' },
      { text: 'Every step you took made this world more beautiful.' },
      { text: 'Just like you make my world more beautiful.' },
      { text: 'Come, walk with me.' },
    ],
    onComplete: 'ending_walk',
  },
  ending_final: {
    id: 'ending_final',
    lines: [
      { text: 'This garden... it was made for you.' },
      { text: 'Every flower, every light, every petal...' },
      { text: 'They are all pieces of how I feel about you.' },
      { text: 'Happy Birthday, my love. ❤️' },
    ],
    onComplete: 'ending_complete',
  },
};
