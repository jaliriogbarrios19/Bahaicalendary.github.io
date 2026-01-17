// Este archivo es necesario para que Chrome permita la instalación de la App
const CACHE_NAME = 'bhai-calendar-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2693/2693630.png'
];

// Instalación: Guardar archivos en caché y forzar activación inmediata
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activación: Tomar el control de la página de inmediato
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
