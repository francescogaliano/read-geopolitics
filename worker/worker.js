// Read Geopolitics API: Cloudflare Worker + D1
// v42: reel col globo (radar.mjs, globo.mjs, apertura.mjs) spostati in basso di 90 px: più margine in alto, zona sicura del testo fino a 1660 px.
// v50: Threads, «Rispondi su Threads» nel pannello: ricerca per parola chiave e risposta approvata a mano (max 3 al giorno); permesso threads_keyword_search nel collegamento.
// v51: svolte e aggiornamenti. Routine «aggiornamenti» (11:52, 15:52, 19:52): documenti «aggiornamenti» sul sito (fascia «Dalle ultime ore» e riquadro nella storia), proposte di svolta (/v1/svolte) da approvare nel pannello, avviso nella chat privata col bot, /v1/giro. Richieste: modulo senza riquadri con temi suggeriti; reel «Spiegato in 40 secondi» (kit spiegato.mjs).
// v52: «Com'è andata la settimana» riscritto: tre esiti neutri (successi / andati diversamente / fermi), doppioni tolti, 4 voci da ricordare con il tema del filone.
// v54: il riepilogo serale non conta più il tetto. v53: Telegram, tetto di 3 messaggi al giorno (divergenza saltata se è uscita una svolta; divergenza e riepilogo saltati oltre il tetto); riepilogo serale «Dalle ultime ore» alle 20:15 (dopo l'ultimo giro), solo se ci sono aggiornamenti non già mandati come svolta. Prova nella chat privata: azione tg_sera_prova.
// v49: newsletter con la domanda del giorno (pulsanti che aprono il sito e registrano il voto); domanda di Threads con il link al sito.
// v48: esito degli scenari: /v1/batch salva esito e probabilità accanto ai voti (polls); «Com'è andata» con gli scenari chiusi; pannello «Chi ci ha preso».
// v47: previsioni dei lettori (g: sì/no sui segnali, c: scelta dello scenario) oltre alle tesi; copia di ogni sondaggio (tabella polls); pannello «Voti dei lettori · solo per te»; «Com'è andata» con la percentuale dei lettori.
// v44: pannello, bozze: in alto solo quelle di oggi e quelle aperte; le altre in un archivio per mese e settimana, chiuso, che carica immagini e video solo quando apri un contenuto.
// v46: /api/vote e /api/votes, voti anonimi dei lettori sulle due tesi della storia principale (conteggi visibili da 20 voti).
// v45: Telegram «Nuovo dossier» quando /v1/batch riceve un dossier pronto che il sito non aveva (interruttore nel pannello).
// v41: «Oggi sui canali» nel pannello (anteprima, modifica, stop per oggi). Canali: Telegram «Le fonti non sono d'accordo» (briefing.tg_divergenza) e «Com'è andata» la domenica (dalle verifiche dei segnali dei briefing); Threads, domanda del giorno (draft.th_domanda).
// v43: pannello, pulsante «Copia» sotto ogni didascalia (Instagram, TikTok, Threads); «Oggi sui canali» apribile, chiuso di default, con riassunto degli orari.
// v40: etichette delle statistiche per il sito installabile (app-*).
// v39: newsletter: riquadro «Inoltrala» con link di iscrizione tracciato (utm_source=inoltro, «Email inoltrata» nelle statistiche).
// v38: newsletter: righe di «In 60 secondi» fino all'Italia, podcast verso la pagina Ascolta, due letture in due riquadri, «Confidenza media/alta/bassa», piè di pagina senza nome del titolare.
// v37: kit rubriche: riquadro neutro (grigio) nella carta verifica, `neutral: true`, per «Non sappiamo ancora».
// v36: statistiche «Persone»: nuovi iscritti per settimana, persone nuove e di ritorno (stima dal browser), iscritti attivi e spariti; registro giornaliero dei passaggi (seen_log).
// v35: scheda «Link» nel pannello: profilo Instagram, sticker delle storie, tutti i canali (con Amazon Music) e bio pronte, con Copia e Apri.
// v34: scheda Podcast con il link unico alla pagina /ascolta.html (Spotify, Apple, Telegram, sito) e i link diretti.
// v33: Telegram. Ogni mattina sul canale i 60 secondi con la puntata del podcast; i post di Instagram dal pannello o in automatico.
// v32: pannello riordinato. In alto «Canali e uscita» espandibile (stato di ogni canale, impostazioni dentro ogni riga); bozze con titolo vero, un pulsante principale, menu «⋯», didascalie Instagram/TikTok/Threads in schede che si salvano da sole, righe di stato per canale.
// v31: collegamento Threads via threads.net e chiavi ripulite da spazi/virgolette.
// v30: Threads. Collegamento (/ig/th/connect), pubblicazione di caroselli e reel dal pannello o in automatico dopo Instagram, testo Threads modificabile, rinnovo del token dal cron.
// v29: statistiche leggibili sul telefono (grafico senza sbordare, sigle C/R) e provenienze complete con «Altre provenienze» apribile.
// v28: la parola proposta conta i filoni diversi, non le storie (stessa regola della ricetta J); proposte ricalcolate quando cambiano i dati.
// v27: /api/data.json?parte=oggi (primo blocco del sito), POST /api/perf (tempi di caricamento anonimi), pannello che precarica le tab in sottofondo.
// v26: pannello più veloce (letture in parallelo, tabella kv verificata una volta, Utenti e posta caricati solo all'apertura della tab). /api/data.json servito da file già pronto su R2 (preparato dal cron), con ETag/304 e ?parte=recente per la prima schermata.
// v25: /c/utile registra i clic «La usavo» della vecchia edizione condivisa (kv utile:<giorno>:<hash>).
// v24: proposte e scelte della settimana nel pannello (parola, due letture, punto che sfugge; tema da preferire per martedì e venerdì), campo `scelta` in /v1/ig/plan.
// v23: kit radar.mjs e rubrica del venerdì «Oggi in 40 secondi» (template oggi-reel, al posto di «Dentro il sito»).
// v22: kit apertura.mjs (apertura col globo, 4 s fino al beat, per il reel del martedì) e copertina dei reel scelta (thumb_ms nella bozza → thumb_offset di Instagram).
// v21: scheda Statistiche nel pannello (GoatCounter letto dal Worker; secret nuovo: GC_TOKEN, chiave API di sola lettura).
// v20: TikTok + hashtag (max 5 su Instagram; didascalia TikTok separata e modificabile). Collegamento dal pannello (/tt/connect), invio di reel e caroselli come bozza nella casella TikTok o pubblicazione diretta (dopo l'audit di TikTok), invio automatico dopo Instagram, stato aggiornato dal cron. Secret nuovi: TT_CLIENT_KEY, TT_CLIENT_SECRET.
// v19: video dei reel salvati su R2 (niente più errori intermittenti); motivo degli errori dei reel; un token nuovo in IG_SEED_TOKEN sostituisce quello salvato; conteggio iscritti all'email al netto dei disiscritti.
// v18: scheda Podcast nel pannello (storia Instagram disegnata nel browser, testi da copiare).
// v17: riquadro del podcast nell'email del mattino (attesa breve della puntata).
// Binding D1 richiesto: DB   |   Binding R2 richiesto: PODCAST (podcast)   |   Secret richiesti: WRITE_TOKEN, IG_APP_SECRET, RESEND_API_KEY (newsletter)  |   Opzionale: IG_SEED_TOKEN

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization,content-type",
  "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "access-control-expose-headers": "content-length,content-range,accept-ranges",
};
const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS, ...extra },
  });
const fail = (status, error, detail) => json({ ok: false, error, detail }, status);

const TYPE_RE = /^[a-z][a-z0-9_]{1,24}$/;
const KEY_RE = /^[A-Za-z0-9][A-Za-z0-9:_.\-]{0,119}$/;
const MAX_BODY = 200000;

function authorized(request, env) {
  const h = request.headers.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  const s = env.WRITE_TOKEN || "";
  if (!t || !s || t.length !== s.length) return false;
  let d = 0;
  for (let i = 0; i < s.length; i++) d |= t.charCodeAt(i) ^ s.charCodeAt(i);
  return d === 0;
}

async function sha256(text) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function readBody(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) throw { status: 413, code: "too_large", detail: "max 200000 caratteri" };
  let obj;
  try { obj = JSON.parse(text); } catch { throw { status: 400, code: "invalid_json", detail: "il corpo non e' JSON valido" }; }
  if (!obj || typeof obj !== "object" || Array.isArray(obj))
    throw { status: 422, code: "body_must_be_object", detail: "serve un oggetto JSON { ... }" };
  return obj;
}

function meta(obj) {
  const title = typeof obj.title === "string" ? obj.title.slice(0, 300) : null;
  const topic = typeof obj.topic === "string" ? obj.topic.slice(0, 80) : null;
  const c = obj.countries ?? obj.country_codes;
  const countries = Array.isArray(c)
    ? JSON.stringify(c.filter((x) => typeof x === "string").slice(0, 20))
    : null;
  const pa =
    typeof obj.published_at === "string" && !isNaN(Date.parse(obj.published_at))
      ? new Date(obj.published_at).toISOString()
      : null;
  return { title, topic, countries, pa };
}

function checkTypeKey(type, key) {
  if (!TYPE_RE.test(type)) throw { status: 422, code: "bad_type", detail: "type: minuscole/numeri/_ (2-25)" };
  if (!KEY_RE.test(key)) throw { status: 422, code: "bad_key", detail: "key: lettere/numeri/:_.- (max 120)" };
}

async function putDoc(env, type, key, obj) {
  const now = new Date().toISOString();
  const text = JSON.stringify(obj);
  const hash = await sha256(text);
  const m = meta(obj);
  const cur = await env.DB.prepare("SELECT version, hash, published_at FROM docs WHERE type=?1 AND key=?2")
    .bind(type, key).first();
  if (cur && cur.hash === hash) return { status: "unchanged", version: cur.version };
  const version = cur ? cur.version + 1 : 1;
  const publishedAt = m.pa || (cur ? cur.published_at : now);
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO docs (type,key,title,topic,countries,published_at,status,version,hash,data,updated_at) " +
      "VALUES (?1,?2,?3,?4,?5,?6,'published',?7,?8,?9,?10) " +
      "ON CONFLICT(type,key) DO UPDATE SET title=?3, topic=?4, countries=?5, published_at=?6, " +
      "version=?7, hash=?8, data=?9, updated_at=?10"
    ).bind(type, key, m.title, m.topic, m.countries, publishedAt, version, hash, text, now),
    env.DB.prepare("INSERT OR REPLACE INTO revisions (type,key,version,data,created_at) VALUES (?1,?2,?3,?4,?5)")
      .bind(type, key, version, text, now),
  ]);
  return { status: cur ? "updated" : "created", version };
}


const MAX_BATCH_BODY = 1000000;
const MAX_BATCH_ITEMS = 50;
const ORDER = ["briefings","stories","threads","events","countries","sources","agenda","glossario","approfondimenti","brevi","settimanali","mercati","segnali","attori","attori_storico","dossier","aggiornamenti"];

async function putMany(env, items) {
  // 1 SELECT per tipo + 1 db.batch totale (limite D1 free: 50 query per richiesta)
  const byType = {};
  for (const it of items) (byType[it.type] ||= []).push(it);
  const cur = new Map();
  for (const [type, arr] of Object.entries(byType)) {
    const ph = arr.map((_, i) => "?" + (i + 2)).join(",");
    const { results } = await env.DB.prepare(
      "SELECT key, version, hash, published_at FROM docs WHERE type=?1 AND key IN (" + ph + ")"
    ).bind(type, ...arr.map((a) => a.key)).all();
    for (const r of results) cur.set(type + "\u0000" + r.key, r);
  }
  const now = new Date().toISOString();
  const stmts = [];
  const out = { created: 0, updated: 0, unchanged: 0 };
  for (const it of items) {
    const text = JSON.stringify(it.data);
    const hash = await sha256(text);
    const c = cur.get(it.type + "\u0000" + it.key);
    if (c && c.hash === hash) { out.unchanged++; continue; }
    const m = meta(it.data);
    const version = c ? c.version + 1 : 1;
    const publishedAt = m.pa || (c ? c.published_at : now);
    stmts.push(
      env.DB.prepare(
        "INSERT INTO docs (type,key,title,topic,countries,published_at,status,version,hash,data,updated_at) " +
        "VALUES (?1,?2,?3,?4,?5,?6,'published',?7,?8,?9,?10) " +
        "ON CONFLICT(type,key) DO UPDATE SET title=?3, topic=?4, countries=?5, published_at=?6, status='published', " +
        "version=?7, hash=?8, data=?9, updated_at=?10"
      ).bind(it.type, it.key, m.title, m.topic, m.countries, publishedAt, version, hash, text, now),
      env.DB.prepare("INSERT OR REPLACE INTO revisions (type,key,version,data,created_at) VALUES (?1,?2,?3,?4,?5)")
        .bind(it.type, it.key, version, text, now)
    );
    c ? out.updated++ : out.created++;
  }
  if (stmts.length) await env.DB.batch(stmts);
  return out;
}

function romeNow() {
  const f = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (t) => f.find((x) => x.type === t).value;
  return `${g("day")}/${g("month")}/${g("year")} ${g("hour")}:${g("minute")}`;
}

/* v26: versione dei dati del sito = ultimo aggiornamento della tabella docs (indice su updated_at: legge 1 riga). */
let SITE_IDX = false;
async function siteVer(env) {
  if (!SITE_IDX) { try { await env.DB.prepare("CREATE INDEX IF NOT EXISTS docs_updated ON docs(updated_at)").run(); } catch (e) {} SITE_IDX = true; }
  const r = await env.DB.prepare("SELECT MAX(updated_at) AS m FROM docs").first();
  return String((r && r.m) || "0").replace(/[^0-9]/g, "").slice(0, 17) || "0";
}
const SITE_RECENTE_GIORNI = 4;
const SITE_DOPO = ["dossier", "attori_storico"]; // non servono alla prima schermata
async function siteFile(env, parte, ver) {
  const key = "site/" + parte + "-" + ver + ".json";
  if (env.PODCAST) {
    try { const o = await env.PODCAST.get(key); if (o) return await o.text(); } catch (e) {}
  }
  const body = JSON.stringify(await buildSiteData(env, parte));
  if (env.PODCAST) {
    try {
      await env.PODCAST.put(key, body, { httpMetadata: { contentType: "application/json" } });
      const l = await env.PODCAST.list({ prefix: "site/" + parte + "-", limit: 100 });
      const old = l.objects.map((o) => o.key).filter((k) => k !== key);
      if (old.length) await env.PODCAST.delete(old);
    } catch (e) {}
  }
  return body;
}
async function siteWarm(env) { // dal cron: prepara i due file quando i dati cambiano, così nessun lettore aspetta la costruzione
  const ver = await siteVer(env);
  if ((await kvGet(env, "site_ver")) === ver) return;
  await siteFile(env, "oggi", ver); await siteFile(env, "recente", ver); await siteFile(env, "tutto", ver);
  await kvSet(env, "site_ver", ver);
}
async function buildSiteData(env, parte = "tutto") {
  let sql = "SELECT type, key, data FROM docs WHERE status='published' ORDER BY type, key LIMIT 30000";
  let binds = [];
  if (parte === "oggi") {
    /* v27: primo blocco, il minimo per disegnare il briefing e la mappa: ultimi 2 briefing e le loro storie, filoni, eventi, paesi, fonti. */
    const last = await env.DB.prepare("SELECT key FROM docs WHERE type='briefings' AND status='published' ORDER BY key DESC LIMIT 2").all();
    const days = (last.results || []).map((r) => r.key).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
    const lim = days.length ? days[days.length - 1] : new Date().toISOString().slice(0, 10);
    sql = "SELECT type, key, data FROM docs WHERE status='published' AND (" +
      "(type IN ('briefings','stories','aggiornamenti') AND json_extract(data,'$.data')>=?1) OR type IN ('threads','events','countries','sources','pubblico')) ORDER BY type, key LIMIT 30000";
    binds = [lim];
  } else if (parte === "recente") {
    // la finestra parte dall'ultimo briefing pubblicato, non da oggi: se la routine salta qualche giorno la prima schermata non resta vuota
    const last = await env.DB.prepare("SELECT MAX(key) AS m FROM docs WHERE type='briefings' AND status='published'").first();
    const base = /^\d{4}-\d{2}-\d{2}$/.test((last && last.m) || "") ? Date.parse(last.m + "T12:00:00Z") : Date.now();
    const lim = new Date(base - SITE_RECENTE_GIORNI * 86400000).toISOString().slice(0, 10);
    const limW = new Date(base - 8 * 86400000).toISOString().slice(0, 10);
    sql = "SELECT type, key, data FROM docs WHERE status='published' AND type NOT IN ('" + SITE_DOPO.join("','") + "') AND (" +
      "(type IN ('briefings','stories','brevi','segnali','aggiornamenti') AND json_extract(data,'$.data')>=?1) OR (type='settimanali' AND json_extract(data,'$.data')>=?2) OR " +
      "type NOT IN ('briefings','stories','brevi','segnali','settimanali','aggiornamenti')) ORDER BY type, key LIMIT 30000";
    binds = [lim, limW];
  }
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  const cols = {}; let pubblico = {};
  for (const r of results) {
    const d = JSON.parse(r.data);
    if (r.type === "pubblico") { if (r.key === "main") pubblico = d; continue; }
    if (!ORDER.includes(r.type)) continue;
    (cols[r.type] ||= []).push({ id: r.key, data: d });
  }
  const collections = {};
  for (const c of ORDER) if (cols[c]) collections[c] = cols[c];
  return { generato: romeNow(), parte, pubblico, collections };
}


const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const clip = (v, n) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

async function joinUser(request, env) {
  const text = await request.text();
  if (text.length > 4000) return fail(413, "too_large");
  let b; try { b = JSON.parse(text); } catch { return fail(400, "invalid_json"); }
  if (!b || typeof b !== "object") return fail(422, "bad_body");
  if (b.sito) return json({ ok: true, id: crypto.randomUUID(), returning: false }); // campo trappola per i bot: finge di accettare
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) return fail(422, "bad_email");
  const now = new Date().toISOString();
  const ip = request.headers.get("cf-connecting-ip") || "x";
  const ipHash = (await sha256("rg|" + ip)).slice(0, 24);
  const hourAgo = new Date(Date.now() - 3600000).toISOString();
  const cnt = await env.DB.prepare("SELECT COUNT(*) AS n FROM join_log WHERE ip_hash=?1 AND ts>=?2").bind(ipHash, hourAgo).first();
  if (cnt && cnt.n >= 20) return fail(429, "too_many");
  await env.DB.batch([
    env.DB.prepare("INSERT INTO join_log (ip_hash, ts) VALUES (?1, ?2)").bind(ipHash, now),
    env.DB.prepare("DELETE FROM join_log WHERE ts<?1").bind(new Date(Date.now() - 86400000).toISOString()),
  ]);
  const nl = b.newsletter === true ? now : null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await env.DB.prepare("SELECT id, newsletter_at FROM users WHERE email=?1").bind(email).first();
    if (cur) {
      await env.DB.prepare("UPDATE users SET last_seen=?2, visits=visits+1, newsletter_at=COALESCE(newsletter_at, ?3) WHERE id=?1")
        .bind(cur.id, now, nl).run();
      let sub = !!cur.newsletter_at;
      if (nl) { try { sub = await nlConsent(env, cur.id, now, clip(b.consent_text, 500)); } catch (e) {} }
      else { try { await mailSchema(env); const q = await env.DB.prepare("SELECT newsletter_at, unsub_at FROM users WHERE id=?1").bind(cur.id).first(); sub = !!(q && q.newsletter_at && !q.unsub_at); } catch (e) {} }
      await seenLog(env, cur.id);
      return json({ ok: true, id: cur.id, returning: true, newsletter: sub });
    }
    const id = crypto.randomUUID();
    try {
      await env.DB.prepare(
        "INSERT INTO users (id,email,created_at,last_seen,visits,source,campaign,content,referrer,newsletter_at,status) " +
        "VALUES (?1,?2,?3,?3,1,?4,?5,?6,?7,?8,'early')"
      ).bind(id, email, now, clip(b.source, 80), clip(b.campaign, 80), clip(b.content, 80), clip(b.referrer, 120), nl).run();
      try { await mailSchema(env); await env.DB.prepare("UPDATE users SET unsub_token=lower(hex(randomblob(16))) WHERE id=?1 AND unsub_token IS NULL").bind(id).run(); } catch (e) {}
      if (nl) { try { const ct = clip(b.consent_text, 500) || (await mailCfg(env)).consent_text; if (ct) await env.DB.prepare("UPDATE users SET consent_text=?2 WHERE id=?1").bind(id, ct).run(); } catch (e) {} }
      await seenLog(env, id);
      return json({ ok: true, id, returning: false, newsletter: !!nl });
    } catch (e) { if (attempt) throw e; }
  }
  return fail(503, "db_error");
}

let SEEN_OK = false;
async function seenLog(env, id) { // v36: un passaggio al giorno per iscritto
  try {
    if (!SEEN_OK) { await env.DB.prepare("CREATE TABLE IF NOT EXISTS seen_log (user_id TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY (user_id, day))").run(); SEEN_OK = true; }
    await env.DB.prepare("INSERT OR IGNORE INTO seen_log (user_id, day) VALUES (?1, ?2)").bind(id, romeToday()).run();
  } catch (e) {}
}
async function seenUser(request, env) {
  let b = {}; try { b = JSON.parse(await request.text()); } catch {}
  const id = b && typeof b.id === "string" && b.id.length <= 64 ? b.id : null;
  if (id) {
    const now = new Date().toISOString();
    await env.DB.prepare("UPDATE users SET last_seen=?2, visits=visits+1 WHERE id=?1 AND last_seen<?3")
      .bind(id, now, new Date(Date.now() - 6 * 3600000).toISOString()).run();
    await seenLog(env, id);
  }
  return json({ ok: true });
}

function csvCell(v) { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }

const unpack = (row) => ({ ...JSON.parse(row.data), key: row.key });


// ================= INSTAGRAM (login Instagram, senza Pagina Facebook) =================
// Secret richiesto: IG_APP_SECRET   |   Il token non viene mai mostrato né restituito.
const IG_APP_ID = "1786208542590699";
const IG_SCOPE = "instagram_business_basic,instagram_business_content_publish";
const IG_GRAPH = "https://graph.instagram.com/v23.0";

let KV_OK = null; // v26: la tabella si crea una volta per istanza, non a ogni lettura (era un viaggio in più verso il database ogni volta)
async function kvInit(env) {
  if (!KV_OK) KV_OK = env.DB.prepare("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated_at TEXT NOT NULL)").run().catch((e) => { KV_OK = null; throw e; });
  await KV_OK;
}
async function kvGet(env, k) {
  await kvInit(env);
  const r = await env.DB.prepare("SELECT v FROM kv WHERE k=?1").bind(k).first();
  return r ? JSON.parse(r.v) : null;
}
async function kvSet(env, k, v) {
  await kvInit(env);
  await env.DB.prepare("INSERT OR REPLACE INTO kv (k,v,updated_at) VALUES (?1,?2,?3)").bind(k, JSON.stringify(v), new Date().toISOString()).run();
}
async function kvDel(env, k) { await kvInit(env); await env.DB.prepare("DELETE FROM kv WHERE k=?1").bind(k).run(); }
const htmlPage = (title, body, status = 200) =>
  new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font:18px/1.5 system-ui;max-width:640px;margin:40px auto;padding:0 20px"><h2>${title}</h2>${body}`, { status, headers: { "content-type": "text/html; charset=utf-8" } });
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function safeEq(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
async function gj(res) { let j = {}; try { j = await res.json(); } catch (e) {} return j; }



// ---- Hashtag: Instagram ne accetta al massimo 5; su TikTok usiamo 3 fissi + 2 sul tema ----
const HT_GENERIC = ["#geopolitica", "#esteri", "#attualità", "#attualita", "#notizie", "#news", "#readgeopolitics", "#imparacontiktok", "#laparola"];
function capTags(cap, fixed, max, addIfNone) {
  const lines = String(cap || "").replace(/\s+$/, "").split("\n");
  const tags = [];
  while (lines.length && /^\s*(#[^\s#]+\s*)+$/.test(lines[lines.length - 1])) tags.unshift(...lines.pop().trim().split(/\s+/));
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (!tags.length && !addIfNone) return String(cap || "");
  const inline = (lines.join("\n").match(/(^|\s)#[^\s#]+/g) || []).length;
  const lc = tags.map((t) => t.toLowerCase());
  const out = [];
  for (const t of fixed) if (!out.includes(t)) out.push(t);
  for (const t of lc.filter((t) => !HT_GENERIC.includes(t))) if (out.length < max && !out.includes(t)) out.push(t);
  for (const t of lc) if (out.length < max && !out.includes(t)) out.push(t);
  const keep = out.slice(0, Math.max(0, max - inline));
  return lines.join("\n") + (keep.length ? "\n\n" + keep.join(" ") : "");
}
const igCaption = (cap) => capTags(cap, ["#geopolitica"], 5, false);
const ttCaption = (cap) => capTags(cap, ["#geopolitica", "#notizie", "#imparacontiktok"], 5, true);
// ---- Hosting immagini per Instagram: le carte JPEG vengono caricate qui e Instagram le scarica da /ig/img/<id>.jpg ----
function rid() { const a = new Uint8Array(16); crypto.getRandomValues(a); return [...a].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function igStoreImage(env, origin, b64) {
  const clean = String(b64 || "").replace(/^data:[^,]*,/, "").replace(/\s+/g, "");
  if (!clean.startsWith("/9j/")) throw { status: 400, code: "not_jpeg", detail: "Instagram accetta solo JPEG" };
  if (clean.length > 1500000) throw { status: 413, code: "image_too_big", detail: "Immagine oltre ~1 MB: comprimila" };
  const id = rid();
  await kvSet(env, "img:" + id, clean);
  return `${origin}/ig/img/${id}.jpg`;
}
async function igPublishUrls(request, env, origin, b) {
  const req = new Request((origin || "https://x.invalid") + "/v1/ig/publish", { method: "POST", body: JSON.stringify(b) });
  const res = await igPrivate(req, env, "/v1/ig/publish", "POST");
  return await res.json();
}
// ---- Video (Reel): caricati in blocchi base64 nel database e serviti a /ig/vid/<id>.mp4 (con Range, Instagram li scarica da qui) ----
const VCH = 700000; // multiplo di 4: ogni blocco si decodifica da solo
async function igStoreVideo(env, origin, b64) {
  const clean = String(b64 || "").replace(/^data:[^,]*,/, "").replace(/\s+/g, "");
  if (clean.length < 1000) throw { status: 400, code: "video_missing" };
  let head = ""; try { head = atob(clean.slice(0, 16)); } catch (e) {}
  if (!head.includes("ftyp")) throw { status: 400, code: "not_mp4", detail: "Instagram accetta mp4 (h264 + aac)" };
  if (clean.length > 14000000) throw { status: 413, code: "video_too_big", detail: "Oltre ~10 MB: ricomprimi" };
  const id = rid();
  /* v19: se c'è il bucket R2 (lo stesso del podcast), il video si decodifica UNA volta e si salva lì:
     Instagram lo scarica a pezzi (Range) e R2 li serve senza ricalcolare nulla. Prima ogni richiesta
     di Instagram ridecodificava tutto il video e a volte il Worker superava il limite di CPU: da qui gli errori intermittenti. */
  if (env.PODCAST) {
    let bytes;
    if (typeof Uint8Array.fromBase64 === "function") bytes = Uint8Array.fromBase64(clean);
    else { const bin = atob(clean); bytes = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j); }
    await env.PODCAST.put("igvid/" + id + ".mp4", bytes, { httpMetadata: { contentType: "video/mp4", cacheControl: "public, max-age=3600" } });
    await kvSet(env, "vid:" + id, { r2: true, n: 0, b64len: clean.length });
    return { url: origin + "/ig/vid/" + id + ".mp4", bytes: bytes.length };
  }
  const n = Math.ceil(clean.length / VCH);
  for (let i = 0; i < n; i++) await kvSet(env, "vidc:" + id + ":" + i, clean.slice(i * VCH, (i + 1) * VCH));
  await kvSet(env, "vid:" + id, { n, b64len: clean.length });
  return { url: origin + "/ig/vid/" + id + ".mp4", bytes: Math.floor(clean.length * 3 / 4) };
}
async function igServeVideo(request, env, id) {
  const meta = await kvGet(env, "vid:" + id);
  if (!meta) return new Response("not found", { status: 404 });
  if (meta.r2 && env.PODCAST) {
    const key = "igvid/" + id + ".mp4";
    const head = await env.PODCAST.head(key);
    if (!head) return new Response("not found", { status: 404 });
    const size = head.size;
    const base = { "content-type": "video/mp4", "accept-ranges": "bytes", "cache-control": "public, max-age=3600", etag: head.httpEtag };
    if (request.method === "HEAD") return new Response(null, { status: 200, headers: { ...base, "content-length": String(size) } });
    const rm = (request.headers.get("range") || "").match(/^bytes=(\d*)-(\d*)$/);
    if (rm && (rm[1] !== "" || rm[2] !== "")) {
      let start, end;
      if (rm[1] === "") { const k = Math.min(+rm[2], size); start = size - k; end = size - 1; }
      else { start = +rm[1]; end = rm[2] === "" ? size - 1 : Math.min(+rm[2], size - 1); }
      if (start >= size || start > end) return new Response(null, { status: 416, headers: { ...base, "content-range": "bytes */" + size } });
      const obj = await env.PODCAST.get(key, { range: { offset: start, length: end - start + 1 } });
      return new Response(obj.body, { status: 206, headers: { ...base, "content-length": String(end - start + 1), "content-range": `bytes ${start}-${end}/${size}` } });
    }
    const obj = await env.PODCAST.get(key);
    return new Response(obj.body, { status: 200, headers: { ...base, "content-length": String(size) } });
  }
  const parts = []; let total = 0;
  for (let i = 0; i < meta.n; i++) {
    const c = await kvGet(env, "vidc:" + id + ":" + i);
    if (!c) return new Response("not found", { status: 404 });
    const bin = atob(c); const u = new Uint8Array(bin.length);
    for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j);
    parts.push(u); total += u.length;
  }
  const all = new Uint8Array(total); let o = 0; for (const u of parts) { all.set(u, o); o += u.length; }
  let start = 0, end = total - 1, status = 200;
  const mm = (request.headers.get("range") || "").match(/^bytes=(\d*)-(\d*)$/);
  if (mm && (mm[1] || mm[2])) {
    if (mm[1] === "") start = Math.max(0, total - parseInt(mm[2], 10));
    else { start = parseInt(mm[1], 10); if (mm[2]) end = Math.min(end, parseInt(mm[2], 10)); }
    if (start > end || start >= total) return new Response(null, { status: 416, headers: { "content-range": "bytes */" + total } });
    status = 206;
  }
  const h = { "content-type": "video/mp4", "accept-ranges": "bytes", "content-length": String(end - start + 1), "cache-control": "public, max-age=3600" };
  if (status === 206) h["content-range"] = "bytes " + start + "-" + end + "/" + total;
  return new Response(request.method === "HEAD" ? null : all.slice(start, end + 1), { status, headers: h });
}

// ---- Catalogo dei contenuti standard e piano della settimana ----
// pronto: la routine sa produrlo. auto_ok: la routine delle 07:30 lo produce da sola nel giorno previsto.
const IG_TEMPLATES = [
  { id: "mondo-oggi", formato: "carosello", nome: "Il mondo oggi", desc: "Le 4 storie principali del briefing, 7-8 carte", pronto: true, auto_ok: true, param: "Tema (facoltativo, per esempio Brasile)" },
  { id: "numero", formato: "carosello", nome: "Il numero", desc: "Un indicatore che si è mosso: grafico, spiegazione e limiti", pronto: true, auto_ok: true, param: "Indicatore (facoltativo, per esempio spread-btp-bund)" },
  { id: "reel-storia", formato: "reel", nome: "La storia in 40 secondi", desc: "Fatto, confronto con i giorni scorsi, conto, le due letture, cosa decide", pronto: true, auto_ok: true, param: "Storia (facoltativo: id o titolo; altrimenti la più forte di oggi)" },
  { id: "parola", formato: "carosello", nome: "La parola", desc: "Una parola delle notizie della settimana: cos'è (dal glossario), dove compare, perché conta", pronto: true, auto_ok: true, param: "Parola (facoltativo, per esempio scostamento di bilancio)" },
  { id: "sito-reel", formato: "reel", nome: "Dentro il sito", desc: "Una navigazione vera del sito sul telefono, a rotazione: temi e quadro, una storia, una parola, l'archivio", pronto: true, auto_ok: true, param: "Percorso (facoltativo: temi, storia, parola, cerca)" },
  { id: "oggi-reel", formato: "reel", nome: "Oggi in 40 secondi", desc: "Le notizie del giorno (3 dal mondo, 1 dall'Italia) su un globo, con apertura radar a tempo di musica", pronto: true, auto_ok: true, param: null },
  { id: "settimana-reel", formato: "reel", nome: "La settimana in 40 secondi", desc: "Il riepilogo della settimana su un globo che ruota verso ogni storia", pronto: true, auto_ok: true, param: null },
  { id: "numero-reel", formato: "reel", nome: "Il numero in 30 secondi", desc: "Un indicatore che si è mosso: il grafico che si disegna, cosa misura, perché si è mosso, cosa non dice", pronto: true, auto_ok: true, param: "Indicatore (facoltativo, per esempio spread)" },
  { id: "due-letture", formato: "carosello", nome: "Due letture", desc: "Una storia: i fatti, le due tesi a confronto, dove reggono e dove cedono", pronto: true, auto_ok: true, param: "Storia (facoltativo)" },
  { id: "sito-schermate", formato: "carosello", nome: "Il sito in 3 schermate", desc: "Tre schermate vere del sito (briefing, numeri, cronologia), con i dati di oggi", pronto: true, auto_ok: true, param: null },
  { id: "settimana-apre", formato: "carosello", nome: "La settimana che si apre", desc: "Date in agenda, segnali da osservare, numeri in movimento", pronto: true, auto_ok: true, param: null },
  { id: "filone", formato: "carosello", nome: "Il punto che sfugge", desc: "Una distinzione o un collegamento che le singole notizie non mostrano", pronto: true, auto_ok: true, param: "Filone (facoltativo: id o titolo; altrimenti il più mosso della settimana)" },
  { id: "settimana-sintesi", formato: "carosello", nome: "La settimana in sintesi", desc: "Il bilancio dei sette giorni: da dove si è partiti, dove si è arrivati, perché conta", pronto: true, auto_ok: true, param: null },
  { id: "spiegato", formato: "reel", nome: "Spiegato in 40 secondi", desc: "Un tema caldo spiegato: dove, perché, il punto aperto, il dossier", pronto: true, auto_ok: false, param: "Tema (per esempio Tregua di Oleshky)" },
  { id: "post-storia", formato: "post", nome: "La storia in una carta", desc: "Una sola immagine con la storia più forte", pronto: false, auto_ok: false, param: null },
  { id: "story-titolo", formato: "story", nome: "Storia: il titolo del giorno", desc: "Una carta verticale statica", pronto: false, auto_ok: false, param: null },
];
const PLAN_DEFAULT = [
  { dow: 1, rubrica: "La settimana che si apre", formato: "carosello", template: "settimana-apre", ora: "08:30", auto: true, note: "Agenda, segnali, numeri" },
  { dow: 2, rubrica: "La storia in 40 secondi", formato: "reel", template: "reel-storia", ora: "12:30", auto: true, note: "Reel dalla storia più forte" },
  { dow: 3, rubrica: "La parola", formato: "carosello", template: "parola", ora: "08:30", auto: true, note: "Una parola delle notizie, spiegata nel contesto" },
  { dow: 4, rubrica: "Due letture", formato: "carosello", template: "due-letture", ora: "08:30", auto: true, note: "Una storia, due tesi a confronto" },
  { dow: 5, rubrica: "Oggi in 40 secondi", formato: "reel", template: "oggi-reel", ora: "08:30", auto: true, note: "Le notizie del giorno sul globo, apertura radar" },
  { dow: 6, rubrica: "Il punto che sfugge", formato: "carosello", template: "filone", ora: "10:00", auto: true, note: "Quello che le singole notizie non mostrano" },
  { dow: 7, rubrica: "La settimana in 40 secondi", formato: "reel", template: "settimana-reel", ora: "10:00", auto: true, note: "Riepilogo sul globo" },
];
async function igPlan(env) {
  const o = (await kvGet(env, "ig_plan")) || [];
  return PLAN_DEFAULT.map((d) => ({ ...d, ...(o.find((x) => x && x.dow === d.dow) || {}) }));
}
const FORMATI = ["carosello", "reel", "post", "story"];
const romeDow = (dateStr) => { const d = new Date(dateStr + "T12:00:00Z").getUTCDay(); return d === 0 ? 7 : d; };
const TEST_PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Test Instagram</title>
<body style="font:17px/1.5 system-ui;max-width:640px;margin:30px auto;padding:0 18px">
<h2>Test pubblicazione Instagram</h2>
<p>1) scegli uno o più JPEG (con più immagini fa un carosello)<br>2) scrivi una didascalia<br>3) lascia spuntato «solo prova» per la prima volta</p>
<p><input type="file" id="f" accept="image/jpeg" multiple></p>
<p><select id="t"><option value="auto">Post / carosello (automatico)</option><option value="story">Storia (1 immagine)</option></select></p>
<p><textarea id="c" rows="3" style="width:100%" placeholder="Didascalia"></textarea></p>
<p><label><input type="checkbox" id="d" checked> solo prova (crea il contenitore ma NON pubblica)</label></p>
<p><button id="b" style="font-size:18px;padding:10px 18px">Invia</button></p>
<pre id="o" style="white-space:pre-wrap;background:#f3f3f3;padding:12px"></pre>
<script>
const K=new URLSearchParams(location.search).get("k");

const rd=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
document.getElementById("b").onclick=async()=>{
  const o=document.getElementById("o"),fs=[...document.getElementById("f").files];
  if(!fs.length){o.textContent="Scegli almeno un file JPEG.";return}
  o.textContent="Invio in corso…";
  const images=[];for(const f of fs)images.push(await rd(f));
  const t=document.getElementById("t").value;
  const type=t==="story"?"story":(fs.length>1?"carousel":"image");
  const r=await fetch("/ig/test",{method:"POST",body:JSON.stringify({k:K,type,caption:document.getElementById("c").value,dry_run:document.getElementById("d").checked,images})});
  o.textContent=JSON.stringify(await r.json(),null,2);
};
</script>`;


// ---------- Bozze, pannello e auto-pubblicazione ----------
async function kvList(env, prefix, limit = 40) {
  await kvInit(env);
  const r = await env.DB.prepare("SELECT k, v, updated_at FROM kv WHERE k LIKE ?1 ORDER BY updated_at DESC LIMIT ?2").bind(prefix + "%", limit).all();
  return (r.results || []).map((x) => ({ ...JSON.parse(x.v), _k: x.k, _u: x.updated_at }));
}
const DEFAULT_SETTINGS = { paused: false, formats: { daily: { mode: "approva", time: "08:30" } } };
async function igSettings(env) {
  const s = (await kvGet(env, "ig_settings")) || {};
  return { paused: !!s.paused, formats: { ...DEFAULT_SETTINGS.formats, ...(s.formats || {}) } };
}
function romeLocal(dateStr, hhmm) { // data+ora di Roma -> ISO UTC
  const guess = new Date(`${dateStr}T${hhmm}:00Z`);
  const part = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", timeZoneName: "shortOffset" }).formatToParts(guess).find((p) => p.type === "timeZoneName").value;
  const m = part.match(/GMT([+-]\d+)/); const off = m ? parseInt(m[1], 10) : 1;
  return new Date(guess.getTime() - off * 3600000).toISOString();
}
const romeToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());

async function reqCreate(env, tpl, o) { // richiesta di un contenuto: dal pannello o da una svolta della routine «aggiornamenti»
    const open = (await kvList(env, "req:", 30)).filter((x) => x.stato === "in_coda");
    if (open.length >= 10) throw { status: 429, code: "troppe_richieste_in_coda" };
    const id = rid().slice(0, 10);
    const r = { id, template: tpl.id, formato: tpl.formato, nome: tpl.nome, param: clip(o.param, 200), note: clip(o.note, 50000), forza: !!o.forza, ...(o.origine ? { origine: clip(o.origine, 80) } : {}), stato: "in_coda", created_at: new Date().toISOString(), date: romeToday() };
    if (env.RICHIESTE_ROUTINE_ID && env.RICHIESTE_ROUTINE_TOKEN) { // avvio immediato della routine (API trigger); se fallisce, la richiesta resta in coda
      try {
        const fr = await fetch("https://api.anthropic.com/v1/claude_code/routines/" + encodeURIComponent(env.RICHIESTE_ROUTINE_ID) + "/fire", {
          method: "POST", headers: { authorization: "Bearer " + env.RICHIESTE_ROUTINE_TOKEN, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ text: "Nuova richiesta dal pannello: " + id }), signal: AbortSignal.timeout(8000),
        });
        r.fire = fr.ok ? "avviata" : "errore " + fr.status;
      } catch (e) { r.fire = "errore di rete"; }
    }
    await kvSet(env, "req:" + id, r);
    return r;
}

async function draftCreate(env, origin, b) {
  const format = String(b.format || "daily").replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "daily";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date || "") ? b.date : romeToday();
  const id = `${date}-${format}`;
  const old = await kvGet(env, "draft:" + id);
  if (old && ["pubblicata", "in_pubblicazione"].includes(old.status) && !b.force) throw { status: 409, code: "already_published", detail: id };
  const isReel = b.type === "reel" || !!b.video_b64;
  { // guardia: una richiesta del pannello in formato reel non può diventare un carosello in silenzio
    const rq = b.req_id ? await kvGet(env, "req:" + String(b.req_id).slice(0, 40)) : null;
    const tpl = IG_TEMPLATES.find((t) => t.id === (rq ? rq.template : b.template));
    if (tpl && tpl.formato === "reel" && !isReel) throw { status: 422, code: "formato_richiesto_reel", detail: "La richiesta è un reel: serve type:'reel' e video_b64. Niente ripiego sul carosello: segna la richiesta come fail con il motivo vero." };
  }
  const urls = []; let video = null;
  if (isReel) video = await igStoreVideo(env, origin, b.video_b64);
  else {
    const imgs = Array.isArray(b.images_b64) ? b.images_b64 : [];
    if (!imgs.length || imgs.length > 10) throw { status: 400, code: "images_1_to_10" };
    for (const x of imgs) urls.push(await igStoreImage(env, origin, x));
  }
  const type = isReel ? "reel" : (b.type || (urls.length > 1 ? "carousel" : "image"));
  const st = await igSettings(env);
  const f = st.formats[format] || { mode: "approva", time: "08:30" };
  const d = { id, format, date, type, caption: igCaption(String(b.caption || "").slice(0, 2200)), image_urls: urls, ...(video ? { video_url: video.url, video_bytes: video.bytes, ...(Number.isFinite(+b.thumb_ms) && +b.thumb_ms > 0 && +b.thumb_ms < 90000 ? { thumb_ms: Math.round(+b.thumb_ms) } : {}) } : {}), template: clip(b.template, 40), req_id: clip(b.req_id, 40), status: "bozza", mode: f.mode, publish_at: romeLocal(date, (format === "daily" && ((await igPlan(env))[romeDow(date) - 1] || {}).ora) || f.time || "08:30"), created_at: new Date().toISOString(), note: String(b.note || "").slice(0, 400), ...(typeof b.th_domanda === "string" && b.th_domanda.trim() ? { th_domanda: b.th_domanda.trim().slice(0, 500) } : {}) };
  await kvSet(env, "draft:" + id, d);
  return d;
}
async function draftFinish(env, origin, id) { // reel rimasto in elaborazione: controlla e pubblica se pronto
  const d = await kvGet(env, "draft:" + id);
  if (!d) throw { status: 404, code: "draft_not_found" };
  if (d.status !== "in_elaborazione" || !d.creation_id) throw { status: 409, code: "bad_status", detail: d.status };
  try {
    const out = await igPublishUrls(null, env, origin, { creation_id: d.creation_id });
    if (!out.ok) throw out;
    if (out.pending) { d.checked_at = new Date().toISOString(); await kvSet(env, "draft:" + id, d); return d; }
    d.status = "pubblicata"; d.published_at = new Date().toISOString(); d.permalink = out.permalink || null; d.media_id = out.media_id || null; delete d.error;
  } catch (e) { d.status = "errore"; d.error = JSON.stringify(e.detail || e).slice(0, 500); }
  await kvSet(env, "draft:" + id, d);
  if (d.status === "pubblicata") { try { await ttAuto(env, id); } catch (e) {} } // v20: copia su TikTok se attivato
  if (d.status === "pubblicata") { try { await thAuto(env, id); } catch (e) {} } // v30: e su Threads
  if (d.status === "pubblicata") { try { await tgAuto(env, id); } catch (e) {} } // v33: e su Telegram
  return d;
}
async function draftPublish(env, origin, id, by) {
  const d = await kvGet(env, "draft:" + id);
  if (!d) throw { status: 404, code: "draft_not_found" };
  if (d.status !== "bozza" && d.status !== "errore") throw { status: 409, code: "bad_status", detail: d.status };
  d.status = "in_pubblicazione"; d.started_at = new Date().toISOString(); d.by = by; await kvSet(env, "draft:" + id, d);
  try {
    const out = await igPublishUrls(null, env, origin, { type: d.type, image_urls: d.image_urls, video_url: d.video_url, caption: igCaption(d.caption), thumb_offset: d.thumb_ms });
    if (!out.ok) throw out;
    if (out.pending) { d.status = "in_elaborazione"; d.creation_id = out.creation_id; delete d.error; await kvSet(env, "draft:" + id, d); return d; }
    d.status = "pubblicata"; d.published_at = new Date().toISOString(); d.permalink = out.permalink || null; d.media_id = out.media_id || null; delete d.error;
  } catch (e) { d.status = "errore"; d.error = JSON.stringify(e.detail || e).slice(0, 500); }
  await kvSet(env, "draft:" + id, d);
  if (d.status === "pubblicata") { try { await ttAuto(env, id); } catch (e) {} } // v20: copia su TikTok se attivato
  if (d.status === "pubblicata") { try { await thAuto(env, id); } catch (e) {} } // v30: e su Threads
  if (d.status === "pubblicata") { try { await tgAuto(env, id); } catch (e) {} } // v33: e su Telegram
  return d;
}
async function autoPublish(env) {
  const st = await igSettings(env);
  if (st.paused) return;
  const now = Date.now();
  for (const d of await kvList(env, "draft:", 20)) {
    if (d.status === "in_elaborazione") { await draftFinish(env, "https://auto.invalid", d.id); continue; }
    if (d.status !== "bozza") continue;
    const f = st.formats[d.format];
    if (!f || f.mode !== "auto") continue;
    if (Date.parse(d.publish_at) > now) continue;
    if (now - Date.parse(d.created_at) > 20 * 3600000) { d.status = "scaduta"; await kvSet(env, "draft:" + d.id, d); continue; }
    await draftPublish(env, "https://auto.invalid", d.id, "auto");
  }
}
// ---- Accesso al pannello: password -> cookie di sessione (HttpOnly, 30 giorni). Nessun token nell'URL ----
function getCookie(request, name) {
  const m = (request.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([0-9a-f]{32})"));
  return m ? m[1] : null;
}
async function sessionOk(request, env) {
  const id = getCookie(request, "rg_sess");
  if (!id) return false;
  const s = await kvGet(env, "sess:" + id);
  return !!(s && s.exp > Date.now());
}
async function panelAuth(request, env, b) {
  return safeEq(String((b && b.k) || ""), env.WRITE_TOKEN || "") || (await sessionOk(request, env));
}
const LOGIN_PAGE = (msg) => `<!doctype html><meta charset="utf-8"><link rel="icon" href="/ig/panel.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/ig/panel-180.png"><link rel="manifest" href="/ig/panel.webmanifest"><meta name="apple-mobile-web-app-title" content="Pannello RG"><meta name="theme-color" content="#0B1830"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Accesso</title>
<style>:root{color-scheme:dark}body{margin:0;background:#0E151B;color:#E4EAEF;font:16px system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center}
form{width:min(340px,90vw)}h1{font:600 22px Georgia,serif;margin:0 0 14px}input,button{width:100%;font:16px system-ui;padding:12px;border-radius:10px;border:1px solid #34475A;background:#16212A;color:#E4EAEF;margin-bottom:10px}
button{background:#86B4EA;color:#0E151B;font-weight:600;border:0}.e{color:#FF9A9A;font-size:14px;min-height:20px}</style>
<form id="f"><h1>Pannello Instagram</h1><a href="/ig/logout" style="float:right;font-size:14px">Esci</a><input type="password" id="p" placeholder="Password" autocomplete="current-password" autofocus><button>Entra</button><div class="e" id="e">${msg || ""}</div></form>
<script>document.getElementById("f").onsubmit=async e=>{e.preventDefault();const r=await fetch("/ig/login",{method:"POST",body:JSON.stringify({password:document.getElementById("p").value})});const j=await r.json().catch(()=>({}));if(j.ok)location.href="/ig/panel";else document.getElementById("e").textContent=j.error==="troppi_tentativi"?"Troppi tentativi: riprova tra 15 minuti.":"Password errata."}</script>`;
async function panelApi(env, origin, b) {
  const act = b.action;
  if (String(act || "").startsWith("tt_")) { const r = await ttPanelApi(env, b); if (r) return r; }
  if (String(act || "").startsWith("th_")) { const r = await thPanelApi(env, b); if (r) return r; }
  if (String(act || "").startsWith("tg_")) { const r = await tgPanelApi(env, b); if (r) return r; }
  if (String(act || "").startsWith("sv_")) { const r = await svPanelApi(env, b); if (r) return r; }
  /* v60: queste azioni stavano dentro tgPanelApi, che però riceve solo le azioni «tg_…»: non arrivavano mai */
  if (act === "canali_set") return await canaliSet(env, b);
  if (act === "sond_set") return await sondSet(env, b);
  if (act === "todo_set") return await todoSet(env, b);
  if (act === "sond_pick") return await sondPick(env, b);
  if (act === "temi") return { ok: true, temi: await richiesteTemi(env) };
  if (act === "proposte") return { ok: true, proposte: await igProposte(env, !!b.force), scelte: await igScelte(env) };
  if (act === "scelta_set") {
    const date = String(b.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < romeToday()) throw { status: 400, code: "bad_date", detail: "data non valida o passata" };
    const sc = await igScelte(env);
    if (!b.value) delete sc[date];
    else {
      if (!["parola", "storia", "filone", "tema"].includes(b.kind)) throw { status: 400, code: "bad_kind" };
      sc[date] = { kind: b.kind, value: String(b.value).slice(0, 120), label: String(b.label || b.value).slice(0, 120), set_at: new Date().toISOString() };
    }
    await kvSet(env, "ig_scelte", sc);
    return { ok: true, scelte: sc };
  }
  if (act === "stats") return { ok: true, stats: await siteStats(env, b.days, !!b.force) };
  if (act === "vote_stats") return { ok: true, v: await voteStats(env) };
  if (act === "list") {
    /* v26: letture in parallelo invece che una dopo l'altra (il pannello si apriva lento). */
    await kvInit(env);
    const [t, st, draftsRaw, reqsRaw, plan, reqSeen, tiktok, ttRows, threads, thRows, telegram, tgRows, canali, svAll, giri, sond] = await Promise.all([
      igSeed(env).catch(() => null), igSettings(env), kvList(env, "draft:", 30), kvList(env, "req:", 30),
      igPlan(env), kvGet(env, "ig_req_seen"), ttPanelInfo(env), kvList(env, "tt:", 40), thPanelInfo(env), kvList(env, "th:", 40), tgPanelInfo(env), kvList(env, "tg:", 40), canaliInfo(env).catch(() => null), svList(env).catch(() => []), kvGet(env, "giri:" + romeToday()), sondInfo(env).catch(() => null),
    ]);
    const drafts = draftsRaw.sort((a, z) => String(z.created_at).localeCompare(String(a.created_at)));
    const reqs = reqsRaw.sort((a, z) => String(z.created_at).localeCompare(String(a.created_at))).map(({ _k, _u, ...x }) => (x.stato === "in_lavorazione" && Date.now() - Date.parse(x.started_at || x.created_at) > 3 * 3600000 ? { ...x, stato: "bloccata" } : x));
    const ieri = romeYesterday();
    return { ok: true, svolte: svAll.filter((x) => x.date >= ieri), giri: giri || [], settings: st, today: romeToday(), plan, templates: IG_TEMPLATES, requests: reqs, req_seen: reqSeen, tiktok, tt: Object.fromEntries(ttRows.map(({ _k, _u, ...x }) => [x.id, x])), threads, th: Object.fromEntries(thRows.map(({ _k, _u, ...x }) => [x.id, x])), telegram, tg: Object.fromEntries(tgRows.map(({ _k, _u, ...x }) => [x.id, x])), canali, sond, account: t ? { username: t.username, days_left: Math.floor((Date.parse(t.expires_at) - Date.now()) / 86400000) } : null, drafts: drafts.map(({ _k, _u, ...x }) => ({ ...x, tt_cap: x.tt_caption || ttCaption(x.caption), th_cap: x.th_caption || thCaption(x.caption) })) };
  }

  if (act === "users") {
    const { results } = await env.DB.prepare(
      "SELECT email, created_at, last_seen, visits, source, campaign, newsletter_at, unsub_at FROM users ORDER BY created_at DESC LIMIT 5000"
    ).all();
    const tot = await env.DB.prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN newsletter_at IS NOT NULL AND unsub_at IS NULL THEN 1 ELSE 0 END) AS nl, SUM(CASE WHEN unsub_at IS NOT NULL THEN 1 ELSE 0 END) AS un FROM users").first();
    return { ok: true, total: (tot && tot.n) || 0, newsletter: (tot && tot.nl) || 0, unsub: (tot && tot.un) || 0, users: results };
  }
  if (typeof act === "string" && act.startsWith("mail_")) return await mailPanel(env, b);
  if (act === "draft_reset") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    if (!["in_pubblicazione", "in_elaborazione", "errore"].includes(d.status)) throw { status: 409, code: "bad_status", detail: d.status };
    d.status = "bozza"; d.reset_at = new Date().toISOString();
    delete d.error; delete d.creation_id; delete d.started_at; delete d.by; delete d.checked_at;
    await kvSet(env, "draft:" + d.id, d);
    return { ok: true, draft: d };
  }
  if (act === "finish") { const d = await draftFinish(env, origin, String(b.id)); return { ok: d.status === "pubblicata", draft: d }; }
  if (act === "plan_set") {
    const dow = parseInt(b.dow, 10);
    if (!(dow >= 1 && dow <= 7)) throw { status: 400, code: "bad_dow" };
    const e = b.entry || {};
    const tpl = IG_TEMPLATES.find((x) => x.id === e.template);
    const cur = (await kvGet(env, "ig_plan")) || [];
    const ent = { dow, rubrica: clip(e.rubrica, 60) || "Da definire", formato: FORMATI.includes(e.formato) ? e.formato : "carosello", template: tpl ? tpl.id : "", ora: /^\d{2}:\d{2}$/.test(e.ora || "") ? e.ora : "08:30", auto: !!(e.auto && tpl && tpl.pronto && tpl.auto_ok), note: clip(e.note, 160) || "" };
    await kvSet(env, "ig_plan", cur.filter((x) => x && x.dow !== dow).concat([ent]));
    return { ok: true, plan: await igPlan(env) };
  }
  if (act === "req_create") {
    const tpl = IG_TEMPLATES.find((x) => x.id === b.template);
    if (!tpl || !tpl.pronto) throw { status: 400, code: "template_non_pronto" };
    return { ok: true, request: await reqCreate(env, tpl, { param: b.param, note: b.note, forza: b.forza }) };
  }
  if (act === "req_cancel") {
    const r = await kvGet(env, "req:" + String(b.id));
    if (!r) throw { status: 404, code: "req_not_found" };
    if (r.stato !== "in_coda") throw { status: 409, code: "bad_status", detail: r.stato };
    r.stato = "annullata"; await kvSet(env, "req:" + r.id, r);
    return { ok: true };
  }
  if (act === "publish") { const d = await draftPublish(env, origin, String(b.id), "panel"); return { ok: d.status === "pubblicata", draft: d }; }
  if (act === "discard" || act === "caption") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    if (["pubblicata", "in_pubblicazione"].includes(d.status)) throw { status: 409, code: "already_published" };
    if (act === "discard") d.status = "scartata"; else d.caption = String(b.caption || "").slice(0, 2200);
    await kvSet(env, "draft:" + d.id, d);
    return { ok: true, draft: d };
  }
  if (act === "addimage") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    if (["pubblicata", "in_pubblicazione"].includes(d.status)) throw { status: 409, code: "already_published" };
    return { ok: true, url: await igStoreImage(env, origin, b.data_base64) };
  }
  if (act === "images") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    if (["pubblicata", "in_pubblicazione"].includes(d.status)) throw { status: 409, code: "already_published" };
    const ids = (Array.isArray(b.urls) ? b.urls : []).map((u) => { const m = String(u).match(/\/ig\/img\/([0-9a-f]{32})\.jpg$/); return m ? m[1] : null; });
    if (ids.length < 2 || ids.length > 10 || ids.some((x) => !x)) throw { status: 400, code: "images_2_to_10" };
    for (const id of ids) if (!(await kvGet(env, "img:" + id))) throw { status: 404, code: "image_missing", detail: id };
    if (!d.original_urls) d.original_urls = d.image_urls;
    d.image_urls = ids.map((id) => origin + "/ig/img/" + id + ".jpg");
    await kvSet(env, "draft:" + d.id, d);
    return { ok: true, draft: d };
  }
  if (act === "restore") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (d && d.status === "scartata") { d.status = "bozza"; await kvSet(env, "draft:" + d.id, d); }
    return { ok: true };
  }
  if (act === "settings") {
    const cur = await igSettings(env);
    if (typeof b.paused === "boolean") cur.paused = b.paused;
    if (b.format && b.mode && ["approva", "auto"].includes(b.mode)) cur.formats[b.format] = { ...(cur.formats[b.format] || {}), mode: b.mode, time: /^\d{2}:\d{2}$/.test(b.time || "") ? b.time : (cur.formats[b.format] || {}).time || "08:30" };
    await kvSet(env, "ig_settings", cur);
    return { ok: true, settings: cur };
  }
  throw { status: 400, code: "bad_action" };
}
const PANEL_PNG = {"180": "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", "192": "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAQAElEQVR4nOydB3xb1fXHf0+yZVveU07i7MTZtjPIdCCsEELY0ACBQkoLpaymtKVQ4J9SaBkFyoayoWUTEhLIHpA9nHjEmc6yk2B5L3nKev97XuJ8HMeS7nt6kp7s9/18ZK0nWXq6596z7jlB0AgmS9pIoygMFoAkdtcCg2ABRMuZ+yK7LyAaOtpHRDUE0cpuWUUIdF0Cx6n7YPftgqOg2Zq7GxpAgP8whiZnTDWK4lUicLUgCAOg020QRfEwG3yLWgXDosbiXevZQw74AR8LQEpYWFLcTINBuJrduYL9+zjo6IhiCZsEl7AbC+utFauA4w3wET4RgJDE4YOCDMHzRUG4jv3DMOjoOIEJQoMA8Wu7HU81leUcgJfxqgCYE4b1gDHkb+zmXEFAEHR0OBFF2Nnf99BqeLK+bNdJeAnvCEBMRkyYSXxEMAj36zO+jifQisDshZcbGh3PoTqvEiqjsgCkhIVb4h9kb/swe+cY6OiohsgGv/CMrbjsVTVtBNUEILTH6L5G0bGMveVQ6Oh4DXEf8xzNaPx51zGogAEqEGpJu5i5M7P0wa/jfYShNNZozEEFjPAQc1L63YJg+IwZueHQ0fENZgHCnOBwi7XFZs2CB3igAo0NNifbX2Ef5LfQ0fETIsS36otz7oXCQJoyAYgaHmcOMy1ms/5k6Oj4GxGrbA3Ns1GzpwIykS0A4YkZGaIR37IX9oOOjkZg7tKjrXbHjKay3P1yXidPACJTE8zhYTuZ2tMbOjoag6lDRfW2hjGoPVDG+xo5XqAgszlsoT74dbQKjU02QX/LbnJnHXB7gcyW9DcEQbgWOjoahglBH+YdsjDv0BKe47kEIMyS8XuDIPwVOjoBAJuoxwWbJRfpDrfHujsgPCl9uihgKXtTVYJmOjq+QBTRIjgcV9lKc5e5Os6lAIQkZgwOMmAHOyoKOjqBhohqe6s43lVatctZ3WjAh/rg1wlYBEQHBQn/cXWIUwEwJ2Vcowe6dLoAF4Qnps1w9qQzAWA2r/h36Oh0BQzCc3Ay1jt90JyUfhczpUdCR6crIAijpDHd2VPnPJIwJDLcGFrAXpQEHZ2ugihabVZbX6Cgqf3D56wA5qCwh/TBr9PlEARLuCV83jkPn3UveXRiuCgW6J4fnS4Jc4va4EiFNbek7aGzVgCz6Pi7Pvh1uizMLRoOw6NnP3SGscHhltYyXQC8gynUjOBgE4JCQhHEroNNIdI1YW9pRktzk3Rtb2pEC7tubqyHjhegVcCafaZgw5msudDk1insSh/8CjEYgxBn6YW4pBTEJfdCfHIK4i29pdvhkZ0XyBBPXzsLx9fVVKKi+AQqSo6j/OciVFhPotxahMqSk3C02qGjALYKhFnSJjZYc7fQ3TMCIDjEGcxfCh0+zGxQ904diZSBI9Bn8EhY+gyE0eg6C1cUTw/206e549kWTz8mnr4RERUrXfqknu2RbmWDv7iwAEUHdqOogF0O7kZDXQ10OBGFa9hfSQDO/Abhyen72N0h0HHK8HEXYGDaeDboh0uzvTvaBrRiRPqt+N6jnK0UhftzcCh/O/bv3AgdV4j7bcU5UgUT6dya4kcNDQ427oXOOaQMGoFRky7BsHHnIyw8kus10kyv4mIqCZIMaapnq8He7T8ib8tqnDi0Bzrn0tLSOqy5PG+fdErDLel/Yb/YP6EjER2fjPTM6Rg58WLEJvaQ9VqPZ30X79uGnPevYPbCbiYIuRtXorq8GDqnEcVHbNacZ6RzabakbxEEYQK6OaTHX3DNHRic1jVPxYHszfjpu49hLTyE7o4oilvrrTkThfDE4cmiIfgkE4BuawEn90vFNDbwB44ch+5AQe42rFv4QbcWBCYAYn2LLUaQUkWNhqXohvQcMIzN+LdjwPAx6I4c2r2DCcKHKD7q9TL82qTVcXkQG/zJ6GaER8dhxpz7MHRMJroztOLRJZ8ZzCs/fR222ip0K9jYN5rCLTOYAXwJugnjLrwKN947H8lM39c5RVKvfsg4fyYa6+tQfOwgug3MDjCaInrcwNwKE9HFSWQ/8k0PPsV+6MsRFBwMj/DQ1SN2uN8W/FJshcn1k3YCpWUMTp+IgSPGseBafrcIrDlEZAnMBfo5O/Oz0YWZcOn1uGT23VANhWPtxOF9OLovB2Unj6K5qQEtjY3S48GhoTCFhElC2m/oaPTsnwp/s+KzN7B99UJ0ZdjP+FEQG/xd1gYICQvHlXP/iCFjpkBVZA5+a9EhLPnoJW5js2f/oZh5++9hSZHZOVbFIMT0m3+H3oNHYckH/5KEtWsiMhsgwvIXdtYS0MWw9BmE2/78AnoNHAZ/snXlAix462nUVpZyv6a2qgzZ65dJGaQpcj6/yo7sxJ59MWLChTi2Pxe2GtXbc/kfUbAxI7jHU+zEhaILMXbalbjut4/BHKFucqvD0Qo59cEWvfsstiz/iun38kvX02sO5+9AZenPzFvFv4KJDgfUDOmEmiOQNvlSJgDVKC7sWgaywCTAaIpM7lIpEDPm3I/zr74NBqPHzW/OUF58HIdY8CiZrSq8rFv4EbLWLIKnlBw/LE3sfYekcx1Pgz930woEM5uCN3fJHZTlmpoxEWFsQjmUtx1dBVFAMFOBkuejC0AD/rp7HpdmK7U4si8by//3Gn5a9BEuu+VeNqj4FsrdW9dg5edvQi1IBSFXZQJTSXiIjEnA24//WvLmRMTGIyZBHTOvF7NN4pN7Y/+ujadztgMbAUJQlxAAcuHd9Pt/YNCo8fAUyrXfs30dFr3zjKS+VJacwLRr56I/Z7S4vLgIn730qCK1xxWUxzN07FSYI6PdHkuCShPCznWLkbdpJXvtJpiYQyAhuQ8Eg2clXkkQe7EI+r6s9ZJKGOgEvACQp+fWPz7HPBaelzE6cWivNHh3/fTDmahoeFQsrrnrES6VqtXegv+98DBs1bI79biFdPuig3kYPXUm1yAmdW3nj9/D3tzEPk8l9mdtwN4dP0mDNzImHp4Qm9QTA0aMwZ5t66QJI5AJaAGgwXnbwy/I0s07o7HBhlVfvo2ln7x8TgDowuvvRO9BI7jeZ8OST6VB5i1sNVXSXmIeYSe9nbZpkiHdBn03Eu56Jtzk4vQkIBgZm4BBzC4gwWppbkSgErAlz2nmn/PQs5KrzhP27dyAtx67E1lrF5/zXGRsIsacP5PrfWoqSrDph8/hbdYv+R9zk5ZzHTvuwisRER13zuP0Xd9+4tc4mLsVnmDp1R+3sNWXgniBSkCuAMagYNz6p+c9mvmpAsN37z2HH5m3psVJoOfiG34tqQw8LHznWZT/XAhv42htRVVZMYafN83tsQaDEUFsxTiUt+2c56jqRP7Wtahj6hrZN0q9ZuFRMeiTOkoy/ElNCzQCbgUgP/wv7n+SRUuVb1+uLi/B+0/dh/xta50eQ6pG2pTp4OHkkX0oOFVkwCfQnl+yV3jIyLxM+i7O2MXshA//8aB0TpRCKtmN981HIPZQCbhPfPWvH2YG2FgopYDNhu/MvwulJ466PG7ExIvP1O1xx6ov34GvoZWLB/oOwydc5PIYStWgc3Jkz04oZeDI83Dlr/6EQCOgBODyWx+QQvNKyd6wDF+8/BiaGtwXncqYOgM8HN2fI3lnfM2RvTtlrQLuoHPy6Yt/kYxkpYyadDEuYmpjIBEwApCeOQNjps2CUratXIDvP3yR61gqeUJBHx7WfPUu/MW6bz/gOo7KuFAAi4cfPv43dngQwZ404xfMPrkAgUJACEBCjz7SDi6lrF/8X6z84i3u40dfwCdoPx89wC6yGpOrylEWqS4+VsB1LM8q0MbyT1+XgoBKmXXHQ1KsIBDQvACQF+PG+//GrY93ZMXnb+KnRR9zH0/ekLRJfBvkcjYuh7/J2bCM67hRZNAL/Elyq796B2sX8K0wHaFINO26I2+d1tG8AFA+f1yS+ypsnUEJadtXfSvrNYMzJnGlG5Ablert+BsqftVqdx+NpfqkqenyWr5t+uEz/PTdJ1ACbe4hm03raFoASO9Xqk/uXLcEG1nQSC4ZU/iMXwqg8RjT3qaJRbHps/BAxb7ksp4JAO1NUEI6U7u0bg9oVgAo1E4ZmEqgRK2l/30FcqGoKW9toNwNK6AVeFUxKvhljnC/unXk+49fUpziMfP2eVLKilbRrADQljxXARxnHGNuyQVvPw0lpLEZiyfRjFIRyA2pFY7kZ3GlR9B3S5NhDJ9BFPHtf/6Bo3uzIZeQUDMuZb+lVtGkAFCgS0nNnoqSE/jilccVh+SHjub7n574yr1FDqeaMlTh/mg6p1+99n9SGoZcRjA1iHdDj6/RnACQt+eK2/8AuZBR+uUrT6ClSVlmInkueGoFiWw2pPQBrZG9kU8AevYbojh5jTbHf/XafOlcy+WKO/6gSa+Q5gQgc9YcRMUlQi7ff/SitBlFKX2HZHCpP6T61Hkh399Tqsus0s4xd9B37DVoOJRCWzSXsTiBXKjK9pSZN0FraEoA4iwpUiRRLtnrlzKX5Bp4Qp8ho7iOO7BrE7QKb2OMfh6qIznsfOduWgm5TJ55s2rbM9VCUwJw0fV3yk7LtRaxGel/r8FTeAcFzyzrL8gBwEOfIWnwFEqZKD15TNZrjEFBuFBjuUKaEQAKnaeOlheooT2pC956StqK6Amn9H/3ewsabDUok/mj+xJST+o5ShqSHeCpPk7nfCHzDIkyN8cPY86N6HgLtIJmBCDzijmy69nsWPMdKqzH4SnkoeDT/+W7AX1N0QH3mam0yqqxCpQcPyIFHOVA5zlz1i3QCpoQAApAjZx4kazX1NdW48dvP4Qa8A6GQk4Vw5/wqmj9VHJLrl3wvlRVWg5pk6d3ulXTH2hCACZfcbNs3X/V1++oVrOyK+j/bfjSDiAoFWO1zJRw+q0nXHYjtIDfBYCqjfFuPG+DjK+8jeqkInQV/b8NX9oBbWRvWMpU0ROyXjN22iyp7KK/8bsApE+5TPYPsXHJp1CLrqT/t+FLO0CCGcLrZSYeSnuuJ8tPzlMbvwvAiAnydH9Kd8jfvg5qYeGsLBEI+n8bvKqap/WU2pO/dQ2qy62yXuPJ9la18KsAUFBEbquiDd9/pmpdyjjOnUuBoP+3wWsHyO2B7ArKFdqw5DNZr6HKHrGJ/t055lcBIPVHDlS6Y/fmVVCTmAT3g4ByXwJB/2+D7ACqH+SOGJW3LeZsXMZdtKuNETK9f2rjVwHgrbvTBm3WVrv4UmySewGgGv2BRmWp+6zNuAT1VgCCfpsda7+T9RqqJOFP/CYA1AZITtIbRRzV3oJIxjdPoViqEB1o8HzmqPgkj6tFd4SqUcuJDtN2V4sfO3b6TQAGpckrZX5k7y7VszB59xpXlATgClDm/jNT5F3t6g21lWUoPCCvTtKgNP81KfWbAPRJleeC88YGdF4duKr0JAKNSivfZ/aGEZon87fqk+p5aXul+EUApJz0AXyFpwgyQvd5oex4HKcXpKIkAAWg1hD4KAAAEABJREFUlFcA1LUDiD3b1nJVqmijz+BRqqtivPjlv1LFZTl1fqhmZUtzE9SGdwWoDEQB4PzMMV5YAWhXHhXt4oXGQo++/umN7BcBkKv+eMsHzzP7Uco17bYKNChgyGOMxiWpvwIQcgSA8Jca5B8BkNnOSO7J5IVHACi6qXa/L19ALsmaCve9iWMSvSMAhTInLepY4w/8IgCWvvwh+Ga2nFoL+epfyiUm0f32vEpr4HmA2qjgsAO8tUXx5NH9aG7kz9ZN7jsY/sDnAkDZlxEyCiUdZe5PbxAWES11UHFHZQB6gNqo4rADKCmN2k2pDlO/ig7u5j48KjbBL1UjfC4AvGW62yj0kv7P2/O3rqYSgQp1h+Qh2MR3LuRyVGYCYXxyCnyNzwVAbqHbYi+pPyZOAVBaZ0gLNHN2b+SdDOQiV3WNtSgrguwJQfAxcr+kt/JweGc9tXad+QNe4fWWAMitIqe0Crgn+F4FkhF6JxcktR/1BsEhfHVHA3oF4DRCldRg5YEEQFZekKUbCICcFaDC6j0DtFusAJwqkMlLKwC5YuVskukWK4CcagBVXkxD7hY2AK8KZPJeo2s5Kmx4lO8rRfjcBpDjcair8V4NzqAQ3hUgcAWAfwXwjgpE2GR40Uyh3lmJXOFzAehs5iU1sbOaWFQmfc6fnoc34NkHQEy/+Z6AFQJTKN/MPuXKOUg//3J4g3gLv2vTW8a4K3y/AnTyJZ0VhIuKTZQu/oTKh3R1ElhsJkFmfMZTyDTu+LObTL4XAJ/aAErr0ut0D6hUi1FhN1Cl+HQFCA7VBSCQoGS6mspSNNrq0NRYj+aGeumabItgNlBNoWb2m5oRGsYu5khExMR5vL+AVOQGBQ04lOJTATD5QcfT4eNwfpZ0OV6wR3Jd1lXLq+7QHnNkjLTfmOoODRwxDv2Gj2ZCwpdvFMy0hAaOynZq4VMBEFWs56PjGQ22Wuzd/iMO5GyR9lvYm9Uz9Otrq6RL8dEDyD7dT6136iipS+XICRcjMta5A8Igs0K4p/hUAALZp94VoF11B7I3I3/rWhzavR2OVv5ti55C5RrpsubrdyVhGDH+QqmHcFh45FnH+XqM6ALQDWist2H7qgXYtupb2aXMvUGbMKz8/E1kZM7AlFm3nHFL+zry7lsBaFF/X6+OcxqY8bp1xddSQTEqY641qMtM1rrF2LV+qVQkLXPmzV7Z++0K39oADof0BTsmXzkLhFUzL4S3NqTQjMMTpJF2NgXYykVlEfdlrZcaB7YEQC4TqWJkK+RsXHHGThR8ZAv4PBBGalBHAXD2XQ/lbcPST16GNxg56RJcfeef3R634tM3ceLwHgQKpwaQAB/bkqogMkGggU/fwFeC4BcBQGQ017ER0fxbJ2V/Dt7NIibv5cmoiTRc2KBRa8DEmAUkxRiRFG1gFyMssUYkRhqQyB5LjDKg0uZAabUDJVWtsNaw2+yabpdUt6Ks1jNvn/QNSBDY9xFV/E6d4XMBqKutRHQCX5fAWC+mx/LqmkEBIgBtg0YpNOCnjQzFxemhuCg9BHER8lpWtae+ScT6/EasymWXnEYUVyqrquELNcjnAkA5/r3681WF8+YeUV6PlNaDd56oCkN7BUkD/hJ2OW+QCUajOgPOHCLgsjFh0oXIL2yRBIEuWYea2GeW/3+8pdr5XACqZFRapqoN0QnJqJa5tY4HXgHQ+gqgZOBPHWbC47OjMaqfb/JuRvQJli4PXhmJY6V2PL+gBgu21MsSBG+tBj7fECO3zmZcknc6iHSVFUAOaf2CsfDRBHz5cKLPBn9H+iYG4bW747D2KQsuG+3/c6t5AbD09k7teN6KCYFiA7iCVJ3374/D8vlJmJCqje8zpFcwPnwwHsv+LxHjB/tHGAmfC4DcZhN9Ur1TMs/OaQSHR3nPEyUXUYSs/mg94wx49TexWPu0BZeP1WYmbnp/Exb9NRGfPRQvqUm8tHmIPMXnAkCZfnKikqq18uzkc/D00fJW8VglSGowpy58+dhQbHw2GTdMMSMQmDYqFKueTGJ2Al/vYLIJ1LAL/FIb9OTRA9zHhoSakdSrP7wBjzoW4+cuhkr43eXhTOWJR2hw4EXD/nJ9NF5hq1aQci+sLPwiAHLLnff2UulsnqoTsYnaWQHcYWDjnQbP47NjEMjcyFatrx9OQGSY9wXYLwIgt+m0t0pnV3DYIxQJjojm20DvDXj1XPK9f/nnBGnwdAXIWF/KDORecd5dCvwiAMcP7ZHaHvFC1SFov6ja8NYdirX4Rw06lSTofha0xBgkb8qUYYHvsWrPwORgLJufKLlveVBiE/tFACgrtKggn/t42jQxOF39ToK8LtnYBP+oQTw2XigbG1+xmX9wT9+XFvcFCVFGfPGnBPROcD8BKrGJ/dYlUq4dMHKi+g2VuRvJJfl+BeBVff5zb1yXHfxtxIQb8Nkf4yU1T238JgAHszfLOn5w2kSEmvlcZLxQIzmegRbjB1coj+rz6A2RuDSje1TaIHXo3fvi+GZ5GbqQ3wSg5PhhlJ44yn28MSgIw867AGoiFW/lqD4dp0FX6Ezm579/VhS6ExeyWMHjv+D4zjJ0Ib8JALF761pZx4+76GqoTSVXLMB3KwDPikRG4Ru/9X0hWS1wz+WRuH6Sequez7NB25O3eRUuvG4u9/FJvfohNWMKDmRvhFqQAPQfNtrlMeaIKKmqdV2194r1tuFO9ekRa8CnD8UjRIUg16GfW/DFhnps3t+Mkio7ymocECFIm2B6xhsxlXmVKFXaX4lzznjpzlgUlrZie4FrT2Jn5Rc74tcVoLayFEUH+b1BROasm6EmvA2l+zNXrLfhUV3/NTcG8ZGeu4TX5DYg85ESvPp9HXawgVRY5kA9G08NzSKOscG1eV8znvu2FtPnl+LSJ6xYnaOdvcXBQQLe+l2c+2gxxwn1qwAQu7eulnV8j36p6D98DNTCWniI67i+qd7JSWqPO9V13CATLkpTZ/mn93lhLt/W1N2Fdtz6UgVuebFMWim0QE8WIPvlha6rzfE4EvwvAJtXS/Um5TDlilugFoUH87iS4ryVlNcGj+7/9K18A5aXWy6IYOoEf9rE2twmXPDXEqzYpY3V4I/XRCHM5HqQuzuvfhcAKoS0Y/UiWa/pywbjwJHnQQ2oNs3xQ3vdHkc5QXK628jF3WxFm0fSvKCL3zQ1HG/ew5/yXWUTMfeVCqYS+b9UTGyEAb+d4dkq4HcBILatXCANRDnM/OWDCFKplPax/dlcx/VTUfVqj7tZin7Dx2d7z+V5zQQzXrubXwgc7OP+5vUKFJX5Xx2674pIFihTvgoYTRHJ8+FnqEKDOSoOvfrzN6Og7ua0W+tIfhY8hWaJtMmXuj2uqb5Oqq2pOpTb7uLpGzPNmHO+F7q5t2N472DpsmR7A3jCSHamNR4qtjOXpH+T78ggJmP4x93ONzi5WgU0sQIQm77/lEsXb8/4S65BInONegrlJfHZAd7JSnVnqv3qImWDrOBkC7bs5y81OHNsGN6SoQ6tYTZBVoH/y12SMRzsxiPkbBXQjACQj51K+cmBqkZce9ejLErsWS4MqV88yXmxLCKsth3gTv0hn3zGAGVZnp8zH/+cF8qwVYYQXDnejHfu5ReCt5f7v+aoOcSAzBFuzpGTVUAzAkCsW/ihrDRpglaAy265F55yjHOPQv/ho6Eqboy0K8Yqr5zw3bYGybd/8wvl2LSPXwhmnWfGhw/wCfpipjJRISx/MyPD9XlydpY1JQAUGNuw5FPIZfT5M6Va855QyJmdOmR0JtTEnfrTVlxKLlbmry8qO6XWUXDrFrYSbNjL77mRk1osZ4XxFlec5/48dbbaakoAiM3LvpDVXLmNWXc85FHaMsUDeFaf1IxJMEeo4493N29GhArIHK5M/aFqbO1pYndve6kc6/e4FwKq4Hb7y/xpH4dL/O8Nouj4mAHyVWHNCQAZoz989BLkQu1Xb7x3PgxGZelNlBl6/LD7eIBgMEi17FXBjQRMZ8u60aAs56fSdu6bNzL5/sVz5fgp37kQUMoDCYociivkOS+8hZLSL5oTAOLovmzs2fET5EL2wLV3PaK4SOyBnXxJdmOnXQlVcPMxlao/hCun1i//XY4fOxECyg+ilIdAZYaCSnOaFABi5WdvKGqpNHTsVEkdUkLuppXMI+R+OY9JTEbvwSpUqnCxApBb79IM5QZwQpRz6SJ16Kbny6UB38ba3EbMeVHZ4I80a6P8yqCewS63TnYWD9CsAJBbdOl/X4ES0pmKculN90AuVLDrwK5NXMdmTL0cnuNcAgYmB7nNc3FFf4t7VZAGPAkBrQZzX1XeFnWAxa9Z9WdBVa5d0sEQ1qwAELRfYNfpNptyGX/JtZh0+WzIJWfTCq7jyOvkafMMVxHKhCjPfpr+lmAphuAOEoLbmUrUJC8T5SzklDT0NvFRriNiHaccTQsAsfzT12Et4ktZ7shF19+JqVfdJus11D7UVlvl9jjKQ6I2S0pxFwBLUCHnf8YYPhXKk8HfL8koCZtWcKX6SXSYdDQvABSl/eq1+bJTpts4nwnAzF/+nv8FbGDmbFjOdSi1+FSMG0M9Psrzn+bemZHwNsWVrdh+UDvdPxMi3Zy3QFKB2qgut2LRu89CKRQou/53T3AX19r54xKu43r2H4JeA4dDEe5WABUEoE9iEK6b6N2qEY0t5Fot04wQJETJWzkDQgAIKqOydsEHUMrQMZm4ed4/ufT26jIrjnMW7rrgmtuhCDcrgNwf0hmPzY72eqFZLQlBfKS8IR0wAkBs+uEzZK9fBqX0G5qBXz3+OuKTe7s9NmfjSvBAG+oVrwIuUGMFIHrEGvHaXbFeb5uqFSGI76orQBvff/ySRzn5CT364M4n3sCI8Re6PC5/62ruxDxFq4CbKHCkWb2f5uoJZrx8p/crRpMQ3MiEQE7indpQFTmXdJgJNLEhRi77sjaw2Twd0fFJUILRGCQFzKLjLTi8J6vTvQD0GHWT78mxSYe2S548sl9m9xvX/W8vSQuR2gipxYg+JlwwIgTLdjaygeq97M1WB/Dd1nqpUG+veN/HB4qrWvHeShcp2h36DgfcCkA4Wu34/N9/RYmMynKdQQGzu598B32ZMHXGpqWfc2/VnHnbAx7vS2hPaa2y3rquOG9wCFY+mYhrxnvfMJ79fLlfVgJq3u2KjlNOQK4ARCsTgv07N6D/yHGI8KCPF9UbTZs8XbILCg/kndVBvqmhHuHRfKsAbdF0OBzcadXuet6m9Q1G5nD1uyhGMdVq1nlhUt5Mox04WWaXBqwzKLWgpl7+ikFbJhexlWDcYJPkjfIV2Uea8N025yk0Yoftp0J4cob/dzN4AA28W/7wTzZI+Zpvu6Kx3oZ1376PrLWLzzxGO8Due/YTrtmdVosPnn6AL3DnpmzZnAvM+Ndc3zToo22NhWWtKGHqQ23jqeEQwsYsdY6nqnCfr7dh3nvug4OdEWoCPpkXj8A7kwMAAAv5SURBVMxhvmmJ+sHqOjz6SbXzA041XThzN2BXgDZo0O3eslqapT0tY07R3UFpEzBs3PnS7F964hiaWQAuLCIavQYMc/t62qI5YMQ45qn6gWOPsejSFZoca8C1E32z4bxnXBCGpQRj3KAQTB566kIdWiwxpzwqI/uapP6+S3fKT048tRI0SO/XO8H7K8HK7AZs2e/GedGVBIBwOFqRv20t4iwpUv1QTwmPjJHiBiMnXYQW5gnKWb8cGVNncJVhCQ2PgKX3IOnzuMSNXzIqzIBbp3m3EoQcKN9HqRCQYbxwS71PhODbLQ3IO+ZcpxM7qJ5dQgAk2NK2L2u9VMhWDXWIoM40qekTMWryJSg+WsBWGL4q0XGWXpLqVJC7Fa4/snNPkNEo4K7L1O2H4CmBIAT//dGGw8WuVt+zz7nRFJ48jwmF/3vWq8ShvO2oKrdK9UOpp4AamEJCuQd/G1TDlOoduYsoOxOA2gYRd02PUKUKtJpoXQj+9nk1bI3OzdqzzreIaqMp0nIHezgBXYgSZoQeyN6EfkMyYI5Ut56mHAYwISQjnXa4iWJn7jnXniCKA1CxKq1BQjCoRxC+36EtIdhT1Iw3ljqPAXRccZmY7GcqUI8b2O1+6GLU11YjZ+NyRMUkwtJnIPxFysBhSM2YiJ+PFaCu6uxNJ4IbQziMmRxXjNNm29OhKdoTgi831uOnfBcV4qQ/7c63IOYYgyOSp7GHMtAFIU8MrQRqq0TiKVOK+3iyBygjlRr99ew/TLIRyGCnz1Nb5Xwn1vHyVtx3RQRXmW9/oDUheOabGhwvc67/S57ns86lsNEYZLZMZA+qW+xGY5BKlL91DeJ79EGcCh0fBZHN3QIgd1iSUW1J6S8V2U0dPRkZmZdh64oFUlCvM5rt1BcrRHJTahWtCEF9kwMPf1TtttTMWSqQQ1zOVoAeI9ljHuzsCAxovy/FCyhIlTJwOIsAe+BiVDD4O7z81EUwoLBgt8suNcmxRs03wNaCECzf1eAyAkx0XEnZOv4NE4CkfuyJG9BNKC8uws6ffmBuRiN69hvCglf+TYeigNuhvG1On69vFjUVD3AGCUHfBKNi75CnaRNvLqvD7kIX/v9OXM4iHB8ZRMFQjG6GvbkRa75+F288eoe06Z6nFIq3GDF+mrQSOCPnSAvKa7RReModN2aG49XfKEvfoH3Jc19WXpNoxS43gteJHUVj32g3RVQEG4MfYkadl/cNaQ9Siw7mbJG8RRTlTWL6Oe+2SbWgHWpFh/JR5aIcZFiIIKUnBALDPXCRUhG8B2ZFyjb6v99Rjy82uG7b1PEdmSOjucHeOM+Ihoom5gql8gb90E2hfJ8CpoZkb1gmCUBSygBpz4CvoOXZVT2i7MMtUnIclQEPBJSqQ4/cEIXxqfIEvcUuStXsKHDoDCcR91UtJfnvS9OdKdySzI5QXuOji9DS1IDDu3dgx5rvJNdpqDlS1qYb8XSGp1wDmRpxb1n+ldNSKZRQVlnnwIwx3s3jVxPagCNnJfjN9HD8+Tr5Qcv3V9mkMvDuOEf/F4XX7bbiLZIACKFJZUaj4T7oSFCGafGxg5JqlLNxBRpstYiMSZDyjFwhKPQOBQUFo7qiFNbCAqfH5Be1sKBYmGqb5X0Br3eIBv+Tt8jfslnb4MDcV9wX9epMpbLbW+e1NpSUSWeTbpgiLDd3tZQINSA7oehAHlsVFmHPtnUo/7kIDocd4Sy4pVaTPsLSewC2s//hqlzKwZMtmJ2pfY9Qe9wJgdLBTzzzTTU27nXTLb5T9Ufc31iaO59unZlOgszJKV09IOYpDXU1OHl0vyQIW5Z9hUNMXaquKJFcqRHR8W5dqtJeDLrRyTJBO9Mqy4qloJ0zqOEF1cDXUiU2HpwJgSeD/3iZHfe+XSl1rHRFZ7O/w4H37DbrKun5tgdDkzOmMWlwk8Su4wzqSyClOCSlIC65F+KTUxBv6S3dpv0FndH227X9CBXWE3jzsV+5XAV6xRmx8skkqUduoLGQ+frvebNSuv2HqyPxp2uVtX5tZaN+1t9LkX3Ete4jOkm1coiOSQ3W3C10u93TY4PDLa2l7BH/pU92YUyhZgQzlSkoJFRSncj92aZCUfkVSp2ma1tVBdNPXS/rE1JN+OYvCYqbZwQ6j3xchQ/XKGzOJ6LGZs0+M8bb+fqymDilL2MyIb+kso5byNVKF9TCY7YeaMb8z6rx9zner/WjNb7cYFM++CXEpe3vnbWO2iA+wAIE8iMYOqrirnI08e5KGxZsVlYwOFDJO9aMhz5wvznf6fmj2V8w3N/+obMVSWtuiejAy9DxK7yR0HnvVSL3qLy2soEKpYPc+mK5FBNxh7PzJwp4CcW7Sts/do4l1WC3/YOJkBU6mofSpanfFwXJujJk9N76UjlKqj34nqJYUm9veKHjw+e6EioKahwQnoGO3+FRhaxVDtz+chnqGruuEMx7v8qtx4dwdb7YmP4nyvafY4E5WWsHhZgt4XvZUtIfOv5FFLm6XpKf/dOH4n1Se8dXUKT3zlcrsH6PZyUW2Rk8Wl9cNxQoOOeNnMTVK1pNkT2ovNY10PEvnPZABVODvtxQL7lI/VGUVm2KWKDrqqdLmY3jQf+m07AzOK+lbk+Wk+ecYgi3pGezH2AUdAIGI1Nq/zU3BjdNDayUifZs3tck5fhUK6hJeg6iuNtmzaHqx53qiK4yq0RTeM9NzHK+nUlJYMXeuzGkMS3f1YjaeodUDl2rG+qdQXVIf/1ahcuCvbyI5NOB4/JWW4lTp47L1MIWW7E1KCxpv2AQfgEdv9Nm5PEM6qxDLcgqaMb00SEICQ6MtIlHP67EMwtqwTPvuzsX7HkHO+TmppLcH129j9vcWnu9dU9wRDL9m2nQ8Sv0Y8uZ0Y+Vtkp2QYhJwIjewVK5Ra1BA3nx9kbc9XoFVufyG7vuzgV75tH6kpx34O59wEl4csaX7OpG6AQkveKNmHdVBGZnmhFk1MaKsHxnA55fWIv8QhX0nXaIEL+pL87hKvQgY0roF2q2xGxmQtcli2h1F/olGvHQNVG4blIYDH5KpluX14hnF9Rw+fblwhaUzfXWqouY55MrpUfWGQiLS0sRTMImtvi4b7Oo4xPE0/sw5dq6iVEGZh+E4jJ2OX84sxNM3lsVHCySu+VAM1bsapAM9KMl8qtc8Ng/bOY/Xm9rykDtvnJwInsKCE8anS4axM3shYGzQVXHJWHMRjifeYxIGKZnhMpuNdoZtiYH1uQ0YkV2I1ax6yqblxsRiahpQWtmszUvT87LlK2BUcPjzGGmxUwYJ0NHE4inI8ZqKDVxkQapN5gl2ohecQb0ZIG1HnFGpLBLD2ZL9GHR5p8rWvFzpR3Hyx04WWGX8nQKS+3S41TT1KO8ndOcmvRF94a/iFW2hubZqNkju7CQB+drbLA52f4KO+W/hY5mkPbA0o0A8/+359S453P5MrXnLWbw3gsngS53eHyWzEnpd7NP+Tr7nN2usJZWabMLuGZPjcFr01BhKzbkH2CuzrfhAaqcnVBL2sVGwfAFuxkPHc0gZyb1J+2zODk/Z7nD0XplQ0neZniIamcltMfovkbRQVsq1WnQpaMaCgaYT1DyudjMv8shGK5t/HnXMaiAamqLva64uqUu+H1ThLmGfcxx7CvpXiKN0HnUVPCLmdAxZ58/ui1SOYm/1ReX322vO1AGlfDOKYgeFRsWavgz+2IP6u5SbXJmINLgE71vK7R5qeT+L0poEx3iKw1NjmdRnVcJlfHqtzYnjO4Jo+MJ9m/uZN+56+zU6IJ0NjN79F7SYJfuKXo/9hZ29vd9tBr+Vl+26yS8hE8WwZCE9NSgIDzGZP8GfUUIHJxtMRSk9n7iaT9Th+c8XEloxmfv/rXdjqeaynIOwMv4WAtMCTNb4i9m//YqdmcWO1fymu/qdEmYnFFzhCXMlb+43lqxCjjuvtyzSvjTJSCEJY2aKAjGK5nEX8WmjhHQ6TawQZ8NQVzMhsHi+uLsHQDXNgDV0Y5PrOdYs6mpuY+BRdyNBmMKW35T2KOnL0IKWy3oth5nCAzK2QA/zsY0u0C6MNXoeKuj9bijFcebQ0yFOJmliape/w8AAP//KZGQ6gAAAAZJREFUAwARCPXORcPwYwAAAABJRU5ErkJggg==", "512": "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"};
const PANEL_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#0B1830"/><circle cx="20" cy="20" r="13" fill="none" stroke="#86B4EA" stroke-width="2.4"/><ellipse cx="20" cy="20" rx="6" ry="13" fill="none" stroke="#86B4EA" stroke-width="2"/><path d="M7 20h26" stroke="#86B4EA" stroke-width="2"/><circle cx="29.5" cy="29.5" r="9" fill="#F2B84B" stroke="#0B1830" stroke-width="1.6"/><g transform="translate(24.3 24.3) scale(.43)" fill="#0B1830"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></g></svg>';
const PANEL_PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pannello RG</title><link rel="icon" href="/ig/panel.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/ig/panel-180.png"><link rel="manifest" href="/ig/panel.webmanifest"><meta name="apple-mobile-web-app-title" content="Pannello RG"><meta name="theme-color" content="#0B1830"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Serif:wght@600&display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark}*{box-sizing:border-box}.dlg{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px}.dlb{background:#16212B;border:1px solid #2A3946;color:#E4EAEF;max-width:440px;width:100%;border-radius:12px;padding:18px 18px 12px;box-shadow:0 12px 40px rgba(0,0,0,.5)}.dlb p{margin:0 0 14px;white-space:pre-line;line-height:1.45}.dli{width:100%;margin:0 0 14px;padding:8px 10px;border-radius:8px;border:1px solid #2A3946;background:#0E151B;color:inherit;font:inherit}.dla{display:flex;gap:8px;justify-content:flex-end}.dla button{padding:8px 16px;border-radius:8px;border:1px solid #2A3946;background:transparent;color:inherit;font:inherit;cursor:pointer}.dla .dly{background:#3B82F6;border-color:#3B82F6;color:#fff;font-weight:600}.dlo{margin-top:10px;font-size:12px;color:#8A9AA8}.dlo summary{cursor:pointer}

body{margin:0;background:#0E151B;color:#E4EAEF;font:16px/1.45 system-ui,sans-serif}
main{max-width:720px;margin:0 auto;padding:16px}
h1{font:600 22px Georgia,serif;margin:6px 0 2px}.sub{color:#8FA0AE;font-size:14px}
.card{background:#16212A;border:1px solid #27353F;border-radius:14px;padding:14px;margin:14px 0}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
button{font:600 15px system-ui;border:0;border-radius:10px;padding:10px 14px;background:#86B4EA;color:#0E151B}
button.g{background:#27353F;color:#E4EAEF}button.r{background:#6B2B2B;color:#fff}button:disabled{opacity:.5}
select,input[type=time],textarea{background:#0E151B;color:#E4EAEF;border:1px solid #34475A;border-radius:8px;padding:8px;font:15px system-ui}
textarea{width:100%}
.strip{display:flex;gap:8px;overflow-x:auto;padding:6px 0}.strip img{height:170px;border-radius:8px;border:1px solid #34475A;cursor:zoom-in}
#lb{position:fixed;inset:0;background:rgba(5,9,12,.94);display:none;align-items:center;justify-content:center;z-index:9;touch-action:pan-y}#lb.on{display:flex}#lb img{max-width:94vw;max-height:88vh;border-radius:6px}#lb .n{position:fixed;bottom:14px;left:0;right:0;text-align:center;color:#9AA8B3;font:14px system-ui}#lb .a{position:fixed;top:50%;font:700 40px system-ui;color:#fff;background:#0008;border:0;border-radius:99px;width:54px;height:54px;padding:0;transform:translateY(-50%)}#lb .p{left:10px}#lb .f{right:10px}#lb .x{position:fixed;top:12px;right:14px;font:700 28px system-ui;color:#fff;background:#0008;border:0;border-radius:99px;width:46px;height:46px;padding:0}
.ed-list{display:flex;gap:10px;overflow-x:auto;padding:6px 0}.ed-list .it{flex:0 0 auto;width:128px}.ed-list img{width:128px;height:160px;object-fit:cover;border-radius:8px;border:1px solid #34475A;cursor:zoom-in;display:block}.ed-list .row{gap:4px;margin-top:4px;justify-content:space-between}.ed-list button{padding:6px 10px}.btn{display:inline-block;font:600 15px system-ui;border-radius:10px;padding:10px 14px;background:#27353F;color:#E4EAEF;cursor:pointer}
.chip{font:600 12px ui-monospace,monospace;padding:3px 9px;border-radius:99px;background:#27353F;text-transform:uppercase;letter-spacing:.05em}
.chip.bozza{background:#F2B84B;color:#0E151B}.chip.pubblicata{background:#3C8D5A}.chip.errore{background:#B04040}
.err{color:#FF9A9A;font-size:14px;white-space:pre-wrap}a{color:#86B4EA}
.tabs{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 0}.tab{flex:1 1 auto;padding:10px 10px;background:#27353F;color:#E4EAEF}.tab.on{background:#86B4EA;color:#0E151B}[hidden]{display:none!important}
.chip.in_elaborazione,.chip.in_coda{background:#86B4EA;color:#0E151B}.chip.in_lavorazione{background:#F2B84B;color:#0E151B}.chip.pronta{background:#3C8D5A}.chip.annullata,.chip.scartata{background:#4A5560}.chip.bloccata{background:#B04040}
.day{border-top:1px solid #27353F;padding:10px 0}.day:first-child{border-top:0}.day.oggi{background:#1B2A36;margin:0 -8px;padding:10px 8px;border-radius:10px}
.day .t{font-weight:600}.day .s{font-size:14px;margin-top:4px}.ok{color:#7BD39A}.warn{color:#F2B84B}.mut{color:#8FA0AE}
.rq .sub{margin-top:2px}.rq-s{font:600 11px ui-monospace,monospace;letter-spacing:.1em;color:#8FA0AE;text-transform:uppercase;margin:16px 0 2px}.rq-g{font:600 11px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;margin:10px 0 0}.rq-reel{color:#E8B050}.rq-car{color:#86B4EA}
.rq-f{display:grid;grid-template-columns:22px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid #1F2C36;cursor:pointer}.rq-o{width:16px;height:16px;border-radius:50%;border:2px solid #4A5B6A;margin-top:3px}.rq-f.on .rq-o{border-color:#E8B050;background:radial-gradient(#E8B050 45%,transparent 50%)}.rq-f b{font-size:15px}.rq-f.on b{color:#E8B050}.rq-d{display:block;font-size:13px;color:#8FA0AE;line-height:1.35}.rq-new{font:600 10px ui-monospace,monospace;color:#E8B050;margin-left:6px;letter-spacing:.06em}
.rq-more{font-size:13px;color:#86B4EA;padding:8px 0 0;cursor:pointer}.rq-t{display:grid;grid-template-columns:8px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #1F2C36;font-size:14.5px;cursor:pointer}.rq-t i{width:8px;height:8px;border-radius:50%}.rq-t span:nth-child(2){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rq-t .w{font-size:12px;color:#8FA0AE;white-space:nowrap}.rq-t.on{color:#86B4EA;font-weight:600}
.rq-in{width:100%;background:transparent!important;border:0!important;border-bottom:1px solid #34475A!important;border-radius:0!important;padding:8px 0!important;margin-top:4px;outline:none}.rq-fz{display:flex;gap:8px;align-items:center;font-size:13px;color:#8FA0AE;margin-top:12px}.rq-sum{font-size:14px;color:#C5D0D8;padding:12px 0;border-top:1px solid #34475A;margin-top:12px}.rq-fin{margin-top:6px}.rq-fin select{max-width:100%}
#svb{border-color:#27353F;padding:0}#svb.pend{border-color:#F2B84B;box-shadow:0 0 0 1px #F2B84B inset}.svh{display:flex;align-items:center;gap:10px;list-style:none;cursor:pointer;padding:12px 14px}.svh::-webkit-details-marker{display:none}#svb[open]>summary .chev{transform:rotate(180deg)}.svbd{padding:0 14px 12px}#svb.pend>summary .lab{color:#F2B84B}.svn{font:600 11px ui-monospace,monospace;background:#F2B84B;color:#0E151B;border-radius:99px;padding:2px 9px}.sv{border-top:1px solid #27353F;padding:12px 0 6px;margin-top:10px}.sv:first-child{border-top:0}.sv .m{font-size:13px;color:#8FA0AE}.sv .m b{color:#F2B84B;font:600 11px ui-monospace,monospace;letter-spacing:.06em;margin-right:6px}.sv .t{font:600 17px Georgia,serif;margin:6px 0 4px}.sv textarea{margin-top:6px}.sv .svcn{font-size:12px;color:#8FA0AE;text-align:right}.sv .ok{color:#7BD39A}.sv.off{opacity:.6}.svg{border-top:1px solid #27353F;margin-top:12px;padding-top:8px;font-size:14px}.svg div{padding:3px 0}
.frm{display:grid;gap:8px;margin-top:8px}.frm label{font-size:13px;color:#8FA0AE;display:grid;gap:3px}.frm input[type=text],.frm input[type=time],.frm select,.frm textarea{width:100%}
input[type=text]{background:#0E151B;color:#E4EAEF;border:1px solid #34475A;border-radius:8px;padding:8px;font:15px system-ui}
#st h3{margin:0 0 4px;font-size:16px}#st .note{font-size:13px;color:#8FA0AE;margin:0 0 10px}
#st .seg{display:inline-flex;background:#0E151B;border:1px solid #34475A;border-radius:10px;padding:3px}#st .seg button{padding:6px 12px;font-size:14px;background:none;color:#C5D0D8}#st .seg button.on{background:#27353F;color:#E4EAEF}
#st .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}#st .kpi{background:#0E151B;border:1px solid #27353F;border-radius:12px;padding:10px 12px}
#st .kpi .l{font-size:12.5px;color:#8FA0AE}#st .kpi .v{font:600 26px/1.15 system-ui;margin-top:2px;font-variant-numeric:tabular-nums}#st .kpi .d{font-size:12.5px;color:#8FA0AE;margin-top:2px}#st .up{color:#7BD39A}#st .dw{color:#FF9A9A}
#st .chart{margin-top:22px;display:grid;gap:8px;align-items:end;height:170px;border-bottom:1px solid #34475A}#st .chart.many{gap:2px}
#st .col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}#st .bar{width:62%;max-width:44px;background:#86B4EA;border-radius:4px 4px 0 0}#st .many .bar{width:100%}#st .bar.pb{background:#F2B84B}#st .col:hover .bar{opacity:.8}
#st .bv{font-size:12px;color:#C5D0D8;margin-bottom:3px;font-variant-numeric:tabular-nums}#st .xl{display:grid;gap:8px;margin-top:6px;text-align:center;font-size:12px;color:#8FA0AE}#st .chart.many+.xl{gap:2px;font-size:10.5px}
#st .post{display:inline-block;margin-top:3px;font:600 10.5px ui-monospace,monospace;color:#F2B84B;border:1px solid #5A4A22;border-radius:6px;padding:0 4px}
#st .hb{display:grid;grid-template-columns:150px 1fr 70px;gap:10px;align-items:center;font-size:14px;padding:5px 0}#st .hb .tr{height:10px;background:#0E151B;border-radius:5px;overflow:hidden}#st .hb .fl{height:100%;background:#86B4EA;border-radius:5px}
#st .hb>span:first-child{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.25;overflow-wrap:anywhere}#st .hb .n{text-align:right;color:#C5D0D8;font-variant-numeric:tabular-nums}#st .hb .n small{color:#8FA0AE}#st .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}#st{overflow-x:hidden}#st .card{min-width:0}#st .xl>div{min-width:0;overflow:hidden}#st .more{margin-top:6px}#st .more summary{cursor:pointer;color:#8FA0AE;font-size:13.5px;padding:6px 0}@media (max-width:560px){#st .two{grid-template-columns:1fr}#st .hb{grid-template-columns:128px 1fr 62px;gap:8px}#st .kpi .v{font-size:22px}}
#st .grp{background:#0E151B;border:1px solid #27353F;border-radius:12px;padding:10px 12px}#st .grp b{font-size:13px;color:#8FA0AE;font-weight:600;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em}
#st .li{display:flex;justify-content:space-between;font-size:14px;padding:4px 0;border-top:1px solid #1E2A33}#st .li span:last-child{font-variant-numeric:tabular-nums;color:#C5D0D8}
#st .fun .step{display:flex;justify-content:space-between;font-size:14px}#st .fun .tr{height:12px;background:#27353F;border-radius:6px;margin:4px 0 10px;overflow:hidden}#st .fun .fl{height:100%;background:#86B4EA}
#st ul.ins{margin:6px 0 0;padding-left:18px}#st ul.ins li{margin:6px 0;font-size:15px}
@media(max-width:560px){#st .kpis{grid-template-columns:1fr 1fr}#st .two{grid-template-columns:1fr}#st .hb{grid-template-columns:86px 1fr 62px}#st .chart{gap:4px}#st .xl{gap:4px}}
.sug{display:flex;flex-wrap:wrap;gap:6px;margin:-4px 0 6px}.sug .sub{width:100%}.sug .chip{font-size:14px;padding:6px 10px}.sug .chip.on{outline:2px solid #f5b04c}#wk .props{display:grid;gap:8px;margin-top:10px}#wk .pr{display:flex;gap:10px;align-items:flex-start;border:1px solid #2F4252;border-radius:12px;padding:10px 12px;background:#0E151B;cursor:pointer}
#wk .pr.on{border-color:#F2B84B;background:#211D12}#wk .rd{width:18px;height:18px;border-radius:50%;border:2px solid #5C7183;flex:none;margin-top:2px}#wk .pr.on .rd{border-color:#F2B84B;background:radial-gradient(#F2B84B 45%,transparent 50%)}
#wk .pr .t{font-weight:600}#wk .pr .w{font-size:13px;color:#8FA0AE}#wk .tagr{font:600 11px ui-monospace,monospace;color:#86B4EA;margin-left:6px;letter-spacing:.04em}
#chan{padding:0}#chan>summary,#cnl>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:12px 14px}#chan>summary::-webkit-details-marker,#cnl>summary::-webkit-details-marker{display:none}#cnl{padding:0}#cnlb{padding:0 14px 8px}#cnl[open]>summary .chev{transform:rotate(180deg)}.cpy{border:1px solid #3A4C5C;background:transparent;color:#E6ECF1;border-radius:8px;padding:3px 9px;font:600 12px system-ui;cursor:pointer}.cpy.ok{color:#7BD39A;border-color:#2F5F4B}.cnt{align-items:center}
.lab{font:600 11px ui-monospace,monospace;letter-spacing:.08em;color:#8FA0AE;text-transform:uppercase}.chsum{flex:1;text-align:right;font-size:13px;color:#C5D0D8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chev{color:#8FA0AE;transition:transform .2s}#chan[open]>summary .chev{transform:rotate(180deg)}
.chr{border-top:1px solid #27353F;padding:0 14px}.thr{border-top:1px solid #27353F;margin-top:10px;padding-top:10px}.thrl{display:grid;gap:10px;margin-top:10px}.thp{background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:9px 11px}.thu{font-size:12px;color:#8FA0AE}.thu a{color:#86B4EA}.tht{font-size:13.5px;margin:4px 0 6px;white-space:pre-wrap}.thp textarea{width:100%}.thr .sm{border:1px solid #3A4C5C;background:transparent;color:#E6ECF1;border-radius:8px;padding:6px 10px;font:600 13px system-ui}.thr .sm.p{background:#F2B84B;color:#16120A;border-color:#F2B84B}.chr>summary,.chs{list-style:none;cursor:pointer;display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:10px 0}.chr.chs{padding:10px 14px}.chr>summary::-webkit-details-marker{display:none}
.ic{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font:700 12px system-ui;background:#1E2A33;color:#E4EAEF}.cht{min-width:0}.cht b{font-size:14.5px}.cht .s{font-size:12.5px;color:#8FA0AE;overflow:hidden;text-overflow:ellipsis}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;vertical-align:1px;background:#8FA0AE}.dot.g{background:#7BD39A}.dot.y{background:#F2B84B}.dot.r{background:#E5645A}
.tg{font:600 11px ui-monospace,monospace;border:1px solid #3A4C5C;color:#86B4EA;border-radius:999px;padding:2px 8px;white-space:nowrap}.tg.off{color:#8FA0AE;border-color:#27353F}.tg:empty{display:none}.gear{color:#8FA0AE;font-size:16px}
.set{background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:10px 12px;margin:0 0 12px;display:flex;flex-direction:column;gap:8px;font-size:14px}.set .row{margin:0}
.tabs{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.tab{flex:none;border-radius:999px;padding:8px 14px}
.arc{padding:0}.arc>summary,.arw>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:12px 14px}.arc>summary::-webkit-details-marker,.arw>summary::-webkit-details-marker{display:none}.arc>summary b{flex:1}.arw>summary span:first-child{flex:1;font-weight:600;font-size:14px}.arw{border-top:1px solid #27353F}.arw>summary{padding:10px 14px}.arc[open]>summary .chev,.arw[open]>summary .chev,.orow.on .ohd .chev{transform:rotate(180deg)}.orow{border-top:1px solid #1E2A33}.ohd{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;align-items:center;gap:10px;padding:9px 14px}.oic{width:22px;text-align:center;color:#8FA0AE;flex:none}.otx{flex:1;min-width:0}.otx b{display:block;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.otx .sub{font-size:12px}.obody{padding:0 8px 10px}.obody .card{margin:0}.dc .dh{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.dc .dh b{font-size:16px;display:block;overflow-wrap:anywhere}
.pill{flex:none;font:700 10.5px ui-monospace,monospace;border-radius:6px;padding:3px 7px;letter-spacing:.05em;background:#27353F;color:#C5D0D8}.p-bozza{background:#5A4A22;color:#F2B84B}.p-pubblicata{background:#1F4A2E;color:#7BD39A}.p-errore{background:#4A2222;color:#FF9A9A}.p-in_elaborazione,.p-in_pubblicazione{background:#22364A;color:#86B4EA}
.dc .pri{display:flex;gap:8px;align-items:center;margin-top:10px}.btn.main{flex:1;background:#F2B84B;color:#16120A;font-weight:700}.btn.more{width:46px;padding-left:0;padding-right:0;background:#27353F;color:#E4EAEF}
.menu{margin-top:8px;background:#0E151B;border:1px solid #27353F;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}.menu[hidden]{display:none!important}.mi{background:transparent;color:#E4EAEF;text-align:left;border:0;border-top:1px solid #27353F;border-radius:0;padding:11px 12px;font-weight:500}.mi:first-child{border-top:0}.mi.d{color:#FF9A9A}
.seg{display:flex;background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:3px;gap:3px;margin-top:12px}.seg button{flex:1;background:transparent;color:#8FA0AE;padding:7px 0;border-radius:7px;font-size:13.5px}.seg button.on{background:#27353F;color:#E4EAEF;font-weight:600}
.cp textarea{margin-top:8px;width:100%}.cnt{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#8FA0AE;margin-top:4px}.capd{margin-top:10px}.capd summary{cursor:pointer}
.dist{margin-top:12px;border-top:1px solid #27353F;padding-top:10px;display:flex;flex-direction:column;gap:8px}.dist .lab{margin-bottom:2px}
.dr{display:grid;grid-template-columns:22px 1fr auto;gap:8px;align-items:center;font-size:14px}.dr .ic{width:22px;height:22px;font-size:10.5px;border-radius:6px}.dr .st{font-size:12.5px;color:#8FA0AE}.dr a{font-size:13.5px;text-decoration:none}
.sm{border:1px solid #3A4C5C;background:transparent;color:#E4EAEF;border-radius:8px;padding:6px 10px;font-size:13px;font-weight:600}
.lkr{display:flex;align-items:center;gap:8px;padding:10px 0;border-top:1px solid #27353F}.lkr:first-of-type{margin-top:8px}.lkt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.lkt b{font-size:14px}.lkt span{font-size:13px;color:#8FA0AE;overflow-wrap:anywhere}.lka{font-size:13.5px;text-decoration:none;padding:0 4px}
#st .vtd{display:flex;align-items:flex-end;gap:4px;height:70px;margin-top:12px}#st .vtd div{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;color:#8FA0AE}#st .vtd i{display:block;width:100%;background:#86B4EA;border-radius:3px 3px 1px 1px}#st .vti{display:grid;gap:6px;margin-top:12px;font-size:13px;color:#C9D4DC}#st .vti b{display:block;font:600 11px ui-monospace,monospace;letter-spacing:.06em;color:#8FA0AE;text-transform:uppercase}#st .vtl{margin-top:8px;display:grid;gap:10px}#st .vtk{font:600 11px ui-monospace,monospace;letter-spacing:.08em;color:#8FA0AE;text-transform:uppercase;margin-top:16px}#st .vts2{display:grid;gap:4px;margin-top:6px;font-size:12.5px}#st .vts2 div{display:grid;grid-template-columns:1fr auto auto;gap:10px}#st .vts2 b{font-weight:600;color:#86B4EA}#st .vts2 em{font-style:normal;color:#8FA0AE}#st .vtp{border-top:1px solid #27353F;padding-top:9px;min-width:0}#st .vth{display:flex;gap:8px;align-items:baseline;font-size:13.5px}#st .vth span{font:600 11px ui-monospace,monospace;color:#8FA0AE;flex:none}#st .vth b{flex:1;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#st .vth em{font-style:normal;font-size:12px;color:#8FA0AE;flex:none}#st .vtb{display:flex;height:10px;border-radius:5px;overflow:hidden;margin-top:6px}#st .vtg{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:#8FA0AE;margin-top:5px}#st .vtg i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}
#st .ppl{font:600 11px ui-monospace,monospace;letter-spacing:.08em;color:#8FA0AE;text-transform:uppercase}#st .ppb{font:700 32px/1.1 Georgia,serif;margin-top:6px}#st .ppb small{font:500 14px system-ui;color:#8FA0AE;margin-left:8px}#st .ppw{display:flex;align-items:flex-end;gap:8px;height:116px;margin-top:20px}#st .ppw>div{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#8FA0AE;white-space:nowrap}#st .ppw i{display:block;width:100%;border-radius:6px 6px 2px 2px;background:#3A5A7A}#st .ppw .cur i{background:#F2B84B}#st .ppw b{color:#E6ECF1;font-size:13px}#st .ppt{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}#st .ppt>div{background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:9px 10px}#st .ppt b{display:block;font:700 22px Georgia,serif}#st .ppt span{font-size:12px;color:#8FA0AE}#st .ppbar{display:flex;height:14px;border-radius:7px;overflow:hidden;margin:10px 0 8px}#st .ppbar i{display:block}#st .ppg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:#8FA0AE}#st .ppg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px}#st .ppi{font-size:13.5px;border-top:1px solid #27353F;margin-top:12px;padding-top:10px;color:#C9D4DC}#st .ppi b{color:#F2B84B}#st .pps{font-size:12px;color:#8FA0AE;margin-top:8px}
#cnl .cit{border-top:1px solid #27353F;padding:11px 0 6px}#cnl .cit:first-of-type{margin-top:8px}#cnl .cih{display:flex;align-items:center;gap:8px}#cnl .cih b{flex:1;font-size:14.5px}#cnl .ic{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font:700 11px system-ui;background:#1E2A33;flex:none}#cnl .cp{font:600 11px ui-monospace,monospace;border-radius:999px;padding:2px 8px;white-space:nowrap}#cnl .cp.wait{color:#F2B84B;border:1px solid #5A4A22}#cnl .cp.ok{color:#7BD39A;border:1px solid #2F5F4B}#cnl .cp.no{color:#8FA0AE;border:1px solid #27353F}#cnl .cp.bad{color:#FF9A9A;border:1px solid #5A3434}#cnl .cpv{margin:8px 0 0 32px;background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:9px 11px;font-size:13.5px;line-height:1.45;color:#DCE4EA}#cnl .cta{margin:8px 0 0 32px;width:calc(100% - 32px)}#cnl .cwh{margin:6px 0 2px 32px;font-size:12.5px;color:#8FA0AE}#cnl .cwh a{color:#86B4EA}#cnl .cac{display:flex;gap:8px;margin:8px 0 4px 32px}#cnl .sm{border:1px solid #3A4C5C;background:transparent;color:#E6ECF1;border-radius:8px;padding:6px 10px;font:600 13px system-ui}#cnl .sm.d{color:#FF9A9A;border-color:#5A3434}
#og .ogh .ogbar{height:6px;border-radius:3px;background:#27353F;margin-top:10px;overflow:hidden}#og .ogh .ogbar i{display:block;height:100%;background:#7FD1A0}
.ogn{font:600 11px ui-monospace,monospace;background:#0B1830;color:#E4EAEF;border-radius:99px;padding:2px 7px;margin-left:4px}.ogn.ok{background:#1f4a33;color:#7FD1A0}
.ogs{padding:0}.ogt{display:flex;align-items:center;gap:12px;padding:12px 14px}.ogtt{flex:1;min-width:0;cursor:pointer}.ogtt b{font-size:15px}.ogs .chev{color:#8FA0AE;transition:transform .2s}.ogs.open .chev{transform:rotate(180deg)}
.ogc{flex:0 0 34px;width:34px;height:34px;border-radius:50%;border:2px solid #3A4C5C;background:transparent;color:#C5D0D8;font:700 14px system-ui;cursor:pointer}.ogs.done .ogc{background:#7FD1A0;border-color:#7FD1A0;color:#0B1830}.ogs.done .ogtt b{color:#8FA0AE}
.ogb{display:none;padding:0 14px 14px;gap:8px}.ogs.open .ogb{display:grid}
.ogsr{display:flex;gap:12px;align-items:flex-start}.ogth{flex:0 0 108px;width:108px;height:192px;border-radius:10px;border:1px solid #27353F;background:#0a0f1c}
.ogalt{border-top:1px solid #27353F;padding-top:8px}.ogalt>summary{cursor:pointer;color:#86B4EA;font-weight:600;font-size:14px;padding:4px 0}.ogal{display:grid;gap:6px;background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:10px;margin-top:8px}.ogal .g{justify-self:start}
.ogsh{width:100%;min-height:44px;border:0;border-radius:10px;background:linear-gradient(90deg,#f58529,#dd2a7b,#8134af);color:#fff;font:700 14.5px system-ui;cursor:pointer}.ogdl{justify-self:center;text-align:center}
#snd{padding:0}#snd>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:12px 14px}#snd>summary::-webkit-details-marker{display:none}#snd[open]>summary .chev{transform:rotate(180deg)}#sndb{padding:0 14px 12px}
.sndp{display:flex;gap:14px;align-items:flex-start;margin-top:4px}.sndp canvas{flex:0 0 120px;width:120px;height:213px;border-radius:10px;border:1px solid #27353F}.sndf{flex:1;min-width:0;display:grid;gap:8px}
.sndc{display:flex;align-items:center;gap:8px;background:#0E151B;border:1px solid #27353F;border-radius:10px;padding:7px 8px 7px 10px}.sndl{font:600 10.5px ui-monospace,monospace;letter-spacing:.06em;color:#8FA0AE;text-transform:uppercase;flex:0 0 auto}.sndv{flex:1;min-width:0;font-size:14.5px;font-weight:600;overflow-wrap:anywhere}
.sndab{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sndab .sndl{display:none}.sndd{text-decoration:none;display:inline-flex;align-items:center}
.sndi{border-top:1px solid #27353F;margin-top:14px;padding-top:12px;display:grid;gap:8px}.sndn{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end}.sndn label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8FA0AE}.sndn input{width:92px}.sndr canvas{flex-basis:100px;width:100px;height:178px}
.sndw{border-top:1px solid #27353F;margin-top:14px;padding-top:12px}.sndb{display:flex;gap:6px;align-items:flex-end;height:96px;margin:8px 0}.sndb div{flex:1;text-align:center;font-size:11px;color:#8FA0AE;line-height:1.3}.sndb i{display:block;width:70%;margin:0 auto 4px;background:#86B4EA;border-radius:4px 4px 0 0}
</style>
<main><h1>Pannello Read Geopolitics</h1><div class="sub" id="acc">carico…</div>
<details class="card chan" id="chan"><summary><span class="lab">Canali e uscita</span><span class="chsum" id="chsum">carico…</span><span class="chev">▾</span></summary>
<details class="chr"><summary><span class="ic">⏱</span><div class="cht"><b>Uscita</b><div class="s"><span class="dot" id="usd"></span><span id="ussum">carico…</span></div></div><span class="gear">⚙</span></summary>
<div class="set"><label><input type="checkbox" id="pause"> in pausa (blocca anche l&#39;automatico)</label>
<div class="row"><span>Uscita dei contenuti</span><select id="mode"><option value="approva">chiedi approvazione</option><option value="auto">pubblica da solo</option></select></div>
<div class="row"><span>Ora predefinita</span><input type="time" id="time" value="08:30"><button class="g" id="sv">Salva</button></div></div></details>
<div class="chr chs"><span class="ic">IG</span><div class="cht"><b>Instagram</b><div class="s"><span class="dot" id="igd"></span><span id="igs">carico…</span></div></div><span></span></div>
<details class="chr" id="ttc"><summary><span class="ic">TT</span><div class="cht"><b>TikTok</b><div class="s"><span class="dot" id="ttdot"></span><span id="tts">carico…</span></div></div><span class="tg" id="tttag"></span></summary>
<div class="set"><div class="row"><span>Invio</span><select id="ttmode" style="max-width:100%"><option value="bozza">bozza nella casella TikTok</option><option value="diretto">pubblica direttamente (serve l&#39;audit)</option></select></div>
<label><input type="checkbox" id="ttauto"> invia da solo dopo Instagram</label>
<details><summary class="sub">Verifica indirizzo immagini (per i caroselli)</summary><div class="row" style="margin-top:8px"><input id="ttvn" placeholder="tiktokXXXX.txt"><input id="ttvc" placeholder="contenuto del file"><button class="g" id="ttvs" type="button">Salva</button></div><div class="sub" id="ttvi"></div></details>
<div class="row"><a id="ttcon" href="/ig/tt/connect"><button class="g" type="button">Collega TikTok</button></a></div></div></details>
<details class="chr" id="thc"><summary><span class="ic">TH</span><div class="cht"><b>Threads</b><div class="s"><span class="dot" id="thdot"></span><span id="ths">carico…</span></div></div><span class="tg" id="thtag"></span></summary>
<div class="set"><label><input type="checkbox" id="thauto"> pubblica da solo dopo Instagram</label> <label><input type="checkbox" id="thdom"> una domanda al giorno alle 18, dal fatto centrale (solo se il post del giorno è uscito)</label>
<div class="row"><span>Argomento</span><input id="thtopic" maxlength="50" style="max-width:160px"><button class="g" id="thtsv" type="button">Salva</button></div>
<div class="row"><a id="thcon" href="/ig/th/connect"><button class="g" type="button">Collega Threads</button></a></div>
<div class="thr"><b>Rispondi su Threads</b><div class="sub">Cerca i post su un tema e rispondi con un fatto e la fonte. Ogni risposta parte solo quando premi «Rispondi» (al massimo 3 al giorno).</div>
<div class="row" style="margin-top:8px"><input id="thrq" value="geopolitica" maxlength="100" style="flex:1"><select id="thrt" style="max-width:120px"><option value="TOP">Più discussi</option><option value="RECENT">Più recenti</option></select><button class="g" id="thrgo" type="button">Cerca</button></div>
<div id="thrl" class="thrl"></div></div></div></details>
<details class="chr" id="tgc"><summary><span class="ic">TG</span><div class="cht"><b>Telegram</b><div class="s"><span class="dot" id="tgdot"></span><span id="tgs">carico…</span></div></div><span class="tg" id="tgtag"></span></summary>
<div class="set"><div class="row"><span>Canale</span><input id="tgchat" placeholder="@readgeopolitics" style="max-width:180px"></div>
<label><input type="checkbox" id="tgm"> ogni mattina: 60 secondi e puntata, alle <input type="time" id="tgora" value="08:00" style="width:auto"></label>
<label><input type="checkbox" id="tgp"> anche i post di Instagram, quando escono</label> <label><input type="checkbox" id="tgdv"> «Le fonti non sono d&#39;accordo», alle 12:30, solo nei giorni in cui c&#39;è una divergenza vera</label> <label><input type="checkbox" id="tgsr"> «Dalle ultime ore», la sera alle 20:15: i titoli degli aggiornamenti del giorno, solo se ce ne sono</label> <label><input type="checkbox" id="tgbl"> «Com&#39;è andata», la domenica alle 18: il bilancio dei segnali della settimana</label> <label><input type="checkbox" id="tgdz"> il nuovo dossier, appena è sul sito</label>
<div class="row"><button class="g" id="tgsv" type="button">Salva</button><button class="g" id="tgnow" type="button">Invia ora il mattino</button></div><div class="sub" id="tgmsg"></div><div class="thr"><b>Avvisi privati delle svolte</b><div class="sub" id="tgpv">non collegato</div><div class="row"><button class="g" id="tgpvc" type="button">Collega la mia chat</button><button class="g" id="tgpvk" type="button" hidden>Ho premuto Avvia</button><button class="g" id="tgpvt" type="button" hidden>Prova</button><button class="g" id="tgpvx" type="button" hidden>Scollega</button></div><label><input type="checkbox" id="tgprr"> anche il riepilogo dei giri senza svolte</label></div></div></details>
<div class="chr chs" id="mbar" style="cursor:pointer"><span class="ic">✉</span><div class="cht"><b>Email del mattino</b><div class="s"><span class="dot" id="mbd"></span><span id="mbt">carico…</span></div></div><span class="gear">›</span></div>
</details>
<details class="card" id="svb" hidden><summary class="svh"><span class="lab">Svolte</span><span class="chsum" id="svsum"></span><span class="svn" id="svn" hidden></span><span class="chev">▾</span></summary><div class="svbd"><div id="svl"></div><div class="svg" id="svg" hidden></div></div></details>
<details class="card" id="cnl" hidden><summary><span class="lab">Oggi sui canali</span><span class="chsum" id="cnlsum"></span><span class="chev">▾</span></summary><div id="cnlb"></div></details>
<div class="tabs"><button class="tab on" data-t="og">Oggi</button><button class="tab" data-t="list">Bozze</button><button class="tab" data-t="wk">Settimana</button><button class="tab" data-t="rq">Richieste</button><button class="tab" data-t="pd">Podcast</button><button class="tab" data-t="ut">Utenti</button><button class="tab" data-t="st">Statistiche</button><button class="tab" data-t="lk">Link</button></div><div id="og"></div><div id="list" hidden></div><div id="wk" hidden></div><div id="rq" hidden></div><div id="st" hidden></div><div id="lk" hidden></div><div id="pd" hidden>
<div class="card"><div class="row"><b>🎧 Puntata</b><button class="g" id="pd-rf" style="margin-left:auto">Aggiorna</button></div><div id="pd-ep" style="margin-top:8px"></div></div>
<div class="card"><b>Storia Instagram</b><div class="sub">Si crea qui, dalla puntata più recente: scegli la versione, poi «Salva o condividi». Se un tema non ti piace, «Modifica temi».</div>
<div class="row" style="margin-top:8px"><span class="sub">Versione</span><select id="pd-mode"><option value="estesi">Temi per esteso</option><option value="brevi">Temi brevi</option><option value="sempre">Senza data (valida ogni giorno)</option></select></div>
<div class="row" style="margin-top:8px" id="pd-edb"><button class="g" id="pd-edo">Modifica temi</button><span class="sub" id="pd-edm"></span></div>
<div id="pd-ed" class="frm" hidden><label>Temi del mondo (uno per riga)<textarea id="pd-tm" rows="4"></textarea></label><label>Temi d'Italia (uno per riga)<textarea id="pd-ti" rows="3"></textarea></label>
<div class="row"><button id="pd-ap">Applica</button><button class="g" id="pd-an">Annulla</button><button class="g" id="pd-rs">Ripristina originali</button></div></div>
<canvas id="pd-cv" width="1080" height="1920" style="width:100%;max-width:300px;display:block;margin:10px auto;border-radius:12px;border:1px solid #34475A"></canvas>
<div class="row" style="justify-content:center"><button id="pd-sh">Salva o condividi</button><a id="pd-dl" class="sub" href="#">scarica il file</a></div></div>
<div class="card"><b>Da copiare nello sticker Link</b><div class="sub" style="margin-top:4px">Un solo sticker: la pagina «Ascolta» del sito apre la scelta tra Spotify, Apple Podcasts, Telegram e la puntata sul sito.</div>
<div class="row" style="margin-top:10px"><span style="flex:1;min-width:0;word-break:break-all;font-size:14px"><b>Consigliato</b> · https://www.readgeopolitics.com/ascolta.html?utm_source=ig_storia</span><button class="g" data-copy="https://www.readgeopolitics.com/ascolta.html?utm_source=ig_storia">Copia link</button></div>
<div class="row" style="margin-top:8px"><span style="flex:1">Ascolta il podcast</span><button class="g" data-copy="Ascolta il podcast">Copia testo</button></div>
<details style="margin-top:10px"><summary class="sub">Link diretti (se vuoi un canale solo)</summary>
<div class="row" style="margin-top:8px"><span style="flex:1;min-width:0;word-break:break-all;font-size:14px">Spotify · https://open.spotify.com/show/5cozVJfZphY5ivF1GdUCcU</span><button class="g" data-copy="https://open.spotify.com/show/5cozVJfZphY5ivF1GdUCcU">Copia</button></div>
<div class="row" style="margin-top:8px"><span style="flex:1;min-width:0;word-break:break-all;font-size:14px">Apple Podcasts · https://podcasts.apple.com/it/podcast/id6825275444</span><button class="g" data-copy="https://podcasts.apple.com/it/podcast/id6825275444">Copia</button></div>
<div class="row" style="margin-top:8px"><span style="flex:1;min-width:0;word-break:break-all;font-size:14px">Amazon Music · https://music.amazon.it/podcasts/b3762eed-f62e-42c2-a601-e3827cbddc08/read-geopolitics-%C2%B7-il-mondo-in-15-minuti</span><button class="g" data-copy="https://music.amazon.it/podcasts/b3762eed-f62e-42c2-a601-e3827cbddc08/read-geopolitics-%C2%B7-il-mondo-in-15-minuti">Copia</button></div>
<div class="row" style="margin-top:8px"><span style="flex:1;min-width:0;word-break:break-all;font-size:14px">Telegram · https://t.me/readgeopolitics</span><button class="g" data-copy="https://t.me/readgeopolitics">Copia</button></div></details></div>
<div class="card"><b>Ogni mattina, tra le 8 e le 9</b><ol class="sub" style="margin:8px 0 0;padding-left:20px">
<li>Salva la storia da qui.</li><li>Instagram → nuova storia → scegli l&#39;immagine.</li><li>Sticker <b>Link</b>: incolla il link consigliato, poi «Personalizza testo» → «Ascolta il podcast».</li><li>Mettilo sotto «Ascolta qui sotto ↓» e pubblica.</li><li>Aggiungi la storia in evidenza a «Podcast». Le altre storie solo la sera.</li></ol></div>
</div><div id="ut" hidden><div class="card" id="uscard"><div class="row"><b>Iscritti Early Access</b><span class="sub" id="ust">carico…</span></div>
<div class="row" style="margin-top:10px"><button class="g" id="usb">Mostra elenco</button><button class="g" id="usc">Scarica CSV</button></div>
<div id="us" style="display:none;margin-top:10px"></div></div>
<div class="card" id="mlogcard"><details id="ml-log"><summary style="cursor:pointer"><b>Email inviate</b> <span id="mls" class="sub">carico…</span></summary><div id="mld" style="margin-top:10px"></div></details></div>
<div class="card" id="mlcard"><div class="row"><b>Email del mattino</b><span class="sub" id="mlst">carico…</span></div>
<div class="row" style="margin-top:10px"><label><input type="checkbox" id="ml-en"> invio acceso</label><select id="ml-mode"><option value="test">solo prova (a un indirizzo)</option><option value="live">reale (iscritti con consenso)</option></select></div>
<div class="row" style="margin-top:8px"><label><input type="checkbox" id="ml-cp"> ricevi anche tu una copia di ogni invio reale</label></div>
<div class="row" style="margin-top:8px"><input id="ml-te" placeholder="la tua email (prova e copia dell'invio reale)" style="flex:1;min-width:0"><span>ora</span><input type="number" id="ml-h" min="5" max="20" style="width:64px"></div>
<div class="row" style="margin-top:8px"><span>a scaglioni di</span><input type="number" id="ml-b" min="1" max="100" style="width:70px"><span>max al giorno</span><input type="number" id="ml-c" min="1" max="100" style="width:70px"></div>
<div class="row" style="margin-top:8px"><input id="ml-p" placeholder="indirizzo dell'informativa privacy (https://…)" style="flex:1;min-width:0"></div>
<div class="row" style="margin-top:8px"><textarea id="ml-t" rows="2" placeholder="testo esatto della casella newsletter (viene salvato con ogni nuovo consenso)" style="flex:1;min-width:0"></textarea></div>
<div class="row" style="margin-top:10px"><button class="g" id="ml-s">Salva</button><button class="g" id="ml-pv">Anteprima</button><button class="g" id="ml-t1">Invia prova a me</button></div>
<div id="ml-m" class="sub" style="margin-top:8px"></div><div id="ml-l" class="sub" style="margin-top:4px"></div></div></div></main><div id="lb"><button class="x" aria-label="Chiudi">×</button><button class="a p" aria-label="Precedente">‹</button><img alt=""><button class="a f" aria-label="Successiva">›</button><div class="n"></div></div>
<script>
if("serviceWorker" in navigator)navigator.serviceWorker.register("/ig/sw.js",{scope:"/ig/"}).catch(()=>{});
function ask(m,v,one){return new Promise(res=>{const o=document.createElement("div");o.className="dlg";o.innerHTML='<div class="dlb" role="dialog" aria-modal="true"><p></p>'+(v!==undefined?'<input class="dli">':'')+'<div class="dla">'+(one?'':'<button class="dln">Annulla</button>')+'<button class="dly">OK</button></div><details class="dlo"><summary>Dettagli</summary><span></span></details></div>';
 o.querySelector("p").textContent=String(m);o.querySelector(".dlo span").textContent="Messaggio del pannello · "+location.host;const inp=o.querySelector(".dli");if(inp)inp.value=v||"";
 const end=r=>{document.removeEventListener("keydown",kd,true);o.remove();res(r)};const ok=()=>end(inp?inp.value:true),no=()=>end(inp?null:false);
 const kd=e=>{if(e.key==="Escape"){e.preventDefault();no()}else if(e.key==="Enter"&&e.target.tagName!=="BUTTON"){e.preventDefault();ok()}};
 o.querySelector(".dly").onclick=ok;if(o.querySelector(".dln"))o.querySelector(".dln").onclick=no;o.onclick=e=>{if(e.target===o)no()};
 document.addEventListener("keydown",kd,true);document.body.appendChild(o);if(inp){inp.focus();inp.select()}else o.querySelector(".dly").focus()})}
function say(m){return ask(m,undefined,1)}
const K=new URLSearchParams(location.search).get("k");
let LB={u:[],i:0};
function lbShow(){const b=document.getElementById("lb");b.classList.add("on");b.querySelector("img").src=LB.u[LB.i];b.querySelector(".n").textContent=(LB.i+1)+" / "+LB.u.length}
function lbMove(d){LB.i=(LB.i+d+LB.u.length)%LB.u.length;lbShow()}
document.addEventListener("click",e=>{const im=e.target.closest(".strip img,.ed-list img");if(im){const us=[...im.closest(".strip,.ed-list").querySelectorAll("img")];LB={u:us.map(x=>x.src),i:us.indexOf(im)};lbShow();return}
 const b=document.getElementById("lb");if(!b.classList.contains("on"))return;
 if(e.target.closest(".p"))lbMove(-1);else if(e.target.closest(".f"))lbMove(1);else if(e.target.tagName!=="IMG")b.classList.remove("on")});
document.addEventListener("keydown",e=>{const b=document.getElementById("lb");if(!b.classList.contains("on"))return;if(e.key==="Escape")b.classList.remove("on");if(e.key==="ArrowLeft")lbMove(-1);if(e.key==="ArrowRight")lbMove(1)});
const EDIT={};let D=null,WOFF=0,WED=null,TAB="og";const OPENG={},OPENC={};

const LK=[
 {t:"Profilo Instagram",d:"I link del profilo, in quest&#39;ordine. Instagram ne accetta fino a 5.",r:[
  ["1 · Sito","https://www.readgeopolitics.com/?utm_source=ig"],
  ["2 · Ascolta il podcast","https://www.readgeopolitics.com/ascolta.html?utm_source=ig"],
  ["3 · Telegram","https://t.me/readgeopolitics"],
  ["4 · YouTube (quando è collegato)","https://www.youtube.com/@ReadGeopolitics"]]},
 {t:"Sticker delle storie",d:"Uno per storia. Il testo dello sticker è tra parentesi.",r:[
  ["Podcast (Ascolta il podcast)","https://www.readgeopolitics.com/ascolta.html?utm_source=ig_storia"],
  ["Telegram (Unisciti al canale)","https://t.me/readgeopolitics"],
  ["Sito (Apri Read Geopolitics)","https://www.readgeopolitics.com/?utm_source=instagram"]]},
 {t:"Tutti i canali",d:"Indirizzi diretti, da usare dove serve.",r:[
  ["Sito","https://www.readgeopolitics.com"],
  ["Pagina Ascolta (tutti i podcast)","https://www.readgeopolitics.com/ascolta.html"],
  ["Spotify","https://open.spotify.com/show/5cozVJfZphY5ivF1GdUCcU"],
  ["Apple Podcasts","https://podcasts.apple.com/it/podcast/id6825275444"],
  ["Amazon Music","https://music.amazon.it/podcasts/b3762eed-f62e-42c2-a601-e3827cbddc08/read-geopolitics-%C2%B7-il-mondo-in-15-minuti"],
  ["YouTube","https://www.youtube.com/@ReadGeopolitics"],
  ["Telegram","https://t.me/readgeopolitics"],
  ["Instagram","https://www.instagram.com/read.geopolitics"],
  ["Threads","https://www.threads.com/@read.geopolitics"],
  ["TikTok","https://www.tiktok.com/@readgeopolitics"],
  ["Iscrizione (pagina per annunci)","https://www.readgeopolitics.com/iscriviti.html"],
  ["Feed del podcast (RSS)","https://rg-api.briefinghub.workers.dev/podcast/feed.xml"]]},
 {t:"Bio pronte",d:"Da incollare nei profili.",r:[
  ["Instagram","Il mondo in 15 minuti, ogni mattina. Fatti con le fonti, due tesi a confronto: decidi tu. 🎧 Podcast ogni giorno · 📲 Canale Telegram"],
  ["Threads e Telegram","Il mondo in 15 minuti, ogni mattina. I fatti con le fonti, le due tesi a confronto: decidi tu. Podcast quotidiano su Spotify e Apple Podcasts."],
  ["YouTube","Il mondo in 15 minuti, ogni mattina. I fatti con le fonti, le due tesi a confronto: decidi tu. Ogni giorno qui la puntata del podcast."]]}];
function lkRender(){const el=document.getElementById("lk");if(el.dataset.ok)return;el.dataset.ok="1";
 el.innerHTML=LK.map(g=>'<div class="card"><b>'+g.t+'</b><div class="sub" style="margin-top:4px">'+g.d+'</div>'+g.r.map(r=>{const v=r[1];const isUrl=v.indexOf("http")===0;
  return '<div class="lkr"><div class="lkt"><b>'+esc(r[0])+'</b><span>'+(v?esc(v):'<i>ancora non disponibile</i>')+'</span></div>'+(v?'<button class="g" data-copy="'+esc(v)+'">Copia</button>':'')+(isUrl?'<a class="lka" href="'+esc(v)+'" target="_blank" rel="noopener">Apri</a>':'')+'</div>'}).join("")+'</div>').join("");
 el.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>podCopy(b,b.dataset.copy))}
const TYL={carousel:"carosello",reel:"reel",image:"post",story:"storia"};
const STL={bozza:"DA APPROVARE",pubblicata:"PUBBLICATA",errore:"ERRORE",in_elaborazione:"IN ELABORAZIONE",in_pubblicazione:"IN PUBBLICAZIONE",scartata:"SCARTATA"};
const DNS=["dom","lun","mar","mer","gio","ven","sab"];
let MAILERR=false;
const NL=String.fromCharCode(10);
function arcRow(x){const tt=(D.tt||{})[x.id],th=(D.th||{})[x.id],tg=(D.tg||{})[x.id];
 const ch=[[x.status==="pubblicata","IG"],[tt&&tt.status==="pubblicato","TikTok"],[th&&th.status==="pubblicato","Threads"],[tg&&tg.status==="inviato","Telegram"]].filter(z=>z[0]).map(z=>z[1]);
 const st=x.status==="pubblicata"?"":'<span class="pill p-'+x.status+'">'+esc(STL[x.status]||x.status.toUpperCase())+'</span>';
 return '<div class="orow" data-oid="'+x.id+'"><button type="button" class="ohd"><span class="oic">'+(x.type==="reel"?"▶":x.type==="story"?"◔":"▦")+'</span><span class="otx"><b>'+esc(dTitle(x))+'</b><span class="sub">'+dSub(x)+(ch.length?' · uscito su '+ch.join(", "):'')+'</span></span>'+st+'<span class="chev">▾</span></button><div class="obody" hidden></div></div>'}
function dTitle(x){const l=(String(x.caption||"").split(NL).find(s=>s.trim())||x.format||"").trim();return l.length>70?l.slice(0,68)+"…":l}
function dSub(x){const s=String(x.date||"");const d=new Date(s+"T12:00:00Z");const ds=isNaN(d)?esc(s):DNS[d.getUTCDay()]+" "+(+s.slice(8))+"/"+(+s.slice(5,7));const n=(x.type!=="reel"&&x.image_urls&&x.image_urls.length)?" · "+x.image_urls.length+(x.image_urls.length===1?" immagine":" carte"):"";return ds+" · "+(TYL[x.type]||esc(x.type||""))+n}
function nTags(s){return String(s||"").split(NL).join(" ").split(" ").filter(w=>w.charAt(0)==="#"&&w.length>1).length}
function ttOk(x){return ["reel","carousel","image"].indexOf(x.type)>=0&&x.status!=="scartata"&&D&&D.tiktok&&D.tiktok.collegato}
function thOk(x){return ["reel","carousel","image"].indexOf(x.type)>=0&&x.status!=="scartata"&&D&&D.threads&&D.threads.collegato}
function igRow(x){if(x.status!=="pubblicata")return "";const tm=x.published_at?new Date(x.published_at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}):"";return '<div class="dr"><span class="ic">IG</span><div>Instagram <span class="st">· uscito'+(tm?" alle "+tm:"")+'</span></div>'+(x.permalink?'<a href="'+esc(x.permalink)+'" target="_blank">Apri ›</a>':'<span></span>')+'</div>'}
function ttRow(x){if(!ttOk(x))return "";const t=(D.tt||{})[x.id];const auto=!!(D.tiktok.settings&&D.tiktok.settings.auto)&&x.status!=="pubblicata";
 const lab={invio:"invio in corso",in_elaborazione:"TikTok sta elaborando",nella_casella:"nella casella: scegli il suono e pubblica",pubblicato:(t&&t.marked?"pubblicato (segnato da te)":"pubblicato"),errore:"non inviato"};
 const st=t?(lab[t.status]||t.status):(auto?"partirà da solo dopo Instagram":"da inviare");let act='<span></span>';
 if(!t)act=auto?'<span class="tg">auto</span>':'<button class="sm tts">Invia</button>';
 else if(t.status==="errore")act='<button class="sm tts">Riprova</button>';
 else if(t.status==="nella_casella")act='<button class="sm ttm">Fatto</button>';
 else if(t.link)act='<a href="'+esc(t.link)+'" target="_blank">Apri ›</a>';
 else if(t.status==="pubblicato")act='<button class="sm ttl">Link</button>';
 else if(t.status==="in_elaborazione")act='<button class="sm ttk">Aggiorna</button>';
 return '<div class="dr"><span class="ic">TT</span><div>TikTok <span class="st">· '+esc(st)+'</span></div>'+act+'</div>'+(t&&t.error?'<div class="err">'+esc(t.error)+'</div>':'')}
function thRow(x){if(!thOk(x))return "";const t=(D.th||{})[x.id];const auto=!!(D.threads.settings&&D.threads.settings.auto)&&x.status!=="pubblicata";
 const lab={invio:"invio in corso",in_elaborazione:"Threads sta preparando il post",pubblicato:"uscito",errore:"non pubblicato"};
 const st=t?(lab[t.status]||t.status):(auto?"partirà da solo dopo Instagram":"da pubblicare");let act='<span></span>';
 if(!t)act=auto?'<span class="tg">auto</span>':'<button class="sm thsd">Pubblica</button>';
 else if(t.status==="errore")act='<button class="sm thsd">Riprova</button>';
 else if(t.link)act='<a href="'+esc(t.link)+'" target="_blank">Apri ›</a>';
 else if(t.status==="in_elaborazione")act='<button class="sm thk">Aggiorna</button>';
 return '<div class="dr"><span class="ic">TH</span><div>Threads <span class="st">· '+esc(st)+'</span></div>'+act+'</div>'+(t&&t.error?'<div class="err">'+esc(t.error)+'</div>':'')}
function tgRow(x){if(["reel","carousel","image"].indexOf(x.type)<0||x.status==="scartata"||!D||!D.telegram||!D.telegram.configurato||!D.telegram.settings.chat)return "";const t=(D.tg||{})[x.id];const auto=!!D.telegram.settings.post&&x.status!=="pubblicata";
 const st=t?(t.status==="inviato"?"inviato":t.status==="errore"?"non inviato":"invio in corso"):(auto?"partirà da solo dopo Instagram":"da inviare");let act='<span></span>';
 if(!t)act=auto?'<span class="tg">auto</span>':'<button class="sm tgs">Invia</button>';else if(t.status==="errore")act='<button class="sm tgs">Riprova</button>';else if(t.link)act='<a href="'+esc(t.link)+'" target="_blank">Apri ›</a>';
 return '<div class="dr"><span class="ic">TG</span><div>Telegram <span class="st">· '+esc(st)+'</span></div>'+act+'</div>'+(t&&t.error?'<div class="err">'+esc(t.error)+'</div>':'')}
function menuHtml(x){const open=x.status==="bozza"||x.status==="errore";const t=(D.tt||{})[x.id];const h=(D.th||{})[x.id];let m="";
 if(open&&!x.video_url&&x.image_urls&&x.image_urls.length)m+='<button class="mi ed">Modifica immagini</button>';
 if(x.status==="in_pubblicazione"||x.status==="in_elaborazione")m+='<button class="mi rst">Reset a bozza (solo se bloccata)</button>';
 if(ttOk(x)){if(x.type==="reel")m+='<button class="mi ttc">Copia didascalia TikTok</button>';if(t&&(t.status==="in_elaborazione"||t.status==="nella_casella"))m+='<button class="mi ttk">Aggiorna stato TikTok</button>';if(t&&t.status==="nella_casella")m+='<button class="mi ttf">Reinvia a TikTok</button>'}
 if(thOk(x)&&h&&h.status==="in_elaborazione")m+='<button class="mi thk">Aggiorna stato Threads</button>';
 if(open)m+='<button class="mi d dis">Scarta la bozza</button>';
 return m}
function capsHtml(x){const open=x.status==="bozza"||x.status==="errore";const t=(D.tt||{})[x.id];const h=(D.th||{})[x.id];
 const tabs=[["ig","Instagram"]];if(ttOk(x))tabs.push(["tt","TikTok"]);if(thOk(x))tabs.push(["th","Threads"]);
 let s=tabs.length>1?'<div class="seg">'+tabs.map((a,i)=>'<button type="button" data-cp="'+a[0]+'"'+(i===0?' class="on"':'')+'>'+a[1]+'</button>').join("")+'</div>':'';
 s+='<div class="cp" data-cp="ig"><textarea rows="5" class="cap"'+(open?'':' readonly')+'>'+esc(x.caption)+'</textarea><div class="cnt"><span class="svm">'+(open?'si salva da sola':'già pubblicata')+'</span><span>'+nTags(x.caption)+' hashtag</span><button type="button" class="cpy">Copia</button></div></div>';
 if(ttOk(x)){const ed=!(t&&t.status==="pubblicato");s+='<div class="cp" data-cp="tt" hidden><textarea rows="5" class="ttcap"'+(ed?'':' readonly')+'>'+esc(x.tt_cap||"")+'</textarea><div class="cnt"><span class="svm">'+(ed?'si salva da sola':'già pubblicata')+'</span><span>'+(x.type==="reel"?'per i reel va incollata a mano':nTags(x.tt_cap)+' hashtag')+'</span><button type="button" class="cpy">Copia</button></div></div>'}
 if(thOk(x)){const ed=!(h&&h.status==="pubblicato");s+='<div class="cp" data-cp="th" hidden><textarea rows="5" maxlength="500" class="thcap"'+(ed?'':' readonly')+'>'+esc(x.th_cap||"")+'</textarea><div class="cnt"><span class="svm">'+(ed?'si salva da sola':'già pubblicata')+'</span><span class="thn">'+String(x.th_cap||"").length+'/500</span><button type="button" class="cpy">Copia</button></div></div>'}
 return s}
function cnlSt(x,ora){if(!x.on)return '<span class="cp no">spento</span>';if(x.stato==="uscito")return '<span class="cp ok">uscito ✓</span>';if(x.stato==="saltato")return '<span class="cp no">saltato: '+esc(x.motivo||'')+'</span>';if(x.skip||x.stato==="fermato")return '<span class="cp no">fermato per oggi</span>';if(x.stato==="errore")return '<span class="cp bad">errore</span>';if(x.stato==="assente")return '<span class="cp no">oggi non c&#39;è</span>';return '<span class="cp wait">esce alle '+esc(ora)+'</span>'}
function cnlIt(k,ic,tit,x,why){let h='<div class="cit" data-k="'+k+'"><div class="cih"><span class="ic">'+ic+'</span><b>'+tit+'</b>'+cnlSt(x,x.ora)+'</div>';
 if(x.testo){h+='<div class="cpv">'+esc(x.testo).split(NL).join("<br>")+'</div>';if(x.modificato)h+='<div class="cwh">Testo modificato da te.</div>'}
 if(why)h+='<div class="cwh">'+why+'</div>';
 if(x.link)h+='<div class="cwh"><a href="'+esc(x.link)+'" target="_blank" rel="noopener">Apri il messaggio ›</a></div>';
 if(x.on&&x.testo&&x.stato!=="uscito")h+='<div class="cac"><button class="sm" data-ce="'+k+'">Modifica</button>'+(x.skip?'<button class="sm" data-cs="'+k+'" data-v="0">Riattiva</button>':'<button class="sm d" data-cs="'+k+'" data-v="1">Non inviare oggi</button>')+'</div>';
 return h+'</div>'}
function cnlSum(x,tg){if(!x||!x.on)return '';if(x.stato==="uscito")return tg+' ✓';if(x.skip||x.stato==="fermato"||x.stato==="saltato"||x.stato==="assente"||!x.testo)return '';if(x.stato==="errore")return tg+' errore';return tg+' '+x.ora}
function cnlRender(c){const el=document.getElementById("cnl");if(!el)return;if(!c){el.hidden=true;return}el.hidden=false;
 const sm=[cnlSum(c.div,c.div&&c.div.titolo&&c.div.titolo.indexOf("ufficiali")>0?"Versioni":"Fonti"),cnlSum(c.dom,"Domanda"),c.bil&&c.bil.domenica&&c.bil.stato!=="assente"?(c.bil.stato==="uscito"?"Com&#39;è andata ✓":"Com&#39;è andata "+c.bil.ora):""].filter(Boolean);document.getElementById("cnlsum").innerHTML=sm.length?sm.join(" · "):"niente in uscita";
 const dv=c.div,dm=c.dom;const td=new Date();
 let h='<div class="row" style="justify-content:space-between"><span class="sub">Escono da soli: puoi correggerli o fermarli per oggi.</span></div>';
 h+=cnlIt("div","TG",esc(dv.titolo||"Le fonti non sono d'accordo"),dv,dv.testo?(dv.fonti&&dv.fonti.length?esc(dv.fonti.join(" · ")):""):(!dv.briefing?"Il briefing di oggi non è ancora pronto.":"Nessuna divergenza che cambi la lettura dei fatti: oggi non esce."));
 h+=cnlIt("dom","TH","Domanda del giorno",dm,dm.testo?(dm.stato==="errore"?esc(dm.errore||""):dm.post!=="pubblicata"&&dm.stato!=="uscito"?"Parte solo se pubblichi il post di oggi su Instagram.":""):(dm.post?"La bozza di oggi non ha una domanda: oggi non esce.":"La bozza di oggi non c&#39;è ancora."));
 if(c.bil){const b=c.bil;h+='<div class="cit"><div class="cih"><span class="ic">TG</span><b>Com&#39;è andata</b>'+(b.stato==="uscito"?'<span class="cp ok">uscito ✓</span>':b.stato==="assente"?'<span class="cp no">niente da dire</span>':'<span class="cp '+(b.domenica?'wait':'no')+'">'+(b.domenica?'esce alle '+esc(b.ora):'domenica alle '+esc(b.ora))+'</span>')+'</div>';
  h+='<div class="cpv">&#128994; '+b.ok+' successi &#183; &#128256; '+(b.alt||0)+' andati diversamente &#183; &#9898; '+(b.fermi||0)+' fermi'+(b.open?' &#183; '+b.open+' aperti':'')+(b.righe.length?'<br><br>'+b.righe.map(esc).join("<br>")+(b.altri?'<br><i>… altri '+b.altri+'</i>':''):'')+'</div>';
  if(!b.domenica)h+='<div class="cwh">Anteprima con le verifiche fin qui: si completa domenica mattina.</div>';
  if(b.link)h+='<div class="cwh"><a href="'+esc(b.link)+'" target="_blank" rel="noopener">Apri il messaggio ›</a></div>';h+='</div>'}
 document.getElementById("cnlb").innerHTML=h}
document.addEventListener("click",async e=>{const b=e.target.closest(".cpy");if(!b)return;const ta=b.closest(".cp").querySelector("textarea");if(!ta)return;let ok=false;try{await navigator.clipboard.writeText(ta.value);ok=true}catch(err){ta.select();try{ok=document.execCommand("copy")}catch(e2){}}b.textContent=ok?"Copiata ✓":"Non riesco";b.classList.toggle("ok",ok);setTimeout(()=>{b.textContent="Copia";b.classList.remove("ok")},1800)});
document.getElementById("cnl").addEventListener("click",async e=>{const b=e.target.closest("button");if(!b)return;const it=b.closest(".cit");const k=it&&it.dataset.k;if(!k)return;
 if(b.dataset.ce){const pv=it.querySelector(".cpv");const cur=(D.canali&&D.canali[k]&&D.canali[k].testo)||"";pv.outerHTML='<textarea class="cta" rows="5" maxlength="'+(k==="dom"?500:600)+'">'+esc(cur)+'</textarea>';const ac=it.querySelector(".cac");ac.innerHTML='<button class="sm" data-cv="1">Salva</button><button class="sm" data-cx="1">Annulla</button>';return}
 if(b.dataset.cx){cnlRender(D.canali);return}
 b.disabled=true;let r=null;
 if(b.dataset.cv)r=await api({action:"canali_set",which:k,testo:it.querySelector("textarea").value});
 else if(b.dataset.cs)r=await api({action:"canali_set",which:k,skip:b.dataset.v==="1"});
 if(r&&r.ok){D.canali=r.canali;cnlRender(r.canali)}else{b.disabled=false;say("Errore: "+((r&&(r.detail||r.error))||""))}});
function chUpd(d){const iss=[];const A=d.account,T=d.tiktok||{},H=d.threads||{},S=d.settings||{formats:{daily:{}}};const g=id=>document.getElementById(id);
 if(A){g("igs").textContent="@"+A.username+" · valido "+A.days_left+" giorni";g("igd").className="dot "+(A.days_left<7?"y":"g");if(A.days_left<7)iss.push("token Instagram in scadenza")}else{g("igs").textContent="non collegato";g("igd").className="dot r";iss.push("Instagram non collegato")}
 g("ttdot").className="dot "+(!T.collegato?"y":T.scaduto?"r":"g");if(T.scaduto)iss.push("TikTok da ricollegare");
 const ta=!!(T.settings&&T.settings.auto);g("tttag").textContent=T.collegato?(ta?"auto dopo IG":"manuale"):"";g("tttag").className="tg"+(ta?"":" off");
 const G=d.telegram||{},GS=G.settings||{};g("tgdot").className="dot "+(!G.configurato||!GS.chat?"y":G.errore?"r":"g");g("tgs").textContent=!G.configurato?"manca TG_BOT_TOKEN nel Worker":!GS.chat?"canale da impostare":GS.chat+(G.oggi?" · mattino inviato":"")+(G.errore?" · errore: "+G.errore:"");if(G.errore)iss.push("Telegram");
 g("tgtag").textContent=G.configurato&&GS.chat?(GS.mattino?"mattino "+GS.ora:"")+(GS.post?(GS.mattino?" + post":"post"):""):"";g("tgtag").className="tg";
 if(document.activeElement!==g("tgchat")){g("tgchat").value=GS.chat||"";g("tgm").checked=!!GS.mattino;g("tgora").value=GS.ora||"08:00";g("tgp").checked=!!GS.post;g("tgdv").checked=GS.divergenze!==false;g("tgbl").checked=GS.bilancio!==false;g("tgsr").checked=GS.sera!==false;g("tgdz").checked=GS.dossier!==false}
 g("thdot").className="dot "+(!H.collegato?"y":H.scaduto?"r":"g");if(H.scaduto)iss.push("Threads da ricollegare");
 const ha=!!(H.settings&&H.settings.auto);g("thtag").textContent=H.collegato?(ha?"auto dopo IG":"manuale"):"";g("thtag").className="tg"+(ha?"":" off");
 const f=S.formats.daily||{};g("ussum").textContent=(S.paused?"in pausa · ":"")+(f.mode==="auto"?"pubblica da solo":"chiedi approvazione")+" · alle "+(f.time||"");g("usd").className="dot "+(S.paused?"y":"g");if(S.paused)iss.push("pubblicazione in pausa");
 if(MAILERR)iss.push("email del mattino");
 const pend=(d.drafts||[]).filter(x=>x.status==="bozza"&&x.mode!=="auto").length;
 g("acc").textContent=(iss.length?"Da sistemare: "+iss.join(", "):"Tutto a posto")+(pend?" · "+pend+(pend===1?" bozza da approvare":" bozze da approvare"):"");
 g("chsum").textContent=iss.length?iss.length+(iss.length===1?" cosa da sistemare":" cose da sistemare"):"tutto collegato"}
let VPRE=0;
function stripHtml(x){
 const open=x.status==="bozza"||x.status==="errore";
 if(x.video_url){const pre=VPRE++<1?"metadata":"none";return '<video controls playsinline preload="'+pre+'" style="width:100%;max-width:300px;border-radius:10px;background:#000" src="'+esc(x.video_url)+'"></video>'}
  if(!EDIT[x.id])return '<div class="strip">'+x.image_urls.map(u=>'<img loading="lazy" src="'+esc(u)+'">').join("")+'</div>';
 const L=EDIT[x.id];
 return '<div class="ed-list">'+L.map((u,i)=>'<div class="it"><img src="'+esc(u)+'"><div class="row"><span class="sub">'+(i+1)+'</span><button class="g up" data-i="'+i+'">↑</button><button class="g dn" data-i="'+i+'">↓</button><button class="r rm" data-i="'+i+'">×</button></div></div>').join("")+'</div>'
 +'<div class="sub">'+L.length+' immagini (2–10). Le immagini aggiunte vengono ritagliate in 4:5 come le altre.</div>'
 +'<div class="row" style="margin-top:8px"><label class="btn">+ Aggiungi immagine<input type="file" accept="image/*" multiple hidden class="file"></label><button class="sv">Salva modifiche</button><button class="g rs">Ripristina originali</button><button class="g cn">Annulla</button></div>';
}
async function toJpeg(file){const bmp=await createImageBitmap(file);const W=1080,H=1350;const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");g.fillStyle="#0E151B";g.fillRect(0,0,W,H);const s=Math.max(W/bmp.width,H/bmp.height);const w=bmp.width*s,h=bmp.height*s;g.drawImage(bmp,(W-w)/2,(H-h)/2,w,h);let q=.9,d;do{d=c.toDataURL("image/jpeg",q);q-=.1}while(d.length>1400000&&q>.3);return d.split(",")[1]}
let tx=null;document.addEventListener("touchstart",e=>{tx=e.touches[0].clientX},{passive:true});
/* v60: storia Instagram con la domanda di previsione. L'immagine si disegna qui (1080x1920), lo sticker sondaggio lo mette Francesco */
const SND_KICK="La domanda di oggi";
let SND=null,SND_BLOB={};
function sndMesi(iso){const m=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];const d=new Date(iso+"T12:00:00");return d.getDate()+" "+m[d.getMonth()]}
function sndToks(s){const out=[];String(s||"").split("*").forEach((p,i)=>{p.split(" ").filter(Boolean).forEach(w=>{const L=out[out.length-1];if(L&&/^[€%]/.test(w)&&L.g===(i%2===1))L.w+=" "+w;else out.push({w,g:i%2===1})})});return out}
function sndFit(g,t,maxW){if(g.measureText(t).width<=maxW)return t;while(t.length>4&&g.measureText(t+"…").width>maxW)t=t.slice(0,-1);return t.trim()+"…"}
function sndWrap(g,toks,maxW){const L=[];let cur=[],w=0;const sp=g.measureText(" ").width;for(const t of toks){const tw=g.measureText(t.w).width;if(cur.length&&w+sp+tw>maxW){L.push(cur);cur=[];w=0}if(cur.length)w+=sp;cur.push(t);w+=tw}if(cur.length)L.push(cur);return L}
function sndLine(g,line,x,y,col,gold){const sp=g.measureText(" ").width;for(const t of line){g.fillStyle=t.g?gold:col;g.fillText(t.w,x,y);x+=g.measureText(t.w).width+sp}}
async function sndFonts(){try{await Promise.all(["600 80px 'IBM Plex Serif'","400 38px 'IBM Plex Sans'","600 38px 'IBM Plex Sans'","500 28px 'IBM Plex Mono'"].map(f=>document.fonts.load(f)))}catch(e){}}
function sndBg(g){const bg=g.createRadialGradient(540,700,0,540,700,1300);bg.addColorStop(0,"#14213f");bg.addColorStop(.6,"#0a0f1c");bg.addColorStop(1,"#0a0f1c");g.fillStyle=bg;g.fillRect(0,0,1080,1920);g.textBaseline="top";g.textAlign="left";
 g.fillStyle="#EEF2F6";g.font="600 34px 'IBM Plex Serif'";g.fillText("READ GEOPOLITICS",96,120)}
function sndKick(g,txt,y){g.fillStyle="#E8B050";g.font="500 30px 'IBM Plex Mono'";let x=96;for(const c of txt.toUpperCase()){g.fillText(c,x,y);x+=g.measureText(c).width+6}}
async function sndDrawQ(c,q,band){const g=c.getContext("2d");await sndFonts();sndBg(g);let y=260;
 if(band){g.fillStyle="#2a2412";g.strokeStyle="#6E5A26";g.lineWidth=2;g.beginPath();g.roundRect(96,y,888,150,24);g.fill();g.stroke();
  g.fillStyle="#F2D58A";g.font="500 24px 'IBM Plex Mono'";g.fillText(sndFit(g,("IERI · "+band.t).toUpperCase(),820),130,y+30);
  g.fillStyle="#EEF2F6";g.font="600 38px 'IBM Plex Sans'";g.fillText(band.r,130,y+76);y+=200}else y+=100;
 sndKick(g,SND_KICK+(q.tema?" · "+q.tema:""),y);y+=70;
 const toks=sndToks(q.titolo||q.sticker);let fs=96,L;for(;fs>=60;fs-=4){g.font="600 "+fs+"px 'IBM Plex Serif'";L=sndWrap(g,toks,888);if(L.length<=(band?4:5))break}
 const lh=Math.round(fs*1.1);for(const ln of L){sndLine(g,ln,96,y,"#EEF2F6","#E8B050");y+=lh}
 if(q.contesto){y+=34;g.font="400 38px 'IBM Plex Sans'";for(const ln of sndWrap(g,sndToks(q.contesto),888).slice(0,3)){sndLine(g,ln,96,y,"#B9C4CF","#B9C4CF");y+=52}}
 g.textAlign="center";g.fillStyle="#DCE3EA";g.font="400 38px 'IBM Plex Sans'";g.fillText("Domani il risultato. Il "+sndMesi(q.scadenza||SND.day),540,1580);g.fillText("vediamo chi ci ha preso.",540,1634);
 g.fillStyle="#86B4EA";g.font="500 26px 'IBM Plex Mono'";podSpaced(g,"READGEOPOLITICS.COM",540,1780,6);return Math.max(y,0)}
async function sndDrawR(c,q){const g=c.getContext("2d");await sndFonts();sndBg(g);const n=q.num,a=q.a||"Sì",b=q.b||"No";let y=330;
 sndKick(g,"Ieri vi abbiamo chiesto"+(q.tema?" · "+q.tema:""),y);y+=70;g.font="600 76px 'IBM Plex Serif'";for(const ln of sndWrap(g,sndToks(String(q.titolo||q.sticker).split("*").join("")),888).slice(0,4)){sndLine(g,ln,96,y,"#EEF2F6","#EEF2F6");y+=84}
 y=Math.max(y+60,820);const maj=n.si>=50;g.fillStyle="#E8B050";g.font="600 230px 'IBM Plex Serif'";g.fillText((maj?n.si:100-n.si)+"%",96,y);y+=250;
 g.fillStyle="#B9C4CF";g.font="400 40px 'IBM Plex Sans'";g.fillText("dice "+(maj?a:b).toLowerCase()+" · avete risposto in "+n.votanti,96,y);y+=90;
 g.fillStyle="#1d2a3d";g.beginPath();g.roundRect(96,y,888,68,34);g.fill();g.save();g.beginPath();g.roundRect(96,y,888,68,34);g.clip();g.fillStyle="#E8B050";g.fillRect(96,y,888*n.si/100,68);g.restore();
 g.font="600 32px 'IBM Plex Sans'";g.fillStyle="#15202B";if(n.si>=18)g.fillText(a+" "+n.si+"%",124,y+16);g.fillStyle="#B9C4CF";g.textAlign="right";if(n.si<=82)g.fillText(b+" "+(100-n.si)+"%",956,y+16);g.textAlign="left";y+=140;
 if(q.riga&&q.riga.riga){g.fillStyle="#2a2412";g.strokeStyle="#6E5A26";g.lineWidth=2;g.font="400 36px 'IBM Plex Sans'";const L=sndWrap(g,sndToks(q.riga.riga),820).slice(0,3);const h=90+L.length*50;g.beginPath();g.roundRect(96,y,888,h,24);g.fill();g.stroke();
  g.fillStyle="#F2D58A";g.font="500 24px 'IBM Plex Mono'";g.fillText("DA IERI A OGGI",130,y+28);g.font="400 36px 'IBM Plex Sans'";let yy=y+70;for(const ln of L){sndLine(g,ln,130,yy,"#EEF2F6","#EEF2F6");yy+=50}y+=h}
 g.textAlign="center";g.fillStyle="#86B4EA";g.font="500 24px 'IBM Plex Mono'";podSpaced(g,(q.scadenza?"IL "+sndMesi(q.scadenza).toUpperCase()+" VEDIAMO CHI CI HA PRESO":"READGEOPOLITICS.COM"),540,Math.min(1560,Math.max(y+40,1420)),4);
 g.fillStyle="#FFFFFF";g.font="600 46px 'IBM Plex Sans'";g.fillText("Oggi altre domande sul sito",540,1640);g.fillStyle="#B9C4CF";g.font="400 34px 'IBM Plex Sans'";g.fillText("tocca il link qui sotto ↓",540,1704)}
function sndCta(g){g.textAlign="center";g.fillStyle="#FFFFFF";g.font="600 46px 'IBM Plex Sans'";g.fillText("Oggi altre domande sul sito",540,1640);g.fillStyle="#B9C4CF";g.font="400 34px 'IBM Plex Sans'";g.fillText("tocca il link qui sotto ↓",540,1704);g.textAlign="left"}
async function sndDrawV(c,q){const g=c.getContext("2d");await sndFonts();sndBg(g);let y=280;const si=q.esito==="sì";
 sndKick(g,"Il verdetto"+(q.tema?" · "+q.tema:""),y);y+=66;g.fillStyle="#B9C4CF";g.font="400 36px 'IBM Plex Sans'";g.fillText("Il "+sndMesi(q.day)+" vi abbiamo chiesto:",96,y);y+=64;
 g.font="600 64px 'IBM Plex Serif'";for(const ln of sndWrap(g,sndToks(String(q.titolo||q.sticker).split("*").join("")),888).slice(0,4)){sndLine(g,ln,96,y,"#EEF2F6","#EEF2F6");y+=74}
 y+=40;g.fillStyle="#EEF2F6";g.font="600 54px 'IBM Plex Sans'";g.fillText("È andata:",96,y+50);g.fillStyle="#E8B050";g.font="600 150px 'IBM Plex Serif'";g.fillText((si?(q.a||"Sì"):(q.b||"No")).toUpperCase(),380,y);y+=190;
 if(q.riga){g.font="400 34px 'IBM Plex Sans'";const L=sndWrap(g,sndToks(q.riga),820).slice(0,3);const h=40+L.length*48;g.fillStyle="#2a2412";g.strokeStyle="#6E5A26";g.lineWidth=2;g.beginPath();g.roundRect(96,y,888,h,22);g.fill();g.stroke();let yy=y+22;for(const ln of L){sndLine(g,ln,130,yy,"#EEF2F6","#EEF2F6");yy+=48}y+=h+40}
 const row=(lab,txt,ok)=>{g.fillStyle="#8fa0bd";g.font="500 26px 'IBM Plex Mono'";g.fillText(lab,96,y+8);g.fillStyle="#EEF2F6";g.font="400 38px 'IBM Plex Sans'";g.fillText(txt,330,y);if(ok!=null){g.fillStyle=ok?"#7FD1A0":"#E58A8A";g.font="600 38px 'IBM Plex Sans'";g.textAlign="right";g.fillText(ok?"✓ presa":"✗ mancata",984,y);g.textAlign="left"}y+=76};
 const n=q.num;if(n){const p=n.si;const said=p>50?"sì":p<50?"no":"";row("I LETTORI",(p>=50?p:100-p)+"% diceva "+(p>=50?(q.a||"sì"):(q.b||"no")).toLowerCase(),said?said===q.esito:null)}
 if(q.attesa){const said=q.attesa==="probabile"?"sì":q.attesa==="improbabile"?"no":"";row("L'AGENTE",said?"diceva "+(said==="sì"?(q.a||"sì"):(q.b||"no")).toLowerCase()+" ("+q.attesa+")":"non si sbilanciava (incerto)",said?said===q.esito:null)}
 sndCta(g)}
/* v61: la frase onesta sulla stima dell'agente: se l'esito era la sua ipotesi più probabile lo dice, se no dice chi dava avanti */
function scnFinal(v){const h=v.storico||[];return h.length?h[h.length-1].p:v.prob}
function scnLine(c){const V=c.voci.slice().sort((a,z)=>scnFinal(z)-scnFinal(a));const e=c.voci.find(v=>v.id===c.esito);const pe=scnFinal(e),top=V[0];
 if(top.id===e.id&&(V.length<2||scnFinal(V[1])<pe))return "La nostra stima lo dava come l'ipotesi più probabile: "+pe+"%.";
 if(top.id!==e.id&&scnFinal(top)===pe)return "La nostra stima era un testa a testa: "+pe+"% a "+pe+"%.";
 if(top.id===e.id)return "La nostra stima era un testa a testa: "+pe+"% a "+scnFinal(V[1])+"%.";
 return "La nostra stima dava avanti «"+top.breve+"», "+scnFinal(top)+"% contro "+pe+"%: è andata diversamente."}
/* il blocco «Com'è andata» di uno scenario chiuso: domanda, esito, grafico delle stime, frase onesta. Compatto quando sotto c'è la prossima scommessa */
function scnBlock(g,q,y,cp){const e=q.voci.find(v=>v.id===q.esito);const d0=(e.storico[0]||{}).d;
 sndKick(g,"Com'è andata"+(q.tema?" · "+q.tema:""),y);y+=cp?56:66;g.fillStyle="#B9C4CF";g.font="400 "+(cp?30:36)+"px 'IBM Plex Sans'";g.fillText(d0?"Dal "+sndMesi(d0)+" ci siamo chiesti:":"Ci siamo chiesti:",96,y);y+=cp?48:62;
 g.font="600 "+(cp?42:58)+"px 'IBM Plex Serif'";for(const ln of sndWrap(g,sndToks(q.domanda),888).slice(0,cp?2:4)){sndLine(g,ln,96,y,"#EEF2F6","#EEF2F6");y+=cp?50:68}
 y+=cp?18:36;g.fillStyle="#EEF2F6";g.font="600 "+(cp?36:44)+"px 'IBM Plex Sans'";g.fillText("È andata:",96,y+(cp?14:0));if(cp){g.fillStyle="#E8B050";g.font="600 60px 'IBM Plex Serif'";g.fillText(clip(e.breve,22),300,y);y+=84}else{y+=62;g.fillStyle="#E8B050";g.font="600 92px 'IBM Plex Serif'";for(const ln of sndWrap(g,sndToks(e.breve),888).slice(0,2)){sndLine(g,ln,96,y,"#E8B050","#E8B050");y+=100}}
 y+=cp?10:30;const X0=96,X1=860,Y0=y,H=cp?170:300;const D=[...new Set(q.voci.flatMap(v=>(v.storico||[]).map(p=>p.d)))].sort();const tx=d=>D.length<2?X0:X0+(X1-X0)*D.indexOf(d)/(D.length-1);const MX=Math.min(100,Math.max(30,Math.ceil((Math.max(...q.voci.flatMap(v=>(v.storico||[]).map(p=>p.p)))+10)/10)*10));const ty=p=>Y0+H-H*p/MX;
 g.strokeStyle="#27353F";g.lineWidth=2;[0,MX/2,MX].forEach(p=>{g.beginPath();g.moveTo(X0,ty(p));g.lineTo(X1,ty(p));g.stroke()});g.fillStyle="#6b7a8c";g.font="500 22px 'IBM Plex Mono'";g.fillText(Math.round(MX/2)+"%",X0,ty(MX/2)-30);g.fillText(MX+"%",X0,ty(MX)-30);
 const LB=[];
 const ord=q.voci.slice().sort((a,z)=>(a.id===q.esito)-(z.id===q.esito));
 for(const v of ord){const P=(v.storico||[]).filter(p=>D.includes(p.d));if(!P.length)continue;const ok=v.id===q.esito;g.strokeStyle=ok?"#E8B050":"#5d6b7d";g.lineWidth=ok?8:5;g.beginPath();P.forEach((p,i)=>{const x=tx(p.d),yy=ty(p.p);i?g.lineTo(x,yy):g.moveTo(x,yy)});g.stroke();
  const L=P[P.length-1];g.fillStyle=ok?"#E8B050":"#8fa0bd";g.beginPath();g.arc(tx(L.d),ty(L.p),ok?11:8,0,7);g.fill();LB.push({x:tx(L.d)+22,y:ty(L.p)-16,t:L.p+"%",ok})}
 /* etichette finali che non si sovrappongono: se sono troppo vicine si allontanano */
 LB.sort((a,z)=>a.y-z.y);for(let i=1;i<LB.length;i++)if(LB[i].x===LB[i-1].x&&LB[i].y-LB[i-1].y<34){LB[i-1].y-=17;LB[i].y=LB[i-1].y+34}
 for(const l of LB){g.fillStyle=l.ok?"#E8B050":"#8fa0bd";g.font=(l.ok?"600 ":"500 ")+"28px 'IBM Plex Sans'";g.fillText(l.t,l.x,l.y)}
 g.fillStyle="#6b7a8c";g.font="500 22px 'IBM Plex Mono'";if(D.length){g.fillText(sndMesi(D[0]).toUpperCase(),X0,Y0+H+16);g.textAlign="right";g.fillText(sndMesi(D[D.length-1]).toUpperCase(),X1,Y0+H+16);g.textAlign="left"}
 y=Y0+H+(cp?56:70);g.font="500 24px 'IBM Plex Mono'";let lx=96;for(const v of q.voci){const ok=v.id===q.esito;g.fillStyle=ok?"#E8B050":"#8fa0bd";g.fillRect(lx,y+10,26,6);lx+=36;const t=clip(v.breve,22);g.fillText(t,lx,y);lx+=g.measureText(t).width+36}
 y+=cp?50:62;g.font="400 "+(cp?30:34)+"px 'IBM Plex Sans'";for(const ln of sndWrap(g,sndToks(scnLine(q)),888).slice(0,3)){sndLine(g,ln,96,y,"#DCE3EA","#DCE3EA");y+=cp?42:48}
 const vt=q.voti;if(vt&&vt.tot>=5){const ix=q.voci.findIndex(v=>v.id===q.esito);const p=Math.round(100*((vt.c||{})[ix]||0)/vt.tot);g.fillStyle="#B9C4CF";g.fillText("I lettori: il "+p+"% aveva scelto questa ipotesi ("+vt.tot+" voti).",96,y+6);y+=48}
 return y}
async function sndDrawC(c,q){const g=c.getContext("2d");await sndFonts();sndBg(g);scnBlock(g,q,270,false);sndCta(g)}
/* la storia della domanda quando la domanda è la «prossima scommessa» di uno scenario appena chiuso: in alto com'è andata, sotto la nuova domanda con lo spazio per lo sticker */
async function sndDrawQS(c,q,sc){const g=c.getContext("2d");await sndFonts();sndBg(g);let y=scnBlock(g,sc,220,true);
 y+=26;g.strokeStyle="#6E5A26";g.lineWidth=2;g.beginPath();g.moveTo(96,y);g.lineTo(984,y);g.stroke();y+=36;
 sndKick(g,"E adesso? La prossima scommessa",y);y+=60;const toks=sndToks(q.titolo||q.sticker);let fs=64,L;for(;fs>=48;fs-=4){g.font="600 "+fs+"px 'IBM Plex Serif'";L=sndWrap(g,toks,888);if(L.length<=3)break}
 for(const ln of L){sndLine(g,ln,96,y,"#EEF2F6","#E8B050");y+=Math.round(fs*1.12)}
 g.textAlign="center";g.fillStyle="#86B4EA";g.font="500 24px 'IBM Plex Mono'";podSpaced(g,("IL "+sndMesi(q.scadenza||SND.day)+" vediamo chi ci ha preso").toUpperCase(),540,1800,4);g.textAlign="left"}
async function sndCanvas(id,fn,q,arg,name){const c=document.getElementById(id);if(!c)return;await fn(c,q,arg);const bl=await new Promise(r=>c.toBlob(r,"image/png"));SND_BLOB[id]=bl;const a=document.querySelector('[data-snd-dl="'+id+'"]');if(a){if(a.href&&a.href.startsWith("blob:"))URL.revokeObjectURL(a.href);a.href=URL.createObjectURL(bl);a.download=name}}
function sndCp(lab,v,show){return '<div class="sndc"><span class="sndl">'+lab+'</span><span class="sndv">'+esc(show||v)+'</span><button type="button" class="sm" data-snd-cp="'+esc(v)+'">Copia</button></div>'}
/* v60: «Oggi», la guida che si spunta: storie Instagram del mattino (podcast, verdetto, risultato di ieri, domanda), post di Instagram e TikTok. Le immagini si condividono direttamente su Instagram dal telefono. */
const OG_LINK="https://www.readgeopolitics.com/?utm_source=instagram&utm_campaign=",POD_LINK="https://www.readgeopolitics.com/ascolta.html?utm_source=ig_storia";
let OG_OPEN={},OG_POD=false;
function ogShareBtn(id,lab){return '<button type="button" class="ogsh" data-og-share="'+id+'">'+(lab||"Condividi su Instagram")+'</button><a class="sub ogdl" data-snd-dl="'+id+'" href="#">o scarica</a>'}
async function ogShare(id){const bl=id==="pod"?POD_BLOB:SND_BLOB[id];if(!bl){say("L'immagine non è ancora pronta: riprova tra un attimo.");return}
 const name=id==="pod"?document.getElementById("pd-dl").download:((document.querySelector('[data-snd-dl="'+id+'"]')||{}).download||id+".png");const file=new File([bl],name,{type:"image/png"});
 const k=/^sndc[0-9]$/.test(id)?(((SND&&SND.scenari)||[])[+id.slice(4)]?"scn-"+SND.scenari[+id.slice(4)].id:""):id==="pod"?"pod":id==="sndq"?"dom":/^sndv[0-9]$/.test(id)?(((SND&&SND.verdetti)||[])[+id.slice(4)]?"ver"+SND.verdetti[+id.slice(4)].day:""):"";
 if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file]});if(k)ogDone(k)}catch(e){}}else{const a=id==="pod"?document.getElementById("pd-dl"):document.querySelector('[data-snd-dl="'+id+'"]');if(a)a.click();if(k)ogDone(k)}}
/* condividere (o scaricare) una storia la segna come fatta, anche dalla scheda Podcast */
async function ogDone(k){if(!SND||(SND.todo||{})[k])return;const r=await api({action:"todo_set",k:k,v:true});if(r&&r.ok){SND=r.sond;OG_OPEN[k]=false;const nx=ogSteps().find(x=>!x.done);if(nx)OG_OPEN[nx.k]=true;sndRender(SND)}}
function ogTodayDraft(){const t=SND&&SND.day;return (D&&D.drafts||[]).find(x=>x.date===t&&x.status!=="scartata"&&x.format!=="spiegato")||null}
function ogSteps(){const s=SND||{},T=s.todo||{},St=[];const q=s.oggi,qi=s.ieri,n=qi&&qi.num&&qi.num.votanti!=null?qi.num:null;
 const oggi=s.day;const podOk=POD&&POD.date===oggi;
 St.push({k:"pod",ic:"🎧",t:"Storia del podcast",w:"dalle 7:50",done:!!T.pod,body:(!OG_POD?'<div class="sub">Preparo l&#39;immagine…</div>':!POD?'<div class="sub">Nessuna puntata.</div>':(podOk?'':'<div class="warn">La puntata di oggi non c&#39;è ancora: di solito arriva verso le 7:50.</div>')+'<div class="ogsr"><canvas class="ogth" id="ogpod" width="1080" height="1920"></canvas><div class="sndf">'+'<button type="button" class="ogsh" data-og-share="pod">Condividi su Instagram</button>'+sndCp("Link",POD_LINK,"readgeopolitics.com/ascolta")+sndCp("Testo","Ascolta il podcast")+'<div class="sub">Sticker link con la pagina «Ascolta». Versione e temi si cambiano nella scheda Podcast.</div></div></div>')});
 (s.scenari||[]).forEach((c,i)=>{if(q&&q.dopo_scenario===c.id)return;St.push({k:"scn-"+c.id,ic:"📊",t:"Com'è andata: "+(c.tema||""),w:"uno scenario si è chiuso",done:!!T["scn-"+c.id],body:'<div class="ogsr"><canvas class="ogth" id="sndc'+i+'" width="1080" height="1920"></canvas><div class="sndf">'+ogShareBtn("sndc"+i)+sndCp("Link",OG_LINK+"storia-scenario#vota","readgeopolitics.com · #vota")+sndCp("Testo","Le altre stime")+'<div class="sub">'+esc(scnLine(c))+' Oggi tra le domande non c&#39;è la «prossima scommessa» su questo tema: puoi sceglierla tra le altre proposte, se c&#39;è.</div></div></div>'})});
 (s.verdetti||[]).forEach((v,i)=>St.push({k:"ver"+v.day,ic:"⚖️",t:"Il verdetto: domanda del "+sndMesi(v.day),w:"subito dopo il podcast",done:!!T["ver"+v.day],body:'<div class="ogsr"><canvas class="ogth" id="sndv'+i+'" width="1080" height="1920"></canvas><div class="sndf">'+ogShareBtn("sndv"+i)+sndCp("Link",OG_LINK+"storia-verdetto#vota","readgeopolitics.com · #vota")+sndCp("Testo","Vota le altre")+'<div class="sub">È andata: <b>'+esc(v.esito==="sì"?(v.a||"Sì"):(v.b||"No"))+'</b>. Sticker link nello spazio in basso.'+(v.num?'':' Mancano i numeri del sondaggio di quel giorno: la riga dei lettori non c&#39;è.')+(v.fonte&&v.fonte.url?' <a href="'+esc(v.fonte.url)+'" target="_blank" rel="noopener">Fonte ›</a>':'')+'</div></div></div>'}));
 if(qi)St.push({k:"ieri",ic:"📊",t:"I numeri del sondaggio di ieri",w:"prima della domanda nuova",done:!!n,auto:true,body:'<div class="sub">Instagram › la storia di ieri › Attività: quante persone l&#39;hanno vista, quante hanno votato, la percentuale di «'+esc(qi.a||"Sì")+'». «'+esc(qi.sticker||"")+'»</div><div class="sndn"><label>Hanno visto<input type="number" inputmode="numeric" min="0" id="snv" value="'+(n?n.visti:"")+'"></label><label>Hanno votato<input type="number" inputmode="numeric" min="0" id="snt" value="'+(n?n.votanti:"")+'"></label><label>'+esc(qi.a||"Sì")+' (%)<input type="number" inputmode="numeric" min="0" max="100" id="sns" value="'+(n?n.si:"")+'"></label><button type="button" class="g" id="snsv">'+(n?"Aggiorna":"Salva")+'</button></div>'
  +(n?'<div class="ogsr" style="margin-top:10px"><canvas class="ogth" id="sndr" width="1080" height="1920"></canvas><div class="sndf"><div class="sub"><b>Facoltativa</b>: la storia del risultato, da mettere prima della domanda.</div>'+ogShareBtn("sndr")+sndCp("Link",OG_LINK+"storia-risultato#vota","readgeopolitics.com · #vota")+sndCp("Testo","Vota le altre")+'</div></div>':'<div class="sub">Con i numeri, la storia della domanda mostra in alto com&#39;è andata ieri.</div>')});
 const qsc0=q&&q.dopo_scenario&&(s.scenari||[]).find(c=>c.id===q.dopo_scenario);
 St.push({k:"dom",ic:qsc0?"🎯":"🗳️",t:qsc0?"Com'è andata e la prossima scommessa":"La domanda di oggi",w:"subito dopo, con lo sticker sondaggio",done:!!T.dom,body:!q?'<div class="sub">Arriva con il briefing delle 06:45.</div>':'<div class="ogsr"><canvas class="ogth" id="sndq" width="1080" height="1920"></canvas><div class="sndf">'+ogShareBtn("sndq")+sndCp("Sticker",q.sticker||"")+'<div class="sndab">'+sndCp("Risposta 1",q.a||"Sì")+sndCp("Risposta 2",q.b||"No")+'</div><div class="sub">'+(q.perche?'Perché questa: '+esc(q.perche)+' ':'')+'Si verifica entro il '+esc(sndMesi(q.scadenza||oggi))+(q.fonte&&q.fonte.url?' · <a href="'+esc(q.fonte.url)+'" target="_blank" rel="noopener">'+esc(q.fonte.nome||"fonte")+'</a>':'')+'.'+(qi&&!n?' <b>Prima inserisci i numeri di ieri</b>, così in alto compare il risultato.':'')+'</div></div></div>'+ogAlt(s)});
 const DR=(D&&D.drafts||[]).filter(x=>x.date===oggi&&x.status!=="scartata").sort((a,z)=>(a.format==="spiegato")-(z.format==="spiegato"));
 if(!DR.length)St.push({k:"ig",ic:"📸",t:"Il post di Instagram",w:"",done:false,auto:true,body:'<div class="sub">La bozza di oggi non c&#39;è ancora.</div>'});
 const addD=x=>{const tm=x.publish_at?new Date(x.publish_at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}):"";const sp=x.format==="spiegato";
  St.push({k:"ig-"+x.id,ic:sp?"🎬":"📸",t:sp?"Il video spiegato della svolta":(x.format==="daily"||!x.format?"Il post di Instagram":"Instagram · "+clip(dTitle(x),40)),w:x.status==="pubblicata"?"pubblicato":x.status==="bozza"&&x.mode==="auto"&&tm?"esce da solo alle "+tm:"da approvare",done:x.status==="pubblicata",auto:true,body:'<div class="sub">'+esc(dTitle(x))+'</div><div class="row"><button type="button" class="g" data-og-go="'+esc(x.id)+'">Apri la bozza ›</button></div>'});
  if(ttOk(x)){const t=(D.tt||{})[x.id];St.push({k:"tt-"+x.id,ic:"🎵",t:"TikTok"+(sp?" · spiegato":""),w:x.type==="reel"?"a mano: suono e didascalia":"dopo Instagram",done:!!(t&&t.status==="pubblicato"),auto:true,body:'<div class="sub">'+(t?esc(t.status==="nella_casella"?"È nella casella di TikTok: scegli il suono, incolla la didascalia e pubblica.":t.status==="errore"?"Non inviato: riprova dalla bozza.":t.status):"Si invia dopo Instagram.")+'</div>'+(x.tt_cap?sndCp("Didascalia",x.tt_cap,clip(x.tt_cap,60)):'')+'<div class="row"><button type="button" class="g" data-og-go="'+esc(x.id)+'">Apri la bozza ›</button>'+(t&&t.status==="nella_casella"?'<button type="button" class="sm ogttm" data-id="'+esc(x.id)+'">Fatto</button>':'')+'</div>'})}};
 DR.filter(x=>x.format!=="spiegato").forEach(addD);
 (D&&D.svolte||[]).filter(v=>v.date===oggi).forEach(v=>St.push({k:"sv-"+v.id,ic:"⚡",t:"Svolta: "+clip(v.titolo||"",60),w:(v.ora?"alle "+v.ora+" · ":"")+(v.stato==="proposta"?"da approvare per Telegram":v.stato==="approvata"?"uscita sul canale":"scartata"),done:v.stato!=="proposta",auto:true,body:'<div class="sub">Il messaggio per il canale si rilegge e si approva nel riquadro «Svolte da approvare», in cima al pannello.'+(v.req_id?' Se è pronto, il video spiegato compare qui sopra come bozza.':'')+'</div><div class="row"><button type="button" class="g" data-og-sv="1">Vai alla svolta ›</button></div>'}));
 DR.filter(x=>x.format==="spiegato").forEach(addD);
 return St}
function ogAlt(s){const L=(s.scelte||[]).filter(x=>x.n!==s.scelta);if(!L.length)return '<div class="sub">Oggi l&#39;agente ha proposto una sola domanda.</div>';
 return '<details class="ogalt"'+(OG_OPEN.alt?' open':'')+'><summary>Non ti convince? Altre '+L.length+' proposte ›</summary>'+L.map(x=>'<div class="ogal"><div class="sndl">'+esc(x.tema||"")+'</div><b>'+esc(x.sticker)+'</b>'+(x.perche?'<div class="sub">'+esc(x.perche)+'</div>':'')+'<button type="button" class="g" data-og-pick="'+x.n+'">Usa questa</button></div>').join("")+'<div class="sub">Quella che scegli è l&#39;unica che conta: risultato e verdetto seguono lei. '+((s.todo||{}).dom?'Hai già segnato la storia come pubblicata: se cambi, ripubblica quella nuova.':'')+'</div></details>'}
function clip(s,n){s=String(s||"");return s.length>n?s.slice(0,n-1)+"…":s}
function ogRender(){const el=document.getElementById("og");if(!el)return;const s=SND;if(!s){el.innerHTML='<div class="card sub">Carico…</div>';return}
 const St=ogSteps();const nd=St.filter(x=>x.done).length;const b=document.querySelector('.tab[data-t="og"]');if(b)b.innerHTML='Oggi <span class="ogn'+(nd===St.length?' ok':'')+'">'+nd+'/'+St.length+'</span>';
 let h='<div class="card ogh"><b>Le cose di oggi</b><div class="sub">Nell&#39;ordine in cui escono. Le storie si condividono direttamente su Instagram: «Condividi» › Instagram › Storia.</div><div class="ogbar"><i style="width:'+Math.round(100*nd/Math.max(1,St.length))+'%"></i></div></div>';
 St.forEach((x,i)=>{const op=OG_OPEN[x.k]!=null?OG_OPEN[x.k]:!x.done&&St.findIndex(y=>!y.done)===i;
  h+='<div class="card ogs'+(x.done?' done':'')+(op?' open':'')+'" data-og="'+x.k+'"><div class="ogt"><button type="button" class="ogc" data-og-ck="'+x.k+'"'+(x.auto?' data-auto="1"':'')+' aria-label="Fatto">'+(x.done?'✓':i+1)+'</button><div class="ogtt" data-og-tg="'+x.k+'"><b>'+x.ic+' '+esc(x.t)+'</b><div class="sub">'+esc(x.w)+'</div></div><span class="chev">▾</span></div><div class="ogb">'+x.body+'</div></div>'});
 const W=s.sett.filter(x=>x.n&&x.n.visti);const pr=x=>x.n&&x.n.visti?Math.round(100*x.n.votanti/x.n.visti):null;
 h+='<div class="card sndw"><div class="lab" style="display:flex;justify-content:space-between"><span>La domanda funziona?</span><span>votanti su chi ha visto</span></div><div class="sndb">'+s.sett.map(x=>{const p=pr(x);const d=new Date(x.d+"T12:00:00");return '<div><i style="height:'+(p==null?3:Math.max(4,Math.min(60,p*1.2)))+'px'+(p==null?';background:#27353F':'')+'"></i>'+(p==null?'—':p+'%')+'<br>'+["dom","lun","mar","mer","gio","ven","sab"][d.getDay()]+'</div>'}).join("")+'</div>';
 const avg=W.length?Math.round(100*W.reduce((a,x)=>a+x.n.votanti,0)/W.reduce((a,x)=>a+x.n.visti,0)):null;
 h+='<div class="sub">'+(avg==null?'Dopo una settimana di numeri decidiamo: se vota almeno 1 su 4 di chi guarda, si passa ai punti personali.':'Media: '+avg+'% su '+W.length+(W.length===1?' giorno':' giorni')+'. La soglia: 25%.')+'</div></div>';
 el.innerHTML=h;ogDraw()}
async function ogDraw(){const s=SND;if(!s)return;const q=s.oggi,qi=s.ieri,n=qi&&qi.num&&qi.num.votanti!=null?qi.num:null;
 if(OG_POD&&POD_BLOB){const c=document.getElementById("ogpod");if(c){const im=new Image();im.onload=()=>{c.getContext("2d").drawImage(im,0,0,1080,1920);URL.revokeObjectURL(im.src)};im.src=URL.createObjectURL(POD_BLOB)}}
 const qsc=q&&q.dopo_scenario&&(s.scenari||[]).find(c=>c.id===q.dopo_scenario);
 if(qsc)sndCanvas("sndq",sndDrawQS,q,qsc,"storia_scommessa_"+s.day+".png");else if(q)sndCanvas("sndq",sndDrawQ,q,n?{t:qi.sticker||"",r:(qi.a||"Sì")+" "+n.si+"% · "+(qi.b||"No")+" "+(100-n.si)+"% · "+n.votanti+" risposte"}:null,"storia_domanda_"+s.day+".png");
 if(qi&&n)sndCanvas("sndr",sndDrawR,qi,null,"storia_risultato_"+qi.day+".png");
 (s.verdetti||[]).forEach((v,i)=>sndCanvas("sndv"+i,sndDrawV,v,null,"storia_verdetto_"+v.day+".png"));
 (s.scenari||[]).forEach((c,i)=>sndCanvas("sndc"+i,sndDrawC,c,null,"storia_scenario_"+c.id+".png"))}
async function ogPod(){if(OG_POD)return;if(!POD_GEN){POD_GEN=true;await podLoad()}else{let k=0;while(!POD_BLOB&&k++<40)await new Promise(r=>setTimeout(r,250))}OG_POD=true;ogRender()}
function sndRender(s){SND=s;if(TAB==="og"){ogRender();ogPod()}else{const St=s?ogSteps():[];const nd=St.filter(x=>x.done).length;const b=document.querySelector('.tab[data-t="og"]');if(b&&s)b.innerHTML='Oggi <span class="ogn'+(nd===St.length?' ok':'')+'">'+nd+'/'+St.length+'</span>'}}
document.getElementById("og").addEventListener("click",async e=>{const cp=e.target.closest("[data-snd-cp]");if(cp){let ok=false;try{await navigator.clipboard.writeText(cp.dataset.sndCp);ok=true}catch(err){}cp.textContent=ok?"Copiato ✓":"Non riesco";setTimeout(()=>{cp.textContent="Copia"},1600);return}
 const sh=e.target.closest("[data-og-share]");if(sh){ogShare(sh.dataset.ogShare);return}
 const tg=e.target.closest("[data-og-tg]");if(tg){const c=tg.closest(".ogs");OG_OPEN[tg.dataset.ogTg]=!c.classList.contains("open");c.classList.toggle("open");return}
 const ck=e.target.closest("[data-og-ck]");if(ck){const k=ck.dataset.ogCk;if(ck.dataset.auto){const c=ck.closest(".ogs");OG_OPEN[k]=true;c.classList.add("open");return}const v=!(SND.todo||{})[k];ck.disabled=true;const r=await api({action:"todo_set",k:k,v:v});if(r&&r.ok){SND=r.sond;OG_OPEN[k]=!v;const nx=ogSteps().find(x=>!x.done);if(v&&nx)OG_OPEN[nx.k]=true;ogRender()}else ck.disabled=false;return}
 if(e.target.closest("[data-og-sv]")){const b=document.getElementById("svb");if(b)b.open=true;if(b)b.scrollIntoView({behavior:"smooth",block:"start"});return}
 const go=e.target.closest("[data-og-go]");if(go){setTab("list");setTimeout(()=>{const c=document.querySelector('.dc[data-id="'+go.dataset.ogGo+'"]');if(c)c.scrollIntoView({behavior:"smooth",block:"start"})},120);return}
 const tm=e.target.closest(".ogttm");if(tm){const c=document.querySelector('.dc[data-id="'+tm.dataset.id+'"] .ttm');if(c)c.click();else setTab("list");return}
 const pk=e.target.closest("[data-og-pick]");if(pk){pk.disabled=true;const r=await api({action:"sond_pick",n:+pk.dataset.ogPick});if(r&&r.ok){SND=r.sond;OG_OPEN.alt=false;OG_OPEN.dom=true;ogRender()}else{pk.disabled=false;say("Non riesco a cambiare: "+((r&&r.error)||""))}return}
 if(e.target.id==="snsv"){const v=document.getElementById("snv").value,t=document.getElementById("snt").value,s=document.getElementById("sns").value;e.target.disabled=true;const r=await api({action:"sond_set",day:SND.ieri.day,visti:v,votanti:t,si:s});if(r&&r.ok){SND=r.sond;OG_OPEN.ieri=false;OG_OPEN.dom=true;ogRender()}else{e.target.disabled=false;say("Controlla i numeri: "+((r&&r.error)||""))}}});
document.addEventListener("touchend",e=>{const b=document.getElementById("lb");if(tx===null||!b.classList.contains("on"))return;const d=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(d)>50)lbMove(d>0?-1:1)});
const api=async(o)=>{const r=await fetch("/ig/api",{method:"POST",body:JSON.stringify(Object.assign({k:K},o))});if(r.status===401){location.href="/ig/panel";return {ok:false,error:"unauthorized"}}return r.json()};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function when(i){try{return new Date(i).toLocaleString("it-IT",{dateStyle:"short",timeStyle:"short"})}catch(e){return i}}
let SV_TOG=false;document.addEventListener("click",e=>{if(e.target.closest("#svb>summary"))SV_TOG=true},true); /* aperto o chiuso a mano: si rispetta fino al prossimo caricamento */
function svRender(d){const box=document.getElementById("svb");if(!box)return;const L=(d.svolte||[]).filter(x=>x.stato!=="scartata"||x.date===d.today),G=d.giri||[];
 if(!L.length&&!G.length){box.hidden=true;return}box.hidden=false;const pend=L.filter(x=>x.stato==="proposta").length;const n=document.getElementById("svn");n.hidden=!pend;n.textContent=pend+(pend===1?" da approvare":" da approvare");
 box.classList.toggle("pend",!!pend);if(pend){if(!SV_TOG)box.open=true}else if(!SV_TOG)box.open=false;
 {const T=L.filter(x=>x.date===d.today),ag=G.reduce((a,x)=>a+(x.aggiornamenti||0),0);document.getElementById("svsum").textContent=pend?"":(T.length?T.length+(T.length===1?" svolta oggi":" svolte oggi"):"nessuna oggi")+(G.length?" · "+G.length+(G.length===1?" giro":" giri")+" · "+ag+(ag===1?" aggiornamento":" aggiornamenti"):"")}
 document.getElementById("svl").innerHTML=L.length?L.map(x=>{const rq=x.req_id?(d.requests||[]).find(r=>r.id===x.req_id):null;const off=x.stato==="scartata";
  let h='<div class="sv'+(off?" off":"")+'" data-id="'+esc(x.id)+'"><div class="m"><b>SVOLTA</b>'+(x.date===d.today?"oggi":"ieri")+" alle "+esc(x.ora||"")+(x.filone_titolo?" · "+esc(x.filone_titolo):"")+'</div><div class="t">'+esc(x.titolo)+"</div>"+(x.fonti&&x.fonti.length?'<div class="m">Fonti lette: '+esc(x.fonti.join(" · "))+"</div>":"");
  if(x.tg_msg)h+='<div class="m ok">Uscito sul canale ✓ '+when(x.tg_at)+"</div>";
  else if(off)h+='<div class="m">Scartata: resta come aggiornamento sul sito.</div>';
  else h+='<div class="m" style="margin-top:8px">Messaggio per il canale Telegram (modificabile)</div><textarea class="svt" rows="5" maxlength="900">'+esc(x.tg_testo)+'</textarea><div class="svcn"><span class="svc">'+String(x.tg_testo||"").length+'</span>/900</div><div class="row"><button class="svok">Approva Telegram</button><button class="r svx">Scarta</button></div>';
  if(x.req_id)h+='<div class="m" style="margin-top:8px"><b>SPIEGATO</b>'+(rq?(rq.stato==="pronta"?'pronto · <a href="#" class="svd" data-d="'+esc(rq.draft_id||"")+'">apri la bozza ›</a>':rq.stato==="errore"||rq.stato==="fallita"?"non riuscito"+(rq.esito?": "+esc(rq.esito):""):"in preparazione"):"richiesta inviata")+"</div>";
  else if(x.req_err)h+='<div class="m">Spiegato non richiesto: '+esc(x.req_err)+"</div>";
  if(x.avviso&&x.avviso!=="inviato"&&!x.tg_msg&&!off)h+='<div class="m">Avviso privato: '+esc(x.avviso)+"</div>";
  return h+"</div>"}).join(""):'<div class="sub">Nessuna svolta oggi.</div>';
 const g=document.getElementById("svg");g.hidden=!G.length;g.innerHTML='<span class="lab">Giri di oggi</span>'+G.map(x=>"<div>"+esc(x.ora)+" · "+(x.aggiornamenti?x.aggiornamenti+(x.aggiornamenti===1?" aggiornamento":" aggiornamenti"):"nessun aggiornamento")+", "+(x.svolte?x.svolte+(x.svolte===1?" svolta":" svolte"):"nessuna svolta")+"</div>").join("");
 box.querySelectorAll(".sv").forEach(c=>{const id=c.dataset.id;const ta=c.querySelector(".svt");if(ta)ta.oninput=()=>{c.querySelector(".svc").textContent=ta.value.length};
  const ok=c.querySelector(".svok");if(ok)ok.onclick=async()=>{if(!await ask("Pubblicare questo messaggio sul canale Telegram?"))return;ok.disabled=true;ok.textContent="Invio…";const r=await api({action:"sv_tg",id,testo:ta.value});if(!r.ok){say("Errore: "+(r.detail||r.error));ok.disabled=false;ok.textContent="Approva Telegram";return}load()};
  const x=c.querySelector(".svx");if(x)x.onclick=async()=>{if(!await ask("Scartare la svolta? L&#39;aggiornamento resta sul sito, ma il messaggio non esce sul canale."))return;await api({action:"sv_discard",id});load()};
  const dl=c.querySelector(".svd");if(dl)dl.onclick=ev=>{ev.preventDefault();setTab("list");const t=document.querySelector('.dc[data-id="'+dl.dataset.d+'"]');if(t)t.scrollIntoView({behavior:"smooth"})}});
 if(location.hash==="#svolte"&&!SV_SCR){SV_SCR=true;box.open=true;box.scrollIntoView({behavior:"smooth"})}}
let SV_SCR=false;
function tgPv(d){const S=(d.telegram&&d.telegram.settings)||{};const on=!!S.priv_chat;document.getElementById("tgpv").textContent=on?"collegato"+(S.priv_nome?" a "+S.priv_nome:"")+": qui arrivano gli avvisi delle svolte":"non collegato: gli avvisi delle svolte non ti arrivano";
 document.getElementById("tgpvc").textContent=on?"Ricollega":"Collega la mia chat";document.getElementById("tgpvt").hidden=!on;document.getElementById("tgpvx").hidden=!on;document.getElementById("tgprr").checked=!!S.priv_riepilogo}
document.getElementById("tgpvc").onclick=async()=>{const r=await api({action:"tg_priv_code"});if(!r.ok){say("Errore: "+(r.detail||r.error));return}window.open(r.link,"_blank");document.getElementById("tgpv").textContent="Nel bot premi Avvia, poi torna qui e premi «Ho premuto Avvia».";document.getElementById("tgpvk").hidden=false};
document.getElementById("tgpvk").onclick=async e=>{e.target.disabled=true;const r=await api({action:"tg_priv_check"});e.target.disabled=false;if(!r.ok){say(r.detail||r.error||"Non riuscito");return}e.target.hidden=true;D.telegram=r.telegram;tgPv(D)};
document.getElementById("tgpvt").onclick=async()=>{const r=await api({action:"tg_priv_test"});say(r.ok?"Messaggio di prova inviato.":"Errore: "+(r.detail||r.error))};
document.getElementById("tgpvx").onclick=async()=>{if(!await ask("Scollegare la chat privata? Gli avvisi delle svolte non ti arriveranno più."))return;const r=await api({action:"tg_priv_set",off:true});if(r.ok){D.telegram=r.telegram;tgPv(D)}};
document.getElementById("tgprr").onchange=async e=>{const r=await api({action:"tg_priv_set",riepilogo:e.target.checked});if(r.ok){D.telegram=r.telegram}};
async function load(){
 const d=await api({action:"list"});
 if(!d.ok){document.getElementById("acc").textContent="Errore: "+JSON.stringify(d);return}
 {const T=d.tiktok||{};document.getElementById("tts").textContent=!T.configurato?"chiavi TikTok mancanti nel Worker":T.collegato?((T.username?"@"+T.username:T.nickname||"collegato")+(T.scaduto?" · collegamento scaduto, ricollega":"")+" · "+(T.settings&&T.settings.mode==="diretto"?"pubblicazione diretta":"bozze nella casella")):"non collegato";
 document.getElementById("ttcon").querySelector("button").textContent=T.collegato?"Ricollega TikTok":"Collega TikTok";
 if(T.settings){document.getElementById("ttmode").value=T.settings.mode;document.getElementById("ttauto").checked=!!T.settings.auto}
 document.getElementById("ttvi").textContent=T.verifica?("File attivi: "+T.verifica+" (rispondono in ogni cartella)"):"Nessun file di verifica salvato";}
 {const H=d.threads||{};document.getElementById("ths").textContent=!H.configurato?"chiavi Threads mancanti nel Worker":H.collegato?((H.username?"@"+H.username:"collegato")+(H.scaduto?" · collegamento scaduto, ricollega":(H.giorni!=null?" · valido ancora "+H.giorni+" giorni":""))):"non collegato";
 document.getElementById("thcon").querySelector("button").textContent=H.collegato?"Ricollega Threads":"Collega Threads";
 if(H.settings){document.getElementById("thauto").checked=!!H.settings.auto;document.getElementById("thdom").checked=H.settings.domanda!==false;document.getElementById("thtopic").value=H.settings.topic||""}}
 document.getElementById("acc").textContent=d.account?("@"+d.account.username+" · token valido ancora "+d.account.days_left+" giorni"):"Instagram non collegato";
 document.getElementById("pause").checked=d.settings.paused;
 const f=d.settings.formats.daily;document.getElementById("mode").value=f.mode;document.getElementById("time").value=f.time;
 D=d;chUpd(d);cnlRender(d.canali);sndRender(d.sond);svRender(d);tgPv(d);renderWeek();renderReq();
 const L=document.getElementById("list");
 if(!d.drafts.length){L.innerHTML='<div class="card sub">Nessuna bozza ancora. La prima arriva dopo la prossima esecuzione del task.</div>';return}
 const cardOf=x=>{
  const open=x.status==="bozza"||x.status==="errore";const m=menuHtml(x);
  const tm=x.publish_at?new Date(x.publish_at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}):"";
  const pl=x.status==="bozza"?(x.mode==="auto"?"ESCE ALLE "+tm:"DA APPROVARE"):(STL[x.status]||x.status.toUpperCase());
  let pri="";if(open)pri='<button class="btn main pub">Pubblica su Instagram</button>';else if(x.status==="in_elaborazione")pri='<button class="btn main fin">Controlla e pubblica</button>';else if(x.status==="scartata")pri='<button class="btn res">Ripristina</button>';
  const rows=igRow(x)+ttRow(x)+thRow(x)+tgRow(x);
  return '<div class="card dc" data-id="'+x.id+'"><div class="dh"><div style="min-width:0"><b>'+esc(dTitle(x))+'</b><div class="sub">'+dSub(x)+'</div></div><span class="pill p-'+x.status+'">'+esc(pl)+'</span></div>'
  +stripHtml(x)
  +((pri||m)?'<div class="pri">'+(pri||'<span style="flex:1"></span>')+(m?'<button class="btn more mo" type="button" aria-label="Altre azioni">⋯</button>':'')+'</div>':'')
  +(m?'<div class="menu" hidden>'+m+'</div>':'')
  +(open?capsHtml(x):'<details class="capd"><summary class="sub">Didascalie</summary>'+capsHtml(x)+'</details>')
  +(rows?'<div class="dist"><div class="lab">'+(x.status==="pubblicata"?"Canali":"Dopo Instagram")+'</div>'+rows+'</div>':'')
  +(x.error?'<div class="err">'+esc(x.error)+'</div>':'')+'</div>'};
 const isNew=x=>x.status==="bozza"||x.status==="errore"||x.status==="in_elaborazione"||x.status==="in_pubblicazione"||String(x.date||"")>=String(d.today||"")||!!EDIT[x.id];
 const NW=d.drafts.filter(isNew),OL=d.drafts.filter(x=>!isNew(x));
 VPRE=0;let h=NW.length?NW.map(cardOf).join(""):'<div class="card sub">Niente da approvare: le bozze di oggi non sono ancora arrivate.</div>';
 if(OL.length){const MS=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  const wk=s=>{const x=new Date(s+"T12:00:00Z");const g=(x.getUTCDay()+6)%7;const a=new Date(x.getTime()-g*864e5),b=new Date(a.getTime()+6*864e5);return {k:a.toISOString().slice(0,10),l:a.getUTCDate()+(a.getUTCMonth()!==b.getUTCMonth()?" "+MS[a.getUTCMonth()].slice(0,3):"")+"–"+b.getUTCDate()+" "+MS[b.getUTCMonth()].slice(0,3)}};
  const MO={};OL.forEach(x=>{const s=String(x.date||"").slice(0,10);if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s))return;const m=s.slice(0,7),w=wk(s);(MO[m]=MO[m]||{});(MO[m][w.k]=MO[m][w.k]||{l:w.l,it:[]}).it.push(x)});
  h+='<div class="lab" style="margin:18px 2px 8px">Archivio · '+OL.length+' contenuti</div>';
  Object.keys(MO).sort().reverse().forEach((m,mi)=>{const W=MO[m],n=Object.values(W).reduce((a,w)=>a+w.it.length,0);const mo=OPENG[m]!=null?OPENG[m]:mi===0;
   h+='<details class="card arc" data-g="'+m+'"'+(mo?' open':'')+'><summary><b>'+MS[+m.slice(5)-1].replace(/^./,c=>c.toUpperCase())+' '+m.slice(0,4)+'</b><span class="sub">'+n+'</span><span class="chev">▾</span></summary>';
   Object.keys(W).sort().reverse().forEach(k=>{const w=W[k];h+='<details class="arw" data-g="'+k+'"'+(OPENG[k]?' open':'')+'><summary><span>Settimana '+w.l+'</span><span class="sub">'+w.it.length+'</span><span class="chev">▾</span></summary>'+w.it.map(arcRow).join("")+'</details>'});
   h+='</details>'})}
 L.innerHTML=h;
 L.querySelectorAll("details[data-g]").forEach(e=>e.addEventListener("toggle",()=>{OPENG[e.dataset.g]=e.open}));
 L.querySelectorAll(".orow").forEach(r=>{const id=r.dataset.oid;const X=d.drafts.find(z=>z.id===id);const bd=r.querySelector(".obody");
  const show=()=>{if(!bd.firstChild){bd.innerHTML=cardOf(X);const c=bd.querySelector(".card[data-id]");if(c)wire(c)}bd.hidden=false;r.classList.add("on")};
  r.querySelector(".ohd").onclick=()=>{if(bd.hidden){OPENC[id]=1;show()}else{delete OPENC[id];bd.hidden=true;r.classList.remove("on")}};
  if(OPENC[id])show()});
 L.querySelectorAll(":scope>.card[data-id]").forEach(c=>wire(c));
 function wire(c){const id=c.dataset.id;const q=s=>c.querySelector(s);
  if(q(".mo"))q(".mo").onclick=()=>{const mn=q(".menu");mn.hidden=!mn.hidden};
  c.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{c.querySelectorAll(".seg button").forEach(z=>z.classList.toggle("on",z===b));c.querySelectorAll(".cp").forEach(z=>{z.hidden=z.dataset.cp!==b.dataset.cp})});
  const autosave=(sel,action)=>{const ta=q(sel);if(!ta||ta.readOnly)return;const sv=ta.parentNode.querySelector(".svm");ta.oninput=()=>{if(sv)sv.textContent="modifiche non salvate…";const n=ta.parentNode.querySelector(".thn");if(n)n.textContent=ta.value.length+"/500"};ta.onchange=async()=>{const r=await api({action,id,caption:ta.value});if(sv)sv.textContent=r.ok?"salvata ✓":"errore: "+(r.detail||r.error)}};
  if(q(".tgs"))q(".tgs").onclick=async e=>{if(!await ask("Inviare subito sul canale Telegram?"))return;e.target.disabled=true;e.target.textContent="Invio…";const r=await api({action:"tg_send",id});if(!r.ok)say("Errore: "+(r.detail||r.error));else if(r.tg&&r.tg.status==="errore")say(r.tg.error);load()};
  autosave(".cap","caption");autosave(".ttcap","tt_caption");autosave(".thcap","th_caption");
  if(q(".pub"))q(".pub").onclick=async e=>{if(!await ask("Pubblicare ora su Instagram?"))return;e.target.disabled=true;e.target.textContent="Pubblico…";
    if(q(".cap"))await api({action:"caption",id,caption:q(".cap").value});const r=await api({action:"publish",id});if(!r.ok&&r.draft&&r.draft.error)say("Errore: "+r.draft.error);load()};
  const X=d.drafts.find(z=>z.id===id);
  if(q(".ed"))q(".ed").onclick=()=>{EDIT[id]=X.image_urls.slice();load()};
  if(EDIT[id]){
   const L=EDIT[id];
   c.querySelectorAll(".up").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>0){[L[i-1],L[i]]=[L[i],L[i-1]];load()}});
   c.querySelectorAll(".dn").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i<L.length-1){[L[i+1],L[i]]=[L[i],L[i+1]];load()}});
   c.querySelectorAll(".rm").forEach(b=>b.onclick=()=>{if(L.length<=2){say("Servono almeno 2 immagini.");return}L.splice(+b.dataset.i,1);load()});
   if(q(".cn"))q(".cn").onclick=()=>{delete EDIT[id];load()};
   if(q(".rs"))q(".rs").onclick=()=>{EDIT[id]=(X.original_urls||X.image_urls).slice();load()};
   if(q(".file"))q(".file").onchange=async e=>{const fs=[...e.target.files];for(const f of fs){if(L.length>=10){say("Massimo 10 immagini.");break}try{const r=await api({action:"addimage",id,data_base64:await toJpeg(f)});if(r.ok)L.push(r.url);else say("Errore: "+JSON.stringify(r))}catch(err){say("Immagine non caricata: "+err)}}load()};
   if(q(".sv"))q(".sv").onclick=async e=>{e.target.disabled=true;e.target.textContent="Salvo…";const r=await api({action:"images",id,urls:L});if(!r.ok){say("Errore: "+JSON.stringify(r))}else delete EDIT[id];load()};
  }
  if(q(".fin"))q(".fin").onclick=async e=>{e.target.disabled=true;e.target.textContent="Controllo…";const r=await api({action:"finish",id});if(!r.ok&&r.draft&&r.draft.error)say("Errore: "+r.draft.error);load()};
  if(q(".savecap"))q(".savecap").onclick=async()=>{await api({action:"caption",id,caption:q(".cap").value});load()};
  if(q(".dis"))q(".dis").onclick=async()=>{if(await ask("Scartare questa bozza?")){await api({action:"discard",id});load()}};
  if(q(".rst"))q(".rst").onclick=async()=>{if(await ask("Rimettere questa bozza in stato bozza? Fallo solo se la pubblicazione è bloccata e hai controllato su Instagram che il post NON sia già uscito: altrimenti rischi di pubblicarlo due volte.")){const r=await api({action:"draft_reset",id});if(!r.ok)say("Reset non riuscito: "+(r.error||""));load()}};
  if(q(".tts"))q(".tts").onclick=async e=>{e.target.disabled=true;e.target.textContent="Invio…";if(q(".ttcap"))await api({action:"tt_caption",id,caption:q(".ttcap").value});const r=await api({action:"tt_send",id,force:true});if(!r.ok)say("Errore: "+(r.detail||r.error));else if(r.tt&&r.tt.status==="errore")say(r.tt.error);load()};
  if(q(".ttsv"))q(".ttsv").onclick=async e=>{e.target.disabled=true;const r=await api({action:"tt_caption",id,caption:q(".ttcap").value});if(!r.ok)say("Errore: "+(r.detail||r.error));load()};
  if(q(".ttc"))q(".ttc").onclick=async e=>{const X=D.drafts.find(z=>z.id===id);const v=q(".ttcap")?q(".ttcap").value:((X&&X.tt_cap)||"");try{await navigator.clipboard.writeText(v);e.target.textContent="Copiata ✓"}catch(err){ask("Copia la didascalia:",v)}setTimeout(()=>{e.target.textContent="Copia didascalia"},1800)};
  if(q(".ttm"))q(".ttm").onclick=async e=>{const l=await ask("Link del post su TikTok (facoltativo: in TikTok tocca Condividi, poi Copia link):","");if(l===null)return;e.target.disabled=true;await api({action:"tt_mark",id,link:l});load()};
  if(q(".ttl"))q(".ttl").onclick=async e=>{const l=await ask("Link del post su TikTok (in TikTok tocca Condividi, poi Copia link):","");if(!l)return;await api({action:"tt_mark",id,link:l});load()};
  if(q(".ttk"))q(".ttk").onclick=async e=>{e.target.disabled=true;await api({action:"tt_check",id});load()};
  if(q(".ttf"))q(".ttf").onclick=async e=>{if(!await ask("Reinviare? Il contenuto precedente resta comunque nella casella di TikTok finché non lo elimini dall'app."))return;e.target.disabled=true;const r=await api({action:"tt_send",id,force:true});if(!r.ok)say("Errore: "+(r.detail||r.error));load()};
  if(q(".thsd"))q(".thsd").onclick=async e=>{if(!await ask("Pubblicare subito su Threads? Su Threads esce davvero, non come bozza."))return;e.target.disabled=true;e.target.textContent="Pubblico…";if(q(".thcap"))await api({action:"th_caption",id,caption:q(".thcap").value});const r=await api({action:"th_send",id,force:true});if(!r.ok)say("Errore: "+(r.detail||r.error));else if(r.th&&r.th.status==="errore")say(r.th.error);load()};
  if(q(".thsv"))q(".thsv").onclick=async e=>{e.target.disabled=true;const r=await api({action:"th_caption",id,caption:q(".thcap").value});if(!r.ok)say("Errore: "+(r.detail||r.error));load()};
  if(q(".thk"))q(".thk").onclick=async e=>{e.target.disabled=true;await api({action:"th_check",id});load()};
  if(q(".res"))q(".res").onclick=async()=>{await api({action:"restore",id});load()}}}
async function loadMail(){
 const d=await api({action:"mail_get"});
 if(!d.ok){document.getElementById("mlst").textContent="errore";return}
 const c=d.cfg;document.getElementById("ml-en").checked=!!c.enabled;document.getElementById("ml-cp").checked=c.copy!==false;document.getElementById("ml-mode").value=c.mode;
 document.getElementById("ml-te").value=c.test_email||"";document.getElementById("ml-h").value=c.hour;document.getElementById("ml-b").value=c.batch;document.getElementById("ml-c").value=c.daily_cap;
 document.getElementById("ml-p").value=c.privacy_url||"";document.getElementById("ml-t").value=c.consent_text||"";
 document.getElementById("mlst").textContent=(c.enabled?"ACCESO ("+(c.mode==="live"?"reale":"prova")+")":"spento")+" · "+d.stats.attivi+" con consenso · "+d.stats.disiscritti+" disiscritti · oggi inviate "+d.stats.inviate_oggi;
 document.getElementById("ml-l").textContent=(d.key?"":"Manca il segreto RESEND_API_KEY nel Worker. ")+(d.last?("Ultimo invio: "+when(d.last.ts)+" · "+d.last.msg):"")}
async function loadLog(){
 const d=await api({action:"mail_log"});
 const bd=document.getElementById("mbd"),bt=document.getElementById("mbt"),ls=document.getElementById("mls"),ld=document.getElementById("mld");
 if(!d.ok){bt.textContent="errore nel caricamento";bd.style.background="#E5645A";MAILERR=true;if(D)chUpd(D);return}
 const t=new Date().toISOString().slice(0,10);const td=d.days.find(x=>x.date===t)||{ok:0,err:0,rows:[]};
 let col="#8FA0AE",txt;
 if(td.err>0){col="#E5645A";txt="\u2717 "+td.err+" error"+(td.err===1?"e":"i")+(td.ok?" \u00b7 inviata a "+td.ok:"")}
 else if(td.ok>0){col="#7BD39A";txt="\u2713 inviata a "+td.ok}
 else txt="nessun invio oggi";
 bd.style.background=col;bt.textContent=txt;MAILERR=td.err>0;if(D)chUpd(D);ls.innerHTML='<span style="color:'+col+'">'+esc(txt)+'</span>';
 ld.innerHTML=d.days.length?d.days.map(x=>'<div style="margin-top:8px"><b>'+esc(x.date)+'</b> <span class="sub">\u00b7 '+x.ok+' ok'+(x.err?' \u00b7 '+x.err+' errori':'')+'</span>'+x.rows.map(r=>'<div style="padding:5px 0;border-top:1px solid #27353F;word-break:break-all"><span style="color:'+(r.ok?"#7BD39A":"#E5645A")+'">'+(r.ok?"\u2713":"\u2717")+'</span> '+esc(r.email)+(r.kind!=="iscritto"?' <span class="chip">'+esc(r.kind)+'</span>':'')+' <span class="sub">'+when(r.ts)+(r.ok?'':' \u00b7 '+esc(r.err||"errore"))+'</span></div>').join("")+'</div>').join(""):'<div class="sub">Nessun invio negli ultimi 7 giorni.</div>'}
document.getElementById("mbar").onclick=()=>{setTab("ut");document.getElementById("ml-log").open=true;document.getElementById("mlogcard").scrollIntoView()};
document.getElementById("ml-log").addEventListener("toggle",loadLog);
async function saveMail(){
 const g=i=>document.getElementById(i);
 const r=await api({action:"mail_set",cfg:{enabled:g("ml-en").checked,copy:g("ml-cp").checked,mode:g("ml-mode").value,test_email:g("ml-te").value,hour:g("ml-h").value,batch:g("ml-b").value,daily_cap:g("ml-c").value,privacy_url:g("ml-p").value,consent_text:g("ml-t").value}});
 if(!r.ok){g("ml-m").textContent=r.error==="serve_informativa_privacy"?"Non salvato: per l'invio reale serve l'indirizzo dell'informativa privacy.":r.error==="indirizzo_non_valido"?"Non salvato: l'indirizzo dell'informativa non è valido.":"Errore: "+(r.error||"");return false}
 const c=r.cfg;g("ml-p").value=c.privacy_url||"";g("ml-t").value=c.consent_text||"";
 g("ml-m").textContent="Salvato ✓ "+new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});loadMail();loadLog();return true}
document.getElementById("ml-s").onclick=saveMail;
["ml-en","ml-cp","ml-mode","ml-te","ml-h","ml-b","ml-c","ml-p","ml-t"].forEach(i=>document.getElementById(i).addEventListener("change",saveMail));
document.getElementById("ml-pv").onclick=()=>{window.open("/ig/mail/preview?k="+encodeURIComponent(K),"_blank")};
document.getElementById("ml-t1").onclick=async e=>{e.target.disabled=true;const r=await api({action:"mail_test",to:document.getElementById("ml-te").value});e.target.disabled=false;
 document.getElementById("ml-m").textContent=r.ok?"Prova inviata (briefing del "+r.date+"). Controlla la posta, anche lo spam.":"Errore: "+(r.error||"?");loadLog()};
let UT_GEN=false;
let USERS=[];
async function loadUsers(){
 const d=await api({action:"users"});
 if(!d.ok){document.getElementById("ust").textContent="Errore nel caricamento";return}
 USERS=d.users;
 document.getElementById("ust").textContent=d.total+" iscritti · "+d.newsletter+" ricevono l'email"+(d.unsub?" · "+d.unsub+" disiscritti":"");
 document.getElementById("us").innerHTML=USERS.length?USERS.map(u=>'<div style="padding:7px 0;border-top:1px solid #27353F"><div style="word-break:break-all"><b>'+esc(u.email)+'</b>'+(u.unsub_at?' <span class="chip" style="background:#8A3B36">disiscritto '+when(u.unsub_at)+'</span>':(u.newsletter_at?' <span class="chip" style="background:#3C8D5A">newsletter</span>':''))+'</div><div class="sub">iscritto '+when(u.created_at)+' · ultimo accesso '+when(u.last_seen)+' · '+esc(u.visits)+' accessi · fonte: '+esc(u.source||"—")+(u.campaign?' / '+esc(u.campaign):'')+'</div></div>').join(""):'<div class="sub">Nessun iscritto ancora.</div>';
}
document.getElementById("usb").onclick=e=>{const el=document.getElementById("us");const on=el.style.display==="none";el.style.display=on?"block":"none";e.target.textContent=on?"Nascondi elenco":"Mostra elenco"};
document.getElementById("usc").onclick=()=>{
 const cols=["email","created_at","last_seen","visits","source","campaign","newsletter_at","unsub_at"];
 const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
 const csv=[cols.join(",")].concat(USERS.map(u=>cols.map(c=>q(u[c])).join(","))).join(String.fromCharCode(10));
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="iscritti-read-geopolitics.csv";a.click();
};
document.getElementById("sv").onclick=async()=>{await api({action:"settings",paused:document.getElementById("pause").checked,format:"daily",mode:document.getElementById("mode").value,time:document.getElementById("time").value});load()};
document.getElementById("ttmode").onchange=async e=>{if(e.target.value==="diretto"&&!await ask("Pubblicazione diretta: finché TikTok non approva l'app (audit) funziona solo su un account privato. Continuare?")){e.target.value="bozza";return}await api({action:"tt_settings",mode:e.target.value});load()};
document.getElementById("ttauto").onchange=async e=>{await api({action:"tt_settings",auto:e.target.checked});load()};
document.getElementById("tgsv").onclick=async()=>{const r=await api({action:"tg_settings",chat:document.getElementById("tgchat").value,mattino:document.getElementById("tgm").checked,ora:document.getElementById("tgora").value,post:document.getElementById("tgp").checked,divergenze:document.getElementById("tgdv").checked,bilancio:document.getElementById("tgbl").checked,sera:document.getElementById("tgsr").checked,dossier:document.getElementById("tgdz").checked});document.getElementById("tgmsg").textContent=r.ok?"Salvato ✓":"Errore: "+(r.detail||r.error);load()};
document.getElementById("tgnow").onclick=async e=>{if(!await ask("Inviare adesso sul canale il messaggio del mattino di oggi?"))return;e.target.disabled=true;const r=await api({action:"tg_morning"});document.getElementById("tgmsg").textContent=r.ok?"Inviato ✓"+(r.sent&&r.sent.audio?" con la puntata":" senza puntata (non ancora pronta)"):"Errore: "+(r.detail||r.error);e.target.disabled=false;load()};
document.getElementById("thauto").onchange=async e=>{await api({action:"th_settings",auto:e.target.checked});load()}; document.getElementById("thdom").onchange=async e=>{await api({action:"th_settings",domanda:e.target.checked});load()};
async function thrSearch(){const L=document.getElementById("thrl");L.innerHTML='<div class="sub">Cerco…</div>';const r=await api({action:"th_search",q:document.getElementById("thrq").value,type:document.getElementById("thrt").value});
 if(!r.ok){L.innerHTML='<div class="err">'+esc(r.detail||r.error)+(String(r.error||"").indexOf("threads_")===0?'<br>Se dice che manca il permesso, premi «Ricollega Threads» qui sopra.':'')+'</div>';return}
 if(!r.posts.length){L.innerHTML='<div class="sub">Nessun post trovato.</div>';return}
 L.innerHTML='<div class="sub">Risposte oggi: <b id="thrn">'+r.oggi+'</b>/'+r.max+'</div>'+r.posts.map(p=>'<div class="thp" data-id="'+esc(p.id)+'"><div class="thu">@'+esc(p.user||"?")+(p.at?' · '+esc(when(p.at)):'')+(p.link?' · <a href="'+esc(p.link)+'" target="_blank" rel="noopener">Apri ›</a>':'')+'</div><div class="tht">'+esc(p.text)+'</div>'+(p.risposto?'<div class="sub">Hai già risposto ✓</div>':'<textarea rows="3" maxlength="500" placeholder="La tua risposta: un fatto e la fonte, senza prendere posizione"></textarea><div class="row" style="margin-top:6px"><button class="sm p thrs" type="button">Rispondi</button><span class="sub thrc">0/500</span></div>')+'</div>').join("");
 L.querySelectorAll(".thp textarea").forEach(ta=>ta.oninput=()=>{ta.parentNode.querySelector(".thrc").textContent=ta.value.length+"/500"});
 L.querySelectorAll(".thrs").forEach(bt=>bt.onclick=async()=>{const c=bt.closest(".thp");const tx=c.querySelector("textarea").value.trim();if(tx.length<5){say("Scrivi prima la risposta.");return}if(!await ask("Pubblicare questa risposta su Threads? Esce davvero, sotto il post."))return;bt.disabled=true;bt.textContent="Pubblico…";
  const x=await api({action:"th_reply",id:c.dataset.id,text:tx});if(!x.ok){say("Errore: "+(x.detail||x.error));bt.disabled=false;bt.textContent="Rispondi";return}
  c.querySelector("textarea").remove();bt.parentNode.innerHTML='<span class="sub">Risposta pubblicata ✓'+(x.link?' · <a href="'+esc(x.link)+'" target="_blank" rel="noopener">Apri ›</a>':'')+'</span>';const n=document.getElementById("thrn");if(n)n.textContent=x.oggi})}
document.getElementById("thrgo").onclick=thrSearch;
document.getElementById("thtsv").onclick=async()=>{await api({action:"th_settings",topic:document.getElementById("thtopic").value});load()};
document.getElementById("ttvs").onclick=async()=>{const r=await api({action:"tt_verify",name:document.getElementById("ttvn").value,content:document.getElementById("ttvc").value});if(!r.ok)say("Errore: "+(r.detail||r.error));load()};
document.getElementById("pause").onchange=async e=>{await api({action:"settings",paused:e.target.checked});load()};

const DN=["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
function addDays(s,n){const d=new Date(s+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function dowOf(s){const g=new Date(s+"T12:00:00Z").getUTCDay();return g===0?7:g}
function tplOf(id){return D.templates.find(t=>t.id===id)}
function itDate(s){const p=s.split("-");return +p[2]+"/"+(+p[1])}
let STP=7,ST_GEN=false;
const ST_LAB={"storia-aperta":"Storie aperte","fonte-aperta":"Fonti aperte","fai-domanda":"Domande fatte","glossario":"Glossario","vista-briefing":"Oggi","vista-timeline":"Temi","vista-mappa":"Mappa","vista-radar":"Radar","vista-archivio":"Archivio","vista-dossier":"Dossier","vista-protagonisti":"Protagonisti","vista-idee":"Idee","guida":"Guida","paese":"Schede paese","podcast-play":"Podcast avviato","podcast-finito":"Podcast finito","podcast-spotify":"Click su Spotify (testata)","podcast-spotify-briefing":"Click su Spotify (lettore)","podcast-apple":"Click su Apple Podcasts","podcast-amazon":"Click su Amazon Music","podcast-amazon-ascolta":"Pagina Ascolta → Amazon Music","podcast-spotify-ascolta":"Pagina Ascolta → Spotify","podcast-apple-ascolta":"Pagina Ascolta → Apple","podcast-telegram-ascolta":"Pagina Ascolta → Telegram","podcast-play-ascolta":"Pagina Ascolta → play","social-instagram":"Click su Instagram","app-banner-visto":"App: invito in alto visto","app-banner-chiuso":"App: invito chiuso","app-installa-banner":"App: «Installa» dall’invito","app-installa-menu":"App: «Installa» dal menu","app-guida":"App: guida mostrata (iPhone o browser)","app-installata":"App installata (Android/PC)","app-aperta":"App aperta (una volta al giorno)","social-tiktok":"Click su TikTok","gate-vista":"Invito visto (ingresso)","nl-iscritto":"Newsletter attivata","lock-perte":"Invito «Per te» visto"};
const stN=n=>Number(n||0).toLocaleString("it-IT");
const stPct=(a,b)=>b?Math.round(a/b*100):0;
const stHb=(name,n,max,tot,showN)=>'<div class="hb"><span>'+esc(name)+'</span><div class="tr"><div class="fl" style="width:'+Math.max(2,Math.round(n/(max||1)*100))+'%"></div></div><span class="n">'+(showN?stN(n)+' ':'')+'<small>'+stPct(n,tot)+'%</small></span></div>';
function stLi(lab,n){return '<div class="li"><span>'+esc(lab)+'</span><span>'+stN(n)+'</span></div>'}
async function loadStats(force){const el=document.getElementById("st");el.innerHTML='<div class="card sub">Carico le statistiche da GoatCounter…</div>';
 const r=await api({action:"stats",days:STP,force:!!force});
 if(!r.ok){el.innerHTML='<div class="card"><b>Statistiche non disponibili</b><div class="err" style="margin-top:6px">'+esc(r.detail||r.error||"errore")+'</div>'+(r.error==="gc_missing"?'<div class="sub" style="margin-top:6px">In Cloudflare: rg-api → Settings → Variables and Secrets → aggiungi il secret GC_TOKEN con la chiave API di GoatCounter (permessi di sola lettura).</div>':'')+'</div>';return}
 stRender(r.stats);vtStats()}
function ppHtml(s){let h="";const W=s.settimane||[];const fd=d=>(+d.slice(8))+"/"+(+d.slice(5,7));
 if(W.length){const cur=W[W.length-1],mx=Math.max(1,...W.map(w=>w.n));const F=(cur.n?(s.fonti||{}).cur:(s.fonti||{}).prev)||[];
  h+='<div class="card pp"><div class="ppl">Il numero della settimana · nuovi iscritti</div><div class="ppb">'+cur.n+'<small>finora · settimana dal '+fd(cur.da)+'</small></div><div class="ppw">'+W.map((w,i)=>'<div class="'+(i===W.length-1?'cur':'')+'"><b>'+w.n+'</b><i style="height:'+Math.max(3,Math.round(w.n/mx*80))+'px"></i>dal '+fd(w.da)+'</div>').join("")+'</div>'+(F.length?'<div class="ppi">Da dove sono arrivati '+(cur.n?'questa settimana':'la settimana scorsa')+': '+F.slice(0,4).map((x,i)=>i?esc(x.name)+' '+x.n:'<b>'+esc(x.name)+' '+x.n+'</b>').join(" · ")+'</div>':'')+'</div>'}
 const P=s.persone||{},pn=P.nuove||0,po=P.tornate||0,pt=pn+po;
 h+='<div class="card pp"><div class="ppl">Persone sul sito · ultimi '+s.days+' giorni</div>'+(pt?'<div class="ppb">≈ '+stN(pt)+'<small>persone diverse</small></div><div class="ppt"><div><b>'+stN(pn)+'</b><span>prima volta</span></div><div><b>'+stN(po)+'</b><span>tornate</span></div><div><b>'+Math.round(po/pt*100)+'%</b><span>tornano</span></div></div><div class="pps">Stima: chi cambia telefono o browser conta come nuovo.'+(s.start<"2026-10-22"?' Il conteggio è attivo dal 22 ottobre.':'')+'</div>':'<div class="pps">Il conteggio è attivo dal 22 ottobre: i numeri arrivano con le prossime visite.</div>')+'</div>';
 const I=s.iscritti;if(I&&I.tot){const ft=Math.max(1,I.f1+I.f2+I.f4);
  h+='<div class="card pp"><div class="ppl">Iscritti · chi è entrato con l&#39;email</div><div class="ppt"><div><b>'+stN(I.tot)+'</b><span>in tutto</span></div><div><b>'+stN(I.att)+'</b><span>passati in '+s.days+' gg</span></div><div><b class="dw">'+stN(I.spar)+'</b><span>spariti 14+ gg</span></div></div><div class="pps" style="margin-top:12px">Quanti giorni sono venuti, da quando sono iscritti</div><div class="ppbar"><i style="flex:'+I.f1+';background:#3A5A7A"></i><i style="flex:'+I.f2+';background:#86B4EA"></i><i style="flex:'+I.f4+';background:#F2B84B"></i></div><div class="ppg"><span><i style="background:#3A5A7A"></i>1 giorno · '+I.f1+'</span><span><i style="background:#86B4EA"></i>2–3 giorni · '+I.f2+'</span><span><i style="background:#F2B84B"></i>4 o più · '+I.f4+'</span></div>'+(I.f1*2>ft?'<div class="ppi">Più di metà degli iscritti è venuta <b>un giorno solo</b>: l&#39;email del mattino è il modo per riportarli.</div>':I.torn?'<div class="ppi"><b>'+I.torn+'</b> iscritti di prima sono tornati negli ultimi '+s.days+' giorni.</div>':'')+'</div>'}
 return h}
async function vtStats(){const el=document.getElementById("st");if(!el)return;const r=await api({action:"vote_stats"});if(!r.ok||!r.v)return;const V=r.v;
 const fd=d=>(+String(d).slice(8,10))+"/"+(+String(d).slice(5,7));const pc=(x,t)=>t?Math.round(100*x/t):0;
 let h='<div class="card pp vts"><div class="ppl">Voti dei lettori · solo per te</div>';
 if(!V.voti){h+='<div class="sub" style="margin-top:8px">Ancora nessun voto. Il primo sondaggio è sotto le due posizioni della storia principale del giorno.</div></div>'}
 else{h+='<div class="ppt"><div><b>'+stN(V.voti)+'</b><span>voti</span></div><div><b>'+stN(V.dispositivi)+'</b><span>dispositivi diversi</span></div><div><b>'+stN(V.ricorrenti)+'</b><span>hanno votato 2+ volte</span></div></div>';
  const G=V.giorni||[];if(G.length){const mx=Math.max(1,...G.map(g=>g.n));h+='<div class="vtd">'+G.map(g=>'<div title="'+fd(g.g)+': '+g.n+' voti"><i style="height:'+Math.max(3,Math.round(46*g.n/mx))+'px"></i><span>'+fd(g.g)+'</span></div>').join("")+'</div>'}
  const L=(V.polls||[]).filter(p=>p.tot>0&&(p.tipo||"tesi")==="tesi");
  if(L.length>=2){const div=L.filter(p=>p.a+p.b>0).map(p=>({p,m:Math.abs(p.a-p.b)/(p.a+p.b)})).sort((x,y)=>x.m-y.m);const nso=Math.round(L.reduce((s,p)=>s+pc(p.n,p.tot),0)/L.length);const wa=L.filter(p=>p.a>p.b).length,wb=L.filter(p=>p.b>p.a).length;
   h+='<div class="vti"><div><b>Più divisa</b>'+(div[0]?esc(div[0].p.titolo||div[0].p.storia_id)+' · '+pc(div[0].p.a,div[0].p.tot)+'% contro '+pc(div[0].p.b,div[0].p.tot)+'%':'—')+'</div><div><b>Più netta</b>'+(div.length>1?esc(div[div.length-1].p.titolo||div[div.length-1].p.storia_id)+' · '+pc(Math.max(div[div.length-1].p.a,div[div.length-1].p.b),div[div.length-1].p.tot)+'% da una parte':'—')+'</div><div><b>«Non so» in media</b>'+nso+'%</div><div><b>Maggioranza</b>con la prima tesi in '+wa+' sondaggi, con la seconda in '+wb+'</div></div>'}
  const PT=(V.polls||[]).filter(p=>(p.tipo||"tesi")==="tesi"),PG=(V.polls||[]).filter(p=>p.tipo==="segnale"),PC=(V.polls||[]).filter(p=>p.tipo==="scenario");
  if(PT.length)h+='<div class="vtk">Quale tesi convince</div><div class="vtl">'+PT.map(p=>'<div class="vtp"><div class="vth"><span>'+fd(p.data||"")+'</span><b>'+esc(p.titolo||p.storia_id||p.poll)+'</b><em>'+p.tot+' voti'+(p.tot<V.min?' · sotto soglia sul sito':'')+'</em></div>'+(p.tot?'<div class="vtb"><i style="flex:'+(p.a||0.001)+';background:#6FCB9F"></i><i style="flex:'+(p.b||0.001)+';background:#E891B3"></i><i style="flex:'+(p.n||0.001)+';background:#3A4A57"></i></div>':'')+'<div class="vtg"><span><i style="background:#6FCB9F"></i>'+esc(p.la||"Tesi A")+' · '+p.a+'</span><span><i style="background:#E891B3"></i>'+esc(p.lb||"Tesi B")+' · '+p.b+'</span><span>Non so '+p.n+'</span></div></div>').join("")+'</div>';
  if(PG.length)h+='<div class="vtk">Previsioni sui segnali</div><div class="vtl">'+PG.map(p=>{const si=(p.c&&p.c.si)||0,no=(p.c&&p.c.no)||0;return '<div class="vtp"><div class="vth"><span>'+fd(p.data||"")+'</span><b title="'+esc(p.testo||"")+'">'+esc(p.testo||p.poll)+'</b><em>'+p.tot+' voti</em></div>'+(p.tot?'<div class="vtb"><i style="flex:'+(si||0.001)+';background:#86B4EA"></i><i style="flex:'+(no||0.001)+';background:#3A4A57"></i></div>':'')+'<div class="vtg"><span><i style="background:#86B4EA"></i>Sì · '+si+'</span><span>No · '+no+'</span><span>'+esc(p.titolo||"")+'</span></div></div>'}).join("")+'</div>';
  if(PC.length){const done=PC.filter(p=>p.esito_i>=0&&(p.voci||[]).length);const top=a=>a.indexOf(Math.max(...a));
   const ag=done.filter(p=>top(p.voci.map(v=>v.prob))===p.esito_i).length,rd=done.filter(p=>p.tot>0&&top(p.voci.map((v,k)=>(p.c&&p.c[String(k)])||0))===p.esito_i).length,rdn=done.filter(p=>p.tot>0).length;
   h+='<div class="vtk">Scenari: lettori e agente</div>'+(done.length?'<div class="vti"><div><b>Chi ci ha preso</b>Agente: '+ag+' su '+done.length+' · Lettori: '+rd+' su '+rdn+' <span style="color:#8FA0AE">(quante volte lo scenario indicato come più probabile si è avverato)</span></div></div>':'')+'<div class="vtl">'+PC.map(p=>'<div class="vtp"><div class="vth"><span>'+fd(p.orizzonte||"")+'</span><b>'+esc(p.titolo||p.filone_id||p.poll)+'</b><em>'+p.tot+' voti</em></div>'+(p.esito_titolo?'<div class="sub" style="margin-top:4px">È andata: <b style="color:#7BD39A">'+esc(p.esito_titolo)+'</b>'+(p.nota_esito?' · '+esc(p.nota_esito):'')+'</div>':'')+'<div class="vts2">'+(p.voci||[]).map((v,k)=>{const n=(p.c&&p.c[String(k)])||0;return '<div'+(k===p.esito_i?' style="color:#7BD39A"':'')+'><span>'+(k===p.esito_i?'✓ ':'')+esc(v.titolo)+'</span><b>lettori '+pc(n,p.tot)+'%</b><em>agente '+v.prob+'%</em></div>'}).join("")+'</div></div>').join("")+'</div>'}
  h+='<div class="sub" style="margin-top:10px">Tutti i voti, anche sotto i '+V.min+' che servono per mostrarli sul sito. Voti anonimi: un codice casuale per dispositivo, mai collegato all&#39;email. Le previsioni sui segnali e sugli scenari si confrontano con l&#39;esito quando arriva la verifica o la scadenza.</div></div>'}
 const last=[...el.querySelectorAll(".card.pp")].pop();if(last)last.insertAdjacentHTML("afterend",h);else el.insertAdjacentHTML("afterbegin",h)}
function stRender(s){const el=document.getElementById("st");const E=s.events||{};const ev=k=>E[k]||0;
 const ch=s.prev_visits?Math.round((s.visits-s.prev_visits)/s.prev_visits*100):null;
 const dn=["dom","lun","mar","mer","gio","ven","sab"];
 const mx=Math.max(1,...s.day_list.map(d=>d.n));const many=s.day_list.length>10;
 let h='<div class="card"><div class="row" style="justify-content:space-between"><div><h3 style="margin:0">Statistiche del sito</h3><div class="sub">da GoatCounter · aggiornate alle '+esc(new Date(s.at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}))+' · <a href="#" id="strf">aggiorna</a></div></div><span class="seg"><button data-sp="7" class="'+(s.days===7?'on':'')+'">7 giorni</button><button data-sp="30" class="'+(s.days===30?'on':'')+'">30 giorni</button></span></div>';
 h+='<div class="kpis"><div class="kpi"><div class="l">Visite</div><div class="v">'+stN(s.visits)+'</div><div class="d">'+(ch===null?'nessun confronto':'<span class="'+(ch>=0?'up':'dw')+'">'+(ch>=0?'▲ ':'▼ ')+Math.abs(ch)+'%</span> sui '+s.days+' giorni prima')+'</div></div>';
 h+='<div class="kpi"><div class="l">Storie aperte</div><div class="v">'+stN(ev("storia-aperta"))+'</div><div class="d">'+stN(ev("fonte-aperta"))+' fonti aperte</div></div>';
 h+='<div class="kpi"><div class="l">Ascolti podcast</div><div class="v">'+stN(ev("podcast-play")+ev("podcast-play-ascolta"))+'</div><div class="d">'+stN(ev("podcast-finito"))+' fino in fondo</div></div>';
 h+='<div class="kpi"><div class="l">Nuovi iscritti</div><div class="v">'+stN(s.joined)+'</div><div class="d">'+(s.seen?'su '+stN(s.seen)+' che hanno visto l&#39;invito':'iscritti nel periodo')+'</div></div></div></div>';
 h+=ppHtml(s);h+='<div class="card"><h3>Visite al giorno</h3><p class="note">In giallo i giorni con un post pubblicato: così vedi quale contenuto ha portato gente sul sito. C = carosello, R = reel.</p><div class="chart'+(many?' many':'')+'" style="grid-template-columns:repeat('+s.day_list.length+',minmax(0,1fr))">';
 s.day_list.forEach(d=>{const t=dn[new Date(d.day+"T12:00:00Z").getUTCDay()]+' '+(+d.day.slice(8))+': '+d.n+' visite'+(d.post?' · '+d.post:'');h+='<div class="col" title="'+esc(t)+'">'+(!many||d.n===mx?'<span class="bv">'+d.n+'</span>':'')+'<div class="bar'+(d.post?' pb':'')+'" style="height:'+Math.max(1,Math.round(d.n/mx*100))+'%"></div></div>'});
 h+='</div><div class="xl" style="grid-template-columns:repeat('+s.day_list.length+',minmax(0,1fr))">';
 s.day_list.forEach((d,i)=>{const lab=(!many||i%5===0||i===s.day_list.length-1)?dn[new Date(d.day+"T12:00:00Z").getUTCDay()]+'<br>'+(+d.day.slice(8)):'';const pk=d.post?d.post.split("+").map(x=>({carosello:"C",reel:"R",post:"P"}[x]||"P")).join("+"):"";h+='<div>'+lab+(d.post&&!many?'<br><span class="post" title="'+esc(d.post)+'">'+pk+'</span>':'')+'</div>'});
 h+='</div>'+(many?'<p class="note" style="margin-top:8px">Barre gialle = giorni con un post. Passa sopra una barra per il dettaglio.</p>':'')+'</div>';
 const rt=s.refs.reduce((a,x)=>a+x.n,0),rm=Math.max(1,...s.refs.map(x=>x.n));
 h+='<div class="card"><h3>Da dove arrivano</h3><p class="note">Prima pagina vista da ogni visitatore: la provenienza la indica il browser o il link.</p>'+(s.refs.length?s.refs.slice(0,7).map(x=>stHb(x.name,x.n,rm,rt,true)).join("")+(s.refs.length>7?'<details class="more"><summary>Altre provenienze ('+(s.refs.length-7)+') · '+stN(s.refs.slice(7).reduce((a,x)=>a+x.n,0))+' visite</summary>'+s.refs.slice(7).map(x=>stHb(x.name,x.n,rm,rt,true)).join("")+'</details>':''):'<div class="sub">Nessun dato nel periodo.</div>')+'</div>';
 const views=Object.keys(E).filter(k=>k.indexOf("vista-")===0).sort((a,b)=>E[b]-E[a]);
 h+='<div class="card"><h3>Cosa fanno sul sito</h3><p class="note">Ogni azione è contata una volta per visitatore.</p><div class="two"><div class="grp"><b>Lettura</b>'+stLi("Storie aperte",ev("storia-aperta"))+stLi("Fonti aperte",ev("fonte-aperta"))+stLi("Schede paese",ev("paese"))+stLi("Domande fatte",ev("fai-domanda"))+views.slice(0,4).map(k=>stLi("Scheda "+(ST_LAB[k]||k.slice(6)),E[k])).join("")+'</div>';
 h+='<div class="grp"><b>Podcast e social</b>'+stLi("Podcast avviato sul sito",ev("podcast-play")+ev("podcast-play-ascolta"))+stLi("Podcast finito",ev("podcast-finito"))+stLi("Click su Spotify",ev("podcast-spotify")+ev("podcast-spotify-briefing")+ev("podcast-spotify-ascolta"))+stLi("Click su Apple Podcasts",ev("podcast-apple")+ev("podcast-apple-ascolta"))+stLi("Click su Instagram",ev("social-instagram"))+stLi("Click su TikTok",ev("social-tiktok"))+'</div><div class="grp"><b>Dalla pagina Ascolta</b><div class="sub" style="margin-bottom:4px">Ci arriva chi tocca lo sticker della storia del podcast.</div>'+stLi("Player della pagina",ev("podcast-play-ascolta"))+stLi("Spotify",ev("podcast-spotify-ascolta"))+stLi("Apple Podcasts",ev("podcast-apple-ascolta"))+stLi("Amazon Music",ev("podcast-amazon-ascolta"))+stLi("Telegram",ev("podcast-telegram-ascolta"))+'</div></div>';
 const fm=Math.max(1,s.seen,s.joined);
 h+='<div class="grp fun" style="margin-top:14px"><b>Iscrizione</b><div class="step"><span>Hanno visto l&#39;invito</span><span>'+stN(s.seen)+'</span></div><div class="tr"><div class="fl" style="width:'+stPct(s.seen,fm)+'%"></div></div><div class="step"><span>Hanno lasciato l&#39;email</span><span>'+stN(s.joined)+(s.seen?' · '+stPct(s.joined,s.seen)+'%':'')+'</span></div><div class="tr"><div class="fl" style="width:'+stPct(s.joined,fm)+'%"></div></div><div class="step"><span>Newsletter attivata</span><span>'+stN(s.nl)+(s.seen?' · '+stPct(s.nl,s.seen)+'%':'')+'</span></div><div class="tr"><div class="fl" style="width:'+stPct(s.nl,fm)+'%"></div></div></div>';
 const all=Object.keys(E).sort((a,b)=>E[b]-E[a]);
 if(all.length)h+='<details style="margin-top:10px"><summary class="sub">Tutti gli eventi ('+all.length+')</summary><div class="grp" style="margin-top:8px">'+all.map(k=>stLi(ST_LAB[k]||k,E[k])).join("")+'</div></details>';
 h+='</div>';
 const so=["Telefono","Tablet","Computer","Altro"].filter(k=>s.sizes[k]);const st=so.reduce((a,k)=>a+s.sizes[k],0);const sm=Math.max(1,...so.map(k=>s.sizes[k]));
 let dnm=null;try{dnm=new Intl.DisplayNames(["it"],{type:"region"})}catch(e){}
 const lt=s.locations.reduce((a,x)=>a+x.n,0),lm=Math.max(1,...s.locations.map(x=>x.n));
 h+='<div class="card"><div class="two"><div><h3>Dispositivi</h3>'+(so.length?so.map(k=>stHb(k,s.sizes[k],sm,st,false)).join(""):'<div class="sub">Nessun dato.</div>')+'</div><div><h3>Paesi</h3>'+(s.locations.length?s.locations.slice(0,5).map(x=>{let n=x.name;try{if(dnm&&x.id&&x.id.length===2)n=dnm.of(x.id.toUpperCase())}catch(e){}return stHb(n,x.n,lm,lt,false)}).join(""):'<div class="sub">Nessun dato.</div>')+'</div></div></div>';
 h+='<div class="card"><h3>In breve</h3><p class="note">Osservazioni calcolate in automatico dai numeri qui sopra, con regole fisse.</p>'+(s.insights.length?'<ul class="ins">'+s.insights.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>':'<div class="sub">Ancora pochi dati per dire qualcosa.</div>')+'</div>';
 el.innerHTML=h;
 el.querySelectorAll("[data-sp]").forEach(b=>b.onclick=()=>{STP=+b.dataset.sp;loadStats(false)});
 const rf=document.getElementById("strf");if(rf)rf.onclick=e=>{e.preventDefault();loadStats(true)};
}
function setTab(t){TAB=t;if(t==="pd"&&!POD_GEN){POD_GEN=true;podLoad()}if(t==="wk"&&!PROP)loadProp(false);if(t==="st"&&!ST_GEN){ST_GEN=true;loadStats(false)}if(t==="lk")lkRender();if(t==="og"){ogRender();setTimeout(ogPod,0)}if(t==="ut"&&!UT_GEN){UT_GEN=true;loadMail();loadLog();loadUsers()}["og","list","wk","rq","ut","pd","st","lk"].forEach(k=>{document.getElementById(k).hidden=(k!==t)});document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.t===t))}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.t));
function dayState(date,e){
  const ds=D.drafts.filter(x=>x.date===date&&x.status!=="scartata");
  const pub=ds.find(x=>x.status==="pubblicata");if(pub)return {c:"ok",t:"Pubblicato"+(pub.permalink?' · <a href="'+esc(pub.permalink)+'" target="_blank">apri</a>':"")};
  const w=ds.find(x=>x.status==="in_elaborazione"||x.status==="in_pubblicazione");if(w)return {c:"warn",t:"In elaborazione su Instagram: apri Bozze e premi Controlla e pubblica"};
  const b=ds.find(x=>x.status==="bozza");if(b)return {c:"warn",t:"Bozza pronta, "+(b.mode==="auto"&&b.publish_at?"esce da sola alle "+when(b.publish_at):"aspetta il tuo ok")+" (vedi Bozze)"};
  const er=ds.find(x=>x.status==="errore");if(er)return {c:"warn",t:"Errore di pubblicazione: vedi Bozze"};
  if(date<D.today)return {c:"mut",t:"Nessun contenuto prodotto"};
  const tp=tplOf(e.template);
  if(tp&&tp.pronto&&tp.auto_ok&&e.auto)return {c:"mut",t:"Da produrre: la routine delle 07:30 prepara "+tp.nome};
  if(tp&&tp.pronto)return {c:"warn",t:"Da produrre su richiesta: "+tp.nome+" (scheda Richieste)"};
  return {c:"warn",t:"Rubrica da costruire: per ora vale il carosello del giorno"};
}
let PROP=null,PSC={},POPEN=null,RQ={};
const SK={parola:"parola",numero:"parola","due-letture":"storia",filone:"filone","reel-storia":"tema","oggi-reel":"tema","sito-reel":"tema","sito-schermate":"tema"};
async function loadProp(force){const r=await api({action:"proposte",force:!!force});if(r.ok){PROP=r.proposte;PSC=r.scelte||{}}renderWeek()}
function propHtml(date,e){const k=SK[e.template];if(!k||!PROP||date<D.today)return "";const sc=PSC[date];const items=PROP[k]||[];
 let h='<div class="s" style="margin-top:8px"><button class="'+(sc?"":"g ")+'pp" style="padding:6px 12px">'+(sc?"Scelta tua: "+esc(sc.label):"Decide la routine")+(POPEN===date?" ▴":" ▾")+'</button></div>';
 if(POPEN!==date)return h;
 h+='<div class="props">';
 if(k==="tema")h+='<div class="sub">Le notizie del giorno escono alle 6:45. Scegli un tema da preferire: se quel giorno il briefing ha una storia sul tema, entra nel contenuto; altrimenti decide la routine.</div>';
 const opt=(v,l,w,on,auto)=>'<div class="pr'+(on?" on":"")+'" data-v="'+esc(v)+'" data-l="'+esc(l)+'"><span class="rd"></span><div><div class="t">'+esc(l)+(auto?'<span class="tagr" title="Con i dati di adesso la routine sceglierebbe questa. Il briefing del mattino può cambiarla.">IN TESTA ADESSO</span>':"")+'</div>'+(w?'<div class="w">'+esc(w)+'</div>':"")+'</div></div>';
 h+=opt("","Decide la routine",k==="tema"?"Nessuna preferenza: sceglie la routine con le notizie di quel giorno.":"Sceglie la routine quel giorno, con i dati di quel momento.",!sc,false);
 items.forEach(x=>{h+=opt(x.value,x.label,x.why,!!(sc&&sc.value===x.value),x.auto)});
 if(!items.length)h+='<div class="sub">Nessuna proposta per ora: decide la routine.</div>';
 h+='<div class="sub">Vale per '+esc(DN[dowOf(date)-1].toLowerCase())+" "+itDate(date)+'. Proposte aggiornate alle '+esc(new Date(PROP.at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}))+' · <a href="#" class="prf">aggiorna</a></div></div>';
 return h}
function renderWeek(){
  if(!D)return;const el=document.getElementById("wk");
  const mon=addDays(D.today,-(dowOf(D.today)-1)+7*WOFF);
  let h='<div class="card"><div class="row"><button class="g" id="wp">‹</button><b style="flex:1;text-align:center">Settimana '+itDate(mon)+" – "+itDate(addDays(mon,6))+'</b><button class="g" id="wn">›</button><button class="g" id="wt">Oggi</button></div>';
  h+='<div class="sub" style="margin-top:6px">La regia vale per ogni settimana: cambia un giorno e resta cambiato. Un solo post al giorno.</div></div><div class="card">';
  for(let i=0;i<7;i++){
    const date=addDays(mon,i),e=D.plan[i],tp=tplOf(e.template),st=dayState(date,e);
    h+='<div class="day'+(date===D.today?" oggi":"")+'" data-dow="'+(i+1)+'" data-date="'+date+'"><div class="row"><span class="t">'+DN[i]+" "+itDate(date)+(date===D.today?" · oggi":"")+'</span><span class="chip">'+esc(e.formato)+'</span><span class="sub">'+esc(e.ora)+'</span><button class="g ed2" style="margin-left:auto;padding:6px 10px">Modifica</button></div>';
    h+='<div class="s"><b>'+esc(e.rubrica)+'</b>'+(tp?" · "+esc(tp.nome):"")+(e.auto?" · la prepara la routine":" · solo su richiesta")+'</div>';
    if(e.note)h+='<div class="s mut">'+esc(e.note)+'</div>';
    h+='<div class="s '+st.c+'">'+st.t+'</div>';
    h+=propHtml(date,e);
    if(WED===i+1){
      h+='<div class="frm"><label>Rubrica<input type="text" class="f-r" maxlength="60" value="'+esc(e.rubrica)+'"></label>';
      h+='<label>Contenuto standard<select class="f-t">'+D.templates.map(t=>'<option value="'+t.id+'"'+(t.id===e.template?" selected":"")+">"+esc(t.nome)+" ("+t.formato+")"+(t.pronto?"":" – da costruire")+"</option>").join("")+"</select></label>";
      h+='<label>Formato<select class="f-f">'+["carosello","reel","post","story"].map(f=>'<option'+(f===e.formato?" selected":"")+">"+f+"</option>").join("")+"</select></label>";
      h+='<label>Ora di uscita<input type="time" class="f-o" value="'+esc(e.ora)+'"></label>';
      h+='<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="f-a"'+(e.auto?" checked":"")+'> La routine lo produce da sola (solo se il contenuto è pronto)</label>';
      h+='<label>Nota<input type="text" class="f-n" maxlength="160" value="'+esc(e.note)+'"></label>';
      h+='<div class="row"><button class="f-s">Salva</button><button class="g f-c">Annulla</button></div></div>';
    }
    h+='</div>';
  }
  el.innerHTML=h+"</div>";
  document.getElementById("wp").onclick=()=>{WOFF--;renderWeek()};
  document.getElementById("wn").onclick=()=>{WOFF++;renderWeek()};
  document.getElementById("wt").onclick=()=>{WOFF=0;renderWeek()};
  el.querySelectorAll(".day").forEach(c=>{const dow=+c.dataset.dow;const q=s=>c.querySelector(s);
    q(".ed2").onclick=()=>{WED=(WED===dow?null:dow);renderWeek()};
    const dd=c.dataset.date;
    if(q(".pp"))q(".pp").onclick=()=>{POPEN=(POPEN===dd?null:dd);renderWeek()};
    if(q(".prf"))q(".prf").onclick=ev=>{ev.preventDefault();loadProp(true)};
    c.querySelectorAll(".pr").forEach(o=>o.onclick=async()=>{const v=o.dataset.v;const r=await api({action:"scelta_set",date:dd,kind:SK[D.plan[dow-1].template],value:v||null,label:o.dataset.l});if(r.ok)PSC=r.scelte;else say("Errore: "+(r.detail||r.error));renderWeek()});
    if(q(".f-c"))q(".f-c").onclick=()=>{WED=null;renderWeek()};
    if(q(".f-t"))q(".f-t").onchange=ev=>{const t=tplOf(ev.target.value);if(t)q(".f-f").value=t.formato};
    if(q(".f-s"))q(".f-s").onclick=async ev=>{ev.target.disabled=true;const r=await api({action:"plan_set",dow,entry:{rubrica:q(".f-r").value,template:q(".f-t").value,formato:q(".f-f").value,ora:q(".f-o").value,auto:q(".f-a").checked,note:q(".f-n").value}});if(!r.ok){say("Errore: "+JSON.stringify(r));ev.target.disabled=false;return}WED=null;load()}});
}
function renderReq(){
  if(!D)return;const el=document.getElementById("rq");
  const pr=D.templates.filter(t=>t.pronto);
  const TOP=["spiegato","reel-storia","oggi-reel","settimana-reel","due-letture","parola","mondo-oggi"];
  if(!RQ.t||!pr.some(t=>t.id===RQ.t))RQ.t="spiegato";
  const fr=t=>'<div class="rq-f'+(RQ.t===t.id?" on":"")+'" data-id="'+esc(t.id)+'"><span class="rq-o"></span><span><b>'+esc(t.nome)+'</b>'+(t.id==="spiegato"?'<span class="rq-new">NUOVO</span>':"")+'<span class="rq-d">'+esc(t.desc)+"</span></span></div>";
  const grp=(f,lab,cl)=>{const ix=t=>{const i=TOP.indexOf(t.id);return i<0?99:i};const a=pr.filter(t=>t.formato===f&&(RQ.all||TOP.includes(t.id)||RQ.t===t.id)).sort((x,y)=>ix(x)-ix(y));return a.length?'<div class="rq-g '+cl+'">'+lab+"</div>"+a.map(fr).join(""):""};
  const extra=pr.filter(t=>!TOP.includes(t.id)&&t.id!==RQ.t).length;
  let h='<div class="card rq"><b>Chiedi un contenuto</b><div class="sub">La routine lo prepara subito e lo trovi tra le Bozze, dove lo controlli prima che esca.</div>';
  h+='<div class="rq-s">1 · Formato</div>'+grp("reel","Reel","rq-reel")+grp("carosello","Carosello","rq-car")+grp("post","Post","rq-car")+grp("story","Storia","rq-car");
  if(!RQ.all&&extra)h+='<div class="rq-more" id="rq-all">Altri '+extra+' formati ›</div>';
  const t=tplOf(RQ.t);
  if(t&&t.param){h+='<div class="rq-s">2 · Tema · tocca o scrivi</div><div id="rq-tl"></div><input type="text" id="r-p" class="rq-in" maxlength="200" placeholder="oppure scrivi il tema" value="'+esc(RQ.p||"")+'">'}
  h+='<div class="rq-s">'+(t&&t.param?"3":"2")+' · Indicazioni · facoltative</div><textarea id="r-n" class="rq-in" rows="2" placeholder="Es.: insisti sulle due date">'+esc(RQ.n||"")+"</textarea>";
  h+='<label class="rq-fz"><input type="checkbox" id="r-f"> Forza: producilo subito, con l ultimo briefing disponibile anche se non è di oggi</label>';
  h+='<div class="rq-sum" id="rq-sum"></div><div class="row"><button id="r-go">Prepara la bozza</button></div></div>';
  const pend=D.templates.filter(t=>!t.pronto);
  if(pend.length)h+='<div class="card sub">Da costruire (non richiedibili): '+pend.map(t=>esc(t.nome)).join(", ")+".</div>";
  const seen=D.req_seen&&D.req_seen.at?when(D.req_seen.at):"mai";
  h+='<div class="card"><div class="row"><b>Richieste</b><span class="sub">ultimo controllo della routine: '+seen+'</span></div><div class="sub">La routine controlla la coda a intervalli: la risposta non è immediata.</div>';
  if(!D.requests.length)h+='<div class="sub" style="margin-top:8px">Nessuna richiesta.</div>';
  h+=D.requests.map(r=>'<div class="day" data-id="'+esc(r.id)+'"><div class="row"><b>'+esc(r.nome)+'</b><span class="chip '+esc(r.stato)+'">'+esc(String(r.stato).replace("_"," "))+'</span><span class="sub">'+when(r.created_at)+"</span>"+(r.stato==="in_coda"?'<button class="r cx" style="margin-left:auto;padding:6px 10px">Annulla</button>':"")+"</div>"
    +(r.forza?'<div class="s warn">Forzata: usa l ultimo briefing disponibile</div>':"")+(r.param?'<div class="s">Tema: '+esc(r.param)+"</div>":"")+(r.note?'<div class="s mut">'+esc(r.note.length>220?r.note.slice(0,220)+"… ("+r.note.length+" caratteri)":r.note)+"</div>":"")
    +(r.stato==="in_coda"&&r.fire?'<div class="s '+(r.fire==="avviata"?"ok":"warn")+'">'+(r.fire==="avviata"?"Routine avviata: la bozza arriva tra pochi minuti":"Avvio automatico non riuscito ("+esc(r.fire)+"): parte al prossimo controllo")+"</div>":"")
    +(r.stato==="pronta"?'<div class="s ok">Pronta: guarda tra le Bozze'+(r.draft_id?" ("+esc(r.draft_id)+")":"")+"</div>":"")
    +(r.stato==="bloccata"?'<div class="s warn">Ferma da oltre 3 ore: riprova con una nuova richiesta</div>':"")
    +(r.stato==="fallita"?'<div class="s warn">Non riuscita'+(r.esito?": "+esc(r.esito):"")+"</div>":"")+"</div>").join("");
  el.innerHTML=h+"</div>";
  const dzOf=f=>{const T=RQ.temi;return T&&f?(T.dossier.find(d=>d.filoni.includes(f))||null):null};
  const sum=()=>{const x=document.getElementById("rq-sum");if(!x)return;const tt=tplOf(RQ.t);const pv=(document.getElementById("r-p")||{}).value||"";
   let s2="<b>"+esc(tt?tt.nome:"")+"</b>"+(pv?" su <b>"+esc(pv)+"</b>":"");
   if(RQ.t==="spiegato"){const T=RQ.temi;const opts=T?T.dossier:[];const cur=RQ.fin!==undefined?RQ.fin:((dzOf(RQ.f)||{}).id||"");
    s2+='<div class="rq-fin">Finale: <select id="rq-fs"><option value="">Tu leggi, tu decidi (senza dossier)</option>'+opts.map(d=>'<option value="'+esc(d.id)+'"'+(d.id===cur?" selected":"")+">dossier "+esc(d.t)+"</option>").join("")+"</select>"+(RQ.fin===undefined&&cur?' <span class="sub">scelto in automatico</span>':"")+"</div>"}
   x.innerHTML=s2;const fs=document.getElementById("rq-fs");if(fs)fs.onchange=()=>{RQ.fin=fs.value;sum()}};
  const temi=()=>{const box=document.getElementById("rq-tl");if(!box)return;const tt=tplOf(RQ.t);
   if(RQ.t==="parola"){if(!PROP){box.innerHTML='<div class="sub">Carico le proposte…</div>';loadProp(false).then(temi).catch(()=>{box.innerHTML=""});return}
    box.innerHTML=(PROP.parola||[]).slice(0,5).map(o=>'<div class="rq-t'+(RQ.p===o.value?" on":"")+'" data-v="'+esc(o.value)+'"><i style="background:#86B4EA"></i><span>'+esc(o.label)+'</span><span class="w">parola della settimana</span></div>').join("")}
   else{if(!RQ.temi){box.innerHTML='<div class="sub">Carico i temi…</div>';api({action:"temi"}).then(r=>{RQ.temi=r.ok?r.temi:{aggiornamenti:[],storie:[],dossier:[],filoni:[]};temi();sum()});return}
    const T=RQ.temi;const rows=[];
    T.aggiornamenti.forEach(x=>rows.push({v:x.t,f:x.filone,c:"#E8B050",w:(x.tipo==="svolta"?"svolta ":"aggiornamento ")+x.ora}));
    T.storie.forEach(x=>rows.push({v:x.t,f:x.filone,c:"#86B4EA",w:"storia di oggi"}));
    T.dossier.forEach(x=>rows.push({v:x.t,f:x.filoni[0]||"",c:"#7BD39A",w:"dossier"}));
    if(RQ.tall)T.filoni.forEach(x=>rows.push({v:x.t,f:x.id,c:"#7BD39A",w:"filone"}));
    box.innerHTML=rows.map(r=>'<div class="rq-t'+(RQ.p===r.v?" on":"")+'" data-v="'+esc(r.v)+'" data-f="'+esc(r.f)+'"><i style="background:'+r.c+'"></i><span>'+esc(r.v)+'</span><span class="w">'+esc(r.w)+"</span></div>").join("")+(RQ.tall||!T.filoni.length?"":'<div class="rq-more" id="rq-tall">Tutti i filoni attivi ('+T.filoni.length+') ›</div>');
    const ta=document.getElementById("rq-tall");if(ta)ta.onclick=()=>{RQ.tall=true;temi()}}
   box.querySelectorAll(".rq-t").forEach(r=>r.onclick=()=>{RQ.p=r.dataset.v;RQ.f=r.dataset.f||"";RQ.fin=undefined;const i=document.getElementById("r-p");if(i)i.value=RQ.p;box.querySelectorAll(".rq-t").forEach(x=>x.classList.toggle("on",x===r));sum()})};
  el.querySelectorAll(".rq-f").forEach(r=>r.onclick=()=>{RQ.t=r.dataset.id;RQ.fin=undefined;renderReq()});
  {const a=document.getElementById("rq-all");if(a)a.onclick=()=>{RQ.all=true;renderReq()}}
  {const i=document.getElementById("r-p");if(i)i.oninput=()=>{RQ.p=i.value;RQ.f="";sum()}}
  document.getElementById("r-n").oninput=e=>{RQ.n=e.target.value};
  temi();sum();
  document.getElementById("r-go").onclick=async e=>{const tt=tplOf(RQ.t);const pv=((document.getElementById("r-p")||{}).value||"").trim();
   if(RQ.t==="spiegato"&&!pv){say("Scegli o scrivi il tema dello spiegato.");return}
   let note=document.getElementById("r-n").value;const fs=document.getElementById("rq-fs");if(fs)note="FINALE: "+(fs.value?"dossier "+fs.value:"Tu leggi, tu decidi")+(note?String.fromCharCode(10)+note:"");
   e.target.disabled=true;const r=await api({action:"req_create",template:RQ.t,param:tt&&tt.param?pv:"",note,forza:document.getElementById("r-f").checked});if(!r.ok){say("Errore: "+JSON.stringify(r));e.target.disabled=false;return}RQ.p="";RQ.n="";RQ.fin=undefined;load()};
  el.querySelectorAll(".cx").forEach(b=>b.onclick=async()=>{await api({action:"req_cancel",id:b.closest(".day").dataset.id});load()});
}
setTab("og");
load().then(()=>{
 /* v27: misura e precarica. Appena le bozze sono a schermo: tempo registrato (anonimo) e le altre tab si caricano in sottofondo, così al tocco sono pronte. */
 try{const n=performance.getEntriesByType("navigation")[0]||{};const c=navigator.connection||{};fetch("/api/perf",{method:"POST",body:JSON.stringify({src:"pannello",net:c.effectiveType||"",m:{html:n.responseEnd||0,dom:n.domContentLoadedEventEnd||0,bozze:performance.now()}}),keepalive:true}).catch(()=>{})}catch(e){}
 setTimeout(()=>{
  if(!UT_GEN){UT_GEN=true;loadMail();loadLog();loadUsers()}
  if(!PROP)loadProp(false);
  setTimeout(()=>{if(!ST_GEN){ST_GEN=true;loadStats(false)}},1500);
 },400);
}).catch(()=>{});
// ---------- Podcast: puntata del giorno e storia Instagram (disegnata qui, nel telefono) ----------
let POD=null,POD_GEN=false,POD_BLOB=null,POD_IMG=null,POD_T=null;
function podCopy(btn,txt){const done=()=>{const o=btn.textContent;btn.textContent="Copiato ✓";setTimeout(()=>{btn.textContent=o},1500)};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>{ask("Copia:",txt)});else ask("Copia:",txt)}
const podCut=s=>String(s||"").split(/[,;·]|[.] | [/] /).map(x=>x.trim().replace(/[./]+$/,"").trim()).filter(Boolean).map(x=>x.charAt(0).toUpperCase()+x.slice(1));
function podTemi(ep){
 // temi per esteso e brevi: dai capitoli inviati dal task; se mancano, dalla descrizione e dal titolo
 const o={mondo:[],italia:[],mondo_brevi:[],italia_brevi:[]};
 const ch=ep&&ep.chapters&&!Array.isArray(ep.chapters)?ep.chapters:{};
 for(const k of Object.keys(o))if(Array.isArray(ch[k]))o[k]=ch[k].map(String).filter(Boolean);
 const d=String((ep&&ep.description)||"").split(String.fromCharCode(10)).join(" ").replace(/ +/g," ");
 const im=d.search(/mondo *:/i),ii=d.search(/italia *:/i);
 if(!o.mondo.length&&im>=0)o.mondo=podCut(d.slice(d.indexOf(":",im)+1,ii>im?ii:d.length));
 if(!o.italia.length&&ii>=0)o.italia=podCut(d.slice(d.indexOf(":",ii)+1,im>ii?im:d.length));
 if(!o.mondo_brevi.length&&ep&&ep.title&&ep.title.indexOf("·")>0)o.mondo_brevi=podCut(ep.title.slice(ep.title.indexOf("·")+1));
 if(!o.mondo_brevi.length)o.mondo_brevi=o.mondo.slice();
 if(!o.italia_brevi.length)o.italia_brevi=o.italia.slice();
 return o}
function podDateLabel(ep){
 if(ep.title&&ep.title.indexOf("·")>0)return ep.title.slice(0,ep.title.indexOf("·")).trim();
 const s=new Date(ep.date+"T12:00:00Z").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",timeZone:"Europe/Rome"});return s.charAt(0).toUpperCase()+s.slice(1)}
function podSpaced(g,txt,cx,y,sp){const w=[...txt].reduce((a,c)=>a+g.measureText(c).width+sp,0)-sp;let x=cx-w/2;g.textAlign="left";for(const c of txt){g.fillText(c,x,y);x+=g.measureText(c).width+sp}g.textAlign="center"}
function podWrap(g,items,maxW){
 const lines=[];let cur=[];let w=0;const sep=g.measureText("  ·  ").width;
 for(const it of items){const iw=g.measureText(it).width;const add=cur.length?sep+iw:iw;if(cur.length&&w+add>maxW){lines.push(cur);cur=[it];w=iw}else{cur.push(it);w+=add}}
 if(cur.length)lines.push(cur);return lines}
function podDrawLine(g,parts,cx,y){
 const sep="  ·  ";const tot=parts.reduce((a,p,i)=>a+g.measureText(p).width+(i?g.measureText(sep).width:0),0);let x=cx-tot/2;g.textAlign="left";
 parts.forEach((p,i)=>{if(i){g.fillStyle="#E8A33D";g.fillText(sep,x,y);x+=g.measureText(sep).width}g.fillStyle="#EEF2F6";g.fillText(p,x,y);x+=g.measureText(p).width});g.textAlign="center"}
const podMode=()=>document.getElementById("pd-mode").value;
const podLines=id=>document.getElementById(id).value.split(String.fromCharCode(10)).map(x=>x.trim()).filter(Boolean);
let POD_MOD={};
function podKeys(){const b=podMode()==="brevi"?"_brevi":"";return ["mondo"+b,"italia"+b]}
function podFill(){
 // il pulsante «Modifica temi» c'è solo nelle versioni con i temi; l'editor si apre solo a comando
 const m=podMode();document.getElementById("pd-edb").hidden=(m==="sempre"||!POD_T);document.getElementById("pd-ed").hidden=true;
 const k=podKeys();document.getElementById("pd-edm").textContent=(POD_MOD[k[0]]||POD_MOD[k[1]])?"temi modificati da te":""}
function podEdOpen(){const k=podKeys();const nl=String.fromCharCode(10);
 document.getElementById("pd-tm").value=POD_T[k[0]].join(nl);document.getElementById("pd-ti").value=POD_T[k[1]].join(nl);
 document.getElementById("pd-ed").hidden=false;document.getElementById("pd-edb").hidden=true}
function podEdApply(){const k=podKeys();POD_T[k[0]]=podLines("pd-tm");POD_T[k[1]]=podLines("pd-ti");POD_MOD[k[0]]=POD_MOD[k[1]]=true;podFill();podDraw()}
function podEdReset(){const k=podKeys();const o=podTemi(POD);POD_T[k[0]]=o[k[0]];POD_T[k[1]]=o[k[1]];delete POD_MOD[k[0]];delete POD_MOD[k[1]];podFill();podDraw()}
async function podDraw(){
 const ep=POD;const mode=ep?podMode():"sempre";
 const c=document.getElementById("pd-cv");const g=c.getContext("2d");const W=1080,H=1920;
 try{await Promise.all(["600 72px 'IBM Plex Serif'","400 40px 'IBM Plex Sans'","600 46px 'IBM Plex Sans'","500 26px 'IBM Plex Mono'"].map(f=>document.fonts.load(f)))}catch(e){}
 const bg=g.createRadialGradient(540,560,0,540,560,1350);bg.addColorStop(0,"#14213f");bg.addColorStop(.62,"#0a0f1c");bg.addColorStop(1,"#0a0f1c");g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.textBaseline="top";g.textAlign="center";
 g.fillStyle="#86B4EA";g.font="500 28px 'IBM Plex Mono'";podSpaced(g,"READ GEOPOLITICS",540,236,9);
 g.fillStyle="#E8B050";g.font="600 72px 'IBM Plex Serif'";g.fillText("Il podcast del mattino",540,286);
 const CT=420,BOTTOM=1470;
 // blocco testi: si misura prima, poi la copertina prende lo spazio che resta (al massimo 600 px)
 let L;
 if(mode==="sempre"){L={h:212,draw:y=>{g.fillStyle="#EEF2F6";g.font="600 52px 'IBM Plex Serif'";g.fillText("Ogni mattina, in 15 minuti",540,y);y+=96;
  g.font="400 40px 'IBM Plex Sans'";g.fillText("Le storie del giorno: i fatti, le fonti,",540,y);g.fillText("perché contano e le due tesi a confronto.",540,y+58)}}}
 else{
  const kk=podKeys();const TM=POD_T[kk[0]],TI=POD_T[kk[1]];const lungo=mode==="estesi";
  const mk=fs=>{g.font="400 "+fs+"px 'IBM Plex Sans'";const lh=Math.round(fs*1.38);
   const bl=[["Oggi nel mondo",TM],["In Italia",TI]].filter(x=>x[1].length).map(x=>[x[0],lungo?x[1].map(t=>[t]):podWrap(g,x[1],920)]);
   return {fs,lh,bl,h:96+bl.reduce((a,x)=>a+44+x[1].length*lh+18,0)}};
  let fs=lungo?40:44;L=mk(fs);while(fs>28&&BOTTOM-L.h-50-CT<460){fs-=2;L=mk(fs)}
  const lab=podDateLabel(ep);
  L.draw=y=>{g.fillStyle="#EEF2F6";g.font="600 52px 'IBM Plex Serif'";g.fillText(lab,540,y);y+=96;
   for(const [t,lines] of L.bl){g.fillStyle="#E8A33D";g.font="500 24px 'IBM Plex Mono'";podSpaced(g,t.toUpperCase(),540,y,6);y+=44;
    g.font="400 "+L.fs+"px 'IBM Plex Sans'";for(const ln of lines){podDrawLine(g,ln,540,y);y+=L.lh}y+=18}}}
 const cs=Math.max(320,Math.min(600,BOTTOM-L.h-50-CT));
 if(POD_IMG){const x0=540-cs/2;g.save();g.shadowColor="rgba(0,0,0,.65)";g.shadowBlur=70;g.shadowOffsetY=24;g.beginPath();g.roundRect(x0,CT,cs,cs,28);g.fillStyle="#0a0f1c";g.fill();g.restore();
  g.save();g.beginPath();g.roundRect(x0,CT,cs,cs,28);g.clip();g.drawImage(POD_IMG,x0,CT,cs,cs);g.restore()}
 L.draw(CT+cs+50);
 const min=ep&&ep.duration&&mode!=="sempre"?Math.max(1,Math.round(ep.duration/60))+" MIN · ":"";
 g.fillStyle="#8fa0bd";g.font="500 26px 'IBM Plex Mono'";podSpaced(g,"🎧 "+min+"SPOTIFY E SITO",540,1500,5);
 g.fillStyle="#ffffff";g.font="600 46px 'IBM Plex Sans'";g.fillText("Ascolta qui sotto ↓",540,1560);
 POD_BLOB=await new Promise(r=>c.toBlob(r,"image/png"));
 const f="storia_podcast_"+(ep&&mode!=="sempre"?ep.date+"_"+mode:"sempre")+".png";const a=document.getElementById("pd-dl");a.download=f;if(a.href&&a.href.startsWith("blob:"))URL.revokeObjectURL(a.href);a.href=URL.createObjectURL(POD_BLOB);
}
async function podShare(){
 if(!POD_BLOB)return;const name=document.getElementById("pd-dl").download;const file=new File([POD_BLOB],name,{type:"image/png"});
 if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file]});ogDone("pod")}catch(e){}}else{document.getElementById("pd-dl").click();ogDone("pod")}}
async function podLoad(){
 const box=document.getElementById("pd-ep");box.innerHTML='<span class="sub">carico…</span>';
 if(!POD_IMG){POD_IMG=new Image();POD_IMG.src="/ig/pod/cover.jpg";try{await POD_IMG.decode()}catch(e){POD_IMG=null}}
 let d=null;try{d=await (await fetch("/api/podcast/latest",{cache:"no-store"})).json()}catch(e){}
 POD=d&&d.episode||null;POD_T=POD?podTemi(POD):null;POD_MOD={};
 const oggi=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome"}).format(new Date());
 if(!POD){box.innerHTML='<div class="warn">Nessuna puntata pubblicata.</div>'}
 else{const m=Math.max(1,Math.round((POD.duration||0)/60));
  box.innerHTML='<div><b>'+esc(POD.title)+'</b></div><div class="sub">'+esc(POD.date)+' · '+m+' min</div>'
   +(POD.date===oggi?'<div class="ok" style="margin-top:4px">✓ È la puntata di oggi</div>':'<div class="warn" style="margin-top:4px">La puntata di oggi non c’è ancora: questa è del '+esc(POD.date)+'. Di solito arriva verso le 7:50.</div>')
   +'<audio controls preload="none" style="width:100%;margin-top:8px" src="'+esc(POD.url)+'"></audio>'
   +(POD.description?'<div class="sub" style="margin-top:6px;white-space:pre-wrap">'+esc(POD.description)+'</div>':'')}
 podFill();await podDraw();
}
document.getElementById("pd-mode").onchange=()=>{podFill();podDraw()};
document.getElementById("pd-edo").onclick=podEdOpen;document.getElementById("pd-ap").onclick=podEdApply;document.getElementById("pd-an").onclick=podFill;document.getElementById("pd-rs").onclick=podEdReset;
document.getElementById("pd-rf").onclick=podLoad;
document.getElementById("pd-sh").onclick=podShare;
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>podCopy(b,b.dataset.copy));
</script>`;


// ---- Kit di generazione delle carte (servito a /ig/kit/<file>; il task giornaliero lo scarica da qui) ----
const IG_KIT = {
  "igkit.mjs": "Ly8gaWdraXQg4oCUIGdlbmVyYSBsZSBjYXJ0ZSBJbnN0YWdyYW0gZGkgUmVhZCBHZW9wb2xpdGljcyBkYSB1bmEgc3BlY2lmaWNhIEpTT04uCi8vIHVzbzogIG5vZGUgaWdraXQubWpzIGNoZWNrICBTUEVDLmpzb24gICAgICAgICAgICAtPiBjb250cm9sbGEgbHVuZ2hlenplIGUgY2FtcGkKLy8gICAgICAgbm9kZSBpZ2tpdC5tanMgZGFpbHkgIFNQRUMuanNvbiBPVVRfRElSICAgIC0+IHNjcml2ZSBPVVRfRElSL2pwZy8wMS5qcGcgLi4uIChjYXJvc2VsbG8gMTA4MHgxMzUwKQovLyBOZXNzdW4gZGF0byDDqCBzY3JpdHRvIGEgbWFubyBxdWk6IHR1dHRvIGFycml2YSBkYWxsYSBzcGVjaWZpY2EuCmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICJtb2R1bGUiOwppbXBvcnQgZnMgZnJvbSAibm9kZTpmcyI7CmltcG9ydCBwYXRoIGZyb20gIm5vZGU6cGF0aCI7CmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICJub2RlOnVybCI7CmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7CmNvbnN0IEhFUkUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTsKY29uc3QgdG9wbyA9IHJlcXVpcmUoInRvcG9qc29uLWNsaWVudCIpOwpjb25zdCB7IGdlb01lcmNhdG9yLCBnZW9OYXR1cmFsRWFydGgxLCBnZW9QYXRoLCBnZW9Cb3VuZHMgfSA9IHJlcXVpcmUoImQzLWdlbyIpOwpjb25zdCBpc28gPSByZXF1aXJlKCJpMThuLWlzby1jb3VudHJpZXMiKTsKY29uc3Qgd29ybGQgPSByZXF1aXJlKCJ3b3JsZC1hdGxhcy9jb3VudHJpZXMtMTEwbS5qc29uIik7CmNvbnN0IEZDID0gdG9wby5mZWF0dXJlKHdvcmxkLCB3b3JsZC5vYmplY3RzLmNvdW50cmllcyk7Cgpjb25zdCBHT0xEID0gIiNGMkI4NEIiOwpjb25zdCBlc2MgPSAodCkgPT4gU3RyaW5nKHQgPz8gIiIpLnJlcGxhY2UoL1smPD4iXS9nLCAoYykgPT4gKHsgIiYiOiAiJmFtcDsiLCAiPCI6ICImbHQ7IiwgIj4iOiAiJmd0OyIsICciJzogIiZxdW90OyIgfVtjXSkpOwpjb25zdCBNRVNJID0gWyJHRU4iLCAiRkVCIiwgIk1BUiIsICJBUFIiLCAiTUFHIiwgIkdJVSIsICJMVUciLCAiQUdPIiwgIlNFVCIsICJPVFQiLCAiTk9WIiwgIkRJQyJdOwpjb25zdCBkYXRhTGJsID0gKGQpID0+IHsgY29uc3QgW3ksIG0sIGRkXSA9IGQuc3BsaXQoIi0iKS5tYXAoTnVtYmVyKTsgcmV0dXJuIGAke2RkfSAke01FU0lbbSAtIDFdfSAke3l9YDsgfTsKCi8vIC0tLS0tLS0tLS0gbGltaXRpIGRpIHRlc3RvIChpbCBjb250cm9sbG8gImNoZWNrIiBsaSBhcHBsaWNhKSAtLS0tLS0tLS0tCmNvbnN0IExJTSA9IHsgdGFnOiAzMCwgdGl0bGU6IDcwLCBmYWN0OiAxOTAsIHdoeTogMTIwLCBudW06IDgsIG51bV9sYWJlbDogMzQsIGNsYWltOiA2MCwgY292ZXJfdGl0bGU6IDcwLCBzdWI6IDkwIH07CgovLyAtLS0tLS0tLS0tIGZvbnQgLS0tLS0tLS0tLQovLyBmb250IElCTSBQbGV4OiBkYWkgcGFjY2hldHRpIG5wbSBAZm9udHNvdXJjZSAobmVzc3VuIGZpbGUgZGkgZm9udCBuZWwgcmVwbykKY29uc3QgZm9udFBhdGggPSAoZm4pID0+IHsKICBjb25zdCBwa2cgPSBmbi5yZXBsYWNlKC8tbGF0aW4tLiokLywgIiIpOwogIGZvciAoY29uc3QgcCBvZiBbcGF0aC5qb2luKEhFUkUsICJub2RlX21vZHVsZXMiLCAiQGZvbnRzb3VyY2UiLCBwa2csICJmaWxlcyIsIGZuKSwgcGF0aC5qb2luKEhFUkUsICJmb250cyIsIGZuKV0pIGlmIChmcy5leGlzdHNTeW5jKHApKSByZXR1cm4gcDsKICB0aHJvdyBuZXcgRXJyb3IoImZvbnQgbWFuY2FudGU6ICIgKyBmbiArICIgKGVzZWd1aSBucG0gaW5zdGFsbCkiKTsKfTsKY29uc3QgZjY0ID0gKGZuKSA9PiBmcy5yZWFkRmlsZVN5bmMoZm9udFBhdGgoZm4pKS50b1N0cmluZygiYmFzZTY0Iik7CmNvbnN0IEZBQ0VTID0gWwogIFsiUGxleCBTZXJpZiIsIDUwMCwgImlibS1wbGV4LXNlcmlmLWxhdGluLTUwMC1ub3JtYWwud29mZjIiXSwgWyJQbGV4IFNlcmlmIiwgNjAwLCAiaWJtLXBsZXgtc2VyaWYtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiJdLAogIFsiUGxleCBTYW5zIiwgNDAwLCAiaWJtLXBsZXgtc2Fucy1sYXRpbi00MDAtbm9ybWFsLndvZmYyIl0sIFsiUGxleCBTYW5zIiwgNjAwLCAiaWJtLXBsZXgtc2Fucy1sYXRpbi02MDAtbm9ybWFsLndvZmYyIl0sCiAgWyJQbGV4IE1vbm8iLCA1MDAsICJpYm0tcGxleC1tb25vLWxhdGluLTUwMC1ub3JtYWwud29mZjIiXSwKXS5tYXAoKFtmYW0sIHcsIGZuXSkgPT4gYEBmb250LWZhY2V7Zm9udC1mYW1pbHk6JyR7ZmFtfSc7Zm9udC13ZWlnaHQ6JHt3fTtzcmM6dXJsKGRhdGE6Zm9udC93b2ZmMjtiYXNlNjQsJHtmNjQoZm4pfSkgZm9ybWF0KCd3b2ZmMicpfWApLmpvaW4oIiIpOwoKY29uc3QgQ1NTID0gRkFDRVMgKyBgCip7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowfQpib2R5e2JhY2tncm91bmQ6IzAwMH0KLnN7cG9zaXRpb246cmVsYXRpdmU7YmFja2dyb3VuZDojMEUxNTFCO2NvbG9yOiNFNEVBRUY7Zm9udC1mYW1pbHk6J1BsZXggU2Fucycsc2Fucy1zZXJpZjtvdmVyZmxvdzpoaWRkZW47ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbn0KLnM6OmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0Oi0yNjBweDt0b3A6LTI2MHB4O3dpZHRoOjkwMHB4O2hlaWdodDo5MDBweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMzQsMTgwLDIzNCwuMzApLHJnYmEoMTM0LDE4MCwyMzQsMCkgNjglKX0KLnM6OmFmdGVye2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowO2JvdHRvbTowO3dpZHRoOjEwcHg7YmFja2dyb3VuZDojODZCNEVBfQoudG9wLC5taWQsLmZvb3R7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxfQoudG9we2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXJ9Ci5icmFuZHtmb250LWZhbWlseTonUGxleCBTZXJpZicsc2VyaWY7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZTozNnB4fQoubGFie2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXdlaWdodDo1MDA7bGV0dGVyLXNwYWNpbmc6LjA4ZW07Y29sb3I6Izg2QjRFQTtmb250LXNpemU6MjVweH0KLm1pZHtmbGV4OjE7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjttaW4taGVpZ2h0OjA7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nLXRvcDo0MHB4fQouZm9vdHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Y29sb3I6IzZGN0Q4OTtmb250LXNpemU6MjVweDtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2V9Ci5jdGF7ZGlzcGxheTpibG9jaztjb2xvcjojODZCNEVBO2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6NDZweDtsZXR0ZXItc3BhY2luZzouMDFlbTtib3JkZXItdG9wOjJweCBzb2xpZCAjMzQ0NzVBO3BhZGRpbmctdG9wOjM2cHh9Ci5nb2xke2NvbG9yOiR7R09MRH19Ci5ra3tmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Zm9udC13ZWlnaHQ6NTAwO2xldHRlci1zcGFjaW5nOi4xZW07Y29sb3I6JHtHT0xEfTtmb250LXNpemU6MzBweDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2V9Ci5iaWd7Zm9udC1mYW1pbHk6J1BsZXggU2VyaWYnLHNlcmlmO2ZvbnQtd2VpZ2h0OjYwMDtsaW5lLWhlaWdodDoxLjA2O2ZvbnQtc2l6ZTo5MnB4O3RleHQtd3JhcDpiYWxhbmNlfQouZmFjdHtsaW5lLWhlaWdodDoxLjM7Y29sb3I6I0U0RUFFRn0KLnJvd3twYWRkaW5nLWxlZnQ6MjhweDtib3JkZXItbGVmdDo2cHggc29saWQgIzg2QjRFQX0KLnJvdy5ne2JvcmRlci1jb2xvcjoke0dPTER9fQoucm93IGJ7ZGlzcGxheTpibG9jaztmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Zm9udC13ZWlnaHQ6NTAwO2ZvbnQtc2l6ZToyOHB4O2xldHRlci1zcGFjaW5nOi4xZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2NvbG9yOiM4NkI0RUE7bWFyZ2luLWJvdHRvbToxMHB4fQoucm93LmcgYntjb2xvcjoke0dPTER9fQoucm93IHNwYW57bGluZS1oZWlnaHQ6MS4zO2NvbG9yOiNDOUQzREJ9Ci5saXtkaXNwbGF5OmZsZXg7Z2FwOjI2cHg7YWxpZ24taXRlbXM6YmFzZWxpbmU7bWFyZ2luLXRvcDozNHB4O2ZvbnQtc2l6ZTo0NnB4O2xpbmUtaGVpZ2h0OjEuMjtmb250LWZhbWlseTonUGxleCBTZXJpZicsc2VyaWY7Zm9udC13ZWlnaHQ6NTAwfQoubGkgaXtmb250LXN0eWxlOm5vcm1hbDtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Y29sb3I6JHtHT0xEfTtmb250LXNpemU6MzRweH0KYDsKY29uc3QgRklUID0gIjxzY3JpcHQ+ZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbigoKT0+e2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZpdF0nKS5mb3JFYWNoKGU9PntsZXQgZnM9cGFyc2VJbnQoZS5kYXRhc2V0LmZpdCk7ZS5zdHlsZS5mb250U2l6ZT1mcysncHgnO2NvbnN0IGxpbT1wYXJzZUludChlLmRhdGFzZXQubWF4fHwnNDAwJyk7d2hpbGUoZS5zY3JvbGxIZWlnaHQ+bGltJiZmcz4zMCl7ZnMtPTI7ZS5zdHlsZS5mb250U2l6ZT1mcysncHgnfX0pO2RvY3VtZW50LmJvZHkuZGF0YXNldC5yZWFkeT0nMSd9KTwvc2NyaXB0PiI7CgovLyAtLS0tLS0tLS0tIG1hcHBlIC0tLS0tLS0tLS0KY29uc3QgTlVNID0ge307IC8vIG51bWVyaWMgaWQgLT4gZmVhdHVyZQpmb3IgKGNvbnN0IGYgb2YgRkMuZmVhdHVyZXMpIE5VTVtTdHJpbmcocGFyc2VJbnQoZi5pZCkpXSA9IGY7CmZ1bmN0aW9uIGZlYXRPZihhMykgewogIGNvbnN0IG4gPSBpc28uYWxwaGEzVG9OdW1lcmljKGEzKTsKICByZXR1cm4gbiA/IE5VTVtTdHJpbmcocGFyc2VJbnQobikpXSA6IG51bGw7Cn0KZnVuY3Rpb24gbWFwU3ZnKGNvZGVzKSB7CiAgY29uc3QgVyA9IDEwMDAsIEggPSA3MDA7CiAgY29uc3QgaGkgPSBjb2Rlcy5tYXAoZmVhdE9mKS5maWx0ZXIoQm9vbGVhbik7CiAgY29uc3QgaGlTZXQgPSBuZXcgU2V0KGhpKTsKICBsZXQgcHJvajsKICBsZXQgW3gwLCB5MCwgeDEsIHkxXSA9IFsxZTksIDFlOSwgLTFlOSwgLTFlOV07CiAgZm9yIChjb25zdCBmIG9mIGhpKSB7IGNvbnN0IFtbYSwgYl0sIFtjLCBkXV0gPSBnZW9Cb3VuZHMoZik7IHgwID0gTWF0aC5taW4oeDAsIGEpOyB5MCA9IE1hdGgubWluKHkwLCBiKTsgeDEgPSBNYXRoLm1heCh4MSwgYyk7IHkxID0gTWF0aC5tYXgoeTEsIGQpOyB9CiAgY29uc3Qgc3BhbiA9IE1hdGgubWF4KHgxIC0geDAsIHkxIC0geTApOwogIGlmICghaGkubGVuZ3RoIHx8IHNwYW4gPiAxMDApIHsKICAgIHByb2ogPSBnZW9OYXR1cmFsRWFydGgxKCkuZml0U2l6ZShbVywgSF0sIHsgdHlwZTogIlNwaGVyZSIgfSk7CiAgfSBlbHNlIHsKICAgIGNvbnN0IHBhZCA9IE1hdGgubWluKDEyLCBNYXRoLm1heCgwLjksIDMwIC8gc3BhbikpOwogICAgY29uc3QgZHggPSAoKHgxIC0geDApICogcGFkKSAvIDIgKyAyLCBkeSA9ICgoeTEgLSB5MCkgKiBwYWQpIC8gMiArIDI7CiAgICBwcm9qID0gZ2VvTWVyY2F0b3IoKS5maXRTaXplKFtXLCBIXSwgeyB0eXBlOiAiTXVsdGlQb2ludCIsIGNvb3JkaW5hdGVzOiBbW3gwIC0gZHgsIHkwIC0gZHldLCBbeDEgKyBkeCwgeTEgKyBkeV1dIH0pOwogIH0KICBjb25zdCBwID0gZ2VvUGF0aChwcm9qKTsKICBsZXQgcyA9IGA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwICR7V30gJHtIfSIgd2lkdGg9IiR7V30iIGhlaWdodD0iJHtIfSI+YDsKICBmb3IgKGNvbnN0IGYgb2YgRkMuZmVhdHVyZXMpIHsKICAgIGNvbnN0IGhsID0gaGlTZXQuaGFzKGYpOwogICAgcyArPSBgPHBhdGggZD0iJHtwKGYpIHx8ICIifSIgZmlsbD0iJHtobCA/IEdPTEQgOiAiIzFFMkIzNiJ9IiBzdHJva2U9IiR7aGwgPyAiI0ZGRTJBOCIgOiAiIzM0NDc1QSJ9IiBzdHJva2Utd2lkdGg9IiR7aGwgPyAyLjUgOiAxLjV9Ii8+YDsKICB9CiAgcmV0dXJuIHMgKyAiPC9zdmc+IjsKfQpjb25zdCBiNjQgPSAocykgPT4gQnVmZmVyLmZyb20ocykudG9TdHJpbmcoImJhc2U2NCIpOwoKLy8gLS0tLS0tLS0tLSBwYWdpbmUgLS0tLS0tLS0tLQpjb25zdCBXID0gMTA4MCwgSCA9IDEzNTAsIFBBRCA9IFs2NiwgNTYsIDY0XTsKZnVuY3Rpb24gcGFnZShzcGVjLCBib2R5LCBuLCB0b3QpIHsKICBjb25zdCBbdCwgYnQsIHNkXSA9IFBBRDsKICBjb25zdCB0b3AgPSBgPGRpdiBjbGFzcz0idG9wIj48c3BhbiBjbGFzcz0iYnJhbmQiPlJlYWQgR2VvcG9saXRpY3M8L3NwYW4+PHNwYW4gY2xhc3M9ImxhYiI+JHtkYXRhTGJsKHNwZWMuZGF0ZSl9PC9zcGFuPjwvZGl2PmA7CiAgY29uc3QgZm9vdCA9IGA8ZGl2IGNsYXNzPSJmb290Ij48c3Bhbj4ke24gPCB0b3QgPyAic2NvcnJpIOKGkiIgOiAiIn08L3NwYW4+PHNwYW4+JHtufS8ke3RvdH08L3NwYW4+PC9kaXY+YDsKICByZXR1cm4gYDwhZG9jdHlwZSBodG1sPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48c3R5bGU+JHtDU1N9PC9zdHlsZT48Ym9keT48ZGl2IGNsYXNzPSJzIiBzdHlsZT0id2lkdGg6JHtXfXB4O2hlaWdodDoke0h9cHg7cGFkZGluZzoke3R9cHggJHtzZH1weCAke2J0fXB4ICR7c2QgKyAxMH1weCI+JHt0b3B9PGRpdiBjbGFzcz0ibWlkIj4ke2JvZHl9PC9kaXY+JHtmb290fTwvZGl2PiR7RklUfTwvYm9keT5gOwp9CmZ1bmN0aW9uIGNvdmVyU2xpZGUoc3BlYywgbiwgdG90KSB7CiAgY29uc3QgYyA9IHNwZWMuY292ZXIgfHwge307CiAgbGV0IGJvZHk7CiAgaWYgKGMudmFyaWFudCA9PT0gImNsYWltIikgewogICAgY29uc3QgW2EsIGJdID0gU3RyaW5nKGMuY2xhaW0gfHwgIiIpLnNwbGl0KCJ8Iik7CiAgICBib2R5ID0gYDxkaXYgY2xhc3M9ImtrIj5JbCBtb25kbyBvZ2dpPC9kaXY+PGRpdiBjbGFzcz0iYmlnIiBzdHlsZT0iZm9udC1zaXplOjEyMHB4O21hcmdpbi10b3A6MjZweCI+JHtlc2MoYSl9IDxzcGFuIGNsYXNzPSJnb2xkIj4ke2VzYyhiIHx8ICIiKX08L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0iZmFjdCIgc3R5bGU9Im1hcmdpbi10b3A6NTBweDtmb250LXNpemU6NDhweCI+JHtlc2MoYy5zdWIgfHwgIiIpfTwvZGl2PmA7CiAgfSBlbHNlIHsKICAgIGNvbnN0IGl0ZW1zID0gc3BlYy5zdG9yaWVzLm1hcCgoeCwgaykgPT4gYDxkaXYgY2xhc3M9ImxpIj48aT4wJHtrICsgMX08L2k+PHNwYW4+JHtlc2MoU3RyaW5nKHgudGl0bGUpLnJlcGxhY2UoL1wuJC8sICIiKSl9PC9zcGFuPjwvZGl2PmApLmpvaW4oIiIpOwogICAgYm9keSA9IGA8ZGl2IGNsYXNzPSJrayI+SWwgbW9uZG8gb2dnaTwvZGl2PjxkaXYgY2xhc3M9ImJpZyIgc3R5bGU9ImZvbnQtc2l6ZToxMDRweDttYXJnaW4tdG9wOjIycHgiPiR7ZXNjKGMudGl0bGUgfHwgIkNvc2Egw6ggc3VjY2Vzc28gb2dnaSBuZWwgbW9uZG8/Iil9PC9kaXY+JHtpdGVtc31gOwogIH0KICByZXR1cm4gcGFnZShzcGVjLCBib2R5LCBuLCB0b3QpOwp9CmZ1bmN0aW9uIHN0b3J5U2xpZGUoc3BlYywgeCwgbiwgdG90KSB7CiAgY29uc3QgYm9keSA9IGA8ZGl2IGNsYXNzPSJrayI+JHtlc2MoeC50YWcpfTwvZGl2Pgo8ZGl2IHN0eWxlPSJwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjIwcHg7aGVpZ2h0OjQwMHB4O2JvcmRlci1yYWRpdXM6MjZweDtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDojMEExMDE2O2JvcmRlcjoycHggc29saWQgIzI3MzUzRiI+PGltZyBzcmM9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJHtiNjQobWFwU3ZnKHguY291bnRyaWVzIHx8IFtdKSl9IiBzdHlsZT0id2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtvYmplY3QtZml0OmNvdmVyIj4KPGRpdiBzdHlsZT0icG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7cGFkZGluZzo2MHB4IDMwcHggMjRweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgwZGVnLHJnYmEoMTAsMTYsMjIsLjk2KSxyZ2JhKDEwLDE2LDIyLDApKSI+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJztmb250LXdlaWdodDo2MDA7Zm9udC1zaXplOjEwNHB4O2xpbmUtaGVpZ2h0OjE7d2hpdGUtc3BhY2U6bm93cmFwO2NvbG9yOiR7R09MRH0iPiR7ZXNjKHgubnVtKX08L3NwYW4+IDxzcGFuIHN0eWxlPSJmb250LWZhbWlseTonUGxleCBNb25vJztmb250LXNpemU6MzBweDtsZXR0ZXItc3BhY2luZzouMDZlbTtjb2xvcjojRTRFQUVGO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTttYXJnaW4tbGVmdDoxMnB4Ij4ke2VzYyh4Lm51bV9sYWJlbCl9PC9zcGFuPjwvZGl2PjwvZGl2Pgo8ZGl2IGNsYXNzPSJiaWciIGRhdGEtZml0PSI4MCIgZGF0YS1tYXg9IjIwMCIgc3R5bGU9Im1hcmdpbi10b3A6MjhweCI+JHtlc2MoeC50aXRsZSl9PC9kaXY+CjxkaXYgY2xhc3M9ImZhY3QiIHN0eWxlPSJmb250LXNpemU6MzhweDttYXJnaW4tdG9wOjIycHgiPiR7ZXNjKHguZmFjdCl9PC9kaXY+CjxkaXYgY2xhc3M9InJvdyBnIiBzdHlsZT0ibWFyZ2luLXRvcDoyMnB4Ij48Yj5QZXJjaMOpIGNvbnRhPC9iPjxzcGFuIHN0eWxlPSJmb250LXNpemU6MzRweCI+JHtlc2MoeC53aHkpfTwvc3Bhbj48L2Rpdj5gOwogIHJldHVybiBwYWdlKHNwZWMsIGJvZHksIG4sIHRvdCk7Cn0KZnVuY3Rpb24gcHJvb2ZTbGlkZShzcGVjLCBuLCB0b3QpIHsKICBjb25zdCBpdGVtcyA9IFtbIjAxIiwgIkkgZmF0dGkgdmVyaWZpY2F0aSwgc2VwYXJhdGkgZGFsbCdpbnRlcnByZXRhemlvbmUiXSwgWyIwMiIsICJMZSBkdWUgdGVzaSwgY2lhc2N1bmEgbmVsbGEgc3VhIHZlcnNpb25lIHBpw7kgZm9ydGUiXSwgWyIwMyIsICJMZSBmb250aSwgYW5jaGUgcXVhbmRvIHNpIGNvbnRyYWRkaWNvbm8iXSwgWyIwNCIsICJMYSBjcm9ub2xvZ2lhOiBjb21lIHNpYW1vIGFycml2YXRpIGZpbiBxdWkiXV07CiAgY29uc3QgbGkgPSBpdGVtcy5tYXAoKFthLCBiXSkgPT4gYDxkaXYgY2xhc3M9ImxpIj48aT4ke2F9PC9pPjxzcGFuPiR7ZXNjKGIpfTwvc3Bhbj48L2Rpdj5gKS5qb2luKCIiKTsKICByZXR1cm4gcGFnZShzcGVjLCBgPGRpdiBjbGFzcz0ia2siPk5lbGxhIGRhc2hib2FyZCwgcGVyIG9nbmkgc3RvcmlhPC9kaXY+PGRpdiBjbGFzcz0iYmlnIiBzdHlsZT0iZm9udC1zaXplOjg0cHg7bWFyZ2luLXRvcDoyMHB4Ij5Ob24gc29sbyBsYSBub3RpemlhOiBpbCBjb250ZXN0by48L2Rpdj4ke2xpfWAsIG4sIHRvdCk7Cn0KZnVuY3Rpb24gY3RhU2xpZGUoc3BlYywgbiwgdG90KSB7CiAgcmV0dXJuIHBhZ2Uoc3BlYywgYDxkaXYgY2xhc3M9ImtrIj5JbCBjb250ZXN0byBjb21wbGV0bzwvZGl2PjxkaXYgY2xhc3M9ImJpZyIgc3R5bGU9ImZvbnQtc2l6ZTo5NnB4O21hcmdpbi10b3A6MjBweCI+Q3Jvbm9sb2dpYSwgdGVzaSBlIGZvbnRpIGRpIG9nbmkgc3RvcmlhLiBPZ25pIG1hdHRpbmEuPC9kaXY+PGRpdiBzdHlsZT0ibWFyZ2luLXRvcDo2NHB4Ij48c3BhbiBjbGFzcz0iY3RhIj5JbCBsaW5rIMOoIG5lbGxhIGJpbyBkZWwgcHJvZmlsbzwvc3Bhbj48cCBzdHlsZT0iZm9udC1zaXplOjM0cHg7Y29sb3I6IzlBQThCMzttYXJnaW4tdG9wOjIwcHgiPkRhc2hib2FyZCBncmF0dWl0YSwgYWNjZXNzbyBjb24gbGEgdHVhIGVtYWlsPC9wPjwvZGl2PmAsIG4sIHRvdCk7Cn0KCi8vIC0tLS0tLS0tLS0gY29udHJvbGxvIC0tLS0tLS0tLS0KZnVuY3Rpb24gY2hlY2soc3BlYykgewogIGNvbnN0IGVyciA9IFtdOwogIGlmICghL15cZHs0fS1cZHsyfS1cZHsyfSQvLnRlc3Qoc3BlYy5kYXRlIHx8ICIiKSkgZXJyLnB1c2goImRhdGU6IGZvcm1hdG8gWVlZWS1NTS1ERCIpOwogIGlmICghQXJyYXkuaXNBcnJheShzcGVjLnN0b3JpZXMpIHx8IHNwZWMuc3Rvcmllcy5sZW5ndGggPCAyIHx8IHNwZWMuc3Rvcmllcy5sZW5ndGggPiA2KSBlcnIucHVzaCgic3RvcmllczogZGEgMiBhIDYgc3RvcmllIik7CiAgKHNwZWMuc3RvcmllcyB8fCBbXSkuZm9yRWFjaCgoeCwgaSkgPT4gewogICAgZm9yIChjb25zdCBrIG9mIFsidGFnIiwgInRpdGxlIiwgImZhY3QiLCAid2h5IiwgIm51bSIsICJudW1fbGFiZWwiXSkgewogICAgICBpZiAoIXhba10pIGVyci5wdXNoKGBzdG9yaWVzWyR7aX1dLiR7a306IG1hbmNhbnRlYCk7CiAgICAgIGVsc2UgaWYgKFN0cmluZyh4W2tdKS5sZW5ndGggPiBMSU1ba10pIGVyci5wdXNoKGBzdG9yaWVzWyR7aX1dLiR7a306ICR7U3RyaW5nKHhba10pLmxlbmd0aH0gY2FyYXR0ZXJpLCBtYXNzaW1vICR7TElNW2tdfWApOwogICAgfQogICAgaWYgKCFBcnJheS5pc0FycmF5KHguY291bnRyaWVzKSB8fCAheC5jb3VudHJpZXMubGVuZ3RoKSBlcnIucHVzaChgc3Rvcmllc1ske2l9XS5jb3VudHJpZXM6IHNlcnZlIGFsbWVubyB1biBjb2RpY2UgSVNPM2ApOwogICAgZWxzZSBmb3IgKGNvbnN0IGMgb2YgeC5jb3VudHJpZXMpIGlmICghZmVhdE9mKGMpKSBlcnIucHVzaChgc3Rvcmllc1ske2l9XS5jb3VudHJpZXM6IGNvZGljZSBub24gcmljb25vc2NpdXRvIHN1bGxhIG1hcHBhOiAke2N9YCk7CiAgfSk7CiAgY29uc3QgYyA9IHNwZWMuY292ZXIgfHwge307CiAgaWYgKGMudmFyaWFudCA9PT0gImNsYWltIikgewogICAgaWYgKCFTdHJpbmcoYy5jbGFpbSB8fCAiIikuaW5jbHVkZXMoInwiKSkgZXJyLnB1c2goImNvdmVyLmNsYWltOiBmb3JtYXRvICdwcmltYSBwYXJ0ZXxwYXJ0ZSBpbiBvcm8nIik7CiAgICBpZiAoU3RyaW5nKGMuY2xhaW0gfHwgIiIpLmxlbmd0aCA+IExJTS5jbGFpbSkgZXJyLnB1c2goYGNvdmVyLmNsYWltOiBtYXNzaW1vICR7TElNLmNsYWltfSBjYXJhdHRlcmlgKTsKICAgIGlmIChTdHJpbmcoYy5zdWIgfHwgIiIpLmxlbmd0aCA+IExJTS5zdWIpIGVyci5wdXNoKGBjb3Zlci5zdWI6IG1hc3NpbW8gJHtMSU0uc3VifSBjYXJhdHRlcmlgKTsKICB9CiAgaWYgKCFzcGVjLmNhcHRpb24gfHwgc3BlYy5jYXB0aW9uLmxlbmd0aCA8IDQwKSBlcnIucHVzaCgiY2FwdGlvbjogbWFuY2FudGUgbyB0cm9wcG8gY29ydGEiKTsKICByZXR1cm4gZXJyOwp9CgovLyAtLS0tLS0tLS0tIHJlbmRlciAtLS0tLS0tLS0tCmFzeW5jIGZ1bmN0aW9uIGxvYWRDaHJvbWl1bSgpIHsKICBmb3IgKGNvbnN0IHAgb2YgWyJwbGF5d3JpZ2h0IiwgIi9ob21lL2NsYXVkZS8ubnBtLWdsb2JhbC9saWIvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIl0pIHsKICAgIHRyeSB7IHJldHVybiAoYXdhaXQgaW1wb3J0KHApKS5jaHJvbWl1bTsgfSBjYXRjaCAoZSkge30KICB9CiAgdGhyb3cgbmV3IEVycm9yKCJQbGF5d3JpZ2h0IG5vbiB0cm92YXRvOiBucG0gaSAtZyBwbGF5d3JpZ2h0Iik7Cn0KYXN5bmMgZnVuY3Rpb24gcmVuZGVyQWxsKGh0bWxzLCBvdXREaXIpIHsKICBmcy5ta2RpclN5bmMocGF0aC5qb2luKG91dERpciwgImpwZyIpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKICBmcy5ta2RpclN5bmMocGF0aC5qb2luKG91dERpciwgImh0bWwiKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7CiAgY29uc3QgY2hyb21pdW0gPSBhd2FpdCBsb2FkQ2hyb21pdW0oKTsKICBjb25zdCBiciA9IGF3YWl0IGNocm9taXVtLmxhdW5jaCh7IGV4ZWN1dGFibGVQYXRoOiBwcm9jZXNzLmVudi5DSFJPTUlVTSB8fCAoZnMuZXhpc3RzU3luYygiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIpID8gIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iIDogdW5kZWZpbmVkKSwgYXJnczogWyItLW5vLXNhbmRib3giXSB9KTsKICBjb25zdCBwcm9ibGVtcyA9IFtdOwogIGZvciAobGV0IGkgPSAwOyBpIDwgaHRtbHMubGVuZ3RoOyBpKyspIHsKICAgIGNvbnN0IG5hbWUgPSBTdHJpbmcoaSArIDEpLnBhZFN0YXJ0KDIsICIwIik7CiAgICBjb25zdCBocCA9IHBhdGgucmVzb2x2ZShvdXREaXIsICJodG1sIiwgbmFtZSArICIuaHRtbCIpOwogICAgZnMud3JpdGVGaWxlU3luYyhocCwgaHRtbHNbaV0pOwogICAgY29uc3QgcGcgPSBhd2FpdCBici5uZXdQYWdlKHsgdmlld3BvcnQ6IHsgd2lkdGg6IFcsIGhlaWdodDogSCB9IH0pOwogICAgYXdhaXQgcGcuZ290bygiZmlsZTovLyIgKyBocCk7CiAgICBhd2FpdCBwZy53YWl0Rm9yU2VsZWN0b3IoImJvZHlbZGF0YS1yZWFkeV0iKTsKICAgIGNvbnN0IG92ZXIgPSBhd2FpdCBwZy5ldmFsdWF0ZSgoKSA9PiB7IGNvbnN0IG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIubWlkIik7IHJldHVybiBtLnNjcm9sbEhlaWdodCAtIG0uY2xpZW50SGVpZ2h0OyB9KTsKICAgIGlmIChvdmVyID4gNCkgcHJvYmxlbXMucHVzaChgc2xpZGUgJHtuYW1lfTogaWwgdGVzdG8gc2ZvcmEgZGkgJHtvdmVyfXB4LCBhY2NvcmNpYSBpIHRlc3RpYCk7CiAgICBhd2FpdCBwZy5zY3JlZW5zaG90KHsgcGF0aDogcGF0aC5qb2luKG91dERpciwgImpwZyIsIG5hbWUgKyAiLmpwZyIpLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDkyIH0pOwogICAgYXdhaXQgcGcuY2xvc2UoKTsKICB9CiAgYXdhaXQgYnIuY2xvc2UoKTsKICByZXR1cm4gcHJvYmxlbXM7Cn0KCmNvbnN0IFtjbWQsIHNwZWNQYXRoLCBvdXREaXJdID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpOwppZiAoIWNtZCB8fCAhc3BlY1BhdGgpIHsgY29uc29sZS5sb2coInVzbzogbm9kZSBpZ2tpdC5tanMgY2hlY2t8ZGFpbHkgU1BFQy5qc29uIFtPVVRfRElSXSIpOyBwcm9jZXNzLmV4aXQoMik7IH0KY29uc3Qgc3BlYyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHNwZWNQYXRoLCAidXRmOCIpKTsKY29uc3QgZXJycyA9IGNoZWNrKHNwZWMpOwppZiAoZXJycy5sZW5ndGgpIHsgY29uc29sZS5sb2coIkVSUk9SSSBORUxMQSBTUEVDSUZJQ0E6XG4tICIgKyBlcnJzLmpvaW4oIlxuLSAiKSk7IHByb2Nlc3MuZXhpdCgxKTsgfQppZiAoY21kID09PSAiY2hlY2siKSB7IGNvbnNvbGUubG9nKCJzcGVjaWZpY2Egb2siKTsgcHJvY2Vzcy5leGl0KDApOyB9CmlmIChjbWQgPT09ICJkYWlseSIpIHsKICBjb25zdCBuID0gc3BlYy5zdG9yaWVzLmxlbmd0aCwgdG90ID0gbiArIDM7CiAgY29uc3QgaHRtbHMgPSBbY292ZXJTbGlkZShzcGVjLCAxLCB0b3QpLCAuLi5zcGVjLnN0b3JpZXMubWFwKCh4LCBpKSA9PiBzdG9yeVNsaWRlKHNwZWMsIHgsIGkgKyAyLCB0b3QpKSwgcHJvb2ZTbGlkZShzcGVjLCBuICsgMiwgdG90KSwgY3RhU2xpZGUoc3BlYywgdG90LCB0b3QpXTsKICBjb25zdCBwcm9ibGVtcyA9IGF3YWl0IHJlbmRlckFsbChodG1scywgb3V0RGlyKTsKICBpZiAocHJvYmxlbXMubGVuZ3RoKSB7IGNvbnNvbGUubG9nKCJQUk9CTEVNSSBESSBMQVlPVVQ6XG4tICIgKyBwcm9ibGVtcy5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0KICBjb25zb2xlLmxvZyhgb2s6ICR7dG90fSBpbW1hZ2luaSBpbiAke291dERpcn0vanBnYCk7Cn0K",
  "package.json": "ewogIm5hbWUiOiAiaWdraXQiLAogInZlcnNpb24iOiAiMS4wLjAiLAogInR5cGUiOiAibW9kdWxlIiwKICJkZXBlbmRlbmNpZXMiOiB7CiAgImQzLWdlbyI6ICJeMy4xLjEiLAogICJpMThuLWlzby1jb3VudHJpZXMiOiAiXjcuMTQuMCIsCiAgInRvcG9qc29uLWNsaWVudCI6ICJeMy4xLjAiLAogICJ3b3JsZC1hdGxhcyI6ICJeMi4wLjIiLAogICJwbGF5d3JpZ2h0IjogIl4xLjQ4LjAiLAogICJAZm9udHNvdXJjZS9pYm0tcGxleC1zZXJpZiI6ICJeNS4zLjAiLAogICJAZm9udHNvdXJjZS9pYm0tcGxleC1zYW5zIjogIl41LjMuMCIsCiAgIkBmb250c291cmNlL2libS1wbGV4LW1vbm8iOiAiXjUuMy4wIgogfQp9",
  "rubriche.mjs": "Ly8gcnVicmljaGUubWpzIOKAlCBjYXJvc2VsbGkgZGVsbGUgcnVicmljaGUgZGkgUmVhZCBHZW9wb2xpdGljcyAoMTA4MHgxMzUwKSwgZGEgc3BlY2lmaWNhIEpTT04uCi8vIHVzbzogIG5vZGUgcnVicmljaGUubWpzIGNoZWNrICBTUEVDLmpzb24gW0RBVEkuanNvbiAuLi5dICAgKGNvbiBpIGZpbGUgZGF0aSBsZXR0aTogY29udHJvbGxpIHNlbWFudGljaSkKLy8gICAgICAgbm9kZSBydWJyaWNoZS5tanMgcmVuZGVyIFNQRUMuanNvbiBPVVRfRElSICAgLT4gT1VUX0RJUi9qcGcvMDEuanBnIC4uLgovLyBUdXR0byBhcnJpdmEgZGFsbGEgc3BlY2lmaWNhOiBuZXNzdW4gZGF0byBzY3JpdHRvIHF1aS4gVml2ZSBhY2NhbnRvIGEgaWdraXQubWpzIChzdGVzc2kgZm9udCkuCmltcG9ydCBmcyBmcm9tICJub2RlOmZzIjsKaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAibm9kZTpjaGlsZF9wcm9jZXNzIjsKaW1wb3J0IHBhdGggZnJvbSAibm9kZTpwYXRoIjsKaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gIm5vZGU6dXJsIjsKY29uc3QgSEVSRSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpOwpjb25zdCBHT0xEID0gIiNGMkI4NEIiOwpjb25zdCBlc2MgPSAodCkgPT4gU3RyaW5nKHQgPz8gIiIpLnJlcGxhY2UoL1smPD4iXS9nLCAoYykgPT4gKHsgIiYiOiAiJmFtcDsiLCAiPCI6ICImbHQ7IiwgIj4iOiAiJmd0OyIsICciJzogIiZxdW90OyIgfVtjXSkpLnJlcGxhY2UoL1xkKyg/OlsuLF1cZCspP1st4oCTXVxkKyg/OlsuLF1cZCspPy9nLCAobSkgPT4gYDxzcGFuIHN0eWxlPSJ3aGl0ZS1zcGFjZTpub3dyYXAiPiR7bX08L3NwYW4+YCk7Ci8vICp0ZXN0byogPSBpbiBvcm8KY29uc3QgaGwgPSAodCkgPT4gZXNjKHQpLnJlcGxhY2UoL1wqKFteKl0rKVwqL2csICc8c3BhbiBjbGFzcz0iZ29sZCI+JDE8L3NwYW4+Jyk7CmNvbnN0IE1FU0kgPSBbIkdFTiIsICJGRUIiLCAiTUFSIiwgIkFQUiIsICJNQUciLCAiR0lVIiwgIkxVRyIsICJBR08iLCAiU0VUIiwgIk9UVCIsICJOT1YiLCAiRElDIl07CmNvbnN0IGRhdGFMYmwgPSAoZCkgPT4geyBjb25zdCBbeSwgbSwgZGRdID0gZC5zcGxpdCgiLSIpLm1hcChOdW1iZXIpOyByZXR1cm4gYCR7ZGR9ICR7TUVTSVttIC0gMV19ICR7eX1gOyB9OwoKLy8gLS0tLS0tLS0tLSBmb250IC0tLS0tLS0tLS0KbGV0IGZvbnRzVHJpZWQgPSBmYWxzZTsKY29uc3QgZm9udFBhdGggPSAoZm4pID0+IHsKICBjb25zdCBwa2cgPSBmbi5yZXBsYWNlKC8tbGF0aW4tLiokLywgIiIpOwogIGNvbnN0IEhPTUUgPSBwcm9jZXNzLmVudi5IT01FIHx8ICIvcm9vdCI7CiAgY29uc3QgY2FuZHMgPSAoKSA9PiBbcGF0aC5qb2luKEhFUkUsICJub2RlX21vZHVsZXMiLCAiQGZvbnRzb3VyY2UiLCBwa2csICJmaWxlcyIsIGZuKSwgcGF0aC5qb2luKEhFUkUsICJmb250cyIsIGZuKSwgcGF0aC5qb2luKEhPTUUsICJpZ2tpdCIsICJub2RlX21vZHVsZXMiLCAiQGZvbnRzb3VyY2UiLCBwa2csICJmaWxlcyIsIGZuKSwgcGF0aC5qb2luKEhPTUUsICJpZ2tpdCIsICJmb250cyIsIGZuKSwgcGF0aC5qb2luKCIvdG1wL2lna2l0L25vZGVfbW9kdWxlcy9AZm9udHNvdXJjZSIsIHBrZywgImZpbGVzIiwgZm4pLCBwYXRoLmpvaW4oIi90bXAvcmsvbnBtZi9ub2RlX21vZHVsZXMvQGZvbnRzb3VyY2UiLCBwa2csICJmaWxlcyIsIGZuKSwgcGF0aC5qb2luKCIvdG1wL3JrL2ZvbnRzIiwgZm4pXTsKICBmb3IgKGNvbnN0IHAgb2YgY2FuZHMoKSkgaWYgKGZzLmV4aXN0c1N5bmMocCkpIHJldHVybiBwOwogIGlmICghZm9udHNUcmllZCkgewogICAgZm9udHNUcmllZCA9IHRydWU7CiAgICBzcGF3blN5bmMoIm5wbSIsIFsiaSIsICItLW5vLWF1ZGl0IiwgIi0tbm8tZnVuZCIsICItLXByZWZpeCIsICIvdG1wL3JrL25wbWYiLCAiQGZvbnRzb3VyY2UvaWJtLXBsZXgtc2VyaWYiLCAiQGZvbnRzb3VyY2UvaWJtLXBsZXgtc2FucyIsICJAZm9udHNvdXJjZS9pYm0tcGxleC1tb25vIl0sIHsgc3RkaW86ICJpbmhlcml0IiB9KTsKICAgIGZvciAoY29uc3QgcCBvZiBjYW5kcygpKSBpZiAoZnMuZXhpc3RzU3luYyhwKSkgcmV0dXJuIHA7CiAgfQogIHRocm93IG5ldyBFcnJvcigiZm9udCBtYW5jYW50ZTogIiArIGZuKTsKfTsKY29uc3QgZjY0ID0gKGZuKSA9PiBmcy5yZWFkRmlsZVN5bmMoZm9udFBhdGgoZm4pKS50b1N0cmluZygiYmFzZTY0Iik7CmNvbnN0IEZBQ0VTID0gWwogIFsiUGxleCBTZXJpZiIsIDUwMCwgImlibS1wbGV4LXNlcmlmLWxhdGluLTUwMC1ub3JtYWwud29mZjIiXSwgWyJQbGV4IFNlcmlmIiwgNjAwLCAiaWJtLXBsZXgtc2VyaWYtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiJdLAogIFsiUGxleCBTYW5zIiwgNDAwLCAiaWJtLXBsZXgtc2Fucy1sYXRpbi00MDAtbm9ybWFsLndvZmYyIl0sIFsiUGxleCBTYW5zIiwgNjAwLCAiaWJtLXBsZXgtc2Fucy1sYXRpbi02MDAtbm9ybWFsLndvZmYyIl0sCiAgWyJQbGV4IE1vbm8iLCA1MDAsICJpYm0tcGxleC1tb25vLWxhdGluLTUwMC1ub3JtYWwud29mZjIiXSwKXS5tYXAoKFtmYW0sIHcsIGZuXSkgPT4gYEBmb250LWZhY2V7Zm9udC1mYW1pbHk6JyR7ZmFtfSc7Zm9udC13ZWlnaHQ6JHt3fTtzcmM6dXJsKGRhdGE6Zm9udC93b2ZmMjtiYXNlNjQsJHtmNjQoZm4pfSkgZm9ybWF0KCd3b2ZmMicpfWApLmpvaW4oIiIpOwoKY29uc3QgQ1NTID0gRkFDRVMgKyBgCip7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowfQpib2R5e2JhY2tncm91bmQ6IzAwMH0KLnN7cG9zaXRpb246cmVsYXRpdmU7YmFja2dyb3VuZDojMEUxNTFCO2NvbG9yOiNFNEVBRUY7Zm9udC1mYW1pbHk6J1BsZXggU2Fucycsc2Fucy1zZXJpZjtvdmVyZmxvdzpoaWRkZW47ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbn0KLnM6OmJlZm9yZXtjb250ZW50OiIiO3Bvc2l0aW9uOmFic29sdXRlO3JpZ2h0Oi0yNjBweDt0b3A6LTI2MHB4O3dpZHRoOjkwMHB4O2hlaWdodDo5MDBweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUscmdiYSgxMzQsMTgwLDIzNCwuMzApLHJnYmEoMTM0LDE4MCwyMzQsMCkgNjglKX0KLnM6OmFmdGVye2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowO2JvdHRvbTowO3dpZHRoOjEwcHg7YmFja2dyb3VuZDojODZCNEVBfQoudG9wLC5taWQsLmZvb3R7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxfQoudG9we2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXJ9Ci5icmFuZHtmb250LWZhbWlseTonUGxleCBTZXJpZicsc2VyaWY7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZTozNnB4fQoubGFie2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXdlaWdodDo1MDA7bGV0dGVyLXNwYWNpbmc6LjA4ZW07Y29sb3I6Izg2QjRFQTtmb250LXNpemU6MjhweH0KLm1pZHtmbGV4OjE7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjttaW4taGVpZ2h0OjA7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nLXRvcDozMHB4fQouZm9vdHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6ZmxleC1lbmQ7Y29sb3I6IzdGOEU5Qjtmb250LXNpemU6MjhweDtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2V9Ci5mc3tmb250LXNpemU6MjhweDttYXgtd2lkdGg6ODIwcHg7bGluZS1oZWlnaHQ6MS4zfQouZ29sZHtjb2xvcjoke0dPTER9fQoua2t7Zm9udC1mYW1pbHk6J1BsZXggTW9ubycsbW9ub3NwYWNlO2ZvbnQtd2VpZ2h0OjUwMDtsZXR0ZXItc3BhY2luZzouMWVtO2NvbG9yOiR7R09MRH07Zm9udC1zaXplOjMwcHg7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfQouYmlne2ZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJyxzZXJpZjtmb250LXdlaWdodDo2MDA7bGluZS1oZWlnaHQ6MS4wODt0ZXh0LXdyYXA6YmFsYW5jZX0KLnR4dHtsaW5lLWhlaWdodDoxLjM7Y29sb3I6I0M5RDNEQn0KLmN0YXtkaXNwbGF5OmJsb2NrO2NvbG9yOiM4NkI0RUE7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZTo0NnB4O2JvcmRlci10b3A6MnB4IHNvbGlkICMzNDQ3NUE7cGFkZGluZy10b3A6MzZweH0KLml0e2Rpc3BsYXk6ZmxleDtnYXA6MjZweDthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O3BhZGRpbmc6MjJweCAwO2JvcmRlci10b3A6MnB4IHNvbGlkICMyNzM1M0Z9Ci5pdDpmaXJzdC1jaGlsZHtib3JkZXItdG9wOjB9Ci5pdCAua3tmbGV4OjAgMCAxOTBweDtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOiR7R09MRH07Zm9udC1zaXplOjMwcHg7bGV0dGVyLXNwYWNpbmc6LjA0ZW07bGluZS1oZWlnaHQ6MS4yNTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2V9Ci5pdCAudHtmb250LWZhbWlseTonUGxleCBTZXJpZicsc2VyaWY7Zm9udC13ZWlnaHQ6NTAwO2ZvbnQtc2l6ZTo0NHB4O2xpbmUtaGVpZ2h0OjEuMn0KLml0IC5zYnttYXJnaW4tdG9wOjhweDtmb250LXNpemU6MzJweDtsaW5lLWhlaWdodDoxLjM7Y29sb3I6IzlBQThCM30KLmNhcmR7Ym9yZGVyLWxlZnQ6OHB4IHNvbGlkICM4NkI0RUE7YmFja2dyb3VuZDojMTYyMTJBO2JvcmRlci1yYWRpdXM6MCAyMnB4IDIycHggMDtwYWRkaW5nOjI4cHggMzRweH0KLmNhcmQuZ3tib3JkZXItY29sb3I6JHtHT0xEfX0KLmNhcmQgLmxie2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXdlaWdodDo1MDA7bGV0dGVyLXNwYWNpbmc6LjFlbTtmb250LXNpemU6MjhweDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7Y29sb3I6Izg2QjRFQX0KLmNhcmQuZyAubGJ7Y29sb3I6JHtHT0xEfX0KLmNhcmQubntib3JkZXItY29sb3I6IzVCNjg3NX0KLmNhcmQubiAubGJ7Y29sb3I6IzlBQTdCMn0KLmNhcmQgLmhke2ZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJyxzZXJpZjtmb250LXdlaWdodDo2MDA7Zm9udC1zaXplOjQycHg7bGluZS1oZWlnaHQ6MS4xODttYXJnaW4tdG9wOjEwcHh9Ci5jYXJkIC5iZHtmb250LXNpemU6MzdweDtsaW5lLWhlaWdodDoxLjM7Y29sb3I6I0M5RDNEQjttYXJnaW4tdG9wOjEwcHh9Ci5jYXJkIC5zcntmb250LXNpemU6MzBweDtjb2xvcjojN0Y4RTlCO21hcmdpbi10b3A6MTBweDtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2V9Ci5jbXB7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyIDFmcjtnYXA6MDthbGlnbi1pdGVtczpiYXNlbGluZTtwYWRkaW5nOjIycHggMDtib3JkZXItdG9wOjJweCBzb2xpZCAjMjczNTNGfQouY21wOmZpcnN0LW9mLXR5cGV7Ym9yZGVyLXRvcDowfQouY21wIC5se2ZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJyxzZXJpZjtmb250LXdlaWdodDo1MDA7Zm9udC1zaXplOjQwcHg7bGluZS1oZWlnaHQ6MS4yfQouY21wIC5he2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXNpemU6NDBweDtjb2xvcjojOUFBOEIzO3RleHQtYWxpZ246Y2VudGVyfQouY21wIC5ie2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXNpemU6NDRweDtjb2xvcjoke0dPTER9O3RleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjUwMH0KLmNtcGh7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyIDFmcjtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Zm9udC1zaXplOjI0cHg7bGV0dGVyLXNwYWNpbmc6LjFlbTtjb2xvcjojNkY3RDg5O3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTttYXJnaW4tYm90dG9tOjZweH0KLmNtcGggc3Bhbjpub3QoOmZpcnN0LWNoaWxkKXt0ZXh0LWFsaWduOmNlbnRlcn0KLnRse3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi1sZWZ0OjE2cHg7Ym9yZGVyLWxlZnQ6NHB4IHNvbGlkICMzNDQ3NUE7cGFkZGluZy1sZWZ0OjM2cHh9Ci50bCAuc3R7cG9zaXRpb246cmVsYXRpdmU7cGFkZGluZzoxMnB4IDAgMThweH0KLnRsIC5zdDo6YmVmb3Jle2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotNDdweDt0b3A6MjZweDt3aWR0aDoxOHB4O2hlaWdodDoxOHB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6Izg2QjRFQX0KLnRsIC5zdC5ub3c6OmJlZm9yZXtiYWNrZ3JvdW5kOiR7R09MRH07Ym94LXNoYWRvdzowIDAgMCA4cHggcmdiYSgyNDIsMTg0LDc1LC4yNSl9Ci50bCAuZHtmb250LWZhbWlseTonUGxleCBNb25vJyxtb25vc3BhY2U7Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOiM4NkI0RUE7Zm9udC1zaXplOjMwcHg7bGV0dGVyLXNwYWNpbmc6LjA2ZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfQoudGwgLnN0Lm5vdyAuZHtjb2xvcjoke0dPTER9fQoudGwgLnh7Zm9udC1zaXplOjM4cHg7bGluZS1oZWlnaHQ6MS4yNTttYXJnaW4tdG9wOjRweH0KLm5vdGV7Zm9udC1mYW1pbHk6J1BsZXggTW9ubycsbW9ub3NwYWNlO2ZvbnQtc2l6ZToyOHB4O2NvbG9yOiR7R09MRH07bGV0dGVyLXNwYWNpbmc6LjA0ZW07bWFyZ2luLXRvcDoyMnB4O2xpbmUtaGVpZ2h0OjEuMzV9Ci5zaG90Ym94e21hcmdpbi10b3A6MjJweDtib3JkZXItcmFkaXVzOjI2cHg7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlcjoycHggc29saWQgIzM0NDc1QTtiYWNrZ3JvdW5kOiMwQTEwMTY7ZmxleDowIDAgYXV0b30KLnNob3Rib3ggaW1ne2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJX0KYDsKY29uc3QgRklUID0gIjxzY3JpcHQ+ZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbigoKT0+e2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZpdF0nKS5mb3JFYWNoKGU9PntsZXQgZnM9cGFyc2VJbnQoZS5kYXRhc2V0LmZpdCk7ZS5zdHlsZS5mb250U2l6ZT1mcysncHgnO2NvbnN0IGxpbT1wYXJzZUludChlLmRhdGFzZXQubWF4fHwnNDAwJyk7d2hpbGUoZS5zY3JvbGxIZWlnaHQ+bGltJiZmcz4zMCl7ZnMtPTI7ZS5zdHlsZS5mb250U2l6ZT1mcysncHgnfX0pO2RvY3VtZW50LmJvZHkuZGF0YXNldC5yZWFkeT0nMSd9KTwvc2NyaXB0PiI7CgovLyAtLS0tLS0tLS0tIGxpbWl0aSBkaSB0ZXN0byAtLS0tLS0tLS0tCmNvbnN0IEwgPSB7CiAgY292ZXI6IHsga2lja2VyOiA0MCwgdGl0bGU6IDgwLCBzdWI6IDEzMCB9LAogIGxpc3Q6IHsga2lja2VyOiA0MCwgdGl0bGU6IDgwLCAiaXRlbXMuayI6IDE0LCAiaXRlbXMudCI6IDkwLCAiaXRlbXMucyI6IDEyMCB9LAogIGR1bzogeyBraWNrZXI6IDQwLCB0aXRsZTogOTAsICJhLmxhYmVsIjogMjgsICJhLmhlYWQiOiA4MCwgImEuYm9keSI6IDE3MCwgImEuc3JjIjogNjAsICJiLmxhYmVsIjogMjgsICJiLmhlYWQiOiA4MCwgImIuYm9keSI6IDE3MCwgImIuc3JjIjogNjAgfSwKICBjb21wYXJlOiB7IGtpY2tlcjogNDAsIHRpdGxlOiA4MCwgInJvd3MubCI6IDMyLCAicm93cy5hIjogMTQsICJyb3dzLmIiOiAxNCwgbm90ZTogMTUwIH0sCiAgdGltZWxpbmU6IHsga2lja2VyOiA0MCwgdGl0bGU6IDgwLCAic3RlcHMuZCI6IDIyLCAic3RlcHMudCI6IDEzMCB9LAogIHZlcmRpY3Q6IHsga2lja2VyOiA0MCwgdGl0bGU6IDgwLCAiYmxvY2tzLmxhYmVsIjogMjgsICJibG9ja3MudGV4dCI6IDIzMCB9LAogIHNob3Q6IHsga2lja2VyOiA0MCwgdGl0bGU6IDcwLCBsaW5lOiAxNTAgfSwKICBjdGE6IHsga2lja2VyOiA0MCwgdGl0bGU6IDkwLCBzdWI6IDEzMCB9LAogIGNsb3NlOiB7IGtpY2tlcjogNDAsIHRpdGxlOiA5MCwgIml0ZW1zLmsiOiAxNCwgIml0ZW1zLnQiOiA5MCwgbm90ZTogMTIwLCBsaW5rOiA2MCB9LAp9Owpjb25zdCBTUkNNQVggPSA5MDsKY29uc3QgTUFYTiA9IHsgY2xvc2U6IDMsIGxpc3Q6IDUsIGNvbXBhcmU6IDUsIHRpbWVsaW5lOiA2LCB2ZXJkaWN0OiAzIH07CmNvbnN0IE1JTk4gPSB7IGNsb3NlOiAxLCBsaXN0OiAyLCBjb21wYXJlOiAyLCB0aW1lbGluZTogMywgdmVyZGljdDogMSB9Owpjb25zdCBDT0xTID0geyBjbG9zZTogIml0ZW1zIiwgbGlzdDogIml0ZW1zIiwgY29tcGFyZTogInJvd3MiLCB0aW1lbGluZTogInN0ZXBzIiwgdmVyZGljdDogImJsb2NrcyIgfTsKCmZ1bmN0aW9uIGNoZWNrKHNwZWMpIHsKICBjb25zdCBlID0gW107CiAgaWYgKCEvXlxkezR9LVxkezJ9LVxkezJ9JC8udGVzdChzcGVjLmRhdGUgfHwgIiIpKSBlLnB1c2goImRhdGU6IGZvcm1hdG8gWVlZWS1NTS1ERCIpOwogIGlmICghc3BlYy5ydWJyaWNhKSBlLnB1c2goInJ1YnJpY2E6IG1hbmNhbnRlIik7CiAgaWYgKCFBcnJheS5pc0FycmF5KHNwZWMuc2xpZGVzKSB8fCBzcGVjLnNsaWRlcy5sZW5ndGggPCAzIHx8IHNwZWMuc2xpZGVzLmxlbmd0aCA+IDgpIGUucHVzaCgic2xpZGVzOiBkYSAzIGEgOCIpOwogIChzcGVjLnNsaWRlcyB8fCBbXSkuZm9yRWFjaCgocywgaSkgPT4gewogICAgY29uc3QgbGltID0gTFtzLnR5cGVdOwogICAgaWYgKCFsaW0pIHsgZS5wdXNoKGBzbGlkZXNbJHtpfV0udHlwZTogc2Nvbm9zY2l1dG8gKCR7cy50eXBlfSlgKTsgcmV0dXJuOyB9CiAgICBjb25zdCBnZXQgPSAobywgcCkgPT4gcC5zcGxpdCgiLiIpLnJlZHVjZSgoYSwgaykgPT4gKGEgPT0gbnVsbCA/IGEgOiBhW2tdKSwgbyk7CiAgICBmb3IgKGNvbnN0IFtwLCBtYXhdIG9mIE9iamVjdC5lbnRyaWVzKGxpbSkpIHsKICAgICAgaWYgKHAuaW5jbHVkZXMoIi4iKSAmJiBDT0xTW3MudHlwZV0gJiYgcC5zdGFydHNXaXRoKENPTFNbcy50eXBlXSArICIuIikpIHsKICAgICAgICBjb25zdCBjb2wgPSBzW0NPTFNbcy50eXBlXV0gfHwgW107CiAgICAgICAgY29uc3QgZiA9IHAuc3BsaXQoIi4iKVsxXTsKICAgICAgICBjb2wuZm9yRWFjaCgoeCwgaikgPT4geyBjb25zdCB2ID0geFtmXTsgaWYgKHYgIT0gbnVsbCAmJiBTdHJpbmcodikubGVuZ3RoID4gbWF4KSBlLnB1c2goYHNsaWRlc1ske2l9XS4ke0NPTFNbcy50eXBlXX1bJHtqfV0uJHtmfTogJHtTdHJpbmcodikubGVuZ3RofSBjYXJhdHRlcmksIG1hc3NpbW8gJHttYXh9YCk7IH0pOwogICAgICB9IGVsc2UgewogICAgICAgIGNvbnN0IHYgPSBnZXQocywgcCk7CiAgICAgICAgaWYgKHYgIT0gbnVsbCAmJiBTdHJpbmcodikubGVuZ3RoID4gbWF4KSBlLnB1c2goYHNsaWRlc1ske2l9XS4ke3B9OiAke1N0cmluZyh2KS5sZW5ndGh9IGNhcmF0dGVyaSwgbWFzc2ltbyAke21heH1gKTsKICAgICAgfQogICAgfQogICAgY29uc3QgcmVxVG9wID0geyBjb3ZlcjogWyJ0aXRsZSJdLCBsaXN0OiBbInRpdGxlIl0sIGR1bzogWyJ0aXRsZSIsICJhIiwgImIiXSwgY29tcGFyZTogWyJ0aXRsZSJdLCB0aW1lbGluZTogWyJ0aXRsZSJdLCB2ZXJkaWN0OiBbInRpdGxlIl0sIHNob3Q6IFsidGl0bGUiLCAiaW1nIl0sIGN0YTogWyJ0aXRsZSJdLCBjbG9zZTogWyJ0aXRsZSJdIH1bcy50eXBlXTsKICAgIGZvciAoY29uc3QgayBvZiByZXFUb3ApIGlmICghc1trXSkgZS5wdXNoKGBzbGlkZXNbJHtpfV0uJHtrfTogbWFuY2FudGVgKTsKICAgIGlmIChDT0xTW3MudHlwZV0pIHsKICAgICAgY29uc3QgY29sID0gc1tDT0xTW3MudHlwZV1dOwogICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29sKSB8fCBjb2wubGVuZ3RoIDwgTUlOTltzLnR5cGVdIHx8IGNvbC5sZW5ndGggPiBNQVhOW3MudHlwZV0pIGUucHVzaChgc2xpZGVzWyR7aX1dLiR7Q09MU1tzLnR5cGVdfTogZGEgJHtNSU5OW3MudHlwZV19IGEgJHtNQVhOW3MudHlwZV19IHZvY2lgKTsKICAgIH0KICAgIGlmIChzLnR5cGUgPT09ICJkdW8iKSBmb3IgKGNvbnN0IGsgb2YgWyJhIiwgImIiXSkgeyBjb25zdCB4ID0gc1trXSB8fCB7fTsgZm9yIChjb25zdCBmIG9mIFsibGFiZWwiLCAiaGVhZCIsICJib2R5IiwgInNyYyJdKSBpZiAoIXhbZl0pIGUucHVzaChgc2xpZGVzWyR7aX1dLiR7a30uJHtmfTogbWFuY2FudGVgKTsgfQogICAgaWYgKHMudHlwZSA9PT0gInNob3QiICYmIHMuaW1nICYmICFmcy5leGlzdHNTeW5jKHMuaW1nKSkgZS5wdXNoKGBzbGlkZXNbJHtpfV0uaW1nOiBmaWxlIG5vbiB0cm92YXRvYCk7CiAgfSk7CiAgKHNwZWMuc2xpZGVzIHx8IFtdKS5mb3JFYWNoKChzLCBpKSA9PiB7IGlmIChzLnNyYyAmJiBTdHJpbmcocy5zcmMpLmxlbmd0aCA+IFNSQ01BWCkgZS5wdXNoKGBzbGlkZXNbJHtpfV0uc3JjOiAke1N0cmluZyhzLnNyYykubGVuZ3RofSBjYXJhdHRlcmksIG1hc3NpbW8gJHtTUkNNQVh9YCk7IH0pOwogIGlmICghc3BlYy5jYXB0aW9uIHx8IHNwZWMuY2FwdGlvbi5sZW5ndGggPCA0MCkgZS5wdXNoKCJjYXB0aW9uOiBtYW5jYW50ZSBvIHRyb3BwbyBjb3J0YSIpOwogIGlmICgoc3BlYy5jYXB0aW9uIHx8ICIiKS5sZW5ndGggPiAyMDAwKSBlLnB1c2goImNhcHRpb246IG1hc3NpbW8gMjAwMCBjYXJhdHRlcmkiKTsKICByZXR1cm4gZTsKfQoKLy8gLS0tLS0tLS0tLSBwYWdpbmUgLS0tLS0tLS0tLQpjb25zdCBXID0gMTA4MCwgSCA9IDEzNTA7CmZ1bmN0aW9uIHBhZ2Uoc3BlYywgYm9keSwgbiwgdG90LCBzcmMpIHsKICBjb25zdCB0b3AgPSBgPGRpdiBjbGFzcz0idG9wIj48c3BhbiBjbGFzcz0iYnJhbmQiPlJlYWQgR2VvcG9saXRpY3M8L3NwYW4+PHNwYW4gY2xhc3M9ImxhYiI+JHtkYXRhTGJsKHNwZWMuZGF0ZSl9PC9zcGFuPjwvZGl2PmA7CiAgY29uc3QgZm9vdCA9IGA8ZGl2IGNsYXNzPSJmb290Ij48c3BhbiBjbGFzcz0iZnMiPiR7ZXNjKHNyYyB8fCAiIil9PC9zcGFuPjxzcGFuPiR7bn0vJHt0b3R9JHtuIDwgdG90ID8gIiDihpIiIDogIiJ9PC9zcGFuPjwvZGl2PmA7CiAgcmV0dXJuIGA8IWRvY3R5cGUgaHRtbD48bWV0YSBjaGFyc2V0PSJ1dGYtOCI+PHN0eWxlPiR7Q1NTfTwvc3R5bGU+PGJvZHk+PGRpdiBjbGFzcz0icyIgc3R5bGU9IndpZHRoOiR7V31weDtoZWlnaHQ6JHtIfXB4O3BhZGRpbmc6NjZweCA1NnB4IDY0cHggNjZweCI+JHt0b3B9PGRpdiBjbGFzcz0ibWlkIj4ke2JvZHl9PC9kaXY+JHtmb290fTwvZGl2PiR7RklUfTwvYm9keT5gOwp9CmNvbnN0IGhlYWQgPSAocywgc2l6ZSA9IDc2LCBtYXggPSAyMzApID0+IGAke3Mua2lja2VyID8gYDxkaXYgY2xhc3M9ImtrIj4ke2VzYyhzLmtpY2tlcil9PC9kaXY+YCA6ICIifTxkaXYgY2xhc3M9ImJpZyIgZGF0YS1maXQ9IiR7c2l6ZX0iIGRhdGEtbWF4PSIke21heH0iIHN0eWxlPSJtYXJnaW4tdG9wOjE0cHgiPiR7aGwocy50aXRsZSl9PC9kaXY+YDsKY29uc3QgUiA9IHsKICBjb3ZlcjogKHMpID0+IGA8ZGl2IGNsYXNzPSJrayI+JHtlc2Mocy5raWNrZXIgfHwgIiIpfTwvZGl2PjxkaXYgY2xhc3M9ImJpZyIgZGF0YS1maXQ9IjExNiIgZGF0YS1tYXg9IjQ3MCIgc3R5bGU9Im1hcmdpbi10b3A6MjZweCI+JHtobChzLnRpdGxlKX08L2Rpdj4ke3Muc3ViID8gYDxkaXYgY2xhc3M9InR4dCIgc3R5bGU9ImZvbnQtc2l6ZTo0NHB4O21hcmdpbi10b3A6NDRweCI+JHtlc2Mocy5zdWIpfTwvZGl2PmAgOiAiIn1gLAogIGxpc3Q6IChzKSA9PiBgJHtoZWFkKHMsIDcwLCAxOTApfTxkaXYgc3R5bGU9Im1hcmdpbi10b3A6MjZweCI+JHtzLml0ZW1zLm1hcCgoeCkgPT4gYDxkaXYgY2xhc3M9Iml0Ij48ZGl2IGNsYXNzPSJrIj4ke2VzYyh4LmspfTwvZGl2PjxkaXY+PGRpdiBjbGFzcz0idCI+JHtlc2MoeC50KX08L2Rpdj4ke3gucyA/IGA8ZGl2IGNsYXNzPSJzYiI+JHtlc2MoeC5zKX08L2Rpdj5gIDogIiJ9PC9kaXY+PC9kaXY+YCkuam9pbigiIil9PC9kaXY+YCwKICBkdW86IChzKSA9PiBgJHtoZWFkKHMsIDY2LCAxNzApfTxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIycHg7bWFyZ2luLXRvcDoyNnB4Ij4ke1siYSIsICJiIl0ubWFwKChrLCBpKSA9PiBgPGRpdiBjbGFzcz0iY2FyZCR7aSA/ICIgZyIgOiAiIn0iPjxkaXYgY2xhc3M9ImxiIj4ke2VzYyhzW2tdLmxhYmVsKX08L2Rpdj48ZGl2IGNsYXNzPSJoZCI+JHtlc2Moc1trXS5oZWFkKX08L2Rpdj48ZGl2IGNsYXNzPSJiZCI+JHtlc2Moc1trXS5ib2R5KX08L2Rpdj48ZGl2IGNsYXNzPSJzciI+JHtlc2Moc1trXS5zcmMpfTwvZGl2PjwvZGl2PmApLmpvaW4oIiIpfTwvZGl2PmAsCiAgY29tcGFyZTogKHMpID0+IGAke2hlYWQocywgNzAsIDE5MCl9PGRpdiBzdHlsZT0ibWFyZ2luLXRvcDoyNnB4Ij48ZGl2IGNsYXNzPSJjbXBoIj48c3Bhbj48L3NwYW4+PHNwYW4+JHtlc2Mocy5jb2xfYSB8fCAiUHJpbWEiKX08L3NwYW4+PHNwYW4+JHtlc2Mocy5jb2xfYiB8fCAiT3JhIil9PC9zcGFuPjwvZGl2PiR7cy5yb3dzLm1hcCgoeCkgPT4gYDxkaXYgY2xhc3M9ImNtcCI+PGRpdiBjbGFzcz0ibCI+JHtlc2MoeC5sKX08L2Rpdj48ZGl2IGNsYXNzPSJhIj4ke2VzYyh4LmEpfTwvZGl2PjxkaXYgY2xhc3M9ImIiPiR7ZXNjKHguYil9PC9kaXY+PC9kaXY+YCkuam9pbigiIil9PC9kaXY+JHtzLm5vdGUgPyBgPGRpdiBjbGFzcz0ibm90ZSI+JHtlc2Mocy5ub3RlKX08L2Rpdj5gIDogIiJ9YCwKICB0aW1lbGluZTogKHMpID0+IGAke2hlYWQocywgNjYsIDE3MCl9PGRpdiBjbGFzcz0idGwiIHN0eWxlPSJtYXJnaW4tdG9wOjI2cHgiPiR7cy5zdGVwcy5tYXAoKHgsIGkpID0+IGA8ZGl2IGNsYXNzPSJzdCR7eC5ub3cgPyAiIG5vdyIgOiAiIn0iPjxkaXYgY2xhc3M9ImQiPiR7ZXNjKHguZCl9PC9kaXY+PGRpdiBjbGFzcz0ieCI+JHtlc2MoeC50KX08L2Rpdj48L2Rpdj5gKS5qb2luKCIiKX08L2Rpdj5gLAogIHZlcmRpY3Q6IChzKSA9PiBgJHtoZWFkKHMsIDY2LCAxNzApfTxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIycHg7bWFyZ2luLXRvcDoyNnB4Ij4ke3MuYmxvY2tzLm1hcCgoeCwgaSkgPT4gYDxkaXYgY2xhc3M9ImNhcmQke3guZ29sZCA/ICIgZyIgOiB4Lm5ldXRyYWwgPyAiIG4iIDogIiJ9Ij48ZGl2IGNsYXNzPSJsYiI+JHtlc2MoeC5sYWJlbCl9PC9kaXY+PGRpdiBjbGFzcz0iYmQiIHN0eWxlPSJmb250LXNpemU6NDBweDtjb2xvcjojRTRFQUVGIj4ke2VzYyh4LnRleHQpfTwvZGl2PjwvZGl2PmApLmpvaW4oIiIpfTwvZGl2PmAsCiAgc2hvdDogKHMpID0+IGAke2hlYWQocywgNjQsIDE1MCl9PGRpdiBjbGFzcz0ic2hvdGJveCI+PGltZyBzcmM9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsJHtmcy5yZWFkRmlsZVN5bmMocy5pbWcpLnRvU3RyaW5nKCJiYXNlNjQiKX0iPjwvZGl2PiR7cy5saW5lID8gYDxkaXYgY2xhc3M9InR4dCIgc3R5bGU9ImZvbnQtc2l6ZTozMnB4O21hcmdpbi10b3A6MjBweCI+JHtlc2Mocy5saW5lKX08L2Rpdj5gIDogIiJ9YCwKICBjbG9zZTogKHMpID0+IGAke2hlYWQocywgNzAsIDI2MCl9PGRpdiBzdHlsZT0ibWFyZ2luLXRvcDoyNnB4Ij4ke3MuaXRlbXMubWFwKCh4KSA9PiBgPGRpdiBjbGFzcz0iaXQiPjxkaXYgY2xhc3M9ImsiPiR7ZXNjKHguayl9PC9kaXY+PGRpdj48ZGl2IGNsYXNzPSJ0Ij4ke2VzYyh4LnQpfTwvZGl2PjwvZGl2PjwvZGl2PmApLmpvaW4oIiIpfTwvZGl2PiR7cy5ub3RlID8gYDxkaXYgY2xhc3M9Im5vdGUiIHN0eWxlPSJjb2xvcjojOUFBOEIzO2ZvbnQtc2l6ZTozMHB4Ij4ke2VzYyhzLm5vdGUpfTwvZGl2PmAgOiAiIn08ZGl2IHN0eWxlPSJtYXJnaW4tdG9wOjM0cHgiPjxzcGFuIGNsYXNzPSJjdGEiIHN0eWxlPSJmb250LXNpemU6NDBweCI+JHtlc2Mocy5saW5rIHx8ICJJbCBsaW5rIMOoIG5lbGxhIGJpbyBkZWwgcHJvZmlsbyIpfTwvc3Bhbj48L2Rpdj5gLAogIGN0YTogKHMpID0+IGA8ZGl2IGNsYXNzPSJrayI+JHtlc2Mocy5raWNrZXIgfHwgIklsIGNvbnRlc3RvIGNvbXBsZXRvIil9PC9kaXY+PGRpdiBjbGFzcz0iYmlnIiBkYXRhLWZpdD0iOTYiIGRhdGEtbWF4PSIzMzAiIHN0eWxlPSJtYXJnaW4tdG9wOjIwcHgiPiR7aGwocy50aXRsZSl9PC9kaXY+PGRpdiBzdHlsZT0ibWFyZ2luLXRvcDo1NnB4Ij48c3BhbiBjbGFzcz0iY3RhIj5JbCBsaW5rIMOoIG5lbGxhIGJpbyBkZWwgcHJvZmlsbzwvc3Bhbj4ke3Muc3ViID8gYDxwIHN0eWxlPSJmb250LXNpemU6MzRweDtjb2xvcjojOUFBOEIzO21hcmdpbi10b3A6MjBweCI+JHtlc2Mocy5zdWIpfTwvcD5gIDogIiJ9PC9kaXY+YCwKfTsKCmFzeW5jIGZ1bmN0aW9uIGxvYWRDaHJvbWl1bSgpIHsKICBjb25zdCBIT01FID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCAiL3Jvb3QiOwogIGZvciAoY29uc3QgcCBvZiBbInBsYXl3cmlnaHQiLCBwYXRoLmpvaW4oSEVSRSwgIm5vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIpLCBwYXRoLmpvaW4oSE9NRSwgImlna2l0L25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIpLCAiL3RtcC9pZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiLCAiL2hvbWUvY2xhdWRlLy5ucG0tZ2xvYmFsL2xpYi9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiLCAiL29wdC9ucG0tdG9vbHMvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIiwgIi90bXAvaWd0ZXN0L25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyJdKSB7CiAgICB0cnkgeyByZXR1cm4gKGF3YWl0IGltcG9ydChwLnN0YXJ0c1dpdGgoIi8iKSA/ICJmaWxlOi8vIiArIHAgOiBwKSkuY2hyb21pdW07IH0gY2F0Y2ggKGUpIHt9CiAgfQogIHRocm93IG5ldyBFcnJvcigiUGxheXdyaWdodCBub24gdHJvdmF0byIpOwp9CmFzeW5jIGZ1bmN0aW9uIHJlbmRlckFsbChodG1scywgb3V0RGlyKSB7CiAgZnMubWtkaXJTeW5jKHBhdGguam9pbihvdXREaXIsICJqcGciKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7CiAgZnMubWtkaXJTeW5jKHBhdGguam9pbihvdXREaXIsICJodG1sIiksIHsgcmVjdXJzaXZlOiB0cnVlIH0pOwogIGNvbnN0IGNocm9taXVtID0gYXdhaXQgbG9hZENocm9taXVtKCk7CiAgY29uc3QgYnIgPSBhd2FpdCBjaHJvbWl1bS5sYXVuY2goeyBleGVjdXRhYmxlUGF0aDogcHJvY2Vzcy5lbnYuQ0hST01JVU0gfHwgKGZzLmV4aXN0c1N5bmMoIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iKSA/ICIvb3B0L3B3LWJyb3dzZXJzL2Nocm9taXVtIiA6IHVuZGVmaW5lZCksIGFyZ3M6IFsiLS1uby1zYW5kYm94Il0gfSk7CiAgY29uc3QgcHJvYmxlbXMgPSBbXTsKICBmb3IgKGxldCBpID0gMDsgaSA8IGh0bWxzLmxlbmd0aDsgaSsrKSB7CiAgICBjb25zdCBuYW1lID0gU3RyaW5nKGkgKyAxKS5wYWRTdGFydCgyLCAiMCIpOwogICAgY29uc3QgaHAgPSBwYXRoLnJlc29sdmUob3V0RGlyLCAiaHRtbCIsIG5hbWUgKyAiLmh0bWwiKTsKICAgIGZzLndyaXRlRmlsZVN5bmMoaHAsIGh0bWxzW2ldKTsKICAgIGNvbnN0IHBnID0gYXdhaXQgYnIubmV3UGFnZSh7IHZpZXdwb3J0OiB7IHdpZHRoOiBXLCBoZWlnaHQ6IEggfSB9KTsKICAgIGF3YWl0IHBnLmdvdG8oImZpbGU6Ly8iICsgaHApOwogICAgYXdhaXQgcGcud2FpdEZvclNlbGVjdG9yKCJib2R5W2RhdGEtcmVhZHldIik7CiAgICBjb25zdCBvdmVyID0gYXdhaXQgcGcuZXZhbHVhdGUoKCkgPT4geyBjb25zdCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLm1pZCIpOyByZXR1cm4gbS5zY3JvbGxIZWlnaHQgLSBtLmNsaWVudEhlaWdodDsgfSk7CiAgICBpZiAob3ZlciA+IDQpIHByb2JsZW1zLnB1c2goYHNsaWRlICR7bmFtZX06IGlsIHRlc3RvIHNmb3JhIGRpICR7b3Zlcn1weCwgYWNjb3JjaWEgaSB0ZXN0aSBvIHRvZ2xpIHVuYSB2b2NlYCk7CiAgICBhd2FpdCBwZy5zY3JlZW5zaG90KHsgcGF0aDogcGF0aC5qb2luKG91dERpciwgImpwZyIsIG5hbWUgKyAiLmpwZyIpLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDkyIH0pOwogICAgYXdhaXQgcGcuY2xvc2UoKTsKICB9CiAgYXdhaXQgYnIuY2xvc2UoKTsKICByZXR1cm4gcHJvYmxlbXM7Cn0KCgovLyAtLS0tLS0tLS0tIGNvbnRyb2xsaSBzZW1hbnRpY2k6IGxhIHNwZWNpZmljYSBjb250cm8gaSBkYXRpIGxldHRpIC0tLS0tLS0tLS0KY29uc3QgTUVTID0gIkdFTnxGRUJ8TUFSfEFQUnxNQUd8R0lVfExVR3xBR098U0VUfE9UVHxOT1Z8RElDIjsKY29uc3QgREFURV9PSyA9IFsKICBuZXcgUmVnRXhwKGBeXFxkezEsMn0o4oCTXFxkezEsMn0pPyAoJHtNRVN9KSggXFxkezR9KT8kYCksCiAgbmV3IFJlZ0V4cChgXlxcZHsxLDJ9ICgke01FU30p4oCTXFxkezEsMn0gKCR7TUVTfSkoIFxcZHs0fSk/JGApLAogIG5ldyBSZWdFeHAoYF4oJHtNRVN9KSBcXGR7NH0o4oCTKCgke01FU30pICk/XFxkezR9KT8kYCksCiAgL15cZHs0fSjigJNcZHs0fSk/JC8sCl07CmNvbnN0IGlzRGF0ZUxibCA9ICh4KSA9PiBEQVRFX09LLnNvbWUoKHIpID0+IHIudGVzdChTdHJpbmcoeCkudHJpbSgpLnRvVXBwZXJDYXNlKCkpKTsKY29uc3QgbG9va3NEYXRlID0gKHgpID0+IG5ldyBSZWdFeHAoYFxcYigke01FU30pXFxiYCwgImkiKS50ZXN0KFN0cmluZyh4KSkgfHwgL15cZHs0fSQvLnRlc3QoU3RyaW5nKHgpLnRyaW0oKSk7CmNvbnN0IE5VTVcgPSB7IGR1ZTogMiwgdHJlOiAzLCBxdWF0dHJvOiA0LCBjaW5xdWU6IDUsIHNldHRlOiA3LCBvdHRvOiA4LCBub3ZlOiA5LCBkaWVjaTogMTAgfTsKY29uc3QgbnJtID0gKHQpID0+IFN0cmluZyh0KS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1vigJnigJhdL2csICInIik7CmNvbnN0IG51bVdvcmRzID0gKHQpID0+IHQucmVwbGFjZSgvXGIoZHVlfHRyZXxxdWF0dHJvfGNpbnF1ZXxzZXR0ZXxvdHRvfG5vdmV8ZGllY2kpXGIvZywgKG0pID0+IE5VTVdbbV0pOwpjb25zdCBzdHJzID0gKG8sIGFjYyA9IFtdKSA9PiB7IGlmICh0eXBlb2YgbyA9PT0gInN0cmluZyIpIGFjYy5wdXNoKG8pOyBlbHNlIGlmIChBcnJheS5pc0FycmF5KG8pKSBvLmZvckVhY2goKHgpID0+IHN0cnMoeCwgYWNjKSk7IGVsc2UgaWYgKG8gJiYgdHlwZW9mIG8gPT09ICJvYmplY3QiKSBPYmplY3QudmFsdWVzKG8pLmZvckVhY2goKHgpID0+IHN0cnMoeCwgYWNjKSk7IHJldHVybiBhY2M7IH07CmNvbnN0IHNlbnRlbmNlcyA9ICh0KSA9PiB0LnNwbGl0KC8oPzw9Wy4/IV0pXHMrLykuZmlsdGVyKEJvb2xlYW4pOwpjb25zdCBDQVVTID0gL2luIHJpc3Bvc3RhfGEgY2F1c2EgZFx3KnxkaSBjb25zZWd1ZW56YXxwZXJjaVtvw7JdXGJ8XGJxdWluZGlcYnxwZXIgdmVuZGljYXJlfGNvbWUgcmVhemlvbmV8aGEgcHJvdm9jYXRvfGhhIGNhdXNhdG98aGEgcG9ydGF0byBhfGEgc2VndWl0byBkXHcqfGluIHNlZ3VpdG8gYXxwZXIgZWZmZXR0byBkXHcqL2dpOwpjb25zdCBBVFRSID0gL3NlY29uZFtvYV18ZGljb25vfGRpY2VcYnxzb3N0ZW5nb25cdyp8YWZmZXJtYW5vfGFmZmVybWFcYnxpbmRpY2FcYnxpbmRpY2Fub3x0ZW1vbm98ZGljaGlhcmF6XHcqfHZhbHV0YXpcdyp8cml2ZW5kaWNcdyp8cGVyIGxlIGF1dG9yaXTDoHxub24gY29uZmVybVx3KnxuZXNzdW5hIGZvbnRlfG5vbiDDqCBwcm92YXRvfHNlY29uZG98YWNjdXNhfGFjY3VzYW5vfFw/JC9pOwpjb25zdCBHRVJHTyA9IFsiZXNjYWxhdGlvbiIsICJkZS1lc2NhbGF0aW9uIiwgImRldGVycmVuemEiLCAibGluZWEgcm9zc2EiLCAic3RhdHVzIHF1byIsICJwcm94eSIsICJjYXN1cyBiZWxsaSIsICJsZXZhIG5lZ296aWFsZSIsICJwZW5ob2xkZXIiLCAic2Nvc3RhbWVudG8iLCAiY2xhdXNvbGEiXTsKCmZ1bmN0aW9uIHNlbUNoZWNrKHNwZWMsIGRhdGFGaWxlcykgewogIGNvbnN0IGVyciA9IFtdLCBhdnYgPSBbXTsKICBjb25zdCBkb2NzID0gZGF0YUZpbGVzLm1hcCgoZikgPT4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZiwgInV0ZjgiKSkpOwogIGNvbnN0IHJhdyA9IGRvY3MuZmxhdE1hcCgoZCkgPT4gc3RycyhkKSk7CiAgY29uc3QgY29ycHVzID0gbnJtKHJhdy5qb2luKCJcbiIpKTsKICBjb25zdCBjb3JwdXNXID0gbnVtV29yZHMoY29ycHVzKTsKICBjb25zdCBudW1zID0gbmV3IFNldCgpOwogIGZvciAoY29uc3QgbSBvZiBjb3JwdXNXLm1hdGNoQWxsKC9cZCsoPzpbLixdXGQrKSovZykpIG51bXMuYWRkKG1bMF0ucmVwbGFjZSgvWy4sXS9nLCAiIikpOwogIC8vIG5vbWkgZGVsbGUgZm9udGkgcHJlc2VudGkgbmVpIGRhdGkKICBjb25zdCBub21pID0gW107CiAgY29uc3Qgd2FsayA9IChvKSA9PiB7IGlmIChBcnJheS5pc0FycmF5KG8pKSBvLmZvckVhY2god2Fsayk7IGVsc2UgaWYgKG8gJiYgdHlwZW9mIG8gPT09ICJvYmplY3QiKSB7IGlmIChvLm5vbWUgJiYgby51cmwpIG5vbWkucHVzaChucm0oby5ub21lKS5yZXBsYWNlKC9ccypcKFteKV0qXCkvZywgIiIpLnRyaW0oKSk7IE9iamVjdC52YWx1ZXMobykuZm9yRWFjaCh3YWxrKTsgfSB9OwogIGRvY3MuZm9yRWFjaCh3YWxrKTsKICAvLyB0ZXJtaW5pIGNvbnRlc3RhdGk6IG5vbWkgcHJvcHJpIGNoZSBjb21wYWlvbm8gc29sbyBpbiBgZGl2ZXJnZW56ZWAgKG5vbiBhIGluaXppbyBmcmFzZSwgbm9uIHRyYSBnbGkgYXR0b3JpKQogIGNvbnN0IGNvbnRlc3RlZCA9IG5ldyBTZXQoKTsKICBjb25zdCB3YWxrMiA9IChvKSA9PiB7IGlmIChBcnJheS5pc0FycmF5KG8pKSBvLmZvckVhY2god2FsazIpOyBlbHNlIGlmIChvICYmIHR5cGVvZiBvID09PSAib2JqZWN0IikgewogICAgaWYgKHR5cGVvZiBvLmRpdmVyZ2VuemUgPT09ICJzdHJpbmciICYmIHR5cGVvZiBvLmZhdHRpID09PSAic3RyaW5nIikgewogICAgICBjb25zdCBrbm93biA9IG5ybShvLmZhdHRpICsgIiAiICsgKG8ucHJvPy5hdHRvcmkgfHwgIiIpICsgIiAiICsgKG8uY29udHJvPy5hdHRvcmkgfHwgIiIpKTsKICAgICAgZm9yIChjb25zdCBtIG9mIG8uZGl2ZXJnZW56ZS5tYXRjaEFsbCgvW0EtWl1bYS16w6Atw7ldezMsfS9nKSkgeyBjb25zdCBwcmV2ID0gby5kaXZlcmdlbnplLnNsaWNlKDAsIG0uaW5kZXgpLnRyaW1FbmQoKS5zbGljZSgtMSk7IGlmIChtLmluZGV4ID09PSAwIHx8IC9bLiE/XS8udGVzdChwcmV2KSkgY29udGludWU7IGlmICgha25vd24uaW5jbHVkZXMobnJtKG1bMF0pKSkgY29udGVzdGVkLmFkZChtWzBdKTsgfQogICAgfQogICAgT2JqZWN0LnZhbHVlcyhvKS5mb3JFYWNoKHdhbGsyKTsgfSB9OwogIGRvY3MuZm9yRWFjaCh3YWxrMik7CgogIGNvbnN0IGl0ZW1zID0gW107CiAgY29uc3Qgc2VlbkcgPSBuZXcgU2V0KCk7CiAgKHNwZWMuc2xpZGVzIHx8IFtdKS5mb3JFYWNoKChzLCBpKSA9PiB7CiAgICBjb25zdCBuID0gaSArIDE7CiAgICBjb25zdCBwdXNoID0gKG8sIGJhc2UpID0+IHsgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMobyB8fCB7fSkpIHsgaWYgKFsidHlwZSIsICJpbWciLCAic3JjIiwgIm5vdyIsICJnb2xkIiwgIm5ldXRyYWwiXS5pbmNsdWRlcyhrKSkgY29udGludWU7IGlmICh0eXBlb2YgdiA9PT0gInN0cmluZyIpIGl0ZW1zLnB1c2goeyBuLCBrOiBiYXNlICsgaywgdiB9KTsgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2KSkgdi5mb3JFYWNoKCh4LCBqKSA9PiB7IGlmICh0eXBlb2YgeCA9PT0gInN0cmluZyIpIGl0ZW1zLnB1c2goeyBuLCBrOiBgJHtiYXNlfSR7a31bJHtqfV1gLCB2OiB4IH0pOyBlbHNlIHB1c2goeCwgYCR7YmFzZX0ke2t9WyR7an1dLmApOyB9KTsgZWxzZSBpZiAodiAmJiB0eXBlb2YgdiA9PT0gIm9iamVjdCIpIHB1c2godiwgYCR7YmFzZX0ke2t9LmApOyB9IH07CiAgICBwdXNoKHMsICIiKTsKICB9KTsKICBpdGVtcy5wdXNoKHsgbjogMCwgazogImNhcHRpb24iLCB2OiBzcGVjLmNhcHRpb24gfHwgIiIgfSk7CgogIGZvciAoY29uc3QgeyBuLCBrLCB2IH0gb2YgaXRlbXMpIHsKICAgIGNvbnN0IHdoZXJlID0gbiA/IGBzbGlkZSAke259ICgke2t9KWAgOiAiY2FwdGlvbiI7CiAgICBjb25zdCBib2R5ID0gayA9PT0gImNhcHRpb24iID8gdi5zcGxpdCgiXG4iKS5maWx0ZXIoKGwpID0+ICEvXiMvLnRlc3QobCkpLmpvaW4oIiAiKSA6IHY7CiAgICAvLyAxLiBudW1lcmkgbm9uIHByZXNlbnRpIG5laSBkYXRpCiAgICBmb3IgKGNvbnN0IG0gb2YgYm9keS5tYXRjaEFsbCgvXGQrKD86Wy4sXVxkKykqL2cpKSB7IGNvbnN0IHQgPSBtWzBdLnJlcGxhY2UoL1suLF0vZywgIiIpOyBpZiAoIW51bXMuaGFzKHQpKSBlcnIucHVzaChgJHt3aGVyZX06IGlsIG51bWVybyAiJHttWzBdfSIgbm9uIGNvbXBhcmUgbmVpIGRhdGlgKTsgfQogICAgLy8gNC4gY2l0YXppb25pCiAgICBmb3IgKGNvbnN0IG0gb2YgYm9keS5tYXRjaEFsbCgvwqsoW17Cu10rKcK7fOKAnChbXuKAnV0rKeKAnS9nKSkgeyBjb25zdCBxID0gbnJtKG1bMV0gfHwgbVsyXSk7IGlmICghY29ycHVzLmluY2x1ZGVzKHEpKSBlcnIucHVzaChgJHt3aGVyZX06IGNpdGF6aW9uZSDCqyR7bVsxXSB8fCBtWzJdfcK7IG5vbiBwcmVzZW50ZSBuZWkgZGF0aWApOyB9CiAgICBmb3IgKGNvbnN0IHNlbnQgb2Ygc2VudGVuY2VzKGJvZHkpKSB7CiAgICAgIGNvbnN0IHNuID0gbnJtKHNlbnQpOwogICAgICAvLyAyLiBuZXNzaSBjYXVzYWxpIG5vbiBzY3JpdHRpIG5laSBkYXRpCiAgICAgIGZvciAoY29uc3QgbSBvZiBzZW50Lm1hdGNoQWxsKENBVVMpKSBpZiAoIWNvcnB1cy5pbmNsdWRlcyhucm0obVswXSkpKSBlcnIucHVzaChgJHt3aGVyZX06IG5lc3NvIGNhdXNhbGUgIiR7bVswXX0iIG5vbiBwcmVzZW50ZSBuZWkgZGF0aTogIiR7c2VudH0iYCk7CiAgICAgIC8vIDMuIGNvbmZlcm1lIC8gaW5kaXBlbmRlbnphIC8gdmVyaWZpY2hlIGFmZmVybWF0ZSBzZW56YSBuZWdhemlvbmUKICAgICAgaWYgKC9jb25mZXJtfGluZGlwZW5kZW50fFxidmVyaWZpY2F0fFxiYWNjZXJ0YXR8XGJwcm92YXQvaS50ZXN0KHNlbnQpICYmICEvXGJub25cYnxuZXNzdW58XD98XGJzZVxifGRpY29ub3xzZWNvbmR8cml2ZW5kaWN8c29zdGVuZ29uL2kudGVzdChzZW50KSAmJiAhY29ycHVzLmluY2x1ZGVzKHNuLnNsaWNlKDAsIDUwKSkpIGVyci5wdXNoKGAke3doZXJlfTogY29uZmVybWEvaW5kaXBlbmRlbnphL3ZlcmlmaWNhIGFmZmVybWF0YSBzZW56YSBhdHRyaWJ1emlvbmUgbyBuZWdhemlvbmU6ICIke3NlbnR9ImApOwogICAgICAvLyA1LiAiTiBmb250aSIgc29sbyBzZSBzY3JpdHRvIG5laSBkYXRpCiAgICAgIGZvciAoY29uc3QgbSBvZiBzbi5tYXRjaEFsbCgvXGIoXGQrfGR1ZXx0cmV8cXVhdHRyb3xjaW5xdWUpIGZvbnRbaWVdXGIvZykpIGlmICghY29ycHVzVy5pbmNsdWRlcyhudW1Xb3JkcyhtWzBdKSkpIGVyci5wdXNoKGAke3doZXJlfTogIiR7bVswXX0iIG5vbiBjb21wYXJlIG5laSBkYXRpYCk7CiAgICAgIC8vIDYuIHB1bnRpIGNvbnRlc3RhdGkgc2VuemEgYXR0cmlidXppb25lCiAgICAgIGlmIChuICYmICEvXihraWNrZXJ8dGl0bGUpJC8udGVzdChrKSkgZm9yIChjb25zdCB0IG9mIGNvbnRlc3RlZCkgaWYgKHNlbnQuaW5jbHVkZXModCkgJiYgIUFUVFIudGVzdChzZW50KSkgZXJyLnB1c2goYCR7d2hlcmV9OiAiJHt0fSIgw6ggdW4gcHVudG8gY29udGVzdGF0byBuZWkgZGF0aSBtYSBsYSBmcmFzZSBub24gbG8gYXR0cmlidWlzY2U6ICIke3NlbnR9ImApOwogICAgfQogICAgZm9yIChjb25zdCBnIG9mIEdFUkdPKSBpZiAobiAmJiBucm0oYm9keSkuaW5jbHVkZXMoZykgJiYgIXNlZW5HLmhhcyhnKSAmJiBzZWVuRy5hZGQoZykpIGF2di5wdXNoKGAke3doZXJlfTogZ2VyZ28gIiR7Z30iOiDDqCBzcGllZ2F0byBuZWxsYSBjYXJ0YSBvIG5laSBkYXRpPyBzZSBubywgcmlmb3JtdWxhYCk7CiAgfQogIC8vIDcuIGNvbG9ubmUgZGF0YSwgOC4gZmluZXN0cmUgZGkgb3NzZXJ2YXppb25lLCA5LiBmb290ZXIgZm9udGksIDEwLiBjaGl1c3VyYSwgMTEuIGRlbnNpdMOgCiAgKHNwZWMuc2xpZGVzIHx8IFtdKS5mb3JFYWNoKChzLCBpKSA9PiB7CiAgICBjb25zdCBuID0gaSArIDE7CiAgICBjb25zdCBjb2wgPSBzLnR5cGUgPT09ICJ0aW1lbGluZSIgPyAocy5zdGVwcyB8fCBbXSkubWFwKCh4KSA9PiB4LmQpIDogcy50eXBlID09PSAibGlzdCIgPyAocy5pdGVtcyB8fCBbXSkubWFwKCh4KSA9PiB4LmspIDogcy50eXBlID09PSAiY2xvc2UiID8gKHMuaXRlbXMgfHwgW10pLm1hcCgoeCkgPT4geC5rKSA6IFtdOwogICAgY29uc3QgZGwgPSBjb2wuZmlsdGVyKGxvb2tzRGF0ZSkubGVuZ3RoOwogICAgaWYgKHMudHlwZSA9PT0gInRpbWVsaW5lIiB8fCBkbCA+IDApIGNvbC5mb3JFYWNoKCh4KSA9PiB7IGlmIChsb29rc0RhdGUoeCkgfHwgcy50eXBlID09PSAidGltZWxpbmUiKSB7IGlmICghaXNEYXRlTGJsKHgpKSBlcnIucHVzaChgc2xpZGUgJHtufTogIiR7eH0iIG5lbGxhIGNvbG9ubmEgZGF0YSBub24gw6ggdW5hIGRhdGEgc2NyaXR0YSBuZWwgZm9ybWF0byAiNSBPVFQiLCAiNuKAkzcgT1RUIiwgIlNFVCAyMDI2IiwgIjIwMTQiICh1c2EgaWwgdHJhdHRpbm8gbHVuZ28gcGVyIGdsaSBpbnRlcnZhbGxpKWApOyB9IGVsc2UgZXJyLnB1c2goYHNsaWRlICR7bn06ICIke3h9IiDDqCB1biBudW1lcm8gbyB1bidldGljaGV0dGEgaW4gdW5hIGNvbG9ubmEgZGkgZGF0ZTogc3Bvc3RhbG8gbmVsIHRlc3RvYCk7IH0pOwogICAgaWYgKHMudHlwZSA9PT0gImNsb3NlIiAmJiBjb2wuc29tZShsb29rc0RhdGUpICYmICEvb3NzZXJ2YXppb25lfHVmZmljaWFsL2kudGVzdChzLm5vdGUgfHwgIiIpKSBlcnIucHVzaChgc2xpZGUgJHtufTogZGF0ZSBmdXR1cmUgc2VuemEgbGEgcmlnYSAiZGF0ZSBkaSBvc3NlcnZhemlvbmUgZGkgUmVhZCBHZW9wb2xpdGljcywgbm9uIHNjYWRlbnplIHVmZmljaWFsaSIgKG8gbGEgZGljaXR1cmEgdWZmaWNpYWxlLCBzZSBpIGRhdGkgZGljb25vIGNoZSBsbyDDqClgKTsKICAgIGlmIChzLnR5cGUgPT09ICJjbG9zZSIgJiYgL1xiZm9udFtpZV1cYi9pLnRlc3Qocy50aXRsZSB8fCAiIikpIGF2di5wdXNoKGBzbGlkZSAke259OiBsYSBjaGl1c3VyYSBkb3ZyZWJiZSBzaW50ZXRpenphcmUgbCdpbmNlcnRlenphIGNlbnRyYWxlLCBub24gcGFybGFyZSBkaSBmb250aWApOwogICAgaWYgKHMuc3JjKSBmb3IgKGNvbnN0IG5tIG9mIFN0cmluZyhzLnNyYykucmVwbGFjZSgvXlxzKkZvbnRpOlxzKi9pLCAiIikuc3BsaXQoLyxccysvKSkgeyBjb25zdCB4ID0gbnJtKG5tLnRyaW0oKSkucmVwbGFjZSgvXHMqXChbXildKlwpL2csICIiKS50cmltKCk7IGlmICh4ICYmICFub21pLnNvbWUoKGQpID0+IGQgPT09IHgpKSBlcnIucHVzaChgc2xpZGUgJHtufTogbGEgZm9udGUgIiR7bm0udHJpbSgpfSIgbmVsIGZvb3RlciBub24gw6ggdHJhIGxlIGZvbnRpIGRlaSBkYXRpIGxldHRpYCk7IH0KICAgIGNvbnN0IHdvcmRzID0gc3Rycyh7IC4uLnMsIHR5cGU6ICIiLCBpbWc6ICIiLCBzcmM6ICIiIH0pLmpvaW4oIiAiKS5zcGxpdCgvXHMrLykuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aDsKICAgIGlmICh3b3JkcyA+IDg1KSBhdnYucHVzaChgc2xpZGUgJHtufTogJHt3b3Jkc30gcGFyb2xlLCB0cm9wcGUgcGVyIGxvIHNtYXJ0cGhvbmUgKGNvbnNpZ2xpYXRvIOKJpCA4MClgKTsKICB9KTsKICByZXR1cm4geyBlcnIsIGF2diB9Owp9Cgpjb25zdCBbY21kLCBzcGVjUGF0aCwgLi4ucmVzdF0gPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7CmlmICghY21kIHx8ICFzcGVjUGF0aCkgeyBjb25zb2xlLmxvZygidXNvOiBub2RlIHJ1YnJpY2hlLm1qcyBjaGVjayBTUEVDLmpzb24gW0RBVEkuanNvbiAuLi5dIHwgcmVuZGVyIFNQRUMuanNvbiBPVVRfRElSIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3BlY1BhdGgsICJ1dGY4IikpOwpjb25zdCBlcnJzID0gY2hlY2soc3BlYyk7CmlmIChlcnJzLmxlbmd0aCkgeyBjb25zb2xlLmxvZygiRVJST1JJIE5FTExBIFNQRUNJRklDQTpcbi0gIiArIGVycnMuam9pbigiXG4tICIpKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmlmIChjbWQgPT09ICJjaGVjayIpIHsKICBpZiAoIXJlc3QubGVuZ3RoKSB7IGNvbnNvbGUubG9nKCJzcGVjaWZpY2Egb2sgKEFUVEVOWklPTkU6IGNvbnRyb2xsaSBzZW1hbnRpY2kgbm9uIGVzZWd1aXRpLCBwYXNzYSBpIGZpbGUgZGF0aSBsZXR0aSBkb3BvIFNQRUMuanNvbikiKTsgcHJvY2Vzcy5leGl0KDApOyB9CiAgY29uc3QgeyBlcnIsIGF2diB9ID0gc2VtQ2hlY2soc3BlYywgcmVzdCk7CiAgaWYgKGF2di5sZW5ndGgpIGNvbnNvbGUubG9nKCJBVlZJU0kgKHZhbHV0YWxpLCBub24gYmxvY2Nhbm8pOlxuLSAiICsgYXZ2LmpvaW4oIlxuLSAiKSk7CiAgaWYgKGVyci5sZW5ndGgpIHsgY29uc29sZS5sb2coIkVSUk9SSSBTRU1BTlRJQ0kgKGNvcnJlZ2dpIGlsIHRlc3RvIGUgcmlwZXRpKTpcbi0gIiArIGVyci5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0KICBjb25zb2xlLmxvZygic3BlY2lmaWNhIG9rLCBjb250cm9sbGkgc2VtYW50aWNpIG9rIik7CiAgcHJvY2Vzcy5leGl0KDApOwp9CmlmIChjbWQgPT09ICJyZW5kZXIiKSB7CiAgY29uc3Qgb3V0RGlyID0gcmVzdFswXTsKICBjb25zdCB0b3QgPSBzcGVjLnNsaWRlcy5sZW5ndGg7CiAgY29uc3QgcHJvYmxlbXMgPSBhd2FpdCByZW5kZXJBbGwoc3BlYy5zbGlkZXMubWFwKChzLCBpKSA9PiBwYWdlKHNwZWMsIFJbcy50eXBlXShzKSwgaSArIDEsIHRvdCwgcy5zcmMpKSwgb3V0RGlyKTsKICBpZiAocHJvYmxlbXMubGVuZ3RoKSB7IGNvbnNvbGUubG9nKCJQUk9CTEVNSSBESSBMQVlPVVQ6XG4tICIgKyBwcm9ibGVtcy5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0KICBjb25zb2xlLmxvZyhgb2s6ICR7dG90fSBpbW1hZ2luaSBpbiAke291dERpcn0vanBnYCk7Cn0K",
  "siteshots.mjs": "Ly8gc2l0ZXNob3RzLm1qcyDigJQgZm90b2dyYWZhIGlsIHNpdG8gdmVybyAoY2FydGVsbGEgcHVibGljIGRlbCByZXBvKSBpbiAzIFJJVEFHTEkgbGVnZ2liaWxpIHBlciBsYSBydWJyaWNhIGRlbCB2ZW5lcmTDrDoKLy8gYnJpZWZpbmcgKHRpdG9sbyBkaSB1bmEgc3RvcmlhICsgcmlxdWFkcm8gJ0xlIGZvbnRpIGRpdmVyZ29ubycpLCByYWRhciAodW5hIHJpZ2EgJ3NpIMOoIG1vc3NvJyBhcGVydGEpLCB0aW1lbGluZSAodWx0aW1pIGV2ZW50aSBkaSB1biBmaWxvbmUgZmlubyBhIE9HR0kpLgovLyB1c286IG5vZGUgc2l0ZXNob3RzLm1qcyBTSVRFX0RJUiBPVVRfRElSIFtBUElfQkFTRV0KLy8gICBTSVRFX0RJUiA9IGNhcnRlbGxhIHB1YmxpYyBkZWwgcmVwbyBmcmFuY2VzY29nYWxpYW5vL3JlYWQtZ2VvcG9saXRpY3M7IEFQSV9CQVNFID0gaW5kaXJpenpvIGRlbCBXb3JrZXIgKGRhdGkgYWdnaW9ybmF0aSkuCi8vIHNjcml2ZSBPVVRfRElSL2JyaWVmaW5nLmpwZyByYWRhci5qcGcgdGltZWxpbmUuanBnIGUgc3RhbXBhIGlsIGdpb3JubyBkZWkgZGF0aSB1c2F0aS4KaW1wb3J0IGZzIGZyb20gIm5vZGU6ZnMiOwppbXBvcnQgaHR0cCBmcm9tICJub2RlOmh0dHAiOwppbXBvcnQgcGF0aCBmcm9tICJub2RlOnBhdGgiOwpjb25zdCBbc2l0ZURpciwgb3V0RGlyLCBhcGldID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpOwppZiAoIXNpdGVEaXIgfHwgIW91dERpcikgeyBjb25zb2xlLmxvZygidXNvOiBub2RlIHNpdGVzaG90cy5tanMgU0lURV9ESVIgT1VUX0RJUiBbQVBJX0JBU0VdIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpmcy5ta2RpclN5bmMob3V0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKY29uc3QgSE9NRSA9IHByb2Nlc3MuZW52LkhPTUUgfHwgIi9yb290IjsKbGV0IGNocm9taXVtOwpmb3IgKGNvbnN0IHAgb2YgWyJwbGF5d3JpZ2h0IiwgcGF0aC5qb2luKEhPTUUsICJpZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiKSwgIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIiwgIi9ob21lL2NsYXVkZS8ubnBtLWdsb2JhbC9saWIvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIiwgIi9vcHQvbnBtLXRvb2xzL25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIsICIvdG1wL2lndGVzdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiXSkgeyB0cnkgeyBjaHJvbWl1bSA9IChhd2FpdCBpbXBvcnQocC5zdGFydHNXaXRoKCIvIikgPyAiZmlsZTovLyIgKyBwIDogcCkpLmNocm9taXVtOyBicmVhazsgfSBjYXRjaCAoZSkge30gfQppZiAoIWNocm9taXVtKSB7IGNvbnNvbGUubG9nKCJQbGF5d3JpZ2h0IG5vbiB0cm92YXRvIik7IHByb2Nlc3MuZXhpdCgxKTsgfQpsZXQgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oc2l0ZURpciwgImRhdGEuanNvbiIpKTsKbGV0IGZvbnRlID0gImRhdGEuanNvbiBkZWwgcmVwbyAocHXDsiBlc3NlcmUgdmVjY2hpbykiOwppZiAoYXBpKSB7IHRyeSB7IGNvbnN0IHIgPSBhd2FpdCBmZXRjaChhcGkucmVwbGFjZSgvXC8kLywgIiIpICsgIi9hcGkvZGF0YS5qc29uIiwgeyBoZWFkZXJzOiB7ICJ1c2VyLWFnZW50IjogInJnLXJvdXRpbmUvMS4wIiB9IH0pOyBpZiAoci5vaykgeyBjb25zdCBiID0gQnVmZmVyLmZyb20oYXdhaXQgci5hcnJheUJ1ZmZlcigpKTsgSlNPTi5wYXJzZShiLnRvU3RyaW5nKCkpOyBkYXRhID0gYjsgZm9udGUgPSAiV29ya2VyIC9hcGkvZGF0YS5qc29uIChhZ2dpb3JuYXRvKSI7IH0gfSBjYXRjaCAoZSkge30gfQpjb25zdCBNSU1FID0geyAiLmh0bWwiOiAidGV4dC9odG1sIiwgIi5qc29uIjogImFwcGxpY2F0aW9uL2pzb24iLCAiLmpzIjogInRleHQvamF2YXNjcmlwdCIsICIuY3NzIjogInRleHQvY3NzIiwgIi5wbmciOiAiaW1hZ2UvcG5nIiwgIi5qcGciOiAiaW1hZ2UvanBlZyIsICIuc3ZnIjogImltYWdlL3N2Zyt4bWwiIH07CmNvbnN0IHNydiA9IGh0dHAuY3JlYXRlU2VydmVyKChxLCBzKSA9PiB7IGxldCB1ID0gZGVjb2RlVVJJQ29tcG9uZW50KHEudXJsLnNwbGl0KCI/IilbMF0pOyBpZiAodSA9PT0gIi8iKSB1ID0gIi9pbmRleC5odG1sIjsgY29uc3QgZiA9IHBhdGguam9pbihzaXRlRGlyLCB1KTsgaWYgKCFmLnN0YXJ0c1dpdGgocGF0aC5yZXNvbHZlKHNpdGVEaXIpKSB8fCAhZnMuZXhpc3RzU3luYyhmKSkgeyBzLndyaXRlSGVhZCg0MDQpOyBzLmVuZCgpOyByZXR1cm47IH0gcy53cml0ZUhlYWQoMjAwLCB7ICJjb250ZW50LXR5cGUiOiBNSU1FW3BhdGguZXh0bmFtZShmKV0gfHwgImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSIgfSk7IHMuZW5kKGZzLnJlYWRGaWxlU3luYyhmKSk7IH0pLmxpc3RlbigwKTsKY29uc3QgcG9ydCA9IHNydi5hZGRyZXNzKCkucG9ydDsKY29uc3QgYnIgPSBhd2FpdCBjaHJvbWl1bS5sYXVuY2goeyBleGVjdXRhYmxlUGF0aDogcHJvY2Vzcy5lbnYuQ0hST01JVU0gfHwgKGZzLmV4aXN0c1N5bmMoIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iKSA/ICIvb3B0L3B3LWJyb3dzZXJzL2Nocm9taXVtIiA6IHVuZGVmaW5lZCksIGFyZ3M6IFsiLS1uby1zYW5kYm94Il0gfSk7CmNvbnN0IGN0eCA9IGF3YWl0IGJyLm5ld0NvbnRleHQoeyB2aWV3cG9ydDogeyB3aWR0aDogMzkwLCBoZWlnaHQ6IDgwMCB9LCBkZXZpY2VTY2FsZUZhY3RvcjogMi41LCBpc01vYmlsZTogdHJ1ZSwgaGFzVG91Y2g6IHRydWUgfSk7CmF3YWl0IGN0eC5hZGRJbml0U2NyaXB0KCgpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oInJnLXVpZCIsICJzaG90Iik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCJyZy1ndWlkYS12aXN0YSIsICIxIik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCJyZy1ub3ZpdGEtdmlzdGEiLCAiOTk5OSIpOyB9IGNhdGNoIChlKSB7fSB9KTsKYXdhaXQgY3R4LnJvdXRlKC9yZy1hcGlcLmJyaWVmaW5naHViXC53b3JrZXJzXC5kZXYvLCAocikgPT4geyBpZiAoci5yZXF1ZXN0KCkudXJsKCkuZW5kc1dpdGgoIi9hcGkvZGF0YS5qc29uIikpIHIuZnVsZmlsbCh7IHN0YXR1czogMjAwLCBjb250ZW50VHlwZTogImFwcGxpY2F0aW9uL2pzb24iLCBib2R5OiBkYXRhIH0pOyBlbHNlIHIuZnVsZmlsbCh7IHN0YXR1czogMjAwLCBjb250ZW50VHlwZTogImFwcGxpY2F0aW9uL2pzb24iLCBib2R5OiAie30iIH0pOyB9KTsKY29uc3QgcCA9IGF3YWl0IGN0eC5uZXdQYWdlKCk7CmF3YWl0IHAuZ290byhgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L2luZGV4Lmh0bWxgKTsKYXdhaXQgcC53YWl0Rm9yVGltZW91dCgyNTAwKTsKY29uc3Qgc3RhbXAgPSBhd2FpdCBwLmV2YWx1YXRlKCgpID0+IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjc3RhbXAiKSB8fCB7fSkudGV4dENvbnRlbnQgfHwgIiIpOwphd2FpdCBwLmFkZFN0eWxlVGFnKHsgY29udGVudDogImhlYWRlci50b3AsLnN1YnRhYnMsLnJkLWlkeCwucGFuZWx7cG9zaXRpb246c3RhdGljIWltcG9ydGFudH0jcHViQmFye2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9IiB9KTsKLy8gcml0YWdsaWEgZGFsbGEgY2ltYSBkaSBhIGFsIGZvbmRvIGRpIGIgKGNvb3JkaW5hdGUgZGkgcGFnaW5hKSwgbGFyZ2hlenphIHcgZGEgeDAKY29uc3QgY2xpcCA9IGFzeW5jIChhLCBiLCBuYW1lLCB4MCwgdykgPT4gewogIGNvbnN0IHN5ID0gYXdhaXQgcC5ldmFsdWF0ZSgoKSA9PiB3aW5kb3cuc2Nyb2xsWSk7IGNvbnN0IHJhID0gYXdhaXQgYS5ib3VuZGluZ0JveCgpLCByYiA9IGF3YWl0IGIuYm91bmRpbmdCb3goKTsKICBjb25zdCBwYWQgPSA2LCB5ID0gcmEueSArIHN5IC0gcGFkLCBoZ3QgPSByYi55ICsgc3kgKyByYi5oZWlnaHQgLSAocmEueSArIHN5KSArIDIgKiBwYWQ7CiAgYXdhaXQgcC5zY3JlZW5zaG90KHsgcGF0aDogcGF0aC5qb2luKG91dERpciwgbmFtZSArICIuanBnIiksIHR5cGU6ICJqcGVnIiwgcXVhbGl0eTogOTMsIGZ1bGxQYWdlOiB0cnVlLCBjbGlwOiB7IHg6IHgwLCB5LCB3aWR0aDogdywgaGVpZ2h0OiBoZ3QgfSB9KTsKICBpZiAoaGd0ID4gMzQwKSBjb25zb2xlLmxvZygiQVRURU5aSU9ORTogcml0YWdsaW8gIiArIG5hbWUgKyAiIGFsdG8gIiArIE1hdGgucm91bmQoaGd0KSArICIgcHggKG1heCAzNDApOiBwb3RyZWJiZSBlc3NlcmUgdGFnbGlhdG8gbmVsbGEgY2FydGEiKTsKfTsKLy8gMS4gYnJpZWZpbmc6IHByaW1hIHN0b3JpYSBjb24gJ0xlIGZvbnRpIGRpdmVyZ29ubycgKGFsdHJpbWVudGkgbGEgcHJpbWEpOyBzaSBuYXNjb25kZSBpbCBibG9jY28gZGVpIGZhdHRpLCByZXN0YSB0aXRvbG8gKyBkaXZlcmdlbnplCmNvbnN0IHNpZCA9IGF3YWl0IHAuZXZhbHVhdGUoKCkgPT4geyBjb25zdCBzdCA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjYnJpZWZpbmcgLnN0b3J5IildOyBjb25zdCBzID0gc3QuZmluZCgoeCkgPT4geC5xdWVyeVNlbGVjdG9yKCIuZGl2ZXJnZSIpKTsgcmV0dXJuIHMgPyBzLmlkIDogKHN0WzBdIHx8IHt9KS5pZCB8fCAiIjsgfSk7CmlmICghc2lkKSB7IGNvbnNvbGUubG9nKCJicmllZmluZzogbmVzc3VuYSBzdG9yaWEiKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmF3YWl0IHAuYWRkU3R5bGVUYWcoeyBjb250ZW50OiBgIyR7c2lkfSAuc3RvLWI+LmJsb2NrOmZpcnN0LWNoaWxke2Rpc3BsYXk6bm9uZSFpbXBvcnRhbnR9YCB9KTsKY29uc3QgaGFzRGl2ID0gYXdhaXQgcC4kKGAjJHtzaWR9IC5kaXZlcmdlYCk7CmF3YWl0IGNsaXAoYXdhaXQgcC4kKGAjJHtzaWR9IC5zdG8taGApLCBoYXNEaXYgfHwgKGF3YWl0IHAuJChgIyR7c2lkfSAuc3RvLWhgKSksICJicmllZmluZyIsIDgsIDM3NCk7Ci8vIDIuIHJhZGFyOiBwcmltYSByaWdhICdtb3NzbycgY29uIHNwaWVnYXppb25lLCBhcGVydGEKYXdhaXQgcC5jbGljaygiI3RhYi1yYWRhciIpOyBhd2FpdCBwLndhaXRGb3JUaW1lb3V0KDgwMCk7CmNvbnN0IHJpZCA9IGF3YWl0IHAuZXZhbHVhdGUoKCkgPT4geyBjb25zdCByID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNyYWRhck51bSAucnJvdy5tb3NzbyIpXS5maW5kKCh4KSA9PiB4LnF1ZXJ5U2VsZWN0b3IoIi5yY2F1c2UiKSk7IHJldHVybiByID8gci5pZCA6ICIiOyB9KTsKaWYgKCFyaWQpIHsgY29uc29sZS5sb2coInJhZGFyOiBuZXNzdW5hIHZvY2UgbW9zc2EgY29uIHNwaWVnYXppb25lIik7IHByb2Nlc3MuZXhpdCgxKTsgfQphd2FpdCBwLmNsaWNrKGAjJHtyaWR9IC5ya2ApOyBhd2FpdCBwLndhaXRGb3JUaW1lb3V0KDYwMCk7CmNvbnN0IHJvdyA9IGF3YWl0IHAuJCgiIyIgKyByaWQpOyBhd2FpdCBjbGlwKHJvdywgcm93LCAicmFkYXIiLCA4LCAzNzQpOwovLyAzLiB0aW1lbGluZTogcHJpbW8gZmlsb25lIChjaGlwKSBjb24gYWxtZW5vIDQgZXZlbnRpOiB1bHRpbWkgMiBldmVudGkgKyBtYXJjYXRvcmUgT0dHSQphd2FpdCBwLmNsaWNrKCIjdGFiLXRpbWVsaW5lIik7IGF3YWl0IHAud2FpdEZvclRpbWVvdXQoODAwKTsKY29uc3QgY2hpcHMgPSBhd2FpdCBwLiQkZXZhbCgiW2RhdGEtdGwtY2hpcF0iLCAoZSkgPT4gZS5tYXAoKHgpID0+IHguZ2V0QXR0cmlidXRlKCJkYXRhLXRsLWNoaXAiKSkuZmlsdGVyKEJvb2xlYW4pKTsKbGV0IGRvbmUgPSBmYWxzZSwgdG5hbWUgPSAiIjsKZm9yIChjb25zdCBjIG9mIGNoaXBzKSB7CiAgYXdhaXQgcC5jbGljayhgW2RhdGEtdGwtY2hpcD0iJHtjfSJdYCk7IGF3YWl0IHAud2FpdEZvclRpbWVvdXQoMTAwMCk7CiAgY29uc3QgdHJzID0gYXdhaXQgcC4kJCgiI3RocmVhZFZpZXcgLmFjYy5zZWwgLnRsID4gZGV0YWlscy50ciIpOyBjb25zdCBub3cgPSBhd2FpdCBwLiQoIiN0aHJlYWRWaWV3IC5hY2Muc2VsIC50bC1ub3ciKTsKICBjb25zdCBiYSA9IHRycy5sZW5ndGggPj0gNCAmJiBub3cgPyBhd2FpdCB0cnNbdHJzLmxlbmd0aCAtIDJdLmJvdW5kaW5nQm94KCkgOiBudWxsLCBibiA9IG5vdyA/IGF3YWl0IG5vdy5ib3VuZGluZ0JveCgpIDogbnVsbDsKICBpZiAoYmEgJiYgYm4gJiYgYm4ueSA+IGJhLnkgJiYgYm4ueSArIGJuLmhlaWdodCAtIGJhLnkgPCAzNDApIHsgYXdhaXQgY2xpcCh0cnNbdHJzLmxlbmd0aCAtIDJdLCBub3csICJ0aW1lbGluZSIsIDI0LCAzNDIpOyB0bmFtZSA9IGM7IGRvbmUgPSB0cnVlOyBicmVhazsgfQp9CmlmICghZG9uZSkgeyBjb25zb2xlLmxvZygidGltZWxpbmU6IG5lc3N1biBmaWxvbmUgY29uIGV2ZW50aSBzdWZmaWNpZW50aSIpOyBwcm9jZXNzLmV4aXQoMSk7IH0KYXdhaXQgYnIuY2xvc2UoKTsgc3J2LmNsb3NlKCk7CmNvbnNvbGUubG9nKCJkYXRpOiAiICsgZm9udGUgKyAiIMK3ICIgKyBTdHJpbmcoc3RhbXApLnRyaW0oKSArICIgwrcgdGltZWxpbmU6ICIgKyB0bmFtZSArICIgwrcgc3RvcmlhIGJyaWVmaW5nOiAiICsgc2lkKTsK",
  "numero.mjs": "Ly8gbnVtZXJvLm1qcyDigJQgcnVicmljYSBkZWwgbWVyY29sZWTDrCAiVW4gbnVtZXJvIGNoZSBzcGllZ2EgcXVhbGNvc2EiICgzIGNhcnRlIDEwODB4MTM1MCkuCi8vIHVzbzogIG5vZGUgbnVtZXJvLm1qcyBjaGVjayAgU1BFQy5qc29uCi8vICAgICAgIG5vZGUgbnVtZXJvLm1qcyByZW5kZXIgU1BFQy5qc29uIE9VVF9ESVIgICAtPiBPVVRfRElSL2pwZy8wMS5qcGcgMDIuanBnIDAzLmpwZwovLyBWaXZlIGFjY2FudG8gYSBpZ2tpdC5tanMgKHVzYSBpIHN1b2kgbm9kZV9tb2R1bGVzIGUgaSBzdW9pIGZvbnQpLiBUdXR0byBhcnJpdmEgZGFsbGEgc3BlY2lmaWNhLgppbXBvcnQgZnMgZnJvbSAibm9kZTpmcyI7CmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gIm5vZGU6Y2hpbGRfcHJvY2VzcyI7CmltcG9ydCBwYXRoIGZyb20gIm5vZGU6cGF0aCI7CmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICJub2RlOnVybCI7CmNvbnN0IEhFUkUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTsKCmNvbnN0IEdPTEQgPSAiI0YyQjg0QiI7CmNvbnN0IGVzYyA9ICh0KSA9PiBTdHJpbmcodCA/PyAiIikucmVwbGFjZSgvWyY8PiJdL2csIChjKSA9PiAoeyAiJiI6ICImYW1wOyIsICI8IjogIiZsdDsiLCAiPiI6ICImZ3Q7IiwgJyInOiAiJnF1b3Q7IiB9W2NdKSk7CmNvbnN0IE1FU0kgPSBbIkdFTiIsICJGRUIiLCAiTUFSIiwgIkFQUiIsICJNQUciLCAiR0lVIiwgIkxVRyIsICJBR08iLCAiU0VUIiwgIk9UVCIsICJOT1YiLCAiRElDIl07CmNvbnN0IE1FU0lfRVNURVNJID0gImdlbm5haW98ZmViYnJhaW98bWFyem98YXByaWxlfG1hZ2dpb3xnaXVnbm98bHVnbGlvfGFnb3N0b3xzZXR0ZW1icmV8b3R0b2JyZXxub3ZlbWJyZXxkaWNlbWJyZSI7CmNvbnN0IGRhdGFMYmwgPSAoZCkgPT4geyBjb25zdCBbeSwgbSwgZGRdID0gZC5zcGxpdCgiLSIpLm1hcChOdW1iZXIpOyByZXR1cm4gYCR7ZGR9ICR7TUVTSVttIC0gMV19ICR7eX1gOyB9Owpjb25zdCBNRVNJX0wgPSBNRVNJX0VTVEVTSS5zcGxpdCgifCIpOwpjb25zdCBkYXRhQnJldiA9IChkKSA9PiB7IGNvbnN0IFssIG0sIGRkXSA9IGQuc3BsaXQoIi0iKS5tYXAoTnVtYmVyKTsgcmV0dXJuIGAke2RkfSAke01FU0lbbSAtIDFdfWA7IH07CmNvbnN0IGRhdGFQcm9zYSA9IChkKSA9PiB7IGNvbnN0IFssIG0sIGRkXSA9IGQuc3BsaXQoIi0iKS5tYXAoTnVtYmVyKTsgcmV0dXJuIGAke2RkfSAke01FU0lfTFttIC0gMV19YDsgfTsKCi8vIHNwaWVnYXppb25pIGZpc3NlIGRpIG9nbmkgaW5kaWNhdG9yZSAoc3Rlc3NlIGRlbCBSYWRhciBkZWwgc2l0bykKY29uc3QgSU5EID0geyJzcHJlYWQiOiB7ImNvc2EiOiAiRGlmZmVyZW56YSB0cmEgaWwgcmVuZGltZW50byBkZWkgdGl0b2xpIGRpIFN0YXRvIGl0YWxpYW5pIGUgdGVkZXNjaGkgYSAxMCBhbm5pLiBNaXN1cmEgcXVhbnRvIGkgbWVyY2F0aSBjaGllZG9ubyBpbiBwacO5IHBlciBwcmVzdGFyZSBhbGwnSXRhbGlhIGludmVjZSBjaGUgYWxsYSBHZXJtYW5pYS4iLCAiY29udGEiOiAiU2Ugc2FsZSwgY3Jlc2NlIGlsIGNvc3RvIGRlbCBkZWJpdG8gcHViYmxpY28gZSwgYSBjYXNjYXRhLCBxdWVsbG8gZGkgbXV0dWkgZSBwcmVzdGl0aS4gw4ggaWwgdGVybW9tZXRybyBkZWxsYSBmaWR1Y2lhIG5laSBjb250aSBpdGFsaWFuaS4iLCAibm9tZSI6IG51bGx9LCAiYnRwMTAiOiB7ImNvc2EiOiAiTCdpbnRlcmVzc2UgYW5udW8gY2hlIGxvIFN0YXRvIGl0YWxpYW5vIHBhZ2EgcGVyIGluZGViaXRhcnNpIGEgMTAgYW5uaS4iLCAiY29udGEiOiAiRGlwZW5kZSBkYWkgdGFzc2kgQkNFLCBkYWxsJ2luZmxhemlvbmUgYXR0ZXNhIGUgZGFsbGEgZmlkdWNpYSBuZWkgY29udGkgcHViYmxpY2kuIFBlc2Egc3VsbGEgc3Blc2EgcGVyIGludGVyZXNzaSBlIHF1aW5kaSBzdWdsaSBzcGF6aSBkZWxsYSBtYW5vdnJhLiIsICJub21lIjogbnVsbH0sICJicmVudCI6IHsiY29zYSI6ICJJbCBwcmV6em8gZGkgcmlmZXJpbWVudG8gZGVsIHBldHJvbGlvIHBlciBsJ0V1cm9wYSBlIGdyYW4gcGFydGUgZGVsIG1vbmRvLCBpbiBkb2xsYXJpIGFsIGJhcmlsZS4iLCAiY29udGEiOiAiU2kgbXVvdmUgY29uIGxlIGNyaXNpIGluIE1lZGlvIE9yaWVudGUsIGxlIGRlY2lzaW9uaSBPUEVDKyBlIGxhIGNyZXNjaXRhIGdsb2JhbGUuIEFycml2YSBzdSBjYXJidXJhbnRpLCB2b2xpLCB0cmFzcG9ydGkgZSBpbmZsYXppb25lLiIsICJub21lIjogbnVsbH0sICJ0dGYiOiB7ImNvc2EiOiAiSWwgcHJlenpvIGRpIHJpZmVyaW1lbnRvIGRlbCBnYXMgbmF0dXJhbGUgaW4gRXVyb3BhLCBzY2FtYmlhdG8gYWQgQW1zdGVyZGFtLCBpbiBldXJvIHBlciBtZWdhd2F0dG9yYS4iLCAiY29udGEiOiAiRGV0ZXJtaW5hIGJvbGxldHRlIGRpIGx1Y2UgZSBnYXMgZSBpIGNvc3RpIGRlbGwnaW5kdXN0cmlhLiDDiCBzZW5zaWJpbGUgYSBmb3JuaXR1cmUgZGkgZ2FzIGxpcXVlZmF0dG8sIHN0b2NjYWdnaSBlIGNsaW1hLiIsICJub21lIjogbnVsbH0sICJldXJ1c2QiOiB7ImNvc2EiOiAiUXVhbnRpIGRvbGxhcmkgdmFsZSB1biBldXJvLCBzZWNvbmRvIGlsIGNhbWJpbyBkaSByaWZlcmltZW50byBkZWxsYSBCQ0UuIiwgImNvbnRhIjogIlVuIGV1cm8gZm9ydGUgcmVuZGUgcGnDuSBlY29ub21pY2hlIGxlIGltcG9ydGF6aW9uaSBwYWdhdGUgaW4gZG9sbGFyaSwgY29tZSBwZXRyb2xpbyBlIGdhcywgZSBwacO5IGNhcmUgbGUgZXNwb3J0YXppb25pIGV1cm9wZWUuIENvbnRhIGFuY2hlIHBlciBpIGZsdXNzaSB0dXJpc3RpY2kgZGFnbGkgU3RhdGkgVW5pdGkuIiwgIm5vbWUiOiBudWxsfSwgIm9ybyI6IHsiY29zYSI6ICJJbCBwcmV6em8gZGVsbCdvcm8gaW4gZG9sbGFyaSBwZXIgb25jaWEuIiwgImNvbnRhIjogIsOIIGlsIGJlbmUgcmlmdWdpbzogdGVuZGUgYSBzYWxpcmUgY29uIGwnaW5jZXJ0ZXp6YSBlIGxlIHRlbnNpb25pLCBhIHNjZW5kZXJlIHF1YW5kbyBkb2xsYXJvIGUgcmVuZGltZW50aSBVU0Egc2FsZ29uby4gTGUgYmFuY2hlIGNlbnRyYWxpIGxvIGFjY3VtdWxhbm8gY29tZSByaXNlcnZhLiIsICJub21lIjogbnVsbH0sICJub2xpIjogeyJjb3NhIjogIlF1YW50byBjb3N0YSBzcGVkaXJlIGNvbnRhaW5lciBkYWxsYSBDaW5hIHN1bGxlIHByaW5jaXBhbGkgcm90dGUsIEV1cm9wYSBjb21wcmVzYTogw6ggbCdpbmRpY2UgU0NGSSBkZWxsYSBib3JzYSBkaSBTaGFuZ2hhaSwgaW4gcHVudGksIGFnZ2lvcm5hdG8gb2duaSBzZXR0aW1hbmEuIiwgImNvbnRhIjogIlNhbGUgcXVhbmRvIGxlIG5hdmkgZGV2b25vIGV2aXRhcmUgaWwgTWFyIFJvc3NvIG8gSG9ybXV6IGUgYWxsdW5nYW5vIGxhIHJvdHRhLiBBcnJpdmEgc3VpIHByZXp6aSBkZWxsZSBtZXJjaSBpbXBvcnRhdGUgY29uIHF1YWxjaGUgc2V0dGltYW5hIGRpIHJpdGFyZG8uIiwgIm5vbWUiOiAiTm9saSBjb250YWluZXIgZGFsbGEgQ2luYSJ9LCAiZ3Jhbm8iOiB7ImNvc2EiOiAiSWwgcHJlenpvIGRpIHJpZmVyaW1lbnRvIGRlbCBncmFubyBhbGxhIGJvcnNhIGRpIENoaWNhZ28sIGluIGNlbnRlc2ltaSBkaSBkb2xsYXJvIHBlciBidXNoZWwgKGNpcmNhIDI3IGtnKS4iLCAiY29udGEiOiAiVWNyYWluYSBlIFJ1c3NpYSBzb25vIHRyYSBpIHByaW1pIGVzcG9ydGF0b3JpOiBndWVycmEsIHBvcnRpIGRlbCBNYXIgTmVybyBlIGFjY29yZGkgc3VpIGNvcnJpZG9pIGxvIHNwb3N0YW5vLiBQZXNhIHN1bCBwcmV6em8gZGkgcGFuZSBlIHBhc3RhIGUgc3VsbGEgc2ljdXJlenphIGFsaW1lbnRhcmUgZGkgTWVkaW8gT3JpZW50ZSBlIEFmcmljYS4iLCAibm9tZSI6ICJHcmFubyJ9LCAiY255IjogeyJjb3NhIjogIlF1YW50aSB5dWFuIGNpbmVzaSBzZXJ2b25vIHBlciB1biBkb2xsYXJvLiIsICJjb250YSI6ICJVbm8geXVhbiBwacO5IGRlYm9sZSByZW5kZSBwacO5IGNvbXBldGl0aXZlIGxlIGVzcG9ydGF6aW9uaSBjaW5lc2kgZSBwdcOyIGVzc2VyZSB1bmEgcmlzcG9zdGEgYWkgZGF6aS4gUGVjaGlubyBsbyBndWlkYSBlbnRybyB1bmEgYmFuZGE6IGkgbW92aW1lbnRpIHNvbm8gc2VnbmFsaSBkaSBwb2xpdGljYSwgbm9uIHNvbG8gZGkgbWVyY2F0by4iLCAibm9tZSI6ICJZdWFuIHBlciBkb2xsYXJvIn0sICJiY2UiOiB7ImNvc2EiOiAiSWwgdGFzc28gY2hlIGxhIEJDRSByaWNvbm9zY2UgYWxsZSBiYW5jaGUgc3VpIGRlcG9zaXRpOiDDqCBsYSBsZXZhIHByaW5jaXBhbGUgZGVsbGEgcG9saXRpY2EgbW9uZXRhcmlhIG5lbGwnYXJlYSBldXJvLiIsICJjb250YSI6ICJPcmllbnRhIGlsIGNvc3RvIGRpIG11dHVpIGUgcHJlc3RpdGkgZSBpIHJlbmRpbWVudGkgZGVpIHRpdG9saSBkaSBTdGF0by4gVW5hIGRlY2lzaW9uZSBCQ0Ugc3Bvc3RhIHNwcmVhZCBlIGNhbWJpby4iLCAibm9tZSI6IG51bGx9fTsKCi8vIC0tLS0tLS0tLS0gbGltaXRpIGRpIHRlc3RvIC0tLS0tLS0tLS0KY29uc3QgTElNID0geyBoZWFkbGluZTogOTAsIHdoeTogMjMwLCBsaW1pdHM6IDIxMCwgbm9tZTogNDAgfTsKCi8vIC0tLS0tLS0tLS0gbnVtZXJpIGluIGZvcm1hdG8gaXRhbGlhbm8gLS0tLS0tLS0tLQpmdW5jdGlvbiBmbXQobiwgZGVjKSB7CiAgaWYgKG4gPT09IG51bGwgfHwgbiA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKG4pKSByZXR1cm4gIiI7CiAgY29uc3QgZCA9IGRlYyA/PyAoTWF0aC5hYnMobikgPj0gMTAwMCA/IDAgOiBNYXRoLmFicyhuKSA+PSAxMDAgPyAxIDogMik7CiAgbGV0IHMgPSBOdW1iZXIobikudG9GaXhlZChkKTsKICBzID0gcy5yZXBsYWNlKC9cLj8wKyQvLCAobSkgPT4gKGQgPiAwICYmIHMuaW5jbHVkZXMoIi4iKSA/ICIiIDogbSkpOwogIGNvbnN0IFtpLCBmXSA9IHMuc3BsaXQoIi4iKTsKICBjb25zdCBpaSA9IGkucmVwbGFjZSgvXEIoPz0oXGR7M30pKyg/IVxkKSkvZywgIi4iKTsKICByZXR1cm4gZiA/IGAke2lpfSwke2Z9YCA6IGlpOwp9CmNvbnN0IHNnbiA9IChuLCBkZWMpID0+IChuID4gMCA/ICIrIiA6IG4gPCAwID8gIuKIkiIgOiAiIikgKyBmbXQoTWF0aC5hYnMobiksIGRlYyk7CgovLyAtLS0tLS0tLS0tIGZvbnQgLS0tLS0tLS0tLQpsZXQgZm9udHNUcmllZCA9IGZhbHNlOwpjb25zdCBmb250UGF0aCA9IChmbikgPT4gewogIGNvbnN0IHBrZyA9IGZuLnJlcGxhY2UoLy1sYXRpbi0uKiQvLCAiIik7CiAgY29uc3QgSE9NRSA9IHByb2Nlc3MuZW52LkhPTUUgfHwgIi9yb290IjsKICBjb25zdCBjYW5kcyA9ICgpID0+IFtwYXRoLmpvaW4oSEVSRSwgIm5vZGVfbW9kdWxlcyIsICJAZm9udHNvdXJjZSIsIHBrZywgImZpbGVzIiwgZm4pLCBwYXRoLmpvaW4oSEVSRSwgImZvbnRzIiwgZm4pLCBwYXRoLmpvaW4oSE9NRSwgImlna2l0IiwgIm5vZGVfbW9kdWxlcyIsICJAZm9udHNvdXJjZSIsIHBrZywgImZpbGVzIiwgZm4pLCBwYXRoLmpvaW4oSE9NRSwgImlna2l0IiwgImZvbnRzIiwgZm4pLCBwYXRoLmpvaW4oIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzL0Bmb250c291cmNlIiwgcGtnLCAiZmlsZXMiLCBmbiksIHBhdGguam9pbigiL3RtcC9yay9ucG1mL25vZGVfbW9kdWxlcy9AZm9udHNvdXJjZSIsIHBrZywgImZpbGVzIiwgZm4pXTsKICBmb3IgKGNvbnN0IHAgb2YgY2FuZHMoKSkgaWYgKGZzLmV4aXN0c1N5bmMocCkpIHJldHVybiBwOwogIGlmICghZm9udHNUcmllZCkgeyAvLyB1bHRpbW8gdGVudGF0aXZvOiBzY2FyaWNhIGkgZm9udCBkYSBucG0gdW5hIHZvbHRhCiAgICBmb250c1RyaWVkID0gdHJ1ZTsKICAgIHNwYXduU3luYygibnBtIiwgWyJpIiwgIi0tbm8tYXVkaXQiLCAiLS1uby1mdW5kIiwgIi0tcHJlZml4IiwgIi90bXAvcmsvbnBtZiIsICJAZm9udHNvdXJjZS9pYm0tcGxleC1zZXJpZiIsICJAZm9udHNvdXJjZS9pYm0tcGxleC1zYW5zIiwgIkBmb250c291cmNlL2libS1wbGV4LW1vbm8iXSwgeyBzdGRpbzogImluaGVyaXQiIH0pOwogICAgZm9yIChjb25zdCBwIG9mIGNhbmRzKCkpIGlmIChmcy5leGlzdHNTeW5jKHApKSByZXR1cm4gcDsKICB9CiAgdGhyb3cgbmV3IEVycm9yKCJmb250IG1hbmNhbnRlOiAiICsgZm4pOwp9Owpjb25zdCBmNjQgPSAoZm4pID0+IGZzLnJlYWRGaWxlU3luYyhmb250UGF0aChmbikpLnRvU3RyaW5nKCJiYXNlNjQiKTsKY29uc3QgRkFDRVMgPSBbCiAgWyJQbGV4IFNlcmlmIiwgNTAwLCAiaWJtLXBsZXgtc2VyaWYtbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiJdLCBbIlBsZXggU2VyaWYiLCA2MDAsICJpYm0tcGxleC1zZXJpZi1sYXRpbi02MDAtbm9ybWFsLndvZmYyIl0sCiAgWyJQbGV4IFNhbnMiLCA0MDAsICJpYm0tcGxleC1zYW5zLWxhdGluLTQwMC1ub3JtYWwud29mZjIiXSwgWyJQbGV4IFNhbnMiLCA2MDAsICJpYm0tcGxleC1zYW5zLWxhdGluLTYwMC1ub3JtYWwud29mZjIiXSwKICBbIlBsZXggTW9ubyIsIDUwMCwgImlibS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiJdLApdLm1hcCgoW2ZhbSwgdywgZm5dKSA9PiBgQGZvbnQtZmFjZXtmb250LWZhbWlseTonJHtmYW19Jztmb250LXdlaWdodDoke3d9O3NyYzp1cmwoZGF0YTpmb250L3dvZmYyO2Jhc2U2NCwke2Y2NChmbil9KSBmb3JtYXQoJ3dvZmYyJyl9YCkuam9pbigiIik7Cgpjb25zdCBDU1MgPSBGQUNFUyArIGAKKntib3gtc2l6aW5nOmJvcmRlci1ib3g7bWFyZ2luOjB9CmJvZHl7YmFja2dyb3VuZDojMDAwfQouc3twb3NpdGlvbjpyZWxhdGl2ZTtiYWNrZ3JvdW5kOiMwRTE1MUI7Y29sb3I6I0U0RUFFRjtmb250LWZhbWlseTonUGxleCBTYW5zJyxzYW5zLXNlcmlmO292ZXJmbG93OmhpZGRlbjtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1ufQouczo6YmVmb3Jle2NvbnRlbnQ6IiI7cG9zaXRpb246YWJzb2x1dGU7cmlnaHQ6LTI2MHB4O3RvcDotMjYwcHg7d2lkdGg6OTAwcHg7aGVpZ2h0OjkwMHB4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSxyZ2JhKDEzNCwxODAsMjM0LC4zMCkscmdiYSgxMzQsMTgwLDIzNCwwKSA2OCUpfQouczo6YWZ0ZXJ7Y29udGVudDoiIjtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjA7Ym90dG9tOjA7d2lkdGg6MTBweDtiYWNrZ3JvdW5kOiM4NkI0RUF9Ci50b3AsLm1pZCwuZm9vdHtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjF9Ci50b3B7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcn0KLmJyYW5ke2ZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJyxzZXJpZjtmb250LXdlaWdodDo2MDA7Zm9udC1zaXplOjM2cHh9Ci5sYWJ7Zm9udC1mYW1pbHk6J1BsZXggTW9ubycsbW9ub3NwYWNlO2ZvbnQtd2VpZ2h0OjUwMDtsZXR0ZXItc3BhY2luZzouMDhlbTtjb2xvcjojODZCNEVBO2ZvbnQtc2l6ZToyNXB4fQoubWlke2ZsZXg6MTtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO21pbi1oZWlnaHQ6MDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmctdG9wOjMwcHh9Ci5mb290e2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtjb2xvcjojNkY3RDg5O2ZvbnQtc2l6ZToyNXB4O2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZX0KLmN0YXtkaXNwbGF5OmJsb2NrO2NvbG9yOiM4NkI0RUE7Zm9udC13ZWlnaHQ6NjAwO2ZvbnQtc2l6ZTo0NHB4O2xldHRlci1zcGFjaW5nOi4wMWVtO2JvcmRlci10b3A6MnB4IHNvbGlkICMzNDQ3NUE7cGFkZGluZy10b3A6MzRweDttYXJnaW4tdG9wOjQ2cHg7bGluZS1oZWlnaHQ6MS4yfQouZ29sZHtjb2xvcjoke0dPTER9fQoua2t7Zm9udC1mYW1pbHk6J1BsZXggTW9ubycsbW9ub3NwYWNlO2ZvbnQtd2VpZ2h0OjUwMDtsZXR0ZXItc3BhY2luZzouMWVtO2NvbG9yOiR7R09MRH07Zm9udC1zaXplOjMwcHg7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlfQouYmlne2ZvbnQtZmFtaWx5OidQbGV4IFNlcmlmJyxzZXJpZjtmb250LXdlaWdodDo2MDA7bGluZS1oZWlnaHQ6MS4wODt0ZXh0LXdyYXA6YmFsYW5jZX0KLnJvd3twYWRkaW5nLWxlZnQ6MjhweDtib3JkZXItbGVmdDo2cHggc29saWQgIzg2QjRFQTttYXJnaW4tdG9wOjM0cHh9Ci5yb3cuZ3tib3JkZXItY29sb3I6JHtHT0xEfX0KLnJvdyBie2Rpc3BsYXk6YmxvY2s7Zm9udC1mYW1pbHk6J1BsZXggTW9ubycsbW9ub3NwYWNlO2ZvbnQtd2VpZ2h0OjUwMDtmb250LXNpemU6MjdweDtsZXR0ZXItc3BhY2luZzouMWVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtjb2xvcjojODZCNEVBO21hcmdpbi1ib3R0b206MTBweH0KLnJvdy5nIGJ7Y29sb3I6JHtHT0xEfX0KLnJvdyBzcGFue2Rpc3BsYXk6YmxvY2s7bGluZS1oZWlnaHQ6MS4zO2NvbG9yOiNEQ0U0RUE7Zm9udC1zaXplOjM4cHh9Ci5jYXJke21hcmdpbi10b3A6MjZweDtib3JkZXItcmFkaXVzOjI2cHg7YmFja2dyb3VuZDojMEExMDE2O2JvcmRlcjoycHggc29saWQgIzI3MzUzRjtwYWRkaW5nOjI2cHggMjZweCAxOHB4fQoudmFse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpiYXNlbGluZTtnYXA6MThweDttYXJnaW4tdG9wOjI2cHg7Zm9udC1mYW1pbHk6J1BsZXggU2VyaWYnLHNlcmlmO2ZvbnQtd2VpZ2h0OjYwMH0KLnZhbCBpe2ZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXdlaWdodDo1MDA7Zm9udC1zaXplOjM0cHg7Y29sb3I6Izg2QjRFQTtsZXR0ZXItc3BhY2luZzouMDRlbX0KLmNoaXBze2Rpc3BsYXk6ZmxleDtnYXA6MTZweDtmbGV4LXdyYXA6d3JhcDttYXJnaW4tdG9wOjE4cHh9Ci5jaGlwe2ZvbnQtZmFtaWx5OidQbGV4IE1vbm8nLG1vbm9zcGFjZTtmb250LXdlaWdodDo1MDA7Zm9udC1zaXplOjMwcHg7cGFkZGluZzoxMHB4IDIwcHg7Ym9yZGVyLXJhZGl1czo5OXB4O2JvcmRlcjoycHggc29saWQgIzM0NDc1QTtjb2xvcjojRTRFQUVGfQouY2hpcCBlbXtmb250LXN0eWxlOm5vcm1hbDtjb2xvcjojOEZBMEFFO21hcmdpbi1yaWdodDoxMHB4fQpgOwpjb25zdCBGSVQgPSAiPHNjcmlwdD5kb2N1bWVudC5mb250cy5yZWFkeS50aGVuKCgpPT57ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZml0XScpLmZvckVhY2goZT0+e2xldCBmcz1wYXJzZUludChlLmRhdGFzZXQuZml0KTtlLnN0eWxlLmZvbnRTaXplPWZzKydweCc7Y29uc3QgbGltPXBhcnNlSW50KGUuZGF0YXNldC5tYXh8fCc0MDAnKTt3aGlsZShlLnNjcm9sbEhlaWdodD5saW0mJmZzPjQwKXtmcy09MjtlLnN0eWxlLmZvbnRTaXplPWZzKydweCd9fSk7ZG9jdW1lbnQuYm9keS5kYXRhc2V0LnJlYWR5PTF9KTwvc2NyaXB0PiI7CgovLyAtLS0tLS0tLS0tIGdyYWZpY28gKFNWRykgLS0tLS0tLS0tLQpmdW5jdGlvbiBjaGFydFN2ZyhzZXJpZXMsIHVuaXRhKSB7CiAgY29uc3QgVyA9IDk2MCwgSCA9IDQwMCwgTCA9IDg2LCBSID0gMjgsIFQgPSAyNCwgQiA9IDU0OwogIGNvbnN0IHB0cyA9IHNlcmllcy5tYXAoKHApID0+ICh7IHQ6IERhdGUucGFyc2UocC5kYXRhICsgIlQxMjowMDowMFoiKSwgdjogTnVtYmVyKHAudmFsb3JlKSwgZDogcC5kYXRhIH0pKTsKICBjb25zdCB0MCA9IHB0c1swXS50LCB0MSA9IHB0c1twdHMubGVuZ3RoIC0gMV0udDsKICBsZXQgbG8gPSBNYXRoLm1pbiguLi5wdHMubWFwKChwKSA9PiBwLnYpKSwgaGkgPSBNYXRoLm1heCguLi5wdHMubWFwKChwKSA9PiBwLnYpKTsKICBjb25zdCBwYWQgPSAoaGkgLSBsbyB8fCBNYXRoLmFicyhoaSkgKiAwLjAyIHx8IDEpICogMC4xODsgbG8gLT0gcGFkOyBoaSArPSBwYWQ7CiAgY29uc3QgWCA9ICh0KSA9PiBMICsgKCh0IC0gdDApIC8gKHQxIC0gdDAgfHwgMSkpICogKFcgLSBMIC0gUik7CiAgY29uc3QgWSA9ICh2KSA9PiBUICsgKDEgLSAodiAtIGxvKSAvIChoaSAtIGxvKSkgKiAoSCAtIFQgLSBCKTsKICBsZXQgcyA9IGA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwICR7V30gJHtIfSIgc3R5bGU9IndpZHRoOjEwMCU7aGVpZ2h0OmF1dG87ZGlzcGxheTpibG9jayIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJBbmRhbWVudG8iPmA7CiAgY29uc3QgcmF3ID0gKGhpIC0gbG8pIC8gMywgbWFnID0gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2cxMChyYXcpKSksIHN0cCA9IFsxLCAyLCAyLjUsIDUsIDEwXS5tYXAoKG0pID0+IG0gKiBtYWcpLmZpbmQoKHgpID0+IHggPj0gcmF3KTsKICBjb25zdCBkZWMgPSBzdHAgPj0gMSA/IDAgOiBzdHAgPj0gMC4xID8gMSA6IDI7CiAgZm9yIChsZXQgdiA9IE1hdGguY2VpbChsbyAvIHN0cCkgKiBzdHA7IHYgPD0gaGk7IHYgKz0gc3RwKSB7CiAgICBjb25zdCB5ID0gWSh2KTsKICAgIHMgKz0gYDxsaW5lIHgxPSIke0x9IiB4Mj0iJHtXIC0gUn0iIHkxPSIke3l9IiB5Mj0iJHt5fSIgc3Ryb2tlPSIjMjIzMDNCIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIke0wgLSAxMn0iIHk9IiR7eSArIDl9IiB0ZXh0LWFuY2hvcj0iZW5kIiBmb250LWZhbWlseT0iUGxleCBNb25vIiBmb250LXNpemU9IjI0IiBmaWxsPSIjN0Y4RjlDIj4ke2ZtdCh2LCBkZWMpfTwvdGV4dD5gOwogIH0KICBjb25zdCBsaW5lID0gcHRzLm1hcCgocCwgaSkgPT4gYCR7aSA/ICJMIiA6ICJNIn0ke1gocC50KS50b0ZpeGVkKDEpfSAke1kocC52KS50b0ZpeGVkKDEpfWApLmpvaW4oIiAiKTsKICBzICs9IGA8cGF0aCBkPSIke2xpbmV9IEwke1godDEpLnRvRml4ZWQoMSl9ICR7SCAtIEJ9IEwke1godDApLnRvRml4ZWQoMSl9ICR7SCAtIEJ9IFoiIGZpbGw9InJnYmEoMjQyLDE4NCw3NSwuMTApIi8+YDsKICBzICs9IGA8cGF0aCBkPSIke2xpbmV9IiBmaWxsPSJub25lIiBzdHJva2U9IiR7R09MRH0iIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+YDsKICBwdHMuZm9yRWFjaCgocCkgPT4geyBzICs9IGA8Y2lyY2xlIGN4PSIke1gocC50KS50b0ZpeGVkKDEpfSIgY3k9IiR7WShwLnYpLnRvRml4ZWQoMSl9IiByPSI1IiBmaWxsPSIjMEExMDE2IiBzdHJva2U9IiR7R09MRH0iIHN0cm9rZS13aWR0aD0iMyIvPmA7IH0pOwogIGNvbnN0IGEgPSBwdHNbcHRzLmxlbmd0aCAtIDFdOwogIHMgKz0gYDxjaXJjbGUgY3g9IiR7WChhLnQpLnRvRml4ZWQoMSl9IiBjeT0iJHtZKGEudikudG9GaXhlZCgxKX0iIHI9IjExIiBmaWxsPSIke0dPTER9Ii8+YDsKICBzICs9IGA8dGV4dCB4PSIke0x9IiB5PSIke0ggLSAxNH0iIGZvbnQtZmFtaWx5PSJQbGV4IE1vbm8iIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM4RkEwQUUiPiR7ZGF0YUJyZXYocHRzWzBdLmQpfTwvdGV4dD48dGV4dCB4PSIke1cgLSBSfSIgeT0iJHtIIC0gMTR9IiB0ZXh0LWFuY2hvcj0iZW5kIiBmb250LWZhbWlseT0iUGxleCBNb25vIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOEZBMEFFIj4ke2RhdGFCcmV2KGEuZCl9PC90ZXh0PmA7CiAgcmV0dXJuIHMgKyAiPC9zdmc+IjsKfQoKLy8gLS0tLS0tLS0tLSBwYWdpbmUgLS0tLS0tLS0tLQpjb25zdCBXID0gMTA4MCwgSCA9IDEzNTAsIFBBRCA9IFs2NiwgNTYsIDY0XTsKZnVuY3Rpb24gcGFnZShzcGVjLCBib2R5LCBuLCB0b3QpIHsKICBjb25zdCBbdCwgYnQsIHNkXSA9IFBBRDsKICBjb25zdCB0b3AgPSBgPGRpdiBjbGFzcz0idG9wIj48c3BhbiBjbGFzcz0iYnJhbmQiPlJlYWQgR2VvcG9saXRpY3M8L3NwYW4+PHNwYW4gY2xhc3M9ImxhYiI+JHtkYXRhTGJsKHNwZWMuZGF0ZSl9PC9zcGFuPjwvZGl2PmA7CiAgY29uc3QgZm9vdCA9IGA8ZGl2IGNsYXNzPSJmb290Ij48c3Bhbj4ke24gPCB0b3QgPyAic2NvcnJpIOKGkiIgOiAiIn08L3NwYW4+PHNwYW4+JHtufS8ke3RvdH08L3NwYW4+PC9kaXY+YDsKICByZXR1cm4gYDwhZG9jdHlwZSBodG1sPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48c3R5bGU+JHtDU1N9PC9zdHlsZT48Ym9keT48ZGl2IGNsYXNzPSJzIiBzdHlsZT0id2lkdGg6JHtXfXB4O2hlaWdodDoke0h9cHg7cGFkZGluZzoke3R9cHggJHtzZH1weCAke2J0fXB4ICR7c2QgKyAxMH1weCI+JHt0b3B9PGRpdiBjbGFzcz0ibWlkIj4ke2JvZHl9PC9kaXY+JHtmb290fTwvZGl2PiR7RklUfWA7Cn0KY29uc3QgY2hpcHMgPSAocykgPT4gewogIGNvbnN0IHUgPSBzLnZhcl91bml0YSB8fCAiIjsKICBjb25zdCBjID0gW107CiAgaWYgKHR5cGVvZiBzLnZhciA9PT0gIm51bWJlciIpIGMucHVzaChbImdpb3JubyIsIHMudmFyXSk7CiAgaWYgKHR5cGVvZiBzLnZhcl8xbSA9PT0gIm51bWJlciIpIGMucHVzaChbIjEgbWVzZSIsIHMudmFyXzFtXSk7CiAgaWYgKHR5cGVvZiBzLnZhcl8xYSA9PT0gIm51bWJlciIpIGMucHVzaChbIjEgYW5ubyIsIHMudmFyXzFhXSk7CiAgcmV0dXJuIGMubWFwKChbbCwgdl0pID0+IGA8c3BhbiBjbGFzcz0iY2hpcCI+PGVtPiR7bH08L2VtPiR7c2duKHYsIDIpLnJlcGxhY2UoLywwMCQvLCAiIikucmVwbGFjZSgvKCxcZCkwJC8sICIkMSIpfSAke2VzYyh1KX08L3NwYW4+YCkuam9pbigiIik7Cn07CmZ1bmN0aW9uIHNsaWRlMShzcGVjLCBuLCB0b3QpIHsKICBjb25zdCBib2R5ID0gYDxkaXYgY2xhc3M9ImtrIj5JbCBudW1lcm8gwrcgJHtlc2Moc3BlYy5ub21lKX08L2Rpdj4KPGRpdiBjbGFzcz0iYmlnIiBkYXRhLWZpdD0iODAiIGRhdGEtbWF4PSIyMzAiIHN0eWxlPSJtYXJnaW4tdG9wOjIwcHgiPiR7ZXNjKHNwZWMuaGVhZGxpbmUpfTwvZGl2Pgo8ZGl2IGNsYXNzPSJjYXJkIj4ke2NoYXJ0U3ZnKHNwZWMuc2VyaWVzLCBzcGVjLnVuaXRhKX08L2Rpdj4KPGRpdiBjbGFzcz0idmFsIj48c3BhbiBjbGFzcz0iZ29sZCIgc3R5bGU9ImZvbnQtc2l6ZToxMTJweDtsaW5lLWhlaWdodDoxIj4ke2ZtdChzcGVjLnZhbG9yZSl9PC9zcGFuPjxpPiR7ZXNjKHNwZWMudW5pdGEpfTwvaT48L2Rpdj4KPGRpdiBjbGFzcz0iY2hpcHMiPiR7Y2hpcHMoc3BlYyl9PC9kaXY+YDsKICByZXR1cm4gcGFnZShzcGVjLCBib2R5LCBuLCB0b3QpOwp9CmZ1bmN0aW9uIHNsaWRlMihzcGVjLCBuLCB0b3QpIHsKICBjb25zdCBpbmZvID0gSU5EW3NwZWMuaWRdIHx8IHt9OwogIGNvbnN0IGJvZHkgPSBgPGRpdiBjbGFzcz0ia2siPlBlcmNow6kgc2kgbXVvdmU8L2Rpdj4KPGRpdiBjbGFzcz0icm93IGciPjxiPlNlY29uZG8gJHtlc2Moc3BlYy5mb250ZS5ub21lKX08L2I+PHNwYW4+JHtlc2Moc3BlYy53aHkpfTwvc3Bhbj48L2Rpdj4KJHtpbmZvLmNvc2EgPyBgPGRpdiBjbGFzcz0icm93Ij48Yj5Db3NhIG1pc3VyYTwvYj48c3Bhbj4ke2VzYyhpbmZvLmNvc2EpfTwvc3Bhbj48L2Rpdj5gIDogIiJ9CiR7aW5mby5jb250YSA/IGA8ZGl2IGNsYXNzPSJyb3ciPjxiPlBlcmNow6kgY29udGE8L2I+PHNwYW4+JHtlc2MoaW5mby5jb250YSl9PC9zcGFuPjwvZGl2PmAgOiAiIn1gOwogIHJldHVybiBwYWdlKHNwZWMsIGJvZHksIG4sIHRvdCk7Cn0KZnVuY3Rpb24gc2xpZGUzKHNwZWMsIG4sIHRvdCkgewogIGNvbnN0IHJlYyA9IHNwZWMucmVjb3JkICYmIHNwZWMucmVjb3JkLnZhbG9yZSA/IGA8ZGl2IGNsYXNzPSJyb3ciPjxiPlBlciBjb25mcm9udG88L2I+PHNwYW4+JHtlc2Moc3BlYy5yZWNvcmQubm90YSB8fCAibWFzc2ltbyBzdG9yaWNvIil9OiAke2ZtdChzcGVjLnJlY29yZC52YWxvcmUpfSAke2VzYyhzcGVjLnVuaXRhKX0gKCR7ZXNjKHNwZWMucmVjb3JkLmRhdGEpfSkuPC9zcGFuPjwvZGl2PmAgOiAiIjsKICBjb25zdCBib2R5ID0gYDxkaXYgY2xhc3M9ImtrIj5Db21lIGxlZ2dlcmxvPC9kaXY+CjxkaXYgY2xhc3M9InJvdyBnIj48Yj5JbCBsaW1pdGU8L2I+PHNwYW4+JHtlc2Moc3BlYy5saW1pdHMpfTwvc3Bhbj48L2Rpdj4KPGRpdiBjbGFzcz0icm93Ij48Yj5JbCBkYXRvPC9iPjxzcGFuPiR7ZXNjKHNwZWMuZm9udGUubm9tZSl9LCByaWxldmF6aW9uZSBkZWwgJHtlc2MoZGF0YVByb3NhKHNwZWMuZGF0YV92YWxvcmUpKX0uIElsIGdyYWZpY28gdW5pc2NlIGxlIGNoaXVzdXJlIHNhbHZhdGUgZGFsICR7ZXNjKGRhdGFQcm9zYShzcGVjLnNlcmllc1swXS5kYXRhKSl9Ljwvc3Bhbj48L2Rpdj4KJHtyZWN9CjxzcGFuIGNsYXNzPSJjdGEiPkdyYWZpY28gZSB0ZW1hIGNvbGxlZ2F0byBuZWwgUmFkYXIgZGVsIHNpdG8uIExpbmsgaW4gYmlvLjwvc3Bhbj5gOwogIHJldHVybiBwYWdlKHNwZWMsIGJvZHksIG4sIHRvdCk7Cn0KCi8vIC0tLS0tLS0tLS0gY29udHJvbGxvIC0tLS0tLS0tLS0KY29uc3Qgbm9ybSA9IChzKSA9PiB7IHMgPSBTdHJpbmcocykucmVwbGFjZSgv4oiSL2csICItIik7IGlmICgvXlxkezEsM30oXC5cZHszfSkrJC8udGVzdChzKSkgcyA9IHMucmVwbGFjZSgvXC4vZywgIiIpOyByZXR1cm4gcGFyc2VGbG9hdChzLnJlcGxhY2UoIiwiLCAiLiIpKTsgfTsKY29uc3QgbnVtc0luID0gKHQpID0+IChTdHJpbmcodCkucmVwbGFjZShuZXcgUmVnRXhwKGBcXGJcXGR7MSwyfVxccysoJHtNRVNJX0VTVEVTSX0pKFxccytcXGR7NH0pP2AsICJnaSIpLCAiICIpLm1hdGNoKC9cZFtcZC4sXSpcZHxcZC9nKSB8fCBbXSkubWFwKG5vcm0pLmZpbHRlcigoeCkgPT4gIWlzTmFOKHgpKTsKZnVuY3Rpb24gY2hlY2soc3BlYykgewogIGNvbnN0IGVyciA9IFtdOwogIGNvbnN0IG5lZWQgPSBbImlkIiwgIm5vbWUiLCAidW5pdGEiLCAidmFsb3JlIiwgImRhdGFfdmFsb3JlIiwgImhlYWRsaW5lIiwgIndoeSIsICJsaW1pdHMiLCAic291cmNlX3RleHQiLCAiY2FwdGlvbiJdOwogIGZvciAoY29uc3QgayBvZiBuZWVkKSBpZiAoc3BlY1trXSA9PT0gdW5kZWZpbmVkIHx8IHNwZWNba10gPT09IG51bGwgfHwgc3BlY1trXSA9PT0gIiIpIGVyci5wdXNoKGAke2t9OiBtYW5jYW50ZWApOwogIGlmICghL15cZHs0fS1cZHsyfS1cZHsyfSQvLnRlc3Qoc3BlYy5kYXRlIHx8ICIiKSkgZXJyLnB1c2goImRhdGU6IGZvcm1hdG8gWVlZWS1NTS1ERCIpOwogIGlmICghL15cZHs0fS1cZHsyfS1cZHsyfSQvLnRlc3Qoc3BlYy5kYXRhX3ZhbG9yZSB8fCAiIikpIGVyci5wdXNoKCJkYXRhX3ZhbG9yZTogZm9ybWF0byBZWVlZLU1NLUREIik7CiAgaWYgKCFzcGVjLmZvbnRlIHx8ICFzcGVjLmZvbnRlLm5vbWUgfHwgIS9eaHR0cHM6XC9cLy8udGVzdChzcGVjLmZvbnRlLnVybCB8fCAiIikpIGVyci5wdXNoKCJmb250ZTogc2Vydm9ubyBub21lIGUgdXJsIGh0dHBzIik7CiAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKExJTSkpIGlmIChzcGVjW2tdICYmIFN0cmluZyhzcGVjW2tdKS5sZW5ndGggPiBMSU1ba10pIGVyci5wdXNoKGAke2t9OiAke1N0cmluZyhzcGVjW2tdKS5sZW5ndGh9IGNhcmF0dGVyaSwgbWFzc2ltbyAke0xJTVtrXX1gKTsKICBpZiAodHlwZW9mIHNwZWMudmFsb3JlICE9PSAibnVtYmVyIikgZXJyLnB1c2goInZhbG9yZTogZGV2ZSBlc3NlcmUgdW4gbnVtZXJvIik7CiAgaWYgKCFBcnJheS5pc0FycmF5KHNwZWMuc2VyaWVzKSB8fCBzcGVjLnNlcmllcy5sZW5ndGggPCA1KSBlcnIucHVzaCgic2VyaWVzOiBzZXJ2b25vIGFsbWVubyA1IHJpbGV2YXppb25pIik7CiAgZWxzZSB7CiAgICBsZXQgcHJldiA9ICIiOwogICAgc3BlYy5zZXJpZXMuZm9yRWFjaCgocCwgaSkgPT4geyBpZiAoIS9eXGR7NH0tXGR7Mn0tXGR7Mn0kLy50ZXN0KHAuZGF0YSB8fCAiIikgfHwgdHlwZW9mIHAudmFsb3JlICE9PSAibnVtYmVyIikgZXJyLnB1c2goYHNlcmllc1ske2l9XTogZGF0YSBvIHZhbG9yZSBub24gdmFsaWRpYCk7IGVsc2UgeyBpZiAocC5kYXRhIDwgcHJldikgZXJyLnB1c2goYHNlcmllc1ske2l9XTogZGF0ZSBub24gaW4gb3JkaW5lYCk7IHByZXYgPSBwLmRhdGE7IH0gfSk7CiAgICBpZiAoc3BlYy5zZXJpZXNbc3BlYy5zZXJpZXMubGVuZ3RoIC0gMV0uZGF0YSAhPT0gc3BlYy5kYXRhX3ZhbG9yZSkgZXJyLnB1c2goYHNlcmllczogbCd1bHRpbWEgcmlsZXZhemlvbmUgKCR7c3BlYy5zZXJpZXNbc3BlYy5zZXJpZXMubGVuZ3RoIC0gMV0uZGF0YX0pIGRldmUgYXZlcmUgbGEgZGF0YSBkZWwgdmFsb3JlICgke3NwZWMuZGF0YV92YWxvcmV9KTsgdG9nbGkgbGUgcmlsZXZhemlvbmkgc3VjY2Vzc2l2ZWApOwogICAgY29uc3QgbGFzdCA9IHNwZWMuc2VyaWVzW3NwZWMuc2VyaWVzLmxlbmd0aCAtIDFdLnZhbG9yZTsKICAgIGlmICh0eXBlb2Ygc3BlYy52YWxvcmUgPT09ICJudW1iZXIiICYmIE1hdGguYWJzKGxhc3QgLSBzcGVjLnZhbG9yZSkgLyBNYXRoLmFicyhzcGVjLnZhbG9yZSB8fCAxKSA+IDAuMTUpIGVyci5wdXNoKGBzZXJpZXM6IGwndWx0aW1vIHB1bnRvICgke2xhc3R9KSBzaSBkaXNjb3N0YSBwacO5IGRlbCAxNSUgZGFsIHZhbG9yZSAoJHtzcGVjLnZhbG9yZX0pYCk7CiAgfQogIGlmIChzcGVjLmlkICYmICFJTkRbc3BlYy5pZF0pIGVyci5wdXNoKGBpZDogaW5kaWNhdG9yZSBzY29ub3NjaXV0byAoJHtzcGVjLmlkfSk7IGFtbWVzc2k6ICR7T2JqZWN0LmtleXMoSU5EKS5qb2luKCIsICIpfWApOwogIC8vIG9nbmkgbnVtZXJvIHNjcml0dG8gaW4gaGVhZGxpbmUgLyB3aHkgLyBsaW1pdHMgZGV2ZSB2ZW5pcmUgZGFpIGRhdGkgbyBkYWwgdGVzdG8gZGVsbGEgZm9udGUKICBjb25zdCBhbGxvd2VkID0gbmV3IFNldCgpOwogIGNvbnN0IGFkZCA9ICh4KSA9PiB7IGlmICh0eXBlb2YgeCA9PT0gIm51bWJlciIgJiYgaXNGaW5pdGUoeCkpIHsgZm9yIChjb25zdCB2IG9mIFt4LCBNYXRoLmFicyh4KSwgTWF0aC5yb3VuZCh4KSwgTWF0aC5yb3VuZChNYXRoLmFicyh4KSksICt4LnRvRml4ZWQoMSksICtNYXRoLmFicyh4KS50b0ZpeGVkKDEpLCAreC50b0ZpeGVkKDIpXSkgYWxsb3dlZC5hZGQodik7IH0gfTsKICBbc3BlYy52YWxvcmUsIHNwZWMudmFyLCBzcGVjLnZhcl8xbSwgc3BlYy52YXJfMWEsIHNwZWMucmVjb3JkICYmIHNwZWMucmVjb3JkLnZhbG9yZV0uZm9yRWFjaChhZGQpOwogIG51bXNJbihzcGVjLnNvdXJjZV90ZXh0IHx8ICIiKS5mb3JFYWNoKGFkZCk7CiAgKHNwZWMuc2VyaWVzIHx8IFtdKS5mb3JFYWNoKChwKSA9PiB7IGFkZChwLnZhbG9yZSk7IH0pOwogIGZvciAoY29uc3QgayBvZiBbImhlYWRsaW5lIiwgIndoeSIsICJsaW1pdHMiXSkgZm9yIChjb25zdCBuIG9mIG51bXNJbihzcGVjW2tdIHx8ICIiKSkgaWYgKCFhbGxvd2VkLmhhcyhuKSkgZXJyLnB1c2goYCR7a306IGlsIG51bWVybyAke259IG5vbiBjb21wYXJlIG5laSBkYXRpIG7DqSBuZWwgdGVzdG8gZGVsbGEgZm9udGVgKTsKICBpZiAoIXNwZWMuY2FwdGlvbiB8fCBzcGVjLmNhcHRpb24ubGVuZ3RoIDwgNDApIGVyci5wdXNoKCJjYXB0aW9uOiBtYW5jYW50ZSBvIHRyb3BwbyBjb3J0YSIpOwogIGlmIChzcGVjLmNhcHRpb24gJiYgc3BlYy5jYXB0aW9uLmxlbmd0aCA+IDEyMDApIGVyci5wdXNoKCJjYXB0aW9uOiBtYXNzaW1vIDEyMDAgY2FyYXR0ZXJpIik7CiAgcmV0dXJuIGVycjsKfQoKLy8gLS0tLS0tLS0tLSByZW5kZXIgLS0tLS0tLS0tLQphc3luYyBmdW5jdGlvbiBsb2FkQ2hyb21pdW0oKSB7CiAgZm9yIChjb25zdCBwIG9mIFsicGxheXdyaWdodCIsICIvaG9tZS9jbGF1ZGUvLm5wbS1nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIsICIvb3B0L25wbS10b29scy9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiXSkgewogICAgdHJ5IHsgcmV0dXJuIChhd2FpdCBpbXBvcnQocCkpLmNocm9taXVtOyB9IGNhdGNoIChlKSB7fQogIH0KICB0aHJvdyBuZXcgRXJyb3IoIlBsYXl3cmlnaHQgbm9uIHRyb3ZhdG8iKTsKfQphc3luYyBmdW5jdGlvbiByZW5kZXJBbGwoaHRtbHMsIG91dERpcikgewogIGZzLm1rZGlyU3luYyhwYXRoLmpvaW4ob3V0RGlyLCAianBnIiksIHsgcmVjdXJzaXZlOiB0cnVlIH0pOwogIGZzLm1rZGlyU3luYyhwYXRoLmpvaW4ob3V0RGlyLCAiaHRtbCIpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKICBjb25zdCBjaHJvbWl1bSA9IGF3YWl0IGxvYWRDaHJvbWl1bSgpOwogIGNvbnN0IGJyID0gYXdhaXQgY2hyb21pdW0ubGF1bmNoKHsgZXhlY3V0YWJsZVBhdGg6IHByb2Nlc3MuZW52LkNIUk9NSVVNIHx8IChmcy5leGlzdHNTeW5jKCIvb3B0L3B3LWJyb3dzZXJzL2Nocm9taXVtIikgPyAiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIgOiB1bmRlZmluZWQpLCBhcmdzOiBbIi0tbm8tc2FuZGJveCJdIH0pOwogIGNvbnN0IHByb2JsZW1zID0gW107CiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodG1scy5sZW5ndGg7IGkrKykgewogICAgY29uc3QgbmFtZSA9IFN0cmluZyhpICsgMSkucGFkU3RhcnQoMiwgIjAiKTsKICAgIGNvbnN0IGhwID0gcGF0aC5yZXNvbHZlKG91dERpciwgImh0bWwiLCBuYW1lICsgIi5odG1sIik7CiAgICBmcy53cml0ZUZpbGVTeW5jKGhwLCBodG1sc1tpXSk7CiAgICBjb25zdCBwZyA9IGF3YWl0IGJyLm5ld1BhZ2UoeyB2aWV3cG9ydDogeyB3aWR0aDogVywgaGVpZ2h0OiBIIH0gfSk7CiAgICBhd2FpdCBwZy5nb3RvKCJmaWxlOi8vIiArIGhwKTsKICAgIGF3YWl0IHBnLndhaXRGb3JTZWxlY3RvcigiYm9keVtkYXRhLXJlYWR5XSIpOwogICAgY29uc3Qgb3ZlciA9IGF3YWl0IHBnLmV2YWx1YXRlKCgpID0+IHsgY29uc3QgbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5taWQiKTsgcmV0dXJuIG0uc2Nyb2xsSGVpZ2h0IC0gbS5jbGllbnRIZWlnaHQ7IH0pOwogICAgaWYgKG92ZXIgPiA0KSBwcm9ibGVtcy5wdXNoKGBjYXJ0YSAke25hbWV9OiBpbCB0ZXN0byBzZm9yYSBkaSAke292ZXJ9cHgsIGFjY29yY2lhIGkgdGVzdGlgKTsKICAgIGF3YWl0IHBnLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4ob3V0RGlyLCAianBnIiwgbmFtZSArICIuanBnIiksIHR5cGU6ICJqcGVnIiwgcXVhbGl0eTogOTIgfSk7CiAgICBhd2FpdCBwZy5jbG9zZSgpOwogIH0KICBhd2FpdCBici5jbG9zZSgpOwogIHJldHVybiBwcm9ibGVtczsKfQoKY29uc3QgW2NtZCwgc3BlY1BhdGgsIG91dERpcl0gPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7CmlmIChjbWQgPT09ICJpbmZvIikgeyBjb25zdCBpID0gSU5EW3NwZWNQYXRoXTsgaWYgKCFpKSB7IGNvbnNvbGUubG9nKCJpbmRpY2F0b3JlIHNjb25vc2NpdXRvOyBhbW1lc3NpOiAiICsgT2JqZWN0LmtleXMoSU5EKS5qb2luKCIsICIpKTsgcHJvY2Vzcy5leGl0KDEpOyB9IGNvbnNvbGUubG9nKCJDT1NBIE1JU1VSQTogIiArIGkuY29zYSArICJcblBFUkNIw4kgQ09OVEE6ICIgKyBpLmNvbnRhKTsgcHJvY2Vzcy5leGl0KDApOyB9CmlmICghY21kIHx8ICFzcGVjUGF0aCkgeyBjb25zb2xlLmxvZygidXNvOiBub2RlIG51bWVyby5tanMgY2hlY2t8cmVuZGVyIFNQRUMuanNvbiBbT1VUX0RJUl0gIHwgIG5vZGUgbnVtZXJvLm1qcyBpbmZvIElEIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3BlY1BhdGgsICJ1dGY4IikpOwpjb25zdCBlcnJzID0gY2hlY2soc3BlYyk7CmlmIChlcnJzLmxlbmd0aCkgeyBjb25zb2xlLmxvZygiRVJST1JJIE5FTExBIFNQRUNJRklDQTpcbi0gIiArIGVycnMuam9pbigiXG4tICIpKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmlmIChjbWQgPT09ICJjaGVjayIpIHsgY29uc29sZS5sb2coInNwZWNpZmljYSBvayIpOyBwcm9jZXNzLmV4aXQoMCk7IH0KaWYgKGNtZCA9PT0gInJlbmRlciIpIHsKICBjb25zdCBodG1scyA9IFtzbGlkZTEoc3BlYywgMSwgMyksIHNsaWRlMihzcGVjLCAyLCAzKSwgc2xpZGUzKHNwZWMsIDMsIDMpXTsKICBjb25zdCBwcm9ibGVtcyA9IGF3YWl0IHJlbmRlckFsbChodG1scywgb3V0RGlyKTsKICBpZiAocHJvYmxlbXMubGVuZ3RoKSB7IGNvbnNvbGUubG9nKCJQUk9CTEVNSSBESSBMQVlPVVQ6XG4tICIgKyBwcm9ibGVtcy5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0KICBjb25zb2xlLmxvZyhgb2s6IDMgaW1tYWdpbmkgaW4gJHtvdXREaXJ9L2pwZ2ApOwp9Cg==",
  "reel.mjs": "Ly8gcmVlbC5tanMg4oCUIFJlZWwgdmVydGljYWxlIDEwODB4MTkyMCBkYSB1bmEgc3BlY2lmaWNhIEpTT04gKHRlc3RpLCBjaGlwLCBmb250aSkgKyBtdXNpY2Egb3JpZ2luYWxlLgovLyB1c286IG5vZGUgcmVlbC5tanMgU1BFQy5qc29uIE9VVC5tcDQgWy0tcHJldmlldyB0MSx0MiwuLi5dCmltcG9ydCBmcyBmcm9tICJub2RlOmZzIjsKaW1wb3J0IHBhdGggZnJvbSAibm9kZTpwYXRoIjsKaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAibm9kZTpjaGlsZF9wcm9jZXNzIjsKaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gIm5vZGU6bW9kdWxlIjsKY29uc3QgSE9NRSA9IHByb2Nlc3MuZW52LkhPTUUgfHwgIi9yb290IjsKY29uc3QgZmlyc3REaXIgPSAoYywgdGVzdCkgPT4gYy5maWx0ZXIoQm9vbGVhbikuZmluZCgoZCkgPT4geyB0cnkgeyByZXR1cm4gdGVzdChkKTsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfSB9KTsKY29uc3QgRk9OVFMwID0gZmlyc3REaXIoW3Byb2Nlc3MuZW52LlJHX0ZPTlRTLCBIT01FICsgIi9pZ2tpdC9mb250cyIsICIvaG9tZS9jbGF1ZGUvaWdraXQvZm9udHMiLCAiL3RtcC9yay9mb250cyJdLCAoZCkgPT4gZnMuZXhpc3RzU3luYyhkICsgIi9pYm0tcGxleC1zYW5zLWxhdGluLTQwMC1ub3JtYWwud29mZjIiKSk7CmxldCBGT05UUyA9IEZPTlRTMDsKaWYgKCFGT05UUykgeyAvLyBpbnN0YWxsYSBpIGZvbnQgZGEgbnBtICh1bmEgdm9sdGEgcGVyIHNlc3Npb25lKSBlIGxpIGNvcGlhIGluIC90bXAvcmsvZm9udHMKICBjb25zdCBmZCA9ICIvdG1wL3JrL2ZvbnRzIjsgZnMubWtkaXJTeW5jKGZkLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKICBjb25zdCBpbnMgPSBzcGF3blN5bmMoIm5wbSIsIFsiaSIsICItLW5vLWF1ZGl0IiwgIi0tbm8tZnVuZCIsICItLXByZWZpeCIsICIvdG1wL3JrL25wbWYiLCAiQGZvbnRzb3VyY2UvaWJtLXBsZXgtc2VyaWYiLCAiQGZvbnRzb3VyY2UvaWJtLXBsZXgtc2FucyIsICJAZm9udHNvdXJjZS9pYm0tcGxleC1tb25vIl0sIHsgc3RkaW86ICJpbmhlcml0IiB9KTsKICBmb3IgKGNvbnN0IFtwaywgd10gb2YgW1sic2VyaWYiLCA2MDBdLCBbInNhbnMiLCA0MDBdLCBbInNhbnMiLCA2MDBdLCBbIm1vbm8iLCA1MDBdXSkgeyBjb25zdCBuID0gYGlibS1wbGV4LSR7cGt9LWxhdGluLSR7d30tbm9ybWFsLndvZmYyYDsgdHJ5IHsgZnMuY29weUZpbGVTeW5jKGAvdG1wL3JrL25wbWYvbm9kZV9tb2R1bGVzL0Bmb250c291cmNlL2libS1wbGV4LSR7cGt9L2ZpbGVzLyR7bn1gLCBgJHtmZH0vJHtufWApOyB9IGNhdGNoIHt9IH0KICBpZiAoZnMuZXhpc3RzU3luYyhmZCArICIvaWJtLXBsZXgtc2Fucy1sYXRpbi00MDAtbm9ybWFsLndvZmYyIikpIEZPTlRTID0gZmQ7IGVsc2UgeyBjb25zb2xlLmVycm9yKCJGb250IElCTSBQbGV4IG5vbiBkaXNwb25pYmlsaSAobnBtIGV4aXQgIiArIGlucy5zdGF0dXMgKyAiKSIpOyBwcm9jZXNzLmV4aXQoMik7IH0KfQpjb25zdCBNVVNJQyA9IHByb2Nlc3MuZW52LlJHX01VU0lDIHx8ICIvaG9tZS9jbGF1ZGUvcmVlbC9tdXNpY2Ffb3JpZ2luYWxlXzQ1cy53YXYiOwpjb25zdCBGUFMgPSAzMCwgVyA9IDEwODAsIEggPSAxOTIwOwpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocHJvY2Vzcy5hcmd2WzJdLCAidXRmOCIpKTsKY29uc3QgT1VUID0gcHJvY2Vzcy5hcmd2WzNdOwpjb25zdCBwdiA9IHByb2Nlc3MuYXJndi5pbmRleE9mKCItLXByZXZpZXciKTsKY29uc3QgUFJFVklFVyA9IHB2ID4gMCA/IHByb2Nlc3MuYXJndltwdiArIDFdLnNwbGl0KCIsIikubWFwKE51bWJlcikgOiBudWxsOwpjb25zdCBlc2MgPSAodCkgPT4gU3RyaW5nKHQgPz8gIiIpLnJlcGxhY2UoL1smPD4iXS9nLCAoYykgPT4gKHsgIiYiOiAiJmFtcDsiLCAiPCI6ICImbHQ7IiwgIj4iOiAiJmd0OyIsICciJzogIiZxdW90OyIgfVtjXSkpOwpjb25zdCByaWNoID0gKHQpID0+IGVzYyh0KS5yZXBsYWNlKC8oXGQrwrApIC9nLCAiJDFcdTAwYTAiKS5yZXBsYWNlKC9cKiguKz8pXCovZywgJzxiIGNsYXNzPSJnIj4kMTwvYj4nKTsKY29uc3QgZmYgPSAocGtnLCB3LCBmYW0pID0+IGBAZm9udC1mYWNle2ZvbnQtZmFtaWx5Oicke2ZhbX0nO2ZvbnQtd2VpZ2h0OiR7d307c3JjOnVybChkYXRhOmZvbnQvd29mZjI7YmFzZTY0LCR7ZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihGT05UUywgYCR7cGtnfS1sYXRpbi0ke3d9LW5vcm1hbC53b2ZmMmApKS50b1N0cmluZygiYmFzZTY0Iil9KSBmb3JtYXQoJ3dvZmYyJyl9YDsKY29uc3QgQ1NTID0gW2ZmKCJpYm0tcGxleC1zZXJpZiIsIDYwMCwgIlBsZXggU2VyaWYiKSwgZmYoImlibS1wbGV4LXNhbnMiLCA0MDAsICJQbGV4IFNhbnMiKSwgZmYoImlibS1wbGV4LXNhbnMiLCA2MDAsICJQbGV4IFNhbnMiKSwgZmYoImlibS1wbGV4LW1vbm8iLCA1MDAsICJQbGV4IE1vbm8iKV0uam9pbigiIikgKyBgCip7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowO3BhZGRpbmc6MH0KaHRtbCxib2R5e3dpZHRoOiR7V31weDtoZWlnaHQ6JHtIfXB4O292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOiMwYjExMTh9CmJvZHl7cG9zaXRpb246cmVsYXRpdmU7Zm9udC1mYW1pbHk6J1BsZXggU2Fucycsc2Fucy1zZXJpZjtjb2xvcjojRUVGMkY2fQojYmd7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCg5MDBweCA1NjBweCBhdCA4NSUgOCUscmdiYSg0Niw5MiwxNTAsLjU1KSxyZ2JhKDQ2LDkyLDE1MCwwKSA3MCUpLHJhZGlhbC1ncmFkaWVudCg3MDBweCA0MjBweCBhdCA2JSAwJSxyZ2JhKDMwLDU4LDk2LC40MCkscmdiYSgzMCw1OCw5NiwwKSA3MCUpLGxpbmVhci1ncmFkaWVudCgxODBkZWcsIzEwMWMyYSAwJSwjMGIxMTE4IDM2JSwjMGIxMTE4IDEwMCUpfQojYnJhbmR7cG9zaXRpb246YWJzb2x1dGU7dG9wOjIzMHB4O2xlZnQ6MDt3aWR0aDoke1d9cHg7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udDo2MDAgNTRweC8xICdQbGV4IFNlcmlmJyxzZXJpZjtsZXR0ZXItc3BhY2luZzouMDFlbX0KI3RhZ3twb3NpdGlvbjphYnNvbHV0ZTt0b3A6MzA2cHg7bGVmdDowO3dpZHRoOiR7V31weDt0ZXh0LWFsaWduOmNlbnRlcjtmb250OjUwMCAyNHB4LzEgJ1BsZXggTW9ubycsbW9ub3NwYWNlO2NvbG9yOiM4NkI0RUE7bGV0dGVyLXNwYWNpbmc6LjE0ZW19Ci5zY3twb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjkwcHg7d2lkdGg6OTAwcHg7dG9wOjQzMHB4O2hlaWdodDoxMDAwcHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfQoua3tmb250OjUwMCAzMnB4LzEgJ1BsZXggTW9ubycsbW9ub3NwYWNlO2NvbG9yOiNFOEIwNTA7bGV0dGVyLXNwYWNpbmc6LjEyZW19Ci5jaGlwe2Rpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbi10b3A6MjZweDtmb250OjUwMCAyNnB4LzEgJ1BsZXggTW9ubycsbW9ub3NwYWNlO2xldHRlci1zcGFjaW5nOi4wOGVtO3BhZGRpbmc6MTJweCAyMHB4O2JvcmRlci1yYWRpdXM6OTlweDtib3JkZXI6MnB4IHNvbGlkO3dpZHRoOm1heC1jb250ZW50fQouY2hpcC5va3tjb2xvcjojNkZDQjlGO2JvcmRlci1jb2xvcjojMkY1RjRCO2JhY2tncm91bmQ6cmdiYSgxMTEsMjAzLDE1OSwuMDgpfQouY2hpcC50cHtjb2xvcjojRThCMDUwO2JvcmRlci1jb2xvcjojNkI1NTI4O2JhY2tncm91bmQ6cmdiYSgyMzIsMTc2LDgwLC4wOCl9Ci5oe21hcmdpbi10b3A6MzRweDtmb250OjYwMCA3NnB4LzEuMTIgJ1BsZXggU2VyaWYnLHNlcmlmO2NvbG9yOiNFRUYyRjY7dGV4dC13cmFwOmJhbGFuY2V9Ci5oLmJpZ3tmb250LXNpemU6ODhweH0KLmd7Y29sb3I6I0U4QjA1MDtmb250LXdlaWdodDo2MDB9Ci5ie21hcmdpbi10b3A6MzZweDtmb250OjQwMCA0MnB4LzEuMzUgJ1BsZXggU2Fucycsc2Fucy1zZXJpZjtjb2xvcjojQjdDM0NFfQouc3ttYXJnaW4tdG9wOjM0cHg7Zm9udDo1MDAgMjhweC8xLjMgJ1BsZXggTW9ubycsbW9ub3NwYWNlO2NvbG9yOiM4NkI0RUE7bGV0dGVyLXNwYWNpbmc6LjAzZW19Ci5jdGF7bWFyZ2luLXRvcDo1MHB4O2ZvbnQ6NTAwIDQwcHgvMSAnUGxleCBNb25vJyxtb25vc3BhY2U7Y29sb3I6Izg2QjRFQTtsZXR0ZXItc3BhY2luZzouMWVtO2JvcmRlci10b3A6MnB4IHNvbGlkICMzNDQ3NUE7cGFkZGluZy10b3A6MzJweH0KLm51bXttYXJnaW4tdG9wOjMwcHg7Zm9udDo2MDAgMjEwcHgvMSAnUGxleCBTZXJpZicsc2VyaWY7Y29sb3I6I0U4QjA1MDtsZXR0ZXItc3BhY2luZzotLjAxZW19Ci5udW0gLnV7Zm9udC1zaXplOjc2cHg7bWFyZ2luLWxlZnQ6MTRweDtjb2xvcjojRThCMDUwfQoubnN1YnttYXJnaW4tdG9wOjE4cHg7Zm9udDo1MDAgMzRweC8xLjIgJ1BsZXggTW9ubycsbW9ub3NwYWNlO2NvbG9yOiM4NkI0RUE7bGV0dGVyLXNwYWNpbmc6LjA0ZW19Ci5jaHttYXJnaW4tdG9wOjM0cHg7d2lkdGg6OTAwcHg7aGVpZ2h0OjUyMHB4O2Rpc3BsYXk6YmxvY2s7b3ZlcmZsb3c6dmlzaWJsZX0KLmNoIC5heHtmb250OjUwMCAzMHB4ICdQbGV4IE1vbm8nLG1vbm9zcGFjZTtmaWxsOiM3RjhFQTB9Ci5jaCAubHZ7Zm9udDo2MDAgNDBweCAnUGxleCBTZXJpZicsc2VyaWY7ZmlsbDojRThCMDUwfQojcHJvZ3twb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjE1MDBweDt3aWR0aDoke1d9cHg7aGVpZ2h0OjhweH0KLnNlZ3twb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtoZWlnaHQ6OHB4O2JvcmRlci1yYWRpdXM6NHB4fQpgOwpjb25zdCBNRVNJID0gWyJnZW4iLCJmZWIiLCJtYXIiLCJhcHIiLCJtYWciLCJnaXUiLCJsdWciLCJhZ28iLCJzZXQiLCJvdHQiLCJub3YiLCJkaWMiXTsKY29uc3QgZEl0ID0gKGQpID0+IHsgY29uc3QgW3ksIG0sIGddID0gU3RyaW5nKGQpLnNwbGl0KCItIikubWFwKE51bWJlcik7IHJldHVybiBnICsgIiAiICsgTUVTSVttIC0gMV07IH07CmNvbnN0IG5JdCA9ICh2LCBkZWMpID0+IE51bWJlcih2KS50b0xvY2FsZVN0cmluZygiaXQtSVQiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMCwgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBkZWMgfSk7CmZ1bmN0aW9uIGNoYXJ0U3ZnKGMpIHsgLy8gYyA9IHtzZXJpZXM6W3tkYXRhLHZhbG9yZX1dLCB1bml0YSwgZGVjfQogIGNvbnN0IFMgPSAoYy5zZXJpZXMgfHwgW10pLmZpbHRlcigocCkgPT4gcCAmJiBpc0Zpbml0ZSgrcC52YWxvcmUpKTsKICBpZiAoUy5sZW5ndGggPCAyKSB0aHJvdyBuZXcgRXJyb3IoImNoYXJ0OiBzZXJ2b25vIGFsbWVubyAyIHB1bnRpIik7CiAgY29uc3QgVzIgPSA5MDAsIEgyID0gNTIwLCBMID0gMCwgUiA9IDY4MCwgVCA9IDMwLCBCID0gNDQwLCBkZWMgPSBjLmRlYyA/PyAwOwogIGNvbnN0IHZzID0gUy5tYXAoKHApID0+ICtwLnZhbG9yZSk7IGxldCBsbyA9IE1hdGgubWluKC4uLnZzKSwgaGkgPSBNYXRoLm1heCguLi52cyk7IGNvbnN0IHBhZCA9IChoaSAtIGxvIHx8IE1hdGguYWJzKGhpKSB8fCAxKSAqIDAuMTI7IGxvIC09IHBhZDsgaGkgKz0gcGFkOwogIGNvbnN0IFggPSAoaSkgPT4gTCArIChSIC0gTCkgKiBpIC8gKFMubGVuZ3RoIC0gMSksIFkgPSAodikgPT4gQiAtIChCIC0gVCkgKiAodiAtIGxvKSAvIChoaSAtIGxvKTsKICBjb25zdCBwdHMgPSBTLm1hcCgocCwgaSkgPT4gW1goaSksIFkoK3AudmFsb3JlKV0pOwogIGNvbnN0IGQgPSBwdHMubWFwKChxLCBpKSA9PiAoaSA/ICJMIiA6ICJNIikgKyBxWzBdLnRvRml4ZWQoMSkgKyAiICIgKyBxWzFdLnRvRml4ZWQoMSkpLmpvaW4oIiAiKTsKICBjb25zdCBhcmVhID0gZCArIGAgTCAke1J9ICR7Qn0gTCAke0x9ICR7Qn0gWmA7CiAgY29uc3QgbGFzdCA9IHB0c1twdHMubGVuZ3RoIC0gMV0sIGZpcnN0ID0gU1swXSwgbHN0ID0gU1tTLmxlbmd0aCAtIDFdOwogIGNvbnN0IG14ID0gdnMuaW5kZXhPZihNYXRoLm1heCguLi52cykpLCBtbiA9IHZzLmluZGV4T2YoTWF0aC5taW4oLi4udnMpKTsKICBjb25zdCBhbmMgPSAoaSkgPT4gKGkgPT09IDAgPyAic3RhcnQiIDogaSA9PT0gUy5sZW5ndGggLSAxID8gImVuZCIgOiAibWlkZGxlIik7CiAgcmV0dXJuIGA8c3ZnIGNsYXNzPSJjaCIgZGF0YS1wPSIzIiBkYXRhLWNoYXJ0PSIxIiB2aWV3Qm94PSIwIDAgJHtXMn0gJHtIMn0iPgo8ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjRThCMDUwIiBzdG9wLW9wYWNpdHk9Ii4yOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0U4QjA1MCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9ImNjIj48cmVjdCBjbGFzcz0iY3IiIHg9IjAiIHk9IjAiIHdpZHRoPSIwIiBoZWlnaHQ9IiR7SDJ9Ii8+PC9jbGlwUGF0aD48L2RlZnM+CjxsaW5lIHgxPSIke0x9IiB5MT0iJHtCfSIgeDI9IiR7Un0iIHkyPSIke0J9IiBzdHJva2U9IiMzNDQ3NUEiIHN0cm9rZS13aWR0aD0iMiIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2MpIj48cGF0aCBkPSIke2FyZWF9IiBmaWxsPSJ1cmwoI2NnKSIvPjxwYXRoIGNsYXNzPSJsbiIgZD0iJHtkfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRThCMDUwIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz4KPHRleHQgY2xhc3M9ImF4IiB4PSIke0x9IiB5PSIke0IgKyA1MH0iPiR7ZXNjKGRJdChmaXJzdC5kYXRhKSl9PC90ZXh0Pjx0ZXh0IGNsYXNzPSJheCIgeD0iJHtSfSIgeT0iJHtCICsgNTB9IiB0ZXh0LWFuY2hvcj0iZW5kIj4ke2VzYyhkSXQobHN0LmRhdGEpKX08L3RleHQ+Cjx0ZXh0IGNsYXNzPSJheCIgeD0iJHtYKG14KX0iIHk9IiR7WSh2c1tteF0pIC0gMjJ9IiB0ZXh0LWFuY2hvcj0iJHthbmMobXgpfSIgb3BhY2l0eT0iJHtteCA9PT0gUy5sZW5ndGggLSAxID8gMCA6IDF9Ij5tYXggJHtlc2Mobkl0KHZzW214XSwgZGVjKSl9PC90ZXh0Pgo8dGV4dCBjbGFzcz0iYXgiIHg9IiR7WChtbikgKyAobW4gPT09IDAgPyAyNCA6IDApfSIgeT0iJHtZKHZzW21uXSkgKyAobW4gPT09IDAgPyAxMCA6IDUwKX0iIHRleHQtYW5jaG9yPSIke21uID09PSAwID8gInN0YXJ0IiA6IGFuYyhtbil9IiBvcGFjaXR5PSIke21uID09PSBTLmxlbmd0aCAtIDEgPyAwIDogMX0iPm1pbiAke2VzYyhuSXQodnNbbW5dLCBkZWMpKX08L3RleHQ+CjxnIGNsYXNzPSJkb3QiIG9wYWNpdHk9IjAiPjxjaXJjbGUgY3g9IiR7bGFzdFswXX0iIGN5PSIke2xhc3RbMV19IiByPSIxNCIgZmlsbD0iI0U4QjA1MCIvPjxjaXJjbGUgY3g9IiR7bGFzdFswXX0iIGN5PSIke2xhc3RbMV19IiByPSIyNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRThCMDUwIiBzdHJva2Utb3BhY2l0eT0iLjQiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCBjbGFzcz0ibHYiIHg9IiR7bGFzdFswXSArIDQwfSIgeT0iJHtsYXN0WzFdICsgMTR9Ij4ke2VzYyhuSXQobHN0LnZhbG9yZSwgZGVjKSl9PC90ZXh0Pjx0ZXh0IGNsYXNzPSJheCIgeD0iJHtsYXN0WzBdICsgNDB9IiB5PSIke2xhc3RbMV0gKyA1Mn0iPiR7ZXNjKGMudW5pdGEgfHwgIiIpfTwvdGV4dD48L2c+Cjwvc3ZnPmA7Cn0KY29uc3QgYm9keSA9IGA8ZGl2IGlkPSJiZyI+PC9kaXY+PGRpdiBpZD0iYnJhbmQiPlJFQUQgR0VPUE9MSVRJQ1M8L2Rpdj48ZGl2IGlkPSJ0YWciPklMIE1PTkRPIElOIDE1IE1JTlVUSTwvZGl2Pgoke3NwZWMuc2NlbmVzLm1hcCgocywgaSkgPT4gYDxkaXYgY2xhc3M9InNjIiBpZD0ic2Mke2l9Ij4KIDxkaXYgY2xhc3M9ImsiIGRhdGEtcD0iMCI+JHtlc2Mocy5raWNrZXIgfHwgIiIpfTwvZGl2PgogJHtzLmNoaXAgPyBgPGRpdiBjbGFzcz0iY2hpcCAke3MuY2hpcFswXX0iIGRhdGEtcD0iMSI+JHtlc2Mocy5jaGlwWzFdKX08L2Rpdj5gIDogIiJ9CiA8ZGl2IGNsYXNzPSJoJHtpID09PSAwID8gIiBiaWciIDogIiJ9IiBkYXRhLXA9IjIiPiR7cmljaChzLmhlYWQpfTwvZGl2PgogJHtzLm51bSA/IGA8ZGl2IGNsYXNzPSJudW0iIGRhdGEtcD0iMiI+JHtlc2Mocy5udW0udil9PHNwYW4gY2xhc3M9InUiPiR7ZXNjKHMubnVtLnUgfHwgIiIpfTwvc3Bhbj48L2Rpdj4ke3MubnVtLnN1YiA/IGA8ZGl2IGNsYXNzPSJuc3ViIiBkYXRhLXA9IjMiPiR7ZXNjKHMubnVtLnN1Yil9PC9kaXY+YCA6ICIifWAgOiAiIn0KICR7cy5jaGFydCA/IGNoYXJ0U3ZnKHMuY2hhcnQpIDogIiJ9CiAke3MuYm9keSA/IGA8ZGl2IGNsYXNzPSJiIiBkYXRhLXA9IjMiPiR7ZXNjKHMuYm9keSl9PC9kaXY+YCA6ICIifQogJHtzLnNyYyA/IGA8ZGl2IGNsYXNzPSJzIiBkYXRhLXA9IjQiPiR7ZXNjKHMuc3JjKX08L2Rpdj5gIDogIiJ9CiAke3MuY3RhID8gYDxkaXYgY2xhc3M9ImN0YSIgZGF0YS1wPSIzIj4ke2VzYyhzLmN0YSl9IOKGkTwvZGl2PmAgOiAiIn0KPC9kaXY+YCkuam9pbigiIil9CjxkaXYgaWQ9InByb2ciPjwvZGl2PmA7CmNvbnN0IGh0bWwgPSBgPCFkb2N0eXBlIGh0bWw+PG1ldGEgY2hhcnNldD0idXRmLTgiPjxzdHlsZT4ke0NTU308L3N0eWxlPjxib2R5PiR7Ym9keX08c2NyaXB0Pgpjb25zdCBFPXg9Pnt4PU1hdGgubWF4KDAsTWF0aC5taW4oMSx4KSk7cmV0dXJuIDEtTWF0aC5wb3coMS14LDMpfTsKY29uc3QgcmFtcD0odCxhLGIpPT5NYXRoLm1heCgwLE1hdGgubWluKDEsKHQtYSkvKGItYSkpKTsKY29uc3QgU0M9JHtKU09OLnN0cmluZ2lmeShzcGVjLnNjZW5lcy5tYXAoKHMpID0+IHMuZHVyKSl9Owpjb25zdCBUMD1bXTtsZXQgYWNjPTA7U0MuZm9yRWFjaChkPT57VDAucHVzaChhY2MpO2FjYys9ZH0pO2NvbnN0IFRPVD1hY2M7CmNvbnN0IHNlZ3M9W107Y29uc3QgcHI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2cnKTtjb25zdCBuPVNDLmxlbmd0aCx3PTY0LGc9MTQseDA9KCR7V30tKG4qdysobi0xKSpnKSkvMjsKZm9yKGxldCBpPTA7aTxuO2krKyl7Y29uc3Qgcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtzLmNsYXNzTmFtZT0nc2VnJztzLnN0eWxlLmxlZnQ9KHgwK2kqKHcrZykpKydweCc7cy5zdHlsZS53aWR0aD13KydweCc7cHIuYXBwZW5kQ2hpbGQocyk7c2Vncy5wdXNoKHMpfQpmdW5jdGlvbiByZW5kZXIodCl7CiAgbGV0IHNpZz1bXTsKICBTQy5mb3JFYWNoKChkLGkpPT57Y29uc3QgczA9VDBbaV0sczE9czArZCxlbD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2MnK2kpOwogICAgY29uc3Qgb3V0PWk8bi0xPzEtcmFtcCh0LHMxLTAuMzUsczEpOjE7Y29uc3QgaW5uPXJhbXAodCxzMCxzMCswLjQpOwogICAgZWwuc3R5bGUub3BhY2l0eT0odDxzMC0wLjAxfHx0PnMxKzAuMDEpPzA6KE1hdGgubWluKDEsaW5uKjEuMCkqb3V0KS50b0ZpeGVkKDMpOwogICAgZWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcF0nKS5mb3JFYWNoKGM9Pntjb25zdCBrPStjLmRhdGFzZXQucDtjb25zdCBhPUUocmFtcCh0LHMwKzAuMDgrayowLjE2LHMwKzAuNTUrayowLjE2KSk7Yy5zdHlsZS5vcGFjaXR5PWEudG9GaXhlZCgzKTtjLnN0eWxlLnRyYW5zZm9ybT0ndHJhbnNsYXRlWSgnKygoMS1hKSoyNikudG9GaXhlZCgxKSsncHgpJ30pOwogICAgZWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2hhcnRdJykuZm9yRWFjaChjPT57Y29uc3QgcD1FKHJhbXAodCxzMCswLjcsczArMy4wKSk7Yy5xdWVyeVNlbGVjdG9yKCcuY3InKS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywocCo5MDApLnRvRml4ZWQoMSkpO2NvbnN0IHE9cmFtcCh0LHMwKzIuOCxzMCszLjMpO2MucXVlcnlTZWxlY3RvcignLmRvdCcpLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScscS50b0ZpeGVkKDMpKTtzaWcucHVzaChwLnRvRml4ZWQoMykscS50b0ZpeGVkKDMpKX0pOwogICAgc2lnLnB1c2goZWwuc3R5bGUub3BhY2l0eSk7ZWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcF0nKS5mb3JFYWNoKGM9PnNpZy5wdXNoKGMuc3R5bGUub3BhY2l0eSkpfSk7CiAgY29uc3QgY3VyPVQwLmZpbmRJbmRleCgocyxpKT0+dD49cyYmdDxzK1NDW2ldKTsKICBzZWdzLmZvckVhY2goKHMsaSk9PntzLnN0eWxlLmJhY2tncm91bmQ9aTxjdXI/JyM4NkI0RUEnOihpPT09Y3VyPycjRThCMDUwJzonIzNhNDc1NicpfSk7CiAgcmV0dXJuIHNpZy5qb2luKCcsJykrJ3wnK2N1cjsKfQo8L3NjcmlwdD5gOwpjb25zdCB7IGNocm9taXVtIH0gPSBjcmVhdGVSZXF1aXJlKChmaXJzdERpcihbcHJvY2Vzcy5lbnYuUkdfTlBNLCBIT01FICsgIi9pZ2tpdCIsICIvb3B0L25wbS10b29scyJdLCAoZCkgPT4gZnMuZXhpc3RzU3luYyhkICsgIi9ub2RlX21vZHVsZXMvcGxheXdyaWdodCIpKSB8fCAiL29wdC9ucG0tdG9vbHMiKSArICIvIikoInBsYXl3cmlnaHQiKTsKY29uc3QgYnIgPSBhd2FpdCBjaHJvbWl1bS5sYXVuY2goeyAuLi4oZnMuZXhpc3RzU3luYyhwcm9jZXNzLmVudi5SR19DSFJPTUlVTSB8fCAiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIpID8geyBleGVjdXRhYmxlUGF0aDogcHJvY2Vzcy5lbnYuUkdfQ0hST01JVU0gfHwgIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iIH0gOiB7fSksIGFyZ3M6IFsiLS1uby1zYW5kYm94Il0gfSk7CmNvbnN0IHBnID0gYXdhaXQgYnIubmV3UGFnZSh7IHZpZXdwb3J0OiB7IHdpZHRoOiBXLCBoZWlnaHQ6IEggfSB9KTsKY29uc3QgaHAgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKE9VVCksIChzcGVjLm5hbWUgfHwgInJlZWwiKSArICJfdC5odG1sIik7CmZzLndyaXRlRmlsZVN5bmMoaHAsIGh0bWwpOwphd2FpdCBwZy5nb3RvKCJmaWxlOi8vIiArIGhwKTsKYXdhaXQgcGcuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuZm9udHMucmVhZHkpOwpjb25zdCBUT1QgPSBzcGVjLnNjZW5lcy5yZWR1Y2UoKGEsIHMpID0+IGEgKyBzLmR1ciwgMCk7CmNvbnN0IHdkID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShPVVQpLCAid29ya18iICsgKHNwZWMubmFtZSB8fCAicmVlbCIpKTsKZnMucm1TeW5jKHdkLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7IGZzLm1rZGlyU3luYyh3ZCwgeyByZWN1cnNpdmU6IHRydWUgfSk7CmlmIChQUkVWSUVXKSB7CiAgZm9yIChjb25zdCB0IG9mIFBSRVZJRVcpIHsgYXdhaXQgcGcuZXZhbHVhdGUoKHgpID0+IHJlbmRlcih4KSwgdCk7IGF3YWl0IHBnLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4od2QsIGBwcmV2XyR7dH0ucG5nYCkgfSk7IH0KICBjb25zb2xlLmxvZygiYW50ZXByaW1lIGluIiwgd2QpOyBhd2FpdCBici5jbG9zZSgpOyBwcm9jZXNzLmV4aXQoMCk7Cn0KY29uc3QgTiA9IE1hdGgucm91bmQoVE9UICogRlBTKTsKbGV0IHByZXZTaWcgPSBudWxsLCBwcmV2RmlsZSA9IG51bGwsIHNob3RzID0gMDsKZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIHsKICBjb25zdCBzaWcgPSBhd2FpdCBwZy5ldmFsdWF0ZSgoeCkgPT4gcmVuZGVyKHgpLCBpIC8gRlBTKTsKICBjb25zdCBmID0gcGF0aC5qb2luKHdkLCBTdHJpbmcoaSkucGFkU3RhcnQoNSwgIjAiKSArICIuanBnIik7CiAgaWYgKHNpZyA9PT0gcHJldlNpZyAmJiBwcmV2RmlsZSkgZnMubGlua1N5bmMocHJldkZpbGUsIGYpOwogIGVsc2UgeyBhd2FpdCBwZy5zY3JlZW5zaG90KHsgcGF0aDogZiwgdHlwZTogImpwZWciLCBxdWFsaXR5OiA5MiB9KTsgcHJldlNpZyA9IHNpZzsgcHJldkZpbGUgPSBmOyBzaG90cysrOyB9Cn0KYXdhaXQgYnIuY2xvc2UoKTsKY29uc29sZS5sb2coImZyYW1lOiIsIE4sICJzY3JlZW5zaG90OiIsIHNob3RzKTsKLy8gYXVkaW86IGxvb3AgY29uIGRpc3NvbHZlbnphIGluY3JvY2lhdGEgZSBkaXNzb2x2ZW56YSBmaW5hbGUKY29uc3QgYXVkID0gcGF0aC5qb2luKHdkLCAiYXVkaW8ud2F2Iik7Ci8vIG11c2ljYTogc2VtcHJlIGxhIHRyYWNjaWEgb3JpZ2luYWxlIGRlbCBwcm9nZXR0byAoUkdfTVVTSUMpLCB0YWdsaWF0YSBhbGxhIGR1cmF0YSBkZWwgcmVlbCBjb24gZGlzc29sdmVuemEgZmluYWxlLiBNYWkgbXVzaWNhIHNpbnRldGljYS4KbGV0IHIgPSBzcGF3blN5bmMoImZmbXBlZyIsIFsiLXYiLCAiZXJyb3IiLCAiLXkiLCAiLWkiLCBNVVNJQywgIi1hZiIsIGBhdHJpbT0wOiR7VE9UfSxhZmFkZT10PW91dDpzdD0ke1RPVCAtIDIuNX06ZD0yLjVgLCBhdWRdLCB7IHN0ZGlvOiAiaW5oZXJpdCIgfSk7CnIgPSBzcGF3blN5bmMoImZmbXBlZyIsIFsiLXYiLCAiZXJyb3IiLCAiLXkiLCAiLWZyYW1lcmF0ZSIsIFN0cmluZyhGUFMpLCAiLWkiLCBwYXRoLmpvaW4od2QsICIlMDVkLmpwZyIpLCAiLWkiLCBhdWQsICItYzp2IiwgImxpYngyNjQiLCAiLXByZXNldCIsICJtZWRpdW0iLCAiLWNyZiIsICIxOCIsICItcGl4X2ZtdCIsICJ5dXY0MjBwIiwgIi1jOmEiLCAiYWFjIiwgIi1iOmEiLCAiMTkyayIsICItc2hvcnRlc3QiLCAiLW1vdmZsYWdzIiwgIitmYXN0c3RhcnQiLCBPVVRdLCB7IHN0ZGlvOiAiaW5oZXJpdCIgfSk7CmNvbnNvbGUubG9nKCJmZm1wZWcgZXhpdCIsIHIuc3RhdHVzLCBPVVQpOwo=",
  "sitoreel.mjs": "Ly8gc2l0b3JlZWwubWpzIOKAlCByZWVsIGRlbCB2ZW5lcmTDrCAiRGVudHJvIGlsIHNpdG8iOiB1bmEgbmF2aWdhemlvbmUgVkVSQSBkZWwgc2l0byAoY2FydGVsbGEgcHVibGljIGRlbCByZXBvLCBkYXRpIGRhbCBXb3JrZXIpLAovLyByZWdpc3RyYXRhIGNvbWUgc3UgdW4gdGVsZWZvbm8sIGNvbiB1biB0aXRvbG8gcGVyIG9nbmkgcGFzc2FnZ2lvLCBsJ2V0aWNoZXR0YSBmaXNzYSBkZWxsYSBydWJyaWNhIGUgbGEgbXVzaWNhIG9yaWdpbmFsZS4KLy8gdXNvOiBub2RlIHNpdG9yZWVsLm1qcyBUT1VSIFNJVEVfRElSIE9VVC5tcDQgW0FQSV9CQVNFXQovLyAgIFRPVVIgPSB0ZW1pIHwgc3RvcmlhIHwgcGFyb2xhIHwgY2VyY2EgICAobGEgcm90YXppb25lIGxhIGRlY2lkZSBsYSByaWNldHRhKQovLyAgIFNJVEVfRElSID0gY2FydGVsbGEgcHVibGljIGRlbCByZXBvIGZyYW5jZXNjb2dhbGlhbm8vcmVhZC1nZW9wb2xpdGljczsgQVBJX0JBU0UgPSBpbmRpcml6em8gZGVsIFdvcmtlciAoZGF0aSBkaSBvZ2dpKQovLyAgIHZhcmlhYmlsaTogUkdfTVVTSUMgKG1wMyBkZWxsYSBtdXNpY2Egb3JpZ2luYWxlLCBvYmJsaWdhdG9yaWEpLCBSR19GT05UUyAoY2FydGVsbGEgZGVpIGZvbnQgSUJNIFBsZXgsIGZhY29sdGF0aXZhKQovLyBzdGFtcGE6IGR1cmF0YSwgZmlsZSwgdGVtYS9zdG9yaWEvcGFyb2xhIHVzYXRpIGUgaSBmb3RvZ3JhbW1pIGRpIGNvbnRyb2xsbyAoT1VUX0RJUi9jaGVja18qLmpwZykKaW1wb3J0IGZzIGZyb20gIm5vZGU6ZnMiOwppbXBvcnQgaHR0cCBmcm9tICJub2RlOmh0dHAiOwppbXBvcnQgcGF0aCBmcm9tICJub2RlOnBhdGgiOwppbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICJub2RlOmNoaWxkX3Byb2Nlc3MiOwoKY29uc3QgW3RvdXIsIHNpdGVEaXIsIG91dCwgYXBpXSA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTsKY29uc3QgVE9VUlMgPSBbInRlbWkiLCAic3RvcmlhIiwgInBhcm9sYSIsICJjZXJjYSJdOwppZiAoIVRPVVJTLmluY2x1ZGVzKHRvdXIpIHx8ICFzaXRlRGlyIHx8ICFvdXQpIHsgY29uc29sZS5sb2coInVzbzogbm9kZSBzaXRvcmVlbC5tanMgIiArIFRPVVJTLmpvaW4oInwiKSArICIgU0lURV9ESVIgT1VULm1wNCBbQVBJX0JBU0VdIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBNVVNJQyA9IHByb2Nlc3MuZW52LlJHX01VU0lDOwppZiAoIU1VU0lDIHx8ICFmcy5leGlzdHNTeW5jKE1VU0lDKSkgeyBjb25zb2xlLmxvZygibWFuY2EgbGEgbXVzaWNhIG9yaWdpbmFsZTogaW1wb3N0YSBSR19NVVNJQyIpOyBwcm9jZXNzLmV4aXQoMik7IH0KY29uc3QgSE9NRSA9IHByb2Nlc3MuZW52LkhPTUUgfHwgIi9yb290IjsKY29uc3QgRk9OVFMgPSBbcHJvY2Vzcy5lbnYuUkdfRk9OVFMsIEhPTUUgKyAiL2lna2l0L2ZvbnRzIiwgIi9ob21lL2NsYXVkZS9pZ2tpdC9mb250cyIsICIvdG1wL3JrL2ZvbnRzIl0uZmluZCgoZCkgPT4gZCAmJiBmcy5leGlzdHNTeW5jKGQgKyAiL2libS1wbGV4LXNlcmlmLWxhdGluLTYwMC1ub3JtYWwud29mZjIiKSAmJiBmcy5leGlzdHNTeW5jKGQgKyAiL2libS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiIpKTsKaWYgKCFGT05UUykgeyBjb25zb2xlLmxvZygiZm9udCBJQk0gUGxleCBub24gdHJvdmF0aSAoc2VyaWYgNjAwLCBzYW5zIDQwMC82MDAsIG1vbm8gNTAwKTogZXNlZ3VpIHByaW1hIHJlZWwubWpzIHVuYSB2b2x0YSwgbGkgaW5zdGFsbGEgbHVpIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBmZiA9IChmLCBmYW0sIHcpID0+IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKEZPTlRTLCBmKSkgPyBgQGZvbnQtZmFjZXtmb250LWZhbWlseTonJHtmYW19Jztmb250LXdlaWdodDoke3d9O3NyYzp1cmwoZGF0YTpmb250L3dvZmYyO2Jhc2U2NCwke2ZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oRk9OVFMsIGYpKS50b1N0cmluZygiYmFzZTY0Iil9KSBmb3JtYXQoJ3dvZmYyJyl9YCA6ICIiOwpjb25zdCBGT05UQ1NTID0gZmYoImlibS1wbGV4LXNlcmlmLWxhdGluLTYwMC1ub3JtYWwud29mZjIiLCAiUFMiLCA2MDApICsgZmYoImlibS1wbGV4LXNhbnMtbGF0aW4tNDAwLW5vcm1hbC53b2ZmMiIsICJQU2EiLCA0MDApICsgZmYoImlibS1wbGV4LXNhbnMtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiIsICJQU2EiLCA2MDApICsgZmYoImlibS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiIsICJQTSIsIDUwMCk7CgpsZXQgY2hyb21pdW07CmZvciAoY29uc3QgcCBvZiBbInBsYXl3cmlnaHQiLCBwYXRoLmpvaW4oSE9NRSwgImlna2l0L25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIpLCAiL3RtcC9pZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiLCAiL3RtcC9pZ3Rlc3Qvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIl0pIHsgdHJ5IHsgY2hyb21pdW0gPSAoYXdhaXQgaW1wb3J0KHAuc3RhcnRzV2l0aCgiLyIpID8gImZpbGU6Ly8iICsgcCA6IHApKS5jaHJvbWl1bTsgYnJlYWs7IH0gY2F0Y2ggKGUpIHt9IH0KaWYgKCFjaHJvbWl1bSkgeyBjb25zb2xlLmxvZygiUGxheXdyaWdodCBub24gdHJvdmF0byIpOyBwcm9jZXNzLmV4aXQoMSk7IH0KCi8vIC0tLS0tLS0tLS0gZGF0aSBlIHNlcnZlciBsb2NhbGUgZGVsIHNpdG8gLS0tLS0tLS0tLQpsZXQgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oc2l0ZURpciwgImRhdGEuanNvbiIpKTsKbGV0IGZvbnRlID0gImRhdGEuanNvbiBkZWwgcmVwbyAocHXDsiBlc3NlcmUgdmVjY2hpbykiOwppZiAoYXBpKSB7IHRyeSB7IGNvbnN0IHIgPSBhd2FpdCBmZXRjaChhcGkucmVwbGFjZSgvXC8kLywgIiIpICsgIi9hcGkvZGF0YS5qc29uIiwgeyBoZWFkZXJzOiB7ICJ1c2VyLWFnZW50IjogInJnLXJvdXRpbmUvMS4wIiB9IH0pOyBpZiAoci5vaykgeyBjb25zdCBiID0gQnVmZmVyLmZyb20oYXdhaXQgci5hcnJheUJ1ZmZlcigpKTsgSlNPTi5wYXJzZShiLnRvU3RyaW5nKCkpOyBkYXRhID0gYjsgZm9udGUgPSAiV29ya2VyIC9hcGkvZGF0YS5qc29uIChhZ2dpb3JuYXRvKSI7IH0gfSBjYXRjaCAoZSkge30gfQpjb25zdCBNSU1FID0geyAiLmh0bWwiOiAidGV4dC9odG1sIiwgIi5qc29uIjogImFwcGxpY2F0aW9uL2pzb24iLCAiLmpzIjogInRleHQvamF2YXNjcmlwdCIsICIuY3NzIjogInRleHQvY3NzIiwgIi5wbmciOiAiaW1hZ2UvcG5nIiwgIi5qcGciOiAiaW1hZ2UvanBlZyIsICIuc3ZnIjogImltYWdlL3N2Zyt4bWwiIH07CmNvbnN0IHNydiA9IGh0dHAuY3JlYXRlU2VydmVyKChxLCBzKSA9PiB7IGxldCB1ID0gZGVjb2RlVVJJQ29tcG9uZW50KHEudXJsLnNwbGl0KCI/IilbMF0pOyBpZiAodSA9PT0gIi8iKSB1ID0gIi9pbmRleC5odG1sIjsgY29uc3QgZiA9IHBhdGguam9pbihzaXRlRGlyLCB1KTsgaWYgKCFmLnN0YXJ0c1dpdGgocGF0aC5yZXNvbHZlKHNpdGVEaXIpKSB8fCAhZnMuZXhpc3RzU3luYyhmKSkgeyBzLndyaXRlSGVhZCg0MDQpOyBzLmVuZCgpOyByZXR1cm47IH0gcy53cml0ZUhlYWQoMjAwLCB7ICJjb250ZW50LXR5cGUiOiBNSU1FW3BhdGguZXh0bmFtZShmKV0gfHwgImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSIgfSk7IHMuZW5kKGZzLnJlYWRGaWxlU3luYyhmKSk7IH0pLmxpc3RlbigwKTsKY29uc3QgcG9ydCA9IHNydi5hZGRyZXNzKCkucG9ydDsKCmNvbnN0IHdvcmsgPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShvdXQpKSwgIndvcmtfc2l0b3JlZWwiKTsKZnMucm1TeW5jKHdvcmssIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KTsgZnMubWtkaXJTeW5jKHBhdGguam9pbih3b3JrLCAicGgiKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7IGZzLm1rZGlyU3luYyhwYXRoLmpvaW4od29yaywgImJnIiksIHsgcmVjdXJzaXZlOiB0cnVlIH0pOwpjb25zdCBiciA9IGF3YWl0IGNocm9taXVtLmxhdW5jaCh7IGV4ZWN1dGFibGVQYXRoOiBwcm9jZXNzLmVudi5DSFJPTUlVTSB8fCAoZnMuZXhpc3RzU3luYygiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIpID8gIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iIDogdW5kZWZpbmVkKSwgYXJnczogWyItLW5vLXNhbmRib3giXSB9KTsKY29uc3QgY3R4ID0gYXdhaXQgYnIubmV3Q29udGV4dCh7IHZpZXdwb3J0OiB7IHdpZHRoOiAzOTAsIGhlaWdodDogODQ0IH0sIGRldmljZVNjYWxlRmFjdG9yOiAyLCBpc01vYmlsZTogdHJ1ZSwgaGFzVG91Y2g6IHRydWUgfSk7CmF3YWl0IGN0eC5hZGRJbml0U2NyaXB0KCgpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oInJnLXVpZCIsICJyZWVsIik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCJyZy1ndWlkYS12aXN0YSIsICIxIik7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCJyZy1ub3ZpdGEtdmlzdGEiLCAiOTk5OSIpOyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgicmctbmwiLCAiMSIpOyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgicmctc2VlbiIsICIyMDk5LTAxLTAxIik7IH0gY2F0Y2ggKGUpIHt9IH0pOwphd2FpdCBjdHgucm91dGUoL3JnLWFwaVwuYnJpZWZpbmdodWJcLndvcmtlcnNcLmRldi8sIChyKSA9PiB7IGlmIChyLnJlcXVlc3QoKS51cmwoKS5lbmRzV2l0aCgiL2FwaS9kYXRhLmpzb24iKSkgci5mdWxmaWxsKHsgc3RhdHVzOiAyMDAsIGNvbnRlbnRUeXBlOiAiYXBwbGljYXRpb24vanNvbiIsIGJvZHk6IGRhdGEgfSk7IGVsc2Ugci5mdWxmaWxsKHsgc3RhdHVzOiAyMDAsIGNvbnRlbnRUeXBlOiAiYXBwbGljYXRpb24vanNvbiIsIGJvZHk6ICJ7fSIgfSk7IH0pOwpjb25zdCBwID0gYXdhaXQgY3R4Lm5ld1BhZ2UoKTsKYXdhaXQgcC5nb3RvKGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vaW5kZXguaHRtbGApOwphd2FpdCBwLndhaXRGb3JUaW1lb3V0KDMwMDApOwphd2FpdCBwLmFkZFN0eWxlVGFnKHsgY29udGVudDogIiNwdWJCYXIsLmd1aWRlLWhpbnQsI25sUG9wLC5ubC1wb3B7ZGlzcGxheTpub25lIWltcG9ydGFudH0iIH0pOwoKLy8gLS0tLS0tLS0tLSByZWdpc3RyYXRvcmU6IG9nbmkgZm90b2dyYW1tYSDDqCAxLzMwIGRpIHNlY29uZG8gLS0tLS0tLS0tLQpsZXQgRiA9IDAsIGxhc3QgPSBudWxsOwpjb25zdCBzZWdzID0gW107IC8vIHtraWNrZXIsIGhlYWQsIGZyb219CmNvbnN0IHNuYXAgPSBhc3luYyAoKSA9PiB7IGNvbnN0IGYgPSBwYXRoLmpvaW4od29yaywgInBoIiwgU3RyaW5nKEYpLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpOyBhd2FpdCBwLnNjcmVlbnNob3QoeyBwYXRoOiBmLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDkwIH0pOyBsYXN0ID0gZjsgRisrOyB9Owpjb25zdCBob2xkID0gYXN5bmMgKHNlYykgPT4geyBpZiAoIWxhc3QpIGF3YWl0IHNuYXAoKTsgY29uc3QgbiA9IE1hdGgucm91bmQoc2VjICogMzApOyBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykgeyBjb25zdCBmID0gcGF0aC5qb2luKHdvcmssICJwaCIsIFN0cmluZyhGKS5wYWRTdGFydCg1LCAiMCIpICsgIi5qcGciKTsgZnMuY29weUZpbGVTeW5jKGxhc3QsIGYpOyBGKys7IH0gfTsKY29uc3Qgc2Nyb2xsID0gYXN5bmMgKGR5LCBzZWMpID0+IHsgY29uc3QgbiA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoc2VjICogMzApKTsgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHsgY29uc3QgdDAgPSBpIC8gbiwgdDEgPSAoaSArIDEpIC8gbjsgY29uc3QgZSA9ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IDEgLSBNYXRoLnBvdygtMiAqIHQgKyAyLCAyKSAvIDIpOyBhd2FpdCBwLmV2YWx1YXRlKChkKSA9PiB3aW5kb3cuc2Nyb2xsQnkoMCwgZCksIGR5ICogKGUodDEpIC0gZSh0MCkpKTsgYXdhaXQgc25hcCgpOyB9IH07CmNvbnN0IHRvVG9wID0gYXN5bmMgKHNlbCwgb2ZmID0gMTIwLCBzZWMgPSAwLjYpID0+IHsgY29uc3QgeSA9IGF3YWl0IHAuZXZhbHVhdGUoKFtzLCBvXSkgPT4geyBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzKTsgcmV0dXJuIGUgPyBlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIG8gOiAwOyB9LCBbc2VsLCBvZmZdKTsgYXdhaXQgc2Nyb2xsKHksIHNlYyk7IH07CmNvbnN0IHRhcCA9IGFzeW5jIChzZWwpID0+IHsgY29uc3QgaCA9IGF3YWl0IHAuJChzZWwpOyBpZiAoIWgpIHRocm93IG5ldyBFcnJvcigibWFuY2EgbmVsIHNpdG86ICIgKyBzZWwpOyBhd2FpdCBoLmNsaWNrKCk7IGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7IGF3YWl0IHAud2FpdEZvclRpbWVvdXQoNDApOyBhd2FpdCBzbmFwKCk7IH0gfTsKY29uc3Qgc2VnID0gKGtpY2tlciwgaGVhZCkgPT4gc2Vncy5wdXNoKHsga2lja2VyLCBoZWFkLCBmcm9tOiBGIH0pOwpjb25zdCB0eXBlSW4gPSBhc3luYyAoc2VsLCB0ZXh0KSA9PiB7IGF3YWl0IHAuY2xpY2soc2VsKTsgZm9yIChjb25zdCBjaCBvZiB0ZXh0KSB7IGF3YWl0IHAua2V5Ym9hcmQudHlwZShjaCk7IGF3YWl0IHNuYXAoKTsgYXdhaXQgc25hcCgpOyB9IH07CgpsZXQgdXNhdG8gPSAiIjsKdHJ5IHsKICBpZiAodG91ciA9PT0gInRlbWkiKSB7CiAgICBzZWcoIkkgVEVNSSIsICJPZ25pIG5vdGl6aWEgZmEgcGFydGUgKmRpIHVuYSBzdG9yaWEgcGnDuSBsdW5nYSoiKTsKICAgIGF3YWl0IHRhcCgiI3RhYi10aW1lbGluZSIpOyBhd2FpdCBob2xkKDAuOCk7CiAgICBpZiAoYXdhaXQgcC4kKCIjdGxEb3NGIikpIHsgYXdhaXQgdGFwKCIjdGxEb3NGIik7IGF3YWl0IGhvbGQoMC40KTsgfQogICAgY29uc3QgdGlkID0gYXdhaXQgcC5ldmFsdWF0ZSgoKSA9PiB7IGNvbnN0IGMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgiI3RocmVhZFZpZXcgLmFjYyIpXS5maW5kKChhKSA9PiBhLnF1ZXJ5U2VsZWN0b3IoIi5kb3MtYmFkZ2UiKSAmJiBhLnF1ZXJ5U2VsZWN0b3IoIltkYXRhLXRsLXRoZW1lXSIpKTsgcmV0dXJuIGMgPyBjLnF1ZXJ5U2VsZWN0b3IoIltkYXRhLXRsLXRoZW1lXSIpLmdldEF0dHJpYnV0ZSgiZGF0YS10bC10aGVtZSIpIDogIiI7IH0pOwogICAgaWYgKCF0aWQpIHRocm93IG5ldyBFcnJvcigibmVzc3VuIHRlbWEgY29uIGRvc3NpZXIiKTsKICAgIHVzYXRvID0gInRlbWEgIiArIHRpZDsKICAgIGF3YWl0IHNjcm9sbCgxNjAsIDAuOCk7IGF3YWl0IGhvbGQoMC42KTsKICAgIHNlZygiMSDCtyBHSU9STk8gUEVSIEdJT1JOTyIsICJBcHJpIHVuIHRlbWE6ICpjb3NhIMOoIHN1Y2Nlc3NvKiwgaW4gb3JkaW5lIik7CiAgICBhd2FpdCB0YXAoYFtkYXRhLXRsLXRoZW1lPSIke3RpZH0iXWApOyBhd2FpdCB0b1RvcChgW2lkPSJhY2MtJHt0aWR9Il1gLCAxMTAsIDAuOCk7IGF3YWl0IGhvbGQoMC42KTsKICAgIGF3YWl0IHNjcm9sbCg4MjAsIDMuMik7IGF3YWl0IGhvbGQoMC42KTsgYXdhaXQgdG9Ub3AoYFtpZD0iYWNjLSR7dGlkfSJdYCwgMTEwLCAwLjkpOwogICAgc2VnKCIyIMK3IElMIFFVQURSTyIsICJEYSBkb3ZlIG5hc2NlLCAqY2hpIGMnw6gqLCBjb3NhIHZ1b2xlIik7CiAgICBhd2FpdCB0YXAoYFtpZD0iYWNjLSR7dGlkfSJdIFtkYXRhLWxheT0icSJdYCk7IGF3YWl0IGhvbGQoMS4wKTsgYXdhaXQgc2Nyb2xsKDY0MCwgMy4yKTsgYXdhaXQgaG9sZCgwLjYpOwogICAgc2VnKCIzIMK3IENPTUUgUFXDkiBBTkRBUkUiLCAiR2xpIHNjZW5hcmksICpjb24gbGUgbG9ybyBmb250aSoiKTsKICAgIGlmIChhd2FpdCBwLiQoJ1tkYXRhLWRzZWM9InNjZW5hcmkiXScpKSB7IGF3YWl0IHAuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZHNlYz0ic2NlbmFyaSJdJykuY2xpY2soKSk7IGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykgeyBhd2FpdCBwLndhaXRGb3JUaW1lb3V0KDQwKTsgYXdhaXQgc25hcCgpOyB9IGF3YWl0IHNjcm9sbCgxNjAsIDAuOCk7IH0KICAgIGF3YWl0IGhvbGQoMi42KTsKICB9IGVsc2UgaWYgKHRvdXIgPT09ICJzdG9yaWEiKSB7CiAgICBzZWcoIk9HTkkgTUFUVElOQSIsICJJbCBtb25kbyAqaW4gNjAgc2Vjb25kaSoiKTsKICAgIGF3YWl0IGhvbGQoMC42KTsgYXdhaXQgdG9Ub3AoIiNicmllZmluZyAuaW42MCIsIDEyMCwgMC44KTsgYXdhaXQgaG9sZCgxLjYpOwogICAgY29uc3Qgc2lkID0gYXdhaXQgcC5ldmFsdWF0ZSgoKSA9PiB7IGNvbnN0IHIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjYnJpZWZpbmcgLmluNjAtcmVmW2RhdGEtc3RvcnldIik7IHJldHVybiByID8gci5nZXRBdHRyaWJ1dGUoImRhdGEtc3RvcnkiKSA6ICIiOyB9KTsKICAgIGlmICghc2lkKSB0aHJvdyBuZXcgRXJyb3IoIm5lc3N1biByaW1hbmRvIG5laSA2MCBzZWNvbmRpIik7CiAgICB1c2F0byA9ICJzdG9yaWEgIiArIHNpZDsKICAgIHNlZygiMSDCtyBMQSBTVE9SSUEiLCAiSSBmYXR0aSwgKm9nbnVubyBjb24gbGEgc3VhIGZvbnRlKiIpOwogICAgYXdhaXQgdGFwKGAjYnJpZWZpbmcgLmluNjAtcmVmW2RhdGEtc3Rvcnk9IiR7c2lkfSJdYCk7IGF3YWl0IGhvbGQoMC40KTsgYXdhaXQgdG9Ub3AoYCNzdC0ke3NpZH1gLCAxMTAsIDAuOCk7IGF3YWl0IGhvbGQoMC44KTsgYXdhaXQgc2Nyb2xsKDUyMCwgMi42KTsgYXdhaXQgaG9sZCgwLjYpOwogICAgc2VnKCIyIMK3IExFIERVRSBURVNJIiwgIkNoaSBzb3N0aWVuZSBjb3NhLCAqYSBjb25mcm9udG8qIik7CiAgICBjb25zdCBzdW0gPSBgI3N0LSR7c2lkfSBkZXRhaWxzID4gc3VtbWFyeWA7IGlmIChhd2FpdCBwLiQoc3VtKSkgeyBhd2FpdCB0b1RvcChzdW0sIDI2MCwgMC43KTsgYXdhaXQgdGFwKHN1bSk7IGF3YWl0IGhvbGQoMC42KTsgfQogICAgYXdhaXQgc2Nyb2xsKDcwMCwgMy40KTsgYXdhaXQgaG9sZCgwLjYpOwogICAgc2VnKCIzIMK3IERBIE9TU0VSVkFSRSIsICJFIGNvc2EgcHXDsiBjYW1iaWFyZSAqbmVpIHByb3NzaW1pIGdpb3JuaSoiKTsKICAgIGF3YWl0IHNjcm9sbCg1NjAsIDIuOCk7IGF3YWl0IGhvbGQoMi40KTsKICB9IGVsc2UgaWYgKHRvdXIgPT09ICJwYXJvbGEiKSB7CiAgICBzZWcoIkxFIFBBUk9MRSBERUxMRSBOT1RJWklFIiwgIlVuYSBwYXJvbGEgY2hlIG5vbiBjb25vc2NpPyAqVG9jY2FsYSoiKTsKICAgIGNvbnN0IGdpZCA9IGF3YWl0IHAuZXZhbHVhdGUoKCkgPT4geyBjb25zdCBnID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNicmllZmluZyAuc3RvcnkgLmdsIildLmZpbmQoKHgpID0+IHguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ID4gMCk7IGlmICghZykgcmV0dXJuICIiOyBnLmlkID0gZy5pZCB8fCAiZ2xyZWVsIjsgcmV0dXJuIGcuaWQ7IH0pOwogICAgaWYgKCFnaWQpIHRocm93IG5ldyBFcnJvcigibmVzc3VuYSBwYXJvbGEgZGVsIGdsb3NzYXJpbyBuZWwgYnJpZWZpbmciKTsKICAgIHVzYXRvID0gInBhcm9sYSAiICsgKGF3YWl0IHAuJGV2YWwoIiMiICsgZ2lkLCAoZSkgPT4gZS50ZXh0Q29udGVudC50cmltKCkpKTsKICAgIGF3YWl0IGhvbGQoMC42KTsgYXdhaXQgdG9Ub3AoIiMiICsgZ2lkLCAzMzAsIDEuNCk7IGF3YWl0IGhvbGQoMS4yKTsKICAgIHNlZygiMSDCtyBMQSBTUElFR0FaSU9ORSIsICJDaGkgw6gsIGNvcyfDqCwgKmluIHVuYSByaWdhKiIpOwogICAgYXdhaXQgdGFwKCIjIiArIGdpZCk7IGF3YWl0IGhvbGQoNC4yKTsKICAgIHNlZygiMiDCtyBORUwgQ09OVEVTVE8iLCAiUG9pIHRvcm5pIGEgbGVnZ2VyZSwgKnNlbnphIHBlcmRlcmUgaWwgZmlsbyoiKTsKICAgIGF3YWl0IHAua2V5Ym9hcmQucHJlc3MoIkVzY2FwZSIpOyBhd2FpdCBwLmV2YWx1YXRlKCgpID0+IHsgY29uc3QgeCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNnbG9zc1BvcCAueCwgLmdsLXBvcCAueCwgW2RhdGEtZ2wtY2xvc2VdIik7IGlmICh4KSB4LmNsaWNrKCk7IH0pOyBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykgeyBhd2FpdCBwLndhaXRGb3JUaW1lb3V0KDQwKTsgYXdhaXQgc25hcCgpOyB9CiAgICBhd2FpdCBzY3JvbGwoNDgwLCAyLjYpOyBhd2FpdCBob2xkKDEuMCk7IGF3YWl0IHNjcm9sbCg0MjAsIDIuNCk7IGF3YWl0IGhvbGQoMi40KTsKICB9IGVsc2UgaWYgKHRvdXIgPT09ICJjZXJjYSIpIHsKICAgIHNlZygiTCdBUkNISVZJTyIsICJUdXR0byBxdWVsbG8gY2hlIMOoIHN1Y2Nlc3NvLCAqaW4gdW5hIHJpY2VyY2EqIik7CiAgICBhd2FpdCB0YXAoIiNzcmNoQnRuIik7IGF3YWl0IGhvbGQoMC44KTsKICAgIGNvbnN0IHEgPSBhd2FpdCBwLmV2YWx1YXRlKCgpID0+IHsgY29uc3QgYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNhMmNoaXBzIFtkYXRhLWEycV0iKTsgcmV0dXJuIGMgPyBjLmdldEF0dHJpYnV0ZSgiZGF0YS1hMnEiKSA6ICJIb3JtdXoiOyB9KTsKICAgIHVzYXRvID0gInJpY2VyY2EgIiArIHE7CiAgICBzZWcoIjEgwrcgQ0VSQ0EiLCAiVW4gcGFlc2UsIHVuIHRlbWEsICp1bmEgcGVyc29uYSoiKTsKICAgIGF3YWl0IHR5cGVJbigiI3EiLCBxKTsgYXdhaXQgaG9sZCgyLjApOwogICAgc2VnKCIyIMK3IEkgUklTVUxUQVRJIiwgIlN0b3JpZSwgdGVtaSBlIHBlcnNvbmUsICppbiBvcmRpbmUgZGkgZGF0YSoiKTsKICAgIGF3YWl0IHNjcm9sbCg3MDAsIDMuNik7IGF3YWl0IGhvbGQoMS4yKTsgYXdhaXQgc2Nyb2xsKDYwMCwgMy4wKTsgYXdhaXQgaG9sZCgyLjQpOwogIH0KfSBjYXRjaCAoZSkgeyBjb25zb2xlLmxvZygiRVJST1JFIG5lbCBwZXJjb3JzbzogIiArIGUubWVzc2FnZSk7IGF3YWl0IGJyLmNsb3NlKCk7IHNydi5jbG9zZSgpOyBwcm9jZXNzLmV4aXQoMSk7IH0KY29uc3QgcGhvbmVTZWMgPSBGIC8gMzA7CgovLyAtLS0tLS0tLS0tIHNmb25kaTogdGl0b2xvIGRlbCBwYXNzYWdnaW8sIGV0aWNoZXR0YSBmaXNzYSwgYmFycmEgZGkgYXZhbnphbWVudG87IGNoaXVzdXJhIC0tLS0tLS0tLS0KY29uc3QgcmljaCA9IChzKSA9PiBTdHJpbmcocykucmVwbGFjZSgvJi9nLCAiJmFtcDsiKS5yZXBsYWNlKC88L2csICImbHQ7IikucmVwbGFjZSgvXCooLis/KVwqL2csICI8Yj4kMTwvYj4iKTsKY29uc3QgTEFCRUwgPSAiREVOVFJPIElMIFNJVE8iOwpjb25zdCBjc3MgPSBgJHtGT05UQ1NTfWJvZHl7bWFyZ2luOjA7d2lkdGg6MTA4MHB4O2hlaWdodDoxOTIwcHg7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCA3MCUgMCUsIzFkMzU1MCAwJSwjMEIxMTE3IDU1JSk7b3ZlcmZsb3c6aGlkZGVuO2NvbG9yOiNFNEVBRUZ9Ci5icmFuZHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NjRweDt3aWR0aDoxMDAlO3RleHQtYWxpZ246Y2VudGVyO2ZvbnQ6NjAwIDQ2cHggUFM7bGV0dGVyLXNwYWNpbmc6LjA0ZW19Ci5yZWN7cG9zaXRpb246YWJzb2x1dGU7dG9wOjE2OHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXJ9LnJlYyBzcGFue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2ZvbnQ6NTAwIDMwcHgvMSBQTTtsZXR0ZXItc3BhY2luZzouMTJlbTtjb2xvcjojMEIxMTE3O2JhY2tncm91bmQ6I0U4QjA1MDtwYWRkaW5nOjEycHggMjRweDtib3JkZXItcmFkaXVzOjk5OXB4fQouYmFye3Bvc2l0aW9uOmFic29sdXRlO3RvcDoyMzZweDtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKTtkaXNwbGF5OmZsZXg7Z2FwOjEycHh9LmJhciBpe3dpZHRoOjU2cHg7aGVpZ2h0OjZweDtib3JkZXItcmFkaXVzOjNweDtiYWNrZ3JvdW5kOiMyYjNhNDh9LmJhciBpLm9ue2JhY2tncm91bmQ6I0U4QjA1MH0uYmFyIGkuZG9uZXtiYWNrZ3JvdW5kOiM4NkI0RUF9Ci5re3Bvc2l0aW9uOmFic29sdXRlO3RvcDoyODJweDtsZWZ0OjgwcHg7cmlnaHQ6MTUwcHg7Zm9udDo1MDAgMzJweC8xIFBNO2NvbG9yOiNFOEIwNTA7bGV0dGVyLXNwYWNpbmc6LjA4ZW19Lmh7cG9zaXRpb246YWJzb2x1dGU7dG9wOjMyNnB4O2xlZnQ6ODBweDtyaWdodDoxNTBweDtmb250OjYwMCA1MnB4LzEuMSBQU30uaCBie2NvbG9yOiNFOEIwNTA7Zm9udC13ZWlnaHQ6NjAwfQoucGh7cG9zaXRpb246YWJzb2x1dGU7bGVmdDoyNjJweDt0b3A6NDU5cHg7d2lkdGg6NTUwcHg7aGVpZ2h0OjExOTBweDtib3JkZXItcmFkaXVzOjQwcHg7Ym9yZGVyOjNweCBzb2xpZCAjMzQ0NzVBO2JveC1zaGFkb3c6MCAyMHB4IDYwcHggcmdiYSgwLDAsMCwuNil9Ci5le3Bvc2l0aW9uOmFic29sdXRlO3RvcDo2MjBweDtsZWZ0OjkwcHg7cmlnaHQ6MTUwcHh9LmUgLmgye2ZvbnQ6NjAwIDkycHgvMS4wOCBQU30uZSAuaDIgYntjb2xvcjojRThCMDUwO2ZvbnQtd2VpZ2h0OjYwMH0uZSAuY3ttYXJnaW4tdG9wOjYwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udDo2MDAgNDBweCBQU2E7Y29sb3I6IzBCMTExNztiYWNrZ3JvdW5kOiM4NkI0RUE7cGFkZGluZzoyMHB4IDQwcHg7Ym9yZGVyLXJhZGl1czo5OTlweH0uZSAuc3ttYXJnaW4tdG9wOjMwcHg7Zm9udDo0MDAgMzRweCBQU2E7Y29sb3I6IzlmYjBjMH1gOwpjb25zdCBwZyA9IGF3YWl0IGJyLm5ld1BhZ2UoeyB2aWV3cG9ydDogeyB3aWR0aDogMTA4MCwgaGVpZ2h0OiAxOTIwIH0gfSk7CmNvbnN0IE4gPSBzZWdzLmxlbmd0aDsKZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIHsKICBjb25zdCBiYXIgPSBzZWdzLm1hcCgoXywgaikgPT4gYDxpIGNsYXNzPSIke2ogPCBpID8gImRvbmUiIDogaiA9PT0gaSA/ICJvbiIgOiAiIn0iPjwvaT5gKS5qb2luKCIiKSArICI8aT48L2k+IjsKICBhd2FpdCBwZy5zZXRDb250ZW50KGA8c3R5bGU+JHtjc3N9PC9zdHlsZT48ZGl2IGNsYXNzPSJicmFuZCI+UkVBRCBHRU9QT0xJVElDUzwvZGl2PjxkaXYgY2xhc3M9InJlYyI+PHNwYW4+JHtMQUJFTH08L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0iYmFyIj4ke2Jhcn08L2Rpdj48ZGl2IGNsYXNzPSJrIj4ke3JpY2goc2Vnc1tpXS5raWNrZXIpfTwvZGl2PjxkaXYgY2xhc3M9ImgiPiR7cmljaChzZWdzW2ldLmhlYWQpfTwvZGl2PjxkaXYgY2xhc3M9InBoIj48L2Rpdj5gKTsKICBhd2FpdCBwZy5zY3JlZW5zaG90KHsgcGF0aDogcGF0aC5qb2luKHdvcmssICJiZyIsIGAke2l9LnBuZ2ApIH0pOwp9CmF3YWl0IHBnLnNldENvbnRlbnQoYDxzdHlsZT4ke2Nzc308L3N0eWxlPjxkaXYgY2xhc3M9ImJyYW5kIj5SRUFEIEdFT1BPTElUSUNTPC9kaXY+PGRpdiBjbGFzcz0icmVjIj48c3Bhbj4ke0xBQkVMfTwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJiYXIiPiR7c2Vncy5tYXAoKCkgPT4gJzxpIGNsYXNzPSJkb25lIj48L2k+Jykuam9pbigiIil9PGkgY2xhc3M9Im9uIj48L2k+PC9kaXY+PGRpdiBjbGFzcz0iZSI+PGRpdiBjbGFzcz0iaDIiPk5vbiBzb2xvIG5vdGl6aWU6IDxiPmlsIGNvbnRlc3RvIHBlciBjYXBpcmxlLjwvYj48L2Rpdj48ZGl2IGNsYXNzPSJjIj5MSU5LIElOIEJJTzwvZGl2PjxkaXYgY2xhc3M9InMiPkRhc2hib2FyZCBncmF0dWl0YSwgYWNjZXNzbyBjb24gbGEgdHVhIGVtYWlsPC9kaXY+PC9kaXY+YCk7CmF3YWl0IHBnLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4od29yaywgImJnIiwgYGVuZC5wbmdgKSB9KTsKYXdhaXQgYnIuY2xvc2UoKTsgc3J2LmNsb3NlKCk7CgovLyAtLS0tLS0tLS0tIG1vbnRhZ2dpbyAtLS0tLS0tLS0tCmNvbnN0IEVORCA9IDMuNSwgVE9UID0gcGhvbmVTZWMgKyBFTkQ7CmNvbnN0IGR1cnMgPSBzZWdzLm1hcCgocywgaSkgPT4gKChpIDwgTiAtIDEgPyBzZWdzW2kgKyAxXS5mcm9tIDogRikgLSBzLmZyb20pIC8gMzApOwpjb25zdCBpbnB1dHMgPSBbXSwgZmMgPSBbXTsKZHVycy5mb3JFYWNoKChkLCBpKSA9PiBpbnB1dHMucHVzaCgiLWxvb3AiLCAiMSIsICItdCIsIGQudG9GaXhlZCgzKSwgIi1pIiwgcGF0aC5qb2luKHdvcmssICJiZyIsIGAke2l9LnBuZ2ApKSk7CmlucHV0cy5wdXNoKCItbG9vcCIsICIxIiwgIi10IiwgU3RyaW5nKEVORCksICItaSIsIHBhdGguam9pbih3b3JrLCAiYmciLCAiZW5kLnBuZyIpKTsKaW5wdXRzLnB1c2goIi1mcmFtZXJhdGUiLCAiMzAiLCAiLWkiLCBwYXRoLmpvaW4od29yaywgInBoIiwgIiUwNWQuanBnIikpOwppbnB1dHMucHVzaCgiLWkiLCBNVVNJQyk7CmNvbnN0IG5iID0gTiArIDE7CmZjLnB1c2goYCR7QXJyYXkuZnJvbSh7IGxlbmd0aDogbmIgfSwgKF8sIGkpID0+IGBbJHtpfV1gKS5qb2luKCIiKX1jb25jYXQ9bj0ke25ifTp2PTE6YT0wLGZwcz0zMCxmb3JtYXQ9eXV2NDIwcFtiZ3ZdYCk7CmZjLnB1c2goYFske25ifV1zY2FsZT01NTA6MTE5MDpmbGFncz1sYW5jem9zLHNldHB0cz1QVFMtU1RBUlRQVFNbcGhdYCk7CmZjLnB1c2goYFtiZ3ZdW3BoXW92ZXJsYXk9MjY1OjQ2Mjplb2ZfYWN0aW9uPXBhc3Nbdl1gKTsKZmMucHVzaChgWyR7bmIgKyAxfV1hdHJpbT0wOiR7VE9ULnRvRml4ZWQoMil9LGFmYWRlPXQ9b3V0OnN0PSR7KFRPVCAtIDIuNSkudG9GaXhlZCgyKX06ZD0yLjVbYV1gKTsKY29uc3QgciA9IHNwYXduU3luYygiZmZtcGVnIiwgWyItbG9nbGV2ZWwiLCAiZXJyb3IiLCAiLXkiLCAuLi5pbnB1dHMsICItZmlsdGVyX2NvbXBsZXgiLCBmYy5qb2luKCI7IiksICItbWFwIiwgIlt2XSIsICItbWFwIiwgIlthXSIsICItYzp2IiwgImxpYngyNjQiLCAiLXByZXNldCIsICJtZWRpdW0iLCAiLWNyZiIsICIyMiIsICItcGl4X2ZtdCIsICJ5dXY0MjBwIiwgIi1jOmEiLCAiYWFjIiwgIi1iOmEiLCAiMTI4ayIsICItdCIsIFRPVC50b0ZpeGVkKDIpLCAiLW1vdmZsYWdzIiwgIitmYXN0c3RhcnQiLCBvdXRdLCB7IHN0ZGlvOiAiaW5oZXJpdCIgfSk7CmlmIChyLnN0YXR1cyAhPT0gMCkgeyBjb25zb2xlLmxvZygiZmZtcGVnIG5vbiByaXVzY2l0byIpOyBwcm9jZXNzLmV4aXQoMSk7IH0KLy8gZm90b2dyYW1taSBkaSBjb250cm9sbG86IG1ldMOgIGRpIG9nbmkgcGFzc2FnZ2lvIGUgY2hpdXN1cmEKY29uc3Qgb2QgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKG91dCkpOwpjb25zdCBjaGVja3MgPSBzZWdzLm1hcCgocywgaSkgPT4gKHMuZnJvbSArIGR1cnNbaV0gKiAxNSkgLyAzMCkuY29uY2F0KFtUT1QgLSAxLjVdKTsKY2hlY2tzLmZvckVhY2goKHQsIGkpID0+IHNwYXduU3luYygiZmZtcGVnIiwgWyItbG9nbGV2ZWwiLCAiZXJyb3IiLCAiLXkiLCAiLXNzIiwgdC50b0ZpeGVkKDIpLCAiLWkiLCBvdXQsICItZnJhbWVzOnYiLCAiMSIsICItdmYiLCAic2NhbGU9NTQwOi0xIiwgcGF0aC5qb2luKG9kLCBgY2hlY2tfJHtpICsgMX0uanBnYCldKSk7CmNvbnN0IG1iID0gZnMuc3RhdFN5bmMob3V0KS5zaXplIC8gMTA0ODU3NjsKY29uc29sZS5sb2coYG9rOiAke291dH0gwrcgJHtUT1QudG9GaXhlZCgxKX0gcyDCtyAke21iLnRvRml4ZWQoMSl9IE1CIMK3ICR7dXNhdG99IMK3IGRhdGk6ICR7Zm9udGV9IMK3IGNvbnRyb2xsaTogJHtvZH0vY2hlY2tfMS4uJHtjaGVja3MubGVuZ3RofS5qcGdgKTsKaWYgKFRPVCA8IDE1IHx8IFRPVCA+IDQ1KSBjb25zb2xlLmxvZygiQVRURU5aSU9ORTogZHVyYXRhIGZ1b3JpIGRhIDE1LTQ1IHMiKTsKaWYgKG1iID4gMTApIGNvbnNvbGUubG9nKCJBVFRFTlpJT05FOiBmaWxlIHNvcHJhIDEwIE1CIik7Cg==",
  "globo.mjs": "Ly8gZ2xvYm8ubWpzIOKAlCByZWVsIGRlbGxhIGRvbWVuaWNhICJMYSBzZXR0aW1hbmEgaW4gNDAgc2Vjb25kaSI6IHVuIGdsb2JvIGNoZSBydW90YSB2ZXJzbyBpbCBwYWVzZSBkaSBvZ25pIHN0b3JpYQovLyAoY29sb3JhdG8gY29uIGkgbGl2ZWxsaSBkaSB0ZW5zaW9uZSBkaSBSZWFkIEdlb3BvbGl0aWNzKSwgY29uIGV0aWNoZXR0YSBmaXNzYSBpbiBhbHRvLCB0aXRvbG8gZSB0ZXN0byBuZWxsYSB6b25hIHNpY3VyYSBkaSBJbnN0YWdyYW0uCi8vIHVzbzogbm9kZSBnbG9iby5tanMgY2hlY2sgIFNQRUMuanNvbiAgICAgICAgICAgIC0+IGNvbnRyb2xsYSBjYW1waSwgbHVuZ2hlenplLCBkdXJhdGEgZSBjaGUgaWwgdGVzdG8gc3RpYSBuZWxsYSB6b25hIHNpY3VyYQovLyAgICAgIG5vZGUgZ2xvYm8ubWpzIHJlbmRlciBTUEVDLmpzb24gT1VULm1wNCAgICAtPiBzY3JpdmUgaWwgdmlkZW8gKDEwODB4MTkyMCwgMzAgZnBzKSBlIGkgZm90b2dyYW1taSBkaSBjb250cm9sbG8gT1VUX0RJUi9jaGVja19OLmpwZwovLyB2YXJpYWJpbGk6IFJHX01VU0lDIChtcDMgZGVsbGEgbXVzaWNhIG9yaWdpbmFsZSwgb2JibGlnYXRvcmlhIHBlciByZW5kZXIpLCBSR19HRU8gKGdlby5qc29uIGRlbCBzaXRvOyBhbHRyaW1lbnRpIC90bXAvcmdzaXRlL3B1YmxpYy9nZW8uanNvbiksIFJHX0ZPTlRTCi8vIFNQRUM6IHsiZGF0ZSI6IllZWVktTU0tREQiLCJsYWJlbCI6IlJJRVBJTE9HTyBERUxMQSBTRVRUSU1BTkEgwrcgN+KAkzEzIE9UVCIsImxldmVscyI6eyJJUk4iOjUsLi4ufSwKLy8gICAgICAgICJzY2VuZXMiOlt7ImR1ciI6NS41LCJraWNrZXIiOiLigKYiLCJjaGlwIjpbInRwIiwi4oCmIl0sImhlYWQiOiLigKYgKm9ybyog4oCmIiwiYm9keSI6IuKApiIsInNyYyI6IkZvbnRpOiDigKYiLCJjdGEiOiJMSU5LIElOIEJJTyIsCi8vICAgICAgICAgICAgICAgICAgICJnZW8iOnsiY2VudGVyIjpbbG9uLGxhdF0sImhpZ2hsaWdodCI6WyJJU08zIizigKZdLCJwaW4iOltsb24sbGF0XSwiem9vbSI6MS4yNSwic3BpbiI6ZmFsc2V9fV19CmltcG9ydCBmcyBmcm9tICJub2RlOmZzIjsKaW1wb3J0IHBhdGggZnJvbSAibm9kZTpwYXRoIjsKaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAibm9kZTpjaGlsZF9wcm9jZXNzIjsKCmNvbnN0IFttb2RlLCBzcGVjUGF0aCwgb3V0XSA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTsKaWYgKCFbImNoZWNrIiwgInJlbmRlciJdLmluY2x1ZGVzKG1vZGUpIHx8ICFzcGVjUGF0aCB8fCAobW9kZSA9PT0gInJlbmRlciIgJiYgIW91dCkpIHsgY29uc29sZS5sb2coInVzbzogbm9kZSBnbG9iby5tanMgY2hlY2sgU1BFQy5qc29uIHwgbm9kZSBnbG9iby5tanMgcmVuZGVyIFNQRUMuanNvbiBPVVQubXA0Iik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBIT01FID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCAiL3Jvb3QiOwpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3BlY1BhdGgsICJ1dGY4IikpOwpjb25zdCBHRU8gPSBbcHJvY2Vzcy5lbnYuUkdfR0VPLCAiL3RtcC9yZ3NpdGUvcHVibGljL2dlby5qc29uIiwgSE9NRSArICIvaWdraXQvZ2VvLmpzb24iXS5maW5kKChmKSA9PiBmICYmIGZzLmV4aXN0c1N5bmMoZikpOwpjb25zdCBlcnIgPSBbXSwgd2FybiA9IFtdOwpjb25zdCBMID0geyBraWNrZXI6IDM0LCBjaGlwOiAzNiwgaGVhZDogODAsIGJvZHk6IDE1MCwgc3JjOiA4MCwgbGFiZWw6IDQ0IH07CmlmICghL15cZHs0fS1cZHsyfS1cZHsyfSQvLnRlc3Qoc3BlYy5kYXRlIHx8ICIiKSkgZXJyLnB1c2goImRhdGU6IGZvcm1hdG8gWVlZWS1NTS1ERCIpOwppZiAoIXNwZWMubGFiZWwgfHwgc3BlYy5sYWJlbC5sZW5ndGggPiBMLmxhYmVsKSBlcnIucHVzaChgbGFiZWw6IG9iYmxpZ2F0b3JpYSwgbWF4ICR7TC5sYWJlbH0gY2FyYXR0ZXJpYCk7CmlmICghc3BlYy5sZXZlbHMgfHwgdHlwZW9mIHNwZWMubGV2ZWxzICE9PSAib2JqZWN0IikgZXJyLnB1c2goImxldmVsczogbWFuY2FubyBpIGxpdmVsbGkgZGkgdGVuc2lvbmUgZGVpIHBhZXNpIChkYSBjb3VudHJpZXMpIik7CmNvbnN0IHNjID0gc3BlYy5zY2VuZXMgfHwgW107CmlmIChzYy5sZW5ndGggPCA1IHx8IHNjLmxlbmd0aCA+IDkpIGVyci5wdXNoKCJzY2VuZXM6IGRhIDUgYSA5Iik7CmxldCBnZW9JZHMgPSBudWxsOwppZiAoIUdFTykgZXJyLnB1c2goImdlby5qc29uIG5vbiB0cm92YXRvOiBjbG9uYSBpbCByZXBvIGluIC90bXAvcmdzaXRlIG8gaW1wb3N0YSBSR19HRU8iKTsKZWxzZSB7IGNvbnN0IGcgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhHRU8sICJ1dGY4IikpOyBnZW9JZHMgPSBuZXcgU2V0KGcub2JqZWN0cy5jb3VudHJpZXMuZ2VvbWV0cmllcy5tYXAoKHgpID0+IHguaWQpKTsgfQpzYy5mb3JFYWNoKChzLCBpKSA9PiB7CiAgaWYgKCEocy5kdXIgPj0gMy41ICYmIHMuZHVyIDw9IDgpKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dLmR1cjogdHJhIDMsNSBlIDggc2Vjb25kaWApOwogIGlmICghcy5oZWFkKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dLmhlYWQ6IG1hbmNhbnRlYCk7CiAgZm9yIChjb25zdCBrIG9mIFsia2lja2VyIiwgImhlYWQiLCAiYm9keSIsICJzcmMiXSkgaWYgKHNba10gJiYgU3RyaW5nKHNba10pLnJlcGxhY2UoL1wqL2csICIiKS5sZW5ndGggPiBMW2tdKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dLiR7a306ICR7U3RyaW5nKHNba10pLnJlcGxhY2UoL1wqL2csICIiKS5sZW5ndGh9IGNhcmF0dGVyaSwgbWFzc2ltbyAke0xba119YCk7CiAgaWYgKHMuY2hpcCAmJiAoIUFycmF5LmlzQXJyYXkocy5jaGlwKSB8fCBTdHJpbmcocy5jaGlwWzFdIHx8ICIiKS5sZW5ndGggPiBMLmNoaXApKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dLmNoaXA6IFsidHAiLCJ0ZXN0byDiiaQgJHtMLmNoaXB9Il1gKTsKICBjb25zdCBnID0gcy5nZW8gfHwge307CiAgaWYgKCFBcnJheS5pc0FycmF5KGcuY2VudGVyKSB8fCBnLmNlbnRlci5sZW5ndGggIT09IDIpIGVyci5wdXNoKGBzY2VuZXNbJHtpfV0uZ2VvLmNlbnRlcjogW2xvbmdpdHVkaW5lLCBsYXRpdHVkaW5lXWApOwogIGlmIChnLnpvb20gIT0gbnVsbCAmJiAhKGcuem9vbSA+PSAwLjggJiYgZy56b29tIDw9IDEuNykpIGVyci5wdXNoKGBzY2VuZXNbJHtpfV0uZ2VvLnpvb206IHRyYSAwLDggZSAxLDdgKTsKICAoZy5oaWdobGlnaHQgfHwgW10pLmZvckVhY2goKGMpID0+IHsgaWYgKGdlb0lkcyAmJiAhZ2VvSWRzLmhhcyhjKSkgZXJyLnB1c2goYHNjZW5lc1ske2l9XS5nZW8uaGlnaGxpZ2h0OiAke2N9IG5vbiDDqCBuZWxsYSBtYXBwYWApOyB9KTsKICBpZiAoaSA+IDAgJiYgaSA8IHNjLmxlbmd0aCAtIDEgJiYgIShnLmhpZ2hsaWdodCB8fCBbXSkubGVuZ3RoKSB3YXJuLnB1c2goYHNjZW5lc1ske2l9XTogbmVzc3VuIHBhZXNlIGV2aWRlbnppYXRvYCk7Cn0pOwpjb25zdCBUT1QgPSBzYy5yZWR1Y2UoKGEsIHMpID0+IGEgKyAocy5kdXIgfHwgMCksIDApOwppZiAoVE9UIDwgMzQgfHwgVE9UID4gNDgpIGVyci5wdXNoKGBkdXJhdGEgdG90YWxlICR7VE9ULnRvRml4ZWQoMSl9IHM6IGRldmUgc3RhcmUgdHJhIDM0IGUgNDhgKTsKaWYgKHNjLmxlbmd0aCAmJiAhc2Nbc2MubGVuZ3RoIC0gMV0uY3RhKSB3YXJuLnB1c2goInVsdGltYSBzY2VuYSBzZW56YSBjdGEgKGRpIHNvbGl0byBcIkxJTksgSU4gQklPXCIpIik7CgpsZXQgY2hyb21pdW07CmZvciAoY29uc3QgcCBvZiBbInBsYXl3cmlnaHQiLCBwYXRoLmpvaW4oSE9NRSwgImlna2l0L25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyIpLCAiL3RtcC9pZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiLCAiL3RtcC9pZ3Rlc3Qvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIl0pIHsgdHJ5IHsgY2hyb21pdW0gPSAoYXdhaXQgaW1wb3J0KHAuc3RhcnRzV2l0aCgiLyIpID8gImZpbGU6Ly8iICsgcCA6IHApKS5jaHJvbWl1bTsgYnJlYWs7IH0gY2F0Y2ggKGUpIHt9IH0KaWYgKCFjaHJvbWl1bSkgZXJyLnB1c2goIlBsYXl3cmlnaHQgbm9uIHRyb3ZhdG8iKTsKY29uc3QgTk0gPSBbcGF0aC5qb2luKEhPTUUsICJpZ2tpdC9ub2RlX21vZHVsZXMiKSwgIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzIiwgIi90bXAvaWd0ZXN0L25vZGVfbW9kdWxlcyIsICIvaG9tZS9jbGF1ZGUvcnViL25vZGVfbW9kdWxlcyJdLmZpbmQoKGQpID0+IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJkMy1nZW8vZGlzdC9kMy1nZW8ubWluLmpzIikpICYmIGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJ0b3BvanNvbi1jbGllbnQvZGlzdC90b3BvanNvbi1jbGllbnQubWluLmpzIikpKTsKaWYgKCFOTSkgZXJyLnB1c2goImQzLWdlbyAvIHRvcG9qc29uLWNsaWVudCBub24gdHJvdmF0aSBpbiBub2RlX21vZHVsZXMgZGVsIGtpdCIpOwpjb25zdCBGT05UUyA9IFtwcm9jZXNzLmVudi5SR19GT05UUywgSE9NRSArICIvaWdraXQvZm9udHMiLCAiL2hvbWUvY2xhdWRlL2lna2l0L2ZvbnRzIiwgIi90bXAvcmsvZm9udHMiXS5maW5kKChkKSA9PiBkICYmIGZzLmV4aXN0c1N5bmMoZCArICIvaWJtLXBsZXgtc2VyaWYtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiIpICYmIGZzLmV4aXN0c1N5bmMoZCArICIvaWJtLXBsZXgtbW9uby1sYXRpbi01MDAtbm9ybWFsLndvZmYyIikpOwppZiAoIUZPTlRTKSBlcnIucHVzaCgiZm9udCBJQk0gUGxleCBub24gdHJvdmF0aTogZXNlZ3VpIHByaW1hIHJlZWwubWpzIHVuYSB2b2x0YSwgbGkgaW5zdGFsbGEgbHVpIik7CmlmIChlcnIubGVuZ3RoKSB7IGNvbnNvbGUubG9nKCJFUlJPUkk6XG4tICIgKyBlcnIuam9pbigiXG4tICIpKTsgaWYgKHdhcm4ubGVuZ3RoKSBjb25zb2xlLmxvZygiQVZWSVNJOlxuLSAiICsgd2Fybi5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0KCmNvbnN0IGZmID0gKGYsIGZhbSwgdykgPT4gZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oRk9OVFMsIGYpKSA/IGBAZm9udC1mYWNle2ZvbnQtZmFtaWx5Oicke2ZhbX0nO2ZvbnQtd2VpZ2h0OiR7d307c3JjOnVybChkYXRhOmZvbnQvd29mZjI7YmFzZTY0LCR7ZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihGT05UUywgZikpLnRvU3RyaW5nKCJiYXNlNjQiKX0pIGZvcm1hdCgnd29mZjInKX1gIDogIiI7CmNvbnN0IEZPTlRDU1MgPSBmZigiaWJtLXBsZXgtc2VyaWYtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiIsICJQUyIsIDYwMCkgKyBmZigiaWJtLXBsZXgtc2Fucy1sYXRpbi00MDAtbm9ybWFsLndvZmYyIiwgIlBTYSIsIDQwMCkgKyBmZigiaWJtLXBsZXgtc2Fucy1sYXRpbi02MDAtbm9ybWFsLndvZmYyIiwgIlBTYSIsIDYwMCkgKyBmZigiaWJtLXBsZXgtbW9uby1sYXRpbi01MDAtbm9ybWFsLndvZmYyIiwgIlBNIiwgNTAwKTsKY29uc3QgZXNjID0gKHMpID0+IFN0cmluZyhzKS5yZXBsYWNlKC8mL2csICImYW1wOyIpLnJlcGxhY2UoLzwvZywgIiZsdDsiKTsKY29uc3QgaHRtbCA9IGA8c3R5bGU+JHtGT05UQ1NTfWJvZHl7bWFyZ2luOjA7d2lkdGg6MTA4MHB4O2hlaWdodDoxOTIwcHg7YmFja2dyb3VuZDojMEIxMTE3O292ZXJmbG93OmhpZGRlbn0KI3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo4MHB4O3JpZ2h0OjE1MHB4O3RvcDoxMTcwcHh9Lmt7Zm9udDo1MDAgNDRweC8xIFBNO2NvbG9yOiNFOEIwNTA7bGV0dGVyLXNwYWNpbmc6LjA4ZW19LmNoaXB7ZGlzcGxheTppbmxpbmUtYmxvY2s7bWFyZ2luLXRvcDoyMnB4O2ZvbnQ6NTAwIDMycHgvMSBQTTtsZXR0ZXItc3BhY2luZzouMDVlbTtwYWRkaW5nOjE0cHggMjJweDtib3JkZXI6MnB4IHNvbGlkICM2YjU0MjA7Ym9yZGVyLXJhZGl1czo5OTlweDtjb2xvcjojRThCMDUwO2JhY2tncm91bmQ6cmdiYSgyMzIsMTc2LDgwLC4wOCl9Ci5oe21hcmdpbi10b3A6MjZweDtmb250OjYwMCA3MHB4LzEuMSBQUztjb2xvcjojRTRFQUVGfS5oIGJ7Y29sb3I6I0U4QjA1MDtmb250LXdlaWdodDo2MDB9LmJ7bWFyZ2luLXRvcDoyNHB4O2ZvbnQ6NDAwIDM4cHgvMS4zNSBQU2E7Y29sb3I6I0I5QzZEMn0uc3ttYXJnaW4tdG9wOjIycHg7Zm9udDo1MDAgMjRweCBQTTtjb2xvcjojODZCNEVBfQouYnJhbmR7cG9zaXRpb246YWJzb2x1dGU7dG9wOjE1NHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udDo2MDAgNDZweCBQUztjb2xvcjojRTRFQUVGO2xldHRlci1zcGFjaW5nOi4wNGVtfQoucmVje3Bvc2l0aW9uOmFic29sdXRlO3RvcDoyNThweDt3aWR0aDoxMDAlO3RleHQtYWxpZ246Y2VudGVyfS5yZWMgc3BhbntkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjUwMCAzMHB4LzEgUE07bGV0dGVyLXNwYWNpbmc6LjEyZW07Y29sb3I6IzBCMTExNztiYWNrZ3JvdW5kOiNFOEIwNTA7cGFkZGluZzoxMnB4IDI0cHg7Ym9yZGVyLXJhZGl1czo5OTlweH0KLmJhcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MzI2cHg7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSk7ZGlzcGxheTpmbGV4O2dhcDoxMnB4fS5iYXIgaXt3aWR0aDo1NnB4O2hlaWdodDo2cHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZDojMmIzYTQ4fS5iYXIgaS5vbntiYWNrZ3JvdW5kOiNFOEIwNTB9LmJhciBpLmRvbmV7YmFja2dyb3VuZDojODZCNEVBfQouY3Rhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbi10b3A6NDBweDtmb250OjYwMCA0MHB4IFBTYTtjb2xvcjojMEIxMTE3O2JhY2tncm91bmQ6Izg2QjRFQTtwYWRkaW5nOjIwcHggNDBweDtib3JkZXItcmFkaXVzOjk5OXB4fTwvc3R5bGU+CjxjYW52YXMgaWQ9ImMiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjE5MjAiIHN0eWxlPSJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjAiPjwvY2FudmFzPjxkaXYgY2xhc3M9ImJyYW5kIj5SRUFEIEdFT1BPTElUSUNTPC9kaXY+PGRpdiBjbGFzcz0icmVjIj48c3Bhbj4ke2VzYyhzcGVjLmxhYmVsKX08L3NwYW4+PC9kaXY+PGRpdiBpZD0idCI+PC9kaXY+PGRpdiBjbGFzcz0iYmFyIiBpZD0iYmFyIj48L2Rpdj5gOwpjb25zdCBiciA9IGF3YWl0IGNocm9taXVtLmxhdW5jaCh7IGV4ZWN1dGFibGVQYXRoOiBwcm9jZXNzLmVudi5DSFJPTUlVTSB8fCAoZnMuZXhpc3RzU3luYygiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIpID8gIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iIDogdW5kZWZpbmVkKSwgYXJnczogWyItLW5vLXNhbmRib3giXSB9KTsKY29uc3QgcCA9IGF3YWl0IGJyLm5ld1BhZ2UoeyB2aWV3cG9ydDogeyB3aWR0aDogMTA4MCwgaGVpZ2h0OiAxOTIwIH0gfSk7CmF3YWl0IHAuc2V0Q29udGVudChodG1sKTsKZm9yIChjb25zdCBmIG9mIFsiZDMtYXJyYXkvZGlzdC9kMy1hcnJheS5taW4uanMiLCAiZDMtZ2VvL2Rpc3QvZDMtZ2VvLm1pbi5qcyIsICJ0b3BvanNvbi1jbGllbnQvZGlzdC90b3BvanNvbi1jbGllbnQubWluLmpzIl0pIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihOTSwgZikpKSBhd2FpdCBwLmFkZFNjcmlwdFRhZyh7IHBhdGg6IHBhdGguam9pbihOTSwgZikgfSk7CmNvbnN0IGdlbyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKEdFTywgInV0ZjgiKSk7CmF3YWl0IHAuZXZhbHVhdGUoKHsgZ2VvLCBsdiwgc2NlbmVzIH0pID0+IHsKICBjb25zdCBXID0gZDMsIGZlYXRzID0gdG9wb2pzb24uZmVhdHVyZShnZW8sIGdlby5vYmplY3RzLmNvdW50cmllcykuZmVhdHVyZXM7IGNvbnN0IEMgPSBbIiMxRTJBMzMiLCAiIzJBNDU1NSIsICIjNkU1QTI2IiwgIiM5QzVCMjYiLCAiI0IyNEIzMSIsICIjRDg2MDZFIl07CiAgY29uc3QgY3ggPSA1NDAsIGN5ID0gNzU1LCBSID0gNDAwOyBjb25zdCBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYyIpLmdldENvbnRleHQoIjJkIik7CiAgY29uc3QgcHJvaiA9IFcuZ2VvT3J0aG9ncmFwaGljKCkudHJhbnNsYXRlKFtjeCwgY3ldKS5jbGlwQW5nbGUoOTApOyBjb25zdCBwYXRoID0gVy5nZW9QYXRoKHByb2osIGN0eCk7IGNvbnN0IGdyYXQgPSBXLmdlb0dyYXRpY3VsZTEwKCk7CiAgY29uc3QgZWFzZSA9ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IDEgLSBNYXRoLnBvdygtMiAqIHQgKyAyLCAyKSAvIDIpOwogIGNvbnN0IHJpY2ggPSAocykgPT4gU3RyaW5nKHMpLnJlcGxhY2UoLyYvZywgIiZhbXA7IikucmVwbGFjZSgvPC9nLCAiJmx0OyIpLnJlcGxhY2UoL1wqKC4rPylcKi9nLCAiPGI+JDE8L2I+Iik7CiAgY29uc3QgdGcgPSBzY2VuZXMubWFwKChzLCBpKSA9PiB7IGNvbnN0IGcgPSBzLmdlbyB8fCB7fTsgcmV0dXJuIHsgYzogZy5jZW50ZXIsIHI6IGcuaGlnaGxpZ2h0IHx8IFtdLCBwaW46IGcucGluIHx8IG51bGwsIHM6IGcuem9vbSB8fCAxLjIsIHNwaW46IGcuc3BpbiAhPSBudWxsID8gZy5zcGluIDogaSA9PT0gMCB8fCBpID09PSBzY2VuZXMubGVuZ3RoIC0gMSB9OyB9KTsKICBsZXQgc3RhcnRzID0gW10sIGFjYyA9IDA7IHNjZW5lcy5mb3JFYWNoKChzKSA9PiB7IHN0YXJ0cy5wdXNoKGFjYyk7IGFjYyArPSBzLmR1cjsgfSk7IHdpbmRvdy5UT1QgPSBhY2M7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImJhciIpLmlubmVySFRNTCA9IHNjZW5lcy5tYXAoKCkgPT4gIjxpPjwvaT4iKS5qb2luKCIiKTsKICBsZXQgY3VyID0gLTE7CiAgd2luZG93LnNjZW5lVGV4dCA9IChpKSA9PiB7IGNvbnN0IHMgPSBzY2VuZXNbaV07IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0IikuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9ImsiPiR7cmljaChzLmtpY2tlciB8fCAiIil9PC9kaXY+JHtzLmNoaXAgPyBgPGRpdiBjbGFzcz0iY2hpcCI+JHtyaWNoKHMuY2hpcFsxXSl9PC9kaXY+YCA6ICIifTxkaXYgY2xhc3M9ImgiPiR7cmljaChzLmhlYWQpfTwvZGl2PiR7cy5ib2R5ID8gYDxkaXYgY2xhc3M9ImIiPiR7cmljaChzLmJvZHkpfTwvZGl2PmAgOiAiIn0ke3Muc3JjID8gYDxkaXYgY2xhc3M9InMiPiR7cmljaChzLnNyYyl9PC9kaXY+YCA6ICIifSR7cy5jdGEgPyBgPGRpdiBjbGFzcz0iY3RhIj4ke3JpY2gocy5jdGEpfTwvZGl2PmAgOiAiIn1gOyBjb25zdCByID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInQiKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgcmV0dXJuIE1hdGgucm91bmQoci5ib3R0b20pOyB9OwogIHdpbmRvdy5yZW5kZXIgPSAodCkgPT4gewogICAgbGV0IGkgPSBzdGFydHMuZmluZEluZGV4KChzLCBqKSA9PiB0ID49IHMgJiYgKGogPT09IHNjZW5lcy5sZW5ndGggLSAxIHx8IHQgPCBzdGFydHNbaiArIDFdKSk7IGlmIChpIDwgMCkgaSA9IHNjZW5lcy5sZW5ndGggLSAxOyBjb25zdCBsdCA9IHQgLSBzdGFydHNbaV07IGNvbnN0IFQgPSB0Z1tpXSwgUCA9IHRnW01hdGgubWF4KDAsIGkgLSAxKV07CiAgICBjb25zdCBrID0gaSA9PT0gMCA/IDEgOiBNYXRoLm1pbigxLCBsdCAvIDEuMyksIGUgPSBlYXNlKGspOyBsZXQgYyA9IFcuZ2VvSW50ZXJwb2xhdGUoUC5jLCBULmMpKGUpOyBpZiAoVC5zcGluKSBjID0gW2NbMF0gKyBsdCAqIDYsIGNbMV1dOwogICAgY29uc3Qgc2MgPSAoUC5zICsgKFQucyAtIFAucykgKiBlKSAqIFI7IHByb2ouc2NhbGUoc2MpLnJvdGF0ZShbLWNbMF0sIC1jWzFdXSk7CiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIDEwODAsIDE5MjApOyBjb25zdCBnID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGN4LCBjeSAtIDgwLCBSICogMC4yLCBjeCwgY3ksIHNjICogMS4xNSk7IGcuYWRkQ29sb3JTdG9wKDAsICJyZ2JhKDQwLDgwLDEyMCwuMzUpIik7IGcuYWRkQ29sb3JTdG9wKDEsICJyZ2JhKDExLDE3LDIzLDApIik7IGN0eC5maWxsU3R5bGUgPSBnOyBjdHguZmlsbFJlY3QoMCwgMCwgMTA4MCwgMTkyMCk7CiAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgoeyB0eXBlOiAiU3BoZXJlIiB9KTsgY3R4LmZpbGxTdHlsZSA9ICIjMEYxQzI3IjsgY3R4LmZpbGwoKTsgY3R4LnN0cm9rZVN0eWxlID0gIiMyQjQ0NTgiOyBjdHgubGluZVdpZHRoID0gMjsgY3R4LnN0cm9rZSgpOwogICAgY3R4LmJlZ2luUGF0aCgpOyBwYXRoKGdyYXQpOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgxMzQsMTgwLDIzNCwuMDcpIjsgY3R4LmxpbmVXaWR0aCA9IDE7IGN0eC5zdHJva2UoKTsKICAgIGNvbnN0IHB1bHNlID0gMC41NSArIDAuNDUgKiBNYXRoLnNpbihsdCAqIDQpOwogICAgZm9yIChjb25zdCBmIG9mIGZlYXRzKSB7IGNvbnN0IGwgPSBsdltmLmlkXSB8fCAwOyBjb25zdCBvbiA9IFQuci5pbmNsdWRlcyhmLmlkKTsgY3R4LmJlZ2luUGF0aCgpOyBwYXRoKGYpOyBjdHguZmlsbFN0eWxlID0gb24gPyBDW01hdGgubWF4KGwsIDQpXSA6IENbTWF0aC5taW4oNSwgbCldOyBjdHguZ2xvYmFsQWxwaGEgPSBvbiA/IDEgOiBULnIubGVuZ3RoID8gMC41NSA6IDAuOTsgY3R4LmZpbGwoKTsgY3R4Lmdsb2JhbEFscGhhID0gMTsgY3R4LnN0cm9rZVN0eWxlID0gb24gPyBgcmdiYSgyNTUsMjQwLDIxMCwkezAuNSArIDAuNSAqIHB1bHNlICogTWF0aC5taW4oMSwgbHQpfSlgIDogInJnYmEoMTEsMTcsMjMsLjgpIjsgY3R4LmxpbmVXaWR0aCA9IG9uID8gMyA6IDAuODsgY3R4LnN0cm9rZSgpOyB9CiAgICBpZiAoVC5waW4gJiYgbHQgPiAxLjEpIHsgY29uc3QgcSA9IHByb2ooVC5waW4pOyBpZiAocSkgeyBjb25zdCBhID0gTWF0aC5taW4oMSwgKGx0IC0gMS4xKSAvIDAuNCk7IGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhxWzBdLCBxWzFdLCAxMCwgMCwgNyk7IGN0eC5maWxsU3R5bGUgPSAiI0U4QjA1MCI7IGN0eC5nbG9iYWxBbHBoYSA9IGE7IGN0eC5maWxsKCk7IGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhxWzBdLCBxWzFdLCAxMCArICgobHQgKiAzMCkgJSA0MCksIDAsIDcpOyBjdHguc3Ryb2tlU3R5bGUgPSBgcmdiYSgyMzIsMTc2LDgwLCR7YSAqICgxIC0gKChsdCAqIDMwKSAlIDQwKSAvIDQwKX0pYDsgY3R4LmxpbmVXaWR0aCA9IDM7IGN0eC5zdHJva2UoKTsgY3R4Lmdsb2JhbEFscGhhID0gMTsgfSB9CiAgICB7IGNvbnN0IGd0ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIDMwMCk7IGd0LmFkZENvbG9yU3RvcCgwLCAicmdiYSgxMSwxNywyMywxKSIpOyBndC5hZGRDb2xvclN0b3AoMC43LCAicmdiYSgxMSwxNywyMywuOSkiKTsgZ3QuYWRkQ29sb3JTdG9wKDEsICJyZ2JhKDExLDE3LDIzLDApIik7IGN0eC5maWxsU3R5bGUgPSBndDsgY3R4LmZpbGxSZWN0KDAsIDAsIDEwODAsIDMwMCk7IH0KICAgIHsgY29uc3QgZ2IgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgOTUwLCAwLCAxMTAwKTsgZ2IuYWRkQ29sb3JTdG9wKDAsICJyZ2JhKDExLDE3LDIzLDApIik7IGdiLmFkZENvbG9yU3RvcCgxLCAicmdiYSgxMSwxNywyMywxKSIpOyBjdHguZmlsbFN0eWxlID0gZ2I7IGN0eC5maWxsUmVjdCgwLCA5NTAsIDEwODAsIDE1MCk7IGN0eC5maWxsU3R5bGUgPSAiIzBCMTExNyI7IGN0eC5maWxsUmVjdCgwLCAxMTAwLCAxMDgwLCA4MjApOyB9CiAgICBpZiAoaSAhPT0gY3VyKSB7IGN1ciA9IGk7IHdpbmRvdy5zY2VuZVRleHQoaSk7IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjYmFyIGkiKV0uZm9yRWFjaCgoeCwgaikgPT4gKHguY2xhc3NOYW1lID0gaiA8IGkgPyAiZG9uZSIgOiBqID09PSBpID8gIm9uIiA6ICIiKSk7IH0KICAgIGNvbnN0IHR0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInQiKTsgY29uc3QgYSA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIChsdCAtIDAuMjUpIC8gMC40NSkpOyB0dC5zdHlsZS5vcGFjaXR5ID0gYTsgdHQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHsoMSAtIGEpICogMjR9cHgpYDsKICB9Owp9LCB7IGdlbywgbHY6IHNwZWMubGV2ZWxzLCBzY2VuZXM6IHNjIH0pOwovLyB6b25hIHNpY3VyYTogaWwgdGVzdG8gZGkgb2duaSBzY2VuYSBkZXZlIGZpbmlyZSBzb3ByYSAxNjYwIHB4IChzb3R0byBjaSBzb25vIGRpZGFzY2FsaWEgZSBwdWxzYW50aSBkaSBJbnN0YWdyYW0pCmZvciAobGV0IGkgPSAwOyBpIDwgc2MubGVuZ3RoOyBpKyspIHsgY29uc3QgYm90dG9tID0gYXdhaXQgcC5ldmFsdWF0ZSgoaSkgPT4gd2luZG93LnNjZW5lVGV4dChpKSwgaSk7IGlmIChib3R0b20gPiAxNjYwKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dOiBpbCB0ZXN0byBmaW5pc2NlIGEgJHtib3R0b219IHB4LCBvbHRyZSBsYSB6b25hIHNpY3VyYSAoMTY2MCk6IGFjY29yY2lhIGhlYWQgbyBib2R5YCk7IH0KaWYgKG1vZGUgPT09ICJjaGVjayIpIHsgYXdhaXQgYnIuY2xvc2UoKTsgaWYgKGVyci5sZW5ndGgpIHsgY29uc29sZS5sb2coIkVSUk9SSTpcbi0gIiArIGVyci5qb2luKCJcbi0gIikpOyBpZiAod2Fybi5sZW5ndGgpIGNvbnNvbGUubG9nKCJBVlZJU0k6XG4tICIgKyB3YXJuLmpvaW4oIlxuLSAiKSk7IHByb2Nlc3MuZXhpdCgxKTsgfSBjb25zb2xlLmxvZyhgc3BlY2lmaWNhIG9rIMK3ICR7c2MubGVuZ3RofSBzY2VuZSDCtyAke1RPVC50b0ZpeGVkKDEpfSBzYCArICh3YXJuLmxlbmd0aCA/ICJcbkFWVklTSTpcbi0gIiArIHdhcm4uam9pbigiXG4tICIpIDogIiIpKTsgcHJvY2Vzcy5leGl0KDApOyB9CmlmIChlcnIubGVuZ3RoKSB7IGF3YWl0IGJyLmNsb3NlKCk7IGNvbnNvbGUubG9nKCJFUlJPUkk6XG4tICIgKyBlcnIuam9pbigiXG4tICIpKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmNvbnN0IE1VU0lDID0gcHJvY2Vzcy5lbnYuUkdfTVVTSUM7CmlmICghTVVTSUMgfHwgIWZzLmV4aXN0c1N5bmMoTVVTSUMpKSB7IGF3YWl0IGJyLmNsb3NlKCk7IGNvbnNvbGUubG9nKCJtYW5jYSBsYSBtdXNpY2Egb3JpZ2luYWxlOiBpbXBvc3RhIFJHX01VU0lDIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCB3b3JrID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUob3V0KSksICJ3b3JrX2dsb2JvIik7IGZzLnJtU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7IGZzLm1rZGlyU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKY29uc3QgZnBzID0gMzAsIE4gPSBNYXRoLnJvdW5kKFRPVCAqIGZwcyk7CmZvciAobGV0IG4gPSAwOyBuIDwgTjsgbisrKSB7IGF3YWl0IHAuZXZhbHVhdGUoKHQpID0+IHdpbmRvdy5yZW5kZXIodCksIG4gLyBmcHMpOyBhd2FpdCBwLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4od29yaywgU3RyaW5nKG4pLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDg4IH0pOyB9CmF3YWl0IGJyLmNsb3NlKCk7CmNvbnN0IHIgPSBzcGF3blN5bmMoImZmbXBlZyIsIFsiLWxvZ2xldmVsIiwgImVycm9yIiwgIi15IiwgIi1mcmFtZXJhdGUiLCBTdHJpbmcoZnBzKSwgIi1pIiwgcGF0aC5qb2luKHdvcmssICIlMDVkLmpwZyIpLCAiLWkiLCBNVVNJQywgIi1maWx0ZXJfY29tcGxleCIsIGBbMV1hdHJpbT0wOiR7VE9ULnRvRml4ZWQoMil9LGFmYWRlPXQ9b3V0OnN0PSR7KFRPVCAtIDIuNSkudG9GaXhlZCgyKX06ZD0yLjVbYV1gLCAiLW1hcCIsICIwOnYiLCAiLW1hcCIsICJbYV0iLCAiLWM6diIsICJsaWJ4MjY0IiwgIi1wcmVzZXQiLCAibWVkaXVtIiwgIi1jcmYiLCAiMjEiLCAiLXBpeF9mbXQiLCAieXV2NDIwcCIsICItYzphIiwgImFhYyIsICItYjphIiwgIjEyOGsiLCAiLXQiLCBUT1QudG9GaXhlZCgyKSwgIi1tb3ZmbGFncyIsICIrZmFzdHN0YXJ0Iiwgb3V0XSwgeyBzdGRpbzogImluaGVyaXQiIH0pOwppZiAoci5zdGF0dXMgIT09IDApIHsgY29uc29sZS5sb2coImZmbXBlZyBub24gcml1c2NpdG8iKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmNvbnN0IG9kID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShvdXQpKTsgbGV0IGFjYyA9IDA7CnNjLmZvckVhY2goKHMsIGkpID0+IHsgY29uc3QgdCA9IGFjYyArIE1hdGgubWluKHMuZHVyIC0gMC4zLCAyLjIpOyBhY2MgKz0gcy5kdXI7IGZzLmNvcHlGaWxlU3luYyhwYXRoLmpvaW4od29yaywgU3RyaW5nKE1hdGgucm91bmQodCAqIGZwcykpLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCBwYXRoLmpvaW4ob2QsIGBjaGVja18ke2kgKyAxfS5qcGdgKSk7IH0pOwpjb25zdCBtYiA9IGZzLnN0YXRTeW5jKG91dCkuc2l6ZSAvIDEwNDg1NzY7CmNvbnNvbGUubG9nKGBvazogJHtvdXR9IMK3ICR7VE9ULnRvRml4ZWQoMSl9IHMgwrcgJHttYi50b0ZpeGVkKDEpfSBNQiDCtyBjb250cm9sbGk6ICR7b2R9L2NoZWNrXzEuLiR7c2MubGVuZ3RofS5qcGdgKTsKaWYgKG1iID4gMTApIGNvbnNvbGUubG9nKCJBVFRFTlpJT05FOiBmaWxlIHNvcHJhIDEwIE1CIik7Cg==",
  "apertura.mjs": "Ly8gYXBlcnR1cmEubWpzIOKAlCBhcGVydHVyYSBjb2wgZ2xvYm8gKDQgcywgZmlubyBhbCBiZWF0KSBwZXIgaWwgcmVlbCBkZWwgbWFydGVkw6wgIkxhIHN0b3JpYSBpbiA0MCBzZWNvbmRpIiAocmljZXR0YSBDKS4KLy8gSWwgZ2xvYm8gKHN0ZXNzbyBzdGlsZSBlIGNvbG9yaSBkZWwgcmVlbCBkZWxsYSBkb21lbmljYSkgcnVvdGEgZGFsbCdBdGxhbnRpY28gdmVyc28gaWwgcGFlc2UgZGVsbGEgc3RvcmlhLCBwYXJ0b25vIGdsaSBhcmNoaQovLyB2ZXJzbyBnbGkgYWx0cmkgcGFlc2kgY29pbnZvbHRpLCBpbCBwYWVzZSBwdWxzYSBlIHNhbGUgaWwgdGl0b2xvLiBQb2kgaWwgcmVlbCBkaSByZWVsLm1qcyBwcm9zZWd1ZSwgY29uIGxhIG11c2ljYSBvcmlnaW5hbGUKLy8gY2hlIHNjb3JyZSBzZW56YSByaXBhcnRpcmUgcGVyIHR1dHRvIGlsIHZpZGVvLgovLyB1c286IG5vZGUgYXBlcnR1cmEubWpzIGNoZWNrICBTUEVDLmpzb24KLy8gICAgICBub2RlIGFwZXJ0dXJhLm1qcyByZW5kZXIgU1BFQy5qc29uIFJFRUwubXA0IE9VVC5tcDQgICAtPiBPVVQgPSBhcGVydHVyYSArIHJlZWwsIG11c2ljYSBjb250aW51YTsgZm90b2dyYW1taSBkaSBjb250cm9sbG8gT1VUX0RJUi9hcGVydHVyYV9jaGVja19OLmpwZwovLyB2YXJpYWJpbGk6IFJHX01VU0lDIChtcDMgZGVsbGEgbXVzaWNhIG9yaWdpbmFsZSwgb2JibGlnYXRvcmlhIHBlciByZW5kZXIpLCBSR19HRU8gKGdlby5qc29uIGRlbCBzaXRvOyBhbHRyaW1lbnRpIC90bXAvcmdzaXRlL3B1YmxpYy9nZW8uanNvbiksIFJHX0ZPTlRTCi8vIFNQRUM6IHsiZGF0ZSI6IllZWVktTU0tREQiLCJsZXZlbHMiOnsiSVJOIjo1LC4uLn0sImNvdW50cnkiOiJJUk4iLCJsaW5rcyI6WyJVU0EiLCJDSE4iXSwibGFiZWwiOiJJUkFOIiwidGl0bGUiOiJIb3JtdXo6ICpjb3NhIHN0YSBzdWNjZWRlbmRvKiIsCi8vICAgICAgICAiY2VudGVyIjpbbG9uLGxhdF0gKGZhY29sdGF0aXZvOiBhbHRyaW1lbnRpIGlsIGNlbnRybyBkZWwgcGFlc2UpLCAiem9vbSI6MS4zNSAoZmFjb2x0YXRpdm8sIDEsMS0xLDcpfQppbXBvcnQgZnMgZnJvbSAibm9kZTpmcyI7CmltcG9ydCBwYXRoIGZyb20gIm5vZGU6cGF0aCI7CmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gIm5vZGU6Y2hpbGRfcHJvY2VzcyI7Cgpjb25zdCBbbW9kZSwgc3BlY1BhdGgsIHJlZWxJbiwgb3V0XSA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTsKaWYgKCFbImNoZWNrIiwgInJlbmRlciJdLmluY2x1ZGVzKG1vZGUpIHx8ICFzcGVjUGF0aCB8fCAobW9kZSA9PT0gInJlbmRlciIgJiYgKCFyZWVsSW4gfHwgIW91dCkpKSB7IGNvbnNvbGUubG9nKCJ1c286IG5vZGUgYXBlcnR1cmEubWpzIGNoZWNrIFNQRUMuanNvbiB8IG5vZGUgYXBlcnR1cmEubWpzIHJlbmRlciBTUEVDLmpzb24gUkVFTC5tcDQgT1VULm1wNCIpOyBwcm9jZXNzLmV4aXQoMik7IH0KY29uc3QgSE9NRSA9IHByb2Nlc3MuZW52LkhPTUUgfHwgIi9yb290IjsKY29uc3Qgc3BlYyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHNwZWNQYXRoLCAidXRmOCIpKTsKY29uc3QgR0VPID0gW3Byb2Nlc3MuZW52LlJHX0dFTywgIi90bXAvcmdzaXRlL3B1YmxpYy9nZW8uanNvbiIsIEhPTUUgKyAiL2lna2l0L2dlby5qc29uIl0uZmluZCgoZikgPT4gZiAmJiBmcy5leGlzdHNTeW5jKGYpKTsKY29uc3QgZXJyID0gW10sIHdhcm4gPSBbXTsKY29uc3QgRFVSID0gNC4wLCBGUFMgPSAzMDsgLy8gNCwwIHMgZXNhdHRpOiBsYSBtdXNpY2Egb3JpZ2luYWxlIGhhIGwnaW50cm8gZmlubyBhIDQsMCBzIGUgbMOsIHBhcnRlIGlsIGJlYXQsIHF1aW5kaSBpbCByZWVsIGF0dGFjY2Egc3VsIGJlYXQuIElsIHRpdG9sbyByZXN0YSBwaWVubyB+Miw3IHMgZSBmYSBkYSBjb3BlcnRpbmEgKHRodW1iX21zIDM1MDApCmNvbnN0IHBsYWluID0gKHMpID0+IFN0cmluZyhzIHx8ICIiKS5yZXBsYWNlKC9cKi9nLCAiIik7CmlmICghL15cZHs0fS1cZHsyfS1cZHsyfSQvLnRlc3Qoc3BlYy5kYXRlIHx8ICIiKSkgZXJyLnB1c2goImRhdGU6IGZvcm1hdG8gWVlZWS1NTS1ERCIpOwppZiAoIXNwZWMubGV2ZWxzIHx8IHR5cGVvZiBzcGVjLmxldmVscyAhPT0gIm9iamVjdCIpIGVyci5wdXNoKCJsZXZlbHM6IG1hbmNhbm8gaSBsaXZlbGxpIGRpIHRlbnNpb25lIGRlaSBwYWVzaSAoZGEgY291bnRyaWVzKSIpOwppZiAoIS9eW0EtWl17M30kLy50ZXN0KHNwZWMuY291bnRyeSB8fCAiIikpIGVyci5wdXNoKCJjb3VudHJ5OiBJU08zIGRlbCBwYWVzZSBkZWxsYSBzdG9yaWEiKTsKaWYgKCFzcGVjLnRpdGxlIHx8IHBsYWluKHNwZWMudGl0bGUpLmxlbmd0aCA+IDQ0KSBlcnIucHVzaCgidGl0bGU6IG9iYmxpZ2F0b3JpbywgbWFzc2ltbyA0NCBjYXJhdHRlcmkgKMOoIGwnYXJnb21lbnRvLCBub24gaWwgdGl0b2xvIGx1bmdvIGRlbGxhIHByaW1hIHNjZW5hKSIpOwppZiAoc3BlYy5sYWJlbCAmJiBwbGFpbihzcGVjLmxhYmVsKS5sZW5ndGggPiAyNCkgZXJyLnB1c2goImxhYmVsOiBtYXNzaW1vIDI0IGNhcmF0dGVyaSIpOwpjb25zdCBsaW5rcyA9IChzcGVjLmxpbmtzIHx8IFtdKS5zbGljZSgwLCA1KTsKaWYgKChzcGVjLmxpbmtzIHx8IFtdKS5sZW5ndGggPiA1KSB3YXJuLnB1c2goImxpbmtzOiB0ZW51dGkgc29sbyBpIHByaW1pIDUiKTsKaWYgKHNwZWMuem9vbSAhPSBudWxsICYmICEoc3BlYy56b29tID49IDEuMSAmJiBzcGVjLnpvb20gPD0gMS43KSkgZXJyLnB1c2goInpvb206IHRyYSAxLDEgZSAxLDciKTsKbGV0IGdlbyA9IG51bGw7CmlmICghR0VPKSBlcnIucHVzaCgiZ2VvLmpzb24gbm9uIHRyb3ZhdG86IGNsb25hIGlsIHJlcG8gaW4gL3RtcC9yZ3NpdGUgbyBpbXBvc3RhIFJHX0dFTyIpOwplbHNlIHsgZ2VvID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoR0VPLCAidXRmOCIpKTsgY29uc3QgaWRzID0gbmV3IFNldChnZW8ub2JqZWN0cy5jb3VudHJpZXMuZ2VvbWV0cmllcy5tYXAoKHgpID0+IHguaWQpKTsgW3NwZWMuY291bnRyeSwgLi4ubGlua3NdLmZvckVhY2goKGMpID0+IHsgaWYgKGMgJiYgIWlkcy5oYXMoYykpIGVyci5wdXNoKGAke2N9OiBub24gw6ggbmVsbGEgbWFwcGFgKTsgfSk7IH0KbGV0IGNocm9taXVtOwpmb3IgKGNvbnN0IHAgb2YgWyJwbGF5d3JpZ2h0IiwgcGF0aC5qb2luKEhPTUUsICJpZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiKSwgIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIl0pIHsgdHJ5IHsgY2hyb21pdW0gPSAoYXdhaXQgaW1wb3J0KHAuc3RhcnRzV2l0aCgiLyIpID8gImZpbGU6Ly8iICsgcCA6IHApKS5jaHJvbWl1bTsgYnJlYWs7IH0gY2F0Y2ggKGUpIHt9IH0KaWYgKCFjaHJvbWl1bSkgZXJyLnB1c2goIlBsYXl3cmlnaHQgbm9uIHRyb3ZhdG8iKTsKY29uc3QgTk0gPSBbcGF0aC5qb2luKEhPTUUsICJpZ2tpdC9ub2RlX21vZHVsZXMiKSwgIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzIiwgIi90bXAvY2xhdWRlLTAva2l0L25vZGVfbW9kdWxlcyJdLmZpbmQoKGQpID0+IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJkMy1nZW8vZGlzdC9kMy1nZW8ubWluLmpzIikpICYmIGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJ0b3BvanNvbi1jbGllbnQvZGlzdC90b3BvanNvbi1jbGllbnQubWluLmpzIikpKTsKaWYgKCFOTSkgZXJyLnB1c2goImQzLWdlbyAvIHRvcG9qc29uLWNsaWVudCBub24gdHJvdmF0aSBpbiBub2RlX21vZHVsZXMgZGVsIGtpdCIpOwpjb25zdCBGT05UUyA9IFtwcm9jZXNzLmVudi5SR19GT05UUywgSE9NRSArICIvaWdraXQvZm9udHMiLCAiL2hvbWUvY2xhdWRlL2lna2l0L2ZvbnRzIiwgIi90bXAvcmsvZm9udHMiXS5maW5kKChkKSA9PiBkICYmIGZzLmV4aXN0c1N5bmMoZCArICIvaWJtLXBsZXgtc2VyaWYtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiIpICYmIGZzLmV4aXN0c1N5bmMoZCArICIvaWJtLXBsZXgtbW9uby1sYXRpbi01MDAtbm9ybWFsLndvZmYyIikpOwppZiAoIUZPTlRTKSBlcnIucHVzaCgiZm9udCBJQk0gUGxleCBub24gdHJvdmF0aTogZXNlZ3VpIHByaW1hIHJlZWwubWpzIHVuYSB2b2x0YSwgbGkgaW5zdGFsbGEgbHVpIik7CmNvbnN0IGZhaWwgPSAoKSA9PiB7IGNvbnNvbGUubG9nKCJFUlJPUkk6XG4tICIgKyBlcnIuam9pbigiXG4tICIpICsgKHdhcm4ubGVuZ3RoID8gIlxuQVZWSVNJOlxuLSAiICsgd2Fybi5qb2luKCJcbi0gIikgOiAiIikpOyBwcm9jZXNzLmV4aXQoMSk7IH07CmlmIChlcnIubGVuZ3RoKSBmYWlsKCk7Cgpjb25zdCBmZiA9IChmLCBmYW0sIHcpID0+IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKEZPTlRTLCBmKSkgPyBgQGZvbnQtZmFjZXtmb250LWZhbWlseTonJHtmYW19Jztmb250LXdlaWdodDoke3d9O3NyYzp1cmwoZGF0YTpmb250L3dvZmYyO2Jhc2U2NCwke2ZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oRk9OVFMsIGYpKS50b1N0cmluZygiYmFzZTY0Iil9KSBmb3JtYXQoJ3dvZmYyJyl9YCA6ICIiOwpjb25zdCBGT05UQ1NTID0gZmYoImlibS1wbGV4LXNlcmlmLWxhdGluLTYwMC1ub3JtYWwud29mZjIiLCAiUFMiLCA2MDApICsgZmYoImlibS1wbGV4LXNhbnMtbGF0aW4tNDAwLW5vcm1hbC53b2ZmMiIsICJQU2EiLCA0MDApICsgZmYoImlibS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiIsICJQTSIsIDUwMCk7CmNvbnN0IGVzYyA9IChzKSA9PiBTdHJpbmcocykucmVwbGFjZSgvJi9nLCAiJmFtcDsiKS5yZXBsYWNlKC88L2csICImbHQ7Iik7CmNvbnN0IHJpY2ggPSAocykgPT4gZXNjKHMpLnJlcGxhY2UoL1wqKC4rPylcKi9nLCAiPGI+JDE8L2I+Iik7CmNvbnN0IGh0bWwgPSBgPHN0eWxlPiR7Rk9OVENTU31ib2R5e21hcmdpbjowO3dpZHRoOjEwODBweDtoZWlnaHQ6MTkyMHB4O2JhY2tncm91bmQ6IzBCMTExNztvdmVyZmxvdzpoaWRkZW59Ci5icmFuZHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MTU0cHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjtmb250OjYwMCA0NnB4IFBTO2NvbG9yOiNFNEVBRUY7bGV0dGVyLXNwYWNpbmc6LjA0ZW19Ci5yZWN7cG9zaXRpb246YWJzb2x1dGU7dG9wOjI1OHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXJ9LnJlYyBzcGFue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2ZvbnQ6NTAwIDMwcHgvMSBQTTtsZXR0ZXItc3BhY2luZzouMTJlbTtjb2xvcjojMEIxMTE3O2JhY2tncm91bmQ6I0U4QjA1MDtwYWRkaW5nOjEycHggMjRweDtib3JkZXItcmFkaXVzOjk5OXB4fQojbGFie3Bvc2l0aW9uOmFic29sdXRlO2ZvbnQ6NTAwIDM0cHgvMSBQTTtsZXR0ZXItc3BhY2luZzouMTJlbTtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgxMSwxNywyMywuOCk7Ym9yZGVyOjJweCBzb2xpZCAjRThCMDUwO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjEwcHggMTZweDt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTEwMCUpO3doaXRlLXNwYWNlOm5vd3JhcH0KI3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo4MHB4O3JpZ2h0OjkwcHg7dG9wOjEzMDBweH0uaHtmb250OjYwMCAxMDBweC8xLjA2IFBTO2NvbG9yOiNFNEVBRUY7bGV0dGVyLXNwYWNpbmc6LS4wMDVlbX0uaCBie2NvbG9yOiNFOEIwNTA7Zm9udC13ZWlnaHQ6NjAwfS5ze21hcmdpbi10b3A6MjZweDtmb250OjQwMCAzOHB4LzEuMzUgUFNhO2NvbG9yOiNCOUM2RDJ9PC9zdHlsZT4KPGNhbnZhcyBpZD0iYyIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTkyMCIgc3R5bGU9InBvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MCI+PC9jYW52YXM+PGRpdiBjbGFzcz0iYnJhbmQiPlJFQUQgR0VPUE9MSVRJQ1M8L2Rpdj48ZGl2IGNsYXNzPSJyZWMiPjxzcGFuPkxBIFNUT1JJQSBJTiA0MCBTRUNPTkRJPC9zcGFuPjwvZGl2Pgo8ZGl2IGlkPSJsYWIiPiR7ZXNjKHBsYWluKHNwZWMubGFiZWwgfHwgIiIpKX08L2Rpdj48ZGl2IGlkPSJ0Ij48ZGl2IGNsYXNzPSJoIj4ke3JpY2goc3BlYy50aXRsZSl9PC9kaXY+PGRpdiBjbGFzcz0icyI+SSBmYXR0aSwgbGUgcG9zaXppb25pLCBsZSBmb250aS48L2Rpdj48L2Rpdj5gOwpjb25zdCBiciA9IGF3YWl0IGNocm9taXVtLmxhdW5jaCh7IGV4ZWN1dGFibGVQYXRoOiBwcm9jZXNzLmVudi5DSFJPTUlVTSB8fCAoZnMuZXhpc3RzU3luYygiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIpID8gIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iIDogdW5kZWZpbmVkKSwgYXJnczogWyItLW5vLXNhbmRib3giXSB9KTsKY29uc3QgcCA9IGF3YWl0IGJyLm5ld1BhZ2UoeyB2aWV3cG9ydDogeyB3aWR0aDogMTA4MCwgaGVpZ2h0OiAxOTIwIH0gfSk7CmF3YWl0IHAuc2V0Q29udGVudChodG1sKTsKZm9yIChjb25zdCBmIG9mIFsiZDMtYXJyYXkvZGlzdC9kMy1hcnJheS5taW4uanMiLCAiZDMtZ2VvL2Rpc3QvZDMtZ2VvLm1pbi5qcyIsICJ0b3BvanNvbi1jbGllbnQvZGlzdC90b3BvanNvbi1jbGllbnQubWluLmpzIl0pIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihOTSwgZikpKSBhd2FpdCBwLmFkZFNjcmlwdFRhZyh7IHBhdGg6IHBhdGguam9pbihOTSwgZikgfSk7CmF3YWl0IHAuZXZhbHVhdGUoKCkgPT4gZG9jdW1lbnQuZm9udHMucmVhZHkpOwpjb25zdCBpbmZvID0gYXdhaXQgcC5ldmFsdWF0ZSgoeyBnZW8sIGx2LCBzcGVjLCBsaW5rcywgRFVSIH0pID0+IHsKICBjb25zdCBXID0gZDMsIGZlYXRzID0gdG9wb2pzb24uZmVhdHVyZShnZW8sIGdlby5vYmplY3RzLmNvdW50cmllcykuZmVhdHVyZXMsIGJ5SWQgPSB7fTsKICBmZWF0cy5mb3JFYWNoKChmKSA9PiAoYnlJZFtmLmlkXSA9IGYpKTsKICBjb25zdCBDID0gWyIjMUUyQTMzIiwgIiMyQTQ1NTUiLCAiIzZFNUEyNiIsICIjOUM1QjI2IiwgIiNCMjRCMzEiLCAiI0Q4NjA2RSJdOwogIGNvbnN0IGN4ID0gNTQwLCBjeSA9IDg1MCwgUiA9IDQ3MCwgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImMiKS5nZXRDb250ZXh0KCIyZCIpOwogIGNvbnN0IHByb2ogPSBXLmdlb09ydGhvZ3JhcGhpYygpLnRyYW5zbGF0ZShbY3gsIGN5XSkuY2xpcEFuZ2xlKDkwKSwgcGF0aCA9IFcuZ2VvUGF0aChwcm9qLCBjdHgpLCBncmF0ID0gVy5nZW9HcmF0aWN1bGUxMCgpOwogIGNvbnN0IGVhc2UgPSAodCkgPT4gKHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogMSAtIE1hdGgucG93KC0yICogdCArIDIsIDMpIC8gMiksIGNsID0gKHgpID0+IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHgpKSwgc2VnID0gKHQsIGEsIGIpID0+IGNsKCh0IC0gYSkgLyAoYiAtIGEpKTsKICBjb25zdCB0Z3QgPSBzcGVjLmNlbnRlciB8fCBXLmdlb0NlbnRyb2lkKGJ5SWRbc3BlYy5jb3VudHJ5XSk7CiAgY29uc3QgZW5kcyA9IGxpbmtzLm1hcCgoaWQpID0+IFcuZ2VvQ2VudHJvaWQoYnlJZFtpZF0pKTsKICBjb25zdCBzdGFydCA9IFt0Z3RbMF0gLSA3NSwgMjJdLCBaID0gc3BlYy56b29tIHx8IDEuMzU7CiAgY29uc3QgbGFiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImxhYiIpLCB0dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0Iik7CiAgd2luZG93LnJlbmRlciA9ICh0KSA9PiB7CiAgICBjb25zdCBtID0gZWFzZShzZWcodCwgMC4wNSwgMS43KSk7CiAgICBjb25zdCBjID0gVy5nZW9JbnRlcnBvbGF0ZShzdGFydCwgW3RndFswXSwgdGd0WzFdIC0gNl0pKG0pOwogICAgY29uc3Qgc2MgPSBSICogKDAuODIgKyAoWiAtIDAuODIpICogbSk7CiAgICBwcm9qLnNjYWxlKHNjKS5yb3RhdGUoWy1jWzBdLCAtY1sxXV0pOwogICAgY3R4LmNsZWFyUmVjdCgwLCAwLCAxMDgwLCAxOTIwKTsKICAgIGNvbnN0IGcgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoY3gsIGN5IC0gODAsIFIgKiAwLjIsIGN4LCBjeSwgc2MgKiAxLjE1KTsgZy5hZGRDb2xvclN0b3AoMCwgInJnYmEoNDAsODAsMTIwLC4zNSkiKTsgZy5hZGRDb2xvclN0b3AoMSwgInJnYmEoMTEsMTcsMjMsMCkiKTsgY3R4LmZpbGxTdHlsZSA9IGc7IGN0eC5maWxsUmVjdCgwLCAwLCAxMDgwLCAxOTIwKTsKICAgIGN0eC5iZWdpblBhdGgoKTsgcGF0aCh7IHR5cGU6ICJTcGhlcmUiIH0pOyBjdHguZmlsbFN0eWxlID0gIiMwRjFDMjciOyBjdHguZmlsbCgpOyBjdHguc3Ryb2tlU3R5bGUgPSAiIzJCNDQ1OCI7IGN0eC5saW5lV2lkdGggPSAyOyBjdHguc3Ryb2tlKCk7CiAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgoZ3JhdCk7IGN0eC5zdHJva2VTdHlsZSA9ICJyZ2JhKDEzNCwxODAsMjM0LC4wNykiOyBjdHgubGluZVdpZHRoID0gMTsgY3R4LnN0cm9rZSgpOwogICAgY29uc3QgbHQgPSBNYXRoLm1heCgwLCB0IC0gMS40KSwgcHVsc2UgPSAwLjU1ICsgMC40NSAqIE1hdGguc2luKGx0ICogNSk7CiAgICBmb3IgKGNvbnN0IGYgb2YgZmVhdHMpIHsgY29uc3QgbCA9IGx2W2YuaWRdIHx8IDAsIG9uID0gZi5pZCA9PT0gc3BlYy5jb3VudHJ5LCByZWwgPSBsaW5rcy5pbmNsdWRlcyhmLmlkKTsgY3R4LmJlZ2luUGF0aCgpOyBwYXRoKGYpOyBjdHguZmlsbFN0eWxlID0gb24gPyBDW01hdGgubWF4KGwsIDQpXSA6IENbTWF0aC5taW4oNSwgbCldOyBjdHguZ2xvYmFsQWxwaGEgPSBvbiB8fCByZWwgPyAxIDogMC44OyBjdHguZmlsbCgpOyBjdHguZ2xvYmFsQWxwaGEgPSAxOyBjdHguc3Ryb2tlU3R5bGUgPSBvbiA/IGByZ2JhKDI1NSwyNDAsMjEwLCR7MC4zNSArIDAuNjUgKiBwdWxzZSAqIHNlZyh0LCAxLjMsIDEuNyl9KWAgOiAicmdiYSgxMSwxNywyMywuOCkiOyBjdHgubGluZVdpZHRoID0gb24gPyA0IDogMC44OyBjdHguc3Ryb2tlKCk7IH0KICAgIC8vIGFyY2hpIHZlcnNvIGdsaSBhbHRyaSBwYWVzaSBjb2ludm9sdGk6IGNyZXNjb25vIGRhbCBwYWVzZSBkZWxsYSBzdG9yaWEsIHNpIGZlcm1hbm8gYWxsJ29yaXp6b250ZQogICAgZW5kcy5mb3JFYWNoKChlLCBrKSA9PiB7IGNvbnN0IGEgPSBlYXNlKHNlZyh0LCAwLjkgKyBrICogMC4xLCAxLjggKyBrICogMC4xKSk7IGlmIChhIDw9IDApIHJldHVybjsgY29uc3QgaXAgPSBXLmdlb0ludGVycG9sYXRlKHRndCwgZSksIHB0cyA9IFtdOyBmb3IgKGxldCBpID0gMDsgaSA8PSA2NDsgaSsrKSBwdHMucHVzaChpcCgoaSAvIDY0KSAqIGEpKTsKICAgICAgY29uc3QgbG4gPSB7IHR5cGU6ICJMaW5lU3RyaW5nIiwgY29vcmRpbmF0ZXM6IHB0cyB9OwogICAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgobG4pOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgyMzIsMTc2LDgwLC4yOCkiOyBjdHgubGluZVdpZHRoID0gMTI7IGN0eC5saW5lQ2FwID0gInJvdW5kIjsgY3R4LnN0cm9rZSgpOwogICAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgobG4pOyBjdHguc3Ryb2tlU3R5bGUgPSAiI0U4QjA1MCI7IGN0eC5saW5lV2lkdGggPSA0LjU7IGN0eC5zdHJva2UoKTsKICAgICAgaWYgKGEgPj0gMC45OTkpIHsgY29uc3QgcSA9IHByb2ooZSk7IGNvbnN0IHZpcyA9IFcuZ2VvRGlzdGFuY2UoZSwgW2NbMF0sIGNbMV1dKSA8IE1hdGguUEkgLyAyOyBpZiAocSAmJiB2aXMpIHsgY3R4LmJlZ2luUGF0aCgpOyBjdHguYXJjKHFbMF0sIHFbMV0sIDksIDAsIDcpOyBjdHguZmlsbFN0eWxlID0gIiNFOEIwNTAiOyBjdHguZmlsbCgpOyB9IH0gfSk7CiAgICAvLyBpbXB1bHNvIHN1bCBwYWVzZSBkZWxsYSBzdG9yaWEKICAgIGNvbnN0IHEgPSBwcm9qKHRndCk7CiAgICBpZiAocSAmJiB0ID4gMS40KSB7IGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7IGNvbnN0IHBoID0gKCh0IC0gMS40KSAqIDAuOSArIGkgLyAzKSAlIDE7IGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhxWzBdLCBxWzFdLCAxNCArIHBoICogNzAsIDAsIDcpOyBjdHguc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMjU1LDI1NSwkeygxIC0gcGgpICogMC45fSlgOyBjdHgubGluZVdpZHRoID0gNDsgY3R4LnN0cm9rZSgpOyB9IGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhxWzBdLCBxWzFdLCAxMSwgMCwgNyk7IGN0eC5maWxsU3R5bGUgPSAiI2ZmZiI7IGN0eC5maWxsKCk7IH0KICAgIHsgY29uc3QgZ3QgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgMzAwKTsgZ3QuYWRkQ29sb3JTdG9wKDAsICJyZ2JhKDExLDE3LDIzLDEpIik7IGd0LmFkZENvbG9yU3RvcCgwLjcsICJyZ2JhKDExLDE3LDIzLC45KSIpOyBndC5hZGRDb2xvclN0b3AoMSwgInJnYmEoMTEsMTcsMjMsMCkiKTsgY3R4LmZpbGxTdHlsZSA9IGd0OyBjdHguZmlsbFJlY3QoMCwgMCwgMTA4MCwgMzAwKTsgfQogICAgeyBjb25zdCBnYiA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAxMDgwLCAwLCAxMjYwKTsgZ2IuYWRkQ29sb3JTdG9wKDAsICJyZ2JhKDExLDE3LDIzLDApIik7IGdiLmFkZENvbG9yU3RvcCgxLCAicmdiYSgxMSwxNywyMywuOTYpIik7IGN0eC5maWxsU3R5bGUgPSBnYjsgY3R4LmZpbGxSZWN0KDAsIDEwODAsIDEwODAsIDE4MCk7IGN0eC5maWxsU3R5bGUgPSAicmdiYSgxMSwxNywyMywuOTYpIjsgY3R4LmZpbGxSZWN0KDAsIDEyNjAsIDEwODAsIDY2MCk7IH0KICAgIGlmIChxKSB7IGxhYi5zdHlsZS5sZWZ0ID0gcVswXSArICJweCI7IGxhYi5zdHlsZS50b3AgPSBxWzFdIC0gMjYgKyAicHgiOyB9CiAgICBsYWIuc3R5bGUub3BhY2l0eSA9IGxhYi50ZXh0Q29udGVudCA/IHNlZyh0LCAxLjQsIDEuNykgOiAwOwogICAgY29uc3QgaHAgPSBzZWcodCwgMC45LCAxLjMpOyB0dC5zdHlsZS5vcGFjaXR5ID0gaHA7IHR0LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7KDEgLSBocCkgKiAyNH1weClgOwogICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vcGFjaXR5ID0gMTsKICB9OwogIHJldHVybiB7IGJvdHRvbTogTWF0aC5yb3VuZCh0dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20pIH07Cn0sIHsgZ2VvLCBsdjogc3BlYy5sZXZlbHMsIHNwZWMsIGxpbmtzLCBEVVIgfSk7CmlmIChpbmZvLmJvdHRvbSA+IDE2NjApIGVyci5wdXNoKGB0aXRsZTogaWwgdGVzdG8gZmluaXNjZSBhICR7aW5mby5ib3R0b219IHB4LCBvbHRyZSBsYSB6b25hIHNpY3VyYSAoMTY2MCk6IGFjY29yY2lhIGlsIHRpdG9sb2ApOwppZiAobW9kZSA9PT0gImNoZWNrIikgeyBhd2FpdCBici5jbG9zZSgpOyBpZiAoZXJyLmxlbmd0aCkgZmFpbCgpOyBjb25zb2xlLmxvZygic3BlY2lmaWNhIG9rIMK3IGFwZXJ0dXJhICIgKyBEVVIgKyAiIHMiICsgKHdhcm4ubGVuZ3RoID8gIlxuQVZWSVNJOlxuLSAiICsgd2Fybi5qb2luKCJcbi0gIikgOiAiIikpOyBwcm9jZXNzLmV4aXQoMCk7IH0KaWYgKGVyci5sZW5ndGgpIHsgYXdhaXQgYnIuY2xvc2UoKTsgZmFpbCgpOyB9CmNvbnN0IE1VU0lDID0gcHJvY2Vzcy5lbnYuUkdfTVVTSUM7CmlmICghTVVTSUMgfHwgIWZzLmV4aXN0c1N5bmMoTVVTSUMpKSB7IGF3YWl0IGJyLmNsb3NlKCk7IGNvbnNvbGUubG9nKCJtYW5jYSBsYSBtdXNpY2Egb3JpZ2luYWxlOiBpbXBvc3RhIFJHX01VU0lDIik7IHByb2Nlc3MuZXhpdCgyKTsgfQppZiAoIWZzLmV4aXN0c1N5bmMocmVlbEluKSkgeyBhd2FpdCBici5jbG9zZSgpOyBjb25zb2xlLmxvZygicmVlbCBub24gdHJvdmF0bzogIiArIHJlZWxJbik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBvZCA9IHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUob3V0KSksIHdvcmsgPSBwYXRoLmpvaW4ob2QsICJ3b3JrX2FwZXJ0dXJhIik7IGZzLnJtU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7IGZzLm1rZGlyU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKY29uc3QgTiA9IE1hdGgucm91bmQoRFVSICogRlBTKTsKZm9yIChsZXQgbiA9IDA7IG4gPCBOOyBuKyspIHsgYXdhaXQgcC5ldmFsdWF0ZSgodCkgPT4gd2luZG93LnJlbmRlcih0KSwgbiAvIEZQUyk7IGF3YWl0IHAuc2NyZWVuc2hvdCh7IHBhdGg6IHBhdGguam9pbih3b3JrLCBTdHJpbmcobikucGFkU3RhcnQoNSwgIjAiKSArICIuanBnIiksIHR5cGU6ICJqcGVnIiwgcXVhbGl0eTogOTAgfSk7IH0KYXdhaXQgYnIuY2xvc2UoKTsKWzAuNSwgMS41LCAzLjVdLmZvckVhY2goKHQsIGkpID0+IGZzLmNvcHlGaWxlU3luYyhwYXRoLmpvaW4od29yaywgU3RyaW5nKE1hdGgucm91bmQodCAqIEZQUykpLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCBwYXRoLmpvaW4ob2QsIGBhcGVydHVyYV9jaGVja18ke2kgKyAxfS5qcGdgKSkpOwpjb25zdCBwcm9iZSA9IHNwYXduU3luYygiZmZwcm9iZSIsIFsiLXYiLCAiZXJyb3IiLCAiLXNob3dfZW50cmllcyIsICJmb3JtYXQ9ZHVyYXRpb24iLCAiLW9mIiwgImRlZmF1bHQ9bnc9MTpuaz0xIiwgcmVlbEluXSwgeyBlbmNvZGluZzogInV0ZjgiIH0pOwpjb25zdCBSRCA9IHBhcnNlRmxvYXQocHJvYmUuc3Rkb3V0KTsgaWYgKCEoUkQgPiA1KSkgeyBjb25zb2xlLmxvZygiZHVyYXRhIGRlbCByZWVsIG5vbiBsZWdnaWJpbGUiKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmNvbnN0IFNLSVAgPSAwLjU7IC8vIGkgcHJpbWkgMCw1IHMgZGVsIHJlZWwgc29ubyBsYSBkaXNzb2x2ZW56YSBkJ2luZ3Jlc3NvIGRlbCB0ZXN0bzogc2kgdGFnbGlhbm8sIGNvc8OsIHN1bCBiZWF0IGlsIHRpdG9sbyBkZWxsYSBwcmltYSBzY2VuYSDDqCBnacOgIGluIGFycml2bwpjb25zdCBUT1QgPSBEVVIgKyBSRCAtIFNLSVA7CmNvbnN0IG1wID0gc3Bhd25TeW5jKCJmZnByb2JlIiwgWyItdiIsICJlcnJvciIsICItc2hvd19lbnRyaWVzIiwgImZvcm1hdD1kdXJhdGlvbiIsICItb2YiLCAiZGVmYXVsdD1udz0xOm5rPTEiLCBNVVNJQ10sIHsgZW5jb2Rpbmc6ICJ1dGY4IiB9KTsKY29uc3QgTUQgPSBwYXJzZUZsb2F0KG1wLnN0ZG91dCk7CmlmIChNRCA+IDAgJiYgVE9UID4gTUQgLSAwLjIpIHsgY29uc29sZS5sb2coYEVSUk9SSTpcbi0gYXBlcnR1cmEgKyByZWVsID0gJHtUT1QudG9GaXhlZCgxKX0gcywgcGnDuSBsdW5nYSBkZWxsYSBtdXNpY2EgKCR7TUQudG9GaXhlZCgxKX0gcyk6IGdlbmVyYSBpbCByZWVsIHBpw7kgY29ydG8gKDM0LTQwIHMpIGUgcmlmYWlgKTsgcHJvY2Vzcy5leGl0KDEpOyB9Ci8vIHZpZGVvOiBhcGVydHVyYSArIHZpZGVvIGRlbCByZWVsIChsJ2F1ZGlvIGRlbCByZWVsIHNpIHNjYXJ0YSk7IGF1ZGlvOiBtdXNpY2Egb3JpZ2luYWxlIGRhIGNhcG8gcGVyIHR1dHRhIGxhIGR1cmF0YSwgZGlzc29sdmVuemEgZmluYWxlCmNvbnN0IHIgPSBzcGF3blN5bmMoImZmbXBlZyIsIFsiLWxvZ2xldmVsIiwgImVycm9yIiwgIi15IiwgIi1mcmFtZXJhdGUiLCBTdHJpbmcoRlBTKSwgIi1pIiwgcGF0aC5qb2luKHdvcmssICIlMDVkLmpwZyIpLCAiLWkiLCByZWVsSW4sICItaSIsIE1VU0lDLAogICItZmlsdGVyX2NvbXBsZXgiLCBgWzA6dl1zY2FsZT0xMDgwOjE5MjAsc2V0c2FyPTEsZnBzPSR7RlBTfSxmb3JtYXQ9eXV2NDIwcFthXTtbMTp2XXRyaW09c3RhcnQ9JHtTS0lQfSxzZXRwdHM9UFRTLVNUQVJUUFRTLHNjYWxlPTEwODA6MTkyMCxzZXRzYXI9MSxmcHM9JHtGUFN9LGZvcm1hdD15dXY0MjBwW2JdO1thXVtiXWNvbmNhdD1uPTI6dj0xOmE9MFt2XTtbMjphXWF0cmltPTA6JHtUT1QudG9GaXhlZCgyKX0sYWZhZGU9dD1vdXQ6c3Q9JHsoVE9UIC0gMi41KS50b0ZpeGVkKDIpfTpkPTIuNVttXWAsCiAgIi1tYXAiLCAiW3ZdIiwgIi1tYXAiLCAiW21dIiwgIi1jOnYiLCAibGlieDI2NCIsICItcHJlc2V0IiwgIm1lZGl1bSIsICItY3JmIiwgIjIxIiwgIi1waXhfZm10IiwgInl1djQyMHAiLCAiLWM6YSIsICJhYWMiLCAiLWI6YSIsICIxMjhrIiwgIi10IiwgVE9ULnRvRml4ZWQoMiksICItbW92ZmxhZ3MiLCAiK2Zhc3RzdGFydCIsIG91dF0sIHsgc3RkaW86ICJpbmhlcml0IiB9KTsKaWYgKHIuc3RhdHVzICE9PSAwKSB7IGNvbnNvbGUubG9nKCJmZm1wZWcgbm9uIHJpdXNjaXRvIik7IHByb2Nlc3MuZXhpdCgxKTsgfQpjb25zdCBtYiA9IGZzLnN0YXRTeW5jKG91dCkuc2l6ZSAvIDEwNDg1NzY7CmNvbnNvbGUubG9nKGBvazogJHtvdXR9IMK3ICR7VE9ULnRvRml4ZWQoMSl9IHMgKGFwZXJ0dXJhICR7RFVSfSBzICsgcmVlbCAkeyhSRCAtIFNLSVApLnRvRml4ZWQoMSl9IHMpIMK3ICR7bWIudG9GaXhlZCgxKX0gTUIgwrcgY29udHJvbGxpOiAke29kfS9hcGVydHVyYV9jaGVja18xLi4zLmpwZ2ApOwppZiAobWIgPiAxMCkgY29uc29sZS5sb2coIkFUVEVOWklPTkU6IGZpbGUgc29wcmEgMTAgTUIiKTsK",
  "spiegato.mjs": "Ly8gc3BpZWdhdG8ubWpzIOKAlCByZWVsIMKrU3BpZWdhdG8gaW4gNDAgc2Vjb25kacK7OiB1biB0ZW1hIGNhbGRvIHNwaWVnYXRvIGluIDYtNyBzY2VuZSAoY29wZXJ0aW5hIGdyYW5kZSwgbWFwcGEgcmVnaW9uYWxlCi8vIHNjaGVtYXRpY2EsIG51bWVyaSwgZGF0ZSBhIGNvbmZyb250bywgY2hpdXN1cmEpLCB0YWdsaSBzdWwgYmF0dGl0byBkZWxsYSBtdXNpY2Egb3JpZ2luYWxlIChiYXR0dXRhID0gMiBzLCB0YWdsaSBzdSBzZWNvbmRpIHBhcmkpLgovLyB1c286IG5vZGUgc3BpZWdhdG8ubWpzIGNoZWNrIFNQRUMuanNvbiB8IG5vZGUgc3BpZWdhdG8ubWpzIHJlbmRlciBTUEVDLmpzb24gT1VULm1wNAovLyB2YXJpYWJpbGk6IFJHX01VU0lDIChtdXNpY2Egb3JpZ2luYWxlOiBpbCBmaWxlIGRhIDE1IHMgdmllbmUgYWxsdW5nYXRvIGRhIHNvbG8gc3VsIGJhdHRpdG87IHVuIGZpbGUgcGnDuSBsdW5nbyB2aWVuZSB0YWdsaWF0byksIFJHX0dFTywgUkdfRk9OVFMKLy8gc2NlbmU6IGNvdmVyIChkb21hbmRhIGdyYW5kZSBzdWwgZ2xvYm8pLCBtYXAgKG1hcHBhIHJlZ2lvbmFsZSBzY2hlbWF0aWNhOiBzZXJ2ZSAibWFwIiBuZWxsYSBTUEVDKSwgZ2xvYmUgKGdsb2JvIGNvbWUgbmVsIHJlZWwgZGVsbGEgZG9tZW5pY2E6IGdlbyB7Y2VudGVyLGhpZ2hsaWdodCxwaW4sem9vbX0pLCBkYXRlcyAoZHVlIGRhdGUgYSBjb25mcm9udG8pLCBlbmQgKGNoaXVzdXJhIGFsIGNlbnRybykKLy8gU1BFQzogeyJsYWJlbCI6IlNQSUVHQVRPIElOIDQwIFNFQ09OREkiLCJsZXZlbHMiOntJU08zOm59LAovLyAgIm1hcCI6eyJiYm94IjpbW2xvblcsbGF0U10sW2xvbkUsbGF0Tl1dLCJyaXZlciI6W1tsb24sbGF0XSwuLi5dLCJzaWRlcyI6WyJzb3ByYSBpbCBmaXVtZSIsInNvdHRvIGlsIGZpdW1lIl0sInBsYWNlcyI6W3sibmFtZSIsImxsIjpbbG9uLGxhdF0sIm1haW4iOnRydWUsIm5vdGUifV0sImttIjp7ImEiOjAsImIiOjEsInRleHQiOiI5IGttIn0sImxvY2F0b3IiOnsiY2VudGVyIjpbbG9uLGxhdF0sImhpZ2hsaWdodCI6WyJJU08zIl19LCJub3RlIjoiTWFwcGEgc2NoZW1hdGljYSJ9LAovLyAgInNjZW5lcyI6W3sidHlwZSI6ImNvdmVyInwibWFwInwiZ2xvYmUifCJkYXRlcyJ8ImVuZCIgKGVuZDogYW5jaGUgInRnIjogcmlnYSBzdWwgY2FuYWxlIFRlbGVncmFtKSwiZHVyIjpzZWNvbmRpIHBhcmksImtpY2tlciIsImhlYWQiLCJib2R5Iiwic3JjIiwic3RhdCI6eyJuIiwidCJ9LCJiYWRnZSIsImRhdGVzIjpbeyJkIiwic3ViIiwid2hvIn0se+KApn1dfV19CmltcG9ydCBmcyBmcm9tICJub2RlOmZzIjsKaW1wb3J0IHBhdGggZnJvbSAibm9kZTpwYXRoIjsKaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAibm9kZTpjaGlsZF9wcm9jZXNzIjsKCmNvbnN0IFttb2RlLCBzcGVjUGF0aCwgb3V0XSA9IHByb2Nlc3MuYXJndi5zbGljZSgyKTsKaWYgKCFbImNoZWNrIiwgInJlbmRlciJdLmluY2x1ZGVzKG1vZGUpIHx8ICFzcGVjUGF0aCB8fCAobW9kZSA9PT0gInJlbmRlciIgJiYgIW91dCkpIHsgY29uc29sZS5sb2coInVzbzogbm9kZSBzcGllZ2F0by5tanMgY2hlY2sgU1BFQy5qc29uIHwgcmVuZGVyIFNQRUMuanNvbiBPVVQubXA0Iik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBIT01FID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCAiL3Jvb3QiOwpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3BlY1BhdGgsICJ1dGY4IikpOwpjb25zdCBHRU8gPSBbcHJvY2Vzcy5lbnYuUkdfR0VPLCAiL3RtcC9yZ3NpdGUvcHVibGljL2dlby5qc29uIiwgSE9NRSArICIvaWdraXQvZ2VvLmpzb24iXS5maW5kKChmKSA9PiBmICYmIGZzLmV4aXN0c1N5bmMoZikpOwpjb25zdCBOTSA9IFtwYXRoLmpvaW4oSE9NRSwgImlna2l0L25vZGVfbW9kdWxlcyIpLCAiL3RtcC9pZ2tpdC9ub2RlX21vZHVsZXMiLCAiL2hvbWUvY2xhdWRlL2lna2l0L25vZGVfbW9kdWxlcyJdLmZpbmQoKGQpID0+IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJkMy1nZW8vZGlzdC9kMy1nZW8ubWluLmpzIikpICYmIGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGQsICJ0b3BvanNvbi1jbGllbnQvZGlzdC90b3BvanNvbi1jbGllbnQubWluLmpzIikpKTsKY29uc3QgRk9OVFMgPSBbcHJvY2Vzcy5lbnYuUkdfRk9OVFMsIEhPTUUgKyAiL2lna2l0L2ZvbnRzIiwgIi9ob21lL2NsYXVkZS9pZ2tpdC9mb250cyJdLmZpbmQoKGQpID0+IGQgJiYgZnMuZXhpc3RzU3luYyhkICsgIi9pYm0tcGxleC1zZXJpZi1sYXRpbi02MDAtbm9ybWFsLndvZmYyIikpOwpjb25zdCBlcnIgPSBbXTsKY29uc3Qgc2MgPSBzcGVjLnNjZW5lcyB8fCBbXTsKaWYgKCFHRU8gfHwgIU5NIHx8ICFGT05UUykgZXJyLnB1c2goIm1hbmNhbm8gZ2VvLmpzb24sIGQzIG8gaSBmb250Iik7CmlmIChzYy5sZW5ndGggPCA1IHx8IHNjLmxlbmd0aCA+IDgpIGVyci5wdXNoKCJzY2VuZXM6IGRhIDUgYSA4Iik7CnNjLmZvckVhY2goKHMsIGkpID0+IHsKICBpZiAoIShzLmR1ciA+PSAyICYmIHMuZHVyIDw9IDEwKSkgZXJyLnB1c2goYHNjZW5lc1ske2l9XS5kdXI6IHRyYSAyIGUgMTAgc2ApOwogIGlmICghWyJjb3ZlciIsICJtYXAiLCAiZ2xvYmUiLCAiZGF0ZXMiLCAiZW5kIl0uaW5jbHVkZXMocy50eXBlKSkgZXJyLnB1c2goYHNjZW5lc1ske2l9XS50eXBlOiBjb3ZlciB8IG1hcCB8IGdsb2JlIHwgZGF0ZXMgfCBlbmRgKTsKICBpZiAocy50eXBlICE9PSAiZW5kIiAmJiAhcy5oZWFkKSBlcnIucHVzaChgc2NlbmVzWyR7aX1dLmhlYWQgbWFuY2FudGVgKTsKICBpZiAocy50eXBlID09PSAibWFwIiAmJiAhc3BlYy5tYXApIGVyci5wdXNoKGBzY2VuZXNbJHtpfV06IHNjZW5hICJtYXAiIHNlbnphICJtYXAiIG5lbGxhIHNwZWNpZmljYSAodXNhICJnbG9iZSIgc2Ugbm9uIGhhaSBsdW9naGkgdmVyaWZpY2F0aSlgKTsKICBpZiAocy50eXBlID09PSAiZGF0ZXMiICYmICEoQXJyYXkuaXNBcnJheShzLmRhdGVzKSAmJiBzLmRhdGVzLmxlbmd0aCA9PT0gMikpIGVyci5wdXNoKGBzY2VuZXNbJHtpfV0uZGF0ZXM6IHNlcnZvbm8gZHVlIGRhdGVgKTsKICBpZiAocy50eXBlID09PSAiZ2xvYmUiICYmICEocy5nZW8gJiYgQXJyYXkuaXNBcnJheShzLmdlby5jZW50ZXIpKSkgZXJyLnB1c2goYHNjZW5lc1ske2l9XS5nZW8uY2VudGVyIG1hbmNhbnRlYCk7CiAgaWYgKGkgPT09IDAgJiYgcy50eXBlICE9PSAiY292ZXIiKSBlcnIucHVzaCgibGEgcHJpbWEgc2NlbmEgZGV2ZSBlc3NlcmUgY292ZXIiKTsKICBpZiAoaSA9PT0gc2MubGVuZ3RoIC0gMSAmJiBzLnR5cGUgIT09ICJlbmQiKSBlcnIucHVzaCgibCd1bHRpbWEgc2NlbmEgZGV2ZSBlc3NlcmUgZW5kIik7Cn0pOwpsZXQgYWNjMCA9IDA7IHNjLnNsaWNlKDAsIC0xKS5mb3JFYWNoKChzLCBpKSA9PiB7IGFjYzAgKz0gcy5kdXI7IGlmIChNYXRoLmFicyhhY2MwIC8gMiAtIE1hdGgucm91bmQoYWNjMCAvIDIpKSA+IDFlLTYpIGVyci5wdXNoKGBzY2VuZXNbJHtpfV06IGlsIHRhZ2xpbyBjYWRlIGEgJHthY2MwfSBzLCBub24gc3VsIGJhdHRpdG8gKHVzYSBzZWNvbmRpIHBhcmkpYCk7IH0pOwpjb25zdCBUT1QgPSBzYy5yZWR1Y2UoKGEsIHMpID0+IGEgKyBzLmR1ciwgMCk7CmlmICghWzMxLCAzNSwgMzksIDQzLCA0N10uaW5jbHVkZXMoVE9UKSkgZXJyLnB1c2goYGR1cmF0YSB0b3RhbGUgJHtUT1R9IHM6IGRldmUgZXNzZXJlIDMxLCAzNSwgMzksIDQzIG8gNDcgcyAobGEgbXVzaWNhIHNpIGFsbHVuZ2EgYSBibG9jY2hpIGRpIDQgcyBlIGlsIGZpbmFsZSBkZXZlIGNhZGVyZSBzdWxsYSBmaW5lKWApOwoKbGV0IGNocm9taXVtOwpmb3IgKGNvbnN0IHAgb2YgWyJwbGF5d3JpZ2h0IiwgcGF0aC5qb2luKEhPTUUsICJpZ2tpdC9ub2RlX21vZHVsZXMvcGxheXdyaWdodC9pbmRleC5tanMiKSwgIi90bXAvaWdraXQvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIiwgIi9ob21lL2NsYXVkZS9raXQvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIl0pIHsgdHJ5IHsgY2hyb21pdW0gPSAoYXdhaXQgaW1wb3J0KHAuc3RhcnRzV2l0aCgiLyIpID8gImZpbGU6Ly8iICsgcCA6IHApKS5jaHJvbWl1bTsgYnJlYWs7IH0gY2F0Y2ggKGUpIHt9IH0KaWYgKCFjaHJvbWl1bSkgeyBjb25zb2xlLmxvZygiRVJST1JJOlxuLSBQbGF5d3JpZ2h0IG5vbiB0cm92YXRvIik7IHByb2Nlc3MuZXhpdCgxKTsgfQpjb25zdCBmZiA9IChmLCBmYW0sIHcpID0+IGBAZm9udC1mYWNle2ZvbnQtZmFtaWx5Oicke2ZhbX0nO2ZvbnQtd2VpZ2h0OiR7d307c3JjOnVybChkYXRhOmZvbnQvd29mZjI7YmFzZTY0LCR7ZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihGT05UUywgZikpLnRvU3RyaW5nKCJiYXNlNjQiKX0pIGZvcm1hdCgnd29mZjInKX1gOwpjb25zdCBGT05UQ1NTID0gZmYoImlibS1wbGV4LXNlcmlmLWxhdGluLTYwMC1ub3JtYWwud29mZjIiLCAiUFMiLCA2MDApICsgZmYoImlibS1wbGV4LXNhbnMtbGF0aW4tNDAwLW5vcm1hbC53b2ZmMiIsICJQU2EiLCA0MDApICsgZmYoImlibS1wbGV4LXNhbnMtbGF0aW4tNjAwLW5vcm1hbC53b2ZmMiIsICJQU2EiLCA2MDApICsgZmYoImlibS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiIsICJQTSIsIDUwMCk7CmNvbnN0IGVzYyA9IChzKSA9PiBTdHJpbmcocykucmVwbGFjZSgvJi9nLCAiJmFtcDsiKS5yZXBsYWNlKC88L2csICImbHQ7Iik7CmNvbnN0IGh0bWwgPSBgPHN0eWxlPiR7Rk9OVENTU31ib2R5e21hcmdpbjowO3dpZHRoOjEwODBweDtoZWlnaHQ6MTkyMHB4O2JhY2tncm91bmQ6IzBCMTExNztvdmVyZmxvdzpoaWRkZW47Y29sb3I6I0U0RUFFRn0KI3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo4MHB4O3JpZ2h0OjExMHB4O3RvcDoxMDgwcHh9Lmt7Zm9udDo1MDAgNDBweC8xIFBNO2NvbG9yOiNFOEIwNTA7bGV0dGVyLXNwYWNpbmc6LjA4ZW19Ci5oe21hcmdpbi10b3A6MjRweDtmb250OjYwMCA3MHB4LzEuMSBQU30uaCBie2NvbG9yOiNFOEIwNTA7Zm9udC13ZWlnaHQ6NjAwfS5ie21hcmdpbi10b3A6MjJweDtmb250OjQwMCAzOHB4LzEuMzUgUFNhO2NvbG9yOiNCOUM2RDJ9LnN7bWFyZ2luLXRvcDoyMHB4O2ZvbnQ6NTAwIDI0cHggUE07Y29sb3I6Izg2QjRFQX0KI3QuY292ZXJ7dG9wOjEwMDBweDtsZWZ0OjcwcHg7cmlnaHQ6NzBweH0jdC5jb3ZlciAua3tmb250LXNpemU6MzhweH0jdC5jb3ZlciAuaHtmb250LXNpemU6MTE2cHg7bGluZS1oZWlnaHQ6MS4wMjttYXJnaW4tdG9wOjI4cHh9I3QuY292ZXIgLmJ7Zm9udC1zaXplOjQycHg7bWFyZ2luLXRvcDozMHB4O2NvbG9yOiNDOUQ0REV9CiN0LmVuZHt0b3A6YXV0bztib3R0b206YXV0bztsZWZ0OjcwcHg7cmlnaHQ6NzBweDt0b3A6ODIwcHg7dGV4dC1hbGlnbjpjZW50ZXJ9I3QuZW5kIC5oe2ZvbnQtc2l6ZTo5MnB4fSN0LmVuZCAuYntmb250LXNpemU6NDBweH0KLmJyYW5ke3Bvc2l0aW9uOmFic29sdXRlO3RvcDo2NHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udDo2MDAgNDZweCBQUztsZXR0ZXItc3BhY2luZzouMDRlbX0KLnJlY3twb3NpdGlvbjphYnNvbHV0ZTt0b3A6MTY4cHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcn0ucmVjIHNwYW57ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udDo1MDAgMzBweC8xIFBNO2xldHRlci1zcGFjaW5nOi4xMmVtO2NvbG9yOiMwQjExMTc7YmFja2dyb3VuZDojRThCMDUwO3BhZGRpbmc6MTJweCAyNHB4O2JvcmRlci1yYWRpdXM6OTlweH0KLmJhcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjM2cHg7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSk7ZGlzcGxheTpmbGV4O2dhcDoxMnB4fS5iYXIgaXt3aWR0aDo1NnB4O2hlaWdodDo2cHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZDojMmIzYTQ4fS5iYXIgaS5vbntiYWNrZ3JvdW5kOiNFOEIwNTB9LmJhciBpLmRvbmV7YmFja2dyb3VuZDojODZCNEVBfQoudGdse21hcmdpbi10b3A6MzZweDtmb250OjUwMCAzMHB4LzEuNCBQTTtjb2xvcjojODZCNEVBO2xldHRlci1zcGFjaW5nOi4wM2VtfS50Z2wgYntjb2xvcjojRThCMDUwO2ZvbnQtd2VpZ2h0OjUwMH0uY3Rhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbi10b3A6NDRweDtmb250OjYwMCA0MHB4IFBTYTtjb2xvcjojMEIxMTE3O2JhY2tncm91bmQ6Izg2QjRFQTtwYWRkaW5nOjIwcHggNDBweDtib3JkZXItcmFkaXVzOjk5OXB4fTwvc3R5bGU+CjxjYW52YXMgaWQ9ImMiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjE5MjAiIHN0eWxlPSJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjAiPjwvY2FudmFzPjxkaXYgY2xhc3M9ImJyYW5kIj5SRUFEIEdFT1BPTElUSUNTPC9kaXY+PGRpdiBjbGFzcz0icmVjIj48c3Bhbj4ke2VzYyhzcGVjLmxhYmVsIHx8ICJTUElFR0FUTyBJTiA0MCBTRUNPTkRJIil9PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImJhciIgaWQ9ImJhciI+PC9kaXY+PGRpdiBpZD0idCI+PC9kaXY+YDsKY29uc3QgYnIgPSBhd2FpdCBjaHJvbWl1bS5sYXVuY2goeyBleGVjdXRhYmxlUGF0aDogcHJvY2Vzcy5lbnYuQ0hST01JVU0gfHwgKGZzLmV4aXN0c1N5bmMoIi9vcHQvcHctYnJvd3NlcnMvY2hyb21pdW0iKSA/ICIvb3B0L3B3LWJyb3dzZXJzL2Nocm9taXVtIiA6IHVuZGVmaW5lZCksIGFyZ3M6IFsiLS1uby1zYW5kYm94Il0gfSk7CmNvbnN0IHAgPSBhd2FpdCBici5uZXdQYWdlKHsgdmlld3BvcnQ6IHsgd2lkdGg6IDEwODAsIGhlaWdodDogMTkyMCB9IH0pOwphd2FpdCBwLnNldENvbnRlbnQoaHRtbCk7CmZvciAoY29uc3QgZiBvZiBbImQzLWFycmF5L2Rpc3QvZDMtYXJyYXkubWluLmpzIiwgImQzLWdlby9kaXN0L2QzLWdlby5taW4uanMiLCAidG9wb2pzb24tY2xpZW50L2Rpc3QvdG9wb2pzb24tY2xpZW50Lm1pbi5qcyJdKSBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oTk0sIGYpKSkgYXdhaXQgcC5hZGRTY3JpcHRUYWcoeyBwYXRoOiBwYXRoLmpvaW4oTk0sIGYpIH0pOwphd2FpdCBwLmV2YWx1YXRlKGFzeW5jICgpID0+IHsgYXdhaXQgZG9jdW1lbnQuZm9udHMucmVhZHk7IH0pOwpjb25zdCBnZW8gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhHRU8sICJ1dGY4IikpOwphd2FpdCBwLmV2YWx1YXRlKCh7IGdlbywgbHYsIHNjZW5lcywgTSwgR0cgfSkgPT4gewogIGNvbnN0IGZlYXRzID0gdG9wb2pzb24uZmVhdHVyZShnZW8sIGdlby5vYmplY3RzLmNvdW50cmllcykuZmVhdHVyZXM7IGNvbnN0IEMgPSBbIiMxRTJBMzMiLCAiIzJBNDU1NSIsICIjNkU1QTI2IiwgIiM5QzVCMjYiLCAiI0IyNEIzMSIsICIjRDg2MDZFIl07CiAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImMiKS5nZXRDb250ZXh0KCIyZCIpOwogIGNvbnN0IGVhc2UgPSAodCkgPT4gKHQgPCAwLjUgPyAyICogdCAqIHQgOiAxIC0gTWF0aC5wb3coLTIgKiB0ICsgMiwgMikgLyAyKSwgY2wgPSAoeCkgPT4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgeCkpOwogIGNvbnN0IHJpY2ggPSAocykgPT4gU3RyaW5nKHMgfHwgIiIpLnJlcGxhY2UoLyYvZywgIiZhbXA7IikucmVwbGFjZSgvPC9nLCAiJmx0OyIpLnJlcGxhY2UoL1wqKC4rPylcKi9nLCAiPGI+JDE8L2I+Iik7CiAgLy8gZ2xvYm8gKGNvcGVydGluYSwgY2hpdXN1cmEsIGxvY2FsaXp6YXRvcmUpCiAgY29uc3QgZ2xvYmUgPSAoY3gsIGN5LCBSLCByb3QsIGFscGhhLCBwaW4sIGhsKSA9PiB7CiAgICBjb25zdCBwciA9IGQzLmdlb09ydGhvZ3JhcGhpYygpLnRyYW5zbGF0ZShbY3gsIGN5XSkuc2NhbGUoUikucm90YXRlKHJvdCkuY2xpcEFuZ2xlKDkwKTsgY29uc3QgcGEgPSBkMy5nZW9QYXRoKHByLCBjdHgpOwogICAgY3R4Lmdsb2JhbEFscGhhID0gYWxwaGE7IGN0eC5iZWdpblBhdGgoKTsgcGEoeyB0eXBlOiAiU3BoZXJlIiB9KTsgY3R4LmZpbGxTdHlsZSA9ICIjMEYxQzI3IjsgY3R4LmZpbGwoKTsgY3R4LnN0cm9rZVN0eWxlID0gIiMyQjQ0NTgiOyBjdHgubGluZVdpZHRoID0gMjsgY3R4LnN0cm9rZSgpOwogICAgY3R4LmJlZ2luUGF0aCgpOyBwYShkMy5nZW9HcmF0aWN1bGUxMCgpKTsgY3R4LnN0cm9rZVN0eWxlID0gInJnYmEoMTM0LDE4MCwyMzQsLjA3KSI7IGN0eC5saW5lV2lkdGggPSAxOyBjdHguc3Ryb2tlKCk7CiAgICBmb3IgKGNvbnN0IGYgb2YgZmVhdHMpIHsgY29uc3Qgb24gPSBobC5pbmNsdWRlcyhmLmlkKTsgY3R4LmJlZ2luUGF0aCgpOyBwYShmKTsgY3R4LmZpbGxTdHlsZSA9IG9uID8gIiNEODYwNkUiIDogQ1tNYXRoLm1pbig1LCBsdltmLmlkXSB8fCAwKV07IGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhICogKG9uID8gMSA6IDAuNDUpOyBjdHguZmlsbCgpOyBjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYTsgY3R4LnN0cm9rZVN0eWxlID0gb24gPyAicmdiYSgyNTUsMjQwLDIxMCwuOCkiIDogInJnYmEoMTEsMTcsMjMsLjgpIjsgY3R4LmxpbmVXaWR0aCA9IG9uID8gMiA6IDAuNjsgY3R4LnN0cm9rZSgpOyB9CiAgICBpZiAocGluKSB7IGNvbnN0IHEgPSBwcihwaW4pOyBpZiAocSkgeyBjdHguYmVnaW5QYXRoKCk7IGN0eC5hcmMocVswXSwgcVsxXSwgTWF0aC5tYXgoNSwgUiAvIDQwKSwgMCwgNyk7IGN0eC5maWxsU3R5bGUgPSAiI0U4QjA1MCI7IGN0eC5maWxsKCk7IH0gfQogICAgY3R4Lmdsb2JhbEFscGhhID0gMTsKICB9OwogIC8vIG1hcHBhIHJlZ2lvbmFsZSBzY2hlbWF0aWNhIChNZXJjYXRvciBhZGF0dGF0YSBhbCByaXF1YWRybykKICBjb25zdCBNWCA9IDYwLCBNWSA9IDMwMCwgTVcgPSA5NjAsIE1IID0gNzAwOwogIGNvbnN0IEcgPSBHRyB8fCAoTSAmJiBNLmxvY2F0b3IgPyB7IGNlbnRlcjogTS5sb2NhdG9yLmNlbnRlciwgaGlnaGxpZ2h0OiBNLmxvY2F0b3IuaGlnaGxpZ2h0IH0gOiB7IGNlbnRlcjogWzIwLCA0MF0sIGhpZ2hsaWdodDogW10gfSk7CiAgY29uc3QgW1t3MCwgczBdLCBbZTAsIG4wXV0gPSBNID8gTS5iYm94IDogW1swLCAwXSwgWzEsIDFdXTsKICBjb25zdCBiYXNlID0gZDMuZ2VvTWVyY2F0b3IoKS5maXRFeHRlbnQoW1tNWCwgTVldLCBbTVggKyBNVywgTVkgKyBNSF1dLCB7IHR5cGU6ICJNdWx0aVBvaW50IiwgY29vcmRpbmF0ZXM6IFtbdzAsIHMwXSwgW2UwLCBzMF0sIFtlMCwgbjBdLCBbdzAsIG4wXV0gfSk7CiAgY29uc3QgZm9jdXMgPSBNID8gKE0ucGxhY2VzLmZpbmQoKHgpID0+IHgubWFpbikgfHwgTS5wbGFjZXNbMF0pLmxsIDogKEcucGluIHx8IEcuY2VudGVyKTsKICBjb25zdCBtYXAgPSAoeiwgYWxwaGEsIGx0LCBzKSA9PiB7CiAgICBjb25zdCBwciA9IGQzLmdlb01lcmNhdG9yKCkuc2NhbGUoYmFzZS5zY2FsZSgpICogeikudHJhbnNsYXRlKGJhc2UudHJhbnNsYXRlKCkpOyBjb25zdCBmMCA9IGJhc2UoZm9jdXMpOyBjb25zdCBmMSA9IHByKGZvY3VzKTsgcHIudHJhbnNsYXRlKFtiYXNlLnRyYW5zbGF0ZSgpWzBdICsgZjBbMF0gLSBmMVswXSwgYmFzZS50cmFuc2xhdGUoKVsxXSArIGYwWzFdIC0gZjFbMV1dKTsKICAgIGNvbnN0IFAgPSAobGwpID0+IHByKGxsKTsKICAgIGN0eC5zYXZlKCk7IGN0eC5iZWdpblBhdGgoKTsgY3R4LnJlY3QoTVgsIE1ZLCBNVywgTUgpOyBjdHguY2xpcCgpOyBjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYTsKICAgIGN0eC5maWxsU3R5bGUgPSAiIzBFMTkyMiI7IGN0eC5maWxsUmVjdChNWCwgTVksIE1XLCBNSCk7CiAgICBjb25zdCBydiA9IE0ucml2ZXIubWFwKFApOyBjb25zdCBiaWcgPSA0MDAwOwogICAgLy8gZHVlIHNwb25kZTogc29wcmEgZSBzb3R0byBpbCBmaXVtZQogICAgY3R4LmJlZ2luUGF0aCgpOyBjdHgubW92ZVRvKHJ2WzBdWzBdIC0gYmlnLCBydlswXVsxXSk7IHJ2LmZvckVhY2goKHEpID0+IGN0eC5saW5lVG8ocVswXSwgcVsxXSkpOyBjdHgubGluZVRvKHJ2W3J2Lmxlbmd0aCAtIDFdWzBdICsgYmlnLCBydltydi5sZW5ndGggLSAxXVsxXSk7IGN0eC5saW5lVG8ocnZbcnYubGVuZ3RoIC0gMV1bMF0gKyBiaWcsIC1iaWcpOyBjdHgubGluZVRvKHJ2WzBdWzBdIC0gYmlnLCAtYmlnKTsgY3R4LmNsb3NlUGF0aCgpOyBjdHguZmlsbFN0eWxlID0gIiMxRDMzNDYiOyBjdHguZmlsbCgpOwogICAgY3R4LmJlZ2luUGF0aCgpOyBjdHgubW92ZVRvKHJ2WzBdWzBdIC0gYmlnLCBydlswXVsxXSk7IHJ2LmZvckVhY2goKHEpID0+IGN0eC5saW5lVG8ocVswXSwgcVsxXSkpOyBjdHgubGluZVRvKHJ2W3J2Lmxlbmd0aCAtIDFdWzBdICsgYmlnLCBydltydi5sZW5ndGggLSAxXVsxXSk7IGN0eC5saW5lVG8ocnZbcnYubGVuZ3RoIC0gMV1bMF0gKyBiaWcsIGJpZyk7IGN0eC5saW5lVG8ocnZbMF1bMF0gLSBiaWcsIGJpZyk7IGN0eC5jbG9zZVBhdGgoKTsgY3R4LmZpbGxTdHlsZSA9ICIjM0EyMTI4IjsgY3R4LmZpbGwoKTsKICAgIC8vIGdyaWdsaWEgbGVnZ2VyYQogICAgY3R4LnN0cm9rZVN0eWxlID0gInJnYmEoMTM0LDE4MCwyMzQsLjA2KSI7IGN0eC5saW5lV2lkdGggPSAxOyBmb3IgKGxldCB4ID0gTVg7IHggPCBNWCArIE1XOyB4ICs9IDYwKSB7IGN0eC5iZWdpblBhdGgoKTsgY3R4Lm1vdmVUbyh4LCBNWSk7IGN0eC5saW5lVG8oeCwgTVkgKyBNSCk7IGN0eC5zdHJva2UoKTsgfSBmb3IgKGxldCB5ID0gTVk7IHkgPCBNWSArIE1IOyB5ICs9IDYwKSB7IGN0eC5iZWdpblBhdGgoKTsgY3R4Lm1vdmVUbyhNWCwgeSk7IGN0eC5saW5lVG8oTVggKyBNVywgeSk7IGN0eC5zdHJva2UoKTsgfQogICAgLy8gZml1bWUKICAgIGN0eC5iZWdpblBhdGgoKTsgcnYuZm9yRWFjaCgocSwgaikgPT4gKGogPyBjdHgubGluZVRvKHFbMF0sIHFbMV0pIDogY3R4Lm1vdmVUbyhxWzBdLCBxWzFdKSkpOyBjdHguc3Ryb2tlU3R5bGUgPSAiIzVFOTNDOSI7IGN0eC5saW5lV2lkdGggPSAxNiAqIE1hdGguc3FydCh6KTsgY3R4LmxpbmVKb2luID0gY3R4LmxpbmVDYXAgPSAicm91bmQiOyBjdHguc3Ryb2tlKCk7CiAgICBjdHguc3Ryb2tlU3R5bGUgPSAiIzg2QjRFQSI7IGN0eC5saW5lV2lkdGggPSAzOyBjdHguc3Ryb2tlKCk7CiAgICAvLyBldGljaGV0dGUgZGVsbGUgc3BvbmRlIGUgZGVsIGZpdW1lCiAgICBjdHguZm9udCA9ICI1MDAgMzBweCBQTSI7IGN0eC5sZXR0ZXJTcGFjaW5nID0gIjNweCI7IGN0eC50ZXh0QWxpZ24gPSAibGVmdCI7CiAgICBjdHguZmlsbFN0eWxlID0gInJnYmEoMTM0LDE4MCwyMzQsLjk1KSI7IGN0eC5maWxsVGV4dChNLnNpZGVzWzBdLnRvVXBwZXJDYXNlKCksIE1YICsgMzQsIE1ZICsgNjQpOwogICAgY3R4LmZpbGxTdHlsZSA9ICJyZ2JhKDIxNiw5NiwxMTAsLjk1KSI7IGN0eC50ZXh0QWxpZ24gPSAicmlnaHQiOyBjdHguZmlsbFRleHQoTS5zaWRlc1sxXS50b1VwcGVyQ2FzZSgpLCBNWCArIE1XIC0gMzQsIE1ZICsgTUggLSA1MCk7CiAgICBpZiAoTS5yaXZlck5hbWUpIHsgY29uc3QgcSA9IE0ucml2ZXJBdCA/IFAoTS5yaXZlckF0KSA6IHJ2W01hdGguZmxvb3IocnYubGVuZ3RoICogMC43OCldOyBjdHguc2F2ZSgpOyBjdHgudHJhbnNsYXRlKHFbMF0sIHFbMV0gLSAyNik7IGN0eC5yb3RhdGUoLTAuMjIpOyBjdHgudGV4dEFsaWduID0gImNlbnRlciI7IGN0eC5mb250ID0gIml0YWxpYyA2MDAgMzRweCBQUyI7IGN0eC5maWxsU3R5bGUgPSAiIzg2QjRFQSI7IGN0eC5maWxsVGV4dChNLnJpdmVyTmFtZSwgMCwgMCk7IGN0eC5yZXN0b3JlKCk7IH0KICAgIGN0eC5sZXR0ZXJTcGFjaW5nID0gIjBweCI7CiAgICAvLyBkaXN0YW56YQogICAgaWYgKE0ua20gJiYgbHQgPiAwLjYpIHsgY29uc3QgYSA9IFAoTS5wbGFjZXNbTS5rbS5hXS5sbCksIGIgPSBQKE0ucGxhY2VzW00ua20uYl0ubGwpOyBjb25zdCBrID0gY2woKGx0IC0gMC42KSAvIDAuNik7IGN0eC5zZXRMaW5lRGFzaChbMTAsIDhdKTsgY3R4LmJlZ2luUGF0aCgpOyBjdHgubW92ZVRvKGFbMF0sIGFbMV0pOyBjdHgubGluZVRvKGFbMF0gKyAoYlswXSAtIGFbMF0pICogaywgYVsxXSArIChiWzFdIC0gYVsxXSkgKiBrKTsgY3R4LnN0cm9rZVN0eWxlID0gIiNFNEVBRUYiOyBjdHgubGluZVdpZHRoID0gMzsgY3R4LnN0cm9rZSgpOyBjdHguc2V0TGluZURhc2goW10pOwogICAgICBpZiAoayA+PSAxKSB7IGN0eC5mb250ID0gIjYwMCA0MHB4IFBTYSI7IGN0eC50ZXh0QWxpZ24gPSAiY2VudGVyIjsgY3R4LmZpbGxTdHlsZSA9ICIjRTRFQUVGIjsgY3R4LmZpbGxUZXh0KE0ua20udGV4dCwgKGFbMF0gKyBiWzBdKSAvIDIgKyAoTS5rbS5keCB8fCAwKSwgKGFbMV0gKyBiWzFdKSAvIDIgKyAoTS5rbS5keSB8fCAtMzApKTsgfSB9CiAgICAvLyBsdW9naGkKICAgIGNvbnN0IHB1bHNlID0gKGx0ICogMC45KSAlIDE7CiAgICBmb3IgKGNvbnN0IHBsIG9mIE0ucGxhY2VzKSB7IGNvbnN0IHEgPSBQKHBsLmxsKTsgY29uc3QgbWFpbiA9ICEhcGwubWFpbjsKICAgICAgaWYgKG1haW4pIHsgY3R4LmJlZ2luUGF0aCgpOyBjdHguYXJjKHFbMF0sIHFbMV0sIDE2ICsgcHVsc2UgKiA0NiwgMCwgNyk7IGN0eC5zdHJva2VTdHlsZSA9IGByZ2JhKDIzMiwxNzYsODAsJHswLjkgKiAoMSAtIHB1bHNlKX0pYDsgY3R4LmxpbmVXaWR0aCA9IDQ7IGN0eC5zdHJva2UoKTsgfQogICAgICBjdHguYmVnaW5QYXRoKCk7IGN0eC5hcmMocVswXSwgcVsxXSwgbWFpbiA/IDE2IDogMTEsIDAsIDcpOyBjdHguZmlsbFN0eWxlID0gbWFpbiA/ICIjRThCMDUwIiA6ICIjRTRFQUVGIjsgY3R4LmZpbGwoKTsgY3R4LnN0cm9rZVN0eWxlID0gIiMwQjExMTciOyBjdHgubGluZVdpZHRoID0gMzsgY3R4LnN0cm9rZSgpOwogICAgICBjb25zdCBkeCA9IHBsLmR4IHx8IDAsIGR5ID0gcGwuZHkgfHwgKG1haW4gPyA2MiA6IC0zMCk7IGN0eC50ZXh0QWxpZ24gPSBwbC5hbGlnbiB8fCAiY2VudGVyIjsgY3R4LmZvbnQgPSBgNjAwICR7bWFpbiA/IDUyIDogNDB9cHggUFNgOyBjdHguZmlsbFN0eWxlID0gbWFpbiA/ICIjRThCMDUwIiA6ICIjRTRFQUVGIjsgY3R4LmZpbGxUZXh0KHBsLm5hbWUsIHFbMF0gKyBkeCwgcVsxXSArIGR5KTsKICAgICAgaWYgKHBsLm5vdGUpIHsgY3R4LmZvbnQgPSAiNDAwIDI4cHggUFNhIjsgY3R4LmZpbGxTdHlsZSA9ICIjQjlDNkQyIjsgY3R4LmZpbGxUZXh0KHBsLm5vdGUsIHFbMF0gKyBkeCwgcVsxXSArIGR5ICsgMzYpOyB9IH0KICAgIC8vIG51bWVybyBncmFuZGUKICAgIGlmIChzLnN0YXQgJiYgbHQgPiAwLjUpIHsgY29uc3QgYSA9IGNsKChsdCAtIDAuNSkgLyAwLjUpOyBjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYSAqIGE7IGN0eC5maWxsU3R5bGUgPSAicmdiYSgxMSwxNywyMywuODIpIjsgY3R4LmZpbGxSZWN0KE1YICsgMzAsIE1ZICsgTUggLSAyNTAsIDUyMCwgMjEwKTsgY3R4LnRleHRBbGlnbiA9ICJsZWZ0IjsgY3R4LmZvbnQgPSAiNjAwIDExMHB4IFBTIjsgY3R4LmZpbGxTdHlsZSA9ICIjRThCMDUwIjsgY3R4LmZpbGxUZXh0KHMuc3RhdC5uLCBNWCArIDYwLCBNWSArIE1IIC0gMTMwKTsgY3R4LmZvbnQgPSAiNDAwIDMwcHggUFNhIjsgY3R4LmZpbGxTdHlsZSA9ICIjQzlENERFIjsgY3R4LmZpbGxUZXh0KHMuc3RhdC50LCBNWCArIDYyLCBNWSArIE1IIC0gNzYpOyBjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYTsgfQogICAgLy8gZXRpY2hldHRhCiAgICBpZiAocy5iYWRnZSAmJiBsdCA+IDAuNSkgeyBjb25zdCBhID0gY2woKGx0IC0gMC41KSAvIDAuNSk7IGNvbnN0IHEgPSBQKGZvY3VzKTsgY3R4Lmdsb2JhbEFscGhhID0gYWxwaGEgKiBhOyBjdHguZm9udCA9ICI1MDAgMzJweCBQTSI7IGN0eC5sZXR0ZXJTcGFjaW5nID0gIjNweCI7IGNvbnN0IHcgPSBjdHgubWVhc3VyZVRleHQocy5iYWRnZSkud2lkdGggKyA0ODsgY29uc3QgeCA9IE1hdGgubWluKE1YICsgTVcgLSB3IC0gMjAsIE1hdGgubWF4KE1YICsgMjAsIHFbMF0gLSB3IC8gMikpLCB5ID0gcVsxXSArIDEzMDsgY3R4LmZpbGxTdHlsZSA9ICIjRThCMDUwIjsgY3R4LmJlZ2luUGF0aCgpOyBjdHgucm91bmRSZWN0KHgsIHksIHcsIDY0LCAzMik7IGN0eC5maWxsKCk7IGN0eC5maWxsU3R5bGUgPSAiIzBCMTExNyI7IGN0eC50ZXh0QWxpZ24gPSAibGVmdCI7IGN0eC5maWxsVGV4dChzLmJhZGdlLCB4ICsgMjQsIHkgKyA0Myk7IGN0eC5sZXR0ZXJTcGFjaW5nID0gIjBweCI7IGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhOyB9CiAgICBpZiAoTS5ub3RlKSB7IGN0eC5mb250ID0gIjUwMCAyMnB4IFBNIjsgY3R4LnRleHRBbGlnbiA9ICJyaWdodCI7IGN0eC5maWxsU3R5bGUgPSAicmdiYSgxODUsMTk4LDIxMCwuNikiOyBjdHguZmlsbFRleHQoTS5ub3RlLCBNWCArIE1XIC0gMTgsIE1ZICsgTUggLSAxNCk7IH0KICAgIGN0eC5yZXN0b3JlKCk7CiAgICAvLyBsb2NhbGl6emF0b3JlCiAgICBpZiAoTS5sb2NhdG9yKSB7IGN0eC5zYXZlKCk7IGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhOyBnbG9iZShNWCArIE1XIC0gMTAwLCBNWSArIDE1MCwgNzIsIFstTS5sb2NhdG9yLmNlbnRlclswXSwgLU0ubG9jYXRvci5jZW50ZXJbMV1dLCBhbHBoYSwgZm9jdXMsIE0ubG9jYXRvci5oaWdobGlnaHQpOyBjdHgucmVzdG9yZSgpOyB9CiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgxMzQsMTgwLDIzNCwuMjUpIjsgY3R4LmxpbmVXaWR0aCA9IDI7IGN0eC5zdHJva2VSZWN0KE1YLCBNWSwgTVcsIE1IKTsKICB9OwogIGNvbnN0IGRhdGVzID0gKHMsIGx0LCBhbHBoYSkgPT4gewogICAgY29uc3QgRCA9IHMuZGF0ZXM7IGNvbnN0IHkwID0gMzgwOwogICAgRC5mb3JFYWNoKChkLCBqKSA9PiB7IGNvbnN0IGEgPSBjbCgobHQgLSAwLjMgLSBqICogMC42KSAvIDAuNSk7IGlmIChhIDw9IDApIHJldHVybjsgY29uc3QgeCA9IGogPyA1NjAgOiA4MCwgdyA9IDQ0MDsgY3R4Lmdsb2JhbEFscGhhID0gYWxwaGEgKiBhOyBjb25zdCBkeSA9ICgxIC0gZWFzZShhKSkgKiAzMDsKICAgICAgY3R4LmZpbGxTdHlsZSA9ICIjMTMyMjMwIjsgY3R4LmJlZ2luUGF0aCgpOyBjdHgucm91bmRSZWN0KHgsIHkwICsgZHksIHcsIDUyMCwgMjgpOyBjdHguZmlsbCgpOyBjdHguc3Ryb2tlU3R5bGUgPSBqID8gInJnYmEoMjE2LDk2LDExMCwuNykiIDogInJnYmEoMTM0LDE4MCwyMzQsLjcpIjsgY3R4LmxpbmVXaWR0aCA9IDM7IGN0eC5zdHJva2UoKTsKICAgICAgY3R4LnRleHRBbGlnbiA9ICJjZW50ZXIiOyBjdHguZm9udCA9ICI1MDAgMzBweCBQTSI7IGN0eC5maWxsU3R5bGUgPSBqID8gIiNEODYwNkUiIDogIiM4NkI0RUEiOyBjdHgubGV0dGVyU3BhY2luZyA9ICIzcHgiOyBjdHguZmlsbFRleHQoZC53aG8udG9VcHBlckNhc2UoKSwgeCArIHcgLyAyLCB5MCArIGR5ICsgODApOyBjdHgubGV0dGVyU3BhY2luZyA9ICIwcHgiOwogICAgICBjdHguZm9udCA9ICI2MDAgMTUwcHggUFMiOyBjdHguZmlsbFN0eWxlID0gIiNFOEIwNTAiOyBjdHguZmlsbFRleHQoZC5kLCB4ICsgdyAvIDIsIHkwICsgZHkgKyAyNzApOyBjdHguZm9udCA9ICI2MDAgNTJweCBQUyI7IGN0eC5maWxsU3R5bGUgPSAiI0U0RUFFRiI7IGN0eC5maWxsVGV4dChkLm0sIHggKyB3IC8gMiwgeTAgKyBkeSArIDM0MCk7CiAgICAgIGN0eC5mb250ID0gIjQwMCAzMHB4IFBTYSI7IGN0eC5maWxsU3R5bGUgPSAiI0I5QzZEMiI7IChkLnN1YiB8fCAiIikuc3BsaXQoInwiKS5mb3JFYWNoKChyLCBrKSA9PiBjdHguZmlsbFRleHQociwgeCArIHcgLyAyLCB5MCArIGR5ICsgNDIwICsgayAqIDQwKSk7IH0pOwogICAgY29uc3QgYSA9IGNsKChsdCAtIDEuNikgLyAwLjQpOyBjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYSAqIGE7IGN0eC5mb250ID0gIjYwMCA5MHB4IFBTIjsgY3R4LmZpbGxTdHlsZSA9ICIjRTRFQUVGIjsgY3R4LnRleHRBbGlnbiA9ICJjZW50ZXIiOyBjdHguZmlsbFRleHQoIuKJoCIsIDU0MCwgeTAgKyAyOTApOyBjdHguZ2xvYmFsQWxwaGEgPSAxOwogIH07CiAgY29uc3Qgc3RhcnRzID0gW107IGxldCBhY2MgPSAwOyBzY2VuZXMuZm9yRWFjaCgocykgPT4geyBzdGFydHMucHVzaChhY2MpOyBhY2MgKz0gcy5kdXI7IH0pOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJiYXIiKS5pbm5lckhUTUwgPSBzY2VuZXMubWFwKCgpID0+ICI8aT48L2k+Iikuam9pbigiIik7CiAgd2luZG93LnNjZW5lVGV4dCA9IChpKSA9PiB7IGNvbnN0IHMgPSBzY2VuZXNbaV07IGNvbnN0IHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidCIpOyB0LmNsYXNzTmFtZSA9IHMudHlwZSA9PT0gImNvdmVyIiA/ICJjb3ZlciIgOiBzLnR5cGUgPT09ICJlbmQiID8gImVuZCIgOiAiIjsKICAgIHQuaW5uZXJIVE1MID0gYCR7cy5raWNrZXIgPyBgPGRpdiBjbGFzcz0iayI+JHtyaWNoKHMua2lja2VyKX08L2Rpdj5gIDogIiJ9JHtzLmhlYWQgPyBgPGRpdiBjbGFzcz0iaCI+JHtyaWNoKHMuaGVhZCl9PC9kaXY+YCA6ICIifSR7cy5ib2R5ID8gYDxkaXYgY2xhc3M9ImIiPiR7cmljaChzLmJvZHkpfTwvZGl2PmAgOiAiIn0ke3Muc3JjID8gYDxkaXYgY2xhc3M9InMiPiR7cmljaChzLnNyYyl9PC9kaXY+YCA6ICIifSR7cy5jdGEgPyBgPGRpdiBjbGFzcz0iY3RhIj4ke3JpY2gocy5jdGEpfTwvZGl2PmAgOiAiIn0ke3MudGcgPyBgPGRpdiBjbGFzcz0idGdsIj4ke3JpY2gocy50Zyl9PC9kaXY+YCA6ICIifWA7CiAgICByZXR1cm4gTWF0aC5yb3VuZCh0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSk7IH07CiAgbGV0IGN1ciA9IC0xOyBsZXQgbWFwU3RhcnQgPSBzdGFydHNbc2NlbmVzLmZpbmRJbmRleCgocykgPT4gcy50eXBlID09PSAibWFwIildIHx8IDA7CiAgd2luZG93LnJlbmRlciA9ICh0KSA9PiB7CiAgICBsZXQgaSA9IHN0YXJ0cy5maW5kSW5kZXgoKHMsIGopID0+IHQgPj0gcyAmJiAoaiA9PT0gc2NlbmVzLmxlbmd0aCAtIDEgfHwgdCA8IHN0YXJ0c1tqICsgMV0pKTsgaWYgKGkgPCAwKSBpID0gc2NlbmVzLmxlbmd0aCAtIDE7CiAgICBjb25zdCBzID0gc2NlbmVzW2ldLCBsdCA9IHQgLSBzdGFydHNbaV0sIHByZXYgPSBzY2VuZXNbaSAtIDFdOwogICAgY3R4LmNsZWFyUmVjdCgwLCAwLCAxMDgwLCAxOTIwKTsgY3R4LmZpbGxTdHlsZSA9ICIjMEIxMTE3IjsgY3R4LmZpbGxSZWN0KDAsIDAsIDEwODAsIDE5MjApOwogICAgY29uc3QgZmFkZUluID0gY2wobHQgLyAwLjUpOwogICAgY29uc3QgeiA9IDEgKyAwLjEyICogY2woKHQgLSBtYXBTdGFydCkgLyAzMCk7CiAgICBjb25zdCBkcmF3ID0gKHNjLCBhLCBsKSA9PiB7IGlmIChzYy50eXBlID09PSAiY292ZXIiKSB7IGNvbnN0IHJvdCA9IFstKEcuY2VudGVyWzBdIC0gNDAgKyBNYXRoLm1pbih0LCA2KSAqIDYuNSksIC1NYXRoLm1heCgtNjAsIE1hdGgubWluKDYwLCBHLmNlbnRlclsxXSkpXTsgZ2xvYmUoNTQwLCA2NDAsIDM2MCwgcm90LCAwLjkgKiBhLCBmb2N1cywgRy5oaWdobGlnaHQgfHwgW10pOyB9CiAgICAgIGVsc2UgaWYgKHNjLnR5cGUgPT09ICJtYXAiKSBtYXAoeiwgYSwgbCwgc2MpOyBlbHNlIGlmIChzYy50eXBlID09PSAiZGF0ZXMiKSBkYXRlcyhzYywgbCwgYSk7CiAgICAgIGVsc2UgaWYgKHNjLnR5cGUgPT09ICJnbG9iZSIpIHsgY29uc3QgZyA9IHNjLmdlbyB8fCB7fTsgY29uc3QgcHYgPSBzY2VuZXNbc2NlbmVzLmluZGV4T2Yoc2MpIC0gMV07IGNvbnN0IGZyb20gPSBwdiAmJiBwdi50eXBlID09PSAiZ2xvYmUiID8gcHYuZ2VvLmNlbnRlciA6IEcuY2VudGVyOyBjb25zdCBrID0gZWFzZShjbChsIC8gMS4zKSk7IGNvbnN0IGMgPSBkMy5nZW9JbnRlcnBvbGF0ZShmcm9tLCBnLmNlbnRlcikoayk7IGdsb2JlKDU0MCwgNjUwLCAzNjAgKiAoZy56b29tIHx8IDEuMiksIFstY1swXSwgLWNbMV1dLCBhLCBnLnBpbiB8fCBudWxsLCBnLmhpZ2hsaWdodCB8fCBbXSk7IH0KICAgICAgZWxzZSBpZiAoc2MudHlwZSA9PT0gImVuZCIpIGdsb2JlKDU0MCwgNTYwLCAyMDAsIFstRy5jZW50ZXJbMF0sIC1NYXRoLm1heCgtNjAsIE1hdGgubWluKDYwLCBHLmNlbnRlclsxXSkpXSwgMC44ICogYSwgZm9jdXMsIEcuaGlnaGxpZ2h0IHx8IFtdKTsgfTsKICAgIGlmIChwcmV2ICYmIGZhZGVJbiA8IDEgJiYgcHJldi50eXBlICE9PSBzLnR5cGUpIGRyYXcocHJldiwgMSAtIGZhZGVJbiwgcHJldi5kdXIpOwogICAgZHJhdyhzLCBwcmV2ICYmIHByZXYudHlwZSAhPT0gcy50eXBlID8gZmFkZUluIDogMSwgbHQpOwogICAgLy8gc2Z1bWF0dXJlIHBlciBsYSBsZWdnaWJpbGl0w6AKICAgIGlmIChzLnR5cGUgPT09ICJnbG9iZSIgfHwgcy50eXBlID09PSAiY292ZXIiIHx8IChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICJnbG9iZSIgfHwgcHJldi50eXBlID09PSAiY292ZXIiKSAmJiBmYWRlSW4gPCAxKSkgeyBjb25zdCBnYiA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCA5NDAsIDAsIDEwOTApOyBnYi5hZGRDb2xvclN0b3AoMCwgInJnYmEoMTEsMTcsMjMsMCkiKTsgZ2IuYWRkQ29sb3JTdG9wKDEsICJyZ2JhKDExLDE3LDIzLDEpIik7IGN0eC5maWxsU3R5bGUgPSBnYjsgY3R4LmZpbGxSZWN0KDAsIDk0MCwgMTA4MCwgMTUwKTsgY3R4LmZpbGxTdHlsZSA9ICIjMEIxMTE3IjsgY3R4LmZpbGxSZWN0KDAsIDEwOTAsIDEwODAsIDgzMCk7IH0KICAgIGNvbnN0IGd0ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIDI5MCk7IGd0LmFkZENvbG9yU3RvcCgwLCAicmdiYSgxMSwxNywyMywxKSIpOyBndC5hZGRDb2xvclN0b3AoMC43NSwgInJnYmEoMTEsMTcsMjMsLjkyKSIpOyBndC5hZGRDb2xvclN0b3AoMSwgInJnYmEoMTEsMTcsMjMsMCkiKTsgY3R4LmZpbGxTdHlsZSA9IGd0OyBjdHguZmlsbFJlY3QoMCwgMCwgMTA4MCwgMjkwKTsKICAgIGlmIChpICE9PSBjdXIpIHsgY3VyID0gaTsgd2luZG93LnNjZW5lVGV4dChpKTsgWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNiYXIgaSIpXS5mb3JFYWNoKCh4LCBqKSA9PiAoeC5jbGFzc05hbWUgPSBqIDwgaSA/ICJkb25lIiA6IGogPT09IGkgPyAib24iIDogIiIpKTsgfQogICAgY29uc3QgdHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidCIpOyBjb25zdCBhID0gY2woKGx0IC0gMC4yKSAvIDAuNDUpOyB0dC5zdHlsZS5vcGFjaXR5ID0gYTsgdHQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHsoMSAtIGEpICogMjR9cHgpYDsKICB9Owp9LCB7IGdlbywgbHY6IHNwZWMubGV2ZWxzIHx8IHt9LCBzY2VuZXM6IHNjLCBNOiBzcGVjLm1hcCB8fCBudWxsLCBHRzogc3BlYy5nZW8gfHwgbnVsbCB9KTsKZm9yIChsZXQgaSA9IDA7IGkgPCBzYy5sZW5ndGg7IGkrKykgeyBjb25zdCBib3R0b20gPSBhd2FpdCBwLmV2YWx1YXRlKChpKSA9PiB3aW5kb3cuc2NlbmVUZXh0KGkpLCBpKTsgaWYgKGJvdHRvbSA+IDE1ODApIGVyci5wdXNoKGBzY2VuZXNbJHtpfV06IGlsIHRlc3RvIGZpbmlzY2UgYSAke2JvdHRvbX0gcHgsIG9sdHJlIGxhIHpvbmEgc2ljdXJhICgxNTgwKWApOyB9CmlmIChtb2RlID09PSAiY2hlY2siIHx8IGVyci5sZW5ndGgpIHsgYXdhaXQgYnIuY2xvc2UoKTsgaWYgKGVyci5sZW5ndGgpIHsgY29uc29sZS5sb2coIkVSUk9SSTpcbi0gIiArIGVyci5qb2luKCJcbi0gIikpOyBwcm9jZXNzLmV4aXQoMSk7IH0gY29uc29sZS5sb2coYHNwZWNpZmljYSBvayDCtyAke3NjLmxlbmd0aH0gc2NlbmUgwrcgJHtUT1R9IHNgKTsgcHJvY2Vzcy5leGl0KDApOyB9CmNvbnN0IE1VU0lDID0gcHJvY2Vzcy5lbnYuUkdfTVVTSUM7IGlmICghTVVTSUMgfHwgIWZzLmV4aXN0c1N5bmMoTVVTSUMpKSB7IGF3YWl0IGJyLmNsb3NlKCk7IGNvbnNvbGUubG9nKCJpbXBvc3RhIFJHX01VU0lDIik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBvZCA9IHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUob3V0KSk7IGNvbnN0IHdvcmsgPSBwYXRoLmpvaW4ob2QsICJ3b3JrX3NwaWVnYXRvIik7IGZzLnJtU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSk7IGZzLm1rZGlyU3luYyh3b3JrLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTsKY29uc3QgZnBzID0gMzAsIE4gPSBNYXRoLnJvdW5kKFRPVCAqIGZwcyk7CmZvciAobGV0IG4gPSAwOyBuIDwgTjsgbisrKSB7IGF3YWl0IHAuZXZhbHVhdGUoKHQpID0+IHdpbmRvdy5yZW5kZXIodCksIG4gLyBmcHMpOyBhd2FpdCBwLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4od29yaywgU3RyaW5nKG4pLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDg4IH0pOyB9CmF3YWl0IGJyLmNsb3NlKCk7Ci8vIG11c2ljYTogaWwgZmlsZSBvcmlnaW5hbGUgZGEgMTUgcyBzaSBhbGx1bmdhIHN1bCBiYXR0aXRvIChpbnRybytkcm9wIDAtMTAgcywgYmxvY2NvIDYtMTAgcyByaXBldHV0bywgZmluYWxlIDEwLTE1IHMpLCBjb3PDrCBpbCBmaW5hbGUgY2FkZSBzdWxsYSBmaW5lIGRlbCB2aWRlbwpjb25zdCBwciA9IHNwYXduU3luYygiZmZwcm9iZSIsIFsiLXYiLCAiZXJyb3IiLCAiLXNob3dfZW50cmllcyIsICJmb3JtYXQ9ZHVyYXRpb24iLCAiLW9mIiwgImNzdj1wPTAiLCBNVVNJQ10pOyBjb25zdCBNRCA9IHBhcnNlRmxvYXQoU3RyaW5nKHByLnN0ZG91dCB8fCAiMCIpKSB8fCAwOwpsZXQgQUY7CmlmIChNRCA+IDAgJiYgTUQgPCBUT1QgKyAwLjUpIHsgY29uc3QgayA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoVE9UIC0gMTUpIC8gNCkpOyBjb25zdCBwYXJ0cyA9IFsiWzFdYXRyaW09MDoxMCxhc2V0cHRzPVBUUy1TVEFSVFBUU1twMF0iXTsgZm9yIChsZXQgaiA9IDA7IGogPCBrOyBqKyspIHBhcnRzLnB1c2goYFsxXWF0cmltPTY6MTAsYXNldHB0cz1QVFMtU1RBUlRQVFNbZyR7an1dYCk7IHBhcnRzLnB1c2goIlsxXWF0cmltPTEwOjE1LGFzZXRwdHM9UFRTLVNUQVJUUFRTW3BmXSIpOwogIGNvbnN0IEwgPSAxNSArIDQgKiBrOyBjb25zdCBjdXQgPSBNYXRoLm1heCgwLCBMIC0gVE9UKTsgLy8gc2UgbGEgZHVyYXRhIG5vbiDDqCAxNSs0aywgc2kgYWNjb3JjaWEgbCdpbml6aW8gZGVsIGZpbmFsZSBpbiBtb2RvIGNoZSBsJ3VsdGltYSBub3RhIGNhZGEgYWxsYSBmaW5lCiAgQUYgPSBwYXJ0cy5qb2luKCI7IikgKyAiOyIgKyAiW3AwXSIgKyBBcnJheS5mcm9tKHsgbGVuZ3RoOiBrIH0sIChfLCBqKSA9PiBgW2cke2p9XWApLmpvaW4oIiIpICsgYFtwZl1jb25jYXQ9bj0ke2sgKyAyfTp2PTA6YT0xLGF0cmltPSR7Y3V0fToke0x9LGFzZXRwdHM9UFRTLVNUQVJUUFRTLGFmYWRlPXQ9aW46ZD0wLjA1W2FdYDsgfQplbHNlIEFGID0gYFsxXWF0cmltPTA6JHtUT1R9LGFmYWRlPXQ9b3V0OnN0PSR7VE9UIC0gMS41fTpkPTEuNVthXWA7CmNvbnN0IHIgPSBzcGF3blN5bmMoImZmbXBlZyIsIFsiLWxvZ2xldmVsIiwgImVycm9yIiwgIi15IiwgIi1mcmFtZXJhdGUiLCBTdHJpbmcoZnBzKSwgIi1pIiwgcGF0aC5qb2luKHdvcmssICIlMDVkLmpwZyIpLCAiLWkiLCBNVVNJQywgIi1maWx0ZXJfY29tcGxleCIsIEFGLCAiLW1hcCIsICIwOnYiLCAiLW1hcCIsICJbYV0iLCAiLWM6diIsICJsaWJ4MjY0IiwgIi1wcmVzZXQiLCAibWVkaXVtIiwgIi1jcmYiLCAiMjEiLCAiLXBpeF9mbXQiLCAieXV2NDIwcCIsICItYzphIiwgImFhYyIsICItYjphIiwgIjEyOGsiLCAiLXQiLCBTdHJpbmcoVE9UKSwgIi1tb3ZmbGFncyIsICIrZmFzdHN0YXJ0Iiwgb3V0XSk7CmlmIChyLnN0YXR1cyAhPT0gMCkgeyBjb25zb2xlLmxvZygiZmZtcGVnIG5vbiByaXVzY2l0byIpOyBwcm9jZXNzLmV4aXQoMSk7IH0KbGV0IGFjYyA9IDA7IHNjLmZvckVhY2goKHMsIGkpID0+IHsgY29uc3QgdCA9IGFjYyArIE1hdGgubWluKHMuZHVyIC0gMC4zLCAyLjQpOyBhY2MgKz0gcy5kdXI7IGZzLmNvcHlGaWxlU3luYyhwYXRoLmpvaW4od29yaywgU3RyaW5nKE1hdGgucm91bmQodCAqIGZwcykpLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCBwYXRoLmpvaW4ob2QsIGBjaGVja18ke2kgKyAxfS5qcGdgKSk7IH0pOwpjb25zb2xlLmxvZyhgb2s6ICR7b3V0fSDCtyAke1RPVH0gcyDCtyAkeyhmcy5zdGF0U3luYyhvdXQpLnNpemUgLyAxMDQ4NTc2KS50b0ZpeGVkKDEpfSBNQmApOwo=",
  "radar.mjs": "Ly8gcmFkYXIubWpzIOKAlCBhcGVydHVyYSByYWRhciAoNCBzLCBzdWxsJ2ludHJvIGRlbGxhIG11c2ljYSkgcGVyIGlsIHJlZWwgZGVsIHZlbmVyZMOsICJPZ2dpIGluIDQwIHNlY29uZGkiIChyaWNldHRhIE0pLgovLyBVbiBnbG9ibyBjb24gaWwgZmFzY2lvIGRpIHVuIHJhZGFyIGNoZSBnaXJhIGEgdGVtcG8gKHVuIGdpcm8gb2duaSAyIHMpIGUgYWNjZW5kZSB1bm8gZG9wbyBsJ2FsdHJvIGkgcGFlc2kgZGVsbGUgbm90aXppZSBkZWwgZ2lvcm5vOwovLyBzdWwgYmVhdCAoNCwwIHMpIGF0dGFjY2EgaWwgY29ycG8gZGVsIHJlZWwgZmF0dG8gY29uIGdsb2JvLm1qcy4gTGEgbXVzaWNhIG9yaWdpbmFsZSBzY29ycmUgZGEgY2FwbyBwZXIgdHV0dG8gaWwgdmlkZW8uCi8vIHVzbzogbm9kZSByYWRhci5tanMgY2hlY2sgIFNQRUMuanNvbgovLyAgICAgIG5vZGUgcmFkYXIubWpzIHJlbmRlciBTUEVDLmpzb24gQ09SUE8ubXA0IE9VVC5tcDQgICAtPiBPVVQgPSByYWRhciArIGNvcnBvLCBtdXNpY2EgY29udGludWE7IGNvbnRyb2xsaSBPVVRfRElSL3JhZGFyX2NoZWNrX04uanBnCi8vIHZhcmlhYmlsaTogUkdfTVVTSUMgKG9iYmxpZ2F0b3JpYSBwZXIgcmVuZGVyKSwgUkdfR0VPIChnZW8uanNvbiBkZWwgc2l0bzsgYWx0cmltZW50aSAvdG1wL3Jnc2l0ZS9wdWJsaWMvZ2VvLmpzb24pLCBSR19GT05UUwovLyBTUEVDOiB7ImRhdGUiOiJZWVlZLU1NLUREIiwibGFiZWwiOiJPR0dJIElOIDQwIFNFQ09OREkgwrcgVkVORVJEw4wgMjMgT1RUIiwibGV2ZWxzIjp7IklSTiI6NSwuLi59LAovLyAgICAgICAgInRhcmdldHMiOlt7ImNvdW50cnkiOiJVS1IiLCJsYWJlbCI6IlVDUkFJTkEifSwuLi5dIChkYSAyIGEgNSksICJ0aXRsZSI6IlF1YXR0cm8gbm90aXppZSwgKmluIDQwIHNlY29uZGkqLiIsInN1YiI6IkRhbCBtb25kbyBlIGRhbGwnSXRhbGlhLCBjb24gbGUgZm9udGkuIn0KaW1wb3J0IGZzIGZyb20gIm5vZGU6ZnMiOwppbXBvcnQgcGF0aCBmcm9tICJub2RlOnBhdGgiOwppbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICJub2RlOmNoaWxkX3Byb2Nlc3MiOwoKY29uc3QgW21vZGUsIHNwZWNQYXRoLCBib2R5SW4sIG91dF0gPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7CmlmICghWyJjaGVjayIsICJyZW5kZXIiXS5pbmNsdWRlcyhtb2RlKSB8fCAhc3BlY1BhdGggfHwgKG1vZGUgPT09ICJyZW5kZXIiICYmICghYm9keUluIHx8ICFvdXQpKSkgeyBjb25zb2xlLmxvZygidXNvOiBub2RlIHJhZGFyLm1qcyBjaGVjayBTUEVDLmpzb24gfCBub2RlIHJhZGFyLm1qcyByZW5kZXIgU1BFQy5qc29uIENPUlBPLm1wNCBPVVQubXA0Iik7IHByb2Nlc3MuZXhpdCgyKTsgfQpjb25zdCBIT01FID0gcHJvY2Vzcy5lbnYuSE9NRSB8fCAiL3Jvb3QiOwpjb25zdCBzcGVjID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc3BlY1BhdGgsICJ1dGY4IikpOwpjb25zdCBHRU8gPSBbcHJvY2Vzcy5lbnYuUkdfR0VPLCAiL3RtcC9yZ3NpdGUvcHVibGljL2dlby5qc29uIiwgSE9NRSArICIvaWdraXQvZ2VvLmpzb24iXS5maW5kKChmKSA9PiBmICYmIGZzLmV4aXN0c1N5bmMoZikpOwpjb25zdCBlcnIgPSBbXSwgd2FybiA9IFtdOwpjb25zdCBEVVIgPSA0LjAsIEZQUyA9IDMwOwpjb25zdCBwbGFpbiA9IChzKSA9PiBTdHJpbmcocyB8fCAiIikucmVwbGFjZSgvXCovZywgIiIpOwppZiAoIS9eXGR7NH0tXGR7Mn0tXGR7Mn0kLy50ZXN0KHNwZWMuZGF0ZSB8fCAiIikpIGVyci5wdXNoKCJkYXRlOiBmb3JtYXRvIFlZWVktTU0tREQiKTsKaWYgKCFzcGVjLmxhYmVsIHx8IHBsYWluKHNwZWMubGFiZWwpLmxlbmd0aCA+IDQ0KSBlcnIucHVzaCgibGFiZWw6IG9iYmxpZ2F0b3JpYSwgbWF4IDQ0IGNhcmF0dGVyaSIpOwppZiAoIXNwZWMubGV2ZWxzIHx8IHR5cGVvZiBzcGVjLmxldmVscyAhPT0gIm9iamVjdCIpIGVyci5wdXNoKCJsZXZlbHM6IG1hbmNhbm8gaSBsaXZlbGxpIGRpIHRlbnNpb25lIGRlaSBwYWVzaSAoZGEgY291bnRyaWVzKSIpOwpjb25zdCBUID0gc3BlYy50YXJnZXRzIHx8IFtdOwppZiAoVC5sZW5ndGggPCAyIHx8IFQubGVuZ3RoID4gNSkgZXJyLnB1c2goInRhcmdldHM6IGRhIDIgYSA1IHBhZXNpICh1bm8gcGVyIG5vdGl6aWEpIik7ClQuZm9yRWFjaCgoeCwgaSkgPT4geyBpZiAoIS9eW0EtWl17M30kLy50ZXN0KHguY291bnRyeSB8fCAiIikpIGVyci5wdXNoKGB0YXJnZXRzWyR7aX1dLmNvdW50cnk6IElTTzNgKTsgaWYgKCF4LmxhYmVsIHx8IHBsYWluKHgubGFiZWwpLmxlbmd0aCA+IDE2KSBlcnIucHVzaChgdGFyZ2V0c1ske2l9XS5sYWJlbDogb2JibGlnYXRvcmlhLCBtYXggMTYgY2FyYXR0ZXJpYCk7IH0pOwppZiAoIXNwZWMudGl0bGUgfHwgcGxhaW4oc3BlYy50aXRsZSkubGVuZ3RoID4gNDQpIGVyci5wdXNoKCJ0aXRsZTogb2JibGlnYXRvcmlvLCBtYXggNDQgY2FyYXR0ZXJpIik7CmlmIChzcGVjLnN1YiAmJiBwbGFpbihzcGVjLnN1YikubGVuZ3RoID4gNjApIGVyci5wdXNoKCJzdWI6IG1heCA2MCBjYXJhdHRlcmkiKTsKbGV0IGdlbyA9IG51bGw7CmlmICghR0VPKSBlcnIucHVzaCgiZ2VvLmpzb24gbm9uIHRyb3ZhdG86IGNsb25hIGlsIHJlcG8gaW4gL3RtcC9yZ3NpdGUgbyBpbXBvc3RhIFJHX0dFTyIpOwplbHNlIHsgZ2VvID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoR0VPLCAidXRmOCIpKTsgY29uc3QgaWRzID0gbmV3IFNldChnZW8ub2JqZWN0cy5jb3VudHJpZXMuZ2VvbWV0cmllcy5tYXAoKHgpID0+IHguaWQpKTsgVC5mb3JFYWNoKCh4KSA9PiB7IGlmICh4LmNvdW50cnkgJiYgIWlkcy5oYXMoeC5jb3VudHJ5KSkgZXJyLnB1c2goYCR7eC5jb3VudHJ5fTogbm9uIMOoIG5lbGxhIG1hcHBhYCk7IH0pOyB9CmxldCBjaHJvbWl1bTsKZm9yIChjb25zdCBwIG9mIFsicGxheXdyaWdodCIsIHBhdGguam9pbihIT01FLCAiaWdraXQvbm9kZV9tb2R1bGVzL3BsYXl3cmlnaHQvaW5kZXgubWpzIiksICIvdG1wL2lna2l0L25vZGVfbW9kdWxlcy9wbGF5d3JpZ2h0L2luZGV4Lm1qcyJdKSB7IHRyeSB7IGNocm9taXVtID0gKGF3YWl0IGltcG9ydChwLnN0YXJ0c1dpdGgoIi8iKSA/ICJmaWxlOi8vIiArIHAgOiBwKSkuY2hyb21pdW07IGJyZWFrOyB9IGNhdGNoIChlKSB7fSB9CmlmICghY2hyb21pdW0pIGVyci5wdXNoKCJQbGF5d3JpZ2h0IG5vbiB0cm92YXRvIik7CmNvbnN0IE5NID0gW3BhdGguam9pbihIT01FLCAiaWdraXQvbm9kZV9tb2R1bGVzIiksICIvdG1wL2lna2l0L25vZGVfbW9kdWxlcyIsICIvdG1wL2NsYXVkZS0wL2tpdC9ub2RlX21vZHVsZXMiXS5maW5kKChkKSA9PiBmcy5leGlzdHNTeW5jKHBhdGguam9pbihkLCAiZDMtZ2VvL2Rpc3QvZDMtZ2VvLm1pbi5qcyIpKSAmJiBmcy5leGlzdHNTeW5jKHBhdGguam9pbihkLCAidG9wb2pzb24tY2xpZW50L2Rpc3QvdG9wb2pzb24tY2xpZW50Lm1pbi5qcyIpKSk7CmlmICghTk0pIGVyci5wdXNoKCJkMy1nZW8gLyB0b3BvanNvbi1jbGllbnQgbm9uIHRyb3ZhdGkgaW4gbm9kZV9tb2R1bGVzIGRlbCBraXQiKTsKY29uc3QgRk9OVFMgPSBbcHJvY2Vzcy5lbnYuUkdfRk9OVFMsIEhPTUUgKyAiL2lna2l0L2ZvbnRzIiwgIi9ob21lL2NsYXVkZS9pZ2tpdC9mb250cyIsICIvdG1wL3JrL2ZvbnRzIl0uZmluZCgoZCkgPT4gZCAmJiBmcy5leGlzdHNTeW5jKGQgKyAiL2libS1wbGV4LXNlcmlmLWxhdGluLTYwMC1ub3JtYWwud29mZjIiKSAmJiBmcy5leGlzdHNTeW5jKGQgKyAiL2libS1wbGV4LW1vbm8tbGF0aW4tNTAwLW5vcm1hbC53b2ZmMiIpKTsKaWYgKCFGT05UUykgZXJyLnB1c2goImZvbnQgSUJNIFBsZXggbm9uIHRyb3ZhdGk6IGVzZWd1aSBwcmltYSByZWVsLm1qcyB1bmEgdm9sdGEsIGxpIGluc3RhbGxhIGx1aSIpOwpjb25zdCBmYWlsID0gKCkgPT4geyBjb25zb2xlLmxvZygiRVJST1JJOlxuLSAiICsgZXJyLmpvaW4oIlxuLSAiKSArICh3YXJuLmxlbmd0aCA/ICJcbkFWVklTSTpcbi0gIiArIHdhcm4uam9pbigiXG4tICIpIDogIiIpKTsgcHJvY2Vzcy5leGl0KDEpOyB9OwppZiAoZXJyLmxlbmd0aCkgZmFpbCgpOwoKY29uc3QgZmYgPSAoZiwgZmFtLCB3KSA9PiBmcy5leGlzdHNTeW5jKHBhdGguam9pbihGT05UUywgZikpID8gYEBmb250LWZhY2V7Zm9udC1mYW1pbHk6JyR7ZmFtfSc7Zm9udC13ZWlnaHQ6JHt3fTtzcmM6dXJsKGRhdGE6Zm9udC93b2ZmMjtiYXNlNjQsJHtmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKEZPTlRTLCBmKSkudG9TdHJpbmcoImJhc2U2NCIpfSkgZm9ybWF0KCd3b2ZmMicpfWAgOiAiIjsKY29uc3QgRk9OVENTUyA9IGZmKCJpYm0tcGxleC1zZXJpZi1sYXRpbi02MDAtbm9ybWFsLndvZmYyIiwgIlBTIiwgNjAwKSArIGZmKCJpYm0tcGxleC1zYW5zLWxhdGluLTQwMC1ub3JtYWwud29mZjIiLCAiUFNhIiwgNDAwKSArIGZmKCJpYm0tcGxleC1tb25vLWxhdGluLTUwMC1ub3JtYWwud29mZjIiLCAiUE0iLCA1MDApOwpjb25zdCBlc2MgPSAocykgPT4gU3RyaW5nKHMpLnJlcGxhY2UoLyYvZywgIiZhbXA7IikucmVwbGFjZSgvPC9nLCAiJmx0OyIpOwpjb25zdCByaWNoID0gKHMpID0+IGVzYyhzKS5yZXBsYWNlKC9cKiguKz8pXCovZywgIjxiPiQxPC9iPiIpOwpjb25zdCBodG1sID0gYDxzdHlsZT4ke0ZPTlRDU1N9Ym9keXttYXJnaW46MDt3aWR0aDoxMDgwcHg7aGVpZ2h0OjE5MjBweDtiYWNrZ3JvdW5kOiMwQjExMTc7b3ZlcmZsb3c6aGlkZGVufQouYnJhbmR7cG9zaXRpb246YWJzb2x1dGU7dG9wOjE1NHB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udDo2MDAgNDZweCBQUztjb2xvcjojRTRFQUVGO2xldHRlci1zcGFjaW5nOi4wNGVtO3otaW5kZXg6M30KLnJlY3twb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjU4cHg7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjt6LWluZGV4OjN9LnJlYyBzcGFue2Rpc3BsYXk6aW5saW5lLWJsb2NrO2ZvbnQ6NTAwIDMwcHgvMSBQTTtsZXR0ZXItc3BhY2luZzouMTJlbTtjb2xvcjojMEIxMTE3O2JhY2tncm91bmQ6I0U4QjA1MDtwYWRkaW5nOjEycHggMjRweDtib3JkZXItcmFkaXVzOjk5OXB4fQouZmFkZXtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7cmlnaHQ6MDtib3R0b206MDtoZWlnaHQ6ODIwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQocmdiYSgxMSwxNywyMywwKSwjMEIxMTE3IDM1JSk7ei1pbmRleDoyfQoudGFne3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6Mztmb250OjUwMCAyNnB4LzEgUE07bGV0dGVyLXNwYWNpbmc6LjFlbTtjb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgxMSwxNywyMywuOCk7Ym9yZGVyOjJweCBzb2xpZCAjRThCMDUwO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjhweCAxMnB4O3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtMTQwJSk7d2hpdGUtc3BhY2U6bm93cmFwO29wYWNpdHk6MH0KI3R7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo4MHB4O3JpZ2h0OjEwMHB4O3RvcDoxMzMwcHg7ei1pbmRleDozfS5oe2ZvbnQ6NjAwIDk2cHgvMS4wNiBQUztjb2xvcjojRTRFQUVGfS5oIGJ7Y29sb3I6I0U4QjA1MDtmb250LXdlaWdodDo2MDB9LnN7bWFyZ2luLXRvcDoyNnB4O2ZvbnQ6NDAwIDM4cHgvMS4zNSBQU2E7Y29sb3I6I0I5QzZEMn08L3N0eWxlPgo8Y2FudmFzIGlkPSJjIiB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxOTIwIiBzdHlsZT0icG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowIj48L2NhbnZhcz48ZGl2IGNsYXNzPSJmYWRlIj48L2Rpdj4KPGRpdiBjbGFzcz0iYnJhbmQiPlJFQUQgR0VPUE9MSVRJQ1M8L2Rpdj48ZGl2IGNsYXNzPSJyZWMiPjxzcGFuPiR7ZXNjKHBsYWluKHNwZWMubGFiZWwpKX08L3NwYW4+PC9kaXY+CjxkaXYgaWQ9InQiPjxkaXYgY2xhc3M9ImgiPiR7cmljaChzcGVjLnRpdGxlKX08L2Rpdj4ke3NwZWMuc3ViID8gYDxkaXYgY2xhc3M9InMiPiR7cmljaChzcGVjLnN1Yil9PC9kaXY+YCA6ICIifTwvZGl2PmA7CmNvbnN0IGJyID0gYXdhaXQgY2hyb21pdW0ubGF1bmNoKHsgZXhlY3V0YWJsZVBhdGg6IHByb2Nlc3MuZW52LkNIUk9NSVVNIHx8IChmcy5leGlzdHNTeW5jKCIvb3B0L3B3LWJyb3dzZXJzL2Nocm9taXVtIikgPyAiL29wdC9wdy1icm93c2Vycy9jaHJvbWl1bSIgOiB1bmRlZmluZWQpLCBhcmdzOiBbIi0tbm8tc2FuZGJveCJdIH0pOwpjb25zdCBwID0gYXdhaXQgYnIubmV3UGFnZSh7IHZpZXdwb3J0OiB7IHdpZHRoOiAxMDgwLCBoZWlnaHQ6IDE5MjAgfSB9KTsKYXdhaXQgcC5zZXRDb250ZW50KGh0bWwpOwpmb3IgKGNvbnN0IGYgb2YgWyJkMy1hcnJheS9kaXN0L2QzLWFycmF5Lm1pbi5qcyIsICJkMy1nZW8vZGlzdC9kMy1nZW8ubWluLmpzIiwgInRvcG9qc29uLWNsaWVudC9kaXN0L3RvcG9qc29uLWNsaWVudC5taW4uanMiXSkgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKE5NLCBmKSkpIGF3YWl0IHAuYWRkU2NyaXB0VGFnKHsgcGF0aDogcGF0aC5qb2luKE5NLCBmKSB9KTsKYXdhaXQgcC5ldmFsdWF0ZSgoKSA9PiBkb2N1bWVudC5mb250cy5yZWFkeSk7CmNvbnN0IGluZm8gPSBhd2FpdCBwLmV2YWx1YXRlKCh7IGdlbywgTFYsIFQgfSkgPT4gewogIGNvbnN0IGZlYXRzID0gdG9wb2pzb24uZmVhdHVyZShnZW8sIGdlby5vYmplY3RzLmNvdW50cmllcykuZmVhdHVyZXMsIEMgPSBbIiMxRTJBMzMiLCAiIzJBNDU1NSIsICIjNkU1QTI2IiwgIiM5QzVCMjYiLCAiI0IyNEIzMSIsICIjRDg2MDZFIl07CiAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImMiKS5nZXRDb250ZXh0KCIyZCIpLCBjeCA9IDU0MCwgY3kgPSA4NTAsIFIgPSA0NzA7CiAgY29uc3QgcHJvaiA9IGQzLmdlb09ydGhvZ3JhcGhpYygpLnRyYW5zbGF0ZShbY3gsIGN5XSkuc2NhbGUoUikuY2xpcEFuZ2xlKDkwKSwgcGF0aCA9IGQzLmdlb1BhdGgocHJvaiwgY3R4KTsKICBjb25zdCBjZW4gPSB7fTsgZmVhdHMuZm9yRWFjaCgoZikgPT4gKGNlbltmLmlkXSA9IGQzLmdlb0NlbnRyb2lkKGYpKSk7CiAgLy8gY2VudHJvIGRlbCBnbG9ibzogbWVkaWEgZGVpIHBhZXNpIGRlbGxlIG5vdGl6aWUgKHZldHRvcmkgc3VsbGEgc2ZlcmEpLCBjb3PDrCBzaSB2ZWRvbm8gdHV0dGkKICBsZXQgdnggPSAwLCB2eSA9IDAsIHZ6ID0gMDsgVC5mb3JFYWNoKCh4KSA9PiB7IGNvbnN0IFtsbywgbGFdID0gY2VuW3guY291bnRyeV0ubWFwKCh2KSA9PiAodiAqIE1hdGguUEkpIC8gMTgwKTsgdnggKz0gTWF0aC5jb3MobGEpICogTWF0aC5jb3MobG8pOyB2eSArPSBNYXRoLmNvcyhsYSkgKiBNYXRoLnNpbihsbyk7IHZ6ICs9IE1hdGguc2luKGxhKTsgfSk7CiAgY29uc3QgQzAgPSBbKE1hdGguYXRhbjIodnksIHZ4KSAqIDE4MCkgLyBNYXRoLlBJLCAoTWF0aC5hdGFuMih2eiwgTWF0aC5oeXBvdCh2eCwgdnkpKSAqIDE4MCkgLyBNYXRoLlBJXTsKICBjb25zdCB0YWdzID0ge307IFQuZm9yRWFjaCgoeCkgPT4geyBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiZGl2Iik7IGQuY2xhc3NOYW1lID0gInRhZyI7IGQudGV4dENvbnRlbnQgPSB4LmxhYmVsOyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpOyB0YWdzW3guY291bnRyeV0gPSBkOyB9KTsKICBjb25zdCB0dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0IiksIGNsID0gKHgpID0+IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHgpKSwgc2VnID0gKHQsIGEsIGIpID0+IGNsKCh0IC0gYSkgLyAoYiAtIGEpKTsKICB3aW5kb3cucmVuZGVyID0gKHQpID0+IHsKICAgIHByb2oucm90YXRlKFstQzBbMF0gLSAodCAtIDIpICogMywgLUMwWzFdXSk7CiAgICBjb25zdCBzd2VlcCA9IC1NYXRoLlBJIC8gMiArIHQgKiBNYXRoLlBJOyAvLyB1biBnaXJvIG9nbmkgMiBzOiBkdWUgYmF0dHV0ZSBhIDEyMCBicG0KICAgIGNvbnN0IGJhY2sgPSAoeCwgeSkgPT4geyBsZXQgYSA9IE1hdGguYXRhbjIoeSAtIGN5LCB4IC0gY3gpIC0gc3dlZXA7IGEgPSAoKGEgJSAoMiAqIE1hdGguUEkpKSArIDIgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSk7IHJldHVybiAyICogTWF0aC5QSSAtIGE7IH07CiAgICBjb25zdCBzaW5jZSA9ICh4LCB5KSA9PiB7IGxldCBmID0gTWF0aC5hdGFuMih5IC0gY3ksIHggLSBjeCkgKyBNYXRoLlBJIC8gMjsgZiA9ICgoZiAlICgyICogTWF0aC5QSSkpICsgMiAqIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKTsgcmV0dXJuIHQgKiBNYXRoLlBJID49IGYgPyB0ICogTWF0aC5QSSAtIGYgOiAtMTsgfTsKICAgIGNvbnN0IGZhID0gc2VnKHQsIDAsIDAuMyk7CiAgICBjdHguZmlsbFN0eWxlID0gIiMwQjExMTciOyBjdHguZmlsbFJlY3QoMCwgMCwgMTA4MCwgMTkyMCk7IGN0eC5nbG9iYWxBbHBoYSA9IGZhOwogICAgY3R4LmJlZ2luUGF0aCgpOyBwYXRoKHsgdHlwZTogIlNwaGVyZSIgfSk7IGN0eC5maWxsU3R5bGUgPSAiIzBFMUEyNCI7IGN0eC5maWxsKCk7CiAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgoZDMuZ2VvR3JhdGljdWxlMTAoKSk7IGN0eC5zdHJva2VTdHlsZSA9ICJyZ2JhKDEzNCwxODAsMjM0LC4wNikiOyBjdHgubGluZVdpZHRoID0gMTsgY3R4LnN0cm9rZSgpOwogICAgZm9yIChjb25zdCBmIG9mIGZlYXRzKSB7IGNvbnN0IGwgPSBMVltmLmlkXSB8fCAwLCBxID0gcHJvaihjZW5bZi5pZF0pOyBsZXQgbGl0ID0gMDsgaWYgKHEgJiYgc2luY2UocVswXSwgcVsxXSkgPj0gMCkgbGl0ID0gTWF0aC5tYXgoMC4zNSwgMSAtIGJhY2socVswXSwgcVsxXSkgLyAyLjQpOwogICAgICBjdHguYmVnaW5QYXRoKCk7IHBhdGgoZik7IGN0eC5nbG9iYWxBbHBoYSA9ICgwLjE4ICsgMC44MiAqIGxpdCkgKiBmYTsgY3R4LmZpbGxTdHlsZSA9IENbbF07IGN0eC5maWxsKCk7IGN0eC5nbG9iYWxBbHBoYSA9IGZhOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgxMSwxNywyMywuOSkiOyBjdHgubGluZVdpZHRoID0gMC44OyBjdHguc3Ryb2tlKCk7IH0KICAgIGN0eC5zYXZlKCk7IGN0eC5iZWdpblBhdGgoKTsgcGF0aCh7IHR5cGU6ICJTcGhlcmUiIH0pOyBjdHguY2xpcCgpOwogICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gNDsgaSsrKSB7IGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhjeCwgY3ksIChSICogaSkgLyA0LCAwLCA3KTsgY3R4LnN0cm9rZVN0eWxlID0gInJnYmEoMjMyLDE3Niw4MCwuMTYpIjsgY3R4LmxpbmVXaWR0aCA9IDI7IGN0eC5zdHJva2UoKTsgfQogICAgY3R4LmJlZ2luUGF0aCgpOyBjdHgubW92ZVRvKGN4IC0gUiwgY3kpOyBjdHgubGluZVRvKGN4ICsgUiwgY3kpOyBjdHgubW92ZVRvKGN4LCBjeSAtIFIpOyBjdHgubGluZVRvKGN4LCBjeSArIFIpOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgyMzIsMTc2LDgwLC4xMikiOyBjdHguc3Ryb2tlKCk7CiAgICBjb25zdCBnID0gY3R4LmNyZWF0ZUNvbmljR3JhZGllbnQoc3dlZXAgLSAyLjIsIGN4LCBjeSksIGsgPSAyLjIgLyAoMiAqIE1hdGguUEkpOyBnLmFkZENvbG9yU3RvcCgwLCAicmdiYSgyMzIsMTc2LDgwLDApIik7IGcuYWRkQ29sb3JTdG9wKGssICJyZ2JhKDIzMiwxNzYsODAsLjMyKSIpOyBnLmFkZENvbG9yU3RvcChrICsgMC4wMDAxLCAicmdiYSgyMzIsMTc2LDgwLDApIik7IGcuYWRkQ29sb3JTdG9wKDEsICJyZ2JhKDIzMiwxNzYsODAsMCkiKTsKICAgIGN0eC5maWxsU3R5bGUgPSBnOyBjdHguYmVnaW5QYXRoKCk7IGN0eC5hcmMoY3gsIGN5LCBSLCAwLCA3KTsgY3R4LmZpbGwoKTsKICAgIGN0eC5iZWdpblBhdGgoKTsgY3R4Lm1vdmVUbyhjeCwgY3kpOyBjdHgubGluZVRvKGN4ICsgUiAqIE1hdGguY29zKHN3ZWVwKSwgY3kgKyBSICogTWF0aC5zaW4oc3dlZXApKTsgY3R4LnN0cm9rZVN0eWxlID0gInJnYmEoMjU1LDIyNiwxNjAsLjk1KSI7IGN0eC5saW5lV2lkdGggPSA0OyBjdHguc2hhZG93Q29sb3IgPSAiI0U4QjA1MCI7IGN0eC5zaGFkb3dCbHVyID0gMjQ7IGN0eC5zdHJva2UoKTsgY3R4LnNoYWRvd0JsdXIgPSAwOwogICAgY3R4LnJlc3RvcmUoKTsKICAgIGN0eC5iZWdpblBhdGgoKTsgcGF0aCh7IHR5cGU6ICJTcGhlcmUiIH0pOyBjdHguc3Ryb2tlU3R5bGUgPSAicmdiYSgyMzIsMTc2LDgwLC41NSkiOyBjdHgubGluZVdpZHRoID0gMzsgY3R4LnN0cm9rZSgpOwogICAgVC5mb3JFYWNoKCh4KSA9PiB7IGNvbnN0IHEgPSBwcm9qKGNlblt4LmNvdW50cnldKSwgdGcgPSB0YWdzW3guY291bnRyeV07IGlmICghcSkgeyB0Zy5zdHlsZS5vcGFjaXR5ID0gMDsgcmV0dXJuOyB9IGNvbnN0IHMgPSBzaW5jZShxWzBdLCBxWzFdKTsgaWYgKHMgPCAwKSB7IHRnLnN0eWxlLm9wYWNpdHkgPSAwOyByZXR1cm47IH0KICAgICAgY29uc3QgYSA9IGNsKHMgLyAwLjM1KSwgcGggPSAoKHMgLyBNYXRoLlBJKSAqIDIpICUgMTsKICAgICAgY3R4LmJlZ2luUGF0aCgpOyBjdHguYXJjKHFbMF0sIHFbMV0sIDEyLCAwLCA3KTsgY3R4LmZpbGxTdHlsZSA9IGByZ2JhKDI1NSwyNDAsMjIwLCR7YX0pYDsgY3R4LnNoYWRvd0NvbG9yID0gIiNmZmYiOyBjdHguc2hhZG93Qmx1ciA9IDIyOyBjdHguZmlsbCgpOyBjdHguc2hhZG93Qmx1ciA9IDA7CiAgICAgIGN0eC5iZWdpblBhdGgoKTsgY3R4LmFyYyhxWzBdLCBxWzFdLCAxNCArIHBoICogNDYsIDAsIDcpOyBjdHguc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMjQwLDIyMCwkeygxIC0gcGgpICogMC44fSlgOyBjdHgubGluZVdpZHRoID0gMzsgY3R4LnN0cm9rZSgpOwogICAgICB0Zy5zdHlsZS5sZWZ0ID0gcVswXSArICJweCI7IHRnLnN0eWxlLnRvcCA9IHFbMV0gLSAxNCArICJweCI7IHRnLnN0eWxlLm9wYWNpdHkgPSBhOyB9KTsKICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7CiAgICBjb25zdCBocCA9IHNlZyh0LCAwLjksIDEuMyk7IHR0LnN0eWxlLm9wYWNpdHkgPSBocDsgdHQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHsoMSAtIGhwKSAqIDI0fXB4KWA7CiAgfTsKICB3aW5kb3cucmVuZGVyKDQpOwogIGNvbnN0IGhpZGRlbiA9IFQuZmlsdGVyKCh4KSA9PiAhcHJvaihjZW5beC5jb3VudHJ5XSkpLm1hcCgoeCkgPT4geC5jb3VudHJ5KTsKICByZXR1cm4geyBib3R0b206IE1hdGgucm91bmQodHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tKSwgaGlkZGVuIH07Cn0sIHsgZ2VvLCBMVjogc3BlYy5sZXZlbHMsIFQgfSk7CmlmIChpbmZvLmJvdHRvbSA+IDE2NjApIGVyci5wdXNoKGB0aXRsZS9zdWI6IGlsIHRlc3RvIGZpbmlzY2UgYSAke2luZm8uYm90dG9tfSBweCwgb2x0cmUgbGEgem9uYSBzaWN1cmEgKDE2NjApOiBhY2NvcmNpYWApOwppZiAoaW5mby5oaWRkZW4ubGVuZ3RoKSB3YXJuLnB1c2goYHBhZXNpIHN1bCByZXRybyBkZWwgZ2xvYm8sIG5vbiBzaSB2ZWRyYW5ubzogJHtpbmZvLmhpZGRlbi5qb2luKCIsICIpfSAobm90aXppZSB0cm9wcG8gbG9udGFuZSB0cmEgbG9ybzogdGllbmlsaSBjb211bnF1ZSwgaWwgY29ycG8gZGVsIHJlZWwgbGkgbW9zdHJhKWApOwppZiAobW9kZSA9PT0gImNoZWNrIikgeyBhd2FpdCBici5jbG9zZSgpOyBpZiAoZXJyLmxlbmd0aCkgZmFpbCgpOyBjb25zb2xlLmxvZygic3BlY2lmaWNhIG9rIMK3IHJhZGFyICIgKyBEVVIgKyAiIHMiICsgKHdhcm4ubGVuZ3RoID8gIlxuQVZWSVNJOlxuLSAiICsgd2Fybi5qb2luKCJcbi0gIikgOiAiIikpOyBwcm9jZXNzLmV4aXQoMCk7IH0KaWYgKGVyci5sZW5ndGgpIHsgYXdhaXQgYnIuY2xvc2UoKTsgZmFpbCgpOyB9CmNvbnN0IE1VU0lDID0gcHJvY2Vzcy5lbnYuUkdfTVVTSUM7CmlmICghTVVTSUMgfHwgIWZzLmV4aXN0c1N5bmMoTVVTSUMpKSB7IGF3YWl0IGJyLmNsb3NlKCk7IGNvbnNvbGUubG9nKCJtYW5jYSBsYSBtdXNpY2Egb3JpZ2luYWxlOiBpbXBvc3RhIFJHX01VU0lDIik7IHByb2Nlc3MuZXhpdCgyKTsgfQppZiAoIWZzLmV4aXN0c1N5bmMoYm9keUluKSkgeyBhd2FpdCBici5jbG9zZSgpOyBjb25zb2xlLmxvZygiY29ycG8gZGVsIHJlZWwgbm9uIHRyb3ZhdG86ICIgKyBib2R5SW4pOyBwcm9jZXNzLmV4aXQoMik7IH0KY29uc3Qgb2QgPSBwYXRoLmRpcm5hbWUocGF0aC5yZXNvbHZlKG91dCkpLCB3b3JrID0gcGF0aC5qb2luKG9kLCAid29ya19yYWRhciIpOyBmcy5ybVN5bmMod29yaywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pOyBmcy5ta2RpclN5bmMod29yaywgeyByZWN1cnNpdmU6IHRydWUgfSk7CmNvbnN0IE4gPSBNYXRoLnJvdW5kKERVUiAqIEZQUyk7CmZvciAobGV0IG4gPSAwOyBuIDwgTjsgbisrKSB7IGF3YWl0IHAuZXZhbHVhdGUoKHQpID0+IHdpbmRvdy5yZW5kZXIodCksIG4gLyBGUFMpOyBhd2FpdCBwLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLmpvaW4od29yaywgU3RyaW5nKG4pLnBhZFN0YXJ0KDUsICIwIikgKyAiLmpwZyIpLCB0eXBlOiAianBlZyIsIHF1YWxpdHk6IDkwIH0pOyB9CmF3YWl0IGJyLmNsb3NlKCk7ClswLjgsIDIuMCwgMy42XS5mb3JFYWNoKCh0LCBpKSA9PiBmcy5jb3B5RmlsZVN5bmMocGF0aC5qb2luKHdvcmssIFN0cmluZyhNYXRoLnJvdW5kKHQgKiBGUFMpKS5wYWRTdGFydCg1LCAiMCIpICsgIi5qcGciKSwgcGF0aC5qb2luKG9kLCBgcmFkYXJfY2hlY2tfJHtpICsgMX0uanBnYCkpKTsKY29uc3QgZHVyID0gKGYpID0+IHBhcnNlRmxvYXQoc3Bhd25TeW5jKCJmZnByb2JlIiwgWyItdiIsICJlcnJvciIsICItc2hvd19lbnRyaWVzIiwgImZvcm1hdD1kdXJhdGlvbiIsICItb2YiLCAiZGVmYXVsdD1udz0xOm5rPTEiLCBmXSwgeyBlbmNvZGluZzogInV0ZjgiIH0pLnN0ZG91dCk7CmNvbnN0IEJEID0gZHVyKGJvZHlJbiksIE1EID0gZHVyKE1VU0lDKTsKaWYgKCEoQkQgPiA1KSkgeyBjb25zb2xlLmxvZygiZHVyYXRhIGRlbCBjb3JwbyBub24gbGVnZ2liaWxlIik7IHByb2Nlc3MuZXhpdCgxKTsgfQpjb25zdCBUT1QgPSBEVVIgKyBCRDsKaWYgKE1EID4gMCAmJiBUT1QgPiBNRCAtIDAuMikgeyBjb25zb2xlLmxvZyhgRVJST1JJOlxuLSByYWRhciArIGNvcnBvID0gJHtUT1QudG9GaXhlZCgxKX0gcywgcGnDuSBsdW5nbyBkZWxsYSBtdXNpY2EgKCR7TUQudG9GaXhlZCgxKX0gcyk6IGFjY29yY2lhIGlsIGNvcnBvICgzNC00MCBzKWApOyBwcm9jZXNzLmV4aXQoMSk7IH0KY29uc3QgciA9IHNwYXduU3luYygiZmZtcGVnIiwgWyItbG9nbGV2ZWwiLCAiZXJyb3IiLCAiLXkiLCAiLWZyYW1lcmF0ZSIsIFN0cmluZyhGUFMpLCAiLWkiLCBwYXRoLmpvaW4od29yaywgIiUwNWQuanBnIiksICItaSIsIGJvZHlJbiwgIi1pIiwgTVVTSUMsCiAgIi1maWx0ZXJfY29tcGxleCIsIGBbMDp2XXNjYWxlPTEwODA6MTkyMCxzZXRzYXI9MSxmcHM9JHtGUFN9LGZvcm1hdD15dXY0MjBwW2FdO1sxOnZdc2NhbGU9MTA4MDoxOTIwLHNldHNhcj0xLGZwcz0ke0ZQU30sZm9ybWF0PXl1djQyMHBbYl07W2FdW2JdY29uY2F0PW49Mjp2PTE6YT0wW3ZdO1syOmFdYXRyaW09MDoke1RPVC50b0ZpeGVkKDIpfSxhZmFkZT10PW91dDpzdD0keyhUT1QgLSAyLjUpLnRvRml4ZWQoMil9OmQ9Mi41W21dYCwKICAiLW1hcCIsICJbdl0iLCAiLW1hcCIsICJbbV0iLCAiLWM6diIsICJsaWJ4MjY0IiwgIi1wcmVzZXQiLCAibWVkaXVtIiwgIi1jcmYiLCAiMjEiLCAiLXBpeF9mbXQiLCAieXV2NDIwcCIsICItYzphIiwgImFhYyIsICItYjphIiwgIjEyOGsiLCAiLXQiLCBUT1QudG9GaXhlZCgyKSwgIi1tb3ZmbGFncyIsICIrZmFzdHN0YXJ0Iiwgb3V0XSwgeyBzdGRpbzogImluaGVyaXQiIH0pOwppZiAoci5zdGF0dXMgIT09IDApIHsgY29uc29sZS5sb2coImZmbXBlZyBub24gcml1c2NpdG8iKTsgcHJvY2Vzcy5leGl0KDEpOyB9CmNvbnN0IG1iID0gZnMuc3RhdFN5bmMob3V0KS5zaXplIC8gMTA0ODU3NjsKY29uc29sZS5sb2coYG9rOiAke291dH0gwrcgJHtUT1QudG9GaXhlZCgxKX0gcyAocmFkYXIgJHtEVVJ9IHMgKyBjb3JwbyAke0JELnRvRml4ZWQoMSl9IHMpIMK3ICR7bWIudG9GaXhlZCgxKX0gTUIgwrcgY29udHJvbGxpOiAke29kfS9yYWRhcl9jaGVja18xLi4zLmpwZ2ApOwppZiAobWIgPiAxMCkgY29uc29sZS5sb2coIkFUVEVOWklPTkU6IGZpbGUgc29wcmEgMTAgTUIiKTsK"
};

async function igPublic(request, env, p, url) {
  const redirect = url.origin + "/ig/callback";
  if (p === "/ig/connect") {
    if (!safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "")) return htmlPage("Accesso negato", "<p>Chiave mancante o errata.</p>", 401);
    if (!env.IG_APP_SECRET) return htmlPage("Manca IG_APP_SECRET", "<p>Aggiungi il secret IG_APP_SECRET al Worker e riprova.</p>", 500);
    const state = crypto.randomUUID().replace(/-/g, "");
    await kvSet(env, "ig_state", { state, exp: Date.now() + 10 * 60000 });
    const u = "https://www.instagram.com/oauth/authorize?" + new URLSearchParams({
      client_id: IG_APP_ID, redirect_uri: redirect, response_type: "code", scope: IG_SCOPE, state,
    });
    return Response.redirect(u, 302);
  }
  if (p === "/ig/kit/versione") {
    const out = {};
    for (const f of Object.keys(IG_KIT)) {
      const bin = Uint8Array.from(atob(IG_KIT[f]), (c) => c.charCodeAt(0));
      const h = new Uint8Array(await crypto.subtle.digest("SHA-256", bin));
      out[f] = Array.from(h).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
    }
    return new Response(JSON.stringify(out), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  { const m = p.match(/^\/ig\/kit\/(igkit\.mjs|package\.json|rubriche\.mjs|siteshots\.mjs|numero\.mjs|reel\.mjs|sitoreel\.mjs|globo\.mjs|apertura\.mjs|radar\.mjs|spiegato\.mjs)$/);
    if (m) {
      const bin = Uint8Array.from(atob(IG_KIT[m[1]]), (c) => c.charCodeAt(0));
      return new Response(bin, { headers: { "content-type": m[1].endsWith(".json") ? "application/json" : "text/javascript; charset=utf-8", "cache-control": "no-store" } });
    } }
  if (p === "/ig/pod/cover.jpg") {
    const r = await fetch(POD.cover, { cf: { cacheTtl: 86400, cacheEverything: true } });
    if (!r.ok) return new Response("not found", { status: 404 });
    return new Response(r.body, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" } });
  }
  if (/^\/ig\/panel-(180|192|512)\.png$/.test(p)) { // icone del pannello incorporate: stessa origine del manifest, nessuna dipendenza dal sito
    const bin = Uint8Array.from(atob(PANEL_PNG[p.slice(10, 13)]), (c) => c.charCodeAt(0));
    return new Response(bin, { headers: { "content-type": "image/png", "cache-control": "public, max-age=86400" } });
  }
  if (p === "/ig/sw.js") return new Response('self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));self.addEventListener("fetch",e=>{if(e.request.mode==="navigate")e.respondWith(fetch(e.request))});', { headers: { "content-type": "text/javascript", "cache-control": "no-cache", "service-worker-allowed": "/ig/" } });
  if (p === "/ig/panel.svg") return new Response(PANEL_ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400" } });
  if (p === "/ig/panel.webmanifest") return new Response(JSON.stringify({ name: "Pannello Read Geopolitics", short_name: "Pannello RG", start_url: "/ig/panel", scope: "/ig/", display: "standalone", background_color: "#0E151B", theme_color: "#0B1830", id: "/ig/panel", icons: [192, 512].map((n) => ({ src: "/ig/panel-" + n + ".png", sizes: n + "x" + n, type: "image/png", purpose: "any" })) }), { headers: { "content-type": "application/manifest+json", "cache-control": "public, max-age=86400" } });
  if (p === "/ig/panel") {
    const okK = safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "");
    if (!okK && !(await sessionOk(request, env))) return new Response(LOGIN_PAGE(""), { status: 401, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    return new Response(PANEL_PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
  if (request.method === "POST" && p === "/ig/login") {
    const b = await request.json().catch(() => ({}));
    const ip = request.headers.get("cf-connecting-ip") || "x";
    const rl = (await kvGet(env, "rl:" + ip)) || { n: 0, t: Date.now() };
    if (Date.now() - rl.t > 900000) { rl.n = 0; rl.t = Date.now(); }
    if (rl.n >= 5) return json({ ok: false, error: "troppi_tentativi" }, 429);
    const secret = env.PANEL_PASSWORD || env.WRITE_TOKEN || "";
    if (!safeEq(String(b.password || ""), secret)) { rl.n++; await kvSet(env, "rl:" + ip, rl); return json({ ok: false, error: "password_errata" }, 401); }
    await kvDel(env, "rl:" + ip);
    const id = rid();
    await kvSet(env, "sess:" + id, { exp: Date.now() + 30 * 86400000 });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json", "set-cookie": "rg_sess=" + id + "; Path=/ig; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000" } });
  }
  if (p === "/ig/logout") {
    const id = getCookie(request, "rg_sess"); if (id) await kvDel(env, "sess:" + id);
    return new Response(null, { status: 302, headers: { location: "/ig/panel", "set-cookie": "rg_sess=; Path=/ig; HttpOnly; Secure; SameSite=Strict; Max-Age=0" } });
  }
  if (p === "/ig/test") {
    if (!safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "")) return htmlPage("Accesso negato", "<p>Chiave mancante o errata.</p>", 401);
    return new Response(TEST_PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  { const m = p.match(/^\/ig\/vid\/([0-9a-f]{32})\.mp4$/);
    if (m) return await igServeVideo(request, env, m[1]); }
  { const m = p.match(/^\/ig\/img\/([0-9a-f]{32})\.jpg$/);
    if (m) {
      const b64 = await kvGet(env, "img:" + m[1]);
      if (!b64) return new Response("not found", { status: 404 });
      const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      return new Response(bin, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=86400" } });
    } }
  if (p === "/ig/status") {
    if (!safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "")) return htmlPage("Accesso negato", "<p>Chiave mancante o errata.</p>", 401);
    let t;
    try { t = await igSeed(env); } catch (e) { return htmlPage("Token non valido", `<p>Instagram ha rifiutato il token: ${esc(JSON.stringify(e.detail || e).slice(0, 400))}</p>`, 502); }
    if (!t) return htmlPage("Non collegato", `<p>Nessun token salvato. ${env.IG_SEED_TOKEN ? "" : "Il secret IG_SEED_TOKEN non è presente."}</p>`);
    const days = Math.floor((Date.parse(t.expires_at) - Date.now()) / 86400000);
    return htmlPage("Instagram collegato ✅", `<p>Account: <b>${esc(t.username || "?")}</b> (${esc(t.account_type || "tipo non letto")})</p><p>Giorni rimasti al token: ${days}</p>`);
  }
  if (p === "/ig/callback") {
    const err = url.searchParams.get("error_description") || url.searchParams.get("error");
    if (err) return htmlPage("Instagram ha rifiutato", `<p>${esc(err)}</p>`, 400);
    const code = (url.searchParams.get("code") || "").replace(/#_$/, "");
    const st = await kvGet(env, "ig_state");
    if (!code || !st || st.exp < Date.now() || !safeEq(url.searchParams.get("state") || "", st.state))
      return htmlPage("Richiesta non valida", "<p>Stato scaduto o non riconosciuto. Riapri il link /ig/connect e riprova.</p>", 400);
    await kvDel(env, "ig_state");
    // 1) codice -> token breve
    let r = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: IG_APP_ID, client_secret: env.IG_APP_SECRET, grant_type: "authorization_code", redirect_uri: redirect, code }),
    });
    let j = await gj(r);
    const first = j && j.data && j.data[0] ? j.data[0] : j;
    if (!first.access_token) return htmlPage("Scambio del codice fallito", `<pre>${esc(JSON.stringify(j))}</pre>`, 502);
    // 2) token breve -> token lungo (60 giorni)
    r = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(env.IG_APP_SECRET)}&access_token=${encodeURIComponent(first.access_token)}`);
    j = await gj(r);
    if (!j.access_token) return htmlPage("Token lungo fallito", `<pre>${esc(JSON.stringify(j).replace(first.access_token, "***"))}</pre>`, 502);
    const token = j.access_token;
    // 3) chi sei
    r = await fetch(`${IG_GRAPH}/me?fields=user_id,username,account_type&access_token=${encodeURIComponent(token)}`);
    const me = await gj(r);
    if (!me.username) return htmlPage("Token ottenuto ma profilo non leggibile", `<pre>${esc(JSON.stringify(me))}</pre>`, 502);
    await kvSet(env, "ig_token", { token, user_id: String(me.user_id || first.user_id), username: me.username, account_type: me.account_type || null, obtained_at: new Date().toISOString(), expires_at: new Date(Date.now() + (j.expires_in || 5184000) * 1000).toISOString() });
    return htmlPage("Instagram collegato ✅", `<p>Account: <b>@${esc(me.username)}</b> (${esc(me.account_type || "tipo non indicato")}).</p><p>Il token è salvato nel Worker e non viene mai mostrato. Puoi chiudere questa pagina.</p>`);
  }
  return fail(404, "no_route");
}

// Seed: se il token è stato generato a mano nella dashboard Meta ("Genera token"), lo si mette nel secret IG_SEED_TOKEN.
// Alla prima chiamata il Worker lo copia nel kv (con user_id e username letti da Instagram); da lì in poi si rinnova da solo.
async function igSeed(env) {
  let t = await kvGet(env, "ig_token");
  if (!env.IG_SEED_TOKEN) return t;
  const tok = String(env.IG_SEED_TOKEN).replace(/^["'\s]+|["'\s]+$/g, "").replace(/\s+/g, "");
  /* v19: se nel secret IG_SEED_TOKEN c'è un token NUOVO (per esempio dopo un cambio di password di Instagram, che invalida la sessione),
     il Worker lo prende al posto di quello salvato. Il token salvato si rinnova da solo e resta valido finché il secret non cambia. */
  const fp = tok.slice(0, 8) + tok.slice(-8);
  if (t && (t.seed_fp === fp || (!t.seed_fp && t.token === tok))) return t;
  const r = await fetch(`${IG_GRAPH}/me?fields=user_id,username,account_type&access_token=${encodeURIComponent(tok)}`);
  const me = await gj(r);
  if ((!r.ok || me.error || !(me.user_id || me.id)) && t) return t; /* il secret non è un token valido: si tiene quello salvato */
  if (!r.ok || me.error || !(me.user_id || me.id)) throw { status: 502, code: "seed_token_invalid", detail: { error: me.error || me, lunghezza_token: tok.length, inizia_con: tok.slice(0, 4), attesa: "inizia con IGAA, lunghezza di solito 180-300" } };
  t = { token: tok, user_id: String(me.user_id || me.id), username: me.username, account_type: me.account_type || null, obtained_at: new Date().toISOString(), expires_at: new Date(Date.now() + 58 * 86400000).toISOString(), seeded: true, seed_fp: fp };
  await kvSet(env, "ig_token", t);
  return t;
}
async function igToken(env) {
  const t = await igSeed(env);
  if (!t) throw { status: 409, code: "ig_not_connected", detail: "Apri /ig/connect?k=WRITE_TOKEN per collegare Instagram." };
  return t;
}
async function igCall(method, path, t, params = {}) {
  const q = new URLSearchParams({ ...params, access_token: t.token });
  const res = method === "GET" ? await fetch(`${IG_GRAPH}${path}?${q}`) : await fetch(`${IG_GRAPH}${path}`, { method, headers: { "content-type": "application/x-www-form-urlencoded" }, body: q });
  const j = await gj(res);
  if (!res.ok || j.error) throw { status: 502, code: "instagram_error", detail: j.error || j };
  return j;
}
async function igWaitReady(t, id, tries = 8, ms = 2000) {
  for (let i = 0; i < tries; i++) {
    const s = await igCall("GET", `/${id}`, t, { fields: "status_code,status" });
    if (s.status_code === "FINISHED" || !s.status_code) return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw { status: 502, code: "container_" + s.status_code, detail: s };
    await new Promise((r) => setTimeout(r, ms));
  }
  throw { status: 504, code: "container_not_ready" };
}
async function igRefresh(env) {
  const t = await igToken(env);
  const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(t.token)}`);
  const j = await gj(r);
  if (!j.access_token) throw { status: 502, code: "refresh_failed", detail: j };
  const n = { ...t, token: j.access_token, refreshed_at: new Date().toISOString(), expires_at: new Date(Date.now() + (j.expires_in || 5184000) * 1000).toISOString() };
  await kvSet(env, "ig_token", n);
  return n;
}
async function igPrivate(request, env, p, method) {
  if (method === "GET" && p === "/v1/ig/status") {
    const t = await igSeed(env);
    if (!t) return json({ ok: true, connected: false });
    return json({ ok: true, connected: true, username: t.username, account_type: t.account_type, user_id: t.user_id, obtained_at: t.obtained_at, expires_at: t.expires_at, days_left: Math.floor((Date.parse(t.expires_at) - Date.now()) / 86400000) });
  }
  if (method === "POST" && p === "/v1/ig/drafts") {
    const b = await request.json().catch(() => null);
    if (!b) return fail(400, "bad_json");
    const d = await draftCreate(env, new URL(request.url).origin, b);
    return json({ ok: true, id: d.id, status: d.status, mode: d.mode, publish_at: d.publish_at, image_urls: d.image_urls, video_url: d.video_url || null });
  }
  if (method === "GET" && p === "/v1/ig/plan") {
    const today = romeToday(); const plan = await igPlan(env);
    const dow = romeDow(today);
    return json({ ok: true, today, dow, today_entry: plan[dow - 1], scelta: (await igScelte(env))[today] || null, plan, templates: IG_TEMPLATES });
  }
  if (method === "GET" && p === "/v1/ig/requests") {
    await kvSet(env, "ig_req_seen", { at: new Date().toISOString() });
    const rs = (await kvList(env, "req:", 30)).filter((x) => x.stato === "in_coda").sort((a, z) => String(a.created_at).localeCompare(String(z.created_at)));
    return json({ ok: true, requests: rs.map(({ _k, _u, ...x }) => x) });
  }
  if (method === "POST" && p === "/v1/ig/requests") {
    const b = await request.json().catch(() => null);
    if (!b || typeof b.id !== "string") return fail(400, "bad_body");
    const r = await kvGet(env, "req:" + b.id);
    if (!r) return fail(404, "req_not_found");
    const note = clip(b.note, 400);
    if (b.action === "claim") { if (r.stato !== "in_coda") return fail(409, "bad_status", r.stato); r.stato = "in_lavorazione"; r.started_at = new Date().toISOString(); }
    else if (b.action === "done") { r.stato = "pronta"; r.draft_id = clip(b.draft_id, 80); r.done_at = new Date().toISOString(); if (note) r.esito = note; }
    else if (b.action === "fail") { r.stato = "errore"; r.esito = note || "senza dettagli"; r.done_at = new Date().toISOString(); }
    else return fail(400, "bad_action", "action: claim | done | fail");
    await kvSet(env, "req:" + r.id, r);
    return json({ ok: true, request: r });
  }
  if (method === "GET" && p === "/v1/ig/drafts") {
    const ds = await kvList(env, "draft:", 30);
    return json({ ok: true, drafts: ds.map(({ _k, _u, image_urls, ...x }) => ({ ...x, n_images: (image_urls || []).length })) });
  }
  if (method === "POST" && p === "/v1/ig/upload") {
    const b = await request.json().catch(() => null);
    if (!b || !b.data_base64) return fail(400, "data_base64_required");
    return json({ ok: true, url: await igStoreImage(env, new URL(request.url).origin, b.data_base64) });
  }
  if (method === "POST" && p === "/v1/ig/refresh") {
    const n = await igRefresh(env);
    return json({ ok: true, expires_at: n.expires_at });
  }
  if (method === "POST" && p === "/v1/ig/publish") {
    const b = await request.json().catch(() => null);
    if (!b) return fail(400, "bad_json");
    const finishOnly = async (t, uid, cid) => {
      const pub = await igCall("POST", `/${uid}/media_publish`, t, { creation_id: cid });
      let permalink = null;
      try { permalink = (await igCall("GET", `/${pub.id}`, t, { fields: "permalink" })).permalink; } catch (e) {}
      return json({ ok: true, media_id: pub.id, permalink });
    };
    if (b.creation_id) {
      const t0 = await igToken(env);
      const s0 = await igCall("GET", `/${b.creation_id}`, t0, { fields: "status_code,status" });
      if (s0.status_code === "ERROR" || s0.status_code === "EXPIRED") throw { status: 502, code: "container_" + s0.status_code, detail: s0 };
      if (s0.status_code && s0.status_code !== "FINISHED") return json({ ok: true, pending: true, creation_id: b.creation_id, status_code: s0.status_code });
      return await finishOnly(t0, t0.user_id, b.creation_id);
    }
    const type = b.type, urls = Array.isArray(b.image_urls) ? b.image_urls : [];
    if (type === "reel") {
      if (typeof b.video_url !== "string" || !/^https:\/\//.test(b.video_url)) return fail(400, "bad_video_url", "video_url: URL https pubblico (mp4)");
      const tr = await igToken(env);
      const cr = (await igCall("POST", `/${tr.user_id}/media`, tr, { media_type: "REELS", video_url: b.video_url, caption: String(b.caption || "").slice(0, 2200), share_to_feed: "true", ...(Number.isFinite(+b.thumb_offset) && +b.thumb_offset > 0 ? { thumb_offset: String(Math.round(+b.thumb_offset)) } : {}) })).id;
      try { await igWaitReady(tr, cr, 36, 2500); } catch (e) { if (e && e.code === "container_not_ready") return json({ ok: true, pending: true, creation_id: cr }); throw e; }
      if (b.dry_run) return json({ ok: true, dry_run: true, creation_id: cr, note: "contenitore creato, NON pubblicato" });
      return await finishOnly(tr, tr.user_id, cr);
    }
    if (!["image", "carousel", "story"].includes(type)) return fail(400, "bad_type", "type: image | carousel | story | reel");
    if (!urls.length || urls.some((u) => typeof u !== "string" || !/^https:\/\//.test(u))) return fail(400, "bad_urls", "image_urls: URL https pubblici (JPEG)");
    if (type !== "carousel" && urls.length !== 1) return fail(400, "one_url_only");
    if (type === "carousel" && (urls.length < 2 || urls.length > 10)) return fail(400, "carousel_2_to_10");
    const caption = String(b.caption || "").slice(0, 2200);
    const t = await igToken(env);
    const uid = t.user_id;
    let creation;
    if (type === "image") creation = (await igCall("POST", `/${uid}/media`, t, { image_url: urls[0], caption })).id;
    else if (type === "story") creation = (await igCall("POST", `/${uid}/media`, t, { image_url: urls[0], media_type: "STORIES" })).id;
    else {
      const kids = [];
      for (const u of urls) { const k = await igCall("POST", `/${uid}/media`, t, { image_url: u, is_carousel_item: "true" }); kids.push(k.id); }
      for (const k of kids) await igWaitReady(t, k);
      creation = (await igCall("POST", `/${uid}/media`, t, { media_type: "CAROUSEL", children: kids.join(","), caption })).id;
    }
    await igWaitReady(t, creation);
    if (b.dry_run) return json({ ok: true, dry_run: true, creation_id: creation, note: "contenitore creato, NON pubblicato" });
    const pub = await igCall("POST", `/${uid}/media_publish`, t, { creation_id: creation });
    let permalink = null;
    try { permalink = (await igCall("GET", `/${pub.id}`, t, { fields: "permalink" })).permalink; } catch (e) {}
    return json({ ok: true, media_id: pub.id, permalink });
  }
  return fail(404, "no_route");
}

// ===================== PODCAST (R2 + feed) =====================
// Binding R2 richiesto: PODCAST (bucket per gli mp3). Le puntate: tabella D1 `podcast`.
// Scrittura (token):  PUT  /v1/podcast/audio/AAAA-MM-GG.mp3   (corpo = mp3)
//                     POST /v1/podcast/episodes   {date,title,description,duration,chapters?}
//                     DELETE /v1/podcast/episodes/AAAA-MM-GG
// Lettura pubblica:   GET  /podcast/feed.xml   (RSS per Spotify, Apple, Amazon…)
//                     GET|HEAD /podcast/ep/AAAA-MM-GG.mp3   (con richieste parziali Range, richieste da Apple)
//                     GET  /api/podcast/latest   ·   GET /api/podcast/list
const POD = {
  title: "Read Geopolitics · Il mondo in 15 minuti",
  author: "Read Geopolitics",
  email: "hello@readgeopolitics.com",
  site: "https://www.readgeopolitics.com",
  cover: "https://www.readgeopolitics.com/podcast/cover.jpg",
  summary:
    "Ogni mattina la giornata internazionale e italiana in un quarto d'ora: prima i fatti in sessanta secondi, poi le storie che contano, con cosa dicono le fonti, perché sono importanti e le posizioni a confronto. " +
    "Tu ascolti, tu decidi. La voce è sintetica; i testi vengono dal briefing di Read Geopolitics, dove trovi tutte le fonti.",
};
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const xmlEsc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
async function podInit(env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS podcast (date TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, duration INTEGER, bytes INTEGER, chapters TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)").run();
}
const hms = (s) => { s = Math.max(0, Math.round(+s || 0)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); };

async function podPrivate(request, env, p, method) {
  if (!env.PODCAST) return fail(500, "manca_binding_r2", "aggiungi al Worker il binding R2 di nome PODCAST");
  await podInit(env);
  let m;
  if (method === "PUT" && (m = p.match(/^\/v1\/podcast\/audio\/(\d{4}-\d{2}-\d{2})\.mp3$/))) {
    const buf = await request.arrayBuffer();
    if (buf.byteLength < 20000) return fail(422, "audio_troppo_corto");
    if (buf.byteLength > 60000000) return fail(413, "audio_troppo_grande");
    await env.PODCAST.put("ep/" + m[1] + ".mp3", buf, { httpMetadata: { contentType: "audio/mpeg", cacheControl: "public, max-age=86400" } });
    return json({ ok: true, date: m[1], bytes: buf.byteLength });
  }
  if (method === "POST" && p === "/v1/podcast/episodes") {
    let b; try { b = await request.json(); } catch { return fail(400, "invalid_json"); }
    if (!b || !DATE_RE.test(b.date || "")) return fail(422, "bad_date");
    if (!b.title || String(b.title).length > 200) return fail(422, "bad_title");
    const obj = await env.PODCAST.head("ep/" + b.date + ".mp3");
    if (!obj) return fail(409, "audio_mancante", "prima carica l'mp3 con PUT /v1/podcast/audio/" + b.date + ".mp3");
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO podcast (date,title,description,duration,bytes,chapters,created_at,updated_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?7) " +
      "ON CONFLICT(date) DO UPDATE SET title=?2, description=?3, duration=?4, bytes=?5, chapters=?6, updated_at=?7"
    ).bind(b.date, String(b.title), String(b.description || "").slice(0, 3800), Math.round(+b.duration || 0), obj.size, b.chapters ? JSON.stringify(b.chapters).slice(0, 8000) : null, now).run();
    return json({ ok: true, date: b.date, bytes: obj.size, url: new URL(request.url).origin + "/podcast/ep/" + b.date + ".mp3", feed: new URL(request.url).origin + "/podcast/feed.xml" });
  }
  if (method === "DELETE" && (m = p.match(/^\/v1\/podcast\/episodes\/(\d{4}-\d{2}-\d{2})$/))) {
    await env.DB.prepare("DELETE FROM podcast WHERE date=?1").bind(m[1]).run();
    await env.PODCAST.delete("ep/" + m[1] + ".mp3");
    return json({ ok: true, deleted: m[1] });
  }
  if (method === "GET" && p === "/v1/podcast/episodes") {
    const { results } = await env.DB.prepare("SELECT * FROM podcast ORDER BY date DESC LIMIT 400").all();
    return json({ ok: true, episodes: results });
  }
  return fail(404, "no_route");
}

async function podPublic(request, env, p, url) {
  let m;
  if ((m = p.match(/^\/podcast\/ep\/(\d{4}-\d{2}-\d{2})\.mp3$/))) {
    if (!env.PODCAST) return fail(404, "not_found");
    const key = "ep/" + m[1] + ".mp3";
    const head = await env.PODCAST.head(key);
    if (!head) return new Response("not found", { status: 404, headers: CORS });
    const size = head.size;
    const base = { "content-type": "audio/mpeg", "accept-ranges": "bytes", "cache-control": "public, max-age=86400", etag: head.httpEtag, ...CORS };
    if (request.method === "HEAD") return new Response(null, { status: 200, headers: { ...base, "content-length": String(size) } });
    const rh = request.headers.get("range");
    const rm = rh && rh.match(/^bytes=(\d*)-(\d*)$/);
    if (rm && (rm[1] !== "" || rm[2] !== "")) {
      let start, end;
      if (rm[1] === "") { const n = Math.min(+rm[2], size); start = size - n; end = size - 1; }
      else { start = +rm[1]; end = rm[2] === "" ? size - 1 : Math.min(+rm[2], size - 1); }
      if (start >= size || start > end) return new Response(null, { status: 416, headers: { ...base, "content-range": "bytes */" + size } });
      const obj = await env.PODCAST.get(key, { range: { offset: start, length: end - start + 1 } });
      return new Response(obj.body, { status: 206, headers: { ...base, "content-length": String(end - start + 1), "content-range": `bytes ${start}-${end}/${size}` } });
    }
    const obj = await env.PODCAST.get(key);
    return new Response(obj.body, { status: 200, headers: { ...base, "content-length": String(size) } });
  }
  await podInit(env);
  if (p === "/api/podcast/latest") {
    const r = await env.DB.prepare("SELECT date,title,description,duration,chapters FROM podcast ORDER BY date DESC LIMIT 1").first();
    if (!r) return json({ ok: true, episode: null });
    return json({ ok: true, episode: { ...r, chapters: r.chapters ? JSON.parse(r.chapters) : null, url: url.origin + "/podcast/ep/" + r.date + ".mp3" } }, 200, { "cache-control": "public, max-age=300" });
  }
  if (p === "/api/podcast/list") {
    const { results } = await env.DB.prepare("SELECT date,title,duration FROM podcast ORDER BY date DESC LIMIT 60").all();
    return json({ ok: true, episodes: results.map((r) => ({ ...r, url: url.origin + "/podcast/ep/" + r.date + ".mp3" })) }, 200, { "cache-control": "public, max-age=300" });
  }
  if (p === "/podcast/feed.xml" || p === "/podcast/feed" || p === "/podcast") {
    const { results } = await env.DB.prepare("SELECT * FROM podcast ORDER BY date DESC LIMIT 300").all();
    const self = url.origin + "/podcast/feed.xml";
    const items = results.map((r) => {
      const pub = new Date(r.date + "T05:30:00Z").toUTCString();
      const enc = url.origin + "/podcast/ep/" + r.date + ".mp3";
      const desc = (r.description || "") + "\n\nLa voce è sintetica. Tutte le fonti nel briefing del giorno: " + POD.site;
      return `<item><title>${xmlEsc(r.title)}</title><description>${xmlEsc(desc)}</description><itunes:summary>${xmlEsc(desc)}</itunes:summary>` +
        `<enclosure url="${xmlEsc(enc)}" length="${r.bytes || 0}" type="audio/mpeg"/><guid isPermaLink="false">rg-podcast-${r.date}</guid>` +
        `<pubDate>${pub}</pubDate><itunes:duration>${hms(r.duration)}</itunes:duration><itunes:episodeType>full</itunes:episodeType><itunes:explicit>false</itunes:explicit><link>${xmlEsc(POD.site)}</link></item>`;
    }).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:podcast="https://podcastindex.org/namespace/1.0">
<channel>
<title>${xmlEsc(POD.title)}</title>
<link>${xmlEsc(POD.site)}</link>
<atom:link href="${xmlEsc(self)}" rel="self" type="application/rss+xml"/>
<language>it</language>
<copyright>© ${new Date().getUTCFullYear()} Read Geopolitics</copyright>
<description>${xmlEsc(POD.summary)}</description>
<itunes:summary>${xmlEsc(POD.summary)}</itunes:summary>
<itunes:author>${xmlEsc(POD.author)}</itunes:author>
<itunes:owner><itunes:name>${xmlEsc(POD.author)}</itunes:name><itunes:email>${xmlEsc(POD.email)}</itunes:email></itunes:owner>
<itunes:image href="${xmlEsc(POD.cover)}"/>
<image><url>${xmlEsc(POD.cover)}</url><title>${xmlEsc(POD.title)}</title><link>${xmlEsc(POD.site)}</link></image>
<itunes:category text="News"><itunes:category text="Daily News"/></itunes:category>
<itunes:explicit>false</itunes:explicit>
<itunes:type>episodic</itunes:type>
<podcast:locked>no</podcast:locked>
${items}
</channel>
</rss>`;
    return new Response(xml, { status: 200, headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=600", ...CORS } });
  }
  return null;
}


// ============ TikTok (v20) ============
// Due modalità:
//  - "bozza"   (predefinita): il contenuto arriva nella casella di TikTok (notifica nell'app). Apri, scegli il suono, pubblichi.
//                Funziona anche prima dell'audit di TikTok. Limite di TikTok: max 5 contenuti in attesa nelle 24 ore.
//  - "diretto": pubblica direttamente. Finché TikTok non ha approvato l'app (audit) funziona solo su account privati / visibilità "solo io".
// I video si caricano dal bucket R2 (igvid/<id>.mp4); le foto TikTok le scarica da /ig/img/<id>.jpg (serve il prefisso URL verificato).
const TT_API = "https://open.tiktokapis.com";
// Senza "Direct Post" attivo nell'app TikTok basta video.upload; se un giorno lo attivi, metti il secret TT_DIRECT=1 e ricollega.
const ttScope = (env) => "user.info.basic,video.upload" + (env.TT_DIRECT ? ",video.publish" : "");
const TT_DEFAULT = { mode: "bozza", auto: false, privacy: "PUBLIC_TO_EVERYONE" };
const TT_TYPES = ["reel", "carousel", "image"];
async function ttSettings(env) { return { ...TT_DEFAULT, ...((await kvGet(env, "tt_settings")) || {}) }; }
function ttClip(s, n) { s = String(s || "").trim(); if (s.length <= n) return s; s = s.slice(0, n); return /[\uD800-\uDBFF]$/.test(s) ? s.slice(0, -1) : s; }
const TT_MSG = {
  unaudited_client_can_only_post_to_private_accounts: "TikTok non ha ancora approvato l'app (audit): in modalità diretta può pubblicare solo su un account privato. Usa la modalità «bozza nella casella TikTok».",
  spam_risk_too_many_pending_share: "Ci sono già 5 contenuti in attesa nella casella di TikTok (limite di 24 ore): pubblicali o eliminali dall'app, poi riprova.",
  url_ownership_unverified: "TikTok non ha ancora verificato l'indirizzo da cui scarica le immagini: completa la verifica del prefisso URL (vedi riquadro TikTok in alto).",
  app_version_check_failed: "Aggiorna l'app TikTok sul telefono (serve la versione 31.8 o successiva).",
  privacy_level_option_mismatch: "La visibilità scelta non è tra quelle consentite dall'account TikTok.",
  access_token_invalid: "Collegamento TikTok scaduto o revocato: premi «Ricollega TikTok».",
  scope_not_authorized: "TikTok è collegato senza tutti i permessi: premi «Ricollega TikTok» e accetta tutto.",
  spam_risk_too_many_posts: "Raggiunto il limite giornaliero di post di TikTok: riprova domani.",
  spam_risk_user_banned_from_posting: "TikTok al momento non consente a questo account di pubblicare.",
  reached_active_user_cap: "Raggiunta la quota giornaliera dell'app su TikTok: riprova domani.",
  rate_limit_exceeded: "Troppe richieste a TikTok in un minuto: riprova tra poco.",
  invalid_param: "TikTok ha rifiutato un parametro",
};
const TT_FAIL = {
  file_format_check_failed: "formato del file non accettato", duration_check_failed: "durata del video non accettata",
  frame_rate_check_failed: "frame rate non accettato", picture_size_check_failed: "dimensioni dell'immagine non accettate",
  video_pull_failed: "TikTok non è riuscito a scaricare il video", photo_pull_failed: "TikTok non è riuscito a scaricare le immagini",
  publish_cancelled: "pubblicazione annullata", auth_removed: "l'accesso dell'app è stato revocato: ricollega TikTok",
  spam_risk_too_many_posts: "limite giornaliero di post raggiunto", spam_risk_user_banned_from_posting: "account bloccato dalla pubblicazione",
  spam_risk_text: "TikTok ha segnalato il testo come spam", spam_risk: "TikTok ha segnalato il contenuto come spam", internal: "errore interno di TikTok: riprova",
};
function ttMsg(code, message) { const m = TT_MSG[code]; return (m ? m + (code === "invalid_param" && message ? ": " + message : "") : (message || "Errore TikTok")) + " (" + code + ")"; }
async function ttExchange(env, params) {
  const r = await fetch(TT_API + "/v2/oauth/token/", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "cache-control": "no-cache" },
    body: new URLSearchParams({ client_key: env.TT_CLIENT_KEY || "", client_secret: env.TT_CLIENT_SECRET || "", ...params }),
  });
  return await gj(r);
}
function ttPack(j, old) {
  const now = Date.now(); old = old || {};
  return { ...old, access_token: j.access_token, refresh_token: j.refresh_token || old.refresh_token, open_id: j.open_id || old.open_id, scope: j.scope || old.scope,
    expires_at: now + (+j.expires_in || 86400) * 1000, refresh_expires_at: now + (+j.refresh_expires_in || 31536000) * 1000, refreshed_at: new Date().toISOString() };
}
async function ttToken(env) {
  const t = await kvGet(env, "tt_token");
  if (!t || !t.access_token) throw { status: 409, code: "tiktok_non_collegato", detail: "TikTok non è collegato: premi «Collega TikTok» nel pannello." };
  if (t.expires_at - Date.now() > 10 * 60000) return t;
  if (!t.refresh_token || t.refresh_expires_at < Date.now()) throw { status: 409, code: "tiktok_scaduto", detail: "Il collegamento TikTok è scaduto: premi «Ricollega TikTok»." };
  const j = await ttExchange(env, { grant_type: "refresh_token", refresh_token: t.refresh_token });
  if (!j.access_token) throw { status: 502, code: "tiktok_refresh", detail: "Rinnovo del collegamento TikTok fallito (" + (j.error || "?") + "): premi «Ricollega TikTok»." };
  const n = ttPack(j, t); await kvSet(env, "tt_token", n); return n;
}
async function ttCall(t, path, body) {
  const r = await fetch(TT_API + path, { method: "POST", headers: { authorization: "Bearer " + t.access_token, "content-type": "application/json; charset=UTF-8" }, body: JSON.stringify(body || {}) });
  const j = await gj(r);
  const code = (j.error && j.error.code) || ("http_" + r.status);
  if (code !== "ok") throw { status: 502, code: "tiktok_" + code, detail: ttMsg(code, j.error && j.error.message) };
  return j.data || {};
}
const ttErr = (e) => String((e && (typeof e.detail === "string" ? e.detail : e.detail ? JSON.stringify(e.detail) : e.message || e.code)) || e).slice(0, 500);

async function ttSend(env, id, by, force) {
  const d = await kvGet(env, "draft:" + id);
  if (!d) throw { status: 404, code: "draft_not_found" };
  if (!TT_TYPES.includes(d.type)) throw { status: 400, code: "tiktok_formato", detail: "Le storie non vanno su TikTok." };
  const old = await kvGet(env, "tt:" + id);
  if (old && ["invio", "in_elaborazione", "nella_casella", "pubblicato"].includes(old.status) && !force) throw { status: 409, code: "tiktok_gia_inviato", detail: old.status };
  const st = await ttSettings(env);
  const direct = st.mode === "diretto";
  const x = { id, status: "invio", mode: st.mode, by, started_at: new Date().toISOString() };
  await kvSet(env, "tt:" + id, x);
  try {
    const t = await ttToken(env);
    if (direct) {
      if (!env.TT_DIRECT) throw { code: "tiktok_diretto_non_attivo", detail: "La pubblicazione diretta non è attiva nell'app TikTok (Direct Post spento). Usa la modalità «bozza nella casella»." };
      const ci = await ttCall(t, "/v2/post/publish/creator_info/query/", {});
      const opts = ci.privacy_level_options || [];
      x.privacy = opts.includes(st.privacy) ? st.privacy : opts.includes("SELF_ONLY") ? "SELF_ONLY" : opts[0];
      if (!x.privacy) throw { code: "tiktok_privacy", detail: "TikTok non ha indicato nessuna visibilità consentita per questo account." };
    }
    const cap = String(d.tt_caption || ttCaption(d.caption)).trim();
    let data;
    if (d.type === "reel") {
      const vid = (String(d.video_url || "").match(/\/ig\/vid\/([0-9a-f]{32})\.mp4/) || [])[1];
      const meta = vid ? await kvGet(env, "vid:" + vid) : null;
      if (meta && !meta.r2 && meta.n && env.PODCAST) { // video caricato prima della v19 (a blocchi nel database): lo sposto su R2 una volta sola
        const parts = []; let tot = 0;
        for (let i = 0; i < meta.n; i++) {
          const c = await kvGet(env, "vidc:" + vid + ":" + i);
          if (!c) { parts.length = 0; break; }
          let u; if (typeof Uint8Array.fromBase64 === "function") u = Uint8Array.fromBase64(c); else { const bin = atob(c); u = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j); }
          parts.push(u); tot += u.length;
        }
        if (parts.length === meta.n) {
          const all = new Uint8Array(tot); let o = 0; for (const u of parts) { all.set(u, o); o += u.length; }
          await env.PODCAST.put("igvid/" + vid + ".mp4", all, { httpMetadata: { contentType: "video/mp4", cacheControl: "public, max-age=3600" } });
          await kvSet(env, "vid:" + vid, { ...meta, r2: true, n: 0 });
          for (let i = 0; i < meta.n; i++) await kvDel(env, "vidc:" + vid + ":" + i);
          meta.r2 = true;
        }
      }
      const obj = meta && meta.r2 && env.PODCAST ? await env.PODCAST.get("igvid/" + vid + ".mp4") : null;
      if (!obj) throw { code: "tiktok_video_mancante", detail: "Il video non è più disponibile sul Worker (si cancella dopo 14 giorni)." };
      const buf = await obj.arrayBuffer(); const size = buf.byteLength;
      if (size > 64 * 1024 * 1024) throw { code: "tiktok_video_grande", detail: "Video oltre 64 MB." };
      const source_info = { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 };
      data = direct
        ? await ttCall(t, "/v2/post/publish/video/init/", { post_info: { title: ttClip(cap, 2200), privacy_level: x.privacy, disable_comment: false, disable_duet: false, disable_stitch: false, brand_content_toggle: false, brand_organic_toggle: false }, source_info })
        : await ttCall(t, "/v2/post/publish/inbox/video/init/", { source_info });
      if (!data.upload_url) throw { code: "tiktok_upload", detail: "TikTok non ha restituito l'indirizzo di caricamento." };
      const up = await fetch(data.upload_url, { method: "PUT", headers: { "content-type": "video/mp4", "content-range": `bytes 0-${size - 1}/${size}` }, body: buf });
      x.upload_http = up.status;
      if (!up.ok) throw { code: "tiktok_upload", detail: "TikTok ha rifiutato il caricamento del video (HTTP " + up.status + "): " + (await up.text().catch(() => "")).slice(0, 200) };
    } else {
      const imgs = (d.image_urls || []).slice(0, 35);
      if (!imgs.length) throw { code: "tiktok_immagini", detail: "Nessuna immagine nella bozza." };
      const first = (cap.split("\n").find((l) => l.trim()) || "").trim();
      const post_info = { title: ttClip(first, 90), description: ttClip(cap, 4000) };
      if (direct) Object.assign(post_info, { privacy_level: x.privacy, disable_comment: false, auto_add_music: true, brand_content_toggle: false, brand_organic_toggle: false });
      data = await ttCall(t, "/v2/post/publish/content/init/", { media_type: "PHOTO", post_mode: direct ? "DIRECT_POST" : "MEDIA_UPLOAD", post_info, source_info: { source: "PULL_FROM_URL", photo_images: imgs, photo_cover_index: 0 } });
    }
    x.publish_id = data.publish_id; x.status = "in_elaborazione"; x.sent_at = new Date().toISOString();
  } catch (e) { x.status = "errore"; x.error = ttErr(e); }
  await kvSet(env, "tt:" + id, x);
  if (x.status === "in_elaborazione") { await new Promise((r) => setTimeout(r, 2500)); try { return await ttCheck(env, id); } catch (e) {} }
  return x;
}
async function ttCheck(env, id) {
  const x = await kvGet(env, "tt:" + id);
  if (!x || !x.publish_id) return x;
  const t = await ttToken(env);
  let s;
  try { s = await ttCall(t, "/v2/post/publish/status/fetch/", { publish_id: x.publish_id }); }
  catch (e) { x.checked_at = new Date().toISOString(); x.check_error = ttErr(e); await kvSet(env, "tt:" + id, x); return x; }
  delete x.check_error; x.checked_at = new Date().toISOString(); x.tt_status = s.status;
  if (s.status === "PUBLISH_COMPLETE") {
    x.status = "pubblicato"; delete x.error;
    const pid = (s.publicaly_available_post_id || s.publicly_available_post_id || [])[0];
    const tk = await kvGet(env, "tt_token");
    if (pid) x.link = "https://www.tiktok.com/@" + encodeURIComponent((tk && tk.username) || "_") + "/video/" + pid;
  } else if (s.status === "SEND_TO_USER_INBOX") x.status = "nella_casella";
  else if (s.status === "FAILED") { x.status = "errore"; x.error = "TikTok: " + (TT_FAIL[s.fail_reason] || s.fail_reason || "pubblicazione non riuscita") + (s.fail_reason ? " (" + s.fail_reason + ")" : ""); }
  await kvSet(env, "tt:" + id, x);
  return x;
}
async function ttAuto(env, id) { // dopo una pubblicazione Instagram riuscita
  const st = await ttSettings(env);
  if (!st.auto) return;
  const d = await kvGet(env, "draft:" + id);
  if (!d || !TT_TYPES.includes(d.type) || (await kvGet(env, "tt:" + id))) return;
  if (!(await kvGet(env, "tt_token"))) return;
  await ttSend(env, id, "auto", false);
}
async function ttPoll(env) { // dal cron: aggiorna lo stato degli invii ancora aperti (max 3 giorni)
  if (!(await kvGet(env, "tt_token"))) return;
  for (const x of await kvList(env, "tt:", 30)) {
    if (!["in_elaborazione", "nella_casella"].includes(x.status) || !x.publish_id) continue;
    if (Date.now() - Date.parse(x.sent_at || x.started_at) > 3 * 86400000) continue;
    try { await ttCheck(env, x.id); } catch (e) {}
  }
}
async function ttPanelInfo(env) {
  const t = await kvGet(env, "tt_token");
  const v = await kvGet(env, "tt_verify");
  return { configurato: !!(env.TT_CLIENT_KEY && env.TT_CLIENT_SECRET), collegato: !!(t && t.access_token), username: t ? t.username || null : null, nickname: t ? t.nickname || null : null,
    scope: t ? t.scope || "" : "", scaduto: !!(t && t.refresh_expires_at && t.refresh_expires_at < Date.now()), settings: await ttSettings(env), verifica: v ? (Array.isArray(v.list) ? v.list.map((x) => x.name).join(", ") : v.name) : null };
}
// ============ THREADS (v30): pubblica su Threads gli stessi caroselli e reel di Instagram ============
// App Meta con il caso d'uso «Accesso all'API di Threads»; secret TH_APP_ID e TH_APP_SECRET (quelli di Threads, non di Instagram).
// Il profilo @read.geopolitics va aggiunto come «Threads Tester» e accetta l'invito da Threads → Impostazioni → Account → Autorizzazioni dei siti web.
const TH_API = "https://graph.threads.com/v1.0";
const thId = (env) => String(env.TH_APP_ID || "").replace(/[^0-9]/g, ""); // solo cifre: toglie spazi o virgolette incollati per sbaglio
const thSecret = (env) => String(env.TH_APP_SECRET || "").trim().replace(/^["']|["']$/g, "");
const TH_TYPES = ["reel", "carousel", "image"];
const TH_DEFAULT = { auto: false, topic: "Geopolitica", domanda: true, ora_dom: "18:00" };
async function thSettings(env) { return { ...TH_DEFAULT, ...((await kvGet(env, "th_settings")) || {}) }; }
function thCaption(cap) { // testo per Threads: max 500 caratteri, niente hashtag (Threads usa un solo «argomento»), link al sito al posto di «link in bio»
  let lines = String(cap || "").replace(/\s+$/, "").split("\n");
  while (lines.length && /^\s*(#[^\s#]+\s*)+$/.test(lines[lines.length - 1])) lines.pop();
  let t = lines.join("\n").replace(/(^|\s)#([^\s#]+)/g, "$1$2").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  t = t.replace(/link (nella|in) bio/gi, "readgeopolitics.com");
  if (t.length <= 500) return t;
  const cut = t.slice(0, 497); const k = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(". "));
  return (k > 250 ? cut.slice(0, k + 1) : cut).trim() + "…";
}
async function thToken(env) {
  const t = await kvGet(env, "th_token");
  if (!t || !t.access_token) throw { status: 409, code: "threads_non_collegato", detail: "Threads non è collegato: premi «Collega Threads» nel pannello." };
  if (t.expires_at && t.expires_at < Date.now()) throw { status: 409, code: "threads_scaduto", detail: "Il collegamento a Threads è scaduto: premi «Ricollega Threads»." };
  return t;
}
async function thRefresh(env) { // dal cron: rinnova il token lungo (60 giorni) quando ha più di 20 giorni
  const t = await kvGet(env, "th_token");
  if (!t || !t.access_token || Date.now() - Date.parse(t.refreshed_at || 0) < 20 * 86400000 || (t.expires_at && t.expires_at < Date.now())) return;
  const r = await fetch("https://graph.threads.com/refresh_access_token?" + new URLSearchParams({ grant_type: "th_refresh_token", access_token: t.access_token }));
  const j = await gj(r);
  if (j.access_token) await kvSet(env, "th_token", { ...t, access_token: j.access_token, expires_at: Date.now() + (+j.expires_in || 5184000) * 1000, refreshed_at: new Date().toISOString() });
}
async function thCall(t, method, path, params) {
  const q = new URLSearchParams({ ...(params || {}), access_token: t.access_token });
  const r = method === "GET" ? await fetch(TH_API + path + "?" + q) : await fetch(TH_API + path, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: q });
  const j = await gj(r);
  if (!r.ok || j.error) throw { status: 502, code: "threads_" + ((j.error && (j.error.code || j.error.type)) || r.status), detail: "Threads: " + ((j.error && (j.error.error_user_msg || j.error.message)) || "HTTP " + r.status) + (j.error && j.error.error_subcode ? " (sottocodice " + j.error.error_subcode + ")" : "") };
  return j;
}
const thErr = (e) => String((e && (typeof e.detail === "string" ? e.detail : e.detail ? JSON.stringify(e.detail) : e.message || e.code)) || e).slice(0, 500);
async function thTry(env, id) { // contenitore pronto → pubblica; altrimenti resta «in_elaborazione» e ci riprova il cron
  const x = await kvGet(env, "th:" + id);
  if (!x || !x.container || x.status === "pubblicato") return x;
  const t = await thToken(env);
  try {
    const s = await thCall(t, "GET", "/" + x.container, { fields: "status,error_message" });
    x.th_status = s.status; x.checked_at = new Date().toISOString();
    if (s.status === "ERROR" || s.status === "EXPIRED") { x.status = "errore"; x.error = "Threads non ha accettato il contenuto: " + (s.error_message || s.status); }
    else if (s.status === "FINISHED") {
      const p = await thCall(t, "POST", "/" + t.user_id + "/threads_publish", { creation_id: x.container });
      x.media_id = p.id; x.status = "pubblicato"; x.published_at = new Date().toISOString(); delete x.error;
      try { const m = await thCall(t, "GET", "/" + p.id, { fields: "permalink" }); x.link = m.permalink || null; } catch (e) {}
    }
  } catch (e) { x.check_error = thErr(e); }
  await kvSet(env, "th:" + id, x);
  return x;
}
async function thSend(env, id, by, force) {
  const d = await kvGet(env, "draft:" + id);
  if (!d) throw { status: 404, code: "draft_not_found" };
  if (!TH_TYPES.includes(d.type)) throw { status: 400, code: "threads_formato", detail: "Le storie non vanno su Threads." };
  const old = await kvGet(env, "th:" + id);
  if (old && ["invio", "in_elaborazione", "pubblicato"].includes(old.status) && !force) throw { status: 409, code: "threads_gia_inviato", detail: old.status };
  if (old && old.status === "pubblicato") throw { status: 409, code: "threads_gia_pubblicato", detail: "Già pubblicato su Threads." };
  const st = await thSettings(env);
  const x = { id, status: "invio", by, started_at: new Date().toISOString() };
  await kvSet(env, "th:" + id, x);
  try {
    const t = await thToken(env);
    const text = String(d.th_caption || thCaption(d.caption)).trim().slice(0, 500);
    const base = { text, ...(st.topic ? { topic_tag: String(st.topic).replace(/[.&]/g, "").slice(0, 50) } : {}) };
    let c;
    if (d.type === "reel") {
      if (!d.video_url) throw { code: "threads_video", detail: "Nessun video nella bozza." };
      c = await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "VIDEO", video_url: d.video_url, ...base });
    } else {
      const imgs = (d.image_urls || []).slice(0, 20);
      if (!imgs.length) throw { code: "threads_immagini", detail: "Nessuna immagine nella bozza." };
      if (imgs.length === 1) c = await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "IMAGE", image_url: imgs[0], ...base });
      else {
        const kids = [];
        for (const u of imgs) kids.push((await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "IMAGE", image_url: u, is_carousel_item: "true" })).id);
        c = await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "CAROUSEL", children: kids.join(","), ...base });
      }
    }
    x.container = c.id; x.status = "in_elaborazione"; x.sent_at = new Date().toISOString();
  } catch (e) { x.status = "errore"; x.error = thErr(e); }
  await kvSet(env, "th:" + id, x);
  if (x.status !== "in_elaborazione") return x;
  for (const w of [4000, 8000, 12000]) { await new Promise((r) => setTimeout(r, w)); const y = await thTry(env, id); if (y && y.status !== "in_elaborazione") return y; }
  return await kvGet(env, "th:" + id);
}
async function thAuto(env, id) { // dopo una pubblicazione Instagram riuscita
  const st = await thSettings(env);
  if (!st.auto) return;
  const d = await kvGet(env, "draft:" + id);
  if (!d || !TH_TYPES.includes(d.type) || (await kvGet(env, "th:" + id))) return;
  if (!(await kvGet(env, "th_token"))) return;
  await thSend(env, id, "auto", false);
}
async function thPoll(env) { // dal cron: completa le pubblicazioni ancora in elaborazione (max 2 giorni) e rinnova il token
  try { await thRefresh(env); } catch (e) {}
  if (!(await kvGet(env, "th_token"))) return;
  const lim = Date.now() - 2 * 86400000;
  for (const x of await kvList(env, "th:", 20)) if (x.status === "in_elaborazione" && Date.parse(x.sent_at || x.started_at || 0) > lim) { try { await thTry(env, x.id); } catch (e) {} }
}
async function thPanelInfo(env) {
  const t = await kvGet(env, "th_token");
  return { configurato: !!(env.TH_APP_ID && env.TH_APP_SECRET), collegato: !!(t && t.access_token), username: t ? t.username || null : null,
    scaduto: !!(t && t.expires_at && t.expires_at < Date.now()), giorni: t && t.expires_at ? Math.floor((t.expires_at - Date.now()) / 86400000) : null, settings: await thSettings(env) };
}
async function thPublic(request, env, p, url) {
  const redirect = url.origin + "/th/callback";
  if (p === "/th/connect") {
    const okK = safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "");
    if (!okK && !(await sessionOk(request, env))) return htmlPage("Accesso negato", "<p>Entra prima nel pannello (/ig/panel) e premi «Collega Threads» da lì.</p>", 401);
    if (!thId(env) || !thSecret(env)) return htmlPage("Mancano le chiavi Threads", "<p>Aggiungi al Worker i secret <b>TH_APP_ID</b> e <b>TH_APP_SECRET</b> (ID e chiave segreta <b>dell'app Threads</b>, nella tua app Meta) e riprova.</p>", 500);
    const state = crypto.randomUUID().replace(/-/g, "");
    await kvSet(env, "th_state", { state, exp: Date.now() + 10 * 60000 });
    // v31: threads.net (l'indirizzo storico): da threads.com il passaggio al login può perdere i parametri («No app ID was sent»)
    return Response.redirect("https://threads.net/oauth/authorize?" + new URLSearchParams({ client_id: thId(env), redirect_uri: redirect, scope: "threads_basic,threads_content_publish,threads_keyword_search,threads_manage_replies", response_type: "code", state }), 302);
  }
  if (p === "/th/callback") {
    const err = url.searchParams.get("error_description") || url.searchParams.get("error");
    if (err) return htmlPage("Threads ha rifiutato", `<p>${esc(err)}</p>`, 400);
    const code = (url.searchParams.get("code") || "").replace(/#_$/, "");
    const st = await kvGet(env, "th_state");
    if (!code || !st || st.exp < Date.now() || !safeEq(url.searchParams.get("state") || "", st.state))
      return htmlPage("Richiesta non valida", "<p>Stato scaduto o non riconosciuto. Torna nel pannello e premi di nuovo «Collega Threads».</p>", 400);
    await kvDel(env, "th_state");
    const r1 = await fetch("https://graph.threads.com/oauth/access_token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: thId(env), client_secret: thSecret(env), code, grant_type: "authorization_code", redirect_uri: redirect }) });
    const j1 = await gj(r1);
    if (!j1.access_token) return htmlPage("Scambio del codice fallito", `<pre>${esc(JSON.stringify(j1.error || j1).slice(0, 600))}</pre>`, 502);
    const r2 = await fetch("https://graph.threads.com/access_token?" + new URLSearchParams({ grant_type: "th_exchange_token", client_secret: thSecret(env), access_token: j1.access_token }));
    const j2 = await gj(r2);
    const tok = j2.access_token || j1.access_token;
    const t = { access_token: tok, user_id: String(j1.user_id || ""), expires_at: Date.now() + (+(j2.expires_in) || 3600) * 1000, refreshed_at: new Date().toISOString(), long: !!j2.access_token };
    try { const me = await thCall(t, "GET", "/me", { fields: "id,username" }); t.user_id = String(me.id || t.user_id); t.username = me.username || null; } catch (e) {}
    await kvSet(env, "th_token", t);
    return htmlPage("Threads collegato ✅", `<p>Profilo: <b>${t.username ? "@" + esc(t.username) : "(nome non letto)"}</b>.</p>` + (t.long ? "" : `<p style="color:#b00">Token lungo non ottenuto: il collegamento dura 1 ora. Ricollega.</p>`) + `<p><a href="/ig/panel">Torna al pannello</a></p>`);
  }
  if (p === "/th/uninstall" || p === "/th/delete") { // richiesti da Meta: alla revoca cancelliamo il token
    await kvDel(env, "th_token");
    if (p === "/th/delete") { const cc = crypto.randomUUID().slice(0, 8); return json({ url: "https://www.readgeopolitics.com/privacy.html", confirmation_code: cc }); }
    return json({ ok: true });
  }
  return null;
}
const TH_REPLY_MAX = 3;
async function thrAlive(env, t, id, done, day) { // la nostra risposta a quel post esiste ancora? se è stata cancellata a mano, libera il post e il conteggio
  const r = await kvGet(env, "thr:" + id);
  if (r && r.reply_id) { try { await thCall(t, "GET", "/" + r.reply_id, { fields: "id" }); return true; } catch (e) {} }
  done.ids = done.ids.filter((x) => x !== id); done.n = Math.max(0, done.n - 1);
  await kvSet(env, "thr_day:" + day, done); await kvDel(env, "thr:" + id);
  return false;
}
async function thPanelApi(env, b) {
  const act = b.action;
  if (act === "th_search") { // v50: cerca post su Threads per parola chiave (con l'accesso di prova trova solo i nostri)
    const q = String(b.q || "").trim().slice(0, 100); if (!q) throw { status: 422, code: "q_missing" };
    const t = await thToken(env);
    let j;
    try { j = await thCall(t, "GET", "/keyword_search", { q, search_type: b.type === "RECENT" ? "RECENT" : "TOP", fields: "id,text,permalink,timestamp,username" }); }
    catch (e) { // diagnosi: cosa può fare davvero il collegamento (senza mai mostrare la chiave)
      const prova = async (path, params) => { try { await thCall(t, "GET", path, params); return "ok"; } catch (x) { return thErr(x) + " [" + (x.code || "") + "]"; } };
      const me = await prova("/me", { fields: "id,username" });
      const own = await prova("/" + t.user_id + "/threads", { fields: "id", limit: "1" });
      const bare = await prova("/keyword_search", { q });
      throw { status: 502, code: e.code || "threads_err", detail: thErr(e) + " [" + (e.code || "") + "] · profilo: " + me + " · nostri post: " + own + " · ricerca semplice: " + bare };
    }
    const day = romeToday(); const done = (await kvGet(env, "thr_day:" + day)) || { n: 0, ids: [] };
    for (const x of j.data || []) if (done.ids.includes(x.id)) await thrAlive(env, t, x.id, done, day);
    return { ok: true, q, posts: (j.data || []).filter((x) => x.text).slice(0, 15).map((x) => ({ id: x.id, text: String(x.text).slice(0, 600), link: x.permalink || "", at: x.timestamp || "", user: x.username || "", risposto: done.ids.includes(x.id) })), oggi: done.n, max: TH_REPLY_MAX };
  }
  if (act === "th_reply") { // risposta a un post: al massimo TH_REPLY_MAX al giorno, sempre approvata a mano dal pannello
    const id = String(b.id || ""), text = String(b.text || "").trim();
    if (!/^\d{5,30}$/.test(id) || text.length < 5 || text.length > 500) throw { status: 422, code: "bad_reply" };
    const day = romeToday(); const done = (await kvGet(env, "thr_day:" + day)) || { n: 0, ids: [] };
    const t = await thToken(env);
    if (done.ids.includes(id) && await thrAlive(env, t, id, done, day)) throw { status: 409, code: "gia_risposto", detail: "Hai già risposto a questo post e la risposta è ancora su Threads." };
    if (done.n >= TH_REPLY_MAX) throw { status: 429, code: "limite_giornaliero", detail: "Oggi hai già mandato " + TH_REPLY_MAX + " risposte." };
    const c = await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "TEXT", text, reply_to_id: id });
    await new Promise((r) => setTimeout(r, 3000));
    const pb = await thCall(t, "POST", "/" + t.user_id + "/threads_publish", { creation_id: c.id });
    let link = null; try { const m = await thCall(t, "GET", "/" + pb.id, { fields: "permalink" }); link = m.permalink || null; } catch (e) {}
    done.n++; done.ids.push(id); await kvSet(env, "thr_day:" + day, done);
    await kvSet(env, "thr:" + id, { at: new Date().toISOString(), text, reply_id: pb.id, link });
    return { ok: true, link, oggi: done.n, max: TH_REPLY_MAX };
  }
  if (act === "th_send") return { ok: true, th: await thSend(env, String(b.id), "panel", !!b.force) };
  if (act === "th_check") return { ok: true, th: await thTry(env, String(b.id)) };
  if (act === "th_caption") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    const c = String(b.caption || "").trim().slice(0, 500);
    if (c && c !== thCaption(d.caption)) d.th_caption = c; else delete d.th_caption;
    await kvSet(env, "draft:" + d.id, d);
    return { ok: true, th_cap: d.th_caption || thCaption(d.caption) };
  }
  if (act === "th_settings") {
    const cur = await thSettings(env);
    if (typeof b.auto === "boolean") cur.auto = b.auto;
    if (typeof b.domanda === "boolean") cur.domanda = b.domanda;
    if (typeof b.topic === "string") cur.topic = b.topic.replace(/[.&]/g, "").trim().slice(0, 50);
    await kvSet(env, "th_settings", cur);
    return { ok: true, threads: await thPanelInfo(env) };
  }
  if (act === "th_disconnect") { await kvDel(env, "th_token"); return { ok: true, threads: await thPanelInfo(env) }; }
  return null;
}
// ============ fine Threads ============

// ============ SVOLTE E AGGIORNAMENTI (v51) ============
// La routine «aggiornamenti» (11:52, 15:52, 19:52) scrive gli sviluppi come documenti «aggiornamenti» (con /v1/batch: li legge il sito)
// e, per una svolta, una proposta (POST /v1/svolte). Francesco riceve l'avviso nella chat privata col bot e approva dal pannello:
// il messaggio esce sul canale Telegram solo dopo «Approva». Lo «Spiegato» della svolta è una richiesta normale (template spiegato).
const romeYesterday = () => new Date(Date.parse(romeToday() + "T12:00:00Z") - 86400000).toISOString().slice(0, 10);
async function svList(env) { return (await kvList(env, "sv:", 40)).map(({ _k, _u, ...x }) => x).sort((a, z) => String(z.created_at).localeCompare(String(a.created_at))); }
async function tgPriv(env, text) { const st = await tgSettings(env); if (!st.priv_chat || !env.TG_BOT_TOKEN) return null; return await tgCall(env, "sendMessage", { chat_id: st.priv_chat, text, parse_mode: "HTML", disable_web_page_preview: true }); }
async function svPrivate(request, env, p, method) {
  if (method === "GET" && p === "/v1/svolte") {
    const y = romeYesterday();
    return json({ ok: true, svolte: (await svList(env)).filter((x) => x.date >= y), giri: (await kvGet(env, "giri:" + romeToday())) || [] });
  }
  if (method === "POST" && p === "/v1/svolte") {
    const b = await request.json().catch(() => null);
    if (!b || typeof b !== "object") return fail(400, "bad_json");
    const titolo = clip(b.titolo, 140), tg = clip(b.tg_testo, 900);
    if (!titolo || !tg) return fail(422, "bad_svolta", "servono titolo e tg_testo");
    const day = romeToday();
    const fonti = (Array.isArray(b.fonti) ? b.fonti : []).map((x) => clip(typeof x === "string" ? x : x && x.nome, 60)).filter(Boolean).slice(0, 6);
    const sv = { id: "sv-" + day.replace(/-/g, "") + "-" + rid().slice(0, 4), date: day, ora: romeHM(), titolo, filone_id: clip(b.filone_id, 80), filone_titolo: clip(b.filone_titolo, 100), dossier_id: clip(b.dossier_id, 80), ag_id: clip(b.ag_id, 80), tg_testo: tg, fonti, stato: "proposta", created_at: new Date().toISOString() };
    const tema = b.spiegato && clip(b.spiegato.tema, 200);
    if (tema) {
      const tpl = IG_TEMPLATES.find((x) => x.id === "spiegato");
      try { const r = await reqCreate(env, tpl, { param: tema, note: b.spiegato.note, origine: "svolta " + sv.id }); sv.req_id = r.id; } catch (e) { sv.req_err = String((e && (e.code || e.message)) || e); }
    }
    try {
      const r = await tgPriv(env, "🟠 <b>Svolta</b>" + (sv.filone_titolo ? " · " + esc(sv.filone_titolo) : "") + "\n" + esc(titolo) + "\n\nPronti: il messaggio per il canale" + (sv.req_id ? " e lo «Spiegato in 40 secondi» (in preparazione)" : "") + ".\n<a href=\"" + RG_ORIGIN + "/ig/panel#svolte\">Apri nel pannello ›</a>");
      sv.avviso = r ? "inviato" : "chat privata non collegata";
    } catch (e) { sv.avviso = "errore: " + thErr(e); }
    await kvSet(env, "sv:" + sv.id, sv);
    return json({ ok: true, svolta: sv });
  }
  if (method === "POST" && p === "/v1/giro") {
    const b = (await request.json().catch(() => null)) || {};
    const day = romeToday(); const g = (await kvGet(env, "giri:" + day)) || [];
    const e = { ora: romeHM(), aggiornamenti: Math.max(0, parseInt(b.aggiornamenti, 10) || 0), svolte: Math.max(0, parseInt(b.svolte, 10) || 0), nota: clip(b.nota, 300) };
    g.push(e); await kvSet(env, "giri:" + day, g.slice(-10));
    const st = await tgSettings(env);
    if (st.priv_riepilogo && !e.svolte) { try { await tgPriv(env, "ℹ️ Giro delle " + e.ora + ": " + (e.aggiornamenti ? e.aggiornamenti + (e.aggiornamenti === 1 ? " aggiornamento" : " aggiornamenti") + " sul sito" : "nessun aggiornamento") + ", nessuna svolta."); } catch (x) {} }
    return json({ ok: true, giro: e });
  }
  return fail(404, "not_found");
}
function svCanale(sv, testo) {
  const link = "https://www.readgeopolitics.com/?utm_source=telegram&utm_campaign=svolta#aggiornamenti";
  let m = "<b>Svolta · " + esc(tgClip(sv.titolo, 120)) + "</b>\n\n" + esc(tgClip(testo, 800));
  if (sv.fonti && sv.fonti.length) m += "\n\n<i>" + esc(sv.fonti.slice(0, 4).join(" · ")) + "</i>";
  return m + "\n\n<a href=\"" + link + "\">La storia sul sito ›</a>";
}
async function svPanelApi(env, b) {
  const act = b.action;
  const get = async () => { const sv = await kvGet(env, "sv:" + String(b.id || "")); if (!sv) throw { status: 404, code: "svolta_non_trovata" }; return sv; };
  if (act === "sv_tg") {
    const sv = await get();
    if (sv.tg_msg) throw { status: 409, code: "gia_inviata", detail: "Il messaggio è già uscito sul canale." };
    if (sv.stato === "scartata") throw { status: 409, code: "scartata" };
    const st = await tgSettings(env); if (!st.chat) throw { status: 409, code: "canale_mancante", detail: "Manca il canale Telegram." };
    const testo = clip(b.testo, 900) || sv.tg_testo;
    const r = await tgCall(env, "sendMessage", { chat_id: st.chat, text: svCanale(sv, testo), parse_mode: "HTML", disable_web_page_preview: true });
    Object.assign(sv, { stato: "approvata", tg_testo: testo, tg_msg: r && r.message_id, tg_at: new Date().toISOString() });
    await kvSet(env, "sv:" + sv.id, sv);
    return { ok: true, svolta: sv };
  }
  if (act === "sv_discard") { const sv = await get(); if (sv.tg_msg) throw { status: 409, code: "gia_inviata" }; sv.stato = "scartata"; sv.scartata_at = new Date().toISOString(); await kvSet(env, "sv:" + sv.id, sv); return { ok: true, svolta: sv }; }
  if (act === "sv_text") { const sv = await get(); const t = clip(b.testo, 900); if (t && !sv.tg_msg) { sv.tg_testo = t; await kvSet(env, "sv:" + sv.id, sv); } return { ok: true, svolta: sv }; }
  return null;
}
async function richiesteTemi(env) { // suggerimenti per il modulo Richieste: aggiornamenti di oggi, storie dell'ultimo briefing, dossier, filoni attivi
  const day = romeToday();
  const last = await env.DB.prepare("SELECT MAX(key) AS m FROM docs WHERE type='briefings' AND status='published'").first();
  const bd = (last && last.m) || day;
  const q = async (sql, ...a) => ((await env.DB.prepare(sql).bind(...a).all()).results || []).map((r) => ({ key: r.key, ...JSON.parse(r.data) }));
  const [ag, st, dz, th] = await Promise.all([
    q("SELECT key, data FROM docs WHERE type='aggiornamenti' AND status='published' AND json_extract(data,'$.data')=?1 ORDER BY key DESC LIMIT 12", day),
    q("SELECT key, data FROM docs WHERE type='stories' AND status='published' AND json_extract(data,'$.data')=?1 ORDER BY key LIMIT 12", bd),
    q("SELECT key, data FROM docs WHERE type='dossier' AND status='published' ORDER BY key LIMIT 40"),
    q("SELECT key, data FROM docs WHERE type='threads' AND status='published' AND json_extract(data,'$.stato')='attivo' ORDER BY updated_at DESC LIMIT 30"),
  ]);
  const cut = (t, n) => { t = String(t || ""); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t; };
  return {
    briefing: bd,
    aggiornamenti: ag.map((x) => ({ id: x.key, t: cut(x.titolo || x.testo, 200), ora: x.ora || "", tipo: x.tipo || "sviluppo", filone: x.filone_id || "" })),
    storie: st.map((x) => ({ id: x.key, t: cut(x.titolo, 200), filone: x.filone_id || "" })),
    dossier: dz.filter((x) => x.stato === "pronto").map((x) => ({ id: x.key, t: x.titolo || x.key, filoni: Array.isArray(x.filoni) ? x.filoni.map((f) => (typeof f === "string" ? f : f && (f.id || f.filone_id))).filter(Boolean) : [] })),
    filoni: th.map((x) => ({ id: x.key, t: cut(x.titolo, 80) })),
  };
}
// ============ fine svolte ============

// ============ TELEGRAM (v33): canale con il mattino (60 secondi + puntata) e i post di Instagram ============
// Secret TG_BOT_TOKEN (da @BotFather). Il bot è amministratore del canale; il nome del canale (@...) si imposta dal pannello.
const RG_ORIGIN = "https://rg-api.briefinghub.workers.dev";
const TG_DEFAULT = { chat: "", mattino: true, ora: "08:00", post: false, divergenze: true, ora_div: "12:30", sera: true, ora_sera: "20:15", bilancio: true, ora_bil: "10:00", dossier: true };
async function tgSettings(env) { const st = { ...TG_DEFAULT, ...((await kvGet(env, "tg_settings")) || {}) }; if (st.ora_bil === "18:00") st.ora_bil = "10:00"; return st; } // v61: «Com'è andata» passa alla domenica mattina (l'orario salvato era quello vecchio predefinito)
async function tgCall(env, method, body) {
  if (!env.TG_BOT_TOKEN) throw { status: 409, code: "telegram_chiave", detail: "Manca il secret TG_BOT_TOKEN nel Worker." };
  const r = await fetch("https://api.telegram.org/bot" + String(env.TG_BOT_TOKEN).trim() + "/" + method, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await gj(r);
  if (!j.ok) throw { status: 502, code: "telegram_" + (j.error_code || r.status), detail: "Telegram: " + (j.description || "HTTP " + r.status) };
  try { if (/^send/.test(method) && body && body.chat_id) { const st = await tgSettings(env); if (st.chat && String(body.chat_id) === String(st.chat)) { const k = "tg_n:" + romeToday(); const L = (await kvGet(env, k)) || []; L.push({ m: method, at: new Date().toISOString() }); await kvSet(env, k, L); } } } catch (e) {} // v53: messaggi sul canale oggi
  return j.result;
}
const TG_TETTO = 3; // v53: tetto di messaggi al giorno sul canale, vale solo per la divergenza (v54: il riepilogo serale esce sempre se ci sono aggiornamenti: è il messaggio che chiude la giornata)
async function tgOggi(env) { const day = romeToday(); const n = ((await kvGet(env, "tg_n:" + day)) || []).length;
  const svolta = (await svList(env)).some((x) => x.tg_msg && x.tg_at && new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date(x.tg_at)) === day);
  return { n, svolta }; }
const tgClip = (s, n) => { s = String(s || ""); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…"; };
const IT_GG = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const IT_MM = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
function itLong(day) { const d = new Date(day + "T12:00:00Z"); return IT_GG[d.getUTCDay()] + " " + d.getUTCDate() + " " + IT_MM[d.getUTCMonth()]; }
async function tgMorning(env, force, onlyTo) { // il mattino: «In 60 secondi» del briefing + la puntata del podcast, in un solo messaggio
  const st = await tgSettings(env);
  const chat = onlyTo || st.chat;
  if (!chat || !env.TG_BOT_TOKEN) { if (force) throw { status: 409, code: "telegram_canale", detail: !env.TG_BOT_TOKEN ? "Manca il secret TG_BOT_TOKEN nel Worker." : "Imposta il nome del canale Telegram nel pannello (es. @readgeopolitics)." }; return null; }
  const day = romeToday();
  if (!force) {
    if (!st.mattino || (await kvGet(env, "tg_m:" + day))) return null;
    const hm = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
    if (hm < (st.ora || "08:00")) return null;
  }
  const b = await env.DB.prepare("SELECT data FROM docs WHERE type='briefings' AND key=?1 AND status='published'").bind(day).first();
  if (!b) { if (force) throw { status: 409, code: "telegram_briefing", detail: "Il briefing di oggi non è ancora sul sito." }; return null; }
  const br = JSON.parse(b.data);
  let ep = null; try { ep = await env.DB.prepare("SELECT date, title, duration FROM podcast WHERE date=?1").bind(day).first(); } catch (e) {}
  if (!ep && !force) { // aspetta la puntata fino alle 09:30, poi esce lo stesso senza
    const hm = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
    if (hm < "09:30") return null;
  }
  const lines = (Array.isArray(br.in60) ? br.in60 : []).slice(0, 5).map((l) => "• " + esc(String(l)));
  const link = "https://www.readgeopolitics.com/?utm_source=telegram";
  let cap = "<b>Il mondo in 60 secondi · " + itLong(day) + "</b>\n\n" + lines.join("\n") + "\n\n";
  cap += (ep ? "🎧 La puntata di oggi qui sopra (" + Math.round((ep.duration || 0) / 60) + " min)\n" : "") + '📖 <a href="' + link + '">Il briefing completo, con le fonti</a>';
  cap = cap.length > 1024 ? cap.slice(0, 1020) + "…" : cap;
  let res;
  if (ep) res = await tgCall(env, "sendAudio", { chat_id: chat, audio: RG_ORIGIN + "/podcast/ep/" + day + ".mp3", caption: cap, parse_mode: "HTML", title: tgClip(ep.title, 60), performer: "Read Geopolitics", duration: ep.duration || undefined });
  else res = await tgCall(env, "sendMessage", { chat_id: chat, text: cap, parse_mode: "HTML", link_preview_options: { is_disabled: true } });
  const out = { at: new Date().toISOString(), chat, audio: !!ep, message_id: res && res.message_id };
  if (!onlyTo) await kvSet(env, "tg_m:" + day, out);
  try { await kvDel(env, "tg_err"); } catch (e) {}
  return out;
}
async function tgSendDraft(env, id, by) { // un carosello o un reel già pronto per Instagram
  const st = await tgSettings(env);
  if (!st.chat) throw { status: 409, code: "telegram_canale", detail: "Imposta il nome del canale Telegram nel pannello." };
  const d = await kvGet(env, "draft:" + id);
  if (!d) throw { status: 404, code: "draft_not_found" };
  const x = { id, status: "invio", by, at: new Date().toISOString() };
  try {
    // v61: sul canale solo il titolo del post (la prima riga della didascalia) e il link: il resto ripete il mattino
    const tit = String(thCaption(d.caption) || "").split("\n").map((x) => x.trim()).find(Boolean) || "";
    const cap = (tit ? "<b>" + esc(tgClip(tit, 200)) + "</b>\n\n" : "") + '<a href="https://www.readgeopolitics.com/?utm_source=telegram">readgeopolitics.com</a>';
    let r;
    if (d.type === "reel" && d.video_url) r = await tgCall(env, "sendVideo", { chat_id: st.chat, video: d.video_url, caption: cap, parse_mode: "HTML", supports_streaming: true });
    else {
      const imgs = (d.image_urls || []).slice(0, 10);
      if (!imgs.length) throw { code: "telegram_immagini", detail: "Nessuna immagine nella bozza." };
      r = imgs.length === 1 ? await tgCall(env, "sendPhoto", { chat_id: st.chat, photo: imgs[0], caption: cap, parse_mode: "HTML" })
        : await tgCall(env, "sendMediaGroup", { chat_id: st.chat, media: imgs.map((u, i) => ({ type: "photo", media: u, ...(i === 0 ? { caption: cap, parse_mode: "HTML" } : {}) })) });
    }
    const m = Array.isArray(r) ? r[0] : r;
    x.status = "inviato"; x.message_id = m && m.message_id;
    if (m && m.chat && m.chat.username) x.link = "https://t.me/" + m.chat.username + "/" + m.message_id;
  } catch (e) { x.status = "errore"; x.error = thErr(e); }
  await kvSet(env, "tg:" + id, x);
  return x;
}

// v41: contenuti propri dei canali. Telegram: «Le fonti non sono d'accordo» (solo nei giorni in cui la routine del mattino
// ha scritto briefing.tg_divergenza) e «Com'è andata» la domenica (dalle `verifiche` dei briefing della settimana: nessun lavoro in più per le routine).
// Threads: una domanda al giorno (draft.th_domanda), solo se il post del giorno è uscito su Instagram.
const romeHM = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
async function tgBriefing(env, day) { const b = await env.DB.prepare("SELECT data FROM docs WHERE type='briefings' AND key=?1 AND status='published'").bind(day).first(); return b ? JSON.parse(b.data) : null; }
// «parti»: a non coincidere sono le dichiarazioni ufficiali delle parti in causa; «fonti» (o assente): i resoconti dei media
const divTitolo = (tipo) => (tipo === "parti" ? "Le versioni ufficiali non coincidono" : "Le fonti non sono d'accordo");
/* v53: riepilogo serale degli aggiornamenti (dopo l'ultimo giro delle 19:52). Parte solo se oggi ci sono aggiornamenti non già mandati sul canale come svolta. */
async function tgSeraData(env, day) {
  const rows = ((await env.DB.prepare("SELECT key, data FROM docs WHERE type='aggiornamenti' AND key LIKE ?1 AND status='published'").bind("ag-" + day.replace(/-/g, "") + "-%").all()).results) || [];
  const sent = new Set((await svList(env)).filter((x) => x.tg_msg && x.ag_id).map((x) => x.ag_id));
  return rows.map((r) => { try { return { id: r.key, ...JSON.parse(r.data) }; } catch (e) { return null; } }).filter((x) => x && x.data === day && !sent.has(x.id) && (x.titolo || x.testo)).sort((a, z) => String(a.ora).localeCompare(String(z.ora)));
}
function tgSeraText(A, day) {
  const d = new Date(day + "T12:00:00Z"); const gg = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][d.getUTCDay()];
  let msg = "<b>Dalle ultime ore</b> · " + gg + " " + d.getUTCDate() + " " + IT_MM[d.getUTCMonth()] + "\nCosa è cambiato dopo il briefing del mattino:\n\n";
  msg += A.slice(0, 4).map((x) => "• <b>" + esc(x.ora || "") + "</b> " + (x.tipo === "svolta" ? "<b>Svolta</b> · " : "") + esc(tgClip(x.titolo || x.testo, 140))).join("\n");
  if (A.length > 4) msg += "\n<i>e altri " + (A.length - 4) + " sul sito</i>";
  return msg + "\n\n<a href=\"https://www.readgeopolitics.com/?utm_source=telegram&utm_campaign=sera#aggiornamenti\">I dettagli e le fonti sul sito</a>";
}
async function tgSera(env, force) {
  const st = await tgSettings(env); const day = romeToday();
  if (!st.chat || !env.TG_BOT_TOKEN) return null;
  if (!force) {
    if (st.sera === false || (await kvGet(env, "tg_s:" + day))) return null;
    const hm = romeHM(); if (hm < (st.ora_sera || "20:15")) return null;
    const giri = (await kvGet(env, "giri:" + day)) || [];
    if (hm < "21:30" && !giri.some((g) => String(g.ora) >= "19:30")) return null; // aspetta che l'ultimo giro abbia chiuso (al massimo fino alle 21:30)
  }
  const ov = ((await kvGet(env, "ch_ov:" + day)) || {}).sera || {};
  if (ov.skip && !force) { await kvSet(env, "tg_s:" + day, { skip: true, at: new Date().toISOString() }); return null; }
  const A = await tgSeraData(env, day);
  if (!A.length) { if (!force) await kvSet(env, "tg_s:" + day, { none: true, at: new Date().toISOString() }); return null; }
  const r = await tgCall(env, "sendMessage", { chat_id: st.chat, text: tgSeraText(A, day), parse_mode: "HTML", disable_web_page_preview: true });
  await kvSet(env, "tg_s:" + day, { at: new Date().toISOString(), n: A.length, msg: r && r.message_id });
  return { ok: true, n: A.length };
}
async function tgDivergenza(env, force) {
  const st = await tgSettings(env); const day = romeToday();
  if (!st.chat || !env.TG_BOT_TOKEN) return null;
  if (!force) { if (!st.divergenze || (await kvGet(env, "tg_d:" + day)) || romeHM() < (st.ora_div || "12:30")) return null;
    const O = await tgOggi(env); if (O.svolta || O.n >= TG_TETTO) { await kvSet(env, "tg_d:" + day, { skip: O.svolta ? "svolta" : "tetto", at: new Date().toISOString() }); return null; } }
  const ov = ((await kvGet(env, "ch_ov:" + day)) || {}).div || {};
  if (ov.skip) { if (!force) await kvSet(env, "tg_d:" + day, { skip: true, at: new Date().toISOString() }); return null; }
  const br = await tgBriefing(env, day);
  const dv = br && br.tg_divergenza ? { ...br.tg_divergenza, ...(ov.testo ? { testo: ov.testo } : {}) } : null;
  if (!dv || !dv.testo) { if (!force && (!br || romeHM() >= "14:00")) await kvSet(env, "tg_d:" + day, { none: true, at: new Date().toISOString() }); return null; }
  const link = "https://www.readgeopolitics.com/?utm_source=telegram&utm_campaign=divergenza#briefing";
  let msg = "<b>" + divTitolo(dv.tipo) + "</b>\n\n" + esc(tgClip(dv.testo, 600));
  if (Array.isArray(dv.fonti) && dv.fonti.length) msg += "\n\n<i>" + esc(dv.fonti.slice(0, 4).join(" · ")) + "</i>";
  msg += "\n\n<a href=\"" + link + "\">La storia con tutte le fonti</a>";
  const r = await tgCall(env, "sendMessage", { chat_id: st.chat, text: msg, parse_mode: "HTML", disable_web_page_preview: true });
  await kvSet(env, "tg_d:" + day, { at: new Date().toISOString(), msg: r && r.message_id });
  return { ok: true };
}
/* v46: voti anonimi dei lettori (quale tesi convince di più). Un voto per dispositivo (impronta del dispositivo cifrata), modificabile.
   I conteggi si mostrano solo da VOTE_MIN voti in su: sotto la soglia l'API risponde solo «sotto soglia». */
const VOTE_MIN = 20;
/* tre tipi di sondaggio: t: tesi della storia principale (a, b, n); g: un segnale da osservare (si, no); c: gli scenari di un tema (indice dello scenario) */
const VOTE_KIND = { t: { re: /^t:s-\d{8}-\d{2}$/, ch: ["a", "b", "n"] }, g: { re: /^g:s-\d{8}-\d{2}:\d{1,2}$/, ch: ["si", "no"] }, c: { re: /^c:t-[a-z0-9-]{1,80}:\d{4}-\d{2}-\d{2}$/, ch: ["0", "1", "2", "3", "4", "5", "6", "7"] } };
const voteKind = (poll) => { const k = String(poll).slice(0, 1); const K = VOTE_KIND[k]; return K && K.re.test(poll) ? k : ""; };
let VOTE_T = false;
async function voteTable(env) { if (VOTE_T) return; await env.DB.prepare("CREATE TABLE IF NOT EXISTS votes (poll TEXT NOT NULL, dev TEXT NOT NULL, choice TEXT NOT NULL, at TEXT NOT NULL, PRIMARY KEY (poll, dev))").run(); await env.DB.prepare("CREATE TABLE IF NOT EXISTS polls (poll TEXT PRIMARY KEY, data TEXT NOT NULL, created_at TEXT NOT NULL)").run(); VOTE_T = true; }
const sidDay = (sid) => sid.slice(2, 6) + "-" + sid.slice(6, 8) + "-" + sid.slice(8, 10);
async function docData(env, type, key) { const r = await env.DB.prepare("SELECT data FROM docs WHERE type=?1 AND key=?2 AND status='published'").bind(type, key).first(); if (!r) return null; try { return JSON.parse(r.data) || {}; } catch (e) { return {}; } }
async function pollSnap(env, poll, kind, ctx) { // copia del sondaggio accanto ai voti, così l'analisi resta leggibile anche se il contenuto cambia
  if (await env.DB.prepare("SELECT 1 FROM polls WHERE poll=?1").bind(poll).first()) return;
  let snap = null;
  if (kind === "t") {
    const s = ctx.s, b = (await docData(env, "briefings", ctx.day)) || {};
    const so = (b.sondaggio && b.sondaggio.storia_id === ctx.sid) ? b.sondaggio : {};
    snap = { tipo: "tesi", data: ctx.day, storia_id: ctx.sid, titolo: s.titolo || "", domanda: so.domanda || "Quale tesi ti convince di più?", a: so.a || "Chi sostiene", b: so.b || "Chi si oppone", tesi_a: (s.pro && s.pro.tesi) || "", tesi_b: (s.contro && s.contro.tesi) || "", attori_a: (s.pro && s.pro.attori) || "", attori_b: (s.contro && s.contro.attori) || "", paesi: s.paesi || [], filone_id: s.filone_id || "" };
  } else if (kind === "g") {
    const s = ctx.s;
    snap = { tipo: "segnale", data: ctx.day, storia_id: ctx.sid, i: ctx.i, titolo: s.titolo || "", testo: (s.segnali || [])[ctx.i - 1] || "", paesi: s.paesi || [], filone_id: s.filone_id || "" };
  } else {
    const sc = ctx.th.scenari || {};
    snap = { tipo: "scenario", data: new Date().toISOString().slice(0, 10), filone_id: ctx.tid, titolo: ctx.th.titolo || "", orizzonte: ctx.oriz, domanda: sc.domanda || "", voci: (sc.voci || []).map((v) => ({ id: v.id || "", titolo: v.titolo || "", prob: +v.prob || 0 })), paesi: ctx.th.paesi || [] };
  }
  await env.DB.prepare("INSERT OR IGNORE INTO polls (poll, data, created_at) VALUES (?1, ?2, ?3)").bind(poll, JSON.stringify(snap), new Date().toISOString()).run();
}
async function pollEsito(env, tid, sc) { // v48: quando la routine chiude gli scenari di un tema, l'esito resta accanto ai voti (anche se poi il tema apre scenari nuovi)
  if (!sc || sc.stato !== "chiuso" || !sc.esito || !/^\d{4}-\d{2}-\d{2}$/.test(sc.orizzonte || "")) return;
  const poll = "c:" + tid + ":" + sc.orizzonte;
  await voteTable(env);
  const voci = (sc.voci || []).map((v) => ({ id: v.id || "", titolo: v.titolo || "", prob: +v.prob || 0 }));
  const i = voci.findIndex((v) => v.id && v.id === sc.esito);
  const r = await env.DB.prepare("SELECT data FROM polls WHERE poll=?1").bind(poll).first();
  let d = {}; if (r) { try { d = JSON.parse(r.data) || {}; } catch (e) {} } else d = { tipo: "scenario", data: sc.orizzonte, filone_id: tid, titolo: "", orizzonte: sc.orizzonte, domanda: sc.domanda || "", voci };
  if (d.esito_id === sc.esito) return;
  Object.assign(d, { esito_id: sc.esito, esito_i: i, esito_titolo: i >= 0 ? voci[i].titolo : "", esito_prob: i >= 0 ? ((((d.voci || []).find((v) => v.id === sc.esito)) || {}).prob ?? ((((sc.voci[i] || {}).storico || [])[0] || {}).p ?? voci[i].prob)) : null, nota_esito: sc.nota_esito || "", esito_il: romeToday() });
  await env.DB.prepare("INSERT INTO polls (poll, data, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(poll) DO UPDATE SET data=?2").bind(poll, JSON.stringify(d), new Date().toISOString()).run();
}
function voteShape(poll, raw, all) { // conteggi per scelta; sotto soglia solo «sotto soglia», tranne che per il pannello (all)
  const kind = voteKind(poll); const c = {}; for (const ch of VOTE_KIND[kind].ch) c[ch] = 0;
  for (const [ch, n] of Object.entries(raw || {})) if (ch in c) c[ch] = n;
  const tot = Object.values(c).reduce((a, b) => a + b, 0);
  if (!all && tot < VOTE_MIN) return { sotto_soglia: true, min: VOTE_MIN, n: tot }; // v57: quanti hanno votato (solo il numero), per «sei tra i primi N»
  if (kind === "t") return { tot, a: c.a, b: c.b, n: c.n };
  if (kind === "c") { const k = Object.keys(c).filter((x) => c[x] > 0 || +x < 3); const o = {}; for (const x of k) o[x] = c[x]; return { tot, c: o }; }
  return { tot, c };
}
async function voteCounts(env, polls, all) {
  await voteTable(env); const out = {}; if (!polls.length) return out;
  const { results } = await env.DB.prepare("SELECT poll, choice, COUNT(*) AS n FROM votes WHERE poll IN (" + polls.map((_, i) => "?" + (i + 1)).join(",") + ") GROUP BY poll, choice").bind(...polls).all();
  const raw = {}; for (const r of results || []) (raw[r.poll] ||= {})[r.choice] = r.n;
  for (const pl of polls) out[pl] = voteShape(pl, raw[pl], all);
  return out;
}
async function voteStats(env) { // per il pannello: tutti i sondaggi con i conteggi veri (anche sotto soglia) e qualche misura aggregata
  await voteTable(env);
  const P = (await env.DB.prepare("SELECT poll, data, created_at FROM polls ORDER BY created_at DESC LIMIT 150").all()).results || [];
  const C = (await env.DB.prepare("SELECT poll, choice, COUNT(*) AS n FROM votes GROUP BY poll, choice").all()).results || [];
  const T = await env.DB.prepare("SELECT COUNT(*) AS v, COUNT(DISTINCT dev) AS d FROM votes").first();
  const R2 = await env.DB.prepare("SELECT COUNT(*) AS n FROM (SELECT dev FROM votes GROUP BY dev HAVING COUNT(DISTINCT poll) >= 2)").first();
  const G = (await env.DB.prepare("SELECT substr(at,1,10) AS g, COUNT(*) AS n FROM votes WHERE at >= ?1 GROUP BY g ORDER BY g").bind(new Date(Date.now() - 14 * 86400000).toISOString()).all()).results || [];
  const raw = {}; for (const r of C) (raw[r.poll] ||= {})[r.choice] = r.n;
  const polls = P.filter((r) => voteKind(r.poll)).map((r) => { let d = {}; try { d = JSON.parse(r.data); } catch (e) {} const sh = voteShape(r.poll, raw[r.poll], true); return { poll: r.poll, ...d, la: d.a, lb: d.b, ...sh }; });
  return { min: VOTE_MIN, voti: (T && T.v) || 0, dispositivi: (T && T.d) || 0, ricorrenti: (R2 && R2.n) || 0, giorni: G, polls };
}
async function voteApi(request, env) {
  let b = null; try { b = JSON.parse((await request.text()).slice(0, 2000)); } catch (e) {}
  const poll = String((b && b.poll) || ""), choice = String((b && b.choice) || ""), dev = String((b && b.dev) || "");
  const kind = voteKind(poll);
  const del = choice === "x"; // v58: «Togli il voto»
  if (!kind || (!del && !VOTE_KIND[kind].ch.includes(choice)) || !/^[A-Za-z0-9_-]{12,64}$/.test(dev)) return fail(422, "bad_vote");
  let ctx = null;
  if (kind === "t" || kind === "g") {
    const sid = poll.slice(2, 15); const s = await docData(env, "stories", sid); if (!s) return fail(404, "no_story");
    const day = sidDay(sid); if (Date.now() - Date.parse(day + "T00:00:00Z") > (kind === "t" ? 3 : 8) * 86400000) return fail(410, "closed");
    ctx = { sid, s, day };
    if (kind === "g") { ctx.i = +poll.split(":")[2]; if (!(s.segnali || [])[ctx.i - 1]) return fail(404, "no_signal"); }
  } else {
    const [, tid, oriz] = poll.split(":"); const th = await docData(env, "threads", tid); if (!th) return fail(404, "no_theme");
    const sc = th.scenari || {}; if (sc.orizzonte !== oriz || sc.stato === "chiuso") return fail(410, "closed");
    if (!del && +choice >= (sc.voci || []).length) return fail(422, "bad_vote");
    if (Date.now() > Date.parse(oriz + "T23:59:59Z")) return fail(410, "closed");
    ctx = { tid, oriz, th };
  }
  await voteTable(env);
  const h = await sha256("rg-vote|" + dev);
  if (del) { await env.DB.prepare("DELETE FROM votes WHERE poll=?1 AND dev=?2").bind(poll, h).run(); return json({ ok: true, ...(await voteCounts(env, [poll])) }, 200, CORS); }
  await pollSnap(env, poll, kind, ctx);
  await env.DB.prepare("INSERT INTO votes (poll, dev, choice, at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(poll, dev) DO UPDATE SET choice=?3, at=?4").bind(poll, h, choice, new Date().toISOString()).run();
  return json({ ok: true, ...(await voteCounts(env, [poll])) }, 200, CORS);
}
async function votesApi(url, env) {
  const polls = [...new Set(String(url.searchParams.get("p") || "").split(","))].filter(voteKind).slice(0, 40);
  return json({ ok: true, polls: await voteCounts(env, polls) }, 200, { ...CORS, "cache-control": "public, max-age=60" });
}
async function tgDossier(env, id, d) { // v45: messaggio sul canale quando un dossier nuovo arriva sul sito
  const st = await tgSettings(env);
  if (!st.chat || !env.TG_BOT_TOKEN || st.dossier === false) return null;
  if (await kvGet(env, "tg_dz:" + id)) return null;
  const lead = String(d.in_breve || "").replace(/\s*\[\d+\]/g, "").replace(/\s+/g, " ").trim();
  const link = "https://www.readgeopolitics.com/?utm_source=telegram&utm_campaign=dossier#dossier=" + encodeURIComponent(id);
  let msg = "<b>🧭 Nuovo dossier · " + esc(tgClip(d.titolo || "", 120)) + "</b>\n\n" + esc(tgClip(lead, 420));
  msg += "\n\nDa dove nasce, chi sono gli attori e cosa vogliono, le versioni a confronto, i numeri, gli scenari.";
  msg += "\n\n<a href=\"" + link + "\">Leggi il dossier</a>";
  const r = await tgCall(env, "sendMessage", { chat_id: st.chat, text: msg, parse_mode: "HTML", disable_web_page_preview: true });
  await kvSet(env, "tg_dz:" + id, { at: new Date().toISOString(), msg: r && r.message_id });
  return { ok: true };
}
async function bilancioData(env, day) { // i segnali risolti nella settimana (dalle «verifiche» quotidiane dei briefing)
  const from = new Date(Date.parse(day + "T12:00:00Z") - 6 * 86400000).toISOString().slice(0, 10);
  const prev = new Date(Date.parse(day + "T12:00:00Z") - 13 * 86400000).toISOString().slice(0, 10);
  const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='briefings' AND key>=?1 AND key<=?2 AND status='published' ORDER BY key").bind(prev, day).all();
  const seen = new Map(); let open = 0; let last = "";
  for (const r of results || []) {
    let b; try { b = JSON.parse(r.data); } catch (e) { continue; }
    last = r.key;
    for (const v of Array.isArray(b.verifiche) ? b.verifiche : []) {
      if (!v || !v.segnale) continue;
      const k = String(v.segnale).trim().toLowerCase();
      if (v.esito === "non ancora") continue;
      if (!seen.has(k)) seen.set(k, { ...v, giorno: r.key });
    }
  }
  for (const r of results || []) if (r.key === last) { try { open = (JSON.parse(r.data).verifiche || []).filter((v) => v && v.esito === "non ancora").length; } catch (e) {} }
  const done = [...seen.values()].filter((v) => v.giorno >= from);
  try { // v47: cosa avevano previsto i lettori (sì/no sui segnali), solo con almeno VOTE_MIN voti
    await voteTable(env);
    const P = (await env.DB.prepare("SELECT poll, data FROM polls WHERE poll LIKE 'g:%' AND created_at >= ?1").bind(new Date(Date.now() - 40 * 86400000).toISOString()).all()).results || [];
    const byTxt = new Map(); for (const r of P) { try { const d = JSON.parse(r.data); if (d.testo) byTxt.set(String(d.testo).trim().toLowerCase(), r.poll); } catch (e) {} }
    const want = done.map((v) => byTxt.get(String(v.segnale).trim().toLowerCase())).filter(Boolean);
    const C = want.length ? await voteCounts(env, want) : {};
    for (const v of done) { const pl = byTxt.get(String(v.segnale).trim().toLowerCase()); const c = pl && C[pl]; if (c && c.tot) v.lettori = Math.round(100 * c.c.si / c.tot); }
  } catch (e) {}
  let scen = [];
  try {
    await voteTable(env);
    const P = (await env.DB.prepare("SELECT poll, data FROM polls WHERE poll LIKE 'c:%'").all()).results || [];
    const cl = P.map((r) => { try { return { poll: r.poll, ...JSON.parse(r.data) }; } catch (e) { return null; } }).filter((d) => d && d.esito_il && d.esito_il >= from && d.esito_il <= day);
    const C = cl.length ? await voteCounts(env, cl.map((d) => d.poll)) : {};
    scen = cl.map((d) => { const c = C[d.poll]; return { ...d, lettori: c && c.tot && d.esito_i >= 0 ? Math.round(100 * ((c.c || {})[String(d.esito_i)] || 0) / c.tot) : null }; });
  } catch (e) {}
  // v52: tema di ogni segnale (dalla storia che lo indicava), doppioni tolti (stesso tema, stesso esito, stesso giorno di verifica), 4 voci scelte da ricordare
  let uniq = done;
  try {
    const ids = [...new Set(done.map((v) => v.storia_id).filter(Boolean))];
    const SM = {}, TM = {};
    for (let i = 0; i < ids.length; i += 80) { const part = ids.slice(i, i + 80); const ph = part.map((_, j) => "?" + (j + 1)).join(",");
      for (const r of ((await env.DB.prepare("SELECT key, data FROM docs WHERE type='stories' AND key IN (" + ph + ")").bind(...part).all()).results || [])) { try { const d = JSON.parse(r.data); SM[r.key] = { titolo: d.titolo || "", filone: d.filone_id || "" }; } catch (e) {} } }
    const fil = [...new Set(Object.values(SM).map((x) => x.filone).filter(Boolean))];
    if (fil.length) { const ph = fil.map((_, j) => "?" + (j + 1)).join(","); for (const r of ((await env.DB.prepare("SELECT key, data FROM docs WHERE type='threads' AND key IN (" + ph + ")").bind(...fil).all()).results || [])) { try { { const t = JSON.parse(r.data); TM[r.key] = t.breve || (String(t.titolo || "").length <= 28 ? t.titolo : ""); } } catch (e) {} } }
    const lab = (v) => { const st = SM[v.storia_id]; const t = st && TM[st.filone]; if (t) return t; const a = st && String(st.titolo).split(":")[0].trim(); return a && a.length <= 28 && a.length < String(st.titolo).length ? a : ""; };
    const seenK = new Set(); uniq = [];
    for (const v of done) { const st = SM[v.storia_id]; const k = st && st.filone ? st.filone + "|" + v.esito + "|" + v.giorno : "s|" + String(v.segnale).toLowerCase(); if (seenK.has(k)) continue; seenK.add(k); uniq.push({ ...v, tema: lab(v), filone: st ? st.filone : "", rango: parseInt(String(v.storia_id || "").split("-").pop(), 10) || 9 }); }
  } catch (e) {}
  const ok = uniq.filter((v) => v.esito === "avvenuto"), alt = uniq.filter((v) => v.esito === "smentito"), fermi = uniq.filter((v) => v.esito === "scaduto");
  // v55: un fatto raccontato con date tutte precedenti alla settimana (es. «Il 12 ottobre l'UE…») passa in fondo: il segnale si è chiuso ora, ma il fatto è vecchio
  const yr = day.slice(0, 4);
  const vecchio = (v) => { const D = [...String(v.nota || "").matchAll(/\b(\d{1,2})(?:°|º)?\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/gi)].map((m) => yr + "-" + String(IT_MM.indexOf(m[2].toLowerCase()) + 1).padStart(2, "0") + "-" + m[1].padStart(2, "0")); return D.length > 0 && D.every((d) => d < from); };
  const score = (v) => v.rango + (v.esito === "smentito" ? -2 : 0) + (vecchio(v) ? 100 : 0);
  const pick = []; const usati = new Set();
  const take = (L, n) => { for (const v of [...L].filter((x) => x.nota).sort((a, z) => score(a) - score(z) || String(z.giorno).localeCompare(String(a.giorno)))) { if (pick.length >= 4 || n <= 0) break; if (v.filone && usati.has(v.filone)) continue; pick.push(v); if (v.filone) usati.add(v.filone); n--; } };
  take(alt, 2); take(ok, 4 - pick.length); take(alt, 4 - pick.length);
  return { scen, ok, alt, fermi, no: alt.concat(fermi), scelti: pick, open };
}
function bilancioText(B) {
  const n = (x) => (x || []).length;
  let msg = "<b>Com'è andata la settimana</b>\nSotto ogni storia indichiamo cosa osservare: i fatti che dicono da che parte andrà. Ecco da che parte sono andati.\n\n" +
    "Questa settimana " + (n(B.ok) + n(B.alt) + n(B.fermi)) + " segnali sono arrivati a scadenza:\n🟢 " + n(B.ok) + " sono successi · 🔀 " + n(B.alt) + " sono andati diversamente · ⚪ " + n(B.fermi) + " non si sono mossi" + (B.open ? "\n(" + B.open + " sono ancora aperti)" : "");
  const S = (B.scelti || []).slice(0, 2); // v61: due fatti da ricordare, non quattro
  if (S.length) msg += "\n\n<b>Da ricordare</b>\n" + S.map((v) => (v.esito === "avvenuto" ? "🟢 " : "🔀 ") + (v.tema ? "<b>" + esc(v.tema) + "</b> · " : "") + esc(tgClip(v.nota || v.segnale, 200)) + (v.lettori != null ? "\n<i>Il " + v.lettori + "% dei lettori aveva detto sì</i>" : "")).join("\n\n");
  if ((B.scen || []).length) msg += "\n\n<b>Gli scenari</b>\n" + B.scen.slice(0, 4).map((s) => "📊 " + esc(tgClip(s.domanda || s.titolo || "", 160)) + "\nÈ andata: <b>" + esc(tgClip(s.esito_titolo || "—", 120)) + "</b>" + (s.esito_prob != null ? "\n<i>L'agente gli dava il " + s.esito_prob + "%" + (s.lettori != null ? ", i lettori il " + s.lettori + "%" : "") + "</i>" : "")).join("\n\n");
  return msg + "\n\n<a href=\"https://www.readgeopolitics.com/?utm_source=telegram&utm_campaign=bilancio\">Tutti i temi su Read Geopolitics</a>";
}
async function tgBilancio(env, force) {
  const st = await tgSettings(env); const day = romeToday();
  if (!st.chat || !env.TG_BOT_TOKEN) return null;
  if (!force) { if (!st.bilancio || romeDow(day) !== 7 || (await kvGet(env, "tg_b:" + day)) || romeHM() < (st.ora_bil || "18:00")) return null; }
  const B = await bilancioData(env, day);
  if (!B.ok.length && !B.no.length && !(B.scen || []).length) { if (!force) await kvSet(env, "tg_b:" + day, { none: true, at: new Date().toISOString() }); return null; }
  const r = await tgCall(env, "sendMessage", { chat_id: st.chat, text: bilancioText(B), parse_mode: "HTML", disable_web_page_preview: true });
  await kvSet(env, "tg_b:" + day, { at: new Date().toISOString(), msg: r && r.message_id });
  return { ok: true };
}
// «Oggi sui canali» nel pannello: anteprima, stato, modifica e stop per oggi
async function canaliInfo(env) {
  const day = romeToday(); const tg = await tgSettings(env); const th = await thSettings(env);
  const ov = (await kvGet(env, "ch_ov:" + day)) || {};
  const br = await tgBriefing(env, day);
  const d = await kvGet(env, "draft:" + day + "-daily");
  const chan = String(tg.chat || "").replace(/^@/, "");
  const tgD = await kvGet(env, "tg_d:" + day), thQ = await kvGet(env, "thq:" + day);
  const dv = br && br.tg_divergenza;
  const out = {
    div: { on: tg.divergenze !== false && !!tg.chat, ora: tg.ora_div || "12:30", briefing: !!br, testo: (ov.div && ov.div.testo) || (dv && dv.testo) || "", fonti: (dv && dv.fonti) || [], titolo: divTitolo(dv && dv.tipo), modificato: !!(ov.div && ov.div.testo), skip: !!(ov.div && ov.div.skip),
      stato: tgD ? (tgD.msg ? "uscito" : tgD.skip === "svolta" || tgD.skip === "tetto" ? "saltato" : tgD.skip ? "fermato" : "assente") : null, motivo: tgD && tgD.skip === "svolta" ? "oggi è già uscita una svolta" : tgD && tgD.skip === "tetto" ? "raggiunto il tetto di 3 messaggi" : "", link: tgD && tgD.msg && chan ? "https://t.me/" + chan + "/" + tgD.msg : null },
    dom: { on: th.domanda !== false, ora: th.ora_dom || "18:00", testo: (ov.dom && ov.dom.testo) || (d && d.th_domanda) || "", modificato: !!(ov.dom && ov.dom.testo), skip: !!(ov.dom && ov.dom.skip), post: d ? d.status : null,
      stato: thQ ? (thQ.status === "pubblicato" ? "uscito" : thQ.skip ? "fermato" : thQ.status === "errore" ? "errore" : "assente") : null, link: thQ && thQ.link ? thQ.link : null, errore: thQ && thQ.error ? thQ.error : null },
  };
  const dow = romeDow(day);
  if (dow >= 6 && tg.bilancio !== false && tg.chat) { const B = await bilancioData(env, day); const tgB = dow === 7 ? await kvGet(env, "tg_b:" + day) : null;
    out.bil = { ora: tg.ora_bil || "18:00", domenica: dow === 7, ok: B.ok.length, alt: (B.alt || []).length, fermi: (B.fermi || []).length, no: B.no.length, open: B.open, righe: (B.scelti || []).map((v) => (v.esito === "avvenuto" ? "🟢 " : "🔀 ") + (v.tema ? v.tema + " · " : "") + String(v.nota || v.segnale)), altri: 0,
      stato: tgB ? (tgB.msg ? "uscito" : "assente") : null, link: tgB && tgB.msg && chan ? "https://t.me/" + chan + "/" + tgB.msg : null }; }
  return out;
}
async function canaliSet(env, b) {
  const day = romeToday(); const ov = (await kvGet(env, "ch_ov:" + day)) || {};
  const w = b.which === "dom" ? "dom" : "div"; const cur = ov[w] || {};
  if (typeof b.testo === "string") { const s = b.testo.trim().slice(0, w === "dom" ? 500 : 600); if (s) cur.testo = s; else delete cur.testo; }
  if (typeof b.skip === "boolean") cur.skip = b.skip;
  ov[w] = cur; await kvSet(env, "ch_ov:" + day, ov);
  if (b.skip === false) { const k = (w === "dom" ? "thq:" : "tg_d:") + day; const s = await kvGet(env, k); if (s && s.skip) await kvDel(env, k); }
  return { ok: true, canali: await canaliInfo(env) };
}
// v60: storia Instagram con la domanda di previsione (briefing.storia_ig): immagine, testi da copiare, numeri dello sticker inseriti a mano
async function sondInfo(env) {
  const day = romeToday(), ieri = romeYesterday();
  const [br, bi] = await Promise.all([tgBriefing(env, day), tgBriefing(env, ieri)]);
  const SC = (await kvGet(env, "sond_scelte")) || {};
  const cands = (b) => (b && b.storia_ig ? [b.storia_ig].concat(Array.isArray(b.storia_ig_alt) ? b.storia_ig_alt.slice(0, 2) : []) : []);
  const pick = (b, d) => { const c = cands(b); const n = Math.min(c.length - 1, Math.max(0, SC[d] || 0)); return c.length ? { ...c[n], n } : null; };
  const q = pick(br, day), qi = pick(bi, ieri);
  const scelte = cands(br).map((x, i) => ({ n: i, tema: x.tema || "", sticker: x.sticker || "", titolo: x.titolo || "", perche: x.perche || "" }));
  const days = []; for (let i = 7; i >= 1; i--) days.push(new Date(Date.parse(day + "T12:00:00Z") - i * 86400000).toISOString().slice(0, 10));
  const nums = await Promise.all(days.concat([day]).map((d) => kvGet(env, "sond:" + d)));
  const N = Object.fromEntries(days.concat([day]).map((d, i) => [d, nums[i] || null]));
  const V = Array.isArray(br && br.storia_ig_verdetti) ? br.storia_ig_verdetti.filter((v) => v && /^\d{4}-\d{2}-\d{2}$/.test(v.data || "") && (v.n || 0) === (SC[v.data] || 0)).slice(0, 3) : [];
  const verdetti = (await Promise.all(V.map(async (v) => { const [b0, n0] = await Promise.all([tgBriefing(env, v.data), kvGet(env, "sond:" + v.data)]); const q0 = cands(b0)[v.n || 0]; return q0 ? { ...q0, day: v.data, num: n0 && n0.votanti != null ? n0 : null, esito: v.esito === "sì" || v.esito === "si" ? "sì" : "no", riga: v.riga || "", fonte: v.fonte || null } : null; }))).filter(Boolean);
  const todo = (await kvGet(env, "todo:" + day)) || {};
  // v61: scenari chiusi negli ultimi 3 giorni, da raccontare in una storia «Com'è andata»
  let scenari = [];
  try {
    const lim = new Date(Date.parse(day + "T12:00:00Z") - 3 * 86400000).toISOString().slice(0, 10);
    const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='threads' AND json_extract(data,'$.scenari.stato')='chiuso' AND json_extract(data,'$.scenari.aggiornato')>=?1 LIMIT 4").bind(lim).all();
    const T = (results || []).map((r) => ({ id: r.key, t: JSON.parse(r.data) })).filter((x) => x.t.scenari && x.t.scenari.esito && (x.t.scenari.voci || []).some((v) => v.id === x.t.scenari.esito));
    const polls = T.map((x) => "c:" + x.id + ":" + x.t.scenari.orizzonte); const VC = polls.length ? await voteCounts(env, polls, true) : {};
    scenari = T.map((x, i) => { const sc = x.t.scenari; return { id: x.id, tema: x.t.breve || x.t.titolo || "", bandiere: x.t.bandiere || [], domanda: sc.domanda || "", orizzonte: sc.orizzonte, chiuso: sc.aggiornato, esito: sc.esito, nota_esito: sc.nota_esito || "", voci: (sc.voci || []).map((v) => ({ id: v.id, breve: v.breve || v.titolo, titolo: v.titolo, prob: v.prob, storico: v.storico || [] })), voti: VC[polls[i]] || null }; });
  } catch (e) {}
  return { day, todo, scenari, verdetti, scelte, scelta: q ? q.n : 0, oggi: q ? { ...q, pub: !!(N[day] && N[day].pub) } : null, ieri: qi ? { ...qi, day: ieri, num: N[ieri], riga: q && q.ieri ? q.ieri : null } : null, sett: days.map((d) => ({ d, n: N[d] })) };
}
async function sondPick(env, b) {
  const day = romeToday(); const br = await tgBriefing(env, day); const c = br && br.storia_ig ? 1 + (Array.isArray(br.storia_ig_alt) ? Math.min(2, br.storia_ig_alt.length) : 0) : 0;
  const n = parseInt(b.n, 10); if (!(n >= 0 && n < c)) return { ok: false, error: "scelta non valida" };
  const SC = (await kvGet(env, "sond_scelte")) || {}; SC[day] = n;
  const lim = new Date(Date.parse(day + "T12:00:00Z") - 90 * 86400000).toISOString().slice(0, 10); for (const d of Object.keys(SC)) if (d < lim) delete SC[d];
  await kvSet(env, "sond_scelte", SC); return { ok: true, sond: await sondInfo(env) };
}
async function todoSet(env, b) {
  const day = romeToday(); const t = (await kvGet(env, "todo:" + day)) || {}; const k = String(b.k || "").slice(0, 40);
  if (!/^[a-z0-9-]+$/.test(k)) return { ok: false, error: "voce non valida" };
  if (b.v) t[k] = new Date().toISOString(); else delete t[k];
  await kvSet(env, "todo:" + day, t); return { ok: true, sond: await sondInfo(env) };
}
async function sondSet(env, b) {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(b.day || "") ? b.day : romeToday();
  const cur = (await kvGet(env, "sond:" + day)) || {};
  const int = (v, max) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= 0 && n <= max ? n : null; };
  if (b.pub !== undefined) cur.pub = !!b.pub;
  if (b.visti !== undefined) { const v = int(b.visti, 1e6), t = int(b.votanti, 1e6), s = int(b.si, 100); if (v == null || t == null || s == null || t > v) return { ok: false, error: "numeri non validi" }; Object.assign(cur, { visti: v, votanti: t, si: s, at: new Date().toISOString() }); }
  await kvSet(env, "sond:" + day, cur);
  return { ok: true, sond: await sondInfo(env) };
}
async function thDomanda(env, force) {
  const st = await thSettings(env); const day = romeToday();
  if (!(await kvGet(env, "th_token"))) return null;
  if (!force) { if (!st.domanda || (await kvGet(env, "thq:" + day)) || romeHM() < (st.ora_dom || "18:00")) return null; }
  const d = await kvGet(env, "draft:" + day + "-daily");
  const ovq = ((await kvGet(env, "ch_ov:" + day)) || {}).dom || {};
  if (ovq.skip) { if (!force) await kvSet(env, "thq:" + day, { skip: true, at: new Date().toISOString() }); return null; }
  const q = ovq.testo || (d && typeof d.th_domanda === "string" ? d.th_domanda.trim() : "");
  if (!d || d.status !== "pubblicata" || !q) { if (!force && romeHM() >= "21:00") await kvSet(env, "thq:" + day, { none: true, at: new Date().toISOString() }); return null; }
  const t = await thToken(env);
  const x = { status: "invio", at: new Date().toISOString() };
  try {
    const tail = "\n\nLe due tesi a confronto e il voto dei lettori: https://www.readgeopolitics.com/?utm_source=threads&utm_campaign=domanda#briefing";
    const c = await thCall(t, "POST", "/" + t.user_id + "/threads", { media_type: "TEXT", text: q.slice(0, 500 - tail.length) + tail, ...(st.topic ? { topic_tag: String(st.topic).replace(/[.&]/g, "").slice(0, 50) } : {}) });
    await new Promise((r) => setTimeout(r, 3000));
    const p = await thCall(t, "POST", "/" + t.user_id + "/threads_publish", { creation_id: c.id });
    x.status = "pubblicato"; x.media_id = p.id;
    try { const m = await thCall(t, "GET", "/" + p.id, { fields: "permalink" }); x.link = m.permalink || null; } catch (e) {}
  } catch (e) { x.status = "errore"; x.error = thErr(e); }
  await kvSet(env, "thq:" + day, x);
  return x;
}
async function tgAuto(env, id) {
  const st = await tgSettings(env);
  if (!st.post || !st.chat || !env.TG_BOT_TOKEN) return;
  const d = await kvGet(env, "draft:" + id);
  if (!d || !["reel", "carousel", "image"].includes(d.type) || (await kvGet(env, "tg:" + id))) return;
  await tgSendDraft(env, id, "auto");
}
async function tgPanelInfo(env) {
  const st = await tgSettings(env);
  const err = await kvGet(env, "tg_err");
  return { configurato: !!env.TG_BOT_TOKEN, settings: st, oggi: await kvGet(env, "tg_m:" + romeToday()), errore: err && err.at > new Date(Date.now() - 6 * 3600000).toISOString() ? err.msg : null };
}
async function tgPanelApi(env, b) {
  const act = b.action;
  if (act === "canali_set") return await canaliSet(env, b);
  if (act === "sond_set") return await sondSet(env, b);
  if (act === "todo_set") return await todoSet(env, b);
  if (act === "sond_pick") return await sondPick(env, b);
  if (act === "tg_priv_code") { // chat privata con il bot, per gli avvisi delle svolte: un codice da mandare con /start
    const me = await tgCall(env, "getMe", {});
    const code = "rg" + rid().slice(0, 8);
    await kvSet(env, "tg_priv_code", { code, exp: Date.now() + 30 * 60000 });
    return { ok: true, bot: me.username, link: "https://t.me/" + me.username + "?start=" + code, code };
  }
  if (act === "tg_priv_check") {
    const c = await kvGet(env, "tg_priv_code");
    if (!c || c.exp < Date.now()) throw { status: 409, code: "codice_scaduto", detail: "Il codice è scaduto: premi di nuovo «Collega»." };
    const ups = await tgCall(env, "getUpdates", { limit: 100, allowed_updates: ["message"] });
    const m = (ups || []).map((u) => u.message).filter(Boolean).reverse().find((x) => x.chat && x.chat.type === "private" && String(x.text || "").trim() === "/start " + c.code);
    if (!m) return { ok: false, error: "non_trovato", detail: "Non vedo ancora il messaggio: apri il link, premi Avvia nel bot e riprova." };
    const cur = await tgSettings(env); cur.priv_chat = String(m.chat.id); cur.priv_nome = clip(m.chat.first_name || m.chat.username, 40);
    await kvSet(env, "tg_settings", cur); await kvDel(env, "tg_priv_code");
    try { await tgCall(env, "sendMessage", { chat_id: cur.priv_chat, text: "✅ Collegato. Qui ti arrivano solo gli avvisi delle svolte, per approvarle dal pannello." }); } catch (e) {}
    return { ok: true, telegram: await tgPanelInfo(env) };
  }
  if (act === "tg_priv_set") {
    const cur = await tgSettings(env);
    if (b.off) { delete cur.priv_chat; delete cur.priv_nome; }
    if (typeof b.riepilogo === "boolean") cur.priv_riepilogo = b.riepilogo;
    await kvSet(env, "tg_settings", cur);
    return { ok: true, telegram: await tgPanelInfo(env) };
  }
  if (act === "tg_priv_test") { const r = await tgPriv(env, "Prova: gli avvisi delle svolte arrivano qui."); if (!r) throw { status: 409, code: "non_collegato" }; return { ok: true }; }
  if (act === "tg_settings") {
    const cur = await tgSettings(env);
    if (typeof b.chat === "string") { const c = b.chat.trim(); cur.chat = !c ? "" : /^-?\d+$/.test(c) ? c : "@" + c.replace(/^@|^https?:\/\/t\.me\//g, "").replace(/[^A-Za-z0-9_]/g, ""); }
    if (typeof b.mattino === "boolean") cur.mattino = b.mattino;
    if (typeof b.post === "boolean") cur.post = b.post;
    if (typeof b.divergenze === "boolean") cur.divergenze = b.divergenze;
    if (typeof b.bilancio === "boolean") cur.bilancio = b.bilancio;
    if (typeof b.sera === "boolean") cur.sera = b.sera;
    if (typeof b.dossier === "boolean") cur.dossier = b.dossier;
    if (/^\d{2}:\d{2}$/.test(b.ora || "")) cur.ora = b.ora;
    await kvSet(env, "tg_settings", cur);
    return { ok: true, telegram: await tgPanelInfo(env) };
  }
  if (act === "tg_sera_prova") { const A = await tgSeraData(env, romeToday()); if (!A.length) return { ok: false, error: "nessun_aggiornamento", detail: "Oggi non ci sono aggiornamenti da riassumere." }; const r = await tgPriv(env, tgSeraText(A, romeToday())); return { ok: !!r, n: A.length }; }
  if (act === "tg_morning") { const r = await tgMorning(env, true, null); return { ok: true, sent: r, telegram: await tgPanelInfo(env) }; }
  if (act === "tg_send") return { ok: true, tg: await tgSendDraft(env, String(b.id), "panel") };
  return null;
}
// ============ fine Telegram ============

async function ttPublic(request, env, p, url) {
  const redirect = url.origin + "/tt/callback";
  if (p === "/tt/connect") {
    const okK = safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "");
    if (!okK && !(await sessionOk(request, env))) return htmlPage("Accesso negato", "<p>Entra prima nel pannello (/ig/panel) e premi «Collega TikTok» da lì.</p>", 401);
    if (!env.TT_CLIENT_KEY || !env.TT_CLIENT_SECRET) return htmlPage("Mancano le chiavi TikTok", "<p>Aggiungi al Worker i secret <b>TT_CLIENT_KEY</b> e <b>TT_CLIENT_SECRET</b> (dalla tua app su developers.tiktok.com) e riprova.</p>", 500);
    const state = crypto.randomUUID().replace(/-/g, "");
    await kvSet(env, "tt_state", { state, exp: Date.now() + 10 * 60000 });
    return Response.redirect("https://www.tiktok.com/v2/auth/authorize/?" + new URLSearchParams({ client_key: env.TT_CLIENT_KEY, scope: ttScope(env), response_type: "code", redirect_uri: redirect, state }), 302);
  }
  if (p === "/tt/callback") {
    const err = url.searchParams.get("error_description") || url.searchParams.get("error");
    if (err) return htmlPage("TikTok ha rifiutato", `<p>${esc(err)}</p>`, 400);
    const code = url.searchParams.get("code") || "";
    const st = await kvGet(env, "tt_state");
    if (!code || !st || st.exp < Date.now() || !safeEq(url.searchParams.get("state") || "", st.state))
      return htmlPage("Richiesta non valida", "<p>Stato scaduto o non riconosciuto. Torna nel pannello e premi di nuovo «Collega TikTok».</p>", 400);
    await kvDel(env, "tt_state");
    const j = await ttExchange(env, { code, grant_type: "authorization_code", redirect_uri: redirect });
    if (!j.access_token) return htmlPage("Scambio del codice fallito", `<pre>${esc(JSON.stringify({ error: j.error, error_description: j.error_description, log_id: j.log_id }))}</pre>`, 502);
    const t = ttPack(j, null);
    const sc = String(j.scope || "");
    try { const ci = await ttCall(t, "/v2/post/publish/creator_info/query/", {}); t.username = ci.creator_username || null; t.nickname = ci.creator_nickname || null; }
    catch (e) { try { const r = await fetch(TT_API + "/v2/user/info/?fields=open_id,display_name", { headers: { authorization: "Bearer " + t.access_token } }); const u = await gj(r); t.nickname = (u.data && u.data.user && u.data.user.display_name) || null; } catch (_) {} }
    await kvSet(env, "tt_token", t);
    const miss = ttScope(env).split(",").filter((s) => !sc.split(",").includes(s));
    return htmlPage("TikTok collegato ✅", `<p>Account: <b>${t.username ? "@" + esc(t.username) : t.nickname ? esc(t.nickname) : "(nome non letto)"}</b>.</p>` + (miss.length ? `<p style="color:#b00">Permessi mancanti: ${esc(miss.join(", "))}. Ricollega e accettali tutti.</p>` : "") + `<p>Il collegamento è salvato nel Worker e non viene mai mostrato. Torna al <a href="/ig/panel">pannello</a>.</p>`);
  }
  return null;
}
async function ttPanelApi(env, b) {
  const act = b.action;
  if (act === "tt_send") return { ok: true, tt: await ttSend(env, String(b.id), "panel", !!b.force) };
  if (act === "tt_caption") {
    const d = await kvGet(env, "draft:" + String(b.id));
    if (!d) throw { status: 404, code: "draft_not_found" };
    const c = String(b.caption || "").trim().slice(0, 2200);
    if (c && c !== ttCaption(d.caption)) d.tt_caption = c; else delete d.tt_caption;
    await kvSet(env, "draft:" + d.id, d);
    return { ok: true, tt_cap: d.tt_caption || ttCaption(d.caption) };
  }
  if (act === "tt_mark") { // pubblicato a mano dall'app: TikTok non sempre aggiorna lo stato delle bozze
    const x = await kvGet(env, "tt:" + String(b.id));
    if (!x) throw { status: 404, code: "tt_not_found" };
    x.status = "pubblicato"; x.marked_at = new Date().toISOString(); x.marked = true; delete x.error;
    const link = String(b.link || "").trim();
    if (/^https:\/\/(www\.|vm\.|vt\.|m\.)?tiktok\.com\/[^\s"<>]{3,300}$/.test(link)) x.link = link;
    await kvSet(env, "tt:" + x.id, x);
    return { ok: true, tt: x };
  }
  if (act === "tt_check") return { ok: true, tt: await ttCheck(env, String(b.id)) };
  if (act === "tt_settings") {
    const cur = await ttSettings(env);
    if (["bozza", "diretto"].includes(b.mode)) cur.mode = b.mode;
    if (typeof b.auto === "boolean") cur.auto = b.auto;
    if (["PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "FOLLOWER_OF_CREATOR", "SELF_ONLY"].includes(b.privacy)) cur.privacy = b.privacy;
    await kvSet(env, "tt_settings", cur);
    return { ok: true, tiktok: await ttPanelInfo(env) };
  }
  if (act === "tt_verify") { // file di verifica del prefisso URL scaricato da TikTok: nome + contenuto
    const name = String(b.name || "").trim().split("/").pop();
    if (!/^tiktok[A-Za-z0-9_-]{4,80}\.txt$/.test(name)) throw { status: 400, code: "tt_verify_name", detail: "Il nome deve essere quello del file scaricato da TikTok, tipo tiktokXXXX.txt" };
    const content = String(b.content || "").trim().slice(0, 500);
    if (!content) throw { status: 400, code: "tt_verify_content" };
    const cur = await kvGet(env, "tt_verify");
    const list = (cur ? (Array.isArray(cur.list) ? cur.list : [{ name: cur.name, content: cur.content }]) : []).filter((f) => f.name && f.name !== name);
    list.unshift({ name, content });
    await kvSet(env, "tt_verify", { list: list.slice(0, 6) }); // Sandbox e Production possono avere file diversi: li teniamo tutti
    return { ok: true, tiktok: await ttPanelInfo(env) };
  }
  if (act === "tt_disconnect") { await kvDel(env, "tt_token"); return { ok: true, tiktok: await ttPanelInfo(env) }; }
  return null;
}
async function ttVerifyFile(env, p) { // serve tiktokXXXX.txt in qualunque cartella (es. /ig/img/tiktokXXXX.txt per il prefisso /ig/img/)
  const m = p.match(/\/(tiktok[A-Za-z0-9_-]{4,80}\.txt)$/);
  if (!m) return null;
  const v = await kvGet(env, "tt_verify");
  const f = v ? (Array.isArray(v.list) ? v.list : [v]).find((x) => x.name === m[1]) : null;
  if (!f) return null;
  return new Response(f.content, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
// ============ fine TikTok ============


// ============ Statistiche del sito (v21): GoatCounter letto dal Worker (secret GC_TOKEN, solo lettura) ============
const gcApi = (env) => "https://" + String(env.GC_SITE || "read-geopolitics").trim().replace(/^https?:\/\//, "").replace(/\.goatcounter\.com.*$/, "") + ".goatcounter.com/api/v0"; // GC_SITE (facoltativo): il codice del sito GoatCounter
const gcIso = (ms) => { const d = new Date(ms); d.setUTCMinutes(0, 0, 0); return d.toISOString().replace(/\.\d{3}Z$/, "Z"); };
async function gcGet(env, path, params) {
  const u = new URL(gcApi(env) + path);
  for (const [k, v] of Object.entries(params || {})) u.searchParams.set(k, String(v));
  const r = await fetch(u.toString(), { headers: { authorization: "Bearer " + env.GC_TOKEN, "content-type": "application/json" } });
  const j = await gj(r);
  // GoatCounter risponde 404 «not found» quando nel periodo non c'è nessun dato (es. prima che il sito esistesse): lo trattiamo come vuoto
  if (r.status === 404 && /not found/i.test(String((j && j.error) || ""))) { await new Promise((res) => setTimeout(res, 260)); return { empty: true }; }
  if (!r.ok) throw { status: 502, code: "goatcounter_" + r.status, detail: "GoatCounter " + path + " (" + u.host + "): " + (r.status === 401 ? "chiave non valida o non di questo sito (GC_TOKEN)." : r.status === 403 ? "alla chiave manca il permesso «Read statistics»." : "HTTP " + r.status + " " + String((j && (j.error || JSON.stringify(j.errors || ""))) || "").slice(0, 200)) + (r.status === 404 ? " Controlla che il codice del sito sia giusto: è la parte prima di .goatcounter.com nell'indirizzo della tua dashboard." : "") };
  await new Promise((res) => setTimeout(res, 260)); // GoatCounter: max 4 richieste al secondo
  return j;
}
const GC_REF = [["Instagram", /instagram/i], ["TikTok", /tiktok/i], ["WhatsApp", /whatsapp|wa\.me/i], ["Google", /google/i], ["LinkedIn", /linkedin|lnkd\.in/i], ["Facebook", /facebook|fb\.com|fb\.me/i], ["Threads", /threads/i], ["X", /(^|\.)t\.co$|x\.com|twitter/i], ["Telegram", /telegram|t\.me/i], ["Spotify", /spotify/i], ["Email", /mail|resend/i], ["Bing", /bing/i], ["DuckDuckGo", /duckduckgo/i]];
// v29: nomi leggibili per le provenienze dal nostro sito e per i marcatori utm (prima comparivano come «readgeopolitics.com/…», «ig», «landing»)
const GC_OWN = [["Instagram (link nella bio)", /^ig$/i], ["Pagina Iscriviti (annunci)", /^landing$|readgeopolitics\.(com|it|eu)\/(iscriviti|iscrizione)/i], ["Vecchia edizione condivisa", /^condivisa$/i], ["Altre pagine del sito", /readgeopolitics\.(com|it|eu)|briefinghub\.workers\.dev/i]];
const gcRefName = (n) => { n = String(n || "").trim(); if (!n || /^\(?(no data|unknown|direct)\)?$/i.test(n)) return "Diretto"; const o = GC_OWN.find(([, re]) => re.test(n)); if (o) return o[0]; const g = GC_REF.find(([, re]) => re.test(n)); return g ? g[0] : n.replace(/^www\./, "").slice(0, 40); };
const gcSize = (n) => /tablet/i.test(n) && !/phone/i.test(n) ? "Tablet" : /phone/i.test(n) ? "Telefono" : /monitor|computer|desktop|laptop/i.test(n) ? "Computer" : "Altro";
const gcEv = (p) => String(p || "").replace(/^\/+/, "").replace(/^evento\//, "");
function statSrc(s) {
  s = String(s || "").toLowerCase().replace(/^www\./, "");
  if (!s || s === "diretto") return "Diretto";
  if (s === "ig" || s.includes("instagram")) return "Instagram";
  if (s.includes("google")) return "Google";
  if (s.includes("facebook") || s === "fb") return "Facebook";
  if (s.includes("tiktok")) return "TikTok";
  if (s.includes("threads")) return "Threads";
  if (s.includes("t.me") || s.includes("telegram")) return "Telegram";
  if (s.includes("linkedin") || s === "lnkd.in") return "LinkedIn";
  if (s === "inoltro") return "Email inoltrata";
  if (s === "email" || s.includes("newsletter") || s.includes("mail")) return "Email";
  if (s === "team") return "Team";
  return s.slice(0, 30);
}
async function siteStats(env, days, force) {
  days = +days === 30 ? 30 : 7;
  if (!env.GC_TOKEN) throw { status: 409, code: "gc_missing", detail: "Manca il secret GC_TOKEN (chiave API di GoatCounter) nel Worker." };
  const ck = "gc_cache:" + days;
  if (!force) { const c = await kvGet(env, ck); if (c && Date.now() - c.at < 15 * 60000) return c.data; }
  const now = Date.now(), end = gcIso(now + 3600000), start = gcIso(now - days * 86400000), pstart = gcIso(now - 2 * days * 86400000);
  const tot = await gcGet(env, "/stats/total", { start, end });
  const prev = await gcGet(env, "/stats/total", { start: pstart, end: start });
  const hits = await gcGet(env, "/stats/hits", { start, end, limit: 100 });
  const refs = await gcGet(env, "/stats/toprefs", { start, end, limit: 50 });
  const sizes = await gcGet(env, "/stats/sizes", { start, end, limit: 20 });
  const locs = await gcGet(env, "/stats/locations", { start, end, limit: 8 });
  const visits = Math.max(0, (+tot.total || 0) - (+tot.total_events || 0));
  const prevVisits = Math.max(0, (+prev.total || 0) - (+prev.total_events || 0));
  // visite al giorno: somma delle pagine (non degli eventi)
  const byDay = {};
  for (const h of hits.hits || []) if (!h.event) for (const s of h.stats || []) byDay[s.day] = (byDay[s.day] || 0) + (+s.daily || 0);
  if (!Object.keys(byDay).length) for (const s of tot.stats || []) byDay[s.day] = +s.daily || 0;
  const events = {};
  for (const h of hits.hits || []) if (h.event) { const k = gcEv(h.path); events[k] = (events[k] || 0) + (+h.count || 0); }
  // post pubblicati (dalle bozze): per segnare i giorni
  const posts = {};
  for (const d of await kvList(env, "draft:", 80)) if (d.status === "pubblicata" && d.type !== "story" && d.date) posts[d.date] = posts[d.date] ? posts[d.date] + "+" : ({ reel: "reel", carousel: "carosello", image: "post" }[d.type] || "post");
  const dayList = [];
  for (let i = days - 1; i >= 0; i--) { const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date(now - i * 86400000)); dayList.push({ day, n: byDay[day] || 0, post: posts[day] || null }); }
  // provenienza
  const rg = {}; let refSum = 0;
  for (const s of refs.stats || []) { const k = gcRefName(s.name); rg[k] = (rg[k] || 0) + (+s.count || 0); refSum += +s.count || 0; }
  if (!rg["Diretto"] && visits > refSum) rg["Diretto"] = visits - refSum;
  const refList = Object.entries(rg).map(([name, n]) => ({ name, n })).sort((a, z) => z.n - a.n);
  const top = refList.slice(0, 40); // v29: tutte (fino a 40); il pannello mostra le prime 7 e il resto in «Altre provenienze», apribile
  const sz = {}; for (const s of sizes.stats || []) { const k = gcSize(s.name); sz[k] = (sz[k] || 0) + (+s.count || 0); }
  // iscrizioni: dal database del sito (più preciso degli eventi)
  let joined = 0, nl = 0;
  try { const q = await env.DB.prepare("SELECT SUM(CASE WHEN created_at >= ?1 THEN 1 ELSE 0 END) AS j, SUM(CASE WHEN newsletter_at >= ?1 THEN 1 ELSE 0 END) AS n FROM users").bind(start).first(); joined = +(q && q.j) || 0; nl = +(q && q.n) || 0; } catch (e) {}
  // v36: persone (eventi una volta per finestra dal browser) e iscritti
  const persone = { nuove: events["persone" + days + "-nuova"] || 0, tornate: events["persone" + days + "-tornata"] || 0 };
  for (const k of Object.keys(events)) if (k.startsWith("persone")) delete events[k];
  let iscritti = null; const settimane = [], fonti = { cur: [], prev: [] };
  try {
    const sP = new Date(now - days * 86400000).toISOString(), s14 = new Date(now - 14 * 86400000).toISOString();
    const q = await env.DB.prepare("SELECT COUNT(*) AS tot, SUM(CASE WHEN last_seen>=?1 THEN 1 ELSE 0 END) AS att, SUM(CASE WHEN last_seen>=?1 AND created_at<?1 THEN 1 ELSE 0 END) AS torn, SUM(CASE WHEN last_seen<?2 THEN 1 ELSE 0 END) AS spar, SUM(CASE WHEN visits<=1 THEN 1 ELSE 0 END) AS f1, SUM(CASE WHEN visits BETWEEN 2 AND 3 THEN 1 ELSE 0 END) AS f2, SUM(CASE WHEN visits>=4 THEN 1 ELSE 0 END) AS f4 FROM users").bind(sP, s14).first();
    if (q) iscritti = { tot: +q.tot || 0, att: +q.att || 0, torn: +q.torn || 0, spar: +q.spar || 0, f1: +q.f1 || 0, f2: +q.f2 || 0, f4: +q.f4 || 0 };
    const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }), D = 86400000;
    const today = fmt.format(new Date(now)), tms = Date.parse(today + "T12:00:00Z"), mon0 = tms - ((new Date(tms).getUTCDay() + 6) % 7) * D;
    const wk = []; for (let i = 5; i >= 0; i--) wk.push({ da: new Date(mon0 - i * 7 * D).toISOString().slice(0, 10), n: 0, src: {} });
    const rows = await env.DB.prepare("SELECT created_at, source FROM users WHERE created_at>=?1").bind(new Date(mon0 - 36 * D).toISOString()).all();
    for (const r of rows.results || []) { const d = fmt.format(new Date(r.created_at)); let w = null; for (const x of wk) if (d >= x.da) w = x; if (!w) continue; w.n++; const s = statSrc(r.source); w.src[s] = (w.src[s] || 0) + 1; }
    let first = wk.findIndex((x) => x.n > 0); if (first < 0) first = wk.length - 3; first = Math.min(first, wk.length - 3);
    for (const x of wk.slice(Math.max(0, first))) settimane.push({ da: x.da, n: x.n });
    const top = (o) => Object.entries(o).map(([name, n]) => ({ name, n })).sort((a, z) => z.n - a.n);
    fonti.cur = top(wk[5].src); fonti.prev = top(wk[4].src);
  } catch (e) {}
  const seen = Object.entries(events).filter(([k]) => k === "gate-vista" || k.startsWith("lock-")).reduce((a, [, n]) => a + n, 0);
  // osservazioni automatiche (regole fisse)
  const ins = [];
  const known = refList.filter((r) => r.name !== "Diretto");
  if (visits && known.length) { const r = known[0]; const p = Math.round((r.n / visits) * 100); if (p >= 5) ins.push(r.name + " porta il " + p + "% delle visite" + (p >= 40 ? ", quasi metà del totale." : ".")); }
  const pd = dayList.filter((d) => d.post), np = dayList.filter((d) => !d.post);
  if (pd.length && np.length) { const a = pd.reduce((s, d) => s + d.n, 0) / pd.length, b = np.reduce((s, d) => s + d.n, 0) / np.length; if (b > 0) { const r = a / b; ins.push(r >= 1.3 ? "Nei giorni con un post le visite sono " + (r >= 1.9 ? "circa il doppio" : "il " + Math.round((r - 1) * 100) + "% in più") + " rispetto agli altri giorni." : r <= 0.8 ? "Nei giorni con un post le visite non salgono: i post portano poca gente al sito." : "Nei giorni con un post le visite cambiano poco rispetto agli altri giorni."); } }
  if (seen >= 5) ins.push("Il " + Math.round((joined / seen) * 100) + "% di chi vede l'invito lascia l'email.");
  if ((events["podcast-play"] || 0) >= 5) ins.push("Il " + Math.round(((events["podcast-finito"] || 0) / events["podcast-play"]) * 100) + "% di chi avvia il podcast sul sito lo ascolta fino in fondo.");
  if (prevVisits >= 10) { const c = Math.round(((visits - prevVisits) / prevVisits) * 100); if (Math.abs(c) >= 15) ins.push("Le visite sono " + (c > 0 ? "salite" : "scese") + " del " + Math.abs(c) + "% rispetto ai " + days + " giorni prima."); }
  const data = { days, start, end, at: new Date().toISOString(), visits, prev_visits: prevVisits, day_list: dayList, refs: top, events, sizes: sz,
    locations: (locs.stats || []).map((s) => ({ id: s.id || "", name: s.name || s.id || "?", n: +s.count || 0 })), joined, nl, seen, persone, iscritti, settimane, fonti, insights: ins.slice(0, 3) };
  await kvSet(env, ck, { at: Date.now(), data });
  return data;
}
// ============ fine statistiche ============


// ============ Proposte e scelte della settimana (v24) ============
// Il pannello mostra per alcuni giorni 3 proposte calcolate dai dati del sito; Francesco può sceglierne una per una data precisa.
// La scelta arriva alla routine nel campo `scelta` di /v1/ig/plan. Nessuna scelta: decide la routine, come sempre.
const SCELTA_KIND = { parola: "parola", numero: "parola", "due-letture": "storia", filone: "filone", "reel-storia": "tema", "oggi-reel": "tema", "sito-reel": "tema", "sito-schermate": "tema" };
const romeDay = (ms) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date(ms));
const itShort = (d) => { const p = String(d || "").split("-"); return p.length === 3 ? +p[2] + " " + ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"][+p[1] - 1] : ""; };
const clipT = (s, n) => { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };
async function docsOf(env, type, where, binds) {
  const r = await env.DB.prepare(`SELECT key, data FROM docs WHERE type=?1 ${where || ""}`).bind(type, ...(binds || [])).all();
  return (r.results || []).map((x) => { try { return { _key: x.key, ...JSON.parse(x.data) }; } catch (e) { return null; } }).filter(Boolean);
}
async function igProposte(env, force) {
  const c = await kvGet(env, "ig_proposte");
  const ver = await siteVer(env).catch(() => ""); // v28: si ricalcola appena cambiano i dati (es. dopo il briefing del mattino), non a tempo
  if (!force && c && c.ver === ver && Date.now() - Date.parse(c.at) < 6 * 3600000) return c;
  const now = Date.now(), from = romeDay(now - 6 * 86400000), last2 = romeDay(now - 86400000), last3 = romeDay(now - 2 * 86400000);
  const st = await docsOf(env, "stories", "AND json_extract(data,'$.data') >= ?2", [from]);
  const th = await docsOf(env, "threads");
  const thBy = {}; th.forEach((t) => (thBy[t._key] = t));
  const cnt = {}, lastD = {};
  st.forEach((s) => { const f = s.filone_id; if (!f) return; cnt[f] = (cnt[f] || 0) + 1; if (!lastD[f] || String(s.data) > lastD[f]) lastD[f] = String(s.data); });
  const thIds = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || String(lastD[b]).localeCompare(String(lastD[a])));
  const tname = (id) => clipT((thBy[id] && (thBy[id].titolo || thBy[id].breve)) || id.replace(/^t-/, "").replace(/-/g, " "), 60);
  // LA PAROLA: stessa regola della ricetta J (v28): termini del glossario in almeno 2 storie della settimana, una degli ultimi 2 giorni;
  // vince chi compare in più FILONI diversi (una vicenda che si ripete pesa una volta), poi più storie, poi la storia più recente
  const EX = new Set(["onu", "ue", "pil", "nato", "g7", "g20", "fmi"]);
  const used = new Set((await kvList(env, "draft:", 200)).filter((d) => /^La parola:/i.test(d.caption || "") && Date.parse(d.created_at || 0) > now - 70 * 86400000).map((d) => String(d.caption).split("\n")[0].replace(/^La parola:\s*/i, "").trim().toLowerCase()));
  const gl = await docsOf(env, "glossario");
  const flat = (x) => (typeof x === "string" ? x : x ? JSON.stringify(x) : "");
  const txt = st.map((s) => ({ s, t: [s.titolo, s.fatti, s.perche_conta, s.sintesi].map(flat).join(" ").toLowerCase() }));
  const wre = (w) => new RegExp("(^|[^\\p{L}\\p{N}])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^\\p{L}\\p{N}])", "u");
  const cand = [];
  for (const g of gl) {
    if (!g.termine || g.tipo === "persona") continue;
    const terms = [g.termine, ...(Array.isArray(g.alias) ? g.alias : [])].filter(Boolean).map((x) => String(x).toLowerCase());
    if (terms.some((x) => EX.has(x) || used.has(x))) continue;
    const res = terms.map(wre), hit = txt.filter((o) => res.some((r) => r.test(o.t)));
    if (hit.length < 2) continue;
    const lastS = hit.map((o) => o.s).sort((a, b) => String(b.data).localeCompare(String(a.data)))[0];
    if (String(lastS.data) < last2) continue;
    const fil = new Set(hit.map((o) => o.s.filone_id || "s:" + (o.s.id || o.s._key)));
    cand.push({ g, n: hit.length, f: fil.size, last: lastS });
  }
  const pri = (t) => (t === "termine" ? 0 : 1);
  cand.sort((a, b) => pri(a.g.tipo) - pri(b.g.tipo) || b.f - a.f || b.n - a.n || String(b.last.data).localeCompare(String(a.last.data)));
  const parola = cand.slice(0, 3).map((c, i) => ({ value: c.g.termine, label: c.g.termine, why: `${c.f === 1 ? "1 filone" : c.f + " filoni"}, ${c.n} storie della settimana, l'ultima il ${itShort(c.last.data)}: ${clipT(c.last.titolo, 70)}`, auto: i === 0 }));
  // DUE LETTURE: storie recenti solide, con due posizioni e sintesi, dei filoni più mossi (una per filone)
  const lvl = (s) => String((s.confidenza && s.confidenza.livello) || s.confidenza || "").toLowerCase();
  const full = (x) => !!x && (typeof x === "string" ? !!x.trim() : !["{}", "[]", "null"].includes(JSON.stringify(x)));
  const ok = st.filter((s) => ["alto", "medio"].includes(lvl(s)) && full(s.sintesi) && full(s.pro) && full(s.contro) && String(s.data) >= last3)
    .sort((a, b) => (cnt[b.filone_id] || 0) - (cnt[a.filone_id] || 0) || String(b.data).localeCompare(String(a.data)));
  const seen = new Set(), storia = [];
  for (const s of ok) { const k = s.filone_id || s._key; if (seen.has(k)) continue; seen.add(k); storia.push({ value: s.id || s._key, label: clipT(s.titolo, 90), why: `Del ${itShort(s.data)}${s.filone_id ? " · " + tname(s.filone_id) + ", " + cnt[s.filone_id] + " storie in settimana" : ""}` }); if (storia.length === 3) break; }
  // IL PUNTO CHE SFUGGE: i filoni più mossi della settimana
  const filone = thIds.slice(0, 3).map((id, i) => ({ value: id, label: tname(id), why: `${cnt[id]} storie in settimana, l'ultima il ${itShort(lastD[id])}`, auto: i === 0 }));
  // TEMA da preferire (martedì e venerdì): i filoni attivi della settimana
  const tema = thIds.filter((id) => !thBy[id] || thBy[id].stato !== "chiuso").slice(0, 8).map((id) => ({ value: id, label: tname(id), why: `${cnt[id]} storie in settimana` }));
  const out = { at: new Date().toISOString(), ver, parola, storia, filone, tema };
  await kvSet(env, "ig_proposte", out);
  return out;
}
async function igScelte(env) {
  const s = (await kvGet(env, "ig_scelte")) || {}, t = romeToday();
  for (const d of Object.keys(s)) if (d < t) delete s[d];
  return s;
}
// ============ fine proposte ============

async function route(request, env) {
  const url = new URL(request.url);
  const p = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method;

  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (p === "/" || p === "/ping")
    return json({ ok: true, service: "rg-api", time: new Date().toISOString() });

  // ---------- PODCAST: feed, audio e ultima puntata (pubblici) ----------
  if ((method === "GET" || method === "HEAD") && (p.startsWith("/podcast") || p.startsWith("/api/podcast"))) {
    const r = await podPublic(request, env, p, url);
    if (r) return r;
  }

  // ---------- LETTURE PUBBLICHE ----------
  if (method === "GET" && p === "/api/sond_scelte") return json({ ok: true, scelte: (await kvGet(env, "sond_scelte")) || {} }, 200, { "cache-control": "no-store" }); // v60: quale domanda Instagram è stata scelta ogni giorno (0 = la principale), la legge l'agente per i verdetti
  if (method === "POST" && p === "/api/join") return await joinUser(request, env);
  if (method === "POST" && p === "/api/seen") return await seenUser(request, env);
  if (method === "POST" && p === "/api/vote") return await voteApi(request, env);
  if (method === "GET" && p === "/api/votes") return await votesApi(url, env);
  if (method === "POST" && (p === "/api/me" || p === "/api/newsletter")) return await nlApi(request, env, p);
  if (method === "POST" && p === "/api/segui") return await seguiApi(request, env);
  if (method === "GET" && p === "/api/newsletter/esempio") {
    const src = await mailBriefing(env, null);
    if (!src) return htmlPage("Esempio", "Nessun esempio disponibile.", 404);
    const c = mailCompose(src, await mailCfg(env));
    const h = c.html.split("@@UNSUB@@").join("#").replace("<head>", '<head><meta name="robots" content="noindex">');
    return new Response(h, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", ...CORS } });
  }

  if (method === "POST" && p === "/api/perf") {
    /* v27: tempi di caricamento anonimi (sito e pannello), per misurare invece di andare a sensazione. Si cancellano dopo 14 giorni. */
    const txt = (await request.text()).slice(0, 3000);
    let b = null; try { b = JSON.parse(txt); } catch (e) {}
    if (!b || typeof b !== "object" || !["sito", "pannello"].includes(b.src)) return new Response(null, { status: 204, headers: CORS });
    const m = {}; for (const [k, v] of Object.entries(b.m || {}).slice(0, 20)) if (typeof v === "number" && isFinite(v)) m[String(k).slice(0, 20)] = Math.round(v);
    const ua = request.headers.get("user-agent") || "";
    const dev = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : "altro";
    await kvSet(env, "perf:" + new Date().toISOString() + ":" + crypto.randomUUID().slice(0, 4), { src: b.src, m, dev, net: String(b.net || "").slice(0, 10), cf: (request.cf && request.cf.colo) || "" });
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method === "GET" && p === "/c/utile") {
    /* v25: pulsante «La usavo» della vecchia edizione condivisa. Un clic per persona al giorno (ip in hash). */
    const ip = request.headers.get("cf-connecting-ip") || "x";
    const h = (await sha256("utile|" + ip)).slice(0, 16);
    const day = romeToday();
    await kvSet(env, "utile:" + day + ":" + h, { at: new Date().toISOString(), ua: (request.headers.get("user-agent") || "").slice(0, 80) });
    return new Response(`<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Grazie</title><body style="margin:0;background:#0b1220;color:#e6ecf7;font:18px/1.55 system-ui,Segoe UI,Helvetica,Arial,sans-serif"><main style="max-width:520px;margin:12vh auto;padding:0 22px"><div style="font-weight:700;letter-spacing:.06em;font-size:15px;color:#f5b04c">READ GEOPOLITICS</div><h1 style="font-size:28px;line-height:1.2;margin:14px 0 12px">Grazie, ricevuto.</h1><p>Francesco ora sa che la versione condivisa ti era utile.</p><p>Nel frattempo trovi lo stesso briefing, ogni mattina e con tutto l'archivio, sul sito:</p><p><a href="https://www.readgeopolitics.com/?utm_source=condivisa" style="display:inline-block;background:#f5b04c;color:#0b1220;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:8px">Apri readgeopolitics.com</a></p></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  if ((method === "GET" || method === "HEAD") && p === "/api/data.json") {
    /* v26: file dei dati già pronto (R2, preparato dal cron) + ETag: chi torna e i dati non sono cambiati scarica 0 byte.
       ?parte=recente → ultimi giorni (prima schermata veloce); senza parametro → tutto (come prima). */
    const pq = url.searchParams.get("parte");
    const parte = pq === "oggi" || pq === "recente" ? pq : "tutto";
    const ver = await siteVer(env);
    const etag = '"' + parte + "-" + ver + '"';
    const hdr = { "content-type": "application/json; charset=utf-8", ...CORS, "access-control-expose-headers": "etag", "timing-allow-origin": "*", etag, "cache-control": "public, max-age=0, must-revalidate", "x-rg-ver": ver };
    const inm = request.headers.get("if-none-match") || "";
    if (inm.split(",").map((s) => s.trim().replace(/^W\//, "")).includes(etag)) return new Response(null, { status: 304, headers: hdr });
    const body = await siteFile(env, parte, ver);
    return new Response(method === "HEAD" ? null : body, { headers: hdr });
  }

  if (method === "GET" && p === "/api/bundle") {
    const since = new Date(Date.now() - 60 * 86400000).toISOString();
    const { results } = await env.DB.prepare(
      "SELECT type, key, data FROM docs WHERE status='published' AND (type!='story' OR published_at>=?1) " +
      "ORDER BY type, published_at DESC LIMIT 2000"
    ).bind(since).all();
    const docs = {};
    for (const r of results) (docs[r.type] ||= []).push(unpack(r));
    return json({ ok: true, generated_at: new Date().toISOString(), docs }, 200, {
      "cache-control": "public, max-age=60",
    });
  }

  if (method === "GET" && p === "/api/docs") {
    const type = url.searchParams.get("type") || "story";
    if (!TYPE_RE.test(type)) return fail(422, "bad_type");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "30", 10) || 30, 200);
    const since = url.searchParams.get("since");
    const country = url.searchParams.get("country");
    let sql = "SELECT key, data FROM docs WHERE type=?1 AND status='published'";
    const args = [type];
    if (since && !isNaN(Date.parse(since))) { args.push(new Date(since).toISOString()); sql += ` AND updated_at>?${args.length}`; }
    if (country && /^[A-Za-z0-9_-]{1,10}$/.test(country)) { args.push(`%"${country}"%`); sql += ` AND countries LIKE ?${args.length}`; }
    args.push(limit);
    sql += ` ORDER BY published_at DESC LIMIT ?${args.length}`;
    const { results } = await env.DB.prepare(sql).bind(...args).all();
    return json({ ok: true, docs: results.map(unpack) }, 200, { "cache-control": "public, max-age=60" });
  }

  let m = p.match(/^\/api\/doc\/([^/]+)\/([^/]+)$/);
  if (method === "GET" && m) {
    const [type, key] = [decodeURIComponent(m[1]), decodeURIComponent(m[2])];
    checkTypeKey(type, key);
    const row = await env.DB.prepare("SELECT key, data FROM docs WHERE type=?1 AND key=?2 AND status='published'")
      .bind(type, key).first();
    if (!row) return fail(404, "not_found");
    return json({ ok: true, doc: unpack(row) });
  }

  // richiesti da Meta nelle impostazioni del login Instagram (rispondono solo "ok")
  if (p === "/ig/deauth") return json({ ok: true });
  if (p === "/ig/delete") return json({ url: url.origin + "/ig/delete", confirmation_code: "none" });
  if (method === "GET" && p === "/ig/mail/preview") {
    const okK = safeEq(url.searchParams.get("k") || "", env.WRITE_TOKEN || "");
    if (!okK && !(await sessionOk(request, env))) return fail(401, "unauthorized");
    return await mailPreview(env);
  }
  if (method === "GET" || method === "HEAD") { const vf = await ttVerifyFile(env, p); if (vf) return vf; }
  if (method === "GET" && p === "/ig/tt/connect") return await ttPublic(request, env, "/tt/connect", url); // sotto /ig: il cookie del pannello vale solo lì
  if (method === "GET" && p === "/ig/th/connect") return await thPublic(request, env, "/th/connect", url); // v30: Threads
  if ((method === "GET" || method === "POST") && p.startsWith("/th/")) { const r = await thPublic(request, env, p, url); if (r) return r; }
  if (method === "GET" && p.startsWith("/tt/")) { const r = await ttPublic(request, env, p, url); if (r) return r; }
  if ((method === "GET" || method === "HEAD" || (method === "POST" && p === "/ig/login")) && p.startsWith("/ig/")) return await igPublic(request, env, p, url);
  { const um = p.match(/^\/u\/([A-Za-z0-9]{1,40})$/); if (um && (method === "GET" || method === "POST")) return await mailUnsub(request, env, um[1]); }
  if (method === "POST" && p === "/ig/api") {
    const b = await request.json().catch(() => null);
    if (!b || !(await panelAuth(request, env, b))) return fail(401, "unauthorized");
    return json(await panelApi(env, url.origin, b));
  }
  if (method === "POST" && p === "/ig/test") {
    const b = await request.json().catch(() => null);
    if (!b || !safeEq(String(b.k || ""), env.WRITE_TOKEN || "")) return fail(401, "unauthorized");
    const imgs = Array.isArray(b.images) ? b.images : [];
    if (!imgs.length || imgs.length > 10) return fail(400, "images_1_to_10");
    const urls = [];
    for (const x of imgs) urls.push(await igStoreImage(env, url.origin, x));
    const out = await igPublishUrls(request, env, url.origin, { type: b.type, image_urls: urls, caption: b.caption || "", dry_run: !!b.dry_run });
    return json({ ...out, image_urls: urls });
  }

  // ---------- SCRITTURE E LETTURE PRIVATE (token) ----------
  if (p.startsWith("/v1/")) {
    if (!authorized(request, env)) return fail(401, "unauthorized");
    if (p.startsWith("/v1/ig/")) return await igPrivate(request, env, p, method);
    if (p.startsWith("/v1/podcast/")) return await podPrivate(request, env, p, method);
    if (p === "/v1/svolte" || p === "/v1/giro") return await svPrivate(request, env, p, method);

    if (method === "GET" && p === "/v1/users") {
      const { results } = await env.DB.prepare(
        "SELECT email, created_at, last_seen, visits, source, campaign, content, referrer, newsletter_at, status FROM users ORDER BY created_at DESC LIMIT 50000"
      ).all();
      if (url.searchParams.get("format") === "csv") {
        const cols = ["email","created_at","last_seen","visits","source","campaign","content","referrer","newsletter_at","status"];
        const body = [cols.join(",")].concat(results.map((r) => cols.map((c) => csvCell(r[c])).join(","))).join("\n");
        return new Response(body, { status: 200, headers: { "content-type": "text/csv; charset=utf-8", ...CORS } });
      }
      return json({ ok: true, total: results.length, users: results });
    }

    if (method === "GET" && p === "/v1/recent") {
      const type = url.searchParams.get("type") || "story";
      if (!TYPE_RE.test(type)) return fail(422, "bad_type");
      const days = Math.min(parseInt(url.searchParams.get("days") || "3", 10) || 3, 30);
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { results } = await env.DB.prepare(
        "SELECT key, title, topic, countries, status, version, published_at, updated_at FROM docs " +
        "WHERE type=?1 AND updated_at>=?2 ORDER BY updated_at DESC LIMIT 200"
      ).bind(type, since).all();
      return json({
        ok: true,
        items: results.map((r) => ({ ...r, countries: r.countries ? JSON.parse(r.countries) : [] })),
      });
    }

    if (method === "POST" && p === "/v1/batch") {
      const text = await request.text();
      if (text.length > MAX_BATCH_BODY) return fail(413, "too_large", "max 1000000 caratteri");
      let b; try { b = JSON.parse(text); } catch { return fail(400, "invalid_json"); }
      const items = b && Array.isArray(b.docs) ? b.docs : null;
      if (!items || !items.length || items.length > MAX_BATCH_ITEMS) return fail(422, "bad_docs", "docs: array di 1-" + MAX_BATCH_ITEMS);
      for (const it of items) {
        if (!it || typeof it.type !== "string" || typeof it.key !== "string" || !it.data || typeof it.data !== "object" || Array.isArray(it.data))
          return fail(422, "bad_item", "ogni elemento: {type,key,data:{...}}");
        checkTypeKey(it.type, it.key);
      }
      const dz = items.filter((it) => it.type === "dossier" && it.data.stato === "pronto");
      let nuovi = [];
      if (dz.length) {
        const ph = dz.map((_, i) => "?" + (i + 1)).join(",");
        const { results } = await env.DB.prepare("SELECT key FROM docs WHERE type='dossier' AND key IN (" + ph + ")").bind(...dz.map((x) => x.key)).all();
        const ex = new Set((results || []).map((r) => r.key));
        nuovi = dz.filter((x) => !ex.has(x.key));
      }
      const out = await putMany(env, items);
      for (const it of items) if (it.type === "threads" && it.data.scenari && it.data.scenari.stato === "chiuso") { try { await pollEsito(env, it.key, it.data.scenari); } catch (e) {} }
      let tg_dossier = null;
      for (const x of nuovi) { try { tg_dossier = await tgDossier(env, x.key, x.data); } catch (e) { tg_dossier = { ok: false, error: String(e && e.message || e) }; } }
      return json({ ok: true, ...out, ...(nuovi.length ? { dossier_nuovi: nuovi.map((x) => x.key), tg_dossier } : {}) });
    }

    m = p.match(/^\/v1\/doc\/([^/]+)\/([^/]+)(\/archive)?$/);
    if (m) {
      const [type, key] = [decodeURIComponent(m[1]), decodeURIComponent(m[2])];
      checkTypeKey(type, key);

      if (method === "PUT" && !m[3]) {
        const obj = await readBody(request);
        return json({ ok: true, ...(await putDoc(env, type, key, obj)) });
      }
      if (method === "PATCH" && !m[3]) {
        const patch = await readBody(request);
        const row = await env.DB.prepare("SELECT data FROM docs WHERE type=?1 AND key=?2").bind(type, key).first();
        if (!row) return fail(404, "not_found", "documento da aggiornare inesistente");
        const merged = { ...JSON.parse(row.data), ...patch };
        return json({ ok: true, ...(await putDoc(env, type, key, merged)) });
      }
      if (method === "POST" && m[3]) {
        const r = await env.DB.prepare("UPDATE docs SET status='archived', updated_at=?3 WHERE type=?1 AND key=?2")
          .bind(type, key, new Date().toISOString()).run();
        if (!r.meta || !r.meta.changes) return fail(404, "not_found");
        return json({ ok: true, status: "archived" });
      }
    }
  }

  return fail(404, "no_route");
}

// ================= NEWSLETTER (email del mattino) =================
// Secret richiesto per l'invio: RESEND_API_KEY. Tutto spento finché non lo accendi dal pannello.
const MAIL_HTML = "<!DOCTYPE html>\n<html lang=\"it\" xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<meta name=\"color-scheme\" content=\"dark\">\n<meta name=\"supported-color-schemes\" content=\"dark light\">\n<title>Read Geopolitics · {{date_long}}</title>\n\n<style>\n  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; background:#0a1020; }\n  a { color:#f5b04c; }\n  @media (max-width:620px) {\n    .container { width:100% !important; }\n    .pad { padding-left:18px !important; padding-right:18px !important; }\n    .h1 { font-size:30px !important; line-height:36px !important; }\n    .num { font-size:20px !important; width:34px !important; }\n    .lab { display:block !important; width:100% !important; padding-bottom:6px !important; }\n    .val { display:block !important; width:100% !important; }\n  }\n</style>\n</head>\n<body style=\"margin:0;padding:0;background-color:#0a1020;\">\n\n<div style=\"display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;\">\n  {{preheader}}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;\n</div>\n\n<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0a1020\" style=\"background-color:#0a1020;\">\n<tr><td align=\"center\" style=\"padding:20px 10px;\">\n<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"container\" style=\"width:600px;max-width:600px;\">\n\n  <!-- TESTATA -->\n  <tr><td class=\"pad\" style=\"padding:8px 4px 16px 4px;border-bottom:1px solid #f5b04c;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n      <td align=\"left\" valign=\"bottom\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:24px;line-height:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;\">READ GEOPOLITICS</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:16px;color:#8fa0bd;letter-spacing:2.5px;text-transform:uppercase;padding-top:2px;\">Il briefing quotidiano</div>\n      </td>\n      <td align=\"right\" valign=\"bottom\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:18px;color:#c3cde0;\">{{date_long}}</td>\n    </tr></table>\n  </td></tr>\n\n  <!-- TITOLO DEL GIORNO -->\n  <tr><td class=\"pad\" style=\"padding:26px 4px 8px 4px;\">\n    <h1 class=\"h1\" style=\"margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:36px;line-height:42px;font-weight:800;color:#ffffff;\">{{headline}}</h1>\n    <p style=\"margin:10px 0 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;line-height:26px;color:#9db3d6;\">{{subheadline}}</p>\n  </td></tr>\n  <tr><td style=\"height:18px;line-height:18px;font-size:1px;\">&nbsp;</td></tr>\n\n  <!-- PODCAST -->\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#14213f\" style=\"background-color:#14213f;border:1px solid #f5b04c;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:16px 20px 14px 20px;\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">&#127911; Il podcast del mattino</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:17px;line-height:23px;font-weight:700;color:#ffffff;padding-top:6px;\">{{podcast.title}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#8fa0bd;padding-top:3px;\">{{podcast.meta}}</div>\n        <div style=\"padding-top:12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;\">\n          <a href=\"{{podcast.listen_url}}\" style=\"display:inline-block;background-color:#f5b04c;color:#0a1020;text-decoration:none;padding:9px 14px;border-radius:6px;margin:0 8px 6px 0;\">Ascolta il podcast &rarr;</a>\n          <span style=\"display:inline-block;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;color:#8fa0bd;padding:9px 0;\">Spotify &middot; Apple &middot; Amazon &middot; Telegram</span>\n        </div>\n      </td></tr>\n    </table>\n  </td></tr>\n\n  <!-- IN 60 SECONDI -->\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0f1830\" style=\"background-color:#0f1830;border:1px solid #1f2c4a;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px 6px 20px;\">\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">In 60 secondi</span>\n      </td></tr>\n      {{#sixty}}\n      <tr><td class=\"pad\" style=\"padding:10px 20px 10px 20px;border-top:1px solid #1f2c4a;\">\n        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n          <td class=\"num\" valign=\"top\" width=\"44\" style=\"width:44px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:24px;line-height:28px;font-weight:700;color:#4f7dba;\">{{n}}</td>\n          <td valign=\"top\" style=\"border-left:1px solid #2a3a5e;padding-left:14px;\">\n            <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:22px;font-weight:700;color:#ffffff;\">{{title}}</div>\n            <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#a8b6d0;padding-top:2px;\">{{text}}</div>\n          </td>\n        </tr></table>\n      </td></tr>\n      {{/sixty}}\n      <tr><td style=\"height:8px;line-height:8px;font-size:1px;\">&nbsp;</td></tr>\n    </table>\n  </td></tr>\n\n  <!-- IL FATTO CENTRALE -->\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0f1830\" style=\"background-color:#0f1830;border:1px solid #c98a2e;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px 0 20px;\">\n        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n          <td style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">Il fatto centrale &middot; {{lead.tag}}</td>\n          <td align=\"right\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#8fa0bd;\">{{lead.confidence}}</td>\n        </tr></table>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;line-height:32px;font-weight:800;color:#ffffff;padding-top:8px;\">{{lead.title}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:23px;color:#c3cde0;padding-top:8px;\">{{lead.summary}}</div>\n      </td></tr>\n      <tr><td class=\"pad\" style=\"padding:14px 20px 0 20px;\">\n        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n          <tr><td style=\"border-top:1px solid #1f2c4a;padding:12px 0;\">\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n              <td class=\"lab\" valign=\"top\" width=\"120\" style=\"width:120px;\"><span style=\"display:inline-block;background-color:#16355f;color:#6fb0ff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 9px;border-radius:4px;\">Fatti</span></td>\n              <td class=\"val\" valign=\"top\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#c3cde0;\">{{lead.facts}}</td>\n            </tr></table>\n          </td></tr>\n          <tr><td style=\"border-top:1px solid #1f2c4a;padding:12px 0;\">\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n              <td class=\"lab\" valign=\"top\" width=\"120\" style=\"width:120px;\"><span style=\"display:inline-block;background-color:#3d2d12;color:#f5b04c;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 9px;border-radius:4px;\">Perch&eacute; conta</span></td>\n              <td class=\"val\" valign=\"top\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#c3cde0;\">{{lead.why}}</td>\n            </tr></table>\n          </td></tr>\n          {{#lead.has_readings}}<tr><td style=\"border-top:1px solid #1f2c4a;padding:12px 0;\">\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n              <td class=\"lab\" valign=\"top\" width=\"120\" style=\"width:120px;\"><span style=\"display:inline-block;background-color:#2a1f4a;color:#b9a2ff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 9px;border-radius:4px;\">Due letture</span></td>\n              <td class=\"val\" valign=\"top\"><div style=\"border-left:3px solid #86b4ea;padding:2px 0 2px 12px;margin-top:0;\"><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#86b4ea;\">{{lead.pro.label}}</div><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#dfe6f2;padding-top:3px;\">{{lead.pro.text}}</div>{{#lead.pro.src}}<div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:17px;color:#8fa0bd;padding-top:4px;\">{{lead.pro.src}}</div>{{/lead.pro.src}}</div><div style=\"border-left:3px solid #f5b04c;padding:2px 0 2px 12px;margin-top:12px;\"><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#f5b04c;\">{{lead.contro.label}}</div><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#dfe6f2;padding-top:3px;\">{{lead.contro.text}}</div>{{#lead.contro.src}}<div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:17px;color:#8fa0bd;padding-top:4px;\">{{lead.contro.src}}</div>{{/lead.contro.src}}</div></td>\n            </tr></table>\n          </td></tr>{{/lead.has_readings}}\n          <tr><td style=\"border-top:1px solid #1f2c4a;padding:12px 0;\">\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n              <td class=\"lab\" valign=\"top\" width=\"120\" style=\"width:120px;\"><span style=\"display:inline-block;background-color:#123b33;color:#5fd6b4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 9px;border-radius:4px;\">Cosa decide</span></td>\n              <td class=\"val\" valign=\"top\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#c3cde0;\">{{lead.decider}}</td>\n            </tr></table>\n          </td></tr>\n        </table>\n      </td></tr>\n      {{#vote}}<tr><td class=\"pad\" style=\"padding:4px 20px 14px 20px;\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-top:1px solid #1f2c4a;\"><tr><td style=\"padding:16px 0 0 0;\"><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#f5b04c;text-transform:uppercase;\">Tu cosa ne pensi?</div><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;margin:6px 0 12px 0;\">{{vote.q}}</div><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td width=\"50%\" style=\"padding:0 4px;\"><a href=\"{{vote.url_a}}\" style=\"display:block;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;line-height:20px;color:#ffffff;background-color:#14213f;border:2px solid #86b4ea;border-radius:8px;padding:12px 8px;text-align:center;text-decoration:none;\">{{vote.a}}</a></td><td width=\"50%\" style=\"padding:0 4px;\"><a href=\"{{vote.url_b}}\" style=\"display:block;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;line-height:20px;color:#ffffff;background-color:#3a2c10;border:2px solid #f5b04c;border-radius:8px;padding:12px 8px;text-align:center;text-decoration:none;\">{{vote.b}}</a></td></tr></table><div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12.5px;line-height:18px;color:#8fa0bd;margin-top:10px;\">Un clic: si apre il sito e il voto è registrato, in forma anonima. <a href=\"{{vote.url_n}}\" style=\"color:#c3cde0;\">Non so</a> · Domani il risultato, se votano almeno in 20.</div></td></tr></table></td></tr>{{/vote}}\n      <tr><td class=\"pad\" style=\"padding:2px 20px 18px 20px;\">\n        <a href=\"{{lead.url}}\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:underline;text-decoration-color:#f5b04c;\">Leggi la storia e le fonti &rarr;</a>\n      </td></tr>\n    </table>\n  </td></tr>\n\n  <!-- IL RESTO DELLA MATTINA -->\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0f1830\" style=\"background-color:#0f1830;border:1px solid #1f2c4a;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px 6px 20px;\">\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">Il resto della mattina</span>\n      </td></tr>\n      {{#stories}}\n      <tr><td class=\"pad\" style=\"padding:12px 20px;border-top:1px solid #1f2c4a;\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#6fb0ff;text-transform:uppercase;\">{{tag}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:17px;line-height:23px;font-weight:700;color:#ffffff;padding-top:2px;\">{{title}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#a8b6d0;padding-top:3px;\">{{summary}} <a href=\"{{url}}\" style=\"color:#f5b04c;font-weight:600;text-decoration:none;\">Apri &rarr;</a></div>\n      </td></tr>\n      {{/stories}}\n      <tr><td style=\"height:6px;line-height:6px;font-size:1px;\">&nbsp;</td></tr>\n    </table>\n  </td></tr>\n\n  <!-- IL NUMERO DEL GIORNO (opzionale) -->\n  {{#number}}\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#14213f\" style=\"background-color:#14213f;border:1px solid #1f2c4a;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px;\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">Il numero del giorno</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:42px;line-height:48px;font-weight:800;color:#ffffff;padding-top:6px;\">{{value}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#a8b6d0;padding-top:2px;\">{{caption}}</div>\n      </td></tr>\n    </table>\n  </td></tr>\n  {{/number}}\n\n  <!-- COSA È CAMBIATO -->\n  <tr><td style=\"padding:0 0 14px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0f1830\" style=\"background-color:#0f1830;border:1px solid #1f2c4a;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px 6px 20px;\">\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">Cosa &egrave; cambiato</span>\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#8fa0bd;\">&nbsp;&nbsp;rispetto a ieri</span>\n      </td></tr>\n      {{#changed}}\n      <tr><td class=\"pad\" style=\"padding:10px 20px;border-top:1px solid #1f2c4a;\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:21px;font-weight:700;color:#ffffff;\">{{title}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#a8b6d0;padding-top:2px;\">{{text}}</div>\n      </td></tr>\n      {{/changed}}\n      <tr><td style=\"height:6px;line-height:6px;font-size:1px;\">&nbsp;</td></tr>\n    </table>\n  </td></tr>\n\n  <!-- COSA OSSERVARE -->\n  <tr><td style=\"padding:0 0 18px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#0f1830\" style=\"background-color:#0f1830;border:1px solid #1f2c4a;border-radius:8px;\">\n      <tr><td class=\"pad\" style=\"padding:18px 20px 6px 20px;\">\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;color:#f5b04c;text-transform:uppercase;\">Cosa osservare</span>\n        <span style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#8fa0bd;\">&nbsp;&nbsp;nei prossimi giorni</span>\n      </td></tr>\n      {{#watch}}\n      <tr><td class=\"pad\" style=\"padding:10px 20px;border-top:1px solid #1f2c4a;\">\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:21px;font-weight:700;color:#ffffff;\">{{title}}</div>\n        <div style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#a8b6d0;padding-top:2px;\">{{text}}</div>\n      </td></tr>\n      {{/watch}}\n      <tr><td style=\"height:6px;line-height:6px;font-size:1px;\">&nbsp;</td></tr>\n    </table>\n  </td></tr>\n\n  <!-- CTA -->\n  <tr><td align=\"center\" style=\"padding:0 0 10px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n      <td align=\"center\" bgcolor=\"#f5b04c\" style=\"background-color:#f5b04c;border-radius:6px;\">\n        <a href=\"{{cta_url}}\" style=\"display:block;padding:15px 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#0a1020;text-decoration:none;\">Apri il briefing completo &rarr;</a>\n      </td>\n    </tr></table>\n  </td></tr>\n  <tr><td align=\"center\" style=\"padding:6px 0 20px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:20px;color:#8fa0bd;\">\n    <a href=\"{{link_sources}}\" style=\"color:#8fa0bd;text-decoration:none;\">Fonti</a> &middot;\n    <a href=\"{{link_timeline}}\" style=\"color:#8fa0bd;text-decoration:none;\">Timeline</a> &middot;\n    <a href=\"{{link_maps}}\" style=\"color:#8fa0bd;text-decoration:none;\">Mappe</a> &middot;\n    <a href=\"{{link_outlook}}\" style=\"color:#8fa0bd;text-decoration:none;\">Prospettive</a>\n  </td></tr>\n\n  <!-- INOLTRA -->\n  <tr><td style=\"padding:0 0 18px 0;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" bgcolor=\"#14213f\" style=\"background-color:#14213f;border:1px dashed #3a4c6e;border-radius:8px;\">\n      <tr><td class=\"pad\" align=\"center\" style=\"padding:14px 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:21px;color:#c3cde0;\">\n        <strong style=\"color:#ffffff;\">Conosci qualcuno a cui servirebbe?</strong> Inoltragli questa email: si iscrive gratis da <a href=\"{{forward_url}}\" style=\"color:#f5b04c;font-weight:600;\">qui</a>.<br>\n        <span style=\"font-size:12.5px;color:#8fa0bd;\">Te l&#39;hanno inoltrata? <a href=\"{{forward_url}}\" style=\"color:#c3cde0;\">Iscriviti per riceverla ogni mattina</a>.</span>\n      </td></tr>\n    </table>\n  </td></tr>\n\n  <!-- FOOTER -->\n  <tr><td style=\"border-top:1px solid #1f2c4a;padding:16px 4px 24px 4px;\">\n    <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>\n      <td valign=\"top\" style=\"font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:19px;color:#8fa0bd;\">\n        <strong style=\"color:#ffffff;\">Read Geopolitics</strong> &middot; il mondo in 15 minuti<br>\n        Ricevi questa email perch&eacute; hai dato il consenso alla newsletter su readgeopolitics.com.<br>\n        <a href=\"mailto:hello@readgeopolitics.com\" style=\"color:#8fa0bd;\">hello@readgeopolitics.com</a>\n        <br>Seguici: <a href=\"https://www.instagram.com/read.geopolitics\" style=\"color:#c3cde0;\">Instagram</a> &middot; <a href=\"https://www.threads.com/@read.geopolitics\" style=\"color:#c3cde0;\">Threads</a> &middot; <a href=\"https://t.me/readgeopolitics\" style=\"color:#c3cde0;\">Telegram</a> &middot; <a href=\"https://www.tiktok.com/@readgeopolitics\" style=\"color:#c3cde0;\">TikTok</a>\n      </td>\n    </tr>\n    <tr>\n      <td style=\"padding-top:12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:19px;\">\n        <a href=\"{{privacy_url}}\" style=\"color:#8fa0bd;text-decoration:underline;\">Informativa privacy</a>\n        &nbsp;&nbsp;|&nbsp;&nbsp;\n        <a href=\"{{unsubscribe_url}}\" style=\"color:#c3cde0;text-decoration:underline;\">Disiscriviti</a>\n      </td>\n    </tr></table>\n  </td></tr>\n\n</table>\n</td></tr>\n</table>\n</body>\n</html>";
const MAIL_TXT = "READ GEOPOLITICS · Il briefing quotidiano · {{date_long}}\n\n{{headline}}\n{{subheadline}}\n\nIL PODCAST DEL MATTINO\n{{podcast.title}} ({{podcast.meta}})\nAscolta (Spotify, Apple, Amazon, Telegram): {{podcast.listen_url}}\n\nIN 60 SECONDI\n{{#sixty}}\n{{n}}. {{title}} — {{text}}\n{{/sixty}}\n\nIL FATTO CENTRALE · {{lead.tag}} ({{lead.confidence}})\n{{lead.title}}\n{{lead.summary}}\n\nFatti: {{lead.facts}}\nPerché conta: {{lead.why}}\n{{#lead.has_readings}}Due letture:\n- {{lead.pro.label}}: {{lead.pro.text}}{{#lead.pro.src}} ({{lead.pro.src}}){{/lead.pro.src}}\n- {{lead.contro.label}}: {{lead.contro.text}}{{#lead.contro.src}} ({{lead.contro.src}}){{/lead.contro.src}}\n{{/lead.has_readings}}Cosa decide: {{lead.decider}}\n{{#vote}}Tu cosa ne pensi? {{vote.q}}\n- {{vote.a}}: {{vote.url_a}}\n- {{vote.b}}: {{vote.url_b}}\n{{/vote}}Leggi la storia e le fonti: {{lead.url}}\n\nIL RESTO DELLA MATTINA\n{{#stories}}\n- [{{tag}}] {{title}} — {{summary}} {{url}}\n{{/stories}}\n{{#number}}\n\nIL NUMERO DEL GIORNO\n{{value}} — {{caption}}\n{{/number}}\n\nCOSA È CAMBIATO RISPETTO A IERI\n{{#changed}}\n- {{title}}: {{text}}\n{{/changed}}\n\nCOSA OSSERVARE NEI PROSSIMI GIORNI\n{{#watch}}\n- {{title}}: {{text}}\n{{/watch}}\n\n----------------------------------------\nApri il briefing completo: {{cta_url}}\n\nConosci qualcuno a cui servirebbe? Inoltragli questa email. Iscrizione gratuita: {{forward_url}}\n\nRead Geopolitics · il mondo in 15 minuti\nRicevi questa email perché hai dato il consenso alla newsletter su readgeopolitics.com.\nhello@readgeopolitics.com\nSeguici: Instagram instagram.com/read.geopolitics · Threads threads.com/@read.geopolitics · Telegram t.me/readgeopolitics\nInformativa privacy: {{privacy_url}}\nDisiscriviti: {{unsubscribe_url}}";
const POD_SPOTIFY = "https://open.spotify.com/show/5cozVJfZphY5ivF1GdUCcU";
const MAIL_SITE = "https://www.readgeopolitics.com";
const MAIL_API = "https://rg-api.briefinghub.workers.dev";
const MAIL_DEFAULT = { copy: true, enabled: false, mode: "test", test_email: "", hour: 8, batch: 50, daily_cap: 90, privacy_url: "", consent_text: "", from: "Read Geopolitics <hello@readgeopolitics.com>", reply_to: "hello@readgeopolitics.com" };
let MAIL_SCHEMA_OK = false;
const MAIL_POD_WAIT = 30; // minuti di attesa massima della puntata del giorno

async function mailSchema(env) {
  if (MAIL_SCHEMA_OK) return;
  // una sola lettura per capire cosa manca (prima erano 5 scritture a ogni avvio a freddo)
  const info = ((await env.DB.prepare("PRAGMA table_info(users)").all()).results || []).map((c) => c.name);
  for (const col of ["unsub_token", "unsub_at", "consent_text", "segui", "segui_at"]) {
    if (!info.includes(col)) { try { await env.DB.prepare("ALTER TABLE users ADD COLUMN " + col + " TEXT").run(); } catch (e) { /* già presente */ } }
  }
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS mail_log (date TEXT NOT NULL, user_id TEXT NOT NULL, ts TEXT NOT NULL, ok INTEGER NOT NULL, err TEXT, PRIMARY KEY (date, user_id))").run();
  const miss = await env.DB.prepare("SELECT 1 AS x FROM users WHERE unsub_token IS NULL LIMIT 1").first();
  if (miss) await env.DB.prepare("UPDATE users SET unsub_token=lower(hex(randomblob(16))) WHERE unsub_token IS NULL").run();
  MAIL_SCHEMA_OK = true;
}
async function mailCfg(env) { return { ...MAIL_DEFAULT, ...((await kvGet(env, "mail_cfg")) || {}) }; }

// ---- mini Mustache: {{x}} {{a.b}} {{#lista}}…{{/lista}} ----
function mLook(stack, name) {
  const parts = name.split(".");
  for (let i = stack.length - 1; i >= 0; i--) {
    let v = stack[i];
    if (v == null || typeof v !== "object" || !(parts[0] in v)) continue;
    for (const p of parts) v = v == null ? undefined : v[p];
    return v;
  }
  return undefined;
}
function mRender(t, stack, raw) {
  return t
    .replace(/\{\{#([\w.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, n, inner) => {
      const v = mLook(stack, n);
      if (Array.isArray(v)) return v.map((x) => mRender(inner, stack.concat([x && typeof x === "object" ? x : { ".": x }]), raw)).join("");
      if (v && typeof v === "object") return mRender(inner, stack.concat([v]), raw);
      return v ? mRender(inner, stack, raw) : "";
    })
    .replace(/\{\{([\w.]+)\}\}/g, (_, n) => {
      const v = mLook(stack, n);
      if (v == null) return "";
      const s = String(v).replace(/\{\{/g, "{ {");
      return raw ? s : esc(s);
    });
}

// ---- testi: niente citazioni [1], frasi intere, mai troncature a metà parola ----
const mCit = (s) => String(s || "").replace(/(\s*\[\d+(?:\s*[,–-]\s*\d+)*\])+/g, "").replace(/\s+/g, " ").trim();
const mSent = (s) => mCit(s).split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝÈÉ0-9«"“])/).filter(Boolean);
function mClip(s, max) {
  s = mCit(s);
  if (s.length <= max) return s;
  const out = []; let len = 0;
  for (const x of mSent(s)) { if (len + x.length + (len ? 1 : 0) > max) break; out.push(x); len += x.length + (len ? 1 : 0); }
  if (out.length) return out.join(" ");
  const cut = s.slice(0, max);
  const k = Math.max(cut.lastIndexOf(","), cut.lastIndexOf(";"), cut.lastIndexOf(":"));
  if (k >= 25) return cut.slice(0, k);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}
const mEnd = (s) => (/[.!?…»"”]$/.test(s) ? s : s + ".");
const mUp = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
function mDateLong(iso) {
  return new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00Z"));
}

async function mailBriefing(env, date) {
  const row = date
    ? await env.DB.prepare("SELECT key, data FROM docs WHERE type='briefings' AND key=?1 AND status='published'").bind(date).first()
    : await env.DB.prepare("SELECT key, data FROM docs WHERE type='briefings' AND key<=?1 AND status='published' ORDER BY key DESC LIMIT 1").bind(romeToday()).first();
  if (!row) return null;
  const b = JSON.parse(row.data);
  const ids = [...(b.storie_mondo || []).slice(0, 3), ...(b.storie_italia || []).slice(0, 1)];
  const stories = {};
  if (ids.length) {
    const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='stories' AND key IN (" + ids.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...ids).all();
    for (const r of results) stories[r.key] = JSON.parse(r.data);
  }
  const tids = new Set();
  for (const x of b.cambiato || []) if (x.filone_id) tids.add(x.filone_id);
  for (const x of b.in_osservazione || []) if (x.filone_id) tids.add(x.filone_id);
  const threads = {};
  if (tids.size) {
    const a = [...tids];
    const { results } = await env.DB.prepare("SELECT key, data FROM docs WHERE type='threads' AND key IN (" + a.map((_, i) => "?" + (i + 1)).join(",") + ")").bind(...a).all();
    for (const r of results) threads[r.key] = JSON.parse(r.data).titolo;
  }
  let pod = null;
  try { pod = await env.DB.prepare("SELECT date, title, duration FROM podcast WHERE date=?1").bind(row.key).first(); } catch (e) { /* tabella non ancora creata */ }
  return { date: row.key, b, stories, threads, pod };
}

// Compone il messaggio dai soli campi già verificati del briefing. Nessuna ricerca nuova.
function mailCompose(src, cfg) {
  const { date, b, stories, threads } = src;
  const utm = `utm_source=email&utm_medium=newsletter&utm_campaign=${date}`;
  const url = (h) => `${MAIL_SITE}/?${utm}${h ? "#" + h : ""}`;
  const in60 = (b.in60 || []).map(mCit).filter(Boolean);
  const first = in60[0] || "Il briefing di oggi";
  const headline = mUp(mClip(first, 88));
  const tail = first.length > headline.length ? first.slice(headline.length).replace(/^[\s,;:–-]+/, "") : "";
  const sub = mUp(mClip(tail || in60[1] || "", 130));
  const rest = in60.slice(1, 5); // v38: tutte le righe dopo il titolo, Italia compresa
  const sixty = rest.map((t, i) => {
    const c = t.indexOf(": ");
    if (c > 0 && c <= 38) return { n: i + 1, title: t.slice(0, c), text: mUp(mClip(t.slice(c + 2), 200)) };
    return { n: i + 1, title: mClip(t, 150), text: "" };
  });
  const lid = (b.storie_mondo || [])[0];
  const L = stories[lid] || {};
  const ss = mSent(L.fatti || "");
  const dec = (mCit(L.sintesi).match(/Decisiv[oa]:\s*(.+)$/) || [])[1] || mSent(L.sintesi || "").find((x) => /^Decider[àa]\s/.test(x));
  const CONF = { alto: "alta", medio: "media", basso: "bassa" };
  const lv = L.confidenza && L.confidenza.livello ? String(L.confidenza.livello).toLowerCase() : "";
  const conf = lv ? "Confidenza " + (CONF[lv] || lv) : "";
  const fonti = L.fonti || [];
  const reading = (x, fallback) => { // v38: due letture in due riquadri, con chi e la fonte
    if (!x || !x.tesi) return null;
    const who = String(x.attori || "").split(";")[0].split(",")[0].trim();
    const refs = [...new Set((String(x.tesi).match(/\[(\d+)\]/g) || []).map((m) => +m.slice(1, -1)))].map((n) => fonti[n - 1]).filter(Boolean);
    const uff = refs.some((f) => f.ufficiale) || /cremlino|governo|ministero|portavoce|palazzo chigi|casa bianca/i.test(x.attori || "");
    const names = [...new Set(refs.map((f) => f.nome))].join(", ");
    return { label: fallback + (who ? " · " + who : ""), text: mEnd(mClip(mSent(x.tesi)[0] || x.tesi, 230)), src: [uff ? "Posizione ufficiale" : "", names ? "fonte: " + names : ""].filter(Boolean).join(" · ") };
  };
  const pro = reading(L.pro, "Chi sostiene"), contro = reading(L.contro, "Chi si oppone");
  const lead = {
    tag: L.tema || "", title: L.titolo || "", summary: ss[0] ? mClip(ss[0], 200) : "",
    facts: mClip(ss.slice(1).join(" ") || L.fatti || "", 300), why: mClip(L.perche_conta || "", 230),
    pro: pro || {}, contro: contro || {}, has_readings: !!(pro && contro),
    decider: mClip(dec || (L.segnali || [])[0] || "", 200),
    confidence: conf, url: url("briefing"),
  };
  const more = [...(b.storie_mondo || []).slice(1, 3), ...(b.storie_italia || []).slice(0, 1)].map((id) => stories[id]).filter(Boolean)
    .map((s) => ({ tag: s.tema || "", title: s.titolo, summary: mClip(mSent(s.fatti)[0] || "", 160), url: url("briefing") }));
  const changed = (b.cambiato || []).slice(0, 3).map((x) => ({ title: mClip(threads[x.filone_id] || "Aggiornamento", 70), text: mClip(x.testo, 170) }));
  const watch = [...(L.segnali || []).slice(0, 2).map((t) => ({ title: mClip(t, 140), text: "" })),
    ...(b.in_osservazione || []).slice(0, 1).map((x) => ({ title: mClip(threads[x.filone_id] || "In osservazione", 70), text: mClip(x.diventa, 150) }))].slice(0, 3);
  // Il numero del giorno: solo se calcolato da noi o da una fonte non vincolata da licenza (mai Trading Economics).
  let number = null;
  const v = ((b.cruscotto && b.cruscotto.voci) || []).find((x) => x.id === "spread" && x.valore != null && x.fonte && x.fonte.url && !/tradingeconomics/i.test(x.fonte.url));
  if (v) number = { value: String(v.valore).replace(".", ",") + (v.unita ? " " + v.unita : ""), caption: `${v.nome || "Spread BTP-Bund"} · dato del ${v.data}. Fonte: ${v.fonte.nome}.` };
  // Podcast: la puntata del giorno se è già pronta, altrimenti un invito generico (nessun link a un file che non esiste ancora)
  const P = src.pod;
  const podcast = {
    title: P ? mClip(String(P.title || "").replace(/^[^·]*·\s*/, ""), 110) : "Le storie di questa mattina, raccontate in un quarto d'ora.",
    meta: P && P.duration ? Math.max(1, Math.round(P.duration / 60)) + " min · la voce è sintetica" : "Ogni mattina · la voce è sintetica",
    site_url: `${MAIL_SITE}/?${utm.replace("utm_medium=newsletter", "utm_medium=newsletter_podcast")}#briefing`,
    listen_url: `${MAIL_SITE}/ascolta.html?utm_source=email&utm_medium=newsletter_podcast&utm_campaign=${date}`,
    spotify_url: POD_SPOTIFY,
  };
  const so = (b.sondaggio && b.sondaggio.storia_id === lid) ? b.sondaggio : {};
  const vu = (ch) => `${MAIL_SITE}/?utm_source=email&utm_medium=newsletter_voto&utm_campaign=${date}&poll=t:${lid}&voto=${ch}#briefing`;
  const vote = lid && pro && contro && /^s-\d{8}-\d{2}$/.test(lid) ? { q: so.domanda || "Quale tesi ti convince di più?", a: so.a || "Chi sostiene", b: so.b || "Chi si oppone", url_a: vu("a"), url_b: vu("b"), url_n: vu("n") } : null;
  const ctx = {
    vote,
    podcast,
    date_long: mDateLong(date), preheader: sub || headline, headline, subheadline: sub, sixty, lead, stories: more,
    number, changed, watch, cta_url: url("briefing"), link_sources: url("briefing"), link_timeline: url("timeline"),
    link_maps: url("mappa"), link_outlook: url("radar"), privacy_url: cfg.privacy_url || MAIL_SITE, unsubscribe_url: "@@UNSUB@@",
    forward_url: `${MAIL_SITE}/iscriviti.html?utm_source=inoltro&utm_campaign=${date}`,
  };
  return { date, ctx, subject: "Read Geopolitics · " + headline, html: mRender(MAIL_HTML, [ctx], false), text: mRender(MAIL_TXT, [ctx], true) };
}

// ---- invio: funzione isolata, sostituibile (oggi Resend via API HTTP) ----
async function mailSend(env, msgs, idem) {
  if (!env.RESEND_API_KEY) return { ok: false, error: "manca il segreto RESEND_API_KEY" };
  const r = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json", "idempotency-key": idem },
    body: JSON.stringify(msgs),
  });
  const t = await r.text();
  if (!r.ok) return { ok: false, error: r.status + " " + t.slice(0, 240) };
  return { ok: true };
}
function mailMsg(c, cfg, to, token) {
  const u = `${MAIL_API}/u/${token}`;
  return {
    from: cfg.from, to: [to], reply_to: cfg.reply_to, subject: c.subject,
    html: c.html.split("@@UNSUB@@").join(esc(u)), text: c.text.split("@@UNSUB@@").join(u),
    headers: { "List-Unsubscribe": `<${u}>, <mailto:${cfg.reply_to}?subject=disiscrizione>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

async function mailStats(env) {
  await mailSchema(env);
  const a = await env.DB.prepare("SELECT SUM(CASE WHEN newsletter_at IS NOT NULL AND unsub_at IS NULL THEN 1 ELSE 0 END) AS attivi, SUM(CASE WHEN unsub_at IS NOT NULL THEN 1 ELSE 0 END) AS disiscritti FROM users").first();
  const s = await env.DB.prepare("SELECT COUNT(*) AS n FROM mail_log WHERE date=?1 AND ok=1 AND user_id NOT IN ('test','copy')").bind(romeToday()).first();
  return { attivi: (a && a.attivi) || 0, disiscritti: (a && a.disiscritti) || 0, inviate_oggi: (s && s.n) || 0 };
}

// Chiamata a ogni esecuzione del Cron Trigger. Non fa nulla se spento, se è presto o se il briefing di oggi non c'è.
async function mailTick(env) {
  const cfg = await mailCfg(env);
  if (!cfg.enabled) return;
  const hour = parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", hourCycle: "h23" }).format(new Date()), 10);
  if (hour < cfg.hour) return;
  await mailSchema(env);
  await env.DB.prepare("UPDATE users SET unsub_token=lower(hex(randomblob(16))) WHERE unsub_token IS NULL").run();
  const today = romeToday();
  const src = await mailBriefing(env, today);
  if (!src) return; // il briefing di oggi non è ancora pubblicato
  const live = cfg.mode === "live";
  if (live && !cfg.privacy_url) { await kvSet(env, "mail_last", { ts: new Date().toISOString(), ok: false, msg: "invio reale bloccato: manca l'indirizzo dell'informativa privacy" }); return; }
  const done = await env.DB.prepare("SELECT COUNT(*) AS n FROM mail_log WHERE date=?1 AND ok=1 AND user_id NOT IN ('test','copy')").bind(today).first();
  // Se la puntata di oggi non è ancora pronta, il primo invio aspetta fino a MAIL_POD_WAIT minuti dopo l'ora impostata; poi parte comunque
  if (!src.pod && !((done && done.n) || 0)) {
    const hm = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date()).split(":").map(Number);
    if (hm[0] * 60 + hm[1] < cfg.hour * 60 + MAIL_POD_WAIT) return;
  }
  let rcpt;
  if (live) {
    const room = Math.max(0, cfg.daily_cap - ((done && done.n) || 0));
    const lim = Math.min(cfg.batch, room, 100);
    if (lim <= 0) return;
    rcpt = (await env.DB.prepare("SELECT id, email, unsub_token FROM users WHERE newsletter_at IS NOT NULL AND unsub_at IS NULL AND unsub_token IS NOT NULL AND id NOT IN (SELECT user_id FROM mail_log WHERE date=?1 AND ok=1) ORDER BY newsletter_at LIMIT ?2").bind(today, lim).all()).results;
  } else {
    const t = String(cfg.test_email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(t)) return;
    const was = await env.DB.prepare("SELECT 1 AS x FROM mail_log WHERE date=?1 AND user_id='test' AND ok=1").bind(today).first();
    if (was) return;
    rcpt = [{ id: "test", email: t, unsub_token: "prova" }];
  }
  if (live) { // copia per te: l'indirizzo di prova riceve anche l'invio reale, una volta al giorno, se non è già tra gli iscritti
    const t = String(cfg.test_email || "").trim().toLowerCase();
    if (cfg.copy && EMAIL_RE.test(t) && !rcpt.some((r) => r.email === t)) {
      const had = await env.DB.prepare("SELECT 1 AS x FROM mail_log WHERE date=?1 AND user_id='copy' AND ok=1").bind(today).first();
      const sub = await env.DB.prepare("SELECT 1 AS x FROM users WHERE email=?1 AND newsletter_at IS NOT NULL AND unsub_at IS NULL").bind(t).first();
      if (!had && !sub) rcpt.push({ id: "copy", email: t, unsub_token: "prova" });
    }
  }
  if (!rcpt.length) return;
  const c = mailCompose(src, cfg);
  const res = await mailSend(env, rcpt.map((r) => mailMsg(r.id === "copy" ? { ...c, subject: "[COPIA " + today.slice(8) + "/" + today.slice(5, 7) + "] " + c.subject } : c, cfg, r.email, r.unsub_token)), `rg-${today}-${rcpt[0].id}-${rcpt.length}`);
  const ts = new Date().toISOString();
  await env.DB.batch(rcpt.map((r) => env.DB.prepare("INSERT OR REPLACE INTO mail_log (date,user_id,ts,ok,err) VALUES (?1,?2,?3,?4,?5)").bind(today, r.id, ts, res.ok ? 1 : 0, res.ok ? null : String(res.error).slice(0, 240))));
  await kvSet(env, "mail_last", { ts, ok: res.ok, n: rcpt.length, msg: res.ok ? `inviate ${rcpt.filter((r) => r.id !== "copy").length}${rcpt.some((r) => r.id === "copy") ? " + 1 copia a te" : ""} (${live ? "reale" : "prova"})` : res.error });
}

// Consenso alla newsletter di una persona già nota (id casuale salvato nel suo browser). Vale anche come riadesione dopo una disiscrizione.
async function nlConsent(env, id, now, text) {
  await mailSchema(env);
  const cur = await env.DB.prepare("SELECT newsletter_at, unsub_at FROM users WHERE id=?1").bind(id).first();
  if (!cur) return false;
  if (cur.newsletter_at && !cur.unsub_at) return true;
  await env.DB.prepare("UPDATE users SET newsletter_at=?2, unsub_at=NULL, consent_text=?3 WHERE id=?1").bind(id, now, text || null).run();
  return true;
}
async function nlApi(request, env, p) {
  let b = {}; try { b = JSON.parse(await request.text()); } catch {}
  const id = b && typeof b.id === "string" && b.id.length <= 64 ? b.id : null;
  if (!id) return fail(422, "bad_id");
  await mailSchema(env);
  if (p === "/api/me") {
    const q = await env.DB.prepare("SELECT email, newsletter_at, unsub_at, segui, segui_at FROM users WHERE id=?1").bind(id).first();
    let segui = null; try { segui = q && q.segui ? JSON.parse(q.segui) : null; } catch (e) {}
    return json({ ok: true, known: !!q, email: (q && q.email) || null, newsletter: !!(q && q.newsletter_at && !q.unsub_at), segui, segui_at: (q && q.segui_at) || null });
  }
  if (b.off === true) { // disiscrizione dal pannello «Il mio Read»
    const r = await env.DB.prepare("UPDATE users SET unsub_at=?2 WHERE id=?1 AND unsub_at IS NULL").bind(id, new Date().toISOString()).run();
    const q = await env.DB.prepare("SELECT 1 AS x FROM users WHERE id=?1").bind(id).first();
    return q ? json({ ok: true, newsletter: false }) : fail(404, "unknown_user");
  }
  const ok = await nlConsent(env, id, new Date().toISOString(), clip(b.consent_text, 500));
  return ok ? json({ ok: true, newsletter: true }) : fail(404, "unknown_user");
}

// Preferenze di lettura (Esplora · «Per te»): aree, argomenti, incroci area~argomento, temi (filoni). Non toccano il briefing.
const SEGUI_RE = /^[a-z][a-z-]{1,40}$/;
const INCROCIO_RE = /^([a-z][a-z-]{1,40}|[A-Z]{3})~[a-z][a-z-]{1,40}$/;
const PAESE_RE = /^[A-Z]{3}$/;
const FILONE_RE = /^[A-Za-z0-9_.:-]{1,80}$/;
function seguiClean(x) {
  if (!x || typeof x !== "object") return null;
  const arr = (v, re, n) => Array.isArray(v) ? [...new Set(v.filter((e) => typeof e === "string" && re.test(e)))].slice(0, n) : [];
  return { aree: arr(x.aree, SEGUI_RE, 20), paesi: arr(x.paesi, PAESE_RE, 80), temi: arr(x.temi, SEGUI_RE, 60), incroci: arr(x.incroci, INCROCIO_RE, 150), filoni: arr(x.filoni, FILONE_RE, 80) };
}
async function seguiApi(request, env) {
  const text = await request.text();
  if (text.length > 8000) return fail(413, "too_large");
  let b = {}; try { b = JSON.parse(text); } catch { return fail(400, "invalid_json"); }
  const id = b && typeof b.id === "string" && b.id.length <= 64 ? b.id : null;
  if (!id || id === "admin") return fail(422, "bad_id");
  const sg = seguiClean(b.segui);
  if (!sg) return fail(422, "bad_segui");
  await mailSchema(env);
  const now = new Date().toISOString();
  const r = await env.DB.prepare("UPDATE users SET segui=?2, segui_at=?3 WHERE id=?1").bind(id, JSON.stringify(sg), now).run();
  if (!r.meta || !r.meta.changes) return fail(404, "unknown_user");
  return json({ ok: true, segui: sg, segui_at: now });
}

// ---- disiscrizione: GET mostra il pulsante (i filtri antispam aprono i link, non devono disiscrivere), POST conferma / one-click ----
async function mailUnsub(request, env, token) {
  await mailSchema(env);
  const okTok = /^[0-9a-f]{32}$/.test(token);
  const u = okTok ? await env.DB.prepare("SELECT id, unsub_at FROM users WHERE unsub_token=?1").bind(token).first() : null;
  const page = (h, st = 200) => new Response(`<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Read Geopolitics</title><body style="margin:0;background:#0a1020;color:#e6ecf7;font:17px/1.55 system-ui,Segoe UI,Helvetica,Arial,sans-serif"><main style="max-width:520px;margin:12vh auto;padding:0 22px"><div style="font-weight:700;letter-spacing:.5px;color:#fff;font-size:22px">READ GEOPOLITICS</div><div style="height:1px;background:#f5b04c;margin:14px 0 26px"></div>${h}</main></body></html>`, { status: st, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  if (!u) return page("<p>Questo link non è valido o è scaduto.</p><p>Per qualsiasi richiesta scrivi a <a style='color:#f5b04c' href='mailto:hello@readgeopolitics.com'>hello@readgeopolitics.com</a>.</p>", 404);
  if (request.method === "POST") {
    if (!u.unsub_at) await env.DB.prepare("UPDATE users SET unsub_at=?2 WHERE id=?1").bind(u.id, new Date().toISOString()).run();
    const body = await request.text().catch(() => "");
    if (/List-Unsubscribe=One-Click/i.test(body)) return new Response("ok", { status: 200 });
    return page("<h1 style='font-size:24px;margin:0 0 10px'>Disiscrizione completata</h1><p>Non riceverai più la newsletter di Read Geopolitics. Puoi continuare a usare il sito come prima.</p><p style='color:#8fa0bd;font-size:14px'>Per cancellare anche i tuoi dati scrivi a hello@readgeopolitics.com.</p>");
  }
  if (u.unsub_at) return page("<h1 style='font-size:24px;margin:0 0 10px'>Sei già disiscritto</h1><p>Non riceverai più la newsletter.</p>");
  return page(`<h1 style='font-size:24px;margin:0 0 10px'>Vuoi disiscriverti?</h1><p>Smetterai di ricevere l'anteprima del mattino di Read Geopolitics.</p><form method="post"><button style="background:#f5b04c;color:#0a1020;border:0;border-radius:6px;padding:14px 22px;font:700 16px system-ui;cursor:pointer">Sì, disiscrivimi</button></form>`);
}

async function mailPanel(env, b) {
  await mailSchema(env);
  if (b.action === "mail_get") {
    const cfg = await mailCfg(env);
    return { ok: true, cfg, stats: await mailStats(env), last: await kvGet(env, "mail_last"), key: !!env.RESEND_API_KEY };
  }
  if (b.action === "mail_log") {
    const rows = (await env.DB.prepare("SELECT l.date AS date, l.user_id AS uid, l.ts AS ts, l.ok AS ok, l.err AS err, u.email AS email FROM mail_log l LEFT JOIN users u ON u.id=l.user_id WHERE l.date >= date('now','-7 day') ORDER BY l.date DESC, l.ts DESC LIMIT 400").all()).results || [];
    const days = [];
    for (const r of rows) {
      let d = days.find((x) => x.date === r.date);
      if (!d) { d = { date: r.date, ok: 0, err: 0, rows: [] }; days.push(d); }
      const kind = r.uid === "test" ? "prova" : r.uid === "copy" ? "copia" : "iscritto";
      if (r.ok) d.ok++; else d.err++;
      d.rows.push({ email: r.email || (r.uid === "test" || r.uid === "copy" ? ((await mailCfg(env)).test_email || "(tuo indirizzo)") : "(utente rimosso)"), ts: r.ts, ok: !!r.ok, err: r.err || null, kind });
    }
    const st = await mailStats(env);
    return { ok: true, days, today: { attivi: st.attivi, inviate: st.inviate_oggi } };
  }
  if (b.action === "mail_set") {
    const c = await mailCfg(env), i = b.cfg || {};
    const n = { ...c };
    if (typeof i.enabled === "boolean") n.enabled = i.enabled;
    if (typeof i.copy === "boolean") n.copy = i.copy;
    if (i.mode === "test" || i.mode === "live") n.mode = i.mode;
    if (typeof i.test_email === "string") n.test_email = i.test_email.trim().slice(0, 254);
    if (typeof i.privacy_url === "string") {
      let u = i.privacy_url.trim();
      if (u && !/^https?:\/\//i.test(u)) u = "https://" + u;
      if (u && !/^https:\/\/[^\s/]+\.[^\s/]+/.test(u)) throw { status: 422, code: "indirizzo_non_valido" };
      n.privacy_url = u.slice(0, 300);
    }
    if (typeof i.consent_text === "string") n.consent_text = i.consent_text.trim().slice(0, 500);
    const h = parseInt(i.hour, 10); if (h >= 5 && h <= 20) n.hour = h;
    const bt = parseInt(i.batch, 10); if (bt >= 1 && bt <= 100) n.batch = bt;
    const dc = parseInt(i.daily_cap, 10); if (dc >= 1 && dc <= 100) n.daily_cap = dc;
    if (n.mode === "live" && n.enabled && !n.privacy_url) throw { status: 422, code: "serve_informativa_privacy" };
    await kvSet(env, "mail_cfg", n);
    return { ok: true, cfg: n };
  }
  if (b.action === "mail_test") {
    const cfg = await mailCfg(env);
    const to = String(b.to || cfg.test_email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(to)) throw { status: 422, code: "email_prova_mancante" };
    const src = await mailBriefing(env, null);
    if (!src) throw { status: 422, code: "nessun_briefing" };
    const c = mailCompose(src, cfg); c.subject = "[PROVA " + new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit" }).format(new Date()) + "] " + c.subject;
    const res = await mailSend(env, [mailMsg(c, cfg, to, "prova")], `rg-test-${Date.now()}`);
    return { ok: res.ok, error: res.ok ? undefined : res.error, date: src.date };
  }
  throw { status: 400, code: "bad_action" };
}
async function mailPreview(env) {
  const src = await mailBriefing(env, null);
  if (!src) return htmlPage("Anteprima", "Nessun briefing pubblicato.", 404);
  const c = mailCompose(src, await mailCfg(env));
  return new Response(c.html.split("@@UNSUB@@").join("#"), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}


export default {
  async scheduled(event, env, ctx) {
    // rinnovo del token Instagram: se mancano meno di 30 giorni
    try {
      const t = await kvGet(env, "ig_token");
      if (t && Date.parse(t.expires_at) - Date.now() < 30 * 86400000) await igRefresh(env);
    } catch (e) {}
    try { await autoPublish(env); } catch (e) {}
    try { await ttPoll(env); } catch (e) {} // v20: stato degli invii a TikTok
    try { await thPoll(env); } catch (e) {} // v30: Threads (pubblicazioni in attesa e rinnovo del token)
    try { await tgDivergenza(env, false); } catch (e) {} // v41
    try { await tgBilancio(env, false); } catch (e) {} // v41
    try { await tgSera(env, false); } catch (e) {} // v53
    try { await thDomanda(env, false); } catch (e) {} // v41
    try { await tgMorning(env, false, null); } catch (e) { try { await kvSet(env, "tg_err", { at: new Date().toISOString(), msg: thErr(e) }); } catch (_) {} } // v33: Telegram, il mattino
    try { await siteWarm(env); } catch (e) {} // v26: file dei dati del sito già pronto
    try { await kvInit(env); await env.DB.prepare("DELETE FROM kv WHERE k LIKE 'perf:%' AND k < ?1").bind("perf:" + new Date(Date.now() - 14 * 86400000).toISOString()).run(); } catch (e) {}
    // v19: i video dei reel su R2 si cancellano dopo 14 giorni, come le bozze nel database (Instagram ne tiene già la sua copia)
    try {
      if (env.PODCAST) {
        const lim = Date.now() - 14 * 86400000; let cursor;
        do {
          const l = await env.PODCAST.list({ prefix: "igvid/", cursor, limit: 500 });
          const old = l.objects.filter((o) => o.uploaded && o.uploaded.getTime() < lim).map((o) => o.key);
          if (old.length) await env.PODCAST.delete(old);
          cursor = l.truncated ? l.cursor : undefined;
        } while (cursor);
      }
    } catch (e) {}
    try { await mailTick(env); } catch (e) { try { await kvSet(env, "mail_last", { ts: new Date().toISOString(), ok: false, msg: String((e && e.message) || e) }); } catch (_) {} }
    try { await kvInit(env); await env.DB.prepare("DELETE FROM kv WHERE (k LIKE 'img:%' OR k LIKE 'vid:%' OR k LIKE 'vidc:%') AND updated_at < ?1").bind(new Date(Date.now() - 14 * 86400000).toISOString()).run(); await env.DB.prepare("DELETE FROM kv WHERE k LIKE 'req:%' AND updated_at < ?1").bind(new Date(Date.now() - 60 * 86400000).toISOString()).run(); await env.DB.prepare("DELETE FROM kv WHERE k LIKE 'draft:%' AND updated_at < ?1").bind(new Date(Date.now() - 90 * 86400000).toISOString()).run(); await env.DB.prepare("DELETE FROM kv WHERE (k LIKE 'sess:%' AND updated_at < ?1) OR (k LIKE 'rl:%' AND updated_at < ?2)").bind(new Date(Date.now() - 31 * 86400000).toISOString(), new Date(Date.now() - 86400000).toISOString()).run(); } catch (e) {}
  },
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (e) {
      if (e && e.status) return fail(e.status, e.code, e.detail);
      return fail(503, "db_error", String((e && e.message) || e));
    }
  },
};
