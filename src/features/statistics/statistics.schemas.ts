import { z } from "zod";
import { STATISTIC_KEYS, type StatisticKey } from "./statistics.types";

export const statisticsSchema = z.object({
  docentes: z.coerce.number().int().min(0).max(99999),
  estudiantes: z.coerce.number().int().min(0).max(99999),
  graduados: z.coerce.number().int().min(0).max(99999),
  anios_experiencia: z.coerce.number().int().min(0).max(9999),
});

export type StatisticsInput = z.infer<typeof statisticsSchema>;

export function toStatisticsValues(
  values: Record<string, number>,
): Record<StatisticKey, number> {
  return Object.fromEntries(
    STATISTIC_KEYS.map((key) => [key, Number(values[key] ?? 0)]),
  ) as Record<StatisticKey, number>;
}
