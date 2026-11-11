# Kit «iconografiche Read Geopolitics» su HyperFrames · v1 (prova, 11/11/2026)

Prova, non produzione: nessuna routine lo usa ancora.
Una sceneggiatura JSON descrive frasi (testo a schermo + testo letto), parole chiave e scene a blocchi.
`costruisci.py` fa la voce di Francesco (ElevenLabs, tempi carattere per carattere), prende i paesi della zona
(Natural Earth 1:10m, `dati/`) e scrive `index.html`; `assets/rg.js` monta tutto su una timeline HyperFrames.

    python3 costruisci.py sceneggiature/hormuz.json     # serve ELEVENLABS_API_KEY
    npx -y hyperframes@0.9.33 check --json               # deve dire "ok": true
    npx -y hyperframes@0.9.33 render -o clip.mp4

Se render non trova Chrome: export HYPERFRAMES_BROWSER_PATH=$(find / -path '*chrome-linux*' -name chrome -type f 2>/dev/null | head -1)
PROVA_SENZA_VOCE=1 monta con voce muta e tempi stimati.

Blocchi nella scena: numero, giorni, barra, barre, fila, timbro, scelta, firma.
Blocchi sulla mappa: nomi, etichetta, accendi, rotta, misura, navi (ferma/torna), sbarramento.
Tempi: secondi, "g3" (inizio gruppo 3), "g3.b" (fine), "k:nome" (parola chiave), "s" (inizio scena), con +0.4 / -0.2.
