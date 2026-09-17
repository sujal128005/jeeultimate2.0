"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { counsellingBySlug } from "@/data/counselling";
import { resources } from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import type { CounsellingSlug } from "@/types";
import { CounsellingSelect } from "./CounsellingSelect";


/** Six resource types, each with its own counselling picker and link. */
export function ResourceHub() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {resources.map((r, i) => (
        <ResourceCard key={r.id} resource={r} className="lg:col-span-2" index={i} />
      ))}
    </ul>
  );
}

function ResourceCard({
  resource,
  className,
  index,
}: {
  resource: (typeof resources)[number];
  className?: string;
  index: number;
}) {
  const [slug, setSlug] = useState<CounsellingSlug | null>(null);
  const process = slug ? counsellingBySlug[slug] : null;
  const href = process ? resource.href(process) : null;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: ease.out, delay: index * 0.06 }}
      style={process ? ({ "--c": process.theme.accent, "--g": process.theme.glow, "--ink": process.theme.ink } as React.CSSProperties) : undefined}
      className={cn(
        "relative flex flex-col rounded-card bg-surface p-5 shadow-hairline transition-shadow duration-(--duration-base) has-[[aria-expanded=true]]:z-30 sm:p-6",
        process && "shadow-card",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-card bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_oklab,var(--c)_12%,transparent),transparent_60%)] transition-opacity duration-500",
          process ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-2xl transition-[background,color] duration-500",
            process ? "text-white" : "bg-accent-soft text-accent-text",
          )}
          style={process ? { background: `linear-gradient(140deg, ${process.theme.accent}, ${process.theme.glow})` } : undefined}
        >
          <Icon name={resource.icon} className="size-5" />
        </span>
        <span className="type-meta text-fg-subtle">{resource.external ? "Official source" : "On JEE Ultimate 2.0"}</span>
      </div>
      <h3 className="relative mt-5 type-h4">{resource.title}</h3>
      <p className="relative mt-1.5 type-body-sm text-fg-muted">{resource.body}</p>

      <div className="relative mt-auto grid grid-cols-1 gap-3 pt-6">
        <CounsellingSelect
          label={`${resource.title}: choose counselling`}
          hideLabel
          value={slug ? [slug] : []}
          onChange={(v) => setSlug(v[0] ?? null)}
          placeholder="Choose counselling"
        />
        <div className="relative h-12">
          <AnimatePresence mode="wait" initial={false}>
            {href && process ? (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: ease.out }}
                className="absolute inset-0"
              >
                <ResourceLink href={href} external={resource.external}>
                  {resource.cta(process.name)}
                </ResourceLink>
              </motion.div>
            ) : (
              <motion.p
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center rounded-full border border-dashed border-line-strong type-caption text-fg-muted"
              >
                Pick a counselling to get the link
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
}

function ResourceLink({ href, external, children }: { href: string; external: boolean; children: React.ReactNode }) {
  const className =
    "group/rl flex h-12 w-full items-center justify-between gap-2 rounded-full bg-[linear-gradient(120deg,var(--c),color-mix(in_oklab,var(--c)_60%,var(--g)))] pr-1.5 pl-5 type-button text-white shadow-[0_10px_24px_-12px_var(--c)] transition-transform active:scale-[0.98]";
  const inner = (
    <>
      <span className="truncate">{children}</span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 transition-transform duration-(--duration-base) group-hover/rl:translate-x-0.5 group-hover/rl:-translate-y-0.5">
        <Icon name={external ? "arrow-up-right" : "arrow-right"} className="size-4" />
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
