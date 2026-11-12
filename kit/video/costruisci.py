# costruisci.py SCENEGGIATURA.json — kit video Read Geopolitics su HyperFrames (v2, 12/11/2026). Di solito lo lancia fai.py.
# 1) voce di Francesco su ElevenLabs con i tempi carattere per carattere (with-timestamps -> forced-alignment -> stima)
# 2) tempi dei gruppi di sottotitoli e delle parole chiave
# 3) paesi ad alta risoluzione (Natural Earth 1:10m) per la zona della mappa
# 4) index.html dal guscio. Poi: npx -y hyperframes@0.9.33 check --json && npx -y hyperframes@0.9.33 render -o clip.mp4
# Variabili: ELEVENLABS_API_KEY (obbligatoria, salvo PROVA_SENZA_VOCE=1), ELEVENLABS_VOICE_ID (facoltativa).
import os, sys, json, base64, re, subprocess, urllib.request, urllib.error, uuid, time

QUI = os.path.dirname(os.path.abspath(__file__))
os.chdir(QUI)
if len(sys.argv) < 2: sys.exit("uso: python3 costruisci.py sceneggiatura.json")
SC = json.load(open(sys.argv[1], encoding="utf-8"))
LEAD = float(SC.get("lead", 0.8))
GRUPPI = SC["frasi"]                      # [[testo a schermo con *oro*, testo letto], ...]
CHIAVI = SC.get("chiavi", [])             # [[nome, gruppo, parola letta], ...]
MUTO = bool(SC.get("muto"))  # senza voce: frasi intere da leggere, tempi dal numero di parole
SENZA = os.environ.get("PROVA_SENZA_VOCE") == "1" or MUTO
if MUTO:
    for g_ in GRUPPI: g_[1] = re.sub(r"\*", "", g_[0])
def tenuta(g_):  # secondi in cui una frase resta a schermo nel modo muto
    return float(g_[2]) if len(g_) > 2 else max(1.6, 0.7 + 0.28 * len(g_[1].split()))
key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
if not key and not SENZA: sys.exit("manca ELEVENLABS_API_KEY")
VID = os.environ.get("ELEVENLABS_VOICE_ID", "").strip() or "CBomCrEu5ntWbrwkEBIm"
BASE = "https://api.elevenlabs.io"
MODELLO = os.environ.get("RG_EL_MODEL", "").strip() or SC.get("el_modello") or "eleven_v4_turbo"  # dal 12/11/2026: v4 Turbo (metà crediti)
TESTO = " ".join(g[1] for g in GRUPPI)
SETT = {"stability": 0.5, "similarity_boost": 0.9}
os.makedirs("assets", exist_ok=True)

def call(req, tries=3):
    for t in range(tries):
        try: return urllib.request.urlopen(req, timeout=300).read()
        except urllib.error.HTTPError as e:
            m = e.read().decode()[:300]
            if e.code in (429, 500, 502, 503, 504) and t < tries - 1: time.sleep(10 * (t + 1)); continue
            raise RuntimeError(f"ElevenLabs {e.code}: {m}")

# ---------- 1) voce e tempi ----------
motore, chars = None, None
if os.path.exists("assets/voce.mp3"): os.remove("assets/voce.mp3")
if SENZA:
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(round(sum(tenuta(x) for x in GRUPPI), 2) if MUTO else round(len(TESTO) / 14.5, 2)), "assets/voce.mp3"], check=True)
else:
    try:
        body = {"text": TESTO, "model_id": MODELLO, "language_code": "it", "voice_settings": SETT}
        r = json.loads(call(urllib.request.Request(BASE + f"/v1/text-to-speech/{VID}/with-timestamps?output_format=mp3_44100_128",
            data=json.dumps(body).encode(), headers={"xi-api-key": key, "content-type": "application/json"})))
        open("assets/voce.mp3", "wb").write(base64.b64decode(r["audio_base64"]))
        al = r.get("alignment") or r.get("normalized_alignment")
        cs = list(zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]))
        if "".join(c[0] for c in cs) == TESTO: chars, motore = cs, "with-timestamps"
    except Exception as e:
        print("with-timestamps non riuscito:", e, file=sys.stderr)
    if not os.path.exists("assets/voce.mp3"):
        body = {"text": TESTO, "model_id": MODELLO, "language_code": "it", "voice_settings": SETT}
        open("assets/voce.mp3", "wb").write(call(urllib.request.Request(BASE + f"/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
            data=json.dumps(body).encode(), headers={"xi-api-key": key, "content-type": "application/json", "accept": "audio/mpeg"})))
    if chars is None:
        try:
            bd = uuid.uuid4().hex
            parts = [f"--{bd}\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n{TESTO}\r\n".encode(),
                     f"--{bd}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"voce.mp3\"\r\nContent-Type: audio/mpeg\r\n\r\n".encode()
                     + open("assets/voce.mp3", "rb").read() + b"\r\n", f"--{bd}--\r\n".encode()]
            r = json.loads(call(urllib.request.Request(BASE + "/v1/forced-alignment", data=b"".join(parts),
                headers={"xi-api-key": key, "content-type": f"multipart/form-data; boundary={bd}"})))
            cs = [(c["text"], c["start"], c["end"]) for c in r["characters"]]
            if "".join(c[0] for c in cs) == TESTO: chars, motore = cs, "forced-alignment"
        except Exception as e:
            print("forced-alignment non riuscito:", e, file=sys.stderr)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "assets/voce.mp3"],
                           capture_output=True, text=True).stdout.strip())
if MUTO:
    motore = "muto (tempi di lettura)"; chars = []; t_ = 0.0
    for gi_, g_ in enumerate(GRUPPI):
        n_ = len(g_[1]) + (1 if gi_ < len(GRUPPI) - 1 else 0); d_ = tenuta(g_)
        chars += [(ch, t_ + d_ * i / n_, t_ + d_ * (i + 1) / n_) for i, ch in enumerate(g_[1] + (" " if gi_ < len(GRUPPI) - 1 else ""))]; t_ += d_
elif chars is None:
    motore = "stima dai caratteri (nessun allineamento)"
    n = len(TESTO); chars = [(ch, dur * i / n, dur * (i + 1) / n) for i, ch in enumerate(TESTO)]

# ---------- 2) gruppi e parole chiave ----------
g, pos = [], 0
for s_, v, *_r in GRUPPI:
    a = pos; b = pos + len(v); pos = b + 1
    ta = chars[a][1] + LEAD; tb = chars[b - 1][2] + LEAD
    g.append({"s": s_, "a": round(ta - 0.05, 3), "b": round(tb, 3), "e": round(ta + (tb - ta) * 0.85, 3)})
K = {}
for nome, gi, parola in CHIAVI:
    a = sum(len(x[1]) + 1 for x in GRUPPI[:gi]); i = GRUPPI[gi][1].find(parola)
    if i < 0: sys.exit(f"parola chiave «{parola}» non trovata nel gruppo {gi}")
    K[nome] = round(chars[a + i][1] + LEAD, 3)
END = round(max(g[-1]["b"] + 2.4, dur + LEAD + 1.5), 2)
open("assets/tempi.js", "w").write("window.TEMPI=" + json.dumps({"g": g, "k": K, "end": END}, ensure_ascii=False) + ";")

# ---------- 3) paesi della zona, da Natural Earth 1:10m (topojson) ----------
def regione(bbox):
    topo = json.load(open("dati/countries-10m.json")); iso = json.load(open("dati/iso_num.json"))
    sc, tr = topo["transform"]["scale"], topo["transform"]["translate"]; arcs = []
    for arc in topo["arcs"]:
        x = y = 0; pts = []
        for dx, dy in arc: x += dx; y += dy; pts.append([round(x * sc[0] + tr[0], 3), round(y * sc[1] + tr[1], 3)])
        arcs.append(pts)
    def ring(ix):
        out = []
        for i in ix:
            a = arcs[i] if i >= 0 else arcs[~i][::-1]
            out += a if not out else a[1:]
        return out
    x0, y0, x1, y1 = bbox; feats = []
    for geo in topo["objects"]["countries"]["geometries"]:
        if geo.get("type") not in ("Polygon", "MultiPolygon"): continue
        polys = [geo["arcs"]] if geo["type"] == "Polygon" else geo["arcs"]
        P = [[ring(r) for r in poly] for poly in polys]
        P = [p for p in P if any(x0 <= x <= x1 and y0 <= y <= y1 for x, y in p[0])]
        if not P: continue
        feats.append({"type": "Feature", "id": iso.get(str(geo.get("id")).zfill(3)) or ("N" + str(geo.get("id"))),
                      "geometry": {"type": "MultiPolygon", "coordinates": P}})
    return feats
M = SC.get("mappa") or {}
bb = M.get("bbox")
feats = regione(bb) if bb and os.path.exists("dati/countries-10m.json") else []  # senza dati/ la mappa piatta usa i confini semplici
open("assets/regione.js", "w").write("window.REGIONE=" + json.dumps(feats, separators=(",", ":")) + ";")
open("assets/sceneggiatura.js", "w").write("window.SC=" + json.dumps(SC, ensure_ascii=False) + ";")

# ---------- 4) index.html ----------
d_globo = round(g[SC["scene"][0]["da"]]["a"] + 0.1, 2) if SC.get("scene") else END
h = open("guscio.html.tpl").read()
for k_, v in {"END": END, "LEAD": LEAD, "D_GLOBO": d_globo}.items(): h = h.replace("{{" + k_ + "}}", str(v))
left = re.findall(r"\{\{\w+\}\}", h)
if left: sys.exit("segnaposto non riempiti: " + ", ".join(sorted(set(left))))
open("index.html", "w").write(h)
print(json.dumps({"ok": True, "motore_tempi": motore, "voce_s": round(dur, 2), "video_s": END, "caratteri": len(TESTO), "modello": (None if SENZA else MODELLO),
                  "paesi_mappa": len(feats), "chiavi": K}, ensure_ascii=False))
