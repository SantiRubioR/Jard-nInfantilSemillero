---
name: Feature Slice
description: Crear una feature simple con types, schemas, repository, service, hooks y components
---

# Feature Slice

Usa esta skill para crear o modificar una feature.

## Estructura

```text
src/features/<feature>/
├── <feature>.types.ts
├── <feature>.schemas.ts
├── <feature>.repository.ts
├── <feature>.service.ts
├── <feature>.hooks.ts
├── <feature>.demo.ts
├── components/
└── index.ts
```

## Orden de trabajo

1. `types`: modelo y reglas simples.
2. `schemas`: validación Zod si hay formulario.
3. `repository`: Supabase + datos demo.
4. `service`: casos de uso y `ServiceResult`.
5. `hooks`: estado de pantalla y comandos.
6. `components`: views.
7. `index.ts`: exports públicos.

## Reglas

- Una feature no importa otra feature.
- La view no llama a Supabase.
- El servicio no importa React ni Next.
- El repositorio traduce errores a mensajes en español.
- No crear carpetas `domain`, `application`, `infrastructure` ni `presentation`.
- No agregar puertos/adaptadores si no son necesarios.

## Checklist

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run arch:check`
- [ ] `npm run build`
