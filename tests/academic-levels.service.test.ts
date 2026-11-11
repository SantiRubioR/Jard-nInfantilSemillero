import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import type { StorageService } from "@/lib/storage";
import type { AcademicLevelRepository } from "@/features/academic-levels/academic-levels.repository";
import {
  listAcademicLevels,
  uploadAcademicLevelPdf,
} from "@/features/academic-levels/academic-levels.service";

function makeRepository(overrides: Partial<AcademicLevelRepository> = {}) {
  let saved: { slug: string; name: string; pdfUrl: string } | null = null;

  const repository: AcademicLevelRepository = {
    async list() {
      return ok([]);
    },
    async findBySlug(slug) {
      return ok({
        id: "level-1",
        slug,
        name: "Prejardín",
        pdfUrl: "https://cdn.test/old.pdf",
        updatedAt: "2026-01-01T00:00:00.000Z",
      });
    },
    async savePdf(input) {
      saved = input;
      return ok({
        id: "level-1",
        slug: input.slug,
        name: input.name,
        pdfUrl: input.pdfUrl,
        updatedAt: "2026-02-01T00:00:00.000Z",
      });
    },
    ...overrides,
  };

  return { repository, getSaved: () => saved };
}

function makeStorage(overrides: Partial<StorageService> = {}) {
  const removed: string[] = [];

  const storage: StorageService = {
    async upload(input) {
      return ok({ url: `https://cdn.test/${input.path}` });
    },
    async remove(_bucket, url) {
      if (url) removed.push(url);
      return ok(undefined);
    },
    ...overrides,
  };

  return { storage, removed };
}

describe("academic-levels.service", () => {
  it("lista los ocho niveles del catálogo con su PDF", async () => {
    // Arrange
    const { repository } = makeRepository({
      async list() {
        return ok([
          {
            id: "level-1",
            slug: "prejardin",
            name: "Prejardín",
            pdfUrl: "https://cdn.test/prejardin.pdf",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ]);
      },
    });

    // Act
    const result = await listAcademicLevels({ repository, storage: makeStorage().storage });

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(8);
      expect(result.data[0].slug).toBe("prejardin");
      expect(result.data[0].pdfUrl).toBe("https://cdn.test/prejardin.pdf");
    }
  });

  it("sube el PDF, guarda el nivel y elimina el archivo anterior", async () => {
    // Arrange
    const { repository, getSaved } = makeRepository();
    const { storage, removed } = makeStorage();
    const file = new File(["pdf"], "temario.pdf", { type: "application/pdf" });

    // Act
    const result = await uploadAcademicLevelPdf(
      { slug: "prejardin", name: "Prejardín", file },
      { repository, storage },
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(getSaved()?.slug).toBe("prejardin");
    expect(getSaved()?.pdfUrl).toMatch(/\.pdf$/);
    expect(removed).toEqual(["https://cdn.test/old.pdf"]);
  });
});
