const CACHE = 'maxadis-v1';
const ASSETS = ['/', '/index.html', '/boutique.html', '/formations.html', '/admin.html'];

// Install - cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - stale while revalidate
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('script.google.com')) return;
  if (e.request.url.includes('api.imgbb.com')) return;
  if (e.request.url.includes('api.web3forms.com')) return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request).then(res => {
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => null);

      if (cached) {
        // Serve from cache, update in background
        fetchPromise.then(res => {
          if (res) {
            // Notify clients that new version is available
            self.clients.matchAll().then(clients => {
              clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
            });
          }
        });
        return cached;
      }
      return fetchPromise || new Response('Hors ligne', { status: 503 });
    })
  );
});

// Background sync for orders
self.addEventListener('message', e => {
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
