import { DEFAULT_STREAM } from "@/config/counselling";
import type { Filters } from "./stats";
import type { Category, Gender, EnrolStatus } from "./types";

/** Turn the address bar into filters, ignoring anything we do not recognise. */
export function filtersFromParams(params: Record<string, string | string[] | undefined>): Filters {
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const days = Number(one("days"));
  const from = Number.isFinite(days) && days > 0 ? new Date(Date.now() - days * 86_400_000).toISOString() : undefined;

  return {
    from,
    category: (one("category") as Category | "ALL") ?? undefined,
    gender: (one("gender") as Gender | "ALL") ?? undefined,
    mentorId: one("mentorId"),
    status: (one("status") as EnrolStatus | "ALL") ?? undefined,
    // Screens are never pooled by accident: with nothing in the address bar
    // this lands on one counselling rather than all four at once.
    counselling: one("counselling") ?? DEFAULT_STREAM,
    q: one("q"),
  };
}

export const paramString = (params: Record<string, string | string[] | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") search.set(key, value);
  }
  return search.toString();
};
