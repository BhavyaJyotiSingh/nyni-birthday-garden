// ============================================================
// Dialogue Data — Narrative sequences in the game
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
      { text: "Don't trust your memories." },
      { text: "Where am I...?" },
      { text: "This place... it feels like a dream." },
      { text: "I should explore. Something is calling me forward." },
    ],
    onComplete: 'opening_complete',
  },

  // ── Tutorial / Hints ─────────────────────────────────
  tutorial: {
    id: 'tutorial',
    lines: [
      { text: 'The flowers bloom wherever I walk...' },
      { text: 'How beautiful.' },
    ],
  },
  maze_hint: {
    id: 'maze_hint',
    lines: [
      { text: 'A faded sign reads: "Follow the butterfly. It knows the paths that were forgotten."' },
    ],
  },

  // ── Area introductions ───────────────────────────────
  enter_secretGarden: {
    id: 'enter_secretGarden',
    lines: [
      { text: 'The Secret Garden... it is enclosed by high fences.' },
      { text: 'The air here smells of lavender.' },
    ],
  },
  enter_roseGarden: {
    id: 'enter_roseGarden',
    lines: [
      { text: 'A path of red roses... it feels warm and inviting.' },
    ],
  },
  enter_crystalLake: {
    id: 'enter_crystalLake',
    lines: [
      { text: 'Crystal Lake. Still and shimmering...' },
      { text: 'Wait... the reflection in the water. It shows two people holding hands.' },
      { text: 'But I am alone.' },
    ],
  },
  enter_greenhouse: {
    id: 'enter_greenhouse',
    lines: [
      { text: 'The Greenhouse. Glass panes reflect the pale sunlight.' },
    ],
  },
  enter_centralPlaza: {
    id: 'enter_centralPlaza',
    lines: [
      { text: 'The Central Plaza. The fountain is singing.' },
      { text: 'Look at the flowers... they form patterns from here.' },
    ],
  },
  enter_maze: {
    id: 'enter_maze',
    lines: [
      { text: 'The Hedge Maze. The walls are tall and shifting.' },
      { text: 'I feel like I could get lost here.' },
    ],
  },
  enter_cherryGarden: {
    id: 'enter_cherryGarden',
    lines: [
      { text: 'Cherry blossoms fall like pink snow...' },
      { text: 'Wait. Someone is lying beneath that tree.' },
    ],
  },
  enter_forgottenChurch: {
    id: 'enter_forgottenChurch',
    lines: [
      { text: 'The Forgotten Church. The silence here is heavy.' },
    ],
  },
  enter_observatory: {
    id: 'enter_observatory',
    lines: [
      { text: 'The Observatory... it is open to a sky full of stars.' },
      { text: 'The giant cherry tree is glowing.' },
    ],
  },

  // ── Interactions ─────────────────────────────────────
  bench_sit: {
    id: 'bench_sit',
    lines: [
      { text: 'It feels nice to sit down for a moment.' },
      { text: 'The world is so quiet from here.' },
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
  dock_look: {
    id: 'dock_look',
    lines: [
      { text: 'The dock stretches into the cold, deep water.' },
    ],
  },
  skip_stones: {
    id: 'skip_stones',
    lines: [
      { text: 'I skipped a stone. It bounced three times before sinking into yesterday.' },
    ],
  },
  greenhouse_inspect: {
    id: 'greenhouse_inspect',
    lines: [
      { text: 'Rare, exotic flowers bloom behind the glass.' },
      { text: 'They are kept safe from the changing world outside.' },
    ],
  },

  // ── Psychological Events ─────────────────────────────
  read_letter: {
    id: 'read_letter',
    lines: [
      { text: 'It\'s a letter written in neat, familiar handwriting:' },
      { text: '"To Nyni. Happy Birthday. Do not forget who you are. The garden lies. Restoring the flowers is the only way to find what was lost. Find me beneath the cherry blossom tree."' },
    ],
  },
  look_mirror: {
    id: 'look_mirror',
    lines: [
      { text: 'I look into the mirror...' },
      { text: 'Wait. My reflection...' },
      { text: 'It isn\'t me. It\'s Bhavya, standing right behind me, staring.' },
      { text: 'But when I turn around... there is nobody there.' },
    ],
  },

  // ── Bhavya Lift ──────────────────────────────────────
  bhavya_lift: {
    id: 'bhavya_lift',
    lines: [
      { text: 'Bhavya looks at me, and gently holds my hand.' },
      { text: '"Let\'s walk together," he whispers, though his lips do not move.' },
    ],
  },

  // ── Siya Shifting Dialogue ───────────────────────────
  siya_talk_1: {
    id: 'siya_talk_1',
    lines: [
      { speaker: 'Siya', text: 'Hey Nyni! I\'m so glad you\'re here. Remember when we used to come here as kids?' },
      { speaker: 'Siya', text: 'We would play tag for hours. Happy Birthday, by the way!' },
    ],
  },
  siya_talk_2: {
    id: 'siya_talk_2',
    lines: [
      { speaker: 'Siya', text: 'Nyni? I didn\'t think you\'d come today. We haven\'t been here since we were children...' },
      { speaker: 'Siya', text: 'Wait, did we come here last week? My head hurts a little.' },
    ],
  },
  siya_talk_3: {
    id: 'siya_talk_3',
    lines: [
      { speaker: 'Siya', text: 'It\'s a beautiful day for your birthday. Although... wasn\'t your birthday in winter?' },
      { speaker: 'Siya', text: 'Or was it summer? Everything feels so blurry today.' },
    ],
  },
  siya_talk_4: {
    id: 'siya_talk_4',
    lines: [
      { speaker: 'Siya', text: 'I don\'t think we\'ve met before. Are you new to the garden?' },
      { speaker: 'Siya', text: 'It\'s nice to meet you. I\'m Siya.' },
    ],
  },

  // ── Eli Shifting Dialogue ────────────────────────────
  eli_talk_1: {
    id: 'eli_talk_1',
    lines: [
      { speaker: 'Eli', text: 'Happy birthday, Nyni! You look so beautiful today. The flowers are blooming just for you! 🌸' },
    ],
  },
  eli_talk_2: {
    id: 'eli_talk_2',
    lines: [
      { speaker: 'Eli', text: 'Don\'t you love the smell of roses? They smell like... yesterday.' },
      { speaker: 'Eli', text: 'Or was it tomorrow? Time is funny here.' },
    ],
  },
  eli_talk_3: {
    id: 'eli_talk_3',
    lines: [
      { speaker: 'Eli', text: 'Have you seen Bhavya? He\'s so quiet.' },
      { speaker: 'Eli', text: 'He\'s always been quiet, hasn\'t he? Like he\'s not really here.' },
    ],
  },
  eli_talk_4: {
    id: 'eli_talk_4',
    lines: [
      { speaker: 'Eli', text: 'He isn\'t sleeping, Nyni.' },
      { speaker: 'Eli', text: 'You\'re just not awake yet.' },
    ],
  },

  // ── Nikhil Notebook Shifting Dialogue ────────────────
  talk_nikhil: {
    id: 'talk_nikhil',
    lines: [
      { speaker: 'Nikhil', text: 'I\'m keeping track of everything in this notebook. The calculations... they don\'t add up.' },
      { speaker: 'Nikhil', text: 'Every time you grow a flower, the coordinates of the world shift. It\'s like the world is being redrawn.' },
      { speaker: 'Nikhil', text: 'You should read the notebook on my desk. The pages keep changing on their own.' },
    ],
  },
  read_notebook_0: {
    id: 'read_notebook_0',
    lines: [
      { text: 'Nikhil\'s Notebook — Page 1:' },
      { text: '"Entry 1: Nyni woke up. The flowers started blooming. The world is reacting to her presence. She must find her way up."' },
    ],
  },
  read_notebook_1: {
    id: 'read_notebook_1',
    lines: [
      { text: 'Nikhil\'s Notebook — Page 2:' },
      { text: '"Entry 2: Nyni found the memory orb in the Greenhouse. (Wait... I haven\'t even been to the Greenhouse yet!)"' },
    ],
  },
  read_notebook_2: {
    id: 'read_notebook_2',
    lines: [
      { text: 'Nikhil\'s Notebook — Page 3:' },
      { text: '"Entry 3: She is dragging him again. She thinks she can save him. But he\'s already gone. She refuses to accept the ending."' },
    ],
  },

  // ── Krish Warning Dialogue ───────────────────────────
  talk_krish_roseGarden: {
    id: 'talk_krish_roseGarden',
    lines: [
      { speaker: 'Krish', text: 'You\'re remembering the wrong story, Nyni.' },
      { speaker: 'Krish', text: 'They want you to believe this is a dream. It isn\'t.' },
    ],
    onComplete: 'talk_krish_roseGarden_done',
  },
  talk_krish_greenhouse: {
    id: 'talk_krish_greenhouse',
    lines: [
      { speaker: 'Krish', text: 'Look closely at Siya. Look closely at Eli. Do they look like they know who they are?' },
      { speaker: 'Krish', text: 'Their memories are shifting because yours are. You are rewriting their lives.' },
    ],
    onComplete: 'talk_krish_greenhouse_done',
  },
  talk_krish_maze: {
    id: 'talk_krish_maze',
    lines: [
      { speaker: 'Krish', text: 'Bhavya is the key. But you\'re holding onto a ghost.' },
      { speaker: 'Krish', text: 'Let him go, or you\'ll be trapped in this garden forever.' },
    ],
    onComplete: 'talk_krish_maze_done',
  },
  talk_krish_forgottenChurch: {
    id: 'talk_krish_forgottenChurch',
    lines: [
      { speaker: 'Krish', text: 'The church was forgotten because we wanted to forget the truth.' },
      { speaker: 'Krish', text: 'Go to the Observatory. He is waiting. But be ready for what you find.' },
    ],
    onComplete: 'talk_krish_forgottenChurch_done',
  },
  talk_krish_observatory: {
    id: 'talk_krish_observatory',
    lines: [
      { speaker: 'Krish', text: 'This is the end of the wrong story. Welcome to the beginning of the right one.' },
    ],
    onComplete: 'talk_krish_observatory_done',
  },

  // ── Ending ───────────────────────────────────────────
  ending_meet: {
    id: 'ending_meet',
    lines: [
      { speaker: 'Bhavya', text: 'Welcome back, Nyni.' },
      { speaker: 'Bhavya', text: 'I have been waiting for you...' },
      { speaker: 'Bhavya', text: 'Look at all the flowers you planted along the way. Every step you took made this world stable.' },
      { speaker: 'Bhavya', text: 'Just like you make my world complete.' },
      { speaker: 'Bhavya', text: 'Happy Birthday, my love. ❤️' },
    ],
    onComplete: 'ending_walk',
  },
  ending_final: {
    id: 'ending_final',
    lines: [
      { text: 'The garden stops changing. Everything becomes stable.' },
      { text: 'Every flower, every light, every petal...' },
      { text: 'They are all pieces of how I feel about you.' },
    ],
    onComplete: 'ending_complete',
  },
};
