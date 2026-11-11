# Desplegar el sitio en HelioHost

Guía para crear una cuenta nueva en HelioHost y publicar el build estático de la app.

> **Importante:** HelioHost solo sirve los archivos estáticos de `out/`. La base de datos, Auth y Storage siguen en Supabase. En HelioHost **no** se ejecuta SQL ni se migra la base de datos.

---

## 1. Elegir el plan

HelioHost es una organización sin ánimo de lucro. Los planes actuales:

| Plan | Costo | Indicado para |
|---|---|---|
| **Johnny** | Gratis | Pruebas o presupuesto cero. Los cupos de registro abren a las 00:00 y 12:00 UTC y se llenan rápido. |
| **Tommy** | Donación única de $2 USD | Producción. Registro disponible en cualquier momento y mejor estabilidad. |
| **Morty** | Desde $1 USD/mes | Producción con más recursos y varios dominios. |

Para un sitio institucional, **Tommy** es la opción más cómoda: evitas la carrera por un cupo gratuito y tienes mejor disponibilidad.

> En Johnny y Tommy solo se permite **una cuenta por persona**. Si ya tienes una cuenta activa, reutilízala o pide autorización antes de crear otra.

---

## 2. Crear la cuenta

1. Entra a <https://heliohost.org/signup/>.
2. Elige el servidor:
   - **Johnny**: pulsa el botón cuando abra el cupo. Los horarios son 00:00 y 12:00 UTC (en Colombia: 19:00 y 07:00).
   - **Tommy**: dona $2 y continúa con el registro.
3. Completa el formulario:
   - **Usuario**: será tu usuario de Plesk y de SFTP. No uses información privada; el usuario puede ser visible en el foro de soporte.
   - **Contraseña**: será también la contraseña de SFTP.
   - **Email**: uno real, para la activación y la recuperación.
   - **Dominio principal**: puedes usar un subdominio gratuito de HelioHost (por ejemplo `jardinsemillero.helioho.st` o `jardinsemillero.heliohost.us`) o un dominio propio.
4. Espera la activación. Puede tardar **hasta 2 horas**.
5. Consulta el estado en <https://heliohost.org/status/>.

### Datos que debes guardar

```text
Servidor:   johnny | tommy
Usuario:    tu_usuario
Contraseña: tu_contraseña
Dominio:    https://tu-dominio.helioho.st
```

---

## 3. Entrar a Plesk y ubicar los archivos

1. Entra a <https://heliohost.org/login/> con tu usuario y contraseña.
2. Abre **Plesk**.
3. Ve a **Websites & Domains → tu dominio**.
4. La carpeta pública del dominio principal es **`httpdocs`**.
5. Si usas un subdominio o dominio addon, los archivos van en una carpeta con el nombre del dominio, **no** en `httpdocs`.

### Datos SFTP

| Servidor | Host | Puerto |
|---|---|---|
| Johnny | `johnny.heliohost.org` | `1373` |
| Tommy | `tommy2.heliohost.org` | `1373` |
| Morty | `morty2.heliohost.org` | `1373` |

- Usuario: tu usuario de Plesk.
- Contraseña: tu contraseña de Plesk.
- Protocolo: **SFTP**.

Para confirmar la ruta remota exacta:

```bash
sftp -P 1373 tu_usuario@johnny.heliohost.org
```

Dentro de SFTP:

```bash
pwd
ls
```

Debes ver `httpdocs`. Si conectas con Tommy, usa `tommy2.heliohost.org`.

> El SSL es automático con Let's Encrypt mediante **SSL It!** de Plesk. Puede tardar un poco en emitirse.

### Cómo funciona el script de subida

- Archivo: `scripts/upload-heliohost.sh`.
- Atajo de npm: `npm run deploy:heliohost`.
- **No compila**: sube lo que ya exista en `out/`. Ejecuta `npm run build` antes.
- Usa `lftp` por SFTP en el puerto `1373`.
- Lee el usuario y la contraseña desde `~/.netrc`; la contraseña nunca está en el script.
- Sube `out/` con `mirror -R`. Con `--delete`, borra en el servidor lo que ya no exista localmente.
- Variables de entorno disponibles:
  - `HELIOHOST_HOST`
  - `HELIOHOST_PORT`
  - `HELIOHOST_USER`
  - `HELIOHOST_REMOTE`
- Flags: `--host`, `--port`, `--user`, `--remote`, `--local`, `--delete`.

La cuenta nueva solo necesita un bloque en `~/.netrc` para el host exacto y, si aplica, la ruta remota correcta.

---

## 4. Preparar el build de producción

Durante el desarrollo, `.env.local` apunta a `localhost`. Para el build de HelioHost crea **`.env.production.local`** en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://NUEVO_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

NEXT_PUBLIC_SITE_URL=https://tu-dominio.helioho.st
NEXT_PUBLIC_WHATSAPP_NUMBER=573146037663
NEXT_PUBLIC_MAP_QUERY=Mza+M+casa+6+Barrio+Jordan+9a+Etapa,+Ibague,+Tolima,+Colombia
```

Next.js le da prioridad a `.env.production.local` sobre `.env.local` cuando ejecutas `npm run build`, así que `npm run dev` sigue usando localhost.

Verifica y construye:

```bash
npm run check:supabase
npm run build
```

Comprueba que `out/` se generó correctamente:

```bash
ls out
```

Debe contener `index.html`, `_next/`, `admin/`, `blog/`, `sitemap.xml`, etc.

> Si usas solo la build desde tu máquina, también puedes pasar las variables en el comando, pero `.env.production.local` es más claro y evita equivocaciones.

---

## 5. Configurar el acceso SFTP

El script lee la contraseña desde `~/.netrc`. Agrega un bloque para el servidor nuevo:

```text
machine johnny.heliohost.org
  login tu_usuario
  password tu_contraseña
```

Para Tommy:

```text
machine tommy2.heliohost.org
  login tu_usuario
  password tu_contraseña
```

Asegura los permisos:

```bash
chmod 600 ~/.netrc
```

> Puedes dejar los bloques anteriores en `~/.netrc`; el script elige el que coincide con el host.

---

## 6. Subir el sitio

```bash
./scripts/upload-heliohost.sh
```

El script sube `out/` a `httpdocs` en Johnny por defecto.

Para Tommy:

```bash
./scripts/upload-heliohost.sh --host tommy2.heliohost.org --user tu_usuario
```

Si la ruta remota no es `httpdocs`, indícala:

```bash
./scripts/upload-heliohost.sh --remote /ruta/absoluta/httpdocs
```

La primera vez sube **sin** `--delete`. Cuando confirmes que todo está bien, puedes usar:

```bash
./scripts/upload-heliohost.sh --delete
```

`--delete` borra en el servidor los archivos que ya no existan en `out/`. Úsalo con cuidado.

---

## 7. Configurar las URLs de Auth en Supabase

En Supabase, **Authentication → URL Configuration**:

- **Site URL**: `https://tu-dominio.helioho.st`
- **Redirect URLs**:
  - `https://tu-dominio.helioho.st/**`
  - `http://localhost:3000/**` (para desarrollo)

Esto es necesario para recuperación de contraseña y futuros flujos con redirect. El login por contraseña funciona igual.

---

## 8. Verificar el despliegue

1. Abre `https://tu-dominio.helioho.st`.
   - Si ves “HelioHost Account Queued”, espera hasta 2 horas.
2. Comprueba que carguen los estilos y el JavaScript (`_next/`).
3. Revisa:
   - Inicio con estadísticas.
   - `/blog/` y `/blog/?slug=...`.
   - `sitemap.xml` y `robots.txt` con el dominio nuevo.
4. Entra a `/admin/login/` y prueba el usuario administrador.
5. Crea una publicación con imagen y sube un PDF.
6. Verifica los cambios en Supabase.

### Errores comunes

| Síntoma | Causa | Solución |
|---|---|---|
| “Account Queued” | Cuenta recién creada | Esperar hasta 2 horas y limpiar caché |
| Página en blanco o sin estilos | No se subió `_next/` | Volver a subir `out/` completo |
| El sitio usa datos viejos | Build con variables antiguas | Revisar `.env.production.local` y reconstruir |
| `404` en rutas internas | Falta `trailingSlash` o no se subió la carpeta | Verificar `out/blog/index.html`, etc. |
| Login falla | URL de Auth o usuario no confirmado | Revisar Supabase Auth y el usuario |

---

## 9. Dominio propio (opcional)

Si más adelante compras un dominio:

1. En el registrador, apunta los nameservers a:
   ```text
   ns1.heliohost.org
   ns2.heliohost.org
   ```
2. Pide a HelioHost que lo agregue como dominio principal o addon en el foro de soporte.
3. Espera la propagación DNS (hasta 24–48 h).
4. Actualiza en Supabase las URLs de Auth.
5. Cambia `NEXT_PUBLIC_SITE_URL` en `.env.production.local`.
6. Reconstruye y vuelve a subir.

---

## 10. Mantenimiento

- **Inactividad:** HelioHost suspende cuentas Johnny/Tommy tras 30 días sin entrar a Plesk. Entra periódicamente a <https://heliohost.org/login/>.
- **Backups:** guarda una copia de `out/` o del repositorio. HelioHost no garantiza backups.
- **Supabase:** configura el keepalive externo (UptimeRobot o cron-job.org) para que el proyecto gratuito no se pause.
- **SSL:** se renueva automáticamente con SSL It!

---

## Checklist

- [ ] Cuenta de HelioHost creada y activada.
- [ ] Dominio y usuario de Plesk guardados.
- [ ] Acceso a Plesk confirmado.
- [ ] `.env.production.local` con la URL y key de Supabase.
- [ ] `npm run build` exitoso.
- [ ] `out/` subido a `httpdocs`.
- [ ] Sitio carga por HTTPS.
- [ ] Login y CRUD funcionan.
- [ ] URLs de Auth actualizadas en Supabase.
- [ ] Keepalive de Supabase configurado.
