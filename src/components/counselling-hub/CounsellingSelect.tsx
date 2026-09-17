"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { counsellingProcesses } from "@/data/counselling";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import type { CounsellingSlug } from "@/types";

type Props = {
  /** Visible label above the control (also the accessible name) */
  label: string;
  hideLabel?: boolean;
  value: CounsellingSlug[];
  onChange: (value: CounsellingSlug[]) => void;
  multiple?: boolean;
  placeholder?: string;
  size?: "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Themed counselling picker (listbox). Each option carries its counselling's
 * colour. Single or multiple selection, full keyboard support:
 * arrows, Home/End, Enter/Space, Escape, Tab and type-ahead.
 */
export function CounsellingSelect({
  label,
  hideLabel,
  value,
  onChange,
  multiple = false,
  placeholder = "Select counselling",
  size = "md",
  tone = "light",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const options = counsellingProcesses;
  const selected = options.filter((o) => value.includes(o.slug));
  const dark = tone === "dark";

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    const frame = requestAnimationFrame(() => listRef.current?.focus({ preventScroll: true }));
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  const openMenu = (index?: number) => {
    const first = options.findIndex((o) => value.includes(o.slug));
    setActive(index ?? (first >= 0 ? first : 0));
    setOpen(true);
  };

  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus({ preventScroll: true });
  };

  const toggle = (slug: CounsellingSlug) => {
    if (multiple) {
      onChange(value.includes(slug) ? value.filter((v) => v !== slug) : options.map((o) => o.slug).filter((s) => s === slug || value.includes(s)));
    } else {
      onChange([slug]);
      close();
    }
  };

  const onListKey = (event: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        toggle(options[active].slug);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
      default: {
        const key = event.key.toLowerCase();
        if (key.length === 1) {
          const match = options.findIndex((o) => o.name.toLowerCase().startsWith(key));
          if (match >= 0) setActive(match);
        }
      }
    }
  };

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0].name
        : selected.map((s) => s.name).join(", ");

  return (
    <div ref={rootRef} className={cn("relative", open && "z-(--z-dropdown)", className)}>
      <p
        id={`${id}-label`}
        className={cn("mb-2 type-label", dark ? "text-on-contrast/55" : "text-fg-muted", hideLabel && "sr-only")}
      >
        {label}
      </p>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openMenu(event.key === "ArrowUp" ? options.length - 1 : undefined);
          }
        }}
        style={{ "--c": selected[0]?.theme.accent ?? "var(--accent)" } as React.CSSProperties}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl text-left transition-[box-shadow,background-color] duration-(--duration-base) ease-(--ease-out-soft)",
          size === "lg" ? "h-16 pr-4 pl-3" : "h-13 pr-3.5 pl-2.5",
          dark
            ? "bg-on-contrast/[0.06] text-on-contrast ring-1 ring-on-contrast/12 hover:bg-on-contrast/[0.1]"
            : "bg-surface text-fg shadow-soft ring-1 ring-line hover:ring-line-strong",
          open && (dark ? "ring-2 ring-on-contrast/40" : "ring-2 ring-[color-mix(in_oklab,var(--c)_55%,transparent)]"),
        )}
      >
        <span className={cn("relative flex shrink-0 items-center", size === "lg" ? "h-10" : "h-8")}>
          {selected.length === 0 ? (
            <span
              className={cn(
                "grid place-items-center rounded-xl",
                size === "lg" ? "size-10" : "size-8",
                dark ? "bg-on-contrast/10 text-on-contrast/70" : "bg-fg/[0.05] text-fg-muted",
              )}
            >
              <Icon name="compass" className="size-4.5" />
            </span>
          ) : (
            selected.map((s, i) => (
              <motion.span
                key={s.slug}
                layout
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring.toggle}
                className={cn(
                  "grid place-items-center rounded-xl text-white ring-2",
                  size === "lg" ? "size-10" : "size-8",
                  dark ? "ring-[#141417]" : "ring-surface",
                  i > 0 && "-ml-3",
                )}
                style={{ background: `linear-gradient(140deg, ${s.theme.accent}, ${s.theme.glow})`, zIndex: 10 - i }}
              >
                <Icon name={s.icon} className="size-4" />
              </motion.span>
            ))
          )}
        </span>
        <span className="min-w-0 flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={summary}
              id={`${id}-value`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.22, ease: ease.out }}
              className={cn(
                "block truncate font-semibold tracking-[-0.015em]",
                size === "lg" ? "text-[17px]" : "text-[15px]",
                selected.length === 0 && (dark ? "font-medium text-on-contrast/60" : "font-medium text-fg-muted"),
              )}
            >
              {summary}
            </motion.span>
          </AnimatePresence>
          {selected.length === 1 && size === "lg" && (
            <span className={cn("block truncate type-caption", dark ? "text-on-contrast/50" : "text-fg-muted")}>
              {selected[0].fullName}
            </span>
          )}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={spring.toggle}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full",
            dark ? "bg-on-contrast/10" : "bg-fg/[0.05]",
          )}
        >
          <Icon name="chevron-down" className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.34, ease: ease.expo } }}
            exit={{ opacity: 0, y: -6, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.16, ease: ease.in } }}
            className="absolute inset-x-0 top-full z-(--z-dropdown) mt-2 min-w-[17rem] origin-top overflow-hidden rounded-2xl bg-surface p-1.5 text-fg shadow-float ring-1 ring-line"
          >
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={`${id}-label`}
              aria-multiselectable={multiple || undefined}
              aria-activedescendant={`${id}-opt-${active}`}
              onKeyDown={onListKey}
              className="outline-none"
            >
              {options.map((option, index) => {
                const isSelected = value.includes(option.slug);
                const isActive = index === active;
                return (
                  <motion.li
                    key={option.slug}
                    id={`${id}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: ease.out, delay: 0.03 + index * 0.035 }}
                    onPointerMove={() => setActive(index)}
                    onClick={() => toggle(option.slug)}
                    style={{ "--c": option.theme.accent, "--ink": option.theme.ink } as React.CSSProperties}
                    className="relative flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5"
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`${id}-highlight`}
                        transition={spring.hover}
                        className="absolute inset-0 rounded-xl bg-[color-mix(in_oklab,var(--c)_9%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--c)_18%,transparent)]"
                      />
                    )}
                    <span
                      className="relative grid size-10 shrink-0 place-items-center rounded-xl text-white shadow-[0_6px_16px_-6px_var(--c)] transition-transform duration-(--duration-base) ease-(--ease-out-soft)"
                      style={{
                        background: `linear-gradient(140deg, ${option.theme.accent}, ${option.theme.glow})`,
                        transform: isActive ? "scale(1.06) rotate(-4deg)" : undefined,
                      }}
                    >
                      <Icon name={option.icon} className="size-4.5" />
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className="block font-semibold tracking-[-0.015em]">{option.name}</span>
                      <span className="block truncate type-caption text-fg-muted">{option.fullName}</span>
                    </span>
                    {size === "lg" && <span className="relative hidden type-meta text-fg-muted sm:block">{option.season}</span>}
                    <span
                      aria-hidden
                      className={cn(
                        "relative grid size-5.5 shrink-0 place-items-center rounded-full border transition-colors duration-(--duration-fast)",
                        isSelected ? "border-transparent bg-[var(--c)] text-white" : "border-line-strong text-transparent",
                        !multiple && !isSelected && "opacity-0",
                      )}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={spring.toggle}
                          >
                            <Icon name="check" className="size-3.5" strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
            {multiple && (
              <div className="mt-1 flex items-center justify-between gap-2 border-t border-line px-1.5 pt-2 pb-0.5">
                <button
                  type="button"
                  onClick={() => onChange(value.length === options.length ? [] : options.map((o) => o.slug))}
                  className="rounded-full px-3 py-1.5 type-caption font-medium text-fg-muted transition-colors hover:bg-fg/[0.05] hover:text-fg"
                >
                  {value.length === options.length ? "Clear all" : "Select all"}
                </button>
                <button
                  type="button"
                  onClick={() => close()}
                  className="rounded-full bg-contrast px-4 py-1.5 type-caption font-semibold text-on-contrast transition-transform active:scale-95"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
