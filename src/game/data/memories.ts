// ============================================================
// Memory Data — Heartfelt texts discovered throughout the world
// ============================================================

export interface MemoryData {
  id: string;
  area: string;
  x: number;
  y: number;
  title: string;
  lines: string[];
}

export const MEMORIES: MemoryData[] = [
  {
    id: 'memory_beginning',
    area: 'cottage',
    x: 1700,
    y: 5600,
    title: 'A New Beginning',
    lines: [
      'Every love story has a beginning...',
      'Ours started with a simple hello.',
      'And from that moment, everything felt different.',
      'Like the world had more color than before.',
    ],
  },
  {
    id: 'memory_first_walk',
    area: 'secretGarden',
    x: 2900,
    y: 5700,
    title: 'Our First Walk',
    lines: [
      'Do you remember our first walk together?',
      'I was nervous, trying to find the right words...',
      'But with you, even the silences felt perfect.',
      'I knew right then — you were someone special.',
    ],
  },
  {
    id: 'memory_laughter',
    area: 'roseGarden',
    x: 1800,
    y: 4700,
    title: 'Your Laughter',
    lines: [
      'Your laughter is my favorite sound.',
      'It fills the air like cherry blossoms in spring.',
      'Every time you laugh, the world becomes lighter.',
      'I hope I never stop making you smile.',
    ],
  },
  {
    id: 'memory_quiet_moment',
    area: 'crystalLake',
    x: 3400,
    y: 4500,
    title: 'Quiet Moments',
    lines: [
      'Some of my favorite memories are the quiet ones.',
      'Just sitting beside you, watching the world go by.',
      'No words needed.',
      'Just your presence — warm, gentle, and real.',
    ],
  },
  {
    id: 'memory_greenhouse',
    area: 'greenhouse',
    x: 1700,
    y: 3800,
    title: 'Cozy Shelters',
    lines: [
      'Like plants in a greenhouse, we built our own shelter.',
      'A warm, quiet space away from all the noise outside.',
      'Safe from the cold wind.',
      'Just you, me, and the things we grew together.',
    ],
  },
  {
    id: 'memory_plaza',
    area: 'centralPlaza',
    x: 3100,
    y: 3600,
    title: 'Shared Journeys',
    lines: [
      'In the middle of the busy city plaza, I held your hand.',
      'The noise of the crowd faded away completely.',
      'It didn\'t matter where we were heading...',
      'As long as we were walking together.',
    ],
  },
  {
    id: 'memory_maze',
    area: 'maze',
    x: 2200,
    y: 2400,
    title: 'Finding Each Other',
    lines: [
      'Sometimes the paths were confusing and tangled.',
      'Like a maze with no clear exit.',
      'But we always found our way back to each other.',
      'Because our hearts knew the way.',
    ],
  },
  {
    id: 'memory_church',
    area: 'forgottenChurch',
    x: 2200,
    y: 1200,
    title: 'A Silent Vow',
    lines: [
      'Under the high arches of the quiet church...',
      'We made a silent promise to each other.',
      'To stand by one another through the seasons.',
      'A vow that time itself cannot erase.',
    ],
  },
];

export const BIRTHDAY_MESSAGE = {
  title: 'Happy Birthday ❤️',
  lines: [
    'To the most wonderful person in my world,',
    'thank you for being you.',
    '',
    'Every moment with you is a gift,',
    'and I am so grateful to share this life with you.',
    '',
    'I love you more than words can say.',
    'Happy Birthday, my love. 🌸',
  ],
};
