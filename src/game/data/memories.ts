// ============================================================
// Memory Data — Heartfelt texts discovered throughout the world
// Edit these messages to personalize the game.
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
    area: 'entranceGarden',
    x: 2200,
    y: 350,
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
    area: 'flowerMeadow',
    x: 2100,
    y: 1200,
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
    area: 'cherryBlossomForest',
    x: 1800,
    y: 2400,
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
    x: 2000,
    y: 3400,
    title: 'Quiet Moments',
    lines: [
      'Some of my favorite memories are the quiet ones.',
      'Just sitting beside you, watching the world go by.',
      'No words needed.',
      'Just your presence — warm, gentle, and real.',
    ],
  },
  {
    id: 'memory_light',
    area: 'lanternGarden',
    x: 2200,
    y: 4400,
    title: 'My Light',
    lines: [
      'You are the light that guides me home.',
      'On dark days, you shine the brightest.',
      'You make even the ordinary feel magical.',
      'Like lanterns in a garden of stars.',
    ],
  },
  {
    id: 'memory_growing',
    area: 'sunflowerField',
    x: 2000,
    y: 5200,
    title: 'Growing Together',
    lines: [
      'Like sunflowers, we grow toward the light.',
      'Every day with you, I become a better person.',
      'We have grown so much together...',
      'And I cannot wait to see where we bloom next.',
    ],
  },
  {
    id: 'memory_promise',
    area: 'birthdayGarden',
    x: 2200,
    y: 5800,
    title: 'A Promise',
    lines: [
      'I want to fill your life with beautiful moments.',
      'To be the person who makes your heart feel safe.',
      'Today, on your birthday, I want you to know...',
      'That every path I walk, I want to walk with you.',
    ],
  },
  {
    id: 'memory_heart',
    area: 'birthdayGarden',
    x: 2600,
    y: 6050,
    title: 'My Heart',
    lines: [
      'If this garden could speak...',
      'It would tell you that every flower is a thought of you.',
      'Every petal, a moment I have cherished.',
      'And every path, a promise that I will always be here.',
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
