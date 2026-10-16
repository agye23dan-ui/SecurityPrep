/* Service worker: keeps the app working offline (network-first with cache fallback). */
const CACHE = 'secprep-v19';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon.svg',
  './js/catalog.js',
  './js/app.js',
  './js/content/secplus-d1.js',
  './js/content/secplus-d2.js',
  './js/content/secplus-d3.js',
  './js/content/secplus-d4.js',
  './js/content/secplus-d5.js',
  './js/content/cysa-d1.js',
  './js/content/cysa-d2.js',
  './js/content/cysa-d3.js',
  './js/content/cysa-d4.js',
  './js/content/securityx-d1.js',
  './js/content/securityx-d2.js',
  './js/content/securityx-d3.js',
  './js/content/securityx-d4.js',
  './js/content/pentest-d1.js',
  './js/content/pentest-d2.js',
  './js/content/pentest-d3.js',
  './js/content/pentest-d4.js',
  './js/content/pentest-d5.js',
  './js/content/pbq.js',
  './js/labs/core.js',
  './js/labs/content-shell.js',
  './js/labs/content-net.js',
  './js/labs/content-config.js',
  './js/labs/content-misc.js',
  './js/labs/ui.js',
  './js/migrations.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first for this site's own files: the newest version is used whenever online and the cached copy
 * keeps the app working offline. No manual cache bumping is needed when content changes. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    fetch(event.request).then((res) => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return res;
    }).catch(() => caches.match(event.request).then((hit) => hit || caches.match('./index.html')))
  );
});
