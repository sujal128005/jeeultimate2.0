"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

type MagneticButtonProps = {
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Chrome pill that leans toward the cursor. Career world only. */
export function MagneticButton({ href, onClick, icon = "arrow-right", type = "button", disabled, className, children }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring.magnetic);
  const y = useSpring(useMotionValue(0), spring.magnetic);

  const onMove = (event: React.PointerEvent) => {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "group/mag relative inline-flex h-14 items-center gap-4 whitespace-nowrap rounded-full bg-[var(--cw-chrome)] py-2 pr-2 pl-7 text-[15px] font-semibold tracking-[-0.01em] text-[var(--cw-void)]",
    "shadow-[0_0_0_1px_rgb(255_255_255/0.4),0_20px_50px_-20px_var(--cw-accent)] transition-[box-shadow,opacity] duration-(--duration-slow)",
    "hover:shadow-[0_0_0_1px_rgb(255_255_255/0.6),0_24px_70px_-16px_var(--cw-accent)] disabled:opacity-50",
    className,
  );

  const inner = (
    <>
      <span className="relative">{children}</span>
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-[var(--cw-void)] text-[var(--cw-chrome)]">
        <Icon
          name={icon}
          className="size-4 transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/mag:translate-x-6"
        />
        <Icon
          name={icon}
          className="absolute size-4 -translate-x-6 text-[var(--cw-accent)] transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/mag:translate-x-0"
        />
      </span>
    </>
  );

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-block">
      {href ? (
        <Link href={href} className={classes} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
