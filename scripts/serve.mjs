import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = clean.replace(/^\/+/, "");
  const candidates = [];

  if (!relative) {
    candidates.push("index.html");
  } else {
    candidates.push(relative);
    if (!path.extname(relative)) {
      candidates.push(path.join(relative, "index.html"));
      candidates.push(`${relative}.html`);
    }
  }

  for (const candidate of candidates) {
    const resolved = path.resolve(root, candidate);
    if (!resolved.startsWith(root)) continue;
    try {
      const info = await stat(resolved);
      if (info.isFile()) return resolved;
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  try {
    const file = await resolveFile(request.url || "/");
    if (!file) {
      const notFound = await readFile(path.join(root, "404.html")).catch(() => null);
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(notFound || "Not found");
      return;
    }

    const data = await readFile(file);
    const extension = path.extname(file).toLowerCase();
    const cacheControl =
      extension === ".html" ? "no-cache" : "public, max-age=3600, must-revalidate";

    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": cacheControl,
    });
    response.end(data);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://127.0.0.1:${port}`);
});
