// Goo kuglice — slobodne kuglice koje šetaju po konstrukciji, padaju,
// hodaju po tlu i mogu da se prevuku i zakače kao novi čvorovi.

import { GOO, PHYS } from './config.js';
import { collideCircleRect, pointOnStrut, dist } from './physics.js';

let nextId = 1;

export class GooBall {
  constructor(x, y, type = 'goo') {
    this.id = nextId++;
    this.type = type;       // 'goo' | 'balloon'
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.state = 'falling'; // falling | crawl | walk | held | sucked | node | balloonNode | lost
    this.node = null;       // za balloonNode: Point na koji je balon vezan
    this.strut = null;      // greda po kojoj šeta
    this.t = 0;             // pozicija na gredi 0..1
    this.dir = 1;
    this.speed = GOO.crawlSpeed * (0.75 + Math.random() * 0.5);
    this.blink = Math.random() * 4 + 1;
    this.blinkT = 0;
    this.bob = Math.random() * Math.PI * 2;
    this.squish = 0;
    // za animaciju usisavanja
    this.suckFrom = null;
    this.suckT = 0;
  }

  update(dt, world, level) {
    this.bob += dt * 4;
    this.blink -= dt;
    if (this.blink <= 0) { this.blinkT = 0.13; this.blink = Math.random() * 4 + 1.5; }
    if (this.blinkT > 0) this.blinkT -= dt;
    if (this.squish > 0) this.squish -= dt * 3;

    switch (this.state) {
      case 'crawl': this.updateCrawl(dt, world); break;
      case 'falling': this.updateFalling(dt, world, level); break;
      case 'walk': this.updateWalk(dt, world, level); break;
    }

    // zakačen balon prati svoj čvor (fizika ga pomera)
    if (this.state === 'balloonNode' && this.node) {
      this.x = this.node.x;
      this.y = this.node.y;
    }

    if (this.state !== 'node' && this.state !== 'balloonNode' && this.y > level.killY) {
      this.state = 'lost';
    }
  }

  updateCrawl(dt, world) {
    const s = this.strut;
    if (!s || !world.struts.includes(s)) { this.detachToFalling(); return; }
    const len = Math.max(s.len, 1);
    this.t += this.dir * (this.speed / len) * dt;

    if (this.t > 1 || this.t < 0) {
      const node = this.t > 1 ? s.b : s.a;
      const options = world.strutsAt(node).filter(x => x !== s && !x.noCrawl);
      if (options.length && Math.random() < 0.85) {
        const next = options[(Math.random() * options.length) | 0];
        this.strut = next;
        if (next.a === node) { this.t = 0; this.dir = 1; }
        else { this.t = 1; this.dir = -1; }
      } else {
        this.dir *= -1;
        this.t = Math.max(0, Math.min(1, this.t));
      }
    }
    const p = pointOnStrut(s, Math.max(0, Math.min(1, this.t)));
    this.x = p.x;
    this.y = p.y - Math.abs(Math.sin(this.bob)) * 2;
  }

  updateFalling(dt, world, level) {
    this.vy += PHYS.gravity * dt;
    this.vx += (world.wind || 0) * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const proxy = { x: this.x, y: this.y, px: this.x - this.vx * dt, py: this.y - this.vy * dt };
    let hit = false;
    for (const pl of level.platforms) {
      if (collideCircleRect(proxy, GOO.radius, pl)) hit = true;
    }
    if (hit) {
      this.x = proxy.x; this.y = proxy.y;
      this.vx *= 0.6;
      this.vy = Math.abs(this.vy) > 140 ? -this.vy * 0.35 : 0;
      if (Math.abs(this.vy) < 20) {
        this.vy = 0;
        this.squish = 0.4;
        // sleteo — pokušaj povratak na konstrukciju (balon samo leži i čeka)
        if (this.type === 'balloon' || !this.tryReattach(world)) this.state = 'walk';
      }
    }
    // u letu može da se uhvati za gredu pored koje prolazi (balon ne)
    if (!hit && this.vy > 0 && this.type !== 'balloon' && this.tryReattach(world)) return;
  }

  updateWalk(dt, world, level) {
    // balon ne hoda — leži na tlu dok ga igrač ne uhvati
    if (this.type !== 'balloon') {
      // hoda po tlu ka najbližem čvoru konstrukcije
      if (this.tryReattach(world)) return;
      const target = nearestNode(world, this.x, this.y);
      if (target) {
        const d = target.x - this.x;
        if (Math.abs(d) > 4) {
          this.x += Math.sign(d) * GOO.walkSpeed * dt;
        }
      }
      this.bobWalk = true;
    }
    // gravitacija/podloga: drži ga na platformi ispod
    this.vy += PHYS.gravity * dt;
    this.y += this.vy * dt;
    const proxy = { x: this.x, y: this.y, px: this.x, py: this.y - this.vy * dt };
    for (const pl of level.platforms) {
      if (collideCircleRect(proxy, GOO.radius, pl)) { this.vy = 0; }
    }
    this.x = proxy.x; this.y = proxy.y;
  }

  tryReattach(world) {
    let best = null, bestD = GOO.reattachDist;
    for (const s of world.struts) {
      if (s.noCrawl) continue;
      const t = projectOnStrut(s, this.x, this.y);
      const p = pointOnStrut(s, t);
      const d = dist(this.x, this.y, p.x, p.y);
      if (d < bestD) { bestD = d; best = { s, t }; }
    }
    if (best) {
      this.state = 'crawl';
      this.strut = best.s;
      this.t = best.t;
      this.dir = Math.random() < 0.5 ? -1 : 1;
      this.vx = this.vy = 0;
      return true;
    }
    return false;
  }

  detachToFalling() {
    this.state = 'falling';
    this.strut = null;
    this.vx = 0; this.vy = 0;
  }

  grab() {
    this.state = 'held';
    this.strut = null;
    this.vx = 0; this.vy = 0;
    this.squish = 0.5;
  }

  release(vx, vy) {
    this.state = 'falling';
    this.vx = vx; this.vy = vy;
  }
}

function projectOnStrut(s, x, y) {
  const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
  const len2 = dx * dx + dy * dy || 0.0001;
  const t = ((x - s.a.x) * dx + (y - s.a.y) * dy) / len2;
  return Math.max(0, Math.min(1, t));
}

function nearestNode(world, x, y) {
  let best = null, bestD = Infinity;
  for (const p of world.points) {
    const d = dist(x, y, p.x, p.y);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}

// Kandidati za kačenje: zakačeni čvorovi u dometu držane kuglice.
// Na balon-čvorove ne može ništa da se zakači.
export function attachCandidates(world, x, y, reach = GOO.attachReach) {
  const list = [];
  for (const p of world.points) {
    if (p.buoyant) continue;
    const d = dist(x, y, p.x, p.y);
    if (d >= GOO.minStrut && d <= reach) list.push({ p, d });
  }
  list.sort((a, b) => a.d - b.d);
  return list.slice(0, GOO.maxLinks);
}
