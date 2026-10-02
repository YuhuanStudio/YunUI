import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = dirname(fileURLToPath(import.meta.url));
const files = { "/": "index.html", "/d4.js": "d4.js", "/d4.css": "d4.css", "/yunui-theme.css": "yunui-theme.css", "/LICENSE": "LICENSE" };
const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url ?? "/", "http://localhost");
  const file = requestUrl.pathname === "/" && requestUrl.searchParams.has("_rsc") ? undefined : files[requestUrl.pathname];
  if (!file) {
    // Same-origin proxy for the live current-working-tree docs component. This
    // lets the review page crop it to the real component without editing site.
    const upstreamPath = requestUrl.pathname;
    try {
      const forwardHeaders = {};
      for (const name of ["accept", "accept-language", "rsc", "next-url", "next-router-state-tree", "next-router-prefetch", "next-router-segment-prefetch", "purpose", "x-nextjs-data"]) {
        if (req.headers[name]) forwardHeaders[name] = req.headers[name];
      }
      const response = await fetch(`http://127.0.0.1:3941${upstreamPath}${requestUrl.search}`, { method: req.method, headers: forwardHeaders });
      const contentType = response.headers.get("content-type") ?? "application/octet-stream";
      let body = Buffer.from(await response.arrayBuffer());
      if (contentType.includes("text/html")) {
        const isolatedStyle = `<style id="d4-baseline-before-hydration">#nd-subnav,#nd-sidebar-mobile,#nd-toc,#nd-docs-layout>aside{display:none!important;visibility:hidden!important}#nd-docs-layout{display:block!important}#nd-docs-layout>main{width:100%!important;max-width:none!important;grid-column:1/-1!important}[data-testid="chat-demo-root"]{position:fixed!important;inset:0!important;z-index:2147483647!important;width:100%!important;max-width:none!important;max-height:100%!important;overflow:auto!important;margin:0!important;padding:10px!important;box-sizing:border-box!important;background:var(--bg-base,#fff)!important}</style>`;
        body = Buffer.from(body.toString("utf8").replace(/<head([^>]*)>/i, `<head$1>${isolatedStyle}`));
      } else if (contentType.includes("text/css")) {
        // The current docs shell imports JetBrains Mono from Google Fonts. The
        // review iframe uses the same local system fallback as the draft.
        body = Buffer.from(body.toString("utf8")
          .replace(/@import\s+url\([^)]*fonts\.googleapis\.com[^)]*\)\s*;?/gi, "")
          .replace(/@import\s*["']https?:\/\/fonts\.googleapis\.com[^"']*["']\s*;?/gi, "")
          .replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/gi, ""));
      }
      const headers = { "content-type": contentType, "cache-control": response.headers.get("cache-control") ?? "no-store", "content-length": String(body.byteLength) };
      const location = response.headers.get("location");
      if (location) headers.location = location.replace("http://localhost:3941", "http://localhost:3946").replace("http://127.0.0.1:3941", "http://localhost:3946");
      res.writeHead(response.status, headers); res.end(body); return;
    } catch (error) { res.writeHead(503, { "content-type": "text/plain; charset=utf-8" }); res.end(String(error)); return; }
  }
  try {
    const content = await readFile(join(root, file));
    const type = file.endsWith(".js") ? "text/javascript; charset=utf-8" : file.endsWith(".css") ? "text/css; charset=utf-8" : "text/html; charset=utf-8";
    res.writeHead(200, { "content-type": type, "cache-control": "no-store" }); res.end(content);
  } catch (error) { res.writeHead(503, { "content-type": "text/plain; charset=utf-8" }); res.end(String(error)); }
});
server.listen(3946, "127.0.0.1", () => console.log("D4 draft at http://localhost:3946"));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
