"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Input, type InputProps } from "./Input";

type SearchFieldProps = Omit<InputProps, "type" | "leadingIcon" | "trailing"> & {
  onClear?: () => void;
  /** Keyboard hint shown when empty, e.g. "/" */
  shortcut?: string;
};

/** Search input with clear button. Controlled or uncontrolled. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { onClear, shortcut, value, defaultValue, onChange, className, ...props },
  ref,
) {
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : inner;

  return (
    <Input
      ref={ref}
      type="search"
      role="searchbox"
      leadingIcon="search"
      value={current}
      onChange={(event) => {
        if (value === undefined) setInner(event.target.value);
        onChange?.(event);
      }}
      className={cn("[&::-webkit-search-cancel-button]:appearance-none", className)}
      trailing={
        current ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              if (value === undefined) setInner("");
              onClear?.();
            }}
            className="grid size-8 place-items-center rounded-full text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
          >
            <Icon name="close" className="size-3.5" />
          </button>
        ) : shortcut ? (
          <kbd className="mr-2 grid h-6 min-w-6 place-items-center rounded-md border border-line-strong px-1.5 type-meta text-fg-muted">
            {shortcut}
          </kbd>
        ) : null
      }
      {...props}
    />
  );
});
