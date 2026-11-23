/* ai.readgeopolitics.com (23/11/2026). Il dominio sta su Register.it, quindi il sottodominio punta con un CNAME a questo
   progetto Pages, che inoltra ogni richiesta alla sezione IA del worker rg-api. La riscrittura dei percorsi (/ → /ai)
   la fa il worker quando vede l'intestazione x-ai-sottodominio. Qui non c'è altra logica. */
const ORIGINE = "https://rg-api.briefinghub.workers.dev";
export default {
  async fetch(request) {
    const u = new URL(request.url);
    const h = new Headers(request.headers);
    h.set("x-ai-sottodominio", "1");
    h.delete("host");
    const corpo = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
    return fetch(ORIGINE + u.pathname + u.search, { method: request.method, headers: h, body: corpo, redirect: "manual" });
  },
};
