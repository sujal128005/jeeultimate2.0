import type { Metadata } from "next";
import { DesignSystemShowcase } from "@/components/design-system/Showcase";
import { PageShell } from "@/components/placeholder/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Design System",
  description: "The JEE Ultimate 2.0 design system: tokens, typography, glass, components and motion.",
  robots: { index: false, follow: false },
};

/** Living style guide for the team. Not linked from the public navigation. */
export default function DesignSystemPage() {
  return (
    <PageShell>
      <SectionHeading
        as="h1"
        eyebrow="Internal · v2.0"
        title="JEE Ultimate 2.0 Design System"
        description="Tokens, components and patterns that make every page feel like JEE Ultimate 2.0, without making every page look the same."
        className="mb-heading-gap"
      />
      <DesignSystemShowcase />
    </PageShell>
  );
}
