// Proceduralni zvuk (Web Audio) — nema audio fajlova, sve se sintetiše.

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function tone({ freq = 440, to = null, dur = 0.15, type = 'sine', vol = 0.2, delay = 0 }) {
  if (muted) return;
  const a = ac();
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.08, vol = 0.15, freq = 900, delay = 0 }) {
  if (muted) return;
  const a = ac();
  const t0 = a.currentTime + delay;
  const len = Math.max(1, (dur * a.sampleRate) | 0);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const filter = a.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const gain = a.createGain();
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t0);
}

export const sfx = {
  grab()    { tone({ freq: 300, to: 560, dur: 0.09, type: 'triangle', vol: 0.18 }); noise({ dur: 0.05, freq: 1400, vol: 0.06 }); },
  attach()  { tone({ freq: 520, to: 180, dur: 0.14, type: 'triangle', vol: 0.25 }); noise({ dur: 0.09, freq: 700, vol: 0.12 }); },
  drop()    { noise({ dur: 0.06, freq: 500, vol: 0.1 }); },
  land()    { noise({ dur: 0.05, freq: 350, vol: 0.08 }); },
  suck()    { tone({ freq: 350, to: 1100, dur: 0.32, type: 'sine', vol: 0.2 }); },
  pipeOn()  { tone({ freq: 160, to: 320, dur: 0.4, type: 'square', vol: 0.08 }); tone({ freq: 640, dur: 0.3, vol: 0.1, delay: 0.1 }); },
  lost()    { tone({ freq: 400, to: 120, dur: 0.35, type: 'sawtooth', vol: 0.1 }); },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.22, type: 'triangle', vol: 0.2, delay: i * 0.12 }));
  },
  fail() {
    [330, 262, 196].forEach((f, i) => tone({ freq: f, dur: 0.3, type: 'triangle', vol: 0.18, delay: i * 0.16 }));
  },
  click()   { tone({ freq: 700, dur: 0.05, type: 'square', vol: 0.06 }); },
};
