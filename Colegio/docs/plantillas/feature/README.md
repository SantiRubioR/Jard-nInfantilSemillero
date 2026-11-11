# Plantilla de feature

Copiar esta estructura al crear una feature nueva.

```text
src/features/<feature>/
├── <feature>.types.ts        # modelo y reglas simples
├── <feature>.rules.ts        # reglas puras de crear/editar (si son complejas)
├── <feature>.schemas.ts      # validación con Zod (si hay formularios)
├── <feature>.repository.ts   # Supabase o datos demo (una sola decisión)
├── <feature>.service.ts      # casos de uso / controller
├── <feature>.hooks.ts        # view models (MVVM)
├── <feature>.demo.ts         # datos de demostración (si aplica)
├── components/               # views
│   └── <feature>-section.tsx
└── index.ts                  # API pública de la feature
```

## Reglas

- Una feature no importa otra feature.
- Los componentes no llaman a Supabase directamente.
- Los servicios no importan React ni Next.
- Los repositorios traducen errores a mensajes en español.
- Los hooks de carga usan `useAsyncData` de `src/lib/hooks/`, que maneja `loading`, `error` y `reload`.
- El repositorio elige Supabase o demo una sola vez, en `get<Feature>Repository()`.
- Los archivos se suben con `uploadFile` de `src/lib/storage.ts`.
- Las views solo muestran datos y capturan eventos.

## Checklist

- [ ] `types` con el modelo.
- [ ] `schemas` con validación si hay formulario.
- [ ] `repository` con Supabase y datos demo, sin `if (!supabase)` dentro de los métodos.
- [ ] `service` con las reglas y `ServiceResult`.
- [ ] `hooks` con estado de pantalla.
- [ ] `components` sin lógica de negocio.
- [ ] `index.ts` exporta solo lo necesario.
- [ ] Pruebas AAA en `tests/`.
- [ ] `npm run check` pasa.
- [ ] `npm run arch:check` pasa.

## Ejemplo de prueba AAA

```ts
it("crea un evento con imagen", async () => {
  // Arrange
  const repository = makeBlogRepository();
  const storage = makeStorage();

  // Act
  const result = await createPost(input, { repository, storage, getCurrentUserId });

  // Assert
  expect(result.ok).toBe(true);
});
```
