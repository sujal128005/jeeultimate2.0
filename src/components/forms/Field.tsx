"use client";

import { createContext, useContext, useId } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

type FieldContextValue = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  disabled?: boolean;
  required?: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Props every control should spread so labels, hints and errors are
 * announced correctly. Works with or without a surrounding <Field>.
 */
export function useFieldControl(props: {
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
}) {
  const ctx = useContext(FieldContext);
  const fallbackId = useId();
  const invalid = props.invalid ?? ctx?.invalid ?? false;
  return {
    id: props.id ?? ctx?.id ?? fallbackId,
    "aria-describedby": [ctx?.describedBy, props["aria-describedby"]].filter(Boolean).join(" ") || undefined,
    "aria-invalid": invalid || undefined,
    disabled: props.disabled ?? ctx?.disabled,
    required: props.required ?? ctx?.required,
    invalid,
  };
}

type FieldProps = {
  label: string;
  /** Visually hide the label (still announced) */
  hideLabel?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Right-aligned text beside the label, e.g. a character count */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + hint/error, wired for assistive tech. */
export function Field({ label, hideLabel, hint, error, required, disabled, aside, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), disabled, required }}>
      <div className={cn("flex flex-col gap-2", disabled && "opacity-60", className)}>
        <div className={cn("flex items-baseline justify-between gap-3", hideLabel && "sr-only")}>
          <label htmlFor={id} className="type-body-sm font-medium text-fg">
            {label}
            {required && (
              <span aria-hidden className="ml-0.5 text-accent-text">
                *
              </span>
            )}
          </label>
          {aside && <span className="type-meta text-fg-muted">{aside}</span>}
        </div>
        {children}
        {error ? (
          <p id={errorId} className="flex items-center gap-1.5 type-caption text-danger">
            <Icon name="alert" className="size-3.5 shrink-0" />
            {error}
          </p>
        ) : (
          hint && (
            <p id={hintId} className="type-caption text-fg-muted">
              {hint}
            </p>
          )
        )}
      </div>
    </FieldContext.Provider>
  );
}

/** Shared control surface - used by Input, Select, Textarea, SearchField. */
export const controlSurface = cn(
  "w-full rounded-control bg-surface/80 text-fg shadow-[inset_0_0_0_1px_var(--line-strong)] backdrop-blur-sm",
  "placeholder:text-fg-subtle",
  "transition-[box-shadow,background-color] duration-(--duration-fast) ease-(--ease-out-soft)",
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_28%,transparent)]",
  "focus-within:bg-surface focus-within:shadow-[inset_0_0_0_1.5px_var(--focus-ring),0_0_0_4px_color-mix(in_oklch,var(--focus-ring)_18%,transparent)]",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-surface-2/70",
  "has-[[aria-invalid=true]]:shadow-[inset_0_0_0_1.5px_var(--danger)] has-[[aria-invalid=true]]:focus-within:shadow-[inset_0_0_0_1.5px_var(--danger),0_0_0_4px_color-mix(in_oklch,var(--danger)_16%,transparent)]",
);
