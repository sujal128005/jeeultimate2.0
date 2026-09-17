import Link from "next/link";
import { WorldLink } from "@/components/motion/WorldTransition";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { footerNav, legalLinks, socialLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { Logo } from "./Logo";
import { MakerCredit } from "./MakerCredit";

const footerLink = "type-body text-on-contrast/75 transition-colors duration-(--duration-fast) hover:text-on-contrast";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden bg-contrast text-on-contrast md:rounded-t-section">
      {/* A single warm light source - the only glow on the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[120px]"
      />

      <Container size="wide" className="relative pt-20 pb-32 md:pt-24 md:pb-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Brand block */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Logo tone="light" />
            <p className="max-w-[22rem] type-body text-on-contrast/60">
              Counselling and admission guidance for IITs, NITs, IIITs and GFTIs. Helping JEE aspirants turn a rank
              into the right decision since {site.since}.
            </p>
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 type-body font-medium text-on-contrast transition-colors hover:text-accent-on-contrast"
            >
              <Icon name="mail" className="size-4 text-accent-on-contrast" />
              Get in touch
              <Icon
                name="arrow-up-right"
                className="size-3.5 transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:col-span-8">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="type-label text-on-contrast/60">{group.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href === "/career" ? (
                        <WorldLink href={link.href} world="career" className={footerLink}>
                          {link.label}
                        </WorldLink>
                      ) : (
                        <Link href={link.href} className={footerLink}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <nav aria-label="Social">
              <h2 className="type-label text-on-contrast/60">Follow</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external && link.href !== "#" ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`group inline-flex items-center gap-1.5 ${footerLink}`}
                    >
                      {link.label}
                      <Icon
                        name="arrow-up-right"
                        className="size-3 text-on-contrast/40 transition-all duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-on-contrast"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden
          className="mt-20 bg-gradient-to-b from-on-contrast/[0.14] to-on-contrast/[0.02] bg-clip-text text-center text-[clamp(2.4rem,10.8vw,10.5rem)] leading-[0.85] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent select-none md:mt-24"
        >
          JEE Ultimate 2.0
        </p>

        <div className="mt-10 grid gap-5 border-t border-on-contrast/10 pt-6 type-caption text-on-contrast/60 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p className="order-3 lg:order-1">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="order-1 -ml-2 text-on-contrast/80 lg:order-2 lg:ml-0">
            <MakerCredit />
          </div>
          <ul className="order-2 flex items-center gap-6 lg:order-3 lg:justify-end">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-on-contrast">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
