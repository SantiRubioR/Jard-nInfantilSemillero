# Guía para estudiantes: cómo leer y modificar el proyecto

Esta guía sirve para entrar al código por primera vez. Lee en este orden y no intentes entender todo a la vez.

## 1. Orden de lectura

1. `README.md`: qué hace el sitio y cómo ejecutarlo.
2. `docs/01-arquitectura.md`: las decisiones principales (sitio estático + Supabase).
3. `docs/adr/0001-feature-first-clean-mvvm.md` y `docs/adr/0002-*.md`: por qué el código está organizado así.
4. `src/features/blog/`: la feature más completa. Léela de adentro hacia afuera:
   `blog.types.ts` → `blog.rules.ts` → `blog.schemas.ts` → `blog.repository.ts` → `blog.service.ts` → `blog.hooks.ts` → `components/`.
5. `tests/blog.service.test.ts`: cómo se prueba un servicio sin Supabase.

## 2. Glosario

| Término | Qué significa en este proyecto |
|---|---|
| **Feature** | Una funcionalidad completa (blog, facilities, auth…) con su carpeta en `src/features/`. |
| **Tipo / modelo** | Cómo se ve un dato (`BlogPost`). Vive en `*.types.ts`. |
| **Regla** | Una decisión del negocio, por ejemplo "un evento solo tiene imagen". Si no usa red ni React, vive en `*.rules.ts`. |
| **Esquema** | Validación de lo que escribe el usuario, con Zod (`*.schemas.ts`). |
| **Repositorio** | Única capa que habla con Supabase o con los datos demo. Traduce filas de la base a modelos. |
| **Servicio** | Un caso de uso: valida, sube archivos, guarda y limpia si algo falla. |
| **View model (hook)** | Estado de una pantalla y los comandos que puede ejecutar (`*.hooks.ts`). |
| **View (componente)** | Muestra datos y captura eventos. No contiene reglas. |
| **ServiceResult** | Respuesta de un servicio: `{ ok: true, data, message }` o `{ ok: false, message }`. |
| **RLS** | Reglas de seguridad de Supabase en la base de datos. Es la protección real del panel. |
| **Modo demo** | Sin variables de Supabase, el sitio usa datos de `*.demo.ts`. |
| **AAA** | Patrón de pruebas: *Arrange* (preparar), *Act* (ejecutar), *Assert* (verificar). |

## 3. Regla de oro

Cada capa solo habla con la de abajo:

```text
Vista (componente) → View model (hook) → Servicio → Repositorio → Supabase o demo
```

Si una vista llama directamente a Supabase, o un servicio importa React, algo está mal ubicado.

## 4. Cómo agregar una feature en 10 pasos

Usa `docs/plantillas/feature/README.md` como checklist. Por ejemplo, para agregar "galería":

1. Crea `src/features/galeria/` con `galeria.types.ts`.
2. Define el esquema de formulario en `galeria.schemas.ts` (si hay formulario).
3. Escribe las reglas puras en `galeria.rules.ts` (si son complejas).
4. Crea `galeria.repository.ts` con dos funciones: `createSupabaseGaleriaRepository(supabase)` y un repositorio demo. Elige entre ellos en `getGaleriaRepository()`.
5. Escribe `galeria.service.ts` con casos de uso que reciben `deps` (repositorio y storage).
6. Crea `galeria.hooks.ts` usando `useAsyncData` de `src/lib/hooks/`.
7. Crea las vistas en `components/`. No deben llamar al servicio ni a Supabase.
8. Expón solo lo necesario en `index.ts`.
9. Escribe pruebas AAA en `tests/galeria.service.test.ts` con repositorios falsos.
10. Ejecuta `npm run check` y `npm run arch:check`. Ambos deben pasar.

## 5. Cómo agregar un campo a una tabla

Usa `docs/05-manual-tecnico.md`, sección "Cómo agregar un campo". Recuerda que el campo cruza seis archivos: migración, tipos generados, `*.types.ts`, repositorio, servicio y formulario.

## 6. Comandos útiles

```bash
npm run dev          # desarrollo local
npm run test         # pruebas unitarias
npm run arch:check   # verifica los límites entre capas
npm run check        # lint + tipos + pruebas + arquitectura + build
```

## 7. Errores comunes

- **"No puedo importar Supabase en una feature".** Eso es intencional. Usa el repositorio, o `@/lib/supabase` si estás en `src/lib`.
- **"El verificador dice que una feature importa otra".** Mueve el código compartido a `src/lib` o a `src/components`.
- **"Mi prueba necesita Supabase".** Un servicio debe probarse con un repositorio falso. Si la prueba necesita red, está probando el repositorio, no el servicio.
