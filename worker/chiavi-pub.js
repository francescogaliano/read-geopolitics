/* Pagina esterna delle chiavi di lettura (dal 20/11/2026).
   La pagina non legge mai i dati privati: legge solo una COPIA FILTRATA (kv «pub:chiavi») che contiene
   - solo le chiavi che Francesco ha marcato pubblicabili, una per una;
   - solo i campi elencati qui sotto (un campo nuovo non esce mai da solo);
   - niente simboli di Borsa, niente «chi ci guadagna tra i quotati», niente ipotesi sui prezzi, niente note e codici interni.
   I nomi di società restano solo come soggetti di fatti con fonte; le soglie sulle materie prime solo come condizione di smentita.
   Un testo libero che contiene parole da consiglio d'investimento viene TRATTENUTO (non entra nella copia) e segnalato nel pannello. */

export const PUB_KV = "pub:chiavi", PUB_TOKEN_KV = "pub:chiavi:token", PUB_CFG_KV = "pub:chiavi:cfg";
export const VERDETTI = ["aperta", "confermata", "smentita", "dormiente"];
const VERT = { en: "Energia e materie prime", te: "Tecnologia", di: "Industria", tr: "Trasporti", altro: "Altro" };
const VIETATE = /\b(quotat[aeio]|ticker|simbol[oi] di borsa|in borsa|azionist[ai]|investitor[ei]|conviene (comprare|vendere|investire)|comprare (il titolo|le azioni|azioni)|vendere (il titolo|le azioni|azioni)|al rialzo|al ribasso|prezzo obiettivo|target price|portafogli[oi]|scommett\w*|specula\w*)\b/i;
const giorni = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const slugP = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const isData = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "");

/* REGOLA DEI VERDETTI (approvata il 20/11/2026), senza prezzi di società o fondi.
   Qui solo la parte che si può calcolare: è una PROPOSTA, il verdetto vale quando Francesco lo approva.
   - smentita: i fatti contro indipendenti sono almeno 3 e pari o più di quelli a favore; oppure la soglia su una materia
     prima è superata per la durata scritta nella chiave (soglia.durata, in rilevazioni; 10 se la chiave non la indica);
   - dormiente: nessun fatto nuovo da 90 giorni, e mai finché c'è una data futura in «Da osservare».
   «Confermata» e «smentita perché la condizione si è verificata» le propone la routine (campo verdetto_proposto):
   servono un fatto con data e fonte, e per la conferma una conseguenza attesa diventata visibile, saldo almeno +3, 30 giorni di vita. */
export function verdettoMeccanico(k, oggi, serie) {
  const F = k.fatti || [], fav = F.filter((f) => f.verso > 0).length, con = F.filter((f) => f.verso < 0).length;
  if (con >= 3 && con >= fav) return { stato: "smentita", motivo: "I fatti contro (" + con + ") sono pari o più di quelli a favore (" + fav + ")." };
  const sg = k.soglia, p = sg && serie ? serie(sg) : null;
  if (sg && p && p.length) { const n = Math.max(1, +sg.durata || 10), ult = p.slice(-n); if (ult.length >= n && ult.every((x) => (sg.verso === "sotto" ? x[1] < sg.valore : x[1] > sg.valore))) return { stato: "smentita", motivo: "La soglia è superata da " + n + " rilevazioni di fila (dal " + ult[0][0].split("-").reverse().join("/") + ")." }; }
  const ultimo = F.map((f) => f.aggiunto || f.data).sort().pop() || k.creata || oggi;
  const futura = (k.osservare || []).some((o) => isData(o.quando) && o.quando >= oggi);
  if (giorni(ultimo, oggi) >= 90 && !futura) return { stato: "dormiente", motivo: "Nessun fatto nuovo da " + giorni(ultimo, oggi) + " giorni." };
  return null;
}
export const andamento = (k, oggi) => { const s = (k.fatti || []).filter((f) => giorni(f.aggiunto || f.data, oggi) <= 30).reduce((a, f) => a + f.verso, 0); return s > 0 ? "si rafforza" : s < 0 ? "si indebolisce" : "stabile"; };

/* numeri pubblicabili della verticale Energia (la serie CBAM non è inclusa: è un valore fisso per lunghi periodi) */
const NUM_PUB = ["ttf", "gnl", "el_nord", "stor_ue", "stor_it", "stor_de", "brent", "gasolio_it"], NUM_OGGI = ["ttf", "stor_ue", "el_nord"];
const COL = { en: "en", te: "te", di: "di", tr: "tr", altro: "al" };
const piu = (d, n) => new Date(Date.parse(d + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
const httpsOk = (u) => /^https:\/\//.test(u || "");
function numPub(k, x) { // serie degli ultimi 45 punti con una nota calcolata (mai scritta a mano)
  const p = (x.p || []).slice(-45); if (!p.length) return null; const l = p[p.length - 1], u30 = p.filter((q) => q[0] >= piu(l[0], -30));
  let mx = u30[0], mn = u30[0]; for (const q of u30) { if (q[1] > mx[1]) mx = q; if (q[1] < mn[1]) mn = q; }
  const perc = x.u === "%", f = (v) => (Math.abs(v) >= 100 ? v.toFixed(1) : v.toFixed(2)).replace(".", ",");
  let nota = "";
  if (u30.length >= 4) { if (l[0] === mx[0]) nota = "massimo degli ultimi 30 giorni"; else if (l[0] === mn[0]) nota = "minimo degli ultimi 30 giorni"; else nota = perc ? f(l[1] - mx[1]).replace("-", "−") + " punti dal massimo del " + mx[0] : (((l[1] / mx[1]) - 1) * 100).toFixed(0).replace("-", "−") + "% dal massimo del " + mx[0]; }
  return { k, nome: String(x.n || "").replace(/\s*\(ACER\)/, ""), unita: x.u, p, valore: l[1], data: l[0], nota, nota_data: l[0] === mx[0] || l[0] === mn[0] ? "" : mx[0] };
}
/* tutto ciò che la pagina mostra oltre alle chiavi: numeri, date, atti, verifiche in calendario, fatti in osservazione, metodo */
export function extraPubblico(chiavi, pubbliche, e, oggi) {
  const ver = (e && e.ver) || {}, N = ver.numeri || {}, slugDi = new Map(pubbliche.map((k) => [k._id, k]));
  const numeri = NUM_PUB.map((k) => N[k] && numPub(k, N[k])).filter(Boolean);
  const perAgenda = new Map(); // data dell'agenda → chiave che l'ha messa in «Da osservare»
  for (const k of chiavi) if (k.pubblica === true) for (const o of k.osservare || []) if (o.agenda_id) perAgenda.set(String(o.agenda_id), slugDi.get(k.id));
  const lk = (k) => (k ? { chiave: k.titolo, slug: k.slug } : {});
  const agenda = (ver.agenda || []).filter((a) => a && a.cosa && a.fonte && httpsOk(a.fonte.url)).map((a) => ({ data: a.data, data_fine: a.data_fine || "", cosa: String(a.cosa), ufficiale: a.stato === "ufficiale", fonte: { nome: String(a.fonte.nome || "fonte").slice(0, 60), url: a.fonte.url }, ...lk(perAgenda.get(String(a.id))) }));
  const atti = (ver.atti || []).filter((a) => a && a.testo && a.fonte && httpsOk(a.fonte.url)).map((a) => ({ data: a.data, testo: String(a.testo), ente: String(a.ente || ""), scadenza: a.scadenza || "", fonte: { nome: String(a.fonte.nome || "atto").slice(0, 60), url: a.fonte.url } }));
  const sett = agenda.filter((a) => a.data <= piu(oggi, 10)).map((a) => ({ data: a.data, cosa: a.cosa, nota: a.ufficiale ? a.fonte.nome : "data da confermare", chiave: a.chiave, slug: a.slug }));
  for (const k of pubbliche) for (const o of k.osservare) if (isData(o.quando) && o.quando >= oggi && o.quando <= piu(oggi, 10) && !sett.some((x) => x.slug === k.slug && x.data === o.quando)) sett.push({ data: o.quando, cosa: o.testo, nota: "", chiave: k.titolo, slug: k.slug });
  sett.sort((a, b) => a.data.localeCompare(b.data));
  const verifiche = [];
  for (const k of pubbliche) for (const r of k.ripercussioni) { if (!(r.stato === "attesa" || r.visibile_dal) || !isData(r.entro)) continue; verifiche.push({ entro: r.entro, testo: r.testo, dato: r.dato, dal: r.dal, chiave: k.titolo, slug: k.slug, esito: r.visibile_dal ? "vista" : r.entro < oggi ? "non vista" : "aperta", visibile_dal: r.visibile_dal || "" }); }
  verifiche.sort((a, b) => a.entro.localeCompare(b.entro));
  const soglie = pubbliche.filter((k) => k.soglia).map((k) => ({ chiave: k.titolo, slug: k.slug, smentita: k.smentita, ...k.soglia }));
  const F = (e && e.fatti) || [], vivi = F.filter((f) => !f.superato_da), inCh = vivi.filter((f) => f.chiave_id && slugDi.has(f.chiave_id));
  const oss = ((e && e.sciolti) || []).filter((f) => (f.fonti || []).some((q) => httpsOk(q.url)) && !VIETATE.test(f.testo || "")).slice(0, 12).map((f) => ({ data: f.data, testo: String(f.testo), fonti: f.fonti.filter((q) => httpsOk(q.url)).slice(0, 2).map((q) => ({ nome: String(q.nome || "fonte").slice(0, 60), url: q.url })) }));
  return { oggi: NUM_OGGI.map((k) => numeri.find((n) => n.k === k)).filter(Boolean).map((n) => ({ nome: n.nome, unita: n.unita, valore: n.valore, data: n.data, nota: n.nota, nota_data: n.nota_data })),
    settimana: sett.slice(0, 8), settimana_altre: Math.max(0, sett.length - 8), verifiche, osservazione: oss,
    energia: { numeri, agenda: agenda.slice(0, 40), atti: atti.slice(0, 30), soglie },
    metodo: { fatti: inCh.length + oss.length, in_chiavi: inCh.length, in_osservazione: oss.length, atti: (e && e.n_atti) || atti.length, date: (e && e.n_date) || agenda.length, date_ufficiali: (e && e.n_date_uff) || agenda.filter((a) => a.ufficiale).length, serie: numeri.length, dal: pubbliche.map((k) => k.dal).filter(Boolean).sort()[0] || "" } };
}

/* la copia filtrata: SOLO questi campi. Restituisce anche i testi trattenuti, per il pannello. */
export function copiaPubblica(chiavi, oggi, cfg, extra) {
  const trattenuti = [], out = [];
  const ok = (id, campo, t) => { const s = String(t || "").trim(); if (!s) return ""; if (VIETATE.test(s)) { trattenuti.push({ id, campo, parola: (s.match(VIETATE) || [""])[0] }); return ""; } return s; };
  for (const k of chiavi || []) {
    if (k.pubblica !== true) continue;
    const id = k.id, F = (k.fatti || []).filter((f) => !f.superato_da && (f.fonti || []).some((q) => /^https:\/\//.test(q.url || "")));
    const v = k.verdetto && VERDETTI.includes(k.verdetto.stato) ? k.verdetto : { stato: "aperta" };
    const rip = (k.ripercussioni || []).map((r, i) => ({ ...(r.visibile_dal ? { visibile_dal: r.visibile_dal } : {}), stato: r.stato, testo: ok(id, "ripercussione " + (i + 1), r.testo), base: ok(id, "ripercussione " + (i + 1), r.base), dato: ok(id, "ripercussione " + (i + 1), r.dato), entro: String(r.entro || "").slice(0, 40), dal: r.dal || "" })).filter((r) => r.testo);
    const toc = k.toccati ? { pressione: ok(id, "chi è toccato", k.toccati.perde), spazio: ok(id, "chi è toccato", k.toccati.guadagna) } : null;
    const sn = k.soglia && extra && extra.ver && extra.ver.numeri && NUM_PUB.includes(k.soglia.num) ? extra.ver.numeri[k.soglia.num] : null;
    out.push({
      _id: id, colore: COL[k.settore] || "al", soglia: sn ? { nome: String(sn.n || "").replace(/\s*\(ACER\)/, ""), unita: sn.u, verso: k.soglia.verso, valore: k.soglia.valore, durata: k.soglia.durata || 10, p: sn.p.slice(-60) } : null,
      slug: slugP(k.nome), titolo: String(k.nome || ""), verticale: VERT[k.settore] || "Altro", tesi: ok(id, "tesi", k.tesi),
      stato: v.stato, stato_dal: v.dal || "", stato_motivo: v.stato === "aperta" ? "" : ok(id, "motivo del verdetto", v.motivo), andamento: v.stato === "aperta" ? andamento(k, oggi) : "",
      dal: k.creata || "", aggiornata: k.aggiornata || "",
      porta: ok(id, "dove porta", k.porta), ripercussioni: rip, toccati: toc && (toc.pressione || toc.spazio) ? toc : null,
      osservare: (k.osservare || []).map((o, i) => ({ quando: String(o.quando || ""), testo: ok(id, "da osservare " + (i + 1), o.testo), senso: ok(id, "da osservare " + (i + 1), o.senso) })).filter((o) => o.testo),
      catena: (k.catena || []).map((c, i) => ok(id, "catena " + (i + 1), c)).filter(Boolean),
      racconto: ok(id, "racconto per l'esterno", k.racconto_pubblico),
      smentita: ok(id, "cosa la farebbe cadere", k.smentita), smentita_del: k.smentita_del || k.creata || "", smentita_prec: (k.smentita_prec || []).map((s) => ({ testo: ok(id, "smentita precedente", s.testo), dal: s.dal || "", fino: s.fino || "" })).filter((s) => s.testo),
      favore: F.filter((f) => f.verso > 0).length, contro: F.filter((f) => f.verso < 0).length, fonti: new Set(F.flatMap((f) => (f.fonti || []).map((q) => { try { return new URL(q.url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } })).filter(Boolean)).size,
      fatti: F.slice().sort((a, b) => b.data.localeCompare(a.data)).map((f) => ({ data: f.data, verso: f.verso > 0 ? 1 : -1, testo: String(f.testo || ""), fonti: (f.fonti || []).filter((q) => /^https:\/\//.test(q.url || "")).slice(0, 3).map((q) => ({ nome: String(q.nome || "fonte").slice(0, 60), url: q.url })) })),
    });
  }
  const conteggio = Object.fromEntries(VERDETTI.map((s) => [s, out.filter((k) => k.stato === s).length]));
  const c = cfg || {}, ex = extra ? extraPubblico(chiavi || [], out, extra, oggi) : {};
  for (const k of out) delete k._id;
  return { copia: { costruita: Date.now(), ...ex, aggiornata: oggi, nome: String(c.nome || "").slice(0, 60), contatto: /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(c.contatto || "") ? c.contatto : "", conteggio, chiavi: out }, trattenuti };
}
