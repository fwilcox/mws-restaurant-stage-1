const cacheMe = 'mws-restaurant-v1';
let urlCache = [
  '/',
  'restaurant.html',
  'index.html',
  'css/styles.css',
  'js/main.js',
  'js/dbhelper.js',
  'js/restaurant_info.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(cacheMe)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlCache);
    })
  );
});

// Set browser to get cached URLs and update cache list with new URLs
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      } 
      // Cache the response and clone
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // clone into two streams
          var responseToCache = response.clone();

          caches.open(cacheMe)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});

// Replace SW on update
self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['mws-restaurant-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
