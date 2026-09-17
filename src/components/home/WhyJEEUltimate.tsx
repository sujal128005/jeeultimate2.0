import { FeatureCard } from "@/components/cards/Card";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { valuePoints } from "@/data/home";

/**
 * A single panel divided by hairlines - deliberately not six floating cards.
 */
export function WhyJEEUltimate() {
  return (
    <section id="why" aria-labelledby="why-title" className="py-section">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <AnimatedSection className="lg:col-span-6">
            <SectionHeading id="why-title" eyebrow="Why us" title="Why JEE Ultimate 2.0?" />
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <blockquote className="border-l-2 border-accent pl-5">
              <p className="type-lead text-fg">
                A rank is only half the story. The other half is knowing what to do with it.
              </p>
            </blockquote>
          </AnimatedSection>
        </div>

        <Stagger
          as="ul"
          step={0.06}
          className="mt-heading-gap grid overflow-hidden rounded-panel bg-surface/60 shadow-card sm:grid-cols-2 lg:grid-cols-3"
        >
          {valuePoints.map((point, index) => (
            <StaggerItem
              as="li"
              key={point.title}
              className="border-line p-card-pad transition-colors duration-(--duration-slow) hover:bg-surface max-sm:border-b max-sm:last:border-b-0 sm:max-lg:border-b sm:max-lg:odd:border-r sm:max-lg:[&:nth-last-child(-n+2)]:border-b-0 md:p-9 lg:border-b lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <FeatureCard icon={point.icon} title={point.title} index={index + 1}>
                {point.body}
              </FeatureCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
