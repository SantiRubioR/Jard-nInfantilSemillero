"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServiceResult } from "@/lib/result";

// Carga datos al montar y permite recargarlos. Si la carga falla, conserva
// los datos anteriores y expone el mensaje de error.
export function useAsyncData<T>(
  load: () => Promise<ServiceResult<T>>,
  initialData: T,
  deps: readonly unknown[] = [],
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    load().then((result) => {
      if (!active) return;

      if (result.ok) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.message);
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
    // Las dependencias extra las declara quien usa el hook (por ejemplo, la categoría).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }, []);

  return { data, loading, error, reload };
}
