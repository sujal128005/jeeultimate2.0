"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { counsellingProcesses } from "@/data/counselling";
import { comparisonRows } from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import type { CounsellingSlug } from "@/types";

/** JoSAA vs CSAB vs UPTAC vs JAC Delhi. Scrolls sideways on small screens. */
export function ComparisonTable() {
  const [hover, setHover] = useState<CounsellingSlug | null>(null);

  return (
    <div className="overflow-hidden rounded-panel bg-surface shadow-card">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[56rem] border-collapse text-left" onMouseLeave={() => setHover(null)}>
          <caption className="sr-only">Comparison of JoSAA, CSAB, UPTAC and JAC Delhi</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-44 bg-surface p-5 align-bottom type-label text-fg-muted">
                Compare
              </th>
              {counsellingProcesses.map((p) => (
                <th
                  key={p.slug}
                  scope="col"
                  onMouseEnter={() => setHover(p.slug)}
                  style={{ "--c": p.theme.accent, "--ink": p.theme.ink } as React.CSSProperties}
                  className={cn("p-5 align-bottom transition-colors duration-(--duration-base)", hover === p.slug && "bg-[color-mix(in_oklab,var(--c)_6%,transparent)]")}
                >
                  <span
                    aria-hidden
                    className="mb-4 block h-1.5 w-12 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${p.theme.accent}, ${p.theme.glow})` }}
                  />
                  <span className="block text-[1.5rem] leading-none font-semibold tracking-[-0.035em]">{p.name}</span>
                  <span className="mt-1.5 block type-caption font-normal text-fg-muted">{p.fullName}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 bg-surface p-5 align-top type-body-sm font-semibold">
                  {row.label}
                </th>
                {counsellingProcesses.map((p) => (
                  <td
                    key={p.slug}
                    onMouseEnter={() => setHover(p.slug)}
                    style={{ "--c": p.theme.accent } as React.CSSProperties}
                    className={cn(
                      "p-5 align-top type-body-sm text-fg-2 transition-colors duration-(--duration-base)",
                      hover === p.slug && "bg-[color-mix(in_oklab,var(--c)_6%,transparent)] text-fg",
                    )}
                  >
                    {row.values[p.slug]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <th scope="row" className="sticky left-0 z-10 bg-surface p-5 type-body-sm font-semibold">
                Support
              </th>
              {counsellingProcesses.map((p) => (
                <td
                  key={p.slug}
                  onMouseEnter={() => setHover(p.slug)}
                  style={{ "--c": p.theme.accent, "--ink": p.theme.ink } as React.CSSProperties}
                  className={cn("p-5 transition-colors", hover === p.slug && "bg-[color-mix(in_oklab,var(--c)_6%,transparent)]")}
                >
                  <Link
                    href={p.href}
                    className="group inline-flex items-center gap-1.5 type-body-sm font-semibold text-[var(--ink)]"
                  >
                    {p.name} support
                    <Icon name="arrow-right" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="border-t border-line px-5 py-3 type-caption text-fg-muted md:hidden">Swipe sideways to see all four.</p>
    </div>
  );
}
