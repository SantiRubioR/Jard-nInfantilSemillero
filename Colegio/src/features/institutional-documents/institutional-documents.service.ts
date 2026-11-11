import { fail, ok, type ServiceResult } from "@/lib/result";
import { storageService, uploadFile, type StorageService } from "@/lib/storage";
import {
  getInstitutionalDocumentRepository,
  type InstitutionalDocumentRecord,
  type InstitutionalDocumentRepository,
} from "./institutional-documents.repository";
import {
  findDocumentCatalog,
  institutionalDocumentCatalog,
  type DocumentType,
  type InstitutionalDocument,
} from "./institutional-documents.types";

export type InstitutionalDocumentsDeps = {
  repository: InstitutionalDocumentRepository;
  storage: StorageService;
};

function defaultDeps(): InstitutionalDocumentsDeps {
  return {
    repository: getInstitutionalDocumentRepository(),
    storage: storageService,
  };
}

export async function listInstitutionalDocuments(
  deps: InstitutionalDocumentsDeps = defaultDeps(),
): Promise<ServiceResult<InstitutionalDocument[]>> {
  const result = await deps.repository.list();

  if (!result.ok) {
    return result;
  }

  const records = new Map(result.data.map((record) => [record.type, record]));

  return ok(
    institutionalDocumentCatalog.map((catalog) => {
      const record: InstitutionalDocumentRecord | undefined = records.get(
        catalog.type,
      );
      return {
        ...catalog,
        id: record?.id ?? `catalog-${catalog.type}`,
        pdfUrl: record?.pdfUrl ?? null,
        updatedAt: record?.updatedAt ?? "2026-10-01T12:00:00.000Z",
      };
    }),
  );
}

export async function uploadInstitutionalDocument(
  input: { type: DocumentType; title: string; file: File },
  deps: InstitutionalDocumentsDeps = defaultDeps(),
): Promise<ServiceResult<InstitutionalDocument>> {
  const catalog = findDocumentCatalog(input.type);

  if (!catalog) {
    return fail("El documento institucional no existe.");
  }

  if (input.file.size === 0) {
    return fail("Selecciona un archivo PDF.");
  }

  const existing = await deps.repository.findByType(input.type);

  if (!existing.ok) {
    return existing;
  }

  const upload = await uploadFile(deps.storage, {
    bucket: "documents",
    path: `institutional/${input.type}-${Date.now()}`,
    file: input.file,
    kind: "pdf",
  });

  if (!upload.ok) {
    return upload;
  }

  const saved = await deps.repository.savePdf({
    type: input.type,
    title: input.title || catalog.title,
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
      ...catalog,
      id: saved.data.id,
      title: saved.data.title,
      pdfUrl: saved.data.pdfUrl,
      updatedAt: saved.data.updatedAt,
    },
    "Documento actualizado correctamente.",
  );
}
