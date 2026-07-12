// Trajno stanje (localStorage): otključani nivoi, najbolji rezultati, mute.

import { STORAGE_KEY } from './config.js';

const defaults = { unlocked: 1, best: {}, muted: false };

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (e) { /* privatni mod i sl. */ }
  return { ...defaults };
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { }
}

export const store = {
  get unlocked() { return state.unlocked; },
  get muted() { return state.muted; },
  set muted(m) { state.muted = m; save(); },
  bestFor(id) { return state.best[id] || 0; },
  levelDone(id, index, collected) {
    if (collected > (state.best[id] || 0)) state.best[id] = collected;
    if (index + 2 > state.unlocked) state.unlocked = index + 2;
    save();
  },
};
