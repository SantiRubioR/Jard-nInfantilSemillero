import { describe, expect, it } from "vitest";
import {
  isValidBlogSlug,
  sortPostsByDateDesc,
  toBlogSlug,
  type BlogPost,
} from "@/features/blog/blog.types";

function makePost(id: string, publishedAt: string): BlogPost {
  return {
    id,
    title: id,
    slug: id,
    category: "evento",
    excerpt: null,
    content: null,
    coverImageUrl: null,
    pdfUrl: null,
    publishedAt,
    isPublished: true,
    createdBy: null,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}

describe("toBlogSlug", () => {
  it("quita tildes, pasa a minúsculas y reemplaza los espacios", () => {
    // Arrange
    const title = "Día del Niño y la Niña";

    // Act
    const slug = toBlogSlug(title);

    // Assert
    expect(slug).toBe("dia-del-nino-y-la-nina");
  });
});

describe("isValidBlogSlug", () => {
  it("acepta un slug con letras, números y guiones", () => {
    // Arrange
    const slug = "circular-2026-inicio";

    // Act
    const valid = isValidBlogSlug(slug);

    // Assert
    expect(valid).toBe(true);
  });

  it("rechaza guiones dobles, mayúsculas y slugs vacíos", () => {
    // Arrange
    const slugs = ["a--b", "Mayus", ""];

    // Act
    const results = slugs.map(isValidBlogSlug);

    // Assert
    expect(results).toEqual([false, false, false]);
  });
});

describe("sortPostsByDateDesc", () => {
  it("ordena de la publicación más reciente a la más antigua sin mutar la lista original", () => {
    // Arrange
    const posts = [
      makePost("antigua", "2026-01-10"),
      makePost("reciente", "2026-03-01"),
      makePost("media", "2026-02-15"),
    ];

    // Act
    const sorted = sortPostsByDateDesc(posts);

    // Assert
    expect(sorted.map((post) => post.id)).toEqual(["reciente", "media", "antigua"]);
    expect(posts[0].id).toBe("antigua");
  });
});
