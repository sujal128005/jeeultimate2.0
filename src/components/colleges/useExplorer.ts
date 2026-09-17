"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { colleges } from "@/data/colleges";
import {
  emptyState,
  filterColleges,
  paramsFromState,
  stateFromParams,
  type ExplorerState,
} from "@/lib/colleges/engine";

/**
 * Explorer state lives in the page address, so any search can be shared:
 * /colleges?type=nit&state=tamil-nadu
 */
export function useExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const state = useMemo(() => stateFromParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const results = useMemo(() => filterColleges(colleges, state), [state]);

  const write = useCallback(
    (next: ExplorerState) => {
      const query = paramsFromState(next);
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname],
  );

  const update = useCallback(
    (patch: Partial<ExplorerState> | ((s: ExplorerState) => Partial<ExplorerState>)) => {
      const current = stateFromParams(new URLSearchParams(window.location.search));
      const delta = typeof patch === "function" ? patch(current) : patch;
      write({ ...current, ...delta });
    },
    [write],
  );

  const toggle = useCallback(
    (facet: keyof ExplorerState, value: string) =>
      update((s) => {
        const list = s[facet] as string[];
        return { [facet]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] } as Partial<ExplorerState>;
      }),
    [update],
  );

  const clearFilters = useCallback(
    () => update((s) => ({ ...emptyState, sort: s.sort, view: s.view })),
    [update],
  );

  return { state, results, all: colleges, update, toggle, clearFilters };
}

export type Explorer = ReturnType<typeof useExplorer>;

/** Scroll the explorer into view, below the fixed header. */
export function scrollToExplorer() {
  const el = document.getElementById("explore");
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 76;
  if (window.scrollY < top - 4) window.scrollTo({ top, behavior: "smooth" });
}
