import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const envPath = path.join(root, ".env.local");

function loadEnvFile() {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawUrl || !anonKey || rawUrl.includes("tu-proyecto")) {
  console.error(`
✗ Falta configurar Supabase.

Crea .env.local con:

NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
`);
  process.exit(1);
}

const baseUrl = rawUrl.replace(/\/$/, "");
const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
};

async function check(name, endpoint) {
  try {
    const response = await fetch(endpoint, { headers });
    const body = await response.text();
    const preview = body.length > 220 ? `${body.slice(0, 220)}…` : body;

    if (response.ok) {
      console.log(`✓ ${name}: HTTP ${response.status} · ${preview || "(sin datos)"}`);
      return true;
    }

    console.error(`✗ ${name}: HTTP ${response.status} · ${preview}`);
    return false;
  } catch (error) {
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

console.log(`Verificando Supabase en ${baseUrl}\n`);

const results = await Promise.all([
  check(
    "Tabla statistics",
    `${baseUrl}/rest/v1/statistics?select=key,label,value&limit=3`,
  ),
  check(
    "Tabla blog_posts",
    `${baseUrl}/rest/v1/blog_posts?select=title,slug&limit=3`,
  ),
  check(
    "Tabla academic_levels",
    `${baseUrl}/rest/v1/academic_levels?select=slug,name&limit=3`,
  ),
  check("Auth health", `${baseUrl}/auth/v1/health`),
]);

if (results.every(Boolean)) {
  console.log(`
✓ Supabase responde correctamente.

Siguiente paso:
  npm run dev
  # o para el build estático:
  npm run build
  npm run preview
`);
  process.exit(0);
}

console.error(`
La conexión falló. Revisa:
1. Que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY sean correctas.
2. Que hayas ejecutado supabase/migrations/0001_init.sql.
3. Que hayas ejecutado supabase/seed.sql.
4. Que las tablas tengan RLS y lectura pública habilitada.
`);
process.exit(1);
