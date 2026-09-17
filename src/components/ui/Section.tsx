import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Vertical rhythm: default section, compact, or none */
  spacing?: "default" | "sm" | "none";
  container?: "default" | "narrow" | "wide" | "prose" | false;
  as?: "section" | "div" | "article";
};

const spacings = { default: "py-section", sm: "py-section-sm", none: "" };

/** Page section with consistent rhythm and width. */
export function Section({
  spacing = "default",
  container = "wide",
  as: Component = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component className={cn("relative", spacings[spacing], className)} {...props}>
      {container ? <Container size={container}>{children}</Container> : children}
    </Component>
  );
}
