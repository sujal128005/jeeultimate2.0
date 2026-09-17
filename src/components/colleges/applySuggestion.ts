import type { ExplorerState, Suggestion } from "@/lib/colleges/engine";

type Update = (patch: Partial<ExplorerState> | ((s: ExplorerState) => Partial<ExplorerState>)) => void;

/** A picked suggestion becomes a search (colleges) or a filter (city, state, branch). */
export function applySuggestion(update: Update, s: Suggestion) {
  if (s.kind === "college") return update({ q: s.value });
  const facet = s.kind === "city" ? "city" : s.kind === "state" ? "state" : "branch";
  update((st) => ({
    q: "",
    [facet]: st[facet].includes(s.value) ? st[facet] : [...st[facet], s.value],
  }));
}
