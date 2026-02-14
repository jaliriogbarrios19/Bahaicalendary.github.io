const CACHE_NAME = 'bhai-app-v6';
const assets = [
  './',
  './index.html',
  './manifest.json',
  '[https://cdn-icons-png.flaticon.com/512/2693/2693630.png](https://cdn-icons-png.flaticon.com/512/2693/2693630.png)'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
