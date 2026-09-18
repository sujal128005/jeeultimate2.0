"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { counsellingProcesses } from "@/data/counselling";

/**
 * One button, four doors. A student rarely joins "counselling" in the
 * abstract: they join JoSAA, or CSAB, or their state's. So the button asks
 * which one, and hands them straight to that enrolment.
 */
export function JoinCounselling({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        icon="arrow-right"
        onClick={() => setOpen(true)}
        className={className}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Join counselling
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Which counselling are you joining?"
        size="lg"
        className="max-h-[88dvh] overflow-y-auto"
      >
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {counsellingProcesses.map((p) => (
            <li key={p.slug} className="min-w-0">
              <Link
                href={`${p.href}#enrol`}
                onClick={() => setOpen(false)}
                style={{ "--c": p.theme.accent, "--g": p.theme.glow, "--ink": p.theme.ink } as React.CSSProperties}
                className="group/join relative flex h-full min-w-0 flex-col overflow-hidden rounded-card bg-surface p-5 shadow-hairline transition-[transform,box-shadow] duration-(--duration-base) ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-card"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_oklab,var(--c)_14%,transparent),transparent_62%)] opacity-0 transition-opacity duration-(--duration-slow) group-hover/join:opacity-100"
                />
                <span className="relative flex items-center gap-3">
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
                    style={{ background: `linear-gradient(140deg, ${p.theme.accent}, ${p.theme.glow})` }}
                  >
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block type-h4">{p.name}</span>
                    <span className="block truncate type-meta text-fg-muted">{p.fullName}</span>
                  </span>
                </span>
                <span className="relative mt-4 type-body-sm text-fg-muted">{p.summary}</span>
                <span className="relative mt-auto flex items-center justify-between gap-3 pt-5">
                  <span className="inline-flex items-center gap-1.5 type-meta text-fg-subtle">
                    <Icon name="calendar" className="size-3.5" />
                    {p.season}
                  </span>
                  <span className="inline-flex items-center gap-1 type-caption font-semibold text-[var(--ink)]">
                    Join
                    <Icon
                      name="arrow-right"
                      className="size-3.5 transition-transform duration-(--duration-base) group-hover/join:translate-x-0.5"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
