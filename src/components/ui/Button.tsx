import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "glass" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type OwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon - nudges on hover */
  icon?: IconName;
  /** Leading icon - static */
  leadingIcon?: IconName;
  /** Shows a spinner, disables the button and sets aria-busy */
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = OwnProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;
type ButtonAsButton = OwnProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;
export type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap type-button transition-[transform,background-color,box-shadow,color,border-color] duration-(--duration-base) ease-(--ease-out-soft) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "rounded-full bg-contrast text-on-contrast shadow-button hover:bg-contrast-hover",
  accent: "rounded-full bg-accent-gradient text-on-accent shadow-accent hover:brightness-[1.04]",
  secondary: "rounded-full bg-surface text-fg shadow-soft ring-1 ring-line hover:bg-surface-2",
  outline: "rounded-full border border-line-strong text-fg hover:border-fg/40 hover:bg-fg/[0.03]",
  ghost: "rounded-full text-fg hover:bg-fg/[0.05]",
  glass: "glass glass-interactive rounded-full text-fg",
  link: "rounded-md text-fg underline decoration-line-strong decoration-1 underline-offset-[5px] hover:decoration-accent active:scale-100",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 !text-[13px]",
  md: "h-11 px-5",
  lg: "h-13 px-6 !text-[15.5px]",
};

const iconTile: Partial<Record<ButtonVariant, string>> = {
  primary: "bg-on-contrast/10 text-accent-on-contrast",
  accent: "bg-fg/10",
  secondary: "bg-fg/[0.06]",
  glass: "bg-fg/[0.06]",
};

function Content({ icon, leadingIcon, loading, children, variant }: OwnProps) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-on-contrast/15 to-transparent opacity-0 transition-all duration-(--duration-slower) ease-(--ease-out-soft) group-hover/btn:left-full group-hover/btn:opacity-100"
        />
      )}
      {loading ? (
        <Spinner className="size-4" />
      ) : (
        leadingIcon && <Icon name={leadingIcon} className="size-4" />
      )}
      <span className="relative">{children}</span>
      {icon && variant !== "link" && (
        <span
          aria-hidden
          className={cn(
            "relative -mr-1 grid size-6 place-items-center rounded-full transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover/btn:translate-x-0.5",
            iconTile[variant ?? "primary"],
          )}
        >
          <Icon name={icon} className="size-3.5" strokeWidth={2.2} />
        </span>
      )}
      {icon && variant === "link" && (
        <Icon
          name={icon}
          className="size-3.5 transition-transform duration-(--duration-base) group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );
}

/**
 * The one button. Renders a Next <Link> when `href` is given.
 * Variants: primary · accent · secondary · outline · ghost · glass · link
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    icon,
    leadingIcon,
    loading = false,
    fullWidth,
    className,
    children,
    ...rest
  } = props;
  const classes = cn(
    base,
    buttonVariants[variant],
    variant === "link" ? "h-auto px-0.5" : buttonSizes[size],
    fullWidth && "w-full",
    className,
  );
  const content = (
    <Content icon={icon} leadingIcon={leadingIcon} loading={loading} variant={variant}>
      {children}
    </Content>
  );

  if (typeof props.href === "string") {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-disabled={loading || undefined}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={classes}
      aria-busy={loading || undefined}
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
    >
      {content}
    </button>
  );
});
