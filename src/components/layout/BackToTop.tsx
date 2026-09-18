"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { useCompare } from "@/lib/colleges/store";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

const noop = () => () => {};
const RADIUS = 21;

/**
 * Floating "back to top" control, on every page.
 * The ring around it shows how far down the page you are.
 */
export function BackToTop() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const { list } = useCompare();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 520;
    setShown((prev) => (prev === next ? prev : next));
  });

  if (!mounted) return null;

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return createPortal(
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: spring.hover }}
          exit={{ opacity: 0, y: 12, scale: 0.92, transition: { duration: 0.18, ease: ease.out } }}
          className={cn(
            "fixed right-4 z-(--z-sticky) transition-[bottom] duration-(--duration-slow) ease-(--ease-out-soft) md:right-8 md:bottom-[7.25rem]",
            // lift above the compare tray when it is on screen (mobile only, the tray is centred on desktop)
            list.length > 0 ? "bottom-[calc(10.25rem+env(safe-area-inset-bottom))]" : "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
          )}
        >
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            title="Back to top"
            className="group glass-prominent shadow-float relative grid size-12 place-items-center rounded-full text-fg-2 ring-1 ring-line-strong transition-[transform,color] duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5 hover:text-fg active:scale-95"
          >
            <span aria-hidden className="absolute inset-[3px] rounded-full bg-surface/90" />
            <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
              <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="2" />
              <motion.circle
                cx="24"
                cy="24"
                r={RADIUS}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            </svg>
            <Icon
              name="arrow-up-right"
              className="relative size-[18px] rotate-[-45deg] transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
