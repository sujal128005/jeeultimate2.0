"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Chip } from "@/components/ui/Chip";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { ease } from "@/lib/motion";
import type { CounsellingProcess } from "@/types";

/** Sticky detail panel that follows the hovered counselling row (desktop). */
export function CounsellingPreview({ process }: { process: CounsellingProcess }) {
  return (
    <GlassPanel tone="strong" radius="2xl" className="relative overflow-hidden p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full glow-accent"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={process.slug}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: ease.out }}
          className="relative flex min-h-[380px] flex-col"
        >
          <div className="flex items-start justify-between">
            <span className="bg-accent-gradient grid size-14 place-items-center rounded-md text-on-accent shadow-accent">
              <Icon name={process.icon} className="size-6" />
            </span>
            <Chip tone="neutral">{process.scope}</Chip>
          </div>

          <p className="mt-8 type-label text-fg-muted">{process.fullName}</p>
          <p className="mt-3 type-lead text-fg">
            {process.summary}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 type-caption">
            <div>
              <dt className="text-fg-muted">Admission basis</dt>
              <dd className="mt-1 font-medium text-fg">{process.basis}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Covers</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1">
                {process.covers.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </dd>
            </div>
          </dl>

          <Link
            href={process.href}
            className="group/cta mt-auto inline-flex items-center justify-between rounded-full bg-contrast py-2 pr-2 pl-5 type-body-sm font-medium text-on-contrast transition-colors hover:bg-contrast-hover"
          >
            Open {process.name} guide
            <span className="grid size-9 place-items-center rounded-full bg-on-contrast/10 text-accent-on-contrast transition-transform duration-(--duration-base) group-hover/cta:translate-x-0.5">
              <Icon name="arrow-right" className="size-4" />
            </span>
          </Link>
        </motion.div>
      </AnimatePresence>
    </GlassPanel>
  );
}
