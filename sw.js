// رقم الإصدار بيتحط تلقائياً عند النشر (GitHub Actions بيستبدل __BUILD__ ببصمة الملفات). ما تعدّلوش يدوياً.
const CACHE_NAME = 'wallet-__BUILD__';
const CORE = [
  './',
  './index.html',
  './app.js',
  './i18n.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fonts/Cairo-Regular.ttf',
  './fonts/Cairo-Medium.ttf',
  './fonts/Cairo-SemiBold.ttf',
  './fonts/Cairo-Bold.ttf',
  './fonts/ReemKufi-Medium.ttf',
  './fonts/ReemKufi-Bold.ttf'
];
const EXTERNAL = [];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // كل ملف لوحده: فشل ملف واحد ما يوقفش التثبيت كله
    // cache:'reload' عشان نجيب أحدث نسخة فعلاً (مش نسخة قديمة من كاش المتصفح)
    await Promise.allSettled([...CORE.map((url) => cache.add(new Request(url, { cache: 'reload' }))), ...EXTERNAL.map((url) => cache.add(url))]);
    // أول تثبيت: فعّل فوراً. تحديث: استنى لحد ما المستخدم يضغط "تحديث الآن" (بيبعت SKIP_WAITING)
    if (!self.registration.active) self.skipWaiting();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ملفات الموقع نفسه: من الكاش فوراً (التطبيق بيفتح في أقل من ثانية حتى لو النت بطيء أو مقطوع).
// التحديثات بتوصل لما تغيّر CACHE_NAME: النسخة الجديدة بتتحمّل في الخلفية وبيظهر شريط "تحديث الآن".
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone()); // نخزّن الردود السليمة فقط (مش 404)
    return fresh;
  } catch (err) {
    return (req.mode === 'navigate' ? ((await cache.match('./index.html')) || (await cache.match('./'))) : null) || Response.error();
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
  e.respondWith(sameOrigin ? cacheFirst(req) : staleWhileRevalidate(req));
});
