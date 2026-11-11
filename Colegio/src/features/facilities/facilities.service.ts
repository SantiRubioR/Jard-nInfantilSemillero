import { fail, ok, type ServiceResult } from "@/lib/result";
import { storageService, uploadFile, type StorageService } from "@/lib/storage";
import {
  getFacilityRepository,
  type FacilityRepository,
} from "./facilities.repository";
import { facilitySchema } from "./facilities.schemas";
import type { Facility } from "./facilities.types";

export type FacilitiesDeps = {
  repository: FacilityRepository;
  storage: StorageService;
};

function defaultDeps(): FacilitiesDeps {
  return {
    repository: getFacilityRepository(),
    storage: storageService,
  };
}

export async function listFacilities(
  deps: FacilitiesDeps = defaultDeps(),
): Promise<ServiceResult<Facility[]>> {
  const result = await deps.repository.listPublished();

  if (!result.ok) {
    return result;
  }

  return ok([...result.data].sort((a, b) => a.sortOrder - b.sortOrder));
}

export async function listAllFacilities(
  deps: FacilitiesDeps = defaultDeps(),
): Promise<ServiceResult<Facility[]>> {
  const result = await deps.repository.listAll();

  if (!result.ok) {
    return result;
  }

  return ok([...result.data].sort((a, b) => a.sortOrder - b.sortOrder));
}

export async function createFacility(
  input: { title: string; description: string; file: File },
  deps: FacilitiesDeps = defaultDeps(),
): Promise<ServiceResult<Facility>> {
  const parsed = facilitySchema.safeParse({
    title: input.title,
    description: input.description,
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Revisa los datos.");
  }

  if (input.file.size === 0) {
    return fail("Selecciona una imagen.");
  }

  const all = await deps.repository.listAll();

  if (!all.ok) {
    return all;
  }

  const nextOrder = all.data.length + 1;

  const upload = await uploadFile(deps.storage, {
    bucket: "images",
    path: `facilities/${crypto.randomUUID()}`,
    file: input.file,
    kind: "image",
  });

  if (!upload.ok) {
    return upload;
  }

  const created = await deps.repository.create({
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    imageUrl: upload.data.url,
    sortOrder: nextOrder,
  });

  if (!created.ok) {
    await deps.storage.remove("images", upload.data.url);
    return created;
  }

  return ok(created.data, "Instalación agregada correctamente.");
}

export async function deleteFacility(
  id: string,
  deps: FacilitiesDeps = defaultDeps(),
): Promise<ServiceResult<void>> {
  const existing = await deps.repository.findById(id);

  if (!existing.ok) {
    return existing;
  }

  if (!existing.data) {
    return fail("La instalación no existe.");
  }

  const deleted = await deps.repository.delete(id);

  if (!deleted.ok) {
    return deleted;
  }

  await deps.storage.remove("images", existing.data.imageUrl);
  return ok(undefined, "Instalación eliminada correctamente.");
}
