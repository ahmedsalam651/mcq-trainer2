const CACHE = 'mcq-pwa-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(['./', './index.html', './styles.css'])
  ));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});