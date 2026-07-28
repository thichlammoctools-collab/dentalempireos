// Dental Empire OS — Service Worker
// Strategy: cache-first cho static assets, network-first cho HTML.

const VERSION = 'de-v3';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-only cho API admin — không bao giờ cache
  if (url.pathname.startsWith('/api/admin/') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => new Response(JSON.stringify({ error: 'offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }))
    );
    return;
  }

  // Network-first cho HTML — luôn ưu tiên bản mới
  const accept = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || new Response(
            '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Không thể tải trang</title><body style="font-family:system-ui,sans-serif;background:#101217;color:#f5f7fb;display:grid;place-items:center;min-height:100vh;margin:0"><main style="max-width:28rem;padding:2rem;text-align:center"><h1>Không thể tải trang</h1><p>Vui lòng kiểm tra kết nối mạng và thử lại.</p><button onclick="location.reload()" style="padding:.7rem 1rem;border:0;border-radius:.5rem;background:#92ccff;color:#101217;font-weight:700;cursor:pointer">Thử lại</button></main></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          ))
        )
    );
    return;
  }

  // Cache-first cho static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== 'basic') return res;
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
