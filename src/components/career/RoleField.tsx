"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { careerRoles } from "@/data/career";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { FieldScene, useCareerWorld } from "./CareerWorld";

const AUTO_ADVANCE_MS = 5200;

/**
 * Six roles as oversized type. Activating a role (hover, focus or tap)
 * reshapes the particle field into that role's formation and colour.
 */
export function RoleField() {
  const { activeId, setOverride } = useCareerWorld();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { amount: 0.35 });
  const isStage = activeId === "roles";
  const role = careerRoles[active];

  // Drive the field while this section owns the stage
  useEffect(() => {
    if (isStage) setOverride({ formation: role.formation, accent: role.accent });
    else setOverride(null);
  }, [isStage, role, setOverride]);

  useEffect(() => () => setOverride(null), [setOverride]);

  // Gentle auto-advance until the visitor takes control
  useEffect(() => {
    if (reduce || interacted || !inView) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % careerRoles.length), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduce, interacted, inView]);

  const choose = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  return (
    <FieldScene
      id="roles"
      request={{
        formation: "lattice",
        stage: { x: 1.2, y: -0.05, scale: 0.95, dim: 1 },
        stageMobile: { x: 0, y: 0.1, scale: 0.7, dim: 0.35 },
      }}
      aria-labelledby="roles-title"
      className="relative px-gutter py-section"
    >
      <div className="mx-auto grid max-w-page gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="type-pixel text-fg-muted">Who we’re looking for</p>
          <h2 id="roles-title" className="mt-6 max-w-[16ch] type-h2 text-fg">
            Five ways to build what comes next.
          </h2>
          <p className="mt-5 max-w-[30rem] type-body text-fg-muted">
            Recruiting soon for these five roles. Here is who we are looking for, and the one thing each role must bring.
          </p>

          <ul ref={listRef} className="mt-12 border-t border-line md:mt-16">
            {careerRoles.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.id} className="border-b border-line" style={{ "--role": item.accent } as React.CSSProperties}>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`role-${item.id}`}
                    onMouseEnter={() => choose(i)}
                    onFocus={() => choose(i)}
                    onClick={() => choose(i)}
                    className="group/role flex w-full items-center gap-4 py-3 text-left outline-offset-4 md:gap-6 md:py-4"
                  >
                    <span
                      className={cn(
                        "w-7 shrink-0 type-pixel transition-colors duration-(--duration-slow)",
                        on ? "text-[var(--role)]" : "text-fg-subtle",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-[clamp(2.1rem,6.4vw,5.6rem)] leading-[0.95] font-semibold tracking-[-0.05em] uppercase transition-[color,transform,-webkit-text-stroke] duration-(--duration-slow) ease-(--ease-out-soft)",
                        on ? "translate-x-2 text-fg md:translate-x-4" : "text-hollow group-hover/role:text-fg-muted",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-(--duration-slow) md:size-12",
                        on
                          ? "border-transparent bg-[var(--role)] text-[var(--cw-void)] shadow-[0_0_30px_-4px_var(--role)]"
                          : "border-line-strong text-fg-subtle",
                      )}
                    >
                      <svg viewBox="0 0 16 16" className="size-4" fill="none">
                        <path d="M3 13 13 3M6 3h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`role-${item.id}`}
                    data-open={on}
                    className="grid transition-[grid-template-rows] duration-(--duration-slow) ease-(--ease-out-soft) data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] lg:sr-only"
                  >
                    <div className={cn("overflow-hidden", !on && "max-lg:invisible")}>
                      <p className="pl-11 type-body-lg text-fg-2 md:pl-13">{item.line}</p>
                      <p className="mt-3 mb-6 ml-11 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 type-caption text-fg md:ml-13">
                        <span className="type-pixel text-[var(--role)]">Must have</span>
                        {item.requirement}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Readout - desktop */}
        <div aria-hidden className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-end">
          <div className="sticky bottom-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: ease.out }}
                className="glass-dark rounded-panel p-7"
                style={{ "--role": role.accent } as React.CSSProperties}
              >
                <div className="flex items-center justify-between type-pixel">
                  <span className="text-fg-muted">
                    Role {String(active + 1).padStart(2, "0")} / {String(careerRoles.length).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2 text-[var(--role)]">
                    <span className="size-2 rounded-full bg-[var(--role)] shadow-[0_0_14px_var(--role)]" />
                    {role.formationLabel}
                  </span>
                </div>
                <p className="mt-8 type-h3 text-fg">{role.title}</p>
                <p className="mt-3 type-body-lg text-fg-2">{role.line}</p>
                <div className="mt-6 rounded-lg border border-line bg-[var(--cw-void)]/40 p-4">
                  <p className="type-pixel text-[var(--role)]">Must have</p>
                  <p className="mt-2 type-body font-medium text-fg">{role.requirement}</p>
                </div>
                <div className="mt-8 flex gap-1.5">
                  {careerRoles.map((r, i) => (
                    <span
                      key={r.id}
                      className={cn("h-1 flex-1 rounded-full transition-colors duration-(--duration-slow)", i === active ? "bg-[var(--role)]" : "bg-line-strong")}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FieldScene>
  );
}
