export const STATISTIC_KEYS = [
  "docentes",
  "estudiantes",
  "graduados",
  "anios_experiencia",
] as const;

export type StatisticKey = (typeof STATISTIC_KEYS)[number];

export type Statistic = {
  id: string;
  key: StatisticKey;
  label: string;
  value: number;
  updatedAt: string;
};

export const statisticLabels: Record<StatisticKey, string> = {
  docentes: "Docentes",
  estudiantes: "Estudiantes",
  graduados: "Graduados",
  anios_experiencia: "Años de experiencia",
};

export const statisticOrder: Record<StatisticKey, number> = {
  docentes: 0,
  estudiantes: 1,
  graduados: 2,
  anios_experiencia: 3,
};

export function sortStatistics(statistics: Statistic[]): Statistic[] {
  return [...statistics].sort(
    (a, b) => (statisticOrder[a.key] ?? 99) - (statisticOrder[b.key] ?? 99),
  );
}
