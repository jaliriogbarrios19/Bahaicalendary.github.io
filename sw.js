const CACHE_NAME = 'badi-app-v1';
const OFFLINE_URL = './index.html';

const assets = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('🚀 Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cacheando archivos principales');
                return cache.addAll(assets);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activado');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => {
                            console.log('🗑️ Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Estrategia de cache: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    // Solo manejar peticiones GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la respuesta es válida, guardarla en cache
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, buscar en cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // Si es una petición de navegación, mostrar página offline
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        return new Response('Sin conexión', { 
                            status: 503, 
                            statusText: 'Service Unavailable' 
                        });
                    });
            })
    );
});

// Escuchar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

