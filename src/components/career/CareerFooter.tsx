import Link from "next/link";
import { WorldLink } from "@/components/motion/WorldTransition";
import { Icon } from "@/components/ui/Icon";
import { legalLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { MakerCredit } from "@/components/layout/MakerCredit";

export function CareerFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden px-gutter pt-10 pb-8">
      <p
        aria-hidden
        className="pointer-events-none text-center type-mega !text-[clamp(2.2rem,10.6vw,12.5rem)] whitespace-nowrap text-hollow opacity-60 select-none"
      >
        JEE Ultimate 2.0
      </p>
      <div className="mx-auto mt-8 flex max-w-page flex-col gap-6 border-t border-line pt-6 type-caption text-fg-muted md:flex-row md:items-center md:justify-between">
        <p className="order-3 md:order-1">
          © {year} {site.name}. Careers.
        </p>
        <div className="order-1 -ml-2 text-fg md:order-2 md:ml-0">
          <MakerCredit />
        </div>
        <ul className="order-2 flex flex-wrap items-center gap-x-6 gap-y-2 md:order-3">
          <li>
            <WorldLink href="/" world="site" className="group inline-flex items-center gap-1.5 text-fg transition-colors hover:text-[var(--cw-accent)]">
              <Icon name="home" className="size-3.5 transition-transform group-hover:-translate-y-px" />
              JEE Ultimate 2.0 home
            </WorldLink>
          </li>
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-fg">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
