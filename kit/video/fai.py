#!/usr/bin/env python3
"""fai.py SCENEGGIATURA.json USCITA.mp4 — dal copione al video, con i controlli.

1) controlli sulla sceneggiatura (lunghezze, campi)  2) costruisci.py (tempi, index.html)
3) hyperframes check: se non è «ok» si ferma e stampa gli errori  4) render
5) compressione e controllo finale (durata <= 45 s, peso <= 9,5 MB).
Stampa una riga JSON con l'esito; esce con 0 solo se il video è pronto.
"""
import glob, json, os, subprocess, sys

QUI = os.path.dirname(os.path.abspath(__file__))
HF = "hyperframes@0.9.33"

def fine(ok, **k):
    print(json.dumps({"ok": ok, **k}, ensure_ascii=False)); sys.exit(0 if ok else 2)

# ---------- controlli di redazione (19/11/2026): regole che prima erano solo testo nelle istruzioni ----------
import math, re
MODELLI = {  # kicker del copione -> titoli delle scene, nell'ordine (prefisso per «Intanto»)
    "DUE LETTURE": ["Il *fatto*", "Cosa *manca*", "Intanto", "Cosa *deciderà*", "Tu *come la leggi?*"],
}
CHIUSURE = {"DUE LETTURE": "Le due tesi complete, con le fonti, su *Read Geopolitics*"}
FONTE_VIETATA = re.compile(r"read\s*geopolitics|\banalisi\b|\bsintesi\b|\bnostr[aoie]\b|\bredazione\b", re.I)
TITOLO_VIETATO = re.compile(r"\bnostr[aoie]\b|\bverdetto\b|\bgiudizio\b", re.I)
GIUDIZIO = re.compile(r",\s*ma\s+", re.I)

def _mondo():
    t = open(os.path.join(QUI, "assets", "mondo.js"), encoding="utf-8").read()
    F = json.loads(t[t.index("["): t.rindex("]") + 1])
    out = {}
    for f in F:
        g = f.get("geometry") or {}
        polys = g.get("coordinates") or []
        if g.get("type") == "Polygon": polys = [polys]
        out.setdefault(f.get("id"), []).extend(poly[0] for poly in polys if poly)
    return out

def _dentro(pt, ring):
    x, y, c = pt[0], pt[1], False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1: c = not c
    return c

def _vicino(pt, rings, gradi=0.7):
    return any(_dentro(pt, r) for r in rings) or any(abs(pt[0] - a) <= gradi and abs(pt[1] - b) <= gradi for r in rings for a, b in r)

def _proietta(lon, lat, c, R, cy):  # ortografica come rg.js: centro c in (540, cy), raggio R
    l, p, l0, p0 = map(math.radians, (lon, lat, c[0], c[1]))
    cosc = math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l - l0)
    if cosc <= 0: return None
    x = R * math.cos(p) * math.sin(l - l0); y = R * (math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l - l0))
    return 540 + x, cy - y

def controlli_redazione(SC):
    E = []
    kick = str(SC.get("kicker") or "").strip().upper()
    sc = SC.get("scene") or []
    tit = [puro(s.get("titolo")).strip() for s in sc]
    if kick in MODELLI:
        mod = MODELLI[kick]
        if len(sc) != len(mod): E.append(f"modello {kick}: servono esattamente {len(mod)} scene ({', '.join(puro(m) for m in mod)}), ce ne sono {len(sc)}")
        for i, m in enumerate(mod):
            if i >= len(sc): break
            ok = tit[i].startswith(puro(m)) if puro(m) == "Intanto" else tit[i] == puro(m)
            if not ok: E.append(f"modello {kick}: la scena {i + 1} deve chiamarsi «{puro(m)}», non «{tit[i]}»")
        fr = SC.get("frasi") or []
        if kick in CHIUSURE and (not fr or puro(fr[-1][0]).strip() != puro(CHIUSURE[kick])): E.append(f"modello {kick}: l'ultima frase deve essere «{puro(CHIUSURE[kick])}»")
    for i, s in enumerate(sc):
        if TITOLO_VIETATO.search(tit[i]): E.append(f"scena {i + 1}: il titolo «{tit[i]}» presenta una nostra valutazione: le scene riportano fatti e posizioni delle fonti")
        if FONTE_VIETATA.search(str(s.get("fonte") or "")): E.append(f"scena {i + 1}: la fonte «{s.get('fonte')}» non è una fonte della storia (niente analisi o sintesi di Read Geopolitics)")
    for i, f in enumerate(SC.get("frasi") or []):
        t = puro(f[0]); m = GIUDIZIO.search(t)
        if m and ":" not in t[: m.start()]: E.append(f"frase {i}: «{t}» mette in contrasto due cose con «ma» senza dire chi lo afferma: o è attribuita a una fonte («Kuwait: …»), o va tolta")
    M = SC.get("mappa") or {}; ap = SC.get("apertura") or {}
    acc = list(M.get("accesi") or []); ev = list(ap.get("evidenzia") or [])
    if not acc: E.append("mappa: nessun paese acceso (mappa.accesi vuota): accendi il paese dove succede il fatto e le parti coinvolte")
    for x in ev:
        if x not in acc: E.append(f"mappa: {x} è evidenziato nell'apertura ma non è acceso nelle scene (mappa.accesi)")
    if M.get("globo") and acc:
        W = _mondo(); cy = M.get("cy") or 820
        for x in acc:
            if x not in W: E.append(f"mappa: il codice {x} non esiste nella mappa (usa ISO a 3 lettere)")
        pu = ap.get("punto")
        if pu and not str(ap.get("luogo_neutro") or "").strip() and not any(_vicino(pu, W.get(x, [])) for x in acc):
            E.append(f"mappa: il luogo del fatto ({ap.get('etichetta') or pu}) non sta in nessun paese acceso: accendi il paese dove succede il fatto (oggi accesi: {', '.join(acc)}). Solo se il luogo è neutro per la storia (es. una mediazione in un paese terzo) scrivi il motivo in apertura.luogo_neutro")
        # il paese del fatto (dove sta apertura.punto) deve essere ben visibile nella prima scena, non solo un puntino accanto a un vicino grande
        luogo = None
        if pu and not str(ap.get("luogo_neutro") or "").strip():
            luogo = next((x for x in acc if any(_dentro(pu, r) for r in W.get(x, []))), None) or next((x for x in acc if _vicino(pu, W.get(x, []))), None)
        if luogo and not M.get("luogo"): SC.setdefault("mappa", {})["luogo"] = luogo  # il kit evidenzia da solo il paese del fatto
        if luogo and sc and (sc[0].get("camera") or {}).get("centro"):
            cam = sc[0]["camera"]; R = 430 * float(cam.get("zoom") or 1)
            P = [q for q in (_proietta(lo, la, cam["centro"], R, cy) for r in W.get(luogo, []) for lo, la in r) if q]
            lw = (max(q[0] for q in P) - min(q[0] for q in P)) if P else 0; lh = (max(q[1] for q in P) - min(q[1] for q in P)) if P else 0
            if max(lw, lh) < 120: E.append(f"scena 1 «{tit[0]}»: il paese del fatto ({luogo}) è troppo piccolo ({int(max(lw, lh))} px, servono almeno 120): alza lo zoom della prima scena (per paesi piccoli 8-12) e centra la camera sul luogo")
        for i, s in enumerate(sc[:-1]):  # l'ultima scena (scelta e firma) è scura e non mostra la mappa
            cam = s.get("camera") or {}
            if not cam.get("centro"): continue
            R = 430 * float(cam.get("zoom") or 1); vis = []
            for x in acc:
                P = [q for q in (_proietta(lo, la, cam["centro"], R, cy) for r in W.get(x, []) for lo, la in r) if q]
                if not P: continue
                xs, ys = [q[0] for q in P], [q[1] for q in P]
                cx, cyy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
                if 40 <= cx <= 1040 and 260 <= cyy <= 1380 and max(xs) - min(xs) >= 45 and max(ys) - min(ys) >= 45: vis.append(x)
            if not vis: E.append(f"scena {i + 1} «{tit[i]}»: nessun paese acceso si vede abbastanza (almeno 45 px e dentro l'inquadratura): avvicina la camera (zoom più alto) o centra sul luogo del fatto")
    return E

if len(sys.argv) < 3: fine(False, errore="uso: python3 fai.py sceneggiatura.json uscita.mp4")
src, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
SC = json.load(open(src, encoding="utf-8"))
err = []
puro = lambda t: str(t or "").replace("*", "")
if not SC.get("apertura") or not SC.get("scene"): err.append("mancano apertura o scene")
for i, f in enumerate(SC.get("frasi", [])):
    if SC.get("muto") and len(puro(f[0])) > 80: err.append(f"frase {i} troppo lunga ({len(puro(f[0]))} > 80 caratteri): spezzala in due")
for s in SC.get("scene", []):
    if len(puro(s.get("titolo"))) > 26: err.append(f"titolo di scena troppo lungo: «{puro(s.get('titolo'))}» (max 26)")
    if len(str(s.get("fonte") or "")) > 40: err.append(f"fonte troppo lunga: «{s.get('fonte')}» (max 40 caratteri, sta su una riga)")
    for b in s.get("blocchi", []):
        if b.get("tipo") == "timbro" and len(str(b.get("testo", ""))) > 18: err.append(f"timbro troppo lungo: «{b.get('testo')}» (max 18)")
ap = SC.get("apertura") or {}
if len(puro(ap.get("titolo"))) > 26 or len(puro(ap.get("oro"))) > 30: err.append("titolo d'apertura: max 26 caratteri la prima riga, 30 la riga in oro")
err += controlli_redazione(SC)
if err: fine(False, fase="sceneggiatura", errori=err)
if "--solo-controlli" in sys.argv: fine(True, fase="controlli", nota="controlli superati (video non generato)")

src2 = os.path.join(QUI, "_copione.json"); json.dump(SC, open(src2, "w", encoding="utf-8"), ensure_ascii=False)  # con le aggiunte dei controlli (paese del fatto)
r = subprocess.run([sys.executable, os.path.join(QUI, "costruisci.py"), src2], capture_output=True, text=True, cwd=QUI)
if r.returncode != 0: fine(False, fase="costruisci", errori=[(r.stderr or r.stdout).strip()[-600:]])
info = json.loads(r.stdout.strip().splitlines()[-1])
if info["video_s"] > 45: fine(False, fase="durata", errori=[f"il video dura {info['video_s']} s: massimo 45 (la musica finisce). Togli una frase o accorcia le tenute."])

subprocess.run(["npx", "-y", HF, "check", "--json"], capture_output=True, text=True, cwd=QUI, timeout=600)
cks = glob.glob(os.path.join(QUI, ".hyperframes/artifacts/checks/*.json"))
if not cks: fine(False, fase="check", errori=["hyperframes check non ha prodotto il rapporto"])
ck = json.load(open(max(cks, key=os.path.getmtime)))
if not ck.get("ok"):
    E = []
    for k in ("lint", "layout", "contrast", "craft", "motion", "runtime"):
        for e in (ck.get(k) or {}).get("findings", []):
            if e.get("severity") == "error": E.append(f"{e.get('code')} a {e.get('time', '?')} s: {str(e.get('message', ''))[:160]} {e.get('text', '')}".strip())
    fine(False, fase="check", errori=E[:12] or ["check non ok"])

env = dict(os.environ)
if not env.get("HYPERFRAMES_BROWSER_PATH"):
    c = sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux*/chrome") + glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome")))
    if c: env["HYPERFRAMES_BROWSER_PATH"] = c[-1]
raw = os.path.join(QUI, "_grezzo.mp4")
r = subprocess.run(["npx", "-y", HF, "render", "-o", raw], capture_output=True, text=True, cwd=QUI, env=env, timeout=1500)
if not os.path.exists(raw): fine(False, fase="render", errori=[(r.stderr or r.stdout).strip()[-600:]])
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", raw, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out], check=True)
os.remove(raw)
mb = round(os.path.getsize(out) / 1048576, 2)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], capture_output=True, text=True).stdout.strip())
if mb > 9.5: fine(False, fase="peso", errori=[f"{mb} MB: massimo 9,5"], file=out)
# tavola: un fotogramma a metà di ogni frase, da guardare (Read) prima di inviare
tav = os.path.splitext(out)[0] + "_tavola.jpg"
try:
    n = max(1, len(SC.get("frasi") or [])); passo = max(dur / (n + 1), 0.5)
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", out, "-vf", f"fps=1/{passo:.3f},scale=270:-1,tile=6x{math.ceil((n + 1) / 6)}", "-frames:v", "1", tav], check=True, timeout=120)
except Exception: tav = None
avvisi = [f"luogo neutro dichiarato: {ap.get('luogo_neutro')}"] if str((SC.get("apertura") or {}).get("luogo_neutro") or "").strip() else []
fine(True, file=out, secondi=round(dur, 1), mb=mb, motore=info["motore_tempi"], promessa=f"IN {int(5 * round(dur / 5))} SECONDI", tavola=tav, avvisi=avvisi, controlli="modello, fonti, giudizi, mappa: ok")
