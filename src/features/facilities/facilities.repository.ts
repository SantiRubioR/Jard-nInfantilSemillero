import type { Database } from "@/types/database";
import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import type { Facility } from "./facilities.types";

type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];

const READ_ONLY_MESSAGE = "Configura Supabase en el build para guardar cambios reales.";

export interface FacilityRepository {
  listPublished(): Promise<ServiceResult<Facility[]>>;
  listAll(): Promise<ServiceResult<Facility[]>>;
  findById(id: string): Promise<ServiceResult<Facility | null>>;
  create(input: {
    title: string;
    description: string;
    imageUrl: string;
    sortOrder: number;
  }): Promise<ServiceResult<Facility>>;
  delete(id: string): Promise<ServiceResult<void>>;
}

export const demoFacilities: Facility[] = [
  {
    id: "fac-1",
    title: "Aula de clases",
    description:
      "Espacios iluminados y organizados para el aprendizaje activo y el trabajo colaborativo.",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80",
    sortOrder: 1,
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "fac-2",
    title: "Comedor escolar",
    description:
      "Un lugar limpio y acogedor para compartir los alimentos y fortalecer hábitos saludables.",
    imageUrl:
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1400&q=80",
    sortOrder: 2,
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "fac-3",
    title: "Zona de juego",
    description:
      "Juegos infantiles seguros que estimulan la motricidad, la imaginación y la socialización.",
    imageUrl:
      "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?auto=format&fit=crop&w=1400&q=80",
    sortOrder: 3,
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "fac-4",
    title: "Aula de prejardín",
    description:
      "Ambiente diseñado para los más pequeños, con materiales didácticos y espacios de exploración.",
    imageUrl:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=80",
    sortOrder: 4,
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
];

function toFacility(row: FacilityRow): Facility {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

const demoFacilityRepository: FacilityRepository = {
  async listPublished() {
    return ok(demoFacilities.filter((facility) => facility.isActive));
  },

  async listAll() {
    return ok(demoFacilities);
  },

  async findById(id) {
    return ok(demoFacilities.find((facility) => facility.id === id) ?? null);
  },

  async create() {
    return fail(READ_ONLY_MESSAGE);
  },

  async delete() {
    return fail(READ_ONLY_MESSAGE);
  },
};

function createSupabaseFacilityRepository(
  supabase: AppSupabaseClient,
): FacilityRepository {
  return {
    async listPublished() {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        return ok(demoFacilities.filter((facility) => facility.isActive));
      }

      return ok((data ?? []).map(toFacility));
    },

    async listAll() {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        return ok([]);
      }

      return ok((data ?? []).map(toFacility));
    },

    async findById(id) {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return fail("No se pudo consultar la instalación.");
      }

      return ok(data ? toFacility(data) : null);
    },

    async create(input) {
      const { data, error } = await supabase
        .from("facilities")
        .insert({
          title: input.title,
          description: input.description || null,
          image_url: input.imageUrl,
          sort_order: input.sortOrder,
          is_active: true,
        })
        .select("*")
        .single();

      if (error || !data) {
        return fail("No se pudo guardar la instalación.");
      }

      return ok(toFacility(data));
    },

    async delete(id) {
      const { error } = await supabase.from("facilities").delete().eq("id", id);

      if (error) {
        return fail("No se pudo eliminar la instalación.");
      }

      return ok(undefined);
    },
  };
}

export function getFacilityRepository(): FacilityRepository {
  const supabase = getSupabaseClient();
  return supabase ? createSupabaseFacilityRepository(supabase) : demoFacilityRepository;
}
