"""Costruisce public/beta.html: index.html + il modulo public/esplora.js inserito dentro lo script principale.
Uso: python3 scripts/build_beta.py"""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent / "public"
s = (root / "index.html").read_text(encoding="utf-8")
mod = (root / "esplora.js").read_text(encoding="utf-8")
i = s.find("const S={")
end = s.find("</script>", i)
close = s.rfind("})();", i, end)
assert i > 0 and end > 0 and close > 0, "struttura di index.html cambiata"
s = s[:close] + "\n/* ===== modulo Esplora (prova) ===== */\n" + mod + "\n" + s[close:]
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex,nofollow">', 1)
s = s.replace("</body>", '<div style="position:fixed;left:8px;bottom:8px;z-index:150;font:600 11px/1 ui-monospace,monospace;letter-spacing:.06em;background:#E8B04B;color:#16212A;border-radius:999px;padding:6px 10px;pointer-events:none">VERSIONE DI PROVA</div>\n</body>', 1)
(root / "beta.html").write_text(s, encoding="utf-8")
print("beta.html", len(s), "byte")
