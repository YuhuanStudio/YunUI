import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const siteStatic = join(root, "../../..", "site/.next/static");
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (pathname === "/site.css") {
    try {
      const cssFiles = (await readdir(join(siteStatic, "chunks"))).filter((file) => file.endsWith(".css")).sort();
      if (!cssFiles.length) throw new Error("No compiled site CSS was found. Build yunui-site first.");
      const css = (await Promise.all(cssFiles.map((file) => readFile(join(siteStatic, "chunks", file), "utf8")))).join("\n")
        // The compiled site CSS imports JetBrains Mono from Google. Keep this
        // review preview local-only; the locally compiled Geist faces remain loaded.
        .replace(/@import[^;]*fonts\.googleapis\.com[^;]*;/g, "")
        // Next's CSS refers to sibling media; serve those local compiled files below.
        .replace(/url\(\.\.\/media\/([^)]*)\)/g, "url(/site-media/$1)");
      response.writeHead(200, { "content-type": "text/css; charset=utf-8", "cache-control": "no-store" });
      response.end(css);
    } catch (error) {
      response.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
      response.end(error.message);
    }
    return;
  }
  if (pathname === "/draft.css") {
    response.writeHead(200, { "content-type": "text/css; charset=utf-8", "cache-control": "no-store" });
    response.end(".draft-review-grid{display:grid;grid-template-columns:minmax(0,1fr)}@media(min-width:1280px){.draft-review-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}");
    return;
  }
  if (pathname.startsWith("/site-media/")) {
    const name = decodeURIComponent(pathname.slice("/site-media/".length));
    if (!/^[\w.-]+$/.test(name)) {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Invalid media filename");
      return;
    }
    try {
      const contentType = name.endsWith(".woff2") ? "font/woff2" : name.endsWith(".woff") ? "font/woff" : name.endsWith(".ttf") ? "font/ttf" : name.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream";
      const asset = await readFile(join(siteStatic, "media", name));
      response.writeHead(200, {
        "content-type": contentType,
        "cache-control": "no-store",
      });
      response.end(asset);
    } catch (error) {
      response.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
      response.end(error.message);
    }
    return;
  }
  const file = pathname === "/bundle.js" ? "bundle.js" : pathname === "/" ? "index.html" : null;
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  try {
    const body = await readFile(join(root, file));
    response.writeHead(200, {
      "content-type": file.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    response.end("Prototype bundle is not built yet.");
  }
});

server.listen(3942, "127.0.0.1", () => {
  console.log("YunUI design review prototype at http://localhost:3942");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
