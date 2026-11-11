import type { Database } from "@/types/database";
import { getSupabaseClient, type AppSupabaseClient } from "@/lib/supabase";
import { fail, ok, type ServiceResult } from "@/lib/result";
import {
  STATISTIC_KEYS,
  statisticLabels,
  type Statistic,
  type StatisticKey,
} from "./statistics.types";

type StatisticRow = Database["public"]["Tables"]["statistics"]["Row"];

const READ_ONLY_MESSAGE = "Configura Supabase en el build para guardar cambios reales.";

export interface StatisticsRepository {
  list(): Promise<ServiceResult<Statistic[]>>;
  listAdmin(): Promise<ServiceResult<Statistic[]>>;
  save(values: Record<StatisticKey, number>): Promise<ServiceResult<void>>;
}

function toStatistic(row: StatisticRow): Statistic {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    value: row.value,
    updatedAt: row.updated_at,
  };
}

export const demoStatistics: Statistic[] = [
  {
    id: "stat-1",
    key: "docentes",
    label: "Docentes",
    value: 7,
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "stat-2",
    key: "estudiantes",
    label: "Estudiantes",
    value: 70,
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "stat-3",
    key: "graduados",
    label: "Graduados",
    value: 250,
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "stat-4",
    key: "anios_experiencia",
    label: "Años de experiencia",
    value: 20,
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
];

function createSupabaseStatisticsRepository(
  supabase: AppSupabaseClient,
): StatisticsRepository {
  return {
    async list() {
      const { data, error } = await supabase.from("statistics").select("*");

      if (error) {
        return ok(demoStatistics);
      }

      return ok((data ?? []).map(toStatistic));
    },

    async listAdmin() {
      const { data, error } = await supabase.from("statistics").select("*");

      if (error) {
        return ok([]);
      }

      return ok((data ?? []).map(toStatistic));
    },

    async save(values) {
      const now = new Date().toISOString();
      const rows = STATISTIC_KEYS.map((key) => ({
        key,
        label: statisticLabels[key],
        value: values[key],
        updated_at: now,
      }));

      const { error } = await supabase
        .from("statistics")
        .upsert(rows, { onConflict: "key" });

      if (error) {
        return fail("No se pudieron guardar las estadísticas.");
      }

      return ok(undefined);
    },
  };
}

const demoStatisticsRepository: StatisticsRepository = {
  async list() {
    return ok(demoStatistics);
  },

  async listAdmin() {
    return ok(demoStatistics);
  },

  async save() {
    return fail(READ_ONLY_MESSAGE);
  },
};

export function getStatisticsRepository(): StatisticsRepository {
  const supabase = getSupabaseClient();
  return supabase
    ? createSupabaseStatisticsRepository(supabase)
    : demoStatisticsRepository;
}

