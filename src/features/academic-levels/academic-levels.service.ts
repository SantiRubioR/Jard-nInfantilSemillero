import { fail, ok, type ServiceResult } from "@/lib/result";
import { storageService, uploadFile, type StorageService } from "@/lib/storage";
import {
  getAcademicLevelRepository,
  type AcademicLevelRecord,
  type AcademicLevelRepository,
} from "./academic-levels.repository";
import {
  academicLevelCatalog,
  findAcademicLevelContent,
  sortAcademicLevels,
  type AcademicLevel,
} from "./academic-levels.types";

export type AcademicLevelsDeps = {
  repository: AcademicLevelRepository;
  storage: StorageService;
};

function defaultDeps(): AcademicLevelsDeps {
  return {
    repository: getAcademicLevelRepository(),
    storage: storageService,
  };
}

function merge(
  content: (typeof academicLevelCatalog)[number],
  record: AcademicLevelRecord | undefined,
): AcademicLevel {
  return {
    ...content,
    id: record?.id ?? `catalog-${content.slug}`,
    pdfUrl: record?.pdfUrl ?? null,
    updatedAt: record?.updatedAt ?? "2026-10-01T12:00:00.000Z",
  };
}

export async function listAcademicLevels(
  deps: AcademicLevelsDeps = defaultDeps(),
): Promise<ServiceResult<AcademicLevel[]>> {
  const result = await deps.repository.list();

  if (!result.ok) {
    return result;
  }

  const records = new Map(result.data.map((record) => [record.slug, record]));

  return ok(
    sortAcademicLevels(
      academicLevelCatalog.map((content) =>
        merge(content, records.get(content.slug)),
      ),
    ),
  );
}

export async function uploadAcademicLevelPdf(
  input: { slug: string; name: string; file: File },
  deps: AcademicLevelsDeps = defaultDeps(),
): Promise<ServiceResult<AcademicLevel>> {
  const content = findAcademicLevelContent(input.slug);

  if (!content) {
    return fail("El nivel educativo no existe.");
  }

  if (input.file.size === 0) {
    return fail("Selecciona un archivo PDF.");
  }

  const existing = await deps.repository.findBySlug(input.slug);

  if (!existing.ok) {
    return existing;
  }

  const upload = await uploadFile(deps.storage, {
    bucket: "documents",
    path: `academic-levels/${input.slug}-${Date.now()}`,
    file: input.file,
    kind: "pdf",
  });

  if (!upload.ok) {
    return upload;
  }

  const saved = await deps.repository.savePdf({
    slug: input.slug,
    name: input.name || content.name,
    pdfUrl: upload.data.url,
  });

  if (!saved.ok) {
    await deps.storage.remove("documents", upload.data.url);
    return saved;
  }

  if (existing.data?.pdfUrl && existing.data.pdfUrl !== upload.data.url) {
    await deps.storage.remove("documents", existing.data.pdfUrl);
  }

  return ok(
    {
      ...content,
      id: saved.data.id,
      pdfUrl: saved.data.pdfUrl,
      updatedAt: saved.data.updatedAt,
    },
    "Temario actualizado correctamente.",
  );
}
