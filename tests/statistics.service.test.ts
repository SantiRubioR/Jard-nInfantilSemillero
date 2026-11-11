import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import type { StatisticsRepository } from "@/features/statistics/statistics.repository";
import {
  getStatistics,
  saveStatistics,
} from "@/features/statistics/statistics.service";
import type { Statistic } from "@/features/statistics/statistics.types";

function makeStatistic(key: Statistic["key"], value: number): Statistic {
  return {
    id: key,
    key,
    label: key,
    value,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function makeRepository(overrides: Partial<StatisticsRepository> = {}) {
  let saved: Record<string, number> | null = null;

  const repository: StatisticsRepository = {
    async list() {
      return ok([
        makeStatistic("anios_experiencia", 20),
        makeStatistic("docentes", 7),
        makeStatistic("graduados", 250),
        makeStatistic("estudiantes", 70),
      ]);
    },
    async listAdmin() {
      return ok([]);
    },
    async save(values) {
      saved = values;
      return ok(undefined);
    },
    ...overrides,
  };

  return { repository, getSaved: () => saved };
}

describe("statistics.service", () => {
  it("ordena las estadísticas según el catálogo", async () => {
    // Arrange
    const { repository } = makeRepository();

    // Act
    const result = await getStatistics({ repository });

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.map((stat) => stat.key)).toEqual([
        "docentes",
        "estudiantes",
        "graduados",
        "anios_experiencia",
      ]);
    }
  });

  it("guarda los cuatro contadores validados", async () => {
    // Arrange
    const { repository, getSaved } = makeRepository();

    // Act
    const result = await saveStatistics(
      {
        docentes: 7,
        estudiantes: 70,
        graduados: 250,
        anios_experiencia: 20,
      },
      { repository },
    );

    // Assert
    expect(result.ok).toBe(true);
    expect(getSaved()).toEqual({
      docentes: 7,
      estudiantes: 70,
      graduados: 250,
      anios_experiencia: 20,
    });
  });

  it("rechaza valores negativos sin llamar al repositorio", async () => {
    // Arrange
    const { repository, getSaved } = makeRepository();

    // Act
    const result = await saveStatistics(
      {
        docentes: -1,
        estudiantes: 70,
        graduados: 250,
        anios_experiencia: 20,
      },
      { repository },
    );

    // Assert
    expect(result.ok).toBe(false);
    expect(getSaved()).toBeNull();
  });
});
