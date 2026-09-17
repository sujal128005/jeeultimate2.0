"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types";
import { NavLink } from "./NavLink";

/**
 * Desktop / tablet navigation.
 * A frosted capsule with two sliding indicators:
 *  - a soft hover highlight that glides between items
 *  - a solid pill that marks the current section
 */
export function GlassNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label="Primary" className="glass-nav rounded-full p-1.5">
      <ul className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
        {/* Home shortcut: only away from the homepage */}
        <AnimatePresence initial={false}>
          {pathname !== "/" && (
            <motion.li
              key="home"
              className="relative flex items-center overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
            >
              <Link
                href="/"
                aria-label="Home"
                title="Home"
                onMouseEnter={() => setHovered("home")}
                onFocus={() => setHovered("home")}
                onBlur={() => setHovered(null)}
                className="group/home relative grid size-10 shrink-0 place-items-center rounded-full text-fg-2 transition-colors duration-(--duration-base) hover:text-fg focus-visible:outline-offset-0"
              >
                {hovered === "home" && (
                  <motion.span
                    layoutId="glassnav-hover"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-fg/[0.055]"
                    transition={spring.hover}
                  />
                )}
                <Icon
                  name="home"
                  className="relative size-[18px] transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover/home:-translate-y-px group-hover/home:scale-110"
                />
              </Link>
              <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line-strong" />
            </motion.li>
          )}
        </AnimatePresence>
        {items.map((item) => {
          const active = isNavItemActive(pathname, item);
          return (
            <li key={item.id} className="relative">
              <NavLink
                item={item}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.id)}
                onFocus={() => setHovered(item.id)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "relative flex h-10 items-center gap-2 rounded-full px-3 type-nav whitespace-nowrap transition-colors duration-(--duration-base) focus-visible:outline-offset-0 lg:px-3.5 xl:px-4",
                  active ? "text-on-contrast" : "text-fg-2 hover:text-fg",
                )}
              >
                {hovered === item.id && !active && (
                  <motion.span
                    layoutId="glassnav-hover"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-fg/[0.055]"
                    transition={spring.hover}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                {active && (
                  <motion.span
                    layoutId="glassnav-active"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-contrast shadow-pill"
                    transition={spring.pill}
                  />
                )}
                <Icon
                  name={item.icon}
                  className={cn(
                    "relative size-[17px] transition-colors duration-(--duration-base)",
                    active ? "text-accent-on-contrast" : "text-current",
                  )}
                />
                <span className="relative xl:hidden">{item.shortLabel}</span>
                <span className="relative hidden xl:inline">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
