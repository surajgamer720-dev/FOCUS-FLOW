const CACHE_NAME = 'focusflow-v1.0.1';
const MANIFEST_VERSION = '1.0.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const CACHE_LIST = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
  
  // Notify all clients about the update
  notifyClientsOfUpdate(MANIFEST_VERSION);
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        
        if (event.request.url.includes('fonts.googleapis.com') || 
            event.request.url.includes('cdnjs.cloudflare.com') ||
            event.request.url.includes('fonts.gstatic.com')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      }).catch(() => {
        return caches.match('/index.html');
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    checkForUpdate();
  }
});

function checkForUpdate() {
  fetch('/manifest.json')
    .then(response => response.json())
    .then(manifest => {
      const newVersion = manifest.version;
      
      if (MANIFEST_VERSION !== newVersion) {
        notifyClientsOfUpdate(newVersion);
      }
    })
    .catch(err => console.log('Update check failed:', err));
}

function notifyClientsOfUpdate(version) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: version
      });
    });
  });
}