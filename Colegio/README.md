# Jardín Infantil Semillero · Plataforma web estática + CMS

Plataforma informativa y pedagógica con módulo administrable (CMS) para el **Jardín Infantil Semillero de Ibagué**. El sitio se exporta como **HTML, CSS y JavaScript estáticos** y se puede publicar en Cloudflare Pages, Netlify, GitHub Pages o cualquier hosting estático, **sin servidor Node en producción**.

El CMS funciona directamente contra **Supabase** desde el navegador: autenticación, base de datos PostgreSQL, Storage y políticas RLS.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Exportación | `output: "export"` → carpeta `out/` |
| Backend / datos | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Hosting | Cloudflare Pages, Netlify o GitHub Pages (gratis) |
| Calidad | ESLint, TypeScript, Lighthouse, axe |

**Costo de producción:** $0/mes con un subdominio gratuito del hosting. Un dominio propio es opcional.

> El build se genera con Node.js, pero el sitio publicado **no necesita Node**. Se sirve como archivos estáticos.

## Cómo funciona sin servidor

```
Navegador
   ├── HTML/CSS/JS estáticos (out/)
   └── Supabase JS (clave anónima + RLS)
         ├── Auth: login de la rectora
         ├── PostgreSQL: contenido
         └── Storage: PDFs e imágenes
```

- El sitio público se genera en `out/` y carga los datos desde Supabase al abrir la página.
- El panel `/admin/` también es estático; verifica la sesión en el navegador y escribe en Supabase.
- Las políticas RLS impiden que un visitante anónimo modifique datos, aunque abra la URL del panel.
- El detalle de una publicación usa `?slug=` en `/blog/`, de modo que las publicaciones nuevas funcionan sin reconstruir el sitio.

El código se organiza por **feature** (`blog`, `statistics`, `academic-levels`, `institutional-documents`, `facilities`, `auth`). Cada feature separa modelo (`types`), validación (`schemas`), datos (`repository`), reglas (`service`), estado de pantalla (`hooks`) y vistas (`components`). La regla de dependencia se verifica con `npm run arch:check`. Ver [Arquitectura](docs/01-arquitectura.md) y [ADR 0001](docs/adr/0001-feature-first-clean-mvvm.md).

## Funcionalidades

### Sitio público
- `/` Inicio: hero, pilares, estadísticas, galería y últimas publicaciones.
- `/educacion/`: acordeón de 8 niveles con horario y descarga de temarios.
- `/nosotros/`: manual de convivencia, resolución, uniformes y galería.
- `/blog/`: filtros Todos / Eventos / Circulares.
- `/blog/?slug=...`: detalle de una publicación.
- `/contacto/`: datos, mapa embebido y WhatsApp.
- Botón flotante de WhatsApp.
- SEO: metadatos, `sitemap.xml`, `robots.txt`, Open Graph.

### Panel administrativo
- `/admin/login/`: autenticación con Supabase Auth.
- `/admin/`: resumen y accesos rápidos.
- `/admin/estadisticas/`: contadores de inicio.
- `/admin/educacion/`: temarios PDF.
- `/admin/nosotros/`: manual, resolución y galería.
- `/admin/blog/`: CRUD de eventos y circulares, con imagen o PDF.

### Modo demostración
Si el build no incluye las variables de Supabase, el sitio usa datos de ejemplo y el panel es navegable sin guardar cambios. Sirve para presentar la interfaz antes de conectar la base de datos.

## Inicio rápido

Requisitos para desarrollar/construir: Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

### Generar el sitio estático

```bash
npm run build
```

El resultado queda en `out/`. Para previsualizarlo sin Node:

```bash
python3 -m http.server 3000 --directory out
```

> `npm run preview` hace lo mismo. Python solo se usa para previsualizar; el sitio publicado es estático.

### Abrir con doble clic (`file://`)

El build `out/` es para **hosting**, no para abrirlo con `file://`: si se reescriben sus rutas se rompe la hidratación de React y el login deja de funcionar.

Para abrir el sitio con doble clic usa una vista estática separada:

```bash
npm run build:file
```

Esto genera:

```text
file-preview/index.html
```

Esa versión incluye las páginas públicas y los detalles del blog como HTML estático. Ábrela directamente con doble clic.

Limitaciones de `file://`:

- El panel administrativo, el login y el CRUD no funcionan desde `file://`.
- Es una fotografía estática; no se actualiza sola con Supabase.
- Para el CMS usa `out/` en un hosting (HelioHost, Cloudflare, Netlify) o `npm run dev`.

La primera vez instala el navegador de Playwright para `build:file`:

```bash
npx playwright install chromium
```

### Subir el build a HelioHost

El proyecto incluye un script para subir `out/` por SFTP:

```bash
./scripts/upload-heliohost.sh
```

Por defecto usa:

```text
Host:   johnny.heliohost.org
Puerto: 1373
Remoto: httpdocs
Local:  out
```

Para el plan Tommy usa `--host tommy2.heliohost.org`. Si tu dominio usa otra ruta, cámbiala con `--remote`.

La contraseña se lee desde `~/.netrc`. También puedes usar variables o flags:

```bash
HELIOHOST_USER=tu_usuario ./scripts/upload-heliohost.sh
./scripts/upload-heliohost.sh --host tommy2.heliohost.org --user tu_usuario
./scripts/upload-heliohost.sh --local out --remote httpdocs
./scripts/upload-heliohost.sh --delete
```

`--delete` borra en el servidor los archivos que ya no existan en `out/`. Úsalo con cuidado.

Ver ayuda:

```bash
./scripts/upload-heliohost.sh --help
```

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (región recomendada: `us-east-1`).
2. En **SQL Editor**, ejecuta:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
3. En **Authentication → Providers → Email**, desactiva **Allow new users to sign up**.
4. En **Authentication → Users → Add user**, crea la cuenta de la rectora. El primer usuario queda como `admin`.
5. En **Project Settings → API**, copia la URL y la clave anónima.
6. En **Authentication → URL Configuration**, agrega la URL de tu sitio estático (por ejemplo `https://tu-sitio.pages.dev`) como `Site URL` y `Redirect URL`.
7. Crea `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=https://tu-sitio.pages.dev
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
```

8. Vuelve a construir el sitio:

```bash
npm run build
```

> Las variables `NEXT_PUBLIC_*` se incrustan en el JavaScript del build. Si cambias Supabase o la URL del sitio, debes reconstruir.

## Despliegue estático

### Cloudflare Pages (recomendado)
1. Sube el repositorio a GitHub.
2. En Cloudflare Pages, conecta el repositorio.
3. Build command: `npm run build`.
4. Build output directory: `out`.
5. Agrega las variables de entorno de Supabase en **Settings → Environment variables**.
6. Despliega.

### Netlify
- Build command: `npm run build`
- Publish directory: `out`
- Variables de entorno: las mismas.

### GitHub Pages
- Configura un workflow que ejecute `npm run build` y publique `out/`.
- Si el sitio queda en `https://usuario.github.io/repositorio/`, configura `basePath` y `assetPrefix` en `next.config.ts` con el nombre del repositorio. Para un dominio propio o Cloudflare/Netlify no es necesario.

## Continuidad de Supabase

Al no haber servidor, no hay cron propio. Para evitar que Supabase pause el proyecto gratuito por inactividad:

1. Crea una cuenta gratuita en UptimeRobot o cron-job.org.
2. Configura una petición GET cada 24 horas a:

```text
https://TU_PROYECTO.supabase.co/rest/v1/statistics?select=key&limit=1
```

3. Agrega los encabezados:

```text
apikey: TU_ANON_KEY
Authorization: Bearer TU_ANON_KEY
```

Eso mantiene activa la base de datos sin servidor propio.

## Seguridad

- El panel es estático, pero **RLS es la verdadera protección**.
- La clave anónima es pública; no permite escribir sin sesión de administrador.
- La `service_role` **no se usa** y no debe incluirse en el frontend.
- Desactiva el registro público de Supabase.
- Valida archivos: imágenes hasta 5 MB y PDF hasta 10 MB.
- Revisa `docs/03-seguridad-rls.md`.

## Estructura

```
src/
├── app/                   # Rutas Next.js delgadas (admin/_components: shell y dashboard)
├── components/
│   ├── ui/                # Design system
│   ├── layout/            # Header, footer, hero, logo, mapa
│   ├── feedback/          # Mensajes y botones de formulario
│   └── admin/             # Encabezado de página del panel
├── features/              # Una carpeta por funcionalidad
│   ├── blog/
│   │   ├── blog.types.ts
│   │   ├── blog.rules.ts
│   │   ├── blog.schemas.ts
│   │   ├── blog.repository.ts
│   │   ├── blog.service.ts
│   │   ├── blog.hooks.ts
│   │   ├── blog.demo.ts
│   │   ├── components/
│   │   └── index.ts
│   ├── statistics/
│   ├── academic-levels/
│   ├── institutional-documents/
│   ├── facilities/
│   └── auth/
├── lib/                   # Supabase, storage, utilidades y configuración
└── types/                 # Tipos de Supabase
supabase/
├── migrations/0001_init.sql
└── seed.sql
out/                       # Build estático (generado, no se versiona)
docs/
```

## Scripts

```bash
npm run dev        # desarrollo con Node (solo local)
npm run build      # genera out/ estático
npm run preview    # sirve out/ con Python
npm run lint
npm run typecheck
npm run test       # Vitest: servicios y reglas (patrón AAA)
npm run test:e2e   # Playwright: rutas y panel demo
npm run arch:check # Límites entre features y capas
npm run check      # lint + typecheck + test + arch + build
```

## Documentación

- [Arquitectura](docs/01-arquitectura.md)
- [Análisis y plan de refactorización](docs/11-analisis-y-plan-arquitectura.md)
- [ADR 0001: feature-first + Clean Architecture + MVVM](docs/adr/0001-feature-first-clean-mvvm.md)
- [Modelo entidad-relación](docs/02-modelo-er.md)
- [Seguridad y RLS](docs/03-seguridad-rls.md)
- [Manual de usuario](docs/04-manual-usuario.md)
- [Manual técnico](docs/05-manual-tecnico.md)
- [Plan de pruebas](docs/06-plan-pruebas.md)
- [Despliegue](docs/07-despliegue.md)
- [Plan de desarrollo](docs/08-plan-desarrollo.md)
- [Configurar Supabase](docs/09-configuracion-supabase.md)
- [Crear un proyecto Supabase desde cero](docs/10-nuevo-proyecto-supabase.md)
- [Desplegar en HelioHost](docs/12-despliegue-heliohost.md)

## Límites gratuitos

- **Supabase Free:** ~500 MB de base de datos, 1 GB de Storage, 2 proyectos. Se pausa tras varios días sin actividad; usa el ping externo.
- **Cloudflare Pages / Netlify:** ancho de banda y builds gratuitos dentro de sus límites.
- **Google Maps:** mapa embebido sin API key, sin facturación.
- **WhatsApp:** enlace `wa.me`, sin la API oficial de pago.
- **Imágenes:** se recomienda comprimirlas y no almacenar videos.

Hecho con cariño para la comunidad educativa del Jardín Infantil Semillero.
