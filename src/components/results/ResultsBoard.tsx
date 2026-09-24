"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { resultsByGroup, resultsSummary } from "@/data/results";

const ALL = "all" as const;

/**
 * Every institute our students were allotted, grouped and countable. The
 * numbers are the number of students who reported that institute, not a
 * ranking of it.
 */
export function ResultsBoard() {
  const [group, setGroup] = useState<string>(ALL);
  const shown = group === ALL ? resultsByGroup : resultsByGroup.filter((g) => g.key === group);
  const total = resultsSummary.withSeat;

  return (
    <AnimatedSection>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setGroup(ALL)}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full px-4 type-caption font-semibold transition-colors",
            group === ALL ? "bg-contrast text-on-contrast" : "bg-surface text-fg-2 shadow-hairline hover:text-fg",
          )}
        >
          All institutes
          <span className="type-meta opacity-70">{total}</span>
        </button>
        {resultsByGroup.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setGroup(g.key)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-4 type-caption font-semibold transition-colors",
              group === g.key ? "bg-contrast text-on-contrast" : "bg-surface text-fg-2 shadow-hairline hover:text-fg",
            )}
          >
            {g.label}
            <span className="type-meta opacity-70">{g.seats}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {shown.map((g) => (
          <section key={g.key} className="min-w-0 rounded-card bg-surface p-6 shadow-hairline">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="type-h4">{g.label}</h3>
              <span className="type-caption text-fg-muted">
                {g.seats} student{g.seats === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.places.map((p) => (
                <li
                  key={p.name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 type-caption text-fg-2"
                >
                  {p.name}
                  {p.count > 1 && <span className="type-meta text-fg-subtle">×{p.count}</span>}
                </li>
              ))}
            </ul>
            {g.places.length > 0 && g.places.reduce((s, p) => s + p.count, 0) < g.seats && (
              <p className="mt-4 flex items-start gap-2 type-caption text-fg-subtle">
                <Icon name="info" className="mt-px size-3.5 shrink-0" />
                {g.seats - g.places.reduce((s, p) => s + p.count, 0)} more reported this group without naming the
                institute clearly enough to list.
              </p>
            )}
          </section>
        ))}
      </div>
    </AnimatedSection>
  );
}
