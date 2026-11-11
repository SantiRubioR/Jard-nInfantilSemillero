# Manual técnico

## Requisitos

- Node.js 20 o superior (solo para desarrollar y construir).
- npm 10 o superior.
- Cuenta gratuita en Supabase.
- Cuenta gratuita en Cloudflare Pages, Netlify o GitHub Pages.
- Git y GitHub.

> En producción **no se ejecuta Node**. El resultado del build (`out/`) son archivos HTML, CSS y JS.

## Instalación local

```bash
git clone <URL_DEL_REPOSITORIO>
cd jardin-semillero
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. Sin variables de Supabase funciona en modo demostración.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=https://tu-sitio.pages.dev
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
NEXT_PUBLIC_MAP_QUERY=Mza+M+casa+6+Barrio+Jordan+9a+Etapa,+Ibague,+Tolima,+Colombia
# Opcional: fuerza el modo demo aunque existan credenciales.
# NEXT_PUBLIC_DEMO_MODE=true
```

Todas son `NEXT_PUBLIC_*` porque se usan en el navegador. Se incrustan en el build; si cambian, reconstruye. `NEXT_PUBLIC_DEMO_MODE=true` es útil para E2E y presentaciones: selecciona los adaptadores demo aunque haya credenciales configuradas.

No se usa `service_role`. No agregues secretos privados al frontend.

## Base de datos

1. Crea el proyecto en Supabase.
2. En **SQL Editor**, ejecuta:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
3. Verifica los buckets `images` y `documents`.
4. Verifica que las 6 tablas tengan RLS activo.

### Crear el usuario administrador

1. **Authentication → Users → Add user**.
2. Correo y contraseña segura.
3. El trigger crea el perfil; el primer usuario queda como `admin`.
4. Si el usuario ya existía, inserta el perfil:

```sql
insert into public.profiles (id, email, role)
values ('UUID_DEL_USUARIO', 'correo@dominio.com', 'admin')
on conflict (id) do update set role = 'admin';
```

5. Desactiva **Allow new users to sign up**.
6. En **Authentication → URL Configuration**, agrega la URL del sitio estático.

## Build estático

```bash
npm run build
```

Genera `out/`. Para previsualizar:

```bash
npm run preview
# equivale a: python3 -m http.server 3000 --directory out
```

Abre `http://localhost:3000`.

### Abrir con doble clic (`file://`)

`out/` es el build para hosting y debe servirse por HTTP/HTTPS. No lo abras con `file://`: reescribir sus rutas rompe la hidratación de React y el login.

Para abrir con doble clic usa:

```bash
npm run build:file
```

Se genera `file-preview/index.html`, con las páginas públicas y los detalles del blog como HTML estático. El CMS y el login no funcionan desde `file://`.

### Estructura del build

```
out/
├── index.html
├── educacion/index.html
├── nosotros/index.html
├── blog/index.html
├── contacto/index.html
├── admin/index.html
├── admin/login/index.html
├── _next/...
├── robots.txt
└── sitemap.xml
```

## Scripts

```bash
npm run dev        # desarrollo (Node, solo local)
npm run build      # exportación estática a out/
npm run preview    # sirve out/ con Python
npm run build:file # genera file-preview/ para abrir con doble clic
npm run lint
npm run typecheck
npm run test       # Vitest: servicios y reglas (AAA)
npm run test:e2e   # Playwright: rutas públicas y panel demo
npm run arch:check # límites entre features y lib
npm run check      # lint + typecheck + test + arch + build
```

## Estructura del código

El proyecto se organiza por **feature**. Consulta `docs/01-arquitectura.md` para el detalle.

### Archivos de una feature
Cada feature tiene archivos planos y una carpeta de componentes:

```text
src/features/blog/
├── blog.types.ts        # modelo
├── blog.schemas.ts      # validación Zod
├── blog.repository.ts   # Supabase o datos demo
├── blog.rules.ts        # reglas puras de crear/editar
├── blog.service.ts      # casos de uso / controller
├── blog.hooks.ts        # view models (MVVM)
├── blog.demo.ts         # datos de demostración
├── components/          # views
└── index.ts             # API pública
```

### Servicios
Los servicios orquestan validación, storage y repositorio. Ejemplo:

```ts
const result = await createPost(input);

if (result.ok) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
```

No conocen React ni Next.

### Repositorios
Los repositorios eligen Supabase o datos demo:

```text
src/features/blog/blog.repository.ts
src/features/statistics/statistics.repository.ts
src/features/facilities/facilities.repository.ts
```

`@supabase/*` solo se importa desde `src/lib`.

### Presentación
Cada pantalla con estado tiene un hook:

```text
src/features/blog/blog.hooks.ts
src/features/blog/components/blog-list.tsx
```

La View no llama a Supabase ni contiene reglas de negocio.

### Autenticación
- `src/features/auth/auth.repository.ts`: login, logout y sesión.
- `src/features/auth/auth.hooks.ts`: guard del panel y formulario de login.
- `src/app/admin/_components/admin-shell.tsx`: composición visual del panel.

No hay Server Actions ni endpoints propios. Todo se ejecuta con la sesión del navegador y RLS.

## Cómo agregar un campo

Ejemplo: `author_name` en `blog_posts`.

1. Migración:

```sql
alter table public.blog_posts add column author_name text;
```

2. Regenera los tipos:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

3. Agrega el campo a `src/features/blog/blog.types.ts`.
4. Actualiza los tipos de creación/edición en `src/features/blog/blog.repository.ts`.
5. Agrega el campo a `createPost` y `updatePost` en `src/features/blog/blog.service.ts`.
6. Agrega el campo al formulario en `src/features/blog/components/blog-post-form.tsx`.
7. Agrega una prueba en `tests/` siguiendo AAA.
8. Ejecuta `npm run check`.

## Problemas frecuentes

### “Supabase no está configurado en este build”
Faltan las variables al momento de `npm run build`. Créalas en `.env.local` o en el hosting y reconstruye.

### El login no redirige
Verifica el usuario en **Authentication → Users**, el perfil con rol `admin` y la URL de Auth del sitio.

### “No se pudo subir el archivo”
Revisa tamaño, tipo, bucket y políticas de Storage.

### Las imágenes de Supabase no cargan
En exportación estática `next/image` usa `unoptimized`. Verifica que la URL sea pública y que el bucket tenga lectura pública.

### El panel redirige a login aunque ya inicié sesión
Revisa la URL de Supabase Auth y que el dominio del sitio esté autorizado. También puedes limpiar las cookies del sitio.

### El sitio se ve con datos de ejemplo
El build se hizo sin variables de Supabase o la consulta falló. Revisa la consola del navegador y reconstruye.

### Error de RLS al guardar
El usuario no tiene rol `admin` o las políticas no se ejecutaron. Verifica:

```sql
select public.is_admin();
```

## Backup

Usa el workflow de `docs/07-despliegue.md` o exporta manualmente:

```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --no-owner --no-privileges > backup.sql
```

## Comandos útiles

```bash
npm run lint && npm run typecheck && npm run build
git checkout -b feat/mi-cambio
git push origin main
```

## Recursos

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Netlify](https://docs.netlify.com/)
