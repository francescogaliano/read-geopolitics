#!/usr/bin/env python3
"""Prepara gli attrezzi delle routine all'avvio della sessione.

Lo lancia l'hook SessionStart di .claude/settings.json, prima che l'agente
inizi: cosi' le routine trovano i kit gia' pronti e non scaricano codice.
  - /tmp/rgdb.py                     client del database
  - /tmp/pod/kit/                    kit del podcast (da worker/kit/podkit.tgz)
  - /tmp/ico/kit/                    kit dei video iconografici (da worker/kit/puntikit.tgz)
  - /tmp/rgkit/                      kit video su HyperFrames (da kit/video)
  - $HOME/igkit/*.mjs, package.json  kit Instagram, identico a quello servito
    da /ig/kit/ (viene da IG_KIT in worker/worker.js); reel.mjs anche in /tmp/reel
Non fallisce mai: ogni passo e' indipendente, l'esito va in /tmp/prepara.log.
"""
import base64, os, re, shutil, tarfile, traceback

KIT = os.path.dirname(os.path.abspath(__file__))
WORKER = os.path.dirname(KIT)
log = []


def passo(nome, fn):
    try:
        log.append(f"{nome}: ok {fn() or ''}".rstrip())
    except Exception:
        log.append(f"{nome}: ERRORE {traceback.format_exc(limit=1).strip()}")


def rgdb():
    shutil.copy(os.path.join(KIT, "rgdb.py"), "/tmp/rgdb.py")


def podcast():
    os.makedirs("/tmp/pod/kit", exist_ok=True)
    with tarfile.open(os.path.join(KIT, "podkit.tgz")) as t:
        try:
            t.extractall("/tmp/pod/kit", filter="data")
        except TypeError:  # python senza filter
            t.extractall("/tmp/pod/kit")
    return f"{len(os.listdir('/tmp/pod/kit'))} file"


def iconografiche():
    os.makedirs("/tmp/ico/kit", exist_ok=True)
    with tarfile.open(os.path.join(KIT, "puntikit.tgz")) as t:
        try:
            t.extractall("/tmp/ico/kit", filter="data")
        except TypeError:
            t.extractall("/tmp/ico/kit")
    return f"{len(os.listdir('/tmp/ico/kit'))} file"


def video():
    # kit video su HyperFrames (cartella kit/video del repository): copia di lavoro in /tmp/rgkit
    src = os.path.join(os.path.dirname(WORKER), "kit", "video")
    if os.path.isdir("/tmp/rgkit"):
        shutil.rmtree("/tmp/rgkit")
    shutil.copytree(src, "/tmp/rgkit")
    return f"{len(os.listdir('/tmp/rgkit'))} voci"


def instagram():
    src = open(os.path.join(WORKER, "worker.js"), encoding="utf-8").read()
    blk = src[src.index("const IG_KIT = {"):]
    blk = blk[: blk.index("\n};")]
    files = re.findall(r'^\s*"([\w.-]+)":\s*"([A-Za-z0-9+/=]+)",?\s*$', blk, re.M)
    if not files:
        raise RuntimeError("IG_KIT vuoto")
    home = os.path.join(os.path.expanduser("~"), "igkit")
    os.makedirs(home, exist_ok=True)
    os.makedirs("/tmp/reel", exist_ok=True)
    for nome, b64 in files:
        dati = base64.b64decode(b64)
        with open(os.path.join(home, nome), "wb") as f:
            f.write(dati)
        if nome == "reel.mjs":
            with open("/tmp/reel/reel.mjs", "wb") as f:
                f.write(dati)
    return f"{len(files)} file in {home}"


passo("rgdb", rgdb)
passo("podcast", podcast)
passo("iconografiche", iconografiche)
passo("instagram", instagram)
passo("video", video)
try:
    with open("/tmp/prepara.log", "w") as f:
        f.write("\n".join(log) + "\n")
except Exception:
    pass
print("prepara: " + " | ".join(log))
