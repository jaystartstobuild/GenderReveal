/**
 * Magical Audio Synthesizer using Web Audio API
 * Generates sparkling chimes, celebratory harp arpeggios, and ambient music box tones
 * No external assets required — 100% reliable offline & instant load!
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientPlaying = false;
    this.ambientInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSparkle(pitchMultiplier = 1) {
    if (this.isMuted) return;
    this.init();

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * pitchMultiplier, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      }, idx * 60);
    });
  }

  playVote(type = 'pink') {
    if (this.isMuted) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = type === 'pink' ? 587.33 : 440.00; // D5 for pink, A4 for blue
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playCelebration() {
    if (this.isMuted) return;
    this.init();

    // Joyous fanfare arpeggio (C Major chord progression)
    const chordNotes = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      659.25, 783.99, 1046.50, 1318.51, // E5, G5, C6, E6
      783.99, 1046.50, 1318.51, 1567.98  // G5, C6, E6, G6
    ];

    chordNotes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
      }, idx * 75);
    });
  }

  toggleAmbient() {
    this.init();
    if (this.ambientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    this.ambientPlaying = true;
    const melody = [
      392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99 // G4 to G5 pentatonic
    ];

    const playAmbientNote = () => {
      if (!this.ambientPlaying || this.isMuted || !this.ctx) return;
      const note = melody[Math.floor(Math.random() * melody.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
    };

    playAmbientNote();
    this.ambientInterval = setInterval(playAmbientNote, 1200);
  }

  stopAmbient() {
    this.ambientPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

window.soundEffects = new SoundEffects();
