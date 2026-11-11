# Configurar Supabase

Esta guía conecta el proyecto con un proyecto real de Supabase. Dura unos 10 minutos.

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratuita.
2. Crea un proyecto nuevo.
3. Región recomendada: `us-east-1`.
4. Guarda la contraseña de la base de datos en un lugar seguro.

## 2. Obtener las credenciales

En **Project Settings → API** copia:

- **Project URL**: algo como `https://abcdefgh.supabase.co`
- **anon public key**: una cadena larga que empieza por `eyJ...`

> La `service_role` **no se usa** en este proyecto. No la pongas en el frontend ni en `.env.local`.

## 3. Crear las tablas

En **SQL Editor**, ejecuta en este orden:

1. `supabase/migrations/0001_init.sql`
2. `supabase/seed.sql`

El primer script crea:

- Tablas: `profiles`, `blog_posts`, `academic_levels`, `institutional_documents`, `facilities`, `statistics`.
- Enums, triggers e índices.
- Políticas RLS.
- Buckets `images` y `documents` con políticas de Storage.

El segundo inserta los datos iniciales: 8 niveles, documentos, estadísticas, instalaciones y publicaciones de ejemplo.

## 4. Crear el usuario administrador

1. Ve a **Authentication → Users → Add user**.
2. Escribe el correo de la rectora y una contraseña segura.
3. Confirma el usuario.
4. El trigger `handle_new_user` crea el perfil. El primer usuario queda con rol `admin`.

Verifica en **Table Editor → profiles** que el rol sea `admin`.

Si el usuario ya existía antes de ejecutar la migración, crea el perfil manualmente:

```sql
insert into public.profiles (id, email, role)
values ('UUID_DEL_USUARIO', 'correo@dominio.com', 'admin')
on conflict (id) do update set role = 'admin';
```

El UUID se copia desde **Authentication → Users**.

## 5. Desactivar el registro público

En **Authentication → Providers → Email**, desactiva:

```text
Allow new users to sign up
```

Solo la administración debe crear cuentas.

## 6. Configurar las URLs de autenticación

En **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**:
  - `http://localhost:3000/**`
  - `https://tu-sitio.pages.dev/**`
  - `https://tu-dominio.com/**` si tienes dominio propio

Sin esto, el login puede fallar o redirigir mal.

## 7. Crear `.env.local`

En la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
NEXT_PUBLIC_MAP_QUERY=Mza+M+casa+6+Barrio+Jordan+9a+Etapa,+Ibague,+Tolima,+Colombia
```

## 8. Verificar la conexión

```bash
npm run check:supabase
```

Debe mostrar algo como:

```text
✓ Tabla statistics: HTTP 200 · [{"key":"docentes",...}]
✓ Tabla blog_posts: HTTP 200 · [...]
✓ Tabla academic_levels: HTTP 200 · [...]
✓ Auth health: HTTP 200 · ...
```

Si falla, revisa que hayas ejecutado la migración y el seed.

## 9. Ejecutar el proyecto

### Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`. El panel está en `http://localhost:3000/admin/login/`.

### Build estático

```bash
npm run build
npm run preview
```

Abre `http://localhost:3000`. El sitio usa `out/` y no necesita Node en producción.

> Para el hosting, configura las mismas variables en Cloudflare Pages/Netlify **antes** del build. `NEXT_PUBLIC_*` se incrusta en el JavaScript.

## 10. Vista previa `file://`

```bash
npm run build:file
```

Genera `file-preview/index.html`. Sirve para ver el sitio público con doble clic, pero **el login y el CMS no funcionan desde `file://`**. Para administrar contenido usa `npm run dev` o el sitio publicado.

## 11. Probar el login

1. Abre `/admin/login/`.
2. Ingresa el correo y la contraseña del usuario creado.
3. Debes entrar a `/admin/`.
4. Si redirige de vuelta al login:
   - Revisa la URL de Auth en Supabase.
   - Verifica que el perfil tenga rol `admin`.
   - Borra las cookies del sitio y vuelve a intentar.

## 12. Probar RLS

Con la clave anónima, un `insert` debe fallar:

```sql
set role anon;
insert into public.statistics (key, label, value)
values ('docentes', 'Docentes', 999);
```

Con la sesión del administrador debe funcionar.

## 13. Checklist

- [ ] Proyecto de Supabase creado.
- [ ] `0001_init.sql` ejecutado.
- [ ] `seed.sql` ejecutado.
- [ ] Buckets `images` y `documents` creados.
- [ ] Usuario administrador creado.
- [ ] Rol `admin` confirmado en `profiles`.
- [ ] Registro público desactivado.
- [ ] URLs de Auth configuradas.
- [ ] `.env.local` creado.
- [ ] `npm run check:supabase` exitoso.
- [ ] Login funcionando.
- [ ] Publicación de prueba creada.
- [ ] RLS probado.

## Seguridad

- No compartas la contraseña de la base de datos.
- No uses `service_role` en el frontend.
- La `anon key` es pública por diseño; RLS es la protección real.
- Si sospechas que se filtró una credencial, rótala en Supabase.
