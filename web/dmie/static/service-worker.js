// service-worker.js

const CACHE_NAME = 'todo-list-cache-v1';
const urlsToCache = [
    '/',
    '/dashboard',
    '/static/script.js',
    '/static/style.css',
    '/static/board/board1.js',
    '/static/board/style.css',
    '/static/images/default_profile_image.png',
    '/static/manifest.json',
    '/static/pwa.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response from the cache
                if (response) {
                    return response;
                }

                // Clone the request since it's a one-time use
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response to store it in the cache
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});
