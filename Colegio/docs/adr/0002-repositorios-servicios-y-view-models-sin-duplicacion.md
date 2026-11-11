# ADR 0002 — Repositorios, servicios y view models sin duplicación

- **Estado:** Aceptado
- **Fecha:** 2026-11-09
- **Relacionado:** [ADR 0001](0001-feature-first-clean-mvvm.md) · [Plan de mejora](../13-plan-mejora-arquitectura.md)

## Contexto

El ADR 0001 organizó el código por feature. Al revisar el código quedaron cuatro problemas:

1. Cada método de cada repositorio volvía a preguntar si había cliente de Supabase. Eran 5 repositorios con 5 a 7 comprobaciones cada uno, y algunas eran código inalcanzable.
2. La subida y el reemplazo de archivos estaban copiados en cuatro servicios.
3. Cada view model repetía el mismo ciclo: datos, `loading`, `error` y `reload`.
4. Existían dos tipos de resultado casi iguales: `ServiceResult` y `ActionResult`.

## Decisión

### 1. Una sola decisión de datos por feature

El repositorio se elige una vez, en la factoría:

```ts
export function getBlogRepository(): BlogRepository {
  const supabase = getSupabaseClient();
  return supabase ? createSupabaseBlogRepository(supabase) : demoBlogRepository;
}
```

- `createSupabase...Repository(supabase)` recibe el cliente ya resuelto. Sus métodos no comprueban si hay cliente.
- El repositorio demo tiene sus propios métodos y devuelve un error claro en las escrituras.
- El tipo del cliente se importa desde `@/lib/supabase` (`AppSupabaseClient`), porque `@supabase/*` solo se importa en `src/lib`.

### 2. Reglas puras separadas del servicio

En `blog.rules.ts` viven las funciones sin I/O:

- `validatePost(input)`: valida con Zod y genera el slug.
- `keptFiles(category, existing)`: decide qué archivos se conservan según la categoría.

Estas funciones se prueban sin mocks (`tests/blog.rules.test.ts`).

### 3. Helper de subida en `lib/storage.ts`

```ts
const upload = await uploadFile(deps.storage, {
  bucket: "images",
  path: `blog/${crypto.randomUUID()}`,
  file,
  kind: "image",
});
```

El helper agrega la extensión y devuelve `{ bucket, url }`. Cada feature decide su ruta, porque algunas usan UUID y otras un nombre con fecha.

### 4. Hook común de carga

`src/lib/hooks/use-async-data.ts` maneja `data`, `loading`, `error` y `reload`. Si la carga falla, conserva los datos anteriores y expone el mensaje. Las dependencias extra (como la categoría) las declara quien usa el hook.

Excepción documentada: `useBlogPostViewModel` devuelve `null` cuando hay error, para no mostrar un post demo como si fuera real.

### 5. Un solo tipo de resultado

`ActionResult` es un alias de `ServiceResult<void>`. Los view models devuelven `ok(undefined, mensaje)` o `fail(mensaje)`.

### 6. Composición del panel admin fuera de `components/`

`AdminShell`, `AdminSidebar` y `AdminDashboard` viven en `src/app/admin/_components/`. Son composición de la ruta y dependen de varias features. `components/` queda sin imports de `features/`, como exige el verificador.

## Consecuencias

### Positivas

- Agregar un método a un repositorio ya no obliga a repetir la comprobación de Supabase.
- Las reglas del blog se prueban sin Supabase ni React.
- Un cambio en la subida de archivos se hace en un solo lugar.
- Hay un solo tipo de resultado para aprender.

### Negativas

- `blog.service.ts` sigue siendo largo (260 líneas). Se prefirió código explícito sobre abstracciones para estudiantes.
- `useAsyncData` usa un `eslint-disable` para las dependencias dinámicas. Está comentado y es un patrón conocido.
- La vista `BlogPage` todavía importa la lista demo para el HTML estático. Es intencional: la exportación estática necesita datos iniciales.

## Alternativas descartadas

- **Inyección de dependencias con contenedor:** más código para el mismo beneficio.
- **Un repositorio genérico para todas las tablas:** oculta las consultas que el estudiante necesita leer.
- **Mover la lógica de hooks a Redux o Zustand:** no hay estado compartido entre pantallas que lo justifique.

## Verificación

```bash
npm run lint
npm run typecheck
npm run test       # 44 pruebas
npm run arch:check # 109 archivos, 0 violaciones
npm run build      # 22 rutas
```
