# Prova HyperFrames · clip carburanti (11/11/2026)

Prova, non produzione: nessuna routine la usa. Serve a vedere se le iconografiche fatte con HyperFrames
(https://github.com/heygen-com/hyperframes, Apache 2.0) reggono con la voce vera di Francesco.

Fatti: solo dallo Spiegato pubblicato `carburanti-sconto-a-scadenza` (passi «Va e viene» e «Le accise mobili»).

## Come si fa
```bash
cd prove/hyperframes-carburanti
python3 costruisci.py            # voce ElevenLabs con i tempi (serve ELEVENLABS_API_KEY) -> assets/voce.mp3, assets/tempi.js, index.html
npx -y hyperframes@0.9.33 check --json   # deve dire "ok": true
npx -y hyperframes@0.9.33 render -o clip.mp4
```
Se `render` non trova Chrome: `export HYPERFRAMES_BROWSER_PATH=<percorso di chrome di Playwright>`
(per esempio `find / -path '*chrome-linux*' -name chrome -type f 2>/dev/null | head -1`).

`PROVA_SENZA_VOCE=1 python3 costruisci.py` monta il video con una voce muta e i tempi stimati (solo per provare il montaggio).
