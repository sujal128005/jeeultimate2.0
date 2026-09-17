import type { Transition, Variants } from "motion/react";

/**
 * JEE Ultimate 2.0 motion system.
 *
 * Principles
 *  - Fast in, soft out. Nothing waits for an animation to finish.
 *  - Springs for things the user moves (pills, menus); curves for reveals.
 *  - No bounce, no loops unless they carry meaning (live status, progress).
 *  - Scroll-linked and looping motion must check `useReducedMotion()`.
 *
 * Mirrors the CSS tokens in src/styles/tokens.css (--duration-*, --ease-*).
 */

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  expo: [0.16, 1, 0.3, 1] as const,
  in: [0.55, 0, 1, 0.45] as const,
};

export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.3,
  slow: 0.55,
  slower: 0.9,
  reveal: 0.8,
};

export const spring = {
  /** Nav pills, tab indicators, segmented controls */
  pill: { type: "spring", stiffness: 420, damping: 36, mass: 0.9 } satisfies Transition,
  /** Hover highlights - quicker, tighter */
  hover: { type: "spring", stiffness: 560, damping: 42, mass: 0.7 } satisfies Transition,
  /** Panels, menus, sheets */
  panel: { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } satisfies Transition,
  /** Toggles and small tactile controls */
  toggle: { type: "spring", stiffness: 700, damping: 40, mass: 0.6 } satisfies Transition,
  /** Magnetic / pointer-follow elements */
  magnetic: { type: "spring", stiffness: 180, damping: 18, mass: 0.4 } satisfies Transition,
};

/** Named transitions for common moments */
export const transition = {
  pageEnter: { duration: duration.slow, ease: ease.out } satisfies Transition,
  reveal: { duration: duration.reveal, ease: ease.out } satisfies Transition,
  menuEnter: { duration: 0.32, ease: ease.out } satisfies Transition,
  menuExit: { duration: 0.16, ease: ease.in } satisfies Transition,
  modalEnter: { duration: 0.42, ease: ease.expo } satisfies Transition,
  modalExit: { duration: 0.2, ease: ease.in } satisfies Transition,
  crossfade: { duration: 0.28, ease: ease.out } satisfies Transition,
};

/** Reusable variants */
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: transition.reveal },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: transition.reveal },
  },
  menu: {
    hidden: { opacity: 0, scale: 0.94, y: -8, filter: "blur(6px)" },
    visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: transition.menuEnter },
    exit: { opacity: 0, scale: 0.97, y: -4, filter: "blur(4px)", transition: transition.menuExit },
  },
  modal: {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: transition.modalEnter },
    exit: { opacity: 0, scale: 0.98, y: 8, transition: transition.modalExit },
  },
} satisfies Record<string, Variants>;

/** Backwards-compatible alias */
export const fadeUp = variants.fadeUp;

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});
