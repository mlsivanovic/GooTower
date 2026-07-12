// Verlet fizika: tačke (čvorovi konstrukcije) + distance constraints (grede).
// Elastičnost dolazi iz namerno "mekog" solvera (stiffness < 1) — konstrukcija
// se njiše i uvija kao u World of Goo.

import { PHYS, GOO } from './config.js';

export class Point {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.px = x; this.py = y;   // prethodna pozicija (Verlet)
    this.dragged = false;        // dok je držimo, ne integriše se
    this.onGround = false;
  }
  setVelocity(vx, vy, dt) {
    this.px = this.x - vx * dt;
    this.py = this.y - vy * dt;
  }
}

export class Strut {
  constructor(a, b, rest) {
    this.a = a; this.b = b;
    this.rest = rest;
    this.len = rest; // trenutna dužina (keš za render/crawl)
  }
}

export class World {
  constructor(level) {
    this.points = [];
    this.struts = [];
    this.platforms = level.platforms; // [{x,y,w,h}]
  }

  addPoint(x, y) {
    const p = new Point(x, y);
    this.points.push(p);
    return p;
  }

  addStrut(a, b, rest) {
    if (this.hasStrut(a, b)) return null;
    const s = new Strut(a, b, rest ?? Math.hypot(b.x - a.x, b.y - a.y));
    this.struts.push(s);
    return s;
  }

  hasStrut(a, b) {
    return this.struts.some(s => (s.a === a && s.b === b) || (s.a === b && s.b === a));
  }

  strutsAt(p) {
    return this.struts.filter(s => s.a === p || s.b === p);
  }

  step(dt) {
    const h = dt / PHYS.substeps;
    for (let s = 0; s < PHYS.substeps; s++) {
      this.integrate(h);
      for (let i = 0; i < PHYS.iterations; i++) {
        this.solveStruts();
        this.collide();
      }
    }
    for (const s of this.struts) s.len = Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y);
  }

  integrate(h) {
    const g = PHYS.gravity * h * h;
    for (const p of this.points) {
      if (p.dragged) { p.px = p.x; p.py = p.y; continue; }
      let vx = (p.x - p.px) * PHYS.damping;
      let vy = (p.y - p.py) * PHYS.damping;
      // limit pomeraja — sprečava eksploziju solvera
      const v = Math.hypot(vx, vy);
      if (v > PHYS.maxSpeed) { vx = vx / v * PHYS.maxSpeed; vy = vy / v * PHYS.maxSpeed; }
      p.px = p.x; p.py = p.y;
      p.x += vx;
      p.y += vy + g;
    }
  }

  solveStruts() {
    const k = PHYS.stiffness;
    for (const s of this.struts) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const diff = (dist - s.rest) / dist * k;
      const ax = dx * diff * 0.5, ay = dy * diff * 0.5;
      const aFree = !s.a.dragged, bFree = !s.b.dragged;
      if (aFree && bFree) {
        s.a.x += ax; s.a.y += ay;
        s.b.x -= ax; s.b.y -= ay;
      } else if (aFree) {
        s.a.x += ax * 2; s.a.y += ay * 2;
      } else if (bFree) {
        s.b.x -= ax * 2; s.b.y -= ay * 2;
      }
    }
  }

  collide() {
    const r = GOO.radius;
    for (const p of this.points) {
      p.onGround = false;
      if (p.dragged) continue;
      for (const pl of this.platforms) {
        collideCircleRect(p, r, pl);
      }
    }
  }
}

// Izbaci tačku iz pravougaonika po najkraćoj osi + trenje na kontaktu.
export function collideCircleRect(p, r, rect) {
  const cx = Math.max(rect.x, Math.min(p.x, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(p.y, rect.y + rect.h));
  let dx = p.x - cx, dy = p.y - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return false;

  if (d2 > 0.0001) {
    const d = Math.sqrt(d2);
    const push = (r - d) / d;
    p.x += dx * push;
    p.y += dy * push;
    if (dy < 0) applyContactFriction(p);
  } else {
    // centar unutar pravougaonika — izbaci po najbližoj ivici
    const left = p.x - rect.x, right = rect.x + rect.w - p.x;
    const top = p.y - rect.y, bottom = rect.y + rect.h - p.y;
    const m = Math.min(left, right, top, bottom);
    if (m === top) { p.y = rect.y - r; applyContactFriction(p); }
    else if (m === bottom) p.y = rect.y + rect.h + r;
    else if (m === left) p.x = rect.x - r;
    else p.x = rect.x + rect.w + r;
  }
  p.onGround = true;
  return true;
}

function applyContactFriction(p) {
  const vx = p.x - p.px;
  p.px += vx * PHYS.groundFriction;
}

export function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

export function pointOnStrut(s, t) {
  return {
    x: s.a.x + (s.b.x - s.a.x) * t,
    y: s.a.y + (s.b.y - s.a.y) * t,
  };
}
