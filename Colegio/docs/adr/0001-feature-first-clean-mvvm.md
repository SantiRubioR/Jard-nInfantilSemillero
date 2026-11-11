# ADR 0001 — Arquitectura simple por features

- **Estado:** Aceptado
- **Fecha:** 2026-11-09
- **Relacionado:** [Arquitectura simple](../11-analisis-y-plan-arquitectura.md)

## Contexto

El proyecto es un sitio estático de Next.js 16 con Supabase desde el navegador. Debe funcionar en HelioHost sin servidor Node. El código estaba organizado por tipo técnico (`components`, `lib`, `types`) y mezclaba UI, acceso a datos, validación y reglas de negocio.

Se probó una arquitectura más elaborada con capas `domain`, `application`, `infrastructure`, `presentation`, puertos y adaptadores. Funcionaba, pero era demasiado compleja para el tamaño del proyecto y para un estudiante de software.

## Decisión

Organizar el código por **feature** con archivos planos y responsabilidades claras:

```text
features/<feature>/
├── <feature>.types.ts        # modelo
├── <feature>.schemas.ts      # validación
├── <feature>.repository.ts   # Supabase o demo
├── <feature>.service.ts      # reglas / casos de uso
├── <feature>.hooks.ts        # view models
├── components/               # views
└── index.ts                  # API pública
```

Componentes compartidos en `src/components` y utilidades en `src/lib`.

## Reglas

- Una feature no importa otra feature.
- `components/ui`, `components/layout` y `components/feedback` no importan features.
- `lib` no importa features ni componentes.
- `app` no importa Supabase directamente.
- Los servicios y repositorios no importan React ni Next.
- `@supabase/*` solo se usa en `src/lib`.

## Consecuencias

### Positivas

- Es fácil ubicar dónde vive cada cosa.
- Los servicios se prueban sin React ni Supabase.
- Las views no contienen reglas de negocio.
- El despliegue estático no cambia.
- Menos archivos y nombres más directos.

### Negativas

- Hay menos aislamiento que con puertos y adaptadores formales.
- Algunos repositorios contienen lógica de selección Supabase/demo.
- Si el proyecto crece mucho, habrá que dividir algunos archivos.

## Alternativas descartadas

- **Clean Architecture completa:** demasiado ceremonial para 6 features.
- **Feature-Sliced Design completo:** capas y nomenclatura que no aportan al tamaño actual.
- **MVC clásico:** el controller termina siendo el componente React.
- **Server Actions:** no existen en exportación estática.

## Verificación

```bash
npm run lint
npm run typecheck
npm run test
npm run arch:check
npm run build
```
