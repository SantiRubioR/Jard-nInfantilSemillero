import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import type { StorageService } from "@/lib/storage";
import type { FacilityRepository } from "@/features/facilities/facilities.repository";
import {
  createFacility,
  deleteFacility,
} from "@/features/facilities/facilities.service";
import type { Facility } from "@/features/facilities/facilities.types";

function makeFacility(overrides: Partial<Facility> = {}): Facility {
  return {
    id: "fac-1",
    title: "Aula de clases",
    description: "Espacio de aprendizaje.",
    imageUrl: "https://cdn.test/old.png",
    sortOrder: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeRepository(overrides: Partial<FacilityRepository> = {}) {
  let created: {
    title: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
  } | null = null;
  let deletedId: string | null = null;

  const repository: FacilityRepository = {
    async listPublished() {
      return ok([makeFacility()]);
    },
    async listAll() {
      return ok([makeFacility()]);
    },
    async findById() {
      return ok(makeFacility());
    },
    async create(input) {
      created = input;
      return ok(makeFacility({ ...input, id: "fac-2" }));
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
    getDeletedId: () => deletedId,
  };
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

describe("facilities.service", () => {
  it("crea una instalación con imagen y siguiente orden", async () => {
    // Arrange
    const { repository, getCreated } = makeRepository();
    const { storage } = makeStorage();
    const file = new File(["png"], "aula.png", { type: "image/png" });

    // Act
    const result = await createFacility(
      { title: "Aula de prejardín", description: "Ambiente seguro.", file },
      { repository, storage },
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(getCreated()?.title).toBe("Aula de prejardín");
    expect(getCreated()?.imageUrl).toMatch(/\.png$/);
    expect(getCreated()?.sortOrder).toBe(2);
  });

  it("elimina la instalación y su imagen", async () => {
    // Arrange
    const { repository, getDeletedId } = makeRepository();
    const { storage, removed } = makeStorage();

    // Act
    const result = await deleteFacility("fac-1", { repository, storage });

    // Assert
    expect(result.ok).toBe(true);
    expect(getDeletedId()).toBe("fac-1");
    expect(removed).toEqual(["https://cdn.test/old.png"]);
  });
});
