import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { ResultsBoard } from "@/components/results/ResultsBoard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { RESULTS_COLLECTED, RESULTS_ROUND, resultsBranches, resultsSummary } from "@/data/results";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Results and reviews",
  description:
    "Where our students were allotted seats in JoSAA 2026 Round 1, across IITs, NITs, IIITs and GFTIs, and what students and parents have said about the counselling.",
  alternates: { canonical: "/testimonials" },
};

const Stars = ({ count }: { count: number }) => (
  <span className="inline-flex gap-0.5" aria-label={`${count} out of 5`}>
    {Array.from({ length: count }, (_, i) => (
      <Icon key={i} name="asterisk" className="size-3.5 text-accent" />
    ))}
  </span>
);

export default function ResultsPage() {
  const s = resultsSummary;

  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-28%] left-1/2 h-[440px] w-[900px] -translate-x-1/2 rounded-full glow-accent" />
      </div>

      <Container size="wide" className="relative pt-[112px] pb-2 md:pt-[144px]">
        <AnimatedSection className="max-w-[46rem]">
          <p className="type-label text-fg-muted">Results</p>
          <h1 className="mt-6 type-h1">
            <span className="block">Where our students</span>
            <span className="block text-accent-text">actually landed.</span>
          </h1>
          <p className="mt-6 max-w-[40rem] type-body-lg text-fg-muted">
            Every seat below was reported to us by the student who got it, in our own {RESULTS_ROUND} result form.
            Nothing here is an estimate.
          </p>
        </AnimatedSection>
      </Container>

      <Section spacing="sm">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Told us their result", value: s.responses, sub: RESULTS_COLLECTED },
              { label: "Had a seat in Round 1", value: s.withSeat, sub: "of those who replied" },
              { label: "IITs", value: s.iit, sub: "students" },
              { label: "NITs", value: s.nit, sub: "students" },
              { label: "IIITs", value: s.iiit, sub: "students" },
              { label: "GFTIs and others", value: s.gfti, sub: "students" },
            ].map((tile) => (
              <div key={tile.label} className="rounded-card bg-surface p-5 shadow-hairline">
                <p className="type-meta tracking-[0.06em] text-fg-subtle uppercase">{tile.label}</p>
                <p className="mt-2 type-stat text-fg">{tile.value}</p>
                <p className="mt-1 type-caption text-fg-subtle">{tile.sub}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 flex max-w-[52rem] items-start gap-2 rounded-card bg-surface-2 px-4 py-3 type-body-sm text-fg-muted">
            <Icon name="info" className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
            <span>
              These are Round 1 numbers. {s.noSeatYet} of the {s.responses} who replied had no seat after Round 1, which
              is ordinary: JoSAA runs several more rounds and upgrades continue through them. We publish the round we
              have, not a final tally we cannot prove.
            </span>
          </p>
        </AnimatedSection>
      </Section>

      <Section spacing="sm">
        <AnimatedSection className="mb-6">
          <h2 className="type-h3">Institutes our students were allotted</h2>
          <p className="mt-2 max-w-[42rem] type-body text-fg-muted">
            The number beside an institute is how many of our students reported it, nothing more.
          </p>
        </AnimatedSection>
        <ResultsBoard />
      </Section>

      <Section spacing="sm">
        <AnimatedSection className="rounded-section bg-surface p-7 shadow-hairline sm:p-9">
          <h2 className="type-h4">Branches they were allotted</h2>
          <p className="mt-2 type-body-sm text-fg-muted">
            Across every institute above, in the words students used on the form.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {resultsBranches.map((b) => (
              <li key={b.name} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 type-caption text-fg-2">
                {b.name}
                <span className="type-meta text-fg-subtle">×{b.count}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </Section>

      <Section spacing="sm" id="reviews">
        <AnimatedSection className="mb-6">
          <h2 className="type-h3">In their words</h2>
          <p className="mt-2 max-w-[42rem] type-body text-fg-muted">
            Written by students and parents who went through counselling with us, published with their permission and
            not edited.
          </p>
        </AnimatedSection>

        <Stagger
          as="ul"
          className={cn(
            "grid grid-cols-1 gap-4",
            testimonials.length > 1 ? "lg:grid-cols-2" : "mx-auto max-w-[46rem]",
          )}
        >
          {testimonials.map((t) => (
            <StaggerItem as="li" key={t.id} className="min-w-0">
              <figure className="flex h-full min-w-0 flex-col rounded-card bg-surface p-6 shadow-hairline sm:p-8">
                <Stars count={t.stars} />
                {t.title && <h3 className="mt-4 type-h4">{t.title}</h3>}
                <blockquote className="mt-4 flex flex-col gap-3">
                  {t.body.map((para) => (
                    <p key={para.slice(0, 32)} className="type-body-sm text-fg-muted">
                      {para}
                    </p>
                  ))}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-7">
                  <span className="bg-accent-gradient grid size-10 shrink-0 place-items-center rounded-full type-caption font-semibold text-on-accent">
                    {t.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block type-body-sm font-semibold text-fg">{t.name}</span>
                    <span className="block type-caption text-fg-muted">
                      {t.college} · written by a {t.voice}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section spacing="sm">
        <AnimatedSection className="relative isolate overflow-hidden rounded-section bg-contrast p-8 text-on-contrast sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 -right-16 size-[26rem] rounded-full bg-accent opacity-25 blur-[110px]" />
          </div>
          <div className="max-w-[34rem]">
            <p className="type-label text-on-contrast/60">Your turn</p>
            <h2 className="mt-4 type-h2">Counselling decides where this list goes next.</h2>
            <p className="mt-4 type-body text-on-contrast/70">
              A rank opens a set of doors. Which one you walk through is a decision, and it is worth making it with
              someone who has seen a few hundred of them.
            </p>
            <Link
              href="/counselling-support"
              className="group/cta mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-on-contrast px-6 type-button text-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
            >
              Join counselling
              <Icon name="arrow-right" className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </div>
  );
}
