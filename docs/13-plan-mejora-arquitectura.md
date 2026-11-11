# Plan de mejora de la arquitectura

**Relacionado:** [ADR 0001 — Arquitectura simple por features](adr/0001-feature-first-clean-mvvm.md) · [Análisis y arquitectura simple](11-analisis-y-plan-arquitectura.md)

## Decisiones tomadas

| Pregunta | Decisión |
|---|---|
| ¿Mantenemos el enfoque simple del ADR 0001? | **Sí.** No se adopta Clean Architecture completa (puertos, adaptadores, capas de dominio formales). |
| ¿Se prevén más roles o usuarios? | **No.** Solo hay un administrador. No se invierte en roles ni en permisos finos de `auth`. |
| ¿Guardar el plan y empezar por la Fase 0? | **Sí.** |

Objetivo: que un estudiante recién egresado pueda entender, modificar y probar cada feature sin ayuda, siguiendo siempre las mismas reglas.

## Principios

1. **Cada capa solo habla con la de abajo.** Vistas → view models (hooks) → servicios → repositorios → Supabase o datos demo.
2. **Las reglas no dependen de React ni de Supabase.** Se prueban con datos en memoria.
3. **Una sola decisión de datos por feature.** Supabase o demo se elige en la factoría del repositorio, no en cada método.
4. **Sin duplicación.** Carga de datos, subida de archivos y resultados se escriben una vez en `src/lib`.
5. **Cada fase termina con `npm run check` en verde** y sin cambiar el comportamiento visible.

## Arquitectura objetivo

```text
src/
├── app/                      # Rutas Next.js: solo componen
├── components/               # Piezas reutilizables sin lógica de negocio
│   ├── ui/                   # Botones, cards, inputs
│   ├── layout/               # Header, footer, hero
│   └── feedback/             # Mensajes y botones de envío/borrado
├── features/<feature>/
│   ├── <feature>.types.ts      # Modelo y reglas puras
│   ├── <feature>.rules.ts      # (solo si la feature lo necesita) reglas de crear/editar
│   ├── <feature>.schemas.ts    # Validación de formularios (Zod)
│   ├── <feature>.repository.ts # Supabase o demo
│   ├── <feature>.service.ts    # Orquesta: valida → sube → guarda → limpia
│   ├── <feature>.hooks.ts      # View models
│   ├── <feature>.demo.ts       # Datos de demostración
│   ├── components/             # Vistas
│   └── index.ts                # API pública
└── lib/                      # Supabase, storage, resultados, utilidades
```

Reglas (verificadas con `npm run arch:check`):

- Una feature no importa otra feature.
- `components/ui`, `components/layout` y `components/feedback` no importan features.
- `lib` no importa features ni componentes.
- `app` no importa Supabase ni tipos de base de datos.
- Servicios y repositorios no importan React ni Next.
- `@supabase/*` solo se importa desde `src/lib` y desde los repositorios.

## Estado de las fases

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Estabilizar: commits por capa, tipo de resultado único, limpieza de artefactos | **Hecha** (ver abajo) |
| 1 | Un solo punto de decisión de datos por repositorio | ✅ Hecha |
| 2 | Servicios sin duplicación: reglas puras y helpers de storage | ✅ Hecha |
| 3 | View models sin repetición y sin datos demo en las vistas | ✅ Hecha |
| 4 | Componentes pequeños y bien ubicados | ✅ Hecha |
| 5 | Pruebas de reglas, repositorios demo y flujos de error | ✅ Hecha (44 pruebas) |
| 6 | Documentación y guía "cómo agregar una feature" | ✅ Hecha (ADR 0002, guía 14) |

### Fase 0 — Estabilizar (hecha)

- Commits por capa sobre el refactor que estaba sin commitear:
  - `98c48ba` docs: plan de arquitectura, ADR 0001 y herramientas de verificación
  - `dfd708d` refactor: centralizar utilidades en `src/lib`
  - `35b13c6` refactor: organizar componentes en ui, layout, feedback y admin
  - `56ec148` refactor: organizar cada funcionalidad en `src/features`
  - `3ea3b55` refactor: rutas Next.js solo como composición
  - `65369ea` test: pruebas AAA de los servicios con repositorios falsos
  - `612d8f0` refactor: un solo tipo de resultado para acciones
- `ActionResult` es ahora `ServiceResult<void>`; los view models usan `ok()` y `fail()`.
- Se eliminó `file-preview/` (artefacto generado y obsoleto). `out/` se regenera con cada build.
- **Pendiente de decisión del responsable:** los archivos `INFORME A1 - REQUERIMIENTOS.docx`, `INFORME A2 - ARQUITECTURA DEL SOFTWARE.docx`, `INFORME A3 - PROTOTIPOS.docx` y `PROTOTIPOS.zip` aparecen eliminados del árbol de trabajo, pero siguen en el historial. No se incluyeron en ningún commit. Restaurarlos o confirmar su eliminación es una decisión humana.
- La carpeta `.opencode/` no está versionada y no se incluyó en los commits.

## Fase 1 — Un solo punto de decisión de datos

**Resultado:** las comprobaciones `if (!supabase)` dentro de los métodos se eliminaron en los 6 repositorios. Facilities ya no siempre usa Supabase: ahora tiene repositorio demo propio.

Hoy cada método de `*.repository.ts` llama a `getSupabaseClient()` y decide si usar demo. El patrón a seguir:

```ts
export function getBlogRepository(): BlogRepository {
  const supabase = getSupabaseClient();
  return supabase ? createSupabaseBlogRepository(supabase) : demoBlogRepository;
}
```

- Afecta a: `blog`, `facilities`, `institutional-documents`, `academic-levels`, `statistics`, `auth`.
- Criterio de salida: ningún método de repositorio contiene `if (!supabase)`.

## Fase 2 — Servicios sin duplicación

**Resultado:** `blog.rules.ts` con reglas puras, `uploadFile` en `lib/storage.ts` usado por los 4 servicios con subidas, y `createPost`/`updatePost` comparten el flujo.

- Extraer de `blog.service.ts` las reglas puras a `blog.rules.ts` (validar, calcular slug, decidir qué subir y qué borrar).
- Crear en `lib/storage.ts` helpers de alto nivel, por ejemplo `uploadFile(folder, file, kind)` y `replaceFile(bucket, oldUrl, newUrl)`, para que los servicios no construyan rutas.
- Unir `createPost` y `updatePost` en un flujo común con pasos pequeños.
- Criterio de salida (ajustado): `createPost` y `updatePost` comparten validación, subida y limpieza; no hay código copiado.
- Resultado: `blog.service.ts` tiene 260 líneas, porque incluye las lecturas y el borrado. Se aceptó porque el código explícito es más fácil de leer para un estudiante. El límite de 150 líneas era una estimación inicial y no un requisito.

## Fase 3 — View models sin repetición

**Resultado:** `useAsyncData` en `src/lib/hooks/` usado por 9 hooks de carga.

- Crear `lib/hooks/use-async-data.ts` con `data`, `loading`, `error` y `reload`. Los hooks de cada feature quedan en pocas líneas.
- Las vistas no importan datos demo. La página de detalle del blog recibe los datos desde el hook o desde la ruta.
- Criterio de salida (ajustado): las rutas de `src/app` no importan datos demo. El detalle del blog usa `findStaticPostBySlug` y `listStaticPostSlugs`.
- Excepción aceptada: `BlogPage` (en `features/blog/components`) usa `listStaticPosts` para el HTML estático, porque la exportación estática necesita datos iniciales.
- Los textos "modo demostración" de la interfaz no son importaciones y se mantienen.

## Fase 4 — Componentes pequeños

**Resultado:** `blog-admin-panel` dividido en `blog-post-form`, `blog-post-list` y el contenedor. Shell, sidebar y dashboard movidos a `src/app/admin/_components/`. `components/` ya no importa features.

- Dividir `features/blog/components/blog-admin-panel.tsx` (349 líneas) en formulario, lista y contenedor.
- Mover `components/admin/admin-dashboard.tsx` (que importa cuatro features) a `app/admin/(panel)/page.tsx` o a una feature `dashboard`.
- Criterio de salida: ningún archivo de `components/` importa de `features/`.

## Fase 5 — Pruebas

**Resultado:** 44 pruebas en 10 archivos (eran 14).

- Pruebas AAA para las reglas puras (slug, validación de archivos, orden).
- Pruebas de repositorios demo.
- Pruebas de flujos de error: fallo de subida, fallo de guardado con limpieza de archivos.
- Objetivo orientativo: pasar de 14 a unas 40 pruebas, sin depender de Supabase.

## Fase 6 — Documentación para aprender

**Resultado:** ADR 0002, guía `docs/14-guia-para-estudiantes.md` y documentación actualizada.

- Actualizar `docs/01-arquitectura.md` y `docs/11-analisis-y-plan-arquitectura.md` con la estructura final.
- Crear un ADR 0002 con las decisiones de las fases 1 a 3.
- Guía "Cómo agregar una feature en 10 pasos", basada en `docs/plantillas/feature/`.
- Glosario corto (servicio, repositorio, view model, RLS) y orden de lectura del proyecto.

## Lo que no se hará

- Puertos y adaptadores formales, contenedores de inyección o clases con herencia.
- Gestores de estado globales: los hooks locales bastan.
- Server Actions o endpoints propios: el despliegue estático en HelioHost no los soporta.
- Roles o permisos adicionales (no hay necesidad prevista).

## Riesgos

- **Seguridad del panel:** el guard de `admin` corre en el navegador. La protección real es RLS (ver `docs/03-seguridad-rls.md`). Hay que revisar esas políticas antes de producción.
- **Datos demo y Supabase divergen:** cada cambio en un repositorio debe probarse en ambos modos.
