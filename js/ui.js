// DOM sloj: ekrani (meni, izbor nivoa, kraj), HUD, dugmad.

import { LEVELS, CHAPTERS } from './levels.js';
import { store } from './storage.js';
import { sfx, setMuted } from './audio.js';

const $ = id => document.getElementById(id);

export const ui = {
  onStartLevel: null,   // (index) => void
  onRestart: null,
  onQuit: null,

  init() {
    setMuted(store.muted);
    $('mute-btn').textContent = store.muted ? '🔇' : '🔊';

    $('play-btn').addEventListener('click', () => { sfx.click(); this.show('level-select'); this.renderLevels(); });
    $('ls-back-btn').addEventListener('click', () => { sfx.click(); this.show('menu'); });
    $('restart-btn').addEventListener('click', () => { sfx.click(); this.onRestart?.(); });
    $('home-btn').addEventListener('click', () => { sfx.click(); this.onQuit?.(); });
    $('mute-btn').addEventListener('click', () => {
      store.muted = !store.muted;
      setMuted(store.muted);
      $('mute-btn').textContent = store.muted ? '🔇' : '🔊';
    });
    $('win-next-btn').addEventListener('click', () => { sfx.click(); this.onStartLevel?.(this._nextIndex); });
    $('win-menu-btn').addEventListener('click', () => { sfx.click(); this.show('level-select'); this.renderLevels(); });
    $('fail-retry-btn').addEventListener('click', () => { sfx.click(); this.onRestart?.(); });
    $('fail-menu-btn').addEventListener('click', () => { sfx.click(); this.show('level-select'); this.renderLevels(); });
  },

  show(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('visible'));
    if (name) $(`${name}-screen`)?.classList.add('visible');
    $('hud').classList.toggle('visible', name === null);
  },

  renderLevels() {
    const list = $('levels-list');
    list.innerHTML = '';
    for (const ch of CHAPTERS) {
      const head = document.createElement('div');
      head.className = 'chapter-head';
      head.innerHTML = `<h3>${ch.name}</h3><p>${ch.sub}</p>`;
      list.appendChild(head);
      for (let i = ch.from; i <= ch.to && i < LEVELS.length; i++) {
        const lv = LEVELS[i];
        // prvi nivo svakog poglavlja je uvek otključan (i === ch.from)
        const locked = i + 1 > store.unlocked && i !== ch.from;
        const btn = document.createElement('button');
        btn.className = 'level-card' + (locked ? ' locked' : '');
        const best = store.bestFor(lv.id);
        btn.innerHTML = locked
          ? `<span class="lv-num">🔒</span><span class="lv-name">${lv.name}</span>`
          : `<span class="lv-num">${i + 1}</span><span class="lv-name">${lv.name}</span>
             <span class="lv-sub">${lv.sub}</span>
             <span class="lv-best">${best > 0 ? `⚫ najbolje: ${best}` : ''}</span>`;
        if (!locked) btn.addEventListener('click', () => { sfx.click(); this.onStartLevel?.(i); });
        list.appendChild(btn);
      }
    }
  },

  startHud(level) {
    this.show(null);
    $('level-title').textContent = level.name;
    $('level-title').classList.add('flash');
    setTimeout(() => $('level-title').classList.remove('flash'), 2600);
    const hint = $('hint');
    hint.textContent = level.hint
      || 'Prevuci kuglicu blizu konstrukcije i pusti je da gradiš ka cevi!';
    hint.classList.remove('show');
    void hint.offsetWidth;
    hint.classList.add('show');
    this.updateHud(0, level.required, level.total,
      level.balloons ? level.balloons.length : null);
  },

  updateHud(collected, required, freeLeft, balloons = null) {
    $('goo-count').textContent = `${collected} / ${required}`;
    $('goo-left').textContent = `⚫ ${freeLeft}`;
    const bEl = $('balloon-count');
    bEl.style.display = balloons === null ? 'none' : '';
    if (balloons !== null) bEl.textContent = `🎈 ${balloons}`;
  },

  showWin(level, index, collected) {
    this._nextIndex = (index + 1) % LEVELS.length;
    const isLast = index === LEVELS.length - 1;
    $('win-title').textContent = isLast ? 'SVE ZAVRŠENO!' : 'NIVO ZAVRŠEN!';
    $('win-stats').textContent = `Skupljeno kuglica: ${collected} (traženo ${level.required})`;
    $('win-next-btn').textContent = isLast ? '⟳ Igraj ponovo' : 'Sledeći ▶';
    this.show('win');
  },

  showFail(reason) {
    $('fail-reason').textContent = reason;
    this.show('fail');
  },
};
