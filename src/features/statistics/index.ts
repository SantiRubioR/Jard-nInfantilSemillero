export { StatsBand } from "./components/stats-band";
export { StatsSection } from "./components/stats-section";
export { StatisticsAdminPanel } from "./components/statistics-admin-panel";
export { getStatistics, saveStatistics } from "./statistics.service";
export { useStatisticsViewModel, useStatisticsAdminViewModel } from "./statistics.hooks";
export type { Statistic, StatisticKey } from "./statistics.types";
export { STATISTIC_KEYS, statisticLabels } from "./statistics.types";
