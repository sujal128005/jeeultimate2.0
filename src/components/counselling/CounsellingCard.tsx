"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import type { CounsellingProcess } from "@/types";

type CounsellingCardProps = {
  process: CounsellingProcess;
  index: number;
  active?: boolean;
  onActivate?: () => void;
  /** Group id so multiple lists on one page animate independently */
  layoutGroup?: string;
};

/**
 * A single counselling row. On large screens the description lives in the
 * side preview panel; on smaller screens it is shown inline.
 */
export function CounsellingCard({ process, index, active, onActivate, layoutGroup = "counselling" }: CounsellingCardProps) {
  return (
    <Link
      href={process.href}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-label={`${process.name}: ${process.fullName}`}
      className="group/row relative block rounded-lg outline-offset-2"
    >
      {active && (
        <motion.span
          layoutId={`${layoutGroup}-highlight`}
          transition={spring.panel}
          className="glass absolute inset-0 hidden rounded-lg lg:block"
        />
      )}

      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-4 px-1 py-6 sm:gap-x-6 lg:px-6 lg:py-7">
        <span className="self-start pt-2 type-meta text-fg-subtle tabular-nums sm:pt-3">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <h3
            className={cn(
              "text-[clamp(2rem,4.2vw,3.25rem)] leading-none font-semibold tracking-[-0.045em] transition-[color,transform] duration-(--duration-slow) ease-(--ease-out-soft) lg:group-hover/row:translate-x-1",
              active ? "text-fg" : "text-fg lg:text-fg/35",
            )}
          >
            {process.name}
          </h3>
          <p className="mt-2 type-caption text-fg-muted lg:truncate">{process.fullName}</p>
        </div>

        <span
          className={cn(
            "grid size-11 place-items-center rounded-full border transition-all duration-(--duration-slow) ease-(--ease-out-soft) sm:size-12",
            active
              ? "border-transparent bg-contrast text-accent-on-contrast lg:rotate-0"
              : "border-line-strong text-fg lg:-rotate-45 group-hover/row:border-transparent group-hover/row:bg-contrast group-hover/row:text-accent-on-contrast",
          )}
        >
          <Icon name="arrow-right" className="size-[18px]" />
        </span>

        {/* Inline details - mobile & tablet */}
        <div className="col-span-2 col-start-2 flex flex-col gap-3 lg:hidden">
          <p className="type-body-sm leading-[1.55] text-fg-2">{process.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            <Chip tone="brand">{process.scope}</Chip>
            {process.covers.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
