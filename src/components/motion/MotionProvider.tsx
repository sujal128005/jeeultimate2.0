"use client";

import { MotionConfig } from "motion/react";

/** Honours the OS "reduce motion" setting across every motion component. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
