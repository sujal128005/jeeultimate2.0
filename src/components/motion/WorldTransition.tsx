"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { ease } from "@/lib/motion";
import { worldColors } from "@/lib/tokens";

export type World = keyof typeof worldColors;

type Pending = { href: string; path: string; world: World; x: number; y: number; phase: "cover" | "reveal" };

type WorldTransitionContextValue = {
  navigate: (href: string, world: World, origin?: { x: number; y: number }) => void;
};

const WorldTransitionContext = createContext<WorldTransitionContextValue | null>(null);

const labels: Record<World, string> = {
  career: "Careers",
  site: "JEE Ultimate 2.0",
};

/**
 * Crossing between the main site and the Career world:
 * a circle of the destination's colour grows from the click point,
 * the route changes underneath, then the veil dissolves.
 */
export function WorldTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [pending, setPending] = useState<Pending | null>(null);

  const navigate = useCallback<WorldTransitionContextValue["navigate"]>(
    (href, world, origin) => {
      const path = new URL(href, window.location.href).pathname;
      if (path === window.location.pathname) return;
      if (reduce) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      setPending({
        href,
        path,
        world,
        x: origin?.x ?? window.innerWidth / 2,
        y: origin?.y ?? window.innerHeight / 2,
        phase: "cover",
      });
    },
    [reduce, router],
  );

  // Once the destination route has rendered, dissolve the veil.
  useEffect(() => {
    if (pending?.phase === "cover" && pathname === pending.path) {
      const id = window.setTimeout(() => setPending((p) => (p ? { ...p, phase: "reveal" } : p)), 120);
      return () => window.clearTimeout(id);
    }
  }, [pathname, pending]);

  const radius = pending ? Math.hypot(Math.max(pending.x, window.innerWidth - pending.x), Math.max(pending.y, window.innerHeight - pending.y)) : 0;

  return (
    <WorldTransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {pending && (
          <motion.div
            key={pending.href}
            aria-hidden
            className="pointer-events-auto fixed inset-0 z-(--z-transition) grid place-items-center"
            style={{ background: worldColors[pending.world] }}
            initial={{ clipPath: `circle(0px at ${pending.x}px ${pending.y}px)`, opacity: 1 }}
            animate={
              pending.phase === "cover"
                ? { clipPath: `circle(${radius}px at ${pending.x}px ${pending.y}px)`, opacity: 1 }
                : { opacity: 0 }
            }
            transition={
              pending.phase === "cover"
                ? { duration: 0.62, ease: ease.inOut }
                : { duration: 0.55, ease: ease.out }
            }
            onAnimationComplete={() => {
              if (pending.phase === "cover") router.push(pending.href);
              else setPending(null);
            }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={
                pending.phase === "cover"
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : { opacity: 0, scale: 1.25, filter: "blur(10px)" }
              }
              transition={{ duration: 0.5, ease: ease.out, delay: pending.phase === "cover" ? 0.25 : 0 }}
            >
              <LogoMark className="size-20" />
              <span
                className="type-label"
                style={{ color: pending.world === "career" ? "rgb(238 240 248 / 0.6)" : "rgb(14 14 16 / 0.55)" }}
              >
                {labels[pending.world]}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WorldTransitionContext.Provider>
  );
}

export function useWorldTransition() {
  return useContext(WorldTransitionContext);
}

type WorldLinkProps = React.ComponentProps<typeof Link> & { href: string; world: World };

/** A Link that crosses into another visual world with the transition veil. */
export function WorldLink({ href, world, onClick, ...props }: WorldLinkProps) {
  const ctx = useWorldTransition();
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          !ctx ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        const fromKeyboard = event.clientX === 0 && event.clientY === 0;
        ctx.navigate(href, world, {
          x: fromKeyboard ? rect.left + rect.width / 2 : event.clientX,
          y: fromKeyboard ? rect.top + rect.height / 2 : event.clientY,
        });
      }}
    />
  );
}
