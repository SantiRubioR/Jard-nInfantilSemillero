import type { Database } from "@/types/database";
import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import {
  institutionalDocumentCatalog,
  type DocumentType,
  type InstitutionalDocument,
} from "./institutional-documents.types";

type DocumentRow = Database["public"]["Tables"]["institutional_documents"]["Row"];

const READ_ONLY_MESSAGE = "Configura Supabase en el build para guardar cambios reales.";

export type InstitutionalDocumentRecord = {
  id: string;
  type: DocumentType;
  title: string;
  pdfUrl: string | null;
  updatedAt: string;
};

export interface InstitutionalDocumentRepository {
  list(): Promise<ServiceResult<InstitutionalDocumentRecord[]>>;
  findByType(
    type: DocumentType,
  ): Promise<ServiceResult<InstitutionalDocumentRecord | null>>;
  savePdf(input: {
    type: DocumentType;
    title: string;
    pdfUrl: string;
  }): Promise<ServiceResult<InstitutionalDocumentRecord>>;
}

export const demoInstitutionalDocuments: InstitutionalDocument[] =
  institutionalDocumentCatalog.map((document, index) => ({
    ...document,
    id: `doc-${index + 1}`,
    pdfUrl: null,
    updatedAt: "2026-10-01T12:00:00.000Z",
  }));

function toRecord(row: DocumentRow): InstitutionalDocumentRecord {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    pdfUrl: row.pdf_url,
    updatedAt: row.updated_at,
  };
}

function createSupabaseInstitutionalDocumentRepository(
  supabase: AppSupabaseClient,
): InstitutionalDocumentRepository {
  return {
    async list() {
      const { data, error } = await supabase
        .from("institutional_documents")
        .select("*");

      if (error) {
        return ok(
          demoInstitutionalDocuments.map((document) => ({
            id: document.id,
            type: document.type,
            title: document.title,
            pdfUrl: document.pdfUrl,
            updatedAt: document.updatedAt,
          })),
        );
      }

      return ok((data ?? []).map(toRecord));
    },

    async findByType(type) {
      const { data, error } = await supabase
        .from("institutional_documents")
        .select("*")
        .eq("type", type)
        .maybeSingle();

      if (error) {
        return fail("No se pudo consultar el documento institucional.");
      }

      return ok(data ? toRecord(data) : null);
    },

    async savePdf(input) {
      const { data, error } = await supabase
        .from("institutional_documents")
        .upsert(
          {
            type: input.type,
            title: input.title,
            pdf_url: input.pdfUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "type" },
        )
        .select("*")
        .single();

      if (error || !data) {
        return fail("No se pudo guardar el documento.");
      }

      return ok(toRecord(data));
    },
  };
}

const demoInstitutionalDocumentRepository: InstitutionalDocumentRepository = {
  async list() {
    return ok(
      demoInstitutionalDocuments.map((document) => ({
        id: document.id,
        type: document.type,
        title: document.title,
        pdfUrl: document.pdfUrl,
        updatedAt: document.updatedAt,
      })),
    );
  },

  async findByType(type) {
    const document = demoInstitutionalDocuments.find(
      (item) => item.type === type,
    );
    return ok(
      document
        ? {
            id: document.id,
            type: document.type,
            title: document.title,
            pdfUrl: document.pdfUrl,
            updatedAt: document.updatedAt,
          }
        : null,
    );
  },

  async savePdf() {
    return fail(READ_ONLY_MESSAGE);
  },
};

export function getInstitutionalDocumentRepository(): InstitutionalDocumentRepository {
  const supabase = getSupabaseClient();
  return supabase
    ? createSupabaseInstitutionalDocumentRepository(supabase)
    : demoInstitutionalDocumentRepository;
}
