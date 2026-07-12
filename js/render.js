// Sav canvas render: pozadina, platforme, cev, grede, kuglice, efekti.

import { WORLD, GOO, COLORS, PIPE } from './config.js';

export function drawBackground(ctx, level, time) {
  const g = ctx.createLinearGradient(0, 0, 0, WORLD.h);
  g.addColorStop(0, level.sky[0]);
  g.addColorStop(1, level.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);

  // sunce/mesec
  ctx.save();
  ctx.globalAlpha = 0.55;
  const sg = ctx.createRadialGradient(1050, 120, 10, 1050, 120, 90);
  sg.addColorStop(0, 'rgba(255,255,240,0.95)');
  sg.addColorStop(1, 'rgba(255,255,240,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(940, 10, 220, 220);
  ctx.restore();

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
  // čvorovi konstrukcije — male goo grudve na spojevima
  for (const p of world.points) {
    drawGooBody(ctx, p.x, p.y, GOO.radius * 0.92, 0);
  }
  ctx.restore();
}

export function drawPreview(ctx, x, y, candidates, valid) {
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = valid ? COLORS.preview : COLORS.previewBad;
  for (const c of candidates) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(c.p.x, c.p.y);
    ctx.stroke();
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
