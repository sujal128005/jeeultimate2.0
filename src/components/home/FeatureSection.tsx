import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { purpose } from "@/data/home";

/** "What We Are Here For" - the purpose statement. */
export function FeatureSection() {
  return (
    <section aria-labelledby="purpose-title" className="relative py-section">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <AnimatedSection className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow>Our purpose</Eyebrow>
              <h2
                id="purpose-title"
                className="mt-5 type-h2"
              >
                What we are
                <br className="hidden lg:block" /> here for
              </h2>
            </div>
          </AnimatedSection>

          <div className="lg:col-span-8">
            <ScrollRevealText
              text={purpose.statement}
              emphasis={purpose.emphasis}
              className="text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.22] font-medium tracking-[-0.03em] text-fg"
            />

            <Stagger as="ol" className="mt-heading-gap grid gap-8 sm:grid-cols-3 md:gap-6">
              {purpose.pillars.map((pillar) => (
                <StaggerItem as="li" key={pillar.step} className="border-t border-line-strong pt-6">
                  <span className="type-meta text-accent-text">{pillar.step}</span>
                  <h3 className="mt-3 type-h4">{pillar.title}</h3>
                  <p className="mt-2.5 type-body text-fg-muted">{pillar.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
