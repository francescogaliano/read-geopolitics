/* Rassegna: riconoscimento di paesi, città, persone e organizzazioni nei titoli, e raggruppamento per storia (dal 17/11/2026).
   I nomi propri sono uguali in tutte le lingue: «Trump e Xi a Shenzhen» e «Trump and Xi meet in Shenzhen» finiscono nella stessa storia.
   Fonti dei nomi: rassegna-luoghi.js (paesi e città) e il glossario del sito (persone, organizzazioni, luoghi, sigle). */
import { RS_PAESI, RS_CITTA } from "./rassegna-luoghi.js";

export const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set("della dello delle degli dalla dalle nella nelle sulla sulle alla alle anche come dopo prima perche questo questa sono stato stata essere hanno ancora contro senza verso oltre tutti tutte dice dicono with from that this have will about after over into their they what when where which while more than been says said amid news live update updates video watch report reports could would should first last years year week day days told tells new old just after under major".split(" "));
const CORTE = new Set(["xi", "ue", "eu", "un", "g7", "g20", "aiea", "iaea", "onu", "bce", "ecb", "fmi", "imf", "oms", "who"]);

let BASE = null;
function base() {
  if (BASE) return BASE;
  const M = new Map();
  for (const [nomi, iso, lon, lat] of RS_CITTA) for (const n of nomi) if (!M.has(n)) M.set(n, { k: "c:" + nomi[0], iso, ll: [lon, lat] }); // prima le città: le capitali portano anche le coordinate
  for (const [iso, nomi] of Object.entries(RS_PAESI)) for (const n of nomi) if (!M.has(n)) M.set(n, { k: "p:" + iso, iso });
  return (BASE = M);
}
/* indice completo: base + glossario (persone, organizzazioni, luoghi, sigle; non i termini generici) */
export function rsIndice(gloss) {
  const M = new Map(base());
  for (const [key, tipo, nomi] of gloss || []) {
    if (tipo === "termine") continue;
    for (const x of nomi || []) { const n = norm(x); if (!n || (n.length < 4 && !CORTE.has(n)) || STOP.has(n)) continue; if (!M.has(n)) M.set(n, { k: "g:" + key, tipo }); }
  }
  let maxN = 1; for (const n of M.keys()) maxN = Math.max(maxN, n.split(" ").length);
  return { M, maxN: Math.min(maxN, 5) };
}
export function rsEntita(titolo, I) {
  // parole del titolo con la maiuscola originale: una città vale solo se scritta con la maiuscola («salta» non è Salta)
  const raw = String(titolo || "").split(/[^\p{L}\p{N}]+/u).filter(Boolean), t = [], cap = [];
  for (const w of raw) { const n = norm(w); if (!n) continue; for (const x of n.split(" ")) { t.push(x); cap.push(/^\p{Lu}/u.test(w)); } }
  const out = [];
  for (let i = 0; i < t.length; i++) {
    for (let n = Math.min(I.maxN, t.length - i); n >= 1; n--) {
      const h = I.M.get(t.slice(i, i + n).join(" "));
      if (h && !(h.ll && !cap[i])) { out.push(h); i += n - 1; break; }
    }
  }
  const s = String(titolo || "");
  if (/(^|[^A-Za-z])U\.?S\.?A?([^A-Za-z]|$)/.test(s)) out.push({ k: "p:USA", iso: "USA" });
  if (/(^|[^A-Za-z])U\.?K\.?([^A-Za-z]|$)/.test(s)) out.push({ k: "p:GBR", iso: "GBR" });
  if (/(^|[^A-Za-z])(EU|UE)([^A-Za-z]|$)/.test(s)) out.push({ k: "g:ue", tipo: "sigla" });
  return out;
}
export const parole = (t) => new Set(norm(t).split(" ").filter((w) => w.length > 3 && !STOP.has(w)));

/* raggruppamento: entra in una storia il titolo che ne condivide i nomi propri principali
   (2 nomi, oppure 1 nome e un terzo delle parole) o, senza nomi, metà delle parole nella stessa lingua */
export function raggruppa(items) {
  const G = [], byE = new Map(), byK = new Map();
  for (const it of items) {
    const E = new Set(it.ent.flatMap((h) => (h.iso && h.k[0] === "c" ? [h.k, "p:" + h.iso] : [h.k]))), K = it.K;
    const cand = new Set();
    for (const e of E) for (const g of byE.get(e) || []) cand.add(g);
    for (const w of K) if (w.length > 4) for (const g of byK.get(w) || []) cand.add(g);
    let best = null, bs = 0;
    for (const g of cand) {
      const soglia = Math.max(1, Math.ceil(g.n * 0.3));
      let e = 0, enc = 0; for (const x of E) if ((g.ec.get(x) || 0) >= soglia) { e++; if (x[0] !== "p") enc++; }
      let k = 0; for (const w of K) if (g.K.has(w)) k++;
      const kw = K.size ? k / K.size : 0;
      // due paesi da soli non bastano (Stati Uniti e Iran compaiono in molte storie diverse): serve un nome più preciso o parole in comune
      const ok = e >= 3 || (e === 2 && (enc >= 1 || kw >= 0.15)) || (e === 1 ? kw >= 0.3 : kw >= 0.6 && g.lingua === it.lingua);
      const sc = e + kw * 2;
      if (ok && sc > bs) { bs = sc; best = g; }
    }
    if (!best) { best = { n: 0, ec: new Map(), K: new Set(), voci: [], lingua: it.lingua }; G.push(best); }
    best.n++; best.voci.push(it);
    for (const x of E) { best.ec.set(x, (best.ec.get(x) || 0) + 1); if (!byE.has(x)) byE.set(x, new Set()); byE.get(x).add(best); }
    for (const w of K) { if (best.K.size < 400) best.K.add(w); if (w.length > 4) { if (!byK.has(w)) byK.set(w, new Set()); byK.get(w).add(best); } }
  }
  return G;
}
/* dove succede: il paese più citato nei titoli (Stati Uniti a metà peso: compaiono in molte storie come attore), con la città se c'è */
export function luogo(g) {
  const P = new Map(), C = new Map();
  for (const it of g.voci) {
    const visti = new Set();
    for (const h of it.ent) if (h.iso && !visti.has(h.iso)) { visti.add(h.iso); P.set(h.iso, (P.get(h.iso) || 0) + (h.iso === "USA" ? 0.5 : 1)); }
    for (const h of it.ent) if (h.ll) { const c = C.get(h.k) || { n: 0, iso: h.iso, ll: h.ll }; c.n++; C.set(h.k, c); P.set(h.iso, (P.get(h.iso) || 0) + 1); } // una città nominata pesa di più: dice dove succede
  }
  const iso = [...P.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!iso) return { iso: null, ll: null };
  const citta = [...C.values()].filter((c) => c.iso === iso[0]).sort((a, b) => b.n - a.n)[0];
  return { iso: iso[0], ll: citta ? citta.ll : null, paesi: [...P.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0]) };
}
