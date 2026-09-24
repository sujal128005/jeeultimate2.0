/**
 * The four counsellings we run, kept apart everywhere in the workspace.
 *
 * A JoSAA student and a UPTAC student are on different calendars with
 * different documents and different rounds, so pooling them into one list
 * makes every screen harder to read. Each screen works on one counselling at
 * a time; "All" is there for the owner totalling up a season, not for daily
 * work.
 */

export const STREAMS = [
  { key: "josaa", label: "JoSAA", note: "IITs, NITs, IIITs and GFTIs" },
  { key: "csab", label: "CSAB", note: "Special rounds after JoSAA" },
  { key: "jac", label: "JAC Delhi", note: "DTU, NSUT, IIIT-Delhi, IGDTUW" },
  { key: "uptac", label: "UPTAC", note: "AKTU colleges in Uttar Pradesh" },
] as const;

export type StreamKey = (typeof STREAMS)[number]["key"];

/** Where a screen starts when the address bar says nothing. */
export const DEFAULT_STREAM: StreamKey = "josaa";

export const STREAM_LABEL: Record<StreamKey, string> = Object.fromEntries(
  STREAMS.map((s) => [s.key, s.label]),
) as Record<StreamKey, string>;

const ALIASES: Record<string, StreamKey> = {
  josaa: "josaa",
  "josaa 2026": "josaa",
  csab: "csab",
  "csab special": "csab",
  jac: "jac",
  "jac delhi": "jac",
  jacdelhi: "jac",
  delhi: "jac",
  uptac: "uptac",
  aktu: "uptac",
  "up state": "uptac",
  "uttar pradesh": "uptac",
};

/**
 * Whatever the payment form or an import wrote, turned into one of the four.
 * Anything unrecognised comes back null rather than being forced into a
 * bucket it does not belong in.
 */
export function streamOf(value: string | null | undefined): StreamKey | null {
  if (!value) return null;
  const key = value.trim().toLowerCase();
  return ALIASES[key] ?? null;
}

/** True when this row belongs on a screen showing `stream`. */
export function inStream(value: string | null | undefined, stream: StreamKey | "ALL") {
  if (stream === "ALL") return true;
  return streamOf(value) === stream;
}
