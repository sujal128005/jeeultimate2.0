import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { CounsellingExplorer } from "@/components/counselling/CounsellingExplorer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CounsellingSection() {
  return (
    <section id="counselling" aria-labelledby="counselling-title" className="relative py-section-sm md:py-32">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-canvas via-surface-2/70 to-canvas" />
      <Container size="wide" className="relative">
        <AnimatedSection className="mb-heading-gap flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="counselling-title"
            eyebrow="Counselling Support"
            title={
              <>
                Navigate your
                <br /> counselling
              </>
            }
            description="Four admission processes, one place to understand them. Choose the counselling you’re appearing for."
          />
          <Button href="/counselling-support" variant="glass" icon="arrow-right" className="self-start md:self-auto">
            All counselling support
          </Button>
        </AnimatedSection>

        <CounsellingExplorer />
      </Container>
    </section>
  );
}
