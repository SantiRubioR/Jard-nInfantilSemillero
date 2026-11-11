"use client";

import { StatsBand } from "./stats-band";
import { useStatisticsViewModel } from "../statistics.hooks";

export function StatsSection() {
  const { statistics } = useStatisticsViewModel();

  return <StatsBand statistics={statistics} />;
}
