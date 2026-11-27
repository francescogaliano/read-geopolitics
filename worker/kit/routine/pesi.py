#!/usr/bin/env python3
"""Calcolo dei pesi A/B di una dinamica dal bilancio delle prove (metodo: pesi.md).

Uso:
  python3 /tmp/routine/pesi.py tesi.json            # stampa il calcolo, non scrive nulla
  python3 /tmp/routine/pesi.py tesi.json --scrivi   # aggiorna "peso" e "calcolo" nel file

tesi.json puo' essere un documento ai_tesi (con "dinamiche") oppure una singola dinamica.
Ogni prova deve avere: tipo, diag, livello, data, origine, forza, debolezza, ragionamento.
Contano le prove in "prove" (le 3 mostrate) e in "archivio" (le altre): nessuna si butta, l'eta' ne riduce il peso.
Le schede sono congelate: se una cambia rispetto al calcolo precedente serve una voce in "revisioni" di oggi.
Calcola anche la forchetta (quanto la stima dipende dai diag), la lettura a parole e la solidita' della base.
Con --scrivi aggiunge una riga a "storico_pesi" quando il peso cambia, con la prova che l'ha spostato.
Se manca qualcosa lo script si ferma e dice cosa: il peso non si inventa.
"""
import json, math, sys, datetime, random, hashlib

DIAG = {1: 1.0, 1.5: 1.5, 2: 2.0, 3: 3.0, 5: 5.0}
TIPO = {"misurato": 1.0, "calcolo": 0.7, "inferito": 0.4}
LIVELLO = {"primaria": 1.0, "testata": 0.8, "secondaria": 0.6}
SCALA = [1.0, 1.5, 2.0, 3.0, 5.0]
GIRI = 4000  # ricalcoli con i diag spostati di un gradino, per la forchetta
CAMPI = ("tipo", "diag", "livello", "data", "origine", "forza", "debolezza", "ragionamento")


def eta(data, oggi):
    """Calo graduale: il peso di una prova si dimezza ogni 6 mesi (minimo 0,1)."""
    try:
        p = [int(x) for x in str(data)[:10].split("-")]
        d = datetime.date(p[0], p[1] if len(p) > 1 else 6, p[2] if len(p) > 2 else 15)
    except Exception:
        raise ValueError(f"data non leggibile: {data!r} (serve AAAA-MM o AAAA-MM-GG)")
    mesi = max(0.0, (oggi - d).days / 30.4)
    return max(0.1, 0.5 ** (mesi / 6))


def chiave(p):
    return ((p.get("fonte") or {}).get("url") or "") + "|" + str(p.get("testo", ""))[:60]


def impronta(p):
    return "|".join(str(p.get(c, "")) for c in ("tipo", "diag", "livello", "data", "origine"))


def calcola(din, oggi):
    errori, voci, schede = [], [], {}
    prima = ((din.get("calcolo") or {}).get("schede")) or {}
    for ip in din.get("ipotesi", []):
        verso = 1 if ip.get("id") == "A" else -1
        for i, p in enumerate(list(ip.get("prove", [])) + list(ip.get("archivio", []))):
            nome = f"{ip.get('id')} «{str(p.get('testo', ''))[:50]}»"
            manca = [c for c in CAMPI if p.get(c) in (None, "")]
            if manca:
                errori.append(f"{nome}: mancano {', '.join(manca)}"); continue
            try:
                dg = float(p["diag"])
                if dg not in DIAG: raise ValueError(f"diag {p['diag']} non ammesso (1, 1.5, 2, 3, 5)")
                if p["tipo"] not in TIPO: raise ValueError(f"tipo {p['tipo']!r} non ammesso ({', '.join(TIPO)})")
                if p["livello"] not in LIVELLO: raise ValueError(f"livello {p['livello']!r} non ammesso ({', '.join(LIVELLO)})")
                c = verso * math.log(DIAG[dg]) * TIPO[p["tipo"]] * LIVELLO[p["livello"]] * eta(p["data"], oggi)
            except ValueError as e:
                errori.append(f"{nome}: {e}"); continue
            k, imp = chiave(p), impronta(p)
            schede[k] = imp
            if k in prima and prima[k] != imp and not any(r.get("data") == oggi.isoformat() for r in p.get("revisioni") or []):
                errori.append(f"{nome}: scheda cambiata ({prima[k]} -> {imp}) senza una voce in \"revisioni\" di oggi {{data, prima, motivo}}")
            voci.append({"prova": nome, "k": k, "ip": ip.get("id"), "origine": str(p["origine"]).strip().lower(), "c": c,
                         "dg": dg, "fisso": verso * TIPO[p["tipo"]] * LIVELLO[p["livello"]] * eta(p["data"], oggi), "lv": p["livello"]})
    if errori:
        return None, errori
    # indipendenza: prove con la stessa fonte d'origine, sulla stessa ipotesi, contano una volta (la piu' forte).
    # Due prove della stessa origine su ipotesi opposte contano entrambe: dicono cose diverse.
    tenute = {}
    for v in voci:
        k = (v["ip"], v["origine"])
        if k not in tenute or abs(v["c"]) > abs(tenute[k]["c"]):
            tenute[k] = v
    T = list(tenute.values())
    scartate = [v["prova"] for v in voci if tenute.get((v["ip"], v["origine"])) is not v]
    s = sum(v["c"] for v in T)
    grezzo = 100 / (1 + math.exp(-s))
    pa = int(min(95, max(5, 5 * round(grezzo / 5))))
    lo, hi = forchetta(T, din.get("meccanismo", ""))
    n = len({v["origine"] for v in T})
    prim = sum(v["lv"] == "primaria" for v in T) / len(T) if T else 0
    return {
        "peso_A": pa,
        "punteggio": round(s, 2),
        "forchetta": [lo, hi],
        "lettura": lettura(lo, hi),
        "solidita": {"livello": solidita(n, prim, hi - lo), "origini": n, "primarie": round(100 * prim)},
        "contributi": [{"prova": v["prova"], "k": v["k"], "c": round(v["c"], 2)} for v in sorted(T, key=lambda v: -abs(v["c"]))],
        "non_contate": scartate,
        "schede": schede,
        "data": oggi.isoformat(),
    }, []


def forchetta(T, seme):
    """Quanto cambia la stima se ogni diag fosse un gradino piu' su o piu' giu' (probabilita' 1/4 ciascuno).
    I diag sono giudizi: la forchetta dice quanto la percentuale dipende da quei giudizi. 10o-90o percentile, A in %."""
    if not T:
        return [50, 50]
    rnd = random.Random(hashlib.sha256((seme + "|" + "|".join(sorted(v["k"] for v in T))).encode()).hexdigest())
    out = []
    for _ in range(GIRI):
        tot = 0.0
        for v in T:
            i = SCALA.index(v["dg"]); r = rnd.random()
            i = max(0, i - 1) if r < .25 else min(len(SCALA) - 1, i + 1) if r > .75 else i
            tot += math.log(SCALA[i]) * v["fisso"]
        out.append(100 / (1 + math.exp(-tot)))
    out.sort()
    return [int(round(out[int(.1 * GIRI)])), int(round(out[int(.9 * GIRI)]))]


def lettura(lo, hi):
    """La stima a parole, dalla forchetta: si dice 'probabile' solo se tutta la forchetta sta da una parte."""
    if lo >= 80: return {"testo": "molto probabile", "verso": "A"}
    if lo >= 55: return {"testo": "probabile", "verso": "A"}
    if lo > 50: return {"testo": "pende verso", "verso": "A"}
    if hi <= 20: return {"testo": "molto probabile", "verso": "B"}
    if hi <= 45: return {"testo": "probabile", "verso": "B"}
    if hi < 50: return {"testo": "pende verso", "verso": "B"}
    return {"testo": "in bilico", "verso": None}


def solidita(n, prim, largh):
    """Quanto e' solida la base, separata da quanto e' probabile: origini indipendenti, quota di fonti primarie, larghezza della forchetta."""
    if n >= 8 and prim >= .5 and largh <= 20: return "alta"
    if n >= 5 and largh <= 30: return "media"
    return "bassa"


def spinta(vecchio, nuovo):
    """La prova che ha spostato di piu' il punteggio rispetto al calcolo precedente.
    Le prove si riconoscono dalla chiave stabile (url|testo), non dal nome mostrato."""
    V = (vecchio or {}).get("contributi") or []
    if not V or any("k" not in c for c in V):
        return {"stato": "ricalcolo"}  # primo calcolo o calcolo di una versione precedente: nessun confronto affidabile
    a = {c["k"]: c for c in V}
    b = {c["k"]: c for c in nuovo.get("contributi", [])}
    diff = {k: (b[k]["c"] if k in b else 0) - (a[k]["c"] if k in a else 0) for k in set(a) | set(b)}
    k = max(diff, key=lambda x: abs(diff[x]))
    stato = "nuova" if k not in a else "uscita" if k not in b else "invecchiata" if abs(b[k]["c"]) < abs(a[k]["c"]) else "rivista"
    ip, _, t = (b.get(k) or a.get(k))["prova"].partition(" ")
    return {"prova": t.strip("«»"), "ipotesi": ip, "stato": stato, "dc": round(diff[k], 2)}


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    path, scrivi = sys.argv[1], "--scrivi" in sys.argv
    doc = json.load(open(path))
    dins = doc["dinamiche"] if "dinamiche" in doc else [doc]
    oggi = datetime.date.today()
    ko = False
    for d in dins:
        r, err = calcola(d, oggi)
        print(f"== {d.get('meccanismo', '?')}")
        if err:
            ko = True
            for e in err: print("  ERRORE", e)
            continue
        vecchio = (d.get("ipotesi") or [{}])[0].get("peso")
        L = r["lettura"]
        print(f"  peso A {vecchio} -> {r['peso_A']}  (punteggio {r['punteggio']:+})  forchetta {r['forchetta'][0]}-{r['forchetta'][1]}  {L['testo']}{' '+L['verso'] if L['verso'] else ''}  solidita {r['solidita']['livello']} ({r['solidita']['origini']} origini, {r['solidita']['primarie']}% primarie)")
        for c in r["contributi"]: print(f"    {c['c']:+.2f}  {c['prova']}")
        for n in r["non_contate"]: print(f"    non contata (stessa origine): {n}")
        if r["peso_A"] == 50: print("  PAREGGIO: peso_perche deve cominciare con «Pareggio:»")
        if scrivi:
            if vecchio != r["peso_A"]:
                st = d.setdefault("storico_pesi", [])
                st.append({"quando": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "da": vecchio, "a": r["peso_A"], **spinta(d.get("calcolo"), r)})
                d["storico_pesi"] = st[-30:]
            d["ipotesi"][0]["peso"] = r["peso_A"]
            if len(d["ipotesi"]) > 1: d["ipotesi"][1]["peso"] = 100 - r["peso_A"]
            d["calcolo"] = r
            d["forchetta"], d["lettura"], d["solidita"] = r["forchetta"], r["lettura"], r["solidita"]
    if scrivi and not ko:
        json.dump(doc, open(path, "w"), ensure_ascii=False, indent=1)
        print("scritto", path)
    sys.exit(2 if ko else 0)


if __name__ == "__main__":
    main()
