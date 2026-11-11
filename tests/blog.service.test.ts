import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import type { StorageService } from "@/lib/storage";
import type {
  BlogRepository,
  CreateBlogPostRecord,
  UpdateBlogPostRecord,
} from "@/features/blog/blog.repository";
import type { BlogPost } from "@/features/blog/blog.types";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/features/blog/blog.service";
import type { PostFormInput } from "@/features/blog/blog.schemas";

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: "post-1",
    title: "Publicación anterior",
    slug: "publicacion-anterior",
    category: "evento",
    excerpt: "Resumen",
    content: "Contenido",
    coverImageUrl: "https://cdn.test/old.png",
    pdfUrl: null,
    publishedAt: "2026-01-01",
    isPublished: true,
    createdBy: "user-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeBlogRepository(overrides: Partial<BlogRepository> = {}) {
  let created: CreateBlogPostRecord | null = null;
  let updated: { id: string; input: UpdateBlogPostRecord } | null = null;
  let deletedId: string | null = null;

  const repository: BlogRepository = {
    async listPublished() {
      return ok([]);
    },
    async findBySlug() {
      return ok(null);
    },
    async listAll() {
      return ok([]);
    },
    async findById() {
      return ok(makePost());
    },
    async create(input) {
      created = input;
      return ok(makePost({ ...input, id: "post-1" }));
    },
    async update(id, input) {
      updated = { id, input };
      return ok(makePost({ ...input, id, createdBy: null }));
    },
    async delete(id) {
      deletedId = id;
      return ok(undefined);
    },
    ...overrides,
  };

  return {
    repository,
    getCreated: () => created,
    getUpdated: () => updated,
    getDeletedId: () => deletedId,
  };
}

function makeStorage(overrides: Partial<StorageService> = {}) {
  const uploads: string[] = [];
  const removed: string[] = [];

  const storage: StorageService = {
    async upload(input) {
      uploads.push(input.bucket);
      return ok({ url: `https://cdn.test/${input.path}` });
    },
    async remove(_bucket, url) {
      if (url) removed.push(url);
      return ok(undefined);
    },
    ...overrides,
  };

  return { storage, uploads, removed };
}

function makeInput(overrides: Partial<PostFormInput> = {}): PostFormInput {
  return {
    title: "Día del Niño y la Niña 2026",
    category: "evento",
    publishedAt: "2026-10-25",
    excerpt: "Una jornada mágica.",
    content: "Contenido de la publicación.",
    isPublished: true,
    ...overrides,
  };
}

describe("blog.service", () => {
  it("crea un evento con imagen, slug y autor", async () => {
    // Arrange
    const { repository, getCreated } = makeBlogRepository();
    const { storage, uploads } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };
    const file = new File(["png"], "cover.png", { type: "image/png" });

    // Act
    const result = await createPost(makeInput({ coverImage: file }), deps);

    // Assert
    expect(result.ok).toBe(true);
    expect(getCreated()?.slug).toBe("dia-del-nino-y-la-nina-2026");
    expect(getCreated()?.createdBy).toBe("user-1");
    expect(getCreated()?.coverImageUrl).toMatch(/\.png$/);
    expect(uploads).toEqual(["images"]);
  });

  it("rechaza un título que no produce una URL válida", async () => {
    // Arrange
    const { repository } = makeBlogRepository();
    const { storage } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };

    // Act
    const result = await createPost(makeInput({ title: "!!!" }), deps);

    // Assert
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("URL");
    }
  });

  it("conserva la imagen anterior al editar sin subir una nueva", async () => {
    // Arrange
    const { repository, getUpdated } = makeBlogRepository();
    const { storage, removed } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };

    // Act
    const result = await updatePost("post-1", makeInput(), deps);

    // Assert
    expect(result.ok).toBe(true);
    expect(getUpdated()?.input.coverImageUrl).toBe("https://cdn.test/old.png");
    expect(removed).toEqual([]);
  });

  it("elimina la publicación y sus archivos adjuntos", async () => {
    // Arrange
    const { repository, getDeletedId } = makeBlogRepository({
      async findById() {
        return ok(makePost({ pdfUrl: "https://cdn.test/old.pdf" }));
      },
    });
    const { storage, removed } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };

    // Act
    const result = await deletePost("post-1", deps);

    // Assert
    expect(result.ok).toBe(true);
    expect(getDeletedId()).toBe("post-1");
    expect(removed).toEqual([
      "https://cdn.test/old.png",
      "https://cdn.test/old.pdf",
    ]);
  });

  it("crea una circular con PDF sin guardar imagen de portada", async () => {
    // Arrange
    const { repository, getCreated } = makeBlogRepository();
    const { storage, uploads } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };
    const pdf = new File(["pdf"], "circular.pdf", { type: "application/pdf" });

    // Act
    const result = await createPost(
      makeInput({ category: "circular", coverImage: undefined, pdfFile: pdf }),
      deps,
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(getCreated()?.pdfUrl).toMatch(/\.pdf$/);
    expect(getCreated()?.coverImageUrl).toBeNull();
    expect(uploads).toEqual(["documents"]);
  });

  it("no guarda la publicación si la subida del archivo falla", async () => {
    // Arrange
    const { repository, getCreated } = makeBlogRepository();
    const { storage } = makeStorage({
      async upload() {
        return { ok: false, message: "Sin conexión." };
      },
    } as Partial<StorageService>);
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };
    const file = new File(["png"], "cover.png", { type: "image/png" });

    // Act
    const result = await createPost(makeInput({ coverImage: file }), deps);

    // Assert
    expect(result).toEqual({ ok: false, message: "Sin conexión." });
    expect(getCreated()).toBeNull();
  });

  it("borra los archivos subidos si el guardado en la base de datos falla", async () => {
    // Arrange
    const { repository } = makeBlogRepository({
      async create() {
        return { ok: false, message: "No se pudo guardar la publicación." };
      },
    });
    const { storage, removed } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };
    const file = new File(["png"], "cover.png", { type: "image/png" });

    // Act
    const result = await createPost(makeInput({ coverImage: file }), deps);

    // Assert
    expect(result.ok).toBe(false);
    expect(removed).toHaveLength(1);
    expect(removed[0]).toMatch(/\.png$/);
  });

  it("elimina la imagen anterior al cambiar un evento por una circular", async () => {
    // Arrange
    const { repository, getUpdated } = makeBlogRepository();
    const { storage, removed } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };
    const pdf = new File(["pdf"], "circular.pdf", { type: "application/pdf" });

    // Act
    const result = await updatePost(
      "post-1",
      makeInput({ category: "circular", coverImage: undefined, pdfFile: pdf }),
      deps,
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(getUpdated()?.input.coverImageUrl).toBeNull();
    expect(removed).toEqual(["https://cdn.test/old.png"]);
  });

  it("informa cuando la publicación a eliminar no existe", async () => {
    // Arrange
    const { repository, getDeletedId } = makeBlogRepository({
      async findById() {
        return ok(null);
      },
    });
    const { storage } = makeStorage();
    const deps = {
      repository,
      storage,
      getCurrentUserId: async () => ok("user-1"),
    };

    // Act
    const result = await deletePost("missing", deps);

    // Assert
    expect(result).toEqual({ ok: false, message: "La publicación no existe." });
    expect(getDeletedId()).toBeNull();
  });
});
