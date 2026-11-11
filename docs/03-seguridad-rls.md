# Seguridad y RLS

## Modelo de roles

| Rol | Acceso | Autenticación |
|---|---|---|
| Público | Consulta de contenido publicado, PDFs y galería | No |
| Administrador (rectora) | CRUD completo del CMS y Storage | Sí, Supabase Auth |
| Editor | Perfil reservado para futuras cuentas de apoyo | Sí, sin uso actual |

El rol se guarda en `public.profiles.role`. La función `public.is_admin()` consulta ese rol y se usa en todas las políticas de escritura.

## Autenticación

1. La rectora ingresa correo y contraseña en `/admin/login`.
2. El formulario de login llama a `supabase.auth.signInWithPassword` desde el navegador.
3. Supabase emite cookies de sesión gestionadas por `@supabase/ssr`.
4. El layout de `src/app/admin/(panel)/layout.tsx` verifica la sesión en el navegador.
5. Si no hay usuario, redirige a `/admin/login/`.
6. La protección real de los datos la aplican las políticas RLS en Supabase.

El registro público está desactivado. La cuenta se crea manualmente desde Supabase.

## Row Level Security

Todas las tablas tienen RLS habilitado.

### Lectura pública

| Tabla | Regla |
|---|---|
| `blog_posts` | `is_published = true` |
| `academic_levels` | Todo |
| `institutional_documents` | Todo |
| `facilities` | `is_active = true` |
| `statistics` | Todo |
| `profiles` | Solo el propio perfil o admin |

### Escritura

Las políticas `*_admin_write` permiten `insert`, `update` y `delete` solo si `public.is_admin()` es verdadero.

La función es `security definer` con `search_path = public`, para que pueda leer `profiles` sin exponer la tabla.

### Storage

| Operación | Buckets | Regla |
|---|---|---|
| Lectura | `images`, `documents` | Público |
| Escritura / borrado | `images`, `documents` | `public.is_admin()` |

## Validación de archivos

Se valida en el cliente antes de subir (`src/lib/storage.ts`). RLS y Storage son la frontera final:

| Tipo | Formatos | Tamaño máximo |
|---|---|---|
| Imagen | JPG, PNG, WebP | 5 MB |
| PDF | `application/pdf` | 10 MB |

Al reemplazar un archivo se elimina el anterior de Storage. Al eliminar una publicación o instalación se borran sus archivos asociados.

## Secretos

| Variable | Dónde vive | Se expone al cliente |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` / hosting | Sí, es pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` / hosting | Sí, protegida por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **No se usa** | No |

> Nunca agregues la `service_role` a una variable `NEXT_PUBLIC_*` ni la incluyas en el repositorio. Este proyecto no la necesita.

## Checklist de seguridad

- [ ] RLS habilitado en las 6 tablas.
- [ ] Lectura pública limitada a contenido publicado/activo.
- [ ] `insert`, `update` y `delete` solo para `admin`.
- [ ] Registro público deshabilitado en Supabase Auth.
- [ ] Contraseña fuerte para la rectora.
- [ ] `/admin` redirige a login sin sesión.
- [ ] La clave anónima no puede escribir (probar en SQL Editor con `set role anon`).
- [ ] Archivos validados por tipo y tamaño.
- [ ] Variables de entorno fuera de Git (`.env*` ignorado, excepto `.env.example`).
- [ ] Variables `NEXT_PUBLIC_*` configuradas antes del build estático.
- [ ] Buckets públicos solo para lectura.
- [ ] Dependencias revisadas con `npm audit`.

## Prueba rápida de RLS

En el SQL Editor de Supabase:

```sql
-- Debe devolver solo publicaciones publicadas
set role anon;
select title, is_published from public.blog_posts;

-- Debe fallar por RLS
insert into public.statistics (key, label, value)
values ('docentes', 'Docentes', 999);

reset role;
```

Con una sesión autenticada de administrador, el mismo `insert` debe funcionar.

## Respuesta ante incidentes

1. Si se filtra la clave anónima, no es crítico: RLS bloquea la escritura. Aun así, rota la clave en Supabase.
2. Si se filtra una contraseña de administrador, cámbiala desde Supabase Auth y cierra todas las sesiones.
3. Si se sube un archivo malicioso, elimínalo desde Storage y revisa los logs.
4. Si Supabase pausa el proyecto, reactívalo desde el dashboard y verifica el cron.
