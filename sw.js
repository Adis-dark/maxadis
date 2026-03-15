const CACHE = 'maxadis-v2';
const STATIC = ['/', '/index.html', '/boutique.html', '/formations.html', '/projets.html'];

// Domaines à NE JAMAIS intercepter
const BYPASS = [
  'script.google.com',
  'api.web3forms.com',
  'api.imgbb.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'cdn.tailwindcss.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // Bypass complet pour ces domaines - jamais de cache
  if (BYPASS.some(d => url.hostname.includes(d))) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request).then(res => {
        if (res.ok && res.type === 'basic') {
          cache.put(e.request, res.clone());
        }
        return res;
      }).catch(() => cached);

      if (cached) {
        // Notifier si nouvelle version dispo
        fetchPromise.then(res => {
          if (res && res !== cached) {
            self.clients.matchAll().then(clients => {
              clients.forEach(c => c.postMessage({ type: 'UPDATE_AVAILABLE' }));
            });
          }
        });
        return cached;
      }
      return fetchPromise;
    })
  );
});

self.addEventListener('message', e => {
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
