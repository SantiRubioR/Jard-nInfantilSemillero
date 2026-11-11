import { describe, expect, it } from "vitest";
import { keptFiles, validatePost } from "@/features/blog/blog.rules";
import type { PostFormInput } from "@/features/blog/blog.schemas";
import type { BlogPost } from "@/features/blog/blog.types";

function makeInput(overrides: Partial<PostFormInput> = {}): PostFormInput {
  return {
    title: "Clausura del 2026",
    category: "evento",
    publishedAt: "2026-12-01",
    excerpt: "",
    content: "",
    isPublished: true,
    ...overrides,
  };
}

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: "post-1",
    title: "Clausura",
    slug: "clausura",
    category: "evento",
    excerpt: null,
    content: null,
    coverImageUrl: "https://cdn.test/cover.png",
    pdfUrl: null,
    publishedAt: "2026-12-01",
    isPublished: true,
    createdBy: "user-1",
    createdAt: "2026-12-01T00:00:00.000Z",
    updatedAt: "2026-12-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("validatePost", () => {
  it("genera el slug y normaliza los textos vacíos a null", () => {
    // Arrange
    const input = makeInput();

    // Act
    const result = validatePost(input);

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.slug).toBe("clausura-del-2026");
      expect(result.data.excerpt).toBeNull();
      expect(result.data.content).toBeNull();
    }
  });

  it("rechaza un título demasiado corto", () => {
    // Arrange
    const input = makeInput({ title: "Hi" });

    // Act
    const result = validatePost(input);

    // Assert
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("3 caracteres");
    }
  });

  it("rechaza un título que no genera una URL válida", () => {
    // Arrange
    const input = makeInput({ title: "!!!" });

    // Act
    const result = validatePost(input);

    // Assert
    expect(result.ok).toBe(false);
  });

  it("rechaza una fecha con formato incorrecto", () => {
    // Arrange
    const input = makeInput({ publishedAt: "01/12/2026" });

    // Act
    const result = validatePost(input);

    // Assert
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Selecciona una fecha válida.");
    }
  });
});

describe("keptFiles", () => {
  it("conserva la imagen al editar un evento que ya era evento", () => {
    // Arrange
    const existing = makePost({ category: "evento", coverImageUrl: "https://cdn.test/a.png" });

    // Act
    const files = keptFiles("evento", existing);

    // Assert
    expect(files).toEqual({ coverImageUrl: "https://cdn.test/a.png", pdfUrl: null });
  });

  it("no conserva la imagen si la publicación anterior era una circular", () => {
    // Arrange
    const existing = makePost({ category: "circular", coverImageUrl: null, pdfUrl: "https://cdn.test/a.pdf" });

    // Act
    const files = keptFiles("evento", existing);

    // Assert
    expect(files.coverImageUrl).toBeNull();
  });

  it("conserva el PDF al editar una circular", () => {
    // Arrange
    const existing = makePost({
      category: "circular",
      coverImageUrl: null,
      pdfUrl: "https://cdn.test/c.pdf",
    });

    // Act
    const files = keptFiles("circular", existing);

    // Assert
    expect(files).toEqual({ coverImageUrl: null, pdfUrl: "https://cdn.test/c.pdf" });
  });

  it("no tiene archivos que conservar al crear una publicación", () => {
    // Arrange
    // (no hay publicación anterior)

    // Act
    const files = keptFiles("circular", null);

    // Assert
    expect(files).toEqual({ coverImageUrl: null, pdfUrl: null });
  });
});
