# Despliegue automático con GitHub Actions

Este proyecto se publica como sitio estático (`output: "export"` en `next.config.ts`). El workflow de despliegue compila `out/` y lo sube por FTP a HelioHost cada vez que entra un cambio a `main`.

> La base de datos, Auth y Storage siguen en Supabase. GitHub Actions solo publica archivos estáticos; no ejecuta migraciones ni SQL.

---

## 1. Cómo funciona

```text
Pull request  →  CI: lint + tipos + pruebas + arquitectura + build
Merge a main  →  Deploy
                   ├─ Calidad (reutiliza CI)
                   ├─ Build con variables de producción
                   ├─ Verificación de conexión y ruta remota
                   └─ FTP a HelioHost (out/ → httpdocs)
```

Archivos involucrados:

| Archivo | Función |
|---|---|
| `.github/workflows/ci.yml` | Calidad en cada PR y workflow reutilizable por Deploy. |
| `.github/workflows/deploy.yml` | Se ejecuta en `push` a `main` y manualmente. Compila y despliega. |
| `scripts/upload-heliohost.sh` | Subida por FTP o SFTP con `lftp`, usando `~/.netrc`. |

El job de despliegue usa el environment **`production`**. Si la calidad falla, el despliegue no correrá. Tampoco se ejecutan dos despliegues a la vez (`concurrency`), y un despliegue en curso no se cancela.

---

## 2. Configuración inicial (una sola vez)

En GitHub ve a **Settings → Secrets and variables → Actions**.

### 2.1 Variables (pestaña *Variables*)

Las variables `NEXT_PUBLIC_*` se incrustan en el HTML y JavaScript público; no son secretos. Protégelas con RLS en Supabase, no ocultándolas.

| Variable | ¿Obligatoria? | Ejemplo | Notas |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | `https://abcdefgh.supabase.co` | Project URL de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | `sb_publishable_...` | Clave pública; RLS protege los datos. |
| `NEXT_PUBLIC_SITE_URL` | Sí | `https://jardinsemillero.helioho.st` | También se usa como URL del environment. Debe coincidir con Supabase Auth. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | `573146037663` | Tiene valor por defecto en el código. |
| `NEXT_PUBLIC_MAP_QUERY` | No | `Mza+M+casa+6+...` | Tiene valor por defecto en el código. |
| `NEXT_PUBLIC_DEMO_MODE` | No | `false` | Déjala vacía o en `false` para producción. |
| `HELIOHOST_USER` | Sí | `tu_usuario_plesk` | Usuario de HelioHost. |
| `HELIOHOST_HOST` | No | `tommy2.heliohost.org` | Por defecto: `johnny.heliohost.org`. |
| `HELIOHOST_PROTOCOL` | No | `ftp` | `ftp` (por defecto) o `sftp`. |
| `HELIOHOST_PORT` | No | `21` | Por defecto: `21` para FTP y `1373` para SFTP. Si la defines, debe coincidir con el protocolo. |
| `HELIOHOST_REMOTE` | No | `httpdocs` | Por defecto: `httpdocs`. No uses una barra inicial con FTP. |
| `HELIOHOST_DELETE` | No | `false` | Si es `true`, agrega `--delete` al espejo remoto. |

### 2.2 Secrets (pestaña *Secrets*)

| Secret | ¿Obligatorio? | Valor |
|---|---|---|
| `HELIOHOST_PASSWORD` | Sí | Contraseña de Plesk. Es el único dato realmente secreto del despliegue. |

### 2.3 Servidor y ruta

| Plan HelioHost | Host | FTP | SFTP |
|---|---|---|---|
| Johnny | `johnny.heliohost.org` | `21` | `1373` |
| Tommy | `tommy2.heliohost.org` | `21` | `1373` |
| Morty | `morty2.heliohost.org` | `21` | `1373` |

La carpeta pública del dominio principal es `httpdocs`. Si el sitio vive en un subdominio o dominio addon, `HELIOHOST_REMOTE` debe ser la carpeta de ese dominio.

> En la cuenta actual de Tommy, el SFTP del puerto `1373` expone un home vacío y sin permisos de escritura, así que el despliegue usa **FTP en el puerto `21`**. No definas `HELIOHOST_PORT=1373` si usas FTP.

Prueba el acceso, la ruta y los permisos **sin subir nada**:

```bash
npm run build
npm run deploy:heliohost -- --check
```

También puedes probar solo la conexión:

```bash
lftp -c "open ftp://tu_usuario_plesk@tommy2.heliohost.org:21; ls"
```

### 2.4 Environment `production` (opcional pero recomendado)

El job declara `environment: production`. Puedes crearlo en **Settings → Environments** para:

- Exigir revisores antes de desplegar.
- Limitar qué ramas pueden desplegar.
- Guardar secretos/variables específicos de producción.

Si no lo creas, GitHub lo referencia igualmente; las variables y secrets a nivel de repositorio estarán disponibles.

---

## 3. Uso diario

1. Abre un pull request contra `main`.
2. El workflow **CI** ejecuta lint, tipos, pruebas, verificación de arquitectura y build.
3. Al aprobar y hacer merge, se dispara **Deploy**.
4. Deploy vuelve a ejecutar la calidad, compila con las variables de producción y sube `out/`.
5. Revisa el resumen del run en **Actions → Deploy**.

### Probar en local (sin subir)

```bash
npm run build
npm run deploy:heliohost -- --check
```

`--check` abre la conexión, entra a `HELIOHOST_REMOTE` y lista el contenido. No sube ni borra nada; falla si el protocolo, el puerto o la ruta no son correctos.

Para subir manualmente desde tu máquina (esto sí modifica el servidor):

```bash
npm run deploy:heliohost
```

Requiere un bloque en `~/.netrc` para el host con el usuario y la contraseña.

### Despliegue manual

**Actions → Deploy → Run workflow → rama `main` → Run workflow**.

Úsalo para el primer despliegue o para republicar sin un commit nuevo.

### Activar el borrado de archivos obsoletos

Por seguridad, `HELIOHOST_DELETE` es `false` por defecto: el espejo sube y reemplaza archivos, pero no borra lo que ya no existe en `out/`. Cuando confirmes que `httpdocs` solo contiene el sitio:

1. Crea o edita la variable `HELIOHOST_DELETE` con valor `true`.
2. Vuelve a ejecutar **Deploy**.

Con `--delete`, el script elimina en `httpdocs` todo lo que no esté en `out/`. No lo actives si guardas archivos ajenos al build en esa carpeta.

---

## 4. Verificación después del despliegue

- [ ] El run de **Deploy** terminó en verde.
- [ ] `https://TU_DOMINIO/` carga con estilos y JavaScript (`_next/`).
- [ ] `/blog/` y `/blog/?slug=...` funcionan.
- [ ] `/admin/login/` permite iniciar sesión.
- [ ] `sitemap.xml` y `robots.txt` usan el dominio correcto.
- [ ] Las imágenes y PDF de Supabase cargan.
- [ ] Los datos creados en el CMS aparecen en el sitio.

Las variables `NEXT_PUBLIC_*` se congelan en el build. Si cambias una, debes volver a ejecutar **Deploy**.

---

## 5. Rollback

1. Ve a **Actions → Deploy**.
2. Abre el último run exitoso anterior.
3. Pulsa **Re-run all jobs**.

El rerun usa el mismo commit, reconstruye `out/` y lo vuelve a subir. También puedes hacer un `git revert` del cambio y mergear: el flujo normal desplegará la versión corregida.

> Cada run reconstruye el sitio; `out/` no se guarda como artifact entre ejecuciones.

---

## 6. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Falta configurar ...` | Variable o secret sin definir. | Configúralo en **Settings → Secrets and variables → Actions**. |
| Falla la conexión FTP/SFTP | Usuario, contraseña, host, puerto o protocolo incorrectos. | Ejecuta `npm run deploy:heliohost -- --check` y revisa `HELIOHOST_*`. En Tommy usa FTP `21`; SFTP `1373` no escribe en esta cuenta. |
| `Permission denied` | Contraseña vencida o cuenta suspendida. | Entra a Plesk/HelioHost y restablece el acceso. |
| El sitio muestra datos viejos o de ejemplo | Build sin variables o variables desactualizadas. | Revisa el run y vuelve a desplegar. |
| Faltan estilos o da 404 en rutas internas | No se subió `out/` completo. | Revisa el log de `lftp` y la ruta remota. |
| “HelioHost Account Queued” | Cuenta recién creada o suspendida. | Espera la activación o revisa el estado en HelioHost. |
| Login falla después de desplegar | `NEXT_PUBLIC_SITE_URL` no coincide con Supabase Auth. | Actualiza **Authentication → URL Configuration** en Supabase. |
| Se borraron archivos del servidor | `HELIOHOST_DELETE=true`. | Desactívalo y restaura los archivos necesarios. |

---

## 7. Seguridad

- `HELIOHOST_PASSWORD` solo existe como secret; el workflow lo escribe en `~/.netrc` del runner efímero y no lo imprime.
- La `anon key` de Supabase es pública por diseño. Nunca uses la `service_role` key en variables `NEXT_PUBLIC_*`.
- Mantén RLS activo en todas las tablas y políticas de Storage.
- El workflow solo tiene permiso `contents: read` sobre el repositorio.
- Considera exigir revisores en el environment `production` para evitar despliegues accidentales.
