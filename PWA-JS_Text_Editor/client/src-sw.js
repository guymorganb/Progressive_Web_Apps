const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
/*
A service worker's scope is determined by its location on a web server. 
If a service worker runs on a page located at /subdir/index.html, 
and is located at /subdir/sw.js, the service worker's scope is /subdir/. 
To see the concept of scope in action, check out this example:
-
When it's said that a service worker is controlling a page, 
it's really controlling a client. 
A client is any open page whose URL falls within the scope of that service worker. 
Specifically, these are instances of a WindowClient.
*/
// service workers is responsible for managing data when internet connectivity has been interupted
// and for chaching data.
precacheAndRoute(self.__WB_MANIFEST); // self WB_manifest is an array that is a list of URLS to precache.
/*
Here, a CacheFirst strategy is being set up for pages. 
This strategy will always try to fetch the latest content from the cache first. 
If it's not available in the cache, it will fetch it from the network.
*/

// caching javascript and html files
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});
// handle the 'SKIP_WAITING' message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// const imageCache = new CacheFirst({
//   cacheName: 'image-cache',
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxEntries: 60, // Cache a maximum of 60 images.
//       maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for a maximum of 30 days.
//     }),
//   ],
// });

// const apiCache = new workbox.strategies.NetworkFirst({
//   cacheName: 'api-cache',
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxEntries: 50, // Cache the latest 50 API calls.
//     }),
//   ],
// });

// Implement asset caching
const jsCssCache = new StaleWhileRevalidate({
  cacheName: 'js-css-cache',
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
/*
In this line, the pageCache strategy is applied to navigation requests. 
When a user navigates to a new page 
(as opposed to fetching a resource like an image or CSS file), 
the request will be handled by the pageCache strategy.
*/
registerRoute(({ request }) => request.mode === 'navigate', pageCache);


// Cache image files.
// registerRoute(
//   ({ request }) => request.destination === 'image', imageCache);

// Cache API calls.
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api/'), apiCache);

// Cache JS and CSS files.
// caches styles, script and workers
registerRoute(
  ({ request }) =>["style","script", "worker"].includes(request.destination), 
  new StaleWhileRevalidate({
    cacheName: "asset-cache", // location
    plugins:[
      new CacheableResponsePlugin({
        statuses: [0,200]
      })
    ]
  }))