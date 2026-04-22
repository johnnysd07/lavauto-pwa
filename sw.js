const CACHE_NAME = 'lavauto-v1';

self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Evitar interceptar llamadas a Google APIs y Google Drive
  if (event.request.url.includes('googleapis.com')) return;
  if (event.request.url.includes('drive.google.com')) return;
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline: Conéctate a internet para registrar datos.'))
  );
});
