#!/usr/bin/env python3
"""La LETTURA di una chiave (pilota dal 25/11/2026): una domanda, due risposte che si escludono,
le dinamiche come catene di anelli, previsioni brevi con scadenza. Metodo: lettura.md.

Uso:
  python3 /tmp/routine/lettura.py tesi.json            # controlla e stampa, non scrive
  python3 /tmp/routine/lettura.py tesi.json --scrivi   # aggiorna lettura.pende, lettura.calcolo

tesi.json e' un documento ai_tesi con "dinamiche" (schede delle prove: vedi pesi.md) e "lettura".
Il peso unisce le prove di tutte le dinamiche collegate, ogni fonte d'origine conta una volta.
In pagina non si mostra la percentuale: solo da che parte pende e quanto (netta, leggera, equilibrio).
"""
import json, math, sys, os, datetime, hashlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pesi import DIAG, TIPO, LIVELLO, CAMPI, eta, chiave  # stesso metodo dei pesi

STATI = ("ok", "half", "no")


def pende(pa):
    d = abs(pa - 50)
    lato = "A" if pa > 50 else "B" if pa < 50 else ""
    return {"lato": lato, "quanto": "equilibrio" if d < 8 else "leggera" if d < 20 else "netta"}


def contributo(p, verso, oggi):
    return verso * math.log(DIAG[float(p["diag"])]) * TIPO[p["tipo"]] * LIVELLO[p["livello"]] * eta(p["data"], oggi)


def raccogli(doc, L, oggi, errori):
    """Prove di tutte le dinamiche collegate, girate sul lato della lettura."""
    voci = []
    mappa = {m.get("meccanismo"): m.get("A_sostiene", "A") for m in L.get("dinamiche", [])}
    if not mappa and not L.get("prove_extra"):
        errori.append('lettura senza prove: servono lettura.dinamiche [{"meccanismo":…,"A_sostiene":"A"|"B"}] o prove_extra')
    for d in doc.get("dinamiche", []):
        if d.get("meccanismo") not in mappa:
            continue
        a_lato = mappa[d["meccanismo"]]
        for ip in d.get("ipotesi", []):
            lato = a_lato if ip.get("id") == "A" else ("B" if a_lato == "A" else "A")
            verso = 1 if lato == "A" else -1
            for p in list(ip.get("prove", [])) + list(ip.get("archivio", [])):
                manca = [c for c in CAMPI if p.get(c) in (None, "")]
                if manca:
                    errori.append(f"{d['meccanismo']} {ip.get('id')} «{str(p.get('testo',''))[:40]}»: mancano {', '.join(manca)}"); continue
                voci.append({"k": chiave(p), "testo": str(p.get("testo", ""))[:60], "origine": str(p["origine"]).strip().lower(), "c": contributo(p, verso, oggi), "da": d["meccanismo"]})
    for p in L.get("prove_extra", []):  # obiezioni del revisore entrate come prove
        verso = 1 if p.get("lato") == "A" else -1
        manca = [c for c in CAMPI if p.get(c) in (None, "")]
        if manca:
            errori.append(f"prova extra «{str(p.get('testo',''))[:40]}»: mancano {', '.join(manca)}"); continue
        voci.append({"k": chiave(p), "testo": str(p.get("testo", ""))[:60], "origine": str(p["origine"]).strip().lower(), "c": contributo(p, verso, oggi), "da": "extra"})
    tenute = {}
    for v in voci:  # una fonte d'origine conta una volta, anche tra dinamiche diverse
        if v["origine"] not in tenute or abs(v["c"]) > abs(tenute[v["origine"]]["c"]):
            tenute[v["origine"]] = v
    return list(tenute.values()), [v["testo"] for v in voci if tenute.get(v["origine"]) is not v]


def peso(voci):
    s = sum(v["c"] for v in voci)
    return int(min(80, max(20, 5 * round(100 / (1 + math.exp(-s)) / 5)))), s


def impronta(pr):
    return hashlib.sha256(json.dumps([pr.get("testo"), pr.get("lato"), pr.get("scadenza"), pr.get("p")], ensure_ascii=False).encode()).hexdigest()[:12]


def controlla(doc, oggi):
    L, errori = doc.get("lettura") or {}, []
    for c in ("domanda", "frase", "A", "B", "verifica"):
        if not L.get(c):
            errori.append(f"lettura.{c} manca")
    for lato in ("A", "B"):
        h = L.get(lato) or {}
        if not h.get("nome") or not h.get("meccanismo"):
            errori.append(f"lettura.{lato}: servono nome e meccanismo")
        an = h.get("anelli") or []
        if not 2 <= len(an) <= 4:
            errori.append(f"lettura.{lato}: da 2 a 4 anelli")
        for a in an:
            if a.get("stato") not in STATI:
                errori.append(f"anello «{a.get('t')}»: stato {a.get('stato')!r} non ammesso (ok, half, no)")
            if a.get("stato") in ("ok", "half") and not ((a.get("fonte") or {}).get("url") and a.get("dato")):
                errori.append(f"anello «{a.get('t')}»: acceso senza dato e fonte")
    voci, non_contate = raccogli(doc, L, oggi, errori)
    pa, s = peso(voci) if voci else (50, 0.0)
    # stabilita': togliendo una prova alla volta, cambia il verdetto?
    fragile, perno = False, None
    base = pende(pa)
    for i, v in enumerate(voci):
        p2, _ = peso(voci[:i] + voci[i + 1:])
        if pende(p2) != base:
            fragile, perno = True, v["testo"]; break
    # previsioni congelate e scadute
    prima = ((L.get("calcolo") or {}).get("previsioni")) or {}
    for pr in L.get("previsioni", []):
        for c in ("id", "testo", "lato", "creata", "scadenza", "p"):
            if pr.get(c) in (None, ""):
                errori.append(f"previsione {pr.get('id')}: manca {c}")
        if pr.get("id") in prima and prima[pr["id"]] != impronta(pr):
            errori.append(f"previsione {pr['id']}: cambiata dopo la creazione (le previsioni sono congelate)")
        if str(pr.get("scadenza", "9999")) < oggi.isoformat() and pr.get("esito") not in ("si", "no"):
            errori.append(f"previsione {pr.get('id')}: scaduta il {pr.get('scadenza')}, manca l'esito (si/no con fonte)")
        if pr.get("esito") in ("si", "no") and not (pr.get("fonte_esito") or {}).get("url"):
            errori.append(f"previsione {pr.get('id')}: esito senza fonte")
    chiuse = [pr for pr in L.get("previsioni", []) if pr.get("esito") in ("si", "no")]
    brier = round(sum((float(pr["p"]) / 100 - (1 if pr["esito"] == "si" else 0)) ** 2 for pr in chiuse) / len(chiuse), 3) if chiuse else None
    aperte = [pr for pr in L.get("previsioni", []) if pr.get("esito") not in ("si", "no")]
    if not aperte:
        errori.append("nessuna previsione aperta: ogni lettura ne ha sempre almeno una a 2-4 settimane")
    calc = {"peso_A": pa, "punteggio": round(s, 2), "pende": base, "fragile": fragile, "perno": perno,
            "contributi": [{"prova": v["testo"], "da": v["da"], "c": round(v["c"], 2)} for v in sorted(voci, key=lambda v: -abs(v["c"]))],
            "non_contate": non_contate, "previsioni": {pr["id"]: impronta(pr) for pr in L.get("previsioni", []) if pr.get("id")},
            "verifica": {"chiuse": len(chiuse), "brier": brier}, "data": oggi.isoformat()}
    return calc, errori


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    path, scrivi = sys.argv[1], "--scrivi" in sys.argv
    doc = json.load(open(path))
    oggi = datetime.date.today()
    calc, err = controlla(doc, oggi)
    for e in err:
        print("ERRORE", e)
    p = calc["pende"]
    print(f"pende: {p['lato'] or '-'} {p['quanto']}  (peso interno A {calc['peso_A']}, punteggio {calc['punteggio']:+})" + ("  FRAGILE: dipende da «" + str(calc["perno"]) + "»" if calc["fragile"] else ""))
    for c in calc["contributi"]:
        print(f"   {c['c']:+.2f}  [{c['da']}] {c['prova']}")
    v = calc["verifica"]
    print(f"previsioni chiuse: {v['chiuse']}" + (f", Brier {v['brier']}" if v["brier"] is not None else ""))
    if scrivi and not err:
        L = doc["lettura"]
        L["pende"] = calc["pende"] | {"fragile": calc["fragile"]}
        L["calcolo"] = calc
        json.dump(doc, open(path, "w"), ensure_ascii=False, indent=1)
        print("scritto", path)
    sys.exit(2 if err else 0)


if __name__ == "__main__":
    main()
