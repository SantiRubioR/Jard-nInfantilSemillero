"use client";

import { useState } from "react";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { fail, ok, type ActionResult } from "@/lib/result";
import {
  createFacility,
  deleteFacility,
  listAllFacilities,
  listFacilities,
} from "./facilities.service";
import { demoFacilities } from "./facilities.repository";

export function useFacilitiesViewModel() {
  const { data: facilities, loading, error, reload } = useAsyncData(
    () => listFacilities(),
    demoFacilities.filter((facility) => facility.isActive),
  );

  return { facilities, loading, error, reload };
}

export function useFacilitiesAdminViewModel() {
  const { data: facilities, loading, error, reload } = useAsyncData(
    () => listAllFacilities(),
    demoFacilities,
  );
  const [pending, setPending] = useState(false);

  async function create(
    title: string,
    description: string,
    file: File,
  ): Promise<ActionResult> {
    setPending(true);
    const result = await createFacility({ title, description, file });
    setPending(false);

    if (result.ok) {
      reload();
      return ok(undefined, result.message);
    }

    return fail(result.message);
  }

  async function remove(id: string): Promise<ActionResult> {
    setPending(true);
    const result = await deleteFacility(id);
    setPending(false);

    if (result.ok) {
      reload();
      return ok(undefined, result.message);
    }

    return fail(result.message);
  }

  return { facilities, loading, error, pending, create, remove, reload };
}
