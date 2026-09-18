"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { team, type TeamMember } from "@/data/team";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const TILTS = [-1.8, 1.6, -0.9];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

/** Lucide dropped the brand marks, so these two are drawn here, same weight. */
function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden {...props}>
      <path d="M16 8.6a5.4 5.4 0 0 1 5.4 5.4v7h-3.8v-7a1.6 1.6 0 0 0-3.2 0v7h-3.8V9h3.8v1.5A4 4 0 0 1 16 8.6Z" />
      <rect x="2.6" y="9" width="3.8" height="12" rx="0.6" />
      <circle cx="4.5" cy="4.6" r="1.9" />
    </svg>
  );
}

/**
 * The crew, pinned to a board. A card can be dragged anywhere and lets go back
 * to its own place the moment you release it, so the page can never be left in
 * a mess. Dragging is off for reduced motion.
 */
export function TeamBoard() {
  const board = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [top, setTop] = useState<string | null>(null);

  if (team.length === 0) return null;

  return (
    <div ref={board} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-section bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--fg)_3%,transparent)_0_2px,transparent_2px_9px)] opacity-60"
      />
      <ul className="grid grid-cols-1 gap-5 pt-3 pb-6 lg:grid-cols-2">
        {team.map((member, i) => {
          // The two who started it sit side by side; anyone after keeps the
          // same card size and is centred on the row below.
          const centred = i >= 2;
          return (
            <motion.li
              key={member.id}
              drag={!reduced}
              dragSnapToOrigin
              dragElastic={0.16}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 220, bounceDamping: 24 }}
              onDragStart={() => setTop(member.id)}
              onDragEnd={() => setTop(null)}
              initial={{ opacity: 0, y: 24, rotate: TILTS[i % TILTS.length] }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, ease: ease.out, delay: (i % 6) * 0.07 }}
              whileHover={reduced ? undefined : { rotate: 0, y: -6, transition: { type: "spring", stiffness: 300, damping: 24 } }}
              whileDrag={{ scale: 1.03, rotate: 0, cursor: "grabbing" }}
              style={{ rotate: TILTS[i % TILTS.length], zIndex: top === member.id ? 20 : undefined }}
              className={cn(
                "relative min-w-0 touch-pan-y select-none",
                centred && "lg:col-span-2 lg:mx-auto lg:w-[calc(50%-0.625rem)]",
                !reduced && "cursor-grab active:cursor-grabbing",
              )}
            >
              <MemberCard member={member} index={i} />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function Tape() {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-[3px] bg-[color-mix(in_oklab,var(--ju-brand-200)_70%,white)] opacity-80 shadow-hairline"
    />
  );
}

/** The plate a photo will eventually sit in. Two flavours: warm, and wired. */
function Plate({ member }: { member: TeamMember }) {
  if (member.photo) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={member.photo}
        alt={member.name}
        className="size-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover/card:scale-[1.04]"
      />
    );
  }

  if (member.theme === "technical") {
    return (
      <span aria-hidden className="relative grid size-full place-items-center bg-surface-2">
        <span className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--fg)_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--fg)_7%,transparent)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <span className="absolute inset-x-0 top-[38%] h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--ju-brand-400)_60%,transparent),transparent)]" />
        <span className="absolute top-[38%] left-[38%] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        <span className="relative font-[family-name:var(--font-mono)] text-[1.75rem] leading-none font-medium tracking-[-0.04em] text-fg-2">
          {initials(member.name)}
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden className="relative grid size-full place-items-center bg-accent-soft text-accent-text">
      <span className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_0%,color-mix(in_oklab,var(--ju-brand-200)_40%,transparent),transparent_66%)]" />
      <span className="relative text-[2rem] leading-none font-semibold tracking-[-0.05em] opacity-70">
        {initials(member.name)}
      </span>
    </span>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const mono = member.theme === "technical";
  return (
    <article className="group/card relative flex h-full gap-5 rounded-card bg-surface p-5 shadow-card sm:gap-6 sm:p-6">
      <Tape />

      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:size-30">
        <Plate member={member} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          {member.tag && (
            <span
              className={cn(
                "rounded-full bg-surface-2 px-2.5 py-0.5 type-meta font-semibold text-fg-muted",
                mono && "font-[family-name:var(--font-mono)]",
              )}
            >
              {member.tag}
            </span>
          )}
          <span className={cn("type-meta text-fg-subtle", mono && "font-[family-name:var(--font-mono)]")}>0{index + 1}</span>
        </div>

        <h2 className="mt-2 truncate type-h4">{member.name}</h2>

        <p
          className={cn(
            "mt-0.5 flex flex-wrap items-center gap-x-2 type-caption text-accent-text",
            mono && "font-[family-name:var(--font-mono)]",
          )}
        >
          <span>{member.role}</span>
          {member.site && (
            <>
              <span aria-hidden className="text-fg-subtle">
                /
              </span>
              <a
                href={member.site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-fg-2 underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-text hover:decoration-accent"
              >
                {member.site.label}
                <Icon name="arrow-up-right" className="size-3" />
              </a>
            </>
          )}
        </p>

        <p className="mt-3 type-body-sm text-fg-muted">{member.blurb}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {member.instagram && (
            <a
              href={`https://www.instagram.com/${member.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 type-caption font-semibold ring-1 ring-line transition-colors hover:ring-line-strong"
            >
              <InstagramGlyph className="size-3.5" />
              <span className="truncate">@{member.instagram}</span>
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="grid size-8 place-items-center rounded-full text-fg-2 ring-1 ring-line transition-colors hover:text-fg hover:ring-line-strong"
            >
              <LinkedInGlyph className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
