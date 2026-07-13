// Verlet fizika: tačke (čvorovi konstrukcije) + distance constraints (grede).
// Elastičnost dolazi iz namerno "mekog" solvera (stiffness < 1) — konstrukcija
// se njiše i uvija kao u World of Goo.

import { PHYS, GOO, BALLOON, LIQUID, MECHANISM } from './config.js';

export class Point {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.px = x; this.py = y;   // prethodna pozicija (Verlet)
    this.dragged = false;        // dok je držimo, ne integriše se
    this.pinned = false;         // fiksna tačka (zakovana za tavanicu/obalu)
    this.buoyant = false;        // balon-čvor: uzgon umesto gravitacije
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
    this.platforms = level.platforms.map(pl => ({ ...pl }));
    this.wind = level.wind || 0;      // horizontalno ubrzanje (px/s^2), + = udesno
    this.liquids = (level.liquids || []).map(liquid => ({ ...liquid }));
    this.fans = (level.fans || []).map(fan => ({ ...fan }));
    this.switches = (level.switches || []).map(sw => ({
      ...sw, pressed: false, latched: false, active: false,
    }));
    this.gates = (level.gates || []).map(gate => {
      const platform = { x: gate.x, y: gate.y, w: gate.w, h: gate.h, mechanism: 'gate' };
      this.platforms.push(platform);
      return {
        ...gate,
        toX: gate.toX ?? gate.x,
        toY: gate.toY ?? gate.y - gate.h - 24,
        progress: 0,
        platform,
      };
    });
    this.movers = (level.movers || []).map(mover => {
      const platform = { x: mover.x, y: mover.y, w: mover.w, h: mover.h, mechanism: 'mover' };
      this.platforms.push(platform);
      return {
        ...mover,
        toX: mover.toX ?? mover.x,
        toY: mover.toY ?? mover.y,
        progress: 0,
        platform,
      };
    });
    this.time = 0;
  }

  updateEnvironment(dt, balls = []) {
    this.time += dt;
    const liveBalls = balls.filter(b =>
      !['lost', 'sucked', 'collected', 'balloonNode', 'held'].includes(b.state));
    const bodies = [...this.points, ...liveBalls];

    for (const sw of this.switches) {
      sw.pressed = bodies.some(body =>
        body.x >= sw.x && body.x <= sw.x + sw.w
        && body.y >= sw.y - MECHANISM.switchDepth && body.y <= sw.y + 12);
      if (sw.latch && sw.pressed) sw.latched = true;
      sw.active = sw.latch ? sw.latched : sw.pressed;
    }

    for (const gate of this.gates) {
      const target = this.switchActive(gate.switch) ? 1 : 0;
      gate.progress = approach(gate.progress, target,
        (gate.speed || MECHANISM.gateSpeed) * dt);
      gate.platform.x = mix(gate.x, gate.toX, gate.progress);
      gate.platform.y = mix(gate.y, gate.toY, gate.progress);
    }

    const carried = [
      ...this.points,
      ...liveBalls.filter(b => b.state === 'walk' || b.state === 'falling'),
    ];
    for (const mover of this.movers) {
      if (mover.switch) {
        const target = this.switchActive(mover.switch) ? 1 : 0;
        mover.progress = approach(mover.progress, target,
          (mover.speed || 0.45) * dt);
      } else {
        const period = mover.period || 4;
        const phase = (mover.phase || 0) * Math.PI * 2;
        mover.progress = 0.5 - Math.cos(this.time * Math.PI * 2 / period + phase) * 0.5;
      }
      this.movePlatform(mover.platform,
        mix(mover.x, mover.toX, mover.progress),
        mix(mover.y, mover.toY, mover.progress), carried);
    }
  }

  switchActive(id) {
    return this.switches.some(sw => sw.id === id && sw.active);
  }

  movePlatform(platform, x, y, bodies) {
    const dx = x - platform.x, dy = y - platform.y;
    if (dx || dy) {
      for (const body of bodies) {
        const onTop = body.x >= platform.x - GOO.radius
          && body.x <= platform.x + platform.w + GOO.radius
          && Math.abs(body.y - (platform.y - GOO.radius)) < 24;
        if (!onTop) continue;
        body.x += dx; body.y += dy;
        if ('px' in body) { body.px += dx; body.py += dy; }
      }
    }
    platform.x = x;
    platform.y = y;
  }

  liquidAt(x, y) {
    return this.liquids.find(liquid => x >= liquid.x && x <= liquid.x + liquid.w
      && y >= liquid.y && y <= liquid.y + liquid.h) || null;
  }

  forceAt(x, y, buoyant = false) {
    let ax = this.wind;
    let ay = buoyant ? -BALLOON.lift : PHYS.gravity;
    for (const fan of this.fans) {
      if (x < fan.x || x > fan.x + fan.w || y < fan.y || y > fan.y + fan.h) continue;
      ax += fan.fx || 0;
      ay += fan.fy || 0;
    }
    const liquid = this.liquidAt(x, y);
    let drag = PHYS.damping;
    if (liquid?.type === 'water') {
      ay -= LIQUID.waterLift;
      drag *= LIQUID.waterDrag;
    }
    if (buoyant) ax *= BALLOON.windFactor;
    return { ax, ay, drag, liquid };
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
    for (const p of this.points) {
      if (p.dragged || p.pinned) { p.px = p.x; p.py = p.y; continue; }
      const force = this.forceAt(p.x, p.y, p.buoyant);
      let vx = (p.x - p.px) * force.drag;
      let vy = (p.y - p.py) * force.drag;
      // limit pomeraja — sprečava eksploziju solvera
      const v = Math.hypot(vx, vy);
      if (v > PHYS.maxSpeed) { vx = vx / v * PHYS.maxSpeed; vy = vy / v * PHYS.maxSpeed; }
      p.px = p.x; p.py = p.y;
      p.x += vx + force.ax * h * h;
      p.y += vy + force.ay * h * h;
    }
  }

  solveStruts() {
    const k = PHYS.stiffness;
    for (const s of this.struts) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const diff = (dist - s.rest) / dist * k;
      const ax = dx * diff * 0.5, ay = dy * diff * 0.5;
      const aFree = !s.a.dragged && !s.a.pinned, bFree = !s.b.dragged && !s.b.pinned;
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
      if (p.dragged || p.pinned) continue;
      for (const pl of this.platforms) {
        collideCircleRect(p, r, pl);
      }
    }
  }
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function approach(value, target, amount) {
  if (value < target) return Math.min(target, value + amount);
  return Math.max(target, value - amount);
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
