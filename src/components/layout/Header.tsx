"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import { ProfileMenu } from "./ProfileMenu";

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out }}
        className="fixed inset-x-0 top-0 z-(--z-header)"
      >
        {/* Frosted backdrop that appears once the page scrolls */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 border-b backdrop-blur-glass backdrop-saturate-[1.8] transition-[opacity,border-color] duration-(--duration-slow)",
            "bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--canvas)_92%,transparent),color-mix(in_oklab,var(--canvas)_80%,transparent))]",
            scrolled ? "border-line opacity-100" : "border-transparent opacity-0",
          )}
        />
        <div
          className={cn(
            "relative mx-auto grid w-full max-w-page grid-cols-[1fr_auto] items-center px-4 transition-[height] duration-(--duration-slow) ease-(--ease-out-soft) sm:px-8 md:grid-cols-[1fr_auto_1fr]",
            scrolled ? "h-[68px]" : "h-[76px] md:h-[88px]",
          )}
        >
          <div className="justify-self-start">
            <span className="md:hidden">
              <Logo showWordmark="always" />
            </span>
            <span className="hidden md:block">
              <Logo showWordmark="desktop" />
            </span>
          </div>

          <div className="hidden md:block">
            <Navigation variant="desktop" />
          </div>

          <div className="justify-self-end">
            <ProfileMenu />
          </div>
        </div>
      </motion.header>

      <Navigation variant="mobile" />
    </>
  );
}
