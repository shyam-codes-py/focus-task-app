// sw.js (The Ultimate Auto-Updating Service Worker)

// Jab bhi code mein changes karo, is version number ko badal dena (jaise v3, v4, v5)
const CACHE_NAME = 'focus-app-v3'; 

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.png' // Icon bhi cache mein daal diya taaki install perfect rahe
];

// 1. INSTALL EVENT (Naya data download karta hai)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // Ye line browser ko bolti hai ki "wait mat karo, turant naya version laga do!"
  self.skipWaiting(); 
});

// 2. ACTIVATE EVENT (Kachra saaf karne wala jadoo) 🧹
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Agar cache ka naam hamare naye version (v3) se match nahi karta, toh usse uda do
          if (cache !== CACHE_NAME) {
            console.log('Purana cache delete ho gaya: ', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ye line naye service worker ko turant control lene bolti hai
  self.clients.claim(); 
});

// 3. FETCH EVENT (Offline support ke liye)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});