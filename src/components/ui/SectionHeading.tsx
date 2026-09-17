import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  /** Visual size, independent of the semantic level */
  size?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
};

const sizes = { h1: "type-h1", h2: "type-h2", h3: "type-h3" };

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  size,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={cn(sizes[size ?? (Heading === "h1" ? "h1" : Heading === "h3" ? "h3" : "h2")], tone === "light" ? "text-fg" : "text-on-contrast")}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("max-w-measure type-body-lg", tone === "light" ? "text-fg-muted" : "text-on-contrast/65")}>
          {description}
        </p>
      )}
    </div>
  );
}
