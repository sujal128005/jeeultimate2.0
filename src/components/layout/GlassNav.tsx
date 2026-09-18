"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types";
import { NavLink } from "./NavLink";

/**
 * Desktop / tablet navigation.
 * A frosted capsule that tilts a little towards the pointer, with:
 *  - a specular sheen that follows the cursor
 *  - a soft hover highlight that glides between items
 *  - a solid pill that marks the current section
 */
export function GlassNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Pointer position, kept out of React state so moving the mouse never re-renders.
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const tiltX = useSpring(useMotionValue(0), spring.magnetic);
  const tiltY = useSpring(useMotionValue(0), spring.magnetic);
  const sheenOpacity = useSpring(useMotionValue(0), spring.hover);
  const sheen = useMotionTemplate`radial-gradient(120px 60px at ${px}% ${py}%, color-mix(in oklab, white 70%, transparent), transparent 70%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x * 100);
    py.set(y * 100);
    tiltY.set((x - 0.5) * 7);
    tiltX.set((0.5 - y) * 5);
    sheenOpacity.set(1);
  };

  const onPointerLeave = () => {
    setHovered(null);
    tiltX.set(0);
    tiltY.set(0);
    sheenOpacity.set(0);
  };

  return (
    <div className="[perspective:900px]">
      <motion.nav
        ref={ref}
        aria-label="Primary"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        className="glass-nav-3d relative rounded-full p-1.5 will-change-transform"
      >
        <motion.span
          aria-hidden
          style={{ backgroundImage: sheen, opacity: sheenOpacity }}
          className="pointer-events-none absolute inset-0 rounded-full mix-blend-soft-light"
        />
        <ul className="relative flex items-center gap-0.5">
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
                      className="absolute inset-0 rounded-full bg-fg/[0.055] shadow-[inset_0_1px_0_var(--glass-highlight)]"
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
                      className="absolute inset-0 rounded-full bg-fg/[0.055] shadow-[inset_0_1px_0_var(--glass-highlight)]"
                      transition={spring.hover}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="glassnav-active"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--contrast)_88%,white_12%),var(--contrast))] shadow-pill ring-1 ring-black/5 ring-inset"
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
      </motion.nav>
    </div>
  );
}
