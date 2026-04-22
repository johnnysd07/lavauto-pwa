// ═══════════════════════════════════════════════════════════════
// sw.js — Service Worker Lavauto (CORREGIDO)
// Este archivo debe estar en GitHub Pages, NO en Apps Script.
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'lavauto-v2';

// CORRECCIÓN: Lista de recursos a cachear.
// Como la app principal está en Apps Script, solo cacheamos
// recursos estáticos que sí podemos controlar.
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json'
  // Agrega aquí más assets si los alojas en GitHub Pages
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  // CORRECCIÓN: Limpia versiones de caché anteriores
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // CORRECCIÓN: Pasa directo sin interceptar las llamadas a Google APIs
  // (Apps Script, Sheets, Charts) ya que requieren autenticación
  if (
    url.includes('googleapis.com') ||
    url.includes('script.google.com') ||
    url.includes('drive.google.com') ||
    url.includes('gstatic.com')
  ) {
    return;
  }

  // Para el resto: network-first, con fallback offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda en caché una copia fresca
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        // Offline: intenta servir desde caché
        return caches.match(event.request).then(cached => {
          return cached || new Response(
            '<h2 style="font-family:sans-serif;text-align:center;margin-top:40px">Sin conexión</h2><p style="text-align:center">Conéctate para usar Lavauto</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});
