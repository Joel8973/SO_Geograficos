/* Service Worker — caché de la aplicación para uso PWA/offline */
const CACHE = 'mapa-oportunidades-v3';
const ARCHIVOS = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './css/styles.css', './js/config.js', './js/data.js', './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Google Maps (maps.googleapis.com / gstatic.com) siempre por red:
  // sus respuestas dependen de la clave, la ubicación y el momento.
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // config.js siempre se busca en la red: el usuario puede cambiar su API Key
  // y no queremos que el service worker sirva una clave antigua desde caché.
  if (url.pathname.endsWith('/js/config.js')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copia = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
