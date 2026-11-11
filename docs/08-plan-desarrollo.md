# Plan de desarrollo

## Estado de la implementación

La primera entrega del repositorio incluye:

- [x] Fase 0: proyecto Next.js, TypeScript, Tailwind, ESLint, estructura base.
- [x] Fase 1: migración SQL, RLS, Storage, seed y tipos de base de datos.
- [x] Fase 2: sistema de diseño, header, footer, botones, cards, formularios y panel.
- [x] Fase 3: vistas públicas completas (Inicio, Educación, Nosotros, Blog, Contacto).
- [x] Fase 4: login, guard de sesión en el navegador y layout administrativo.
- [x] Fase 5: CMS de estadísticas, temarios, documentos, galería y blog.
- [x] Fase 6: WhatsApp y mapa embebido.
- [x] Fase 7: SEO, sitemap, robots, JSON-LD, accesibilidad base y modo demostración.
- [x] Fase 8: exportación estática, guía de hosting y documentación.
- [ ] Conexión al proyecto real de Supabase en el build.
- [ ] Pruebas de RLS y UAT con la rectora.
- [ ] Reporte Lighthouse sobre `out/` y acta de entrega.

## Fases y entregables

| Fase | Actividad | Entregable |
|---|---|---|
| 0 | Preparación del repositorio | Proyecto Next.js + Git |
| 1 | Base de datos y Storage | `0001_init.sql`, `seed.sql`, buckets |
| 2 | Diseño UI | Design system y layouts |
| 3 | Frontend público | Rutas públicas responsive |
| 4 | Autenticación | Login, sesión y protección de `/admin` |
| 5 | CMS | CRUD y cargas de archivos |
| 6 | Integraciones | WhatsApp y mapa |
| 7 | Calidad | SEO, accesibilidad, pruebas |
| 8 | Despliegue | `out/`, Cloudflare/Netlify, keepalive externo, backups |

## Cronograma de recuperación

El cronograma original ubicaba ACT6 entre el 26/10 y el 08/11. Si el código se empezó después, este es el plan realista:

| Semana | Fechas | Entregable |
|---|---|---|
| 1 | 02–08 nov | Repo, Supabase, migraciones, RLS, diseño base |
| 2 | 09–15 nov | Vistas públicas + autenticación + shell del admin |
| 3 | 16–22 nov | CMS completo: estadísticas, PDFs, galería, blog |
| 4 | 23–29 nov | Integraciones, SEO, rendimiento, accesibilidad |
| 5 | 30 nov–06 dic | UAT, correcciones, despliegue en producción |
| 6 | 07–13 dic | Cron, backups, manuales, acta y presentación |

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Supabase se pausa por inactividad | Ping externo diario (UptimeRobot/cron-job.org) |
| Límite de Storage | Compresión + borrado de archivos reemplazados |
| Límites del hosting estático | Cloudflare Pages/Netlify free |
| Google Maps con facturación | Usar iframe sin API key |
| WhatsApp Business API de pago | Usar `wa.me` |
| RLS mal configurado | Pruebas con clave anónima |
| Caché desactualizada | `revalidatePath` en cada mutación |
| Pérdida de datos | Backup semanal |

## Próximos pasos

1. Crear el proyecto de Supabase y ejecutar las migraciones.
2. Crear el usuario de la rectora y desactivar el registro público.
3. Configurar `.env.local` y probar el CRUD real.
4. Ejecutar las pruebas de RLS.
5. Desplegar `out/` en Cloudflare Pages o Netlify y configurar el ping externo.
6. Ejecutar Lighthouse y la UAT.
7. Completar el acta de entrega y la presentación final.
