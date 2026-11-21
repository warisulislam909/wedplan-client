"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/** useApi("/vendor/services") → { data, loading, error, reload }. path = null এ request হয় না */
export function useApi(path, { auth = true } = {}) {
  const [state, setState] = useState({ data: null, loading: !!path, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { auth })
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, [path, auth, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
