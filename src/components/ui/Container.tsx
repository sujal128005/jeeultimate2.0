import { cn } from "@/lib/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** narrow 920 · default 1240 · wide 1360 · prose 640 */
  size?: "default" | "narrow" | "wide" | "prose";
};

const sizes = {
  prose: "max-w-prose",
  narrow: "max-w-narrow",
  default: "max-w-content",
  wide: "max-w-page",
};

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-gutter", sizes[size], className)} {...props} />;
}
