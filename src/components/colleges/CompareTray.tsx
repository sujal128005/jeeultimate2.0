"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import { COMPARE_MAX, useCompare } from "@/lib/colleges/store";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import { Monogram } from "./Monogram";

const noop = () => () => {};

/** Floating tray: "2 colleges selected → Compare". */
export function CompareTray() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const { list, remove, clear } = useCompare();
  const picked = list.map((s) => colleges.find((c) => c.slug === s)).filter((c) => c !== undefined);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {picked.length > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={spring.panel}
          className="fixed inset-x-3 bottom-[5.5rem] z-(--z-sticky) mx-auto max-w-[40rem] md:bottom-5"
          role="region"
          aria-label="Compare tray"
        >
          <div className="flex items-center gap-3 rounded-[1.4rem] bg-contrast p-2 pl-3 text-on-contrast shadow-float ring-1 ring-on-contrast/10">
            <ul className="flex shrink-0 -space-x-2">
              <AnimatePresence initial={false}>
                {picked.map((c) => (
                  <motion.li
                    key={c.slug}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="group relative rounded-2xl ring-2 ring-contrast"
                  >
                    <Monogram college={c} size="sm" />
                    <button
                      type="button"
                      onClick={() => remove(c.slug)}
                      aria-label={`Remove ${c.short} from compare`}
                      className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-surface text-fg opacity-0 shadow-soft transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
                    >
                      <Icon name="close" className="size-3" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {Array.from({ length: COMPARE_MAX - picked.length }).map((_, i) => (
                <li key={`slot-${i}`} aria-hidden className="grid size-11 place-items-center rounded-2xl border border-dashed border-on-contrast/20 bg-contrast max-sm:hidden">
                  <Icon name="plus" className="size-3.5 text-on-contrast/30" />
                </li>
              ))}
            </ul>
            <div className="min-w-0 flex-1">
              <p className="truncate type-body-sm font-semibold">
                {picked.length} {picked.length === 1 ? "college" : "colleges"} selected
              </p>
              <p className="truncate type-caption text-on-contrast/55">
                {picked.length < 2 ? "Add one more to compare" : picked.map((c) => c.short).join(" · ")}
              </p>
            </div>
            <button type="button" onClick={clear} className="shrink-0 rounded-full px-3 py-2 type-caption text-on-contrast/60 hover:text-on-contrast max-sm:hidden">
              Clear
            </button>
            <Link
              href={`/colleges/compare?c=${picked.map((c) => c.slug).join(",")}`}
              aria-disabled={picked.length < 2}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent-gradient pr-2 pl-5 type-button text-on-accent shadow-accent transition-transform active:scale-95",
                picked.length < 2 && "pointer-events-none opacity-40",
              )}
            >
              Compare
              <span className="grid size-7 place-items-center rounded-full bg-contrast text-on-contrast">
                <Icon name="arrow-right" className="size-3.5" />
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
