"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types";
import { NavLink } from "./NavLink";

/** Mobile navigation: a floating, iOS-style glass tab bar within thumb reach. */
export function MobileTabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const showHome = pathname !== "/";

  return (
    <nav
      aria-label="Primary"
      className="pb-safe pointer-events-none fixed inset-x-0 bottom-0 z-(--z-header) px-3 md:hidden"
    >
      <motion.ul
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring.panel, delay: 0.35 }}
        className="glass-nav-3d pointer-events-auto mx-auto flex max-w-[460px] items-stretch gap-0.5 rounded-[26px] p-1.5"
      >
        {/* Home shortcut: only away from the homepage */}
        <AnimatePresence initial={false}>
          {showHome && (
            <motion.li
              key="home"
              className="flex shrink-0 items-center overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
            >
              <Link
                href="/"
                aria-label="Home"
                className="grid h-[54px] w-11 place-items-center rounded-[20px] bg-fg/[0.05] text-fg transition-transform duration-(--duration-fast) active:scale-[0.92]"
              >
                <Icon name="home" className="size-[21px]" />
              </Link>
              <span aria-hidden className="mx-1 h-7 w-px bg-line-strong" />
            </motion.li>
          )}
        </AnimatePresence>

        {items.map((item) => {
          const active = isNavItemActive(pathname, item);
          return (
            <li key={item.id} className="relative min-w-0 flex-1">
              <NavLink
                item={item}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] transition-[color,transform] duration-(--duration-fast) focus-visible:outline-offset-0 active:scale-[0.94]",
                  active ? "text-on-contrast" : "text-fg-2",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tabbar-active"
                    aria-hidden
                    className="absolute inset-0 rounded-[20px] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--contrast)_88%,white_12%),var(--contrast))] shadow-pill ring-1 ring-black/5 ring-inset"
                    transition={spring.pill}
                  />
                )}
                <Icon
                  name={item.icon}
                  className={cn("relative size-[21px]", active && "text-accent-on-contrast")}
                  strokeWidth={active ? 2 : 1.75}
                />
                <span className="relative max-w-full truncate text-[9.5px] leading-none font-medium tracking-[-0.035em]">
                  {item.shortLabel}
                </span>
              </NavLink>
            </li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
