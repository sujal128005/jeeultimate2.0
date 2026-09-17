"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { WorldLink } from "@/components/motion/WorldTransition";
import { Icon } from "@/components/ui/Icon";
import { careerNav } from "@/data/career";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { useCareerWorld } from "./CareerWorld";

/** Minimal, independent navigation for the Career world. */
export function CareerNav() {
  const { activeId } = useCareerWorld();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const activeSection = activeId?.startsWith("story") ? "story" : activeId;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-(--z-header)"
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[140%] bg-gradient-to-b from-[var(--cw-void)] via-[color-mix(in_oklab,var(--cw-void)_85%,transparent)] to-transparent backdrop-blur-md transition-opacity duration-(--duration-slow) [mask-image:linear-gradient(to_bottom,black_60%,transparent)]",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative mx-auto flex h-18 max-w-page items-center justify-between gap-4 px-gutter md:h-20">
        <WorldLink
          href="/"
          world="site"
          aria-label="JEE Ultimate 2.0 home"
          className="group/logo flex items-center gap-3 rounded-xl"
        >
          <LogoMark className="size-9" />
          <span className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-fg max-sm:hidden">
              JEE Ultimate <span className="text-[var(--cw-spark)]">2.0</span>
            </span>
            <span className="type-pixel text-fg-muted">
              <span aria-hidden className="max-sm:hidden">/ </span>Careers
            </span>
          </span>
        </WorldLink>

        <nav aria-label="Career sections" className="hidden md:block">
          <ul className="glass-subtle flex items-center gap-1 rounded-full p-1">
            {careerNav.map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative flex h-9 items-center gap-2 rounded-full px-4 type-pixel transition-colors duration-(--duration-base)",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="career-nav-dot"
                        className="size-1.5 rounded-full bg-[var(--cw-accent)] shadow-[0_0_12px_var(--cw-accent)]"
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Home portal: a quiet ring that ignites on hover, then crosses back to the main site */}
          <WorldLink
            href="/"
            world="site"
            aria-label="Home: back to JEE Ultimate 2.0"
            title="Home"
            className="group/home flex h-10 items-center rounded-full outline-offset-4"
          >
            <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full shadow-[inset_0_0_0_1px_var(--line-strong)]">
              <span
                aria-hidden
                className="absolute -inset-3 animate-[spin_2.6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,var(--cw-accent)_300deg,transparent_360deg)] opacity-0 transition-opacity duration-(--duration-base) group-hover/home:opacity-100 group-focus-visible/home:opacity-100 motion-reduce:animate-none"
              />
              <span aria-hidden className="absolute inset-[1.5px] rounded-full bg-[var(--cw-void)]" />
              <Icon
                name="home"
                className="relative size-[18px] text-fg-2 transition-[color,transform] duration-(--duration-base) ease-(--ease-spring) group-hover/home:scale-110 group-hover/home:text-fg"
              />
            </span>
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap type-pixel text-fg opacity-0 transition-all duration-(--duration-slow) ease-(--ease-out-soft) group-hover/home:max-w-24 group-hover/home:pl-3 group-hover/home:opacity-100 sm:block">
              Home
            </span>
          </WorldLink>
          <a
            href="#join"
            className="flex h-10 items-center rounded-full bg-[var(--cw-chrome)] px-4 text-[13.5px] font-semibold text-[var(--cw-void)] transition-shadow duration-(--duration-base) hover:shadow-[0_0_30px_-4px_var(--cw-accent)]"
          >
            Join
          </a>
        </div>
      </div>
    </motion.header>
  );
}
