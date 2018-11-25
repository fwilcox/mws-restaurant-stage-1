import idb from 'idb';

var cacheMe = 'mws-restaurant-v1';
var allCaches = [
  cacheMe
];
var urlCache = [
  '/',
  'restaurant.html',
  'index.html',
  'css/styles.css',
  'js/main.js',
  'js/dbhelper.js',
  'js/restaurant_info.js',
  'js/register.js'
];

const dbPromise = idb.open('mws-restaurant', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
  case 0:
    upgradeDB.createObjectStore('restaurants', {keyPath: 'id'}); 
  }
});

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheMe)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlCache);
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.port === '1337') {
    event.respondWith(getRestaurants(event.request));
  } else {
    event.respondWith(cacheResponse(event.request));
  }
});

function getRestaurants(request) {
  return dbPromise.then(db => {
    return db.transaction('restaurants')
      .objectStore('restaurants')
      .get('restaurants');
  }).then(data => {
    return (data && data.data) || fetch(request)
    .then(response => response.json())
    .then(json => {
      return dbPromise.then(db => {
        const tx = db.transaction('restaurants', 'readwrite');
        const store = tx.objectStore('restaurants');
        json.forEach(restaurant => {
          store.put(restaurant);
        });
        return json;
      });
    });
  }).then(response => new Response(JSON.stringify(response)))
  .catch(error => {
    return new Response('Error fetching from db', error);
  });
}

function cacheResponse(request) {
  return caches.match(request)
    .then(response => {
      return response || fetch(request).then(fetchResponse => {
        return caches.open(cacheMe).then(cache => {
          if (!fetchResponse.url.includes('browser-sync')) {
            cache.put(request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(error => new Response(error, {
      status: 404,
      statusText: 'Not connected to internet'
    }));
}

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
            !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});








