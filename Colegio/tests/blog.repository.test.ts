import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// El repositorio elige demo o Supabase al cargarse el módulo, así que cada prueba
// lo importa de nuevo con la variable de entorno que necesita.
async function loadDemoBlogRepository() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
  const blogRepositoryModule = await import("@/features/blog/blog.repository");
  return blogRepositoryModule.getBlogRepository();
}

describe("blog repository en modo demostración", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lista solo las publicaciones publicadas", async () => {
    // Arrange
    const repository = await loadDemoBlogRepository();

    // Act
    const result = await repository.listPublished();

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((post) => post.isPublished)).toBe(true);
    }
  });

  it("filtra por categoría", async () => {
    // Arrange
    const repository = await loadDemoBlogRepository();

    // Act
    const result = await repository.listPublished("circular");

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.every((post) => post.category === "circular")).toBe(true);
    }
  });

  it("no permite guardar cambios sin Supabase", async () => {
    // Arrange
    const repository = await loadDemoBlogRepository();

    // Act
    const result = await repository.delete("demo-1");

    // Assert
    expect(result.ok).toBe(false);
    expect(result.message).toContain("Configura Supabase");
  });
});
