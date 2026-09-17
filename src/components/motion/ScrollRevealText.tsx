"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Apple-style reading reveal: each word brightens as the paragraph
 * scrolls through the viewport.
 */
export function ScrollRevealText({
  text,
  emphasis = [],
  className,
}: {
  text: string;
  emphasis?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            highlight={emphasis.includes(word)}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span aria-hidden className="relative mr-[0.26em]">
      <motion.span style={{ opacity }} className={cn(highlight && "text-accent-gradient")}>
        {children}
      </motion.span>
    </span>
  );
}
