// ============================================================
// AudioSystem — Procedural ambient audio via Web Audio API
// No external audio files needed. Generates all sounds at runtime.
// ============================================================

import { GameScene } from '../scenes/GameScene';

export class AudioSystem {
  private scene: GameScene;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;
  private windNode: OscillatorNode | null = null;
  private windGain: GainNode | null = null;
  private ambientInterval: number | null = null;

  constructor(scene: GameScene) {
    this.scene = scene;

    // Initialize on first user interaction (browser policy)
    const initAudio = () => {
      if (this.initialized) return;
      this.initialized = true;

      try {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.15;
        this.masterGain.connect(this.ctx.destination);

        this.startWind();
        this.startBirdChirps();
      } catch (_e) {
        // Audio not available
      }

      scene.input.off('pointerdown', initAudio);
      if (scene.input.keyboard) {
        scene.input.keyboard.off('keydown', initAudio);
      }
    };

    scene.input.on('pointerdown', initAudio);
    if (scene.input.keyboard) {
      scene.input.keyboard.on('keydown', initAudio);
    }
  }

  private startWind(): void {
    if (!this.ctx || !this.masterGain) return;

    // Wind = filtered white noise
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.08;

    noiseSource.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    noiseSource.start();

    // Modulate wind
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(this.windGain.gain);
    lfo.start();
  }

  private startBirdChirps(): void {
    if (!this.ctx || !this.masterGain) return;

    const ctx = this.ctx;
    const master = this.masterGain;

    // Occasional bird chirps
    this.ambientInterval = window.setInterval(() => {
      if (Math.random() > 0.3) return;
      if (!ctx || ctx.state === 'closed') return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Random chirp
      const baseFreq = 1200 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200 + Math.random() * 300, now + 0.08);
      osc.frequency.linearRampToValueAtTime(baseFreq - 100, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.2);
    }, 3000 + Math.random() * 4000);
  }

  /** Play a soft chime (for interactions) */
  playChime(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.1);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /** Play ascending tone (for flower bloom) */
  playBloom(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, now);
    osc.frequency.linearRampToValueAtTime(600 + Math.random() * 300, now + 0.2);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  destroy(): void {
    if (this.ambientInterval) clearInterval(this.ambientInterval);
    if (this.ctx) this.ctx.close();
  }
}
