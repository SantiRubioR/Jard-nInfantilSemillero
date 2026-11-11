import { fail, ok, type ServiceResult } from "@/lib/result";
import {
  getStatisticsRepository,
  type StatisticsRepository,
} from "./statistics.repository";
import {
  statisticsSchema,
  toStatisticsValues,
  type StatisticsInput,
} from "./statistics.schemas";
import { sortStatistics, type Statistic } from "./statistics.types";

export type StatisticsDeps = {
  repository: StatisticsRepository;
};

function defaultDeps(): StatisticsDeps {
  return { repository: getStatisticsRepository() };
}

export async function getStatistics(
  deps: StatisticsDeps = defaultDeps(),
): Promise<ServiceResult<Statistic[]>> {
  const result = await deps.repository.list();

  if (!result.ok) {
    return result;
  }

  return ok(sortStatistics(result.data));
}

export async function getStatisticsAdmin(
  deps: StatisticsDeps = defaultDeps(),
): Promise<ServiceResult<Statistic[]>> {
  const result = await deps.repository.listAdmin();

  if (!result.ok) {
    return result;
  }

  return ok(sortStatistics(result.data));
}

export async function saveStatistics(
  values: StatisticsInput | Record<string, number>,
  deps: StatisticsDeps = defaultDeps(),
): Promise<ServiceResult<void>> {
  const parsed = statisticsSchema.safeParse(values);

  if (!parsed.success) {
    return fail("Los contadores deben ser números enteros válidos.");
  }

  return deps.repository.save(toStatisticsValues(parsed.data));
}
