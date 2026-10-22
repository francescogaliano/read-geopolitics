// Read Geopolitics: service worker minimo. Rete prima di tutto; la copia salvata serve solo senza rete.
const V = "rg-v1";
const API = "rg-api.briefinghub.workers.dev";
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then((c) => c.addAll(["/", "/manifest.webmanifest", "/img/icon-192.png"])).catch(() => {}));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
async function netFirst(req, fallbackKey) {
  const c = await caches.open(V);
  try {
    const r = await fetch(req);
    if (r && r.ok) c.put(fallbackKey || req, r.clone()).catch(() => {});
    return r;
  } catch (e) {
    const hit = (await c.match(fallbackKey || req)) || (fallbackKey ? null : await c.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    if (req.mode === "navigate") { const home = await c.match("/"); if (home) return home; }
    throw e;
  }
}
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (req.mode === "navigate" && u.origin === self.location.origin) { e.respondWith(netFirst(req, u.pathname === "/" ? "/" : null)); return; }
  if (u.host === API && u.pathname === "/api/data.json") { e.respondWith(netFirst(req)); return; }
  if (u.origin === self.location.origin && u.pathname.startsWith("/img/")) {
    e.respondWith(caches.open(V).then(async (c) => (await c.match(req)) || fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; })));
  }
});
