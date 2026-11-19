/* Service Worker — caché de la aplicación para uso PWA/offline */
const CACHE = 'mapa-oportunidades-v1';
const ARCHIVOS = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './css/styles.css', './js/data.js', './js/app.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
