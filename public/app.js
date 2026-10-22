// Read Geopolitics come app: installazione (Android/PC con il prompt del browser, iPhone con una guida),
// voce nel menu e un solo invito in alto alla terza giornata di visita da telefono.
(function () {
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const tr = (n) => { try { if (typeof track === "function") track(n); } catch (e) {} };
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const mobile = window.matchMedia && matchMedia("(pointer: coarse)").matches && innerWidth < 900;
  const day = new Date().toISOString().slice(0, 10);
  let deferred = null;

  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  if (standalone && ls("rg-app-open") !== day) { ls("rg-app-open", day); setTimeout(() => tr("app-aperta"), 2500); }
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  addEventListener("appinstalled", () => { ls("rg-app-ok", "1"); tr("app-installata"); hideBar(); });

  let days = 0;
  try { const o = JSON.parse(ls("rg-vd") || "{}"); if (o.l !== day) { o.n = (o.n || 0) + 1; o.l = day; ls("rg-vd", JSON.stringify(o)); } days = o.n || 0; } catch (e) {}

  const st = document.createElement("style");
  st.textContent = `#rgAppBar{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;gap:10px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:var(--surface,#16212A);border-bottom:1px solid var(--line,#27353F);font-size:14px;color:var(--fg,#E6ECF1);box-shadow:0 4px 14px rgba(0,0,0,.18)}
#rgAppBar img{width:30px;height:30px;border-radius:8px;flex:none}#rgAppBar span{flex:1;line-height:1.3}
#rgAppBar .i{background:#F2B84B;color:#16120A;border:0;border-radius:8px;padding:7px 12px;font:600 13.5px system-ui,sans-serif}
#rgAppBar .x{background:none;border:0;color:var(--faint,#8FA0AE);font-size:20px;padding:0 4px;line-height:1}
#rgAppG{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center}
#rgAppG .c{background:var(--surface,#16212A);color:var(--fg,#E6ECF1);border:1px solid var(--line,#27353F);border-radius:16px;margin:12px 12px calc(70px + env(safe-area-inset-bottom,0px));padding:16px;max-width:420px;width:100%}
#rgAppG h4{margin:0 0 6px;font-size:16px}#rgAppG ol{margin:8px 0 0;padding-left:20px;font-size:14.5px;line-height:1.55}#rgAppG .sh{display:inline-block;border:1px solid currentColor;border-radius:5px;padding:0 5px;font-weight:700}
#rgAppG .ok{display:block;margin:12px 0 0 auto;background:none;border:0;color:var(--accent,#86B4EA);font:600 14px system-ui,sans-serif}
#rgAppG .ar{position:fixed;left:50%;bottom:calc(46px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);color:#F2B84B;font-size:26px}`;
  document.head.appendChild(st);

  function showGuide() {
    if (document.getElementById("rgAppG")) return;
    const g = document.createElement("div"); g.id = "rgAppG";
    const steps = ios
      ? `<ol><li>Tocca <span class="sh">↑</span> <b>Condividi</b>, nella barra di Safari qui sotto.</li><li>Scorri e scegli <b>«Aggiungi alla schermata Home»</b>.</li><li>Tocca <b>«Aggiungi»</b>: l'icona appare tra le tue app.</li></ol>`
      : `<ol><li>Apri il menu del browser (<b>⋮</b> in alto a destra).</li><li>Scegli <b>«Installa app»</b> oppure <b>«Aggiungi a schermata Home»</b>.</li></ol>`;
    g.innerHTML = `<div class="c" role="dialog" aria-label="Installa Read Geopolitics"><h4>Aggiungi Read Geopolitics alla Home</h4><div style="font-size:13.5px;opacity:.8">Si apre come un'app, a schermo intero.</div>${steps}<button type="button" class="ok">Ho capito</button></div>${ios ? '<div class="ar">↓</div>' : ""}`;
    g.addEventListener("click", (e) => { if (e.target === g || e.target.closest(".ok")) g.remove(); });
    document.body.appendChild(g);
    tr("app-guida");
  }
  window.rgAppCanShow = () => !standalone && ls("rg-app-ok") !== "1";
  window.rgAppInstall = async function (from) {
    tr("app-installa-" + from);
    if (deferred) {
      const d = deferred; deferred = null;
      d.prompt();
      const r = await d.userChoice.catch(() => null);
      if (r && r.outcome === "accepted") { ls("rg-app-ok", "1"); hideBar(); }
      return;
    }
    showGuide();
  };
  function hideBar() { const b = document.getElementById("rgAppBar"); if (b) b.remove(); }
  function maybeBar() {
    if (standalone || !mobile || days < 3 || ls("rg-app-bar") || ls("rg-app-ok") === "1") return;
    if (document.getElementById("gate") || document.getElementById("nlm") || document.getElementById("rgAppG")) { setTimeout(maybeBar, 8000); return; }
    ls("rg-app-bar", day);
    const b = document.createElement("div"); b.id = "rgAppBar";
    b.innerHTML = `<img src="/img/icon-192.png" alt=""><span>Leggi Read Geopolitics come un'app</span><button type="button" class="i">Installa</button><button type="button" class="x" aria-label="Chiudi">×</button>`;
    b.querySelector(".i").onclick = () => { hideBar(); window.rgAppInstall("banner"); };
    b.querySelector(".x").onclick = () => { hideBar(); tr("app-banner-chiuso"); };
    document.body.appendChild(b);
    tr("app-banner-visto");
  }
  setTimeout(maybeBar, 5000);
})();
