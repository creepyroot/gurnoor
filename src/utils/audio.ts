class SoundEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Global volume
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("AudioContext not supported");
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 1) {
    if (!this.ctx || !this.masterGain) return;
    try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  shoot() {
    this.init();
    if (!this.ctx) return;
    this.playTone(800, 'square', 0.1, 0.5);
    setTimeout(() => this.playTone(600, 'square', 0.1, 0.5), 50);
  }

  explosion() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    
    try {
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noiseSource.start();
    } catch (e) {}
  }

  eat() {
    this.init();
    this.playTone(1200, 'sine', 0.1, 0.8);
    setTimeout(() => this.playTone(1600, 'sine', 0.15, 0.8), 50);
  }

  error() {
    this.init();
    this.playTone(200, 'sawtooth', 0.3, 1);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.4, 1), 150);
  }

  success() {
    this.init();
    this.playTone(400, 'sine', 0.1);
    setTimeout(() => this.playTone(500, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(600, 'sine', 0.2), 200);
  }
}

export const soundEngine = new SoundEngine();
