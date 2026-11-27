#!/usr/bin/env python3
"""Validatore della routine «ai-trend» (dal 27/11/2026).

Uso:
  python3 /tmp/routine/ai-trend.py scheda <file>        una scheda ai_trend
  python3 /tmp/routine/ai-trend.py registro <file>      una voce o una lista di voci ai_registro
  python3 /tmp/routine/ai-trend.py copertura <file>     il documento mensile ai_copertura
  python3 /tmp/routine/ai-trend.py controllo <file>     il documento mensile ai_controllo
Stampa OK oppure gli errori (uscita 2). I limiti di parole sono quelli di trend.md.
"""
import json, re, sys

STATI = ("emergente", "crescita", "maturo", "calo")
DATA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
URL = re.compile(r"^https?://")


def parole(s):
    return len(re.findall(r"\S+", str(s or "")))


def fonte_ok(f):
    return isinstance(f, dict) and f.get("nome") and URL.match(str(f.get("url") or ""))


def carica(path):
    x = json.load(open(path))
    if isinstance(x, dict) and isinstance(x.get("data"), dict):
        x = x["data"]
    if isinstance(x, dict) and isinstance(x.get("docs") or x.get("items"), list):
        x = x.get("docs") or x.get("items")
    if isinstance(x, list):
        return [d["data"] if isinstance(d, dict) and isinstance(d.get("data"), dict) else d for d in x]
    return x


def scheda(d):
    E = []
    for c in ("titolo", "stato", "stato_perche", "lead", "cosa_succede", "numeri", "cronologia",
              "rumore", "mercati", "osservare", "collegamenti", "parole", "fonti", "aggiornato"):
        if d.get(c) in (None, "", [], {}):
            E.append(f"manca {c}")
    if d.get("stato") and d["stato"] not in STATI:
        E.append("stato non valido")
    if d.get("aggiornato") and not DATA.match(str(d["aggiornato"])):
        E.append("aggiornato non è AAAA-MM-GG")
    for c, lim in (("cosa_succede", 90),):
        if parole(d.get(c)) > lim:
            E.append(f"{c}: {parole(d.get(c))} parole (max {lim})")
    N = d.get("numeri") or []
    if not 3 <= len(N) <= 6:
        E.append("numeri: da 3 a 6")
    for i, n in enumerate(N):
        if not (n.get("val") and n.get("testo") and n.get("periodo") and fonte_ok(n.get("fonte"))):
            E.append(f"numeri[{i}]: servono val, testo, periodo, fonte con url")
        if n.get("misura") not in ("misurato", "dichiarato"):
            E.append(f"numeri[{i}]: misura misurato|dichiarato")
    if not any(n.get("misura") == "misurato" for n in N):
        E.append("numeri: almeno uno misurato")
    s = d.get("serie")
    if s:
        if not (s.get("titolo") and isinstance(s.get("punti"), list) and len(s["punti"]) >= 2 and fonte_ok(s.get("fonte"))):
            E.append("serie: titolo, almeno 2 punti, fonte")
        for p in s.get("punti") or []:
            if not isinstance(p.get("y"), (int, float)):
                E.append("serie: y deve essere un numero")
                break
    C = d.get("cronologia") or []
    if not 4 <= len(C) <= 10:
        E.append("cronologia: da 4 a 10 tappe")
    ult = ""
    for i, c in enumerate(C):
        if not (re.match(r"^\d{4}-\d{2}(-\d{2})?$", str(c.get("data") or "")) and c.get("testo") and fonte_ok(c.get("fonte"))):
            E.append(f"cronologia[{i}]: data AAAA-MM-GG, testo, fonte")
        elif str(c["data"]) < ult:
            E.append("cronologia: non in ordine dalla più vecchia")
        else:
            ult = str(c["data"])
        if parole(c.get("testo")) > 25:
            E.append(f"cronologia[{i}]: max 25 parole")
    if not (d.get("collegamenti") or {}).get("chiavi"):
        E.append("collegamenti.chiavi: obbligatorio, le chiavi che spiegano il fatto (se nessuna: candidato nel registro)")
    for c in ("meccanismo", "letture", "sintesi", "chi_vince", "perche_adesso"):
        if d.get(c):
            E.append(f"{c}: le ipotesi non stanno nel trend ma nella chiave")
    if (d.get("rumore") or {}).get("giudizio") not in ("piu_rumore", "allineato", "piu_fatti"):
        E.append("rumore.giudizio piu_rumore|allineato|piu_fatti")
    if set((d.get("mercati") or {}).keys()) - {"usa", "europa", "italia"}:
        E.append("mercati: solo usa, europa, italia")
    if not 2 <= len(d.get("osservare") or []) <= 4:
        E.append("osservare: da 2 a 4 segnali")
    W = d.get("parole") or []
    if not 3 <= len(W) <= 8 or any(str(w) != str(w).lower() or len(str(w)) < 3 for w in W):
        E.append("parole: 3-8, in minuscolo, almeno 3 lettere")
    for t in (d.get("collegamenti") or {}).get("chiavi") or []:
        if not re.match(r"^t\d+$", str(t)):
            E.append(f"collegamenti.chiavi: {t} non è t1…t9")
    S = d.get("storia_stato") or []
    if not S or S[-1].get("stato") != d.get("stato"):
        E.append("storia_stato: l'ultima voce deve avere lo stato attuale (si aggiunge, non si riscrive)")
    pr = d.get("privato") or {}
    if not (pr.get("frasi") and pr.get("domande")):
        E.append("privato: frasi e domande")
    if parole(d.get("lead")) > 60:
        E.append("lead: max 2 frasi brevi (60 parole)")
    return E


TIPI = ("stima", "inferenza", "lettura", "candidato", "scarto", "lezione", "log")


def registro(d):
    E = []
    for c in ("data", "tipo", "oggetto", "testo"):
        if not d.get(c):
            E.append(f"manca {c}")
    if d.get("tipo") not in TIPI:
        E.append("tipo non valido")
    if d.get("tipo") not in ("log",):
        if parole(d.get("testo")) > 50:
            E.append("testo: max 50 parole")
        if d.get("tipo") in ("stima", "inferenza", "lettura") and not (d.get("base") and d.get("come_si_verifica") and DATA.match(str(d.get("rivedere_entro") or ""))):
            E.append("stima/inferenza/lettura: servono base, come_si_verifica, rivedere_entro")
        for b in d.get("base") or []:
            if not (b.get("dato") and fonte_ok(b.get("fonte"))):
                E.append("base: ogni voce con dato e fonte con url")
                break
    if d.get("esito") not in (None, "retta", "corretta", "smentita"):
        E.append("esito non valido")
    if d.get("esito") and not d.get("esito_testo"):
        E.append("esito senza esito_testo")
    if d.get("esito") in ("corretta", "smentita") and not d.get("lezione"):
        E.append("esito corretta/smentita senza lezione")
    return E


def copertura(d):
    E = []
    T = d.get("temi") or []
    if len(d.get("fonti_esterne") or []) < 8:
        E.append("fonti_esterne: almeno 8")
    if len({f.get("tipo") for f in d.get("fonti_esterne") or []}) < 4:
        E.append("fonti_esterne: almeno 4 tipi diversi")
    for i, t in enumerate(T):
        if t.get("stato") not in ("coperto", "parziale", "mancato"):
            E.append(f"temi[{i}]: stato coperto|parziale|mancato")
        if (t.get("fonti_n") or 0) < 3:
            E.append(f"temi[{i}]: un tema entra solo con almeno 3 fonti")
    if T:
        q = round(100 * sum(1 for t in T if t.get("stato") == "coperto") / len(T))
        if d.get("quota_coperti") != q:
            E.append(f"quota_coperti: dovrebbe essere {q}")
    for r in d.get("ritardo") or []:
        if not (r.get("trend") and "giorni" in r):
            E.append("ritardo: trend e giorni")
    if not d.get("sintesi"):
        E.append("manca sintesi")
    return E


def controllo(d):
    E = []
    for c in ("data", "schede", "verifiche", "numeri_controllati", "esito"):
        if d.get(c) in (None, ""):
            E.append(f"manca {c}")
    for v in d.get("verifiche") or []:
        if v.get("gravita") not in ("alta", "media", "bassa"):
            E.append("verifiche: gravita alta|media|bassa")
            break
    return E


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("scheda", "registro", "copertura", "controllo"):
        print(__doc__); sys.exit(1)
    f = {"scheda": scheda, "registro": registro, "copertura": copertura, "controllo": controllo}[sys.argv[1]]
    x = carica(sys.argv[2])
    tutti = x if isinstance(x, list) else [x]
    err = []
    for d in tutti:
        for e in f(d):
            err.append(f"{d.get('id') or d.get('titolo') or d.get('data') or '?'}: {e}")
    for e in err:
        print("ERRORE", e)
    if err:
        sys.exit(2)
    if sys.argv[1] == "registro":
        aperte = [d for d in tutti if d.get("rivedere_entro") and not d.get("esito")]
        chiuse = [d for d in tutti if d.get("esito")]
        print(f"OK · {len(tutti)} voci, {len(aperte)} da verificare, {len(chiuse)} chiuse: " +
              ", ".join(f"{k} {sum(1 for d in chiuse if d['esito'] == k)}" for k in ("retta", "corretta", "smentita")))
    else:
        print("OK")


if __name__ == "__main__":
    main()
