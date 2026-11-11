---
name: MVVM React
description: Implementar view models simples con hooks y views sin lógica de negocio
---

# MVVM React

Usa esta skill para pantallas o formularios con estado.

## Mapeo

| MVVM | Archivo |
|---|---|
| Model | `*.types.ts` + `*.repository.ts` + `*.service.ts` |
| ViewModel | `*.hooks.ts` |
| View | `components/*.tsx` |

## ViewModel

- Es un hook en `<feature>.hooks.ts`.
- No renderiza JSX.
- No importa Supabase.
- Maneja `data`, `loading`, `error` y `reload`.
- Expone acciones (`create`, `remove`, `save`, `submit`).

Ejemplo:

```ts
export function useBlogListViewModel(category?: BlogCategory) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listPublishedPosts(category).then((result) => {
      if (!active) return;
      if (result.ok) setPosts(result.data);
      else setError(result.message);
      setLoading(false);
    });
    return () => { active = false; };
  }, [category]);

  return { posts, loading, error };
}
```

## View

- Recibe datos y callbacks.
- No calcula reglas de negocio.
- Muestra `loading`, vacío y error.
- Usa `getByRole`/`getByLabelText` en pruebas.

## Pruebas

Prueba el servicio con repositorios falsos. Para hooks, usa `renderHook` solo si el estado es complejo.

## Anti-patrones

- `useEffect` con Supabase dentro de la view.
- Hook que importa `next/navigation`.
- View que decide reglas de negocio.
- `window.location.reload()` dentro de un hook.
