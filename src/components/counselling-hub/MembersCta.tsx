import Link from "next/link";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { membersCta } from "@/data/counselling-hub";
import { site } from "@/data/site";

/** Section 13: why JEE Ultimate 2.0, with a link to member stories. */
export function MembersCta() {
  return (
    <AnimatedSection className="relative isolate overflow-hidden rounded-section bg-contrast px-6 py-14 text-on-contrast sm:px-12 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
        <p className="inline-flex items-center gap-2 type-label text-on-contrast/60">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {membersCta.eyebrow}
        </p>
        <h2 className="mt-6 type-h1 text-on-contrast">
          {membersCta.title}{" "}
          <span className="relative inline-grid size-[0.95em] translate-y-[0.08em] place-items-center align-baseline">
            <Icon
              name="heart"
              className="relative size-[0.8em] animate-[heartbeat_1.8s_ease-in-out_infinite] fill-[#ff4d6d] text-[#ff4d6d] drop-shadow-[0_0_18px_rgb(255_77_109/0.55)] motion-reduce:animate-none"
            />
          </span>
        </h2>
        <p className="mt-6 max-w-[36rem] type-body-lg text-on-contrast/65">{membersCta.body}</p>

        <ul className="mt-9 flex flex-wrap justify-center gap-2">
          {membersCta.points.map((p) => (
            <li
              key={p.text}
              className="inline-flex items-center gap-2 rounded-full bg-on-contrast/[0.07] px-4 py-2 type-body-sm text-on-contrast/80 ring-1 ring-on-contrast/10"
            >
              <Icon name={p.icon} className="size-4 text-accent-on-contrast" />
              {p.text}
            </li>
          ))}
        </ul>

        <Link
          href={membersCta.href}
          className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-accent-gradient pr-2 pl-7 text-[16px] font-semibold text-on-accent shadow-accent transition-transform active:scale-[0.97]"
        >
          {membersCta.label}
          <span className="grid size-10 place-items-center rounded-full bg-contrast text-on-contrast transition-transform duration-(--duration-base) group-hover:rotate-[-45deg]">
            <Icon name="arrow-right" className="size-4" />
          </span>
        </Link>
        <p className="mt-5 type-caption text-on-contrast/45">
          {site.name} · guiding JEE aspirants since {site.since}
        </p>
      </div>
    </AnimatedSection>
  );
}
