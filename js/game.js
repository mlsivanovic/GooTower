// Glavna petlja i logika igre: nivo, unos (drag & drop kuglica), cev, pobeda/poraz.

import { WORLD, GOO, PIPE } from './config.js';
import { World, dist } from './physics.js';
import { GooBall, attachCandidates } from './goo.js';
import { LEVELS } from './levels.js';
import { store } from './storage.js';
import { ui } from './ui.js';
import { sfx } from './audio.js';
import * as R from './render.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
  state: 'menu',       // menu | playing | win | fail
  levelIndex: 0,
  level: null,
  world: null,
  balls: [],
  collected: 0,
  pipeActive: false,
  suckTimer: 0,
  particles: [],
  time: 0,
  held: null,
  pointer: { x: 0, y: 0, down: false, vx: 0, vy: 0 },
  view: { scale: 1, ox: 0, oy: 0 },
};

// ---------- Nivo ----------

function startLevel(index) {
  const level = LEVELS[index];
  game.levelIndex = index;
  game.level = level;
  game.world = new World(level);
  game.balls = [];
  game.collected = 0;
  game.pipeActive = false;
  game.suckTimer = 0;
  game.particles = [];
  game.held = null;
  game.state = 'playing';

  // početna konstrukcija
  const pts = level.initial.nodes.map(([x, y]) => game.world.addPoint(x, y));
  for (const [i, j] of level.initial.struts) game.world.addStrut(pts[i], pts[j]);
  if (level.initial.fixed) for (const i of level.initial.fixed) pts[i].pinned = true;

  // slobodne kuglice — rasporedi ih po početnim gredama (ako ih ima)
  const struts = game.world.struts;
  for (let i = 0; struts.length && i < level.total; i++) {
    const s = struts[i % struts.length];
    const t = Math.random();
    const b = new GooBall(
      s.a.x + (s.b.x - s.a.x) * t,
      s.a.y + (s.b.y - s.a.y) * t - 4
    );
    b.state = 'crawl';
    b.strut = s;
    b.t = t;
    b.dir = Math.random() < 0.5 ? -1 : 1;
    game.balls.push(b);
  }

  ui.startHud(level);
  updateHud();
}

function updateHud() {
  ui.updateHud(game.collected, game.level.required, freeBalls().length);
}

function freeBalls() {
  return game.balls.filter(b => ['crawl', 'walk', 'falling', 'held'].includes(b.state));
}

// ---------- Unos ----------

function toWorld(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left - game.view.ox) / game.view.scale,
    y: (e.clientY - r.top - game.view.oy) / game.view.scale,
  };
}

canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);
  const p = toWorld(e);
  game.pointer.x = p.x; game.pointer.y = p.y; game.pointer.down = true;
  game.pointer.vx = 0; game.pointer.vy = 0;
  if (game.state !== 'playing') return;

  let best = null, bestD = GOO.grabRadius;
  for (const b of game.balls) {
    if (!['crawl', 'walk', 'falling'].includes(b.state)) continue;
    const d = dist(p.x, p.y, b.x, b.y);
    if (d < bestD) { bestD = d; best = b; }
  }
  if (best) {
    best.grab();
    game.held = best;
    sfx.grab();
  }
});

canvas.addEventListener('pointermove', e => {
  const p = toWorld(e);
  const dtp = 1 / 60;
  game.pointer.vx = game.pointer.vx * 0.7 + ((p.x - game.pointer.x) / dtp) * 0.3;
  game.pointer.vy = game.pointer.vy * 0.7 + ((p.y - game.pointer.y) / dtp) * 0.3;
  game.pointer.x = p.x; game.pointer.y = p.y;
});

function releaseHeld() {
  const b = game.held;
  if (!b) return;
  game.held = null;
  // kuglica je "na kursoru" — puštanje važi tamo gde je pokazivač
  b.x = game.pointer.x;
  b.y = game.pointer.y;
  const cands = attachCandidates(game.world, b.x, b.y);
  if (cands.length >= GOO.minAttach) {
    // kuglica postaje čvor konstrukcije
    const node = game.world.addPoint(b.x, b.y);
    for (const c of cands) {
      const rest = Math.max(GOO.minStrut, Math.min(c.d * 0.95, 125));
      game.world.addStrut(node, c.p, rest);
    }
    b.state = 'node';
    game.balls = game.balls.filter(x => x !== b);
    sfx.attach();
    spawnParticles(b.x, b.y, '#3a3a42', 8);
  } else {
    b.release(game.pointer.vx * 0.6, game.pointer.vy * 0.6);
    sfx.drop();
  }
  updateHud();
}

window.addEventListener('pointerup', () => {
  game.pointer.down = false;
  if (game.state === 'playing') releaseHeld();
});

// ---------- Efekti ----------

function spawnParticles(x, y, color, n, spread = 140) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = Math.random() * spread;
    game.particles.push({
      x, y,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40,
      r: 2 + Math.random() * 4,
      life: 0.5 + Math.random() * 0.3, maxLife: 0.8,
      color,
    });
  }
}

function updateParticles(dt) {
  for (const pt of game.particles) {
    pt.life -= dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vy += 500 * dt;
  }
  game.particles = game.particles.filter(p => p.life > 0);
}

// ---------- Šiljci / sečiva ----------

function checkHazards() {
  const hz = game.level.hazards;
  if (!hz || !hz.length) return;
  const touch = GOO.radius * 0.55;

  // slobodne (i držane) kuglice — dodir = kraj
  for (const b of game.balls) {
    if (!['crawl', 'walk', 'falling', 'held'].includes(b.state)) continue;
    for (const h of hz) {
      if (dist(b.x, b.y, h.x, h.y) < h.r + touch) {
        b.state = 'lost';
        if (b === game.held) game.held = null;
        break;
      }
    }
  }

  // čvorovi konstrukcije — sečivo ih otkida (fiksni oslonci su otporni)
  const dead = [];
  for (const p of game.world.points) {
    if (p.pinned) continue;
    for (const h of hz) {
      if (dist(p.x, p.y, h.x, h.y) < h.r + touch) { dead.push(p); break; }
    }
  }
  for (const p of dead) destroyNode(p);
}

function destroyNode(p) {
  spawnParticles(p.x, p.y, '#3a3a42', 10);
  const removed = game.world.strutsAt(p);
  for (const b of game.balls) {
    if (b.strut && removed.includes(b.strut)) b.detachToFalling();
  }
  game.world.struts = game.world.struts.filter(s => s.a !== p && s.b !== p);
  game.world.points = game.world.points.filter(x => x !== p);
  sfx.lost();
}

// ---------- Cev i kraj nivoa ----------

function updatePipe(dt) {
  const { pipe } = game.level;
  const inRange = game.world.points.some(p => dist(p.x, p.y, pipe.x, pipe.y) < PIPE.activateRadius);
  if (inRange && !game.pipeActive) {
    game.pipeActive = true;
    sfx.pipeOn();
  }
  if (!game.pipeActive) return;

  game.suckTimer += dt;
  if (game.suckTimer >= PIPE.suckInterval) {
    game.suckTimer = 0;
    // usisaj najbližu slobodnu kuglicu (držanu ne diramo)
    let best = null, bestD = Infinity;
    for (const b of game.balls) {
      if (!['crawl', 'walk', 'falling'].includes(b.state)) continue;
      const d = dist(b.x, b.y, pipe.x, pipe.y);
      if (d < bestD) { bestD = d; best = b; }
    }
    if (best) {
      best.state = 'sucked';
      best.suckFrom = { x: best.x, y: best.y };
      best.suckT = 0;
      sfx.suck();
    }
  }
}

function updateSucked(dt) {
  const { pipe } = game.level;
  for (const b of game.balls) {
    if (b.state !== 'sucked') continue;
    b.suckT += dt / PIPE.suckDuration;
    const t = Math.min(1, b.suckT);
    const e = t * t * (3 - 2 * t);
    // blagi luk ka otvoru cevi
    const mx = (b.suckFrom.x + pipe.x) / 2;
    const my = Math.min(b.suckFrom.y, pipe.y) - 60;
    const it = 1 - e;
    b.x = it * it * b.suckFrom.x + 2 * it * e * mx + e * e * pipe.x;
    b.y = it * it * b.suckFrom.y + 2 * it * e * my + e * e * pipe.y;
    if (b.suckT >= 1) {
      b.state = 'collected';
      game.collected++;
      spawnParticles(pipe.x, pipe.y, '#b6e36b', 6, 80);
      updateHud();
    }
  }
  game.balls = game.balls.filter(b => b.state !== 'collected');
}

function checkEnd() {
  if (game.state !== 'playing') return;
  const free = freeBalls().length;
  const sucking = game.balls.some(b => b.state === 'sucked');
  if (free > 0 || sucking) return;

  if (game.collected >= game.level.required) {
    game.state = 'win';
    store.levelDone(game.level.id, game.levelIndex, game.collected);
    sfx.win();
    ui.showWin(game.level, game.levelIndex, game.collected);
  } else {
    game.state = 'fail';
    sfx.fail();
    ui.showFail(game.pipeActive
      ? 'Premalo kuglica je stiglo do cevi.'
      : 'Konstrukcija nije stigla do cevi, a kuglica više nema.');
  }
}

// ---------- Petlja ----------

let last = 0;
let acc = 0;
const STEP = 1 / 60;

function frame(ts) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (ts - last) / 1000 || 0);
  last = ts;
  game.time += dt;

  if (game.state === 'playing' || game.state === 'win' || game.state === 'fail') {
    acc += dt;
    while (acc >= STEP) {
      tick(STEP);
      acc -= STEP;
    }
  }
  draw();
}

function tick(dt) {
  const { world, level } = game;
  if (!world) return;

  // držana kuglica prati pokazivač (praktično zalepljena, kao u originalu)
  if (game.held) {
    const b = game.held;
    const k = Math.min(1, dt * 50);
    b.x += (game.pointer.x - b.x) * k;
    b.y += (game.pointer.y - b.y) * k;
  }

  world.step(dt);
  for (const b of game.balls) b.update(dt, world, level);
  if (game.state === 'playing') checkHazards();
  const lost = game.balls.filter(b => b.state === 'lost');
  if (lost.length) {
    for (const b of lost) spawnParticles(b.x, Math.min(b.y, level.killY), '#222', 6);
    sfx.lost();
    game.balls = game.balls.filter(b => b.state !== 'lost');
    updateHud();
  }

  if (game.state === 'playing') {
    updatePipe(dt);
    updateSucked(dt);
    checkEnd();
  }
  updateParticles(dt);
}

// ---------- Render ----------

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  game.view.scale = Math.min(window.innerWidth / WORLD.w, window.innerHeight / WORLD.h);
  game.view.ox = (window.innerWidth - WORLD.w * game.view.scale) / 2;
  game.view.oy = (window.innerHeight - WORLD.h * game.view.scale) / 2;
  game.view.dpr = dpr;
}
window.addEventListener('resize', resize);
resize();

function draw() {
  const { dpr } = game.view;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0b0e12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!game.level) return;
  ctx.setTransform(game.view.scale * dpr, 0, 0, game.view.scale * dpr, game.view.ox * dpr, game.view.oy * dpr);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, WORLD.w, WORLD.h);
  ctx.clip();

  R.drawBackground(ctx, game.level, game.time);
  R.drawPipe(ctx, game.level, game.pipeActive, game.time);
  R.drawStruts(ctx, game.world);

  // preview kačenja za držanu kuglicu
  if (game.held) {
    const cands = attachCandidates(game.world, game.held.x, game.held.y);
    const valid = cands.length >= GOO.minAttach;
    if (cands.length) R.drawPreview(ctx, game.held.x, game.held.y, cands, valid);
  }

  const look = { x: game.pointer.x, y: game.pointer.y };
  for (const b of game.balls) R.drawBall(ctx, b, look, game.time);
  if (game.level.hazards) R.drawHazards(ctx, game.level.hazards, game.time);
  R.drawParticles(ctx, game.particles);

  ctx.restore();
}

// ---------- Start ----------

ui.onStartLevel = i => startLevel(i);
ui.onRestart = () => startLevel(game.levelIndex);
ui.onQuit = () => {
  game.state = 'menu';
  game.level = null;
  ui.show('menu');
};

ui.init();
ui.show('menu');
requestAnimationFrame(frame);
