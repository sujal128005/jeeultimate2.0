import type { Progress } from "@/lib/workspace/types";

/**
 * The workspace's building blocks, in the plain style of the software a clerk
 * uses all day: square panels, ruled tables, grey chrome, no decoration. All
 * of the look lives in workspace.css; these just place things.
 */

export function Panel({
  title,
  hint,
  right,
  flush,
  style,
  children,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
  flush?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <section className="ws-panel" style={style}>
      <header className="ws-panel-head">
        <span className="ws-panel-title">{title}</span>
        {hint && !right && <span className="ws-panel-hint">{hint}</span>}
        {right}
      </header>
      <div className={flush ? "ws-panel-body-flush" : "ws-panel-body"}>{children}</div>
    </section>
  );
}

/** A strip of readouts, joined by rules like a meter panel. */
export function Readouts({ children }: { children: React.ReactNode }) {
  return <div className="ws-readouts">{children}</div>;
}

export function Readout({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number | null;
  sub?: string;
  tone?: "ok" | "warn" | "bad";
}) {
  const known = value !== null && value !== undefined && value !== "";
  const cls = !known ? "ws-v-none" : tone ? `ws-v-${tone}` : "";
  return (
    <div className="ws-readout">
      <div className="ws-readout-label">{label}</div>
      {/* A dash, not a zero: nothing measured and none of them are different facts. */}
      <div className={`ws-readout-value ${cls}`}>{known ? value : "—"}</div>
      <div className="ws-readout-sub">{sub ?? " "}</div>
    </div>
  );
}

export function BarRow({
  label,
  count,
  percent,
  max,
  suffix,
}: {
  label: string;
  count: number;
  percent?: number;
  max: number;
  suffix?: string;
}) {
  const width = max > 0 ? Math.max(count > 0 ? 1 : 0, (count / max) * 100) : 0;
  return (
    <tr>
      <td style={{ width: "40%" }}>{label}</td>
      <td className="ws-num" style={{ width: "4.5rem" }}>
        {count.toLocaleString("en-IN")}
      </td>
      <td className="ws-num ws-note" style={{ width: "3.5rem" }}>
        {percent !== undefined ? `${percent}%` : (suffix ?? "")}
      </td>
      <td>
        <div className="ws-bar-track">
          <div className="ws-bar-fill" style={{ width: `${width}%` }} />
        </div>
      </td>
    </tr>
  );
}

/** A plain table wrapper, so every list on every screen looks the same. */
export function BarTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="ws-table">
      <tbody>{children}</tbody>
    </table>
  );
}

export function DayBars({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="ws-chart" role="img" aria-label={`Daily totals, highest ${max}`}>
      {data.map((d) => (
        <span
          key={d.day}
          title={`${new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${d.count}`}
          style={{ height: `${Math.max(d.count > 0 ? 3 : 1, (d.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="ws-empty">{children}</p>;
}

export function Tag({ tone, children }: { tone?: "ok" | "warn" | "bad" | "sel"; children: React.ReactNode }) {
  return <span className={`ws-tag${tone ? ` ws-tag-${tone}` : ""}`}>{children}</span>;
}

/** Four squares, one per step. Filled means done. */
export function StepDots({ done }: { done: boolean[] }) {
  return (
    <span>
      {done.map((isDone, i) => (
        <span key={i} className={`ws-dot${isDone ? " ws-dot-on" : ""}`} />
      ))}
    </span>
  );
}

export const stepsOf = (p: Progress, keys: readonly (keyof Progress)[]) => keys.map((k) => p[k] !== null);

export const hoursSince = (iso: string) => (Date.now() - Date.parse(iso)) / 3600_000;

export const hoursLabel = (hours: number | null) => {
  if (hours === null) return null;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} d`;
};

export const ago = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 48) return `${Math.round(mins / 60)} h ago`;
  return `${Math.round(mins / 1440)} d ago`;
};

export const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

export const stamp = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const fileSize = (bytes: number) =>
  bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
