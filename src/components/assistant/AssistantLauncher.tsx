"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { assistant } from "@/data/assistant";
import { spring } from "@/lib/motion";
import { AssistantMark } from "./AssistantMark";
import { AssistantPanel } from "./AssistantPanel";
import { useQueue } from "./queue";

const noop = () => () => {};

/**
 * The mark floats on the page with no button chrome around it: the shape is
 * the control. Cmd/Ctrl + K opens and closes it from anywhere.
 */
export function AssistantLauncher() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const { queue } = useQueue();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-4 z-(--z-sticky) md:right-8 md:bottom-8 md:left-auto">
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          aria-label={`${assistant.name}: ask anything`}
          aria-expanded={open}
          animate={
            reduced || open || hover
              ? { y: 0, rotate: open ? -8 : 0 }
              : // a slow drift when nobody is reaching for it, and it settles
                // the moment the pointer arrives, so the target never moves
                { y: [0, -5, 0], rotate: 0 }
          }
          transition={
            reduced
              ? undefined
              : { y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" }, rotate: spring.hover }
          }
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative block outline-none"
        >
          <AssistantMark className="size-12 drop-shadow-[0_10px_24px_color-mix(in_oklab,var(--accent)_45%,transparent)] md:size-14" />
          {/* A soft pool of light under the mark, so it sits on the page */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_26%,transparent),transparent)] opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
          />
          {queue.length > 0 && !open && (
            <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-contrast font-mono text-[10px] text-on-contrast">
              {queue.length}
            </span>
          )}
        </motion.button>

        {/* Name plate, on hover only, never covering the mark */}
        <AnimatePresence>
          {hover && !open && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              className="pointer-events-none absolute top-1/2 left-[calc(100%+0.6rem)] hidden -translate-y-1/2 rounded-full bg-contrast px-3 py-1.5 type-caption whitespace-nowrap text-on-contrast shadow-float md:left-auto md:right-[calc(100%+0.6rem)] md:block"
            >
              Ask {assistant.name}
              <kbd className="ml-2 rounded-[5px] bg-on-contrast/15 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AssistantPanel open={open} onClose={() => setOpen(false)} />
    </>,
    document.body,
  );
}
