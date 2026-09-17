"use client";

import { motion } from "motion/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { transition } from "@/lib/motion";

const immersive = new Set(["career"]);

/**
 * Soft page entrance on route change. Immersive worlds only fade -
 * a transform here would break their fixed-position canvases.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const isImmersive = segment !== null && immersive.has(segment);
  return (
    <motion.div
      initial={isImmersive ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={isImmersive ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={transition.pageEnter}
    >
      {children}
    </motion.div>
  );
}
