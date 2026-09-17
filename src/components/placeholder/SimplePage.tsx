import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageShell } from "./PageShell";

/** Minimal page for company and legal routes until final copy is ready. */
export function SimplePage({
  eyebrow,
  title,
  description,
  status = "Coming in the next phase",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  children?: React.ReactNode;
}) {
  return (
    <PageShell>
      <AnimatedSection className="mx-auto flex max-w-narrow flex-col items-center text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 type-h1">
          {title}
        </h1>
        <p className="mt-6 max-w-[34rem] type-body-lg text-fg-muted">{description}</p>
        <StatusBadge className="mt-8">{status}</StatusBadge>
        {children}
        <Button href="/" variant="glass" leadingIcon="arrow-left" className="mt-10">
          Back to home
        </Button>
      </AnimatedSection>
    </PageShell>
  );
}
