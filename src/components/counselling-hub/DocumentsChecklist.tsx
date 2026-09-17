"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import type { CounsellingProcess } from "@/types";

/** Tick-box document list with progress. Nothing is saved or sent anywhere. */
export function DocumentsChecklist({ process }: { process: CounsellingProcess }) {
  const groups = [
    { id: "everyone", title: "Everyone", items: process.documents.everyone },
    { id: "optional", title: "If it applies to you", items: process.documents.ifApplicable },
  ];
  const total = process.documents.everyone.length;
  const [done, setDone] = useState<Set<string>>(new Set());
  const required = process.documents.everyone.filter((d) => done.has(d)).length;

  const toggle = (item: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });

  return (
    <div className="overflow-hidden rounded-panel bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5 sm:px-7">
        <div className="min-w-[12rem] flex-1">
          <p className="type-body-sm font-semibold">
            {required === total ? "All required documents ready" : `${required} of ${total} required documents ready`}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-fg/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--c),var(--g))]"
              initial={false}
              animate={{ width: `${(required / total) * 100}%` }}
              transition={spring.panel}
            />
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setDone(new Set())}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 type-caption font-semibold text-fg-muted ring-1 ring-line hover:text-fg"
          >
            <Icon name="reset" className="size-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-contrast px-4 type-caption font-semibold text-on-contrast"
          >
            <Icon name="file" className="size-3.5" />
            Print
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2">
        {groups.map((g, gi) => (
          <fieldset key={g.id} className={cn("p-5 sm:p-7", gi === 1 && "border-t border-line md:border-t-0 md:border-l")}>
            <legend className="sr-only">{g.title}</legend>
            <p aria-hidden className="type-label text-fg-muted">
              {g.title}
            </p>
            <ul className="mt-4 grid gap-1.5">
              {g.items.map((item) => {
                const checked = done.has(item);
                return (
                  <li key={item}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--focus-ring)",
                        checked ? "bg-[color-mix(in_oklab,var(--c)_8%,transparent)]" : "hover:bg-fg/[0.03]",
                      )}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggle(item)} className="sr-only" />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                          checked ? "border-transparent bg-[var(--c)] text-white" : "border-line-strong",
                        )}
                      >
                        {checked && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.toggle}>
                            <Icon name="check" className="size-3.5" strokeWidth={3} />
                          </motion.span>
                        )}
                      </span>
                      <span className={cn("type-body-sm transition-colors", checked ? "text-fg-muted line-through" : "text-fg-2")}>
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
      <p className="border-t border-line px-5 py-3 type-caption text-fg-muted sm:px-7">
        Based on the {process.name} 2026 documents list. Keep originals and photocopies, and check the official list for your year.
      </p>
    </div>
  );
}
