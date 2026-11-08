// Read Geopolitics: notifiche push. Un invito (una volta, alla fine del briefing, mai insieme alla newsletter),
// la scheda «🔔 Notifiche» in «Il mio Read» e l'aggiornamento di quello che il lettore segue.
(function () {
  const API = "https://rg-api.briefinghub.workers.dev";
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  const ss = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const tr = (n) => { try { if (typeof track === "function") track(n); } catch (e) {} };
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const mobile = window.matchMedia && matchMedia("(pointer: coarse)").matches && innerWidth < 900;
  const can = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  const iosGuide = ios && !standalone && !can; // iPhone in Safari: prima va aggiunta alla schermata Home
  const ROWS = [
    ["briefing", "📰", "Il briefing è pronto", "ogni mattina verso le 7:15, con le storie principali"],
    ["agg", "⚡", "Aggiornamenti dopo il briefing", "alle 12, alle 16 e alle 20, una notifica per giro con le notizie nuove"],
    ["sciopero", "🚆", "Sciopero domani", "la sera prima, alle 19, solo per gli scioperi in Italia"],
    ["temi", "★", "Svolte sui temi che segui", "quando esce una storia nuova su un tema che segui"],
  ];
  const st = () => { try { return JSON.parse(ls("rg-push") || "null") || {}; } catch (e) { return {}; } };
  const save = (o) => ls("rg-push", JSON.stringify(o));
  let draft = Object.assign({ briefing: true, agg: true, sciopero: true, temi: true }, st().prefs || {});
  const perm = () => (can ? Notification.permission : "default");
  const isOn = () => can && perm() === "granted" && !!st().on;
  const uid = () => { const u = ls("rg-uid"); return u && u !== "admin" ? u : null; };
  const segui = () => { try { return window.RG_follow && window.RG_follow.segui ? window.RG_follow.segui() : null; } catch (e) { return null; } };
  const b64 = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
  const post = (p, body) => fetch(API + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());

  async function getSub(create) {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub && create) {
      const k = await fetch(API + "/api/push/key").then((r) => r.json());
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.key) });
    }
    return sub;
  }
  async function send(sub, prova) {
    const j = await post("/api/push/sub", { sub: sub.toJSON(), prefs: draft, segui: segui(), uid: uid(), app: ios && standalone, prova: !!prova });
    if (!j || !j.ok) throw new Error("save");
    save({ on: true, prefs: draft, sync: new Date().toISOString().slice(0, 10) });
  }
  async function enable() {
    if (!can) throw new Error("unsupported");
    const p = await Notification.requestPermission();
    if (p !== "granted") { tr("push-negato"); throw new Error(p === "denied" ? "denied" : "dismissed"); }
    const sub = await getSub(true);
    await send(sub, true);
    tr("push-attive");
  }
  async function disable() {
    try { const sub = await getSub(false); if (sub) { await post("/api/push/off", { endpoint: sub.endpoint }).catch(() => {}); await sub.unsubscribe().catch(() => {}); } } catch (e) {}
    save({ on: false, prefs: draft }); tr("push-spente");
  }
  // tiene aggiornati sul server quello che il lettore segue e l'account (una volta al giorno, o quando cambia)
  let tSync = null;
  function sync(force) {
    if (!isOn()) { if (can && perm() !== "granted" && st().on) save({ on: false, prefs: draft }); return; }
    const day = new Date().toISOString().slice(0, 10);
    if (!force && st().sync === day) return;
    clearTimeout(tSync);
    tSync = setTimeout(() => { getSub(false).then((sub) => (sub ? send(sub, false) : save({ on: false, prefs: draft }))).catch(() => {}); }, force ? 1500 : 4000);
  }
  addEventListener("rg-follow", () => sync(true));

  /* ---------- stile ---------- */
  const css = document.createElement("style");
  css.textContent = `#rgPush{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
#rgPush .pb{background:var(--surface,#16212A);color:var(--ink,#E6ECF1);width:100%;max-width:520px;border-radius:20px 20px 0 0;padding:10px 20px calc(20px + env(safe-area-inset-bottom,0px));max-height:90vh;overflow:auto;box-shadow:0 -10px 30px rgba(0,0,0,.35)}
@media (min-width:700px){#rgPush{align-items:center}#rgPush .pb{border-radius:16px}}
#rgPush .gr{width:46px;height:5px;border-radius:3px;background:var(--line,#34424e);margin:0 auto 16px}
#rgPush h2{font:600 22px/1.25 "IBM Plex Serif",Georgia,serif;margin:0}#rgPush .sub{color:var(--muted,#8793A0);font-size:14.5px;margin:6px 0 10px;line-height:1.45}
.pu-r{display:grid;grid-template-columns:26px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-top:1px solid var(--line,#27353F);width:100%;background:none;border-left:0;border-right:0;border-bottom:0;color:inherit;font:inherit;text-align:left;cursor:pointer}
.pu-r .i{font-size:19px;text-align:center}.pu-r b{display:block;font-size:15px}.pu-r small{display:block;color:var(--muted,#8793A0);font-size:13px;margin-top:2px;line-height:1.35}
.pu-sw{width:42px;height:25px;border-radius:13px;background:var(--line,#34424e);position:relative;flex:none;transition:background .15s}.pu-sw::after{content:"";position:absolute;left:3px;top:3px;width:19px;height:19px;border-radius:50%;background:var(--muted,#8793a0);transition:left .15s}
.pu-r[aria-checked="true"] .pu-sw{background:#F0AE45}.pu-r[aria-checked="true"] .pu-sw::after{left:20px;background:#0a0f1c}.pu-r[disabled]{opacity:.5;cursor:default}
.pu-go{display:block;width:100%;margin-top:14px;min-height:48px;border:0;border-radius:12px;background:#F0AE45;color:#16120A;font-weight:600;font-size:16px;font-family:inherit;cursor:pointer}.pu-go[disabled]{opacity:.6}
.pu-no{display:block;margin:10px auto 0;background:none;border:0;color:var(--muted,#8793A0);font-size:14px;font-family:inherit;padding:8px 12px;cursor:pointer}
.pu-ios{border:1px solid var(--line,#27353F);border-radius:12px;padding:12px 14px;margin:8px 0 2px;font-size:14.5px;line-height:1.55}.pu-ios ol{margin:0;padding-left:20px}.pu-k{display:inline-block;border:1px solid currentColor;border-radius:5px;padding:0 5px;font-size:12.5px}
.pu-err{color:#E2776E;font-size:13.5px;margin-top:8px}.pu-st{margin:4px 0 6px;padding:9px 12px;border-left:3px solid #5BBF8A;background:rgba(91,191,138,.08);font-size:14px;border-radius:0 8px 8px 0}.pu-st.off{border-left-color:var(--muted,#8793A0);background:none;padding-left:10px}
.pu-lnk{background:none;border:0;color:var(--accent,#86B4EA);font-size:14px;font-family:inherit;padding:10px 0;cursor:pointer;display:block}`;
  document.head.appendChild(css);

  const rows = (dis) => ROWS.map(([k, i, t, d]) => `<button type="button" class="pu-r" role="switch" data-pu-k="${k}" aria-checked="${!!draft[k]}"${dis ? " disabled" : ""}><span class="i" aria-hidden="true">${i}</span><span><b>${t}</b><small>${d}</small></span><span class="pu-sw" aria-hidden="true"></span></button>`).join("");
  const guide = `<div class="pu-ios"><ol><li>Tocca <span class="pu-k">Condividi ⬆︎</span> in basso</li><li>Scegli «Aggiungi alla schermata Home»</li><li>Apri Read Geopolitics dall'icona: ti chiediamo lì quali notifiche vuoi</li></ol></div>`;
  const errTxt = (e) => (e && e.message === "denied" ? "Le notifiche sono bloccate per questo sito. Riattivale dalle impostazioni del browser (o del telefono) e riprova." : e && e.message === "dismissed" ? "Non hai dato il permesso: quando vuoi, riprova da qui." : "Non riesco ad attivarle in questo momento. Riprova tra poco.");

  /* ---------- l'invito ---------- */
  function sheet(src) {
    if (document.getElementById("rgPush")) return;
    const w = document.createElement("div"); w.id = "rgPush"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true"); w.setAttribute("aria-labelledby", "puT");
    w.innerHTML = iosGuide
      ? `<div class="pb"><div class="gr"></div><h2 id="puT">Su iPhone serve un passaggio in più</h2><p class="sub">Apple manda le notifiche solo alle app nella schermata Home. Ci vogliono 10 secondi:</p>${guide}<button type="button" class="pu-go" data-pu-x="1">Ho capito</button><button type="button" class="pu-no" data-pu-x="1">Non ora</button></div>`
      : `<div class="pb"><div class="gr"></div><h2 id="puT">Ti avvisiamo solo quando serve</h2><p class="sub">Scegli tu cosa ricevere: arrivano solo quelle che accendi.</p>${rows(false)}<button type="button" class="pu-go" data-pu-on="1">Attiva le notifiche</button><p class="pu-err" hidden></p><button type="button" class="pu-no" data-pu-x="1">Non ora</button></div>`;
    document.body.appendChild(w); document.body.style.overflow = "hidden";
    tr(iosGuide ? "push-invito-ios" : "push-invito");
    const f = w.querySelector(".pu-go"); if (f) f.focus();
    w.addEventListener("click", async (e) => {
      if (e.target === w || e.target.closest("[data-pu-x]")) { close(); return; }
      const r = e.target.closest("[data-pu-k]"); if (r) { draft[r.dataset.puK] = !draft[r.dataset.puK]; r.setAttribute("aria-checked", draft[r.dataset.puK]); return; }
      const on = e.target.closest("[data-pu-on]");
      if (on) {
        if (!ROWS.some(([k]) => draft[k])) { const er = w.querySelector(".pu-err"); er.textContent = "Accendi almeno una notifica."; er.hidden = false; return; }
        on.disabled = true; on.textContent = "Un attimo…";
        try { await enable(); w.querySelector(".pb").innerHTML = `<div class="gr"></div><h2 id="puT">✓ Notifiche attive</h2><p class="sub">Ti è appena arrivata una notifica di prova. Le cambi quando vuoi da «★ Il mio Read».</p><button type="button" class="pu-go" data-pu-x="1">Fatto</button>`; }
        catch (err) { on.disabled = false; on.textContent = "Attiva le notifiche"; const er = w.querySelector(".pu-err"); er.textContent = errTxt(err); er.hidden = false; }
      }
    });
    function close() { w.remove(); document.body.style.overflow = ""; }
    addEventListener("keydown", function k(e) { if (e.key === "Escape" && document.getElementById("rgPush")) { close(); removeEventListener("keydown", k); } });
  }

  // quando proporre l'invito: una volta (poi «Non ora» vale 14 giorni), dal 2° giorno di visita o alla prima apertura dell'app,
  // mai nella stessa visita della newsletter, mai se le notifiche sono già decise
  let asked = false, appCheck = null;
  function nlPending() { const u = uid(); return !!(u && !ls("rg-nl") && !ss("rg-nl-snz")); }
  function eligible() {
    if (asked || !mobile || isOn() || (can && perm() !== "default")) return false;
    if (!can && !iosGuide) return false;
    const last = Number(ls("rg-push-ask") || 0); if (last && Date.now() - last < 14 * 864e5) return false;
    if (window.RG_nlShown || nlPending() || document.getElementById("nlm") || document.getElementById("gate") || document.getElementById("rgAppG") || document.getElementById("intPanel") && !document.getElementById("intPanel").hidden) return false;
    if (document.querySelector(".ags.on")) return false;
    let days = 0; try { days = (JSON.parse(ls("rg-vd") || "{}") || {}).n || 0; } catch (e) {}
    if (!(standalone || days >= 2)) return false;
    if (iosGuide && appCheck === true) return false;
    return true;
  }
  function onScroll() {
    if (asked) return;
    const h = document.querySelector(".brief-head"); if (!h || !h.offsetParent) return;
    const el = document.scrollingElement || document.documentElement;
    if (el.scrollTop + innerHeight < el.scrollHeight * 0.75) return;
    if (!eligible()) return;
    asked = true; ls("rg-push-ask", String(Date.now())); removeEventListener("scroll", onScroll);
    setTimeout(() => sheet("fine-briefing"), 400);
  }
  window.RG_pushInvite = true; // l'invito sostituisce la striscia «Leggi come un'app» sul telefono
  if (iosGuide && uid()) fetch(API + "/api/push/app?uid=" + encodeURIComponent(uid())).then((r) => r.json()).then((j) => { appCheck = !!(j && j.app); }).catch(() => {});
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("load", () => setTimeout(() => sync(false), 3000));

  /* ---------- la scheda in «Il mio Read» ---------- */
  const rerender = () => { try { if (window.RG_panelRender) window.RG_panelRender(); } catch (e) {} };
  function panelHTML() {
    if (iosGuide) return `<p class="pu-st off">Su iPhone le notifiche arrivano solo se Read Geopolitics è nella schermata Home.</p>${guide}<p class="ip-hint">Poi apri Read Geopolitics dall'icona e torna qui.</p>`;
    if (!can) return `<p class="pu-st off">Questo browser non riceve notifiche dai siti.</p><p class="ip-hint">Prova con Chrome, Edge o Firefox, oppure dal telefono.</p>`;
    if (perm() === "denied") return `<p class="pu-st off">Le notifiche sono bloccate per questo sito.</p><p class="ip-hint">Riattivale dalle impostazioni del browser (o del telefono, alla voce Read Geopolitics), poi torna qui.</p>`;
    const on = isOn();
    return `<p class="pu-st${on ? "" : " off"}">${on ? "Attive su questo dispositivo" : "Non attive su questo dispositivo"}</p>${rows(false)}
      ${on ? `<p class="ip-hint">Su un altro dispositivo vanno attivate di nuovo lì.</p><button type="button" class="pu-lnk" data-pu-off="1">🔕 Disattiva tutte</button>` : `<button type="button" class="pu-go" data-pu-on2="1">Attiva le notifiche</button>`}<p class="pu-err" hidden></p>`;
  }
  document.addEventListener("click", async (e) => {
    const P = e.target.closest("#intPanel"); if (!P) return;
    const r = e.target.closest("[data-pu-k]");
    if (r) {
      draft[r.dataset.puK] = !draft[r.dataset.puK]; r.setAttribute("aria-checked", draft[r.dataset.puK]);
      if (isOn()) {
        if (!ROWS.some(([k]) => draft[k])) { await disable(); rerender(); return; }
        try { const sub = await getSub(false); if (sub) await send(sub, false); } catch (err) { const er = P.querySelector(".pu-err"); if (er) { er.textContent = "Non riesco a salvare la scelta. Riprova."; er.hidden = false; } }
      } else save(Object.assign(st(), { prefs: draft }));
      return;
    }
    if (e.target.closest("[data-pu-off]")) { await disable(); rerender(); return; }
    const on = e.target.closest("[data-pu-on2]");
    if (on) {
      if (!ROWS.some(([k]) => draft[k])) { const er = P.querySelector(".pu-err"); er.textContent = "Accendi almeno una notifica."; er.hidden = false; return; }
      on.disabled = true; on.textContent = "Un attimo…";
      try { await enable(); rerender(); } catch (err) { on.disabled = false; on.textContent = "Attiva le notifiche"; const er = P.querySelector(".pu-err"); if (er) { er.textContent = errTxt(err); er.hidden = false; } }
    }
  });
  window.RG_push = { panelHTML, show: () => (can || iosGuide), invite: () => sheet("manuale") };
})();
