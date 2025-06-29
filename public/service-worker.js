self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('mcq-pwa-v2').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/styles.css'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
