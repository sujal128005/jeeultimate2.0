import Link from "next/link";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { counsellingProcesses } from "@/data/counselling";
import { hubHero } from "@/data/counselling-hub";

const fan = [
  "lg:-rotate-[14deg] lg:-translate-x-[118%] lg:translate-y-6 lg:group-hover/fan:-translate-x-[138%] lg:group-hover/fan:-rotate-[17deg]",
  "lg:-rotate-[5deg] lg:-translate-x-[40%] lg:group-hover/fan:-translate-x-[48%] lg:group-hover/fan:-rotate-[6deg]",
  "lg:rotate-[5deg] lg:translate-x-[40%] lg:group-hover/fan:translate-x-[48%] lg:group-hover/fan:rotate-[6deg]",
  "lg:rotate-[14deg] lg:translate-x-[118%] lg:translate-y-6 lg:group-hover/fan:translate-x-[138%] lg:group-hover/fan:rotate-[17deg]",
];

export function HubHero() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <AnimatedSection className="lg:col-span-6">
        <Eyebrow>{hubHero.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.9rem,7.4vw,5.6rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
          <span className="block">{hubHero.title[0]}</span>
          <span className="block text-accent-gradient">{hubHero.title[1]}</span>
        </h1>
        <p className="mt-7 max-w-[34rem] type-body-lg text-fg-2">{hubHero.body}</p>
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {hubHero.jumps.map((j, i) => (
              <li key={j.href}>
                <a
                  href={j.href}
                  className={
                    i === 0
                      ? "group inline-flex h-11 items-center gap-2 rounded-full bg-contrast pr-2 pl-5 type-button text-on-contrast shadow-button transition-transform active:scale-[0.97]"
                      : "inline-flex h-11 items-center rounded-full bg-surface px-4 type-button text-fg-2 shadow-hairline transition-colors hover:bg-surface-2 hover:text-fg"
                  }
                >
                  {j.label}
                  {i === 0 && (
                    <span className="grid size-7 place-items-center rounded-full bg-on-contrast/10 text-accent-on-contrast transition-transform group-hover:translate-y-0.5">
                      <Icon name="arrow-down" className="size-3.5" />
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </AnimatedSection>

      <AnimatedSection delay={0.15} className="lg:col-span-6">
        <div className="group/fan relative mx-auto grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:h-[26rem] lg:items-center lg:justify-center">
          {counsellingProcesses.map((p, i) => (
            <Link
              key={p.slug}
              href={p.href}
              style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
              className={`group/t relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[1.6rem] p-4 text-white shadow-[0_30px_60px_-30px_rgb(14_14_16/0.55)] ring-1 ring-white/20 transition-[transform,box-shadow] duration-700 ease-(--ease-out-soft) hover:z-10! hover:shadow-[0_40px_80px_-30px_rgb(14_14_16/0.6)] lg:absolute lg:w-[11.5rem] lg:p-5 lg:hover:-translate-y-4 ${fan[i]}`}
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{ background: `linear-gradient(155deg, ${p.theme.accent}, ${p.theme.glow})` }}
              />
              <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,rgb(255_255_255/0.35),transparent_50%)]" />
              <span aria-hidden className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(rgb(255_255_255)_1px,transparent_1px)] [background-size:12px_12px]" />
              <span className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
                  <Icon name={p.icon} className="size-4.5" />
                </span>
                <span className="type-meta text-white/80">{p.scope.split(" · ")[0]}</span>
              </span>
              <span>
                <span className="block text-[1.7rem] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap lg:text-[1.6rem]">{p.name}</span>
                <span className="mt-2 block type-caption text-white/80">{p.season}</span>
                <span className="mt-4 flex items-center justify-between border-t border-dashed border-white/35 pt-3 type-caption font-semibold">
                  Open
                  <Icon name="arrow-up-right" className="size-4 transition-transform duration-300 group-hover/t:translate-x-0.5 group-hover/t:-translate-y-0.5" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
