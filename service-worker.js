const CACHE_NAME = 'polyhub-cache-v1';

const STATIC_ASSETS = [
    './',
    './index.html',
    './freecourses.html',
    './free_courses.html',
    './paid_courses.html',
    './test_series.html',
    './polytechnic_updates.html',
    './scholarship.html',
    './notice_board.html',
    './syllabus.html',
    './about_us.html',
    './login.html',
    './manifest.json',
    './logo.png',
    './banner.png',
    './my.webp',
    './phone.png',
    './instagram.jpeg',
    './facebook.jpeg',
    './whatsapp.jpeg',
    './aibook.jpg',
    './cyber.jpg',
    './polytechnichub.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './introduction.pdf',
    './electrical_circuit_200mcq.html',
    './concrete_technology_100_mcqs.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch(() => {
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
