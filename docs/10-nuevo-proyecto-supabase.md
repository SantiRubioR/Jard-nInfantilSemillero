# Crear un proyecto de Supabase desde cero

Guía para crear un proyecto nuevo, con un usuario administrador nuevo, y conectar la app en local. Está pensada para un entorno **todavía no productivo**: no se migran datos del proyecto anterior.

> Si más adelante hay que mover datos reales, usa la sección de migración de datos de `docs/09-configuracion-supabase.md` o pide una guía específica.

---

## Resultado esperado

Al terminar:

- Proyecto nuevo de Supabase con tablas, RLS, buckets y datos de ejemplo.
- Un usuario administrador nuevo.
- `.env.local` apuntando al proyecto nuevo.
- Sitio público y panel funcionando en `http://localhost:3000`.

El proyecto anterior se puede dejar intacto hasta validar el nuevo y luego pausarlo o eliminarlo.

---

## 1. Crear el proyecto

1. Entra a <https://supabase.com> con el **otro usuario** (la cuenta que será dueña del proyecto).
2. Crea una organización nueva o usa una existente.
3. Pulsa **New project**:
   - Nombre: `jardin-semillero` (o el que prefieras).
   - Contraseña de base de datos: genera una segura y guárdala.
   - Región: `us-east-1`.
   - Plan: Free.
4. Espera a que termine el aprovisionamiento.

Si el proyecto lo crea otra persona y tú también lo vas a administrar:

1. Esa persona entra a **Organization → Team**.
2. Invita tu correo con rol **Administrator** o **Developer**.

### Guardar credenciales

En **Project Settings → API** (o **API Keys**) copia:

- **Project URL**: `https://NUEVO_REF.supabase.co`
- **Publishable key** (`sb_publishable_...`) o **anon public key** (`eyJ...`)

La app acepta cualquiera de las dos. Usa la publishable si está disponible.

> No uses la `service_role` / secret key en la app ni la pongas en `.env.local`.

---

## 2. Crear el esquema y los datos de ejemplo

En **SQL Editor** del proyecto nuevo, ejecuta en este orden:

1. `supabase/migrations/0001_init.sql`
2. `supabase/seed.sql`

El primer script crea:

- Tablas: `profiles`, `blog_posts`, `academic_levels`, `institutional_documents`, `facilities`, `statistics`.
- Enums, triggers e índices.
- Políticas RLS.
- Buckets públicos `images` y `documents` con sus políticas.

El segundo inserta datos de ejemplo: 8 niveles, documentos, estadísticas, instalaciones y publicaciones.

> **¿Seed sí o no?** Para probar la app, ejecútalo: sin datos las secciones se ven vacías (la app solo usa datos demo cuando no hay Supabase configurado). Es idempotente, así que puedes volver a ejecutarlo sin duplicar filas. Cuando quieras empezar con contenido real, borra las publicaciones de ejemplo desde el panel.

Verifica en **Table Editor** que las 6 tablas existan y en **Storage** que estén los 2 buckets.

### Comprobar RLS

En el **SQL Editor**:

```sql
set role anon;
insert into public.statistics (key, label, value)
values ('docentes', 'Docentes', 999);
```

Debe fallar. Luego:

```sql
reset role;
```

---

## 3. Crear el usuario administrador

1. Ve a **Authentication → Users → Add user**.
2. Escribe el correo y una contraseña segura.
3. Activa **Auto Confirm User**.
4. Crea el usuario.

El trigger `handle_new_user` crea el perfil automáticamente. **El primer usuario de `profiles` queda como `admin`; los siguientes quedan como `editor`.**

Verifica en **Table Editor → profiles** que el rol sea `admin`.

Si quieres que otro usuario también sea administrador:

```sql
update public.profiles
set role = 'admin'
where email = 'otro-admin@dominio.com';
```

> Crea primero el usuario que será administrador y después los demás. Si creas un editor primero, el trigger lo marcará como `admin` y el siguiente quedará como `editor`.

### Configurar Authentication

1. **Authentication → Providers → Email**:
   - Desactiva **Allow new users to sign up**.
   - Deja habilitado el proveedor Email.
2. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` mientras pruebas.
   - **Redirect URLs**: `http://localhost:3000/**`.
   - Cuando exista dominio de producción, agrega también `https://tu-dominio/**` y cambia el Site URL.

---

## 4. Conectar la app en local

### 4.1 Respaldar el entorno actual

```bash
cp .env.local .env.local.backup
```

### 4.2 Editar `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://NUEVO_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
NEXT_PUBLIC_MAP_QUERY=Mza+M+casa+6+Barrio+Jordan+9a+Etapa,+Ibague,+Tolima,+Colombia
```

### 4.3 Reiniciar y verificar

```bash
npm run check:supabase
npm run dev
```

`check:supabase` debe mostrar HTTP 200 en `statistics`, `blog_posts`, `academic_levels` y Auth.

Abre `http://localhost:3000` y prueba:

1. Inicio con estadísticas y publicaciones.
2. `/blog/` y el detalle con `?slug=`.
3. `/admin/login/` con el usuario nuevo.
4. Crear una publicación con imagen.
5. Subir un PDF de temario y descargarlo.
6. Editar y eliminar la publicación de prueba.
7. Confirmar los cambios en el proyecto nuevo.

### 4.4 Verificar el build

```bash
npm run build
npm run preview
```

Abre `http://localhost:3000` de nuevo. Si todo funciona, el proyecto está listo para desplegar cuando quieras.

---

## 5. Cuando pase a producción (más adelante)

1. En Supabase, actualiza **Site URL** y **Redirect URLs** con el dominio real.
2. En el hosting (Cloudflare Pages, Netlify, HelioHost o GitHub Pages), configura:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Vuelve a construir y desplegar. Las variables `NEXT_PUBLIC_*` se incrustan en el build.
4. Configura el keepalive externo (UptimeRobot o cron-job.org):

```text
https://NUEVO_REF.supabase.co/rest/v1/statistics?select=key&limit=1
```

Con los encabezados `apikey` y `Authorization: Bearer <anon-key>`.

5. Cuando el nuevo proyecto esté validado, pausa o elimina el proyecto anterior.

---

## Checklist

- [ ] Proyecto nuevo creado y credenciales guardadas.
- [ ] `0001_init.sql` ejecutado.
- [ ] `seed.sql` ejecutado (recomendado para probar).
- [ ] Buckets `images` y `documents` creados y públicos.
- [ ] Primer usuario creado con rol `admin`.
- [ ] Registro público desactivado.
- [ ] URLs de Auth con `localhost:3000`.
- [ ] `.env.local` actualizado.
- [ ] `npm run check:supabase` exitoso.
- [ ] Login y CRUD probados en local.
- [ ] `npm run build` exitoso.
- [ ] Proyecto anterior pausado/eliminado (cuando ya no se necesite).

---

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `check:supabase` devuelve 401/404 | URL o key incorrecta; esquema no ejecutado | Revisa `.env.local` y ejecuta `0001_init.sql` |
| El login dice credenciales inválidas | Usuario no confirmado | Créalo con **Auto Confirm User** o confírmalo en Auth |
| Entra al panel pero no puede guardar | El perfil no es `admin` | `update public.profiles set role = 'admin' where email = '...'` |
| El sitio se ve vacío | Tablas sin datos | Ejecuta `seed.sql` o crea contenido desde el panel |
| El panel no carga datos | Buckets o RLS mal configurados | Revisa Storage y las políticas del proyecto nuevo |
| El build sigue usando el proyecto anterior | Variables `NEXT_PUBLIC_*` incrustadas | Vuelve a ejecutar `npm run build` |
