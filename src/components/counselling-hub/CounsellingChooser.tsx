"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { counsellingBySlug, counsellingProcesses } from "@/data/counselling";
import {
  quizQuestions,
  recommend,
  type ExamAnswer,
  type StateAnswer,
  type Verdict,
} from "@/data/counselling-hub";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { ease, spring } from "@/lib/motion";
import type { CounsellingProcess, CounsellingSlug } from "@/types";
import { CounsellingSelect } from "./CounsellingSelect";

/**
 * Sections 2 and 3 of Counselling Support, side by side on large screens:
 * the counselling picker (with support "tickets") and the two-question guide.
 * The guide can hand its answer straight to the picker.
 */
export function CounsellingChooser() {
  const [picked, setPicked] = useState<CounsellingSlug[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);

  const apply = (slugs: CounsellingSlug[]) => {
    setPicked(slugs);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">
      <div ref={pickerRef} id="choose" className="min-w-0 scroll-mt-28 lg:col-span-7">
        <SupportPicker picked={picked} onChange={setPicked} />
      </div>
      <div id="which" className="min-w-0 scroll-mt-28 lg:sticky lg:top-28 lg:col-span-5">
        <WhichCounselling onApply={apply} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SupportPicker({ picked, onChange }: { picked: CounsellingSlug[]; onChange: (v: CounsellingSlug[]) => void }) {
  const colors = picked.length ? picked.map((s) => counsellingBySlug[s].theme) : null;

  return (
    <section
      aria-labelledby="choose-title"
      className="relative isolate overflow-hidden rounded-panel bg-contrast p-5 text-on-contrast shadow-float sm:p-8"
    >
      {/* Colour field that follows the selection */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-40 -right-24 size-[26rem] rounded-full opacity-45 blur-[90px]"
          animate={{ background: colors ? colors[0].accent : "#f59e0b" }}
          transition={{ duration: 0.8, ease: ease.out }}
        />
        <motion.div
          className="absolute -bottom-48 -left-24 size-[24rem] rounded-full opacity-30 blur-[100px]"
          animate={{ background: colors ? colors[colors.length - 1].glow : "#fb923c" }}
          transition={{ duration: 0.8, ease: ease.out }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>

      <p className="inline-flex items-center gap-2 type-label text-on-contrast/60">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        Counselling support
      </p>
      <h2 id="choose-title" className="mt-4 type-h2 text-on-contrast">
        Which counselling do you need?
      </h2>
      <p className="mt-3 max-w-[32rem] type-body-lg text-on-contrast/65">
        Pick one or more. Each opens its own support page with dates, documents and direct enrolment.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4">
        <CounsellingSelect
          label="Select your counselling"
          value={picked}
          onChange={onChange}
          multiple
          size="lg"
          tone="dark"
          placeholder="Choose your counselling"
        />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick pick">
          <span className="mr-1 type-caption text-on-contrast/45">Quick pick</span>
          {counsellingProcesses.map((p) => {
            const on = picked.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  onChange(
                    on
                      ? picked.filter((s) => s !== p.slug)
                      : counsellingProcesses.map((x) => x.slug).filter((s) => s === p.slug || picked.includes(s)),
                  )
                }
                style={{ "--c": p.theme.accent } as React.CSSProperties}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-full pr-3 pl-2 type-caption font-medium transition-all duration-(--duration-base) ease-(--ease-out-soft) active:scale-95",
                  on
                    ? "bg-[var(--c)] text-white shadow-[0_6px_18px_-6px_var(--c)]"
                    : "bg-on-contrast/[0.07] text-on-contrast/75 ring-1 ring-on-contrast/10 hover:bg-on-contrast/[0.12] hover:text-on-contrast",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-4 place-items-center rounded-full transition-colors",
                    on ? "bg-white/25" : "bg-[var(--c)]",
                  )}
                >
                  {on ? <Icon name="check" className="size-2.5" strokeWidth={3} /> : null}
                </span>
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7" aria-live="polite">
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {picked.length === 0 ? (
              <motion.div
                key="empty"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="grid min-h-[15rem] place-items-center rounded-3xl border border-dashed border-on-contrast/15 p-8 text-center"
              >
                <div>
                  <div className="mx-auto flex w-fit -space-x-3">
                    {counsellingProcesses.map((p, i) => (
                      <motion.span
                        key={p.slug}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                        className="grid size-11 place-items-center rounded-2xl text-white ring-4 ring-contrast"
                        style={{ background: `linear-gradient(140deg, ${p.theme.accent}, ${p.theme.glow})` }}
                      >
                        <Icon name={p.icon} className="size-4.5" />
                      </motion.span>
                    ))}
                  </div>
                  <p className="mt-5 type-body font-medium text-on-contrast/80">Your support tickets appear here.</p>
                  <p className="mt-1 type-caption text-on-contrast/45">
                    Not sure which to pick? Answer the two quick questions.
                  </p>
                </div>
              </motion.div>
            ) : (
              picked.map((slug, i) => <SupportTicket key={slug} process={counsellingBySlug[slug]} index={i} />)
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

const inside: { icon: IconName; label: string }[] = [
  { icon: "calendar-days", label: "Dates & status" },
  { icon: "list-checks", label: "Documents" },
  { icon: "chart", label: "Seats & cutoffs" },
  { icon: "ticket", label: "Direct enrolment" },
];

function SupportTicket({ process, index }: { process: CounsellingProcess; index: number }) {
  const { theme } = process;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -10, transition: { duration: 0.2, ease: ease.in } }}
      transition={{ ...spring.panel, delay: index * 0.04 }}
      style={{ "--c": theme.accent, "--g": theme.glow, "--ink": theme.ink, transformPerspective: 900 } as React.CSSProperties}
      className="group relative mb-3 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--c),color-mix(in_oklab,var(--c)_55%,var(--g)))] text-white shadow-[0_24px_50px_-24px_var(--c)] last:mb-0"
    >
      {/* texture + watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgb(255_255_255/0.28),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1px)] [background-size:14px_14px]" />
        <span className="absolute -right-3 -bottom-7 text-[6.5rem] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap text-white/[0.11] transition-transform duration-(--duration-slower) ease-(--ease-out-soft) group-hover:-translate-x-3 sm:text-[8rem]">
          {process.name}
        </span>
        <div className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-[left] duration-1000 ease-(--ease-out-soft) group-hover:left-[120%]" />
      </div>

      <div className="relative grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
              <Icon name={process.icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[1.6rem] leading-none font-semibold tracking-[-0.035em]">{process.name}</h3>
              <p className="mt-1 truncate type-caption text-white/75">{process.fullName}</p>
            </div>
          </div>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {inside.map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 type-caption font-medium ring-1 ring-white/20"
              >
                <Icon name={item.icon} className="size-3.5" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-4 sm:items-end sm:text-right">
          <div>
            <p className="type-meta text-white/70">{process.season}</p>
            <p className="mt-1 text-[1.1rem] font-semibold tracking-[-0.02em]">
              {process.plan.price !== null ? formatPrice(process.plan.price) : "Price announced soon"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              href={`${process.href}#enrol`}
              className="inline-flex h-10 items-center rounded-full bg-white/15 px-4 type-caption font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/25"
            >
              Enrol
            </Link>
            <Link
              href={process.href}
              className="group/cta inline-flex h-10 items-center gap-2 rounded-full bg-white pr-1.5 pl-4 type-caption font-semibold text-[var(--ink)] shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] transition-transform active:scale-95"
            >
              Open support
              <span className="grid size-7 place-items-center rounded-full bg-[var(--c)] text-white transition-transform duration-(--duration-base) group-hover/cta:translate-x-0.5">
                <Icon name="arrow-right" className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ticket notches */}
      <span aria-hidden className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-contrast" />
      <span aria-hidden className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-contrast max-sm:hidden" />
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */

const levelStyles: Record<Verdict["level"], string> = {
  must: "bg-[var(--c)] text-white",
  strong: "bg-[color-mix(in_oklab,var(--c)_14%,transparent)] text-[var(--ink)]",
  backup: "bg-fg/[0.06] text-fg-2",
  optional: "bg-transparent text-fg-muted ring-1 ring-line-strong",
};

function WhichCounselling({ onApply }: { onApply: (slugs: CounsellingSlug[]) => void }) {
  const [exam, setExam] = useState<ExamAnswer | null>(null);
  const [state, setState] = useState<StateAnswer | null>(null);
  const answered = (exam ? 1 : 0) + (state ? 1 : 0);
  const verdicts = exam && state ? recommend(exam, state) : null;

  const values = { exam, state } as const;
  const setters = {
    exam: (v: string) => setExam(v as ExamAnswer),
    state: (v: string) => setState(v as StateAnswer),
  };

  return (
    <section aria-labelledby="which-title" className="rounded-panel bg-surface p-5 shadow-card sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 type-label text-fg-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          Which counselling is for me?
        </p>
        <div className="flex items-center gap-2" aria-label={`${answered} of 2 answered`}>
          {[0, 1].map((i) => (
            <span key={i} className="relative h-1.5 w-7 overflow-hidden rounded-full bg-fg/[0.08]">
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-accent"
                initial={false}
                animate={{ scaleX: answered > i ? 1 : 0 }}
                transition={{ duration: 0.4, ease: ease.out }}
              />
            </span>
          ))}
        </div>
      </div>
      <h2 id="which-title" className="mt-4 type-h3">
        Two questions. A clear answer.
      </h2>

      <div className="mt-6 grid gap-6">
        {quizQuestions.map((q, qi) => (
          <fieldset key={q.id}>
            <legend className="mb-3 flex items-center gap-2 type-body font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-contrast type-meta text-on-contrast">
                {qi + 1}
              </span>
              {q.question}
            </legend>
            <div className={cn("grid gap-2", q.options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
              {q.options.map((o) => {
                const checked = values[q.id] === o.value;
                return (
                  <label
                    key={o.value}
                    className={cn(
                      "relative flex cursor-pointer flex-col rounded-2xl p-3.5 ring-1 transition-[box-shadow,background-color] duration-(--duration-base) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--focus-ring)",
                      checked ? "bg-accent-soft ring-accent" : "bg-surface-2/60 ring-line hover:ring-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.value}
                      checked={checked}
                      onChange={() => setters[q.id](o.value)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-2">
                      <span className="type-body-sm font-semibold">{o.label}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors",
                          checked ? "border-accent-strong bg-accent-strong" : "border-line-strong",
                        )}
                      >
                        {checked && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={spring.toggle}
                            className="size-1.5 rounded-full bg-white"
                          />
                        )}
                      </span>
                    </span>
                    <span className="mt-1 type-caption text-fg-muted">{o.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div aria-live="polite">
        <AnimatePresence initial={false}>
          {verdicts && (
            <motion.div
              key="result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: ease.out }}
              className="overflow-hidden"
            >
              <div className="mt-7 border-t border-line pt-6">
                <p className="type-label text-fg-muted">Your counselling plan</p>
                <ul className="mt-3 grid gap-2">
                  {verdicts.map((v, i) => {
                    const p = counsellingBySlug[v.slug];
                    return (
                      <motion.li
                        key={`${v.slug}-${v.tag}`}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: ease.out, delay: 0.08 + i * 0.07 }}
                        style={{ "--c": p.theme.accent, "--ink": p.theme.ink } as React.CSSProperties}
                        className={cn(
                          "rounded-2xl p-3.5 ring-1 ring-line",
                          v.level === "optional" ? "bg-transparent" : "bg-surface-2/50",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            aria-hidden
                            className="size-2.5 rounded-full"
                            style={{ background: `linear-gradient(140deg, ${p.theme.accent}, ${p.theme.glow})` }}
                          />
                          <span className="type-body font-semibold">{p.name}</span>
                          <span className={cn("ml-auto rounded-full px-2.5 py-0.5 type-meta", levelStyles[v.level])}>
                            {v.tag}
                          </span>
                        </div>
                        <p className="mt-1.5 type-body-sm text-fg-muted">{v.reason}</p>
                      </motion.li>
                    );
                  })}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onApply(verdicts.filter((v) => v.level !== "optional").map((v) => v.slug))}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-contrast pr-2 pl-5 type-button text-on-contrast shadow-button transition-transform active:scale-[0.97]"
                  >
                    Show my support
                    <span className="grid size-7 place-items-center rounded-full bg-on-contrast/10 text-accent-on-contrast">
                      <Icon name="arrow-up-right" className="size-3.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExam(null);
                      setState(null);
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-full px-4 type-button text-fg-muted transition-colors hover:bg-fg/[0.05] hover:text-fg"
                  >
                    <Icon name="reset" className="size-4" />
                    Start over
                  </button>
                </div>
                <p className="mt-4 type-caption text-fg-subtle">
                  A quick guide based on 2026 rules. Always confirm eligibility in the official brochure.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
