# rgsite.py — pubblica sul sito (Worker rg-api) i documenti che una routine ha appena scritto nel database dell'artifact.
# Uso:
#   python3 rgsite.py push DIR      invia DIR/<collezione>/<id>.json (un file per documento, contenuto = il documento intero)
#                                   poi rilegge dal sito ogni documento inviato e controlla che coincida
#   python3 rgsite.py check DIR     solo il controllo (nessun invio): elenca i documenti di DIR assenti o diversi sul sito
#   python3 rgsite.py missing FILE  FILE ha una riga "collezione/id" per documento: stampa quelli che sul sito mancano
#   python3 rgsite.py estrai DIR [--dopo ISO]
#                                   NESSUNA RICOPIATURA: legge dal registro della sessione (~/.claude/projects/**/*.jsonl,
#                                   sotto-agenti compresi) i risultati esatti di db_get / db_list / db_query sull'artifact
#                                   e i documenti interi scritti con db_write (op "set"), e li salva in DIR/<collezione>/<id>.json.
#                                   Con --dopo tiene solo i documenti aggiornati dopo quell'istante (updatedAt del database).
#                                   Con --privati estrae solo idee, richieste e approfondimenti (per il pannello, mai per push).
# Variabili d'ambiente: RG_API, RG_TOKEN (mai stampate).
# Sicurezza: invia solo le collezioni pubbliche, con gli stessi filtri di privacy di push_site.py; non cancella mai nulla.
import json, os, sys, time, urllib.request, urllib.error, urllib.parse

OK = ["briefings", "stories", "threads", "events", "countries", "sources", "agenda", "glossario", "approfondimenti",
      "brevi", "settimanali", "mercati", "segnali", "attori", "attori_storico", "dossier"]
api = os.environ["RG_API"].rstrip("/")
tok = os.environ["RG_TOKEN"]


def clean(c, x):
    """Stessi filtri di push_site.py. Ritorna None se il documento non va sul sito."""
    if isinstance(x, dict) and isinstance(x.get("data"), dict) and "id" in x and len(x) <= 5:
        x = x["data"]
    if not isinstance(x, dict):
        return None
    if c == "approfondimenti":
        if x.get("stato") != "pronto":
            return None
        x = {k: v for k, v in x.items() if k != "risposta_rapida"}
    if c == "dossier":
        if x.get("stato") != "pronto":
            return None
        x = {k: v for k, v in x.items() if k not in ("domanda", "motivo", "auto", "proposto_il", "scartato_il")}
    if c == "briefings":
        x = {k: v for k, v in x.items() if k != "selezione"}
    return x


def load(src):
    docs, skipped = [], []
    for c in sorted(os.listdir(src)):
        d = os.path.join(src, c)
        if not os.path.isdir(d):
            continue
        if c not in OK:
            skipped.append(c + " (collezione non pubblica)")
            continue
        for f in sorted(os.listdir(d)):
            if not f.endswith(".json"):
                continue
            try:
                x = json.load(open(os.path.join(d, f)))
            except Exception as e:
                sys.exit("ERRORE: %s/%s non è JSON valido (%s)" % (c, f, e))
            x = clean(c, x)
            if x is None:
                skipped.append(c + "/" + f[:-5] + " (non pronto)")
                continue
            docs.append({"type": c, "key": f[:-5], "data": x})
    return docs, skipped


def call(method, path, body=None):
    for n in range(4):
        try:
            h = {"user-agent": "rg-site/1", "authorization": "Bearer " + tok}
            data = None
            if body is not None:
                h["content-type"] = "application/json"
                data = json.dumps(body, ensure_ascii=False).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(api + path, data, h, method=method), timeout=60))
        except urllib.error.HTTPError as e:
            if e.code == 404 and method == "GET":
                return None
            if e.code < 500:
                sys.exit("ERRORE %s su %s: %s" % (e.code, path, e.read().decode()[:200]))
        except Exception:
            pass
        time.sleep(2 * (n + 1))
    sys.exit("ERRORE: Worker non raggiungibile su %s (riprova al prossimo giro: i file restano pronti)" % path)


def same(sent, got):
    if not isinstance(got, dict):
        return False
    g = got.get("data") if isinstance(got.get("data"), dict) else got
    return all(json.dumps(g.get(k), sort_keys=True, ensure_ascii=False) == json.dumps(v, sort_keys=True, ensure_ascii=False) for k, v in sent.items())


def check(docs):
    bad = []
    for x in docs:
        r = call("GET", "/api/doc/%s/%s" % (urllib.parse.quote(x["type"]), urllib.parse.quote(x["key"])))
        if not r or not r.get("ok"):
            bad.append(x["type"] + "/" + x["key"] + " assente")
        elif not same(x["data"], r.get("doc")):
            bad.append(x["type"] + "/" + x["key"] + " diverso")
    return bad


SLUG = "eb02b64f-dbb3-424b-a57c-38d9fd3c8612"


def estrai(dst, dopo=None, cols=None):
    import glob, re
    home = os.path.expanduser("~")
    files = set()
    for base in {home, "/root", os.environ.get("CLAUDE_CONFIG_DIR", "")}:
        if base:
            files.update(glob.glob(os.path.join(base, ".claude", "projects", "**", "*.jsonl"), recursive=True))
            files.update(glob.glob(os.path.join(base, "projects", "**", "*.jsonl"), recursive=True))
    uses, best = {}, {}
    def put(c, k, data, upd, ts):
        if c not in (cols or OK) or not isinstance(data, dict):
            return
        old = best.get((c, k))
        if old is None or (ts or "") >= (old[2] or ""):
            best[(c, k)] = (data, upd, ts)
    def body(txt):
        m = re.search(r"<untrusted-document-([0-9a-f]+)>(.*)</untrusted-document-\1>", txt, re.S)
        return m.group(2) if m else None
    for f in sorted(files):
        try:
            lines = open(f, encoding="utf-8").read().splitlines()
        except Exception:
            continue
        for line in lines:
            try:
                o = json.loads(line)
            except Exception:
                continue
            ts = o.get("timestamp") or ""
            c = (o.get("message") or {}).get("content")
            if not isinstance(c, list):
                continue
            for b in c:
                if not isinstance(b, dict):
                    continue
                if b.get("type") == "tool_use":
                    nm, inp = b.get("name", ""), b.get("input") or {}
                    uses[b.get("id")] = (nm, inp)
                    if nm.endswith("db_write") and inp.get("slug") == SLUG:
                        for op in inp.get("ops") or []:
                            if op.get("op") == "set" and "/" in str(op.get("path", "")):
                                cc, kk = op["path"].split("/", 1)
                                put(cc, kk, op.get("data"), "9999", ts)
                elif b.get("type") == "tool_result" and not b.get("is_error"):
                    nm, inp = uses.get(b.get("tool_use_id"), ("", {}))
                    if inp.get("slug") != SLUG or not re.search(r"db_(get|list|query)$", nm):
                        continue
                    cc = b.get("content")
                    txt = cc if isinstance(cc, str) else "".join(x.get("text", "") for x in (cc or []) if isinstance(x, dict))
                    head = txt.split("<untrusted-document-", 1)[0]
                    bd = body(txt)
                    if bd is None:
                        continue
                    rows = [json.loads(l) for l in bd.strip().splitlines() if l.strip().startswith("{")]
                    if nm.endswith("db_get"):
                        if "/" not in str(inp.get("path", "")) or len(rows) != 1:
                            continue
                        mu = re.search(r'"updatedAt":"([^"]+)"', head)
                        cc2, kk = inp["path"].split("/", 1)
                        put(cc2, kk, rows[0], mu.group(1) if mu else "", ts)
                    else:
                        col = inp.get("collection", "")
                        for r in rows:
                            if isinstance(r, dict) and "id" in r and isinstance(r.get("data"), dict):
                                put(col, r["id"], r["data"], r.get("updatedAt", ""), ts)
    n = 0
    for (c, k), (data, upd, ts) in sorted(best.items()):
        if dopo and upd and upd != "9999" and upd <= dopo:
            continue
        os.makedirs(os.path.join(dst, c), exist_ok=True)
        json.dump(data, open(os.path.join(dst, c, k + ".json"), "w"), ensure_ascii=False)
        n += 1
    print("estratti %d documenti in %s (letti %d registri di sessione)" % (n, dst, len(files)))


cmd, src = sys.argv[1], sys.argv[2]
if cmd == "estrai":
    a = sys.argv[3:]
    dopo = a[a.index("--dopo") + 1] if "--dopo" in a else None
    # --privati: solo idee, richieste e approfondimenti, per le proposte del pannello (passo 4b); MAI da passare a push
    estrai(src, dopo, ["idee", "richieste", "approfondimenti"] if "--privati" in a else None)
    sys.exit(0)
frag = []
if cmd == "missing":
    miss, n = [], 0
    for line in open(src):
        line = line.strip()
        if not line or "/" not in line:
            continue
        c, k = line.split("/", 1)
        if c not in OK:
            continue
        n += 1
        r = call("GET", "/api/doc/%s/%s" % (urllib.parse.quote(c), urllib.parse.quote(k)))
        if not r or not r.get("ok"):
            miss.append(c + "/" + k)
    print("controllati %d, mancanti %d" % (n, len(miss)))
    for x in miss:
        print("MANCA " + x)
    sys.exit(0)
docs, skipped = load(src)
if skipped:
    print("saltati:", "; ".join(skipped))
if not docs:
    print("nessun documento da pubblicare")
    sys.exit(0)
def partial(docs):
    """Protezione: un documento con molti meno campi di quello già sul sito è quasi certamente un frammento (merge): non va inviato."""
    keep, bad = [], []
    for x in docs:
        r = call("GET", "/api/doc/%s/%s" % (urllib.parse.quote(x["type"]), urllib.parse.quote(x["key"])))
        old = (r or {}).get("doc") if (r or {}).get("ok") else None
        if isinstance(old, dict):
            n_old = len([k for k in old if k != "key"])
            if n_old >= 4 and len(x["data"]) < 0.6 * n_old:
                bad.append("%s/%s ha %d campi contro %d sul sito" % (x["type"], x["key"], len(x["data"]), n_old))
                continue
        keep.append(x)
    return keep, bad


if cmd == "push":
    docs, frag = partial(docs)
    if frag:
        print("NON INVIATI (sembrano parziali: rileggi il documento intero con db_get e riscrivi il file):", "; ".join(frag))
    if not docs:
        sys.exit(1)
    tot = {"created": 0, "updated": 0, "unchanged": 0}
    for i in range(0, len(docs), 25):
        r = call("POST", "/v1/batch", {"docs": docs[i:i + 25]})
        for k in tot:
            tot[k] += (r or {}).get(k, 0)
    print("push ok", tot, "documenti", len(docs))
bad = check(docs)
if cmd == "push" and frag:
    bad += [x + " (non inviato)" for x in frag]
if bad:
    print("CONTROLLO FALLITO:", "; ".join(bad))
    sys.exit(1)
print("controllo ok: %d documenti presenti e uguali sul sito" % len(docs))
