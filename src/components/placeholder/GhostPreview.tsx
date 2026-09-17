import { cn } from "@/lib/cn";
import type { PlaceholderPreview } from "@/types";

/**
 * A soft, shimmering outline of the interface being built.
 * Signals "this is designed and on its way" rather than "this is empty".
 */
export function GhostPreview({ kind, className }: { kind: PlaceholderPreview; className?: string }) {
  return (
    <div aria-hidden className={cn("mask-fade-b relative", className)}>
      {kind === "table" && <TableGhost />}
      {kind === "chart" && <ChartGhost />}
      {kind === "form" && <FormGhost />}
      {kind === "cards" && <CardsGhost />}
      {kind === "list" && <ListGhost />}
    </div>
  );
}

const Bar = ({ className }: { className?: string }) => <span className={cn("skeleton block h-2.5 rounded-full", className)} />;

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="skeleton block h-10 w-full max-w-[260px] rounded-full" />
      {[80, 96, 72].map((w) => (
        <span key={w} className="skeleton hidden h-10 rounded-full sm:block" style={{ width: w }} />
      ))}
    </div>
  );
}

function TableGhost() {
  return (
    <div className="flex flex-col gap-5">
      <Toolbar />
      <div className="overflow-hidden rounded-lg bg-surface/70 shadow-hairline">
        <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr] gap-4 border-b border-line bg-surface-2/60 px-5 py-4">
          {["w-20", "w-16", "w-14", "w-14"].map((w, i) => (
            <Bar key={i} className={cn(w, "h-2")} />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="grid grid-cols-[2fr_1.4fr_1fr_1fr] items-center gap-4 border-b border-line px-5 py-4 last:border-0">
            <div className="flex items-center gap-3">
              <span className="skeleton size-8 shrink-0 rounded-xs" />
              <Bar className={row % 2 ? "w-28" : "w-36"} />
            </div>
            <Bar className={row % 3 ? "w-24" : "w-16"} />
            <Bar className="w-12" />
            <Bar className="w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartGhost() {
  const bars = [38, 52, 44, 66, 58, 74, 62, 84, 70, 90];
  return (
    <div className="rounded-lg bg-surface/70 p-6 shadow-hairline">
      <Bar className="w-32" />
      <div className="mt-8 flex h-56 items-end gap-3">
        {bars.map((h, i) => (
          <span key={i} className="skeleton block flex-1 rounded-t-[8px]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function FormGhost() {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
      <div className="flex flex-col gap-4 rounded-lg bg-surface/70 p-6 shadow-hairline">
        {["Rank", "Category", "Quota", "Home state"].map((label) => (
          <div key={label} className="flex flex-col gap-2">
            <span className="type-caption font-medium text-fg-subtle">{label}</span>
            <span className="skeleton block h-11 rounded-sm" />
          </div>
        ))}
        <span className="mt-2 block h-11 rounded-full bg-fg/10" />
      </div>
      <div className="flex flex-col gap-2.5 rounded-lg bg-surface/70 p-6 shadow-hairline">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-md bg-surface-2/70 p-3">
            <span className="skeleton size-9 shrink-0 rounded-xs" />
            <div className="flex flex-1 flex-col gap-2">
              <Bar className={i % 2 ? "w-3/5" : "w-4/5"} />
              <Bar className="h-2 w-2/5" />
            </div>
            <span className="skeleton block h-6 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsGhost() {
  return (
    <div className="flex flex-col gap-5">
      <Toolbar />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-lg bg-surface/70 p-5 shadow-hairline">
            <span className="skeleton size-10 rounded-sm" />
            <div className="flex flex-col gap-2">
              <Bar className="w-4/5" />
              <Bar className="h-2 w-1/2" />
            </div>
            <div className="flex gap-1.5">
              <span className="skeleton block h-5 w-10 rounded-full" />
              <span className="skeleton block h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListGhost() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg bg-surface/70 p-5 shadow-hairline">
          <span className="skeleton size-12 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col gap-2.5">
            <Bar className={i % 2 ? "w-1/2" : "w-2/3"} />
            <Bar className="h-2 w-4/5" />
          </div>
          <span className="skeleton hidden size-9 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}
