# Guía de despliegue estático

## 1. Crear el repositorio en GitHub

```bash
git init
git add .
git commit -m "feat: plataforma web Jardín Infantil Semillero"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/jardin-semillero.git
git push -u origin main
```

Verifica que `.env.local` y `out/` no se suban al repositorio.

## 2. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto.
2. Región recomendada: `us-east-1`.
3. En **SQL Editor**, ejecuta:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
4. En **Storage**, confirma los buckets `images` y `documents`.
5. En **Authentication → Users**, crea la cuenta de la rectora.
6. Desactiva **Allow new users to sign up**.
7. En **Authentication → URL Configuration**, agrega la URL del sitio estático.
8. Copia `Project URL` y `anon public key`.

## 3. Construir el sitio

Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=https://tu-sitio.pages.dev
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
NEXT_PUBLIC_MAP_QUERY=Mza+M+casa+6+Barrio+Jordan+9a+Etapa,+Ibague,+Tolima,+Colombia
```

Luego:

```bash
npm install
npm run build
```

Se genera la carpeta `out/` con el sitio estático.

> Las variables `NEXT_PUBLIC_*` se incrustan en el build. Configúralas **antes** de construir, tanto en local como en el hosting.

## 4. Desplegar en Cloudflare Pages

1. En Cloudflare, **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecciona el repositorio.
3. Framework preset: **None** o **Next.js (Static HTML Export)**.
4. Build command: `npm run build`.
5. Build output directory: `out`.
6. Agrega las variables de entorno en **Settings → Environment variables**.
7. Despliega.

## 5. Desplegar en Netlify

1. **Add new site → Import an existing project**.
2. Build command: `npm run build`.
3. Publish directory: `out`.
4. Agrega las variables de entorno.
5. Despliega.

## 6. Desplegar en GitHub Pages

GitHub Pages sirve el sitio en `https://usuario.github.io/repositorio/`. Si usas esa ruta, agrega en `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/nombre-del-repositorio",
  assetPrefix: "/nombre-del-repositorio",
  images: { unoptimized: true },
};
```

Crea un workflow que ejecute `npm run build` y publique `out/`. Si usas un dominio propio o Cloudflare/Netlify, no necesitas `basePath`.

## 7. Verificar el despliegue

- [ ] `/` carga y muestra las estadísticas de Supabase.
- [ ] `/blog/` muestra las publicaciones.
- [ ] `/blog/?slug=...` abre el detalle.
- [ ] `/admin/login/` permite iniciar sesión.
- [ ] `/admin/` muestra el panel.
- [ ] Se puede crear una publicación de prueba.
- [ ] El PDF de un temario se descarga.
- [ ] Las imágenes de Supabase cargan.
- [ ] La URL de Supabase Auth coincide con el dominio desplegado.

## 8. Keepalive de Supabase

No hay servidor para ejecutar un cron. Usa un servicio externo gratuito:

1. Crea una cuenta en UptimeRobot o cron-job.org.
2. Configura una petición GET cada 24 horas:

```text
https://TU_PROYECTO.supabase.co/rest/v1/statistics?select=key&limit=1
```

3. Agrega los encabezados:

```text
apikey: TU_ANON_KEY
Authorization: Bearer TU_ANON_KEY
```

Esto mantiene activa la base de datos gratuita.

## 9. Dominio (opcional)

El subdominio del hosting es gratuito. Si el jardín quiere un dominio propio:

1. Compra el dominio.
2. Configúralo en Cloudflare Pages o Netlify.
3. Actualiza `NEXT_PUBLIC_SITE_URL` y la URL de Supabase Auth.
4. Vuelve a construir y desplegar.

Costo aproximado: USD 10–15 al año.

## 10. Backups

Configura un workflow semanal con `pg_dump`:

```yaml
name: Backup Supabase
on:
  schedule:
    - cron: "0 3 * * 0"
  workflow_dispatch:
jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase db dump --db-url "${{ secrets.SUPABASE_DB_URL }}" -f backup.sql
      - uses: actions/upload-artifact@v4
        with:
          name: supabase-backup
          path: backup.sql
          retention-days: 90
```

Guarda `SUPABASE_DB_URL` en **GitHub → Settings → Secrets**.

## 11. Rollback

1. En Cloudflare Pages o Netlify, abre **Deployments**.
2. Selecciona el despliegue anterior.
3. Promuévelo a producción.

Si el problema es de datos, restaura el backup.

## 12. Costos

| Servicio | Plan | Costo |
|---|---|---|
| Cloudflare Pages / Netlify | Free | $0 |
| Supabase | Free | $0 |
| GitHub | Free | $0 |
| Google Maps | Embed | $0 |
| WhatsApp | `wa.me` | $0 |
| Dominio | Opcional | ~USD 10–15/año |

**Total con subdominio gratuito: $0/mes.**

## 13. Checklist final

- [ ] Repositorio en GitHub.
- [ ] `out/` generado y desplegado.
- [ ] Variables de Supabase configuradas en el hosting.
- [ ] Migraciones y seed ejecutados.
- [ ] Usuario administrador creado.
- [ ] Registro público desactivado.
- [ ] URL de Auth configurada.
- [ ] RLS probado.
- [ ] Keepalive externo configurado.
- [ ] Backup configurado.
- [ ] Lighthouse ≥ 70.
- [ ] Manual de usuario entregado.
- [ ] Acta de aceptación firmada.
