import type { Database } from "@/types/database";
import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import {
  academicLevelCatalog,
  type AcademicLevel,
} from "./academic-levels.types";

type AcademicLevelRow = Database["public"]["Tables"]["academic_levels"]["Row"];

const READ_ONLY_MESSAGE = "Configura Supabase en el build para guardar cambios reales.";

export type AcademicLevelRecord = {
  id: string;
  slug: string;
  name: string;
  pdfUrl: string | null;
  updatedAt: string;
};

export interface AcademicLevelRepository {
  list(): Promise<ServiceResult<AcademicLevelRecord[]>>;
  findBySlug(slug: string): Promise<ServiceResult<AcademicLevelRecord | null>>;
  savePdf(input: {
    slug: string;
    name: string;
    pdfUrl: string;
  }): Promise<ServiceResult<AcademicLevelRecord>>;
}

export const demoAcademicLevels: AcademicLevel[] = academicLevelCatalog.map(
  (level, index) => ({
    ...level,
    id: `level-${index + 1}`,
    pdfUrl: null,
    updatedAt: "2026-10-01T12:00:00.000Z",
  }),
);

function toRecord(row: AcademicLevelRow): AcademicLevelRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    pdfUrl: row.pdf_url,
    updatedAt: row.updated_at,
  };
}

function createSupabaseAcademicLevelRepository(
  supabase: AppSupabaseClient,
): AcademicLevelRepository {
  return {
    async list() {
      const { data, error } = await supabase.from("academic_levels").select("*");

      if (error) {
        return ok(
          demoAcademicLevels.map((level) => ({
            id: level.id,
            slug: level.slug,
            name: level.name,
            pdfUrl: level.pdfUrl,
            updatedAt: level.updatedAt,
          })),
        );
      }

      return ok((data ?? []).map(toRecord));
    },

    async findBySlug(slug) {
      const { data, error } = await supabase
        .from("academic_levels")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        return fail("No se pudo consultar el nivel académico.");
      }

      return ok(data ? toRecord(data) : null);
    },

    async savePdf(input) {
      const { data, error } = await supabase
        .from("academic_levels")
        .upsert(
          {
            slug: input.slug,
            name: input.name,
            pdf_url: input.pdfUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slug" },
        )
        .select("*")
        .single();

      if (error || !data) {
        return fail("No se pudo guardar el temario.");
      }

      return ok(toRecord(data));
    },
  };
}

const demoAcademicLevelRepository: AcademicLevelRepository = {
  async list() {
    return ok(
      demoAcademicLevels.map((level) => ({
        id: level.id,
        slug: level.slug,
        name: level.name,
        pdfUrl: level.pdfUrl,
        updatedAt: level.updatedAt,
      })),
    );
  },

  async findBySlug(slug) {
    const level = demoAcademicLevels.find((item) => item.slug === slug);
    return ok(
      level
        ? {
            id: level.id,
            slug: level.slug,
            name: level.name,
            pdfUrl: level.pdfUrl,
            updatedAt: level.updatedAt,
          }
        : null,
    );
  },

  async savePdf() {
    return fail(READ_ONLY_MESSAGE);
  },
};

export function getAcademicLevelRepository(): AcademicLevelRepository {
  const supabase = getSupabaseClient();
  return supabase
    ? createSupabaseAcademicLevelRepository(supabase)
    : demoAcademicLevelRepository;
}
