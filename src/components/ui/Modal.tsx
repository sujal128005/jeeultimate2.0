"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { ease, transition, variants } from "@/lib/motion";
import { IconButton } from "./IconButton";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  /**
   * Viewport point the dim should spread out from, usually the centre of the
   * button that opened this. Without it the spread starts from the middle.
   */
  origin?: { x: number; y: number } | null;
};

const sizes = { sm: "max-w-[420px]", md: "max-w-[560px]", lg: "max-w-[760px]" };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog: focus trap, Escape to close, scroll lock,
 * focus restore. Slides up as a sheet on phones, centres on larger screens.
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md", className, origin }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  // Where the dim starts, and exactly how far it has to travel to reach the
  // furthest corner. Measuring it means the whole animation is on screen,
  // instead of finishing early behind an oversized circle.
  const point = origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const from = `${Math.round(point.x)}px ${Math.round(point.y)}px`;
  const reach = Math.ceil(
    Math.hypot(Math.max(point.x, window.innerWidth - point.x), Math.max(point.y, window.innerHeight - point.y)),
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-(--z-modal) flex items-end justify-center p-3 sm:items-center sm:p-6">
          {/* The dim opens out from the button that was pressed rather than
              fading in flat, so the page reads as unfolding around the panel. */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-contrast/30 backdrop-blur-[7px]"
            initial={{ clipPath: `circle(0px at ${from})`, opacity: 0.9 }}
            animate={{
              clipPath: `circle(${reach}px at ${from})`,
              opacity: 1,
              transition: { clipPath: { duration: 0.62, ease: ease.spread }, opacity: transition.crossfade },
            }}
            exit={{ clipPath: `circle(0px at ${from})`, opacity: 0.9, transition: { duration: 0.34, ease: ease.spread } }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            variants={variants.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn("glass-prominent relative w-full rounded-panel p-6 outline-none md:p-8", sizes[size], className)}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id={titleId} className="type-h4 text-fg">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-1.5 type-body-sm text-fg-muted">
                    {description}
                  </p>
                )}
              </div>
              <IconButton icon="close" label="Close dialog" variant="ghost" size="sm" onClick={onClose} className="-mt-1 -mr-2" />
            </div>
            {children && <div className="mt-6">{children}</div>}
            {footer && <div className="mt-8 flex flex-wrap justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
