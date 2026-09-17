import { careerRoles, careerStatus } from "@/data/career";
import { cn } from "@/lib/cn";

function Track({ items, className }: { items: string[]; className?: string }) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 md:px-10">{item}</span>
          <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0 md:size-4">
            <path d="M6 0v12M0 6h12M1.8 1.8l8.4 8.4M10.2 1.8l-8.4 8.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className={cn("flex w-max animate-marquee", className)}>
      {row}
      {row}
    </div>
  );
}

/**
 * Two crossing signal bands. Honest status, loud presentation.
 * Motion stops automatically under prefers-reduced-motion.
 */
export function SignalTicker() {
  const primary = [
    careerStatus.primary,
    ...careerRoles.map((r) => r.title),
    careerStatus.network,
  ];
  const secondary = ["Build with JEE Ultimate 2.0", "Since 2023", careerStatus.primary, "10,000+ students guided"];

  return (
    <section aria-label="Recruitment status" className="relative py-20 md:py-28">
      <p className="sr-only">
        {careerStatus.primary}. {careerStatus.network}.
      </p>
      <div aria-hidden className="relative h-28 md:h-40">
        <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] overflow-hidden bg-[color-mix(in_oklab,var(--cw-accent)_85%,black)] py-3 type-pixel text-[13px] text-[var(--cw-void)] opacity-80 transition-colors duration-[1.2s] md:py-4 md:text-base">
          <Track items={secondary} className="[--marquee-duration:55s] [animation-direction:reverse]" />
        </div>
        <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[2.5deg] overflow-hidden bg-[var(--cw-chrome)] py-4 type-pixel text-[15px] text-[var(--cw-void)] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] md:py-5 md:text-[22px]">
          <Track items={primary} className="[--marquee-duration:42s]" />
        </div>
      </div>
    </section>
  );
}
