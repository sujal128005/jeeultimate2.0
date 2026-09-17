"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatNumber } from "@/lib/format";

/**
 * Counts up to `value` when scrolled into view.
 * Server-renders the final number so it is always correct for SEO / no-JS.
 */
export function Counter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const started = useRef(false);

  // Reset to zero before the counter is seen (it sits below the fold).
  useEffect(() => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top > window.innerHeight) ref.current.textContent = `0${suffix}`;
  }, [reduce, suffix]);

  useEffect(() => {
    if (!inView || reduce || started.current || !ref.current) return;
    started.current = true;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = `${formatNumber(Math.round(latest))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatNumber(value)}
      {suffix}
    </span>
  );
}
