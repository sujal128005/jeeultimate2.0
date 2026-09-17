import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type JourneyStep = "counselling" | "colleges" | "cutoffs" | "predictor";

const STEPS: { id: JourneyStep; label: string; body: string; icon: IconName; href: string; soon?: boolean }[] = [
  { id: "counselling", label: "Counselling", body: "Know which counselling to join and when.", icon: "compass", href: "/counselling-support" },
  { id: "colleges", label: "Colleges", body: "Find, save and compare the colleges you like.", icon: "landmark", href: "/colleges" },
  { id: "cutoffs", label: "Previous cutoffs", body: "See how far each seat went in past rounds.", icon: "chart", href: "/previous-cutoffs", soon: true },
  { id: "predictor", label: "AI Predictor", body: "Check your chances with your rank.", icon: "sparkles", href: "/ai-predictor", soon: true },
];

/**
 * The four-step path through the site: Counselling → Colleges → Cutoffs → Predictor.
 * `query` is carried to the next steps (e.g. `college=iit-bombay` or `counselling=josaa`).
 */
export function JourneyLinks({
  current,
  query,
  hrefs,
  title = "Your next steps",
  className,
}: {
  current: JourneyStep;
  query?: string;
  hrefs?: Partial<Record<JourneyStep, string>>;
  title?: string;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Counselling journey" className={cn("rounded-section bg-surface p-5 shadow-hairline sm:p-7", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="type-h4">{title}</p>
        <p className="type-caption text-fg-muted">Counselling, colleges, cutoffs, predictor</p>
      </div>
      <ol className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => {
          const here = s.id === current;
          const done = i < currentIndex;
          const href = hrefs?.[s.id] ?? (query && i > currentIndex ? `${s.href}?${query}` : s.href);
          return (
            <li key={s.id} className="min-w-0">
              <Link
                href={href}
                aria-current={here ? "page" : undefined}
                className={cn(
                  "group relative flex h-full min-w-0 items-start gap-3 rounded-2xl p-3.5 ring-1 transition-[background-color,box-shadow,transform] duration-(--duration-base)",
                  here
                    ? "bg-accent-soft ring-accent/40"
                    : "ring-line hover:-translate-y-0.5 hover:bg-surface-2 hover:ring-line-strong",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl",
                    here ? "bg-accent-gradient text-on-accent" : done ? "bg-fg/[0.06] text-fg-muted" : "bg-accent-soft text-accent-text",
                  )}
                >
                  <Icon name={done ? "check" : s.icon} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="type-meta text-fg-subtle">Step {i + 1}</span>
                    {here && <span className="type-meta text-accent-text">· You are here</span>}
                    {s.soon && !here && <span className="rounded-full bg-fg/[0.06] px-1.5 type-meta text-fg-muted">Soon</span>}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 type-body-sm font-semibold">
                    <span className="truncate">{s.label}</span>
                    {!here && (
                      <Icon
                        name="arrow-right"
                        className="size-3.5 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 block type-caption text-fg-muted">{s.body}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
