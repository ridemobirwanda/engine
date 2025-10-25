// Service Worker for EngineCore Ecommerce
const CACHE_NAME = 'enginecore-v1';
const STATIC_CACHE = 'enginecore-static-v1';
const DYNAMIC_CACHE = 'enginecore-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/products',
  '/manifest.json',
  // Add critical CSS and JS files here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for images, fonts, and scripts from allowed domains)
  if (url.origin !== location.origin) {
    // Allow Tawk.to domains
    const allowedExternalDomains = [
      'embed.tawk.to',
      'va.tawk.to', 
      'static.tawk.to',
      'pagead2.googlesyndication.com',
      'static.cloudflareinsights.com',
      'bat.bing.com',
      'api2.branch.io'
    ];
    
    const isAllowedDomain = allowedExternalDomains.some(domain => url.hostname.includes(domain));
    
    if (request.destination === 'image' || request.destination === 'font' || 
        request.destination === 'script' || request.destination === 'style' || isAllowedDomain) {
      event.respondWith(
        caches.open(DYNAMIC_CACHE).then((cache) => {
          return cache.match(request).then((response) => {
            if (response) {
              return response;
            }
            return fetch(request).then((fetchResponse) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
      );
    }
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - Network First strategy
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else if (request.destination === 'image') {
    // Images - Cache First strategy
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  } else if (request.destination === 'script' || request.destination === 'style') {
    // CSS and JS - Cache First strategy
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  } else {
    // API calls - Network First with fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions like cart updates
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});