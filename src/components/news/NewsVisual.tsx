import { cn } from "@/lib/cn";
import type { NewsCategory } from "@/types";

/**
 * Generated editorial artwork for a news item, so the module looks finished
 * without stock photography. Swap for real thumbnails when the API provides them.
 */
const palettes: Record<NewsCategory, string> = {
  JoSAA: "from-brand-300 via-[var(--ju-gradient-b)] to-[var(--ju-gradient-c)]",
  CSAB: "from-contrast-hover via-contrast-2 to-contrast",
  UPTAC: "from-surface-2 via-surface-3 to-[var(--ju-warm-200)]",
  "JAC Delhi": "from-brand-100 via-brand-200 to-brand-400",
  Strategy: "from-surface-3 via-[var(--ju-warm-200)] to-[color-mix(in_oklab,var(--ju-warm-200)_80%,var(--ju-grey-400))]",
};

const darkCategories: NewsCategory[] = ["CSAB"];

export function NewsVisual({
  category,
  size = "sm",
  className,
}: {
  category: NewsCategory;
  size?: "sm" | "lg";
  className?: string;
}) {
  const dark = darkCategories.includes(category);
  return (
    <div
      aria-hidden
      className={cn("isolate overflow-hidden bg-gradient-to-br", palettes[category], className)}
    >
      {/* Concentric rings - an abstract "rank radius" */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {[40, 80, 120, 160, 200, 240].map((r) => (
          <circle
            key={r}
            cx="330"
            cy="250"
            r={r}
            fill="none"
            stroke={dark ? "color-mix(in oklab, var(--on-contrast) 10%, transparent)" : "var(--line)"}
            strokeWidth="1"
          />
        ))}
        <circle cx="330" cy="250" r="6" fill={dark ? "var(--accent-on-contrast)" : "var(--fg)"} />
      </svg>
      <span
        className={cn(
          "absolute leading-none font-semibold whitespace-nowrap",
          size === "lg"
            ? "bottom-[-0.12em] left-[0.18em] text-[clamp(4rem,9vw,8rem)] tracking-[-0.06em]"
            : "bottom-2.5 left-2.5 type-caption tracking-[-0.02em]",
          dark ? "text-on-contrast/[0.9]" : "text-fg/[0.85]",
        )}
      >
        {category}
      </span>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--ju-white)_18%,transparent),transparent_40%)]" />
    </div>
  );
}
