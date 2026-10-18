// עזרות צליל באמצעות Web Audio API – ללא קבצים חיצוניים
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(ctx, freq, start, duration, type = 'sine', gain = 0.2) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(ctx.destination);
  const t = ctx.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

// צליל ניצחון – אקורד עולה ושמח
export function playVictory() {
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
  notes.forEach((f, i) => tone(ctx, f, i * 0.12, 0.32, 'triangle', 0.25));
  // אקורד סיום
  [523.25, 659.25, 783.99, 1046.50].forEach(f => tone(ctx, f, 0.52, 0.7, 'triangle', 0.18));
}

// צליל הפסד – יורד ועצוב
export function playDefeat() {
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [392, 349.23, 311.13, 261.63]; // יורד
  notes.forEach((f, i) => tone(ctx, f, i * 0.2, 0.45, 'sawtooth', 0.16));
}

// צליל אזעקה מלחיץ – סירנה לסירוגין
export function playAlarm() {
  const ctx = getCtx();
  if (!ctx) return;
  for (let i = 0; i < 4; i++) {
    tone(ctx, 880, i * 0.42, 0.2, 'square', 0.13);
    tone(ctx, 660, i * 0.42 + 0.21, 0.2, 'square', 0.13);
  }
}