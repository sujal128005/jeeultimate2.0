import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { AnimatedSection, Stagger, StaggerItem } from "@/components/motion/AnimatedSection";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { contactLanes, problemTopics } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach JEE Ultimate 2.0 about a business proposal, a counselling question, a problem on the site, or joining the team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px]">
        <div className="bg-grid mask-radial absolute inset-0" />
        <div className="absolute top-[-30%] left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full glow-accent" />
      </div>

      <Container size="wide" className="relative pt-[112px] pb-2 md:pt-[136px]">
        <AnimatedSection>
          <p className="type-label text-fg-muted">Contact</p>
          <h1 className="mt-5 type-h2">Which one are you?</h1>
        </AnimatedSection>
      </Container>

      <Section spacing="sm">
        <Stagger as="ul" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {contactLanes.map((lane) => (
            <StaggerItem as="li" key={lane.id} className="min-w-0">
              <article className="flex h-full min-w-0 flex-col rounded-card bg-surface p-6 shadow-hairline sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
                    <Icon name={lane.icon} className="size-[18px]" />
                  </span>
                  <p className="min-w-0 type-caption font-semibold text-fg-subtle">{lane.who}</p>
                </div>

                <h2 className="mt-5 type-h4">{lane.title}</h2>
                <p className="mt-2.5 type-body-sm text-fg-muted">{lane.body}</p>

                {lane.id === "business" && (
                  <ContactForm
                    lane="business"
                    withFiles
                    messageLabel="What are you proposing"
                    placeholder="What you have in mind, who you are with, and what you would need from us."
                  />
                )}

                {lane.id === "counselling" && (
                  <ContactForm
                    lane="counselling"
                    messageLabel="Your question"
                    placeholder="Your rank, category and state help a lot here, but ask however you like."
                  >
                    <Link
                      href="/counselling-support"
                      className="group/cta inline-flex h-10 items-center gap-2 rounded-full px-4 type-caption font-semibold text-fg-2 ring-1 ring-line transition-colors hover:text-fg hover:ring-line-strong"
                    >
                      Open counselling support
                      <Icon name="arrow-right" className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                  </ContactForm>
                )}

                {lane.id === "correction" && (
                  <ContactForm
                    lane="correction"
                    withFiles
                    topics={problemTopics}
                    messageLabel="What happened"
                    placeholder="Which page, what it says, and what it should say. A screenshot helps more than anything."
                  />
                )}

                {lane.id === "join" && (
                  <div className="mt-auto pt-6">
                    <Link
                      href="/career"
                      className="group/cta inline-flex h-10 items-center gap-2 rounded-full bg-contrast px-5 type-caption font-semibold text-on-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) hover:-translate-y-0.5"
                    >
                      Enter Career
                      <Icon name="arrow-right" className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                    <p className="mt-4 flex items-start gap-2 type-caption text-fg-muted">
                      <Icon name="info" className="mt-px size-3.5 shrink-0 text-fg-subtle" />
                      Applications open through Career, not through email, so nothing gets lost.
                    </p>
                  </div>
                )}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </div>
  );
}
