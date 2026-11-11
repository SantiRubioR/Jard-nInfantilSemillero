import type { Statistic } from "../statistics.types";
import { statValue } from "@/lib/utils";

export function StatsBand({ statistics }: { statistics: Statistic[] }) {
  if (statistics.length === 0) {
    return null;
  }

  return (
    <section aria-label="Cifras institucionales" className="bg-accent">
      <div className="container-page grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:py-12">
        {statistics.map((stat) => (
          <div key={stat.key} className="text-center">
            <p className="font-display text-4xl font-extrabold leading-none text-brand-deep md:text-5xl">
              {statValue(stat.value)}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-deep/80 md:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
