/**
 * All sound is synthesized — no audio files. These helpers build buffers and
 * node graphs on a given AudioContext.
 */

/** Looping brown-noise buffer (deep cave air). */
export function brownNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const rate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, rate * seconds, rate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

/** Decaying-noise impulse response for cave reverb (generated, not loaded). */
export function caveImpulse(ctx: AudioContext, seconds = 2.8, decay = 3.2): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buffer;
}

/** One water drip: sine blip with fast downward pitch envelope. */
export function playDrip(ctx: AudioContext, out: AudioNode, when: number, gainVal: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const freq = 800 + Math.random() * 1400;
  osc.frequency.setValueAtTime(freq, when);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, when + 0.08);
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(gainVal, when + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
  osc.connect(gain).connect(out);
  osc.start(when);
  osc.stop(when + 0.3);
}

/** Short filtered-noise burst — one torch crackle pop. */
export function playCrackle(ctx: AudioContext, out: AudioNode, when: number, gainVal: number) {
  const len = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800 + Math.random() * 2600;
  filter.Q.value = 1.2;
  const gain = ctx.createGain();
  gain.gain.value = gainVal * (0.4 + Math.random() * 0.6);
  src.connect(filter).connect(gain).connect(out);
  src.start(when);
}

/** Low rumble swell for maze shifts. */
export function playRumble(ctx: AudioContext, out: AudioNode, duration = 2.2) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(38, now);
  osc.frequency.linearRampToValueAtTime(26, now + duration);
  const noise = ctx.createBufferSource();
  noise.buffer = brownNoiseBuffer(ctx, 2);
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 120;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.5, now + duration * 0.25);
  gain.gain.setValueAtTime(0.5, now + duration * 0.6);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 6.5;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain).connect(gain.gain);
  osc.connect(gain);
  noise.connect(noiseFilter).connect(gain);
  gain.connect(out);
  osc.start(now);
  noise.start(now);
  lfo.start(now);
  osc.stop(now + duration + 0.1);
  noise.stop(now + duration + 0.1);
  lfo.stop(now + duration + 0.1);
}

/** Bell-like chime from additive sine partials. */
export function playChime(
  ctx: AudioContext,
  out: AudioNode,
  base = 523.25,
  notes: number[] = [1, 1.335, 2],
  gainVal = 0.16,
) {
  const now = ctx.currentTime;
  notes.forEach((ratio, i) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = base * ratio;
    const gain = ctx.createGain();
    const start = now + i * 0.09;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(gainVal / (i + 1), start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + 2.4);
  });
}

/** Dull thud for wrong answers / sealed doors. */
export function playThud(ctx: AudioContext, out: AudioNode) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.connect(gain).connect(out);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** Small ascending pluck for item pickup. */
export function playPickup(ctx: AudioContext, out: AudioNode) {
  const now = ctx.currentTime;
  [660, 880].forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = f;
    const gain = ctx.createGain();
    const start = now + i * 0.07;
    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

/** Stone unlock clunk + soft shimmer. */
export function playUnlock(ctx: AudioContext, out: AudioNode) {
  playThud(ctx, out);
  playChime(ctx, out, 392, [1, 1.5], 0.1);
}

/** Mysterious shimmer for secrets. */
export function playSecret(ctx: AudioContext, out: AudioNode) {
  playChime(ctx, out, 740, [1, 1.26, 1.5, 2], 0.12);
}
