const CACHE_NAME = 'magnific-pwa-v3';

const APP_SHELL = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './logo-ccia.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith('magnific-pwa-') &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Google Apps Script siempre utiliza la red.
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('googleusercontent.com') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // Para la aplicación y el index:
  // buscar primero la versión publicada en Firebase.
  if (
    request.mode === 'navigate' ||
    request.destination === 'document'
  ) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME)
              .then(cache =>
                cache.put('./index.html', copy)
              );
          }

          return response;
        })
        .catch(async () => {
          const cache =
            await caches.open(CACHE_NAME);

          return (
            await cache.match('./index.html')
          ) ||
          (
            await caches.match(request)
          ) ||
          Response.error();
        })
    );

    return;
  }

  // Otros archivos:
  // red primero y caché como respaldo offline.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (
          response &&
          response.ok &&
          url.origin === self.location.origin
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache =>
              cache.put(request, copy)
            );
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});