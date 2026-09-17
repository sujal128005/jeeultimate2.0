import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function ClosingCTA() {
  return (
    <section aria-labelledby="cta-title" className="pb-section-sm md:pb-32">
      <Container size="wide">
        <AnimatedSection className="relative isolate overflow-hidden rounded-2xl bg-surface-2 px-6 py-section-sm text-center shadow-hairline md:rounded-section md:py-28">
          <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
          <div
            aria-hidden
            className="absolute bottom-[-60%] left-1/2 -z-10 glow-accent-strong h-[520px] w-[900px] -translate-x-1/2 rounded-full"
          />
          <h2
            id="cta-title"
            className="mx-auto max-w-[14ch] type-h1 tracking-(--tracking-display)"
          >
            Rank is a number. <span className="text-accent-gradient">Strategy</span> is a choice.
          </h2>
          <p className="mx-auto mt-6 max-w-[30rem] type-body-lg text-fg-muted">
            Start with the counselling you’re appearing for, and make every round count.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/counselling-support" size="lg" icon="arrow-right" className="w-full sm:w-auto">
              Start with counselling
            </Button>
            <Button href="/contact" size="lg" variant="secondary" className="w-full sm:w-auto">
              Contact the team
            </Button>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
