const CACHE_NAME = 'ar-book-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Service Worker Install karna
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Purana cache delete karna aur naya activate karna
self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated');
});

// Files ko fetch karna
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
