"use client";

import { useState } from "react";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { fail, ok, type ActionResult } from "@/lib/result";
import {
  listAcademicLevels,
  uploadAcademicLevelPdf,
} from "./academic-levels.service";
import {
  demoAcademicLevels,
} from "./academic-levels.repository";

export function useAcademicLevelsViewModel() {
  const { data: levels, loading, error, reload } = useAsyncData(
    () => listAcademicLevels(),
    demoAcademicLevels,
  );

  return { levels, loading, error, reload };
}

export function useAcademicLevelsAdminViewModel() {
  const viewModel = useAcademicLevelsViewModel();
  const [pending, setPending] = useState(false);

  async function upload(
    slug: string,
    name: string,
    file: File,
  ): Promise<ActionResult> {
    setPending(true);
    const result = await uploadAcademicLevelPdf({ slug, name, file });
    setPending(false);

    if (result.ok) {
      viewModel.reload();
      return ok(undefined, result.message);
    }

    return fail(result.message);
  }

  return { ...viewModel, pending, upload };
}
