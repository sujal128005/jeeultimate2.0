import { Badge, type BadgeTone } from "./Badge";

/** "Coming in the next phase" style badge with a live pulse. */
export function StatusBadge({
  children,
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <Badge variant="glass" size="md" tone={tone} pulse className={className}>
      {children}
    </Badge>
  );
}
