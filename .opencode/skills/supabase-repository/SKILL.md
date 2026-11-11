---
name: Supabase Repository
description: Crear un repositorio simple que use Supabase o datos demo
---

# Supabase Repository

Usa esta skill para mover consultas Supabase a `<feature>.repository.ts`.

## Contrato

```ts
export interface BlogRepository {
  listPublished(category?: BlogCategory): Promise<ServiceResult<BlogPost[]>>;
  create(input: CreateBlogPostRecord): Promise<ServiceResult<BlogPost>>;
  // ...
}
```

## Implementación

- Un solo archivo `<feature>.repository.ts`.
- Incluye la interfaz, los datos demo y la implementación Supabase.
- Usa `getSupabaseClient()` desde `@/lib/supabase`.
- Si no hay cliente, devuelve datos demo en lecturas y error en escrituras.
- Traduce errores de Supabase a mensajes en español.
- No exportes tipos de fila SQL hacia las views.

## Ejemplo

```ts
const supabaseBlogRepository: BlogRepository = {
  async listPublished(category) {
    const supabase = getSupabaseClient();
    if (!supabase) return demoBlogRepository.listPublished(category);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true);

    if (error) return fail("No se pudieron cargar las publicaciones.");
    return ok((data ?? []).map(toBlogPost));
  },
};

export function getBlogRepository(): BlogRepository {
  return getSupabaseClient() ? supabaseBlogRepository : demoBlogRepository;
}
```

## Checklist

- [ ] El repositorio devuelve `ServiceResult`.
- [ ] Hay datos demo para lecturas.
- [ ] Las escrituras fallan con mensaje claro sin Supabase.
- [ ] No hay `@supabase/*` fuera de `src/lib`.
- [ ] `npm run arch:check` pasa.
