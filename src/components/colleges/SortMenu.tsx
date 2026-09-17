"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SORTS, type SortKey } from "@/lib/colleges/engine";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

const hints: Record<SortKey, string> = {
  popularity: "Best JoSAA opening rank first",
  name: "A to Z",
  location: "By state, then city",
  fees: "Lowest fees first",
  cutoff: "Toughest CSE cutoff first",
};

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const keys = Object.keys(SORTS) as SortKey[];
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    const f = requestAnimationFrame(() => listRef.current?.focus({ preventScroll: true }));
    return () => {
      document.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(f);
    };
  }, [open]);

  const choose = (k: SortKey) => {
    onChange(k);
    setOpen(false);
    btnRef.current?.focus({ preventScroll: true });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => {
          setActive(keys.indexOf(value));
          setOpen((o) => !o);
        }}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full bg-surface pr-3 pl-3.5 type-nav ring-1 ring-line transition-colors hover:ring-line-strong",
          open && "ring-2 ring-accent/60",
        )}
      >
        <Icon name="scale" className="size-4 text-fg-muted" />
        <span className="text-fg-muted max-sm:hidden">Sort:</span>
        <span className="font-semibold">{SORTS[value]}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.toggle}>
          <Icon name="chevron-down" className="size-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label="Sort colleges"
            aria-activedescendant={`${id}-${keys[active]}`}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => (i + 1) % keys.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => (i - 1 + keys.length) % keys.length);
              } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                choose(keys[active]);
              } else if (e.key === "Escape" || e.key === "Tab") {
                setOpen(false);
              }
            }}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.24, ease: ease.out } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            className="absolute right-0 z-(--z-dropdown) mt-2 w-64 origin-top-right rounded-2xl bg-surface p-1.5 shadow-float ring-1 ring-line outline-none max-sm:left-0 max-sm:origin-top-left"
          >
            {keys.map((k, i) => (
              <li
                key={k}
                id={`${id}-${k}`}
                role="option"
                aria-selected={k === value}
                onPointerMove={() => setActive(i)}
                onClick={() => choose(k)}
                className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2"
              >
                {i === active && (
                  <motion.span layoutId={`${id}-hl`} transition={spring.hover} className="absolute inset-0 rounded-xl bg-fg/[0.05]" />
                )}
                <span className="relative min-w-0 flex-1">
                  <span className="block type-body-sm font-semibold">{SORTS[k]}</span>
                  <span className="block type-caption text-fg-muted">{hints[k]}</span>
                </span>
                {k === value && <Icon name="check" className="relative size-4 text-accent-text" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
