const CACHE_NAME = 'goo-tower-v9';

// Obavezni resursi — keširaju se atomično pri instalaciji.
const CORE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/config.js',
  './js/storage.js',
  './js/audio.js',
  './js/physics.js',
  './js/goo.js',
  './js/levels.js',
  './js/render.js',
  './js/ui.js',
  './js/game.js'
];

// Opcioni resursi (ikone) — nedostajući fajl ne ruši instalaciju.
const OPTIONAL = [
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Zaobiđi HTTP keš da nova verzija ne pomeša stare i nove ES module.
      await Promise.all(CORE.map(async url => {
        const response = await fetch(new Request(url, { cache: 'reload' }));
        if (!response.ok) throw new Error(`Neuspešno keširanje: ${url}`);
        await cache.put(url, response);
      }));
      await Promise.allSettled(OPTIONAL.map(async url => {
        const response = await fetch(new Request(url, { cache: 'reload' }));
        if (response.ok) await cache.put(url, response);
      }));
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
