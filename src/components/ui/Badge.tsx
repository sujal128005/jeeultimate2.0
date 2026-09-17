import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "contrast";
type BadgeVariant = "soft" | "outline" | "glass";

const soft: Record<BadgeTone, string> = {
  neutral: "bg-fg/[0.05] text-fg-2",
  accent: "bg-accent-soft text-accent-text",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  contrast: "bg-on-contrast/[0.08] text-on-contrast/75",
};

const outline: Record<BadgeTone, string> = {
  neutral: "border border-line-strong text-fg-2",
  accent: "border border-accent/50 text-accent-text",
  success: "border border-success/40 text-success",
  warning: "border border-warning/40 text-warning",
  danger: "border border-danger/40 text-danger",
  info: "border border-info/40 text-info",
  contrast: "border border-on-contrast/20 text-on-contrast/75",
};

const dots: Record<BadgeTone, string> = {
  neutral: "bg-fg-subtle",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  contrast: "bg-accent-on-contrast",
};

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  /** Leading status dot */
  dot?: boolean;
  /** Live pulse on the dot - use only for genuine live/status states */
  pulse?: boolean;
  /** Mono label style (tags, metadata) */
  mono?: boolean;
  className?: string;
};

export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  size = "sm",
  dot,
  pulse,
  mono = size === "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full whitespace-nowrap",
        size === "sm" ? "h-6 px-2.5 text-[11px]" : "h-8 pr-3.5 pl-3 type-caption",
        mono ? "font-mono font-medium tracking-[0.02em]" : "font-medium tracking-[-0.01em]",
        variant === "soft" && soft[tone],
        variant === "outline" && outline[tone],
        variant === "glass" && "glass text-fg-2",
        (dot || pulse) && size === "md" && "pl-2.5",
        className,
      )}
    >
      {(dot || pulse) && (
        <span aria-hidden className="relative grid size-3.5 place-items-center">
          <span className={cn("size-[7px] rounded-full", dots[tone], pulse && "animate-pulse-dot")} />
        </span>
      )}
      {children}
    </span>
  );
}
