/**
 * ElevateOS Soundscape & Audio Feedback Engine
 * Built using Web Audio API for zero-latency, offline-first synthesis
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: 'rain' | 'white_noise' | 'library' | 'cafe' | 'off' = 'off';

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play crisp reward / task complete chime
  public playTaskCompleteSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Polyphonic ascending major chord: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.38);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play Level Up / Quest Fanfare
  public playLevelUpSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const fanfare = [
        { f: 440, t: 0 },
        { f: 554.37, t: 0.1 },
        { f: 659.25, t: 0.2 },
        { f: 880, t: 0.32 },
        { f: 1108.73, t: 0.45 },
      ];

      fanfare.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.15, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + 0.45);
      });
    } catch {
      // Ignore audio policy limits
    }
  }

  // Play Pomodoro Bell
  public playPomodoroBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Harmonic bell tone
      [587.33, 880, 1174.66].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.9);
      });
    } catch {
      // Ignore
    }
  }

  // Ambient sound generator for focus sessions
  public startAmbientSound(type: 'rain' | 'white_noise' | 'library' | 'cafe', volume = 0.2) {
    this.stopAmbientSound();
    try {
      const ctx = this.getContext();
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate pink / brownian noise base
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
        b6 = white * 0.115926;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      // Filter modulation depending on ambient style
      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
      } else if (type === 'white_noise') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.5, ctx.currentTime);
      } else if (type === 'library') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
      } else if (type === 'cafe') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      whiteNoiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoiseSource.start();
      this.ambientNode = whiteNoiseSource;
      this.ambientGain = gain;
      this.currentAmbientType = type;
    } catch {
      // Ignore
    }
  }

  public setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setMasterVolume(vol: number) {
    this.setAmbientVolume(vol);
  }

  public stopAmbientSound() {
    if (this.ambientNode) {
      try {
        (this.ambientNode as AudioScheduledSourceNode).stop();
        this.ambientNode.disconnect();
      } catch {
        // Ignore
      }
      this.ambientNode = null;
    }
    this.currentAmbientType = 'off';
  }

  public getCurrentAmbientType() {
    return this.currentAmbientType;
  }
}

export const soundscapeEngine = new SoundscapeEngine();
