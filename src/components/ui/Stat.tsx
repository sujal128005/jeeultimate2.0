import { cn } from "@/lib/cn";

/** Number + label pair. Pass a <Counter> as `value` for animated figures. */
export function Stat({
  value,
  label,
  detail,
  size = "md",
  tone = "light",
  className,
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  detail?: React.ReactNode;
  size?: "md" | "xl";
  tone?: "light" | "contrast";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className={cn(size === "xl" ? "type-stat-xl" : "type-stat", tone === "contrast" ? "text-on-contrast" : "text-fg")}>
        {value}
      </span>
      <span className={cn("type-body font-medium", tone === "contrast" ? "text-on-contrast/85" : "text-fg")}>{label}</span>
      {detail && (
        <span className={cn("type-meta", tone === "contrast" ? "text-on-contrast/60" : "text-fg-muted")}>{detail}</span>
      )}
    </div>
  );
}
