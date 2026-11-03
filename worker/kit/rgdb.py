# rgdb.py — il database delle routine di Read Geopolitics, sul Worker rg-api (D1). Sostituisce ArtifactData.
# Nessun permesso da chiedere: passa dal token della routine. Ogni scrittura su una collezione del sito
# (briefings, stories, threads, …) aggiorna anche il sito, con gli stessi filtri di rgsite.py.
#
# Uso (stampa sempre JSON; esce con codice 1 se qualcosa va storto e scrive l'errore su stderr):
#   python3 rgdb.py collezioni                              elenco delle collezioni con quanti documenti
#   python3 rgdb.py get COLL ID [--out DIR]                 un documento {doc_id, version, data}
#   python3 rgdb.py list COLL [--limit N] [--cursor C] [--all] [--where JSON] [--order CAMPO] [--desc] [--out DIR]
#                                                           --where '[["stato","eq","attivo"]]' (operatori come ArtifactData:
#                                                           eq ne lt lte gt gte in not-in array-contains)
#                                                           --all segue i cursori fino alla fine (non con --order)
#                                                           --out DIR salva DIR/<coll>/<id>.json (il documento) e stampa l'elenco
#   python3 rgdb.py set COLL ID (--data JSON | --file F) [--if-version V]
#   python3 rgdb.py update COLL ID (--data JSON | --file F) [--if-version V]     unione profonda; {"__delete__":true} toglie un campo
#   python3 rgdb.py delete COLL ID [--if-version V]
#   python3 rgdb.py str_replace COLL ID --field F --old TESTO --new TESTO [--all] [--if-version V]
#                   (oppure --old-file / --new-file per testi lunghi)
#   python3 rgdb.py batch FILE                              FILE = {"writes":[{op,collection,doc_id,data|file_path,if_version}]}
#                                                           fino a 50 scritture, tutte o nessuna
#   python3 rgdb.py push DIR                                scrive (set) ogni DIR/<coll>/<id>.json, a gruppi di 50
# Variabili d'ambiente: RG_API, RG_TOKEN (mai stampate).
import json, os, sys, time, urllib.request, urllib.error, urllib.parse

api = os.environ.get("RG_API", "").rstrip("/")
tok = os.environ.get("RG_TOKEN", "")


def die(msg):
    sys.stderr.write("ERRORE: " + msg + "\n")
    sys.exit(1)


def call(method, path, body=None, q=None):
    if not api or not tok:
        die("mancano RG_API o RG_TOKEN")
    url = api + path + ("?" + urllib.parse.urlencode(q) if q else "")
    last = ""
    for n in range(4):
        try:
            h = {"user-agent": "rg-db/1", "authorization": "Bearer " + tok}
            data = None
            if body is not None:
                h["content-type"] = "application/json"
                data = json.dumps(body, ensure_ascii=False).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(url, data, h, method=method), timeout=90))
        except urllib.error.HTTPError as e:
            txt = e.read().decode("utf-8", "replace")[:400]
            if e.code == 404 and method == "GET" and '"not_found"' in txt:
                return {"ok": False, "error": "not_found"}
            if e.code < 500:
                die("%s %s → %s %s" % (method, path, e.code, txt))
            last = "%s %s" % (e.code, txt)
        except Exception as e:
            last = str(e)[:200]
        time.sleep(2 * (n + 1))
    die("Worker non raggiungibile su %s (%s)" % (path, last))


def p(coll, did=None, extra=""):
    s = "/v1/db/" + urllib.parse.quote(coll, safe="")
    if did is not None:
        s += "/" + urllib.parse.quote(did, safe="")
    return s + extra


def out(o):
    print(json.dumps(o, ensure_ascii=False, indent=1))


def opt(a, name, default=None):
    if name in a:
        i = a.index(name)
        if i + 1 >= len(a):
            die("manca il valore di " + name)
        v = a[i + 1]
        del a[i:i + 2]
        return v
    return default


def flag(a, name):
    if name in a:
        a.remove(name)
        return True
    return False


def loadjson(s, what):
    try:
        return json.loads(s)
    except Exception as e:
        die("%s non è JSON valido (%s)" % (what, e))


def docdata(a):
    d, f = opt(a, "--data"), opt(a, "--file")
    if (d is None) == (f is None):
        die("serve --data JSON oppure --file F")
    x = loadjson(d, "--data") if d is not None else loadjson(open(f, encoding="utf-8").read(), f)
    if isinstance(x, dict) and set(x) >= {"doc_id", "data"} and isinstance(x["data"], dict):
        x = x["data"]  # un file salvato da get/list --out: si scrive il documento, non la busta
    if not isinstance(x, dict):
        die("il documento deve essere un oggetto JSON")
    return x


def iv(a):
    v = opt(a, "--if-version")
    return int(v) if v not in (None, "") else None


def save(dst, coll, d):
    os.makedirs(os.path.join(dst, coll), exist_ok=True)
    fn = os.path.join(dst, coll, d["doc_id"] + ".json")
    with open(fn, "w", encoding="utf-8") as fh:
        json.dump({"doc_id": d["doc_id"], "version": d["version"], "data": d["data"]}, fh, ensure_ascii=False, indent=1)
    return fn


def main():
    a = sys.argv[1:]
    if not a:
        die("comando mancante (vedi l'intestazione del file)")
    cmd = a.pop(0)
    if cmd == "collezioni":
        out(call("GET", "/v1/db"))
    elif cmd == "get":
        dst = opt(a, "--out")
        if len(a) != 2:
            die("uso: get COLL ID")
        r = call("GET", p(a[0], a[1]))
        if dst and r.get("ok"):
            r = {"ok": True, "file": save(dst, a[0], r), "version": r["version"]}
        out(r)
        if not r.get("ok"):
            sys.exit(1)
    elif cmd == "list":
        lim, cur, wh, order = opt(a, "--limit", "100"), opt(a, "--cursor"), opt(a, "--where"), opt(a, "--order")
        desc, tutto, dst = flag(a, "--desc"), flag(a, "--all"), opt(a, "--out")
        if len(a) != 1:
            die("uso: list COLL [opzioni]")
        if wh:
            loadjson(wh, "--where")
        docs = []
        while True:
            q = {"limit": lim}
            if cur:
                q["cursor"] = cur
            if wh:
                q["where"] = wh
            if order:
                q.update({"order_by": order, "dir": "desc" if desc else "asc"})
            r = call("GET", p(a[0]), q=q)
            docs += r.get("docs", [])
            cur = r.get("next_cursor")
            if not (tutto and cur and not order):
                break
        if dst:
            out({"ok": True, "collection": a[0], "n": len(docs), "files": [save(dst, a[0], d) for d in docs], "next_cursor": cur})
        else:
            out({"ok": True, "collection": a[0], "n": len(docs), "docs": docs, "next_cursor": cur})
    elif cmd in ("set", "update"):
        v = iv(a)
        d = docdata(a)
        if len(a) != 2:
            die("uso: %s COLL ID --data/--file" % cmd)
        out(call("PUT" if cmd == "set" else "PATCH", p(a[0], a[1]), {"data": d, "if_version": v}))
    elif cmd == "delete":
        v = iv(a)
        if len(a) != 2:
            die("uso: delete COLL ID")
        out(call("DELETE", p(a[0], a[1]), q={"if_version": v} if v else None))
    elif cmd == "str_replace":
        v, field = iv(a), opt(a, "--field")
        old, new = opt(a, "--old"), opt(a, "--new")
        of, nf = opt(a, "--old-file"), opt(a, "--new-file")
        if of:
            old = open(of, encoding="utf-8").read()
        if nf:
            new = open(nf, encoding="utf-8").read()
        allr = flag(a, "--all")
        if len(a) != 2 or not field or old is None or new is None:
            die("uso: str_replace COLL ID --field F --old T --new T")
        out(call("POST", p(a[0], a[1], "/str_replace"), {"field": field, "old_str": old, "new_str": new, "replace_all": allr, "if_version": v}))
    elif cmd == "batch":
        if len(a) != 1:
            die("uso: batch FILE")
        b = loadjson(open(a[0], encoding="utf-8").read(), a[0])
        W = b.get("writes") if isinstance(b, dict) else b
        if not isinstance(W, list) or not 1 <= len(W) <= 50:
            die("writes: da 1 a 50 scritture")
        for w in W:
            fp = w.pop("file_path", None)
            if fp:
                x = loadjson(open(fp, encoding="utf-8").read(), fp)
                w["data"] = x["data"] if isinstance(x, dict) and set(x) >= {"doc_id", "data"} and isinstance(x["data"], dict) else x
        out(call("POST", "/v1/db/batch", {"writes": W}))
    elif cmd == "push":
        if len(a) != 1:
            die("uso: push DIR")
        W = []
        for c in sorted(os.listdir(a[0])):
            d = os.path.join(a[0], c)
            if not os.path.isdir(d):
                continue
            for f in sorted(os.listdir(d)):
                if f.endswith(".json"):
                    x = loadjson(open(os.path.join(d, f), encoding="utf-8").read(), c + "/" + f)
                    if isinstance(x, dict) and set(x) >= {"doc_id", "data"} and isinstance(x["data"], dict):
                        x = x["data"]
                    W.append({"op": "set", "collection": c, "doc_id": f[:-5], "data": x})
        tot, grp, size = {}, [], 0
        def send(g):
            r = call("POST", "/v1/db/batch", {"writes": g})
            for x in r.get("results", []):
                tot[x["status"]] = tot.get(x["status"], 0) + 1
        for w in W:
            n = len(json.dumps(w, ensure_ascii=False))
            if grp and (len(grp) == 50 or size + n > 3000000):
                send(grp)
                grp, size = [], 0
            grp.append(w)
            size += n
        if grp:
            send(grp)
        out({"ok": True, "documenti": len(W), "esiti": tot})
    else:
        die("comando sconosciuto: " + cmd)


main()
