"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { duration, ease } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Distance travelled on reveal, in px */
  offset?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "nav";
};

/** Fades and lifts content into view once, as the user scrolls to it. */
export function AnimatedSection({ delay = 0, offset = 28, as = "div", children, ...props }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

/** Parent that staggers any <StaggerItem> children into view. */
export function Stagger({
  children,
  step = 0.08,
  delay = 0,
  as = "div",
  ...props
}: HTMLMotionProps<"div"> & { step?: number; delay?: number; as?: "div" | "ul" | "ol" }) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  as = "div",
  offset = 20,
  ...props
}: HTMLMotionProps<"div"> & { as?: "div" | "li" | "article"; offset?: number }) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      variants={{
        hidden: { opacity: 0, y: offset },
        visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
