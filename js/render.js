// Sav canvas render: pozadina (nebo, dekor, brda), platforme, cev, grede,
// kuglice, baloni, vetar, efekti.

import { WORLD, GOO, COLORS, PIPE, BALLOON } from './config.js';

export function drawBackground(ctx, level, time) {
  const g = ctx.createLinearGradient(0, 0, 0, WORLD.h);
  g.addColorStop(0, level.sky[0]);
  g.addColorStop(1, level.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);

  const decor = level.decor || {};

  // zvezde (trepere)
  if (decor.stars) {
    ctx.save();
    for (let i = 0; i < decor.stars; i++) {
      const x = (i * 193 + 71) % WORLD.w;
      const y = (i * 89 + 23) % 420;
      const tw = 0.35 + 0.45 * Math.abs(Math.sin(time * (0.6 + (i % 5) * 0.23) + i));
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#fff8e0';
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();
  }

  // sunce/mesec — pozicija i toplina iz dekora
  const sun = decor.sun !== undefined ? decor.sun : { x: 1050, y: 120, warm: true };
  if (sun) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    const col = sun.warm ? '255,244,214' : '228,238,255';
    const sg = ctx.createRadialGradient(sun.x, sun.y, 10, sun.x, sun.y, 90);
    sg.addColorStop(0, `rgba(${col},0.95)`);
    sg.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = sg;
    ctx.fillRect(sun.x - 110, sun.y - 110, 220, 220);
    ctx.restore();
  }

  // oblaci — meke elipse koje sporo plutaju (brže po vetru)
  if (decor.clouds) {
    ctx.save();
    const drift = 12 + Math.abs(level.wind || 0) * 0.18;
    const dir = (level.wind || 0) < 0 ? -1 : 1;
    for (let i = 0; i < decor.clouds; i++) {
      const w = 90 + (i % 3) * 45;
      const span = WORLD.w + 2 * w;
      let x = (i * 331 + 140 + dir * time * drift * (0.6 + (i % 3) * 0.35)) % span;
      if (x < 0) x += span;
      x -= w;
      const y = 50 + (i * 97) % 240;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.ellipse(x, y, w * 0.55, 20, 0, 0, Math.PI * 2);
      ctx.ellipse(x - w * 0.25, y + 8, w * 0.35, 15, 0, 0, Math.PI * 2);
      ctx.ellipse(x + w * 0.28, y + 6, w * 0.4, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // brda (talasasti horizonti)
  for (const hill of level.hills) {
    ctx.fillStyle = hill.color;
    ctx.beginPath();
    ctx.moveTo(0, WORLD.h);
    for (let x = 0; x <= WORLD.w; x += 16) {
      const y = hill.y + Math.sin(x * 0.01 * hill.freq + hill.y) * hill.amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(WORLD.w, WORLD.h);
    ctx.closePath();
    ctx.fill();
  }

  // siluete (zupčanici, dimnjaci, ruševine) — između brda i platformi
  if (decor.props) {
    for (const pr of decor.props) drawProp(ctx, pr, time);
  }

  // platforme
  for (const pl of level.platforms) {
    ctx.fillStyle = level.ground;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    ctx.fillStyle = level.groundTop;
    ctx.fillRect(pl.x, pl.y, pl.w, 14);
    // travnati rub
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(pl.x, pl.y, pl.w, 4);
  }
}

// Silueta u pozadini: zupčanik koji se sporo okreće, dimnjak sa dimom, ruševina.
function drawProp(ctx, pr, time) {
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = 'rgba(20, 22, 28, 0.85)';
  if (pr.type === 'gear') {
    ctx.translate(pr.x, pr.y);
    ctx.rotate(time * 0.25 * (pr.s > 60 ? 1 : -1));
    const r = pr.s, teeth = 10;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const rr = i % 2 === 0 ? r : r * 0.8;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (pr.type === 'chimney') {
    const w = pr.s * 0.55, h = pr.s * 2.4;
    ctx.fillRect(pr.x - w / 2, pr.y - h, w, h);
    ctx.fillRect(pr.x - w * 0.75, pr.y - h - 10, w * 1.5, 12);
    // dim — rastuće blede pahulje
    for (let i = 0; i < 3; i++) {
      const t = (time * 0.35 + i / 3) % 1;
      ctx.globalAlpha = 0.25 * (1 - t);
      ctx.fillStyle = '#c8c8cc';
      ctx.beginPath();
      ctx.arc(pr.x + Math.sin(t * 5 + i) * 14, pr.y - h - 18 - t * 90, 8 + t * 22, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pr.type === 'ruin') {
    // polomljeni stubovi
    for (let i = 0; i < 3; i++) {
      const w = pr.s * 0.28;
      const h = pr.s * (1.1 - i * 0.3);
      ctx.fillRect(pr.x + i * pr.s * 0.45 - w / 2, pr.y - h, w, h);
    }
  } else if (pr.type === 'pipes') {
    ctx.lineWidth = Math.max(10, pr.s * 0.22);
    ctx.strokeStyle = 'rgba(20, 22, 28, 0.85)';
    ctx.lineJoin = 'round';
    for (let i = 0; i < 3; i++) {
      const x = pr.x + i * pr.s * 0.42;
      const h = pr.s * (1.2 + (i % 2) * 0.55);
      ctx.beginPath();
      ctx.moveTo(x, pr.y);
      ctx.lineTo(x, pr.y - h);
      ctx.lineTo(x + pr.s * 0.45, pr.y - h);
      ctx.stroke();
    }
  } else if (pr.type === 'tower') {
    const w = pr.s * 0.7, h = pr.s * 2.6;
    ctx.fillRect(pr.x - w / 2, pr.y - h, w, h);
    ctx.beginPath();
    ctx.moveTo(pr.x - w * 0.65, pr.y - h);
    ctx.lineTo(pr.x, pr.y - h - pr.s * 0.7);
    ctx.lineTo(pr.x + w * 0.65, pr.y - h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(160,190,205,0.18)';
    for (let y = pr.y - h + pr.s * 0.45; y < pr.y - pr.s * 0.3; y += pr.s * 0.55) {
      ctx.fillRect(pr.x - pr.s * 0.1, y, pr.s * 0.2, pr.s * 0.28);
    }
  } else if (pr.type === 'roots') {
    ctx.strokeStyle = 'rgba(20, 22, 28, 0.85)';
    ctx.lineWidth = Math.max(5, pr.s * 0.12);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(pr.x + (i - 2) * pr.s * 0.2, pr.y - pr.s * 1.8);
      ctx.bezierCurveTo(pr.x + Math.sin(i) * pr.s, pr.y - pr.s,
        pr.x - Math.cos(i * 2) * pr.s, pr.y - pr.s * 0.4,
        pr.x + (i - 2) * pr.s * 0.35, pr.y);
      ctx.stroke();
    }
  } else if (pr.type === 'reactor') {
    ctx.translate(pr.x, pr.y);
    ctx.strokeStyle = 'rgba(20, 22, 28, 0.85)';
    for (let i = 1; i <= 3; i++) {
      ctx.lineWidth = Math.max(4, pr.s * 0.12);
      ctx.beginPath();
      ctx.arc(0, 0, pr.s * i * 0.34, time * 0.12 * i, Math.PI * (1.35 + i * 0.18));
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(20, 22, 28, 0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, pr.s * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Atmosfera preko pozadine: vetar-pramenovi + ambijentalne čestice.
// Sve je stateless (determinističke petlje po vremenu) — nema stanja za čuvanje.
export function drawAtmosphere(ctx, level, time) {
  const wind = level.wind || 0;

  // lelujave linije vetra — jasno pokazuju smer i jačinu
  if (wind) {
    ctx.save();
    ctx.lineWidth = 2;
    const n = 16;
    const span = WORLD.w + 260;
    for (let i = 0; i < n; i++) {
      const speed = Math.abs(wind) * (0.9 + (i % 4) * 0.18);
      let x = (i * 219 + time * speed) % span;
      if (wind < 0) x = span - x;
      x -= 130;
      const y = 40 + (i * 431) % 560 + Math.sin(time * 1.3 + i) * 9;
      const len = 46 + (i % 3) * 26;
      const dir = Math.sign(wind);
      ctx.globalAlpha = 0.10 + (i % 3) * 0.05;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + dir * len * 0.4, y - 7, x + dir * len * 0.7, y + 7, x + dir * len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ambijentalne čestice: listovi / pahulje / žar / kiša / mehurići
  const kind = level.decor?.particles;
  if (kind) {
    ctx.save();
    const n = kind === 'rain' ? 30 : kind === 'bubbles' ? 18 : 12;
    for (let i = 0; i < n; i++) {
      const rising = kind === 'embers' || kind === 'bubbles';
      const fall = kind === 'rain' ? 250 + (i % 4) * 35
        : rising ? -28 - (i % 3) * 10 : 26 + (i % 4) * 9;
      const spanY = WORLD.h + 60;
      let y = ((i * 173 + time * Math.abs(fall)) % spanY) - 30;
      if (fall < 0) y = spanY - y - 60;
      const sway = Math.sin(time * (0.8 + (i % 3) * 0.3) + i * 2.1) * 26;
      let x = ((i * 337 + 60 + time * wind * 0.16) % (WORLD.w + 80)) + sway;
      if (x < -40) x += WORLD.w + 80;
      x -= 40;
      if (kind === 'leaves') {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = i % 2 ? '#c9873b' : '#a8642e';
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * (1 + (i % 3) * 0.4) + i);
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (kind === 'snow') {
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = '#eef2f6';
        ctx.beginPath();
        ctx.arc(x, y, 2.4 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      } else if (kind === 'rain') {
        ctx.globalAlpha = 0.28 + (i % 3) * 0.08;
        ctx.strokeStyle = '#c6e6ff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + wind * 0.025, y + 18);
        ctx.stroke();
      } else if (kind === 'bubbles') {
        ctx.globalAlpha = 0.22 + (i % 3) * 0.09;
        ctx.strokeStyle = '#b8f2ef';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(x, y, 3 + (i % 4) * 1.5, 0, Math.PI * 2);
        ctx.stroke();
      } else { // žar
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(time * 3 + i);
        ctx.fillStyle = i % 2 ? '#ff9b4a' : '#e2556a';
        ctx.beginPath();
        ctx.arc(x, y, 1.8 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

// Puzzle uređaji: lokalni ventilatori, prekidači, kapije i pokretne platforme.
export function drawMechanisms(ctx, world, time) {
  for (const fan of world.fans) drawFan(ctx, fan, time);

  for (const mover of world.movers) {
    const pl = mover.platform;
    ctx.save();
    const g = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
    g.addColorStop(0, '#9caab2');
    g.addColorStop(1, '#47545d');
    ctx.fillStyle = g;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    ctx.fillStyle = '#d8e2e6';
    ctx.fillRect(pl.x, pl.y, pl.w, 5);
    ctx.fillStyle = '#d89b3f';
    for (let x = pl.x + 12; x < pl.x + pl.w - 6; x += 28) {
      ctx.fillRect(x, pl.y + pl.h - 7, 15, 4);
    }
    ctx.restore();
  }

  for (const gate of world.gates) {
    const pl = gate.platform;
    ctx.save();
    const g = ctx.createLinearGradient(pl.x, 0, pl.x + pl.w, 0);
    g.addColorStop(0, '#303942');
    g.addColorStop(0.5, '#7b8992');
    g.addColorStop(1, '#303942');
    ctx.fillStyle = g;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    ctx.fillStyle = 'rgba(216,226,230,0.28)';
    for (let y = pl.y + 16; y < pl.y + pl.h; y += 34) {
      ctx.fillRect(pl.x + 6, y, pl.w - 12, 5);
    }
    ctx.fillStyle = gate.progress > 0.96 ? '#8ee36b' : '#e06a4e';
    ctx.beginPath();
    ctx.arc(pl.x + pl.w / 2, pl.y + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const sw of world.switches) {
    ctx.save();
    ctx.fillStyle = '#303942';
    ctx.fillRect(sw.x - 5, sw.y - 4, sw.w + 10, 12);
    ctx.fillStyle = sw.active ? '#8ee36b' : '#d86a4f';
    const press = sw.pressed ? 3 : 0;
    ctx.fillRect(sw.x, sw.y - 10 + press, sw.w, 8);
    ctx.globalAlpha = sw.active ? 0.35 : 0.12;
    ctx.fillRect(sw.x - 4, sw.y - 14, sw.w + 8, 16);
    ctx.restore();
  }
}

function drawFan(ctx, fan, time) {
  const dx = fan.fx || 0, dy = fan.fy || 0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len, ny = dy / len;
  const cx = dx > 0 ? fan.x + 22 : dx < 0 ? fan.x + fan.w - 22 : fan.x + fan.w / 2;
  const cy = dy > 0 ? fan.y + 22 : dy < 0 ? fan.y + fan.h - 22 : fan.y + fan.h / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(fan.x, fan.y, fan.w, fan.h);
  ctx.clip();
  ctx.strokeStyle = 'rgba(220,244,255,0.23)';
  ctx.lineWidth = 2;
  const travelSpan = Math.hypot(fan.w, fan.h) + 80;
  for (let i = 0; i < 13; i++) {
    const travel = ((time * len * 0.08 + i * 73) % travelSpan) - 40;
    const cross = ((i * 97) % 240) - 120;
    const x = cx + nx * travel - ny * cross;
    const y = cy + ny * travel + nx * cross;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - nx * (32 + i % 3 * 14), y - ny * (32 + i % 3 * 14));
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#303942';
  ctx.beginPath();
  ctx.arc(0, 0, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.rotate(time * 7 * (dx + dy >= 0 ? 1 : -1));
  ctx.fillStyle = '#9caab2';
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(10, 0, 15, 6, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#d89b3f';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Voda menja uzgon, lava uništava kuglice i čvorove.
export function drawLiquids(ctx, level, time) {
  for (const liquid of level.liquids || []) {
    ctx.save();
    if (liquid.type === 'lava') {
      const g = ctx.createLinearGradient(0, liquid.y, 0, liquid.y + liquid.h);
      g.addColorStop(0, 'rgba(255,142,45,0.92)');
      g.addColorStop(0.22, 'rgba(204,58,31,0.94)');
      g.addColorStop(1, 'rgba(73,15,20,0.98)');
      ctx.fillStyle = g;
      ctx.fillRect(liquid.x, liquid.y, liquid.w, liquid.h);
      ctx.fillStyle = '#ffd36a';
      for (let i = 0; i < 10; i++) {
        const x = liquid.x + ((i * 127 + time * (18 + i % 3 * 8)) % liquid.w);
        const r = 3 + i % 4;
        const y = liquid.y + 7 + Math.sin(time * 2.4 + i) * 4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const g = ctx.createLinearGradient(0, liquid.y, 0, liquid.y + liquid.h);
      g.addColorStop(0, 'rgba(84,205,220,0.42)');
      g.addColorStop(1, 'rgba(21,72,116,0.78)');
      ctx.fillStyle = g;
      ctx.fillRect(liquid.x, liquid.y, liquid.w, liquid.h);
      ctx.strokeStyle = 'rgba(201,249,244,0.72)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = liquid.x; x <= liquid.x + liquid.w; x += 12) {
        const y = liquid.y + Math.sin(x * 0.035 + time * 2.2) * 4;
        if (x === liquid.x) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function drawPipe(ctx, level, active, time) {
  const { x, y, dir } = level.pipe;
  const W = 58, mouthR = 30;
  const pulse = active ? 1 + Math.sin(time * 8) * 0.06 : 1;

  ctx.save();
  const body = '#7d8a8f';
  const bodyDark = '#5b666a';
  const rim = active ? '#b6e36b' : '#8f9ca1';

  if (dir === 'down') {
    const grad = ctx.createLinearGradient(x - W / 2, 0, x + W / 2, 0);
    grad.addColorStop(0, bodyDark);
    grad.addColorStop(0.5, body);
    grad.addColorStop(1, bodyDark);
    ctx.fillStyle = grad;
    ctx.fillRect(x - W / 2, -10, W, y + 10);
    // prsten
    ctx.fillStyle = bodyDark;
    ctx.fillRect(x - W / 2 - 6, y - 26, W + 12, 16);
  } else if (dir === 'up') {
    const grad = ctx.createLinearGradient(x - W / 2, 0, x + W / 2, 0);
    grad.addColorStop(0, bodyDark);
    grad.addColorStop(0.5, body);
    grad.addColorStop(1, bodyDark);
    ctx.fillStyle = grad;
    ctx.fillRect(x - W / 2, y, W, WORLD.h - y + 10);
    // prsten
    ctx.fillStyle = bodyDark;
    ctx.fillRect(x - W / 2 - 6, y + 10, W + 12, 16);
  } else { // 'left'
    const grad = ctx.createLinearGradient(0, y - W / 2, 0, y + W / 2);
    grad.addColorStop(0, bodyDark);
    grad.addColorStop(0.5, body);
    grad.addColorStop(1, bodyDark);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y - W / 2, WORLD.w - x + 10, W);
    ctx.fillStyle = bodyDark;
    ctx.fillRect(x + 10, y - W / 2 - 6, 16, W + 12);
  }

  // otvor cevi
  ctx.beginPath();
  ctx.arc(x, y, mouthR * pulse, 0, Math.PI * 2);
  ctx.fillStyle = '#1b2124';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = rim;
  ctx.stroke();

  if (active) {
    ctx.globalAlpha = 0.25 + Math.sin(time * 8) * 0.1;
    ctx.beginPath();
    ctx.arc(x, y, PIPE.activateRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#d6ff8f';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

export function drawStruts(ctx, world) {
  ctx.save();
  ctx.lineCap = 'round';
  for (const s of world.struts) {
    if (s.noCrawl) {
      // balon-kanap — tanka svetla nit
      ctx.strokeStyle = 'rgba(240, 226, 214, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(s.a.x, s.a.y);
      ctx.lineTo(s.b.x, s.b.y);
      ctx.stroke();
      continue;
    }
    // rastegnuta greda je tanja
    const stretch = Math.min(1.6, Math.max(0.6, s.len / s.rest));
    const w = 9 / stretch;
    ctx.strokeStyle = COLORS.strut;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(s.a.x, s.a.y);
    ctx.lineTo(s.b.x, s.b.y);
    ctx.stroke();
    ctx.strokeStyle = COLORS.strutHighlight;
    ctx.lineWidth = Math.max(1.5, w * 0.35);
    ctx.beginPath();
    ctx.moveTo(s.a.x, s.a.y - w * 0.22);
    ctx.lineTo(s.b.x, s.b.y - w * 0.22);
    ctx.stroke();
  }
  // čvorovi konstrukcije — male goo grudve na spojevima (balon se crta posebno)
  for (const p of world.points) {
    if (p.buoyant) continue;
    if (p.pinned) drawAnchor(ctx, p.x, p.y);
    drawGooBody(ctx, p.x, p.y, GOO.radius * 0.92, 0);
  }
  ctx.restore();
}

// Fiksna tačka oslonca (zakovana) — metalni prsten oko čvora.
function drawAnchor(ctx, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, GOO.radius * 1.35, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#c9d2d8';
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#6b747c';
  ctx.stroke();
  ctx.restore();
}

// Šiljci / rotirajuće sečivo — dodir uništava kuglicu.
export function drawHazards(ctx, hazards, time) {
  for (const h of hazards) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(time * 2.2 + h.x);
    const spikes = 9, r = h.r;
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
      const a = (i / spikes) * Math.PI * 2;
      const a2 = ((i + 0.5) / spikes) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a2) * r * 0.52, Math.sin(a2) * r * 0.52);
    }
    ctx.closePath();
    ctx.fillStyle = '#3a3f45';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#aab3ba';
    ctx.stroke();
    // opasna glavčina
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#c0392b';
    ctx.fill();
    ctx.restore();
  }
}

export function drawPreview(ctx, x, y, candidates, valid, balloon = false) {
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = balloon ? COLORS.previewBalloon
    : valid ? COLORS.preview : COLORS.previewBad;
  for (const c of candidates) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(c.p.x, c.p.y);
    ctx.stroke();
  }
  ctx.restore();
}

// Balon — okrugao, crveno-roze, sa očima; radi i za slobodan (b.x/b.y)
// i za zakačen (pozicija njegovog čvora b.node).
export function drawBalloon(ctx, b, look, time) {
  const attached = b.state === 'balloonNode' && b.node;
  const x = attached ? b.node.x : b.x;
  const y = attached ? b.node.y : b.y;
  const r = BALLOON.radius;
  const sway = Math.sin(time * 1.8 + b.id) * 0.06;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);
  let sx = 1, sy = 1.12; // blago izdužen
  if (b.state === 'held') {
    const w = Math.sin(time * 14) * 0.05;
    sx = 1.06 + w; sy = 1.06 - w;
  }
  ctx.scale(sx, sy);

  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.15, 0, 0, r * 1.05);
  g.addColorStop(0, '#f08a9b');
  g.addColorStop(0.55, COLORS.balloon);
  g.addColorStop(1, COLORS.balloonDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  // sjaj
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
  ctx.fill();
  // čvorić na dnu
  ctx.fillStyle = COLORS.balloonDark;
  ctx.beginPath();
  ctx.moveTo(-4, r - 1);
  ctx.lineTo(4, r - 1);
  ctx.lineTo(0, r + 6);
  ctx.closePath();
  ctx.fill();

  // oči — kao kod goo kuglica
  const lx = look ? Math.max(-1, Math.min(1, (look.x - x) / 200)) : 0;
  const ly = look ? Math.max(-1, Math.min(1, (look.y - y) / 200)) : 0;
  const er = r * 0.3;
  for (const side of [-1, 1]) {
    const cx = side * r * 0.34 + lx * 2, cy = -r * 0.2 + ly * 1.5;
    if (b.blinkT > 0) {
      ctx.strokeStyle = '#5c1220';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - er, cy);
      ctx.lineTo(cx + er, cy);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#fdf3f0';
      ctx.beginPath();
      ctx.arc(cx, cy, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#20080c';
      ctx.beginPath();
      ctx.arc(cx + lx * er * 0.5, cy + ly * er * 0.5, er * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawBall(ctx, b, look, time) {
  let { x, y } = b;
  let r = GOO.radius;
  let sx = 1, sy = 1;

  if (b.state === 'sucked') {
    const t = b.suckT;
    r *= 1 - t * 0.55;
    sx = 1 + t * 0.7; sy = 1 - t * 0.4;
  } else if (b.state === 'held') {
    const w = Math.sin(time * 14) * 0.06;
    sx = 1.08 + w; sy = 0.94 - w;
  } else if (b.squish > 0) {
    sx = 1 + b.squish * 0.35; sy = 1 - b.squish * 0.3;
  } else if (b.state === 'crawl' || b.state === 'walk') {
    const w = Math.sin(b.bob) * 0.08;
    sx = 1 + w; sy = 1 - w;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  drawGooBody(ctx, 0, 0, r, 1);

  // oči
  const lx = look ? Math.max(-1, Math.min(1, (look.x - x) / 200)) : (b.dir || 1) * 0.4;
  const ly = look ? Math.max(-1, Math.min(1, (look.y - y) / 200)) : 0;
  const er = r * 0.34;
  const ex = r * 0.36, ey = -r * 0.25;
  for (const side of [-1, 1]) {
    const cx = side * ex + lx * 2, cy = ey + ly * 1.5;
    if (b.blinkT > 0) {
      ctx.strokeStyle = '#0a0a0c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - er, cy);
      ctx.lineTo(cx + er, cy);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#f4f2ee';
      ctx.beginPath();
      ctx.arc(cx, cy, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0a0c';
      ctx.beginPath();
      ctx.arc(cx + lx * er * 0.5, cy + ly * er * 0.5, er * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawGooBody(ctx, x, y, r, glossy) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.15, x, y, r * 1.05);
  g.addColorStop(0, '#4a4a52');
  g.addColorStop(0.55, COLORS.gooBody);
  g.addColorStop(1, COLORS.gooDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (glossy) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y - r * 0.45, r * 0.25, r * 0.15, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawParticles(ctx, particles) {
  for (const pt of particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.r * (pt.life / pt.maxLife), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
