# Read Geopolitics · test pubblico

Sito statico servito da Cloudflare Workers (`read-geopolitics.briefinghub.workers.dev`).

- `public/index.html` — la pagina (legge `data.json`).
- `public/data.json` — i dati del giorno, esportati ogni mattina dalla versione Pro dopo il briefing.
- `scripts/config.json` — data di fine del test, codice GoatCounter, link della lista d'attesa, messaggio di chiusura.
- `scripts/build_data.py` — costruisce `data.json` da un'esportazione del database.

Dopo la data `aperta_fino` la pagina mostra il messaggio di chiusura.
