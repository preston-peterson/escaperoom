import type { AmbienceProfile, SoundCue } from '../types.ts';
import { useGameStore } from '../state/store.ts';
import { loadSettings, saveSettings } from '../save/persistence.ts';
import {
  brownNoiseBuffer,
  caveImpulse,
  playChime,
  playCrackle,
  playDrip,
  playPickup,
  playRumble,
  playSecret,
  playThud,
  playUnlock,
} from './generators.ts';

/**
 * Singleton ambience + cue engine. Created on the first user gesture (title
 * screen click) to satisfy autoplay policy; afterwards it subscribes to the
 * game store and reacts to dispatch notes and room changes.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private bedGains: { tone: GainNode; wind: GainNode } | null = null;
  private dripTimer: ReturnType<typeof setTimeout> | null = null;
  private crackleTimer: ReturnType<typeof setTimeout> | null = null;
  private ambience: AmbienceProfile = { drip: 0, torch: 0, wind: 0, tone: 'mid' };
  private lastSeq = 0;
  private lastRoom: string | null = null;
  muted = false;
  volume = 0.7;

  /** Idempotent; must be called from a user gesture. */
  init() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;

    const settings = loadSettings();
    this.muted = settings.muted;
    this.volume = settings.volume;

    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume;
    this.master.connect(ctx.destination);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = caveImpulse(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.35;
    this.reverb.connect(reverbGain).connect(this.master);

    // Continuous cave-air bed: brown noise through two filters.
    const noise = ctx.createBufferSource();
    noise.buffer = brownNoiseBuffer(ctx);
    noise.loop = true;
    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = 'lowpass';
    toneFilter.frequency.value = 160;
    const tone = ctx.createGain();
    tone.gain.value = 0.05;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 480;
    windFilter.Q.value = 0.4;
    const wind = ctx.createGain();
    wind.gain.value = 0;
    noise.connect(toneFilter).connect(tone).connect(this.master);
    noise.connect(windFilter).connect(wind).connect(this.master);
    noise.start();
    this.bedGains = { tone, wind };

    this.scheduleDrips();
    this.scheduleCrackles();
    this.subscribe();
  }

  get initialized() {
    return this.ctx !== null;
  }

  private wet(): AudioNode {
    // Cues go to both dry master and cave reverb.
    return this.reverb ?? this.master!;
  }

  private subscribe() {
    useGameStore.subscribe((store) => {
      if (!this.ctx || store.seq === this.lastSeq) return;
      this.lastSeq = store.seq;
      const notes = store.lastNotes;
      if (notes) {
        for (const cue of notes.sounds) this.playCue(cue);
      }
      const room = store.state?.currentRoom ?? null;
      if (room !== this.lastRoom && store.world && room) {
        this.lastRoom = room;
        const profile = store.world.rooms[room]?.ambience;
        if (profile) this.setAmbience(profile);
      }
    });
  }

  playCue(cue: SoundCue) {
    if (!this.ctx || !this.master) return;
    const out = this.master;
    const wet = this.wet();
    switch (cue) {
      case 'chime':
        playChime(this.ctx, wet);
        break;
      case 'rumble':
        playRumble(this.ctx, out);
        break;
      case 'pickup':
        playPickup(this.ctx, out);
        break;
      case 'unlock':
        playUnlock(this.ctx, wet);
        break;
      case 'thud':
        playThud(this.ctx, wet);
        break;
      case 'secret':
        playSecret(this.ctx, wet);
        break;
    }
  }

  setAmbience(profile: AmbienceProfile) {
    this.ambience = profile;
    if (!this.ctx || !this.bedGains) return;
    const t = this.ctx.currentTime;
    const toneLevel =
      profile.tone === 'deep' ? 0.085 : profile.tone === 'low' ? 0.06 : 0.04;
    this.bedGains.tone.gain.linearRampToValueAtTime(toneLevel, t + 2.5);
    this.bedGains.wind.gain.linearRampToValueAtTime(profile.wind * 0.05, t + 2.5);
  }

  private scheduleDrips() {
    const tick = () => {
      if (this.ctx && this.ambience.drip > 0.01) {
        playDrip(this.ctx, this.wet(), this.ctx.currentTime, 0.12 * this.ambience.drip);
      }
      const interval = 900 + Math.random() * 4200 * (1.1 - this.ambience.drip);
      this.dripTimer = setTimeout(tick, interval);
    };
    this.dripTimer = setTimeout(tick, 1500);
  }

  private scheduleCrackles() {
    const tick = () => {
      if (this.ctx && this.master && this.ambience.torch > 0.01) {
        playCrackle(this.ctx, this.master, this.ctx.currentTime, 0.08 * this.ambience.torch);
      }
      const interval = 120 + Math.random() * 900 * (1.2 - this.ambience.torch);
      this.crackleTimer = setTimeout(tick, interval);
    };
    this.crackleTimer = setTimeout(tick, 800);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ctx && this.master) {
      this.master.gain.linearRampToValueAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime + 0.15,
      );
    }
    const settings = loadSettings();
    saveSettings({ ...settings, muted });
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.ctx && this.master && !this.muted) {
      this.master.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.1);
    }
    const settings = loadSettings();
    saveSettings({ ...settings, volume });
  }

  dispose() {
    if (this.dripTimer) clearTimeout(this.dripTimer);
    if (this.crackleTimer) clearTimeout(this.crackleTimer);
    void this.ctx?.close();
    this.ctx = null;
  }
}

export const audioEngine = new AudioEngine();
