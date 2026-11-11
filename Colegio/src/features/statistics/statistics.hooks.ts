"use client";

import { useState } from "react";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import {
  initialActionState,
  type ActionState,
} from "@/lib/action-state";
import { fail, ok, type ActionResult } from "@/lib/result";
import {
  getStatistics,
  getStatisticsAdmin,
  saveStatistics,
} from "./statistics.service";
import { demoStatistics } from "./statistics.repository";
import type { StatisticsInput } from "./statistics.schemas";

export function useStatisticsViewModel(options: { admin?: boolean } = {}) {
  const { data: statistics, loading, error, reload } = useAsyncData(
    options.admin ? getStatisticsAdmin : getStatistics,
    demoStatistics,
    [options.admin],
  );

  return { statistics, loading, error, reload };
}

export function useStatisticsAdminViewModel() {
  const viewModel = useStatisticsViewModel({ admin: true });
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<ActionState>(initialActionState);

  async function save(values: StatisticsInput): Promise<ActionResult> {
    setPending(true);
    const result = await saveStatistics(values);
    setPending(false);

    if (result.ok) {
      const message = "Estadísticas actualizadas correctamente.";
      setState({ status: "success", message });
      viewModel.reload();
      return ok(undefined, message);
    }

    setState({ status: "error", message: result.message });
    return fail(result.message);
  }

  return {
    ...viewModel,
    pending,
    state,
    save,
  };
}
