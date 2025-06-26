
const cacheName = 'tester-v1';
const appShell = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(appShell)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
