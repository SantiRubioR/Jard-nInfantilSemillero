import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(root, "out");
const previewDir = path.join(root, "file-preview");
const port = 4173;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);
      let pathname = decodeURIComponent(url.pathname);

      if (pathname.endsWith("/")) pathname += "index.html";

      const filePath = path.join(outDir, pathname);
      if (!filePath.startsWith(outDir)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      fs.readFile(filePath, (error, data) => {
        if (error) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }

        res.setHeader("Content-Type", mime[path.extname(filePath)] ?? "application/octet-stream");
        res.end(data);
      });
    });

    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function relativeUrl(currentFile, target) {
  const from = path.dirname(path.join(previewDir, currentFile));
  const to = path.join(previewDir, target);
  return path.relative(from, to).split(path.sep).join("/");
}


function rewriteHtml(html, currentFile, targets, localOrigin) {
  const assetBase = relativeUrl(currentFile, "_next");
  const icon = relativeUrl(currentFile, "icon.svg");

  let output = html.replaceAll(`${localOrigin}/_next/`, `${assetBase}/`);
  output = output.replaceAll('"/_next/', `"${assetBase}/`);
  output = output.replaceAll("'/_next/", `'${assetBase}/`);
  output = output.replaceAll('"/icon.svg', `"${icon}`);
  output = output.replaceAll("'/icon.svg", `'${icon}`);

  // Enlaces con query (blog)
  output = output.replace(
    /href="\/blog\/\?slug=([^"]+)"/g,
    (_match, slug) => {
      const target = targets.get(`/blog/?slug=${slug}`);
      return target
        ? `href="${relativeUrl(currentFile, target)}"`
        : `href="${relativeUrl(currentFile, "blog/index.html")}?slug=${slug}"`;
    },
  );

  output = output.replace(
    /href="\/blog\/\?categoria=([^"]+)"/g,
    (_match, category) => {
      const target =
        category === "evento"
          ? "blog/eventos/index.html"
          : category === "circular"
            ? "blog/circulares/index.html"
            : "blog/index.html";
      return `href="${relativeUrl(currentFile, target)}"`;
    },
  );

  // Rutas conocidas. Primero las más específicas.
  const routes = [...targets.keys()]
    .filter((route) => !route.includes("?"))
    .sort((a, b) => b.length - a.length);

  for (const route of routes) {
    const target = targets.get(route);
    if (!target) continue;
    const rel = relativeUrl(currentFile, target);
    output = output.replaceAll(`href="${route}"`, `href="${rel}"`);
    if (route !== "/") {
      const withoutSlash = route.replace(/\/$/, "");
      output = output.replaceAll(`href="${withoutSlash}"`, `href="${rel}"`);
    }
  }

  // Archivos de la raíz
  output = output.replaceAll('href="/sitemap.xml"', `href="${relativeUrl(currentFile, "sitemap.xml")}"`);
  output = output.replaceAll('href="/robots.txt"', `href="${relativeUrl(currentFile, "robots.txt")}"`);

  // Fuentes locales bloqueadas por CORS en file://: usar fallback del sistema.
  output = output.replace(/<link[^>]+as="font"[^>]*>/g, "");
  output = output.replace(/<link[^>]+\.woff2[^>]*>/g, "");

  // La vista previa es un snapshot: se quitan los scripts de React y se deja
  // un único script para el menú móvil.
  output = output.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const menuScript = `<script>
(function () {
  document.addEventListener("click", function (event) {
    var button = event.target.closest('[aria-controls="menu-movil"]');
    if (!button) return;
    var menu = document.getElementById("menu-movil");
    if (!menu) return;
    var isHidden = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !isHidden);
    button.setAttribute("aria-expanded", String(isHidden));
    button.setAttribute("aria-label", isHidden ? "Cerrar menú" : "Abrir menú");
  });
})();
</script>`;
  output = output.replace("</body>", `${menuScript}</body>`);

  return output;
}

async function main() {
  if (!fs.existsSync(outDir)) {
    throw new Error("No existe out/. Ejecuta `npm run build` primero.");
  }

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const localOrigin = `http://127.0.0.1:${port}`;

  const rendered = new Map();

  async function render(route) {
    await page.goto(`${localOrigin}${route}`, {
      waitUntil: "load",
      timeout: 60_000,
    });
    await page.waitForTimeout(900);
    return page.content();
  }

  const baseRoutes = [
    ["/", "index.html"],
    ["/educacion/", "educacion/index.html"],
    ["/nosotros/", "nosotros/index.html"],
    ["/blog/", "blog/index.html"],
    ["/blog/?categoria=evento", "blog/eventos/index.html"],
    ["/blog/?categoria=circular", "blog/circulares/index.html"],
    ["/contacto/", "contacto/index.html"],
    ["/admin/login/", "admin/login/index.html"],
    ["/admin/", "admin/index.html"],
  ];

  const targets = new Map(baseRoutes);

  const blogHtml = await render("/blog/");
  rendered.set("blog/index.html", blogHtml);

  const slugs = new Set(
    [...blogHtml.matchAll(/\/blog\/\?slug=([^"&]+)/g)].map((match) => match[1]),
  );

  for (const slug of slugs) {
    targets.set(`/blog/?slug=${slug}`, `blog/${slug}/index.html`);
  }

  for (const [route, file] of baseRoutes) {
    if (rendered.has(file)) continue;
    rendered.set(file, await render(route));
  }

  for (const slug of slugs) {
    const route = `/blog/?slug=${slug}`;
    const file = targets.get(route);
    if (!file) continue;
    rendered.set(file, await render(route));
  }

  await browser.close();
  server.close();

  fs.rmSync(previewDir, { recursive: true, force: true });
  fs.cpSync(outDir, previewDir, { recursive: true });

  for (const [file, html] of rendered) {
    const destination = path.join(previewDir, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, rewriteHtml(html, file, targets, localOrigin));
  }

  for (const css of fs.globSync("**/*.css", { cwd: previewDir })) {
    const file = path.join(previewDir, css);
    const text = fs.readFileSync(file, "utf8").replace(/@font-face\s*\{[^}]*\}/g, "");
    fs.writeFileSync(file, text);
  }

  console.log(`file-preview listo: ${previewDir}`);
  console.log(`Páginas: ${rendered.size}`);
  console.log(`Detalles de blog: ${slugs.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
