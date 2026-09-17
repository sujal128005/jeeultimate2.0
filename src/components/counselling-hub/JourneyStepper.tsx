"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { counsellingBySlug } from "@/data/counselling";
import { journeySteps } from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import type { CounsellingSlug } from "@/types";

const AUTOPLAY_MS = 5200;

/** Interactive walkthrough of the counselling journey. */
export function JourneyStepper() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLOListElement>(null);
  const last = journeySteps.length - 1;
  const current = journeySteps[step];

  const go = (next: number, fromUser = true) => {
    const clamped = (next + journeySteps.length) % journeySteps.length;
    setDir(clamped > step || (step === last && clamped === 0) ? 1 : -1);
    setStep(clamped);
    if (fromUser) setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setDir(1);
      setStep((s) => (s + 1) % journeySteps.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  // Keep the active node visible on small screens
  useEffect(() => {
    const rail = railRef.current;
    const node = rail?.children[step] as HTMLElement | undefined;
    if (!rail || !node || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: node.offsetLeft - rail.clientWidth / 2 + node.clientWidth / 2, behavior: "smooth" });
  }, [step]);

  const progress = step / last;

  return (
    <div className="overflow-hidden rounded-panel bg-surface shadow-card">
      {/* Rail */}
      <div className="relative border-b border-line px-2 pt-6 pb-5 sm:px-6">
        <div className="relative">
          <div aria-hidden className="absolute top-6 right-[7%] left-[7%] hidden h-0.5 rounded-full bg-fg/[0.07] md:block">
            <motion.div
              className="h-full origin-left rounded-full bg-accent-gradient"
              animate={{ scaleX: progress }}
              transition={{ duration: 0.6, ease: ease.out }}
            />
          </div>
          <ol
            ref={railRef}
            className="relative flex snap-x gap-1 overflow-x-auto pb-1 [scrollbar-width:none] md:grid md:grid-cols-7 md:overflow-visible"
            aria-label="Counselling journey"
          >
            {journeySteps.map((s, i) => {
              const on = i === step;
              const done = i < step;
              return (
                <li key={s.id} className="min-w-[6.5rem] shrink-0 snap-center md:min-w-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={on ? "step" : undefined}
                    className="group flex w-full flex-col items-center gap-2.5 rounded-2xl px-1 py-1 text-center"
                  >
                    <span className="relative grid size-12 place-items-center">
                      {on && (
                        <motion.span
                          layoutId="journey-active"
                          transition={spring.pill}
                          className="absolute inset-0 rounded-full bg-accent-gradient shadow-accent"
                        />
                      )}
                      <span
                        className={cn(
                          "relative grid size-12 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-(--duration-base)",
                          on
                            ? "text-on-accent"
                            : done
                              ? "bg-contrast text-on-contrast"
                              : "bg-surface text-fg-muted ring-1 ring-line group-hover:text-fg group-hover:ring-line-strong",
                        )}
                      >
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      {on && playing && !reduce && (
                        <svg aria-hidden viewBox="0 0 52 52" className="absolute -inset-1 size-14 -rotate-90">
                          <motion.circle
                            key={step}
                            cx="26"
                            cy="26"
                            r="24.5"
                            fill="none"
                            stroke="var(--accent-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                          />
                        </svg>
                      )}
                    </span>
                    <span className="type-meta text-fg-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "type-body-sm leading-tight font-semibold transition-colors",
                        on ? "text-fg" : "text-fg-muted group-hover:text-fg",
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Detail */}
      <div className="relative min-h-[26rem] p-5 sm:p-8" aria-live="polite">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={current.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: ease.out }}
            className="grid gap-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="type-label text-accent-text">
                Step {step + 1} of {journeySteps.length}
              </p>
              <h3 className="mt-3 type-h2">{current.title}</h3>
              <p className="mt-3 type-body-lg font-medium text-fg-2">{current.summary}</p>
              <div className="mt-6 rounded-2xl bg-surface-2/60 p-4 ring-1 ring-line">
                <p className="type-label text-fg-muted">What happens</p>
                <p className="mt-2 type-body text-fg-2">{current.happens}</p>
              </div>
            </div>

            <div className="grid content-start gap-5 lg:col-span-7">
              <div>
                <p className="type-label text-fg-muted">Your to-do</p>
                <ul className="mt-3 grid gap-2">
                  {current.todo.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: ease.out, delay: 0.12 + i * 0.06 }}
                      className="flex gap-3 rounded-2xl p-3 ring-1 ring-line"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
                        <Icon name="check" className="size-3" strokeWidth={2.5} />
                      </span>
                      <span className="type-body-sm text-fg-2">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 rounded-2xl bg-warning-soft p-4">
                <Icon name="alert" className="mt-0.5 size-4.5 shrink-0 text-warning" />
                <div>
                  <p className="type-body-sm font-semibold text-fg">Watch out</p>
                  <p className="mt-1 type-body-sm text-fg-2">{current.watch}</p>
                </div>
              </div>

              {Object.keys(current.notes).length > 0 && (
                <div>
                  <p className="type-label text-fg-muted">By counselling</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(Object.entries(current.notes) as [CounsellingSlug, string][]).map(([slug, note]) => {
                      const p = counsellingBySlug[slug];
                      return (
                        <li key={slug} className="rounded-2xl p-3 ring-1 ring-line">
                          <span className="flex items-center gap-2 type-meta" style={{ color: p.theme.ink }}>
                            <span className="size-2 rounded-full" style={{ background: p.theme.accent }} />
                            {p.name}
                          </span>
                          <span className="mt-1 block type-body-sm text-fg-2">{note}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex h-10 items-center gap-2 rounded-full px-4 type-button text-fg-muted ring-1 ring-line transition-colors hover:text-fg hover:ring-line-strong"
        >
          <span className="relative grid size-4 place-items-center" aria-hidden>
            {playing ? (
              <span className="flex gap-[3px]">
                <span className="h-3 w-[3px] rounded-sm bg-current" />
                <span className="h-3 w-[3px] rounded-sm bg-current" />
              </span>
            ) : (
              <span className="ml-0.5 size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
            )}
          </span>
          {playing ? "Pause" : "Play the journey"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 type-button ring-1 ring-line transition-colors hover:bg-fg/[0.04] disabled:opacity-40"
          >
            <Icon name="arrow-left" className="size-4" />
            Back
          </button>
          <button
            type="button"
            onClick={() => go(step + 1)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-contrast px-5 type-button text-on-contrast shadow-button transition-transform active:scale-[0.97]"
          >
            {step === last ? "Start again" : `Next: ${journeySteps[step + 1].title}`}
            <Icon name={step === last ? "reset" : "arrow-right"} className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
