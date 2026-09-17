"use client";

import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { colleges } from "@/data/colleges";
import { SUGGESTION_GROUPS, suggest, type Suggestion } from "@/lib/colleges/engine";
import { INSTITUTE_TYPES } from "@/lib/colleges/taxonomy";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";

const groupIcon: Record<Suggestion["kind"], IconName> = {
  college: "landmark",
  city: "map-pin",
  state: "compass",
  branch: "layers",
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onPick: (s: Suggestion) => void;
  size?: "lg" | "sm";
  placeholder?: string;
  className?: string;
};

/**
 * Combobox: type to see colleges, cities, states and branches.
 * Arrow keys move, Enter picks (or searches), Escape closes.
 */
export const CollegeSearch = forwardRef<HTMLInputElement, Props>(function CollegeSearch(
  { value, onChange, onSubmit, onPick, size = "lg", placeholder = "Search college, city, state, branch...", className },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const items = useMemo(() => suggest(colleges, value), [value]);
  const show = open && value.trim().length > 0;
  const lg = size === "lg";

  const pick = (s: Suggestion) => {
    onPick(s);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (items.length ? (i + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (items.length ? (i <= 0 ? items.length - 1 : i - 1) : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (show && active >= 0 && items[active]) pick(items[active]);
      else {
        onSubmit(value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      if (show) {
        e.preventDefault();
        setOpen(false);
      } else if (value) onChange("");
    }
  };

  return (
    <div className={cn("relative", show && "z-(--z-dropdown)", className)}>
      <div
        className={cn(
          "group flex items-center gap-3 bg-surface transition-[box-shadow] duration-(--duration-base) focus-within:ring-2 focus-within:ring-accent/60",
          lg
            ? "h-16 rounded-[1.4rem] pr-2.5 pl-5 shadow-[0_1px_2px_rgb(14_14_16/0.05),0_18px_40px_-20px_rgb(14_14_16/0.25)] ring-1 ring-line sm:h-[4.25rem]"
            : "h-11 rounded-full pr-1.5 pl-4 ring-1 ring-line",
        )}
      >
        <Icon name="search" className={cn("shrink-0 text-fg-muted", lg ? "size-5" : "size-4")} />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search colleges"
          aria-expanded={show}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={show && active >= 0 ? `${id}-${items[active]?.id}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-subtle [&::-webkit-search-cancel-button]:hidden",
            lg ? "text-[16px] sm:text-[17px]" : "text-[14px]",
          )}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="grid size-8 shrink-0 place-items-center rounded-full text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
          >
            <Icon name="close" className="size-4" />
          </button>
        )}
        {lg ? (
          <>
            <kbd className="hidden h-7 shrink-0 items-center rounded-md px-2 type-meta text-fg-subtle ring-1 ring-line md:inline-flex">
              /
            </kbd>
            <button
              type="button"
              onClick={() => onSubmit(value)}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-contrast px-4 type-button text-on-contrast shadow-button transition-transform active:scale-[0.97] sm:h-12 sm:px-5"
            >
              <span className="max-sm:sr-only">Search</span>
              <Icon name="arrow-right" className="size-4 sm:hidden" />
            </button>
          </>
        ) : (
          !value && (
            <kbd className="hidden h-6 shrink-0 items-center rounded-md px-1.5 type-meta text-fg-subtle ring-1 ring-line md:inline-flex">
              /
            </kbd>
          )
        )}
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.24, ease: ease.out } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            className={cn(
              "absolute inset-x-0 top-full mt-2 origin-top overflow-hidden rounded-3xl bg-surface p-2 text-left shadow-float ring-1 ring-line",
              !lg && "min-w-[20rem]",
            )}
          >
            <ul id={`${id}-list`} role="listbox" aria-label="Suggestions" className="max-h-[min(26rem,60vh)] overflow-y-auto overscroll-contain">
              {items.length === 0 && (
                <li className="px-3 py-6 text-center type-body-sm text-fg-muted" role="presentation">
                  No matches. Press Enter to search anyway.
                </li>
              )}
              {SUGGESTION_GROUPS.map((g) => {
                const groupItems = items.filter((i) => i.kind === g.kind);
                if (!groupItems.length) return null;
                return (
                  <li key={g.kind} role="presentation" className="pb-1">
                    <p className="flex items-center gap-2 px-3 pt-2 pb-1.5 type-label text-fg-subtle" aria-hidden>
                      <Icon name={groupIcon[g.kind]} className="size-3.5" />
                      {g.label}
                    </p>
                    <ul role="group" aria-label={g.label}>
                      {groupItems.map((s) => {
                        const index = items.indexOf(s);
                        const on = index === active;
                        return (
                          <li
                            key={s.id}
                            id={`${id}-${s.id}`}
                            role="option"
                            aria-selected={on}
                            onPointerMove={() => setActive(index)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => pick(s)}
                            className="relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2"
                          >
                            {on && (
                              <motion.span
                                layoutId={`${id}-active`}
                                transition={spring.hover}
                                className="absolute inset-0 rounded-2xl bg-fg/[0.05]"
                              />
                            )}
                            <span
                              className="relative grid size-8 shrink-0 place-items-center rounded-xl text-white"
                              style={{
                                background: s.kind === "college" ? INSTITUTE_TYPES[s.type].color : "var(--contrast)",
                              }}
                            >
                              {s.kind === "college" ? (
                                <span className="type-meta text-[9px]">{INSTITUTE_TYPES[s.type].label}</span>
                              ) : (
                                <Icon name={groupIcon[s.kind]} className="size-3.5" />
                              )}
                            </span>
                            <span className="relative min-w-0 flex-1">
                              <Highlight text={s.label} query={value} />
                              <span className="block truncate type-caption text-fg-muted">{s.hint}</span>
                            </span>
                            <Icon
                              name="arrow-up-right"
                              className={cn("relative size-4 shrink-0 text-fg-subtle transition-opacity", on ? "opacity-100" : "opacity-0")}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <p className="mt-1 hidden items-center gap-3 border-t border-line px-3 pt-2 pb-1 type-caption text-fg-subtle md:flex">
              <span>
                <kbd className="font-mono">↑↓</kbd> move
              </span>
              <span>
                <kbd className="font-mono">Enter</kbd> select
              </span>
              <span>
                <kbd className="font-mono">Esc</kbd> close
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <span className="block truncate type-body-sm font-semibold">{text}</span>;
  return (
    <span className="block truncate type-body-sm font-semibold">
      {text.slice(0, i)}
      <mark className="rounded-[4px] bg-accent-soft text-fg">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </span>
  );
}
