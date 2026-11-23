/* Intelligenza artificiale — sezione privata del pannello (dal 21/11/2026), separata da Read Geopolitics.
   Obiettivo (Francesco): essere sempre il più informato della stanza sull'IA, con giudizio.
   - raccolta: il cron legge i feed di ai-fonti.js (solo titoli, link, ora) e li tiene 7 giorni in ai_voci
   - contenuti: li scrivono le routine «ia» (mattino) e «ia-settimana» (domenica) con rgdb.py nelle collezioni private
       ai_oggi/<AAAA-MM-GG>   l'edizione del giorno (numero, letture con grafico, domande, clienti, da osservare, log)
       ai_tesi/<t1…>          le tesi (tendenze) con prove, direzione, storia, cosa le smentirebbe
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
export async function aiCron(env, h) { try { await aiGiro(env, h, PER_GIRO); } catch (e) { try { await h.kvSet(env, "ai:err", { at: new Date().toISOString(), msg: String((e && e.message) || e).slice(0, 300) }); } catch (_) {} } }

async function voci(env, ore) {
  await tabella(env);
  const da = new Date(Date.now() - Math.max(1, Math.min(168, ore || 36)) * 3600e3).toISOString();
  return (await env.DB.prepare("SELECT link, fonte, titolo, sito, data FROM ai_voci WHERE data >= ?1 ORDER BY data DESC LIMIT 3000").bind(da).all()).results || [];
}
const jp = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
/* una raccolta come stringa JSON pronta ("[...]"), costruita dal database: il Worker non la legge */
async function raw(env, type, lim = 400, order = "key DESC", expr = "json_set(data,'$.id',key,'$._agg',updated_at)") {
  const r = await env.DB.prepare(`SELECT '[' || coalesce(group_concat(o, ','), '') || ']' AS j FROM (SELECT ${expr} AS o FROM rdocs WHERE type=?1 ORDER BY ${order} LIMIT ?2)`).bind(type, lim).first();
  return (r && r.j) || "[]";
}
async function coll(env, type, lim = 400) { return ((await env.DB.prepare("SELECT key, data, updated_at FROM rdocs WHERE type=?1 ORDER BY key DESC LIMIT ?2").bind(type, lim).all()).results || []).map((r) => ({ id: r.key, ...jp(r.data, {}), _agg: r.updated_at })); }

/* per le routine (token): GET /v1/ia/voci?ore=36 */
export async function aiRoute(request, env, p, method, url, h) {
  if (!h.authorized(request, env)) return h.fail(401, "unauthorized");
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
    const [tesi, adozione, approf, casi, attori, confronti, filoni, agenda, glossario, clienti, temi, prezzi, temiStorie] = await Promise.all([
      raw(env, "ai_tesi", 60, ORD), raw(env, "ai_adozione", 40), raw(env, "ai_approf", 80, "key DESC", "json_set(json_remove(data,'$.sezioni'),'$.id',key,'$._agg',updated_at,'$.n_sezioni',coalesce(json_array_length(data,'$.sezioni'),0))"),
      raw(env, "ai_casi", 600, "key DESC", "json_object('id',key,'chi',data->>'$.chi','settore',data->>'$.settore','settore_norm',data->>'$.settore_norm','paese',data->>'$.paese','area',data->>'$.area','tecnologia',data->>'$.tecnologia','modello',data->>'$.modello','cloud',data->>'$.cloud','deploy',data->>'$.deploy','partner',data->>'$.partner','stadio',data->>'$.stadio','cosa',data->>'$.cosa','dato',data->>'$.dato','misura',data->>'$.misura','data',data->>'$.data','iso',data->>'$.iso','chi_lo_dice',data->'$.chi_lo_dice','fonte',data->'$.fonte')"),
      raw(env, "ai_attori", 40, ORD), raw(env, "ai_confronti", 20, ORD), raw(env, "ai_filoni", 300, "coalesce(data->>'$.aggiornato', updated_at) DESC"),
      raw(env, "ai_agenda", 400, "coalesce(data->>'$.data', '9999'), key"),
      coll(env, "ai_glossario", 2000),
      env.DB.prepare("SELECT key, data->>'$.nome' nome, coalesce(data->>'$.settore', data->>'$.cluster', '') settore, data->>'$.sottocluster' sc, coalesce(data->'$.aree','{}') aree, coalesce(json_array_length(data,'$.eventi'),0) n FROM rdocs WHERE type='ai_clienti' ORDER BY key DESC LIMIT 80").all().then((r) => r.results || []),
      raw(env, "ai_temi", 20), raw(env, "ai_prezzi", 60, "key DESC"),
      env.DB.prepare("SELECT '[' || coalesce(group_concat(o, ','), '') || ']' AS j FROM (SELECT json_object('ed', r.key, 'i', CAST(j.key AS INTEGER), 'titolo', coalesce(j.value->>'$.titolo', j.value->>'$.breve', ''), 'tema_id', j.value->>'$.tema_id', 'tema', j.value->>'$.tema') AS o FROM rdocs r, json_each(r.data, '$.letture') j WHERE r.type='ai_oggi' AND r.key >= ?1 ORDER BY r.key DESC)").bind(cut30).first().then((r) => (r && r.j) || "[]")]);
    /* glossario: in quali letture delle ultime edizioni compare ogni voce (termine o alias, parola intera) */
    const testi = []; for (const e of edz) (e.letture || []).forEach((l, i) => testi.push({ data: e.id, i, breve: l.breve || l.titolo || "", t: JSON.stringify([l.titolo, l.breve, l.perche_breve, l.due_righe, l.perche_conta, l.fatti, l.lettura, l.diversa, l.come_funziona, l.pro, l.contro, l.sintesi]) }));
    const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const gl = glossario.map((g) => { const T = [g.termine, ...(Array.isArray(g.alias) ? g.alias : [])].filter((x) => x && String(x).length > 2); let st = [];
      if (T.length && testi.length) { try { const re = new RegExp("(^|[^\\p{L}\\p{N}])(" + T.map((x) => reEsc(String(x))).join("|") + ")(?=$|[^\\p{L}\\p{N}])", "u"); st = testi.filter((x) => re.test(x.t)).slice(0, 12).map(({ data, i, breve }) => ({ data, i, breve })); } catch (e) {} }
      const { _agg, ...r } = g; return { ...r, storie: st }; });
    const tocchi = {}; for (const e of edz) for (const c of e.clienti || []) for (const n of c.clienti || []) (tocchi[n] = tocchi[n] || []).push({ data: e.id, testo: c.testo, perche: c.perche, tesi: c.tesi || null });
    const stato = (await h.kvGet(env, K_STATO)) || {};
    const c360 = new Set(pub ? [] : ((await env.DB.prepare("SELECT key FROM rdocs WHERE type='ai_c360'").all()).results || []).map((r) => r.key));
    const base = { ok: true, privato: !pub, oggi: h.romeToday(), edizione: oggi, edizioni: edz.map((e) => ({ id: e.id, frase: e.frase || "", titolo: e.titolo || "" })), livelli: AI_LIVELLI, glossario: gl, aree: AI_AREE, tecnologie: AI_TECNOLOGIE, capacita: AI_CAPACITA,
      clienti: pub ? [] : clienti.map((c) => ({ id: c.key, nome: c.nome, settore: c.settore, sc: c.sc || null, aree: jp(c.aree, {}), n_eventi: c.n, tocchi: (tocchi[c.nome] || []).slice(0, 8), v360: c360.has(c.key) })),
      fonti: { totale: AI_FONTI.length, ok: AI_FONTI.filter((f) => stato[f.id] && stato[f.id].ok).length, provate: Object.keys(stato).length } };
    const s = JSON.stringify(base).slice(0, -1) + `,"tesi":${tesi},"adozione":${adozione},"approf":${approf},"casi":${casi},"attori":${attori},"confronti":${confronti},"filoni":${filoni},"agenda":${agenda},"temi":${temi},"prezzi":${prezzi},"temi_storie":${temiStorie}}`;
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
  if (b.action === "ai_approf") { const r = await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_approf' AND key=?1").bind(String(b.id || "")).first(); return { ok: !!r, approf: r ? jp(r.data, null) : null }; }
  if (b.action === "ai_fonti") {
    const stato = (await h.kvGet(env, K_STATO)) || {}; await tabella(env);
    const n = ((await env.DB.prepare("SELECT fonte, count(*) n FROM ai_voci GROUP BY fonte").all()).results || []).reduce((o, r) => ((o[r.fonte] = r.n), o), {});
    return { ok: true, gruppi: AI_GRUPPI, fonti: AI_FONTI.map((f) => ({ id: f.id, nome: f.nome, gruppo: f.gruppo, titoli: n[f.id] || 0, ...(stato[f.id] || { mai: true }) })) };
  }
  return null;
}
