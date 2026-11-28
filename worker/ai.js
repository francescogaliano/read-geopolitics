/* Intelligenza artificiale — sezione privata del pannello (dal 21/11/2026), separata da Read Geopolitics.
   Obiettivo (Francesco): essere sempre il più informato della stanza sull'IA, con giudizio.
   - raccolta: il cron legge i feed di ai-fonti.js (solo titoli, link, ora) e li tiene 7 giorni in ai_voci
   - contenuti: li scrivono le routine «ia» (mattino) e «ia-settimana» (domenica) con rgdb.py nelle collezioni private
       ai_oggi/<AAAA-MM-GG>   l'edizione del giorno (numero, letture con grafico, domande, clienti, da osservare, log)
       ai_tesi/<t1…>          le tesi (tendenze) con prove, direzione, storia, cosa le smentirebbe
                              + dinamica (dal 24/11/2026, pilota t1): meccanismo, ipotesi in gara con peso, segnali con soglia, scenari, revisore, dato che manca
       ai_meccanismi/<id>     la biblioteca dei meccanismi (scheda: ciclo, scala, caso storico, quando scatta, per l'IA, fonti)
       ai_mappa/attuale       la mappa delle chiavi: nodi, archi con segno e circuito, circuiti, variabile al centro
       ai_adozione/<livello>  la mappa dell'adozione: livello × orizzonte (breve, medio, lungo), intrecci, protagonisti
       ai_approf/<slug>       approfondimenti
       ai_clienti/<slug>      i clienti seguiti (SOLO nel database, mai nel repository: è pubblico)
       ai_casi/<id>           casi d'uso: chi, area, tecnologia, modello, cloud, installazione, integratore, stadio, risultato
       ai_temi/<tema_id>      gli 8 temi: frase, sintesi, direzione, perché conta (routine della domenica)
       ai_prezzi/<AAAA-MM-GG> listino e punteggi dei modelli della settimana (routine della domenica)
       ai_attori/<id>         i protagonisti (Anthropic, OpenAI, Google…): direzione, scommesse, posizione per capacità, mosse, legami
       ai_confronti/<id>      numeri confrontabili tra protagonisti (investimenti, ricavi), con data e fonte per voce
       ai_glossario/<slug>    le parole sottolineate e cliccabili (aziende, modelli, persone, istituzioni, concetti), dal 22/11/2026
       ai_filoni/<slug>       i filoni: la storia di un tema nel tempo, tappa per tappa (dal 22/11/2026)
       ai_persone/<id>        le persone chiave dell'IA (26/11/2026, pubbliche): ruolo, perché è famosa, cosa fa ora, percorso, cosa ha sviluppato,
                              posizioni dichiarate con data e fonte, stima nel tempo, legami, notizie (le scrive la routine «persone»)
       ai_persone_foto/<id>   la foto scelta da Francesco su Wikimedia Commons, con licenza e crediti (la scrive solo il Worker, azione ai_persona_foto)
       ai_c360/<cliente>      la vista 360° di un cliente: sintesi, PowerMap, numeri, IA, pari, incontro (dal 23/11/2026; SOLO nel database)
     nessuna di queste collezioni va sul sito pubblico (non sono in DB_SITE)
   - pannello /ig/ia (ai.html): azioni ai_get e ai_fonti
   - routine: GET /v1/ia/voci?ore=36 (token) — titoli raggruppati per gruppo di fonti */
import { AI_FONTI, AI_GRUPPI } from "./ai-fonti.js";
import { rsLeggi } from "./rassegna.js";

const K_STATO = "ai:stato", K_GIRO = "ai:giro", PER_GIRO = 6, GIORNI_TENUTI = 7;
export const AI_LIVELLI = [
  ["governi", "Governi e regole"], ["aziende", "Aziende"], ["lavoro", "Lavoro"], ["famiglie", "Famiglie e consumatori"],
  ["persona", "La persona"], ["infrastruttura", "Infrastruttura ed energia"], ["capitali", "Capitali"], ["modelli", "Modelli e ricerca"],
];

/* casi d'uso: area aziendale × tipo di tecnologia (con modello, cloud, modo di installazione, integratore) */
export const AI_AREE = [["A1", "Clienti e vendite"], ["A2", "Prodotto e design"], ["A3", "Supply chain e pianificazione"], ["A4", "Funzioni corporate (HR, finanza, legale)"], ["A5", "Tecnologia e dati"], ["A6", "Operazioni e servizi"], ["A7", "Ricerca e sviluppo"]];
export const AI_TECNOLOGIE = [["assistente", "Assistente (copilota)"], ["agente", "Agente che agisce"], ["ricerca", "Ricerca nei documenti (RAG)"], ["contenuti", "Generazione di contenuti"], ["predittivo", "ML predittivo"], ["visione", "Visione"], ["ibrido", "Ibrido (genAI + ML + regole)"]];
/* protagonisti: posizione su ogni capacità — avanti | pari | indietro | assente (giudizio con il motivo, niente punteggi) */
export const AI_CAPACITA = [["frontiera", "Modelli di frontiera"], ["agenti", "Agenti e programmazione"], ["aziende", "Vendita alle aziende"], ["consumatori", "Consumatori"], ["calcolo", "Calcolo e chip propri"], ["distribuzione", "Cloud e distribuzione"], ["aperti", "Modelli aperti"], ["europa", "Europa e sovranità"]];

async function tabella(env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS ai_voci (link TEXT PRIMARY KEY, fonte TEXT NOT NULL, titolo TEXT NOT NULL, sito TEXT, data TEXT NOT NULL, visto TEXT NOT NULL)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS ai_voci_data ON ai_voci (data)").run();
}

/* un giro: i prossimi PER_GIRO feed */
export async function aiGiro(env, h, n) {
  await tabella(env);
  const g = (await h.kvGet(env, K_GIRO)) || { i: 0 }, quanti = Math.min(n || PER_GIRO, AI_FONTI.length), lista = [];
  for (let k = 0; k < quanti; k++) lista.push(AI_FONTI[(g.i + k) % AI_FONTI.length]);
  const ora = new Date().toISOString(), lim = new Date(Date.now() - GIORNI_TENUTI * 864e5).toISOString();
  const esiti = await Promise.all(lista.map((f) => rsLeggi(f).then((r) => [f, r])));
  const stato = (await h.kvGet(env, K_STATO)) || {}, ins = [];
  for (const k of Object.keys(stato)) if (!AI_FONTI.some((f) => f.id === k)) delete stato[k];
  for (const [f, r] of esiti) {
    const fresche = r.voci.filter((v) => !v.data || v.data >= lim);
    const ultima = r.voci.reduce((m, v) => (v.data && v.data > m ? v.data : m), "");
    stato[f.id] = { ok: r.ok, fermo: !!r.fermo, via: r.via || null, n: r.voci.length, fresche: fresche.length, ultima: ultima || null, errori: (r.tentativi || []).slice(-3), at: ora };
    for (const v of fresche) ins.push(env.DB.prepare("INSERT OR IGNORE INTO ai_voci (link, fonte, titolo, sito, data, visto) VALUES (?1, ?2, ?3, ?4, ?5, ?6)").bind(v.link, f.id, v.titolo, v.sito || null, v.data || ora, ora));
  }
  for (let i = 0; i < ins.length; i += 50) await env.DB.batch(ins.slice(i, i + 50));
  await env.DB.prepare("DELETE FROM ai_voci WHERE data < ?1").bind(lim).run();
  await h.kvSet(env, K_STATO, stato);
  await h.kvSet(env, K_GIRO, { i: (g.i + quanti) % AI_FONTI.length, at: ora });
  return { fatti: lista.map((f) => f.id), nuove: ins.length };
}
/* 27/11/2026 — memoria delle menzioni dei trend. Una volta all'ora (al massimo) il Worker cerca nei titoli delle ultime 36 ore
   le parole di ogni scheda ai_trend («parole»: ["saas apocalypse", …]) e aggiunge i titoli trovati al documento della settimana
   ai_menzioni/<lunedì>: {"trend": {<id>: {"n", "voci": [{titolo, link, fonte, data}]}}, "aggiornato"}. Non si cancella mai:
   i titoli dei feed durano 7 giorni, questo documento resta e permette di rileggere cosa si diceva, non solo quanto. */
const lunedi = (d) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
async function menzioniGiro(env, h, oggi) {
  const ora = new Date().toISOString(), ult = await h.kvGet(env, "ai:menz");
  if (ult && ult.at && Date.now() - Date.parse(ult.at) < 3600e3) return;
  await h.kvSet(env, "ai:menz", { at: ora });
  const T = ((await env.DB.prepare("SELECT key, data->'$.parole' p FROM rdocs WHERE type='ai_trend'").all()).results || [])
    .map((r) => ({ id: r.key, p: jp(r.p, []).map((w) => String(w).toLowerCase().trim()).filter((w) => w.length >= 3) })).filter((t) => t.p.length);
  if (!T.length) return;
  const V = await voci(env, 36), wk = lunedi(oggi);
  const row = await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_menzioni' AND key=?1").bind(wk).first();
  const doc = (row && jp(row.data, null)) || { settimana: wk, trend: {} };
  doc.trend = doc.trend || {};
  for (const t of T) {
    const cur = doc.trend[t.id] || { n: 0, voci: [] }, visti = new Set(cur.voci.map((v) => v.link));
    for (const v of V) {
      const tt = " " + String(v.titolo).toLowerCase() + " ";
      if (visti.has(v.link) || !t.p.some((w) => tt.includes(w))) continue;
      visti.add(v.link); cur.n++;
      if (cur.voci.length < 120) cur.voci.push({ titolo: String(v.titolo).slice(0, 220), link: v.link, fonte: v.fonte, data: String(v.data).slice(0, 10) });
    }
    doc.trend[t.id] = cur;
  }
  doc.aggiornato = ora;
  await env.DB.prepare("INSERT OR REPLACE INTO rdocs (type,key,version,hash,data,updated_at) VALUES ('ai_menzioni',?1,1,'',?2,?3)").bind(wk, JSON.stringify(doc), ora).run();
}

/* 28/11/2026 — GIUDICE ALLA CIECA con un modello di un'altra azienda (OpenAI).
   Riceve prove e due spiegazioni senza nomi («1» e «2», in ordine già tirato a sorte dalla routine) e restituisce, per ogni prova,
   quale spiegazione la rende più probabile e di quanto, sulla scala fissa 1 / 1.5 / 2 / 3 / 5. Non sa quale ipotesi è in testa. */
const GIUDICE_ISTR = "Sei un giudice indipendente. Per ogni prova ricevi un fatto e due spiegazioni concorrenti, chiamate 1 e 2. Non sai da dove vengono né quale sia considerata più probabile. Per ogni prova rispondi: quale spiegazione rende il fatto più probabile (\"1\", \"2\" oppure \"nessuna\" se è ugualmente probabile con entrambe) e di quanto, solo con uno di questi valori: 1 (uguale), 1.5 (un po' più probabile), 2 (chiaramente più probabile), 3 (difficile da spiegare con l'altra), 5 (quasi impossibile con l'altra). Giudica solo il fatto riportato, non la fonte né le tue opinioni sull'argomento. Una riga di motivo in italiano.";
const GIUDICE_SCHEMA = { type: "object", additionalProperties: false, required: ["giudizi"], properties: { giudizi: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "scelta", "diag", "motivo"], properties: { id: { type: "string" }, scelta: { type: "string", enum: ["1", "2", "nessuna"] }, diag: { type: "number", enum: [1, 1.5, 2, 3, 5] }, motivo: { type: "string" } } } } } };
async function giudice(env, prove) {
  if (!env.OPENAI_API_KEY) return { ok: false, errore: "manca OPENAI_API_KEY" };
  const P = (prove || []).slice(0, 25).map((x, i) => ({ id: String(x.id || i), fatto: String(x.testo || "").slice(0, 600), valore: x.val ? String(x.val).slice(0, 60) : undefined, fonte: x.fonte ? String(x.fonte).slice(0, 120) : undefined, data: x.data ? String(x.data).slice(0, 20) : undefined, spiegazione_1: String(x.s1 || "").slice(0, 400), spiegazione_2: String(x.s2 || "").slice(0, 400) }));
  if (!P.length) return { ok: false, errore: "nessuna prova" };
  const modello = env.OPENAI_MODEL || "gpt-6.1-sol";
  const r = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: "Bearer " + env.OPENAI_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ model: modello, instructions: GIUDICE_ISTR, input: JSON.stringify({ prove: P }), max_output_tokens: 6000, text: { format: { type: "json_schema", name: "giudizi", strict: true, schema: GIUDICE_SCHEMA } } }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, stato: r.status, errore: (j.error && j.error.message) || "errore OpenAI", modello };
  let testo = j.output_text || "";
  if (!testo) for (const o of j.output || []) for (const c of o.content || []) if (c.type === "output_text") testo += c.text;
  const out = jp(testo, null);
  if (!out || !Array.isArray(out.giudizi)) return { ok: false, errore: "risposta non leggibile", modello, grezzo: String(testo).slice(0, 500) };
  return { ok: true, modello: j.model || modello, uso: j.usage || null, giudizi: out.giudizi };
}
async function modelliOpenAI(env) {
  const r = await fetch("https://api.openai.com/v1/models", { headers: { authorization: "Bearer " + env.OPENAI_API_KEY } });
  const j = await r.json().catch(() => ({}));
  return r.ok ? (j.data || []).map((m) => m.id).filter((x) => /^gpt|^o\d/.test(x)).sort() : { stato: r.status, errore: (j.error && j.error.message) || "" };
}
/* prova a richiesta: si scrive in kv «ai:giudice:prova» {"prove":[…]}; il cron la esegue una volta e scrive l'esito in «ai:giudice:esito» */
async function giudiceProva(env, h) {
  const q = await h.kvGet(env, "ai:giudice:prova");
  if (!q || !q.prove || q.fatta) return;
  await h.kvSet(env, "ai:giudice:prova", { ...q, fatta: new Date().toISOString() });
  let esito; try { esito = await giudice(env, q.prove); } catch (e) { esito = { ok: false, errore: String((e && e.message) || e).slice(0, 300) }; }
  if (!esito.ok) { try { esito.modelli = await modelliOpenAI(env); } catch (e) {} }
  await h.kvSet(env, "ai:giudice:esito", { at: new Date().toISOString(), ...esito });
}
export async function aiCron(env, h) { try { await giudiceProva(env, h); } catch (e) {} try { await menzioniGiro(env, h, h.romeToday ? h.romeToday() : new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Rome" })); } catch (e) {} try { await fotoGiro(env, h.romeToday ? h.romeToday() : new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Rome" })); } catch (e) {} try { await aiGiro(env, h, PER_GIRO); } catch (e) { try { await h.kvSet(env, "ai:err", { at: new Date().toISOString(), msg: String((e && e.message) || e).slice(0, 300) }); } catch (_) {} } }

async function voci(env, ore) {
  await tabella(env);
  const da = new Date(Date.now() - Math.max(1, Math.min(168, ore || 36)) * 3600e3).toISOString();
  return (await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM ai_voci WHERE data >= ?1 ORDER BY data DESC LIMIT 3000").bind(da).all()).results || [];
}
const jp = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
/* foto delle persone: solo licenze libere, come in Read Geopolitics */
const LIC_OK = /^(cc0|cc[ -]?by(-sa)?([ -][\d.]+)?|public domain|pd\b|pd-|attribution|ogl|licence ouverte|kogl|godl)/i;
const UA = { "user-agent": "ReadGeopolitics/1.0 (https://www.readgeopolitics.com)" };
async function fotoCommons(f, origine, oggi) { // un file di Commons → foto con autore e licenza, solo se la licenza è libera
  let j; try { const r = await fetch("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=480&titles=" + encodeURIComponent("File:" + f), { headers: UA, signal: AbortSignal.timeout(8000) }); j = await r.json(); } catch (e) { return { ok: false, error: "Wikimedia Commons non risponde, riprova" }; }
  const pg = Object.values((j && j.query && j.query.pages) || {})[0] || {}, ii = (pg.imageinfo || [])[0];
  if (!ii) return { ok: false, error: "file non trovato su Wikimedia Commons" };
  const m = ii.extmetadata || {}, val = (k) => String((m[k] && m[k].value) || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const lic = val("LicenseShortName");
  if (!LIC_OK.test(lic) || /\b(nc|nd)\b|non-?commercial|no-?deriv/i.test(lic)) return { ok: false, error: "licenza non libera: " + (lic || "sconosciuta") + ". Servono pubblico dominio, CC0, CC BY o CC BY-SA." };
  const foto = { src: String(ii.thumburl || ii.url || "").replace(/\?utm_[^#]*$/, ""), c: (val("Artist") || "autore non indicato").slice(0, 140) + ", via Wikimedia Commons", lic, l: val("LicenseUrl") || "", u: ii.descriptionurl || "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(f), f, origine, il: oggi };
  if (!/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(foto.src)) /* da novembre 2026 le miniature arrivano da thumb.wikimedia.org */ return { ok: false, error: "indirizzo dell'immagine inatteso" };
  return { ok: true, foto };
}
/* foto automatica (26/11/2026): l'immagine che Wikidata associa alla persona (proprietà P18), se la licenza è libera.
   La routine scrive solo l'identificativo Wikidata («wikidata»: "Q…"); la foto la cerca il Worker, al massimo 3 per giro del cron,
   e non tocca mai una foto scelta a mano. Se non c'è una foto libera riprova dopo 7 giorni. */
async function fotoGiro(env, oggi) {
  const R = (await env.DB.prepare("SELECT p.key k, p.data->>'$.wikidata' q, f.data fd FROM rdocs p LEFT JOIN rdocs f ON f.type='ai_persone_foto' AND f.key=p.key WHERE p.type='ai_persone' AND p.data->>'$.wikidata' LIKE 'Q%' AND (f.key IS NULL OR (f.data->>'$.origine'='wikidata' AND f.data->>'$.q' IS NOT p.data->>'$.wikidata') OR (f.data->>'$.nessuna'=1 AND (f.data->>'$.il' < ?1 OR coalesce(f.data->>'$.v', 0) < 3))) LIMIT 3").bind(new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)).all()).results || [];
  for (const x of R) {
    let foto = null, nota = "";
    try {
      const j = await (await fetch("https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&property=P18&entity=" + encodeURIComponent(x.q), { headers: UA, signal: AbortSignal.timeout(8000) })).json();
      const c = ((j.claims || {}).P18 || []).find((v) => v.rank === "preferred") || ((j.claims || {}).P18 || [])[0], f = c && c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value;
      if (f) { const r = await fotoCommons(String(f), "wikidata", oggi); if (r.ok) foto = { ...r.foto, q: x.q }; else nota = r.error; } else nota = "nessuna immagine su Wikidata";
      if (!foto) { // ripiego: l'immagine principale della voce di Wikipedia (inglese, poi italiana), solo se è un file di Commons con licenza libera
        const e = await (await fetch("https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&sitefilter=enwiki|itwiki&ids=" + encodeURIComponent(x.q), { headers: UA, signal: AbortSignal.timeout(8000) })).json();
        const sl = ((e.entities || {})[x.q] || {}).sitelinks || {};
        for (const [w, dom] of [["enwiki", "en"], ["itwiki", "it"]]) {
          if (!sl[w] || foto) continue;
          const pj = await (await fetch(`https://${dom}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=name&titles=` + encodeURIComponent(sl[w].title), { headers: UA, signal: AbortSignal.timeout(8000) })).json();
          const nm = (Object.values((pj.query || {}).pages || {})[0] || {}).pageimage;
          if (nm) { const r = await fotoCommons(String(nm).replace(/_/g, " "), "wikidata", oggi); if (r.ok) foto = { ...r.foto, q: x.q, da: dom + ".wikipedia" }; else nota += " · Wikipedia: " + r.error; }
        }
      }
    } catch (e) { nota = "Wikidata non risponde"; }
    await env.DB.prepare("INSERT OR REPLACE INTO rdocs (type,key,version,hash,data,updated_at) VALUES ('ai_persone_foto',?1,1,'',?2,?3)").bind(x.k, JSON.stringify(foto || { nessuna: 1, v: 3, q: x.q, origine: "wikidata", nota, il: oggi }), new Date().toISOString()).run();
  }
}
function fileCommons(u) {
  let x = String(u || "").trim(); try { x = decodeURIComponent(x); } catch (e) {}
  let m = x.match(/^https?:\/\/commons\.(?:m\.)?wikimedia\.org\/wiki\/(?:File|Immagine|Image|Fichier|Datei):([^?#]+)/i);
  if (m) return m[1].replace(/_/g, " ").trim().slice(0, 240);
  m = x.match(/^https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);
  if (m) return m[1].replace(/_/g, " ").trim().slice(0, 240);
  m = x.match(/^(?:File|Immagine):(.+\.(?:jpe?g|png|webp|tiff?))$/i);
  return m ? m[1].replace(/_/g, " ").trim().slice(0, 240) : null;
}
/* una raccolta come stringa JSON pronta ("[...]"), costruita dal database: il Worker non la legge */
async function raw(env, type, lim = 400, order = "key DESC", expr = "json_set(data,'$.id',key,'$._agg',updated_at)") {
  const r = await env.DB.prepare(`SELECT '[' || coalesce(group_concat(o, ','), '') || ']' AS j FROM (SELECT ${expr} AS o FROM rdocs WHERE type=?1 ORDER BY ${order} LIMIT ?2)`).bind(type, lim).first();
  return (r && r.j) || "[]";
}
async function coll(env, type, lim = 400) { return ((await env.DB.prepare("SELECT key, data, updated_at FROM rdocs WHERE type=?1 ORDER BY key DESC LIMIT ?2").bind(type, lim).all()).results || []).map((r) => ({ id: r.key, ...jp(r.data, {}), _agg: r.updated_at })); }

/* per le routine (token): GET /v1/ia/voci?ore=36 */
export async function aiRoute(request, env, p, method, url, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
  if (p === "/v1/ia/giudice" && method === "POST") {
    const b = await request.json().catch(() => ({}));
    return h.json(await giudice(env, b.prove));
  }
  if (p === "/v1/ia/voci" && method === "GET") {
    const V = await voci(env, Number(url.searchParams.get("ore")) || 36), F = Object.fromEntries(AI_FONTI.map((f) => [f.id, f]));
    const per = {}; for (const v of V) { const f = F[v.fonte]; if (!f) continue; (per[f.gruppo] = per[f.gruppo] || []).push({ fonte: f.nome, titolo: v.titolo, link: v.link, data: v.data }); }
    const stato = (await h.kvGet(env, K_STATO)) || {};
    return h.json({ ok: true, titoli: V.length, gruppi: AI_GRUPPI, voci: per, fonti_ferme: AI_FONTI.filter((f) => stato[f.id] && !stato[f.id].ok).map((f) => f.nome), livelli: AI_LIVELLI });
  }
  return h.fail(404, "not_found");
}

/* pannello: ai_get (tutto il necessario per la pagina), ai_fonti (stato dei feed) */
export async function aiPanelApi(env, b, h) {
  if (b.action === "ai_get") {
    /* Leggero per il Worker (22/11/2026): le raccolte grandi arrivano dal database già in JSON e passano così come sono
       (niente JSON.parse/stringify nel Worker); si leggono davvero solo edizioni, glossario e clienti (proiettati). */
    const edz = await coll(env, "ai_oggi", 60), data = String(b.data || ""), pub = b._pubblico === true;
    if (pub) for (const e of edz) delete e.clienti; /* i clienti non escono mai dal modo privato */
    const oggi = (data && edz.find((e) => e.id === data)) || edz[0] || null;
    const ORD = "coalesce(CAST(data->>'$.ordine' AS REAL), 99), key";
    const cut30 = new Date(Date.now() - 31 * 864e5).toISOString().slice(0, 10);
    const NIENTE = Promise.resolve("[]");
    const [tesi, adozione, approf, casi, attori, confronti, filoni, agenda, glossario, clienti, temi, prezzi, meccanismi, mappa, temiStorie, persone, trend, registro, copertura, controllo, menzioni] = await Promise.all([
      raw(env, "ai_tesi", 60, ORD), raw(env, "ai_adozione", 40), raw(env, "ai_approf", 80, "key DESC", "json_set(json_remove(data,'$.sezioni'),'$.id',key,'$._agg',updated_at,'$.n_sezioni',coalesce(json_array_length(data,'$.sezioni'),0))"),
      raw(env, "ai_casi", 600, "key DESC", "json_object('id',key,'chi',data->>'$.chi','settore',data->>'$.settore','settore_norm',data->>'$.settore_norm','paese',data->>'$.paese','area',data->>'$.area','tecnologia',data->>'$.tecnologia','modello',data->>'$.modello','cloud',data->>'$.cloud','deploy',data->>'$.deploy','partner',data->>'$.partner','stadio',data->>'$.stadio','cosa',data->>'$.cosa','dato',data->>'$.dato','misura',data->>'$.misura','data',data->>'$.data','iso',data->>'$.iso','chi_lo_dice',data->'$.chi_lo_dice','fonte',data->'$.fonte')"),
      raw(env, "ai_attori", 40, ORD), raw(env, "ai_confronti", 20, ORD), raw(env, "ai_filoni", 300, "coalesce(data->>'$.aggiornato', updated_at) DESC"),
      raw(env, "ai_agenda", 400, "coalesce(data->>'$.data', '9999'), key"),
      coll(env, "ai_glossario", 2000),
      env.DB.prepare("SELECT key, data->>'$.nome' nome, coalesce(data->>'$.settore', data->>'$.cluster', '') settore, data->>'$.sottocluster' sc, coalesce(data->'$.aree','{}') aree, coalesce(json_array_length(data,'$.eventi'),0) n FROM rdocs WHERE type='ai_clienti' ORDER BY key DESC LIMIT 80").all().then((r) => r.results || []),
      raw(env, "ai_temi", 20), raw(env, "ai_prezzi", 60, "key DESC"), raw(env, "ai_meccanismi", 40), raw(env, "ai_mappa", 2),
      env.DB.prepare("SELECT '[' || coalesce(group_concat(o, ','), '') || ']' AS j FROM (SELECT json_object('ed', r.key, 'i', CAST(j.key AS INTEGER), 'titolo', coalesce(j.value->>'$.titolo', j.value->>'$.breve', ''), 'tema_id', j.value->>'$.tema_id', 'tema', j.value->>'$.tema') AS o FROM rdocs r, json_each(r.data, '$.letture') j WHERE r.type='ai_oggi' AND r.key >= ?1 ORDER BY r.key DESC)").bind(cut30).first().then((r) => (r && r.j) || "[]"),
      raw(env, "ai_persone", 80, "coalesce(CAST(data->>'$.ordine' AS REAL), 99), key", "json_object('id',key,'nome',data->>'$.nome','gruppo',data->>'$.gruppo','ruolo',data->>'$.ruolo','perche',data->>'$.perche','aziende',json(coalesce(data->'$.aziende','[]')),'ultima',json(coalesce(data->'$.notizie[0]','null')),'foto',json(coalesce((SELECT f.data FROM rdocs f WHERE f.type='ai_persone_foto' AND f.key=rdocs.key AND f.data->>'$.src' IS NOT NULL),'null')),'aggiornato',data->>'$.aggiornato')"),
      /* 27/11/2026: i trend (la parte «privato» non esce mai nel modo pubblico) e la memoria del metodo (solo privato) */
      raw(env, "ai_trend", 40, "coalesce(data->>'$.ordine','9'), key", pub ? "json_remove(json_set(data,'$.id',key,'$._agg',updated_at),'$.privato')" : undefined),
      pub ? NIENTE : raw(env, "ai_registro", 400, "coalesce(data->>'$.data','') DESC, key"),
      pub ? NIENTE : raw(env, "ai_copertura", 6, "key DESC"),
      pub ? NIENTE : raw(env, "ai_controllo", 6, "key DESC"),
      pub ? NIENTE : raw(env, "ai_menzioni", 26, "key DESC"),
    ]);
    /* glossario: in quali letture delle ultime edizioni compare ogni voce (termine o alias, parola intera) */
    const testi = []; for (const e of edz) (e.letture || []).forEach((l, i) => testi.push({ data: e.id, i, breve: l.breve || l.titolo || "", t: JSON.stringify([l.titolo, l.breve, l.perche_breve, l.due_righe, l.perche_conta, l.fatti, l.lettura, l.diversa, l.come_funziona, l.pro, l.contro, l.sintesi]) }));
    const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const gl = glossario.map((g) => { const T = [g.termine, ...(Array.isArray(g.alias) ? g.alias : [])].filter((x) => x && String(x).length > 2); let st = [];
      if (T.length && testi.length) { try { const re = new RegExp("(^|[^\\p{L}\\p{N}])(" + T.map((x) => reEsc(String(x))).join("|") + ")(?=$|[^\\p{L}\\p{N}])", "u"); st = testi.filter((x) => re.test(x.t)).slice(0, 12).map(({ data, i, breve }) => ({ data, i, breve })); } catch (e) {} }
      const { _agg, ...r } = g; return { ...r, storie: st }; });
    const tocchi = {}; for (const e of edz) for (const c of e.clienti || []) for (const n of c.clienti || []) (tocchi[n] = tocchi[n] || []).push({ data: e.id, testo: c.testo, perche: c.perche, tesi: c.tesi || null });
    const stato = (await h.kvGet(env, K_STATO)) || {};
    const c360 = new Set(pub ? [] : ((await env.DB.prepare("SELECT key FROM rdocs WHERE type='ai_c360'").all()).results || []).map((r) => r.key));
    /* 24/11/2026: i giri della routine «aggiornamenti_ai» di oggi (solo modo privato) */
    const aggR = pub ? null : await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_agg' AND key=?").bind(h.romeToday()).first().catch(() => null);
    let agg = null; try { agg = aggR && aggR.data ? JSON.parse(aggR.data) : null; } catch (e) { agg = null; }
    /* 25/11/2026: previsioni private delle chiavi (mai nel modo pubblico) */
    const previsioni = pub ? null : (((await env.DB.prepare("SELECT key, data FROM rdocs WHERE type='ai_previsioni'").all().catch(() => ({ results: [] }))).results) || []).map((r) => { try { return { ...JSON.parse(r.data), id: r.key }; } catch (e) { return null; } }).filter(Boolean);
    const base = { ok: true, privato: !pub, oggi: h.romeToday(), edizione: oggi, agg, previsioni, edizioni: edz.map((e) => ({ id: e.id, frase: e.frase || "", titolo: e.titolo || "" })), livelli: AI_LIVELLI, glossario: gl, aree: AI_AREE, tecnologie: AI_TECNOLOGIE, capacita: AI_CAPACITA,
      clienti: pub ? [] : clienti.map((c) => ({ id: c.key, nome: c.nome, settore: c.settore, sc: c.sc || null, aree: jp(c.aree, {}), n_eventi: c.n, tocchi: (tocchi[c.nome] || []).slice(0, 8), v360: c360.has(c.key) })),
      fonti: { totale: AI_FONTI.length, ok: AI_FONTI.filter((f) => stato[f.id] && stato[f.id].ok).length, provate: Object.keys(stato).length } };
    const s = JSON.stringify(base).slice(0, -1) + `,"tesi":${tesi},"adozione":${adozione},"approf":${approf},"casi":${casi},"attori":${attori},"confronti":${confronti},"filoni":${filoni},"agenda":${agenda},"temi":${temi},"prezzi":${prezzi},"meccanismi":${meccanismi},"mappa":${mappa},"temi_storie":${temiStorie},"persone":${persone},"trend":${trend},"registro":${registro},"copertura":${copertura},"controllo":${controllo},"menzioni":${menzioni}}`;
    return new Response(s, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }
  /* ricerca nell'archivio delle edizioni (titolo, frase, letture, brevi): dal 22/11/2026 */
  if (b.action === "ai_cerca") {
    const q = String(b.q || "").trim().slice(0, 60); if (q.length < 3) return { ok: true, storie: [] };
    const like = "%" + q.replace(/[%_]/g, "") + "%";
    const r = await env.DB.prepare("SELECT r.key AS ed, j.key AS i, j.value->>'$.breve' AS breve, j.value->>'$.tema_id' AS tema_id, j.value->>'$.tema' AS tema FROM rdocs r, json_each(r.data, '$.letture') j WHERE r.type='ai_oggi' AND j.value LIKE ?1 ORDER BY r.key DESC LIMIT 40").bind(like).all();
    const br = await env.DB.prepare("SELECT r.key AS ed, j.value->>'$.testo' AS testo, j.value->>'$.tema_id' AS tema_id, j.value->'$.fonte' AS fonte FROM rdocs r, json_each(r.data, '$.brevi') j WHERE r.type='ai_oggi' AND j.value LIKE ?1 ORDER BY r.key DESC LIMIT 20").bind(like).all();
    return { ok: true, storie: r.results || [], brevi: (br.results || []).map((x) => ({ ...x, fonte: jp(x.fonte, null) })) };
  }
  /* vista 360° del cliente (23/11/2026): solo in modo privato, dati solo nel database */
  if (b.action === "ai_c360") { if (b._pubblico === true) return { ok: false, error: "privato" }; const r = await env.DB.prepare("SELECT data, updated_at FROM rdocs WHERE type='ai_c360' AND key=?1").bind(String(b.id || "")).first(); return { ok: !!r, c360: r ? jp(r.data, null) : null }; }
  /* persone chiave (26/11/2026): il profilo intero si legge quando lo si apre */
  if (b.action === "ai_persona") {
    const id = String(b.id || "").slice(0, 60), r = await env.DB.prepare("SELECT data, updated_at FROM rdocs WHERE type='ai_persone' AND key=?1").bind(id).first();
    if (!r) return { ok: false, error: "persona non trovata" };
    const f = await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_persone_foto' AND key=?1").bind(id).first();
    const fo = f ? jp(f.data, null) : null;
    return { ok: true, persona: { ...jp(r.data, {}), id, foto: fo && fo.src ? fo : null, _agg: r.updated_at } };
  }
  /* la foto: la sceglie Francesco su Wikimedia Commons; il Worker accetta solo licenze libere e salva autore e licenza (solo modo privato) */
  if (b.action === "ai_persona_foto") {
    if (b._pubblico === true) return { ok: false, error: "privato" };
    const id = String(b.id || "").slice(0, 60);
    if (!(await env.DB.prepare("SELECT 1 FROM rdocs WHERE type='ai_persone' AND key=?1").bind(id).first())) return { ok: false, error: "persona non trovata" };
    const u = String(b.url || "").trim();
    if (!u) { await env.DB.prepare("DELETE FROM rdocs WHERE type='ai_persone_foto' AND key=?1").bind(id).run(); return { ok: true, foto: null }; }
    const f = fileCommons(u); if (!f) return { ok: false, error: "incolla il link di un file di Wikimedia Commons (commons.wikimedia.org/wiki/File:…)" };
    const r = await fotoCommons(f, "manuale", h.romeToday()); if (!r.ok) return r; const foto = r.foto;
    await env.DB.prepare("INSERT OR REPLACE INTO rdocs (type,key,version,hash,data,updated_at) VALUES ('ai_persone_foto',?1,1,'',?2,?3)").bind(id, JSON.stringify(foto), new Date().toISOString()).run();
    return { ok: true, foto };
  }
  if (b.action === "ai_approf") { const r = await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_approf' AND key=?1").bind(String(b.id || "")).first(); return { ok: !!r, approf: r ? jp(r.data, null) : null }; }
  if (b.action === "ai_fonti") {
    const stato = (await h.kvGet(env, K_STATO)) || {}; await tabella(env);
    const n = ((await env.DB.prepare("SELECT fonte, count(*) n FROM ai_voci GROUP BY fonte").all()).results || []).reduce((o, r) => ((o[r.fonte] = r.n), o), {});
    return { ok: true, gruppi: AI_GRUPPI, fonti: AI_FONTI.map((f) => ({ id: f.id, nome: f.nome, gruppo: f.gruppo, titoli: n[f.id] || 0, ...(stato[f.id] || { mai: true }) })) };
  }
  return null;
}
