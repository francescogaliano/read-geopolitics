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
       ai_attori/<id>         i protagonisti (Anthropic, OpenAI, Google…): direzione, scommesse, posizione per capacità, mosse
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
    const edz = await coll(env, "ai_oggi", 60), data = String(b.data || ""), oggi = (data && edz.find((e) => e.id === data)) || edz[0] || null;
    const [tesi, adozione, approf, clienti, casi, attori] = await Promise.all([coll(env, "ai_tesi", 60), coll(env, "ai_adozione", 40), coll(env, "ai_approf", 80), coll(env, "ai_clienti", 80), coll(env, "ai_casi", 600), coll(env, "ai_attori", 40)]);
    const tocchi = {}; for (const e of edz) for (const c of e.clienti || []) for (const n of c.clienti || []) (tocchi[n] = tocchi[n] || []).push({ data: e.id, testo: c.testo, perche: c.perche, tesi: c.tesi || null });
    const stato = (await h.kvGet(env, K_STATO)) || {};
    return { ok: true, oggi: h.romeToday(), edizione: oggi, edizioni: edz.map((e) => ({ id: e.id, frase: e.frase || "" })), tesi: tesi.sort((a, b2) => (a.ordine || 99) - (b2.ordine || 99)), adozione, livelli: AI_LIVELLI, approf: approf.map(({ sezioni, ...r }) => ({ ...r, n_sezioni: (sezioni || []).length })), casi: casi.map((c) => ({ id: c.id, chi: c.chi, settore: c.settore, paese: c.paese, area: c.area, tecnologia: c.tecnologia, modello: c.modello, cloud: c.cloud, deploy: c.deploy, partner: c.partner, stadio: c.stadio, cosa: c.cosa, dato: c.dato, misura: c.misura, data: c.data, fonte: c.fonte })), attori: attori.sort((a, b2) => (a.ordine || 99) - (b2.ordine || 99)), aree: AI_AREE, tecnologie: AI_TECNOLOGIE, capacita: AI_CAPACITA, clienti: clienti.map((c) => ({ id: c.id, nome: c.nome, settore: c.settore || c.cluster || "", tocchi: (tocchi[c.nome] || []).slice(0, 8) })), fonti: { totale: AI_FONTI.length, ok: AI_FONTI.filter((f) => stato[f.id] && stato[f.id].ok).length, provate: Object.keys(stato).length } };
  }
  if (b.action === "ai_approf") { const r = await env.DB.prepare("SELECT data FROM rdocs WHERE type='ai_approf' AND key=?1").bind(String(b.id || "")).first(); return { ok: !!r, approf: r ? jp(r.data, null) : null }; }
  if (b.action === "ai_fonti") {
    const stato = (await h.kvGet(env, K_STATO)) || {}; await tabella(env);
    const n = ((await env.DB.prepare("SELECT fonte, count(*) n FROM ai_voci GROUP BY fonte").all()).results || []).reduce((o, r) => ((o[r.fonte] = r.n), o), {});
    return { ok: true, gruppi: AI_GRUPPI, fonti: AI_FONTI.map((f) => ({ id: f.id, nome: f.nome, gruppo: f.gruppo, titoli: n[f.id] || 0, ...(stato[f.id] || { mai: true }) })) };
  }
  return null;
}
