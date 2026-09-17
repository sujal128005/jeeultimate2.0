import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "outline";
type Size = "sm" | "md" | "lg";

type Common = {
  icon: IconName;
  /** Required: icon-only buttons need an accessible name */
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
};

type AsButton = Common & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;
type AsLink = Common & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className">;

const variants: Record<Variant, string> = {
  primary: "bg-contrast text-on-contrast shadow-button hover:bg-contrast-hover",
  secondary: "bg-surface text-fg-2 shadow-soft ring-1 ring-line hover:text-fg",
  ghost: "text-fg-2 hover:bg-fg/[0.06] hover:text-fg",
  glass: "glass glass-interactive text-fg-2 hover:text-fg",
  outline: "border border-line-strong text-fg-2 hover:border-fg/40 hover:text-fg",
};

const sizes: Record<Size, { box: string; icon: string }> = {
  sm: { box: "size-9", icon: "size-4" },
  md: { box: "size-11", icon: "size-[19px]" },
  lg: { box: "size-13", icon: "size-5" },
};

export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AsButton | AsLink>(function IconButton(
  props,
  ref,
) {
  const { icon, label, variant = "glass", size = "md", loading, className, ...rest } = props;
  const classes = cn(
    "grid shrink-0 place-items-center rounded-full transition-[color,background-color,box-shadow,transform] duration-(--duration-base) ease-(--ease-out-soft) active:scale-95 disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size].box,
    className,
  );
  const glyph = loading ? <Spinner className={sizes[size].icon} /> : <Icon name={icon} className={sizes[size].icon} />;

  if (typeof props.href === "string") {
    const { href, ...linkProps } = rest as AsLink;
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} aria-label={label} className={classes} {...linkProps}>
        {glyph}
      </Link>
    );
  }
  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={label}
      aria-busy={loading || undefined}
      className={classes}
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
    >
      {glyph}
    </button>
  );
});
