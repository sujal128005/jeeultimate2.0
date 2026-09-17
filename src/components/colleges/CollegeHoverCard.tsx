"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { SortKey } from "@/lib/colleges/engine";
import type { College } from "@/lib/colleges/model";
import { INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { CollegeCard } from "./CollegeCard";
import { CompareButton, CollegePreviewBody, SaveButton } from "./CollegePreview";
import { useCollegeUI } from "./CollegeUI";

const HOVER_MQ = "(hover: hover) and (pointer: fine)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(HOVER_MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
export const useCanHover = () => useSyncExternalStore(subscribe, () => window.matchMedia(HOVER_MQ).matches, () => false);

const PANEL_W = 360;

/**
 * Card that expands into a preview on hover (desktop) and opens a sheet on
 * tap (touch) or Enter (keyboard).
 */
export function CollegeHoverCard({ college, sort }: { college: College; sort: SortKey }) {
  const canHover = useCanHover();
  const { openPreview } = useCollegeUI();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const enter = () => {
    if (!canHover) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) setSide(rect.left + PANEL_W > window.innerWidth - 16 ? "right" : "left");
      setOpen(true);
    }, 220);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 80);
  };

  return (
    <div ref={ref} className={cn("relative h-full", open && "z-30")} onMouseEnter={enter} onMouseLeave={leave}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${college.short}, open quick view`}
        aria-haspopup="dialog"
        onClick={() => !canHover && openPreview(college.slug)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPreview(college.slug);
          }
        }}
        className="h-full cursor-pointer rounded-card outline-offset-2"
      >
        <CollegeCard college={college} sort={sort} />
      </div>

      <AnimatePresence>
        {open && canHover && (
          <motion.div
            role="dialog"
            aria-label={`${college.short} preview`}
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: ease.out } }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.14 } }}
            style={{
              width: `max(calc(100% + 1rem), ${PANEL_W}px)`,
              transformOrigin: side === "left" ? "top left" : "top right",
              "--t": INSTITUTE_TYPES[college.type].color,
            } as React.CSSProperties}
            className={cn(
              "absolute -top-2 overflow-hidden rounded-[1.6rem] bg-surface shadow-[0_2px_4px_rgb(14_14_16/0.05),0_30px_70px_-20px_rgb(14_14_16/0.35)] ring-1 ring-line",
              side === "left" ? "-left-2" : "-right-2",
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(120%_100%_at_0%_0%,color-mix(in_oklab,var(--t)_16%,transparent),transparent_70%)]"
            />
            <div className="relative">
              <CollegePreviewBody college={college} variant="hover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact save/compare buttons for list rows. */
export function RowActions({ slug }: { slug: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <SaveButton slug={slug} size="sm" />
      <CompareButton slug={slug} size="sm" />
    </div>
  );
}
