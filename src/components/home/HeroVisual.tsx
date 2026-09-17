"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

/**
 * Illustrative "strategy board" - an abstract preview of how a student's
 * counselling decisions come together. Purely decorative, no live data.
 */

const choices = [
  { type: "IIT", branch: "Electrical Engineering" },
  { type: "NIT", branch: "Computer Science & Engg." },
  { type: "IIIT", branch: "Information Technology" },
  { type: "NIT", branch: "Electronics & Communication" },
  { type: "GFTI", branch: "Computer Science & Engg." },
];

const track = [
  { label: "Registration", state: "done" },
  { label: "Choice filling", state: "done" },
  { label: "Mock allotment", state: "done" },
  { label: "Round allotment", state: "current" },
  { label: "Reporting", state: "next" },
] as const;

export function HeroVisual({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const rotateX = useTransform(progress, [0, 0.5], [reduce ? 0 : 16, 0]);
  const scale = useTransform(progress, [0, 0.5], [reduce ? 1 : 0.94, 1]);
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: ease.out, delay: 0.55 }}
      className="relative mx-auto mt-16 max-w-[1120px] [perspective:1800px] md:mt-24"
      aria-hidden
    >
      {/* Warm reflection under the board */}
      <div className="absolute inset-x-[10%] -bottom-6 h-24 rounded-full bg-accent/20 blur-3xl" />

      <motion.div
        style={{ rotateX, scale, y, transformOrigin: "50% 0%" }}
        className="glass-prominent relative rounded-panel p-2 md:rounded-2xl md:p-2.5"
      >
        <div className="overflow-hidden rounded-lg bg-surface/70 shadow-hairline md:rounded-lg">
          {/* Board header */}
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 md:px-6">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-xs bg-contrast text-accent-on-contrast">
                <Icon name="route" className="size-4" />
              </span>
              <div className="text-left">
                <p className="type-caption font-semibold tracking-[-0.015em] text-fg">Strategy board</p>
                <p className="font-mono text-[10.5px] tracking-[0.06em] text-fg-muted uppercase">JoSAA · Example</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft py-1 pr-3 pl-1.5 type-caption font-medium text-success">
              <span className="grid size-5 place-items-center rounded-full bg-success text-on-contrast">
                <Icon name="check" className="size-3" strokeWidth={3} />
              </span>
              Mentor reviewed
            </span>
          </div>

          <div className="grid md:grid-cols-[1.45fr_1fr] lg:grid-cols-[1fr_1.45fr_1fr]">
            {/* Profile */}
            <div className="hidden flex-col gap-4 border-r border-line p-6 text-left lg:flex">
              <Label>Student profile</Label>
              <div className="rounded-md bg-surface-2/70 p-4 shadow-hairline">
                <p className="font-mono text-[10.5px] tracking-[0.08em] text-fg-muted uppercase">JEE Main · CRL</p>
                <p className="mt-1.5 text-[34px] leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums">
                  8,214
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-fg/[0.06]">
                  <motion.div
                    className="bg-accent-gradient h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.6, ease: ease.out, delay: 1.2 }}
                  />
                </div>
              </div>
              <dl className="flex flex-col divide-y divide-line type-caption">
                {[
                  ["Category", "General"],
                  ["Home state", "Uttar Pradesh"],
                  ["Preference", "Branch first"],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2.5">
                    <dt className="text-fg-muted">{key}</dt>
                    <dd className="font-medium text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Choice list */}
            <div className="flex flex-col gap-3 p-4 text-left md:p-6">
              <div className="flex items-center justify-between">
                <Label>Choice list</Label>
                <span className="type-meta text-fg-muted">5 of 48</span>
              </div>
              <ol className="relative flex flex-col gap-1.5">
                {choices.map((choice, index) => (
                  <ChoiceRow key={index} index={index} {...choice} lifted={index === 1} />
                ))}
              </ol>
            </div>

            {/* Round track */}
            <div className="hidden flex-col gap-4 border-l border-line p-6 text-left md:flex">
              <Label>Counselling track</Label>
              <ol className="relative flex flex-col gap-3.5">
                <span className="absolute top-2 bottom-2 left-[9px] w-px bg-line-strong" />
                {track.map((step, index) => (
                  <motion.li
                    key={step.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: ease.out, delay: 1.1 + index * 0.08 }}
                    className="relative flex items-center gap-3 type-caption"
                  >
                    <span
                      className={cn(
                        "relative grid size-[19px] place-items-center rounded-full",
                        step.state === "done" && "bg-contrast text-on-contrast",
                        step.state === "current" && "bg-accent-gradient ring-4 ring-accent-soft",
                        step.state === "next" && "border border-line-strong bg-surface",
                      )}
                    >
                      {step.state === "done" && <Icon name="check" className="size-2.5" strokeWidth={3.5} />}
                    </span>
                    <span className={cn(step.state === "next" ? "text-fg-subtle" : "font-medium text-fg")}>
                      {step.label}
                    </span>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-auto rounded-md bg-surface-2/70 p-3 shadow-hairline">
                <p className="px-1 font-mono text-[10.5px] tracking-[0.08em] text-fg-muted uppercase">Seat decision</p>
                <SeatToggle />
              </div>
            </div>
          </div>

          {/* Mobile-only seat decision */}
          <div className="border-t border-line p-4 md:hidden">
            <SeatToggle />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="type-label text-fg-muted">{children}</p>;
}

function ChoiceRow({
  index,
  type,
  branch,
  lifted,
}: {
  index: number;
  type: string;
  branch: string;
  lifted?: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={
        lifted
          ? { opacity: 1, y: [0, -3, 0], scale: [1, 1.02, 1] }
          : { opacity: 1, y: 0 }
      }
      transition={
        lifted
          ? {
              opacity: { duration: 0.5, delay: 0.9 + index * 0.07 },
              y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 2 },
              scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 2 },
            }
          : { duration: 0.5, ease: ease.out, delay: 0.9 + index * 0.07 }
      }
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2.5",
        lifted
          ? "z-10 bg-surface shadow-lift"
          : "bg-surface-2/60",
      )}
    >
      <span className="w-5 type-meta text-fg-muted">{String(index + 1).padStart(2, "0")}</span>
      <Chip tone={lifted ? "brand" : "neutral"} className="w-12 justify-center">
        {type}
      </Chip>
      <span className="min-w-0 flex-1 truncate type-caption font-medium tracking-[-0.012em] text-fg">{branch}</span>
      <span aria-hidden className="grid grid-cols-2 gap-[3px] opacity-40">
        {Array.from({ length: 6 }).map((_, dot) => (
          <span key={dot} className="size-[3px] rounded-full bg-contrast" />
        ))}
      </span>
    </motion.li>
  );
}

function SeatToggle() {
  const options = ["Freeze", "Float", "Slide"];
  return (
    <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-fg/[0.05] p-1">
      {options.map((option) => (
        <span
          key={option}
          className={cn(
            "relative rounded-full py-1.5 text-center type-caption font-medium",
            option === "Float" ? "text-on-contrast" : "text-fg-muted",
          )}
        >
          {option === "Float" && (
            <motion.span
              className="absolute inset-0 rounded-full bg-contrast shadow-soft"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: ease.out, delay: 1.8 }}
            />
          )}
          <span className="relative">{option}</span>
        </span>
      ))}
    </div>
  );
}
