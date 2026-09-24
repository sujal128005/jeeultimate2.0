import type { Progress } from "@/lib/workspace/types";

/**
 * The four things a mentor does for every student, in order. Labels live here
 * so they can be renamed in one place.
 */
export const PROGRESS_STEPS = [
  { key: "firstCallAt", label: "First call", short: "Call" },
  { key: "checklistSentAt", label: "Document checklist sent", short: "Checklist" },
  { key: "shortlistSentAt", label: "Previous year cutoff list sent", short: "Cutoffs" },
  { key: "finalListSentAt", label: "Final choice list sent", short: "Final list" },
] as const satisfies readonly { key: keyof Progress; label: string; short: string }[];

export type ProgressKey = (typeof PROGRESS_STEPS)[number]["key"];

export const stepsDone = (p: Progress) => PROGRESS_STEPS.filter((s) => p[s.key] !== null).length;
