"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { careerRoles, careerStatus } from "@/data/career";
import { ease } from "@/lib/motion";

/**
 * Shown in place of the application form while recruiting hasn't opened.
 * A read-only "manifest" of the roles, each marked as opening soon.
 */
export function ApplicationsSoon() {
  return (
    <div className="glass-dark relative overflow-hidden rounded-panel p-6 md:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--cw-accent)" }}
      />
      {/* A slow scanning sheen across the panel */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent motion-reduce:hidden"
        animate={{ x: ["0%", "400%"] }}
        transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
      />

      <div className="relative">
        <p className="inline-flex items-center gap-3 rounded-full border border-line py-2 pr-4 pl-3">
          <span aria-hidden className="relative grid size-3 place-items-center">
            <span className="absolute size-3 animate-ping rounded-full bg-[var(--cw-spark)] opacity-40 motion-reduce:hidden" />
            <span className="size-2 rounded-full bg-[var(--cw-spark)] shadow-[0_0_12px_var(--cw-spark)]" />
          </span>
          <span className="type-pixel text-fg">{careerStatus.primary}</span>
        </p>

        <h3 className="mt-6 type-h3 text-fg">Applications open soon.</h3>
        <p className="mt-2 type-body text-fg-muted">
          There is nothing to fill in yet. When applications open, you’ll apply for these roles right here.
        </p>

        <ul className="mt-7 divide-y divide-line border-y border-line" aria-label="Roles opening soon">
          {careerRoles.map((role, i) => (
            <motion.li
              key={role.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.1 + i * 0.07 }}
              className="flex items-center gap-4 py-3.5"
              style={{ "--role": role.accent } as React.CSSProperties}
            >
              <span className="w-6 shrink-0 type-pixel text-[var(--role)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block type-body font-semibold text-fg">{role.title}</span>
                <span className="mt-0.5 block type-caption text-pretty text-fg-muted">{role.requirement}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 type-pixel text-[11px] text-fg-muted">
                <Icon name="lock" className="size-3" />
                <span className="max-sm:hidden">Opening soon</span>
                <span className="sm:hidden">Soon</span>
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span
            role="button"
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex h-13 cursor-not-allowed items-center gap-3 rounded-full border border-line-strong px-6 text-[15px] font-semibold text-fg-muted"
          >
            <Icon name="lock" className="size-4" />
            Recruiting soon
          </span>
          <p className="type-caption text-fg-muted">{careerStatus.network}</p>
        </div>
      </div>
    </div>
  );
}
