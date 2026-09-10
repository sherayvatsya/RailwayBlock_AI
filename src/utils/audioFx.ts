// Web Audio API based Sound Engine for RailBlock AI
// Uses pure browser synthesis (sine, triangle, harmonic chords) for zero-latency, 100% reliable sound effects without external MP3 dependencies.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize AudioContext on user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Subtle UI click / tab switch
  public playClick(freq = 600, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio context autoplay restrictions
    }
  }

  // Affirmative chime when submitting a new task
  public playNewTaskSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const startTime = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Ignore
    }
  }

  // Rich celebratory harmonic chord progression when AI Optimization plan is generated
  public playOptimizationPlanSuccess() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Chords: D-Major -> G-Major -> A-Major -> D-High Major Fanfare
      const chords = [
        [293.66, 369.99, 440.0],       // D4, F#4, A4
        [392.0, 493.88, 587.33],       // G4, B4, D5
        [440.0, 554.37, 659.25],       // A4, C#5, E5
        [587.33, 739.99, 880.0, 1174.66] // D5, F#5, A5, D6
      ];

      chords.forEach((chord, chordIdx) => {
        const chordStart = ctx.currentTime + chordIdx * 0.16;
        const duration = chordIdx === chords.length - 1 ? 0.7 : 0.25;

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = chordIdx === chords.length - 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, chordStart);

          gain.gain.setValueAtTime(0, chordStart);
          gain.gain.linearRampToValueAtTime(0.09, chordStart + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(chordStart);
          osc.stop(chordStart + duration);
        });
      });
    } catch {
      // Ignore
    }
  }

  // Official Sanction / Approval sound (Deep, resonant confirmation tone)
  public playSanctionSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const startTime = ctx.currentTime + i * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // What-if Scenario / Quantum Sweep sound (futuristic cyber sweep)
  public playScenarioSweep() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      // Low pass filter for warm cyber feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundManager();
