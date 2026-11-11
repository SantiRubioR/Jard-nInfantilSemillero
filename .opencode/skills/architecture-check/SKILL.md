---
name: Architecture Check
description: Verificar los límites simples entre features, componentes y lib
---

# Architecture Check

Usa esta skill antes de cerrar una tarea.

## Comandos

```bash
npm run arch:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Reglas

- Una feature no importa otra feature.
- `components/ui`, `components/layout` y `components/feedback` no importan features.
- `lib` no importa features ni componentes.
- `app` no importa Supabase directamente.
- Los servicios y repositorios no importan React ni Next.
- No se usan rutas legacy: `@/shared`, `@/widgets`, `@/lib/data`, `@/lib/client`.
- `@supabase/*` solo se importa desde `src/lib`.

## Señales de alerta

- `useEffect` con Supabase en una view.
- `createSupabaseClient` en un componente.
- Reglas de negocio dentro de un `.tsx`.
- Una feature importando otra “para reutilizar”.
- Archivos `domain`, `application`, `infrastructure` o `presentation` (esta arquitectura no los usa).

## Informe

```text
✔ Arquitectura simple OK: N archivos, 0 violaciones.
✔ lint
✔ typecheck
✔ tests
✔ build
```
