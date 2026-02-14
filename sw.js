// Este archivo permite que la App se instale y funcione mejor
const CACHE_NAME = 'bhai-app-v5';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2693/2693630.png'
];

// Instalación: Guarda los archivos básicos en la memoria del celular
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

// Activación: Toma control de la App inmediatamente
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Peticiones: Carga desde la memoria para que la App sea rápida
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
