import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { TeamBoard } from "@/components/team/TeamBoard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { socialLinks } from "@/data/navigation";
import { openSeats, team, teamHero, teamPrinciples } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people building JEE Ultimate 2.0: counsellors, editors and engineers working on honest JEE counselling guidance. Seats still open.",
  alternates: { canonical: "/team" },
};

const marquee = ["counsellors", "editors", "engineers", "mentors", "designers", "storytellers"];

export default function TeamPage() {
  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[620px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-34%] -left-20 h-[480px] w-[720px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ju-brand-300)_22%,transparent),transparent)]" />
        <div className="absolute top-[-10%] right-[-10%] h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ju-brand-200)_26%,transparent),transparent)]" />
      </div>

      <Container size="wide" className="relative pt-[120px] pb-4 md:pt-[150px]">
        <AnimatedSection>
          <p className="type-label text-fg-muted">{teamHero.eyebrow}</p>
          <h1 className="mt-6 type-h1">
            {teamHero.title.map((line, i) => (
              <span key={line} className={i === 1 ? "block text-accent-text" : "block"}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[38rem] type-body-lg text-fg-muted">{teamHero.lede}</p>
        </AnimatedSection>
      </Container>

      {/* A strip of what the crew is made of, sliding past */}
      <div aria-hidden className="relative my-8 overflow-hidden border-y border-line py-4">
        <div className="marquee-track flex w-max gap-10 pr-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-10">
              {marquee.map((word) => (
                <span key={word} className="inline-flex items-center gap-10 type-h4 text-fg-subtle">
                  {word}
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Section spacing="sm" id="board">
        <AnimatedSection className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="type-h3">The board</h2>
            <p className="mt-2 max-w-[34rem] type-body text-fg-muted">
              {team.length === 0
                ? `Names go up here as the crew is announced. Right now every card below is a seat we are filling, ${openSeats.length} of them.`
                : "The people on it, and the seats still open. Drag a card if you want to rearrange us."}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 type-caption text-fg-muted shadow-hairline">
            <Icon name="hand-heart" className="size-3.5" />
            Drag the cards
          </span>
        </AnimatedSection>
        <TeamBoard />
      </Section>

      <Section spacing="sm" id="how">
        <AnimatedSection>
          <h2 className="type-h3">How we work</h2>
        </AnimatedSection>
        <Stagger as="ul" className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {teamPrinciples.map((p) => (
            <StaggerItem as="li" key={p.id} className="min-w-0">
              <div className="flex h-full min-w-0 gap-4 rounded-card bg-surface p-6 shadow-hairline">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                  <Icon name={p.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="type-h4">{p.title}</h3>
                  <p className="mt-2 type-body-sm text-fg-muted">{p.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section spacing="sm">
        <AnimatedSection className="relative isolate overflow-hidden rounded-section bg-contrast p-8 text-on-contrast sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 -right-16 size-[26rem] rounded-full bg-accent opacity-25 blur-[110px]" />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[34rem]">
              <p className="type-label text-on-contrast/60">Want a seat?</p>
              <h2 className="mt-4 type-h2">The Career world has the full brief.</h2>
              <p className="mt-4 type-body text-on-contrast/70">
                Every open role, what the work actually is, and the talent network to join while applications open.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/career"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-on-contrast px-6 type-button text-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
                >
                  Enter Career
                  <Icon name="arrow-right" className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full px-6 type-button text-on-contrast ring-1 ring-on-contrast/25 hover:ring-on-contrast/50"
                >
                  Say hello
                </Link>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 type-caption font-semibold text-on-contrast/80 ring-1 ring-on-contrast/20 transition-colors hover:text-on-contrast hover:ring-on-contrast/45"
                  >
                    {s.label}
                    <Icon name="arrow-up-right" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </Section>
    </div>
  );
}
