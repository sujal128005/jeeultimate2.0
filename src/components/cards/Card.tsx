import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";

export type CardVariant = "standard" | "glass" | "feature" | "stat" | "interactive" | "minimal" | "contrast";

type CardProps<T extends React.ElementType> = {
  as?: T;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  /** Makes the whole card a link (keeps a single tab stop) */
  href?: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children" | "href">;

/*
 * Radius is intentional:
 *   minimal  → none (editorial rule on top)
 *   standard → card (22px)
 *   glass / feature / contrast → panel (28px)
 */
const variants: Record<CardVariant, string> = {
  standard: "rounded-card bg-surface shadow-card",
  glass: "glass rounded-panel",
  feature:
    "group/card rounded-panel bg-surface/70 shadow-hairline transition-[background-color,box-shadow] duration-(--duration-slow) ease-(--ease-out-soft) hover:bg-surface hover:shadow-lift",
  stat: "rounded-card bg-surface-2/70 shadow-hairline",
  interactive:
    "group/card rounded-card bg-surface shadow-card transition-[transform,box-shadow] duration-(--duration-slow) ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-lift active:translate-y-0 active:scale-[0.99]",
  minimal: "border-t border-line-strong",
  contrast: "rounded-panel bg-contrast text-on-contrast",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-card-pad",
  lg: "p-8 md:p-10",
};

export function Card<T extends React.ElementType = "div">({
  as,
  variant = "standard",
  padding = "md",
  href,
  className,
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";
  const classes = cn(
    "relative",
    variants[variant],
    variant === "minimal" ? (padding === "none" ? "" : "pt-6") : paddings[padding],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cn(classes, "block")}>
        {children}
      </Link>
    );
  }
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

/** Icon tile + title + body. Tile lights up with the brand on hover. */
export function FeatureCard({
  icon,
  title,
  children,
  index,
  className,
  headingLevel: Heading = "h3",
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
  index?: number;
  className?: string;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  return (
    <div className={cn("group/card relative", className)}>
      <div className="flex items-center justify-between">
        <IconTile icon={icon} />
        {index !== undefined && (
          <span aria-hidden className="type-meta text-fg-subtle">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <Heading className="mt-6 type-h4 text-fg sm:mt-10 lg:mt-14">{title}</Heading>
      <div className="mt-3 type-body text-fg-muted">{children}</div>
    </div>
  );
}

export function IconTile({ icon, size = "md", tone = "neutral" }: { icon: IconName; size?: "sm" | "md" | "lg"; tone?: "neutral" | "accent" }) {
  const box = size === "sm" ? "size-10 rounded-sm" : size === "lg" ? "size-14 rounded-md" : "size-12 rounded-md";
  const glyph = size === "sm" ? "size-[18px]" : size === "lg" ? "size-6" : "size-[21px]";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center transition-all duration-(--duration-slow) ease-(--ease-out-soft)",
        box,
        tone === "accent"
          ? "bg-accent-gradient text-on-accent shadow-accent"
          : "bg-surface-2 text-fg shadow-hairline group-hover/card:bg-accent-gradient group-hover/card:text-on-accent group-hover/card:shadow-accent",
      )}
    >
      <Icon name={icon} className={glyph} />
    </span>
  );
}
