import Link from "next/link";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

const cards: { href: string; eyebrow: string; title: string; body: string; cta: string; icon: IconName; tint: string }[] = [
  {
    href: "/videos",
    eyebrow: "Watch",
    title: "Counselling, on screen.",
    body: "The newest long videos and Shorts from our YouTube channel, pulled in automatically.",
    cta: "Open videos",
    icon: "news",
    tint: "#ff0033",
  },
  {
    href: "/team",
    eyebrow: "Meet",
    title: "The crew behind it.",
    body: "Who builds this, how we work, and the seats we are still filling.",
    cta: "Meet the team",
    icon: "users",
    tint: "var(--accent)",
  },
];

/** Two doors on the home page: the video shelf and the people. */
export function WatchAndMeet() {
  return (
    <Section spacing="sm">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <AnimatedSection as="li" key={c.href} delay={i * 0.08} className="min-w-0">
            <Link
              href={c.href}
              style={{ "--t": c.tint } as React.CSSProperties}
              className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-section bg-surface p-7 shadow-hairline transition-[transform,box-shadow] duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-card sm:p-9"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_oklab,var(--t)_14%,transparent),transparent_62%)] opacity-0 transition-opacity duration-(--duration-slow) group-hover:opacity-100"
              />
              <span className="relative flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--t)_12%,transparent)] text-[var(--t)]">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="type-label text-fg-subtle">{c.eyebrow}</span>
              </span>
              <h3 className="relative mt-7 type-h3">{c.title}</h3>
              <p className="relative mt-3 max-w-[26rem] type-body text-fg-muted">{c.body}</p>
              <span className="relative mt-auto inline-flex items-center gap-2 pt-8 type-button">
                {c.cta}
                <span className="grid size-8 place-items-center rounded-full bg-contrast text-on-contrast transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:translate-x-0.5">
                  <Icon name="arrow-right" className="size-4" />
                </span>
              </span>
            </Link>
          </AnimatedSection>
        ))}
      </ul>
    </Section>
  );
}
