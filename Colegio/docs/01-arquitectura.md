# Arquitectura del software

## Decisión principal: sitio estático + Supabase

El proyecto se exporta con `output: "export"` y se publica como HTML, CSS y JavaScript estáticos en HelioHost. No hay servidor Node en producción.

```text
Navegador
   ├── Archivos estáticos de out/
   └── Supabase JS (anon key + RLS)
         ├── Auth
         ├── PostgreSQL
         └── Storage
```

## Organización por features

```text
src/
├── app/             # Rutas Next.js: solo composición
│   └── admin/_components/  # Shell, sidebar y dashboard del panel (privado de la ruta)
├── components/      # UI compartida sin lógica de negocio (ui, layout, feedback, admin)
├── features/        # Una carpeta por funcionalidad
│   ├── blog/
│   ├── statistics/
│   ├── academic-levels/
│   ├── institutional-documents/
│   ├── facilities/
│   └── auth/
├── lib/             # Supabase, storage, resultados, hooks comunes, utilidades
└── types/           # Tipos de la base de datos
```

Cada feature tiene:

| Archivo | Responsabilidad |
|---|---|
| `*.types.ts` | Modelo y reglas simples |
| `*.schemas.ts` | Validación con Zod |
| `*.rules.ts` | Reglas puras de crear/editar (sin I/O), si la feature las necesita |
| `*.repository.ts` | Consultas a Supabase o datos demo; una sola decisión en `get*Repository()` |
| `*.service.ts` | Casos de uso: validar, subir archivos, guardar y limpiar |
| `*.hooks.ts` | Estado de pantalla (view models) |
| `components/` | Views de React |
| `index.ts` | API pública de la feature |

## Regla de dependencia

```text
app → features → components + lib
components → lib
lib → nadie
```

- Una feature no importa otra feature.
- Las views no llaman a Supabase directamente.
- Los servicios no importan React.
- `app` solo compone rutas.

Se verifica con `npm run arch:check`.

## MVVM

| MVVM | Implementación |
|---|---|
| Model | types + repository + service |
| ViewModel | hooks |
| View | componentes React |
| Binding | props y callbacks |

Ejemplo:

```text
StatsSection → useStatisticsViewModel → getStatistics → statisticsRepository → Supabase/demo
```

## Flujos

### Lectura pública

```text
Visitante → HTML estático → View → Hook → Service → Repository → Supabase
```

El HTML se genera con datos demo para no quedar vacío. Al hidratar, el hook reemplaza los datos con Supabase.

### Escritura administrativa

```text
Rectora → formulario → Hook → Service → Repository + Storage → Supabase
```

RLS valida la sesión y el rol. No hay Server Actions ni endpoints propios.

## Modo demostración

- Sin variables de Supabase se usan datos demo.
- `NEXT_PUBLIC_DEMO_MODE=true` fuerza el modo demo.
- Si Supabase está configurado y falla una consulta, se muestra un error; no se oculta con datos demo.

## Compromisos del sitio estático

1. El panel se verifica en el navegador; RLS es la protección real.
2. No hay cron propio; el keepalive se configura externo.
3. Las variables `NEXT_PUBLIC_*` se incrustan en el build.
4. El detalle del blog usa `?slug=` para no depender de rutas generadas.
5. El SEO principal es estático.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Supabase pausado por inactividad | Ping externo cada 24 h |
| RLS mal configurado | Pruebas con anon key y sesión admin |
| Variables ausentes en el build | Configurarlas antes de construir |
| Pérdida de datos | Backup semanal con `pg_dump` |
| Degradación de la arquitectura | `npm run arch:check` en CI |
