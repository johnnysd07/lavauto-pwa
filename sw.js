const CACHE_NAME = 'lavauto-v1';

self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Ignorar peticiones de Google Script y APIs para evitar bloqueos
  if (event.request.url.includes('googleapis.com')) return;
  if (event.request.url.includes('drive.google.com')) return;
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline: Conéctate para continuar.'))
  );
});
