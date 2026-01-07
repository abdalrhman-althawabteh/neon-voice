// Simple synth sounds using Web Audio API to avoid external asset dependencies

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

// Muffled mechanical click (Low pitch, short decay)
export const playStartSound = () => {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Route: Osc -> Filter -> Gain -> Destination
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  // Low frequency for "thud" sound
  osc.type = 'square'; // Square wave gives a bit of body
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

  // Lowpass filter to make it "muffled"
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, ctx.currentTime);

  // Volume envelope (louder than before: 0.3)
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// Higher pitched mechanical click (Latch release)
export const playStopSound = () => {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, ctx.currentTime); // Slightly higher start
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, ctx.currentTime);

  // Volume envelope (louder: 0.3)
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

export const playTypeSound = () => {
  const ctx = getContext();
  // Create a short burst of noise
  const bufferSize = ctx.sampleRate * 0.015; // 15ms (slightly longer)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const gain = ctx.createGain();
  // Bandpass filter to make it sound like a key switch
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  // Increased volume for typing (0.05 -> 0.15)
  gain.gain.value = 0.15; 
  
  noise.start();
};
