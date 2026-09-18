"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { openSeats, team, type TeamMember } from "@/data/team";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

const TILTS = [-3.4, 2.6, -1.8, 3.2, -2.4, 1.6, -3, 2.2];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

/**
 * A pinboard of cards. Every card can be dragged around the board and stays
 * where it is dropped, which is the whole point: this page is a desk, not a
 * directory. Dragging is off for reduced motion, where the cards sit still.
 */
export function TeamBoard() {
  const board = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [top, setTop] = useState<string | null>(null);

  const cards = [
    ...team.map((m) => ({ kind: "member" as const, id: m.id, member: m })),
    ...openSeats.map((s) => ({ kind: "seat" as const, id: s.id, seat: s })),
  ];

  return (
    <div ref={board} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-section bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--fg)_3%,transparent)_0_2px,transparent_2px_9px)] opacity-60"
      />
      <ul className="grid grid-cols-1 gap-5 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.li
            key={card.id}
            drag={!reduced}
            dragConstraints={board}
            dragElastic={0.14}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 26 }}
            onDragStart={() => setTop(card.id)}
            initial={{ opacity: 0, y: 30, rotate: TILTS[i % TILTS.length] }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.55, ease: ease.out, delay: (i % 6) * 0.06 }}
            whileHover={reduced ? undefined : { rotate: 0, y: -6, transition: { type: "spring", stiffness: 300, damping: 24 } }}
            whileDrag={{ scale: 1.04, rotate: 0, cursor: "grabbing" }}
            style={{ rotate: TILTS[i % TILTS.length], zIndex: top === card.id ? 20 : undefined }}
            className={cn(
              "relative min-w-0 touch-pan-y select-none",
              !reduced && "cursor-grab active:cursor-grabbing",
            )}
          >
            {card.kind === "member" ? <MemberCard member={card.member} /> : <SeatCard seat={card.seat} />}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Tape() {
  return (
    <span
      aria-hidden
      className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-[3px] bg-[color-mix(in_oklab,var(--ju-brand-200)_70%,white)] opacity-80 shadow-hairline"
    />
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="relative flex h-full flex-col rounded-card bg-surface p-6 shadow-card">
      <Tape />
      <div className="flex items-center gap-4">
        {member.photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={member.photo} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span className="bg-accent-gradient grid size-16 shrink-0 place-items-center rounded-2xl type-h4 text-on-accent">
            {initials(member.name)}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate type-h4">{member.name}</h3>
          <p className="mt-0.5 type-caption text-accent-text">{member.role}</p>
        </div>
      </div>
      <p className="mt-5 type-body-sm text-fg-muted">{member.blurb}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {member.tag && <span className="rounded-full bg-surface-2 px-2.5 py-1 type-meta text-fg-muted">{member.tag}</span>}
        {member.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1 rounded-full px-3 type-caption font-semibold ring-1 ring-line hover:ring-line-strong"
          >
            {l.label}
            <Icon name="arrow-up-right" className="size-3.5" />
          </a>
        ))}
      </div>
    </article>
  );
}

function SeatCard({ seat }: { seat: (typeof openSeats)[number] }) {
  return (
    <article className="relative flex h-full flex-col rounded-card border border-dashed border-line-strong bg-surface/70 p-6">
      <Tape />
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-fg/[0.04] text-fg-muted">
          <Icon name={seat.icon} className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate type-h4 text-fg-2">{seat.role}</h3>
          <p className="mt-0.5 inline-flex items-center gap-1.5 type-caption text-fg-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Seat open
          </p>
        </div>
      </div>
      <p className="mt-5 type-body-sm text-fg-muted">{seat.note}</p>
      <Link
        href="/career"
        className="group/seat mt-auto inline-flex items-center gap-1.5 pt-6 type-caption font-semibold text-accent-text"
      >
        See the role
        <Icon name="arrow-right" className="size-3.5 transition-transform group-hover/seat:translate-x-0.5" />
      </Link>
    </article>
  );
}
