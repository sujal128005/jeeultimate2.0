"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, invalid, className, id, disabled, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;
  return (
    <label
      htmlFor={inputId}
      className={cn("group/check flex items-start gap-3", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}
    >
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={descId}
          className={cn(
            "peer size-5 appearance-none rounded-[6px] bg-surface shadow-[inset_0_0_0_1.5px_var(--line-strong)] transition-all duration-(--duration-fast)",
            "group-hover/check:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--fg)_35%,transparent)]",
            "checked:bg-contrast checked:shadow-none",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            "aria-invalid:shadow-[inset_0_0_0_1.5px_var(--danger)]",
          )}
          {...props}
        />
        <Icon
          name="check"
          strokeWidth={3}
          className="pointer-events-none absolute size-3 scale-50 text-on-contrast opacity-0 transition-all duration-(--duration-fast) ease-(--ease-spring) peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="type-body-sm font-medium text-fg">{label}</span>
        {description && (
          <span id={descId} className="type-caption text-fg-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
