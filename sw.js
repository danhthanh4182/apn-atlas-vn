const CACHE = 'apn-atlas-vn-v1.8-perf-100';
const CORE = ['./','./index.html','./styles.css','./src/app.mjs','./src/catalog.mjs','./src/logos.mjs','./src/hero-motion.mjs','./manifest.webmanifest','./assets/icon.svg'];
const LOGO_PATHS = ["./assets/carriers/viettel.png","./assets/carriers/vinaphone.png","./assets/carriers/mobifone.png","./assets/carriers/vietnamobile.png","./assets/carriers/itel.png","./assets/carriers/wintel.png","./assets/carriers/local.png","./assets/carriers/vnsky.png","./assets/carriers/fpt.png","./assets/carriers/pottel.png","./assets/carriers/gmobile.png","./assets/carriers/skyfi.png"];
const FONT_PATHS = ["./assets/fonts/be-vietnam-pro-vietnamese-400.woff2","./assets/fonts/be-vietnam-pro-latin-400.woff2","./assets/fonts/be-vietnam-pro-vietnamese-500.woff2","./assets/fonts/be-vietnam-pro-latin-500.woff2","./assets/fonts/be-vietnam-pro-vietnamese-600.woff2","./assets/fonts/be-vietnam-pro-latin-600.woff2","./assets/fonts/be-vietnam-pro-vietnamese-700.woff2","./assets/fonts/be-vietnam-pro-latin-700.woff2","./assets/fonts/be-vietnam-pro-vietnamese-800.woff2","./assets/fonts/be-vietnam-pro-latin-800.woff2","./assets/fonts/be-vietnam-pro-vietnamese-900.woff2","./assets/fonts/be-vietnam-pro-latin-900.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all([c.addAll(CORE),Promise.allSettled(LOGO_PATHS.concat(FONT_PATHS).map(path=>c.add(path)))])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    if(e.request.mode === 'navigate') {
      try { return await fetch(e.request); } catch { return await caches.match('./index.html') || Response.error(); }
    }
    const hit = await caches.match(e.request);
    if(hit) return hit;
    const net = await fetch(e.request);
    if(net.ok) { const cache = await caches.open(CACHE); await cache.put(e.request,net.clone()); }
    return net;
  })());
});
