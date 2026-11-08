// Read Geopolitics: service worker minimo. Rete prima di tutto; la copia salvata serve solo senza rete.
const V = "rg-v3"; // v3: notifiche push
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

// v3: notifiche push. Il Worker manda {t: titolo, b: testo, u: indirizzo da aprire, tag}
self.addEventListener("push", (e) => {
  let m = {};
  try { m = e.data ? e.data.json() : {}; } catch (_) { m = { b: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(m.t || "Read Geopolitics", {
    body: m.b || "", icon: "/img/icon-192.png", badge: "/img/badge-96.png", tag: m.tag || undefined, renotify: !!m.tag,
    data: { u: m.u || "/?utm_source=push" }, lang: "it",
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const u = new URL((e.notification.data && e.notification.data.u) || "/", self.location.origin).href;
  e.waitUntil((async () => {
    const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const w = all.find((c) => new URL(c.url).origin === self.location.origin);
    if (w) { try { await w.navigate(u); } catch (_) {} return w.focus(); }
    return clients.openWindow(u);
  })());
});
