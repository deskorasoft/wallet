// غيّر رقم الإصدار عند كل تحديث للتطبيق
const CACHE_NAME = 'wallet-gh-v2';
const CORE = [
  './',
  './index.html',
  './app.js',
  './i18n.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
const EXTERNAL = [
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Reem+Kufi:wght@500;700&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // كل ملف لوحده: فشل ملف واحد ما يوقفش التثبيت كله
    await Promise.allSettled([...CORE, ...EXTERNAL].map((url) => cache.add(url)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ملفات الموقع نفسه: الشبكة أولاً (عشان GitHub Pages بيحتفظ بالملفات دقايق)، ثم الكاش لو أوفلاين
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone()); // نخزّن الردود السليمة فقط (مش 404)
    return fresh;
  } catch (err) {
    return (await cache.match(req)) || (req.mode === 'navigate' ? ((await cache.match('./index.html')) || (await cache.match('./'))) : null) || Response.error();
  }
}

// الخطوط الخارجية: من الكاش فوراً وتتحدث في الخلفية
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;
  e.respondWith(sameOrigin ? networkFirst(req) : staleWhileRevalidate(req));
});
