"use client";

import { motion } from "motion/react";
import { INSTITUTE_TYPES, type InstituteType } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

const pills: { value: InstituteType | null; label: string }[] = [
  { value: null, label: "All" },
  ...(Object.keys(INSTITUTE_TYPES) as InstituteType[]).map((t) => ({ value: t, label: INSTITUTE_TYPES[t].plural })),
];

/** All | IITs | NITs | IIITs | GFTIs | Other, with a sliding highlight. */
export function CategoryPills({
  value,
  counts,
  onChange,
  layoutId,
  className,
}: {
  value: string[];
  counts: Map<string, number>;
  onChange: (type: InstituteType | null) => void;
  layoutId: string;
  className?: string;
}) {
  const current = value.length === 0 ? null : value.length === 1 ? value[0] : "__multi";
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return (
    <div
      role="radiogroup"
      aria-label="Institute type"
      className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface/80 p-1 shadow-hairline backdrop-blur [scrollbar-width:none]", className)}
    >
      {pills.map((p) => {
        const on = current === p.value;
        const n = p.value ? (counts.get(p.value) ?? 0) : total;
        return (
          <button
            key={p.label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.value)}
            style={p.value ? ({ "--t": INSTITUTE_TYPES[p.value].color } as React.CSSProperties) : undefined}
            className={cn(
              "relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 type-nav transition-colors duration-(--duration-base)",
              on ? "text-on-contrast" : "text-fg-muted hover:text-fg",
            )}
          >
            {on && <motion.span layoutId={layoutId} transition={spring.pill} className="absolute inset-0 rounded-full bg-contrast" />}
            {p.value && (
              <span aria-hidden className="relative size-1.5 rounded-full bg-[var(--t)]" />
            )}
            <span className="relative">{p.label}</span>
            <span className={cn("relative type-meta tabular-nums", on ? "text-on-contrast/60" : "text-fg-subtle")}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}
