import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * JEE Ultimate 2.0 logo: the official badge plus a wordmark for legibility at small sizes.
 * The badge file lives in /public/brand (see `site.logoSrc`).
 */
export function Logo({
  tone = "dark",
  showWordmark = "always",
  className,
}: {
  tone?: "dark" | "light";
  /** "desktop" hides the wordmark below the xl breakpoint */
  showWordmark?: "always" | "desktop" | "never";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("group/logo inline-flex items-center gap-2.5 rounded-full", className)}
    >
      <LogoMark priority />
      {showWordmark !== "never" && (
        <Wordmark tone={tone} className={cn(showWordmark === "desktop" && "hidden xl:inline")} />
      )}
    </Link>
  );
}

export function Wordmark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "text-[17px] leading-none font-semibold tracking-[-0.035em] whitespace-nowrap",
        tone === "dark" ? "text-fg" : "text-on-contrast",
        className,
      )}
    >
      JEE <span className={tone === "dark" ? "text-fg-2" : "text-on-contrast/75"}>Ultimate</span>{" "}
      <span className={tone === "dark" ? "text-accent-text" : "text-accent-on-contrast"}>2.0</span>
    </span>
  );
}

/** The circular JEE Ultimate 2.0 badge. Size it with a `size-*` class. */
export function LogoMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block size-11 shrink-0 rounded-full shadow-[0_2px_6px_rgb(14_14_16/0.18),0_8px_18px_-8px_var(--shadow-accent-color)] transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/logo:rotate-[-8deg] group-hover/logo:scale-[1.04]",
        className,
      )}
    >
      <Image
        src={site.logoSrc ?? "/brand/jee-ultimate-2.0-logo.png"}
        alt=""
        fill
        sizes="(max-width: 768px) 64px, 96px"
        priority={priority}
        className="rounded-full object-contain"
      />
    </span>
  );
}
