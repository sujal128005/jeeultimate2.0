import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type AlertTone = "info" | "success" | "warning" | "danger" | "neutral";

const tones: Record<AlertTone, { box: string; icon: IconName; iconClass: string }> = {
  info: { box: "bg-info-soft/70 ring-info/15", icon: "info", iconClass: "text-info" },
  success: { box: "bg-success-soft/70 ring-success/15", icon: "check-circle", iconClass: "text-success" },
  warning: { box: "bg-warning-soft/80 ring-warning/15", icon: "alert", iconClass: "text-warning" },
  danger: { box: "bg-danger-soft/70 ring-danger/15", icon: "alert", iconClass: "text-danger" },
  neutral: { box: "bg-surface-2 ring-line", icon: "info", iconClass: "text-fg-muted" },
};

export function Alert({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: AlertTone;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-card p-4 ring-1 ring-inset", t.box, className)}
    >
      <Icon name={t.icon} className={cn("mt-0.5 size-[18px] shrink-0", t.iconClass)} />
      <div className="min-w-0 flex-1">
        {title && <p className="type-body-sm font-semibold text-fg">{title}</p>}
        {children && <div className={cn("type-body-sm text-fg-2", title && "mt-0.5")}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
