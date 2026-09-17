import { cn } from "@/lib/cn";

export type GlassVariant = "subtle" | "standard" | "prominent" | "nav" | "dark";

type GlassPanelProps<T extends React.ElementType> = {
  as?: T;
  variant?: GlassVariant;
  /** @deprecated use `variant` */
  tone?: "light" | "strong" | "dark";
  radius?: "md" | "lg" | "xl" | "2xl" | "card" | "panel";
  /** Adds hover / pressed / active states */
  interactive?: boolean;
  /** Marks the active state for interactive panels */
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

const variants: Record<GlassVariant, string> = {
  subtle: "glass-subtle",
  standard: "glass",
  prominent: "glass-prominent",
  nav: "glass-nav",
  dark: "glass-dark",
};

const legacyTone = { light: "standard", strong: "prominent", dark: "dark" } as const;

const radii = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  card: "rounded-card",
  panel: "rounded-panel",
};

/**
 * Frosted surface. Glass is a highlight, not a default -
 * aim for one prominent glass layer per viewport, plus navigation.
 */
export function GlassPanel<T extends React.ElementType = "div">({
  as,
  variant,
  tone,
  radius = "panel",
  interactive,
  active,
  className,
  children,
  ...props
}: GlassPanelProps<T>) {
  const Component = as ?? "div";
  const resolved = variant ?? (tone ? legacyTone[tone] : "standard");
  return (
    <Component
      data-active={interactive && active ? "true" : undefined}
      className={cn(variants[resolved], radii[radius], interactive && "glass-interactive", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
