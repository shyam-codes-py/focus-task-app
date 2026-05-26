// sw.js (The Ultimate Auto-Updating Service Worker)
const CACHE_NAME = 'focus-app-v3'; 

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.png'
];

// 1. INSTALL EVENT (Naya data download karta hai)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Turant naya version laga do
});

// 2. ACTIVATE EVENT (Kachra saaf karne wala jadoo)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Purana cache delete ho gaya: ', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

// 3. FETCH EVENT (Offline support ke liye)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});