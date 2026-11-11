# Arquitectura simple por features

**Proyecto:** Jardín Infantil Semillero  
**Objetivo:** mejorar la organización del código sin cambiar el comportamiento ni el despliegue estático en HelioHost.  
**Enfoque:** feature-first + capas simples + MVVM con hooks + pruebas AAA.

---

## 1. Por qué se simplificó

La primera versión de la refactorización usaba una arquitectura de cuatro capas por feature (`domain`, `application`, `infrastructure`, `presentation`), puertos, adaptadores y un tipo `Result` con errores de dominio. Era correcta, pero demasiado ceremonial para un proyecto de 6 features y para alguien que está aprendiendo.

Esta versión mantiene las ideas valiosas —separar datos, reglas y UI— con menos archivos y nombres más directos.

## 2. Estructura actual

```text
src/
├── app/                         # Rutas Next.js (solo composición)
├── components/
│   ├── ui/                      # Botones, cards, inputs, badges…
│   ├── layout/                  # Header, footer, hero, logo, mapa
│   ├── feedback/                # Mensajes, botones de envío y borrado
│   └── admin/                   # Shell, sidebar, dashboard del panel
├── features/
│   ├── blog/
│   │   ├── blog.types.ts        # Modelo del dominio
│   │   ├── blog.schemas.ts      # Validación con Zod
│   │   ├── blog.repository.ts   # Acceso a Supabase o datos demo
│   │   ├── blog.rules.ts        # Reglas puras de crear/editar
│   │   ├── blog.service.ts      # Casos de uso / controller
│   │   ├── blog.hooks.ts        # View models (MVVM)
│   │   ├── blog.demo.ts         # Datos demo
│   │   ├── components/          # Views de la feature
│   │   └── index.ts             # API pública de la feature
│   ├── statistics/
│   ├── academic-levels/
│   ├── institutional-documents/
│   ├── facilities/
│   └── auth/
├── lib/
│   ├── supabase.ts              # Cliente Supabase + usuario actual
│   ├── storage.ts               # Subida/borrado de archivos
│   ├── env.ts                   # Variables de entorno
│   ├── result.ts                # ServiceResult / ActionResult
│   ├── action-state.ts          # Estado de formularios
│   ├── utils.ts                 # cn, fechas, slugs
│   ├── site.ts                  # Configuración del sitio
│   └── constants.ts             # Contenido institucional
└── types/
    └── database.ts              # Tipos de Supabase
```

## 3. Responsabilidades

| Archivo | Responsabilidad | Ejemplo |
|---|---|---|
| `*.types.ts` | Tipos y reglas simples del modelo | `BlogPost`, `toBlogSlug` |
| `*.schemas.ts` | Validación de entrada con Zod | `postFormSchema` |
| `*.repository.ts` | Hablar con Supabase o datos demo | `listPublished`, `create` |
| `*.service.ts` | Orquestar reglas, validar y coordinar storage | `createPost`, `updatePost` |
| `*.hooks.ts` | Estado de pantalla y comandos | `useBlogListViewModel` |
| `components/` | Mostrar datos y capturar eventos | `BlogCard`, `PostForm` |
| `index.ts` | Exportar solo lo que usan las rutas | `BlogPage`, `BlogAdminPanel` |

### Regla de dependencia

```text
app → features → components/ui + lib
components/ui → lib
lib → nadie
```

- Una feature **no importa otra feature**.
- `components/ui`, `components/layout` y `components/feedback` no importan features.
- `lib` no importa features ni componentes.
- `app` no habla con Supabase directamente.
- Los servicios y repositorios no importan React ni Next.
- `@supabase/*` solo se importa desde `src/lib`.

Estas reglas se verifican con:

```bash
npm run arch:check
```

## 4. MVVM en la práctica

| MVVM | En este proyecto |
|---|---|
| Model | `*.types.ts` + `*.repository.ts` + `*.service.ts` |
| ViewModel | `*.hooks.ts` |
| View | `components/*.tsx` |
| Binding | Props y callbacks de React |

Ejemplo de flujo para el blog público:

```text
BlogPage (View)
  → useBlogListViewModel (ViewModel)
    → listPublishedPosts (Service)
      → blogRepository.listPublished (Repository)
        → Supabase o datos demo
```

El hook devuelve `posts`, `loading`, `error` y `reload`. La View solo decide cómo mostrarlos.

## 5. Servicios y resultados simples

Los servicios devuelven un resultado explícito y fácil de leer:

```ts
export type ServiceResult<T = void> =
  | { ok: true; data: T; message: string }
  | { ok: false; message: string };
```

Ejemplo:

```ts
const result = await createPost(input);

if (result.ok) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
```

No hay excepciones de dominio ni jerarquías de errores. Los repositorios traducen errores de Supabase a mensajes en español.

## 6. Pruebas unitarias con AAA

Las pruebas están en `tests/` y usan el patrón **Arrange – Act – Assert**:

```ts
it("crea un evento con imagen, slug y autor", async () => {
  // Arrange
  const repository = makeBlogRepository();
  const storage = makeStorage();
  const deps = { repository, storage, getCurrentUserId: async () => ok("user-1") };

  // Act
  const result = await createPost(input, deps);

  // Assert
  expect(result.ok).toBe(true);
  expect(repository.created?.createdBy).toBe("user-1");
});
```

Se prueban servicios con repositorios y storage falsos. No se necesita Supabase ni navegador para las pruebas unitarias.

Comandos:

```bash
npm run test       # Vitest
npm run test:e2e   # Playwright
npm run arch:check # límites de arquitectura
npm run check      # lint + typecheck + test + arch + build
```

## 7. Despliegue estático en HelioHost

La arquitectura no cambia el despliegue:

- `next.config.ts` mantiene `output: "export"`.
- El build genera `out/`.
- No hay servidor Node, Server Actions ni Route Handlers.
- Supabase se usa desde el navegador con `anon key` y RLS.
- `NEXT_PUBLIC_DEMO_MODE=true` permite probar el panel sin credenciales.
- `npm run build` y `npm run build:file` siguen funcionando.

## 8. Qué se conservó

- Las mismas rutas públicas y del panel.
- El mismo diseño y textos.
- El mismo comportamiento del CMS.
- El modo demostración.
- La seguridad por RLS.
- El blog estático y el detalle con `?slug=`.
- La descarga de PDFs y la galería.

## 9. Evidencia de la simplificación

```text
npm run lint        → ✅
npm run typecheck   → ✅
npm run test        → ✅ 10 archivos, 44 pruebas
npm run arch:check  → ✅ 109 archivos, 0 violaciones
npm run build       → ✅ 22 rutas
npm run test:e2e    → ✅ 8 pruebas
```

La estructura anterior (`src/shared`, `src/widgets`, capas `domain/application/infrastructure/presentation`) fue reemplazada por `src/lib`, `src/components` y features con archivos planos.

## 10. Pendientes

- Probar con el proyecto real de Supabase y las políticas RLS.
- Ejecutar la UAT con la rectora.
- Revisar Lighthouse sobre `out/`.
- Agregar más pruebas si se agregan nuevas reglas de negocio.
