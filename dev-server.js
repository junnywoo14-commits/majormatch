/* Tiny local web server — no dependencies, no login.
 * Run it with:  node dev-server.js
 * Then open:    http://localhost:3000
 *
 * It does two jobs:
 *   1. Serves your static files (index.html, css, js).
 *   2. Handles POST /api/advisor by calling the AI (lib/advisor.js).
 *
 * On Vercel this server isn't used — api/advisor.js takes over instead.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { getAdvice } = require("./lib/advisor.js");

// Load the secret key from .env into process.env (Node 21+ has this built in).
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch (e) {
  console.warn("No .env file found — the AI advisor won't work until you add one.");
}

const PORT = 3000;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

const server = http.createServer((req, res) => {
  // --- API route: ask the AI ---
  if (req.method === "POST" && req.url === "/api/advisor") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const text = await getAdvice(payload);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ text }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err.message || err) }));
      }
    });
    return;
  }

  // --- Otherwise: serve a static file ---
  const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.join(__dirname, urlPath);

  // safety: never serve anything outside the project folder
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  MajorMatch running →  http://localhost:${PORT}\n  (press Ctrl+C to stop)\n`);
});
