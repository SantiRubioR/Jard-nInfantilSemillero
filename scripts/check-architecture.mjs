#!/usr/bin/env node
/**
 * Verificador simple de arquitectura.
 *
 * Reglas:
 * 1. Una feature no importa otra feature.
 * 2. `components/ui`, `components/layout` y `components/feedback` no importan features.
 * 3. `lib` no importa features ni componentes.
 * 4. `app` no importa Supabase directamente ni tipos de base de datos.
 * 5. Los servicios y repositorios no importan React ni Next.
 * 6. No se usan las rutas legacy `@/shared`, `@/widgets`, `@/lib/data` ni `@/lib/client`.
 * 7. `@supabase/*` solo se importa desde `src/lib`.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".mts"]);
const IGNORED = new Set(["node_modules", ".next", "out", "file-preview", "coverage"]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function featureOf(file) {
  const match = file.match(/^features\/([^/]+)\//);
  return match?.[1] ?? null;
}

function isUiFolder(file) {
  return (
    file.startsWith("components/ui/") ||
    file.startsWith("components/layout/") ||
    file.startsWith("components/feedback/")
  );
}

function checkImport(file, importPath) {
  const violations = [];
  const ownFeature = featureOf(file);
  const importedFeature = importPath.match(/^@\/features\/([^/]+)/)?.[1] ?? null;

  if (
    importPath.startsWith("@/shared") ||
    importPath.startsWith("@/widgets") ||
    importPath.startsWith("@/lib/data") ||
    importPath.startsWith("@/lib/client") ||
    importPath.startsWith("@/components/public")
  ) {
    violations.push(`ruta legacy prohibida: ${importPath}`);
  }

  if (ownFeature && importedFeature && ownFeature !== importedFeature) {
    violations.push(
      `la feature "${ownFeature}" importa la feature "${importedFeature}"`,
    );
  }

  if (isUiFolder(file) && importPath.startsWith("@/features")) {
    violations.push(`componente compartido importa una feature: ${importPath}`);
  }

  if (file.startsWith("lib/") && importPath.startsWith("@/features")) {
    violations.push(`lib importa una feature: ${importPath}`);
  }

  if (file.startsWith("lib/") && importPath.startsWith("@/components")) {
    violations.push(`lib importa un componente: ${importPath}`);
  }

  if (file.startsWith("app/")) {
    if (importPath.startsWith("@supabase/")) {
      violations.push(`app importa Supabase directamente: ${importPath}`);
    }

    if (importPath === "@/types/database") {
      violations.push(`app importa tipos de base de datos: ${importPath}`);
    }
  }

  if (
    (file.endsWith(".service.ts") || file.endsWith(".repository.ts")) &&
    (importPath === "react" ||
      importPath.startsWith("react/") ||
      importPath === "next" ||
      importPath.startsWith("next/"))
  ) {
    violations.push(`servicio/repositorio importa framework: ${importPath}`);
  }

  if (importPath.startsWith("@supabase/") && !file.startsWith("lib/")) {
    violations.push(`Supabase fuera de lib: ${importPath}`);
  }

  return violations;
}

function lineAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

async function main() {
  const files = await walk(SRC);
  const violations = [];

  for (const fullPath of files) {
    const file = toPosix(path.relative(SRC, fullPath));
    const text = await readFile(fullPath, "utf8");
    const regex = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      for (const message of checkImport(file, match[1])) {
        violations.push({
          file: `src/${file}`,
          line: lineAt(text, match.index),
          importPath: match[1],
          message,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log(`✔ Arquitectura simple OK: ${files.length} archivos, 0 violaciones.`);
    return;
  }

  console.error(`✖ ${violations.length} violación(es):\n`);
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line}  ${violation.message}\n    → ${violation.importPath}`,
    );
  }
  process.exit(1);
}

main().catch((error) => {
  console.error("Error inesperado en check-architecture:", error);
  process.exit(1);
});
