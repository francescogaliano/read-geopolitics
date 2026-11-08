// Notifiche push del sito (Web Push, RFC 8291 + VAPID RFC 8292), senza librerie: solo WebCrypto.
// Le chiavi VAPID le genera il Worker la prima volta e le tiene nella tabella kv (riga «push_vapid»).

const te = new TextEncoder();
export const b64u = (buf) => { const a = new Uint8Array(buf); let s = ""; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
export const ub64 = (s) => { s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; const b = atob(s), o = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) o[i] = b.charCodeAt(i); return o; };
const cat = (...a) => { const n = a.reduce((s, x) => s + x.length, 0), o = new Uint8Array(n); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}

// Cifratura del contenuto per un abbonamento (aes128gcm, un solo record)
export async function pushEncrypt(p256dh, auth, payload) {
  const uaPub = ub64(p256dh), authS = ub64(auth);
  const as = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, as.privateKey, 256));
  const ikm = await hkdf(authS, ecdh, cat(te.encode("WebPush: info\0"), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, te.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, te.encode("Content-Encoding: nonce\0"), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, cat(te.encode(payload), new Uint8Array([2]))));
  const rs = new Uint8Array(4); new DataView(rs.buffer).setUint32(0, 4096);
  return cat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}

// Chiavi VAPID: { pub (raw, base64url), jwk (privata) }
export async function vapidNew() {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return { pub: b64u(await crypto.subtle.exportKey("raw", kp.publicKey)), jwk: await crypto.subtle.exportKey("jwk", kp.privateKey), at: new Date().toISOString() };
}
export async function vapidHeader(keys, endpoint, sub) {
  const aud = new URL(endpoint).origin;
  const h = b64u(te.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const p = b64u(te.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub })));
  const jwk = { ...keys.jwk }; delete jwk.key_ops;
  const k = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, k, te.encode(h + "." + p));
  return `vapid t=${h}.${p}.${b64u(sig)}, k=${keys.pub}`;
}

// Solo i servizi push dei browser: il Worker non manda richieste ad altri indirizzi
export function pushHostOK(endpoint) {
  try {
    const u = new URL(endpoint);
    if (u.protocol !== "https:") return false;
    return /(^|\.)fcm\.googleapis\.com$|(^|\.)push\.apple\.com$|(^|\.)push\.services\.mozilla\.com$|(^|\.)notify\.windows\.com$|(^|\.)android\.googleapis\.com$/.test(u.hostname);
  } catch (e) { return false; }
}

// Una storia o un aggiornamento corrisponde a quello che il lettore segue?
// «segui» lo calcola il sito: filoni (con i sotto-filoni), paesi (con quelli delle aree seguite), argomenti, incroci {p:[paesi], t:argomento}
export function pushMatch(s, it) {
  if (!s || !it) return false;
  const P = it.paesi || [], A = [].concat(it.ambiti || (it.ambito ? [it.ambito] : []), it.sottoambiti || (it.sottoambito ? [it.sottoambito] : []));
  if (it.filone_id && (s.filoni || []).includes(it.filone_id)) return true;
  if (P.some((c) => (s.paesi || []).includes(c))) return true;
  if (A.some((t) => (s.temi || []).includes(t))) return true;
  return (s.incroci || []).some((x) => x && x.t && A.includes(x.t) && (x.p || []).some((c) => P.includes(c)));
}

export const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/[\s,;:.]+\S*$/, "") + "…" : s; };
