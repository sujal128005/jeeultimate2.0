import { Badge } from "./Badge";

/** Compact mono tag. Thin wrapper over <Badge>. */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "dark";
  className?: string;
}) {
  const mapped = tone === "brand" ? "accent" : tone === "dark" ? "contrast" : "neutral";
  return (
    <Badge tone={mapped} className={className}>
      {children}
    </Badge>
  );
}
