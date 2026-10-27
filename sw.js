/*
 * sw.js — DogSnap Service Worker
 * Strategy: Cache-First for app shell, Network-First for API calls.
 *
 * Cache-First  → serve from cache instantly; great for static assets.
 * Network-First → try network first, fall back to cache; correct for
 *                  live data that must be fresh when online.
 */

/* ── Config ──────────────────────────────────────────────── */

// Bump this version string whenever you update the cached assets.
// The install step will populate a new cache and the activate step
// will delete the old one, ensuring users always get the latest shell.
const CACHE_VERSION   = 'v1';
const SHELL_CACHE     = `dogsnap-shell-${CACHE_VERSION}`;
const API_CACHE       = `dogsnap-api-${CACHE_VERSION}`;

// App-shell assets to pre-cache during installation.
// These are the files that must load for the UI to be usable offline.
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// URL patterns treated as "API / live data" — handled with Network-First.
const API_ORIGINS = [
  'https://dog.ceo',
  'https://images.dog.ceo',
];

/* ── Install ─────────────────────────────────────────────── */

self.addEventListener('install', event => {
  console.log('[SW] Installing…');

  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching app shell:', SHELL_ASSETS);
        // addAll() fetches each URL and stores the response.
        // If any request fails, the whole install is aborted.
        return cache.addAll(SHELL_ASSETS);
      })
      .then(() => {
        // Skip the waiting phase so this SW activates immediately
        // without waiting for existing tabs to close.
        return self.skipWaiting();
      })
  );
});

/* ── Activate ────────────────────────────────────────────── */

self.addEventListener('activate', event => {
  console.log('[SW] Activating…');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        const validCaches = [SHELL_CACHE, API_CACHE];

        // Delete every cache that belongs to this SW but is no longer current.
        return Promise.all(
          cacheNames
            .filter(name =>
              name.startsWith('dogsnap-') && !validCaches.includes(name)
            )
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all open clients immediately instead of
        // waiting for the next navigation.
        return self.clients.claim();
      })
  );
});

/* ── Fetch ───────────────────────────────────────────────── */

self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests — never intercept POST/PUT/DELETE.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* 1. Network-First for Dog CEO API requests
        (we want fresh photos when online, but can still serve
         a previously seen photo if the network is unavailable) */
  if (API_ORIGINS.some(origin => url.origin === origin)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  /* 2. Cache-First for everything else (app shell, icons, etc.) */
  event.respondWith(cacheFirst(request, SHELL_CACHE));
});

/* ── Strategy helpers ────────────────────────────────────── */

/**
 * Cache-First strategy.
 * Serve from cache if available; fetch from network and cache the
 * result otherwise.  If both fail, return a generic offline response.
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @returns {Promise<Response>}
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);
    // Only cache valid responses (status 200).
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      // clone() is required: a Response body can only be consumed once.
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[SW] Cache-First: network failed for', request.url, err);
    // Return a minimal offline fallback HTML page.
    return offlineFallback();
  }
}

/**
 * Network-First strategy.
 * Try the network; on failure serve from cache.  Cache every
 * successful network response for future offline use.
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @returns {Promise<Response>}
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn('[SW] Network-First: offline, checking cache for', request.url);
    const cached = await caches.match(request);
    if (cached) return cached;

    // Nothing in cache either — propagate the error so the app can
    // display its own "offline" UI.
    throw err;
  }
}

/**
 * Minimal offline fallback page returned when Cache-First has
 * nothing to serve (e.g., first-ever load while offline).
 *
 * @returns {Response}
 */
function offlineFallback() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DogSnap – Offline</title>
  <style>
    body {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-family: system-ui, sans-serif;
      background: #e8f4ff;
      color: #1a1a2e;
      text-align: center;
      padding: 2rem;
    }
    h1 { font-size: 2rem; }
    p  { color: #555; max-width: 320px; }
    button {
      margin-top: 0.5rem;
      padding: 0.7rem 1.6rem;
      background: #007bff;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>📶 You're Offline</h1>
  <p>DogSnap needs an internet connection to fetch new photos. Please reconnect and try again.</p>
  <button onclick="location.reload()">Try Again</button>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
