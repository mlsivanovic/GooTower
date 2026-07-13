const CACHE_NAME = 'goo-tower-v5';

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
      await cache.addAll(CORE);
      await Promise.allSettled(OPTIONAL.map(url => cache.add(url)));
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
